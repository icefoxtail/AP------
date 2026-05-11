window.examTitle = "25_순천매산고_1학기_기말_고1_공통수학1";

window.questionBank = [
  {
    id: 1,
    level: "하",
    category: "순열과 조합",
    originalCategory: "순열과 조합",
    standardCourse: "공통수학1",
    standardUnitKey: "H22-C-08",
    standardUnit: "순열과 조합",
    standardUnitOrder: 8,
    content: "${}_{5}P_{2} + 4!$의 값은? [3.8점]",
    choices: [
      "42",
      "44",
      "46",
      "48",
      "50"
    ],
    answer: "②",
    solution: "[키포인트]\\n순열의 수 ${}_{n}P_{r} = n(n-1)\\cdots(n-r+1)$과 계승 $n! = n(n-1)\\cdots 1$을 계산한다.\\n\\n조건 정리\\n- ${}_{5}P_{2}$: 5개에서 2개를 택하여 일렬로 나열하는 수\\n- $4!$: 4개 전체를 일렬로 나열하는 수\\n\\n풀이 과정\\n1) ${}_{5}P_{2} = 5 \\times 4 = 20$ 이다.\\n2) $4! = 4 \\times 3 \\times 2 \\times 1 = 24$ 이다.\\n3) 따라서 ${}_{5}P_{2} + 4! = 20 + 24 = 44$ 이다.\\n\\n결론\\n따라서 정답은 ②이다."
  },
  {
    id: 2,
    level: "하",
    category: "행렬과 그 연산",
    originalCategory: "행렬과 그 연산",
    standardCourse: "공통수학1",
    standardUnitKey: "H22-C-09",
    standardUnit: "행렬과 그 연산",
    standardUnitOrder: 9,
    content: "행렬 $\\begin{pmatrix} a \\\\ b \\end{pmatrix}$은 몇 행 몇 열의 행렬인지 구하면? [3.8점]",
    choices: [
      "$1 \\times 1$",
      "$1 \\times 2$",
      "$1 \\times 3$",
      "$2 \\times 1$",
      "$2 \\times 2$"
    ],
    answer: "④",
    solution: "[키포인트]\\n행렬의 크기는 (가로줄의 개수) $\\times$ (세로줄의 개수)로 나타낸다.\\n\\n조건 정리\\n- 가로줄(행)의 개수: $a, b$가 각각 한 줄씩 총 2줄\\n- 세로줄(열)의 개수: 1줄\\n\\n풀이 과정\\n주어진 행렬 $\\begin{pmatrix} a \\\\ b \\end{pmatrix}$는 성분이 세로로 2개 나열되어 있으므로 2개의 행을 가지고, 가로로는 1줄이므로 1개의 열을 가진다.\\n따라서 $2 \\times 1$ 행렬이다.\\n\\n결론\\n따라서 정답은 ④이다."
  },
  {
    id: 3,
    level: "중",
    category: "행렬과 그 연산",
    originalCategory: "행렬과 그 연산",
    standardCourse: "공통수학1",
    standardUnitKey: "H22-C-09",
    standardUnit: "행렬과 그 연산",
    standardUnitOrder: 9,
    content: "두 행렬 $A = \\begin{pmatrix} 2 & 0 \\\\ 2 & 5 \\end{pmatrix}, B = \\begin{pmatrix} 1 & 9 \\\\ 1 & 0 \\end{pmatrix}$에 대하여 행렬 $A - B$의 모든 성분의 합은? [3.9점]",
    choices: [
      "$-1$",
      "$-2$",
      "$-3$",
      "$-4$",
      "$-5$"
    ],
    answer: "②",
    solution: "[키포인트]\\n행렬의 뺄셈은 같은 위치에 있는 성분끼리 계산한다.\\n\\n조건 정리\\n$A = \\begin{pmatrix} 2 & 0 \\\\ 2 & 5 \\end{pmatrix}$, $B = \\begin{pmatrix} 1 & 9 \\\\ 1 & 0 \\end{pmatrix}$\\n\\n풀이 과정\\n1) $A - B = \\begin{pmatrix} 2-1 & 0-9 \\\\ 2-1 & 5-0 \\end{pmatrix} = \\begin{pmatrix} 1 & -9 \\\\ 1 & 5 \\end{pmatrix}$ 이다.\\n2) 모든 성분의 합을 구하면 $1 + (-9) + 1 + 5 = -2$ 이다.\\n\\n결론\\n따라서 정답은 ②이다."
  },
  {
    id: 4,
    level: "중",
    category: "순열과 조합",
    originalCategory: "순열과 조합",
    standardCourse: "공통수학1",
    standardUnitKey: "H22-C-08",
    standardUnit: "순열과 조합",
    standardUnitOrder: 8,
    content: "수학 동아리의 회원 모집에 남학생 5명, 여학생 4명이 지원하였다. 이 지원자 중에서 남학생 3명, 여학생 2명을 뽑는 경우의 수는? [4.0점]",
    choices: [
      "60",
      "50",
      "40",
      "30",
      "20"
    ],
    answer: "①",
    solution: "[키포인트]\\n서로 다른 $n$개에서 $r$개를 순서를 고려하지 않고 뽑는 조합의 수 ${}_{n}C_{r}$을 이용한다.\\n\\n조건 정리\\n- 남학생 5명 중 3명을 뽑는 경우: ${}_{5}C_{3}$\\n- 여학생 4명 중 2명을 뽑는 경우: ${}_{4}C_{2}$\\n\\n풀이 과정\\n1) 남학생을 뽑는 경우의 수: ${}_{5}C_{3} = {}_{5}C_{2} = \\frac{5 \\times 4}{2 \\times 1} = 10$\\n2) 여학생을 뽑는 경우의 수: ${}_{4}C_{2} = \\frac{4 \\times 3}{2 \\times 1} = 6$\\n3) 남학생과 여학생을 동시에 뽑으므로 곱의 법칙을 적용한다.\\n따라서 $10 \\times 6 = 60$ 이다.\\n\\n결론\\n따라서 정답은 ①이다."
  },
  {
    id: 5,
    level: "중",
    category: "여러 가지 부등식",
    originalCategory: "여러 가지 부등식",
    standardCourse: "공통수학1",
    standardUnitKey: "H22-C-06",
    standardUnit: "여러 가지 방정식과 부등식",
    standardUnitOrder: 6,
    content: "연립부등식 $\\begin{cases} 2x+2 > -x-4 \\\\ 2-2x \\ge x-1 \\end{cases}$을 만족시키는 모든 정수 $x$의 개수는? [4.1점]",
    choices: [
      "1",
      "2",
      "3",
      "4",
      "5"
    ],
    answer: "③",
    solution: "[키포인트]\\n각 일차부등식의 해를 구한 뒤 공통 범위를 찾는다.\\n\\n조건 정리\\n1) $2x + 2 > -x - 4$\\n2) $2 - 2x \\ge x - 1$\\n\\n풀이 과정\\n1) 첫 번째 부등식: $3x > -6 \\implies x > -2$\\n2) 두 번째 부등식: $3 \\ge 3x \\implies x \\le 1$\\n3) 공통 범위는 $-2 \\lt x \\le 1$ 이다.\\n이 범위를 만족하는 정수 $x$는 $-1, 0, 1$ 이다.\\n따라서 개수는 3개이다.\\n\\n결론\\n따라서 정답은 ③이다."
  },
  {
    id: 6,
    level: "중",
    category: "여러 가지 방정식",
    originalCategory: "여러 가지 방정식",
    standardCourse: "공통수학1",
    standardUnitKey: "H22-C-06",
    standardUnit: "여러 가지 방정식과 부등식",
    standardUnitOrder: 6,
    content: "연립방정식 $\\begin{cases} x+y+xy = 7k \\\\ 3x+3y-xy = 9k \\end{cases}$가 오직 한 쌍의 해를 갖도록 하는 양수 $k$의 값이 $\\frac{q}{p}$일 때, $p+q$의 값은? (단, $p, q$는 서로소인 자연수) [4.2점]",
    choices: [
      "5",
      "7",
      "9",
      "11",
      "13"
    ],
    answer: "②",
    solution: "[키포인트]\\n두 식의 합과 차를 이용해 $x+y$와 $xy$에 관한 정보를 얻고, 이차방정식의 판별식을 활용한다.\\n\\n조건 정리\\n연립방정식을 $A+B, A-B$ 형태로 정리한다.\\n\\n풀이 과정\\n1) 두 식을 더하면: $4(x+y) = 16k \\implies x+y = 4k$\\n2) $x+y=4k$를 첫 번째 식에 대입하면: $4k+xy = 7k \\implies xy = 3k$\\n3) $x, y$를 근으로 하는 $t$에 관한 이차방정식은 $t^2 - 4kt + 3k = 0$ 이다.\\n4) 오직 한 쌍의 해를 가지므로 판별식 $D=0$ 이어야 한다.\\n$D/4 = (2k)^2 - 3k = 4k^2 - 3k = k(4k-3) = 0$\\n5) $k$는 양수이므로 $k = \\frac{3}{4}$ 이다.\\n6) 따라서 $p=4, q=3$ 이고 $p+q = 4+3 = 7$ 이다.\\n\\n결론\\n따라서 정답은 ②이다."
  },
  {
    id: 7,
    level: "중",
    category: "여러 가지 부등식",
    originalCategory: "여러 가지 부등식",
    standardCourse: "공통수학1",
    standardUnitKey: "H22-C-06",
    standardUnit: "여러 가지 방정식과 부등식",
    standardUnitOrder: 6,
    content: "$x$에 대한 연립부등식 $\\begin{cases} \\frac{x+10}{5} \\ge \\frac{4}{3} \\\\ 2x \\lt 2a-3-x \\end{cases}$을 만족시키는 모든 정수 $x$의 합이 $-6$이 되도록 하는 모든 자연수 $a$의 곱은? [4.3점]",
    choices: [
      "2",
      "3",
      "4",
      "5",
      "6"
    ],
    answer: "⑤",
    solution: "[키포인트]\\n각 부등식의 범위를 구하고, 수직선 위에서 정수들의 합이 $-6$이 되는 구간을 찾는다.\\n\\n조건 정리\\n- 부등식 1: $3x+30 \\ge 20 \\implies x \\ge -\\frac{10}{3} \\approx -3.33$\\n- 부등식 2: $3x \\lt 2a-3 \\implies x \\lt \\frac{2a-3}{3}$\\n\\n풀이 과정\\n1) 만족하는 정수는 $-3$부터 시작한다.\\n2) 정수의 합이 $-6$이 되려면: $(-3) + (-2) + (-1) + 0 = -6$ 이다.\\n3) 즉, 정수 $0$은 포함되고 $1$은 포함되지 않아야 한다.\\n4) 따라서 $0 \\lt \\frac{2a-3}{3} \\le 1$ 범위를 만족해야 한다.\\n- $0 \\lt 2a-3 \\le 3$\\n- $3 \\lt 2a \\le 6 \\implies 1.5 \\lt a \\le 3$\\n5) 자연수 $a$는 $2, 3$ 이다.\\n6) 모든 자연수 $a$의 곱은 $2 \\times 3 = 6$ 이다.\\n\\n결론\\n따라서 정답은 ⑤이다."
  },
  {
    id: 8,
    level: "중",
    category: "여러 가지 부등식",
    originalCategory: "여러 가지 부등식",
    standardCourse: "공통수학1",
    standardUnitKey: "H22-C-06",
    standardUnit: "여러 가지 방정식과 부등식",
    standardUnitOrder: 6,
    content: "부등식 $|2x-3| \\ge |x^2-4x+5|$를 만족시키는 모든 정수 $x$값의 합은? [4.4점]",
    choices: [
      "9",
      "10",
      "11",
      "12",
      "13"
    ],
    answer: "①",
    solution: "[키포인트]\\n$x^2-4x+5 = (x-2)^2+1 \\gt 0$임을 파악하여 절댓값을 벗긴다.\\n\\n조건 정리\\n- $|2x-3| \\ge x^2-4x+5$\\n- 이는 $-(2x-3) \\le x^2-4x+5 \\le 2x-3$가 아니라, $|A| \\ge B$ 형태이므로 $A \\ge B$ 또는 $A \\le -B$이다.\\n\\n풀이 과정\\n1) $x^2-4x+5 \\le 2x-3$: $x^2-6x+8 \\le 0 \\implies (x-2)(x-4) \\le 0 \\implies 2 \\le x \\le 4$\\n2) $x^2-4x+5 \\le -(2x-3)$: $x^2-2x+2 \\le 0 \\implies (x-1)^2+1 \\le 0$ (해 없음)\\n3) 따라서 범위는 $2 \\le x \\le 4$ 이다.\\n4) 정수 $x$는 $2, 3, 4$ 이며, 그 합은 $2+3+4=9$ 이다.\\n\\n결론\\n따라서 정답은 ①이다."
  },
  {
    id: 9,
    level: "상",
    category: "여러 가지 부등식",
    originalCategory: "여러 가지 부등식",
    standardCourse: "공통수학1",
    standardUnitKey: "H22-C-06",
    standardUnit: "여러 가지 방정식과 부등식",
    standardUnitOrder: 6,
    content: "부등식 $(k-3)x^2+(2k-6)x-k+9 \\gt 0$이 모든 실수 $x$에 대하여 성립하도록 하는 정수 $k$의 최댓값과 최솟값의 곱은? [4.4점]",
    choices: [
      "12",
      "13",
      "14",
      "15",
      "16"
    ],
    answer: "④",
    solution: "[키포인트]\\n최고차항의 계수가 문자인 경우, $0$일 때와 아닐 때로 나누어 모든 실수에서 성립할 조건을 구한다.\\n\\n조건 정리\\n- $k=3$일 때: $0x^2 + 0x - 3 + 9 = 6 \\gt 0$ 이므로 모든 $x$에 대해 성립한다. (최솟값 후보)\\n- $k \\ne 3$일 때: 이차부등식이 항상 $0$보다 크려면 아래로 볼록하고 판별식 $D \\lt 0$이어야 한다.\\n\\n풀이 방향 설정\\n1) $k-3 \\gt 0 \implies k \\gt 3$\\n2) $D/4 = (k-3)^2 - (k-3)(-k+9) \\lt 0$ 임을 이용하여 $k$ 범위를 구한다.\\n\\n풀이 과정\\n1) 판별식 계산: $(k-3)(k-3 - (-k+9)) = (k-3)(2k-12) \\lt 0$\\n2) 해를 구하면 $3 \\lt k \\lt 6$ 이다.\\n3) $k=3$일 때의 성립 조건을 포함하면 전체 범위는 $3 \\le k \\lt 6$ 이다.\\n4) 가능한 정수 $k$는 $3, 4, 5$ 이다.\\n5) 최댓값은 $5$, 최솟값은 $3$이므로 곱은 $3 \\times 5 = 15$ 이다.\\n\\n결론\\n따라서 정답은 ④이다."
  },
  {
    id: 10,
    level: "중",
    category: "경우의 수",
    originalCategory: "경우의 수",
    standardCourse: "공통수학1",
    standardUnitKey: "H22-C-07",
    standardUnit: "여러 가지 방정식과 부등식",
    standardUnitOrder: 7,
    content: "'3·6·9 게임'은 참가자들이 돌아가며 자연수를 1부터 차례로 말하되 3, 6, 9가 들어가 있는 수는 말하지 않는 게임이다. 예를 들면 3, 13, 60, 396, 462, 900 등은 말하지 않아야 한다. '3·6·9 게임'을 할 때, 1부터 555까지의 자연수 중 말하지 않아야 하는 수의 개수는? [4.5점]",
    choices: [
      "321",
      "324",
      "327",
      "330",
      "333"
    ],
    answer: "③",
    solution: "[키포인트]\\n여사건(3, 6, 9가 하나도 포함되지 않은 수)의 개수를 전체에서 뺀다.\\n\\n조건 정리\\n- 전체 개수: 555개\\n- 사용할 수 있는 숫자: {0, 1, 2, 4, 5, 7, 8} (총 7개)\\n\\n풀이 과정\\n1) 1~555 중 3, 6, 9가 없는 수의 개수를 구한다.\\n- 한 자리 수: 1, 2, 4, 5, 7, 8 (6개)\\n- 두 자리 수: 십의 자리(6개: 0 제외), 일의 자리(7개) = 6 \\times 7 = 42개\\n- 세 자리 수 (100~499 중): 백의 자리(3개: 1, 2, 4), 십의 자리(7개), 일의 자리(7개) = 3 \\times 7 \\times 7 = 147개\\n- 세 자리 수 (500~555 중): 500~549는 백의 자리(1개: 5), 십의 자리(4개: 0, 1, 2, 4), 일의 자리(7개) = 1 \\times 4 \\times 7 = 28개, 550~555는 550, 551, 552, 554, 555 (5개)\\n2) 여사건 총합: 6 + 42 + 147 + 28 + 5 = 228개\\n3) 구하는 개수: 555 - 228 = 327개\\n\\n결론\\n따라서 정답은 ③이다."
  },
  {
    id: 11,
    level: "상",
    category: "행렬",
    originalCategory: "행렬",
    standardCourse: "공통수학1",
    standardUnitKey: "H22-C-10",
    standardUnit: "행렬",
    standardUnitOrder: 10,
    content: "두 실수 $x, y$에 대하여 두 행렬 $A, B$를 $A = \\begin{pmatrix} 1 & x \\\\ -2 & 0 \\end{pmatrix}, B = \\begin{pmatrix} -2 & y \\\\ 0 & x \\end{pmatrix}$라 하자. $A^2-B^2 = (A-B)(A+B)$를 만족시킬 때, 행렬 $(A-B)(A^2+AB+B^2)$의 모든 성분의 합은? [4.6점]",
    choices: [
      "21",
      "23",
      "25",
      "27",
      "29"
    ],
    answer: "정답 없음",
    solution: "[키포인트]\\n$A^2-B^2 = (A-B)(A+B)$가 성립할 조건은 교환법칙 $AB=BA$가 성립하는 것임을 이용한다.\\n\\n조건 정리\\n- $AB = \\begin{pmatrix} 1 & x \\\\ -2 & 0 \\end{pmatrix} \\begin{pmatrix} -2 & y \\\\ 0 & x \\end{pmatrix} = \\begin{pmatrix} -2 & y+x^2 \\\\ 4 & -2y \\end{pmatrix}$\\n- $BA = \\begin{pmatrix} -2 & y \\\\ 0 & x \\end{pmatrix} \\begin{pmatrix} 1 & x \\\\ -2 & 0 \\end{pmatrix} = \\begin{pmatrix} -2-2y & -2x \\\\ -2x & 0 \\end{pmatrix}$\\n\\n풀이 방향 설정\\n1) 성분 비교를 통해 $x, y$를 구한다.\\n2) $AB=BA$이므로 $(A-B)(A^2+AB+B^2) = A^3 - B^3$ 임을 활용한다.\\n\\n풀이 과정\\n1) $4 = -2x \\implies x = -2$, $-2y = 0 \\implies y = 0$ 이다.\\n2) $A = \\begin{pmatrix} 1 & -2 \\\\ -2 & 0 \\end{pmatrix}, B = \\begin{pmatrix} -2 & 0 \\\\ 0 & -2 \\end{pmatrix} = -2E$ 이다.\\n3) 구하는 값은 $A^3 - (-2E)^3 = A^3 + 8E$ 이다.\\n4) 케일리-해밀턴 정리: $A^2 - A - 4E = O \\implies A^2 = A + 4E$\\n5) $A^3 = A(A+4E) = A^2 + 4A = (A+4E) + 4A = 5A + 4E$\\n6) $A^3 + 8E = 5A + 12E = \\begin{pmatrix} 5 & -10 \\\\ -10 & 0 \\end{pmatrix} + \\begin{pmatrix} 12 & 0 \\\\ 0 & 12 \\end{pmatrix} = \\begin{pmatrix} 17 & -10 \\\\ -10 & 12 \\end{pmatrix}$\\n7) 성분의 합: $17 + (-10) + (-10) + 12 = 9$ 이다. (보기 중 정답 없음)\\n\\n결론\\n따라서 정답은 없다."
  },
  {
    id: 12,
    level: "중",
    category: "행렬과 도형",
    originalCategory: "행렬과 도형",
    standardCourse: "공통수학1",
    standardUnitKey: "H22-C-10",
    standardUnit: "행렬",
    standardUnitOrder: 10,
    content: "실수 $x, y$가 $\\begin{pmatrix} x & y \\end{pmatrix} \\begin{pmatrix} 1 & -2 \\\\ -2 & 4 \\end{pmatrix} \\begin{pmatrix} x \\\\ y \\end{pmatrix} = (0)$을 만족할 때, $\\begin{pmatrix} x & y \\end{pmatrix} \\begin{pmatrix} 1 & -5 \\\\ 2 & 4 \\end{pmatrix} \\begin{pmatrix} x \\\\ y \\end{pmatrix} = (84)$를 만족한다. $x^2+y^2$의 최댓값은? [4.6점]",
    choices: [
      "30",
      "90",
      "150",
      "210",
      "270"
    ],
    answer: "④",
    solution: "[키포인트]\\n행렬의 곱을 전개하여 $x, y$에 관한 관계식을 얻고, 이를 두 번째 식에 대입한다.\\n\\n조건 정리\\n1) $\\begin{pmatrix} x & y \\end{pmatrix} \\begin{pmatrix} 1 & -2 \\\\ -2 & 4 \\end{pmatrix} \\begin{pmatrix} x \\\\ y \\end{pmatrix} = 0 \\implies x^2 - 4xy + 4y^2 = 0$\\n2) $\\begin{pmatrix} x & y \\end{pmatrix} \\begin{pmatrix} 1 & -5 \\\\ 2 & 4 \\end{pmatrix} \\begin{pmatrix} x \\\\ y \\end{pmatrix} = 84 \\implies x^2 - 3xy + 4y^2 = 84$\\n\\n풀이 과정\\n1) 첫 번째 식에서 $(x-2y)^2 = 0$ 이므로 $x = 2y$ 이다.\\n2) 두 번째 식에 $x = 2y$ 를 대입하면 $(2y)^2 - 3(2y)y + 4y^2 = 84$ 이다.\\n3) $4y^2 - 6y^2 + 4y^2 = 2y^2 = 84$ 이므로 $y^2 = 42$ 이다.\\n4) 구하는 값은 $x^2 + y^2 = (2y)^2 + y^2 = 5y^2$ 이다.\\n5) 따라서 $5 \\times 42 = 210$ 이다.\\n\\n결론\\n따라서 정답은 ④이다."
  },
  {
    id: 13,
    level: "중",
    category: "합의 법칙과 곱의 법칙",
    originalCategory: "경우의 수",
    standardCourse: "공통수학1",
    standardUnitKey: "H22-C-07",
    standardUnit: "합의 법칙과 곱의 법칙",
    standardUnitOrder: 7,
    content: "아래 그림과 같은 ㉮, ㉯, ㉰, ㉱, ㉲, ㉳의 여섯 개의 영역으로 이루어진 지도를 서로 다른 여섯 가지 색의 전부 또는 일부를 사용하여 칠하려고 한다. 다음 조건을 만족시키는 경우의 수를 구하시오. [4.7점]\\n<div class=\"question-table-wrap\">\\n  <table class=\"question-table\">\\n    <tr>\\n      <td>\\n        (가) 한 영역에는 한 가지 색을 칠하며, 같은 색을 중복하여 칠해도 좋으나 인접한 영역은 서로 다른 색으로 칠한다.\\n        <br>(나) 영역 ㉮에 색칠된 색은 나머지 다섯 개의 영역에 색칠된 색과 겹치지 않는다.\\n      </td>\\n    </tr>\\n  </table>\\n</div>\\n<svg width=\"220\" height=\"180\" viewBox=\"0 0 220 180\" xmlns=\"http://www.w3.org/2000/svg\">\\n  <rect x=\"10\" y=\"10\" width=\"200\" height=\"160\" fill=\"none\" stroke=\"black\" stroke-width=\"1\"/>\\n  <path d=\"M 60,40 Q 110,30 160,40 L 170,90 Q 110,100 50,90 Z\" fill=\"none\" stroke=\"black\" stroke-width=\"1\"/>\\n  <path d=\"M 50,90 Q 110,100 170,90 L 160,140 Q 110,150 60,140 Z\" fill=\"none\" stroke=\"black\" stroke-width=\"1\"/>\\n  <path d=\"M 110,40 L 110,140\" fill=\"none\" stroke=\"black\" stroke-width=\"1\"/>\\n  <circle cx=\"110\" cy=\"90\" r=\"20\" fill=\"white\" stroke=\"black\" stroke-width=\"1\"/>\\n  <text x=\"110\" y=\"94\" font-size=\"10px\" text-anchor=\"middle\" font-family=\"serif\">㉮</text>\\n  <text x=\"85\" y=\"65\" font-size=\"10px\" text-anchor=\"middle\" font-family=\"serif\">㉯</text>\\n  <text x=\"135\" y=\"65\" font-size=\"10px\" text-anchor=\"middle\" font-family=\"serif\">㉰</text>\\n  <text x=\"135\" y=\"115\" font-size=\"10px\" text-anchor=\"middle\" font-family=\"serif\">㉱</text>\\n  <text x=\"85\" y=\"115\" font-size=\"10px\" text-anchor=\"middle\" font-family=\"serif\">㉲</text>\\n  <text x=\"190\" y=\"155\" font-size=\"10px\" text-anchor=\"middle\" font-family=\"serif\">㉳</text>\\n</svg>",
    choices: [
      "2520",
      "2540",
      "2560",
      "2580",
      "2600"
    ],
    answer: "①",
    solution: "[키포인트]\\n영역 ㉮에 사용된 색을 제외한 나머지 색들로 인접한 영역의 색이 다르도록 칠하는 방법의 수를 구한다.\\n\\n조건 정리\\n- 영역 ㉮에 칠한 색은 다른 영역에 사용할 수 없다.\\n- 인접한 영역은 서로 다른 색을 칠해야 한다.\\n- 영역 ㉳는 ㉯, ㉰, ㉱, ㉲ 네 영역과 모두 인접해 있다.\\n\\n풀이 과정\\n1) 영역 ㉮를 칠하는 경우의 수는 $6$가지이다.\\n2) ㉮를 제외한 나머지 다섯 영역 ㉯, ㉰, ㉱, ㉲, ㉳를 남은 5가지 색으로 칠한다.\\n- 외곽 영역 ㉳를 먼저 칠하는 경우의 수는 $5$가지이다.\\n- 남은 4가지 색으로 고리 모양의 네 영역 ㉯, ㉰, ㉱, ㉲를 칠한다.\\n- ㉯와 ㉱의 색이 같은 경우: ㉯(4가지) $\\times$ ㉰(3가지) $\\times$ ㉱(1가지) $\\times$ ㉲(3가지) = $36$가지\\n- ㉯와 ㉱의 색이 다른 경우: ㉯(4가지) $\\times$ ㉱(3가지) $\\times$ ㉰(2가지) $\\times$ ㉲(2가지) = $48$가지\\n- 고리 모양 네 영역을 칠하는 총 방법의 수는 $36 + 48 = 84$가지이다.\\n3) 전체 경우의 수는 각 단계의 곱이므로 $6 \\times 5 \\times 84 = 2520$이다.\\n\\n결론\\n따라서 정답은 ①이다."
  },
  {
    id: 14,
    level: "중",
    category: "행렬",
    originalCategory: "행렬",
    standardCourse: "공통수학1",
    standardUnitKey: "H22-C-10",
    standardUnit: "행렬",
    standardUnitOrder: 10,
    content: "이차 정사각행렬 $A$에 대해 $A\\begin{pmatrix} 1 \\\\ 1 \\end{pmatrix} = \\begin{pmatrix} 2 \\\\ 7 \\end{pmatrix}, A^2\\begin{pmatrix} 1 \\\\ 1 \\end{pmatrix} = \\begin{pmatrix} 4 \\\\ 39 \\end{pmatrix}$일 때, 행렬 $A^3$의 모든 성분의 합은? [4.8점]",
    choices: [
      "203",
      "205",
      "207",
      "209",
      "211"
    ],
    answer: "⑤",
    solution: "[키포인트]\\n$A = \\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}$로 두고 주어진 벡터 방정식을 연립하여 $A$를 구한다.\\n\\n조건 정리\\n1) $a+b=2, c+d=7$\\n2) $A\\begin{pmatrix} 2 \\\\ 7 \\end{pmatrix} = \\begin{pmatrix} 4 \\\\ 39 \\end{pmatrix} \\implies 2a+7b=4, 2c+7d=39$\\n\\n풀이 과정\\n1) $2a+7(2-a)=4 \\implies -5a=-10 \\implies a=2, b=0$\\n2) $2c+7(7-c)=39 \\implies -5c=-10 \\implies c=2, d=5$\\n3) $A = \\begin{pmatrix} 2 & 0 \\\\ 2 & 5 \\end{pmatrix}$ 이다.\\n4) $A^2 = \\begin{pmatrix} 4 & 0 \\\\ 14 & 25 \\end{pmatrix}$, $A^3 = \\begin{pmatrix} 8 & 0 \\\\ 78 & 125 \\end{pmatrix}$ 이다.\\n5) 모든 성분의 합은 $8 + 0 + 78 + 125 = 211$ 이다.\\n\\n결론\\n따라서 정답은 ⑤이다."
  },
  {
    id: 15,
    level: "중",
    category: "이차함수",
    originalCategory: "이차함수",
    standardCourse: "공통수학1",
    standardUnitKey: "H22-C-05",
    standardUnit: "이차방정식과 이차함수",
    standardUnitOrder: 5,
    content: "$x, y$에 관한 연립방정식 $\\begin{cases} y = x^2 - 2|x| + 1 \\\\ y = x + k \\end{cases}$의 서로 다른 실근의 개수가 4가 되게 하는 상수 $k$의 범위가 $\\alpha \\lt k \\lt \\beta$ 일 때, $\\alpha + \\beta$의 값은? [4.9점]",
    choices: [
      "$\\frac{1}{4}$",
      "$\\frac{3}{4}$",
      "$\\frac{5}{4}$",
      "$\\frac{7}{4}$",
      "$\\frac{9}{4}$"
    ],
    answer: "④",
    solution: "[키포인트]\\n함수 $y = x^2 - 2|x| + 1$의 그래프와 직선 $y = x + k$의 교점의 개수를 파악한다.\\n\\n조건 정리\\n$x^2 - 2|x| + 1$은 $x \\ge 0$에서 $(x-1)^2$, $x \\lt 0$에서 $(x+1)^2$인 W자 형태의 그래프이다.\\n\\n풀이 과정\\n1) 직선이 왼쪽 봉우리와 접할 때와 $y$절편을 지날 때를 기준으로 삼는다.\\n2) 왼쪽 봉우리에 접할 때: $x^2+2x+1 = x+k \\implies x^2+x+(1-k)=0$, $D = 1-4(1-k) = 4k-3=0 \\implies k = 3/4$\\n3) y절편 $(0, 1)$을 지날 때: $1 = 0 + k \\implies k = 1$\\n4) 네 점에서 만나기 위한 조건은 직선이 왼쪽 봉우리에 접할 때보다 크고, y축 위의 뾰족점$(0, 1)$을 지날 때보다 작아야 한다. 따라서 $3/4 \\lt k \\lt 1$ 이다.\\n5) $\\alpha = 3/4, \\beta = 1$ 이므로 $\\alpha + \\beta = 7/4$ 이다.\\n\\n결론\\n따라서 정답은 ④이다."
  },
  {
    id: 16,
    level: "상",
    category: "순열과 조합",
    originalCategory: "순열과 조합",
    standardCourse: "공통수학1",
    standardUnitKey: "H22-C-08",
    standardUnit: "순열과 조합",
    standardUnitOrder: 8,
    content: "〈단답형 1〉\\n매산이는 학교 축제 프로그램을 구성하려고 한다. 밴드 경연 대회에 참가 신청서를 제출한 8개 팀 중에서 공연할 6개 팀을 뽑는 경우의 수를 구하시오. [4점]",
    choices: [],
    answer: "28",
    solution: "[키포인트]\\n전체 8개 팀 중에서 순서에 상관없이 6개 팀을 선택하는 조합의 수를 구한다.\\n\\n조건 정리\\n- 전체 팀 수: $n = 8$\\n- 선택할 팀 수: $r = 6$\\n\\n풀이 방향 설정\\n조합의 성질 ${}_{n}C_{r} = {}_{n}C_{n-r}$을 이용하여 계산을 간소화한다.\\n\\n풀이 과정\\n1) 구하는 경우의 수는 ${}_{8}C_{6}$ 이다.\\n2) 이는 ${}_{8}C_{2}$와 같으므로 다음과 같이 계산한다.\\n3) ${}_{8}C_{2} = \\frac{8 \\times 7}{2 \\times 1} = 28$\\n\\n결론\\n따라서 구하는 경우의 수는 28이다."
  },
  {
    id: 17,
    level: "상",
    category: "행렬",
    originalCategory: "행렬",
    standardCourse: "공통수학1",
    standardUnitKey: "H22-C-10",
    standardUnit: "행렬",
    standardUnitOrder: 10,
    content: "〈단답형 2〉\\n이차정사각행렬 $A$의 $(i, j)$성분 $a_{ij}$가 $a_{ij} = i-j$ ($i=1, 2, j=1, 2$)이다. 행렬 $A+A^2+A^3+\\cdots+A^{2020}$의 모든 성분의 합을 구하시오. [5점]",
    choices: [],
    answer: "0",
    solution: "[키포인트]\\n주어진 규칙으로 행렬 $A$를 구하고, 거듭제곱의 주기성을 확인한다.\\n\\n조건 정리\\n- $a_{11}=0, a_{12}=-1, a_{21}=1, a_{22}=0$\\n- $A = \\begin{pmatrix} 0 & -1 \\\\ 1 & 0 \\end{pmatrix}$\\n\\n풀이 방향 설정\\n1) $A^2, A^3, A^4$를 계산하여 주기성을 찾는다.\\n2) 2020개의 항의 합을 주기에 맞춰 묶어 계산한다.\\n\\n풀이 과정\\n1) $A^2 = \\begin{pmatrix} 0 & -1 \\\\ 1 & 0 \\end{pmatrix} \\begin{pmatrix} 0 & -1 \\\\ 1 & 0 \\end{pmatrix} = \\begin{pmatrix} -1 & 0 \\\\ 0 & -1 \\end{pmatrix} = -E$\\n2) $A^3 = -A$, $A^4 = E$ 이다.\\n3) 따라서 $A+A^2+A^3+A^4 = A - E - A + E = O$ (영행렬)이다.\\n4) 4개의 항마다 합이 영행렬이 되며, $2020 = 4 \\times 505$이므로 전체 합은 영행렬이다.\\n5) 영행렬의 모든 성분의 합은 0이다.\\n\\n결론\\n따라서 구하는 값은 0이다."
  },
  {
    id: 18,
    level: "상",
    category: "이차부등식",
    originalCategory: "이차부등식",
    standardCourse: "공통수학1",
    standardUnitKey: "H22-C-06",
    standardUnit: "여러 가지 방정식과 부등식",
    standardUnitOrder: 6,
    content: "〈단답형 3〉\\n최고차항의 계수가 양수인 이차함수 $f(x)$와, 최고차항의 계수가 음수인 이차함수 $g(x)$가 다음 조건을 만족시킨다.\\n(가) 연립방정식 $\\begin{cases} |f(x)| = 1 \\\\ |g(x)| = 1 \\end{cases}$ 의 서로 다른 실근의 개수는 3이고, 세 근의 합은 3이다.\\n(나) 방정식 $\{ |f(x)| - 1 \} \{ |g(x)| - 1 \} = 0$ 의 서로 다른 실근의 개수는 4이고 네 근의 합은 8이다.\\n$f(2) \\lt f(1)$일 때, 부등식 $f(x) \\le g(x)$의 해를 구하시오. [6점]",
    choices: [],
    answer: "-1/3 \\le x \\le 3",
    solution: "[키포인트]\\n함수의 대칭성과 절댓값 함수의 근의 성질을 이용하여 $f(x), g(x)$의 식을 구한다.\\n\\n조건 정리\\n- (가), (나)에 의해 $|f(x)|=1$과 $|g(x)|=1$의 실근의 합집합은 4개(합 8), 교집합은 3개(합 3)이다.\\n\\n풀이 과정\\n1) $g(x)$는 위로 볼록하며 실근 3개를 가지므로 꼭짓점의 $y$좌표가 $1$이다. 대칭성에 의해 교집합 3근의 평균이 대칭축이 되므로 $x=1$이 대칭축이다.\\n2) 교집합 3근 중 가운데 근이 $1$이므로 나머지 두 근은 $1-d, 1+d$ 이다.\\n3) 합집합 4근은 $f(x)$의 근이며, 대칭축을 가지므로 4근의 평균이 대칭축 $x=2$ 가 된다.\\n4) $1$이 근이므로 대칭인 $3$도 근이고, 교집합의 합이 $3$이므로 $1-d=-1, 1+d=3$이다. 즉 교집합은 $\\{-1, 1, 3\\}$이며 합집합은 $\\{-1, 1, 3, 5\\}$이다.\\n5) $g(x) = -1/2(x-1)^2 + 1, f(x) = 1/4(x-2)^2 - 5/4$ 로 식을 세울 수 있다.\\n6) $f(x) \\le g(x)$ 를 풀면 $3x^2 - 8x - 3 \\le 0$ 이 되므로 $-1/3 \\le x \\le 3$ 이다.\\n\\n결론\\n따라서 구하는 해는 $-1/3 \\le x \\le 3$ 이다."
  },
  {
    id: 19,
    level: "상",
    category: "여러 가지 방정식",
    originalCategory: "여러 가지 방정식",
    standardCourse: "공통수학1",
    standardUnitKey: "H22-C-06",
    standardUnit: "여러 가지 방정식과 부등식",
    standardUnitOrder: 6,
    questionType: "서술형",
    layoutTag: "subjective-2up",
    content: "〈서술형 1〉\\n사차방정식 $x^4+ax^3+bx^2+cx+d=0$가 $\\sqrt{2}+i$를 근으로 가질 때, 유리수 $a, b, c, d$에 대하여 $a+b+c+d$의 값을 구하는 과정을 서술하시오. (단, $i=\\sqrt{-1}$) [10점]",
    choices: [],
    answer: "7",
    solution: "[키포인트]\\n계수가 유리수인 다항방정식에서 무리수 또는 허수 근이 주어지면 켤레근의 성질을 이용한다.\\n\\n조건 정리\\n- 근: $\\sqrt{2}+i$\\n- 계수가 유리수이므로 $\\sqrt{2}-i, -\\sqrt{2}+i, -\\sqrt{2}-i$가 모두 근이 되어야 한다.\\n\\n풀이 과정\\n1) $\\sqrt{2}+i$와 $\\sqrt{2}-i$를 근으로 갖는 이차식: $\\{x-(\\sqrt{2}+i)\\}\\{x-(\\sqrt{2}-i)\\} = (x-\\sqrt{2})^2+1 = x^2-2\\sqrt{2}x+3$\\n2) 계수가 유리수가 되기 위해 $2\\sqrt{2}$를 소거할 수 있는 켤레 인자인 $x^2+2\\sqrt{2}x+3$이 필요하다.\\n3) 사차방정식은 $(x^2-2\\sqrt{2}x+3)(x^2+2\\sqrt{2}x+3) = (x^2+3)^2 - (2\\sqrt{2}x)^2 = x^4+6x^2+9-8x^2 = x^4-2x^2+9$ 이다.\\n4) 계수를 비교하면 $a=0, b=-2, c=0, d=9$ 이다.\\n5) 따라서 $a+b+c+d = 0-2+0+9 = 7$ 이다.\\n\\n결론\\n따라서 구하는 값은 7이다."
  },
  {
    id: 20,
    level: "중",
    category: "경우의 수",
    originalCategory: "경우의 수",
    standardCourse: "공통수학1",
    standardUnitKey: "H22-C-09",
    standardUnit: "순열과 조합",
    standardUnitOrder: 9,
    questionType: "서술형",
    layoutTag: "subjective-2up",
    content: "〈서술형 2〉\\n1~100까지의 자연수가 각각 하나씩 적힌 100장의 카드가 들어있는 주머니가 있다. 이 주머니에서 두 장의 카드를 동시에 꺼낼 때, 다음 조건을 만족시키는 경우의 수를 구하는 과정을 서술하시오.\\n(가) 카드에 적힌 두 수는 서로소이다.\\n(나) 카드에 적힌 두 수는 각각 60과 서로소이다. [10점]",
    choices: [],
    answer: "319",
    solution: "[키포인트]\\n60과 서로소인 수들의 집합을 구한 후, 그 안에서 서로소가 아닌 쌍을 제외한다.\\n\\n조건 정리\\n- $60 = 2^2 \\times 3 \\times 5$\\n- 60과 서로소인 수는 2, 3, 5의 배수가 아닌 수이다.\\n\\n풀이 과정\\n1) 1~100 중 2, 3, 5의 배수가 아닌 수의 개수는 $100 - (50 + 33 + 20 - 16 - 10 - 6 + 3) = 26$개이다.\\n2) 이 26개 중에서 2개를 선택하는 경우의 수는 ${}_{26}C_{2} = 325$ 이다.\\n3) (가) 조건에 따라 뽑힌 두 수도 서로소여야 한다. 2, 3, 5의 배수가 아니면서 공약수를 가질 수 있는 수는 7의 배수들뿐이다.\\n4) 집합 내 7의 배수는 7, 49, 77, 91 (4개)이며, 이들 중 2개를 고르는 경우는 서로소가 아니다.\\n5) 제외할 쌍의 수는 ${}_{4}C_{2} = 6$ 이다.\\n6) 따라서 $325 - 6 = 319$ 이다.\\n\\n결론\\n따라서 구하는 경우의 수는 319이다."
  }
];