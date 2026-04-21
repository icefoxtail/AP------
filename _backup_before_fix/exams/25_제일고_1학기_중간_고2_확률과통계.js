window.examTitle = "25_제일고_1학기_중간_고2_확률과통계";
window.questionBank = [
  {
    "id": 1,
    "level": "중",
    "category": "경우의 수",
    "content": "사지선다형 문제 5개가 있다. 각 문제의 답을 하나씩 임의로 고를 때, 고를 수 있는 모든 경우의 수를 구하면? (3.7점)",
    "choices": [
      "128",
      "256",
      "512",
      "1024",
      "2048"
    ],
    "answer": "4",
    "solution": "사지선다형 5문제이므로 각 문제마다 4가지 선택지가 있다.\\n$\\therefore 4^5 = 1024$가지",
    "originalCategory": "25_제일고_1학기_중간_고2_확률과통계",
    "standardCourse": "확률과 통계",
    "standardUnitKey": "H_ST_01_01",
    "standardUnit": "여러 가지 순열",
    "standardUnitOrder": "1"
  },
  {
    "id": 2,
    "level": "중",
    "category": "확률",
    "content": "이번 시즌에서 어느 프로 농구 선수가 200번의 자유투 시도에서 140개를 성공시켰다. 이 선수가 한 번의 자유투 시도에서 성공할 확률을 구하면? (3.7점)",
    "choices": [
      "$\\frac{1}{2}$",
      "$\\frac{3}{5}$",
      "$\\frac{7}{10}$",
      "$\\frac{4}{5}$",
      "$\\frac{9}{10}$"
    ],
    "answer": "3",
    "solution": "성공 횟수 / 전체 시도 횟수 = $\\frac{140}{200} = \\frac{7}{10}$",
    "originalCategory": "25_제일고_1학기_중간_고2_확률과통계",
    "standardCourse": "확률과 통계",
    "standardUnitKey": "H_ST_02_01",
    "standardUnit": "확률의 뜻과 활용",
    "standardUnitOrder": "1"
  },
  {
    "id": 3,
    "level": "중",
    "category": "원순열",
    "content": "A와 B를 포함한 6명의 가족이 원형 탁자에 둘러앉으려고 한다. A와 B가 마주 보고 앉는 모든 경우의 수를 구하면? (3.7점)\\n(단, 회전하여 일치하는 것은 같은 것으로 본다.)",
    "choices": [
      "24",
      "26",
      "28",
      "30",
      "32"
    ],
    "answer": "1",
    "solution": "A를 고정한 후 B를 맞은편에 앉히는 경우의 수는 $1$가지이다.\\n나머지 4명의 가족을 일렬로 배열하는 경우의 수는 $4!$이다.\\n$\\therefore 1 \\times 4! = 24$가지",
    "originalCategory": "25_제일고_1학기_중간_고2_확률과통계",
    "standardCourse": "확률과 통계",
    "standardUnitKey": "H_ST_01_01",
    "standardUnit": "여러 가지 순열",
    "standardUnitOrder": "1"
  },
  {
    "id": 4,
    "level": "중",
    "category": "중복조합",
    "content": "$(a+b+c)^4$의 전개식에서 서로 다른 종류의 항의 개수를 구하면? (3.7점)",
    "choices": [
      "15",
      "18",
      "21",
      "24",
      "27"
    ],
    "answer": "1",
    "solution": "$a, b, c$ 3개의 문자 중에서 중복을 허용하여 4개를 선택하는 조합의 수와 같다.\\n$\\therefore _{3}H_{4} = _{6}C_{4} = _{6}C_{2} = 15$",
    "originalCategory": "25_제일고_1학기_중간_고2_확률과통계",
    "standardCourse": "확률과 통계",
    "standardUnitKey": "H_ST_01_02",
    "standardUnit": "중복조합과 이항정리",
    "standardUnitOrder": "2"
  },
  {
    "id": 5,
    "level": "중",
    "category": "이항정리",
    "content": "$(2x+1)^4$의 전개식에서 $x^3$의 계수를 구하면? (3.7점)",
    "choices": [
      "1",
      "8",
      "16",
      "24",
      "32"
    ],
    "answer": "5",
    "solution": "$(2x+1)^4$ 전개식의 일반항은 $_{4}C_{r} (2x)^{4-r} (1)^r$ 이다.\\n$x^3$ 항은 $4-r=3 \\implies r=1$ 일 때이므로,\\n계수는 $_{4}C_{1} \\times 2^3 = 4 \\times 8 = 32$",
    "originalCategory": "25_제일고_1학기_중간_고2_확률과통계",
    "standardCourse": "확률과 통계",
    "standardUnitKey": "H_ST_01_02",
    "standardUnit": "중복조합과 이항정리",
    "standardUnitOrder": "2"
  },
  {
    "id": 6,
    "level": "중",
    "category": "원순열",
    "content": "1부터 6까지의 자연수가 하나씩 적혀 있는 6장의 카드를 일정한 간격으로 원형으로 배치하고자 한다. 합이 11인 두 카드를 이웃하지 않도록 배열하는 경우의 수를 구하면? (3.9점)\\n(단, 회전하여 일치하는 것은 같은 것으로 본다.)",
    "choices": [
      "63",
      "66",
      "69",
      "72",
      "75"
    ],
    "answer": "4",
    "solution": "전체 경우의 수는 $(6-1)! = 5! = 120$가지이다.\\n합이 11인 두 카드의 쌍은 $\\{5, 6\\}$이다.\\n5와 6이 이웃하는 경우의 수는 이들을 하나로 묶어 배열하므로 $(5-1)! \\times 2! = 48$가지이다.\\n$\\therefore 120 - 48 = 72$",
    "originalCategory": "25_제일고_1학기_중간_고2_확률과통계",
    "standardCourse": "확률과 통계",
    "standardUnitKey": "H_ST_01_01",
    "standardUnit": "여러 가지 순열",
    "standardUnitOrder": "1"
  },
  {
    "id": 7,
    "level": "상",
    "category": "중복조합",
    "content": "두 개의 숫자 1, 2 중에서 중복을 허용하여 자연수를 만들 때, 각 자리의 숫자의 합이 10인 수의 개수를 구하면? (3.9점)",
    "choices": [
      "87",
      "89",
      "91",
      "93",
      "95"
    ],
    "answer": "2",
    "solution": "숫자 1의 개수를 $x$, 2의 개수를 $y$라 하면 $x + 2y = 10$ ($x, y$는 음이 아닌 정수)\\n(i) $y=5, x=0: \\frac{5!}{5!} = 1$\\n(ii) $y=4, x=2: \\frac{6!}{4!2!} = 15$\\n(iii) $y=3, x=4: \\frac{7!}{3!4!} = 35$\\n(iv) $y=2, x=6: \\frac{8!}{2!6!} = 28$\\n(v) $y=1, x=8: \\frac{9!}{1!8!} = 9$\\n(vi) $y=0, x=10: \\frac{10!}{10!} = 1$\\n$\\therefore 1+15+35+28+9+1 = 89$개",
    "originalCategory": "25_제일고_1학기_중간_고2_확률과통계",
    "standardCourse": "확률과 통계",
    "standardUnitKey": "H_ST_01_02",
    "standardUnit": "중복조합과 이항정리",
    "standardUnitOrder": "2"
  },
  {
    "id": 8,
    "level": "중",
    "category": "이항정리",
    "content": "$_{11}C_0 3^{11} + _{11}C_1 3^{10} + _{11}C_2 3^9 + \\dots + _{11}C_{10} 3 + _{11}C_{11}$의 값을 구하면? (3.9점)",
    "choices": [
      "$2^{18}$",
      "$2^{19}$",
      "$2^{20}$",
      "$2^{21}$",
      "$2^{22}$"
    ],
    "answer": "5",
    "solution": "이항정리 $(a+b)^n = \\sum_{r=0}^{n} {_{n}C_{r} a^{n-r} b^r}$에 의해\\n주어진 식은 $(3+1)^{11} = 4^{11}$이다.\\n$\\therefore 4^{11} = (2^2)^{11} = 2^{22}$",
    "originalCategory": "25_제일고_1학기_중간_고2_확률과통계",
    "standardCourse": "확률과 통계",
    "standardUnitKey": "H_ST_01_02",
    "standardUnit": "중복조합과 이항정리",
    "standardUnitOrder": "2"
  },
  {
    "id": 9,
    "level": "중",
    "category": "확률",
    "content": "확통이가 사과 맛 사탕 6개와 포도 맛 사탕 5개가 들어있는 상자에서 임의로 사탕 2개를 동시에 꺼낼 때, 사탕 2개가 모두 사과 맛 사탕일 확률을 구하면? (3.9점)",
    "choices": [
      "$\\frac{2}{11}$",
      "$\\frac{3}{11}$",
      "$\\frac{4}{11}$",
      "$\\frac{5}{11}$",
      "$\\frac{6}{11}$"
    ],
    "answer": "2",
    "solution": "전체 사탕 11개 중 2개를 택하는 경우의 수: $_{11}C_{2} = 55$\\n사과 맛 사탕 6개 중 2개를 택하는 경우의 수: $_{6}C_{2} = 15$\\n$\\therefore P = \\frac{15}{55} = \\frac{3}{11}$",
    "originalCategory": "25_제일고_1학기_중간_고2_확률과통계",
    "standardCourse": "확률과 통계",
    "standardUnitKey": "H_ST_02_01",
    "standardUnit": "확률의 뜻과 활용",
    "standardUnitOrder": "1"
  },
  {
    "id": 10,
    "level": "상",
    "category": "원순열",
    "content": "1에서 9까지 아홉 개의 자연수를 모두 사용하여 아래의 9개의 빈칸을 모두 채우려고 한다. 음영이 칠해진 가운데에는 소수를 넣어서, 숫자를 채우는 경우의 수가 $7! \\times n$이라고 할 때 $n$의 값으로 알맞은 것을 고르면? (4.0점)<br><div style='text-align:center; margin:10px 0;'><svg width='120' height='120' viewBox='0 0 120 120' xmlns='http://www.w3.org/2000/svg'><rect x='40' y='40' width='40' height='40' fill='#a0a0a0'/><path d='M40 0v120M80 0v120M0 40h120M0 80h120' stroke='black' stroke-width='1'/><rect x='0' y='0' width='120' height='120' fill='none' stroke='black' stroke-width='2'/></svg></div>(단, 한 칸에는 하나의 숫자만 넣고, 회전하여 일치하는 것은 같은 것으로 본다.)",
    "choices": [
      "4",
      "6",
      "8",
      "10",
      "12"
    ],
    "answer": "3",
    "solution": "음영 칠해진 가운데 들어갈 소수 $\\{2, 3, 5, 7\\}$를 고르는 경우의 수는 4가지이다.\\n나머지 8칸에 숫자를 정사각형 모양으로 배열할 때, 원순열을 적용하면 $90^\\circ$ 회전 시 4가지 경우가 중복되므로 배열하는 경우의 수는 $\\frac{8!}{4}$이다.\\n$\\therefore 4 \\times \\frac{8!}{4} = 8! = 7! \\times 8$\\n따라서 $n=8$이다.",
    "originalCategory": "25_제일고_1학기_중간_고2_확률과통계",
    "standardCourse": "확률과 통계",
    "standardUnitKey": "H_ST_01_01",
    "standardUnit": "여러 가지 순열",
    "standardUnitOrder": "1"
  },
  {
    "id": 11,
    "level": "상",
    "category": "중복순열",
    "content": "여섯 개의 숫자 0, 1, 2, 3, 4, 5에서 중복을 허용하여 4개를 택하여 네 자리의 자연수를 만들 때, 숫자 2와 4를 각각 한 개 이상 포함하는 수의 개수를 구하면? (4.0점)",
    "choices": [
      "272",
      "274",
      "276",
      "278",
      "280"
    ],
    "answer": "1",
    "solution": "전체 네 자리 수의 개수: $5 \\times 6^3 = 1080$\\n조건 $A$: 2를 포함하지 않는 네 자리 수 $\\implies 4 \\times 5^3 = 500$\\n조건 $B$: 4를 포함하지 않는 네 자리 수 $\\implies 4 \\times 5^3 = 500$\\n$A \\cap B$: 2와 4를 모두 포함하지 않는 네 자리 수 $\\implies 3 \\times 4^3 = 192$\\n2 또는 4를 포함하지 않는 수의 개수: $500 + 500 - 192 = 808$\\n$\\therefore 1080 - 808 = 272$",
    "originalCategory": "25_제일고_1학기_중간_고2_확률과통계",
    "standardCourse": "확률과 통계",
    "standardUnitKey": "H_ST_01_01",
    "standardUnit": "여러 가지 순열",
    "standardUnitOrder": "1"
  },
  {
    "id": 12,
    "level": "중",
    "category": "이항정리",
    "content": "다항식 $\\frac{1}{2}(x+2y)^n$의 전개식에서 $x^3y^2$의 계수를 $m$이라 할 때, $m+n$의 값을 구하면? (4.0점)\\n(단, $n$은 자연수이다.)",
    "choices": [
      "23",
      "24",
      "25",
      "26",
      "27"
    ],
    "answer": "3",
    "solution": "$x^3y^2$ 항이 존재하려면 차수의 합인 $n$은 $3+2=5$여야 한다.\\n일반항은 $\\frac{1}{2} \\times {_{5}C_{r} x^{5-r} (2y)^r}$이다.\\n$y^2$ 항을 구하기 위해 $r=2$를 대입하면 계수 $m = \\frac{1}{2} \\times _{5}C_{2} \\times 2^2 = \\frac{1}{2} \\times 10 \\times 4 = 20$\\n$\\therefore m+n = 20 + 5 = 25$",
    "originalCategory": "25_제일고_1학기_중간_고2_확률과통계",
    "standardCourse": "확률과 통계",
    "standardUnitKey": "H_ST_01_02",
    "standardUnit": "중복조합과 이항정리",
    "standardUnitOrder": "2"
  },
  {
    "id": 13,
    "level": "상",
    "category": "중복조합",
    "content": "다음 조건을 만족시키는 정수 $a, b, c, d$의 모든 순서쌍 $(a, b, c, d)$의 개수를 구하면? (4.0점)\\n(가) $a+b+c+4d=9$\\n(나) $a \\ge 2, b \\ge -2, c \\ge 1, d \\ge 0$",
    "choices": [
      "49",
      "53",
      "57",
      "61",
      "65"
    ],
    "answer": "4",
    "solution": "$a' = a-2, b' = b+2, c' = c-1$이라 하면 $a', b', c' \\ge 0$이다.\\n주어진 방정식에 대입하면 $(a'+2) + (b'-2) + (c'+1) + 4d = 9 \\implies a'+b'+c'+4d = 8$\\n(i) $d=0: a'+b'+c'=8 \\implies _{3}H_{8} = _{10}C_{2} = 45$\\n(ii) $d=1: a'+b'+c'=4 \\implies _{3}H_{4} = _{6}C_{2} = 15$\\n(iii) $d=2: a'+b'+c'=0 \\implies _{3}H_{0} = 1$\\n$\\therefore 45 + 15 + 1 = 61$",
    "originalCategory": "25_제일고_1학기_중간_고2_확률과통계",
    "standardCourse": "확률과 통계",
    "standardUnitKey": "H_ST_01_02",
    "standardUnit": "중복조합과 이항정리",
    "standardUnitOrder": "2"
  },
  {
    "id": 14,
    "level": "중",
    "category": "경우의 수",
    "content": "좌표평면 위를 움직이는 점 P는 원점에서 출발하여 1회에 $x$축 또는 $y$축의 양의 방향으로 1만큼씩 이동한다. 5회 이하로 움직인다고 할 때, 점 P가 도착할 수 있는 제1사분면 위의 서로 다른 점의 개수를 구하면? (4.1점)",
    "choices": [
      "10",
      "14",
      "18",
      "22",
      "26"
    ],
    "answer": "1",
    "solution": "이동 횟수를 $k$($1 \\le k \\le 5$)라 하면, 도달하는 점 $(x, y)$는 $x+y=k$ ($x, y$는 자연수)를 만족한다.\\n(i) $k=2: (1,1) \\implies 1$개\\n(ii) $k=3: (1,2), (2,1) \\implies 2$개\\n(iii) $k=4: (1,3), (2,2), (3,1) \\implies 3$개\\n(iv) $k=5: (1,4), (2,3), (3,2), (4,1) \\implies 4$개\\n$\\therefore 1+2+3+4 = 10$개",
    "originalCategory": "25_제일고_1학기_중간_고2_확률과통계",
    "standardCourse": "확률과 통계",
    "standardUnitKey": "H_ST_01_01",
    "standardUnit": "여러 가지 순열",
    "standardUnitOrder": "1"
  },
  {
    "id": 15,
    "level": "중",
    "category": "원순열",
    "content": "31부터 38까지의 8개의 자연수가 적힌 8장의 카드를 일정한 간격을 두고 원형으로 배열하고자 한다. 이웃한 두 수의 곱이 모두 짝수가 되도록 배열하는 경우의 수를 구하면? (4.1점)\\n(단, 회전하여 일치하는 것은 같은 것으로 본다.)",
    "choices": [
      "140",
      "144",
      "148",
      "152",
      "156"
    ],
    "answer": "2",
    "solution": "이웃한 두 수의 곱이 짝수가 되려면 홀수끼리 이웃하지 않아야 한다.\\n8장의 카드 중 짝수 $\\{32, 34, 36, 38\\}$ 4개와 홀수 $\\{31, 33, 35, 37\\}$ 4개를 교대로 배열해야 한다.\\n짝수 4개를 먼저 원형으로 배열: $(4-1)! = 6$가지\\n그 사이의 4개 빈자리에 홀수 4개를 배열: $4! = 24$가지\\n$\\therefore 6 \\times 24 = 144$가지",
    "originalCategory": "25_제일고_1학기_중간_고2_확률과통계",
    "standardCourse": "확률과 통계",
    "standardUnitKey": "H_ST_01_01",
    "standardUnit": "여러 가지 순열",
    "standardUnitOrder": "1"
  },
  {
    "id": 16,
    "level": "상",
    "category": "경우의 수",
    "content": "중복을 허용하여 0, 1, 2, 3, 4, 5로 만든 자연수를 크기가 작은 수부터 차례로 나열할 때, 4213은 몇 번째 수인지 구하면? (4.1점)",
    "choices": [
      "943",
      "944",
      "945",
      "946",
      "947"
    ],
    "answer": "3",
    "solution": "1자리 수: 5개 / 2자리 수: $5 \\times 6 = 30$개 / 3자리 수: $5 \\times 6^2 = 180$개 (누적 215개)\\n4자리 수:\\n- 1, 2, 3으로 시작: $3 \\times 6^3 = 648$개\\n- 40, 41로 시작: $2 \\times 6^2 = 72$개\\n- 420으로 시작: $6^1 = 6$개\\n- 4210, 4211, 4212: 3개\\n그다음 수가 4213이다.\\n$\\therefore 215 + 648 + 72 + 6 + 3 + 1 = 945$번째",
    "originalCategory": "25_제일고_1학기_중간_고2_확률과통계",
    "standardCourse": "확률과 통계",
    "standardUnitKey": "H_ST_01_01",
    "standardUnit": "여러 가지 순열",
    "standardUnitOrder": "1"
  },
  {
    "id": 17,
    "level": "상",
    "category": "확률",
    "content": "집합 $X=\\{1, 2, 3, 4\\}$의 공집합이 아닌 모든 부분집합 15개 중에서 임의로 서로 다른 부분집합을 뽑아 임의로 일렬로 나열하고, 나열된 순서대로 $A, B$라 할 때, $A \\subset B$일 확률은? (4.3점)",
    "choices": [
      "$\\frac{2}{21}$",
      "$\\frac{1}{7}$",
      "$\\frac{4}{21}$",
      "$\\frac{5}{21}$",
      "$\\frac{2}{7}$"
    ],
    "answer": "4",
    "solution": "전체 경우의 수: $15 \\times 14 = 210$\\n$B$의 원소 개수 $k$에 따른 $A$의 개수 (단, $A \\ne B, A \\ne \\emptyset$)\\n- $k=2: _{4}C_{2} \\times (2^2-2) = 6 \\times 2 = 12$\\n- $k=3: _{4}C_{3} \\times (2^3-2) = 4 \\times 6 = 24$\\n- $k=4: _{4}C_{4} \\times (2^4-2) = 1 \\times 14 = 14$\\n순서쌍의 총 개수: $12 + 24 + 14 = 50$\\n$\\therefore P = \\frac{50}{210} = \\frac{5}{21}$",
    "originalCategory": "25_제일고_1학기_중간_고2_확률과통계",
    "standardCourse": "확률과 통계",
    "standardUnitKey": "H_ST_02_01",
    "standardUnit": "확률의 뜻과 활용",
    "standardUnitOrder": "1"
  },
  {
    "id": 18,
    "level": "상",
    "category": "같은 것이 있는 순열",
    "content": "3개의 서로 다른 인형과 똑같은 신발 3켤레와 똑같은 모자 3개를 가지고 있는 사람이 있다. 인형의 두 발에 신발을 신기고 모자를 씌우려고 한다. 각 인형은 모두 먼저 왼쪽 신발을 신긴 다음에 오른쪽 신발을 신기고 마지막으로 모자를 씌운다고 한다. 3개의 인형에 양쪽 신발을 신기고, 모자를 씌우는 순서를 정하는 모든 경우의 수를 구하면? (4.4점)\\n(단, 각 인형에서 신발과 모자를 연속하여 신기거나 씌우지 않아도 된다.)",
    "choices": [
      "1640",
      "1650",
      "1660",
      "1670",
      "1680"
    ],
    "answer": "5",
    "solution": "각 인형 A, B, C에 대해 수행해야 할 작업(왼발, 오른발, 모자)은 순서가 정해져 있다.\\n전체 9개의 작업을 나열하는 경우의 수에서 각 인형별 3개 작업의 순서를 고정한다.\\n이는 같은 것이 있는 순열의 수와 같다.\\n$\\therefore \\frac{9!}{3!3!3!} = \\frac{362880}{6 \\times 6 \\times 6} = 1680$가지",
    "originalCategory": "25_제일고_1학기_중간_고2_확률과통계",
    "standardCourse": "확률과 통계",
    "standardUnitKey": "H_ST_01_01",
    "standardUnit": "여러 가지 순열",
    "standardUnitOrder": "1"
  },
  {
    "id": 19,
    "level": "상",
    "category": "중복조합",
    "content": "볼펜 4개와 연필 3개를 4명의 학생 $A, B, C, D$에게 다음 규칙에 따라 남김없이 나누어 주는 경우의 수를 구하면? (4.5점)\\n(단, 볼펜과 연필은 각각 구별되지 않고, 볼펜과 연필을 받지 못하는 학생이 있을 수 있다.)\\n(가) 두 학생 $A, B$가 받은 볼펜과 연필 개수의 합은 홀수이다.\\n(나) 학생 $C$가 받은 볼펜과 연필 개수는 학생 $D$가 받는 볼펜과 연필 개수의 3배이다.",
    "choices": [
      "32",
      "36",
      "40",
      "44",
      "48"
    ],
    "answer": "2",
    "solution": "조건 (나)에 의해 가능한 $D$와 $C$의 총 개수 합은 $4D$이다. 전체가 7개이므로 $D=1, C=3$인 경우만 가능하다. (이때 $A+B=3$으로 홀수 조건 자동 만족)\\n$D$가 볼펜 1개인 경우 ($D=0$ 연필 1개인 경우도 동일 구조)\\n$C$의 구성 $\\times$ ($A, B$ 분배)\\n- $C(3,0) \\implies (A,B)$는 남은 (0,3) 분배: $2H0 \\times 2H3 = 4$\\n- $C(2,1) \\implies (A,B)$는 남은 (1,2) 분배: $2H1 \\times 2H2 = 6$\\n- $C(1,2) \\implies (A,B)$는 남은 (2,1) 분배: $2H2 \\times 2H1 = 6$\\n- $C(0,3) \\implies (A,B)$는 남은 (3,0) 분배: $2H3 \\times 2H0 = 4$\\n소계 20가지. $D$가 연필 1개인 경우 계산 시 16가지(제한 조건 발생).\\n$\\therefore 20 + 16 = 36$가지",
    "originalCategory": "25_제일고_1학기_중간_고2_확률과통계",
    "standardCourse": "확률과 통계",
    "standardUnitKey": "H_ST_01_02",
    "standardUnit": "중복조합과 이항정리",
    "standardUnitOrder": "2"
  },
  {
    "id": 20,
    "level": "상",
    "category": "경우의 수",
    "content": "다음 조건을 만족시키는 다섯 개의 자연수 $a, b, c, d, e$를 일렬로 나열하는 경우의 수를 구하면? (4.4점)\\n(가) $a+b+c+d+e=8$\\n(나) $a \\times b \\times c \\times d \\times e$는 4의 배수이다.",
    "choices": [
      "11",
      "12",
      "13",
      "14",
      "15"
    ],
    "answer": "5",
    "solution": "자연수이므로 최솟값은 1이다. 합이 8이 되는 자연수 조합 중 곱이 4의 배수인 경우:\\n(i) $\\{4, 1, 1, 1, 1\\}$: 나열 수 $\\frac{5!}{4!} = 5$가지\\n(ii) $\\{2, 2, 2, 1, 1\\}$: 나열 수 $\\frac{5!}{3!2!} = 10$가지\\n$\\therefore 5 + 10 = 15$가지",
    "originalCategory": "25_제일고_1학기_중간_고2_확률과통계",
    "standardCourse": "확률과 통계",
    "standardUnitKey": "H_ST_01_01",
    "standardUnit": "여러 가지 순열",
    "standardUnitOrder": "1"
  },
  {
    "id": 21,
    "level": "중",
    "category": "이항정리",
    "content": "$(1+2x) + (1+2x)^2 + (1+2x)^3 + \\dots + (1+2x)^{10}$의 전개식에서 $x^3$의 계수를 구하는 과정을 구체적으로 서술하시오.\\n(6점, 부분 점수 있음.)",
    "choices": [],
    "answer": "2640",
    "solution": "주어진 식은 첫째항이 $(1+2x)$, 공비가 $(1+2x)$인 등비수열의 합이다.\\n$S = \\frac{(1+2x)\\{(1+2x)^{10}-1\\}}{(1+2x)-1} = \\frac{(1+2x)^{11}-(1+2x)}{2x}$\\n$x^3$의 계수는 분자의 $x^4$ 계수를 2로 나눈 값이다.\\n분자의 $x^4$ 계수는 $_{11}C_{4} \\times 2^4 = 330 \\times 16 = 5280$\\n$\\therefore \\frac{5280}{2} = 2640$",
    "originalCategory": "25_제일고_1학기_중간_고2_확률과통계",
    "standardCourse": "확률과 통계",
    "standardUnitKey": "H_ST_01_02",
    "standardUnit": "중복조합과 이항정리",
    "standardUnitOrder": "2"
  },
  {
    "id": 22,
    "level": "상",
    "category": "경우의 수",
    "content": "주머니 속에 다섯 개의 숫자 1, 2, 3, 4, 5가 각각 하나씩 적혀 있는 공 5개가 들어있다. 이 주머니에서 1개의 공을 꺼내어 공에 적힌 수를 확인한 후 다시 넣는다고 할 때, 꺼낸 공의 수가 3 이하이면 나온 수의 점수를 얻고, 4 이상이면 0점을 얻는다. 이 과정을 4번 반복할 때, 꺼낸 공에 적혀 있는 수를 차례로 $a, b, c, d$라 하자. 얻은 네 점수의 합이 4가 되는 모든 순서쌍 $(a, b, c, d)$의 개수를 구하는 과정을 구체적으로 서술하시오.\\n(7점, 부분 점수 있음.)",
    "choices": [],
    "answer": "97",
    "solution": "점수가 0점인 경우는 $\\{4, 5\\}$ (2가지), 1~3점은 각각 $\\{1\\}, \\{2\\}, \\{3\\}$ (각 1가지)이다.\\n네 점수의 합이 4가 되는 경우:\\n- (3, 1, 0, 0): $\\frac{4!}{2!} \\times (1 \\times 1 \\times 2^2) = 12 \\times 4 = 48$\\n- (2, 2, 0, 0): $\\frac{4!}{2!2!} \\times (1 \\times 1 \\times 2^2) = 6 \\times 4 = 24$\\n- (2, 1, 1, 0): $\\frac{4!}{2!} \\times (1 \\times 1 \\times 1 \\times 2^1) = 12 \\times 2 = 24$\\n- (1, 1, 1, 1): $\\frac{4!}{4!} \\times 1^4 = 1$\\n$\\therefore 48 + 24 + 24 + 1 = 97$개",
    "originalCategory": "25_제일고_1학기_중간_고2_확률과통계",
    "standardCourse": "확률과 통계",
    "standardUnitKey": "H_ST_01_01",
    "standardUnit": "여러 가지 순열",
    "standardUnitOrder": "1"
  },
  {
    "id": 23,
    "level": "상",
    "category": "중복조합",
    "content": "집합 $X=\\{1, 2, 3, 4, 5, 6\\}$에 대하여 다음 조건을 만족시키는 함수 $f : X \\to X$의 개수를 구하는 과정을 구체적으로 서술하시오.\\n(7점, 부분 점수 있음.)\\n(가) $f(1) \\times f(6)$의 값이 4의 약수이다.\\n(나) $2 f(1) \\le f(2) \\le f(3) \\le f(4) \\le f(5) \\le 2 f(6)$",
    "choices": [],
    "answer": "87",
    "solution": "$f(1) \\times f(6) \\in \\{1, 2, 4\\}$이고 조건 (나)를 만족해야 한다.\\n- $f(1)=1, f(6)=1 \\implies 2 \\le \\dots \\le 2: _{1}H_{4} = 1$\\n- $f(1)=1, f(6)=2 \\implies 2 \\le \\dots \\le 4: _{3}H_{4} = 15$\\n- $f(1)=1, f(6)=4 \\implies 2 \\le \\dots \\le 8$: 공역이 6이므로 $2..6$에서 중복조합 $\\implies _{5}H_{4} = 70$\\n- $f(1)=2, f(6)=2 \\implies 4 \\le \\dots \\le 4: _{1}H_{4} = 1$\\n나머지 조합은 조건 (나)에서 모순이 발생한다.\\n$\\therefore 1 + 15 + 70 + 1 = 87$개",
    "originalCategory": "25_제일고_1학기_중간_고2_확률과통계",
    "standardCourse": "확률과 통계",
    "standardUnitKey": "H_ST_01_02",
    "standardUnit": "중복조합과 이항정리",
    "standardUnitOrder": "2"
  }
];
