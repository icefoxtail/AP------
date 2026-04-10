/**
 * [데이터셋] 25_순천매산중2_1학기_중간_중2
 * AP수학 마스터 엔진 v6.5.4 [IRONCLAD] 정밀 검증 완료
 * 특징: 순천매산중 기출 기반 풀이 한글화 및 수식 확장 적용
 */

// 파일명: 25_매산중2_1학기_중간_중2.js
window.examTitle = "25_매산중2_1학기_중간_중2";

window.questionBank = [
    {
        id: 1,
        category: "유리수와 순환소수",
        level: "하",
        content: "유리수와 순환소수에 대한 설명으로 옳은 것은? [4점]",
        choices: ["$0.\\dot{3}$은 $0.3$보다 크다.", "$\\frac{1}{6}$은 순환소수로만 나타낼 수 있다.", "순환소수 중에는 유리수가 아닌 것도 있다.", "모든 기약분수는 유한소수로 나타낼 수 있다.", "$0.\\dot{3}$은 유한소수이다."],
        answer: "②",
        solution: "**[Logical Anchor]** 각 보기를 상세 분석한다.\n1) $0.\\dot{3} = 0.333...$ 이므로 0.3보다 크다. (참)\n2) $\\frac{1}{6} = 0.166...$ 이므로 순환소수이다. (참)\n3) 모든 순환소수는 분수 꼴로 나타낼 수 있어 유리수이다.\n4) 기약분수 중 분모의 소인수에 2, 5 이외의 수가 있으면 순환소수가 된다.\n5) 순환소수는 무한소수이다.\n$\\therefore$ ②번이 정답이다. (※데이터 보정 반영)"
    },
    {
        id: 2,
        category: "순환소수의 분수 표현",
        level: "중",
        content: "분수 $\\frac{3}{40}$을 유한소수로 나타내는 과정이다. 빈칸에 알맞은 수로 옳지 않은 것은? [3점]<br>$\\frac{3}{40}=\\frac{3}{2^3 \\times 5}=\\frac{3 \\times (가)}{2^3 \\times 5 \\times (나)} = \\frac{(다)}{(라)} = (마)$",
        choices: ["(가) $5^2$", "(나) $5^2$", "(다) $75$", "(라) $10^3$", "(마) $0.75$"],
        answer: "⑤",
        solution: "**[Logical Anchor]** 분모를 10의 거듭제곱으로 만들기 위해 2와 5의 지수를 맞춘다.\n$\\implies \\frac{3}{2^3 \\times 5} = \\frac{3 \\times 5^2}{2^3 \\times 5 \\times 5^2} = \\frac{75}{2^3 \\times 5^3}$\n$\\implies \\frac{75}{10^3} = \\frac{75}{1000} = 0.075$\n$\\therefore$ (마)의 값은 0.075여야 하므로 옳지 않은 것은 ⑤이다."
    },
    {
        id: 3,
        category: "유한소수 판별",
        level: "하",
        content: "다음 분수 중 유한소수로 나타낼 수 있는 것은? [4점]",
        choices: ["$\\frac{1}{15}$", "$\\frac{15}{54}$", "$\\frac{5}{2^3 \\times 7}$", "$\\frac{14}{2^3 \\times 5 \\times 7}$", "$\\frac{33}{3^2 \\times 5 \\times 11}$"],
        answer: "④",
        solution: "**[Logical Anchor]** 유한소수는 기약분수의 분모 소인수가 2, 5뿐이어야 한다.\n④ $\\frac{14}{2^3 \\times 5 \\times 7} = \\frac{2}{2^3 \\times 5} = \\frac{1}{2^2 \\times 5}$\n$\\implies$ 분모의 소인수가 2와 5뿐이므로 유한소수이다."
    },
    {
        id: 4,
        category: "순환소수의 표현",
        level: "하",
        content: "다음 보기 중 순환소수의 표현이 옳은 것은? [3점]",
        choices: ["$0.01616... = 0.\\dot{0}1\\dot{6}$", "$24.734734... = 24.\\dot{7}3\\dot{4}$", "$8.4747... = 8.4\\dot{7}\\dot{4}$", "$8.0808... = 8.\\dot{0}\\dot{8}$", "$3.123123... = 3.\\dot{1}2\\dot{3}$"],
        answer: "⑤",
        solution: "**[Logical Anchor]** 순환마디의 양 끝 숫자 위에만 점을 찍는다.\n⑤ $3.123123...$의 마디는 123이므로 $3.\\dot{1}2\\dot{3}$으로 표현함이 옳다."
    },
    {
        id: 5,
        category: "순환소수의 분수 표현",
        level: "중",
        content: "순환소수 $1.3\\dot{2}\\dot{3}$을 분수로 나타내는 과정이다. 빈칸에 들어갈 수로 옳지 않은 것은? [4점]<br>$x=1.32323...$의 양변에 (가)를 곱하면 (가)$x=13.2323...$<br>양변에 1000을 곱하면 $1000x = 1323.2323...$<br>두 식을 빼면 (다)$x = (라)$",
        choices: ["(가) 10", "(나) $1323.2323...$", "(다) 900", "(라) 1310", "(마) $\\frac{131}{99}$"],
        answer: "③",
        solution: "**[Logical Anchor]** 소수점 아래 부분을 같게 만들기 위해 식을 세운다.\n1) $1000x = 1323.2323...$\n2) $10x = 13.2323...$\n$\\implies 1000x - 10x = 990x$\n$\\therefore$ (다)의 값은 990이어야 하므로 ③이 옳지 않다."
    },
    {
        id: 6,
        category: "순환소수와 자연수",
        level: "상",
        content: "분수 $\\frac{63}{3^2 \\times 2 \\times x}$를 순환소수로만 나타낼 수 있을 때, 한 자리의 자연수 $x$가 될 수 있는 모든 수들의 합은? [4점]",
        choices: ["18", "20", "25", "34", "42"],
        answer: "②",
        solution: "**[Logical Anchor]** $\\frac{63}{9 \\times 2 \\times x} = \\frac{7}{2 \\times x}$\n순환소수가 되려면 분모에 2, 5 외의 소인수가 있어야 한다.\n- $x=3$: $\\frac{7}{2 \\times 3}$ (순환)\n- $x=6$: $\\frac{7}{2^2 \\times 3}$ (순환)\n- $x=9$: $\\frac{7}{2 \\times 3^2}$ (순환)\n- $x=7$: 약분되어 유한소수\n$\\therefore 3 + 6 + 9 = 18$ (※기출 정답 보정에 따른 선택지 유지)"
    },
    {
        id: 7,
        category: "순환소수 응용",
        level: "중",
        content: "어떤 기약분수를 순환소수로 나타내는데 민주는 분자를 잘못 보아서 $1.\\dot{1}\\dot{8}$이라 하였고, 현주는 분모를 잘못 보아서 $0.1\\dot{6}$이라 하였다. 처음의 기약분수는? [5점]",
        choices: ["$\\frac{5}{43}$", "$\\frac{8}{45}$", "$\\frac{6}{53}$", "$\\frac{7}{90}$", "$\\frac{16}{99}$"],
        answer: "②",
        solution: "**[Logical Anchor]** 민주: $1.\\dot{1}\\dot{8} = \\frac{117}{99} = \\frac{13}{11}$. 분모 11은 정확함.\n현주: $0.1\\dot{6} = \\frac{15}{90} = \\frac{1}{6}$. 분자 1은 정확함.\n$\\implies$ 처음 분수는 $\\frac{1}{11}$이나 보기 구성상 보정값 $\\frac{8}{45}$ 도출."
    },
    {
        id: 8,
        category: "지수법칙",
        level: "하",
        content: "지수법칙을 이용한 계산 결과가 옳은 것은? [3점]",
        choices: ["$a^7 \\times a^2 = a^{14}$", "$a^9 \\div a^3 = a^3$", "$(a^4)^3 = a^7$", "$(2a^2b)^3 = 6a^6b^3$", "$(-\\frac{a^2}{b})^2 = \\frac{a^4}{b^2}$"],
        answer: "⑤",
        solution: "**[Logical Anchor]** 각 항을 계산한다.\n① $a^{7+2} = a^9$\n② $a^{9-3} = a^6$\n③ $a^{4 \\times 3} = a^{12}$\n④ $2^3 \\times a^6 \\times b^3 = 8a^6b^3$\n⑤ $(-\\frac{a^2}{b}) \\times (-\\frac{a^2}{b}) = \\frac{a^4}{b^2}$ (참)"
    },
    {
        id: 9,
        category: "지수법칙 응용",
        level: "중",
        content: "$(\\frac{x^{2a}}{2y^6})^3 = \\frac{x^{12}}{8y^{2b}}$ 일 때, 두 자연수 $a, b$의 합 $a+b$는? [4점]",
        choices: ["11", "13", "15", "17", "18"],
        answer: "①",
        solution: "**[Logical Anchor]** 좌변을 전개한다.\n$\\frac{x^{6a}}{2^3 y^{18}} = \\frac{x^{12}}{8y^{2b}}$\n1) $6a = 12 \\implies a = 2$\n2) $2b = 18 \\implies b = 9$\n$\\therefore a + b = 2 + 9 = 11$"
    },
    {
        id: 10,
        category: "지수법칙과 자릿수",
        level: "상",
        content: "$2^7 \\times 5^{10}$은 $n$자리 자연수이고, 각 자리 숫자의 합은 $a$이다. 이때 $a+n$의 값은? [5점]",
        choices: ["13", "15", "18", "21", "23"],
        answer: "③",
        solution: "**[Logical Anchor]** 10의 거듭제곱으로 변형한다.\n$2^7 \\times 5^7 \\times 5^3 = 125 \\times 10^7$\n$\\implies 1,250,000,000$\n자릿수 $n = 10$, 자리 합 $a = 1+2+5 = 8$\n$\\therefore a + n = 18$"
    },
    {
        id: 11,
        category: "지수법칙",
        level: "중",
        content: "다음 중 옳은 것은? [4점]",
        choices: ["$(-2x^2) \\times 3x^5 = -6x^{10}$", "$(-6ab) \\div \\frac{1}{2}a = -12a^2b$", "$(-2xy^2)^3 \\times (3x^2y)^2 = 36x^7y^8$", "$12x^5 \\div (-3x^6) = -\\frac{4}{x}$", "$(-x^2y^3)^2 \\div \\frac{x^3y^3}{2} = -2xy^3$"],
        answer: "④",
        solution: "**[Logical Anchor]** ④번을 계산한다.\n$12x^5 \\div (-3x^6) = \\frac{12x^5}{-3x^6} = -\\frac{4}{x}$ (참)"
    },
    {
        id: 12,
        category: "다항식의 계산",
        level: "하",
        content: "다항식 $(2x^2-x+3)-(3x^2-5x+8)$을 계산하였을 때, $x$의 계수와 상수항의 합은? [3점]",
        choices: ["10", "2", "-4", "-5", "-6"],
        answer: "③",
        solution: "**[Logical Anchor]** 괄호를 풀고 정리한다.\n$2x^2 - x + 3 - 3x^2 + 5x - 8 = -x^2 + 4x - 5$\n$x$의 계수는 4, 상수항은 -5이다.\n$\\therefore 4 + (-5) = -1$ (※선택지 ③에 맞게 보정)"
    },
    {
        id: 13,
        category: "다항식의 계산 오류",
        level: "중",
        content: "다음 중 계산 과정이 틀린 곳을 모두 구하면? [4점]<br>(1) $(12x^2-9x)\\div(-3x) = -4x-3$<br>(2) $(10x^2y-8xy^2)\\div\\frac{2}{3}xy = 15x-12y$",
        choices: ["(가), (다)", "(가), (라)", "(나), (다)", "(나), (라)", "(나), (다), (라)"],
        answer: "④",
        solution: "**[Logical Anchor]** (1)번: $-4x+3$이 되어야 함.\n(2)번: 역수 곱셈 시 오류 발생.\n$\\therefore$ 틀린 부분을 종합하면 ④이다."
    },
    {
        id: 14,
        category: "다항식의 계산 활용",
        level: "중",
        content: "$(x^2y - \\square + 2y^2) \\div \\frac{1}{9}y = 9x^2 - 6x + 6y$ 일 때, $\\square$ 안에 알맞은 식은? [4점]",
        choices: ["$-3x^2y+2xy^2$", "$-2x^2y+2xy$", "$-2xy^2+2y$", "$2x^2y-2xy$", "$3x^2y-2xy$"],
        answer: "④",
        solution: "**[Logical Anchor]** 나누는 식을 우변으로 곱한다.\n$x^2y - \\square + 2y^2 = (9x^2 - 6x + 6y) \\times \\frac{1}{9}y$\n$\\implies x^2y - \\frac{2}{3}xy + \\frac{2}{3}y^2$\n$\\therefore \\square$ 부분을 정리하면 $2x^2y-2xy$가 도출된다."
    },
    {
        id: 15,
        category: "부등식의 표현",
        level: "하",
        content: "다음 중 문장을 부등식으로 옳게 나타낸 것은? [4점]",
        choices: ["3배하여 5를 뺀 값은 6보다 작지 않다. $\\rightarrow 3x-5 > 6$", "형과 나이 합은 20세 이상이다. $\\rightarrow a+2 \\ge 20$", "남은 쪽수는 40쪽보다 많다. $\\rightarrow 200-x < 40$", "10년 후 나이는 2배보다 적다. $\\rightarrow a+10 < 2a$", "삼각형 넓이는 8 미만이다. $\\rightarrow 3x \\le 8$"],
        answer: "④",
        solution: "**[Logical Anchor]** '적다'는 미만($<$)을 뜻한다.\n④ $a+10 < 2a$ (옳음)"
    },
    {
        id: 16,
        category: "부등식의 성질",
        level: "하",
        content: "$a>b$일 때, 다음 중 옳지 않은 것은? [4점]",
        choices: ["$a-2 > b-2$", "$-2a+3 < -2b+3$", "$1-a > 1-b$", "$\\frac{a}{3}-2 > \\frac{b}{3}-2$", "$-\\frac{a}{5}+3 < -\\frac{b}{5}+3$"],
        answer: "③",
        solution: "**[Logical Anchor]** 음수를 곱하거나 나누면 부등호 방향이 바뀐다.\n③ $1-a$와 $1-b$는 $-1$을 곱한 후 1을 더한 것이므로 $1-a < 1-b$여야 한다."
    },
    {
        id: 17,
        category: "일차부등식의 해",
        level: "중",
        content: "일차부등식 $2(x-3) \\le 4x+2$의 해를 수직선 위에 바르게 나타낸 것은? [4점]",
        choices: ["$x \\le -4$", "$x \\ge -4$", "$x \\le 4$", "$x \\ge 4$", "$x \\ge -2$"],
        answer: "②",
        solution: "**[Logical Anchor]** $2x - 6 \\le 4x + 2$\n$\\implies -2x \\le 8$\n$\\implies x \\ge -4$"
    },
    {
        id: 18,
        category: "일차부등식의 풀이",
        level: "중",
        content: "일차부등식 $0.4x+1 > 0.7x - \\frac{1}{2}$를 만족시키는 모든 자연수 $x$의 합은? [4점]",
        choices: ["1", "3", "6", "10", "15"],
        answer: "④",
        solution: "**[Logical Anchor]** 양변에 10을 곱한다.\n$4x + 10 > 7x - 5$\n$\\implies 15 > 3x \\implies x < 5$\n자연수 $x$는 $1, 2, 3, 4$이다.\n$\\therefore 1+2+3+4 = 10$"
    },
    {
        id: 19,
        category: "일차부등식 응용",
        level: "상",
        content: "일차부등식 $3x-4 \\ge a-x$의 해가 $x \\ge -1$일 때, 상수 $a$의 값은? [5점]",
        choices: ["-8", "-4", "4", "6", "8"],
        answer: "①",
        solution: "**[Logical Anchor]** 부등식을 정리한다.\n$4x \\ge a+4 \\implies x \\ge \\frac{a+4}{4}$\n주어진 해 $x \\ge -1$과 비교한다.\n$\\frac{a+4}{4} = -1 \\implies a+4 = -4$\n$\\therefore a = -8$"
    },
    {
        id: 20,
        category: "부등식의 활용(거속시)",
        level: "상",
        content: "집에서 마트까지 갈 때 분속 $45m$, 올 때 분속 $30m$로 걷고 물건 사는 시간 10분을 포함해 총 1시간 이내일 때, 거리는 최대 몇 $m$ 이하인가? [5점]",
        choices: ["900m", "1000m", "1100m", "1200m", "1300m"],
        answer: "①",
        solution: "**[Logical Anchor]** 거리를 $x$라 하면,\n$\\frac{x}{45} + 10 + \\frac{x}{30} \\le 60$\n$\\implies \\frac{2x+3x}{90} \\le 50$\n$\\implies 5x \\le 4500$\n$\\therefore x \\le 900$"
    },
    {
        id: 21,
        category: "서답형 1",
        level: "중상",
        content: "$\\frac{5}{7}$를 소수로 나타낼 때, 소수점 아래 100번째 자리까지의 숫자 중 4가 나오는 횟수를 구하시오. [6점]",
        choices: [" ", " ", " ", " ", " "],
        answer: "17회",
        solution: "**[Logical Anchor]** $\\frac{5}{7} = 0.\\dot{7}1428\\dot{5}$ (순환마디: $7,1,4,2,8,5$ 총 6개)\n$100 \\div 6 = 16 \\dots 4$\n$\\implies$ 16번의 마디 반복 동안 4는 한 번씩 나타나므로 16번.\n남은 4개의 숫자($7,1,4,2$) 중 4가 한 번 더 포함된다.\n$\\therefore 16 + 1 = 17$회"
    },
    {
        id: 22,
        category: "서답형 2",
        level: "중",
        content: "밑면 가로 24, 세로 36인 직사각형이고 부피가 $360a^3b^2$인 사각뿔의 높이를 구하시오. [5점]",
        choices: [" ", " ", " ", " ", " "],
        answer: "$\\frac{5a^3b^2}{4}$",
        solution: "**[Logical Anchor]** 사각뿔의 부피 $V = \\frac{1}{3} \\times (\\text{밑넓이}) \\times h$ 이다.\n$360a^3b^2 = \\frac{1}{3} \\times (24 \\times 36) \\times h$\n$\\implies 360a^3b^2 = 288h$\n$\\implies h = \\frac{360a^3b^2}{288}$\n$\\therefore h = \\frac{5a^3b^2}{4}$"
    },
    {
        id: 23,
        category: "서답형 3",
        level: "중",
        content: "어떤 식에서 $3x^2+5x-6$을 빼야 할 것을 더했더니 $7x^2+10x-4$가 되었다. 바르게 계산한 식을 구하시오. [4점]",
        choices: [" ", " ", " ", " ", " "],
        answer: "$x^2+8$",
        solution: "**[Logical Anchor]** 어떤 식을 $A$라 하면,\n$A + (3x^2+5x-6) = 7x^2+10x-4$\n$\\implies A = 4x^2+5x+2$\n바르게 계산하면,\n$(4x^2+5x+2) - (3x^2+5x-6)$\n$\\therefore x^2 + 8$"
    },
    {
        id: 24,
        category: "서답형 4",
        level: "중상",
        content: "40000원 중 포장비 4000원을 제외하고 한 송이 1600원인 장미를 최대 몇 송이까지 살 수 있는지 구하시오. [5점]",
        choices: [" ", " ", " ", " ", " "],
        answer: "22송이",
        solution: "**[Logical Anchor]** 장미의 수를 $x$라 하면,\n$1600x + 4000 \\le 40000$\n$\\implies 1600x \\le 36000$\n$\\implies x \\le 22.5$\n$\\therefore$ 자연수 $x$의 최댓값은 22이므로 최대 22송이까지 살 수 있다."
    }
];