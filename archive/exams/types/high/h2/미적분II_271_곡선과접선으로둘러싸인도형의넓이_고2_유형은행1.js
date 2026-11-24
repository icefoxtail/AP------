window.examTitle = "미적분II_271_곡선과접선으로둘러싸인도형의넓이_고2_유형은행1";

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
    "content": "곡선 $y=2\\sqrt{x-5}$와 이 곡선 위의 점 $(14, 6)$에서의 접선 및 $x$축으로 둘러싸인 영역의 넓이는?",
    "choices": [
      "9",
      "12",
      "15",
      "18",
      "21"
    ],
    "answer": "④",
    "solution": "접점의 $x$좌표가 $14$이므로 도함수로 접선의 기울기를 구한다: $y'=\\frac{1}{\\sqrt{x-5}}$, $m=\\frac{1}{\\sqrt{14-5}}=\\frac13$.\n접선의 방정식을 세운다: $y-6=\\frac13(x-14)$에서 $y=\\frac13x+\\frac43$.\n접선의 $x$절편을 구한다: $0=\\frac13x+\\frac43$에서 $x=-4$.\n곡선과 $x$축의 교점은 $2\\sqrt{x-5}=0$에서 $x=5$임을 확인한다.\n접선, $x$축, $x=14$로 둘러싸인 삼각형의 넓이는 $\\frac12\\cdot(14-(-4))\\cdot6=54$.\n곡선 아래 넓이는 정적분으로 $\\int_5^{14}2\\sqrt{x-5}\\,dx=\\left[\\frac43(x-5)^{3/2}\\right]_5^{14}=\\frac43\\cdot27=36$.\n따라서 구하는 넓이는 $54-36=18$.\n주의: 곡선은 $x=5$에서 시작하므로 $x=-4$부터 $5$까지는 접선과 $x$축 사이의 넓이만 더해진다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-102",
    "problemTypeKey": "PT_AREA_BY_DEFINITE_INTEGRAL",
    "templateKey": "TPL_INTERSECTION_SIGN_AREA",
    "crossConceptKeys": [
      "CC_RADICAL_FUNCTION",
      "CC_TANGENT_LINE_SLOPE_AT_POINT"
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
    "content": "원점에서 곡선 $y=2\\sqrt{x-3}$에 그은 접선을 $l$이라 할 때, 곡선 $y=2\\sqrt{x-3}$과 접선 $l$ 및 $x$축으로 둘러싸인 도형의 넓이는?",
    "choices": [
      "$\\frac{\\sqrt{3}}{3}$",
      "$\\frac{2\\sqrt{3}}{3}$",
      "$\\sqrt{3}$",
      "$\\frac{4\\sqrt{3}}{3}$",
      "$2\\sqrt{3}$"
    ],
    "answer": "⑤",
    "solution": "접점을 $(t,2\\sqrt{t-3})$ $(t>3)$로 두고 도함수로 접선의 기울기를 구한다: $y'=\\frac{1}{\\sqrt{x-3}}$.\n원점에서 그은 접선이므로 원점과 접점을 잇는 평균변화율이 접선의 기울기와 같다: $\\frac{2\\sqrt{t-3}}{t}=\\frac{1}{\\sqrt{t-3}}$.\n분모를 곱해 정리한다: $2(t-3)=t$에서 $t=6$.\n접점은 $(6,2\\sqrt3)$이고 기울기는 $\\frac{1}{\\sqrt3}=\\frac{\\sqrt3}{3}$이므로 접선은 $y=\\frac{\\sqrt3}{3}x$.\n접선, $x$축, $x=6$으로 둘러싸인 삼각형의 넓이는 $\\frac12\\cdot6\\cdot2\\sqrt3=6\\sqrt3$.\n곡선 아래 넓이는 $\\int_3^6 2\\sqrt{x-3}\\,dx=\\left[\\frac43(x-3)^{3/2}\\right]_3^6=\\frac43\\cdot3\\sqrt3=4\\sqrt3$.\n따라서 구하는 넓이는 $6\\sqrt3-4\\sqrt3=2\\sqrt3$.\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-102",
    "problemTypeKey": "PT_AREA_BY_DEFINITE_INTEGRAL",
    "templateKey": "TPL_INTERSECTION_SIGN_AREA",
    "crossConceptKeys": [
      "CC_RADICAL_FUNCTION",
      "CC_TANGENT_LINE_SLOPE_AT_POINT"
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
    "content": "곡선 $y=e^{2x}$과 이 곡선 위의 점 $(1, e^2)$에서의 접선 및 $y$축으로 둘러싸인 도형의 넓이는?",
    "choices": [
      "$\\frac{e^2-2}{2}$",
      "$\\frac{e^2-1}{2}$",
      "$\\frac{e^2}{2}$",
      "$\\frac{e^2+1}{2}$",
      "$\\frac{e^2+2}{2}$"
    ],
    "answer": "②",
    "solution": "도함수로 접선의 기울기를 구한다: $y'=2e^{2x}$이므로 $m=2e^{2}$.\n접선의 방정식은 $y-e^2=2e^2(x-1)$에서 $y=2e^2x-e^2$.\n곡선과 접선은 $x=1$에서 만나고, $y$축 $x=0$이 경계이므로 $0\\le x\\le1$에서 적분한다.\n부정적분을 구한다: $\\int(e^{2x}-2e^2x+e^2)\\,dx=\\frac12e^{2x}-e^2x^2+e^2x+C$.\n정적분한다: $S=\\left[\\frac12e^{2x}-e^2x^2+e^2x\\right]_0^1$.\n위끝 대입값은 $\\frac12e^2-e^2+e^2=\\frac12e^2$이고 아래끝 대입값은 $\\frac12$.\n따라서 $S=\\frac12e^2-\\frac12=\\frac{e^2-1}{2}$.\n따라서 정답은 ②이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-102",
    "problemTypeKey": "PT_AREA_BY_DEFINITE_INTEGRAL",
    "templateKey": "TPL_INTERSECTION_SIGN_AREA",
    "crossConceptKeys": [
      "CC_EXPONENTIAL_FUNCTION_GRAPH",
      "CC_TANGENT_LINE_SLOPE_AT_POINT"
    ],
    "conditionKeys": [],
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
    "content": "곡선 $y=\\ln x$와 이 곡선 위의 점 $(e^2, 2)$에서의 접선 및 $x$축으로 둘러싸인 넓이는?",
    "choices": [
      "$e^2 - 4$",
      "$e^2 - 3$",
      "$e^2 - 2$",
      "$e^2 - 1$",
      "$e^2$"
    ],
    "answer": "④",
    "solution": "도함수로 접선의 기울기를 구한다: $y'=\\frac1x$이므로 $m=\\frac{1}{e^2}$.\n접선은 $y-2=\\frac{1}{e^2}(x-e^2)$에서 $y=\\frac{1}{e^2}x+1$.\n접선의 $x$절편은 $0=\\frac{1}{e^2}x+1$에서 $x=-e^2$.\n접선, $x$축, $x=e^2$로 둘러싸인 삼각형의 넓이는 $\\frac12\\cdot(2e^2)\\cdot2=2e^2$.\n곡선 $y=\\ln x$는 $x=1$에서 $x$축과 만나므로 곡선 아래 넓이는 $\\int_1^{e^2}\\ln x\\,dx$.\n부분적분법으로 $\\int_1^{e^2}\\ln x\\,dx=[x\\ln x-x]_1^{e^2}=(2e^2-e^2)-(-1)=e^2+1$.\n따라서 구하는 넓이는 $2e^2-(e^2+1)=e^2-1$.\n주의: 적분 구간의 아래끝은 접선의 $x$절편 $-e^2$가 아니라 곡선의 $x$절편 $1$이다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-102",
    "problemTypeKey": "PT_AREA_BY_DEFINITE_INTEGRAL",
    "templateKey": "TPL_INTERSECTION_SIGN_AREA",
    "crossConceptKeys": [
      "CC_LOGARITHMIC_FUNCTION_GRAPH",
      "CC_TANGENT_LINE_SLOPE_AT_POINT"
    ],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
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
    "content": "곡선 $y=\\ln(x+1)$과 이 곡선 위의 점 $(e-1, 1)$에서의 접선 및 $x$축으로 둘러싸인 부분의 넓이는?",
    "choices": [
      "$\\frac{e-2}{4}$",
      "$\\frac{e-2}{3}$",
      "$\\frac{e-2}{2}$",
      "$e-2$",
      "$\\frac{3(e-2)}{2}$"
    ],
    "answer": "③",
    "solution": "도함수로 접선의 기울기를 구한다: $y'=\\frac{1}{x+1}$이므로 $m=\\frac1e$.\n접선은 $y-1=\\frac1e(x-(e-1))$에서 $y=\\frac1ex+\\frac1e$.\n접선의 $x$절편은 $0=\\frac1ex+\\frac1e$에서 $x=-1$.\n곡선의 $x$절편은 $\\ln(x+1)=0$에서 $x=0$.\n접선, $x$축, $x=e-1$로 둘러싸인 삼각형의 넓이는 $\\frac12\\cdot e\\cdot1=\\frac e2$.\n곡선 아래 넓이는 $\\int_0^{e-1}\\ln(x+1)\\,dx=[(x+1)\\ln(x+1)-(x+1)]_0^{e-1}$.\n이를 계산하면 $(e-e)-(0-1)=1$이다.\n따라서 구하는 넓이는 $\\frac e2-1=\\frac{e-2}{2}$.\n따라서 정답은 ③이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-102",
    "problemTypeKey": "PT_AREA_BY_DEFINITE_INTEGRAL",
    "templateKey": "TPL_INTERSECTION_SIGN_AREA",
    "crossConceptKeys": [
      "CC_LOGARITHMIC_FUNCTION_GRAPH",
      "CC_TANGENT_LINE_SLOPE_AT_POINT"
    ],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
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
    "content": "구간 $[0, \\pi]$에서 정의된 함수 $f(x)=2x\\sin x$가 있다. $0 < x < \\pi$에서 함수 $y=f(x)$의 그래프 위의 점 $\\mathrm{P}$에서의 접선 $l$이 원점을 지날 때, 접선 $l$과 함수 $y=f(x)$의 그래프로 둘러싸인 부분의 넓이를 $S$라 하자. $\\pi^2 - 4S$의 값은? [그림: 좌표평면에 구간 $[0, \\pi]$에서 위로 볼록한 곡선 $y=2x\\sin x$가 원점 $\\mathrm{O}(0,0)$과 점 $(\\pi, 0)$을 지나고, 제1사분면 위의 점 $\\mathrm{P}(\\frac{\\pi}{2}, \\pi)$에서의 접선 $l: y=2x$가 원점과 점 $\\mathrm{P}$를 지나며, 접선 $l$과 곡선 $y=2x\\sin x$로 둘러싸인 영역에 빗금이 칠해져 있다.]",
    "choices": [
      "4",
      "6",
      "8",
      "10",
      "12"
    ],
    "answer": "③",
    "solution": "접점을 $(t,2t\\sin t)$ $(0<t<\\pi)$로 두고 곱의 미분법으로 도함수를 구한다: $f'(x)=2\\sin x+2x\\cos x$.\n접선이 원점을 지나므로 원점과 접점을 잇는 평균변화율이 접선의 기울기와 같다: $\\frac{2t\\sin t}{t}=2\\sin t=f'(t)$.\n식을 정리하면 $2\\sin t=2\\sin t+2t\\cos t$에서 $2t\\cos t=0$.\n$t\\ne0$이므로 $\\cos t=0$이고 $0<t<\\pi$에서 $t=\\frac{\\pi}{2}$.\n접점은 $(\\frac{\\pi}{2},\\pi)$이고 기울기는 $f'(\\frac{\\pi}{2})=2$이므로 접선은 $y=2x$.\n$0\\le x\\le\\frac{\\pi}{2}$에서 $2x\\ge2x\\sin x$이므로 넓이는 $S=\\int_0^{\\pi/2}(2x-2x\\sin x)\\,dx$.\n첫 항은 $\\int_0^{\\pi/2}2x\\,dx=\\left[x^2\\right]_0^{\\pi/2}=\\frac{\\pi^2}{4}$.\n부분적분법으로 $\\int_0^{\\pi/2}2x\\sin x\\,dx=2[-x\\cos x+\\sin x]_0^{\\pi/2}=2$.\n따라서 $S=\\frac{\\pi^2}{4}-2=\\frac{\\pi^2-8}{4}$.\n구하는 값은 $\\pi^2-4S=\\pi^2-(\\pi^2-8)=8$.\n따라서 정답은 ③이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B45",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-102",
    "problemTypeKey": "PT_AREA_BY_DEFINITE_INTEGRAL",
    "templateKey": "TPL_INTERSECTION_SIGN_AREA",
    "crossConceptKeys": [
      "CC_TANGENT_LINE_SLOPE_AT_POINT",
      "CC_TRIGONOMETRIC_EQUATION",
      "CC_INTEGRATION_BY_PARTS_OR_EXPANSION"
    ],
    "conditionKeys": [
      "COND_RESTRICTED_INTERVAL"
    ],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 7,
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
    "content": "양의 실수 $k$에 대하여 곡선 $y=k\\ln x$와 직선 $y=2x$가 접할 때, 곡선 $y=k\\ln x$, 직선 $y=2x$ 및 $x$축으로 둘러싸인 부분의 넓이는 $ae^2-be$이다. $30ab$의 값은? (단, $a$와 $b$는 유리수이다.)",
    "choices": [
      "30",
      "40",
      "50",
      "60",
      "70"
    ],
    "answer": "④",
    "solution": "접점의 $x$좌표를 $t$ $(t>0)$로 두면 함숫값이 같다: $k\\ln t=2t$.\n도함수 $y'=\\frac kx$에서 접선의 기울기가 $2$이므로 $\\frac kt=2$, 즉 $k=2t$.\n$k=2t$를 함숫값 조건에 대입한다: $2t\\ln t=2t$에서 $\\ln t=1$, $t=e$.\n따라서 $k=2e$이고 접점은 $(e,2e)$이다.\n직선 $y=2x$, $x$축, $x=e$로 둘러싸인 삼각형의 넓이는 $\\frac12\\cdot e\\cdot2e=e^2$.\n곡선 $y=2e\\ln x$는 $x=1$에서 $x$축과 만나므로 곡선 아래 넓이는 $\\int_1^e2e\\ln x\\,dx$.\n부분적분법으로 $\\int_1^e2e\\ln x\\,dx=2e[x\\ln x-x]_1^e=2e[(e-e)-(0-1)]=2e$.\n따라서 구하는 넓이는 $e^2-2e$이고 $a=1$, $b=2$이다.\n주의: 곡선과 직선의 교점의 $x$좌표 $e$와 곡선의 $x$절편 $1$을 구분한다.\n$30ab=30\\cdot1\\cdot2=60$.\n따라서 정답은 ④이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B45",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-102",
    "problemTypeKey": "PT_AREA_BY_DEFINITE_INTEGRAL",
    "templateKey": "TPL_INTERSECTION_SIGN_AREA",
    "crossConceptKeys": [
      "CC_LOGARITHMIC_FUNCTION_GRAPH",
      "CC_TANGENT_LINE_SLOPE_AT_POINT",
      "CC_CURVE_POINT_COEFFICIENT_SYSTEM"
    ],
    "conditionKeys": [
      "COND_POSITIVE",
      "COND_RATIONAL"
    ],
    "integrationPattern": "SEQUENTIAL"
  }
];
