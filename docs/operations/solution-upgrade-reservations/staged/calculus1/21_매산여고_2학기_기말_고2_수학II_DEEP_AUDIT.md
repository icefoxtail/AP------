# 미적분Ⅰ(구 수학Ⅱ) lane10 심층 감사 — 21_매산여고_2학기_기말_고2_수학II

- 범위: 고2 2학기 기말 `수학II` 기출 → 미적분Ⅰ 전담, 원본 시험지 23문항.
- sourcePath: `archive/exams/original/high/h2/2final/21_매산여고_2학기_기말_고2_수학II.js`; 원본 Git ref `main`, blob SHA `c97b388bfac32f6f6dc048b072bbd17bdf33d14f`.
- 작업 브랜치: `work/solution-upgrade-lane-10-20261121`; 결과 파일 `docs/operations/solution-upgrade-reservations/staged/calculus1/21_매산여고_2학기_기말_고2_수학II_DEEP_AUDIT.md`.
- 원본 전 문항 발문·보기·정답·기존 해설: **23/23 읽음**; 최종 판정 **KEEP 23 / UPGRADE 0 / HOLD 0 / UNREAD 0**.
- 원본 문제 시각 파일 2개: `archive/assets/images/21_매산여고_2학기_기말_고2_수학II/q06-quality-v4.svg` (Q6, SVG 좌표·polyline 본문 직접 검사), `archive/assets/images/21_매산여고_2학기_기말_고2_수학II/q20.png` (Q20, PNG 실제 판독). 해설 solutionImage SVG·학생 화면 독립 렌더 QA는 **NOT_RUN**.
- 절차: 각 문제의 원문·보기·정답과 기존 solution에서 실제 문장/계산을 확인하고, 계산·범위·부호를 독립 대조. 공유 점유 조회/claim은 사용자 지시대로 생략. `main` JS·정답·보기·SVG는 변경하지 않음.
- 단계: **EXAM_AUDIT_COMPLETE / EXAM_DRAFT_COMPLETE / RELEASE_QA_NOT_RUN**. 자료 수집/해설 초안이 최종 출고·병합 PASS를 의미하지 않는다. Golden/Negative, preflight SHA-256 receipt, 학생 렌더와 운영 출고 QA 미실시.

## Q01 — KEEP

- ordinal: 1; id: `1`; sourceQid: `NOT_PRESENT`; questionUid: `NOT_PRESENT`; source blob: `c97b388bfac32f6f6dc048b072bbd17bdf33d14f`.
- 과목·분류: `수학II` / `속도와 거리`.
- 원본 문제·보기 필드 직접 확인:

```text
좌표가 $2$인 점에서 출발하여 수직선 위를 움직이는 점 $P$의 시각 $t$에서 속도가 $v(t)=3-4t$일 때,
$t=3$에서 점 $P$의 위치를 구하면? [3.6점]
원본 보기: ["$-7$","$-6$","$-5$","$-4$","$-3$"]
```

- 원본 정답: `①`.
- **기존 solution 실제 원문 핵심 발췌:**
> 속도는 위치 함수의 도함수이므로, 처음 위치에 속도를 적분한다.
> 따라서 점 $P$의 위치는 $-7$이다.
- **독립 검산 및 KEEP 판정:** 초기 위치 2에 속도 $3-4t$의 0~3 적분 9-18=-9를 더하면 위치 -7이다.
- 원본 그림: 원본 문제 이미지 별도 연결 없음. 해설 SVG: `assets/images/21_매산여고_2학기_기말_고2_수학II/q1-solution.svg` (solutionImage 렌더 NOT_RUN).
- 점검 상태: SOURCE_READ_EVIDENCED / TEXT_ONLY / RELEASE_QA_NOT_RUN.

## Q02 — KEEP

- ordinal: 2; id: `2`; sourceQid: `NOT_PRESENT`; questionUid: `NOT_PRESENT`; source blob: `c97b388bfac32f6f6dc048b072bbd17bdf33d14f`.
- 과목·분류: `수학II` / `부정적분`.
- 원본 문제·보기 필드 직접 확인:

```text
등식 $\displaystyle\int(px^3-8x+q)\,dx=x^4+rx^2+7x+C$를 만족시키는 상수 $p,q,r$에 대하여 $p+q+r$의 값을 구하면? (단, $C$는 적분상수이다.) [3.7점]
원본 보기: ["$6$","$7$","$8$","$9$","$10$"]
```

- 원본 정답: `②`.
- **기존 solution 실제 원문 핵심 발췌:**
> 부정적분의 양변을 각각 계산한다.
> $p+q+r=4+7-4=7$이다.
- **독립 검산 및 KEEP 판정:** 항별 적분의 계수 비교에서 p/4=1, r=-4, q=7이므로 p+q+r=7이다.
- 원본 그림: 원본 문제 이미지 별도 연결 없음. 해설 SVG: 없음.
- 점검 상태: SOURCE_READ_EVIDENCED / TEXT_ONLY / RELEASE_QA_NOT_RUN.

