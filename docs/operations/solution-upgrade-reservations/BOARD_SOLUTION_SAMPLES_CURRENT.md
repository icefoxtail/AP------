# 학생용 작은 칠판 해설 — 식 전개 중심 작성 샘플

> 적용: 고1·대수·미적분Ⅰ(수학Ⅱ)·확률과 통계 기존 해설 업그레이드. **품질 작성 예시**이지 독립 검수 완료 Golden Sample, 신규 해설의 답/수학 권위 또는 학생 화면 PASS 증거가 아니다. 대상 문항에서는 항상 최신 원본·문항 이미지·정답·교육과정·현행 `solution`을 다시 확인하고 정본의 Golden/Negative calibration과 실제 렌더를 별도로 수행한다.

## 원칙: 한국어 문장의 길이보다 등호 사이의 연결

1. **코멘트는 결정적인 이유에만 쓴다.** 왜 그 식을 세우는가, 왜 이 구간인가, 왜 나눌 수 있는가, 왜 한 근을 버리는가 등에는 짧은 문장이 필요하다. 이미 식에서 명백한 내용을 문장으로 반복하지 않는다.
2. **결정적 식은 학생이 다음 줄을 만들 수 있게 전개한다.** 괄호 전개, 항 이동, 인수분해, 약분, 경계조건, 대입을 수식으로 보인다. `정리하면`·`계산하면`으로 이 변화를 대체하지 않는다.
3. **등호는 진짜 같은 식일 때만 연결한다.** 경우 나누기나 논리적 함의, 조건 적용은 `이므로`, `따라서`, 화살표 또는 별도 줄로 표현한다. 계산을 길게 늘리는 것 자체를 목표로 하지 않는다.
4. **이미 충분한 해설은 KEEP**한다. 아래 예시와 문체를 일치시키려고 정상 해설을 통째로 재작성하지 않는다.
5. 아래 `학생용 solution 예시` 부분만 학생 노출 내용의 모델이다. 표제·원본 링크·검토 메모를 학생용 `solution`에 붙이지 않는다.

## 예시 1 — 교점·삼각형 넓이: 고1 2025 순천여고 2학기 기말 15번

