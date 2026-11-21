# 미적분Ⅰ(구 수학Ⅱ) 심층 감사 — 25_순천고_2학기_기말_고2_수학II

- 자료: 2025년 고2 2학기 기말 기출, `수학II` (교육과정 표기: `NOT_PRESENT`).
- 원본 JS: `archive/exams/original/high/h2/2final/25_순천고_2학기_기말_고2_수학II.js`; source ref `main`, blob `8de0f2e76f213e0a0f521b9f87741cd2b05bb579`.
- 문항 분모: **24**; 판정 **KEEP 20 / UPGRADE 0 / HOLD 4 / UNREAD 0**.
- 저장: `work/solution-upgrade-lane-10-20261121`의 `docs/operations/solution-upgrade-reservations/staged/calculus1/25_순천고_2학기_기말_고2_수학II_DEEP_AUDIT.md`. 동일 경로 파일 기존 없음 확인; 다른 브랜치의 중복 감사 문서는 NOT_CHECKED.
- 읽은 기준: 2026-11-21 `HARNESS_CURRENT.md`, `DEEP_QUESTION_AUDIT_TEMPLATE_CURRENT.md`, `BOARD_SOLUTION_SAMPLES_CURRENT.md`, `docs-manifest.json`의 core 문서 본문. 자동 preflight/문서 SHA-256 receipt·Golden/Negative 독립 검수: **NOT_RUN**. 운영 JS·정답·보기·SVG 수정 없음.
- 현재 단계: **EXAM_AUDIT_COMPLETE(전 문항 원문·해설 근거와 판정 수록)** / **EXAM_DRAFT_COMPLETE(UPGRADE 전체 수정 풀이 수록)** / **RELEASE_QA_NOT_RUN**. 남은 qid 판정 없음; HOLD는 후속 해결 필요.

## Q01 — KEEP

- source ordinal: 1; id: `1`; sourceIdentityKey: `NOT_PRESENT`; source blob: `8de0f2e76f213e0a0f521b9f87741cd2b05bb579`.
- 원본 문제 조건·보기(원문 보존):

```text
$x$축 위를 움직이는 점 $P$의 시각 $t$일 때의 좌표가<br>$x=t^3-3t^2-9t$, $t\ge 0$<br>이다. 점 $P$가 운동 방향을 바꾸는 시각에서 가속도는? [3.2점]
원본 보기: ["$-12$","$-6$","$3$","$6$","$12$"]
```

- 원본 정답: `⑤`.
- 기존 solution에서 확인한 실제 핵심 문장/식 (1~2곳):
> 위치함수를 미분하면 $v(t)=x'(t)=3t^2-6t-9$ $=3(t-3)(t+1)$이다.
> 가속도는 속도를 미분하여 $a(t)=v'(t)=6t-6$이고 $a(3)=6\cdot3-6=12$이다.
- 해설 경로·판정 이유·원본 값 대입 검산: 위치의 도함수 $v=3(t-3)(t+1)$가 양의 시각 $t=3$에서 음→양으로 변한다. 가속도 $a(3)=6\cdot3-6=12$다.
- 그림·추가 확인: 원본 solutionImage 링크가 있으나 SVG 렌더/학생 화면 독립 검사는 NOT_RUN.
- 상태: READ_EVIDENCED / RELEASE_QA_NOT_RUN.

## Q02 — KEEP

- source ordinal: 2; id: `2`; sourceIdentityKey: `NOT_PRESENT`; source blob: `8de0f2e76f213e0a0f521b9f87741cd2b05bb579`.
- 원본 문제 조건·보기(원문 보존):

```text
지면으로부터 $10\mathrm{m}$ 떨어진 건물 옥상에서 지면과 수직으로 위로 쏘아 올린 로켓의 $t$초 후의 속도 $v(t)$가 $v(t)=30-3t$일 때 이 로켓이 출발 이후 처음으로 이동 방향을 바꿀 때 지면으로부터의 높이는? (단, $0\le t\le 20$이고 이 로켓의 이동 경로는 출발 지점에서 지면과 수직으로 그은 반직선이고 속도의 단위는 $\mathrm{m/s}$이다.) [3.2점]
원본 보기: ["$80\\mathrm{m}$","$120\\mathrm{m}$","$160\\mathrm{m}$","$200\\mathrm{m}$","$240\\mathrm{m}$"]
```

- 원본 정답: `③`.
- 기존 solution에서 확인한 실제 핵심 문장/식 (1~2곳):
> $v(t)=30-3t=0$ $t=10$이다.
> 따라서 지면으로부터의 높이는 $10+150=160\mathrm{m}$이다.
- 해설 경로·판정 이유·원본 값 대입 검산: $v=30-3t$가 t=10에서 양→음으로 변한다. 초기 높이 10m와 정적분 150m를 합해 160m다.
- 그림·추가 확인: 원본 solutionImage 링크가 있으나 SVG 렌더/학생 화면 독립 검사는 NOT_RUN.
- 상태: READ_EVIDENCED / RELEASE_QA_NOT_RUN.

## Q03 — KEEP

- source ordinal: 3; id: `3`; sourceIdentityKey: `NOT_PRESENT`; source blob: `8de0f2e76f213e0a0f521b9f87741cd2b05bb579`.
- 원본 문제 조건·보기(원문 보존):

