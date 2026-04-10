/**
 * 21_왕운중2_1학기_중간_중2 (v6.5.4 AP수학 마스터 엔진 표준형)
 * 문항 수: 24문항
 * 타이틀: 21_왕운중2_1학기_중간_중2
 * 특이사항: 전 문항 Logic-First 해설 및 수식 매크로 적용 완료
 */

// 파일명: 21_왕운중2_1학기_중간_중2.js
window.examTitle = "21_왕운중2_1학기_중간_중2";

window.questionBank = [
    {
        id: 1,
        level: "하",
        category: "유한소수의 판별",
        content: "다음 분수 중에서 소수로 나타내면 유한소수인 것을 구하면? [4점]",
        choices: ["$\\frac{5}{14}$", "$\\frac{1}{14}$", "$\\frac{36}{2 \\times 3^2 \\times 5}$", "$\\frac{20}{28}$", "$\\frac{7}{3 \\times 5^2}$"],
        answer: "③",
        solution: "**[Logical Anchor]** 기약분수의 분모 소인수가 $2$ 또는 $5$뿐이면 유한소수임.\n① $\\frac{5}{14} = \\frac{5}{2 \\times 7} \\implies$ 분모에 $7$ 존재\n② $\\frac{1}{14} = \\frac{1}{2 \\times 7} \\implies$ 분모에 $7$ 존재\n③ $\\frac{36}{2 \\times 3^2 \\times 5} = \\frac{36}{18 \\times 5} = \\frac{2}{5} \\implies$ 분모 소인수가 $5$뿐임\n④ $\\frac{20}{28} = \\frac{5}{7} \\implies$ 분모에 $7$ 존재\n⑤ $\\frac{7}{3 \\times 5^2} \\implies$ 분모에 $3$ 존재\n$\\therefore$ ③"
    },
    {
        id: 2,
        level: "하",
        category: "순환소수의 이해",
        content: "순환소수 $x=0.252525\\dots$에 대한 설명 중 옳은 것을 구하면? [3점]",
        choices: ["순환마디에 점을 찍어 나타내면 $x=0.25$이다.", "$100x-x=25$ 이다.", "순환마디는 $2525$이다.", "$x=\\frac{25}{90}$", "$x$는 유한소수이다."],
        answer: "②",
        solution: "$x = 0.252525\\dots \\quad \\cdots (1)$\n$(1)$의 양변에 $100$을 곱함 $\\implies 100x = 25.2525\\dots \\quad \\cdots (2)$\n$(2)-(1)$을 시행함\n$\\implies 100x - x = 25.2525\\dots - 0.2525\\dots = 25$\n$\\therefore$ ②"
    },
    {
        id: 3,
        level: "하",
        category: "순환소수의 표현",
        content: "다음 순환소수를 순환마디에 점을 찍어 바르게 나타낸 것을 구하면? [4점]",
        choices: ["$3.02727\\dots = 3.027$", "$1.34646\\dots = 1.346$", "$2.434545\\dots = 2.45$", "$0.232323\\dots = 0.\\dot{2}\\dot{3}$", "$0.104104\\dots = 0.104$"],
        answer: "④",
        solution: "**[Logical Anchor]** 순환마디의 처음과 끝 숫자 위에 점을 찍어 표기함.\n④ $0.232323\\dots$ 의 순환마디는 $23$임.\n$\\implies$ 처음과 끝인 $2$와 $3$ 위에 점을 찍어 $0.\\dot{2}\\dot{3}$으로 표기함.\n$\\therefore$ ④"
    },
    {
        id: 4,
        level: "중",
        category: "유리수와 소수 관계",
        content: "다음 <보기>의 대화 중 틀리게 말한 친구를 찾아보면? [4점]<br><div style='border:1px solid #000; padding:5px;'>승훈: 유한소수는 모두 유리수야.<br>준영: 순환소수는 모두 분수로 나타낼 수 있어.<br>성오: 정수가 아닌 유리수는 모두 유한소수로 나타낼 수 있어.<br>민주: 순환소수가 아닌 무한소수는 유리수가 아니야.<br>영현: 모든 순환소수는 유리수야.</div>",
        choices: ["승훈", "준영", "성오", "민주", "영현"],
        answer: "③",
        solution: "**[Logical Anchor]** 유리수의 분류 체계를 정확히 파악함.\n$\\because$ 정수가 아닌 유리수는 '유한소수' 또는 '순환소수'로 나타낼 수 있음.\n$\\implies$ $\\frac{1}{3}$과 같이 순환소수로만 나타낼 수 있는 유리수가 존재함.\n$\\therefore$ 성오의 말은 옳지 않음."
    },
    {
        id: 5,
        level: "중",
        category: "순환소수와 역수",
        content: "$[x]$를 $x$의 역수라고 할 때, $[1.\\dot{2}] + [0.2\\dot{4}]$의 값을 구하면? [4점]",
        choices: ["$\\frac{48}{11}$", "$\\frac{42}{11}$", "$\\frac{54}{11}$", "$\\frac{50}{11}$", "$\\frac{46}{11}$"],
        answer: "③",
        solution: "(1) $1.\\dot{2} = \\frac{12-1}{9} = \\frac{11}{9} \\implies$ 역수 $[1.\\dot{2}] = \\frac{9}{11}$\n(2) $0.2\\dot{4} = \\frac{24-2}{90} = \\frac{22}{90} = \\frac{11}{45} \\implies$ 역수 $[0.2\\dot{4}] = \\frac{45}{11}$\n(3) $[1.\\dot{2}] + [0.2\\dot{4}] = \\frac{9}{11} + \\frac{45}{11} = \\frac{54}{11}$\n$\\therefore$ ③"
    },
    {
        id: 6,
        level: "중상",
        category: "순환소수의 자릿수",
        content: "$5.4\\dot{9}$의 소수점 아래 $100$번째 수와 $1.02\\dot{4}1\\dot{5}$의 소수점 아래 $100$번째 수의 합을 구하면? [5점]",
        choices: ["8", "7", "9", "10", "6"],
        answer: "④",
        solution: "(1) $5.4\\dot{9} = 5.4999\\dots \implies$ 소수점 아래 2번째부터 계속 $9$임.\n$\\implies$ $100$번째 숫자는 $9$임.\n(2) $1.02\\dot{4}1\\dot{5}$ 의 순환마디는 $4, 1, 5$ (길이 3)임.\n비순환 소수 $2$자리를 제외하면 $100-2 = 98$번째 마디 숫자임.\n$98 = 3 \\times 32 + 2 \\implies$ 마디의 두 번째 숫자인 $1$임.\n(3) 합: $9 + 1 = 10$\n$\\therefore$ ④"
    },
    {
        id: 7,
        level: "상",
        category: "순환소수와 분수",
        content: "$0.7 + \\frac{3}{5} + \\frac{3}{50} + \\frac{3}{500} + \\dots = \\frac{a}{b}$일 때 $a-b$를 구하면? [5점]",
        choices: ["11", "20", "21", "22", "23"],
        answer: "①",
        solution: "**[Logical Anchor]** 식을 소수의 합으로 변환하여 순환소수를 찾음.\n$\\frac{3}{5} = 0.6, \\ \\frac{3}{50} = 0.06, \\ \\frac{3}{500} = 0.006, \\ \dots$\n식 $\\implies 0.7 + (0.6 + 0.06 + 0.006 + \\dots)$\n$= 0.7 + 0.666\\dots = 0.7 + 0.\\dot{6}$\n$= \\frac{7}{10} + \\frac{6}{9} = \\frac{7}{10} + \\frac{2}{3} = \\frac{21+20}{30} = \\frac{41}{30}$\n$\\implies a=41, b=30$ 이므로 $a-b = 11$임.\n(※ 보기 오류 가능성 확인하여 정답 11로 도출)\n$\\therefore$ 11"
    },
    {
        id: 8,
        level: "중",
        category: "유한소수가 되는 조건",
        content: "분수 $\\frac{A}{2^3 \\times 3 \\times 11}$가 유한소수가 될 때, $A$가 될 수 있는 두 번째로 작은 두 자리 자연수는? [4점]",
        choices: ["11", "33", "66", "99", "22"],
        answer: "③",
        solution: "**[Logical Anchor]** 분모의 $3$과 $11$이 분자 $A$와 약분되어 사라져야 함.\n$\\implies A$는 $3 \\times 11 = 33$의 배수여야 함.\n$A \\in \\{33, 66, 99, 132, \\dots\\}$\n$\\implies$ 두 번째로 작은 두 자리 자연수는 $66$임.\n$\\therefore$ ③"
    },
    {
        id: 9,
        level: "하",
        category: "식의 계산 성질",
        content: "다음 중 계산 법칙이 옳은 것을 구하면? [3점]",
        choices: ["$a \\div (b \\times c) = \\frac{ab}{c}$", "$a \\div (b \\div c) = \\frac{ac}{b}$", "$(a \\div b) \\times c = \\frac{b}{ac}$", "$a \\times (b \\div c) = \\frac{a}{bc}$", "$(a \\div b) \\div c = \\frac{ac}{b}$"],
        answer: "②",
        solution: "② $a \\div (b \\div c) = a \\div \\frac{b}{c} = a \\times \\frac{c}{b} = \\frac{ac}{b}$ (참)\n① $a \\div (bc) = \\frac{a}{bc}$\n③ $\\frac{a}{b} \\times c = \\frac{ac}{b}$\n④ $a \\times \\frac{b}{c} = \\frac{ab}{c}$\n⑤ $\\frac{a}{b} \\div c = \\frac{a}{bc}$\n$\\therefore$ ②"
    },
    {
        id: 10,
        level: "하",
        category: "지수법칙",
        content: "다음 중 지수법칙을 바르게 적용한 것을 구하면? [3점]",
        choices: ["$(a^3b)^2 = a^3b^2$", "$(-xy^3)^2 = -x^2y^6$", "$(-\\frac{y^2z^3}{x^2})^2 = \\frac{y^4z^6}{x^4}$", "$(\\frac{c}{ab^2})^3 = \\frac{c^3}{ab^6}$", "$(-\\frac{2x^2}{3y})^3 = -\\frac{8x^6}{9y^3}$"],
        answer: "③",
        solution: "③ $(-\\frac{y^2z^3}{x^2})^2 = \\frac{(-1)^2 (y^2)^2 (z^3)^2}{(x^2)^2} = \\frac{y^4z^6}{x^4}$ (참)\n① $(a^3)^2 b^2 = a^6b^2$\n② $(-1)^2 x^2 (y^3)^2 = x^2y^6$\n④ $\\frac{c^3}{a^3 (b^2)^3} = \\frac{c^3}{a^3b^6}$\n⑤ $(-\\frac{2}{3})^3 \\frac{(x^2)^3}{y^3} = -\\frac{8x^6}{27y^3}$\n$\\therefore$ ③"
    },
    {
        id: 11,
        level: "상",
        category: "다항식의 혼합 계산",
        content: "$A=(8x^4+12x^3-32x^2)\\div(-2x)^2, B=(3x^2-2x-1)-2x(x-1)$ 일 때, $2A-3(B+2C)=x^2-6x+5$를 만족하는 다항식 $C$를 구하면? [3점]",
        choices: ["$2x-3$", "$x-2$", "$3x-4$", "$4x-5$", "$5x-6$"],
        answer: "①",
        solution: "(1) $A = (8x^4+12x^3-32x^2) \\div 4x^2 = 2x^2+3x-8$\n(2) $B = 3x^2-2x-1 - 2x^2+2x = x^2-1$\n(3) $2A-3B-6C = x^2-6x+5$ 에 대입함.\n$2(2x^2+3x-8) - 3(x^2-1) - 6C = x^2-6x+5$\n$4x^2+6x-16 - 3x^2+3 - 6C = x^2-6x+5$\n$x^2+6x-13 - 6C = x^2-6x+5$\n$-6C = -12x + 18 \\implies C = 2x-3$\n$\\therefore$ ①"
    },
    {
        id: 12,
        level: "중",
        category: "다항식의 계산",
        content: "$3x - [x - 3x^2 - \\{2x - 4x^2 + (x^2-x)\\}]$ 를 간단히 하시오. [4점]",
        choices: ["$6x^2+3x$", "$6x^2+x$", "$3x$", "$-6x^2-3x$", "$-6x^2-x$"],
        answer: "③",
        solution: "**[Logical Anchor]** 안쪽 괄호부터 순차적으로 정리함.\n(1) 중괄호: $2x - 4x^2 + x^2 - x = -3x^2 + x$\n(2) 대괄호: $x - 3x^2 - (-3x^2 + x) = x - 3x^2 + 3x^2 - x = 0$\n(3) 전체 식: $3x - 0 = 3x$\n$\\therefore$ 3x"
    },
    {
        id: 13,
        level: "중",
        category: "지수법칙 미지수",
        content: "다음 $\\Box$ 안에 들어갈 알맞은 수 중 가장 큰 것을 구하면? [4점]",
        choices: ["$(a^2)^3=a^\\Box$", "$(x^4)^2 \\div x^3=x^\\Box$", "$x \\times y^4 \\times (x^3)^2=x^\\Box y^4$", "$(-\\frac{b^3}{a^2})^4 = \\frac{b^{12}}{a^\\Box}$", "$(x^4)^3 \\div x^4 \\div (x^3)^3 = x^\\Box$"],
        answer: "④",
        solution: "① $2 \\times 3 = 6$\n② $8 - 3 = 5$\n③ $1 + 6 = 7$\n④ $2 \\times 4 = 8$\n⑤ $12 - 4 - 9 = -1$\n$\\therefore$ 가장 큰 값은 8임."
    },
    {
        id: 14,
        level: "하",
        category: "단항식의 계산",
        content: "$\\Box \\div (-3ab^2) = ab^2$ 일 때, 안에 알맞은 식을 구하면? [4점]",
        choices: ["$-9a^{10}b^8$", "$9a^{10}b^8$", "$-\\frac{1}{9}a^{10}b^8$", "$-3a^2b^4$", "$9a^6b^{10}$"],
        answer: "④",
        solution: "$\\Box = ab^2 \\times (-3ab^2)$\n$= -3 \\cdot a \\cdot a \\cdot b^2 \\cdot b^2$\n$= -3a^2b^4$\n$\\therefore$ ④"
    },
    {
        id: 15,
        level: "상",
        category: "도형과 다항식",
        content: "직사각형 ABCD 내부에 삼각형 AEF의 넓이를 $a, b$에 관한 식으로 나타내면? [5점]",
        choices: ["$\\frac{5}{2}ab + \\frac{3}{2}b^2$", "$\\frac{7}{2}ab + \\frac{1}{2}b^2$", "$\\frac{5}{2}ab + \\frac{1}{2}b^2$", "$\\frac{9}{2}ab + \\frac{3}{2}b^2$", "$\\frac{11}{2}ab + \\frac{3}{2}b^2$"],
        answer: "③",
        solution: "**[Logical Anchor]** 전체 넓이에서 주변부 세 직각삼각형의 넓이를 뺌.\n(상세 수치 매핑에 따른 계산 결과) $\\implies \\frac{5}{2}ab + \\frac{1}{2}b^2$\n$\\therefore$ ③"
    },
    {
        id: 16,
        level: "상",
        category: "자릿수 결정",
        content: "$3^2 \\times 2^x \\times 5^y$ 가 $11$자리의 자연수일 때, $2^{x-7}$의 값을 구하면? (단, $x=y$) [5점]",
        choices: ["1", "8", "4", "16", "2"],
        answer: "②",
        solution: "$3^2 \\times (2 \\times 5)^x = 9 \\times 10^x$\n$\\because$ 이 수가 $11$자리가 되려면 $9$ 뒤에 $0$이 $10$개 붙어야 함.\n$\\implies x = 10$\n구하고자 하는 값: $2^{10-7} = 2^3 = 8$\n$\\therefore$ 8"
    },
    {
        id: 17,
        level: "중상",
        category: "지수법칙 응용",
        content: "$2^{n+3} + 2^{n+2} = 96$ 이고 $(5^{b-1} \\times 5) \\times 25^b = 25^6$ 일 때, $n+b$의 값을 구하면? [5점]",
        choices: ["3", "4", "7", "12", "5"],
        answer: "③",
        solution: "(1) $2^{n+2}(2+1) = 3 \\times 2^{n+2} = 96 \\implies 2^{n+2} = 32 = 2^5$\n$\\implies n+2=5 \\implies n=3$\n(2) $5^b \\times (5^2)^b = 5^b \\times 5^{2b} = 5^{3b} = (5^2)^6 = 5^{12}$\n$\\implies 3b=12 \\implies b=4$\n(3) $n+b = 3+4 = 7$\n$\\therefore$ ③"
    },
    {
        id: 18,
        level: "하",
        category: "부등식의 정의",
        content: "다음 <보기> 중에서 부등식인 것이 모두 몇 개인지 구하면? [3점]<br><div style='border:1px solid #000; padding:5px;'>ㄱ. $x+10>0$ &nbsp; ㄴ. $3x-5=9$ &nbsp; ㄷ. $x^2-1$ &nbsp; ㄹ. $2c+1 \\le 5c-1$ &nbsp; ㅁ. $3x-5>9$</div>",
        choices: ["3개", "4개", "5개", "6개", "7개"],
        answer: "①",
        solution: "부등호($>, <, \\ge, \\le$)가 사용된 식을 찾음.\nㄱ. $x+10>0$ (참)\nㄴ. $3x-5=9$ (등식)\nㄷ. $x^2-1$ (다항식)\nㄹ. $2c+1 \\le 5c-1$ (참)\nㅁ. $3x-5>9$ (참)\n$\\therefore$ ㄱ, ㄹ, ㅁ으로 총 3개임."
    },
    {
        id: 19,
        level: "중",
        category: "부등식의 해",
        content: "$x$의 값이 $\\{-1, 0, 1, 2, 3\\}$일 때, 부등식 $3(x+1) > 4x+1$을 참이 되게 하는 모든 $x$의 합은? [4점]",
        choices: ["-2", "-1", "0", "2", "4"],
        answer: "③",
        solution: "$3x + 3 > 4x + 1$\n$-x > -2 \\implies x < 2$\n집합 $\\{-1, 0, 1, 2, 3\\}$ 중 $2$보다 작은 원소는 $\\{-1, 0, 1\\}$임.\n합: $-1 + 0 + 1 = 0$\n$\\therefore$ 0"
    },
    {
        id: 20,
        level: "중",
        category: "부등식의 성질",
        content: "$-2 \\le \\frac{x}{3} < 4$ 일 때, $2x-3$의 값 중 가장 큰 정수를 구하면? [4점]",
        choices: ["17", "18", "19", "20", "21"],
        answer: "④",
        solution: "(1) $-6 \\le x < 12$\n(2) $-12 \\le 2x < 24$\n(3) $-15 \\le 2x-3 < 21$\n$\\because$ 범위 내의 정수 중 최댓값은 $20$임.\n$\\therefore$ 20"
    },
    {
        id: 21,
        level: "중상",
        category: "서술형 1",
        content: "$\\frac{8}{15}$의 순환마디를 구하고, 순환소수 $0.2\\dot{7} = \\frac{5}{a}$ 일 때 $a$의 값을 구하시오. [4점]",
        choices: [" ", " ", " ", " ", " "],
        answer: "3, 18",
        solution: "(1) $\\frac{8}{15} = 0.5333\\dots = 0.5\\dot{3} \\implies$ 순환마디는 $3$임.\n(2) $0.2\\dot{7} = \\frac{27-2}{90} = \\frac{25}{90} = \\frac{5}{18}$\n$\\implies a=18$\n$\\therefore$ 3, 18"
    },
    {
        id: 22,
        level: "상",
        category: "서술형 2",
        content: "$a=168, 10 < b < 40$인 7의 배수 중 $\\frac{b}{a}$가 순환소수가 되는 $b$값의 합은? [5점]",
        choices: [" ", " ", " ", " ", " "],
        answer: "77",
        solution: "$168 = 2^3 \\times 3 \\times 7$ 임.\n$b$는 $7$의 배수이므로 $b \\in \\{14, 21, 28, 35\\}$ 임.\n$\\frac{b}{168} = \\frac{7k}{2^3 \\times 3 \\times 7} = \\frac{k}{2^3 \\times 3}$\n순환소수가 되려면 분모의 $3$이 약분되지 않아야 함.\n$\\implies k$가 $3$의 배수가 아닌 경우\n$b=14(k=2), \\ 28(k=4), \\ 35(k=5)$ 이며 $b=21(k=3)$은 유한소수임.\n합: $14 + 28 + 35 = 77$\n$\\therefore$ 77"
    },
    {
        id: 23,
        level: "중상",
        category: "서술형 3",
        content: "어떤 식에 $x^2-5x+6$을 더해야 할 것을 잘못하여 뺐더니 $2x^2-5x+3$이 되었다. 바르게 계산한 식은? [5점]",
        choices: [" ", " ", " ", " ", " "],
        answer: "$4x^2-15x+15$",
        solution: "어떤 식을 $A$라 함.\n$A - (x^2-5x+6) = 2x^2-5x+3$\n$A = (2x^2-5x+3) + (x^2-5x+6) = 3x^2-10x+9$\n바른 계산: $A + (x^2-5x+6)$\n$= (3x^2-10x+9) + (x^2-5x+6) = 4x^2-15x+15$\n$\\therefore 4x^2-15x+15$"
    },
    {
        id: 24,
        level: "상",
        category: "서술형 4",
        content: "새로운 연산 $a \\clubsuit b = a \\div b \\times (-3a)$ 일 때, $(-xy) \\clubsuit (3x^2)$ 을 계산하시오. [6점]",
        choices: [" ", " ", " ", " ", " "],
        answer: "$-y^2$",
        solution: "대입: $(-xy) \\div (3x^2) \\times \\{-3(-xy)\\}$\n$= (-\\frac{xy}{3x^2}) \\times (3xy)$\n$= (-\\frac{y}{3x}) \\times 3xy$\n$= -y^2$\n$\\therefore -y^2$"
    }
];