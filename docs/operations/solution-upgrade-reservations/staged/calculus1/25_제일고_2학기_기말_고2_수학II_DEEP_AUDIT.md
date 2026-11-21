# 미적분Ⅰ(구 수학Ⅱ) 심층 감사 — 25_제일고_2학기_기말_고2_수학II

- 자료: 2025년 고2 2학기 기말 기출, `수학II` (교육과정 표기: `NOT_PRESENT`).
- 원본 JS: `archive/exams/original/high/h2/2final/25_제일고_2학기_기말_고2_수학II.js`; source ref `main`, blob `f10129f9d79c312c33b1b86eba19fa7a372ec45a`.
- 문항 분모: **23**; 판정 **KEEP 18 / UPGRADE 0 / HOLD 5 / UNREAD 0**.
- 저장: `work/solution-upgrade-lane-10-20261121`의 `docs/operations/solution-upgrade-reservations/staged/calculus1/25_제일고_2학기_기말_고2_수학II_DEEP_AUDIT.md`. 동일 경로 파일 기존 없음 확인; 다른 브랜치의 중복 감사 문서는 NOT_CHECKED.
- 읽은 기준: 2026-11-21 `HARNESS_CURRENT.md`, `DEEP_QUESTION_AUDIT_TEMPLATE_CURRENT.md`, `BOARD_SOLUTION_SAMPLES_CURRENT.md`, `docs-manifest.json`의 core 문서 본문. 자동 preflight/문서 SHA-256 receipt·Golden/Negative 독립 검수: **NOT_RUN**. 운영 JS·정답·보기·SVG 수정 없음.
- 현재 단계: **EXAM_AUDIT_COMPLETE(전 문항 원문·해설 근거와 판정 수록)** / **EXAM_DRAFT_COMPLETE(UPGRADE 전체 수정 풀이 수록)** / **RELEASE_QA_NOT_RUN**. 남은 qid 판정 없음; HOLD는 후속 해결 필요.

## Q01 — KEEP

- source ordinal: 1; id: `1`; sourceIdentityKey: `NOT_PRESENT`; source blob: `f10129f9d79c312c33b1b86eba19fa7a372ec45a`.
- 원본 문제 조건·보기(원문 보존):

```text
함수 $f(x)=x^2-2x+7$에 대하여 닫힌구간 $[0,2]$에서 롤의 정리를 만족하는 실수 $c$의 값은? [3.6점]
원본 보기: ["$\\dfrac{1}{3}$","$\\dfrac{1}{2}$","$1$","$\\dfrac{3}{2}$","$\\dfrac{5}{3}$"]
```

- 원본 정답: `③`.
- 기존 solution에서 확인한 실제 핵심 문장/식 (1~2곳):
> 롤의 정리를 적용할 수 있는지 확인한 뒤 $f'(c)=0$을 만족하는 $c$를 찾는다.
> $f'(x)=2x-2$이므로 $f'(c)=0$에서 $2c-2=0$, 따라서 $c=1$이다.
- 해설 경로·판정 이유·원본 값 대입 검산: $f(0)=f(2)=7$로 롤의 정리의 세 조건을 확인하고, $f'(c)=2c-2=0$에서 구간 안의 $c=1$을 얻는다.
- 그림·추가 확인: 원본 solutionImage 링크가 있으나 SVG 렌더/학생 화면 독립 검사는 NOT_RUN.
- 상태: READ_EVIDENCED / RELEASE_QA_NOT_RUN.

## Q02 — KEEP

- source ordinal: 2; id: `2`; sourceIdentityKey: `NOT_PRESENT`; source blob: `f10129f9d79c312c33b1b86eba19fa7a372ec45a`.
- 원본 문제 조건·보기(원문 보존):

```text
함수 $f(x)=x^3+6x^2+9x+1$이 감소하는 구간이 $[a,b]$일 때, $b-a$의 값은? [3.6점]
원본 보기: ["$2$","$4$","$6$","$8$","$10$"]
```

- 원본 정답: `①`.
- 기존 solution에서 확인한 실제 핵심 문장/식 (1~2곳):
> $f'(x)=3x^2+12x+9$ $=3(x+3)(x+1)$  $f'(x)$의 부호는 $x<-3$: 양수 $-3<x<-1$: 음수 $x>-1$: 양수이다.
> $a=-3,\quad b=-1$이므로 $b-a=(-1)-(-3)=2$이다.
- 해설 경로·판정 이유·원본 값 대입 검산: $f'=3(x+3)(x+1)$의 부호가 $(-3,-1)$에서만 음수이므로 감소구간 길이는 $-1-(-3)=2$다.
- 그림·추가 확인: 원본 solutionImage 링크가 있으나 SVG 렌더/학생 화면 독립 검사는 NOT_RUN.
- 상태: READ_EVIDENCED / RELEASE_QA_NOT_RUN.

## Q03 — KEEP

- source ordinal: 3; id: `3`; sourceIdentityKey: `NOT_PRESENT`; source blob: `f10129f9d79c312c33b1b86eba19fa7a372ec45a`.
- 원본 문제 조건·보기(원문 보존):

