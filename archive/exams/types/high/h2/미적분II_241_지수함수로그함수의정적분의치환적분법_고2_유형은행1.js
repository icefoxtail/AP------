window.examTitle = "미적분II_241_지수함수로그함수의정적분의치환적분법_고2_유형은행1";

window.questionBank = [
  {
    "id": 1,
    "category": "여러 가지 적분법",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-07",
    "standardUnit": "여러 가지 적분법",
    "standardUnitOrder": 7,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "여러 가지 적분법"
    ],
    "wide": false,
    "content": "실수 $a$에 대하여\n$$f(a) = \\int_1^a \\frac{\\sqrt[3]{(\\ln x)^2}}{x} dx$$\n일 때, $f(a^8)$과 같은 것은? (단, $a > 1$)",
    "choices": [
      "$8f(a)$",
      "$16f(a)$",
      "$24f(a)$",
      "$32f(a)$",
      "$40f(a)$"
    ],
    "answer": "④",
    "solution": "$f(a)$의 피적분함수를 $\\ln x$ 한 덩어리로 보기 위해 $t=\\ln x$로 치환한다. (치환적분법)\n$\\frac{dt}{dx}=\\frac{1}{x}$이므로 $\\frac{1}{x}dx=dt$이고, 적분구간은 $x=1$일 때 $t=\\ln 1=0$, $x=a$일 때 $t=\\ln a$이다.\n$f(a)=\\int_0^{\\ln a} t^{\\frac{2}{3}}dt=\\left[\\frac{3}{5}t^{\\frac{5}{3}}\\right]_0^{\\ln a}=\\frac{3}{5}(\\ln a)^{\\frac{5}{3}}$\n$a$ 대신 $a^8$을 대입하면 $f(a^8)=\\frac{3}{5}(\\ln a^8)^{\\frac{5}{3}}$이다.\n로그의 성질 $\\ln a^8=8\\ln a$를 적용하면 $f(a^8)=\\frac{3}{5}(8\\ln a)^{\\frac{5}{3}}=\\frac{3}{5}\\cdot 8^{\\frac{5}{3}}(\\ln a)^{\\frac{5}{3}}$이다.\n$8^{\\frac{5}{3}}=(2^3)^{\\frac{5}{3}}=2^5=32$이므로 $f(a^8)=32\\cdot\\frac{3}{5}(\\ln a)^{\\frac{5}{3}}=32f(a)$이다.\n주의: $8$을 $\\frac{5}{3}$제곱할 때 $8^{\\frac{5}{3}}$ 전체가 계수로 빠져나온다는 점을 놓치지 않는다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-098",
    "problemTypeKey": "PT_CALCULUS_SUBSTITUTION_INTEGRAL",
    "templateKey": "TPL_CALCULUS_SUBSTITUTION_DEFINITE",
    "crossConceptKeys": [],
    "conditionKeys": [
      "COND_RANGE"
    ],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 2,
    "category": "여러 가지 적분법",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-07",
    "standardUnit": "여러 가지 적분법",
    "standardUnitOrder": 7,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "여러 가지 적분법"
    ],
    "wide": false,
    "content": "정적분\n$$\\int_1^e \\frac{15}{x(1+2\\ln x)^2} dx$$\n의 값은?",
    "choices": [
      "1",
      "2",
      "3",
      "4",
      "5"
    ],
    "answer": "⑤",
    "solution": "$1+2\\ln x$를 한 덩어리로 보기 위해 $t=1+2\\ln x$로 치환한다. (치환적분법)\n$\\frac{dt}{dx}=\\frac{2}{x}$이므로 $\\frac{1}{x}dx=\\frac{1}{2}dt$이다.\n적분구간은 $x=1$일 때 $t=1+2\\ln 1=1$, $x=e$일 때 $t=1+2\\ln e=1+2=3$이다.\n$\\int_1^e \\frac{15}{x(1+2\\ln x)^2}dx=\\int_1^3 \\frac{15}{t^2}\\cdot\\frac{1}{2}dt=\\frac{15}{2}\\int_1^3 t^{-2}dt$\n$\\int t^{-2}dt=-\\frac{1}{t}$이므로 $\\frac{15}{2}\\left[-\\frac{1}{t}\\right]_1^3$이다.\n$=\\frac{15}{2}\\left(-\\frac{1}{3}+1\\right)=\\frac{15}{2}\\cdot\\frac{2}{3}=5$\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-098",
    "problemTypeKey": "PT_CALCULUS_SUBSTITUTION_INTEGRAL",
    "templateKey": "TPL_CALCULUS_SUBSTITUTION_DEFINITE",
    "crossConceptKeys": [],
    "conditionKeys": [],
    "integrationPattern": "NONE"
  },
  {
    "id": 3,
    "category": "여러 가지 적분법",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-07",
    "standardUnit": "여러 가지 적분법",
    "standardUnitOrder": 7,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "여러 가지 적분법"
    ],
    "wide": false,
    "content": "정적분\n$$\\int_1^e \\frac{2\\ln x + 3}{x(\\ln x + 1)} dx$$\n의 값은?",
    "choices": [
      "$1-\\ln 2$",
      "$\\ln 2$",
      "$2-\\ln 2$",
      "$1+\\ln 2$",
      "$2+\\ln 2$"
    ],
    "answer": "⑤",
    "solution": "분모의 인수 $\\ln x+1$을 한 덩어리로 보기 위해 $t=\\ln x+1$로 치환한다. (치환적분법)\n$\\frac{dt}{dx}=\\frac{1}{x}$이므로 $\\frac{1}{x}dx=dt$이고, $\\ln x=t-1$이다.\n분자를 $t$로 나타내면 $2\\ln x+3=2(t-1)+3=2t+1$이다.\n적분구간은 $x=1$일 때 $t=0+1=1$, $x=e$일 때 $t=1+1=2$이다.\n$\\int_1^e \\frac{2\\ln x+3}{x(\\ln x+1)}dx=\\int_1^2 \\frac{2t+1}{t}dt=\\int_1^2\\left(2+\\frac{1}{t}\\right)dt$\n$=\\left[2t+\\ln|t|\\right]_1^2=(4+\\ln 2)-(2+0)=2+\\ln 2$\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-098",
    "problemTypeKey": "PT_CALCULUS_SUBSTITUTION_INTEGRAL",
    "templateKey": "TPL_CALCULUS_SUBSTITUTION_DEFINITE",
    "crossConceptKeys": [],
    "conditionKeys": [],
    "integrationPattern": "NONE"
  },
  {
    "id": 4,
    "category": "여러 가지 적분법",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-07",
    "standardUnit": "여러 가지 적분법",
    "standardUnitOrder": 7,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "여러 가지 적분법"
    ],
    "wide": false,
    "content": "자연수 $n$에 대하여\n$$a_n = \\int_1^{e^n} \\frac{3\\ln x}{x} dx$$\n일 때,\n$$\\sum_{n=1}^9 \\frac{1}{\\sqrt{a_n a_{n+1}}}$$\n의 값은?",
    "choices": [
      "$\\frac{1}{2}$",
      "$\\frac{3}{5}$",
      "$\\frac{7}{10}$",
      "$\\frac{4}{5}$",
      "$\\frac{9}{10}$"
    ],
    "answer": "②",
    "solution": "$t=\\ln x$로 치환하면 $\\frac{1}{x}dx=dt$이고, 구간은 $x=1$일 때 $t=0$, $x=e^n$일 때 $t=n$이다. (치환적분법)\n$a_n=\\int_0^n 3t\\,dt=\\left[\\frac{3}{2}t^2\\right]_0^n=\\frac{3}{2}n^2$\n따라서 $a_{n+1}=\\frac{3}{2}(n+1)^2$이다.\n$\\sqrt{a_na_{n+1}}=\\sqrt{\\frac{3}{2}n^2\\cdot\\frac{3}{2}(n+1)^2}=\\frac{3}{2}n(n+1)$\n부분분수 분해 $\\frac{1}{n(n+1)}=\\frac{1}{n}-\\frac{1}{n+1}$를 적용하면 $\\frac{1}{\\sqrt{a_na_{n+1}}}=\\frac{2}{3}\\left(\\frac{1}{n}-\\frac{1}{n+1}\\right)$이다.\n$\\sum_{n=1}^9 \\frac{1}{\\sqrt{a_na_{n+1}}}=\\frac{2}{3}\\left\\{\\left(1-\\frac{1}{2}\\right)+\\left(\\frac{1}{2}-\\frac{1}{3}\\right)+\\cdots+\\left(\\frac{1}{9}-\\frac{1}{10}\\right)\\right\\}$\n이웃한 항이 소거되어 $=\\frac{2}{3}\\left(1-\\frac{1}{10}\\right)=\\frac{2}{3}\\cdot\\frac{9}{10}=\\frac{3}{5}$\n따라서 정답은 ②이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-098",
    "problemTypeKey": "PT_CALCULUS_SUBSTITUTION_INTEGRAL",
    "templateKey": "TPL_CALCULUS_SUBSTITUTION_DEFINITE",
    "crossConceptKeys": [
      "CC_TELESCOPING_SERIES"
    ],
    "conditionKeys": [
      "COND_NATURAL_NUMBER"
    ],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 5,
    "category": "여러 가지 적분법",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-07",
    "standardUnit": "여러 가지 적분법",
    "standardUnitOrder": 7,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "여러 가지 적분법"
    ],
    "wide": false,
    "content": "다음 조건을 만족시키는 함수 $f(x)$에 대하여 정적분 $\\int_{2025}^{2026} f(x) dx$의 값은?\n(가) $1 \\le x < 2$일 때, $f(x) = \\frac{1}{x(1+2\\ln x)^2}$이다.\n(나) 모든 실수 $x$에 대하여 $f(x) = f(x+1)$이다.",
    "choices": [
      "$\\frac{\\ln 2}{1+2\\ln 2}$",
      "$\\frac{\\ln 2}{1+\\ln 2}$",
      "$\\frac{\\ln 3}{1+\\ln 3}$",
      "$\\frac{2\\ln 2}{1+2\\ln 2}$",
      "$\\frac{2\\ln 2}{1+\\ln 2}$"
    ],
    "answer": "①",
    "solution": "조건 (나)는 $f$가 주기 $1$인 주기함수임을 뜻하므로, $\\int_{a+1}^{b+1}f(x)dx=\\int_a^b f(x)dx$가 성립한다. (주기함수의 정적분)\n구간 $[2025,2026]=[1+2024,\\,2+2024]$이므로 $\\int_{2025}^{2026}f(x)dx=\\int_1^2 f(x)dx$이다.\n조건 (가)에 따라 $f(x)=\\frac{1}{x(1+2\\ln x)^2}$ $(1\\le x<2)$이므로 $\\int_1^2 \\frac{1}{x(1+2\\ln x)^2}dx$를 계산한다.\n$t=1+2\\ln x$로 치환하면 $\\frac{dt}{dx}=\\frac{2}{x}$이므로 $\\frac{1}{x}dx=\\frac{1}{2}dt$이다. (치환적분법)\n적분구간은 $x=1$일 때 $t=1$, $x=2$일 때 $t=1+2\\ln 2$이다.\n$\\int_1^2 \\frac{1}{x(1+2\\ln x)^2}dx=\\frac{1}{2}\\int_1^{1+2\\ln 2} t^{-2}dt=\\frac{1}{2}\\left[-\\frac{1}{t}\\right]_1^{1+2\\ln 2}$\n$=\\frac{1}{2}\\left(1-\\frac{1}{1+2\\ln 2}\\right)=\\frac{1}{2}\\cdot\\frac{(1+2\\ln 2)-1}{1+2\\ln 2}$\n$=\\frac{1}{2}\\cdot\\frac{2\\ln 2}{1+2\\ln 2}=\\frac{\\ln 2}{1+2\\ln 2}$\n주의: 옮길 구간의 길이가 주기 $1$과 같아야 하며, 여기서는 $2026-2025=1$이므로 그대로 $[1,2]$로 옮길 수 있다.\n따라서 정답은 ①이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B45",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-098",
    "problemTypeKey": "PT_CALCULUS_SUBSTITUTION_INTEGRAL",
    "templateKey": "TPL_CALCULUS_SUBSTITUTION_DEFINITE",
    "crossConceptKeys": [
      "CC_PERIODIC_FUNCTION"
    ],
    "conditionKeys": [
      "COND_RESTRICTED_INTERVAL",
      "COND_UNIVERSAL_INPUTS"
    ],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 6,
    "category": "여러 가지 적분법",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-07",
    "standardUnit": "여러 가지 적분법",
    "standardUnitOrder": 7,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "여러 가지 적분법"
    ],
    "wide": false,
    "content": "곡선 $y = 2x^2 + 1$ 위의 점 $P(x, y)$에서의 접선이 $x$축의 양의 방향과 이루는 각의 크기를 $\\theta(x)$라고 할 때, 정적분\n$$\\int_0^1 e^{2x^2} \\tan\\theta(x) dx$$\n의 값은? [그림: 좌표평면 위의 제1사분면에 곡선 $y=2x^2+1$이 그려져 있고, $y$절편은 $(0, 1)$이다. 곡선 위의 제1사분면에 점 $P(x, y)$가 잡혀 있으며, 점 $P$에서의 접선이 그어져 있다. 이 접선이 $x$축과 만나는 점에서 $x$축의 양의 방향과 접선이 이루는 각의 위치에 각의 호와 $\\theta(x)$가 표시되어 있다.]",
    "choices": [
      "$e-1$",
      "$e^2-1$",
      "$e^2$",
      "$e^2+1$",
      "$2e^2$"
    ],
    "answer": "②",
    "solution": "접선이 $x$축의 양의 방향과 이루는 각이 $\\theta(x)$이므로 $\\tan\\theta(x)$는 그 점에서의 접선의 기울기이다. (미분계수의 기하적 의미)\n$y=2x^2+1$을 미분하면 $y'=4x$이므로 $\\tan\\theta(x)=4x$이다.\n따라서 $\\int_0^1 e^{2x^2}\\tan\\theta(x)dx=\\int_0^1 4xe^{2x^2}dx$이다.\n$t=2x^2$으로 치환하면 $\\frac{dt}{dx}=4x$이므로 $4x\\,dx=dt$이다. (치환적분법)\n적분구간은 $x=0$일 때 $t=0$, $x=1$일 때 $t=2$이다.\n$\\int_0^1 4xe^{2x^2}dx=\\int_0^2 e^t dt=\\left[e^t\\right]_0^2$\n$=e^2-e^0=e^2-1$\n따라서 정답은 ②이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-098",
    "problemTypeKey": "PT_CALCULUS_SUBSTITUTION_INTEGRAL",
    "templateKey": "TPL_CALCULUS_SUBSTITUTION_DEFINITE",
    "crossConceptKeys": [
      "CC_TANGENT_LINE_SLOPE_AT_POINT"
    ],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
  }
];
