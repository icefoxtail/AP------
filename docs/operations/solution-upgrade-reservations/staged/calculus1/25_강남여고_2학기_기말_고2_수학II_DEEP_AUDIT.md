# 미적분Ⅰ(구 수학Ⅱ) 심층 감사 — 25_강남여고_2학기_기말_고2_수학II

- 자료: 2025년 고2 2학기 기말 기출, `수학II` (교육과정 표기: `NOT_PRESENT`).
- 원본 JS: `archive/exams/original/high/h2/2final/25_강남여고_2학기_기말_고2_수학II.js`; source ref `main`, blob `bf95293f599e08cbf004812d406d96c6e247190d`.
- 문항 분모: **25**; 판정 **KEEP 20 / UPGRADE 0 / HOLD 5 / UNREAD 0**.
- 저장: `work/solution-upgrade-lane-10-20261121`의 `docs/operations/solution-upgrade-reservations/staged/calculus1/25_강남여고_2학기_기말_고2_수학II_DEEP_AUDIT.md`. 동일 경로 파일 기존 없음 확인; 다른 브랜치의 중복 감사 문서는 NOT_CHECKED.
- 읽은 기준: 2026-11-21 `HARNESS_CURRENT.md`, `DEEP_QUESTION_AUDIT_TEMPLATE_CURRENT.md`, `BOARD_SOLUTION_SAMPLES_CURRENT.md`, `docs-manifest.json`의 core 문서 본문. 자동 preflight/문서 SHA-256 receipt·Golden/Negative 독립 검수: **NOT_RUN**. 운영 JS·정답·보기·SVG 수정 없음.
- 현재 단계: **EXAM_AUDIT_COMPLETE(전 문항 원문·해설 근거와 판정 수록)** / **EXAM_DRAFT_COMPLETE(UPGRADE 전체 수정 풀이 수록)** / **RELEASE_QA_NOT_RUN**. 남은 qid 판정 없음; HOLD는 후속 해결 필요.

## Q01 — KEEP

- source ordinal: 1; id: `1`; sourceIdentityKey: `NOT_PRESENT`; source blob: `bf95293f599e08cbf004812d406d96c6e247190d`.
- 원본 문제 조건·보기(원문 보존):

```text
함수 $f(x)=x^2-2x$에 대하여 닫힌구간 $[0,2]$에서 롤의 정리를 만족하는 상수 $c$의 값은? [3점]
원본 보기: ["$1$","$2$","$3$","$4$","$5$"]
```

- 원본 정답: `①`.
- 기존 solution에서 확인한 실제 핵심 문장/식 (1~2곳):
> 양 끝의 함수값을 구하면 $f(0)=0$ $f(2)=2^2-2\cdot2=0$ 따라서 롤의 정리에 의해 $0<c<2$인 $c$에서 $f'(c)=0$이다.
> $f'(x)=2x-2$ $f'(c)=2c-2=0$ $\Rightarrow c=1$ 실제로 $0<1<2$이므로 롤의 정리를 만족한다.
- 해설 경로·판정 이유·원본 값 대입 검산: 다항함수의 양끝 값 $f(0)=f(2)=0$과 연속·미분가능성으로 롤의 정리를 적용한다. $f'(c)=2c-2=0$은 c=1로 (0,2)에 포함된다.
- 그림·추가 확인: 원본 solutionImage 링크가 있으나 SVG 렌더/학생 화면 독립 검사는 NOT_RUN.
- 상태: READ_EVIDENCED / RELEASE_QA_NOT_RUN.

## Q02 — KEEP

- source ordinal: 2; id: `2`; sourceIdentityKey: `NOT_PRESENT`; source blob: `bf95293f599e08cbf004812d406d96c6e247190d`.
- 원본 문제 조건·보기(원문 보존):

```text
$\displaystyle\int_0^1(3x^2-4x+5)dx$의 값은? [3점]
원본 보기: ["$1$","$2$","$3$","$4$","$5$"]
```

- 원본 정답: `④`.
- 기존 solution에서 확인한 실제 핵심 문장/식 (1~2곳):
> $\displaystyle\int_0^1(3x^2-4x+5)\,dx$ $=\left[x^3-2x^2+5x\right]_0^1$ $=(1-2+5)-(0-0+0)$ $=4$ 따라서 정답은 ④이다.
- 해설 경로·판정 이유·원본 값 대입 검산: 원시함수 $x^3-2x^2+5x$에 1과 0을 대입하면 $4-0=4$다.
- 그림·추가 확인: 원본 문제 조건 텍스트로 계산 경로 확인. 학생 화면 렌더는 NOT_RUN.
- 상태: READ_EVIDENCED / RELEASE_QA_NOT_RUN.

## Q03 — KEEP

- source ordinal: 3; id: `3`; sourceIdentityKey: `NOT_PRESENT`; source blob: `bf95293f599e08cbf004812d406d96c6e247190d`.
- 원본 문제 조건·보기(원문 보존):

```text
수직선 위를 움직이는 점 $P$의 시각 $t$ $(t\ge 0)$에서의 속도 $v(t)$가<br>$v(t)=-t^2+10t$<br>이다. $t=a$에서 점 $P$의 가속도가 $0$일 때, 상수 $a$의 값은? [3점]
원본 보기: ["$3$","$4$","$5$","$6$","$7$"]
```

- 원본 정답: `③`.
- 기존 solution에서 확인한 실제 핵심 문장/식 (1~2곳):
> $v(t)=-t^2+10t$ $v'(t)=-2t+10$ $t=a$일 때 가속도가 $0$이므로 $v'(a)=-2a+10=0$ $2a=10$ $\Rightarrow a=5$ 주어진 시간 조건 $a\ge0$도 만족한다.
> 속도 그래프에서도 $t=5$에서 접선이 수평이므로 가속도가 $0$이다.
- 해설 경로·판정 이유·원본 값 대입 검산: 가속도는 $v'=-2t+10$이므로 $v'(a)=0$에서 a=5이고 t≥0 조건을 만족한다.
- 그림·추가 확인: 원본 solutionImage 링크가 있으나 SVG 렌더/학생 화면 독립 검사는 NOT_RUN.
- 상태: READ_EVIDENCED / RELEASE_QA_NOT_RUN.

