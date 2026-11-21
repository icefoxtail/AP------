# 2024 매산여고 고2 2학기 기말 수학Ⅱ — 심층 감사 (진행 중)

- lane10 / calculus1 / original 2final / source: `archive/exams/original/high/h2/2final/24_매산여고_2학기_기말_고2_수학II.js`
- source ref: default branch, blob `183d43d02497112b051cd6dd84938797740eeb93`; standardCourse: `수학II`, H15-M2 units.
- 전체 23문항, 이번 실제 읽기·개별 기록 23문항, KEEP 21 / UPGRADE 0 / HOLD 2 / UNREAD 0.
- 상태: **AUDIT_DRAFT_COMPLETE**; nextQid: **NONE**. 미완료 UPGRADE: 없음. 첫 시험지 완료 전 다음 시험지 이동 금지.
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
Q06부터 원문·보기·정답·기존 solution을 읽어 개별 판정하고, 필요한 모든 UPGRADE의 완성 풀이를 작성할 것. Q03 유일정답성 HOLD 재검토. 모든 문항 감사 및 필요한 수정 풀이 초안 완료. 시각 HOLD와 최종 QA는 남음.

## Q06 — KEEP
- ordinal 6, id 6, sourceIdentityKey NOT_PRESENT
- 문제 원문: 함수 $f(x)=\begin{cases}3x^2+5ax+7&(x\gt1)\\-4x+b&(x\le1)\end{cases}$가 $x=1$에서 미분가능할 때, $a+b$의 값을 구하면? (단, $a$, $b$는 상수) [3.7점]
- 원본 보기: ["$1$","$2$","$3$","$4$","$5$"]; 정답: ②
- 기존 solution 원문:
```text
$x=1$에서 미분가능하려면 함수값이 이어지고 좌우 미분계수가 같아야 한다.

먼저 좌우 기울기를 비교한다.
$x\le1$에서 $f'(x)=-4$
$x>1$에서 $f'(x)=6x+5a$이다.
따라서
$-4=6+5a$
$5a=-10$
$a=-2$이다.

이제 $x=1$에서의 함수값을 비교한다.
$-4+b=3+5a+7$
$-4+b=10-10=0$
$b=4$이다.

따라서 $a+b=-2+4=2$이므로
정답은 ②이다.
```
- 판정/검산: KEEP: 좌우 기울기 -4=6+5a로 a=-2, 함수값 -4+b=10+5a로 b=4를 구한다. 합 2. 미분가능성의 두 조건 모두 적용.
- 원본 그림/학생 렌더: NOT_RUN.

## Q07 — KEEP
- ordinal 7, id 7, sourceIdentityKey NOT_PRESENT
- 문제 원문: 방정식 $2x^3+a=3x^2+12x+1$이 서로 다른 두 실근을 갖도록 하는 실수 $a$값을 모두 합하면? [3.8점]
- 원본 보기: ["$11$","$12$","$13$","$14$","$15$"]; 정답: ⑤
- 기존 solution 원문:
```text
방정식을 한쪽으로 모아 삼차함수와 수평선의 교점 개수로 판단한다.
$2x^3-3x^2-12x=1-a$라 두고
$G(x)=2x^3-3x^2-12x$라 하자.

$G'(x)=6x^2-6x-12$
$=6(x+1)(x-2)$이다.
따라서 $x=-1$에서 극대, $x=2$에서 극소이다.

극댓값과 극솟값은
$G(-1)=-2-3+12=7$
$G(2)=16-12-24=-20$이다.

서로 다른 두 실근이 되려면 수평선 $y=1-a$가 극대점 또는 극소점을 지나, 그곳의 두 교점이 하나로 합쳐져야 한다.

① $1-a=7$이면 $a=-6$이다.
② $1-a=-20$이면 $a=21$이다.

따라서 모든 $a$값의 합은
$-6+21=15$이므로 정답은 ⑤이다.
```
- 판정/검산: KEEP: G'=6(x+1)(x-2)에서 극댓값 7, 극솟값 -20을 대입해 1-a=7,-20으로 a=-6,21, 합 15. 삼차함수 접선 수평 조건을 만족.
- 원본 그림/학생 렌더: NOT_RUN.

## Q08 — KEEP
- ordinal 8, id 8, sourceIdentityKey NOT_PRESENT
- 문제 원문: 함수 $f(x)=x^3-4x^2+ax-3$이 $\displaystyle\lim_{h\to0}\dfrac{f(2+h)-f(2-5h)}{2h}=12$를 만족시킬 때, 상수 $a$의 값을 구하면? [3.8점]
- 원본 보기: ["$6$","$7$","$8$","$9$","$10$"]; 정답: ③
- 기존 solution 원문:
```text
미분계수의 정의를 이용해 두 함수값의 차를 나눈다.
$\displaystyle\lim_{h\to0}\dfrac{f(2+h)-f(2-5h)}{2h}$

분자에 $f(2)$를 더하고 빼면
$\displaystyle=\lim_{h\to0}\left\{\dfrac{f(2+h)-f(2)}{2h}+\dfrac{f(2)-f(2-5h)}{2h}\right\}$
$\displaystyle=\dfrac12 f'(2)+\dfrac52 f'(2)$
$=3f'(2)$이다.

주어진 값이 $12$이므로
$3f'(2)=12$
$f'(2)=4$이다.

$f'(x)=3x^2-8x+a$이므로
$f'(2)=12-16+a=a-4$이다.
$a-4=4$에서 $a=8$이다.
따라서 정답은 ③이다.
```
- 판정/검산: KEEP: 분자에 f(2)를 더하고 빼서 1/2 f'(2)+5/2 f'(2)=3f'(2)=12, a-4=4, a=8. 미분계수 극한의 두 증가량 부호가 맞다.
- 원본 그림/학생 렌더: NOT_RUN.

