# 미적분Ⅰ 심층 감사 — 26_금당고_2학기_중간_고2_미적분I

- 대상: `archive/exams/original/high/h2/2mid/26_금당고_2학기_중간_고2_미적분I.js` (미적분I, 기출, 2026년 2학기 중간)
- 원본 ref: `main`, blob: `d1977ff46ab82344af4555c0eb170d9b69350cda`; 문항 분모 **21**.
- 판정: **KEEP 18 / UPGRADE 1 / HOLD 2 / UNREAD 0**. 문항별 원문·기존 해설·판정 근거 아래 기록.
- 작업 브랜치: `work/solution-upgrade-lane-10-20261121`; MD 경로: `docs/operations/solution-upgrade-reservations/staged/calculus1/26_금당고_2학기_중간_고2_미적분I_DEEP_AUDIT.md`.
- 기준 자료: `HARNESS_CURRENT.md`, `DEEP_QUESTION_AUDIT_TEMPLATE_CURRENT.md`, `BOARD_SOLUTION_SAMPLES_CURRENT.md`, `docs-manifest.json` core 문서 본문을 2026-11-21 접근·확인. Golden/Negative 독립 샘플·자동 preflight·SHA-256 영수증 검증: **NOT_RUN**. 운영 독립 수학·학생 화면·SVG QA: **NOT_RUN**.
- 문제 그림 문항 Q13, Q16은 이미지의 점·화살표·함숫값을 시각 판독하지 못해 **VISUAL_HOLD**. 기존 `solutionImage` 렌더도 **NOT_RUN**.
- 상태: **EXAM_AUDIT_COMPLETE(전 문항 근거 기록)** / **EXAM_DRAFT_COMPLETE(개선 1문항 전체 풀이 수록)** / **QA_NOT_RUN**. next_qid 없음, 시각 검증 미해결: 13, 16.

## Q01 — KEEP

- 출처: source ordinal 1, id `1`, sourceIdentityKey `NOT_PRESENT`, blob `d1977ff46ab82344af4555c0eb170d9b69350cda`.
- 문제 조건·보기 원문:

```text
$\displaystyle\lim_{x\to\infty}\frac{(2x+2)(3x-3)}{6x^2-x-1}$의 값은? [3점]
보기 원문: ["0","$\\dfrac12$","1","$\\dfrac32$","2"]
```

- 원본 정답: `③`.
- 기존 solution 결정적 실제 구절(발췌):
> $(2x+2)(3x-3)=6x^2-6$이므로 $\displaystyle\lim_{x\to\infty}\frac{(2x+2)(3x-3)}{6x^2-x-1}$ $=\lim_{x\to\infty}\frac{6-\frac6{x^2}}{6-\frac1x-\frac1{x^2}}$ $=1$이다.
- 해설 경로·판정 이유·독립 대입 검산: $(2x+2)(3x-3)=6x^2-6$로 전개한 뒤 분자·분모를 $x^2$로 나눈다. 최고차항 계수가 모두 $6$이라 극한 $1$과 일치한다.
- 그림/검수: 핵심 수학 조건은 텍스트에 표시되어 있음. 최종 학생 렌더 QA NOT_RUN.
- 현재 상태: READ_EVIDENCED / QA_NOT_RUN.

## Q02 — KEEP

- 출처: source ordinal 2, id `2`, sourceIdentityKey `NOT_PRESENT`, blob `d1977ff46ab82344af4555c0eb170d9b69350cda`.
- 문제 조건·보기 원문:

```text
$\displaystyle\lim_{x\to3}\frac{\sqrt{x+1}-2}{x-3}$의 값은? [3점]
보기 원문: ["1","$\\dfrac12$","$\\dfrac13$","$\\dfrac14$","$\\dfrac15$"]
```

- 원본 정답: `④`.
- 기존 solution 결정적 실제 구절(발췌):
> $\displaystyle\frac{\sqrt{x+1}-2}{x-3}$ $=\frac{(\sqrt{x+1}-2)(\sqrt{x+1}+2)}{(x-3)(\sqrt{x+1}+2)}$ $=\frac1{\sqrt{x+1}+2}$이다.
> 따라서 $\displaystyle\lim_{x\to3}\frac{\sqrt{x+1}-2}{x-3}$ $=\frac1{2+2}$ $=\frac14$이다.
- 해설 경로·판정 이유·독립 대입 검산: 켤레식으로 유리화할 때 $(x+1)-4=x-3$이 되어 약분한다. $x\ne3$에서만 약분하고 극한은 $1/(2+2)=1/4$이다.
- 그림/검수: 핵심 수학 조건은 텍스트에 표시되어 있음. 최종 학생 렌더 QA NOT_RUN.
- 현재 상태: READ_EVIDENCED / QA_NOT_RUN.