## Q04 — KEEP

- source ordinal: 4; id: `4`; sourceIdentityKey: `NOT_PRESENT`; source blob: `bf95293f599e08cbf004812d406d96c6e247190d`.
- 원본 문제 조건·보기(원문 보존):

```text
함수 $f(x)$에 대하여 $\dfrac{d}{dx}\left\{\int f(x)dx\right\}=3x^2+x$일 때, $f(1)$의 값은? [3점]
원본 보기: ["$3$","$4$","$5$","$6$","$7$"]
```

- 원본 정답: `②`.
- 기존 solution에서 확인한 실제 핵심 문장/식 (1~2곳):
> $F(x)$를 $f(x)$의 한 부정적분이라 하면 $F'(x)=f(x)$이다.
> $\dfrac{d}{dx}\left\{\int f(x)\,dx\right\}=f(x)=3x^2+x$ 여기에 $x=1$을 대입하면 $f(1)=3\cdot1^2+1$ $=3+1$ $=4$ 따라서 정답은 ②이다.
- 해설 경로·판정 이유·원본 값 대입 검산: 부정적분의 미분은 피적분함수 $f$이므로 $f(x)=3x^2+x$가 직접 얻어진다. $f(1)=4$다.
- 그림·추가 확인: 원본 문제 조건 텍스트로 계산 경로 확인. 학생 화면 렌더는 NOT_RUN.
- 상태: READ_EVIDENCED / RELEASE_QA_NOT_RUN.

## Q05 — KEEP

- source ordinal: 5; id: `5`; sourceIdentityKey: `NOT_PRESENT`; source blob: `bf95293f599e08cbf004812d406d96c6e247190d`.
- 원본 문제 조건·보기(원문 보존):

```text
원점을 출발하여 수직선 위를 움직이는 점 $P$의 $t$초 후의 속도 $v(t)=6-2t$일 때, $t=5$일 때의 위치는? [3.5점]
원본 보기: ["$5$","$6$","$7$","$8$","$9$"]
```

- 원본 정답: `①`.
- 기존 solution에서 확인한 실제 핵심 문장/식 (1~2곳):
> 원점에서 출발하므로 $s(0)=0$이다.
> $0\le t\le3$에서 앞으로 이동한 거리: $\dfrac12\cdot3\cdot6=9$ $3\le t\le5$에서 뒤로 이동한 거리: $\dfrac12\cdot2\cdot4=4$ 따라서 위치는 $9-4=5$로, 적분 결과와 같다.
- 해설 경로·판정 이유·원본 값 대입 검산: 속도 적분 변위는 $\int_0^5(6-2t)dt=5$다. 전후진 구간별 거리 9와 4를 빼도 같은 위치 5가 된다.
- 그림·추가 확인: 원본 solutionImage 링크가 있으나 SVG 렌더/학생 화면 독립 검사는 NOT_RUN.
- 상태: READ_EVIDENCED / RELEASE_QA_NOT_RUN.

## Q06 — KEEP

- source ordinal: 6; id: `6`; sourceIdentityKey: `NOT_PRESENT`; source blob: `bf95293f599e08cbf004812d406d96c6e247190d`.
- 원본 문제 조건·보기(원문 보존):

```text
다음 정리는 평균값 정리이다.<br><div class="question-note-box">&lt;정리&gt;<br>함수 $f(x)$가 닫힌 구간 $[a,b]$에서 연속이고 열린 구간 $(a,b)$에서 미분가능할 때, $\dfrac{f(b)-f(a)}{b-a}=f'(c)$인 $c$가 $a$와 $b$사이에 적어도 하나 존재한다.</div>위의 내용에서 $f(x)=x^2-2x-1$이고 $a=0$, $b=3$일 때, 상수 $c$의 값은? [3.5점]
원본 보기: ["$1$","$\\dfrac{3}{2}$","$2$","$\\dfrac{5}{2}$","$\\dfrac{11}{4}$"]
```

- 원본 정답: `②`.
- 기존 solution에서 확인한 실제 핵심 문장/식 (1~2곳):
> $f(x)=x^2-2x-1$은 다항함수이므로 $[0,3]$에서 연속이고 $(0,3)$에서 미분가능하다.
> $f'(x)=2x-2$ $f'(c)=2c-2=1$ $2c=3\ \Rightarrow\ c=\dfrac32$ $0<\dfrac32<3$이므로 조건을 만족한다.
- 해설 경로·판정 이유·원본 값 대입 검산: 평균변화율 $(f(3)-f(0))/3=1$과 도함수 $f'(c)=2c-2$를 같게 한다. c=3/2는 구간 내부다.
- 그림·추가 확인: 원본 solutionImage 링크가 있으나 SVG 렌더/학생 화면 독립 검사는 NOT_RUN.
- 상태: READ_EVIDENCED / RELEASE_QA_NOT_RUN.

## Q07 — KEEP

- source ordinal: 7; id: `7`; sourceIdentityKey: `NOT_PRESENT`; source blob: `bf95293f599e08cbf004812d406d96c6e247190d`.
- 원본 문제 조건·보기(원문 보존):

```text
함수 $f(x)=-x^3+3x+1$의 극댓값을 $M$, 극솟값을 $m$이라 할 때, $M+m$의 값은? [3.5점]
원본 보기: ["$-2$","$-1$","$0$","$1$","$2$"]
```