```text
함수 $f(x)=x^3-6x^2+9x+4$의 극댓값을 $M$, 극솟값을 $m$이라 할 때, $M-m$의 값은? [3.8점]
원본 보기: ["$2$","$4$","$6$","$8$","$10$"]
```

- 원본 정답: `②`.
- 기존 solution에서 확인한 실제 핵심 문장/식 (1~2곳):
> $f'(x)=3x^2-12x+9$ $=3(x-1)(x-3)$  $x<1$에서 $f'(x)>0$, $1<x<3$에서 $f'(x)<0$, $x>3$에서 $f'(x)>0$이다.
> $M=f(1)=1-6+9+4=8$ $m=f(3)=27-54+27+4=4$ $M-m=8-4=4$이다.
- 해설 경로·판정 이유·원본 값 대입 검산: $f'=3(x-1)(x-3)$가 1에서 양→음, 3에서 음→양이므로 극댓값 8, 극솟값 4의 차는 4다.
- 그림·추가 확인: 원본 solutionImage 링크가 있으나 SVG 렌더/학생 화면 독립 검사는 NOT_RUN.
- 상태: READ_EVIDENCED / RELEASE_QA_NOT_RUN.

## Q04 — KEEP

- source ordinal: 4; id: `4`; sourceIdentityKey: `NOT_PRESENT`; source blob: `f10129f9d79c312c33b1b86eba19fa7a372ec45a`.
- 원본 문제 조건·보기(원문 보존):

```text
방정식 $3x^4+4x^3-12x^2=a$의 서로 다른 실근의 개수가 $4$일 때, 정수 $a$의 개수는? [3.8점]
원본 보기: ["$1$","$2$","$3$","$4$","$5$"]
```

- 원본 정답: `④`.
- 기존 solution에서 확인한 실제 핵심 문장/식 (1~2곳):
> $h(x)=3x^4+4x^3-12x^2$로 놓으면 방정식은 $h(x)=a$이다.
> 수평선 $y=a$가 증가·감소하는 네 구간을 각각 한 번씩 만나야 서로 다른 실근이 네 개이다.
- 해설 경로·판정 이유·원본 값 대입 검산: $h'=12x(x+2)(x-1)$의 네 단조구간을 확인한다. 극소 두 높이 -32,-5와 극대 0 사이에서 교점 네 개 조건 $-5<a<0$이므로 정수 네 개다.
- 그림·추가 확인: 원본 solutionImage 링크가 있으나 SVG 렌더/학생 화면 독립 검사는 NOT_RUN.
- 상태: READ_EVIDENCED / RELEASE_QA_NOT_RUN.

## Q05 — KEEP

- source ordinal: 5; id: `5`; sourceIdentityKey: `NOT_PRESENT`; source blob: `f10129f9d79c312c33b1b86eba19fa7a372ec45a`.
- 원본 문제 조건·보기(원문 보존):

```text
함수 $f(x)=x^3-2x+1$에 대하여 $\displaystyle\lim_{x\to2}\dfrac{1}{x-2}\int_2^x f(t)dt$의 값은? [3.6점]
원본 보기: ["$1$","$2$","$3$","$4$","$5$"]
```

- 원본 정답: `⑤`.
- 기존 solution에서 확인한 실제 핵심 문장/식 (1~2곳):
> $f(x)=x^3-2x+1$이고 $f$는 다항함수이므로 연속이다.
> 따라서 $\displaystyle\lim_{x\to2}\dfrac{F(x)-F(2)}{x-2}=F'(2)=f(2)=2^3-2\times2+1=5$이다.
- 해설 경로·판정 이유·원본 값 대입 검산: $F=\int_2^x f(t)dt$라 두면 $\lim (F(x)-F(2))/(x-2)=F'(2)=f(2)=5$다. $F(2)=0$과 연속성도 확인했다.
- 그림·추가 확인: 원본 문제 조건 텍스트로 계산 경로 확인. 학생 화면 렌더는 NOT_RUN.
- 상태: READ_EVIDENCED / RELEASE_QA_NOT_RUN.

## Q06 — KEEP

- source ordinal: 6; id: `6`; sourceIdentityKey: `NOT_PRESENT`; source blob: `f10129f9d79c312c33b1b86eba19fa7a372ec45a`.
- 원본 문제 조건·보기(원문 보존):

```text
곡선 $y=ax-x^2$과 $x$축으로 둘러싸인 도형의 넓이가 $\dfrac{9}{2}$일 때, 양수 $a$의 값은? [3.8점]
원본 보기: ["$2$","$\\dfrac{5}{2}$","$3$","$\\dfrac{7}{2}$","$4$"]
```

