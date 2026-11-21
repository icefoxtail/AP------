# 미적분Ⅰ 심층 감사 — 26_효천고_2학기_중간_고2_미적분I

- 대상: `archive/exams/original/high/h2/2mid/26_효천고_2학기_중간_고2_미적분I.js` (미적분I, 기출, 2026년 2학기 중간)
- 원본 ref: `main`, blob: `d8921cbab8981c84f871103dfe871f8db286e3ad`; 문항 분모 **23**.
- 판정: **KEEP 20 / UPGRADE 1 / HOLD 2 / UNREAD 0**. 문항별 원문·기존 해설·판정 근거 아래 기록.
- 작업 브랜치: `work/solution-upgrade-lane-10-20261121`; MD 경로: `docs/operations/solution-upgrade-reservations/staged/calculus1/26_효천고_2학기_중간_고2_미적분I_DEEP_AUDIT.md`.
- 기준 자료: `HARNESS_CURRENT.md`, `DEEP_QUESTION_AUDIT_TEMPLATE_CURRENT.md`, `BOARD_SOLUTION_SAMPLES_CURRENT.md`, `docs-manifest.json` core 문서 본문을 2026-11-21 접근·확인. Golden/Negative 독립 샘플·자동 preflight·SHA-256 영수증 검증: **NOT_RUN**. 운영 독립 수학·학생 화면·SVG QA: **NOT_RUN**.
- 문제 그림 문항 Q11, Q17은 이미지의 점·화살표·함숫값을 시각 판독하지 못해 **VISUAL_HOLD**. 기존 `solutionImage` 렌더도 **NOT_RUN**.
- 상태: **EXAM_AUDIT_COMPLETE(전 문항 근거 기록)** / **EXAM_DRAFT_COMPLETE(개선 1문항 전체 풀이 수록)** / **QA_NOT_RUN**. next_qid 없음, 시각 검증 미해결: 11, 17.

## Q01 — KEEP

- 출처: source ordinal 1, id `1`, sourceIdentityKey `NOT_PRESENT`, blob `d8921cbab8981c84f871103dfe871f8db286e3ad`.
- 문제 조건·보기 원문:

```text
함수 $f(x)=3x^2+1$의 $x=1$에서의 미분계수는? [3.3점]
보기 원문: ["2","3","4","5","6"]
```

- 원본 정답: `⑤`.
- 기존 solution 결정적 실제 구절(발췌):
> 미분계수 $f'(1)$은 $x=1$에서의 순간변화율이다.
> 따라서 $f'(1)=6\times1=6$이므로 정답은 ⑤이다.
- 해설 경로·판정 이유·독립 대입 검산: $3x^2+1$의 도함수 $6x$에서 $f'(1)=6$을 얻는다. 접점과 순간변화율의 구분을 명확히 했다.
- 그림/검수: 핵심 수학 조건은 텍스트에 표시되어 있음. 최종 학생 렌더 QA NOT_RUN.
- 현재 상태: READ_EVIDENCED / QA_NOT_RUN.

## Q02 — KEEP

- 출처: source ordinal 2, id `2`, sourceIdentityKey `NOT_PRESENT`, blob `d8921cbab8981c84f871103dfe871f8db286e3ad`.
- 문제 조건·보기 원문:

```text
함수 $f(x)=\begin{cases}x+a&(x\lt-1)\\3x-2&(x\ge-1)\end{cases}$에 대하여 $\lim_{x\to-1+}f(x)=\lim_{x\to-1-}f(x)$를 만족할 때, $a$의 값은? [3.4점]
보기 원문: ["-1","-2","-3","-4","-5"]
```

- 원본 정답: `④`.
- 기존 solution 결정적 실제 구절(발췌):
> $x=-1$의 오른쪽에서는 $3x-2$, 왼쪽에서는 $x+a$의 식을 사용한다.
> 두 극한이 같다는 조건에서 $-5=-1+a$이므로 $a=-4$이다.
- 해설 경로·판정 이유·독립 대입 검산: 경계 $x=-1$의 좌극한 $a-1$, 우극한 $-5$를 같게 한다. $a=-4$를 양쪽 식에 대입하면 둘 다 -5다.
- 그림/검수: `solutionImage` 링크 존재, 원본 문제의 수식으로 잠정 수학 판정. SVG 이미지 자체의 독립 시각 검증 NOT_RUN.
- 현재 상태: READ_EVIDENCED / QA_NOT_RUN.

## Q03 — KEEP

- 출처: source ordinal 3, id `3`, sourceIdentityKey `NOT_PRESENT`, blob `d8921cbab8981c84f871103dfe871f8db286e3ad`.
- 문제 조건·보기 원문:

```text
극한값 $\displaystyle\lim_{x\to1}\frac{\sqrt{x+1}-\sqrt2}{x-1}$의 값은? [3.5점]
보기 원문: ["$\\frac{\\sqrt2}{4}$","$\\frac12$","$\\frac{\\sqrt2}{2}$","$\\frac{\\sqrt3}{2}$","$\\frac34$"]
```