- 원본 정답: `⑤`.
- 기존 solution에서 확인한 실제 핵심 문장/식 (1~2곳):
> $f(x)=-x^3+3x+1$ $f'(x)=-3x^2+3=-3(x+1)(x-1)$ $x<-1$에서 $f'(x)<0$이므로 감소한다.
> $m=f(-1)=1-3+1=-1$ $M=f(1)=-1+3+1=3$ $M+m=3+(-1)=2$ 따라서 정답은 ⑤이다.
- 해설 경로·판정 이유·원본 값 대입 검산: $f'=-3(x+1)(x-1)$가 -1에서 음→양, 1에서 양→음이므로 극솟값 -1, 극댓값 3의 합은 2다.
- 그림·추가 확인: 원본 solutionImage 링크가 있으나 SVG 렌더/학생 화면 독립 검사는 NOT_RUN.
- 상태: READ_EVIDENCED / RELEASE_QA_NOT_RUN.

## Q08 — HOLD

- source ordinal: 8; id: `8`; sourceIdentityKey: `NOT_PRESENT`; source blob: `bf95293f599e08cbf004812d406d96c6e247190d`.
- 원본 문제 조건·보기(원문 보존):

```text
원점을 출발하여 수직선 위를 움직이는 점 $P$의 시각 $t$ <br>$(0\le t\le 6)$에서의 속도 $v(t)$의 그래프가 그림과 같다. 점 $P$의 시각 $t=0$에서 $t=6$까지의 위치의 변화량을 $a$, 움직인 거리를 $b$라 할 때, $a+b$의 값은? [3.5점]
원본 보기: ["$2$","$3$","$4$","$5$","$6$"]
```

- 원본 정답: `③`.
- 기존 solution에서 확인한 실제 핵심 문장/식 (1~2곳):
> $0\le t\le4$의 아래쪽 넓이의 크기는 $S_-=\dfrac12\cdot2\cdot4+\dfrac12\cdot2\cdot4$ $=4+4=8$ $4\le t\le6$의 위쪽 넓이는 $S_+=\dfrac12\cdot1\cdot2+\dfrac12\cdot1\cdot2$ $=1+1=2$ 위치의 변화량은 부호를 포함하여 더하므로 $a=-S_-+S_+=-8+2=-6$ 움직인 거리는 넓이의 크기를 모두 더하므로 $b=S_-+S_+=8+2=10$ $a+b=-6+10=4$ 따라서 정답은 ③이다.
- 해설 경로·판정 이유·원본 값 대입 검산: 원본 속도 그래프의 음영 넓이 $S_-=8$, 양수 넓이 $S_+=2$로 변위 -6과 거리 10을 계산했다. 실제 q8.png의 눈금·부호·폭은 시각 확인하지 못했으므로 HOLD다.
- 그림·추가 확인: VISUAL_HOLD: 원본 문제 이미지 `assets/images/25_강남여고_2학기_기말_고2_수학II/q8.png`의 실제 수치·점·영역을 시각 판독하지 못했음. 그림 확인 후 정답·수식과 대조 필요.
- 상태: VISUAL_HOLD.

## Q09 — KEEP

- source ordinal: 9; id: `9`; sourceIdentityKey: `NOT_PRESENT`; source blob: `bf95293f599e08cbf004812d406d96c6e247190d`.
- 원본 문제 조건·보기(원문 보존):

```text
함수 $f(x)=x^3-2ax^2+ax$가 일대일함수가 되도록 하는 상수 $a$의 값의 범위는 $\alpha\le a\le\beta$이다. 이때, $\alpha+\beta$의 값은? [3.5점]
원본 보기: ["$0$","$\\dfrac{1}{4}$","$\\dfrac{1}{2}$","$\\dfrac{3}{4}$","$1$"]
```

- 원본 정답: `④`.
- 기존 solution에서 확인한 실제 핵심 문장/식 (1~2곳):
> $f(x)=x^3-2ax^2+ax$의 최고차항 계수가 양수이므로, 실수 전체에서 일대일함수가 되려면 함수가 계속 증가해야 한다.
> $\alpha=0,\quad\beta=\dfrac34$ $\alpha+\beta=0+\dfrac34=\dfrac34$ 따라서 정답은 ④이다.
- 해설 경로·판정 이유·원본 값 대입 검산: $f'=3x^2-4ax+a$가 실수 전체에서 음수 구간 없이 증가해야 한다. 판별식 $4a(4a-3)\le0$으로 $0\le a\le3/4$이고 경계는 도함수 0이 한 점뿐이라 단조성이 유지된다.
- 그림·추가 확인: 원본 solutionImage 링크가 있으나 SVG 렌더/학생 화면 독립 검사는 NOT_RUN.
- 상태: READ_EVIDENCED / RELEASE_QA_NOT_RUN.

## Q10 — KEEP

- source ordinal: 10; id: `10`; sourceIdentityKey: `NOT_PRESENT`; source blob: `bf95293f599e08cbf004812d406d96c6e247190d`.
- 원본 문제 조건·보기(원문 보존):

```text
방정식 $3x^3-9x-k=0$의 서로 다른 실근이 오직 $2$개가 되도록 하는 모든 실수 $k$의 값의 합은? [3.5점]
원본 보기: ["$-4$","$-3$","$-2$","$-1$","$0$"]
```

- 원본 정답: `⑤`.
- 기존 solution에서 확인한 실제 핵심 문장/식 (1~2곳):
> $h(x)=3x^3-9x-k$라 두면, 서로 다른 실근의 개수는 $y=h(x)$와 $x$축의 교점 개수이다.
> 따라서 모든 $k$의 값의 합은 $6+(-6)=0$ 따라서 정답은 ⑤이다.
- 해설 경로·판정 이유·원본 값 대입 검산: $h'=9(x+1)(x-1)$에서 y=0 접점은 x=-1 또는 1이어야 한다. 각각 k=6,-6이며 두 실근이 실제로 서로 다르고 합은 0이다.
- 그림·추가 확인: 원본 solutionImage 링크가 있으나 SVG 렌더/학생 화면 독립 검사는 NOT_RUN.
- 상태: READ_EVIDENCED / RELEASE_QA_NOT_RUN.