```text
함수 $f(x)$에 대하여<br>$\displaystyle\int\left\{\dfrac{d}{dx}f(x)\right\}dx=6x^3-7x+C$<br>가 성립하고 $f(1)=3$일 때, $f(2)$의 값은? (단, $C$는 적분상수이다.) [3.3점]
원본 보기: ["$30$","$34$","$38$","$42$","$46$"]
```

- 원본 정답: `③`.
- 기존 solution에서 확인한 실제 핵심 문장/식 (1~2곳):
> 주어진 부정적분 식에서 양변을 미분하면 $f'(x)=18x^2-7$이다.
> 그러므로 $f(2)=6\cdot 2^3-7\cdot2+4$ $=48-14+4=38$이다.
- 해설 경로·판정 이유·원본 값 대입 검산: $\int f'(x)dx=6x^3-7x+C$에서 $f'=18x^2-7$이고 초기값 $f(1)=3$으로 상수 4를 정한다. $f(2)=38$이다.
- 그림·추가 확인: 원본 문제 조건 텍스트로 계산 경로 확인. 학생 화면 렌더는 NOT_RUN.
- 상태: READ_EVIDENCED / RELEASE_QA_NOT_RUN.

## Q04 — KEEP

- source ordinal: 4; id: `4`; sourceIdentityKey: `NOT_PRESENT`; source blob: `8de0f2e76f213e0a0f521b9f87741cd2b05bb579`.
- 원본 문제 조건·보기(원문 보존):

```text
실수 $a$, $b$에 대해 함수 $f(x)=x^3+4x^2-ax+b$가 닫힌구간 $[0,2]$에서 감소하도록 하는 $a$의 값의 범위는? [3.5점]
원본 보기: ["$a\\le 16$","$a\\le 28$","$a\\ge 0$","$a\\ge 16$","$a\\ge 28$"]
```

- 원본 정답: `⑤`.
- 기존 solution에서 확인한 실제 핵심 문장/식 (1~2곳):
> $f'(x)=3x^2+8x-a$이다.
> $a=28$일 때도 $x<2$에서는 $f'(x)<0$이므로 포함된다.
- 해설 경로·판정 이유·원본 값 대입 검산: $f'=3x^2+8x-a$가 [0,2]에서 가장 큰 점은 2다. $f'(2)=28-a\le0$에서 $a\ge28$을 얻고 경계도 포함한다.
- 그림·추가 확인: 원본 solutionImage 링크가 있으나 SVG 렌더/학생 화면 독립 검사는 NOT_RUN.
- 상태: READ_EVIDENCED / RELEASE_QA_NOT_RUN.

## Q05 — KEEP

- source ordinal: 5; id: `5`; sourceIdentityKey: `NOT_PRESENT`; source blob: `8de0f2e76f213e0a0f521b9f87741cd2b05bb579`.
- 원본 문제 조건·보기(원문 보존):

```text
곡선 $y=-x^2+4x$와 직선 $y=2x$로 둘러싸인 도형의 넓이는? [3.5점]
원본 보기: ["$\\dfrac{4}{3}$","$2$","$\\dfrac{8}{3}$","$\\dfrac{10}{3}$","$4$"]
```

- 원본 정답: `①`.
- 기존 solution에서 확인한 실제 핵심 문장/식 (1~2곳):
> $-x^2+4x=2x$ $-x^2+2x=x(2-x)=0$ $x=0$ 또는 $x=2$이다.
> $S=\displaystyle\int_0^2\{(-x^2+4x)-2x\}\,dx$ $=\displaystyle\int_0^2(-x^2+2x)\,dx$ $=\left[-\dfrac{x^3}{3}+x^2\right]_0^2$ $=-\dfrac83+4=\dfrac43$이다.
- 해설 경로·판정 이유·원본 값 대입 검산: 두 함수 차가 $x(2-x)$이며 교점은 0,2다. 이 구간에서 양수이므로 넓이 $\int_0^2(-x^2+2x)dx=4/3$이다.
- 그림·추가 확인: 원본 solutionImage 링크가 있으나 SVG 렌더/학생 화면 독립 검사는 NOT_RUN.
- 상태: READ_EVIDENCED / RELEASE_QA_NOT_RUN.

## Q06 — KEEP

- source ordinal: 6; id: `6`; sourceIdentityKey: `NOT_PRESENT`; source blob: `8de0f2e76f213e0a0f521b9f87741cd2b05bb579`.
- 원본 문제 조건·보기(원문 보존):

```text
지상에서 똑바로 위를 향하여 속도 $30\mathrm{m/s}$로 던진 물체가 $t$초 후에 도달하는 높이를 $x\mathrm{m}$라고 하면<br>$x=30t-5t^2$<br>인 관계가 성립한다. 이 물체가 최고 지점에 도달했을 때 지면으로부터의 높이는? (단, $0\le t\le 6$) [3.6점]
원본 보기: ["$42$","$45$","$47$","$50$","$53$"]
```

- 원본 정답: `②`.
- 기존 solution에서 확인한 실제 핵심 문장/식 (1~2곳):
> $x(t)=30t-5t^2$ $v(t)=x'(t)=30-10t=10(3-t)$이다.
> 그때의 높이는 $x(3)=30\cdot3-5\cdot3^2$ $=90-45=45$이다.
- 해설 경로·판정 이유·원본 값 대입 검산: 높이 $30t-5t^2$의 도함수는 $10(3-t)$로 3에서 양→음으로 바뀐다. $x(3)=45$를 대입했다.
- 그림·추가 확인: 원본 solutionImage 링크가 있으나 SVG 렌더/학생 화면 독립 검사는 NOT_RUN.
- 상태: READ_EVIDENCED / RELEASE_QA_NOT_RUN.

