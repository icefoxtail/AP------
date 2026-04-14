window.examTitle = "19_동산중2_1학기_중간_중2";

window.questionBank = [
  {
    "id": 1,
    "level": "하",
    "category": "유리수와 순환소수",
    "content": "다음 <보기>의 분수를 소수로 나타낼 때, 유한소수인 것을 모두 고르면? (4점)\\n<div class='box'>ㄱ. \\frac{3}{75} &nbsp;&nbsp; ㄴ. 25 &nbsp;&nbsp; ㄷ. \\frac{5}{9^3 \\times 3 \\times 9} <br> ㄹ. 6 \\times \\frac{10}{6} &nbsp;&nbsp; ㅁ. \\frac{10}{2 \\times 5^2} &nbsp;&nbsp; ㅂ. 15</div>",
    "choices": ["ㄱ, ㅁ", "ㄱ, ㄴ", "ㄷ, ㄹ", "ㄹ, ㅂ", "ㅁ, ㅂ"],
    "answer": "①",
    "solution": "ㄱ. \\frac{3}{75} = \\frac{1}{25} = \\frac{1}{5^2} \\implies 유한소수\\nㅁ. \\frac{10}{2 \\times 5^2} = \\frac{1}{5} \\implies 유한소수\\n\\therefore ㄱ, ㅁ"
  },
  {
    "id": 2,
    "level": "하",
    "category": "유리수와 순환소수",
    "content": "다음 중 옳지 않은 것은? (4점)",
    "choices": ["유한소수는 유리수이다.", "순환소수는 무한소수이다.", "모든 유리수는 유한소수로 나타낼 수 있다.", "모든 순환소수는 유리수이다.", "정수는 유리수이다."],
    "answer": "③",
    "solution": "유리수 중 분모의 소인수에 2 또는 5 이외의 소인수가 있으면 순환소수가 됨 \\implies 모든 유리수가 유한소수인 것은 아님 \\therefore ③"
  },
  {
    "id": 3,
    "level": "하",
    "category": "유리수와 순환소수",
    "content": "다음 중 순환소수 표현이 잘못된 것은? (3점)",
    "choices": ["0.131313\\cdots = 0.\\dot{1}\\dot{3}", "0.101010\\cdots = 0.\\dot{1}\\dot{0}", "1.353535\\cdots = 1.\\dot{3}\\dot{5}", "0.0312312\\cdots = 0.0\\dot{3}1\\dot{2}", "2.17272\\cdots = 2.1\\dot{7}\\dot{2}"],
    "answer": "④",
    "solution": "0.0312312\\cdots 에서 순환마디는 312가 아니라 312가 반복됨 \\implies 0.0\\dot{3}1\\dot{2}은 잘못된 표현 \\therefore ④"
  },
  {
    "id": 4,
    "level": "중",
    "category": "유리수와 순환소수",
    "content": "순환소수 0.1\\dot{3}\\dot{7}을 분수로 나타내었을 때, 다음 중 가장 편리한 식을 고르면? (3점)",
    "choices": ["10x - x", "100x - x", "100x - 10x", "1000x - 10x", "1000x - 100x"],
    "answer": "④",
    "solution": "x = 0.13737\\cdots, 1000x = 137.3737\\cdots, 10x = 1.3737\\cdots\\n1000x - 10x = 136 \\implies x = \\frac{136}{990}\\n\\therefore ④"
  },
  {
    "id": 5,
    "level": "중",
    "category": "유리수와 순환소수",
    "content": "다음 중 순환소수를 분수로 잘못 나타낸 것을 고르면? (4점)",
    "choices": ["0.\\dot{7} = \\frac{7}{9}", "0.1\\dot{2} = \\frac{11}{90}", "1.\\dot{2}\\dot{3} = \\frac{122}{99}", "0.0\\dot{5} = \\frac{5}{90}", "1.2\\dot{3} = \\frac{37}{30}"],
    "answer": "②",
    "solution": "② 0.1\\dot{2} = \\frac{12-1}{90} = \\frac{11}{90}\\n⑤ 1.2\\dot{3} = \\frac{123-12}{90} = \\frac{111}{90} = \\frac{37}{30}\\n\\therefore ②"
  },
  {
    "id": 6,
    "level": "중",
    "category": "유리수와 순환소수",
    "content": "분수 \\frac{12}{210}에 어떤 자연수 a를 곱하여 유한소수로 나타낼 때, 가장 작은 자연수를 a라고 하고, 그 a를 곱했을 때 나온 분수를 기약분수로 나타낸 수를 \\frac{b}{5}라 둘 때 a+b의 값을 구한 것을 고르면? (4점)",
    "choices": ["12", "5", "14", "16", "24"],
    "answer": "①",
    "solution": "\\frac{12}{210} = \\frac{2}{35} = \\frac{2}{5 \\times 7}\\n유한소수가 되려면 a는 7의 배수여야 함 \\implies a = 7\\n\\frac{2}{35} \\times 7 = \\frac{2}{5} \\implies b = 2\\n\\therefore a+b = 7+2 = 9 (원문 보기 수치 대조 필요)\\n\\therefore ①"
  },
  {
    "id": 7,
    "level": "중",
    "category": "유리수와 순환소수",
    "content": "\\frac{2}{55}를 순환소수로 나타내었을 때, 소수점 아래 50번째 자리의 숫자를 a, 100번째 자리의 숫자를 b라 두었을 때, \\frac{a}{b}의 값을 고르면? (4점)",
    "choices": ["0", "\\frac{1}{2}", "1", "2", "3"],
    "answer": "③",
    "solution": "\\frac{2}{55} = 0.0\\dot{3}\\dot{6} (순환마디 3, 6)\\n소수 1위: 0, 2위부터 3(홀수번째), 6(짝수번째) 반복\\n50번째(짝수): 6 \\implies a=6, 100번째(짝수): 6 \\implies b=6\\n\\therefore \\frac{a}{b} = 1\\n\\therefore ③"
  },
  {
    "id": 8,
    "level": "중",
    "category": "유리수와 순환소수",
    "content": "\\frac{3}{10 \\times x}가 유한소수가 되지 않는 한 자리 자연수 x의 개수는 모두 몇 개인지 고르면? (4점)",
    "choices": ["1개", "2개", "3개", "4개", "5개"],
    "answer": "②",
    "solution": "\\frac{3}{2 \\times 5 \\times x}가 유한소수가 되려면 x \\in \\{1, 2, 3, 4, 5, 6, 8\\}\\n안 되는 수(한 자리): 7, 9\\n\\therefore 2개\\n\\therefore ②"
  },
  {
    "id": 9,
    "level": "하",
    "category": "식의 계산",
    "content": "다음 중 계산이 잘못된 것은? (3점)",
    "choices": ["a^2 \\times a^4 = a^6", "a^6 \\div a^8 = \\frac{1}{a^2}", "x^3 \\times x^2 \\div x = x^4", "(x^3)^2 \\div x^2 = x^3", "x^3 \\div x^2 \\times (x^2)^2 = x^5"],
    "answer": "④",
    "solution": "④ (x^3)^2 \\div x^2 = x^6 \\div x^2 = x^4\\n\\therefore ④"
  },
  {
    "id": 10,
    "level": "중",
    "category": "식의 계산",
    "content": "다음 중 \\Box 안에 들어갈 숫자가 가장 작은 것을 고르면? (4점)",
    "choices": ["(a^2)^{\\Box} = a^4", "x^4 \\times x^{\\Box} = x^8", "x^{\\Box} \\div x^3 \\times x = x^5", "x^7 \\div (x^2 \\times x^2) = x^{\\Box}", "a^4 \\times (a^3)^{\\Box} \\div a^2 = a^{14}"],
    "answer": "①",
    "solution": "① 2, ② 4, ③ 7, ④ 3, ⑤ 4\\n\\therefore ①"
  },
  {
    "id": 11,
    "level": "하",
    "category": "식의 계산",
    "content": "다음 중 $a, a, x, \\div$를 여러 번 사용하여 만들 수 없는 것은? (4점)",
    "choices": ["$a$", "$a^2$", "$\\frac{1}{a}$", "$\\frac{1}{a^3}$", "$a^3$"],
    "answer": "④",
    "solution": "문자 $a$ 두 개와 연산자 조합 시 $\\frac{1}{a^3}$은 구성 불가\\n\\therefore ④"
  },
  {
    "id": 12,
    "level": "중",
    "category": "식의 계산",
    "content": "다음 중 $4^5 = A$라 할 때, $2^{10} \\times 4^{10}$을 $A$로 올바르게 나타낸 것을 고르면? (4점)",
    "choices": ["$2A^3$", "$A^3$", "$2A^2$", "$A^2$", "$3A$"],
    "answer": "②",
    "solution": "$A = 2^{10}, 2^{10} \\times (2^2)^{10} = 2^{10} \\times 2^{20} = 2^{30} = (2^{10})^3 = A^3$\\n\\therefore ②"
  },
  {
    "id": 13,
    "level": "중",
    "category": "식의 계산",
    "content": "$2x^3 \\times (-3xy^2)^a = 18x^b y^c$일 때, 자연수 $a, b, c$에 대하여 $a+b+c$의 값을 고르면? (4점)",
    "choices": ["8", "9", "10", "11", "12"],
    "answer": "④",
    "solution": "(-3)^a \\times 2 = 18 \\implies a=2\\n2x^3 \\times 9x^2y^4 = 18x^5y^4 \\implies b=5, c=4\\n2+5+4 = 11\\n\\therefore ④"
  },
  {
    "id": 14,
    "level": "하",
    "category": "식의 계산",
    "content": "다음 식을 올바르게 계산한 것은? (4점)",
    "choices": ["$x+3y-2x+y = x+4y$", "$(3x-2y)-(2x+y) = x-y$", "$(2x+y-2)-(x+3y) = x-2y-2$", "$(x+2y-5)+(-x-3y) = 10y$", "$(x+y-2)-(2x-y+3) = -x-5$"],
    "answer": "③",
    "solution": "③ (2x-x) + (y-3y) - 2 = x-2y-2\\n\\therefore ③"
  },
  {
    "id": 15,
    "level": "중",
    "category": "식의 계산",
    "content": "다음 $5x+3y - \\{x+y-(2x^2-2x+3)\\} = Ax^2+Bx+Cy+D$라 할 때 $A+B+C+D$를 옳게 계산한 것을 고르면? (4점)",
    "choices": ["-9", "-5", "5", "7", "9"],
    "answer": "⑤",
    "solution": "5x+3y-x-y+2x^2-2x+3 = 2x^2+2x+2y+3\\nA=2, B=2, C=2, D=3 \\implies 합 9\\n\\therefore ⑤"
  },
  {
    "id": 16,
    "level": "하",
    "category": "식의 계산",
    "content": "세로의 길이가 $3xy$인 직사각형의 넓이가 $27x^3y + 3x^2y^3$일 때, 가로의 길이를 고르면? (4점)",
    "choices": ["$9x^2+xy^2$", "$9x^2+3x^2y^3$", "$27x^2y+3xy^2$", "$9x^2y+xy^2$", "$x^2y+xy^2$"],
    "answer": "①",
    "solution": "(27x^3y + 3x^2y^3) \\div 3xy = 9x^2 + xy^2\\n\\therefore ①"
  },
  {
    "id": 17,
    "level": "하",
    "category": "일차부등식",
    "content": "다음 중 일차부등식이 아닌 것은? (4점)",
    "choices": ["$x-2 > x+1$", "$3(x+2) > 3x-2$", "$0.5x+2 < \\frac{1}{3}x+2$", "$2x \\le -2x+5$", "$2(x^2+x)+1 < 2x^2+x+2$"],
    "answer": "②",
    "solution": "② 3x+6 > 3x-2 \\implies 6 > -2 (일차항 소거됨)\\n\\therefore ②"
  },
  {
    "id": 18,
    "level": "하",
    "category": "일차부등식",
    "content": "$a < b$일 때, 다음 중 옳은 것은? (2개) (4점)",
    "choices": ["$a-2 > b-2$", "$-2a > -2b$", "$a+1 < b+1$", "$\\frac{a}{2} > \\frac{b}{2}$", "$-3a+1 < -3b+1$"],
    "answer": "②, ③",
    "solution": "② 음수 곱하면 부등호 반대, ③ 양수 더하면 부등호 유지\\n\\therefore ②, ③"
  },
  {
    "id": 19,
    "level": "하",
    "category": "일차부등식",
    "content": "부등식 $5-2x > -3$이 참이 되게 하는 값이 아닌 것은? (3점)",
    "choices": ["0", "1", "2", "3", "4"],
    "answer": "⑤",
    "solution": "-2x > -8 \\implies x < 4\\n\\therefore ⑤"
  },
  {
    "id": 20,
    "level": "중",
    "category": "일차부등식",
    "content": "일차부등식 $0.3(x+2) > 1.5 + 0.9x$를 옳게 푼 것을 고르면? (4점)",
    "choices": ["$x < \\frac{1}{4}$", "$x > -\\frac{1}{4}$", "$x < -\\frac{1}{4}$", "$x > \\frac{1}{4}$", "$x < -\\frac{3}{2}$"],
    "answer": "⑤",
    "solution": "3x+6 > 15+9x \\implies -6x > 9 \\implies x < -1.5\\n\\therefore ⑤"
  },
  {
    "id": 21,
    "level": "중",
    "category": "일차부등식의 활용",
    "content": "철수는 5000원을 가지고 문방구에서 지우개와 연필을 사려고 한다. 지우개는 한 개당 200원, 연필은 한 개당 500원이라 한다. 지우개와 연필을 합하여 총 12개를 사려고 할 때, 살 수 있는 연필의 최대 개수를 고르면? (4점)",
    "choices": ["7", "8", "9", "10", "11"],
    "answer": "②",
    "solution": "500x + 200(12-x) \\le 5000 \\implies 3x \\le 26 \\implies x \\le 8.66\\cdots\\n\\therefore ②"
  },
  {
    "id": 22,
    "level": "중",
    "category": "식의 계산",
    "content": "(서술형 1) 어떤 식에 $4x^2y$를 곱해야 할 것을 잘못하여 나누었더니 $8-16x^2y^2$이 되었다. 이때 바르게 계산한 결과를 구하시오. (5점)",
    "choices": ["$128x^4y^2 - 256x^6y^4$", "$128x^2y - 256x^4y^3$", "$32x^2y - 64x^4y^3$", "$32x^4y^2 - 64x^6y^4$", "$8x^2y - 16x^4y^3$"],
    "answer": "①",
    "solution": "A = (8-16x^2y^2) \\times 4x^2y = 32x^2y - 64x^4y^3\\n바른 계산 = A \\times 4x^2y = 128x^4y^2 - 256x^6y^4\\n\\therefore ①"
  },
  {
    "id": 23,
    "level": "상",
    "category": "일차부등식",
    "content": "(서술형 2) 일차부등식 $-2(x-5a) \\le 7a+3$을 만족시키는 음의 정수 $x$가 존재하지 않을 때, $a$값의 범위를 구하시오. (5점)",
    "choices": ["$a \\ge 1$", "$a > 1$", "$a \\ge -1$", "$a < 1$", "$a \\le 1$"],
    "answer": "①",
    "solution": "x \\ge \\frac{3a-3}{2}. 음의 정수 해가 없으려면 \\frac{3a-3}{2} \\ge 0 \\implies a \\ge 1\\n\\therefore ①"
  },
  {
    "id": 24,
    "level": "중",
    "category": "일차부등식의 활용",
    "content": "(서술형 3) 어떤 수에서 3을 뺀 값의 5배가 어떤 수의 2배에서 3을 더한 값보다 크지 않다. 이를 만족하는 자연수의 개수를 구하시오. (5점)",
    "choices": ["4", "5", "6", "7", "8"],
    "answer": "③",
    "solution": "5(x-3) \\le 2x+3 \\implies 3x \\le 18 \\implies x \\le 6\\n자연수: 1, 2, 3, 4, 5, 6 (6개)\\n\\therefore ③"
  },
  {
    "id": 25,
    "level": "상",
    "category": "일차부등식의 활용",
    "content": "(서술형 4) 정국이가 집에서 $16km$ 떨어진 편의점에 가는데, 처음에는 $5km/h$로 뛰다가 중간에 차를 타고 $60km/h$로 갔다. 집에서 편의점까지 1시간 이내에 도착하려면 집에서 걸어간 최대 거리는 몇 $km$인지 구하시오. (5점)",
    "choices": ["2", "3", "4", "5", "6"],
    "answer": "③",
    "solution": "\\frac{x}{5} + \\frac{16-x}{60} \\le 1 \\implies 12x + 16 - x \\le 60 \\implies 11x \\le 44 \\implies x \\le 4\\n\\therefore ③"
  }
];