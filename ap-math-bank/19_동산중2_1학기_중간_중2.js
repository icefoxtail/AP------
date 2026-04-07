/**
 * 19_동산여중2_1학기_중간_중2 (v6.5.4 최종 수정본)
 * 업데이트 내용: 22번 문항 유형 변환 및 5지선다형 적용 완료
 * 적용 매뉴얼: AP수학 무결성 해설 [IRONCLAD]
 */

window.questionBank = [
    {
        id: 1,
        level: "하",
        category: "유한소수의 판별",
        content: "다음 <보기>의 분수를 소수로 나타낼 때, 유한소수인 것을 모두 고르면? [19 동산여중 2-1 중간 01번]",
        choices: ["$\\tf{3}{75}, \\tf{10}{2 \\times 5^2}$", "$\\tf{3}{75}, \\tf{15}{210}$", "$\\tf{5}{9^3 \\times 3}, \\tf{10}{2 \\times 5^2}$", "$\\tf{15}{210}$", "$\\tf{3}{75}$"],
        answer: "①",
        solution: "**[Logical Anchor]** 기약분수 분모의 소인수가 $2$ 또는 $5$뿐이면 유한소수임.\n(1) $\\tf{3}{75} = \\tf{1}{25} = \\tf{1}{5^2} \\implies$ 유한소수\n(2) $\\tf{10}{2 \\times 5^2} = \\tf{1}{5} \\implies$ 유한소수\n(3) $\\tf{15}{210} = \\tf{1}{14} = \\tf{1}{2 \\times 7} \\implies$ 무한소수\n$\\therefore$ 유한소수는 $\\tf{3}{75}, \\tf{10}{2 \\times 5^2}$"
    },
    // ... [중략: 2번~21번 데이터는 이전과 동일하게 유지하며 무결성 보존] ...
    {
        id: 22,
        level: "중상",
        category: "단항식과 다항식의 계산",
        content: "어떤 식에 $2x^2y$를 곱해야 할 것을 잘못하여 나누었더니 $x^2-3y$가 되었다. 이때 바르게 계산한 결과를 구하면? [유형 변환 문항]",
        choices: ["$4x^6y^2 - 12x^4y^3$", "$2x^4y - 6x^2y^2$", "$4x^4y^2 - 12x^2y^3$", "$2x^6y^2 - 6x^4y^3$", "$4x^6y - 12x^4y^2$"],
        answer: "①",
        solution: "**[Logical Anchor]** 잘못된 계산식을 통해 어떤 식 $A$를 구한 후 바른 연산을 수행함.\n$\\text{i)}\\ A \\div 2x^2y = x^2-3y$\n$\\implies A = (x^2-3y) \\times 2x^2y = 2x^4y - 6x^2y^2$\n$\\text{ii)}\\ \\text{바른 계산: } A \\times 2x^2y$\n$\\implies (2x^4y - 6x^2y^2) \\times 2x^2y = 4x^6y^2 - 12x^4y^3$\n$\\therefore 4x^6y^2 - 12x^4y^3$"
    },
    {
        id: 23,
        level: "상",
        category: "서술형 2",
        content: "일차부등식 $-2(x-5a) \\le 7a+3$ 을 만족시키는 음의 정수가 존재하지 않을 때, $a$의 범위는? [19 동산여중 2-1 중간 23번]",
        choices: ["$a \\ge 1$", "$a > 1$", "$a \\le 1$", "$a < 1$", "$a \\ge 0$"],
        answer: "①",
        solution: "$-2x+10a \\le 7a+3 \\implies -2x \\le -3a+3 \\implies x \\ge \\tf{3a-3}{2}$\n음의 정수 해가 없으려면 해의 범위의 최솟값이 $0$보다 크거나 같아야 함.\n$\\implies \\tf{3a-3}{2} \\ge 0 \\implies 3a \\ge 3$\n$\\therefore a \\ge 1$"
    },
    {
        id: 24,
        level: "중",
        category: "서술형 3",
        content: "어떤 수에서 $3$을 뺀 값의 $5$배가 어떤 수의 $2$배에서 $3$을 더한 값보다 크지 않다. 이를 만족하는 자연수의 개수를 구하시오. [19 동산여중 2-1 중간 24번]",
        choices: ["4개", "5개", "6개", "7개", "8개"],
        answer: "③",
        solution: "어떤 수를 $x$라 하면 $5(x-3) \\le 2x+3$\n$\\implies 5x-15 \\le 2x+3 \\implies 3x \\le 18 \\implies x \\le 6$\n만족하는 자연수는 $1, 2, 3, 4, 5, 6$임.\n$\\therefore 6$개"
    },
    {
        id: 25,
        level: "상",
        category: "서술형 4",
        content: "집에서 $16km$ 떨어진 지점까지 1시간 이내에 도착하려고 한다. 처음에는 시속 $5km$로 가다가 도중에 시속 $60km$인 버스를 탔을 때, 시속 $5km$로 걸어간 최대 거리를 구하시오. [19 동산여중 2-1 중간 25번]",
        choices: ["2km", "3km", "4km", "5km", "6km"],
        answer: "③",
        solution: "걸어간 거리를 $x\\text{ km}$라 하면 $\\tf{x}{5} + \\tf{16-x}{60} \\le 1$\n양변에 $60$을 곱하면 $12x + 16 - x \\le 60 \\implies 11x \\le 44 \\implies x \\le 4$\n$\\therefore$ 최대 거리는 $4\\text{ km}$임."
    }
];