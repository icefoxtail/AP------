window.examTitle = "미적분II_275_역함수관계인함수로둘러싸인부분의넓이_고2_유형은행1";

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
    "content": "함수 $f(x) = 2e^{ax+b}$의 그래프와 그 역함수 $y=g(x)$의 그래프가 점 $(2, 2)$를 지나고 점 $(2, 2)$에서 공통인 접선을 가질 때, 두 곡선 $y=f(x)$, $y=g(x)$와 $x$축 및 $y$축으로 둘러싸인 도형의 넓이는? (단, $a, b$는 상수이다.)",
    "choices": [
      "$4 - \\frac{10}{e}$",
      "$4 - \\frac{8}{e}$",
      "$4 - \\frac{6}{e}$",
      "$4 - \\frac{4}{e}$",
      "$4 - \\frac{2}{e}$"
    ],
    "answer": "②",
    "solution": "두 곡선이 점 $(2,2)$에서 만나고 역함수 그래프의 교점은 직선 $y=x$ 위에 있으므로 $f(2)=2$이다: $2e^{2a+b}=2 \\Rightarrow 2a+b=0$.\n$y=f(x)$와 $y=g(x)$는 직선 $y=x$에 대하여 대칭이므로 같은 점에서의 접선도 서로 대칭이다.\n공통접선의 기울기를 $m$이라 하면 역함수의 미분법에 의해 역함수 쪽 기울기는 $\\frac{1}{m}$이므로 $m=\\frac{1}{m}$, 즉 $m=1$이다(접선의 기울기는 양수).\n$f'(x)=2ae^{ax+b}$이므로 $f'(2)=2ae^{2a+b}=2a\\cdot 1=2a$이다.\n$2a=1$에서 $a=\\frac{1}{2}$이고, 이를 $2a+b=0$에 대입하면 $b=-1$이므로 $f(x)=2e^{\\frac{x}{2}-1}$이다.\n$f(0)=\\frac{2}{e}$, $f(2)=2$이므로 역함수는 $g\\left(\\frac{2}{e}\\right)=0$, $g(2)=2$를 만족한다.\n구하는 영역은 $y$축, $x$축, 곡선 $f$, 곡선 $g$로 둘러싸이므로 넓이는 $S=\\int_0^2 f(x)\\,dx-\\int_{2/e}^{2} g(x)\\,dx$이다.\n$\\int_0^2 2e^{\\frac{x}{2}-1}\\,dx=\\left[4e^{\\frac{x}{2}-1}\\right]_0^2=4-\\frac{4}{e}$이다.\n$\\int_{2/e}^{2} g(x)\\,dx$는 $x=f(t)$로 치환하면(치환적분법) $\\int_0^2 t f'(t)\\,dt=\\left[tf(t)\\right]_0^2-\\int_0^2 f(t)\\,dt=4-\\left(4-\\frac{4}{e}\\right)=\\frac{4}{e}$이다.\n주의: 두 곡선이 $y=x$에 대칭이므로 정사각형 넓이 $4$에서 대칭 영역을 빼는 방식으로 계산해도 같은 결과가 나온다.\n따라서 $S=\\left(4-\\frac{4}{e}\\right)-\\frac{4}{e}=4-\\frac{8}{e}$이다.\n따라서 정답은 ②이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-102",
    "problemTypeKey": "PT_AREA_BY_DEFINITE_INTEGRAL",
    "templateKey": "TPL_INTERSECTION_SIGN_AREA",
    "crossConceptKeys": [
      "CC_TANGENT_LINE_SLOPE_AT_POINT",
      "CC_CURVE_POINT_COEFFICIENT_SYSTEM",
      "CC_EXPONENTIAL_FUNCTION_GRAPH"
    ],
    "conditionKeys": [],
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
    "content": "함수 $f(x) = a e^{\\frac{x}{3}}$ ($a>0$)과 그 역함수 $y=g(x)$가 $x=3$에서 서로 접할 때, 두 곡선 $y=f(x)$, $y=g(x)$와 $x$축 및 $y$축으로 둘러싸인 부분의 넓이는?",
    "choices": [
      "$9 - \\frac{24}{e}$",
      "$9 - \\frac{21}{e}$",
      "$9 - \\frac{18}{e}$",
      "$9 - \\frac{15}{e}$",
      "$9 - \\frac{12}{e}$"
    ],
    "answer": "③",
    "solution": "역함수의 성질에 의해 원래 함수와 역함수의 접점은 직선 $y=x$ 위에 있으므로 접점은 $(3,3)$이다.\n$f(3)=ae^{\\frac{3}{3}}=ae=3$이므로 $a=\\frac{3}{e}$이다.\n따라서 $f(x)=\\frac{3}{e}e^{\\frac{x}{3}}=3e^{\\frac{x-3}{3}}$이다.\n$f'(x)=e^{\\frac{x-3}{3}}$이므로 $f'(3)=1$이고, 역함수의 미분법에 의한 기울기 $\\frac{1}{f'(3)}=1$과 일치한다.\n$f(0)=\\frac{3}{e}$, $f(3)=3$이므로 $g\\left(\\frac{3}{e}\\right)=0$, $g(3)=3$이다.\n구하는 영역의 넓이는 $S=\\int_0^3 f(x)\\,dx-\\int_{3/e}^{3} g(x)\\,dx$이다.\n$\\int_0^3 3e^{\\frac{x-3}{3}}\\,dx=\\left[9e^{\\frac{x-3}{3}}\\right]_0^3=9-\\frac{9}{e}$이다.\n$\\int_{3/e}^{3} g(x)\\,dx$는 $x=f(t)$로 치환하면(치환적분법) $\\int_0^3 t f'(t)\\,dt=\\left[tf(t)\\right]_0^3-\\int_0^3 f(t)\\,dt=9-\\left(9-\\frac{9}{e}\\right)=\\frac{9}{e}$이다.\n주의: 전체 정사각형의 넓이 $3\\times3=9$에서 대칭인 두 영역의 넓이를 각각 빼도 된다.\n따라서 $S=\\left(9-\\frac{9}{e}\\right)-\\frac{9}{e}=9-\\frac{18}{e}$이다.\n따라서 정답은 ③이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-102",
    "problemTypeKey": "PT_AREA_BY_DEFINITE_INTEGRAL",
    "templateKey": "TPL_INTERSECTION_SIGN_AREA",
    "crossConceptKeys": [
      "CC_TANGENT_LINE_SLOPE_AT_POINT",
      "CC_CURVE_POINT_COEFFICIENT_SYSTEM",
      "CC_EXPONENTIAL_FUNCTION_GRAPH"
    ],
    "conditionKeys": [
      "COND_POSITIVE"
    ],
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
    "content": "함수 $f(x) = x + \\sin^2 x$의 역함수를 $g(x)$라 할 때, 두 곡선 $y=f(x)$와 $y=g(x)$로 둘러싸인 도형의 넓이는? (단, $0 \\le x \\le \\pi$)",
    "choices": [
      "$\\frac{\\pi}{2}$",
      "$\\pi$",
      "$\\frac{3\\pi}{2}$",
      "$2\\pi$",
      "$\\frac{5\\pi}{2}$"
    ],
    "answer": "②",
    "solution": "두 곡선의 교점은 직선 $y=x$ 위에 있으므로 $x+\\sin^2x=x$, 즉 $\\sin^2x=0$에서 구한다.\n$0\\le x\\le\\pi$에서 $\\sin^2x=0$의 해는 $x=0$ 또는 $x=\\pi$이다.\n$f'(x)=1+2\\sin x\\cos x=1+\\sin 2x\\ge 0$이므로(삼각함수의 미분법) $f$는 증가하고 역함수가 존재한다.\n열린구간 $(0,\\pi)$에서 $\\sin^2x>0$이므로 항상 $f(x)>x$이다.\n두 곡선은 직선 $y=x$에 대하여 대칭이므로 넓이는 $S=2\\int_0^\\pi (f(x)-x)\\,dx=2\\int_0^\\pi \\sin^2x\\,dx$이다.\n반각공식 $\\sin^2x=\\frac{1-\\cos 2x}{2}$를 대입하면 $S=2\\int_0^\\pi \\frac{1-\\cos 2x}{2}\\,dx=\\int_0^\\pi (1-\\cos 2x)\\,dx$이다.\n정적분을 계산하면 $\\left[x-\\frac{1}{2}\\sin 2x\\right]_0^\\pi=(\\pi-0)-(0-0)=\\pi$이다.\n따라서 정답은 ②이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-102",
    "problemTypeKey": "PT_AREA_BY_DEFINITE_INTEGRAL",
    "templateKey": "TPL_INTERSECTION_SIGN_AREA",
    "crossConceptKeys": [
      "CC_TRIGONOMETRIC_IDENTITY"
    ],
    "conditionKeys": [
      "COND_RESTRICTED_INTERVAL"
    ],
    "integrationPattern": "REINTERPRETATION"
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
    "content": "함수 $f(x) = \\frac{-4}{x-6} + 1$의 역함수를 $y=g(x)$라 하자. 두 함수 $y=f(x)$, $y=g(x)$의 그래프로 둘러싸인 도형의 넓이는?",
    "choices": [
      "$11 - 16\\ln 2$",
      "$12 - 16\\ln 2$",
      "$13 - 16\\ln 2$",
      "$14 - 16\\ln 2$",
      "$15 - 16\\ln 2$"
    ],
    "answer": "⑤",
    "solution": "역함수 그래프의 교점은 직선 $y=x$ 위에 있으므로 $\\frac{-4}{x-6}+1=x$를 푼다.\n양변을 정리하면 $\\frac{-4}{x-6}=x-1$이고, 분모를 곱하면 $-4=(x-1)(x-6)$이다.\n전개하여 정리하면 $x^2-7x+10=0$이고 인수분해하면 $(x-2)(x-5)=0$이므로 $x=2$ 또는 $x=5$이다.\n$f'(x)=\\frac{4}{(x-6)^2}>0$이므로 $f$는 구간 $[2,5]$에서 증가한다.\n$x=3$을 대입하면 $f(3)=\\frac{-4}{-3}+1=\\frac{7}{3}<3$이므로 $x-f(x)>0$이다.\n대칭성에 의해 구하는 넓이는 $S=2\\int_2^5 (x-f(x))\\,dx$이다.\n피적분함수를 정리하면 $x-f(x)=x-1+\\frac{4}{x-6}$이다.\n부정적분을 구하면 $\\int\\left(x-1+\\frac{4}{x-6}\\right)dx=\\frac{(x-1)^2}{2}+4\\ln|x-6|$이다.\n정적분을 계산하면 $\\left[\\frac{(x-1)^2}{2}+4\\ln|x-6|\\right]_2^5=(8+0)-\\left(\\frac{1}{2}+4\\ln4\\right)$이다.\n주의: $4\\ln4=4\\ln2^2=8\\ln2$로 고쳐야 한다.\n따라서 $\\int_2^5 (x-f(x))\\,dx=8-\\frac{1}{2}-8\\ln2=\\frac{15}{2}-8\\ln2$이고 $S=2\\left(\\frac{15}{2}-8\\ln2\\right)=15-16\\ln2$이다.\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-102",
    "problemTypeKey": "PT_AREA_BY_DEFINITE_INTEGRAL",
    "templateKey": "TPL_INTERSECTION_SIGN_AREA",
    "crossConceptKeys": [
      "CC_RATIONAL_FUNCTION"
    ],
    "conditionKeys": [],
    "integrationPattern": "REINTERPRETATION"
  },
  {
    "id": 5,
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
    "content": "실수 전체의 집합에서 증가하고 연속이며 역함수가 존재하는 함수 $f(x)$에 대하여 $f(2)=2, f(7)=7$일 때,\n$$\\lim_{n\\to\\infty} \\frac{2}{n} \\sum_{k=1}^n \\left\\{ f\\left(2 + \\frac{5k}{n}\\right) + f^{-1}\\left(2 + \\frac{5k}{n}\\right) \\right\\}$$\n의 값은? (단, $f^{-1}(x)$는 $f(x)$의 역함수이다.)",
    "choices": [
      "$18$",
      "$20$",
      "$22$",
      "$24$",
      "$26$"
    ],
    "answer": "①",
    "solution": "정적분과 급수의 관계를 쓰기 위해 $x_k=2+\\frac{5k}{n}$, $\\Delta x=\\frac{5}{n}$으로 둔다.\n$\\frac{2}{n}=\\frac{2}{5}\\cdot\\frac{5}{n}=\\frac{2}{5}\\Delta x$이므로 주어진 극한은 $\\frac{2}{5}\\int_2^7\\left\\{f(x)+f^{-1}(x)\\right\\}dx$이다.\n$f$가 증가하고 $f(2)=2$, $f(7)=7$이므로 역함수의 정적분 성질에 의해 $\\int_2^7 f(x)\\,dx+\\int_2^7 f^{-1}(x)\\,dx=7\\cdot f(7)-2\\cdot f(2)$이다.\n함숫값을 대입하면 $7\\cdot7-2\\cdot2=49-4=45$이다.\n주의: 급수의 계수 $\\frac{2}{n}$을 $\\Delta x$로 바꿀 때 앞에 $\\frac{2}{5}$가 남는다.\n따라서 극한값은 $\\frac{2}{5}\\cdot45=18$이다.\n따라서 정답은 ①이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-102",
    "problemTypeKey": "PT_AREA_BY_DEFINITE_INTEGRAL",
    "templateKey": "TPL_INTERSECTION_SIGN_AREA",
    "crossConceptKeys": [],
    "conditionKeys": [
      "COND_STRICT_MONOTONE_VALUES"
    ],
    "integrationPattern": "REINTERPRETATION"
  },
  {
    "id": 6,
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
    "content": "모든 실수에서 연속이고 역함수가 존재하는 함수 $y=f(x)$의 그래프는 제1사분면에 있는 두 점 $(1, a), (4, a+9)$를 지난다. 함수 $f(x)$의 역함수를 $g(x)$라 할 때,\n$$\\lim_{n\\to\\infty} \\frac{3}{n} \\sum_{k=1}^n f\\left(1 + \\frac{3k}{n}\\right) + \\lim_{n\\to\\infty} \\frac{9}{n} \\sum_{k=1}^n g\\left(a + \\frac{9k}{n}\\right) = 54$$\n를 만족시키는 상수 $a$의 값은?",
    "choices": [
      "$4$",
      "$5$",
      "$6$",
      "$7$",
      "$8$"
    ],
    "answer": "③",
    "solution": "첫 번째 극한은 $x_k=1+\\frac{3k}{n}$, $\\Delta x=\\frac{3}{n}$으로 두면 정적분과 급수의 관계에 의해 $\\int_1^4 f(x)\\,dx$이다.\n두 번째 극한은 $y_k=a+\\frac{9k}{n}$, $\\Delta y=\\frac{9}{n}$으로 두면 $\\int_a^{a+9} g(y)\\,dy$이다.\n$f(1)=a$, $f(4)=a+9$이므로 역함수의 정적분 성질에 의해 두 정적분의 합은 $4\\cdot f(4)-1\\cdot f(1)$이다.\n대입하면 $4(a+9)-a=3a+36$이다.\n조건에서 $3a+36=54$이므로 $3a=18$, 즉 $a=6$이다.\n점이 제1사분면에 있으므로 $a=6>0$을 만족한다.\n따라서 정답은 ③이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-102",
    "problemTypeKey": "PT_AREA_BY_DEFINITE_INTEGRAL",
    "templateKey": "TPL_INTERSECTION_SIGN_AREA",
    "crossConceptKeys": [],
    "conditionKeys": [],
    "integrationPattern": "REINTERPRETATION"
  }
];
