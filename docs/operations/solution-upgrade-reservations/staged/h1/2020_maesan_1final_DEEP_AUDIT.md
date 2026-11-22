# 2020 매산고 고1 1학기 기말 기출 — 학생용 해설 심층 감사
- lane: **lane30**; 범위: `h1/1final` 원본 기출, 최신 연도부터 과거 순서. `standardCourse=수학(상)` (2015 개정 고1).
- sourcePath: `archive/exams/original/high/h1/1final/20_매산고_1학기_기말_고1_기출.js`
- sourceBlobSha: `24ba5ea6fd090d97de81de968f0d9e895a49cc7a` (원본 JS 고정; **JS·SVG·main 수정 없음**).
- **전 문항 원문(content)·보기·answer·기존 solution 20/20건 판독 및 q1~q20별 판정:** **KEEP 15 / UPGRADE 0 / HOLD 5 / UNREAD 0**. UPGRADE에는 학생용 개선 풀이 전문을 별도 수록.
- 원본 PNG **6개**(그림이 연결된 문항 5개)의 원격 Git blob 실제 수신 및 SHA 확인 완료. **픽셀 시각 판독은 미실시**, 수신을 VISUAL_PASS로 취급하지 않음. 그림 문항은 HOLD 또는 UPGRADE+VISUAL_HOLD.
- **EXAM_AUDIT_COMPLETE / EXAM_DRAFT_COMPLETE (이 MD 초안 범위)**. 미완료: 원본 PNG 시각 판독, SVG primitive/학생 렌더, Golden/Negative, 출고 검증은 **NOT_RUN / VISUAL_HOLD**. 따라서 **출고 PASS 아님**.
- 판정 규칙: `KEEP`=기존 풀이의 텍스트 계산·정답 정합성이 확인됨, `UPGRADE`=학생용 대안 또는 수식 표기 개선 필요, `HOLD`=원문 그림 실물 판독을 요구하여 보류, `UNREAD`=원문 텍스트 미확보. 이는 수학적/문자열 텍스트 감사로서 브라우저 렌더 및 화면 QA를 대체하지 않는다.

## Q1 — KEEP

**원문 문제(content):** $x^2+ax+3=(x-1)P(x)$이 항등식일 때, $P(4)$의 값은? [3.8점]

**원문 보기(choices):** ["$1$","$2$","$3$","$4$","$5$"]

**원문 정답(answer):** ①

**기존 solution (전문, 수정·생략 없이 인용):**

```text
항등식은 모든 $x$에 대하여 성립하므로 $x=1$을 대입한다.
$1+a+3=0$이므로 $a=-4$이다.
따라서
$x^2+ax+3=x^2-4x+3=(x-1)(x-3)$이다.
$(x-1)P(x)=(x-1)(x-3)$이므로 $P(x)=x-3$이다.
그러므로 $P(4)=4-3=1$이고, 정답은 ①이다.
```

**판정·계산 근거:** x=1 대입으로 a=-4를 구하고 P(x)=x-3에서 P(4)=1을 확인했다.

## Q2 — KEEP

**원문 문제(content):** 이차방정식 $x^2+3x-1=0$의 두 근을 $\alpha,\beta$라 할 때, $\dfrac{1}{\alpha}+\dfrac{1}{\beta}$의 값은? [4.1점]

**원문 보기(choices):** ["$-3$","$-1$","$0$","$1$","$3$"]

**원문 정답(answer):** ⑤

**기존 solution (전문, 수정·생략 없이 인용):**

```text
이차방정식의 두 근에 대하여 근과 계수의 관계를 쓰면
$\alpha+\beta=-3,\quad\alpha\beta=-1$이다.
따라서
$\dfrac1\alpha+\dfrac1\beta
=\dfrac{\alpha+\beta}{\alpha\beta}
=\dfrac{-3}{-1}=3$이다.
그러므로 정답은 ⑤이다.
```

**판정·계산 근거:** 두 근의 합 -3, 곱 -1을 사용해 역수 합 3이다.

## Q3 — KEEP

**원문 문제(content):** 이차함수 $y=x^2+2x+5$와 $y=ax+1$가 한 점에서 만날 때, 양수 $a$의 값은? [4.0점]

**원문 보기(choices):** ["$3$","$4$","$5$","$6$","$7$"]

**원문 정답(answer):** ④

**기존 solution (전문, 수정·생략 없이 인용):**

```text
두 그래프의 교점에서는 두 식의 $y$값이 같으므로
$x^2+2x+5=ax+1$
$x^2+(2-a)x+4=0$
한 점에서 만나려면 교점 방정식이 중근을 가져야 하므로 판별식이 0이다.
$(2-a)^2-4\cdot1\cdot4=0$
$(2-a)^2=16$
$2-a=4$ 또는 $2-a=-4$
$a=-2$ 또는 $a=6$
문제에서 $a>0$이므로 $a=6$이다. 따라서 정답은 ④이다.
```

**판정·계산 근거:** 교점의 판별식 (2-a)²-16=0과 a>0에서 a=6이다.

**해설 이미지:** `archive/assets/images/20_매산고_1학기_기말_고1_기출/q3-solution-v2.svg` (SVG primitive/학생 렌더·Golden/Negative **NOT_RUN/VISUAL_HOLD**).

## Q4 — KEEP

**원문 문제(content):** 이차 부등식 $x^2+ax+b<0$의 해가 $-2<x<1$일 때, 이차부등식 $x^2+bx+a\le0$를 만족하는 해 중 정수 $x$값의 합은? [3.9점]

**원문 보기(choices):** ["$-3$","$1$","$5$","$9$","$13$"]

**원문 정답(answer):** ②

**기존 solution (전문, 수정·생략 없이 인용):**