## Q11 — KEEP

- source ordinal: 11; id: `11`; sourceIdentityKey: `NOT_PRESENT`; source blob: `bf95293f599e08cbf004812d406d96c6e247190d`.
- 원본 문제 조건·보기(원문 보존):

```text
두 함수 $f(x)=x^3-x^2+3x+5$, $g(x)=4x+a$가 있다. $x\gt 0$인 모든 실수 $x$에 대하여 부등식 $f(x)\ge g(x)$가 성립할 때, 실수 $a$의 최댓값은? [4점]
원본 보기: ["$5$","$4$","$3$","$2$","$1$"]
```

- 원본 정답: `②`.
- 기존 solution에서 확인한 실제 핵심 문장/식 (1~2곳):
> 모든 $x>0$에서 $f(x)\ge g(x)$이므로 $h(x)=f(x)-g(x)$가 항상 $0$ 이상이어야 한다.
> $h(1)=1-1-1+5-a=4-a$ 모든 $x>0$에서 $h(x)\ge0$이 되려면 $4-a\ge0$ $\Rightarrow a\le4$ 실제로 $a=4$이면 $h(x)=x^3-x^2-x+1=(x-1)^2(x+1)\ge0\quad(x>0)$ 이므로 최댓값 $4$는 가능하다.
- 해설 경로·판정 이유·원본 값 대입 검산: 차함수 $h=x^3-x^2-x+5-a$의 최소는 x=1이므로 $a\le4$다. $a=4$에서 $(x-1)^2(x+1)\ge0$로 경계 실현도 증명된다.
- 그림·추가 확인: 원본 solutionImage 링크가 있으나 SVG 렌더/학생 화면 독립 검사는 NOT_RUN.
- 상태: READ_EVIDENCED / RELEASE_QA_NOT_RUN.

## Q12 — KEEP

- source ordinal: 12; id: `12`; sourceIdentityKey: `NOT_PRESENT`; source blob: `bf95293f599e08cbf004812d406d96c6e247190d`.
- 원본 문제 조건·보기(원문 보존):

```text
두 곡선 $y=x^2-2x$와 $y=-x^2+4x$로 둘러싸인 도형의 넓이는? [4점]
원본 보기: ["$3$","$5$","$7$","$9$","$11$"]
```

- 원본 정답: `④`.
- 기존 solution에서 확인한 실제 핵심 문장/식 (1~2곳):
> $x^2-2x=-x^2+4x$ $2x^2-6x=0$ $2x(x-3)=0$ $\Rightarrow x=0,\ 3$ $0<x<3$에서 $(-x^2+4x)-(x^2-2x)$ $=-2x^2+6x=2x(3-x)>0$ 따라서 이 구간에서는 $y=-x^2+4x$가 위쪽 곡선이다.
> 넓이를 $S$라 하면 $S=\displaystyle\int_0^3\{(-x^2+4x)-(x^2-2x)\}\,dx$ $=\displaystyle\int_0^3(-2x^2+6x)\,dx$ $=\left[-\dfrac23x^3+3x^2\right]_0^3$ $=(-18+27)-0$ $=9$ 따라서 정답은 ④이다.
- 해설 경로·판정 이유·원본 값 대입 검산: 두 곡선 차가 $2x(3-x)$로 (0,3)에서 양수다. 적분 $[-2x^3/3+3x^2]_0^3=9$를 얻었다.
- 그림·추가 확인: 원본 solutionImage 링크가 있으나 SVG 렌더/학생 화면 독립 검사는 NOT_RUN.
- 상태: READ_EVIDENCED / RELEASE_QA_NOT_RUN.

## Q13 — HOLD

- source ordinal: 13; id: `13`; sourceIdentityKey: `NOT_PRESENT`; source blob: `bf95293f599e08cbf004812d406d96c6e247190d`.
- 원본 문제 조건·보기(원문 보존):

```text
두 곡선 $y=f(x)$, $y=g(x)$가 다음 그림과 같고<br>$\displaystyle\int_{-2}^{0}f(x)dx=\dfrac{7}{2}$, $\displaystyle\int_{-2}^{1}f(x)dx=\dfrac{11}{2}$<br>$\displaystyle\int_{-2}^{1}g(x)dx=5$, $\displaystyle\int_{0}^{1}g(x)dx=\dfrac{8}{3}$<br>일 때, 두 곡선 $y=f(x)$, $y=g(x)$로 둘러싸인 도형의 넓이는? [4점]
원본 보기: ["$\\dfrac{3}{2}$","$\\dfrac{5}{3}$","$\\dfrac{11}{6}$","$2$","$\\dfrac{13}{6}$"]
```

- 원본 정답: `③`.
- 기존 solution에서 확인한 실제 핵심 문장/식 (1~2곳):
> 따라서 넓이는 $x=0$을 기준으로 나누어 구한다.
> 먼저 $[-2,0]$에서 필요한 $g(x)$의 정적분을 구하면 $\displaystyle\int_{-2}^0g(x)\,dx=\int_{-2}^1g(x)\,dx-\int_0^1g(x)\,dx$ $=5-\dfrac83=\dfrac73$ 첫 번째 넓이는 $S_1=\displaystyle\int_{-2}^0\{f(x)-g(x)\}\,dx$ $=\dfrac72-\dfrac73=\dfrac76$  다음으로 $[0,1]$에서 필요한 $f(x)$의 정적분은 $\displaystyle\int_0^1f(x)\,dx=\int_{-2}^1f(x)\,dx-\int_{-2}^0f(x)\,dx$ $=\dfrac{11}2-\dfrac72=2$ 두 번째 넓이는 $S_2=\displaystyle\int_0^1\{g(x)-f(x)\}\,dx$ $=\dfrac83-2=\dfrac23$  전체 넓이는 $S=S_1+S_2=\dfrac76+\dfrac46=\dfrac{11}6$ 따라서 정답은 ③이다.
- 해설 경로·판정 이유·원본 값 대입 검산: 그림에서 -2~0은 f가 위, 0~1은 g가 위라는 정보로 넓이를 두 부분으로 나눈다. 원본 q13.png를 시각 판독하지 못했으므로 상하 관계의 그림 검증이 남아 HOLD다.
- 그림·추가 확인: VISUAL_HOLD: 원본 문제 이미지 `assets/images/25_강남여고_2학기_기말_고2_수학II/q13.png`의 실제 수치·점·영역을 시각 판독하지 못했음. 그림 확인 후 정답·수식과 대조 필요.
- 상태: VISUAL_HOLD.

