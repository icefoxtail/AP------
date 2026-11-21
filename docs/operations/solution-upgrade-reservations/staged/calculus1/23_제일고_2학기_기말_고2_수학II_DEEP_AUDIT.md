# 미적분Ⅰ(구 수학Ⅱ) 심층 감사 — 23_제일고_2학기_기말_고2_수학II

- 원본 범위: 2023년 고2 2학기 기말, `standardCourse: 수학II` (현행 작업 라인 명칭: 미적분Ⅰ).
- 원본 JS: `archive/exams/original/high/h2/2final/23_제일고_2학기_기말_고2_수학II.js`; ref `main`, GitHub blob `924cd199e845af7c08ad5c92f523ebda0e5a15d5`.
- 문항 분모: **23**; 판정 **KEEP 23 / UPGRADE 0 / HOLD 0 / UNREAD 0**.
- 작업 브랜치: `work/solution-upgrade-lane-10-20261121`, 감사 문서: `docs/operations/solution-upgrade-reservations/staged/calculus1/23_제일고_2학기_기말_고2_수학II_DEEP_AUDIT.md`.
- 원본 문제 PNG: 해당 시험지의 파일 1개를 GitHub 바이너리에서 직접 열어 판독함. 원본 JS에 없는 별도 그림은 임의로 만들지 않음. SVG solutionImage 렌더·학생 화면 독립 검수는 **NOT_RUN**.
- 범위·절차: 모든 23문항의 원본 발문·보기·정답·기존 solution을 읽고, 계산 근거를 문항별로 작성. 공유 점유 조회/claim은 사용자 지시로 생략. 자동 preflight receipt, Golden/Negative, 최종 출고 QA는 **NOT_RUN**.
- 현재 단계: **EXAM_AUDIT_COMPLETE / EXAM_DRAFT_COMPLETE / RELEASE_QA_NOT_RUN**. 수학적 반례·정답 불일치는 발견되지 않아 현재 문서상 KEEP만 분류함. 운영 JS·정답·보기·SVG·main은 수정하지 않음.

## Q01 — KEEP

- source ordinal: 1; id: `1`; sourceQid: `NOT_PRESENT`; source blob: `924cd199e845af7c08ad5c92f523ebda0e5a15d5`.
- 과정 표기: `수학II`; 문항 분류: `부정적분과 도함수`.
- 원본 문제 조건·보기 (출처 JS 필드 보존):

```text
함수 $F(x)=x^2-x+1$이 $f(x)$의 한 부정적분일 때, $f(3)$의 값은? [3.5점]
원본 보기: ["$3$","$4$","$5$","$6$","$7$"]
```

- 원본 정답: `③`.
- 기존 solution 실제 발췌 (원문에서 추출, 자의적 변형 없음):
> [키포인트] 한 부정적분을 미분하면 원래 함수가 된다.
> 정석 풀이: $f(x)=F'(x)=2x-1$이므로 $f(3)=6-1=5$이다.
- **해설 경로·판정 이유·계산 검산:** 한 부정적분 $F=x^2-x+1$을 미분하면 $f=2x-1$이고 $f(3)=5$다.
- 그림 증거: 원본 문제 PNG 별도 연결 없음. `assets/images/23_제일고_2학기_기말_고2_수학II/q1-solution-v2.svg` (solutionImage SVG/학생 화면 렌더 NOT_RUN).
- 판정: **KEEP** / SOURCE_READ_EVIDENCED / SOURCE_PNG_NOT_APPLICABLE / RELEASE_QA_NOT_RUN.


## Q02 — KEEP

- source ordinal: 2; id: `2`; sourceQid: `NOT_PRESENT`; source blob: `924cd199e845af7c08ad5c92f523ebda0e5a15d5`.
- 과정 표기: `수학II`; 문항 분류: `극댓값과 극솟값`.
- 원본 문제 조건·보기 (출처 JS 필드 보존):

```text
함수 $f(x)=x^3-3x^2-9x+k$의 극솟값이 $-6$일 때, 함수 $f(x)$의 극댓값은? [3.6점]
원본 보기: ["$18$","$20$","$22$","$24$","$26$"]
```

- 원본 정답: `⑤`.
- 기존 solution 실제 발췌 (원문에서 추출, 자의적 변형 없음):
> [키포인트] 도함수의 두 영점에서 극댓값과 극솟값을 구한 뒤, 주어진 극솟값으로 $k$를 결정한다.
> 정석 풀이: $f(3)=27-27-27+k=k-27=-6$이므로 $k=21$이다. 따라서 극댓값은 $f(-1)=-1-3+9+21=26$이다.
- **해설 경로·판정 이유·계산 검산:** $f'=3(x+1)(x-3)$의 극소점 3에서 $k-27=-6$이므로 $k=21$; 극대점 -1의 함수값은 26이다.
- 그림 증거: 원본 문제 PNG 별도 연결 없음. `assets/images/23_제일고_2학기_기말_고2_수학II/q2-solution.svg` (solutionImage SVG/학생 화면 렌더 NOT_RUN).
- 판정: **KEEP** / SOURCE_READ_EVIDENCED / SOURCE_PNG_NOT_APPLICABLE / RELEASE_QA_NOT_RUN.


## Q03 — KEEP

- source ordinal: 3; id: `3`; sourceQid: `NOT_PRESENT`; source blob: `924cd199e845af7c08ad5c92f523ebda0e5a15d5`.
- 과정 표기: `수학II`; 문항 분류: `함수의 최댓값과 최솟값`.
- 원본 문제 조건·보기 (출처 JS 필드 보존):

```text
구간 $[-1,2]$에서 함수 $f(x)=x^4-4x^2+3$의 최댓값을 $M$, 최솟값을 $m$이라 할 때, $M-m$의 값은? [3.7점]
원본 보기: ["$1$","$2$","$3$","$4$","$5$"]
```

- 원본 정답: `④`.
- 기존 solution 실제 발췌 (원문에서 추출, 자의적 변형 없음):
> [키포인트] 닫힌구간의 최댓값과 최솟값은 양 끝점과 구간 안의 임계점에서 함수값을 모두 비교한다.
> 정석 풀이: $f(-1)=0$, $f(0)=3$, $f(\sqrt2)=4-8+3=-1$, $f(2)=16-16+3=3$이다. 따라서 $M=3$, $m=-1$이다.
- **해설 경로·판정 이유·계산 검산:** 구간 끝과 임계점 $-1,0,\sqrt2,2$의 함수값은 $0,3,-1,3$이므로 최대-최소는 4다.
- 그림 증거: 원본 문제 PNG 별도 연결 없음. `assets/images/23_제일고_2학기_기말_고2_수학II/q3-solution.svg` (solutionImage SVG/학생 화면 렌더 NOT_RUN).
- 판정: **KEEP** / SOURCE_READ_EVIDENCED / SOURCE_PNG_NOT_APPLICABLE / RELEASE_QA_NOT_RUN.


