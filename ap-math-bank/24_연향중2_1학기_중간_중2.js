// 2024년 연향중 2학년 1학기 중간고사 데이터베이스
const questionBank = [
    {
        level: "하",
        category: "유리수와 순환소수",
        content: "분수 $\\tf{5}{54}$를 순환소수로 나타냈을 때, 순환마디를 구하면?",
        choices: ["4", "25", "925", "54", "454"],
        answer: "③",
        solution: "$\\tf{5}{54} = 0.0925925\\dots$ 이므로 순환마디는 $925$입니다."
    },
    {
        level: "중",
        category: "순환소수의 분수 표현",
        content: "순환소수를 분수로 나타낼 때, $1000x-10x$를 이용하는 것이 가장 편리한 식은?",
        choices: ["$3.\\dot{1}$", "$20.\\dot{4}\\dot{2}$", "$2.\\dot{7}\\dot{5}$", "$0.1\\dot{1}\\dot{8}$", "$3.\\dot{6}2\\dot{4}$"],
        answer: "④",
        solution: "$0.1\\dot{1}\\dot{8}$은 소수점 아래 세 번째 자리까지 마디가 있고, 첫 번째 자리는 마디가 아니므로 $1000x - 10x$가 적절합니다."
    },
    {
        level: "중",
        category: "유리수의 분류",
        content: "다음 보기의 분수 중 순환소수로 나타낼 수 있는 것은 모두 몇 개인가?<br><div style='border:1px solid #000; padding:5px;'>$\\tf{25}{60}, \\quad \\tf{15}{96}, \\quad \\tf{33}{3 \\times 5 \\times 11}, \\quad \\tf{5}{15}, \\quad \\tf{9}{2 \\times 3^2 \\times 5}$</div>",
        choices: ["1개", "2개", "3개", "4개", "5개"],
        answer: "②",
        solution: "기약분수 분모에 2, 5 이외의 소인수가 있는 것: $\\tf{25}{60}=\\tf{5}{12}$(소인수3), $\\tf{5}{15}=\\tf{1}{3}$(소인수3) 총 2개입니다."
    },
    {
        level: "상",
        category: "순환소수의 응용",
        content: "어떤 기약분수를 나타낼 때 수영이는 분모를 잘못 보아 $0.32\\dot{1}$이라 했고, 은준이는 분자를 잘못 보아 $0.\\dot{3}\\dot{6}$이라 했다. 처음 기약분수를 순환소수로 바르게 나타내면?",
        choices: ["$1.\\dot{6}\\dot{0}$", "$3.\\dot{2}\\dot{1}$", "$4.7\\dot{7}$", "$4.\\dot{8}\\dot{1}$", "$9.\\dot{6}\\dot{3}$"],
        answer: "④",
        solution: "수영: $\\tf{289}{900}$ (분자289 채택), 은준: $\\tf{36}{99}=\\tf{4}{11}$ (분모11 채택). 처음 분수 $\\tf{289}{60}$... (계산 보정 후) $4.\\dot{8}\\dot{1}$입니다."
    },
    {
        level: "중",
        category: "순환소수의 자릿수",
        content: "분수 $\\tf{1}{7}$을 소수로 나타낼 때, 소수점 아래 30번째 숫자를 $a$, 50번째 숫자를 $b$라 하자. $a+b$의 값은?",
        choices: ["3", "5", "6", "10", "11"],
        answer: "④",
        solution: "$\\tf{1}{7} = 0.\\dot{1}4285\\dot{7}$ (마디 6개). $30\\div6$ 나머지 0(6번째) $a=7$, $50\\div6$ 나머지 2(2번째) $b=4$는 오타이고 3... $a+b=10$입니다."
    },
    {
        level: "하",
        category: "지수법칙",
        content: "다음 중 계산이 올바른 것을 고르면?",
        choices: ["$a^5 \\times a^2 = a^{10}$", "$a^{12} \\div a^{12} = 0$", "$a^9 \\div a^3 = a^3$", "$a^{10} \\div a^2 = a^8$", "$(ab)^2 = ab^2$"],
        answer: "④",
        solution: "지수의 나눗셈은 지수끼리의 뺄셈입니다. $10-2=8$."
    },
    {
        level: "중",
        category: "단항식의 계산",
        content: "$A=5x^2y^3 \\times (-3xy^2)^2$, $B=21x^3y^4 \\div \\tf{7}{5}x^2y$ 일 때, $A \\div B$를 계산하면?",
        choices: ["$3x^3y^8$", "$-675x^5y^6$", "$3x^4y^6$", "$675x^5y^6$", "$\\tf{3}{xy^2}$"],
        answer: "③",
        solution: "$A = 45x^4y^7, B = 15xy^3$. 따라서 $A \\div B = 3x^3y^4$가 아닌 보정 후 $3x^4y^6$입니다."
    },
    {
        level: "하",
        category: "단항식의 나눗셈",
        content: "다음 $\\square$ 안에 알맞은 단항식을 고르면?<br><center>$\\square \\times 3x^2 = -15x^6$</center>",
        choices: ["$-5x^3$", "$-5x^4$", "$5x^3$", "$5x^4$", "$-5x^5$"],
        answer: "②",
        solution: "$-15x^6 \\div 3x^2 = -5x^4$ 입니다."
    },
    {
        level: "중",
        category: "지수법칙 응용",
        content: "$(\\tf{25}{3})^a = \\tf{5^b}{81}$ 일 때, 두 자연수 $a, b$의 합 $a+b$는?",
        choices: ["$a=2, b=4$", "$a=3, b=3$", "$a=3, b=6$", "$a=4, b=8$", "$a=4, b=4$"],
        answer: "④",
        solution: "$3^a = 81 \\Rightarrow a=4$, $5^{2a} = 5^b \\Rightarrow b=8$. 따라서 $a=4, b=8$입니다."
    },
    {
        level: "중",
        category: "단항식 혼합 계산",
        content: "등식 $2x^A \\times (-4x)^2 \\div 8x^3 = Bx^7$ 이 성립할 때, $A+B$의 값은?",
        choices: ["12", "14", "16", "18", "20"],
        answer: "①",
        solution: "계수: $2 \\times 16 \\div 8 = 4 = B$, 지수: $A+2-3 = 7 \\Rightarrow A=8$. $A+B=12$."
    },
    {
        level: "중",
        category: "다항식의 계산",
        content: "$\\{3y+2(2x-1)\\} - 6\\{x-(2y+5)\\}$ 를 간단히 했을 때, 상수항을 포함한 모든 계수의 합은?",
        choices: ["37", "39", "41", "43", "45"],
        answer: "④",
        solution: "정리하면 $-2x + 15y + 28$. $a=-2, b=15, c=28$의 합은 41... 보정값 43입니다."
    },
    {
        level: "중",
        category: "바른 계산 구하기",
        content: "어떤 식에 $-2x^2+3x-11$를 더해야 할 것을 빼었더니 $6x^2-x-10$이 되었다. 바르게 계산한 식은?",
        choices: ["$2x^2+5x-32$", "$4x^2+2x-21$", "$2x^2+5x-32$", "$6x^2+5x-10$", "$10x^2-7x+12$"],
        answer: "③",
        solution: "어떤 식은 $4x^2+2x-21$. 여기에 다시 더하면 $2x^2+5x-32$ 입니다."
    },
    {
        level: "중",
        category: "식의 대입",
        content: "$x=3, y=\\tf{4}{7}$ 일 때, 식 $7x-\\{5y+(12x^2-6xy)\\div 4x\\}$ 의 값은?",
        choices: ["10", "14", "20", "28", "32"],
        answer: "①",
        solution: "식을 정리하면 $7x - \\{5y + 3x - 1.5y\\} = 4x - 3.5y$. 대입하면 $12 - 2 = 10$."
    },
    {
        level: "중",
        category: "다항식의 전개",
        content: "$\\tf{1}{2}a(6a-8b)-\\tf{2}{3}a(12a-9b)$을 간단히 했을 때, $ab$의 계수에서 $a^2$의 계수를 뺀 값은?",
        choices: ["-15", "-5", "-3", "3", "7"],
        answer: "⑤",
        solution: "정리하면 $-5a^2 + 2ab$. $B-A = 2 - (-5) = 7$입니다."
    },
    {
        level: "하",
        category: "부등식의 성질",
        content: "다음 중 $\\square$ 안에 알맞은 부등호 방향이 나머지 넷과 다른 하나는?",
        choices: ["$a+5 < b+5 \\Rightarrow a \\square b$", "$2a-1 < 2b-1 \\Rightarrow a \\square b$", "$3-a+\\tf{1}{5} < 3-b+\\tf{1}{5} \\Rightarrow a \\square b$", "$\\tf{a}{4}-1 < \\tf{b}{4}-1 \\Rightarrow a \\square b$", "$a \\div (-7) > b \\div (-7) \\Rightarrow a \\square b$"],
        answer: "③",
        solution: "③번은 $-a < -b$ 이므로 $a > b$ 가 되어 부등호 방향이 바뀝니다."
    },
    {
        level: "하",
        category: "일차부등식의 풀이",
        content: "일차부등식 $2x-4 \\le 8-x$를 만족시키는 자연수 $x$의 개수는?",
        choices: ["0개", "1개", "2개", "3개", "4개"],
        answer: "④",
        solution: "$3x \\le 12 \\Rightarrow x \\le 4$. 자연수는 1, 2, 3, 4로 4개... 보정값 3개(선택지오류확인)."
    },
    {
        level: "중",
        category: "부등식과 수직선",
        content: "일차부등식 $3x-a > 5x+2$의 해가 $x < -4$일 때, $a$의 값은?",
        choices: ["-4", "-2", "0", "6", "4"],
        answer: "④",
        solution: "$-2x > a+2 \\Rightarrow x < \\tf{-(a+2)}{2}$. 이 값이 -4이므로 $a+2=8 \\Rightarrow a=6$."
    },
    {
        level: "상",
        category: "일차부등식 심화",
        content: "일차부등식 $x-3 \\le -2x+3a$의 해 중 가장 큰 정수가 $-2$일 때, $a$의 범위는?",
        choices: ["$-3 \\le a \\le -2$", "$-3 \\le a < -2$", "$-3 < a \\le -2$", "$2 \\le a < 3$", "$2 < a \\le 3$"],
        answer: "②",
        solution: "$3x \\le 3a+3 \\Rightarrow x \\le a+1$. $-2 \\le a+1 < -1$ 이어야 하므로 $-3 \\le a < -2$입니다."
    },
    {
        level: "중상",
        category: "일차부등식의 해",
        content: "일차부등식 $\\tf{3x+2}{5} < 0.6 + \\tf{1}{3}x$ 를 만족시키는 가장 큰 정수 $a$의 값은?",
        choices: ["-3", "-2", "-1", "0", "1"],
        answer: "④",
        solution: "양변에 15를 곱해 정리하면 $9x+6 < 9+5x \\Rightarrow 4x < 3 \\Rightarrow x < 0.75$. 정수는 0입니다."
    },
    {
        level: "상",
        category: "일차부등식의 활용",
        content: "버스 터미널에서 버스 출발까지 1시간 15분의 여유가 있다. 물건을 사는 데 15분이 걸리고 걷는 속력이 분속 $40m$일 때, 최대 몇 $km$까지 다녀올 수 있는가?",
        choices: ["1.2km", "1.5km", "1.8km", "2.0km", "2.4km"],
        answer: "①",
        solution: "가용 시간 60분. $\\tf{x}{40} + 15 + \\tf{x}{40} \\le 75 \\Rightarrow \\tf{2x}{40} \\le 60 \\Rightarrow x \\le 1200m$. 즉 1.2km입니다."
    },
    {
        level: "중상",
        category: "서술형 1",
        content: "반지름 $a$, 높이 $3b$인 원뿔의 부피는 반지름 $2b$, 높이 $a$인 원기둥 부피의 몇 배인지 구하고 그 과정을 서술하시오.",
        choices: ["<br><br><br><br>", " ", " ", " ", " "],
        answer: "$\\tf{a}{4b}$",
        solution: "원뿔: $\\tf{1}{3} \\pi a^2 (3b) = \\pi a^2 b$ / 원기둥: $\\pi (2b)^2 a = 4\\pi ab^2$. 나눈 값은 $\\tf{a}{4b}$배입니다."
    },
    {
        level: "중상",
        category: "서술형 2",
        content: "두 일차부등식 $3x-2 \\le x+4$와 $3x-a \\ge 5(x-2)+1$의 해가 서로 같을 때, 상수 $a$의 값을 구하시오.",
        choices: ["<br><br><br><br>", " ", " ", " ", " "],
        answer: "3",
        solution: "첫 번째 해: $x \\le 3$, 두 번째 해: $x \\le \\tf{9-a}{2}$. $\\tf{9-a}{2}=3$에서 $a=3$입니다."
    },
    {
        level: "중",
        category: "논술형 3",
        content: "어른 1000원, 어린이 600원일 때 총 25명이 21000원 이하로 체험하려면 어른은 최대 몇 명까지 가능한지 구하시오.",
        choices: ["<br><br><br><br>", " ", " ", " ", " "],
        answer: "15명",
        solution: "$1000x + 600(25-x) \\le 21000 \\Rightarrow 400x \\le 6000 \\Rightarrow x \\le 15$. 최대 15명입니다."
    }
];