## Q07 — HOLD

- source ordinal: 7; id: `7`; sourceIdentityKey: `NOT_PRESENT`; source blob: `8de0f2e76f213e0a0f521b9f87741cd2b05bb579`.
- 원본 문제 조건·보기(원문 보존):

```text
아래 그래프는 사차함수 $y=f(x)$의 도함수 $y=f'(x)$의 그래프이다. 보기에서 옳은 것만을 있는 대로 고른 것은? (단, $f'(1)=f'(2)=f'(3)=0$이다.) [3.7점]
원본 보기: ["ㄱ","ㄷ","ㄱ, ㄴ","ㄱ, ㄷ","ㄴ, ㄷ"]
```

- 원본 정답: `②`.
- 기존 solution에서 확인한 실제 핵심 문장/식 (1~2곳):
> 그림의 도함수 $f'(x)$는 $x=1,2,3$에서 $0$이다.
> $x=2$에서 $f'$가 양수에서 음수로 바뀐다.
- 해설 경로·판정 이유·원본 값 대입 검산: 원본 도함수 그래프에서 $1,2,3$의 부호 구간을 읽어 ㄷ만 참이라고 판정하는 해설이다. 그러나 q07.png의 실제 점·부호를 시각 판독하지 못해 HOLD다.
- 그림·추가 확인: VISUAL_HOLD: 원본 문제 이미지 `assets/images/25_순천고_2학기_기말_고2_수학II/q07.png`의 실제 수치·점·영역을 시각 판독하지 못했음. 그림 확인 후 정답·수식과 대조 필요.
- 상태: VISUAL_HOLD.

## Q08 — KEEP

- source ordinal: 8; id: `8`; sourceIdentityKey: `NOT_PRESENT`; source blob: `8de0f2e76f213e0a0f521b9f87741cd2b05bb579`.
- 원본 문제 조건·보기(원문 보존):

```text
함수 $f(x)=-2x^2+6x$에 대해 $\displaystyle\int_{-1}^{1}|f(x)|dx$의 값은? [3.7점]
원본 보기: ["$2$","$3$","$4$","$5$","$6$"]
```

- 원본 정답: `⑤`.
- 기존 solution에서 확인한 실제 핵심 문장/식 (1~2곳):
> $f(x)=-2x^2+6x=2x(3-x)$이므로 $[-1,0]$에서는 $f(x)\le0$이고 $[0,1]$에서는 $f(x)\ge0$이다.
> 따라서 $\displaystyle\int_{-1}^1|f(x)|\,dx$ $=-\displaystyle\int_{-1}^0f(x)\,dx+\int_0^1f(x)\,dx$ $=-\{F(0)-F(-1)\}+\{F(1)-F(0)\}$ $=\dfrac{11}{3}+\dfrac73=6$이다.
- 해설 경로·판정 이유·원본 값 대입 검산: 절댓값 적분의 부호 변경점 0을 기준으로 $[-1,0]$과 $[0,1]$을 나눈다. 각각 절댓값 적분이 $11/3,7/3$이므로 합 6이다.
- 그림·추가 확인: 원본 solutionImage 링크가 있으나 SVG 렌더/학생 화면 독립 검사는 NOT_RUN.
- 상태: READ_EVIDENCED / RELEASE_QA_NOT_RUN.

## Q09 — KEEP

- source ordinal: 9; id: `9`; sourceIdentityKey: `NOT_PRESENT`; source blob: `8de0f2e76f213e0a0f521b9f87741cd2b05bb579`.
- 원본 문제 조건·보기(원문 보존):

```text
함수 $f(x)$가 $f(x)=3x^2-4x+\displaystyle\int_0^1 2f(x)dx$를 만족시킬 때 $f(1)$의 값은? [3.9점]
원본 보기: ["$1$","$2$","$3$","$4$","$5$"]
```

- 원본 정답: `①`.
- 기존 solution에서 확인한 실제 핵심 문장/식 (1~2곳):
> 정적분 구간이 $0$부터 $1$까지 정해져 있으므로 $I=\displaystyle\int_0^1 2f(t)\,dt$라 놓으면 $I$는 상수이다.
> 따라서 $I=2$이고 $f(1)=3\cdot1^2-4\cdot1+2=1$이다.
- 해설 경로·판정 이유·원본 값 대입 검산: $I=\int_0^1 2f(t)dt$는 상수이며 원식을 대입한 식 $I=2I-2$에서 $I=2$가 나온다. 이때 $f(1)=1$이다.
- 그림·추가 확인: 원본 문제 조건 텍스트로 계산 경로 확인. 학생 화면 렌더는 NOT_RUN.
- 상태: READ_EVIDENCED / RELEASE_QA_NOT_RUN.

## Q10 — KEEP

- source ordinal: 10; id: `10`; sourceIdentityKey: `NOT_PRESENT`; source blob: `8de0f2e76f213e0a0f521b9f87741cd2b05bb579`.
- 원본 문제 조건·보기(원문 보존):

```text
점 $(-1,-2)$를 지나는 곡선 $y=f(x)$ 위의 임의의 점 $(x,f(x))$에서 접선의 기울기는 $6x^2-2x+3$이다. 이때, $f(2)$의 값은? [4.0점]
원본 보기: ["$16$","$18$","$20$","$22$","$24$"]
```

