# 미적분Ⅰ(구 수학Ⅱ) 심층 감사 — 23_강남여고_2학기_기말_고2_수학II

- 원본 범위: 2023년 고2 2학기 기말, `standardCourse: 수학II` (현행 작업 라인 명칭: 미적분Ⅰ).
- 원본 JS: `archive/exams/original/high/h2/2final/23_강남여고_2학기_기말_고2_수학II.js`; ref `main`, GitHub blob `0bd8f7e060816325ddf70c90754b61366bc6a89f`.
- 문항 분모: **25**; 판정 **KEEP 25 / UPGRADE 0 / HOLD 0 / UNREAD 0**.
- 작업 브랜치: `work/solution-upgrade-lane-10-20261121`, 감사 문서: `docs/operations/solution-upgrade-reservations/staged/calculus1/23_강남여고_2학기_기말_고2_수학II_DEEP_AUDIT.md`.
- 원본 문제 PNG: 해당 시험지의 파일 5개를 GitHub 바이너리에서 직접 열어 판독함. 원본 JS에 없는 별도 그림은 임의로 만들지 않음. SVG solutionImage 렌더·학생 화면 독립 검수는 **NOT_RUN**.
- 범위·절차: 모든 25문항의 원본 발문·보기·정답·기존 solution을 읽고, 계산 근거를 문항별로 작성. 공유 점유 조회/claim은 사용자 지시로 생략. 자동 preflight receipt, Golden/Negative, 최종 출고 QA는 **NOT_RUN**.
- 현재 단계: **EXAM_AUDIT_COMPLETE / EXAM_DRAFT_COMPLETE / RELEASE_QA_NOT_RUN**. 수학적 반례·정답 불일치는 발견되지 않아 현재 문서상 KEEP만 분류함. 운영 JS·정답·보기·SVG·main은 수정하지 않음.

## Q01 — KEEP

- source ordinal: 1; id: `1`; sourceQid: `1`; source blob: `0bd8f7e060816325ddf70c90754b61366bc6a89f`.
- 과정 표기: `수학II`; 문항 분류: `도함수`.
- 원본 문제 조건·보기 (출처 JS 필드 보존):

```text
1. 함수 $f(x)=x^3+4x^2-2$에 대하여 $f'(-1)$의 값은? [3.0점]
원본 보기: ["$-1$","$-2$","$-3$","$-4$","$-5$"]
```

- 원본 정답: `⑤`.
- 기존 solution 실제 발췌 (원문에서 추출, 자의적 변형 없음):
> 다항함수는 각 항을 미분하므로 $f'(x)=3x^2+8x$이다. 상수항 $-2$의 도함수는 $0$이다.
> 보기 ①~④의 $-1,-2,-3,-4$는 이 계산 결과와 다르다. 따라서 정답은 ⑤이다.
- **해설 경로·판정 이유·계산 검산:** $f'(x)=3x^2+8x$에서 $f'(-1)=3-8=-5$로 보기 ⑤가 일치한다.
- 그림 증거: 원본 문제 PNG 별도 연결 없음. solutionImage 없음.
- 판정: **KEEP** / SOURCE_READ_EVIDENCED / SOURCE_PNG_NOT_APPLICABLE / RELEASE_QA_NOT_RUN.


## Q02 — KEEP

- source ordinal: 2; id: `2`; sourceQid: `2`; source blob: `0bd8f7e060816325ddf70c90754b61366bc6a89f`.
- 과정 표기: `수학II`; 문항 분류: `미분계수`.
- 원본 문제 조건·보기 (출처 JS 필드 보존):

```text
2. 함수 $f(x)$에 대하여 $f'(1)=2$일 때, $\lim_{h \to 0} \frac{f(1+4h)-f(1)}{h}$의 값은? [3.0점]
원본 보기: ["$\\frac{1}{2}$","$2$","$4$","$8$","$10$"]
```

- 원본 정답: `④`.
- 기존 solution 실제 발췌 (원문에서 추출, 자의적 변형 없음):
> 미분계수 $f'(1)=2$는 입력 변화량으로 나눈 극한이다. 이 문제에서는 입력 변화량이 $4h$이므로 분모에도 $4h$를 만들어야 한다.
> ①~③, ⑤는 $8$과 다르므로 정답은 ④이다.
- **해설 경로·판정 이유·계산 검산:** 차분몫 분모를 $4h$로 맞추면 $4f'(1)=8$이며 ④가 맞다.
- 그림 증거: 원본 문제 PNG 별도 연결 없음. solutionImage 없음.
- 판정: **KEEP** / SOURCE_READ_EVIDENCED / SOURCE_PNG_NOT_APPLICABLE / RELEASE_QA_NOT_RUN.


## Q03 — KEEP

- source ordinal: 3; id: `3`; sourceQid: `3`; source blob: `0bd8f7e060816325ddf70c90754b61366bc6a89f`.
- 과정 표기: `수학II`; 문항 분류: `평균값 정리 기초`.
- 원본 문제 조건·보기 (출처 JS 필드 보존):

```text
3. 함수 $f(x)=x^2+4x-21$에 대하여 구간 $[-7, 3]$에서 롤의 정리를 만족시키는 상수 $c$의 값은? [3.0점]
원본 보기: ["$-2$","$-1$","$0$","$1$","$2$"]
```

- 원본 정답: `①`.
- 기존 solution 실제 발췌 (원문에서 추출, 자의적 변형 없음):
> 롤의 정리를 쓰기 전에 양 끝 함숫값이 같은지 확인한다.
> ⑤ 2는 f′(2)=8로 0이 아니다.
- **해설 경로·판정 이유·계산 검산:** $f(-7)=f(3)=0$과 $f'(c)=2c+4=0$에서 $c=-2$; 롤 조건의 열린구간도 만족한다.
- 그림 증거: 원본 문제 PNG 별도 연결 없음. `assets/images/23_강남여고_2학기_기말_고2_수학II/q3-solution.svg` (solutionImage SVG/학생 화면 렌더 NOT_RUN).
- 판정: **KEEP** / SOURCE_READ_EVIDENCED / SOURCE_PNG_NOT_APPLICABLE / RELEASE_QA_NOT_RUN.


