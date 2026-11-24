window.examData = {
  "title": "2023학년도 금당중 2학년 1학기 중간고사 수학",
  "totalScore": 100.0,
  "questions": [
    {
      "id": 1,
      "score": 3.0,
      "question": "<p>다음 중 순환소수의 표현으로 옳은 것은?</p>",
      "choices": [
        "$0.11111\\cdots = 0.\\dot{1}\\dot{1}$",
        "$0.070707\\cdots = 0.\\dot{0}\\dot{7}$",
        "$0.404040\\cdots = 0.4\\dot{0}\\dot{4}$",
        "$1.571571571\\cdots = 1.\\dot{5}\\dot{7}$",
        "$0.1253253253\\cdots = 0.\\dot{2}5\\dot{3}$"
      ],
      "answer": "②",
      "solution": "<p>① $0.1111\\cdots=0.\\dot{1}$ (옳지 않다)<br>② $0.070707\\cdots$의 순환마디는 $07$이므로 $0.\\dot{0}\\dot{7}$ (옳다)<br>③ $0.404040\\cdots=0.\\dot{4}\\dot{0}$ (옳지 않다)<br>④ $1.571571\\cdots=1.\\dot{5}7\\dot{1}$ (옳지 않다)<br>⑤ $0.1253253\\cdots=0.1\\dot{2}5\\dot{3}$ (옳지 않다)</p>"
    },
    {
      "id": 2,
      "score": 4.0,
      "question": "<p>$\\frac{a}{140}$를 약분하면 $\\frac{1}{b}$이 되고, 이것을 소수로 나타내면 유한소수가 된다. 이때 $a-b$의 값은? (단, $25 < a < 30$)</p>",
      "choices": [
        "23",
        "24",
        "25",
        "26",
        "27"
      ],
      "answer": "①",
      "solution": "<p>$25<a<30$인 $a$ 중 $\\frac{a}{140}$을 약분하여 분자가 $1$이 되려면 $a$가 $140$의 약수이어야 한다.<br>$140=2^2\\times5\\times7$의 약수 중 $25$와 $30$ 사이의 수는 $28$이다. $a=28$<br>$\\frac{28}{140}=\\frac{1}{5}$이므로 $b=5$이고 $\\frac{1}{5}=0.2$로 유한소수이다.<br>$a-b=28-5=23$</p>"
    },
    {
      "id": 3,
      "score": 4.0,
      "question": "<p>다음은 분수 $\\frac{21}{60}$을 유한소수로 나타내는 과정이다. $a+b+c$의 값은?</p><div class=\"box\"><p>$\\frac{21}{60} = \\frac{a}{2^2 \\times 5} = \\frac{a \\times b}{2^2 \\times 5 \\times b} = c$</p></div>",
      "choices": [
        "7",
        "7.35",
        "7.7",
        "12.35",
        "12.7"
      ],
      "answer": "④",
      "solution": "<p>$\\frac{21}{60}$을 약분하면 $\\frac{7}{20}=\\frac{7}{2^2\\times5}$이므로 $a=7$이다.<br>분모를 $10$의 거듭제곱으로 만들기 위해 분모와 분자에 $5$를 곱하면 $\\frac{7\\times5}{2^2\\times5\\times5}=\\frac{35}{100}$이므로 $b=5$이다.<br>$c=0.35$<br>$a+b+c=7+5+0.35=12.35$</p>"
    },
    {
      "id": 4,
      "score": 4.0,
      "question": "<p>순환소수를 분수로 나타내는 과정에서 주어진 순환소수를 $x$라 할 때, $1000x - 10x$를 이용하는 것이 가장 편리한 것은?</p>",
      "choices": [
        "$0.\\dot{2}\\dot{7}$",
        "$0.\\dot{2}\\dot{5}$",
        "$6.2\\dot{5}$",
        "$1.\\dot{2}3\\dot{4}$",
        "$4.3\\dot{2}\\dot{4}$"
      ],
      "answer": "⑤",
      "solution": "<p>$1000x-10x$를 쓰려면 소수점 아래에서 순환하지 않는 부분이 $1$자리, 순환마디가 $2$자리이어야 한다. ($1000x$는 순환마디 한 번 뒤, $10x$는 순환마디 시작 직전)<br>① $0.\\dot{2}\\dot{7}$은 $100x-x$를 쓴다.<br>② $0.\\dot{2}\\dot{5}$는 $100x-x$를 쓴다.<br>③ $6.2\\dot{5}$는 $100x-10x$를 쓴다.<br>④ $1.\\dot{2}3\\dot{4}$는 $1000x-x$를 쓴다.<br>⑤ $4.3\\dot{2}\\dot{4}$는 비순환 $1$자리, 순환마디 $2$자리이므로 $1000x-10x$를 쓴다.</p>"
    },
    {
      "id": 5,
      "score": 4.0,
      "question": "<p>분수 $\\frac{5}{7} = 0.\\dot{7}1428\\dot{5}$ 이다. 소수점 아래 2023번째 자리의 숫자를 $a$, 소수점 아래 2023번째 자리까지의 숫자 중 7이 나오는 횟수를 $b$라 할 때, $a+b$의 값은?</p>",
      "choices": [
        "343",
        "344",
        "345",
        "346",
        "347"
      ],
      "answer": "③",
      "solution": "<p>$\\frac{5}{7}=0.\\dot{7}1428\\dot{5}$의 순환마디는 $714285$ ($6$개)이다.<br>$2023=6\\times337+1$이므로 $2023$번째 숫자는 순환마디의 첫 번째 숫자 $7$이다. $a=7$<br>순환마디 한 번에 $7$이 $1$번 나오고, $337$번의 순환마디에 $7$이 $337$번, 나머지 $1$개($7$)에 $1$번이 있다. $b=337+1=338$<br>$a+b=7+338=345$</p>"
    },
    {
      "id": 6,
      "score": 4.0,
      "question": "<p>$3^3 = A$라고 할 때, $243^3 = A^\\Box$이다. 이때 $\\Box$ 안에 알맞은 수를 구하면?</p>",
      "choices": [
        "3",
        "4",
        "5",
        "6",
        "7"
      ],
      "answer": "⑤",
      "solution": "<p>$243=3^5$이므로 $243^3=(3^5)^3=3^{15}$이다.<br>$A=3^3$이므로 $A^\\Box=(3^3)^\\Box=3^{3\\times\\Box}$이다.<br>$3\\times\\Box=15$이므로 $\\Box=5$이다.</p>"
    },
    {
      "id": 7,
      "score": 4.0,
      "question": "<p>다음 중 계산 결과가 가장 큰 것은?</p>",
      "choices": [
        "$2^4 \\times 2^3$",
        "$(2^3)^4 \\div 2^5$",
        "$2^2 \\div 2 \\times 2^3$",
        "$2^{12} \\times \\frac{1}{2^3} \\div 2^3$",
        "$2^5 \\times 2 \\div \\frac{1}{2^3}$"
      ],
      "answer": "⑤",
      "solution": "<p>각 식을 $2$의 거듭제곱으로 나타낸다.<br>① $2^4\\times2^3=2^7$<br>② $(2^3)^4\\div2^5=2^{12}\\div2^5=2^7$<br>③ $2^2\\div2\\times2^3=2\\times2^3=2^4$<br>④ $2^{12}\\times\\frac{1}{2^3}\\div2^3=2^{12-3-3}=2^6$<br>⑤ $2^5\\times2\\div\\frac{1}{2^3}=2^6\\times2^3=2^9$<br>가장 큰 것은 $2^9$인 ⑤이다.</p>"
    },
    {
      "id": 8,
      "score": 4.0,
      "question": "<p>$2^7 \\times 3 \\times 5^9$을 $a \\times 10^n$ (단, $1 \\le a < 10$, $n$은 자연수)의 꼴로 나타낼 때, 두 수 $a+n$의 값은?</p>",
      "choices": [
        "10.5",
        "11",
        "11.5",
        "14.5",
        "15.5"
      ],
      "answer": "⑤",
      "solution": "<p>$2^7\\times3\\times5^9=3\\times5^2\\times(2^7\\times5^7)=75\\times10^7$이다.<br>$75\\times10^7=7.5\\times10^8$이므로 $a=7.5$, $n=8$이다.<br>$a+n=15.5$</p>"
    },
    {
      "id": 9,
      "score": 4.0,
      "question": "<p>다음 중 옳지 않은 것은?</p>",
      "choices": [
        "$7a^2 \\times (-3b^3) = -21a^2b^3$",
        "$4x^3 \\times (-3xy)^2 = -36x^5y^2$",
        "$35a^5b^2 \\div 5a^3b = 7a^2b$",
        "$(-2x^2y^4)^3 \\div x^5y^{11} = -8xy$",
        "$(4x^3y)^2 \\div \\frac{2xy^2}{3} = 24x^5$"
      ],
      "answer": "②",
      "solution": "<p>① $7a^2\\times(-3b^3)=-21a^2b^3$ (옳다)<br>② $4x^3\\times(-3xy)^2=4x^3\\times9x^2y^2=36x^5y^2$ 이므로 $-36x^5y^2$는 옳지 않다.<br>③ $35a^5b^2\\div5a^3b=7a^2b$ (옳다)<br>④ $(-2x^2y^4)^3\\div x^5y^{11}=-8x^6y^{12}\\div x^5y^{11}=-8xy$ (옳다)<br>⑤ $(4x^3y)^2\\div\\frac{2xy^2}{3}=16x^6y^2\\times\\frac{3}{2xy^2}=24x^5$ (옳다)</p>"
    },
    {
      "id": 10,
      "score": 5.0,
      "question": "<p>다음 등식을 만족시키는 세 자연수 $a$, $b$, $c$에 대하여 $a+b+c$의 값은?</p><div class=\"box\"><p>$$16x^7y^6 \\div (-2xy^2)^3 \\div \\frac{1}{4}xy^2 = -\\frac{bx^c}{y^a}$$</p></div>",
      "choices": [
        "13",
        "14",
        "15",
        "16",
        "17"
      ],
      "answer": "①",
      "solution": "<p>$16x^7y^6\\div(-2xy^2)^3\\div\\frac{1}{4}xy^2$를 계산한다.<br>$(-2xy^2)^3=-8x^3y^6$이므로 $16x^7y^6\\div(-8x^3y^6)=-2x^4$이다.<br>$-2x^4\\div\\frac{1}{4}xy^2=-2x^4\\times\\frac{4}{xy^2}=-\\frac{8x^3}{y^2}$<br>$-\\frac{bx^c}{y^a}$와 비교하면 $b=8$, $c=3$, $a=2$이다.<br>$a+b+c=13$</p>"
    },
    {
      "id": 11,
      "score": 4.0,
      "question": "<p>$\\overline{\\mathrm{AB}} = \\overline{\\mathrm{AC}}$인 이등변삼각형 $\\mathrm{ABC}$에서 $\\angle x = 130^\\circ$일 때, $\\angle x$의 크기는?</p><p><img src=\"assets/images/23_금당중_1학기_중간_중2_수학/q11.png\"></p>",
      "choices": [
        "$50^\\circ$",
        "$60^\\circ$",
        "$65^\\circ$",
        "$70^\\circ$",
        "$80^\\circ$"
      ],
      "answer": "⑤",
      "solution": "<p>$\\angle\\mathrm{C}$의 외각이 $130^\\circ$이므로 $\\angle\\mathrm{ACB}=180^\\circ-130^\\circ=50^\\circ$이다.<br>$\\overline{\\mathrm{AB}}=\\overline{\\mathrm{AC}}$이므로 $\\angle\\mathrm{B}=\\angle\\mathrm{C}=50^\\circ$이다.<br>$\\angle x=\\angle\\mathrm{A}=180^\\circ-50^\\circ-50^\\circ=80^\\circ$</p>"
    },
    {
      "id": 12,
      "score": 4.0,
      "question": "<p>$\\triangle \\mathrm{ABC}$에서 $\\overline{\\mathrm{AC}} = \\overline{\\mathrm{AE}} = \\overline{\\mathrm{DE}} = \\overline{\\mathrm{DB}}$이고 $\\angle \\mathrm{B} = 25^\\circ$일 때, $\\angle x$의 크기는?</p><p><img src=\"assets/images/23_금당중_1학기_중간_중2_수학/q12-problem-visual-v2.svg\" alt=\"B, D, A는 한 직선 위에 있고 B, E, C도 한 직선 위에 있다. AC, AE, DE, DB는 모두 길이가 같고 B의 각은 25도이다. A에서 AE와 AC 사이 각은 x이다.\" style=\"display:block;width:min(100%,520px);height:auto;margin:0 auto;\"></p>",
      "choices": [
        "$25^\\circ$",
        "$30^\\circ$",
        "$35^\\circ$",
        "$40^\\circ$",
        "$45^\\circ$"
      ],
      "answer": "②",
      "solution": "<p>$\\overline{\\mathrm{DB}}=\\overline{\\mathrm{DE}}$이므로 $\\angle\\mathrm{DEB}=\\angle\\mathrm{B}=25^\\circ$이다.<br>$\\angle\\mathrm{ADE}$는 $\\triangle\\mathrm{DBE}$의 외각이므로 $25^\\circ+25^\\circ=50^\\circ$이다.<br>$\\overline{\\mathrm{DE}}=\\overline{\\mathrm{AE}}$이므로 $\\angle\\mathrm{DAE}=\\angle\\mathrm{ADE}=50^\\circ$이고 $\\angle\\mathrm{AED}=180^\\circ-100^\\circ=80^\\circ$이다.<br>$\\angle\\mathrm{AEC}=180^\\circ-\\angle\\mathrm{DEB}-\\angle\\mathrm{AED}=180^\\circ-25^\\circ-80^\\circ=75^\\circ$이다.<br>$\\overline{\\mathrm{AE}}=\\overline{\\mathrm{AC}}$이므로 $\\angle\\mathrm{ACE}=\\angle\\mathrm{AEC}=75^\\circ$이다.<br>$\\angle x=180^\\circ-75^\\circ-75^\\circ=30^\\circ$</p>"
    },
    {
      "id": 13,
      "score": 4.0,
      "question": "<p>다음 그림과 같이 $\\overline{\\mathrm{AB}} = \\overline{\\mathrm{AC}}$인 이등변삼각형 $\\mathrm{ABC}$에서 $\\angle \\mathrm{B}$의 이등분선과 $\\angle \\mathrm{C}$의 외각의 이등분선의 교점을 $\\mathrm{D}$라 하자. $\\angle \\mathrm{A} = 36^\\circ$일 때, $\\angle x$의 크기는?</p><p><img src=\"assets/images/23_금당중_1학기_중간_중2_수학/q13-problem-visual-v2.svg\" alt=\"A각은 36도이다. AB와 AC는 같은 길이이다. B의 이등분선과 C 바깥 각의 이등분선이 D에서 만난다. BDC에서 x를 표시했다.\" style=\"display:block;width:min(100%,520px);height:auto;margin:0 auto;\"></p>",
      "choices": [
        "$14^\\circ$",
        "$15^\\circ$",
        "$18^\\circ$",
        "$20^\\circ$",
        "$22^\\circ$"
      ],
      "answer": "③",
      "solution": "<p>$\\overline{\\mathrm{AB}}=\\overline{\\mathrm{AC}}$이고 $\\angle\\mathrm{A}=36^\\circ$이므로 $\\angle\\mathrm{B}=\\angle\\mathrm{ACB}=72^\\circ$이다.<br>$\\angle\\mathrm{DBC}=\\frac{1}{2}\\times72^\\circ=36^\\circ$이다.<br>$\\angle\\mathrm{C}$의 외각은 $180^\\circ-72^\\circ=108^\\circ$이고 그 이등분선이 $\\angle\\mathrm{DCE}=54^\\circ$이다.<br>$\\angle\\mathrm{DCE}$는 $\\triangle\\mathrm{DBC}$의 외각이므로 $\\angle\\mathrm{DCE}=\\angle\\mathrm{DBC}+\\angle x$이다.<br>$54^\\circ=36^\\circ+\\angle x$이므로 $\\angle x=18^\\circ$이다.</p>"
    },
    {
      "id": 14,
      "score": 4.0,
      "question": "<p>다음 중에서 오른쪽 두 직각삼각형 $\\mathrm{ABC}$와 $\\mathrm{DEF}$가 서로 합동이 되는 조건이 아닌 것은?</p><p><img src=\"assets/images/23_금당중_1학기_중간_중2_수학/q14-problem-visual-v2.svg\" alt=\"왼쪽 삼각형 ABC는 C에서 직각이고 오른쪽 삼각형 DEF는 F에서 직각이다.\" style=\"display:block;width:min(100%,520px);height:auto;margin:0 auto;\"></p>",
      "choices": [
        "$\\angle \\mathrm{A} = \\angle \\mathrm{D}, \\; \\angle \\mathrm{B} = \\angle \\mathrm{E}$",
        "$\\overline{\\mathrm{AB}} = \\overline{\\mathrm{DE}}, \\; \\angle \\mathrm{B} = \\angle \\mathrm{E}$",
        "$\\overline{\\mathrm{AB}} = \\overline{\\mathrm{DE}}, \\; \\overline{\\mathrm{AC}} = \\overline{\\mathrm{DF}}$",
        "$\\overline{\\mathrm{AB}} = \\overline{\\mathrm{DE}}, \\; \\angle \\mathrm{A} = \\angle \\mathrm{D}$",
        "$\\overline{\\mathrm{AB}} = \\overline{\\mathrm{DE}}, \\; \\overline{\\mathrm{BC}} = \\overline{\\mathrm{EF}}$"
      ],
      "answer": "①",
      "solution": "<p>직각삼각형의 합동 조건은 RHA(빗변의 길이와 한 예각의 크기가 같을 때)와 RHS(빗변의 길이와 다른 한 변의 길이가 같을 때)이다.<br>① 두 예각이 같으면 세 각이 같을 뿐 크기가 정해지지 않으므로 합동 조건이 아니다.<br>② $\\overline{\\mathrm{AB}}=\\overline{\\mathrm{DE}}$(빗변), $\\angle\\mathrm{B}=\\angle\\mathrm{E}$이므로 RHA 합동이다.<br>③ 빗변과 다른 한 변이 같으므로 RHS 합동이다.<br>④ 빗변과 한 예각이 같으므로 RHA 합동이다.<br>⑤ 빗변과 다른 한 변이 같으므로 RHS 합동이다.</p>"
    },
    {
      "id": 15,
      "score": 4.0,
      "question": "<p>다음 직각삼각형 $\\mathrm{ABC}$에서 $\\angle \\mathrm{BAD} = 25^\\circ$일 때 $x$의 값은?</p><p><img src=\"assets/images/23_금당중_1학기_중간_중2_수학/q15-problem-visual-v2.svg\" alt=\"A의 BAD각은 25도이다. B는 직각이고 E에서 DE가 AC에 수직이다. AB와 AE에 같은 눈금이 있으며 C의 각에는 x가 적혀 있다.\" style=\"display:block;width:min(100%,520px);height:auto;margin:0 auto;\"></p>",
      "choices": [
        "$35^\\circ$",
        "$36^\\circ$",
        "$38^\\circ$",
        "$40^\\circ$",
        "$45^\\circ$"
      ],
      "answer": "④",
      "solution": "<p>$\\overline{\\mathrm{AB}}=\\overline{\\mathrm{AE}}$이고 $\\mathrm{AD}$는 공통이며 $\\angle\\mathrm{B}=\\angle\\mathrm{AED}=90^\\circ$이므로 $\\triangle\\mathrm{ABD}\\equiv\\triangle\\mathrm{AED}$ (RHS 합동)이다.<br>$\\angle\\mathrm{DAE}=\\angle\\mathrm{BAD}=25^\\circ$이므로 $\\angle\\mathrm{A}=50^\\circ$이다.<br>$\\triangle\\mathrm{ABC}$에서 $x=\\angle\\mathrm{C}=180^\\circ-90^\\circ-50^\\circ=40^\\circ$이다.</p>"
    },
    {
      "id": 16,
      "score": 4.0,
      "question": "<p>오른쪽 그림에서 점 $\\mathrm{O}$가 $\\triangle \\mathrm{ABC}$의 외심일 때, 다음 중에서 옳은 것을 모두 고르면? (정답 2개)</p><p><img src=\"assets/images/23_금당중_1학기_중간_중2_수학/q16-problem-visual-v2.svg\" alt=\"삼각형 ABC의 외심은 O이다. O를 각 꼭짓점과 연결했다. AB, AC, BC에 내린 수선은 각각 M, L, N에 닿는다.\" style=\"display:block;width:min(100%,520px);height:auto;margin:0 auto;\"></p>",
      "choices": [
        "$\\overline{\\mathrm{OM}} = \\overline{\\mathrm{ON}}$",
        "$\\angle \\mathrm{OCL} = \\angle \\mathrm{OCN}$",
        "$\\triangle \\mathrm{OBN} \\equiv \\triangle \\mathrm{OCN}$",
        "$\\overline{\\mathrm{OA}} = \\overline{\\mathrm{OB}} = \\overline{\\mathrm{OC}}$",
        "$\\overline{\\mathrm{BM}} = \\overline{\\mathrm{BN}}$"
      ],
      "answer": "③, ④",
      "solution": "<p>점 $\\mathrm{O}$는 외심이므로 세 꼭짓점에 이르는 거리가 같고, 각 변의 수직이등분선의 교점이다.<br>① $\\overline{\\mathrm{OM}}=\\overline{\\mathrm{ON}}$은 내심의 성질이므로 외심에서는 항상 성립하지 않는다.<br>② $\\angle\\mathrm{OCL}=\\angle\\mathrm{OCN}$도 내심의 성질이므로 항상 성립하지 않는다.<br>③ $\\triangle\\mathrm{OBN}\\equiv\\triangle\\mathrm{OCN}$: $\\overline{\\mathrm{OB}}=\\overline{\\mathrm{OC}}$, $\\overline{\\mathrm{ON}}$ 공통, $\\angle\\mathrm{ONB}=\\angle\\mathrm{ONC}=90^\\circ$이므로 RHS 합동이다. (옳다)<br>④ $\\overline{\\mathrm{OA}}=\\overline{\\mathrm{OB}}=\\overline{\\mathrm{OC}}$ (옳다)<br>⑤ $\\overline{\\mathrm{BM}}=\\overline{\\mathrm{AM}}$이고 $\\overline{\\mathrm{BN}}=\\overline{\\mathrm{CN}}$이므로 $\\overline{\\mathrm{BM}}=\\overline{\\mathrm{BN}}$은 항상 성립하지 않는다.</p>"
    },
    {
      "id": 17,
      "score": 4.0,
      "question": "<p>점 $\\mathrm{O}$는 $\\triangle \\mathrm{ABC}$의 외심이다. $\\angle \\mathrm{BAO} = 24^\\circ$, $\\angle \\mathrm{CAO} = 26^\\circ$일 때, $\\angle \\mathrm{BCO}$의 크기는?</p><p><img src=\"assets/images/23_금당중_1학기_중간_중2_수학/q17-problem-visual-v2.svg\" alt=\"외심 O에 A와 C를 이었다. A에서 BAO각은 24도, CAO각은 26도이다. C에서는 BC와 CO가 이루는 각을 표시했다.\" style=\"display:block;width:min(100%,520px);height:auto;margin:0 auto;\"></p>",
      "choices": [
        "$34^\\circ$",
        "$36^\\circ$",
        "$40^\\circ$",
        "$44^\\circ$",
        "$46^\\circ$"
      ],
      "answer": "③",
      "solution": "<p>$\\mathrm{O}$가 외심이므로 $\\overline{\\mathrm{OA}}=\\overline{\\mathrm{OB}}=\\overline{\\mathrm{OC}}$이다.<br>$\\angle\\mathrm{BAC}=24^\\circ+26^\\circ=50^\\circ$이므로 중심각 $\\angle\\mathrm{BOC}=2\\times50^\\circ=100^\\circ$이다.<br>$\\triangle\\mathrm{OBC}$는 $\\overline{\\mathrm{OB}}=\\overline{\\mathrm{OC}}$인 이등변삼각형이므로 $\\angle\\mathrm{BCO}=\\frac{180^\\circ-100^\\circ}{2}=40^\\circ$이다.</p>"
    },
    {
      "id": 18,
      "score": 4.0,
      "question": "<p>점 $\\mathrm{O}$, $\\mathrm{I}$는 각각 $\\triangle \\mathrm{ABC}$의 외심, 내심이다. $\\angle \\mathrm{A} = 80^\\circ$일 때, $\\angle \\mathrm{BOC} - \\angle \\mathrm{BIC}$는?</p><p><img src=\"assets/images/23_금당중_1학기_중간_중2_수학/q18-problem-visual-v2.svg\" alt=\"삼각형의 꼭짓각은 80도이다. 밑변 끝 B와 C에서 외심 O로 잇는 선과 내심 I로 잇는 선을 각각 그렸다.\" style=\"display:block;width:min(100%,520px);height:auto;margin:0 auto;\"></p>",
      "choices": [
        "$28^\\circ$",
        "$30^\\circ$",
        "$32^\\circ$",
        "$35^\\circ$",
        "$38^\\circ$"
      ],
      "answer": "②",
      "solution": "<p>$\\mathrm{O}$가 외심이므로 $\\angle\\mathrm{BOC}=2\\angle\\mathrm{A}=2\\times80^\\circ=160^\\circ$이다.<br>$\\mathrm{I}$가 내심이므로 $\\angle\\mathrm{BIC}=90^\\circ+\\frac{1}{2}\\angle\\mathrm{A}=90^\\circ+40^\\circ=130^\\circ$이다.<br>$\\angle\\mathrm{BOC}-\\angle\\mathrm{BIC}=160^\\circ-130^\\circ=30^\\circ$</p>"
    },
    {
      "id": 19,
      "score": 4.0,
      "question": "<p>오른쪽 그림에서 원 $\\mathrm{I}$는 $\\triangle \\mathrm{ABC}$의 내접원이다. $\\overline{\\mathrm{AD}} = 2\\text{ cm}$, $\\overline{\\mathrm{BD}} = 4\\text{ cm}$, $\\overline{\\mathrm{BC}} = 10\\text{ cm}$일 때, $\\overline{\\mathrm{AC}}$의 길이는?</p><p><img src=\"assets/images/23_금당중_1학기_중간_중2_수학/q19-problem-visual-v2.svg\" alt=\"삼각형 ABC의 내접원 중심은 I이다. 접점은 D, E, F이다. D에서 A까지 2 cm, D에서 B까지 4 cm이고 BC 전체는 10 cm이다.\" style=\"display:block;width:min(100%,520px);height:auto;margin:0 auto;\"></p>",
      "choices": [
        "$8\\text{ cm}$",
        "$8.5\\text{ cm}$",
        "$9\\text{ cm}$",
        "$9.5\\text{ cm}$",
        "$10\\text{ cm}$"
      ],
      "answer": "①",
      "solution": "<p>내접원의 접선의 길이는 한 점에서 그은 두 접선이 같다.<br>$\\overline{\\mathrm{AF}}=\\overline{\\mathrm{AD}}=2\\,\\text{cm}$, $\\overline{\\mathrm{BE}}=\\overline{\\mathrm{BD}}=4\\,\\text{cm}$이다.<br>$\\overline{\\mathrm{CE}}=\\overline{\\mathrm{BC}}-\\overline{\\mathrm{BE}}=10-4=6\\,(\\text{cm})$이고 $\\overline{\\mathrm{CF}}=\\overline{\\mathrm{CE}}=6\\,\\text{cm}$이다.<br>$\\overline{\\mathrm{AC}}=\\overline{\\mathrm{AF}}+\\overline{\\mathrm{CF}}=2+6=8\\,(\\text{cm})$</p>"
    },
    {
      "id": 20,
      "score": 4.0,
      "question": "<p>다음 그림에서 점 $\\mathrm{I}$는 $\\triangle \\mathrm{ABC}$의 내심이다. $\\triangle \\mathrm{ABC}$의 둘레의 길이가 $24\\text{ cm}$, 넓이가 $48\\text{ cm}^2$일 때, 내접원의 반지름 $r$의 길이는?</p><p><img src=\"assets/images/23_금당중_1학기_중간_중2_수학/q20.png\"></p>",
      "choices": [
        "$2\\text{ cm}$",
        "$2.5\\text{ cm}$",
        "$3\\text{ cm}$",
        "$3.5\\text{ cm}$",
        "$4\\text{ cm}$"
      ],
      "answer": "⑤",
      "solution": "<p>내접원의 반지름이 $r$이면 삼각형의 넓이는 $\\frac{1}{2}\\times r\\times(\\text{둘레의 길이})$이다.<br>$48=\\frac{1}{2}\\times r\\times24=12r$이므로 $r=4\\,\\text{cm}$이다.</p>"
    },
    {
      "id": 21,
      "score": 6.0,
      "question": "<p>【서술형 1】 어떤 기약분수를 순환소수로 나타내는데, 동현이는 분모를 잘못 보아서 $0.\\dot{4}\\dot{5}$이라 하였고 재열이는 분자를 잘못 보아서 $0.58\\dot{3}$라고 하였다. 다음 물음에 답하시오.<br>※ 순환소수를 분수로 고칠 때, 반복되는 순환마디를 빼어서 방정식으로 계산하는 방법을 사용하세요 [6점]<br><br>(1) 순환소수 $0.\\dot{4}\\dot{5}$를 기약분수로 나타내시오. [2점]<br><br>(2) 순환소수 $0.58\\dot{3}$를 기약분수로 나타내시오. [2점]<br><br>(3) 처음의 기약분수를 순환소수로 나타내시오. [2점]</p>",
      "choices": [],
      "answer": "(1) $\\frac{5}{11}$\n(2) $\\frac{7}{12}$\n(3) $0.41\\dot{6}$",
      "solution": "<p>(1) $x=0.\\dot{4}\\dot{5}$라 하면 $100x=45.4545\\cdots$이다. $100x-x=45$이므로 $99x=45$, $x=\\frac{45}{99}=\\frac{5}{11}$이다.<br>(2) $x=0.58\\dot{3}$이라 하면 $1000x=583.333\\cdots$, $100x=58.333\\cdots$이다. $1000x-100x=525$이므로 $900x=525$, $x=\\frac{525}{900}=\\frac{7}{12}$이다.<br>(3) 동현이는 분모를 잘못 보았으므로 분자는 맞게 보았다. $\\frac{5}{11}$에서 분자는 $5$이다.<br>재열이는 분자를 잘못 보았으므로 분모는 맞게 보았다. $\\frac{7}{12}$에서 분모는 $12$이다.<br>처음의 기약분수는 $\\frac{5}{12}=0.41666\\cdots=0.41\\dot{6}$이다.</p>"
    },
    {
      "id": 22,
      "score": 6.0,
      "question": "<p>【서술형 2】 아래의 직사각형 $\\mathrm{ABCD}$에서 $\\overline{\\mathrm{AB}} = 5a^3b^2$, $\\overline{\\mathrm{BC}} = 3ab^3$일 때, 선분 $\\mathrm{AB}$와 선분 $\\mathrm{BC}$를 각각 회전축으로 하여 1회전 시켜 생기는 두 입체도형의 부피를 각각 $V_1$, $V_2$라 할 때 물음에 답하시오. [6점]</p><p><img src=\"assets/images/23_금당중_1학기_중간_중2_수학/q22-problem-visual-v2.svg\" alt=\"직사각형에서 A는 왼쪽 위, B는 왼쪽 아래, C는 오른쪽 아래, D는 오른쪽 위에 있다. 네 모서리에 직각 표시가 있다.\" style=\"display:block;width:min(100%,520px);height:auto;margin:0 auto;\"></p><p>(1) 선분 $\\mathrm{AB}$를 회전축으로 하는 입체도형의 부피 $V_1$를 구하시오. [2점]<br><br>(2) 선분 $\\mathrm{BC}$를 회전축으로 하는 입체도형의 부피 $V_2$를 구하시오. [2점]<br><br>(3) $\\frac{V_2}{V_1}$의 값을 구하시오. [2점]</p>",
      "choices": [],
      "answer": "(1) $V_1=45\\pi a^5b^8$\n(2) $V_2=75\\pi a^7b^7$\n(3) $\\frac{5a^2}{3b}$",
      "solution": "<p>(1) 선분 $\\mathrm{AB}$를 축으로 회전시키면 밑면의 반지름이 $\\overline{\\mathrm{BC}}=3ab^3$, 높이가 $\\overline{\\mathrm{AB}}=5a^3b^2$인 원기둥이 된다.<br>$V_1=\\pi\\times(3ab^3)^2\\times5a^3b^2=\\pi\\times9a^2b^6\\times5a^3b^2=45\\pi a^5b^8$<br>(2) 선분 $\\mathrm{BC}$를 축으로 회전시키면 밑면의 반지름이 $\\overline{\\mathrm{AB}}=5a^3b^2$, 높이가 $\\overline{\\mathrm{BC}}=3ab^3$인 원기둥이 된다.<br>$V_2=\\pi\\times(5a^3b^2)^2\\times3ab^3=\\pi\\times25a^6b^4\\times3ab^3=75\\pi a^7b^7$<br>(3) $\\frac{V_2}{V_1}=\\frac{75\\pi a^7b^7}{45\\pi a^5b^8}=\\frac{5a^2}{3b}$</p>"
    },
    {
      "id": 23,
      "score": 2.0,
      "question": "<p>【서술형 3】 다음 직각삼각형 중에서 서로 합동인 것을 찾아 기호로 나타내고, 직각삼각형의 합동 조건을 쓰시오. [2점]</p><p><img src=\"assets/images/23_금당중_1학기_중간_중2_수학/q23-problem-visual-v2.svg\" alt=\"ABC는 A가 직각이며 AB는 4, AC는 7이다. DEF는 E가 직각이며 D의 각은 50도이고 DF는 7이다. GHI는 I가 직각이며 IH는 4, GH는 7이다. JKL은 J가 직각이며 K의 각은 40도이고 KL은 7이다.\" style=\"display:block;width:min(100%,520px);height:auto;margin:0 auto;\"></p>",
      "choices": [],
      "answer": "$\\triangle\\mathrm{DEF}\\equiv\\triangle\\mathrm{LJK}$ (RHA 합동)",
      "solution": "<p>직각삼각형의 합동 조건은 빗변의 길이와 한 예각의 크기가 같을 때(RHA), 또는 빗변의 길이와 다른 한 변의 길이가 같을 때(RHS)이다.<br>$\\triangle\\mathrm{ABC}$는 직각을 낀 두 변이 $4$, $7$이다.<br>$\\triangle\\mathrm{DEF}$는 $\\angle\\mathrm{E}=90^\\circ$이므로 빗변은 $\\overline{\\mathrm{DF}}=7$이고 $\\angle\\mathrm{D}=50^\\circ$, $\\angle\\mathrm{F}=40^\\circ$이다.<br>$\\triangle\\mathrm{GHI}$는 $\\angle\\mathrm{I}=90^\\circ$이므로 빗변은 $\\overline{\\mathrm{GH}}=7$이고 한 변이 $\\overline{\\mathrm{IH}}=4$이다.<br>$\\triangle\\mathrm{JKL}$은 $\\angle\\mathrm{J}=90^\\circ$이므로 빗변은 $\\overline{\\mathrm{KL}}=7$이고 $\\angle\\mathrm{K}=40^\\circ$, $\\angle\\mathrm{L}=50^\\circ$이다.<br>$\\triangle\\mathrm{DEF}$와 $\\triangle\\mathrm{JKL}$은 빗변의 길이가 $7$로 같고 $\\angle\\mathrm{F}=\\angle\\mathrm{K}=40^\\circ$ ($\\angle\\mathrm{D}=\\angle\\mathrm{L}=50^\\circ$)이므로 RHA 합동이다. 대응하는 꼭짓점 순서로 $\\triangle\\mathrm{DEF}\\equiv\\triangle\\mathrm{LJK}$이다.<br>$\\triangle\\mathrm{ABC}$는 빗변이 $\\sqrt{4^2+7^2}$이므로 $7$이 아니라서 $\\triangle\\mathrm{GHI}$와 합동이 아니다.<br>합동 조건: RHA (빗변의 길이와 한 예각의 크기가 각각 같은 두 직각삼각형은 합동이다.)</p>"
    },
    {
      "id": 24,
      "score": 6.0,
      "question": "<p>【서술형 4】 점 $\\mathrm{O}$는 $\\triangle \\mathrm{ABC}$의 외심이고 $\\angle \\mathrm{A} : \\angle \\mathrm{B} : \\angle \\mathrm{C} = 4 : 2 : 3$일 때, 물음에 답하시오. [6점]</p><p><img src=\"assets/images/23_금당중_1학기_중간_중2_수학/q24-problem-visual-v2.svg\" alt=\"외심 O와 세 꼭짓점 A, B, C를 연결했다.\" style=\"display:block;width:min(100%,520px);height:auto;margin:0 auto;\"></p><p>(1) $\\angle \\mathrm{A}, \\angle \\mathrm{B}, \\angle \\mathrm{C}$를 각각 구하시오. [3점]<br><br>(2) $\\angle \\mathrm{OBA} : \\angle \\mathrm{OBC}$를 구하시오. [3점]</p>",
      "choices": [],
      "answer": "(1) $\\angle\\mathrm{A}=80^\\circ,\\ \\angle\\mathrm{B}=40^\\circ,\\ \\angle\\mathrm{C}=60^\\circ$\n(2) $3:1$",
      "solution": "<p>(1) 삼각형의 세 각의 합은 $180^\\circ$이므로 $\\angle\\mathrm{A}=180^\\circ\\times\\frac{4}{9}=80^\\circ$, $\\angle\\mathrm{B}=180^\\circ\\times\\frac{2}{9}=40^\\circ$, $\\angle\\mathrm{C}=180^\\circ\\times\\frac{3}{9}=60^\\circ$이다.<br>(2) $\\mathrm{O}$가 외심이므로 $\\overline{\\mathrm{OA}}=\\overline{\\mathrm{OB}}=\\overline{\\mathrm{OC}}$이다.<br>$\\angle\\mathrm{BOC}=2\\angle\\mathrm{A}=160^\\circ$이고 $\\triangle\\mathrm{OBC}$는 이등변삼각형이므로 $\\angle\\mathrm{OBC}=\\frac{180^\\circ-160^\\circ}{2}=10^\\circ$이다.<br>$\\angle\\mathrm{AOB}=2\\angle\\mathrm{C}=120^\\circ$이고 $\\triangle\\mathrm{OAB}$는 이등변삼각형이므로 $\\angle\\mathrm{OBA}=\\frac{180^\\circ-120^\\circ}{2}=30^\\circ$이다.<br>(확인: $\\angle\\mathrm{OBA}+\\angle\\mathrm{OBC}=30^\\circ+10^\\circ=40^\\circ=\\angle\\mathrm{B}$)<br>$\\angle\\mathrm{OBA}:\\angle\\mathrm{OBC}=30^\\circ:10^\\circ=3:1$</p>"
    }
  ]
};