## Q04 — KEEP

- source ordinal: 4; id: `4`; sourceQid: `NOT_PRESENT`; source blob: `924cd199e845af7c08ad5c92f523ebda0e5a15d5`.
- 과정 표기: `수학II`; 문항 분류: `함수의 최솟값과 부등식`.
- 원본 문제 조건·보기 (출처 JS 필드 보존):

```text
$x\ge0$인 모든 실수 $x$에 대하여 부등식 $x^3+3x^2-9x+a>0$이 성립할 때, 정수 $a$의 최솟값은? [3.8점]
원본 보기: ["$3$","$4$","$5$","$6$","$7$"]
```

- 원본 정답: `④`.
- 기존 solution 실제 발췌 (원문에서 추출, 자의적 변형 없음):
> [키포인트] 모든 $x\ge0$에서 양수가 되려면 $x^3+3x^2-9x$의 최솟값을 상수 $a$가 넘어야 한다.
> 정석 풀이: $h(1)=1+3-9=-5$이므로 $h(x)+a>0$이 모든 $x\ge0$에서 성립하려면 $-5+a>0$, 즉 $a>5$이다. 정수 $a$의 최솟값은 $6$이다.
- **해설 경로·판정 이유·계산 검산:** $h'=3(x+3)(x-1)$이 $x=1$에서 최솟값 -5를 만들므로 엄격한 양수 조건은 정수 $a\ge6$이다.
- 그림 증거: 원본 문제 PNG 별도 연결 없음. `assets/images/23_제일고_2학기_기말_고2_수학II/q4-solution.svg` (solutionImage SVG/학생 화면 렌더 NOT_RUN).
- 판정: **KEEP** / SOURCE_READ_EVIDENCED / SOURCE_PNG_NOT_APPLICABLE / RELEASE_QA_NOT_RUN.


## Q05 — KEEP

- source ordinal: 5; id: `5`; sourceQid: `NOT_PRESENT`; source blob: `924cd199e845af7c08ad5c92f523ebda0e5a15d5`.
- 과정 표기: `수학II`; 문항 분류: `속도와 가속도`.
- 원본 문제 조건·보기 (출처 JS 필드 보존):

```text
수직선 위를 움직이는 점 $P$의 시각 $t$에서의 위치 $x$가 $x=2t^3-5t^2$일 때, 점 $P$가 운동 방향을 바꾸는 시각에서 가속도는? [3.9점]
원본 보기: ["$8$","$9$","$10$","$11$","$12$"]
```

- 원본 정답: `③`.
- 기존 solution 실제 발췌 (원문에서 추출, 자의적 변형 없음):
> [키포인트] 운동 방향은 속도의 부호가 바뀔 때 바뀌며, 가속도는 속도를 한 번 더 미분하여 구한다.
> 정석 풀이: $v(t)=0$에서 $t=0,\dfrac53$이고, 실제 운동 중 방향이 바뀌는 시각은 $t=\dfrac53$이다. 가속도는 $a(t)=v'(t)=12t-10$이므로 $a\left(\dfrac53\right)=20-10=10$이다.
- **해설 경로·판정 이유·계산 검산:** 속도 $2t(3t-5)$가 출발 후 $t=5/3$에 부호 바뀜; 가속도 $12t-10$의 해당 값은 10이다.
- 그림 증거: 원본 문제 PNG 별도 연결 없음. `assets/images/23_제일고_2학기_기말_고2_수학II/q5-solution.svg` (solutionImage SVG/학생 화면 렌더 NOT_RUN).
- 판정: **KEEP** / SOURCE_READ_EVIDENCED / SOURCE_PNG_NOT_APPLICABLE / RELEASE_QA_NOT_RUN.


## Q06 — KEEP

- source ordinal: 6; id: `6`; sourceQid: `NOT_PRESENT`; source blob: `924cd199e845af7c08ad5c92f523ebda0e5a15d5`.
- 과정 표기: `수학II`; 문항 분류: `삼차방정식의 실근과 극값`.
- 원본 문제 조건·보기 (출처 JS 필드 보존):

```text
$x$에 대한 삼차방정식 $x^3-3x^2-3x+5=6x+k$가 서로 다른 두 개의 양의 실근과 한 개의 음의 실근을 갖도록 하는 정수 $k$의 개수는? [4점]
원본 보기: ["$25$","$26$","$27$","$28$","$29$"]
```

- 원본 정답: `②`.
- 기존 solution 실제 발췌 (원문에서 추출, 자의적 변형 없음):
> [키포인트] 먼저 삼차함수가 서로 다른 세 실근을 갖는 $k$의 범위를 극댓값·극솟값으로 구하고, 근의 부호는 근과 계수의 관계로 좁힌다.
> 정석 풀이: $P(-1)=10-k>0$에서 $k<10$, $P(3)=-22-k<0$에서 $k>-22$이므로 $-22<k<10$이다. 세 근의 곱은 $k-5$이므로 두 양의 근과 한 음의 근을 가지려면 $k-5<0$, 즉 $k<5$여야 한다. 이때 세 근의 합이 $3>0$이므로 세 근이 모두 음수인 경우도 배제된다. 따라서 $-22<k<5$이고 정수 $k$는 $-21,-20,\ldots,4$의 $26$개이다.
- **해설 경로·판정 이유·계산 검산:** 삼차식 $x^3-3x^2-9x+5-k$의 세 실근 범위 $-22<k<10$과 두 양근의 곱 부호 조건 $k<5$를 합치면 정수 26개다.
- 그림 증거: 원본 문제 PNG 별도 연결 없음. `assets/images/23_제일고_2학기_기말_고2_수학II/q6-solution.svg` (solutionImage SVG/학생 화면 렌더 NOT_RUN).
- 판정: **KEEP** / SOURCE_READ_EVIDENCED / SOURCE_PNG_NOT_APPLICABLE / RELEASE_QA_NOT_RUN.


