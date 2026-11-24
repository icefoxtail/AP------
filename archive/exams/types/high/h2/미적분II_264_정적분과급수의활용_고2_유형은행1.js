window.examTitle = "미적분II_264_정적분과급수의활용_고2_유형은행1";

window.questionBank = [
  {
    "id": 1,
    "category": "정적분의 활용",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-08",
    "standardUnit": "정적분의 활용",
    "standardUnitOrder": 8,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "정적분의 활용"
    ],
    "wide": false,
    "content": "자연수 $n$에 대하여 직선 $x=n+k$가 두 직선 $y=x+2$, $y=0$과 만나는 점을 각각 $\\mathrm{A}$, $\\mathrm{B}$라 하자. 선분 $\\mathrm{AB}$를 세로로 하고 가로의 길이가 $3$인 직사각형의 넓이를 $f(k)$라 할 때,\n$$\\lim_{n\\to\\infty} \\sum_{k=1}^n \\frac{1}{f(k)}$$\n의 값은?\n[그림: 좌표평면 위에 제1사분면을 지나는 직선 $y=x+2$와 $x$축이 있다. 직선 $x=n+k$가 직선 $y=x+2$와 만나는 점을 $\\mathrm{A}$, $x$축과 만나는 점을 $\\mathrm{B}$라 하고, 선분 $\\mathrm{AB}$를 세로로 하고 가로의 길이가 $3$인 직사각형이 색칠되어 있다.]",
    "choices": [
      "\\frac{\\ln 2}{3}",
      "\\frac{\\ln 2}{2}",
      "\\frac{\\ln 3}{3}",
      "\\frac{\\ln 3}{2}",
      "\\ln 2"
    ],
    "answer": "①",
    "solution": "직선 $x=n+k$ 위의 두 점의 좌표 구하기: $\\mathrm{A}(n+k,\\,n+k+2)$, $\\mathrm{B}(n+k,\\,0)$이다.\n선분 $\\mathrm{AB}$의 길이 구하기: $\\overline{\\mathrm{AB}}=(n+k+2)-0=n+k+2$이다.\n직사각형의 넓이 구하기: 세로가 $n+k+2$, 가로가 $3$이므로 $f(k)=3(n+k+2)$이다.\n일반항을 $n$으로 나눈 꼴로 정리하기: $\\frac{1}{f(k)}=\\frac{1}{3(n+k+2)}=\\frac{1}{3}\\cdot\\frac{1}{1+\\frac{k+2}{n}}\\cdot\\frac{1}{n}$이다.\n합의 식 정리하기: $\\displaystyle\\sum_{k=1}^{n}\\frac{1}{f(k)}=\\frac{1}{3}\\sum_{k=1}^{n}\\frac{1}{1+\\frac{k}{n}+\\frac{2}{n}}\\cdot\\frac{1}{n}$이다.\n정적분과 급수의 관계 적용하기: $x_k=\\frac{k}{n}$, $\\Delta x=\\frac{1}{n}$이고 $\\frac{2}{n}\\to 0$이므로 $\\displaystyle\\lim_{n\\to\\infty}\\sum_{k=1}^{n}\\frac{1}{f(k)}=\\frac{1}{3}\\int_0^1\\frac{1}{1+x}\\,dx$이다.\n치환적분법으로 계산하기: $\\displaystyle\\frac{1}{3}\\int_0^1\\frac{1}{1+x}\\,dx=\\frac{1}{3}\\Big[\\ln(1+x)\\Big]_0^1$이다.\n값 대입하기: $\\frac{1}{3}(\\ln 2-\\ln 1)=\\frac{1}{3}\\ln 2$이다.\n주의: 가로 $3$이 분모에 들어가 앞의 계수 $\\frac{1}{3}$을 빠뜨리지 않아야 한다.\n따라서 정답은 ①이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-189",
    "problemTypeKey": "PT_CALCULUS_RIEMANN_SUM",
    "templateKey": "TPL_CALCULUS_RIEMANN_SERIES_TO_INTEGRAL",
    "crossConceptKeys": [
      "CC_LINEAR_FUNCTIONS"
    ],
    "conditionKeys": [
      "COND_NATURAL_NUMBER"
    ],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 2,
    "category": "정적분의 활용",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-08",
    "standardUnit": "정적분의 활용",
    "standardUnitOrder": 8,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "정적분의 활용"
    ],
    "wide": false,
    "content": "다음 그림과 같이 $\\overline{\\mathrm{AB}}=3$, $\\overline{\\mathrm{BC}}=1$, $\\angle\\mathrm{B}=90^\\circ$인 직각삼각형 $\\mathrm{ABC}$가 있다. 변 $\\mathrm{AB}$를 $n$등분한 점을 점 $\\mathrm{A}$에서 가까운 점부터 차례로 $\\mathrm{B}_1, \\mathrm{B}_2, \\cdots, \\mathrm{B}_{n-1}$이라 하고, 각 점에서 변 $\\mathrm{BC}$에 평행하게 직선을 그어 변 $\\mathrm{AC}$와 만나는 점을 각각 $\\mathrm{C}_1, \\mathrm{C}_2, \\cdots, \\mathrm{C}_{n-1}$이라고 하자. 이때\n$$\\lim_{n\\to\\infty} \\frac{\\pi}{n} \\sum_{k=1}^{n-1} \\overline{\\mathrm{B}_k \\mathrm{C}_k}^2$$\n의 값은?\n[그림: $\\overline{\\mathrm{AB}}=3$, $\\overline{\\mathrm{BC}}=1$, $\\angle\\mathrm{B}=90^\\circ$인 직각삼각형 $\\mathrm{ABC}$가 있다. 변 $\\mathrm{AB}$ 위에 점 $\\mathrm{A}$로부터 차례로 $n$등분점 $\\mathrm{B}_1, \\mathrm{B}_2, \\cdots, \\mathrm{B}_{n-1}$이 있고, 각 점에서 변 $\\mathrm{BC}$에 평행하게 선분을 그어 변 $\\mathrm{AC}$와 만나는 점을 각각 $\\mathrm{C}_1, \\mathrm{C}_2, \\cdots, \\mathrm{C}_{n-1}$이라 한다.]",
    "choices": [
      "\\frac{\\pi}{6}",
      "\\frac{\\pi}{3}",
      "\\frac{\\pi}{2}",
      "\\frac{2}{3}\\pi",
      "\\pi"
    ],
    "answer": "②",
    "solution": "$n$등분점의 위치 구하기: $\\overline{\\mathrm{AB}}=3$을 $n$등분하므로 $\\overline{\\mathrm{AB}_k}=3\\cdot\\frac{k}{n}=\\frac{3k}{n}$이다.\n닮음 찾기: $\\mathrm{B}_k\\mathrm{C}_k\\parallel\\mathrm{BC}$이므로 $\\triangle\\mathrm{AB}_k\\mathrm{C}_k\\sim\\triangle\\mathrm{ABC}$ (AA 닮음)이다.\n닮음비 적용하기: $\\frac{\\overline{\\mathrm{B}_k\\mathrm{C}_k}}{\\overline{\\mathrm{BC}}}=\\frac{\\overline{\\mathrm{AB}_k}}{\\overline{\\mathrm{AB}}}=\\frac{\\frac{3k}{n}}{3}=\\frac{k}{n}$이다.\n길이 대입하기: $\\overline{\\mathrm{BC}}=1$이므로 $\\overline{\\mathrm{B}_k\\mathrm{C}_k}=1\\cdot\\frac{k}{n}=\\frac{k}{n}$이다.\n제곱하여 정리하기: $\\overline{\\mathrm{B}_k\\mathrm{C}_k}^{\\,2}=\\frac{k^2}{n^2}$이다.\n급수식에 대입하기: $\\displaystyle\\frac{\\pi}{n}\\sum_{k=1}^{n-1}\\overline{\\mathrm{B}_k\\mathrm{C}_k}^{\\,2}=\\pi\\sum_{k=1}^{n-1}\\Big(\\frac{k}{n}\\Big)^2\\frac{1}{n}$이다.\n정적분과 급수의 관계 적용하기: $x_k=\\frac{k}{n}$, $\\Delta x=\\frac{1}{n}$이므로 $\\displaystyle\\lim_{n\\to\\infty}\\pi\\sum_{k=1}^{n-1}\\Big(\\frac{k}{n}\\Big)^2\\frac{1}{n}=\\pi\\int_0^1 x^2\\,dx$이다.\n다항함수의 정적분 계산하기: $\\displaystyle\\pi\\Big[\\frac{x^3}{3}\\Big]_0^1=\\pi\\Big(\\frac{1}{3}-0\\Big)=\\frac{\\pi}{3}$이다.\n주의: 항이 $k=1$부터 $n-1$까지여도 끝항의 기여가 $0$으로 사라져 정적분 $\\int_0^1$과 같아진다.\n따라서 정답은 ②이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-189",
    "problemTypeKey": "PT_CALCULUS_RIEMANN_SUM",
    "templateKey": "TPL_CALCULUS_RIEMANN_SERIES_TO_INTEGRAL",
    "crossConceptKeys": [
      "CC_SIMILARITY_RATIO"
    ],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 3,
    "category": "정적분의 활용",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-08",
    "standardUnit": "정적분의 활용",
    "standardUnitOrder": 8,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "정적분의 활용"
    ],
    "wide": false,
    "content": "다음 그림과 같이 두 점 $\\mathrm{A}(-2, 0)$, $\\mathrm{B}(2, 0)$을 지름의 양 끝 점으로 하는 반원 $x^2+y^2=4$ ($y \\ge 0$)가 있다. 호 $\\mathrm{AB}$를 $n$등분하는 점을 $\\mathrm{A}$에서 가까운 점부터 차례대로 $\\mathrm{P}_1, \\mathrm{P}_2, \\cdots, \\mathrm{P}_{n-1}$이라 하자. 삼각형 $\\mathrm{ABP}_k$ ($k=1, 2, \\cdots, n-1$)의 넓이를 $S_k$라 할 때,\n$$\\lim_{n\\to\\infty} \\frac{1}{n} \\sum_{k=1}^{n-1} S_k$$\n의 값은?\n[그림: 좌표평면 위에 두 점 $\\mathrm{A}(-2, 0)$, $\\mathrm{B}(2, 0)$을 지름의 양 끝 점으로 하는 반원 $x^2+y^2=4$ ($y \\ge 0$)가 있다. 호 $\\mathrm{AB}$ 위에 점 $\\mathrm{A}$로부터 차례로 $n$등분점 $\\mathrm{P}_1, \\mathrm{P}_2, \\cdots, \\mathrm{P}_{n-1}$이 있고, 삼각형 $\\mathrm{ABP}_k$가 색칠되어 있다.]",
    "choices": [
      "\\frac{2}{\\pi}",
      "\\frac{3}{\\pi}",
      "\\frac{4}{\\pi}",
      "\\frac{6}{\\pi}",
      "\\frac{8}{\\pi}"
    ],
    "answer": "⑤",
    "solution": "반원의 반지름과 중심각 확인하기: 중심은 원점, 반지름 $R=2$, 호 $\\mathrm{AB}$의 중심각은 $\\pi$이다.\n$n$등분으로 중심각 정하기: $\\angle\\mathrm{AOP}_k=\\frac{k}{n}\\pi$이다.\n점 $\\mathrm{P}_k$의 $y$좌표 구하기: $\\overline{\\mathrm{OP}_k}$가 $x$축 양의 방향과 이루는 각이 $\\pi-\\frac{k\\pi}{n}$이므로 $y=2\\sin\\big(\\pi-\\frac{k\\pi}{n}\\big)=2\\sin\\frac{k\\pi}{n}$이다.\n삼각형의 높이 구하기: $h_k=2\\sin\\frac{k\\pi}{n}$이다.\n삼각형의 밑변 구하기: $\\overline{\\mathrm{AB}}=2-(-2)=4$이다.\n넓이 $S_k$ 구하기: $S_k=\\frac{1}{2}\\cdot 4\\cdot 2\\sin\\frac{k\\pi}{n}=4\\sin\\frac{k\\pi}{n}$이다.\n급수식에 대입하기: $\\displaystyle\\frac{1}{n}\\sum_{k=1}^{n-1}S_k=\\frac{1}{n}\\sum_{k=1}^{n-1}4\\sin\\frac{k\\pi}{n}$이다.\n정적분과 급수의 관계 적용하기: $x_k=\\frac{k}{n}$, $\\Delta x=\\frac{1}{n}$이므로 $\\displaystyle\\lim_{n\\to\\infty}\\frac{1}{n}\\sum_{k=1}^{n-1}4\\sin\\frac{k\\pi}{n}=\\int_0^1 4\\sin(\\pi x)\\,dx$이다.\n삼각함수의 정적분 계산하기: $\\displaystyle\\int_0^1 4\\sin(\\pi x)\\,dx=\\Big[-\\frac{4}{\\pi}\\cos(\\pi x)\\Big]_0^1$이다.\n값 대입하기: $-\\frac{4}{\\pi}(\\cos\\pi-\\cos 0)=-\\frac{4}{\\pi}(-1-1)=\\frac{8}{\\pi}$이다.\n주의: $\\sin(\\pi x)$를 적분할 때 합성함수의 미분 역과정으로 생기는 계수 $\\frac{1}{\\pi}$을 빠뜨리지 않아야 한다.\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-189",
    "problemTypeKey": "PT_CALCULUS_RIEMANN_SUM",
    "templateKey": "TPL_CALCULUS_RIEMANN_SERIES_TO_INTEGRAL",
    "crossConceptKeys": [
      "CC_TRIG_RATIO"
    ],
    "conditionKeys": [
      "COND_RANGE"
    ],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 4,
    "category": "정적분의 활용",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-08",
    "standardUnit": "정적분의 활용",
    "standardUnitOrder": 8,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "정적분의 활용"
    ],
    "wide": false,
    "content": "다음 그림과 같이 함수 $f(x)=2e^x$이 있다. $2$ 이상인 자연수 $n$에 대하여 닫힌구간 $[1, 2]$를 $n$등분한 각 분점(양 끝점도 포함)을 차례로 $1=x_0, x_1, x_2, \\cdots, x_n=2$라 하자.\n세 점 $(0, 0)$, $(x_k, 0)$, $(x_k, f(x_k))$를 꼭짓점으로 하는 삼각형의 넓이를 $A_k$ ($k=1, 2, \\cdots, n$)이라 할 때,\n$$\\lim_{n\\to\\infty} \\frac{1}{n} \\sum_{k=1}^n A_k$$\n의 값은?\n[그림: 좌표평면 위에 함수 $y=2e^x$의 그래프가 그려져 있다. $x$축 위의 닫힌구간 $[1, 2]$가 $n$등분되어 분점 $1=x_0, x_1, x_2, \\cdots, x_n=2$가 표시되어 있고, 원점 $(0, 0)$, 점 $(x_k, 0)$, 점 $(x_k, 2e^{x_k})$를 꼭짓점으로 하는 직각삼각형이 색칠되어 있다.]",
    "choices": [
      "\\frac{1}{2}e",
      "e",
      "e^2",
      "\\frac{3}{2}e^2",
      "2e^2"
    ],
    "answer": "③",
    "solution": "분점의 좌표 구하기: 구간 $[1,2]$의 길이가 $1$이고 $n$등분이므로 $x_k=1+\\frac{k}{n}$이다.\n삼각형의 밑변 구하기: 두 점 $(0,0)$, $(x_k,0)$ 사이의 거리이므로 밑변은 $x_k$이다.\n삼각형의 높이 구하기: 점 $(x_k,f(x_k))$의 $y$좌표이므로 높이는 $f(x_k)=2e^{x_k}$이다.\n넓이 $A_k$ 구하기: $A_k=\\frac{1}{2}\\cdot x_k\\cdot 2e^{x_k}=x_k e^{x_k}$이다.\n급수식에 대입하기: $\\displaystyle\\frac{1}{n}\\sum_{k=1}^{n}A_k=\\sum_{k=1}^{n}\\Big(1+\\frac{k}{n}\\Big)e^{1+\\frac{k}{n}}\\cdot\\frac{1}{n}$이다.\n정적분과 급수의 관계 적용하기: $x_k=1+\\frac{k}{n}$, $\\Delta x=\\frac{1}{n}$이므로 $\\displaystyle\\lim_{n\\to\\infty}\\frac{1}{n}\\sum_{k=1}^{n}A_k=\\int_1^2 x e^x\\,dx$이다.\n부분적분법 적용하기: $u=x$, $v'=e^x$로 두면 $u'=1$, $v=e^x$이므로 $\\displaystyle\\int_1^2 x e^x\\,dx=\\Big[x e^x\\Big]_1^2-\\int_1^2 e^x\\,dx$이다.\n각 항 계산하기: $\\Big[x e^x\\Big]_1^2=2e^2-e$, $\\displaystyle\\int_1^2 e^x\\,dx=e^2-e$이다.\n빼서 정리하기: $(2e^2-e)-(e^2-e)=2e^2-e-e^2+e=e^2$이다.\n주의: 밑변은 등분 간격 $\\Delta x=\\frac{1}{n}$이 아니라 원점에서 $x_k$까지의 거리 $x_k$임을 혼동하지 않아야 한다.\n따라서 정답은 ③이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-189",
    "problemTypeKey": "PT_CALCULUS_RIEMANN_SUM",
    "templateKey": "TPL_CALCULUS_RIEMANN_SERIES_TO_INTEGRAL",
    "crossConceptKeys": [
      "CC_INTEGRATION_BY_PARTS_OR_EXPANSION"
    ],
    "conditionKeys": [
      "COND_NATURAL_NUMBER",
      "COND_RESTRICTED_INTERVAL"
    ],
    "integrationPattern": "SEQUENTIAL"
  }
];