```text
$x^2+ax+b<0$의 해가 $-2<x<1$이므로 두 근은 $-2,1$이다.
최고차항의 계수가 $1$이어서
$x^2+ax+b=(x+2)(x-1)=x^2+x-2$이다.
따라서 $a=1,\ b=-2$이다.
이 값을 두 번째 부등식에 대입하면
$x^2-2x+1\le0$, 즉 $(x-1)^2\le0$이다.
제곱은 음수가 될 수 없으므로 해는 $x=1$뿐이다.
정수해의 합은 $1$이고, 정답은 ②이다.
```

**판정·계산 근거:** 첫 식은 (x+2)(x-1), 둘째는 (x-1)²≤0으로 정수해 x=1이다.

**해설 이미지:** `archive/assets/images/20_매산고_1학기_기말_고1_기출/q4-solution-v2.svg` (SVG primitive/학생 렌더·Golden/Negative **NOT_RUN/VISUAL_HOLD**).

## Q5 — KEEP

**원문 문제(content):** 두 점 $A(a,1), B(1,a+1)$에 대하여 $\overline{AB}=\sqrt5$이고 $a>0$일 때, 상수 $a$의 값은? [4.1점]

**원문 보기(choices):** ["$0$","$1$","$2$","$3$","$4$"]

**원문 정답(answer):** ③

**기존 solution (전문, 수정·생략 없이 인용):**

```text
두 점 사이 거리의 제곱은 $x$좌표 차와 $y$좌표 차의 제곱의 합이다.
$\overline{AB}^{\,2}=(1-a)^2+((a+1)-1)^2$
$\overline{AB}=\sqrt5$이므로 $\overline{AB}^{\,2}=5$이다.
$(a-1)^2+a^2=5$
$a^2-2a+1+a^2=5$
$2a^2-2a-4=0$
$a^2-a-2=0$
$(a-2)(a+1)=0$
$a=2$ 또는 $a=-1$
조건 $a>0$에 맞는 값은 $a=2$이다. 따라서 정답은 ③이다.
```

**판정·계산 근거:** 거리식 (1-a)²+a²=5에서 a=2,-1 중 양수 2다.

**해설 이미지:** `archive/assets/images/20_매산고_1학기_기말_고1_기출/q5-solution-v2.svg` (SVG primitive/학생 렌더·Golden/Negative **NOT_RUN/VISUAL_HOLD**).

## Q6 — KEEP

**원문 문제(content):** 점 $(3,4)$를 지나고 $x$축에 수직인 직선의 방정식은? [4.2점]

**원문 보기(choices):** ["$y-4=(x-3)$","$y=4$","$x=3$","$y=3x+4$","$4y=3x$"]

**원문 정답(answer):** ③

**기존 solution (전문, 수정·생략 없이 인용):**

```text
$x$축에 수직인 직선은 세로로 뻗는 직선이므로 방정식은 $x=c$ 꼴이다.
이 직선이 $(3,4)$를 지나려면 $c=3$이어야 한다.
따라서 직선의 방정식은 $x=3$이고, 정답은 ③이다.
```

**판정·계산 근거:** x축에 수직이고 (3,4)를 지나므로 x=3이다.

**해설 이미지:** `archive/assets/images/20_매산고_1학기_기말_고1_기출/q6-solution-v2.svg` (SVG primitive/학생 렌더·Golden/Negative **NOT_RUN/VISUAL_HOLD**).

## Q7 — KEEP

**원문 문제(content):** 직선 $ax+2y+1=0$을 $x$축의 방향으로 1만큼, $y$축의 방향으로 $a$만큼 평행이동하면 직선 $ax+2y+b=0$과 일치하고 $-ax+2y+2=0$과 서로 수직일 때, $a+b$의 값은? (단, $a>0$) [4.4점]

**원문 보기(choices):** ["$-3$","$-1$","$1$","$3$","$5$"]

**원문 정답(answer):** ①

**기존 solution (전문, 수정·생략 없이 인용):**

```text
원래 직선을 오른쪽으로 $1$, 위로 $a$만큼 옮기려면 식의 $x$에 $x-1$, $y$에 $y-a$를 대입한다.
$a(x-1)+2(y-a)+1=0$,
즉 $ax+2y-3a+1=0$이다.
따라서 $b=1-3a$이다.
두 직선의 기울기는 각각 $-\dfrac a2$, $\dfrac a2$이다.
수직이므로 기울기의 곱이 $-1$이다.
$-\dfrac{a^2}{4}=-1$에서 $a^2=4$이고, $a>0$이므로 $a=2$이다.
$b=1-3\cdot2=-5$이므로 $a+b=-3$이다.
정답은 ①이다.
```

**판정·계산 근거:** 평행이동 후 b=1-3a, 수직 기울기 조건 a=2에서 a+b=-3이다.

**해설 이미지:** `archive/assets/images/20_매산고_1학기_기말_고1_기출/q7-solution-v2.svg` (SVG primitive/학생 렌더·Golden/Negative **NOT_RUN/VISUAL_HOLD**).

## Q8 — KEEP

**원문 문제(content):** 원 $x^2+y^2=r^2$에 대하여 원 위의 한 점이 $(3,4)$일 때, 기울기가 $-1$인 접선의 방정식을 구하면? [4.3점]

**원문 보기(choices):** ["$y=-x\\pm5\\sqrt2$","$y=-x\\pm5\\sqrt3$","$y=-x\\pm5\\sqrt5$","$y=-x\\pm6\\sqrt2$","$y=-x\\pm6\\sqrt3$"]

**원문 정답(answer):** ①

**기존 solution (전문, 수정·생략 없이 인용):**

```text
$(3,4)$가 원 위에 있으므로 $r^2=3^2+4^2=25$, 따라서 $r=5$이다.
기울기가 $-1$인 직선을 $y=-x+c$, 즉 $x+y-c=0$이라 하자.
원의 중심은 원점이므로 중심에서 이 직선까지의 거리는
$\dfrac{|c|}{\sqrt{1^2+1^2}}=\dfrac{|c|}{\sqrt2}$이다.
접할 때 이 거리는 반지름 $5$와 같으므로 $|c|=5\sqrt2$이다.
따라서 접선은 $y=-x+5\sqrt2$, $y=-x-5\sqrt2$이고, 정답은 ①이다.
```

