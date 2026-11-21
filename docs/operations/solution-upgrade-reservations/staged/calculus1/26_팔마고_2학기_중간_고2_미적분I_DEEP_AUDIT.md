# 미적분Ⅰ 심층 감사 — 26_팔마고_2학기_중간_고2_미적분I

- 대상: `archive/exams/original/high/h2/2mid/26_팔마고_2학기_중간_고2_미적분I.js` (미적분I, 기출, 2026년 2학기 중간)
- 원본 ref: `main`, blob: `c0fa41f87d31ab9ce3279f63ee5302b35c87b9d1`; 문항 분모 **21**.
- 판정: **KEEP 19 / UPGRADE 1 / HOLD 1 / UNREAD 0**. 문항별 원문·기존 해설·판정 근거 아래 기록.
- 작업 브랜치: `work/solution-upgrade-lane-10-20261121`; MD 경로: `docs/operations/solution-upgrade-reservations/staged/calculus1/26_팔마고_2학기_중간_고2_미적분I_DEEP_AUDIT.md`.
- 기준 자료: `HARNESS_CURRENT.md`, `DEEP_QUESTION_AUDIT_TEMPLATE_CURRENT.md`, `BOARD_SOLUTION_SAMPLES_CURRENT.md`, `docs-manifest.json` core 문서 본문을 2026-11-21 접근·확인. Golden/Negative 독립 샘플·자동 preflight·SHA-256 영수증 검증: **NOT_RUN**. 운영 독립 수학·학생 화면·SVG QA: **NOT_RUN**.
- 문제 그림 문항 Q20은 이미지의 점·화살표·함숫값을 시각 판독하지 못해 **VISUAL_HOLD**. 기존 `solutionImage` 렌더도 **NOT_RUN**.
- 상태: **EXAM_AUDIT_COMPLETE(전 문항 근거 기록)** / **EXAM_DRAFT_COMPLETE(개선 1문항 전체 풀이 수록)** / **QA_NOT_RUN**. next_qid 없음, 시각 검증 미해결: 20.

## Q01 — KEEP

- 출처: source ordinal 1, id `1`, sourceIdentityKey `NOT_PRESENT`, blob `c0fa41f87d31ab9ce3279f63ee5302b35c87b9d1`.
- 문제 조건·보기 원문:

```text
곡선 $y=-x^2+7x-2$ 위의 점 $(1,4)$에서의 접선의 기울기의 값은? [3.3점]
보기 원문: ["1","5","10","15","20"]
```

- 원본 정답: `②`.
- 기존 solution 결정적 실제 구절(발췌):
> $y'=(-x^2+7x-2)'=-2x+7$이므로 $x=1$에서 $y'(1)=-2+7=5$입니다.
- 해설 경로·판정 이유·독립 대입 검산: $y'=-2x+7$에서 접점의 $x=1$을 대입해 기울기 $5$를 얻는다. 주어진 점 $(1,4)$도 곡선 값 $-1+7-2=4$와 일치한다.
- 그림/검수: 핵심 수학 조건은 텍스트에 표시되어 있음. 최종 학생 렌더 QA NOT_RUN.
- 현재 상태: READ_EVIDENCED / QA_NOT_RUN.

## Q02 — KEEP

- 출처: source ordinal 2, id `2`, sourceIdentityKey `NOT_PRESENT`, blob `c0fa41f87d31ab9ce3279f63ee5302b35c87b9d1`.
- 문제 조건·보기 원문:

```text
다음 극한을 조사하여, 극한값이 존재하는 것을 고른 것은? [3.4점]<div class="question-note-box">&lt;보기&gt;<br>ㄱ. $\lim_{x\to2}\left(5-\frac{4}{x-2}\right)$<br>ㄴ. $\lim_{x\to2}(x^2-3x+5)$<br>ㄷ. $\lim_{x\to0}\frac{\sqrt{x+4}-2}{x}$</div>
보기 원문: ["ㄱ","ㄴ","ㄱ, ㄴ","ㄴ, ㄷ","ㄱ, ㄴ, ㄷ"]
```

- 원본 정답: `④`.
- 기존 solution 결정적 실제 구절(발췌):
> 다항함수이므로 직접 대입하면 $2^2-3\cdot2+5=3$입니다.
> 분자와 분모에 $\sqrt{x+4}+2$를 곱하면 $\frac{\sqrt{x+4}-2}{x}=\frac{1}{\sqrt{x+4}+2}\to\frac14$입니다.
- 해설 경로·판정 이유·독립 대입 검산: ㄱ의 좌우 무한대 부호가 반대이며, ㄴ은 대입으로 3, ㄷ은 유리화로 1/4이다. 유한한 두 극한은 ㄴ·ㄷ이며 선택지 ④와 맞는다.
- 그림/검수: 핵심 수학 조건은 텍스트에 표시되어 있음. 최종 학생 렌더 QA NOT_RUN.
- 현재 상태: READ_EVIDENCED / QA_NOT_RUN.

