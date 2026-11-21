# 미적분Ⅰ(구 수학Ⅱ) 심층 감사 — 23_매산여고_2학기_기말_고2_수학II

- 원본 범위: 2023년 고2 2학기 기말, `standardCourse: 수학II` (현행 작업 라인 명칭: 미적분Ⅰ).
- 원본 JS: `archive/exams/original/high/h2/2final/23_매산여고_2학기_기말_고2_수학II.js`; ref `main`, GitHub blob `c58324b0757262006e8f27ef3158c96244f938a3`.
- 문항 분모: **23**; 판정 **KEEP 23 / UPGRADE 0 / HOLD 0 / UNREAD 0**.
- 작업 브랜치: `work/solution-upgrade-lane-10-20261121`, 감사 문서: `docs/operations/solution-upgrade-reservations/staged/calculus1/23_매산여고_2학기_기말_고2_수학II_DEEP_AUDIT.md`.
- 원본 문제 PNG: 해당 시험지의 파일 1개를 GitHub 바이너리에서 직접 열어 판독함. 원본 JS에 없는 별도 그림은 임의로 만들지 않음. SVG solutionImage 렌더·학생 화면 독립 검수는 **NOT_RUN**.
- 범위·절차: 모든 23문항의 원본 발문·보기·정답·기존 solution을 읽고, 계산 근거를 문항별로 작성. 공유 점유 조회/claim은 사용자 지시로 생략. 자동 preflight receipt, Golden/Negative, 최종 출고 QA는 **NOT_RUN**.
- 현재 단계: **EXAM_AUDIT_COMPLETE / EXAM_DRAFT_COMPLETE / RELEASE_QA_NOT_RUN**. 수학적 반례·정답 불일치는 발견되지 않아 현재 문서상 KEEP만 분류함. 운영 JS·정답·보기·SVG·main은 수정하지 않음.

## Q01 — KEEP

- source ordinal: 1; id: `1`; sourceQid: `NOT_PRESENT`; source blob: `c58324b0757262006e8f27ef3158c96244f938a3`.
- 과정 표기: `수학II`; 문항 분류: `평균변화율`.
- 원본 문제 조건·보기 (출처 JS 필드 보존):

```text
함수 $f(x)=2x^2+ax+5$에서 $x$의 값이 $-1$에서 $1$까지 변할 때, 평균변화율이 $5$이다. 이때 상수 $a$의 값을 구하면? [3.5점]
원본 보기: ["$1$","$2$","$3$","$4$","$5$"]
```

- 원본 정답: `⑤`.
- 기존 solution 실제 발췌 (원문에서 추출, 자의적 변형 없음):
> [키포인트] 평균변화율은 $\dfrac{f(1)-f(-1)}{1-(-1)}$이다.
> 이 값이 $5$이므로 $a=5$이다. 따라서 정답은 ⑤이다.
- **해설 경로·판정 이유·계산 검산:** $f(1)=7+a,f(-1)=7-a$의 평균변화율은 $a$이므로 $a=5$다.
- 그림 증거: 원본 문제 PNG 별도 연결 없음. `assets/images/23_매산여고_2학기_기말_고2_수학II/q1-solution.svg` (solutionImage SVG/학생 화면 렌더 NOT_RUN).
- 판정: **KEEP** / SOURCE_READ_EVIDENCED / SOURCE_PNG_NOT_APPLICABLE / RELEASE_QA_NOT_RUN.


## Q02 — KEEP

- source ordinal: 2; id: `2`; sourceQid: `NOT_PRESENT`; source blob: `c58324b0757262006e8f27ef3158c96244f938a3`.
- 과정 표기: `수학II`; 문항 분류: `곱함수의 미분`.
- 원본 문제 조건·보기 (출처 JS 필드 보존):

```text
두 함수 $f(x)=-x^2+3x$, $g(x)=2x^3-x^2+x-1$에 대하여 곡선 $y=f(x)g(x)$ 위의 점 $(1,2)$에서 접하는 접선의 기울기를 구하면? [3.6점]
원본 보기: ["$10$","$11$","$12$","$13$","$14$"]
```

- 원본 정답: `②`.
- 기존 solution 실제 발췌 (원문에서 추출, 자의적 변형 없음):
> [키포인트] 접선의 기울기는 곱함수 $f(x)g(x)$의 $x=1$에서의 미분계수이다.
> 곱의 미분법으로 $(fg)'(1)=f'(1)g(1)+f(1)g'(1)=1\cdot1+2\cdot5=11$이다. 따라서 정답은 ②이다.
- **해설 경로·판정 이유·계산 검산:** $(fg)'(1)=f'(1)g(1)+f(1)g'(1)=1+10=11$이며 주어진 점 (1,2)와도 합치한다.
- 그림 증거: 원본 문제 PNG 별도 연결 없음. `assets/images/23_매산여고_2학기_기말_고2_수학II/q2-solution.svg` (solutionImage SVG/학생 화면 렌더 NOT_RUN).
- 판정: **KEEP** / SOURCE_READ_EVIDENCED / SOURCE_PNG_NOT_APPLICABLE / RELEASE_QA_NOT_RUN.


## Q03 — KEEP

- source ordinal: 3; id: `3`; sourceQid: `NOT_PRESENT`; source blob: `c58324b0757262006e8f27ef3158c96244f938a3`.
- 과정 표기: `수학II`; 문항 분류: `도함수 그래프와 함수의 증감`.
- 원본 문제 조건·보기 (출처 JS 필드 보존):

```text
함수 $f(x)$의 도함수 $y=f'(x)$의 그래프가 다음 그림과 같을 때, 보기 중 옳은 것을 모두 고르면? [3.6점]<br><img src="assets/images/23_매산여고_2학기_기말_고2_수학II/q3.png" alt="도함수 y=f&#39;(x)의 그래프"><div class="question-note-box">&lt;보기&gt;<br>ㄱ. $f(x)$는 닫힌구간 $[0,5]$에서 증가한다.<br>ㄴ. $f(x)$는 $x=2$에서 극대이다.<br>ㄷ. $f(x)$는 $x=-4$에서 극값을 갖는다.<br>ㄹ. 닫힌구간 $[-5,5]$에서 $f(x)$의 극값은 $3$개이다.</div>
원본 보기: ["ㄴ","ㄴ, ㄹ","ㄱ, ㄷ","ㄱ, ㄷ, ㄹ","ㄴ, ㄷ, ㄹ"]
```