- 원본 정답: `④`.
- 기존 solution에서 확인한 실제 핵심 문장/식 (1~2곳):
> $f'(x)=6x^2-2x+3$이다.
> 따라서 $f(2)=2\cdot2^3-2^2+3\cdot2+4$ $=16-4+6+4=22$이다.
- 해설 경로·판정 이유·원본 값 대입 검산: $f'=6x^2-2x+3$을 적분하고 $f(-1)=-2$로 상수 4를 정한다. $f(2)=16-4+6+4=22$다.
- 그림·추가 확인: 원본 solutionImage 링크가 있으나 SVG 렌더/학생 화면 독립 검사는 NOT_RUN.
- 상태: READ_EVIDENCED / RELEASE_QA_NOT_RUN.

## Q11 — KEEP

- source ordinal: 11; id: `11`; sourceIdentityKey: `NOT_PRESENT`; source blob: `8de0f2e76f213e0a0f521b9f87741cd2b05bb579`.
- 원본 문제 조건·보기(원문 보존):

```text
닫힌구간 $[-2,2]$에서 함수 $f(x)=2x^3-3x^2-12x+a$의 최댓값을 $M$, 최솟값을 $m$이라고 하자. <br>$M+m=-23$일 때, 상수 $a$의 값은? [4.2점]
원본 보기: ["$-10$","$-5$","$5$","$10$","$15$"]
```

- 원본 정답: `②`.
- 기존 solution에서 확인한 실제 핵심 문장/식 (1~2곳):
> $f'(x)=6x^2-6x-12$ $=6(x+1)(x-2)$이다.
> $M+m=-23$이므로 $(a+7)+(a-20)=-23$ $2a-13=-23$ $2a=-10$ $a=-5$이다.
- 해설 경로·판정 이유·원본 값 대입 검산: $f'=6(x+1)(x-2)$의 부호와 끝점 후보 세 값 $a-4,a+7,a-20$을 비교한다. $M+m=2a-13=-23$에서 $a=-5$다.
- 그림·추가 확인: 원본 solutionImage 링크가 있으나 SVG 렌더/학생 화면 독립 검사는 NOT_RUN.
- 상태: READ_EVIDENCED / RELEASE_QA_NOT_RUN.

## Q12 — KEEP

- source ordinal: 12; id: `12`; sourceIdentityKey: `NOT_PRESENT`; source blob: `8de0f2e76f213e0a0f521b9f87741cd2b05bb579`.
- 원본 문제 조건·보기(원문 보존):

```text
$a\lt 1$인 정수 $a$에 대해 곡선 $y=x^2-2x+a$와 $x$축으로 둘러싸인 도형의 넓이가 $36$일 때 $a$의 값은? [4.2점]
원본 보기: ["$-10$","$-8$","$-6$","$-4$","$-2$"]
```

- 원본 정답: `②`.
- 기존 solution에서 확인한 실제 핵심 문장/식 (1~2곳):
> $y=x^2-2x+a$ $=(x-1)^2-(1-a)$이다.
> $1-a=d^2=9$에서 $a=-8$이다.
- 해설 경로·판정 이유·원본 값 대입 검산: $y=(x-1)^2-(1-a)$의 교점이 $1\pm d$이고 넓이 $4d^3/3=36$이다. $d=3$, 따라서 $a=1-9=-8$이다.
- 그림·추가 확인: 원본 solutionImage 링크가 있으나 SVG 렌더/학생 화면 독립 검사는 NOT_RUN.
- 상태: READ_EVIDENCED / RELEASE_QA_NOT_RUN.

## Q13 — KEEP

- source ordinal: 13; id: `13`; sourceIdentityKey: `NOT_PRESENT`; source blob: `8de0f2e76f213e0a0f521b9f87741cd2b05bb579`.
- 원본 문제 조건·보기(원문 보존):

```text
함수 $f(x)=\begin{cases}-x+1&(x\lt -1)\\x^2-x&(x\ge -1)\end{cases}$에 대해 닫힌구간 $[-2,2]$에서 $y=f(x)$의 그래프, $x=-2$, $x=2$, $x$축으로 둘러싸인 도형의 넓이를 $k$라고 할 때 $3k$의 값은? [4.2점]
원본 보기: ["$10$","$11$","$12$","$13$","$14$"]
```

- 원본 정답: `④`.
- 기존 solution에서 확인한 실제 핵심 문장/식 (1~2곳):
> $-2\le x<-1$에서 $f(x)=-x+1>0$, $-1\le x\le0$에서 $f(x)=x^2-x\ge0$, $0<x<1$에서 $f(x)=x^2-x<0$, $1\le x\le2$에서 $f(x)=x^2-x\ge0$이다.
> $3k=13$이므로 정답은 ④이다.
- 해설 경로·판정 이유·원본 값 대입 검산: 조각함수의 부호가 달라지는 -1,0,1을 경계로 네 적분을 계산한다. 값 $5/2,5/6,1/6,5/6$ 합은 $13/3$이고 $3k=13$이다.
- 그림·추가 확인: 원본 solutionImage 링크가 있으나 SVG 렌더/학생 화면 독립 검사는 NOT_RUN.
- 상태: READ_EVIDENCED / RELEASE_QA_NOT_RUN.

## Q14 — KEEP