**판정·계산 근거:** 원 반지름5, 원점-접선 거리 |c|/√2=5이므로 y=-x±5√2다.

**해설 이미지:** `archive/assets/images/20_매산고_1학기_기말_고1_기출/q8-solution-v2.svg` (SVG primitive/학생 렌더·Golden/Negative **NOT_RUN/VISUAL_HOLD**).

## Q9 — KEEP

**원문 문제(content):** 두 점 $(0,1)$과 $(4,1)$을 지름의 양 끝 점으로 하는 원이 직선 $y=-x+k$와 두 점에서 만날 때, 정수 $k$의 개수는? [4.4점]

**원문 보기(choices):** ["$1$","$2$","$3$","$4$","$5$"]

**원문 정답(answer):** ⑤

**기존 solution (전문, 수정·생략 없이 인용):**

```text
지름의 중점이 원의 중심이므로
$O=\left(\frac{0+4}{2},\frac{1+1}{2}\right)$
$O=(2,1)$이다.
지름의 길이는
$\overline{AB}=\sqrt{(4-0)^2+(1-1)^2}$
$\overline{AB}=4$이므로 반지름은 $r=\frac{AB}{2}=2$이다.
직선 $y=-x+k$를 $x+y-k=0$으로 쓰면 중심 $O$에서 직선까지의 거리는
$d=\frac{|2+1-k|}{\sqrt{1^2+1^2}}$
$d=\frac{|3-k|}{\sqrt2}$이다.
원과 직선이 서로 다른 두 점에서 만나려면 중심과 직선 사이 거리가 반지름보다 작아야 한다.
$\frac{|3-k|}{\sqrt2}<2$
$|3-k|<2\sqrt2$
$-2\sqrt2<3-k<2\sqrt2$
$3-2\sqrt2<k<3+2\sqrt2$
$4<8<9$이므로 $2<2\sqrt2<3$이다.
따라서 $0<3-2\sqrt2<1$이고 $5<3+2\sqrt2<6$이다.
이 범위에 있는 정수 $k$는 $1,2,3,4,5$로 다섯 개이다. 따라서 정답은 ⑤이다.
```

**판정·계산 근거:** 원 중심 (2,1), 반지름2에서 거리조건 |3-k|<2√2를 만족하는 정수는 1~5의 다섯 개다.

**해설 이미지:** `archive/assets/images/20_매산고_1학기_기말_고1_기출/q9-solution-v2.svg` (SVG primitive/학생 렌더·Golden/Negative **NOT_RUN/VISUAL_HOLD**).

## Q10 — KEEP

**원문 문제(content):** 두 점 $A(1,-1), B(2,2)$에 대하여 선분 $\overline{AB}$를 $a:2$로 내분한 점이 $x$축 위에, 선분 $\overline{AB}$를 $b:2$로 외분한 점이 $y$축 위에 있을 때, $a+b$의 값은? (단, $a,b>0$인 상수) [4.4점]

**원문 보기(choices):** ["$0$","$1$","$2$","$3$","$4$"]

**원문 정답(answer):** ③

**기존 solution (전문, 수정·생략 없이 인용):**

```text
내분점의 좌표 공식에 따라 선분 AB를 a:2로 내분하는 점 P의 y좌표는
$\dfrac{2(-1)+a\cdot2}{a+2}$이다.
P가 x축 위에 있으므로 이 값은 0이다.
$-2+2a=0$에서 $a=1$이다.

외분점 Q에 대하여 AQ:QB=b:2이다. 외분점의 좌표 공식에 따라 Q의 x좌표는
$\dfrac{2\cdot1-b\cdot2}{2-b}$이다.
Q가 y축 위에 있으므로 이 값은 0이다.
$2-2b=0$에서 $b=1$이다.

따라서 $a+b=1+1=2$이고, 정답은 ③이다.
```

**판정·계산 근거:** 내분점의 y=0에서 a=1, 외분점의 x=0에서 b=1이므로 합2다.

**해설 이미지:** `archive/assets/images/20_매산고_1학기_기말_고1_기출/q10-solution-v2.svg` (SVG primitive/학생 렌더·Golden/Negative **NOT_RUN/VISUAL_HOLD**).

## Q11 — KEEP

**원문 문제(content):** 원 $x^2+2ax+y^2-6y+4=0$가 $x$축에 접할 때, $y=-x-1$와 원이 만나는 점을 각각 $A,B$라 하자. 선분 $\overline{AB}$의 길이를 구하면? (단, $a>0$인 상수) [4.6점]

**원문 보기(choices):** ["$2\\sqrt2$","$2\\sqrt5$","$2\\sqrt7$","$4\\sqrt3$","$4\\sqrt5$"]

**원문 정답(answer):** ③

**기존 solution (전문, 수정·생략 없이 인용):**

```text
완전제곱식을 만들면
$(x+a)^2+(y-3)^2=a^2+5$이다.
원의 중심은 $(-a,3)$, 반지름은 $\sqrt{a^2+5}$이다.
$x$축에 접하므로 반지름은 중심에서 $x$축까지의 거리 $3$과 같다.
$a^2+5=9$이어서 $a=2$이다. (조건 $a>0$ 사용)
따라서 중심은 $C(-2,3)$이고 반지름은 $3$이다.
직선 $y=-x-1$은 $x+y+1=0$이므로 중심에서 직선까지의 거리는
$\dfrac{|-2+3+1|}{\sqrt2}=\sqrt2$이다.
원의 중심에서 현에 내린 수선은 현을 이등분하므로 현의 길이는
$2\sqrt{3^2-(\sqrt2)^2}=2\sqrt7$이다.
정답은 ③이다.
```

