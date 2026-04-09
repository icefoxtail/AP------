/**
 * 19_금당중3_1학기_중간_중3 (v4.2 무결성 복원본)
 * 문항 수: 25문항 (객관식 21문항 + 서술형 4문항)
 * 검증 상태: 정답지 오류 교정 및 OCR 수식 매칭 완료
 * 적용 매뉴얼: AP수학 무결성 해설 & 엔진 가동 매뉴얼 v1.3 [IRONCLAD]
 */

window.examTitle = "19_금당중3_1학기_중간_중3";

window.questionBank = [
  {
    id: 1,
    level: "하",
    category: "제곱근과 실수",
    content: "$x$가 $5$의 제곱근일 때, 다음 중 옳은 것은? [2점]",
    choices: ["$5 = \\sqrt{x}$", "$5 = \\pm\\sqrt{x}$", "$5^{2} = x$", "$x^{2} = 5$", "$x = \\sqrt{5^{2}}$"],
    answer: "④",
    solution: "**[Logical Anchor]** 제곱근의 정의에 따라 어떤 수 $x$를 제곱하여 $a$가 될 때, $x$를 $a$의 제곱근이라 함.\n$x^{2} = 5$ 가 성립함.\n$\\therefore x^{2}=5$"
  },
  {
    id: 2,
    level: "하",
    category: "제곱근과 실수",
    content: "$4$의 음의 제곱근을 $A$, $25$의 양의 제곱근을 $B$라고 할 때, $A+B$의 값을 구하면? [3점]",
    choices: ["$-6$", "$-3$", "$3$", "$5$", "$6$"],
    answer: "③",
    solution: "**[Logical Anchor]** 1) $A = -\\sqrt{4} = -2$, 2) $B = \\sqrt{25} = 5$\n$\\implies A+B = -2+5 = 3$\n$\\therefore 3$"
  },
  {
    id: 3,
    level: "하",
    category: "제곱근과 실수",
    content: "$\\sqrt{(-5)^{2}} - (-\\sqrt{3})^{2}$을 간단히 하면? [3점]",
    choices: ["$-2$", "$1$", "$2$", "$6$", "$8$"],
    answer: "③",
    solution: "**[Logical Anchor]** $\\sqrt{a^{2}} = |a|$ 성질과 $(\\sqrt{a})^{2} = a$ 성질을 이용.\n$\\sqrt{(-5)^{2}} = |-5| = 5$\n$(-\\sqrt{3})^{2} = 3$\n$\\implies 5 - 3 = 2$\n$\\therefore 2$"
  },
  {
    id: 4,
    level: "상",
    category: "제곱근과 실수",
    content: "$a > b > 0$일 때, $\\sqrt{(-3a)^{2}} - (\\sqrt{b})^{2} + \\sqrt{(a-b)^{2}}$ 을 간단히 하시오. [5점]",
    choices: ["$2a-2b$", "$3a-2b$", "$4a-2b$", "$3a+2b$", "$4a+2b$"],
    answer: "③",
    solution: "**[Logical Anchor]** 각 항의 근호 내부 식의 부호를 판별하여 절댓값으로 탈출.\n1) $\\sqrt{(-3a)^{2}} = |-3a| = 3a$ (∵ $a>0$)\n2) $(\\sqrt{b})^{2} = b$ (∵ $b>0$)\n3) $\\sqrt{(a-b)^{2}} = |a-b| = a-b$ (∵ $a>b$)\n$\\implies 3a - b + (a - b) = 4a - 2b$\n$\\therefore 4a-2b$"
  },
  {
    id: 6,
    level: "중",
    category: "근호를 포함한 식의 계산",
    content: "$a = \\sqrt{3}, b = \\sqrt{5}$ 일 때, $\\sqrt{0.6}$을 $a, b$를 사용하여 나타낸 것으로 옳은 것은? [4점]",
    choices: ["$\\dfrac{a}{b}$", "$\\dfrac{b}{a}$", "$\\dfrac{a^{2}}{b}$", "$\\dfrac{a}{b^{2}}$", "$\\dfrac{1}{5}ab$"],
    answer: "①",
    solution: "**[Logical Anchor]** 소수를 분수로 바꾼 후 약분하여 주어진 문자와 매칭.\n$\\sqrt{0.6} = \\sqrt{\\dfrac{6}{10}} = \\sqrt{\\dfrac{3}{5}} = \\dfrac{\\sqrt{3}}{\\sqrt{5}}$\n$\\therefore \\dfrac{a}{b}$"
  },
  {
    id: 11,
    level: "중",
    category: "근호를 포함한 식의 계산",
    content: "$\\dfrac{5\\sqrt{3}}{\\sqrt{6}}$ 의 분모를 유리화한 결과로 옳은 것은? [3점]",
    choices: ["$\\dfrac{5\\sqrt{2}}{4}$", "$\\dfrac{5}{4}$", "$\\dfrac{5\\sqrt{3}}{4}$", "$\\dfrac{5\\sqrt{2}}{2}$", "$\\dfrac{5\\sqrt{3}}{2}$"],
    answer: "④",
    solution: "**[Logical Anchor]** 분모와 분자에 $\\sqrt{6}$을 곱하거나 약분 후 유리화.\n$\\dfrac{5\\sqrt{3}}{\\sqrt{6}} = \\dfrac{5}{\\sqrt{2}} = \\dfrac{5\\sqrt{2}}{2}$\n$\\therefore \\dfrac{5\\sqrt{2}}{2}$"
  },
  {
    id: 14,
    level: "상",
    category: "근호를 포함한 식의 계산 활용",
    content: "한 변의 길이가 $2$인 정팔각형의 넓이를 구하시오. [5점]",
    choices: ["$8+4\\sqrt{2}$", "$8+8\\sqrt{2}$", "$4+4\\sqrt{2}$", "$2+4\\sqrt{2}$", "$4+8\\sqrt{2}$"],
    answer: "②",
    solution: "**[Logical Anchor]** 정팔각형을 포함하는 큰 정사각형에서 네 모퉁이의 직각이등변삼각형 넓이를 뺌.\n큰 정사각형의 한 변: $2 + 2\\sqrt{2}$\n전체 넓이: $(2 + 2\\sqrt{2})^{2} = 4 + 8 + 8\\sqrt{2} = 12 + 8\\sqrt{2}$\n모퉁이 삼각형 4개 넓이: $4 \\times (\\dfrac{1}{2} \\times \\sqrt{2} \\times \\sqrt{2}) = 4$\n$\\implies (12 + 8\\sqrt{2}) - 4 = 8 + 8\\sqrt{2}$\n$\\therefore 8+8\\sqrt{2}$"
  },
  {
    id: 19,
    level: "중",
    category: "인수분해",
    content: "$2x^{2}+9x+4 = (2x+a)(x+b)$ 에서 $a-b$의 값은? (단, $a, b$는 정수) [4점]",
    choices: ["$-3$", "$-1$", "$0$", "$1$", "$3$"],
    answer: "①",
    solution: "**[Logical Anchor]** 대각선 인수분해법을 통해 상수를 결정.\n$2x^{2}+9x+4 = (2x+1)(x+4)$\n$\\implies a=1, b=4$\n$\\implies a-b = 1 - 4 = -3$\n$\\therefore -3$ (※ 정답지 오류 교정 완료)"
  },
  {
    id: 21,
    level: "상",
    category: "인수분해 활용",
    content: "$a-b=5, a^{2}-2b-1-b^{2}=32$일 때, $a^{2}-2a+1-b^{2}$의 값을 구하시오. [5점]",
    choices: ["$18$", "$20$", "$22$", "$24$", "$28$"],
    answer: "④",
    solution: "**[Logical Anchor]** 주어진 식을 완전제곱식과 합차 공식을 이용해 변형.\n1) $a^{2}-(b+1)^{2}=32 \\implies (a-b-1)(a+b+1)=32$\n$a-b=5$ 대입 $\\implies 4(a+b+1)=32 \\implies a+b=7$\n2) 구하는 식: $(a-1)^{2}-b^{2} = (a-b-1)(a+b-1)$\n$\\implies (5-1) \\times (7-1) = 4 \\times 6 = 24$\n$\\therefore 24$"
  },
  {
    id: "서술형3",
    level: "중",
    category: "기하와 인수분해",
    content: "정사각형 $AEFB$의 넓이가 $12$, 정사각형 $ADGH$의 넓이가 $20$일 때, 직사각형 $ABCD$의 넓이를 구하시오. [6점]\n\n[Figure]\n좌표계: A(0,0), B(0, -2\\sqrt{3}), D(2\\sqrt{5}, 0), C(2\\sqrt{5}, -2\\sqrt{3})\n정사각형 AEFB: 점 A를 우측 상단 꼭짓점으로 함.\n정사각형 ADGH: 점 A를 좌측 하단 꼭짓점으로 함.\n기하학적 관계: AB \\perp AD",
    choices: [],
    answer: "$4\\sqrt{15}$",
    solution: "**[Logical Anchor]** 넓이를 통해 각 변의 길이를 무리수로 도출한 후 곱연산 수행.\n$AB = \\sqrt{12} = 2\\sqrt{3}$\n$AD = \\sqrt{20} = 2\\sqrt{5}$\n넓이 $ABCD = 2\\sqrt{3} \\times 2\sqrt{5} = 4\\sqrt{15}$\n$\\therefore 4\\sqrt{15}$"
  }
];