- source ordinal: 14; id: `14`; sourceIdentityKey: `NOT_PRESENT`; source blob: `8de0f2e76f213e0a0f521b9f87741cd2b05bb579`.
- 원본 문제 조건·보기(원문 보존):

```text
곡선 $y=x^2$을 $x$축에 대하여 대칭이동한 후 $x$축의 방향으로 $2$만큼, $y$축의 방향으로 $4$만큼 평행이동한 곡선을 $y=f(x)$라 하자. 두 곡선 $y=x^2$, $y=f(x)$로 둘러싸인 도형의 넓이는? [4.3점]
원본 보기: ["$\\dfrac{8}{3}$","$\\dfrac{17}{6}$","$3$","$\\dfrac{19}{6}$","$\\dfrac{10}{3}$"]
```

- 원본 정답: `①`.
- 기존 solution에서 확인한 실제 핵심 문장/식 (1~2곳):
> 곡선 $y=x^2$을 $x$축에 대하여 대칭이동하면 $y=-x^2$이다.
> 둘러싸인 넓이는 $S=\displaystyle\int_0^2\{f(x)-x^2\}\,dx$ $=\displaystyle\int_0^2(-2x^2+4x)\,dx$ $=\left[-\dfrac23x^3+2x^2\right]_0^2$ $=-\dfrac{16}{3}+8=\dfrac83$이다.
- 해설 경로·판정 이유·원본 값 대입 검산: 대칭·평행이동한 곡선은 $f=-x^2+4x$이고 원래 $x^2$와의 교점은 0,2다. 차의 적분값 $8/3$을 확인했다.
- 그림·추가 확인: 원본 solutionImage 링크가 있으나 SVG 렌더/학생 화면 독립 검사는 NOT_RUN.
- 상태: READ_EVIDENCED / RELEASE_QA_NOT_RUN.

## Q15 — KEEP

- source ordinal: 15; id: `15`; sourceIdentityKey: `NOT_PRESENT`; source blob: `8de0f2e76f213e0a0f521b9f87741cd2b05bb579`.
- 원본 문제 조건·보기(원문 보존):

```text
$1\le x\le 5$일 때 $f(x)=x^2-6x+8$로 정의된 함수 $f(x)$가 모든 실수 $x$에 대해 $f(x+4)=f(x)$를 만족시킬 때 $\displaystyle\int_0^{27}f(x)dx$의 값은? [4.4점]
원본 보기: ["$10$","$\\dfrac{31}{3}$","$\\dfrac{32}{3}$","$11$","$\\dfrac{34}{3}$"]
```

- 원본 정답: `①`.
- 기존 solution에서 확인한 실제 핵심 문장/식 (1~2곳):
> 주기 조건 $f(x+4)=f(x)$에 따라 길이가 $4$인 구간의 정적분값은 모두 같다.
> 따라서 $\displaystyle\int_0^{27}f(x)\,dx$ $=6\cdot\dfrac43+2$ $=8+2=10$이다.
- 해설 경로·판정 이유·원본 값 대입 검산: 주기 4의 적분 $4/3$을 6번 더하고 남은 길이 3의 적분 2를 더한다. 실제 $[0,3]$를 $[4,5]$와 $[1,3]$으로 옮겨 정적분 10을 확인한다.
- 그림·추가 확인: 원본 solutionImage 링크가 있으나 SVG 렌더/학생 화면 독립 검사는 NOT_RUN.
- 상태: READ_EVIDENCED / RELEASE_QA_NOT_RUN.

## Q16 — HOLD

- source ordinal: 16; id: `16`; sourceIdentityKey: `NOT_PRESENT`; source blob: `8de0f2e76f213e0a0f521b9f87741cd2b05bb579`.
- 원본 문제 조건·보기(원문 보존):

```text
다음 그림과 같이 곡선 $f(x)=x(x-a)^2$이 $x$축과 만나는 두 점 중 원점 $O$가 아닌 점을 $A$라 하자. 이 곡선 위를 움직이는 점 $P(t,f(t))$에서 $x$축에 내린 수선의 발을 $H$라 할 때, 삼각형 $POH$의 넓이는 $t=p$에서 최댓값 $M$을 가진다. 이때, $\dfrac{M}{p}$의 값은? (단, $a\gt 0$이고, $0\lt t\lt a$이다.) [4.4점]
원본 보기: ["$\\dfrac{a^4}{8}$","$\\dfrac{a^3}{8}$","$\\dfrac{a^4}{16}$","$\\dfrac{a^3}{16}$","$\\dfrac{a^4}{32}$"]
```

- 원본 정답: `④`.
- 기존 solution에서 확인한 실제 핵심 문장/식 (1~2곳):
> 삼각형 $POH$에서 $OH=t$, $PH=f(t)=t(a-t)^2$이다.
> 따라서 $\dfrac Mp=\dfrac{a^4/32}{a/2}=\dfrac{a^3}{16}$이므로 정답은 ④이다.
- 해설 경로·판정 이유·원본 값 대입 검산: 삼각형 $POH$의 넓이 $S(t)=t^2(a-t)^2/2$에서 도함수 $t(a-t)(a-2t)$로 최대 t=a/2, 비 $a^3/16$을 구했다. 하지만 q16.png의 수선·점 A 배치와 높이 방향을 시각 판독하지 못해 HOLD다.
- 그림·추가 확인: VISUAL_HOLD: 원본 문제 이미지 `assets/images/25_순천고_2학기_기말_고2_수학II/q16.png`의 실제 수치·점·영역을 시각 판독하지 못했음. 그림 확인 후 정답·수식과 대조 필요.
- 상태: VISUAL_HOLD.

