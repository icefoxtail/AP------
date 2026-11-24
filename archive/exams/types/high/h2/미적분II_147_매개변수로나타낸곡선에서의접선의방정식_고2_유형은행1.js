window.examTitle = "미적분II_147_매개변수로나타낸곡선에서의접선의방정식_고2_유형은행1";

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
    "content": "매개변수 $t$로 나타낸 곡선 $x=t^2-2t+3$, $y=3t-1$에서 $t=2$에 대응하는 점의 접선이 $(7,a)$를 지날 때, $a$의 값은?",
    "choices": [
      "$9$",
      "$11$",
      "$13$",
      "$15$",
      "$17$"
    ],
    "answer": "②",
    "solution": "$t=2$를 $x$, $y$의 식에 대입하면 접점은 $(2^2-2\\cdot2+3,\\ 3\\cdot2-1)=(3,5)$이다.\n거듭제곱의 미분법으로 $\\frac{dx}{dt}=2t-2$, $\\frac{dy}{dt}=3$이다.\n매개변수 미분법 $\\frac{dy}{dx}=\\frac{dy/dt}{dx/dt}$를 쓰면 $t=2$에서 기울기는 $\\frac{3}{2\\cdot2-2}=\\frac32$이다.\n점 $(3,5)$와 기울기 $\\frac32$로 접선의 방정식은 $y-5=\\frac32(x-3)$이다.\n$x=7$을 대입하면 $a-5=\\frac32\\cdot4=6$이므로 $a=11$이다.\n따라서 정답은 ②이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "B12",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-080",
    "problemTypeKey": "PT_DERIVATIVE_RULE_EVALUATION",
    "templateKey": "TPL_DERIVATIVE_RULE_CALCULATION",
    "crossConceptKeys": [
      "CC_POLYNOMIAL_DERIVATIVE_RULE",
      "CC_POINT_ON_CURVE_SUBSTITUTION"
    ],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
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
    "content": "$t>0$에서 $x=t$, $y=2\\sqrt t+3$으로 나타낸 곡선에 접하는 직선의 기울기가 $\\frac13$이다. 이 직선의 $x$절편은?",
    "choices": [
      "$-21$",
      "$-18$",
      "$-15$",
      "$-12$",
      "$-9$"
    ],
    "answer": "②",
    "solution": "거듭제곱의 미분법으로 $\\frac{dx}{dt}=1$, $\\frac{dy}{dt}=2\\cdot\\frac12t^{-1/2}=\\frac1{\\sqrt t}$이다.\n매개변수 미분법으로 기울기는 $\\frac{dy}{dx}=\\frac{1/\\sqrt t}{1}=\\frac1{\\sqrt t}$이다.\n기울기 조건 $\\frac1{\\sqrt t}=\\frac13$에서 역수를 취하면 $\\sqrt t=3$, 즉 $t=9$이다.\n$t=9$를 대입하면 접점은 $(9,\\ 2\\sqrt9+3)=(9,9)$이다.\n점 $(9,9)$와 기울기 $\\frac13$으로 접선은 $y-9=\\frac13(x-9)$이다.\n$y=0$을 대입하면 $-9=\\frac13(x-9)$에서 $x-9=-27$, 즉 $x=-18$이다.\n따라서 정답은 ②이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-080",
    "problemTypeKey": "PT_DERIVATIVE_RULE_EVALUATION",
    "templateKey": "TPL_DERIVATIVE_RULE_CALCULATION",
    "crossConceptKeys": [
      "CC_AXIS_INTERCEPT",
      "CC_RADICAL_FUNCTION"
    ],
    "conditionKeys": [
      "COND_POSITIVE"
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
    "content": "매개변수 $\\theta$로 나타낸 곡선 $x=2+\\sin\\theta$, $y=\\theta+2\\cos\\theta$에서 $\\theta=2\\pi$에 대응하는 점의 접선과 두 좌표축으로 둘러싸인 삼각형의 넓이는?",
    "choices": [
      "$\\frac{\\pi^2}{2}$",
      "$\\pi^2$",
      "$\\frac{5\\pi^2}{4}$",
      "$\\frac{3\\pi^2}{2}$",
      "$2\\pi^2$"
    ],
    "answer": "⑤",
    "solution": "$\\sin2\\pi=0$, $\\cos2\\pi=1$을 대입하면 접점은 $(2+0,\\ 2\\pi+2\\cdot1)=(2,2\\pi+2)$이다.\n삼각함수의 미분법으로 $\\frac{dx}{d\\theta}=\\cos\\theta$, $\\frac{dy}{d\\theta}=1-2\\sin\\theta$이다.\n$\\theta=2\\pi$에서 $\\frac{dx}{d\\theta}=1$, $\\frac{dy}{d\\theta}=1-2\\cdot0=1$이다.\n매개변수 미분법으로 기울기는 $m=\\frac{1}{1}=1$이다.\n점 $(2,2\\pi+2)$와 기울기 $1$로 접선은 $y-(2\\pi+2)=x-2$, 즉 $y=x+2\\pi$이다.\n$y=0$을 대입하면 $x=-2\\pi$이고, $x=0$을 대입하면 $y=2\\pi$이다.\n주의: 삼각형의 두 변의 길이는 절댓값 $|-2\\pi|=2\\pi$, $|2\\pi|=2\\pi$로 잡는다.\n삼각형의 넓이는 $\\frac12\\cdot2\\pi\\cdot2\\pi=2\\pi^2$이다.\n따라서 정답은 ⑤이다.",
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
    "content": "매개변수 $t$로 나타낸 곡선 $x=\\frac{2(1-t^2)}{1+t^2}$, $y=\\frac{4t}{1+t^2}$에서 $t=\\frac12$에 대응하는 점의 접선이 $x$축, $y$축과 만나는 점을 각각 $A$, $B$라 하자. 원점 $O$에 대하여 삼각형 $OAB$의 넓이는?",
    "choices": [
      "$\\frac{25}{8}$",
      "$\\frac{25}{6}$",
      "$\\frac{25}{4}$",
      "$\\frac{25}{3}$",
      "$\\frac{25}{2}$"
    ],
    "answer": "②",
    "solution": "$t=\\frac12$에서 $t^2=\\frac14$이므로 접점은 $\\left(\\frac{2(1-1/4)}{1+1/4},\\ \\frac{4\\cdot1/2}{1+1/4}\\right)=\\left(\\frac65,\\frac85\\right)$이다.\n몫의 미분법으로 $\\frac{dx}{dt}=\\frac{-4t(1+t^2)-2(1-t^2)\\cdot2t}{(1+t^2)^2}=\\frac{-8t}{(1+t^2)^2}$이다.\n몫의 미분법으로 $\\frac{dy}{dt}=\\frac{4(1+t^2)-4t\\cdot2t}{(1+t^2)^2}=\\frac{4(1-t^2)}{(1+t^2)^2}$이다.\n매개변수 미분법에서 공통인 $(1+t^2)^2$을 약분하면 $\\frac{dy}{dx}=\\frac{4(1-t^2)}{-8t}=-\\frac{1-t^2}{2t}$이다.\n$t=\\frac12$을 대입하면 기울기는 $m=-\\frac{1-1/4}{1}=-\\frac34$이다.\n접선은 $y-\\frac85=-\\frac34\\left(x-\\frac65\\right)$이다.\n우변을 전개하면 $y=-\\frac34x+\\frac34\\cdot\\frac65+\\frac85=-\\frac34x+\\frac9{10}+\\frac{16}{10}=-\\frac34x+\\frac52$이다.\n$y=0$을 대입하면 $\\frac34x=\\frac52$에서 $x=\\frac{10}{3}$이므로 $A=\\left(\\frac{10}{3},0\\right)$이다.\n$x=0$을 대입하면 $B=\\left(0,\\frac52\\right)$이다.\n삼각형 $OAB$의 넓이는 $\\frac12\\cdot\\frac{10}{3}\\cdot\\frac52=\\frac{50}{12}=\\frac{25}{6}$이다.\n따라서 정답은 ②이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-080",
    "problemTypeKey": "PT_DERIVATIVE_RULE_EVALUATION",
    "templateKey": "TPL_DERIVATIVE_RULE_CALCULATION",
    "crossConceptKeys": [
      "CC_AXIS_INTERCEPT",
      "CC_RATIONAL_FUNCTION"
    ],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 5,
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
    "content": "$t>-1$에서 $x=\\ln(t+1)+3$, $y=\\frac13t^3-\\frac12t^2+2t+2$로 나타낸 곡선 위의 점 $(3,2)$에서의 접선이 $x$축, $y$축과 만나는 점을 각각 $A$, $B$라 하자. 원점 $O$에 대하여 $\\overline{OA}+\\overline{OB}$의 값은?",
    "choices": [
      "$6$",
      "$7$",
      "$8$",
      "$9$",
      "$10$"
    ],
    "answer": "①",
    "solution": "$x=3$을 대입하면 $\\ln(t+1)+3=3$에서 $\\ln(t+1)=0$이다.\n로그의 정의로 $t+1=e^0=1$이므로 $t=0$이고, 이때 $y=0-0+0+2=2$이다.\n로그함수의 미분법으로 $\\frac{dx}{dt}=\\frac1{t+1}$이고 $t=0$에서 $\\frac{dx}{dt}=1$이다.\n거듭제곱의 미분법으로 $\\frac{dy}{dt}=t^2-t+2$이고 $t=0$에서 $\\frac{dy}{dt}=2$이다.\n매개변수 미분법으로 기울기는 $m=\\frac21=2$이다.\n점 $(3,2)$와 기울기 $2$로 접선은 $y-2=2(x-3)$, 즉 $y=2x-4$이다.\n$y=0$을 대입하면 $x=2$이고, $x=0$을 대입하면 $y=-4$이므로 $A=(2,0)$, $B=(0,-4)$이다.\n주의: $\\overline{OA}$, $\\overline{OB}$는 길이이므로 $\\overline{OA}+\\overline{OB}=|2|+|-4|=6$이다.\n따라서 정답은 ①이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-080",
    "problemTypeKey": "PT_DERIVATIVE_RULE_EVALUATION",
    "templateKey": "TPL_DERIVATIVE_RULE_CALCULATION",
    "crossConceptKeys": [
      "CC_AXIS_INTERCEPT",
      "CC_POLYNOMIAL_DERIVATIVE_RULE"
    ],
    "conditionKeys": [
      "COND_RANGE"
    ],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 6,
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
    "content": "$t>0$에서 $x=e^t-t$, $y=e^t-\\ln t+2$로 나타낸 곡선에 대하여 $t=1$에 대응하는 점의 접선이 $\\left(\\frac e2,a\\right)$를 지날 때, $a$의 값은?",
    "choices": [
      "$\\frac e2+3$",
      "$\\frac e2+4$",
      "$\\frac e2+5$",
      "$\\frac e2+6$",
      "$\\frac e2+7$"
    ],
    "answer": "①",
    "solution": "$t=1$을 대입하면 접점은 $(e-1,\\ e-\\ln1+2)=(e-1,e+2)$이다.\n지수함수의 미분법으로 $\\frac{dx}{dt}=e^t-1$이고 $t=1$에서 $\\frac{dx}{dt}=e-1$이다.\n지수함수·로그함수의 미분법으로 $\\frac{dy}{dt}=e^t-\\frac1t$이고 $t=1$에서 $\\frac{dy}{dt}=e-1$이다.\n매개변수 미분법으로 기울기는 $m=\\frac{e-1}{e-1}=1$이다.\n점 $(e-1,e+2)$와 기울기 $1$로 접선은 $y-(e+2)=x-(e-1)$이다.\n우변을 정리하면 $y=x-(e-1)+(e+2)=x+3$이다.\n$x=\\frac e2$를 대입하면 $a=\\frac e2+3$이다.\n따라서 정답은 ①이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-080",
    "problemTypeKey": "PT_DERIVATIVE_RULE_EVALUATION",
    "templateKey": "TPL_DERIVATIVE_RULE_CALCULATION",
    "crossConceptKeys": [
      "CC_POINT_ON_CURVE_SUBSTITUTION",
      "CC_DERIVATIVE_VALUE_EVALUATION"
    ],
    "conditionKeys": [
      "COND_POSITIVE"
    ],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 7,
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
    "content": "$0<t<\\pi$에서 $x=3\\cos t$, $y=4\\sin t$로 나타낸 곡선의 $t=\\frac\\pi4$에 대응하는 점에서의 접선이 두 좌표축과 각각 $A$, $B$에서 만난다. 원점 $O$에 대하여 삼각형 $OAB$의 넓이는?",
    "choices": [
      "$6$",
      "$8$",
      "$10$",
      "$12$",
      "$16$"
    ],
    "answer": "④",
    "solution": "$t=\\frac\\pi4$에서 $\\cos\\frac\\pi4=\\sin\\frac\\pi4=\\frac{\\sqrt2}{2}$이므로 접점은 $\\left(3\\cdot\\frac{\\sqrt2}{2},\\ 4\\cdot\\frac{\\sqrt2}{2}\\right)=\\left(\\frac{3\\sqrt2}{2},2\\sqrt2\\right)$이다.\n삼각함수의 미분법으로 $\\frac{dx}{dt}=-3\\sin t$, $\\frac{dy}{dt}=4\\cos t$이다.\n$t=\\frac\\pi4$에서 $\\frac{dx}{dt}=-\\frac{3\\sqrt2}{2}$, $\\frac{dy}{dt}=2\\sqrt2$이다.\n매개변수 미분법으로 기울기는 $m=\\frac{2\\sqrt2}{-3\\sqrt2/2}=-\\frac43$이다.\n접선은 $y-2\\sqrt2=-\\frac43\\left(x-\\frac{3\\sqrt2}{2}\\right)$이다.\n전개하면 $y=-\\frac43x+\\frac43\\cdot\\frac{3\\sqrt2}{2}+2\\sqrt2=-\\frac43x+2\\sqrt2+2\\sqrt2=-\\frac43x+4\\sqrt2$이다.\n$y=0$을 대입하면 $\\frac43x=4\\sqrt2$에서 $x=3\\sqrt2$이므로 $A=(3\\sqrt2,0)$이다.\n$x=0$을 대입하면 $B=(0,4\\sqrt2)$이다.\n삼각형 $OAB$의 넓이는 $\\frac12\\cdot3\\sqrt2\\cdot4\\sqrt2=\\frac12\\cdot24=12$이다.\n따라서 정답은 ④이다.",
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
    "conditionKeys": [
      "COND_RANGE"
    ],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 8,
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
    "content": "$0<\\theta<\\frac\\pi2$에서 $x=3-2\\sin\\theta$, $y=2+\\cos\\theta$로 나타낸 곡선이 있다. $\\theta=\\alpha$에 대응하는 점에서의 접선이 직선 $y=-4x+5$와 수직일 때, $\\csc^2\\alpha$의 값은?",
    "choices": [
      "$1$",
      "$2$",
      "$3$",
      "$4$",
      "$5$"
    ],
    "answer": "⑤",
    "solution": "두 직선이 수직이면 기울기의 곱이 $-1$이므로 $(-4)m=-1$, 즉 $m=\\frac14$이다.\n삼각함수의 미분법으로 $\\frac{dx}{d\\theta}=-2\\cos\\theta$, $\\frac{dy}{d\\theta}=-\\sin\\theta$이다.\n매개변수 미분법으로 $\\frac{dy}{dx}=\\frac{-\\sin\\theta}{-2\\cos\\theta}=\\frac12\\tan\\theta$이다.\n$\\theta=\\alpha$에서 기울기 조건은 $\\frac12\\tan\\alpha=\\frac14$이므로 $\\tan\\alpha=\\frac12$이다.\n탄젠트와 코탄젠트의 관계로 $\\cot\\alpha=\\frac1{\\tan\\alpha}=2$이다.\n삼각함수의 기본 항등식 $\\csc^2\\alpha=1+\\cot^2\\alpha$에 대입하면 $\\csc^2\\alpha=1+2^2=5$이다.\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-080",
    "problemTypeKey": "PT_DERIVATIVE_RULE_EVALUATION",
    "templateKey": "TPL_DERIVATIVE_RULE_CALCULATION",
    "crossConceptKeys": [
      "CC_TRIGONOMETRIC_IDENTITY"
    ],
    "conditionKeys": [
      "COND_RANGE"
    ],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 9,
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
    "content": "매개변수 $t$로 나타낸 곡선 $x=e^t+e^{-t}$, $y=e^t-e^{-t}$에서 $t=\\ln3$에 대응하는 점의 접선의 방정식은?",
    "choices": [
      "$4x-5y-6=0$",
      "$4x-5y+6=0$",
      "$5x-4y-4=0$",
      "$5x-4y+6=0$",
      "$5x-4y-6=0$"
    ],
    "answer": "⑤",
    "solution": "$t=\\ln3$에서 $e^t=3$, $e^{-t}=e^{-\\ln3}=\\frac13$이다.\n접점은 $\\left(3+\\frac13,\\ 3-\\frac13\\right)=\\left(\\frac{10}{3},\\frac83\\right)$이다.\n지수함수와 합성함수의 미분법으로 $\\frac{dx}{dt}=e^t-e^{-t}$이다.\n같은 법으로 $\\frac{dy}{dt}=e^t+e^{-t}$이다.\n$t=\\ln3$에서 $\\frac{dx}{dt}=3-\\frac13=\\frac83$, $\\frac{dy}{dt}=3+\\frac13=\\frac{10}{3}$이다.\n매개변수 미분법으로 기울기는 $m=\\frac{10/3}{8/3}=\\frac54$이다.\n접선은 $y-\\frac83=\\frac54\\left(x-\\frac{10}{3}\\right)$이다.\n양변에 $4$를 곱하면 $4y-\\frac{32}{3}=5x-\\frac{50}{3}$이다.\n$\\frac{50}{3}-\\frac{32}{3}=\\frac{18}{3}=6$이므로 $5x-4y-6=0$이다.\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "B12",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-080",
    "problemTypeKey": "PT_DERIVATIVE_RULE_EVALUATION",
    "templateKey": "TPL_DERIVATIVE_RULE_CALCULATION",
    "crossConceptKeys": [
      "CC_DERIVATIVE_VALUE_EVALUATION"
    ],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
  }
];
