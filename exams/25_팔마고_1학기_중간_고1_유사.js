window.examTitle = "25_팔마고1_1학기_중간_고1_유사";

window.questionBank = [
  {
    id: 1,
    level: "상",
    category: "나머지 정리",
    originalCategory: "나머지 정리",
    standardCourse: "수학(상)",
    standardUnitKey: "H15-SA-02",
    standardUnit: "항등식과 나머지정리",
    standardUnitOrder: 2,
    content: "다항식 $P(x)$를 $(x-1)^{2}$으로 나누었을 때의 나머지가 $x+2$이고, $x+1$로 나누었을 때의 나머지가 $5$이다. $P(x)$를 $(x-1)^{2}(x+1)$로 나누었을 때의 나머지를 $R(x)$라 할 때, $R(2)$의 값은? [4.5점]",
    choices: [
      "$1$",
      "$3$",
      "$5$",
      "$7$",
      "$9$"
    ],
    answer: "③",
    solution: "$P(x) = (x-1)^2(x+1)Q(x) + R(x)$라 하면, $R(x)$는 이차 이하의 다항식이다.\n$P(x)$를 $(x-1)^2$으로 나눈 나머지가 $x+2$이므로 $R(x) = a(x-1)^2 + x+2$로 놓을 수 있다.\n나머지 정리에 의해 $P(-1) = 5$이므로\n$R(-1) = a(-2)^2 + (-1)+2 = 4a+1 = 5 \\implies a=1$\n따라서 $R(x) = (x-1)^2 + x+2 = x^2-x+3$이다.\n$\\therefore R(2) = 4-2+3 = 5$"
  },
  {
    id: 2,
    level: "중",
    category: "곱셈 공식",
    originalCategory: "곱셈 공식",
    standardCourse: "수학(상)",
    standardUnitKey: "H15-SA-01",
    standardUnit: "다항식의 연산",
    standardUnitOrder: 1,
    content: "세 양수 $a, b, c$에 대하여 $a^{3}+b^{3}+c^{3}=3abc$가 성립할 때, $\\frac{b+c}{a} + \\frac{c+a}{b} + \\frac{a+b}{c}$의 값은? [4.0점]",
    choices: [
      "$1$",
      "$3$",
      "$6$",
      "$9$",
      "$12$"
    ],
    answer: "③",
    solution: "$a^3+b^3+c^3-3abc = (a+b+c)(a^2+b^2+c^2-ab-bc-ca) = 0$\n$a, b, c$가 양수이므로 $a+b+c > 0$이다.\n따라서 $a^2+b^2+c^2-ab-bc-ca = \\frac{1}{2}\\{(a-b)^2+(b-c)^2+(c-a)^2\\} = 0$\n$\\implies a=b=c$\n이를 주어진 식에 대입하면\n$\\frac{2a}{a} + \\frac{2a}{a} + \\frac{2a}{a} = 2+2+2 = 6$"
  },
  {
    id: 3,
    level: "상",
    category: "이차방정식의 판별식",
    originalCategory: "이차방정식의 판별식",
    standardCourse: "수학(상)",
    standardUnitKey: "H15-SA-05",
    standardUnit: "이차방정식",
    standardUnitOrder: 5,
    content: "이차방정식 $x^{2}-2ax+2a^{2}+ka+5=0$이 임의의 실수 $a$의 값에 관계없이 항상 허근을 갖도록 하는 모든 정수 $k$의 개수는? [4.8점]",
    choices: [
      "$6$개",
      "$7$개",
      "$8$개",
      "$9$개",
      "$10$개"
    ],
    answer: "④",
    solution: "이차방정식이 허근을 가지려면 판별식 $D/4 < 0$이어야 한다.\n$D/4 = a^2 - (2a^2+ka+5) = -a^2-ka-5 < 0$\n즉, 모든 실수 $a$에 대하여 $a^2+ka+5 > 0$이 성립해야 한다.\n$f(a) = a^2+ka+5$라 할 때, 이 이차함수의 그래프가 $a$축과 만나지 않아야 하므로\n$f(a)=0$의 판별식 $D_k < 0$이어야 한다.\n$D_k = k^2 - 4(1)(5) = k^2-20 < 0$\n$k^2 < 20$을 만족하는 정수 $k$는 $-4, -3, -2, -1, 0, 1, 2, 3, 4$로 총 $9$개이다."
  },
  {
    id: 4,
    level: "상",
    category: "다항식의 나눗셈",
    originalCategory: "다항식의 나눗셈",
    standardCourse: "수학(상)",
    standardUnitKey: "H15-SA-01",
    standardUnit: "다항식의 연산",
    standardUnitOrder: 1,
    content: "다항식 $f(x)$를 $x^{2}+x+1$로 나눈 몫이 $Q(x)$, 나머지가 $x-1$이다. $Q(x)$를 $x-1$로 나눈 나머지가 $2$일 때, $f(x)$를 $x^{3}-1$로 나눈 나머지를 $R(x)$라 하자. $R(2)$의 값은? [4.5점]",
    choices: [
      "$11$",
      "$13$",
      "$15$",
      "$17$",
      "$19$"
    ],
    answer: "③",
    solution: "주어진 조건에 의해\n$f(x) = (x^2+x+1)Q(x) + x-1$\n$Q(x) = (x-1)Q'(x) + 2$\n두 식을 결합하면\n$f(x) = (x^2+x+1)\\{(x-1)Q'(x) + 2\\} + x-1$\n$f(x) = (x^2+x+1)(x-1)Q'(x) + 2(x^2+x+1) + x-1$\n$f(x) = (x^3-1)Q'(x) + 2x^2+3x+1$\n따라서 $R(x) = 2x^2+3x+1$이다.\n$\\therefore R(2) = 2(2^2) + 3(2) + 1 = 8+6+1 = 15$"
  },
  {
    id: 5,
    level: "상",
    category: "복소수의 연산",
    originalCategory: "복소수의 연산",
    standardCourse: "수학(상)",
    standardUnitKey: "H15-SA-04",
    standardUnit: "복소수",
    standardUnitOrder: 4,
    content: "복소수 $z = \\frac{1+i}{\\sqrt{2}}$에 대하여 $z^{n} = \\bar{z}$를 만족시키는 $100$ 이하의 자연수 $n$의 개수는? [4.7점]",
    choices: [
      "$10$개",
      "$12$개",
      "$13$개",
      "$25$개",
      "$50$개"
    ],
    answer: "②",
    solution: "$z = \\frac{1+i}{\\sqrt{2}}$에서 $z^2 = i, z^4 = -1, z^8 = 1$이므로 $z$는 주기가 $8$인 복소수이다.\n이때 $\\bar{z} = \\frac{1-i}{\\sqrt{2}}$이고, $z \\cdot \\bar{z} = |z|^2 = 1$이므로 $\\bar{z} = \\frac{1}{z} = z^{-1}$이다.\n주어진 조건 $z^n = \\bar{z}$는 $z^n = z^{-1}$, 즉 $z^{n+1} = 1$과 같다.\n$z$의 주기가 $8$이므로 $n+1$은 $8$의 배수여야 한다.\n$n+1 = 8k \\implies n = 8k-1$ (단, $k$는 자연수)\n$1 \\le 8k-1 \\le 100 \\implies 2 \\le 8k \\le 101$\n따라서 $k = 1, 2, \\dots, 12$가 가능하므로 개수는 $12$개이다."
  },
  {
    id: 6,
    level: "중상",
    category: "이차방정식의 근과 계수",
    originalCategory: "이차방정식의 근과 계수",
    standardCourse: "수학(상)",
    standardUnitKey: "H15-SA-05",
    standardUnit: "이차방정식",
    standardUnitOrder: 5,
    content: "이차방정식 $x^{2}-4x-5=0$의 두 근을 $\\alpha, \\beta$라 할 때, $\\alpha^{2}+\\beta^{2}+\\alpha^{2}\\beta+\\alpha\\beta^{2}$의 값은? [3.7점]",
    choices: [
      "$-9$",
      "$1$",
      "$6$",
      "$9$",
      "$25$"
    ],
    answer: "③",
    solution: "근과 계수의 관계에 의해 $\\alpha+\\beta=4, \\alpha\\beta=-5$이다.\n주어진 식을 변형하면\n$\\alpha^{2}+\\beta^{2}+\\alpha^{2}\\beta+\\alpha\\beta^{2} = (\\alpha+\\beta)^{2}-2\\alpha\\beta+\\alpha\\beta(\\alpha+\\beta)$\n$= 4^{2} - 2(-5) + (-5) \\cdot 4$\n$= 16 + 10 - 20 = 6$\n따라서 정답은 ③이다."
  },
  {
    id: 7,
    level: "중상",
    category: "다항식의 인수분해",
    originalCategory: "다항식의 인수분해",
    standardCourse: "수학(상)",
    standardUnitKey: "H15-SA-03",
    standardUnit: "인수분해",
    standardUnitOrder: 3,
    content: "다항식 $(x^{2}-2x+1)(x^{2}-2x+3)-24$를 인수분해한 것으로 옳은 것은? [3.7점]",
    choices: [
      "$(x-3)(x+1)(x^{2}-2x+7)$",
      "$(x-1)^{2}(x^{2}-2x+7)$",
      "$(x-3)(x+1)(x^{2}-2x+1)$",
      "$(x^{2}-2x+3)(x^{2}-2x+7)$",
      "$(x-1)^{2}(x^{2}-2x+3)$"
    ],
    answer: "①",
    solution: "$x^{2}-2x=t$로 치환하면\n주어진 식은 $(t+1)(t+3)-24$\n$= t^{2}+4t+3-24 = t^{2}+4t-21$\n$= (t-3)(t+7)$\n원래 식 $t=x^{2}-2x$를 다시 대입하면\n$= (x^{2}-2x-3)(x^{2}-2x+7)$\n$= (x-3)(x+1)(x^{2}-2x+7)$\n따라서 정답은 ①이다."
  },
  {
    id: 8,
    level: "중상",
    category: "이차함수와 직선",
    originalCategory: "이차함수와 직선",
    standardCourse: "수학(상)",
    standardUnitKey: "H15-SA-13",
    standardUnit: "이차함수",
    standardUnitOrder: 13,
    content: "$y=2x^{2}-5x-3$의 그래프와 직선 $y=7x+1$의 두 교점의 $x$좌표를 각각 $a, b$라 하자. $a+b=\\frac{\\beta}{\\alpha}$일 때, $\\alpha+\\beta$의 값은? (단, $\\alpha, \\beta$는 서로소인 자연수) [4점]",
    choices: [
      "$5$",
      "$6$",
      "$7$",
      "$8$",
      "$9$"
    ],
    answer: "③",
    solution: "두 식을 연립하면\n$2x^{2}-5x-3=7x+1$\n$2x^{2}-12x-4=0$\n$x^{2}-6x-2=0$\n이 방정식의 두 근이 교점의 $x$좌표인 $a, b$이므로 근과 계수의 관계에 의해\n$a+b=6$\n즉 $a+b=\\frac{6}{1}$이므로 $\\alpha=1, \\beta=6$이다.\n따라서 $\\alpha+\\beta=1+6=7$이다.\n정답은 ③이다."
  },
  {
    id: 9,
    level: "상",
    category: "항등식",
    originalCategory: "항등식",
    standardCourse: "수학(상)",
    standardUnitKey: "H15-SA-02",
    standardUnit: "항등식과 나머지정리",
    standardUnitOrder: 2,
    content: "$y=2x+k$를 만족시키는 모든 실수 $x, y$에 대하여 $ax^{2}+xy+2y+8=0$이 항상 성립할 때, $a+k$의 값은? [4점]",
    choices: [
      "$-6$",
      "$-5$",
      "$-4$",
      "$-3$",
      "$-2$"
    ],
    answer: "①",
    solution: "$y=2x+k$를 식에 대입하면\n$ax^{2}+x(2x+k)+2(2x+k)+8=0$\n$ax^{2}+2x^{2}+kx+4x+2k+8=0$\n$(a+2)x^{2}+(k+4)x+(2k+8)=0$\n이 식이 모든 실수 $x$에 대하여 항상 성립해야 하므로 각 계수는 모두 0이어야 한다.\n$a+2=0 \\implies a=-2$\n$k+4=0 \\implies k=-4$\n$2k+8=0$ 역시 $k=-4$에서 성립한다.\n따라서 $a+k = -2 + (-4) = -6$이다.\n정답은 ①이다."
  },
  {
    id: 10,
    level: "상",
    category: "이차방정식의 판별식",
    originalCategory: "이차방정식의 판별식",
    standardCourse: "수학(상)",
    standardUnitKey: "H15-SA-05",
    standardUnit: "이차방정식",
    standardUnitOrder: 5,
    content: "이차방정식 $(x^{2}+2x+2)k+x^{2}+4=0$이 중근을 갖도록 하는 모든 실수 $k$의 값의 합을 구하시오. [4점]",
    choices: [
      "$-8$",
      "$-6$",
      "$-4$",
      "$4$",
      "$6$"
    ],
    answer: "②",
    solution: "식을 $x$에 대한 내림차순으로 정리하면\n$(k+1)x^{2}+2kx+(2k+4)=0$\n이 방정식이 이차방정식이므로 최고차항의 계수 $k+1 \\neq 0$, 즉 $k \\neq -1$이다.\n중근을 가지려면 판별식 $D/4=0$이어야 하므로\n$D/4 = k^{2}-(k+1)(2k+4) = 0$\n$k^{2}-(2k^{2}+6k+4) = 0$\n$-k^{2}-6k-4 = 0 \\implies k^{2}+6k+4 = 0$\n이 이차방정식의 두 근의 합은 근과 계수의 관계에 의해 $-6$이다. (두 근 모두 $k \\neq -1$ 조건을 만족하고 실수임)\n따라서 정답은 ②이다."
  },
  {
    id: 11,
    level: "상",
    category: "복소수의 성질",
    originalCategory: "복소수의 성질",
    standardCourse: "수학(상)",
    standardUnitKey: "H15-SA-04",
    standardUnit: "복소수",
    standardUnitOrder: 4,
    content: "방정식 $x^{2}+x+1=0$의 한 허근을 $\\omega$라 하자. 자연수 $n$에 대하여 $f(n)=\\frac{\\omega^{n}}{1+\\omega^{2n}}$이라 할 때, $\\sum_{k=1}^{30} f(k)$의 값은? [4.3점]",
    choices: [
      "$-15$",
      "$-10$",
      "$-5$",
      "$5$",
      "$15$"
    ],
    answer: "①",
    solution: "$\\omega^2+\\omega+1=0$이므로 $\\omega^3=1$이고, $1+\\omega^2=-\\omega$, $1+\\omega=-\\omega^2$이다.\n또한 $\\omega^{2n}$은 $1,\\omega,\\omega^2$ 중 하나이므로 $1+\\omega^{2n}=0$이 되는 경우는 없다.\n\n이제 $n$을 $3$으로 나눈 나머지에 따라 $f(n)$을 구하면,\n\n(1) $n\\equiv 1 \\pmod 3$일 때\n$f(n)=\\frac{\\omega}{1+\\omega^2}=\\frac{\\omega}{-\\omega}=-1$\n\n(2) $n\\equiv 2 \\pmod 3$일 때\n$f(n)=\\frac{\\omega^2}{1+\\omega}=\\frac{\\omega^2}{-\\omega^2}=-1$\n\n(3) $n\\equiv 0 \\pmod 3$일 때\n$f(n)=\\frac{1}{1+1}=\\frac{1}{2}$\n\n따라서 수열 $\\{f(n)\\}$은 주기 $3$을 가지며,\n$f(1)+f(2)+f(3)=-1-1+\\frac{1}{2}=-\\frac{3}{2}$\n\n$1$부터 $30$까지는 $10$주기이므로\n$\\sum_{k=1}^{30} f(k)=10\\cdot\\left(-\\frac{3}{2}\\right)=-15$\n\n따라서 정답은 ①이다."
  },
  {
    id: 12,
    level: "상",
    category: "연립방정식",
    originalCategory: "연립방정식",
    standardCourse: "수학(상)",
    standardUnitKey: "H15-SA-07",
    standardUnit: "여러 가지 방정식",
    standardUnitOrder: 7,
    content: "연립방정식 $x+y+xy=5, x^{2}+y^{2}+xy=7$을 만족시키는 두 실수 $x, y$에 대하여 $x^{2}+y^{2}$의 최댓값을 $M$, 최솟값을 $m$이라 할 때, $M+m$의 값은? [4.3점]",
    choices: [
      "$8$",
      "$10$",
      "$12$",
      "$14$",
      "$16$"
    ],
    answer: "②",
    solution: "$x+y=u, xy=v$로 치환하면\n(1) $u+v=5 \\implies v=5-u$\n(2) $u^2-v=7 \\implies v=u^2-7$\n$u^2-7 = 5-u \\implies u^2+u-12=0 \\implies (u+4)(u-3)=0$\nCase 1) $u=3, v=2$: $t^2-3t+2=0 \\implies t=1, 2$ (실수해 존재)\n이때 $x^2+y^2 = u^2-2v = 9-4=5$\nCase 2) $u=-4, v=9$: $t^2+4t+9=0 \\implies D/4 = 4-9 < 0$ (실수해 없음)\n조건을 만족하는 $(x, y)$는 $(1, 2), (2, 1)$뿐이므로\n$M=5, m=5 \\implies M+m=10$"
  },
  {
    id: 13,
    level: "상",
    category: "나머지 정리",
    originalCategory: "나머지 정리",
    standardCourse: "수학(상)",
    standardUnitKey: "H15-SA-02",
    standardUnit: "항등식과 나머지정리",
    standardUnitOrder: 2,
    content: "최고차항의 계수가 $1$인 삼차다항식 $P(x)$에 대하여 $P(x)$를 $(x-1)^{2}$으로 나눈 몫과 나머지가 서로 같다. $P(3)=10$일 때, $P(x)$를 $(x-1)^{3}$으로 나눈 나머지를 $R(x)$라 하자. $R(0)$의 값은? [4.5점]",
    choices: [
      "$-3$",
      "$-1$",
      "$1$",
      "$3$",
      "$5$"
    ],
    answer: "②",
    solution: "$P(x)$가 3차이고 최고차항 계수가 $1$이므로 $(x-1)^2$으로 나눈 몫은 일차식 $x+a$ 형태이다.\n조건에 의해 나머지도 $x+a$이다.\n$P(x) = (x-1)^2(x+a) + (x+a)$\n$P(3) = 4(3+a) + (3+a) = 5(3+a) = 10 \\implies a = -1$\n따라서 $P(x) = (x-1)^2(x-1) + (x-1) = (x-1)^3 + (x-1)$\n$P(x)$를 $(x-1)^3$으로 나눈 나머지는 $R(x) = x-1$이다.\n$\\therefore R(0) = 0-1 = -1$"
  },
  {
    id: 14,
    level: "상",
    category: "복소수의 주기성",
    originalCategory: "복소수의 주기성",
    standardCourse: "수학(상)",
    standardUnitKey: "H15-SA-04",
    standardUnit: "복소수",
    standardUnitOrder: 4,
    content: "복소수 $z = \\frac{1+\\sqrt{3}i}{2}$에 대하여 $z^{n}$이 실수가 되도록 하는 최소의 자연수 $n$을 $m$이라 하자. $S = z + z^{2} + z^{3} + \\dots + z^{2m}$일 때, $S^{2}$의 값은? [4.5점]",
    choices: [
      "$-3$",
      "$-1$",
      "$0$",
      "$1$",
      "$3$"
    ],
    answer: "③",
    solution: "$z = \\frac{1+\\sqrt{3}i}{2}$이므로 $2z-1 = \\sqrt{3}i$, 양변을 제곱하면 $4z^2-4z+1 = -3 \\implies z^2-z+1=0$이다.\n양변에 $(z+1)$을 곱하면 $z^3+1=0 \\implies z^3 = -1$이다.\n$z^n$이 실수가 되는 최소의 자연수 $n$은 $3$이므로 $m=3$이다.\n$S = z + z^2 + z^3 + z^4 + z^5 + z^6$ (총 $2m=6$항의 합)\n$z^3=-1, z^6=1$이며, 주어진 식을 묶어 정리하면\n$S = (z+z^2+z^3) + z^3(z+z^2+z^3) = 0$이다.\n(또는 $z^6-1 = (z-1)(z^5+z^4+z^3+z^2+z+1)=0$에서 $z \\neq 1$이므로 $z^5+\\dots+1=0$, $S = 0+1-1=0$)\n$\\therefore S^2 = 0^2 = 0$"
  },
  {
    id: 15,
    level: "상",
    category: "이차함수와 판별식",
    originalCategory: "이차함수와 판별식",
    standardCourse: "수학(상)",
    standardUnitKey: "H15-SA-13",
    standardUnit: "이차함수",
    standardUnitOrder: 13,
    content: "이차방정식 $x^{2}+ax+b=0$의 한 근이 $2-i$일 때, 이차함수 $y=x^{2}+ax+k-2$의 그래프가 $x$축과 오직 한 점에서 만난다. 이때 실수 $k$의 값은? (단, $a, b$는 실수) [4.5점]",
    choices: [
      "$-2$",
      "$0$",
      "$2$",
      "$4$",
      "$6$"
    ],
    answer: "⑤",
    solution: "실계수 방정식의 한 근이 $2-i$이므로 다른 한 근은 켤레복소수 $2+i$이다.\n근과 계수의 관계에 의해:\n$-a = (2-i)+(2+i) = 4 \\implies a=-4$\n$b = (2-i)(2+i) = 4+1 = 5$ (본 문제 함수식에는 $b$가 사용되지 않음)\n주어진 이차함수는 $y=x^2-4x+k-2$이다.\n$x$축과 오직 한 점에서 만나므로 중근을 가져야 하며, 판별식 $D=0$이어야 한다.\n$D/4 = (-2)^2 - 1(k-2) = 4 - k + 2 = 6 - k = 0$\n$\\therefore k = 6$"
  },
  {
    id: 16,
    level: "상",
    category: "이차방정식의 판별식",
    originalCategory: "이차방정식의 판별식",
    standardCourse: "수학(상)",
    standardUnitKey: "H15-SA-05",
    standardUnit: "이차방정식",
    standardUnitOrder: 5,
    content: "$-10 \\le m, n \\le 10$인 정수 $m, n$에 대하여, 이차방정식 $x^{2}+mx+n=0$은 중근을 갖고, $x^{2}+nx+m=0$은 서로 다른 두 실근을 갖는다. 이때 순서쌍 $(m,n)$의 개수는? [4.8점]",
    choices: [
      "$4$",
      "$5$",
      "$6$",
      "$7$",
      "$8$"
    ],
    answer: "①",
    solution: "첫 번째 방정식이 중근을 가지므로 $m^{2}-4n=0 \\implies n=\\frac{m^{2}}{4}$이다. 따라서 $m=2k$로 두면 $n=k^{2}$이다.\n두 번째 방정식은 $x^{2}+k^{2}x+2k=0$이고 서로 다른 두 실근을 가지므로 판별식 $D>0$이다.\n$D = k^{4}-8k>0 \\implies k(k^{3}-8)>0$이다.\n범위 $-10\\le m, n \\le10$에서 $m=2k$이므로 $-5 \\le k \\le 5$이고, $n=k^{2}\\le10$이므로 조건을 만족하는 정수 $k$는 $-3, -2, -1, 0, 1, 2, 3$이다.\n이 중에서 $k(k^{3}-8)>0$을 만족하는 것은 $k=-3, -2, -1, 3$이다.\n($k=0$이면 $D=0$, $k=1$이면 $D=-7<0$, $k=2$이면 $D=0$이므로 제외)\n따라서 가능한 $k$의 값은 4개이며, 순서쌍 $(m,n)$도 4개이다.\n정답은 ①이다."
  },
  {
    id: 17,
    level: "상",
    category: "이차함수의 활용",
    originalCategory: "이차함수의 활용",
    standardCourse: "수학(상)",
    standardUnitKey: "H15-SA-13",
    standardUnit: "이차함수",
    standardUnitOrder: 13,
    content: "밑변의 길이가 $6$, 높이가 $4$인 이등변삼각형 내부에 밑변과 평행한 직사각형을 내접시킬 때, 이 직사각형의 넓이의 최댓값을 구하시오. [5점]",
    choices: [
      "$4$",
      "$6$",
      "$8$",
      "$12$",
      "$16$"
    ],
    answer: "②",
    solution: "삼각형의 높이를 $h=4$, 밑변을 $6$이라 하자. 직사각형의 높이를 $x$라 하면 닮음에 의해 가로 길이는 $\\frac{6}{4}(4-x)=\\frac{3}{2}(4-x)$이다.\n넓이 $S=\\frac{3}{2}(4-x)x$\n$S=-\\frac{3}{2}x^{2}+6x = -\\frac{3}{2}(x-2)^2 + 6$\n꼭짓점에서 최대값을 가지므로 $x=2$일 때 최댓값 $6$을 갖는다.\n따라서 정답은 ②이다."
  },
  {
    id: 18,
    level: "상",
    category: "다항식의 항등식",
    originalCategory: "다항식의 항등식",
    standardCourse: "수학(상)",
    standardUnitKey: "H15-SA-02",
    standardUnit: "항등식과 나머지정리",
    standardUnitOrder: 2,
    content: "이차식 $Q(x)$가 최고차항 계수 1이고 $Q(x)^{2}+Q(x+1)^{2}=xP(x)$를 만족시킨다. $P(x)$를 $Q(x+1)$로 나누었을 때의 나머지를 $R(x)$라 할 때, $R(0)$의 값은? [5.2점]",
    choices: [
      "$0$",
      "$2$",
      "$4$",
      "$6$",
      "$8$"
    ],
    answer: "①",
    solution: "$x=0$ 대입하면 $Q(0)^{2}+Q(1)^{2}=0$이므로 실수 조건(다항식의 계수가 실수이므로)에 의해 $Q(0)=0, Q(1)=0$이다.\n따라서 최고차항이 1인 이차식은 $Q(x)=x(x-1)$이다.\n원식에 대입하면\n$xP(x)=x^{2}(x-1)^{2}+x^{2}(x+1)^{2}$\n$=x^{2}[(x-1)^{2}+(x+1)^{2}]=x^{2}(2x^{2}+2)$\n따라서 $P(x)=2x^{3}+2x$이다.\n$Q(x+1)=x(x+1)$이므로 나눗셈 검산식을 세우면\n$P(x) = x(x+1)M(x) + R(x)$ (이때 나머지는 일차 이하 $R(x)=ax+b$)\n$x=0$ 대입: $P(0)=0 \\implies b=0$\n$x=-1$ 대입: $P(-1)=-4 \\implies -a=-4 \\implies a=4$\n따라서 $R(x)=4x$이고, $R(0)=0$이다.\n정답은 ①이다."
  },
  {
    id: 19,
    level: "상",
    category: "복소수의 연산",
    originalCategory: "복소수의 연산",
    standardCourse: "수학(상)",
    standardUnitKey: "H15-SA-04",
    standardUnit: "복소수",
    standardUnitOrder: 4,
    content: "복소수 $z=\\frac{1+i}{2\\sqrt{2}}$에 대하여 $z^{n}$이 순허수가 되도록 하는 $100$ 이하의 자연수 $n$의 개수를 $a$, $\\frac{1}{2^{10}} \\le |z^{n}| \\le \\frac{1}{2^{4}}$를 만족시키는 자연수 $n$의 개수를 $b$라 할 때, $a+b$의 값은? [5.2점]",
    choices: [
      "$30$",
      "$31$",
      "$32$",
      "$33$",
      "$34$"
    ],
    answer: "③",
    solution: "$z=\\frac{1}{2}\\cdot\\frac{1+i}{\\sqrt{2}}$이므로\n$|z|=\\frac{1}{2}$이고, $w=\\frac{1+i}{\\sqrt{2}}$라 두면 $z=\\frac{1}{2}w$이다.\n여기서\n$w^2=i,\\; w^4=-1,\\; w^8=1$\n이므로 $w^n$은 주기 $8$을 가진다.\n\n(1) $z^n$이 순허수가 되는 $n$의 개수 $a$\n$z^n=\\left(\\frac{1}{2}\\right)^n w^n$이므로, $z^n$이 순허수인지 여부는 $w^n$이 순허수인지와 같다.\n$w^n$이 순허수가 되는 것은 $n\\equiv 2,6 \\pmod 8$일 때이다.\n\n$1\\le n\\le100$에서\n$n\\equiv 2,6 \\pmod 8$인 수는\n$2,6,10,14,\\dots,98$\n이고, 이는 공차가 $4$인 등차수열이다.\n항의 개수는\n$\\frac{98-2}{4}+1=25$\n따라서 $a=25$이다.\n\n(2) $\\frac{1}{2^{10}} \\le |z^n| \\le \\frac{1}{2^4}$를 만족시키는 $n$의 개수 $b$\n$|z^n|=\\left(\\frac{1}{2}\\right)^n=\\frac{1}{2^n}$이므로\n$\\frac{1}{2^{10}} \\le \\frac{1}{2^n} \\le \\frac{1}{2^4}$\n에서\n$4\\le n\\le10$\n이다.\n따라서 가능한 자연수 $n$은 $4,5,6,7,8,9,10$의 $7$개이므로 $b=7$이다.\n\n따라서\n$a+b=25+7=32$\n이므로 정답은 ③이다."
  },
  {
    id: 20,
    level: "중",
    category: "나머지 정리",
    originalCategory: "나머지 정리",
    standardCourse: "수학(상)",
    standardUnitKey: "H15-SA-02",
    standardUnit: "항등식과 나머지정리",
    standardUnitOrder: 2,
    content: "[서논술형 1] 다항식 $f(x)$를 $(x-2)^{2}$으로 나눈 나머지가 $2x-1$이고, $x+1$로 나눈 나머지가 $6$이다. $f(x)$를 $(x-2)^{2}(x+1)$로 나눈 나머지 $R(x)$를 구하는 과정을 서술하고 $R(1)$의 값을 구하시오. [4점]",
    choices: [],
    answer: "x^2-2x+3, 2",
    solution: "$f(x) = (x-2)^2(x+1)Q(x) + R(x)$라 하면,\n$R(x)는 2차 이하이므로 R(x) = a(x-2)^2 + 2x-1$로 설정 가능하다.\n나머지 정리에 의해 $f(-1) = 6$이므로\n$R(-1) = a(-1-2)^2 + 2(-1)-1 = 9a-3 = 6 \\implies 9a = 9, a=1$.\n따라서 $R(x) = 1(x-2)^2 + 2x-1 = x^2-4x+4+2x-1 = x^2-2x+3$.\n$R(1) = 1-2+3 = 2$."
  },
  {
    id: 21,
    level: "중",
    category: "이차함수의 활용",
    originalCategory: "이차함수의 활용",
    standardCourse: "수학(상)",
    standardUnitKey: "H15-SA-13",
    standardUnit: "이차함수",
    standardUnitOrder: 13,
    content: "[서논술형 2] 지면에서 $20m/s$의 속도로 수직으로 쏘아 올린 물체의 $t$초 후의 높이가 $h(t) = -5t^{2} + 20t + 10$이다. (1) 물체가 최고 높이에 도달할 때의 시간과 그때의 높이를 구하고, (2) 물체의 높이가 $25m$ 이상인 시간은 몇 초 동안인지 서술하시오. [5점]",
    choices: [],
    answer: "2초, 30m, 2초",
    solution: "(1) $h(t) = -5(t-2)^2 + 30$이므로 $t=2$일 때 최고 높이 $30m$에 도달한다.\n(2) $-5t^2 + 20t + 10 \\ge 25$\n$-5t^2 + 20t - 15 \\ge 0 \\implies t^2 - 4t + 3 \\le 0$\n$(t-1)(t-3) \\le 0 \\implies 1 \\le t \\le 3$\n따라서 $3-1 = 2$초 동안이다."
  },
  {
    id: 22,
    level: "중",
    category: "다항식의 인수분해",
    originalCategory: "다항식의 인수분해",
    standardCourse: "수학(상)",
    standardUnitKey: "H15-SA-03",
    standardUnit: "인수분해",
    standardUnitOrder: 3,
    content: "[서논술형 3] 다항식 $f(x) = x^{4}-x^{2}-12$에 대하여 다음을 구하시오. (1) $f(x)$를 실수 범위에서 인수분해 하시오. (2) $f(x)=0$의 모든 복소수 해를 구하시오. (3) $f(x)$를 복소수 범위에서 인수분해 하시오. [5점]",
    choices: [],
    answer: "(x-2)(x+2)(x^2+3), x=\\pm2, \\pm\\sqrt{3}i, (x-2)(x+2)(x-\\sqrt{3}i)(x+\\sqrt{3}i)",
    solution: "(1) $x^2 = X$로 치환하면 $X^2-X-12 = (X-4)(X+3)$이다.\n따라서 $(x^2-4)(x^2+3) = (x-2)(x+2)(x^2+3)$이다.\n(2) $x^2-4=0 \\implies x=\\pm2$, $x^2+3=0 \\implies x=\\pm\\sqrt{3}i$.\n(3) (2)의 해를 이용하여 $(x-2)(x+2)(x-\\sqrt{3}i)(x+\\sqrt{3}i)$로 인수분해된다."
  },
  {
    id: 23,
    level: "상",
    category: "연립이차방정식",
    originalCategory: "연립이차방정식",
    standardCourse: "수학(상)",
    standardUnitKey: "H15-SA-07",
    standardUnit: "여러 가지 방정식",
    standardUnitOrder: 7,
    content: "[서논술형 4] 두 연립방정식 (가) $x-y=k$, (나) $x^{2}+2y^{2}=6$이 오직 한 쌍의 해를 가질 때, 양의 실수 $k$의 값을 구하고 그 과정을 서술하시오. [6점]",
    choices: [],
    answer: "③",
    solution: "(가)에서 $x = y+k$를 (나)에 대입하면\n$(y+k)^2 + 2y^2 = 6$\n$3y^2 + 2ky + k^2 - 6 = 0$\n오직 한 쌍의 해를 가지려면 $y$에 대한 이차방정식이 중근을 가져야 하므로 판별식 $D=0$이다.\n$D/4 = k^2 - 3(k^2-6) = 0$\n$k^2 - 3k^2 + 18 = 0 \\implies 2k^2 = 18 \\implies k^2 = 9$\n$k > 0$이므로 $k=3$이다."
  }
];