## Q03 — KEEP

- ordinal: 3; id: `3`; sourceQid: `NOT_PRESENT`; questionUid: `NOT_PRESENT`; source blob: `c97b388bfac32f6f6dc048b072bbd17bdf33d14f`.
- 과목·분류: `수학II` / `정적분의 활용`.
- 원본 문제·보기 필드 직접 확인:

```text
곡선 $y=3x^2-12x+9$와 $x$축 및 $y$축, 직선 $x=3$으로 둘러싸인 부분의 넓이를 구하면? [3.7점]
원본 보기: ["$6$","$7$","$8$","$9$","$10$"]
```

- 원본 정답: `③`.
- **기존 solution 실제 원문 핵심 발췌:**
> 넓이를 구하기 전에 곡선이 $x$축과 만나는 점을 찾는다.
> $=4-(0-4)=8$이다.
- **독립 검산 및 KEEP 판정:** 곡선 영점 1,3을 기준으로 [0,1] 양의 적분 4와 [1,3] 음의 적분 -4를 절댓값 합해 넓이 8이다.
- 원본 그림: 원본 문제 이미지 별도 연결 없음. 해설 SVG: `assets/images/21_매산여고_2학기_기말_고2_수학II/q3-solution.svg` (solutionImage 렌더 NOT_RUN).
- 점검 상태: SOURCE_READ_EVIDENCED / TEXT_ONLY / RELEASE_QA_NOT_RUN.

## Q04 — KEEP

- ordinal: 4; id: `4`; sourceQid: `NOT_PRESENT`; questionUid: `NOT_PRESENT`; source blob: `c97b388bfac32f6f6dc048b072bbd17bdf33d14f`.
- 과목·분류: `수학II` / `도함수의 활용`.
- 원본 문제·보기 필드 직접 확인:

```text
함수 $f(x)=x^3+3x^2-9x+a$의 극댓값이 $12$일 때, 상수 $a$의 값을 구하면? [3.6점]
원본 보기: ["$-11$","$-12$","$-13$","$-14$","$-15$"]
```

- 원본 정답: `⑤`.
- **기존 solution 실제 원문 핵심 발췌:**
> 극값이 생기는 점을 도함수로 찾는다.
> $a=-15$이다.
- **독립 검산 및 KEEP 판정:** $f'=3(x+3)(x-1)$의 양→음 전환 x=-3에서 f(-3)=27+a=12, a=-15다.
- 원본 그림: 원본 문제 이미지 별도 연결 없음. 해설 SVG: `assets/images/21_매산여고_2학기_기말_고2_수학II/q4-solution.svg` (solutionImage 렌더 NOT_RUN).
- 점검 상태: SOURCE_READ_EVIDENCED / TEXT_ONLY / RELEASE_QA_NOT_RUN.

## Q05 — KEEP

- ordinal: 5; id: `5`; sourceQid: `NOT_PRESENT`; questionUid: `NOT_PRESENT`; source blob: `c97b388bfac32f6f6dc048b072bbd17bdf33d14f`.
- 과목·분류: `수학II` / `정적분`.
- 원본 문제·보기 필드 직접 확인:

```text
$f(x)=5x^3+6x^2-4x-2$에서 $\displaystyle\int_{-3}^{-5}f(x)\,dx-\displaystyle\int_3^{-5}f(x)\,dx$의 값을 구하면? [3.8점]
원본 보기: ["$92$","$94$","$96$","$98$","$100$"]
```

- 원본 정답: `③`.
- **기존 solution 실제 원문 핵심 발췌:**
> 정적분의 구간 방향을 먼저 바꾼다.
> $=2[2x^3-2x]_0^3=2(54-6)=96$이다.
- **독립 검산 및 KEEP 판정:** 적분구간 방향을 정리하면 ∫_{-3}³ f; 홀차항 소거 후 2∫₀³(6x²−2)=96이다.
- 원본 그림: 원본 문제 이미지 별도 연결 없음. 해설 SVG: 없음.
- 점검 상태: SOURCE_READ_EVIDENCED / TEXT_ONLY / RELEASE_QA_NOT_RUN.

## Q06 — KEEP

- ordinal: 6; id: `6`; sourceQid: `NOT_PRESENT`; questionUid: `NOT_PRESENT`; source blob: `c97b388bfac32f6f6dc048b072bbd17bdf33d14f`.
- 과목·분류: `수학II` / `속도와 거리`.
- 원본 문제·보기 필드 직접 확인:

```text
원점을 출발하여 수직선 위를 $9$초 동안 움직이는 점 $P$의 시각 $t$초에서 속도 $v(t)$의 그래프가 다음과 같을 때, 점 $P$의 운동에 대한 설명 중 옳은 것을 모두 고르면? [3.8점]
ㄱ. 출발 후 $9$초 동안 운동 방향이 두 번 바뀐다.
ㄴ. $t=3$에서 $t=8$까지 움직인 거리는 $4$이다.
ㄷ. $t=1$일 때와 $t=3$일 때의 속력은 서로 같다.
ㄹ. 출발한 지 $7$초 후에 다시 원점으로 돌아온다.
원본 보기: ["ㄱ, ㄴ","ㄱ, ㄷ","ㄱ, ㄹ","ㄴ, ㄷ","ㄷ, ㄹ"]
```

- 원본 정답: `②`.
- **기존 solution 실제 원문 핵심 발췌:**
> 그래프가 $t$축과 만나는 시각은 $t=0,2,5,9$이다. 각 구간의 부호를 읽어 판단한다.
> 참인 것은 ㄱ, ㄷ이므로 정답은 ②이다.
- **독립 검산 및 KEEP 판정:** 원본 문제 SVG의 구간 꼭짓점 (0,0),(1,4),(3,-4),(4,-4),(6,4),(8,4),(9,0)을 실제 SVG polyline 좌표로 확인; t=2,5에서 속도 부호 전환, |v(1)|=|v(3)|=4, 3~8 거리 16, t=7 변위 2여서 ㄱ·ㄷ만 참이다.
- 원본 그림: `archive/assets/images/21_매산여고_2학기_기말_고2_수학II/q06-quality-v4.svg` (blob `151fa3556c3e2374b7f9a2b08fb4470f6acb0da3`, 원본 SVG 경로/꺾은선 좌표 확인; SVG 화면 렌더는 NOT_RUN). 해설 SVG: `assets/images/21_매산여고_2학기_기말_고2_수학II/q6-solution.svg` (solutionImage 렌더 NOT_RUN).
- 점검 상태: SOURCE_READ_EVIDENCED / SOURCE_FIGURE_EVIDENCED / RELEASE_QA_NOT_RUN.

## Q07 — KEEP

- ordinal: 7; id: `7`; sourceQid: `NOT_PRESENT`; questionUid: `NOT_PRESENT`; source blob: `c97b388bfac32f6f6dc048b072bbd17bdf33d14f`.
- 과목·분류: `수학II` / `정적분의 활용`.
- 원본 문제·보기 필드 직접 확인:

```text
두 곡선 $y=x^2$과 $y=-x^2+8x$로 둘러싸인 부분의 넓이를 직선 $x=a$가 이등분할 때, 상수 $a$의 값을 구하면? [3.9점]
원본 보기: ["$\\dfrac{1}{2}$","$1$","$\\dfrac{3}{2}$","$2$","$\\dfrac{5}{2}$"]
```

- 원본 정답: `④`.
- **기존 solution 실제 원문 핵심 발췌:**
> 두 곡선 사이의 세로 길이는 $(-x^2+8x)-x^2=-2x^2+8x$이다. 교점은 $x=0,4$이다.
> 따라서 $a=2$이다.
- **독립 검산 및 KEEP 판정:** 곡선 차 $-2x²+8x=2x(4-x)$의 [0,4] 넓이 64/3, [0,2] 넓이 32/3으로 수직 이등분 위치 a=2다.
- 원본 그림: 원본 문제 이미지 별도 연결 없음. 해설 SVG: 없음.
- 점검 상태: SOURCE_READ_EVIDENCED / TEXT_ONLY / RELEASE_QA_NOT_RUN.

## Q08 — KEEP

- ordinal: 8; id: `8`; sourceQid: `NOT_PRESENT`; questionUid: `NOT_PRESENT`; source blob: `c97b388bfac32f6f6dc048b072bbd17bdf33d14f`.
- 과목·분류: `수학II` / `접선`.
- 원본 문제·보기 필드 직접 확인:

```text
두 곡선 $f(x)=-x^2+ax+b$, $g(x)=x^3+c$가 점 $(-1,2)$를 지나고, 이 점에서 공통인 접선을 가질 때, $a+b+c$의 값을 구하면? (단, $a,b,c$는 상수이다.) [3.9점]
원본 보기: ["$4$","$5$","$6$","$7$","$8$"]
```

- 원본 정답: `⑤`.
- **기존 solution 실제 원문 핵심 발췌:**
> 두 곡선이 $(-1,2)$를 지나므로 각 함수값이 $2$이다.
> $a+b+c=1+4+3=8$이다.
- **독립 검산 및 KEEP 판정:** 공통 접선 조건 f(-1)=g(-1)=2, f'(-1)=g'(-1)=3에서 a=1,b=4,c=3, 합 8이다.
- 원본 그림: 원본 문제 이미지 별도 연결 없음. 해설 SVG: 없음.
- 점검 상태: SOURCE_READ_EVIDENCED / TEXT_ONLY / RELEASE_QA_NOT_RUN.

## Q09 — KEEP