- 원본 정답: `③`.
- 기존 solution 실제 발췌 (원문에서 추출, 자의적 변형 없음):
> [키포인트] $f'(x)$의 부호와 부호 변화로 $f$의 증감과 극값을 판정한다.
> 그래프에서 $0\lt x\lt4$와 $4\lt x\le5$에서 $f'(x)\gt0$이고 $f'(4)=0$이지만 부호는 바뀌지 않으므로 $f$는 $[0,5]$에서 증가한다. 따라서 ㄱ은 참이다.
- **해설 경로·판정 이유·계산 검산:** 원본 PNG에서 $f'$는 $-4$에서 양→음, $0$에서 음→양, $4$에서 0이지만 양을 유지한다; ㄱ·ㄷ만 참이므로 ③이다.
- 그림 증거:  `archive/assets/images/23_매산여고_2학기_기말_고2_수학II/q3.png` (원본 PNG를 GitHub에서 실제 열어 보고 좌표·부호·도형 조건 판독 완료). `assets/images/23_매산여고_2학기_기말_고2_수학II/q3-solution.svg` (solutionImage SVG/학생 화면 렌더 NOT_RUN).
- 판정: **KEEP** / SOURCE_READ_EVIDENCED / SOURCE_PNG_VISUALLY_READ / RELEASE_QA_NOT_RUN.


## Q04 — KEEP

- source ordinal: 4; id: `4`; sourceQid: `NOT_PRESENT`; source blob: `c58324b0757262006e8f27ef3158c96244f938a3`.
- 과정 표기: `수학II`; 문항 분류: `부정적분과 도함수`.
- 원본 문제 조건·보기 (출처 JS 필드 보존):

```text
함수 $f(x)$에 대하여 $\displaystyle\int f(x)dx=5x^2+2x+C$일 때, $f(1)$의 값을 구하면? (단, $C$는 적분상수) [3.5점]
원본 보기: ["$12$","$14$","$16$","$18$","$20$"]
```

- 원본 정답: `①`.
- 기존 solution 실제 발췌 (원문에서 추출, 자의적 변형 없음):
> [키포인트] 부정적분의 양변을 미분하면 피적분함수 $f(x)$를 얻는다.
> $f(x)=10x+2$이므로 $f(1)=10+2=12$이다. 따라서 정답은 ①이다.
- **해설 경로·판정 이유·계산 검산:** 부정적분의 도함수 $f(x)=10x+2$에 $x=1$을 넣어 12다.
- 그림 증거: 원본 문제 PNG 별도 연결 없음. `assets/images/23_매산여고_2학기_기말_고2_수학II/q4-solution.svg` (solutionImage SVG/학생 화면 렌더 NOT_RUN).
- 판정: **KEEP** / SOURCE_READ_EVIDENCED / SOURCE_PNG_NOT_APPLICABLE / RELEASE_QA_NOT_RUN.


## Q05 — KEEP

- source ordinal: 5; id: `5`; sourceQid: `NOT_PRESENT`; source blob: `c58324b0757262006e8f27ef3158c96244f938a3`.
- 과정 표기: `수학II`; 문항 분류: `도함수와 함수값`.
- 원본 문제 조건·보기 (출처 JS 필드 보존):

```text
$f'(x)=4(x-2)(x^2+2x+4)$, $f(0)=-20$을 만족시키는 함수 $f(x)$에 대하여 $f(-1)$의 값을 구하면? [3.6점]
원본 보기: ["$11$","$12$","$13$","$14$","$15$"]
```

- 원본 정답: `③`.
- 기존 solution 실제 발췌 (원문에서 추출, 자의적 변형 없음):
> [키포인트] $f(-1)-f(0)=\displaystyle\int_0^{-1}f'(x)dx$를 이용한다.
> 따라서 $\displaystyle\int_0^{-1}(4x^3-32)dx=[x^4-32x]_0^{-1}=33$이다.
- **해설 경로·판정 이유·계산 검산:** $(x-2)(x^2+2x+4)=x^3-8$; $f(-1)-f(0)=\int_0^{-1}(4x^3-32)dx=33$이라 결과 13이다.
- 그림 증거: 원본 문제 PNG 별도 연결 없음. `assets/images/23_매산여고_2학기_기말_고2_수학II/q5-solution.svg` (solutionImage SVG/학생 화면 렌더 NOT_RUN).
- 판정: **KEEP** / SOURCE_READ_EVIDENCED / SOURCE_PNG_NOT_APPLICABLE / RELEASE_QA_NOT_RUN.


## Q06 — KEEP

- source ordinal: 6; id: `6`; sourceQid: `NOT_PRESENT`; source blob: `c58324b0757262006e8f27ef3158c96244f938a3`.
- 과정 표기: `수학II`; 문항 분류: `두 곡선 사이의 넓이`.
- 원본 문제 조건·보기 (출처 JS 필드 보존):

```text
두 곡선 $y=x^3-4x^2+7x$가 $y=2x^2-x$로 둘러싸인 도형의 넓이를 구하면? [3.7점]
원본 보기: ["$6$","$7$","$8$","$9$","$10$"]
```