## Q04 — KEEP

- source ordinal: 4; id: `4`; sourceQid: `4`; source blob: `0bd8f7e060816325ddf70c90754b61366bc6a89f`.
- 과정 표기: `수학II`; 문항 분류: `평균값 정리 기초`.
- 원본 문제 조건·보기 (출처 JS 필드 보존):

```text
4. 함수 $f(x)=x^2+3x$에 대하여 닫힌구간 $[0, 2]$에서 평균값 정리를 만족시키는 실수 $c$의 값은? [3.5점]
원본 보기: ["$\\frac{1}{2}$","$1$","$\\frac{3}{2}$","$2$","$\\frac{5}{2}$"]
```

- 원본 정답: `②`.
- 기존 solution 실제 발췌 (원문에서 추출, 자의적 변형 없음):
> 평균값 정리의 구간은 $[0,2]$이고 다항함수이므로 연속·미분가능하다.
> ⑤ 5/2는 구간 밖이다.
- **해설 경로·판정 이유·계산 검산:** 평균변화율 $(10-0)/2=5$와 $f'(c)=2c+3$을 맞추면 $c=1$이다.
- 그림 증거: 원본 문제 PNG 별도 연결 없음. `assets/images/23_강남여고_2학기_기말_고2_수학II/q4-solution.svg` (solutionImage SVG/학생 화면 렌더 NOT_RUN).
- 판정: **KEEP** / SOURCE_READ_EVIDENCED / SOURCE_PNG_NOT_APPLICABLE / RELEASE_QA_NOT_RUN.


## Q05 — KEEP

- source ordinal: 5; id: `5`; sourceQid: `5`; source blob: `0bd8f7e060816325ddf70c90754b61366bc6a89f`.
- 과정 표기: `수학II`; 문항 분류: `정적분의 뜻`.
- 원본 문제 조건·보기 (출처 JS 필드 보존):

```text
5. $\int_1^5 (2x+7)dx$의 값은? [3.5점]
원본 보기: ["$50$","$51$","$52$","$53$","$54$"]
```

- 원본 정답: `③`.
- 기존 solution 실제 발췌 (원문에서 추출, 자의적 변형 없음):
> 먼저 피적분함수 $2x+7$의 원시함수를 구하면 $x^2+7x$이다. 정적분은 상한 대입값에서 하한 대입값을 빼는 것이므로
> 선택지에서 $52$는 ③ 하나이므로 정답은 ③이다.
- **해설 경로·판정 이유·계산 검산:** 원시함수 $x^2+7x$의 끝점 차 $60-8=52$를 검산했다.
- 그림 증거: 원본 문제 PNG 별도 연결 없음. solutionImage 없음.
- 판정: **KEEP** / SOURCE_READ_EVIDENCED / SOURCE_PNG_NOT_APPLICABLE / RELEASE_QA_NOT_RUN.


## Q06 — KEEP

- source ordinal: 6; id: `6`; sourceQid: `6`; source blob: `0bd8f7e060816325ddf70c90754b61366bc6a89f`.
- 과정 표기: `수학II`; 문항 분류: `속도와 가속도`.
- 원본 문제 조건·보기 (출처 JS 필드 보존):

```text
6. 수직선 위를 움직이는 점 $\mathrm{P}$의 시각 $t$에서 위치 $x$가
$x=-2t^3+9t^2$
일 때, 점 $\mathrm{P}$가 운동 방향을 바꾸는 시각은? [3.5점]
원본 보기: ["$2$","$3$","$4$","$5$","$6$"]
```

- 원본 정답: `②`.
- 기존 solution 실제 발췌 (원문에서 추출, 자의적 변형 없음):
> 운동 방향은 속도 $v(t)=x'(t)$의 부호로 판단한다.
> ⑤ 6은 속도의 영점이 아니다.
- **해설 경로·판정 이유·계산 검산:** 속도 $-6t(t-3)$가 양에서 음으로 바뀌는 유일한 출발 후 시각은 $t=3$이다.
- 그림 증거: 원본 문제 PNG 별도 연결 없음. `assets/images/23_강남여고_2학기_기말_고2_수학II/q6-solution.svg` (solutionImage SVG/학생 화면 렌더 NOT_RUN).
- 판정: **KEEP** / SOURCE_READ_EVIDENCED / SOURCE_PNG_NOT_APPLICABLE / RELEASE_QA_NOT_RUN.


## Q07 — KEEP

- source ordinal: 7; id: `7`; sourceQid: `7`; source blob: `0bd8f7e060816325ddf70c90754b61366bc6a89f`.
- 과정 표기: `수학II`; 문항 분류: `증가·감소와 극값`.
- 원본 문제 조건·보기 (출처 JS 필드 보존):

```text
7. 열린구간 $(-3, 3)$에서 연속인 함수 $f(x)$의 도함수 $y=f'(x)$의 그래프가 다음 그림과 같다. 함수 $f(x)$가 $x=a$에서 극대이고 $x=b$에서 극소일 때, $a+b$의 값은? [3.5점]
(단, $-3 < a < 3$, $-3 < b < 3$)
원본 보기: ["$1$","$2$","$0$","$-1$","$-2$"]
```