## Q07 — KEEP

- source ordinal: 7; id: `7`; sourceQid: `NOT_PRESENT`; source blob: `924cd199e845af7c08ad5c92f523ebda0e5a15d5`.
- 과정 표기: `수학II`; 문항 분류: `곡선과 직선 사이의 넓이`.
- 원본 문제 조건·보기 (출처 JS 필드 보존):

```text
곡선 $y=2x^2-3x$와 직선 $y=ax$로 둘러싸인 도형의 넓이가 $9$일 때, 양수 $a$의 값은? [4점]
원본 보기: ["$3$","$4$","$5$","$6$","$7$"]
```

- 원본 정답: `①`.
- 기존 solution 실제 발췌 (원문에서 추출, 자의적 변형 없음):
> [키포인트] 두 그래프의 교점을 구한 뒤 위의 함수에서 아래의 함수를 빼서 넓이를 적분한다.
> 정석 풀이: $r=\dfrac{a+3}{2}$라 하면 넓이는 $\displaystyle\int_0^r\{(a+3)x-2x^2\}dx=\dfrac{r^3}{3}=\dfrac{(a+3)^3}{24}$이다. 이것이 $9$이므로 $(a+3)^3=216=6^3$이고 $a=3$이다.
- **해설 경로·판정 이유·계산 검산:** 두 교점 0, $(a+3)/2$ 사이 넓이는 $(a+3)^3/24$; 9와 같게 놓아 $a=3$이다.
- 그림 증거: 원본 문제 PNG 별도 연결 없음. `assets/images/23_제일고_2학기_기말_고2_수학II/q7-solution.svg` (solutionImage SVG/학생 화면 렌더 NOT_RUN).
- 판정: **KEEP** / SOURCE_READ_EVIDENCED / SOURCE_PNG_NOT_APPLICABLE / RELEASE_QA_NOT_RUN.


## Q08 — KEEP

- source ordinal: 8; id: `8`; sourceQid: `NOT_PRESENT`; source blob: `924cd199e845af7c08ad5c92f523ebda0e5a15d5`.
- 과정 표기: `수학II`; 문항 분류: `정적분의 성질`.
- 원본 문제 조건·보기 (출처 JS 필드 보존):

```text
모든 실수 $x$에서 연속인 함수 $f(x)$에 대하여 보기에서 항상 옳은 것의 개수는? [4.1점]<br><div class="question-note-box">&lt;보기&gt;<br>ㄱ. $\displaystyle\int_0^1f(x)dx+\int_1^0f(x)dx=0$<br>ㄴ. $\displaystyle\int_{-3}^2f(x)dx=\int_0^{-3}-f(x)dx+\int_0^2f(x)dx$<br>ㄷ. $f(x)=f(-x)$이며 $\displaystyle\int_{-1}^1f(x)dx=0$이다.<br>ㄹ. $y=x(x-4)(x-a)$와 $x$축으로 둘러싸인 두 도형의 넓이가 서로 같을 때, 모든 $a$ 값의 합은 $6$이다.</div>
원본 보기: ["$0$개","$1$개","$2$개","$3$개","$4$개"]
```

- 원본 정답: `④`.
- 기존 solution 실제 발췌 (원문에서 추출, 자의적 변형 없음):
> [키포인트] 정적분의 방향 전환 성질과 함수의 대칭성, 넓이 조건을 각각 독립적으로 판정한다.
> 정석 풀이: ㄱ은 $\int_1^0f(x)dx=-\int_0^1f(x)dx$이므로 참이다. ㄴ에서 $\int_0^{-3}-f(x)dx=\int_{-3}^0f(x)dx$이므로 우변은 $\int_{-3}^2f(x)dx$가 되어 참이다. ㄷ은 짝함수이면 $\int_{-1}^1f(x)dx=2\int_0^1f(x)dx$이므로 항상 $0$인 것은 아니어서 거짓이다.
- **해설 경로·판정 이유·계산 검산:** ㄱ·ㄴ은 구간 반전/분할로 참, ㄷ은 짝함수의 적분이 항상 0은 아니므로 거짓; ㄹ의 등면적 배치 $a=-4,2,8$ 합은 6으로 참, 총 3개다.
- 그림 증거: 원본 문제 PNG 별도 연결 없음. `assets/images/23_제일고_2학기_기말_고2_수학II/q8-solution.svg` (solutionImage SVG/학생 화면 렌더 NOT_RUN).
- 판정: **KEEP** / SOURCE_READ_EVIDENCED / SOURCE_PNG_NOT_APPLICABLE / RELEASE_QA_NOT_RUN.


## Q09 — KEEP

- source ordinal: 9; id: `9`; sourceQid: `NOT_PRESENT`; source blob: `924cd199e845af7c08ad5c92f523ebda0e5a15d5`.
- 과정 표기: `수학II`; 문항 분류: `두 곡선 사이의 넓이`.
- 원본 문제 조건·보기 (출처 JS 필드 보존):

```text
두 곡선 $y=x^3-x^2+3$, $y=2x^2+x$로 둘러싸인 도형의 넓이는? [4.1점]
원본 보기: ["$5$","$8$","$10$","$11$","$12$"]
```

- 원본 정답: `②`.
- 기존 solution 실제 발췌 (원문에서 추출, 자의적 변형 없음):
> [키포인트] 두 함수의 차를 인수분해하여 교점을 찾고, 구간마다 위아래가 바뀌는 점을 반영해 넓이를 더한다.
> 정석 풀이: $\displaystyle\int_{-1}^{1}(x^3-3x^2-x+3)dx=4$이고, $\displaystyle\int_{1}^{3}(x^3-3x^2-x+3)dx=-4$이다. 따라서 전체 넓이는 $4+|-4|=8$이다.
- **해설 경로·판정 이유·계산 검산:** 곡선 차 $(x+1)(x-1)(x-3)$의 교점 -1,1,3 사이 적분은 +4와 -4여서 총넓이 8이다.
- 그림 증거: 원본 문제 PNG 별도 연결 없음. `assets/images/23_제일고_2학기_기말_고2_수학II/q9-solution.svg` (solutionImage SVG/학생 화면 렌더 NOT_RUN).
- 판정: **KEEP** / SOURCE_READ_EVIDENCED / SOURCE_PNG_NOT_APPLICABLE / RELEASE_QA_NOT_RUN.


## Q10 — KEEP