- 원본 정답: `③`.
- 기존 solution 실제 발췌 (원문에서 추출, 자의적 변형 없음):
> [키포인트] 두 함수의 차를 인수분해하여 교점과 위아래 관계를 확인한다.
> 원시함수는 $\dfrac14x^4-2x^3+4x^2$이고, 그 값은 $F(0)=0$, $F(2)=4$, $F(4)=0$이다. 따라서 넓이는 $(4-0)-(0-4)=8$이다. 정답은 ③이다.
- **해설 경로·판정 이유·계산 검산:** 교점 0,2,4 사이 부호를 나누면 양쪽 넓이가 각각 4, 합계 8이다.
- 그림 증거: 원본 문제 PNG 별도 연결 없음. `assets/images/23_매산여고_2학기_기말_고2_수학II/q6-solution.svg` (solutionImage SVG/학생 화면 렌더 NOT_RUN).
- 판정: **KEEP** / SOURCE_READ_EVIDENCED / SOURCE_PNG_NOT_APPLICABLE / RELEASE_QA_NOT_RUN.


## Q07 — KEEP

- source ordinal: 7; id: `7`; sourceQid: `NOT_PRESENT`; source blob: `c58324b0757262006e8f27ef3158c96244f938a3`.
- 과정 표기: `수학II`; 문항 분류: `방정식의 실근의 개수`.
- 원본 문제 조건·보기 (출처 JS 필드 보존):

```text
함수 $f(x)=3x^3-9x^2+4$에서 방정식 $|f(x)|=k+1$가 서로 다른 두 실근을 갖도록 하는 상수 $k$의 값의 범위를 구하면? [3.8점]
원본 보기: ["$5\\lt k\\lt 7$","$3\\lt k\\lt 7$","$k\\gt 8$","$k\\gt 7$","$0\\lt k\\lt 4$"]
```

- 원본 정답: `④`.
- 기존 solution 실제 발췌 (원문에서 추출, 자의적 변형 없음):
> [키포인트] $|f(x)|=c$로 두면 $c=k+1$이고, 두 수평선 $y=c$, $y=-c$와 그래프의 교점 수를 센다.
> $f'(x)=9x(x-2)$이므로 $f$는 $x=0$에서 극댓값 $4$, $x=2$에서 극솟값 $-8$을 갖는다. 따라서 $f(x)=c$와 $f(x)=-c$의 교점 수는 높이가 $4$, $-8$을 지나는지에 따라 달라진다.
- **해설 경로·판정 이유·계산 검산:** $f$의 극댓값 4·극솟값 -8 때문에 $|f|=k+1$이 두 실근인 경우는 $k+1>8$뿐이다.
- 그림 증거: 원본 문제 PNG 별도 연결 없음. `assets/images/23_매산여고_2학기_기말_고2_수학II/q7-solution.svg` (solutionImage SVG/학생 화면 렌더 NOT_RUN).
- 판정: **KEEP** / SOURCE_READ_EVIDENCED / SOURCE_PNG_NOT_APPLICABLE / RELEASE_QA_NOT_RUN.


## Q08 — KEEP

- source ordinal: 8; id: `8`; sourceQid: `NOT_PRESENT`; source blob: `c58324b0757262006e8f27ef3158c96244f938a3`.
- 과정 표기: `수학II`; 문항 분류: `함수의 최솟값과 부등식`.
- 원본 문제 조건·보기 (출처 JS 필드 보존):

```text
$x\ge0$일 때, 부등식 $5x^3-10x^2+k\gt 5x^2-10$이 항상 성립하도록 하는 실수 $k$의 범위를 구하면? [3.9점]
원본 보기: ["$k\\lt -12$","$k\\lt -10$","$-12\\lt k\\lt 12$","$k\\gt 12$","$k\\gt 10$"]
```

- 원본 정답: `⑤`.
- 기존 solution 실제 발췌 (원문에서 추출, 자의적 변형 없음):
> [키포인트] 부등식을 한쪽으로 모아 $x\ge0$에서의 최솟값이 양수가 되도록 한다.
> $h(2)=40-60+k+10=k-10$이고 원래 부등식이 모든 $x\ge0$에서 엄격하게 성립해야 하므로 $k-10\gt 0$이다. 따라서 $k\gt 10$이고 정답은 ⑤이다.
- **해설 경로·판정 이유·계산 검산:** $h'=15x(x-2)$, $x\ge0$ 최솟점 $x=2$에서 원 부등식의 여유가 $k-10$이므로 엄격한 조건은 $k>10$이다.
- 그림 증거: 원본 문제 PNG 별도 연결 없음. `assets/images/23_매산여고_2학기_기말_고2_수학II/q8-solution.svg` (solutionImage SVG/학생 화면 렌더 NOT_RUN).
- 판정: **KEEP** / SOURCE_READ_EVIDENCED / SOURCE_PNG_NOT_APPLICABLE / RELEASE_QA_NOT_RUN.


## Q09 — KEEP

- source ordinal: 9; id: `9`; sourceQid: `NOT_PRESENT`; source blob: `c58324b0757262006e8f27ef3158c96244f938a3`.
- 과정 표기: `수학II`; 문항 분류: `속도와 가속도`.
- 원본 문제 조건·보기 (출처 JS 필드 보존):

```text
수직선 위를 움직이는 점 $P$의 시각 $t$에서의 위치 $x$가 $x=t^3-5t^2+8t$일 때, 점 $P$가 처음으로 운동 방향을 바꿀 때의 점 $P$의 가속도를 구하면? [4.0점]
원본 보기: ["$-4$","$-2$","$0$","$2$","$4$"]
```

- 원본 정답: `②`.
- 기존 solution 실제 발췌 (원문에서 추출, 자의적 변형 없음):
> [키포인트] 운동 방향은 속도의 부호가 바뀔 때 바뀐다.
> 가속도는 $a(t)=v'(t)=6t-10$이므로 $a\left(\dfrac43\right)=8-10=-2$이다. 따라서 정답은 ②이다.
- **해설 경로·판정 이유·계산 검산:** 속도 $(3t-4)(t-2)$의 첫 방향 전환은 $t=4/3$, 가속도 $6t-10=-2$다.
- 그림 증거: 원본 문제 PNG 별도 연결 없음. `assets/images/23_매산여고_2학기_기말_고2_수학II/q9-solution.svg` (solutionImage SVG/학생 화면 렌더 NOT_RUN).
- 판정: **KEEP** / SOURCE_READ_EVIDENCED / SOURCE_PNG_NOT_APPLICABLE / RELEASE_QA_NOT_RUN.


