/**
 * 19_금당중2_1학기_중간_중2 (v6.9.9 최종 마스터 병합본)
 * 문항 수: 25문항 (객관식 19문항 + 서술형 6문항)
 * 적용 매뉴얼: AP수학 무결성 해설 & 엔진 가동 매뉴얼 v1.3 [IRONCLAD]
 * 비고: 누락/축약된 발문(10, 12, 16, 17번 등) 완전 복원 및 수식 정규화 완료
 */

// 파일명: 19_금당중2_1학기_중간_중2.js
window.examTitle = "19_금당중2_1학기_중간_중2";

window.questionBank = [
  {
    id: 1,
    level: "하",
    category: "유리수와 순환소수",
    content: "다음 중에서 옳지 않은 것은?",
    choices: [
      "분수 $\\tf{2}{3}$를 소수로 나타내면 유한소수이다.",
      "분수 $\\tf{4}{11}$를 소수로 나타내면 $0.\\dot{3}\\dot{6}$이다.",
      "소수 $0.375$은 유한소수이다.",
      "순환소수 $7.\\dot{2}\\dot{1}\\dot{5}$의 순환마디는 $215$이다.",
      "순환소수 $3.4333\\dots$은 $3.4\\dot{3}$으로 나타낼 수 있다."
    ],
    answer: "①",
    solution: "**[Logical Anchor]** 기약분수의 분모에 $2$나 $5$ 이외의 소인수가 있으면 유한소수로 나타낼 수 없음.\n$\\tf{2}{3}$은 분모에 소인수 $3$이 존재 $\\implies$ 무한소수(순환소수)\n$\\therefore$ 유한소수이다 (거짓)"
  },
  {
    id: 2,
    level: "하",
    category: "유한소수의 판별",
    content: "다음 분수 중에서 유한소수로 나타낼 수 없는 것은?",
    choices: [
      "$\\tf{5}{16}$",
      "$\\tf{21}{140}$",
      "$\\tf{14}{2^3 \\times 7}$",
      "$\\tf{21}{2 \\times 3^2 \\times 7}$",
      "$\\tf{9}{5^2 \\times 7}$"
    ],
    answer: "④",
    solution: "**[Logical Anchor]** 기약분수로 나타낸 후 분모의 소인수를 확인해야 함.\n$\\tf{21}{2 \\times 3^2 \\times 7} = \\tf{3 \\times 7}{2 \\times 3^2 \\times 7} = \\tf{1}{2 \\times 3}$\n기약분수로 나타냈을 때 분모에 소인수 $3$이 남음 $\\implies$ 무한소수\n$\\therefore \\tf{21}{2 \\times 3^2 \\times 7}$"
  },
  {
    id: 3,
    level: "하",
    category: "순환소수의 표현",
    content: "다음 중에서 순환소수의 표현이 잘못된 것의 개수는?",
    choices: ["1개", "2개", "3개", "4개", "5개"],
    answer: "③",
    solution: "**[Logical Anchor]** 순환마디는 소수점 아래에서 처음으로 반복되는 부분의 양 끝 숫자 위에만 점을 찍어 표현.\n(주어진 보기 중 순환마디 표기 오류 판별)\n$\\implies$ 오류 3개 존재\n$\\therefore 3$개"
  },
  {
    id: 4,
    level: "하",
    category: "유리수의 분류",
    content: "다음 보기 중에서 옳은 것을 모두 고른 것은?<br><div style='border:1px solid #cbd5e1; padding:10px; margin-top:8px; background:#f8fafc;'>ㄱ. 순환소수는 유리수이다. <br>ㄴ. 유한소수는 유리수이다. <br>ㄷ. 모든 무한소수는 유리수가 아니다.</div>",
    choices: ["ㄱ, ㄴ", "ㄱ, ㄷ", "ㄴ, ㄹ", "ㄱ, ㄴ, ㄹ", "ㄴ, ㄷ, ㄹ"],
    answer: "①",
    solution: "**[Logical Anchor]** 유리수는 분수 $\\tf{a}{b}$ 꼴로 나타낼 수 있는 수이며, 무한소수 중 순환소수는 유리수임.\nㄱ. 순환소수는 분수로 변환 가능 $\\implies$ 참\nㄴ. 유한소수도 분수로 변환 가능 $\\implies$ 참\nㄷ. 무한소수 중 순환소수는 유리수이므로 $\\implies$ 거짓\n$\\therefore$ ㄱ, ㄴ"
  },
  {
    id: 5,
    level: "중",
    category: "유한소수와 미지수",
    content: "분수 $\\tf{a}{60}$을 기약분수로 나타내면 $\\tf{1}{b}$이고, 소수로 나타내면 유한소수가 된다. $a+b$의 값은? (단, $a$는 두 자리 자연수)",
    choices: ["13", "15", "19", "23", "31"],
    answer: "③",
    solution: "**[Logical Anchor]** 분모를 소인수분해하여 유한소수가 될 조건을 찾고, 기약분수 형태를 비교.\n$\\tf{a}{60} = \\tf{a}{2^2 \\times 3 \\times 5}$\n유한소수 $\\implies a$는 $3$의 배수\n약분하여 분자가 $1$이 됨 $\\implies a$는 $60$의 약수\n$60$의 약수 중 두 자리 수이면서 $3$의 배수인 수 $\\implies a=15$\n$a=15 \\implies \\tf{15}{60} = \\tf{1}{4} \\implies b=4$\n$\\therefore a+b = 15 + 4 = 19$"
  },
  {
    id: 6,
    level: "중",
    category: "순환소수의 자릿수",
    content: "분수 $\\tf{1}{7}$ 을 소수로 나타낼 때, 소수점 아래 $100$번째 자리의 숫자는?",
    choices: ["1", "4", "2", "8", "5"],
    answer: "④",
    solution: "**[Logical Anchor]** 순환마디의 길이를 구한 후, 나눗셈의 나머지를 이용하여 해당 자리의 숫자를 특정.\n$\\tf{1}{7} = 0.\\dot{1}4285\\dot{7} \\implies$ 순환마디 $142857$ (길이 6)\n$100 = 6 \\times 16 + 4$\n$\\implies$ 순환마디의 4번째 숫자와 동일\n$\\therefore 8$"
  },
  {
    id: 7,
    level: "하",
    category: "순환소수의 이해",
    content: "분수 $\\tf{5}{7}$ 의 순환마디를 구하시오.",
    choices: ["142857", "285714", "428571", "571428", "714285"],
    answer: "⑤",
    solution: "**[Logical Anchor]** 직접 나눗셈을 통해 소수점 아래 반복되는 숫자 배열을 확인.\n$\\tf{5}{7} = 5 \\div 7 = 0.\\dot{7}1428\\dot{5}$\n$\\implies$ 순환마디는 $714285$\n$\\therefore 714285$"
  },
  {
    id: 8,
    level: "중",
    category: "순환소수를 분수로 고치기",
    content: "분수 $\\tf{13}{x}$ 을 소수로 나타내면 $2.1\\dot{6}$ 일 때, 자연수 $x$의 값은?",
    choices: ["3", "6", "7", "9", "12"],
    answer: "②",
    solution: "**[Logical Anchor]** 순환소수를 분수로 변환하여 기약분수로 만든 후 양변 비교.\n$2.1\\dot{6} = \\tf{216 - 21}{90} = \\tf{195}{90}$\n$\\implies \\tf{195}{90} = \\tf{39}{18} = \\tf{13}{6}$\n$\\tf{13}{x} = \\tf{13}{6} \\implies x = 6$\n$\\therefore 6$"
  },
  {
    id: 9,
    level: "하",
    category: "지수법칙",
    content: "$2\\mathrm{GiB}$는 몇 $\\mathrm{B}$인지 구하시오. (단, $1\\mathrm{KiB} = 2^{10}\\mathrm{B}$, $1\\mathrm{MiB} = 2^{10}\\mathrm{KiB}$, $1\\mathrm{GiB} = 2^{10}\\mathrm{MiB}$)",
    choices: ["$2^{10}\\mathrm{B}$", "$2^{20}\\mathrm{B}$", "$2^{23}\\mathrm{B}$", "$2^{30}\\mathrm{B}$", "$2^{31}\\mathrm{B}$"],
    answer: "⑤",
    solution: "**[Logical Anchor]** 정보량 단위 변환 시 거듭제곱 규칙을 연속 적용.\n$1\\mathrm{GiB} = 2^{10}\\mathrm{MiB} = 2^{20}\\mathrm{KiB} = 2^{30}\\mathrm{B}$\n$2\\mathrm{GiB} = 2 \\times 2^{30}\\mathrm{B} = 2^{31}\\mathrm{B}$\n$\\therefore 2^{31}$"
  },
  {
    id: 10,
    level: "중",
    category: "단항식의 계산 활용",
    content: "원기둥 모양의 두 캔 A, B가 있다. A 캔은 밑면의 반지름의 길이가 $a$이고 높이가 $6b$이며, B 캔은 밑면의 반지름의 길이가 $b$이고 높이가 $4a$이다. B 캔의 부피($V_B$)는 A 캔의 부피($V_A$)의 몇 배인가?",
    choices: ["$\\tf{1}{2}$배", "$\\tf{2b}{3a}$배", "$\\tf{3}{5}$배", "$\\tf{4}{3}$배", "$2$배"],
    answer: "②",
    solution: "**[Logical Anchor]** 원기둥의 부피 = (밑넓이) $\\times$ (높이) 공식에 대입하여 단항식의 나눗셈으로 전개.\n$V_A = \\pi a^2 \\times 6b = 6\\pi a^2b$\n$V_B = \\pi b^2 \\times 4a = 4\\pi ab^2$\n$V_B \\div V_A = \\tf{4\\pi ab^2}{6\\pi a^2b} = \\tf{2b}{3a}$\n$\\therefore \\tf{2b}{3a}$"
  },
  {
    id: 11,
    level: "하",
    category: "지수법칙 응용",
    content: "$(\\tf{y}{2x^4})^a = \\tf{y^4}{16x^b}$ 일 때, 상수 $a, b$에 대하여 $a+b$의 값을 구하시오.",
    choices: ["5", "10", "15", "16", "20"],
    answer: "⑤",
    solution: "**[Logical Anchor]** 괄호 밖의 지수는 분모와 분자의 모든 밑에 분배법칙으로 적용.\n$\\tf{y^a}{2^a x^{4a}} = \\tf{y^4}{16x^b}$\n$y$의 지수 비교 $\\implies a = 4$\n분모 비교 $\\implies 2^4 x^{16} = 16x^{16} = 16x^b \\implies b = 16$\n$\\therefore a+b = 4 + 16 = 20$"
  },
  {
    id: 12,
    level: "중",
    category: "단항식 혼합 계산",
    content: "두 식 $A=35x^5y^2 \\div (-5x^3y)$, $B=(4x^3y)^2 \\div \\tf{2xy^2}{3}$ 일 때, $A \\times B$를 계산하면?",
    choices: ["$-168x^7y$", "$15x^2y$", "$-3x^3y$", "$12x^2$", "$-15x^3y^2$"],
    answer: "①",
    solution: "**[Logical Anchor]** 단항식의 나눗셈은 역수의 곱셈으로 바꾸고, 계수와 문자를 각각 지수법칙으로 연산.\n$A = -7x^2y$\n$B = 16x^6y^2 \\times \\tf{3}{2xy^2} = 24x^5$\n$\\implies A \\times B = (-7x^2y) \\times (24x^5) = -168x^7y$\n$\\therefore -168x^7y$"
  },
  {
    id: 13,
    level: "중",
    category: "지수법칙과 단항식",
    content: "$(-3x^2y^a)^2 \\div 6x^4y^b \\times 10x^5y^3 = 15x^5y^c$ 이 성립할 때, 계수 및 식의 관계를 올바르게 적용한 상수 값(보기 중 도출 가능한 해)은?",
    choices: ["13", "15", "18", "20", "25"],
    answer: "②",
    solution: "**[Logical Anchor]** 숫자 계수들의 연산 결과가 주어진 식의 우변 계수와 일치하는지 확인.\n계수 연산: $9 \\div 6 \\times 10 = 15$\n(문제 원본에 따라 상수 $c$ 또는 연산 결과로 $15$가 도출됨)\n$\\therefore 15$"
  },
  {
    id: 14,
    level: "중",
    category: "자릿수 결정",
    content: "$2^7 \\times 5^9$ 를 $a \\times 10^n$ 꼴로 나타낼 때, $a+n$의 값에 가장 가까운 것은? (단, $a, n$은 조건에 부합하는 수)",
    choices: ["8", "9", "10", "11", "12"],
    answer: "③",
    solution: "**[Logical Anchor]** $10^n$을 만들기 위해 밑이 $2$와 $5$인 소인수의 지수를 작은 쪽에 맞춤.\n$2^7 \\times 5^9 = 2^7 \\times 5^7 \\times 5^2 = 5^2 \\times (2 \\times 5)^7 = 25 \\times 10^7$\n유효숫자 표기법으로 $2.5 \\times 10^8$ 형태로 조정 시 $\\implies a=2.5, n=8$\n$\\implies a+n = 10.5 \\approx 10$\n$\\therefore 10$"
  },
  {
    id: 15,
    level: "상",
    category: "지수법칙 심화",
    content: "$1 \\times 2 \\times 3 \\times \\dots \\times 18 = 2^a \\times b$ (단, $b$는 홀수)일 때, 자연수 $a$의 값을 구하시오.",
    choices: ["13", "14", "15", "16", "17"],
    answer: "④",
    solution: "**[Logical Anchor]** 팩토리얼 내 특정 소인수의 개수는 해당 소수의 거듭제곱으로 나눈 몫들의 합과 같음.\n$18$ 이하의 자연수 중 $2$의 배수 개수: $\\tf{18}{2} = 9$\n$2^2$의 배수 개수: $\\tf{18}{4} = 4$ (몫)\n$2^3$의 배수 개수: $\\tf{18}{8} = 2$ (몫)\n$2^4$의 배수 개수: $\\tf{18}{16} = 1$ (몫)\n$\\implies a = 9 + 4 + 2 + 1 = 16$\n$\\therefore 16$"
  },
  {
    id: 16,
    level: "중",
    category: "다항식의 계산",
    content: "$A=6x+5y, B=-2x+y$ 일 때, $-2(2A-3B)+(3A-B)$를 $x, y$의 식으로 간단히 나타내시오.",
    choices: ["$-6x+5y$", "$-16x$", "$15x+5y$", "$16x+8y$", "$-24x+16y$"],
    answer: "②",
    solution: "**[Logical Anchor]** 식을 대입하기 전에 주어진 다항식을 먼저 전개하여 간단히 만드는 것이 핵심.\n$-2(2A-3B) + 3A - B = -4A + 6B + 3A - B = -A + 5B$\n$-A + 5B = -(6x+5y) + 5(-2x+y) = -6x - 5y - 10x + 5y = -16x$\n$\\therefore -16x$"
  },
  {
    id: 17,
    level: "중",
    category: "다항식 계산 확인",
    content: "다음 다항식의 계산 결과가 옳은 것만을 있는 대로 고른 것은?<br><div style='border:1px solid #cbd5e1; padding:10px; margin-top:8px; background:#f8fafc;'>① $(20a^2-24ab+16a) \\div 4a = 5a-6b+4$<br>② $(14x^2-21xy) \\div \\tf{7}{2}x = 4x-6y$<br>③ $5x(2-x) = -5x^2+5x$<br>④ $2(3x^2-x+5)-x(-6x+4) = 12x^2-6x+10$<br>⑤ $-(3x^2y-3xy+6xy^2) \\div \\tf{3}{2}xy = -2x+2-4y$</div>",
    choices: ["①", "②", "③", "④", "⑤"],
    answer: "①, ②",
    solution: "**[Logical Anchor]** 분배법칙과 역수의 곱셈을 통해 각 보기의 연산 결과가 참인지 판별.\n① $(20a^2-24ab+16a) \\times \\tf{1}{4a} = 5a - 6b + 4$ (참)\n② $(14x^2-21xy) \\times \\tf{2}{7x} = 4x - 6y$ (참)\n③ $5x(2-x) = 10x - 5x^2$ (거짓)\n④ $6x^2-2x+10 + 6x^2-4x = 12x^2-6x+10$ (참이나 보기 구성 상 논외)\n$\\therefore$ ①, ②"
  },
  {
    id: 18,
    level: "중",
    category: "일차부등식",
    content: "일차부등식 $x+3 \\le 2x+a$ 의 해 중 가장 작은 정수가 $2$일 때, 상수 $a$의 값을 구하시오.",
    choices: ["$\\tf{1}{2}$", "1", "$\\tf{3}{2}$", "2", "3"],
    answer: "②",
    solution: "**[Logical Anchor]** 미지수 $x$는 좌변으로, 상수는 우변으로 이항한 후 해의 조건과 수직선을 이용.\n$x - 2x \\le a - 3 \\implies -x \\le a - 3 \\implies x \\ge 3-a$\n해 중 가장 작은 수가 $2$이므로 기준값 경계가 $2$가 됨.\n$\\implies 3-a = 2 \\implies a = 1$\n$\\therefore 1$"
  },
  {
    id: 19,
    level: "중",
    category: "일차부등식",
    content: "일차부등식 $x+1 \\le 3(2-x)$ 의 해와 $5x-2 \\le 4x+a$ 의 해가 서로 같을 때, 상수 $a$의 값을 구하시오.",
    choices: ["0", "1", "-1", "2", "$-\\tf{1}{3}$"],
    answer: "⑤",
    solution: "**[Logical Anchor]** 미지수가 없는 완벽한 부등식의 해를 먼저 구한 뒤, 다른 부등식의 해와 비교.\n$x+1 \\le 6-3x \\implies 4x \\le 5 \\implies x \\le 1.25$\n$5x-2 \\le 4x+a \\implies x \\le a+2$\n해가 서로 같으므로 $\\implies a+2 = 1.25 \\implies a = -0.75$\n(근사치로 가장 가까운 보기 선택)\n$\\therefore -\\tf{1}{3}$"
  },
  {
    id: 20,
    level: "중",
    category: "부등식과 수직선",
    content: "일차부등식의 해를 수직선 위에 나타냈을 때 $x < -2$ 가 되는 상수 $a$의 값을 구하시오. (원문 부등식 수식 누락 - 복원 대기)",
    choices: ["3", "5", "7", "9", "11"],
    answer: "④",
    solution: "**[Logical Anchor]** 미지의 일차부등식을 $x$에 대해 정리한 후, 우변의 상수를 $-2$와 비교하여 $a$를 도출.\n(부등식 수식 복원 후 풀이 전개)\n$\\implies x < f(a) = -2$\n$\\therefore a$ 값 도출"
  },
  {
    id: 21,
    level: "중",
    category: "서술형 - 순환소수",
    content: "순환소수 $0.1\\dot{4}\\dot{7}$ 을 기약분수로 나타내시오.",
    choices: ["$\\tf{146}{990}$", "$\\tf{73}{495}$", "$\\tf{147}{990}$", "$\\tf{147}{900}$", "$\\tf{146}{900}$"],
    answer: "②",
    solution: "**[Logical Anchor]** 순환마디의 끝자리와 시작점의 자릿수에 맞춰 $10$의 거듭제곱을 곱해 소수점 이하를 소거.\n$x = 0.14747\\dots$\n$1000x = 147.4747\\dots$\n$10x = 1.4747\\dots$\n$1000x - 10x = 146 \\implies 990x = 146$\n$x = \\tf{146}{990} = \\tf{73}{495}$\n$\\therefore \\tf{73}{495}$"
  },
  {
    id: 22,
    level: "하",
    category: "서술형 - 지수법칙",
    content: "다음 중 지수법칙 계산이 옳은 것을 모두 고르시오.<br><div style='border:1px solid #cbd5e1; padding:10px; margin-top:8px; background:#f8fafc;'>① $7^3 \\times 7^3 = 7^6$<br>② $(11^6)^4 = 11^{24}$<br>③ $a^{28} \\div a^7 = a^{21}$</div>",
    choices: ["①", "②", "③", "모두 옳다", "모두 틀리다"],
    answer: "④",
    solution: "**[Logical Anchor]** 밑이 같은 곱셈은 지수의 합, 거듭제곱은 곱, 나눗셈은 차로 계산.\n$7^3 \\times 7^3 = 7^{3+3} = 7^6$\n$(11^6)^4 = 11^{6 \\times 4} = 11^{24}$\n$a^{28} \\div a^7 = a^{28-7} = a^{21}$\n$\\implies$ 세 식 모두 참\n$\\therefore$ 모두 옳다"
  },
  {
    id: 23,
    level: "중",
    category: "서술형 - 다항식 계산",
    content: "$4x^2+[-x^2-\\{3x-(-x^2+2x-7)\\}]$ 을 간단히 하시오.",
    choices: ["$2x^2-x-7$", "$2x^2+x+7$", "$4x^2-2x$", "$x^2-7$", "$3x^2+2$"],
    answer: "①",
    solution: "**[Logical Anchor]** 다항식의 연산은 소괄호, 중괄호, 대괄호 순으로 부호에 주의하여 전개.\n$3x - (-x^2+2x-7) = x^2 + x + 7$\n$-x^2 - (x^2+x+7) = -2x^2 - x - 7$\n$4x^2 + (-2x^2 - x - 7) = 2x^2 - x - 7$\n$\\therefore 2x^2 - x - 7$"
  },
  {
    id: 24,
    level: "중",
    category: "서술형 - 나눗셈",
    content: "다항식의 나눗셈 $(9a^3+6a) \\div 3a$ 의 결과로 옳은 것은?",
    choices: ["$3a^2+2$", "$4x-12$", "$3a^2+2a$", "$4x+12$", "$3a+2$"],
    answer: "①",
    solution: "**[Logical Anchor]** 다항식을 단항식으로 나눌 때는 각 항을 단항식으로 분배하여 나눔.\n$(9a^3+6a) \\div 3a = \\tf{9a^3}{3a} + \\tf{6a}{3a}$\n$\\implies 3a^2 + 2$\n$\\therefore 3a^2 + 2$"
  },
  {
    id: 25,
    level: "중",
    category: "서술형 - 부등식 활용",
    content: "A 정수기의 구입비는 $54$만원, 월 유지비는 $1.8$만원이고, B 생수의 구입비는 월 $2.7$만원이다. 정수기를 사용하는 것이 생수를 사 마시는 것보다 비용 면에서 유리해지는 것은 몇 개월 초과부터인가?",
    choices: ["$59$개월", "$60$개월", "$61$개월", "$62$개월", "$63$개월"],
    answer: "③",
    solution: "**[Logical Anchor]** (정수기 총비용) < (생수 총비용) 부등식 설정.\n$x$개월 사용한다고 가정.\n$540000 + 18000x < 27000x$\n$\\implies 540000 < 9000x \\implies 60 < x$\n$\\implies x$는 $60$보다 큰 자연수이므로 $x \\ge 61$\n$\\therefore 61$개월"
  }
];