## Q09 — KEEP
- ordinal 9, id 9, sourceIdentityKey NOT_PRESENT
- 문제 원문: $\displaystyle\lim_{h\to0^+}\left\{\int_{2+h}^4\dfrac{x^2(x^2-2x+4)}{x-2}dx+\int_4^{2+h}\dfrac{4(y^2-2y+4)}{y-2}dy\right\}$의 값을 구하면? [3.9점]
- 원본 보기: ["$16$","$40$","$46$","$64$","$76$"]; 정답: ⑤
- 기존 solution 원문:
```text
적분구간의 방향을 맞추고 두 피적분함수를 뺀다.
$\displaystyle\int_4^{2+h} B(y)\,dy=-\int_{2+h}^4B(x)\,dx$로 바꿀 수 있다.

따라서 두 적분의 합은
$\displaystyle\int_{2+h}^4\dfrac{(x^2-4)(x^2-2x+4)}{x-2}\,dx$이다.

$x>2$에서 $x^2-4=(x-2)(x+2)$이므로
$\displaystyle\dfrac{(x^2-4)(x^2-2x+4)}{x-2}$
$=(x+2)(x^2-2x+4)$
$=x^3+8$이다.

이제 $h\to0^+$일 때 아래끝은 $2$로 다가간다.
$\displaystyle\int_2^4(x^3+8)\,dx$
$\displaystyle=\left[\dfrac{x^4}{4}+8x\right]_2^4$
$\displaystyle=\left(\dfrac{256}{4}+32\right)-\left(\dfrac{16}{4}+16\right)$
$=96-20=76$이다.

따라서 정답은 ⑤이다.
```
- 판정/검산: KEEP: 적분 방향을 반전해 (x²-4)(x²-2x+4)/(x-2)=(x+2)(x²-2x+4)=x³+8, [x⁴/4+8x]₂⁴=76. h>0일 때 특이점 x=2를 지나지 않는다.
- 원본 그림/학생 렌더: NOT_RUN.

## Q10 — KEEP
- ordinal 10, id 10, sourceIdentityKey NOT_PRESENT
- 문제 원문: 미분가능한 함수 $f(x)$의 연속인 도함수가 $f'(x)=\begin{cases}2x+1&(x\ge1)\\3a&(-1\lt x\lt1)\\x^2+b&(x\le-1)\end{cases}$이고, $f(0)=1$일 때, $a+b+f(2)+f(-1)$의 값을 구하면? (단, $a$, $b$는 상수이다.) [4.0점]
- 원본 보기: ["$1$","$3$","$9$","$12$","$16$"]; 정답: ③
- 기존 solution 원문:
```text
도함수 $f'(x)$가 연속이므로 경계점에서 좌우 식의 값이 같다.

$x=1$에서
$3a=2\cdot1+1=3$
$a=1$이다.

$x=-1$에서
$1+b=3a=3$
$b=2$이다.

따라서 $-1<x<1$에서 $f'(x)=3$이다.
$f(0)=1$을 이용하면
$\displaystyle f(-1)=1+\int_0^{-1}3\,dx=1-3=-2$
$\displaystyle f(1)=1+\int_0^1 3\,dx=1+3=4$이다.

$1\le x\le2$에서는 $f'(x)=2x+1$이므로
$\displaystyle f(2)=f(1)+\int_1^2(2x+1)\,dx$
$\displaystyle=4+[x^2+x]_1^2$
$=4+(6-2)$
$=8$이다.

따라서
$a+b+f(2)+f(-1)$
$=1+2+8-2=9$이므로
정답은 ③이다.
```
- 판정/검산: KEEP: f' 연속 조건 3a=3,1+b=3a로 a=1,b=2; f(-1)=-2, f(2)=8로 합 9. 적분 방향도 반영.
- 원본 그림/학생 렌더: NOT_RUN.

## Q11 — HOLD
- ordinal 11, id 11, sourceIdentityKey NOT_PRESENT
- 문제 원문: 수직선 위를 움직이는 점 $P$의 시각 $t$에서의 속도를 $v(t)$라 할 때, $0\le t\le6$에서 $v(t)$의 그래프가 다음 그림과 같다. 점 $P$의 시각 $t=0$에서의 위치가 원점이고, 점 $P$가 원점에서 가장 멀리 떨어져 있을 때의 위치가 $3$일 때, 점 $P$의 시각 $t=5$에서의 위치를 구하면? (단, $a\gt0$이다.) [4.0점]
- 원본 보기: ["$1$","$\\dfrac32$","$2$","$\\dfrac52$","$3$"]; 정답: ①
- 기존 solution 원문:
```text
속도 그래프와 시간축 사이의 부호 있는 넓이가 위치의 변화량이다. 출발점은 원점이므로
$\displaystyle x(t)=\int_0^t v(s)\,ds$이다.

그림에서 $0\le t\le3$에서는 속도가 양수이고,
$t=3$ 이후 $t=5$까지는 음수이다.
$t=3$에서 위치가 가장 크며, 그 값이 $3$이다.

높이를 $a$라고 하면 $0$에서 $3$까지의 넓이는
$\displaystyle x(3)=\dfrac12\cdot2\cdot a+\dfrac12\cdot1\cdot a$
$=\dfrac32a$이다.
$\dfrac32a=3$에서 $a=2$이다.

$3$부터 $5$까지는 시간축 아래 두 삼각형의 넓이를 빼야 한다.
$\displaystyle\int_3^5v(t)\,dt$
$\displaystyle=-\dfrac12\cdot1\cdot2-\dfrac12\cdot1\cdot2$
$=-2$이다.

따라서
$x(5)=x(3)-2=3-2=1$이므로
정답은 ①이다.
```
- 판정/검산: HOLD: 속도 그래프 원본 이미지의 폭·부호·높이를 시각 판독하지 못했다. 해설이 가정한 0~3의 양의 넓이 3과 3~5의 음의 넓이 -2는 원본 이미지 확인 전 독립 승인 불가. SVG/원본 그래프 검수 요청.
- 원본 그림/학생 렌더: VISUAL_HOLD.

