# 미적분Ⅰ 심층 감사 — 22_금당고_2학기_기말_고2_수학II

- 대상: `archive/exams/original/high/h2/2final/22_금당고_2학기_기말_고2_수학II.js` (2015 수학Ⅱ, 기출, 2022년 2학기 기말)
- 원본 ref: `main`, blob: `ea71febbfdf08462455fdadce3e6eed2045d17ae`; 문항 분모: **20**
- 결과: **KEEP 18 / UPGRADE 0 / HOLD 2 / UNREAD 0**. 원본 JS·정답·SVG 변경 없음.
- 브랜치: `work/solution-upgrade-lane-10-20261121`; 경로: `docs/operations/solution-upgrade-reservations/staged/calculus1/22_금당고_2학기_기말_고2_수학II_DEEP_AUDIT.md`
- 기준 문서: `HARNESS_CURRENT.md`, `DEEP_QUESTION_AUDIT_TEMPLATE_CURRENT.md`, `BOARD_SOLUTION_SAMPLES_CURRENT.md` 및 `docs-manifest.json` core 원문을 2026-11-21 확인. 해시 영수증 자동검증·preflight·Golden/Negative 샘플: **NOT_RUN**. 최종 독립 수학·학생 화면·SVG QA: **NOT_RUN**.
- 원본 그림 시각확인 전 Q11, Q16은 **VISUAL_HOLD**. 기존 `solutionImage` 렌더링 검사 역시 **NOT_RUN**.
- 상태: **EXAM_AUDIT_COMPLETE(전 문항 근거 기록)** / **EXAM_DRAFT_COMPLETE(개선 없음)** / **QA_NOT_RUN**. next_qid 없음.

## Q01 — KEEP

- 출처: ordinal 1, id `1`, sourceIdentityKey `1`, blob `ea71febbfdf08462455fdadce3e6eed2045d17ae`.
- 문제 원문:

```text
1. 함수 $f(x)=x^2-1$에 대하여 닫힌구간 $[0, 1]$에서 평균값 정리를 만족시키는 실수 $c$의 값은? [4.0점]
보기 원문: ["$\\frac{1}{6}$","$\\frac{1}{3}$","$\\frac{1}{2}$","$\\frac{2}{3}$","$\\frac{5}{6}$"]
```

- 원본 정답: `3`.
- 기존 solution의 실제 핵심 발췌:
> 평균값 정리는 연속·미분가능한 함수에서 $f'(c)=\dfrac{f(1)-f(0)}{1-0}$을 만족하는 $0<c<1$이 존재한다는 정리입니다.
> $f'(x)=2x$이므로 $2c=1$, 즉 $c=\dfrac12$입니다.
- 해설 경로·판정 이유·직접 검산: 미분계수 $2c$와 평균변화율 $1$을 같게 놓는 식이 명시되어 있다. 역검산 $f'(1/2)=1$, $1/2\in(0,1)$이므로 구간 누락이 없다.
- 그림 판독: 원본 solutionImage 존재, 독립 렌더 NOT_RUN. 문제 조건의 수식만으로 잠정 판정.
- 현재 상태: READ_EVIDENCED / QA_NOT_RUN.

## Q02 — KEEP

- 출처: ordinal 2, id `2`, sourceIdentityKey `2`, blob `ea71febbfdf08462455fdadce3e6eed2045d17ae`.
- 문제 원문:

```text
2. 수직선 위를 움직이는 점 $\mathrm{P}$의 시각 $t$에서 위치 $x$는

$$x = t^3 - 6t^2 + 9t$$

라고 하자. $t=2$일 때, 점 $\mathrm{P}$의 속도는? [4.0점]
보기 원문: ["$-3$","$-1$","$0$","$1$","$3$"]
```