- 원본 정답: `④`.
- 기존 solution 실제 발췌 (원문에서 추출, 자의적 변형 없음):
> 도함수의 부호는 원래 함수가 증가하는지 감소하는지를 알려 준다. $f'(x)>0$인 구간에서는 $f$가 증가하고, $f'(x)<0$인 구간에서는 감소한다.
> 따라서 $x=-2$에서 $f$는 증가하다 감소하므로 극댓값을 갖는다. 즉 $a=-2$이다.
- **해설 경로·판정 이유·계산 검산:** 원본 PNG에서 $-2$는 도함수 $+\to-$, $1$은 (도함수 미정의이나 $f$ 연속하에) $-\to+$, $0,2$는 부호 유지임을 직접 확인; 합은 $-1$이다.
- 그림 증거:  `assets/images/23_강남여고_2학기_기말_고2_수학II/q7.png` (원본 PNG를 GitHub에서 실제 열어 보고 좌표·부호·도형 조건 판독 완료). `assets/images/23_강남여고_2학기_기말_고2_수학II/q7-solution.svg` (solutionImage SVG/학생 화면 렌더 NOT_RUN).
- 판정: **KEEP** / SOURCE_READ_EVIDENCED / SOURCE_PNG_VISUALLY_READ / RELEASE_QA_NOT_RUN.


## Q08 — KEEP

- source ordinal: 8; id: `8`; sourceQid: `8`; source blob: `0bd8f7e060816325ddf70c90754b61366bc6a89f`.
- 과정 표기: `수학II`; 문항 분류: `접선`.
- 원본 문제 조건·보기 (출처 JS 필드 보존):

```text
8. 곡선 $y=x^2+ax+b$ 위의 점 $(2, 3)$에서 접하는 접선의 기울기가 $6$일 때, 상수 $a, b$에 대하여 $a+b$의 값은? [3.5점]
원본 보기: ["$-1$","$-2$","$-3$","$-4$","$-5$"]
```

- 원본 정답: `③`.
- 기존 solution 실제 발췌 (원문에서 추출, 자의적 변형 없음):
> 점 $(2,3)$에서의 접선 기울기는 $f'(2)$이다. $f(x)=x^2+ax+b$를 미분하면 $f'(x)=2x+a$이므로
> $4+a=6$, 따라서 $a=2$이다.
- **해설 경로·판정 이유·계산 검산:** 접선 조건 $f'(2)=4+a=6$으로 $a=2$, 지나가는 점에서 $b=-5$여서 합 $-3$이다.
- 그림 증거: 원본 문제 PNG 별도 연결 없음. `assets/images/23_강남여고_2학기_기말_고2_수학II/q8-solution.svg` (solutionImage SVG/학생 화면 렌더 NOT_RUN).
- 판정: **KEEP** / SOURCE_READ_EVIDENCED / SOURCE_PNG_NOT_APPLICABLE / RELEASE_QA_NOT_RUN.


## Q09 — KEEP

- source ordinal: 9; id: `9`; sourceQid: `9`; source blob: `0bd8f7e060816325ddf70c90754b61366bc6a89f`.
- 과정 표기: `수학II`; 문항 분류: `정적분의 성질`.
- 원본 문제 조건·보기 (출처 JS 필드 보존):

```text
9. $\int_{-a}^a (-2x+4)dx=16$을 만족시키는 실수 $a$의 값은? [3.5점]
원본 보기: ["$2$","$3$","$4$","$5$","$6$"]
```

- 원본 정답: `①`.
- 기존 solution 실제 발췌 (원문에서 추출, 자의적 변형 없음):
> 정적분은 상한이 하한보다 작아도 부호를 포함하여 계산한다. 따라서 $a$가 실수라는 조건에서 처음부터 $a>0$이라고 가정할 필요가 없다.
> 따라서 주어진 등식은 $8a=16$이고, 양변을 $8$로 나누면 $a=2$이다.
- **해설 경로·판정 이유·계산 검산:** 홀부분 $-2x$의 대칭구간 적분은 $0$, 상수부 $4$는 $8a$이므로 $a=2$이다.
- 그림 증거: 원본 문제 PNG 별도 연결 없음. `assets/images/23_강남여고_2학기_기말_고2_수학II/q9-solution.svg` (solutionImage SVG/학생 화면 렌더 NOT_RUN).
- 판정: **KEEP** / SOURCE_READ_EVIDENCED / SOURCE_PNG_NOT_APPLICABLE / RELEASE_QA_NOT_RUN.


## Q10 — KEEP

- source ordinal: 10; id: `10`; sourceQid: `10`; source blob: `0bd8f7e060816325ddf70c90754b61366bc6a89f`.
- 과정 표기: `수학II`; 문항 분류: `증가·감소와 극값`.
- 원본 문제 조건·보기 (출처 JS 필드 보존):

```text
10. 함수 $f(x)=x^3-3x^2-9x+a$의 극댓값이 $12$일 때, 함수 $f(x)$의 극솟값은? (단, $a$는 상수이다.) [4.0점]
원본 보기: ["$-8$","$-12$","$-16$","$-20$","$-24$"]
```

- 원본 정답: `④`.
- 기존 solution 실제 발췌 (원문에서 추출, 자의적 변형 없음):
> 극댓값이 주어졌으므로 먼저 극대가 일어나는 $x$를 도함수의 부호로 결정한다.
> $x<-1$에서는 $f'(x)>0$, $-1<x<3$에서는 $f'(x)<0$, $x>3$에서는 $f'(x)>0$이다. 따라서 $x=-1$에서 극대, $x=3$에서 극소이다.
- **해설 경로·판정 이유·계산 검산:** 임계점 $-1,3$의 도함수 부호와 $f(-1)=5+a=12$를 확인해 $a=7$, $f(3)=-20$이다.
- 그림 증거: 원본 문제 PNG 별도 연결 없음. `assets/images/23_강남여고_2학기_기말_고2_수학II/q10-solution.svg` (solutionImage SVG/학생 화면 렌더 NOT_RUN).
- 판정: **KEEP** / SOURCE_READ_EVIDENCED / SOURCE_PNG_NOT_APPLICABLE / RELEASE_QA_NOT_RUN.


## Q11 — KEEP