## Q10 — KEEP

- source ordinal: 10; id: `10`; sourceQid: `NOT_PRESENT`; source blob: `c58324b0757262006e8f27ef3158c96244f938a3`.
- 과정 표기: `수학II`; 문항 분류: `정적분의 성질`.
- 원본 문제 조건·보기 (출처 JS 필드 보존):

```text
다음 보기에서 정적분 값을 옳게 구한 것을 모두 고르면? [3.9점]<div class="question-note-box">&lt;보기&gt;<br>ㄱ. $\displaystyle\int_{-1}^{3}(2x^2+3x)dx+\int_{-1}^{3}(x^2-7x)dx=11$<br>ㄴ. $\displaystyle\int_{-2}^{2}(4x^3-3x^2-7x+1)dx=-12$<br>ㄷ. $\displaystyle\int_{-1}^{2}(x^5+6x^2-8x)dx+\int_{2}^{1}(x^5+6x^2-8x)dx=4$</div>
원본 보기: ["ㄷ","ㄱ, ㄴ","ㄱ, ㄷ","ㄴ, ㄷ","ㄱ, ㄴ, ㄷ"]
```

- 원본 정답: `④`.
- 기존 solution 실제 발췌 (원문에서 추출, 자의적 변형 없음):
> [키포인트] 적분 구간을 합치거나 대칭구간에서 홀함수·짝함수 성질을 이용한다.
> ㄴ에서는 홀수차항 $4x^3-7x$의 대칭구간 적분이 $0$이므로 $\displaystyle\int_{-2}^{2}(-3x^2+1)dx=[-x^3+x]_{-2}^{2}=-12$이다. 따라서 참이다.
- **해설 경로·판정 이유·계산 검산:** ㄱ 적분은 12로 주장 11과 달라 거짓; ㄴ의 대칭 적분 -12, ㄷ의 합성 적분 4로 둘 다 참이다.
- 그림 증거: 원본 문제 PNG 별도 연결 없음. solutionImage 없음.
- 판정: **KEEP** / SOURCE_READ_EVIDENCED / SOURCE_PNG_NOT_APPLICABLE / RELEASE_QA_NOT_RUN.


## Q11 — KEEP

- source ordinal: 11; id: `11`; sourceQid: `NOT_PRESENT`; source blob: `c58324b0757262006e8f27ef3158c96244f938a3`.
- 과정 표기: `수학II`; 문항 분류: `접선과 곡선 사이의 넓이`.
- 원본 문제 조건·보기 (출처 JS 필드 보존):

```text
함수 $f(x)=ax^3-9ax$ $(a\gt 0)$에 대하여 곡선 $y=f(x)$ 위의 점 $P(t,f(t))$ $(t\lt 0)$에서의 접선을 $l$이라 하고, 곡선 $y=f(x)$와 직선 $l$이 만나는 점 중 $P$가 아닌 점을 $Q$라 할 때, 함수 $f(x)$와 직선 $l$ 및 점 $Q$가 다음 조건을 만족시킨다.<div class="question-note-box">&lt;조건&gt;<br>(가) 점 $Q$의 $x$좌표는 $4$이다.<br>(나) 곡선 $y=f(x)$와 직선 $l$로 둘러싸인 부분의 넓이는 $216$이다.</div>두 상수 $a,t$의 합 $a+t$의 값을 구하면? [4.1점]
원본 보기: ["$0$","$1$","$2$","$3$","$4$"]
```

- 원본 정답: `①`.
- 기존 solution 실제 발췌 (원문에서 추출, 자의적 변형 없음):
> [키포인트] 삼차함수의 한 점에서 그은 접선은 접점에서 중근을 가지므로 다른 교점을 인수분해로 찾을 수 있다.
> $f(x)=a(x^3-9x)$이고 $x=t$에서의 접선과 곡선의 차를 계산하면 $f(x)-l(x)=a(x-t)^2(x+2t)$이다. 따라서 접점 $x=t$ 이외의 교점의 $x$좌표는 $-2t$이다.
- **해설 경로·판정 이유·계산 검산:** 접점 중근 $(x-t)^2$, 다른 교점 $-2t=4$에서 $t=-2$; 두 곡선 넓이 $108a=216$으로 $a=2$, 합 0이다.
- 그림 증거: 원본 문제 PNG 별도 연결 없음. `assets/images/23_매산여고_2학기_기말_고2_수학II/q11-solution.svg` (solutionImage SVG/학생 화면 렌더 NOT_RUN).
- 판정: **KEEP** / SOURCE_READ_EVIDENCED / SOURCE_PNG_NOT_APPLICABLE / RELEASE_QA_NOT_RUN.


## Q12 — KEEP

- source ordinal: 12; id: `12`; sourceQid: `NOT_PRESENT`; source blob: `c58324b0757262006e8f27ef3158c96244f938a3`.
- 과정 표기: `수학II`; 문항 분류: `정적분으로 정의된 함수`.
- 원본 문제 조건·보기 (출처 JS 필드 보존):

```text
함수 $f(x)$가 $\displaystyle f(x)=\int_x^0(8t^3-2t)dt$일 때, 정적분 $\displaystyle\int_1^2 f'(x)dx$를 구하면? [4.1점]
원본 보기: ["$-33$","$-27$","$27$","$33$","$39$"]
```

- 원본 정답: `②`.
- 기존 solution 실제 발췌 (원문에서 추출, 자의적 변형 없음):
> [키포인트] 적분의 아래끝이 $x$인 함수는 미분할 때 부호가 바뀐다.
> 따라서 $\displaystyle\int_1^2f'(x)dx=[-2x^4+x^2]_1^2=(-32+4)-(-2+1)=-27$이다. 정답은 ②이다.
- **해설 경로·판정 이유·계산 검산:** 하한 $x$ 적분 미분 부호를 바꾸면 $f'=-8x^3+2x$; $1\to2$의 차는 -27이다.
- 그림 증거: 원본 문제 PNG 별도 연결 없음. `assets/images/23_매산여고_2학기_기말_고2_수학II/q12-solution.svg` (solutionImage SVG/학생 화면 렌더 NOT_RUN).
- 판정: **KEEP** / SOURCE_READ_EVIDENCED / SOURCE_PNG_NOT_APPLICABLE / RELEASE_QA_NOT_RUN.