## Q17 — KEEP

- source ordinal: 17; id: `17`; sourceIdentityKey: `NOT_PRESENT`; source blob: `8de0f2e76f213e0a0f521b9f87741cd2b05bb579`.
- 원본 문제 조건·보기(원문 보존):

```text
사차함수 $g(x)$와 최고차항의 계수가 $1$인 삼차함수 $f(x)$가 $g'(x)=(x+3)f'(x)$를 만족하고 $g(x)$는 $x=0$에서만 극값을 가질 때 $f'(1)$의 값은? [4.5점]
원본 보기: ["$-12$","$-4$","$4$","$12$","$20$"]
```

- 원본 정답: `④`.
- 기존 solution에서 확인한 실제 핵심 문장/식 (1~2곳):
> 주어진 식은 $g'(x)=(x+3)f'(x)$이다.
> 그러므로 $f'(1)=3\cdot1\cdot(1+3)=12$이다.
- 해설 경로·판정 이유·원본 값 대입 검산: $g'=(x+3)f'$에서 -3은 부호가 바뀌지 않는 이중영점, 0은 단순영점이어야 한다. $f'=3x(x+3)$이고 $g'=3x(x+3)^2$로 조건을 역검산하여 $f'(1)=12$다.
- 그림·추가 확인: 원본 solutionImage 링크가 있으나 SVG 렌더/학생 화면 독립 검사는 NOT_RUN.
- 상태: READ_EVIDENCED / RELEASE_QA_NOT_RUN.

## Q18 — KEEP

- source ordinal: 18; id: `18`; sourceIdentityKey: `NOT_PRESENT`; source blob: `8de0f2e76f213e0a0f521b9f87741cd2b05bb579`.
- 원본 문제 조건·보기(원문 보존):

```text
두 다항함수 $f(x)$, $g(x)$가 다음 조건을 모두 만족시킬 때 $\displaystyle\int_0^2 t^2f(t)dt$의 값은? [4.7점]<br><b>&lt;조건&gt;</b><br><div class="question-table-wrap"><table class="question-table"><tbody><tr><td>(가) $\displaystyle\lim_{x\to2}\dfrac{\int_0^x(x-t)f(t)dt}{x-2}=5$</td></tr><tr><td>(나) $\displaystyle\lim_{x\to\infty}\dfrac{g(x)}{x^2+3x-6}=2$, $g(2)=g'(2)=0$</td></tr><tr><td>(다) $\displaystyle\int_0^2f(t)g(t)dt=10$</td></tr></tbody></table></div>
원본 보기: ["$5$","$15$","$25$","$35$","$45$"]
```

- 원본 정답: `③`.
- 기존 solution에서 확인한 실제 핵심 문장/식 (1~2곳):
> $H(x)=\displaystyle\int_0^x(x-t)f(t)\,dt$라 하자.
> 따라서 $I-20=5$, $I=25$이므로 정답은 ③이다.
- 해설 경로·판정 이유·원본 값 대입 검산: (가)에서 $H(2)=0,H'(2)=5$, 이어 $\int_0^2 tf=10$을 얻는다. (나)의 $g=2(t-2)^2$를 (다)에 대입하면 $\int_0^2t^2f=25$다.
- 그림·추가 확인: 원본 문제 조건 텍스트로 계산 경로 확인. 학생 화면 렌더는 NOT_RUN.
- 상태: READ_EVIDENCED / RELEASE_QA_NOT_RUN.

## Q19 — KEEP

- source ordinal: 19; id: `19`; sourceIdentityKey: `NOT_PRESENT`; source blob: `8de0f2e76f213e0a0f521b9f87741cd2b05bb579`.
- 원본 문제 조건·보기(원문 보존):

```text
함수 $f(x)=x^3+3x^2+4x+1$에 대하여 $f(x)$의 역함수를 $g(x)$라고 하자. 두 곡선 $y=f(x)$, $y=g(x)$와 $y=-x+1$로 둘러싸인 도형의 넓이는? [4.7점]
원본 보기: ["$\\dfrac{1}{4}$","$\\dfrac{1}{2}$","$1$","$\\dfrac{3}{2}$","$2$"]
```

- 원본 정답: `③`.
- 기존 solution에서 확인한 실제 핵심 문장/식 (1~2곳):
> 역함수의 그래프는 원래 함수의 그래프를 직선 $y=x$에 대하여 대칭이동한 것이므로, 전체 도형의 대칭성을 이용하면 역함수 자체를 적분하지 않고 넓이를 구할 수 있다.
> 전체 도형은 $y=x$에 대하여 대칭이므로 전체 넓이는 $2A=1$이다.
- 해설 경로·판정 이유·원본 값 대입 검산: $f$가 증가함수임을 $f'=3(x+1)^2+1>0$로 보이고, 역함수와 $x+y=1$의 y=x 대칭을 이용한다. 위쪽 반쪽 넓이 $1/4+1/4=1/2$를 두 배해 1이다.
- 그림·추가 확인: 원본 solutionImage 링크가 있으나 SVG 렌더/학생 화면 독립 검사는 NOT_RUN.
- 상태: READ_EVIDENCED / RELEASE_QA_NOT_RUN.

## Q20 — KEEP