- 원본 정답: `③`.
- 기존 solution에서 확인한 실제 핵심 문장/식 (1~2곳):
> 곡선 $y=ax-x^2=x(a-x)$는 $a>0$이므로 $x=0,a$에서 $x$축과 만난다.
> $S=\displaystyle\int_0^a(ax-x^2)\,dx$ $=\left[\dfrac{ax^2}{2}-\dfrac{x^3}{3}\right]_0^a$ $=\dfrac{a^3}{2}-\dfrac{a^3}{3}$ $=\dfrac{a^3}{6}$  $S=\dfrac92$이므로 $\dfrac{a^3}{6}=\dfrac92$ $a^3=27$ $a=3$이다.
- 해설 경로·판정 이유·원본 값 대입 검산: $x(a-x)>0$인 $0<x<a$에서 $\int_0^a(ax-x^2)dx=a^3/6$이다. 이를 $9/2$에 맞추면 $a=3>0$이 유일하다.
- 그림·추가 확인: 원본 solutionImage 링크가 있으나 SVG 렌더/학생 화면 독립 검사는 NOT_RUN.
- 상태: READ_EVIDENCED / RELEASE_QA_NOT_RUN.

## Q07 — HOLD

- source ordinal: 7; id: `7`; sourceIdentityKey: `NOT_PRESENT`; source blob: `f10129f9d79c312c33b1b86eba19fa7a372ec45a`.
- 원본 문제 조건·보기(원문 보존):

```text
아래 그림은 원점을 출발하여 수직선 위를 움직이는 점 $P$의 시각 $t$에서의 속도 $v(t)$의 그래프이다. 보기에서 옳은 것만을 있는 대로 고른 것은? (단, $0\le t\le7$) [3.8점]<br><img src="assets/images/25_제일고_2학기_기말_고2_수학II/q07.png"><br><div class="question-note-box"><div style="text-align:center;font-weight:700;">&lt; 보 기 &gt;</div><br>ㄱ. 점 $P$가 움직이는 방향을 $3$번 바꾸었다.<br>ㄴ. 시각 $t=5$일 때 점 $P$의 위치는 $1$이다.<br>ㄷ. 시각 $t=0$에서 $t=7$까지 점 $P$가 움직인 거리는 $7$이다.<br>ㄹ. 점 $P$의 위치가 출발 후 다시 원점이 될 때까지 움직인 거리는 $4$이다.</div>
원본 보기: ["ㄱ, ㄴ","ㄱ, ㄷ","ㄴ, ㄷ","ㄴ, ㄹ","ㄷ, ㄹ"]
```

- 원본 정답: `④`.
- 기존 solution에서 확인한 실제 핵심 문장/식 (1~2곳):
> 속도의 부호는 $+$에서 $-$로 바뀌는 $t=2$와 $-$에서 $+$로 바뀌는 $t=4$에서만 변한다.
> 그때까지 이동거리는 $2+2=4$이므로 참이다.
- 해설 경로·판정 이유·원본 값 대입 검산: 속도 그래프의 부호 변화 시각 $t=2,4$와 삼각형 넓이 합을 사용한다. 기존 풀이의 방향변경 2회·변위 1·거리 8은 q7 문제 이미지의 축·높이·눈금을 직접 확인하지 못했으므로 시각 HOLD다.
- 그림·추가 확인: VISUAL_HOLD: 원본 문제 이미지 `assets/images/25_제일고_2학기_기말_고2_수학II/q07.png`의 실제 수치·점·영역을 시각 판독하지 못했음. 그림 확인 후 정답·수식과 대조 필요.
- 상태: VISUAL_HOLD.

## Q08 — KEEP

- source ordinal: 8; id: `8`; sourceIdentityKey: `NOT_PRESENT`; source blob: `f10129f9d79c312c33b1b86eba19fa7a372ec45a`.
- 원본 문제 조건·보기(원문 보존):

```text
함수 $f(x)=-x^3+ax^2+a^2x-1$이 $-1\lt x\lt1$에서 극솟값, $x\gt1$에서 극댓값을 갖도록 하는 실수 $a$의 값의 범위가 $n\lt a\lt m$일 때, $nm$의 값은? [4.2점]
원본 보기: ["$2$","$\\dfrac{5}{2}$","$3$","$\\dfrac{7}{2}$","$4$"]
```

- 원본 정답: `③`.
- 기존 solution에서 확인한 실제 핵심 문장/식 (1~2곳):
> $f'(x)=-3x^2+2ax+a^2$ $=-(3x+a)(x-a)$ 따라서 두 영점은 $x=-\dfrac a3,\ a$이다.
> 따라서 $n=1,\ m=3$이므로 $nm=3$이다.
- 해설 경로·판정 이유·원본 값 대입 검산: $f'=-(3x+a)(x-a)$에서 $a>0$일 때 극소 $-a/3\in(-1,1)$, 극대 $a>1$이므로 $1<a<3$이다. $a\le0$ 경우 불가임도 확인했다.
- 그림·추가 확인: 원본 solutionImage 링크가 있으나 SVG 렌더/학생 화면 독립 검사는 NOT_RUN.
- 상태: READ_EVIDENCED / RELEASE_QA_NOT_RUN.

## Q09 — HOLD

- source ordinal: 9; id: `9`; sourceIdentityKey: `NOT_PRESENT`; source blob: `f10129f9d79c312c33b1b86eba19fa7a372ec45a`.
- 원본 문제 조건·보기(원문 보존):