## Q03 — KEEP

- 출처: source ordinal 3, id `3`, sourceIdentityKey `NOT_PRESENT`, blob `d1977ff46ab82344af4555c0eb170d9b69350cda`.
- 문제 조건·보기 원문:

```text
함수 $f(x)=\dfrac1{x-3}$의 정의역의 구간을 바르게 나타낸 것은? [3점]
보기 원문: ["$(-\\infty,\\infty)$","$(-\\infty,3)$","$(3,\\infty)$","$(3,3)$","$(-\\infty,3)\\cup(3,\\infty)$"]
```

- 원본 정답: `⑤`.
- 기존 solution 결정적 실제 구절(발췌):
> $x-3=0$에서 $x=3$이므로 $f(x)=\dfrac1{x-3}$은 $x=3$에서 정의되지 않는다.
- 해설 경로·판정 이유·독립 대입 검산: 분모 $x-3$의 영점 $3$을 정의역에서 제외한다. $(−\infty,3)\cup(3,\infty)$가 실수 전체에서 정확히 3만 뺀 집합임을 확인했다.
- 그림/검수: `solutionImage` 링크 존재, 원본 문제의 수식으로 잠정 수학 판정. SVG 이미지 자체의 독립 시각 검증 NOT_RUN.
- 현재 상태: READ_EVIDENCED / QA_NOT_RUN.

## Q04 — KEEP

- 출처: source ordinal 4, id `4`, sourceIdentityKey `NOT_PRESENT`, blob `d1977ff46ab82344af4555c0eb170d9b69350cda`.
- 문제 조건·보기 원문:

```text
함수 $f(x)=\dfrac6{x-2}$의 구간 $[3,5]$에서의 최댓값과 최솟값의 합은? [3.2점]
보기 원문: ["2","4","8","10","12"]
```

- 원본 정답: `③`.
- 기존 solution 결정적 실제 구절(발췌):
> 구간 $[3,5]$에서는 $x-2>0$이고, $x$가 커질수록 분모 $x-2$가 커지므로 $f(x)=\dfrac6{x-2}$의 값은 작아진다.
> 그러므로 최댓값과 최솟값의 합은 $6+2=8$이다.
- 해설 경로·판정 이유·독립 대입 검산: $[3,5]$에서 분모 $x-2$가 양수로 증가하므로 $6/(x-2)$는 감소한다. 양 끝 $f(3)=6$, $f(5)=2$ 합 $8$이 실제 극값이다.
- 그림/검수: `solutionImage` 링크 존재, 원본 문제의 수식으로 잠정 수학 판정. SVG 이미지 자체의 독립 시각 검증 NOT_RUN.
- 현재 상태: READ_EVIDENCED / QA_NOT_RUN.

## Q05 — KEEP

- 출처: source ordinal 5, id `5`, sourceIdentityKey `NOT_PRESENT`, blob `d1977ff46ab82344af4555c0eb170d9b69350cda`.
- 문제 조건·보기 원문:

```text
두 함수 $f(x)=x+2$, $g(x)=x^2+2x+5$에 대하여 다음 중 실수 전체의 집합에서 연속인 함수가 아닌 것은? [3.3점]
보기 원문: ["$f(x)-2g(x)$","$f(x)+g(x)$","$\\dfrac{f(x)}{g(x)}$","$\\dfrac{g(x)}{f(x)}$","$f(x)g(x)$"]
```

- 원본 정답: `④`.
- 기존 solution 결정적 실제 구절(발췌):
> $g(x)=x^2+2x+5=(x+1)^2+4>0$이므로 $\dfrac{f(x)}{g(x)}$는 실수 전체에서 연속이다.
> 반면 $f(x)=x+2$는 $x=-2$에서 $0$이므로 $\dfrac{g(x)}{f(x)}$는 $x=-2$에서 정의되지 않는다.
- 해설 경로·판정 이유·독립 대입 검산: $g=(x+1)^2+4>0$임을 제시해 $f/g$의 분모 영점을 배제했다. 반대로 $g/f$는 $f(-2)=0$으로 정의되지 않는 이유가 구체적이다.
- 그림/검수: 핵심 수학 조건은 텍스트에 표시되어 있음. 최종 학생 렌더 QA NOT_RUN.
- 현재 상태: READ_EVIDENCED / QA_NOT_RUN.

## Q06 — KEEP