- source ordinal: 20; id: `20`; sourceIdentityKey: `NOT_PRESENT`; source blob: `8de0f2e76f213e0a0f521b9f87741cd2b05bb579`.
- 원본 문제 조건·보기(원문 보존):

```text
최고차항의 계수가 $1$인 삼차함수 $f(x)$에 대하여 함수 $f(x)$는 다음 &lt;조건&gt;을 만족한다.<br><b>&lt;조건&gt;</b><br><div class="question-table-wrap"><table class="question-table"><tbody><tr><td>(가) 함수 $y=f'(x)$는 $x=-1$에서 최솟값을 갖는다.</td></tr><tr><td>(나) $f'(2)=0$</td></tr></tbody></table></div><br>함수 $g(x)=|f(x)-f(-1)|$이라고 할 때, $g(x)=f(-3)$의 서로 다른 실근의 개수가 $4$개라고 하자. 이때, $f(1)$의 값은? [4.8점]
원본 보기: ["$34$","$19$","$-6$","$-21$","$-38$"]
```

- 원본 정답: `⑤`.
- 기존 solution에서 확인한 실제 핵심 문장/식 (1~2곳):
> (가)에서 $f'$의 꼭짓점의 $x$좌표가 $-1$이므로 $f'(x)=3(x+1)^2+c$이다.
> 따라서 $f(1)=1+3-24-18=-38$이므로 정답은 ⑤이다.
- 해설 경로·판정 이유·원본 값 대입 검산: $f'=3(x+1)^2-27=3(x+4)(x-2)$에서 극값 ±54를 구한다. $|f-f(-1)|=f(-3)$의 근 4개 조건이 수평선 높이 54임을 확인하고 $C=-18,f(1)=-38$이다.
- 그림·추가 확인: 원본 solutionImage 링크가 있으나 SVG 렌더/학생 화면 독립 검사는 NOT_RUN.
- 상태: READ_EVIDENCED / RELEASE_QA_NOT_RUN.

## Q21 — KEEP

- source ordinal: 21; id: `21`; sourceIdentityKey: `NOT_PRESENT`; source blob: `8de0f2e76f213e0a0f521b9f87741cd2b05bb579`.
- 원본 문제 조건·보기(원문 보존):

```text
서답형 1. (서술형) 원점을 출발하여 수직선 위를 움직이는 점 $P$의 시각 $t$에서의 속도 $v(t)$가 $v(t)=t^3-3t^2+2t$일 때 점 $P$가 출발한 후 처음으로 $16$에 위치할 때까지 움직인 거리를 구하는 과정을 풀이 과정과 함께 서술하시오. [부분 점수 있음, 4점]
원본 보기: []
```

- 원본 정답: `$\dfrac{33}{2}$`.
- 기존 solution에서 확인한 실제 핵심 문장/식 (1~2곳):
> 속도를 인수분해하면 $v(t)=t^3-3t^2+2t=t(t-1)(t-2)$이다.
> 따라서 이동거리는 $\dfrac14+\dfrac14+16=\dfrac{33}{2}$이다.
- 해설 경로·판정 이유·원본 값 대입 검산: 속도 $t(t-1)(t-2)$에서 위치 $s=t^2(t-2)^2/4$를 적분한다. 16에 처음 도달하는 t=4까지 방향 구간별 거리 $1/4+1/4+16=33/2$다.
- 그림·추가 확인: 원본 solutionImage 링크가 있으나 SVG 렌더/학생 화면 독립 검사는 NOT_RUN.
- 상태: READ_EVIDENCED / RELEASE_QA_NOT_RUN.

## Q22 — KEEP

- source ordinal: 22; id: `22`; sourceIdentityKey: `NOT_PRESENT`; source blob: `8de0f2e76f213e0a0f521b9f87741cd2b05bb579`.
- 원본 문제 조건·보기(원문 보존):

```text
서답형 2. (서술형) 다항함수 $f(x)$와 삼차함수 $g(x)$가 다음 조건을 모두 만족시킬 때 $g'(-2)$의 최댓값을 구하는 과정을 풀이 과정과 함께 서술하시오. [부분 점수 있음, 6점]<br><b>&lt;조건&gt;</b><br><div class="question-table-wrap"><table class="question-table"><tbody><tr><td>(가) 모든 실수 $t$에 대해 $-74\le\displaystyle\int_{2t-4}^{2t}f'(x)dx\le74$</td></tr><tr><td>(나) 모든 실수 $x_1$, $x_2$에 대해 $x_1\ne x_2$면 $g(x_1)\ne g(x_2)$</td></tr><tr><td>(다) $g'(-3)=0$, $f'(1)+\displaystyle\int_0^1 3g'(x)dx=0$</td></tr></tbody></table></div>
원본 보기: []
```

- 원본 정답: `$\dfrac12$`.
- 기존 solution에서 확인한 실제 핵심 문장/식 (1~2곳):
> $\displaystyle\int_{2t-4}^{2t}f'(x)\,dx=f(2t)-f(2t-4)$이다.
> 이 함수들에서 $g'(-2)=\dfrac12$이므로 등호가 가능하다.
- 해설 경로·판정 이유·원본 값 대입 검산: (가)의 유계한 차 $f(2t)-f(2t-4)$는 f가 일차 이하임을 보장해 기울기 $|A|\le37/2$다. g'의 이중근 -3에서 $g'=C(x+3)^2$, 적분 조건으로 $A=-37C$이므로 최대 $C=1/2$가 구성 예로 달성된다.
- 그림·추가 확인: 원본 solutionImage 링크가 있으나 SVG 렌더/학생 화면 독립 검사는 NOT_RUN.
- 상태: READ_EVIDENCED / RELEASE_QA_NOT_RUN.

