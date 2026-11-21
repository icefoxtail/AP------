# 2024 매산여고 고2 2학기 기말 수학Ⅱ — 심층 감사 (진행 중)

- lane10 / calculus1 / original 2final / source: `archive/exams/original/high/h2/2final/24_매산여고_2학기_기말_고2_수학II.js`
- source ref: default branch, blob `183d43d02497112b051cd6dd84938797740eeb93`; standardCourse: `수학II`, H15-M2 units.
- 전체 23문항, 이번 실제 읽기·개별 기록 5문항, KEEP 4 / UPGRADE 0 / HOLD 1 / UNREAD 18.
- 상태: **IN_PROGRESS**; nextQid: **6**. 미완료 UPGRADE: Q06~Q23 미판정. 첫 시험지 완료 전 다음 시험지 이동 금지.
- 적용 하네스/큐/템플릿은 harness branch 본문 확인. docs-manifest.json은 main/harness 모두 NOT_FOUND; core 전체/Golden/Negative/판서 샘플 및 preflight receipt는 NOT_RUN/EVIDENCE_DEBT. 그림·학생 렌더·운영 QA NOT_RUN. JS/SVG/main 변경 없음.

## Q01 — KEEP
- ordinal 1, id 1, sourceIdentityKey NOT_PRESENT
- 문제 원문: 함수 $f(x)=x^3+2x^2-3x+5$일 때, $f'(1)$을 구하면? [3.5점]
- 원본 보기: ["$1$","$2$","$3$","$4$","$5$"]; 정답: ④
- 기존 solution 원문:
```text
다항함수의 각 항을 미분한다.
$f(x)=x^3+2x^2-3x+5$
$f'(x)=3x^2+4x-3$

이제 $x=1$을 대입한다.
$f'(1)=3\cdot1^2+4\cdot1-3$
$=3+4-3$
$=4$이다.
따라서 정답은 ④이다.
```
- 판정/독립 확인: $f'(x)=3x^2+4x-3$와 $f'(1)=3+4-3=4$가 도함수 및 대입을 모두 보여준다. 선택지 ④와 일치한다.
- 학생 화면/그림 렌더: NOT_RUN.

## Q02 — KEEP
- ordinal 2, id 2, sourceIdentityKey NOT_PRESENT
- 문제 원문: 수직선 위를 움직이는 점 $P$의 시각 $t$에서 위치가 $x$가 $x=5t^3-6t^2+4t$일 때, $t=1$일 때 점 $P$의 속도를 $v$, 가속도를 $a$라 할 때, $a-v$의 값을 구하면? [3.5점]
- 원본 보기: ["$11$","$12$","$13$","$14$","$15$"]; 정답: ①
- 기존 solution 원문:
```text
위치를 한 번 미분하면 속도, 두 번 미분하면 가속도이다.
$x(t)=5t^3-6t^2+4t$
$v(t)=x'(t)=15t^2-12t+4$
$a(t)=v'(t)=30t-12$

시각 $t=1$에서 각각 계산하면
$v(1)=15-12+4=7$
$a(1)=30-12=18$이다.

따라서 $a(1)-v(1)=18-7=11$이므로
정답은 ①이다.
```
- 판정/독립 확인: $v=x'=15t^2-12t+4$, $a=v'=30t-12$를 차례로 세우고 $v(1)=7,a(1)=18$로 11을 얻는다. 시간 범위 추가 조건이 없다.
- 학생 화면/그림 렌더: NOT_RUN.

## Q03 — HOLD
- ordinal 3, id 3, sourceIdentityKey NOT_PRESENT
- 문제 원문: 다음 중 옳은 것은? (단, $C$는 적분상수이다.) [3.6점]
- 원본 보기: ["$\\displaystyle\\int 0\\,dx=0$","$\\displaystyle\\int dx=C$","$\\displaystyle\\int f(x)dx=\\int f(y)dy$","$\\displaystyle\\int\\left\\{\\dfrac{d}{dx}f(x)\\right\\}dx=\\dfrac{d}{dx}\\left\\{\\int f(x)dx\\right\\}$","$F(x)$, $G(x)$가 $f(x)$의 부정적분이면 $F(x)=G(x)+C$이다."]; 정답: ⑤
- 기존 solution 원문:
```text
부정적분에는 적분상수가 포함된다는 점을 이용해 각 보기를 판단한다.

① $\displaystyle\int 0\,dx=C$이므로 제시된 $0$만으로 나타낼 수 없다. (옳지 않다.)

② $\displaystyle\int 1\,dx=x+C$이므로 $\int dx=C$는 옳지 않다.

③ $\int f(x)\,dx$는 $x$에 대한 부정적분, $\int f(y)\,dy$는 $y$에 대한 부정적분이다. 서로 다른 변수의 식을 그대로 같다고 할 수 없다.

④ $\displaystyle\int f'(x)\,dx=f(x)+C$이고,
$\displaystyle\dfrac{d}{dx}\left(\int f(x)\,dx\right)=f(x)$이다.
적분상수까지 포함한 부정적분의 식이 일치한다고 할 수 없다.

⑤ $F'(x)=G'(x)=f(x)$이면
$\{F(x)-G(x)\}'=0$이다.
따라서 $F(x)-G(x)=C$, 즉 $F(x)=G(x)+C$이다.

옳은 것은 ⑤뿐이므로 정답은 ⑤이다.
```
- 판정/독립 확인: ⑤의 두 원시함수 차가 상수라는 설명은 맞지만 ④의 부정적분 표기에서 적분상수의 관례에 따라 양변 동치 여부가 달라질 수 있다. 문항의 유일정답성을 별도 수학 검증할 때까지 HOLD. 원문 보존.
- 학생 화면/그림 렌더: NOT_RUN.

