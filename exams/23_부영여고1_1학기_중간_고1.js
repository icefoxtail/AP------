/**
 * 23_부영여고1_1학기_중간_고1 (v6.5.4 AP수학 마스터 엔진 교육과정 최적화본)
 * 문항 수: 22문항
 * 적용 매뉴얼: 고등부 해설 확장 모드 [MAXIMUM_EXPANSION]
 * 업데이트: 10번 문항 교육과정 외(이항정리) 해설 삭제 및 고1 과정으로 교정 완료
 */

// 파일명: 23_부영여고1_1학기_중간_고1.js
window.examTitle = "23_부영여고1_1학기_중간_고1";

window.questionBank = [
    {
        id: 1,
        level: "하",
        category: "다항식의 연산",
        content: "두 다항식 $A=-2x^2-3x+5$, $B=x^2-5x+6$에 대하여 다항식 $2A-(A-B)$를 간단히 한 것은? [3.8점]",
        choices: ["$-x^2-10x+11$", "$-x^2-9x+10$", "$-x^2-8x+11$", "$x^2+8x+10$", "$x^2+9x+11$"],
        answer: "③",
        solution: "**[Logical Anchor]** 다항식을 직접 대입하기 전 식을 먼저 정리하여 계산 실수를 방지함.\n주어진 식의 괄호를 풀고 동류항을 정리함.\n$\implies 2A - A + B = A + B$\n정리된 식 $A + B$에 각 다항식을 대입하여 나열함.\n$\implies (-2x^2 - 3x + 5) + (x^2 - 5x + 6)$\n각 차수별로 계수를 합산함.\n$\text{i) 이차항: } -2x^2 + x^2 = -x^2$\n$\text{ii) 일차항: } -3x - 5x = -8x$\n$\text{iii) 상수항: } 5 + 6 = 11$\n$\therefore -x^2 - 8x + 11$"
    },
    {
        id: 2,
        level: "하",
        category: "항등식 (수치대입법)",
        content: "모든 실수 $x$에 대하여 $a(x-1)^2+b(x-1)+c=x^2+2x$가 성립할 때, $a+b+c$의 값은? (단, $a, b, c$는 상수이다.) [3.8점]",
        choices: ["5", "6", "7", "8", "9"],
        answer: "④",
        solution: "**[Logical Anchor]** 구하고자 하는 $a+b+c$의 형태가 나오도록 $x$에 적절한 숫자를 대입함.\n좌변의 괄호 안인 $(x-1)$이 $1$이 되면 계수들의 합인 $a+b+c$가 나타남.\n$\implies x - 1 = 1$ 을 만족하는 $x = 2$ 를 양변에 대입함.\n$\text{i) 좌변: } a(2-1)^2 + b(2-1) + c = a(1)^2 + b(1) + c = a + b + c$\n$\text{ii) 우변: } 2^2 + 2(2) = 4 + 4 = 8$\n$\because$ 항등식이므로 좌변과 우변의 값은 항상 같음.\n$\therefore a + b + c = 8$"
    },
    {
        id: 3,
        level: "하",
        category: "인수정리와 연립방정식",
        content: "다항식 $f(x)=x^3+px^2+qx-2$가 $(x-1)(x+1)$로 나누어떨어질 때, $pq$의 값은? [3.8점]",
        choices: ["1", "0", "-2", "-5", "-8"],
        answer: "③",
        solution: "**[Logical Anchor]** 나누어떨어지는 인수가 주어지면 $f(\alpha)=0$임을 이용함.\n$f(x)$가 $(x-1)$과 $(x+1)$을 각각 인수로 가지므로 인수정리를 적용함.\n$\text{i) } x=1 \text{ 대입: } f(1) = 1 + p + q - 2 = 0 \implies p + q = 1 \quad \cdots (1)$\n$\text{ii) } x=-1 \text{ 대입: } f(-1) = -1 + p - q - 2 = 0 \implies p - q = 3 \quad \cdots (2)$\n$\text{iii) 연립방정식 풀이: }$\n$(1) + (2)$를 하면 $2p = 4 \implies p = 2$\n$p=2$를 $(1)$에 대입하면 $2 + q = 1 \implies q = -1$\n$\therefore p \times q = 2 \times (-1) = -2$"
    },
    {
        id: 4,
        level: "중",
        category: "조립제법의 역산",
        content: "다항식 $6x^3-x^2+bx-3$을 $x-a$로 나누는 조립제법 과정에서 $a+b+c$의 값은? [3.9점]",
        choices: ["$\\frac{1}{3}$", "$\\frac{2}{3}$", "1", "$\\frac{3}{2}$", "2"],
        answer: "②",
        solution: "**[Logical Anchor]** 조립제법의 빈칸을 채워 미정계수를 결정함.\n조립제법의 연산 규칙(내려오면 더하고, 오른쪽은 곱한다)을 적용함.\n(1) 일차항 계산: $-1 + (6 \times a) = 3$ 이므로 $6a = 4 \implies a = \\frac{2}{3}$\n(2) 이차항 이후 계산: $b + (3 \times a) = 3$ 임.\n$\implies b + (3 \times \\frac{2}{3}) = 3 \implies b + 2 = 3 \implies b = 1$\n(3) 나머지 계산: $-3 + (3 \times a) = c$ 임.\n$\implies -3 + (3 \times \\frac{2}{3}) = c \implies -3 + 2 = c \implies c = -1$\n최종 합 구하기: $a + b + c = \\frac{2}{3} + 1 + (-1) = \\frac{2}{3}$\n$\therefore \\frac{2}{3}$"
    },
    {
        id: 5,
        level: "하",
        category: "복소수의 연산",
        content: "식 $(4+3i)(1+i) + (1+i^2)$의 값은 $a+bi$이다. 이때 $a+b$의 값은? [3.9점]",
        choices: ["8", "9", "10", "11", "12"],
        answer: "①",
        solution: "**[Logical Anchor]** $i^2 = -1$ 임을 숙지하여 복소수를 실수부분과 허수부분으로 정리함.\n$\text{i) 앞의 항 전개: }$\n$(4 + 3i)(1 + i) = 4 + 4i + 3i + 3i^2 = 4 + 7i - 3 = 1 + 7i$\n$\text{ii) 뒤의 항 정리: }$\n$1 + i^2 = 1 - 1 = 0$\n$\text{iii) 전체 식 합산: }$\n$(1 + 7i) + 0 = 1 + 7i$\n$\because a = 1, b = 7$ 이므로\n$\therefore a + b = 8$"
    },
    {
        id: 6,
        level: "중",
        category: "이차방정식의 실근 조건",
        content: "이차방정식 $x^2+4x+2-a=0$이 실근을 갖도록 하는 실수 $a$의 최솟값은? [3.9점]",
        choices: ["-5", "-4", "-3", "-2", "-1"],
        answer: "④",
        solution: "**[Logical Anchor]** 실근을 가질 조건은 판별식 $D \ge 0$ 임.\n주어진 방정식의 계수는 $1, 4, (2-a)$이며, 일차항 계수가 짝수이므로 짝수 판별식 $D/4$를 사용함.\n$\\ tf{D}{4} = 2^2 - 1 \times (2 - a) \ge 0$\n$\implies 4 - 2 + a \ge 0$\n$\implies 2 + a \ge 0$\n$\implies a \ge -2$\n$\therefore a \text{의 최솟값은 } -2$임."
    },
    {
        id: 7,
        level: "하",
        category: "근과 계수의 관계와 변형",
        content: "이차방정식 $x^2-4x+2=0$의 두 근을 $\\alpha, \\beta$라 할 때, $\\alpha^3+\\beta^3$의 값은? [4점]",
        choices: ["30", "35", "40", "45", "50"],
        answer: "③",
        solution: "**[Logical Anchor]** 근과 계수의 관계를 통해 구한 기본 대칭식을 변형 공식에 대입함.\n이차방정식 $ax^2+bx+c=0$에서 두 근의 합과 곱을 구함.\n$\alpha + \beta = -\\frac{-4}{1} = 4, \quad \alpha\beta = \\frac{2}{1} = 2$\n세제곱의 합 공식을 전개함.\n$\alpha^3 + \beta^3 = (\alpha + \beta)^3 - 3\alpha\beta(\alpha + \beta)$\n구해놓은 수치를 대입하여 최종 값을 도출함.\n$\implies 4^3 - 3(2)(4) = 64 - 24 = 40$\n$\therefore 40$"
    },
    {
        id: 8,
        level: "중",
        category: "이차함수의 최대와 최소",
        content: "$1 \\le x \\le 7$일 때, 이차함수 $y=x^2-6x+1$의 최솟값을 $m$, 최댓값을 $M$이라 하자. 이때 $m+M$의 값은? [4.1점]",
        choices: ["0", "1", "2", "3", "4"],
        answer: "①",
        solution: "**[Logical Anchor]** 이차함수를 표준형으로 고쳐 그래프의 개형과 제한된 범위 내 축의 위치를 파악함.\n$\text{i) 표준형 변형: } y = (x^2 - 6x + 9) - 9 + 1 = (x - 3)^2 - 8$\n$\text{ii) 범위 내 특징 조사: }$\n대칭축 $x=3$은 주어진 범위 $1 \\le x \\le 7$ 안에 포함됨.\n$\implies$ 아래로 볼록한 함수이므로 축에서 최솟값 발생: $m = f(3) = -8$\n최댓값은 축 $x=3$으로부터 더 멀리 떨어진 경계값 $x=7$에서 발생함.\n$\implies M = f(7) = (7-3)^2 - 8 = 16 - 8 = 8$\n$\text{iii) 최종 계산: } m + M = -8 + 8 = 0$\n$\therefore 0$"
    },
    {
        id: 9,
        level: "중",
        category: "곱셈 공식의 변형 응용",
        content: "$a=-1+\\sqrt{2}, b=-1-\\sqrt{2}$일 때, $a^5+b^5+a^2b^3+a^3b^2$의 값은? [4.6점]",
        choices: ["84", "80", "-76", "-80", "-84"],
        answer: "⑤",
        solution: "**[Logical Anchor]** 식을 공통인수로 묶어 인수분해하여 연산의 복잡도를 낮춤.\n주어진 식을 정리함.\n$a^5 + b^5 + a^2b^3 + a^3b^2 = (a^5 + a^3b^2) + (b^5 + a^2b^3)$\n$= a^3(a^2 + b^2) + b^3(b^2 + a^2) = (a^3 + b^3)(a^2 + b^2)$\n두 수 $a, b$의 기본 관계를 구함.\n$a + b = -2, \quad ab = (-1)^2 - (\\sqrt{2})^2 = -1$\n$\text{i) } a^2 + b^2 = (a+b)^2 - 2ab = (-2)^2 - 2(-1) = 6$\n$\text{ii) } a^3 + b^3 = (a+b)^3 - 3ab(a+b) = (-2)^3 - 3(-1)(-2) = -8 - 6 = -14$\n따라서 최종 결과는 $(-14) \times 6 = -84$임.\n$\therefore -84$"
    },
    {
        id: 10,
        level: "중",
        category: "다항식의 전개와 나머지",
        content: "$1002^{10}$을 $250$으로 나누었을 때의 나머지는? [4.6점]",
        choices: ["10", "16", "24", "32", "40"],
        answer: "③",
        solution: "**[Logical Anchor]** 숫자를 문자로 치환하여 다항식 전개 구조의 배수 성질을 이용함.\n$x = 1000$이라 하면 $1002 = x + 2$임.\n또한 $250$은 $1000$의 약수($x = 250 \times 4$)임.\n$(x + 2)^{10}$을 전개하면 $x$를 하나라도 포함하는 항들과 마지막 상수항으로 나눌 수 있음.\n$\implies (x^{10} + \dots + 10 \cdot 2^9 x) + 2^{10}$\n$\because$ 앞의 모든 항은 $x$를 포함하므로 $1000$의 배수이며, 동시에 $250$의 배수임.\n$\implies$ 따라서 전체를 $250$으로 나눈 나머지는 상수항 $2^{10}$을 $250$으로 나눈 나머지와 같음.\n$2^{10} = 1024$ 이고, $1024 = 250 \times 4 + 24$ 임.\n$\therefore 24$"
    },
    {
        id: 11,
        level: "상",
        category: "인수분해와 삼각형의 형태",
        content: "세 변의 길이가 $a, b, c$인 삼각형 $ABC$가 (가) $a^2-3a-4=0$, (나) $a^3+b^3+ac^2+bc^2=a^2c+b^2c+2abc$를 만족할 때 둘레의 길이는? [4.6점]",
        choices: ["6", "8", "9", "10", "12"],
        answer: "⑤",
        solution: "**[Logical Anchor]** 각 변수 간의 관계식을 인수분해하여 기하학적 형태를 도출함.\n$\text{i) 조건 (가): } (a - 4)(a + 1) = 0$\n$a$는 변의 길이이므로 $a > 0 \quad \therefore a = 4$\n$\text{ii) 조건 (나) 정리: }$\n좌변: $a^3 + b^3 + c^2(a + b) = (a + b)(a^2 - ab + b^2) + c^2(a + b) = (a + b)(a^2 - ab + b^2 + c^2)$\n우변: $c(a^2 + b^2 + 2ab) = c(a + b)^2$\n양변을 $(a+b)$로 나눔 ($a+b \ne 0$)\n$a^2 - ab + b^2 + c^2 = c(a + b) = ac + bc$\n$\implies a^2 + b^2 + c^2 - ab - bc - ca = 0$\n변형 공식 $\ tf{1}{2}\\{(a-b)^2 + (b-c)^2 + (c-a)^2\\} = 0$ 에 의해 $a=b=c$임.\n$\therefore \text{둘레} = 3a = 3 \times 4 = 12$"
    },
    {
        id: 12,
        level: "상",
        category: "복소수와 차수 낮추기",
        content: "복소수 $z$와 그 켤레복소수 $\\bar{z}$에 대하여 $(1+i)z+2\\bar{z} = 4+2i$가 성립할 때, $z^3-2z^2+5z+4$의 값은? [4.7점]",
        choices: ["7-3i", "7-4i", "8-3i", "8-4i", "9-3i"],
        answer: "①",
        solution: "**[Logical Anchor]** $z=a+bi$를 대입하여 $z$를 구한 후, 이차식을 만들어 차수를 낮춤.\n$\text{i) } z \text{ 구하기: } (1+i)(a+bi) + 2(a-bi) = (a-b) + (a+b)i + 2a - 2bi = (3a-b) + (a-b)i$\n복소수의 상등에 의해: $3a-b=4, \ a-b=2 \implies a=1, \ b=-1 \quad \therefore z = 1-i$\n$\text{ii) 이차식 구성: } z-1 = -i \implies (z-1)^2 = (-i)^2 \implies z^2-2z+2=0$\n$\text{iii) 차수 낮추기: }$\n$z^3 - 2z^2 + 5z + 4 = z(z^2 - 2z + 2) + 3z + 4$\n$= 0 + 3(1 - i) + 4 = 7 - 3i$\n$\therefore 7 - 3i$"
    },
    {
        id: 13,
        level: "중",
        category: "이차함수와 직선의 위치 관계",
        content: "직선 $y=x+k$가 이차함수 $y=2x^2+8x+4$와 만나고, $y=x^2-2x+3$과는 만나지 않도록 하는 정수 $k$의 개수는? [4.7점]",
        choices: ["2", "3", "4", "5", "6"],
        answer: "②",
        solution: "**[Logical Anchor]** 두 위치 관계(실근 존재 여부)에 따른 판별식 범위를 연립함.\n$\text{i) 만나는 조건: } 2x^2+8x+4=x+k \implies 2x^2+7x+4-k=0$\n$D_1 = 49 - 8(4-k) \ge 0 \implies 8k \ge -17 \implies k \ge -2.125 \quad \cdots (1)$\n$\text{ii) 만나지 않는 조건: } x^2-2x+3=x+k \implies x^2-3x+3-k=0$\n$D_2 = 9 - 4(3-k) < 0 \implies 4k < 3 \implies k < 0.75 \quad \cdots (2)$\n공통 범위: $-2.125 \le k < 0.75$ 인 정수 $k$는 $-2, -1, 0$임.\n$\therefore 3$개"
    },
    {
        id: 14,
        level: "상",
        category: "이차방정식의 근의 위치(분리)",
        content: "이차방정식 $x^2-4x+3k-2=0$의 두 근이 모두 $1$보다 크도록 하는 실수 $k$의 범위가 $a < k \\le b$일 때, $a+b$의 값은? [4.8점]",
        choices: ["8", "$\\frac{11}{3}$", "$\\frac{14}{3}$", "$\\frac{17}{3}$", "$\\frac{20}{3}$"],
        answer: "②",
        solution: "**[Logical Anchor]** 판별식($D$), 축($x$), 경계($f(1)$)의 세 조건을 동시에 만족시켜야 함.\n(1) 판별식: $\\ tf{D}{4} = 4 - (3k-2) \ge 0 \implies 6 - 3k \ge 0 \implies k \le 2$\n(2) 대칭축: $x = 2$ 이므로 $1$보다 큼 (이미 만족)\n(3) 경계 함숫값: $f(1) = 1^2 - 4(1) + 3k - 2 > 0 \implies 3k > 5 \implies k > \\ tf{5}{3}$\n공통 범위: $\\ tf{5}{3} < k \le 2$\n$\\because a = \\ tf{5}{3}, b = 2$ 이므로 합을 구함.\n$a + b = \\ tf{5}{3} + \\ tf{6}{3} = \\ tf{11}{3}$\n$\therefore \\ tf{11}{3}$"
    },
    {
        id: 15,
        level: "중",
        category: "제한된 범위 내 이차함수 활용",
        content: "점 $P(a, b)$가 점 $A(0, 6)$에서 점 $B(3, 0)$까지 직선 $y=-2x+6$을 따라 움직일 때, $2a^2+4b$의 최솟값은? [5.1점]",
        choices: ["13", "14", "15", "16", "17"],
        answer: "④",
        solution: "**[Logical Anchor]** 움직이는 범위를 제한 조건으로 설정하여 일변수 함수의 최소를 찾음.\n$P(a, b)$가 직선 위의 점이므로 $b = -2a + 6$ 이 성립함.\n점 $A(0, 6)$에서 $B(3, 0)$까지 움직이므로 $x$좌표인 $a$의 범위는 $0 \\le a \\le 3$임.\n목표 식에 대입: $f(a) = 2a^2 + 4(-2a + 6) = 2a^2 - 8a + 24$\n표준형 변형: $2(a^2 - 4a + 4) + 16 = 2(a - 2)^2 + 16$\n축 $a=2$가 범위 $0 \\le a \\le 3$ 안에 존재하므로,\n$\therefore$ 최솟값은 $16$임."
    },
    {
        id: 16,
        level: "상",
        category: "이차함수와 직선 (기하학적 넓이)",
        content: "이차함수 $y=x^2$과 직선 $y=x+k$가 만나는 두 점 $A, B$를 통해 정의된 삼각형의 넓이 차 $S_1-S_2=32$일 때 양수 $k$는? [5.2점]",
        choices: ["13", "15", "17", "19", "21"],
        answer: "⑤",
        solution: "**[Logical Anchor]** 교점의 좌표를 근과 계수의 관계로 치환하여 넓이 관계식을 유도함.\n$x^2 - x - k = 0$ 의 두 근을 $\\alpha, \\beta \\ (\\alpha < 0 < \\beta)$라 함.\n$\alpha + \beta = 1, \\ \alpha\beta = -k$\n$S_1 = \\frac{1}{2}\\beta^3, \ S_2 = -\\frac{1}{2}\\alpha^3$ (밑변이 $-\alpha$이므로)\n$S_1 - S_2 = \\frac{1}{2}(\beta^3 + \alpha^3) = 32 \implies \alpha^3 + \beta^3 = 64$\n곱셈 공식 변형 적용:\n$(\alpha + \beta)^3 - 3\alpha\beta(\alpha + \beta) = 1^3 - 3(-k)(1) = 64$\n$1 + 3k = 64 \implies 3k = 63$\n$\therefore k = 21$"
    },
    {
        id: 17,
        level: "중",
        category: "나머지 정리 심화",
        content: "다항식 $f(x)$를 $(x^2-1)$로 나눈 몫과 나머지가 같고, 나머지가 $1$인 조건에서 $R(x)$의 계수를 구하시오. [5.2점]",
        choices: ["-2", "-1", "0", "1", "2"],
        answer: "①",
        solution: "**[Logical Anchor]** 나눗셈의 관계식을 세워 조건을 대입함.\n$f(x) = (x^2 - 1)Q(x) + R(x)$ 이고 $Q(x) = R(x) = ax + b$ 라 함.\n나머지 조건 $f(1)=1$ 을 사용함.\n$f(1) = 0 + (a+b) = 1 \implies b = 1 - a$\n$(x-1)^2(x+1)$로 나누는 식의 구조를 정리하면 $R(x) = ax + b$ 가 유지됨.\n$R(0) = b = 2$ 이므로 $1 - a = 2 \implies a = -1$\n따라서 $R(x) = -x + 2$ 이며 $x$의 계수는 $-1$임.\n$\therefore -1$"
    },
    {
        id: 18,
        level: "상",
        category: "정수 계수 다항식의 인수분해",
        content: "다항식 $3x^3+ax^2+(2a-6)x+12$가 세 일차식의 곱으로 분해되는 정수 $a$의 개수는? [5.3점]",
        choices: ["8", "6", "4", "10", "12"],
        answer: "②",
        solution: "**[Logical Anchor]** 정수 근의 후보를 찾아 인수분해를 시도함.\n$f(-2) = 0$ 임을 확인하여 $(x+2)$를 인수로 추출함.\n$3x^3 + ax^2 + (2a-6)x + 12 = (x+2)\{3x^2 + (a-6)x + 6\}$\n이차식 $3x^2 + (a-6)x + 6$ 이 두 정수 계수 일차식 $(3x+m)(x+n)$으로 분해되어야 함.\n상수항 $mn = 6$ 인 정수 쌍을 조사함.\n$\{(1,6), (6,1), (2,3), (3,2), (-1,-6), (-6,-1), (-2,-3), (-3,-2)\}$\n각 쌍에 대해 $a-6 = m+3n$ 을 만족하는 정수 $a$를 구하면 총 $6$개임.\n$\therefore 6$"
    },
    {
        id: 19,
        level: "하",
        category: "다항식의 나눗셈 (서술형)",
        content: "[서술형 1] 다항식 $x^3+x^2-4x+a$가 $x^2-2x+2$로 나누어떨어질 때 상수 $a$의 값을 구하시오. [4점]",
        choices: [" ", " ", " ", " ", " "],
        answer: "6",
        solution: "**[Logical Anchor]** 직접 나눗셈을 수행하거나 항등식의 성질을 이용함.\n$x^3 + x^2 - 4x + a = (x^2 - 2x + 2)(x + k)$ 라 둠.\n우변을 전개하여 계수를 비교함.\n$\implies x^3 + (k-2)x^2 + (2-2k)x + 2k$\n이차항: $k-2 = 1 \implies k=3$\n상수항: $2k = a \implies a = 2(3) = 6$\n$\therefore 6$"
    },
    {
        id: 20,
        level: "상",
        category: "치환을 이용한 완전제곱식 (서술형)",
        content: "[서술형 2] 주어진 사차식이 이차식 $f(x)$의 제곱으로 인수분해될 때 $k$값과 $f(1)$을 구하시오. [5점]",
        choices: [" ", " ", " ", " ", " "],
        answer: "k=1, f(1)=11",
        solution: "**[Logical Anchor]** 공통부분이 나타나도록 항을 재배치함.\n$\{(x+1)(x+4)\}\{(x+2)(x+3)\} + k$\n$= (x^2 + 5x + 4)(x^2 + 5x + 6) + k$\n$x^2 + 5x = t$ 라 치환 $\implies (t+4)(t+6) + k = t^2 + 10t + 24 + k$\n이 식이 완전제곱식이 되려면 $24+k = (\\ tf{10}{2})^2 = 25$ 여야 함.\n$\implies k = 1$\n이때의 식은 $(t+5)^2 = (x^2+5x+5)^2$ 이므로 $f(x) = x^2+5x+5$ 임.\n$f(1) = 1 + 5 + 5 = 11$\n$\therefore k=1, f(1)=11$"
    },
    {
        id: 21,
        level: "중",
        category: "이차방정식과 근과 계수의 관계 (서술형)",
        content: "[서술형 3] 두 이차방정식의 근의 관계를 통해 $a+b$를 구하시오. [5점]",
        choices: [" ", " ", " ", " ", " "],
        answer: "-27",
        solution: "(1) $\\alpha + \\beta = -4, \\ \alpha\\beta = a$\n(2) 두 번째 방정식에서 근과 계수의 관계 적용:\n$(\\alpha+\\beta) + (\\alpha-\\beta) = -b \implies -4 + (\\alpha-\\beta) = -b$\n$(\\alpha+\\beta)(\\alpha-\\beta) = -40 \implies -4(\\alpha-\\beta) = -40 \implies \\alpha-\\beta = 10$\n(3) 연립하여 미지수 결정:\n$b = -6$\n$(\\alpha-\\beta)^2 = (\\alpha+\\beta)^2 - 4\\alpha\\beta \implies 100 = 16 - 4a \implies a = -21$\n(4) 최종 합: $a+b = -21 - 6 = -27$\n$\therefore -27$"
    },
    {
        id: 22,
        level: "상",
        category: "이차함수의 최대최소의 케이스 분류 (서술형)",
        content: "[서술형 4] 제한된 범위 내에서 이차함수 최솟값이 $6$이 되는 모든 $k$의 합을 구하시오. [6점]",
        choices: [" ", " ", " ", " ", " "],
        answer: "5",
        solution: "**[Logical Anchor]** 축 $x=k$의 위치에 따라 세 구간으로 분류하여 연산함.\n$y = (x-k)^2 - k^2 + 5k$\n(1) $k < 0$: $x=0$ 최소 $\implies 5k = 6 \implies k=1.2$ (범위 밖 모순)\n(2) $0 \\le k \\le 4$: $x=k$ 최소 $\implies -k^2+5k = 6 \implies k=2, 3$ (범위 내 성립)\n(3) $k > 4$: $x=4$ 최소 $\implies 16-8k+5k = 6 \implies 3k=10 \implies k=10/3$ (범위 밖 모순)\n$\therefore 2 + 3 = 5$"
    }
];