```text
최고차항의 계수가 양수인 삼차함수 $f(x)$에 대하여 함수 $y=f(x)$의 그래프가 그림과 같다. 부등식 $f(n)f'(n)\le0$을 만족시키는 $11$ 이하의 모든 자연수 $n$의 개수는? (단, $f(1)=f(10)=f'(10)=0$이다.) [4.3점]
원본 보기: ["$2$","$4$","$6$","$8$","$10$"]
```

- 원본 정답: `④`.
- 기존 solution에서 확인한 실제 핵심 문장/식 (1~2곳):
> 그림에서 $x=1$은 $x$축을 지나는 영점, $x=10$은 $x$축에 접하는 영점이다.
> $n=1$: $f(1)=0$이므로 포함 $n=2,3$: $f(n)>0,\ f'(n)>0$이므로 제외 $n=4$: $f'(4)=0$이므로 포함 $n=5,6,7,8,9$: $f(n)>0,\ f'(n)<0$이므로 포함 $n=10$: $f(10)=f'(10)=0$이므로 포함 $n=11$: 두 값이 모두 양수이므로 제외  따라서 가능한 $n$은 $1,4,5,6,7,8,9,10$의 $8$개이다.
- 해설 경로·판정 이유·원본 값 대입 검산: $f=c(x-1)(x-10)^2$라는 근 구조와 $f'=3c(x-4)(x-10)$를 사용해 자연수 1,4,5~10을 고른다. 그러나 q09.png의 접점·그래프 개형을 직접 확인하지 못해 HOLD다.
- 그림·추가 확인: VISUAL_HOLD: 원본 문제 이미지 `assets/images/25_제일고_2학기_기말_고2_수학II/q09.png`의 실제 수치·점·영역을 시각 판독하지 못했음. 그림 확인 후 정답·수식과 대조 필요.
- 상태: VISUAL_HOLD.

## Q10 — KEEP

- source ordinal: 10; id: `10`; sourceIdentityKey: `NOT_PRESENT`; source blob: `f10129f9d79c312c33b1b86eba19fa7a372ec45a`.
- 원본 문제 조건·보기(원문 보존):

```text
한 변의 길이가 $6$인 정사각형 모양의 두꺼운 종이의 네 귀퉁이에서 같은 크기의 정사각형을 잘라내고, 나머지 부분을 접어서 뚜껑이 없는 직육면체 모양의 상자를 만들려고 한다. 이 상자의 부피의 최댓값은? [4.4점]
원본 보기: ["$8$","$\\dfrac{25}{2}$","$16$","$\\dfrac{45}{2}$","$27$"]
```

- 원본 정답: `③`.
- 기존 solution에서 확인한 실제 핵심 문장/식 (1~2곳):
> 따라서 $0<x<3$이고 $V(x)=x(6-2x)^2$이다.
> $V(1)=1\cdot(6-2)^2$ $=1\cdot16=16$이다.
- 해설 경로·판정 이유·원본 값 대입 검산: $V=x(6-2x)^2$에서 $0<x<3$, $V'=12(3-x)(1-x)$의 부호가 $x=1$에서 양→음으로 바뀐다. 이때 부피 16이다.
- 그림·추가 확인: 원본 solutionImage 링크가 있으나 SVG 렌더/학생 화면 독립 검사는 NOT_RUN.
- 상태: READ_EVIDENCED / RELEASE_QA_NOT_RUN.

## Q11 — KEEP

- source ordinal: 11; id: `11`; sourceIdentityKey: `NOT_PRESENT`; source blob: `f10129f9d79c312c33b1b86eba19fa7a372ec45a`.
- 원본 문제 조건·보기(원문 보존):

```text
수직선 위를 움직이는 두 점 $P$, $Q$의 시각 $t$에서의 위치가 각각 $-\dfrac{1}{2}t^4+2t^3+3t^2$, $kt^2$이다. $t\gt0$에서 두 점 $P$, $Q$의 가속도가 같아지는 순간이 $2$번 있도록 하는 모든 정수 $k$의 값의 합은? [4.3점]
원본 보기: ["$8$","$9$","$10$","$11$","$12$"]
```

- 원본 정답: `②`.
- 기존 solution에서 확인한 실제 핵심 문장/식 (1~2곳):
> $P$의 위치를 $p(t)$, $Q$의 위치를 $q(t)$라 하면 $p''(t)=-6t^2+12t+6$ $q''(t)=2k$이다.
> 가능한 정수는 $k=4,5$이므로 $4+5=9$이다.
- 해설 경로·판정 이유·원본 값 대입 검산: 가속도 일치식 $k=-3(t-1)^2+6$의 정의역이 $t>0$이므로 수평선이 양의 시간축에서 두 번 만나는 범위는 $3<k<6$이다. $k=3$의 시간 0을 배제하고 4+5=9다.
- 그림·추가 확인: 원본 solutionImage 링크가 있으나 SVG 렌더/학생 화면 독립 검사는 NOT_RUN.
- 상태: READ_EVIDENCED / RELEASE_QA_NOT_RUN.

## Q12 — HOLD