## Q14 — KEEP

- source ordinal: 14; id: `14`; sourceIdentityKey: `NOT_PRESENT`; source blob: `bf95293f599e08cbf004812d406d96c6e247190d`.
- 원본 문제 조건·보기(원문 보존):

```text
삼차함수 $f(x)$가 모든 실수 $x$에 대하여 $f(-x)=-f(x)$를 만족시킨다.<br>$\displaystyle\int_{-1}^{1}x^2f'(x)dx=8$<br>이고 $f'(1)=18$일 때, $f(-1)$의 값은? [4점]
원본 보기: ["$-10$","$-8$","$-6$","$-4$","$-2$"]
```

- 원본 정답: `②`.
- 기존 solution에서 확인한 실제 핵심 문장/식 (1~2곳):
> $f(-x)=-f(x)$이므로 삼차함수 $f(x)$는 홀수 차수의 항만 갖는다.
> $\displaystyle\int_{-1}^{1}x^2f'(x)\,dx$ $=\displaystyle\int_{-1}^{1}(3px^4+qx^2)\,dx$ $=3p\cdot\dfrac25+q\cdot\dfrac23$ $=\dfrac65p+\dfrac23q=8$ 양변에 $15$를 곱하면 $18p+10q=120$ ②  ①에 $10$을 곱하면 $30p+10q=180$이므로 $(30p+10q)-(18p+10q)=180-120$ $12p=60\ \Rightarrow\ p=5$ $q=18-3\cdot5=3$ 따라서 $f(x)=5x^3+3x$이고 $f(-1)=-5-3=-8$ 따라서 정답은 ②이다.
- 해설 경로·판정 이유·원본 값 대입 검산: 홀함수 삼차식은 $px^3+qx$이고 $3p+q=18$, $6p/5+2q/3=8$을 연립한다. $p=5,q=3$, 따라서 $f(-1)=-8$이다.
- 그림·추가 확인: 원본 문제 조건 텍스트로 계산 경로 확인. 학생 화면 렌더는 NOT_RUN.
- 상태: READ_EVIDENCED / RELEASE_QA_NOT_RUN.

## Q15 — KEEP

- source ordinal: 15; id: `15`; sourceIdentityKey: `NOT_PRESENT`; source blob: `bf95293f599e08cbf004812d406d96c6e247190d`.
- 원본 문제 조건·보기(원문 보존):

```text
미분가능한 함수 $f(x)$가 닫힌구간 $[1,4]$에 속하는 모든 $x$에 대하여 $f'(x)\ge 4$이다. $f(1)=-3$일 때, $f(4)$의 최솟값은? [4점]
원본 보기: ["$5$","$6$","$7$","$8$","$9$"]
```

- 원본 정답: `⑤`.
- 기존 solution에서 확인한 실제 핵심 문장/식 (1~2곳):
> 어떤 $c\in(1,4)$에서 $\dfrac{f(4)-f(1)}{4-1}=f'(c)$ 가 성립한다.
> 또 $f(4)=16-7=9$이므로 주어진 조건을 만족하면서 하한을 갖는다.
- 해설 경로·판정 이유·원본 값 대입 검산: 평균값 정리로 $(f(4)+3)/3\ge4$여서 $f(4)\ge9$다. $f(x)=4x-7$로 하한을 달성하는 것도 확인했다.
- 그림·추가 확인: 원본 solutionImage 링크가 있으나 SVG 렌더/학생 화면 독립 검사는 NOT_RUN.
- 상태: READ_EVIDENCED / RELEASE_QA_NOT_RUN.

## Q16 — HOLD

- source ordinal: 16; id: `16`; sourceIdentityKey: `NOT_PRESENT`; source blob: `bf95293f599e08cbf004812d406d96c6e247190d`.
- 원본 문제 조건·보기(원문 보존):

```text
다음 표는 사차함수 $f(x)$의 증가와 감소를 나타낸 것이다.<br><img src="assets/images/25_강남여고_2학기_기말_고2_수학II/q16.png" alt="16번 증가와 감소 표" style="max-width:100%;height:auto;"><br>방정식 $f(x)=9$이 서로 다른 세 실근을 갖도록 상수 $a$의 값을 정할 때, 모든 $a$의 값의 합은? [4.5점]
원본 보기: ["$1$","$2$","$3$","$4$","$5$"]
```

- 원본 정답: `①`.
- 기존 solution에서 확인한 실제 핵심 문장/식 (1~2곳):
> 따라서 $x=-1$에서 극소: $f(-1)=a-21$ $x=1$에서 극대: $f(1)=a+11$ $x=2$에서 극소: $f(2)=a+6$ 이다.
> 따라서 가능한 값은 $a=-2,\ 3$이고 그 합은 $-2+3=1$ 따라서 정답은 ①이다.
- 해설 경로·판정 이유·원본 값 대입 검산: 원본 증감표를 바탕으로 극소 높이 a-21,a+6과 극대 높이 a+11을 써 a=-2,3을 도출했다. 그러나 표의 실제 수치·기호를 확인하지 못하여 HOLD다.
- 그림·추가 확인: VISUAL_HOLD: 원본 문제 이미지 `assets/images/25_강남여고_2학기_기말_고2_수학II/q16.png`의 실제 수치·점·영역을 시각 판독하지 못했음. 그림 확인 후 정답·수식과 대조 필요.
- 상태: VISUAL_HOLD.