- ordinal: 9; id: `9`; sourceQid: `NOT_PRESENT`; questionUid: `NOT_PRESENT`; source blob: `c97b388bfac32f6f6dc048b072bbd17bdf33d14f`.
- 과목·분류: `수학II` / `정적분`.
- 원본 문제·보기 필드 직접 확인:

```text
함수 $f(x)=(x-1)^3+3$의 역함수를 $g(x)$라 할 때, $\displaystyle\int_1^3 f(x)\,dx+\displaystyle\int_3^{11}g(x)\,dx$의 값을 구하면? [3.9점]
원본 보기: ["$15$","$20$","$25$","$30$","$35$"]
```

- 원본 정답: `④`.
- **기존 solution 실제 원문 핵심 발췌:**
> 먼저 역함수를 구한다.
> 따라서 두 적분의 합은 $10+20=30$이다.
- **독립 검산 및 KEEP 판정:** 역함수 g(x)=1+∛(x−3), 첫 적분 ∫₁³f=10, 둘째 ∫₃¹¹g=20로 총 30이다.
- 원본 그림: 원본 문제 이미지 별도 연결 없음. 해설 SVG: 없음.
- 점검 상태: SOURCE_READ_EVIDENCED / TEXT_ONLY / RELEASE_QA_NOT_RUN.

## Q10 — KEEP

- ordinal: 10; id: `10`; sourceQid: `NOT_PRESENT`; questionUid: `NOT_PRESENT`; source blob: `c97b388bfac32f6f6dc048b072bbd17bdf33d14f`.
- 과목·분류: `수학II` / `정적분`.
- 원본 문제·보기 필드 직접 확인:

```text
최고차항의 계수가 $1$인 삼차함수 $f(x)$가 임의의 실수 $a$에 대하여 $\displaystyle\int_{-a}^a f(x)\,dx=0$을 만족시킨다. $f'(0)=-4$일 때, $f(1)$의 값을 구하면? [4.1점]
원본 보기: ["$-1$","$-2$","$-3$","$-4$","$-5$"]
```

- 원본 정답: `③`.
- **기존 solution 실제 원문 핵심 발췌:**
> 삼차함수를 $f(x)=x^3+ax^2+bx+c$라 놓는다.
> $f(1)=1-4=-3$이다.
- **독립 검산 및 KEEP 판정:** 모든 대칭구간 적분 0이면 삼차함수의 짝수차항·상수항이 0; f'(0)=-4에서 f=x³−4x, f(1)=-3이다.
- 원본 그림: 원본 문제 이미지 별도 연결 없음. 해설 SVG: 없음.
- 점검 상태: SOURCE_READ_EVIDENCED / TEXT_ONLY / RELEASE_QA_NOT_RUN.

## Q11 — KEEP

- ordinal: 11; id: `11`; sourceQid: `NOT_PRESENT`; questionUid: `NOT_PRESENT`; source blob: `c97b388bfac32f6f6dc048b072bbd17bdf33d14f`.
- 과목·분류: `수학II` / `속도와 가속도`.
- 원본 문제·보기 필드 직접 확인:

```text
수직선 위를 움직이는 두 점 $P,Q$에 대하여 시각 $t$ ($t\ge0$)에서 점 $P$의 위치를 $x_1$, 점 $Q$의 위치를 $x_2$라 하자.
$x_1=3t^3-3t^2+7t$, $x_2=2t^3+4t^2-3t$일 때, 두 점 $P,Q$가 동시에 원점을 출발한 후 처음으로 만나는 순간 점 $P$의 속도를 구하면? [4.0점]
원본 보기: ["$31$","$32$","$33$","$34$","$35$"]
```

- 원본 정답: `①`.
- **기존 solution 실제 원문 핵심 발췌:**
> 두 점의 위치가 같을 때를 구한다.
> $x_1'(2)=36-12+7=31$이다.
- **독립 검산 및 KEEP 판정:** 두 위치 차 $t(t−2)(t−5)$의 첫 양의 해 t=2, P의 속도 $9t²−6t+7$은 31이다.
- 원본 그림: 원본 문제 이미지 별도 연결 없음. 해설 SVG: 없음.
- 점검 상태: SOURCE_READ_EVIDENCED / TEXT_ONLY / RELEASE_QA_NOT_RUN.

## Q12 — KEEP

- ordinal: 12; id: `12`; sourceQid: `NOT_PRESENT`; questionUid: `NOT_PRESENT`; source blob: `c97b388bfac32f6f6dc048b072bbd17bdf33d14f`.
- 과목·분류: `수학II` / `부정적분`.
- 원본 문제·보기 필드 직접 확인:

```text
미분가능한 함수 $f(x)$가
$f'(x)=\begin{cases}2x^3&(x\ge1)\\3x^2-2x+1&(x<1)\end{cases}$
을 만족시키고 $f(-1)=5$일 때, $f(3)$의 값을 구하면? [4.1점]
원본 보기: ["$46$","$47$","$48$","$49$","$50$"]
```

