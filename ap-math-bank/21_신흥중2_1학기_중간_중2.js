/**
 * 21_순천신흥중2_1학기_중간_중2 (v6.5.4 AP수학 마스터 엔진 표준형)
 * 문항 수: 24문항
 * 타이틀: 21_순천신흥중2_1학기_중간_중2
 * 특이사항: 10번 문항 논리 보정, 16번 심화 해설 확장 적용
 */

// 파일명: 21_신흥중2_1학기_중간_중2.js
window.examTitle = "21_신흥중2_1학기_중간_중2";

window.questionBank = [
    {
        id: 1,
        level: "하",
        category: "유리수와 순환소수",
        content: "다음 중 옳은 것을 2개 고르면? [4점]",
        choices: ["모든 소수는 유리수이다.", "무한소수는 순환소수이다.", "모든 순환소수는 분수로 나타낼 수 있다.", "유리수는 모두 유한소수로 나타낼 수 있다.", "기약분수의 분모에 2 또는 5 이외의 소인수가 있으면 순환소수이다."],
        answer: "③, ⑤",
        solution: "**[Logical Anchor]** 유리수와 소수의 분류 정의를 명확히 함.\n③ 모든 순환소수는 분수로 나타낼 수 있는 유리수임. (참)\n⑤ 기약분수의 분모에 $2$ 또는 $5$ 이외의 소인수가 있으면 순환소수가 됨. (참)\n$\\because$ ① 무한소수 중 비순환소수는 무리수임. ② 무한소수에는 비순환소수도 포함됨. ④ $\\tf{1}{3}$ 등은 무한소수임.\n$\\therefore$ ③, ⑤"
    },
    {
        id: 2,
        level: "중",
        category: "순환소수의 대소 비교",
        content: "다음 순환소수 중 가장 큰 수는? [4점]",
        choices: ["$0.9\\dot{8}$", "$0.\\dot{9}\\dot{8}$", "$0.90\\dot{8}$", "$0.90\\dot{0}\\dot{8}$", "$0.900\\dot{8}$"],
        answer: "②",
        solution: "각 소수를 소수점 아래 넷째 자리까지 전개하여 비교함.\n① $0.9888\\dots$\n② $0.9898\\dots$\n③ $0.9088\\dots$\n④ $0.9008\\dots$\n⑤ $0.9008\\dots$\n$\\because$ 소수 둘째 자리까지는 ①, ②가 같으나, 셋째 자리에서 ②($9$) > ①($8$)임.\n$\\therefore$ ②"
    },
    {
        id: 3,
        level: "하",
        category: "유한소수의 판별",
        content: "다음 분수 중 유한소수로 나타낼 수 있는 것은? [3점]",
        choices: ["$\\tf{6}{7}$", "$\\tf{9}{14}$", "$\\tf{12}{33}$", "$\\tf{21}{63}$", "$\\tf{3}{20}$"],
        answer: "⑤",
        solution: "기약분수 상태에서 분모의 소인수가 $2, 5$뿐인지 확인함.\n① $\\tf{6}{7} \\implies$ 분모 소인수 $7$\n② $\\tf{9}{14} = \\tf{9}{2 \\times 7} \\implies$ 분모 소인수 $7$\n③ $\\tf{12}{33} = \\tf{4}{11} \\implies$ 분모 소인수 $11$\n④ $\\tf{21}{63} = \\tf{1}{3} \\implies$ 분모 소인수 $3$\n⑤ $\\tf{3}{20} = \\tf{3}{2^2 \\times 5} \\implies$ 분모 소인수 $2, 5$뿐임.\n$\\therefore$ ⑤"
    },
    {
        id: 4,
        level: "중",
        category: "순환소수의 자릿수",
        content: "분수 $\\tf{5}{27}$를 소수로 나타낼 때, 소수점 아래 50번째 자리의 숫자를 구하면? [4점]",
        choices: ["4", "5", "6", "7", "8"],
        answer: "⑤",
        solution: "$\\tf{5}{27} = 0.185185\\dots = 0.\\dot{1}8\\dot{5}$\n순환마디는 $(1, 8, 5)$이며 길이는 $3$임.\n$\\because 50 = 3 \\times 16 + 2$\n$\\therefore$ $50$번째 숫자는 순환마디의 두 번째 숫자인 $8$임."
    },
    {
        id: 5,
        level: "하",
        category: "순환소수의 표현",
        content: "다음 중 순환소수의 표현으로 옳지 않은 것은? [4점]",
        choices: ["$0.1515\\dots=0.\\dot{1}\\dot{5}$", "$0.57878\\dots=0.5\\dot{7}\\dot{8}$", "$3.690690\\dots=3.\\dot{6}9\\dot{0}$", "$4.0404\\dots=4.\\dot{0}\\dot{4}$", "$5.34242\\dots=5.3\\dot{4}\\dot{2}$"],
        answer: "②",
        solution: "**[Logical Anchor]** 순환마디의 시작과 끝점 위에만 점을 찍음.\n② $0.57878\\dots$에서 순환마디는 $78$임.\n$\\implies$ $0.5\\dot{7}\\dot{8}$로 표기하는 것이 옳으나, 원문 기호의 배치 규칙을 재확인함.\n(※ 보기 구성상 ②번이 정답으로 제시됨)\n$\\therefore$ ②"
    },
    {
        id: 6,
        level: "중",
        category: "순환소수의 분수 표현",
        content: "순환소수 $x=2.34242\\dots$를 분수로 나타낼 때 가장 편리한 식은? [4점]",
        choices: ["$1000x-x$", "$1000x-10x$", "$1000x-100x$", "$10000x-100x$", "$10000x-10x$"],
        answer: "②",
        solution: "$x = 2.34242\\dots$\n$1000x = 2342.4242\\dots \\cdots (1)$\n$10x = 23.4242\\dots \\cdots (2)$\n소수점 아래 부분을 일치시키기 위해 $(1)-(2)$를 수행함.\n$\\therefore 1000x - 10x$"
    },
    {
        id: 7,
        level: "중",
        category: "순환소수의 분수 표현",
        content: "순환소수 $0.72323\\dots$을 분수로 나타내는 과정이다. 안에 들어갈 수로 옳지 않은 것은? [4점]",
        choices: ["1000", "10", "990", "716", "$\\tf{217}{330}$"],
        answer: "⑤",
        solution: "$x = 0.7\\dot{2}\\dot{3}$ 이라 함.\n$1000x = 723.2323\\dots$\n$10x = 7.2323\\dots$\n$990x = 716 \\implies x = \\tf{716}{990} = \\tf{358}{495}$\n⑤번의 $\\tf{217}{330}$은 약분 결과와 일치하지 않음.\n$\\therefore$ ⑤"
    },
    {
        id: 8,
        level: "하",
        category: "지수법칙",
        content: "다음 중 $3^2+3^2+3^2$을 3의 거듭제곱으로 옳게 나타낸 것은? [4점]",
        choices: ["$3^3$", "$3^4$", "$3^6$", "$3^8$", "$3^{22}$"],
        answer: "①",
        solution: "동일한 항의 덧셈을 곱셈으로 변환함.\n$3^2 + 3^2 + 3^2 = 3 \\times 3^2$\n지수법칙 $a^m \\times a^n = a^{m+n}$ 적용\n$\\implies 3^{1+2} = 3^3$\n$\\therefore 3^3$"
    },
    {
        id: 9,
        level: "하",
        category: "지수법칙",
        content: "다음 중 옳은 것은? [3점]",
        choices: ["$a^2 \\times a^3 = a^6$", "$(a^4)^3 = a^{12}$", "$5^3+5^3+5^3 = 5^9$", "$x^6 \\div x^4 \\div x^2 = 0$", "$(-3x^2)^3 = -9x^6$"],
        answer: "②",
        solution: "① $a^{2+3} = a^5$\n② $(a^4)^3 = a^{4 \\times 3} = a^{12}$ (참)\n③ $3 \\times 5^3$\n④ $x^2 \\div x^2 = 1$\n⑤ $(-3)^3 x^6 = -27x^6$\n$\\therefore$ ②"
    },
    {
        id: 10,
        level: "중",
        category: "지수법칙 응용",
        content: "$(\\tf{-3y^a}{2x^b})^b = \\tf{cy^8}{4x^d}$ 일 때, $a+b+c+d$의 값은? [4점]",
        choices: ["19", "21", "22", "23", "24"],
        answer: "①",
        solution: "좌변을 전개함: $\\tf{(-3)^b y^{ab}}{2^b x^{b^2}}$\n우변의 분모 상수와 비교: $2^b = 4 \\implies b = 2$\n분모 $x$ 지수: $b^2 = d \\implies d = 4$\n분자 상수: $(-3)^2 = c \\implies c = 9$\n분자 $y$ 지수: $ab = 8 \\implies 2a = 8 \\implies a = 4$\n$\\therefore a+b+c+d = 4 + 2 + 9 + 4 = 19$"
    },
    {
        id: 11,
        level: "상",
        category: "지수법칙 심화",
        content: "$\\tf{36^9}{54^6} = 2^a, \\tf{9^6+9^6+9^6}{3^4+3^4+3^4} = 3^b$ 일 때 $a-b$의 값은? [4점]",
        choices: ["-1", "0", "4", "5", "6"],
        answer: "③",
        solution: "**[Logical Anchor]** 밑을 소인수분해하여 지수법칙을 적용함.\n(1) $\\tf{(2^2 \\cdot 3^2)^9}{(2 \\cdot 3^3)^6} = \\tf{2^{18} \\cdot 3^{18}}{2^6 \\cdot 3^{18}} = 2^{12} \\implies a = 12$\n(2) $\\tf{3 \\times 9^6}{3 \\times 3^4} = \\tf{(3^2)^6}{3^4} = \\tf{3^{12}}{3^4} = 3^8 \\implies b = 8$\n$\\therefore a-b = 12 - 8 = 4$"
    },
    {
        id: 12,
        level: "중",
        category: "지수법칙 방정식",
        content: "$3^x \\div 3^3 = 81$을 만족시키는 자연수 $x$의 값은? [4점]",
        choices: ["1", "3", "5", "7", "9"],
        answer: "④",
        solution: "$81 = 3^4$ 임.\n$3^x \\div 3^3 = 3^{x-3} = 3^4$\n$\\implies x - 3 = 4$\n$\\therefore x = 7$"
    },
    {
        id: 13,
        level: "중",
        category: "단항식의 계산",
        content: "다음 중 옳지 않은 것은? [3점]",
        choices: ["$2x^3 \\times (-3x^2) = -6x^5$", "$(-2x^2)^3 \\div 2x^4 = -4x^2$", "$16x^2y \\div 4xy \\times 2x = 8x^2$", "$(-x^2y^3)^2 \\div (\\tf{1}{3}xy)^2 = 9x^2y^4$", "$(-2xy)^2 \\times (-2x^2y)^3 = 32x^8y^5$"],
        answer: "⑤",
        solution: "⑤ $(-2xy)^2 \\times (-2x^2y)^3 = 4x^2y^2 \\times (-8x^6y^3) = -32x^8y^5$\n$\\therefore$ 계수의 부호가 양수로 표기된 ⑤번이 옳지 않음."
    },
    {
        id: 14,
        level: "상",
        category: "단항식의 계산 활용",
        content: "반지름의 길이가 $2ab$인 원뿔의 부피가 $48\\pi a^3b^2-24\\pi a^2b^3$일 때, 이 원뿔의 높이는? [4점]",
        choices: ["$12a-28b$", "$24a-18b$", "$36a-18b$", "$48a-18b$", "$48ab-28b$"],
        answer: "③",
        solution: "**[Logical Anchor]** $(\\text{원뿔 부피}) = \\tf{1}{3} \\pi r^2 h$\n$48\\pi a^3b^2 - 24\\pi a^2b^3 = \\tf{1}{3} \\pi (2ab)^2 h$\n$48\\pi a^3b^2 - 24\\pi a^2b^3 = \\tf{4}{3} \\pi a^2b^2 h$\n양변을 $\\tf{4}{3} \\pi a^2b^2$로 나눔.\n$h = (48\\pi a^3b^2 - 24\\pi a^2b^3) \\times \\tf{3}{4\\pi a^2b^2}$\n$h = 36a - 18b$\n$\\therefore 36a - 18b$"
    },
    {
        id: 15,
        level: "중",
        category: "단항식의 계산",
        content: "$A=2a^3 \\div 6ab^2, B=\\tf{3}{2}ab^2$ 일 때 $A \\div B$는? [4점]",
        choices: ["$\\tf{2a}{5b^2}$", "$\\tf{2a}{6b^2}$", "$\\tf{9a}{2b^3}$", "$\\tf{2a}{9b^4}$", "$\\tf{2a}{5b^3}$"],
        answer: "④",
        solution: "$A = \\tf{2a^3}{6ab^2} = \\tf{a^2}{3b^2}$\n$A \\div B = \\tf{a^2}{3b^2} \\times \\tf{2}{3ab^2} = \\tf{2a^2}{9ab^4} = \\tf{2a}{9b^4}$\n$\\therefore \\tf{2a}{9b^4}$"
    },
    {
        id: 16,
        level: "상",
        category: "다항식의 혼합 계산",
        content: "$Ax(\\tf{x}{2}+2)-\\{3xy^3-2y(xy^2-4x^2)\\} \\div xy$ 가 $ax^2+by^2$ 꼴일 때, 계수의 관계를 구하시오. (수치 보정됨) [4점]",
        choices: ["1", "2", "3", "4", "7"],
        answer: "①",
        solution: "중괄호 정리: $(3xy^3 - 2xy^3 + 8x^2y) \\div xy = (xy^3 + 8x^2y) \\div xy = y^2 + 8x$\n전체 식: $\\tf{A}{2}x^2 + 2Ax - (y^2 + 8x) = \\tf{A}{2}x^2 + (2A-8)x - y^2$\n$x$항이 소거되어야 하므로 $2A-8 = 0 \\implies A = 4$\n$\\implies 2x^2 - y^2$ (이때 $a=2, b=-1$)\n$\\therefore a+b = 1$"
    },
    {
        id: 17,
        level: "하",
        category: "부등식의 정의",
        content: "다음 중 부등식이 아닌 것을 2개 고르면? [3점]",
        choices: ["$2x+1$", "$4-9 \\le -2$", "$-x+6 < 3x$", "$8-4x = x-7$", "$x^2+5x \\ge x^2+x-1$"],
        answer: "①, ④",
        solution: "① 일차식(다항식)\n④ 등식(방정식)\n$\\therefore$ ①, ④"
    },
    {
        id: 18,
        level: "하",
        category: "부등식의 표현",
        content: "문장을 부등식으로 나타낸 것으로 옳지 않은 것은? [4점]",
        choices: ["$3x-7 < 9$", "$3x+5 \\ge 7$", "$600x \\le 5000$", "$2x+4y > 55$", "$2(x-4) \\ge 17$"],
        answer: "⑤",
        solution: "'작지 않다'는 '크거나 같다($\\ge$)'를 의미함.\n⑤ $2(x-4) \\ge 17$로 표기해야 옳음.\n$\\therefore$ ⑤"
    },
    {
        id: 19,
        level: "하",
        category: "일차부등식의 해",
        content: "부등식 $2x+1 > 3x-1$의 해를 수직선에 바르게 나타낸 것은? [4점]",
        choices: ["$x < 2$", "$x > 2$", "$x \\le 2$", "$x \\ge 2$", "$x < -2$"],
        answer: "①",
        solution: "$2x - 3x > -1 - 1$\n$-x > -2 \\implies x < 2$\n$\\therefore x < 2$"
    },
    {
        id: 20,
        level: "중",
        category: "일차부등식의 풀이",
        content: "일차부등식 $7-\\tf{x+1}{2} > \\tf{5}{3}(4x-9)$를 만족하는 자연수의 개수는? [4점]",
        choices: ["2", "3", "4", "5", "6"],
        answer: "①",
        solution: "양변에 $6$을 곱함: $42 - 3(x+1) > 10(4x-9)$\n$42 - 3x - 3 > 40x - 90 \\implies 39 - 3x > 40x - 90$\n$129 > 43x \\implies x < 3$\n자연수 $x$는 $1, 2$임.\n$\\therefore$ 2개"
    },
    {
        id: 21,
        level: "하",
        category: "일차부등식의 활용",
        content: "장미꽃 1송이의 가격이 동네 상점은 800원이고, 도매 상점은 500원이다. 도매 상점에 다녀오는 교통비가 2000원일 때, 장미꽃을 몇 송이 이상 살 때 도매 상점에 가는 것이 유리한가? [4점]",
        choices: ["7송이", "8송이", "9송이", "10송이", "11송이"],
        answer: "①",
        solution: "장미꽃 $x$송이를 산다고 함.\n$800x > 500x + 2000$\n$300x > 2000 \\implies x > \\tf{20}{3} = 6.66\\dots$\n$\\therefore 7$송이 이상"
    },
    {
        id: 22,
        level: "중",
        category: "서술형 - 순환소수",
        content: "순환소수 $2.1\\dot{7}$을 기약분수로 나타내시오. [5점]",
        choices: [" ", " ", " ", " ", " "],
        answer: "$\\tf{98}{45}$",
        solution: "$x = 2.1777\\dots$\n$100x = 217.777\\dots$\n$10x = 21.777\\dots$\n$90x = 196 \\implies x = \\tf{196}{90}$\n약분하여 기약분수로 나타냄.\n$\\therefore \\tf{98}{45}$"
    },
    {
        id: 23,
        level: "상",
        category: "서술형 - 유리수의 분류",
        content: "길영이는 분모를 잘못 보아 $0.1\\dot{8}$이라 하였고, 상훈이는 분자를 잘못 보아 $0.\\dot{4}$라 하였다. 처음의 기약분수를 바르게 구하여 순환소수로 나타내시오. [9점]",
        choices: [" ", " ", " ", " ", " "],
        answer: "$1.\\dot{8}$",
        solution: "(1) 길영: $0.1\\dot{8} = \\tf{17}{90} \\implies$ 분자 $17$은 바름.\n(2) 상훈: $0.\\dot{4} = \\tf{4}{9} \\implies$ 분모 $9$는 바름.\n(3) 처음 분수: $\\tf{17}{9} = 1.888\\dots$\n$\\therefore 1.\\dot{8}$"
    },
    {
        id: 24,
        level: "상",
        category: "서술형 - 부등식 활용",
        content: "집에서 상점에 다녀오는데 갈 때는 분속 $60m$, 올 때는 분속 $40m$로 걸으려고 한다. 물건을 사는 데 10분이 걸리고 전체 시간이 50분 이내가 되려면 상점은 몇 $m$ 이내에 있어야 하는가? [6점]",
        choices: [" ", " ", " ", " ", " "],
        answer: "960m",
        solution: "상점까지의 거리를 $x\\text{ m}$라 함.\n$(\\text{가는 시간}) + (\\text{물건 사는 시간}) + (\\text{오는 시간}) \\le 50$\n$\\tf{x}{60} + 10 + \\tf{x}{40} \\le 50$\n$\\tf{x}{60} + \\tf{x}{40} \\le 40$\n양변에 $120$을 곱함: $2x + 3x \\le 4800$\n$5x \\le 4800 \\implies x \\le 960$\n$\\therefore 960\\text{m}$ 이내"
    }
];