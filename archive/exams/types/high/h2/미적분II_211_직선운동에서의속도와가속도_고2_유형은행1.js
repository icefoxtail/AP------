window.examTitle = "미적분II_211_직선운동에서의속도와가속도_고2_유형은행1";

window.questionBank = [
  {
    "id": 1,
    "category": "도함수의 활용",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-06",
    "standardUnit": "도함수의 활용",
    "standardUnitOrder": 6,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "도함수의 활용"
    ],
    "wide": false,
    "content": "수직선 위를 움직이는 점 $\\mathrm P$의 시각 $t$에서의 위치가 $x(t)=e^{2t}-3t$이다. $t=\\frac{\\ln 2}{2}$에서 속도와 가속도의 곱을 구하여라.",
    "choices": [
      "$2$",
      "$4$",
      "$8$",
      "$12$",
      "$16$"
    ],
    "answer": "③",
    "solution": "위치 $x(t)=e^{2t}-3t$를 미분하면 합성함수의 미분법에 의해 속도는 $v(t)=2e^{2t}-3$이다.\n속도 $v(t)$를 다시 미분하면 가속도는 $a(t)=4e^{2t}$이다.\n$t=\\frac{\\ln 2}{2}$이면 $2t=\\ln 2$이므로 $e^{2t}=e^{\\ln 2}=2$이다.\n속도에 대입하면 $v\\left(\\frac{\\ln 2}{2}\\right)=2\\cdot 2-3=1$이다.\n가속도에 대입하면 $a\\left(\\frac{\\ln 2}{2}\\right)=4\\cdot 2=8$이다.\n따라서 속도와 가속도의 곱은 $1\\cdot 8=8$이다.\n따라서 정답은 ③이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "B12",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-091",
    "problemTypeKey": "PT_DERIVATIVE_MOTION",
    "templateKey": "TPL_MOTION_EVENT_ANALYSIS",
    "crossConceptKeys": [
      "CC_DERIVATIVE_VALUE_EVALUATION"
    ],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 2,
    "category": "도함수의 활용",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-06",
    "standardUnit": "도함수의 활용",
    "standardUnitOrder": 6,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "도함수의 활용"
    ],
    "wide": false,
    "content": "수직선 위를 움직이는 점 $\\mathrm P$의 시각 $t$에서의 위치가 $x(t)=2t+\\frac{12}{\\pi^2}\\cos(\\pi t)$이다. $t=\\frac23$에서 가속도의 크기를 구하여라.",
    "choices": [
      "$3$",
      "$6$",
      "$9$",
      "$12$",
      "$24$"
    ],
    "answer": "②",
    "solution": "위치 $x(t)=2t+\\frac{12}{\\pi^2}\\cos(\\pi t)$를 미분하면 합성함수의 미분법에 의해 $v(t)=2-\\frac{12}{\\pi}\\sin(\\pi t)$이다.\n$v(t)$를 다시 미분하면 $a(t)=-12\\cos(\\pi t)$이다.\n$t=\\frac23$이면 $\\pi t=\\frac{2\\pi}{3}$이고, 특수각의 삼각함수 값에서 $\\cos\\frac{2\\pi}{3}=-\\frac12$이다.\n가속도에 대입하면 $a\\left(\\frac23\\right)=-12\\cdot\\left(-\\frac12\\right)=6$이다.\n가속도의 크기는 $\\left|a\\left(\\frac23\\right)\\right|=|6|=6$이다.\n따라서 정답은 ②이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "B12",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-091",
    "problemTypeKey": "PT_DERIVATIVE_MOTION",
    "templateKey": "TPL_MOTION_EVENT_ANALYSIS",
    "crossConceptKeys": [
      "CC_DERIVATIVE_VALUE_EVALUATION",
      "CC_SPECIAL_ANGLES"
    ],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 3,
    "category": "도함수의 활용",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-06",
    "standardUnit": "도함수의 활용",
    "standardUnitOrder": 6,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "도함수의 활용"
    ],
    "wide": false,
    "content": "수직선 위를 움직이는 점 $\\mathrm P$의 시각 $t$ ($t\\ge0$)에서의 위치가 $x(t)=\\sin\\frac t3-\\frac t6$이다. 처음으로 운동 방향을 바꾸는 시각을 구하여라.",
    "choices": [
      "$\\frac\\pi3$",
      "$\\frac\\pi2$",
      "$\\frac{2\\pi}3$",
      "$\\pi$",
      "$\\frac{3\\pi}2$"
    ],
    "answer": "④",
    "solution": "위치 $x(t)=\\sin\\frac t3-\\frac t6$을 미분하면 합성함수의 미분법에 의해 $v(t)=\\frac13\\cos\\frac t3-\\frac16$이다.\n운동 방향이 바뀌려면 속도의 부호가 바뀌어야 하므로 먼저 $v(t)=0$인 시각을 찾는다.\n$\\frac13\\cos\\frac t3-\\frac16=0$에서 양변에 $3$을 곱하면 $\\cos\\frac t3-\\frac12=0$, 즉 $\\cos\\frac t3=\\frac12$이다.\n$\\frac t3=\\theta$라 하면 $\\cos\\theta=\\frac12$이고 $t\\ge0$이므로 $\\theta\\ge0$이다.\n가장 작은 양의 해는 $\\theta=\\frac{\\pi}{3}$이므로 $\\frac t3=\\frac{\\pi}{3}$, 즉 $t=\\pi$이다.\n$0\\le t<\\pi$이면 $0\\le\\frac t3<\\frac{\\pi}{3}$이고 코사인함수는 이 구간에서 감소하므로 $\\cos\\frac t3>\\frac12$, 즉 $v(t)>0$이다.\n$\\pi<t<3\\pi$이면 $\\frac{\\pi}{3}<\\frac t3<\\pi$이고 $\\cos\\frac t3<\\frac12$, 즉 $v(t)<0$이다.\n따라서 $t=\\pi$의 앞뒤에서 속도의 부호가 양에서 음으로 바뀌므로 처음 운동 방향을 바꾸는 시각은 $t=\\pi$이다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-091",
    "problemTypeKey": "PT_DERIVATIVE_MOTION",
    "templateKey": "TPL_MOTION_EVENT_ANALYSIS",
    "crossConceptKeys": [
      "CC_DIRECTION_CHANGE_ZERO_VELOCITY",
      "CC_DERIVATIVE_ROOT_SOLVING"
    ],
    "conditionKeys": [
      "COND_LOWER_BOUND"
    ],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 4,
    "category": "도함수의 활용",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-06",
    "standardUnit": "도함수의 활용",
    "standardUnitOrder": 6,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "도함수의 활용"
    ],
    "wide": false,
    "content": "수직선 위를 움직이는 점 $\\mathrm P$의 시각 $t$ ($t\\ge0$)에서의 위치가 $x(t)=\\ln(t^2+16)$이다. 가속도가 $0$일 때의 속도를 구하여라.",
    "choices": [
      "$\\frac18$",
      "$\\frac16$",
      "$\\frac15$",
      "$\\frac14$",
      "$\\frac12$"
    ],
    "answer": "④",
    "solution": "위치 $x(t)=\\ln(t^2+16)$을 미분하면 로그함수와 합성함수의 미분법에 의해 $v(t)=\\frac{2t}{t^2+16}$이다.\n$v(t)$를 미분할 때 몫의 미분법을 적용하면 $a(t)=\\frac{2(t^2+16)-2t\\cdot 2t}{(t^2+16)^2}$이다.\n분자를 정리하면 $2t^2+32-4t^2=32-2t^2$이므로 $a(t)=\\frac{32-2t^2}{(t^2+16)^2}$이다.\n분모가 $(t^2+16)^2>0$이므로 $a(t)=0$일 조건은 $32-2t^2=0$이다.\n$2t^2=32$에서 $t^2=16$이고 $t\\ge0$이므로 $t=4$이다.\n속도에 $t=4$를 대입하면 $v(4)=\\frac{2\\cdot 4}{4^2+16}=\\frac{8}{32}=\\frac14$이다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-091",
    "problemTypeKey": "PT_DERIVATIVE_MOTION",
    "templateKey": "TPL_MOTION_EVENT_ANALYSIS",
    "crossConceptKeys": [
      "CC_DERIVATIVE_ROOT_SOLVING",
      "CC_DERIVATIVE_VALUE_EVALUATION"
    ],
    "conditionKeys": [
      "COND_LOWER_BOUND"
    ],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 5,
    "category": "도함수의 활용",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-06",
    "standardUnit": "도함수의 활용",
    "standardUnitOrder": 6,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "도함수의 활용"
    ],
    "wide": false,
    "content": "수직선 위를 움직이는 점 $\\mathrm P$의 시각 $t$에서의 위치가 $x(t)=a\\sin\\frac{\\pi t}{3}+b\\cos\\frac{\\pi t}{3}$이다. $t=3$에서의 속도가 $-\\frac{2\\pi}{3}$이고 가속도가 $\\frac{\\pi^2}{3}$일 때, $a+b$를 구하여라.",
    "choices": [
      "$-5$",
      "$-1$",
      "$1$",
      "$4$",
      "$5$"
    ],
    "answer": "⑤",
    "solution": "합성함수의 미분법으로 위치를 미분하면 $v(t)=\\frac{\\pi a}{3}\\cos\\frac{\\pi t}{3}-\\frac{\\pi b}{3}\\sin\\frac{\\pi t}{3}$이다.\n$v(t)$를 다시 미분하면 가속도는 $\\alpha(t)=-\\frac{\\pi^2 a}{9}\\sin\\frac{\\pi t}{3}-\\frac{\\pi^2 b}{9}\\cos\\frac{\\pi t}{3}$이다.\n$t=3$이면 $\\frac{\\pi t}{3}=\\pi$이고 $\\sin\\pi=0$, $\\cos\\pi=-1$이다.\n속도 조건 $v(3)=-\\frac{2\\pi}{3}$에 대입하면 $\\frac{\\pi a}{3}\\cdot(-1)-\\frac{\\pi b}{3}\\cdot 0=-\\frac{2\\pi}{3}$이다.\n따라서 $-\\frac{\\pi a}{3}=-\\frac{2\\pi}{3}$에서 $a=2$이다.\n가속도 조건 $\\alpha(3)=\\frac{\\pi^2}{3}$에 대입하면 $-\\frac{\\pi^2 a}{9}\\cdot 0-\\frac{\\pi^2 b}{9}\\cdot(-1)=\\frac{\\pi^2}{3}$이다.\n따라서 $\\frac{\\pi^2 b}{9}=\\frac{\\pi^2}{3}$에서 $b=3$이다.\n구하는 값은 $a+b=2+3=5$이다.\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-091",
    "problemTypeKey": "PT_DERIVATIVE_MOTION",
    "templateKey": "TPL_MOTION_EVENT_ANALYSIS",
    "crossConceptKeys": [
      "CC_SIMULTANEOUS_POSITION_EQUATION",
      "CC_DERIVATIVE_VALUE_EVALUATION"
    ],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
  }
];
