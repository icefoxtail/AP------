/**
 * 20_풍덕중2_1학기_중간_중2 (v6.5.4 마스터 엔진 병합본)
 * 문항 수: 24문항
 * 적용 매뉴얼: AP수학 무결성 해설 & 엔진 가동 매뉴얼 v1.3 [IRONCLAD]
 * 해설 스타일: Logic-First (수식 주도형 전개, Logical Anchor 적용)
 */

// 파일명: 20_풍덕중2_1학기_중간_중2.js
window.examTitle = "20_풍덕중2_1학기_중간_중2";

window.questionBank = [
    {
        id: 1,
        level: "하",
        category: "순환소수의 표현",
        content: "다음 중에서 순환소수의 표현으로 옳지 않은 것은? [4점]",
        choices: ["$4.545454\\dots = 4.\\dot{5}\\dot{4}$", "$0.232323\\dots = 0.\\dot{2}\\dot{3}$", "$0.333\\dots = 0.\\dot{3}$", "$0.0272727\\dots = 0.0\\dot{2}\\dot{7}$", "$2.374374374\\dots = 2.37\\dot{4}$"],
        answer: "⑤",
        solution: "**[Logical Anchor]** 순환마디는 소수점 아래 처음으로 반복되는 부분이며 양 끝 숫자 위에 점을 찍음.\n⑤ $2.374374374\\dots$의 순환마디는 $3, 7, 4$임.\n$\\therefore$ $2.\\dot{3}7\\dot{4}$로 표기해야 옳음."
    },
    {
        id: 2,
        level: "하",
        category: "유한소수 판별",
        content: "다음 <보기> 중 유한소수로 나타낼 수 있는 것을 모두 고른 것은? [4점]<br><div style='border:1px solid #000; padding:5px;'>ㄱ. $\\tf{1}{2^3 \\times 5}$ &nbsp; ㄴ. $\\tf{33}{2 \\times 3 \\times 5^2}$ <br> ㄷ. $\\tf{1}{2 \\times 7}$ &nbsp; ㄹ. $\\tf{21}{140}$</div>",
        choices: ["ㄱ, ㄴ", "ㄱ, ㄹ", "ㄴ, ㄹ", "ㄱ, ㄴ, ㄹ", "ㄱ, ㄴ, ㄷ, ㄹ"],
        answer: "④",
        solution: "ㄱ. 분모 소인수가 $2, 5$뿐임 (유한)\nㄴ. $\\tf{33}{2 \\times 3 \\times 5^2} = \\tf{11}{2 \\times 5^2}$ (유한)\nㄷ. 분모에 소인수 $7$ 존재 (무한)\nㄹ. $\\tf{21}{140} = \\tf{3}{20} = \\tf{3}{2^2 \\times 5}$ (유한)\n$\\therefore$ ㄱ, ㄴ, ㄹ"
    },
    {
        id: 3,
        level: "중",
        category: "순환소수가 되는 조건",
        content: "분수 $\\tf{7}{5^2 \\times x}$를 순환소수로만 나타낼 수 있을 때, $10$ 이하의 자연수 $x$가 될 수 있는 모든 수들의 합을 구하면? [4점]",
        choices: ["17", "18", "19", "20", "21"],
        answer: "②",
        solution: "**[Logical Anchor]** 순환소수가 되려면 기약분수 분모에 $2, 5$ 이외의 소인수가 있어야 함.\n$x \\in \\{1, 2, \\dots, 10\\}$ 중 후보: $3, 6, 7, 9$\n- $x=3$: 분모 소인수 $3$ (순환)\n- $x=6$: 분모 소인수 $2 \\times 3$ (순환)\n- $x=7$: 분자의 $7$과 약분됨 (유한)\n- $x=9$: 분모 소인수 $3^2$ (순환)\n$\\therefore 3+6+9 = 18$"
    },
    {
        id: 4,
        level: "하",
        category: "순환소수의 분수 표현",
        content: "순환소수 $x=0.2\\dot{2}\\dot{7}$을 $10$의 거듭제곱을 이용하여 분수로 나타내려고 할 때, 가장 편리한 식은? [4점]",
        choices: ["$100x - x$", "$100x - 10x$", "$1000x - x$", "$1000x - 10x$", "$1000x - 100x$"],
        answer: "④",
        solution: "$x = 0.2272727\\dots$\n$1000x = 227.2727\\dots \\cdots (1)$\n$10x = 2.2727\\dots \\cdots (2)$\n소수점 아래 부분을 일치시켜 소거하기 위해 $(1)-(2)$를 시행함.\n$\\therefore 1000x - 10x$"
    },
    {
        id: 5,
        level: "중",
        category: "유리수와 소수 관계",
        content: "다음 중 옳은 것을 모두 고르면? (정답 2개) [4점]",
        choices: ["모든 순환소수는 유리수이다.", "유한소수와 무한소수는 유리수이다.", "분수로 나타낼 수 없는 순환소수도 있다.", "모든 기약분수는 유한소수로 나타낼 수 있다.", "정수가 아닌 유리수는 유한소수 또는 순환소수로 나타낼 수 있다."],
        answer: "①, ⑤",
        solution: "① 모든 순환소수는 분수 $\\tf{b}{a}$ 꼴로 나타낼 수 있음 (참)\n② 무한소수 중 비순환 무한소수(원주율 등)는 유리수가 아님\n④ $\\tf{1}{3}$ 등은 순환소수임\n⑤ 유리수는 유한소수 또는 순환소수로 분류됨 (참)\n$\\therefore$ ①, ⑤"
    },
    {
        id: 6,
        level: "중",
        category: "지수법칙",
        content: "다음 <보기> 중 식을 간단히 한 결과가 옳은 것은 모두 몇 개인가? [4점]<br><div style='border:1px solid #000; padding:5px;'>ㄱ. $a^3 \\times a = a^4$ <br> ㄴ. $(a^3)^2 = a^6$ <br> ㄷ. $a^3 \\div a^5 = a^2$ <br> ㄹ. $(-\\tf{a^2}{b^3})^2 = \\tf{a^4}{b^6}$ <br> ㅁ. $(a^4)^2 \\times (b^2)^3 = a^{14}$</div>",
        choices: ["1개", "2개", "3개", "4개", "5개"],
        answer: "③",
        solution: "ㄱ. $a^{3+1} = a^4$ (참)\nㄴ. $a^{3 \\times 2} = a^6$ (참)\nㄷ. $a^3 \\div a^5 = \\tf{1}{a^2}$ (거짓)\nㄹ. $(-1)^2 \\tf{a^{2 \\times 2}}{b^{3 \\times 2}} = \\tf{a^4}{b^6}$ (참)\nㅁ. $a^8 \\times b^6$ (거짓)\n$\\therefore$ ㄱ, ㄴ, ㄹ로 총 3개임."
    },
    {
        id: 7,
        level: "중",
        category: "지수법칙 응용",
        content: "$3^3 = A$라고 할 때, $\\tf{1}{81^3}$을 $A$를 사용하여 나타내면? [4점]",
        choices: ["$\\tf{1}{A^3}$", "$A^3$", "$\\tf{1}{A^4}$", "$A^4$", "$\\tf{1}{A^5}$"],
        answer: "③",
        solution: "$81^3 = (3^4)^3 = 3^{12}$\n$\\because A = 3^3$ 이므로 $3^{12} = (3^3)^4 = A^4$\n$\\therefore \\tf{1}{81^3} = \\tf{1}{A^4}$"
    },
    {
        id: 8,
        level: "중",
        category: "지수법칙 미지수 구하기",
        content: "다음 조건을 모두 만족시키는 세 자연수에 대해 $a+b+c$의 값을 구하면? [4점]<br>(1) $(\\tf{2}{3^a})^5 = \\tf{2^5}{3^{20}}$ <br>(2) $(\\tf{7^a}{5^2})^4 = \\tf{7^c}{5^b}$",
        choices: ["22", "24", "26", "28", "30"],
        answer: "④",
        solution: "(1) $\\tf{2^5}{3^{5a}} = \\tf{2^5}{3^{20}} \\implies 5a = 20 \\implies a = 4$\n(2) $(\\tf{7^4}{5^2})^4 = \\tf{7^{16}}{5^8} = \\tf{7^c}{5^b}$\n$\\implies c = 16, \\ b = 8$\n$\\therefore a+b+c = 4+8+16 = 28$"
    },
    {
        id: 9,
        level: "하",
        category: "단항식의 계산",
        content: "다음 중 계산 결과가 옳지 않은 것은? [4점]",
        choices: ["$4x^2 \\times (-5x^3) = 20x^5$", "$3x^3 \\times (-xy^2) = -3x^4y^2$", "$(3x^2)^2 \\div (-27x^{11}) = -\\tf{1}{3x^7}$", "$12x^4 \\div \\tf{4}{3}x^3 = 9x$", "$9x^2 \\times 4x^3 \\div 6x^4 = 6x$"],
        answer: "①",
        solution: "① $4x^2 \\times (-5x^3) = -20x^5$\n$\\therefore$ 양수 결과로 표기된 ①번이 옳지 않음."
    },
    {
        id: 10,
        level: "중",
        category: "단항식의 계산 활용",
        content: "삼각형의 넓이가 $50x^2y^8$이고 밑변의 길이가 $20x^3y$일 때, 이 삼각형의 높이를 구하면? [4점]",
        choices: ["$4x^3y^8$", "$4x^4y^8$", "$5x^2y^2$", "$5x^3y^8$", "$\\tf{5y^7}{x}$"],
        answer: "⑤",
        solution: "**[Logical Anchor]** $(\\text{넓이}) = \\tf{1}{2} \\times (\\text{밑변}) \\times (\\text{높이})$\n$50x^2y^8 = \\tf{1}{2} \\times 20x^3y \\times h$\n$50x^2y^8 = 10x^3y \\times h$\n$h = \\tf{50x^2y^8}{10x^3y} = \\tf{5y^7}{x}$\n$\\therefore \\tf{5y^7}{x}$"
    },
    {
        id: 11,
        level: "하",
        category: "이등변삼각형의 성질",
        content: "$\\overline{AB} = \\overline{AC}$인 이등변삼각형 ABC에서 $\\angle C$의 외각의 크기가 $130^\\circ$일 때, $\\angle A$의 크기는? [4점]",
        choices: ["$60^\\circ$", "$50^\\circ$", "$65^\\circ$", "$70^\\circ$", "$80^\\circ$"],
        answer: "⑤",
        solution: "$\\angle C = 180^\\circ - 130^\\circ = 50^\\circ$\n$\\because$ $\\triangle ABC$는 $\\overline{AB} = \\overline{AC}$인 이등변삼각형이므로 $\\angle B = \\angle C = 50^\\circ$\n$\\angle A = 180^\\circ - (50^\\circ + 50^\\circ) = 80^\\circ$\n$\\therefore 80^\\circ$"
    },
    {
        id: 12,
        level: "중",
        category: "이등변삼각형의 성질",
        content: "$\\overline{AB} = \\overline{AC}$인 이등변삼각형에서 $\\angle B$의 이등분선과 $\\overline{AC}$의 교점을 D라 하자. $\\angle A = 36^\\circ$일 때 다음 중 옳지 않은 것은? [4점]",
        choices: ["$\\angle ABD = 36^\\circ$", "$\\angle BDC = 72^\\circ$", "$\\angle ADB = 112^\\circ$", "$\\overline{AD} = \\overline{BD}$", "$\\overline{BD} = \\overline{BC}$"],
        answer: "③",
        solution: "$\\angle B = \\angle C = \\tf{180-36}{2} = 72^\\circ$\n$\\angle ABD = \\angle DBC = 72 \\div 2 = 36^\\circ$\n$\\triangle ABD$에서 $\\angle A = \\angle ABD = 36^\\circ \\implies \\overline{AD} = \\overline{BD}$\n$\\triangle BCD$에서 $\\angle BDC = 180 - (36+72) = 72^\\circ \\implies \\overline{BD} = \\overline{BC}$\n$\\angle ADB = 180 - 72 = 108^\\circ$\n$\\therefore$ ③"
    },
    {
        id: 13,
        level: "하",
        category: "피타고라스 정리",
        content: "직각삼각형 ABC에서 직각을 낀 두 변의 길이가 각각 $6, 8$일 때, 빗변 $x$의 길이는? [4점]",
        choices: ["8", "10", "12", "14", "16"],
        answer: "②",
        solution: "**[Logical Anchor]** $a^2 + b^2 = c^2$\n$x^2 = 6^2 + 8^2 = 36 + 64 = 100$\n$\\because x > 0$\n$\\therefore x = 10$"
    },
    {
        id: 14,
        level: "중",
        category: "피타고라스 정리 활용",
        content: "직각삼각형 ABC의 세 변을 한 변으로 하는 세 정사각형 AFGB, IBHC, ACDE를 그렸다. AFGB의 넓이가 $46\\text{cm}^2$, IBHC의 넓이가 $25\\text{cm}^2$일 때, ACDE의 넓이는? [4점]",
        choices: ["$14\\text{cm}^2$", "$16\\text{cm}^2$", "$18\\text{cm}^2$", "$21\\text{cm}^2$", "$23\\text{cm}^2$"],
        answer: "④",
        solution: "빗변을 $AB$라 하면, $AB^2 = AC^2 + BC^2$\n$\\implies (\\text{정사각형 } AFGB) = (\\text{정사각형 } ACDE) + (\\text{정사각형 } IBHC)$\n$46 = ACDE + 25 \\implies ACDE = 21$\n$\\therefore 21\\text{cm}^2$"
    },
    {
        id: 15,
        level: "하",
        category: "삼각형의 분류",
        content: "삼각형의 세 변의 길이가 다음과 같을 때, 예각삼각형인 것은? [4점]",
        choices: ["2, 2, 3", "2, 3, 4", "3, 4, 5", "4, 5, 6", "5, 12, 13"],
        answer: "④",
        solution: "**[Logical Anchor]** 가장 긴 변 $c$에 대하여 $c^2 < a^2 + b^2$ 이면 예각삼각형임.\n④ $6^2 = 36, \\ 4^2 + 5^2 = 16 + 25 = 41$\n$36 < 41 \\implies$ 예각삼각형\n$\\therefore$ ④"
    },
    {
        id: 16,
        level: "중",
        category: "삼각형의 내심",
        content: "점 I는 $\\triangle ABC$의 내심이고, $\\angle BIC = 110^\\circ$일 때, $\\angle A$의 크기는? [4점]",
        choices: ["$37^\\circ$", "$40^\\circ$", "$45^\\circ$", "$50^\\circ$", "$55^\\circ$"],
        answer: "②",
        solution: "**[Logical Anchor]** 내심의 각도 성질: $\\angle BIC = 90^\\circ + \\tf{1}{2}\\angle A$\n$110 = 90 + \\tf{1}{2}\\angle A$\n$20 = \\tf{1}{2}\\angle A$\n$\\therefore \\angle A = 40^\\circ$"
    },
    {
        id: 17,
        level: "중",
        category: "삼각형의 내심 활용",
        content: "점 I는 $\\triangle ABC$의 내심이다. $\\triangle ABC$의 둘레가 $22\\text{cm}$이고 $\\overline{AD}=4\\text{cm}, \\overline{DB}=5\\text{cm}$일 때, $\\overline{EC}$의 길이는? [4점]",
        choices: ["$2\\text{cm}$", "$2.5\\text{cm}$", "$3\\text{cm}$", "$3.5\\text{cm}$", "$4\\text{cm}$"],
        answer: "①",
        solution: "내심에서 각 변에 내린 접점까지의 거리는 같음.\n$\\overline{AF} = \\overline{AD} = 4, \\ \\overline{BE} = \\overline{DB} = 5, \\ \\overline{CE} = \\overline{CF} = x$\n둘레 $= 2(4 + 5 + x) = 22$\n$9 + x = 11 \\implies x = 2$\n$\\therefore 2\\text{cm}$"
    },
    {
        id: 18,
        level: "하",
        category: "삼각형의 외심",
        content: "점 O가 $\\triangle ABC$의 외심일 때, $\\angle OAB = 30^\\circ, \\angle OAC = 40^\\circ$이다. $\\angle OBC$의 크기는? [4점]",
        choices: ["$20^\\circ$", "$25^\\circ$", "$30^\\circ$", "$35^\\circ$", "$40^\\circ$"],
        answer: "①",
        solution: "**[Logical Anchor]** 외심 성질: $\\angle OAB + \\angle OBC + \\angle OCA = 90^\\circ$\n$30 + \\angle OBC + 40 = 90$\n$\\angle OBC = 90 - 70 = 20$\n$\\therefore 20^\\circ$"
    },
    {
        id: 19,
        level: "상",
        category: "일차부등식",
        content: "일차부등식 $x+1 \\le 3(x-3)$의 해가 일차부등식 $5x-a \\ge 4x+2$의 해와 같을 때, $a$의 값은? (수식 보정됨) [5점]",
        choices: ["3", "2", "1", "0", "-1"],
        answer: "①",
        solution: "**[Logical Anchor]** 두 부등식의 해가 동일함을 이용하여 경계값을 비교함.\n(1) $x+1 \\le 3x-9 \\implies 10 \\le 2x \\implies x \\ge 5$\n(2) $5x-a \\ge 4x+2 \\implies x \\ge a+2$\n두 해가 같으므로 $a+2 = 5$\n$\\therefore a = 3$"
    },
    {
        id: 20,
        level: "중",
        category: "삼각형의 성질",
        content: "삼각형의 성질에 대한 설명으로 옳은 것은? [4점]",
        choices: ["내심에서 세 꼭짓점에 이르는 거리는 같다.", "외심에서 세 변에 이르는 거리는 같다.", "정삼각형의 내심과 외심은 일치한다.", "이등변삼각형의 외심은 항상 삼각형 내부에 있다.", "직각삼각형의 내심은 빗변의 중점에 있다."],
        answer: "③",
        solution: "① 외심에 대한 설명임.\n② 내심에 대한 설명임.\n④ 둔각삼각형의 외심은 외부에 존재함.\n⑤ 직각삼각형의 외심이 빗변의 중점에 위치함.\n$\\therefore$ ③"
    },
    {
        id: 21,
        level: "중",
        category: "순환소수의 자릿수",
        content: "[서술형 1] 순환소수 $0.\\dot{1}5384\\dot{6}$에 대하여 (1) 순환마디를 구하고, (2) 소수점 아래 $100$번째 자리의 숫자를 구하시오. [5점]",
        choices: [" ", " ", " ", " ", " "],
        answer: "8",
        solution: "(1) 순환마디: $153846$\n(2) 순환마디의 길이는 $6$임.\n$100 = 6 \\times 16 + 4$\n$\\implies$ $100$번째 숫자는 순환마디의 $4$번째 숫자인 $8$임.\n$\\therefore 8$"
    },
    {
        id: 22,
        level: "중",
        category: "단항식의 계산",
        content: "[서술형 2] 단항식 $A$에 $2a^2b$를 나누어야 할 것을 잘못하여 곱하였더니 $16a^4b^3$이 되었다. 바르게 계산한 답을 구하시오. [6점]",
        choices: [" ", " ", " ", " ", " "],
        answer: "$4b$",
        solution: "$A \\times 2a^2b = 16a^4b^3$\n$A = \\tf{16a^4b^3}{2a^2b} = 8a^2b^2$\n바른 계산: $8a^2b^2 \\div 2a^2b = 4b$\n$\\therefore 4b$"
    },
    {
        id: 23,
        level: "중상",
        category: "삼각형의 내심과 외심",
        content: "[서술형 3] $\\angle C=90^\\circ$인 직각삼각형 ABC에서 외접원과 내접원의 반지름의 길이를 각각 구하시오. ($\\overline{AB}=20, \\overline{AC}=12, \\overline{BC}=16$) [5점]",
        choices: [" ", " ", " ", " ", " "],
        answer: "외:10, 내:4",
        solution: "**[Logical Anchor]** 직각삼각형의 외심은 빗변의 중점, 내심은 넓이 관계식을 이용함.\n(1) 외접원 반지름($R$): $R = \\tf{1}{2} \\times \\overline{AB} = \\tf{20}{2} = 10$\n(2) 내접원 반지름($r$): $(\\text{넓이}) = \\tf{1}{2} \\times 16 \\times 12 = 96$\n또한 $96 = \\tf{1}{2}r(20+12+16) = 24r$\n$r = \\tf{96}{24} = 4$\n$\\therefore$ 외: $10$, 내: $4$"
    },
    {
        id: 24,
        level: "하",
        category: "삼각형의 외심의 정의",
        content: "[서술형 4] 세 나무로부터 거리가 같은 보물이 묻힌 곳의 위치를 찾는 방법을 서술하시오. [4점]",
        choices: [" ", " ", " ", " ", " "],
        answer: "외심 찾기",
        solution: "세 나무를 꼭짓점으로 하는 삼각형의 **외심**을 찾으면 됨.\n$\\because$ 외심은 세 꼭짓점에 이르는 거리가 같음.\n방법: 삼각형의 세 변의 **수직이등분선의 교점**을 구함.\n$\\therefore$ 외심(수직이등분선의 교점)"
    }
];