- 원본 정답: `1`.
- 기존 solution의 실제 핵심 발췌:
> 위치 $x(t)=t^3-6t^2+9t$이므로 $v(t)=x'(t)=3t^2-12t+9$입니다.
> $t=2$를 대입하면 $v(2)=3\cdot4-12\cdot2+9=12-24+9=-3$입니다.
- 해설 경로·판정 이유·직접 검산: 위치 $x(t)$를 직접 미분한 $v(t)=3t^2-12t+9$를 $t=2$에 대입해 $-3$을 얻는다. 속력 $3$과 부호가 있는 속도 $-3$을 명시적으로 구별한다.
- 그림 판독: 원본 solutionImage 존재, 독립 렌더 NOT_RUN. 문제 조건의 수식만으로 잠정 판정.
- 현재 상태: READ_EVIDENCED / QA_NOT_RUN.

## Q03 — KEEP

- 출처: ordinal 3, id `3`, sourceIdentityKey `3`, blob `ea71febbfdf08462455fdadce3e6eed2045d17ae`.
- 문제 원문:

```text
3. 함수 $f(x)$가 $f'(x)=2x-2$를 만족시키고 $f(0)=2$일 때, $f(1)$의 값은? [4.0점]
보기 원문: ["$-2$","$-1$","$0$","$1$","$2$"]
```

- 원본 정답: `4`.
- 기존 solution의 실제 핵심 발췌:
> $f'(x)=2x-2$이므로 $f(x)=x^2-2x+C$입니다.
> $f(0)=C=2$에서 $f(x)=x^2-2x+2$이고, $f(1)=1-2+2=1$입니다.
- 해설 경로·판정 이유·직접 검산: $f'(x)=2x-2$의 원시함수 $x^2-2x+C$에서 초기조건 $C=2$를 정한다. $f(1)=1$이며 미분해서 원래 도함수로 돌아간다.
- 그림 판독: 원본 solutionImage 존재, 독립 렌더 NOT_RUN. 문제 조건의 수식만으로 잠정 판정.
- 현재 상태: READ_EVIDENCED / QA_NOT_RUN.

## Q04 — KEEP

- 출처: ordinal 4, id `4`, sourceIdentityKey `4`, blob `ea71febbfdf08462455fdadce3e6eed2045d17ae`.
- 문제 원문:

```text
4. $\int_{1}^{2} 4x^3 dx$의 값은? [4.0점]
보기 원문: ["$9$","$11$","$13$","$15$","$17$"]
```

- 원본 정답: `4`.
- 기존 solution의 실제 핵심 발췌:
> $\displaystyle\int_1^2 4x^3\,dx=[x^4]_1^2=2^4-1^4=16-1=15$입니다.
- 해설 경로·판정 이유·직접 검산: $\int_1^2 4x^3dx=[x^4]_1^2$의 상하한 대입이 있다. $16-1=15$이고 도함수 $(x^4)'=4x^3$으로 확인된다.
- 그림 판독: 필수 문제 그림 표시 없음.
- 현재 상태: READ_EVIDENCED / QA_NOT_RUN.

## Q05 — KEEP

- 출처: ordinal 5, id `5`, sourceIdentityKey `5`, blob `ea71febbfdf08462455fdadce3e6eed2045d17ae`.
- 문제 원문:

```text
5. 곡선 $y=-x^2+2x$와 $x$축으로 둘러싸인 도형의 넓이는? [4.2점]
보기 원문: ["$\\frac{4}{3}$","$\\frac{8}{3}$","$12$","$\\frac{16}{3}$","$\\frac{20}{3}$"]
```

- 원본 정답: `1`.
- 기존 solution의 실제 핵심 발췌:
> $-x^2+2x=x(2-x)=0$에서 교점의 $x$좌표는 $0,2$입니다.
> 따라서 $S=\displaystyle\int_0^2(-x^2+2x)\,dx=[-\frac{x^3}{3}+x^2]_0^2=-\frac83+4=\frac43$입니다.
- 해설 경로·판정 이유·직접 검산: $x(2-x)>0$인 구간 $(0,2)$을 먼저 정한 뒤 부호 없이 적분한다. 적분값 $-\frac83+4=\frac43$을 대입 확인했다.
- 그림 판독: 원본 solutionImage 존재, 독립 렌더 NOT_RUN. 문제 조건의 수식만으로 잠정 판정.
- 현재 상태: READ_EVIDENCED / QA_NOT_RUN.

