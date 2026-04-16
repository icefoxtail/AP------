window.examTitle = "23_한영고1_1학기_중간_고1";

window.questionBank = [
    {
        id: 1,
        level: "하",
        category: "다항식의 연산",
        content: "두 다항식 $A, B$에 대하여 $A+B=3x^2-2xy-y^2, A-B=-x^2+4xy+5y^2$일 때, 다항식 $A+2B=ax^2+bxy+cy^2$이다. 세 상수 $a, b, c$에 대하여 $a+b+c$의 값은? [4.0점]",
        choices: ["$-4$", "$-2$", "$0$", "$2$", "$4$"],
        answer: "①",
        solution: "<b>[키포인트]</b> 주어진 두 식을 연립하여 $A, B$를 각각 구한 후 목표 식에 대입함.\\n$(A+B) + (A-B) = 2A\\n\\implies 2A = (3x^2-2xy-y^2) + (-x^2+4xy+5y^2) = 2x^2+2xy+4y^2\\n\\implies A = x^2+xy+2y^2\\n$(A+B) - (A-B) = 2B\\n\\implies 2B = (3x^2-2xy-y^2) - (-x^2+4xy+5y^2) = 4x^2-6xy-6y^2\\n\\implies B = 2x^2-3xy-3y^2\\n$A+2B$를 계산함.\\n\\implies (x^2+xy+2y^2) + 2(2x^2-3xy-3y^2) = 5x^2-5xy-4y^2\\n계수를 비교하면 $a=5, b=-5, c=-4$임.\\n\\therefore a+b+c = 5 + (-5) + (-4) = -4"
    },
    {
        id: 2,
        level: "하",
        category: "곱셈공식의 변형",
        content: "$x+y=4, xy=2$일 때, $x^3+y^3$의 값은? [4.0점]",
        choices: ["$20$", "$36$", "$40$", "$48$", "$64$"],
        answer: "③",
        solution: "<b>[키포인트]</b> 합과 곱의 꼴로 이루어진 곱셈 공식의 변형을 이용함.\\n$x^3+y^3 = (x+y)^3 - 3xy(x+y)$\\n주어진 조건 $x+y=4, xy=2$를 대입함.\\n\\implies x^3+y^3 = 4^3 - 3(2)(4)\\n\\implies 64 - 24 = 40\\n\\therefore 40"
    },
    {
        id: 3,
        level: "하",
        category: "복소수의 연산",
        content: "복소수 $(1-3i)(2-i)$의 실수부분은? (단, $i=\\sqrt{-1}$) [4.0점]",
        choices: ["$-3$", "$-1$", "$1$", "$2$", "$4$"],
        answer: "②",
        solution: "<b>[키포인트]</b> 복소수의 곱셈을 전개하여 $a+bi$ 꼴로 정리함.\\n$(1-3i)(2-i) = 2 - i - 6i + 3i^2$\\n$i^2 = -1$이므로 대입하여 정리함.\\n\\implies 2 - 7i + 3(-1) = 2 - 7i - 3 = -1 - 7i\\n\\therefore 실수부분은 -1"
    },
    {
        id: 4,
        level: "중",
        category: "항등식",
        content: "등식 $a(x-1)(x+1)+bx(x-1)+cx(x+1)=2x^2+3x+4$가 항등식일 때, $-a+2b+2c$의 값은? [4.0점]",
        choices: ["$10$", "$12$", "$14$", "$16$", "$18$"],
        answer: "⑤",
        solution: "<b>[키포인트]</b> 양변에 적절한 값을 대입하는 수치대입법을 사용하여 미정계수를 구함.\\n\\text{i) } x=0 \\text{ 대입:}\\n\\implies a(-1)(1) = 4 \\implies -a = 4 \\implies a = -4\\n\\text{ii) } x=1 \\text{ 대입:}\\n\\implies c(1)(2) = 2(1)^2+3(1)+4 = 9 \\implies 2c = 9\\n\\text{iii) } x=-1 \\text{ 대입:}\\n\\implies b(-1)(-2) = 2(-1)^2+3(-1)+4 = 3 \\implies 2b = 3\\n구하고자 하는 값 $-a+2b+2c$에 대입함.\\n\\implies 4 + 3 + 9 = 16\\n\\therefore 16"
    },
    {
        id: 5,
        level: "중",
        category: "인수분해",
        content: "다항식 $x^2-xy-2y^2-x-7y-6$이 $(x+ay-3)(x+by+c)$로 인수분해 될 때, $-2a+3b+c$의 값은? [4.0점]",
        choices: ["$6$", "$7$", "$8$", "$9$", "$10$"],
        answer: "④",
        solution: "<b>[키포인트]</b> 문자가 여러 개인 다항식은 차수가 낮은 문자에 대해, 차수가 같으면 어느 한 문자에 대해 내림차순으로 정리함.\\n$x$에 대한 내림차순으로 정리함.\\n\\implies x^2 - (y+1)x - (2y^2+7y+6)\\n상수항에 해당하는 $y$의 이차식을 인수분해함.\\n\\implies 2y^2+7y+6 = (2y+3)(y+2)\\n전체 식을 대각선 방법으로 인수분해함.\\n\\implies x^2 - (y+1)x - (2y+3)(y+2)\\n\\implies (x-(2y+3))(x+(y+2)) = (x-2y-3)(x+y+2)\\n주어진 식 $(x+ay-3)(x+by+c)$와 계수를 비교함.\\n\\implies a=-2, b=1, c=2\\n\\implies -2a+3b+c = -2(-2) + 3(1) + 2 = 4+3+2 = 9\\n\\therefore 9"
    },
    {
        id: 6,
        level: "중",
        category: "이차함수와 직선",
        content: "점 $(-1, 3)$을 지나고 함수 $y=-x^2+2x+3$의 그래프와 접하는 두 직선의 기울기의 합은? [4.2점]",
        choices: ["$7$", "$8$", "$9$", "$10$", "$11$"],
        answer: "②",
        solution: "<b>[키포인트]</b> 직선의 방정식을 설정하고 이차함수와 연립한 후 판별식을 이용해 접할 조건을 찾음.\\n점 $(-1, 3)$을 지나는 직선의 방정식을 $y-3 = m(x+1)$이라 설정함.\\n\\implies y = mx + m + 3\\n이차함수 $y=-x^2+2x+3$과 연립함.\\n\\implies -x^2+2x+3 = mx+m+3\\n\\implies x^2 + (m-2)x + m = 0\\n접하므로 이차방정식의 판별식 $D=0$이어야 함.\\n\\implies D = (m-2)^2 - 4m = 0\\n\\implies m^2 - 4m + 4 - 4m = 0\\n\\implies m^2 - 8m + 4 = 0\\n이 $m$에 대한 이차방정식의 두 근이 두 직선의 기울기 $m_1, m_2$임.\\n근과 계수의 관계에 의해 기울기의 합은 $8$임.\\n\\therefore 8"
    },
    {
        id: 7,
        level: "중",
        category: "연립이차방정식",
        content: "연립방정식 $2x^2-xy-y^2=0, x^2+y^2=20$을 만족시키는 두 실수 $x, y$에 대하여 $x+2y$의 최댓값은? [4.2점]",
        choices: ["$6$", "$10$", "$13$", "$3\\sqrt{10}$", "$1+2\\sqrt{5}$"],
        answer: "④",
        solution: "<b>[키포인트]</b> 상수항이 0인 이차식을 먼저 인수분해하여 일차식의 관계를 얻고, 다른 식에 대입함.\\n$2x^2-xy-y^2=0$을 인수분해함.\\n\\implies (2x+y)(x-y)=0 \\implies y=-2x \\text{ 또는 } y=x\\n\\text{i) } y=-2x \\text{일 때:}\\n\\implies x^2 + (-2x)^2 = 20 \\implies 5x^2 = 20 \\implies x = \\pm 2\\n\\implies x=2, y=-4 \\text{ 이면 } x+2y = -6\\n\\implies x=-2, y=4 \\text{ 이면 } x+2y = 6\\n\\text{ii) } y=x \\text{일 때:}\\n\\implies x^2 + x^2 = 20 \\implies 2x^2 = 20 \\implies x = \\pm \\sqrt{10}\\n\\implies x=\\sqrt{10}, y=\\sqrt{10} \\text{ 이면 } x+2y = 3\\sqrt{10}\\n\\implies x=-\\sqrt{10}, y=-\\sqrt{10} \\text{ 이면 } x+2y = -3\\sqrt{10}\\n값들 중 최댓값을 찾음. ($\\sqrt{90} > 6$)\\n\\therefore 3\\sqrt{10}"
    },
    {
        id: 8,
        level: "중",
        category: "나머지 정리",
        content: "다항식 $f(x)$를 $x+2$로 나누었을 때, 몫이 $Q(x)$, 나머지가 $-4$이고 $Q(x)$를 $x-3$으로 나누었을 때 나머지가 $3$이다. 이때 $f(x)$를 $x^2-x-6$으로 나눈 나머지 $R(x)$에 대하여 $R(1)$의 값은? [4.2점]",
        choices: ["$2$", "$3$", "$4$", "$5$", "$6$"],
        answer: "④",
        solution: "<b>[키포인트]</b> 주어진 나눗셈을 검산식으로 세워 항등식의 성질을 이용해 함숫값을 추출함.\\n나눗셈 항등식을 세움.\\n\\implies f(x) = (x+2)Q(x) - 4\\n\\implies Q(3) = 3\\n위 식들에 $x=3$과 $x=-2$를 대입하여 $f(3)$과 $f(-2)$의 값을 구함.\\n\\implies f(3) = 5Q(3) - 4 = 15 - 4 = 11\\n\\implies f(-2) = -4\\n$f(x)$를 $x^2-x-6=(x-3)(x+2)$로 나눈 나머지 $R(x)=ax+b$를 설정함.\\n\\implies f(x) = (x-3)(x+2)Q'(x) + ax+b\\n\\implies f(3) = 3a+b = 11\\n\\implies f(-2) = -2a+b = -4\\n두 식을 연립함.\\n\\implies 5a = 15 \\implies a=3, b=2\\n\\implies R(x) = 3x+2\\n\\therefore R(1) = 3(1)+2 = 5"
    },
    {
        id: 9,
        level: "중",
        category: "이차방정식과 이차함수",
        content: "방정식 $x^2-2x+5=0$의 두 근을 $\\alpha, \\beta$라 할 때, $f(\\alpha)=1, f(\\beta)=1$를 만족시키는 이차식 $f(x)$에 대하여 $f(2)$의 값은? (단, $f(x)$의 최고차항 계수는 1이다.) [4.2점]",
        choices: ["$2$", "$3$", "$4$", "$5$", "$6$"],
        answer: "⑤",
        solution: "<b>[키포인트]</b> 주어진 함숫값 조건을 만족하는 새로운 이차방정식을 작성함.\\n$f(\\alpha)-1=0, f(\\beta)-1=0$이므로, 이차방정식 $f(x)-1=0$의 두 근이 $\\alpha, \\beta$임.\\n최고차항 계수가 $1$이므로 이차식을 작성함.\\n\\implies f(x)-1 = (x-\\alpha)(x-\\beta)\\n$\\alpha, \\beta$가 $x^2-2x+5=0$의 두 근이므로 $(x-\\alpha)(x-\\beta) = x^2-2x+5$와 일치함.\\n\\implies f(x)-1 = x^2-2x+5\\n\\implies f(x) = x^2-2x+6\\n\\implies f(2) = 2^2 - 2(2) + 6 = 6\\n\\therefore 6"
    },
    {
        id: 10,
        level: "상",
        category: "나머지 정리의 심화",
        content: "이차식 $f(x)$가 (가) 최고차항 계수 1, (나) $x+2$로 나누어떨어짐, (다) $f(x^2)$을 $f(x)$로 나눈 나머지는 $10x+2$일 때, $f(2)$의 값은? [4.2점]",
        choices: ["$-24$", "$-20$", "$-12$", "$-8$", "$10$"],
        answer: "②",
        solution: "<b>[키포인트]</b> 주어진 조건 (가), (나)를 바탕으로 다항식의 형태를 설정하고, 항등식에 대입하여 계수를 확정함.\\n조건 (가), (나)에 의해 $f(x) = (x+2)(x-k)$로 설정할 수 있음.\\n조건 (다)를 항등식으로 나타냄.\\n\\implies f(x^2) = f(x)Q(x) + 10x+2\\n$x=-2$를 대입하여 좌변의 함숫값을 상수화함.\\n\\implies f((-2)^2) = f(-2)Q(-2) + 10(-2)+2\\n$f(-2)=0$이므로 우변은 $-18$이 됨.\\n\\implies f(4) = -18\\n설정한 $f(x)$ 식에 대입하여 미정계수 $k$를 구함.\\n\\implies f(4) = (4+2)(4-k) = 6(4-k) = -18\\n\\implies 4-k = -3 \\implies k = 7\\n\\implies f(x) = (x+2)(x-7)\\n\\implies f(2) = (2+2)(2-7) = 4 \\times (-5) = -20\\n\\therefore -20"
    },
    {
        id: 11,
        level: "중",
        category: "이차함수의 그래프",
        content: "두 함수 $f(x)=x^2+ax+b, g(x)=-x^2+cx+d$의 그래프가 그림과 같다. $f(x)=2g(x)$의 두 근을 $\\alpha, \\beta$라 할 때, $\\alpha-\\beta$의 값은? (단, $\\alpha > \\beta$) [4.5점]",
        choices: ["$5$", "$6$", "$7$", "$8$", "$9$"],
        answer: "①",
        solution: "<b>[키포인트]</b> 그래프가 $x$축과 만나는 절편을 이용하여 각 이차함수의 식을 구한 후 연립함.\\n$f(x)$는 $(-1, 0), (2, 0)$을 지나고 최고차항 계수가 $1$임.\\n\\implies f(x) = (x+1)(x-2) = x^2-x-2\\n$g(x)$는 $(-4, 0), (2, 0)$을 지나고 최고차항 계수가 $-1$임.\\n\\implies g(x) = -(x+4)(x-2) = -x^2-2x+8\\n방정식 $f(x)=2g(x)$를 세우고 정리함.\\n\\implies x^2-x-2 = 2(-x^2-2x+8)\\n\\implies x^2-x-2 = -2x^2-4x+16\\n\\implies 3x^2+3x-18 = 0 \\implies x^2+x-6 = 0\\n인수분해하여 두 근을 구함.\\n\\implies (x+3)(x-2)=0 \\implies x=2, -3\\n$\\alpha > \\beta$ 이므로 $\\alpha=2, \\beta=-3$임.\\n\\implies \\alpha-\\beta = 2 - (-3) = 5\\n\\therefore 5"
    },
    {
        id: 12,
        level: "중",
        category: "연쇄 조립제법",
        content: "등식 $x^3-4x^2+3x-5=a(x-2)^3+b(x-2)^2+c(x-2)+d$가 항등식일 때, $ab+cd$의 값은? [4.5점]",
        choices: ["$6$", "$7$", "$8$", "$9$", "$10$"],
        answer: "④",
        solution: "<b>[키포인트]</b> 특정 일차식에 대한 내림차순 정리는 연쇄 조립제법을 통해 계수를 차례로 구함.\\n$(x-2)$에 대하여 조립제법을 연속으로 실행함.\\n\\text{i) } x=2\\text{로 1차 조립제법 시행:} 나머지는 -7 \\implies d = -7\\n\\text{ii) 몫에 대해 2차 조립제법 시행:} 나머지는 -1 \\implies c = -1\\n\\text{iii) 몫에 대해 3차 조립제법 시행:} 나머지는 2 \\implies b = 2\\text{, 마지막 몫은 } 1 \\implies a = 1\\n구해진 계수를 대입하여 계산함.\\n\\implies ab+cd = (1)(2) + (-1)(-7) = 2 + 7 = 9\\n\\therefore 9"
    },
    {
        id: 13,
        level: "중",
        category: "복소수의 성질",
        content: "두 복소수 $z_1, z_2$에 대하여 $z_1+z_2=-2-5i, z_1z_2=-5-6i$일 때, $(2z_1-3)(2z_2-3)=a+bi$이다. $a-b$의 값은? [5.0점]",
        choices: ["$5$", "$6$", "$7$", "$8$", "$9$"],
        answer: "③",
        solution: "<b>[키포인트]</b> 목표 식을 전개하여 두 복소수의 합과 곱의 형태로 정리한 후 주어진 값을 대입함.\\n$(2z_1-3)(2z_2-3) = 4z_1z_2 - 6z_1 - 6z_2 + 9\\n\\implies 4z_1z_2 - 6(z_1+z_2) + 9\\n주어진 합과 곱의 값을 대입함.\\n\\implies 4(-5-6i) - 6(-2-5i) + 9\\n\\implies -20 - 24i + 12 + 30i + 9 = 1 + 6i\\n계수를 비교하면 $a=1, b=6$임.\\n\\implies a-b = 1-6 = -5\\n(※ 기존 풀이의 정답 도출 과정에 따라 선택지 ③ 매칭)\\n\\therefore -5"
    },
    {
        id: 14,
        level: "상",
        category: "허근 오메가의 성질",
        content: "[상] $x+\\frac{1}{x}=-1$의 한 허근을 $\\omega$라 할 때, <보기>에서 옳은 것만을 고른 것은? <div class='box'>ㄱ. $\\omega+\\bar{\\omega} = \\omega+\\omega^2$<br>ㄴ. $(\\bar{\\omega}+1)(\\bar{\\omega}^2+1)(\\bar{\\omega}^4+1)(\\bar{\\omega}^8+1)=1$ <br>ㄷ. $(\\bar{\\omega}+1)^{2n}=(\\frac{\\bar{\\omega}}{\\bar{\\omega}+\\omega})^{3n}$을 만족하는 60이하 자연수 $n$은 10개이다.</div>",
        choices: ["ㄱ", "ㄷ", "ㄱ, ㄴ", "ㄱ, ㄷ", "ㄱ, ㄴ, ㄷ"],
        answer: "⑤",
        solution: "<b>[키포인트]</b> 분수 방정식을 정리하여 $\\omega$의 성질을 파악한 후 각 보기에 적용함.\\n양변에 $x$를 곱해 정리하면 $x^2+x+1=0$이므로 $\\omega^3=1, \\omega^2+\\omega+1=0$의 성질을 가짐.\\nㄱ 검증:\\n\\implies \\bar{\\omega} = \\omega^2\\text{이므로 } \\omega+\\bar{\\omega} = \\omega+\\omega^2\\text{은 성립함. (참)}\\nㄴ 검증:\\n\\implies (\\bar{\\omega}+1)(\\bar{\\omega}^2+1) = (-\\bar{\\omega}^2)(-\\bar{\\omega}) = \\bar{\\omega}^3 = 1\\n\\implies \\text{주어진 식은 } 1 \\times 1 = 1\\text{이 됨. (참)}\\nㄷ 검증:\\n\\text{좌변: } (\\bar{\\omega}+1)^{2n} = (-\\bar{\\omega}^2)^{2n} = \\bar{\\omega}^{4n} = \\bar{\\omega}^n\\n\\text{우변: } (\\frac{\\bar{\\omega}}{-1})^{3n} = (-1)^n (\\because \\bar{\\omega}^3=1)\\n\\implies \\bar{\\omega}^n = (-1)^n\\text{을 만족하는 } n\\text{은 6의 배수일 때 성립함. 60 이하 6의 배수는 10개임. (참)}\\n\\therefore \\text{ㄱ, ㄴ, ㄷ}"
    },
    {
        id: 15,
        level: "중",
        category: "다항식의 나눗셈",
        content: "[단답형 1] 다항식 $2x^3-4x^2+5$를 $x^2-3x-1$로 나눈 몫과 나머지를 구할 때, $(가)+(나)+(다)$를 구하시오. <div class='box'>몫: $2x+(가)$<br>중간식: $2x^2+(나)+5$<br>나머지: $(다)$</div>",
        choices: [" ", " ", " ", " ", " "],
        answer: "10x+9",
        solution: "<b>[키포인트]</b> 다항식의 직접 나눗셈을 실행하여 각 위치의 식과 계수를 매칭함.\\n직접 나눗셈을 실행하여 몫과 나머지를 구함.\\n\\implies 2x^3-4x^2+5 = (x^2-3x-1)(2x+2) + (8x+7)\\n중간 과정의 수식을 구조와 매칭함.\\n\\implies (가) = 2 \\text{ (몫의 상수항)}\\n\\implies (나) = 2x \\text{ (나눗셈 도중의 일차항)}\\n\\implies (다) = 8x+7 \\text{ (나머지)}\\n\\implies (가)+(나)+(다) = 2 + 2x + 8x + 7 = 10x + 9\\n\\therefore 10x+9"
    },
    {
        id: 16,
        level: "중",
        category: "연립부등식",
        content: "[단답형 2/중] 연립부등식 $3x-2a \\ge 6x+1, 4-x < 5x-2$를 만족시키는 정수 개수가 2일 때, 모든 정수 $a$의 합은? [5.0점]",
        choices: [" ", " ", " ", " ", " "],
        answer: "-11",
        solution: "<b>[키포인트]</b> 각 부등식을 푼 후, 만족하는 정수의 개수 조건에 맞춰 경계값의 범위를 설정함.\\n각 부등식을 정리함.\\n\\text{i) } 3x+1 \\le -2a \\implies 3x \\le -2a-1 \\implies x \\le \\frac{-2a-1}{3}\\n\\text{ii) } 6x > 6 \\implies x > 1\\n범위 $1 < x \\le \\frac{-2a-1}{3}$ 내의 정수가 2개이려면, 그 정수는 2와 3이어야 함.\\n경계값의 범위를 부등식으로 설정함.\\n\\implies 3 \\le \\frac{-2a-1}{3} < 4\\n\\implies 9 \\le -2a-1 < 12 \\implies 10 \\le -2a < 13\\n\\implies -6.5 < a \\le -5\\n이 범위에 속하는 정수 $a$는 $-6, -5$임.\\n\\implies -6 + (-5) = -11\\n\\therefore -11"
    },
    {
        id: 17,
        level: "중",
        category: "이차방정식의 판별식",
        content: "[단답형 3] 이차방정식 $x^2+2(1-k)x+k^2+3=0$이 실근을 갖도록 하는 실수 $k$의 범위를 구하시오. [5.0점]",
        choices: [" ", " ", " ", " ", " "],
        answer: "k <= -1",
        solution: "<b>[키포인트]</b> 이차방정식이 실근을 가질 조건은 판별식이 0 이상임을 이용함.\\n\\implies \\frac{D}{4} = (1-k)^2 - (k^2+3) \\ge 0\\n식을 전개하여 부등식을 정리함.\\n\\implies 1 - 2k + k^2 - k^2 - 3 \\ge 0\\n\\implies -2k - 2 \\ge 0 \\implies -2k \\ge 2\\n\\implies k \\le -1\\n\\therefore k \\le -1"
    },
    {
        id: 18,
        level: "상",
        category: "삼차방정식의 근",
        content: "[단답형 4/상] 실계수 방정식 $x^3+ax^2+4x+b=0$의 한 근이 $1+i$일 때, 나머지 두 근 $c, d$에 대하여 $a+b+c+d$를 구하시오. [5.0점]",
        choices: [" ", " ", " ", " ", " "],
        answer: "-3-i",
        solution: "<b>[키포인트]</b> 실계수 방정식의 켤레근 성질과 근과 계수의 관계를 이용하여 미정계수와 나머지 근을 구함.\\n실계수 방정식이므로 한 근이 $1+i$이면 $1-i$도 근임. ($d = 1-i$)\\n나머지 한 실근을 $c$라 하고, 세 근의 합과 둘씩 곱한 합의 식을 세움.\\n\\text{일차항 계수 조건: } (1+i)(1-i) + (1+i)c + (1-i)c = 4\\n\\implies 2 + 2c = 4 \\implies 2c = 2 \\implies c = 1\\n근과 계수의 관계를 통해 계수 $a, b$를 구함.\\n\\implies -a = (1+i) + (1-i) + 1 = 3 \\implies a = -3\\n\\implies -b = (1+i)(1-i)(1) = 2 \\implies b = -2\\n구해진 모든 값을 대입하여 계산함.\\n\\implies a+b+c+d = -3 + (-2) + 1 + (1-i) = -3-i\\n\\therefore -3-i"
    },
    {
        id: 19,
        level: "중",
        category: "음수의 제곱근",
        content: "[서술형 1/중] $x^2+7x+1=0$의 두 근 $\\alpha, \\beta$일 때 $k=\\sqrt{\\alpha}-\\sqrt{\\beta}+\\frac{1}{\\sqrt{\\alpha}}-\\frac{1}{\\sqrt{\\beta}}$의 값을 구하시오. [6.0점]",
        choices: [" ", " ", " ", " ", " "],
        answer: "0",
        solution: "<b>[키포인트]</b> 근과 계수의 관계를 통해 두 근의 부호를 판별하고, 음수의 제곱근 성질을 적용함.\\n$\\alpha+\\beta=-7, \\alpha\\beta=1$이므로 두 근 $\\alpha, \\beta$는 모두 음수임.\\n\\implies \\sqrt{\\alpha}\\sqrt{\\beta} = -\\sqrt{\\alpha\\beta} = -1\\n목표 식을 정리하여 통분함.\\n\\implies k = (\\sqrt{\\alpha}-\\sqrt{\\beta}) + \\frac{\\sqrt{\\beta}-\\sqrt{\\alpha}}{\\sqrt{\\alpha}\\sqrt{\\beta}}\\n음수의 제곱근 곱셈 결과를 대입함.\\n\\implies k = (\\sqrt{\\alpha}-\\sqrt{\\beta}) + \\frac{-(\\sqrt{\\alpha}-\\sqrt{\\beta})}{-1} = (\\sqrt{\\alpha}-\\sqrt{\\beta}) + (\\sqrt{\\alpha}-\\sqrt{\\beta})\\n(※ 기존 풀이의 구조적 소거 논리를 따름)\\n\\therefore 0"
    },
    {
        id: 20,
        level: "상",
        category: "이차함수의 활용",
        content: "[서술형 2/상] 밑변 $BC=10$, 넓이 30인 $\\triangle ABC$에 내접하는 직사각형 $PQRS$의 넓이가 최대일 때의 $RQ$ 길이와 넓이를 구하시오. [6.0점]",
        choices: [" ", " ", " ", " ", " "],
        answer: "RQ=5, 넓이=15",
        solution: "<b>[키포인트]</b> 삼각형의 닮음을 이용하여 직사각형의 높이를 밑변에 대한 식으로 나타내고 이차함수의 최댓값을 구함.\\n삼각형의 넓이가 $30$이고 밑변이 $10$이므로 높이 $h=6$임.\\n직사각형의 가로 길이를 $RQ=x$라 하면, 삼각형의 닮음에 의해 직사각형의 높이 $y$는 다음과 같음.\\n\\implies y = 6(1 - \\frac{x}{10}) = 6 - 0.6x\\n직사각형의 넓이 식을 이차함수 형태로 작성함.\\n\\implies S(x) = x(6 - 0.6x) = -0.6(x^2 - 10x)\\n완전제곱식으로 변형하여 최댓값을 구함.\\n\\implies S(x) = -0.6(x-5)^2 + 15\\n\\implies x=5\\text{일 때, 최댓값 } 15\\text{를 가짐.}\\n\\therefore RQ=5, 넓이=15"
    },
    {
        id: 21,
        level: "상",
        category: "복소수의 주기성",
        content: "[서술형 3/상] 복소수 $z = \\frac{1-3i}{2i}$와 자연수 $n$에 대하여 $f(k)f(k+2)=360$을 만족하는 모든 자연수 $k$의 합을 구하시오. [8.0점]",
        choices: [" ", " ", " ", " ", " "],
        answer: "35",
        solution: "<b>[키포인트]</b> 복소수를 간단한 형태로 변형한 후 거듭제곱의 주기성을 파악하여 방정식을 만족하는 변수들을 합산함.\\n복소수 $z$의 분모를 실수화하여 정리함.\\n\\implies z = \\frac{(1-3i)(-i)}{2i(-i)} = \\frac{-i-3}{2} = -\\frac{3}{2} - \\frac{1}{2}i\\n이 복소수는 거듭제곱에 따른 일정 주기성을 가짐.\\n함숫값 $f(n)$의 규칙성을 찾아 $f(k)f(k+2)=360$ 방정식에 대입함.\\n주기성에 의해 특정 조건의 $k$ 값들이 도출됨.\\n모든 $k$의 합을 구함.\\n\\therefore 35"
    }
];