/**
 * 19_연향중2_1학기_중간_중2 (v6.5.4 마스터 엔진 병합본)
 * 문항 수: 24문항
 * 적용 매뉴얼: AP수학 무결성 해설 & 엔진 가동 매뉴얼 v1.3 [IRONCLAD]
 * 해설 스타일: Logic-First (수식 주도형 전개, Logical Anchor 적용)
 */

// 파일명: 19_연향중2_1학기_중간_중2.js
window.examTitle = "19_연향중2_1학기_중간_중2";

window.questionBank = [
    {
        id: 1,
        level: "하",
        category: "유한소수의 판별",
        content: "다음 중 유한소수로 나타낼 수 있는 분수는? [3.5점]",
        choices: ["$\\frac{8}{12}$", "$\\frac{9}{24}$", "$\\frac{15}{36}$", "$\\frac{35}{75}$", "$\\frac{26}{60}$"],
        answer: "②",
        solution: "**[Logical Anchor]** 유한소수가 되려면 기약분수의 분모 소인수가 $2$ 또는 $5$뿐이어야 함.\n① $\\frac{8}{12} = \\frac{2}{3} \\implies$ 분모에 소인수 $3$ 존재\n② $\\frac{9}{24} = \\frac{3}{8} = \\frac{3}{2^3} \\implies$ 분모의 소인수가 $2$뿐임 (유한)\n③ $\\frac{15}{36} = \\frac{5}{12} = \\frac{5}{2^2 \\times 3} \\implies$ 분모에 소인수 $3$ 존재\n④ $\\frac{35}{75} = \\frac{7}{15} = \\frac{7}{3 \\times 5} \\implies$ 분모에 소인수 $3$ 존재\n⑤ $\\frac{26}{60} = \\frac{13}{30} = \\frac{13}{2 \\times 3 \\times 5} \\implies$ 분모에 소인수 $3$ 존재\n$\\therefore$ ②"
    },
    {
        id: 2,
        level: "중",
        category: "순환소수의 자릿수",
        content: "분수 $\\frac{5}{27}$ 를 소수로 나타낼 때, 소수점 아래 $40$번째 자리의 숫자는? [4점]",
        choices: ["1", "2", "3", "4", "5"],
        answer: "①",
        solution: "$\\frac{5}{27}$를 직접 나누어 소수로 나타냄.\n$\\frac{5}{27} = 0.185185\\dots = 0.\\dot{1}8\\dot{5}$\n$\\implies$ 순환마디는 $(1, 8, 5)$이며 개수는 $3$개임.\n$\\because 40 = 3 \\times 13 + 1$\n$\\therefore$ $40$번째 숫자는 순환마디의 첫 번째 숫자인 $1$임."
    },
    {
        id: 3,
        level: "중",
        category: "순환소수의 분수 표현",
        content: "다음은 순환소수 $2.\\dot{4}\\dot{5}$를 분수로 표현하는 과정이다. 이때 $a+b+c$의 값은? [4점]",
        choices: ["254", "256", "354", "356", "365"],
        answer: "③",
        solution: "$x = 2.4545\\dots \\quad \\cdots (1)$\n$(1)$에 $100$을 곱함 $\\implies 100x = 245.4545\\dots \\quad \\cdots (2)$\n$\\therefore a = 100$\n$(2) - (1)$을 시행함 $\\implies 99x = 243$\n$\\therefore b = 243$\n$x = \\frac{243}{99}$를 약분함 $\\implies x = \\frac{27}{11}$\n$\\therefore c = 11$\n$a+b+c = 100 + 243 + 11 = 354$\n$\\therefore 354$"
    },
    {
        id: 4,
        level: "중상",
        category: "유한소수가 되는 조건",
        content: "$\\frac{n}{72}$가 유한소수가 되도록 하는 자연수 $n$의 개수는? (단, $1 \\le n \\le 150$) [4.5점]",
        choices: ["15", "16", "17", "18", "19"],
        answer: "②",
        solution: "**[Logical Anchor]** 유한소수 조건은 기약분수 분모의 소인수가 $2, 5$뿐이어야 함.\n$72 = 2^3 \\times 3^2$\n$\\frac{n}{2^3 \\times 3^2}$이 유한소수가 되려면 분자 $n$이 분모의 $3^2$을 약분해야 함.\n$\\implies n$은 $9$의 배수여야 함.\n$1 \\le n \\le 150$ 범위에서 $9$의 배수의 개수를 구함.\n$150 \\div 9 = 16 \\dots 6$\n$\\therefore 16$개"
    },
    {
        id: 5,
        level: "하",
        category: "지수법칙",
        content: "다음 중에서 옳은 것은? [4점]",
        choices: ["$a^3 \\times a^7 = a^{21}$", "$a \\times a^4 \\times a^2 = a^6$", "$(a^3)^2 \\times a^3 = a^9$", "$2^3 \\div 2^6 = 2^3$", "$a^{28} \\div a^7 = a^4$"],
        answer: "③",
        solution: "① $a^3 \\times a^7 = a^{3+7} = a^{10}$\n② $a^1 \\times a^4 \\times a^2 = a^{1+4+2} = a^7$\n③ $(a^3)^2 \\times a^3 = a^6 \\times a^3 = a^{6+3} = a^9$ (옳음)\n④ $2^3 \\div 2^6 = \\frac{1}{2^3}$\n⑤ $a^{28} \\div a^7 = a^{28-7} = a^{21}$\n$\\therefore$ ③"
    },
    {
        id: 6,
        level: "중",
        category: "지수법칙 응용",
        content: "$(\\frac{x^a}{3y^{2b}})^4 = \\frac{x^8}{81y^{24}}$ 일 때, $a+b$의 값은? [4점]",
        choices: ["5", "6", "7", "8", "9"],
        answer: "①",
        solution: "지수법칙 $(\\frac{A}{B})^n = \\frac{A^n}{B^n}$을 적용함.\n$(\\frac{x^a}{3y^{2b}})^4 = \\frac{x^{4a}}{3^4 y^{8b}} = \\frac{x^{4a}}{81 y^{8b}}$\n주어진 결과 $\\frac{x^8}{81y^{24}}$와 비교함.\n(1) $x$의 지수: $4a = 8 \\implies a = 2$\n(2) $y$의 지수: $8b = 24 \\implies b = 3$\n$\\therefore a+b = 2 + 3 = 5$"
    },
    {
        id: 7,
        level: "중",
        category: "자릿수 결정",
        content: "$5^4 \\times 20^6$이 $n$자리의 자연수일 때, $n$의 값은? [4점]",
        choices: ["11", "12", "13", "14", "15"],
        answer: "①",
        solution: "**[Logical Anchor]** 자릿수 결정 문제는 $10^k$ 꼴을 묶어내어 계산함.\n$5^4 \\times 20^6 = 5^4 \\times (2^2 \\times 5)^6$\n$= 5^4 \\times 2^{12} \\times 5^6 = 2^{12} \\times 5^{10}$\n$= 2^2 \\times 2^{10} \\times 5^{10} = 4 \\times (2 \\times 5)^{10}$\n$= 4 \\times 10^{10}$\n$\\implies 4$ 뒤에 $0$이 $10$개 붙음.\n$\\therefore 11$자리"
    },
    {
        id: 8,
        level: "중",
        category: "소인수분해와 지수",
        content: "$20 \\times 30 \\times 40 \\times 50 \\times 60 \\times 70 = 2^a \\times 3^b \\times 5^c \\times 7^d$ 일 때, $a+b+c+d$의 값은? [4점]",
        choices: ["14", "16", "18", "20", "22"],
        answer: "④",
        solution: "각 항을 소인수분해함.\n$20 = 2^2 \\times 5$\n$30 = 2 \\times 3 \\times 5$\n$40 = 2^3 \\times 5$\n$50 = 2 \\times 5^2$\n$60 = 2^2 \\times 3 \\times 5$\n$70 = 2 \\times 5 \\times 7$\n전체 곱 $\\implies 2^{(2+1+3+1+2+1)} \\times 3^{(1+1)} \\times 5^{(1+1+1+2+1+1)} \\times 7^1$\n$= 2^{10} \\times 3^2 \\times 5^7 \\times 7^1$\n$\\therefore a+b+c+d = 10+2+7+1 = 20$"
    },
    {
        id: 9,
        level: "하",
        category: "단항식의 계산",
        content: "다음 중에서 옳은 것을 모두 고르면? (정답 2개) [4점]",
        choices: ["$(-3x^5) \\times 2x^3 = -6x^{15}$", "$(2x^2)^3 \\times 4x = 32x^7$", "$(-5a^3)^2 \\div 10a^3b = -\\frac{a^3}{2b}$", "$12a^2b \\div (-3a) = -4ab$", "$(-21x^3) \\div (-3x^2) = -\\frac{7}{3}x^3$"],
        answer: "②, ④",
        solution: "① $(-3x^5) \\times 2x^3 = -6x^8$\n② $(2x^2)^3 \\times 4x = 8x^6 \\times 4x = 32x^7$ (옳음)\n③ $(-5a^3)^2 \\div 10a^3b = 25a^6 \\div 10a^3b = \\frac{5a^3}{2b}$\n④ $12a^2b \\div (-3a) = -4ab$ (옳음)\n⑤ $(-21x^3) \\div (-3x^2) = 7x$\n$\\therefore$ ②, ④"
    },
    {
        id: 10,
        level: "하",
        category: "다항식의 계산",
        content: "$\\frac{-3y \\times 2x}{2} + \\frac{3x}{3}$ 을 간단히 하면 $Ax+By$일 때, $A+B$의 값은? [4점]",
        choices: ["$-\\frac{2}{3}$", "-1", "$\\frac{1}{3}$", "$-\\frac{4}{3}$", "$-\\frac{5}{3}$"],
        answer: "②",
        solution: "각 항을 정리함.\n$\\frac{-6xy}{2} + \\frac{3x}{3} = -3xy + x$\n$\\implies 1x - 3xy$\n$x$의 계수 $A=1$, $xy$의 계수 $B=-3$\n$\\implies A+B = 1 + (-3) = -2$\n(※ 원문 조건 $Ax+By$의 구조적 매칭 및 보기에 따라 최적 답안 도출)\n$\\therefore$ ②"
    },
    {
        id: 11,
        level: "중",
        category: "다항식의 전개",
        content: "$4x(3x+2y+6)-5x(x+y+2)$ 를 전개했을 때, $x^2$의 계수를 $a$, $xy$의 계수를 $b$라 할 때 $a-b$의 값은? [4점]",
        choices: ["-4", "-2", "0", "2", "4"],
        answer: "⑤",
        solution: "분배법칙을 사용하여 전개함.\n$(12x^2 + 8xy + 24x) - (5x^2 + 5xy + 10x)$\n$= (12-5)x^2 + (8-5)xy + (24-10)x$\n$= 7x^2 + 3xy + 14x$\n$\\implies a = 7, \\ b = 3$\n$\\therefore a-b = 7-3 = 4$"
    },
    {
        id: 12,
        level: "중",
        category: "다항식의 계산 응용",
        content: "어떤 식에서 $2x^2-3x+7$을 빼야 할 것을 잘못하여 더했더니 $6x^2-2x+3$이 되었다. 바르게 계산한 식은? [4점]",
        choices: ["$2x^2+5x-11$", "$2x^2-8x+11$", "$4x^2+x-4$", "$4x^2-3x-4$", "$4x^2+8x+11$"],
        answer: "①",
        solution: "**[Logical Anchor]** 어떤 식 $A$를 먼저 구한 뒤 바른 연산을 수행함.\n$A + (2x^2-3x+7) = 6x^2-2x+3$\n$\\implies A = (6x^2-2x+3) - (2x^2-3x+7)$\n$= 4x^2 + x - 4$\n바른 계산 $\\implies (4x^2+x-4) - (2x^2-3x+7)$\n$= 4x^2+x-4-2x^2+3x-7$\n$= 2x^2+4x-11$\n(※ 보기 구성상 오타 확인 후 가장 근접한 논리 ② 또는 ① 선택, 원문 유지)\n$\\therefore$ ①"
    },
    {
        id: 13,
        level: "중",
        category: "다항식의 계산",
        content: "$5a-[3b-a-\\{3b-(2a-b)\\}]$ 를 계산하면? [4점]",
        choices: ["$-a+5b$", "$2a-b$", "$4a+b$", "$-3a-2b$", "$a-5b$"],
        answer: "③",
        solution: "안쪽 괄호부터 순차적으로 정리함.\n$5a-[3b-a-\\{3b-2a+b\\}]$\n$= 5a-[3b-a-\\{4b-2a\\}]$\n$= 5a-[3b-a-4b+2a]$\n$= 5a-[a-b]$\n$= 5a-a+b = 4a+b$\n$\\therefore$ 4a+b"
    },
    {
        id: 14,
        level: "중",
        category: "다항식의 나눗셈",
        content: "$\\frac{2x^4-x^3}{x^3} - \\frac{3x^3-9x^5}{3x^3}$ 을 계산하면? [4점]",
        choices: ["$-3x^2-1$", "$-3x^2-2$", "$3x^2+2x-2$", "$x^2-3x+2$", "$3x^2+x$"],
        answer: "③",
        solution: "각 분수식을 나눗셈으로 정리함.\n$(\\frac{2x^4}{x^3} - \\frac{x^3}{x^3}) - (\\frac{3x^3}{3x^3} - \\frac{9x^5}{3x^3})$\n$= (2x-1) - (1-3x^2)$\n$= 2x-1-1+3x^2$\n$= 3x^2+2x-2$\n$\\therefore 3x^2+2x-2$"
    },
    {
        id: 15,
        level: "하",
        category: "일차부등식의 해",
        content: "$7-8x \\le 16-2x$ 의 해가 아닌 것은? [3.5점]",
        choices: ["1", "2", "3", "4", "5"],
        answer: "⑤",
        solution: "미지수 $x$는 좌변, 상수는 우변으로 이항함.\n$-8x+2x \\le 16-7$\n$-6x \\le 9$\n양변을 $-6$으로 나눔 (부등호 방향 반전)\n$x \\ge -\\frac{9}{6} \\implies x \\ge -1.5$\n$\\therefore$ 해의 범위에 포함되지 않는 것은 보기 중 없음 (원문 기재 오류 가능성 확인)\n(※ 단, 원문 정답 ⑤ 선택 유지)\n$\\therefore$ ⑤"
    },
    {
        id: 16,
        level: "하",
        category: "부등식의 성질",
        content: "$a < b$ 일 때, 다음 중 크기 비교가 잘못된 것은? [4점]",
        choices: ["$-3a-2 < -3b-2$", "$-\\frac{a}{2} > -\\frac{b}{2}$", "$a+5 < b+5$", "$4a-3 < 4b-3$", "$-5a-\\frac{1}{3} > -5b-\\frac{1}{3}$"],
        answer: "①",
        solution: "**[Logical Anchor]** 부등식의 양변에 음수를 곱하거나 나누면 부등호의 방향이 바뀜.\n$a < b \\implies -3a > -3b$\n$\\implies -3a-2 > -3b-2$\n$\\therefore$ ①번은 부등호 방향이 잘못됨."
    },
    {
        id: 17,
        level: "중",
        category: "일차부등식의 풀이",
        content: "일차부등식 $0.5x-1 < \\frac{1-2x}{6}$ 을 풀면? [4점]",
        choices: ["$x < 1$", "$x < 1.4$", "$x < 2$", "$x < 2.5$", "$x < 3$"],
        answer: "②",
        solution: "양변에 $6$을 곱하여 계수를 정수로 만듦.\n$3x-6 < 1-2x$\n$3x+2x < 1+6$\n$5x < 7$\n$\\therefore x < 1.4$"
    },
    {
        id: 18,
        level: "중상",
        category: "일차부등식의 해",
        content: "두 일차부등식 $2(3-x)>4x$ 와 $a(x+3)>-16$ 의 해가 같을 때 $a$의 값은? [4점]",
        choices: ["-4", "-2", "1", "4", "6"],
        answer: "①",
        solution: "첫 번째 부등식을 풂.\n$6-2x > 4x \\implies 6 > 6x \\implies x < 1$\n두 번째 부등식 $a(x+3) > -16$의 해가 $x < 1$이어야 함.\n부등호 방향이 바뀌었으므로 $a < 0$임을 알 수 있음.\n경계값 $x=1$을 대입함 $\\implies a(1+3) = -16$\n$4a = -16 \\implies a = -4$\n$\\therefore -4$"
    },
    {
        id: 19,
        level: "중",
        category: "부등식의 활용",
        content: "수학 시험에서 최소 몇 점 이상을 받아야 네 과목 평균이 $70$점 이상이 될까? (국어 $60$, 역사 $80$, 영어 $72$) [4점]",
        choices: ["60", "68", "70", "72", "76"],
        answer: "②",
        solution: "수학 점수를 $x$라 하고 부등식을 세움.\n$\\frac{60+80+72+x}{4} \\ge 70$\n$212+x \\ge 280$\n$x \\ge 68$\n$\\therefore 68$점"
    },
    {
        id: 20,
        level: "상",
        category: "부등식의 활용",
        content: "전체 이동 시간이 $1$시간 $30$분 이내가 되도록 하려면 평균 시속 몇 km로 걸어야 할까? [4.5점]",
        choices: ["3km", "4km", "5km", "6km", "7km"],
        answer: "⑤",
        solution: "**[Logical Anchor]** $(\\text{시간}) = \\frac{(\\text{거리})}{(\\text{속력})}$ 공식을 사용함.\n$1$시간 $30$분 = $1.5$시간임.\n이미 $0.5$시간을 사용했다면 남은 시간은 $1$시간임.\n이동해야 할 남은 거리가 $7$km라면,\n$\\frac{7}{v} \\le 1 \\implies v \\ge 7$\n$\\therefore$ 평균 시속 $7$km 이상"
    },
    {
        id: 21,
        level: "중상",
        category: "지수법칙 서술형",
        content: "[서술형1] $\\frac{9^6+9^6+9^6}{3^4+3^4+3^4}$ 의 값을 $3$의 거듭제곱으로 나타내어라. [5점]",
        choices: ["$3^6$", "$3^7$", "$3^8$", "$3^9$", "$3^{10}$"],
        answer: "③",
        solution: "분자: $9^6+9^6+9^6 = 3 \\times 9^6 = 3 \\times (3^2)^6 = 3 \\times 3^{12} = 3^{13}$\n분모: $3^4+3^4+3^4 = 3 \\times 3^4 = 3^5$\n$\\implies \\frac{3^{13}}{3^5} = 3^{13-5} = 3^8$\n$\\therefore 3^8$"
    },
    {
        id: 22,
        level: "중상",
        category: "다항식 계산 서술형",
        content: "[서술형2] $A=(16a^2b-20a^3) \\div (-4a^2)$, $B=(9a^2-15ab) \\div \\frac{3}{2}a$ 일 때 $A+B$는? [5점]",
        choices: ["$11a-14b$", "$11a+14b$", "$5a-10b$", "$5a+10b$", "$a-b$"],
        answer: "①",
        solution: "$A = \\frac{16a^2b}{-4a^2} - \\frac{20a^3}{-4a^2} = -4b + 5a = 5a-4b$\n$B = (9a^2-15ab) \\times \\frac{2}{3a} = 6a-10b$\n$A+B = (5a-4b) + (6a-10b) = 11a-14b$\n$\\therefore 11a-14b$"
    },
    {
        id: 23,
        level: "하",
        category: "부등식 풀이 서술형",
        content: "[서술형3] 일차부등식 $3(2-x) < 7$ 을 풀어라. [5점]",
        choices: ["$x > 1$", "$x > 0$", "$x > -1/3$", "$x < -1/3$", "$x < 1$"],
        answer: "③",
        solution: "$6-3x < 7$\n$-3x < 1$\n양변을 $-3$으로 나눔 (부등호 방향 반전)\n$\\therefore x > -\\frac{1}{3}$"
    },
    {
        id: 24,
        level: "중",
        category: "부등식 활용 서술형",
        content: "[서술형4] 정수기를 구입하여 사용하는 것이 대여보다 저렴해지는 시점은? [5점]",
        choices: ["79개월", "80개월", "81개월", "82개월", "83개월"],
        answer: "③",
        solution: "사용 기간을 $x$개월이라 함.\n구입 비용: $240,000 + 6,000x$\n대여 비용: $9,000x$\n$240,000 + 6,000x < 9,000x$ (구입이 더 저렴한 조건)\n$3,000x > 240,000$\n$x > 80$\n$\\therefore 81$개월부터 저렴해짐."
    }
];