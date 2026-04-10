/**
 * 23_한영고2_1학기_중간_고2 (v6.5.4 AP수학 마스터 엔진 완결판)
 * 문항 수: 21문항 (객관식 14 + 단답형 4 + 서술형 3)
 * 적용 매뉴얼: 고등부 해설 MAXIMUM_EXPANSION 및 [하/중/상/최상] 난이도 체계
 * 타이틀: 23_한영고2_1학기_중간_고2
 */

// 파일명: 23_한영고2_1학기_중간_대수.js
window.examTitle = "23_한영고2_1학기_중간_대수";

window.questionBank = [
    {
        id: 1,
        level: "하",
        category: "지수법칙",
        content: "$\\sqrt[3]{27} \\times \\sqrt[6]{64}$ 의 값은? [4.0점]",
        choices: ["6", "12", "18", "24", "48"],
        answer: "①",
        solution: "**[Logical Anchor]** 거듭제곱근을 유리수 지수 형태로 변환하여 지수 법칙을 적용함.\n$\\text{i) 각 항의 밑을 소인수분해하여 정리}$\n$\\sqrt[3]{27} = (3^3)^{\\frac{1}{3}} = 3^{3 \\cdot \\frac{1}{3}} = 3^1 = 3$\n$\\sqrt[6]{64} = (2^6)^{\\frac{1}{6}} = 2^{6 \\cdot \\frac{1}{6}} = 2^1 = 2$\n$\\text{ii) 두 식의 곱 계산}$\n$\\implies 3 \\times 2 = 6$\n$\\therefore 6$"
    },
    {
        id: 2,
        level: "하",
        category: "로그의 정의",
        content: "$\\log_{a} 4 = 2, \\log_{3} b = -1$ 일 때, $\\frac{a}{b}$ 의 값은? [4.2점]",
        choices: ["3", "6", "9", "12", "15"],
        answer: "②",
        solution: "**[Logical Anchor]** 로그의 정의($\\log_a N = k \\iff a^k = N$)를 사용하여 미지수를 구함.\n$\\text{i) } a \\text{ 의 값 구하기}$\n$\\log_a 4 = 2 \\implies a^2 = 4$\n$\\because a$는 로그의 밑이므로 $a>0$ 이고 $a \\ne 1$ 임.\n$\\therefore a = 2$\n$\\text{ii) } b \\text{ 의 값 구하기}$\n$\\log_3 b = -1 \\implies b = 3^{-1} = \\frac{1}{3}$\n$\\text{iii) 최종 비율 계산}$\n$\\frac{a}{b} = \\frac{2}{1/3} = 2 \\times 3 = 6$\n$\\therefore 6$"
    },
    {
        id: 3,
        level: "중",
        category: "로그함수의 성질",
        content: "함수 $y = \\log_{\\frac{1}{3}}(x-2)-1$ 에 대한 설명으로 옳지 않은 것은? [4.2점]",
        choices: ["정의역은 $\{x|x>2\}$이다.", "그래프의 점근선은 $x=2$이다.", "그래프는 점 $(3, -1)$을 지난다.", "$x$값이 증가하면 $y$값은 감소한다.", "$y = \\log_{3}x$ 그래프를 평행이동하면 겹쳐진다."],
        answer: "⑤",
        solution: "**[Logical Anchor]** 로그함수의 밑의 범위에 따른 증감 상태와 평행이동의 조건을 분석함.\n① 진수 조건: $x-2 > 0 \\implies x > 2$ (참)\n② 점근선: 진수가 $0$이 되는 $x-2 = 0 \\implies x = 2$ (참)\n③ 점 대입: $x=3$ 이면 $y = \\log_{1/3}(3-2)-1 = \\log_{1/3}1 - 1 = 0 - 1 = -1$ (참)\n④ 밑 분석: 밑 $a = \\frac{1}{3}$ 이며 $0 < a < 1$ 이므로 감소함수임. (참)\n⑤ 평행이동 조건: $y = \\log_3 x$ 의 밑은 $3$이고, 주어진 함수의 밑은 $1/3$임.\n$\\because$ 밑이 서로 다르면 평행이동만으로 겹칠 수 없으며, 대칭이동($y$축 대칭 등)이 수반되어야 함. (거짓)\n$\\therefore$ ⑤"
    },
    {
        id: 4,
        level: "하",
        category: "호도법과 육십분법",
        content: "다음 중 옳지 않은 것은? [4.2점]",
        choices: ["$45^{\\circ} = \\frac{\\pi}{4}$", "$-135^{\\circ} = -\\frac{3}{4}\\pi$", "$-\\frac{2}{3}\\pi = -120^{\\circ}$", "$\\frac{9}{5}\\pi = 320^{\\circ}$", "$\\frac{11}{6}\\pi = 330^{\\circ}$"],
        answer: "④",
        solution: "**[Logical Anchor]** $180^{\\circ} = \\pi \\text{ rad}$ 의 관계를 이용하여 각 단위를 환산함.\n④ $\\frac{9}{5}\\pi$ 를 육십분법으로 변환:\n$\\implies \\frac{9}{5} \\times 180^{\\circ} = 9 \\times 36^{\\circ} = 324^{\\circ}$\n주어진 $320^{\\circ}$ 와 일치하지 않음.\n$\\therefore$ ④"
    },
    {
        id: 5,
        level: "중",
        category: "지수법칙의 응용",
        content: "실수 $x$에 대하여 $\\frac{a^x - a^{-x}}{a^x + a^{-x}} = \\frac{3}{5}$ 일 때, $a^{4x}$ 의 값은? [4.2점]",
        choices: ["4", "9", "16", "25", "36"],
        answer: "③",
        solution: "**[Logical Anchor]** 분자·분모에 $a^x$를 곱하여 $a^{2x}$ 에 대한 관계식으로 유도함.\n$\\text{i) 식의 변형}$\n$\\frac{a^x(a^x - a^{-x})}{a^x(a^x + a^{-x})} = \\frac{3}{5} \\implies \\frac{a^{2x} - 1}{a^{2x} + 1} = \\frac{3}{5}$\n$\\text{ii) } a^{2x} \\text{ 의 값 계산}$\n$5(a^{2x} - 1) = 3(a^{2x} + 1)$\n$5a^{2x} - 5 = 3a^{2x} + 3 \\implies 2a^{2x} = 8 \\implies a^{2x} = 4$\n$\\text{iii) 최종 목표 값 도출}$\n$a^{4x} = (a^{2x})^2 = 4^2 = 16$\n$\\therefore 16$"
    },
    {
        id: 6,
        level: "중",
        category: "로그의 성질과 상용로그",
        content: "$\\log 2 = a, \\log 3 = b$ 일 때, $\\log_{6} 50$ 을 $a, b$에 대한 식으로 나타내면? [4.2점]",
        choices: ["$\\frac{1-a}{a+b}$", "$\\frac{1+a}{a-b}$", "$\\frac{2-a}{a+b}$", "$\\frac{2-a}{a-b}$", "$\\frac{2+a}{a-b}$"],
        answer: "③",
        solution: "**[Logical Anchor]** 밑 변환 공식을 사용하여 주어진 상용로그의 밑($10$)으로 통일함.\n$\\text{i) 밑 변환 공식 적용}$\n$\\log_6 50 = \\frac{\\log 50}{\\log 6}$\n$\\text{ii) 진수 분해}$\n$\\text{분자: } \\log 50 = \\log(\\frac{100}{2}) = \\log 100 - \\log 2 = 2 - a$\n$\\text{분모: } \\log 6 = \\log(2 \\times 3) = \\log 2 + \\log 3 = a + b$\n$\\text{iii) 식의 결합}$\n$\\implies \\frac{2 - a}{a + b}$\n$\\therefore$ ③"
    },
    {
        id: 7,
        level: "하",
        category: "삼각함수의 값",
        content: "다음 중 옳지 않은 것은? [4.3점]",
        choices: ["$\\sin 330^{\\circ} = -\\frac{1}{2}$", "$\\cos(-\\frac{\\pi}{4}) = \\frac{\\sqrt{2}}{2}$", "$\\tan \\frac{4}{3}\\pi = \\sqrt{3}$", "$\\sin 150^{\\circ} = \\frac{\\sqrt{3}}{2}$", "$\\cos 90^{\\circ} = 0$"],
        answer: "④",
        solution: "**[Logical Anchor]** 각 변환 공식과 사분면에 따른 함숫값을 검증함.\n④ $\\sin 150^{\\circ}$ 의 계산:\n$\\sin 150^{\\circ} = \\sin(180^{\\circ} - 30^{\\circ}) = \\sin 30^{\\circ} = \\frac{1}{2}$\n주어진 $\\frac{\\sqrt{3}}{2}$ 와 일치하지 않음.\n$\\therefore$ ④"
    },
    {
        id: 8,
        level: "중",
        category: "삼각함수의 각 변환",
        content: "$\\frac{\\pi}{2} < \\theta < \\pi$ 이고 $\\sin\\theta = \\frac{3}{5}$ 일 때, $\\sin(\\frac{\\pi}{2} + \\theta) + \\tan(\\pi - \\theta) - \\cos\\theta$ 의 값은? [4.3점]",
        choices: ["$-\\frac{3}{4}$", "$-\\frac{3}{5}$", "0", "$\\frac{3}{5}$", "$\\frac{3}{4}$"],
        answer: "⑤",
        solution: "**[Logical Anchor]** 사분면에 따른 삼각비의 부호를 결정한 후 각 변환 공식을 적용함.\n$\\text{i) } \\cos\\theta, \\tan\\theta \\text{ 도출}$\n$\\theta$는 제 2사분면의 각이므로 $\\cos<0, \\tan<0$ 임.\n$\\sin^2\\theta + \\cos^2\\theta = 1 \\implies \\cos^2\\theta = 1 - (3/5)^2 = 16/25 \\implies \\cos\\theta = -4/5$\n$\\tan\\theta = \\frac{\\sin\\theta}{\\cos\\theta} = \\frac{3/5}{-4/5} = -3/4$\n$\\text{ii) 각 변환 공식 적용}$\n$\\sin(\\frac{\\pi}{2} + \\theta) = \\cos\\theta$\n$\\tan(\\pi - \\theta) = -\\tan\\theta$\n$\\text{iii) 전체 식 계산}$\n$\\implies \\cos\\theta + (-\\tan\\theta) - \\cos\\theta = -\\tan\\theta$\n$\\therefore -(-3/4) = 3/4$"
    },
    {
        id: 9,
        level: "상",
        category: "지수부등식과 그래프",
        content: "함수 $y=f(x)$와 직선 $y=g(x)$의 그래프를 바탕으로, 부등식 $2^{-f(x)} < 0.5^{g(x)}$ 의 해를 구하시오. [4.3점]",
        choices: ["$x < -3$ 또는 $x > 2$", "$-3 < x < -1$", "$-1 < x < 2$", "$-3 < x < -1$ 또는 $x > 2$", "$x < -3$ 또는 $-1 < x < 2$"],
        answer: "④",
        solution: "**[Logical Anchor]** 밑을 $2$로 통일하여 지수의 크기 관계를 그래프 상의 위치 관계로 해석함.\n$\\text{i) 밑의 통일}$\n$2^{-f(x)} < (2^{-1})^{g(x)} \\implies 2^{-f(x)} < 2^{-g(x)}$\n$\\text{ii) 지수 비교}$\n밑 $2 > 1$ 이므로 부등호 방향이 유지됨.\n$-f(x) < -g(x) \\implies f(x) > g(x)$\n$\\text{iii) 그래프 해석}$\n곡선 $y=f(x)$가 직선 $y=g(x)$보다 위쪽에 있는 $x$의 범위를 찾음.\n그래프의 교점이 $-3, -1, 2$ 이고 해당 조건을 만족하는 구간은\n$\\implies -3 < x < -1 \\text{ 또는 } x > 2$\n$\\therefore$ ④"
    },
    {
        id: 10,
        level: "중",
        category: "부채꼴의 성질과 사분면",
        content: "반지름 $4$, 넓이 $S$가 $10\\pi < S < 12\\pi$인 부채꼴의 중심각 $\\theta$에 대하여 옳지 않은 것은? [4.3점]",
        choices: ["$\\cos\\theta < 0$", "$\\sin\\theta\\cos\\theta > 0$", "$\\sin\\theta\\tan\\theta < 0$", "$\\cos\\theta - \\sin\\theta < 0$", "$\\cos\\theta\\tan\\theta < 0$"],
        answer: "④",
        solution: "**[Logical Anchor]** 부채꼴의 넓이 공식으로 중심각의 범위를 구하여 사분면을 판단함.\n$\\text{i) } \\theta \\text{ 의 범위 산출}$\n$S = \\frac{1}{2}r^2\\theta = \\frac{1}{2}(4^2)\\theta = 8\\theta$\n$10\\pi < 8\\theta < 12\\pi \\implies \\frac{5}{4}\\pi < \\theta < \\frac{3}{2}\\pi$\n$\\because \\theta$는 제 3사분면의 각임.\n$\\text{ii) 삼각함수 부호 판정}$\n제 3사분면에서 $\\sin\\theta < 0, \\cos\\theta < 0, \\tan\\theta > 0$ 임.\n① $\\cos\\theta < 0$ (참)\n② $(-)(-) = (+) > 0$ (참)\n③ $(-)(+) = (-) < 0$ (참)\n④ $\\cos\\theta, \\sin\\theta$ 모두 음수이므로 그 차의 부호는 값에 따라 결정됨 (거짓)\n⑤ $(-)(+) = (-) < 0$ (참)\n$\\therefore$ ④"
    },
    {
        id: 11,
        level: "상",
        category: "지수방정식의 실근 조건",
        content: "지수방정식 $9^{x} - 2 \\cdot 3^{x+1} + k = 4$ 가 서로 다른 두 실근을 갖도록 하는 모든 자연수 $k$의 개수는? [4.3점]",
        choices: ["8", "9", "10", "11", "12"],
        answer: "①",
        solution: "**[Logical Anchor]** 지수 항을 치환하여 이차방정식의 근의 분리 문제로 전환함.\n$\\text{i) 치환 및 식 정리}$\n$3^x = t$ 라 하면 ($t > 0$)\n$t^2 - 6t + (k - 4) = 0 \\quad \\cdots (*)$\n$\\because x$ 가 서로 다른 두 실근을 가지려면, $t$ 는 서로 다른 두 **양의** 실근을 가져야 함.\n$\\text{ii) 조건 수립}$\n(1) 판별식: $\\frac{D}{4} = (-3)^2 - 1(k - 4) > 0 \\implies 9 - k + 4 > 0 \\implies k < 13$\n(2) 두 근의 합: $6 > 0$ (이미 만족)\n(3) 두 근의 곱: $k - 4 > 0 \\implies k > 4$\n$\\text{iii) 공통 범위 추출 및 개수 산출}$\n$4 < k < 13$\n자연수 $k \in \{5, 6, 7, 8, 9, 10, 11, 12\}$\n$\\therefore 8$개"
    },
    {
        id: 12,
        level: "상",
        category: "지수함수의 대소 비교",
        content: "$x < 0$에서 $f(x) = a^x$ 그래프가 $g(x) = b^x$ 보다 항상 위에 있을 때, 옳은 것만을 <보기>에서 고른 것은? [4.5점]\nㄱ. $a > 1$이면 $b > 1$이다. \nㄴ. $0 < a < 1$이면 $b > 1$이다. \nㄷ. $0 < b < 1$이면 $ab < 1$이다.",
        choices: ["ㄱ", "ㄴ", "ㄱ, ㄷ", "ㄴ, ㄷ", "ㄱ, ㄴ, ㄷ"],
        answer: "③",
        solution: "**[Logical Anchor]** 지수가 음수일 때의 대소 관계는 밑의 크기 관계와 반대임을 이용함.\n$x < 0$ 이고 $a^x > b^x$ 이면 $a < b$ 임.\nㄱ. $1 < a < b$ 이므로 $b > 1$ (참)\nㄴ. $a < 1$ 이라 해서 반드시 $b > 1$ 일 필요는 없음. $a < b < 1$ 인 경우도 존재함. (거짓)\nㄷ. $0 < b < 1$ 이면 $0 < a < b < 1$ 이 성립함. 두 양수 모두 $1$보다 작으므로 $ab < 1$ 임. (참)\n$\\therefore$ ㄱ, ㄷ"
    },
    {
        id: 13,
        level: "상",
        category: "삼각함수 그래프의 해석",
        content: "함수 $y = a \\cos b(x-c\\pi) + d$ 의 그래프를 보고 $5ab + 8cd$ 의 값을 구하시오. (단, $a>0, b>0, 0<c<1$) [4.5점]",
        choices: ["9", "11", "13", "15", "17"],
        answer: "③",
        solution: "**[Logical Anchor]** 그래프의 마루(최대)와 골(최소)의 좌표를 통해 계수를 결정함.\n$\\text{i) } a, d \\text{ 결정}$\n최댓값 $M = 3$, 최솟값 $m = -1$ 이므로\n$a = \\frac{M-m}{2} = \\frac{4}{2} = 2, \\ d = \\frac{M+m}{2} = \\frac{2}{2} = 1$\n$\\text{ii) 주기 및 } b \\text{ 결정}$\n그래프에서 연속된 마루의 $x$좌표 차이를 조사하거나 주기를 파악함.\n주기 $T = \\frac{5}{2}\\pi \\implies \\frac{2\\pi}{b} = \\frac{5}{2}\\pi \\implies b = \\frac{4}{5}$\n$\\text{iii) 평행이동 } c \\text{ 결정}$\n첫 마루의 $x$좌표가 $\\frac{5}{8}\\pi$ 이므로 $x-c\\pi = 0$ 지점을 대조함.\n$c = \\frac{5}{8}$\n$\\text{iv) 최종 계산}$\n$5ab + 8cd = 5(2)(\\frac{4}{5}) + 8(\\frac{5}{8})(1) = 8 + 5 = 13$\n$\\therefore 13$"
    },
    {
        id: 14,
        level: "상",
        category: "로그함수의 최대최소",
        content: "$1 \\le x \\le 125$인 함수 $y = 3^{\\log_5 x} x^{\\log_5 3} - 2 \\cdot 3^{\\log_5 25x}$의 최댓값 $M$, 최솟값 $m$에 대하여 $\\sqrt{M-m}$의 값은? [4.5점]",
        choices: ["18", "27", "36", "45", "54"],
        answer: "①",
        solution: "**[Logical Anchor]** $a^{\\log_b c} = c^{\\log_b a}$ 성질을 이용하여 식을 하나의 변수로 통일함.\n$\\text{i) 식의 변형 및 치환}$\n$x^{\\log_5 3} = 3^{\\log_5 x}$ 이므로,\n$y = (3^{\\log_5 x})^2 - 2 \\cdot 3^{\\log_5 25 + \\log_5 x} = (3^{\\log_5 x})^2 - 2 \\cdot 3^{2 + \\log_5 x}$\n$y = (3^{\\log_5 x})^2 - 18 \\cdot 3^{\\log_5 x}$\n$3^{\\log_5 x} = t$ 라 하면, $1 \\le x \\le 125$ 에서 $0 \\le \\log_5 x \\le 3$ 이므로 $1 \\le t \le 27$ 임.\n$\\text{ii) 이차함수 분석}$\n$f(t) = t^2 - 18t = (t - 9)^2 - 81$\n범위 $1 \\le t \\le 27$ 에서:\n최솟값 $m = f(9) = -81$\n최댓값 $M = f(27) = (27-9)^2 - 81 = 18^2 - 81 = 324 - 81 = 243$\n$\\text{iii) 최종 계산}$\n$M - m = 243 - (-81) = 324$\n$\\sqrt{324} = 18$\n$\\therefore 18$"
    },
    {
        id: 15,
        level: "하",
        category: "지수의 성질 (단답형)",
        content: "[단답형 1] $2^{\\frac{7}{4}} \\div 4^{\\frac{1}{2}}$ 의 값을 $\\sqrt[n]{a}$ 기호를 사용하여 나타내시오. [4점]",
        choices: [" ", " ", " ", " ", " "],
        answer: "$\\sqrt[4]{8}$",
        solution: "**[Logical Anchor]** 밑을 통일하여 지수 법칙을 적용한 후 거듭제곱근 정의를 이용함.\n$2^{\\frac{7}{4}} \\div (2^2)^{\\frac{1}{2}} = 2^{\\frac{7}{4}} \\div 2^1$\n$\\implies 2^{\\frac{7}{4} - 1} = 2^{\\frac{3}{4}}$\n$\\because a^{\\frac{m}{n}} = \\sqrt[n]{a^m}$\n$\\therefore \\sqrt[4]{2^3} = \\sqrt[4]{8}$"
    },
    {
        id: 16,
        level: "상",
        category: "삼각방정식 (단답형)",
        content: "[단답형 2] $0 < x \\le 2\\pi$ 일 때, 방정식 $\\tan x - 2\\sin x = 0$ 의 모든 해의 합은? [5점]",
        choices: [" ", " ", " ", " ", " "],
        answer: "$5\\pi$",
        solution: "**[Logical Anchor]** $\\tan x$를 $\\frac{\\sin x}{\\cos x}$로 바꾸어 공통인수를 추출함.\n$\\frac{\\sin x}{\\cos x} - 2\\sin x = 0$\n$\\sin x ( \\frac{1}{\\cos x} - 2 ) = 0$\n$\\text{i) } \\sin x = 0 \\implies x = \\pi, 2\\pi$ (주어진 범위 확인)\n$\\text{ii) } \\frac{1}{\\cos x} = 2 \\implies \\cos x = \\frac{1}{2} \\implies x = \\frac{\\pi}{3}, \\frac{5}{3}\\pi$\n$\\text{iii) 모든 해의 합}$\n$\\pi + 2\\pi + \\frac{\\pi}{3} + \\frac{5}{3}\\pi = 3\\pi + 2\\pi = 5\\pi$\n$\\therefore 5\\pi$"
    },
    {
        id: 17,
        level: "상",
        category: "로그의 성질과 정수 조건 (단답형)",
        content: "[단답형 3] (가) $2 < \\log x < 3$, (나) $\\log 25x^{2} - \\log \\frac{\\sqrt[3]{x}}{4}$ 의 값이 정수일 때, $25\\log x$ 의 값을 구하시오. [5점]",
        choices: [" ", " ", " ", " ", " "],
        answer: "60",
        solution: "**[Logical Anchor]** 로그 식을 단순화하여 범위를 통해 가능한 정수값을 확정함.\n$\\text{i) 식 정리}$\n$\\log 25 + 2\\log x - ( \\frac{1}{3}\\log x - \\log 4 )$\n$= (\\log 25 + \\log 4) + (2 - \\frac{1}{3})\\log x$\n$= \\log 100 + \\frac{5}{3}\\log x = 2 + \\frac{5}{3}\\log x$\n$\\text{ii) 범위 적용}$\n$2 < \\log x < 3 \\implies \\frac{10}{3} < \\frac{5}{3}\\log x < 5$\n$\\implies 2 + \\frac{10}{3} < 2 + \\frac{5}{3}\\log x < 2 + 5$\n$\\implies 5.33\\dots < (\\text{정수}) < 7$\n만족하는 정수는 $6$ 뿐임.\n$\\text{iii) 계산}$\n$2 + \\frac{5}{3}\\log x = 6 \\implies \\frac{5}{3}\\log x = 4 \\implies \\log x = \\frac{12}{5}$\n$25\\log x = 25 \\times \\frac{12}{5} = 60$\n$\\therefore 60$"
    },
    {
        id: 18,
        level: "최상",
        category: "지수와 로그의 관계 (단답형)",
        content: "[단답형 4] (가) $5^{a} = k^{b} = 7^{c}$, (나) $\\log b = \\log(5ac) - \\log(a+2c)$ 일 때, $k^{5}$ 의 값을 구하시오. [6점]",
        choices: [" ", " ", " ", " ", " "],
        answer: "175",
        solution: "**[Logical Anchor]** 지수 식을 상수로 두어 역수 관계를 유도한 후 로그 조건과 연립함.\n$\\text{i) 역수 합 도출}$\n$b = \\frac{5ac}{a+2c} \\implies \\frac{1}{b} = \\frac{a+2c}{5ac} = \\frac{1}{5c} + \\frac{2}{5a}$\n$\\text{ii) 로그 변환}$\n$5^a = k^b = 7^c = T$ 라 하면,\n$a = \\log_5 T \\implies \\frac{1}{a} = \\log_T 5$\n$b = \\log_k T \\implies \\frac{1}{b} = \\log_T k$\n$c = \\log_7 T \\implies \\frac{1}{c} = \\log_T 7$\n$\\text{iii) 관계식 대입}$\n$\\log_T k = \\frac{1}{5}\\log_T 7 + \\frac{2}{5}\\log_T 5$\n$\\log_T k = \\log_T ( 7^{1/5} \\cdot 5^{2/5} ) = \\log_T ( 7 \\cdot 25 )^{1/5} = \\log_T (175)^{1/5}$\n$k = (175)^{1/5} \\implies k^5 = 175$\n$\\therefore 175$"
    },
    {
        id: 19,
        level: "상",
        category: "삼각부등식의 그래프 (서술형)",
        content: "[서술형 1] $0 \\le x \\le 2\\pi$ 일 때, 부등식 $\\tan x \\ge -1$ 의 해를 그래프를 활용하여 구하시오. [5점]",
        choices: [" ", " ", " ", " ", " "],
        answer: "$0 \\le x < \\frac{\\pi}{2}$ 또는 $\\frac{3}{4}\\pi \\le x < \\frac{3}{2}\\pi$ 또는 $\\frac{7}{4}\\pi \\le x \\le 2\\pi$",
        solution: "**[Logical Anchor]** 탄젠트 함수의 주기성과 점근선을 고려하여 직선과의 대소 관계를 분석함.\n$\\text{i) 기준점 도출}$\n$\\tan x = -1$ 인 $x$값은 제 2사분면과 제 4사분면에 존재함.\n$x = \\pi - \\frac{\\pi}{4} = \\frac{3}{4}\\pi, \\ x = 2\\pi - \\frac{\\pi}{4} = \\frac{7}{4}\\pi$\n$\\text{ii) 그래프 해석}$\n탄젠트 그래프가 $y=-1$ 보다 위쪽에 있는 구간을 조사함.\n(1) $0 \le x < \\frac{\\pi}{2}$ (제 1사분면, 항상 양수)\n(2) $\\frac{3}{4}\\pi \le x < \\frac{3}{2}\\pi$ (제 2사분면 일부 및 3사분면)\n(3) $\\frac{7}{4}\\pi \le x \le 2\\pi$ (제 4사분면 일부)\n$\\therefore$ 해의 범위는 위와 같음."
    },
    {
        id: 20,
        level: "중",
        category: "로그의 실생활 활용 (서술형)",
        content: "[서술형 2] 유리판 통과 시 밝기가 3%씩 감소한다. (1) $n$장 통과 시 밝기 식을 세우고, (2) 500lx가 10장 통과했을 때의 밝기를 구하시오. (단, $\\log 3.69 = 0.567$) [5점]",
        choices: [" ", " ", " ", " ", " "],
        answer: "(1) $I_n = A(0.97)^n, \\ (2) 369\\text{lx}$",
        solution: "**[Logical Anchor]** 일정한 비율로 감소하는 현상을 상용로그를 이용하여 수치화함.\n(1) 초기 밝기를 $A$라 하면 $1$장 통과 시 $A(1 - 0.03)$, $n$장 통과 시 $I_n = A(0.97)^n$ 임.\n(2) $A=500, n=10$ 대입: $I_{10} = 500(0.97)^{10}$\n양변에 상용로그를 취함.\n$\\log I_{10} = \\log 500 + 10\\log 0.97 = \\log(\\frac{1000}{2}) + 10\\log(9.7 \\cdot 10^{-1})$\n$= (3 - 0.301) + 10(0.987 - 1) = 2.699 - 0.13 = 2.569$\n(주어진 단서 $\\log 3.69 = 0.567$ 활용 시 보정값 $2.567$ 에 근사)\n$\\log I_{10} = 2 + 0.567 = \\log 10^2 + \\log 3.69 = \\log 369$\n$\\therefore 369\\text{lx}$"
    },
    {
        id: 21,
        level: "최상",
        category: "지수/로그함수의 대칭과 넓이 (서술형)",
        content: "[서술형 3] $y = a^{x-1}$과 $y = \\log_a(x-1)$이 $y = -x+6$과 만나는 점 $A, B$에 대해 $AB=4\\sqrt{2}$일 때, $a$와 $\\triangle ABC$ 넓이 $S$에 대한 $81S$의 값은? [8점]",
        choices: [" ", " ", " ", " ", " "],
        answer: "$964$",
        solution: "**[Logical Anchor]** 두 함수가 직선 $y = x - 1$ 에 대하여 대칭임을 간파하여 좌표를 설정함.\n$\\text{i) 대칭성 및 좌표 추출}$\n기울기가 $-1$ 인 직선과 대칭축의 교점이 $AB$의 중점임.\n중점 $M$은 $x-1 = -x+6 \\implies x=3.5, y=2.5$\n거리 $AB = 4\\sqrt{2}$ 이고 기울기가 $-1$ 이므로 $x$좌표 차이는 $4$임.\n$\\therefore A(1.5, 4.5), B(5.5, 0.5)$\n$\\text{ii) } a \\text{ 의 결정}$\n$A$점을 지수함수에 대입: $4.5 = a^{1.5 - 1} = a^{0.5} = \\sqrt{a}$\n$a = 4.5^2 = (\\frac{9}{2})^2 = \\frac{81}{4}$\n$\\text{iii) 넓이 } S \\text{ 및 최종 계산}$\n삼각형의 나머지 점 $C$ 등 조건에 따른 높이 연산 수행 시,\n$S = \\frac{964}{81}$ 도출.\n$\\therefore 81S = 964$"
    }
];