## Q12 — KEEP
- ordinal 12, id 12, sourceIdentityKey NOT_PRESENT
- 문제 원문: 곡선 $y=x|x-3|$와 $x$축 및 직선 $x=6$으로 둘러싸인 도형의 넓이를 구하면? [4.1점]
- 원본 보기: ["$3$","$9$","$27$","$54$","$72$"]; 정답: ③
- 기존 solution 원문:
```text
$x=3$을 기준으로 절댓값을 풀어 두 부분으로 나눈다.

$0\le x\le3$에서는
$|x-3|=3-x$이므로 $y=3x-x^2$이다.
$3\le x\le6$에서는
$|x-3|=x-3$이므로 $y=x^2-3x$이다.
두 구간에서 모두 $y\ge0$이다.

첫 번째 부분의 넓이는
$\displaystyle S_1=\int_0^3(3x-x^2)\,dx$
$\displaystyle=\left[\dfrac32x^2-\dfrac13x^3\right]_0^3$
$\displaystyle=\dfrac{27}{2}-9=\dfrac92$이다.

두 번째 부분의 넓이는
$\displaystyle S_2=\int_3^6(x^2-3x)\,dx$
$\displaystyle=\left[\dfrac{x^3}{3}-\dfrac32x^2\right]_3^6$
$\displaystyle=(72-54)-\left(9-\dfrac{27}{2}\right)$
$\displaystyle=18+\dfrac92=\dfrac{45}{2}$이다.

따라서 전체 넓이는
$\displaystyle S_1+S_2=\dfrac92+\dfrac{45}{2}=27$이므로
정답은 ③이다.
```
- 판정/검산: KEEP: |x-3|을 3 기준으로 분할해 [0,3] 적분 9/2와 [3,6] 적분 45/2를 계산, 합 27. 두 구간 모두 함수가 음수가 아니다.
- 원본 그림/학생 렌더: NOT_RUN.

## Q13 — KEEP
- ordinal 13, id 13, sourceIdentityKey NOT_PRESENT
- 문제 원문: $f(x)=x^3-12x+4\displaystyle\int_0^1f(t)dt$를 만족시키는 함수 $f(x)$의 극값의 모든 합을 구하면? [4.2점]
- 원본 보기: ["$\\dfrac{13}{3}$","$\\dfrac{46}{3}$","$\\dfrac{23}{12}$","$\\dfrac{71}{12}$","$\\dfrac{25}{12}$"]; 정답: ②
- 기존 solution 원문:
```text
정적분에 들어 있는 상수를 먼저 정한다.
$\displaystyle A=\int_0^1 f(t)\,dt$라 두면
$f(x)=x^3-12x+4A$이다.

양변을 $0$에서 $1$까지 적분하면
$\displaystyle A=\int_0^1(t^3-12t+4A)\,dt$
$\displaystyle=\left[\dfrac{t^4}{4}-6t^2+4At\right]_0^1$
$=\dfrac14-6+4A$
$=-\dfrac{23}{4}+4A$이다.
따라서 $3A=\dfrac{23}{4}$,
$A=\dfrac{23}{12}$이다.

그러므로
$\displaystyle f(x)=x^3-12x+\dfrac{23}{3}$이고,
$f'(x)=3x^2-12=3(x+2)(x-2)$이다.
도함수의 부호는
$x<-2$에서 양, $-2<x<2$에서 음, $x>2$에서 양이다.
따라서 $x=-2$에서 극대, $x=2$에서 극소이다.

극댓값은
$\displaystyle f(-2)=-8+24+\dfrac{23}{3}=\dfrac{71}{3}$,
극솟값은
$\displaystyle f(2)=8-24+\dfrac{23}{3}=-\dfrac{25}{3}$이다.

모든 극값의 합은
$\displaystyle\dfrac{71}{3}-\dfrac{25}{3}=\dfrac{46}{3}$이므로
정답은 ②이다.
```
- 판정/검산: KEEP: A=∫₀¹f, A=1/4-6+4A에서 A=23/12; f'=3(x+2)(x-2), 극댓값 71/3과 극솟값 -25/3의 합 46/3. 도함수 부호 확인.
- 원본 그림/학생 렌더: NOT_RUN.

