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
    "solution": "$P(2)=0 \\implies 8-4+2k+6=0 \\implies 2k+10=0 \\implies k=-5$"
  },
  {
    "id": 2,
    "level": "하",
    "category": "곱셈 공식",
    "content": "$a^{2}+b^{2}+c^{2}+2ab+2bc+2ca=A^{2}, a^{3}-3a^{2}b+3ab^{2}-b^{3}=B^{3}$일 때, $A+B$를 구하시오. (단, $A$는 $a$의 계수가 양수) [3.5점]",
    "choices": ["$c$", "$2a+c$", "$2b+c$", "$2a+b+c$", "$2a+2b+c$"],
    "answer": "②",
    "solution": "$a^2+b^2+c^2+2ab+2bc+2ca=(a+b+c)^2 \\implies A=a+b+c$\n$a^3-3a^2b+3ab^2-b^3=(a-b)^3 \\implies B=a-b$\n$\\therefore A+B=(a+b+c)+(a-b)=2a+c$"
  },
  {
    "id": 3,
    "level": "하",
    "category": "이차방정식의 판별식",
    "content": "이차방정식 $x^{2}+2x+k-4=0$이 서로 다른 두 허근을 가질 때, 정수 $k$의 최솟값은? [3.5점]",
    "choices": ["$2$", "$3$", "$4$", "$5$", "$6$"],
    "answer": "⑤",
    "solution": "$D<0 \\implies 2^2-4(k-4)<0 \\implies 4-4k+16<0 \\implies 20-4k<0 \\implies k>5$\n$\\therefore \\text{최솟값 }6$"
  },
  {
    "id": 4,
    "level": "하",
    "category": "다항식의 나눗셈",
    "content": "다항식 $2x^{3}+3x^{2}-4x+11$을 $x^{2}-x+2$로 나누었을 때 몫과 나머지가 옳게 짝지어진 것은? [3.5점]",
    "choices": ["몫: $2x+1$, 나머지: $-x+13$", "몫: $2x+1$, 나머지: $x+9$", "몫: $2x+5$, 나머지: $-3x+1$", "몫: $2x+5$, 나머지: $-11x+22$", "몫: $2x+9$, 나머지: $x-8$"],
    "answer": "③",
    "solution": "$2x^3+3x^2-4x+11 \\div (x^2-x+2)$\n$=2x+5, \\text{ 나머지 }-3x+1$\n$\\therefore ③$"
  },
  {
    "id": 5,
    "level": "하",
    "category": "복소수의 연산",
    "content": "두 실수 $x, y$에 대하여 $i(2+xi)+(3-yi)=1+2i$일 때, $x+y$의 값은? [3.7점]",
    "choices": ["$-5$", "$-2$", "$0$", "$2$", "$5$"],
    "answer": "④",
    "solution": "$i(2+xi)=2i+xi^2=2i-x$\n$(3-yi)=3-yi$\n$\\implies (3-x)+(2-y)i=1+2i$\n$\\implies 3-x=1,\\;2-y=2$\n$\\implies x=2,\\;y=0$\n$\\therefore x+y=2$"
  },
  {
    "id": 6,
    "level": "하",
    "category": "이차방정식의 근과 계수",
    "content": "이차방정식 $x^{2}+5x-7=0$의 두 근을 $\\alpha, \\beta$라 할 때, $\\alpha^{2}\\beta+\\alpha\\beta^{2}$의 값은? [3.7점]",
    "choices": ["$-35$", "$-7$", "$-5$", "$5$", "$35$"],
    "answer": "⑤",
    "solution": "$\\alpha+\\beta=-5, \\alpha\\beta=-7$\n$\\alpha^2\\beta+\\alpha\\beta^2=\\alpha\\beta(\\alpha+\\beta)$\n$=(-7)(-5)=35$"
  },
    {
    "id": 7,
    "level": "중",
    "category": "다항식의 인수분해",
    "content": "다항식 $(x^{2}+4x+1)(x^{2}+4x+2)-6$을 인수분해한 것으로 옳은 것은? [3.7점]",
    "choices": ["$(x+2)^{2}(x^{2}+4x-1)$", "$(x+2)^{2}(x^{2}+4x+1)$", "$(x-1)(x+1)(x+2)^{2}$", "$(x^{2}+4x+1)(x^{2}+4x-1)$", "$(x-1)(x+5)(x^{2}+4x-1)$"],
    "answer": "①",
    "solution": "$t=x^2+4x \\implies (t+1)(t+2)-6=t^2+3t-4=(t+4)(t-1)=(x^2+4x+4)(x^2+4x-1)=(x+2)^2(x^2+4x-1)$"
  },
  {
    "id": 8,
    "level": "중",
    "category": "이차함수와 직선",
    "content": "[중] $y=3x^{2}-4x-7$의 그래프와 직선 $y=10x+10$의 두 교점의 $x$좌표를 각각 $a, b$라 하자. $a+b = \\frac{\\beta}{\\alpha}$일 때, $\\alpha+\\beta$의 값은? (단, $\\alpha, \\beta$는 서로소인 자연수) [4점]",
    "choices": ["$7$", "$11$", "$13$", "$17$", "$20$"],
    "answer": "④",
    "solution": "$3x^2-4x-7=10x+10 \\implies 3x^2-14x-17=0 \\implies a+b=\\frac{14}{3} \\therefore \\alpha=3,\\;\\beta=14 \\implies \\alpha+\\beta=17$"
  },
  {
    "id": 9,
    "level": "중",
    "category": "항등식",
    "content": "[중] $y=2x+2k$를 만족시키는 모든 실수 $x, y$에 대하여 $ax^{2}+xy+3y+18=0$이 항상 성립할 때, $ak$의 값은? [4점]",
    "choices": ["$-18$", "$-6$", "$0$", "$6$", "$18$"],
    "answer": "④",
    "solution": "$y=2x+2k$ 대입\n$ax^2+x(2x+2k)+3(2x+2k)+18=0$\n$(a+2)x^2+(2k+6)x+(6k+18)=0$\n$\\implies a+2=0,\\;2k+6=0,\\;6k+18=0$\n$\\implies a=-2,\\;k=-3 \\therefore ak=6$"
  },
  {
    "id": 10,
    "level": "중",
    "category": "이차방정식의 판별식",
    "content": "[중] 이차방정식 $(x^{2}+2x+3)k+3x^{2}-4x-1=0$이 중근을 갖도록 하는 모든 실수 $k$의 값의 합을 구하시오. [4점]",
    "choices": ["$-12$", "$-7$", "$-6$", "$6$", "$12$"],
    "answer": "③",
    "solution": "$(k+3)x^2+(2k-4)x+(3k-1)=0$\n$D=0$\n$(2k-4)^2-4(k+3)(3k-1)=0$\n$4(k-2)^2-4(3k^2+8k-3)=0$\n$(k-2)^2-(3k^2+8k-3)=0$\n$k^2-4k+4-3k^2-8k+3=0$\n$-2k^2-12k+7=0 \\therefore k_1+k_2=-\\frac{-12}{2}=-6$"
  },
  {
    "id": 11,
    "level": "상",
    "category": "복소수의 성질",
    "content": "[상] $x^{3}=1$의 한 허근 $\\omega$에 대하여 $\\frac{\\omega^{2}+\\bar{\\omega}^{2}}{1+\\omega^{2}}+\\frac{\\omega+\\bar{\\omega}}{1+\\omega}$의 값을 구하시오. [4.3점]",
    "choices": ["$-2$", "$-1$", "$0$", "$1$", "$2$"],
    "answer": "②",
    "solution": "$\\omega^2+\\omega+1=0$\n$\\omega+\\bar{\\omega}=-1,\\;\\omega\\bar{\\omega}=1$\n$\\omega^2+\\bar{\\omega}^2=(\\omega+\\bar{\\omega})^2-2\\omega\\bar{\\omega}=1-2=-1$\n$\\omega^2+\\omega+1=0 \\implies 1+\\omega^2=-\\omega,\\;1+\\omega=-\\omega^2$\n$\\implies \\frac{-1}{-\\omega}+\\frac{-1}{-\\omega^2}=\\frac{1}{\\omega}+\\frac{1}{\\omega^2}$\n$=\\frac{\\omega+1}{\\omega^2}=-1$"
  },
  {
    "id": 12,
    "level": "상",
    "category": "연립방정식",
    "content": "[상] 연립방정식 $xy=2, x+y+2xy=10$을 만족하는 두 실수 $x, y$에 대하여 $2x-y$의 최솟값을 구하시오. [4.3점]",
    "choices": ["$3-3\\sqrt{7}$", "$-2\\sqrt{7}$", "$36$", "$3+3\\sqrt{7}$", "$2\\sqrt{7}$"],
    "answer": "①",
    "solution": "$xy=2,\\;x+y+4=10 \\implies x+y=6$\n$t^2-6t+2=0 \\implies t=3\\pm\\sqrt{7}$\n$x,y \\in \\{3\\pm\\sqrt{7}\\}$\n$2x-y \\text{ 최소} \\Rightarrow x=3-\\sqrt{7},\\;y=3+\\sqrt{7}$\n$=2(3-\\sqrt{7})-(3+\\sqrt{7})=3-3\\sqrt{7}$"
  },
    {
    "id": 13,
    "level": "상",
    "category": "나머지 정리",
    "content": "[상] 최고차항 계수 1인 삼차식 $P(x)$에 대하여 $P(x)$를 $x-1$로 나눈 몫 $Q(x)$, 나머지 $3$. $Q(x)$를 $(x+1)^{2}$으로 나눈 나머지는 $-2$. $P(2)$의 값은? [4.5점]",
    "choices": ["$10$", "$5$", "$0$", "$5$", "$10$"],
    "answer": "⑤",
    "solution": "$P(x)=(x-1)Q(x)+3$\n$Q(x)$는 최고차항 계수 1인 이차식\n$(x+1)^2$으로 나눈 나머지가 $-2$이므로\n$Q(x)=(x+1)^2-2=x^2+2x-1$\n$\\therefore P(x)=(x-1)(x^2+2x-1)+3$\n$=x^3+x^2-3x+1+3=x^3+x^2-3x+4$\n$\\therefore P(2)=8+4-6+4=10$"
  },
  {
    "id": 14,
    "level": "중",
    "category": "복소수의 주기성",
    "content": "[중] 복소수 $z=\\frac{\\sqrt{2}}{1+i}$에 대하여 $1+z+z^{2}+\\dots+z^{21}+z^{24}$의 값을 구하시오. [4.5점]",
    "choices": ["$0$", "$1$", "$2$", "$3$", "$4$"],
    "answer": "②",
    "solution": "$z=\\frac{\\sqrt{2}}{1+i}=\\frac{1-i}{\\sqrt{2}}$\n$z^2=-i,\\;z^4=-1,\\;z^8=1$\n$\\sum_{k=0}^{7}z^k=0$\n$\\sum_{k=0}^{23}z^k=0$\n$\\therefore 1+z+\\cdots+z^{21}+z^{24}=z^{24}=(z^8)^3=1$"
  },
   {
    "id": 15,
    "level": "상",
    "category": "이차함수와 판별식",
    "content": "[상] $-x^{2}+ax+b=0$의 한 근이 $1+2i$일 때, 이차함수 $y=x^{2}-2bx-a+k$는 $x$축과 접한다. $x$축과의 교점의 $x$좌표를 $\\alpha$라 할 때, $k+4\\alpha$의 값을 구하시오. [4.5점]",
    "choices": ["$5$", "$1$", "$3$", "$7$", "$11$"],
    "answer": "④",
    "solution": "주어진 방정식의 한 근이 $1+2i$이므로 켤레근 $1-2i$도 근이다.\n$-x^2+ax+b=0 \\Rightarrow x^2-ax-b=0$\n따라서 근과 계수의 관계에 의해\n$\\alpha+\\beta=a,\\;\\alpha\\beta=-b$\n$\\alpha+\\beta=2,\\;\\alpha\\beta=5$\n$\\therefore a=2,\\;b=-5$\n\n이차함수\n$y=x^2-2bx-a+k=x^2+10x-2+k$\n\n$x$축과 접하므로 중근을 갖는다.\n$\\therefore D=0$\n$10^2-4(1)(-2+k)=0$\n$100-4k+8=0$\n$108-4k=0 \\Rightarrow k=27$\n\n$y=(x+5)^2 \\Rightarrow \\alpha=-5$\n\n$\\therefore k+4\\alpha=27+4(-5)=7$"
  },
  {
    "id": 16,
    "level": "상",
    "category": "이차방정식의 판별식",
    "content": "[상] $-20 \\le m, n \\le 20$인 정수 $m, n$. $x^{2}+mx+n=0$은 중근, $x^{2}+nx+m=0$은 서로 다른 두 실근인 순서쌍 개수는? [4.8점]",
    "choices": ["$4$개", "$5$개", "$6$개", "$7$개", "$8$개"],
    "answer": "③",
    "solution": "중근 조건\n$m^2-4n=0 \\implies n=\\frac{m^2}{4}$\n$n$이 정수이므로 $m=2k$\n$\\therefore n=k^2$\n\n두 번째 방정식\n$x^2+k^2x+2k=0$\n서로 다른 두 실근\n$D>0$\n$k^4-8k>0$\n$k(k^3-8)>0$\n\n범위 $-20\\le m,n\\le20$\n$m=2k \\Rightarrow |k|\\le10$\n$n=k^2\\le20 \\Rightarrow |k|\\le4$\n\n따라서 $k=-4,-3,-2,-1,1,2,3,4$\n이 중 $k(k^3-8)>0$ 만족\n$k=-4,-3,-2,-1,3,4$\n\n각각 하나씩 대응\n$\\therefore 6\\text{개}$"
  },
{
    "id": 17,
    "level": "고1",
    "category": "공통수학1",
    "content": "오른쪽 그림과 같이 $\\overline{AB}=\\overline{AC}$인 이등변삼각형 $ABC$의 내부에 직사각형을 딱 맞게 넣으려고 한다. 삼각형 $ABC$의 넓이가 $6$이고 $\\overline{BC}=4$일 때, 이 직사각형의 넓이의 최댓값을 구하시오.\n<div class=\"svg-container\"><svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 240 200\" preserveAspectRatio=\"xMidYMid meet\"><rect x=\"80\" y=\"110.0\" width=\"80\" height=\"60.0\" fill=\"none\" stroke=\"black\" stroke-width=\"2\"/><polygon points=\"120,50 40,170 200,170\" fill=\"none\" stroke=\"black\" stroke-width=\"2.5\"/><text x=\"115\" y=\"40\" font-size=\"14\" font-weight=\"bold\">A</text><text x=\"25\" y=\"175\" font-size=\"14\" font-weight=\"bold\">B</text><text x=\"205\" y=\"175\" font-size=\"14\" font-weight=\"bold\">C</text></svg></div>",
    "choices": [
      "3",
      "6",
      "9",
      "12",
      "15"
    ],
    "answer": "1",
    "solution": "삼각형의 밑변을 $BC$, 높이를 $AH$라 하면 넓이가 $6$이므로 $\\frac{1}{2} \\cdot 4 \\cdot AH = 6$에서 $AH=3$이다. 직사각형의 높이를 $h$, 가로 길이를 $w$라 하면 삼각형의 닮음에 의해 $(3-h):3 = w:4$이 성립한다. 즉, $w = \\frac{4}{3}(3-h)$이다. 직사각형의 넓이 $S = w \\cdot h = \\frac{4}{3}(3-h)h$이다. $S = -\\frac{4}{3}(h-1.5)^2 + 3$이므로 $h=1.5$일 때 최댓값 $3$을 갖는다.\n<div class=\"svg-container\"><svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 240 200\" preserveAspectRatio=\"xMidYMid meet\"><rect width=\"240\" height=\"200\" fill=\"#f9f9f9\" stroke=\"#eee\" stroke-width=\"1\"/><line x1=\"120\" y1=\"50\" x2=\"120\" y2=\"170\" stroke=\"black\" stroke-width=\"1\" stroke-dasharray=\"3 3\"/><text x=\"125\" y=\"110.0\" font-size=\"12\" font-weight=\"bold\">3</text><text x=\"115\" y=\"185\" font-size=\"12\">H</text><rect x=\"80\" y=\"110.0\" width=\"80\" height=\"60.0\" fill=\"none\" stroke=\"black\" stroke-width=\"2\"/><polygon points=\"120,50 40,170 200,170\" fill=\"none\" stroke=\"black\" stroke-width=\"2.5\"/><text x=\"115\" y=\"40\" font-size=\"14\" font-weight=\"bold\">A</text><text x=\"25\" y=\"175\" font-size=\"14\" font-weight=\"bold\">B</text><text x=\"205\" y=\"175\" font-size=\"14\" font-weight=\"bold\">C</text><text x=\"120\" y=\"188\" font-size=\"12\" text-anchor=\"middle\">4</text><text x=\"120\" y=\"105.0\" font-size=\"12\" text-anchor=\"middle\">w</text><text x=\"65\" y=\"140.0\" font-size=\"12\">h</text></svg></div>"
  },
  {
    "id": 18,
    "level": "상",
    "category": "다항식의 항등식",
    "content": "[상] $Q(x)^{2}+Q(x+2)^{2}=xP(x)$를 만족하는 이차식 $Q(x)$(최고차항 1)에 대하여 $P(x)$를 $Q(x+2)$로 나눈 나머지 $R(1)$은? [5.2점]",
    "choices": ["$8$", "$2$", "$4$", "$10$", "$16$"],
    "answer": "⑤",
    "solution": "$x=0$ 대입\n$Q(0)^2+Q(2)^2=0 \\implies Q(0)=0,\\;Q(2)=0$\n이차식이므로\n$Q(x)=x(x-2)$\n원식에 대입\n$xP(x)=x^2(x-2)^2+x^2(x+2)^2$\n$=x^2[(x-2)^2+(x+2)^2]$\n$=x^2(2x^2+8)$\n$\\therefore P(x)=2x^3+8x$\n$Q(x+2)=x(x+2)$\n나머지는 1차식 $R(x)=ax+b$\n$x=0,-2$ 대입\n$P(0)=0,\\;P(-2)=-32$\n$R(0)=0,\\;R(-2)=-32$\n$\\therefore R(x)=16x \\implies R(1)=16$"
  },
  {
    "id": 19,
    "level": "상",
    "category": "복소수의 연산",
    "content": "[상] $z=\\frac{1}{\\sqrt{5}(1-\\sqrt{3}i)}$일 때, $z^n$ 유리수 개수 $a$, $\\frac{1}{10^8} < |z^n| < \\frac{1}{10^2}$ 개수 $b$에 대해 $a-b$는? ($10 \\le n \\le 100$) [5.2점]",
    "choices": [],
    "answer": "3",
    "solution": "$z=\\frac{1+\\sqrt{3}i}{2\\sqrt{5}}=\\frac{1}{\\sqrt{5}}(\\cos\\frac{\\pi}{3}+i\\sin\\frac{\\pi}{3})$\n$z^n=\\left(\\frac{1}{\\sqrt{5}}\\right)^n(\\cos\\frac{n\\pi}{3}+i\\sin\\frac{n\\pi}{3})$\n유리수 조건\n$\\sin\\frac{n\\pi}{3}=0 \\implies n=3k$\n또한 $\\cos\\frac{n\\pi}{3}=\\pm1 \\implies n=6k$\n$10\\le n\\le100 \\implies n=12,18,\\dots,96 \\Rightarrow a=15$\n크기 조건\n$\\left(\\frac{1}{\\sqrt{5}}\\right)^n=10^{-\\frac{n}{2}\\log5}$\n$10^{-8}<10^{-\\frac{n}{2}\\log5}<10^{-2}$\n$2<\\frac{n}{2}\\log5<8$\n$\\log5\\approx0.7 \\implies 6<n<22$\n$10\\le n\\le21 \\Rightarrow b=12$\n$\\therefore a-b=3$"
  },
  {
    "id": 20,
    "level": "중",
    "category": "나머지 정리",
    "content": "[서논술형 1] $f(x)$가 $(x-1)$을 인수로 갖고, $(x-3)$으로 나눈 나머지가 $2$일 때, $(x-1)(x-3)$으로 나눈 나머지 $R(x)$를 구하시오. [4점]",
    "choices": [],
    "answer": "x-1",
    "solution": "$R(x)=ax+b$로 둔다\n$f(1)=0,\\;f(3)=2$\n$\\implies R(1)=0,\\;R(3)=2$\n$a+b=0,\\;3a+b=2$\n$\\therefore a=1,\\;b=-1$\n$R(x)=x-1$"
  },
  {
    "id": 21,
    "level": "중",
    "category": "이차함수의 활용",
    "content": "[서논술형 2] 높이 $h(t)=-5t^{2}+4t+2$에 대하여 (1) 수면에 닿는 시간, (2) 1초 이내 최대 높이, (3) 1초 이내 최소 높이를 구하시오. [5점]",
    "choices": [],
    "answer": "(2+\\sqrt{14})/5, 14/5, 1",
    "solution": "(1)\n$h(t)=0$\n$-5t^2+4t+2=0$\n$5t^2-4t-2=0$\n$t=\\frac{4\\pm\\sqrt{16+40}}{10}=\\frac{4\\pm\\sqrt{56}}{10}=\\frac{2\\pm\\sqrt{14}}{5}$\n$t>0 \\Rightarrow t=\\frac{2+\\sqrt{14}}{5}$\n\n(2)\n꼭짓점 $t=-\\frac{b}{2a}=\\frac{4}{10}=\\frac{2}{5}$\n$0\\le t\\le1$ 범위 포함\n$h(\\frac{2}{5})=-5(\\frac{2}{5})^2+4(\\frac{2}{5})+2=\\frac{14}{5}$\n\n(3)\n구간 $[0,1]$에서 최소값\n$h(0)=2,\\;h(1)=1$\n$\\therefore \\min=1$"
  },
  {
    "id": 22,
    "level": "중",
    "category": "다항식의 인수분해",
    "content": "[서논술형 3] $f(x)=x^{3}-2x+4$를 (1) 실수 범위 인수분해, (2) $f(x)=0$ 풀이, (3) 복소수 범위 인수분해 과정을 서술하시오. [5점]",
    "choices": [],
    "answer": "(x+2)(x^2-2x+2), -2, 1\\pm i, (x+2)(x-1-i)(x-1+i)",
    "solution": "(1)\n$f(-2)=0 \\implies (x+2)$ 인수\n$f(x)=(x+2)(x^2-2x+2)$\n(2)\n$x^2-2x+2=0$\n$x=\\frac{2\\pm\\sqrt{-4}}{2}=1\\pm i$\n$\\therefore x=-2,1\\pm i$\n(3)\n$=(x+2)(x-1-i)(x-1+i)$"
  },
  {
    "id": 23,
    "level": "상",
    "category": "연립이차방정식",
    "content": "[서논술형 4] 연립방정식 $x^{2}+3y^{2}-4xy-6y+2x=0, 3x^{2}+2xy+3y^{2}-4k^{2}=0$이 정확히 세 쌍의 해를 가질 때 양의 실수 $k$를 구하시오. [6점]",
    "choices": [],
    "answer": "1",
    "solution": "첫 번째 식 인수분해\n$(x-3y)(x-y+2)=0$\n(1) $x=3y$\n두 번째 식에 대입\n$3(3y)^2+2(3y)y+3y^2-4k^2=0$\n$36y^2-4k^2=0$\n$y=\\pm\\frac{k}{3}$ (2쌍)\n(2) $x=y-2$\n대입\n$3(y-2)^2+2(y-2)y+3y^2-4k^2=0$\n$8y^2-16y+12-4k^2=0$\n해가 1쌍이어야 하므로 중근\n$D=0$\n$(-16)^2-4\\cdot8(12-4k^2)=0$\n$256-32(12-4k^2)=0$\n$256-384+128k^2=0$\n$128k^2=128$\n$k=1$"
  }
  ];
