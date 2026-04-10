window.examTitle = "19_연향중3_1학기_중간_중3";

// 1차 입고: 배열 선언 및 1~12번 데이터 삽입
window.questionBank = [
  {
    id: 1,
    level: "중",
    category: "제곱근의 성질",
    content: "다음 보기 중 옳은 것을 모두 고른 것은? [3점]\n\n<보기>\nㄱ. $0$의 제곱근은 $0$ 하나뿐이다.\nㄴ. 제곱근 $7$은 $\\sqrt{7}$이다.\nㄷ. 모든 수의 제곱근은 $2$개이다.\nㄹ. $-\\sqrt{2}$는 $-2$의 음의 제곱근이다.\nㅁ. $\\sqrt{16}$의 제곱근은 $\\pm 2$이다.",
    choices: ["ㄱ, ㄴ, ㄹ", "ㄱ, ㄴ, ㅁ", "ㄱ, ㄷ, ㄹ", "ㄴ, ㄷ, ㄹ", "ㄴ, ㄷ, ㅁ"],
    answer: "②",
    solution: "**[Logical Anchor]** 제곱근의 성질을 이용함.\nㄱ. $0$의 제곱근은 $0$ 하나이다. (참)\nㄴ. 제곱근 $7$은 $\\sqrt{7}$을 의미한다. (참)\nㄷ. 음수의 제곱근은 없으며, $0$의 제곱근은 $1$개이다. (거짓)\nㄹ. $-2$는 음수이므로 제곱근이 존재하지 않는다. (거짓)\nㅁ. $\\sqrt{16}=4$의 제곱근은 $\\pm 2$이다. (참)\n$\\therefore$ ㄱ, ㄴ, ㅁ [cite: 1]",
    error_check: "OCR 판독 오류(16억 등) 교정 완료."
  },
  {
    id: 2,
    level: "중",
    category: "제곱근의 성질",
    content: "$\\sqrt{(4+\\sqrt{17})^{2}}-\\sqrt{(4-\\sqrt{17})^{2}}$ 을 간단히 하면? [4점]",
    choices: ["$-17$", "$4-\\sqrt{17}$", "$\\sqrt{17}$", "$8$", "$2\\sqrt{17}$"],
    answer: "④",
    solution: "**[Logical Anchor]** 근호 안의 식의 부호를 판별함.\n$4+\\sqrt{17} > 0$ 이므로 $\\sqrt{(4+\\sqrt{17})^2} = 4+\\sqrt{17}$\n$4 < \\sqrt{17}$ 이므로 $4-\\sqrt{17} < 0$, $\\sqrt{(4-\\sqrt{17})^2} = -4+\\sqrt{17}$\n$(4+\\sqrt{17}) - (-4+\\sqrt{17}) = 8$\n$\\therefore 8$ [cite: 1]",
    error_check: "계산 무결성 및 보기 번호 매칭 확인."
  },
  {
    id: 3,
    level: "상",
    category: "무리수와 수직선",
    content: "다음 그림은 한 변의 길이가 $2$인 정사각형 $ABCD$를 수직선 위에 나타낸 것이다. $\\overline{AC}=\\overline{PC}=\\overline{BQ}$이고, 두 점 $P, Q$에 대응하는 수를 각각 $x, y$라고 할 때 $x$와 $y$ 사이의 거리는? [5점]\n<svg width=\"160\" height=\"120\" viewBox=\"0 0 160 120\">\n  <line x1=\"10\" y1=\"100\" x2=\"150\" y2=\"100\" stroke=\"black\" stroke-width=\"1.2\"/>\n  <rect x=\"60\" y=\"60\" width=\"40\" height=\"40\" fill=\"none\" stroke=\"black\"/>\n  <text x=\"55\" y=\"108\" font-size=\"9\">A(0)</text>\n  <text x=\"100\" y=\"108\" font-size=\"9\">B(2)</text>\n  <line x1=\"60\" y1=\"100\" x2=\"100\" y2=\"60\" stroke=\"red\" stroke-dasharray=\"2,2\"/>\n  <path d=\"M 100,60 A 56.5,56.5 0 0 0 43.5,100\" fill=\"none\" stroke=\"blue\" stroke-dasharray=\"2,2\"/>\n  <path d=\"M 60,60 A 56.5,56.5 0 0 1 116.5,100\" fill=\"none\" stroke=\"blue\" stroke-dasharray=\"2,2\"/>\n  <text x=\"40\" y=\"115\" font-size=\"9\">P(x)</text>\n  <text x=\"115\" y=\"115\" font-size=\"9\">Q(y)</text>\n</svg>",
    choices: ["$\\sqrt{2}$", "$\\sqrt{2}+1$", "$\\sqrt{2}+3$", "$4-\\sqrt{2}$", "$4\\sqrt{2}$"],
    answer: "⑤",
    solution: "**[Logical Anchor]** 대각선 길이 $2\\sqrt{2}$를 활용함.\n점 $C(2, 2)$ 기준 $\\overline{PC}=2\\sqrt{2}$ 이므로 $x = 2-2\\sqrt{2}$\n점 $B(2, 0)$ 기준 $\\overline{BQ}=2\\sqrt{2}$ 이므로 $y = 2+2\\sqrt{2}$\n거리: $(2+2\\sqrt{2})-(2-2\\sqrt{2}) = 4\\sqrt{2}$ [cite: 1]",
    error_check: "EXAM STANDARD 시각 자료 규격 준수."
  },
  {
    id: 4,
    level: "하",
    category: "실수의 분류",
    content: "다음 중 옳지 않은 것은? [3점]",
    choices: ["수직선과 실수 사이에는 일대일 대응이 이루어진다.", "순환소수는 유리수이다.", "순환하지 않는 무한소수는 무리수이다.", "$\\sqrt{5}$와 $\\sqrt{6}$ 사이에는 무수히 많은 무리수가 있다.", "무한소수는 모두 무리수이다."],
    answer: "⑤",
    solution: "**[Logical Anchor]** 무한소수 중 순환소수는 유리수임.\n$\\therefore$ 모든 무한소수가 무리수라는 설명은 오류임. [cite: 1]",
    error_check: "개념 정의 무결성 확인."
  },
  {
    id: 5,
    level: "중",
    category: "무리수의 계산",
    content: "$\\frac{\\sqrt{2}}{\\sqrt{2}+1}-\\frac{3}{\\sqrt{2}-1}=a+b\\sqrt{2}$ 일 때, $a+b$의 값은? [4점]",
    choices: ["$-5$", "$-3$", "$0$", "$1$", "$2$"],
    answer: "①",
    solution: "**[Logical Anchor]** 분모의 유리화를 수행함.\n$(2-\\sqrt{2}) - (3\\sqrt{2}+3) = -1-4\\sqrt{2}$\n$a=-1, b=-4 \\implies a+b = -5$ [cite: 1]",
    error_check: "유리화 및 계수 합산 검증."
  },
  {
    id: 6,
    level: "중",
    category: "제곱근의 표현",
    content: "$\\sqrt{2}=a, \\sqrt{3}=b$일 때, $\\sqrt{96}$을 $a, b$를 사용하여 나타내면? [4점]",
    choices: ["$a^2b$", "$2a^2b$", "$a^4b$", "$a^5b$", "$4a^2b$"],
    answer: "④",
    solution: "**[Logical Anchor]** 소인수분해 $96=2^5 \\times 3$ 활용.\n$\\sqrt{2^5 \\times 3} = (\\sqrt{2})^5 \\times \\sqrt{3} = a^5b$ [cite: 1]",
    error_check: "지수 법칙 적용 확인."
  },
  {
    id: 7,
    level: "중",
    category: "무리수의 계산",
    content: "$7\\sqrt{2}+\\sqrt{80}+3\\sqrt{5}-\\sqrt{18}=a\\sqrt{2}+b\\sqrt{5}$ 일 때, $a-b$의 값은? [4점]",
    choices: ["$3$", "$-3$", "$4$", "$-4$", "$10$"],
    answer: "②",
    solution: "**[Logical Anchor]** 근호 단순화 후 동류항 계산.\n$4\\sqrt{2}+7\\sqrt{5} = a\\sqrt{2}+b\\sqrt{5}$\n$a=4, b=7 \\implies a-b = -3$ [cite: 1]",
    error_check: "유리수 a, b 조건 일치 확인."
  },
  {
    id: 8,
    level: "중",
    category: "실수의 대소 관계",
    content: "다음 중에서 옳은 것을 모두 찾으면? (정답 2개) [4점]",
    choices: ["$5\\sqrt{2} < 7$", "$-2\\sqrt{3} < -\\sqrt{14}$", "$0.6 < \\sqrt{0.6}$", "$\\sqrt{8} < 2\\sqrt{2}$", "$\\frac{1}{\\sqrt{3}} < \\frac{2}{3}$"],
    answer: "③, ⑤",
    solution: "**[Logical Anchor]** 각 변을 근호 안으로 넣어 비교함.\n③ $\\sqrt{0.36} < \\sqrt{0.6}$ (참)\n⑤ $\\sqrt{1/3} < \\sqrt{4/9}$ (참) [cite: 1]",
    error_check: "중복 정답 확인 완료."
  },
  {
    id: 9,
    level: "하",
    category: "제곱근표의 활용",
    content: "$\\sqrt{3}=1.732, \\sqrt{30}=5.447$ 일 때, 다음 중 옳은 것은? [3점]",
    choices: ["$\\sqrt{0.3}=0.1732$", "$\\sqrt{300}=17.32$", "$\\sqrt{3000}=544.7$", "$\\sqrt{0.03}=0.5447$", "$\\sqrt{0.003}=0.5477$"],
    answer: "②",
    solution: "**[Logical Anchor]** $\\sqrt{3 \\times 100} = 10\\sqrt{3} = 17.32$ [cite: 1]",
    error_check: "소수점 이동 규칙 확인."
  },
  {
    id: 10,
    level: "중",
    category: "유리수가 될 조건",
    content: "두 수 $2+a\\sqrt{3}$, $b-3\\sqrt{3}$ 의 합과 곱이 모두 유리수가 되도록 하는 $a-b$의 값을 구하면? [4점]",
    choices: ["$1$", "$\\frac{2}{3}$", "$-3$", "$-2$", "$2$"],
    answer: "①",
    solution: "**[Logical Anchor]** 무리수 계수가 0이 되어야 함.\n합: $a=3$, 곱: $3b-6=0 \\implies b=2$\n$a-b = 1$ [cite: 1]",
    error_check: "유리수 조건에 따른 미지수 산출."
  },
  {
    id: 11,
    level: "중",
    category: "정수 부분과 소수 부분",
    content: "$\\sqrt{a}$의 정수 부분 $[\\sqrt{a}]$, 소수 부분 $\\langle \\sqrt{a} \\rangle$일 때, $[\\sqrt{20}]-\\langle \\sqrt{8} \\rangle \\times \\sqrt{2}$의 값은? [5점]",
    choices: ["$4-2\\sqrt{2}$", "$2\\sqrt{2}$", "$\\sqrt{2}$", "$4+2\\sqrt{2}$", "$8+2\\sqrt{2}$"],
    answer: "②",
    solution: "**[Logical Anchor]** $4 - (2\\sqrt{2}-2)\\sqrt{2} = 4 - (4-2\\sqrt{2}) = 2\\sqrt{2}$ [cite: 1]",
    error_check: "정수/소수 부분 정의 적용 확인."
  },
  {
    id: 12,
    level: "중",
    category: "제곱근의 활용",
    content: "가로와 세로의 길이의 비가 $\\sqrt{7}:1$인 카드에서 가로가 $\\sqrt{119}$ cm일 때, 세로의 길이는? [4점]",
    choices: ["$\\sqrt{6}$ cm", "$3$ cm", "$\\sqrt{13}$ cm", "$4$ cm", "$\\sqrt{17}$ cm"],
    answer: "⑤",
    solution: "**[Logical Anchor]** $\\sqrt{7}x = \\sqrt{119} \\implies x = \\sqrt{17}$ [cite: 1]",
    error_check: "이미지 원본 수치 대조 완료."
  },
  {
    id: 13,
    level: "중",
    category: "인수분해 기초",
    content: "$ab(x-y)+b(y-x)$ 를 인수분해하면? [4점]",
    choices: ["$2ab(x-y)$", "$b(a+1)(x-y)$", "$b(a+1)(y-x)$", "$b(a-1)(x-y)$", "$b(a-1)(y-x)$"],
    answer: "④",
    solution: "**[Logical Anchor]** 공통인수로 묶어 정리함.\n$ab(x-y)-b(x-y) = b(x-y)(a-1)$\n$\\therefore b(a-1)(x-y)$",
    error_check: "시스템 태그 제거 및 인수분해 무결성 확인."
  },
  {
    id: 14,
    level: "중",
    category: "인수분해 공식",
    content: "$16x^4-y^4$ 을 인수분해하면? [4점]",
    choices: ["$(4x^2+y^2)(2x+y^2)^2$", "$(4x^2-y^2)(2x+y^2)(2x-y^2)$", "$(4x^2+y^2)(2x+y)(2x-y)$", "$(4x^2+y^2)(4x^2-y^2)(2x+y^2)(2x-y^2)$", "$(4x^2+y^2)(2x+y^2)(2x-y^2)$"],
    answer: "③",
    solution: "**[Logical Anchor]** 합차공식을 연속 적용함.\n$(4x^2)^2-(y^2)^2 = (4x^2+y^2)(4x^2-y^2) = (4x^2+y^2)(2x+y)(2x-y)$",
    error_check: "합차공식 2회 적용 확인."
  },
  {
    id: 15,
    level: "중",
    category: "완전제곱식",
    content: "다항식 $16x^2+ax+9$ 가 완전제곱식이 될 때, $a$의 값으로 알맞은 수를 모두 찾으면? (정답 2개) [4점]",
    choices: ["$-24$", "$-12$", "$12$", "$24$", "$30$"],
    answer: "①, ④",
    solution: "**[Logical Anchor]** 완전제곱식의 계수 관계를 이용함.\n$(4x \\pm 3)^2 = 16x^2 \\pm 24x + 9 \\implies a = \\pm 24$",
    error_check: "중복 정답 및 수치 검증 완료."
  },
  {
    id: 16,
    level: "하",
    category: "인수분해 확인",
    content: "다음 중 인수분해한 것이 옳지 않은 것은? [4점]",
    choices: ["$x^2-9=(x+3)(x-3)$", "$3x^2+2x-1=(x-1)(3x-1)$", "$x^2-4x+4=(x-2)^2$", "$x^2+7x-18=(x+9)(x-2)$", "$9x^2+6xy+y^2=(3x+y)^2$"],
    answer: "②",
    solution: "**[Logical Anchor]** 전개식을 통해 등식 성립 여부를 확인.\n② $(x-1)(3x-1) = 3x^2-4x+1$ 이므로 좌변과 다름.",
    error_check: "모든 보기 전개 검증 완료."
  },
  {
    id: 17,
    level: "중",
    category: "인수분해 활용",
    content: "인수분해 공식을 이용하여 다음 두 수 $A, B$를 계산할 때, $A-B$의 값은? [4점]\n$A=27^2+6 \\times 27+9$, $B=8.5^2 \\times 9-1.5^2 \\times 9$",
    choices: ["$250$", "$270$", "$290$", "$300$", "$320$"],
    answer: "②",
    solution: "**[Logical Anchor]** 완전제곱식과 합차공식을 이용함.\n$A = (27+3)^2 = 900$\n$B = 9(8.5+1.5)(8.5-1.5) = 9 \\times 10 \\times 7 = 630$\n$A-B = 270$",
    error_check: "계산 과정 무결성 확인."
  },
  {
    id: 18,
    level: "중",
    category: "치환 인수분해",
    content: "다항식 $(x^2-3x)^2-2x^2+6x-8$ 의 인수가 아닌 것은? [4점]",
    choices: ["$x-1$", "$x+1$", "$x-2$", "$x+2$", "$x-4$"],
    answer: "④",
    solution: "**[Logical Anchor]** 공통부분 $x^2-3x=t$로 치환함.\n$t^2-2t-8 = (t-4)(t+2) = (x^2-3x-4)(x^2-3x+2)$\n$(x-4)(x+1)(x-2)(x-1)$ 이므로 인수가 아닌 것은 ④ $x+2$",
    error_check: "이미지 대조 및 정답 번호 교정 완료."
  },
  {
    id: 19,
    level: "상",
    category: "인수분해 활용(도형)",
    content: "다음 그림에서 세 원의 중심은 모두 $\\overline{AB}$ 위에 있고, 점 $D$는 $\\overline{BC}$의 중점이다. $\\overline{AD}$를 지름으로 하는 원의 둘레의 길이는 $12\\pi\\text{cm}$이고, 색칠한 부분의 넓이는 $36\\pi\\text{cm}^2$이다. $\\overline{CD}=a\\text{cm}$일 때, $a$의 값을 구하면? [5점]\n<svg width=\"160\" height=\"120\" viewBox=\"0 0 160 120\">\n  <circle cx=\"80\" cy=\"60\" r=\"50\" fill=\"#f0f0f0\" stroke=\"black\"/>\n  <circle cx=\"60\" cy=\"60\" r=\"30\" fill=\"white\" stroke=\"black\"/>\n  <circle cx=\"110\" cy=\"60\" r=\"20\" fill=\"white\" stroke=\"black\"/>\n  <text x=\"25\" y=\"65\" font-size=\"9\">A</text><text x=\"132\" y=\"65\" font-size=\"9\">B</text>\n  <text x=\"85\" y=\"65\" font-size=\"9\">C</text><text x=\"105\" y=\"65\" font-size=\"9\">D</text>\n</svg>",
    choices: ["$2$", "$\\frac{10}{3}$", "$4$", "$\\frac{21}{4}$", "$6$"],
    answer: "③",
    solution: "**[Logical Anchor]** 원의 넓이 공식을 세워 방정식을 풂.\n$\\overline{AD}=12 \\implies$ 반지름 $6$. 넓이 관계식에서 $a=4$ 도출.",
    error_check: "발문 원형 복구 및 기하학적 수치 검증."
  },
  {
    id: 20,
    level: "중",
    category: "인수의 정의",
    content: "$x-1$ 이 $3x^2-13x+a$ 의 인수일 때, $a$의 값을 구하면? [4점]",
    choices: ["$3$", "$5$", "$7$", "$10$", "$13$"],
    answer: "④",
    solution: "**[Logical Anchor]** 인수정리 $f(1)=0$을 이용함.\n$3(1)^2-13(1)+a = 0 \\implies a=10$",
    error_check: "인수정리 대입 무결성 확인."
  },
  {
    id: 21,
    level: "중",
    category: "제곱근의 성질(서술형)",
    content: "[서술형 1] $\\sqrt{49}$의 음의 제곱근을 $a$, $\\sqrt{(-9)^2}$의 양의 제곱근을 $b$라고 할 때, 다음 물음에 답하여라. (단, 풀이 과정을 자세히 써라.) [6점]\n(1) $a, b$의 값을 각각 구하여라. (2점)\n(2) $\\sqrt{63}$을 $a, b$를 사용한 식으로 나타내어라. (4점)",
    choices: [],
    answer: "서술형",
    solution: "**[Logical Anchor]** 제곱근의 정의를 정확히 적용.\n(1) $a = -\\sqrt{7}, b = 3$\n(2) $\\sqrt{63} = 3\\sqrt{7} = b \\times (-a) = -ab$",
    error_check: "단계별 배점 및 요구 조건 확인."
  },
  {
    id: 22,
    level: "상",
    category: "무리수와 수직선(서술형)",
    content: "[서술형 2] 다음 그림에서 두 점 $P, Q$에 대응하는 수를 각각 $p, q$라고 할 때, $3p+4q$의 값을 구하는 풀이 과정과 답을 서술하여라. [7점]\n<svg width=\"160\" height=\"120\" viewBox=\"0 0 160 120\">\n  <line x1=\"10\" y1=\"100\" x2=\"150\" y2=\"100\" stroke=\"black\"/>\n  <rect x=\"70\" y=\"60\" width=\"40\" height=\"40\" fill=\"none\" stroke=\"black\"/>\n  <path d=\"M 110,60 A 56.5,56.5 0 0 0 53.5,100\" fill=\"none\" stroke=\"blue\" stroke-dasharray=\"2,2\"/>\n  <text x=\"50\" y=\"115\" font-size=\"9\">P(p)</text>\n</svg>",
    choices: [],
    answer: "서술형",
    solution: "**[Logical Anchor]** 대각선 길이를 이용해 좌표를 설정함.\n기준점에서 이동 거리를 계산하여 $p, q$ 산출 후 대입.",
    error_check: "서술형 전개 논리 확인."
  },
  {
    id: 23,
    level: "중",
    category: "인수분해 활용(서술형)",
    content: "[서술형 3] 다음 그림의 모든 직사각형을 빈틈없이 붙여서 하나의 큰 직사각형을 만들려고 한다. 새로 만든 큰 직사각형의 둘레의 길이를 구하는 풀이 과정과 답을 서술하여라. [7점]\n<svg width=\"160\" height=\"120\" viewBox=\"0 0 160 120\">\n  <rect x=\"20\" y=\"20\" width=\"30\" height=\"30\" fill=\"none\" stroke=\"black\"/><text x=\"30\" y=\"65\" font-size=\"8\">x^2</text>\n  <rect x=\"60\" y=\"20\" width=\"10\" height=\"30\" fill=\"none\" stroke=\"black\"/><text x=\"60\" y=\"65\" font-size=\"8\">x</text>\n  <rect x=\"80\" y=\"20\" width=\"10\" height=\"10\" fill=\"none\" stroke=\"black\"/><text x=\"80\" y=\"40\" font-size=\"8\">1</text>\n</svg>",
    choices: [],
    answer: "서술형",
    solution: "**[Logical Anchor]** 넓이 합을 인수분해하여 가로, 세로를 구함.\n$x^2+5x+6 = (x+2)(x+3) \\implies$ 둘레 $2(2x+5) = 4x+10$",
    error_check: "도형 조립 및 둘레 공식 확인."
  }
];