- source ordinal: 10; id: `10`; sourceQid: `NOT_PRESENT`; source blob: `924cd199e845af7c08ad5c92f523ebda0e5a15d5`.
- 과정 표기: `수학II`; 문항 분류: `함수의 최댓값과 최솟값`.
- 원본 문제 조건·보기 (출처 JS 필드 보존):

```text
두 함수 $f(x)=-2x^2+12x-k$, $g(x)=x^4+2x^2$가 임의의 두 실수 $x_1$, $x_2$에 대하여 $f(x_1)\le g(x_2)$를 만족시키는 실수 $k$의 최솟값은? [4.2점]
원본 보기: ["$18$","$19$","$20$","$21$","$22$"]
```

- 원본 정답: `①`.
- 기존 solution 실제 발췌 (원문에서 추출, 자의적 변형 없음):
> [키포인트] 임의의 $x_1,x_2$에 대해 항상 성립하려면 $f$의 최댓값이 $g$의 최솟값보다 크지 않아야 한다.
> 정석 풀이: $18-k\le0$이므로 $k\ge18$이다. 따라서 실수 $k$의 최솟값은 $18$이다.
- **해설 경로·판정 이유·계산 검산:** $f=-2(x-3)^2+18-k$의 최대가 $18-k$, $g=x^4+2x^2$의 최소가 0이므로 $k_{\min}=18$이다.
- 그림 증거: 원본 문제 PNG 별도 연결 없음. `assets/images/23_제일고_2학기_기말_고2_수학II/q10-solution.svg` (solutionImage SVG/학생 화면 렌더 NOT_RUN).
- 판정: **KEEP** / SOURCE_READ_EVIDENCED / SOURCE_PNG_NOT_APPLICABLE / RELEASE_QA_NOT_RUN.


## Q11 — KEEP

- source ordinal: 11; id: `11`; sourceQid: `NOT_PRESENT`; source blob: `924cd199e845af7c08ad5c92f523ebda0e5a15d5`.
- 과정 표기: `수학II`; 문항 분류: `함수의 감소`.
- 원본 문제 조건·보기 (출처 JS 필드 보존):

```text
함수 $f(x)=-\dfrac13x^3+kx^2+(4-k^2)x$가 $0<x_1<x_2$인 임의의 두 실수 $x_1$, $x_2$에 대하여 $f(x_1)>f(x_2)$를 만족시키도록 하는 실수 $k$의 최댓값은? [4.2점]
원본 보기: ["$-2$","$-\\dfrac32$","$-1$","$-\\dfrac12$","$\\dfrac12$"]
```

- 원본 정답: `①`.
- 기존 solution 실제 발췌 (원문에서 추출, 자의적 변형 없음):
> [키포인트] 모든 양의 구간에서 함수가 감소하려면 $x>0$에서 도함수가 양수가 되지 않아야 한다.
> 풀이 방향: $k>0$이면 $x=k>0$에서 $f'(k)=4>0$이므로 불가능하다. 따라서 $k\le0$인 경우만 본다.
- **해설 경로·판정 이유·계산 검산:** $f'=4-(x-k)^2$가 모든 양수 $x$에서 비양수여야 엄격히 감소한다. $k\le0$인 가운데 최대 경계 $k=-2$는 내부에서 음수다.
- 그림 증거: 원본 문제 PNG 별도 연결 없음. `assets/images/23_제일고_2학기_기말_고2_수학II/q11-solution.svg` (solutionImage SVG/학생 화면 렌더 NOT_RUN).
- 판정: **KEEP** / SOURCE_READ_EVIDENCED / SOURCE_PNG_NOT_APPLICABLE / RELEASE_QA_NOT_RUN.


## Q12 — KEEP

- source ordinal: 12; id: `12`; sourceQid: `NOT_PRESENT`; source blob: `924cd199e845af7c08ad5c92f523ebda0e5a15d5`.
- 과정 표기: `수학II`; 문항 분류: `정적분과 도함수`.
- 원본 문제 조건·보기 (출처 JS 필드 보존):

```text
실수 전체의 집합에서 미분가능한 함수 $f(x)$에 대하여 $f'(x)=|x|+|x-2|$일 때, $f(3)-f(-1)$의 값은? [4.3점]
원본 보기: ["$5$","$7$","$8$","$10$","$12$"]
```

- 원본 정답: `④`.
- 기존 solution 실제 발췌 (원문에서 추출, 자의적 변형 없음):
> [키포인트] 함수값의 차는 도함수의 정적분으로 구하고, 절댓값의 경계인 $0,2$에서 구간을 나눈다.
> 정석 풀이: $x<0$에서는 $f'(x)=-2x+2$, $0\le x<2$에서는 $f'(x)=2$, $x\ge2$에서는 $f'(x)=2x-2$이다. 따라서 $\int_{-1}^0(-2x+2)dx=3$, $\int_0^2 2dx=4$, $\int_2^3(2x-2)dx=3$이다. 합은 $10$이다.
- **해설 경로·판정 이유·계산 검산:** 절댓값 경계 0과 2로 나눈 도함수 적분은 $3+4+3=10$이다.
- 그림 증거: 원본 문제 PNG 별도 연결 없음. `assets/images/23_제일고_2학기_기말_고2_수학II/q12-solution.svg` (solutionImage SVG/학생 화면 렌더 NOT_RUN).
- 판정: **KEEP** / SOURCE_READ_EVIDENCED / SOURCE_PNG_NOT_APPLICABLE / RELEASE_QA_NOT_RUN.


## Q13 — KEEP

- source ordinal: 13; id: `13`; sourceQid: `NOT_PRESENT`; source blob: `924cd199e845af7c08ad5c92f523ebda0e5a15d5`.
- 과정 표기: `수학II`; 문항 분류: `정적분으로 정의된 도함수`.
- 원본 문제 조건·보기 (출처 JS 필드 보존):

```text
다항함수 $f(x)$가 다음 조건을 만족시킨다.<br><div class="question-note-box">(가) 모든 실수 $x$에 대하여 $\displaystyle\int_1^x\left(\dfrac{d}{dt}f(t)\right)dt=x^3+ax^2+bx+1$<br>(나) 함수 $f(x)$는 $x=3$에서 극값을 갖는다.</div>$\displaystyle\lim_{x\to0}\dfrac1x\int_{4-x}^{4+x}f'(t)dt$의 값은? [4.5점]
원본 보기: ["$18$","$19$","$20$","$21$","$22$"]
```