## Q13 — KEEP

- source ordinal: 13; id: `13`; sourceQid: `NOT_PRESENT`; source blob: `c58324b0757262006e8f27ef3158c96244f938a3`.
- 과정 표기: `수학II`; 문항 분류: `절댓값과 정적분으로 정의된 함수`.
- 원본 문제 조건·보기 (출처 JS 필드 보존):

```text
최고차항의 계수가 $1$인 이차함수 $f(x)$에 대하여 함수 $g(x)=\left|\displaystyle\int_0^x f(t)dt\right|$가 다음 조건을 만족시킬 때, $f(4)$의 값을 구하면? [4.2점]<div class="question-note-box">&lt;조건&gt;<br>(가) 함수 $g(x)$는 $x=2$에서 최솟값을 갖는다.<br>(나) 서로 다른 두 상수 $a,b$에 대하여 $a+b=4$이고, $g'(a)=g'(b)=0$이다.</div>
원본 보기: ["$0$","$\\dfrac{2}{3}$","$\\dfrac{4}{3}$","$2$","$\\dfrac{8}{3}$"]
```

- 원본 정답: `⑤`.
- 기존 solution 실제 발췌 (원문에서 추출, 자의적 변형 없음):
> [키포인트] $g'(a)=g'(b)=0$에서 $f$의 두 근을 구하고, $x=2$의 최솟값 조건으로 상수항을 정한다.
> $F(x)=\displaystyle\int_0^x f(t)dt$라 두면 $g(x)=|F(x)|$이다. $F(a)\ne0$이면 $g'(a)=\pm f(a)$이므로 $f(a)=0$이다. $F(a)=0$인 경우에도 $g'(a)$가 존재하려면 $F'(a)=f(a)=0$이어야 한다. 같은 이유로 $f(b)=0$이다. 따라서 최고차항이 $1$이고 $a+b=4$이므로 $f(x)=(x-a)(x-b)=x^2-4x+c$로 둘 수 있다.
- **해설 경로·판정 이유·계산 검산:** $g=|\int_0^x f|$의 내부 최솟점 $x=2$에서 $F(2)=0$이어야 하고 $f$의 두 근 합 4로 $f=x^2-4x+c$; 적분에서 $c=8/3$, $f(4)=8/3$이다.
- 그림 증거: 원본 문제 PNG 별도 연결 없음. `assets/images/23_매산여고_2학기_기말_고2_수학II/q13-solution.svg` (solutionImage SVG/학생 화면 렌더 NOT_RUN).
- 판정: **KEEP** / SOURCE_READ_EVIDENCED / SOURCE_PNG_NOT_APPLICABLE / RELEASE_QA_NOT_RUN.


## Q14 — KEEP

- source ordinal: 14; id: `14`; sourceQid: `NOT_PRESENT`; source blob: `c58324b0757262006e8f27ef3158c96244f938a3`.
- 과정 표기: `수학II`; 문항 분류: `절댓값 정적분과 넓이`.
- 원본 문제 조건·보기 (출처 JS 필드 보존):

```text
최고차항의 계수가 양수인 이차함수 $f(x)$에 대하여 $\displaystyle\int_0^2f(x)dx=-8$, $\displaystyle\int_2^4f(x)dx=40$이고, $\displaystyle\int_0^2|f(x)|dx=40$, $\displaystyle\int_2^4|f(x)|dx=56$일 때, $a\lt b$인 두 실수 $a,b$에 대하여 $\displaystyle\int_a^bf(x)dx$의 최솟값을 구하면? [4.3점]
원본 보기: ["$-32$","$-28$","$-24$","$-20$","$-16$"]
```

- 원본 정답: `①`.
- 기존 solution 실제 발췌 (원문에서 추출, 자의적 변형 없음):
> [키포인트] 각 구간에서 양의 넓이와 음의 넓이의 크기를 연립하여 구한다.
> 따라서 $\displaystyle\int_a^bf(x)dx=-(N_1+N_2)=-(24+8)=-32$이며, 음수인 부분 전체를 적분했을 때가 가능한 최솟값이다. 정답은 ①이다.
- **해설 경로·판정 이유·계산 검산:** $[0,2]$의 음수 면적 24, $[2,4]$의 음수 면적 8; 위로 열린 이차함수의 두 근 사이 전체 부호 있는 적분 최솟값 -32다.
- 그림 증거: 원본 문제 PNG 별도 연결 없음. `assets/images/23_매산여고_2학기_기말_고2_수학II/q14-solution.svg` (solutionImage SVG/학생 화면 렌더 NOT_RUN).
- 판정: **KEEP** / SOURCE_READ_EVIDENCED / SOURCE_PNG_NOT_APPLICABLE / RELEASE_QA_NOT_RUN.


## Q15 — KEEP

- source ordinal: 15; id: `15`; sourceQid: `NOT_PRESENT`; source blob: `c58324b0757262006e8f27ef3158c96244f938a3`.
- 과정 표기: `수학II`; 문항 분류: `미분가능성과 극솟값`.
- 원본 문제 조건·보기 (출처 JS 필드 보존):

```text
최고차항의 계수가 $1$인 삼차함수 $f(x)$에 대하여 함수 $g(x)=\begin{cases}-f(x)&(x\lt 0)\\f(x)&(x\ge0)\end{cases}$가 다음 조건을 모두 만족시킨다.<div class="question-note-box">&lt;조건&gt;<br>(가) $g(x)$는 모든 실수 $x$에 대하여 미분가능하다.<br>(나) 방정식 $g(x)=0$의 모든 실근의 합은 양수이다.</div>함수 $g(x)$가 $x=k$에서 극솟값 $-4$를 가질 때, $k$의 값을 구하면? (단, $k$는 상수) [4.2점]
원본 보기: ["$1$","$2$","$3$","$4$","$5$"]
```