## Q03 — KEEP

- 출처: source ordinal 3, id `3`, sourceIdentityKey `NOT_PRESENT`, blob `c0fa41f87d31ab9ce3279f63ee5302b35c87b9d1`.
- 문제 조건·보기 원문:

```text
다음 극한값으로 알맞은 것은? [3.5점] $\displaystyle \lim_{x\to2}\frac{x^2+x-6}{x-2}$
보기 원문: ["3","4","5","6","7"]
```

- 원본 정답: `③`.
- 기존 solution 결정적 실제 구절(발췌):
> $x^2+x-6=(x+3)(x-2)$이므로 $x\ne2$일 때 $\frac{x^2+x-6}{x-2}=x+3$입니다.
> 따라서 극한값은 $2+3=5$이므로 정답은 ③이다.
- 해설 경로·판정 이유·독립 대입 검산: $x^2+x-6=(x+3)(x-2)$로 분모를 약분한다. $x\ne2$일 때 $x+3$이므로 극한은 5다.
- 그림/검수: 핵심 수학 조건은 텍스트에 표시되어 있음. 최종 학생 렌더 QA NOT_RUN.
- 현재 상태: READ_EVIDENCED / QA_NOT_RUN.

## Q04 — KEEP

- 출처: source ordinal 4, id `4`, sourceIdentityKey `NOT_PRESENT`, blob `c0fa41f87d31ab9ce3279f63ee5302b35c87b9d1`.
- 문제 조건·보기 원문:

```text
함수 $f(x)=\begin{cases}x^2+ax&(x\lt1)\\-bx^2&(x\ge1)\end{cases}$이 $x=1$에서 미분가능할 때, 두 상수 $a,b$에 대하여 $a-b$의 값은? [3.9점]
보기 원문: ["1","2","3","4","5"]
```

- 원본 정답: `①`.
- 기존 solution 결정적 실제 구절(발췌):
> 연속 조건은 $1+a=-b$, 즉 $a+b=-1$입니다.
> 구하는 값은 $a-b=0-(-1)=1$이므로 정답은 ①이다.
- 해설 경로·판정 이유·독립 대입 검산: 연속식 $1+a=-b$와 도함수 일치 $2+a=-2b$를 모두 사용한다. $a=0,b=-1$이면 두 경계값·기울기가 각각 $1,2$로 같다.
- 그림/검수: 핵심 수학 조건은 텍스트에 표시되어 있음. 최종 학생 렌더 QA NOT_RUN.
- 현재 상태: READ_EVIDENCED / QA_NOT_RUN.

## Q05 — KEEP

- 출처: source ordinal 5, id `5`, sourceIdentityKey `NOT_PRESENT`, blob `c0fa41f87d31ab9ce3279f63ee5302b35c87b9d1`.
- 문제 조건·보기 원문:

```text
이차함수 $f(x)$가 다음 두 조건을 모두 만족시킬 때, $f(4)$의 값으로 알맞은 것은? [4점]<div class="question-note-box">(가) $f(0)=3$<br>(나) $\displaystyle\lim_{x\to1}\frac{f(x)}{x-1}=2$</div>
보기 원문: ["15","30","45","51","60"]
```

- 원본 정답: `④`.
- 기존 solution 결정적 실제 구절(발췌):
> (나)의 극한이 유한하므로 $f(1)=0$입니다.
> 따라서 $f(4)=5\cdot3^2+2\cdot3=51$이므로 정답은 ④이다.
- 해설 경로·판정 이유·독립 대입 검산: $f(1)=0$, $f'(1)=2$의 의미를 다항식 $(x-1)$ 인수와 일차항으로 반영한다. $f(0)=3$으로 제곱항 계수 5를 정하고 $f(4)=51$을 확인한다.
- 그림/검수: 핵심 수학 조건은 텍스트에 표시되어 있음. 최종 학생 렌더 QA NOT_RUN.
- 현재 상태: READ_EVIDENCED / QA_NOT_RUN.

## Q06 — KEEP

- 출처: source ordinal 6, id `6`, sourceIdentityKey `NOT_PRESENT`, blob `c0fa41f87d31ab9ce3279f63ee5302b35c87b9d1`.
- 문제 조건·보기 원문:

```text
$x=3$에서 미분가능하지 않은 함수만을 보기에서 있는 대로 고른 것은? [4.1점]<div class="question-note-box">&lt;보기&gt;<br>ㄱ. $f(x)=|x-3|$<br>ㄴ. $f(x)=|x|^2-3|x|$<br>ㄷ. $f(x)=|x(x-3)^2|$</div>
보기 원문: ["ㄱ","ㄴ","ㄱ, ㄴ","ㄱ, ㄷ","ㄱ, ㄴ, ㄷ"]
```