window.examTitle = window.examData.title;
window.examData.questions =
window.questionBank = [
  {
    "id": 1,
    "score": 3,
    "question": "<p>다음 중 순환소수의 표현으로 옳은 것은?</p>",
    "choices": [
      "$0.11111\\cdots = 0.\\dot{1}\\dot{1}$",
      "$0.070707\\cdots = 0.\\dot{0}\\dot{7}$",
      "$0.404040\\cdots = 0.4\\dot{0}\\dot{4}$",
      "$1.571571571\\cdots = 1.\\dot{5}\\dot{7}$",
      "$0.1253253253\\cdots = 0.\\dot{2}5\\dot{3}$"
    ],
    "answer": "②",
    "solution": "<p>① $0.1111\\cdots=0.\\dot{1}$ (옳지 않다)<br>② $0.070707\\cdots$의 순환마디는 $07$이므로 $0.\\dot{0}\\dot{7}$ (옳다)<br>③ $0.404040\\cdots=0.\\dot{4}\\dot{0}$ (옳지 않다)<br>④ $1.571571\\cdots=1.\\dot{5}7\\dot{1}$ (옳지 않다)<br>⑤ $0.1253253\\cdots=0.1\\dot{2}5\\dot{3}$ (옳지 않다)</p>",
    "content": "<div>다음 중 순환소수의 표현으로 옳은 것은?</div>"
  },
  {
    "id": 2,
    "score": 4,
    "question": "<p>$\\frac{a}{140}$를 약분하면 $\\frac{1}{b}$이 되고, 이것을 소수로 나타내면 유한소수가 된다. 이때 $a-b$의 값은? (단, $25 < a < 30$)</p>",
    "choices": [
      "23",
      "24",
      "25",
      "26",
      "27"
    ],
    "answer": "①",
    "solution": "<p>$25<a<30$인 $a$ 중 $\\frac{a}{140}$을 약분하여 분자가 $1$이 되려면 $a$가 $140$의 약수이어야 한다.<br>$140=2^2\\times5\\times7$의 약수 중 $25$와 $30$ 사이의 수는 $28$이다. $a=28$<br>$\\frac{28}{140}=\\frac{1}{5}$이므로 $b=5$이고 $\\frac{1}{5}=0.2$로 유한소수이다.<br>$a-b=28-5=23$</p>",
    "content": "<div>$\\frac{a}{140}$를 약분하면 $\\frac{1}{b}$이 되고, 이것을 소수로 나타내면 유한소수가 된다. 이때 $a-b$의 값은? (단, $25 < a < 30$)</div>"
  },
  {
    "id": 3,
    "score": 4,
    "question": "<p>다음은 분수 $\\frac{21}{60}$을 유한소수로 나타내는 과정이다. $a+b+c$의 값은?</p><div class=\"box\"><p>$\\frac{21}{60} = \\frac{a}{2^2 \\times 5} = \\frac{a \\times b}{2^2 \\times 5 \\times b} = c$</p></div>",
    "choices": [
      "7",
      "7.35",
      "7.7",
      "12.35",
      "12.7"
    ],
    "answer": "④",
    "solution": "<p>$\\frac{21}{60}$을 약분하면 $\\frac{7}{20}=\\frac{7}{2^2\\times5}$이므로 $a=7$이다.<br>분모를 $10$의 거듭제곱으로 만들기 위해 분모와 분자에 $5$를 곱하면 $\\frac{7\\times5}{2^2\\times5\\times5}=\\frac{35}{100}$이므로 $b=5$이다.<br>$c=0.35$<br>$a+b+c=7+5+0.35=12.35$</p>",
    "content": "<div>다음은 분수 $\\frac{21}{60}$을 유한소수로 나타내는 과정이다. $a+b+c$의 값은?</div><div class=\"box\"><div>$\\frac{21}{60} = \\frac{a}{2^2 \\times 5} = \\frac{a \\times b}{2^2 \\times 5 \\times b} = c$</div></div>"
  },
  {
    "id": 4,
    "score": 4,
    "question": "<p>순환소수를 분수로 나타내는 과정에서 주어진 순환소수를 $x$라 할 때, $1000x - 10x$를 이용하는 것이 가장 편리한 것은?</p>",
    "choices": [
      "$0.\\dot{2}\\dot{7}$",
      "$0.\\dot{2}\\dot{5}$",
      "$6.2\\dot{5}$",
      "$1.\\dot{2}3\\dot{4}$",
      "$4.3\\dot{2}\\dot{4}$"
    ],
    "answer": "⑤",
    "solution": "<p>$1000x-10x$를 쓰려면 소수점 아래에서 순환하지 않는 부분이 $1$자리, 순환마디가 $2$자리이어야 한다. ($1000x$는 순환마디 한 번 뒤, $10x$는 순환마디 시작 직전)<br>① $0.\\dot{2}\\dot{7}$은 $100x-x$를 쓴다.<br>② $0.\\dot{2}\\dot{5}$는 $100x-x$를 쓴다.<br>③ $6.2\\dot{5}$는 $100x-10x$를 쓴다.<br>④ $1.\\dot{2}3\\dot{4}$는 $1000x-x$를 쓴다.<br>⑤ $4.3\\dot{2}\\dot{4}$는 비순환 $1$자리, 순환마디 $2$자리이므로 $1000x-10x$를 쓴다.</p>",
    "content": "<div>순환소수를 분수로 나타내는 과정에서 주어진 순환소수를 $x$라 할 때, $1000x - 10x$를 이용하는 것이 가장 편리한 것은?</div>"
  },
  {
    "id": 5,
    "score": 4,
    "question": "<p>분수 $\\frac{5}{7} = 0.\\dot{7}1428\\dot{5}$ 이다. 소수점 아래 2023번째 자리의 숫자를 $a$, 소수점 아래 2023번째 자리까지의 숫자 중 7이 나오는 횟수를 $b$라 할 때, $a+b$의 값은?</p>",
    "choices": [
      "343",
      "344",
      "345",
      "346",
      "347"
    ],
    "answer": "③",
    "solution": "<p>$\\frac{5}{7}=0.\\dot{7}1428\\dot{5}$의 순환마디는 $714285$ ($6$개)이다.<br>$2023=6\\times337+1$이므로 $2023$번째 숫자는 순환마디의 첫 번째 숫자 $7$이다. $a=7$<br>순환마디 한 번에 $7$이 $1$번 나오고, $337$번의 순환마디에 $7$이 $337$번, 나머지 $1$개($7$)에 $1$번이 있다. $b=337+1=338$<br>$a+b=7+338=345$</p>",
    "content": "<div>분수 $\\frac{5}{7} = 0.\\dot{7}1428\\dot{5}$ 이다. 소수점 아래 2023번째 자리의 숫자를 $a$, 소수점 아래 2023번째 자리까지의 숫자 중 7이 나오는 횟수를 $b$라 할 때, $a+b$의 값은?</div>"
  },
  {
    "id": 6,
    "score": 4,
    "question": "<p>$3^3 = A$라고 할 때, $243^3 = A^\\Box$이다. 이때 $\\Box$ 안에 알맞은 수를 구하면?</p>",
    "choices": [
      "3",
      "4",
      "5",
      "6",
      "7"
    ],
    "answer": "⑤",
    "solution": "<p>$243=3^5$이므로 $243^3=(3^5)^3=3^{15}$이다.<br>$A=3^3$이므로 $A^\\Box=(3^3)^\\Box=3^{3\\times\\Box}$이다.<br>$3\\times\\Box=15$이므로 $\\Box=5$이다.</p>",
    "content": "<div>$3^3 = A$라고 할 때, $243^3 = A^\\Box$이다. 이때 $\\Box$ 안에 알맞은 수를 구하면?</div>"
  },
  {
    "id": 7,
    "score": 4,
    "question": "<p>다음 중 계산 결과가 가장 큰 것은?</p>",
    "choices": [
      "$2^4 \\times 2^3$",
      "$(2^3)^4 \\div 2^5$",
      "$2^2 \\div 2 \\times 2^3$",
      "$2^{12} \\times \\frac{1}{2^3} \\div 2^3$",
      "$2^5 \\times 2 \\div \\frac{1}{2^3}$"
    ],
    "answer": "⑤",
    "solution": "<p>각 식을 $2$의 거듭제곱으로 나타낸다.<br>① $2^4\\times2^3=2^7$<br>② $(2^3)^4\\div2^5=2^{12}\\div2^5=2^7$<br>③ $2^2\\div2\\times2^3=2\\times2^3=2^4$<br>④ $2^{12}\\times\\frac{1}{2^3}\\div2^3=2^{12-3-3}=2^6$<br>⑤ $2^5\\times2\\div\\frac{1}{2^3}=2^6\\times2^3=2^9$<br>가장 큰 것은 $2^9$인 ⑤이다.</p>",
    "content": "<div>다음 중 계산 결과가 가장 큰 것은?</div>"
  },
  {
    "id": 8,
    "score": 4,
    "question": "<p>$2^7 \\times 3 \\times 5^9$을 $a \\times 10^n$ (단, $1 \\le a < 10$, $n$은 자연수)의 꼴로 나타낼 때, 두 수 $a+n$의 값은?</p>",
    "choices": [
      "10.5",
      "11",
      "11.5",
      "14.5",
      "15.5"
    ],
    "answer": "⑤",
    "solution": "<p>$2^7\\times3\\times5^9=3\\times5^2\\times(2^7\\times5^7)=75\\times10^7$이다.<br>$75\\times10^7=7.5\\times10^8$이므로 $a=7.5$, $n=8$이다.<br>$a+n=15.5$</p>",
    "content": "<div>$2^7 \\times 3 \\times 5^9$을 $a \\times 10^n$ (단, $1 \\le a < 10$, $n$은 자연수)의 꼴로 나타낼 때, 두 수 $a+n$의 값은?</div>"
  },
  {
    "id": 9,
    "score": 4,
    "question": "<p>다음 중 옳지 않은 것은?</p>",
    "choices": [
      "$7a^2 \\times (-3b^3) = -21a^2b^3$",
      "$4x^3 \\times (-3xy)^2 = -36x^5y^2$",
      "$35a^5b^2 \\div 5a^3b = 7a^2b$",
      "$(-2x^2y^4)^3 \\div x^5y^{11} = -8xy$",
      "$(4x^3y)^2 \\div \\frac{2xy^2}{3} = 24x^5$"
    ],
    "answer": "②",
    "solution": "<p>① $7a^2\\times(-3b^3)=-21a^2b^3$ (옳다)<br>② $4x^3\\times(-3xy)^2=4x^3\\times9x^2y^2=36x^5y^2$ 이므로 $-36x^5y^2$는 옳지 않다.<br>③ $35a^5b^2\\div5a^3b=7a^2b$ (옳다)<br>④ $(-2x^2y^4)^3\\div x^5y^{11}=-8x^6y^{12}\\div x^5y^{11}=-8xy$ (옳다)<br>⑤ $(4x^3y)^2\\div\\frac{2xy^2}{3}=16x^6y^2\\times\\frac{3}{2xy^2}=24x^5$ (옳다)</p>",
    "content": "<div>다음 중 옳지 않은 것은?</div>"
  },
  {
    "id": 10,
    "score": 5,
    "question": "<p>다음 등식을 만족시키는 세 자연수 $a$, $b$, $c$에 대하여 $a+b+c$의 값은?</p><div class=\"box\"><p>$$16x^7y^6 \\div (-2xy^2)^3 \\div \\frac{1}{4}xy^2 = -\\frac{bx^c}{y^a}$$</p></div>",
    "choices": [
      "13",
      "14",
      "15",
      "16",
      "17"
    ],
    "answer": "①",
    "solution": "<p>$16x^7y^6\\div(-2xy^2)^3\\div\\frac{1}{4}xy^2$를 계산한다.<br>$(-2xy^2)^3=-8x^3y^6$이므로 $16x^7y^6\\div(-8x^3y^6)=-2x^4$이다.<br>$-2x^4\\div\\frac{1}{4}xy^2=-2x^4\\times\\frac{4}{xy^2}=-\\frac{8x^3}{y^2}$<br>$-\\frac{bx^c}{y^a}$와 비교하면 $b=8$, $c=3$, $a=2$이다.<br>$a+b+c=13$</p>",
    "content": "<div>다음 등식을 만족시키는 세 자연수 $a$, $b$, $c$에 대하여 $a+b+c$의 값은?</div><div class=\"box\"><div>$$16x^7y^6 \\div (-2xy^2)^3 \\div \\frac{1}{4}xy^2 = -\\frac{bx^c}{y^a}$$</div></div>"
  },
  {
    "id": 11,
    "score": 4,
    "question": "<p>$\\overline{\\mathrm{AB}} = \\overline{\\mathrm{AC}}$인 이등변삼각형 $\\mathrm{ABC}$에서 $\\angle x = 130^\\circ$일 때, $\\angle x$의 크기는?</p><p><img src=\"assets/images/23_금당중_1학기_중간_중2_수학/q11.png\"></p>",
    "choices": [
      "$50^\\circ$",
      "$60^\\circ$",
      "$65^\\circ$",
      "$70^\\circ$",
      "$80^\\circ$"
    ],
    "answer": "⑤",
    "solution": "<p>$\\angle\\mathrm{C}$의 외각이 $130^\\circ$이므로 $\\angle\\mathrm{ACB}=180^\\circ-130^\\circ=50^\\circ$이다.<br>$\\overline{\\mathrm{AB}}=\\overline{\\mathrm{AC}}$이므로 $\\angle\\mathrm{B}=\\angle\\mathrm{C}=50^\\circ$이다.<br>$\\angle x=\\angle\\mathrm{A}=180^\\circ-50^\\circ-50^\\circ=80^\\circ$</p>",
    "content": "<div>$\\overline{\\mathrm{AB}} = \\overline{\\mathrm{AC}}$인 이등변삼각형 $\\mathrm{ABC}$에서 $\\angle x = 130^\\circ$일 때, $\\angle x$의 크기는?</div><div><img src=\"assets/images/23_금당중_1학기_중간_중2_수학/q11.png\"></div>"
  },
  {
    "id": 12,
    "layoutTag": "fullwidth",
    "score": 4,
    "question": "<p>$\\triangle \\mathrm{ABC}$에서 $\\overline{\\mathrm{AC}} = \\overline{\\mathrm{AE}} = \\overline{\\mathrm{DE}} = \\overline{\\mathrm{DB}}$이고 $\\angle \\mathrm{B} = 25^\\circ$일 때, $\\angle x$의 크기는?</p><p><img src=\"assets/images/23_금당중_1학기_중간_중2_수학/q12-problem-visual-v2.svg\" alt=\"B, D, A는 한 직선 위에 있고 B, E, C도 한 직선 위에 있다. AC, AE, DE, DB는 모두 길이가 같고 B의 각은 25도이다. A에서 AE와 AC 사이 각은 x이다.\" style=\"display:block;width:min(100%,520px);height:auto;margin:0 auto;\"></p>",
    "choices": [
      "$25^\\circ$",
      "$30^\\circ$",
      "$35^\\circ$",
      "$40^\\circ$",
      "$45^\\circ$"
    ],
    "answer": "②",
    "solution": "<p>$\\overline{\\mathrm{DB}}=\\overline{\\mathrm{DE}}$이므로 $\\angle\\mathrm{DEB}=\\angle\\mathrm{B}=25^\\circ$이다.<br>$\\angle\\mathrm{ADE}$는 $\\triangle\\mathrm{DBE}$의 외각이므로 $25^\\circ+25^\\circ=50^\\circ$이다.<br>$\\overline{\\mathrm{DE}}=\\overline{\\mathrm{AE}}$이므로 $\\angle\\mathrm{DAE}=\\angle\\mathrm{ADE}=50^\\circ$이고 $\\angle\\mathrm{AED}=180^\\circ-100^\\circ=80^\\circ$이다.<br>$\\angle\\mathrm{AEC}=180^\\circ-\\angle\\mathrm{DEB}-\\angle\\mathrm{AED}=180^\\circ-25^\\circ-80^\\circ=75^\\circ$이다.<br>$\\overline{\\mathrm{AE}}=\\overline{\\mathrm{AC}}$이므로 $\\angle\\mathrm{ACE}=\\angle\\mathrm{AEC}=75^\\circ$이다.<br>$\\angle x=180^\\circ-75^\\circ-75^\\circ=30^\\circ$</p>",
    "content": "<div>$\\triangle \\mathrm{ABC}$에서 $\\overline{\\mathrm{AC}} = \\overline{\\mathrm{AE}} = \\overline{\\mathrm{DE}} = \\overline{\\mathrm{DB}}$이고 $\\angle \\mathrm{B} = 25^\\circ$일 때, $\\angle x$의 크기는?</div><div><img src=\"assets/images/23_금당중_1학기_중간_중2_수학/q12-problem-visual-v2.svg\" alt=\"B, D, A는 한 직선 위에 있고 B, E, C도 한 직선 위에 있다. AC, AE, DE, DB는 모두 길이가 같고 B의 각은 25도이다. A에서 AE와 AC 사이 각은 x이다.\" style=\"display:block;width:min(100%,520px);height:auto;margin:0 auto;\"></div>"
  },
  {
    "id": 13,
    "layoutTag": "fullwidth",
    "score": 4,
    "question": "<p>다음 그림과 같이 $\\overline{\\mathrm{AB}} = \\overline{\\mathrm{AC}}$인 이등변삼각형 $\\mathrm{ABC}$에서 $\\angle \\mathrm{B}$의 이등분선과 $\\angle \\mathrm{C}$의 외각의 이등분선의 교점을 $\\mathrm{D}$라 하자. $\\angle \\mathrm{A} = 36^\\circ$일 때, $\\angle x$의 크기는?</p><p><img src=\"assets/images/23_금당중_1학기_중간_중2_수학/q13-problem-visual-v2.svg\" alt=\"A각은 36도이다. AB와 AC는 같은 길이이다. B의 이등분선과 C 바깥 각의 이등분선이 D에서 만난다. BDC에서 x를 표시했다.\" style=\"display:block;width:min(100%,520px);height:auto;margin:0 auto;\"></p>",
    "choices": [
      "$14^\\circ$",
      "$15^\\circ$",
      "$18^\\circ$",
      "$20^\\circ$",
      "$22^\\circ$"
    ],
    "answer": "③",
    "solution": "<p>$\\overline{\\mathrm{AB}}=\\overline{\\mathrm{AC}}$이고 $\\angle\\mathrm{A}=36^\\circ$이므로 $\\angle\\mathrm{B}=\\angle\\mathrm{ACB}=72^\\circ$이다.<br>$\\angle\\mathrm{DBC}=\\frac{1}{2}\\times72^\\circ=36^\\circ$이다.<br>$\\angle\\mathrm{C}$의 외각은 $180^\\circ-72^\\circ=108^\\circ$이고 그 이등분선이 $\\angle\\mathrm{DCE}=54^\\circ$이다.<br>$\\angle\\mathrm{DCE}$는 $\\triangle\\mathrm{DBC}$의 외각이므로 $\\angle\\mathrm{DCE}=\\angle\\mathrm{DBC}+\\angle x$이다.<br>$54^\\circ=36^\\circ+\\angle x$이므로 $\\angle x=18^\\circ$이다.</p>",
    "content": "<div>다음 그림과 같이 $\\overline{\\mathrm{AB}} = \\overline{\\mathrm{AC}}$인 이등변삼각형 $\\mathrm{ABC}$에서 $\\angle \\mathrm{B}$의 이등분선과 $\\angle \\mathrm{C}$의 외각의 이등분선의 교점을 $\\mathrm{D}$라 하자. $\\angle \\mathrm{A} = 36^\\circ$일 때, $\\angle x$의 크기는?</div><div><img src=\"assets/images/23_금당중_1학기_중간_중2_수학/q13-problem-visual-v2.svg\" alt=\"A각은 36도이다. AB와 AC는 같은 길이이다. B의 이등분선과 C 바깥 각의 이등분선이 D에서 만난다. BDC에서 x를 표시했다.\" style=\"display:block;width:min(100%,520px);height:auto;margin:0 auto;\"></div>"
  },
  {
    "id": 14,
    "layoutTag": "fullwidth",
    "score": 4,
    "question": "<p>다음 중에서 오른쪽 두 직각삼각형 $\\mathrm{ABC}$와 $\\mathrm{DEF}$가 서로 합동이 되는 조건이 아닌 것은?</p><p><img src=\"assets/images/23_금당중_1학기_중간_중2_수학/q14-problem-visual-v2.svg\" alt=\"왼쪽 삼각형 ABC는 C에서 직각이고 오른쪽 삼각형 DEF는 F에서 직각이다.\" style=\"display:block;width:min(100%,520px);height:auto;margin:0 auto;\"></p>",
    "choices": [
      "$\\angle \\mathrm{A} = \\angle \\mathrm{D}, \\; \\angle \\mathrm{B} = \\angle \\mathrm{E}$",
      "$\\overline{\\mathrm{AB}} = \\overline{\\mathrm{DE}}, \\; \\angle \\mathrm{B} = \\angle \\mathrm{E}$",
      "$\\overline{\\mathrm{AB}} = \\overline{\\mathrm{DE}}, \\; \\overline{\\mathrm{AC}} = \\overline{\\mathrm{DF}}$",
      "$\\overline{\\mathrm{AB}} = \\overline{\\mathrm{DE}}, \\; \\angle \\mathrm{A} = \\angle \\mathrm{D}$",
      "$\\overline{\\mathrm{AB}} = \\overline{\\mathrm{DE}}, \\; \\overline{\\mathrm{BC}} = \\overline{\\mathrm{EF}}$"
    ],
    "answer": "①",
    "solution": "<p>직각삼각형의 합동 조건은 RHA(빗변의 길이와 한 예각의 크기가 같을 때)와 RHS(빗변의 길이와 다른 한 변의 길이가 같을 때)이다.<br>① 두 예각이 같으면 세 각이 같을 뿐 크기가 정해지지 않으므로 합동 조건이 아니다.<br>② $\\overline{\\mathrm{AB}}=\\overline{\\mathrm{DE}}$(빗변), $\\angle\\mathrm{B}=\\angle\\mathrm{E}$이므로 RHA 합동이다.<br>③ 빗변과 다른 한 변이 같으므로 RHS 합동이다.<br>④ 빗변과 한 예각이 같으므로 RHA 합동이다.<br>⑤ 빗변과 다른 한 변이 같으므로 RHS 합동이다.</p>",
    "content": "<div>다음 중에서 오른쪽 두 직각삼각형 $\\mathrm{ABC}$와 $\\mathrm{DEF}$가 서로 합동이 되는 조건이 아닌 것은?</div><div><img src=\"assets/images/23_금당중_1학기_중간_중2_수학/q14-problem-visual-v2.svg\" alt=\"왼쪽 삼각형 ABC는 C에서 직각이고 오른쪽 삼각형 DEF는 F에서 직각이다.\" style=\"display:block;width:min(100%,520px);height:auto;margin:0 auto;\"></div>"
  },
  {
    "id": 15,
    "layoutTag": "fullwidth",
    "score": 4,
    "question": "<p>다음 직각삼각형 $\\mathrm{ABC}$에서 $\\angle \\mathrm{BAD} = 25^\\circ$일 때 $x$의 값은?</p><p><img src=\"assets/images/23_금당중_1학기_중간_중2_수학/q15-problem-visual-v2.svg\" alt=\"A의 BAD각은 25도이다. B는 직각이고 E에서 DE가 AC에 수직이다. AB와 AE에 같은 눈금이 있으며 C의 각에는 x가 적혀 있다.\" style=\"display:block;width:min(100%,520px);height:auto;margin:0 auto;\"></p>",
    "choices": [
      "$35^\\circ$",
      "$36^\\circ$",
      "$38^\\circ$",
      "$40^\\circ$",
      "$45^\\circ$"
    ],
    "answer": "④",
    "solution": "<p>$\\overline{\\mathrm{AB}}=\\overline{\\mathrm{AE}}$이고 $\\mathrm{AD}$는 공통이며 $\\angle\\mathrm{B}=\\angle\\mathrm{AED}=90^\\circ$이므로 $\\triangle\\mathrm{ABD}\\equiv\\triangle\\mathrm{AED}$ (RHS 합동)이다.<br>$\\angle\\mathrm{DAE}=\\angle\\mathrm{BAD}=25^\\circ$이므로 $\\angle\\mathrm{A}=50^\\circ$이다.<br>$\\triangle\\mathrm{ABC}$에서 $x=\\angle\\mathrm{C}=180^\\circ-90^\\circ-50^\\circ=40^\\circ$이다.</p>",
    "content": "<div>다음 직각삼각형 $\\mathrm{ABC}$에서 $\\angle \\mathrm{BAD} = 25^\\circ$일 때 $x$의 값은?</div><div><img src=\"assets/images/23_금당중_1학기_중간_중2_수학/q15-problem-visual-v2.svg\" alt=\"A의 BAD각은 25도이다. B는 직각이고 E에서 DE가 AC에 수직이다. AB와 AE에 같은 눈금이 있으며 C의 각에는 x가 적혀 있다.\" style=\"display:block;width:min(100%,520px);height:auto;margin:0 auto;\"></div>"
  },
  {
    "id": 16,
    "layoutTag": "fullwidth",
    "score": 4,
    "question": "<p>오른쪽 그림에서 점 $\\mathrm{O}$가 $\\triangle \\mathrm{ABC}$의 외심일 때, 다음 중에서 옳은 것을 모두 고르면? (정답 2개)</p><p><img src=\"assets/images/23_금당중_1학기_중간_중2_수학/q16-problem-visual-v2.svg\" alt=\"삼각형 ABC의 외심은 O이다. O를 각 꼭짓점과 연결했다. AB, AC, BC에 내린 수선은 각각 M, L, N에 닿는다.\" style=\"display:block;width:min(100%,520px);height:auto;margin:0 auto;\"></p>",
    "choices": [
      "$\\overline{\\mathrm{OM}} = \\overline{\\mathrm{ON}}$",
      "$\\angle \\mathrm{OCL} = \\angle \\mathrm{OCN}$",
      "$\\triangle \\mathrm{OBN} \\equiv \\triangle \\mathrm{OCN}$",
      "$\\overline{\\mathrm{OA}} = \\overline{\\mathrm{OB}} = \\overline{\\mathrm{OC}}$",
      "$\\overline{\\mathrm{BM}} = \\overline{\\mathrm{BN}}$"
    ],
    "answer": "③, ④",
    "solution": "<p>점 $\\mathrm{O}$는 외심이므로 세 꼭짓점에 이르는 거리가 같고, 각 변의 수직이등분선의 교점이다.<br>① $\\overline{\\mathrm{OM}}=\\overline{\\mathrm{ON}}$은 내심의 성질이므로 외심에서는 항상 성립하지 않는다.<br>② $\\angle\\mathrm{OCL}=\\angle\\mathrm{OCN}$도 내심의 성질이므로 항상 성립하지 않는다.<br>③ $\\triangle\\mathrm{OBN}\\equiv\\triangle\\mathrm{OCN}$: $\\overline{\\mathrm{OB}}=\\overline{\\mathrm{OC}}$, $\\overline{\\mathrm{ON}}$ 공통, $\\angle\\mathrm{ONB}=\\angle\\mathrm{ONC}=90^\\circ$이므로 RHS 합동이다. (옳다)<br>④ $\\overline{\\mathrm{OA}}=\\overline{\\mathrm{OB}}=\\overline{\\mathrm{OC}}$ (옳다)<br>⑤ $\\overline{\\mathrm{BM}}=\\overline{\\mathrm{AM}}$이고 $\\overline{\\mathrm{BN}}=\\overline{\\mathrm{CN}}$이므로 $\\overline{\\mathrm{BM}}=\\overline{\\mathrm{BN}}$은 항상 성립하지 않는다.</p>",
    "content": "<div>오른쪽 그림에서 점 $\\mathrm{O}$가 $\\triangle \\mathrm{ABC}$의 외심일 때, 다음 중에서 옳은 것을 모두 고르면? (정답 2개)</div><div><img src=\"assets/images/23_금당중_1학기_중간_중2_수학/q16-problem-visual-v2.svg\" alt=\"삼각형 ABC의 외심은 O이다. O를 각 꼭짓점과 연결했다. AB, AC, BC에 내린 수선은 각각 M, L, N에 닿는다.\" style=\"display:block;width:min(100%,520px);height:auto;margin:0 auto;\"></div>"
  },
  {
    "id": 17,
    "layoutTag": "fullwidth",
    "score": 4,
    "question": "<p>점 $\\mathrm{O}$는 $\\triangle \\mathrm{ABC}$의 외심이다. $\\angle \\mathrm{BAO} = 24^\\circ$, $\\angle \\mathrm{CAO} = 26^\\circ$일 때, $\\angle \\mathrm{BCO}$의 크기는?</p><p><img src=\"assets/images/23_금당중_1학기_중간_중2_수학/q17-problem-visual-v2.svg\" alt=\"외심 O에 A와 C를 이었다. A에서 BAO각은 24도, CAO각은 26도이다. C에서는 BC와 CO가 이루는 각을 표시했다.\" style=\"display:block;width:min(100%,520px);height:auto;margin:0 auto;\"></p>",
    "choices": [
      "$34^\\circ$",
      "$36^\\circ$",
      "$40^\\circ$",
      "$44^\\circ$",
      "$46^\\circ$"
    ],
    "answer": "③",
    "solution": "<p>$\\mathrm{O}$가 외심이므로 $\\overline{\\mathrm{OA}}=\\overline{\\mathrm{OB}}=\\overline{\\mathrm{OC}}$이다.<br>$\\angle\\mathrm{BAC}=24^\\circ+26^\\circ=50^\\circ$이므로 중심각 $\\angle\\mathrm{BOC}=2\\times50^\\circ=100^\\circ$이다.<br>$\\triangle\\mathrm{OBC}$는 $\\overline{\\mathrm{OB}}=\\overline{\\mathrm{OC}}$인 이등변삼각형이므로 $\\angle\\mathrm{BCO}=\\frac{180^\\circ-100^\\circ}{2}=40^\\circ$이다.</p>",
    "content": "<div>점 $\\mathrm{O}$는 $\\triangle \\mathrm{ABC}$의 외심이다. $\\angle \\mathrm{BAO} = 24^\\circ$, $\\angle \\mathrm{CAO} = 26^\\circ$일 때, $\\angle \\mathrm{BCO}$의 크기는?</div><div><img src=\"assets/images/23_금당중_1학기_중간_중2_수학/q17-problem-visual-v2.svg\" alt=\"외심 O에 A와 C를 이었다. A에서 BAO각은 24도, CAO각은 26도이다. C에서는 BC와 CO가 이루는 각을 표시했다.\" style=\"display:block;width:min(100%,520px);height:auto;margin:0 auto;\"></div>"
  },
  {
    "id": 18,
    "layoutTag": "fullwidth",
    "score": 4,
    "question": "<p>점 $\\mathrm{O}$, $\\mathrm{I}$는 각각 $\\triangle \\mathrm{ABC}$의 외심, 내심이다. $\\angle \\mathrm{A} = 80^\\circ$일 때, $\\angle \\mathrm{BOC} - \\angle \\mathrm{BIC}$는?</p><p><img src=\"assets/images/23_금당중_1학기_중간_중2_수학/q18-problem-visual-v2.svg\" alt=\"삼각형의 꼭짓각은 80도이다. 밑변 끝 B와 C에서 외심 O로 잇는 선과 내심 I로 잇는 선을 각각 그렸다.\" style=\"display:block;width:min(100%,520px);height:auto;margin:0 auto;\"></p>",
    "choices": [
      "$28^\\circ$",
      "$30^\\circ$",
      "$32^\\circ$",
      "$35^\\circ$",
      "$38^\\circ$"
    ],
    "answer": "②",
    "solution": "<p>$\\mathrm{O}$가 외심이므로 $\\angle\\mathrm{BOC}=2\\angle\\mathrm{A}=2\\times80^\\circ=160^\\circ$이다.<br>$\\mathrm{I}$가 내심이므로 $\\angle\\mathrm{BIC}=90^\\circ+\\frac{1}{2}\\angle\\mathrm{A}=90^\\circ+40^\\circ=130^\\circ$이다.<br>$\\angle\\mathrm{BOC}-\\angle\\mathrm{BIC}=160^\\circ-130^\\circ=30^\\circ$</p>",
    "content": "<div>점 $\\mathrm{O}$, $\\mathrm{I}$는 각각 $\\triangle \\mathrm{ABC}$의 외심, 내심이다. $\\angle \\mathrm{A} = 80^\\circ$일 때, $\\angle \\mathrm{BOC} - \\angle \\mathrm{BIC}$는?</div><div><img src=\"assets/images/23_금당중_1학기_중간_중2_수학/q18-problem-visual-v2.svg\" alt=\"삼각형의 꼭짓각은 80도이다. 밑변 끝 B와 C에서 외심 O로 잇는 선과 내심 I로 잇는 선을 각각 그렸다.\" style=\"display:block;width:min(100%,520px);height:auto;margin:0 auto;\"></div>"
  },
  {
    "id": 19,
    "layoutTag": "fullwidth",
    "score": 4,
    "question": "<p>오른쪽 그림에서 원 $\\mathrm{I}$는 $\\triangle \\mathrm{ABC}$의 내접원이다. $\\overline{\\mathrm{AD}} = 2\\text{ cm}$, $\\overline{\\mathrm{BD}} = 4\\text{ cm}$, $\\overline{\\mathrm{BC}} = 10\\text{ cm}$일 때, $\\overline{\\mathrm{AC}}$의 길이는?</p><p><img src=\"assets/images/23_금당중_1학기_중간_중2_수학/q19-problem-visual-v2.svg\" alt=\"삼각형 ABC의 내접원 중심은 I이다. 접점은 D, E, F이다. D에서 A까지 2 cm, D에서 B까지 4 cm이고 BC 전체는 10 cm이다.\" style=\"display:block;width:min(100%,520px);height:auto;margin:0 auto;\"></p>",
    "choices": [
      "$8\\text{ cm}$",
      "$8.5\\text{ cm}$",
      "$9\\text{ cm}$",
      "$9.5\\text{ cm}$",
      "$10\\text{ cm}$"
    ],
    "answer": "①",
    "solution": "<p>내접원의 접선의 길이는 한 점에서 그은 두 접선이 같다.<br>$\\overline{\\mathrm{AF}}=\\overline{\\mathrm{AD}}=2\\,\\text{cm}$, $\\overline{\\mathrm{BE}}=\\overline{\\mathrm{BD}}=4\\,\\text{cm}$이다.<br>$\\overline{\\mathrm{CE}}=\\overline{\\mathrm{BC}}-\\overline{\\mathrm{BE}}=10-4=6\\,(\\text{cm})$이고 $\\overline{\\mathrm{CF}}=\\overline{\\mathrm{CE}}=6\\,\\text{cm}$이다.<br>$\\overline{\\mathrm{AC}}=\\overline{\\mathrm{AF}}+\\overline{\\mathrm{CF}}=2+6=8\\,(\\text{cm})$</p>",
    "content": "<div>오른쪽 그림에서 원 $\\mathrm{I}$는 $\\triangle \\mathrm{ABC}$의 내접원이다. $\\overline{\\mathrm{AD}} = 2\\text{ cm}$, $\\overline{\\mathrm{BD}} = 4\\text{ cm}$, $\\overline{\\mathrm{BC}} = 10\\text{ cm}$일 때, $\\overline{\\mathrm{AC}}$의 길이는?</div><div><img src=\"assets/images/23_금당중_1학기_중간_중2_수학/q19-problem-visual-v2.svg\" alt=\"삼각형 ABC의 내접원 중심은 I이다. 접점은 D, E, F이다. D에서 A까지 2 cm, D에서 B까지 4 cm이고 BC 전체는 10 cm이다.\" style=\"display:block;width:min(100%,520px);height:auto;margin:0 auto;\"></div>"
  },
  {
    "id": 20,
    "score": 4,
    "question": "<p>다음 그림에서 점 $\\mathrm{I}$는 $\\triangle \\mathrm{ABC}$의 내심이다. $\\triangle \\mathrm{ABC}$의 둘레의 길이가 $24\\text{ cm}$, 넓이가 $48\\text{ cm}^2$일 때, 내접원의 반지름 $r$의 길이는?</p><p><img src=\"assets/images/23_금당중_1학기_중간_중2_수학/q20.png\"></p>",
    "choices": [
      "$2\\text{ cm}$",
      "$2.5\\text{ cm}$",
      "$3\\text{ cm}$",
      "$3.5\\text{ cm}$",
      "$4\\text{ cm}$"
    ],
    "answer": "⑤",
    "solution": "<p>내접원의 반지름이 $r$이면 삼각형의 넓이는 $\\frac{1}{2}\\times r\\times(\\text{둘레의 길이})$이다.<br>$48=\\frac{1}{2}\\times r\\times24=12r$이므로 $r=4\\,\\text{cm}$이다.</p>",
    "content": "<div>다음 그림에서 점 $\\mathrm{I}$는 $\\triangle \\mathrm{ABC}$의 내심이다. $\\triangle \\mathrm{ABC}$의 둘레의 길이가 $24\\text{ cm}$, 넓이가 $48\\text{ cm}^2$일 때, 내접원의 반지름 $r$의 길이는?</div><div><img src=\"assets/images/23_금당중_1학기_중간_중2_수학/q20.png\"></div>"
  },
  {
    "id": 21,
    "score": 6,
    "question": "<p>【서술형 1】 어떤 기약분수를 순환소수로 나타내는데, 동현이는 분모를 잘못 보아서 $0.\\dot{4}\\dot{5}$이라 하였고 재열이는 분자를 잘못 보아서 $0.58\\dot{3}$라고 하였다. 다음 물음에 답하시오.<br>※ 순환소수를 분수로 고칠 때, 반복되는 순환마디를 빼어서 방정식으로 계산하는 방법을 사용하세요 [6점]<br><br>(1) 순환소수 $0.\\dot{4}\\dot{5}$를 기약분수로 나타내시오. [2점]<br><br>(2) 순환소수 $0.58\\dot{3}$를 기약분수로 나타내시오. [2점]<br><br>(3) 처음의 기약분수를 순환소수로 나타내시오. [2점]</p>",
    "choices": [],
    "answer": "(1) $\\frac{5}{11}$\n(2) $\\frac{7}{12}$\n(3) $0.41\\dot{6}$",
    "solution": "<p>(1) $x=0.\\dot{4}\\dot{5}$라 하면 $100x=45.4545\\cdots$이다. $100x-x=45$이므로 $99x=45$, $x=\\frac{45}{99}=\\frac{5}{11}$이다.<br>(2) $x=0.58\\dot{3}$이라 하면 $1000x=583.333\\cdots$, $100x=58.333\\cdots$이다. $1000x-100x=525$이므로 $900x=525$, $x=\\frac{525}{900}=\\frac{7}{12}$이다.<br>(3) 동현이는 분모를 잘못 보았으므로 분자는 맞게 보았다. $\\frac{5}{11}$에서 분자는 $5$이다.<br>재열이는 분자를 잘못 보았으므로 분모는 맞게 보았다. $\\frac{7}{12}$에서 분모는 $12$이다.<br>처음의 기약분수는 $\\frac{5}{12}=0.41666\\cdots=0.41\\dot{6}$이다.</p>",
    "content": "<div>【서술형 1】 어떤 기약분수를 순환소수로 나타내는데, 동현이는 분모를 잘못 보아서 $0.\\dot{4}\\dot{5}$이라 하였고 재열이는 분자를 잘못 보아서 $0.58\\dot{3}$라고 하였다. 다음 물음에 답하시오.<br>※ 순환소수를 분수로 고칠 때, 반복되는 순환마디를 빼어서 방정식으로 계산하는 방법을 사용하세요 [6점]<br><br>(1) 순환소수 $0.\\dot{4}\\dot{5}$를 기약분수로 나타내시오. [2점]<br><br>(2) 순환소수 $0.58\\dot{3}$를 기약분수로 나타내시오. [2점]<br><br>(3) 처음의 기약분수를 순환소수로 나타내시오. [2점]</div>"
  },
  {
    "id": 22,
    "layoutTag": "fullwidth",
    "score": 6,
    "question": "<p>【서술형 2】 아래의 직사각형 $\\mathrm{ABCD}$에서 $\\overline{\\mathrm{AB}} = 5a^3b^2$, $\\overline{\\mathrm{BC}} = 3ab^3$일 때, 선분 $\\mathrm{AB}$와 선분 $\\mathrm{BC}$를 각각 회전축으로 하여 1회전 시켜 생기는 두 입체도형의 부피를 각각 $V_1$, $V_2$라 할 때 물음에 답하시오. [6점]</p><p><img src=\"assets/images/23_금당중_1학기_중간_중2_수학/q22-problem-visual-v2.svg\" alt=\"직사각형에서 A는 왼쪽 위, B는 왼쪽 아래, C는 오른쪽 아래, D는 오른쪽 위에 있다. 네 모서리에 직각 표시가 있다.\" style=\"display:block;width:min(100%,520px);height:auto;margin:0 auto;\"></p><p>(1) 선분 $\\mathrm{AB}$를 회전축으로 하는 입체도형의 부피 $V_1$를 구하시오. [2점]<br><br>(2) 선분 $\\mathrm{BC}$를 회전축으로 하는 입체도형의 부피 $V_2$를 구하시오. [2점]<br><br>(3) $\\frac{V_2}{V_1}$의 값을 구하시오. [2점]</p>",
    "choices": [],
    "answer": "(1) $V_1=45\\pi a^5b^8$\n(2) $V_2=75\\pi a^7b^7$\n(3) $\\frac{5a^2}{3b}$",
    "solution": "<p>(1) 선분 $\\mathrm{AB}$를 축으로 회전시키면 밑면의 반지름이 $\\overline{\\mathrm{BC}}=3ab^3$, 높이가 $\\overline{\\mathrm{AB}}=5a^3b^2$인 원기둥이 된다.<br>$V_1=\\pi\\times(3ab^3)^2\\times5a^3b^2=\\pi\\times9a^2b^6\\times5a^3b^2=45\\pi a^5b^8$<br>(2) 선분 $\\mathrm{BC}$를 축으로 회전시키면 밑면의 반지름이 $\\overline{\\mathrm{AB}}=5a^3b^2$, 높이가 $\\overline{\\mathrm{BC}}=3ab^3$인 원기둥이 된다.<br>$V_2=\\pi\\times(5a^3b^2)^2\\times3ab^3=\\pi\\times25a^6b^4\\times3ab^3=75\\pi a^7b^7$<br>(3) $\\frac{V_2}{V_1}=\\frac{75\\pi a^7b^7}{45\\pi a^5b^8}=\\frac{5a^2}{3b}$</p>",
    "content": "<div>【서술형 2】 아래의 직사각형 $\\mathrm{ABCD}$에서 $\\overline{\\mathrm{AB}} = 5a^3b^2$, $\\overline{\\mathrm{BC}} = 3ab^3$일 때, 선분 $\\mathrm{AB}$와 선분 $\\mathrm{BC}$를 각각 회전축으로 하여 1회전 시켜 생기는 두 입체도형의 부피를 각각 $V_1$, $V_2$라 할 때 물음에 답하시오. [6점]</div><div><img src=\"assets/images/23_금당중_1학기_중간_중2_수학/q22-problem-visual-v2.svg\" alt=\"직사각형에서 A는 왼쪽 위, B는 왼쪽 아래, C는 오른쪽 아래, D는 오른쪽 위에 있다. 네 모서리에 직각 표시가 있다.\" style=\"display:block;width:min(100%,520px);height:auto;margin:0 auto;\"></div><div>(1) 선분 $\\mathrm{AB}$를 회전축으로 하는 입체도형의 부피 $V_1$를 구하시오. [2점]<br><br>(2) 선분 $\\mathrm{BC}$를 회전축으로 하는 입체도형의 부피 $V_2$를 구하시오. [2점]<br><br>(3) $\\frac{V_2}{V_1}$의 값을 구하시오. [2점]</div>"
  },
  {
    "id": 23,
    "layoutTag": "fullwidth",
    "score": 2,
    "question": "<p>【서술형 3】 다음 직각삼각형 중에서 서로 합동인 것을 찾아 기호로 나타내고, 직각삼각형의 합동 조건을 쓰시오. [2점]</p><p><img src=\"assets/images/23_금당중_1학기_중간_중2_수학/q23-problem-visual-v2.svg\" alt=\"ABC는 A가 직각이며 AB는 4, AC는 7이다. DEF는 E가 직각이며 D의 각은 50도이고 DF는 7이다. GHI는 I가 직각이며 IH는 4, GH는 7이다. JKL은 J가 직각이며 K의 각은 40도이고 KL은 7이다.\" style=\"display:block;width:min(100%,520px);height:auto;margin:0 auto;\"></p>",
    "choices": [],
    "answer": "$\\triangle\\mathrm{DEF}\\equiv\\triangle\\mathrm{LJK}$ (RHA 합동)",
    "solution": "<p>직각삼각형의 합동 조건은 빗변의 길이와 한 예각의 크기가 같을 때(RHA), 또는 빗변의 길이와 다른 한 변의 길이가 같을 때(RHS)이다.<br>$\\triangle\\mathrm{ABC}$는 직각을 낀 두 변이 $4$, $7$이다.<br>$\\triangle\\mathrm{DEF}$는 $\\angle\\mathrm{E}=90^\\circ$이므로 빗변은 $\\overline{\\mathrm{DF}}=7$이고 $\\angle\\mathrm{D}=50^\\circ$, $\\angle\\mathrm{F}=40^\\circ$이다.<br>$\\triangle\\mathrm{GHI}$는 $\\angle\\mathrm{I}=90^\\circ$이므로 빗변은 $\\overline{\\mathrm{GH}}=7$이고 한 변이 $\\overline{\\mathrm{IH}}=4$이다.<br>$\\triangle\\mathrm{JKL}$은 $\\angle\\mathrm{J}=90^\\circ$이므로 빗변은 $\\overline{\\mathrm{KL}}=7$이고 $\\angle\\mathrm{K}=40^\\circ$, $\\angle\\mathrm{L}=50^\\circ$이다.<br>$\\triangle\\mathrm{DEF}$와 $\\triangle\\mathrm{JKL}$은 빗변의 길이가 $7$로 같고 $\\angle\\mathrm{F}=\\angle\\mathrm{K}=40^\\circ$ ($\\angle\\mathrm{D}=\\angle\\mathrm{L}=50^\\circ$)이므로 RHA 합동이다. 대응하는 꼭짓점 순서로 $\\triangle\\mathrm{DEF}\\equiv\\triangle\\mathrm{LJK}$이다.<br>$\\triangle\\mathrm{ABC}$는 빗변이 $\\sqrt{4^2+7^2}$이므로 $7$이 아니라서 $\\triangle\\mathrm{GHI}$와 합동이 아니다.<br>합동 조건: RHA (빗변의 길이와 한 예각의 크기가 각각 같은 두 직각삼각형은 합동이다.)</p>",
    "content": "<div>【서술형 3】 다음 직각삼각형 중에서 서로 합동인 것을 찾아 기호로 나타내고, 직각삼각형의 합동 조건을 쓰시오. [2점]</div><div><img src=\"assets/images/23_금당중_1학기_중간_중2_수학/q23-problem-visual-v2.svg\" alt=\"ABC는 A가 직각이며 AB는 4, AC는 7이다. DEF는 E가 직각이며 D의 각은 50도이고 DF는 7이다. GHI는 I가 직각이며 IH는 4, GH는 7이다. JKL은 J가 직각이며 K의 각은 40도이고 KL은 7이다.\" style=\"display:block;width:min(100%,520px);height:auto;margin:0 auto;\"></div>"
  },
  {
    "id": 24,
    "layoutTag": "fullwidth",
    "score": 6,
    "question": "<p>【서술형 4】 점 $\\mathrm{O}$는 $\\triangle \\mathrm{ABC}$의 외심이고 $\\angle \\mathrm{A} : \\angle \\mathrm{B} : \\angle \\mathrm{C} = 4 : 2 : 3$일 때, 물음에 답하시오. [6점]</p><p><img src=\"assets/images/23_금당중_1학기_중간_중2_수학/q24-problem-visual-v2.svg\" alt=\"외심 O와 세 꼭짓점 A, B, C를 연결했다.\" style=\"display:block;width:min(100%,520px);height:auto;margin:0 auto;\"></p><p>(1) $\\angle \\mathrm{A}, \\angle \\mathrm{B}, \\angle \\mathrm{C}$를 각각 구하시오. [3점]<br><br>(2) $\\angle \\mathrm{OBA} : \\angle \\mathrm{OBC}$를 구하시오. [3점]</p>",
    "choices": [],
    "answer": "(1) $\\angle\\mathrm{A}=80^\\circ,\\ \\angle\\mathrm{B}=40^\\circ,\\ \\angle\\mathrm{C}=60^\\circ$\n(2) $3:1$",
    "solution": "<p>(1) 삼각형의 세 각의 합은 $180^\\circ$이므로 $\\angle\\mathrm{A}=180^\\circ\\times\\frac{4}{9}=80^\\circ$, $\\angle\\mathrm{B}=180^\\circ\\times\\frac{2}{9}=40^\\circ$, $\\angle\\mathrm{C}=180^\\circ\\times\\frac{3}{9}=60^\\circ$이다.<br>(2) $\\mathrm{O}$가 외심이므로 $\\overline{\\mathrm{OA}}=\\overline{\\mathrm{OB}}=\\overline{\\mathrm{OC}}$이다.<br>$\\angle\\mathrm{BOC}=2\\angle\\mathrm{A}=160^\\circ$이고 $\\triangle\\mathrm{OBC}$는 이등변삼각형이므로 $\\angle\\mathrm{OBC}=\\frac{180^\\circ-160^\\circ}{2}=10^\\circ$이다.<br>$\\angle\\mathrm{AOB}=2\\angle\\mathrm{C}=120^\\circ$이고 $\\triangle\\mathrm{OAB}$는 이등변삼각형이므로 $\\angle\\mathrm{OBA}=\\frac{180^\\circ-120^\\circ}{2}=30^\\circ$이다.<br>(확인: $\\angle\\mathrm{OBA}+\\angle\\mathrm{OBC}=30^\\circ+10^\\circ=40^\\circ=\\angle\\mathrm{B}$)<br>$\\angle\\mathrm{OBA}:\\angle\\mathrm{OBC}=30^\\circ:10^\\circ=3:1$</p>",
    "content": "<div>【서술형 4】 점 $\\mathrm{O}$는 $\\triangle \\mathrm{ABC}$의 외심이고 $\\angle \\mathrm{A} : \\angle \\mathrm{B} : \\angle \\mathrm{C} = 4 : 2 : 3$일 때, 물음에 답하시오. [6점]</div><div><img src=\"assets/images/23_금당중_1학기_중간_중2_수학/q24-problem-visual-v2.svg\" alt=\"외심 O와 세 꼭짓점 A, B, C를 연결했다.\" style=\"display:block;width:min(100%,520px);height:auto;margin:0 auto;\"></div><div>(1) $\\angle \\mathrm{A}, \\angle \\mathrm{B}, \\angle \\mathrm{C}$를 각각 구하시오. [3점]<br><br>(2) $\\angle \\mathrm{OBA} : \\angle \\mathrm{OBC}$를 구하시오. [3점]</div>"
  }
];