- source ordinal: 12; id: `12`; sourceIdentityKey: `NOT_PRESENT`; source blob: `f10129f9d79c312c33b1b86eba19fa7a372ec45a`.
- 원본 문제 조건·보기(원문 보존):

```text
모든 실수 $x$에서 연속인 함수 $f(x)$가 다음 조건을 만족시킨다.<br><div class="question-note-box">(가) $f(x+4)=f(x)$<br>(나) $f(x)=\begin{cases}3x+3&(-1\le x\lt0)\\-x+3&(0\le x\lt3)\end{cases}$</div><br><img src="assets/images/25_제일고_2학기_기말_고2_수학II/q12.png"><br>정적분 $\displaystyle\int_{-1}^{19}f(x)dx$의 값은? [4.2점]
원본 보기: ["$24$","$30$","$36$","$42$","$48$"]
```

- 원본 정답: `②`.
- 기존 solution에서 확인한 실제 핵심 문장/식 (1~2곳):
> $f(x+4)=f(x)$이므로 길이 $4$인 구간의 정적분값이 주기마다 같다.
> $\displaystyle\int_{-1}^{19}f(x)\,dx=5\cdot6=30$이다.
- 해설 경로·판정 이유·원본 값 대입 검산: 4주기 구간 $[-1,3]$의 정적분 $3/2+9/2=6$을 다섯 번 더해 $30$이다. 다만 q12.png에 그려진 주기 그래프의 경계 포함과 실제 조각 형태를 판독하지 못해 HOLD다.
- 그림·추가 확인: VISUAL_HOLD: 원본 문제 이미지 `assets/images/25_제일고_2학기_기말_고2_수학II/q12.png`의 실제 수치·점·영역을 시각 판독하지 못했음. 그림 확인 후 정답·수식과 대조 필요.
- 상태: VISUAL_HOLD.

## Q13 — KEEP

- source ordinal: 13; id: `13`; sourceIdentityKey: `NOT_PRESENT`; source blob: `f10129f9d79c312c33b1b86eba19fa7a372ec45a`.
- 원본 문제 조건·보기(원문 보존):

```text
$\displaystyle\int_2^x(x-t)f(t)dt=x^3-3x^2+k$를 만족시키는 함수 $f(x)$에 대하여 $f(k)$의 값은? (단, $k$는 상수) [4.3점]
원본 보기: ["$10$","$12$","$14$","$16$","$18$"]
```

- 원본 정답: `⑤`.
- 기존 solution에서 확인한 실제 핵심 문장/식 (1~2곳):
> 주어진 적분식은 $\displaystyle\int_2^x(x-t)f(t)\,dt=x^3-3x^2+k$이다.
> 따라서 $f(k)=f(4)=6\cdot4-6=18$이다.
- 해설 경로·판정 이유·원본 값 대입 검산: $x=2$에서 $k=4$가 되고, 적분식을 두 번 미분해 $f(x)=6x-6$을 구한다. $f(4)=18$을 원문에 역대입 가능하다.
- 그림·추가 확인: 원본 문제 조건 텍스트로 계산 경로 확인. 학생 화면 렌더는 NOT_RUN.
- 상태: READ_EVIDENCED / RELEASE_QA_NOT_RUN.

## Q14 — HOLD

- source ordinal: 14; id: `14`; sourceIdentityKey: `NOT_PRESENT`; source blob: `f10129f9d79c312c33b1b86eba19fa7a372ec45a`.
- 원본 문제 조건·보기(원문 보존):

```text
아래 그림과 같이 곡선 $y=9-x^2$과 $y$축 및 직선 $y=k$로 둘러싸인 부분 중 $x\ge0$인 부분의 넓이를 $S_1$이라 하고, 곡선 $y=9-x^2$과 두 직선 $x=3$, $y=k$로 둘러싸인 부분의 넓이를 $S_2$라고 하자. $S_1=S_2$를 만족시키는 상수 $k$에 대하여 $\dfrac{k}{S_2}$의 값은? [4.4점]
원본 보기: ["$\\sqrt3$","$3$","$2\\sqrt3$","$3\\sqrt3$","$6$"]
```

- 원본 정답: `①`.
- 기존 solution에서 확인한 실제 핵심 문장/식 (1~2곳):
> 곡선 $y=9-x^2$과 수평선 $y=k$의 오른쪽 교점의 $x$좌표를 $u$라 두자.
> $\dfrac{k}{S_2}=\dfrac6{2\sqrt3}=\sqrt3$이므로 따라서 정답은 ①이다.
- 해설 경로·판정 이유·원본 값 대입 검산: 양쪽 넓이를 각각 $2u^3/3$과 $9-3u^2+2u^3/3$으로 계산해 $u^2=3$, $k=6$, 비 $\sqrt3$이다. q14.png의 음영과 교점 배치를 실제 확인하지 못해 HOLD다.
- 그림·추가 확인: VISUAL_HOLD: 원본 문제 이미지 `assets/images/25_제일고_2학기_기말_고2_수학II/q14.png`의 실제 수치·점·영역을 시각 판독하지 못했음. 그림 확인 후 정답·수식과 대조 필요.
- 상태: VISUAL_HOLD.

