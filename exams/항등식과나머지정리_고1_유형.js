window.examTitle = "항등식과나머지정리_고1_유형";
window.questionBank = [
  {
    "id": 1,
    "content": "두 다항식 $A, B$에 대하여 $2A + B = 2x^2 + 5xy + 10y^2$, $A - B = x^2 + xy - 4y^2$일 때, 다항식 $A - 2B$를 구하시오. [2024 부영여고 1-1 중간 01번]",
    "choices": [
      "$x^2 - 5y^2$",
      "$x^2 - 10y^2$",
      "$2x^2 + 5y^2$",
      "$x^2 + 2xy - y^2$",
      "$x^2 - 12y^2$"
    ],
    "answer": "②",
    "category": "다항식의 연산",
    "originalCategory": "다항식의 연산",
    "standardCourse": "수학(상)",
    "standardUnitKey": "HH15-SA-01",
    "standardUnit": "다항식의 연산",
    "standardUnitOrder": 1,
    "solution": "$(1)\\ 2A + B = 2x^2 + 5xy + 10y^2$\\n$(2)\\ A - B = x^2 + xy - 4y^2$\\n$(1)+(2) \\implies 3A = 3x^2 + 6xy + 6y^2 \\implies A = x^2 + 2xy + 2y^2$\\n$(2) \\implies B = A - (x^2 + xy - 4y^2) = xy + 6y^2$\\n$\\therefore A - 2B = (x^2 + 2xy + 2y^2) - 2(xy + 6y^2) = x^2 - 10y^2$",
    "level": "중"
  },
  {
    "id": 2,
    "content": "$x^2 + \\frac{1}{x^2} = 7$일 때, $x^3 + \\frac{1}{x^3}$의 값을 구하시오. (단, $x > 0$) [2024 부영여고 1-1 중간 05번]",
    "choices": [
      "14",
      "16",
      "18",
      "20",
      "22"
    ],
    "answer": "③",
    "category": "곱셈 공식의 변형",
    "originalCategory": "곱셈 공식의 변형",
    "standardCourse": "수학(상)",
    "standardUnitKey": "HH15-SA-01",
    "standardUnit": "다항식의 연산",
    "standardUnitOrder": 1,
    "solution": "$(x + \\frac{1}{x})^2 = x^2 + \\frac{1}{x^2} + 2 = 7 + 2 = 9$\\n$x > 0 \\implies x + \\frac{1}{x} = 3$\\n$x^3 + \\frac{1}{x^3} = (x + \\frac{1}{x})^3 - 3(x + \\frac{1}{x})$\\n$\\implies 3^3 - 3(3) = 18$\\n$\\therefore 18$",
    "level": "중"
  },
  {
    "id": 3,
    "content": "다항식 $6x^3 - x^2 - 5x + 3$을 $3x - 2$로 나누었을 때 몫을 $Q(x)$, 나머지를 $R$이라 할 때, $Q(1) + R$의 값을 구하시오. [2024 부영여고 1-1 중간 08번]",
    "choices": [
      "1",
      "2",
      "3",
      "4",
      "5"
    ],
    "answer": "③",
    "category": "나머지 정리 (몫의 보정)",
    "originalCategory": "나머지 정리 (몫의 보정)",
    "standardCourse": "수학(상)",
    "standardUnitKey": "HH15-SA-02",
    "standardUnit": "항등식과 나머지정리",
    "standardUnitOrder": 2,
    "solution": "<<b>[Logical Anchor]</b> 조립제법은 $x-\\frac{2}{3}$ 기준이므로, $3x-2$의 몫은 $\\frac{1}{3}$ 보정 필수.\\n$x = \\frac{2}{3}$ 조립제법 $\\implies$ 몫 계수 $6, 3, -3$, 나머지 $1$\\n$6x^3 - x^2 - 5x + 3 = (x - \\frac{2}{3})(6x^2 + 3x - 3) + 1$\\n$\\implies (3x - 2)(2x^2 + x - 1) + 1$\\n$\\therefore Q(x) = 2x^2 + x - 1,\\ R = 1$\\n$Q(1) = 2 + 1 - 1 = 2 \\implies Q(1) + R = 3$",
    "level": "중"
  },
  {
    "id": 4,
    "content": "다항식 $2x^3 - 9x^2 - 4x + 7$을 인수분해 하면 $(x+1)(2x^2 + bx + c)$일 때, $b+c$의 값을 구하시오. [2024 부영여고 1-1 중간 11번]",
    "choices": [
      "-6",
      "-4",
      "-2",
      "2",
      "4"
    ],
    "answer": "②",
    "category": "인수분해와 조립제법",
    "originalCategory": "인수분해와 조립제법",
    "standardCourse": "수학(상)",
    "standardUnitKey": "HH15-SA-01",
    "standardUnit": "다항식의 연산",
    "standardUnitOrder": 1,
    "solution": "$x = -1$ 조립제법 $\\implies$ 계수 $2, -9, -4, 7$\\n$\\implies$ 몫 $2, -11, 7,\\ R=0$\\n$2x^3 - 9x^2 - 4x + 7 = (x+1)(2x^2 - 11x + 7)$\\n$\\implies b = -11,\\ c = 7$\\n$\\therefore b+c = -4$",
    "level": "중"
  },
  {
    "id": 5,
    "content": "$a+b+c=3, a^2+b^2+c^2=13, abc=-7$일 때 $(a+b)(b+c)(c+a)$의 값을 구하시오. [2024 부영여고 1-1 중간 13번]",
    "choices": [
      "-3",
      "-1",
      "1",
      "3",
      "5"
    ],
    "answer": "③",
    "category": "다항식 전개 응용",
    "originalCategory": "다항식 전개 응용",
    "standardCourse": "수학(상)",
    "standardUnitKey": "RRAW-다항식전개응용",
    "standardUnit": "다항식 전개 응용",
    "standardUnitOrder": 999,
    "solution": "<<b>[Logical Anchor]</b> 3개 항의 곱은 $a+b+c=3$ 대입 치환으로 전개 차수 하향.\\n$a+b=3-c,\\ b+c=3-a,\\ c+a=3-b$\\n$(3-a)(3-b)(3-c) = 3^3 - (a+b+c)3^2 + (ab+bc+ca)3 - abc \\cdots (1)$\\n$(a+b+c)^2 = a^2+b^2+c^2 + 2(ab+bc+ca) \\implies 9 = 13 + 2(ab+bc+ca) \\implies ab+bc+ca = -2$\\n$(1) \\implies 27 - 3(9) + (-2)(3) - (-7) = 1$\\n$\\therefore 1$",
    "level": "중"
  },
  {
    "id": 6,
    "content": "모든 자연수 $n$에 대하여 $x^n(x^2+ax+b)$를 $(x-2)^2$으로 나누었을 때의 나머지가 $2^n(x-2)$일 때, $a+b$의 값을 구하시오. [2024 부영여고 1-1 중간 15번]",
    "choices": [
      "-2",
      "-1",
      "0",
      "1",
      "2"
    ],
    "answer": "②",
    "category": "완전제곱식 나눗셈",
    "originalCategory": "완전제곱식 나눗셈",
    "standardCourse": "수학(상)",
    "standardUnitKey": "HH15-SA-01",
    "standardUnit": "다항식의 연산",
    "standardUnitOrder": 1,
    "solution": "<<b>[Logical Anchor]</b> 완전제곱식 나눗셈은 첫 대입 후 공통인수 $(x-2)$ 약분이 필수.\\n$x^n(x^2+ax+b) = (x-2)^2 Q(x) + 2^n(x-2) \\cdots (1)$\\n$x=2$ 대입 $\\implies 2^n(4+2a+b) = 0 \\implies b = -2a-4$\\n$x^2+ax-2a-4 = (x-2)(x+a+2)$\\n$(1)$에 대입 후 $(x-2)$ 약분 $\\implies x^n(x+a+2) = (x-2)Q(x) + 2^n$\\n$x=2$ 대입 $\\implies 2^n(a+4) = 2^n \\implies a = -3$\\n$b = -2(-3)-4 = 2$\\n$\\therefore a+b = -1$",
    "level": "중"
  },
  {
    "id": 7,
    "content": "다항식 $f(x) = x^3 - x^2 + ax + b$를 $x^2-2x-2$로 나누었을 때의 몫을 $Q(x)$, 나머지를 $R(x)$라 하자. $R(2)=6$이고, $f(x)$는 $Q(x)$로 나누어떨어질 때, $f(3)$의 값을 구하시오. [2024 부영여고 1-1 중간 서술형 1번]",
    "choices": [
      "  ",
      "  ",
      "  ",
      "  ",
      "  "
    ],
    "answer": "12",
    "category": "서술형 (나눗셈의 관계)",
    "originalCategory": "서술형 (나눗셈의 관계)",
    "standardCourse": "수학(상)",
    "standardUnitKey": "RRAW-서술형(나눗셈의관계)",
    "standardUnit": "서술형 (나눗셈의 관계)",
    "standardUnitOrder": 999,
    "solution": "<<b>[Logical Anchor]</b> 3차 $\\div$ 2차이므로 $Q(x)$는 1차. 최고차항 비교 $Q(x)=x+1$ 설정.\\n$f(x) = (x^2-2x-2)(x+1) + R(x) = x^3-x^2-4x-2 + R(x)$\\n$R(x) = f(x) - (x^3-x^2-4x-2) = (a+4)x + (b+2)$\\n$Q(x)$로 나누어떨어짐 $\\implies f(-1)=0 \\implies -a+b=2$\\n$R(2)=6 \\implies 2(a+4)+b+2=6 \\implies 2a+b=-4$\\n연립 $\\implies a=-2,\\ b=0$\\n$f(x) = x^3-x^2-2x$\\n$\\therefore f(3) = 27-9-6 = 12$",
    "level": "중"
  },
  {
    "id": 8,
    "content": "두 다항식 $A, B$에 대하여 $2A + B = 3x^2 - 2xy - y^2$, $A - B = -x^2 + 4xy + 5y^2$일 때, $A + 2B = ax^2 + bxy + cy^2$이다. $a+b+c$의 값을 구하시오. [2024 한영고 1-1 중간 01번]",
    "choices": [
      "-10",
      "-8",
      "-6",
      "4",
      "8"
    ],
    "answer": "②",
    "category": "다항식의 연산",
    "originalCategory": "다항식의 연산",
    "standardCourse": "수학(상)",
    "standardUnitKey": "HH15-SA-01",
    "standardUnit": "다항식의 연산",
    "standardUnitOrder": 1,
    "solution": "$(1)\\ 2A + B = 3x^2 - 2xy - y^2$\\n$(2)\\ A - B = -x^2 + 4xy + 5y^2$\\n$(1)+(2) \\implies 3A = 2x^2 + 2xy + 4y^2 \\implies A = \\frac{2}{3}x^2 + \\frac{2}{3}xy + \\frac{4}{3}y^2$\\n$(2) \\implies B = \\frac{5}{3}x^2 - \\frac{10}{3}xy - \\frac{11}{3}y^2$\\n$A + 2B = 4x^2 - 6xy - 6y^2$\\n$\\implies a=4,\\ b=-6,\\ c=-6$\\n$\\therefore a+b+c = -8$",
    "level": "중"
  },
  {
    "id": 9,
    "content": "$x+y=4, xy=2$일 때, $x^3 + y^3$의 값을 구하시오. [2024 한영고 1-1 중간 04번]",
    "choices": [
      "32",
      "36",
      "40",
      "44",
      "48"
    ],
    "answer": "③",
    "category": "세제곱 공식",
    "originalCategory": "세제곱 공식",
    "standardCourse": "수학(상)",
    "standardUnitKey": "RRAW-세제곱공식",
    "standardUnit": "세제곱 공식",
    "standardUnitOrder": 999,
    "solution": "$x^3 + y^3 = (x+y)^3 - 3xy(x+y)$\\n$\\implies 4^3 - 3(2)(4)$\\n$= 64 - 24 = 40$\\n$\\therefore 40$",
    "level": "중"
  },
  {
    "id": 10,
    "content": "등식 $a(x-1)(x+1) + bx(x-1) + cx(x+1) = 2x^2 + 3x + 4$가 $x$에 대한 항등식일 때, $-a+2b+2c$의 값을 구하시오. [2024 한영고 1-1 중간 08번]",
    "choices": [
      "12",
      "14",
      "16",
      "18",
      "20"
    ],
    "answer": "③",
    "category": "항등식 (수치대입법)",
    "originalCategory": "항등식 (수치대입법)",
    "standardCourse": "수학(상)",
    "standardUnitKey": "HH15-SA-02",
    "standardUnit": "항등식과 나머지정리",
    "standardUnitOrder": 2,
    "solution": "항등식 수치대입법:\\n$x=0 \\implies -a = 4 \\implies a = -4$\\n$x=1 \\implies 2c = 2+3+4 \\implies c = \\frac{9}{2}$\\n$x=-1 \\implies 2b = 2-3+4 \\implies b = \\frac{3}{2}$\\n$\\therefore -a + 2b + 2c = -(-4) + 3 + 9 = 16$",
    "level": "중"
  },
  {
    "id": 11,
    "content": "다항식 $x^2 - xy - 2y^2 - x - 7y - 6$이 $(x+ay-3)(x+by+c)$로 인수분해 될 때, $-2a+3b+c$의 값을 구하시오. [2024 한영고 1-1 중간 09번]",
    "choices": [
      "5",
      "7",
      "9",
      "11",
      "13"
    ],
    "answer": "③",
    "category": "인수분해 (내림차순)",
    "originalCategory": "인수분해 (내림차순)",
    "standardCourse": "수학(상)",
    "standardUnitKey": "HH15-SA-03",
    "standardUnit": "인수분해",
    "standardUnitOrder": 3,
    "solution": "<<b>[Logical Anchor]</b> 복잡한 식의 인수분해는 한 문자에 대한 내림차순 정리가 원칙.\\n$x^2 - (y+1)x - (2y^2+7y+6)$\\n$\\implies x^2 - (y+1)x - (2y+3)(y+2)$\\n$\\implies (x - (2y+3))(x + (y+2))$\\n$\\implies (x - 2y - 3)(x + y + 2)$\\n$\\implies a=-2,\\ b=1,\\ c=2$\\n$\\therefore -2(-2) + 3(1) + 2 = 9$",
    "level": "중"
  },
  {
    "id": 12,
    "content": "다항식 $f(x)$를 $x+2$로 나누었을 때 몫이 $Q(x)$, 나머지가 $-4$이고 $Q(x)$를 $x-3$으로 나누었을 때 나머지가 $3$이다. $f(x)$를 $x^2-x-6$으로 나누었을 때의 나머지 $R(x)$에 대하여 $R(1)$의 값을 구하시오. [2024 한영고 1-1 중간 12번]",
    "choices": [
      "1",
      "3",
      "5",
      "7",
      "9"
    ],
    "answer": "③",
    "category": "나머지 정리 (몫의 관계)",
    "originalCategory": "나머지 정리 (몫의 관계)",
    "standardCourse": "수학(상)",
    "standardUnitKey": "HH15-SA-02",
    "standardUnit": "항등식과 나머지정리",
    "standardUnitOrder": 2,
    "solution": "<<b>[Logical Anchor]</b> $x^2-x-6=(x+2)(x-3)$이므로 $f(-2)$와 $f(3)$의 값이 모두 필요함.\\n$f(x) = (x+2)Q(x) - 4 \\cdots (1)$\\n$Q(3) = 3 \\implies (1)$에 대입 $\\implies f(3) = (3+2)Q(3) - 4 = 11$\\n$f(-2) = -4$\\n$f(x) = (x^2-x-6)Q'(x) + ax+b = (x+2)(x-3)Q'(x) + ax+b$\\n$\\implies -2a+b = -4,\\ 3a+b = 11$\\n연립 $\\implies 5a = 15 \\implies a=3,\\ b=2$\\n$\\implies R(x) = 3x+2$\\n$\\therefore R(1) = 5$",
    "level": "중"
  },
  {
    "id": 13,
    "content": "최고차항 계수가 $1$인 이차식 $f(x)$가 $x+2$로 나누어떨어진다. $f(x^2)$을 $f(x)$로 나누었을 때의 나머지가 $10x+2$일 때, $f(2)$의 값을 구하시오. [2024 한영고 1-1 중간 15번]",
    "choices": [
      "-25",
      "-20",
      "-15",
      "15",
      "20"
    ],
    "answer": "②",
    "category": "항등식과 함숫값",
    "originalCategory": "항등식과 함숫값",
    "standardCourse": "수학(상)",
    "standardUnitKey": "HH15-SA-02",
    "standardUnit": "항등식과 나머지정리",
    "standardUnitOrder": 2,
    "solution": "<<b>[Logical Anchor]</b> $f(x)$가 이차식이므로 $f(x)=(x+2)(x-k)$로 설정 후 수치대입법 적용.\\n$f(x^2) = f(x)Q(x) + 10x+2$\\n$x=-2$ 대입 $\\implies f(4) = f(-2)Q(-2) + 10(-2)+2 = -18$\\n$f(x) = (x+2)(x-k) \\implies f(4) = 6(4-k) = -18$\\n$\\implies 4-k = -3 \\implies k=7$\\n$f(x) = (x+2)(x-7)$\\n$\\therefore f(2) = (4)(-5) = -20$",
    "level": "중"
  },
  {
    "id": 14,
    "content": "등식 $x^3 - 4x^2 + 3x - 5 = a(x-2)^3 + b(x-2)^2 + c(x-2) + d$가 항등식일 때, $ab + cd$의 값을 구하시오. [2024 한영고 1-1 중간 17번]",
    "choices": [
      "5",
      "7",
      "9",
      "11",
      "13"
    ],
    "answer": "③",
    "category": "연속 조립제법",
    "originalCategory": "연속 조립제법",
    "standardCourse": "수학(상)",
    "standardUnitKey": "HH15-SA-01",
    "standardUnit": "다항식의 연산",
    "standardUnitOrder": 1,
    "solution": "<<b>[Logical Anchor]</b> 동일한 일차식의 거듭제곱 꼴로 식을 전개할 때는 연속 조립제법이 가장 빠르고 정확함.\\n$x=2$로 연속 조립제법 시행:\\n$1\\quad -4\\quad 3\\quad -5 \\implies$ 몫 $1\\quad -2\\quad -1,\\ R=-7 \\implies d=-7$\\n$1\\quad -2\\quad -1 \\implies$ 몫 $1\\quad 0,\\ R=-1 \\implies c=-1$\\n$1\\quad 0 \\implies$ 몫 $1,\\ R=2 \\implies b=2$\\n마지막 몫 $1 \\implies a=1$\\n$\\therefore ab+cd = (1)(2) + (-1)(-7) = 9$",
    "level": "중"
  },
  {
    "id": 15,
    "content": "다항식 $2x^3 - 4x^2 + 5$를 $x^2 - 3x - 1$로 나눈 (가)몫의 상수항, (나)몫의 일차항, (다)나머지일 때, (가)+(나)+(다)를 구하시오. [2024 한영고 1-1 중간 서답형 1번]",
    "choices": [
      "  ",
      "  ",
      "  ",
      "  ",
      "  "
    ],
    "answer": "10x+9",
    "category": "다항식의 나눗셈",
    "originalCategory": "다항식의 나눗셈",
    "standardCourse": "수학(상)",
    "standardUnitKey": "HH15-SA-01",
    "standardUnit": "다항식의 연산",
    "standardUnitOrder": 1,
    "solution": "직접 나눗셈 시행:\\n$2x^3 - 4x^2 + 5 = (x^2 - 3x - 1)(2x + 2) + 8x + 7$\\n$\\implies$ 몫: $2x+2$, 나머지: $8x+7$\\n(가)$=2$, (나)$=2x$, (다)$=8x+7$\\n$\\therefore (가)+(나)+(다) = 10x+9$",
    "level": "중"
  },
  {
    "id": 16,
    "content": "다항식 $x^4 + 5x^2 + 9$를 인수분해 하시오. [2024 여천고 1-1 중간 10번]",
    "choices": [
      "  ",
      "  ",
      "  ",
      "  ",
      "  "
    ],
    "answer": "$(x^2+x+3)(x^2-x+3)$",
    "category": "복이차식 인수분해",
    "originalCategory": "복이차식 인수분해",
    "standardCourse": "수학(상)",
    "standardUnitKey": "HH15-SA-03",
    "standardUnit": "인수분해",
    "standardUnitOrder": 3,
    "solution": "<<b>[Logical Anchor]</b> $x^2=t$ 치환으로 인수분해가 안 되는 복이차식은 $A^2 - B^2$ 꼴로 식 변형.\\n$x^4 + 5x^2 + 9$\\n$\\implies (x^4 + 6x^2 + 9) - x^2$\\n$\\implies (x^2+3)^2 - x^2$\\n$\\implies (x^2+3+x)(x^2+3-x)$\\n$\\therefore (x^2+x+3)(x^2-x+3)$",
    "level": "중"
  },
  {
    "id": 17,
    "content": "다항식 $f(x)$를 $x-1$로 나눈 나머지 $3$, $x+2$로 나눈 나머지 $-3$일 때, $f(x)$를 $x^2+x-2$로 나눈 나머지 $R(3)$의 값을 구하시오. [2024 여천고 1-1 중간 12번]",
    "choices": [
      "3",
      "5",
      "7",
      "9",
      "11"
    ],
    "answer": "③",
    "category": "나머지 정리",
    "originalCategory": "나머지 정리",
    "standardCourse": "수학(상)",
    "standardUnitKey": "HH15-SA-02",
    "standardUnit": "항등식과 나머지정리",
    "standardUnitOrder": 2,
    "solution": "$f(1) = 3,\\ f(-2) = -3$\\n$f(x) = (x-1)(x+2)Q(x) + ax+b$\\n$x=1 \\implies a+b = 3$\\n$x=-2 \\implies -2a+b = -3$\\n연립 $\\implies 3a = 6 \\implies a=2,\\ b=1$\\n$\\implies R(x) = 2x+1$\\n$\\therefore R(3) = 7$",
    "level": "중"
  },
  {
    "id": 18,
    "content": "다항식 $f(x)$를 $(x-1)^2$으로 나눈 나머지 $x+2$, $x-2$로 나눈 나머지 $4$일 때, $f(x)$를 $(x-1)^2(x-2)$로 나눈 나머지 $R(3)$의 값을 구하시오. [2023 중앙여고 1-1 중간 13번]",
    "choices": [
      "1",
      "3",
      "5",
      "7",
      "9"
    ],
    "answer": "③",
    "category": "나머지 정리 (완전제곱식)",
    "originalCategory": "나머지 정리 (완전제곱식)",
    "standardCourse": "수학(상)",
    "standardUnitKey": "HH15-SA-01",
    "standardUnit": "다항식의 연산",
    "standardUnitOrder": 1,
    "solution": "<<b>[Logical Anchor]</b> 3차식으로 나눈 나머지 $R(x)$는 2차식이므로, $(x-1)^2$으로 나눈 나머지가 $x+2$임을 이용하여 $R(x)=a(x-1)^2+x+2$로 설정.\\n$f(x) = (x-1)^2(x-2)Q(x) + a(x-1)^2 + x+2$\\n$x=2$ 대입 $\\implies f(2) = a(1)^2 + 4$\\n$f(2) = 4 \\implies a+4 = 4 \\implies a=0$\\n$\\implies R(x) = x+2$\\n$\\therefore R(3) = 5$",
    "level": "중"
  },
  {
    "id": 19,
    "content": "$x+y=3, x^2+y^2=7$일 때 $x^4+y^4$의 값을 구하시오. [2023 중앙여고 1-1 중간 04번]",
    "choices": [
      "43",
      "45",
      "47",
      "49",
      "51"
    ],
    "answer": "③",
    "category": "지수 법칙 응용",
    "originalCategory": "지수 법칙 응용",
    "standardCourse": "대수",
    "standardUnitKey": "HH22-C-02",
    "standardUnit": "지수법칙",
    "standardUnitOrder": 2,
    "solution": "$(x+y)^2 = x^2+y^2 + 2xy \\implies 9 = 7 + 2xy \\implies xy=1$\\n$x^4+y^4 = (x^2+y^2)^2 - 2x^2y^2$\\n$\\implies 7^2 - 2(1)^2 = 49 - 2 = 47$\\n$\\therefore 47$",
    "level": "중"
  },
  {
    "id": 20,
    "content": "다항식 $x^3 + ax + b$가 $(x-1)^2$으로 나누어떨어질 때, $a-b$의 값을 구하시오. [2023 중앙여고 1-1 중간 09번]",
    "choices": [
      "-7",
      "-5",
      "-3",
      "3",
      "5"
    ],
    "answer": "②",
    "category": "연속 조립제법",
    "originalCategory": "연속 조립제법",
    "standardCourse": "수학(상)",
    "standardUnitKey": "HH15-SA-01",
    "standardUnit": "다항식의 연산",
    "standardUnitOrder": 1,
    "solution": "<<b>[Logical Anchor]</b> $(x-1)^2$으로 나누어떨어지면 $x=1$로 두 번 연속 조립제법 시 나머지가 모두 $0$.\\n$x=1$ 첫 번째 조립제법:\\n$1\\quad 0\\quad a\\quad b \\implies$ 몫 $1\\quad 1\\quad a+1,\\ R=a+b+1$\\n$\\implies a+b+1 = 0 \\cdots (1)$\\n$x=1$ 두 번째 조립제법 (몫을 다시 나눔):\\n$1\\quad 1\\quad a+1 \\implies$ 몫 $1\\quad 2,\\ R=a+3$\\n$\\implies a+3 = 0 \\implies a = -3$\\n$(1) \\implies -3+b+1=0 \\implies b = 2$\\n$\\therefore a-b = -5$",
    "level": "중"
  },
  {
    "id": 21,
    "content": "다항식 $(x^2 - 4x + 3)(x^2 - 4x - 2) - 6$을 인수분해 하시오. [2024 한영고 1-1 중간 11번]",
    "choices": [
      "  ",
      "  ",
      "  ",
      "  ",
      "  "
    ],
    "answer": "$(x-2)^2(x^2-4x-3)$",
    "category": "치환 인수분해",
    "originalCategory": "치환 인수분해",
    "standardCourse": "수학(상)",
    "standardUnitKey": "HH15-SA-03",
    "standardUnit": "인수분해",
    "standardUnitOrder": 3,
    "solution": "<<b>[Logical Anchor]</b> 공통부분인 $x^2-4x$를 치환하여 전개 차수를 낮춤.\\n$x^2-4x = X$ 치환\\n$(X+3)(X-2) - 6 = X^2 + X - 12 = (X+4)(X-3)$\\n원래 식 대입 $\\implies (x^2-4x+4)(x^2-4x-3)$\\n$\\therefore (x-2)^2(x^2-4x-3)$",
    "level": "중"
  },
  {
    "id": 22,
    "content": "$x+y=1, x^2+y^2=3$일 때, $x^5+y^5$의 값을 구하시오. [2024 한영고 1-1 중간 14번]",
    "choices": [
      "7",
      "9",
      "11",
      "13",
      "15"
    ],
    "answer": "③",
    "category": "고차식 변형",
    "originalCategory": "고차식 변형",
    "standardCourse": "수학(상)",
    "standardUnitKey": "RRAW-고차식변형",
    "standardUnit": "고차식 변형",
    "standardUnitOrder": 999,
    "solution": "<<b>[Logical Anchor]</b> 차수가 높은 변형식은 기본 대칭식 $x+y$와 $xy$ 도출이 최우선.\\n$x^2+y^2 = (x+y)^2 - 2xy \\implies 3 = 1^2 - 2xy \\implies xy = -1$\\n$x^3+y^3 = (x+y)^3 - 3xy(x+y) = 1^3 - 3(-1)(1) = 4$\\n$x^5+y^5 = (x^2+y^2)(x^3+y^3) - x^2y^2(x+y)$\\n$\\implies (3)(4) - (-1)^2(1) = 12 - 1 = 11$\\n$\\therefore 11$",
    "level": "중"
  },
  {
    "id": 23,
    "content": "다항식 $f(x)$를 $x^2+1$로 나누었을 때 나머지가 $x+1$이고, $(x-1)^2$으로 나누어떨어지는 3차식이다. $f(0)=2$일 때 $f(2)$를 구하시오. [2024 충무고 1-1 중간 14번]",
    "choices": [
      "-14",
      "-12",
      "10",
      "12",
      "14"
    ],
    "answer": "②",
    "category": "미정계수와 나눗셈",
    "originalCategory": "미정계수와 나눗셈",
    "standardCourse": "수학(상)",
    "standardUnitKey": "HH15-SA-02",
    "standardUnit": "항등식과 나머지정리",
    "standardUnitOrder": 2,
    "solution": "<<b>[Logical Anchor]</b> 3차식을 2차식으로 나눈 몫은 1차식이므로 $f(x)=(x^2+1)(ax+b)+x+1$로 설정.\\n$f(0) = 2 \\implies b+1 = 2 \\implies b = 1$\\n$f(x)$는 $(x-1)^2$으로 나누어떨어짐 $\\implies f(1) = 0$\\n$f(1) = 2(a+1) + 2 = 0 \\implies 2a+4 = 0 \\implies a = -2$\\n$f(x) = (-2x+1)(x^2+1) + x+1$\\n$\\therefore f(2) = (-3)(5) + 3 = -12$",
    "level": "중"
  },
  {
    "id": 24,
    "content": "$2x^3 - 5x^2 + 5x + 4$를 $x-2$로 나누었을 때의 몫과 나머지를 구하시오. [2024 충무고 1-1 중간 08번]",
    "choices": [
      "  ",
      "  ",
      "  ",
      "  ",
      "  "
    ],
    "answer": "몫: $2x^2-x+3$, 나머지: 10",
    "category": "조립제법",
    "originalCategory": "조립제법",
    "standardCourse": "수학(상)",
    "standardUnitKey": "HH15-SA-01",
    "standardUnit": "다항식의 연산",
    "standardUnitOrder": 1,
    "solution": "$x=2$ 조립제법 $\\implies$ 계수 $2, -5, 5, 4$\\n$\\implies$ 몫 $2, -1, 3,\\ R=10$\\n$\\therefore$ 몫: $2x^2-x+3$, 나머지: $10$",
    "level": "중"
  },
  {
    "id": 25,
    "content": "$2024^{10}$을 $2023$으로 나누었을 때의 나머지를 구하시오. [2024 충무고 1-1 중간 12번]",
    "choices": [
      "1",
      "20",
      "23",
      "2022",
      "2023"
    ],
    "answer": "①",
    "category": "숫자의 나눗셈",
    "originalCategory": "숫자의 나눗셈",
    "standardCourse": "수학(상)",
    "standardUnitKey": "RRAW-숫자의나눗셈",
    "standardUnit": "숫자의 나눗셈",
    "standardUnitOrder": 999,
    "solution": "$x=2024$ 치환\\n$x^{10} = (x-1)Q(x) + R$\\n$x=1$ 대입 $\\implies R = 1^{10} = 1$\\n$\\therefore 1$",
    "level": "중"
  },
  {
    "id": 26,
    "content": "다항식 $f(x)$를 $(x-1)^2$으로 나눈 나머지는 $2x-1$이고, $x+1$로 나눈 나머지는 $1$이다. $f(x)$를 $(x-1)^2(x+1)$로 나눈 나머지 $R(2)$를 구하시오. [2023 여천고 1-1 중간 14번]",
    "choices": [
      "1",
      "4",
      "7",
      "10",
      "13"
    ],
    "answer": "②",
    "category": "나머지 정리 심화",
    "originalCategory": "나머지 정리 심화",
    "standardCourse": "수학(상)",
    "standardUnitKey": "HH15-SA-02",
    "standardUnit": "항등식과 나머지정리",
    "standardUnitOrder": 2,
    "solution": "<<b>[Logical Anchor]</b> 3차식으로 나눈 나머지 $R(x)$는 2차식이므로, 앞선 2차식의 나머지를 활용해 $R(x)=a(x-1)^2+2x-1$로 설정.\\n$f(x) = (x-1)^2(x+1)Q(x) + a(x-1)^2 + 2x-1$\\n$f(-1) = 1 \\implies a(-2)^2 + 2(-1) - 1 = 1$\\n$\\implies 4a - 3 = 1 \\implies a = 1$\\n$R(x) = (x-1)^2 + 2x-1$\\n$\\therefore R(2) = (1)^2 + 4 - 1 = 4$",
    "level": "중"
  },
  {
    "id": 27,
    "content": "$x^{20} + x^{15} + x^{10} + x^5$를 $x^2-1$로 나누었을 때의 나머지 $R(2)$를 구하시오. [2023 충무고 1-1 중간 16번]",
    "choices": [
      "2",
      "4",
      "6",
      "8",
      "10"
    ],
    "answer": "③",
    "category": "수치대입법",
    "originalCategory": "수치대입법",
    "standardCourse": "수학(상)",
    "standardUnitKey": "HH15-SA-02",
    "standardUnit": "항등식과 나머지정리",
    "standardUnitOrder": 2,
    "solution": "$f(x) = x^{20} + x^{15} + x^{10} + x^5 = (x-1)(x+1)Q(x) + ax+b$\\n$x=1$ 대입 $\\implies a+b = 4 \\cdots (1)$\\n$x=-1$ 대입 $\\implies -a+b = 1 - 1 + 1 - 1 = 0 \\cdots (2)$\\n연립 $\\implies a=2,\\ b=2$\\n$R(x) = 2x+2$\\n$\\therefore R(2) = 6$",
    "level": "중"
  },
  {
    "id": 28,
    "content": "$f(x)$를 $x^2-3x+2$로 나눈 나머지는 $4x-1$, $x^2-4x+3$으로 나눈 나머지는 $x+5$일 때 $f(x)$를 $x^2-5x+6$으로 나눈 나머지를 구하시오. [2024 부영여고 1-1 중간 12번]",
    "choices": [
      "  ",
      "  ",
      "  ",
      "  ",
      "  "
    ],
    "answer": "x+5",
    "category": "나머지 정리의 조합",
    "originalCategory": "나머지 정리의 조합",
    "standardCourse": "수학(상)",
    "standardUnitKey": "HH15-SA-02",
    "standardUnit": "항등식과 나머지정리",
    "standardUnitOrder": 2,
    "solution": "<<b>[Logical Anchor]</b> 구하고자 하는 나머지의 기준식 $x^2-5x+6=(x-2)(x-3)$이므로 $f(2)$와 $f(3)$의 함숫값이 필요.\\n$f(x)$를 $(x-1)(x-2)$로 나눈 나머지 $4x-1 \\implies f(2) = 4(2)-1 = 7$\\n$f(x)$를 $(x-1)(x-3)$으로 나눈 나머지 $x+5 \\implies f(3) = 3+5 = 8$\\n$f(x) = (x-2)(x-3)Q(x) + ax+b$\\n$\\implies 2a+b = 7,\\ 3a+b = 8$\\n연립 $\\implies a=1,\\ b=5$\\n$\\therefore R(x) = x+5$",
    "level": "중"
  },
  {
    "id": 29,
    "content": "$x-y=2, xy=3$일 때, $x^3-y^3$의 값을 구하시오. [2023 중앙여고 1-1 중간 05번]",
    "choices": [
      "20",
      "22",
      "24",
      "26",
      "28"
    ],
    "answer": "④",
    "category": "세제곱 변형",
    "originalCategory": "세제곱 변형",
    "standardCourse": "수학(상)",
    "standardUnitKey": "RRAW-세제곱변형",
    "standardUnit": "세제곱 변형",
    "standardUnitOrder": 999,
    "solution": "$x^3-y^3 = (x-y)^3 + 3xy(x-y)$\\n$\\implies 2^3 + 3(3)(2)$\\n$= 8 + 18 = 26$\\n$\\therefore 26$",
    "level": "중"
  },
  {
    "id": 30,
    "content": "등식 $x^2-x-2 = a(x-1)^2 + b(x-1) + c$가 $x$에 대한 항등식일 때, $a+b+c$의 값을 구하시오. [2024 한영고 1-1 중간 10번]",
    "choices": [
      "-2",
      "-1",
      "0",
      "1",
      "2"
    ],
    "answer": "③",
    "category": "항등식의 성질",
    "originalCategory": "항등식의 성질",
    "standardCourse": "수학(상)",
    "standardUnitKey": "HH15-SA-02",
    "standardUnit": "항등식과 나머지정리",
    "standardUnitOrder": 2,
    "solution": "구하고자 하는 $a+b+c$ 꼴을 만들기 위해 우변의 괄호 안이 $1$이 되는 $x=2$를 대입.\\n$x=2$ 대입 $\\implies 2^2 - 2 - 2 = a(1)^2 + b(1) + c$\\n$\\implies 4 - 4 = a+b+c$\\n$\\therefore a+b+c = 0$",
    "level": "중"
  },
  {
    "id": 31,
    "content": "삼각형의 세 변의 길이 $a, b, c$에 대하여 $a^3+b^3+c^3-3abc=0$이 성립할 때, 어떤 삼각형인가? [2023 여천고 1-1 중간 서술형 2번]",
    "choices": [
      "정삼각형",
      "이등변삼각형",
      "직각삼각형",
      "직각이등변삼각형",
      "둔각삼각형"
    ],
    "answer": "①",
    "category": "인수분해와 삼각형",
    "originalCategory": "인수분해와 삼각형",
    "standardCourse": "수학(상)",
    "standardUnitKey": "HH15-SA-03",
    "standardUnit": "인수분해",
    "standardUnitOrder": 3,
    "solution": "$a^3+b^3+c^3-3abc = \\frac{1}{2}(a+b+c)\\{(a-b)^2+(b-c)^2+(c-a)^2\\} = 0$\\n$a, b, c$는 변의 길이이므로 $a+b+c \\n eq 0$\\n$\\implies (a-b)^2+(b-c)^2+(c-a)^2 = 0$\\n$\\implies a=b=c$\\n$\\therefore 정삼각형$",
    "level": "중"
  },
  {
    "id": 32,
    "content": "다항식 $f(x)$를 $x^2+1$로 나누었을 때 몫이 $x-1$이고 나머지가 $2x+1$이다. $f(2)$의 값을 구하시오. [2023 충무고 1-1 중간 서술형 1번]",
    "choices": [
      "6",
      "8",
      "10",
      "12",
      "14"
    ],
    "answer": "③",
    "category": "나머지 정리 기초",
    "originalCategory": "나머지 정리 기초",
    "standardCourse": "수학(상)",
    "standardUnitKey": "HH15-SA-02",
    "standardUnit": "항등식과 나머지정리",
    "standardUnitOrder": 2,
    "solution": "$f(x) = (x^2+1)(x-1) + 2x+1$\\n$f(2) = (2^2+1)(2-1) + 2(2)+1$\\n$\\implies (5)(1) + 5 = 10$\\n$\\therefore 10$",
    "level": "중"
  }
];
