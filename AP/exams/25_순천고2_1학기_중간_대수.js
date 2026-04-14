window.examTitle = "25_순천고2_1학기_중간_대수";

window.questionBank = [
  {
    id: "1",
    content: "다음 중 옳은 것은? (3.2점)",
    choices: ["4^{\\tf{1}{2}}=\\sqrt{2}", "9^{-\\tf{3}{2}}=27", "2^{-1}=-\\tf{1}{2}", "7^{\\tf{2}{3}}=\\sqrt[3]{49}", "(-3)^{-4}=-\\tf{1}{81}"],
    answer: "④",
    category: "지수법칙과 그 계산",
    solution: "* 1번: $4^{\\tf{1}{2}} = 2 \\neq \\sqrt{2}$\\n* 2번: $9^{-\\tf{3}{2}} = 3^{-3} = \\tf{1}{27} \\neq 27$\\n* 3번: $2^{-1} = \\tf{1}{2} \\neq -\\tf{1}{2}$\\n* 4번: $7^{\\tf{2}{3}} = (7^2)^{\\tf{1}{3}} = \\sqrt[3]{49}$ (참)\\n* 5번: $(-3)^{-4} = \\tf{1}{(-3)^4} = \\tf{1}{81} \\neq -\\tf{1}{81}$"
  },
  {
    id: "2",
    content: "$\\log_6 4 + \\log_6 9$의 값은? (3.2점)",
    choices: ["1", "2", "3", "4", "5"],
    answer: "②",
    category: "로그의 성질",
    solution: "* 로그의 합 성질 적용: $\\log_6 (4 \\times 9) = \\log_6 36$\\n* $\\log_6 6^2 = 2 \\log_6 6 = 2$\\n* 정답: ②"
  },
  {
    id: "3",
    content: "아래 상용로그표에서 $\\log 21$의 값은? (3.3점)\\n[상용로그표: 2.1 행과 0 열의 값은 .3222]",
    choices: ["0.3010", "0.3222", "1.3010", "1.3222", "3.2220"],
    answer: "④",
    category: "상용로그표의 이해",
    solution: "* $\\log 21 = \\log(2.1 \\times 10) = \\log 2.1 + \\log 10$\\n* 표에서 $\\log 2.1 = 0.3222$이므로 $0.3222 + 1 = 1.3222$\\n* 정답: ④"
  },
  {
    id: "4",
    content: "다음 각을 나타내는 동경이 속하는 사분면이 나머지 넷과 다른 하나는? (3.3점)",
    choices: ["135°", "-\\tf{4}{3}\\pi", "510°", "\\tf{29}{6}\\pi", "-855°"],
    answer: "⑤",
    category: "일반각과 사분면",
    solution: "* ① $135^\\circ$ (2사분면)\\n* ② $-240^\\circ = 120^\\circ$ (2사분면)\\n* ③ $510^\\circ = 150^\\circ$ (2사분면)\\n* ④ $\\tf{29}{6}\\pi = 4\\pi + \\tf{5}{6}\\pi = 150^\\circ$ (2사분면)\\n* ⑤ $-855^\\circ = -720^\\circ - 135^\\circ = 225^\\circ$ (3사분면)"
  },
  {
    id: "5",
    content: "함수 $y=2^{x-a}+b$의 그래프가 다음 그림(y절편 2, 점근선 y=-2)과 같을 때, $ab$의 값은? (3.5점)",
    choices: ["4", "2", "1", "-2", "-4"],
    answer: "①",
    category: "지수함수의 그래프와 평행이동",
    solution: "* 점근선 $y=-2$ 이므로 $b=-2$\\n* $y절편 (0, 2)$ 대입: $2 = 2^{-a} - 2 \\implies 2^{-a} = 4 = 2^2 \\implies a = -2$\\n* $ab = (-2) \\times (-2) = 4$\\n* 정답: ① (소스 데이터의 answer '1'은 보기 1번인 '4'를 의미함)"
  },
  {
    id: "6",
    content: "$\\log_{x+3}(-x^2+4x+45)$의 값이 존재하기 위한 모든 정수 $x$값의 합은? (3.6점)",
    choices: ["29", "34", "35", "44", "45"],
    answer: "③",
    category: "로그의 정의 조건",
    solution: "* 밑 조건: $x+3 > 0, x+3 \\neq 1 \\implies x > -3, x \\neq -2$\\n* 진수 조건: $-(x-9)(x+5) > 0 \\implies -5 < x < 9$\\n* 공통 범위: $-3 < x < 9$ 단, $x \\neq -2$\\n* 정수 합: $(-1) + 0 + 1 + 2 + 3 + 4 + 5 + 6 + 7 + 8 = 35$"
  },
  {
    id: "7",
    content: "부등식 $\\log_{\\tf{1}{3}}(-x+2)>1$의 해는? (3.7점)",
    choices: ["x>\\tf{1}{3}", "x>\\tf{5}{3}", "-\\tf{1}{3}<x<2", "\\tf{1}{3}<x<\\tf{5}{3}", "\\tf{5}{3}<x<2"],
    answer: "⑤",
    category: "로그부등식의 풀이",
    solution: "* 진수 조건: $-x+2 > 0 \\implies x < 2$\\n* 밑이 $1/3$이므로 부등호 반전: $-x+2 < (\\tf{1}{3})^1 \\implies -x < -\\tf{5}{3} \\implies x > \\tf{5}{3}$\\n* 공통 범위: $\\tf{5}{3} < x < 2$"
  },
  {
    id: "8",
    content: "정의역이 $\{x\\,|\\,x\\leq 0\}$인 함수 $y=\\sqrt{3}\\,x$의 그래프 위의 점 $P$에 대해 동경 $OP$가 나타내는 각 $\\theta$에 대하여 $\\sin\\theta$의 값은? (3.7점)",
    choices: ["-\\tf{\\sqrt{3}}{2}", "-\\tf{\\sqrt{2}}{2}", "-\\tf{1}{2}", "\\tf{1}{2}", "\\tf{\\sqrt{3}}{2}"],
    answer: "①",
    category: "삼각함수의 정의",
    solution: "* $x=-1$ 대입 시 $y=-\\sqrt{3}$. 점 $P(-1, -\\sqrt{3})$은 3사분면 점.\\n* 거리 $r = \\sqrt{1+3} = 2$\\n* $\\sin\\theta = y/r = -\\sqrt{3}/2$"
  },
  {
    id: "9",
    content: "함수 $y=\\log_3(x-1)$의 그래프의 특징에 대한 설명으로 옳은 것은? (3.8점)",
    choices: ["점 $(1,\\,0)$을 지난다.", "점근선은 $y=1$이다.", "정의역은 실수 전체의 집합이다.", "$x$값이 증가할수록 $y$값은 감소한다.", "함수 $y=3^x+1$의 그래프를 $y=x$에 대해 대칭이동한 그래프이다."],
    answer: "⑤",
    category: "로그함수의 성질과 역함수",
    solution: "* 역함수 구하기: $x = 3^y + 1 \\implies y = 3^x + 1$과 $y=x$ 대칭 관계 맞음.\\n* 점근선은 $x=1$, 정의역은 $x>1$, 밑이 3이므로 증가함수임."
  },
  {
    id: "10",
    content: "$\\sqrt[3]{9}\\times\\sqrt{3}\\times\\sqrt[3]{9}\\div\\sqrt[3]{243}$을 간단히 한 값을 $a$라 할 때, $a$가 $b$의 12제곱근 중 하나이면 $b$의 값은? (4.0점)",
    choices: ["\\sqrt{3}", "3", "9", "27", "9\\sqrt{3}"],
    answer: "③",
    category: "거듭제곱근의 성질과 계산",
    solution: "* $a = 3^{\\tf{2}{3}} \\times 3^{\\tf{1}{2}} \\times 3^{\\tf{2}{3}} \\div 3^{\\tf{5}{3}} = 3^{(\\tf{4+3+4-10}{6})} = 3^{\\tf{1}{6}}$\\n* $a = b^{\\tf{1}{12}} \\implies b = a^{12} = (3^{\\tf{1}{6}})^{12} = 3^2 = 9$"
  },
  {
    id: "11",
    content: "다음 중 옳지 않은 것은? (4.2점)",
    choices: ["$a<0$일 때, $(\\sqrt[3]{-a})^3=-a$", "$n$이 짝수, $a>0$일 때 $x^n=a$ 실근은 2개", "$(-2)^2$의 제곱근은 $\\pm 2$", "$n$이 홀수일 때, $-3$의 $n$제곱근 중 실수는 $-\\sqrt{3}$", "$\\sqrt{729}$의 세제곱근은 3"],
    answer: "④",
    category: "거듭제곱근의 성질",
    solution: "* 4번: $n$이 홀수일 때 $-3$의 $n$제곱근 중 실수는 $\\sqrt[n]{-3} = -\\sqrt[n]{3}$임. $-\\sqrt{3}$은 $n=2$인 경우의 표현이므로 옳지 않음."
  },
  {
    id: "12",
    content: "정의역이 $\{\\tf{1}{4}\\leq x\\leq 8\}$인 함수 $y=|\\log_{\\tf{1}{2}} x|+2$의 최댓값과 최솟값의 합은? (4.3점)",
    choices: ["7", "8", "9", "10", "11"],
    answer: "①",
    category: "로그함수의 최대와 최소",
    solution: "* $y = |-\\log_2 x| + 2 = |\\log_2 x| + 2$\\n* $x=1/4 \\implies y=4$, $x=1 \\implies y=2$(최소), $x=8 \\implies y=5$(최대)\\n* 합: $5 + 2 = 7$"
  },
  {
    id: "13",
    content: "호 $\\overset{\\frown}{AB}=2\\pi$, $\\overset{\\frown}{CD}=\\tf{4}{3}\\pi$이고 색칠한 부분의 넓이가 $5\\pi$일 때, 중심각 $\\angle AOB$의 크기는? (4.3점)",
    choices: ["\\tf{\\pi}{9}", "\\tf{\\pi}{6}", "\\tf{2\\pi}{9}", "\\tf{5\\pi}{18}", "\\tf{\\pi}{3}"],
    answer: "③",
    category: "부채꼴의 호의 길이와 넓이",
    solution: "* $R\\theta = 2\\pi, r\\theta = \\tf{4}{3}\\pi \\implies (R-r)\\theta = \\tf{2}{3}\\pi$\\n* 넓이: $\\tf{1}{2}(R+r)(R-r)\\theta = 5\\pi \\implies \\tf{1}{2}(2\\pi + \\tf{4}{3}\\pi)(R-r) = 5\\pi$\\n* $R-r = 3$ 대입: $3\\theta = \\tf{2}{3}\\pi \\implies \\theta = \\tf{2}{9}\\pi$"
  },
  {
    id: "14",
    content: "$0<\\theta<\\tf{\\pi}{2}$일 때 $\\tan\\theta\\cos^2\\theta$의 최댓값은? (4.3점)",
    choices: ["0", "\\tf{1}{2}", "\\tf{\\sqrt{2}}{2}", "\\tf{\\sqrt{3}}{2}", "1"],
    answer: "②",
    category: "삼각함수의 최대와 최소",
    solution: "* $\\tan\\theta\\cos^2\\theta = \\tf{\\sin\\theta}{\\cos\\theta} \\cdot \\cos^2\\theta = \\sin\\theta\\cos\\theta$\\n* 배각 공식: $\\tf{1}{2}\\sin 2\\theta$\\n* $0 < 2\\theta < \\pi$에서 $\\sin 2\\theta$의 최댓값은 1이므로 전체 최댓값은 $1/2$"
  },
  {
    id: "15",
    content: "$0<a<1$일 때, $y=a^{x^2-2x-1}$의 최댓값이 9이다. $0\\leq x\\leq 3$에서 최솟값 $m$에 대해 $a+m$은? (4.4점)",
    choices: ["\\tf{10}{3}", "\\tf{7}{3}", "\\tf{13}{9}", "\\tf{4}{9}", "\\tf{1}{9}"],
    answer: "④",
    category: "지수함수의 최대와 최소",
    solution: "* 지수 $f(x) = (x-1)^2-2$. $0<a<1$이므로 $f(x)$가 최소일 때 $y$는 최대.\\n* $a^{-2} = 9 \\implies a=1/3$. $x=3$일 때 $f(3)=2$로 최대, 이때 $y$는 최소 $m=(1/3)^2=1/9$\\n* $a+m = 3/9 + 1/9 = 4/9$"
  },
  {
    id: "16",
    content: "지수법칙이 성립하는 밑의 조건에 대한 설명으로 옳지 않은 것은? (4.4점)",
    choices: ["0\\notin A", "\\tf{1}{4}\\in B", "A\\subset B", "-2\\notin B", "-\\sqrt{3}\\in A"],
    answer: "③",
    category: "지수법칙의 정의",
    solution: "* $A$(정수 지수): $a \\neq 0$, $B$(유리수 지수): $a > 0$\\n* $B \\subset A$ 이므로 $A \\subset B$는 거짓임."
  },
  {
    id: "17",
    content: "2000년 매출 100억인 회사가 매년 25%씩 성장할 때, 처음으로 1000억 이상이 되는 해는? (4.5점)",
    choices: ["2008년", "2010년", "2012년", "2014년", "2016년"],
    answer: "②",
    category: "상용로그의 실생활 활용",
    solution: "* $100(1.25)^n \\ge 1000 \\implies (5/4)^n \\ge 10$\\n* $n(\\log 5 - \\log 4) \\ge 1 \\implies n(0.7 - 0.6) \\ge 1 \\implies n \\ge 10$\\n* $2000 + 10 = 2010$년"
  },
  {
    id: "18",
    content: "$x>0$에서 $x^{x^2+6}\\leq x^{9x-8}$인 정수 집합 $A$와 연립지수부등식 $B$의 교집합 원소의 합은? (4.7점)",
    choices: ["20", "21", "24", "27", "28"],
    answer: "②",
    category: "지수부등식의 풀이",
    solution: "* $A$: $x=1$ 또는 $x^2-9x+14 \\le 0 \\implies A=\{1, 2, 3, 4, 5, 6, 7\}$\\n* $B$: $3x-1 \\ge 2x \\implies x \\ge 1$ 및 $1+x/2 \\ge x-2 \\implies x \\le 6$. $B=\{1, 2, 3, 4, 5, 6\}$\\n* $A \\cap B$ 합: $1+2+3+4+5+6 = 21$"
  },
  {
    id: "19",
    content: "$(4^x+4^{-x})-k(2^x+2^{-x})+11=0$이 실근이 없고, 아래 <조건>을 만족하는 자연수 $k$의 합은? (4.8점)\\n<조건> $x^2-2(3^k-1)x+2(3^k+23)\\leq 0$을 만족하는 $x$가 존재한다.",
    choices: ["14", "15", "18", "20", "21"],
    answer: "①",
    category: "지수방정식의 실근 조건",
    solution: "* 실근 없음: $t=2^x+2^{-x} \\ge 2$에서 $t^2-kt+9=0$이 근 없음 $\\implies k < 6$\\n* 조건: 판별식 $D/4 \\ge 0 \\implies (3^k-1)^2 - 2(3^k+23) \\ge 0 \\implies 3^k \\ge 9 \\implies k \\ge 2$\\n* $k = \{2, 3, 4, 5\}$, 합 = 14"
  },
  {
    id: "20",
    content: "절대 등급 $M = m-5(\\log d-1)$일 때, 두 별 A, B에 대하여 $M_B - M_A$의 값은? (4.8점)",
    choices: ["-8", "-4", "4", "8", "12"],
    answer: "③",
    category: "로그의 실생활 활용",
    solution: "* $M_B - M_A = (1-5\\log(3/4)+5) - (2-5\\log(15/2)+5) = -1 + 5\\log(10) = 4$"
  },
  {
    id: "21",
    content: "$\theta$와 $3\theta$가 $y$축 대칭이고 $\\sin\\theta+\\cos\\theta<0$일 때, $\\tan(\\theta+\\tf{7}{12}\\pi)$의 값은? (4점)",
    choices: [],
    answer: "-\\tf{\\sqrt{3}}{3}",
    category: "동경의 위치 관계",
    solution: "* $4\\theta = (2n+1)\\pi \\implies \\theta = 5\\pi/4$ (조건 만족)\\n* $\\tan(15\\pi/12 + 7\\pi/12) = \\tan(11\\pi/6) = -1/\\sqrt{3}$"
  },
  {
    id: "22",
    content: "$\\{a_1, \\dots, a_{12}\\}$에서 $a_i/a_1 \\in S$일 때, $\\sum_{i=2}^{12} \\log_{a_1} a_i$의 값은? (6점)",
    choices: [],
    answer: "77",
    category: "로그의 성질과 집합",
    solution: "* 원소 구조: $a_k = a_1^k \\implies \\sum_{k=2}^{12} k = 2+3+\\dots+12 = 77$"
  },
  {
    id: "23",
    content: "$a^m=b^n, a^6b=a^m$을 만족하는 자연수 순서쌍 $(m, n)$의 개수는? (4점)",
    choices: [],
    answer: "4",
    category: "지수법칙과 부정방정식",
    solution: "* $b = a^{m-6} \\implies a^m = a^{n(m-6)} \\implies m = n(m-6)$\\n* $m = 6 + 6/(n-1) \\implies n-1$은 6의 약수. $n=\{2, 3, 4, 7\}$로 4개."
  },
  {
    id: "24",
    content: "$y=a^{x-2}, y=\\log_a(x-2)$와 $y=-x+6$의 교점 $A, B$에 대해 $AB:AC=2:3$일 때 $a$의 값은? (6점)",
    choices: [],
    answer: "3",
    category: "지수·로그함수의 역함수 관계",
    solution: "* 평행이동 전 $y=a^x, y=\\log_a x$의 교점 $A'(p, q)$에서 $p+q=4$\\n* 비례식 $3(q-p) = 2(p+2) \\implies p=1, q=3$. $3 = a^1 \\implies a=3$"
  }
];