## Q15 — KEEP

- source ordinal: 15; id: `15`; sourceIdentityKey: `NOT_PRESENT`; source blob: `f10129f9d79c312c33b1b86eba19fa7a372ec45a`.
- 원본 문제 조건·보기(원문 보존):

```text
삼차함수 $f(x)$와 상수 $a$ $(a\ne0,1)$에 대하여 $f(0)=f(1)=f(a)$, $f'(0)=f'(a)$를 만족시키고, 함수 $f'(x)$의 최댓값이 $1$이며, $(1,f(1))$에서 접선의 $y$절편이 $6$일 때, $f(3)$의 값은? [4.7점]
원본 보기: ["$1$","$2$","$3$","$4$","$5$"]
```

- 원본 정답: `①`.
- 기존 solution에서 확인한 실제 핵심 문장/식 (1~2곳):
> $f(x)=Ax^3+Bx^2+Cx+D\quad(A\ne0)$라 하자.
> $f(3)=-3\cdot2\cdot1+7=1$이다.
- 해설 경로·판정 이유·원본 값 대입 검산: $f-f(0)=Ax(x-1)(x-a)$에서 $f'(0)=f'(a)$로 $a=2$를 정한다. $f'=A[3(x-1)^2-1]$의 최댓값 1 때문에 $A=-1$이며 접선 절편으로 $D=7$을 얻는다.
- 그림·추가 확인: 원본 solutionImage 링크가 있으나 SVG 렌더/학생 화면 독립 검사는 NOT_RUN.
- 상태: READ_EVIDENCED / RELEASE_QA_NOT_RUN.

## Q16 — KEEP

- source ordinal: 16; id: `16`; sourceIdentityKey: `NOT_PRESENT`; source blob: `f10129f9d79c312c33b1b86eba19fa7a372ec45a`.
- 원본 문제 조건·보기(원문 보존):

```text
닫힌 구간 $[1,t]$에서 함수 $f(x)=2x^3-9x^2+12x$의 최댓값이 $5$, 최솟값이 $4$가 되도록 하는 실수 $t$의 최댓값과 최솟값을 각각 $a$, $b$라 하자. $ab$의 값은? (단, $t\gt1$) [4.7점]
원본 보기: ["$5$","$6$","$7$","$8$","$9$"]
```

- 원본 정답: `①`.
- 기존 solution에서 확인한 실제 핵심 문장/식 (1~2곳):
> $f'(x)=6x^2-18x+12$ $=6(x-1)(x-2)$이다.
> 따라서 $2\le t\le\dfrac52$이고 $a=\dfrac52,\quad b=2$, $ab=\dfrac52\cdot2=5$이다.
- 해설 경로·판정 이유·원본 값 대입 검산: $f'=6(x-1)(x-2)$의 부호와 $f(1)=5,f(2)=4$로 $t\ge2$를 정한다. $f(t)-5=(t-1)^2(2t-5)$에서 $t\le5/2$, 양 끝 곱 5다.
- 그림·추가 확인: 원본 solutionImage 링크가 있으나 SVG 렌더/학생 화면 독립 검사는 NOT_RUN.
- 상태: READ_EVIDENCED / RELEASE_QA_NOT_RUN.

## Q17 — KEEP

- source ordinal: 17; id: `17`; sourceIdentityKey: `NOT_PRESENT`; source blob: `f10129f9d79c312c33b1b86eba19fa7a372ec45a`.
- 원본 문제 조건·보기(원문 보존):

```text
정의역이 $\{x\mid0\lt x\lt3\}$인 함수 $f(x)=\displaystyle\int_0^3(x-t)|x-t|dt$에 대하여 함수 $f'(x)$의 극솟값은? [4.7점]
원본 보기: ["$3$","$\\dfrac72$","$4$","$\\dfrac92$","$5$"]
```

- 원본 정답: `④`.
- 기존 solution에서 확인한 실제 핵심 문장/식 (1~2곳):
> $0\le t\le x$에서 $|x-t|=x-t$, $x\le t\le3$에서 $|x-t|=t-x$이다.
> $x=\dfrac32$는 정의역 $0<x<3$에 포함된다.
- 해설 경로·판정 이유·원본 값 대입 검산: 절댓값 적분을 $t=x$에서 나누면 $f(x)=x^3/3-(3-x)^3/3$이다. $f'(x)=2(x-3/2)^2+9/2$의 극솟값 9/2가 정의역 내부에서 달성된다.
- 그림·추가 확인: 원본 solutionImage 링크가 있으나 SVG 렌더/학생 화면 독립 검사는 NOT_RUN.
- 상태: READ_EVIDENCED / RELEASE_QA_NOT_RUN.

## Q18 — KEEP

- source ordinal: 18; id: `18`; sourceIdentityKey: `NOT_PRESENT`; source blob: `f10129f9d79c312c33b1b86eba19fa7a372ec45a`.
- 원본 문제 조건·보기(원문 보존):