- 원본 정답: `②`.
- 기존 solution 실제 발췌 (원문에서 추출, 자의적 변형 없음):
> [키포인트] 조각함수 $g$가 $x=0$에서 미분가능하려면 $f(0)$과 $f'(0)$이 모두 $0$이어야 한다.
> 이 값이 $-4$이므로 $c^3=27$, $c=3$이고 $k=\dfrac{2c}{3}=2$이다. 따라서 정답은 ②이다.
- **해설 경로·판정 이유·계산 검산:** 미분가능한 조각함수 경계에서 $f(0)=f'(0)=0$이므로 $f=x^2(x-c)$; 두 근 합 양수라 $c>0$, 극소 -4에서 $c=3$, $k=2$다.
- 그림 증거: 원본 문제 PNG 별도 연결 없음. `assets/images/23_매산여고_2학기_기말_고2_수학II/q15-solution.svg` (solutionImage SVG/학생 화면 렌더 NOT_RUN).
- 판정: **KEEP** / SOURCE_READ_EVIDENCED / SOURCE_PNG_NOT_APPLICABLE / RELEASE_QA_NOT_RUN.


## Q16 — KEEP

- source ordinal: 16; id: `16`; sourceQid: `NOT_PRESENT`; source blob: `c58324b0757262006e8f27ef3158c96244f938a3`.
- 과정 표기: `수학II`; 문항 분류: `적분방정식`.
- 원본 문제 조건·보기 (출처 JS 필드 보존):

```text
다항함수 $f(x)$가 모든 실수 $x$에 대하여 $\{f(x)\}^2=\displaystyle\int_0^x(6t-2)f(t)dt+\int_0^1f(t)dt$를 만족시키고 $f(0)\gt 0$일 때, $f(1)$의 값을 구하면? [4.2점]
원본 보기: ["$\\dfrac12$","$1$","$\\dfrac32$","$2$","$\\dfrac52$"]
```