- source ordinal: 11; id: `11`; sourceQid: `11`; source blob: `0bd8f7e060816325ddf70c90754b61366bc6a89f`.
- 과정 표기: `수학II`; 문항 분류: `증가·감소와 극값`.
- 원본 문제 조건·보기 (출처 JS 필드 보존):

```text
11. 실수 전체의 집합에서 정의된 함수 $f(x)=x^3+x^2-ax+1$의 역함수가 존재하도록 하는 실수 $a$의 최댓값은? [4.0점]
원본 보기: ["$-\\frac{1}{2}$","$-\\frac{1}{3}$","$-\\frac{1}{4}$","$-\\frac{1}{5}$","$-\\frac{1}{6}$"]
```

- 원본 정답: `②`.
- 기존 solution 실제 발췌 (원문에서 추출, 자의적 변형 없음):
> 실수 전체에서 역함수가 존재하려면 서로 다른 두 입력값이 같은 함숫값을 가져서는 안 된다. 즉 $f$가 일대일함수여야 한다.
> 제곱항은 항상 $0$ 이상이고 $x=-\frac13$에서 $0$이 된다. 따라서 도함수의 최솟값은 $-\frac13-a$이다.
- **해설 경로·판정 이유·계산 검산:** 도함수 완전제곱 $3(x+1/3)^2-1/3-a$가 전구간 비음수인 최대 경계 $a=-1/3$을 확인했다.
- 그림 증거: 원본 문제 PNG 별도 연결 없음. `assets/images/23_강남여고_2학기_기말_고2_수학II/q11-solution.svg` (solutionImage SVG/학생 화면 렌더 NOT_RUN).
- 판정: **KEEP** / SOURCE_READ_EVIDENCED / SOURCE_PNG_NOT_APPLICABLE / RELEASE_QA_NOT_RUN.


## Q12 — KEEP

- source ordinal: 12; id: `12`; sourceQid: `12`; source blob: `0bd8f7e060816325ddf70c90754b61366bc6a89f`.
- 과정 표기: `수학II`; 문항 분류: `넓이`.
- 원본 문제 조건·보기 (출처 JS 필드 보존):

```text
12. 다음 그림과 같이 곡선 $y=f(x)$에 대하여
$A = \int_{-3}^1 |f(x)|dx = 3$, $B = \int_1^4 |f(x)|dx = 2$
이 성립할 때, $\int_{-3}^4 \{f(x)+2x\}dx$의 값은? [4.0점]
원본 보기: ["$5$","$6$","$7$","$8$","$9$"]
```

- 원본 정답: `②`.
- 기존 solution 실제 발췌 (원문에서 추출, 자의적 변형 없음):
> 그림에서 $-3<x<1$ 구간의 $f(x)$는 $x$축 아래에 있으므로 $\int_{-3}^{1}f(x)\,dx=-A=-3$이다. $1<x<4$에서는 $x$축 위이므로 $\int_1^4 f(x)\,dx=B=2$이다.
> 따라서 $\int_{-3}^4f(x)\,dx=-3+2=-1$이다.
- **해설 경로·판정 이유·계산 검산:** 원본 PNG는 $[-3,1]$에서 음, $[1,4]$에서 양이며 부호 있는 $f$ 적분은 $-3+2=-1$; $2x$ 적분 7을 더하면 6이다.
- 그림 증거:  `assets/images/23_강남여고_2학기_기말_고2_수학II/q12.png` (원본 PNG를 GitHub에서 실제 열어 보고 좌표·부호·도형 조건 판독 완료). `assets/images/23_강남여고_2학기_기말_고2_수학II/q12-solution.svg` (solutionImage SVG/학생 화면 렌더 NOT_RUN).
- 판정: **KEEP** / SOURCE_READ_EVIDENCED / SOURCE_PNG_VISUALLY_READ / RELEASE_QA_NOT_RUN.


## Q13 — KEEP

- source ordinal: 13; id: `13`; sourceQid: `13`; source blob: `0bd8f7e060816325ddf70c90754b61366bc6a89f`.
- 과정 표기: `수학II`; 문항 분류: `방정식과 부등식`.
- 원본 문제 조건·보기 (출처 JS 필드 보존):

```text
13. 함수 $f(x)=x^3-12x-1$일 때, 함수 $y=|f(x)|$의 그래프와 직선 $y=a$가 서로 다른 세 점에서만 만날 때의 양수 $a$의 값은? [4.0점]
원본 보기: ["$14$","$15$","$16$","$17$","$18$"]
```

- 원본 정답: `④`.
- 기존 solution 실제 발췌 (원문에서 추출, 자의적 변형 없음):
> $a>0$이므로 $|f(x)|=a$는 두 방정식 $f(x)=a$, $f(x)=-a$를 합쳐서 생각할 수 있다. 두 식을 동시에 만족하는 $x$는 없으므로 서로 다른 실근 수를 더하면 된다.
> 따라서 서로 다른 교점이 정확히 세 개인 양수는 $a=17$뿐이며 정답은 ④이다.
- **해설 경로·판정 이유·계산 검산:** 극댓값 $15$, 극솟값 $-17$에서 높이 $\pm17$의 수평선 교점은 $1+2=3$개로 계산된다.
- 그림 증거: 원본 문제 PNG 별도 연결 없음. `assets/images/23_강남여고_2학기_기말_고2_수학II/q13-solution.svg` (solutionImage SVG/학생 화면 렌더 NOT_RUN).
- 판정: **KEEP** / SOURCE_READ_EVIDENCED / SOURCE_PNG_NOT_APPLICABLE / RELEASE_QA_NOT_RUN.


## Q14 — KEEP

- source ordinal: 14; id: `14`; sourceQid: `14`; source blob: `0bd8f7e060816325ddf70c90754b61366bc6a89f`.
- 과정 표기: `수학II`; 문항 분류: `최대·최소`.
- 원본 문제 조건·보기 (출처 JS 필드 보존):