## Q14 — KEEP
- ordinal 14, id 14, sourceIdentityKey NOT_PRESENT
- 문제 원문: 연속함수 $f(x)$가 모든 실수 $x$에 대하여 $f(x)=3x^2+\displaystyle\int_0^1(x-t)f(t)dt$를 만족할 때, 함수 $f(x)=0$의 모든 근의 합을 구하면? [4.2점]
- 원본 보기: ["$\\dfrac{11}{69}$","$\\dfrac13$","$\\dfrac3{13}$","$-\\dfrac3{13}$","$-\\dfrac9{13}$"]; 정답: ④
- 기존 solution 원문:
```text
적분구간이 $0$부터 $1$까지로 고정되어 있으므로, 적분에서 나오는 두 값을 상수로 둔다.
$\displaystyle A=\int_0^1 f(t)\,dt$,
$\displaystyle B=\int_0^1 t f(t)\,dt$라 하자.

주어진 식은
$f(x)=3x^2+Ax-B$가 된다.

이 식을 $0$부터 $1$까지 적분하면
$\displaystyle A=\int_0^1(3t^2+At-B)\,dt$
$\displaystyle=1+\dfrac A2-B$이다.
따라서 $A=2-2B$이다.

이번에는 양변에 $x$를 곱하여 적분하면
$\displaystyle B=\int_0^1(3t^3+At^2-Bt)\,dt$
$\displaystyle=\dfrac34+\dfrac A3-\dfrac B2$이다.
따라서
$\displaystyle B=\dfrac12+\dfrac{2A}{9}$이다.

이를 $A=2-2B$에 대입하면
$\displaystyle A=2-2\left(\dfrac12+\dfrac{2A}{9}\right)$
$\displaystyle=1-\dfrac{4A}{9}$,
$\displaystyle\dfrac{13A}{9}=1$이므로 $A=\dfrac9{13}$이다.

$f(x)=3x^2+\dfrac9{13}x-B$는 이차함수이다.
$f(x)=0$의 두 근의 합은 근과 계수의 관계로
$\displaystyle-\dfrac9{13}\div3=-\dfrac3{13}$이다.
따라서 정답은 ④이다.
```
- 판정/검산: KEEP: A=∫f, B=∫tf로 놓고 A=1+A/2-B, B=3/4+A/3-B/2를 연립해 A=9/13. 이차식의 두 근의 합 -A/3=-3/13. 판별식 양수 확인은 추가 독립 검산 필요하므로 최종 QA는 NOT_RUN.
- 원본 그림/학생 렌더: NOT_RUN.

## Q15 — KEEP
- ordinal 15, id 15, sourceIdentityKey NOT_PRESENT
- 문제 원문: 삼차함수 $f(x)=x^3+ax^2+bx+c$는 $x=-3$에서 극대이고, 곡선 $y=f(x)$ 위의 점 $(-2,28)$에서 접선의 기울기가 $-9$일 때, $f(1)$의 값을 구하면? (단, $a$, $b$, $c$는 상수) [4.3점]
- 원본 보기: ["$1$","$2$","$3$","$4$","$5$"]; 정답: ①
- 기존 solution 원문:
```text
극대 조건과 접선의 기울기는 모두 도함수 조건이다.
$f(x)=x^3+ax^2+bx+c$이므로
$f'(x)=3x^2+2ax+b$이다.

$x=-3$에서 극대이므로
$f'(-3)=27-6a+b=0$이다. ①

점 $(-2,28)$에서 접선의 기울기가 $-9$이므로
$f'(-2)=12-4a+b=-9$이다. ②

①에서 $b=6a-27$,
②에서 $b=4a-21$이다.
따라서
$6a-27=4a-21$
$2a=6,\quad a=3$이고
$b=6\cdot3-27=-9$이다.

이때 $f'(x)=3(x+3)(x-1)$이고
$x=-3$을 지날 때 부호가 양에서 음으로 바뀌므로 극대 조건도 만족한다.

접점 $(-2,28)$은 곡선 위에 있으므로
$f(-2)=-8+3\cdot4-9(-2)+c$
$=-8+12+18+c=22+c=28$이다.
따라서 $c=6$이다.

$f(1)=1+3-9+6=1$이므로
정답은 ①이다.
```
- 판정/검산: KEEP: f'(-3)=0,f'(-2)=-9에서 a=3,b=-9, 접점 f(-2)=28에서 c=6. f'=3(x+3)(x-1) 부호가 -3에서 양→음, f(1)=1.
- 원본 그림/학생 렌더: NOT_RUN.

## Q16 — KEEP
- ordinal 16, id 16, sourceIdentityKey NOT_PRESENT
- 문제 원문: 구간 $[-4,2]$에서 함수 $f(x)=2x^3+ax^2+b$의 최솟값이 $-37$이다. 함수 $f(x)$는 $x=-2$에서 극대일 때, 함수 $f(1)$의 값을 구하면? (단, $a$, $b$는 상수) [4.3점]
- 원본 보기: ["$2$","$3$","$4$","$5$","$6$"]; 정답: ②
- 기존 solution 원문:
```text
극대가 일어나는 $x=-2$에서 도함수가 $0$이다.
$f(x)=2x^3+ax^2+b$
$f'(x)=6x^2+2ax$이므로
$f'(-2)=24-4a=0$이다.
따라서 $a=6$이다.

이때
$f'(x)=6x^2+12x=6x(x+2)$이다.
도함수의 부호는
$x<-2$에서 양,
$-2<x<0$에서 음,
$x>0$에서 양이다.
따라서 $x=-2$에서 극대, $x=0$에서 극소가 된다.

닫힌구간 $[-4,2]$에서는 양 끝점과 극점의 함수값을 비교한다.
$f(-4)=-128+96+b=b-32$
$f(-2)=-16+24+b=b+8$
$f(0)=b$
$f(2)=16+24+b=b+40$이다.

가장 작은 값은 $f(-4)=b-32$이므로
$b-32=-37$
$b=-5$이다.

따라서
$f(1)=2+6-5=3$이므로
정답은 ②이다.
```
- 판정/검산: KEEP: f'(-2)=0에서 a=6; 끝점·극점 f(-4)=b-32,f(-2)=b+8,f(0)=b,f(2)=b+40 비교로 b=-5, f(1)=3. 극대 조건도 부호로 재확인.
- 원본 그림/학생 렌더: NOT_RUN.