- 원본 정답: `③`.
- 기존 solution 실제 발췌 (원문에서 추출, 자의적 변형 없음):
> [키포인트] 양변을 미분하면 다항식의 곱이 항상 $0$이 되는 항등식을 얻는다.
> 따라서 $f'(x)=3x-1$이고 $f(x)=\dfrac32x^2-x+C$이다.
- **해설 경로·판정 이유·계산 검산:** 다항식 항등식 $f(2f'-6x+2)\equiv0$과 $f(0)>0$으로 $f'=3x-1$; 적분상수 $C^2=C$의 양해 1, 결과 $f(1)=3/2$다.
- 그림 증거: 원본 문제 PNG 별도 연결 없음. `assets/images/23_매산여고_2학기_기말_고2_수학II/q16-solution.svg` (solutionImage SVG/학생 화면 렌더 NOT_RUN).
- 판정: **KEEP** / SOURCE_READ_EVIDENCED / SOURCE_PNG_NOT_APPLICABLE / RELEASE_QA_NOT_RUN.


## Q17 — KEEP

- source ordinal: 17; id: `17`; sourceQid: `NOT_PRESENT`; source blob: `c58324b0757262006e8f27ef3158c96244f938a3`.
- 과정 표기: `수학II`; 문항 분류: `두 점의 운동과 만남`.
- 원본 문제 조건·보기 (출처 JS 필드 보존):

```text
수직선 위를 움직이는 두 점 $P,Q$가 있다. 점 $P$는 좌표가 $0$인 점에서 출발하여 시각 $t$에서 속도가 $v(t)=3t^2-4t$일 때, 점 $P$가 원점을 다시 지날 때의 시각을 $t=a$라 하자. 점 $Q$는 좌표가 $k$인 점에서 출발하여 시각 $t$에서 속도가 $2a$이다. 두 점 $P,Q$가 동시에 출발한 후 두 번 만나도록 하는 정수 $k$의 개수를 구하면? [4.3점]
원본 보기: ["$1$","$3$","$5$","$7$","$9$"]
```

- 원본 정답: `④`.
- 기존 solution 실제 발췌 (원문에서 추출, 자의적 변형 없음):
> [키포인트] 두 점의 위치함수를 구한 뒤 두 위치의 차가 같은 값을 두 번 갖는 조건을 함수의 최솟값으로 해석한다.
> 따라서 점 $Q$의 속도는 $2a=4$이고 위치는 $x_Q(t)=k+4t$이다. 만나는 시각은 $t^3-2t^2=k+4t$, 즉 $h(t)=t^3-2t^2-4t=k$의 양의 해이다.
- **해설 경로·판정 이유·계산 검산:** 두 위치차의 시각함수 $h(t)=t^3-2t^2-4t$는 $t=2$에서 -8, $t=0$에서 0; 두 양의 교점이 생기는 정수 수준 $-7,\ldots,-1$은 7개다.
- 그림 증거: 원본 문제 PNG 별도 연결 없음. `assets/images/23_매산여고_2학기_기말_고2_수학II/q17-solution.svg` (solutionImage SVG/학생 화면 렌더 NOT_RUN).
- 판정: **KEEP** / SOURCE_READ_EVIDENCED / SOURCE_PNG_NOT_APPLICABLE / RELEASE_QA_NOT_RUN.


## Q18 — KEEP

- source ordinal: 18; id: `18`; sourceQid: `NOT_PRESENT`; source blob: `c58324b0757262006e8f27ef3158c96244f938a3`.
- 과정 표기: `수학II`; 문항 분류: `정적분 조건과 극댓값`.
- 원본 문제 조건·보기 (출처 JS 필드 보존):

```text
삼차함수 $f(x)$가 모든 실수 $x$에 대하여 $f(x)=\dfrac13x^3-ax^2+(a^2-b)x+\displaystyle\int_{-1}^{1}f(t)dt$를 만족시킨다. $x\gt 2$에서 함수 $f(x)$가 극댓값을 갖도록 하는 $10$보다 작은 두 정수 $a,b$에 대하여 순서쌍 $(a,b)$의 개수를 $m$이라 하자. $a=k$일 때, $f(0)$은 최소이다. $m+k$의 값을 구하면? (단, $k$는 상수이다) [4.5점]
원본 보기: ["$46$","$48$","$50$","$51$","$52$"]
```

- 원본 정답: `④`.
- 기존 solution 실제 발췌 (원문에서 추출, 자의적 변형 없음):
> [키포인트] 먼저 적분항을 자기일관성으로 구한 뒤, 도함수의 두 근에서 극댓값의 위치 조건을 정수 개수 문제로 바꾼다.
> $I=\displaystyle\int_{-1}^{1}f(t)dt$라 두고 주어진 식을 $-1$부터 $1$까지 적분하면 $I=-\dfrac{2a}{3}+2I$이므로 $I=\dfrac{2a}{3}$이다. 따라서 $f(0)=\dfrac{2a}{3}$이다.
- **해설 경로·판정 이유·계산 검산:** 자기적분항 $I=2a/3$, 극대점 $a-\sqrt b>2$로 가능한 $(a,b)$는 $3+8+9\cdot4=47$개; $a=4$에서 $f(0)$ 최소라 합 51이다.
- 그림 증거: 원본 문제 PNG 별도 연결 없음. `assets/images/23_매산여고_2학기_기말_고2_수학II/q18-solution.svg` (solutionImage SVG/학생 화면 렌더 NOT_RUN).
- 판정: **KEEP** / SOURCE_READ_EVIDENCED / SOURCE_PNG_NOT_APPLICABLE / RELEASE_QA_NOT_RUN.


## Q19 — KEEP

- source ordinal: 19; id: `19`; sourceQid: `NOT_PRESENT`; source blob: `c58324b0757262006e8f27ef3158c96244f938a3`.
- 과정 표기: `수학II`; 문항 분류: `닫힌구간에서의 극값`.
- 원본 문제 조건·보기 (출처 JS 필드 보존):

```text
[주관식1 (단답형)] [4점] (부분점수 없음)<br>닫힌구간 $[-2,0]$에서 함수 $f(x)=2ax^3+3ax^2+b$ $(a\gt 0)$의 최댓값이 $11$, 최솟값이 $-4$일 때, $a-b$의 값을 구하여라. (단, $a,b$는 상수)
원본 보기: []
```

- 원본 정답: `-5`.
- 기존 solution 실제 발췌 (원문에서 추출, 자의적 변형 없음):
> [키포인트] 도함수로 구간 안의 극값과 양 끝점의 함수값을 모두 비교한다.
> $f'(x)=6ax(x+1)$이고 $a\gt 0$이므로 $[-2,-1]$에서 증가, $[-1,0]$에서 감소한다. 따라서 $x=-1$에서 최댓값을 갖고, 두 끝점 중에서는 $f(-2)=b-4a\lt f(0)=b$이므로 $x=-2$에서 최솟값을 갖는다.
- **해설 경로·판정 이유·계산 검산:** $f'=6ax(x+1)$은 $-1$에서 극대; $f(-1)=a+b=11$, $f(-2)=b-4a=-4$를 풀면 $a=3,b=8$, 차 -5다.
- 그림 증거: 원본 문제 PNG 별도 연결 없음. `assets/images/23_매산여고_2학기_기말_고2_수학II/q19-solution.svg` (solutionImage SVG/학생 화면 렌더 NOT_RUN).
- 판정: **KEEP** / SOURCE_READ_EVIDENCED / SOURCE_PNG_NOT_APPLICABLE / RELEASE_QA_NOT_RUN.


## Q20 — KEEP

- source ordinal: 20; id: `20`; sourceQid: `NOT_PRESENT`; source blob: `c58324b0757262006e8f27ef3158c96244f938a3`.
- 과정 표기: `수학II`; 문항 분류: `속도와 거리`.
- 원본 문제 조건·보기 (출처 JS 필드 보존):

```text
[주관식2 (단답형)] [4점] (부분점수 없음)<br>수직선 위를 움직이는 점 $P$의 시각 $t$에서 속도가 $v(t)=6t-3t^2$일 때, $t=1$에서 $t=3$까지 점 $P$가 움직인 거리를 구하여라.
원본 보기: []
```

- 원본 정답: `6`.
- 기존 solution 실제 발췌 (원문에서 추출, 자의적 변형 없음):
> [키포인트] 움직인 거리는 속도의 절댓값을 적분해야 한다.
> 원시함수는 $3t^2-t^3$이고, $F(1)=2$, $F(2)=4$, $F(3)=0$이므로 거리는 $(4-2)-(0-4)=2+4=6$이다.
- **해설 경로·판정 이유·계산 검산:** $v=3t(2-t)$의 부호 전환 $t=2$를 기준으로 절댓값 적분하면 2+4=6이다.
- 그림 증거: 원본 문제 PNG 별도 연결 없음. `assets/images/23_매산여고_2학기_기말_고2_수학II/q20-solution.svg` (solutionImage SVG/학생 화면 렌더 NOT_RUN).
- 판정: **KEEP** / SOURCE_READ_EVIDENCED / SOURCE_PNG_NOT_APPLICABLE / RELEASE_QA_NOT_RUN.


## Q21 — KEEP

- source ordinal: 21; id: `21`; sourceQid: `NOT_PRESENT`; source blob: `c58324b0757262006e8f27ef3158c96244f938a3`.
- 과정 표기: `수학II`; 문항 분류: `함수의 증감과 극값`.
- 원본 문제 조건·보기 (출처 JS 필드 보존):

```text
[주관식3 (서술형)] [7점] (부분점수 있음)<br>닫힌구간 $[0,3]$에서 함수 $f(x)=2x^3-9x^2+12x-1$의 극댓값과 최댓값을 구하여라. (증감표와 극값, $y$절편을 표시한 그래프를 그리시오.)
원본 보기: []
```

- 원본 정답: `극댓값 4, 최댓값 8`.
- 기존 solution 실제 발췌 (원문에서 추출, 자의적 변형 없음):
> [키포인트] 도함수의 부호표로 증가·감소 구간을 정하고, 극값과 양 끝점의 함수값을 비교한다.
> 또 $y$절편은 $(0,-1)$이다. 증감표와 그래프에는 $(0,-1)$, 극대점 $(1,4)$, 극소점 $(2,3)$, 끝점 $(3,8)$을 표시하면 된다.
- **해설 경로·판정 이유·계산 검산:** 도함수 $6(x-1)(x-2)$의 부호 변화로 극대 (1,4)와 극소 (2,3); 끝점 $(0,-1),(3,8)$을 비교해 최댓값 8이다. 원본 요구 그래프/증감표의 도안 렌더는 별도 미검수다.
- 그림 증거: 원본 문제 PNG 별도 연결 없음. `assets/images/23_매산여고_2학기_기말_고2_수학II/q21-solution-v2.svg` (solutionImage SVG/학생 화면 렌더 NOT_RUN).
- 판정: **KEEP** / SOURCE_READ_EVIDENCED / SOURCE_PNG_NOT_APPLICABLE / RELEASE_QA_NOT_RUN.


## Q22 — KEEP

- source ordinal: 22; id: `22`; sourceQid: `NOT_PRESENT`; source blob: `c58324b0757262006e8f27ef3158c96244f938a3`.
- 과정 표기: `수학II`; 문항 분류: `적분방정식`.
- 원본 문제 조건·보기 (출처 JS 필드 보존):

```text
[주관식4 (서술형)] [7점] (부분점수 있음)<br>미분가능한 함수 $f(x)$가 $\displaystyle\int_2^x(x-t)f(t)dt=x^3+ax^2-8x+12$를 만족시킬 때, $f(2)$의 값을 구하여라.
원본 보기: []
```

- 원본 정답: `10`.
- 기존 solution 실제 발췌 (원문에서 추출, 자의적 변형 없음):
> [키포인트] 먼저 $x=2$를 대입하여 상수 $a$를 정하고, 양변을 두 번 미분한다.
> $x=2$를 대입하면 왼쪽은 $0$이므로 $0=8+4a-16+12=4a+4$이다. 따라서 $a=-1$이다.
- **해설 경로·판정 이유·계산 검산:** $x=2$ 대입에서 $a=-1$, 적분 양변을 두 번 미분하면 $f(x)=6x-2$, $f(2)=10$이다.
- 그림 증거: 원본 문제 PNG 별도 연결 없음. `assets/images/23_매산여고_2학기_기말_고2_수학II/q22-solution.svg` (solutionImage SVG/학생 화면 렌더 NOT_RUN).
- 판정: **KEEP** / SOURCE_READ_EVIDENCED / SOURCE_PNG_NOT_APPLICABLE / RELEASE_QA_NOT_RUN.


## Q23 — KEEP

- source ordinal: 23; id: `23`; sourceQid: `NOT_PRESENT`; source blob: `c58324b0757262006e8f27ef3158c96244f938a3`.
- 과정 표기: `수학II`; 문항 분류: `도함수의 대칭성과 극값`.
- 원본 문제 조건·보기 (출처 JS 필드 보존):

```text
[주관식5 (서술형)] [7점] (부분점수 있음)<br>최고차항의 계수가 $1$인 삼차함수 $f(x)$가 다음 조건을 만족시킨다.<div class="question-note-box">&lt;조건&gt;<br>(가) $a\gt -2$인 상수 $a$에 대하여 $\displaystyle\lim_{x\to0}\dfrac1x\int_a^{x+a}f'(t)dt=0$<br>(나) 모든 실수 $x$에 대하여 $f'(-2+x)=f'(-2-x)$이다.<br>(다) 함수 $f(x)$의 극솟값은 $-8$이다.</div>$f(0)=0$일 때, 함수 $f(x)$의 극댓값을 구하여라.
원본 보기: []
```

- 원본 정답: `100`.
- 기존 solution 실제 발췌 (원문에서 추출, 자의적 변형 없음):
> [키포인트] 조건 (나)로 도함수의 대칭축을 정하고, 조건 (가)로 $-2$보다 큰 임계점이 존재함을 확인한 뒤 두 임계점을 대칭적으로 표현한다.
> $f'(x)=3x^2+2bx+c$이고 조건 (나)에 의해 이 이차함수의 대칭축은 $x=-2$이다. 따라서 $-\dfrac{b}{3}=-2$이므로 $b=6$이다.
- **해설 경로·판정 이유·계산 검산:** 도함수의 대칭축 -2에서 임계점 -2±p; $f(0)=0$과 극솟값 -8로 $p=3$, 왼쪽 극대 $f(-5)=100$이다.
- 그림 증거: 원본 문제 PNG 별도 연결 없음. `assets/images/23_매산여고_2학기_기말_고2_수학II/q23-solution.svg` (solutionImage SVG/학생 화면 렌더 NOT_RUN).
- 판정: **KEEP** / SOURCE_READ_EVIDENCED / SOURCE_PNG_NOT_APPLICABLE / RELEASE_QA_NOT_RUN.


## 감사 종료 및 인계

- source read: **23/23**; KEEP 23, UPGRADE 0, HOLD 0, UNREAD 0. 학생용 완성 대체 해설: 0문항.
- 원본 PNG 직접 판독: **1개 / 1개**; solutionImage SVG 검수: **NOT_RUN**.
- 다음 작업: Golden/Negative 독립 샘플, preflight 영수증·샘플 학생 화면 렌더, 수정 적용 승인 및 운영 출고 절차. 이 문서 자체가 배포 승인이나 원본 변경을 뜻하지 않는다.