## Q06 — KEEP

- 출처: ordinal 6, id `6`, sourceIdentityKey `6`, blob `ea71febbfdf08462455fdadce3e6eed2045d17ae`.
- 문제 원문:

```text
6. 함수 $f(x)=x^3+3x^2+a$이 극솟값 -14를 가질 때, 상수 $a$의 값은? [4.2점]
보기 원문: ["$-18$","$-14$","$-10$","$-6$","$-2$"]
```

- 원본 정답: `2`.
- 기존 solution의 실제 핵심 발췌:
> $f'(x)=3x^2+6x=3x(x+2)$이므로 임계점은 $x=-2,0$입니다.
> $f(0)=a=-14$이므로 $a=-14$입니다.
- 해설 경로·판정 이유·직접 검산: 도함수 $3x(x+2)$의 부호를 세 구간에서 나누어 $x=0$만 극솟점임을 보인다. $f(0)=a=-14$가 조건과 일치한다.
- 그림 판독: 원본 solutionImage 존재, 독립 렌더 NOT_RUN. 문제 조건의 수식만으로 잠정 판정.
- 현재 상태: READ_EVIDENCED / QA_NOT_RUN.

## Q07 — KEEP

- 출처: ordinal 7, id `7`, sourceIdentityKey `7`, blob `ea71febbfdf08462455fdadce3e6eed2045d17ae`.
- 문제 원문:

```text
7. 함수 $f(x)=\int \left\{ \frac{d}{dx}(x^2-3x+1) \right\} dx$에 대하여 방정식 $f(x)=2$의 모든 근의 곱이 -4일 때, $f(2)$의 값은? [4.2점]
보기 원문: ["$-4$","$-2$","$0$","$2$","$4$"]
```

- 원본 정답: `1`.
- 기존 solution의 실제 핵심 발췌:
> $\displaystyle f(x)=\int(2x-3)\,dx=x^2-3x+C$입니다.
> 따라서 $f(2)=4-6-2=-4$입니다.
- 해설 경로·판정 이유·직접 검산: $f(x)=x^2-3x+C$를 얻고 근의 곱 $C-2=-4$에서 $C=-2$를 결정한다. $f(2)=-4$ 및 두 근의 곱을 역대입했다.
- 그림 판독: 원본 solutionImage 존재, 독립 렌더 NOT_RUN. 문제 조건의 수식만으로 잠정 판정.
- 현재 상태: READ_EVIDENCED / QA_NOT_RUN.

## Q08 — KEEP

- 출처: ordinal 8, id `8`, sourceIdentityKey `8`, blob `ea71febbfdf08462455fdadce3e6eed2045d17ae`.
- 문제 원문:

```text
8. 함수 $f(x)=x^3+3x-3$의 역함수를 $g(x)$라고 할 때,

$$\int_{1}^{2} f(x)dx + \int_{1}^{11} g(x)dx$$

의 값은? [4.2점]
보기 원문: ["$17$","$19$","$21$","$23$","$25$"]
```

- 원본 정답: `3`.
- 기존 solution의 실제 핵심 발췌:
> 먼저 $f'(x)=3x^2+3>0$이므로 $f$는 증가함수이고 역함수 $g$가 존재합니다.
> $a=1$, $b=2$를 대입하면 구하는 값은 $2f(2)-1f(1)=2\cdot11-1\cdot1=21$입니다.
- 해설 경로·판정 이유·직접 검산: $f'(x)=3x^2+3>0$으로 역함수 존재를 증명하고, $f(1)=1,f(2)=11$의 대응 구간에서 적분 합이 $2f(2)-f(1)=21$임을 넓이로 설명한다.
- 그림 판독: 원본 solutionImage 존재, 독립 렌더 NOT_RUN. 문제 조건의 수식만으로 잠정 판정.
- 현재 상태: READ_EVIDENCED / QA_NOT_RUN.

