/**
 * [데이터셋] 26_순천강남여고1_1학기_중간_고1
 * AP수학 마스터 엔진 v6.5.4 [IRONCLAD] 정밀 검증 완료
 * 특징: 2022 개정 교육과정 행렬 단원 반영 및 풀이 한글화 완수
 */

const examTitle = "26_순천강남여고1_1학기_중간_고1";

const questionBank = [
    {
        id: 1,
        level: "하",
        category: "행렬의 성분 정의 [하]",
        content: "$2 \\times 2$행렬 $A$의 $(i, j)$성분 $a_{ij} = i^2 + j^2$일 때, 모든 성분의 합은? [3.5점]",
        choices: ["16", "17", "18", "19", "20"],
        answer: "⑤",
        solution: "**[Logical Anchor]** 행렬 $A$의 각 성분을 정의에 따라 계산한다.\n$\\implies a_{11} = 1^2 + 1^2 = 2$\n$\\implies a_{12} = 1^2 + 2^2 = 5$\n$\\implies a_{21} = 2^2 + 1^2 = 5$\n$\\implies a_{22} = 2^2 + 2^2 = 8$\n구한 모든 성분을 합산한다.\n$\\therefore 2 + 5 + 5 + 8 = 20$"
    },
    {
        id: 2,
        level: "하",
        category: "소인수분해와 약수 [하]",
        content: "300의 약수의 개수는? [3.5점]",
        choices: ["10", "12", "14", "16", "18"],
        answer: "⑤",
        solution: "**[Logical Anchor]** 300을 소인수분해하여 지수를 확인한다.\n$300 = 2^2 \\times 3^1 \\times 5^2$\n약수의 개수는 각 소인수의 지수에 1을 더한 값들의 곱이다.\n$\\therefore (2+1) \\times (1+1) \\times (2+1) = 3 \\times 2 \\times 3 = 18$"
    },
    {
        id: 3,
        level: "하",
        category: "연립이차방정식 [하]",
        content: "연립방정식 $\\begin{cases} x+y=1 \\\\ x^2+xy=7 \\end{cases}$ 의 해를 $x=\\alpha, y=\\beta$ 라 할 때, $\\alpha-\\beta$의 값은? [3.5점]",
        choices: ["11", "12", "13", "14", "15"],
        answer: "③",
        solution: "**[Logical Anchor]** 두 번째 식 $x^2+xy = 7$을 인수분해한다.\n$x(x+y) = 7$\n첫 번째 식 $x+y=1$을 위 식에 대입한다.\n$x(1) = 7 \\implies x = 7$\n$x=7$을 첫 번째 식에 대입하여 $y$를 구한다.\n$7 + y = 1 \\implies y = -6$\n$\\therefore \\alpha = 7, \\beta = -6$ 이므로 $\\alpha-\\beta = 7 - (-6) = 13$이다."
    },
    {
        id: 4,
        level: "하",
        category: "절댓값 부등식 [하]",
        content: "$x$에 대한 부등식 $|x-1| \\le 5$를 만족시키는 정수 $x$의 개수는? [3.5점]",
        choices: ["7", "8", "9", "10", "11"],
        answer: "⑤",
        solution: "**[Logical Anchor]** 절댓값의 정의에 따라 부등식을 푼다.\n$-5 \\le x-1 \\le 5$\n모든 변에 1을 더하여 $x$의 범위를 구한다.\n$-4 \\le x \\le 6$\n$\\therefore$ 정수의 개수는 $6 - (-4) + 1 = 11$개이다."
    },
    {
        id: 5,
        level: "하",
        category: "순열의 계산 [하]",
        content: "$_8P_2$의 값은? [3.7점]",
        choices: ["32", "40", "48", "56", "64"],
        answer: "④",
        solution: "**[Logical Anchor]** 서로 다른 8개에서 2개를 택해 일렬로 나열하는 순열이다.\n$_8P_2 = 8 \\times 7$\n$\\therefore 56$"
    },
    {
        id: 6,
        level: "하",
        category: "행렬의 상등 [하]",
        content: "행렬 $\\begin{pmatrix} 5 & -1 \\\\ -4 & x \\end{pmatrix} = \\begin{pmatrix} y+1 & -1 \\\\ -4 & -5 \\end{pmatrix}$ 일 때, $x+y$의 값은? [3.7점]",
        choices: ["-2", "-1", "0", "1", "2"],
        answer: "②",
        solution: "**[Logical Anchor]** 두 행렬이 같으려면 대응하는 각 성분의 값이 같아야 한다.\n1) 1행 1열 비교: $5 = y+1 \\implies y = 4$\n2) 2행 2열 비교: $x = -5$\n$\\therefore x+y = -5 + 4 = -1$이다."
    },
    {
        id: 7,
        level: "중",
        category: "삼차방정식과 계수 [중]",
        content: "$x^3-7x^2+ax-8=0$의 한 근이 2일 때, $a$와 나머지 두 근의 합은? [3.8점]",
        choices: ["19", "20", "21", "22", "23"],
        answer: "①",
        solution: "**[Logical Anchor]** $x=2$가 근이므로 방정식에 대입하여 $a$를 구한다.\n$2^3 - 7(2^2) + 2a - 8 = 0$\n$8 - 28 + 2a - 8 = 0 \\implies 2a = 28 \\implies a = 14$\n근과 계수의 관계에 의해 세 근의 합을 확인한다.\n$\\alpha+\\beta+\\gamma = -\\tf{-7}{1} = 7$\n한 근이 2이므로 나머지 두 근의 합은 $7-2=5$이다.\n$\\therefore a + 5 = 14 + 5 = 19$이다."
    },
    {
        id: 8,
        level: "하",
        category: "조합의 활용 [하]",
        content: "$n$개의 팀이 서로 모두 한번씩 경기를 하여 총 66번 경기를 했을 때, $n$의 값은? [3.8점]",
        choices: ["10", "11", "12", "13", "14"],
        answer: "③",
        solution: "**[Logical Anchor]** $n$팀 중 경기를 할 2팀을 선택하는 조합의 수와 같다.\n$_nC_2 = \\tf{n(n-1)}{2} = 66$\n$\\implies n(n-1) = 132$\n$132 = 12 \\times 11$ 이므로\n$\\therefore n = 12$이다."
    },
    {
        id: 9,
        level: "중상",
        category: "다중 절댓값 부등식 [중상]",
        content: "$|x-3|+2|x-5| \\le 4$를 만족시키는 정수 $x$의 합은? [4점]",
        choices: ["10", "12", "14", "16", "18"],
        answer: "②",
        solution: "**[Logical Anchor]** 절댓값 내부가 0이 되는 $x=3, 5$를 기준으로 구간을 나눈다.\n1) $x < 3$ 인 경우: $-(x-3)-2(x-5) \\le 4 \\implies -3x+13 \\le 4 \\implies x \\ge 3$\n(조건과 만족하는 범위가 없으므로 해 없음)\n2) $3 \\le x < 5$ 인 경우: $(x-3)-2(x-5) \\le 4 \\implies -x+7 \\le 4 \\implies x \\ge 3$\n(공통 범위: $3 \\le x < 5$)\n3) $x \\ge 5$ 인 경우: $(x-3)+2(x-5) \\le 4 \\implies 3x-13 \\le 4 \\implies x \\le \\tf{17}{3}$\n(공통 범위: $5 \\le x \\le \\tf{17}{3}$)\n전체 범위는 $3 \\le x \\le \\tf{17}{3}$이며 정수 $x$는 $3, 4, 5$이다.\n$\\therefore 3 + 4 + 5 = 12$이다."
    },
    {
        id: 10,
        level: "중",
        category: "행렬의 연산 성질 [중]",
        content: "$(A+B)^2-2AB$의 모든 성분의 합은? ($A = \\begin{pmatrix} 3 & 1 \\\\ -1 & -2 \\end{pmatrix}, B = \\begin{pmatrix} -2 & -1 \\\\ 1 & 3 \\end{pmatrix}$) [4점]",
        choices: ["19", "20", "21", "22", "23"],
        answer: "④",
        solution: "**[Logical Anchor]** $A+B = \\begin{pmatrix} 1 & 0 \\\\ 0 & 1 \\end{pmatrix} = E$ (단위행렬)임을 확인한다.\n주어진 식은 $E^2 - 2AB = E - 2AB$로 단순화된다.\n$AB = \\begin{pmatrix} -5 & 0 \\\\ 0 & -5 \\end{pmatrix} = -5E$이므로,\n$\\implies E - 2(-5E) = 11E = \\begin{pmatrix} 11 & 0 \\\\ 0 & 11 \\end{pmatrix}$이다.\n$\\therefore$ 모든 성분의 합은 $11 + 11 = 22$이다."
    },
    {
        id: 11,
        level: "중상",
        category: "이차방정식 근의 부호 [중상]",
        content: "두 근 부호가 다르고 $|\\alpha|<|\\beta|$일 때 정수 $p$의 합은? (단, $\\alpha < \\beta$) [4점]",
        choices: ["3", "4", "5", "6", "7"],
        answer: "④",
        solution: "**[Logical Anchor]** 두 근의 부호가 다르므로 곱은 음수이다.\n$\\alpha\\beta = p^2-6p-7 < 0 \\implies -1 < p < 7 \\quad \\cdots (1)$\n$|\\alpha|<|\\beta|$이고 $\\beta$가 양수이므로 두 근의 합은 양수이다.\n$\\alpha+\\beta = -(p^2-3p-4) > 0 \\implies -1 < p < 4 \\quad \\cdots (2)$\n(1), (2)의 공통 범위는 $-1 < p < 4$이다.\n$\\therefore$ 정수 $p$는 $0, 1, 2, 3$이며 그 합은 $6$이다."
    },
    {
        id: 12,
        level: "상",
        category: "허근의 성질 [상]",
        content: "$x^3 = -1$의 한 허근이 $\\alpha$일 때, 식의 값은? [4점]",
        choices: ["0", "$\\alpha$", "$\\alpha^2$", "$\\alpha+1$", "$\\alpha^2-1"],
        answer: "①",
        solution: "**[Logical Anchor]** $\\alpha^3 = -1$이고 $\\alpha^2-\\alpha+1=0$이 성립한다.\n1) $\\tf{\\alpha^8}{1-\\alpha} = \\tf{\\alpha^2}{-\\alpha^2} = -1$\n2) $\\tf{\\alpha^5}{\\alpha^2-\\alpha} = \\tf{-\\alpha^2}{-1} = \\alpha^2$\n3) $\\tf{\\alpha^2}{\\alpha^2+1} = \\tf{\\alpha^2}{\\alpha} = \\alpha$\n전체 식은 $-1 - \\alpha^2 + \\alpha$이다.\n$\\alpha^2-\\alpha+1=0$에서 $-\\alpha^2+\\alpha = 1$이므로,\n$\\therefore -1 + 1 = 0$이다."
    },
    {
        id: 13,
        level: "중상",
        category: "이차함수와 직선의 위치관계 [중상]",
        content: "$y=x^2+a$와 $y=bx-3$이 만날 때 주사위 눈 순서쌍 $(a, b)$의 개수는? [4.2점]",
        choices: ["10", "11", "12", "13", "14"],
        answer: "①",
        solution: "**[Logical Anchor]** $x^2-bx+(a+3)=0$이 실근을 가져야 한다.\n$\\implies D = b^2 - 4(a+3) \\ge 0 \\implies b^2 \\ge 4a+12$\n주사위 눈 $a, b$를 대입하여 순서쌍을 찾는다.\n- $a=1: b \\ge 4$ (3개)\n- $a=2, 3: b \\ge 5$ (각 2개씩)\n- $a=4, 5, 6: b = 6$ (각 1개씩)\n$\\therefore 3 + 2 + 2 + 1 + 1 + 1 = 10$개이다."
    },
    {
        id: 14,
        level: "중상",
        category: "조합과 여사건 [중상]",
        content: "10명 중 5명을 뽑을 때 특정 3명 중 적어도 2명을 뽑는 경우의 수는? [4.2점]",
        choices: ["122", "124", "126", "128", "130"],
        answer: "③",
        solution: "**[Logical Anchor]** 전체 경우에서 여사건(0명 또는 1명 포함)을 뺀다.\n1) 전체: $_{10}C_5 = 252$\n2) 0명 포함: $_7C_5 = 21$\n3) 1명 포함: $_3C_1 \\times _7C_4 = 105$\n$\\therefore 252 - (21 + 105) = 126$이다."
    },
    {
        id: 15,
        level: "상",
        category: "이차부등식의 변형 [상]",
        content: "$f(x) < 0$의 해가 $1 < x < 4$일 때 $f(3x)-f(2x) < 0$의 정수 해 개수는? [4.3점]",
        choices: ["0", "1", "2", "3", "4"],
        answer: "①",
        solution: "**[Logical Anchor]** $f(x) = a(x-1)(x-4)$ (단, $a>0$)로 설정한다.\n$f(3x)-f(2x) = a(5x^2-5x) < 0$ 식을 유도한다.\n$\\implies 5ax(x-1) < 0 \\implies 0 < x < 1$\n$\\therefore$ 범위 내 정수는 존재하지 않으므로 0개이다."
    },
    {
        id: 16,
        level: "중",
        category: "대각행렬과 근의 관계 [중]",
        content: "$x^2-4x-3=0$의 두 근이 $\\alpha, \\beta$일 때 행렬 $X^2$의 모든 성분의 합은? [4.3점]",
        choices: ["14", "16", "18", "20", "22"],
        answer: "⑤",
        solution: "**[Logical Anchor]** 대각행렬 $X^2$의 성분 합은 $\\alpha^2+\\beta^2$이다.\n$\\alpha+\\beta=4, \\alpha\\beta=-3$을 이용한다.\n$\\therefore \\alpha^2+\\beta^2 = 4^2 - 2(-3) = 22$이다."
    },
    {
        id: 17,
        level: "상",
        category: "정다각형과 삼각형 [상]",
        content: "정팔각형 변과 공유하지 않는 삼각형의 개수는? [4.5점]",
        choices: ["13", "14", "15", "16", "17"],
        answer: "④",
        solution: "**[Logical Anchor]** 전체 삼각형에서 변을 공유하는 경우를 뺀다.\n1) 전체: $_8C_3 = 56$\n2) 변 2개 공유: 8개\n3) 변 1개 공유: $8 \\times 4 = 32$개\n$\\therefore 56 - (8 + 32) = 16$개이다."
    },
    {
        id: 18,
        level: "중상",
        category: "순열과 조합 응용 [중상]",
        content: "조건 (가)~(다)를 만족시키는 경우의 수는? [4.5점]",
        choices: ["40", "44", "48", "52", "56"],
        answer: "③",
        solution: "**[Logical Anchor]** $a_3=5$로 고정한다.\n$a_1, a_2$는 5보다 작은 4개 중 2개 나열: $_4P_2 = 12$\n$a_4, a_5, a_6$는 5보다 큰 4개 중 3개 선택: $_4C_3 = 4$\n$\\therefore 12 \\times 4 = 48$이다."
    },
    {
        id: 19,
        level: "최상",
        category: "사차방정식 근과 계수 [최상]",
        content: "사차방정식 근의 조건 만족 시 $p+q$의 값은? [4.5점]",
        choices: ["-18", "-16", "-14", "-12", "-10"],
        answer: "①",
        solution: "**[Logical Anchor]** 식을 $(x^2-ux+v)(x^2-u'x+v')=0$으로 둔다.\n계수 비교와 근의 조건을 연립하여 $p=-27, q=9$를 산출한다.\n$\\therefore p+q = -18$이다."
    },
    {
        id: 20,
        level: "최상",
        category: "삼차방정식 근의 분리 [최상]",
        content: "조건 만족 시 $\\alpha^2+\\beta$의 값은? [4.5점]",
        choices: ["15", "16", "17", "18", "19"],
        answer: "②",
        solution: "**[Logical Anchor]** 인수분해하면 $(x+1)(x^2-mx+3)=0$이다.\n이차식의 근의 분리 조건(판별식, 축, 경계값)을 확인한다.\n$\\implies 2\\sqrt{3} < m < 4$에서 $\\alpha^2=12, \\beta=4$이다.\n$\\therefore 12 + 4 = 16$이다."
    },
    {
        id: 21,
        level: "상",
        category: "배수 판정법 [상]",
        content: "3000보다 큰 3의 배수의 개수를 서술하시오. [8점]",
        choices: [" "],
        answer: "18",
        solution: "**[Logical Anchor]** 자릿수 합이 3의 배수인 조합 $\\{0,2,3,4\\}$와 $\\{0,1,2,3\\}$을 찾는다.\n천의 자리를 3 또는 4로 고정하여 순열의 수를 합산한다.\n$\\therefore 12 + 6 = 18$개이다."
    },
    {
        id: 22,
        level: "최상",
        category: "사차방정식 융합 [최상]",
        content: "세 근이 직각삼각형 변의 길이가 되는 $k$값을 서술하시오. [12점]",
        choices: [" "],
        answer: "$k = \\tf{7}{6}, \\tf{175}{192}$",
        solution: "**[Logical Anchor]** 인수분해 결과 실근 $1$과 이차식의 두 근이 발생한다.\n피타고라스 정리를 케이스별로 적용하여 $k$값을 산출한다.\n$\\therefore \\tf{7}{6}$ 과 $\\tf{175}{192}$ 이다."
    }
];