- 원본 정답: `⑤`.
- 기존 solution 실제 발췌 (원문에서 추출, 자의적 변형 없음):
> [키포인트] 먼저 주어진 적분식에서 계수 $a,b$를 결정하고, 마지막 극한은 중심 $4$의 짧은 대칭구간 적분으로 해석한다.
> 정석 풀이: 미분하면 $f'(x)=3x^2+2ax+b$이다. $f'(3)=27+6a+b=0$과 $a+b=-2$를 연립하면 $a=-5$, $b=3$이다. 따라서 $f'(x)=3x^2-10x+3$이고 $f'(4)=11$이다.
- **해설 경로·판정 이유·계산 검산:** $x=1$에서 $a+b=-2$, 극값 조건 $f'(3)=27+6a+b=0$으로 $(a,b)=(-5,3)$; 중심 4의 극한은 $2f'(4)=22$다.
- 그림 증거: 원본 문제 PNG 별도 연결 없음. `assets/images/23_제일고_2학기_기말_고2_수학II/q13-solution.svg` (solutionImage SVG/학생 화면 렌더 NOT_RUN).
- 판정: **KEEP** / SOURCE_READ_EVIDENCED / SOURCE_PNG_NOT_APPLICABLE / RELEASE_QA_NOT_RUN.


## Q14 — KEEP

- source ordinal: 14; id: `14`; sourceQid: `NOT_PRESENT`; source blob: `924cd199e845af7c08ad5c92f523ebda0e5a15d5`.
- 과정 표기: `수학II`; 문항 분류: `속도와 거리`.
- 원본 문제 조건·보기 (출처 JS 필드 보존):

```text
수직선 위를 움직이는 점 $P$의 시각 $t$ $(t\ge0)$에서의 속도 $v(t)$가 $v(t)=\begin{cases}-3t^2&(0\le t<1)\\t^2-4&(t\ge1)\end{cases}$이다. 점 $P$가 시각 $t=0$일 때부터 움직이는 방향이 바뀔 때의 점 $P$의 위치를 $a$, 시각 $t=0$에서 시각 $t=3$까지 움직인 거리를 $b$라고 할 때, $3a+b$의 값은? (단, 시각 $t=0$에서의 점 $P$의 위치는 $0$이다.) [4.5점]
원본 보기: ["$-5$","$-3$","$5$","$8$","$13$"]
```

- 원본 정답: `②`.
- 기존 solution 실제 발췌 (원문에서 추출, 자의적 변형 없음):
> [키포인트] 방향이 바뀌는 시각은 속도의 부호가 바뀌는 시각이고, 위치는 속도의 부호 있는 적분, 거리는 속도의 절댓값 적분이다.
> 정석 풀이: $\int_0^1(-3t^2)dt=-1$, $\int_1^2(t^2-4)dt=-\dfrac53$이므로 $a=-\dfrac83$이다. 거리는 $1+\dfrac53+\int_2^3(t^2-4)dt$이고 마지막 적분은 $\dfrac73$이므로 $b=5$이다. 따라서 $3a+b=-8+5=-3$이다.
- **해설 경로·판정 이유·계산 검산:** 속도는 $0<t<2$에서 음, 이후 양; 방향 전환 때 위치 $a=-8/3$, 총거리 $b=5$로 $3a+b=-3$이다.
- 그림 증거: 원본 문제 PNG 별도 연결 없음. `assets/images/23_제일고_2학기_기말_고2_수학II/q14-solution.svg` (solutionImage SVG/학생 화면 렌더 NOT_RUN).
- 판정: **KEEP** / SOURCE_READ_EVIDENCED / SOURCE_PNG_NOT_APPLICABLE / RELEASE_QA_NOT_RUN.


## Q15 — KEEP

- source ordinal: 15; id: `15`; sourceQid: `NOT_PRESENT`; source blob: `924cd199e845af7c08ad5c92f523ebda0e5a15d5`.
- 과정 표기: `수학II`; 문항 분류: `속도와 거리`.
- 원본 문제 조건·보기 (출처 JS 필드 보존):

```text
직선 도로를 달리는 어떤 자동차의 운전자가 정지 신호를 발견하고 브레이크를 밟은 후 $t$초 동안 달린 거리를 $x$m라 하면 $x=-2.5t^2+20t$이라고 한다. 이때 정지선을 넘지 않고 멈추기 위해 정지선으로부터 전방 $a$m의 지점에서 브레이크를 밟아야 한다고 할 때, $a$의 최솟값은? [4.5점]
원본 보기: ["$30$","$35$","$40$","$45$","$50$"]
```

- 원본 정답: `③`.
- 기존 solution 실제 발췌 (원문에서 추출, 자의적 변형 없음):
> [키포인트] 자동차가 멈출 때까지의 최대 이동거리가 정지선까지 필요한 최소 거리이다.
> 정석 풀이: $-5t+20=0$에서 $t=4$초에 멈춘다. 이때 이동거리는 $x(4)=-2.5\times16+20\times4=-40+80=40$m이다. 따라서 정지선을 넘지 않기 위한 $a$의 최솟값은 $40$이다.
- **해설 경로·판정 이유·계산 검산:** 자동차 속도 $20-5t$가 4초에 0이 되고 정지까지 이동거리 $x(4)=40$m다.
- 그림 증거: 원본 문제 PNG 별도 연결 없음. `assets/images/23_제일고_2학기_기말_고2_수학II/q15-solution.svg` (solutionImage SVG/학생 화면 렌더 NOT_RUN).
- 판정: **KEEP** / SOURCE_READ_EVIDENCED / SOURCE_PNG_NOT_APPLICABLE / RELEASE_QA_NOT_RUN.


## Q16 — KEEP

- source ordinal: 16; id: `16`; sourceQid: `NOT_PRESENT`; source blob: `924cd199e845af7c08ad5c92f523ebda0e5a15d5`.
- 과정 표기: `수학II`; 문항 분류: `적분방정식과 도함수`.
- 원본 문제 조건·보기 (출처 JS 필드 보존):

```text
함수 $f(x)$가 모든 실수 $x$에 대하여 $\displaystyle\int_1^x(x-t)f(t)dt=\int_0^x(t^3+at^2+bt)dt$를 만족시킬 때, $20f(a+b)$의 값은? (단, $a,b$는 상수이다.) [4.6점]
원본 보기: ["$90$","$100$","$110$","$120$","$130$"]
```