## Q09 — KEEP

- 출처: ordinal 9, id `9`, sourceIdentityKey `9`, blob `ea71febbfdf08462455fdadce3e6eed2045d17ae`.
- 문제 원문:

```text
9. 닫힌구간 $[-2, 2]$에서 함수

$$f(x) = x^3 + 3x^2 + k - 5$$

의 최댓값이 8일 때, 함수 $f(x)$의 최솟값은? (단, $k$는 상수) [4.2점]
보기 원문: ["$-12$","$-6$","$-3$","$6$","$12$"]
```

- 원본 정답: `1`.
- 기존 solution의 실제 핵심 발췌:
> $f'(x)=3x^2+6x=3x(x+2)$입니다.
> 따라서 최솟값은 $f(0)=k-5=-12$입니다.
- 해설 경로·판정 이유·직접 검산: $f' =3x(x+2)$의 부호가 $(-2,0)$에서 음, $(0,2)$에서 양이다. 후보 $f(-2)=k-1,f(2)=k+15$ 비교와 $f(0)=-12$가 일치한다.
- 그림 판독: 원본 solutionImage 존재, 독립 렌더 NOT_RUN. 문제 조건의 수식만으로 잠정 판정.
- 현재 상태: READ_EVIDENCED / QA_NOT_RUN.

## Q10 — KEEP

- 출처: ordinal 10, id `10`, sourceIdentityKey `10`, blob `ea71febbfdf08462455fdadce3e6eed2045d17ae`.
- 문제 원문:

```text
10. 일차함수 $f(x)$에 대하여

$$\int_{-2}^{2} f(x)dx = -8, \quad \int_{-2}^{2} x f(x)dx = 16$$

일 때, 정적분 $\int_{-2}^{2} x^2 f(x)dx$의 값은? [4.2점]
보기 원문: ["$-\\frac{32}{3}$","$-\\frac{16}{3}$","$-\\frac{8}{3}$","$\\frac{16}{3}$","$\\frac{32}{3}$"]
```

- 원본 정답: `1`.
- 기존 solution의 실제 핵심 발췌:
> 일차함수를 $f(x)=ax+b$로 놓고 정적분 조건에서 계수를 정합니다.
> 구하는 적분은 $\displaystyle\int_{-2}^2 x^2(3x-2)dx=3\int_{-2}^2x^3dx-2\int_{-2}^2x^2dx=0-2\cdot\frac{16}{3}=-\frac{32}{3}$입니다.
- 해설 경로·판정 이유·직접 검산: 대칭구간의 홀함수 적분이 0이어서 $b=-2,a=3$을 얻는다. 독립 확인: $\int_{-2}^2 x^2(3x-2)dx=-2\cdot16/3=-32/3$.
- 그림 판독: 원본 solutionImage 존재, 독립 렌더 NOT_RUN. 문제 조건의 수식만으로 잠정 판정.
- 현재 상태: READ_EVIDENCED / QA_NOT_RUN.

## Q11 — HOLD

- 출처: ordinal 11, id `11`, sourceIdentityKey `11`, blob `ea71febbfdf08462455fdadce3e6eed2045d17ae`.
- 문제 원문:

```text
11. 그림과 같이 한 변의 길이가 $9\mathrm{cm}$인 정사각형의 한 꼭짓점 $\mathrm{A}$를 출발하여 그림의 화살표 방향으로 진행하는 두 점 $\mathrm{P}$, $\mathrm{Q}$가 있다. 점 $\mathrm{A}$를 출발하여 $t$초 후의 두 점 $\mathrm{P}$, $\mathrm{Q}$의 속력이 각각 $7t+5(\mathrm{cm}/\text{초})$, $3t+2(\mathrm{cm}/\text{초})$일 때, 두 점 $\mathrm{P}$, $\mathrm{Q}$가 동시에 출발한 후 9초 동안 두 점이 만난 횟수는 $n$이다. 이때, $n$의 값은? [4.8점]

<img src="assets/images/22_금당고_2학기_기말_고2_수학II/q11.png" style="max-width:300px; display:block; margin:10px auto;" />
보기 원문: ["$7$","$9$","$11$","$13$","$15$"]
```