- 원본 정답: `①`.
- 기존 solution 결정적 실제 구절(발췌):
> $\displaystyle\frac{\sqrt{x+1}-\sqrt2}{x-1}\cdot\frac{\sqrt{x+1}+\sqrt2}{\sqrt{x+1}+\sqrt2}=\frac{x-1}{(x-1)(\sqrt{x+1}+\sqrt2)}=\frac{1}{\sqrt{x+1}+\sqrt2}$이다.
> $x\to1$을 대입하면 $\displaystyle\frac{1}{2\sqrt2}=\frac{\sqrt2}{4}$이다.
- 해설 경로·판정 이유·독립 대입 검산: 분자에 켤레식을 곱해 $(x+1)-2=x-1$을 약분한다. $x\ne1$에서 극한 $1/(2\sqrt2)=\sqrt2/4$를 직접 확인한다.
- 그림/검수: 핵심 수학 조건은 텍스트에 표시되어 있음. 최종 학생 렌더 QA NOT_RUN.
- 현재 상태: READ_EVIDENCED / QA_NOT_RUN.

## Q04 — KEEP

- 출처: source ordinal 4, id `4`, sourceIdentityKey `NOT_PRESENT`, blob `d8921cbab8981c84f871103dfe871f8db286e3ad`.
- 문제 조건·보기 원문:

```text
모든 실수 $x$에서 함수 $f(x)=\begin{cases}2x^2+3x+a&(x\ne a)\\-2x-4&(x=a)\end{cases}$가 연속일 때, 모든 실수 $a$의 값의 곱은? [3.6점]
보기 원문: ["1","2","3","4","5"]
```

- 원본 정답: `②`.
- 기존 solution 결정적 실제 구절(발췌):
> $x=a$ 이외의 점에서는 다항식이므로 연속이다.
> 그러므로 가능한 값은 $a=-1,-2$이고, 곱은 $(-1)(-2)=2$이다.
- 해설 경로·판정 이유·독립 대입 검산: 유일한 연결점 $x=a$의 다항식 극한 $2a^2+4a$와 정의값 $-2a-4$를 같다 놓는다. $a=-1,-2$ 모두 성립하고 곱은 2다.
- 그림/검수: 핵심 수학 조건은 텍스트에 표시되어 있음. 최종 학생 렌더 QA NOT_RUN.
- 현재 상태: READ_EVIDENCED / QA_NOT_RUN.

## Q05 — KEEP

- 출처: source ordinal 5, id `5`, sourceIdentityKey `NOT_PRESENT`, blob `d8921cbab8981c84f871103dfe871f8db286e3ad`.
- 문제 조건·보기 원문:

```text
함수 $f(x)=x^3-ax^2+bx-2$의 그래프 위의 점 $(2,0)$에서의 접선의 기울기가 $3$일 때, 두 상수 $a,b$에 대하여 $a+b$의 값은? [3.7점]
보기 원문: ["0","2","4","6","8"]
```

- 원본 정답: `④`.
- 기존 solution 결정적 실제 구절(발췌):
> 점 $(2,0)$이 그래프 위에 있으므로 $f(2)=0$이다.
> 따라서 $a+b=6$이므로 정답은 ④이다.
- 해설 경로·판정 이유·독립 대입 검산: 점 $(2,0)$이 주는 $2a-b=3$과 접선 기울기 3이 주는 $4a-b=9$를 연립한다. $a=b=3$을 원래 함수/도함수에 대입해 확인한다.
- 그림/검수: 핵심 수학 조건은 텍스트에 표시되어 있음. 최종 학생 렌더 QA NOT_RUN.
- 현재 상태: READ_EVIDENCED / QA_NOT_RUN.

## Q06 — KEEP

- 출처: source ordinal 6, id `6`, sourceIdentityKey `NOT_PRESENT`, blob `d8921cbab8981c84f871103dfe871f8db286e3ad`.
- 문제 조건·보기 원문:

```text
양수 $k$와 함수 $f(x)=4x^3+8x^2+3x$에 대하여 닫힌구간 $[-k,0]$에서 롤의 정리를 만족시키는 실수 $c$의 값이 존재하도록 하는 모든 양수 $k$의 값의 합은? [3.7점]
보기 원문: ["1","2","3","4","5"]
```

- 원본 정답: `②`.
- 기존 solution 결정적 실제 구절(발췌):
> 다항함수는 모든 닫힌구간에서 연속이고 열린구간에서 미분가능하므로 롤의 정리의 나머지 조건은 $f(-k)=f(0)$이다.
> 두 경우 모두 롤의 정리에 의해 $(-k,0)$ 안에 $f'(c)=0$인 $c$가 실제로 존재한다.
- 해설 경로·판정 이유·독립 대입 검산: 롤의 정리의 전제인 다항식 연속·미분가능을 확인하고, $f(-k)=f(0)=0$에서 $k=1/2,3/2$을 얻는다. 각각 열린구간 내 미분계수 0이 보장된다.
- 그림/검수: `solutionImage` 링크 존재, 원본 문제의 수식으로 잠정 수학 판정. SVG 이미지 자체의 독립 시각 검증 NOT_RUN.
- 현재 상태: READ_EVIDENCED / QA_NOT_RUN.

