# 2025 순천여고 1학기 중간 대수 — q11
Status: DRAFT_STAGED / NOT_PRODUCTION / REVIEW_REQUIRED

- Source: archive/exams/original/high/h2/1mid/25_순천여고_1학기_중간_고2_대수.js
- Source blob SHA: 218d631bb69516db8403a7af272b81e83fb64cfc
- sourceIdentityKey: 원본 JS에 명시적 필드 없음. 임시 결속키 = 위 경로 + blob SHA + id:11. 실제 운영 UID 확인 필요.
- qid/id: 11; standardCourse: 대수; answer: ③ (16)
- Before: 기존 해설의 '2단계'가 원래 중첩 근호에서 갑자기 $a^{2/12}/a^{1/8}$로 변한다. 네제곱근·여덟제곱근을 각 분수 지수에 분배한 과정을 보여 주지 않는다.
- After (학생용 solution 전체):

$a>0$이므로 모든 거듭제곱근을 분수 지수로 나타낼 수 있다.

먼저 왼쪽의 네제곱근은
$$
\begin{aligned}
\sqrt[4]{\frac{\sqrt[3]{a^2}}{\sqrt a}}
&=\left(\frac{a^{2/3}}{a^{1/2}}\right)^{1/4}\\
&=\left(a^{2/3-1/2}\right)^{1/4}\\
&=\left(a^{1/6}\right)^{1/4}\\
&=a^{1/24}.
\end{aligned}
$$

오른쪽의 여덟제곱근은
$$
\begin{aligned}
\sqrt[8]{\frac{\sqrt[6]a}{a}}
&=\left(\frac{a^{1/6}}{a}\right)^{1/8}\\
&=\left(a^{1/6-1}\right)^{1/8}\\
&=\left(a^{-5/6}\right)^{1/8}\\
&=a^{-5/48}.
\end{aligned}
$$

따라서 전체 식은
$$
\begin{aligned}
a^{1/24}\cdot a^{-5/48}
&=a^{2/48-5/48}\\
&=a^{-3/48}\\
&=a^{-1/16}\\
&=\sqrt[16]{\frac1a}.
\end{aligned}
$$

$a\ne1$이므로 $a^{-1/n}=a^{-1/16}$에서 $n=16$이다. 정답은 ③이다.

- Independent check: 원식 지수는 $(2/3-1/2)/4+(1/6-1)/8=1/24-5/48=-1/16$. $a=16$을 대입해도 양변 $16^{-1/16}$.
- SVG_REQUEST: 없음.
- QA: Golden/Negative 물리적 대조, 학생 렌더, preflight SHA-256 receipt NOT_RUN. JS 이행 전 source UID 및 보호 필드 diff·독립 QA 필수. 운영 JS 수정 없음.
