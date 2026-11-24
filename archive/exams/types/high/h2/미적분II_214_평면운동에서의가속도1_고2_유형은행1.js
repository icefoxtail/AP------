window.examTitle = "미적분II_214_평면운동에서의가속도1_고2_유형은행1";

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
    "content": "시각 $t$에서 점 $\\mathrm P$의 위치가 $(t^2-3t,\\,at^2)$이다. $t=2$에서 가속도의 크기가 $2\\sqrt{10}$일 때, 양수 $a$를 구하여라.",
    "choices": [
      "$3$",
      "$4$",
      "$5$",
      "$6$",
      "$7$"
    ],
    "answer": "①",
    "solution": "시각 $t$에서 위치가 $(t^2-3t,\\,at^2)$이므로 거듭제곱의 미분법으로 속도를 구하면 $$(2t-3,\\,2at)$$이다.\n속도를 다시 미분하면 가속도는 $$(2,\\,2a)$$이고 $t$에 관계없이 일정하다.\n따라서 $t=2$에서도 가속도는 $(2,\\,2a)$이다.\n가속도의 크기 조건을 식으로 쓰면 $$\\sqrt{2^2+(2a)^2}=2\\sqrt{10}$$이다.\n양변을 제곱하면 $4+4a^2=40$이다.\n$4a^2=36$에서 $a^2=9$이고 $a>0$이므로 $a=3$이다.\n따라서 정답은 ①이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-091",
    "problemTypeKey": "PT_DERIVATIVE_MOTION",
    "templateKey": "TPL_MOTION_EVENT_ANALYSIS",
    "crossConceptKeys": [
      "CC_POLYNOMIAL_DERIVATIVE_RULE"
    ],
    "conditionKeys": [
      "COND_POSITIVE"
    ],
    "integrationPattern": "NONE"
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
    "content": "시각 $t$ ($t>0$)에서 점 $\\mathrm P$의 위치가 $(t-\\frac4t,\\,2t+\\frac3t)$이다. $t=1$에서 가속도의 크기를 구하여라.",
    "choices": [
      "$6$",
      "$8$",
      "$9$",
      "$10$",
      "$14$"
    ],
    "answer": "④",
    "solution": "분수항을 $t^{-1}$꼴로 보고 거듭제곱의 미분법을 쓰면 속도는 $$(1+4t^{-2},\\,2-3t^{-2})$$이다.\n속도를 다시 미분하면 가속도는 $(0-8t^{-3},\\,0+6t^{-3})=(-8t^{-3},\\,6t^{-3})$이다.\n$t=1$을 대입하면 $(-8\\cdot1^{-3},\\,6\\cdot1^{-3})=(-8,\\,6)$이다.\n벡터의 크기를 계산하면 $$\\sqrt{(-8)^2+6^2}=\\sqrt{64+36}=\\sqrt{100}=10$$이다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-091",
    "problemTypeKey": "PT_DERIVATIVE_MOTION",
    "templateKey": "TPL_MOTION_EVENT_ANALYSIS",
    "crossConceptKeys": [],
    "conditionKeys": [
      "COND_POSITIVE"
    ],
    "integrationPattern": "NONE"
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
    "content": "시각 $t$에서 점 $\\mathrm P$의 위치가 $(t-2e^t,\\,3t+e^t)$이다. $t=2$에서 가속도의 크기를 구하여라.",
    "choices": [
      "$\\sqrt2 e^2$",
      "$2e^2$",
      "$\\sqrt5 e^2$",
      "$\\sqrt6 e^2$",
      "$3e^2$"
    ],
    "answer": "③",
    "solution": "지수함수의 미분법 $(e^t)'=e^t$를 쓰면 속도는 $(1-2e^t,\\,3+e^t)$이다.\n상수의 미분값은 $0$이므로 다시 미분하면 가속도는 $(0-2e^t,\\,0+e^t)=(-2e^t,\\,e^t)$이다.\n$t=2$를 대입하면 $(-2e^2,\\,e^2)$이다.\n벡터의 크기는 $$\\sqrt{(-2e^2)^2+(e^2)^2}=\\sqrt{4e^4+e^4}=\\sqrt{5e^4}=\\sqrt5\\,e^2$$이다.\n따라서 정답은 ③이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-091",
    "problemTypeKey": "PT_DERIVATIVE_MOTION",
    "templateKey": "TPL_MOTION_EVENT_ANALYSIS",
    "crossConceptKeys": [],
    "conditionKeys": [],
    "integrationPattern": "NONE"
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
    "content": "시각 $t$에서 점 $\\mathrm P$의 위치가 $(4\\cos t,\\,5\\sin t)$이다. $t=\\frac{\\pi}{2}$에서 가속도의 크기를 구하여라.",
    "choices": [
      "$4$",
      "$5$",
      "$6$",
      "$7$",
      "$9$"
    ],
    "answer": "②",
    "solution": "삼각함수의 미분법 $(\\cos t)'=-\\sin t$, $(\\sin t)'=\\cos t$로 속도는 $(-4\\sin t,\\,5\\cos t)$이다.\n다시 미분하면 가속도는 $(-4\\cos t,\\,-5\\sin t)$이다.\n$t=\\frac{\\pi}{2}$에서 $\\cos\\frac{\\pi}{2}=0$, $\\sin\\frac{\\pi}{2}=1$이므로 가속도는 $(-4\\cdot0,\\,-5\\cdot1)=(0,\\,-5)$이다.\n벡터의 크기는 $\\sqrt{0^2+(-5)^2}=\\sqrt{25}=5$이다.\n따라서 정답은 ②이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-091",
    "problemTypeKey": "PT_DERIVATIVE_MOTION",
    "templateKey": "TPL_MOTION_EVENT_ANALYSIS",
    "crossConceptKeys": [],
    "conditionKeys": [],
    "integrationPattern": "NONE"
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
    "content": "시각 $t$ ($t\\ge0$)에서 점 $\\mathrm P$의 위치가 $(3t+1,\\,4t-\\frac13 t^3)$이다. 속력이 $3$인 순간에 가속도의 크기를 구하여라.",
    "choices": [
      "$4$",
      "$5$",
      "$6$",
      "$7$",
      "$8$"
    ],
    "answer": "①",
    "solution": "거듭제곱의 미분법으로 속도는 $(3,\\,4-t^2)$이다.\n속력이 $3$이라는 조건은 $$\\sqrt{3^2+(4-t^2)^2}=3$$이다.\n양변을 제곱하면 $9+(4-t^2)^2=9$이므로 $(4-t^2)^2=0$이다.\n따라서 $t^2=4$이고 $t\\ge0$이므로 $t=2$이다.\n속도를 다시 미분하면 가속도는 $(0,\\,-2t)$이다.\n$t=2$를 대입하면 $(0,\\,-4)$이고 크기는 $\\sqrt{0^2+(-4)^2}=\\sqrt{16}=4$이다.\n주의: 속도의 $x$성분 $3$만 보고 $t$를 정하면 안 되고, 속력 조건 전체를 제곱해 풀어야 한다.\n따라서 정답은 ①이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-091",
    "problemTypeKey": "PT_DERIVATIVE_MOTION",
    "templateKey": "TPL_MOTION_EVENT_ANALYSIS",
    "crossConceptKeys": [
      "CC_POLYNOMIAL_DERIVATIVE_RULE",
      "CC_VELOCITY_FROM_POSITION_DERIVATIVE"
    ],
    "conditionKeys": [
      "COND_LOWER_BOUND"
    ],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 6,
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
    "content": "시각 $t$에서 점 $\\mathrm P$의 위치가 $(e^t\\cos 2t,\\,e^t\\sin 2t)$이다. 속력이 $\\sqrt5 e^2$인 순간에 가속도의 크기를 구하여라.",
    "choices": [
      "$4e^2$",
      "$5e^2$",
      "$6e^2$",
      "$7e^2$",
      "$8e^2$"
    ],
    "answer": "②",
    "solution": "곱의 미분법과 합성함수의 미분법으로 속도를 구하면 $$(e^t\\cos2t-2e^t\\sin2t,\\ e^t\\sin2t+2e^t\\cos2t)$$이다.\n공통인 $e^t$를 묶으면 $e^t(\\cos2t-2\\sin2t,\\ \\sin2t+2\\cos2t)$이다.\n속력의 제곱을 전개하면 $$e^{2t}\\{(\\cos2t-2\\sin2t)^2+(\\sin2t+2\\cos2t)^2\\}$$이다.\n첫 항은 $\\cos^2 2t-4\\sin2t\\cos2t+4\\sin^2 2t$, 둘째 항은 $\\sin^2 2t+4\\sin2t\\cos2t+4\\cos^2 2t$이다.\n교차항 $-4\\sin2t\\cos2t$와 $+4\\sin2t\\cos2t$가 상쇄된다.\n삼각함수의 기본 항등식 $\\sin^2\\theta+\\cos^2\\theta=1$을 쓰면 $5(\\sin^2 2t+\\cos^2 2t)=5$이다.\n따라서 속력은 $\\sqrt{5e^{2t}}=\\sqrt5\\,e^t$이다.\n속력 조건 $\\sqrt5\\,e^t=\\sqrt5\\,e^{\\pi/2}$가 아니라 $\\sqrt5\\,e^t=\\sqrt5\\,e^2$에서 지수함수가 증가하므로 $t=2$이다.\n가속도의 첫째 성분은 곱의 미분법으로 $e^t(\\cos2t-2\\sin2t)+e^t(-2\\sin2t-4\\cos2t)=e^t(-3\\cos2t-4\\sin2t)$이다.\n가속도의 둘째 성분은 $e^t(\\sin2t+2\\cos2t)+e^t(2\\cos2t-4\\sin2t)=e^t(-3\\sin2t+4\\cos2t)$이다.\n가속도 크기의 제곱은 $e^{2t}\\{(-3\\cos2t-4\\sin2t)^2+(-3\\sin2t+4\\cos2t)^2\\}$이다.\n전개하면 $e^{2t}\\{(9+16)\\cos^2 2t+(16+9)\\sin^2 2t\\}=25e^{2t}$이다.\n따라서 가속도의 크기는 $5e^t$이고 $t=2$에서 $5e^2$이다.\n따라서 정답은 ②이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-091",
    "problemTypeKey": "PT_DERIVATIVE_MOTION",
    "templateKey": "TPL_MOTION_EVENT_ANALYSIS",
    "crossConceptKeys": [
      "CC_VELOCITY_FROM_POSITION_DERIVATIVE"
    ],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 7,
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
    "content": "시각 $t$에서 점 $\\mathrm P$의 위치가 $(e^t\\cos t,\\,e^t\\sin t+1)$이다. 속력이 $\\sqrt2 e^{\\pi/2}$일 때 가속도 벡터를 $(a,b)$라 하면, $a+b$를 구하여라.",
    "choices": [
      "$-5e^{\\pi/2}$",
      "$-4e^{\\pi/2}$",
      "$-3e^{\\pi/2}$",
      "$-2e^{\\pi/2}$",
      "$-e^{\\pi/2}$"
    ],
    "answer": "④",
    "solution": "곱의 미분법으로 속도를 구하면 $$(e^t\\cos t-e^t\\sin t,\\ e^t\\sin t+e^t\\cos t)$$이다.\n$e^t$로 묶으면 $e^t(\\cos t-\\sin t,\\ \\sin t+\\cos t)$이다.\n속력의 제곱은 $e^{2t}\\{(\\cos t-\\sin t)^2+(\\sin t+\\cos t)^2\\}$이다.\n전개하면 $e^{2t}(\\cos^2t-2\\sin t\\cos t+\\sin^2t+\\sin^2t+2\\sin t\\cos t+\\cos^2t)$이다.\n교차항이 상쇄되고 $\\sin^2t+\\cos^2t=1$이므로 $e^{2t}(1+1)=2e^{2t}$이다.\n따라서 속력은 $\\sqrt2\\,e^t$이고 조건 $\\sqrt2\\,e^t=\\sqrt2\\,e^{\\pi/2}$에서 $t=\\frac{\\pi}{2}$이다.\n가속도의 첫째 성분은 $e^t(\\cos t-\\sin t)+e^t(-\\sin t-\\cos t)=-2e^t\\sin t$이다.\n가속도의 둘째 성분은 $e^t(\\sin t+\\cos t)+e^t(\\cos t-\\sin t)=2e^t\\cos t$이다.\n$t=\\frac{\\pi}{2}$에서 $\\sin\\frac{\\pi}{2}=1$, $\\cos\\frac{\\pi}{2}=0$이므로 $(a,b)=(-2e^{\\pi/2},\\ 0)$이다.\n$a+b=-2e^{\\pi/2}+0=-2e^{\\pi/2}$이다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-091",
    "problemTypeKey": "PT_DERIVATIVE_MOTION",
    "templateKey": "TPL_MOTION_EVENT_ANALYSIS",
    "crossConceptKeys": [
      "CC_VELOCITY_FROM_POSITION_DERIVATIVE"
    ],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 8,
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
    "content": "시각 $t$에서 점 $\\mathrm P$의 위치가 $(at^2-a\\sin t,\\,2t-a\\cos t)$이다. $t=\\pi$에서 가속도의 크기가 $3\\sqrt5$일 때, 양수 $a$를 구하여라.",
    "choices": [
      "$1$",
      "$\\frac32$",
      "$2$",
      "$3$",
      "$4$"
    ],
    "answer": "④",
    "solution": "거듭제곱과 삼각함수의 미분법으로 속도를 구하면 $$(2at-a\\cos t,\\ 2+a\\sin t)$$이다.\n다시 미분하면 가속도는 $(2a+a\\sin t,\\ a\\cos t)$이다.\n$t=\\pi$에서 $\\sin\\pi=0$, $\\cos\\pi=-1$이므로 가속도는 $(2a+a\\cdot0,\\ a\\cdot(-1))=(2a,\\,-a)$이다.\n가속도의 크기는 $\\sqrt{(2a)^2+(-a)^2}=\\sqrt{4a^2+a^2}=\\sqrt{5a^2}=\\sqrt5\\,a$이다($a>0$).\n조건 $\\sqrt5\\,a=3\\sqrt5$의 양변을 $\\sqrt5$로 나누면 $a=3$이다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-091",
    "problemTypeKey": "PT_DERIVATIVE_MOTION",
    "templateKey": "TPL_MOTION_EVENT_ANALYSIS",
    "crossConceptKeys": [],
    "conditionKeys": [
      "COND_POSITIVE"
    ],
    "integrationPattern": "NONE"
  },
  {
    "id": 9,
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
    "content": "시각 $t$에서 점 $\\mathrm P$의 위치가 $(a(2t-\\sin 2t),\\,a(1-\\cos 2t))$이다. 가속도의 크기가 항상 $3\\sqrt2$일 때, 양수 $a$를 구하여라.",
    "choices": [
      "$\\frac{\\sqrt2}{2}$",
      "$\\frac{3\\sqrt2}{4}$",
      "$\\sqrt2$",
      "$\\frac{3\\sqrt2}{2}$",
      "$2\\sqrt2$"
    ],
    "answer": "②",
    "solution": "합성함수의 미분법 $(\\sin2t)'=2\\cos2t$, $(\\cos2t)'=-2\\sin2t$로 속도를 구하면 $$(a(2-2\\cos2t),\\ a\\cdot2\\sin2t)$$이다.\n다시 미분하면 가속도는 $(a\\cdot4\\sin2t,\\ a\\cdot4\\cos2t)=(4a\\sin2t,\\ 4a\\cos2t)$이다.\n가속도 크기의 제곱은 $(4a)^2\\sin^2 2t+(4a)^2\\cos^2 2t$이다.\n$(4a)^2$으로 묶고 $\\sin^2 2t+\\cos^2 2t=1$을 쓰면 $(4a)^2$이다.\n따라서 가속도의 크기는 $4a$로 $t$에 관계없이 일정하다($a>0$).\n조건 $4a=3\\sqrt2$에서 $a=\\frac{3\\sqrt2}{4}$이다.\n따라서 정답은 ②이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-091",
    "problemTypeKey": "PT_DERIVATIVE_MOTION",
    "templateKey": "TPL_MOTION_EVENT_ANALYSIS",
    "crossConceptKeys": [],
    "conditionKeys": [
      "COND_POSITIVE",
      "COND_FUNCTION_VALUE_CONSTRAINT"
    ],
    "integrationPattern": "NONE"
  }
];