- 원본 정답: `①`.
- 기존 solution 결정적 실제 구절(발췌):
> 절댓값은 내부 식의 부호가 바뀌는 지점에서 꺾일 수 있으므로 $x=3$ 근처의 식을 조사합니다.
> $x=3$ 부근에서는 $x\gt0$이고 $(x-3)^2\ge0$이므로 $|x(x-3)^2|=x(x-3)^2$입니다.
- 해설 경로·판정 이유·독립 대입 검산: $\lvert x-3\rvert$의 좌우 미분계수만 $-1,1$로 다르다. $x=3$ 근방의 다른 두 절댓값 식은 다항식으로 풀리므로 미분가능 조건이 성립한다.
- 그림/검수: 핵심 수학 조건은 텍스트에 표시되어 있음. 최종 학생 렌더 QA NOT_RUN.
- 현재 상태: READ_EVIDENCED / QA_NOT_RUN.

## Q07 — KEEP

- 출처: source ordinal 7, id `7`, sourceIdentityKey `NOT_PRESENT`, blob `c0fa41f87d31ab9ce3279f63ee5302b35c87b9d1`.
- 문제 조건·보기 원문:

```text
함수 $f(x)=-x^3+3x^2-ax+1$에 대하여 다음 보기의 설명 중 옳은 것을 있는 대로 고른 것은? [4.2점]<div class="question-note-box">&lt;보기&gt;<br>ㄱ. $a=3$일 때, 함수 $f(x)$는 실수 전체에서 감소한다.<br>ㄴ. $a=3$일 때, 구간 $[-1,2]$에서 평균값 정리를 만족시키는 상수는 $3$이다.<br>ㄷ. 구간 $(-1,2)$에서 $f(x)$가 극댓값과 극솟값을 모두 갖도록 하는 실수 $a$값의 범위를 모두 구한 것은 $a\lt3$이다.</div>
보기 원문: ["ㄱ","ㄴ","ㄱ, ㄴ","ㄱ, ㄷ","ㄱ, ㄴ, ㄷ"]
```

- 원본 정답: `①`.
- 기존 solution 결정적 실제 구절(발췌):
> $f'(x)=-3x^2+6x-a=3-a-3(x-1)^2$입니다.
> $f'(c)=-3$을 풀면 $c=0$ 또는 $2$인데, $c\in(-1,2)$인 값은 $0$뿐입니다.
- 해설 경로·판정 이유·독립 대입 검산: $a=3$일 때 $f'=-3(x-1)^2\le0$이라 ㄱ 참이다. 평균값 정리의 $c=0$만 구간 내부이고, 두 극점이 내부에 있으려면 $0<a<3$이므로 ㄴ·ㄷ은 거짓이다.
- 그림/검수: 핵심 수학 조건은 텍스트에 표시되어 있음. 최종 학생 렌더 QA NOT_RUN.
- 현재 상태: READ_EVIDENCED / QA_NOT_RUN.

## Q08 — KEEP

- 출처: source ordinal 8, id `8`, sourceIdentityKey `NOT_PRESENT`, blob `c0fa41f87d31ab9ce3279f63ee5302b35c87b9d1`.
- 문제 조건·보기 원문:

```text
함수 $f(x)=2x^3+2ax^2+3ax-5$가 극값을 가지지 않도록 하는 정수 $a$의 개수는? [4.4점]
보기 원문: ["1","2","3","4","5"]
```

- 원본 정답: `⑤`.
- 기존 solution 결정적 실제 구절(발췌):
> $f'(x)=6x^2+4ax+3a$의 판별식은 $D=(4a)^2-4\cdot6\cdot3a=16a^2-72a=8a(2a-9)$입니다.
> $D=0$인 경우도 도함수 부호 변화가 없어 극값이 없다는 점에 주의합니다.
- 해설 경로·판정 이유·독립 대입 검산: 도함수 $6x^2+4ax+3a$가 서로 다른 실근을 가져야 극값이 있다. 판별식 $8a(2a-9)\le0$에서 정수 $a=0,1,2,3,4$ 다섯 개가 정확하다.
- 그림/검수: 핵심 수학 조건은 텍스트에 표시되어 있음. 최종 학생 렌더 QA NOT_RUN.
- 현재 상태: READ_EVIDENCED / QA_NOT_RUN.

## Q09 — KEEP

- 출처: source ordinal 9, id `9`, sourceIdentityKey `NOT_PRESENT`, blob `c0fa41f87d31ab9ce3279f63ee5302b35c87b9d1`.
- 문제 조건·보기 원문:

```text
함수 $f(x)$가 모든 실수 $x$에 대하여 $-2x^2+3x\le f(x)\le2x^2+3x$를 만족시킬 때, 극한값 $\displaystyle\lim_{x\to0+}\frac{\{f(x)\}^2}{4x^2-xf(x)}$을 구한 것으로 알맞은 것은? [4.5점]
보기 원문: ["1","3","9","18","27"]
```

- 원본 정답: `③`.
- 기존 solution 결정적 실제 구절(발췌):
> 분자와 분모를 $x^2$으로 나누면 $\frac{\{f(x)\}^2}{4x^2-xf(x)}=\frac{(f(x)/x)^2}{4-f(x)/x}\to\frac{3^2}{4-3}=9$입니다.
- 해설 경로·판정 이유·독립 대입 검산: $x\to0+$에서는 $x>0$이므로 부등식을 $x$로 나눈다. $f(x)/x\to3$을 사용해 원식을 $9/(4-3)=9$로 역대입한다.
- 그림/검수: 핵심 수학 조건은 텍스트에 표시되어 있음. 최종 학생 렌더 QA NOT_RUN.
- 현재 상태: READ_EVIDENCED / QA_NOT_RUN.

## Q10 — KEEP

- 출처: source ordinal 10, id `10`, sourceIdentityKey `NOT_PRESENT`, blob `c0fa41f87d31ab9ce3279f63ee5302b35c87b9d1`.
- 문제 조건·보기 원문:

```text
최고차항의 계수가 $1$인 이차함수 $y=f(x)$의 그래프가 $x$축에 접한다. 함수 $g(x)=(x-3)f'(x)$에 대하여 곡선 $y=g(x)$가 $y$축에 대하여 대칭일 때, $g(0)$의 값은? [4.6점]
보기 원문: ["3","-9","9","-18","18"]
```

- 원본 정답: `④`.
- 기존 solution 결정적 실제 구절(발췌):
> 이차함수의 그래프가 $x$축에 접하고 최고차항 계수가 $1$이므로 $f(x)=(x-p)^2$로 놓습니다.
> 따라서 $g(0)=6(-3)=-18$이므로 정답은 ④이다.
- 해설 경로·판정 이유·독립 대입 검산: 접하는 이차함수의 $f=(x-p)^2$ 형태와 $g=2(x-3)(x-p)$의 일차항 소거에서 $p=-3$을 얻는다. $g(0)=-18$이다.
- 그림/검수: 핵심 수학 조건은 텍스트에 표시되어 있음. 최종 학생 렌더 QA NOT_RUN.
- 현재 상태: READ_EVIDENCED / QA_NOT_RUN.

## Q11 — KEEP

- 출처: source ordinal 11, id `11`, sourceIdentityKey `NOT_PRESENT`, blob `c0fa41f87d31ab9ce3279f63ee5302b35c87b9d1`.
- 문제 조건·보기 원문:

```text
다항식 $x^{10}$을 $(x-1)^2$으로 나누었을 때의 나머지를 $R(x)$라 할 때, $R(2)$의 값은? [4.8점]
보기 원문: ["11","13","15","17","19"]
```

- 원본 정답: `①`.
- 기존 solution 결정적 실제 구절(발췌):
> 나머지의 차수는 $2$보다 작으므로 $R(x)=mx+n$입니다.
> 따라서 $R(2)=20-9=11$이므로 정답은 ①이다.
- 해설 경로·판정 이유·독립 대입 검산: $(x-1)^2$로 나눈 일차 나머지 $R=mx+n$은 $R(1)=1$, 미분 대입으로 $R'(1)=10$이다. $R=10x-9$, $R(2)=11$을 확인했다.
- 그림/검수: 핵심 수학 조건은 텍스트에 표시되어 있음. 최종 학생 렌더 QA NOT_RUN.
- 현재 상태: READ_EVIDENCED / QA_NOT_RUN.

## Q12 — KEEP

- 출처: source ordinal 12, id `12`, sourceIdentityKey `NOT_PRESENT`, blob `c0fa41f87d31ab9ce3279f63ee5302b35c87b9d1`.
- 문제 조건·보기 원문:

```text
다항함수 $f(x)$는 $\displaystyle\lim_{x\to\infty}\frac{f(x)}{x^2+2x-3}=3$을 만족시키고, 함수 $g(x)=\begin{cases}\frac1{x+2}&(x\ne-2)\\2&(x=-2)\end{cases}$이다. 두 함수 $f(x),g(x)$에 대하여 함수 $f(x)g(x)$가 실수 전체의 집합에서 연속일 때, $f(0)$의 값은? [5점]
보기 원문: ["8","9","10","11","12"]
```