```text
서로 다른 두 정수 $a$, $b$ $(a\lt b)$에 대하여 사차함수 $f(x)=(x-a)^3(x-b)+3$이 $x=3$에서 극솟값을 가질 때, $f'(x)=0$을 만족시키는 서로 다른 모든 근의 합의 최댓값은? [4.9점]
원본 보기: ["$-1$","$0$","$1$","$2$","$3$"]
```

- 원본 정답: `⑤`.
- 기존 solution에서 확인한 실제 핵심 문장/식 (1~2곳):
> 도함수를 구하면 $f'(x)=3(x-a)^2(x-b)+(x-a)^3$ $=(x-a)^2\{3(x-b)+(x-a)\}$ $=(x-a)^2(4x-a-3b)$이다.
> 따라서 최댓값은 $15-12=3$이다.
- 해설 경로·판정 이유·원본 값 대입 검산: $f'=(x-a)^2(4x-a-3b)$이어서 극소점은 $r=(a+3b)/4=3$만 가능하다. $a=12-3b<b$에서 $b\ge4$로 정수 최댓합 3이 된다.
- 그림·추가 확인: 원본 solutionImage 링크가 있으나 SVG 렌더/학생 화면 독립 검사는 NOT_RUN.
- 상태: READ_EVIDENCED / RELEASE_QA_NOT_RUN.

## Q19 — KEEP

- source ordinal: 19; id: `19`; sourceIdentityKey: `NOT_PRESENT`; source blob: `f10129f9d79c312c33b1b86eba19fa7a372ec45a`.
- 원본 문제 조건·보기(원문 보존):

```text
실수 전체의 집합에서 정의된 함수 $f(x)$가 다음 조건을 만족시킨다.<br><div class="question-note-box">(가) $x\ge0$일 때, $f(x)=-x^2+2x$이다.<br>(나) 함수 $f(x)$의 그래프는 원점에 대하여 대칭이다.</div><br>실수 $t$에 대하여 닫힌구간 $[t,t+1]$에서 함수 $f(x)$의 최댓값을 $g(t)$라 하자. 두 곡선 $y=f(x)$, $y=g(x)$와 두 직선 $x=-\dfrac32$, $x=0$으로 둘러싸인 부분의 넓이를 $\dfrac{q}{p}$라 하자. $p+q$의 값은? [4.9점] (단, $p$, $q$는 서로소인 자연수이다.)
원본 보기: ["$30$","$31$","$32$","$33$","$34$"]
```

- 원본 정답: `②`.
- 기존 solution에서 확인한 실제 핵심 문장/식 (1~2곳):
> 원점 대칭인 함수는 $f(-x)=-f(x)$이다.
> 서로소인 자연수 $p=12$, $q=19$이므로 $p+q=31$이다.
- 해설 경로·판정 이유·원본 값 대입 검산: 원점 대칭으로 음의 반축에서 $f=(x+1)^2-1$이고, $g$의 최대 선택이 $t=-3/2,-1$에서 바뀐다. $\int(g-f)=1/4+4/3=19/12$를 검산했다.
- 그림·추가 확인: 원본 solutionImage 링크가 있으나 SVG 렌더/학생 화면 독립 검사는 NOT_RUN.
- 상태: READ_EVIDENCED / RELEASE_QA_NOT_RUN.

## Q20 — KEEP

- source ordinal: 20; id: `20`; sourceIdentityKey: `NOT_PRESENT`; source blob: `f10129f9d79c312c33b1b86eba19fa7a372ec45a`.
- 원본 문제 조건·보기(원문 보존):

```text
<div class="question-note-box"><b>서술형 1</b></div><br>$x\gt1$일 때, 부등식 $x^{n+1}\ge(n+1)x+n^2-10n+14$가 항상 성립하도록 하는 자연수 $n$의 개수를 구하시오. [4점]
원본 보기: []
```

- 원본 정답: `6개`.
- 기존 solution에서 확인한 실제 핵심 문장/식 (1~2곳):
> $h(x)=x^{n+1}-(n+1)x$라 두면 $h'(x)=(n+1)x^n-(n+1)$ $=(n+1)(x^n-1)$이다.
> 다만 $x=1$은 정의역에 없으므로 $-n$은 실제 최솟값이 아니라 하한이고, 모든 $x>1$에서 $h(x)>-n$이다.
- 해설 경로·판정 이유·원본 값 대입 검산: $h(x)=x^{n+1}-(n+1)x$는 $x>1$에서 도함수 양수이며 하한은 $-n$이다. 등호 조건까지 허용해 $(n-2)(n-7)\le0$, 자연수 6개다.
- 그림·추가 확인: 원본 solutionImage 링크가 있으나 SVG 렌더/학생 화면 독립 검사는 NOT_RUN.
- 상태: READ_EVIDENCED / RELEASE_QA_NOT_RUN.

## Q21 — KEEP

- source ordinal: 21; id: `21`; sourceIdentityKey: `NOT_PRESENT`; source blob: `f10129f9d79c312c33b1b86eba19fa7a372ec45a`.
- 원본 문제 조건·보기(원문 보존):