- 출처: source ordinal 6, id `6`, sourceIdentityKey `NOT_PRESENT`, blob `d1977ff46ab82344af4555c0eb170d9b69350cda`.
- 문제 조건·보기 원문:

```text
함수 $f(x)=3x^2$의 $x=1$에서의 미분계수의 값은? [3.5점]
보기 원문: ["2","4","6","8","10"]
```

- 원본 정답: `③`.
- 기존 solution 결정적 실제 구절(발췌):
> $f(x)=3x^2$이므로 $f'(x)=6x$이다.
> 따라서 $x=1$에서의 미분계수는 $f'(1)=6$이다.
- 해설 경로·판정 이유·독립 대입 검산: 다항식의 도함수 $f'(x)=6x$에 $x=1$을 대입해 $6$을 얻는다. 원래 미분계수 조건과 직접 맞는다.
- 그림/검수: 핵심 수학 조건은 텍스트에 표시되어 있음. 최종 학생 렌더 QA NOT_RUN.
- 현재 상태: READ_EVIDENCED / QA_NOT_RUN.

## Q07 — KEEP

- 출처: source ordinal 7, id `7`, sourceIdentityKey `NOT_PRESENT`, blob `d1977ff46ab82344af4555c0eb170d9b69350cda`.
- 문제 조건·보기 원문:

```text
함수 $f(x)=x^2-3$에 대하여 $x$의 값이 0에서 2까지 변할 때의 평균변화율의 값은? [4점]
보기 원문: ["-2","-1","1","2","3"]
```

- 원본 정답: `④`.
- 기존 solution 결정적 실제 구절(발췌):
> $f(2)=2^2-3=1$, $f(0)=-3$이므로 $\displaystyle\frac{1-(-3)}2$ $=\frac42$ $=2$이다.
- 해설 경로·판정 이유·독립 대입 검산: 평균변화율 $(f(2)-f(0))/2$에서 값 $1,-3$을 구해 $(1+3)/2=2$다. 단순 접선 기울기와 혼동하지 않았다.
- 그림/검수: `solutionImage` 링크 존재, 원본 문제의 수식으로 잠정 수학 판정. SVG 이미지 자체의 독립 시각 검증 NOT_RUN.
- 현재 상태: READ_EVIDENCED / QA_NOT_RUN.

## Q08 — KEEP

- 출처: source ordinal 8, id `8`, sourceIdentityKey `NOT_PRESENT`, blob `d1977ff46ab82344af4555c0eb170d9b69350cda`.
- 문제 조건·보기 원문:

```text
미분가능한 함수 $f(x)$에 대하여 $f'(a)=1$일 때, $\displaystyle\lim_{h\to0}\frac{f(a+3h)-f(a)}h$의 값은? [4점]
보기 원문: ["$\\dfrac13$","$\\dfrac12$","1","2","3"]
```

- 원본 정답: `⑤`.
- 기존 solution 결정적 실제 구절(발췌):
> $\displaystyle\frac{f(a+3h)-f(a)}h$ $=3\cdot\frac{f(a+3h)-f(a)}{3h}$이다.
> $h\to0$이면 $3h\to0$이므로 $\displaystyle\lim_{h\to0}\frac{f(a+3h)-f(a)}h$ $=3f'(a)$ $=3$이다.
- 해설 경로·판정 이유·독립 대입 검산: $3\,[f(a+3h)-f(a)]/(3h)$로 만들어 미분계수 정의를 적용한다. $h\to0$이면 $3h\to0$이므로 결과는 $3f'(a)=3$.
- 그림/검수: 핵심 수학 조건은 텍스트에 표시되어 있음. 최종 학생 렌더 QA NOT_RUN.
- 현재 상태: READ_EVIDENCED / QA_NOT_RUN.

## Q09 — KEEP

- 출처: source ordinal 9, id `9`, sourceIdentityKey `NOT_PRESENT`, blob `d1977ff46ab82344af4555c0eb170d9b69350cda`.
- 문제 조건·보기 원문:

```text
다항함수 $f(x)$에 대하여 $f'(1)=-9$일 때, $\displaystyle\lim_{x\to1}\frac{f(x)-f(1)}{x^3-1}$의 값은? [4점]
보기 원문: ["-3","-2","1","2","3"]
```