- 원본 정답: `⑤`.
- 기존 solution 결정적 실제 구절(발췌):
> $x=-2$에서 $f(x)g(x)$가 연속이려면 $f(-2)g(-2)=2f(-2)$와 $\lim_{x\to-2}\frac{f(x)}{x+2}$가 같아야 합니다.
> 그러므로 $f(0)=3\cdot4=12$이고 정답은 ⑤이다.
- 해설 경로·판정 이유·독립 대입 검산: $f(x)g(x)$ 연속에 $f(-2)=0$과 $f'(-2)=0$가 함께 필요하다. 따라서 $f=3(x+2)^2$, 곱은 $x\ne-2$에서 $3(x+2)$로 확장되며 경계값도 0이다.
- 그림/검수: 핵심 수학 조건은 텍스트에 표시되어 있음. 최종 학생 렌더 QA NOT_RUN.
- 현재 상태: READ_EVIDENCED / QA_NOT_RUN.

## Q13 — KEEP

- 출처: source ordinal 13, id `13`, sourceIdentityKey `NOT_PRESENT`, blob `c0fa41f87d31ab9ce3279f63ee5302b35c87b9d1`.
- 문제 조건·보기 원문:

```text
실수 전체의 집합에서 미분가능한 함수 $f(x)$가 모든 두 실수 $x,y$에 대하여 $f(x+y)=f(x)+f(y)-2xy$를 만족시킨다. $f'(0)=4$일 때, $5f'(1)$의 값은? [5.1점]
보기 원문: ["5","10","15","20","25"]
```

- 원본 정답: `②`.
- 기존 solution 결정적 실제 구절(발췌):
> 따라서 $f'(x+y)=f'(y)-2x$입니다.
> $f'(1)=4-2=2$이므로 $5f'(1)=10$입니다.
- 해설 경로·판정 이유·독립 대입 검산: 함수방정식을 두 번째 변수 y에 관해 미분해 $f'(x+y)=f'(y)-2x$를 얻는다. $y=0$에서 $f'(1)=4-2=2$로 조건과 일치한다.
- 그림/검수: 핵심 수학 조건은 텍스트에 표시되어 있음. 최종 학생 렌더 QA NOT_RUN.
- 현재 상태: READ_EVIDENCED / QA_NOT_RUN.

## Q14 — KEEP

- 출처: source ordinal 14, id `14`, sourceIdentityKey `NOT_PRESENT`, blob `c0fa41f87d31ab9ce3279f63ee5302b35c87b9d1`.
- 문제 조건·보기 원문:

```text
좌표평면에서 반지름의 길이가 $t$인 원 $x^2+y^2=t^2$의 내부에 포함되고 $x$좌표와 $y$좌표가 모두 정수인 점의 개수를 $f(t)$라 하자. 예를 들어, $f(1)=1$이고 $f(\sqrt2)=5$이다. $0\lt t\lt5$인 실수 $t$에 대하여 함수 $f(t)$가 불연속이 되는 $t$의 개수는? [5.2점]
보기 원문: ["10","11","12","13","14"]
```

- 원본 정답: `③`.
- 기존 solution 결정적 실제 구절(발췌):
> 따라서 정수 격자점의 제곱거리 $n=x^2+y^2$를 $t^2$가 지날 때 점 개수가 바뀝니다.
> 원점은 모든 $t\gt0$에서 이미 내부에 있으므로 $n=0$은 제외합니다.
- 해설 경로·판정 이유·독립 대입 검산: 원의 내부는 엄격부등식 $x^2+y^2<t^2$이므로 변화점은 25 미만의 서로 다른 두 제곱수의 합 12개다. $t=\sqrt n$에서 이산 점이 추가되는 경계를 정확히 셌다.
- 그림/검수: 핵심 수학 조건은 텍스트에 표시되어 있음. 최종 학생 렌더 QA NOT_RUN.
- 현재 상태: READ_EVIDENCED / QA_NOT_RUN.

## Q15 — KEEP

- 출처: source ordinal 15, id `15`, sourceIdentityKey `NOT_PRESENT`, blob `c0fa41f87d31ab9ce3279f63ee5302b35c87b9d1`.
- 문제 조건·보기 원문:

```text
실수 전체 집합에서 연속인 함수 $f(x)$가 모든 실수 $x$에 대하여 다음 두 조건을 만족시킨다.<div class="question-note-box">(가) $f(-x)=f(x)$<br>(나) $f(x+4)=f(x)$</div> 함수 $f(x)$에 대하여 $f(0)=2$, $f(1)=-3$, $f(2)=1$일 때, 닫힌구간 $[-4,6]$에서 방정식 $f(x)=0$은 적어도 $N$개의 실근을 갖는다. $N$의 값을 구하시오. [5점]
보기 원문: []
```

