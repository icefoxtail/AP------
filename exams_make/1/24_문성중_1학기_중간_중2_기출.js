window.examTitle = "25_진남중_1학기_중간_중2_기출";

window.questionBank = [
  {
    id: 1,
    level: "중",
    category: "유리수와 소수",
    originalCategory: "수와 식",
    standardCourse: "중2 수학",
    standardUnitKey: "M2-01",
    standardUnit: "수와 식",
    standardUnitOrder: 1,
    content: "분수 $\\frac{3}{2^{3}\\times5}$을 유한소수로 나타내는 과정이다. 다음 빈칸을 채워 $A+B\\times C$의 값을 구하면? [4점]\\n<div class=\"question-table-wrap\">\\n  <table>\\n    <tr>\\n      <td>$\\frac{3}{2^{3}\\times5}=\\frac{A}{2^{3}\\times5^{3}}=\\frac{A}{B}=C$</td>\\n    </tr>\\n  </table>\\n</div>",
    choices: [
      "25",
      "75",
      "150",
      "450",
      "750"
    ],
    answer: "③",
    solution: "[키포인트]\\n유한소수로 나타내기 위해서는 분모를 10의 거듭제곱 꼴로 만들어야 한다.\\n\\n조건 정리\\n분모의 $2$의 지수가 $3$이므로, $5$의 지수도 $3$으로 맞춰야 한다.\\n\\n풀이 과정\\n$\\frac{3}{2^{3}\\times5} = \\frac{3 \\times 5^2}{2^3 \\times 5 \\times 5^2} = \\frac{3 \\times 25}{2^3 \\times 5^3} = \\frac{75}{10^3} = \\frac{75}{1000} = 0.075$ 이다.\\n따라서 $A = 75, B = 1000, C = 0.075$ 이다.\\n구하는 값: $A + B \\times C = 75 + 1000 \\times 0.075 = 75 + 75 = 150$ 이다.\\n\\n결론\\n따라서 정답은 ③이다."
  },
  {
    id: 2,
    level: "하",
    category: "유리수와 소수",
    originalCategory: "수와 식",
    standardCourse: "중2 수학",
    standardUnitKey: "M2-01",
    standardUnit: "수와 식",
    standardUnitOrder: 1,
    content: "다음 분수 중에서 순환소수로만 나타낼 수 있는 것은? [3점]",
    choices: [
      "$\\frac{5}{25}$",
      "$\\frac{21}{140}$",
      "$\\frac{15}{2^{3}\\times3^{2}\\times5}$",
      "$\\frac{81}{2^{2}\\times3^{2}\\times5^{2}}$",
      "$\\frac{75}{2^{3}\\times5^{2}}$"
    ],
    answer: "③",
    solution: "[키포인트]\\n기약분수의 분모에 2나 5 이외의 소인수가 있으면 순환소수가 된다.\\n\\n조건 정리\\n각 분수를 약분하여 기약분수로 만든 뒤 분모의 소인수를 확인한다.\\n\\n풀이 과정\\n① $\\frac{5}{25} = \\frac{1}{5}$ (유한소수)\\n② $\\frac{21}{140} = \\frac{3}{20} = \\frac{3}{2^2 \\times 5}$ (유한소수)\\n③ $\\frac{15}{2^3 \\times 3^2 \\times 5} = \\frac{3}{2^3 \\times 3^2} = \\frac{1}{2^3 \\times 3}$ (분모에 3이 남으므로 순환소수)\\n④ $\\frac{81}{2^2 \\times 3^2 \\times 5^2} = \\frac{9}{2^2 \\times 5^2}$ (유한소수)\\n⑤ $\\frac{75}{2^3 \\times 5^2} = \\frac{3}{2^3}$ (유한소수)\\n\\n결론\\n따라서 정답은 ③이다."
  },
  {
    id: 3,
    level: "중",
    category: "유리수와 소수",
    originalCategory: "수와 식",
    standardCourse: "중2 수학",
    standardUnitKey: "M2-01",
    standardUnit: "수와 식",
    standardUnitOrder: 1,
    content: "두 수의 대소관계를 바르게 나타낸 것은? [3점]",
    choices: [
      "$0.30 \\gt 0.\\dot{3}0\\dot{0}$",
      "$6.41\\dot{4} \\lt 6.\\dot{4}\\dot{1}$",
      "$0.83 \\lt 0.\\dot{8}$",
      "$0.123 \\gt 0.1\\dot{2}\\dot{3}$",
      "$0.7\\dot{6} \\lt 0.76$"
    ],
    answer: "③",
    solution: "[키포인트]\\n순환소수를 소수점 아래로 나열하여 자릿수별로 대소를 비교한다.\\n\\n조건 정리\\n각 보기의 좌변과 우변을 비교한다.\\n\\n풀이 과정\\n① $0.30$ vs $0.300300... \\rightarrow 0.30 \\lt 0.3003...$ (거짓)\\n② $6.4144...$ vs $6.4141... \\rightarrow 6.41\\dot{4} \\gt 6.\\dot{4}\\dot{1}$ (거짓)\\n③ $0.83$ vs $0.888... \\rightarrow 0.83 \\lt 0.888...$ (참)\\n④ $0.123$ vs $0.12323... \\rightarrow 0.123 \\lt 0.12323...$ (거짓)\\n⑤ $0.766...$ vs $0.76 \\rightarrow 0.7\\dot{6} \\gt 0.76$ (거짓)\\n\\n결론\\n따라서 정답은 ③이다."
  },
  {
    id: 4,
    level: "중",
    category: "유리수와 소수",
    originalCategory: "수와 식",
    standardCourse: "중2 수학",
    standardUnitKey: "M2-01",
    standardUnit: "수와 식",
    standardUnitOrder: 1,
    content: "분수 $\\frac{38}{11}$을 소수로 나타내었을 때, 소수점 아래 34번째 자리의 숫자와 35번째 자리의 숫자의 곱은? [4점]",
    choices: [
      "7",
      "9",
      "16",
      "20",
      "25"
    ],
    answer: "④",
    solution: "[키포인트]\\n분수를 순환소수로 고친 뒤 순환마디의 규칙성을 파악한다.\\n\\n조건 정리\\n$\\frac{38}{11}$을 소수로 변환한다.\\n\\n풀이 과정\\n$\\frac{38}{11} = 3.454545... = 3.\\dot{4}\\dot{5}$ 이다.\\n순환마디는 $4, 5$이며 마디의 개수는 2개이다.\\n홀수 번째 자리 숫자는 $4$, 짝수 번째 자리 숫자는 $5$이다.\\n34번째 자리 숫자: 짝수 번째이므로 $5$이다.\\n35번째 자리 숫자: 홀수 번째이므로 $4$이다.\\n두 숫자의 곱: $5 \\times 4 = 20$ 이다.\\n\\n결론\\n따라서 정답은 ④이다."
  },
  {
    id: 5,
    level: "상",
    category: "유리수와 소수",
    originalCategory: "수와 식",
    standardCourse: "중2 수학",
    standardUnitKey: "M2-01",
    standardUnit: "수와 식",
    standardUnitOrder: 1,
    content: "두 순환소수 $0.\\dot{a}\\dot{b}$와 $0.\\dot{b}\\dot{a}$의 합이 $0.\\dot{5}$일 때, $0.\\dot{a}-0.\\dot{b}$의 값을 순환소수로 나타낸 것은? (단, $a, b$는 한 자리의 자연수이고 $a$와 $b$는 소수(prime number)이며, $a \\gt b$이다.) [5점]",
    choices: [
      "$0.\\dot{1}$",
      "$0.\\dot{2}$",
      "$0.\\dot{3}$",
      "$0.\\dot{4}$",
      "$0.\\dot{5}$"
    ],
    answer: "①",
    solution: "[키포인트]\\n순환소수를 분수로 변환하여 미지수 $a, b$의 조건을 만족하는 값을 찾는다.\\n\\n조건 정리\\n$0.\\dot{a}\\dot{b} = \\frac{10a+b}{99}$, $0.\\dot{b}\\dot{a} = \\frac{10b+a}{99}$, $0.\\dot{5} = \\frac{5}{9}$ 이다.\\n$a, b$는 한 자리 소수($2, 3, 5, 7$ 중 하나)이고 $a \\gt b$이다.\\n\\n풀이 과정\\n$\\frac{10a+b}{99} + \\frac{10b+a}{99} = \\frac{11a+11b}{99} = \\frac{a+b}{9}$ 이다.\\n$\\frac{a+b}{9} = \\frac{5}{9}$ 이므로 $a+b=5$ 이다.\\n합이 5가 되는 한 자리 소수 쌍은 $(3, 2)$뿐이다. ($a \\gt b$이므로 $a=3, b=2$)\\n구하는 값: $0.\\dot{a} - 0.\\dot{b} = 0.\\dot{3} - 0.\\dot{2} = \\frac{3}{9} - \\frac{2}{9} = \\frac{1}{9} = 0.\\dot{1}$ 이다.\\n\\n결론\\n따라서 정답은 ①이다."
  },
  {
    id: 6,
    level: "중",
    category: "유리수와 소수",
    originalCategory: "수와 식",
    standardCourse: "중2 수학",
    standardUnitKey: "M2-01",
    standardUnit: "수와 식",
    standardUnitOrder: 1,
    content: "어떤 기약분수를 소수로 나타내는데, 선재는 분모를 잘못 보아 $0.58\\dot{3}$으로 나타내고, 우석이는 분자를 잘못 보아 $0.\\dot{5}\\dot{4}$로 나타내었다. 처음 기약분수를 소수로 바르게 나타낸 것은? [4점]",
    choices: [
      "$0.\\dot{6}$",
      "$0.\\dot{6}\\dot{3}$",
      "$0.6\\dot{3}$",
      "$0.63$",
      "$0.6\\dot{3}$"
    ],
    answer: "②",
    solution: "[키포인트]\\n잘못 본 정보 외에 바르게 본 정보를 추출하여 원래의 기약분수를 복원한다.\\n\\n조건 정리\\n선재: 분모 오류 $\\rightarrow$ 분자는 바름.\\n우석: 분자 오류 $\\rightarrow$ 분모는 바름.\\n\\n풀이 과정\\n선재: $0.58\\dot{3} = \\frac{583-58}{900} = \\frac{525}{900} = \\frac{175}{300} = \\frac{7}{12}$ (바른 분자 = 7)\\n우석: $0.\\dot{5}\\dot{4} = \\frac{54}{99} = \\frac{6}{11}$ (바른 분모 = 11)\\n처음 기약분수: $\\frac{7}{11}$ 이다.\\n소수로 변환: $\\frac{7}{11} = 0.6363... = 0.\\dot{6}\\dot{3}$ 이다.\\n\\n결론\\n따라서 정답은 ②이다."
  },
  {
    id: 7,
    level: "중",
    category: "유리수와 소수",
    originalCategory: "수와 식",
    standardCourse: "중2 수학",
    standardUnitKey: "M2-01",
    standardUnit: "수와 식",
    standardUnitOrder: 1,
    content: "다음 중 옳은 것만을 있는 대로 고른 것은? [4점]\\n<div class=\"question-table-wrap\">\\n  <table>\\n    <tr>\\n      <td>\\n        ㄴ. 순환소수는 분수로 나타낼 수 있다.\\n        ㅂ. 모든 순환소수는 유리수이다.\\n        ㅇ. 유리수를 소수로 나타내면 유한소수가 아니면 반드시 순환소수이다.\\n        ㅈ. 어떤 분수의 분모를 소인수분해 하였을 때 2나 5 외의 다른 소인수가 있으면 유한소수가 아니다.\\n      </td>\\n    </tr>\\n  </table>\\n</div>",
    choices: [
      "ㄱ, ㄷ, ㄹ",
      "ㄱ, ㄹ, ㅁ",
      "ㄴ, ㅂ, ㅇ",
      "ㄴ, ㅂ, ㅈ",
      "ㄷ, ㅅ, ㅈ"
    ],
    answer: "③",
    solution: "[키포인트]\\n유리수와 소수의 정의 및 분류 체계를 정확히 이해한다.\\n\\n조건 정리\\n각 명제의 참/거짓을 판별한다.\\n\\n풀이 과정\\nㄴ. 순환소수는 모두 분수로 나타낼 수 있는 유리수이다. (참)\\nㅂ. 모든 순환소수는 분수 꼴로 나타낼 수 있으므로 유리수이다. (참)\\nㅇ. 유리수는 유한소수 또는 순환소수(무한소수)로만 나타내어진다. (참)\\nㅈ. '어떤 분수'가 아닌 '기약분수'여야 참이 된다. 약분이 가능한 경우 분모에 3이 있어도 유한소수가 될 수 있다. (거짓)\\n\\n결론\\n따라서 정답은 ③이다."
  },
  {
    id: 8,
    level: "하",
    category: "지수법칙",
    originalCategory: "수와 식",
    standardCourse: "중2 수학",
    standardUnitKey: "M2-01",
    standardUnit: "수와 식",
    standardUnitOrder: 1,
    content: "$(3^{5})^{4} \\div (3^{\\Box})^{3} = 3^{14}$일 때, $\\Box$ 안에 알맞은 수는? [3점]",
    choices: [
      "2",
      "4",
      "6",
      "8",
      "10"
    ],
    answer: "①",
    solution: "[키포인트]\\n지수법칙의 거듭제곱의 거듭제곱($ (a^m)^n = a^{mn} $)과 나눗셈($ a^m \\div a^n = a^{m-n} $)을 이용한다.\\n\\n조건 정리\\n좌변의 지수를 정리하여 우변의 지수와 비교한다.\\n\\n풀이 과정\\n$(3^{5})^{4} = 3^{20}$ 이고, $(3^x)^3 = 3^{3x}$ 이다.\\n식: $3^{20} \\div 3^{3x} = 3^{20-3x} = 3^{14}$ 이다.\\n지수 비교: $20 - 3x = 14 \\rightarrow 3x = 6 \\rightarrow x = 2$ 이다.\\n\\n결론\\n따라서 정답은 ①이다."
  },
  {
    id: 9,
    level: "중",
    category: "지수법칙",
    originalCategory: "수와 식",
    standardCourse: "중2 수학",
    standardUnitKey: "M2-01",
    standardUnit: "수와 식",
    standardUnitOrder: 1,
    content: "$a=3^{x-1}$일 때, $9^x$을 $a$에 관한 식으로 나타내면? [4점]",
    choices: [
      "$3a$",
      "$3a^2$",
      "$9a$",
      "$9a^2$",
      "$27a^2$"
    ],
    answer: "④",
    solution: "[키포인트]\\n주어진 조건을 $3^x$에 대한 식으로 변형한 뒤 대입한다.\\n\\n조건 정리\\n$a = 3^{x-1} = \\frac{3^x}{3}$ 이므로 $3^x = 3a$ 이다.\\n\\n풀이 과정\\n$9^x = (3^2)^x = (3^x)^2$ 이다.\\n$3^x = 3a$를 대입하면:\\n$(3a)^2 = 9a^2$ 이다.\\n\\n결론\\n따라서 정답은 ④이다."
  },
  {
    id: 10,
    level: "상",
    category: "지수법칙",
    originalCategory: "수와 식",
    standardCourse: "중2 수학",
    standardUnitKey: "M2-01",
    standardUnit: "수와 식",
    standardUnitOrder: 1,
    content: "$3^{n+2} + 3^{n+1} + 3^{n} = 351$일 때, 자연수 $n$의 값은? [5점]",
    choices: [
      "1",
      "2",
      "3",
      "4",
      "5"
    ],
    answer: "③",
    solution: "[키포인트]\\n공통인수 $3^n$으로 묶어 식을 정리한다.\\n\\n조건 정리\\n각 항을 $3^n$의 곱 형태로 분리한다.\\n\\n풀이 과정\\n$3^n \\cdot 3^2 + 3^n \\cdot 3^1 + 3^n = 351$\\n$3^n(9 + 3 + 1) = 351$\\n$3^n \\cdot 13 = 351$\\n$3^n = 351 \\div 13 = 27$ 이다.\\n$27 = 3^3$ 이므로 $n=3$ 이다.\\n\\n결론\\n따라서 정답은 ③이다."
  },
  {
    id: 11,
    level: "하",
    category: "단항식의 계산",
    originalCategory: "수와 식",
    standardCourse: "중2 수학",
    standardUnitKey: "M2-01",
    standardUnit: "수와 식",
    standardUnitOrder: 1,
    content: "$(x^{4}y)^{3} \\times (x^{2}y^{5})^{2} = x^{a}y^{b}$일 때, $a+b$의 값은? [4점]",
    choices: [
      "13",
      "16",
      "20",
      "24",
      "29"
    ],
    answer: "⑤",
    solution: "[키포인트]\\n지수법칙을 이용하여 괄호를 풀고 같은 밑끼리 지수를 더한다.\\n\\n조건 정리\\n각 항의 지수를 분배한다.\\n\\n풀이 과정\\n$(x^4 y)^3 = x^{12} y^3$\\n$(x^2 y^5)^2 = x^4 y^{10}$\\n두 식의 곱: $x^{12} y^3 \\times x^4 y^{10} = x^{12+4} y^{3+10} = x^{16} y^{13}$ 이다.\\n따라서 $a=16, b=13$ 이므로 $a+b = 16+13 = 29$ 이다.\\n\\n결론\\n따라서 정답은 ⑤이다."
  },
  {
    id: 12,
    level: "상",
    category: "단항식의 계산",
    originalCategory: "수와 식",
    standardCourse: "중2 수학",
    standardUnitKey: "M2-01",
    standardUnit: "수와 식",
    standardUnitOrder: 1,
    content: "네 자연수 $a, b, c, d$에 대하여 $(x^{a}y^{b}z^{c})^{d} = x^{32}y^{24}z^{40}$이 성립할 때, $a+b+c$의 최솟값은? [5점]",
    choices: [
      "10",
      "11",
      "12",
      "14",
      "24"
    ],
    answer: "③",
    solution: "[키포인트]\\n지수법칙에서 지수 $d$는 각 지수 $32, 24, 40$의 공약수여야 한다.\\n\\n조건 정리\\n$ad = 32, bd = 24, cd = 40$ 이다.\\n$a+b+c$가 최소가 되려면 $d$가 최대여야 한다.\\n\\n풀이 과정\\n$d$는 $32, 24, 40$의 최대공약수여야 한다.\\n$32, 24, 40$의 최대공약수는 $8$ 이다.\\n따라서 $d=8$일 때 $a = 32/8 = 4, b = 24/8 = 3, c = 40/8 = 5$ 이다.\\n$a+b+c = 4+3+5 = 12$ 이다.\\n\\n결론\\n따라서 정답은 ③이다."
  },
  {
    id: 13,
    level: "중",
    category: "단항식의 계산",
    originalCategory: "수와 식",
    standardCourse: "중2 수학",
    standardUnitKey: "M2-01",
    standardUnit: "수와 식",
    standardUnitOrder: 1,
    content: "$(2xy^{2})^{3} \\times (-x^{2}y)^{2} \\times \\frac{7y^{4}}{4x^{3}}$을 계산하면? [4점]",
    choices: [
      "$-28x^4 y^{12}$",
      "$-14x^5 y^{10}$",
      "$14x^4 y^{12}$",
      "$28x^4 y^{10}$",
      "$56x^4 y^{12}$"
    ],
    answer: "③",
    solution: "[키포인트]\\n거듭제곱을 먼저 처리한 뒤 계수는 계수끼리, 문자는 문자끼리 계산한다.\\n\\n조건 정리\\n$(2xy^2)^3 = 8x^3 y^6$, $(-x^2 y)^2 = x^4 y^2$ 이다.\\n\\n풀이 과정\\n$8x^3 y^6 \\times x^4 y^2 \\times \\frac{7y^{4}}{4x^{3}} = (8 \\times 1 \\times \\frac{7}{4}) \\times (x^3 \\cdot x^4 \\cdot x^{-3}) \\times (y^6 \\cdot y^2 \\cdot y^4)$\\n$= 14 \\times x^{3+4-3} \\times y^{6+2+4} = 14x^4 y^{12}$ 이다.\\n\\n결론\\n따라서 정답은 ③이다."
  },
  {
    id: 14,
    level: "중",
    category: "단항식의 계산",
    originalCategory: "수와 식",
    standardCourse: "중2 수학",
    standardUnitKey: "M2-01",
    standardUnit: "수와 식",
    standardUnitOrder: 1,
    content: "밑면은 한 변이 $2a^2 b$인 정사각형이고 부피가 $8a^5 b^3$인 직육면체의 높이는? [4점]",
    choices: [
      "$2ab$",
      "$6a^2 b$",
      "$8a^2$",
      "$8ab$",
      "$18ab$"
    ],
    answer: "①",
    solution: "[키포인트]\\n직육면체의 부피 $V = (밑넓이) \\times (높이)$ 식을 이용한다.\\n\\n조건 정리\\n밑넓이 $S = (2a^2 b)^2 = 4a^4 b^2$ 이다.\\n부피 $V = 8a^5 b^3$ 이다.\\n\\n풀이 과정\\n높이 $H = V \\div S = 8a^5 b^3 \\div 4a^4 b^2$\\n$= \\frac{8}{4} \\times a^{5-4} \\times b^{3-2} = 2ab$ 이다.\\n\\n결론\\n따라서 정답은 ①이다."
  },
  {
    id: 15,
    level: "중",
    category: "지수법칙",
    originalCategory: "수와 식",
    standardCourse: "중2 수학",
    standardUnitKey: "M2-01",
    standardUnit: "수와 식",
    standardUnitOrder: 1,
    content: "$2^{13} \\times 5^{15}$이 $n$자리 자연수일 때, $n$의 값은? [4점]",
    choices: [
      "11",
      "12",
      "13",
      "14",
      "15"
    ],
    answer: "⑤",
    solution: "[키포인트]\\n$2$와 $5$의 지수를 맞춰 $10^k$ 꼴로 묶어낸다.\\n\\n조건 정리\\n지수가 낮은 쪽인 $13$에 맞춘다.\\n\\n풀이 과정\\n$2^{13} \\times 5^{15} = 2^{13} \\times 5^{13} \\times 5^2 = (2 \\times 5)^{13} \\times 25$\\n$= 25 \\times 10^{13}$ 이다.\\n이는 $25$ 뒤에 $0$이 $13$개 붙은 숫자이므로 자릿수는 $2 + 13 = 15$ 이다.\\n\\n결론\\n따라서 정답은 ⑤이다."
  },
  {
    id: 16,
    level: "중",
    category: "다항식의 계산",
    originalCategory: "수와 식",
    standardCourse: "중2 수학",
    standardUnitKey: "M2-01",
    standardUnit: "수와 식",
    standardUnitOrder: 1,
    content: "$2x+y+1$에 어떤 식 $A$를 더해야 할 것을 잘못하여 빼었더니 $5x-2y-3$이 되었다. 바르게 계산한 답은? [4점]",
    image: "assets/images/24_문성중_1학기_중간_중2_기출/q16.png",
    choices: [
      "$-x+3y+4$",
      "$-3x+3y+4$",
      "$-x+4y+5$",
      "$-3x+4y+5$",
      "$-x+4y+4$"
    ],
    answer: "③",
    solution: "[키포인트]\\n잘못된 계산식을 통해 식 $A$를 구한 뒤, 원래 하려던 계산을 수행한다.\\n\\n조건 정리\\n잘못된 식: $(2x+y+1) - A = 5x-2y-3$\\n\\n풀이 과정\\n$A = (2x+y+1) - (5x-2y-3) = -3x+3y+4$ 이다.\\n바른 계산: $(2x+y+1) + A = (2x+y+1) + (-3x+3y+4) = -x+4y+5$ 이다.\\n\\n결론\\n따라서 정답은 ③이다."
  },
  {
    id: 17,
    level: "중",
    category: "다항식의 계산",
    originalCategory: "수와 식",
    standardCourse: "중2 수학",
    standardUnitKey: "M2-01",
    standardUnit: "수와 식",
    standardUnitOrder: 1,
    content: "$(4x^{2}-2x^{3}) \\div \\frac{1}{2}x + (\\frac{2}{3}x^{3}-\\frac{8}{3}x^{4}) \\div (-\\frac{2}{3}x^{2})$을 계산하였을 때, $x^2$의 계수는 $a$, $x$의 계수는 $b$이다. 이때 $b-a$의 값은? [4점]",
    image: "assets/images/24_문성중_1학기_중간_중2_기출/q17.png",
    choices: [
      "-17",
      "-7",
      "7",
      "17",
      "32"
    ],
    answer: "③",
    solution: "[키포인트]\\n다항식의 나눗셈을 수행하여 각 항의 계수를 비교한다.\\n\\n조건 정리\\n각 부분을 나누어 전개한다.\\n\\n풀이 과정\\n1) $(4x^2 - 2x^3) \\times \\frac{2}{x} = 8x - 4x^2$\\n2) $(\\frac{2}{3}x^3 - \\frac{8}{3}x^4) \\times (-\\frac{3}{2x^2}) = -x + 4x^2$\\n전체 식: $(8x - 4x^2) + (-x + 4x^2) = 7x$ 이다.\\n$x^2$의 계수 $a = 0$, $x$의 계수 $b = 7$ 이다.\\n구하는 값: $b - a = 7 - 0 = 7$ 이다.\\n\\n결론\\n따라서 정답은 ③이다."
  },
  {
    id: 18,
    level: "하",
    category: "일차부등식",
    originalCategory: "일차부등식",
    standardCourse: "중2 수학",
    standardUnitKey: "M2-02",
    standardUnit: "일차부등식",
    standardUnitOrder: 2,
    content: "다음 부등식 중에서 $x=1$을 해로 갖는 것은? [3점]",
    choices: [
      "$4x-1 \\lt 5x$",
      "$x \\ge 4x$",
      "$3x \\lt x-1$",
      "$5 \\le 2x-1$",
      "$2x+3 \\gt 5$"
    ],
    answer: "①",
    solution: "[키포인트]\\n부등식에 $x=1$을 대입하여 부등호가 성립하는지 확인한다.\\n\\n조건 정리\\n각 보기에 $x=1$을 대입한다.\\n\\n풀이 과정\\n① $4(1)-1 \\lt 5(1) \\rightarrow 3 \\lt 5$ (참)\\n② $1 \\ge 4(1) \\rightarrow 1 \\ge 4$ (거짓)\\n③ $3(1) \\lt 1-1 \\rightarrow 3 \\lt 0$ (거짓)\\n④ $5 \\le 2(1)-1 \\rightarrow 5 \\le 1$ (거짓)\\n⑤ $2(1)+3 \\gt 5 \\rightarrow 5 \\gt 5$ (거짓)\\n\\n결론\\n따라서 정답은 ①이다."
  },
  {
    id: 19,
    level: "중",
    category: "일차부등식",
    originalCategory: "일차부등식",
    standardCourse: "중2 수학",
    standardUnitKey: "M2-02",
    standardUnit: "일차부등식",
    standardUnitOrder: 2,
    content: "$a-1 \\le b-1$일 때, $\\Box$ 안에 들어갈 부등호의 방향이 나머지 넷과 다른 하나는? [4점]",
    choices: [
      "$a+3 \\Box b+3$",
      "$4-a \\Box 4-b$",
      "$2a+1 \\Box 2b+1$",
      "$a-(-5) \\Box b-(-5)$",
      "$5+\\frac{a}{4} \\Box 5+\\frac{b}{4}$"
    ],
    answer: "②",
    solution: "[키포인트]\\n부등식의 성질(음수를 곱하거나 나눌 때만 부등호 방향이 바뀜)을 이용한다.\\n\\n조건 정리\\n$a-1 \\le b-1 \\rightarrow a \\le b$ 이다.\\n\\n풀이 과정\\n①, ③, ④, ⑤: 양수를 더하거나 곱하는 연산이므로 방향이 $\\le$로 유지된다.\\n② $4-a \\Box 4-b$: 양변에 $-1$을 곱하면 $-a \\ge -b$가 되어 부등호 방향이 바뀐다. 즉 $4-a \\ge 4-b$ 이다.\\n\\n결론\\n따라서 정답은 ②이다."
  },
  {
    id: 20,
    level: "상",
    category: "일차부등식",
    originalCategory: "일차부등식",
    standardCourse: "중2 수학",
    standardUnitKey: "M2-02",
    standardUnit: "일차부등식",
    standardUnitOrder: 2,
    content: "$-11 \\le x \\le 3$일 때, $\\frac{1}{3} + ax$의 최댓값이 4, 최솟값이 $b$이다. $a \\lt 0$일 때, 상수 $a, b$에 대하여 $a-b$의 값은? [5점]",
    choices: [
      "$\\frac{1}{3}$",
      "$\\frac{4}{3}$",
      "$\\frac{7}{3}$",
      "$\\frac{8}{3}$",
      "$\\frac{11}{3}$"
    ],
    answer: "①",
    solution: "[키포인트]\\n부등식의 각 변에 연산을 수행하여 함숫값의 범위를 구한다.\\n\\n조건 정리\\n$a \\lt 0$이므로 $x$가 작을수록 $ax$는 커진다.\\n\\n풀이 과정\\n최댓값은 $x=-11$일 때 발생한다: $-11a + 1/3 = 4$\\n$-11a = 4 - 1/3 = 11/3 \\rightarrow a = -1/3$ 이다.\\n최솟값은 $x=3$일 때 발생한다: $3a + 1/3 = b$\\n$3(-1/3) + 1/3 = -1 + 1/3 = -2/3$ 이므로 $b = -2/3$ 이다.\\n구하는 값: $a - b = (-1/3) - (-2/3) = 1/3$ 이다.\\n\\n결론\\n따라서 정답은 ①이다."
  },
  {
    id: 21,
    level: "중",
    category: "유리수와 소수",
    originalCategory: "수와 식",
    standardCourse: "중2 수학",
    standardUnitKey: "M2-01",
    standardUnit: "수와 식",
    standardUnitOrder: 1,
    questionType: "서술형",
    layoutTag: "subjective-2up",
    content: "[서술형 1번] 순환소수 $2.9\\dot{3}$에 자연수 $A$를 곱하면 자연수가 된다. 다음 물음에 답하시오. [7점]\\n(1) 순환소수를 $x$로 놓고 기약분수로 나타내는 과정을 서술하시오. [4점]\\n(2) $A$의 값 중 가장 작은 세 자리의 자연수를 구하시오. [3점]",
    choices: [],
    answer: "(1) $\\frac{44}{15}$, (2) 105",
    solution: "[키포인트]\\n순환소수를 분수로 변환한 뒤, 분모의 약수를 소거할 수 있는 자연수 $A$를 찾는다.\\n\\n조건 정리\\n$x = 2.9333...$ 이다.\\n\\n풀이 과정\\n(1) $100x = 293.333...$\\n$10x = 29.333...$\\n$(100x - 10x) = 293 - 29 = 264$\\n$90x = 264 \\rightarrow x = \\frac{264}{90} = \\frac{44}{15}$ 이다.\\n(2) $\\frac{44}{15} \\times A$가 자연수가 되려면 $A$는 분모 $15$의 배수여야 한다.\\n15의 배수 중 가장 작은 세 자리 자연수는 $15 \\times 7 = 105$ 이다.\\n\\n결론\\n따라서 정답은 (1) $\\frac{44}{15}$, (2) 105이다."
  },
  {
    id: 22,
    level: "중",
    category: "단항식의 계산",
    originalCategory: "수와 식",
    standardCourse: "중2 수학",
    standardUnitKey: "M2-01",
    standardUnit: "수와 식",
    standardUnitOrder: 1,
    questionType: "서술형",
    layoutTag: "subjective-2up",
    content: "[서술형 2번] $(\\frac{3x^{2}}{y^{a}})^{b} = \\frac{9x^{c}}{y^{6}}$일 때, 상수 $a, b, c$에 대하여 $a+b-c$의 값을 구하는 과정을 서술하시오. [6점]",
    choices: [],
    answer: "1",
    solution: "[키포인트]\\n지수법칙의 분배 법칙을 이용하여 좌우변의 지수를 비교한다.\\n\\n조건 정리\\n$(\\frac{3x^2}{y^a})^b = \\frac{3^b x^{2b}}{y^{ab}}$ 이다.\\n\\n풀이 과정\\n계수 비교: $3^b = 9 = 3^2 \\rightarrow b = 2$\\n$x$의 지수 비교: $2b = c \\rightarrow 2(2) = 4 \\rightarrow c = 4$\\n$y$의 지수 비교: $ab = 6 \\rightarrow a(2) = 6 \\rightarrow a = 3$\\n따라서 $a=3, b=2, c=4$ 이다.\\n구하는 값: $a+b-c = 3+2-4 = 1$ 이다.\\n\\n결론\\n따라서 구하는 값은 1이다."
  },
  {
    id: 23,
    level: "상",
    category: "일차부등식",
    originalCategory: "일차부등식",
    standardCourse: "중2 수학",
    standardUnitKey: "M2-02",
    standardUnit: "일차부등식",
    standardUnitOrder: 2,
    questionType: "서술형",
    layoutTag: "subjective-2up",
    content: "[서술형 3번] $-1 \\le x \\le 3$일 때, $a \\le 5 - \\frac{1}{2}x \\le b$이다. 이때 $4ab$의 값을 구하는 과정을 서술하시오. [7점]",
    choices: [],
    answer: "77",
    solution: "[키포인트]\\n주어진 $x$의 범위에서 일차식의 범위를 단계별로 유도한다.\\n\\n조건 정리\\n$-1 \\le x \\le 3$에서 시작하여 $5 - \\frac{1}{2}x$를 만든다.\\n\\n풀이 과정\\n1) 각 변에 $-\\frac{1}{2}$을 곱한다 (부등호 방향 반전):\\n$(-1) \\times (-\\frac{1}{2}) \\ge -\\frac{1}{2}x \\ge 3 \\times (-\\frac{1}{2})$\\n$\\frac{1}{2} \\ge -\\frac{1}{2}x \\ge -\\frac{3}{2}$\\n2) 각 변에 $5$를 더한다:\\n$5 + \\frac{1}{2} \\ge 5 - \\frac{1}{2}x \\ge 5 - \\frac{3}{2}$\\n$\\frac{11}{2} \\ge 5 - \\frac{1}{2}x \\ge \\frac{7}{2}$\\n따라서 $a = \\frac{7}{2}, b = \\frac{11}{2}$ 이다.\\n구하는 값: $4ab = 4 \\times \\frac{7}{2} \\times \\frac{11}{2} = 7 \\times 11 = 77$ 이다.\\n\\n결론\\n따라서 구하는 값은 77이다."
  }
];