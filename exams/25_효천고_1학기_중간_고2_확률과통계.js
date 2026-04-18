Window.examTitle = "25_효천고_1학기_중간_고2_확률과통계";

window.questionBank = [
  {
    "id": 1,
    "level": "하",
    "category": "원순열",
    "content": "정육각형 모양의 탁자에 6명이 둘러 앉는 경우의 수를 구하면? (단, 회전하여 일치하는 것은 같은 것으로 본다.)",
    "choices": [
      "4!",
      "5!",
      "6!",
      "7!",
      "8!"
    ],
    "answer": "2",
    "solution": "6명이 정육각형 탁자에 둘러앉는 경우의 수는 회전하여 일치하는 것을 같은 것으로 보므로 원순열과 동일하게 계산할 수 있다.\n$\\rightarrow (6-1)! = 5!$\n따라서 구하는 경우의 수는 5!이다.",
    "originalCategory": "",
    "standardCourse": "",
    "standardUnitKey": "",
    "standardUnit": "",
    "standardUnitOrder": ""
  },
  {
    "id": 2,
    "level": "하",
    "category": "중복조합",
    "content": "${}_{3}H_{n} = 21$일 때, 자연수 n의 값은?",
    "choices": [
      "2",
      "3",
      "4",
      "5",
      "6"
    ],
    "answer": "4",
    "solution": "중복조합의 정의에 의해 ${}_{3}H_{n} = {}_{3+n-1}C_{n} = {}_{n+2}C_{n} = {}_{n+2}C_{2}$ 이다.\n$\\rightarrow \\frac{(n+2)(n+1)}{2} = 21$\n$\\rightarrow (n+2)(n+1) = 42$\n$\\rightarrow n^2 + 3n - 40 = 0$\n$\\rightarrow (n+8)(n-5) = 0$\nn은 자연수이므로 n=5이다.",
    "originalCategory": "",
    "standardCourse": "",
    "standardUnitKey": "",
    "standardUnit": "",
    "standardUnitOrder": ""
  },
  {
    "id": 3,
    "level": "중",
    "category": "같은 것이 있는 순열",
    "content": "[도형필요] 그림과 같이 정사각형 모양으로 연결된 도로망이 있다. 이 도로망을 따라 A지점에서 출발하여 P지점을 거쳐 B지점까지 최단 거리로 가는 경우의 수는?",
    "choices": [
      "4",
      "6",
      "8",
      "10",
      "12"
    ],
    "answer": "3",
    "solution": "[도형 검토 후 보완 필요]\n도형의 가로, 세로 칸 수에 따라 경로를 분할하여 계산한다.\nA에서 P까지 가는 최단 경로의 수: 가로 3칸, 세로 1칸일 경우 $\\frac{4!}{3!1!} = 4$가지\nP에서 B까지 가는 최단 경로의 수: 가로 1칸, 세로 1칸일 경우 $\\frac{2!}{1!1!} = 2$가지\n$\\rightarrow 4 \\times 2 = 8$\n도형의 기본 형태를 가정했을 때 정답은 8이다.",
    "originalCategory": "",
    "standardCourse": "",
    "standardUnitKey": "",
    "standardUnit": "",
    "standardUnitOrder": ""
  },
  {
    "id": 4,
    "level": "하",
    "category": "이항정리",
    "content": "원소가 8개인 집합 A의 부분집합 중에서 원소의 개수가 홀수인 것의 개수는?",
    "choices": [
      "16",
      "32",
      "64",
      "128",
      "256"
    ],
    "answer": "4",
    "solution": "원소의 개수가 8개인 집합의 부분집합 중 원소의 개수가 홀수(1, 3, 5, 7)인 것의 개수는 이항계수의 성질을 이용한다.\n$\\rightarrow {}_{8}C_{1} + {}_{8}C_{3} + {}_{8}C_{5} + {}_{8}C_{7}$\n$\\rightarrow 2^{8-1} = 2^7 = 128$\n따라서 128개이다.",
    "originalCategory": "",
    "standardCourse": "",
    "standardUnitKey": "",
    "standardUnit": "",
    "standardUnitOrder": ""
  },
  {
    "id": 5,
    "level": "중",
    "category": "이항정리",
    "content": "${}_{1}C_{0} + {}_{2}C_{1} + {}_{3}C_{2} + {}_{4}C_{3} + {}_{5}C_{4} = {}_{n}C_{4}$ 일 때, 등식을 만족시키는 자연수 n의 값은?",
    "choices": [
      "2",
      "4",
      "6",
      "8",
      "10"
    ],
    "answer": "3",
    "solution": "파스칼의 삼각형 성질(${}_{n-1}C_{r-1} + {}_{n-1}C_{r} = {}_{n}C_{r}$)을 이용한다.\n${}_{1}C_{0} = {}_{2}C_{0}$ 이므로 식을 변형하면:\n$({}_{2}C_{0} + {}_{2}C_{1}) + {}_{3}C_{2} + {}_{4}C_{3} + {}_{5}C_{4}$\n$= {}_{3}C_{1} + {}_{3}C_{2} + {}_{4}C_{3} + {}_{5}C_{4}$\n$= {}_{4}C_{2} + {}_{4}C_{3} + {}_{5}C_{4}$\n$= {}_{5}C_{3} + {}_{5}C_{4}$\n$= {}_{6}C_{4}$\n따라서 n=6이다.",
    "originalCategory": "",
    "standardCourse": "",
    "standardUnitKey": "",
    "standardUnit": "",
    "standardUnitOrder": ""
  },
  {
    "id": 6,
    "level": "중",
    "category": "이항정리",
    "content": "(6x^3 - \\frac{1}{2x})^4의 전개식에서 상수항은?",
    "choices": [
      "-54",
      "-3",
      "0",
      "3",
      "54"
    ],
    "answer": "2",
    "solution": "이항정리의 일반항은 ${}_{4}C_{k} (6x^3)^{4-k} (-\\frac{1}{2x})^{k}$ 이다.\n식을 정리하면 ${}_{4}C_{k} \\cdot 6^{4-k} \\cdot (-\\frac{1}{2})^{k} \\cdot x^{12-3k} \\cdot x^{-k} = {}_{4}C_{k} \\cdot 6^{4-k} \\cdot (-\\frac{1}{2})^{k} \\cdot x^{12-4k}$\n상수항이 되려면 x의 지수가 0이어야 하므로 $12 - 4k = 0 \\rightarrow k = 3$\nk = 3을 대입하여 계수를 구하면:\n${}_{4}C_{3} \\cdot 6^1 \\cdot (-\\frac{1}{2})^3 = 4 \\cdot 6 \\cdot (-\\frac{1}{8}) = 24 \\times (-\\frac{1}{8}) = -3$\n따라서 상수항은 -3이다.",
    "originalCategory": "",
    "standardCourse": "",
    "standardUnitKey": "",
    "standardUnit": "",
    "standardUnitOrder": ""
  },
  {
    "id": 7,
    "level": "중",
    "category": "이항정리",
    "content": "11^{25}을 50으로 나눈 나머지는?",
    "choices": [
      "0",
      "1",
      "2",
      "3",
      "4"
    ],
    "answer": "2",
    "solution": "$11^{25} = (10+1)^{25}$ 이고 이항정리를 이용하여 전개한다.\n$(10+1)^{25} = {}_{25}C_{0} + {}_{25}C_{1}(10) + {}_{25}C_{2}(100) + \\dots + {}_{25}C_{25}(10^{25})$\n세 번째 항부터는 모두 100의 배수이므로 50으로 나누어 떨어진다.\n따라서 50으로 나눈 나머지는 첫 번째 항과 두 번째 항의 합을 50으로 나눈 나머지와 같다.\n${}_{25}C_{0} + {}_{25}C_{1}(10) = 1 + 25 \\times 10 = 251$\n$251 = 50 \\times 5 + 1$ 이므로 나머지는 1이다.",
    "originalCategory": "",
    "standardCourse": "",
    "standardUnitKey": "",
    "standardUnit": "",
    "standardUnitOrder": ""
  },
  {
    "id": 8,
    "level": "상",
    "category": "같은 것이 있는 순열",
    "content": "여섯 개의 숫자 0, 2, 2, 3, 5, 5를 모두 사용하여 만들 수 있는 여섯 자리 자연수 개수는?",
    "choices": [
      "130",
      "140",
      "150",
      "160",
      "170"
    ],
    "answer": "3",
    "solution": "6개의 숫자를 모두 나열하는 전체 경우의 수에서 맨 앞자리에 0이 오는 경우의 수를 뺀다.\n전체 나열 경우의 수: $\\frac{6!}{2!2!} = \\frac{720}{4} = 180$\n맨 앞자리가 0인 경우의 수 (나머지 2, 2, 3, 5, 5를 나열): $\\frac{5!}{2!2!} = \\frac{120}{4} = 30$\n$\\rightarrow 180 - 30 = 150$\n따라서 만들 수 있는 6자리 자연수의 개수는 150이다.",
    "originalCategory": "",
    "standardCourse": "",
    "standardUnitKey": "",
    "standardUnit": "",
    "standardUnitOrder": ""
  },
  {
    "id": 9,
    "level": "상",
    "category": "원순열",
    "content": "[도형필요] 8등분된 원판에 빨강, 주황, 노랑, 초록, 파랑, 보라색의 6가지 색을 모두 사용하여 영역을 구분하려고 한다. 그림과 같이 빨강, 주황 두 가지 색은 이미 칠해져 있을 때, 칠해져 있지 않은 영역에 칠할 수 있는 방법의 수는? (단, 한 영역에는 한 가지 색을 칠하고, 회전하여 같은 경우에는 한 가지 방법으로 한다.)",
    "choices": [
      "6",
      "8",
      "10",
      "12",
      "14"
    ],
    "answer": "4",
    "solution": "[도형 검토 후 보완 필요]\n이미 칠해진 빨강과 주황이 마주보는 대칭 구조로 칠해져 있다고 가정하면, 원판의 회전 대칭성은 180도 회전에 대해서만 유지된다.\n남은 4개의 빈 영역에 나머지 4가지 색(노랑, 초록, 파랑, 보라)을 칠하는 전체 경우의 수는 4! = 24가지이다.\n180도 회전 시 완전히 겹쳐지는 색칠 방법은 빈 영역이 대칭적으로 같은 색이어야 하나, 4가지 색이 모두 다르므로 불가능하다. (즉, 대칭인 배치는 0개)\n번사이드 보조정리(또는 원순열의 대칭성)를 적용하여 180도 회전에 대한 2개의 중복도를 나누면:\n$\\frac{24}{2} = 12$가지이다.",
    "originalCategory": "",
    "standardCourse": "",
    "standardUnitKey": "",
    "standardUnit": "",
    "standardUnitOrder": ""
  },
  {
    "id": 10,
    "level": "상",
    "category": "같은 것이 있는 순열",
    "content": "숫자 1, 2, 3, 3, 4, 4, 4가 하나씩 적힌 7장의 카드를 모두 한 번씩 사용하여 일렬로 나열할 때, 1이 적힌 카드와 2가 적힌 카드 사이에 한 장 이상의 카드가 있도록 나열하는 경우의 수는?",
    "choices": [
      "300",
      "310",
      "320",
      "330",
      "340"
    ],
    "answer": "1",
    "solution": "전체 나열하는 경우의 수에서 1과 2가 이웃하는 경우의 수를 뺀다.\n전체 나열 경우의 수: $\\frac{7!}{2!3!} = \\frac{5040}{12} = 420$\n1과 2를 하나의 묶음으로 생각하여 나열하는 경우의 수: (묶음), 3, 3, 4, 4, 4 의 6개 단위를 나열하고, 묶음 내에서 1과 2의 자리를 바꾸는 경우를 곱한다.\n$\\rightarrow \\frac{6!}{2!3!} \\times 2! = 60 \\times 2 = 120$\n$\\rightarrow 420 - 120 = 300$\n따라서 구하는 경우의 수는 300이다.",
    "originalCategory": "",
    "standardCourse": "",
    "standardUnitKey": "",
    "standardUnit": "",
    "standardUnitOrder": ""
  },
  {
    "id": 11,
    "level": "중",
    "category": "중복조합",
    "content": "방정식 x+y+z=15에서 x \\ge 2, y \\ge 1, z \\ge 3을 만족시키는 정수해의 개수는?",
    "choices": [
      "15",
      "28",
      "36",
      "45",
      "55"
    ],
    "answer": "5",
    "solution": "주어진 조건에 맞게 치환한다.\nx' = x-2 \\ge 0, y' = y-1 \\ge 0, z' = z-3 \\ge 0\n$\\rightarrow (x'+2) + (y'+1) + (z'+3) = 15$\n$\\rightarrow x' + y' + z' = 9$ (단, x', y', z'은 음이 아닌 정수)\n구하는 해의 개수는 중복조합 ${}_{3}H_{9}$ 이다.\n${}_{3}H_{9} = {}_{3+9-1}C_{9} = {}_{11}C_{9} = {}_{11}C_{2} = \\frac{11 \\times 10}{2} = 55$",
    "originalCategory": "",
    "standardCourse": "",
    "standardUnitKey": "",
    "standardUnit": "",
    "standardUnitOrder": ""
  },
  {
    "id": 12,
    "level": "중",
    "category": "이항정리",
    "content": "자연수 n에 대하여, ${}_{n}C_{0} + {}_{n}C_{1} \\times 7 + {}_{n}C_{2} \\times 7^2 + \\dots + {}_{n}C_{n} \\times 7^n = 2^{60}$을 만족하는 n의 값은?",
    "choices": [
      "16",
      "17",
      "18",
      "19",
      "20"
    ],
    "answer": "5",
    "solution": "이항정리에 의해 주어진 식의 좌변은 $(1+7)^n$ 으로 나타낼 수 있다.\n$\\rightarrow (1+7)^n = 8^n = (2^3)^n = 2^{3n}$\n주어진 등식은 $2^{3n} = 2^{60}$ 이다.\n$\\rightarrow 3n = 60 \\rightarrow n = 20$",
    "originalCategory": "",
    "standardCourse": "",
    "standardUnitKey": "",
    "standardUnit": "",
    "standardUnitOrder": ""
  },
  {
    "id": 13,
    "level": "상",
    "category": "중복조합",
    "content": "다음 조건을 만족하는 음이 아닌 정수 a, b, c, d의 모든 순서쌍 (a, b, c, d)의 개수를 구하면?\n(가) a + b + c - d = 11\n(나) d \\le 3이고 c \\ge d + 1이다.",
    "choices": [
      "224",
      "234",
      "244",
      "254",
      "264"
    ],
    "answer": "5",
    "solution": "(나) 조건에서 $c - d \\ge 1$ 이므로 c' = c - d - 1 (c' \\ge 0)로 치환한다.\n$\\rightarrow c = c' + d + 1$\n(가) 식에 대입하면:\na + b + (c' + d + 1) - d = 11\n$\\rightarrow a + b + c' = 10$ (a, b, c'은 음이 아닌 정수)\n이 방정식의 해의 개수는 d의 값에 무관하게 ${}_{3}H_{10}$ 이다.\n${}_{3}H_{10} = {}_{12}C_{10} = {}_{12}C_{2} = \\frac{12 \\times 11}{2} = 66$\n한편 (나) 조건에서 음이 아닌 정수 d의 범위는 $0 \\le d \\le 3$ 이므로 가능한 d의 개수는 4개(0, 1, 2, 3)이다.\n$\\rightarrow 전체 개수 = 66 \\times 4 = 264$",
    "originalCategory": "",
    "standardCourse": "",
    "standardUnitKey": "",
    "standardUnit": "",
    "standardUnitOrder": ""
  },
  {
    "id": 14,
    "level": "상",
    "category": "중복조합",
    "content": "방정식 x+y+z+4w=13을 만족시키는 자연수 x, y, z, w의 모든 순서쌍 (x, y, z, w)의 개수를 구하면?",
    "choices": [
      "30",
      "32",
      "34",
      "36",
      "38"
    ],
    "answer": "3",
    "solution": "자연수 조건이므로 계수가 큰 w를 기준으로 경우를 나눈다. ($w \\ge 1, x, y, z \\ge 1$)\n1) w = 1일 때:\n$x+y+z = 9 \\rightarrow x'+y'+z' = 6$ (x', y', z' \\ge 0)\n경우의 수: ${}_{3}H_{6} = {}_{8}C_{6} = 28$\n2) w = 2일 때:\n$x+y+z = 5 \\rightarrow x'+y'+z' = 2$ (x', y', z' \\ge 0)\n경우의 수: ${}_{3}H_{2} = {}_{4}C_{2} = 6$\n3) w \\ge 3일 때:\nw = 3이면 x+y+z = 1이 되어 자연수 조건을 만족할 수 없다.\n$\\rightarrow 총 개수 = 28 + 6 = 34$",
    "originalCategory": "",
    "standardCourse": "",
    "standardUnitKey": "",
    "standardUnit": "",
    "standardUnitOrder": ""
  },
  {
    "id": 15,
    "level": "상",
    "category": "함수의 개수",
    "content": "집합 A = \\{1, 2, 3, 4, 5\\}에서 집합 B = \\{2, 4, 6, 8, 10\\}으로의 함수 중에서 다음 조건을 만족시키는 함수 f의 개수는?\n(가) f(2) \\times f(4)는 8의 약수이다.\n(나) f(1) < 2f(2)",
    "choices": [
      "50",
      "75",
      "100",
      "125",
      "150"
    ],
    "answer": "4",
    "solution": "공역 B의 원소 중 곱이 8의 약수(1, 2, 4, 8)가 되는 f(2), f(4)의 순서쌍을 찾는다.\n가능한 (f(2), f(4)) 순서쌍은 (2, 2), (2, 4), (4, 2)이다.\nCase 1: (2, 2)일 때\nf(1) < 4를 만족하는 f(1)은 2 (1개)\nf(3), f(5)는 각각 5개 선택 가능 $\\rightarrow 1 \\times 5 \\times 5 = 25$\nCase 2: (2, 4)일 때\nf(1) < 4를 만족하는 f(1)은 2 (1개)\nf(3), f(5)는 각각 5개 선택 가능 $\\rightarrow 1 \\times 5 \\times 5 = 25$\nCase 3: (4, 2)일 때\nf(1) < 8을 만족하는 f(1)은 2, 4, 6 (3개)\nf(3), f(5)는 각각 5개 선택 가능 $\\rightarrow 3 \\times 5 \\times 5 = 75$\n총 함수 f의 개수 = 25 + 25 + 75 = 125",
    "originalCategory": "",
    "standardCourse": "",
    "standardUnitKey": "",
    "standardUnit": "",
    "standardUnitOrder": ""
  },
  {
    "id": 16,
    "level": "상",
    "category": "원순열",
    "content": "[도형필요] 오른쪽 그림과 같이 합동인 9개의 정사각형으로 이루어진 색칠판이 있다. 빨간색과 파란색을 포함하여 총 9가지의 서로 다른 색으로 이 색칠판을 다음 조건을 만족 시키도록 칠하려고 한다.\n(가) 주어진 9가지의 색을 모두 사용하여 칠한다.\n(나) 한 정사각형에는 한 가지 색만을 칠한다.\n(다) 빨간색과 파란색이 칠해진 두 정사각형은 꼭짓점을 공유하지 않는다.\n색칠판을 칠하는 경우의 수는 a \\times b! 이다. a+b의 값은? (단, 회전하여 일치하는 것은 같은 것으로 본다.)",
    "choices": [
      "15",
      "17",
      "19",
      "21",
      "23"
    ],
    "answer": "1",
    "solution": "[도형 검토 후 보완 필요]\n3x3 격자에서 두 칸이 꼭짓점도 공유하지 않는 위치 관계를 찾는다.\n빨간색(R)과 파란색(B)의 위치를 정하는 순서쌍의 수를 센다.\n1) R이 모서리 칸(4개)일 때 B가 들어갈 수 있는 칸은 5개 $\\rightarrow 4 \\times 5 = 20$\n2) R이 모서리가 아닌 변의 중앙 칸(4개)일 때 B가 들어갈 수 있는 칸은 3개 $\\rightarrow 4 \\times 3 = 12$\n3) R이 정중앙 칸일 때 B가 들어갈 수 있는 칸은 0개 $\\rightarrow 0$\n총 32가지 방법으로 R과 B의 위치를 정할 수 있다.\n나머지 7개의 색을 칠하는 경우의 수는 7!이다.\n3x3 정사각형은 90도씩 4번 회전 대칭이 가능하며, 9가지 색이 모두 다르므로 회전하여 겹치는 경우는 없다.\n원순열을 적용하면 전체 경우의 수는 $\\frac{32 \\times 7!}{4} = 8 \\times 7!$ 이다.\n따라서 a=8, b=7 이며 a+b = 15이다.",
    "originalCategory": "",
    "standardCourse": "",
    "standardUnitKey": "",
    "standardUnit": "",
    "standardUnitOrder": ""
  },
  {
    "id": 17,
    "level": "상",
    "category": "중복조합",
    "content": "빨간색, 파란색, 노란색 색연필이 있다. 각 색의 색연필을 적어도 하나씩 포함하여 18개 이하의 색연필을 선택하는 방법의 수는? (단, 빨간색, 파란색 색연필은 18개씩 있고 노란색 색연필은 13개 있으며, 같은 색의 색연필은 서로 구별이 되지 않는다.)",
    "choices": [
      "806",
      "826",
      "846",
      "866",
      "886"
    ],
    "answer": "1",
    "solution": "빨, 파, 노 색연필의 개수를 각각 R, B, Y라 하자. ($R\\ge1, B\\ge1, Y\\ge1$)\n$R+B+Y \\le 18$ 이고 $Y \\le 13$ 이다.\nR'=R-1, B'=B-1, Y'=Y-1 이라 하면\n$R'+B'+Y' \\le 15$ ($R',B',Y' \\ge 0$) 이고 $Y' \\le 12$ 이다.\n전체 해의 개수: $\\sum_{k=0}^{15} {}_{3}H_{k} = \\sum_{k=0}^{15} {}_{k+2}C_{2} = {}_{18}C_{3} = \\frac{18 \\times 17 \\times 16}{6} = 816$\n여기서 $Y' \\ge 13$ 인 경우를 뺀다.\n1) Y' = 13일 때 $R'+B' \\le 2$: ${}_{2}H_{0} + {}_{2}H_{1} + {}_{2}H_{2} = 1 + 2 + 3 = 6$\n2) Y' = 14일 때 $R'+B' \\le 1$: ${}_{2}H_{0} + {}_{2}H_{1} = 1 + 2 = 3$\n3) Y' = 15일 때 $R'+B' = 0$: ${}_{2}H_{0} = 1$\n제외할 경우의 수 합 = 6+3+1 = 10\n따라서 구하는 경우의 수는 816 - 10 = 806",
    "originalCategory": "",
    "standardCourse": "",
    "standardUnitKey": "",
    "standardUnit": "",
    "standardUnitOrder": ""
  },
  {
    "id": 18,
    "level": "상",
    "category": "원순열",
    "content": "문자 A, B, C, D가 각각 하나씩 적혀 있는 4개의 접시와 숫자 1, 2, 3이 각각 하나씩 적혀 있는 3개의 접시가 있다. 이 7개의 접시를 원 모양의 탁자에 일정한 간격을 두고 원형으로 놓을 때, 다음 조건을 만족시키도록 놓는 경우의 수는? (단, 회전하여 일치하는 것은 같은 것으로 본다.)\n(가) A, C 접시끼리 서로 이웃하지 않으며 B, D 접시끼리 또한 서로 이웃하지 않는다.\n(나) 숫자가 적힌 접시끼리는 서로 이웃하지 않는다.",
    "choices": [
      "72",
      "96",
      "100",
      "120",
      "136"
    ],
    "answer": "2",
    "solution": "숫자 접시가 이웃하지 않으려면 4개의 문자 접시가 만드는 4개의 사이 공간 중 3곳에 숫자 접시를 하나씩 넣어야 한다. 빈 공간 1곳에 있는 문자 접시 2개만 서로 이웃하게 된다.\n조건 (가)에 의해 A와 C는 이웃할 수 없고, B와 D도 이웃할 수 없으므로, 빈 공간은 {A, C} 또는 {B, D} 쌍을 만들어서는 안 된다.\n문자 4개를 원형으로 나열하는 기본 배열(원순열) 6가지 중:\n1) (A, B, C, D) 꼴 배열 (2가지: ABCD, ADCB): 이웃하는 쌍이 AB, BC, CD, DA 이며 금지된 AC, BD가 없다. 4개 공간 중 어느 곳을 비워도 되므로 빈 곳 선택 4가지.\n2) (A, B, D, C) 꼴 배열 (4가지: 나머지 배열): 금지된 이웃쌍(예: BD, AC 등)이 2곳 존재한다. 따라서 빈 공간으로 선택할 수 있는 안전한 곳이 2곳뿐이다.\n결과적으로 문자를 나열하고 빈 공간 1곳을 결정하는 경우의 수는:\n$(2 \\times 4) + (4 \\times 2) = 16$가지.\n선택된 3개의 공간에 숫자 1, 2, 3을 나열하는 경우의 수는 3! = 6이다.\n$\\rightarrow 16 \\times 6 = 96$",
    "originalCategory": "",
    "standardCourse": "",
    "standardUnitKey": "",
    "standardUnit": "",
    "standardUnitOrder": ""
  },
  {
    "id": 19,
    "level": "상",
    "category": "중복순열",
    "content": "다섯 개의 숫자 0, 1, 2, 3, 4 중에서 중복을 허용하여 만든 자연수를 크기가 작은 것부터 차례대로 나열할 때, 3000은 몇 번째 수인가 구하시오.",
    "choices": [],
    "answer": "375",
    "solution": "자릿수별로 개수를 누적한다.\n1자리 자연수: 1, 2, 3, 4 (4개)\n2자리 자연수: 맨 앞자리는 0이 올 수 없으므로 $4 \\times 5 = 20$개\n3자리 자연수: $4 \\times 5 \\times 5 = 100$개\n4자리 자연수 중 3000보다 작은 수는 맨 앞자리가 1 또는 2인 경우이다.\n맨 앞자리가 1인 수: $1 \\times 5 \\times 5 \\times 5 = 125$개\n맨 앞자리가 2인 수: $1 \\times 5 \\times 5 \\times 5 = 125$개\n$\\rightarrow 3000 이전의 수들의 총 개수 = 4 + 20 + 100 + 125 + 125 = 374$\n따라서 3000은 375번째 수이다.",
    "originalCategory": "",
    "standardCourse": "",
    "standardUnitKey": "",
    "standardUnit": "",
    "standardUnitOrder": ""
  },
  {
    "id": 20,
    "level": "중",
    "category": "이항정리",
    "content": "$(1+x)^{2n} = (1+x)^n \\times (1+x)^n$ 이와 같은 사실을 이용하여 $({}_{14}C_0)^2 + ({}_{14}C_1)^2 + ({}_{14}C_2)^2 + \\dots + ({}_{14}C_{14})^2$ 값을 구하시오.",
    "choices": [],
    "answer": "{}_{28}C_{14}",
    "solution": "주어진 항등식에서 n=14를 대입하면:\n$(1+x)^{28} = (1+x)^{14} \\times (1+x)^{14}$\n양변의 $x^{14}$의 계수를 비교한다.\n좌변에서 $x^{14}$의 계수는 ${}_{28}C_{14}$ 이다.\n우변에서 $x^{14}$의 계수를 구하기 위해 $(1+x)^{14}$의 항들을 서로 곱하면:\n$\\sum_{k=0}^{14} ({}_{14}C_{k} x^{k}) \\times ({}_{14}C_{14-k} x^{14-k})$ 의 계수합이 된다.\n${}_{14}C_{14-k} = {}_{14}C_{k}$ 이므로, 계수의 합은 $\\sum_{k=0}^{14} ({}_{14}C_{k})^2$ 이다.\n따라서 $({}_{14}C_{0})^2 + {}_{14}C_{1})^2 + \\dots + ({}_{14}C_{14})^2 = {}_{28}C_{14}$ 이다.",
    "originalCategory": "",
    "standardCourse": "",
    "standardUnitKey": "",
    "standardUnit": "",
    "standardUnitOrder": ""
  },
  {
    "id": 21,
    "level": "상",
    "category": "이항정리",
    "content": "다항식 4(x+a)^n의 전개식에서 x^{n-2}의 계와 다항식 (x-1)(x+a)^n의 전개식에서 x^{n-2}의 계수가 같게 되는 모든 순서쌍 (a, n)에 대하여 an의 최댓값을 구하시오. (단, a는 자연수이고, n은 n \\ge 3인 자연수이다.)",
    "choices": [],
    "answer": "45",
    "solution": "$4(x+a)^n$에서 $x^{n-2}$의 계수: $4 \\times {}_{n}C_{n-2} \\times a^2 = 4 \\times \\frac{n(n-1)}{2} a^2 = 2n(n-1)a^2$\n$(x-1)(x+a)^n = x(x+a)^n - (x+a)^n$ 이다.\n여기서 $x^{n-2}$의 계수는 $(x+a)^n$의 $x^{n-3}$항 계수에 x를 곱한 것과 $(x+a)^n$의 $x^{n-2}$항 계수에 -1을 곱한 것의 합이다.\n$\\rightarrow {}_{n}C_{n-3} a^3 - {}_{n}C_{n-2} a^2 = \\frac{n(n-1)(n-2)}{6} a^3 - \\frac{n(n-1)}{2} a^2$\n두 계수가 같으므로:\n$2n(n-1)a^2 = \\frac{n(n-1)(n-2)}{6} a^3 - \\frac{n(n-1)}{2} a^2$\n$a \\ge 1, n \\ge 3$이므로 양변을 $n(n-1)a^2$로 나눈다.\n$2 = \\frac{n-2}{6} a - \\frac{1}{2} \\rightarrow \\frac{5}{2} = \\frac{(n-2)a}{6} \\rightarrow (n-2)a = 15$\na, n은 자연수이고 $n \\ge 3$이므로 $n-2 \\ge 1$ 이다.\n(n-2, a)의 조합은 (1, 15), (3, 5), (5, 3), (15, 1) 이며 이에 따른 (n, a)는 (3, 15), (5, 5), (7, 3), (17, 1) 이다.\nan의 값을 각각 구하면 45, 25, 21, 17 이다.\n따라서 an의 최댓값은 45이다.",
    "originalCategory": "",
    "standardCourse": "",
    "standardUnitKey": "",
    "standardUnit": "",
    "standardUnitOrder": ""
  },
  {
    "id": 22,
    "level": "중",
    "category": "중복조합",
    "content": "다음 조건을 만족시키는 10 이하의 자연수 a, b, c, d, e의 모든 순서쌍 (a, b, c, d, e) 개수를 구하시오.\n(가) a \\le b \\le c < 5 < d \\le e\n(나) a는 홀수, d는 짝수이다.",
    "choices": [],
    "answer": "117",
    "solution": "조건에 따라 범위를 두 부분으로 나누어 독립적으로 계산한다.\n1) $a \\le b \\le c \\le 4$ 조건 (a는 홀수)\na가 가질 수 있는 값은 1, 3이다.\na=1일 때 $1 \\le b \\le c \\le 4$ 이므로 ${}_{4}H_{2} = {}_{5}C_{2} = 10$가지\na=3일 때 $3 \\le b \\le c \\le 4$ 이므로 ${}_{2}H_{2} = {}_{3}C_{2} = 3$가지\n(a, b, c)의 경우의 수 = 10 + 3 = 13가지\n2) $6 \\le d \\le e \\le 10$ 조건 (d는 짝수)\nd가 가질 수 있는 값은 6, 8, 10이다.\nd=6일 때 $6 \\le e \\le 10$ 이므로 5가지\nd=8일 때 $8 \\le e \\le 10$ 이므로 3가지\nd=10일 때 $10 \\le e \\le 10$ 이므로 1가지\n(d, e)의 경우의 수 = 5 + 3 + 1 = 9가지\n$\\rightarrow 전체 순서쌍 개수 = 13 \\times 9 = 117$",
    "originalCategory": "",
    "standardCourse": "",
    "standardUnitKey": "",
    "standardUnit": "",
    "standardUnitOrder": ""
  },
  {
    "id": 23,
    "level": "상",
    "category": "함수의 개수",
    "content": "집합 X = \\{1, 2, 3, 4\\}에 대하여 다음 조건을 만족시키는 함수 f : X \\to X의 개수를 구하시오.\n(가) f(1) + f(2) + f(3) + f(4)는 홀수이다.\n(나) 함수 f의 치역의 원소의 개수는 3이다.",
    "choices": [],
    "answer": "96",
    "solution": "치역의 원소가 3개이므로 정의역 4개의 원소가 대응되는 함숫값은 {x, x, y, z} (x, y, z는 서로 다른 수) 형태의 다중집합을 이룬다.\n조건 (가)에 의해 함숫값의 합 S = 2x + y + z 가 홀수이어야 한다. 2x는 항상 짝수이므로 y + z 가 홀수, 즉 y, z 중 하나는 홀수, 다른 하나는 짝수이어야 한다.\n치역의 원소 3개를 선택하는 조합에서 조건을 만족하는 경우를 찾는다.\n1) 치역이 {1, 2, 3} (홀, 짝, 홀): 중복되는 수 x가 1 또는 3일 때 S가 홀수가 된다. $\\rightarrow$ 다중집합 {1, 1, 2, 3}, {3, 3, 1, 2} (2가지)\n2) 치역이 {1, 2, 4} (홀, 짝, 짝): 중복되는 수 x가 2 또는 4일 때 S가 홀수가 된다. $\\rightarrow$ 다중집합 {2, 2, 1, 4}, {4, 4, 1, 2} (2가지)\n3) 치역이 {1, 3, 4} (홀, 홀, 짝): 중복되는 수 x가 1 또는 3일 때 S가 홀수가 된다. $\\rightarrow$ 다중집합 {1, 1, 3, 4}, {3, 3, 1, 4} (2가지)\n4) 치역이 {2, 3, 4} (짝, 홀, 짝): 중복되는 수 x가 2 또는 4일 때 S가 홀수가 된다. $\\rightarrow$ 다중집합 {2, 2, 3, 4}, {4, 4, 2, 3} (2가지)\n조건을 만족하는 다중집합의 종류는 총 8가지이다.\n각 다중집합에 대해 정의역 {1, 2, 3, 4}를 배정하는(같은 것이 있는 순열) 경우의 수는 $\\frac{4!}{2!1!1!} = 12$가지이다.\n$\\rightarrow 전체 함수 f의 개수 = 8 \\times 12 = 96$",
    "originalCategory": "",
    "standardCourse": "",
    "standardUnitKey": "",
    "standardUnit": "",
    "standardUnitOrder": ""
  }
];