```text
14. 다음 그림과 같이 한 변의 길이가 $12\mathrm{cm}$인 정사각형 모양의 종이의 네 귀퉁이에서 같은 크기의 정사각형을 잘라 내고 남은 부분을 접어서 뚜껑이 없는 직육면체 모양의 상자를 만들려고 한다. 상자의 부피의 최댓값은? [4.0점]
원본 보기: ["$124$","$126$","$128$","$130$","$132$"]
```

- 원본 정답: `③`.
- 기존 solution 실제 발췌 (원문에서 추출, 자의적 변형 없음):
> 네 귀퉁이에서 잘라낼 정사각형의 한 변을 $x$ cm라고 두면 상자의 높이는 $x$, 밑면의 한 변은 $12-2x$이다. 실제 상자가 되려면 $0<x<6$이다.
> 따라서 $x=2$에서 최대이며 $V(2)=2(12-4)^2=2\cdot64=128\,(\mathrm{cm}^3)$이다.
- **해설 경로·판정 이유·계산 검산:** 원본 12cm 정사각형 PNG의 네 귀퉁이 절취 구조 확인; 부피 $x(12-2x)^2$는 $x=2$에서 128로 최대다.
- 그림 증거:  `assets/images/23_강남여고_2학기_기말_고2_수학II/q14.png` (원본 PNG를 GitHub에서 실제 열어 보고 좌표·부호·도형 조건 판독 완료). `assets/images/23_강남여고_2학기_기말_고2_수학II/q14-solution.svg` (solutionImage SVG/학생 화면 렌더 NOT_RUN).
- 판정: **KEEP** / SOURCE_READ_EVIDENCED / SOURCE_PNG_VISUALLY_READ / RELEASE_QA_NOT_RUN.


## Q15 — KEEP

- source ordinal: 15; id: `15`; sourceQid: `15`; source blob: `0bd8f7e060816325ddf70c90754b61366bc6a89f`.
- 과정 표기: `수학II`; 문항 분류: `방정식과 부등식`.
- 원본 문제 조건·보기 (출처 JS 필드 보존):

```text
15. 두 함수
$f(x)=x^3-x+6$, $g(x)=x^2+a$
가 있다. $x \ge 0$인 모든 실수 $x$에 대하여 부등식
$f(x) \ge g(x)$
가 성립할 때, 실수 $a$의 최댓값은? [4.0점]
원본 보기: ["$5$","$6$","$7$","$8$","$9$"]
```

- 원본 정답: `①`.
- 기존 solution 실제 발췌 (원문에서 추출, 자의적 변형 없음):
> 모든 $x\ge0$에서 $f(x)\ge g(x)$라는 것은 $a\le f(x)-x^2$가 모든 $x\ge0$에 성립한다는 뜻이다.
> ⑤ a=9도 x=1에서 반례가 생긴다.
- **해설 경로·판정 이유·계산 검산:** $h=f-g=x^3-x^2-x+6$의 최소점 $x=1$에서 $h(1)=5$; $a=5$가 경계다.
- 그림 증거: 원본 문제 PNG 별도 연결 없음. `assets/images/23_강남여고_2학기_기말_고2_수학II/q15-solution.svg` (solutionImage SVG/학생 화면 렌더 NOT_RUN).
- 판정: **KEEP** / SOURCE_READ_EVIDENCED / SOURCE_PNG_NOT_APPLICABLE / RELEASE_QA_NOT_RUN.


## Q16 — KEEP

- source ordinal: 16; id: `16`; sourceQid: `16`; source blob: `0bd8f7e060816325ddf70c90754b61366bc6a89f`.
- 과정 표기: `수학II`; 문항 분류: `정적분과 함수`.
- 원본 문제 조건·보기 (출처 JS 필드 보존):

```text
16. 이차함수 $f(x)=x^2-(a+1)x+a$가
$\int_1^2 (x^2+x)f'(x)dx + \int_1^2 (2x+1)f(x)dx = -12$
를 만족시킬 때, $\int_1^a f(x)dx$의 값은? (단, $a$는 상수이다.) [4.0점]
원본 보기: ["$-\\frac{5}{2}$","$-3$","$-\\frac{7}{2}$","$-4$","$-\\frac{9}{2}$"]
```

- 원본 정답: `⑤`.
- 기존 solution 실제 발췌 (원문에서 추출, 자의적 변형 없음):
> 두 정적분의 피적분함수를 합쳐 보면 곱의 미분법과 같은 모양이다.
> 따라서 $6(2-a)-2\cdot0=-12$, 즉 $12-6a=-12$에서 $a=4$이다.
- **해설 경로·판정 이유·계산 검산:** 곱 미분 정적분은 $6f(2)-2f(1)=6(2-a)$이므로 $a=4$; 이후 $\int_1^4(x-1)(x-4)dx=-9/2$다.
- 그림 증거: 원본 문제 PNG 별도 연결 없음. `assets/images/23_강남여고_2학기_기말_고2_수학II/q16-solution.svg` (solutionImage SVG/학생 화면 렌더 NOT_RUN).
- 판정: **KEEP** / SOURCE_READ_EVIDENCED / SOURCE_PNG_NOT_APPLICABLE / RELEASE_QA_NOT_RUN.


## Q17 — KEEP

- source ordinal: 17; id: `17`; sourceQid: `17`; source blob: `0bd8f7e060816325ddf70c90754b61366bc6a89f`.
- 과정 표기: `수학II`; 문항 분류: `방정식과 부등식`.
- 원본 문제 조건·보기 (출처 JS 필드 보존):

```text
17. 자연수 $n$에 대하여 $x$에 대한 방정식
$x^3-3x+n-2=0$
의 서로 다른 실근의 개수를 $a_n$이라 할 때, $\sum_{n=1}^{10} a_n$의 값은? [4.0점]
원본 보기: ["$17$","$18$","$19$","$20$","$21$"]
```

