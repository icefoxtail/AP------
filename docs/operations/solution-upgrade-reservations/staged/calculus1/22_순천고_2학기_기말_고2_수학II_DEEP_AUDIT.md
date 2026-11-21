# 미적분Ⅰ(구 수학Ⅱ) lane10 심층 감사 — 22_순천고_2학기_기말_고2_수학II

- 범위: 고2 2학기 기말 `수학II` 기출 → 미적분Ⅰ 전담, 원본 시험지 22문항.
- sourcePath: `archive/exams/original/high/h2/2final/22_순천고_2학기_기말_고2_수학II.js`; 원본 Git ref `main`, blob SHA `ca14c242aa86fc276bc5de80156a790dee186a54`.
- 작업 브랜치: `work/solution-upgrade-lane-10-20261121`; 결과 파일 `docs/operations/solution-upgrade-reservations/staged/calculus1/22_순천고_2학기_기말_고2_수학II_DEEP_AUDIT.md`.
- 원본 전 문항 발문·보기·정답·기존 해설: **22/22 읽음**; 최종 판정 **KEEP 22 / UPGRADE 0 / HOLD 0 / UNREAD 0**.
- 원본 문제 시각 파일 2개: `assets/images/22_순천고_2학기_기말_고2_수학II/q3.png` (Q3, PNG 실제 판독), `assets/images/22_순천고_2학기_기말_고2_수학II/q21.png` (Q21, PNG 실제 판독). 해설 solutionImage SVG·학생 화면 독립 렌더 QA는 **NOT_RUN**.
- 절차: 각 문제의 원문·보기·정답과 기존 solution에서 실제 문장/계산을 확인하고, 계산·범위·부호를 독립 대조. 공유 점유 조회/claim은 사용자 지시대로 생략. `main` JS·정답·보기·SVG는 변경하지 않음.
- 단계: **EXAM_AUDIT_COMPLETE / EXAM_DRAFT_COMPLETE / RELEASE_QA_NOT_RUN**. 자료 수집/해설 초안이 최종 출고·병합 PASS를 의미하지 않는다. Golden/Negative, preflight SHA-256 receipt, 학생 렌더와 운영 출고 QA 미실시.

## Q01 — KEEP

- ordinal: 1; id: `1`; sourceQid: `1`; questionUid: `NOT_PRESENT`; source blob: `ca14c242aa86fc276bc5de80156a790dee186a54`.
- 과목·분류: `수학II` / `최대·최소`.
- 원본 문제·보기 필드 직접 확인:

```text
1. 닫힌구간 $[-2, 2]$에서 함수 $f(x)=x^3-\frac{3}{2}x^2-6x+a$의 최솟값이 $-8$일 때, $a$의 값은? (단, $a$는 상수이다.) [3.0점]
원본 보기: ["$1$","$2$","$4$","$8$","$16$"]
```

- 원본 정답: `②`.
- **기존 solution 실제 원문 핵심 발췌:**
> [조건 확인] $f(x)=x^3-\frac32x^2-6x+a$의 구간 $[-2,2]$에서 최솟값이 $-8$이다. 닫힌구간의 최솟값은 양 끝점과 내부의 도함수 영점에서 비교한다.
> [보기 판단] ① $a=1$이면 최솟값 $-9$, ② $a=2$이면 $-8$, ③ $a=4$이면 $-6$, ④ $a=8$이면 $-2$, ⑤ $a=16$이면 $6$이다. 끝점 $x=2$를 빼고 극점만 보는 실수를 피한다. 정답 ②.
- **독립 검산 및 KEEP 판정:** $f'=3(x+1)(x-2)$에서 [-2,2] 후보 -2,-1,2의 함수값은 a-2,a+7/2,a-10; 최소 a-10=-8로 a=2다.
- 원본 그림: 원본 문제 이미지 별도 연결 없음. 해설 SVG: `assets/images/22_순천고_2학기_기말_고2_수학II/q1-solution.svg` (solutionImage 렌더 NOT_RUN).
- 점검 상태: SOURCE_READ_EVIDENCED / TEXT_ONLY / RELEASE_QA_NOT_RUN.

## Q02 — KEEP

- ordinal: 2; id: `2`; sourceQid: `2`; questionUid: `NOT_PRESENT`; source blob: `ca14c242aa86fc276bc5de80156a790dee186a54`.
- 과목·분류: `수학II` / `속도와 가속도`.
- 원본 문제·보기 필드 직접 확인:

```text
2. 수직선 위를 움직이는 점 $\mathrm{P}$의 시각 $t(t \ge 0)$에서의 위치 $x$가 $x=t^3-2t^2-2t$이다. 점 $\mathrm{P}$의 속도가 2가 되는 시각 $t$의 값은? [3.0점]
원본 보기: ["$1$","$2$","$3$","$4$","$5$"]
```

- 원본 정답: `②`.
- **기존 solution 실제 원문 핵심 발췌:**
> [전략] 위치를 미분하면 속도이다. $x(t)=t^3-2t^2-2t$이므로 $v(t)=x'(t)=3t^2-4t-2$.
> [보기 판단] ① 1에서는 $v=-3$, ② 2에서는 $v=2$, ③ 3에서는 $v=13$, ④ 4에서는 $v=30$, ⑤ 5에서는 $v=53$이다. 음수 해를 시간으로 채택하지 않는다. 정답 ②.
- **독립 검산 및 KEEP 판정:** 속도 $3t^2-4t-2=2$의 해는 $t=2,-2/3$이고 시각 $t\ge0$ 조건상 2만 남는다.
- 원본 그림: 원본 문제 이미지 별도 연결 없음. 해설 SVG: `assets/images/22_순천고_2학기_기말_고2_수학II/q2-solution.svg` (solutionImage 렌더 NOT_RUN).
- 점검 상태: SOURCE_READ_EVIDENCED / TEXT_ONLY / RELEASE_QA_NOT_RUN.

