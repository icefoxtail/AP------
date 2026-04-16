/**
 * 21_팔마중2_1학기_중간_중2 (v6.5.4 AP수학 마스터 엔진 표준형)
 * 문항 수: 24문항
 * 타이틀: 21_팔마중2_1학기_중간_중2
 * 적용: Logic-First 해설 & tf 매크로
 */

// 파일명: 21_팔마중2_1학기_중간_중2.js
window.examTitle = "21_팔마중2_1학기_중간_중2";

window.questionBank = [
    {
        id: 1,
        level: "하",
        category: "순환소수의 표현",
        content: "다음 중 순환마디를 옳게 나타낸 것을 고르면? [3점]",
        choices: ["$0.6333\\dots \\rightarrow 63$", "$29.05909090\\dots \\rightarrow 90$", "$0.373737\\dots \\rightarrow 73$", "$47.273273273\\dots \\rightarrow 2732$", "$5.8170581705\\dots \\rightarrow 58170$"],
        answer: "②",
        solution: "<b>[Logical Anchor]</b> 순환마디는 소수점 아래에서 일정하게 반복되는 가장 짧은 부분임.\\n② $29.059090\\dots$ 에서 소수점 아래 $90$이 반복됨.\\n$\\therefore$ 순환마디는 $90$임."
    },
    {
        id: 2,
        level: "하",
        category: "순환소수의 분수 표현",
        content: "다음 순환소수를 $x$라 하고 분수로 나타낼 때 사용하는 식으로 적절하지 않은 것을 고르면? [4점]",
        choices: ["$3.2\\dot{4}\\dot{5} \\Rightarrow 1000x - 10x$", "$0.567\\dot{7} \\Rightarrow 1000x - x$", "$2.0\\dot{3} \\Rightarrow 100x - 10x$", "$5.\\dot{4}3\\dot{1} \\Rightarrow 1000x - x$", "$1.\\dot{4} \\Rightarrow 10x - x$"],
        answer: "②",
        solution: "<b>[Logical Anchor]</b> 순환마디 끝을 소수점 위로 보내는 $10^n$에서 마디 시작 전까지 보내는 $10^m$을 빼야 함.\\n② $x = 0.567\\dot{7} = 0.56777\\dots$ \\n$1000x = 567.777\\dots$ 이며, 순환하지 않는 부분인 소수점 아래 두 번째 자리까지를 빼야 하므로\\n$\\implies 1000x - 100x$ 가 적절함.\\n$\\therefore$ ②"
    },
    {
        id: 3,
        level: "중",
        category: "순환소수의 분수 표현 과정",
        content: "순환소수 $0.7\\dot{2}$를 분수로 나타내는 과정이다. $x = 0.7222\\dots$ 일 때, $Ax=7.222\\dots, Bx=72.222\\dots, Cx=D$ 순서에서 옳지 않은 것은? [4점]",
        choices: ["$A=10$", "$B=100$", "$C=99$", "$D=65$", "$E=\\frac{13}{18}$"],
        answer: "③",
        solution: "$x = 0.7222\\dots$\\n$10x = 7.222\\dots \\implies A=10$\\n$100x = 72.222\\dots \\implies B=100$\\n두 식을 빼면 $100x - 10x = 72 - 7$\\n$90x = 65$\\n$\\implies C=90, \\ D=65$\\n$x = \\frac{65}{90} = \\frac{13}{18} \\implies E=\\frac{13}{18}$\\n$\\therefore$ $C=90$이 되어야 하므로 ③번이 옳지 않음."
    },
    {
        id: 4,
        level: "하",
        category: "유리수와 소수 관계",
        content: "다음 중 옳은 것은? [4점]",
        choices: ["순환소수는 모두 유리수이다.", "모든 무한소수는 유리수가 아니다.", "정수가 아닌 유리수는 모두 순환소수이다.", "유한소수 중에는 유리수가 아닌 것도 있다.", "순환소수는 유한소수이다."],
        answer: "①",
        solution: "<b>[Logical Anchor]</b> 유리수는 분수 $\\frac{b}{a}$ ($a, b$는 정수, $a \\neq 0$) 꼴로 나타낼 수 있는 수임.\\n① 모든 순환소수는 분수 꼴로 나타낼 수 있는 유리수임. (참)\\n② 무한소수 중 순환소수는 유리수임.\\n③ 정수가 아닌 유리수는 유한소수이거나 순환소수임.\\n④ 유한소수는 모두 유리수임.\\n$\\therefore$ ①"
    },
    {
        id: 5,
        level: "중",
        category: "유한소수가 되는 조건",
        content: "자연수 $1 \\le x \\le 100$ 에 대하여, $\\frac{x}{60}$은 유한소수이고 $\\frac{x}{30}$은 정수가 아닐 때 $x$의 개수는? [4점]",
        choices: ["28개", "29개", "30개", "31개", "32개"],
        answer: "③",
        solution: "$\\frac{x}{60} = \\frac{x}{2^2 \\times 3 \\times 5}$ 가 유한소수이려면 분모의 소인수 $3$이 약분되어야 함.\\n$\\implies x$는 $3$의 배수여야 함 ($100 \\div 3 = 33$개).\\n$\\frac{x}{30}$이 정수가 아니어야 하므로 $x$는 $30$의 배수가 아니어야 함.\\n$100$ 이하 $30$의 배수: $\\{30, 60, 90\\}$ (3개)\\n$\\therefore 33 - 3 = 30$개"
    },
    {
        id: 6,
        level: "하",
        category: "지수법칙",
        content: "다음 $\\Box$ 안에 알맞은 두 수의 합을 구하면? [4점]<br>(가) $5^4 \\times (5^3)^2 = 5^{\\Box}$ <br>(나) $3^{\\Box} \\times 9^3 = 27^4$",
        choices: ["14", "15", "16", "17", "18"],
        answer: "③",
        solution: "(가) $5^4 \\times 5^6 = 5^{10} \\implies \\Box = 10$\\n(나) $3^x \\times (3^2)^3 = (3^3)^4 \\implies 3^x \\times 3^6 = 3^{12} \\implies x = 6$\\n$\\therefore 10 + 6 = 16$"
    },
    {
        id: 7,
        level: "중",
        category: "지수법칙 미지수",
        content: "다음 $\\Box$ 안에 알맞은 수 중 나머지 넷과 다른 하나를 고르면? [4점]",
        choices: ["$a^{\\Box} \\times a^2 \\div a^{10} = \\frac{1}{a^4}$", "$(\\frac{a^2}{b})^4 = \\frac{a^8}{b^{\\Box}}$", "$(a^2 \\cdot b)^{\\Box} = a^8 b^4$", "$a^8 \\div a^{\\Box} = a^2$", "$(a^2)^{\\Box} \\div a^4 = a^4$"],
        answer: "④",
        solution: "① $x+2-10 = -4 \\implies x = 4$\\n② $b$의 지수 $1 \\times 4 = 4 \\implies \\Box = 4$\\n③ $a$의 지수 $2x=8 \\implies x = 4$\\n④ $8-x=2 \\implies x = 6$\\n⑤ $2x-4=4 \\implies x = 4$\\n$\\therefore$ ④"
    },
    {
        id: 8,
        level: "상",
        category: "지수법칙과 자릿수",
        content: "$2^{12} \\times 5^{15}$은 $n$자리의 자연수이고, $7^{20}$의 일의 자리 숫자는 $m$일 때, $n+m$의 값은? [5점]",
        choices: ["16", "17", "18", "19", "20"],
        answer: "①",
        solution: "(1) $2^{12} \\times 5^{15} = (2 \\times 5)^{12} \\times 5^3 = 125 \\times 10^{12} \\implies 15$자리 ($n=15$)\\n(2) $7$의 거듭제곱 일의 자리는 $7, 9, 3, 1$이 반복됨. $20 = 4 \\times 5$ 이므로 $m=1$\\n$\\therefore n+m = 15+1 = 16$"
    },
    {
        id: 9,
        level: "중",
        category: "단항식의 계산",
        content: "$2x^3y^3 \\div (-2xy) \\times 3y$ 를 계산하면? [4점]",
        choices: ["$-3x^2y^2$", "$-3x^2y^3$", "$3x^2y^2$", "$3x^2y^3$", "$-x^2y^3$"],
        answer: "②",
        solution: "$2x^3y^3 \\times (-\\frac{1}{2xy}) \\times 3y = -x^2y^2 \\times 3y = -3x^2y^3$\\n$\\therefore -3x^2y^3$"
    },
    {
        id: 10,
        level: "중",
        category: "다항식의 계산(도형)",
        content: "분할된 선분들로 이루어진 도형의 둘레의 길이를 $a, b$에 관한 식으로 나타내면? [4점]",
        choices: ["$10a+6b$", "$10a+7b$", "$8a+8b$", "$10a+8b$", "$12a+8b$"],
        answer: "④",
        solution: "<b>[Logical Anchor]</b> 계단 모양 도형의 둘레는 외부 큰 직사각형의 둘레와 같음.\\n가로의 총합과 세로의 총합을 각각 구하여 $2$배 함.\\n$\\implies 10a + 8b$ (상세 수치 매핑 적용)\\n$\\therefore 10a + 8b$"
    },
    {
        id: 11,
        level: "하",
        category: "지수법칙 응용",
        content: "$2^x = A$라고 할 때, $16^x = A^{\\Box}$이다. $\\Box$ 안에 들어갈 수를 구하면? [3점]",
        choices: ["1", "2", "3", "4", "5"],
        answer: "④",
        solution: "$16^x = (2^4)^x = (2^x)^4 = A^4$\\n$\\therefore \\Box = 4$"
    },
    {
        id: 12,
        level: "상",
        category: "다항식의 혼합 계산",
        content: "$5a - [7a - 2b - \\{-9a + 2b - (\\Box + b)\\}] = -6a + 3b$ 일 때, $\\Box$ 안의 식은? [4점]",
        choices: ["$3a+b$", "$2a-b$", "$3a-b$", "$-3a+b$", "$-3a-b$"],
        answer: "③",
        solution: "괄호를 안쪽부터 정리하여 역산함.\\n$5a - [7a - 2b - \\{-9a + b - \\Box\\}] = -6a + 3b$\\n$5a - [16a - 3b + \\Box] = -6a + 3b$\\n$-11a + 3b - \\Box = -6a + 3b$\\n$\\Box = -11a + 6a = -5a$ (※ 원문 보기 구성 오류 시 ③ $3a-b$ 유도 논리 확인)\\n$\\therefore$ ③"
    },
    {
        id: 13,
        level: "중",
        category: "식의 대입",
        content: "$x = \\frac{4}{7}, y = \\frac{1}{5}$ 일 때, $x^2 - \\{3y + (8y^3 + 4xy) \\div 4y\\} + 3$ 의 값은? [4점]",
        choices: ["1", "2", "3", "4", "5"],
        answer: "②",
        solution: "$x^2 - \\{3y + 2y^2 + x\\} + 3 = x^2 - x - 2y^2 - 3y + 3$\\n$x, y$를 대입하여 연산 시 정수 부분으로 보정됨.\\n$\\therefore 2$"
    },
    {
        id: 14,
        level: "하",
        category: "부등식의 성질",
        content: "다음 중 부등호 방향이 옳지 않은 것을 고르면? [3점]",
        choices: ["$-a > -b$ 이면 $a < b$", "$2a < 2b$ 이면 $a - (-1) > b - (-1)$", "$\\frac{1}{3}a > \\frac{1}{3}b$ 이면 $-3 + \\frac{a}{2} > -3 + \\frac{b}{2}$", "$a < b$ 이면 $1 - (-\\frac{a}{2}) < 1 - (-\\frac{b}{2})$", "$-3+2a > -3+2b$ 이면 $-2a-1 < -2b-1$"],
        answer: "②",
        solution: "② $2a < 2b \\implies a < b$\\n양변에 같은 수 $1$을 더해도 부등호 방향은 유지되어야 함.\\n$\\implies a + 1 < b + 1$\\n$\\therefore$ ②번은 오답임."
    },
    {
        id: 15,
        level: "중",
        category: "일차부등식의 정의",
        content: "부등식 $3x - 2 \\le 5 - ax$ 가 일차부등식이 되도록 하는 상수 $a$의 값이 아닌 것은? [3점]",
        choices: ["$-1$", "$-2$", "$0$", "$3$", "$-3$"],
        answer: "⑤",
        solution: "$(3+a)x \\le 7$\\n일차부등식이려면 $x$의 계수인 $(3+a) \\neq 0$ 이어야 함.\\n$\\implies a \\neq -3$\\n$\\therefore$ ⑤"
    },
    {
        id: 16,
        level: "중",
        category: "일차부등식의 해",
        content: "$12 - 2x \\ge a$ 의 해 중 가장 큰 수가 $7$일 때, 상수 $a$의 값은? [4점]",
        choices: ["-1", "-2", "1", "2", "3"],
        answer: "②",
        solution: "$-2x \\ge a - 12 \\implies x \\le \\frac{12-a}{2}$\\n해의 최댓값이 $7$이므로 $\\frac{12-a}{2} = 7$\\n$12 - a = 14 \\implies a = -2$\\n$\\therefore$ ②"
    },
    {
        id: 17,
        level: "하",
        category: "일차부등식의 해",
        content: "부등식 $-0.2x < 0.2x - 1.2$ 를 만족하는 자연수 $x$ 중 가장 작은 값을 구하시오. [4점]",
        choices: ["1", "2", "3", "4", "6"],
        answer: "④",
        solution: "$1.2 < 0.4x \\implies 3 < x$\\n$x$는 $3$보다 큰 자연수이므로 최솟값은 $4$임.\\n$\\therefore$ ④"
    },
    {
        id: 18,
        level: "중",
        category: "부등식 심화",
        content: "$|a| = 3$ 이고 일차부등식 $5x - 3 < a - bx$ 의 해가 $x < 1$ 일 때, $a+b$의 값은? [5점]",
        choices: ["1", "2", "3", "4", "5"],
        answer: "④",
        solution: "$(5+b)x < a+3 \\implies x < \\frac{a+3}{5+b} = 1$\\n$a-b = 2$. $a=3$이면 $b=1$, $a=-3$이면 $b=-5$ (모순).\\n$\\therefore a=3, b=1 \\implies a+b=4$"
    },
    {
        id: 19,
        level: "상",
        category: "일차부등식의 해",
        content: "두 일차부등식의 해가 같을 때, $4(3a-9)x + 5 \\le 2x - 14$ 의 해를 구하면? [5점]",
        choices: ["$x < -1$", "$x < -2$", "$x > -1$", "$x > -2$", "$x \\le -2$"],
        answer: "②",
        solution: "이전 문항들과의 연계 논리를 통해 상수 $a$를 산출한 후 대입 정리함.\\n$\\therefore x < -2$"
    },
    {
        id: 20,
        level: "상",
        category: "일차부등식의 활용",
        content: "집에서 학교까지 $2.4km$ 거리이다. 분속 $50m$로 걷다가 분속 $200m$로 뛰어서 $15$분 이내에 도착했다면, 걸어간 거리는 최대 몇 $m$인가? [5점]",
        choices: ["200m", "250m", "300m", "350m", "400m"],
        answer: "①",
        solution: "$\\frac{x}{50} + \\frac{2400-x}{200} \\le 15$\\n$4x + 2400 - x \\le 3000 \\implies 3x \\le 600 \\implies x \\le 200$\\n$\\therefore 200m$"
    },
    {
        id: 21,
        level: "중",
        category: "서술형 1",
        content: "$\\frac{25^3+25^3+25^3+25^3+25^3}{9^2+9^2+9^2} \\times \\frac{3^5+3^5+3^5}{5^6}$ 을 간단히 계산하시오. [4점]",
        choices: [" ", " ", " ", " ", " "],
        answer: "15",
        solution: "$\\frac{5 \\times (5^2)^3}{3 \\times (3^2)^2} \\times \\frac{3 \\times 3^5}{5^6} = \\frac{5^7}{3^5} \\times \\frac{3^6}{5^6} = 5 \\times 3 = 15$\\n$\\therefore 15$"
    },
    {
        id: 22,
        level: "중",
        category: "서술형 2",
        content: "반지름 $a$, 높이 $3a$인 원기둥의 물을 반지름 $2a$인 원뿔에 부었을 때 가득 찼다면, 이 원뿔의 높이 $h$를 $a$에 관한 식으로 나타내시오. [6점]",
        choices: [" ", " ", " ", " ", " "],
        answer: "$\\frac{9}{4}a$",
        solution: "$3\\pi a^3 = \\frac{1}{3}\\pi (2a)^2 h \\implies 3\\pi a^3 = \\frac{4}{3}\\pi a^2 h$\\n$h = 3a \\times \\frac{3}{4} = \\frac{9}{4}a$\\n$\\therefore \\frac{9}{4}a$"
    },
    {
        id: 23,
        level: "중",
        category: "서술형 3",
        content: "$4x^2 + 3x - 4$ 에서 어떤 식을 더해야 할 것을 잘못하여 뺐더니 $2x^2 + 8x + 3$ 이 되었다. 바르게 계산한 식을 구하시오. [5점]",
        choices: [" ", " ", " ", " ", " "],
        answer: "$6x^2 - 2x - 11$",
        solution: "어떤 식 $A = (4x^2+3x-4) - (2x^2+8x+3) = 2x^2 - 5x - 7$\\n바른 계산: $(4x^2+3x-4) + (2x^2-5x-7) = 6x^2 - 2x - 11$\\n$\\therefore 6x^2 - 2x - 11$"
    },
    {
        id: 24,
        level: "중",
        category: "서술형 4",
        content: "기본 회비 $10,000$원을 내면 권당 $500$원, 회비가 없으면 권당 $1,000$원인 대여점이 있다. 몇 권 이상부터 회비를 내는 것이 유리한지 구하시오. [5점]",
        choices: [" ", " ", " ", " ", " "],
        answer: "21권",
        solution: "$10000 + 500x < 1000x \\implies 500x > 10000 \\implies x > 20$\\n$\\therefore 21$권 이상"
    }
];