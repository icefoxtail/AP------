window.examTitle = "미적분II_215_평면운동에서의가속도2_고2_유형은행1";

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
    "content": "시각 $t$ ($t\\ge0$)에서 점 $\\mathrm P$의 위치가 $(2-\\cos 3t,\\,\\frac23\\sin 3t)$이다. 속력이 최대일 때 가속도의 크기를 구하여라.",
    "choices": [
      "$2$",
      "$3$",
      "$6$",
      "$8$",
      "$9$"
    ],
    "answer": "③",
    "solution": "합성함수의 미분법으로 위치를 미분하면 속도는 $(3\\sin 3t,\\,2\\cos 3t)$이다.\n속력의 제곱을 전개하면 $s^2=9\\sin^2 3t+4\\cos^2 3t$이다.\n삼각함수의 기본 항등식 $\\cos^2 3t=1-\\sin^2 3t$를 대입하면 $s^2=9\\sin^2 3t+4(1-\\sin^2 3t)=4+5\\sin^2 3t$이다.\n$0\\le \\sin^2 3t\\le 1$이므로 $s^2$의 최댓값은 $4+5\\cdot1=9$이고, 이때 $\\sin^2 3t=1$, $\\cos^2 3t=0$이다.\n합성함수의 미분법으로 속도를 다시 미분하면 가속도는 $(9\\cos 3t,\\,-6\\sin 3t)$이다.\n속력이 최대인 순간에는 $\\cos^2 3t=0$, $\\sin^2 3t=1$이므로 가속도의 크기의 제곱은 $81\\cdot0+36\\cdot1=36$이다.\n따라서 가속도의 크기는 $\\sqrt{36}=6$이다.\n따라서 정답은 ③이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-091",
    "problemTypeKey": "PT_DERIVATIVE_MOTION",
    "templateKey": "TPL_MOTION_EVENT_ANALYSIS",
    "crossConceptKeys": [
      "CC_VELOCITY_FROM_POSITION_DERIVATIVE",
      "CC_TRIGONOMETRIC_EXTREMUM"
    ],
    "conditionKeys": [
      "COND_LOWER_BOUND"
    ],
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
    "content": "시각 $t$ ($t\\ge0$)에서 점 $\\mathrm P$의 위치가 $(2t-3\\cos t,\\,4-2\\sin t)$이다. 속력이 최대일 때 가속도의 크기를 구하여라.",
    "choices": [
      "$2$",
      "$3$",
      "$4$",
      "$5$",
      "$6$"
    ],
    "answer": "①",
    "solution": "삼각함수의 미분법으로 위치를 미분하면 속도는 $(2+3\\sin t,\\,-2\\cos t)$이다.\n속력의 제곱을 전개하면 $s^2=(2+3\\sin t)^2+(-2\\cos t)^2=4+12\\sin t+9\\sin^2 t+4\\cos^2 t$이다.\n$\\cos^2 t=1-\\sin^2 t$를 대입하면 $s^2=4+12\\sin t+9\\sin^2 t+4(1-\\sin^2 t)=8+12\\sin t+5\\sin^2 t$이다.\n$u=\\sin t$ ($-1\\le u\\le1$)라 두면 $s^2=F(u)=5u^2+12u+8$이다.\n이차함수의 미분으로 $F'(u)=10u+12$이고, $-1\\le u\\le1$에서 $F'(u)\\ge10(-1)+12=2>0$이다.\n따라서 $F(u)$는 증가하므로 $u=1$, 즉 $\\sin t=1$일 때 속력이 최대이다.\n속도를 미분하면 가속도는 $(3\\cos t,\\,2\\sin t)$이다.\n$\\sin t=1$이면 $\\cos^2 t=1-1^2=0$이므로 가속도의 크기의 제곱은 $9\\cdot0+4\\cdot1=4$이다.\n따라서 가속도의 크기는 $\\sqrt4=2$이다.\n따라서 정답은 ①이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-091",
    "problemTypeKey": "PT_DERIVATIVE_MOTION",
    "templateKey": "TPL_MOTION_EVENT_ANALYSIS",
    "crossConceptKeys": [
      "CC_VELOCITY_FROM_POSITION_DERIVATIVE",
      "CC_TRIGONOMETRIC_EXTREMUM"
    ],
    "conditionKeys": [
      "COND_LOWER_BOUND"
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
    "content": "시각 $t$ ($t\\ge0$)에서 점 $\\mathrm P$의 위치가 $(t+2\\cos t,\\,2\\sqrt2\\sin t)$이다. 속력이 최대일 때 가속도의 크기를 구하여라.",
    "choices": [
      "$\\sqrt3$",
      "$2$",
      "$\\sqrt5$",
      "$\\sqrt6$",
      "$2\\sqrt2$"
    ],
    "answer": "③",
    "solution": "삼각함수의 미분법으로 위치를 미분하면 속도는 $(1-2\\sin t,\\,2\\sqrt2\\cos t)$이다.\n속력의 제곱을 전개하면 $s^2=(1-2\\sin t)^2+(2\\sqrt2\\cos t)^2=1-4\\sin t+4\\sin^2 t+8\\cos^2 t$이다.\n$\\cos^2 t=1-\\sin^2 t$를 대입하면 $s^2=1-4\\sin t+4\\sin^2 t+8-8\\sin^2 t=9-4\\sin t-4\\sin^2 t$이다.\n$u=\\sin t$라 두면 $s^2=9-4u-4u^2=-4\\left(u+\\frac12\\right)^2+10$이다.\n$-1\\le u\\le1$이므로 $u=-\\frac12$일 때 $s^2$이 최대 $10$이 된다.\n속도를 미분하면 가속도는 $(-2\\cos t,\\,-2\\sqrt2\\sin t)$이다.\n$\\sin t=-\\frac12$이면 $\\cos^2 t=1-\\left(-\\frac12\\right)^2=\\frac34$이다.\n가속도의 크기의 제곱은 $4\\cdot\\frac34+8\\cdot\\frac14=3+2=5$이다.\n따라서 가속도의 크기는 $\\sqrt5$이다.\n따라서 정답은 ③이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B45",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-091",
    "problemTypeKey": "PT_DERIVATIVE_MOTION",
    "templateKey": "TPL_MOTION_EVENT_ANALYSIS",
    "crossConceptKeys": [
      "CC_VELOCITY_FROM_POSITION_DERIVATIVE",
      "CC_TRIGONOMETRIC_EXTREMUM"
    ],
    "conditionKeys": [
      "COND_LOWER_BOUND"
    ],
    "integrationPattern": "SEQUENTIAL"
  }
];