## Q17 — KEEP

- source ordinal: 17; id: `17`; sourceIdentityKey: `NOT_PRESENT`; source blob: `bf95293f599e08cbf004812d406d96c6e247190d`.
- 원본 문제 조건·보기(원문 보존):

```text
다항함수 $f(x)$에 대하여 $\displaystyle\int_0^2f(x)dx=2$일 때, $\displaystyle\sum_{k=1}^{25}\int_{2k}^{2k+2}f(x-2k)dx$의 값은? [4.5점]
원본 보기: ["$44$","$46$","$48$","$50$","$52$"]
```

- 원본 정답: `④`.
- 기존 solution에서 확인한 실제 핵심 문장/식 (1~2곳):
> $F'(x)=f(x)$인 다항함수 $F(x)$를 잡는다.
> 따라서 구하는 합은 $\displaystyle\sum_{k=1}^{25}\int_{2k}^{2k+2}f(x-2k)\,dx$ $=\underbrace{2+2+\cdots+2}_{25}$ $=25\cdot2=50$ 따라서 정답은 ④이다.
- 해설 경로·판정 이유·원본 값 대입 검산: 적분 $[2k,2k+2]$에서 변수 치환 $u=x-2k$를 하면 모든 항이 $\int_0^2 f(u)du=2$다. 25항 합은 50이다.
- 그림·추가 확인: 원본 solutionImage 링크가 있으나 SVG 렌더/학생 화면 독립 검사는 NOT_RUN.
- 상태: READ_EVIDENCED / RELEASE_QA_NOT_RUN.

## Q18 — KEEP

- source ordinal: 18; id: `18`; sourceIdentityKey: `NOT_PRESENT`; source blob: `bf95293f599e08cbf004812d406d96c6e247190d`.
- 원본 문제 조건·보기(원문 보존):

```text
함수 $f(x)=-x^3+kx^2-12x+1$이 있다. $x_1\ne x_2$인 모든 실수 $x_1$, $x_2$에 대하여 부등식<br>$x_1+x_2\gt\dfrac{f(x_1)-f(x_2)}{x_1-x_2}$<br>가 성립하도록 하는 정수 $k$의 값의 범위는 $\alpha\le k\le\beta$이다. 이때 $\alpha+\beta$의 값은? [4.5점]
원본 보기: ["$2$","$3$","$4$","$5$","$6$"]
```

- 원본 정답: `①`.
- 기존 solution에서 확인한 실제 핵심 문장/식 (1~2곳):
> $f(x)=-x^3+kx^2-12x+1$에서 $\dfrac{f(x_1)-f(x_2)}{x_1-x_2}$ $=-(x_1^2+x_1x_2+x_2^2)+k(x_1+x_2)-12$ 따라서 주어진 부등식은 $x_1^2+x_1x_2+x_2^2+(1-k)(x_1+x_2)+12>0$ ① 이다.
> $(1-k)^2\le36$ $-6\le1-k\le6$ $\Rightarrow -5\le k\le7$  $k$는 정수이고 양 끝값도 가능하므로 $\alpha=-5,\quad\beta=7$ $\alpha+\beta=-5+7=2$ 따라서 정답은 ①이다.
- 해설 경로·판정 이유·원본 값 대입 검산: 차분몫을 $s=x_1+x_2,d=x_1-x_2\ne0$로 바꿔 $3/4(s+\frac{2(1-k)}3)^2+d^2/4+12-(1-k)^2/3>0$를 얻는다. d가 0에 접근하므로 -5≤k≤7, 끝점의 엄격부등식도 성립한다.
- 그림·추가 확인: 원본 문제 조건 텍스트로 계산 경로 확인. 학생 화면 렌더는 NOT_RUN.
- 상태: READ_EVIDENCED / RELEASE_QA_NOT_RUN.

## Q19 — HOLD

- source ordinal: 19; id: `19`; sourceIdentityKey: `NOT_PRESENT`; source blob: `bf95293f599e08cbf004812d406d96c6e247190d`.
- 원본 문제 조건·보기(원문 보존):

```text
좌표평면에서 $x$축 위를 양의 방향으로 움직이는 점 $P$는 원점을 출발하여 매초 $2$의 속력으로 움직인다. 그림은 원점 $O$와 점 $P$를 지나고 이차항의 계수가 $-1$인 이차함수의 그래프를 나타낸 것이다. 선분 $OP$를 사등분하는 점 중 두 점 $O$, $P$에 가까운 쪽에 있는 점을 각각 $A$, $B$라 하고, 두 점 $A$, $B$를 지나고 $x$축에 수직인 직선이 이차함수의 그래프와 만나는 점을 각각 $C$, $D$라 하자. 사각형 $ABDC$가 정사각형이 되는 순간, 사각형 $ABDC$의 넓이의 변화율은? [4.5점]
원본 보기: ["$3$","$4$","$5$","$6$","$7$"]
```

