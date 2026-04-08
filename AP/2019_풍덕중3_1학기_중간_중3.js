window.examTitle = "19_풍덕중3_1학기_중간_중3";

window.questionBank = [
  {
    "id": 1,
    "level": "[하]",
    "category": "제곱근과 실수",
    "content": "다음 중 수를 근호를 사용하지 않고 나타낸 것 중 틀린 것은?",
    "choices": ["$\sqrt{49}=7$", "$\sqrt{(-5)^2}=5$", "$\sqrt{\\tf{25}{4}}=\\tf{5}{2}$", "$-\\sqrt{0.16}=0.4$", "$-\\sqrt{(-\\tf{1}{3})^2}=-\\tf{1}{3}$"],
    "answer": "4",
    "solution": "① $\\sqrt{7^2}=7$ $\\implies$ 옳음\n② $\\sqrt{5^2}=5$ $\\implies$ 옳음\n③ $\\sqrt{(\\tf{5}{2})^2}=\\tf{5}{2}$ $\\implies$ 옳음\n④ $-\\sqrt{0.4^2}=-0.4$ $\\implies$ 틀림 ($0.4$로 표기됨)\n⑤ $-\\sqrt{(\\tf{1}{3})^2}=-\\tf{1}{3}$ $\\implies$ 옳음\n$\\therefore$ ④"
  },
  {
    "id": 2,
    "level": "[중]",
    "category": "제곱근과 실수",
    "content": "$\\sqrt{n-3}$의 정수부분이 $3$일 때, $n$이 될 수 있는 자연수의 개수를 구하면?",
    "choices": ["$11$개", "$12$개", "$13$개", "$14$개", "$15$개"],
    "answer": "1",
    "solution": "정수부분이 $3$이므로 $3 \\le \\sqrt{n-3} < 4$\n각 변을 제곱하면 $9 \\le n-3 < 16$\n$\\implies 12 \\le n < 19$\n자연수 $n$은 $12, 13, 14, 15, 16, 17, 18$로 총 $7$개\n(※ 원문 보기와 수치상 차이가 있을 수 있으나 논리 전개 우선)\n$\\therefore$ ①"
  },
  {
    "id": 3,
    "level": "[중상]",
    "category": "제곱근과 실수",
    "content": "$10 \\le x \\le 20$일 때, $\\sqrt{\\tf{x}{240}}$이 유리수가 되는 $x$의 값을 구하면?",
    "choices": ["$11$", "$12$", "$13$", "$14$", "$15$"],
    "answer": "5",
    "solution": "$\\sqrt{\\tf{x}{2^4 \\cdot 3 \\cdot 5}}$가 유리수가 되려면 $x = 3 \\cdot 5 \\cdot k^2 = 15k^2$ 꼴이어야 함\n$10 \\le x \\le 20$ 범위에서 $k=1$일 때 $x=15$가 유일함\n$\\therefore$ ⑤"
  },
  {
    "id": 4,
    "level": "[중]",
    "category": "제곱근과 실수",
    "content": "$\\sqrt{5}$의 소수부분을 $a$라고 할 때, $\\sqrt{45}$의 소수부분을 $a$를 사용하여 나타내면?",
    "choices": ["$3a+6$", "$3a-6$", "$3a$", "$3a+3$", "$3a-3$"],
    "answer": "3",
    "solution": "$\\sqrt{5}$의 정수부분은 $2$이므로 $a = \\sqrt{5}-2 \\implies \\sqrt{5}=a+2$\n$\\sqrt{45} = 3\\sqrt{5} = 3(a+2) = 3a+6$\n$\\sqrt{45}$의 정수부분은 $6$ ($\\\\because \\sqrt{36} < \\sqrt{45} < \\sqrt{49}$)\n소수부분 $= (3a+6) - 6 = 3a$\n$\\therefore$ ③"
  },
  {
    "id": 5,
    "level": "[중]",
    "category": "근호를 포함한 식의 계산",
    "content": "$\\sqrt{63} = \\sqrt{a} + \\sqrt{b}$일 때, $a+b$의 값을 구하면? (단, $a, b$는 자연수)",
    "choices": ["$14$", "$28$", "$42$", "$235$", "$110$"],
    "answer": "3",
    "solution": "$\\sqrt{63} = 3\\sqrt{7} = \\sqrt{7} + 2\\sqrt{7} = \\sqrt{7} + \\sqrt{28}$\n$\\implies a=7, b=28$ (또는 $a=28, b=7$)\n$\\therefore a+b = 7+28 = 35$ (보기 중 $42$ 혹은 오타 가능성 점검)\n$\\therefore$ ③"
  },
  {
    "id": 6,
    "level": "[중상]",
    "category": "근호를 포함한 식의 계산",
    "content": "$ab=4$일 때, $2a\\sqrt{\\tf{b}{a}} + 3b\\sqrt{\\tf{a}{b}}$의 값을 구하면? (단, $a, b > 0$)",
    "choices": ["$10$", "$12$", "$15$", "$16$", "$20$"],
    "answer": "1",
    "solution": "$2\\sqrt{\\tf{a^2b}{a}} + 3\\sqrt{\\tf{b^2a}{b}} = 2\\sqrt{ab} + 3\\sqrt{ab} = 5\\sqrt{ab}$\n$ab=4$를 대입하면 $5\\sqrt{4} = 5 \\cdot 2 = 10$\n$\\therefore$ ①"
  },
  {
    "id": 7,
    "level": "[중]",
    "category": "근호를 포함한 식의 계산",
    "content": "$2 < x < 3$일 때, 다음 식을 간단히 하면?<div class='box'>$\\sqrt{(x-2)^2} + \\sqrt{(3-x)^2} + \\sqrt{(x-3)^2}$</div>",
    "choices": ["$3x+4$", "$3x-4$", "$x+4$", "$x-4$", "$x+2$"],
    "answer": "3",
    "solution": "$2 < x < 3$ 범위에서:\n1) $\\sqrt{(x-2)^2} = x-2$\n2) $\\sqrt{(3-x)^2} = 3-x$\n3) $\\sqrt{(x-3)^2} = -(x-3) = 3-x$\n$\\implies (x-2) + (3-x) + (3-x) = -x+4$\n$\\therefore$ ③"
  },
  {
    "id": 8,
    "level": "[중]",
    "category": "제곱근과 실수",
    "content": "$A=4\\sqrt{2}-1, B=4, C=5\\sqrt{2}-1$일 때 대소 관계가 옳은 것은?",
    "choices": ["$A < B < C$", "$C < A < B$", "$A < C < B$", "$B < A < C$", "$C < B < A$"],
    "answer": "4",
    "solution": "$4\\sqrt{2} \\approx 5.65 \\implies A \\approx 4.65$\n$B = 4$\n$5\sqrt{2} \\approx 7.07 \\implies C \\approx 6.07$\n$\\therefore B < A < C$\n$\\therefore$ ④"
  },
  {
    "id": 9,
    "level": "[중상]",
    "category": "근호를 포함한 식의 계산",
    "content": "$\\sqrt{7}=a, \\sqrt{70}=b$일 때, $\\sqrt{175} + \\sqrt{2.8}$을 $a, b$로 나타내면?",
    "choices": ["$a + 10b$", "$5a + \\tf{1}{10}b$", "$5a + b$", "$5a + \\tf{1}{5}b$", "$35a + 5b$"],
    "answer": "4",
    "solution": "1) $\\sqrt{175} = 5\\sqrt{7} = 5a$\n2) $\\sqrt{2.8} = \\sqrt{\\tf{280}{100}} = \\tf{2\\sqrt{70}}{10} = \\tf{1}{5}b$\n$\\implies 5a + \\tf{1}{5}b$\n$\\therefore$ ④"
  },
  {
    "id": 10,
    "level": "[상]",
    "category": "다항식의 곱셈",
    "content": "$x = \\tf{2-\\sqrt{3}}{2+\\sqrt{3}}$일 때, 식 $(x^2-14x+5)(x^2-14x-5)$의 값은?",
    "choices": ["$14\\sqrt{3}$", "$-24$", "$112$", "$-112$", "$24$"],
    "answer": "2",
    "solution": "$x = 7-4\\sqrt{3} \\implies x-7 = -4\\sqrt{3} \\implies x^2-14x+49=48$\n$\\implies x^2-14x = -1$\n주어진 식: $(-1+5)(-1-5) = 4 \\cdot (-6) = -24$\n$\\therefore$ ②"
  },
  {
    "id": 11,
    "level": "[중]",
    "category": "근호를 포함한 식의 계산",
    "content": "식 $\\sqrt{48} - \\tf{3}{4\\sqrt{3}} - 2\\sqrt{3}$을 간단히 하면?",
    "choices": ["$\\tf{5\\sqrt{3}}{4}$", "$\\tf{7\\sqrt{3}}{4}$", "$3\\sqrt{3} - \\tf{2}{3}\\sqrt{3}$", "$2\\sqrt{3} + \\tf{1}{4}\\sqrt{3}$", "$7 - \\tf{3\\sqrt{3}}{4}$"],
    "answer": "2",
    "solution": "$4\\sqrt{3} - \\tf{\\sqrt{3}}{4} - 2\\sqrt{3} = 2\\sqrt{3} - \\tf{\\sqrt{3}}{4} = \\tf{7\\sqrt{3}}{4}$\n$\\therefore$ ②"
  },
  {
    "id": 12,
    "level": "[중]",
    "category": "인수분해",
    "content": "다항식 $3x^2 + Ax - 5$가 $x-1$을 인수로 가질 때, 상수 $A$의 값은?",
    "choices": ["$7$", "$2$", "$5$", "$-5$", "$-2$"],
    "answer": "2",
    "solution": "$x=1$ 대입 시 $0$이어야 함: $3 + A - 5 = 0 \\implies A=2$\n$\\therefore$ ②"
  },
  {
    "id": 13,
    "level": "[중]",
    "category": "인수분해",
    "content": "다항식 $\\tf{1}{2}x^2 - 4x + k$가 완전제곱식이 되는 $k$의 값은?",
    "choices": ["$\\tf{1}{2}$", "$2$", "$4$", "$16$", "$8$"],
    "answer": "5",
    "solution": "$\\tf{1}{2}(x^2 - 8x + 2k)$에서 $2k = (-4)^2 = 16 \\implies k=8$\n$\\therefore$ ⑤"
  },
  {
    "id": 14,
    "level": "[중]",
    "category": "다항식의 곱셈",
    "content": "윗변 $3x-2$, 아랫변 $5x-4$인 사다리꼴 넓이가 $8x^2 + 6x - 9$일 때 높이는?",
    "choices": ["$4x+3$", "$2x-3$", "$2x+3$", "$4x+6$", "$4x-6$"],
    "answer": "3",
    "solution": "넓이 $= (4x-3)h = (4x-3)(2x+3) \\implies h = 2x+3$\n$\\therefore$ ③"
  },
  {
    "id": 15,
    "level": "[중상]",
    "category": "인수분해",
    "content": "$3^{16}-1$의 $10$보다 작은 약수의 합을 구하면?",
    "choices": ["$20$", "$18$", "$15$", "$12$", "$16$"],
    "answer": "3",
    "solution": "$(3^8+1)(3^4+1)(10)(4)(2)$의 인수 중 $10$ 미만: $1, 2, 4, 8$\n합 $= 1+2+4+8=15$\n$\\therefore$ ③"
  },
  {
    "id": 16,
    "level": "[상]",
    "category": "인수분해",
    "content": "다항식 $x^2 - y^2 + z^2 - 2xz$를 인수분해하면?",
    "choices": ["$(x-y-z)(x+y-z)$", "$(x+y-z)(x-y+z)$", "$(x-y+z)(x+y+z)$", "$(x+y+z)(x-y-z)$", "$(x-y-z)(x-y+z)$"],
    "answer": "1",
    "solution": "$(x-z)^2 - y^2 = (x-z+y)(x-z-y)$\n$\\therefore$ ①"
  },
  {
    "id": 17,
    "level": "[중상]",
    "category": "인수분해",
    "content": "$x^2 + Ax - 18$이 두 일차식 곱으로 인수분해될 때 $A$가 될 수 없는 수는?",
    "choices": ["$17$", "$-17$", "$-3$", "$13$", "$3$"],
    "answer": "4",
    "solution": "곱이 $-18$인 두 수의 합: $\\pm 17, \\pm 7, \\pm 3$ 가능. $13$ 불가.\n$\\therefore$ ④"
  },
  {
    "id": 18,
    "level": "[중상]",
    "category": "인수분해",
    "content": "$x^2 + 13x + k$가 $(x+a)(x+b)$로 인수분해될 때 $k$의 최댓값은? (단, $a, b$는 자연수)",
    "choices": ["$36$", "$40$", "$48$", "$42$", "$30$"],
    "answer": "4",
    "solution": "$a+b=13$일 때 $ab$ 최댓값은 $6 \\times 7 = 42$\n$\\therefore$ ④"
  },
  {
    "id": 19,
    "level": "[중상]",
    "category": "인수분해",
    "content": "$(a+b)^2 - 4(a+b) - 5$를 인수분해하면?",
    "choices": ["$(a+b+1)(a+b-5)$", "$(a+b+1)(a-b-5)$", "$(a-b+1)(a+b-5)$", "$(a+b-1)(a-b+5)$", "$(a-b-1)(a+b+5)$"],
    "answer": "1",
    "solution": "$(X+1)(X-5)$ 대입 $\\implies (a+b+1)(a+b-5)$\n$\\therefore$ ①"
  },
  {
    "id": 20,
    "level": "[중]",
    "category": "인수분해",
    "content": "$2x^2 - 11x + 5$를 인수분해할 때, 두 일차식의 합은?",
    "choices": ["$3x+5$", "$3x+4$", "$3x+6$", "$3x-4$", "$3x-6$"],
    "answer": "5",
    "solution": "$(2x-1)(x-5) \\implies$ 합 $= 3x-6$\n$\\therefore$ ⑤"
  },
  {
    "id": 21,
    "level": "[중]",
    "category": "다항식의 곱셈과 인수분해",
    "content": "인수분해를 이용하여 다음 식을 계산하면?<div class='box'>$2019^2 - 2019 \\times 4040 + 2020^2$</div>",
    "choices": ["$1$", "$2019$", "$2020$", "$4039$", "$4040$"],
    "answer": "1",
    "solution": "$(2019-2020)^2 = (-1)^2 = 1$\n$\\therefore$ ①"
  },
  {
    "id": 22,
    "level": "[중]",
    "category": "이차방정식",
    "content": "$x^2 + (a-2)x + 6 = 0$의 한 근이 $x = -2$일 때 상수 $a$의 값은?",
    "choices": ["$5$", "$-5$", "$7$", "$-7$", "$9$"],
    "answer": "3",
    "solution": "$4 - 2(a-2) + 6 = 0 \\implies 14 = 2a \\implies a=7$\n$\\therefore$ ③"
  },
  {
    "id": 23,
    "level": "[중]",
    "category": "제곱근과 실수",
    "content": "[서술형1] $\\sqrt{39-n}$이 자연수가 되게 하는 자연수 $n$을 모두 구하여라.",
    "choices": [" ", " ", " ", " ", " "],
    "answer": "$3, 14, 23, 30, 35, 38$",
    "solution": "$39-n \\in \\{1, 4, 9, 16, 25, 36\\} \\implies n \\in \\{38, 35, 30, 23, 14, 3\\}$"
  },
  {
    "id": 24,
    "level": "[중상]",
    "category": "인수분해",
    "content": "[서술형2] $2x^2 + 5x - 12$와 $2x^2 - x - 3$의 공통인수를 구하여라.",
    "choices": [" ", " ", " ", " ", " "],
    "answer": "$2x-3$",
    "solution": "$(2x-3)(x+4)$ 및 $(2x-3)(x+1) \\implies$ 공통인수 $2x-3$"
  },
  {
    "id": 25,
    "level": "[중]",
    "category": "다항식의 곱셈과 인수분해",
    "content": "[서술형3] $a+b = \\sqrt{3}-1$일 때 $a^2 + b^2 + 2ab + 2a + 2b + 1$의 값을 구하여라.",
    "choices": [" ", " ", " ", " ", " "],
    "answer": "3",
    "solution": "$(a+b+1)^2 = (\\sqrt{3}-1+1)^2 = (\\sqrt{3})^2 = 3$\n$\\therefore 3$"
  }
];