- 원본 정답: `10`.
- 기존 solution 결정적 실제 구절(발췌):
> (가)에서 $f$는 짝함수이고, (나)에서 주기는 $4$입니다.
> 따라서 구하는 값은 $10$이다.
- 해설 경로·판정 이유·독립 대입 검산: 짝함수·주기4로 정수 $-4,\ldots,6$의 부호가 10개 인접구간마다 교대한다. 사잇값 정리로 최소 10개이며 제시된 선분 확장 예가 달성 가능성을 보여 준다.
- 그림/검수: `solutionImage` 링크 존재, 원본 문제의 수식으로 잠정 수학 판정. SVG 이미지 자체의 독립 시각 검증 NOT_RUN.
- 현재 상태: READ_EVIDENCED / QA_NOT_RUN.

## Q16 — KEEP

- 출처: source ordinal 16, id `16`, sourceIdentityKey `NOT_PRESENT`, blob `c0fa41f87d31ab9ce3279f63ee5302b35c87b9d1`.
- 문제 조건·보기 원문:

```text
두 다항함수 $f(x),g(x)$에 대하여 $f'(4)=5g'(2)$이고 $\displaystyle\lim_{x\to2}\frac{f(x+2)-g(x)}{x^3-8}=1$일 때, $f'(4)\times g'(2)$의 값을 구하시오. [5점]
보기 원문: []
```

- 원본 정답: `45`.
- 기존 solution 결정적 실제 구절(발췌):
> 분모 $x^3-8$은 $x\to2$에서 $0$이므로 극한값이 유한하려면 분자도 $0$이 되어 $f(4)=g(2)$입니다.
> 따라서 구하는 값은 $15\times3=45$이다.
- 해설 경로·판정 이유·독립 대입 검산: 분자의 $f(4)-g(2)=0$이 우선 필요하다. 미분계수 차를 $x^3-8$의 약분 결과 12에 맞춰 $f'(4)-g'(2)=12$를 얻고 $5u-u=12$로 45를 확인한다.
- 그림/검수: 핵심 수학 조건은 텍스트에 표시되어 있음. 최종 학생 렌더 QA NOT_RUN.
- 현재 상태: READ_EVIDENCED / QA_NOT_RUN.

## Q17 — KEEP

- 출처: source ordinal 17, id `17`, sourceIdentityKey `NOT_PRESENT`, blob `c0fa41f87d31ab9ce3279f63ee5302b35c87b9d1`.
- 문제 조건·보기 원문:

```text
함수 $f(x)=x^2-4x+5$와 두 상수 $a,b$에 대하여 함수 $g(x)=\begin{cases}f(x+a)+b&(x\lt0)\\f(x)&(x\ge0)\end{cases}$이 실수 전체의 집합에서 연속이다. 실수 $t$에 대하여 함수 $y=g(x)$의 그래프와 직선 $y=t$가 만나는 점의 개수를 $h(t)$라 하자. $\displaystyle\left|\lim_{t\to k+}h(t)-\lim_{t\to k-}h(t)\right|=2$를 만족시키는 서로 다른 모든 실수 $k$의 값이 $1,4,5$일 때, $a+b$의 값을 구하시오. [5점]
보기 원문: []
```

- 원본 정답: `6`.
- 기존 solution 결정적 실제 구절(발췌):
> $f(x)=(x-2)^2+1$이므로 오른쪽 가지 $x\ge0$은 꼭짓점 $(2,1)$을 갖고, 경계 $x=0$에서의 값은 $5$입니다.
> 그러므로 $a=3$, $b=3$이고 구하는 값은 $a+b=6$이다.
- 해설 경로·판정 이유·독립 대입 검산: 오른쪽 곡선의 꼭짓점 높이 1, 경계 높이 5가 주어진 변화점이다. 나머지 높이 4가 왼쪽 내부 꼭짓점이어서 $b=3,a=3$이 유일함을 확인한다.
- 그림/검수: `solutionImage` 링크 존재, 원본 문제의 수식으로 잠정 수학 판정. SVG 이미지 자체의 독립 시각 검증 NOT_RUN.
- 현재 상태: READ_EVIDENCED / QA_NOT_RUN.

## Q18 — KEEP

- 출처: source ordinal 18, id `18`, sourceIdentityKey `NOT_PRESENT`, blob `c0fa41f87d31ab9ce3279f63ee5302b35c87b9d1`.
- 문제 조건·보기 원문:

```text
함수 $f(x)=x^3-6x^2+ax+10$에 대하여 함수 $g(x)=\begin{cases}b-f(x)&(x\lt3)\\f(x)&(x\ge3)\end{cases}$이 실수 전체의 집합에서 미분가능할 때, 함수 $g(x)$의 극솟값을 $c$라 하자. $a+b+c$의 값을 구하시오. (단, $a,b,c$는 상수이다.) [5점]
보기 원문: []
```