- 원본 정답: `①`.
- 기존 solution 실제 발췌 (원문에서 추출, 자의적 변형 없음):
> 서로 다른 실근의 개수는 삼차함수의 극댓값과 극솟값이 $x$축을 기준으로 어느 쪽에 있는지에 따라 달라진다.
> $n$은 자연수이므로 $n>0$이다. $n=1,2,3$에서는 극댓값 $n>0$, 극솟값 $n-4<0$이어서 $x$축과 서로 다른 세 점에서 만난다. 따라서 $a_1=a_2=a_3=3$이다.
- **해설 경로·판정 이유·계산 검산:** $n=1,2,3$은 3근, $n=4$는 이중근 포함 서로 다른 2근, $n=5$부터 1근이므로 $9+2+6=17$이다.
- 그림 증거: 원본 문제 PNG 별도 연결 없음. `assets/images/23_강남여고_2학기_기말_고2_수학II/q17-solution.svg` (solutionImage SVG/학생 화면 렌더 NOT_RUN).
- 판정: **KEEP** / SOURCE_READ_EVIDENCED / SOURCE_PNG_NOT_APPLICABLE / RELEASE_QA_NOT_RUN.


## Q18 — KEEP

- source ordinal: 18; id: `18`; sourceQid: `18`; source blob: `0bd8f7e060816325ddf70c90754b61366bc6a89f`.
- 과정 표기: `수학II`; 문항 분류: `넓이`.
- 원본 문제 조건·보기 (출처 JS 필드 보존):

```text
18. 다음 그림과 같이 함수 $f(x)=x^3-x$에 대하여 구간 $[0, 1]$에서 곡선 $y=f(x)$와 $x$축으로 둘러싸인 부분의 넓이를 $S_1$이라 하고, 구간 $[1, a]$에서 곡선 $y=f(x)$와 $x$축 및 직선 $x=a$로 둘러싸인 부분의 넓이를 $S_2$라 하자. $4S_1 = S_2$를 만족시키는 $1$보다 큰 상수 $a$의 값은? [4.5점]
원본 보기: ["$\\sqrt{2}$","$\\sqrt{3}$","$2$","$\\sqrt{5}$","$\\sqrt{6}$"]
```

- 원본 정답: `②`.
- 기존 solution 실제 발췌 (원문에서 추출, 자의적 변형 없음):
> $0<x<1$에서 $f(x)=x^3-x<0$이므로
> $4S_1=S_2$에서 $1=(a^2-1)^2/4$, 따라서 $(a^2-1)^2=4$이다. $a>1$이므로 $a^2-1>0$, $a^2-1=2$, $a=\sqrt3$이다.
- **해설 경로·판정 이유·계산 검산:** 원본 PNG에서 $[0,1]$은 아래 넓이, $[1,a]$는 위 넓이임을 확인; $S_1=1/4$, $S_2=(a^2-1)^2/4$, $a=\sqrt3$이다.
- 그림 증거:  `assets/images/23_강남여고_2학기_기말_고2_수학II/q18.png` (원본 PNG를 GitHub에서 실제 열어 보고 좌표·부호·도형 조건 판독 완료). `assets/images/23_강남여고_2학기_기말_고2_수학II/q18-solution.svg` (solutionImage SVG/학생 화면 렌더 NOT_RUN).
- 판정: **KEEP** / SOURCE_READ_EVIDENCED / SOURCE_PNG_VISUALLY_READ / RELEASE_QA_NOT_RUN.


## Q19 — KEEP

- source ordinal: 19; id: `19`; sourceQid: `19`; source blob: `0bd8f7e060816325ddf70c90754b61366bc6a89f`.
- 과정 표기: `수학II`; 문항 분류: `정적분과 함수`.
- 원본 문제 조건·보기 (출처 JS 필드 보존):

```text
19. 함수 $f(x) = \begin{cases} 2x(3-x) & (x < 3) \\ x-3 & (x \ge 3) \end{cases}$에 대하여 함수 $F(x)$를
$F(x) = \int_1^x f(t)dt$
로 정의할 때, 다음 보기 중 항상 옳은 것만을 있는 대로 고른 것은? [4.5점]

<보기>
(가) $F(-1) = \frac{4}{3}$
(나) 함수 $F(x)$의 극솟값은 양수이다.
(다) $\int_{-1}^1 F(x)dx = -\frac{8}{3}$
원본 보기: ["(가)","(가), (나)","(가), (다)","(나), (다)","(가), (나), (다)"]
```

- 원본 정답: `③`.
- 기존 solution 실제 발췌 (원문에서 추출, 자의적 변형 없음):
> $F(x)=\displaystyle\int_1^x f(t)\,dt$이고 $f$는 $x=3$에서도 연속이므로 미적분의 기본정리에 따라 $F'(x)=f(x)$이다.
> (나) $x<0$에서는 $F'(x)=2x(3-x)<0$, $0<x<3$에서는 $F'(x)>0$이다. $x\ge3$에서는 $F'(x)=x-3\ge0$이다. 따라서 $F$는 $x=0$에서 극솟값을 가지며 $\displaystyle F(0)=-\frac73<0$이다. '극솟값이 양수'라는 문장은 거짓이다.
- **해설 경로·판정 이유·계산 검산:** 적분 미분 $F'=f$와 $F(0)=-7/3<0$으로 (나) 거짓; $F(-1)=4/3$과 $\int_{-1}^1F=-8/3$으로 (가),(다) 참이다.
- 그림 증거: 원본 문제 PNG 별도 연결 없음. `assets/images/23_강남여고_2학기_기말_고2_수학II/q19-solution.svg` (solutionImage SVG/학생 화면 렌더 NOT_RUN).
- 판정: **KEEP** / SOURCE_READ_EVIDENCED / SOURCE_PNG_NOT_APPLICABLE / RELEASE_QA_NOT_RUN.


## Q20 — KEEP