## Q23 — HOLD

- source ordinal: 23; id: `23`; sourceIdentityKey: `NOT_PRESENT`; source blob: `8de0f2e76f213e0a0f521b9f87741cd2b05bb579`.
- 원본 문제 조건·보기(원문 보존):

```text
서답형 3. (서술형) 함수 $f(x)$는 최고차항의 계수가 $1$인 삼차함수이다. 함수 $y=f'(x)$의 그래프가 아래 그림과 같을 때, 함수 $f(x)$의 극댓값이 $4$이다. 함수 $f(x)$를 구하는 과정을 풀이 과정과 함께 서술하시오. (단, $f'(0)=f'(2)=0$이다.) [부분 점수 있음, 4점]
원본 보기: []
```

- 원본 정답: `$f(x)=x^3-3x^2+4$`.
- 기존 solution에서 확인한 실제 핵심 문장/식 (1~2곳):
> 문제에서 $f'(0)=f'(2)=0$이고, 도함수 그래프가 위로 열린 포물선이므로 $f'(x)=3x(x-2)$ $=3x^2-6x$이다.
> 따라서 구하는 함수는 $f(x)=x^3-3x^2+4$이다.
- 해설 경로·판정 이유·원본 값 대입 검산: 도함수 그래프의 영점 0,2와 위로 열림을 이용해 $f'=3x(x-2)$, $f=x^3-3x^2+C$를 얻는다. 그러나 q23.png의 영점·축 방향을 직접 판독하지 못하여 HOLD다.
- 그림·추가 확인: VISUAL_HOLD: 원본 문제 이미지 `assets/images/25_순천고_2학기_기말_고2_수학II/q23.png`의 실제 수치·점·영역을 시각 판독하지 못했음. 그림 확인 후 정답·수식과 대조 필요.
- 상태: VISUAL_HOLD.

## Q24 — HOLD

- source ordinal: 24; id: `24`; sourceIdentityKey: `NOT_PRESENT`; source blob: `8de0f2e76f213e0a0f521b9f87741cd2b05bb579`.
- 원본 문제 조건·보기(원문 보존):

```text
서답형 4. (서술형) 함수 $f(x)=x^3-3x-2$의 그래프 개형을 그리는 과정을 다음 &lt;조건&gt;에 맞게 구체적으로 서술하여 구하시오. 또한, $x\gt 0$인 모든 실수 $x$에 대하여 $f(x)\ge k$인 실수 $k$의 최댓값을 구하는 과정을 풀이 과정과 함께 서술하시오. [부분 점수 있음, 6점]<br><b>&lt;조건&gt;</b><br><div class="question-table-wrap"><table class="question-table"><tbody><tr><td>① 도함수 $f'(x)$를 구하고 $f'(x)=0$인 $x$의 값을 구한다.</td></tr><tr><td>② $f'(x)$의 부호를 조사하여 함수 $f(x)$의 증가와 감소를 표로 나타내고, 함수 $f(x)$의 극대와 극소를 조사한다.</td></tr><tr><td>③ 함수 $y=f(x)$의 그래프와 $y$축의 교점의 좌표를 구한다.</td></tr><tr><td>④ 함수 $y=f(x)$의 그래프의 개형을 그린다.</td></tr></tbody></table></div>
원본 보기: []
```

- 원본 정답: `$-4$`.
- 기존 solution에서 확인한 실제 핵심 문장/식 (1~2곳):
> $f(x)=x^3-3x-2$ $f'(x)=3x^2-3$ $=3(x+1)(x-1)$이다.
> $f(x)\ge k$가 모든 $x>0$에서 성립하려면 $k\le-4$이고, $k=-4$도 가능하다.
- 해설 경로·판정 이유·원본 값 대입 검산: 발문이 증가·감소표와 실제 그래프 개형을 그리라고 명시한다. 기존 해설은 좌표 $(−1,0),(1,−4),(0,−2),(2,0)$와 부호표를 제시하지만 실제 학생용 그래프 자산이 없으므로 SVG_REQUEST/시각 HOLD로 인계한다. 함수 $f=(x+1)^2(x-2)$와 x>0 최솟값 -4의 수학은 확인된다.
- 그림·추가 확인: SVG_REQUEST / VISUAL_HOLD: 발문에서 그래프를 요구하나 학생용 완성 그래프의 엔진 산출·렌더가 없음. 원본 조건에 따른 그래프 사실만 인계, 직접 SVG 제작 금지.
- 상태: VISUAL_HOLD.

## 요약 및 후속 게이트

- 24 = KEEP 20 + UPGRADE 0 + HOLD 4 + UNREAD 0.
- 완성 대체 풀이 qid: 없음. HOLD qid: Q7, Q16, Q23, Q24.
- 원본 JS·content/choices/answer/solutionImage·SVG/main은 수정하지 않았음. 원본 문제 그림은 시각 미검수이며 신규 SVG 생성·출고 없음.
- 다음 체크: HOLD의 원문·그림 근거 보완, 학생용 변경 해설의 독립 수학·교육과정/Golden/Negative·문법/diff·실제 exam/sol/ans 렌더 테스트. 모두 NOT_RUN이므로 운영 PASS 아님.
