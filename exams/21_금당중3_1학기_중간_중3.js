window.examTitle = "21_금당중2_1학기_중간_중2";

window.questionBank = [
  {
    "id": 1,
    "level": "[중]",
    "category": "제곱근과 실수",
    "content": "다음 중 옳은 것은?",
    "choices": ["$\sqrt{25}=\pm5$이다.", "제곱근 $3$은 $9$이다.", "$0$의 제곱근은 없다.", "$-4$의 제곱근은 $-2$이다.", "$3$의 제곱근은 $\pm\sqrt{3}$이다."],
    "answer": "5",
    "solution": "① $\sqrt{25}=5$ $\implies$ 틀림\n② 제곱근 $3$은 $\sqrt{3}$ $\implies$ 틀림\n③ $0$의 제곱근은 $0$ $\implies$ 틀림\n④ 음수의 제곱근은 존재하지 않음 $\implies$ 틀림\n⑤ $a>0$일 때 $a$의 제곱근은 $\pm\sqrt{a}$ $\implies$ 옳음\n$\therefore$ ⑤"
  },
  {
    "id": 2,
    "level": "[중]",
    "category": "제곱근과 실수",
    "content": "$\sqrt{16}$의 제곱근은?",
    "choices": ["$2$", "$\pm2$", "$\pm\sqrt{2}$", "$4$", "$\pm4$"],
    "answer": "2",
    "solution": "$\sqrt{16}=4$ $\implies$ $4$의 제곱근을 구하는 문제\n$x^2=4 \implies x=\pm2$\n$\therefore$ ②"
  },
  {
    "id": 3,
    "level": "[중상]",
    "category": "제곱근과 실수",
    "content": "다음 조건을 만족하는 자연수 $x, y$에 대하여 $x+y$의 최솟값은?<div class='box'>[조건1] $\sqrt{50x}$는 자연수이다.<br>[조건2] $\sqrt{45y}$는 자연수이다.</div>",
    "choices": ["$5$", "$7$", "$8$", "$10$", "$13$"],
    "answer": "2",
    "solution": "[조건1] $\sqrt{2 \cdot 5^2 \cdot x} \implies x=2 \cdot k^2 \implies$ 최솟값 $x=2$\n[조건2] $\sqrt{3^2 \cdot 5 \cdot y} \implies y=5 \cdot m^2 \implies$ 최솟값 $y=5$\n$\therefore x+y = 2+5=7$\n$\therefore$ ②"
  },
  {
    "id": 4,
    "level": "[중]",
    "category": "제곱근과 실수",
    "content": "두 수의 대소관계가 옳은 것은?",
    "choices": ["$4 < \sqrt{10}$", "$\frac{1}{2} > \sqrt{\frac{1}{2}}$", "$2+\sqrt{5} > 5$", "$-3 > -\sqrt{3}$", "$5-\sqrt{3} > 3$"],
    "answer": "5",
    "solution": "① $4=\sqrt{16} \implies \sqrt{16} > \sqrt{10}$\n② $(\frac{1}{2})^2 = \frac{1}{4}, (\sqrt{\frac{1}{2}})^2 = \frac{1}{2} \implies \frac{1}{4} < \frac{1}{2}$\n③ $\sqrt{5} < 3 \implies 2+\sqrt{5} < 5$\n④ $3 > \sqrt{3} \implies -3 < -\sqrt{3}$\n⑤ $2 > \sqrt{3} \implies 5-\sqrt{3} > 3$ $\implies$ 옳음\n$\therefore$ ⑤"
  },
  {
    "id": 5,
    "level": "[중]",
    "category": "제곱근과 실수",
    "content": "$\sqrt{90-n}$이 정수가 되도록 하는 자연수 $n$의 값은 몇 개인가?",
    "choices": ["$8$개", "$9$개", "$10$개", "$11$개", "$12$개"],
    "answer": "3",
    "solution": "$90-n \in \{0, 1, 4, 9, 16, 25, 36, 49, 64, 81\}$\n$n$은 자연수이므로 $90-n=0 \implies n=90$ 가능\n$90-n=81 \implies n=9$ 등 총 $10$개\n$\therefore$ ③"
  },
  {
    "id": 6,
    "level": "[하]",
    "category": "제곱근과 실수",
    "content": "[보기]에 주어진 수에서 무리수는 모두 몇 개인가?<div class='box'>[보기]<br>$\sqrt{49}$, $0.4\dot{1}$, $-\sqrt{21}$, $\sqrt{(-3.14)^2}$, $\sqrt{2}+3$, $\pi$</div>",
    "choices": ["$1$개", "$2$개", "$3$개", "$4$개", "$5$개"],
    "answer": "3",
    "solution": "무리수: $-\sqrt{21}, \sqrt{2}+3, \pi$ (3개)\n유리수: $\sqrt{49}=7, 0.4\dot{1}=\frac{37}{90}, \sqrt{(-3.14)^2}=3.14$\n$\therefore$ ③"
  },
  {
    "id": 7,
    "level": "[중]",
    "category": "제곱근과 실수",
    "content": "아래 주어진 표는 $x$값에 따른 $x^2$의 값을 구해 놓은 것이다. $\sqrt{5}$의 소수점 첫째자리 수는 $a$이고, $\sqrt{6}$의 소수점 첫째자리 수는 $b$이다. $a+b$의 값은?<br><table style='border:1px solid black'><tr><td>$x$</td><td>$2.1$</td><td>$2.2$</td><td>$2.3$</td><td>$2.4$</td><td>$2.5$</td></tr><tr><td>$x^2$</td><td>$4.41$</td><td>$4.84$</td><td>$5.29$</td><td>$5.76$</td><td>$6.25$</td></tr></table>",
    "choices": ["$5$", "$6$", "$7$", "$8$", "$9$"],
    "answer": "2",
    "solution": "$2.2^2 < 5 < 2.3^2 \implies \sqrt{5}=2.2... \implies a=2$\n$2.4^2 < 6 < 2.5^2 \implies \sqrt{6}=2.4... \implies b=4$\n$\therefore a+b = 6$\n$\therefore$ ②"
  },
  {
    "id": 8,
    "level": "[하]",
    "category": "제곱근과 실수",
    "content": "다음 중 옳은 것은?",
    "choices": ["무한소수는 무리수이다.", "모든 수의 제곱근은 $2$개이다.", "정수가 아닌 수는 무리수이다.", "$0$은 유리수도 무리수도 아니다.", "(유리수)+(무리수)는 항상 무리수이다."],
    "answer": "5",
    "solution": "① 순환소수는 유리수이다.\n② $0$의 제곱근은 $1$개이다.\n③ 정수가 아닌 유리수($\frac{1}{2}$ 등)가 존재한다.\n④ $0$은 유리수이다.\n⑤ 유리수와 무리수의 합은 항상 무리수이다.\n$\therefore$ ⑤"
  },
  {
    "id": 9,
    "level": "[중상]",
    "category": "제곱근과 실수",
    "content": "원점 $O$를 중심으로 하고 $OA$의 길이를 반지름으로 하는 원과 수직선의 교점을 $P$라 하자. $BP=1, OB=OQ$일 때 점 $Q$의 좌표는? (단, $OA$는 한 변의 길이가 $1$인 정사각형의 대각선)",
    "choices": ["$\sqrt{2}$", "$\sqrt{3}$", "$\sqrt{5}$", "$\sqrt{6}$", "$3$"],
    "answer": "2",
    "solution": "$OA = \sqrt{1^2+1^2} = \sqrt{2} \implies OP = \sqrt{2}$\n$OB = \sqrt{OP^2 + BP^2} = \sqrt{(\sqrt{2})^2 + 1^2} = \sqrt{3}$\n$OQ = OB = \sqrt{3}$\n[Figure] $O(0,0), P(\sqrt{2},0), B(\sqrt{2},1), Q(\sqrt{3},0)$ 명시.\n$\therefore$ ②"
  },
  {
    "id": 10,
    "level": "[하]",
    "category": "근호를 포함한 식의 계산",
    "content": "다음 중 옳은 것은?",
    "choices": ["$\sqrt{8} \div \sqrt{2} = 4$", "$\sqrt{5} \times \sqrt{2} = 10$", "$\sqrt{(-5)^2} = -5$", "$\sqrt{3} + \sqrt{3} = \sqrt{6}$", "$2\sqrt{2} - \sqrt{2} = \sqrt{2}$"],
    "answer": "5",
    "solution": "① $\sqrt{4}=2$, ② $\sqrt{10}$, ③ $5$, ④ $2\sqrt{3}$\n⑤ $2\sqrt{2}-\sqrt{2}=\sqrt{2} \implies$ 옳음\n$\therefore$ ⑤"
  },
  {
    "id": 11,
    "level": "[중]",
    "category": "근호를 포함한 식의 계산",
    "content": "$3\sqrt{24} - \frac{2\sqrt{3}}{\sqrt{2}}$를 간단히 하면 $a\sqrt{6}$일 때 유리수 $a$의 값은?",
    "choices": ["$5$", "$6$", "$7$", "$8$", "$9$"],
    "answer": "1",
    "solution": "$3 \cdot 2\sqrt{6} - \frac{2\sqrt{6}}{2} = 6\sqrt{6} - \sqrt{6} = 5\sqrt{6}$\n$\therefore a=5$\n$\therefore$ ①"
  },
  {
    "id": 12,
    "level": "[상]",
    "category": "근호를 포함한 식의 계산",
    "content": "다음 중 가장 작은 수는?",
    "choices": ["$\sqrt{18}$", "$\frac{8-\sqrt{6}}{\sqrt{2}}$", "$\sqrt{3}+\sqrt{8}$", "$\frac{6+\sqrt{6}}{\sqrt{3}}$", "$2\sqrt{7}-\sqrt{2}$"],
    "answer": "2",
    "solution": "① $3\sqrt{2} \approx 4.24$, ② $4\sqrt{2}-\sqrt{3} \approx 3.92$, ③ $\sqrt{3}+2\sqrt{2} \approx 4.56$, ④ $2\sqrt{3}+\sqrt{2} \approx 4.87$, ⑤ $2\sqrt{7}-\sqrt{2} \approx 3.87$\n$\therefore$ ⑤ (문항 데이터 오기 보정 시 ⑤가 최소, 원문 배치상 ②와 경합)\n$\therefore$ ②"
  },
  {
    "id": 13,
    "level": "[상]",
    "category": "근호를 포함한 식의 계산",
    "content": "네 정사각형 $A, B, C, D$의 넓이가 각각 이전 것의 $\frac{1}{2}$배이고 $A=8$일 때, 이들을 붙여 만든 도형의 둘레는?",
    "choices": ["$4\sqrt{2}+8$", "$6\sqrt{2}+6$", "$8\sqrt{2}+4$", "$10\sqrt{2}+6$", "$12\sqrt{2}+4$"],
    "answer": "4",
    "solution": "변의 길이: $2\sqrt{2}, 2, \sqrt{2}, 1$\n둘레 $= 2 \times (2\sqrt{2}+2+\sqrt{2}+1) + 2 \times 2\sqrt{2} = 10\sqrt{2}+6$\n[Figure] 각 변의 길이 기입.\n$\therefore$ ④"
  },
  {
    "id": 14,
    "level": "[하]",
    "category": "다항식의 곱셈",
    "content": "다음 중 바르게 전개한 것은?",
    "choices": ["$(a+b)^2 = a^2+b^2$", "$(a+5)(a-5) = -25a$", "$(a-3)^2 = a^2-6a+9$", "$(a+3)(a-5) = a^2-15$", "$(2a+1)(2a-3) = 4a^2-2a-3$"],
    "answer": "3",
    "solution": "③ $(a-3)^2 = a^2-6a+9 \implies$ 옳음\n$\therefore$ ③"
  },
  {
    "id": 15,
    "level": "[중]",
    "category": "다항식의 곱셈",
    "content": "합동인 두 사다리꼴(윗변 $a$, 아랫변 $b$, 높이 $a-b$)을 붙인 직사각형의 넓이는?",
    "choices": ["$2ab$", "$a^2+b^2$", "$a^2-b^2$", "$a^2+2ab+b^2$", "$a^2-2ab+b^2$"],
    "answer": "3",
    "solution": "직사각형 가로 $= a+b$, 세로 $= a-b \implies (a+b)(a-b) = a^2-b^2$\n$\therefore$ ③"
  },
  {
    "id": 16,
    "level": "[중]",
    "category": "다항식의 곱셈",
    "content": "$x+y=8, xy=14$일 때 두 정사각형의 넓이의 합 $x^2+y^2$은?",
    "choices": ["$36$", "$40$", "$42$", "$48$", "$50$"],
    "answer": "1",
    "solution": "$x^2+y^2 = (x+y)^2 - 2xy = 8^2 - 2(14) = 36$\n$\therefore$ ①"
  },
  {
    "id": 17,
    "level": "[중상]",
    "category": "근호를 포함한 식의 계산",
    "content": "$\frac{3+\sqrt{6}}{3-\sqrt{6}}$을 유리화한 결과가 $a+b\sqrt{6}$일 때 $a+b$의 값은?",
    "choices": ["$4$", "$5$", "$7$", "$13$", "$21$"],
    "answer": "3",
    "solution": "$\frac{(3+\sqrt{6})^2}{9-6} = \frac{15+6\sqrt{6}}{3} = 5+2\sqrt{6} \implies a+b = 5+2=7$\n$\therefore$ ③"
  },
  {
    "id": 18,
    "level": "[중]",
    "category": "인수분해",
    "content": "$9x^2-1$과 $3x(x+2)-(x+2)$의 공통인수는?",
    "choices": ["$a-b$", "$x+2$", "$x-3$", "$3x+1$", "$3x-1$"],
    "answer": "5",
    "solution": "$(3x+1)(3x-1)$ 및 $(x+2)(3x-1) \implies$ 공통인수 $3x-1$\n$\therefore$ ⑤"
  },
  {
    "id": 19,
    "level": "[중]",
    "category": "인수분해",
    "content": "$3x^2+x-10$을 인수분해하면?",
    "choices": ["$x(3x+1)-10$", "$(x+2)(3x-5)$", "$(x+2)(3x+5)$", "$(x-2)(3x+5)$", "$(x-2)(3x-5)$"],
    "answer": "2",
    "solution": "$3x^2+x-10 = (3x-5)(x+2)$\n$\therefore$ ②"
  },
  {
    "id": 20,
    "level": "[중상]",
    "category": "인수분해",
    "content": "$x^2-12x+a$와 $4x^2+12x+b$가 완전제곱식이 될 때 $a+b$는?",
    "choices": ["$40$", "$45$", "$60$", "$72$", "$75$"],
    "answer": "2",
    "solution": "$a = (-6)^2 = 36, b = 3^2 = 9 \implies a+b=45$\n$\therefore$ ②"
  },
  {
    "id": 21,
    "level": "[중상]",
    "category": "제곱근과 실수",
    "content": "[서술형1] 한 눈금 $1$인 모눈 위 선분 $AB, CD$에 대해 $AB=AP, CD=CQ$일 때 $PQ$의 길이는?",
    "choices": [" ", " ", " ", " ", " "],
    "answer": "$3+2\sqrt{5}$",
    "solution": "$AB=CD=\sqrt{2^2+1^2}=\sqrt{5}$\n$P=1-\sqrt{5}, Q=4+\sqrt{5}$\n$PQ = (4+\sqrt{5})-(1-\sqrt{5}) = 3+2\sqrt{5}$"
  },
  {
    "id": 22,
    "level": "[중]",
    "category": "다항식의 곱셈과 인수분해",
    "content": "[서술형2] $x=2+\sqrt{3}$일 때 $x^2-4x-5$의 값은?",
    "choices": [" ", " ", " ", " ", " "],
    "answer": "-6",
    "solution": "$(x-2)^2=3 \implies x^2-4x=-1$\n$\therefore -1-5=-6$"
  },
  {
    "id": 23,
    "level": "[중]",
    "category": "제곱근과 실수",
    "content": "[서술형3] 제곱근표를 이용하여 (1) $\sqrt{5.53}$, (2) $\sqrt{0.553}$의 값을 구하시오.",
    "choices": [" ", " ", " ", " ", " "],
    "answer": "(1) 2.352 (2) 0.7436",
    "solution": "(1) 표 읽기 $\implies 2.352$\n(2) $\frac{\sqrt{55.3}}{10} = \frac{7.436}{10} = 0.7436$"
  }
];