- source ordinal: 20; id: `20`; sourceQid: `20`; source blob: `0bd8f7e060816325ddf70c90754b61366bc6a89f`.
- 과정 표기: `수학II`; 문항 분류: `속도와 거리`.
- 원본 문제 조건·보기 (출처 JS 필드 보존):

```text
20. 일직선으로 움직이는 두 발사체 $\mathrm{A, B}$를 발사한 지 $t$초 후의 속도를 각각 초속 $v_A(t)\,\mathrm{km}$, 초속 $v_B(t)\,\mathrm{km}$라고 하면
$v_A(t) = \frac{1}{40}t^2$, $v_B(t) = at$ ($a$는 양수)
라고 할 때, 다음 조건에 따라 두 발사체 $\mathrm{A, B}$를 결합하려고 한다.

<조건>
(가) $\mathrm{A}$를 발사한 지 2초 후에 같은 지점에서 $\mathrm{B}$를 발사한다.
(나) 충격을 최소화하기 위해 결합하는 순간 $\mathrm{A, B}$의 속도를 같게 한다.

두 발사체 $\mathrm{A, B}$가 결합하는 시각은 발사체 $\mathrm{A}$가 발사된 지 $m$초 후일 때, $40(a+m)$의 값은? [4.5점]
원본 보기: ["$245$","$246$","$247$","$248$","$249$"]
```

- 원본 정답: `⑤`.
- 기존 solution 실제 발췌 (원문에서 추출, 자의적 변형 없음):
> 두 발사체의 출발 시각이 다르므로 먼저 시간을 구별해야 한다. A가 발사된 순간을 전체 시각 $t=0$으로 두면, B는 전체 시각 $t=2$에 같은 출발점에서 출발한다. 따라서 결합 시각 $m$에서는 A의 운동 시간이 $m$초, B의 운동 시간은 $m-2$초이며 $m>2$이다.
- **해설 경로·판정 이유·계산 검산:** B의 발사 후 시간 $u=t-2$로 시계 기준을 분리한다. 위치·순간속도 조건을 연립하면 $m=6,a=9/40$, 즉 249다.
- 그림 증거: 원본 문제 PNG 별도 연결 없음. `assets/images/23_강남여고_2학기_기말_고2_수학II/q20-solution.svg` (solutionImage SVG/학생 화면 렌더 NOT_RUN).
- 판정: **KEEP** / SOURCE_READ_EVIDENCED / SOURCE_PNG_NOT_APPLICABLE / RELEASE_QA_NOT_RUN.


## Q21 — KEEP

- source ordinal: 21; id: `21`; sourceQid: `21`; source blob: `0bd8f7e060816325ddf70c90754b61366bc6a89f`.
- 과정 표기: `수학II`; 문항 분류: `정적분의 성질`.
- 원본 문제 조건·보기 (출처 JS 필드 보존):

```text
21. 실수 전체의 집합에서 연속인 함수 $f(x)$가 다음 조건을 만족시킬 때, $\int_{-3}^5 \{4x+f(x)\}dx$의 값은? [4.5점]

<조건>
(가) 모든 실수 $x$에 대하여 $f(x)+f(-x)=0$이다.
(나) $\int_{-2}^3 f(x)dx = 6$
(다) $\int_{-5}^{-2} f(x)dx = -20$
원본 보기: ["$46$","$47$","$48$","$49$","$50$"]
```

- 원본 정답: `①`.
- 기존 solution 실제 발췌 (원문에서 추출, 자의적 변형 없음):
> (가)에서 $f(-x)=-f(x)$이므로 $f$는 홀함수이다. 홀함수를 원점에 대칭인 구간에서 적분하면 양쪽 넓이가 부호를 달리하여 상쇄된다.
> 따라서 $\displaystyle\int_{-2}^{2}f(x)\,dx=0$, $\displaystyle\int_{-3}^{3}f(x)\,dx=0$이다.
- **해설 경로·판정 이유·계산 검산:** $f$가 홀함수이므로 $\int_{-3}^3 f=0$, $\int_3^5 f=20-6=14$; $\int_{-3}^5 4x=32$로 합 46이다.
- 그림 증거: 원본 문제 PNG 별도 연결 없음. `assets/images/23_강남여고_2학기_기말_고2_수학II/q21-solution.svg` (solutionImage SVG/학생 화면 렌더 NOT_RUN).
- 판정: **KEEP** / SOURCE_READ_EVIDENCED / SOURCE_PNG_NOT_APPLICABLE / RELEASE_QA_NOT_RUN.


## Q22 — KEEP

- source ordinal: 22; id: `22`; sourceQid: `22`; source blob: `0bd8f7e060816325ddf70c90754b61366bc6a89f`.
- 과정 표기: `수학II`; 문항 분류: `정적분과 함수`.
- 원본 문제 조건·보기 (출처 JS 필드 보존):

```text
서술형 1. 임의의 실수 $x$에 대하여
$\int_a^x f(t)dt = 2x^2-8x+6$
을 만족시키는 연속함수 $f(x)$에 대하여 $f(4)+a$의 값을 구하시오. (단, $a>1$) [5.0점]
원본 보기: []
```

- 원본 정답: `11`.
- 기존 solution 실제 발췌 (원문에서 추출, 자의적 변형 없음):
> 정적분의 하한과 상한이 같으면 값은 $0$이므로 먼저 $x=a$를 대입한다.
> $f(4)=16-8=8$이므로 $f(4)+a=8+3=11$이다.
- **해설 경로·판정 이유·계산 검산:** 하한에서 $2a^2-8a+6=0$과 $a>1$로 $a=3$; 미분하면 $f(4)=8$, 합 11이다.
- 그림 증거: 원본 문제 PNG 별도 연결 없음. `assets/images/23_강남여고_2학기_기말_고2_수학II/q22-solution.svg` (solutionImage SVG/학생 화면 렌더 NOT_RUN).
- 판정: **KEEP** / SOURCE_READ_EVIDENCED / SOURCE_PNG_NOT_APPLICABLE / RELEASE_QA_NOT_RUN.