## Q07 — KEEP

- 출처: source ordinal 7, id `7`, sourceIdentityKey `NOT_PRESENT`, blob `d8921cbab8981c84f871103dfe871f8db286e3ad`.
- 문제 조건·보기 원문:

```text
실수 $t$에 대하여 유리함수 $y=\frac{4}{3x-2}+2$와 직선 $y=t$가 만나는 점의 개수를 $f(t)$라 하자. 함수 $g(x)=2x+a$에 대하여 함수 $f(x)g(x)$가 실수 전체의 집합에서 연속일 때, $a$의 값은? (단, $a$는 상수이다.) [3.8점]
보기 원문: ["-4","-2","$-\\frac43$","$\\frac43$","4"]
```

- 원본 정답: `①`.
- 기존 solution 결정적 실제 구절(발췌):
> $\frac{4}{3x-2}$는 $0$이 될 수 없으므로 수평선 $y=2$와는 만나지 않고, $y=t$ ($t\ne2$)와는 한 번 만난다.
> 따라서 $a=-4$이므로 정답은 ①이다.
- 해설 경로·판정 이유·독립 대입 검산: 수평선 $y=2$에서 유리함수의 교점수가 0, 나머지는 1임을 대입 확인한다. $f(x)g(x)$의 유일한 불연속 후보 $x=2$에서 $4+a=0$으로 $a=-4$다.
- 그림/검수: `solutionImage` 링크 존재, 원본 문제의 수식으로 잠정 수학 판정. SVG 이미지 자체의 독립 시각 검증 NOT_RUN.
- 현재 상태: READ_EVIDENCED / QA_NOT_RUN.

## Q08 — KEEP

- 출처: source ordinal 8, id `8`, sourceIdentityKey `NOT_PRESENT`, blob `d8921cbab8981c84f871103dfe871f8db286e3ad`.
- 문제 조건·보기 원문:

```text
함수 $f(x)=mx+1$에 대하여 $\displaystyle\lim_{h\to0}\frac{f(a+4h)+f(a)-4}{h}=12$일 때, $f(3a)$의 값은? [3.9점]
보기 원문: ["2","3","4","5","6"]
```

- 원본 정답: `③`.
- 기존 solution 결정적 실제 구절(발췌):
> $f(a+4h)=m(a+4h)+1$, $f(a)=ma+1$이므로 주어진 분자는 $2ma-2+4mh$이다.
> $f(3a)=3(3a)+1=3\cdot1+1=4$이다.
- 해설 경로·판정 이유·독립 대입 검산: 극한의 유한성을 위해 $2ma-2=0$이 필요하고, 잔여상수 $4m=12$다. $m=3,a=1/3$을 대입하면 $f(3a)=4$다.
- 그림/검수: 핵심 수학 조건은 텍스트에 표시되어 있음. 최종 학생 렌더 QA NOT_RUN.
- 현재 상태: READ_EVIDENCED / QA_NOT_RUN.

## Q09 — KEEP

- 출처: source ordinal 9, id `9`, sourceIdentityKey `NOT_PRESENT`, blob `d8921cbab8981c84f871103dfe871f8db286e3ad`.
- 문제 조건·보기 원문:

```text
닫힌구간 $[-2,3]$에서 정의된 함수 $f(x)$가 $\displaystyle f(x)=\lim_{t\to\infty}\frac{1-2tx}{1+t}(x-2)$이다. 함수 $f(x)$의 최댓값과 최솟값의 곱은? [4점]
보기 원문: ["32","16","4","-16","-32"]
```

- 원본 정답: `⑤`.
- 기존 solution 결정적 실제 구절(발췌):
> 먼저 $\displaystyle\lim_{t\to\infty}\frac{1-2tx}{1+t}=-2x$이므로 $f(x)=-2x(x-2)=-2(x-1)^2+2$이다.
> 따라서 두 값의 곱은 $2\times(-16)=-32$이므로 정답은 ⑤이다.
- 해설 경로·판정 이유·독립 대입 검산: $t\to\infty$에서 $\frac{1-2tx}{1+t}\to-2x$이므로 $f=-2(x-1)^2+2$다. $x=1$ 최대 2와 $x=-2$ 최소 -16의 곱 -32를 확인한다.
- 그림/검수: `solutionImage` 링크 존재, 원본 문제의 수식으로 잠정 수학 판정. SVG 이미지 자체의 독립 시각 검증 NOT_RUN.
- 현재 상태: READ_EVIDENCED / QA_NOT_RUN.

## Q10 — KEEP

- 출처: source ordinal 10, id `10`, sourceIdentityKey `NOT_PRESENT`, blob `d8921cbab8981c84f871103dfe871f8db286e3ad`.
- 문제 조건·보기 원문:

```text
다항함수 $f(x)$가 다음 조건을 만족시킬 때, $f(4)$의 값은? (단, $k$는 상수이다.) [4.1점]<div class="question-note-box"><strong>〈조건〉</strong><br>(가) $\displaystyle\lim_{x\to\infty}\frac{f(x)+x^2-x}{x^2-2f(x)}=-2$<br>(나) $\displaystyle\lim_{x\to-1}\frac{f(x)}{(x+1)^2}=k$</div>
보기 원문: ["10","15","20","25","30"]
```

- 원본 정답: `④`.
- 기존 solution 결정적 실제 구절(발췌):
> $f(x)=Ax^2+Bx+C$로 두고 최고차항을 비교하면 $\frac{A+1}{1-2A}=-2$이다.
> $f(x)=(x+1)^2$이고 $f(4)=25$이다.
- 해설 경로·판정 이유·독립 대입 검산: (가)에서 계수 $A=1$, (나)에서 $x=-1$ 이중근을 요구한다. $f=(x+1)^2$를 두 원래 극한에 직접 넣으면 각각 -2와 1로 조건을 만족한다.
- 그림/검수: 핵심 수학 조건은 텍스트에 표시되어 있음. 최종 학생 렌더 QA NOT_RUN.
- 현재 상태: READ_EVIDENCED / QA_NOT_RUN.

## Q11 — HOLD

- 출처: source ordinal 11, id `11`, sourceIdentityKey `NOT_PRESENT`, blob `d8921cbab8981c84f871103dfe871f8db286e3ad`.
- 문제 조건·보기 원문:

```text
다음 그림과 같이 직선 $y=\frac12x+1$ 위의 두 점 $A(-2,0)$, $P(t,\frac12t+1)$이 있다. 점 $P$를 지나고 직선 $y=\frac12x+1$에 수직인 직선이 $y$축과 만나는 점을 $Q$라고 할 때, 극한값 $\displaystyle\lim_{t\to\infty}\frac{\overline{AP}^{\,2}}{\overline{AQ}^{\,2}}$의 값은? [4.3점]
보기 원문: ["$\\frac13$","$\\frac14$","$\\frac15$","$\\frac16$","$\\frac17$"]
```

- 원본 정답: `③`.
- 기존 solution 결정적 실제 구절(발췌):
> 수선의 방정식은 $y-(\frac12t+1)=-2(x-t)$이다.
> 분자와 분모를 $t^2$으로 나눠 $t\to\infty$를 보내면 $\displaystyle\frac{\frac54}{\frac{25}{4}}=\frac15$이다.
- 해설 경로·판정 이유·독립 대입 검산: 교점의 수선 $Q=(0,\frac52 t+1)$과 거리 제곱 식은 계산으로 확인된다. 다만 문항 q11.png의 점·수선 배치를 실제로 확인하지 못했으므로 그림 기반 정답 출고는 HOLD다.
- 그림/검수: 원본 문제 이미지 `assets/images/26_효천고_2학기_중간_고2_미적분I/q11.png` 시각 판독 NOT_RUN. 따라서 원본 좌표·부호·경계를 검증할 때까지 HOLD.
- 현재 상태: VISUAL_HOLD.

## Q12 — KEEP

- 출처: source ordinal 12, id `12`, sourceIdentityKey `NOT_PRESENT`, blob `d8921cbab8981c84f871103dfe871f8db286e3ad`.
- 문제 조건·보기 원문:

```text
어느 섬과 육지를 좌표평면 위에 나타냈을 때, 섬의 경계는 $y=x^2+3x+2$ 모양이고, 육지의 경계는 직선 $y=-x-7$의 모양이다. 섬과 육지를 연결하는 다리를 그 길이가 최소가 되도록 건설하려고 할 때, 다리의 최소 길이를 구한 것은? [4.5점]
보기 원문: ["$\\frac{5\\sqrt2}{2}$","$\\frac{5\\sqrt2}{4}$","$\\frac{2\\sqrt5}{5}$","$\\frac{\\sqrt5}{5}$","$\\frac{7\\sqrt5}{6}$"]
```

- 원본 정답: `①`.
- 기존 solution 결정적 실제 구절(발췌):
> 점 $P$에서 육지의 직선 $x+y+7=0$까지의 최단 거리는 수선의 길이이다.
> 등호는 $x=-2$에서 성립하며, 이 점에서 수선의 발이 직선 위에 존재한다.
- 해설 경로·판정 이유·독립 대입 검산: 곡선의 임의 점에서 직선까지 수선거리 $|(x+2)^2+5|/\sqrt2$를 최솟값으로 본다. $x=-2$에서 하한 $5/\sqrt2$를 실제 달성한다.
- 그림/검수: `solutionImage` 링크 존재, 원본 문제의 수식으로 잠정 수학 판정. SVG 이미지 자체의 독립 시각 검증 NOT_RUN.
- 현재 상태: READ_EVIDENCED / QA_NOT_RUN.

## Q13 — UPGRADE