- 원본 정답: `⑤`.
- 기존 solution 실제 발췌 (원문에서 추출, 자의적 변형 없음):
> [키포인트] 양변을 두 번 미분하면 $f(x)$를 바로 얻을 수 있고, $x=1$에서 원래 식과 한 번 미분한 식을 이용해 $a,b$를 결정한다.
> 정석 풀이: 우변을 두 번 미분하면 $f(x)=3x^2+2ax+b$이다. 원래 식에 $x=1$을 대입하면 $\dfrac14+\dfrac a3+\dfrac b2=0$, 한 번 미분한 식에 $x=1$을 대입하면 $1+a+b=0$이다. 연립하면 $a=-\dfrac32$, $b=\dfrac12$이므로 $a+b=-1$이다. 따라서 $f(-1)=3+3+\dfrac12=\dfrac{13}{2}$이고 $20f(a+b)=20\cdot\dfrac{13}{2}=130$이다.
- **해설 경로·판정 이유·계산 검산:** 적분식 두 번 미분 시 $f=3x^2+2ax+b$이고 $x=1$에서 값과 도함수 조건으로 $a=-3/2,b=1/2$; $20f(-1)=130$이다.
- 그림 증거: 원본 문제 PNG 별도 연결 없음. `assets/images/23_제일고_2학기_기말_고2_수학II/q16-solution.svg` (solutionImage SVG/학생 화면 렌더 NOT_RUN).
- 판정: **KEEP** / SOURCE_READ_EVIDENCED / SOURCE_PNG_NOT_APPLICABLE / RELEASE_QA_NOT_RUN.


## Q17 — KEEP

- source ordinal: 17; id: `17`; sourceQid: `NOT_PRESENT`; source blob: `924cd199e845af7c08ad5c92f523ebda0e5a15d5`.
- 과정 표기: `수학II`; 문항 분류: `도함수와 부피의 최댓값`.
- 원본 문제 조건·보기 (출처 JS 필드 보존):

```text
다음 그림과 같이 모든 모서리의 길이가 $3$인 정사각뿔에 내접하는 직육면체의 부피의 최댓값은? [4.7점]
원본 보기: ["$\\sqrt2$","$\\sqrt3$","$2$","$2\\sqrt2$","$3$"]
```

- 원본 정답: `④`.
- 기존 solution 실제 발췌 (원문에서 추출, 자의적 변형 없음):
> [키포인트] 정사각뿔의 높이와 평행단면의 닮음을 이용해 부피를 한 변수식으로 만든다.
> 풀이 방향: 그림처럼 직육면체의 윗면과 밑면이 정사각뿔 밑면에 평행한 배치를 기준으로 한다. 윗면의 높이를 $h$로 고정하면, 윗면은 한 변이 $s$인 높이 $h$의 정사각형 단면 안에 있으므로 넓이는 $s^2$ 이하이고, 단면 전체를 윗면으로 택하면 넓이 $s^2$가 되어 등호가 성립한다. 윗면을 고정한 채 밑면을 아래로 내리면 아래쪽 평행단면일수록 더 커져 같은 직사각형이 계속 들어가므로, 부피는 밑면이 정사각뿔의 밑면에 닿을 때 가장 크다. 따라서 이 배치의 최대에서는 밑면이 정사각뿔의 밑면에 놓이고, 윗면은 높이 $h$의 단면 전체인 정사각형이다. 밑면에서 높이 $h$인 평행단면의 한 변 길이를 $s$라 하면 닮음에 의해 $\dfrac{s}{3}=\dfrac{H-h}{H}$, 즉 $s=3\left(1-\dfrac hH\right)$이다.
- **해설 경로·판정 이유·계산 검산:** 원본 PNG의 밑면·옆모서리 길이 3을 확인; 정사각뿔 높이 $3/\sqrt2$, 수평단면 넓이 $9(1-h/H)^2$, $h=H/3$에서 최대 부피 $2\sqrt2$다.
- 그림 증거:  `archive/assets/images/23_제일고_2학기_기말_고2_수학II/q17.png` (원본 PNG를 GitHub에서 실제 열어 보고 좌표·부호·도형 조건 판독 완료). `assets/images/23_제일고_2학기_기말_고2_수학II/q17-solution-v2.svg` (solutionImage SVG/학생 화면 렌더 NOT_RUN).
- 판정: **KEEP** / SOURCE_READ_EVIDENCED / SOURCE_PNG_VISUALLY_READ / RELEASE_QA_NOT_RUN.


## Q18 — KEEP

- source ordinal: 18; id: `18`; sourceQid: `NOT_PRESENT`; source blob: `924cd199e845af7c08ad5c92f523ebda0e5a15d5`.
- 과정 표기: `수학II`; 문항 분류: `정적분과 넓이`.
- 원본 문제 조건·보기 (출처 JS 필드 보존):

```text
두 양수 $a,k$에 대하여 함수 $f(x)=\begin{cases}x^3-2x^2&(x<a)\\\dfrac12x^2+k&(x\ge a)\end{cases}$는 $x=a$에서 연속이다. 함수 $y=f(x)$의 그래프와 $x$축 및 두 직선 $x=a$, $x=a+1$로 둘러싸인 부분의 넓이를 $S_1$, 함수 $y=f(x)$의 그래프와 $x$축으로 둘러싸인 부분의 넓이를 $S_2$라 하자. $\dfrac18S_1=S_2$일 때, $k-a$의 값은? [4.8점]
원본 보기: ["$\\dfrac12$","$1$","$\\dfrac32$","$2$","$\\dfrac52$"]
```

- 원본 정답: `③`.
- 기존 solution 실제 발췌 (원문에서 추출, 자의적 변형 없음):
> [키포인트] 연속 조건으로 $k$를 $a$로 나타낸 뒤 두 넓이를 정확히 적분한다.
> 정석 풀이: $S_2=\int_0^2(2x^2-x^3)dx=\dfrac43$이다. 또한 $S_1=\int_a^{a+1}\left(\dfrac12x^2+k\right)dx=\dfrac{6a^3-12a^2+3a+1}{6}$이다. $\dfrac18S_1=S_2$이므로 $S_1=\dfrac{32}{3}$이고, 정리하면 $6a^3-12a^2+3a-63=3(a-3)(2a^2+2a+7)=0$이다. 양수 조건에서 $a=3$이고 $k=9\left(3-\dfrac52\right)=\dfrac92$이다. 따라서 $k-a=\dfrac32$이다.
- **해설 경로·판정 이유·계산 검산:** 연속성으로 $k=a^2(a-5/2)>0$에서 $a>5/2$; 음의 구간 $[0,2]$ 넓이 $4/3$과 $S_1/8=S_2$를 대입하면 $a=3,k=9/2$, 차 3/2다.
- 그림 증거: 원본 문제 PNG 별도 연결 없음. `assets/images/23_제일고_2학기_기말_고2_수학II/q18-solution.svg` (solutionImage SVG/학생 화면 렌더 NOT_RUN).
- 판정: **KEEP** / SOURCE_READ_EVIDENCED / SOURCE_PNG_NOT_APPLICABLE / RELEASE_QA_NOT_RUN.


