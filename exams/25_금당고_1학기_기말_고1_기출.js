window.examTitle = "25_금당고_1학기_기말_고1_기출";

window.questionBank = [
  {
    id: 1,
    level: "중",
    category: "행렬",
    originalCategory: "행렬",
    standardCourse: "공통수학1",
    standardUnitKey: "H22-C-10",
    standardUnit: "행렬",
    standardUnitOrder: 10,
    content: "$2 \\times 2$행렬 $A$의 $(i,j)$성분 $a_{ij}=i^2+j^2$일 때, 모든 성분의 합은? [3.5점]",
    choices: [
      "16",
      "17",
      "18",
      "19",
      "20"
    ],
    answer: "⑤",
    solution: "[키포인트] 행렬의 각 성분을 직접 구하여 합한다.\\n조건 정리: $a_{ij}=i^2+j^2$이고 $A$는 $2 \\times 2$ 행렬이므로 $i, j \\in \\{1, 2\\}$이다.\\n풀이 과정:\\n각 성분을 구하면\\n$a_{11} = 1^2 + 1^2 = 2$\\n$a_{12} = 1^2 + 2^2 = 5$\\n$a_{21} = 2^2 + 1^2 = 5$\\n$a_{22} = 2^2 + 2^2 = 8$\\n모든 성분의 합은 $2 + 5 + 5 + 8 = 20$이다.\\n결론: 따라서 정답은 ⑤이다."
  },
  {
    id: 2,
    level: "중",
    category: "경우의 수",
    originalCategory: "경우의 수",
    standardCourse: "공통수학1",
    standardUnitKey: "H22-C-09",
    standardUnit: "경우의 수",
    standardUnitOrder: 9,
    content: "300의 약수의 개수는? [3.5점]",
    choices: [
      "10",
      "12",
      "14",
      "16",
      "18"
    ],
    answer: "⑤",
    solution: "[키포인트] 소인수분해를 이용하여 약수의 개수를 구한다.\\n조건 정리: 300을 소인수분해한다.\\n풀이 과정:\\n$300 = 3 \\times 100 = 3 \\times 2^2 \\times 5^2 = 2^2 \\times 3^1 \\times 5^2$\\n약수의 개수는 각 소인수의 지수에 1을 더하여 곱한 값이므로\\n$(2+1) \\times (1+1) \\times (2+1) = 3 \\times 2 \\times 3 = 18$개이다.\\n결론: 따라서 정답은 ⑤이다."
  },
  {
    id: 3,
    level: "중",
    category: "여러 가지 방정식",
    originalCategory: "여러 가지 방정식",
    standardCourse: "공통수학1",
    standardUnitKey: "H22-C-07",
    standardUnit: "여러 가지 방정식",
    standardUnitOrder: 7,
    content: "연립방정식 $\\begin{cases} x+y=1 \\\\ x^2+xy=7 \\end{cases}$ 의 해를 $x=\\alpha, y=\\beta$라 할 때, $\\alpha-\\beta$의 값은? [3.5점]",
    choices: [
      "11",
      "12",
      "13",
      "14",
      "15"
    ],
    answer: "③",
    solution: "[키포인트] 두 번째 식을 인수분해하여 첫 번째 식을 대입한다.\\n조건 정리: $x+y=1$, $x^2+xy=7$\\n풀이 과정:\\n두 번째 식을 인수분해하면 $x(x+y)=7$이다.\\n첫 번째 식에서 $x+y=1$이므로 이를 대입하면 $x(1)=7$, 즉 $x=7$이다.\\n$x=7$을 $x+y=1$에 대입하면 $7+y=1$에서 $y=-6$이다.\\n따라서 $\\alpha=7, \\beta=-6$이므로 $\\alpha-\\beta = 7 - (-6) = 13$이다.\\n결론: 따라서 정답은 ③이다."
  },
  {
    id: 4,
    level: "중",
    category: "여러 가지 부등식",
    originalCategory: "여러 가지 부등식",
    standardCourse: "공통수학1",
    standardUnitKey: "H22-C-08",
    standardUnit: "여러 가지 부등식",
    standardUnitOrder: 8,
    content: "$x$에 대한 부등식 $|x-1| \\le 5$를 만족시키는 정수 $x$의 개수는? [3.5점]",
    choices: [
      "7",
      "8",
      "9",
      "10",
      "11"
    ],
    answer: "⑤",
    solution: "[키포인트] 절댓값 부등식의 성질을 이용하여 해의 범위를 구한다.\\n조건 정리: $|x-1| \\le 5$\\n풀이 과정:\\n$|x-1| \\le 5 \\iff -5 \\le x-1 \\le 5$\\n양변에 1을 더하면 $-4 \\le x \\le 6$이다.\\n이를 만족하는 정수 $x$는 $-4, -3, -2, -1, 0, 1, 2, 3, 4, 5, 6$으로 총 11개이다.\\n결론: 따라서 정답은 ⑤이다."
  },
  {
    id: 5,
    level: "중",
    category: "경우의 수",
    originalCategory: "경우의 수",
    standardCourse: "공통수학1",
    standardUnitKey: "H22-C-09",
    standardUnit: "경우의 수",
    standardUnitOrder: 9,
    content: "${}_8P_2$의 값은? [3.7점]",
    choices: [
      "32",
      "40",
      "48",
      "56",
      "64"
    ],
    answer: "④",
    solution: "[키포인트] 순열의 계산 공식을 이용한다.\\n조건 정리: ${}_nP_r = n(n-1)\\cdots(n-r+1)$\\n풀이 과정:\\n${}_8P_2 = 8 \\times 7 = 56$이다.\\n결론: 따라서 정답은 ④이다."
  },
  {
    id: 6,
    level: "중",
    category: "행렬",
    originalCategory: "행렬",
    standardCourse: "공통수학1",
    standardUnitKey: "H22-C-10",
    standardUnit: "행렬",
    standardUnitOrder: 10,
    content: "다음 등식이 성립할 때, 실수 $x, y$에 대해 $x+y$값은? [3.7점]\\n$\\begin{pmatrix} 5 & -1 \\\\ -4 & x \\end{pmatrix} = \\begin{pmatrix} y+1 & -1 \\\\ -4 & -5 \\end{pmatrix}$",
    choices: [
      "-2",
      "-1",
      "0",
      "1",
      "2"
    ],
    answer: "②",
    solution: "[키포인트] 두 행렬이 같을 조건은 대응하는 각 성분이 모두 같은 것이다.\\n조건 정리: 행렬의 각 성분을 비교한다.\\n풀이 과정:\\n$(1,1)$ 성분을 비교하면 $5 = y+1$이므로 $y=4$이다.\\n$(2,2)$ 성분을 비교하면 $x = -5$이다.\\n따라서 $x+y = -5 + 4 = -1$이다.\\n결론: 따라서 정답은 ②이다."
  },
  {
    id: 7,
    level: "중",
    category: "여러 가지 방정식",
    originalCategory: "여러 가지 방정식",
    standardCourse: "공통수학1",
    standardUnitKey: "H22-C-07",
    standardUnit: "여러 가지 방정식",
    standardUnitOrder: 7,
    content: "$x$에 대한 삼차방정식 $x^3-7x^2+ax-8=0$의 한 근이 2일 때, 실수 $a$와 나머지 두 근의 합은? [3.8점]",
    choices: [
      "19",
      "20",
      "21",
      "22",
      "23"
    ],
    answer: "①",
    solution: "[키포인트] 주어진 근을 대입하여 미정계수를 구하고, 근과 계수의 관계를 이용한다.\\n조건 정리: 한 근이 2이므로 방정식에 $x=2$를 대입한다.\\n풀이 과정:\\n$x=2$를 대입하면 $8 - 28 + 2a - 8 = 0$, $2a = 28$이므로 $a=14$이다.\\n삼차방정식의 세 근의 합은 근과 계수의 관계에 의해 $-(-7)/1 = 7$이다.\\n세 근 중 하나가 2이므로, 나머지 두 근의 합은 $7 - 2 = 5$이다.\\n따라서 $a$와 나머지 두 근의 합은 $14 + 5 = 19$이다.\\n결론: 따라서 정답은 ①이다."
  },
  {
    id: 8,
    level: "중",
    category: "경우의 수",
    originalCategory: "경우의 수",
    standardCourse: "공통수학1",
    standardUnitKey: "H22-C-09",
    standardUnit: "경우의 수",
    standardUnitOrder: 9,
    content: "어느 지역에서 열린 배구 대회에 참가한 $n$개의 팀이 서로 다른 팀과 모두 한번씩 경기를 하였더니 총 66번 경기를 하였다. 이때 $n$의 값은? [3.8점]",
    choices: [
      "10",
      "11",
      "12",
      "13",
      "14"
    ],
    answer: "③",
    solution: "[키포인트] $n$개의 팀이 서로 한 번씩 경기하는 횟수는 조합을 이용해 구한다.\\n조건 정리: 전체 경기 수는 ${}_nC_2 = 66$이다.\\n풀이 과정:\\n${}_nC_2 = \\frac{n(n-1)}{2} = 66$\\n$n(n-1) = 132$\\n연속된 두 자연수의 곱이 132가 되는 수는 $12 \\times 11$이므로 $n=12$이다.\\n결론: 따라서 정답은 ③이다."
  },
  {
    id: 9,
    level: "중",
    category: "여러 가지 부등식",
    originalCategory: "여러 가지 부등식",
    standardCourse: "공통수학1",
    standardUnitKey: "H22-C-08",
    standardUnit: "여러 가지 부등식",
    standardUnitOrder: 8,
    content: "$x$에 대한 부등식 $|x-3| + 2|x-5| \\le 4$를 만족시키는 정수 $x$값들의 합은? [4점]",
    choices: [
      "10",
      "12",
      "14",
      "16",
      "18"
    ],
    answer: "②",
    solution: "[키포인트] 절댓값 기호 안의 식의 값이 0이 되는 $x$를 기준으로 범위를 나누어 푼다.\\n조건 정리: $x=3, x=5$를 기준으로 범위를 세 가지로 나눈다.\\n풀이 과정:\\n(i) $x < 3$일 때: $-(x-3) - 2(x-5) \\le 4 \\implies -3x + 13 \\le 4 \\implies 3x \\ge 9 \\implies x \\ge 3$. 가정에 모순되므로 해가 없다.\\n(ii) $3 \\le x < 5$일 때: $(x-3) - 2(x-5) \\le 4 \\implies x-3 - 2x + 10 \\le 4 \\implies -x + 7 \\le 4 \\implies x \\ge 3$. 범위와 공통부분은 $3 \\le x < 5$이다.\\n(iii) $x \\ge 5$일 때: $(x-3) + 2(x-5) \\le 4 \\implies 3x - 13 \\le 4 \\implies 3x \\le 17 \\implies x \\le \\frac{17}{3}$. 범위와 공통부분은 $5 \\le x \\le \\frac{17}{3}$이다.\\n따라서 전체 해는 $3 \\le x \\le \\frac{17}{3}$이다.\\n이를 만족하는 정수 $x$는 $3, 4, 5$이므로 그 합은 $3+4+5=12$이다.\\n결론: 따라서 정답은 ②이다."
  },
  {
    id: 10,
    level: "중",
    category: "행렬",
    originalCategory: "행렬",
    standardCourse: "공통수학1",
    standardUnitKey: "H22-C-10",
    standardUnit: "행렬",
    standardUnitOrder: 10,
    content: "두 행렬 $A=\\begin{pmatrix} 3 & 1 \\\\ -1 & -2 \\end{pmatrix}$, $B=\\begin{pmatrix} -2 & -1 \\\\ 1 & 3 \\end{pmatrix}$에 대하여 행렬 $(A+B)^2 - 2AB$의 모든 성분의 합은? [4점]",
    choices: [
      "19",
      "20",
      "21",
      "22",
      "23"
    ],
    answer: "④",
    solution: "[키포인트] 행렬의 덧셈과 곱셈을 직접 계산하여 식에 대입한다.\\n조건 정리: $(A+B)^2$와 $2AB$를 각각 구하여 뺀다.\\n풀이 과정:\\n$A+B = \\begin{pmatrix} 3-2 & 1-1 \\\\ -1+1 & -2+3 \\end{pmatrix} = \\begin{pmatrix} 1 & 0 \\\\ 0 & 1 \\end{pmatrix} = I$ (단위행렬)\\n따라서 $(A+B)^2 = I^2 = I = \\begin{pmatrix} 1 & 0 \\\\ 0 & 1 \\end{pmatrix}$이다.\\n$AB = \\begin{pmatrix} 3 & 1 \\\\ -1 & -2 \\end{pmatrix} \\begin{pmatrix} -2 & -1 \\\\ 1 & 3 \\end{pmatrix} = \\begin{pmatrix} -6+1 & -3+3 \\\\ 2-2 & 1-6 \\end{pmatrix} = \\begin{pmatrix} -5 & 0 \\\\ 0 & -5 \\end{pmatrix}$\\n$2AB = \\begin{pmatrix} -10 & 0 \\\\ 0 & -10 \\end{pmatrix}$\\n$(A+B)^2 - 2AB = \\begin{pmatrix} 1 & 0 \\\\ 0 & 1 \\end{pmatrix} - \\begin{pmatrix} -10 & 0 \\\\ 0 & -10 \\end{pmatrix} = \\begin{pmatrix} 11 & 0 \\\\ 0 & 11 \\end{pmatrix}$\\n모든 성분의 합은 $11 + 0 + 0 + 11 = 22$이다.\\n결론: 따라서 정답은 ④이다."
  },
  {
    id: 11,
    level: "중",
    category: "이차방정식",
    originalCategory: "이차방정식",
    standardCourse: "공통수학1",
    standardUnitKey: "H22-C-05",
    standardUnit: "이차방정식",
    standardUnitOrder: 5,
    content: "$x$에 대한 이차방정식 $x^2+(p^2-3p-4)x+p^2-6p-7=0$의 두 근을 $\\alpha, \\beta$라 하자. 두 근의 부호는 서로 다르고 $\\alpha>0>\\beta$이고 $|\\alpha|-|\\beta|>0$이 되도록 하는 정수 $p$의 값의 합은? [4점]",
    choices: [
      "3",
      "4",
      "5",
      "6",
      "7"
    ],
    answer: "④",
    solution: "[키포인트] 이차방정식의 근과 계수의 관계를 이용하여 두 근의 부호와 절댓값 조건을 부등식으로 나타낸다.\\n조건 정리: $\\alpha\\beta < 0$이고, $|\\alpha| > |\\beta|$이므로 $\\alpha+\\beta > 0$이다.\\n풀이 과정:\\n두 근의 곱 $\\alpha\\beta < 0$이므로\\n$p^2-6p-7 < 0 \\implies (p-7)(p+1) < 0 \\implies -1 < p < 7$이다.\\n또한 $\\alpha>0, \\beta<0$이고 $|\\alpha| > |\\beta|$이므로 양수인 근의 절댓값이 더 크다. 즉, $\\alpha+\\beta > 0$이다.\\n두 근의 합 $\\alpha+\\beta = -(p^2-3p-4) > 0$이므로\\n$p^2-3p-4 < 0 \\implies (p-4)(p+1) < 0 \\implies -1 < p < 4$이다.\\n두 조건을 모두 만족하는 공통 범위는 $-1 < p < 4$이다.\\n이를 만족하는 정수 $p$는 $0, 1, 2, 3$이고, 그 합은 $0+1+2+3=6$이다.\\n결론: 따라서 정답은 ④이다."
  },
  {
    id: 12,
    level: "중",
    category: "여러 가지 방정식",
    originalCategory: "여러 가지 방정식",
    standardCourse: "공통수학1",
    standardUnitKey: "H22-C-07",
    standardUnit: "여러 가지 방정식",
    standardUnitOrder: 7,
    content: "삼차방정식 $x^3=-1$의 한 허근을 $\\alpha$라 할 때, $\\frac{\\alpha^8}{1-\\alpha} - \\frac{\\alpha^5}{\\alpha^2-\\alpha} + \\frac{\\alpha^2}{\\alpha^2+1}$의 값은? [4점]",
    choices: [
      "0",
      "$\\alpha$",
      "$\\alpha^2$",
      "$\\alpha+1$",
      "$\\alpha^2-1$"
    ],
    answer: "①",
    solution: "[키포인트] $x^3=-1$의 허근의 성질 $\\alpha^3=-1$과 $\\alpha^2-\\alpha+1=0$을 이용하여 차수를 낮추고 식을 간단히 한다.\\n조건 정리: $\\alpha^3=-1$이고 $\\alpha^2-\\alpha+1=0$이 성립한다.\\n풀이 과정:\\n각 항을 정리하면 다음과 같다.\\n1) $\\frac{\\alpha^8}{1-\\alpha} = \\frac{(\\alpha^3)^2\\cdot\\alpha^2}{1-\\alpha} = \\frac{\\alpha^2}{-\\alpha^2} = -1$ (단, $\\alpha^2-\\alpha+1=0 \\implies 1-\\alpha = -\\alpha^2$)\\n2) $\\frac{\\alpha^5}{\\alpha^2-\\alpha} = \\frac{\\alpha^3\\cdot\\alpha^2}{-1} = \\frac{-\\alpha^2}{-1} = \\alpha^2$ (단, $\\alpha^2-\\alpha+1=0 \\implies \\alpha^2-\\alpha = -1$)\\n3) $\\frac{\\alpha^2}{\\alpha^2+1} = \\frac{\\alpha^2}{\\alpha} = \\alpha$ (단, $\\alpha^2-\\alpha+1=0 \\implies \\alpha^2+1 = \\alpha$)\\n준 식은 $-1 - \\alpha^2 + \\alpha$가 된다.\\n이때 $\\alpha^2-\\alpha+1=0$에서 $-\\alpha^2+\\alpha=1$이므로, $-1 - \\alpha^2 + \\alpha = -1 + 1 = 0$이다.\\n결론: 따라서 정답은 ①이다."
  },
  {
    id: 13,
    level: "중",
    category: "이차함수",
    originalCategory: "이차함수",
    standardCourse: "공통수학1",
    standardUnitKey: "H22-C-06",
    standardUnit: "이차함수",
    standardUnitOrder: 6,
    content: "한 개의 주사위를 두 번 던져서 나오는 눈의 수를 차례로 $a, b$라 하자. 함수 $y = x^2 + a$의 그래프와 직선 $y = bx - 3$이 만나는 점이 존재하도록 하는 $a, b$의 순서쌍 $(a, b)$의 개수는? [4.2점]",
    choices: [
      "10",
      "11",
      "12",
      "13",
      "14"
    ],
    answer: "①",
    solution: "[키포인트] 이차함수와 직선이 만날 조건은 연립방정식의 판별식이 $D \\ge 0$인 것이다.\\n조건 정리: $x^2 + a = bx - 3 \\implies x^2 - bx + a + 3 = 0$이 실근을 가져야 한다.\\n풀이 과정:\\n판별식 $D = b^2 - 4(a+3) \\ge 0$이어야 하므로 $b^2 \\ge 4a + 12$이다.\\n주사위의 눈이므로 $a, b \\in \\{1, 2, 3, 4, 5, 6\\}$이다. $a$를 기준으로 $b$를 찾는다.\\n$a=1$일 때, $b^2 \\ge 16 \\implies b \\in \\{4, 5, 6\\}$ (3개)\\n$a=2$일 때, $b^2 \\ge 20 \\implies b \\in \\{5, 6\\}$ (2개)\\n$a=3$일 때, $b^2 \\ge 24 \\implies b \\in \\{5, 6\\}$ (2개)\\n$a=4$일 때, $b^2 \\ge 28 \\implies b \\in \\{6\\}$ (1개)\\n$a=5$일 때, $b^2 \\ge 32 \\implies b \\in \\{6\\}$ (1개)\\n$a=6$일 때, $b^2 \\ge 36 \\implies b \\in \\{6\\}$ (1개)\\n따라서 가능한 순서쌍의 총 개수는 $3 + 2 + 2 + 1 + 1 + 1 = 10$개이다.\\n결론: 따라서 정답은 ①이다."
  },
  {
    id: 14,
    level: "중",
    category: "경우의 수",
    originalCategory: "경우의 수",
    standardCourse: "공통수학1",
    standardUnitKey: "H22-C-09",
    standardUnit: "경우의 수",
    standardUnitOrder: 9,
    content: "회장 1명과 부회장 1명, 대의원 1명을 포함한 10명의 학생 중에서 축제 준비 위원 5명을 뽑으려고 한다. 회장, 부회장, 대의원 중 적어도 2명을 반드시 뽑는 경우의 수는? [4.2점]",
    choices: [
      "122",
      "124",
      "126",
      "128",
      "130"
    ],
    answer: "③",
    solution: "[키포인트] '적어도' 조건이 포함된 경우 직접 분류하거나 여사건을 이용할 수 있으나, 여기서는 2명 뽑을 때와 3명 모두 뽑을 때로 나누어 계산하는 것이 빠르다.\\n조건 정리: 전체 10명 중 특정한 3명(회장, 부회장, 대의원) 그룹과 나머지 7명 그룹이 있다.\\n풀이 과정:\\n특정 3명 중 적어도 2명을 뽑으려면, 2명을 뽑는 경우와 3명을 모두 뽑는 경우로 나눈다.\\n(i) 특정 3명 중 2명을 뽑는 경우:\\n${}_3C_2 \\times {}_7C_3 = 3 \\times \\frac{7 \\times 6 \\times 5}{3 \\times 2 \\times 1} = 3 \\times 35 = 105$\\n(ii) 특정 3명 중 3명을 모두 뽑는 경우:\\n${}_3C_3 \\times {}_7C_2 = 1 \\times \\frac{7 \\times 6}{2 \\times 1} = 1 \\times 21 = 21$\\n따라서 구하는 경우의 수는 $105 + 21 = 126$이다.\\n결론: 따라서 정답은 ③이다."
  },
  {
    id: 15,
    level: "중",
    category: "여러 가지 부등식",
    originalCategory: "여러 가지 부등식",
    standardCourse: "공통수학1",
    standardUnitKey: "H22-C-08",
    standardUnit: "여러 가지 부등식",
    standardUnitOrder: 8,
    content: "이차부등식 $f(x)<0$의 해가 $1<x<4$일 때, 부등식 $f(3x) - f(2x) < 0$를 만족시키는 정수 $x$의 개수는? [4.3점]",
    choices: [
      "0",
      "1",
      "2",
      "3",
      "4"
    ],
    answer: "①",
    solution: "[키포인트] 해를 이용하여 이차함수 식을 세우고, 새로운 부등식을 계산한다.\\n조건 정리: $f(x) = a(x-1)(x-4)$ 이고 $a>0$이다.\\n풀이 과정:\\n$f(x) = a(x^2 - 5x + 4)$이므로\\n$f(3x) = a(9x^2 - 15x + 4)$, $f(2x) = a(4x^2 - 10x + 4)$이다.\\n$f(3x) - f(2x) = a(9x^2 - 15x + 4) - a(4x^2 - 10x + 4) = a(5x^2 - 5x) = 5ax(x-1)$이다.\\n$a>0$이므로 부등식 $5ax(x-1) < 0$의 해는 $0 < x < 1$이다.\\n이를 만족하는 정수 $x$는 존재하지 않는다.\\n결론: 따라서 정답은 ①이다."
  },
  {
    id: 16,
    level: "중",
    category: "행렬",
    originalCategory: "행렬",
    standardCourse: "공통수학1",
    standardUnitKey: "H22-C-10",
    standardUnit: "행렬",
    standardUnitOrder: 10,
    content: "이차방정식 $x^2-4x-3=0$의 두 실근을 $\\alpha, \\beta$라고 할 때, 행렬 $X = \\begin{pmatrix} \\alpha & 0 \\\\ 0 & \\beta \\end{pmatrix}$에 대하여 행렬 $X^2$의 모든 성분의 합은? [4.3점]",
    choices: [
      "14",
      "16",
      "18",
      "20",
      "22"
    ],
    answer: "⑤",
    solution: "[키포인트] 대각행렬의 거듭제곱 성질과 이차방정식의 근과 계수의 관계를 이용한다.\\n조건 정리: $\\alpha+\\beta=4, \\alpha\\beta=-3$이고, $X^2 = \\begin{pmatrix} \\alpha^2 & 0 \\\\ 0 & \\beta^2 \\end{pmatrix}$이다.\\n풀이 과정:\\n행렬 $X^2$의 모든 성분의 합은 $\\alpha^2 + \\beta^2$이다.\\n$\\alpha^2 + \\beta^2 = (\\alpha+\\beta)^2 - 2\\alpha\\beta = 4^2 - 2(-3) = 16 + 6 = 22$이다.\\n결론: 따라서 정답은 ⑤이다."
  },
{
  id: 17,
  level: "중",
  category: "경우의 수",
  originalCategory: "경우의 수",
  standardCourse: "공통수학1",
  standardUnitKey: "H22-C-09",
  standardUnit: "경우의 수",
  standardUnitOrder: 9,
  image: "assets/images/25_금당고_1학기_기말_고1_기출/q17.png",
  content: "다음 그림과 같이 원에 내접하는 정팔각형이 있다. 정팔각형의 꼭짓점 중 서로 다른 3개의 점을 택하여 삼각형을 만들 때, 정팔각형의 어떠한 변과도 공유하지 않는 삼각형의 개수는? [4.5점]",
  choices: [
    "13",
    "14",
    "15",
    "16",
    "17"
  ],
  answer: "④",
  solution: "[키포인트] 전체 삼각형의 개수에서 정다각형과 변을 1개만 공유하는 경우와 2개를 공유하는 경우를 각각 빼준다.\\n조건 정리: 전체 꼭짓점은 8개이다.\\n풀이 과정:\\n(i) 만들 수 있는 전체 삼각형의 개수: ${}_8C_3 = 56$\\n(ii) 변을 2개 공유하는 삼각형의 개수: 연속된 3개의 꼭짓점을 이으면 되므로 꼭짓점의 개수와 같은 8개이다.\\n(iii) 변을 1개만 공유하는 삼각형의 개수: 정팔각형의 한 변을 선택하고, 그 변의 양 끝점 및 그 점들과 이웃한 2개의 점을 제외한 나머지 점을 선택한다. 변 1개당 선택할 수 있는 점은 $8-4=4$개이므로 $8 \\times 4 = 32$개이다.\\n따라서 어떠한 변과도 공유하지 않는 삼각형의 개수는 $56 - 8 - 32 = 16$개이다.\\n결론: 따라서 정답은 ④이다."
},
  {
    id: 18,
    level: "상",
    category: "경우의 수",
    originalCategory: "경우의 수",
    standardCourse: "공통수학1",
    standardUnitKey: "H22-C-09",
    standardUnit: "경우의 수",
    standardUnitOrder: 9,
    content: "1부터 9까지의 자연수가 하나씩 적힌 9장의 카드가 들어 있는 주머니에서 카드를 한 장씩 차례로 6번 꺼낸다. $i$번째 꺼낸 카드에 적혀 있는 수를 $a_i (i=1, 2, 3, 4, 5, 6)$라 할 때, $a_i$가 다음 조건을 만족시키는 경우의 수는? (단, 꺼낸 카드는 다시 주머니에 넣지 않는다.) [4.5점]\\n(가) $a_3 = 5$\\n(나) $a_1$과 $a_2$는 $a_3$보다 작다.\\n(다) $a_3 < a_4 < a_5 < a_6$",
    choices: [
      "40",
      "44",
      "48",
      "52",
      "56"
    ],
    answer: "③",
    solution: "[키포인트] 주어진 조건에 맞추어 앞의 두 자리와 뒤의 세 자리에 올 수 있는 숫자를 각각 나누어 뽑고 나열한다.\\n조건 정리: $a_3=5$로 고정되어 있고, $a_1, a_2$는 $1\\sim 4$ 중 2개, $a_4, a_5, a_6$는 $6\\sim 9$ 중 3개를 뽑아야 한다.\\n풀이 과정:\\n$a_1, a_2$는 5보다 작은 1, 2, 3, 4 중에서 2개를 선택하여 순서를 정해 나열해야 하므로 ${}_4P_2 = 12$가지이다.\\n$a_4, a_5, a_6$은 5보다 큰 6, 7, 8, 9 중에서 3개를 선택해야 한다. 크기 순서가 이미 정해져 있으므로 조합을 사용하여 뽑기만 하면 되므로 ${}_4C_3 = 4$가지이다.\\n두 사건이 연속으로 일어나므로 전체 경우의 수는 $12 \\times 4 = 48$이다.\\n결론: 따라서 정답은 ③이다."
  },
  {
    id: 19,
    level: "상",
    category: "여러 가지 방정식",
    originalCategory: "여러 가지 방정식",
    standardCourse: "공통수학1",
    standardUnitKey: "H22-C-07",
    standardUnit: "여러 가지 방정식",
    standardUnitOrder: 7,
    content: "$x$에 대한 사차방정식 $x^4-9x^3+30x^2+px+q=0$의 서로 다른 네 실근 $\\alpha, \\beta, \\gamma, \\delta$가 $(\\alpha+\\beta)^2=3\\alpha\\beta, (\\gamma+\\delta)^2=3\\gamma\\delta$을 만족시킬 때, 두 상수 $p, q$에 대하여 $p+q$의 값은? [4.5점]",
    choices: [
      "-18",
      "-16",
      "-14",
      "-12",
      "-10"
    ],
    answer: "①",
    solution: "[키포인트] 사차방정식을 두 이차방정식의 곱으로 인수분해하여 조건을 만족하는 계수를 유추한다.\\n조건 정리: 사차방정식을 $(x^2-Ax+B)(x^2-Cx+D)=0$으로 둔다.\\n풀이 과정:\\n두 이차방정식의 근이 각각 $\\alpha, \\beta$와 $\\gamma, \\delta$라고 하면, 근과 계수의 관계에 의해\\n$(\\alpha+\\beta)^2=3\\alpha\\beta \\implies A^2=3B \\implies B=\\frac{A^2}{3}$\\n$(\\gamma+\\delta)^2=3\\gamma\\delta \\implies C^2=3D \\implies D=\\frac{C^2}{3}$\\n주어진 사차방정식 전개식에서\\n$A+C=9$\\n$AC+B+D=30 \\implies AC + \\frac{A^2+C^2}{3} = 30$\\n$A^2+C^2 = (A+C)^2 - 2AC = 81 - 2AC$이므로\\n$AC + \\frac{81-2AC}{3} = 30 \\implies \\frac{AC}{3} + 27 = 30 \\implies AC = 9$\\n따라서 $A, C$는 방정식 $t^2-9t+9=0$의 두 근이다.\\n$p = -(AD+BC) = -\\left(A\\cdot\\frac{C^2}{3} + C\\cdot\\frac{A^2}{3}\\right) = -\\frac{AC(C+A)}{3} = -\\frac{9 \\times 9}{3} = -27$\\n$q = BD = \\frac{A^2}{3} \\cdot \\frac{C^2}{3} = \\frac{(AC)^2}{9} = \\frac{81}{9} = 9$\\n그러므로 $p+q = -27 + 9 = -18$이다.\\n(참고: 이때 $t^2-9t+9=0$의 판별식은 양수이므로 $A,C$는 실수가 되나, $B=A^2/3$에서 $\\alpha, \\beta$가 실근일 조건 $A^2-4B \\ge 0$을 적용하면 $A^2-4A^2/3 = -A^2/3 < 0$이 되어 실제 네 근은 복소수 범위에서 존재한다. 그러나 대수적인 연산 결과 값은 -18로 도출된다.)\\n결론: 따라서 정답은 ①이다."
  },
  {
    id: 20,
    level: "상",
    category: "여러 가지 방정식",
    originalCategory: "여러 가지 방정식",
    standardCourse: "공통수학1",
    standardUnitKey: "H22-C-07",
    standardUnit: "여러 가지 방정식",
    standardUnitOrder: 7,
    content: "$x$에 대한 삼차방정식 $x^3+(1-m)x^2+(3-m)x+3=0$이 0보다 작은 한 근과 1과 3사이에 서로 다른 두 실근을 가질 때, 이를 만족시키는 $m$의 범위가 $\\alpha < m < \\beta$이다. 이 때 $\\alpha^2+\\beta$의 값은? [4.5점]",
    choices: [
      "15",
      "16",
      "17",
      "18",
      "19"
    ],
    answer: "②",
    solution: "[키포인트] 조립제법으로 실근을 찾고 남은 이차방정식의 근의 분리를 이용한다.\\n조건 정리: $f(x) = x^3+(1-m)x^2+(3-m)x+3$라 하면 $f(-1) = 0$이다.\\n풀이 과정:\\n$f(x) = (x+1)(x^2-mx+3) = 0$으로 인수분해된다. $x=-1$은 음수인 근이므로 성립한다.\\n방정식 $g(x)=x^2-mx+3=0$이 $1<x<3$에서 서로 다른 두 실근을 가져야 한다.\\n1) 판별식 $D = m^2 - 12 > 0 \\implies m < -2\\sqrt{3}$ 또는 $m > 2\\sqrt{3}$\\n2) 대칭축 $1 < \\frac{m}{2} < 3 \\implies 2 < m < 6$\\n3) 경곗값의 부호\\n$g(1) = 1-m+3 > 0 \\implies m < 4$\\n$g(3) = 9-3m+3 > 0 \\implies 3m < 12 \\implies m < 4$\\n위 조건들을 모두 만족하는 $m$의 공통 범위는 $2\\sqrt{3} < m < 4$이다.\\n따라서 $\\alpha = 2\\sqrt{3}, \\beta = 4$이다.\\n$\\alpha^2+\\beta = (2\\sqrt{3})^2 + 4 = 12 + 4 = 16$이다.\\n결론: 따라서 정답은 ②이다."
  },
  {
    id: 21,
    level: "상",
    category: "경우의 수",
    originalCategory: "경우의 수",
    standardCourse: "공통수학1",
    standardUnitKey: "H22-C-09",
    standardUnit: "경우의 수",
    standardUnitOrder: 9,
    content: "<서·논술형 1>\\n5개의 숫자 0, 1, 2, 3, 4가 하나씩 적혀 있는 5장의 카드 중에서 서로 다른 4장의 카드를 뽑아 일렬로 나열하여 네 자리의 자연수를 만들 때, 3000보다 큰 3의 배수의 개수를 풀이과정과 함께 서술하시오. (단, $a, b$는 상수이다.) [8점]",
    choices: [],
    answer: "18",
    solution: "[키포인트] 3의 배수 판정법을 이용하여 뽑을 4개의 숫자를 결정하고 경우를 나눈다.\\n조건 정리: 4자리 수의 각 자리 숫자의 합이 3의 배수이고, 천의 자리 숫자가 3 또는 4여야 한다.\\n풀이 과정:\\n전체 숫자의 합은 $0+1+2+3+4=10$이다.\\n이 중에서 한 숫자를 제외한 나머지 4개의 숫자의 합이 3의 배수가 되어야 하므로 제외되는 숫자 $x$에 대해 $10-x$가 3의 배수여야 한다.\\n따라서 $x=1$ 또는 $x=4$이다.\\n(i) 1이 제외된 경우: 뽑힌 숫자는 0, 2, 3, 4\\n3000보다 커야 하므로 천의 자리가 3 또는 4이다.\\n천의 자리가 3일 때, 나머지 3자리 배열: $3! = 6$가지\\n천의 자리가 4일 때, 나머지 3자리 배열: $3! = 6$가지\\n(ii) 4가 제외된 경우: 뽑힌 숫자는 0, 1, 2, 3\\n3000보다 커야 하므로 천의 자리는 3뿐이다.\\n천의 자리가 3일 때, 나머지 3자리 배열: $3! = 6$가지\\n따라서 구하는 개수는 $6 + 6 + 6 = 18$개이다.\\n결론: 구하는 값은 18이다."
  },
  {
    id: 22,
    level: "상",
    category: "여러 가지 방정식",
    originalCategory: "여러 가지 방정식",
    standardCourse: "공통수학1",
    standardUnitKey: "H22-C-07",
    standardUnit: "여러 가지 방정식",
    standardUnitOrder: 7,
    content: "<서·논술형 2>\\n$x$에 대한 사차방정식 $3x^4-10x^3+(11+k)x^2-(4+2k)x+k=0$의 서로 다른 세 근이 어떤 직각삼각형의 세 변의 길이가 된다. 가능한 모든 $k$값들을 풀이과정과 함께 서술하시오. [12점]",
    choices: [],
    answer: "\\frac{7}{6}, \\frac{175}{192}",
    solution: "[키포인트] 식을 변형하여 조립제법으로 실근을 찾고, 직각삼각형의 피타고라스 정리를 적용한다.\\n조건 정리: $P(x) = 3x^4-10x^3+(11+k)x^2-(4+2k)x+k = 0$\\n풀이 과정:\\n주어진 식을 $k$가 없는 부분과 있는 부분으로 나누면\\n$(3x^4-10x^3+11x^2-4x) + k(x^2-2x+1) = 0$\\n$x(x-1)^2(3x-4) + k(x-1)^2 = 0$\\n$(x-1)^2(3x^2-4x+k) = 0$\\n서로 다른 세 근이 되기 위해서는 $3x^2-4x+k=0$의 두 근 $\\alpha, \\beta$가 1이 아닌 서로 다른 양의 실근이어야 한다.\\n이때 세 근은 $1, \\alpha, \\beta$이다.\\n근과 계수의 관계에 의해 $\\alpha+\\beta=\\frac{4}{3}, \\alpha\\beta=\\frac{k}{3}$이다.\\n직각삼각형이므로 피타고라스 정리가 성립하는 두 가지 경우로 나눈다.\\n(i) 1이 빗변인 경우:\\n$\\alpha^2+\\beta^2=1 \\implies (\\alpha+\\beta)^2-2\\alpha\\beta=1 \\implies \\frac{16}{9} - \\frac{2k}{3} = 1 \\implies \\frac{2k}{3} = \\frac{7}{9} \\implies k=\\frac{7}{6}$\\n이때 서로 다른 양의 실근 조건을 만족한다.\\n(ii) $\\alpha$가 빗변인 경우:\\n$\\alpha^2 = \\beta^2+1 \\implies \\alpha^2-\\beta^2=1 \\implies (\\alpha+\\beta)(\\alpha-\\beta)=1 \\implies \\frac{4}{3}(\\alpha-\\beta)=1 \\implies \\alpha-\\beta=\\frac{3}{4}$\\n연립방정식 $\\alpha+\\beta=\\frac{4}{3}, \\alpha-\\beta=\\frac{3}{4}$을 풀면 $\\alpha=\\frac{25}{24}, \\beta=\\frac{7}{24}$이다.\\n따라서 $\\frac{k}{3} = \\alpha\\beta = \\frac{25}{24} \\times \\frac{7}{24} = \\frac{175}{576}$이므로 $k = \\frac{175}{192}$이다.\\n결론: 가능한 $k$값은 $\\frac{7}{6}, \\frac{175}{192}$이다."
  }
];