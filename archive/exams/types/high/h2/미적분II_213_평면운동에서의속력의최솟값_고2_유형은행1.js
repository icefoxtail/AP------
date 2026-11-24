window.examTitle = "미적분II_213_평면운동에서의속력의최솟값_고2_유형은행1";

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
    "content": "시각 $t$ ($t\\ge0$)에서 점 $\\mathrm P$의 위치가 $(\\frac12t^2+1,\\,\\frac12t^2-4t)$이다. 속력의 최솟값을 구하여라.",
    "choices": [
      "$\\sqrt5$",
      "$\\sqrt6$",
      "$\\sqrt7$",
      "$2\\sqrt2$",
      "$3$"
    ],
    "answer": "④",
    "solution": "위치 $x(t)=\\frac12t^2+1$, $y(t)=\\frac12t^2-4t$를 각각 미분하면 속도는 $(x'(t),y'(t))=(t,t-4)$이다.\n속력 $s(t)$의 제곱을 세우면 $s^2=t^2+(t-4)^2$이다.\n전개하면 $s^2=t^2+t^2-8t+16=2t^2-8t+16$이다.\n완전제곱식으로 정리하면 $s^2=2(t^2-4t+4)+8=2(t-2)^2+8$이다.\n$(t-2)^2\\ge0$이므로 $t=2$에서 $s^2$의 최솟값은 $8$이다.\n속력은 $s=\\sqrt{s^2}\\ge0$이므로 최솟값은 $\\sqrt8=2\\sqrt2$이다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-091",
    "problemTypeKey": "PT_DERIVATIVE_MOTION",
    "templateKey": "TPL_MOTION_EVENT_ANALYSIS",
    "crossConceptKeys": [
      "CC_POLYNOMIAL_DERIVATIVE_RULE",
      "CC_QUADRATIC_EXTREMUM"
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
    "content": "시각 $t$ ($t\\ge0$)에서 점 $\\mathrm P$의 위치가 $(3t,\\,-t^2+6t)$이다. 속력이 최소가 되는 순간의 위치를 $(a,b)$라 할 때, $a+b$를 구하여라.",
    "choices": [
      "$12$",
      "$14$",
      "$15$",
      "$16$",
      "$18$"
    ],
    "answer": "⑤",
    "solution": "위치 $x(t)=3t$, $y(t)=-t^2+6t$를 미분하면 속도는 $(x'(t),y'(t))=(3,-2t+6)$이다.\n속력의 제곱은 $s^2=3^2+(-2t+6)^2$이다.\n$-2t+6=-2(t-3)$이므로 $s^2=9+4(t-3)^2$이다.\n$4(t-3)^2\\ge0$이고 $t=3$에서 $0$이므로 이때 속력이 최소이다.\n$t=3$을 $x(t)$에 대입하면 $a=3\\cdot3=9$이다.\n같은 시각의 $y$좌표는 $b=-3^2+6\\cdot3=-9+18=9$이다.\n따라서 $a+b=9+9=18$이다.\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-091",
    "problemTypeKey": "PT_DERIVATIVE_MOTION",
    "templateKey": "TPL_MOTION_EVENT_ANALYSIS",
    "crossConceptKeys": [
      "CC_POLYNOMIAL_DERIVATIVE_RULE",
      "CC_QUADRATIC_EXTREMUM"
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
    "content": "시각 $t$ ($t\\ge0$)에서 점 $\\mathrm P$의 위치가 $(2+\\sin 3t,\\,2t+\\cos 3t)$이다. 속력의 최댓값을 구하여라.",
    "choices": [
      "$5$",
      "$6$",
      "$7$",
      "$8$",
      "$9$"
    ],
    "answer": "①",
    "solution": "합성함수의 미분법으로 $x(t)=2+\\sin3t$, $y(t)=2t+\\cos3t$를 미분하면 속도는 $(3\\cos3t,2-3\\sin3t)$이다.\n속력의 제곱은 $s^2=(3\\cos3t)^2+(2-3\\sin3t)^2$이다.\n전개하면 $s^2=9\\cos^23t+4-12\\sin3t+9\\sin^23t$이다.\n$\\cos^23t+\\sin^23t=1$이므로 $s^2=9+4-12\\sin3t=13-12\\sin3t$이다.\n$-1\\le\\sin3t\\le1$이고 $t=\\frac\\pi2$에서 $\\sin3t=\\sin\\frac{3\\pi}2=-1$이다.\n그때 $s^2=13-12(-1)=25$이므로 속력의 최댓값은 $\\sqrt{25}=5$이다.\n따라서 정답은 ①이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-091",
    "problemTypeKey": "PT_DERIVATIVE_MOTION",
    "templateKey": "TPL_MOTION_EVENT_ANALYSIS",
    "crossConceptKeys": [
      "CC_TRIGONOMETRIC_EXTREMUM",
      "CC_TRIGONOMETRIC_IDENTITY"
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
    "content": "시각 $t$ ($t\\ge0$)에서 점 $\\mathrm P$의 위치가 $(4t-\\sin 2t,\\,3-\\cos 2t)$이다. 속력의 최댓값을 $M$, 최솟값을 $m$이라 할 때, $M+m$을 구하여라.",
    "choices": [
      "$8$",
      "$9$",
      "$10$",
      "$11$",
      "$12$"
    ],
    "answer": "①",
    "solution": "합성함수의 미분법으로 $x(t)=4t-\\sin2t$, $y(t)=3-\\cos2t$를 미분하면 속도는 $(4-2\\cos2t,2\\sin2t)$이다.\n속력의 제곱은 $s^2=(4-2\\cos2t)^2+(2\\sin2t)^2$이다.\n전개하면 $s^2=16-16\\cos2t+4\\cos^22t+4\\sin^22t$이다.\n$\\cos^22t+\\sin^22t=1$이므로 $s^2=20-16\\cos2t$이다.\n$-1\\le\\cos2t\\le1$에서 $s^2$의 최댓값은 $\\cos2t=-1$일 때 $20+16=36$이고, 이때 $M=\\sqrt{36}=6$이다.\n$s^2$의 최솟값은 $\\cos2t=1$일 때 $20-16=4$이고, 이때 $m=\\sqrt4=2$이다.\n따라서 $M+m=6+2=8$이다.\n따라서 정답은 ①이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-091",
    "problemTypeKey": "PT_DERIVATIVE_MOTION",
    "templateKey": "TPL_MOTION_EVENT_ANALYSIS",
    "crossConceptKeys": [
      "CC_TRIGONOMETRIC_EXTREMUM",
      "CC_TRIGONOMETRIC_IDENTITY"
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
    "content": "시각 $t$ ($0<t<\\frac\\pi2$)에서 점 $\\mathrm P$의 위치가 $(4t+4\\sin t\\cos t,\\,2\\tan t)$이다. 속력의 최솟값을 구하여라.",
    "choices": [
      "$2\\sqrt2$",
      "$2\\sqrt3$",
      "$4\\sqrt2$",
      "$6$",
      "$2\\sqrt{10}$"
    ],
    "answer": "③",
    "solution": "$x(t)=4t+4\\sin t\\cos t=4t+2\\sin2t$로 고치면 곱과 합성함수의 미분법으로 $x'(t)=4+4\\cos2t$이다.\n$\\cos2t=2\\cos^2t-1$이므로 $x'(t)=4+4(2\\cos^2t-1)=8\\cos^2t$이다.\n탄젠트의 미분법으로 $y'(t)=2\\sec^2t=\\frac2{\\cos^2t}$이다.\n따라서 속력의 제곱은 $s^2=(8\\cos^2t)^2+\\left(\\frac2{\\cos^2t}\\right)^2=64\\cos^4t+\\frac4{\\cos^4t}$이다.\n$u=\\cos^2t$라 하면 $0<t<\\frac\\pi2$에서 $0<u<1$이고 $s^2=64u^2+\\frac4{u^2}$이다.\n산술평균과 기하평균의 관계로 $s^2\\ge2\\sqrt{64u^2\\cdot\\frac4{u^2}}=2\\sqrt{256}=32$이다.\n등호는 $64u^2=\\frac4{u^2}$에서 $u^4=\\frac1{16}$, 즉 $u^2=\\frac14$이므로 $u=\\frac12$일 때 성립한다.\n이때 $\\cos^2t=\\frac12$인 $t=\\frac\\pi4$가 구간 안에 있으므로 최솟값은 $\\sqrt{32}=4\\sqrt2$이다.\n따라서 정답은 ③이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "low",
    "difficultyBoundaryFlag": "B45",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-091",
    "problemTypeKey": "PT_DERIVATIVE_MOTION",
    "templateKey": "TPL_MOTION_EVENT_ANALYSIS",
    "crossConceptKeys": [
      "CC_TRIGONOMETRIC_IDENTITY",
      "CC_DERIVATIVE_SIGN_EXTREMA_ANALYSIS"
    ],
    "conditionKeys": [
      "COND_RESTRICTED_INTERVAL"
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
    "content": "시각 $t$ ($t>0$)에서 점 $\\mathrm P$의 위치가 $(8\\sqrt{2t},\\,2t^2+\\frac2t)$이다. 속력이 $t=a$에서 최솟값 $m$을 가질 때, $am$을 구하여라.",
    "choices": [
      "$4$",
      "$6$",
      "$8$",
      "$10$",
      "$12$"
    ],
    "answer": "②",
    "solution": "$x(t)=8\\sqrt{2t}=8\\sqrt2 t^{1/2}$를 거듭제곱의 미분법으로 미분하면 $x'(t)=4\\sqrt2 t^{-1/2}$이다.\n$y(t)=2t^2+\\frac2t$를 미분하면 $y'(t)=4t-2t^{-2}$이다.\n속력의 제곱은 $s^2=\\left(4\\sqrt2 t^{-1/2}\\right)^2+\\left(4t-2t^{-2}\\right)^2$이다.\n계산하면 $s^2=\\frac{32}{t}+16t^2-\\frac{16}{t}+\\frac4{t^4}=16t^2+\\frac{16}{t}+\\frac4{t^4}$이다.\n이를 완전제곱식으로 보면 $s^2=\\left(4t+\\frac2{t^2}\\right)^2$이다.\n$t>0$이므로 $4t+\\frac2{t^2}>0$이고 $s(t)=4t+\\frac2{t^2}$이다.\n미분하면 $s'(t)=4-\\frac4{t^3}=\\frac{4(t^3-1)}{t^3}$이다.\n$0<t<1$에서 $s'(t)<0$, $t>1$에서 $s'(t)>0$이므로 $t=1$에서 속력이 최소이다.\n따라서 $a=1$, $m=s(1)=4+2=6$이고 $am=1\\cdot6=6$이다.\n따라서 정답은 ②이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "low",
    "difficultyBoundaryFlag": "B45",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-091",
    "problemTypeKey": "PT_DERIVATIVE_MOTION",
    "templateKey": "TPL_MOTION_EVENT_ANALYSIS",
    "crossConceptKeys": [
      "CC_DERIVATIVE_SIGN_EXTREMA_ANALYSIS",
      "CC_RADICAL_FUNCTION"
    ],
    "conditionKeys": [
      "COND_POSITIVE"
    ],
    "integrationPattern": "SEQUENTIAL"
  }
];