## Q19 — KEEP

- source ordinal: 19; id: `19`; sourceQid: `NOT_PRESENT`; source blob: `924cd199e845af7c08ad5c92f523ebda0e5a15d5`.
- 과정 표기: `수학II`; 문항 분류: `함수의 증가·감소와 역함수`.
- 원본 문제 조건·보기 (출처 JS 필드 보존):

```text
최고차항의 계수가 $1$이고 상수항을 포함한 모든 항의 계수가 자연수인 삼차함수 $f(x)$에 대하여 함수 $g(x)=\dfrac{x}{f(x)-1}$라 할 때, 두 함수 $f(x)$와 $g(x)$가 다음 조건을 만족시킨다.<br><div class="question-note-box">(가) 모든 실수 $t$에 대하여 극한값 $\displaystyle\lim_{x\to t}g(x)$가 존재한다.<br>(나) 함수 $f(x)$의 역함수가 존재하지 않는다.</div>$f(1)$의 최솟값은? [5점]
원본 보기: ["$11$","$12$","$13$","$14$","$15$"]
```

- 원본 정답: `①`.
- 기존 solution 실제 발췌 (원문에서 추출, 자의적 변형 없음):
> [키포인트] $g(x)$의 모든 점에서 유한한 극한이 존재한다는 조건은 $f(x)-1$의 실근을 강하게 제한하고, 역함수 부재 조건은 $f$의 단조성을 제한한다.
> 정석 풀이: 따라서 $r=1$이고 $f(x)-1=x(x^2+px+q)$이다. $x=0$을 약분한 뒤에도 모든 실수에서 유한한 극한이 존재하려면 $x^2+px+q$가 실근을 갖지 않아야 하므로 $p^2<4q$이다. 한편 $f$의 역함수가 존재하지 않으려면 $f$가 일대일이 아니어야 하므로 $f'(x)=3x^2+2px+q$가 음수가 되는 구간을 가져야 한다. 따라서 판별식이 양수여야 하여 $p^2>3q$이다. 즉 $3q<p^2<4q$이다.
- **해설 경로·판정 이유·계산 검산:** $f-1=x(x^2+px+q)$의 비영점 분모 실근 방지는 $p^2<4q$; 역함수 불존재 조건은 $p^2>3q$; 최소 자연수쌍 $(p,q)=(4,5)$로 $f(1)=11$이다.
- 그림 증거: 원본 문제 PNG 별도 연결 없음. `assets/images/23_제일고_2학기_기말_고2_수학II/q19-solution.svg` (solutionImage SVG/학생 화면 렌더 NOT_RUN).
- 판정: **KEEP** / SOURCE_READ_EVIDENCED / SOURCE_PNG_NOT_APPLICABLE / RELEASE_QA_NOT_RUN.


## Q20 — KEEP

- source ordinal: 20; id: `20`; sourceQid: `NOT_PRESENT`; source blob: `924cd199e845af7c08ad5c92f523ebda0e5a15d5`.
- 과정 표기: `수학II`; 문항 분류: `극댓값과 극솟값`.
- 원본 문제 조건·보기 (출처 JS 필드 보존):

```text
[서술형1] 삼차함수 $f(x)=x^3+px^2+qx+r$에 대하여 함수 $y=f'(x)$의 그래프는 두 점 $(-1,0)$, $(5,0)$을 지난다. 함수 $f(x)$가 극댓값 $10$을 가질 때, 세 상수 $p,q,r$에 대하여 $p+q+r$의 값을 구하시오. [4점]
원본 보기: []
```

- 원본 정답: `$-19$`.
- 기존 solution 실제 발췌 (원문에서 추출, 자의적 변형 없음):
> [키포인트] $f'(x)$는 최고차항 계수가 $3$인 이차함수이고 두 근이 $-1,5$이므로 도함수를 바로 결정할 수 있다.
> 정석 풀이: $f'(x)=3x^2+2px+q$와 비교하면 $2p=-12$, $q=-15$이므로 $p=-6$, $q=-15$이다. $x=-1$에서 도함수의 부호가 $+$에서 $-$로 바뀌므로 극댓값을 갖는다. $f(-1)=-1-6+15+r=8+r=10$에서 $r=2$이다. 따라서 $p+q+r=-6-15+2=-19$이다.
- **해설 경로·판정 이유·계산 검산:** $f'=3(x+1)(x-5)$에서 $p=-6,q=-15$; 극대점 -1의 값이 10이 되려면 $r=2$이고 합 -19다.
- 그림 증거: 원본 문제 PNG 별도 연결 없음. `assets/images/23_제일고_2학기_기말_고2_수학II/q20-solution.svg` (solutionImage SVG/학생 화면 렌더 NOT_RUN).
- 판정: **KEEP** / SOURCE_READ_EVIDENCED / SOURCE_PNG_NOT_APPLICABLE / RELEASE_QA_NOT_RUN.


## Q21 — KEEP

- source ordinal: 21; id: `21`; sourceQid: `NOT_PRESENT`; source blob: `924cd199e845af7c08ad5c92f523ebda0e5a15d5`.
- 과정 표기: `수학II`; 문항 분류: `곡선과 넓이`.
- 원본 문제 조건·보기 (출처 JS 필드 보존):

```text
[서술형2] 곡선 $y=16-x^2$과 $y$축 및 직선 $y=k$, $x=4$로 둘러싸인 두 부분의 넓이가 같을 때, 이를 만족시키는 상수 $k$의 값은? [4점] (단, $x\ge0$, $0<k<16$)
원본 보기: []
```