## Q03 — KEEP

- ordinal: 3; id: `3`; sourceQid: `3`; questionUid: `NOT_PRESENT`; source blob: `ca14c242aa86fc276bc5de80156a790dee186a54`.
- 과목·분류: `수학II` / `속도와 가속도`.
- 원본 문제·보기 필드 직접 확인:

```text
3. 수직선 위를 움직이는 점 $\mathrm{P}$의 시각 $t$에서의 속도를 $v(t)$라고 하자. $y=v(t)$의 그래프가 다음 그림과 같을 때, 점 $\mathrm{P}$는 운동 방향을 바꾸는 횟수는? (단, $0 \le t \le 20$) [3.0점]
원본 보기: ["$1$","$2$","$3$","$4$","$5$"]
```

- 원본 정답: `③`.
- **기존 solution 실제 원문 핵심 발췌:**
> [그림 해석] 운동 방향은 속도 $v(t)$의 부호가 바뀔 때만 바뀐다. $v(t)=0$인 순간이 있어도 그래프가 축에 닿았다가 같은 쪽으로 돌아오면 방향 변화가 아니다.
> [보기 판단] ①·②는 실제 축 교차 세 곳 중 일부를 빠뜨린 횟수이고, ④·⑤는 부호 변화 없는 접촉까지 세었거나 출발점 $t=0$을 잘못 포함한 횟수이다. 정답 ③.
- **독립 검산 및 KEEP 판정:** 원본 v(t) PNG에서 양의 부분과 음의 부분을 가로지르는 축 교차는 3곳이고 나머지 접촉점은 부호 유지; 방향 전환 3회(③)다.
- 원본 그림: `assets/images/22_순천고_2학기_기말_고2_수학II/q3.png` (blob `6c104bd0be1e2aa6fed5c8f7e983f8bf6fdcdcb6`, 원본 PNG 직접 판독 PASS). 해설 SVG: `assets/images/22_순천고_2학기_기말_고2_수학II/q3-solution.svg` (solutionImage 렌더 NOT_RUN).
- 점검 상태: SOURCE_READ_EVIDENCED / SOURCE_FIGURE_EVIDENCED / RELEASE_QA_NOT_RUN.

## Q04 — KEEP

- ordinal: 4; id: `4`; sourceQid: `4`; questionUid: `NOT_PRESENT`; source blob: `ca14c242aa86fc276bc5de80156a790dee186a54`.
- 과목·분류: `수학II` / `조건을 이용한 함수 결정`.
- 원본 문제·보기 필드 직접 확인:

```text
4. 다음 중 함수 $f(x)=3x^2-4x+2$을 도함수로 가질 수 있는 함수 $F(x)$는? [3.0점]
원본 보기: ["$F(x)=6x-4$","$F(x)=(3x-1)(x-2)$","$F(x)=(x-1)^3$","$F(x)=\\frac{1}{3}x^3-2x$","$F(x)=x^3-2x^2+2x+10$"]
```

- 원본 정답: `⑤`.
- **기존 solution 실제 원문 핵심 발췌:**
> [전략] $F$의 도함수가 $f$라는 뜻은 $F'(x)=3x^2-4x+2$이다. 원시함수는 $F(x)=x^3-2x^2+2x+C$.
> ⑤만 일치한다. 적분상수 $10$은 미분하면 없어져도 괜찮다. 정답 ⑤.
- **독립 검산 및 KEEP 판정:** 원시함수 $F=x^3-2x^2+2x+C$를 직접 미분하면 $3x^2-4x+2$이고 다섯 보기 중 ⑤다.
- 원본 그림: 원본 문제 이미지 별도 연결 없음. 해설 SVG: 없음.
- 점검 상태: SOURCE_READ_EVIDENCED / TEXT_ONLY / RELEASE_QA_NOT_RUN.

## Q05 — KEEP

- ordinal: 5; id: `5`; sourceQid: `5`; questionUid: `NOT_PRESENT`; source blob: `ca14c242aa86fc276bc5de80156a790dee186a54`.
- 과목·분류: `수학II` / `정적분의 뜻`.
- 원본 문제·보기 필드 직접 확인:

```text
5. 다음 정적분 $\int_{-1}^{2} (x^2+4x+2)dx$의 값은? [3.0점]
원본 보기: ["$9$","$12$","$15$","$18$","$21$"]
```

- 원본 정답: `③`.
- **기존 solution 실제 원문 핵심 발췌:**
> [전략] 다항함수는 항별로 적분하고 상한에서의 값에서 하한에서의 값을 뺀다.
> [보기 판단] ① 9, ② 12, ④ 18, ⑤ 21은 계산 결과 15와 다르다. 특히 $x=-1$을 대입할 때 $(-1)^3=-1$ 및 아래끝값을 빼는 부호를 확인한다. 정답 ③.
- **독립 검산 및 KEEP 판정:** 원시함수 $x^3/3+2x^2+2x$에서 상한 44/3, 하한 -1/3을 빼면 15다.
- 원본 그림: 원본 문제 이미지 별도 연결 없음. 해설 SVG: 없음.
- 점검 상태: SOURCE_READ_EVIDENCED / TEXT_ONLY / RELEASE_QA_NOT_RUN.

## Q06 — KEEP

- ordinal: 6; id: `6`; sourceQid: `6`; questionUid: `NOT_PRESENT`; source blob: `ca14c242aa86fc276bc5de80156a790dee186a54`.
- 과목·분류: `수학II` / `조건을 이용한 함수 결정`.
- 원본 문제·보기 필드 직접 확인:

```text
6. $f(x)$가 $f(x)=\int 5dx + \int 6x^5dx$를 만족시키고 $f(0)=0$일 때, $f(1)$의 값은? [3.5점]
원본 보기: ["$4$","$5$","$6$","$7$","$8$"]
```