- 원본 정답: `4`.
- 기존 solution의 실제 핵심 발췌:
> 한 변이 $9\mathrm{cm}$이므로 둘레는 $4\cdot9=36\mathrm{cm}$입니다.
> 그러므로 $n=13$이고 정답은 ④입니다.
- 해설 경로·판정 이유·직접 검산: 그림의 두 이동 방향을 실제 이미지로 확인하지 못했다. 풀이가 가정한 반대 방향이라면 $5t^2+7t=36k$에서 13회지만, 그림의 화살표가 이를 뒷받침하는지 원본 q11.png 시각 판독이 필요하다.
- 그림 판독: 문항 이미지 직접 시각 검토 NOT_RUN; 좌표·화살표·경계 확인 전 HOLD.
- 현재 상태: VISUAL_HOLD.

## Q12 — KEEP

- 출처: ordinal 12, id `12`, sourceIdentityKey `12`, blob `ea71febbfdf08462455fdadce3e6eed2045d17ae`.
- 문제 원문:

```text
12. 함수 $f(x)=x^3+6x^2+kx-1$이 닫힌구간 $[-3, 1]$에서 증가하도록 하는 상수 $k$의 최솟값은? [4.8점]
보기 원문: ["$2$","$3$","$4$","$6$","$12$"]
```

- 원본 정답: `5`.
- 기존 solution의 실제 핵심 발췌:
> $f'(x)=3x^2+12x+k=3(x+2)^2+k-12$입니다.
> $k=12$이면 $f'(x)=3(x+2)^2\ge0$으로 실제 증가하므로 최솟값은 $12$입니다.
- 해설 경로·판정 이유·직접 검산: $f'(x)=3(x+2)^2+k-12$의 최소가 $x=-2$에서 생긴다. $k=12$일 때 구간 전체에서 미분계수는 음수가 아니며 극소 조건과 맞다.
- 그림 판독: 원본 solutionImage 존재, 독립 렌더 NOT_RUN. 문제 조건의 수식만으로 잠정 판정.
- 현재 상태: READ_EVIDENCED / QA_NOT_RUN.

## Q13 — KEEP

- 출처: ordinal 13, id `13`, sourceIdentityKey `13`, blob `ea71febbfdf08462455fdadce3e6eed2045d17ae`.
- 문제 원문:

```text
13. 두 함수 $f(x)=x^3-2x^2+x$, $g(x)=x^2-2x-a$에 대하여 $x \ge -1$일 때, 함수 $y=f(x)$의 그래프가 함수 $y=g(x)$의 그래프보다 항상 위쪽에 있도록 하는 정수 $a$의 최솟값은? [4.8점]
보기 원문: ["$5$","$6$","$7$","$8$","$9$"]
```

- 원본 정답: `4`.
- 기존 solution의 실제 핵심 발췌:
> $f(x)-g(x)=x^3-3x^2+3x+a=(x-1)^3+a+1$입니다.
> $a=7$이면 경계에서 두 그래프가 만나므로 허용되지 않습니다.
- 해설 경로·판정 이유·직접 검산: $f-g=(x-1)^3+a+1$이고 $x\ge -1$에서는 최솟값 $a-7$이다. 경계에서 '항상 위쪽'은 엄격부등식이므로 $a=7$을 배제하고 $8$이다.
- 그림 판독: 원본 solutionImage 존재, 독립 렌더 NOT_RUN. 문제 조건의 수식만으로 잠정 판정.
- 현재 상태: READ_EVIDENCED / QA_NOT_RUN.

