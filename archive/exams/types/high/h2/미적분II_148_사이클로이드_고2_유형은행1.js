window.examTitle = "미적분II_148_사이클로이드_고2_유형은행1";

window.questionBank = [
  {
    "id": 1,
    "category": "여러 가지 미분법",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-05",
    "standardUnit": "여러 가지 미분법",
    "standardUnitOrder": 5,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "여러 가지 미분법"
    ],
    "wide": false,
    "content": "매개변수 $t$로 나타낸 곡선 $x=4(t-\\sin t)$, $y=4(1-\\cos t)$에서 $t=\\frac{4\\pi}3$일 때, $\\frac{dy}{dx}$의 값은?",
    "choices": [
      "$-\\frac{\\sqrt3}{3}$",
      "$-\\frac12$",
      "$-\\frac{\\sqrt3}{4}$",
      "$0$",
      "$\\frac{\\sqrt3}{3}$"
    ],
    "answer": "①",
    "solution": "삼각함수의 미분법으로 $\\frac{dx}{dt}=4(1-\\cos t)$, $\\frac{dy}{dt}=4\\sin t$이다.\n매개변수 미분법으로 $\\frac{dy}{dx}=\\frac{4\\sin t}{4(1-\\cos t)}=\\frac{\\sin t}{1-\\cos t}$이다.\n$t=\\frac{4\\pi}{3}$은 제3사분면의 각이므로 $\\sin\\frac{4\\pi}{3}=-\\frac{\\sqrt3}{2}$, $\\cos\\frac{4\\pi}{3}=-\\frac12$이다.\n분모를 계산하면 $1-\\cos\\frac{4\\pi}{3}=1-(-\\frac12)=\\frac32$이다.\n대입하고 약분하면 $\\frac{dy}{dx}=\\frac{-\\sqrt3/2}{3/2}=-\\frac{\\sqrt3}{2}\\cdot\\frac{2}{3}=-\\frac{\\sqrt3}{3}$이다.\n따라서 정답은 ①이다.",
    "difficultyBucket": 1,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "B12",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-080",
    "problemTypeKey": "PT_DERIVATIVE_RULE_EVALUATION",
    "templateKey": "TPL_DERIVATIVE_RULE_CALCULATION",
    "crossConceptKeys": [
      "CC_DERIVATIVE_VALUE_EVALUATION",
      "CC_SPECIAL_ANGLES"
    ],
    "conditionKeys": [],
    "integrationPattern": "NONE"
  },
  {
    "id": 2,
    "category": "여러 가지 미분법",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-05",
    "standardUnit": "여러 가지 미분법",
    "standardUnitOrder": 5,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "여러 가지 미분법"
    ],
    "wide": false,
    "content": "$0<\\theta<\\pi$에서 $x=3(\\theta-\\sin\\theta)$, $y=3(1-\\cos\\theta)$로 나타낸 사이클로이드 위의 점 $P$에서 접선의 기울기가 $\\frac1{\\sqrt3}$일 때, $P$의 $y$좌표는?",
    "choices": [
      "$\\frac32$",
      "$\\frac94$",
      "$3$",
      "$\\frac{15}{4}$",
      "$\\frac92$"
    ],
    "answer": "⑤",
    "solution": "삼각함수의 미분법으로 $\\frac{dx}{d\\theta}=3(1-\\cos\\theta)$, $\\frac{dy}{d\\theta}=3\\sin\\theta$이다.\n매개변수 미분법으로 접선의 기울기는 $\\frac{dy}{dx}=\\frac{3\\sin\\theta}{3(1-\\cos\\theta)}=\\frac{\\sin\\theta}{1-\\cos\\theta}$이다.\n기울기 조건에서 $\\frac{\\sin\\theta}{1-\\cos\\theta}=\\frac1{\\sqrt3}$이다.\n배각공식과 반각공식으로 $\\sin\\theta=2\\sin\\frac\\theta2\\cos\\frac\\theta2$, $1-\\cos\\theta=2\\sin^2\\frac\\theta2$이다.\n대입하고 $2\\sin\\frac\\theta2\\ne0$을 약분하면 $\\frac{\\cos(\\theta/2)}{\\sin(\\theta/2)}=\\frac1{\\sqrt3}$, 즉 $\\tan\\frac\\theta2=\\sqrt3$이다.\n$0<\\frac\\theta2<\\frac\\pi2$에서 $\\frac\\theta2=\\frac\\pi3$이므로 $\\theta=\\frac{2\\pi}3$이다.\n$y=3(1-\\cos\\theta)$에 대입하면 $y=3(1-(-\\frac12))=\\frac92$이다.\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-080",
    "problemTypeKey": "PT_DERIVATIVE_RULE_EVALUATION",
    "templateKey": "TPL_DERIVATIVE_RULE_CALCULATION",
    "crossConceptKeys": [
      "CC_TRIGONOMETRIC_EQUATION",
      "CC_SPECIAL_ANGLES"
    ],
    "conditionKeys": [
      "COND_RANGE"
    ],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 3,
    "category": "여러 가지 미분법",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-05",
    "standardUnit": "여러 가지 미분법",
    "standardUnitOrder": 5,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "여러 가지 미분법"
    ],
    "wide": false,
    "content": "매개변수 $\\theta$로 나타낸 곡선 $x=2(\\theta-\\sin\\theta)$, $y=2(1-\\cos\\theta)$에서 $\\theta=\\frac\\pi2$에 대응하는 점을 $P$라 하자. $P$를 지나고 $P$에서의 접선과 수직인 직선이 두 좌표축과 둘러싸는 삼각형의 넓이는?",
    "choices": [
      "$\\frac{\\pi^2}{2}$",
      "$\\frac{3\\pi^2}{4}$",
      "$\\pi^2$",
      "$\\frac{5\\pi^2}{4}$",
      "$\\frac{3\\pi^2}{2}$"
    ],
    "answer": "①",
    "solution": "$\\theta=\\frac\\pi2$일 때 $\\sin\\frac\\pi2=1$, $\\cos\\frac\\pi2=0$이므로 $P=(2(\\frac\\pi2-1),2(1-0))=(\\pi-2,2)$이다.\n삼각함수의 미분법으로 $\\frac{dx}{d\\theta}=2(1-\\cos\\theta)$, $\\frac{dy}{d\\theta}=2\\sin\\theta$이다.\n매개변수 미분법으로 $\\theta=\\frac\\pi2$에서 접선의 기울기는 $\\frac{2\\cdot1}{2(1-0)}=1$이다.\n수직인 두 직선의 기울기의 곱이 $-1$이므로 구하는 직선의 기울기는 $-\\frac11=-1$이다.\n점 $P$와 기울기 $-1$로 직선의 방정식을 세우면 $y-2=-(x-(\\pi-2))$이다.\n우변을 정리하면 $y-2=-x+\\pi-2$, 즉 $y=-x+\\pi$이다.\n$x$절편은 $y=0$일 때 $x=\\pi$, $y$절편은 $x=0$일 때 $y=\\pi$이다.\n두 절편과 원점이 이루는 직각삼각형의 넓이는 $\\frac12\\cdot\\pi\\cdot\\pi=\\frac{\\pi^2}{2}$이다.\n따라서 정답은 ①이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-080",
    "problemTypeKey": "PT_DERIVATIVE_RULE_EVALUATION",
    "templateKey": "TPL_DERIVATIVE_RULE_CALCULATION",
    "crossConceptKeys": [
      "CC_AXIS_INTERCEPT",
      "CC_DERIVATIVE_VALUE_EVALUATION"
    ],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 4,
    "category": "여러 가지 미분법",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-05",
    "standardUnit": "여러 가지 미분법",
    "standardUnitOrder": 5,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "여러 가지 미분법"
    ],
    "wide": false,
    "content": "반지름이 $6$인 원이 $x$축 위를 오른쪽으로 구를 때, 처음에 원점에 있던 원 위의 점 $P$가 그리는 사이클로이드는 $x=6(\\theta-\\sin\\theta)$, $y=6(1-\\cos\\theta)$이다. $\\theta=\\frac{2\\pi}3$일 때, $P$에서의 접선의 $y$절편은?\n[그림: 좌표평면에 $0\\le\\theta\\le2\\pi$에서의 사이클로이드 한 마디를 그린다. 시작점은 $O=(0,0)$, 끝점은 $(12\\pi,0)$, 최고점은 $(6\\pi,12)$이다. 중심이 $(4\\pi,6)$이고 반지름이 $6$인 원을 함께 그리고, $\\theta=\\frac{2\\pi}3$에 대응하는 곡선 위의 점 $P$를 표시한다.]",
    "choices": [
      "$6-\\frac{4\\sqrt3\\pi}{3}$",
      "$8-\\frac{4\\sqrt3\\pi}{3}$",
      "$10-\\frac{4\\sqrt3\\pi}{3}$",
      "$12-\\frac{4\\sqrt3\\pi}{3}$",
      "$14-\\frac{4\\sqrt3\\pi}{3}$"
    ],
    "answer": "④",
    "solution": "특수각의 값으로 $\\sin\\frac{2\\pi}3=\\frac{\\sqrt3}{2}$, $\\cos\\frac{2\\pi}3=-\\frac12$이다.\n$x$좌표에 대입하면 $x_P=6(\\frac{2\\pi}3-\\frac{\\sqrt3}{2})=4\\pi-3\\sqrt3$이다.\n$y$좌표에 대입하면 $y_P=6(1-(-\\frac12))=6\\cdot\\frac32=9$이다.\n삼각함수의 미분법으로 $\\frac{dx}{d\\theta}=6(1-\\cos\\theta)$, $\\frac{dy}{d\\theta}=6\\sin\\theta$이다.\n매개변수 미분법으로 접선의 기울기는 $\\frac{6\\sin(2\\pi/3)}{6(1-\\cos(2\\pi/3))}=\\frac{\\sqrt3/2}{3/2}=\\frac{\\sqrt3}{3}$이다.\n점 $P$에서의 접선은 $y-9=\\frac{\\sqrt3}{3}(x-(4\\pi-3\\sqrt3))$이다.\n$y$절편은 $x=0$을 대입하여 $y=9+\\frac{\\sqrt3}{3}(-4\\pi+3\\sqrt3)$이다.\n전개하면 $y=9-\\frac{4\\sqrt3\\pi}{3}+3=12-\\frac{4\\sqrt3\\pi}{3}$이다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-080",
    "problemTypeKey": "PT_DERIVATIVE_RULE_EVALUATION",
    "templateKey": "TPL_DERIVATIVE_RULE_CALCULATION",
    "crossConceptKeys": [
      "CC_AXIS_INTERCEPT",
      "CC_SPECIAL_ANGLES"
    ],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
  }
];