- 원본 정답: `③`.
- **기존 solution 실제 원문 핵심 발췌:**
> [전략] 두 부정적분의 적분상수는 합쳐 하나의 상수 $C$로 둔다.
> [보기 판단] ① 4, ② 5는 $x^6$ 항을 누락하거나 부호를 잘못 처리한 값, ④ 7, ⑤ 8은 적분상수 또는 거듭제곱 계수를 잘못 더한 값이다. $f(0)=0$을 먼저 적용해야 한다. 정답 ③.
- **독립 검산 및 KEEP 판정:** 두 적분의 상수를 하나로 합쳐 $f=5x+x^6+C$; $f(0)=0$에서 $C=0$, $f(1)=6$이다.
- 원본 그림: 원본 문제 이미지 별도 연결 없음. 해설 SVG: 없음.
- 점검 상태: SOURCE_READ_EVIDENCED / TEXT_ONLY / RELEASE_QA_NOT_RUN.

## Q07 — KEEP

- ordinal: 7; id: `7`; sourceQid: `7`; questionUid: `NOT_PRESENT`; source blob: `ca14c242aa86fc276bc5de80156a790dee186a54`.
- 과목·분류: `수학II` / `방정식과 부등식`.
- 원본 문제·보기 필드 직접 확인:

```text
7. 모든 실수 $x$에 대하여 부등식 $3x^4+4x^3+5 \ge a$가 성립하도록 하는 실수 $a$의 최댓값은? [3.5점]
원본 보기: ["$5$","$4$","$3$","$2$","$1$"]
```

- 원본 정답: `②`.
- **기존 solution 실제 원문 핵심 발췌:**
> [조건] 모든 실수 $x$에 $3x^4+4x^3+5\ge a$가 성립하려면 $a$는 이 다항함수의 전역 최솟값 이하여야 한다.
> [보기 판단] ① 5는 $x=-1$에서 부등식을 위반한다. ② 4는 모든 $x$에 성립한다. ③ 3, ④ 2, ⑤ 1은 성립하지만 최댓값이 아니다. 정답 ②.
- **독립 검산 및 KEEP 판정:** 도함수 $12x^2(x+1)$가 -1에서만 음→양, $p(-1)=4$라 $a_{\max}=4$다.
- 원본 그림: 원본 문제 이미지 별도 연결 없음. 해설 SVG: `assets/images/22_순천고_2학기_기말_고2_수학II/q7-solution.svg` (solutionImage 렌더 NOT_RUN).
- 점검 상태: SOURCE_READ_EVIDENCED / TEXT_ONLY / RELEASE_QA_NOT_RUN.

## Q08 — KEEP

- ordinal: 8; id: `8`; sourceQid: `8`; questionUid: `NOT_PRESENT`; source blob: `ca14c242aa86fc276bc5de80156a790dee186a54`.
- 과목·분류: `수학II` / `증가·감소와 극값`.
- 원본 문제·보기 필드 직접 확인:

```text
8. 함수 $f(x)=x^3-3x^2+a$($a$는 상수)의 모든 극값의 곱이 $-4$일 때, $a+\int_{-2}^{2} f(x)dx$의 값은? [4.4점]
원본 보기: ["$-6$","$-3$","$0$","$3$","$6$"]
```

- 원본 정답: `①`.
- **기존 solution 실제 원문 핵심 발췌:**
> [극값부터 결정] $f'(x)=3x(x-2)$이므로 극점은 $x=0,2$, 극값은 각각 $a,a-4$이다. 조건에 따라 $a(a-4)=-4$, 즉 $(a-2)^2=0$에서 $a=2$.
> [보기 판단] ① $-6$만 일치한다. ② $-3$, ③ $0$, ④ $3$, ⑤ $6$은 극값의 곱을 극점의 곱으로 오해하거나 $-3x^2$의 적분을 빠뜨렸을 때 생기는 불일치 값이다. 정답 ①.
- **독립 검산 및 KEEP 판정:** 도함수 $3x(x-2)$에서 극값은 $a,a-4$이고 곱 -4는 $(a-2)^2=0$; $a=2$, 대칭 적분은 -8, 합 -6다.
- 원본 그림: 원본 문제 이미지 별도 연결 없음. 해설 SVG: `assets/images/22_순천고_2학기_기말_고2_수학II/q8-solution.svg` (solutionImage 렌더 NOT_RUN).
- 점검 상태: SOURCE_READ_EVIDENCED / TEXT_ONLY / RELEASE_QA_NOT_RUN.

## Q09 — KEEP

- ordinal: 9; id: `9`; sourceQid: `9`; questionUid: `NOT_PRESENT`; source blob: `ca14c242aa86fc276bc5de80156a790dee186a54`.
- 과목·분류: `수학II` / `도함수`.
- 원본 문제·보기 필드 직접 확인:

```text
9. 이차함수 $f(x)$가 모든 실수 $x$에 대하여 $f(x)=f'(x)+2x^2$을 만족시킬 때, $\frac{d}{dx} \int f(x)dx$의 최솟값은? [4.4점]
원본 보기: ["$-1$","$0$","$1$","$2$","$3$"]
```

- 원본 정답: `④`.
- **기존 solution 실제 원문 핵심 발췌:**
> [전략] $f$가 이차함수이므로 $f(x)=Ax^2+Bx+C$라 두고 항등식의 계수를 비교한다.
> [보기 판단] ① $-1$, ② 0, ③ 1은 제곱항 $2(x+1)^2\ge0$에 어긋난다. ④ 2는 $x=-1$에서 실현된다. ⑤ 3은 가능한 값이지만 최솟값은 아니다. 정답 ④.
- **독립 검산 및 KEEP 판정:** 항등식 계수 비교로 $f=2x^2+4x+4=2(x+1)^2+2$, 따라서 $\frac{d}{dx}\int f$의 최소는 2다.
- 원본 그림: 원본 문제 이미지 별도 연결 없음. 해설 SVG: `assets/images/22_순천고_2학기_기말_고2_수학II/q9-solution.svg` (solutionImage 렌더 NOT_RUN).
- 점검 상태: SOURCE_READ_EVIDENCED / TEXT_ONLY / RELEASE_QA_NOT_RUN.