- 원본 정답: `①`.
- 기존 solution 결정적 실제 구절(발췌):
> $x^3-1=(x-1)(x^2+x+1)$이므로 $\displaystyle\frac{f(x)-f(1)}{x^3-1}$ $=\frac{f(x)-f(1)}{x-1}\cdot\frac1{x^2+x+1}$이다.
> 따라서 $\displaystyle\lim_{x\to1}\frac{f(x)-f(1)}{x^3-1}$ $=f'(1)\cdot\frac13$ $=-9\cdot\frac13$ $=-3$이다.
- 해설 경로·판정 이유·독립 대입 검산: $x^3-1=(x-1)(x^2+x+1)$로 인수분해해 $f'(1)/(1+1+1)=-3$을 얻는다. 분모의 두 번째 인자는 한계에서 3으로 0이 아니다.
- 그림/검수: 핵심 수학 조건은 텍스트에 표시되어 있음. 최종 학생 렌더 QA NOT_RUN.
- 현재 상태: READ_EVIDENCED / QA_NOT_RUN.

## Q10 — KEEP

- 출처: source ordinal 10, id `10`, sourceIdentityKey `NOT_PRESENT`, blob `d1977ff46ab82344af4555c0eb170d9b69350cda`.
- 문제 조건·보기 원문:

```text
실수 전체의 집합에서 연속인 함수 $f(x)$가 모든 실수 $x$에 대하여 $(x-2)f(x)=x^2+ax+b$를 만족시킨다. $f(2)=5$일 때, $a+b$의 값은? [4점]
보기 원문: ["-5","-3","-1","1","3"]
```

- 원본 정답: `①`.
- 기존 solution 결정적 실제 구절(발췌):
> $x=2$를 원래 식에 대입하면 왼쪽은 $0$이므로 $4+2a+b=0$이다.
> 따라서 $a+b=1-6=-5$이다.
- 해설 경로·판정 이유·독립 대입 검산: $x=2$에서 분자가 0이어야 $(x-2)f(x)$가 성립하고, 연속성으로 $f(2)=a+4=5$를 연결한다. $a=1,b=-6$ 대입은 항등식을 만족한다.
- 그림/검수: `solutionImage` 링크 존재, 원본 문제의 수식으로 잠정 수학 판정. SVG 이미지 자체의 독립 시각 검증 NOT_RUN.
- 현재 상태: READ_EVIDENCED / QA_NOT_RUN.

## Q11 — KEEP

- 출처: source ordinal 11, id `11`, sourceIdentityKey `NOT_PRESENT`, blob `d1977ff46ab82344af4555c0eb170d9b69350cda`.
- 문제 조건·보기 원문:

```text
함수 $f(x)=\begin{cases}ax-3&(x\ge2)\\x^2-b&(-1<x<2)\\2x+c&(x\le-1)\end{cases}$가 실수 전체의 집합에서 연속이고 $f(0)=-5$일 때, $f(3)+f(-2)$의 값은? [4점]
보기 원문: ["0","-3","-6","-9","-12"]
```

- 원본 정답: `③`.
- 기존 solution 결정적 실제 구절(발췌):
> $f(0)=-5$이고 $-1<0<2$이므로 $-b=-5$ 에서 $b=5$이다.
> 이제 $f(3)=3-3=0$, $f(-2)=2(-2)-2=-6$ 이므로 $f(3)+f(-2)=-6$이다.
- 해설 경로·판정 이유·독립 대입 검산: 조각함수 경계 $x=2,-1$에서 양쪽 식을 같게 해 $a=1,c=-2$를 얻는다. $f(0)=-b=-5$에서 $b=5$이고 최종 $0+(-6)=-6$.
- 그림/검수: `solutionImage` 링크 존재, 원본 문제의 수식으로 잠정 수학 판정. SVG 이미지 자체의 독립 시각 검증 NOT_RUN.
- 현재 상태: READ_EVIDENCED / QA_NOT_RUN.

## Q12 — KEEP

- 출처: source ordinal 12, id `12`, sourceIdentityKey `NOT_PRESENT`, blob `d1977ff46ab82344af4555c0eb170d9b69350cda`.
- 문제 조건·보기 원문:

```text
함수 $f(x)$가 모든 실수 $x$에 대하여 $-3x\le f(x)\le x^2+x+4$일 때, $\displaystyle\lim_{x\to-2}|(x-2)f(x)|$의 값은? [4점]
보기 원문: ["24","22","20","18","16"]
```

- 원본 정답: `①`.
- 기존 solution 결정적 실제 구절(발췌):
> $-3x\to6$이고 $x^2+x+4\to4-2+4=6$이다.
> 또 $|x-2|\to|-4|=4$이므로 $\displaystyle\lim_{x\to-2}|(x-2)f(x)|$ $=4\cdot6$ $=24$이다.
- 해설 경로·판정 이유·독립 대입 검산: 조임정리의 양쪽 극한은 $x=-2$에서 모두 6이다. $x-2\to-4$라서 절댓값 $\lvert(x-2)f(x)\rvert\to24$이며 부호 조건을 확인했다.
- 그림/검수: `solutionImage` 링크 존재, 원본 문제의 수식으로 잠정 수학 판정. SVG 이미지 자체의 독립 시각 검증 NOT_RUN.
- 현재 상태: READ_EVIDENCED / QA_NOT_RUN.