- 원본 정답: `②`.
- 기존 solution에서 확인한 실제 핵심 문장/식 (1~2곳):
> 시각 $t>0$에서 점 $P$는 원점에서 매초 $2$씩 이동하므로 $P=(2t,0)$이다.
> 사각형의 넓이를 $S(t)$라 하면 $S(t)=AB\cdot AC=t\cdot\dfrac{3t^2}{4}=\dfrac{3t^3}{4}$ $\dfrac{dS}{dt}=\dfrac{9t^2}{4}$ 따라서 정사각형이 되는 순간의 넓이의 변화율은 $\left.\dfrac{dS}{dt}\right|_{t=4/3}=\dfrac94\left(\dfrac43\right)^2$ $=\dfrac94\cdot\dfrac{16}{9}=4$ 따라서 정답은 ②이다.
- 해설 경로·판정 이유·원본 값 대입 검산: 두 원점·현재 위치를 지나는 이차식 $y=-x(x-2t)$와 A,B 사등분 좌표로 $AB=t, AC=3t^2/4$를 얻는다. 원본 q19.png에서 점 배치가 확인되지 않아 시각 HOLD다.
- 그림·추가 확인: VISUAL_HOLD: 원본 문제 이미지 `assets/images/25_강남여고_2학기_기말_고2_수학II/q19.png`의 실제 수치·점·영역을 시각 판독하지 못했음. 그림 확인 후 정답·수식과 대조 필요.
- 상태: VISUAL_HOLD.

## Q20 — HOLD

- source ordinal: 20; id: `20`; sourceIdentityKey: `NOT_PRESENT`; source blob: `bf95293f599e08cbf004812d406d96c6e247190d`.
- 원본 문제 조건·보기(원문 보존):

```text
그림과 같이 밑면의 반지름의 길이가 $2$이고 높이가 $h$인 원뿔에 크기와 모양이 같은 두 개의 원기둥이 내접하고 있다. 두 원기둥의 부피의 합이 최대가 될 때, 원기둥의 밑면의 반지름의 길이는 $\dfrac{q}{p}$이다. 이때 $p+q$의 값은? (단, $h$는 상수이고, $p$, $q$는 서로소인 자연수이다.) [4.5점]
원본 보기: ["$1$","$2$","$3$","$4$","$5$"]
```

- 원본 정답: `⑤`.
- 기존 solution에서 확인한 실제 핵심 문장/식 (1~2곳):
> 닮음에 의해 $\dfrac{2r}{2}=\dfrac{h-z}{h}$ $r=1-\dfrac zh$ $\Rightarrow z=h(1-r)$ 이다.
> $p+q=3+2=5$ 따라서 정답은 ⑤이다.
- 해설 경로·판정 이유·원본 값 대입 검산: 기존 해설은 동일한 두 원기둥을 원뿔 단면에서 나란히 배치해 $z=h(1-r)$을 사용한다. 그러나 q20.png의 실제 원기둥 배치·내접 제약을 확인하지 못해 닮음식의 적용 조건을 시각 HOLD한다.
- 그림·추가 확인: VISUAL_HOLD: 원본 문제 이미지 `assets/images/25_강남여고_2학기_기말_고2_수학II/q20.png`의 실제 수치·점·영역을 시각 판독하지 못했음. 그림 확인 후 정답·수식과 대조 필요.
- 상태: VISUAL_HOLD.

## Q21 — KEEP

- source ordinal: 21; id: `21`; sourceIdentityKey: `NOT_PRESENT`; source blob: `bf95293f599e08cbf004812d406d96c6e247190d`.
- 원본 문제 조건·보기(원문 보존):

```text
다항함수 $f(x)$가 모든 실수 $x$에 대하여<br>$\displaystyle\int_1^x(x-t)f(t)dt=-x^3+ax-5+\int_0^x f(t)dt$<br>를 만족시킬 때, 상수 $a$에 대하여 $a+f(1)$의 값은? [4.5점]
원본 보기: ["$1$","$2$","$3$","$4$","$5$"]
```

- 원본 정답: `③`.
- 기존 solution에서 확인한 실제 핵심 문장/식 (1~2곳):
> $\displaystyle\int_1^x(x-t)f(t)\,dt$ $=x\displaystyle\int_1^xf(t)\,dt-\int_1^xtf(t)\,dt$ 이다.
> 여기에 $x=1$을 대입하면 적분 구간의 양 끝이 같으므로 $0=-3+a+f(1)$ $\Rightarrow a+f(1)=3$ 따라서 정답은 ③이다.
- 해설 경로·판정 이유·원본 값 대입 검산: $x=1$의 적분 왼쪽이 0이므로 원식을 한 번 미분해 $\int_1^xf=-3x^2+a+f(x)$를 얻는다. x=1 대입으로 곧바로 $a+f(1)=3$이다.
- 그림·추가 확인: 원본 문제 조건 텍스트로 계산 경로 확인. 학생 화면 렌더는 NOT_RUN.
- 상태: READ_EVIDENCED / RELEASE_QA_NOT_RUN.

## Q22 — KEEP

- source ordinal: 22; id: `22`; sourceIdentityKey: `NOT_PRESENT`; source blob: `bf95293f599e08cbf004812d406d96c6e247190d`.
- 원본 문제 조건·보기(원문 보존):

```text
서술형1. 곡선 $f(x)=-x^2+4x$ 위의 점 $(1,3)$에서의 접선의 방정식을 $y=ax+b$라 할 때, 상수 $a$, $b$에 대하여 $a^2+b^2$의 값을 구하시오. [5점]
원본 보기: []
```

- 원본 정답: `5`.
- 기존 solution에서 확인한 실제 핵심 문장/식 (1~2곳):
> 곡선 $y=f(x)$의 점 $(1,3)$에서 접선의 기울기는 $f'(1)$이다.
> 이를 $y=ax+b$와 비교하면 $a=2,\quad b=1$ 이므로 $a^2+b^2=2^2+1^2$ $=4+1=5$ 따라서 구하는 값은 $5$이다.
- 해설 경로·판정 이유·원본 값 대입 검산: 접점 (1,3)의 기울기 $f'(1)=2$와 접선 $y-3=2(x-1)$에서 a=2,b=1을 구한다. 제곱합은 5다.
- 그림·추가 확인: 원본 solutionImage 링크가 있으나 SVG 렌더/학생 화면 독립 검사는 NOT_RUN.
- 상태: READ_EVIDENCED / RELEASE_QA_NOT_RUN.

