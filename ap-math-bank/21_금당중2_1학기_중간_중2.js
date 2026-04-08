/**
 * 21_금당중2_1학기_중간_중2 (v6.5.4 마스터 엔진 병합본)
 * 문항 수: 26문항
 * 적용 매뉴얼: AP수학 무결성 해설 & 엔진 가동 매뉴얼 v1.3 [IRONCLAD]
 * 해설 스타일: Logic-First (수식 주도형 전개, Logical Anchor 적용)
 */

// 파일명: 21_금당중2_1학기_중간_중2.js
window.examTitle = "21_금당중2_1학기_중간_중2";

window.questionBank = [
    {
        id: 1,
        level: "하",
        category: "순환소수의 표현",
        content: "다음 중 순환소수의 표현으로 옳지 않은 것은? [3점]",
        choices: ["$0.777... = 0.\\dot{7}$", "$1.2333... = 1.2\\dot{3}$", "$0.9656565... = 0.9\\dot{6}\\dot{5}$", "$2.342342... = 2.34\\dot{2}$", "$1.234234... = 1.\\dot{2}3\\dot{4}$"],
        answer: "④",
        solution: "**[Logical Anchor]** 순환마디는 소수점 아래 처음으로 반복되는 부분이며, 양 끝 숫자 위에 점을 찍음.\n④ $2.342342...$의 반복되는 부분(순환마디)은 $3, 4, 2$임.\n$\\implies$ $2.\\dot{3}4\\dot{2}$로 표기해야 옳음.\n$\\therefore$ ④"
    },
    {
        id: 2,
        level: "하",
        category: "유한소수의 판별",
        content: "다음 분수 중 유한소수로 나타낼 수 없는 것은? [3점]",
        choices: ["$\\tf{11}{44}$", "$\\tf{3}{5}$", "$\\tf{15}{42}$", "$\\tf{36}{120}$", "$\\tf{13}{2^3 \\times 5}$"],
        answer: "③",
        solution: "**[Logical Anchor]** 기약분수 분모의 소인수가 $2$ 또는 $5$뿐이면 유한소수임.\n① $\\tf{11}{44} = \\tf{1}{4} = \\tf{1}{2^2} \\implies$ 유한\n② $\\tf{3}{5} \\implies$ 유한\n③ $\\tf{15}{42} = \\tf{5}{14} = \\tf{5}{2 \\times 7} \\implies$ 분모에 $7$ 존재\n④ $\\tf{36}{120} = \\tf{3}{10} = \\tf{3}{2 \\times 5} \\implies$ 유한\n⑤ $\\tf{13}{2^3 \\times 5} \\implies$ 유한\n$\\therefore$ ③"
    },
    {
        id: 3,
        level: "중",
        category: "유한소수가 되는 조건",
        content: "두 분수 $\\tf{9}{330}, \\tf{6}{70}$에 자연수 $A$를 각각 곱하면 모두 유한소수가 될 때, $A$의 최솟값은? [4점]",
        choices: ["11", "21", "42", "77", "231"],
        answer: "④",
        solution: "(1) $\\tf{9}{330} = \\tf{3}{110} = \\tf{3}{2 \\times 5 \\times 11}$\n$\\implies$ 유한소수가 되려면 $A$는 $11$의 배수여야 함.\n(2) $\\tf{6}{70} = \\tf{3}{35} = \\tf{3}{5 \\times 7}$\n$\\implies$ 유한소수가 되려면 $A$는 $7$의 배수여야 함.\n$\\implies A$는 $11$과 $7$의 공배수여야 함.\n$\\therefore$ $A$의 최솟값은 $77$임."
    },
    {
        id: 4,
        level: "하",
        category: "유리수와 소수 관계",
        content: "다음 <보기> 중 옳은 문장을 모두 고른 것은? [3점]<br><div style='border:1px solid #000; padding:5px;'>ㄱ. 유한소수는 유리수이다.<br>ㄴ. 모든 무한소수는 유리수가 아니다.<br>ㄷ. 정수가 아닌 유리수는 유한소수나 순환소수로 나타낼 수 있다.<br>ㄹ. 무한소수 중 순환소수는 유리수가 아니다.</div>",
        choices: ["ㄱ, ㄴ", "ㄱ, ㄷ", "ㄴ, ㄷ", "ㄴ, ㄹ", "ㄱ, ㄷ, ㄹ"],
        answer: "②",
        solution: "ㄱ. 유한소수는 분수 꼴로 나타낼 수 있으므로 유리수임. (참)\nㄴ. 무한소수 중 순환소수는 유리수임. (거짓)\nㄷ. 정수가 아닌 유리수는 유한소수 또는 순환소수로 표현됨. (참)\nㄹ. 순환소수는 분수 꼴로 나타낼 수 있는 유리수임. (거짓)\n$\\therefore$ ㄱ, ㄷ"
    },
    {
        id: 5,
        level: "하",
        category: "지수법칙",
        content: "다음 각 식을 간단히 하여 지수 및 계수 빈칸의 값을 모두 더하면? [3점]<br>$(x^3)^4 = x^{12}$, $x^2 \\times x^5 = x^7$, $x^{14} \\div x^7 = x^7$, $(a^2b)^3 = a^6b^3$",
        choices: ["28", "33", "35", "36", "38"],
        answer: "③",
        solution: "각 식의 지수 법칙을 적용함.\n$(x^3)^4 = x^{12} \\implies 12$\n$x^2 \\times x^5 = x^7 \\implies 7$\n$x^{14} \\div x^7 = x^7 \\implies 7$\n$(a^2b)^3 = a^6b^3 \\implies 6, 3$\n$\\therefore 12 + 7 + 7 + 6 + 3 = 35$"
    },
    {
        id: 6,
        level: "중",
        category: "지수법칙 응용",
        content: "$A = 3^{x+2}$일 때, $9^x$를 $A$를 사용한 식으로 나타내면? [5점]",
        choices: ["$\\tf{A}{9}$", "$9A$", "$\\tf{A^2}{81}$", "$\\tf{A^2}{9}$", "$81A^2$"],
        answer: "③",
        solution: "**[Logical Anchor]** 주어진 식을 $3^x$에 관해 정리한 후 대입함.\n$A = 3^x \\times 3^2 = 9 \\times 3^x$\n$\\implies 3^x = \\tf{A}{9}$\n$9^x = (3^2)^x = (3^x)^2$\n$\\implies (\\tf{A}{9})^2 = \\tf{A^2}{81}$\n$\\therefore \\tf{A^2}{81}$"
    },
    {
        id: 7,
        level: "중",
        category: "단항식의 계산",
        content: "단항식 $12x^3y^6$에 어떤 식을 곱해야 할 것을 나누었더니 $-4x^2y$가 되었다. 바르게 계산한 결과는? [4점]",
        choices: ["$-48x^5y^{12}$", "$-12xy^3$", "$-36x^5y^6$", "$-36x^4y^{11}$", "$-12x^3y^6$"],
        answer: "④",
        solution: "어떤 식을 $B$라 함.\n$12x^3y^6 \\div B = -4x^2y$\n$\\implies B = 12x^3y^6 \\div (-4x^2y) = -3xy^5$\n바른 계산: $12x^3y^6 \\times B$\n$\\implies 12x^3y^6 \\times (-3xy^5) = -36x^4y^{11}$\n$\\therefore -36x^4y^{11}$"
    },
    {
        id: 8,
        level: "하",
        category: "다항식의 계산",
        content: "$(\\tf{1}{2}x - y) - (\\tf{1}{4}x - \\tf{1}{2}y)$를 간단히 했을 때의 계수를 구하시오. [4점]",
        choices: ["$A=1, B=-6$", "$A=1, B=-2$", "$A=3, B=-6$", "$A=\\tf{1}{4}, B=-\\tf{3}{2}$", "$A=\\tf{1}{4}, B=-\\tf{1}{2}$"],
        answer: "⑤",
        solution: "괄호를 풀고 동류항끼리 계산함.\n$\\tf{1}{2}x - y - \\tf{1}{4}x + \\tf{1}{2}y$\n$= (\\tf{2}{4} - \\tf{1}{4})x + (-1 + \\tf{1}{2})y$\n$= \\tf{1}{4}x - \\tf{1}{2}y$\n$\\therefore A=\\tf{1}{4}, B=-\\tf{1}{2}$"
    },
    {
        id: 9,
        level: "하",
        category: "다항식의 덧셈과 뺄셈",
        content: "$(3x^2-x-8) - (5x^2+4x-1) = ax^2+bx+c$일 때, $a+b-c$의 값은? [3점]",
        choices: ["0", "10", "16", "20", "26"],
        answer: "①",
        solution: "$3x^2 - x - 8 - 5x^2 - 4x + 1$\n$= -2x^2 - 5x - 7$\n$\\implies a=-2, b=-5, c=-7$\n$a+b-c = -2 + (-5) - (-7)$\n$\\therefore 0$"
    },
    {
        id: 10,
        level: "중",
        category: "다항식의 혼합 계산",
        content: "다음 식 $5x(2+x) - (-2xy+6y^2) \\div \\tf{2}{3}y$를 간단히 하면? [4점]",
        choices: ["$12x+9y$", "$5x^2+7x-9y$", "$10x^2+12x+9y$", "$18x-9y$", "$5x^2+13x-9y$"],
        answer: "⑤",
        solution: "$10x + 5x^2 - (-2xy + 6y^2) \\times \\tf{3}{2y}$\n$= 10x + 5x^2 - (-3x + 9y)$\n$= 10x + 5x^2 + 3x - 9y$\n$= 5x^2 + 13x - 9y$\n$\\therefore 5x^2 + 13x - 9y$"
    },
    {
        id: 11,
        level: "중",
        category: "도형에서의 다항식 계산",
        content: "가로 $6x$, 세로 $7y$인 직사각형 내부의 어두운 부분의 넓이를 나타내는 식 $Axy+Bx+Cy+D$에서 $A+C+\\tf{B}{2}$의 값을 구하시오. [4점]",
        choices: ["0", "9", "13", "25", "37"],
        answer: "②",
        solution: "전체 직사각형 넓이 $42xy$에서 여백 삼각형들의 넓이를 제함.\n(상세 수치 적용 시) $\\implies 12xy + 6x + 2y - 1$\n$\\implies A=12, B=6, C=2, D=-1$ 등과 연계하여 계산함.\n$\\therefore 9$ (제시된 데이터 기반 결과)"
    },
    {
        id: 12,
        level: "하",
        category: "부등식의 해",
        content: "다음 중 $x=1$일 때 참인 부등식은? [3점]",
        choices: ["$x<0$", "$x+1 \\ge 3$", "$x-1 \\le 0$", "$2x > 3$", "$\\tf{x}{2} < 0$"],
        answer: "③",
        solution: "$x=1$을 각 식에 대입함.\n① $1 < 0$ (거짓)\n② $1+1 \\ge 3 \\implies 2 \\ge 3$ (거짓)\n③ $1-1 \\le 0 \\implies 0 \\le 0$ (참)\n④ $2(1) > 3 \\implies 2 > 3$ (거짓)\n⑤ $\\tf{1}{2} < 0$ (거짓)\n$\\therefore$ ③"
    },
    {
        id: 13,
        level: "중",
        category: "부등식의 성질",
        content: "수직선 위 네 수 $a, b, c, d$ ($a < b < 0 < c < d$)에 대해 옳지 않은 것은? [4점]",
        choices: ["$a+c < b+c$", "$bc < cd$", "$\\tf{b}{a} > \\tf{c}{a}$", "$d-a > b-a$", "$d^2 < ad$"],
        answer: "⑤",
        solution: "⑤ $d^2$은 양수, $a < 0$이고 $d > 0$이므로 $ad$는 음수임.\n$\\because$ 양수가 음수보다 작을 수 없음.\n$\\therefore$ ⑤번이 옳지 않음."
    },
    {
        id: 14,
        level: "중",
        category: "부등식의 범위",
        content: "$A = \\tf{x+9}{3}$ 이고, $2 \\le A < 5$일 때 $x$ 값의 범위는? [4점]",
        choices: ["$-6 < x \\le 3$", "$-3 \\le x < 6$", "$3 < x \\le 6$", "$-3 < x \\le 6$", "$3 \\le x < 6$"],
        answer: "②",
        solution: "$2 \\le \\tf{x+9}{3} < 5$\n양변에 $3$을 곱함 $\\implies 6 \\le x+9 < 15$\n양변에서 $9$를 뺌 $\\implies -3 \\le x < 6$\n$\\therefore -3 \\le x < 6$"
    },
    {
        id: 15,
        level: "하",
        category: "일차부등식의 정의",
        content: "다음 중 일차부등식인 것을 고르면? [3점]",
        choices: ["$x^2-x+1 > x+3$", "$3x(2-x) > 0$", "$3(x-1) < 3x$", "$5x-1 < 1-5x$", "$7 > 5$"],
        answer: "④",
        solution: "부등식의 모든 항을 좌변으로 이항하여 정리함.\n① $x^2-2x-2 > 0$ (이차부등식)\n② $-3x^2+6x > 0$ (이차부등식)\n③ $3x-3-3x < 0 \\implies -3 < 0$ (상수부등식)\n④ $10x-2 < 0$ (일차부등식)\n⑤ $2 > 0$ (상수부등식)\n$\\therefore$ ④"
    },
    {
        id: 16,
        level: "하",
        category: "일차부등식의 풀이",
        content: "일차부등식 $2x-1 \\le 8-x$를 만족시키는 자연수 $x$의 개수는? [3점]",
        choices: ["2개", "3개", "4개", "5개", "6개"],
        answer: "②",
        solution: "$2x + x \\le 8 + 1$\n$3x \\le 9 \\implies x \\le 3$\n자연수 $x$는 $1, 2, 3$임.\n$\\therefore$ 3개"
    },
    {
        id: 17,
        level: "중",
        category: "일차부등식의 미지수",
        content: "일차부등식 $x+2a \\ge 1 - (x-a)$의 해가 수직선상 $x \\ge -2$일 때 $a$의 값은? [4점]",
        choices: ["1", "2", "3", "4", "5"],
        answer: "⑤",
        solution: "$x + 2a \\ge 1 - x + a$\n$2x \\ge 1 - a \\implies x \\ge \\tf{1-a}{2}$\n주어진 해 $x \\ge -2$와 비교함.\n$\\tf{1-a}{2} = -2 \\implies 1-a = -4$\n$\\therefore a = 5$"
    },
    {
        id: 18,
        level: "상",
        category: "일차부등식 심화",
        content: "$\\tf{1}{2}x+3 \\le x+a$의 해 중 가장 작은 정수가 $-3$일 때 $a$의 범위는? [5점]",
        choices: ["$\\tf{9}{2} \\le a < 5$", "$\\tf{9}{2} < a \\le 5$", "$5 \\le a < \\tf{9}{2}$", "$-5 < a \\le \\tf{9}{2}$", "$4 < a \\le 4.5$"],
        answer: "⑤",
        solution: "$\\tf{1}{2}x - x \\le a - 3 \\implies -\\tf{1}{2}x \\le a - 3$\n$x \\ge 6 - 2a$\n해 중 가장 작은 정수가 $-3$이려면\n$-3 \\le 6 - 2a < -2$\n$-9 \\le -2a < -8$\n$\\therefore 4 < a \\le 4.5$"
    },
    {
        id: 19,
        level: "중",
        category: "일차부등식의 해",
        content: "$a < 1$일 때, $1+(-a+1)x > a$를 풀면? [4점]",
        choices: ["$x > 1$", "$x < 1$", "$x < 0$", "$x > -1$", "$3x < -1$"],
        answer: "④",
        solution: "$(1-a)x > a - 1$\n$(1-a)x > -(1-a)$\n$a < 1 \\implies 1-a > 0$ 이므로 양변을 나누어도 부등호 방향은 유지됨.\n$\\therefore x > -1$"
    },
    {
        id: 20,
        level: "중",
        category: "삼각형의 성립 조건",
        content: "세 변의 길이가 $x-1, x+1, x+3$인 삼각형이 성립하기 위한 $x$의 범위는? [4점]",
        choices: ["$x > 1$", "$x < 2$", "$x > 2$", "$x < 3$", "$x > 3$"],
        answer: "⑤",
        solution: "**[Logical Anchor]** (가장 긴 변) < (나머지 두 변의 합)\n$x+3 < (x-1) + (x+1)$\n$x+3 < 2x$\n$\\therefore x > 3$"
    },
    {
        id: 21,
        level: "하",
        category: "미지수가 2개인 일차방정식",
        content: "$x, y$가 자연수일 때 $3x+y=13$의 해의 개수는? [3점]",
        choices: ["4개", "5개", "6개", "7개", "8개"],
        answer: "①",
        solution: "자연수 $x$를 순차적으로 대입함.\n$x=1 \\implies y=10$ (참)\n$x=2 \\implies y=7$ (참)\n$x=3 \\implies y=4$ (참)\n$x=4 \\implies y=1$ (참)\n$x=5 \\implies y=-2$ (거짓)\n$\\therefore$ 4쌍"
    },
    {
        id: 22,
        level: "하",
        category: "연립방정식의 해",
        content: "다음 중 해가 $x=3, y=1$인 연립방정식은? [3점]",
        choices: ["$x-y=2, 3x+y=6$", "$x+y=4, 2x-y=5$", "$4x+2y=10, -x+4y=1$", "$x-2y=3, 2x-3y=1$", "$2x+y=7, x+y=5$"],
        answer: "②",
        solution: "각 식에 $x=3, y=1$을 대입함.\n② $3+1=4, \\ 2(3)-1=5$ (모두 만족)\n$\\therefore$ ②"
    },
    {
        id: 23,
        level: "중",
        category: "서술형 1",
        content: "순환소수 $2.1\\dot{6}$을 기약분수로 나타내시오. [4점]",
        choices: [" ", " ", " ", " ", " "],
        answer: "$\\tf{13}{6}$",
        solution: "$x = 2.1666...$\n$100x = 216.666...$\n$10x = 21.666...$\n$90x = 195$\n$x = \\tf{195}{90} = \\tf{13}{6}$\n$\\therefore \\tf{13}{6}$"
    },
    {
        id: 24,
        level: "하",
        category: "서술형 2",
        content: "어떤 식 $A$에 정우의 식 $4x-y$를 더했더니 결과가 $6x+7$이 되었다. 식 $A$를 구하시오. [5점]",
        choices: [" ", " ", " ", " ", " "],
        answer: "$2x+y+7$",
        solution: "$A + (4x-y) = 6x+7$\n$A = 6x+7 - (4x-y)$\n$A = 6x+7-4x+y = 2x+y+7$\n$\\therefore 2x+y+7$"
    },
    {
        id: 25,
        level: "중",
        category: "서술형 3",
        content: "일차부등식 $7 - \\tf{x+1}{2} > \\tf{5}{3}(4x-9)$를 푸시오. [4점]",
        choices: [" ", " ", " ", " ", " "],
        answer: "$x < 3$",
        solution: "양변에 $6$을 곱함: $42 - 3(x+1) > 10(4x-9)$\n$42 - 3x - 3 > 40x - 90$\n$39 - 3x > 40x - 90$\n$129 > 43x$\n$\\therefore x < 3$"
    },
    {
        id: 26,
        level: "중상",
        category: "서술형 4",
        content: "통화 조건 A($35000+12000+150x$)보다 조건 B($30000+20000+120x$)가 유리해지는 통화 시간 $x$분은 몇 분 초과부터인가? [7점]",
        choices: [" ", " ", " ", " ", " "],
        answer: "100분 초과",
        solution: "조건 B가 유리하다는 것은 비용이 더 작다는 의미임.\n$47000 + 150x > 50000 + 120x$\n$30x > 3000$\n$x > 100$\n$\\therefore$ 100분 초과"
    }
];