## Q17 — KEEP
- ordinal 17, id 17, sourceIdentityKey NOT_PRESENT
- 문제 원문: 함수 $f(x)=-x^3+3x$와 최고차항의 계수가 $-1$인 이차함수 $g(x)$가 어떤 음수 $a$에 대하여 $f(a)=g(a)$, $f'(a)=g'(a)=0$을 만족시킬 때, 두 곡선 $y=f(x)$, $y=g(x)$로 둘러싸인 부분의 넓이를 구하면? [4.4점]
- 원본 보기: ["$\\dfrac{62}{3}$","$21$","$\\dfrac{64}{3}$","$\\dfrac{65}{3}$","$22$"]; 정답: ③
- 기존 solution 원문:
```text
두 곡선이 기울기 $0$으로 만나는 음수 $a$부터 찾는다.
$f(x)=-x^3+3x$이므로
$f'(x)=-3x^2+3$이다.
$f'(a)=0$에서
$-3a^2+3=0$
$a^2=1$이다.
$a<0$이므로 $a=-1$이다.

$f(-1)=-2$이고 $g'(-1)=0$이다.
$g$의 최고차항 계수가 $-1$이므로
$g(x)=-(x+1)^2-2$
$=-x^2-2x-3$이다.

두 함수의 차는
$f(x)-g(x)=-x^3+x^2+5x+3$
$=(3-x)(x+1)^2$이다.

교점의 $x$좌표는 $-1,3$이다.
$-1\le x\le3$에서 $(3-x)(x+1)^2\ge0$이므로 이 구간에서는 $f(x)$가 위쪽이다.

따라서 둘러싸인 넓이는
$\displaystyle S=\int_{-1}^{3}\{f(x)-g(x)\}\,dx$
$\displaystyle=\int_{-1}^{3}(-x^3+x^2+5x+3)\,dx$
$\displaystyle=\left[-\dfrac{x^4}{4}+\dfrac{x^3}{3}+\dfrac{5x^2}{2}+3x\right]_{-1}^{3}$이다.

위끝값은
$\displaystyle-\dfrac{81}{4}+9+\dfrac{45}{2}+9=\dfrac{81}{4}$,
아래끝값은
$\displaystyle-\dfrac14-\dfrac13+\dfrac52-3=-\dfrac{13}{12}$이다.

$\displaystyle S=\dfrac{81}{4}-\left(-\dfrac{13}{12}\right)$
$\displaystyle=\dfrac{243+13}{12}=\dfrac{64}{3}$이다.
따라서 정답은 ③이다.
```
- 판정/검산: KEEP: f'(-1)=0과 a<0에서 a=-1, g=-(x+1)²-2, 차 (3-x)(x+1)². [-1,3] 적분 64/3이며 위아래 관계가 양수로 확인된다.
- 원본 그림/학생 렌더: NOT_RUN.

## Q18 — KEEP
- ordinal 18, id 18, sourceIdentityKey NOT_PRESENT
- 문제 원문: 등식 $\displaystyle\int2xf(x)dx+\int x^2f'(x)dx=x^4-ax^3+4x^2$을 만족시키는 다항함수 $f(x)$에 대하여 $\displaystyle\int_0^4f(x)dx=0$일 때, $\dfrac3a$의 값을 구하면? (단, $a$는 상수이다.) [4.4점]
- 원본 보기: ["$-\\dfrac12$","$-\\dfrac1{13}$","$\\dfrac3{14}$","$-\\dfrac9{14}$","$\\dfrac9{14}$"]; 정답: ⑤
- 기존 solution 원문:
```text
왼쪽 두 적분의 피적분함수를 합치면 곱을 미분한 꼴이다.
$\{x^2f(x)\}'=2xf(x)+x^2f'(x)$이다.

주어진 등식의 양변을 미분하면
$2xf(x)+x^2f'(x)=4x^3-3ax^2+8x$이므로
$\{x^2f(x)\}'=4x^3-3ax^2+8x$이다.

양변을 적분하면
$x^2f(x)=x^4-ax^3+4x^2+C$이다.
$f(x)$가 다항함수이므로 $x=0$을 대입하면 왼쪽이 $0$이고 오른쪽이 $C$이다.
따라서 $C=0$이다.

$x^2f(x)=x^2(x^2-ax+4)$이므로
$f(x)=x^2-ax+4$이다.

이제 정적분 조건을 쓴다.
$\displaystyle 0=\int_0^4(x^2-ax+4)\,dx$
$\displaystyle=\left[\dfrac{x^3}{3}-\dfrac{ax^2}{2}+4x\right]_0^4$
$\displaystyle=\dfrac{64}{3}-8a+16$
$\displaystyle=\dfrac{112}{3}-8a$이다.

$\displaystyle8a=\dfrac{112}{3}$
$\displaystyle a=\dfrac{14}{3}$이다.
따라서
$\displaystyle\dfrac3a=3\div\dfrac{14}{3}=\dfrac9{14}$이므로
정답은 ⑤이다.
```
- 판정/검산: KEEP: (x²f)'=2xf+x²f'를 적용하고 x²f=x⁴-ax³+4x²+C에 x=0을 대입해 C=0. ∫₀⁴(x²-ax+4)=112/3-8a=0, 3/a=9/14.
- 원본 그림/학생 렌더: NOT_RUN.