- 원본 정답: `$\dfrac{32}{3}$`.
- 기존 solution 실제 발췌 (원문에서 추출, 자의적 변형 없음):
> [키포인트] 수평선 $y=k$와 포물선의 교점을 기준으로 위쪽 넓이와 아래쪽 넓이가 같다는 조건을 부호 있는 적분 하나로 합친다.
> 정석 풀이: $\int_0^4(16-x^2-k)dx=64-\dfrac{64}{3}-4k=\dfrac{128}{3}-4k$이다. 이를 $0$으로 두면 $4k=\dfrac{128}{3}$이므로 $k=\dfrac{32}{3}$이다. 이 값은 $0<k<16$을 만족한다.
- **해설 경로·판정 이유·계산 검산:** 두 영역 등면적은 $\int_0^4(16-x^2-k)dx=0$으로 환원되어 $k=32/3$이다.
- 그림 증거: 원본 문제 PNG 별도 연결 없음. `assets/images/23_제일고_2학기_기말_고2_수학II/q21-solution-v2.svg` (solutionImage SVG/학생 화면 렌더 NOT_RUN).
- 판정: **KEEP** / SOURCE_READ_EVIDENCED / SOURCE_PNG_NOT_APPLICABLE / RELEASE_QA_NOT_RUN.


## Q22 — KEEP

- source ordinal: 22; id: `22`; sourceQid: `NOT_PRESENT`; source blob: `924cd199e845af7c08ad5c92f523ebda0e5a15d5`.
- 과정 표기: `수학II`; 문항 분류: `극값과 도함수`.
- 원본 문제 조건·보기 (출처 JS 필드 보존):

```text
[서술형3] 최고차항의 계수가 $1$인 사차함수 $f(x)$와 두 실수 $a,b$가 다음 조건을 만족시킨다.<br><div class="question-note-box">(가) 함수 $f(x)$는 $x=1$에서 극대이고, $x=a$와 $x=b$에서 극소이다.<br>(나) $f'(-1)=8$<br>(다) $b-a=\sqrt{13}$</div>$f'(2)$의 값을 구하시오. [6점]
원본 보기: []
```

- 원본 정답: `$-4$`.
- 기존 solution 실제 발췌 (원문에서 추출, 자의적 변형 없음):
> [키포인트] 사차함수의 도함수는 최고차항 계수가 $4$인 삼차함수이고, 극값의 위치가 바로 도함수의 세 근이다.
> 정석 풀이: $f'(-1)=4(-1-a)(-2)(-1-b)=-8(1+a)(1+b)=8$이므로 $(1+a)(1+b)=-1$, 즉 $s+p=-2$이다. 또 $(b-a)^2=s^2-4p=13$이다. $p=-2-s$를 대입하면 $s^2+4s-5=0$이므로 $s=1$ 또는 $-5$이다. $a<1<b$인 극값의 순서를 만족하는 것은 $s=1$이고, 이때 $p=-3$이다.
- **해설 경로·판정 이유·계산 검산:** 세 임계점 $a<1<b$와 $f'(-1)=8$에서 $(1+a)(1+b)=-1$; $b-a=\sqrt{13}$를 이용해 $a+b=1,ab=-3$, $f'(2)=-4$다.
- 그림 증거: 원본 문제 PNG 별도 연결 없음. `assets/images/23_제일고_2학기_기말_고2_수학II/q22-solution.svg` (solutionImage SVG/학생 화면 렌더 NOT_RUN).
- 판정: **KEEP** / SOURCE_READ_EVIDENCED / SOURCE_PNG_NOT_APPLICABLE / RELEASE_QA_NOT_RUN.


## Q23 — KEEP

- source ordinal: 23; id: `23`; sourceQid: `NOT_PRESENT`; source blob: `924cd199e845af7c08ad5c92f523ebda0e5a15d5`.
- 과정 표기: `수학II`; 문항 분류: `정적분으로 정의된 함수와 실근의 개수`.
- 원본 문제 조건·보기 (출처 JS 필드 보존):

```text
[서술형4] 삼차함수 $f(x)=x^3-6x^2+a$에 대하여 함수 $g(x)=\displaystyle\int_0^x f(t)dt$라 하고 실수 $k$에 대하여 방정식 $g(x)=k$의 서로 다른 실근의 개수를 $h(k)$라 하자. $h(k)$의 최댓값이 $2$일 때, 양수 $a$의 최솟값을 구하시오. [6점]
원본 보기: []
```

- 원본 정답: `$32$`.
- 기존 solution 실제 발췌 (원문에서 추출, 자의적 변형 없음):
> [키포인트] 방정식 $g(x)=k$의 실근 개수는 $y=g(x)$와 수평선의 교점 개수이므로, $g'(x)=f(x)$의 실근 개수와 부호 변화를 조사한다.
> 정석 풀이: $a=32$이면 $F(x)=x^3-6x^2+32=(x+2)(x-4)^2$이다. $x=4$에서는 부호가 바뀌지 않고 $x=-2$에서만 부호가 바뀌므로 $g$는 한 번 감소한 뒤 계속 증가한다. 따라서 임의의 수평선과의 교점은 최대 $2$개이다. $a>32$에서도 $F$는 실근을 하나만 가져 같은 성질을 가지므로, 조건을 만족하는 양수 $a$의 최솟값은 $32$이다.
- **해설 경로·판정 이유·계산 검산:** $g'=f=x^3-6x^2+a$의 극대·극소 수평 위치가 $a,a-32$이므로 $0<a<32$는 4교점이 가능; 경계 $a=32$에서 접근 중근으로 최대 교점은 2개다.
- 그림 증거: 원본 문제 PNG 별도 연결 없음. `assets/images/23_제일고_2학기_기말_고2_수학II/q23-solution-v2.svg` (solutionImage SVG/학생 화면 렌더 NOT_RUN).
- 판정: **KEEP** / SOURCE_READ_EVIDENCED / SOURCE_PNG_NOT_APPLICABLE / RELEASE_QA_NOT_RUN.


## 감사 종료 및 인계

- source read: **23/23**; KEEP 23, UPGRADE 0, HOLD 0, UNREAD 0. 학생용 완성 대체 해설: 0문항.
- 원본 PNG 직접 판독: **1개 / 1개**; solutionImage SVG 검수: **NOT_RUN**.
- 다음 작업: Golden/Negative 독립 샘플, preflight 영수증·샘플 학생 화면 렌더, 수정 적용 승인 및 운영 출고 절차. 이 문서 자체가 배포 승인이나 원본 변경을 뜻하지 않는다.