- [기존 JS](https://github.com/icefoxtail/AP------/blob/main/archive/exams/original/high/h1/2final/25_순천여고_2학기_기말_고1_공통수학2.js), 원본 blob `70cb32b708e1a4209b98b4f83ffaf6fddeeeb220`, sourceQuestionNo 15.
- 바꿔야 할 결함: 좌표 넓이 공식과 판별식 사이의 연결이 갑작스럽다. 큰 삼각형에서 빼는 넓이로 먼저 이해시킨다.

### 학생용 solution 예시

직선 $y=-x+10$은 $x+y=10$이고, 두 좌표축과 $A(10,0)$, $B(0,10)$에서 만난다.

두 교점은 $xy=k>0$, $x+y=10>0$을 만족하므로 모두 제1사분면에 있다.
교점을 $P(p,10-p)$, $Q(q,10-q)$라 하자. ($p>q$)

큰 삼각형에서 양쪽의 작은 삼각형을 빼면 $\triangle OPQ$가 남는다.

$$
\begin{aligned}
[\triangle OAB]&=\frac12\cdot10\cdot10=50,\\
[\triangle OAP]&=\frac12\cdot10\cdot(10-p)=5(10-p),\\
[\triangle OBQ]&=\frac12\cdot10\cdot q=5q.
\end{aligned}
$$

따라서 넓이 $44$를 이용하면

$$
\begin{aligned}
44&=50-5(10-p)-5q\\
&=50-50+5p-5q\\
&=5(p-q),\\
p-q&=\frac{44}{5}.
\end{aligned}
$$

또 두 점은 $y=\dfrac{k}{x}$ 위에 있으므로 $xy=k$이다.

$$
\begin{aligned}
p(10-p)&=k,\\
q(10-q)&=k.
\end{aligned}
$$

따라서

$$
\begin{aligned}
p(10-p)&=q(10-q)\\
10p-p^2&=10q-q^2\\
10p-10q&=p^2-q^2\\
10(p-q)&=(p-q)(p+q).
\end{aligned}
$$

두 교점은 서로 다르므로 $p-q\ne0$이다. 양변을 $p-q$로 나누면

$$p+q=10.$$

앞에서 구한 $p-q=\dfrac{44}{5}$와 더하면

$$
\begin{aligned}
2p&=10+\frac{44}{5}\\
&=\frac{50}{5}+\frac{44}{5}\\
&=\frac{94}{5},\\
p&=\frac{47}{5}.
\end{aligned}
$$

$$
\begin{aligned}
q&=10-p\\
&=\frac{50}{5}-\frac{47}{5}\\
&=\frac35.
\end{aligned}
$$

마지막으로

$$
\begin{aligned}
k&=p(10-p)\\
&=\frac{47}{5}\left(10-\frac{47}{5}\right)\\
&=\frac{47}{5}\cdot\frac35\\
&=\frac{141}{25}.
\end{aligned}
$$

따라서 정답은 ①이다.

## 예시 2 — 합성함수를 그래프 교점으로 보기: 고1 2025 순천여고 18번

- [기존 JS](https://github.com/icefoxtail/AP------/blob/main/archive/exams/original/high/h1/2final/25_순천여고_2학기_기말_고1_공통수학2.js), sourceQuestionNo 18. 현재 JS 기준 **합성함수 문항은 18번**이고 20번은 무리함수 문항이다.
- 그래프가 필요하다면 별도 SVG 엔진에 $y=f(t)$와 $y=2-t$의 두 교점, 그리고 $f(x)=\frac12,2$의 수평선 정보를 인계한다. SVG 자체는 여기서 만들지 않는다.

### 학생용 solution 예시

$$f(f(x))=-f(x)+2$$

에서 안쪽 함숫값을 $t=f(x)$라고 놓으면

$$f(t)=2-t$$

이다.

즉, 그래프 $y=f(t)$와 직선 $y=2-t$의 **교점의 $t$좌표**부터 찾는다.

주어진 그래프에서 $0\le t\le1$일 때 $f(t)=t+1$이므로

$$
\begin{aligned}
t+1&=2-t\\
2t&=1\\
t&=\frac12.
\end{aligned}
$$

$1\le t\le2$일 때 $f(t)=-2t+4$이므로

$$
\begin{aligned}
-2t+4&=2-t\\
-2t+t&=2-4\\
-t&=-2\\
t&=2.
\end{aligned}
$$

두 값은 각각 해당 구간에 속한다.

$t=f(x)$였으므로 이제

$f(x)=\dfrac12$ 또는 $f(x)=2$

를 풀면 된다.

$f(x)=\frac12$일 때, $0\le x<1$에서는 $f(x)=x+1\ge1$이므로 불가능하다.
$1\le x\le2$에서

$$
\begin{aligned}
-2x+4&=\frac12\\
-2x&=\frac12-4\\
&=-\frac72\\
x&=\frac74.
\end{aligned}
$$

$f(x)=2$일 때는 그래프의 꼭짓점 $x=1$이 해당한다.
실제로

$$-2(1)+4=2$$

이다.

따라서 모든 실근의 합은

$$
\frac74+1=\frac74+\frac44=\frac{11}{4}
$$

이므로 정답은 ⑤이다.

## 예시 3 — 역함수의 합성: 고1 2025 순천여고 서술형 19번

- [기존 JS](https://github.com/icefoxtail/AP------/blob/main/archive/exams/original/high/h1/2final/25_순천여고_2학기_기말_고1_공통수학2.js), sourceQuestionNo 19.
- 목표: $g\circ f=I$에서 갑자기 $a=f(f(1))$로 뛰지 않고, 양변에 함수를 적용하는 순서를 보여 준다.

### 학생용 solution 예시

주어진 함수를 완전제곱식으로 쓰면

$$
f(x)=
\begin{cases}
4-(x-2)^2&(x\ge2),\\
4+(x-2)^2&(x<2)
\end{cases}
$$

이다.

$x<2$에서는 $f(x)$가 $4$보다 크고 계속 감소하며, $x\ge2$에서는 $4$부터 계속 감소한다.
두 구간의 치역은 각각 $(4,\infty)$, $(-\infty,4]$이다.

따라서 $f$는 서로 다른 입력값에 서로 다른 함숫값을 대응시키고, 모든 실숫값을 갖는다. 그러므로 $g=f^{-1}$이다.

$$g(g(a))=1$$

의 양변에 $f$를 적용한다.

$$f(g(g(a)))=f(1)$$

$f$와 $g$는 서로 역함수이므로 $f(g(u))=u$이다.

$$g(a)=f(1)$$

$x=1<2$이므로

$$
\begin{aligned}
g(a)&=f(1)\\
&=1^2-4\cdot1+8\\
&=1-4+8\\
&=5.
\end{aligned}
$$

이번에는 $g(a)=5$의 양변에 $f$를 적용한다.

$$
\begin{aligned}
f(g(a))&=f(5)\\
a&=f(5).
\end{aligned}
$$

$5\ge2$이므로

$$
\begin{aligned}
a&=-5^2+4\cdot5\\
&=-25+20\\
&=-5.
\end{aligned}
$$

따라서 구하는 값은 $-5$이다.

## 예시 4 — 확률의 대칭성과 표준화: 2025 순천고 고2 확률과 통계 14번

- [기존 JS](https://github.com/icefoxtail/AP------/blob/main/archive/exams/original/high/h2/2final/25_순천고_2학기_기말_고2_확률과통계.js), 원본 blob `99b9133152e7368ec2032a91a7d17f694d9faf36`, sourceQuestionNo 14.
- 목표: 꼬리확률의 합이 1인 이유를 한 문장으로 연결한 뒤, 나머지는 표준화 식으로 진행한다.

### 학생용 solution 예시

표본평균의 평균은 $m$, 표준편차는 $\dfrac{\sigma}{\sqrt n}$이므로

$$
X\sim N(m,\sigma^2),\qquad
\bar X\sim N\left(m,\frac{\sigma^2}{n}\right)
$$

이다.

정규분포는 평균을 중심으로 대칭이다. 두 오른쪽 꼬리확률의 합이 $1$이면 표준화한 경계값은 서로 부호가 반대이다.

(가)에서

$$
\begin{aligned}
\frac{12-m}{\sigma}
&=-\frac{12-m}{\sigma/\sqrt n}\\
&=-\frac{(12-m)\sqrt n}{\sigma}.
\end{aligned}
$$

양변에 $\sigma$를 곱하면

$$
\begin{aligned}
12-m&=-(12-m)\sqrt n\\
(12-m)+(12-m)\sqrt n&=0\\
(12-m)(1+\sqrt n)&=0.
\end{aligned}
$$

$n$은 자연수이므로 $1+\sqrt n>0$이다. 따라서

$$m=12$$

이다.

(나)에 $m=12$를 대입하면

$$
\begin{aligned}
\frac{16-12}{\sigma}
&=-\frac{10-12}{\sigma/\sqrt n}\\
\frac4{\sigma}
&=\frac{2\sqrt n}{\sigma}\\
4&=2\sqrt n\\
\sqrt n&=2\\
n&=4.
\end{aligned}
$$

따라서

$$m+2n=12+2\cdot4=20$$

이므로 정답은 ③이다.

## 예시 5 — 고난도 함수의 접점 조건: 2025 매산고 고2 수학Ⅱ 7번

- [기존 JS](https://github.com/icefoxtail/AP------/blob/main/archive/exams/original/high/h2/2final/25_매산고_2학기_기말_고2_수학II.js), 원본 blob `e9284b08323fda37dea29e82595c3b0557b4aa31`, sourceQuestionNo 7.
- 목표: 실근이 4개라는 조건과 그래프의 접점을 연결하는 이유는 짧게 설명하고, 계산은 등호로 전개한다.

### 학생용 solution 예시

$f(-x)+f(x)=0$이므로 $f$는 홀함수이다.
최고차항의 계수가 $1$인 삼차함수이므로

$$f(x)=x^3+px$$

로 놓을 수 있다.

$$|f(x)|=16$$

은

$f(x)=16$ 또는 $f(x)=-16$이다.

이다.

홀함수의 대칭성 때문에 두 방정식은 실근의 개수가 같다.
전체 실근이 $4$개이므로 각각 서로 다른 실근을 $2$개씩 갖는다.

삼차함수의 그래프가 수평선 $y=16$과 서로 다른 두 점에서 만나려면 한 점에서는 **접하고**, 다른 점에서는 지나야 한다.

그 접점은 왼쪽 극대점이다. $x=-r$ ($r>0$)라 놓으면

$$f'(-r)=0,\qquad f(-r)=16$$

이다.

먼저 도함수는

$$f'(x)=3x^2+p$$

이므로

$$
\begin{aligned}
f'(-r)&=3(-r)^2+p\\
&=3r^2+p\\
&=0,\\
p&=-3r^2.
\end{aligned}
$$

또 $f(-r)=16$이므로

$$
\begin{aligned}
(-r)^3+p(-r)&=16\\
-r^3-pr&=16.
\end{aligned}
$$

$p=-3r^2$를 대입하면

$$
\begin{aligned}
-r^3-(-3r^2)r&=16\\
-r^3+3r^3&=16\\
2r^3&=16\\
r^3&=8\\
r&=2.
\end{aligned}
$$

따라서

$$p=-3\cdot2^2=-12$$

이다.

$$
\begin{aligned}
f(1)&=1^3+p\cdot1\\
&=1-12\\
&=-11.
\end{aligned}
$$

따라서 정답은 ②이다.

## 작업자 최종 점검

- 학생이 `정리하면`을 만나기 전에 실제로 따라갈 수 있는 중간 등식이 보이는가?
- 중요한 식을 **왜** 세웠는지 필요한 한두 문장으로 이해되는가?
- 등호의 좌우가 정확히 같으며, 범위·부호·약분 조건을 건너뛰지 않았는가?
- 그래프는 필요한 교점/값을 먼저 명시하고 별도 SVG 엔진으로 인계했는가?
- 이 예시를 기계 복사하지 않고 실제 대상의 source identity·답·기존 해설을 독립 확인했는가?
- 원래 해설이 충분하면 수정하지 않고 KEEP했는가?