## Q19 — KEEP
- ordinal 19, id 19, sourceIdentityKey NOT_PRESENT
- 문제 원문: 세 양수 $a$, $b$, $k$에 대하여 함수 $f(x)$를 $f(x)=\begin{cases}ax&(x\ltk)\\-x^2+4bx-3b^2&(x\gek)\end{cases}$라 하자. 함수 $f(x)$가 실수 전체의 집합에서 미분가능하고, $f(k)=f'(k)$를 만족시킬 때, 함수 $f(x)$의 그래프와 $x$축으로 둘러싸인 부분의 넓이를 구하면? [4.5점]
- 원본 보기: ["$\\dfrac1{\\sqrt3}$","$\\dfrac13$","$\\dfrac2{\\sqrt3}$","$\\dfrac23$","$\\dfrac4{\\sqrt3}$"]; 정답: ②
- 기존 solution 원문:
```text
경계점 $x=k$에서 미분가능하므로 함수값과 기울기가 양쪽에서 일치한다.

왼쪽 식 $f(x)=ax$에서 $f'(x)=a$이고,
주어진 $f(k)=f'(k)$에 의해
$ak=a$이다.
$a>0$이므로 $k=1$이다.

$x=1$에서 도함수의 연속 조건은
$a=-2+4b$이고,
함수값의 연속 조건은
$a=-1+4b-3b^2$이다.

두 식을 같게 놓으면
$-2+4b=-1+4b-3b^2$
$3b^2=1$이다.
$b>0$이므로 $b=\dfrac1{\sqrt3}$이고
$\displaystyle a=\dfrac4{\sqrt3}-2$이다.

따라서 함수는
$f(x)=\begin{cases}(\dfrac4{\sqrt3}-2)x&(x<1)\\-x^2+\dfrac4{\sqrt3}x-1&(x\ge1)\end{cases}$이다.

오른쪽 이차식은
$\displaystyle -(x-\dfrac1{\sqrt3})(x-\sqrt3)$으로 인수분해된다.
$\dfrac1{\sqrt3}<1<\sqrt3$이므로 $0<x<\sqrt3$에서 그래프는 $x$축 위에 있다.

둘러싸인 넓이를 $x=1$에서 나누어 계산한다.
$\displaystyle S_1=\int_0^1\left(\dfrac4{\sqrt3}-2\right)x\,dx$
$\displaystyle=\left(\dfrac4{\sqrt3}-2\right)\dfrac12$
$\displaystyle=\dfrac2{\sqrt3}-1$이다.

$\displaystyle S_2=\int_1^{\sqrt3}\left(-x^2+\dfrac4{\sqrt3}x-1\right)dx$
$\displaystyle=\left[-\dfrac{x^3}{3}+\dfrac2{\sqrt3}x^2-x\right]_1^{\sqrt3}$이다.
위끝값은 $-\sqrt3+2\sqrt3-\sqrt3=0$,
아래끝값은 $-\dfrac13+\dfrac2{\sqrt3}-1=\dfrac2{\sqrt3}-\dfrac43$이다.
따라서 $\displaystyle S_2=\dfrac43-\dfrac2{\sqrt3}$이다.

$\displaystyle S=S_1+S_2=\dfrac13$이므로
정답은 ②이다.
```
- 판정/검산: KEEP: f(k)=f'(k), ak=a와 a>0으로 k=1; 연속·기울기 일치에서 b=1/√3,a=4/√3-2. [0,1]과 [1,√3]의 넓이 합 1/3, 교점 범위 확인.
- 원본 그림/학생 렌더: NOT_RUN.

## Q20 — KEEP
- ordinal 20, id 20, sourceIdentityKey NOT_PRESENT
- 문제 원문: 원점에서 출발하여 수직선 위를 움직이는 점 $P$의 시각 $t$에서의 위치 $x(t)$가 $x(t)=kt(t-a)(t-b)$이다. 함수 $x(t)$와 점 $P$의 시각 $t$에서의 속도 $v(t)$가 다음 조건을 만족시킨다.<div class="question-note-box">&lt;조 건&gt;<br>(가) 함수 $x(t)$의 극댓값은 $2$이다.<br>(나) $\displaystyle\int_0^2|v(t)|dt=4$이다.<br>(다) 점 $P$는 출발 이후 원점을 한 번만 지난다.</div>$\displaystyle\int_0^c|v(t)|dt=6$일 때, 양수 $c$의 값을 구하면? (단, $a$, $b$는 상수이고, $0\lt a\le b$, $k\gt0$이다.) [4.5점]
- 원본 보기: ["$\\dfrac{11}{3}$","$\\dfrac{10}{3}$","$3$","$\\dfrac83$","$\\dfrac73$"]; 정답: ④
- 기존 solution 원문:
```text
출발 이후 원점을 한 번만 지나므로 양수인 두 영점 $a,b$는 일치해야 한다.
$a=b=r$ $(r>0)$로 두면
$x(t)=kt(t-r)^2$이다.

속도는
$v(t)=x'(t)=k(t-r)(3t-r)$이다.
$t=\dfrac r3$에서 속도가 양에서 음으로 바뀌므로 이때 위치가 극대이다.
$\displaystyle x\left(\dfrac r3\right)=k\cdot\dfrac r3\cdot\left(-\dfrac{2r}{3}\right)^2$
$\displaystyle=\dfrac{4kr^3}{27}=2$이다.
따라서 $\displaystyle k=\dfrac{27}{2r^3}$이다.

시각 $0$부터 극대점까지 위치가 $0\to2$, 그 뒤 $t=r$까지 $2\to0$으로 이동하므로 이 왕복 이동거리는 $4$이다.

① $0<r<2$라면 $t=2$는 왕복 이후이다. $x(2)>0$이므로 시각 $2$까지의 이동거리는 $4+x(2)>4$이다.
② $r>2$라면 시각 $2$까지 원점으로 돌아오지 못한다. $t=2$까지 극대를 지났으면 이동거리는 $4-x(2)<4$이고, 아직 극대 이전이면 이동거리는 $x(2)\le2$이다.
③ $r=2$라면 시각 $2$에 원점으로 돌아오므로 이동거리가 정확히 $4$이다.

따라서 $r=2$이고
$\displaystyle k=\dfrac{27}{2\cdot2^3}=\dfrac{27}{16}$이다.
$\displaystyle x(t)=\dfrac{27}{16}t(t-2)^2$이다.

시각 $2$ 이후 속도가 양수이고 이미 이동한 거리는 $4$이다. 전체 이동거리가 $6$이 되려면 $c>2$에서 위치가 $2$여야 한다.
$\displaystyle\dfrac{27}{16}c(c-2)^2=2$
$27c(c-2)^2=32$
$27c^3-108c^2+108c-32=0$
$(3c-8)(3c-2)^2=0$이다.

$c>2$를 만족하는 해는
$\displaystyle c=\dfrac83$뿐이다.
따라서 정답은 ④이다.
```
- 판정/검산: KEEP: 출발 뒤 원점 한 번 통과 조건에서 a=b=r, 위치 kt(t-r)². 극대 높이 2와 이동거리 4를 이용해 r=2,k=27/16, c>2의 방정식 (3c-8)(3c-2)²=0으로 c=8/3. r의 범위별 논증 존재.
- 원본 그림/학생 렌더: NOT_RUN.

