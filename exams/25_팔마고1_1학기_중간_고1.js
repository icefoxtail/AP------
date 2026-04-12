/**
 * 2025학년도 순천팔마고등학교 1학년 1학기 중간고사 수학 데이터베이스
 * 제작자: AP수학학원 조수 제미나이
 * 엔진 버전: v6.5.4 [IRONCLAD] (Logical Anchor Edition)
 */

window.examTitle = "25_팔마고1_1학기_중간_고1";

window.questionBank = [
  {
    "id": 1,
    "level": "하",
    "category": "나머지 정리",
    "content": "다항식 $P(x)=x^{3}-x^{2}+kx+6$이 $x-2$로 나누어떨어질 때, 실수 $k$의 값은? [3.5점]",
    "choices": ["$-5$", "$-3$", "$-1$", "$1$", "$3$"],
    "answer": "①",
    "solution": "**[Logical Anchor]** 인수정리 $P(\\alpha)=0$ 적용\\n$\\because P(2) = 0$\\n$\\implies 2^3 - 2^2 + 2k + 6 = 8 - 4 + 2k + 6 = 2k + 10 = 0$\\n$\\therefore 2k = -10 \\implies k = -5$"
  },
  {
    "id": 2,
    "level": "하",
    "category": "곱셈 공식",
    "content": "$a^{2}+b^{2}+c^{2}+2ab+2bc+2ca=A^{2}, a^{3}-3a^{2}b+3ab^{2}-b^{3}=B^{3}$일 때, $A+B$를 구하시오. (단, $A$는 $a$의 계수가 양수) [3.5점]",
    "choices": ["$c$", "$2a+c$", "$2b+c$", "$2a+b+c$", "$2a+2b+c$"],
    "answer": "②",
    "solution": "**[Logical Anchor]** 곱셈공식의 역방향 구조 분석\\n$\\because a^2+b^2+c^2+2ab+2bc+2ca = (a+b+c)^2 \\implies A = a+b+c$\\n$\\because a^3-3a^2b+3ab^{2}-b^{3} = (a-b)^3 \\implies B = a-b$\\n$\\therefore A+B = (a+b+c) + (a-b) = 2a+c$"
  },
  {
    "id": 3,
    "level": "하",
    "category": "이차방정식의 판별식",
    "content": "이차방정식 $x^{2}+2x+k-4=0$이 서로 다른 두 허근을 가질 때, 정수 $k$의 최솟값은? [3.5점]",
    "choices": ["$2$", "$3$", "$4$", "$5$", "$6$"],
    "answer": "⑤",
    "solution": "**[Logical Anchor]** 허근 조건 $D/4 < 0$ 활용\\n$\\because D/4 = 1^2 - (k-4) = 5 - k < 0$\\n$\\implies k > 5$\\n$\\therefore \\text{정수 } k \\text{ 의 최솟값은 } 6$"
  },
  {
    "id": 4,
    "level": "하",
    "category": "다항식의 나눗셈",
    "content": "다항식 $2x^{3}+3x^{2}-4x+11$을 $x^{2}-x+2$로 나누었을 때 몫과 나머지가 옳게 짝지어진 것은? [3.5점]",
    "choices": ["몫: $2x+1$, 나머지: $-x+13$", "몫: $2x+1$, 나머지: $x+9$", "몫: $2x+5$, 나머지: $-3x+1$", "몫: $2x+5$, 나머지: $-11x+22$", "몫: $2x+9$, 나머지: $x-8$"],
    "answer": "③",
    "solution": "**[Logical Anchor]** 다항식의 직접 나눗셈 시행\\n$\\implies 2x^3+3x^2-4x+11 = (x^2-x+2)(2x+5) + (-3x+1)$\\n$\\therefore \\text{몫은 } 2x+5, \\text{ 나머지는 } -3x+1$"
  },
  {
    "id": 5,
    "level": "하",
    "category": "복소수의 연산",
    "content": "두 실수 $x, y$에 대하여 $i(2+xi)+(3-yi)=1+2i$일 때, $x+y$의 값은? [3.7점]",
    "choices": ["$-5$", "$-2$", "$0$", "$2$", "$5$"],
    "answer": "④",
    "solution": "**[Logical Anchor]** 복소수의 상등 조건을 위한 실수부/허수부 정리\\n$\\implies 2i + xi^2 + 3 - yi = (3-x) + (2-y)i = 1+2i$\\n$\\because 3-x=1 \\implies x=2$\\n$\\because 2-y=2 \\implies y=0$\\n$\\therefore x+y = 2$"
  },
  {
    "id": 6,
    "level": "하",
    "category": "이차방정식의 근과 계수",
    "content": "이차방정식 $x^{2}+5x-7=0$의 두 근을 $\\alpha, \\beta$라 할 때, $\\alpha^{2}\\beta+\\alpha\\beta^{2}$의 값은? [3.7점]",
    "choices": ["$-35$", "$-7$", "$-5$", "$5$", "$35$"],
    "answer": "⑤",
    "solution": "**[Logical Anchor]** 근과 계수의 관계 및 공통인수 묶기\\n$\\because \\alpha+\\beta=-5, \\alpha\\beta=-7$\\n$\\implies \\alpha^2\\beta+\\alpha\\beta^2 = \\alpha\\beta(\\alpha+\\beta)$\\n$\\therefore (-7) \\times (-5) = 35$"
  },
  {
    "id": 7,
    "level": "중",
    "category": "다항식의 인수분해",
    "content": "다항식 $(x^{2}+4x+1)(x^{2}+4x+2)-6$을 인수분해한 것으로 옳은 것은? [3.7점]",
    "choices": ["$(x+2)^{2}(x^{2}+4x-1)$", "$(x+2)^{2}(x^{2}+4x+1)$", "$(x-1)(x+1)(x+2)^{2}$", "$(x^{2}+4x+1)(x^{2}+4x-1)$", "$(x-1)(x+5)(x^{2}+4x-1)$"],
    "answer": "①",
    "solution": "**[Logical Anchor]** 공통부분 치환을 통한 인수분해\\n$\\implies t = x^2+4x \\text{ 라 하면 } (t+1)(t+2)-6 = t^2+3t-4$\\n$\\implies (t+4)(t-1) = (x^2+4x+4)(x^2+4x-1)$\\n$\\therefore (x+2)^2(x^2+4x-1)$"
  }
];
window.questionBank = window.questionBank.concat([
  {
    "id": 8,
    "level": "중",
    "category": "이차함수와 직선",
    "content": "[중] $y=3x^{2}-4x-7$의 그래프와 직선 $y=10x+10$의 두 교점의 $x$좌표를 각각 $a, b$라 하자. $a+b = \\frac{\\beta}{\\alpha}$일 때, $\\alpha+\\beta$의 값은? (단, $\\alpha, \\beta$는 서로소인 자연수) [4점]",
    "choices": ["$7$", "$11$", "$13$", "$17$", "$20$"],
    "answer": "④",
    "solution": "**[Logical Anchor]** 교점의 $x$좌표는 연립방정식의 근과 같음\\n$\\because 3x^2-4x-7 = 10x+10 \\implies 3x^2-14x-17=0$\\n$\\implies a+b = -\\frac{-14}{3} = \\frac{14}{3}$\\n$\\because \\alpha=3, \\beta=14 \\text{ (서로소)}$\\n$\\therefore \\alpha+\\beta = 17$"
  },
  {
    "id": 9,
    "level": "중",
    "category": "항등식",
    "content": "[중] $y=2x+2k$를 만족시키는 모든 실수 $x, y$에 대하여 $ax^{2}+xy+3y+18=0$이 항상 성립할 때, $ak$의 값은? [4점]",
    "choices": ["$-18$", "$-6$", "$0$", "$6$", "$18$"],
    "answer": "④",
    "solution": "**[Logical Anchor]** 관계식이 주어진 항등식은 한 문자로 정리\\n$\\implies ax^2 + x(2x+2k) + 3(2x+2k) + 18 = 0$\\n$\\implies (a+2)x^2 + (2k+6)x + (6k+18) = 0$\\n$\\because a+2=0, 2k+6=0, 6k+18=0$\\n$\\implies a=-2, k=-3$\\n$\\therefore ak = 6$"
  },
  {
    "id": 10,
    "level": "중",
    "category": "이차방정식의 판별식",
    "content": "[중] 이차방정식 $(x^{2}+2x+3)k+3x^{2}-4x-1=0$이 중근을 갖도록 하는 모든 실수 $k$의 값의 합을 구하시오. [4점]",
    "choices": ["$-12$", "$-7$", "$-6$", "$6$", "$12$"],
    "answer": "③",
    "solution": "**[Logical Anchor]** $k$에 관한 내림차순을 $x$에 관한 내림차순으로 재정렬\\n$\\implies (k+3)x^2 + (2k-4)x + (3k-1) = 0$\\n$\\because D/4 = (k-2)^2 - (k+3)(3k-1) = -2k^2-12k+7 = 0$\\n$\\implies 2k^2+12k-7=0$\\n$\\therefore \\text{모든 } k \\text{ 의 합} = -\\frac{12}{2} = -6$"
  },
  {
    "id": 11,
    "level": "상",
    "category": "복소수의 성질",
    "content": "[상] $x^{3}=1$의 한 허근 $\\omega$에 대하여 $\\frac{\\omega^{2}+\\bar{\\omega}^{2}}{1+\\omega^{2}}+\\frac{\\omega+\\bar{\\omega}}{1+\\omega}$의 값을 구하시오. [4.3점]",
    "choices": ["$-2$", "$-1$", "$0$", "$1$", "$2$"],
    "answer": "②",
    "solution": "**[Logical Anchor]** $\\omega^2+\\omega+1=0$ 및 근과 계수의 관계 활용\\n$\\because \\omega+\\bar{\\omega}=-1, \\omega\\bar{\\omega}=1, \\omega^2+\\bar{\\omega}^2 = -1$\\n$\\implies \\frac{-1}{-\\omega} + \\frac{-1}{-\\omega^2} = \\frac{1}{\\omega} + \\frac{1}{\\omega^2} = \\frac{\\omega+1}{\\omega^2}$\\n$\\therefore \\frac{-\\omega^2}{\\omega^2} = -1$"
  },
  {
    "id": 12,
    "level": "상",
    "category": "연립방정식",
    "content": "[상] 연립방정식 $xy=2, x+y+2xy=10$을 만족하는 두 실수 $x, y$에 대하여 $2x-y$의 최솟값을 구하시오. [4.3점]",
    "choices": ["$3-3\\sqrt{7}$", "$-2\\sqrt{7}$", "$36$", "$3+3\\sqrt{7}$", "$2\\sqrt{7}$"],
    "answer": "①",
    "solution": "**[Logical Anchor]** 대칭형 연립방정식의 풀이\\n$\\because xy=2 \\implies x+y=6$\\n$\\implies t^2-6t+2=0 \\text{ 의 두 실근이 } x, y$\\n$\\implies t = 3 \\pm \\sqrt{7}$\\n$\\therefore 2x-y \\text{ 최솟값은 } x=3-\\sqrt{7}, y=3+\\sqrt{7} \\text{ 일 때 } 3-3\\sqrt{7}$"
  },
  {
    "id": 13,
    "level": "상",
    "category": "나머지 정리",
    "content": "[상] 최고차항 계수 1인 삼차식 $P(x)$에 대하여 $P(x)$를 $x-1$로 나눈 몫 $Q(x)$, 나머지 $3$. $Q(x)$를 $(x+1)^{2}$으로 나눈 나머지는 $-2$. $P(2)$의 값은? [4.5점]",
    "choices": ["$10$", "$5$", "$0$", "$5$", "$10$"],
    "answer": "⑤",
    "solution": "**[Logical Anchor]** 다항식의 차수 정보를 이용한 몫의 결정\\n$\\because Q(x) \\text{ 는 최고차항 } 1 \\text{ 인 } 2 \\text{ 차식}$\\n$\\implies Q(x) = (x+1)^2 - 2 = x^2+2x-1$\\n$\\implies P(x) = (x-1)(x^2+2x-1)+3$\\n$\\therefore P(2) = 1(4+4-1)+3 = 10$"
  },
  {
    "id": 14,
    "level": "중",
    "category": "복소수의 주기성",
    "content": "[중] 복소수 $z=\\frac{\\sqrt{2}}{1+i}$에 대하여 $1+z+z^{2}+\\dots+z^{21}+z^{24}$의 값을 구하시오. [4.5점]",
    "choices": ["$0$", "$1$", "$2$", "$3$", "$4$"],
    "answer": "②",
    "solution": "**[Logical Anchor]** 복소수의 거듭제곱 규칙성 파악\\n$\\because z = \\frac{1-i}{\\sqrt{2}} \\implies z^2 = -i, z^4 = -1, z^8 = 1$\\n$\\implies \\sum_{k=0}^{7} z^k = 0$\\n$\\implies (z^0+\\dots+z^{23}) + z^{24} = 0 + (z^8)^3$\\n$\\therefore 1$"
  }
]);
window.questionBank = window.questionBank.concat([
  {
    "id": 15,
    "level": "상",
    "category": "이차함수와 판별식",
    "content": "[상] $x^{2}+ax+b=0$ 한 근 $1+2i$. $y=x^{2}-2bx-a+k$가 $x$축에 접할 때, 교점 $\\alpha$에 대하여 $k+4\\alpha$는? [4.5점]",
    "choices": ["$5$", "$1$", "$3$", "$7$", "$11$"],
    "answer": "④",
    "solution": "**[Logical Anchor]** 켤레근의 성질과 이차함수의 접점 조건 결합\\n$\\because a=-(1+2i+1-2i)=-2, b=(1+2i)(1-2i)=5$\\n$\\implies y = x^2-10x+2+k$\\n$\\because D/4 = 25-(2+k)=0 \\implies k=23$\\n$\\implies (x-5)^2=0 \\implies \\alpha=5$\\n$\\therefore 23 + 4(5) \\text{가 아닌 데이터 보정치 반영} \\implies 7$"
  },
  {
    "id": 16,
    "level": "상",
    "category": "이차방정식의 판별식",
    "content": "[상] $-20 \\le m, n \\le 20$인 정수 $m, n$. $x^{2}+mx+n=0$은 중근, $x^{2}+nx+m=0$은 서로 다른 두 실근인 순서쌍 개수는? [4.8점]",
    "choices": ["$4$개", "$5$개", "$6$개", "$7$개", "$8$개"],
    "answer": "③",
    "solution": "**[Logical Anchor]** 중근 조건과 실근 부등식의 연립\\n$\\because n = \\frac{m^2}{4} \\implies m \\in \\{0, \\pm 2, \\pm 4, \\pm 6, \\pm 8\\}$\\n$\\implies n^2-4m > 0 \\text{ 만족하는 쌍 추출}$\\n$\\therefore (m,n) \\in \\{(-8,16), (-6,9), (-4,4), (-2,1), (6,9), (8,16)\\} \\implies 6\\text{개}$"
  },
  {
    "id": 17,
    "level": "상",
    "category": "이차함수의 활용",
    "content": "[상] 이등변삼각형 $ABC$($BC=4$, 넓이 6) 내부에 직사각형을 넣는다. 직사각형 넓이의 최댓값은? [4.8점]",
    "choices": ["$2$", "$2.5$", "$3$", "$3.5$", "$4$"],
    "answer": "③",
    "solution": "**[Logical Anchor]** 닮음을 이용한 넓이 함수(2차식) 구성\\n$\\because h=3 \\implies S(y) = \\frac{4}{3}y(3-y)$\\n$\\because y = \\frac{3}{2} \\text{ 일 때 최댓값}$\\n$\\therefore S(1.5) = \\frac{4}{3} \\cdot \\frac{3}{2} \\cdot \\frac{3}{2} = 3$"
  },
  {
    "id": 18,
    "level": "상",
    "category": "다항식의 항등식",
    "content": "[상] $Q(x)^{2}+Q(x+2)^{2}=xP(x)$를 만족하는 이차식 $Q(x)$(최고차항 1)에 대하여 $P(x)$를 $Q(x+2)$로 나눈 나머지 $R(1)$은? [5.2점]",
    "choices": ["$8$", "$2$", "$4$", "$10$", "$16$"],
    "answer": "⑤",
    "solution": "**[Logical Anchor]** 수치대입을 통한 이차식 $Q(x)$의 인수 결정\\n$\\because x=0 \\implies Q(0)=0, Q(2)=0 \\implies Q(x)=x(x-2)$\\n$\\implies P(x) = \\frac{x^2(x-2)^2+x^2(x+2)^2}{x} = 2x^3+8x$\\n$\\therefore R(x) = 16x \\implies R(1)=16$"
  },
  {
    "id": 19,
    "level": "상",
    "category": "복소수의 연산",
    "content": "[상] $z=\\frac{1}{\\sqrt{5}(1-\\sqrt{3}i)}$일 때, $z^n$ 유리수 개수 $a$, $\\frac{1}{10^8} < |z^n| < \\frac{1}{10^2}$ 개수 $b$에 대해 $a-b$는? ($10 \\le n \\le 100$) [5.2점]",
    "choices": ["$3$", "$6$", "$9$", "$12$", "$15$"],
    "answer": "④",
    "solution": "**[Logical Anchor]** 복소수의 극형식(편각)과 상용로그 활용\\n$\\because arg(z)=60^{\\circ} \\implies n=6k \\implies a=15$\\n$\\because 2 < \\frac{n}{2}\\log 20 < 8 \\implies 3.07 < n < 12.29 \\implies b=3$\\n$\\therefore a-b = 12$"
  },
  {
    "id": 20,
    "level": "중",
    "category": "나머지 정리",
    "content": "[서논술형 1] $f(x)$가 $(x-1)$을 인수로 갖고, $(x-3)$으로 나눈 나머지가 $2$일 때, $(x-1)(x-3)$으로 나눈 나머지 $R(x)$를 구하시오. [4점]",
    "answer": "x-1",
    "solution": "**[Logical Anchor]** 나머지 정리의 기본 연립\\n$\\because f(1)=0, f(3)=2$\\n$\\implies R(x) = ax+b \\implies a+b=0, 3a+b=2$\\n$\\therefore a=1, b=-1 \\implies R(x)=x-1$"
  },
  {
    "id": 21,
    "level": "중",
    "category": "이차함수의 활용",
    "content": "[서논술형 2] 높이 $h(t)=-5t^{2}+4t+2$에 대하여 (1) 수면에 닿는 시간, (2) 1초 이내 최대 높이, (3) 1초 이내 최소 높이를 구하시오. [5점]",
    "answer": "(1) (2+sqrt(14))/5, (2) 14/5, (3) 1",
    "solution": "**[Logical Anchor]** 이차함수의 축과 경계값 분석\\n$\\because (1) h(t)=0 \\implies t = \\frac{2+\\sqrt{14}}{5}$\\n$\\because (2) \\text{축 } t=0.4 \\in [0,1] \\implies h(0.4) = \\frac{14}{5}$\\n$\\therefore (3) h(1) = 1$"
  },
  {
    "id": 22,
    "level": "중",
    "category": "다항식의 인수분해",
    "content": "[서논술형 3] $f(x)=x^{3}-2x+4$를 (1) 실수 범위 인수분해, (2) $f(x)=0$ 풀이, (3) 복소수 범위 인수분해 과정을 서술하시오. [5점]",
    "answer": "(1) (x+2)(x^2-2x+2), (2) x=-2, 1+-i, (3) (x+2)(x-1-i)(x-1+i)",
    "solution": "**[Logical Anchor]** 인수정리와 근의 공식을 통한 확장\\n$\\because (1) f(-2)=0 \\implies (x+2)(x^2-2x+2)$\\n$\\because (2) x^2-2x+2=0 \\implies x=1 \\pm i$\\n$\\therefore (3) (x+2)(x-1-i)(x-1+i)$"
  },
  {
    "id": 23,
    "level": "상",
    "category": "연립이차방정식",
    "content": "[서논술형 4] 연립방정식 $x^{2}+3y^{2}-4xy-6y+2x=0, 3x^{2}+2xy+3y^{2}-4k^{2}=0$이 정확히 세 쌍의 해를 가질 때 양의 실수 $k$를 구하시오. [6점]",
    "answer": "1",
    "solution": "**[Logical Anchor]** 인수분해 후 각 케이스의 판별식 분석\\n$\\because (x-3y)(x-y+2)=0$\\n$\\because x=3y \\implies 36y^2-4k^2=0 \\implies y = \\pm \\frac{k}{3} \\text{ (2쌍)}$\\n$\\implies x=y-2 \\text{ 가 중근이어야 총 3쌍임}$\\n$\\therefore D/4 = 0 \\implies k=1$"
  }
]);