## Q10 — KEEP

- ordinal: 10; id: `10`; sourceQid: `10`; questionUid: `NOT_PRESENT`; source blob: `ca14c242aa86fc276bc5de80156a790dee186a54`.
- 과목·분류: `수학II` / `정적분의 뜻`.
- 원본 문제·보기 필드 직접 확인:

```text
10. 함수 $f(x)=|x+1|+|x|+|x-1|$의 최솟값 $a$에 대하여 정적분 $\int_{-2}^{a} f(x)dx$의 값은? [4.4점]
원본 보기: ["$14$","$15$","$16$","$17$","$18$"]
```

- 원본 정답: `①`.
- **기존 solution 실제 원문 핵심 발췌:**
> [절댓값의 기준점] $x=-1,0,1$에서 식이 바뀐다. $-1\le x\le0$에서는 $f=2-x$, $0\le x\le1$에서는 $f=2+x$이므로 최솟값은 $x=0$에서 $a=2$이다.
> [보기 판단] ① 14가 정확하다. ② 15, ③ 16, ④ 17, ⑤ 18은 구간 분할 없이 절댓값을 전개하거나 짝함수 적분을 두 배 하는 과정을 잘못 처리한 값이다. 정답 ①.
- **독립 검산 및 KEEP 판정:** 절댓값 합 $|x+1|+|x|+|x-1|$의 최소는 x=0에서 a=2이고, 짝함수 적분 2[(5/2)+(9/2)]=14다.
- 원본 그림: 원본 문제 이미지 별도 연결 없음. 해설 SVG: `assets/images/22_순천고_2학기_기말_고2_수학II/q10-solution.svg` (solutionImage 렌더 NOT_RUN).
- 점검 상태: SOURCE_READ_EVIDENCED / TEXT_ONLY / RELEASE_QA_NOT_RUN.

## Q11 — KEEP

- ordinal: 11; id: `11`; sourceQid: `11`; questionUid: `NOT_PRESENT`; source blob: `ca14c242aa86fc276bc5de80156a790dee186a54`.
- 과목·분류: `수학II` / `도형 활용`.
- 원본 문제·보기 필드 직접 확인:

```text
11. 곡선 $y=x^2-2x$와 직선 $y=kx$로 둘러싸인 부분의 넓이가 $x$축에 의하여 이등분되도록 하는 상수 $k$의 값에 대하여 $(k+2)^3$의 값은? [4.6점]
원본 보기: ["$-1$","$1$","$8$","$16$","$25$"]
```

- 원본 정답: `④`.
- **기존 solution 실제 원문 핵심 발췌:**
> [그림 대신 교점·부호] 두 식 $x^2-2x=kx$에서 $x(x-(k+2))=0$이므로 교점의 $x$좌표는 $0,L=k+2$이다. $x$축이 둘러싸인 부분을 두 양의 넓이로 나누려면 $k>0$이어야 하고, 따라서 $L>2$이다.
> [보기 판단] ① $-1$, ② 1, ③ 8, ⑤ 25는 면적 등식 $L^3=16$을 만족하지 않는다. ④ 16만 가능하다. 정답 ④.
- **독립 검산 및 KEEP 판정:** 곡선-직선 차 $x(k+2-x)$의 전체 넓이 $(k+2)^3/6$와 x축 아래 넓이 $4/3$이 절반으로 같아 $(k+2)^3=16$이다.
- 원본 그림: 원본 문제 이미지 별도 연결 없음. 해설 SVG: `assets/images/22_순천고_2학기_기말_고2_수학II/q11-solution-v2.svg` (solutionImage 렌더 NOT_RUN).
- 점검 상태: SOURCE_READ_EVIDENCED / TEXT_ONLY / RELEASE_QA_NOT_RUN.

## Q12 — KEEP

- ordinal: 12; id: `12`; sourceQid: `12`; questionUid: `NOT_PRESENT`; source blob: `ca14c242aa86fc276bc5de80156a790dee186a54`.
- 과목·분류: `수학II` / `방정식과 부등식`.
- 원본 문제·보기 필드 직접 확인:

```text
12. 최고차항의 계수가 1인 삼차함수 $f(x)$가 다음 조건을 만족시킬 때, 방정식 $f(x)=n$이 서로 다른 3개의 실근을 갖도록 하는 모든 자연수 $n$의 개수는? [4.6점]

(가) 모든 실수 $x$에 대하여 $f(-x)=-f(x)$이다.
(나) 곡선 $y=f(x)$와 직선 $y=f(2)$는 서로 다른 두 점에서 만나고, $f(2)<0$이다.
원본 보기: ["$15$","$19$","$23$","$27$","$31$"]
```

- 원본 정답: `①`.
- **기존 solution 실제 원문 핵심 발췌:**
> [홀함수 조건] 최고차항이 1인 삼차함수에서 $f(-x)=-f(x)$이므로 짝수차항·상수항이 0이다. $f(x)=x^3+px$.
> [보기 판단] ① 15가 정답. ② 19, ③ 23, ④ 27, ⑤ 31은 극값 경계 $\pm16$ 또는 자연수의 양수 조건을 잘못 적용한 수이다. 정답 ①.
- **독립 검산 및 KEEP 판정:** 홀삼차식 $f=x^3+px$와 f(2)<0 및 y=f(2)의 접점/교점 이중 조건을 대입하면 p=-12; 극대값 16 아래 자연수 15개다.
- 원본 그림: 원본 문제 이미지 별도 연결 없음. 해설 SVG: `assets/images/22_순천고_2학기_기말_고2_수학II/q12-solution.svg` (solutionImage 렌더 NOT_RUN).
- 점검 상태: SOURCE_READ_EVIDENCED / TEXT_ONLY / RELEASE_QA_NOT_RUN.