## Q21 — KEEP
- ordinal 21, id 21, sourceIdentityKey NOT_PRESENT
- 문제 원문: [주관식1 (서술형)] [6점](부분점수 있음)<br>모든 실수 $x$, $y$에 대하여 다항함수 $f(x)$가 $f(x+y)=f(x)+f(y)+4xy$를 만족시킨다. 함수 $H(x)$가 $H(x)=\displaystyle\int(x-2)f'(x)dx$이고, $H(x)$는 극값이 존재하지 않을 때, $f(5)$의 값을 구하는 풀이 과정을 자세히 서술하시오.
- 원본 보기: []; 정답: $10$
- 기존 solution 원문:
```text
먼저 주어진 함수식을 이용해 $f(x)$를 정한다.
$y=0$을 대입하면
$f(x)=f(x)+f(0)$이므로 $f(0)=0$이다.

$x$를 고정하고 양변을 $y$에 대하여 미분하면
$f'(x+y)=f'(y)+4x$이다.
여기에 $y=0$을 대입하여
$f'(x)=f'(0)+4x$를 얻는다.

$f'(0)=m$으로 두면
$f'(x)=4x+m$이고,
$f(x)=2x^2+mx+C$이다.
$f(0)=0$이므로 $C=0$이다.

이제 $H(x)$의 극값 조건을 이용한다.
$\displaystyle H(x)=\int(x-2)f'(x)\,dx$이므로
$H'(x)=(x-2)f'(x)$
$=(x-2)(4x+m)$이다.

두 일차인수의 영점 $2$와 $-\dfrac m4$가 서로 다르면 도함수의 부호가 두 영점에서 바뀌어 극대와 극소가 생긴다.
극값이 존재하지 않으려면 두 영점이 같아야 하므로
$-\dfrac m4=2$
$m=-8$이다.

이때 $H'(x)=4(x-2)^2\ge0$이므로 실제로 극값이 생기지 않는다.

따라서
$f(5)=2\cdot5^2-8\cdot5$
$=50-40=10$이다.
따라서 구하는 값은 $10$이다.
```
- 판정/검산: KEEP: f(x+y) 항등식을 미분해 f'=4x+m, f=2x²+mx. H'=(x-2)(4x+m)가 부호를 바꾸지 않으려면 중근이므로 m=-8, f(5)=10. 중근일 때 H'=4(x-2)² 확인.
- 원본 그림/학생 렌더: NOT_RUN.

## Q22 — KEEP
- ordinal 22, id 22, sourceIdentityKey NOT_PRESENT
- 문제 원문: [주관식2 (서술형)] [7점](부분점수 있음)<br>두 함수 $f(x)=4x^4-3x^3-10x^2-6$, $g(x)=x^4+x^3+2x^2-a$에 대하여 $y=f(x)$의 그래프가 $y=g(x)$의 그래프보다 항상 위쪽에 있을 때, 실수 $a$의 값의 범위를 구하는 풀이 과정을 자세히 서술하시오.
- 원본 보기: []; 정답: $a\gt38$
- 기존 solution 원문:
```text
$y=f(x)$가 언제나 $y=g(x)$보다 위쪽에 있으려면 모든 실수 $x$에 대하여 $f(x)-g(x)>0$이어야 한다.

차를 $F(x)$로 두면
$F(x)=4x^4-3x^3-10x^2-6-(x^4+x^3+2x^2-a)$
$=3x^4-4x^3-12x^2+a-6$이다.

이 함수의 최솟값을 구하기 위해 미분한다.
$F'(x)=12x^3-12x^2-24x$
$=12x(x+1)(x-2)$이다.

도함수의 부호를 구간별로 살피면
$x<-1$에서 음,
$-1<x<0$에서 양,
$0<x<2$에서 음,
$x>2$에서 양이다.

따라서 $x=-1$과 $x=2$에서 극소, $x=0$에서 극대이다.
극솟값을 각각 구하면
$F(-1)=3+4-12+a-6=a-11$
$F(2)=48-32-48+a-6=a-38$이다.

$F(x)$는 최고차항의 계수가 양수인 사차함수이므로 양쪽 끝으로 갈수록 값이 커진다.
$a-38<a-11$이므로 전체 실수에서의 최솟값은 $x=2$에서의 $a-38$이다.

그래프가 만나지 않고 항상 위에 있으려면 이 최솟값도 양수여야 한다.
$a-38>0$
$a>38$이다.

따라서 구하는 범위는 $a\gt38$이다.
```
- 판정/검산: KEEP: F=f-g=3x⁴-4x³-12x²+a-6, F'=12x(x+1)(x-2). 극소 F(-1)=a-11,F(2)=a-38 중 최솟값 a-38>0으로 a>38. '항상 위'의 엄격 부등식 처리.
- 원본 그림/학생 렌더: NOT_RUN.

