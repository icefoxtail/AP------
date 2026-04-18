window.examTitle = "25_순천여고_1학기_중간_고2_확률과통계";

window.questionBank = [
  {
    "id": 1,
    "level": "중",
    "category": "원순열",
    "originalCategory": "원순열",
    "standardCourse": "확률과 통계",
    "standardUnitKey": "STAT-02",
    "standardUnit": "순열과 조합",
    "standardUnitOrder": 2,
    "content": "아래의 그림과 같이 정사각형을 4등분한 4개의 영역을 서로 다른 4가지 색을 모두 사용하여 칠하는 경우의 수를 구하면? (단, 각 영역에는 한 가지 색만 칠하고, 회전하여 일치하는 것은 같은 것으로 본다.) [3.2점]\n<svg width='100' height='100' viewBox='0 0 100 100' style='display:block; margin: 10px auto;'><rect x='10' y='10' width='80' height='80' fill='none' stroke='black' stroke-width='2'/><line x1='10' y1='50' x2='90' y2='50' stroke='black' stroke-width='2'/><line x1='50' y1='10' x2='50' y2='90' stroke='black' stroke-width='2'/></svg>",
    "choices": [
      "6",
      "10",
      "12",
      "16",
      "24"
    ],
    "answer": "①",
    "solution": "[풀이]\n서로 다른 4가지 색을 정사각형의 4영역에 칠할 때, 회전 대칭성이 존재하므로 원순열을 적용함\n\\rightarrow (4-1)! = 3!\n\\rightarrow 3 \\times 2 \\times 1 = 6\n---\n[결론]\n정답: 1"
  },
  {
    "id": 2,
    "level": "상",
    "category": "원순열",
    "originalCategory": "원순열",
    "standardCourse": "확률과 통계",
    "standardUnitKey": "STAT-02",
    "standardUnit": "순열과 조합",
    "standardUnitOrder": 2,
    "content": "아래 그림과 같이 정삼각형 모양의 탁자에 남자 2명과 여자 4명이 둘러앉을 때, 남자 2명이 탁자의 다른 모서리에 앉는 경우의 수를 구하면? (단, 회전하여 일치하는 것은 같은 것으로 본다.) [3.8점]\n<svg width='200' height='180' viewBox='0 0 200 180' style='display:block; margin: 10px auto;'><polygon points='100,20 20,160 180,160' fill='none' stroke='black' stroke-width='2'/><circle cx='65' cy='82' r='4' fill='black'/><circle cx='48' cy='112' r='4' fill='black'/><circle cx='135' cy='82' r='4' fill='black'/><circle cx='152' cy='112' r='4' fill='black'/><circle cx='80' cy='168' r='4' fill='black'/><circle cx='120' cy='168' r='4' fill='black'/></svg>",
    "choices": [
      "48",
      "60",
      "120",
      "144",
      "192"
    ],
    "answer": "⑤",
    "solution": "[풀이]\n1) 전체 경우의 수: 6명을 정삼각형 탁자에 앉히는 경우 (회전 대칭 3곳 존재)\n\\rightarrow \\frac{6!}{3} = 240\n2) 남자가 같은 모서리에 앉는 경우의 수:\n\\rightarrow (모서리 선택) \\times (남자 2명 배열) \\times (여자 4명 배열) / (회전 중복)\n\\rightarrow \\frac{3 \\times 2! \\times 4!}{3} = 48\n3) 다른 모서리에 앉는 경우의 수:\n\\rightarrow 240 - 48 = 192\n---\n[결론]\n정답: 5"
  },
  {
    "id": 3,
    "level": "하",
    "category": "중복순열",
    "originalCategory": "중복순열",
    "standardCourse": "확률과 통계",
    "standardUnitKey": "STAT-02",
    "standardUnit": "순열과 조합",
    "standardUnitOrder": 2,
    "content": "3명의 학생이 서로 다른 4곳의 여행지 중 하나를 택하는 경우의 수를 구하면? (단, 아무도 고르지 않은 여행지가 있을 수 있다.) [3.4점]",
    "choices": [
      "4",
      "12",
      "64",
      "72",
      "81"
    ],
    "answer": "③",
    "solution": "3명의 학생이 각각 4곳의 여행지 중 하나를 선택할 수 있으므로, 서로 다른 4개에서 중복을 허락하여 3개를 택하는 중복순열의 수이다. ${}_4\\Pi_3 = 4^3 = 64$"
  },
  {
    "id": 4,
    "level": "중",
    "category": "같은 것이 있는 순열",
    "originalCategory": "같은 것이 있는 순열",
    "standardCourse": "확률과 통계",
    "standardUnitKey": "STAT-02",
    "standardUnit": "순열과 조합",
    "standardUnitOrder": 2,
    "content": "suncheon에 있는 8개의 문자를 일렬로 나열하는 경우의 수가 $k \\times 7!$일 때, 상수 $k$의 값은? [3.4점]",
    "choices": [
      "1",
      "2",
      "3",
      "4",
      "5"
    ],
    "answer": "④",
    "solution": "'suncheon'에는 'n'이 2개 있고 나머지 s, u, c, h, e, o는 모두 1개씩 총 8개의 문자가 있다.\n이 문자들을 일렬로 나열하는 경우의 수는 $\\frac{8!}{2!} = 4 \\times 7!$ 이다.\n따라서 $k = 4$ 이다."
  },
  {
    "id": 5,
    "level": "상",
    "category": "중복순열",
    "originalCategory": "중복순열",
    "standardCourse": "확률과 통계",
    "standardUnitKey": "STAT-02",
    "standardUnit": "순열과 조합",
    "standardUnitOrder": 2,
    "content": "3개의 숫자 1, 2, 3에서 중복을 허용하여 4개를 뽑아 일렬로 나열할 때, 짝수끼리 이웃하지 않도록 나열하는 경우의 수를 구하면? [4점]",
    "choices": [
      "60",
      "72",
      "81",
      "104",
      "144"
    ],
    "answer": "①",
    "solution": "짝수는 2뿐이므로 '2'끼리 이웃하지 않는 경우의 수를 구한다.\n전체 경우의 수는 ${}_3\\Pi_4 = 3^4 = 81$ 이다.\n2끼리 이웃하는 경우를 구하여 전체에서 뺀다.\n- 2가 4번 나오는 경우 (2222): 1가지\n- 2가 3번 나오는 경우: 2가 3번이면 무조건 이웃한다. 2가 들어갈 위치 선택 4가지 중 빈 칸에 올 숫자 2가지(1,3) $\\rightarrow 4 \\times 2 = 8$가지 (단, 2222 제외)\n- 2가 2번 나오는 경우: 2가 이웃하는 위치는 (1,2), (2,3), (3,4)의 3가지. 나머지 두 자리에 1,3이 중복 가능하게 오므로 $3 \\times 2^2 = 12$가지\n따라서 짝수(2)끼리 이웃하는 경우의 수는 $1 + 8 + 12 = 21$가지이다.\n구하는 경우의 수는 $81 - 21 = 60$ 이다."
  },
  {
    "id": 6,
    "level": "상",
    "category": "순열",
    "originalCategory": "순열",
    "standardCourse": "확률과 통계",
    "standardUnitKey": "STAT-02",
    "standardUnit": "순열과 조합",
    "standardUnitOrder": 2,
    "content": "목련이는 확통과 독서, 영어를 포함한 7개의 과목을 월요일부터 일요일까지 매일 한 과목씩 공부하려고 한다. 다음 <조건>을 만족하면서 7일 동안 공부하는 과목의 순서를 정하는 경우의 수는? [4.2점]\n<조 건>\n(가) 확통과 독서는 월요일부터 목요일 사이에 공부하려고 한다.\n(나) 확통을 독서보다 먼저 공부하려고 한다.\n(다) 영어는 금요일부터 일요일 사이에 공부하려고 한다.",
    "choices": [
      "120",
      "216",
      "432",
      "864",
      "1024"
    ],
    "answer": "③",
    "solution": "월~목 4일 중 확통, 독서를 포함하여 4과목을 배치하고, 금~일 3일 중 영어를 포함하여 3과목을 배치해야 한다.\n남은 4과목 중 월~목에 들어갈 2과목을 선택하는 경우의 수는 ${}_4C_2 = 6$가지이다.\n월~목(4자리)에 확통, 독서, 선택된 2과목을 배열할 때, 확통은 독서보다 먼저 와야 하므로 같은 것으로 취급하여 배열하면 $\\frac{4!}{2!} = 12$가지이다.\n금~일(3자리)에 영어, 남은 2과목을 배열하는 경우의 수는 $3! = 6$가지이다.\n따라서 총 경우의 수는 $6 \\times 12 \\times 6 = 432$ 이다."
  },
  {
    "id": 7,
    "level": "하",
    "category": "중복조합",
    "originalCategory": "중복조합",
    "standardCourse": "확률과 통계",
    "standardUnitKey": "STAT-02",
    "standardUnit": "순열과 조합",
    "standardUnitOrder": 2,
    "content": "${}_3H_4$의 값은? [3.2점]",
    "choices": [
      "12",
      "15",
      "21",
      "24",
      "35"
    ],
    "answer": "②",
    "solution": "${}_3H_4 = {}_{3+4-1}C_4 = {}_6C_4 = {}_6C_2 = \\frac{6 \\times 5}{2 \\times 1} = 15$ 이다."
  },
  {
    "id": 8,
    "level": "중",
    "category": "중복조합",
    "originalCategory": "중복조합",
    "standardCourse": "확률과 통계",
    "standardUnitKey": "STAT-02",
    "standardUnit": "순열과 조합",
    "standardUnitOrder": 2,
    "content": "2명의 후보자가 출마한 선거에서 7명의 유권자가 한 명의 후보에게 각각 투표할 때, 무기명으로 투표하는 경우의 수를 $a$, 기명으로 투표하는 경우의 수를 $b$라 하자. $b-a$의 값을 구하면? (단, 기권이나 무효인 표는 없다.) [3.6점]",
    "choices": [
      "13",
      "54",
      "107",
      "120",
      "181"
    ],
    "answer": "④",
    "solution": "무기명 투표의 경우의 수 $a$는 서로 다른 2명의 후보 중 중복을 허락하여 7명을 뽑는 중복조합의 수이므로 $a = {}_2H_7 = {}_{2+7-1}C_7 = {}_8C_7 = 8$ 이다.\n기명 투표의 경우의 수 $b$는 7명의 유권자가 각각 2명의 후보 중 한 명을 선택하는 중복순열의 수이므로 $b = {}_2\\Pi_7 = 2^7 = 128$ 이다.\n따라서 $b - a = 128 - 8 = 120$ 이다."
  },
  {
    "id": 9,
    "level": "중",
    "category": "조합과 중복조합",
    "originalCategory": "조합과 중복조합",
    "standardCourse": "확률과 통계",
    "standardUnitKey": "STAT-02",
    "standardUnit": "순열과 조합",
    "standardUnitOrder": 2,
    "content": "주사위 한 개를 세 번 던져 나온 눈의 수를 차례대로 $a, b, c$라고 하자. $a<b<c$인 경우의 수를 $m$, $a \\le b \\le c$인 경우의 수를 $n$이라고 할 때 $m+n$을 구하면? [3.8점]",
    "choices": [
      "24",
      "45",
      "76",
      "104",
      "236"
    ],
    "answer": "③",
    "solution": "$a<b<c$인 경우의 수 $m$은 1부터 6까지의 자연수 중 서로 다른 3개를 선택하는 조합의 수이므로 $m = {}_6C_3 = \\frac{6 \\times 5 \\times 4}{3 \\times 2 \\times 1} = 20$ 이다.\n$a \\le b \\le c$인 경우의 수 $n$은 1부터 6까지의 자연수 중 중복을 허락하여 3개를 선택하는 중복조합의 수이므로 $n = {}_6H_3 = {}_{6+3-1}C_3 = {}_8C_3 = \\frac{8 \\times 7 \\times 6}{3 \\times 2 \\times 1} = 56$ 이다.\n따라서 $m+n = 20 + 56 = 76$ 이다."
  },
  {
    "id": 10,
    "level": "중",
    "category": "중복조합",
    "originalCategory": "중복조합",
    "standardCourse": "확률과 통계",
    "standardUnitKey": "STAT-02",
    "standardUnit": "순열과 조합",
    "standardUnitOrder": 2,
    "content": "방정식 $x+y+z=15$을 만족시키는 홀수인 자연수 $x, y, z$의 순서쌍 $(x, y, z)$의 개수를 구하면? [4점]",
    "choices": [
      "28",
      "36",
      "56",
      "72",
      "91"
    ],
    "answer": "①",
    "solution": "$x, y, z$가 홀수인 자연수이므로 $x = 2a+1$, $y = 2b+1$, $z = 2c+1$ ($a, b, c$는 0 이상의 정수)로 나타낼 수 있다.\n방정식에 대입하면 $(2a+1) + (2b+1) + (2c+1) = 15$ 이다.\n$2a + 2b + 2c = 12 \\implies a + b + c = 6$\n구하는 순서쌍의 개수는 이 방정식을 만족하는 음이 아닌 정수 $a, b, c$의 순서쌍의 개수와 같으므로 ${}_3H_6 = {}_{3+6-1}C_6 = {}_8C_6 = {}_8C_2 = \\frac{8 \\times 7}{2 \\times 1} = 28$ 이다."
  },
  {
    "id": 11,
    "level": "중",
    "category": "이항정리",
    "originalCategory": "이항정리",
    "standardCourse": "확률과 통계",
    "standardUnitKey": "STAT-02",
    "standardUnit": "순열과 조합",
    "standardUnitOrder": 2,
    "content": "다음 중 ${}_3C_0 + {}_4C_1 + {}_5C_2 + {}_6C_3 + {}_7C_4$의 값과 같은 것은? [3.4점]",
    "choices": [
      "${}_7C_5$",
      "${}_8C_4$",
      "${}_8C_5$",
      "${}_9C_3$",
      "${}_9C_5$"
    ],
    "answer": "②",
    "solution": "파스칼의 삼각형 성질 ${}_nC_r + {}_nC_{r+1} = {}_{n+1}C_{r+1}$ 을 이용한다.\n${}_3C_0 = {}_4C_0$ 이므로,\n$({}_3C_0) + {}_4C_1 = {}_4C_0 + {}_4C_1 = {}_5C_1$\n${}_5C_1 + {}_5C_2 = {}_6C_2$\n${}_6C_2 + {}_6C_3 = {}_7C_3$\n${}_7C_3 + {}_7C_4 = {}_8C_4$\n따라서 주어진 식의 값은 ${}_8C_4$ 이다."
  },
  {
    "id": 12,
    "level": "중",
    "category": "이항정리",
    "originalCategory": "이항정리",
    "standardCourse": "확률과 통계",
    "standardUnitKey": "STAT-02",
    "standardUnit": "순열과 조합",
    "standardUnitOrder": 2,
    "content": "$31^{17}$을 90으로 나눈 나머지를 구하면? [4점]",
    "choices": [
      "29",
      "37",
      "41",
      "53",
      "61"
    ],
    "answer": "⑤",
    "solution": "$31^{17} = (30 + 1)^{17}$ 을 이항정리를 이용하여 전개하면,\n$(30+1)^{17} = {}_{17}C_0 \\cdot 30^0 + {}_{17}C_1 \\cdot 30^1 + {}_{17}C_2 \\cdot 30^2 + \\cdots + {}_{17}C_{17} \\cdot 30^{17}$ 이다.\n세 번째 항인 ${}_{17}C_2 \\cdot 30^2$ 부터는 모두 $30^2 = 900$의 배수이므로 90으로 나누어 떨어진다.\n따라서 나머지는 첫 두 항의 합인 ${}_{17}C_0 + {}_{17}C_1 \\cdot 30 = 1 + 17 \\times 30 = 511$ 을 90으로 나눈 나머지와 같다.\n$511 = 90 \\times 5 + 61$ 이므로 나머지는 61이다."
  },
  {
    "id": 13,
    "level": "중",
    "category": "이항정리",
    "originalCategory": "이항정리",
    "standardCourse": "확률과 통계",
    "standardUnitKey": "STAT-02",
    "standardUnit": "순열과 조합",
    "standardUnitOrder": 2,
    "content": "$(x^2 - 3x)^6$의 전개식에서 $x^9$의 계수를 $p$, $x^{10}$의 계수를 $q$라고 할 때, $p+q$의 값은? [4.2점]",
    "choices": [
      "-675",
      "-405",
      "-135",
      "405",
      "675"
    ],
    "answer": "②",
    "solution": "$(x^2 - 3x)^6 = (x(x - 3))^6 = x^6(x - 3)^6$ 이므로,\n$x^9$의 계수 $p$는 $(x - 3)^6$ 전개식에서 $x^3$의 계수와 같고, $x^{10}$의 계수 $q$는 $(x - 3)^6$ 전개식에서 $x^4$의 계수와 같다.\n$(x - 3)^6$의 일반항은 ${}_6C_r x^{6-r} (-3)^r$ 이다.\n$x^3$의 계수 ($6-r=3 \\implies r=3$): ${}_6C_3 (-3)^3 = 20 \\times (-27) = -540 \\implies p = -540$\n$x^4$의 계수 ($6-r=4 \\implies r=2$): ${}_6C_2 (-3)^2 = 15 \\times 9 = 135 \\implies q = 135$\n따라서 $p+q = -540 + 135 = -405$ 이다."
  },
  {
    "id": 14,
    "level": "상",
    "category": "같은 것이 있는 순열",
    "originalCategory": "같은 것이 있는 순열",
    "standardCourse": "확률과 통계",
    "standardUnitKey": "STAT-02",
    "standardUnit": "순열과 조합",
    "standardUnitOrder": 2,
    "content": "아래의 그림과 같은 도로망이 있다. A지점에서 출발하여 B지점까지 최단거리로 갈 때, P지점을 거치지 않고 가는 경우의 수는? (단, 끊어진 도로는 통행할 수 없다.) [4.4점]\n<svg width=\"260\" height=\"150\" viewBox=\"0 0 260 150\" xmlns=\"http://www.w3.org/2000/svg\" style=\"display:block; margin:10px auto;\">\n  <line x1=\"20\" y1=\"20\" x2=\"230\" y2=\"20\" stroke=\"black\" stroke-width=\"1\"/>\n  <line x1=\"20\" y1=\"50\" x2=\"230\" y2=\"50\" stroke=\"black\" stroke-width=\"1\"/>\n  <line x1=\"20\" y1=\"80\" x2=\"230\" y2=\"80\" stroke=\"black\" stroke-width=\"1\"/>\n  <line x1=\"20\" y1=\"110\" x2=\"230\" y2=\"110\" stroke=\"black\" stroke-width=\"1\"/>\n  \n  <line x1=\"20\" y1=\"20\" x2=\"20\" y2=\"110\" stroke=\"black\" stroke-width=\"1\"/> <line x1=\"50\" y1=\"20\" x2=\"50\" y2=\"80\" stroke=\"black\" stroke-width=\"1\"/> <line x1=\"80\" y1=\"20\" x2=\"80\" y2=\"110\" stroke=\"black\" stroke-width=\"1\"/> <line x1=\"110\" y1=\"20\" x2=\"110\" y2=\"50\" stroke=\"black\" stroke-width=\"1\"/> <line x1=\"110\" y1=\"80\" x2=\"110\" y2=\"110\" stroke=\"black\" stroke-width=\"1\"/>\n  <line x1=\"140\" y1=\"20\" x2=\"140\" y2=\"110\" stroke=\"black\" stroke-width=\"1\"/> <line x1=\"170\" y1=\"50\" x2=\"170\" y2=\"110\" stroke=\"black\" stroke-width=\"1\"/> <line x1=\"200\" y1=\"20\" x2=\"200\" y2=\"110\" stroke=\"black\" stroke-width=\"1\"/> <circle cx=\"20\" cy=\"20\" r=\"3\" fill=\"black\"/><text x=\"10\" y=\"15\" font-size=\"12\">A</text>\n  <circle cx=\"200\" cy=\"110\" r=\"3\" fill=\"black\"/><text x=\"205\" y=\"125\" font-size=\"12\">B</text>\n  <circle cx=\"140\" cy=\"50\" r=\"4\" fill=\"blue\"/><text x=\"145\" y=\"45\" font-size=\"12\" fill=\"blue\" font-weight=\"bold\">P</text>\n</svg>",
    "choices": [
      "28",
      "29",
      "30",
      "31",
      "32"
    ],
    "answer": "⑤",
    "solution": "[풀이]\n지시된 $A(0,0)$, $P(4,-1)$, $B(6,-3)$ 좌표와 유실된 세 구간의 도로를 반영하여 계산한다.\n1) 유실 도로를 고려한 $A$에서 $B$까지의 전체 최단 경로의 수: $62$가지\n2) $P$지점을 반드시 거쳐서 가는 경로의 수:\n   - $A \\rightarrow P(4,-1)$ 경로의 수: $\\binom{4+1}{1} = 5$가지\n   - $P(4,-1) \\rightarrow B(6,-3)$ 경로의 수: $\\binom{2+2}{2} = 6$가지 (이 구간 내 유실 도로 없음)\n   - $P$를 경유하는 경우의 수: $5 \\times 6 = 30$가지\n3) $P$지점을 거치지 않고 가는 경로의 수:\n   - $62 - 30 = 32$가지\n---\n[결론]\n정답: 5"
  },
  {
    "id": 15,
    "level": "상",
    "category": "함수의 개수",
    "originalCategory": "함수의 개수",
    "standardCourse": "확률과 통계",
    "standardUnitKey": "STAT-01",
    "standardUnit": "경우의 수",
    "standardUnitOrder": 1,
    "content": "집합 $X=\\{1, 3, 5, 7, 9, 11, 13\\}$, $Y=\\{2, 4, 6, 8\\}$에 대하여 다음 <조건>을 만족시키는 $X$에서 $Y$로의 함수 $f$의 개수를 구하면? [4.6점]\n<조 건>\n(가) $f(a)=8$인 집합 $X$의 원소 $a$의 개수는 1이다.\n(나) $f(b)=2, f(c)=4, f(d)=6$인 집합 $X$의 세 원소 $b, c, d$의 개수는 각각 최대 3, 5, 1이다.",
    "choices": [
      "1379",
      "1381",
      "1386",
      "1393",
      "1400"
    ],
    "answer": "①",
    "solution": "$X$의 원소는 7개, $Y$의 원소는 4개이다.\n(가)에 의해 $f(a)=8$인 $a$가 1개이므로, 7개의 원소 중 8에 대응될 1개를 선택하는 경우의 수는 ${}_7C_1 = 7$가지이다.\n나머지 6개의 원소를 $2, 4, 6$에 대응시켜야 한다. 2, 4, 6에 대응되는 원소의 개수를 각각 $n_2, n_4, n_6$이라 하면,\n$n_2 + n_4 + n_6 = 6$ 이고, (나) 조건에 의해 $0 \\le n_2 \\le 3$, $0 \\le n_4 \\le 5$, $0 \\le n_6 \\le 1$ 이다.\n$n_6$의 값에 따라 경우를 나누어 구한다.\n1) $n_6 = 0$ 인 경우: $n_2 + n_4 = 6$\n조건을 만족하는 $(n_2, n_4)$ 순서쌍은 $(1, 5), (2, 4), (3, 3)$ 의 3가지이다.\n이때 함수를 구성하는 경우의 수는 $\\frac{6!}{1!5!} + \\frac{6!}{2!4!} + \\frac{6!}{3!3!} = 6 + 15 + 20 = 41$가지이다.\n2) $n_6 = 1$ 인 경우: $n_2 + n_4 = 5$\n조건을 만족하는 $(n_2, n_4)$ 순서쌍은 $(0, 5), (1, 4), (2, 3), (3, 2)$ 의 4가지이다.\n이때 함수를 구성하는 경우의 수는 $\\frac{6!}{0!5!1!} + \\frac{6!}{1!4!1!} + \\frac{6!}{2!3!1!} + \\frac{6!}{3!2!1!} = 6 + 30 + 60 + 60 = 156$가지이다.\n따라서 8이 아닌 6개 원소의 분배 방법의 수는 $41 + 156 = 197$가지이다.\n전체 함수의 개수는 $7 \\times 197 = 1379$개이다."
  },
  {
    "id": 16,
    "level": "중",
    "category": "조합",
    "originalCategory": "조합",
    "standardCourse": "확률과 통계",
    "standardUnitKey": "STAT-02",
    "standardUnit": "순열과 조합",
    "standardUnitOrder": 2,
    "content": "집합 $A=\\{1, 2, 3, 4, 5, 6, 7, 8, 9\\}$의 부분집합 중에서 원소 1을 포함하고 원소의 개수가 홀수인 집합의 개수를 구하면? [4.4점]",
    "choices": [
      "16",
      "32",
      "64",
      "128",
      "256"
    ],
    "answer": "④",
    "solution": "원소 1을 반드시 포함해야 하므로, 나머지 8개의 원소 중 짝수 개를 선택하여 부분집합을 구성하면 전체 원소의 개수가 홀수 개가 된다.\n8개의 원소 중 짝수 개를 선택하는 경우의 수의 합은 ${}_8C_0 + {}_8C_2 + {}_8C_4 + {}_8C_6 + {}_8C_8$ 이다.\n이항계수의 성질에 의해 이 값은 $2^{8-1} = 2^7 = 128$ 이다."
  },
  {
    "id": 17,
    "level": "중",
    "category": "집합의 분할/중복순열",
    "originalCategory": "집합의 분할/중복순열",
    "standardCourse": "확률과 통계",
    "standardUnitKey": "STAT-01",
    "standardUnit": "경우의 수",
    "standardUnitOrder": 1,
    "content": "전체집합 $U=\\{0, 1, 2, 3, 4\\}$의 두 부분집합 $A, B$에 대하여 다음의 조건을 만족하도록 하는 $A, B$의 순서쌍 $(A, B)$의 개수를 구하면? [4.4점]\n<조 건>\n(가) $A \\cup B = U$\n(나) $A \\cap B \\neq \\varnothing$",
    "choices": [
      "128",
      "179",
      "201",
      "211",
      "243"
    ],
    "answer": "④",
    "solution": "(가) $A \\cup B = U$ 를 만족하는 부분집합의 순서쌍 $(A, B)$의 개수를 구하고, 그 중 조건 (나)의 여사건인 $A \\cap B = \\varnothing$ 인 경우를 뺀다.\n$A \\cup B = U$ 를 만족하려면 $U$의 각 원소(5개)는 $A-B, B-A, A\\cap B$ 의 3개 영역 중 하나에 속해야 하므로 경우의 수는 $3^5 = 243$ 이다.\n$A \\cup B = U$ 이고 $A \\cap B = \\varnothing$ 인 경우는 두 집합이 서로소이면서 합집합이 전체집합인 경우이므로 $B = A^C$ 이다. $U$의 부분집합 $A$를 결정하면 $B$가 자동으로 결정되므로 이 경우의 수는 $2^5 = 32$ 이다.\n따라서 주어진 조건을 만족하는 순서쌍의 개수는 $243 - 32 = 211$ 이다."
  },
  {
    "id": 18,
    "level": "상",
    "category": "중복조합",
    "originalCategory": "중복조합",
    "standardCourse": "확률과 통계",
    "standardUnitKey": "STAT-02",
    "standardUnit": "순열과 조합",
    "standardUnitOrder": 2,
    "content": "같은 종류의 사탕 13개를 4명의 학생 A, B, C, D에게 남김없이 나누어 줄 때, 다음 조건을 만족시키도록 나누어 주는 경우의 수를 구하면? [4.6점]\n<조 건>\n(가) 각 학생은 적어도 1개의 사탕을 받는다.\n(나) A학생은 B학생보다 더 많은 사탕을 받는다.\n(다) 사탕을 1개만 받는 학생은 2명이다.",
    "choices": [
      "16",
      "17",
      "18",
      "19",
      "20"
    ],
    "answer": "⑤",
    "solution": "학생들이 받는 사탕의 개수를 각각 $a, b, c, d$라 하면 $a+b+c+d=13$ 이고 (가) 조건에 의해 모두 1 이상이다.\n조건 (나)에서 $a>b$ 이므로 $a$는 최소 2 이상이다. 따라서 A는 1개를 받을 수 없다.\n조건 (다)에 의해 사탕을 1개만 받는 2명은 B, C, D 중에서 선택되어야 하므로 ${}_3C_2 = 3$가지 경우가 있다.\n\n1) B, C가 1개씩 받는 경우: $b=1, c=1$\n$a+d = 11$ 이고 $a, d \\ge 2$ 이어야 한다. ($a>b=1$ 이므로 $a \\ge 2$, 1개 받는 학생이 더 없어야 하므로 $d \\ge 2$)\n이를 만족하는 순서쌍 $(a, d)$는 $(2, 9), (3, 8), \\dots, (9, 2)$ 의 8가지이다.\n\n2) B, D가 1개씩 받는 경우: $b=1, d=1$\n$a+c = 11$ 이고 $a, c \\ge 2$ 이어야 하므로 위와 동일하게 8가지이다.\n\n3) C, D가 1개씩 받는 경우: $c=1, d=1$\n$a+b = 11$ 이고, $a, b \\ge 2$, $a>b$ 이어야 한다.\n$a+b=11$인 $(a, b)$ 중 $a,b \\ge 2$인 것은 8가지이고, 이 중 $a>b$인 것은 대칭성에 의해 절반인 4가지이다. ($(6, 5), (7, 4), (8, 3), (9, 2)$)\n\n따라서 총 경우의 수는 $8 + 8 + 4 = 20$가지이다."
  },
  {
    "id": 19,
    "level": "상",
    "category": "이항정리",
    "originalCategory": "이항정리",
    "standardCourse": "확률과 통계",
    "standardUnitKey": "STAT-02",
    "standardUnit": "순열과 조합",
    "standardUnitOrder": 2,
    "content": "$(1+x+x^2+x^3)\\left(x^2+\\frac{a}{x}\\right)^5$의 전개식에서 $x^7$의 계수가 225일 때, 정수 $a$의 값은? [4.6점]",
    "choices": [
      "-5",
      "-3",
      "3",
      "7",
      "9"
    ],
    "answer": "①",
    "solution": "$(x^2 + ax^{-1})^5$의 일반항은 ${}_5C_r (x^2)^{5-r} (ax^{-1})^r = {}_5C_r a^r x^{10-3r}$ 이다.\n전체 전개식에서 $x^7$ 항이 나오려면 앞의 다항식 $(1+x+x^2+x^3)$의 각 항에 곱해지는 일반항의 차수를 확인해야 한다.\n1) 상수항 $1$과 곱해질 때: $10-3r = 7 \\implies 3r = 3 \\implies r = 1$. 계수는 ${}_5C_1 a^1 = 5a$\n2) $x$와 곱해질 때: $10-3r = 6 \\implies 3r = 4$ (정수 해 없음)\n3) $x^2$과 곱해질 때: $10-3r = 5 \\implies 3r = 5$ (정수 해 없음)\n4) $x^3$과 곱해질 때: $10-3r = 4 \\implies 3r = 6 \\implies r = 2$. 계수는 ${}_5C_2 a^2 = 10a^2$\n따라서 $x^7$의 전체 계수는 $10a^2 + 5a$ 이다.\n$10a^2 + 5a = 225 \\implies 2a^2 + a - 45 = 0 \\implies (2a - 9)(a + 5) = 0$\n$a$는 정수이므로 $a = -5$ 이다."
  },
  {
    "id": 20,
    "level": "상",
    "category": "중복조합",
    "originalCategory": "중복조합",
    "standardCourse": "확률과 통계",
    "standardUnitKey": "STAT-02",
    "standardUnit": "순열과 조합",
    "standardUnitOrder": 2,
    "content": "집합 $X=\\{1, 2, 3, 4, 5\\}$에 대하여 $X$에서 $X$로의 함수 $f$중에서 다음 조건을 만족시키는 함수의 개수를 구하고, 그 과정을 함께 서술하시오. [5점]\n<조 건>\n(가) $f(2)$는 2 이하의 자연수이다.\n(나) $f(1) \\le f(2) \\le f(3) < f(4) \\le f(5)$",
    "choices": [
      " "
    ],
    "answer": "40",
    "solution": "조건 (가)에서 $f(2)$는 1 또는 2이다.\n\n경우 1) $f(2) = 1$ 인 경우\n조건 (나)에 의해 $f(1) \\le 1$ 이므로 $f(1) = 1$ (1가지).\n$1 \\le f(3) < f(4) \\le f(5) \\le 5$ 를 만족하는 경우의 수를 구한다.\n$f(3), f(4), f(5)$를 1부터 5까지 중 선택하되, 전체 $1 \\le f(3) \\le f(4) \\le f(5) \\le 5$ 인 경우에서 $f(3)=f(4)$인 경우를 뺀다.\n전체 경우: ${}_5H_3 = {}_7C_3 = 35$가지\n$f(3)=f(4)$인 경우: $1 \\le f(3)=f(4) \\le f(5) \\le 5$ 이므로 ${}_5H_2 = {}_6C_2 = 15$가지\n따라서 이 경우의 함수 개수는 $1 \\times (35 - 15) = 20$가지이다.\n\n경우 2) $f(2) = 2$ 인 경우\n$f(1) \\le 2$ 이므로 $f(1)$은 1, 2 중 하나 (2가지).\n$2 \\le f(3) < f(4) \\le f(5) \\le 5$ 를 만족하는 경우의 수를 구한다.\n$f(3), f(4), f(5)$를 2부터 5까지(4개) 중 선택하되, 위와 같은 방법으로 계산한다.\n전체 경우: $2 \\le f(3) \\le f(4) \\le f(5) \\le 5 \\implies {}_4H_3 = {}_6C_3 = 20$가지\n$f(3)=f(4)$인 경우: $2 \\le f(3)=f(4) \\le f(5) \\le 5 \\implies {}_4H_2 = {}_5C_2 = 10$가지\n따라서 $20 - 10 = 10$가지이고, $f(1)$을 선택하는 경우와 곱하면 $2 \\times 10 = 20$가지이다.\n\n전체 경우의 수는 $20 + 20 = 40$가지이다."
  },
  {
    "id": 21,
    "level": "중",
    "category": "중복조합",
    "originalCategory": "중복조합",
    "standardCourse": "확률과 통계",
    "standardUnitKey": "STAT-02",
    "standardUnit": "순열과 조합",
    "standardUnitOrder": 2,
    "content": "파란 펜 1자루와 빨간 펜 7자루를 세 학생 A, B, C에게 남김없이 나누어주려고 한다. 다음 경우의 수를 각각 구하고 그 과정을 함께 서술하시오. (단, 같은 색의 펜끼리는 서로 구분하지 않는다.) [총 6점]\n(1) 펜을 받지 못하는 사람이 있을 수 있는 경우 [3점]\n(2) 각 사람이 1자루 이상의 볼펜을 받도록 나누어주는 경우 [3점]",
    "choices": [
      " "
    ],
    "answer": "(1) 108\n(2) 63",
    "solution": "(1) 파란 펜 1자루를 세 명 중 1명에게 나누어 주는 방법은 3가지이다.\n빨간 펜 7자루를 세 명에게 중복을 허락하여 나누어 주는 방법은 ${}_3H_7 = {}_{3+7-1}C_7 = {}_9C_2 = 36$가지이다.\n두 사건은 독립적으로 발생하므로 총 경우의 수는 $3 \\times 36 = 108$가지이다.\n\n(2) 각 사람이 1자루 이상의 펜을 받아야 한다.\n파란 펜을 받을 학생을 정하는 방법은 3가지이다. 그 중 A가 받았다고 가정하자.\nA는 이미 펜을 받았으므로, 빨간 펜 7자루를 나누어 줄 때 B와 C는 적어도 1자루씩 받아야 하고 A는 받지 않아도 된다.\nA, B, C가 받는 빨간 펜의 개수를 각각 $a, b, c$라 하면 $a+b+c=7$ ($a \\ge 0$, $b \\ge 1$, $c \\ge 1$) 이다.\n$b' = b-1$, $c' = c-1$ 로 치환하면 $a + b' + c' = 5$ ($a, b', c' \\ge 0$) 이다.\n이를 만족하는 음이 아닌 정수해의 개수는 ${}_3H_5 = {}_{3+5-1}C_5 = {}_7C_2 = 21$가지이다.\n따라서 전체 경우의 수는 $3 \\times 21 = 63$가지이다."
  },
  {
    "id": 22,
    "level": "상",
    "category": "원순열",
    "originalCategory": "원순열",
    "standardCourse": "확률과 통계",
    "standardUnitKey": "STAT-02",
    "standardUnit": "순열과 조합",
    "standardUnitOrder": 2,
    "content": "1학년 학생 2명, 2학년 학생 3명, 3학년 학생 3명이 일정한 간격을 두고 원 모양의 탁자에 다음 조건을 만족시키도록 모두 둘러앉는 경우의 수를 구하시오. (단, 회전하여 일치하는 것은 같은 것으로 본다.) [4.8점]\n<svg width='180' height='180' viewBox='0 0 200 200' style='display:block; margin: 10px auto;'>\n  <circle cx='100' cy='100' r='70' stroke='black' stroke-width='2' fill='none'/>\n  <circle cx='170' cy='100' r='5' fill='black'/><circle cx='149' cy='149' r='5' fill='black'/>\n  <circle cx='100' cy='170' r='5' fill='black'/><circle cx='51' cy='149' r='5' fill='black'/>\n  <circle cx='30' cy='100' r='5' fill='black'/><circle cx='51' cy='51' r='5' fill='black'/>\n  <circle cx='100' cy='30' r='5' fill='black'/><circle cx='149' cy='51' r='5' fill='black'/>\n</svg>\n<조 건>\n(가) 같은 학년 학생끼리는 서로 이웃하여 앉지 않는다.\n(나) 같은 학년 학생끼리는 서로 마주보고 앉지 않는다.",
    "choices": [
      "72",
      "144",
      "288",
      "360",
      "720"
    ],
    "answer": "②",
    "solution": "[풀이]\n1) 3학년 3명을 탁자에 배치하는 원순열의 수 (비대칭 좌석 간격): 6가지\n2) 남은 5자리 중 1, 2학년의 조건(이웃 및 마주보기 금지)을 모두 만족하는 유효 좌석 조합: 2가지\n3) 해당 좌석에 1, 2학년을 각각 배열하는 경우의 수: 3! \\times 2! = 12가지\n\\rightarrow 6 \\times 2 \\times 12 = 144\n---\n[결론]\n정답: 144"
  },
  {
    "id": 23,
    "level": "중",
    "category": "원순열",
    "originalCategory": "원순열",
    "standardCourse": "확률과 통계",
    "standardUnitKey": "STAT-02",
    "standardUnit": "순열과 조합",
    "standardUnitOrder": 2,
    "content": "아래의 그림과 같이 밑면이 정사각형이고 옆면이 모두 합동인 사각뿔의 5개의 면에 서로 다른 6가지 색 중 5가지 색을 사용하여 칠하는 경우의 수를 구하고, 그 과정을 함께 서술하시오. (단, 한 면에는 한 가지 색만 칠하고, 회전하여 일치하는 것은 같은 것으로 본다.) [4점]\n<svg width='150' height='150' viewBox='0 0 150 150' style='display:block; margin: 10px auto;'>\n  <line x1='75' y1='20' x2='30' y2='100' stroke='black' stroke-width='1.5'/>\n  <line x1='75' y1='20' x2='120' y2='100' stroke='black' stroke-width='1.5'/>\n  <line x1='75' y1='20' x2='140' y2='80' stroke='black' stroke-width='1.5'/>\n  <line x1='75' y1='20' x2='50' y2='80' stroke='gray' stroke-width='1' stroke-dasharray='4,2'/>\n  <polyline points='30,100 120,100 140,80' fill='none' stroke='black' stroke-width='1.5'/>\n  <polyline points='30,100 50,80 140,80' fill='none' stroke='gray' stroke-width='1' stroke-dasharray='4,2'/>\n</svg>",
    "choices": [
      " "
    ],
    "answer": "180",
    "solution": "[풀이] 수식 중심 전개\n1) 6가지 색 중 5가지 색을 선택하는 경우: ${}_6C_5 = 6$\n2) 선택된 5색 중 밑면을 칠하는 경우: 5\n3) 옆면 4개를 칠하는 원순열의 수: $(4-1)! = 6$\n$\\therefore 6 \\times 5 \\times 6 = 180$\n---\n[결론] 정답: 180이다."
  },
  {
    "id": 24,
    "level": "상",
    "category": "순열",
    "originalCategory": "순열",
    "standardCourse": "확률과 통계",
    "standardUnitKey": "STAT-02",
    "standardUnit": "순열과 조합",
    "standardUnitOrder": 2,
    "content": "6개의 숫자 0, 1, 2, 3, 4, 5를 모두 사용하여 만들 수 있는 여섯 자리 자연수 중에서 4의 배수의 개수를 구하고, 그 과정을 함께 서술하시오. [5점]",
    "choices": [
      " "
    ],
    "answer": "144",
    "solution": "여섯 자리 자연수가 4의 배수가 되려면 끝의 두 자리 수가 4의 배수이어야 한다.\n주어진 숫자 0, 1, 2, 3, 4, 5로 만들 수 있는 서로 다른 숫자로 구성된 끝 두 자리 4의 배수는 04, 12, 20, 24, 32, 40, 52 의 7가지이다.\n각 경우에 대하여 나머지 4개의 숫자를 앞의 4자리에 배열하는 경우의 수를 구한다.\n\n1) 0이 포함된 경우 (04, 20, 40): 3가지\n끝 두 자리에 0이 사용되었으므로, 남은 4개의 숫자를 앞의 4자리에 제한 없이 배열하면 된다. 경우의 수는 $4! = 24$가지이다.\n총 $3 \\times 24 = 72$가지.\n\n2) 0이 포함되지 않은 경우 (12, 24, 32, 52): 4가지\n끝 두 자리에 0이 사용되지 않았으므로, 남은 4개의 숫자 중에 0이 포함되어 있다.\n맨 앞자리에는 0이 올 수 없으므로, 맨 앞자리에 올 수 있는 숫자는 0을 제외한 3가지이고, 나머지 3자리에 남은 3개의 숫자를 배열하는 경우의 수는 $3!$이다.\n각 경우의 수는 $3 \\times 3! = 18$가지이다.\n총 $4 \\times 18 = 72$가지.\n\n따라서 구하는 4의 배수의 총 개수는 $72 + 72 = 144$가지이다."
  }
];