**판정·계산 근거:** 원 중심 (-2,3), 반지름3와 직선 거리√2로 현의 길이를 계산했다.

**해설 이미지:** `archive/assets/images/20_매산고_1학기_기말_고1_기출/q11-solution-v2.svg` (SVG primitive/학생 렌더·Golden/Negative **NOT_RUN/VISUAL_HOLD**).

## Q12 — KEEP

**원문 문제(content):** 원 $O: x^2+y^2+ax-2y-1=0$을 원점에 대하여 대칭이동한 원을 $O'$라고 하자. 원 $O$의 중심과 원 $O'$의 중심 사이의 거리가 $\sqrt8$이라고 할 때, 원 $O$의 넓이는? [4.6점]

**원문 보기(choices):** ["$3\\pi$","$5\\pi$","$7\\pi$","$9\\pi$","$11\\pi$"]

**원문 정답(answer):** ①

**기존 solution (전문, 수정·생략 없이 인용):**

```text
완전제곱식을 만들면
$x^2+ax=\left(x+\frac a2\right)^2-\frac{a^2}{4}$
$y^2-2y=(y-1)^2-1$
따라서 원 $O$의 방정식은
$\left(x+\frac a2\right)^2+(y-1)^2=\frac{a^2}{4}+2$이다.
그러므로 중심은 $O\left(-\frac a2,1\right)$이고, 원점 대칭한 원 $O'$의 중심은 $O'\left(\frac a2,-1\right)$이다.
두 중심의 $x$좌표 차는 $a$이고 $y$좌표 차는 $-2$이므로
$OO'^2=a^2+(-2)^2$
$OO'^2=a^2+4$이다.
$OO'=\sqrt8$이므로
$a^2+4=8$
$a^2=4$
원의 반지름 제곱은 $\frac{a^2}{4}+2=3$이다.
원의 넓이는 $3\pi$이므로 정답은 ①이다.
```

**판정·계산 근거:** 원점대칭 중심 거리 √(a²+4)=√8에서 a²=4, 넓이는 3π다.

**해설 이미지:** `archive/assets/images/20_매산고_1학기_기말_고1_기출/q12-solution-v2.svg` (SVG primitive/학생 렌더·Golden/Negative **NOT_RUN/VISUAL_HOLD**).

## Q13 — KEEP

**원문 문제(content):** 직선 $2x-y+3=0$을 직선 $y=x$에 대하여 대칭이동한 직선이 원 $x^2-2x+y^2+ay+a^2-14=0$을 이등분할 때, 상수 $a^2$의 값은? [4.6점]

**원문 보기(choices):** ["$2$","$4$","$6$","$8$","$10$"]

**원문 정답(answer):** ②

**기존 solution (전문, 수정·생략 없이 인용):**

```text
직선 $y=x$에 대한 대칭이동은 $x$와 $y$를 서로 바꾸는 것이므로
$2y-x+3=0$이다.
원 방정식을 완전제곱식으로 바꾸면
$(x-1)^2+\left(y+\frac a2\right)^2=15-\frac{3a^2}{4}$이다.
따라서 원의 중심은 $\left(1,-\frac a2\right)$이다.
직선이 원을 이등분하려면 원의 중심을 지나야 한다.
중심을 반사된 직선에 대입하면
$2\left(-\frac a2\right)-1+3=0$
$-a+2=0$
$a=2$
따라서 $a^2=4$이고 정답은 ②이다.
```

**판정·계산 근거:** 반사한 직선 2y-x+3=0이 원 중심 (1,-a/2)을 지나면 a=2, a²=4다.

**해설 이미지:** `archive/assets/images/20_매산고_1학기_기말_고1_기출/q13-solution-v2.svg` (SVG primitive/학생 렌더·Golden/Negative **NOT_RUN/VISUAL_HOLD**).

## Q14 — HOLD

**원문 문제(content):** 그림과 같이 중심이 곡선 $y=x^2-x-3$ 위에 있고 $x$축과 $y$축에 동시에 접하는 원은 4개 있다. 이 네 원의 중심을 각각 $A,B,C,D$라 할 때, 사각형 $ABCD$의 둘레의 길이는? [4.8점]

**원문 보기(choices):** ["$2(\\sqrt6+\\sqrt2)$","$2(2\\sqrt6+\\sqrt2)$","$2(\\sqrt6+2\\sqrt2)$","$4(\\sqrt6+\\sqrt2)$","$2(2\\sqrt6+3\\sqrt2)$"]

**원문 정답(answer):** ④

**기존 solution (전문, 수정·생략 없이 인용):**

```text
원의 중심을 $(u,v)$라 하면 두 축에 접하므로 두 축까지의 거리가 같다.
$|u|=|v|$이므로 $v=u$ 또는 $v=-u$이다.
먼저 $v=u$를 포물선 $y=x^2-x-3$에 대입하면
$u=u^2-u-3$
$u^2-2u-3=0$
$(u-3)(u+1)=0$
$u=3$ 또는 $u=-1$이므로 이 두 중심은 $(3,3),(-1,-1)$이다.
다음으로 $v=-u$를 포물선에 대입하면
$-u=u^2-u-3$
$u^2-3=0$
$(u-\sqrt3)(u+\sqrt3)=0$
$u=\sqrt3$ 또는 $u=-\sqrt3$이므로 두 중심은 $(\sqrt3,-\sqrt3),(-\sqrt3,\sqrt3)$이다.
원본 그림의 점 순서는 $A=(3,3), B=(-\sqrt3,\sqrt3), C=(-1,-1), D=(\sqrt3,-\sqrt3)$이다.
좌표 사이의 거리 공식으로
$AB^2=(3+\sqrt3)^2+(3-\sqrt3)^2$
$AB^2=(12+6\sqrt3)+(12-6\sqrt3)$
$AB^2=24$
$AB=2\sqrt6$
$BC^2=(\sqrt3-1)^2+(\sqrt3+1)^2$
$BC^2=(4-2\sqrt3)+(4+2\sqrt3)$
$BC^2=8$
$BC=2\sqrt2$
$CD^2=(\sqrt3+1)^2+(1-\sqrt3)^2$
$CD^2=(4+2\sqrt3)+(4-2\sqrt3)$
$CD^2=8$
$CD=2\sqrt2$
$DA^2=(3-\sqrt3)^2+(3+\sqrt3)^2$
$DA^2=(12-6\sqrt3)+(12+6\sqrt3)$
$DA^2=24$
$DA=2\sqrt6$
따라서 둘레는
$AB+BC+CD+DA=2\sqrt6+2\sqrt2+2\sqrt2+2\sqrt6$
$=4(\sqrt6+\sqrt2)$이다. 따라서 정답은 ④이다.
```