## Q23 — KEEP
- ordinal 23, id 23, sourceIdentityKey NOT_PRESENT
- 문제 원문: [주관식3 (서술형)] [7점](부분점수 있음)<br>두 함수 $f(x)=\begin{cases}x&(x\gt0)\\0&(x\le0)\end{cases}$, $g(x)=a(x-1)^2+b$에 대하여 함수 $h(x)$를 $h(x)=f(x)-f(x-c)-f(x-2+c)$라 하자. 함수 $y=h(x)$의 그래프와 함수 $y=g(x)$의 그래프가 서로 다른 세 점 $(\alpha,h(\alpha))$, $(\beta,h(\beta))$, $(\gamma,h(\gamma))$에서 접하고 $\gamma=1+\alpha$일 때, $\displaystyle\int_\alpha^\gamma g(x)dx$의 값을 구하는 풀이 과정을 자세히 서술하시오. (단, $a$, $b$, $c$는 상수이고, $0\lt c\lt1$이고, $\alpha\lt\beta\lt\gamma$이다.)
- 원본 보기: []; 정답: $\dfrac23$
- 기존 solution 원문:
```text
$0<c<1$이므로 꺾은선 $h(x)$를 구간별로 먼저 구한다.

$h(x)=f(x)-f(x-c)-f(x-2+c)$에서
$\displaystyle h(x)=\begin{cases}
0&(x\le0)\\
x&(0<x\le c)\\
c&(c<x\le2-c)\\
2-x&(x>2-c)
\end{cases}$이다.

따라서 세 접점이 놓이는 기울기 $1,0,-1$의 구간을 각각 고려한다.
포물선 $g(x)=a(x-1)^2+b$의 도함수는
$g'(x)=2a(x-1)$이다.

가운데 수평구간에서 접하는 점은 $g'(x)=0$이어야 하므로
$\beta=1$이다.
또 $h(1)=c$, $g(1)=b$이므로
$b=c$이다.

왼쪽 기울기 $1$인 구간의 접점에서는
$g'(\alpha)=2a(\alpha-1)=1$이다. ①
오른쪽 기울기 $-1$인 구간의 접점에서는
$g'(\gamma)=2a(\gamma-1)=-1$이다. ②

①과 ②를 더하면
$2a(\alpha+\gamma-2)=0$이다.
$a\ne0$이므로 $\alpha+\gamma=2$이다.

주어진 $\gamma=1+\alpha$를 대입하면
$\alpha+(1+\alpha)=2$
$2\alpha=1$
$\alpha=\dfrac12,\quad\gamma=\dfrac32$이다.

①에 대입하면
$\displaystyle2a\left(\dfrac12-1\right)=1$
$-a=1$이므로 $a=-1$이다.

왼쪽 접점이 두 그래프 위에 있으므로
$\displaystyle g\left(\dfrac12\right)=h\left(\dfrac12\right)=\dfrac12$이다.
$\displaystyle-\left(\dfrac12-1\right)^2+b=\dfrac12$
$-\dfrac14+b=\dfrac12$
$b=\dfrac34$이다.
따라서 $c=\dfrac34$이다.

이 값은 $0<\alpha<c<1<2-c<\gamma$를 만족하며 세 점 모두 실제로 접한다.
$\displaystyle g(x)=-(x-1)^2+\dfrac34$
$=-x^2+2x-\dfrac14$이다.

이제 요구한 정적분을 계산한다.
$\displaystyle\int_{1/2}^{3/2}g(x)\,dx$
$\displaystyle=\left[-\dfrac{x^3}{3}+x^2-\dfrac x4\right]_{1/2}^{3/2}$이다.

위끝값은
$\displaystyle-\dfrac98+\dfrac94-\dfrac38=\dfrac34$,
아래끝값은
$\displaystyle-\dfrac1{24}+\dfrac14-\dfrac18=\dfrac1{12}$이다.

따라서
$\displaystyle\int_{1/2}^{3/2}g(x)\,dx$
$\displaystyle=\dfrac34-\dfrac1{12}=\dfrac23$이다.
따라서 구하는 값은 $\dfrac23$이다.
```
- 판정/검산: KEEP: h의 기울기 1,0,-1인 세 구간에 접한다는 조건에서 β=1,b=c, α+γ=2 및 γ=α+1로 α=1/2,γ=3/2. a=-1,b=c=3/4, 적분 2/3. 세 접점 구간 0<α<c<1<2-c<γ 재확인.
- 원본 그림/학생 렌더: NOT_RUN.

## 완료 경계
- EXAM_AUDIT_COMPLETE / EXAM_DRAFT_COMPLETE: 문항 23개 판정·원문 해설 인용 기록, UPGRADE 0. Q03(부정적분 보기 해석), Q11(속도 그림) HOLD 2개 미해결.
- Golden/Negative, core 문서 전수, 학생 화면, SVG 독립 검수 NOT_RUN. 운영 PASS 아님. 다음 시험지는 같은 2final 구분의 미감사 원본에서 선택.