## Q13 — KEEP

- ordinal: 13; id: `13`; sourceQid: `13`; questionUid: `NOT_PRESENT`; source blob: `ca14c242aa86fc276bc5de80156a790dee186a54`.
- 과목·분류: `수학II` / `접선`.
- 원본 문제·보기 필드 직접 확인:

```text
13. 점 $(-1, k)$에서 곡선 $y=x^3-3x$에 서로 다른 세 개의 접선을 그을 수 있을 때, 다음 중 실수 $k$의 값의 범위가 $\alpha < k < \beta$일 때, $\alpha+\beta$의 값은? [4.6점]
원본 보기: ["$1$","$2$","$3$","$4$","$5$"]
```

- 원본 정답: `⑤`.
- **기존 solution 실제 원문 핵심 발췌:**
> [접선 조건] 접점을 $x=t$라 두면 $y=x^3-3x$의 접선은 $y=(3t^2-3)(x-t)+t^3-3t$이다.
> [보기 판단] ① 1, ② 2, ③ 3, ④ 4는 양 경계값의 합 5와 다르다. ⑤ 5가 정답. 경계 $k=2,3$에서는 중근 때문에 세 접선이 아니다.
- **독립 검산 및 KEEP 판정:** 외부점 (-1,k)을 지나는 접선의 접점 방정식 $K(t)=3-3t^2-2t^3=k$, 극값 2,3 사이에서 3접선; 경계합 5다.
- 원본 그림: 원본 문제 이미지 별도 연결 없음. 해설 SVG: `assets/images/22_순천고_2학기_기말_고2_수학II/q13-solution.svg` (solutionImage 렌더 NOT_RUN).
- 점검 상태: SOURCE_READ_EVIDENCED / TEXT_ONLY / RELEASE_QA_NOT_RUN.

## Q14 — KEEP

- ordinal: 14; id: `14`; sourceQid: `14`; questionUid: `NOT_PRESENT`; source blob: `ca14c242aa86fc276bc5de80156a790dee186a54`.
- 과목·분류: `수학II` / `방정식과 부등식`.
- 원본 문제·보기 필드 직접 확인:

```text
14. $x$에 대한 삼차방정식 $\frac{1}{3}x^3-x=k$가 서로 다른 세 실근 $\alpha, \beta, \gamma$를 가진다. 실수 $k$에 대하여 $|\alpha|+|\beta|+|\gamma|$의 최솟값을 $m$이라 할 때, $m^2$의 값은? [5.0점]
원본 보기: ["$9$","$12$","$16$","$27$","$48$"]
```

- 원본 정답: `②`.
- **기존 solution 실제 원문 핵심 발췌:**
> [세 실근 조건] $\frac13x^3-x=k$의 도함수는 $x^2-1$, 극댓값은 $x=-1$에서 $\frac23$, 극솟값은 $x=1$에서 $-\frac23$. 따라서 $-\frac23<k<\frac23$일 때 서로 다른 세 실근이다.
> [보기 판단] ① 9, ③ 16, ④ 27, ⑤ 48은 이 최솟값의 제곱과 다르다. ② 12가 정답. $k=0$도 서로 다른 세 근을 가지므로 경계 제외 조건과 혼동하지 않는다.
- **독립 검산 및 KEEP 판정:** $f=x^3/3-x$는 k=0에서 세 근 -√3,0,√3이 되며 절댓값 합 최소 2√3, 제곱 12다.
- 원본 그림: 원본 문제 이미지 별도 연결 없음. 해설 SVG: `assets/images/22_순천고_2학기_기말_고2_수학II/q14-solution.svg` (solutionImage 렌더 NOT_RUN).
- 점검 상태: SOURCE_READ_EVIDENCED / TEXT_ONLY / RELEASE_QA_NOT_RUN.

## Q15 — KEEP

- ordinal: 15; id: `15`; sourceQid: `15`; questionUid: `NOT_PRESENT`; source blob: `ca14c242aa86fc276bc5de80156a790dee186a54`.
- 과목·분류: `수학II` / `방정식과 부등식`.
- 원본 문제·보기 필드 직접 확인:

```text
15. 최고차항의 계수가 양수인 삼차함수 $f(x)$와 서로 다른 두 실수 $a, b$에 대하여 $f'(a)=f'(b)=0$이다. <보기>에서 옳은 것만을 있는 대로 고른 것은? [5.2점]

<보기>
ㄱ. 방정식 $f(x)-\frac{f(a)+f(b)}{2}=0$은 서로 다른 세 실근을 갖는다.
ㄴ. 방정식 $|f(x)-f(a)|-|f(a)-f(b)|=0$은 서로 다른 세 실근을 갖는다.
ㄷ. 함수 $f(|x|)$가 실수 전체의 집합에서 미분가능하면 방정식 $f(|x|)-\frac{f(a)+f(b)}{2}=0$은 서로 다른 네 실근을 갖는다.
원본 보기: ["① ㄱ","② ㄱ, ㄴ","③ ㄱ, ㄷ","④ ㄴ, ㄷ","⑤ ㄱ, ㄴ, ㄷ"]
```

- 원본 정답: `②`.
- **기존 solution 실제 원문 핵심 발췌:**
> [극대·극소 구조] 최고차항이 양수이고 서로 다른 두 극점이 있으므로 한 극댓값 $M$과 한 극솟값 $m$이 있으며 $M>m$이다.
> [보기 판단] ① ㄱ만은 ㄴ을 누락, ② ㄱ·ㄴ이 정확, ③ ㄱ·ㄷ과 ④ ㄴ·ㄷ과 ⑤ 전부는 거짓인 ㄷ을 포함한다. 정답 ②.
- **독립 검산 및 KEEP 판정:** ㄱ은 극값 사이 수평선의 3실근, ㄴ은 극점 높이에서 2근+범위 밖 높이 1근, ㄷ은 반례 f=x²(x+3)로 거짓; ㄱ·ㄴ만 참이다.
- 원본 그림: 원본 문제 이미지 별도 연결 없음. 해설 SVG: `assets/images/22_순천고_2학기_기말_고2_수학II/q15-solution.svg` (solutionImage 렌더 NOT_RUN).
- 점검 상태: SOURCE_READ_EVIDENCED / TEXT_ONLY / RELEASE_QA_NOT_RUN.