- 원본 정답: `35`.
- 기존 solution 결정적 실제 구절(발췌):
> $x=3$에서 미분가능하려면 연속 조건과 양쪽 도함수 일치 조건이 모두 필요합니다.
> 따라서 구하는 값은 $a+b+c=9+20+6=35$이다.
- 해설 경로·판정 이유·독립 대입 검산: 경계 $x=3$의 양쪽 도함수 일치로 $a=9$, 연속성으로 $b=20$을 정한다. $g'= -3(x-1)(x-3)$의 부호 변화로 극솟값 $g(1)=6$, 합 35다.
- 그림/검수: `solutionImage` 링크 존재, 원본 문제의 수식으로 잠정 수학 판정. SVG 이미지 자체의 독립 시각 검증 NOT_RUN.
- 현재 상태: READ_EVIDENCED / QA_NOT_RUN.

## Q19 — KEEP

- 출처: source ordinal 19, id `19`, sourceIdentityKey `NOT_PRESENT`, blob `c0fa41f87d31ab9ce3279f63ee5302b35c87b9d1`.
- 문제 조건·보기 원문:

```text
함수 $g(x)=|x-3|$에 대하여, $x=3$에서의 연속성을 조사하시오. 또한 극한값 $\displaystyle\lim_{h\to0}\frac{g(3+h)-g(3-h)}{h}$의 수렴 발산 여부를 판단하고 그 근거를 제시하시오. [6점, 부분점수 있음]
보기 원문: []
```

- 원본 정답: `연속, 0으로 수렴`.
- 기존 solution 결정적 실제 구절(발췌):
> 먼저 $g(3)=|3-3|=0$입니다.
> 따라서 $x=3$에서 연속이고, 구하는 극한값은 $0$이다.
- 해설 경로·판정 이유·독립 대입 검산: $g(3\pm h)=|h|$가 같으므로 차의 몫이 0이다. 동시에 $\lvert x-3\rvert$의 한쪽 미분계수가 -1과 1로 다름을 분리해 설명한다.
- 그림/검수: `solutionImage` 링크 존재, 원본 문제의 수식으로 잠정 수학 판정. SVG 이미지 자체의 독립 시각 검증 NOT_RUN.
- 현재 상태: READ_EVIDENCED / QA_NOT_RUN.

## Q20 — HOLD

- 출처: source ordinal 20, id `20`, sourceIdentityKey `NOT_PRESENT`, blob `c0fa41f87d31ab9ce3279f63ee5302b35c87b9d1`.
- 문제 조건·보기 원문:

```text
그림과 같이 좌표평면에서 원 $x^2+y^2=2$와 곡선 $y=x^2$이 제1사분면에서 만나는 점을 $A$라 하자. 실수 $t$ $(0\lt t\lt2)$에 대하여 직선 $y=tx$가 원 $x^2+y^2=2$, 곡선 $y=x^2$과 제1사분면에서 만나는 점을 각각 $P,Q$라 하자. 선분 $\overline{PQ}$의 길이를 $l(t)$라 할 때, 극한값 $\displaystyle\lim_{t\to1-}\frac{l(t)}{1-t}$의 값을 풀이과정과 함께 구하시오. [7점, 부분점수 있음]
보기 원문: []
```

- 원본 정답: `$\frac{3\sqrt2}{2}$`.
- 기존 solution 결정적 실제 구절(발췌):
> 점 $P,Q$는 모두 원점에서 출발하는 반직선 $y=tx$ 위에 있습니다.
> $H'(t)=\sqrt{1+t^2}+\frac{t^2}{\sqrt{1+t^2}}$이므로 $H'(1)=\sqrt2+\frac1{\sqrt2}=\frac{3\sqrt2}{2}$입니다.
- 해설 경로·판정 이유·독립 대입 검산: 직선 $y=tx$ 위 두 거리 $OP=\sqrt2$, $OQ=t\sqrt{1+t^2}$와 미분계수 접근은 확인했지만, 문제 원본 q20.png의 제1사분면 교점 표시는 직접 시각 판독하지 못해 HOLD다.
- 그림/검수: 원본 문제 이미지 `assets/images/26_팔마고_2학기_중간_고2_미적분I/q20.png` 시각 판독 NOT_RUN. 따라서 원본 좌표·부호·경계를 검증할 때까지 HOLD.
- 현재 상태: VISUAL_HOLD.

## Q21 — UPGRADE

- 출처: source ordinal 21, id `21`, sourceIdentityKey `NOT_PRESENT`, blob `c0fa41f87d31ab9ce3279f63ee5302b35c87b9d1`.
- 문제 조건·보기 원문:

```text
최고차항의 계수가 $1$인 삼차함수 $f(x)$가 다음 조건을 만족시킬 때, $f'(2)$의 값을 구하는 풀이 과정과 답을 구하시오. (단, 로피탈 정리 등 고등학교 교육과정 외의 개념은 이용을 금지함.) [7점, 부분점수 있음]<div class="question-note-box">(가) $\displaystyle\lim_{x\to1}\frac{f(x)-f(1)}{(x-1)^2}$의 값이 존재한다.<br>(나) $\displaystyle\lim_{x\to1}\frac{f(x^2-1)-f(0)}{f(x)-f(1)}$의 값이 존재한다.</div>
보기 원문: []
```

- 원본 정답: `6`.
- 기존 solution 결정적 실제 구절(발췌):
> $f(x)=x^3+Ax^2+Bx+C$로 놓습니다.
> 따라서 $f'(x)=3x^2-3x$이고 $f'(2)=12-6=6$입니다.
- 해설 경로·판정 이유·독립 대입 검산: $f'(1)=0$에서 $B=-3-2A$까지는 명시했으나, $(x-1)^2$ 분모와 합성함수 $f(x^2-1)$의 1차항을 비교하는 구간이 압축됐다. $A=-3$ 예외와 $B=0$ 필요성을 작은 항까지 전개한다.
- 그림/검수: 핵심 수학 조건은 텍스트에 표시되어 있음. 최종 학생 렌더 QA NOT_RUN.
- 현재 상태: DRAFT_STAGED / QA_NOT_RUN.

### 완성 학생용 대체 solution (JS 이관용 전체)

삼차함수의 최고차항 계수가 $1$이므로
$$f(x)=x^3+Ax^2+Bx+C$$
라고 두자.

(가)에서 분모가 $(x-1)^2$이므로 유한한 극한이 존재하려면 분자에 $(x-1)^2$가 인수로 있어야 한다. 특히
$$
\begin{aligned}
f'(1)&=3+2A+B=0,\\
B&=-3-2A.
\end{aligned}
$$
이 조건을 반영하여 식을 직접 인수분해하면
$$
f(x)-f(1)=(x-1)^2(x+A+2).
$$

(나)의 분자는 $u=x^2-1$로 놓으면
$$
\begin{aligned}
f(u)-f(0)&=u^3+Au^2+Bu\\
&=u\{u^2+Au+B\},\\
u&=(x-1)(x+1)
\end{aligned}
$$
이고, 분모는 $(x-1)^2(x+A+2)$이다.

**① $A=-3$인 경우:** $B=-3-2(-3)=3$이고 분모는 $(x-1)^3$이다. 분자는 $u(u^2-3u+3)$이므로 $x\to1$에서 $u/(x-1)\to2$, 괄호는 $3$으로 간다. 이때 비의 절댓값은 $(x-1)^{-2}$에 비례하여 커지므로 유한한 극한이 없다.

**② $A\ne-3$인 경우:** $x+A+2\to A+3\ne0$이다. (나)의 비를 $x\ne1$에서 약분하면
$$
\frac{f(x^2-1)-f(0)}{f(x)-f(1)}
=\frac{(x+1)\{(x^2-1)^2+A(x^2-1)+B\}}
{(x-1)(x+A+2)}.
$$
여기서 $x\to1$일 때 분모는 0으로 가고, 분자의 극한은 $2B$이다. 유한한 극한이 존재하려면 $B=0$이어야 한다. 따라서
$$
-3-2A=0,\qquad A=-\frac32.
$$
이 값을 넣으면 분자의 중괄호가 $(x^2-1)\{(x^2-1)-\frac32\}$가 되어 $(x-1)$을 한 번 더 약분할 수 있으므로 실제 극한이 존재한다.

그러므로
$$
\begin{aligned}
f'(x)&=3x^2+2Ax+B=3x^2-3x,\\
f'(2)&=3\cdot4-3\cdot2=6.
\end{aligned}
$$
정답은 $6$이다.

**독립 검산:** $f(x)=x^3-\frac32x^2+C$로 놓으면 (가)의 분자는 $(x-1)^2(x+\frac12)$이고, (나)의 분자는 $(x^2-1)^2(x^2-\frac52)$로 적어도 $(x-1)^2$를 인수로 갖는다. 두 극한은 유한하다.

## 총괄·재개 위치

- 문항 분모: 21; KEEP 19 + UPGRADE 1 + HOLD 1 + UNREAD 0 = 21.
- 대체 학생용 풀이가 들어 있는 문항: Q21.
- 추가 시각 확인이 필요한 문항: Q20.
- 모든 UPGRADE 전체 풀이가 본 MD에 들어 있음. 원본 JS/보기/정답/기존 SVG 및 main 변경 없음.
- Golden/Negative, 최종 독립 수학·교육과정 재검증, JS 원본 보호 diff/문법, 학생 화면 exam/sol/ans 렌더: **NOT_RUN**. 출고 PASS·main 병합 아님.