## Q23 — KEEP

- source ordinal: 23; id: `23`; sourceIdentityKey: `NOT_PRESENT`; source blob: `bf95293f599e08cbf004812d406d96c6e247190d`.
- 원본 문제 조건·보기(원문 보존):

```text
서술형2. 함수 $f(x)=2x^3+3x^2+ax+b$가 $x=-2$에서 $x$축에 접할 때, 극솟값을 구하시오. (단, $a$, $b$는 상수이다.) [5점]
원본 보기: []
```

- 원본 정답: `-27`.
- 기존 solution에서 확인한 실제 핵심 문장/식 (1~2곳):
> 곡선이 $x=-2$에서 $x$축에 접하므로 $f(-2)=0,\quad f'(-2)=0$ 이다.
> 극솟값은 $f(1)=2+3-12-20=-27$ 따라서 구하는 극솟값은 $-27$이다.
- 해설 경로·판정 이유·원본 값 대입 검산: 접점 $x=-2$에서 $f(-2)=f'(-2)=0$을 사용해 $a=-12,b=-20$을 얻는다. $f'=6(x+2)(x-1)$의 부호로 극솟값은 $f(1)=-27$이다.
- 그림·추가 확인: 원본 solutionImage 링크가 있으나 SVG 렌더/학생 화면 독립 검사는 NOT_RUN.
- 상태: READ_EVIDENCED / RELEASE_QA_NOT_RUN.

## Q24 — KEEP

- source ordinal: 24; id: `24`; sourceIdentityKey: `NOT_PRESENT`; source blob: `bf95293f599e08cbf004812d406d96c6e247190d`.
- 원본 문제 조건·보기(원문 보존):

```text
서술형3. 함수 $f(x)=\displaystyle\int_0^x(t^2-2t-3)dt$는 $x=a$에서 극솟값 $b$를 갖는다. 상수 $a$, $b$에 대하여 $a+b$의 값을 구하시오. [5점]
원본 보기: []
```

- 원본 정답: `-6`.
- 기존 solution에서 확인한 실제 핵심 문장/식 (1~2곳):
> 적분으로 정의된 함수는 미분하면 피적분함수에 $t=x$를 대입한 식이 된다.
> 극솟값 $b$를 구하면 $b=f(3)=\displaystyle\int_0^3(t^2-2t-3)\,dt$ $=\left[\dfrac{t^3}{3}-t^2-3t\right]_0^3$ $=\left(\dfrac{27}{3}-9-9\right)-0$ $=9-18=-9$ $a+b=3+(-9)=-6$ 따라서 구하는 값은 $-6$이다.
- 해설 경로·판정 이유·원본 값 대입 검산: $f'=(x+1)(x-3)$는 x=3에서 음→양으로 바뀐다. $f(3)=\int_0^3(t^2-2t-3)dt=-9$라서 a+b=3-9=-6이다.
- 그림·추가 확인: 원본 solutionImage 링크가 있으나 SVG 렌더/학생 화면 독립 검사는 NOT_RUN.
- 상태: READ_EVIDENCED / RELEASE_QA_NOT_RUN.

## Q25 — KEEP

- source ordinal: 25; id: `25`; sourceIdentityKey: `NOT_PRESENT`; source blob: `bf95293f599e08cbf004812d406d96c6e247190d`.
- 원본 문제 조건·보기(원문 보존):

```text
서술형4. 두 다항함수 $f(x)$, $g(x)$가 다음 조건을 만족시킨다.<br><div class="question-note-box">&lt;조건&gt;<br>(가) $f(x)=4x^3+9x^2-8x+1$<br>(나) 함수 $f(x)+g(x)$는 함수 $f(x)-g(x)$의 부정적분 중 하나이다.</div>함수 $g(x)$를 구하시오. [5점]
원본 보기: []
```

- 원본 정답: `$g(x)=4x^3-15x^2+4x+5$`.
- 기존 solution에서 확인한 실제 핵심 문장/식 (1~2곳):
> $f(x)+g(x)$가 $f(x)-g(x)$의 부정적분 중 하나이므로 미분하면 $f'(x)+g'(x)=f(x)-g(x)$ 이다.
> $x^3$항: $A=4$ $x^2$항: $B+3A=-3$ $\Rightarrow B=-3-12=-15$ $x$항: $C+2B=-26$ $\Rightarrow C=-26+30=4$ 상수항: $D+C=9$ $\Rightarrow D=9-4=5$  따라서 구하는 함수는 $g(x)=4x^3-15x^2+4x+5$이다.
- 해설 경로·판정 이유·원본 값 대입 검산: 적분 정의에서 $(f+g)'=f-g$이므로 $g'+g=f-f'$가 된다. $f-f'=4x^3-3x^2-26x+9$에 삼차식 $g$의 계수를 비교해 $g=4x^3-15x^2+4x+5$를 얻고 역미분 대입 가능하다.
- 그림·추가 확인: 원본 문제 조건 텍스트로 계산 경로 확인. 학생 화면 렌더는 NOT_RUN.
- 상태: READ_EVIDENCED / RELEASE_QA_NOT_RUN.

## 요약 및 후속 게이트

- 25 = KEEP 20 + UPGRADE 0 + HOLD 5 + UNREAD 0.
- 완성 대체 풀이 qid: 없음. HOLD qid: Q8, Q13, Q16, Q19, Q20.
- 원본 JS·content/choices/answer/solutionImage·SVG/main은 수정하지 않았음. 원본 문제 그림은 시각 미검수이며 신규 SVG 생성·출고 없음.
- 다음 체크: HOLD의 원문·그림 근거 보완, 학생용 변경 해설의 독립 수학·교육과정/Golden/Negative·문법/diff·실제 exam/sol/ans 렌더 테스트. 모두 NOT_RUN이므로 운영 PASS 아님.
