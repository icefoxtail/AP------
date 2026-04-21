window.examTitle = "23_충무고_1학기_중간_고1_기출";
window.questionBank = [
  {
    "id": 1,
    "level": "하",
    "content": "이차함수 $y = -x^2 - 4x + 5$의 최댓값을 $M$, 이차함수 $y = x^2 - 8x + 6$의 최솟값을 $m$이라 할 때, $M + m$의 값은?",
    "choices": [
      "-2",
      "-1",
      "0",
      "1",
      "2"
    ],
    "answer": "②",
    "category": "이차함수의 최대와 최소",
    "originalCategory": "이차함수의 최대와 최소",
    "standardCourse": "수학(상)",
    "standardUnitKey": "H15-SA-13",
    "standardUnit": "이차함수",
    "standardUnitOrder": 13,
    "solution": "$y = -(x+2)^2 + 9 \\rightarrow M = 9$\n$y = (x-4)^2 - 10 \\rightarrow m = -10$\n$\\therefore M + m = 9 + (-10) = -1$"
  },
  {
    "id": 2,
    "level": "하",
    "content": "이차함수 $y = x^2 + ax + b$의 그래프와 $x$축이 만나는 점의 $x$좌표가 $-1, 3$일 때, 두 상수 $a, b$에 대하여 $a+b$의 값은?",
    "choices": [
      "3",
      "1",
      "-1",
      "-3",
      "-5"
    ],
    "answer": "⑤",
    "category": "이차방정식과 이차함수의 관계",
    "originalCategory": "이차방정식과 이차함수의 관계",
    "standardCourse": "수학(상)",
    "standardUnitKey": "H15-SA-05",
    "standardUnit": "이차방정식",
    "standardUnitOrder": 5,
    "solution": "$x$축과 만나는 교점의 $x$좌표가 근이므로\n$y = (x+1)(x-3) = x^2 - 2x - 3$\n따라서 $a = -2, b = -3$\n$\\therefore a+b = -5$"
  },
  {
    "id": 3,
    "level": "하",
    "content": "$x$에 대한 이차방정식 $x^2 - 2(k+3)x + k^2 + 21 = 0$이 서로 다른 두 허근을 갖도록 하는 모든 자연수 $k$의 개수는?",
    "choices": [
      "1",
      "2",
      "3",
      "4",
      "5"
    ],
    "answer": "①",
    "category": "이차방정식의 판별식",
    "originalCategory": "이차방정식의 판별식",
    "standardCourse": "수학(상)",
    "standardUnitKey": "H15-SA-05",
    "standardUnit": "이차방정식",
    "standardUnitOrder": 5,
    "solution": "판별식 $D/4 = (k+3)^2 - (k^2+21) < 0$\n$k^2 + 6k + 9 - k^2 - 21 < 0$\n$6k - 12 < 0 \\rightarrow k < 2$\n이를 만족하는 자연수 $k$는 $1$뿐이므로 1개이다."
  },
  {
    "id": 4,
    "level": "중",
    "content": "다항식 $2x^3 - 3x^2 - 12x - 7$을 인수분해하면 $(x+a)^2(bx+c)$일 때, $a+b+c$의 값은?<br>(단, $a, b, c$는 상수이다.)",
    "choices": [
      "-6",
      "-5",
      "-4",
      "-3",
      "-2"
    ],
    "answer": "③",
    "category": "인수분해",
    "originalCategory": "인수분해",
    "standardCourse": "수학(상)",
    "standardUnitKey": "H15-SA-03",
    "standardUnit": "인수분해",
    "standardUnitOrder": 3,
    "solution": "$P(x) = 2x^3 - 3x^2 - 12x - 7$이라 하면\n$P(-1) = -2 - 3 + 12 - 7 = 0$\n조립제법을 이용해 인수분해하면\n$P(x) = (x+1)(2x^2 - 5x - 7) = (x+1)^2(2x-7)$\n따라서 $a=1, b=2, c=-7$\n$\\therefore a+b+c = 1 + 2 - 7 = -4$"
  },
  {
    "id": 5,
    "level": "중",
    "content": "$x - y = 4, x^2 + y^2 = 14$일 때, $x^3 - y^3$의 값은?",
    "choices": [
      "52",
      "56",
      "60",
      "64",
      "68"
    ],
    "answer": "①",
    "category": "곱셈공식",
    "originalCategory": "곱셈공식",
    "standardCourse": "수학(상)",
    "standardUnitKey": "H15-SA-01",
    "standardUnit": "다항식의 연산",
    "standardUnitOrder": 1,
    "solution": "$(x-y)^2 = x^2 - 2xy + y^2$\n$16 = 14 - 2xy \\rightarrow xy = -1$\n$x^3 - y^3 = (x-y)^3 + 3xy(x-y) = 4^3 + 3(-1)(4) = 64 - 12 = 52$"
  },
  {
    "id": 6,
    "level": "중",
    "content": "모든 실수 $x$에 대하여<br>$(x^2 + 2x - 3)^3 = a_6x^6 + a_5x^5 + a_4x^4 + \\cdots + a_1x + a_0$이 성립할 때, $a_0 + a_2 + a_4 + a_6$의 값은?",
    "choices": [
      "32",
      "16",
      "0",
      "-16",
      "-32"
    ],
    "answer": "⑤",
    "category": "항등식",
    "originalCategory": "항등식",
    "standardCourse": "수학(상)",
    "standardUnitKey": "H15-SA-02",
    "standardUnit": "항등식과 나머지정리",
    "standardUnitOrder": 2,
    "solution": "주어진 항등식에 $x=1$ 대입:\n$0 = a_6 + a_5 + a_4 + a_3 + a_2 + a_1 + a_0$\n$x=-1$ 대입:\n$-64 = a_6 - a_5 + a_4 - a_3 + a_2 - a_1 + a_0$\n두 식을 더하면:\n$-64 = 2(a_6 + a_4 + a_2 + a_0)$\n$\\therefore a_0 + a_2 + a_4 + a_6 = -32$"
  },
  {
    "id": 7,
    "level": "중",
    "content": "다항식 $(x^2 + x + 1)(x + a)(x + b)$의 전개식에서 $x^3$의 계수가 5이고, $x^2$의 계수가 12일 때, $a^3 + b^3$의 값은? (단, $a, b$는 상수)",
    "choices": [
      "-20",
      "-5",
      "5",
      "20",
      "35"
    ],
    "answer": "①",
    "category": "다항식의 연산",
    "originalCategory": "다항식의 연산",
    "standardCourse": "수학(상)",
    "standardUnitKey": "H15-SA-01",
    "standardUnit": "다항식의 연산",
    "standardUnitOrder": 1,
    "solution": "$(x^2 + x + 1)\\{x^2 + (a+b)x + ab\\}$를 전개한다.\n$x^3$의 계수: $(a+b) + 1 = 5 \\rightarrow a+b = 4$\n$x^2$의 계수: $ab + (a+b) + 1 = 12 \\rightarrow ab + 4 + 1 = 12 \\rightarrow ab = 7$\n$a^3 + b^3 = (a+b)^3 - 3ab(a+b) = 64 - 3(7)(4) = 64 - 84 = -20$"
  },
  {
    "id": 8,
    "level": "중",
    "content": "다항식 $f(x)$를 $x-1$로 나누었을 때의 나머지를 $3$이고, $(x-2)^2$으로 나누었을 때의 나머지는 $2x - 5$이다. $f(x)$를 $(x-1)(x-2)^2$로 나누었을 때의 나머지를 $R(x)$라 하면 $R(1)$의 값은?",
    "choices": [
      "1",
      "2",
      "3",
      "4",
      "5"
    ],
    "answer": "③",
    "category": "나머지정리",
    "originalCategory": "나머지정리",
    "standardCourse": "수학(상)",
    "standardUnitKey": "H15-SA-02",
    "standardUnit": "항등식과 나머지정리",
    "standardUnitOrder": 2,
    "solution": "$f(x) = Q(x)(x-1)(x-2)^2 + R(x)$\n이때 $R(x)$는 $(x-2)^2$로 나누었을 때 나머지가 $2x-5$이므로,\n$R(x) = a(x-2)^2 + 2x - 5$라 둘 수 있다.\n조건에서 $f(1) = 3$이므로 $R(1) = 3$이다.\n(문제에서 $R(1)$을 직접 물었으므로 식을 완성할 필요 없이 바로 $3$임을 알 수 있다.)"
  },
  {
    "id": 9,
    "level": "중",
    "content": "다음 중 $a^2 + b^2 + 3c^2 - 2ab - 4bc + 4ca$의 인수인 것은?",
    "choices": [
      "a+b+2c",
      "a-b+2c",
      "a-b-2c",
      "a-b+3c",
      "a+b+3c"
    ],
    "answer": "④",
    "category": "인수분해",
    "originalCategory": "인수분해",
    "standardCourse": "수학(상)",
    "standardUnitKey": "H15-SA-03",
    "standardUnit": "인수분해",
    "standardUnitOrder": 3,
    "solution": "$a^2 + b^2 + 3c^2 - 2ab - 4bc + 4ca$\n$= (a^2 + b^2 + 4c^2 - 2ab - 4bc + 4ca) - c^2$\n$= (a - b + 2c)^2 - c^2$\n합차 공식을 이용하면\n$= (a - b + 2c + c)(a - b + 2c - c)$\n$= (a - b + 3c)(a - b + c)$\n따라서 인수는 $a - b + 3c$ 이다."
  },
  {
    "id": 10,
    "level": "중",
    "content": "이차방정식 $0=x^2-(2ak+b)x+k^2+2ck+9$가 실수 $k$값에 관계없이 중근을 가질 때, $a+b+c$의 값은?(단, $a, b, c$는 양의 실수)",
    "choices": [
      "10",
      "11",
      "12",
      "13",
      "14"
    ],
    "answer": "①",
    "category": "이차방정식의 판별식",
    "originalCategory": "이차방정식의 판별식",
    "standardCourse": "수학(상)",
    "standardUnitKey": "H15-SA-05",
    "standardUnit": "이차방정식",
    "standardUnitOrder": 5,
    "solution": "판별식 $D = (2ak+b)^2 - 4(k^2 + 2ck + 9) = 0$\n$4a^2k^2 + 4abk + b^2 - 4k^2 - 8ck - 36 = 0$\n$(4a^2 - 4)k^2 + (4ab - 8c)k + (b^2 - 36) = 0$\n$k$에 대한 항등식이므로\n$4a^2 - 4 = 0 \\rightarrow a^2 = 1 \\rightarrow a = 1$ ($a>0$)\n$b^2 - 36 = 0 \\rightarrow b^2 = 36 \\rightarrow b = 6$ ($b>0$)\n$4ab - 8c = 0 \\rightarrow 24 - 8c = 0 \\rightarrow c = 3$\n$\\therefore a+b+c = 1+6+3 = 10$"
  },
  {
    "id": 11,
    "level": "중",
    "content": "복소수 $z = \\frac{1-i}{1+i}$에 대하여 $f(n) = z^n$이라 할 때, $f(1) + f(2) + f(3) + \\cdots + f(n) = -i$인 100이하의 자연수 $n$의 개수는? (단, $i = \\sqrt{-1}$)",
    "choices": [
      "21",
      "22",
      "23",
      "24",
      "25"
    ],
    "answer": "⑤",
    "category": "복소수",
    "originalCategory": "복소수",
    "standardCourse": "수학(상)",
    "standardUnitKey": "H15-SA-04",
    "standardUnit": "복소수",
    "standardUnitOrder": 4,
    "solution": "$z = \\frac{1-i}{1+i} = \\frac{(1-i)^2}{2} = -i$\n$f(n) = (-i)^n$\n$n$에 1부터 4까지 대입해보면 $-i, -1, i, 1$이 반복된다.\n합을 차례로 구하면 $S_1 = -i, S_2 = -i-1, S_3 = -1, S_4 = 0$ 이며 주기는 4이다.\n총합이 $-i$가 되려면 $n$은 $4k-3$ 꼴이어야 한다.\n$1 \\le 4k-3 \\le 100 \\rightarrow k \\le \\frac{103}{4} = 25.75$\n따라서 조건을 만족하는 자연수 $k$는 25개이다."
  },
  {
    "id": 12,
    "level": "상",
    "content": "$0$이 아닌 두 실수 $a, b$에 대하여 $\\frac{\\sqrt{a}}{\\sqrt{b}} = -\\sqrt{\\frac{a}{b}}$가 성립할 때, 항상 실근이 존재하는 방정식을 <보기>에서 있는 대로 고른 것은?<br><br><보기><br>ㄱ. $x^2 + ax + b = 0$<br>ㄴ. $ax^2 + x + b = 0$<br>ㄷ. $ax^2 + ax - b = 0$",
    "choices": [
      "ㄱ",
      "ㄴ",
      "ㄱ,ㄴ",
      "ㄱ,ㄷ",
      "ㄱ,ㄴ,ㄷ"
    ],
    "answer": "③",
    "category": "이차방정식의 판별식",
    "originalCategory": "이차방정식의 판별식",
    "standardCourse": "수학(상)",
    "standardUnitKey": "H15-SA-05",
    "standardUnit": "이차방정식",
    "standardUnitOrder": 5,
    "solution": "주어진 조건에서 $a > 0, b < 0$이다.\nㄱ. $D = a^2 - 4b$. $b < 0$이므로 $-4b > 0 \\rightarrow D > 0$ (항상 실근)\nㄴ. $D = 1 - 4ab$. $ab < 0$이므로 $-4ab > 0 \\rightarrow D > 0$ (항상 실근)\nㄷ. $D = a^2 - 4a(-b) = a^2 + 4ab$. $a>0, b<0$이므로 $4ab < 0$이 되어 $D < 0$이 될 수 있다. (예: $a=1, b=-1$)\n$\\therefore$ 항상 실근을 가지는 것은 ㄱ, ㄴ이다."
  },
  {
    "id": 13,
    "level": "중",
    "content": "이차방정식 $2x^2 - 6x + 1 = 0$의 두 근을 $\\alpha, \\beta$라 고 할 때, $\\frac{1}{\\alpha}, \\frac{1}{\\beta}$을 두 근으로 하고 $x^2$의 계수가 $-1$인 이차방정식 $f(x) = 0$이라고 하자. 이 때, 함수 $y = f(x)$의 최댓값은?",
    "choices": [
      "3",
      "4",
      "5",
      "6",
      "7"
    ],
    "answer": "⑤",
    "category": "이차함수의 최대와 최소",
    "originalCategory": "이차함수의 최대와 최소",
    "standardCourse": "수학(상)",
    "standardUnitKey": "H15-SA-13",
    "standardUnit": "이차함수",
    "standardUnitOrder": 13,
    "solution": "근과 계수의 관계에 의해 $\\alpha + \\beta = 3, \\alpha\\beta = 1/2$\n새로운 두 근의 합: $\\frac{1}{\\alpha} + \\frac{1}{\\beta} = \\frac{\\alpha+\\beta}{\\alpha\\beta} = \\frac{3}{1/2} = 6$\n새로운 두 근의 곱: $\\frac{1}{\\alpha} \\times \\frac{1}{\\beta} = \\frac{1}{\\alpha\\beta} = 2$\n$x^2$의 계수가 $-1$이므로 $f(x) = -(x^2 - 6x + 2)$\n$f(x) = -(x-3)^2 + 7$\n$\\therefore$ 최댓값은 7"
  },
  {
    "id": 14,
    "level": "중",
    "content": "모든 실수 $x$에 대하여 부등식<br>$4x^3 - 2x^2 + x + \\frac{1}{2} = a\\left(x - \\frac{1}{2}\\right)^3 + b\\left(x - \\frac{1}{2}\\right)^2 + c\\left(x - \\frac{1}{2}\\right) + d$<br>가 성립할 때, 상수 $a, b, c, d$에 대하여 $ac + b + d$의 값을 구하면?",
    "choices": [
      "11",
      "12",
      "13",
      "14",
      "15"
    ],
    "answer": "③",
    "category": "항등식",
    "originalCategory": "항등식",
    "standardCourse": "수학(상)",
    "standardUnitKey": "H15-SA-02",
    "standardUnit": "항등식과 나머지정리",
    "standardUnitOrder": 2,
    "solution": "$x = 1/2$로 조립제법을 연속으로 적용한다.\n1회 적용: 나머지는 1 $\\rightarrow d = 1$, 몫은 $4x^2 + 1$\n2회 적용: 나머지는 2 $\\rightarrow c = 2$, 몫은 $4x + 2$\n3회 적용: 나머지는 4 $\\rightarrow b = 4$, 몫은 4 $\\rightarrow a = 4$\n$\\therefore ac + b + d = 4(2) + 4 + 1 = 13$"
  },
  {
    "id": 15,
    "level": "상",
    "content": "좌표평면에서 두 이차함수 $y=x^2, y=-\\frac{1}{2}x^2+2x$의 그래프가 $x$축에 수직인 직선과 만나는 두 점을 각각 $A, B$라 하자. 점 $C(k, 0)$에 대하여 삼각형 $ABC$가 정삼각형이 되도록 하는 양수 $k$의 값은 $a+b\\sqrt{3}$이다. $a+b$의 값을 구하면?<br>(단, $a, b$는 유리수이다.)",
    "choices": [
      "11",
      "12",
      "13",
      "14",
      "15"
    ],
    "answer": "②",
    "category": "이차함수의 그래프",
    "originalCategory": "이차함수의 그래프",
    "standardCourse": "수학(상)",
    "standardUnitKey": "H15-SA-13",
    "standardUnit": "이차함수",
    "standardUnitOrder": 13,
    "solution": "$x$축에 수직인 직선을 $x=t$라 하면 $A(t, t^2), B(t, -\\frac{1}{2}t^2+2t)$\n선분 $AB$는 $y$축에 평행하므로 정삼각형을 이루려면 $C(k,0)$에서 $AB$에 내린 수선이 $AB$를 수직이등분해야 한다.\n수선의 방정식은 $y=0$ ($x$축)이므로 선분 $AB$의 중점의 $y$좌표는 0이다.\n$\\frac{t^2 - \\frac{1}{2}t^2 + 2t}{2} = 0 \\rightarrow \\frac{1}{4}t^2 + t = 0 \\rightarrow t=-4$ ($t \\n eq 0$)\n$t=-4$일 때 $A(-4, 16), B(-4, -16)$이므로 한 변의 길이는 32이다.\n정삼각형의 높이는 $\\frac{\\sqrt{3}}{2} \\times 32 = 16\\sqrt{3}$\n$k = t + 16\\sqrt{3} = -4 + 16\\sqrt{3}$ ($k>0$)\n따라서 $a = -4, b = 16 \\rightarrow a+b = 12$"
  },
  {
    "id": 16,
    "level": "상",
    "content": "$0 \\le x \\le 1$에서 이차함수 $f(x) = -(x-a)^2 + b$의 최댓값이 4이다. 두 실수 $a, b$에 대하여 $a+b$의 최솟값을 $k$라 할 때, $8k$를 구하면?",
    "choices": [
      "26",
      "28",
      "30",
      "32",
      "34"
    ],
    "answer": "③",
    "category": "이차함수의 최대와 최소",
    "originalCategory": "이차함수의 최대와 최소",
    "standardCourse": "수학(상)",
    "standardUnitKey": "H15-SA-13",
    "standardUnit": "이차함수",
    "standardUnitOrder": 13,
    "solution": "대칭축이 $x=a$이므로 세 가지 구간으로 나눈다.\n1) $a < 0$: $x=0$에서 최댓값 $f(0) = -a^2+b = 4 \\rightarrow b = a^2+4$\n$a+b = a^2+a+4 = (a+1/2)^2 + 15/4 \\rightarrow$ 최솟값 $15/4$\n2) $0 \\le a \\le 1$: $x=a$에서 최댓값 $f(a) = b = 4$\n$a+b = a+4 \\rightarrow$ 최솟값 4\n3) $a > 1$: $x=1$에서 최댓값 $f(1) = -(1-a)^2+b = 4 \\rightarrow b = a^2-2a+5$\n$a+b = a^2-a+5 \\rightarrow$ 구간에서 하한은 5\n전체 최솟값 $k = 15/4$\n$\\therefore 8k = 8 \\times 15/4 = 30$"
  },
  {
    "id": 17,
    "level": "상",
    "content": "[도형필요] 그림과 같이 삼각형 $ABC$의 내심 $I$를 지나고 선분 $BC$에 평행한 직선이 두 선분 $AB, AC$와 만나는 점을 각각 $D, E$라 하자. $\\overline{AI} = 3$이고 삼각형 $ABC$의 내접원의 반지름의 길이가 1이다. 삼각형 $ABC$의 넓이가 $5\\sqrt{2}$일 때, $\\triangle ADE$의 넓이는 $\\frac{b}{a}\\sqrt{2}$이다. $a+b$의 값을 구하면? (단, $a$와 $b$는 서로소이다.)",
    "choices": [
      "68",
      "69",
      "70",
      "71",
      "72"
    ],
    "answer": "②",
    "category": "도형의 방정식",
    "originalCategory": "도형의 방정식",
    "standardCourse": "공통수학1",
    "standardUnitKey": "H22-A-05",
    "standardUnit": "방정식",
    "standardUnitOrder": 5,
    "solution": "[도형 검토 후 보완 필요]\n내접원 반지름 $r=1, AI=3$이므로 $\\sin(A/2) = 1/3 \\rightarrow \\sin A = 4\\sqrt{2}/9$\n$\\triangle ABC$ 넓이 = $\\frac{1}{2}r(a+b+c) = 5\\sqrt{2} \\rightarrow$ 둘레 $a+b+c = 10\\sqrt{2}$\n$\\frac{1}{2}bc\\sin A = 5\\sqrt{2} \\rightarrow bc = 45/2$\n코사인법칙 $a^2 = (b+c)^2 - 2bc(1+\\cos A)$를 풀면 $a = 3\\sqrt{2}$\n$A$에서 $BC$에 내린 수선의 길이 $h_A = 10/3$\n$DE$가 내심 $I$를 지나며 $BC$와 평행하므로 $\\triangle ADE$의 높이는 $h_A - 1 = 7/3$\n닮음비가 $7/3 : 10/3 = 7:10$이므로 넓이비는 $49:100$\n$\\triangle ADE$ 넓이 = $\\frac{49}{100} \\times 5\\sqrt{2} = \\frac{49}{20}\\sqrt{2}$\n$\\therefore a=20, b=49 \\rightarrow a+b = 69$"
  },
  {
    "id": 18,
    "level": "상",
    "content": "$x$에 대한 이차방정식 $f(x)$가 다음 조건을 만족시킨다.<br>(가) $x^3 + 5x^2 + 5x - 3$를 $f(x)$로 나눈 나머지는 $g(x)$이다.<br>(나) $x^3 + 5x^2 + 5x - 3$를 $g(x)$로 나눈 나머지는 $f(x) - x^2 - 2x$이다.<br>$g(x)$를 $x-2$로 나눈 나머지를 구하면?",
    "choices": [
      "-1",
      "-2",
      "-3",
      "-4",
      "-5"
    ],
    "answer": "⑤",
    "category": "나머지정리",
    "originalCategory": "나머지정리",
    "standardCourse": "수학(상)",
    "standardUnitKey": "H15-SA-02",
    "standardUnit": "항등식과 나머지정리",
    "standardUnitOrder": 2,
    "solution": "$P(x) = x^3 + 5x^2 + 5x - 3$이라 하자. $f(x)$가 이차식이므로 $g(x)$는 일차식 이하이다.\n(나)에서 $g(x)$로 나눈 나머지 $f(x)-x^2-2x$는 상수항이어야 하므로 $c$라 두면\n$f(x) = x^2 + 2x + c$\n$P(x)$를 $x^2+2x+c$로 나누면 몫은 $x+3$이고 나머지는 $g(x) = -(c+1)x - 3(c+1) = -(c+1)(x+3)$\n(나)에서 나머지가 $c$이므로 $P(-3) = c$가 성립한다.\n$P(-3) = -27 + 45 - 15 - 3 = 0 \\rightarrow c = 0$\n따라서 $g(x) = -x - 3$이다.\n$g(x)$를 $x-2$로 나눈 나머지는 $g(2) = -5$"
  },
  {
    "id": 19,
    "level": "중",
    "content": "서술형 1. 등식 $(3x - y) - (x - 2y)i = 4 + 2i$를 만족시키는 두 실수 $x, y$의 합 $x+y$의 값은?",
    "choices": [],
    "answer": "④",
    "category": "복소수",
    "originalCategory": "복소수",
    "standardCourse": "수학(상)",
    "standardUnitKey": "H15-SA-04",
    "standardUnit": "복소수",
    "standardUnitOrder": 4,
    "solution": "복소수 상등 조건에 의해 실수부와 허수부를 비교한다.\n$3x - y = 4$\n$-(x - 2y) = 2 \\rightarrow -x + 2y = 2$\n두 식을 연립하여 풀면\n$x = 2, y = 2$\n$\\therefore x + y = 4$"
  },
  {
    "id": 20,
    "level": "상",
    "content": "서술형 2. 이차방정식 $x^2 + x + 1 = 0$의 두 근 $\\alpha, \\beta$에 대하여 이차함수 $f(x) = x^2 + px + q$가 $f(-\\alpha-1) = -2\\alpha$와 $f(\\beta^2) = -2\\beta$를 만족시킬 때, $f(2)$의 값을 구하면?",
    "choices": [],
    "answer": "13",
    "category": "이차방정식과 이차함수",
    "originalCategory": "이차방정식과 이차함수",
    "standardCourse": "수학(상)",
    "standardUnitKey": "H15-SA-05",
    "standardUnit": "이차방정식",
    "standardUnitOrder": 5,
    "solution": "$x^2+x+1=0$의 두 근이 $\\alpha, \\beta$이므로 $\\alpha+\\beta=-1, \\alpha^2+\\alpha+1=0$에서 $-\\alpha-1 = \\alpha^2 = \\beta$\n또한 $\\beta^2 = \\alpha$이므로 조건식은 $f(\\beta) = -2\\alpha, f(\\alpha) = -2\\beta$로 쓸 수 있다.\n$\\alpha+\\beta=-1$에서 $-2\\alpha = 2\\beta+2$이므로 $f(\\beta) = 2\\beta+2, f(\\alpha) = 2\\alpha+2$\n따라서 $f(x) - 2x - 2 = 0$은 $\\alpha, \\beta$를 두 근으로 갖고 최고차항 계수가 1인 이차방정식이다.\n$f(x) - 2x - 2 = x^2 + x + 1 \\rightarrow f(x) = x^2 + 3x + 3$\n$\\therefore f(2) = 4 + 6 + 3 = 13$"
  },
  {
    "id": 21,
    "level": "상",
    "content": "서술형 3. 세 실수 $a, b, k$에 대하여 $k \\le x \\le k+2$에서 이차함수 $f(x) = x^2 + ax + b$의 최댓값은 $M(k)$, 최솟값은 $m(k)$이다. $M(k) = \\begin{cases} f(k) & (k \\le 0) \\\\ f(k+2) & (k > 0) \\end{cases}$이고 $m(k)$의 최솟값은 4일 때, 곡선 $y = m(k)$와 직선 $y = 4k + t$가 한 점에서만 만나도록 하는 실수 $t$의 값을 구하면?",
    "choices": [],
    "answer": "-4",
    "category": "이차함수의 최대와 최소",
    "originalCategory": "이차함수의 최대와 최소",
    "standardCourse": "수학(상)",
    "standardUnitKey": "H15-SA-13",
    "standardUnit": "이차함수",
    "standardUnitOrder": 13,
    "solution": "대칭축 $x = -a/2$와 구간의 중점 $k+1$의 위치에 따라 최댓값이 결정된다.\n$M(k)$가 $k=0$을 기준으로 바뀌므로 $0+1 = -a/2 \\rightarrow a = -2$\n$f(x) = x^2 - 2x + b = (x-1)^2 + b - 1$\n$m(k)$는 꼭짓점 $x=1$이 구간 내에 있을 때($-1 \\le k \\le 1$) 최솟값 $b-1$을 가진다.\n이 값이 4이므로 $b-1=4 \\rightarrow b=5$\n$k > 1$일 때 $m(k) = f(k) = k^2-2k+5$\n$y=m(k)$와 $y=4k+t$가 한 점에서 만나려면 기울기가 4인 직선이 $k > 1$인 오른쪽 곡선 부분에 접해야 한다.\n$k^2 - 2k + 5 = 4k + t \\rightarrow k^2 - 6k + 5 - t = 0$\n$D/4 = 9 - (5 - t) = 0 \\rightarrow 4 + t = 0$\n$\\therefore t = -4$"
  }
];