## Q13 — HOLD

- 출처: source ordinal 13, id `13`, sourceIdentityKey `NOT_PRESENT`, blob `d1977ff46ab82344af4555c0eb170d9b69350cda`.
- 문제 조건·보기 원문:

```text
함수 $y=f(x)$의 그래프가 그림과 같을 때, $\displaystyle\lim_{t\to\infty}f\left(\frac{t-1}{t+1}\right)+\lim_{t\to-\infty}f\left(\frac1t\right)$의 값은? [5점]
보기 원문: ["-2","-1","0","1","2"]
```

- 원본 정답: `⑤`.
- 기존 solution 결정적 실제 구절(발췌):
> $\displaystyle\frac{t-1}{t+1}$ $=1-\frac2{t+1}$이므로 $t\to\infty$일 때 $\dfrac{t-1}{t+1}\to1-$이다.
> 따라서 주어진 값은 $1+1=2$이다.
- 해설 경로·판정 이유·독립 대입 검산: 그래프의 좌극한 $f(1-)=1$과 $f(0-)=1$이 해설에 등장한다. 입력 $1-2/(t+1)\to1-$, $1/t\to0-$는 맞지만 q13.png의 실제 열린점/닫힌점 확인이 필요하다.
- 그림/검수: 원본 문제 이미지 `assets/images/26_금당고_2학기_중간_고2_미적분I/q13.png` 시각 판독 NOT_RUN. 따라서 원본 좌표·부호·경계를 검증할 때까지 HOLD.
- 현재 상태: VISUAL_HOLD.

## Q14 — KEEP

- 출처: source ordinal 14, id `14`, sourceIdentityKey `NOT_PRESENT`, blob `d1977ff46ab82344af4555c0eb170d9b69350cda`.
- 문제 조건·보기 원문:

```text
함수 $f(x)=\begin{cases}x^2+a&(x\le2)\\bx&(x>2)\end{cases}$가 $x=2$에서 미분가능할 때, $a+b$의 값은? (단, $a,b$는 상수이다.) [5점]
보기 원문: ["2","4","6","8","10"]
```

- 원본 정답: `④`.
- 기존 solution 결정적 실제 구절(발췌):
> $x=2$에서 미분가능하려면 먼저 연속이어야 한다.
> 따라서 $a+b=8$이다.
- 해설 경로·판정 이유·독립 대입 검산: 경계 $x=2$에서 연속 조건 $4+a=2b$, 미분가능 조건 $4=b$를 모두 쓴다. $a=b=4$를 각 조각에 대입하면 값과 도함수가 양쪽에서 같다.
- 그림/검수: `solutionImage` 링크 존재, 원본 문제의 수식으로 잠정 수학 판정. SVG 이미지 자체의 독립 시각 검증 NOT_RUN.
- 현재 상태: READ_EVIDENCED / QA_NOT_RUN.

## Q15 — UPGRADE

- 출처: source ordinal 15, id `15`, sourceIdentityKey `NOT_PRESENT`, blob `d1977ff46ab82344af4555c0eb170d9b69350cda`.
- 문제 조건·보기 원문:

```text
두 다항함수 $f(x)$, $g(x)$가 다음 조건을 만족시킬 때, $f'(1)$의 값은? [5점]<br>(가) $\displaystyle\lim_{x\to1}\frac{f(x)-g(x)+2}{x-1}=4$<br>(나) $\displaystyle\lim_{x\to1}\frac{f(x^2)+x^2g(x^2)}{x-1}=3$
보기 원문: ["2","$\\dfrac94$","$\\dfrac52$","$\\dfrac{11}4$","3"]
```

- 원본 정답: `②`.
- 기존 solution 결정적 실제 구절(발췌):
> (가)의 극한이 유한한 값 $4$이므로 분자는 $x=1$에서 $0$이어야 한다.
> 여기에 $f'(1)-g'(1)=4$를 더하면 $2f'(1)=\frac92$ 이므로 $f'(1)=\frac94$이다.
- 해설 경로·판정 이유·독립 대입 검산: (가)의 $f(1)-g(1)+2=0$와 도함수 차 4를 확인했다. (나)의 합성 입력 $x^2$가 미분계수에 주는 계수 2와 $x^2g(x^2)$의 별도 항 $2$가 핵심인데 기존 풀이에서 분모를 나누는 과정이 한 문장으로 압축되어 있다.
- 그림/검수: 핵심 수학 조건은 텍스트에 표시되어 있음. 최종 학생 렌더 QA NOT_RUN.
- 현재 상태: DRAFT_STAGED / QA_NOT_RUN.