- 원본 정답: `④`.
- **기존 solution 실제 원문 핵심 발췌:**
> 주어진 도함수를 적분해 두 구간에서 $f$를 구한다.
> $f(3)=\frac{81}{2}+\frac{17}{2}=49$이다.
- **독립 검산 및 KEEP 판정:** 좌우 도함수를 따로 적분하고 x=1의 연속성을 사용해 C₂=8,C₁=17/2; f(3)=49다.
- 원본 그림: 원본 문제 이미지 별도 연결 없음. 해설 SVG: 없음.
- 점검 상태: SOURCE_READ_EVIDENCED / TEXT_ONLY / RELEASE_QA_NOT_RUN.

## Q13 — KEEP

- ordinal: 13; id: `13`; sourceQid: `NOT_PRESENT`; questionUid: `NOT_PRESENT`; source blob: `c97b388bfac32f6f6dc048b072bbd17bdf33d14f`.
- 과목·분류: `수학II` / `미분계수`.
- 원본 문제·보기 필드 직접 확인:

```text
다항함수 $f(x)$가 다음 조건을 만족시킬 때, $f(3)$의 값을 구하면? [4.1점]
(가) $\displaystyle\lim_{h\to0}\dfrac{f(x+2h)-f(x)}{3h}=ax$
(나) $f(2)=10$, $f(-1)=1$
원본 보기: ["$5$","$10$","$15$","$20$","$25$"]
```

- 원본 정답: `⑤`.
- **기존 solution 실제 원문 핵심 발췌:**
> 주어진 극한은 미분계수의 정의와 비교한다.
> $f(3)=27-2=25$이다.
- **독립 검산 및 KEEP 판정:** 차분몫은 $(2/3)f'(x)=ax$, 적분 후 f(2)=10,f(-1)=1을 풀어 a=4,C=-2, f(3)=25다.
- 원본 그림: 원본 문제 이미지 별도 연결 없음. 해설 SVG: 없음.
- 점검 상태: SOURCE_READ_EVIDENCED / TEXT_ONLY / RELEASE_QA_NOT_RUN.

## Q14 — KEEP

- ordinal: 14; id: `14`; sourceQid: `NOT_PRESENT`; questionUid: `NOT_PRESENT`; source blob: `c97b388bfac32f6f6dc048b072bbd17bdf33d14f`.
- 과목·분류: `수학II` / `정적분`.
- 원본 문제·보기 필드 직접 확인:

```text
임의의 실수 $x$에 대하여 다항함수 $f(x)$가 $\displaystyle\int_2^x(x-t)f(t)\,dt=x^4+ax^3+2x^2+20x+b$를 만족시킬 때, $a+b+f(-1)$의 값을 구하면? (단, $a,b$는 상수) [4.3점]
원본 보기: ["$16$","$17$","$18$","$19$","$20$"]
```

- 원본 정답: `②`.
- **기존 solution 실제 원문 핵심 발췌:**
> 양변을 $x$에 대해 미분한다.
> $a+b+f(-1)=-5-24+46=17$이다.
- **독립 검산 및 KEEP 판정:** Leibniz 첫 미분은 ∫₂ˣf=4x³+3ax²+4x+20; x=2에서 a=-5. 두 번째 미분 f=12x²-30x+4, 원식 x=2에서 b=-24, 합 17다.
- 원본 그림: 원본 문제 이미지 별도 연결 없음. 해설 SVG: 없음.
- 점검 상태: SOURCE_READ_EVIDENCED / TEXT_ONLY / RELEASE_QA_NOT_RUN.

## Q15 — KEEP

- ordinal: 15; id: `15`; sourceQid: `NOT_PRESENT`; questionUid: `NOT_PRESENT`; source blob: `c97b388bfac32f6f6dc048b072bbd17bdf33d14f`.
- 과목·분류: `수학II` / `정적분`.
- 원본 문제·보기 필드 직접 확인:

```text
다항함수 $f(x)$가 $\displaystyle3\int_{-2}^1x^2f(x)\,dx+\int_{-2}^1(x^3+1)f'(x)\,dx=50$을 만족시킨다. $f(1)=4$일 때, $f(-2)$의 값을 구하면? [4.0점]
원본 보기: ["$6$","$7$","$8$","$9$","$10$"]
```

- 원본 정답: `①`.
- **기존 solution 실제 원문 핵심 발췌:**
> 적분 안의 두 항을 한 도함수로 묶는다.
> $f(-2)=6$이다.
- **독립 검산 및 KEEP 판정:** 곱 도함수 $(x³+1)f$의 경계값은 $2f(1)+7f(-2)=50$이고 f(1)=4로 f(-2)=6이다.
- 원본 그림: 원본 문제 이미지 별도 연결 없음. 해설 SVG: 없음.
- 점검 상태: SOURCE_READ_EVIDENCED / TEXT_ONLY / RELEASE_QA_NOT_RUN.