**판정·계산 근거:** 축 접원 중심은 (3,3),(-1,-1),(√3,-√3),(-√3,√3), 둘레 4(√6+√2)다.

**원문 이미지 1건:**

- `archive/assets/images/20_매산고_1학기_기말_고1_기출/q14.png` — Git blob SHA `2141e918eb18189a6c78cdb89cc5a398dc749588`; 원격 바이너리 수신, 픽셀 시각 판독 **NOT_RUN/VISUAL_HOLD**.

**HOLD 사유:** 식과 기존 해설 텍스트는 대조했으나 문제 도형·배치·표기와 실제 원본 PNG의 픽셀 일치 여부를 아직 눈으로 확인하지 못했다. 그림 의존 판독 및 출고 판정 보류.

**해설 이미지:** `archive/assets/images/20_매산고_1학기_기말_고1_기출/q14-solution-v2.svg` (SVG primitive/학생 렌더·Golden/Negative **NOT_RUN/VISUAL_HOLD**).

## Q15 — HOLD

**원문 문제(content):** 그림과 같이 한 변의 길이가 $8$인 정삼각형 $ABC$에 대하여 세 점 $D,E,F$는 세 변 $BC,CA,AB$의 중점이고 세 점 $G,H,I$는 세 선분 $BD,DE,CE$의 중점일 때, 다음은 세 직선 $AH,EG,FI$가 한 점 $O(\alpha,\beta)$에서 만나는 것을 보이는 과정이다.\n<img src="assets/images/20_매산고_1학기_기말_고1_기출/q15.png" class="question-img" alt="문제 15 정삼각형 그림">\n그림과 같이 점 $D$를 원점, 직선 $BC$를 $x$축, 직선 $AD$를 $y$축으로 하여 삼각형 $ABC$를 좌표평면 위에 나타내면 세 꼭짓점 $A,B,C$의 좌표는 $A(0,4\sqrt3), B(-4,0), C(4,0)$이다.\n이때 직선 $AH$를 나타내는 방정식은 $y=ax+b$ …… ㉠\n직선 $EG$를 나타내는 방정식은 $y=cx+d$ …… ㉡\n직선 $FI$를 나타내는 방정식은 $y=ex+f$ …… ㉢\n두 직선 ㉠, ㉡의 교점 $O(\alpha,\beta)$는 직선 ㉢도 지난다.\n따라서 세 직선 $AH,EG,FI$는 한 점 $O(\alpha,\beta)$에서 만난다.\n<img src="assets/images/20_매산고_1학기_기말_고1_기출/q15-coordinate.png" class="question-img" alt="문제 15 좌표 그림">\n위의 ㉠, ㉡, ㉢의 직선의 방정식에서 $\dfrac{ad}{e}$의 값은? [4.8점]

**원문 보기(choices):** ["$4\\sqrt3$","$8\\sqrt3$","$9\\sqrt3$","$12\\sqrt3$","$15\\sqrt3$"]

**원문 정답(answer):** ⑤

**기존 solution (전문, 수정·생략 없이 인용):**

```text
점 $D$를 원점으로 두면 $A=(0,4\sqrt3),\ B=(-4,0),\ C=(4,0)$이다.
중점 좌표를 하나씩 구하면
$E=\left(\dfrac{0+4}{2},\dfrac{4\sqrt3+0}{2}\right)=(2,2\sqrt3)$ ($CA$의 중점),
$F=\left(\dfrac{0-4}{2},\dfrac{4\sqrt3+0}{2}\right)=(-2,2\sqrt3)$ ($AB$의 중점),
$G=\left(\dfrac{-4+0}{2},\dfrac{0+0}{2}\right)=(-2,0)$ ($BD$의 중점),
$H=\left(\dfrac{0+2}{2},\dfrac{0+2\sqrt3}{2}\right)=(1,\sqrt3)$ ($DE$의 중점),
$I=\left(\dfrac{4+2}{2},\dfrac{0+2\sqrt3}{2}\right)=(3,\sqrt3)$ ($CE$의 중점)이다.

$AH$의 기울기는
$a=\dfrac{\sqrt3-4\sqrt3}{1-0}=-3\sqrt3$이다.
$A$의 $x$좌표가 $0$이므로 $AH$의 $y$절편은 $b=4\sqrt3$이다.
따라서 ㉠은 $y=-3\sqrt3x+4\sqrt3$이다.

$EG$의 기울기는
$c=\dfrac{2\sqrt3-0}{2-(-2)}=\dfrac{\sqrt3}{2}$이다.
$G=(-2,0)$을 ㉡에 대입하면
$0=-2c+d$이다.
따라서
$d=2c$
$=2\cdot\dfrac{\sqrt3}{2}$
$=\sqrt3$이다.
따라서 ㉡은 $y=\dfrac{\sqrt3}{2}x+\sqrt3$이다.

$FI$의 기울기는
$e=\dfrac{\sqrt3-2\sqrt3}{3-(-2)}=-\dfrac{\sqrt3}{5}$이다.
$I=(3,\sqrt3)$을 ㉢에 대입하면 $\sqrt3=3e+f$이다.
따라서
$f=\sqrt3-3e$
$=\sqrt3-3\left(-\dfrac{\sqrt3}{5}\right)$
$=\sqrt3+\dfrac{3\sqrt3}{5}$
$=\dfrac{5\sqrt3}{5}+\dfrac{3\sqrt3}{5}$
$=\dfrac{8\sqrt3}{5}$이다.
따라서 ㉢은 $y=-\dfrac{\sqrt3}{5}x+\dfrac{8\sqrt3}{5}$이다.

㉠과 ㉡을 연립하면
$-3\sqrt3x+4\sqrt3=\dfrac{\sqrt3}{2}x+\sqrt3$이다.
양변을 $\sqrt3$으로 나누면 $-3x+4=\dfrac{x}{2}+1$이다.
양변에 $2$를 곱하면 $-6x+8=x+2$이다.
따라서 $7x=6$, 즉 $x=\dfrac67$이다.
이를 ㉠에 대입하면
$y=-3\sqrt3\cdot\dfrac67+4\sqrt3$
$=-\dfrac{18\sqrt3}{7}+\dfrac{28\sqrt3}{7}$
$=\dfrac{10\sqrt3}{7}$이다.
따라서 $O=\left(\dfrac67,\dfrac{10\sqrt3}{7}\right)$이다.

이 점을 ㉢에 대입하면
$-\dfrac{\sqrt3}{5}\cdot\dfrac67+\dfrac{8\sqrt3}{5}$
$=-\dfrac{6\sqrt3}{35}+\dfrac{56\sqrt3}{35}$
$=\dfrac{10\sqrt3}{7}$이다.
따라서 $O$도 직선 $FI$ 위에 있다.

마지막으로
$\dfrac{ad}{e}$
$=\dfrac{(-3\sqrt3)(\sqrt3)}{-\sqrt3/5}$
$=\dfrac{-9}{-\sqrt3/5}$
$=\dfrac{45}{\sqrt3}$
$=\dfrac{45\sqrt3}{3}$
$=15\sqrt3$이다.
정답은 ⑤이다.
```

