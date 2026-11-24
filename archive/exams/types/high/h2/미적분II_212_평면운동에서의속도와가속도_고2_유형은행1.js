window.examTitle = "미적분II_212_평면운동에서의속도와가속도_고2_유형은행1";

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
    "content": "좌표평면 위를 움직이는 점 $\\mathrm P$의 시각 $t$에서의 위치가 $(t^2+t,\\,2t^2-1)$이다. $t=1$에서의 속력을 구하여라.",
    "choices": [
      "$4$",
      "$5$",
      "$6$",
      "$7$",
      "$8$"
    ],
    "answer": "②",
    "solution": "위치의 $x$성분을 거듭제곱의 미분법으로 미분하면 $x'(t)=2t+1$이다.\n위치의 $y$성분을 같은 방법으로 미분하면 $y'(t)=4t$이다.\n$t=1$을 대입하면 속도 벡터는 $(2\\cdot1+1,\\,4\\cdot1)=(3,\\,4)$이다.\n속력은 속도 벡터의 크기이므로 $\\sqrt{3^2+4^2}=\\sqrt{9+16}=\\sqrt{25}=5$이다.\n따라서 정답은 ②이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "B12",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-091",
    "problemTypeKey": "PT_DERIVATIVE_MOTION",
    "templateKey": "TPL_MOTION_EVENT_ANALYSIS",
    "crossConceptKeys": [
      "CC_POLYNOMIAL_DERIVATIVE_RULE",
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
    "content": "좌표평면 위를 움직이는 점 $\\mathrm P$의 시각 $t$ ($t>0$)에서의 위치가 $(t-\\frac1t,\\,3t+\\frac2t)$이다. $t=1$에서 속도 벡터의 크기를 구하여라.",
    "choices": [
      "$\\sqrt3$",
      "$\\sqrt5$",
      "$\\sqrt6$",
      "$\\sqrt7$",
      "$\\sqrt{10}$"
    ],
    "answer": "②",
    "solution": "$t>0$에서 분수항을 음의 지수로 고치면 $x(t)=t-t^{-1}$, $y(t)=3t+2t^{-1}$이다.\n거듭제곱의 미분법으로 $x'(t)=1+t^{-2}$이다.\n같은 방법으로 $y'(t)=3-2t^{-2}$이다.\n$t=1$을 대입하면 속도는 $(1+1^{-2},\\,3-2\\cdot1^{-2})=(2,\\,1)$이다.\n속도 벡터의 크기는 $\\sqrt{2^2+1^2}=\\sqrt{4+1}=\\sqrt5$이다.\n따라서 정답은 ②이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B12",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-091",
    "problemTypeKey": "PT_DERIVATIVE_MOTION",
    "templateKey": "TPL_MOTION_EVENT_ANALYSIS",
    "crossConceptKeys": [
      "CC_DERIVATIVE_VALUE_EVALUATION"
    ],
    "conditionKeys": [
      "COND_POSITIVE"
    ],
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
    "content": "시각 $t$에서 점 $\\mathrm P$의 위치가 $(\\ln(2t+1),\\,\\frac12t^2-1)$이다. $t=1$에서의 속력을 구하여라.",
    "choices": [
      "$\\frac{\\sqrt{13}}3$",
      "$\\frac{\\sqrt{14}}3$",
      "$\\frac{\\sqrt{15}}3$",
      "$\\frac{\\sqrt{17}}3$",
      "$\\frac{\\sqrt{19}}3$"
    ],
    "answer": "①",
    "solution": "로그함수와 합성함수의 미분법으로 $x'(t)=\\frac{2}{2t+1}$이다.\n거듭제곱의 미분법으로 $y'(t)=\\frac12\\cdot2t=t$이다.\n$t=1$을 대입하면 속도는 $(\\frac{2}{2\\cdot1+1},\\,1)=(\\frac{2}{3},\\,1)$이다.\n속력은 $\\sqrt{(\\frac{2}{3})^2+1^2}=\\sqrt{\\frac{4}{9}+\\frac{9}{9}}=\\sqrt{\\frac{13}{9}}=\\frac{\\sqrt{13}}{3}$이다.\n따라서 정답은 ①이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
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
    "content": "좌표평면 위에서 점 $\\mathrm P$의 시각 $t$ ($t\\ge0$)에서의 위치가 $(3t,\\,t^2-5t)$이다. 속력이 $5$가 되는 모든 시각의 합을 구하여라.",
    "choices": [
      "$5$",
      "$6$",
      "$7$",
      "$8$",
      "$9$"
    ],
    "answer": "①",
    "solution": "두 위치 성분을 각각 미분하면 속도는 $(3,\\,2t-5)$이다.\n속력이 $5$이므로 $\\sqrt{3^2+(2t-5)^2}=5$이다.\n양변을 제곱하고 정리하면 $9+(2t-5)^2=25$, 즉 $(2t-5)^2=16$이다.\n(i) $2t-5=4$이면 $2t=9$이므로 $t=\\frac{9}{2}$이다.\n(ii) $2t-5=-4$이면 $2t=1$이므로 $t=\\frac{1}{2}$이다.\n두 값 모두 $t\\ge0$을 만족하므로 합은 $\\frac{9}{2}+\\frac{1}{2}=\\frac{10}{2}=5$이다.\n주의: 제곱한 방정식의 해가 원래 속력 식을 만족하는지 확인해야 한다.\n따라서 정답은 ①이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-091",
    "problemTypeKey": "PT_DERIVATIVE_MOTION",
    "templateKey": "TPL_MOTION_EVENT_ANALYSIS",
    "crossConceptKeys": [
      "CC_DERIVATIVE_ROOT_SOLVING",
      "CC_POLYNOMIAL_DERIVATIVE_RULE"
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
    "content": "좌표평면 위를 움직이는 점 $\\mathrm P$의 위치가 $(2t+2\\sin t,\\,1+2\\cos t)$이다. $t=\\frac{2\\pi}{3}$에서의 속력을 구하여라.",
    "choices": [
      "$1$",
      "$\\sqrt2$",
      "$\\sqrt3$",
      "$2$",
      "$\\sqrt5$"
    ],
    "answer": "④",
    "solution": "삼각함수의 미분법으로 속도는 $(2+2\\cos t,\\,-2\\sin t)$이다.\n$t=\\frac{2\\pi}{3}$에서 $\\cos t=-\\frac12$, $\\sin t=\\frac{\\sqrt3}{2}$이다.\n이를 대입하면 속도는 $(2+2(-\\frac12),\\,-2\\cdot\\frac{\\sqrt3}{2})=(1,\\,-\\sqrt3)$이다.\n속력은 $\\sqrt{1^2+(-\\sqrt3)^2}=\\sqrt{1+3}=2$이다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
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
    "content": "시각 $t$에서 점 $\\mathrm P$의 위치가 $(2\\cos t+\\cos 2t,\\,2\\sin t-\\sin 2t)$이다. $t=\\frac\\pi3$에서의 속력을 구하여라.",
    "choices": [
      "$1$",
      "$2$",
      "$3$",
      "$4$",
      "$5$"
    ],
    "answer": "④",
    "solution": "합성함수의 미분법으로 $x'(t)=-2\\sin t-2\\sin 2t$이다.\n같은 방법으로 $y'(t)=2\\cos t-2\\cos 2t$이다.\n$t=\\frac{\\pi}{3}$에서 $\\sin t=\\sin 2t=\\frac{\\sqrt3}{2}$이다.\n같은 시각에 $\\cos t=\\frac12$, $\\cos 2t=-\\frac12$이다.\n따라서 $x'(\\frac{\\pi}{3})=-2\\cdot\\frac{\\sqrt3}{2}-2\\cdot\\frac{\\sqrt3}{2}=-2\\sqrt3$이다.\n또 $y'(\\frac{\\pi}{3})=2\\cdot\\frac12-2(-\\frac12)=1+1=2$이다.\n속력은 $\\sqrt{(-2\\sqrt3)^2+2^2}=\\sqrt{12+4}=4$이다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
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
    "content": "시각 $t$에서 점 $\\mathrm P$의 위치가 $(e^{-2t}\\cos t,\\,e^{-2t}\\sin t)$이다. $t=1$에서의 속력을 구하여라.",
    "choices": [
      "$\\frac{\\sqrt5}{e^2}$",
      "$\\frac{\\sqrt6}{e^2}$",
      "$\\frac{\\sqrt7}{e^2}$",
      "$\\frac{\\sqrt{10}}{e^2}$",
      "$\\frac{\\sqrt{13}}{e^2}$"
    ],
    "answer": "①",
    "solution": "곱의 미분법과 합성함수의 미분법으로 $x'(t)=e^{-2t}(-2\\cos t-\\sin t)$이다.\n같은 방법으로 $y'(t)=e^{-2t}(-2\\sin t+\\cos t)$이다.\n속력의 제곱을 정리하면 $e^{-4t}[(-2\\cos t-\\sin t)^2+(-2\\sin t+\\cos t)^2]$이다.\n괄호를 전개하면 교차항이 상쇄되어 $e^{-4t}(5\\cos^2t+5\\sin^2t)$이다.\n삼각함수의 기본 항등식으로 속력의 제곱은 $5e^{-4t}$이다.\n$t=1$에서 속력은 $\\sqrt{5e^{-4}}=\\frac{\\sqrt5}{e^2}$이다.\n따라서 정답은 ①이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-091",
    "problemTypeKey": "PT_DERIVATIVE_MOTION",
    "templateKey": "TPL_MOTION_EVENT_ANALYSIS",
    "crossConceptKeys": [
      "CC_DERIVATIVE_VALUE_EVALUATION",
      "CC_TRIGONOMETRIC_IDENTITY"
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
    "content": "시각 $t$에서 점 $\\mathrm P$의 위치가 $(e^{-3t}\\cos 2t,\\,e^{-3t}\\sin 2t)$이다. $t=\\frac{\\pi}{4}$에서의 속력이 $ke^{-3\\pi/4}$일 때, $k$를 구하여라.",
    "choices": [
      "$\\sqrt5$",
      "$\\sqrt{10}$",
      "$\\sqrt{13}$",
      "$\\sqrt{17}$",
      "$\\sqrt{20}$"
    ],
    "answer": "③",
    "solution": "곱의 미분법과 합성함수의 미분법으로 $x'(t)=e^{-3t}(-3\\cos2t-2\\sin2t)$이다.\n같은 방법으로 $y'(t)=e^{-3t}(-3\\sin2t+2\\cos2t)$이다.\n$t=\\frac{\\pi}{4}$이면 $2t=\\frac{\\pi}{2}$이므로 $\\cos2t=0$, $\\sin2t=1$이다.\n따라서 $x'(\\frac{\\pi}{4})=e^{-3\\pi/4}(-3\\cdot0-2\\cdot1)=-2e^{-3\\pi/4}$이다.\n또 $y'(\\frac{\\pi}{4})=e^{-3\\pi/4}(-3\\cdot1+2\\cdot0)=-3e^{-3\\pi/4}$이다.\n속력은 $\\sqrt{(-2e^{-3\\pi/4})^2+(-3e^{-3\\pi/4})^2}=e^{-3\\pi/4}\\sqrt{4+9}=\\sqrt{13}e^{-3\\pi/4}$이다.\n$ke^{-3\\pi/4}$와 비교하면 $k=\\sqrt{13}$이다.\n따라서 정답은 ③이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-091",
    "problemTypeKey": "PT_DERIVATIVE_MOTION",
    "templateKey": "TPL_MOTION_EVENT_ANALYSIS",
    "crossConceptKeys": [
      "CC_DERIVATIVE_VALUE_EVALUATION",
      "CC_TRIGONOMETRIC_IDENTITY"
    ],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
  }
];