## Q16 — KEEP

- ordinal: 16; id: `16`; sourceQid: `NOT_PRESENT`; questionUid: `NOT_PRESENT`; source blob: `c97b388bfac32f6f6dc048b072bbd17bdf33d14f`.
- 과목·분류: `수학II` / `도함수의 활용`.
- 원본 문제·보기 필드 직접 확인:

```text
두 함수 $f(x)=4ax^2-a^2x-12$, $g(x)=x^3+2ax^2-3a$에 대하여 $x>0$일 때 $f(x)\le g(x)$가 성립하도록 하는 모든 자연수 $a$의 합을 구하면? [3.9점]
원본 보기: ["$2$","$4$","$6$","$8$","$10$"]
```

- 원본 정답: `⑤`.
- **기존 solution 실제 원문 핵심 발췌:**
> $h(x)=g(x)-f(x)$라 두면 $x>0$에서 $h(x)\ge0$이어야 한다.
> 그 합은 $10$이다.
- **독립 검산 및 KEEP 판정:** 두 함수 차 $h=x(x-a)^2+12-3a$는 x=a에서 첫항 0이고 x>0에서 비음수; a≤4인 자연수 1~4 합 10이다.
- 원본 그림: 원본 문제 이미지 별도 연결 없음. 해설 SVG: 없음.
- 점검 상태: SOURCE_READ_EVIDENCED / TEXT_ONLY / RELEASE_QA_NOT_RUN.

## Q17 — KEEP

- ordinal: 17; id: `17`; sourceQid: `NOT_PRESENT`; questionUid: `NOT_PRESENT`; source blob: `c97b388bfac32f6f6dc048b072bbd17bdf33d14f`.
- 과목·분류: `수학II` / `도함수의 활용`.
- 원본 문제·보기 필드 직접 확인:

```text
삼차함수 $f(x)=-x^3-4x+3$, $g(x)=x^2-5x+5$에 대하여 부등식 $f(g(x))\le-{f(x)}^3-4f(x)+3$을 만족시키는 $x$의 최솟값을 구하면? [4.3점]
원본 보기: ["$-2$","$-1$","$0$","$1$","$2$"]
```

- 원본 정답: `①`.
- **기존 solution 실제 원문 핵심 발췌:**
> $F(u)=-u^3-4u+3$이라 두면 $f=F$이고 주어진 부등식은 $F(g(x))\le F(f(x))$이다.
> 따라서 $x$의 최솟값은 $-2$이다.
- **독립 검산 및 KEEP 판정:** $f(u)=-u³-4u+3$은 전구간 엄격 감소이므로 합성부등식은 g(x)≥f(x); 차 $(x+2)(x²−x+1)$에서 최소 x=-2다.
- 원본 그림: 원본 문제 이미지 별도 연결 없음. 해설 SVG: `assets/images/21_매산여고_2학기_기말_고2_수학II/q17-solution.svg` (solutionImage 렌더 NOT_RUN).
- 점검 상태: SOURCE_READ_EVIDENCED / TEXT_ONLY / RELEASE_QA_NOT_RUN.

## Q18 — KEEP

- ordinal: 18; id: `18`; sourceQid: `NOT_PRESENT`; questionUid: `NOT_PRESENT`; source blob: `c97b388bfac32f6f6dc048b072bbd17bdf33d14f`.
- 과목·분류: `수학II` / `도함수의 활용`.
- 원본 문제·보기 필드 직접 확인:

```text
사차방정식 $x^4-4x^3-2x^2+12x-k=0$의 서로 다른 네 근 $\alpha,\beta,\gamma,\delta$에 대하여 $\alpha<0<\beta<\gamma<\delta$일 때, 모든 정수 $k$의 개수를 구하면? [4.3점]
원본 보기: ["$5$","$6$","$7$","$8$","$9$"]
```

- 원본 정답: `②`.
- **기존 solution 실제 원문 핵심 발췌:**
> $p(x)=x^4-4x^3-2x^2+12x$라 두고 $p(x)=k$의 교점을 살핀다.
> 가능한 정수는 $1,2,3,4,5,6$으로 모두 $6$개이다.
- **독립 검산 및 KEEP 판정:** 사차다항식의 극값 $p(-1)=-9,p(1)=7,p(3)=-9$와 p(0)=0을 비교해 음의 근 1·양의 근 3개는 0<k<7; 정수 6개다.
- 원본 그림: 원본 문제 이미지 별도 연결 없음. 해설 SVG: 없음.
- 점검 상태: SOURCE_READ_EVIDENCED / TEXT_ONLY / RELEASE_QA_NOT_RUN.

## Q19 — KEEP

- ordinal: 19; id: `19`; sourceQid: `NOT_PRESENT`; questionUid: `NOT_PRESENT`; source blob: `c97b388bfac32f6f6dc048b072bbd17bdf33d14f`.
- 과목·분류: `수학II` / `정적분의 활용`.
- 원본 문제·보기 필드 직접 확인:

```text
[주관식1 (단답형)] 곡선 $y=x^3-2x^2-x+2$ 위의 점 $(2,0)$에서의 접선과 이 곡선으로 둘러싸인 도형의 넓이를 구하여라. [4점]
원본 보기: []
```

- 원본 정답: `$\dfrac{64}{3}$`.
- **기존 solution 실제 원문 핵심 발췌:**
> 곡선 위의 $(2,0)$에서 접선의 기울기는
> $=[\frac14x^4-\frac23x^3-2x^2+8x]_{-2}^{2}=\frac{64}{3}$이다.
- **독립 검산 및 KEEP 판정:** 점 (2,0)에서 접선은 y=3x-6, 곡선 차 $(x-2)^2(x+2)$가 [-2,2]에서 음수가 아니므로 둘러싸인 적분 넓이는 64/3이다.
- 원본 그림: 원본 문제 이미지 별도 연결 없음. 해설 SVG: `assets/images/21_매산여고_2학기_기말_고2_수학II/q19-solution.svg` (solutionImage 렌더 NOT_RUN).
- 점검 상태: SOURCE_READ_EVIDENCED / TEXT_ONLY / RELEASE_QA_NOT_RUN.

## Q20 — KEEP

- ordinal: 20; id: `20`; sourceQid: `NOT_PRESENT`; questionUid: `NOT_PRESENT`; source blob: `c97b388bfac32f6f6dc048b072bbd17bdf33d14f`.
- 과목·분류: `수학II` / `도함수의 활용`.
- 원본 문제·보기 필드 직접 확인:

```text
[주관식2 (단답형)] 그림과 같이 밑면의 반지름의 길이가 $8$, 높이가 $12$인 원뿔의 내부에 밑면이 정사각형인 직육면체를 내접시킬 때, 직육면체의 부피가 최대가 되는 직육면체 밑면의 한 변의 길이를 구하여라. [4점]
원본 보기: []
```

- 원본 정답: `$\dfrac{16\sqrt2}{3}$`.
- **기존 solution 실제 원문 핵심 발췌:**
> 밑면의 한 변을 $x$, 직육면체의 높이를 $y$라 둔다. 수평 단면의 정사각형 대각선은 원의 지름이므로 원뿔 단면의 반지름은 $\frac{x\sqrt2}{2}$이다.
> 따라서 부피가 최대일 때 밑면의 한 변은 $\frac{16\sqrt2}{3}$이다.
- **독립 검산 및 KEEP 판정:** 원본 원뿔 PNG에서 원뿔 높이 12·밑면 반지름 8과 안쪽 정사각기둥을 확인; 닮음으로 h=12−(3√2/4)x, V'=0에서 밑면 한 변 16√2/3이다.
- 원본 그림: `archive/assets/images/21_매산여고_2학기_기말_고2_수학II/q20.png` (blob `65c0f6d2ca79678a3dc55469bbb1830e4c3cd08d`, 원본 PNG 직접 판독 PASS). 해설 SVG: `assets/images/21_매산여고_2학기_기말_고2_수학II/q20-solution.svg` (solutionImage 렌더 NOT_RUN).
- 점검 상태: SOURCE_READ_EVIDENCED / SOURCE_FIGURE_EVIDENCED / RELEASE_QA_NOT_RUN.

## Q21 — KEEP

- ordinal: 21; id: `21`; sourceQid: `NOT_PRESENT`; questionUid: `NOT_PRESENT`; source blob: `c97b388bfac32f6f6dc048b072bbd17bdf33d14f`.
- 과목·분류: `수학II` / `정적분의 활용`.
- 원본 문제·보기 필드 직접 확인:

```text
[주관식3 (서술형)] 함수 $f(x)=\displaystyle\int_x^1(2t^3-6t^2)\,dt$일 때, 다음 물음에 답하여라. [총 7점](부분점수 없음.)
1) 함수 $f'(x)$를 구하여라. (2점)
2) 함수 $f(x)=\displaystyle\int_x^1(2t^3-6t^2)\,dt$의 극댓값을 구하여라. (3점)
3) $y=f'(x)$와 $x$축으로 둘러싸인 도형의 넓이를 구하여라. (2점)
원본 보기: []
```

- 원본 정답: `1) $-2x^3+6x^2$; 2) $12$; 3) $\dfrac{27}{2}$`.
- **기존 solution 실제 원문 핵심 발췌:**
> 1) 적분의 아래끝이 $x$이므로 미분할 때 부호가 붙는다.
> $\displaystyle\text{넓이}=\int_0^3(-2x^3+6x^2)\,dx=[-\frac12x^4+2x^3]_0^3=\frac{27}{2}$이다.
- **독립 검산 및 KEEP 판정:** 하한 미분으로 f'=-2x³+6x², 3에서 극대 f(3)=12, f'와 축 사이 [0,3] 넓이 27/2다.
- 원본 그림: 원본 문제 이미지 별도 연결 없음. 해설 SVG: `assets/images/21_매산여고_2학기_기말_고2_수학II/q21-solution.svg` (solutionImage 렌더 NOT_RUN).
- 점검 상태: SOURCE_READ_EVIDENCED / TEXT_ONLY / RELEASE_QA_NOT_RUN.