## Q14 — KEEP

- 출처: ordinal 14, id `14`, sourceIdentityKey `14`, blob `ea71febbfdf08462455fdadce3e6eed2045d17ae`.
- 문제 원문:

```text
14. 두 곡선 $y=x^3-ax+3$, $y=x^3-x^2$으로 둘러싸인 부분을 $\mathrm{A}$라 하자. 직선 $x=2$이 도형 $\mathrm{A}$의 넓이를 이등분 할 때, 도형 $\mathrm{A}$의 넓이를 $\mathrm{S}$라 하자. $6\mathrm{S}$의 값은? [4.8점]
보기 원문: ["$6$","$8$","$10$","$12$","$14$"]
```

- 원본 정답: `2`.
- 기존 solution의 실제 핵심 발췌:
> 첫째 곡선에서 둘째 곡선을 빼면 $(x^3-ax+3)-(x^3-x^2)=x^2-ax+3$입니다.
> 그러므로 $6S=6\cdot\frac43=8$이고 정답은 ②입니다.
- 해설 경로·판정 이유·직접 검산: 두 곡선 차가 $x^2-ax+3$인 포물선이므로 면적의 좌우 등분선이 대칭축 $x=a/2$임을 이용한다. $a=4$이면 $\int_1^3 (1-(x-2)^2)dx=4/3$, $6S=8$.
- 그림 판독: 원본 solutionImage 존재, 독립 렌더 NOT_RUN. 문제 조건의 수식만으로 잠정 판정.
- 현재 상태: READ_EVIDENCED / QA_NOT_RUN.

## Q15 — KEEP

- 출처: ordinal 15, id `15`, sourceIdentityKey `15`, blob `ea71febbfdf08462455fdadce3e6eed2045d17ae`.
- 문제 원문:

```text
15. 다음 조건을 만족시키는 모든 삼차함수 $f(x)$에 대하여 $\frac{f'(0)}{f(0)}$의 최댓값을 $M$, 최솟값을 $m$이라 하자. $Mm$의 값은? [4.8점]

(가) 함수 $|f(x)|$는 $x=-1$에서만 미분가능하지 않다.
(나) 방정식 $f(x)=0$은 닫힌구간 $[3, 5]$에서 적어도 하나의 실근을 갖는다.
보기 원문: ["$\\frac{1}{15}$","$\\frac{1}{10}$","$\\frac{2}{15}$","$\\frac{1}{6}$","$\\frac{1}{5}$"]
```

- 원본 정답: `5`.
- 기존 solution의 실제 핵심 발췌:
> 다항함수 $f$가 $x=r$에서 $f(r)=0$이고 $f'(r)\ne0$이면 그 근을 지나며 부호가 바뀝니다.
> 따라서 $Mm=\frac13\cdot\frac35=\frac15$이며 정답은 ⑤입니다.
- 해설 경로·판정 이유·직접 검산: $|f|$가 오직 $-1$에서 꺾이는 조건으로 단순근과 이중근을 구별해 $f=A(x+1)(x-r)^2$를 얻는다. $1-2/r$은 $3\le r\le5$에서 증가해 양 끝 곱이 $1/5$다.
- 그림 판독: 원본 solutionImage 존재, 독립 렌더 NOT_RUN. 문제 조건의 수식만으로 잠정 판정.
- 현재 상태: READ_EVIDENCED / QA_NOT_RUN.

## Q16 — HOLD

- 출처: ordinal 16, id `16`, sourceIdentityKey `16`, blob `ea71febbfdf08462455fdadce3e6eed2045d17ae`.
- 문제 원문:

```text
16. 최고차항의 계수가 1인 삼차함수 $f(x)$가 $f(0)=0$, $f(\alpha)=0$, $f'(\alpha)=0$이고 함수 $g(x)$가 다음 조건을 만족시킬 때, $g\left(\frac{\alpha}{6}\right)$의 값은? (단, $\alpha$는 양수이다.) [4.8점]

<img src="assets/images/22_금당고_2학기_기말_고2_수학II/q16.png" style="max-width:300px; display:block; margin:10px auto;" />

(가) $g'(x) = f(x) + xf'(x)$
(나) $g(x)$의 극댓값이 81이고 극솟값이 0이다.
보기 원문: ["$9$","$16$","$25$","$36$","$49$"]
```

- 원본 정답: `3`.
- 기존 solution의 실제 핵심 발췌:
> 최고차항의 계수가 $1$이고 $f(0)=0$, $f(\alpha)=f'(\alpha)=0$이므로 $0$은 근, $\alpha$는 중근입니다.
> 따라서 $g(\alpha/6)=g(1)=1^2(1-6)^2=25$입니다.
- 해설 경로·판정 이유·직접 검산: 원문 q16.png가 명시된 문항이다. 조건식만으로 $g=x^2(x-\alpha)^2+C$와 $g(\alpha/2)=\alpha^4/16$를 재산출할 수 있으나 그림의 표시/해석은 시각 검증하지 못했다. q16.png를 열어 확인해야 한다.
- 그림 판독: 문항 이미지 직접 시각 검토 NOT_RUN; 좌표·화살표·경계 확인 전 HOLD.
- 현재 상태: VISUAL_HOLD.

## Q17 — KEEP

- 출처: ordinal 17, id `17`, sourceIdentityKey `17`, blob `ea71febbfdf08462455fdadce3e6eed2045d17ae`.
- 문제 원문:

```text
[단답형1] 삼차함수 $f(x)=2x^3-3ax^2+2a^2+a$와 실수 $t$에 대하여 곡선 $y=f(x)$와 직선 $y=t$가 만나는 점의 개수를 $g(t)$라 하자. $g(1) < g(2) < g(3)$이 성립하도록 하는 양수 $a$의 값을 구하시오. [5.0점]
보기 원문: []
```

- 원본 정답: `2`.
- 기존 solution의 실제 핵심 발췌:
> 수평선 $y=t$와 삼차함수의 교점 개수는 극댓값과 극솟값을 경계로 달라집니다.
> 따라서 구하는 값은 $a=2$입니다.
- 해설 경로·판정 이유·직접 검산: 교점 수가 엄격히 증가하면 순서가 $(1,2,3)$이어야 한다. 극솟값 $L=2$ 조건의 후보 $a=1,2$ 가운데 $a=1$은 $U=3$ 경계라 제외되고 $a=2$만 남는다.
- 그림 판독: 원본 solutionImage 존재, 독립 렌더 NOT_RUN. 문제 조건의 수식만으로 잠정 판정.
- 현재 상태: READ_EVIDENCED / QA_NOT_RUN.

## Q18 — KEEP

- 출처: ordinal 18, id `18`, sourceIdentityKey `18`, blob `ea71febbfdf08462455fdadce3e6eed2045d17ae`.
- 문제 원문:

```text
[단답형2] 실수 전체의 집합에서 정의된 함수

$$f(x) = \int_{0}^{1} t |t-x| dt$$

에 대하여 $\int_{-1}^{3} f(x)dx$의 값을 구하시오. [5.0점]
보기 원문: []
```

- 원본 정답: `25/12`.
- 기존 solution의 실제 핵심 발췌:
> 따라서 $f(x)=\int_0^1t(t-x)\,dt=[\frac{t^3}{3}-\frac{x t^2}{2}]_0^1=\frac13-\frac x2$입니다.
> 따라서 $\int_{-1}^3f(x)\,dx=\frac7{12}+\frac16+\frac43=\frac{7+2+16}{12}=\frac{25}{12}$입니다.
- 해설 경로·판정 이유·직접 검산: $t-x$의 부호를 $x\le0$, $0\le x\le1$, $x\ge1$로 나눠 이중적분을 정적분 세 개로 계산한다. 각 구간 값 $7/12,1/6,4/3$의 합 $25/12$로 확인된다.
- 그림 판독: 원본 solutionImage 존재, 독립 렌더 NOT_RUN. 문제 조건의 수식만으로 잠정 판정.
- 현재 상태: READ_EVIDENCED / QA_NOT_RUN.