### 완성 학생용 대체 solution (JS 이관용 전체)

(가)의 극한이 유한하므로 분자가 $x=1$에서 $0$이다.
$$
f(1)-g(1)+2=0.
$$
따라서 미분계수의 정의에서
$$
f'(1)-g'(1)=4. \qquad (1)
$$
(나) 역시 분모가 $0$으로 가므로
$$
f(1)+g(1)=0.
$$
두 등식을 풀면 $f(1)=-1$, $g(1)=1$이다.

이제 (나)의 분자를 $x=1$에서의 함수값만큼 빼고 더한다.
$$
\begin{aligned}
f(x^2)+x^2g(x^2)
&=[f(x^2)-f(1)]\\
&\quad+x^2[g(x^2)-g(1)]\\
&\quad+(x^2-1)g(1).
\end{aligned}
$$
따라서 $x\ne1$에서
$$
\begin{aligned}
\frac{f(x^2)+x^2g(x^2)}{x-1}
&=\frac{f(x^2)-f(1)}{x^2-1}(x+1)\\
&\quad+x^2\frac{g(x^2)-g(1)}{x^2-1}(x+1)\\
&\quad+(x+1)g(1).
\end{aligned}
$$
$x\to1$이면 $x^2\to1$이고 $x+1\to2$이므로
$$
\begin{aligned}
3&=2f'(1)+2g'(1)+2g(1)\\
&=2f'(1)+2g'(1)+2,\\
f'(1)+g'(1)&=\frac12. \qquad (2)
\end{aligned}
$$
(1), (2)를 더하면
$$
2f'(1)=4+\frac12=\frac92,\qquad f'(1)=\frac94.
$$
따라서 정답은 ②이다.

**검산:** $g'(1)=\frac12-\frac94=-\frac74$로 놓으면 (가)는 $\frac94-(-\frac74)=4$, (나)는 $2(\frac94-\frac74)+2=3$으로 각각 일치한다.

## Q16 — HOLD

- 출처: source ordinal 16, id `16`, sourceIdentityKey `NOT_PRESENT`, blob `d1977ff46ab82344af4555c0eb170d9b69350cda`.
- 문제 조건·보기 원문:

```text
그림과 같이 곡선 $y=\dfrac1x$ 위의 원점 O가 아닌 점 $P\left(t,\dfrac1t\right)$를 지나고 직선 OP에 수직인 직선 $l$이 $x$축과 만나는 점을 Q, $y$축과 만나는 점을 R이라 하자. 삼각형 OPQ의 넓이를 $S_1(t)$, 삼각형 OPR의 넓이를 $S_2(t)$라 할 때, $\displaystyle\lim_{t\to1}\frac{S_2(t)-S_1(t)}{t-1}$의 값은? [5.2점]
보기 원문: ["5","4","3","2","1"]
```

- 원본 정답: `②`.
- 기존 solution 결정적 실제 구절(발췌):
> $P\left(t,\dfrac1t\right)$이므로 직선 $OP$의 기울기는 $\displaystyle\frac{1/t}{t}=\frac1{t^2}$이다.
> 그러므로 $\displaystyle\lim_{t\to1}\frac{S_2(t)-S_1(t)}{t-1}$ $=\frac12\lim_{t\to1}\frac{(t+1)(t^2+1)(t^4+1)}{t^4}$ $=4$이다.
- 해설 경로·판정 이유·독립 대입 검산: 직선 OP의 기울기 $1/t^2$, 수선 기울기 $-t^2$를 이용한 절편과 삼각형 넓이 식은 확인했다. 다만 문제의 '그림과 같이'에 따른 기하 배치와 q16.png는 시각 판독하지 못했다.
- 그림/검수: 원본 문제 이미지 `assets/images/26_금당고_2학기_중간_고2_미적분I/q16.png` 시각 판독 NOT_RUN. 따라서 원본 좌표·부호·경계를 검증할 때까지 HOLD.
- 현재 상태: VISUAL_HOLD.

## Q17 — KEEP

- 출처: source ordinal 17, id `17`, sourceIdentityKey `NOT_PRESENT`, blob `d1977ff46ab82344af4555c0eb170d9b69350cda`.
- 문제 조건·보기 원문:

```text
최고차항의 계수가 1인 삼차함수 $f(x)$와 함수 $g(x)=\begin{cases}\dfrac1{x-2}&(x\ne2)\\2&(x=2)\end{cases}$에 대하여 $h(x)=f(x)g(x)$라 할 때, 함수 $h(x)$는 실수 전체의 집합에서 미분가능하고 $h'(2)=6$이다. $f(1)$의 값은? [5.5점]
보기 원문: ["5","6","7","8","9"]
```

- 원본 정답: `①`.
- 기존 solution 결정적 실제 구절(발췌):
> $x\ne2$에서는 $h(x)=\dfrac{f(x)}{x-2}$이다.
> 따라서 $f(1)=5$이다.
- 해설 경로·판정 이유·독립 대입 검산: 연속성에서 $f(2)=f'(2)=0$을 얻어 이중근 $(x-2)^2$를 만든다. $h(x)=(x-2)(x-r)$와 $h'(2)=2-r=6$으로 $r=-4$, $f(1)=5$가 일치한다.
- 그림/검수: `solutionImage` 링크 존재, 원본 문제의 수식으로 잠정 수학 판정. SVG 이미지 자체의 독립 시각 검증 NOT_RUN.
- 현재 상태: READ_EVIDENCED / QA_NOT_RUN.

## Q18 — KEEP

- 출처: source ordinal 18, id `18`, sourceIdentityKey `NOT_PRESENT`, blob `d1977ff46ab82344af4555c0eb170d9b69350cda`.
- 문제 조건·보기 원문:

```text
함수 $f(x)=\begin{cases}ax+b&(x<2)\\cx^2+2x&(x\ge2)\end{cases}$가 실수 전체의 집합에서 연속이고 역함수를 갖는다. 함수 $y=f(x)$의 그래프와 역함수 $y=f^{-1}(x)$의 그래프의 교점이 3개이고 그 교점의 $x$좌표가 각각 0, 2, 4일 때, $f(-1)+f(6)$의 값은? (단, $a,b,c$는 상수이다.) [5.5점]
보기 원문: ["-5","-4","-3","-2","-1"]
```

- 원본 정답: `⑤`.
- 기존 solution 결정적 실제 구절(발췌):
> 함수와 역함수의 그래프는 직선 $y=x$에 대하여 서로 대칭이다.
> 따라서 $f(-1)=5$, $f(6)=-\frac12\cdot36+12=-6$ 이므로 $f(-1)+f(6)=-1$이다.
- 해설 경로·판정 이유·독립 대입 검산: 세 교점을 $y=x$에 대한 대칭 불변인 3개 집합으로 분류해 4가지 배치를 모두 검토한다. 나머지 한 배치에서 $a=-1,b=4,c=-1/2$, $f(-1)+f(6)=-1$을 대입 확인했다.
- 그림/검수: `solutionImage` 링크 존재, 원본 문제의 수식으로 잠정 수학 판정. SVG 이미지 자체의 독립 시각 검증 NOT_RUN.
- 현재 상태: READ_EVIDENCED / QA_NOT_RUN.

## Q19 — KEEP

- 출처: source ordinal 19, id `19`, sourceIdentityKey `NOT_PRESENT`, blob `d1977ff46ab82344af4555c0eb170d9b69350cda`.
- 문제 조건·보기 원문:

```text
이차함수 $f(x)=(x-k)^2(k>0)$이 있다. 양수 $a$에 대하여 $g(x)=\begin{cases}f(x)&(x\le3)\\kf(x-a)&(x>3)\end{cases}$이 다음 조건을 만족시킬 때, 보기에서 옳은 것만을 있는 대로 고른 것은? [5.8점]<br>(가) $\displaystyle\lim_{x\to3}g(x)$가 존재한다.<br>(나) 함수 $y=g(x)$의 그래프는 $x$축과 서로 다른 두 점에서 만난다.<br>[보기]<br>ㄱ. $f(1)=1$이면 $g(2)=0$<br>ㄴ. $g(k+a)<g(3)$<br>ㄷ. $(k-1)(k-2)\ge0$
보기 원문: ["ㄱ","ㄱ, ㄴ","ㄱ, ㄷ","ㄴ, ㄷ","ㄱ, ㄴ, ㄷ"]
```