## Q04 — KEEP
- ordinal 4, id 4, sourceIdentityKey NOT_PRESENT
- 문제 원문: 함수 $f(x)$에 대하여 $\displaystyle\int(2x-3)f'(x)dx=\dfrac{4}{3}x^3-2x^2-3x$인 관계가 성립한다. $f(0)=1$일 때, $f(1)+f'(1)$의 값을 구하면? [3.6점]
- 원본 보기: ["$6$","$10$","$26$","$30$","$36$"]; 정답: ①
- 기존 solution 원문:
```text
양변을 미분하여 $f'(x)$를 먼저 구한다.
$\displaystyle\int(2x-3)f'(x)\,dx=\dfrac43x^3-2x^2-3x$
$(2x-3)f'(x)=4x^2-4x-3$

오른쪽을 인수분해하면
$4x^2-4x-3=(2x-3)(2x+1)$이다.
따라서 $x\ne\dfrac32$에서는 $f'(x)=2x+1$이다. 미분가능성으로부터 $f(x)=x^2+x+C$로 나타낼 수 있다.

이를 적분하면
$f(x)=x^2+x+C$이고,
$f(0)=1$에서 $C=1$이다.

$f(1)=1+1+1=3$
$f'(1)=2+1=3$

그러므로 $f(1)+f'(1)=3+3=6$이다.
따라서 정답은 ①이다.
```
- 판정/독립 확인: $(2x-3)f'(x)=(2x-3)(2x+1)$을 명시하고 $x\ne3/2$ 조건 및 미분가능성으로 연속 연장해 $f'=2x+1$을 얻는다. $f(1)=3,f'(1)=3$으로 정답 6이다.
- 학생 화면/그림 렌더: NOT_RUN.

## Q05 — KEEP
- ordinal 5, id 5, sourceIdentityKey NOT_PRESENT
- 문제 원문: $\displaystyle\int_{-a}^{a}(3x^2+2x)dx=\dfrac14$일 때, 실수 $-\dfrac12a$의 값을 구하면? [3.7점]
- 원본 보기: ["$-\\dfrac14$","$\\dfrac16$","$\\dfrac18$","$-\\dfrac19$","$\\dfrac1{12}$"]; 정답: ①
- 기존 solution 원문:
```text
적분구간이 $-a$부터 $a$까지인 대칭구간이다.
$3x^2$은 짝함수이고 $2x$는 홀함수이므로
$\displaystyle\int_{-a}^{a}2x\,dx=0$이다.

따라서
$\displaystyle\int_{-a}^{a}(3x^2+2x)\,dx$
$\displaystyle=\left[x^3+x^2\right]_{-a}^{a}$
$=(a^3+a^2)-(-a^3+a^2)$
$=2a^3$이다.

주어진 조건에 의해
$2a^3=\dfrac14$
$a^3=\dfrac18$
$a=\dfrac12$이다.

구하는 값은 $-\dfrac12a$
$=-\dfrac12\cdot\dfrac12$
$=-\dfrac14$이다.
따라서 정답은 ①이다.
```
- 판정/독립 확인: 짝·홀 분리와 원시함수 차 $(a^3+a^2)-(-a^3+a^2)=2a^3$을 전개하여 $a=1/2$, 최종 $-a/2=-1/4$를 확인한다. a 부호도 세제곱식에서 유일하다.
- 학생 화면/그림 렌더: NOT_RUN.

## 재개
Q06부터 원문·보기·정답·기존 solution을 읽어 개별 판정하고, 필요한 모든 UPGRADE의 완성 풀이를 작성할 것. Q03 유일정답성 HOLD 재검토. 이 파일은 완료 문서가 아님.