**판정·계산 근거:** 정삼각형을 D 원점에 놓고 중점 좌표와 세 직선 교점 (6/7,10√3/7)을 대조했다.

**원문 이미지 2건:**

- `archive/assets/images/20_매산고_1학기_기말_고1_기출/q15.png` — Git blob SHA `f2a2751082e84e86e66937161fa2e7709edd9636`; 원격 바이너리 수신, 픽셀 시각 판독 **NOT_RUN/VISUAL_HOLD**.
- `archive/assets/images/20_매산고_1학기_기말_고1_기출/q15-coordinate.png` — Git blob SHA `602b288536dd61757b1045cbed7374bfe0818e97`; 원격 바이너리 수신, 픽셀 시각 판독 **NOT_RUN/VISUAL_HOLD**.

**HOLD 사유:** 식과 기존 해설 텍스트는 대조했으나 문제 도형·배치·표기와 실제 원본 PNG의 픽셀 일치 여부를 아직 눈으로 확인하지 못했다. 그림 의존 판독 및 출고 판정 보류.

**해설 이미지:** `archive/assets/images/20_매산고_1학기_기말_고1_기출/q15-solution-v2.svg` (SVG primitive/학생 렌더·Golden/Negative **NOT_RUN/VISUAL_HOLD**).

## Q16 — HOLD

**원문 문제(content):** 그림과 같이 두 변 $\overline{AB}, \overline{BC}$의 길이가 각각 $2, 3$이고 $\angle ABC=90^\circ$인 직각삼각형 $ABC$가 있다. 세 변 $\overline{AB}, \overline{BC}, \overline{CA}$를 $t:(1-t)$로 내분하는 점을 각각 $P,Q,R$라 할 때, 삼각형 $PQR$의 넓이는 $t=\alpha$일 때 최솟값 $S$를 갖는다. $S\times\alpha$의 값은? (단, $0<t<1$) [5점]

**원문 보기(choices):** (서술형, 보기 없음)

**원문 정답(answer):** $\dfrac38$

**기존 solution (전문, 수정·생략 없이 인용):**

```text
좌표를 $A=(0,2), B=(0,0), C=(3,0)$으로 두면
$[ABC]=\frac12\cdot2\cdot3=3$이다.
내분비 $t:(1-t)$에서 전체 비는 $t+(1-t)=1$이므로 각 변에서
$AP/AB=t, PB/AB=1-t, BQ/BC=t, QC/BC=1-t, CR/CA=t, RA/CA=1-t$이다.
같은 끼인각을 갖는 두 삼각형의 넓이비는 양쪽 변의 비를 곱한 값이다.
따라서
$[APR]/[ABC]=(AP/AB)(AR/AC)=t(1-t)$
$[PBQ]/[ABC]=(PB/AB)(BQ/BC)=(1-t)t$
$[QCR]/[ABC]=(QC/BC)(CR/CA)=(1-t)t$
가운데 삼각형은 세 꼭짓점의 작은 삼각형을 뺀 나머지이므로
$S=3(1-3t(1-t))$
$S=9t^2-9t+3$
완전제곱식으로 바꾸면
$S=9(t^2-t)+3$
$S=9\left((t-\frac12)^2-\frac14\right)+3$
$S=9(t-\frac12)^2+\frac34$
$0<t<1$에서 $t=1/2$가 가능하고 제곱항의 최솟값은 0이다.
따라서 $\alpha=1/2$일 때 $S=3/4$이며
$S\alpha=\frac34\cdot\frac12=\frac38$이다.
```

**판정·계산 근거:** 세 작은 꼭짓점 삼각형을 빼면 S=9(t-1/2)²+3/4로 Sα=3/8이다.

**원문 이미지 1건:**

- `archive/assets/images/20_매산고_1학기_기말_고1_기출/q16.png` — Git blob SHA `e97e10cbe83121534112dc028e41c852510e4823`; 원격 바이너리 수신, 픽셀 시각 판독 **NOT_RUN/VISUAL_HOLD**.