- 출처: source ordinal 13, id `13`, sourceIdentityKey `NOT_PRESENT`, blob `d8921cbab8981c84f871103dfe871f8db286e3ad`.
- 문제 조건·보기 원문:

```text
다항식 $(x^2-1)(x^2+ax)-6$을 $(x-2)^2$으로 나누었을 때의 나머지를 $R(x)$라 하자. $R(x)$가 $x-2$로 나누어 떨어질 때, $R(a+1)$의 값은? (단, $a$는 상수이다.) [4.7점]
보기 원문: ["-34","-54","-74","-94","-104"]
```

- 원본 정답: `①`.
- 기존 solution 결정적 실제 구절(발췌):
> $P(x)=(x^2-1)(x^2+ax)-6$이라 놓자.
> 따라서 $R(x)=17(x-2)$이며 $a+1=0$이므로 $R(a+1)=R(0)=-34$이다.
- 해설 경로·판정 이유·독립 대입 검산: $R(2)=P(2)$ 및 $R'(2)=P'(2)$를 적용한 결과는 맞지만, 왜 $(x-2)^2$로 나눴을 때 두 값이 같아지는지 중간 근거가 없다. 다항식 나눗셈 등식을 직접 세워 유도한다.
- 그림/검수: 핵심 수학 조건은 텍스트에 표시되어 있음. 최종 학생 렌더 QA NOT_RUN.
- 현재 상태: DRAFT_STAGED / QA_NOT_RUN.

### 완성 학생용 대체 solution (JS 이관용 전체)

$P(x)=(x^2-1)(x^2+ax)-6$이라고 하자.

$(x-2)^2$로 나눈 나머지는 일차 이하이므로
$$
P(x)=(x-2)^2Q(x)+R(x),\qquad R(x)=mx+n
$$
으로 쓸 수 있다. $x=2$를 대입하면 제곱 인수가 $0$이 되어
$$P(2)=R(2).$$
양변을 미분하면
$$
P'(x)=2(x-2)Q(x)+(x-2)^2Q'(x)+R'(x)
$$
이므로 $x=2$에서
$$P'(2)=R'(2)=m$$
도 성립한다. 이 두 식이 나머지의 계수를 정하는 근거다.

나머지 $R$가 $x-2$로 나누어떨어지므로 $R(2)=0$이다. 따라서
$$
\begin{aligned}
0&=P(2)\\
&=(4-1)(4+2a)-6\\
&=12+6a-6\\
&=6+6a,\\
a&=-1.
\end{aligned}
$$
이제 곱의 미분법으로
$$
P'(x)=2x(x^2+ax)+(x^2-1)(2x+a)
$$
이고, $a=-1$을 대입해
$$
\begin{aligned}
m=P'(2)&=2\cdot2(4-2)+(4-1)(4-1)\\
&=4\cdot2+3\cdot3\\
&=17.
\end{aligned}
$$
따라서 $R(x)=17(x-2)$이다. $a+1=0$이므로
$$
R(a+1)=R(0)=17(0-2)=-34.
$$
정답은 ①이다.

**검산:** $P(2)=0$이고 $P'(2)=17$이므로 $P(x)-17(x-2)$은 $x=2$에서 함수값과 도함수가 모두 $0$인 다항식이다. 따라서 $(x-2)^2$로 나누어떨어져 해당 나머지는 정확히 $17(x-2)$이다.

## Q14 — KEEP

- 출처: source ordinal 14, id `14`, sourceIdentityKey `NOT_PRESENT`, blob `d8921cbab8981c84f871103dfe871f8db286e3ad`.
- 문제 조건·보기 원문:

```text
양의 실수 전체의 집합에서 연속인 함수 $f(x)$가 모든 양의 실수 $x$에 대하여 $(\sqrt{x}-2)f(x)=x^2+ax+b$를 만족시키고 $f(1)=6$일 때, $f(4)$의 값은? (단, $a,b$는 상수이다.) [4.8점]
보기 원문: ["12","16","20","24","28"]
```

- 원본 정답: `③`.
- 기존 solution 결정적 실제 구절(발췌):
> $x=1$을 대입하면 $(1-2)f(1)=1+a+b$이므로 $-6=1+a+b$, 즉 $a+b=-7$이다.
> $f$는 $x=4$에서도 연속이므로 $f(4)=\lim_{x\to4}(\sqrt{x}+2)(x+1)=4\times5=20$이다.
- 해설 경로·판정 이유·독립 대입 검산: $x=4$에서 분모 $(\sqrt x-2)=0$이므로 $16+4a+b=0$을 만들고 $f(1)=6$과 연립한다. $x\ne4$에서 인수분해 후 연속성을 써 $f(4)=20$이다.
- 그림/검수: 핵심 수학 조건은 텍스트에 표시되어 있음. 최종 학생 렌더 QA NOT_RUN.
- 현재 상태: READ_EVIDENCED / QA_NOT_RUN.

## Q15 — KEEP

- 출처: source ordinal 15, id `15`, sourceIdentityKey `NOT_PRESENT`, blob `d8921cbab8981c84f871103dfe871f8db286e3ad`.
- 문제 조건·보기 원문:

```text
함수 $f(x)=|x-3|$, $g(x)=\begin{cases}x-3&(x\lt0)\\x^3+ax^2+bx+c&(x\ge0)\end{cases}$에 대하여 함수 $f(x)g(x)$가 실수 전체의 집합에서 미분가능할 때, 세 상수 $a,b,c$의 합 $a+b+c$의 값은? [4.8점]
보기 원문: ["-1","-2","-3","-4","-5"]
```

- 원본 정답: `⑤`.
- 기존 solution 결정적 실제 구절(발췌):
> $h(x)=|x-3|g(x)$라 두자.
> 따라서 $a+b+c=-3+1-3=-5$이므로 정답은 ⑤이다.
- 해설 경로·판정 이유·독립 대입 검산: $x=0$에서 $g(0)=c=-3$, 좌·우 도함수로 $b=1$이다. $x=3$에서 $|x-3|$의 꺾임을 없애려면 $g(3)=0$으로 $a=-3$이며 합은 -5다.
- 그림/검수: 핵심 수학 조건은 텍스트에 표시되어 있음. 최종 학생 렌더 QA NOT_RUN.
- 현재 상태: READ_EVIDENCED / QA_NOT_RUN.

## Q16 — KEEP

- 출처: source ordinal 16, id `16`, sourceIdentityKey `NOT_PRESENT`, blob `d8921cbab8981c84f871103dfe871f8db286e3ad`.
- 문제 조건·보기 원문:

```text
$f(x)$가 다항함수이고, $\displaystyle\lim_{x\to0}\frac{f(x)}{x}=3$, $\displaystyle\lim_{x\to2}\frac{f(x)}{x-2}=4$일 때, 극한값 $\displaystyle\lim_{x\to2}\frac{f(f(x))}{2x^2+x-10}$의 값은? [4.9점]
보기 원문: ["$\\frac13$","$\\frac23$","1","$\\frac43$","$\\frac53$"]
```

- 원본 정답: `④`.
- 기존 solution 결정적 실제 구절(발췌):
> 주어진 두 유한한 극한으로부터 $f(0)=0$, $f(2)=0$을 알 수 있다.
> 따라서 극한값은 $3\times4\times\frac19=\frac43$이므로 정답은 ④이다.
- 해설 경로·판정 이유·독립 대입 검산: 주어진 극한에서 $f(0)=f(2)=0$, $f'(0)=3$, $f'(2)=4$를 알 수 있다. 합성비를 $f(f(x))/f(x)$ 및 $f(x)/(x-2)$로 나눠 극한 곱 $3\cdot4/9=4/3$을 확인한다.
- 그림/검수: 핵심 수학 조건은 텍스트에 표시되어 있음. 최종 학생 렌더 QA NOT_RUN.
- 현재 상태: READ_EVIDENCED / QA_NOT_RUN.

## Q17 — HOLD

- 출처: source ordinal 17, id `17`, sourceIdentityKey `NOT_PRESENT`, blob `d8921cbab8981c84f871103dfe871f8db286e3ad`.
- 문제 조건·보기 원문:

```text
$-2\lt x\lt2$에서 정의된 함수 $y=f(x)$의 그래프가 그림과 같을 때, 보기에서 옳은 것만을 있는 대로 고른 것은? (단, $f^{-1}(x)$는 함수 $f(x)$의 역함수이다.) [5점]<div><img src="assets/images/26_효천고_2학기_중간_고2_미적분I/q17.png" alt="문항 17의 구간별 함수 그래프. 열린점과 닫힌점 포함." style="max-width:100%;height:auto"></div><div class="question-note-box"><strong>〈보기〉</strong><br>ㄱ. $\displaystyle\lim_{x\to1-}f(x)=-1$<br>ㄴ. $\displaystyle\lim_{x\to1+}f^{-1}(x)=1$<br>ㄷ. $\displaystyle\lim_{x\to a-}f^{-1}(x)+\lim_{x\to a+}f^{-1}(x)=1$을 만족시키는 실수 $a$는 존재하지 않는다.</div>
보기 원문: ["ㄱ","ㄴ","ㄱ, ㄴ","ㄱ, ㄷ","ㄱ, ㄴ, ㄷ"]
```

- 원본 정답: `①`.
- 기존 solution 결정적 실제 구절(발췌):
> $0\lt x\le1$인 가지는 $(0,0)$에서 $(1,-1)$로 가므로 $\lim_{x\to1-}f(x)=-1$이다.
> $a=-\frac12$에서는 역함수가 연속이므로 좌·우극한의 합은 $\frac12+\frac12=1$이다.
- 해설 경로·판정 이유·독립 대입 검산: 역함수의 좌우극한은 그림의 가지 배치를 확인해야 한다. 풀이에 $(0,0)\to(1,-1)$ 및 $(1,2)\to(2,1)$이라고 적혀 있지만 q17.png의 열린점/닫힌점 판독이 없어 판정 HOLD다.
- 그림/검수: 원본 문제 이미지 `content-embedded img` 시각 판독 NOT_RUN. 따라서 원본 좌표·부호·경계를 검증할 때까지 HOLD.
- 현재 상태: VISUAL_HOLD.