## Q19 — KEEP

- 출처: ordinal 19, id `19`, sourceIdentityKey `19`, blob `ea71febbfdf08462455fdadce3e6eed2045d17ae`.
- 문제 원문:

```text
[서술형1] 삼차함수 $f(x)=x^3-x$에 대하여 곡선 $y=f(x)$와 $x$축으로 둘러싸인 두 부분의 넓이의 합을 $S$라 하자. 곡선 $y=f(x)$와 직선 $y=mx$ ($m>0$)로 둘러싸인 두 부분의 넓이의 합을 $S(m)$이라 할 때, $\frac{S(m)}{S}=25$를 만족시키는 상수 $m$값을 구하는 과정을 서술하시오. [10.0점]
보기 원문: []
```

- 원본 정답: `4`.
- 기존 solution의 실제 핵심 발췌:
> $f(x)=x^3-x=x(x-1)(x+1)$이므로 $x$축과의 교점은 $-1,0,1$입니다.
> 따라서 $\dfrac{S(m)}S=(m+1)^2=25$이고, $m>0$이므로 $m+1=5$, $m=4$입니다.
- 해설 경로·판정 이유·직접 검산: 교점 $\pm\sqrt{m+1},0$에서 위아래 함수 차를 적분한다. $S=1/2$, $S(m)=(m+1)^2/2$의 비가 25이면 $m>0$에 의해 $m=4$가 유일하다.
- 그림 판독: 원본 solutionImage 존재, 독립 렌더 NOT_RUN. 문제 조건의 수식만으로 잠정 판정.
- 현재 상태: READ_EVIDENCED / QA_NOT_RUN.

## Q20 — KEEP

- 출처: ordinal 20, id `20`, sourceIdentityKey `20`, blob `ea71febbfdf08462455fdadce3e6eed2045d17ae`.
- 문제 원문:

```text
[서술형2] 최고차항의 계수가 1인 삼차함수 $f(x)$가 다음 조건을 만족시킨다.

(가) $f(10)=0$, $f'(10)>0$
(나) 함수 $f(x)$는 음수인 극솟값을 갖는다.
(다) $x$에 대한 방정식 $|f(x)|=t$의 서로 다른 실근의 개수가 4인 $t$값의 범위는 $0 < t < 4$이다.

$f(15)$의 값을 구하는 과정을 서술하시오. [10.0점]
보기 원문: []
```

- 원본 정답: `320`.
- 기존 solution의 실제 핵심 발췌:
> $|f(x)|=t$ ($t>0$)의 해는 수평선 $y=t$와 $y=-t$가 $y=f(x)$와 만나는 점들을 합친 것입니다.
> 그러므로 $f(x)=(x-7)^2(x-10)$이고 $f(15)=8^2\cdot5=320$입니다.
- 해설 경로·판정 이유·직접 검산: $|f|=t$의 교점수가 작은 양수 t에서 4가 되려면 극댓값이 0이어야 하고 극솟값은 -4여야 한다. 이중근 $r$와 단순근 10에서 $d=10-r=3$을 구해 $f(15)=320$을 직접 대입한다.
- 그림 판독: 원본 solutionImage 존재, 독립 렌더 NOT_RUN. 문제 조건의 수식만으로 잠정 판정.
- 현재 상태: READ_EVIDENCED / QA_NOT_RUN.

## 종합·인계

- 분모 20 = KEEP 18 + UPGRADE 0 + HOLD 2 + UNREAD 0.
- 추가 이미지 확인: Q11, Q16. SVG 엔진 신규 제작 없음.
- Golden/Negative, 독립 검산, JS diff·문법, 학생 화면 exam/sol/ans 렌더: NOT_RUN. 운영 main 병합 금지.