**HOLD 사유:** 식과 기존 해설 텍스트는 대조했으나 문제 도형·배치·표기와 실제 원본 PNG의 픽셀 일치 여부를 아직 눈으로 확인하지 못했다. 그림 의존 판독 및 출고 판정 보류.

**해설 이미지:** `archive/assets/images/20_매산고_1학기_기말_고1_기출/q16-solution-v2.svg` (SVG primitive/학생 렌더·Golden/Negative **NOT_RUN/VISUAL_HOLD**).

## Q17 — KEEP

**원문 문제(content):** 두 점 $A(3,2), B(5,9)$와 $y$축 위의 점 $P$에 대하여 $|\overline{AP}-\overline{BP}|$의 값이 최대가 되도록 하는 점 $P$의 $y$좌표를 구하시오. [5점]

**원문 보기(choices):** (서술형, 보기 없음)

**원문 정답(answer):** $-\dfrac{17}{2}$

**기존 solution (전문, 수정·생략 없이 인용):**

```text
두 점 사이의 거리에서 삼각형 부등식을 쓰면
$AP\le AB+BP$이고 $BP\le BA+AP$이다.
따라서 $|AP-BP|\le AB$이다.
등호는 $A,B,P$가 한 직선 위에 있고 $P$가 선분 $AB$ 바깥에 있을 때 성립한다.
$AB$를 지나는 직선의 기울기는 $\dfrac{9-2}{5-3}=\dfrac72$이므로
$y-2=\dfrac72(x-3)$이다.
$P$는 $y$축 위에 있어 $x=0$이므로
$y=2-\dfrac{21}{2}=-\dfrac{17}{2}$이다.
이 점은 $A,B$의 바깥쪽 연장선 위에 있으므로 최댓값을 만든다.
따라서 $P$의 $y$좌표는 $-\dfrac{17}{2}$이다.
```

**판정·계산 근거:** 차의 절댓값 상계 AB는 y축과 AB 연장선 교점에서 달성되어 y=-17/2다.

**해설 이미지:** `archive/assets/images/20_매산고_1학기_기말_고1_기출/q17-solution-v2.svg` (SVG primitive/학생 렌더·Golden/Negative **NOT_RUN/VISUAL_HOLD**).

## Q18 — HOLD

**원문 문제(content):** 그림과 같이 직선 $y=nx$가 두 원 $x^2+(y-4)^2=1$, $(x-k)^2+y^2=9$와 모두 만나지 않도록 하는 자연수 $n$의 개수가 2가 되도록 하는 양수 $k$의 값의 범위는 $\alpha<k\le\beta$이다. $\alpha\beta$의 값을 구하시오. [5점]

**원문 보기(choices):** (서술형, 보기 없음)

**원문 정답(answer):** $\dfrac{9\sqrt{10}}{2}$

**기존 solution (전문, 수정·생략 없이 인용):**

```text
직선 $y=nx$를 $nx-y=0$으로 쓴다.
첫째 원의 중심 $(0,4)$에서 직선까지의 거리는 $\dfrac4{\sqrt{n^2+1}}$이다.
반지름이 $1$이므로 만나지 않으려면 이 거리가 $1$보다 커야 한다.
$n^2<15$이어서 자연수 $n$은 $1,2,3$뿐이다.
둘째 원의 중심 $(k,0)$에서 직선까지의 거리는 $\dfrac{nk}{\sqrt{n^2+1}}$이다.
반지름이 $3$이므로 만나지 않으려면
$k>3\sqrt{n^2+1}/n$이다.
$n=1,2,3$일 때 필요한 경계는 차례로 $3\sqrt2,\ \dfrac{3\sqrt5}{2},\ \sqrt{10}$이다.
세 경계는 $\sqrt{10}<\dfrac{3\sqrt5}{2}<3\sqrt2$ 순서이다.
정확히 두 자연수 $n$이 조건을 만족하려면
$\dfrac{3\sqrt5}{2}<k\le3\sqrt2$이다.
따라서 $\alpha\beta=\dfrac{3\sqrt5}{2}\cdot3\sqrt2=\dfrac{9\sqrt{10}}2$이다.
```

**판정·계산 근거:** 원 중심-직선 거리의 엄격 부등식으로 가능한 n=1,2,3의 경계를 비교했다.

**원문 이미지 1건:**

- `archive/assets/images/20_매산고_1학기_기말_고1_기출/q18.png` — Git blob SHA `3bc870a1a43d8a14bc4a1c9e775e33bc1ba5fece`; 원격 바이너리 수신, 픽셀 시각 판독 **NOT_RUN/VISUAL_HOLD**.

**HOLD 사유:** 식과 기존 해설 텍스트는 대조했으나 문제 도형·배치·표기와 실제 원본 PNG의 픽셀 일치 여부를 아직 눈으로 확인하지 못했다. 그림 의존 판독 및 출고 판정 보류.

**해설 이미지:** `archive/assets/images/20_매산고_1학기_기말_고1_기출/q18-solution-v2.svg` (SVG primitive/학생 렌더·Golden/Negative **NOT_RUN/VISUAL_HOLD**).

## Q19 — HOLD

**원문 문제(content):** 1) $\overline{AB}=4$, $\overline{BC}=6$인 직사각형 $ABCD$에서 변 $BC$ 위에 $\overline{BE}=1$인 점 $E$와 변 $AD$의 중점 $F$를 잡는다. 선분 $EF$에 대하여 직사각형 $ABCD$를 그림과 같이 접었을 때, 대각선 $AC$의 일부가 이동하여 생기는 새로운 선분과 변 $AB$가 만나는 점을 $P$라 하자. 선분 $\overline{BP}$의 길이는? [10점]

**원문 보기(choices):** (서술형, 보기 없음)

**원문 정답(answer):** $\dfrac{56}{17}$