## Q16 — KEEP

- ordinal: 16; id: `16`; sourceQid: `16`; questionUid: `NOT_PRESENT`; source blob: `ca14c242aa86fc276bc5de80156a790dee186a54`.
- 과목·분류: `수학II` / `정적분의 뜻`.
- 원본 문제·보기 필드 직접 확인:

```text
16. 함수 $f(x)$가 $f(x)=\begin{cases} 3x(x-2) & (0 \le x < 2) \\ 3(x-2)(4-x) & (2 \le x < 4) \end{cases}$이고 모든 실수 $x$에 대하여 $f(x+4)=f(x)$를 만족시킨다. 함수 $f(x)$의 한 부정적분 $F(x)$가 실수 전체의 집합에서 연속이고, $F(3)=-2$일 때, 다음 <보기> 중 항상 옳은 것만을 있는 대로 고른 것은? [5.2점]

<보기>
ㄱ. 모든 실수 $x$에 대하여 $F(x+8)=F(x)$이다.
ㄴ. 구간 $(0, 14)$에서 함수 $F(x)$의 모든 극솟값의 합은 $-12$이다.
ㄷ. $0 < x < 20$에서 방정식 $F(x)=-2$의 모든 실근의 합은 100이다.
원본 보기: ["① ㄱ","② ㄷ","③ ㄱ, ㄷ","④ ㄴ, ㄷ","⑤ ㄱ, ㄴ, ㄷ"]
```

- 원본 정답: `⑤`.
- **기존 solution 실제 원문 핵심 발췌:**
> [한 주기 적분] $0\le x<2$에서 $f(x)=3x(x-2)$, $2\le x<4$에서 $f(x)=3(x-2)(4-x)$이다. 각각의 적분은 $\int_0^2f=-4$, $\int_2^4f=4$이므로 $\int_0^4f=0$이다.
> [보기 판단] ① ㄱ만은 ㄴ·ㄷ 누락, ② ㄷ만은 ㄱ·ㄴ 누락, ③ ㄱ·ㄷ은 ㄴ 누락, ④ ㄴ·ㄷ은 ㄱ 누락, ⑤ ㄱ·ㄴ·ㄷ이 정답.
- **독립 검산 및 KEEP 판정:** 한 주기 적분 -4+4=0으로 F의 주기는 4; 극소점 2,6,10의 값 -4 합 -12, F=-2의 해 1,3,...,19 합 100으로 ㄱ·ㄴ·ㄷ 모두 참이다.
- 원본 그림: 원본 문제 이미지 별도 연결 없음. 해설 SVG: `assets/images/22_순천고_2학기_기말_고2_수학II/q16-solution-v2.svg` (solutionImage 렌더 NOT_RUN).
- 점검 상태: SOURCE_READ_EVIDENCED / TEXT_ONLY / RELEASE_QA_NOT_RUN.

## Q17 — KEEP

- ordinal: 17; id: `17`; sourceQid: `17`; questionUid: `NOT_PRESENT`; source blob: `ca14c242aa86fc276bc5de80156a790dee186a54`.
- 과목·분류: `수학II` / `방정식과 부등식`.
- 원본 문제·보기 필드 직접 확인:

```text
17. 최고차항의 계수가 양수인 삼차함수 $f(x)$가 다음 조건을 만족시킨다.

방정식 $f(x)+xf'(x)=0$이 $\alpha < \beta < 0 < \gamma$인 세 실근 $\alpha, \beta, \gamma$를 갖고, $f(\alpha)f(\beta)f(\gamma)=0$이다.

옳은 것만을 <보기>에서 있는 대로 고른 것은? [5.2점]

<보기>
ㄱ. 함수 $f(x)$는 $x=\alpha$에서 극댓값을 갖는다.
ㄴ. $f(\beta)f(\gamma)>0$
ㄷ. 방정식 $f(x)=0$은 실수인 근은 두 개다.
원본 보기: ["① ㄱ","② ㄴ","③ ㄱ, ㄴ","④ ㄴ, ㄷ","⑤ ㄱ, ㄴ, ㄷ"]
```

- 원본 정답: `⑤`.
- **기존 solution 실제 원문 핵심 발췌:**
> [핵심 구조] $H(x)=f(x)+xf'(x)=(xf(x))'$라고 놓자. $H$의 세 근은 $\alpha<\beta<0<\gamma$이다. $f(\alpha)f(\beta)f(\gamma)=0$이므로 그중 어떤 $r\ne0$에서 $f(r)=0$. 동시에 $H(r)=0$이므로 $rf'(r)=0$, 따라서 $f'(r)=0$이다. 즉 $r$은 $f$의 중근.
> [보기 판단] ① ㄱ, ② ㄴ, ③ ㄱ·ㄴ, ④ ㄴ·ㄷ은 참인 진술을 빠뜨렸다. ⑤ ㄱ·ㄴ·ㄷ이 정답.
- **독립 검산 및 KEEP 판정:** $H=(xf)'$의 서로 다른 세 영점과 $f(\alpha)f(\beta)f(\gamma)=0$에서 비영점 중근 r=α<0과 다른 근 s>0을 도출; f(β),f(γ)<0, f의 서로 다른 실근은 α,s다.
- 원본 그림: 원본 문제 이미지 별도 연결 없음. 해설 SVG: `assets/images/22_순천고_2학기_기말_고2_수학II/q17-solution.svg` (solutionImage 렌더 NOT_RUN).
- 점검 상태: SOURCE_READ_EVIDENCED / TEXT_ONLY / RELEASE_QA_NOT_RUN.

