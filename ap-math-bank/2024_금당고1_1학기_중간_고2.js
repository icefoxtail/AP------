window.examTitle = "24_금당고2_1학기_중간_고2";
window.questionBank = [
  {
    "id": 1,
    "level": "[하]",
    "category": "지수",
    "content": "$(-3)^2$의 값은? [3.8점]",
    "choices": ["-4", "4", "2", "-2", "9"],
    "answer": "5",
    "solution": "∵ $(-a)^{2n} = a^{2n} \text{ (단, } n \text{은 정수)}$ [cite: 19, 20] \n ⇒ $(-3)^2 = 3^2$ \n ∴ $9$ [cite: 21, 31]"
  },
  {
    "id": 2,
    "level": "[하]",
    "category": "지수",
    "content": "$3^{\tf{10}{3}} \times 3^{-\tf{1}{3}}$의 값은? [3.8점]",
    "choices": ["\\tf{1}{3}", "\\tf{1}{9}", "27", "9", "3"],
    "answer": "3",
    "solution": "∵ 지수법칙 $a^m \times a^n = a^{m+n}$ [cite: 34] \n ⇒ $3^{\tf{10}{3} + (-\tf{1}{3})} = 3^{\tf{9}{3}}$ [cite: 35] \n ⇒ $3^3$ [cite: 36] \n ∴ $27$ [cite: 37]"
  },
  {
    "id": 3,
    "level": "[중]",
    "category": "로그",
    "content": "$\\log_{a}b \\times \\log_{b}c \\times \\log_{c}a$의 값은? [3.8점]",
    "choices": ["0", "1", "2", "3", "4"],
    "answer": "2",
    "solution": "키워드: 밑 변환 공식 [cite: 49] \n ∵ $\\log_{x}y = \\tf{\\log y}{\\log x}$ [cite: 51] \n ⇒ $\\tf{\\log b}{\\log a} \\times \\tf{\\log c}{\\log b} \\times \\tf{\\log a}{\\log c}$ [cite: 52] \n ⇒ $1$ (약분) [cite: 53] \n ∴ $1$ [cite: 56]"
  },
  {
    "id": 4,
    "level": "[중]",
    "category": "로그함수",
    "content": "방정식 $\\log_{2}(x+5)=\\log_{2}(2x+1)$의 해는? [3.8점]",
    "choices": ["1", "3", "4", "2", "6"],
    "answer": "3",
    "solution": "키워드: 진수 조건 [cite: 27] \n ∵ 밑이 $2$로 동일 [cite: 24] \n ⇒ $x+5 = 2x+1$ [cite: 25] \n ⇒ $x = 4$ [cite: 26] \n ∵ 진수 조건: $x+5>0$ ∩ $2x+1>0$ [cite: 28] \n ⇒ $4+5>0$ ∩ $2(4)+1>0$ (참) [cite: 29, 30] \n ∴ $4$ [cite: 31]"
  },
  {
    "id": 5,
    "level": "[하]",
    "category": "삼각함수",
    "content": "다음 중 제2사분면의 각은? [4.0점]",
    "choices": ["$72^{\\circ}$", "$225^{\\circ}$", "$330^{\\circ}$", "$405^{\\circ}$", "$500^{\\circ}$"],
    "answer": "5",
    "solution": "키워드: 일반각 [cite: 39] \n ∵ $360^{\\circ} \times n + \alpha$ ($0^{\\circ} \le \alpha < 360^{\\circ}$) [cite: 39] \n ① $72^{\\circ} \in$ 제1사분면 \n ② $225^{\\circ} = 180^{\\circ} + 45^{\\circ} \in$ 제3사분면 [cite: 41] \n ③ $330^{\\circ} = 360^{\\circ} - 30^{\\circ} \in$ 제4사분면 [cite: 42] \n ④ $405^{\\circ} = 360^{\\circ} + 45^{\\circ} \in$ 제1사분면 [cite: 43] \n ⑤ $500^{\\circ} = 360^{\\circ} + 140^{\\circ}$ [cite: 44] \n ∵ $90^{\\circ} < 140^{\\circ} < 180^{\\circ}$ [cite: 44] \n ∴ $500^{\\circ}$ [cite: 45, 46]"
  },
  {
    "id": 6,
    "level": "[중]",
    "category": "삼각함수",
    "content": "각 $\\theta$가 제3사분면의 각이고 $\\sin \\theta = -\\tf{1}{3}$일 때, $\\cos \\theta$의 값은? [4.0점]",
    "choices": ["$\\tf{2\\sqrt{2}}{3}$", "$\\tf{\\sqrt{2}}{3}$", "$-\\tf{2\\sqrt{2}}{3}$", "$-\\tf{\\sqrt{2}}{3}$", "$-\\tf{1}{3}$"],
    "answer": "3",
    "solution": "키워드: 삼각함수의 부호 [cite: 57] \n ∵ $\\theta \in$ 제3사분면 $\implies \cos \\theta < 0$ [cite: 58, 61] \n ∵ $\\sin^2 \\theta + \\cos^2 \\theta = 1$ \n ⇒ $(-\\tf{1}{3})^2 + \\cos^2 \\theta = 1$ \n ⇒ $\\cos^2 \\theta = \\tf{8}{9}$ \n ⇒ $|\\cos \\theta| = \\tf{2\\sqrt{2}}{3}$ [cite: 59, 60] \n ∴ $\\cos \\theta = -\\tf{2\\sqrt{2}}{3}$ [cite: 62, 64]"
  },
  {
    "id": 7,
    "level": "[중]",
    "category": "로그부등식",
    "content": "$(\\log_{3}x)^{2}-\\log_{3}x^{3}+2<0$을 만족시키는 자연수의 개수는? [4.0점]",
    "choices": ["7", "5", "9", "11", "13"],
    "answer": "2",
    "solution": "키워드: 치환 [cite: 83] \n ∵ $\\log_{3}x = t$ 로 치환 [cite: 83] \n ⇒ $t^2 - 3t + 2 < 0$ [cite: 82, 83] \n ⇒ $(t-1)(t-2) < 0$ [cite: 84] \n ⇒ $1 < t < 2$ [cite: 84] \n ⇒ $1 < \\log_{3}x < 2$ [cite: 86] \n ∵ 밑 $3 > 1$ [cite: 86] \n ⇒ $3 < x < 9$ [cite: 86] \n ∵ $x \in \{4, 5, 6, 7, 8\}$ [cite: 86] \n ∴ $5$개 [cite: 87]"
  }
];
window.questionBank = window.questionBank.concat([
  {
    "id": 8,
    "level": "[중상]",
    "category": "부채꼴",
    "content": "호의 길이가 $2\\pi$, 넓이가 $3\\pi$인 부채꼴의 반지름의 길이를 $r$, 중심각의 크기를 $\\theta$라 할 때, $\\tf{\\theta}{r}$의 값은? [4.2점]",
    "choices": ["\\tf{2\\pi}{9}", "\\tf{4\\pi}{9}", "\\tf{8\\pi}{9}", "\\tf{\\pi}{9}", "\\tf{\\pi}{18}"],
    "answer": "1",
    "solution": "키워드: 부채꼴 공식 \n ∵ $S = \\tf{1}{2}rl$ \n ⇒ $3\\pi = \\tf{1}{2} \\times r \\times 2\\pi$ \n ⇒ $r = 3$ \n ∵ $l = r\\theta$ \n ⇒ $2\\pi = 3\\theta$ \n ⇒ $\\theta = \\tf{2\\pi}{3}$ \n ∴ $\\tf{\\theta}{r} = \\tf{2\\pi/3}{3} = \\tf{2\\pi}{9}$"
  },
  {
    "id": 9,
    "level": "[중상]",
    "category": "삼각방정식",
    "content": "$0 \\le x < 2\\pi$에서 방정식 $2\\sin^2 x + 3\\sin x - 2 = 0$의 모든 해의 합은? [4.2점]",
    "choices": ["0", "\\pi", "\\tf{3\\pi}{2}", "2\\pi", "\\tf{\\pi}{2}"],
    "answer": "2",
    "solution": "키워드: 인수분해 \n ∵ $(2\\sin x - 1)(\\sin x + 2) = 0$ \n ∵ $-1 \\le \\sin x \\le 1$ \n ⇒ $\\sin x = \\tf{1}{2}$ \n ⇒ $x = \\tf{\\pi}{6} \\text{ 또는 } \\tf{5\\pi}{6}$ \n ∴ $\\tf{\\pi}{6} + \\tf{5\\pi}{6} = \\pi$"
  },
  {
    "id": 10,
    "level": "[상]",
    "category": "삼각부등식",
    "content": "$0 \\le x \\le \\tf{\\pi}{2}$에서 부등식 $\\tan(x+\\tf{\\pi}{6}) \\ge \\sqrt{3}$의 해가 $\\alpha \\le x < \\beta$일 때, $\\tan(\\beta-\\alpha)$의 값은? [4.2점]",
    "choices": ["\\tf{\\sqrt{3}}{2}", "\\tf{\\sqrt{3}}{3}", "\\tf{\\sqrt{2}}{2}", "\\sqrt{3}", "1"],
    "answer": "2",
    "solution": "키워드: 치환 \n ∵ $x+\\tf{\\pi}{6} = X$ \n ⇒ $\\tf{\\pi}{6} \\le X \\le \\tf{2\\pi}{3}$ \n ∵ $\\tan X \\ge \\sqrt{3}$ \n ⇒ $\\tf{\\pi}{3} \\le X < \\tf{\\pi}{2}$ \n ⇒ $\\tf{\\pi}{3} \\le x+\\tf{\\pi}{6} < \\tf{\\pi}{2}$ \n ⇒ $\\tf{\\pi}{6} \\le x < \\tf{\\pi}{3}$ \n ∴ $\\tan(\\tf{\\pi}{3} - \\tf{\\pi}{6}) = \\tan(\\tf{\\pi}{6}) = \\tf{\\sqrt{3}}{3}$"
  },
  {
    "id": 11,
    "level": "[최상]",
    "category": "거듭제곱근",
    "content": "자연수 $n(n \\ge 2)$에 대하여 $-n^2+11n-24$의 $n$제곱근 중에서 실수인 것의 개수를 $f(n)$이라 할 때, $f(n)+f(n+1)=3$을 만족시키는 모든 자연수 $n$의 값의 합은? [4.4점]",
    "choices": ["12", "14", "16", "18", "20"],
    "answer": "4",
    "solution": "키워드: 케이스 분류 \n ∵ $g(n) = -(n-3)(n-8)$ \n ∵ $f(홀)=1, f(짝)=2$ (단, $g>0$) \n Case 1) $n$ 짝수, $n+1$ 홀수 \n ⇒ $f(n)=2 \\cap f(n+1)=1$ \n ⇒ $g(n)>0 \\implies 3 < n < 8 \\implies n \\in \\{4, 6\\}$ \n Case 2) $n$ 홀수, $n+1$ 짝수 \n ⇒ $f(n)=1 \\cap f(n+1)=2$ \n ⇒ $g(n+1)>0 \\implies 3 < n+1 < 8 \\implies n \\in \\{3, 5\\}$ \n ∴ $3+4+5+6 = 18$"
  },
  {
    "id": 12,
    "level": "[상]",
    "category": "지수",
    "content": "두 자연수 $n, m$에 대하여 $n \\times (\\tf{\\sqrt[4]{3}}{\\sqrt[3]{2}})^m$이 자연수일 때, $m+n$의 최솟값은? [4.4점]",
    "choices": ["20", "22", "24", "26", "28"],
    "answer": "5",
    "solution": "키워드: 유리수 지수 \n ∵ $n \\times \\tf{3^{m/4}}{2^{m/3}} \\in \\mathbb{N}$ \n ⇒ $m \\in \\text{LCM}(3, 4)$ \n ⇒ $m_{min} = 12$ \n ⇒ $n \\times \\tf{3^3}{2^4} = n \\times \\tf{27}{16}$ \n ⇒ $n_{min} = 16$ \n ∴ $12+16 = 28$"
  },
  {
    "id": 13,
    "level": "[최상]",
    "category": "로그함수",
    "content": "양수 $k$에 대하여 $1 \\le x \\le 3$에서 함수 $y = \\log_{2}(x^2-2kx+k^2+1)+2$의 최솟값은 $3$, 최댓값은 $M$일 때, $k+2^M$의 값은? [4.4점]",
    "choices": ["36", "40", "44", "48", "52"],
    "answer": "3",
    "solution": "키워드: 진수 조건 \n ∵ $y = \\log_{2}\\{(x-k)^2+1\\}+2$ \n ∵ $y_{min}=3 \\implies \\log_{2}(\\text{진수}_{min})=1 \\implies \\text{진수}_{min}=2$ \n ∵ $k > 3$ 일 때 $x=3$ 에서 최소 \n ⇒ $(3-k)^2+1=2 \\implies k=4$ \n ∵ $x=1$ 에서 최대 $M$ \n ⇒ $M = \\log_{2}\\{(1-4)^2+1\\}+2 = \\log_{2}10+2$ \n ⇒ $2^M = 2^{\\log_{2}10} \\times 2^2 = 40$ \n ∴ $4+40 = 44$"
  },
  {
    "id": 14,
    "level": "[상]",
    "category": "삼각함수",
    "content": "두 양수 $a, b$에 대하여 곡선 $y=a\\sin\\tf{\\pi}{b}x(0 \\le x \\le 3b)$가 직선 $y=a$와 만나는 서로 다른 두 점을 $A, B$라 하자. 삼각형 $OAB$의 넓이가 $4$이고 직선 $OA$의 기울기와 직선 $OB$의 기울기의 곱이 $\tf{16}{5}$일 때, $a+b$의 값은? [4.6점]",
    "choices": ["\\sqrt{2}", "2\\sqrt{2}", "3\\sqrt{2}", "4\\sqrt{2}", "5\\sqrt{2}"],
    "answer": "3",
    "solution": "키워드: 주기와 대칭 \n ∵ $\\sin\\tf{\\pi}{b}x = 1 \\implies x = \\tf{b}{2}, \\tf{5b}{2}$ \n ⇒ $A(\\tf{b}{2}, a), B(\\tf{5b}{2}, a)$ \n ∵ $S = \\tf{1}{2} \\times (\\tf{5b}{2}-\\tf{b}{2}) \\times a = ab = 4$ \n ∵ $\\tf{a}{b/2} \\times \\tf{a}{5b/2} = \\tf{4a^2}{5b^2} = \\tf{16}{5}$ \n ⇒ $a^2 = 4b^2 \\implies a=2b$ \n ⇒ $(2b)b=4 \\implies b=\\sqrt{2}, a=2\\sqrt{2}$ \n ∴ $a+b = 3\\sqrt{2}$ \n [Figure] \n 좌표계: O(0,0), A(\\sqrt{2}/2, 2\\sqrt{2}), B(5\\sqrt{2}/2, 2\\sqrt{2}) \n AB \\parallel x축 명시"
  }
]);
window.questionBank = window.questionBank.concat([
  {
    "id": 15,
    "level": "[최상]",
    "category": "삼각방정식",
    "content": "$-a \\le x \\le a$에서 방정식 $5\\sin^2(x+\\tf{\\pi}{2})-\\sin^2 x + \\cos x = 0$이 서로 다른 6개의 근을 갖도록 하는 양수 $a$의 최솟값은 $\\tf{q}{p}\\pi$이다. $p+q$의 값을 구하시오. (단, $p$와 $q$는 서로소인 자연수이다.) [4.6점]",
    "choices": ["7", "10", "13", "14", "17"],
    "answer": "1",
    "solution": "키워드: 각변환 및 인수분해 \n ∵ $\\sin(x+\\tf{\\pi}{2}) = \\cos x$ \n ⇒ $5\\cos^2 x - (1-\\cos^2 x) + \\cos x = 0$ \n ⇒ $6\\cos^2 x + \\cos x - 1 = 0$ \n ⇒ $(3\\cos x - 1)(2\\cos x + 1) = 0$ \n ⇒ $\\cos x = \\tf{1}{3} \\text{ 또는 } \\cos x = -\\tf{1}{2}$ \n ∵ 서로 다른 실근 6개 ($x \\in [-a, a]$) \n ⇒ 양수 범위에서 3개의 근 포함 ($x > 0$) \n ⇒ 근의 크기순: $\\alpha(\\cos\\alpha=\\tf{1}{3}) < \\tf{2\\pi}{3} < \\tf{4\\pi}{3}$ \n ∴ $a_{min} = \\tf{4\\pi}{3} \\implies p=3, q=4 \\implies p+q=7$"
  },
  {
    "id": 16,
    "level": "[최상]",
    "category": "지수로그함수",
    "content": "점 $A(8,0)$을 지나는 직선 $y=-x+8$이 두 곡선 $y=a^x, y=\\log_{a}x$와 만나는 점을 각각 $B, C$라 하고, 점 $B$를 지나고 $y$축에 수직인 직선이 곡선 $y=\\log_{a}x$와 만나는 점을 $D$라 하자. $BC:CA=2:1$일 때, 삼각형 $BCD$의 넓이는? (단, $a>1$) [4.6점]",
    "choices": ["107", "214", "321", "428", "535"],
    "answer": "4",
    "solution": "키워드: 역함수 대칭성 \n ∵ $y=a^x$ 와 $y=\\log_{a}x$ 는 $y=x$ 대칭 \n ∵ $y=-x+8$ 은 $y=x$ 에 수직 \n ⇒ $B(x_1, y_1), C(y_1, x_1)$ \n ∵ $A(8,0), BC:CA=2:1$ \n ⇒ $B(2,6), C(6,2)$ \n ∵ $6=a^2 \\implies a=\\sqrt{6}$ \n ∵ $y_D = 6 \\implies 6=\\log_{\\sqrt{6}}x_D \\implies x_D=216$ \n ⇒ $D(216, 6)$ \n ∴ $S = \\tf{1}{2} \\times (216-2) \\times (6-2) = 428$"
  },
  {
    "id": 17,
    "level": "[최상]",
    "category": "삼각함수",
    "content": "닫힌구간 $[0, 2\\pi]$에서 정의된 함수 $f(x)$는 <div class='box'>$f(x) = \\begin{cases} \\cos x & (0 \\le x \\le \\tf{k}{3}\\pi) \\\\ 2\\cos(\\tf{k}{3}\\pi)-\\cos x & (\\tf{k}{3}\\pi < x \\le 2\\pi) \\end{cases}$</div>이다. 곡선 $y=f(x)$와 직선 $y=\\cos(\\tf{k}{3}\\pi)$의 교점의 개수를 $a_k$라 할 때, $a_1+a_2+a_3+a_4+a_5$의 값은? [4.8점]",
    "choices": ["6", "7", "8", "9", "10"],
    "answer": "4",
    "solution": "키워드: 그래프의 대칭 이동 \n ∵ $y=2\\cos(\\tf{k\\pi}{3})-\\cos x$ 는 $y=\\cos(\\tf{k\\pi}{3})$ 에 대한 대칭 \n ⇒ $f(x) = \\cos(\\tf{k\\pi}{3})$ 의 해는 $\\cos x = \\cos(\\tf{k\\pi}{3})$ 의 해와 동일 \n ⇒ $a_1, a_5 (k=1, 5): \\cos x = \\tf{1}{2} \\implies 2$개 \n ⇒ $a_2, a_4 (k=2, 4): \\cos x = -\\tf{1}{2} \\implies 2$개 \n ⇒ $a_3 (k=3): \\cos x = -1 \\implies 1$개 \n ∴ $2+2+1+2+2=9$"
  },
  {
    "id": 18,
    "level": "[중상]",
    "category": "로그함수",
    "content": "<단답형 1> 함수 $y=\\log_{2}x$의 그래프를 $y$축의 방향으로 $-3$만큼 평행이동한 후 $x$축에 대하여 대칭이동한 그래프가 함수 $y=\\log_{a}bx$의 그래프와 일치할 때, $a+b$의 값을 구하시오. (단, $a \\ne 1, a>0, b>0$이고 $a, b$는 상수이다.) [4.0점]",
    "choices": [" ", " ", " ", " ", " "],
    "answer": "5/8",
    "solution": "키워드: 그래프의 이동 \n ∵ $y=\\log_{2}x \\xrightarrow{y축 -3} y=\\log_{2}x-3$ \n ∵ $x축 대칭 \\implies y = -(\\log_{2}x-3)$ \n ⇒ $y = \\log_{1/2}x + 3 = \\log_{1/2}x + \\log_{1/2}(\\tf{1}{2})^3$ \n ⇒ $y = \\log_{1/2}(\\tf{1}{8}x)$ \n ∴ $a=\tf{1}{2}, b=\tf{1}{8} \\implies a+b = \\tf{5}{8}$"
  },
  {
    "id": 19,
    "level": "[최상]",
    "category": "삼각함수",
    "content": "<단답형 2> 실수 $t$에 대하여 직선 $y=t$와 함수 $y=|a\\sin 2x+b|(0 \\le x \\le 2\\pi)$의 그래프가 만나는 서로 다른 교점의 개수를 $f(t)$라 하자. $f(3)=7$일 때, $f(t)=4$를 만족시키는 모든 실수 $t$의 범위를 구하시오. (단, $a>0, b>0$) [5.0점]",
    "choices": [" ", " ", " ", " ", " "],
    "answer": "t=0 또는 3<t<9",
    "solution": "키워드: 절댓값 그래프 \n ∵ $T = \\pi$ (2주기 포함) \n ∵ $f(3)=7 \\implies t=3$ 이 중심축 $b$에 위치 \n ⇒ $b=3, a=6$ (봉우리 높이 $9$ 와 $3$) \n ∵ $f(t)=4$ 인 경우 \n Case 1) $t=0$ ($x$축 접점 4개) \n Case 2) $3 < t < 9$ (큰 봉우리 4개 관통) \n ∴ $t=0 \\text{ 또는 } 3 < t < 9$"
  },
  {
    "id": 20,
    "level": "[상]",
    "category": "지수",
    "content": "<서술형 1> 두 실수 $a, b$에 대하여 $7^{a+b}=16, 7^{a-b}=4$일 때, $\\log_{7}8^{\tf{a+b}{ab}}$의 값을 구하시오. [10.0점]",
    "choices": [" ", " ", " ", " ", " "],
    "answer": "4",
    "solution": "키워드: 지수법칙 \n ∵ $7^{a+b} \\times 7^{a-b} = 16 \\times 4 \\implies 7^{2a} = 64 \\implies 7^a = 8$ \n ∵ $7^{a+b} \\div 7^{a-b} = 16 \\div 4 \\implies 7^{2b} = 4 \\implies 7^b = 2$ \n ⇒ $7^a = (7^b)^3 \\implies a=3b$ \n ⇒ 지수: $\\tf{a+b}{ab} = \\tf{4b}{3b^2} = \\tf{4}{3b}$ \n ⇒ $\\log_{7}(2^3)^{\tf{4}{3b}} = \\log_{7}2^{\tf{4}{b}} = \\log_{7}(2^{1/b})^4$ \n ∴ $\\log_{7}7^4 = 4$"
  },
  {
    "id": 21,
    "level": "[최상]",
    "category": "지수로그함수",
    "content": "<서술형 2> $a>2$인 실수 $a$에 대하여 기울기가 $-1$인 직선이 두 곡선 $y=a^{x-3}, y=\\log_{a}(x-3)$과 만나는 점을 각각 $A, B$라 하자. 점 $C(3,0)$에 대하여 삼각형 $ABC$의 넓이가 $10$이고 선분 $AB$의 중점의 좌표가 $\\tf{11}{2}$일 때, $a$의 값을 구하시오. [10.0점]",
    "choices": [" ", " ", " ", " ", " "],
    "answer": "81/4",
    "solution": "키워드: 평행이동과 대칭 \n ∵ 대칭축 $y=x-3$ \n ∵ 중점 $M$ 이 대칭축 위에 존재 \n ⇒ $M(\\tf{11}{2}, \\tf{5}{2})$ \n ∵ 직선 $AB: x+y-8=0$ \n ∵ 점 $C(3,0)$ 과 직선 $AB$ 사이 거리 $h = \\tf{|3+0-8|}{\\sqrt{2}} = \\tf{5}{\\sqrt{2}}$ \n ∵ $S = \\tf{1}{2} \\times AB \\times \\tf{5}{\\sqrt{2}} = 10 \\implies AB = 4\\sqrt{2}$ \n ⇒ $A(\\tf{11}{2}-2, \\tf{5}{2}+2) = (\\tf{7}{2}, \\tf{9}{2})$ \n ∵ $A$ 점 대입: $\\tf{9}{2} = a^{7/2-3} = a^{1/2}$ \n ∴ $a = (\\tf{9}{2})^2 = \\tf{81}{4}$"
  }
]);