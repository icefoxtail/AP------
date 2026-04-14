window.examTitle = "21_왕운중2_1학기_중간_중2";

window.questionBank = [
  {
    "id": 1,
    "level": "하",
    "category": "유한소수의 판별",
    "content": "다음 분수 중에서 소수로 나타내면 유한소수인 것을 구하면? [4점]",
    "choices": [
      "$\\frac{5}{14}$",
      "$\\frac{20}{28}$",
      "$\\frac{1}{14}$",
      "$\\frac{7}{3 \\times 5^2}$",
      "$\\frac{36}{2 \\times 3^2 \\times 5}$"
    ],
    "answer": "⑤",
    "solution": "⑤ $\\frac{36}{2 \\times 3^2 \\times 5} = \\frac{36}{90} = \\frac{2}{5} \\implies$ 분모의 소인수가 $2$와 $5$뿐이므로 유한소수이다."
  },
  {
    "id": 2,
    "level": "하",
    "category": "순환소수의 이해",
    "content": "다음 순환소수 $x=0.252525\\dots$에 대한 설명 중 옳은 것을 구하면? [3점]",
    "choices": [
      "순환마디에 점을 찍어 나타내면 $x=0.\\dot{2}\\dot{5}$이다.",
      "$100x - x = 25$ 이다.",
      "순환마디는 $2525$이다.",
      "$x=\\frac{25}{90}$",
      "$x$는 유한소수이다."
    ],
    "answer": "①",
    "solution": "$x = 0.252525\\dots$의 순환마디는 $25$이다.\\n$\\implies$ 순환마디에 점을 찍어 나타내면 $0.\\dot{2}\\dot{5}$이다.\\n$\\therefore$ ①"
  },
  {
    "id": 3,
    "level": "하",
    "category": "순환소수의 표현",
    "content": "다음 순환소수를 순환마디에 점을 찍어 바르게 나타낸 것을 구하면? [4점]",
    "choices": [
      "$3.0272727\\dots = 3.0\\dot{2}\\dot{7}$",
      "$1.3464646\\dots = 1.\\dot{3}4\\dot{6}$",
      "$-2.454545\\dots = 2.\\dot{4}\\dot{5}$",
      "$0.232323\\dots = 0.2\\dot{3}$",
      "$0.104104104\\dots = 0.\\dot{1}0\\dot{4}$"
    ],
    "answer": "①",
    "solution": "① $3.0272727\\dots$의 순환마디는 $27$이므로 $3.0\\dot{2}\\dot{7}$이 올바른 표현이다.\\n$\\therefore$ ①"
  },
  {
    "id": 4,
    "level": "중",
    "category": "유리수와 소수 관계",
    "content": "다음 보기의 친구들의 대화를 읽고 틀리게 말한 친구를 찾아보면? [4점]<br><div class='box'>[보기]<br>승훈: 유한소수와 순환소수는 모두 유리수야.<br>준영: 순환소수가 아닌 무한소수는 분수로 나타낼 수 없어.<br>성오: 정수가 아닌 유리수는 모두 유한소수로 나타낼 수 있어.<br>민주: 무한소수 중에서 순환소수가 아닌 것도 있어.<br>영현: 순환소수에서 한없이 되풀이되는 가장 짧은 한 부분을 순환마디라고 해.</div>",
    "choices": [
      "승훈",
      "준영",
      "성오",
      "민주",
      "영현"
    ],
    "answer": "③",
    "solution": "정수가 아닌 유리수는 유한소수 또는 순환소수로 나타낼 수 있다.\\n$\\implies$ 순환소수로만 나타낼 수 있는 유리수가 존재하므로 성오의 설명은 틀렸다.\\n$\\therefore$ ③"
  },
  {
    "id": 5,
    "level": "중",
    "category": "순환소수와 역수",
    "content": "$[x]$를 $x$의 역수라고 할 때, $[1.\\dot{2}] + [0.2\\dot{4}]$의 값을 구하면? [4점]",
    "choices": [
      "$\\frac{54}{11}$",
      "$\\frac{50}{11}$",
      "$\\frac{48}{11}$",
      "$\\frac{46}{11}$",
      "$\\frac{42}{11}$"
    ],
    "answer": "①",
    "solution": "$1.\\dot{2} = \\frac{12-1}{9} = \\frac{11}{9} \\implies [1.\\dot{2}] = \\frac{9}{11}$\\n$0.2\\dot{4} = \\frac{24-2}{90} = \\frac{22}{90} = \\frac{11}{45} \\implies [0.2\\dot{4}] = \\frac{45}{11}$\\n$\\implies [1.\\dot{2}] + [0.2\\dot{4}] = \\frac{9}{11} + \\frac{45}{11} = \\frac{54}{11}$\\n$\\therefore$ ①"
  },
  {
    "id": 6,
    "level": "중",
    "category": "순환소수의 자릿수",
    "content": "$5.4\\dot{9}$의 소수점 아래 100번째 수와 $1.02\\dot{4}1\\dot{5}$의 100번째 수 의 합을 구하면? [5점]",
    "choices": [
      "6",
      "7",
      "8",
      "9",
      "10"
    ],
    "answer": "⑤",
    "solution": "$5.4\\dot{9}$의 소수점 아래 2번째부터는 계속 $9$가 나오므로 100번째 수는 $9$이다.\\n$1.02\\dot{4}1\\dot{5}$의 순환마디는 $415$이고 길이는 $3$이다.\\n소수점 아래 첫째, 둘째 자리를 제외하면 $100 - 2 = 98$번째 자리의 수를 구해야 한다.\\n$98 \\div 3 = 32 \\dots 2$ 이므로 순환마디의 두 번째 숫자인 $1$이다.\\n$\\implies 9 + 1 = 10$\\n$\\therefore$ ⑤"
  },
  {
    "id": 7,
    "level": "상",
    "category": "순환소수와 분수",
    "content": "$7 + \\frac{3}{5} + \\frac{3}{50} + \\frac{3}{500} + \\frac{3}{5000} + \\dots = \\frac{a}{b}$ 일 때, $a, b$는 서로소이다. 이 때, $a-b$를 구하면? [5점]",
    "choices": [
      "19",
      "20",
      "21",
      "22",
      "23"
    ],
    "answer": "②",
    "solution": "$7 + 0.6 + 0.06 + 0.006 + 0.0006 + \\dots = 7.\\dot{6}$\\n$7.\\dot{6} = \\frac{76-7}{9} = \\frac{69}{9} = \\frac{23}{3}$\\n$\\implies a=23, b=3$\\n$\\implies a-b = 23 - 3 = 20$\\n$\\therefore$ ②"
  },
  {
    "id": 8,
    "level": "중",
    "category": "유한소수가 되는 조건",
    "content": "분수 $\\frac{A}{2^3 \\times 3 \\times 11}$를 소수로 나타내면 유한소수가 된다. 이 때, $A$가 될 수 있는 두 자리 자연수를 작은 수부터 나열했을 때 두 번째 수가 될 수 있는 것을 구하면? [4점]",
    "choices": [
      "3",
      "11",
      "33",
      "66",
      "99"
    ],
    "answer": "④",
    "solution": "유한소수가 되려면 분모의 소인수 중 $3$과 $11$이 약분되어야 하므로 $A$는 $3 \\times 11 = 33$의 배수여야 한다.\\n두 자리 자연수 중 $33$의 배수는 $33, 66, 99$이다.\\n작은 수부터 나열할 때 두 번째 수는 $66$이다.\\n$\\therefore$ ④"
  },
  {
    "id": 9,
    "level": "하",
    "category": "식의 계산",
    "content": "다음 중 옳은 것을 구하면? [3점]",
    "choices": [
      "$a \\div (b \\times c) = \\frac{ab}{c}$",
      "$a \\div (b \\div c) = \\frac{ac}{b}$",
      "$a \\times (b \\div c) = \\frac{a}{bc}$",
      "$(a \\div b) \\times c = \\frac{b}{ac}$",
      "$(a \\div b) \\div c = \\frac{ac}{b}$"
    ],
    "answer": "②",
    "solution": "② $a \\div (b \\div c) = a \\div \\frac{b}{c} = a \\times \\frac{c}{b} = \\frac{ac}{b}$\\n① $a \\div (b \\times c) = \\frac{a}{bc}$\\n③ $a \\times (b \\div c) = \\frac{ab}{c}$\\n④ $(a \\div b) \\times c = \\frac{ac}{b}$\\n⑤ $(a \\div b) \\div c = \\frac{a}{bc}$\\n$\\therefore$ ②"
  },
  {
    "id": 10,
    "level": "하",
    "category": "지수법칙",
    "content": "다음 중 옳은 것을 구하면? [3점]",
    "choices": [
      "$(a^3b)^2 = a^3b^2$",
      "$(-xy^3)^2 = -x^2y^6$",
      "$\\left(-\\frac{y^2z^3}{x^2}\\right)^2 = \\frac{y^4z^6}{x^4}$",
      "$\\left(\\frac{c}{ab^2}\\right)^3 = \\frac{c^3}{ab^6}$",
      "$\\left(-\\frac{2x^2}{3y}\\right)^3 = -\\frac{8x^6}{9y^3}$"
    ],
    "answer": "③",
    "solution": "③ $\\left(-\\frac{y^2z^3}{x^2}\\right)^2 = \\frac{(-1)^2(y^2)^2(z^3)^2}{(x^2)^2} = \\frac{y^4z^6}{x^4}$\\n① $(a^3b)^2 = a^6b^2$\\n② $(-xy^3)^2 = x^2y^6$\\n④ $\\left(\\frac{c}{ab^2}\\right)^3 = \\frac{c^3}{a^3b^6}$\\n⑤ $\\left(-\\frac{2x^2}{3y}\\right)^3 = -\\frac{8x^6}{27y^3}$\\n$\\therefore$ ③"
  },
  {
    "id": 11,
    "level": "중",
    "category": "다항식의 계산",
    "content": "$A=(8x^4+12x^3-32x^2) \\div (-2x)^2$, $B=(3x^2-2x-1)-2x(x-1)$ 일 때, $2A-3(B+2C)=x^2-6x+5$를 만족하는 다항식 $C$를 구하면? [3점]",
    "choices": [
      "$x-2$",
      "$2x-3$",
      "$3x-4$",
      "$4x-5$",
      "$5x-6$"
    ],
    "answer": "②",
    "solution": "$A = (8x^4+12x^3-32x^2) \\div 4x^2 = 2x^2+3x-8$\\n$B = 3x^2-2x-1-2x^2+2x = x^2-1$\\n$2A-3(B+2C) = 2(2x^2+3x-8) - 3(x^2-1+2C) = 4x^2+6x-16 - 3x^2+3 - 6C = x^2+6x-13 - 6C$\\n$x^2+6x-13 - 6C = x^2-6x+5 \\implies -6C = -12x+18 \\implies C = 2x-3$\\n$\\therefore$ ②"
  },
  {
    "id": 12,
    "level": "중",
    "category": "다항식의 계산",
    "content": "$3x - [x - 3x^2 - \\{2x - 4x^2 + (x^2-x)\\}]$ 를 간단히 구하면? [4점]",
    "choices": [
      "$6x^2+x$",
      "$6x^2+3x$",
      "$3x$",
      "$-6x^2-3x$",
      "$-6x^2-x$"
    ],
    "answer": "③",
    "solution": "중괄호 안을 먼저 계산하면: $2x - 4x^2 + x^2 - x = -3x^2 + x$\\n대괄호 안을 계산하면: $x - 3x^2 - (-3x^2 + x) = x - 3x^2 + 3x^2 - x = 0$\\n전체 식: $3x - 0 = 3x$\\n$\\therefore$ ③"
  },
  {
    "id": 13,
    "level": "중",
    "category": "지수법칙",
    "content": "다음 $\\Box$ 안에 들어갈 알맞은 수 중 가장 큰 것을 구하면? [4점]",
    "choices": [
      "$(a^2)^3=a^\\Box$",
      "$(x^4)^2 \\div x^3=x^\\Box$",
      "$x \\times y^4 \\times (x^3)^2=x^\\Box y^4$",
      "$\\left(-\\frac{b^3}{a^2}\\right)^4 = \\frac{b^{12}}{a^\\Box}$",
      "$(x^4)^3 \\div x^4 \\div (x^3)^2 = x^\\Box$"
    ],
    "answer": "④",
    "solution": "① $(a^2)^3 = a^6 \\implies \\Box = 6$\\n② $(x^4)^2 \\div x^3 = x^8 \\div x^3 = x^5 \\implies \\Box = 5$\\n③ $x \\times y^4 \\times (x^3)^2 = x \\times y^4 \\times x^6 = x^7 y^4 \\implies \\Box = 7$\\n④ $\\left(-\\frac{b^3}{a^2}\\right)^4 = \\frac{b^{12}}{a^8} \\implies \\Box = 8$\\n⑤ $(x^4)^3 \\div x^4 \\div (x^3)^2 = x^{12} \\div x^4 \\div x^6 = x^2 \\implies \\Box = 2$\\n따라서 가장 큰 수는 $8$이다.\\n$\\therefore$ ④"
  },
  {
    "id": 14,
    "level": "중",
    "category": "단항식의 계산",
    "content": "$\\Box \\div (-3a^3b^2)^3 = \\frac{1}{3}ab^2$일 때, $\\Box$ 안에 알맞은 식을 구하면? [4점]",
    "choices": [
      "$-9a^{10}b^8$",
      "$9a^{10}b^8$",
      "$-\\frac{1}{9}a^{10}b^8$",
      "$-\\frac{1}{9}a^8b^4$",
      "$9a^8b^{10}$"
    ],
    "answer": "①",
    "solution": "$\\Box \\div (-27a^9b^6) = \\frac{1}{3}ab^2$\\n$\\Box = \\frac{1}{3}ab^2 \\times (-27a^9b^6) = -9a^{10}b^8$\\n$\\therefore$ ①"
  },
  {
    "id": 15,
    "level": "상",
    "category": "도형과 다항식",
    "content": "그림과 같은 직사각형 ABCD에서 삼각형 AEF의 넓이를 구하면? [5점]<br><div style=\\"text-align: center; margin: 10px 0;\\"><svg width=\\"160\\" height=\\"120\\" viewBox=\\"0 0 160 120\\" xmlns=\\"http://www.w3.org/2000/svg\\"><rect x=\\"20\\" y=\\"20\\" width=\\"120\\" height=\\"80\\" fill=\\"none\\" stroke=\\"black\\" stroke-width=\\"1.5\\"/><line x1=\\"20\\" y1=\\"20\\" x2=\\"60\\" y2=\\"100\\" stroke=\\"black\\" stroke-width=\\"1.5\\"/><line x1=\\"60\\" y1=\\"100\\" x2=\\"140\\" y2=\\"73\\" stroke=\\"black\\" stroke-width=\\"1.5\\"/><line x1=\\"140\\" y1=\\"73\\" x2=\\"20\\" y2=\\"20\\" stroke=\\"black\\" stroke-width=\\"1.5\\"/><text x=\\"10\\" y=\\"15\\" font-size=\\"10\\" font-family=\\"sans-serif\\">A</text><text x=\\"10\\" y=\\"105\\" font-size=\\"10\\" font-family=\\"sans-serif\\">B</text><text x=\\"145\\" y=\\"105\\" font-size=\\"10\\" font-family=\\"sans-serif\\">C</text><text x=\\"145\\" y=\\"15\\" font-size=\\"10\\" font-family=\\"sans-serif\\">D</text><text x=\\"55\\" y=\\"115\\" font-size=\\"10\\" font-family=\\"sans-serif\\">E</text><text x=\\"145\\" y=\\"78\\" font-size=\\"10\\" font-family=\\"sans-serif\\">F</text><text x=\\"65\\" y=\\"15\\" font-size=\\"10\\" font-family=\\"sans-serif\\">5a+b</text><text x=\\"0\\" y=\\"60\\" font-size=\\"10\\" font-family=\\"sans-serif\\">3b</text><text x=\\"35\\" y=\\"115\\" font-size=\\"10\\" font-family=\\"sans-serif\\">2a</text><text x=\\"145\\" y=\\"92\\" font-size=\\"10\\" font-family=\\"sans-serif\\">b</text></svg></div>",
    "choices": [
      "$\\frac{5}{2}ab + \\frac{1}{2}b^2$",
      "$\\frac{5}{2}ab + \\frac{3}{2}b^2$",
      "$\\frac{7}{2}ab + \\frac{1}{2}b^2$",
      "$\\frac{9}{2}ab + \\frac{3}{2}b^2$",
      "$\\frac{11}{2}ab + \\frac{3}{2}b^2$"
    ],
    "answer": "⑤",
    "solution": "직사각형 ABCD의 전체 넓이에서 주변 3개의 직각삼각형 넓이를 빼어 $\\triangle AEF$의 넓이를 구한다.\\n전체 넓이: $3b \\times (5a+b) = 15ab+3b^2$\\n$\\triangle ABE$ 넓이: $\\frac{1}{2} \\times 2a \\times 3b = 3ab$\\n$\\triangle ECF$ 넓이: $\\frac{1}{2} \\times (5a+b-2a) \\times b = \\frac{1}{2} \\times (3a+b) \\times b = \\frac{3}{2}ab+\\frac{1}{2}b^2$\\n$\\triangle FDA$ 넓이: $\\frac{1}{2} \\times (5a+b) \\times (3b-b) = \\frac{1}{2} \\times (5a+b) \\times 2b = 5ab+b^2$\\n$\\triangle AEF = (15ab+3b^2) - \\left(3ab + \\frac{3}{2}ab+\\frac{1}{2}b^2 + 5ab+b^2\\right)$\\n$= (15ab+3b^2) - \\left(\\frac{19}{2}ab + \\frac{3}{2}b^2\\right) = \\frac{11}{2}ab + \\frac{3}{2}b^2$\\n$\\therefore$ ⑤\\n\\n**[Figure]**\\n$AB \\perp BC$, $BC \\perp CD$, $CD \\perp DA$"
  },
  {
    "id": 16,
    "level": "상",
    "category": "자릿수 결정",
    "content": "$3^2 \\times 2^8 \\times 5^9$이 $n$자리의 자연수일 때 $2^{n-7}$의 값을 구하면? [5점]",
    "choices": [
      "$1$",
      "$2$",
      "$4$",
      "$8$",
      "$16$"
    ],
    "answer": "④",
    "solution": "$3^2 \\times 2^8 \\times 5^9 = 3^2 \\times 2^8 \\times 5^8 \\times 5 = 9 \\times 5 \\times (2 \\times 5)^8 = 45 \\times 10^8$\\n$45$는 2자리 수이고 뒤에 $0$이 $8$개 붙으므로 전체 자릿수는 $2+8=10$자리이다.\\n$\\implies n = 10$\\n구하는 값: $2^{10-7} = 2^3 = 8$\\n$\\therefore$ ④"
  },
  {
    "id": 17,
    "level": "중",
    "category": "지수법칙 응용",
    "content": "$2^{a+3} + 2^{a+2} = 96$, $(5^{b-1}+5^{b-1}+5^{b-1}+5^{b-1}+5^{b-1}) \\times 25^b = 25^6$일 때, $a+b$의 값을 구하면? [5점]",
    "choices": [
      "1",
      "3",
      "4",
      "7",
      "12"
    ],
    "answer": "④",
    "solution": "$2^{a+3} + 2^{a+2} = 2^{a+2}(2+1) = 3 \\times 2^{a+2}$\\n$3 \\times 2^{a+2} = 96 \\implies 2^{a+2} = 32 = 2^5 \\implies a+2=5 \\implies a=3$\\n$(5^{b-1}+5^{b-1}+5^{b-1}+5^{b-1}+5^{b-1}) = 5 \\times 5^{b-1} = 5^b$\\n$5^b \\times 25^b = 5^b \\times (5^2)^b = 5^b \\times 5^{2b} = 5^{3b}$\\n$5^{3b} = 25^6 = (5^2)^6 = 5^{12} \\implies 3b=12 \\implies b=4$\\n$\\implies a+b = 3+4 = 7$\\n$\\therefore$ ④"
  },
  {
    "id": 18,
    "level": "하",
    "category": "부등식의 정의",
    "content": "다음 보기 중에서 부등식인 것이 모두 몇 개인인지 구하면? [3점]<br><div class='box'>[보기]<br>㉠ $x+10>0$<br>㉡ $2x-7$<br>㉢ $2+8=10$<br>㉣ $3x-5>9$<br>㉤ $9x=-4x+5$<br>㉥ $2+7>3-1$<br>㉦ $2c+1 \\le 5c-1$</div>",
    "choices": [
      "3",
      "4",
      "5",
      "6",
      "7"
    ],
    "answer": "②",
    "solution": "부등식은 부등호($>, <, \\ge, \\le$)가 있는 식이다.\\n㉠ 부등식 (O)\\n㉡ 다항식 (X)\\n㉢ 등식 (X)\\n㉣ 부등식 (O)\\n㉤ 등식(방정식) (X)\\n㉥ 부등식 (O)\\n㉦ 부등식 (O)\\n따라서 부등식은 ㉠, ㉣, ㉥, ㉦으로 모두 4개이다.\\n$\\therefore$ ②"
  },
  {
    "id": 19,
    "level": "중",
    "category": "부등식의 해",
    "content": "$x$의 값이 $-1, 0, 1, 2, 3$일 때, 부등식 $3(x+1)>4x+1$을 참이 되게 하는 모든 $x$의 값의 합을 구하면? [4점]",
    "choices": [
      "$-2$",
      "$-1$",
      "0",
      "2",
      "4"
    ],
    "answer": "③",
    "solution": "$3(x+1) > 4x+1 \\implies 3x+3 > 4x+1 \\implies -x > -2 \\implies x < 2$\\n주어진 $x$의 값 중 $2$보다 작은 수는 $-1, 0, 1$이다.\\n합을 구하면 $-1 + 0 + 1 = 0$\\n$\\therefore$ ③"
  },
  {
    "id": 20,
    "level": "중",
    "category": "부등식의 성질",
    "content": "$-2 \\le \\frac{x}{3} < 4$일 때, $2x-3$의 값 중 가장 큰 정수의 값을 구하면? [4점]",
    "choices": [
      "17",
      "18",
      "19",
      "20",
      "21"
    ],
    "answer": "④",
    "solution": "$-2 \\le \\frac{x}{3} < 4$의 각 변에 $3$을 곱하면 $-6 \\le x < 12$\\n각 변에 $2$를 곱하면 $-12 \\le 2x < 24$\\n각 변에서 $3$을 빼면 $-15 \\le 2x-3 < 21$\\n$2x-3$의 값 중 가장 큰 정수는 $20$이다.\\n$\\therefore$ ④"
  },
  {
    "id": 21,
    "level": "중",
    "category": "순환소수와 분수",
    "content": "[서술형 1]<br>다음 물음에 만족하는 값을 각각 구하시오. [4점]<br>(1) $\\frac{8}{15}$를 소수로 나타낼 때, 순환마디를 구하시오. [2점]<br>(2) $0.\\dot{2}\\dot{7}$를 기약분수로 나타내면 $\\frac{a}{11}$이다. 이 때, $a$의 값을 구하시오. [2점]",
    "answer": "(1) 3 (2) 3",
    "solution": "(1) $\\frac{8}{15} = 0.5333\\dots = 0.5\\dot{3} \\implies$ 순환마디는 $3$이다.\\n(2) $0.\\dot{2}\\dot{7} = \\frac{27}{99} = \\frac{3}{11}$\\n$\\implies \\frac{a}{11} = \\frac{3}{11} \\implies a=3$\\n$\\therefore$ (1) 3 (2) 3"
  },
  {
    "id": 22,
    "level": "상",
    "category": "순환소수와 분수",
    "content": "[서술형 2]<br>다음 보기를 만족하는 분수 $\\frac{b}{a}$에서 $b$가 될 수 있는 것을 모두 더한 값을 구하시오. [5점]<br><div class='box'>[보기]<br>㉠ $b$는 두 자리 자연수이고 7의 배수이다. (단, $10 < b < 40$)<br>㉡ $a$의 값은 168이다.<br>㉢ $\\frac{b}{a}$를 소수로 나타내면 순환소수이다.</div>",
    "answer": "77",
    "solution": "㉡에 의해 $a=168 = 2^3 \\times 3 \\times 7$\\n㉠에 의해 $10 < b < 40$인 $7$의 배수이므로 $b \\in \\{14, 21, 28, 35\\}$\\n㉢에 의해 $\\frac{b}{168} = \\frac{b}{2^3 \\times 3 \\times 7}$가 순환소수가 되려면 분모에 소인수 $2$와 $5$ 이외의 소인수가 남아야 하므로 $3$이 약분되지 않아야 한다.\\n$\\implies b$는 $3$의 배수가 아니어야 한다.\\n$b=21$인 경우 $3$의 배수이므로 제외된다.\\n따라서 가능한 $b$의 값은 $14, 28, 35$이다.\\n합을 구하면 $14 + 28 + 35 = 77$\\n$\\therefore$ 77"
  },
  {
    "id": 23,
    "level": "중",
    "category": "다항식의 계산",
    "content": "[서술형 3]<br>어떤 식에 다항식 $x^2-5x+6$을 더해야 할 것을 잘못하여 빼었더니 $2x^2-5x+3$이 되었다. 이 때, 바르게 계산한 식을 구하시오. [5점]",
    "answer": "$4x^2-15x+15$",
    "solution": "어떤 식을 $A$라고 하면\\n$A - (x^2-5x+6) = 2x^2-5x+3$\\n$\\implies A = (2x^2-5x+3) + (x^2-5x+6) = 3x^2-10x+9$\\n바르게 계산한 식은 $A$에 $x^2-5x+6$을 더해야 하므로\\n$(3x^2-10x+9) + (x^2-5x+6) = 4x^2-15x+15$\\n$\\therefore 4x^2-15x+15$"
  },
  {
    "id": 24,
    "level": "상",
    "category": "단항식의 계산",
    "content": "[서술형 4]<br>두 자연수 $a, b$에 대하여 $[x]=x^a$, $<x>=x^b$라 할 때,<br>$<[x]>=x^{12}$, $[x] \\times <x> = x^7$, $[x] \\div <x> = x$가 성립한다.<br>이 때, $<3 \\times x \\times y^2> \\times [x^2 \\times (-1) \\times <y>] \\div <3xy>$를 간단히 구하시오. [6점]",
    "answer": "$x^8y^{15}$",
    "solution": "$<[x]> = <x^a> = (x^a)^b = x^{ab} = x^{12} \\implies ab=12$\\n$[x] \\times <x> = x^a \\times x^b = x^{a+b} = x^7 \\implies a+b=7$\\n$[x] \\div <x> = x^a \\div x^b = x^{a-b} = x^1 \\implies a-b=1$\\n연립하여 풀면 $2a=8 \\implies a=4, b=3$이다.\\n따라서 $[A] = A^4$, $<A> = A^3$이다.\\n주어진 식을 계산하면\\n$<3xy^2> = (3xy^2)^3 = 27x^3y^6$\\n$[x^2 \\times (-1) \\times <y>] = [-x^2 \\times y^3] = (-x^2y^3)^4 = x^8y^{12}$\\n$<3xy> = (3xy)^3 = 27x^3y^3$\\n$\\implies 27x^3y^6 \\times x^8y^{12} \\div 27x^3y^3 = \\frac{27x^{11}y^{18}}{27x^3y^3} = x^8y^{15}$\\n$\\therefore x^8y^{15}$"
  }
];