## Q23 — KEEP

- source ordinal: 23; id: `23`; sourceQid: `23`; source blob: `0bd8f7e060816325ddf70c90754b61366bc6a89f`.
- 과정 표기: `수학II`; 문항 분류: `속도와 가속도`.
- 원본 문제 조건·보기 (출처 JS 필드 보존):

```text
서술형 2. 수직선 위를 움직이는 두 점 $\mathrm{P, Q}$의 시각 $t$에서의 위치가 각각 $x_P(t) = \frac{5}{3}t^3+\frac{2}{3}$, $x_Q(t) = \frac{9}{2}t^2+2t+1$일 때, 두 점 $\mathrm{P, Q}$의 속도가 같아지는 순간에 두 점 사이의 거리를 구하시오. [5.0점]
원본 보기: []
```

- 원본 정답: `9`.
- 기존 solution 실제 발췌 (원문에서 추출, 자의적 변형 없음):
> 두 점의 속도는 위치를 시간으로 미분해 구한다.
> 두 점 사이의 거리는 $|23-14|=9$이다.
- **해설 경로·판정 이유·계산 검산:** 속도 동등식 $(5t+1)(t-2)=0$에서 물리적 시각 $t=2$만 유효하고 두 위치 14,23 차는 9다.
- 그림 증거: 원본 문제 PNG 별도 연결 없음. `assets/images/23_강남여고_2학기_기말_고2_수학II/q23-solution.svg` (solutionImage SVG/학생 화면 렌더 NOT_RUN).
- 판정: **KEEP** / SOURCE_READ_EVIDENCED / SOURCE_PNG_NOT_APPLICABLE / RELEASE_QA_NOT_RUN.


## Q24 — KEEP

- source ordinal: 24; id: `24`; sourceQid: `24`; source blob: `0bd8f7e060816325ddf70c90754b61366bc6a89f`.
- 과정 표기: `수학II`; 문항 분류: `증가·감소와 극값`.
- 원본 문제 조건·보기 (출처 JS 필드 보존):

```text
서술형 3. 함수 $f(x)=x^3+ax^2+bx+c$의 도함수 $y=f'(x)$의 그래프가 다음 그림과 같다. 함수 $f(x)$의 극댓값이 $5$일 때, 상수 $a, b, c$의 값과 극솟값을 구하시오. [5.0점]
원본 보기: []
```

- 원본 정답: `a=-6, b=0, c=5, 극솟값=-27`.
- 기존 solution 실제 발췌 (원문에서 추출, 자의적 변형 없음):
> 그림의 도함수는 위로 열린 이차함수이고 $x$축과 $x=0,4$에서 만난다. $f(x)=x^3+ax^2+bx+c$이므로
> 따라서 $a=-6$, $b=0$, $c=5$, 극솟값 $-27$이다.
- **해설 경로·판정 이유·계산 검산:** 원본 PNG의 $f'$ 영점 0,4와 위로 열린 포물선 확인; $a=-6,b=0,c=5$, $f(4)=-27$을 검산했다.
- 그림 증거:  `assets/images/23_강남여고_2학기_기말_고2_수학II/q24.png` (원본 PNG를 GitHub에서 실제 열어 보고 좌표·부호·도형 조건 판독 완료). `assets/images/23_강남여고_2학기_기말_고2_수학II/q24-solution.svg` (solutionImage SVG/학생 화면 렌더 NOT_RUN).
- 판정: **KEEP** / SOURCE_READ_EVIDENCED / SOURCE_PNG_VISUALLY_READ / RELEASE_QA_NOT_RUN.


## Q25 — KEEP

- source ordinal: 25; id: `25`; sourceQid: `25`; source blob: `0bd8f7e060816325ddf70c90754b61366bc6a89f`.
- 과정 표기: `수학II`; 문항 분류: `정적분의 뜻`.
- 원본 문제 조건·보기 (출처 JS 필드 보존):

```text
서술형 4. 다항함수 $f(x)$가
$\int_{-3}^1 f(x)dx = 5$, $\int_0^5 f(x)dx = 6$, $\int_1^5 f(x)dx = 8$
을 만족시킬 때, 정적분 $\int_{-3}^0 \{f(x)-4x\}dx$를 구하시오. [5.0점]
원본 보기: []
```

- 원본 정답: `25`.
- 기존 solution 실제 발췌 (원문에서 추출, 자의적 변형 없음):
> 정적분의 구간 가법성을 사용한다.
> 따라서 $\int_{-3}^0 f(x)\,dx=\int_{-3}^1 f(x)\,dx-\int_0^1 f(x)\,dx=5-(-2)=7$이다.
- **해설 경로·판정 이유·계산 검산:** 구간 가법성으로 $\int_0^1 f=6-8=-2$, $\int_{-3}^0 f=7$; $\int_{-3}^0 4x=-18$을 빼면 25다.
- 그림 증거: 원본 문제 PNG 별도 연결 없음. `assets/images/23_강남여고_2학기_기말_고2_수학II/q25-solution.svg` (solutionImage SVG/학생 화면 렌더 NOT_RUN).
- 판정: **KEEP** / SOURCE_READ_EVIDENCED / SOURCE_PNG_NOT_APPLICABLE / RELEASE_QA_NOT_RUN.


## 감사 종료 및 인계

- source read: **25/25**; KEEP 25, UPGRADE 0, HOLD 0, UNREAD 0. 학생용 완성 대체 해설: 0문항.
- 원본 PNG 직접 판독: **5개 / 5개**; solutionImage SVG 검수: **NOT_RUN**.
- 다음 작업: Golden/Negative 독립 샘플, preflight 영수증·샘플 학생 화면 렌더, 수정 적용 승인 및 운영 출고 절차. 이 문서 자체가 배포 승인이나 원본 변경을 뜻하지 않는다.