## Q18 — KEEP

- ordinal: 18; id: `18`; sourceQid: `18`; questionUid: `NOT_PRESENT`; source blob: `ca14c242aa86fc276bc5de80156a790dee186a54`.
- 과목·분류: `수학II` / `정적분과 함수`.
- 원본 문제·보기 필드 직접 확인:

```text
18. 최고차항의 계수가 1인 삼차함수 $f(x)$와 실수 $t$에 대하여 $x$에 대한 방정식 $\int_{t}^{x} f(s)ds = 0$의 서로 다른 실근의 개수를 $g(t)$라 할 때, <보기>에서 옳은 것만을 있는 대로 고른 것은? [5.2점]

<보기>
ㄱ. $f(x)=x^2(x-2)$일 때, $g(1)=1$이다.
ㄴ. 방정식 $f(x)=0$의 서로 다른 실근의 개수가 3이면 $g(a)=3$인 실수 $a$가 존재한다.
ㄷ. $\lim_{t \to b} g(t) + g(b) = 6$을 만족시키는 실수 $b$의 값이 0과 1뿐이면 $f(2)=3$이다.
원본 보기: ["① ㄱ","② ㄱ, ㄴ","③ ㄱ, ㄷ","④ ㄴ, ㄷ","⑤ ㄱ, ㄴ, ㄷ"]
```

- 원본 정답: `④`.
- **기존 solution 실제 원문 핵심 발췌:**
> [정적분을 함수값 등식으로] $F'(x)=f(x)$인 사차함수 $F$를 두면 $\int_t^x f(s)ds=F(x)-F(t)$이다. 따라서 $g(t)$는 수평선 $y=F(t)$와 사차함수 그래프의 서로 다른 교점 개수이다.
> [보기 판단] ① ㄱ은 거짓, ② ㄱ·ㄴ과 ③ ㄱ·ㄷ은 거짓인 ㄱ 포함, ④ ㄴ·ㄷ만 정확, ⑤ 전체도 ㄱ을 포함해 오답. 정답 ④.
- **독립 검산 및 KEEP 판정:** 적분 원시함수 F의 수평선 교점 개수로 판단: ㄱ에서 F는 한 최소이므로 2교점, ㄴ은 세 극점의 높이 조정으로 3교점 존재, ㄷ은 0과 1의 대칭 극소를 갖는 사차식에서 f(2)=3다.
- 원본 그림: 원본 문제 이미지 별도 연결 없음. 해설 SVG: `assets/images/22_순천고_2학기_기말_고2_수학II/q18-solution.svg` (solutionImage 렌더 NOT_RUN).
- 점검 상태: SOURCE_READ_EVIDENCED / TEXT_ONLY / RELEASE_QA_NOT_RUN.

## Q19 — KEEP

- ordinal: 19; id: `19`; sourceQid: `19`; questionUid: `NOT_PRESENT`; source blob: `ca14c242aa86fc276bc5de80156a790dee186a54`.
- 과목·분류: `수학II` / `증가·감소와 극값`.
- 원본 문제·보기 필드 직접 확인:

```text
19. 삼차함수 $f(x)$가 모든 실수 $x$에 대하여 $f(x)=\frac{1}{3}x^3-ax^2+(a^2-b)x+\int_{-1}^{1} f(t)dt$를 만족시킨다. $x>1$에서 함수 $f(x)$가 극댓값을 갖도록 하는 7보다 작은 두 정수 $a, b$에 대하여 순서쌍 $(a, b)$의 개수는 $m$이고 $a=k$일 때, $f(0)$은 최소이다. $m+k$의 값은? (단, $k$는 상수이다.) [5.2점]
원본 보기: ["① 24","② 26","③ 28","④ 30","⑤ 32"]
```

- 원본 정답: `①`.
- **기존 solution 실제 원문 핵심 발췌:**
> [적분상수 먼저] $I=\int_{-1}^1f(t)dt$라 놓으면 $f(x)=\frac13x^3-ax^2+(a^2-b)x+I$. 양 끝이 대칭이므로 홀수차 항의 적분은 0이고 $I=-\frac{2a}{3}+2I$. 따라서 $I=\frac{2a}{3}$, 즉 $f(0)=\frac{2a}{3}$.
> [보기 판단] ① 24가 정확하다. ② 26, ③ 28, ④ 30, ⑤ 32는 $a>1+\sqrt b$의 엄격한 부등식이나 $b=4$의 경계 $a=3$ 제외를 놓치면 생기는 과다 계수다. 정답 ①.
- **독립 검산 및 KEEP 판정:** 자기적분상수 I=2a/3, 극대 위치 a-√b>1의 정수쌍은 21개이고 최소 a=3에서 k=3, 합 24다.
- 원본 그림: 원본 문제 이미지 별도 연결 없음. 해설 SVG: `assets/images/22_순천고_2학기_기말_고2_수학II/q19-solution.svg` (solutionImage 렌더 NOT_RUN).
- 점검 상태: SOURCE_READ_EVIDENCED / TEXT_ONLY / RELEASE_QA_NOT_RUN.

## Q20 — KEEP

- ordinal: 20; id: `20`; sourceQid: `20`; questionUid: `NOT_PRESENT`; source blob: `ca14c242aa86fc276bc5de80156a790dee186a54`.
- 과목·분류: `수학II` / `정적분과 함수`.
- 원본 문제·보기 필드 직접 확인:

```text
<서술형 1>
함수 $f(x)$가 다음을 만족시킬 때,
$$f(x)=8x-\int_{0}^{1} f(x)dx$$
$f(x)$를 구하는 풀이 과정과 답을 서술하시오. (부분점수 있음) [6.0점]
원본 보기: []
```