## Q22 — KEEP

- ordinal: 22; id: `22`; sourceQid: `NOT_PRESENT`; questionUid: `NOT_PRESENT`; source blob: `c97b388bfac32f6f6dc048b072bbd17bdf33d14f`.
- 과목·분류: `수학II` / `도함수의 활용`.
- 원본 문제·보기 필드 직접 확인:

```text
[주관식4 (서술형)] 함수 <br>$f(x)=(x^2+ax+b)(ax-b)$라 하자. 함수 $f(x)$의 역함수가 존재할 때 다음 물음에 답하여라. (단, $a,b$는 $a>0$, $b\ne0$인 상수) [총 7점](부분점수 있음.)
1) 두 실수 $a,b$의 관계식을 구하여라. (4점)
2) 함수 $(x-a)f(x)$가 $x=4$에서 극솟값을 가질 때, 함수 $f(x)$를 구하여라. (3점)
원본 보기: []
```

- 원본 정답: `$b=a^2$, $a=4$, $b=16$, $f(x)=4x^3-256$`.
- **기존 solution 실제 원문 핵심 발췌:**
> 전개하면
> 따라서 $b=16$이고 $f(x)=4x^3-256$이다.
- **독립 검산 및 KEEP 판정:** 역함수 존재의 비단조 배제 조건은 b=a², 따라서 f=ax³−a⁴. $(x-a)f$의 x=4 도함수 0에서 a=4, b=16, f=4x³−256다.
- 원본 그림: 원본 문제 이미지 별도 연결 없음. 해설 SVG: 없음.
- 점검 상태: SOURCE_READ_EVIDENCED / TEXT_ONLY / RELEASE_QA_NOT_RUN.

## Q23 — KEEP

- ordinal: 23; id: `23`; sourceQid: `NOT_PRESENT`; questionUid: `NOT_PRESENT`; source blob: `c97b388bfac32f6f6dc048b072bbd17bdf33d14f`.
- 과목·분류: `수학II` / `도함수의 활용`.
- 원본 문제·보기 필드 직접 확인:

```text
[주관식5 (서술형)] 삼차함수 $f(x)$가 다음 조건을 만족시킨다.
(가) $\displaystyle\lim_{x\to0}\dfrac{f(x)-5}{x}=0$
(나) $f(x)$의 극댓값과 극솟값의 곱은 $5$이다.
함수 $g(x)$는 $0\le x<3$일 때 $g(x)=f(x)$이고 모든 실수 $x$에 대하여 $g(x+3)=g(x)$이다. $g(x)$가 실수 전체의 집합에서 연속일 때, $\displaystyle\int_0^{24}g(x)\,dx$의 값을 구하여라. [총 7점](부분점수 있음.)
1) 함수 $f(x)$를 구하여라. (4점)
2) $\displaystyle\int_0^{24}g(x)\,dx$의 값을 구하여라. (3점)
원본 보기: []
```

- 원본 정답: `$f(x)=x^3-3x^2+5$; $\displaystyle\int_0^{24}g(x)\,dx=66$`.
- **기존 solution 실제 원문 핵심 발췌:**
> 삼차함수를 $f(x)=ax^3+bx^2+cx+d$라 두자.
> $=8[\frac14x^4-x^3+5x]_0^3=66$이다.
- **독립 검산 및 KEEP 판정:** 극한 조건에서 f(0)=5,f'(0)=0이고 주기 3의 연속에서 f(3)=5; 극값 곱 5로 f=x³−3x²+5, 한 주기 적분 33/4를 8배하여 66이다.
- 원본 그림: 원본 문제 이미지 별도 연결 없음. 해설 SVG: `assets/images/21_매산여고_2학기_기말_고2_수학II/q23-solution.svg` (solutionImage 렌더 NOT_RUN).
- 점검 상태: SOURCE_READ_EVIDENCED / TEXT_ONLY / RELEASE_QA_NOT_RUN.

## 종료 검증 및 후속 인계

- 전체 source 문제·기존 solution 판독: **23/23**. KEEP 23, UPGRADE 0, HOLD 0, UNREAD 0; 개선 해설 작성 대상 없음(원문 계산/정답 충돌 발견 없음).
- 실물 문제 PNG 판독: **1**개. SVG 도형 파라미터 검사: **1**개, 별도 raster/학생 렌더 NOT_RUN.
- 다음 단계: Golden/Negative, preflight 영수증·학생 화면 확인·출고 QA. 완료 전 운영 JS·main 병합 PASS로 표기하지 않는다.
