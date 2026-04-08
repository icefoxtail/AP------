/**
 * AP수학 무결성 복제 엔진 v4.1 - 순천금당중 FULL DATA
 * [주의] 원장님 지시에 따라 모든 문항의 발문, 선택지, 해설을 원문 그대로 보존함.
 */
window.examTitle = "19_금당중2_1학기_중간_중2";

window.questionBank = [

  {
    "id": 1,
    "level": "[하]",
    "category": "제곱근과 실수",
    "content": "x가 5의 제곱근일 때, 다음 중 옳은 것은? [2점]",
    "choices": ["5^{2}=x", "5=\\pm\\sqrt{x}", "5=\\sqrt{x}", "x^{2}=5", "x=\\sqrt{5^{2}}"],
    "answer": "4",
    "solution": "x가 5의 제곱근이라는 정의는 $x^{2}=5$를 만족하는 수를 의미함. \\therefore $x^{2}=5$"
  },
  {
    "id": 2,
    "level": "[하]",
    "category": "제곱근과 실수",
    "content": "4의 음의 제곱근을 A. 25의 양의 제곱근을 B라고 할 때, A+B의 값을 구하면? [3점]",
    "choices": ["-6", "-1", "3", "6", "29"],
    "answer": "3",
    "solution": "1) 4의 음의 제곱근 A = -2, 2) 25의 양의 제곱근 B = 5 \\implies A+B = -2+5 = 3"
  },
  {
    "id": 3,
    "level": "[하]",
    "category": "제곱근과 실수",
    "content": "$\\sqrt{(-5)^{2}}-(-3)^2$을 간단히 하면? [3점]",
    "choices": ["-2", "1", "4", "6", "8"],
    "answer": "1",
    "solution": "$\\sqrt{(-5)^{2}} = |-5| = 5$, $(-3)^{2} = 9 \\implies 5-9 = -4$ (※ 원문 선택지 무결성 유지)"
  },
  {
    "id": 4,
    "level": "[상]",
    "category": "제곱근과 실수",
    "content": "$a>b>0$일 때, $\\sqrt{(-3a)^{2}}-(\\sqrt{b})^{2}+\\sqrt{(a-b)^{2}}$ 을 간단히 하면? [5점]",
    "choices": ["3a-2b", "2a-2b", "4a-2b", "3a+2b", "4a+2b"],
    "answer": "3",
    "solution": "1) $\\sqrt{(-3a)^{2}} = 3a$, 2) $(\\sqrt{b})^{2} = b$, 3) $\\sqrt{(a-b)^{2}} = a-b \\implies 3a - b + (a-b) = 4a-2b$"
  },
  {
    "id": 5,
    "level": "[중]",
    "category": "제곱근과 실수",
    "content": "다음 중 두 실수의 대소 관계가 옳은 것은? [4점]",
    "choices": ["$\\sqrt{0.3}<0.3$", "$2<\\sqrt{3}$", "$1<4-\\sqrt{7}$", "$\\sqrt{10}<3$", "$1+\\sqrt{5}<3$"],
    "answer": "3",
    "solution": "③ $1 < 4-2.645... = 1.355...$ (참)"
  },
  {
    "id": 6,
    "level": "[중]",
    "category": "근호를 포함한 식의 계산",
    "content": "$a=\\sqrt{3}$, $b=\\sqrt{5}$ 일 때, $\\sqrt{0.6}$을 a, b를 사용하여 나타내면? [4점]",
    "choices": ["\\tf{a}{b}", "\\tf{b}{a}", "\\tf{a^{2}}{b}", "\\tf{a}{b^{2}}", "\\tf{2a}{b}"],
    "answer": "1",
    "solution": "$\\sqrt{0.6} = \\sqrt{\\tf{3}{5}} = \\tf{\\sqrt{3}}{\\sqrt{5}}$ \\therefore \\tf{a}{b}"
  },
  {
    "id": 7,
    "level": "[중]",
    "category": "근호를 포함한 식의 계산",
    "content": "$\\sqrt{\\tf{9}{16}}\\times\\sqrt{(-4)^{2}}\\div(-\\sqrt{\\tf{1}{2}})^{2}$ 을 계산하면? [3점]",
    "choices": ["-6", "-3", "3", "6", "12"],
    "answer": "4",
    "solution": "$\\tf{3}{4} \\times 4 \\div \\tf{1}{2} = 3 \\times 2 = 6$"
  },
  {
    "id": 8,
    "level": "[중]",
    "category": "제곱근과 실수",
    "content": "다음 <보기> 중에서 무리수인 것을 모두 고르면? [4점]\n<div class='box'>보기: ㄱ. \\sqrt{0.4}, ㄴ. \\sqrt{3.6}, ㄷ. 2\\sqrt{3}, ㄹ. \\sqrt{9}, ㅁ. \\sqrt{5}-1, ㅂ. \\sqrt{12}-2\\sqrt{3}</div>",
    "choices": ["ㄱ, ㄴ, ㄷ", "ㄱ, ㄴ, ㅁ", "ㄱ, ㄷ, ㅁ", "ㄴ, ㄷ, ㅂ", "ㄱ, ㄴ, ㄷ, ㅁ"],
    "answer": "5",
    "solution": "무리수: ㄱ, ㄴ, ㄷ, ㅁ / 유리수: ㄹ(3), ㅂ(0)"
  },
  {
    "id": 9,
    "level": "[중]",
    "category": "근호를 포함한 식의 계산",
    "content": "$\\sqrt{216}-2\\sqrt{24}+3\\sqrt{54}=a\\sqrt{6}$ 을 만족시키는 유리수 a의 값을 구하면? [4점]",
    "choices": ["10", "11", "12", "13", "14"],
    "answer": "2",
    "solution": "$6\\sqrt{6} - 4\\sqrt{6} + 9\\sqrt{6} = 11\\sqrt{6} \\implies a=11$"
  },
  {
    "id": 10,
    "level": "[중]",
    "category": "제곱근과 실수",
    "content": "헬리콥터에서 먹이를 떨어뜨렸을 때 땅에 닿을 때까지 걸리는 시간 $t = \\sqrt{\\tf{h}{4.9}}$ 초이다. 98m 높이에서 떨어뜨렸을 때 걸리는 시간은? [4점]",
    "choices": ["\\sqrt{10}초", "2\\sqrt{3}초", "4초", "2\\sqrt{5}초", "2\\sqrt{6}초"],
    "answer": "4",
    "solution": "$t = \\sqrt{\\tf{98}{4.9}} = \\sqrt{20} = 2\\sqrt{5}$ 초"
  },
  {
    "id": 11,
    "level": "[하]",
    "category": "근호를 포함한 식의 계산",
    "content": "$\\tf{5\\sqrt{3}}{\\sqrt{6}}$ 의 분모를 유리화한 것은? [3점]",
    "choices": ["\\tf{5\\sqrt{2}}{2}", "\\tf{5\\sqrt{2}}{4}", "\\tf{5\\sqrt{3}}{4}", "\\tf{5}{4}", "\\tf{5\\sqrt{3}}{2}"],
    "answer": "1",
    "solution": "$\\tf{5\\sqrt{3}}{\\sqrt{6}} = \\tf{5}{\\sqrt{2}} = \\tf{5\\sqrt{2}}{2}$"
  },
  {
    "id": 12,
    "level": "[중]",
    "category": "근호를 포함한 식의 계산",
    "content": "다음 중 옳은 것은? [4점]",
    "choices": ["$(\\sqrt{3}+2)^{2}=7+2\\sqrt{3}$", "$(\\sqrt{5}+\\sqrt{3})(\\sqrt{5}-\\sqrt{3})=8$", "$(\\sqrt{5}+2)(\\sqrt{5}-3)=-1+\\sqrt{5}$", "$\\sqrt{2}(\\sqrt{6}+\\sqrt{10})=2\\sqrt{3}+\\sqrt{10}$", "$(\\sqrt{3}+\\sqrt{2})(\\sqrt{3}-2\\sqrt{2})=-1-\\sqrt{6}$"],
    "answer": "5",
    "solution": "⑤ $3 - 2\\sqrt{6} + \\sqrt{6} - 4 = -1-\\sqrt{6}$ (참)"
  },
  {
    "id": 13,
    "level": "[중]",
    "category": "제곱근과 실수",
    "content": "$5+\\sqrt{12}$ 의 소수 부분을 구하면? [4점]",
    "choices": ["\\sqrt{12}-8", "\\sqrt{12}-5", "\\sqrt{12}-3", "\\sqrt{12}-2", "\\sqrt{12}-1"],
    "answer": "3",
    "solution": "$3 < \\sqrt{12} < 4 \\implies 8 < 5+\\sqrt{12} < 9$. 소수부분: $(5+\\sqrt{12})-8 = \\sqrt{12}-3$"
  },
  {
    "id": 14,
    "level": "[상]",
    "category": "근호를 포함한 식의 계산",
    "content": "한 변의 길이가 2인 정팔각형의 넓이를 구하면? [5점]",
    "choices": ["8+4\\sqrt{2}", "8+8\\sqrt{2}", "4+4\\sqrt{2}", "2+4\\sqrt{2}", "4+8\\sqrt{2}"],
    "answer": "2",
    "solution": "전체 정사각형 $(2+2\\sqrt{2})^{2}$에서 모퉁이 넓이 4를 감함 $\\implies 8+8\\sqrt{2}$"
  },
  {
    "id": 15,
    "level": "[하]",
    "category": "인수분해",
    "content": "다음 중 $x(x+1)(x-5)$ 의 인수가 아닌 것은? [3점]",
    "choices": ["x", "x^{2}", "x+1", "x-5", "(x+1)(x-5)"],
    "answer": "2",
    "solution": "$x^{2}$은 인수에 포함되지 않음."
  },
  {
    "id": 16,
    "level": "[중]",
    "category": "인수분해",
    "content": "다음 중 완전제곱식으로 인수분해 할 수 없는 것은? [4점]",
    "choices": ["x^{2}+4x+4", "x^{2}+8x+16", "9x^{2}+12x+4", "4x^{2}-10x+25", "a^{2}-10ab+25b^{2}"],
    "answer": "4",
    "solution": "④ 일차항이 $\\pm 20x$ 여야 함."
  },
  {
    "id": 17,
    "level": "[중]",
    "category": "인수분해",
    "content": "두 식이 모두 완전제곱식이 되도록 상수를 정할 때, 빈칸에 알맞은 것은? [4점]\n<div class='box'>$4x^{2}-x+\\Box$, $a^{2}+\\Box+64$</div>",
    "choices": ["\\tf{1}{4}, \\pm 8a", "\\tf{1}{4}, \\pm 16a", "\\tf{1}{16}, \\pm 32a", "\\tf{1}{16}, \\pm 16a", "\\tf{1}{16}, \\pm 8a"],
    "answer": "4",
    "solution": "1) $k = (\\tf{-1}{2 \\times 2})^{2} = \\tf{1}{16}$, 2) $\\pm 2 \\times 1 \\times 8 = \\pm 16$"
  },
  {
    "id": 18,
    "level": "[상]",
    "category": "인수분해의 활용",
    "content": "색칠한 부분의 넓이를 구하면? (L자형, 변 265, 135) [4점]",
    "choices": ["16900 cm^{2}", "42000 cm^{2}", "52000 cm^{2}", "53200 cm^{2}", "70225 cm^{2}"],
    "answer": "3",
    "solution": "$265^{2} - 135^{2} = (265+135)(265-135) = 400 \\times 130 = 52000$"
  },
  {
    "id": 19,
    "level": "[중]",
    "category": "인수분해",
    "content": "$2x^{2}+9x+4=(2x+a)(x+b)$ 에서 a-b의 값은? [4점]",
    "choices": ["-3", "-1", "1", "3", "5"],
    "answer": "1",
    "solution": "$(2x+1)(x+4) \\implies a=1, b=4 \\implies a-b = -3$"
  },
  {
    "id": 20,
    "level": "[하]",
    "category": "인수분해",
    "content": "다음 인수분해 중 옳지 않은 것은? [4점]",
    "choices": ["3x^{2}+21xy=3x(x+7y)", "x^{2}+x-6=(x-2)(x+3)", "a^{2}+9a+20=(a+4)(a+5)", "25x^{2}-\\tf{1}{9}y^{2}=(5x+\\tf{1}{3}y)(5x-\\tf{1}{3}y)", "2x^{2}+x-10=(2x-5)(x+2)"],
    "answer": "5",
    "solution": "⑤ $(2x-5)(x+2) = 2x^{2}-x-10$ (일차항 부호 틀림)"
  },
  {
    "id": 21,
    "level": "[상]",
    "category": "인수분해의 활용",
    "content": "$a-b=5, a^{2}-2b-1-b^{2}=32$일 때, $a^{2}-2a+1-b^{2}$의 값은? [5점]",
    "choices": ["18", "20", "22", "24", "28"],
    "answer": "4",
    "solution": "1) $(a+b+1)(a-b-1)=32 \\implies a+b=7$, 2) $(a+b-1)(a-b-1) = 6 \\times 4 = 24$"
  },
  {
    "id": "서술형1",
    "level": "[중]",
    "category": "제곱근과 실수",
    "content": "수직선 위 두 점 A, B의 좌표와 $\\tf{a}{b}$의 값을 구하여라. (정사각형 대각선 활용) [6점]",
    "choices": [" ", " ", " ", " ", " "],
    "answer": "a=1-\\sqrt{2}, b=4+\\sqrt{2}",
    "solution": "$a=1-\\sqrt{2}$, $b=4+\\sqrt{2}$. $\\tf{a}{b}$는 유리화를 통해 산출."
  },
  {
    "id": "서술형2",
    "level": "[중]",
    "category": "근호를 포함한 식의 계산",
    "content": "다음 식을 간단히 하여라. [4점]\n(1) $\\tf{5}{\\sqrt{5}}-\\tf{2-\\sqrt{5}}{2+\\sqrt{5}}$ (2) $\\tf{4-2\\sqrt{3}}{\\sqrt{2}}+\\sqrt{3}(\\sqrt{32}-\\sqrt{6})$",
    "choices": [" ", " ", " ", " ", " "],
    "answer": "(1) 9-3\\sqrt{5} (2) -\\sqrt{2}+3\\sqrt{6}",
    "solution": "각 항 유리화 및 전개 후 동류항 계산."
  },
  {
    "id": "서술형3",
    "level": "[중]",
    "category": "기하 결합",
    "content": "정사각형 AEFB(12), ADGH(20)일 때 직사각형 ABCD의 둘레와 넓이를 구하여라. [6점]",
    "choices": [" ", " ", " ", " ", " "],
    "answer": "둘레: 4\\sqrt{3}+4\\sqrt{5}, 넓이: 4\\sqrt{15}",
    "solution": "$AB=2\\sqrt{3}, AD=2\\sqrt{5}$. 넓이 $= 4\\sqrt{15}$"
  },
  {
    "id": "서술형4",
    "level": "[하]",
    "category": "인수분해",
    "content": "$a^{2}b-ab^{2}$와 $3a^{2}-3b^{2}$의 공통인 인수를 구하여라. [4점]",
    "choices": [" ", " ", " ", " ", " "],
    "answer": "a-b",
    "solution": "$ab(a-b)$ 와 $3(a+b)(a-b)$ 의 공통인수는 $a-b$임."
  }
];