- 원본 정답: `8x-2`.
- **기존 solution 실제 원문 핵심 발췌:**
> [적분을 상수로 놓기] 정적분 $C=\int_0^1 f(t)dt$는 적분변수가 소거된 상수이다. 주어진 관계식은 $f(x)=8x-C$.
> [검산] $\int_0^1(8t-2)dt=4-2=2$이므로 오른쪽 $8x-2$와 일치한다. 적분 안의 $x$는 바깥의 자유변수 $x$가 아니라 묶인 적분변수임에 유의한다.
- **독립 검산 및 KEEP 판정:** $I=\int_0^1f$로 두면 I=4-I에서 I=2, 따라서 f(x)=8x-2; 다시 적분하면 2로 원식을 만족한다.
- 원본 그림: 원본 문제 이미지 별도 연결 없음. 해설 SVG: 없음.
- 점검 상태: SOURCE_READ_EVIDENCED / TEXT_ONLY / RELEASE_QA_NOT_RUN.

## Q21 — KEEP

- ordinal: 21; id: `21`; sourceQid: `21`; questionUid: `NOT_PRESENT`; source blob: `ca14c242aa86fc276bc5de80156a790dee186a54`.
- 과목·분류: `수학II` / `증가·감소와 극값`.
- 원본 문제·보기 필드 직접 확인:

```text
<서술형 2>
그림과 같이 일차함수 $y=f(x)$의 그래프와 최고차항의 계수가 1인 사차함수 $y=g(x)$의 그래프는 $x$좌표가 $-2, 1$인 두 점에서 접한다. $h(x)=g(x)-f(x)$라 할 때, $h(x)$의 극댓값을 구하는 풀이 과정과 답을 서술하시오. (부분점수 있음) [7.0점]
원본 보기: []
```

- 원본 정답: `81/16`.
- **기존 solution 실제 원문 핵심 발췌:**
> [그림에서 읽는 핵심] 직선 $f$와 최고차항 계수가 1인 사차함수 $g$가 $x=-2,1$에서 각각 접한다. 차이 $h(x)=g(x)-f(x)$는 최고차항 계수가 1인 사차다.
> 따라서 $\boxed{\frac{81}{16}}$. 원본 그림은 접하는 $x$좌표를 확인하는 증거이며 그림의 눈대중 높이를 정답에 사용하지 않는다.
- **독립 검산 및 KEEP 판정:** 원본 PNG에서 x=-2,1이 직선과 사차함수의 각 접점임을 확인; 최고차항 1인 차함수 h=(x+2)²(x-1)²의 사이 극댓값은 81/16이다.
- 원본 그림: `assets/images/22_순천고_2학기_기말_고2_수학II/q21.png` (blob `ac98cdc5465808ec67edaf3a59ff27c7e0d8a5e0`, 원본 PNG 직접 판독 PASS). 해설 SVG: `assets/images/22_순천고_2학기_기말_고2_수학II/q21-solution.svg` (solutionImage 렌더 NOT_RUN).
- 점검 상태: SOURCE_READ_EVIDENCED / SOURCE_FIGURE_EVIDENCED / RELEASE_QA_NOT_RUN.

## Q22 — KEEP

- ordinal: 22; id: `22`; sourceQid: `22`; questionUid: `NOT_PRESENT`; source blob: `ca14c242aa86fc276bc5de80156a790dee186a54`.
- 과목·분류: `수학II` / `넓이`.
- 원본 문제·보기 필드 직접 확인:

```text
<서술형 3>
함수 $f(x)=x^3-x+5$에 대하여 곡선 $y=f(x)$에 접하고 기울기가 2인 두 접선을 각각 $l_1, l_2$라 하자. 곡선 $y=f(x)$와 직선 $l_1$로 둘러싸인 도형의 넓이를 $A$, 곡선 $y=f(x)$와 직선 $l_2$로 둘러싸인 도형의 넓이를 $B$, 곡선 $y=f(x)$와 두 직선 $l_1, l_2$가 만나는 모든 점을 꼭짓점으로 하는 도형의 넓이를 $S$라 할 때, $2A+2B-S$의 값을 구하는 풀이 과정과 답을 서술하시오. (부분점수 있음) [7.0점]
원본 보기: []
```

- 원본 정답: `15`.
- **기존 solution 실제 원문 핵심 발췌:**
> [접선 두 개] $f(x)=x^3-x+5$이므로 $f'(x)=3x^2-1$. 기울기가 2이면 $3x^2-1=2$, $x=\pm1$. $f(1)=f(-1)=5$이다.
> [검산] $A,B$는 절댓값 넓이이고 $S$는 네 점을 꼭짓점으로 하는 사각형의 넓이로, 중복된 접점은 별도 꼭짓점으로 세지 않는다.
- **독립 검산 및 KEEP 판정:** 두 접선 기울기 2의 접점 ±1에서 직선 $2x+3$, $2x+7$을 얻고 둘러싸인 넓이는 각 27/4. 교점 사각형 넓이 12를 빼면 15다.
- 원본 그림: 원본 문제 이미지 별도 연결 없음. 해설 SVG: `assets/images/22_순천고_2학기_기말_고2_수학II/q22-solution-v2.svg` (solutionImage 렌더 NOT_RUN).
- 점검 상태: SOURCE_READ_EVIDENCED / TEXT_ONLY / RELEASE_QA_NOT_RUN.

## 종료 검증 및 후속 인계

- 전체 source 문제·기존 solution 판독: **22/22**. KEEP 22, UPGRADE 0, HOLD 0, UNREAD 0; 개선 해설 작성 대상 없음(원문 계산/정답 충돌 발견 없음).
- 실물 문제 PNG 판독: **2**개. SVG 도형 파라미터 검사: **0**개, 별도 raster/학생 렌더 NOT_RUN.
- 다음 단계: Golden/Negative, preflight 영수증·학생 화면 확인·출고 QA. 완료 전 운영 JS·main 병합 PASS로 표기하지 않는다.