- 원본 정답: `②`.
- 기존 solution 결정적 실제 구절(발췌):
> $x\le3$에서는 $g(x)=(x-k)^2$이므로 $x=k$에서 $0$이 된다.
> 예를 들어 $k=\dfrac32$로 두면 (가)를 만족하는 양수 $a$가 존재하지만 $\left(\frac32-1\right)\left(\frac32-2\right)$ $=-\frac14<0$이다.
- 해설 경로·판정 이유·독립 대입 검산: 서로 다른 영점은 $x=k\le3$, $x=a+k>3$이고, $k=3$은 좌우극한 불일치로 배제한다. (가)와 이 부호 구간을 써서 ㄱ·ㄴ 참, 반례 $k=3/2$로 ㄷ 거짓임을 확인한다.
- 그림/검수: `solutionImage` 링크 존재, 원본 문제의 수식으로 잠정 수학 판정. SVG 이미지 자체의 독립 시각 검증 NOT_RUN.
- 현재 상태: READ_EVIDENCED / QA_NOT_RUN.

## Q20 — KEEP

- 출처: source ordinal 20, id `20`, sourceIdentityKey `NOT_PRESENT`, blob `d1977ff46ab82344af4555c0eb170d9b69350cda`.
- 문제 조건·보기 원문:

```text
다항함수 $f(x)$가 다음 조건을 만족시킬 때, $f(x)$를 구하시오. [8점]<br>(가) $\displaystyle\lim_{x\to\infty}\frac{f(x)-x^2}{2x^2+2x-1}=1$<br>(나) $\displaystyle\lim_{x\to-1}\frac{f(x)}{x^2-2x-3}=\dfrac12$
보기 원문: []
```

- 원본 정답: `$f(x)=3x^2+4x+1$`.
- 기존 solution 결정적 실제 구절(발췌):
> (가)의 극한이 $1$이므로 $f(x)$의 차수는 $2$ 이하이고, $f(x)=Ax^2+Bx+C$라 둘 수 있다.
> 따라서 $d=1$이고, $f(x)=(x+1)(3x+1)$ $=3x^2+4x+1$이다.
- 해설 경로·판정 이유·독립 대입 검산: (가)의 최고차항 계수가 3인 이차식, (나)의 $x=-1$ 영점과 유한 극한을 결합한다. $f=(x+1)(3x+d)$를 대입해 $d=1$과 원문 두 극한값을 역검산했다.
- 그림/검수: 핵심 수학 조건은 텍스트에 표시되어 있음. 최종 학생 렌더 QA NOT_RUN.
- 현재 상태: READ_EVIDENCED / QA_NOT_RUN.

## Q21 — KEEP

- 출처: source ordinal 21, id `21`, sourceIdentityKey `NOT_PRESENT`, blob `d1977ff46ab82344af4555c0eb170d9b69350cda`.
- 문제 조건·보기 원문:

```text
최고차항의 계수가 1인 삼차함수 $f(x)$에 대하여 실수 전체의 집합에서 연속인 함수 $g(x)$가 다음 조건을 만족시킨다.<br>(가) 모든 실수 $x$에 대하여 $f(x)g(x)=x(x+4)$<br>(나) $g(0)=2$<br>$f(1)$이 자연수일 때, $g(2)$의 최솟값을 구하시오. [12점]
보기 원문: []
```

- 원본 정답: `$\dfrac35$`.
- 기존 solution 결정적 실제 구절(발췌):
> $g(0)=2$이고 $f(0)g(0)=0$이므로 $f(0)=0$이다.
> 따라서 $\displaystyle g(2)_{\min}=\frac35$이다.
- 해설 경로·판정 이유·독립 대입 검산: $g(0)=2$로 $f(0)=0$을 얻고 연속성으로 $q=2$를 구한다. 분모가 전 실수에서 0이 아니려면 $p^2-8<0$이고 $f(1)=p+3\in\mathbb N$으로 $p=-2,-1,0,1,2$, $g(2)=3/(p+3)$의 최솟값은 3/5이다.
- 그림/검수: `solutionImage` 링크 존재, 원본 문제의 수식으로 잠정 수학 판정. SVG 이미지 자체의 독립 시각 검증 NOT_RUN.
- 현재 상태: READ_EVIDENCED / QA_NOT_RUN.

## 총괄·재개 위치

- 문항 분모: 21; KEEP 18 + UPGRADE 1 + HOLD 2 + UNREAD 0 = 21.
- 대체 학생용 풀이가 들어 있는 문항: Q15.
- 추가 시각 확인이 필요한 문항: Q13, Q16.
- 모든 UPGRADE 전체 풀이가 본 MD에 들어 있음. 원본 JS/보기/정답/기존 SVG 및 main 변경 없음.
- Golden/Negative, 최종 독립 수학·교육과정 재검증, JS 원본 보호 diff/문법, 학생 화면 exam/sol/ans 렌더: **NOT_RUN**. 출고 PASS·main 병합 아님.
