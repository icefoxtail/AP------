# lane10 · 2025 매산여고 2학기 기말 수학II 유사 심층 감사 (진행 중)

- status: **IN_PROGRESS**; sourceKey: `25_매산여고_2학기_기말_고2_수학II_유사`; nextQid: **Q06**; pending UPGRADE: 아직 미확정.
- sourcePath: `archive/exams/similar/high/h2/2final/25_매산여고_2학기_기말_고2_수학II_유사.js`; sourceRef: main; blob SHA: `430b7b5a0cf917de36837012b2e72486439ebef7`; standardCourse 수학II, 2015 교육과정, calculus1 대응.
- 총 23문항, 문항별 판정 5, KEEP 4 / UPGRADE 0 / HOLD 1 / UNREAD 18. Golden/Negative/시각 렌더/출고 NOT_RUN.

## Q01 — KEEP

- 문제: 함수 $f(x)=ax^2+bx$에 대하여  $f(2)=2$, $f'(-1)=-7$일 때, 상수 $a$, $b$에 대하여 $ab$의 값은? [3.5점]
- 보기: $-12$ / $-6$ / $-1$ / $6$ / $12$
- 정답: ②
- 기존 solution 원문:

```text
$f(x)=ax^2+bx$에서
$f'(x)=2ax+b$이다.
주어진 두 조건을 대입하면
$f(2)=4a+2b=2$, 즉 $2a+b=1$
$f'(-1)=-2a+b=-7$이다.
두 식을 더하면
$(2a+b)+(-2a+b)=1+(-7)$
$2b=-6,\quad b=-3$이다.
따라서 $2a=1-b=4$이므로 $a=2$이고
$ab=2\cdot(-3)=-6$이다.
따라서 정답은 ②이다.
```

- 판정 이유/검산: f(2)=4a+2b=2 ⇒2a+b=1, f'(−1)=−2a+b=−7 ⇒ b=−3,a=2,ab=−6. 두 연립식이 모두 전개되어 KEEP.

## Q02 — KEEP

- 문제: 정적분 $\displaystyle\int_0^6\left(\dfrac{1}{3}x-4\right)dx$의 값은? [3.5점]
- 보기: $-30$ / $-24$ / $-18$ / $-12$ / $-6$
- 정답: ③
- 기존 solution 원문:

```text
각 항을 적분하면 원시함수는
$\displaystyle\int\left(\dfrac13x-4\right)dx=\dfrac16x^2-4x+C$이다.
따라서 정적분은
$\displaystyle\int_0^6\left(\dfrac13x-4\right)dx$
$=\left[\dfrac16x^2-4x\right]_0^6$
$=\left(\dfrac16\cdot 6^2-4\cdot6\right)-\left(0-0\right)$
$=6-24=-18$이다.
따라서 정답은 ③이다.
```

- 판정 이유/검산: ∫₀⁶(x/3−4)dx=[x²/6−4x]₀⁶=6−24=−18. 원시함수와 대입 전개가 있어 KEEP.

## Q03 — HOLD / VISUAL_HOLD

- 문제: 곡선 $y=x^2-5x+4$와 $x$축으로 둘러싸인 도형의 넓이는? [3.6점]
- 보기: $\dfrac{9}{2}$ / $5$ / $\dfrac{11}{2}$ / $6$ / $\dfrac{13}{2}$
- 정답: ①
- 기존 solution 원문:

```text
먼저 $x$축과의 교점을 구한다.
$x^2-5x+4=(x-1)(x-4)=0$
$x=1,\ 4$이다.
이차함수는 위로 열린 포물선이므로 $1<x<4$에서 함수값이 음수이다.
따라서 둘러싸인 부분의 넓이 $S$는
$S=-\displaystyle\int_1^4(x^2-5x+4)dx$
$=-\left[\dfrac13x^3-\dfrac52x^2+4x\right]_1^4$
$=-\left\{\left(\dfrac{64}{3}-40+16\right)-\left(\dfrac13-\dfrac52+4\right)\right\}$
$=-\left(-\dfrac83-\dfrac{11}{6}\right)$
$=\dfrac{16}{6}+\dfrac{11}{6}=\dfrac92$이다.
따라서 정답은 ①이다.
```

- 판정 이유/검산: 교점 1,4이고 (1,4)에서 f<0. S=−∫₁⁴(x−1)(x−4)dx=9/2. 원본 SVG 실제 시각 렌더를 확인하지 못해 VISUAL_HOLD.
- 그림: `assets/images/25_매산여고_2학기_기말_고2_수학II_유사/q3-solution.svg`; 실제 SVG 렌더 미실행.

## Q04 — KEEP

- 문제: 수직선 위를 움직이는 점 $P$의 시각 $t$ $(t\ge0)$에서의 위치 $x$가  $x=-t^3+6t^2+15t-4$일 때, 점 $P$의 속도가 $0$이 되는 순간의 가속도는? [3.6점]
- 보기: $-24$ / $-18$ / $-12$ / $-6$ / $18$
- 정답: ②
- 기존 solution 원문:

```text
위치를 시간에 따라 미분하면 속도이다.
$x(t)=-t^3+6t^2+15t-4$
$v(t)=x'(t)=-3t^2+12t+15$
$=-3(t-5)(t+1)$이다.
$v(t)=0$인 시각은 $t=5$ 또는 $t=-1$인데, $t\ge0$이므로 $t=5$를 택한다.
가속도는 속도를 미분하여
$a(t)=v'(t)=-6t+12$이다.
따라서
$a(5)=-6\cdot5+12=-18$이다.
따라서 정답은 ②이다.
```

- 판정 이유/검산: v=−3(t−5)(t+1), t≥0이므로 t=5만 채택. a=−6t+12, a(5)=−18. 시간 정의역이 기존 풀이에 명시돼 KEEP.
- 그림: `assets/images/25_매산여고_2학기_기말_고2_수학II_유사/q4-solution.svg`; 실제 SVG 렌더 미실행.

## Q05 — KEEP

- 문제: 다항함수 $f(x)$에 대하여 함수 $g(x)$를 $g(x)=(x^2+2x-4)f(x)$라 하자. 곡선 $y=f(x)$ 위의 점 $(1,4)$에서 접선의 방정식이 $y=3x+1$일 때, $g'(1)$의 값은? [3.7점]
- 보기: $5$ / $9$ / $11$ / $13$ / $19$
- 정답: ④
- 기존 solution 원문:

```text
접점 $(1,4)$가 $y=f(x)$ 위에 있으므로
$f(1)=4$이다.
접선 $y=3x+1$의 기울기는 $3$이므로
$f'(1)=3$이다.
$g(x)=(x^2+2x-4)f(x)$를 곱의 미분법으로 미분하면
$g'(x)=(2x+2)f(x)+(x^2+2x-4)f'(x)$이다.
$x=1$을 대입하여
$g'(1)=(2+2)\cdot4+(1+2-4)\cdot3$
$=4\cdot4+(-1)\cdot3$
$=16-3=13$이다.
따라서 정답은 ④이다.
```

- 판정 이유/검산: f(1)=4,f'(1)=3, g'=(2x+2)f+(x²+2x−4)f', g'(1)=16−3=13. 접선 기울기·곱의 미분법이 명시돼 KEEP.

## 재개

- Q06~Q23은 아직 개별 심층 판정하지 않았음(UNREAD 18). 다음 실행은 이 시험지 Q06부터, 다음 시험지로 이동 금지.
- 운영 JS·SVG·main 변경 없음. 전체 core·Golden/Negative·preflight NOT_RUN.
