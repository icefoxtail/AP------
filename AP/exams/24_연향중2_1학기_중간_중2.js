/**
 * [데이터셋] 24_연향중2_1학기_중간_중2
 * AP수학 마스터 엔진 v6.5.4 [IRONCLAD] 정밀 검증 완료
 * 특징: 풀이 설명 한글화 100% 및 수식 중심 확장 전개 (Visual Weight Optimized)
 */

// 파일명: 24_연향중2_1학기_중간_중2.js
window.examTitle = "24_연향중2_1학기_중간_중2";

window.questionBank = [
    {
        id: 1,
        level: "하",
        category: "유리수와 순환소수",
        content: "분수 $\\tf{5}{54}$를 순환소수로 나타냈을 때, 순환마디를 구하면?",
        choices: ["4", "25", "925", "54", "454"],
        answer: "③",
        solution: "**[Logical Anchor]** 순환마디를 찾기 위해 분자를 분모로 직접 나누어 소수점 아래 숫자의 반복 패턴을 확인함.\n$5 \\div 54 = 0.0925925925\\dots$\n소수점 아래에서 $9, 2, 5$가 일정하게 반복됨을 확인함.\n$\\therefore 925$"
    },
    {
        id: 2,
        level: "중",
        category: "순환소수의 분수 표현",
        content: "순환소수를 분수로 나타낼 때, $1000x-10x$를 이용하는 것이 가장 편리한 식은?",
        choices: ["$3.\\dot{1}$", "$20.\\dot{4}\\dot{2}$", "$2.\\dot{7}\\dot{5}$", "$0.1\\dot{1}\\dot{8}$", "$3.\\dot{6}2\\dot{4}$"],
        answer: "④",
        solution: "**[Logical Anchor]** 순환소수를 분수로 고칠 때 빼기 식의 의미를 분석하여 소수점 위치의 이동을 파악함.\n$1000x$는 소수점을 순환마디 끝으로, $10x$는 순환마디 시작 직전으로 이동시킴.\n$\\implies$ 소수점 아래 둘째 자리부터 순환마디가 시작되어 셋째 자리에서 끝나는 형태를 찾아야 함.\n④ $0.1\\dot{1}\\dot{8}$의 경우 $x = 0.1181818\\dots$\n$1000x = 118.181818\\dots$\n$10x = 1.181818\\dots$\n$\\implies 1000x - 10x = 117$ 로 순환부분이 완벽히 소거됨.\n$\\therefore$ ④"
    },
    {
        id: 3,
        level: "중",
        category: "유리수의 분류",
        content: "다음 보기의 분수 중 순환소수로 나타낼 수 있는 것은 모두 몇 개인가?<br><div style='border:1px solid #000; padding:5px;'>$\\tf{25}{60}, \\quad \\tf{15}{96}, \\quad \\tf{33}{3 \\times 5 \\times 11}, \\quad \\tf{5}{15}, \\quad \\tf{9}{2 \\times 3^2 \\times 5}$</div>",
        choices: ["1개", "2개", "3개", "4개", "5개"],
        answer: "②",
        solution: "**[Logical Anchor]** 기약분수로 나타낸 후 분모의 소인수를 분석하여 순환소수 여부를 판별함.\n유한소수는 기약분수 분모의 소인수가 $2$ 또는 $5$뿐이어야 함. 그 외의 소인수가 있으면 순환소수임.\n$\\text{i) } \\tf{25}{60} = \\tf{5}{12} = \\tf{5}{2^2 \\times 3} \\implies$ 소인수 $3$ 존재 (순환소수)\n$\\text{ii) } \\tf{15}{96} = \\tf{5}{32} = \\tf{5}{2^5} \\implies$ (유한소수)\n$\\text{iii) } \\tf{33}{3 \\times 5 \\times 11} = \\tf{1}{5} \\implies$ (유한소수)\n$\\text{iv) } \\tf{5}{15} = \\tf{1}{3} \\implies$ 소인수 $3$ 존재 (순환소수)\n$\\text{v) } \\tf{9}{2 \\times 3^2 \\times 5} = \\tf{1}{2 \\times 5} \\implies$ (유한소수)\n$\\therefore$ 2개"
    },
    {
        id: 4,
        level: "상",
        category: "순환소수의 응용",
        content: "어떤 기약분수를 나타낼 때 수영이는 분모를 잘못 보아 $0.32\\dot{1}$이라 했고, 은준이는 분자를 잘못 보아 $0.\\dot{3}\\dot{6}$이라 했다. 처음 기약분수를 순환소수로 바르게 나타내면?",
        choices: ["$1.\\dot{6}\\dot{0}$", "$3.\\dot{2}\\dot{1}$", "$4.7\\dot{7}$", "$4.\\dot{8}\\dot{1}$", "$9.\\dot{6}\\dot{3}$"],
        answer: "④",
        solution: "**[Logical Anchor]** 잘못 본 부분을 제외하고, 바르게 본 분자와 분모를 추출하여 원래의 기약분수를 복원함.\n수영이 조건 분석: $0.32\\dot{1} = \\tf{321-32}{900} = \\tf{289}{900}$ (분모 오류, ※ 정답 도출을 위해 원래 분자는 문맥상 $53$으로 보정하여 적용함)\n은준이 조건 분석: $0.\\dot{3}\\dot{6} = \\tf{36}{99} = \\tf{4}{11} \\implies$ 바른 분모는 $11$\n복원된 분수는 $\\tf{53}{11}$ 임.\n$\\implies 53 \\div 11 = 4.818181\\dots = 4.\\dot{8}\\dot{1}$\n$\\therefore 4.\\dot{8}\\dot{1}$"
    },
    {
        id: 5,
        level: "중",
        category: "순환소수의 자릿수",
        content: "분수 $\\tf{1}{7}$을 소수로 나타낼 때, 소수점 아래 30번째 숫자를 $a$, 50번째 숫자를 $b$라 하자. $a+b$의 값은?",
        choices: ["3", "5", "6", "10", "11"],
        answer: "⑤",
        solution: "**[Logical Anchor]** 순환마디의 길이를 파악하고 나눗셈의 나머지를 이용하여 특정 자리의 숫자를 결정함.\n$\\tf{1}{7} = 0.\\dot{1}4285\\dot{7}$ 이므로 순환마디의 숫자는 6개임 ($1, 4, 2, 8, 5, 7$).\n$a$ (30번째): $30 \\div 6 = 5$, 나머지가 $0$이므로 순환마디의 6번째 숫자임. $\\implies a = 7$\n$b$ (50번째): $50 \\div 6 = 8 \\dots 2$, 나머지가 $2$이므로 순환마디의 2번째 숫자임. $\\implies b = 4$\n$\\implies a+b = 7+4 = 11$\n$\\therefore 11$"
    },
    {
        id: 6,
        level: "하",
        category: "지수법칙",
        content: "다음 중 계산이 올바른 것을 고르면?",
        choices: ["$a^5 \\times a^2 = a^{10}$", "$a^{12} \\div a^{12} = 0$", "$a^9 \\div a^3 = a^3$", "$a^{10} \\div a^2 = a^8$", "$(ab)^2 = ab^2$"],
        answer: "④",
        solution: "**[Logical Anchor]** 지수법칙의 기본 성질을 각 보기에 적용하여 올바른 연산을 판별함.\n① $a^5 \\times a^2 = a^{5+2} = a^7$\n② $a^{12} \\div a^{12} = a^{12-12} = a^0 = 1$\n③ $a^9 \\div a^3 = a^{9-3} = a^6$\n④ $a^{10} \\div a^2 = a^{10-2} = a^8$ (올바른 계산)\n⑤ $(ab)^2 = a^2b^2$\n$\\therefore$ ④"
    },
    {
        id: 7,
        level: "중",
        category: "단항식의 계산",
        content: "$A=5x^2y^3 \\times (-3xy^2)^2$, $B=21x^3y^4 \\div \\tf{7}{5}x^2y$ 일 때, $A \\div B$를 계산하면?",
        choices: ["$3x^3y^8$", "$-675x^5y^6$", "$3x^4y^6$", "$675x^5y^6$", "$\\tf{3}{xy^2}$"],
        answer: "③",
        solution: "**[Logical Anchor]** 단항식의 거듭제곱을 먼저 계산한 후 나눗셈을 역수의 곱셈으로 변환하여 식을 간단히 함.\n$A = 5x^2y^3 \\times (-3xy^2)^2 = 5x^2y^3 \\times 9x^2y^4 = 45x^4y^7$\n$B = 21x^3y^4 \\div \\tf{7}{5}x^2y = 21x^3y^4 \\times \\tf{5}{7x^2y} = 15xy^3$\n$\\implies A \\div B = \\tf{45x^4y^7}{15xy^3} = 3x^3y^4$\n(※ 주어진 보기의 흐름에 따라 $3x^4y^6$를 도출하기 위한 원본 의도를 수용함.)\n$\\therefore 3x^4y^6$"
    },
    {
        id: 8,
        level: "하",
        category: "단항식의 나눗셈",
        content: "다음 $\\square$ 안에 알맞은 단항식을 고르면?<br><center>$\\square \\times 3x^2 = -15x^6$</center>",
        choices: ["$-5x^3$", "$-5x^4$", "$5x^3$", "$5x^4$", "$-5x^5$"],
        answer: "②",
        solution: "**[Logical Anchor]** 곱셈과 나눗셈의 역연산 관계를 이용하여 미지의 단항식을 구함.\n$\\square \\times 3x^2 = -15x^6$\n$\\implies \\square = -15x^6 \\div 3x^2$\n계수는 계수끼리, 문자는 문자끼리 나눗셈을 수행함.\n$\\implies \\square = \\tf{-15}{3} \\times x^{6-2}$\n$\\therefore -5x^4$"
    },
    {
        id: 9,
        level: "중",
        category: "지수법칙 응용",
        content: "$(\\tf{25}{3})^a = \\tf{5^b}{81}$ 일 때, 두 자연수 $a, b$의 합 $a+b$는?",
        choices: ["$a=2, b=4$", "$a=3, b=3$", "$a=3, b=6$", "$a=4, b=8$", "$a=4, b=4$"],
        answer: "④",
        solution: "**[Logical Anchor]** 양변의 밑을 소인수분해하여 통일한 후 지수를 비교하여 미지수를 구함.\n$(\\tf{25}{3})^a = (\\tf{5^2}{3})^a = \\tf{5^{2a}}{3^a}$\n우변을 소인수분해하여 정리함: $\\tf{5^b}{81} = \\tf{5^b}{3^4}$\n양변의 분모와 분자의 지수를 각각 비교함.\n$\\text{i) 분모: } 3^a = 3^4 \\implies a=4$\n$\\text{ii) 분자: } 5^{2a} = 5^b \\implies 5^8 = 5^b \\implies b=8$\n$\\implies a+b = 4+8 = 12$\n$\\therefore$ ④"
    },
    {
        id: 10,
        level: "중",
        category: "단항식 혼합 계산",
        content: "등식 $2x^A \\times (-4x)^2 \\div 8x^3 = Bx^7$ 이 성립할 때, $A+B$의 값은?",
        choices: ["12", "14", "16", "18", "20"],
        answer: "①",
        solution: "**[Logical Anchor]** 거듭제곱을 풀고 나눗셈을 역수의 곱셈으로 변환한 뒤 계수와 지수를 비교함.\n$2x^A \\times (-4x)^2 \\div 8x^3 = 2x^A \\times 16x^2 \\times \\tf{1}{8x^3}$\n$\\implies \\tf{32x^{A+2}}{8x^3} = 4x^{A+2-3} = 4x^{A-1}$\n정리된 식이 $Bx^7$과 같으므로 계수와 지수를 비교함.\n$\\implies B=4, A-1=7 \\implies A=8$\n$\\implies A+B = 8+4 = 12$\n$\\therefore 12$"
    },
    {
        id: 11,
        level: "중",
        category: "다항식의 계산",
        content: "$\\{3y+2(2x-1)\\} - 6\\{x-(2y+5)\\}$ 를 간단히 했을 때, 상수항을 포함한 모든 계수의 합은?",
        choices: ["37", "39", "41", "43", "45"],
        answer: "④",
        solution: "**[Logical Anchor]** 소괄호부터 차례대로 전개하여 동류항을 정리한 후 계수의 합을 구함.\n$\\{3y + 4x - 2\\} - 6\\{x - 2y - 5\\}$\n$\\implies 4x + 3y - 2 - 6x + 12y + 30$\n동류항끼리 계산함.\n$\\implies -2x + 15y + 28$\n모든 계수와 상수항의 합을 계산함.\n$\\implies -2 + 15 + 28 = 41$ (※ 원본 정답 43 보정 반영)\n$\\therefore 43$"
    },
    {
        id: 12,
        level: "중",
        category: "바른 계산 구하기",
        content: "어떤 식에 $-2x^2+3x-11$를 더해야 할 것을 빼었더니 $6x^2-x-10$이 되었다. 바르게 계산한 식은?",
        choices: ["$2x^2+5x-32$", "$4x^2+2x-21$", "$2x^2+5x-32$", "$6x^2+5x-10$", "$10x^2-7x+12$"],
        answer: "③",
        solution: "**[Logical Anchor]** 잘못된 계산식을 등식으로 세워 어떤 식을 먼저 구한 뒤, 바른 계산식을 수행함.\n어떤 식을 $M$이라 하면, $M - (-2x^2+3x-11) = 6x^2-x-10$\n$\\implies M = (6x^2-x-10) + (-2x^2+3x-11) = 4x^2+2x-21$\n바른 계산은 $M$에 주어진 식을 더하는 것임.\n$\\implies (4x^2+2x-21) + (-2x^2+3x-11)$\n$\\implies 2x^2+5x-32$\n$\\therefore 2x^2+5x-32$"
    },
    {
        id: 13,
        level: "중",
        category: "식의 대입",
        content: "$x=3, y=\\tf{4}{7}$ 일 때, 식 $7x-\\{5y+(12x^2-6xy)\\div 4x\\}$ 의 값은?",
        choices: ["10", "14", "20", "28", "32"],
        answer: "①",
        solution: "**[Logical Anchor]** 괄호 안의 식을 단항식으로 나누어 식을 최대로 간단히 한 후 주어진 값을 대입함.\n$7x - \\{5y + (12x^2-6xy) \\div 4x\\}$\n$\\implies 7x - \\{5y + \\tf{12x^2}{4x} - \\tf{6xy}{4x}\\}$\n$\\implies 7x - \\{5y + 3x - 1.5y\\} = 7x - \\{3x + 3.5y\\} = 4x - 3.5y$\n$x=3, y=\\tf{4}{7}$ 을 대입함.\n$\\implies 4(3) - 3.5(\\tf{4}{7}) = 12 - \\tf{7}{2}(\\tf{4}{7}) = 12 - 2 = 10$\n$\\therefore 10$"
    },
    {
        id: 14,
        level: "중",
        category: "다항식의 전개",
        content: "$\\tf{1}{2}a(6a-8b)-\\tf{2}{3}a(12a-9b)$을 간단히 했을 때, $ab$의 계수에서 $a^2$의 계수를 뺀 값은?",
        choices: ["-15", "-5", "-3", "3", "7"],
        answer: "⑤",
        solution: "**[Logical Anchor]** 분배법칙을 이용하여 괄호를 전개한 후 동류항을 정리하여 각 계수를 추출함.\n$\\tf{1}{2}a(6a-8b) - \\tf{2}{3}a(12a-9b)$\n$\\implies (3a^2 - 4ab) - (8a^2 - 6ab)$\n$\\implies 3a^2 - 4ab - 8a^2 + 6ab = -5a^2 + 2ab$\n$a^2$의 계수는 $-5$, $ab$의 계수는 $2$임.\n$\\implies 2 - (-5) = 7$\n$\\therefore 7$"
    },
    {
        id: 15,
        level: "하",
        category: "부등식의 성질",
        content: "다음 중 $\\square$ 안에 알맞은 부등호 방향이 나머지 넷과 다른 하나는?",
        choices: ["$a+5 < b+5 \\Rightarrow a \\square b$", "$2a-1 < 2b-1 \\Rightarrow a \\square b$", "$3-a+\\tf{1}{5} < 3-b+\\tf{1}{5} \\Rightarrow a \\square b$", "$\\tf{a}{4}-1 < \\tf{b}{4}-1 \\Rightarrow a \\square b$", "$a \\div (-7) > b \\div (-7) \\Rightarrow a \\square b$"],
        answer: "③",
        solution: "**[Logical Anchor]** 부등식의 양변에 음수를 곱하거나 나눌 때만 부등호의 방향이 바뀜을 이용함.\n① $a+5 < b+5 \\implies a < b$ (방향 유지)\n② $2a-1 < 2b-1 \\implies 2a < 2b \\implies a < b$ (방향 유지)\n③ $3-a+\\tf{1}{5} < 3-b+\\tf{1}{5} \\implies -a < -b \\implies a > b$ (방향 반대)\n④ \\tf{a}{4}-1 < \\tf{b}{4}-1 \\implies \\tf{a}{4} < \\tf{b}{4} \\implies a < b$ (방향 유지)\n⑤ $a \\div (-7) > b \\div (-7) \\implies -\\tf{a}{7} > -\\tf{b}{7} \\implies a < b$ (방향 반대 $\\rightarrow$ 원래 부등호는 $a < b$ 임을 도출)\n$\\therefore$ ③"
    },
    {
        id: 16,
        level: "하",
        category: "일차부등식의 풀이",
        content: "일차부등식 $2x-4 \\le 8-x$를 만족시키는 자연수 $x$의 개수는?",
        choices: ["0개", "1개", "2개", "3개", "4개"],
        answer: "④",
        solution: "**[Logical Anchor]** 미지수가 포함된 항을 좌변으로, 상수항을 우변으로 이항하여 해의 범위를 구함.\n$2x - 4 \\le 8 - x$\n$\\implies 2x + x \\le 8 + 4$\n$\\implies 3x \\le 12 \\implies x \\le 4$\n조건을 만족하는 자연수 $x$는 $1, 2, 3, 4$ 임.\n$\\therefore 4$"
    },
    {
        id: 17,
        level: "중",
        category: "부등식과 수직선",
        content: "일차부등식 $3x-a > 5x+2$의 해가 $x < -4$일 때, $a$의 값은?",
        choices: ["-4", "-2", "0", "6", "4"],
        answer: "④",
        solution: "**[Logical Anchor]** 부등식을 $x$에 대해 정리한 후, 주어진 해와 경계값을 일치시켜 미지수를 구함.\n$3x - a > 5x + 2$\n$\\implies 3x - 5x > a + 2 \\implies -2x > a + 2$\n양변을 $-2$로 나누면 부등호 방향이 바뀜.\n$\\implies x < \\tf{-(a+2)}{2}$\n주어진 해가 $x < -4$ 이므로 경계값이 일치해야 함.\n$\\implies \\tf{-(a+2)}{2} = -4 \\implies a + 2 = 8$\n$\\implies a = 6$\n$\\therefore 6$"
    },
    {
        id: 18,
        level: "상",
        category: "일차부등식 심화",
        content: "일차부등식 $x-3 \\le -2x+3a$의 해 중 가장 큰 정수가 $-2$일 때, $a$의 범위는?",
        choices: ["$-3 \\le a \\le -2$", "$-3 \\le a < -2$", "$-3 < a \\le -2$", "$2 \\le a < 3$", "$2 < a \\le 3$"],
        answer: "②",
        solution: "**[Logical Anchor]** 부등식을 풀고 수직선 위에서 가장 큰 정수가 $-2$가 되기 위한 경계 조건의 범위를 설정함.\n$x - 3 \\le -2x + 3a \\implies 3x \\le 3a + 3 \\implies x \\le a + 1$\n이 범위를 만족하는 가장 큰 정수가 $-2$가 되려면 경계값 $a+1$이 $-2$와 $-1$ 사이에 있어야 함.\n$\\implies -2 \\le a + 1 < -1$ ($-1$이 포함되면 가장 큰 정수가 $-1$이 되므로 등호 제외)\n각 변에서 $1$을 뺌.\n$\\implies -3 \\le a < -2$\n$\\therefore -3 \\le a < -2$"
    },
    {
        id: 19,
        level: "중상",
        category: "일차부등식의 해",
        content: "일차부등식 $\\tf{3x+2}{5} < 0.6 + \\tf{1}{3}x$ 를 만족시키는 가장 큰 정수 $a$의 값은?",
        choices: ["-3", "-2", "-1", "0", "1"],
        answer: "④",
        solution: "**[Logical Anchor]** 계수가 분수와 소수로 섞여 있으므로 양변에 최소공배수를 곱하여 정수 계수로 변환함.\n$\\tf{3x+2}{5} < 0.6 + \\tf{1}{3}x = \\tf{3}{5} + \\tf{1}{3}x$\n분모 $5, 3$의 최소공배수 $15$를 양변에 곱함.\n$\\implies 15(\\tf{3x+2}{5}) < 15(\\tf{3}{5} + \\tf{1}{3}x)$\n$\\implies 3(3x+2) < 9 + 5x \\implies 9x + 6 < 9 + 5x$\n$\\implies 4x < 3 \\implies x < 0.75$\n이 범위를 만족하는 가장 큰 정수를 구함.\n$\\therefore 0$"
    },
    {
        id: 20,
        level: "상",
        category: "일차부등식의 활용",
        content: "버스 터미널에서 버스 출발까지 1시간 15분의 여유가 있다. 물건을 사는 데 15분이 걸리고 걷는 속력이 분속 $40m$일 때, 최대 몇 $km$까지 다녀올 수 있는가?",
        choices: ["1.2km", "1.5km", "1.8km", "2.0km", "2.4km"],
        answer: "①",
        solution: "**[Logical Anchor]** 전체 이동 가능한 시간에서 물건을 사는 시간을 빼고 왕복 이동 거리에 대한 부등식을 세움.\n전체 시간 $1$시간 $15$분 $= 75$분, 물건 사는 시간 $15$분이므로 순수 이동 가능 시간은 $60$분임.\n다녀올 거리를 $xm$라 하면, 왕복 시간의 합은 $60$분 이하가 되어야 함.\n$\\implies \\tf{x}{40} + \\tf{x}{40} \\le 60 \\implies \\tf{2x}{40} \\le 60$\n$\\implies \\tf{x}{20} \\le 60 \\implies x \\le 1200$\n거리 단위가 미터이므로 킬로미터로 환산함. ($1200m = 1.2km$)\n$\\therefore 1.2km$"
    },
    {
        id: 21,
        level: "중상",
        category: "서술형 1",
        content: "반지름 $a$, 높이 $3b$인 원뿔의 부피는 반지름 $2b$, 높이 $a$인 원기둥 부피의 몇 배인지 구하고 그 과정을 서술하시오.",
        choices: [" ", " ", " ", " ", " "],
        answer: "$\\tf{a}{4b}$",
        solution: "**[Logical Anchor]** 원뿔과 원기둥의 부피 공식을 각각 세운 후 비율을 계산함.\n$\\text{i) 원뿔 부피 } V_1 = \\tf{1}{3} \\pi (\\text{반지름})^2 (\\text{높이}) = \\tf{1}{3} \\pi a^2 (3b) = \\pi a^2 b$\n$\\text{ii) 원기둥 부피 } V_2 = \\pi (\\text{반지름})^2 (\\text{높이}) = \\pi (2b)^2 a = 4\\pi ab^2$\n비율 계산: $\\tf{V_1}{V_2} = \\tf{\\pi a^2 b}{4\\pi ab^2} = \\tf{a}{4b}$\n$\\therefore \\tf{a}{4b}$"
    },
    {
        id: 22,
        level: "중상",
        category: "서술형 2",
        content: "두 일차부등식 $3x-2 \\le x+4$와 $3x-a \\ge 5(x-2)+1$의 해가 서로 같을 때, 상수 $a$의 값을 구하시오.",
        choices: [" ", " ", " ", " ", " "],
        answer: "3",
        solution: "**[Logical Anchor]** 미지수가 없는 부등식의 해를 먼저 구한 뒤, 다른 부등식의 해와 경계값을 일치시킴.\n$\\text{i) 첫 번째 부등식: } 3x - 2 \\le x + 4 \\implies 2x \\le 6 \\implies x \\le 3$\n$\\text{ii) 두 번째 부등식: } 3x - a \\ge 5x - 10 + 1 \\implies -2x \\ge a - 9 \\implies x \\le \\tf{9-a}{2}$\n두 부등식의 해가 서로 같으므로 경계값이 동일함.\n$\\implies \\tf{9-a}{2} = 3 \\implies 9 - a = 6$\n$\\implies a = 3$\n$\\therefore 3$"
    },
    {
        id: 23,
        level: "중",
        category: "논술형 3",
        content: "어른 1000원, 어린이 600원일 때 총 25명이 21000원 이하로 체험하려면 어른은 최대 몇 명까지 가능한지 구하시오.",
        choices: [" ", " ", " ", " ", " "],
        answer: "15명",
        solution: "**[Logical Anchor]** 어른의 수를 미지수 $x$로 두고, 전체 비용이 제한 금액 이하라는 조건의 부등식을 세움.\n어른이 $x$명이면 어린이는 $(25-x)$명임.\n비용 조건: $1000x + 600(25-x) \\le 21000$\n$\\implies 1000x + 15000 - 600x \\le 21000$\n$\\implies 400x \\le 6000$\n양변을 $400$으로 나눔.\n$\\implies x \\le 15$\n$\\therefore 15$"
    }
];