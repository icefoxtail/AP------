window.examTitle = "23_여수여고_1학기_중간_고1_기출";

window.questionBank = [
  {
    "id": 1,
    "level": "하",
    "category": "다항식의 덧셈과 뺄셈",
    "originalCategory": "다항식의 연산",
    "standardCourse": "고등 수학(상)",
    "standardUnitKey": "H15-SA-01",
    "standardUnit": "다항식의 연산",
    "standardUnitOrder": 1,
    "content": "두 다항식 $A=x^{2}+5xy-4y^{2}$, $B=2x^{2}-xy+y^{2}$에 대하여 $2A-3B$를 구하면? [3.3점]",
    "choices": [
      "$-4x^{2}-13xy-11y^{2}$",
      "$-4x^{2}+11xy-13y^{2}$",
      "$-5x^{2}+11xy-3y^{2}$",
      "$5x^{2}+11xy-13y^{2}$",
      "$-4x^{2}+13xy-11y^{2}$"
    ],
    "answer": "⑤",
    "solution": "[키포인트]\n다항식의 대입 시 괄호를 사용하여 부호를 주의하며 동류항끼리 계산한다.\n\n조건 정리\n- $A = x^2 + 5xy - 4y^2$\n- $B = 2x^2 - xy + y^2$\n\n풀이 과정\n$2A-3B$에 주어진 식을 대입한다.\n$2(x^2 + 5xy - 4y^2) - 3(2x^2 - xy + y^2)$\n$= (2x^2 + 10xy - 8y^2) - (6x^2 - 3xy + 3y^2)$\n$= 2x^2 - 6x^2 + 10xy + 3xy - 8y^2 - 3y^2$\n$= -4x^2 + 13xy - 11y^2$\n\n결론\n따라서 정답은 ⑤이다."
  },
  {
    "id": 2,
    "level": "중",
    "category": "곱셈 공식의 변형",
    "originalCategory": "다항식의 연산",
    "standardCourse": "고등 수학(상)",
    "standardUnitKey": "H15-SA-01",
    "standardUnit": "다항식의 연산",
    "standardUnitOrder": 1,
    "content": "$x-y=1$, $x^{2}+y^{2}=4$일 때, $x^{3}-y^{3}$의 값을 구하면? [3.5점]",
    "choices": [
      "$\\frac{11}{2}$",
      "$6$",
      "$\\frac{13}{2}$",
      "$7$",
      "$\\frac{15}{2}$"
    ],
    "answer": "①",
    "solution": "[키포인트]\n곱셈 공식의 변형을 이용하여 $xy$의 값을 먼저 구한 후, $x^3-y^3$의 값을 계산한다.\n\n조건 정리\n- $x-y=1$\n- $x^2+y^2=4$\n\n풀이 과정\n1. $(x-y)^2 = x^2 - 2xy + y^2$을 이용한다.\n$1^2 = 4 - 2xy \\implies 2xy = 3 \\implies xy = \\frac{3}{2}$\n2. $x^3-y^3 = (x-y)^3 + 3xy(x-y)$에 대입한다.\n$x^3-y^3 = 1^3 + 3 \\cdot \\left(\\frac{3}{2}\\right) \\cdot 1 = 1 + \\frac{9}{2} = \\frac{11}{2}$\n\n결론\n따라서 정답은 ①이다."
  },
  {
    "id": 3,
    "level": "하",
    "category": "다항식의 전개",
    "originalCategory": "다항식의 연산",
    "standardCourse": "고등 수학(상)",
    "standardUnitKey": "H15-SA-01",
    "standardUnit": "다항식의 연산",
    "standardUnitOrder": 1,
    "content": "$(2x-1)(2x^{2}+x+1)$을 전개하면 $ax^{3}+bx^{2}+cx-1$이다. $a-b+c$의 값은? (단, $a, b, c$는 상수이다.) [3.7점]",
    "choices": [
      "1",
      "2",
      "3",
      "4",
      "5"
    ],
    "answer": "⑤",
    "solution": "[키포인트]\n분배법칙을 이용하여 다항식을 전개한 후, 동류항끼리 정리하여 계수를 비교한다.\n\n조건 정리\n- $(2x-1)(2x^2+x+1) = ax^3+bx^2+cx-1$\n\n풀이 과정\n주어진 식을 분배법칙으로 전개한다.\n$(2x-1)(2x^2+x+1) = 2x(2x^2+x+1) - 1(2x^2+x+1)$\n$= 4x^3 + 2x^2 + 2x - 2x^2 - x - 1$\n$= 4x^3 + x - 1$\n계수를 비교하면 $a=4, b=0, c=1$이다.\n$a-b+c = 4 - 0 + 1 = 5$\n\n결론\n따라서 정답은 ⑤이다."
  },
  {
    "id": 4,
    "level": "중",
    "category": "다항식의 나눗셈",
    "originalCategory": "다항식의 연산",
    "standardCourse": "고등 수학(상)",
    "standardUnitKey": "H15-SA-01",
    "standardUnit": "다항식의 연산",
    "standardUnitOrder": 1,
    "content": "다항식 $A=2x^{4}+3x^{3}+4x+5$, $B=x^{2}+1$에 대하여 $A$를 $B$로 나누었을 때의 나머지는? [4점]",
    "choices": [
      "$x+6$",
      "$x+7$",
      "$x+8$",
      "$x+9$",
      "$x+10$"
    ],
    "answer": "②",
    "solution": "[키포인트]\n다항식의 나눗셈은 직접 나눗셈을 이용하여 차수가 나누는 식보다 작아질 때까지 계산한다.\n\n조건 정리\n- $A = 2x^4 + 3x^3 + 4x + 5$\n- $B = x^2 + 1$\n\n풀이 과정\n직접 나눗셈을 수행한다.\n1. $2x^4$을 맞추기 위해 몫에 $2x^2$을 곱한다. $2x^2(x^2+1) = 2x^4+2x^2$.\n위 식에서 빼면 $3x^3 - 2x^2 + 4x + 5$가 남는다.\n2. $3x^3$을 맞추기 위해 몫에 $3x$를 곱한다. $3x(x^2+1) = 3x^3+3x$.\n위 식에서 빼면 $-2x^2 + x + 5$가 남는다.\n3. $-2x^2$을 맞추기 위해 몫에 $-2$를 곱한다. $-2(x^2+1) = -2x^2-2$.\n위 식에서 빼면 $x + 7$이 남는다. 나머지의 차수가 $B$보다 작으므로 나눗셈이 종료된다.\n따라서 나머지는 $x+7$이다.\n\n결론\n따라서 정답은 ②이다."
  },
  {
    "id": 5,
    "level": "중",
    "category": "나머지정리",
    "originalCategory": "나머지정리와 인수분해",
    "standardCourse": "고등 수학(상)",
    "standardUnitKey": "H15-SA-02",
    "standardUnit": "나머지정리와 인수분해",
    "standardUnitOrder": 2,
    "content": "다항식 $P(x)$를 $x-a$로 나누었을 때의 몫을 $Q(x)$, 나머지를 $R$이라 하자. $x^{2}P(x)$를 $x(x-a)$로 나누었을 때의 나머지를 $T(x)$라 할 때, $T(a)$의 값은? (단, $a, R$은 상수이다.) [4.3점]",
    "choices": [
      "$-aR$",
      "$a^{2}R$",
      "$-a^{2}R$",
      "$2a^{2}R$",
      "$3aR$"
    ],
    "answer": "②",
    "solution": "[키포인트]\n나눗셈의 관계식을 항등식으로 세우고, 식을 변형하여 새로운 나누는 식에 대한 나머지를 구한다.\n\n조건 정리\n- $P(x) = (x-a)Q(x) + R$\n\n풀이 과정\n1. 양변에 $x^2$을 곱한다.\n$x^2P(x) = x^2(x-a)Q(x) + x^2R$\n2. 나누는 식이 $x(x-a)$이므로, 우변을 이 형태로 묶어낸다.\n$x^2R$을 $x(x-a)$로 나누었을 때의 형태로 변형한다.\n$x^2R = R(x^2 - ax + ax) = R(x^2 - ax) + aRx = Rx(x-a) + aRx$\n3. 원래 식에 대입하여 묶는다.\n$x^2P(x) = x \\cdot x(x-a)Q(x) + Rx(x-a) + aRx$\n$= x(x-a)[xQ(x) + R] + aRx$\n4. $x(x-a)$로 나누었을 때 몫은 $xQ(x)+R$이고, 나머지는 $T(x) = aRx$이다.\n$T(a) = a \\cdot R \\cdot a = a^2R$이다.\n\n결론\n따라서 정답은 ②이다."
  },
  {
    "id": 6,
    "level": "중",
    "category": "항등식",
    "originalCategory": "나머지정리와 인수분해",
    "standardCourse": "고등 수학(상)",
    "standardUnitKey": "H15-SA-02",
    "standardUnit": "나머지정리와 인수분해",
    "standardUnitOrder": 2,
    "content": "다음 중 $x$에 대한 항등식인 것을 모두 고르면? [3.7점]",
    "choices": [
      "$x^{2}=2x-3$",
      "$3(x+1)+x=4(x+1)-1$",
      "$(x+2)^{2}-8x=(x-2)^{2}$",
      "$(x+2)^{2}-(x-2)^{2}=4x$",
      "$x-3=x+2$"
    ],
    "answer": "②, ③",
    "solution": "[키포인트]\n항등식은 미지수에 어떤 값을 대입해도 항상 참이 되는 등식이며, 식을 정리했을 때 좌변과 우변이 완벽히 일치해야 한다.\n\n풀이 과정\n① $x^2=2x-3 \\implies x^2-2x+3=0$ (이차방정식)\n② 좌변: $3x+3+x = 4x+3$, 우변: $4x+4-1 = 4x+3$. 좌변과 우변이 같으므로 항등식이다.\n③ 좌변: $(x+2)^2 - 8x = x^2+4x+4-8x = x^2-4x+4 = (x-2)^2$. 우변과 같으므로 항등식이다.\n④ 좌변: $(x+2)^2 - (x-2)^2 = (x^2+4x+4) - (x^2-4x+4) = 8x$. 우변인 $4x$와 다르므로 항등식이 아니다.\n⑤ $x-3=x+2 \\implies -3=2$ (불능, 해가 없는 방정식)\n\n결론\n따라서 정답은 ②, ③이다."
  },
  {
    "id": 7,
    "level": "중",
    "category": "나머지정리",
    "originalCategory": "나머지정리와 인수분해",
    "standardCourse": "고등 수학(상)",
    "standardUnitKey": "H15-SA-02",
    "standardUnit": "나머지정리와 인수분해",
    "standardUnitOrder": 2,
    "content": "다음은 $x$의 값에 관계없이 등식 $(x+2)^{3}=a(x-1)^{3}+b(x-1)^{2}+c(x-1)+d$가 항상 성립할 때, 상수 $a, b, c, d$에 대하여 $a-b+c-d$의 값을 구하는 과정이다. 다음 (가), (나), (다)에 들어갈 말로 알맞게 짝지은 것을 고르면? [4.3점]\n<div class=\"question-table-wrap\">\n<table class=\"question-table\">\n  <tr>\n    <td>\n      $(x+2)^{3}=a(x-1)^{3}+b(x-1)^{2}+c(x-1)+d$를 다시 정리하면<br>\n      $(x+2)^{3}=(x-1)$ <b>(가)</b> $+d$이므로 나머지 정리를 이용하면 $d=$ <b>(나)</b> $^{3}$이다.<br>\n      상수 $c$를 구하기 위하여 <b>(가)</b> $=(x-1)Q(x)+c$이므로 $c=27$이다.<br>\n      이 나눗셈 과정을 반복하여 $a, b, c, d$의 값을 구할 수 있고 $a-b+c-d$의 값은 <b>(다)</b> 이다.\n    </td>\n  </tr>\n</table>\n</div>",
    "choices": [
      "(가) $a(x-1)^2+b(x-1)+c$, (나) 3, (다) 27",
      "(가) $a(x-1)^2-b(x-1)+c$, (나) 3, (다) 27",
      "(가) $a(x-1)^2+b(x-1)+c$, (나) 3, (다) -8",
      "(가) $a(x-1)^2-b(x-1)+c$, (나) 1, (다) -8",
      "(가) $a(x-1)^2+b(x-1)+c$, (나) 1, (다) -8"
    ],
    "answer": "③",
    "solution": "[키포인트]\n조립제법을 연속으로 사용하여 $(x-1)$에 대한 내림차순으로 정리된 식의 계수를 찾는다.\n\n조건 정리\n- $(x+2)^3 = a(x-1)^3+b(x-1)^2+c(x-1)+d$\n\n풀이 과정\n1. 우변을 $(x-1)$로 묶으면 $(x-1)[a(x-1)^2+b(x-1)+c]+d$가 되므로, (가)는 $a(x-1)^2+b(x-1)+c$이다.\n2. 양변에 $x=1$을 대입하면 $(1+2)^3 = d \\implies d = 3^3 = 27$이므로 (나)는 $3$이다.\n3. 좌변 $(x+2)^3 = ((x-1)+3)^3 = (x-1)^3 + 9(x-1)^2 + 27(x-1) + 27$이다.\n항등식의 계수 비교에 의해 $a=1, b=9, c=27, d=27$임을 알 수 있다.\n4. 구하고자 하는 값 $a-b+c-d = 1 - 9 + 27 - 27 = -8$이므로 (다)는 $-8$이다.\n\n결론\n따라서 정답은 ③이다."
  },
  {
    "id": 8,
    "level": "상",
    "category": "인수정리",
    "originalCategory": "나머지정리와 인수분해",
    "standardCourse": "고등 수학(상)",
    "standardUnitKey": "H15-SA-02",
    "standardUnit": "나머지정리와 인수분해",
    "standardUnitOrder": 2,
    "content": "최고차항의 계수가 1인 삼차식 $P(x)$에 대하여 $P(2-x)$를 $(x-2)$로 나누었을 때 나머지가 2이다. $P(x)-x^{2}$은 $(x-1)(x+2)$로 나누어떨어진다고 할 때, $P(2)$의 값은? [4.5점]",
    "choices": [
      "6",
      "7",
      "8",
      "9",
      "10"
    ],
    "answer": "③",
    "solution": "[키포인트]\n나머지정리와 인수정리를 이용하여 삼차식 $P(x)$를 구성한다.\n\n조건 정리\n- $P(x)$는 최고차항 계수가 $1$인 삼차식\n- $P(2-x)$를 $x-2$로 나눈 나머지는 $2$\n- $P(x)-x^2$은 $(x-1)(x+2)$로 나누어떨어짐\n\n풀이 과정\n1. 나머지정리에 의해 $P(2-x)$ 식에 $x=2$를 대입하면 $P(0) = 2$이다.\n2. $P(x)-x^2$은 $(x-1)(x+2)$를 인수로 가지므로, $P(x)-x^2 = (x-1)(x+2)Q(x)$로 둘 수 있다.\n3. $P(x)$가 최고차항 계수가 $1$인 삼차식이므로, $Q(x)$는 형태가 $(x-k)$인 일차식이다.\n따라서 $P(x) = (x-1)(x+2)(x-k) + x^2$이다.\n4. 조건 1에서 찾은 $P(0)=2$를 대입한다.\n$P(0) = (-1)(2)(-k) + 0 = 2k = 2 \\implies k = 1$\n5. $P(x)$를 완성하면 $P(x) = (x-1)(x+2)(x-1) + x^2$이다.\n6. $P(2)$를 계산한다.\n$P(2) = (1)(4)(1) + 4 = 8$\n\n결론\n따라서 정답은 ③이다."
  },
  {
    "id": 9,
    "level": "중",
    "category": "다항식의 인수분해",
    "originalCategory": "나머지정리와 인수분해",
    "standardCourse": "고등 수학(상)",
    "standardUnitKey": "H15-SA-02",
    "standardUnit": "나머지정리와 인수분해",
    "standardUnitOrder": 2,
    "content": "다항식 $x^{2}+3xy-2x+2y^{2}-y-3$을 인수분해하면 $(x+ay+b)(x+cy+d)$가 된다. 이때, $ac+bd$의 값은? (단, $a, b, c, d$는 실수인 상수이다.) [4점]",
    "choices": [
      "$-1$",
      "$0$",
      "$1$",
      "$2$",
      "$3$"
    ],
    "answer": "①",
    "solution": "[키포인트]\n두 개 이상의 문자가 포함된 다항식은 차수가 낮은 문자에 대하여 내림차순으로 정리한 후 인수분해한다.\n\n조건 정리\n- $x^2+3xy-2x+2y^2-y-3 = (x+ay+b)(x+cy+d)$\n\n풀이 과정\n1. 주어진 식을 $x$에 대하여 내림차순으로 정리한다.\n$x^2 + (3y-2)x + (2y^2-y-3)$\n2. 상수항 부분을 먼저 인수분해한다.\n$2y^2-y-3 = (2y-3)(y+1)$\n3. 전체 식을 대각선 방법(크로스)으로 인수분해한다.\n$(2y-3) + (y+1) = 3y-2$가 되어 $x$의 계수와 일치한다.\n따라서 식은 $(x + 2y - 3)(x + y + 1)$로 인수분해된다.\n4. $(x+ay+b)(x+cy+d)$와 비교하면, $a=2, b=-3, c=1, d=1$ (또는 위치 변경)이다.\n5. $ac+bd = (2)(1) + (-3)(1) = 2 - 3 = -1$\n\n결론\n따라서 정답은 ①이다."
  },
  {
    "id": 10,
    "level": "중",
    "category": "인수정리",
    "originalCategory": "나머지정리와 인수분해",
    "standardCourse": "고등 수학(상)",
    "standardUnitKey": "H15-SA-02",
    "standardUnit": "나머지정리와 인수분해",
    "standardUnitOrder": 2,
    "content": "삼차식 $2x^{3}+ax^{2}+bx-4$가 두 일차식 $2x-1$과 $x-2$를 인수로 갖도록 상수 $a, b$를 정하고 이 식을 인수분해 했을 때의 나머지 인수를 구하면? [4점]",
    "choices": [
      "$x-1$",
      "$x+1$",
      "$x-2$",
      "$x+2$",
      "$2x+1$"
    ],
    "answer": "③",
    "solution": "[키포인트]\n인수정리를 이용하여 연립방정식을 세워 미정계수를 구하고, 조립제법으로 나머지 인수를 찾는다.\n\n조건 정리\n- $P(x) = 2x^3+ax^2+bx-4$\n- $P(1/2) = 0$, $P(2) = 0$\n\n풀이 과정\n1. $P(2) = 16 + 4a + 2b - 4 = 0 \\implies 4a + 2b = -12 \\implies 2a + b = -6$\n2. $P(1/2) = 2(1/8) + a(1/4) + b(1/2) - 4 = 0 \\implies 1/4 + a/4 + b/2 - 4 = 0$. 양변에 $4$를 곱하면 $1 + a + 2b - 16 = 0 \\implies a + 2b = 15$\n3. 연립방정식 풀이: $a = 15 - 2b$를 첫 번째 식에 대입하면 $2(15 - 2b) + b = -6 \\implies 30 - 3b = -6 \\implies 3b = 36 \\implies b=12, a=-9$.\n4. 다항식은 $2x^3 - 9x^2 + 12x - 4$이다.\n5. 조립제법을 통해 $x-2$로 나누면 몫은 $2x^2 - 5x + 2$가 되고, 이를 다시 인수분해하면 $(x-2)(2x-1)$이다.\n전체 인수분해 결과는 $(2x-1)(x-2)(x-2)$이므로 나머지 인수는 $x-2$이다.\n\n결론\n따라서 정답은 ③이다."
  },
  {
    "id": 11,
    "level": "중",
    "category": "음수의 제곱근",
    "originalCategory": "복소수",
    "standardCourse": "고등 수학(상)",
    "standardUnitKey": "H15-SA-03",
    "standardUnit": "복소수",
    "standardUnitOrder": 3,
    "content": "$\\sqrt{-2}\\sqrt{-3}+\\frac{\\sqrt{18}}{\\sqrt{-2}}-\\frac{\\sqrt{-8}}{\\sqrt{-12}}=a+bi$를 만족시키는 실수 $a, b$에 대하여 $ab$의 값은? [3.6점]",
    "choices": [
      "$-4\\sqrt{6}$",
      "$2\\sqrt{6}$",
      "$-2\\sqrt{6}$",
      "$4\\sqrt{6}$",
      "$4\\sqrt{6}$"
    ],
    "answer": "⑤",
    "solution": "[키포인트]\n음수의 제곱근 성질($\\sqrt{-a} = \\sqrt{a}i, a \\gt 0$)을 이용하여 복소수의 사칙연산을 정확히 계산한다.\n\n조건 정리\n- $\\sqrt{-2}\\sqrt{-3}+\\frac{\\sqrt{18}}{\\sqrt{-2}}-\\frac{\\sqrt{-8}}{\\sqrt{-12}}=a+bi$\n\n풀이 과정\n1. 각 항을 허수단위 $i$를 사용하여 정리한다.\n첫 번째 항: $\\sqrt{-2}\\sqrt{-3} = (\\sqrt{2}i)(\\sqrt{3}i) = \\sqrt{6}i^2 = -\\sqrt{6}$\n두 번째 항: $\\frac{\\sqrt{18}}{\\sqrt{-2}} = \\frac{3\\sqrt{2}}{\\sqrt{2}i} = \\frac{3}{i} = -3i$\n세 번째 항: $\\frac{\\sqrt{-8}}{\\sqrt{-12}} = \\frac{2\\sqrt{2}i}{2\\sqrt{3}i} = \\frac{\\sqrt{2}}{\\sqrt{3}} = \\frac{\\sqrt{6}}{3}$\n2. 전체 식을 다시 적어 계산한다.\n$-\\sqrt{6} - 3i - \\frac{\\sqrt{6}}{3} = \\left(-\\sqrt{6} - \\frac{\\sqrt{6}}{3}\\right) - 3i = -\\frac{4\\sqrt{6}}{3} - 3i$\n3. 실수부분 $a = -\\frac{4\\sqrt{6}}{3}$, 허수부분 $b = -3$이다.\n4. $ab = \\left(-\\frac{4\\sqrt{6}}{3}\\right) \\times (-3) = 4\\sqrt{6}$\n\n결론\n따라서 정답은 ⑤이다."
  },
  {
    "id": 12,
    "level": "상",
    "category": "복소수의 성질",
    "originalCategory": "복소수",
    "standardCourse": "고등 수학(상)",
    "standardUnitKey": "H15-SA-03",
    "standardUnit": "복소수",
    "standardUnitOrder": 3,
    "content": "복소수 $z$와 그 켤레복소수 $\\bar{z}$에 대하여 옳은 것만을 <보기>에서 있는 대로 고른 것은? (단, 복소수 $z$의 실수부분, 허수부분은 모두 0이 아니다.) [4.3점]\n<div class=\"question-table-wrap\">\n<table>\n  <tr>\n    <td>\n      ㄱ. $z\\bar{z}$는 실수이다.\n      ㄴ. $\\frac{z+\\bar{z}}{z\\bar{z}}$는 실수이다.\n      ㄷ. $\\omega = \\frac{1-\\sqrt{3}i}{2}$일 때, $\\omega^3+2\\omega^6 = 1$이다.\n    </td>\n  </tr>\n</table>\n</div>",
    "choices": [
      "ㄱ",
      "ㄱ, ㄴ",
      "ㄱ, ㄷ",
      "ㄴ, ㄷ",
      "ㄱ, ㄴ, ㄷ"
    ],
    "answer": "⑤",
    "solution": "[키포인트]\n복소수의 켤레 성질 및 특수한 복소수의 거듭제곱 규칙을 활용한다.\n\n조건 정리\n- $z=a+bi$ ($a, b$는 $0$이 아닌 실수)\n\n풀이 과정\nㄱ. $z\\bar{z} = (a+bi)(a-bi) = a^2+b^2$. $a, b$가 실수이므로 항상 실수이다. (참)\nㄴ. $z+\\bar{z} = 2a$ (실수), $z\\bar{z} = a^2+b^2$ ($0$이 아닌 실수). 따라서 실수 나누기 실수는 실수이다. (참)\nㄷ. $\\omega = \\frac{1-\\sqrt{3}i}{2}$에서 $2\\omega-1 = -\\sqrt{3}i$. 양변을 제곱하면 $4\\omega^2-4\\omega+1 = -3 \\implies 4\\omega^2-4\\omega+4=0 \\implies \\omega^2-\\omega+1=0$. 양변에 $(\\omega+1)$을 곱하면 $\\omega^3+1=0 \\implies \\omega^3=-1$이다.\n구하는 식은 $\\omega^3+2(\\omega^3)^2 = (-1) + 2(-1)^2 = -1 + 2 = 1$. (참)\n\n결론\n따라서 정답은 ⑤이다."
  },
  {
    "id": 13,
    "level": "중",
    "category": "이차방정식의 판별식",
    "originalCategory": "이차방정식",
    "standardCourse": "고등 수학(상)",
    "standardUnitKey": "H15-SA-04",
    "standardUnit": "이차방정식",
    "standardUnitOrder": 4,
    "content": "$x$에 대한 이차방정식 $2x^{2}-2(a+3)x+2a+4=0$이 중근을 가질 때, $a$의 값은? [3.5점]",
    "choices": [
      "$-1$",
      "$0$",
      "$1$",
      "$2$",
      "$3$"
    ],
    "answer": "①",
    "solution": "[키포인트]\n이차방정식이 중근을 가질 조건은 판별식 $D=0$임을 이용한다.\n\n조건 정리\n- 이차방정식 $2x^2-2(a+3)x+2a+4=0$이 중근을 가짐\n\n풀이 과정\n1. 짝수 판별식 $D/4$를 사용한다.\n$D/4 = (-(a+3))^2 - 2(2a+4) = 0$\n2. 식을 전개하여 정리한다.\n$a^2 + 6a + 9 - 4a - 8 = 0$\n$a^2 + 2a + 1 = 0$\n$(a+1)^2 = 0$\n3. 따라서 $a = -1$이다.\n\n결론\n따라서 정답은 ①이다."
  },
  {
    "id": 14,
    "level": "상",
    "category": "이차방정식의 근과 계수의 관계",
    "originalCategory": "이차방정식",
    "standardCourse": "고등 수학(상)",
    "standardUnitKey": "H15-SA-04",
    "standardUnit": "이차방정식",
    "standardUnitOrder": 4,
    "content": "$x$에 대한 이차방정식 $x^{2}-(4a+b)x+2ab=0$의 두 실근의 절댓값이 같고 부호가 다를 때, 나올 수 있는 실수 $ab$값들의 합은? (단, $a$는 자연수이고, 두 근의 곱은 -100 미만이 되지 않는다.) [5점]",
    "choices": [
      "$-120$",
      "$-72$",
      "$-56$",
      "$-28$",
      "$-20$"
    ],
    "answer": "③",
    "solution": "[키포인트]\n두 근의 절댓값이 같고 부호가 다르면 두 근의 합은 $0$이고 두 근의 곱은 음수임을 이용한다.\n\n조건 정리\n- 두 근의 합: $4a+b = 0$\n- 두 근의 곱: $2ab \\lt 0$\n- $a$는 자연수\n- 두 근의 곱 $\\ge -100$\n\n풀이 과정\n1. 합의 조건에서 $b = -4a$이다.\n2. 이 값을 곱의 식에 대입하면 $2a(-4a) = -8a^2$이다. 이는 $a$가 자연수일 때 항상 음수이므로 부호 조건은 성립한다.\n3. 최소 조건에서 $-8a^2 \\ge -100 \\implies a^2 \\le 12.5$이다.\n4. 이를 만족하는 자연수 $a$는 $1, 2, 3$이다.\n5. 구하고자 하는 것은 $ab$의 값들의 합이다. $ab = a(-4a) = -4a^2$이다.\n$a=1$일 때, $ab = -4(1) = -4$\n$a=2$일 때, $ab = -4(4) = -16$\n$a=3$일 때, $ab = -4(9) = -36$\n6. 모든 가능한 $ab$의 합은 $-4 + (-16) + (-36) = -56$이다.\n\n결론\n따라서 정답은 ③이다."
  },
  {
    "id": 15,
    "level": "중",
    "category": "이차함수와 직선의 위치 관계",
    "originalCategory": "이차함수",
    "standardCourse": "고등 수학(상)",
    "standardUnitKey": "H15-SA-05",
    "standardUnit": "이차함수",
    "standardUnitOrder": 5,
    "content": "$x$에 대한 이차함수 $y=x^{2}+2(2k-a)x+4k^{2}-5a+a^{2}$의 그래프가 $a$의 값에 관계없이 $x$축에 접할 때, 상수 $k$의 값은? [3.8점]",
    "choices": [
      "$-\\frac{5}{2}$",
      "$-\\frac{5}{4}$",
      "$\\frac{1}{2}$",
      "$\\frac{5}{4}$",
      "$\\frac{5}{2}$"
    ],
    "answer": "④",
    "solution": "[키포인트]\n이차함수가 $x$축에 접할 조건인 $D=0$을 적용한 후, $a$에 대한 항등식으로 식을 푼다.\n\n조건 정리\n- $y=x^2+2(2k-a)x+4k^2-5a+a^2$ 그래프가 $x$축에 접함\n- $a$의 값에 관계없이 성립\n\n풀이 과정\n1. 이차함수가 $x$축에 접하므로 $x$절편을 구하는 이차방정식의 판별식이 $0$이어야 한다. 짝수 판별식 $D/4$를 사용한다.\n$D/4 = (2k-a)^2 - (4k^2-5a+a^2) = 0$\n2. 식을 전개한다.\n$4k^2 - 4ak + a^2 - 4k^2 + 5a - a^2 = 0$\n$-4ak + 5a = 0$\n$a(5-4k) = 0$\n3. 이 등식이 '$a$의 값에 관계없이' 항상 성립해야 하므로, $a$에 대한 항등식이다.\n따라서 괄호 안의 값이 $0$이어야 한다.\n$5-4k = 0 \\implies k = \\frac{5}{4}$\n\n결론\n따라서 정답은 ④이다."
  },
  {
    "id": 16,
    "level": "중",
    "category": "이차함수",
    "originalCategory": "이차함수",
    "standardCourse": "고1 수학",
    "standardUnitKey": "H1-02-02",
    "standardUnit": "이차함수",
    "standardUnitOrder": 2,
    "content": "[그래프필요]\n다음은 $x \\lt -\\frac{1}{2}$ 또는 $x \\gt 3$일 때 $f(x) = 2x^2 - 5x - 3$이고, $-\\frac{1}{2} \\le x \\le 3$일 때 $f(x) = -2x^2 + 5x + 3$인 함수 $f(x)$의 그래프이다.\n<svg width=\"240\" height=\"140\" viewBox=\"0 0 240 140\" xmlns=\"http://www.w3.org/2000/svg\">\n  <line x1=\"20\" y1=\"100\" x2=\"220\" y2=\"100\" stroke=\"black\" stroke-width=\"1\" marker-end=\"url(#arrow)\"/>\n  <line x1=\"80\" y1=\"130\" x2=\"80\" y2=\"20\" stroke=\"black\" stroke-width=\"1\" marker-end=\"url(#arrow)\"/>\n  <path d=\"M 41.0,31.2 L 42.26,35.46 L 43.53,39.65 L 44.79,43.77 L 46.05,47.81 L 47.32,51.79 L 48.58,55.69 L 49.84,59.53 L 51.11,63.29 L 52.37,66.98 L 53.63,70.6 L 54.89,74.15 L 56.16,77.63 L 57.42,81.04 L 58.68,84.38 L 59.95,87.64 L 61.21,90.84 L 62.47,93.96 L 63.74,97.02 L 65.0,100.0\" fill=\"none\" stroke=\"black\" stroke-width=\"1.5\"/>\n  <path d=\"M 65.0,100.0 L 67.69,93.88 L 70.38,88.08 L 73.08,82.6 L 75.77,77.45 L 78.46,72.62 L 81.15,68.11 L 83.85,63.92 L 86.54,60.05 L 89.23,56.51 L 91.92,53.29 L 94.62,50.39 L 97.31,47.81 L 100.0,45.56 L 102.69,43.62 L 105.38,42.01 L 108.08,40.72 L 110.77,39.76 L 113.46,39.11 L 116.15,38.79 L 118.85,38.79 L 121.54,39.11 L 124.23,39.76 L 126.92,40.72 L 129.62,42.01 L 132.31,43.62 L 135.0,45.56 L 137.69,47.81 L 140.38,50.39 L 143.08,53.29 L 145.77,56.51 L 148.46,60.05 L 151.15,63.92 L 153.85,68.11 L 156.54,72.62 L 159.23,77.45 L 161.92,82.6 L 164.62,88.08 L 167.31,93.88 L 170.0,100.0\" fill=\"none\" stroke=\"black\" stroke-width=\"1.5\"/>\n  <path d=\"M 170.0,100.0 L 171.26,97.02 L 172.53,93.96 L 173.79,90.84 L 175.05,87.64 L 176.32,84.38 L 177.58,81.04 L 178.84,77.63 L 180.11,74.15 L 181.37,70.6 L 182.63,66.98 L 183.89,63.29 L 185.16,59.53 L 186.42,55.69 L 187.68,51.79 L 188.95,47.81 L 190.21,43.77 L 191.47,39.65 L 192.74,35.46 L 194.0,31.2\" fill=\"none\" stroke=\"black\" stroke-width=\"1.5\"/>\n  <text x=\"215\" y=\"115\" font-size=\"10px\" font-family=\"serif\">x</text>\n  <text x=\"70\" y=\"25\" font-size=\"10px\" font-family=\"serif\">y</text>\n  <text x=\"85\" y=\"115\" font-size=\"10px\" font-family=\"serif\">O</text>\n  <text x=\"65\" y=\"115\" font-size=\"9px\" text-anchor=\"middle\" font-family=\"serif\">$-\\frac{1}{2}$</text>\n  <text x=\"170\" y=\"115\" font-size=\"10px\" text-anchor=\"middle\" font-family=\"serif\">3</text>\n  <text x=\"120\" y=\"30\" font-size=\"10px\" font-family=\"serif\">y=f(x)</text>\n  <defs><marker id=\"arrow\" markerWidth=\"10\" markerHeight=\"10\" refX=\"0\" refY=\"3\" orient=\"auto\"><path d=\"M0,0 L0,6 L6,3 z\" fill=\"black\"/></marker></defs>\n</svg>\n직선 $y = 3x + k$가 위의 함수와 서로 다른 네 점에서 만나도록 하는 정수 $k$의 개수는? [4.7점]",
    "choices": [
      "1",
      "2",
      "3",
      "4",
      "5"
    ],
    "answer": "②",
    "solution": "[키포인트]\n절댓값 기호를 포함한 이차함수 그래프와 직선의 위치 관계를 파악하여 교점의 개수를 구한다.\n\n조건 정리\n- 함수 $f(x)$의 그래프와 직선 $y = 3x + k$가 서로 다른 네 점에서 만남\n\n풀이 과정\n함수 $f(x)$는 이차함수 $y = 2x^2 - 5x - 3$의 함숫값에 절댓값을 취한 $y = |2x^2 - 5x - 3|$과 같다. $x$절편은 $2x^2 - 5x - 3 = (2x+1)(x-3) = 0$에서 $x = -\\frac{1}{2}, 3$이다.\n직선 $y = 3x + k$가 $y = f(x)$와 서로 다른 네 점에서 만나려면 직선이 다음 두 가지 경계 사이에 있어야 한다.\n1. 직선이 점 $(-\\frac{1}{2}, 0)$을 지날 때:\n$0 = 3(-\\frac{1}{2}) + k \\implies k = \\frac{3}{2} = 1.5$\n이때 교점은 $(-\\frac{1}{2}, 0)$을 포함하여 $3$개이다.\n2. 직선이 위로 볼록한 부분 $y = -2x^2 + 5x + 3$에 접할 때:\n$-2x^2 + 5x + 3 = 3x + k \\implies 2x^2 - 2x + k - 3 = 0$\n이 이차방정식의 판별식이 $0$이어야 하므로,\n$D/4 = (-1)^2 - 2(k - 3) = 1 - 2k + 6 = 7 - 2k = 0 \\implies k = \\frac{7}{2} = 3.5$\n이때 교점은 접점을 포함하여 $3$개이다.\n따라서 네 점에서 만나기 위한 $k$의 범위는 $1.5 \\lt k \\lt 3.5$이다.\n이를 만족하는 정수 $k$는 $2, 3$의 $2$개이다.\n\n결론\n따라서 정답은 ②이다."
  },
  {
    "id": 17,
    "level": "중",
    "category": "이차함수",
    "originalCategory": "이차함수의 활용",
    "standardCourse": "고1 수학",
    "standardUnitKey": "H1-02-02",
    "standardUnit": "이차함수",
    "standardUnitOrder": 2,
    "content": "[도형필요]\n다음 그림과 같이 폭이 $4$m이고 높이가 $4$m인 포물선 모양의 조형물이 있다. 조형물이 지면과 만나는 두 지점을 각각 $A, B$라 하고 $B$로부터 $0.5$m 떨어진 지면 $C$에서 조형물에 레이저를 그림과 같이 접하게 쏘아 올릴 때, 레이저와 조형물이 만나는 지점의 지면으로부터의 높이 $h$의 길이는?\n<svg width=\"280\" height=\"180\" viewBox=\"0 0 280 180\" xmlns=\"http://www.w3.org/2000/svg\">\n  <line x1=\"40\" y1=\"140\" x2=\"200\" y2=\"140\" stroke=\"black\" stroke-width=\"2\"/>\n  <path d=\"M 60,140 Q 100,-20 140,140\" fill=\"none\" stroke=\"black\" stroke-width=\"1.5\"/>\n  <line x1=\"160\" y1=\"140\" x2=\"100\" y2=\"20\" stroke=\"black\" stroke-width=\"1.5\"/>\n  <line x1=\"100\" y1=\"140\" x2=\"100\" y2=\"60\" stroke=\"black\" stroke-width=\"1\" stroke-dasharray=\"3,3\"/>\n  <line x1=\"140\" y1=\"60\" x2=\"140\" y2=\"140\" stroke=\"black\" stroke-width=\"1\" stroke-dasharray=\"3,3\"/>\n  <line x1=\"100\" y1=\"60\" x2=\"140\" y2=\"60\" stroke=\"black\" stroke-width=\"1\" stroke-dasharray=\"3,3\"/>\n  <line x1=\"140\" y1=\"60\" x2=\"140\" y2=\"20\" stroke=\"black\" stroke-width=\"1\" stroke-dasharray=\"3,3\"/>\n  <path d=\"M 140,60 Q 155,90 140,140\" fill=\"none\" stroke=\"black\" stroke-width=\"1\" stroke-dasharray=\"3,3\"/>\n  <text x=\"60\" y=\"150\" font-size=\"10px\" text-anchor=\"middle\" font-family=\"serif\">A</text>\n  <text x=\"140\" y=\"150\" font-size=\"10px\" text-anchor=\"middle\" font-family=\"serif\">B</text>\n  <text x=\"160\" y=\"150\" font-size=\"10px\" text-anchor=\"middle\" font-family=\"serif\">C</text>\n  <text x=\"100\" y=\"150\" font-size=\"10px\" text-anchor=\"middle\" font-family=\"serif\">4m</text>\n  <path d=\"M 65,145 L 135,145\" fill=\"none\" stroke=\"black\" stroke-width=\"0.5\" marker-start=\"url(#arrow_l)\" marker-end=\"url(#arrow_r)\"/>\n  <text x=\"150\" y=\"160\" font-size=\"9px\" text-anchor=\"middle\" font-family=\"serif\"><tspan x=\"150\" dy=\"0\">1</tspan><tspan x=\"150\" dy=\"8\">2</tspan>m</text>\n  <line x1=\"145\" y1=\"153\" x2=\"155\" y2=\"153\" stroke=\"black\" stroke-width=\"0.5\"/>\n  <path d=\"M 143,142 L 157,142\" fill=\"none\" stroke=\"black\" stroke-width=\"0.5\" marker-start=\"url(#arrow_l)\" marker-end=\"url(#arrow_r)\"/>\n  <text x=\"120\" y=\"100\" font-size=\"10px\" text-anchor=\"middle\" font-family=\"serif\">h</text>\n  <text x=\"155\" y=\"90\" font-size=\"10px\" text-anchor=\"middle\" font-family=\"serif\">4m</text>\n  <defs>\n    <marker id=\"arrow_r\" markerWidth=\"6\" markerHeight=\"6\" refX=\"0\" refY=\"3\" orient=\"auto\"><path d=\"M0,0 L0,6 L6,3 z\" fill=\"black\"/></marker>\n    <marker id=\"arrow_l\" markerWidth=\"6\" markerHeight=\"6\" refX=\"6\" refY=\"3\" orient=\"auto\"><path d=\"M6,0 L6,6 L0,3 z\" fill=\"black\"/></marker>\n  </defs>\n</svg>",
    "choices": [
      "$\\frac{7}{3}$",
      "$\\frac{5}{2}$",
      "$3$",
      "$\\frac{10}{3}$",
      "$\\frac{7}{2}$"
    ],
    "answer": "③",
    "solution": "[키포인트]\n포물선을 좌표평면 위에 나타내어 이차함수 식을 세우고, 직선과의 접할 조건(판별식 $D=0$)을 이용한다.\n\n조건 정리\n- 포물선의 폭: $4$m, 높이: $4$m\n- B에서 $0.5$m 떨어진 C에서 접선을 그음\n\n풀이 과정\n1. 조형물의 단면을 좌표평면 위에 나타내면, 지면 $AB$의 중점을 원점으로 하고 포물선의 꼭짓점을 $(0, 4)$로 잡을 수 있다. 폭이 $4$m이므로 점 $A$는 $(-2, 0)$, 점 $B$는 $(2, 0)$이다.\n2. 포물선의 방정식을 $y = a(x+2)(x-2)$라 하면 꼭짓점 $(0, 4)$를 지나므로 $4 = a(2)(-2) \\implies a = -1$. 즉, 포물선의 방정식은 $y = -x^2 + 4$이다.\n3. 점 $B(2, 0)$에서 $0.5$m 떨어진 지점 $C$는 $(2.5, 0)$이다. 지점 $C$에서 쏜 레이저(직선)의 방정식을 $y = m(x - 2.5)$라 하자.\n4. 이 직선이 포물선 $y = -x^2 + 4$에 접하므로, 두 식을 연립한 $x^2 + mx - 2.5m - 4 = 0$의 판별식 $D$가 $0$이어야 한다.\n$D = m^2 - 4(-2.5m - 4) = m^2 + 10m + 16 = 0$\n$(m+2)(m+8) = 0 \\implies m = -2$ 또는 $m = -8$\n5. 그림의 상태에서 기울기는 음수이며, 접점의 위치를 고려할 때 $m = -2$가 적절하다. ($m = -8$인 경우는 접점의 $x$좌표가 $4$가 되어 조형물 밖의 지점이 된다.)\n6. $m = -2$일 때 접점의 $x$좌표는 중근인 $x = -\\frac{m}{2} = 1$이다.\n7. 접점의 높이 $h$는 $x = 1$일 때의 $y$값이므로 $h = -1^2 + 4 = 3$(m)이다.\n\n결론\n따라서 높이 $h$는 $3$이다."
  },
  {
    "id": 18,
    "level": "상",
    "category": "근과 계수의 관계",
    "originalCategory": "이차방정식",
    "standardCourse": "고등 수학(상)",
    "standardUnitKey": "H15-SA-04",
    "standardUnit": "이차방정식",
    "standardUnitOrder": 4,
    "content": "$x$에 대한 이차방정식 $x^{2}-4kx+4k^{2}-k+2=0$이 두 실근 $\\alpha, \\beta$를 가질 때, $\\alpha^{3}+\\beta^{3}-16k^{3}$의 최솟값은? (단, $k$는 실수이다.) [5.5점]",
    "choices": [
      "$-12$",
      "0",
      "15",
      "36",
      "96"
    ],
    "answer": "②",
    "solution": "[키포인트]\n실근 조건(판별식 $D \\ge 0$)으로 $k$의 범위를 제한한 후, 곱셈 공식의 변형으로 주어진 식을 $k$에 대한 함수로 나타내어 최솟값을 구한다.\n\n조건 정리\n- $x^2-4kx+4k^2-k+2=0$이 두 실근 $\\alpha, \\beta$를 가짐\n\n풀이 과정\n1. 실근 조건: $D/4 = (2k)^2 - (4k^2-k+2) \\ge 0 \\implies k-2 \\ge 0 \\implies k \\ge 2$\n2. 근과 계수의 관계: $\\alpha+\\beta=4k$, $\\alpha\\beta=4k^2-k+2$\n3. 식 변형:\n$\\alpha^3+\\beta^3 = (\\alpha+\\beta)^3 - 3\\alpha\\beta(\\alpha+\\beta)$\n$= (4k)^3 - 3(4k^2-k+2)(4k) = 64k^3 - 48k^3 + 12k^2 - 24k = 16k^3 + 12k^2 - 24k$\n주어진 식은 $\\alpha^3+\\beta^3 - 16k^3 = 12k^2 - 24k$가 된다.\n4. $f(k) = 12k^2 - 24k = 12(k-1)^2 - 12$ 로 두면 대칭축이 $k=1$인 이차함수이다.\n5. 조건에서 $k \\ge 2$이므로, 구간 내 최솟값은 꼭짓점이 아닌 경계값 $k=2$에서 발생한다.\n$f(2) = 12(2-1)^2 - 12 = 0$\n\n결론\n따라서 정답은 ②이다."
  },
  {
    "id": 19,
    "level": "하",
    "category": "인수분해 공식",
    "originalCategory": "다항식의 연산",
    "standardCourse": "고등 수학(상)",
    "standardUnitKey": "H15-SA-01",
    "standardUnit": "다항식의 연산",
    "standardUnitOrder": 1,
    "content": "[서술형 1번] 다음 인수분해 공식의 빈칸을 완성하고, 이를 이용하여 (6)~(8)의 다항식을 인수분해하시오. [각 0.5점, 4점]\n(1) $x^{3}+3x^{2}y+3xy^{2}+y^{3} = $\n(2) $x^{3}-3x^{2}y+3xy^{2}-y^{3} = $\n(3) $x^{2}+y^{2}+z^{2}+2xy+2yz+2zx = $\n(4) $x^{3}+y^{3} = $\n(5) $x^{3}-y^{3} = $\n(6) $x^{2}+4y^{2}+9z^{2}+4xy-12yz-6zx$\n(7) $8x^{3}-12x^{2}+6x-1$\n(8) $x^{3}-27$",
    "choices": [],
    "answer": "(1) $(x+y)^{3}$ (2) $(x-y)^{3}$ (3) $(x+y+z)^{2}$ (4) $(x+y)(x^{2}-xy+y^{2})$ (5) $(x-y)(x^{2}+xy+y^{2})$ (6) $(x+2y-3z)^{2}$ (7) $(2x-1)^{3}$ (8) $(x-3)(x^{2}+3x+9)$",
    "solution": "[키포인트]\n고등학교 과정의 기본 인수분해 공식을 정확히 암기하고 구조를 파악하여 적용한다.\n\n조건 정리\n- 주어진 다항식의 인수분해 공식을 완성하고 활용한다.\n\n풀이 과정\n기본 공식 작성:\n(1) $(x+y)^3$\n(2) $(x-y)^3$\n(3) $(x+y+z)^2$\n(4) $(x+y)(x^2-xy+y^2)$\n(5) $(x-y)(x^2+xy+y^2)$\n\n공식 적용:\n(6) $x^2 + (2y)^2 + (-3z)^2 + 2(x)(2y) + 2(2y)(-3z) + 2(-3z)(x)$의 형태이므로 3번 공식에 의해 $(x+2y-3z)^2$이다.\n(7) $(2x)^3 - 3(2x)^2(1) + 3(2x)(1)^2 - 1^3$의 형태이므로 2번 공식에 의해 $(2x-1)^3$이다.\n(8) $x^3 - 3^3$의 형태이므로 5번 공식에 의해 $(x-3)(x^2+3x+9)$이다.\n\n결론\n각 문항의 인수분해 결과는 위와 같다."
  },
  {
    "id": 20,
    "level": "상",
    "category": "나머지정리",
    "originalCategory": "나머지정리와 인수분해",
    "standardCourse": "고등 수학(상)",
    "standardUnitKey": "H15-SA-02",
    "standardUnit": "나머지정리와 인수분해",
    "standardUnitOrder": 2,
    "content": "[서술형 2번] 최고차항의 계수가 1인 삼차식 $P(x)$에 대하여 $P(1)=1$, $P(2)=4$, $P(3)=9$일 때, $P(x)$를 $(x-1)(2x-4)$로 나눈 몫과 나머지를 구하시오. [6점]",
    "choices": [],
    "answer": "몫: $\\frac{1}{2}x-1$, 나머지: $3x-2$",
    "solution": "[키포인트]\n주어진 함숫값의 규칙성을 파악하여 다항식을 구성하고, 나눗셈 항등식을 세운다.\n\n조건 정리\n- 최고차항 계수가 $1$인 삼차식 $P(x)$\n- $P(1)=1, P(2)=4, P(3)=9$\n\n풀이 과정\n1. 조건 분석: $P(1)=1^2, P(2)=2^2, P(3)=3^2$의 규칙을 보인다.\n따라서 $P(x)-x^2=0$이라는 $3$차 방정식은 $x=1, 2, 3$을 근으로 갖는다.\n2. $P(x)$ 구성: $P(x)-x^2 = (x-1)(x-2)(x-3)$ (최고차항 계수가 $1$이므로)\n$P(x) = (x-1)(x-2)(x-3) + x^2$\n3. 나머지 정리 적용: $P(x)$를 $(x-1)(2x-4) = 2(x-1)(x-2)$로 나눈 몫을 $Q(x)$, 나머지를 $ax+b$라 하자.\n$P(x) = 2(x-1)(x-2)Q(x) + ax+b$\n$x=1$ 대입: $P(1) = a+b = 1$\n$x=2$ 대입: $P(2) = 2a+b = 4$\n연립하여 풀면 $a=3, b=-2$이므로 나머지는 $3x-2$이다.\n4. 몫 구하기:\n$(x-1)(x-2)(x-3)+x^2 = 2(x-1)(x-2)Q(x) + 3x-2$\n$2(x-1)(x-2)Q(x) = (x-1)(x-2)(x-3) + x^2 - 3x + 2$\n우변의 뒤쪽 식을 인수분해하면 $x^2-3x+2 = (x-1)(x-2)$이다.\n$2(x-1)(x-2)Q(x) = (x-1)(x-2)(x-3) + (x-1)(x-2) = (x-1)(x-2)(x-3+1) = (x-1)(x-2)(x-2)$\n양변을 $2(x-1)(x-2)$로 나누면 $Q(x) = \\frac{x-2}{2} = \\frac{1}{2}x-1$이다.\n\n결론\n몫은 $\\frac{1}{2}x-1$, 나머지는 $3x-2$이다."
  },
  {
    "id": 21,
    "level": "중",
    "category": "이차방정식의 근과 계수의 관계",
    "originalCategory": "이차방정식",
    "standardCourse": "고등 수학(상)",
    "standardUnitKey": "H15-SA-04",
    "standardUnit": "이차방정식",
    "standardUnitOrder": 4,
    "content": "[서술형 3번] 봄이와 가을이가 이차방정식 $x^{2}+ax+b=0$ ($a, b$는 실수)의 근을 구하려고 한다. 그런데 봄이는 $x$의 계수를 잘못 보고 풀어 두 근 $1+3i, 1-3i$를 얻었고, 가을이는 상수항을 잘못 보고 풀어 두 근 $2+2i, 2-2i$를 얻었다. 이차방정식 $x^{2}+ax+b=0$의 올바른 두 근을 구하시오. [5점]",
    "choices": [],
    "answer": "$2 \\pm \\sqrt{6}i$",
    "solution": "[키포인트]\n잘못 본 계수 외의 올바른 계수들은 두 근의 합과 곱을 통해 각각 추출하여 온전한 이차방정식을 세운다.\n\n조건 정리\n- 봄이는 상수항을 바르게 봄 (근: $1+3i, 1-3i$)\n- 가을이는 $x$의 계수를 바르게 봄 (근: $2+2i, 2-2i$)\n\n풀이 과정\n1. 봄이는 $x$의 계수 $a$를 잘못 보았으므로, 상수항 $b$는 올바르게 보았다.\n두 근의 곱: $b = (1+3i)(1-3i) = 1 - 9i^2 = 10$\n2. 가을이는 상수항 $b$를 잘못 보았으므로, $x$의 계수 $a$는 올바르게 보았다.\n두 근의 합: $-a = (2+2i) + (2-2i) = 4 \\implies a = -4$\n3. 올바른 이차방정식은 $x^2 - 4x + 10 = 0$이다.\n4. 근의 공식을 이용하여 올바른 근을 구한다.\n$x = \\frac{-(-2) \\pm \\sqrt{(-2)^2 - 1(10)}}{1} = 2 \\pm \\sqrt{4-10} = 2 \\pm \\sqrt{-6} = 2 \\pm \\sqrt{6}i$\n\n결론\n따라서 올바른 두 근은 $2 \\pm \\sqrt{6}i$이다."
  },
  {
    "id": 1,
    "level": "중",
    "category": "이차함수",
    "originalCategory": "이차함수의 활용",
    "standardCourse": "중3 수학",
    "standardUnitKey": "M3-04",
    "standardUnit": "이차함수",
    "standardUnitOrder": 4,
    "content": "[도형필요]\n세 개의 다른 크기의 정사각형을 다음 그림과 같이 이어 붙여 길이가 $14$m인 한쪽 벽에 딱 맞게 배치하려고 한다. 세 정사각형의 넓이의 합의 최솟값을 구하시오.\n(단, 가장 작은 정사각형의 한 변의 길이는 가장 큰 정사각형의 한 변의 길이의 절반이다.)\n<svg width=\"280\" height=\"160\" viewBox=\"0 0 280 160\" xmlns=\"http://www.w3.org/2000/svg\">\n  <rect x=\"30\" y=\"40\" width=\"90\" height=\"90\" fill=\"#d3d3d3\" stroke=\"black\" stroke-width=\"1\"/>\n  <rect x=\"120\" y=\"40\" width=\"75\" height=\"75\" fill=\"#d3d3d3\" stroke=\"black\" stroke-width=\"1\"/>\n  <rect x=\"195\" y=\"40\" width=\"45\" height=\"45\" fill=\"#d3d3d3\" stroke=\"black\" stroke-width=\"1\"/>\n  <path d=\"M 30,35 L 240,35\" stroke=\"black\" stroke-width=\"1\" stroke-dasharray=\"3,3\" marker-start=\"url(#arrow_l)\" marker-end=\"url(#arrow_r)\"/>\n  <text x=\"135\" y=\"30\" font-size=\"10px\" text-anchor=\"middle\" font-family=\"serif\">14 m</text>\n  <defs>\n    <marker id=\"arrow_r\" markerWidth=\"6\" markerHeight=\"6\" refX=\"0\" refY=\"3\" orient=\"auto\"><path d=\"M0,0 L0,6 L6,3 z\" fill=\"black\"/></marker>\n    <marker id=\"arrow_l\" markerWidth=\"6\" markerHeight=\"6\" refX=\"6\" refY=\"3\" orient=\"auto\"><path d=\"M6,0 L6,6 L0,3 z\" fill=\"black\"/></marker>\n  </defs>\n</svg>",
    "choices": [],
    "answer": "$70$m$^2$",
    "solution": "[키포인트]\n주어진 조건을 한 문자에 대한 이차식으로 나타낸 후 완전제곱식을 이용하여 최솟값을 구한다.\n\n조건 정리\n- 세 정사각형이 $14$m인 벽에 맞게 배치됨\n- 가장 작은 정사각형의 한 변 = 가장 큰 정사각형 한 변의 $\\frac{1}{2}$\n\n풀이 과정\n1. 세 정사각형의 한 변의 길이를 각각 $a, b, c$라고 하자.\n가장 큰 정사각형의 한 변의 길이를 $a$, 가장 작은 정사각형의 한 변의 길이를 $c$라고 하면 문제의 조건에 의해 $c = \\frac{1}{2}a$이다.\n2. 세 정사각형이 $14$m인 벽에 딱 맞게 배치되므로\n$a + b + c = 14$\n$a + b + \\frac{1}{2}a = 14$\n$\\frac{3}{2}a + b = 14 \\implies b = 14 - \\frac{3}{2}a$\n3. 세 정사각형의 넓이의 합을 $S$라고 하면\n$S = a^2 + b^2 + c^2 = a^2 + (14 - \\frac{3}{2}a)^2 + (\\frac{1}{2}a)^2$\n$S = a^2 + (196 - 42a + \\frac{9}{4}a^2) + \\frac{1}{4}a^2$\n$S = a^2 + \\frac{10}{4}a^2 - 42a + 196$\n$S = \\frac{7}{2}a^2 - 42a + 196$\n$S = \\frac{7}{2}(a^2 - 12a) + 196$\n$S = \\frac{7}{2}(a - 6)^2 - 126 + 196$\n$S = \\frac{7}{2}(a - 6)^2 + 70$\n4. 따라서 $a=6$일 때, 넓이의 합의 최솟값은 $70$이다.\n이때 변의 길이는 $a=6, b=5, c=3$으로 모두 다른 크기라는 조건을 만족한다.\n\n결론\n최종 정답은 $70$m$^2$이다."
  }
];