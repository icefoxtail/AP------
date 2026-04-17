window.examTitle = "23_중앙여고2_1학기_중간_대수";

window.questionBank = [
    {
        id: "1",
        level: "중",
        content: "$a>0, a\\neq 1$이고 $\\sqrt[3]{a^2} = \\sqrt{a\\sqrt[3]{a^m}}$일 때, 상수 $m$의 값은? [3.5점]",
        choices: ["$\\frac{5}{2}$", "3", "2", "1", "$\\frac{3}{2}$"],
        answer: "④",
        category: "지수법칙",
        originalCategory: "지수법칙",
        standardCourse: "대수",
        standardUnitKey: "H22-C-02",
        standardUnit: "지수법칙",
        standardUnitOrder: 2,
        solution: "<b>[Logical Anchor]</b> 거듭제곱근의 성질을 지수 법칙으로 변환하여 밑을 통일한 뒤 지수를 비교함.\\n주어진 식의 좌변과 우변을 유리수 지수 형태로 변형함.\\n$\\text{i) 좌변: } \\sqrt[3]{a^2} = a^{\\frac{2}{3}}$\\n$\\text{ii) 우변: } \\sqrt{a\\sqrt[3]{a^m}} = (a \\cdot a^{\\frac{m}{3}})^{\\frac{1}{2}} = (a^{1 + \\frac{m}{3}})^{\\frac{1}{2}}$\\n지수 법칙 $(a^n)^m = a^{nm}$을 적용하여 우변을 정리함.\\n$\\implies a^{(\\frac{3+m}{3}) \\cdot \\frac{1}{2}} = a^{\\frac{3+m}{6}}$\\n$\\because$ 밑 $a$가 양수이고 $1$이 아니므로, 등식이 성립하려면 지수가 동일해야 함.\\n$\\implies \\frac{2}{3} = \\frac{3+m}{6}$\\n양변에 $6$을 곱하여 일차방정식을 해결함.\\n$4 = 3 + m \\implies m = 1$\\n$\\therefore 1$"
    },
    {
        id: "2",
        level: "중",
        content: "$100 \\le a \\le 130, 5 \\le b \\le 10$일 때, $\\sqrt[3]{a} + \\sqrt{b}$의 값이 자연수가 되도록 하는 두 자연수 $a, b$에 대하여 $a-b$의 값은? [4.3점]",
        choices: ["120", "118", "114", "116", "122"],
        answer: "④",
        category: "거듭제곱근의 성질",
        originalCategory: "거듭제곱근의 성질",
        standardCourse: "대수",
        standardUnitKey: "H22-C-01",
        standardUnit: "지수의 뜻과 성질",
        standardUnitOrder: 1,
        solution: "<b>[Logical Anchor]</b> 두 무리수의 합이 자연수가 되기 위해서는 각 항이 각각 유리수(자연수)가 되어야 함.\\n$\\sqrt[3]{a}$와 $\\sqrt{b}$가 각각 자연수가 되는 조건을 탐색함.\\n$\\text{i) } a \\text{ 의 조건 분석: }$\\n$a$는 어떤 자연수의 세제곱수($k^3$)여야 함.\\n주어진 범위 $100 \\le a \\le 130$ 내의 세제곱수를 나열함.\\n$4^3 = 64$ (범위 미달), $5^3 = 125$ (포함), $6^3 = 216$ (범위 초과)\\n$\\therefore a = 125$\\n$\\text{ii) } b \\text{ 의 조건 분석: }$\\n$b$는 어떤 자연수의 제곱수($n^2$)여야 함.\\n주어진 범위 $5 \\le b \\le 10$ 내의 제곱수를 나열함.\\n$2^2 = 4$ (범위 미달), $3^2 = 9$ (포함), $4^2 = 16$ (범위 초과)\\n$\\therefore b = 9$\\n$\\text{iii) 최종 값 산출: }$\\n$a - b = 125 - 9 = 116$\\n$\\therefore 116$"
    },
    {
        id: "3",
        level: "상",
        content: "1이 아닌 두 양수 $m, n$와 두 실수 $x, y$에 대하여 다음 두 조건이 성립할 때, $\\log_m(x^2y+xy^2)$의 값을 구하시오. <div class='box'>(가) $xy$의 $n$제곱근 중 실수인 것은 $m^3$이다.<br>(나) $n^{x+y}$의 제곱근 중 양수인 것은 $n^{\\frac{m}{2}}$이다.</div> [4.2점]",
        choices: ["$3n+1$", "$m+n+2$", "$m+2$", "$2m+n$", "$m+3n$"],
        answer: "①",
        category: "로그의 정의와 성질",
        originalCategory: "로그의 정의와 성질",
        standardCourse: "대수",
        standardUnitKey: "H22-C-04",
        standardUnit: "로그의 뜻",
        standardUnitOrder: 4,
        solution: "<b>[Logical Anchor]</b> 거듭제곱근의 정의를 지수 식으로 변환하여 $xy$와 $x+y$에 대한 관계식을 유도함.\\n$\\text{i) 조건 (가) 해석: }$\\n$xy$의 $n$제곱근이 $m^3$이라는 것은 $(m^3)^n = xy$를 의미함.\\n$\\therefore xy = m^{3n} \\quad \\cdots (1)$\\n$\\text{ii) 조건 (나) 해석: }$\\n$n^{x+y}$의 제곱근이 $n^{\\frac{m}{2}}$이라는 것은 $(n^{\\frac{m}{2}})^2 = n^{x+y}$를 의미함.\\n$\\implies n^m = n^{x+y}$\\n$\\therefore x + y = m \\quad \\cdots (2)$\\n$\\text{iii) 목표 식의 변형 및 계산: }$\\n구하고자 하는 식은 $\\log_m(x^2y+xy^2)$ 임.\\n공통인수 $xy$로 묶으면 $\\log_m(xy(x+y))$ 가 됨.\\n여기에 $(1)$과 $(2)$의 결과를 대입함.\\n$\\implies \\log_m(m^{3n} \\cdot m) = \\log_m(m^{3n+1})$\\n로그의 성질 $\\log_a a^k = k$를 적용함.\\n$\\therefore 3n + 1$"
    },
    {
        id: "13",
        level: "상",
        content: "$x > 0$에서 부등식 $x^{\\log_2 x} \\ge kx^2$이 항상 성립하도록 하는 양수 $k$의 범위는? [4.1점]",
        choices: ["$0 < k \\le \\frac{1}{2}$", "32", "$0 < k \\le \\frac{1}{4}$", "$0 < k \\le \\frac{1}{5}$", "$0 < k \\le \\frac{1}{6}$"],
        answer: "①",
        category: "로그부등식의 활용",
        originalCategory: "로그부등식의 활용",
        standardCourse: "대수",
        standardUnitKey: "H22-C-08",
        standardUnit: "지수·로그 부등식",
        standardUnitOrder: 8,
        solution: "<b>[Logical Anchor]</b> 지수에 로그가 포함된 부등식은 양변에 로그를 취하여 이차부등식의 판별식 문제로 전환함.\\n지수의 밑이 $2$인 로그가 있으므로 양변에 밑이 $2$인 로그를 취함.\\n$\\log_2 (x^{\\log_2 x}) \\ge \\log_2 (kx^2)$\\n$\\implies (\\log_2 x) \\cdot (\\log_2 x) \\ge \\log_2 k + 2\\log_2 x$\\n$\\text{i) 치환 및 식 정리: }$\\n$\\log_2 x = t$라 치환함. $x > 0$일 때 $t$는 모든 실수를 가짐.\\n$t^2 \\ge \\log_2 k + 2t$\\n$\\implies t^2 - 2t - \\log_2 k \\ge 0 \\quad \\cdots (*)$\\n$\\text{ii) 항상 성립할 조건 분석: }$\\n모든 실수 $t$에 대해 $(*)$이 성립하려면, 이차함수의 그래프가 $t$축과 만나지 않거나 접해야 함.\\n$\\implies$ 판별식 $D \\le 0$ 이어야 함.\\n$\\frac{D}{4} = (-1)^2 - 1 \\cdot (-\\log_2 k) \\le 0$\\n$1 + \\log_2 k \\le 0 \\implies \\log_2 k \\le -1$\\n$\\text{iii) } k \\text{ 의 범위 산출: }$\\n$\\log_2 k \\le \\log_2 2^{-1} \\implies k \\le \\frac{1}{2}$\\n조건에서 $k$는 양수이므로,\\n$\\therefore 0 < k \\le \\frac{1}{2}$"
    },
    {
        id: "23",
        level: "상",
        content: "[서술형3] $(\\log_3 x)^2 - 2\\log_3 x + k = 0$의 한 근이 $3x^2-4x+1=0$의 두 근 사이에 있을 때, 두 근의 곱과 상수 $k$의 범위를 구하시오. [5점]",
        choices: [" ", " ", " ", " ", " "],
        answer: "9, -3 < k < 0",
        category: "로그방정식의 근의 분리",
        originalCategory: "로그방정식의 근의 분리",
        standardCourse: "대수",
        standardUnitKey: "H22-C-07",
        standardUnit: "지수·로그 방정식",
        standardUnitOrder: 7,
        solution: "<b>[Logical Anchor]</b> 로그의 치환을 통해 방정식의 근을 새로운 변수의 범위로 매핑하여 근의 위치 조건을 해결함.\\n$\\text{i) 기준 방정식의 해 도출: }$\\n$3x^2 - 4x + 1 = 0 \\implies (3x - 1)(x - 1) = 0$\\n$\\therefore x = \\frac{1}{3}, \\ 1$\\n$\\text{ii) 로그 방정식의 치환: }$\\n$\\log_3 x = t$라 하면 주어진 식은 $t^2 - 2t + k = 0$ 이 됨.\\n한 근 $x$가 $\\frac{1}{3} < x < 1$ 사이에 존재해야 하므로,\\n$\\implies \\log_3 \\frac{1}{3} < t < \\log_3 1$\\n$\\therefore -1 < t < 0$ 범위 내에 한 근이 존재해야 함.\\n$\\text{iii) 두 근의 곱 계산: }$\\n치환된 방정식 $t^2 - 2t + k = 0$의 두 근을 $t_1, t_2$라 하면,\\n근과 계수의 관계에 의해 $t_1 + t_2 = 2$\\n$\\log_3 x_1 + \\log_3 x_2 = 2 \\implies \\log_3 (x_1x_2) = 2$\\n$\\therefore x_1x_2 = 3^2 = 9$\\n$\\text{iv) } k \\text{ 의 범위 도출: }$\\n$f(t) = t^2 - 2t + k$라 할 때, 대칭축이 $t=1$이므로 한 근이 $(-1, 0)$에 있으려면,\\n$f(-1) \\cdot f(0) < 0$ 을 만족해야 함.\\n$f(-1) = 1 + 2 + k = k + 3$\\n$f(0) = 0 - 0 + k = k$\\n$\\implies (k + 3)k < 0$\\n$\\therefore -3 < k < 0$"
    }
];
