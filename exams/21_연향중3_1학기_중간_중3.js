window.examTitle = "21_연향중3_1학기_중간_수학";

window.questionBank = [
  {
    "id": 1,
    "level": "[중]",
    "category": "제곱근과 실수",
    "content": "다음 <보기> 중 옳은 것을 모두 고른 것은? <div class='box'><보기><br>ㄱ. $\sqrt{16}=\pm4$<br>ㄴ. $\sqrt{(-2)^{2}}=2$<br>ㄷ. 9의 제곱근은 $\pm3$이다.<br>ㄹ. $\sqrt{16}$의 제곱근은 $\pm4$이다.</div>",
    "choices": ["ㄱ, ㄴ", "ㄱ, ㄹ", "ㄴ, ㄷ", "ㄷ, ㄹ", "ㄱ, ㄴ, ㄷ"],
    "answer": "3",
    "solution": "ㄱ. $\sqrt{16}=4$이므로 거짓이다. \nㄴ. $\sqrt{(-2)^{2}}=\sqrt{4}=2$이므로 참이다. \nㄷ. $(\pm3)^{2}=9$이므로 9의 제곱근은 $\pm3$이다. 참이다. \nㄹ. $\sqrt{16}=4$의 제곱근은 $\pm2$이다. 거짓이다. \n\implies \text{따라서 옳은 것은 ㄴ, ㄷ이다.}"
  },
  {
    "id": 2,
    "level": "[중]",
    "category": "제곱근과 실수",
    "content": "$\sqrt{32}$의 값은 $5.657$, $\sqrt{3.2}$의 값은 $1.789$일 때, $\sqrt{320}$의 값은?",
    "choices": ["0.01789", "0.5657", "17.89", "56.57", "178.9"],
    "answer": "3",
    "solution": "$\sqrt{320} = \sqrt{3.2 \times 100} = 10\sqrt{3.2}$ \n$\sqrt{3.2} = 1.789$이므로 \n$10 \times 1.789 = 17.89$ \n\therefore 17.89"
  },
  {
    "id": 3,
    "level": "[중]",
    "category": "근호를 포함한 식의 계산",
    "content": "$\sqrt{75}+9\sqrt{2}-\sqrt{32}-4\sqrt{3} = a\sqrt{2}+b\sqrt{3}$일 때, 유리수 $a, b$에 대하여 $a-b$의 값은?",
    "choices": ["1", "2", "3", "4", "5"],
    "answer": "4",
    "solution": "좌변을 정리하면: \n$\sqrt{75} = 5\sqrt{3}$ \n$\sqrt{32} = 4\sqrt{2}$ \n$5\sqrt{3} + 9\sqrt{2} - 4\sqrt{2} - 4\sqrt{3} = (9-4)\sqrt{2} + (5-4)\sqrt{3} = 5\sqrt{2} + 1\sqrt{3}$ \n$a=5, b=1$ \n\implies a-b = 5-1 = 4"
  },
  {
    "id": 4,
    "level": "[중]",
    "category": "제곱근과 실수",
    "content": "다음 중 두 실수의 대소 관계가 옳은 것은?",
    "choices": ["$\sqrt{15}>4$", "$3\sqrt{3}<\sqrt{26}$", "$3-\sqrt{12}>-3$", "$2-\sqrt{3}<2-\sqrt{2}$", "$2\sqrt{3}-1>3\sqrt{2}-1$"],
    "answer": "4",
    "solution": "① $\sqrt{15} < \sqrt{16}=4$ (거짓) \n② $3\sqrt{3} = \sqrt{27} > \sqrt{26}$ (거짓) \n③ $3-\sqrt{12} \approx 3-3.46 = -0.46 > -3$ (참이나 선택지 형식 확인 필요, 양변에 3을 더하면 $6>\sqrt{12}$로 참) \n④ $-\sqrt{3} < -\sqrt{2}$이므로 양변에 2를 더하면 $2-\sqrt{3} < 2-\sqrt{2}$ (참) \n⑤ $2\sqrt{3} = \sqrt{12}$, $3\sqrt{2} = \sqrt{18}$이므로 $\sqrt{12} < \sqrt{18}$ (거짓) \n\therefore \text{옳은 것은 4번이다.}"
  },
  {
    "id": 5,
    "level": "[중]",
    "category": "제곱근과 실수",
    "content": "다음 중 그 값이 나머지 넷과 다른 하나는?",
    "choices": ["제곱근 25", "$(-5)$의 제곱근", "$\sqrt{25}$의 제곱근의 제곱", "제곱하여 25가 되는 수", "$x^{2}=25$를 만족시키는 $x$의 값"],
    "answer": "1",
    "solution": "① 제곱근 25 = $\sqrt{25} = 5$ \n② $(-5)^2$의 제곱근 = 25의 제곱근 = $\pm5$ \n③ $\sqrt{25}$의 제곱근의 제곱 = (5의 제곱근)$^{2}$ = $(\pm\sqrt{5})^{2} = 5$ \n④ 제곱하여 25가 되는 수 = 25의 제곱근 = $\pm5$ \n⑤ $x^2=25 \implies x=\pm5$ \n\implies \text{원문 텍스트의 불분명함이 있으나 1번은 5, 나머지는 }\pm5\text{를 의도한 것으로 판단됨.}"
  },
  {
    "id": 6,
    "level": "[중상]",
    "category": "근호를 포함한 식의 계산",
    "content": "$a<0$일 때, $\sqrt{(-4a)^{2}}-\sqrt{9a^{2}}+\sqrt{(-a)^{2}}$을 간단히 하면?",
    "choices": ["-8a", "-2a", "0", "2a", "8a"],
    "answer": "2",
    "solution": "$a<0$이므로: \n1) $\sqrt{(-4a)^{2}} = |-4a| \implies -4a$ \n2) $\sqrt{9a^{2}} = |3a| \implies -3a$ \n3) $\sqrt{(-a)^{2}} = |-a| \implies -a$ \n식: $(-4a) - (-3a) + (-a) = -4a + 3a - a = -2a$"
  },
  {
    "id": 7,
    "level": "[중]",
    "category": "근호를 포함한 식의 계산",
    "content": "한 변의 길이가 각각 $\sqrt{5}m$, $2m$인 정사각형 모양의 두 화단이 있다. 이 두 화단의 넓이의 합과 같은 넓이를 갖는 정사각형 모양의 화단을 새로 만들 때, 새로 만들어진 화단의 한 변의 길이는?",
    "choices": ["$2m$", "$\sqrt{5}m$", "$\sqrt{6}m$", "$\sqrt{7}m$", "$3m$"],
    "answer": "5",
    "solution": "첫 번째 화단의 넓이: $(\sqrt{5})^{2} = 5$ \n두 번째 화단의 넓이: $2^{2} = 4$ \n새 화단의 넓이: $5 + 4 = 9$ \n한 변의 길이를 $x$라 하면 $x^{2} = 9 \implies x=3$"
  },
  {
    "id": 8,
    "level": "[중]",
    "category": "제곱근과 실수",
    "content": "다음 중 옳지 않은 것은?",
    "choices": ["$\sqrt{5}$와 $\sqrt{6}$ 사이에는 무리수가 있다.", "$\tf{1}{2}$과 $\tf{2}{3}$ 사이에는 유리수가 있다.", "2와 5 사이에는 무수히 많은 유리수가 있다.", "무리수만으로 수직선을 완전히 메울 수 있다.", "서로 다른 두 유리수 사이에는 무수히 많은 무리수가 있다."],
    "answer": "4",
    "solution": "④ 수직선은 유리수와 무리수를 합친 '실수' 전체로 완전히 메워진다. 무리수만으로는 메울 수 없다."
  },
  {
    "id": 9,
    "level": "[중]",
    "category": "근호를 포함한 식의 계산",
    "content": "$6\sqrt{3}-\sqrt{75}+\sqrt{45}-4\sqrt{5}=a\sqrt{3}+b\sqrt{5}$ 일 때, $a+b$의 값은?",
    "choices": ["-3", "-2", "0", "2", "3"],
    "answer": "3",
    "solution": "좌변을 정리하면: \n$6\sqrt{3} - 5\sqrt{3} + 3\sqrt{5} - 4\sqrt{5} = 1\sqrt{3} - 1\sqrt{5}$ \n$a=1, b=-1 \implies a+b = 0$"
  },
  {
    "id": 10,
    "level": "[중상]",
    "category": "근호를 포함한 식의 계산",
    "content": "$a=\sqrt{32}-\tf{4}{\sqrt{2}}$, $b=\tf{\sqrt{6}}{4\sqrt{3}}+\tf{1}{2\sqrt{2}}$ 일 때, $ab$의 값은?",
    "choices": ["$\sqrt{2}$", "$\sqrt{3}$", "2", "4", "4\sqrt{3}"],
    "answer": "3",
    "solution": "$a = 4\sqrt{2} - 2\sqrt{2} = 2\sqrt{2}$ \n$b = \tf{\sqrt{2}}{4} + \tf{\sqrt{2}}{4} = \tf{\sqrt{2}}{2}$ \n$ab = 2\sqrt{2} \times \tf{\sqrt{2}}{2} = 2$"
  },
  {
    "id": 11,
    "level": "[중상]",
    "category": "근호를 포함한 식의 계산",
    "content": "다음 그림과 같이 넓이가 각각 $18\text{ cm}^{2}$, $32\text{ cm}^{2}$, $49\text{ cm}^{2}$인 세 정사각형을 이어 붙여 새로운 도형을 만들었다. 이 도형의 둘레의 길이는?",
    "choices": ["$(6\sqrt{2}+28)\text{cm}$", "$(14\sqrt{2}+28)\text{cm}$", "$(12\sqrt{2}+28)\text{cm}$", "$(20\sqrt{2}+28)\text{cm}$", "$(26\sqrt{2}+28)\text{cm}$"],
    "answer": "2",
    "solution": "각 정사각형의 한 변의 길이는 $\sqrt{18}=3\sqrt{2}$, $\sqrt{32}=4\sqrt{2}$, $\sqrt{49}=7$이다. \n둘레 $= 2(3\sqrt{2} + 4\sqrt{2} + 7) + 2(7) = 14\sqrt{2} + 28$"
  },
  {
    "id": 12,
    "level": "[중]",
    "category": "다항식의 곱셈",
    "content": "$(3x-5)(ax+3)$의 전개식에서 $x$의 계수가 $19$일 때, $x^{2}$의 계수는?",
    "choices": ["-6", "0", "4", "42", "54"],
    "answer": "1",
    "solution": "$9-5a = 19 \implies a = -2$. $x^{2}$의 계수는 $3a = -6$."
  },
  {
    "id": 13,
    "level": "[중]",
    "category": "다항식의 곱셈",
    "content": "$(x+a)^{2}=x^{2}+bx+\tf{1}{16}$일 때, $b-a$의 값은? (단, $a>0$)",
    "choices": ["$\tf{1}{8}$", "$\tf{1}{4}$", "$\tf{1}{16}$", "$\tf{1}{2}$", "1"],
    "answer": "2",
    "solution": "$a^{2} = \tf{1}{16} \implies a = \tf{1}{4}$. $b = 2a = \tf{1}{2}$. \n$b-a = \tf{1}{4}$."
  },
  {
    "id": 14,
    "level": "[중]",
    "category": "다항식의 곱셈",
    "content": "가로 $3x+2$, 세로 $2x+1$, 높이 $3x-2$인 직육면체의 겉넓이는?",
    "choices": ["$21x^{2}+6x-4$", "$21x^{2}+6x-8$", "$42x^{2}+12x-8$", "$42x^{2}+12x-16$", "$42x^{2}+12x-32$"],
    "answer": "3",
    "solution": "$2\{(3x+2)(2x+1) + (2x+1)(3x-2) + (3x-2)(3x+2)\} = 42x^{2}+12x-8$"
  },
  {
    "id": 15,
    "level": "[중]",
    "category": "다항식의 곱셈",
    "content": "$(x+y+2)(x+y-1)$을 전개하면?",
    "choices": ["$x^{2}+2xy+y^{2}+x-y+2$", "$x^{2}+2xy+y^{2}+x+y-2$", "$x^{2}-2xy+y^{2}-x+y-2$", "$x^{2}+2xy-y^{2}+x-y-2$", "$x^{2}+2xy+y^{2}-x-y-2$"],
    "answer": "2",
    "solution": "$(x+y)^{2} + (x+y) - 2 = x^{2}+2xy+y^{2}+x+y-2$"
  },
  {
    "id": 16,
    "level": "[중상]",
    "category": "인수분해",
    "content": "$4x^{2}-4y^{2}$와 $a(x+y)-b(x+y)$의 공통인 인수는?",
    "choices": ["$x+y$", "$x-y$", "$2x+y$", "$2x-2y$", "$a-b$"],
    "answer": "1",
    "solution": "$4(x+y)(x-y)$와 $(a-b)(x+y)$의 공통인수는 $x+y$."
  },
  {
    "id": 17,
    "level": "[하]",
    "category": "인수분해",
    "content": "$9x^{2}-36$을 인수분해하면?",
    "choices": ["$3(x+6)(x-2)$", "$3(x+2)(x-6)$", "$(3x+6)(x-2)$", "$9(x^{2}-4)$", "$9(x+2)(x-2)$"],
    "answer": "5",
    "solution": "$9(x^{2}-4) = 9(x+2)(x-2)$"
  },
  {
    "id": 18,
    "level": "[중상]",
    "category": "인수분해",
    "content": "넓이가 $3x^{2}+axy-4y^{2}$인 직사각형의 가로가 $x+2y$일 때, 둘레의 길이는?",
    "choices": ["$4x$", "$8x$", "$8x+4y$", "$8y$", "$4xy$"],
    "answer": "2",
    "solution": "세로 $= 3x-2y$. 둘레 $= 2(x+2y + 3x-2y) = 8x$."
  },
  {
    "id": 19,
    "level": "[상]",
    "category": "제곱근과 실수",
    "content": "$a>b, ab<0$일 때, $\sqrt{(b-a)^{2}}+\sqrt{(-3a)^{2}}+\sqrt{(-2b)^{2}}+|ab|$를 간단히 하면?",
    "choices": ["$-2a+3b$", "$-4a-3b$", "$4a+3b+ab$", "$4a-3b-ab$", "$-4a-3b-ab$"],
    "answer": "4",
    "solution": "$(a-b) + 3a - 2b - ab = 4a-3b-ab$."
  },
  {
    "id": 20,
    "level": "[상]",
    "category": "인수분해",
    "content": "$a^{2}x^{2}-a^{2}x-2ax^{2}-6a^{2}+2ax+12a$의 인수가 아닌 것은?",
    "choices": ["$x+3$", "$x-3$", "$x+2$", "$a-2$", "$a$"],
    "answer": "1",
    "solution": "$a(a-2)(x-3)(x+2)$로 인수분해됨."
  },
  {
    "id": 21,
    "level": "[중상]",
    "category": "확률",
    "content": "[서술형 1] 주사위 $a, b$에 대해 $\sqrt{48ab}$가 자연수가 될 확률을 구하시오.",
    "choices": [" ", " ", " ", " ", " "],
    "answer": "$\tf{5}{36}$",
    "solution": "$ab=3, 12, 27$인 경우를 구하면 총 5가지. \therefore \tf{5}{36}$"
  },
  {
    "id": 22,
    "level": "[중상]",
    "category": "유리수",
    "content": "[서술형 2] $\tf{a}{\sqrt{3}}(\sqrt{6}-5\sqrt{3})-3\sqrt{2}$가 유리수가 되도록 하는 유리수 $a$의 값은?",
    "choices": [" ", " ", " ", " ", " "],
    "answer": "3",
    "solution": "$(a-3)\sqrt{2}-5a$에서 $a-3=0 \implies a=3$."
  },
  {
    "id": 23,
    "level": "[중]",
    "category": "다항식",
    "content": "[서술형 3] $(x+4y)(2x-5y+1)$의 전개식에서 $y$의 계수를 구하시오.",
    "choices": [" ", " ", " ", " ", " "],
    "answer": "4",
    "solution": "$4y \times 1 = 4y$. 계수는 4."
  },
  {
    "id": 24,
    "level": "[중]",
    "category": "인수분해",
    "content": "[서술형 4] $4x^{2}-7x-15$의 두 일차식 인수의 합을 구하시오.",
    "choices": [" ", " ", " ", " ", " "],
    "answer": "5x+2",
    "solution": "$(x-3)+(4x+5) = 5x+2$."
  }
];