## Q18 — KEEP

- 출처: source ordinal 18, id `18`, sourceIdentityKey `NOT_PRESENT`, blob `d8921cbab8981c84f871103dfe871f8db286e3ad`.
- 문제 조건·보기 원문:

```text
두 함수 $f(x),g(x)$에 대하여 $\displaystyle\lim_{x\to2}f(x)=-2$, $\displaystyle\lim_{x\to2}g(x)=a$이고 $\displaystyle\lim_{x\to2}f(x)g(x)=-6$일 때, 극한값 $\displaystyle\lim_{x\to2}\{f(x)+2g(x)\}$를 구하시오. [3점]
보기 원문: []
```

- 원본 정답: `4`.
- 기존 solution 결정적 실제 구절(발췌):
> $\lim_{x\to2}f(x)=-2$는 $0$이 아니므로 곱의 극한법칙을 이용하여 $(-2)a=-6$이다.
> 합의 극한법칙에서 $\displaystyle\lim_{x\to2}\{f(x)+2g(x)\}=-2+2(3)=4$이다.
- 해설 경로·판정 이유·독립 대입 검산: $\lim f=-2$, $\lim(fg)=-6$이므로 $\lim g=3$이고 $\lim(f+2g)=4$다. 곱·합의 극한법칙 적용에 0으로 나누는 단계가 없다.
- 그림/검수: 핵심 수학 조건은 텍스트에 표시되어 있음. 최종 학생 렌더 QA NOT_RUN.
- 현재 상태: READ_EVIDENCED / QA_NOT_RUN.

## Q19 — KEEP

- 출처: source ordinal 19, id `19`, sourceIdentityKey `NOT_PRESENT`, blob `d8921cbab8981c84f871103dfe871f8db286e3ad`.
- 문제 조건·보기 원문:

```text
함수 $y=(3x^2+2)(2-x^2)$의 도함수를 구하시오. [3점]
보기 원문: []
```

- 원본 정답: `$-12x^3+8x$`.
- 기존 solution 결정적 실제 구절(발췌):
> 전개하면 $y=6x^2+4-3x^4-2x^2=-3x^4+4x^2+4$이다.
> 각 항을 미분하여 $y'=-12x^3+8x$를 얻는다.
- 해설 경로·판정 이유·독립 대입 검산: $(3x^2+2)(2-x^2)=-3x^4+4x^2+4$로 정확히 전개한다. 미분해서 $-12x^3+8x$를 얻고 원식을 곱셈 미분으로 다시 확인할 수 있다.
- 그림/검수: 핵심 수학 조건은 텍스트에 표시되어 있음. 최종 학생 렌더 QA NOT_RUN.
- 현재 상태: READ_EVIDENCED / QA_NOT_RUN.

## Q20 — KEEP

- 출처: source ordinal 20, id `20`, sourceIdentityKey `NOT_PRESENT`, blob `d8921cbab8981c84f871103dfe871f8db286e3ad`.
- 문제 조건·보기 원문:

```text
실수 전체의 집합에서 미분가능하고 다음 조건을 만족시키는 모든 함수 $f(x)$에 대하여 $f(7)$의 최솟값을 구하고 그 과정을 서술하시오. [5점]<div class="question-note-box"><strong>〈조건〉</strong><br>(가) $f(2)=1$<br>(나) $2\lt x\lt7$의 모든 실수 $x$에 대하여 $f'(x)\ge2$이다.</div>
보기 원문: []
```

- 원본 정답: `11`.
- 기존 solution 결정적 실제 구절(발췌):
> 따라서 어떤 $c\in(2,7)$에 대하여 $\displaystyle\frac{f(7)-f(2)}{7-2}=f'(c)$가 성립한다.
> 이때 $f(7)=11$이다.
- 해설 경로·판정 이유·독립 대입 검산: 평균값 정리로 $(f(7)-1)/5=f'(c)\ge2$라서 최솟값의 하한 11을 얻는다. $f(x)=2x-3$이 하한을 달성하여 단순 하한이 아닌 최솟값이다.
- 그림/검수: `solutionImage` 링크 존재, 원본 문제의 수식으로 잠정 수학 판정. SVG 이미지 자체의 독립 시각 검증 NOT_RUN.
- 현재 상태: READ_EVIDENCED / QA_NOT_RUN.

## Q21 — KEEP

- 출처: source ordinal 21, id `21`, sourceIdentityKey `NOT_PRESENT`, blob `d8921cbab8981c84f871103dfe871f8db286e3ad`.
- 문제 조건·보기 원문:

```text
함수 $f(x)=\begin{cases}ax+b&(|x|\ge3)\\\dfrac{|x|-3}{|x^2-9|}&(|x|\lt3)\end{cases}$가 실수 전체의 집합에서 연속일 때, 상수 $a,b$에 대하여 $6a+12b$의 값을 구하고 그 과정을 서술하시오. [6점]
보기 원문: []
```