**기존 solution (전문, 수정·생략 없이 인용):**

```text
좌표를 $B=(0,0),\ A=(0,4),\ C=(6,0),\ D=(6,4)$로 둔다.
그러면 $E=(1,0),\ F=(3,4)$이고 접는 선 $EF$의 방정식은 $y=2x-2$이다.
대각선 $AC$의 방정식은 $y=4-\dfrac23x$이므로 두 선의 교점은
$X=\left(\dfrac94,\dfrac52\right)$이다.

그림에서는 C가 있는 쪽이 접히므로, 접힌 뒤 대각선의 C 쪽 부분 $XC$는 $XC'$가 된다. C에서 접는 선에 내린 수선의 발을 M이라 하자. 접는 선의 기울기는 2이므로 수선의 기울기는 $-\dfrac12$이다.
$y=-\dfrac12(x-6)$과 $y=2x-2$를 풀면 $M=(2,2)$이다.
접는 선은 점과 그 반사된 점을 잇는 선분의 수직이등분선이므로 M은 $CC'$의 중점이다. 따라서
$C'=(2\cdot2-6,\ 2\cdot2-0)=(-2,4)$이다.

새 선분 $XC'$의 기울기는
$\dfrac{4-\frac52}{-2-\frac94}=-\dfrac6{17}$이다.
직선 $XC'$의 방정식은
$y-\dfrac52=-\dfrac6{17}\left(x-\dfrac94\right)$이다.
$-2<0<\dfrac94$이므로 $x=0$에서 선분 $XC'$과 만난다. 이때
$y=\dfrac52+\dfrac{27}{34}=\dfrac{56}{17}$이다.
$0<\dfrac{56}{17}<4$이므로 $P=\left(0,\dfrac{56}{17}\right)$는 선분 $AB$ 위에 있다. 따라서
$\overline{BP}=\dfrac{56}{17}$이다.
```

**판정·계산 근거:** 접는 선 EF:y=2x-2에 대한 C의 반사점 C'=(-2,4), 선분 교점 높이 56/17이다.

**원문 이미지 1건:**

- `archive/assets/images/20_매산고_1학기_기말_고1_기출/q19.png` — Git blob SHA `f30ea42d094da681b23d74e77f07697a0011a284`; 원격 바이너리 수신, 픽셀 시각 판독 **NOT_RUN/VISUAL_HOLD**.

**HOLD 사유:** 식과 기존 해설 텍스트는 대조했으나 문제 도형·배치·표기와 실제 원본 PNG의 픽셀 일치 여부를 아직 눈으로 확인하지 못했다. 그림 의존 판독 및 출고 판정 보류.

**해설 이미지:** `archive/assets/images/20_매산고_1학기_기말_고1_기출/q19-solution-v2.svg` (SVG primitive/학생 렌더·Golden/Negative **NOT_RUN/VISUAL_HOLD**).

## Q20 — KEEP

**원문 문제(content):** 점 $A(a,0)$과 점 $B(0,b)$가 $\triangle OAB$의 넓이가 항상 1이 되도록 $x$축, $y$축 위를 각각 움직인다. 선분 $\overline{AB}$를 한 변으로 하는 정사각형 $ABCD$를 제1사분면에 만들고 이 정사각형의 두 대각선의 교점을 $M$이라고 하자. (단, $a,b$는 양수이다.)\n(1) $a+b$의 값의 범위를 구하여라. [4점]\n(2) 점 $M$의 자취를 그림으로 나타내어라. [6점]

**원문 보기(choices):** (서술형, 보기 없음)

**원문 정답(answer):** (1) $2\sqrt2\le a+b$
(2) $y=x$ 위에서 $(\sqrt2,\sqrt2)$를 포함하고 오른쪽 위로 뻗는 반직선

**기존 solution (전문, 수정·생략 없이 인용):**

```text
삼각형 $OAB$의 넓이가 1이므로
$\frac{ab}{2}=1$
$ab=2$
$A=(a,0), B=(0,b)$이므로 $\overrightarrow{AB}=(-a,b)$이다.
이 벡터를 시계 방향으로 90도 회전하면 $(b,a)$이므로 제1사분면의 정사각형 꼭짓점은
$D=(a+b,a), C=(b,a+b)$이다.
두 대각선의 교점 $M$은 $AC$의 중점이므로
$M=\left(\frac{a+b}{2},\frac{a+b}{2}\right)$이다.
산술평균과 기하평균의 관계에서
$a+b\ge2\sqrt{ab}$
$a+b\ge2\sqrt2$
이 값은 $a=b=\sqrt2$일 때 가능하므로 (1)의 범위는 $2\sqrt2\le a+b$이다.
$s=\frac{a+b}{2}$라 두면 $M=(s,s)$이고 $s\ge\sqrt2$이다.
모든 $s\ge\sqrt2$가 가능한지도 확인한다.
$a,b$를 방정식 $z^2-2sz+2=0$의 두 근으로 두면 두 근의 합은 $2s$, 곱은 2이다.
판별식은
$(-2s)^2-4\cdot1\cdot2=4(s^2-2)\ge0$이다.
두 근의 곱이 $2>0$이고 합이 $2s>0$이므로 두 근은 모두 양수이다. 따라서 이 $a,b$는 조건 $ab=2$, $a+b=2s$를 만족한다.
따라서 $M$의 자취는 $y=x$ 위에서 $x\ge\sqrt2$인 반직선이며 끝점 $(\sqrt2,\sqrt2)$를 포함한다.
```

**판정·계산 근거:** ab=2와 정사각형 중심 M=((a+b)/2,(a+b)/2)로 최소 좌표 √2를 확인했다.

**해설 이미지:** `archive/assets/images/20_매산고_1학기_기말_고1_기출/q20-solution-v2.svg` (SVG primitive/학생 렌더·Golden/Negative **NOT_RUN/VISUAL_HOLD**).