```text
<div class="question-note-box"><b>서술형 2</b></div><br>직선 $x=t$가 곡선 $y=x^3$, 직선 $y=x$와 만나는 점을 각각 $P$, $Q$라 하자. 선분 $PQ$를 $3:1$로 외분하는 점을 $R$이라 할 때, 점 $R$의 $y$좌표를 $f(t)$라 하자. 함수 $f(t)$의 극솟값과 극댓값을 구하시오. [6점]
원본 보기: []
```

- 원본 정답: `극솟값 −1, 극댓값 1`.
- 기존 solution에서 확인한 실제 핵심 문장/식 (1~2곳):
> 직선 $x=t$와 곡선 $y=x^3$, 직선 $y=x$의 교점은 $P=(t,t^3)$, $Q=(t,t)$이다.
> $f(-1)=\dfrac{-3+1}{2}=-1$ $f(1)=\dfrac{3-1}{2}=1$이다.
- 해설 경로·판정 이유·원본 값 대입 검산: 외분점 $R=(3Q-P)/2$에서 $y=(3t-t^3)/2$, 도함수 $3(1-t^2)/2$의 부호로 극소 -1, 극대 1을 직접 확인했다.
- 그림·추가 확인: 원본 solutionImage 링크가 있으나 SVG 렌더/학생 화면 독립 검사는 NOT_RUN.
- 상태: READ_EVIDENCED / RELEASE_QA_NOT_RUN.

## Q22 — KEEP

- source ordinal: 22; id: `22`; sourceIdentityKey: `NOT_PRESENT`; source blob: `f10129f9d79c312c33b1b86eba19fa7a372ec45a`.
- 원본 문제 조건·보기(원문 보존):

```text
<div class="question-note-box"><b>서술형 3</b></div><br>다항함수 $f(x)$에 대하여 $f(x)=3x^2+2\displaystyle\int_0^1f(t)dt$가 성립할 때, $f(2)$의 값을 구하시오. [4점]
원본 보기: []
```

- 원본 정답: `10`.
- 기존 solution에서 확인한 실제 핵심 문장/식 (1~2곳):
> $A=\displaystyle\int_0^1f(t)\,dt$이면 $f(x)=3x^2+2A$이다.
> $f(2)=3\cdot2^2-2$ $=12-2=10$이다.
- 해설 경로·판정 이유·원본 값 대입 검산: 상수 $A=\int_0^1f$의 정의를 원식에 넣으면 $A=1+2A$, $A=-1$이다. $f(x)=3x^2-2$를 적분해 원래 A가 -1임을 확인했고 $f(2)=10$이다.
- 그림·추가 확인: 원본 문제 조건 텍스트로 계산 경로 확인. 학생 화면 렌더는 NOT_RUN.
- 상태: READ_EVIDENCED / RELEASE_QA_NOT_RUN.

## Q23 — HOLD

- source ordinal: 23; id: `23`; sourceIdentityKey: `NOT_PRESENT`; source blob: `f10129f9d79c312c33b1b86eba19fa7a372ec45a`.
- 원본 문제 조건·보기(원문 보존):

```text
<div class="question-note-box"><b>서술형 4</b></div><br>오른쪽 그림은 삼차함수 $f(x)$의 도함수 $y=f'(x)$의 그래프이다. $f(0)=0$일 때, 방정식 $f(x)=k$가 서로 다른 세 실근을 갖기 위한 모든 정수 $k$의 개수를 구하시오. [6점]
원본 보기: []
```

- 원본 정답: `7개`.
- 기존 solution에서 확인한 실제 핵심 문장/식 (1~2곳):
> 주어진 그림에서 $f'(x)$는 $x=-2,2$에서 $0$이 되고, $(0,3)$을 지나는 아래로 열린 포물선이다.
> $k=\pm4$에서는 극값에서 접하는 두 교점이 합쳐져 서로 다른 실근이 세 개가 되지 않는다.
- 해설 경로·판정 이유·원본 값 대입 검산: 도함수 그래프의 근 $-2,2$ 및 점 $(0,3)$으로 $f'=3-\frac34x^2$을 결정해 가능한 k는 -3~3의 7개다. 실제 q23.png의 근과 눈금을 직접 판독하지 못해 HOLD다.
- 그림·추가 확인: VISUAL_HOLD: 원본 문제 이미지 `assets/images/25_제일고_2학기_기말_고2_수학II/q23.png`의 실제 수치·점·영역을 시각 판독하지 못했음. 그림 확인 후 정답·수식과 대조 필요.
- 상태: VISUAL_HOLD.

## 요약 및 후속 게이트

- 23 = KEEP 18 + UPGRADE 0 + HOLD 5 + UNREAD 0.
- 완성 대체 풀이 qid: 없음. HOLD qid: Q7, Q9, Q12, Q14, Q23.
- 원본 JS·content/choices/answer/solutionImage·SVG/main은 수정하지 않았음. 원본 문제 그림은 시각 미검수이며 신규 SVG 생성·출고 없음.
- 다음 체크: HOLD의 원문·그림 근거 보완, 학생용 변경 해설의 독립 수학·교육과정/Golden/Negative·문법/diff·실제 exam/sol/ans 렌더 테스트. 모두 NOT_RUN이므로 운영 PASS 아님.