- 원본 정답: `-2`.
- 기존 solution 결정적 실제 구절(발췌):
> $|x|\lt3$에서는 $|x|-3=-(3-|x|)$이고 $|x^2-9|=9-x^2=(3-|x|)(3+|x|)$이다.
> $6a+12b=0-2=-2$이므로 구하는 값은 $-2$이다.
- 해설 경로·판정 이유·독립 대입 검산: 내부식이 $-1/(3+|x|)$로 약분됨을 명시한다. 경계 $x=\pm3$에서 외부 일차식 값이 모두 -1/6이라 $a=0,b=-1/6$, 결과 -2다.
- 그림/검수: 핵심 수학 조건은 텍스트에 표시되어 있음. 최종 학생 렌더 QA NOT_RUN.
- 현재 상태: READ_EVIDENCED / QA_NOT_RUN.

## Q22 — KEEP

- 출처: source ordinal 22, id `22`, sourceIdentityKey `NOT_PRESENT`, blob `d8921cbab8981c84f871103dfe871f8db286e3ad`.
- 문제 조건·보기 원문:

```text
삼차함수 $f(x)$에 대하여 $\displaystyle\left\{t\;\middle|\;\lim_{x\to t}\frac{f(x)-x^2-x}{x-t}=6t-10\right\}=\{1,3\}$일 때, $f(4)$의 값을 구하고 그 과정을 서술하시오. [6점]
보기 원문: []
```

- 원본 정답: `35`.
- 기존 solution 결정적 실제 구절(발췌):
> $g(x)=f(x)-x^2-x$로 두자.
> 덧붙여 다른 영점 $t=-1$은 $g'(-1)=8$인 반면 $6(-1)-10=-16$이므로 제시된 집합에 포함되지 않아 조건과 일치한다.
- 해설 경로·판정 이유·독립 대입 검산: $g=f-x^2-x$라 놓으면 대상 t=1,3에서 $g(t)=0$이고 $g'(t)=6t-10$이다. 이 조건으로 $g=(x-1)(x-3)(x+1)$를 찾고 다른 근 -1은 미충족을 대입 확인한다.
- 그림/검수: 핵심 수학 조건은 텍스트에 표시되어 있음. 최종 학생 렌더 QA NOT_RUN.
- 현재 상태: READ_EVIDENCED / QA_NOT_RUN.

## Q23 — KEEP

- 출처: source ordinal 23, id `23`, sourceIdentityKey `NOT_PRESENT`, blob `d8921cbab8981c84f871103dfe871f8db286e3ad`.
- 문제 조건·보기 원문:

```text
다음 조건을 만족시키는 모든 다항함수 $f(x)$에 대하여 $f(1)$의 최댓값을 구하고 그 과정을 서술하시오. [7점]<div class="question-note-box"><strong>〈조건〉</strong><br>$\displaystyle\lim_{x\to\infty}\frac{f(x)-5x^4+7x^3}{x^{n+1}+3}=5$, $\displaystyle\lim_{x\to0}\frac{f(x)}{x^n}=3$인 자연수 $n$이 존재한다.</div>
보기 원문: []
```

- 원본 정답: `13`.
- 기존 solution 결정적 실제 구절(발췌):
> $\displaystyle\lim_{x\to0}\frac{f(x)}{x^n}=3$이므로 $f(x)$에서 차수가 가장 낮은 항은 반드시 $3x^n$이고, $x^n$보다 낮은 차수의 항은 없다.
> ($n=4$에서도 주어진 $-5x^4+7x^3$ 항은 최고차항의 극한을 바꾸지 않는다.) 각 경우의 값은 차례로 $6,6,13,8$이므로 가능한 최댓값은 $13$이다.
- 해설 경로·판정 이유·독립 대입 검산: $x\to0$ 극한으로 $f$의 가장 낮은 차수를 $n$, 그 계수를 3으로 고정한다. $n=1,2,3,\ge4$ 각각 무한대 극한의 차수/최고차계수를 비교하며 가능한 $f(1)$ 값 6,6,13,8 가운데 최대 13을 확인했다.
- 그림/검수: 핵심 수학 조건은 텍스트에 표시되어 있음. 최종 학생 렌더 QA NOT_RUN.
- 현재 상태: READ_EVIDENCED / QA_NOT_RUN.

## 총괄·재개 위치

- 문항 분모: 23; KEEP 20 + UPGRADE 1 + HOLD 2 + UNREAD 0 = 23.
- 대체 학생용 풀이가 들어 있는 문항: Q13.
- 추가 시각 확인이 필요한 문항: Q11, Q17.
- 모든 UPGRADE 전체 풀이가 본 MD에 들어 있음. 원본 JS/보기/정답/기존 SVG 및 main 변경 없음.
- Golden/Negative, 최종 독립 수학·교육과정 재검증, JS 원본 보호 diff/문법, 학생 화면 exam/sol/ans 렌더: **NOT_RUN**. 출고 PASS·main 병합 아님.
