# 2025 매산고 1학기 중간 대수 — q13
Status: DRAFT_STAGED / NOT_PRODUCTION / REVIEW_REQUIRED

- Source: archive/exams/original/high/h2/1mid/25_매산고_1학기_중간_고2_대수.js
- Source blob SHA: 2b54e1b6b19ecc513632d4679132852a8b9631ea
- sourceIdentityKey: 원본 JS에 명시적 필드 없음. 임시 결속키 = 위 경로 + blob SHA + id:13. 실제 운영 UID 확인 필요.
- qid/id: 13; standardCourse: 대수; answer: ① (-3)
- Before: 판별식과 근의 부호로 두 경우를 나누어 긴 계산을 한다. '양의 근이 없을 조건'을 더 쉬운 부등식으로 판단할 수 있다.
- After (학생용 solution 전체):

$2^x=t$라 놓으면 $t>0$이고 $4^x=t^2$이다. 원래 방정식은
$$t^2+at+3=0\qquad(t>0)$$
이다. 따라서 $t>0$에서 이 식이 $0$이 되지 않도록 하는 정수 $a$의 최솟값을 구한다.

$a\ge0$이면 $t^2+at+3>0$이므로 실근이 없다.

$a<0$이면 완전제곱식으로
$$
\begin{aligned}
t^2+at+3
&=\left(t+\frac a2\right)^2+3-\frac{a^2}{4}.
\end{aligned}
$$
이때 $t=-\frac a2>0$에서 최솟값 $3-\frac{a^2}{4}$를 갖는다. 양의 $t$에서 방정식의 해가 없으려면 이 최솟값이 **엄격히 양수**여야 한다. 최솟값이 $0$이면 양의 중근이 생긴다.

$$
\begin{aligned}
3-\frac{a^2}{4}&>0\\
12-a^2&>0\\
a^2&<12\\
-2\sqrt3&<a<2\sqrt3.
\end{aligned}
$$

$a<0$인 정수 중 이 범위의 최솟값은 $-3$이다. $a\ge0$에서도 모두 가능하므로 전체 정수 $a$의 최솟값은 $-3$이다. 정답은 ①이다.

- Independent check: $a=-3$이면 $t^2-3t+3=(t-\frac32)^2+\frac34>0$; $a=-4$이면 $t=2$에서 $4-8+3=-1$이고 $t\to0^+$에서 양수이므로 양의 근 존재.
- SVG_REQUEST: 없음.
- QA: Golden/Negative 물리적 대조, 이미지, 학생 렌더, preflight SHA-256 receipt NOT_RUN. JS 이행 전 source UID 및 answer 재확인, 보호 필드 diff, 독립 QA 필수. 운영 JS 수정 없음.
