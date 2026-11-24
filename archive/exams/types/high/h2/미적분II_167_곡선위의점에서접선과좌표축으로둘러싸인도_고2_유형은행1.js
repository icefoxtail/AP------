window.examTitle = "미적분II_167_곡선위의점에서접선과좌표축으로둘러싸인도_고2_유형은행1";

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
    "content": "$y=\\frac2{x-2}$ 위의 점 $(3,2)$에서의 접선과 두 좌표축이 둘러싸는 넓이는?",
    "choices": [
      "$16$",
      "$18$",
      "$20$",
      "$24$",
      "$32$"
    ],
    "answer": "①",
    "solution": "거듭제곱의 미분법으로 $y=2(x-2)^{-1}$에서 $y'=-2(x-2)^{-2}=-\\frac{2}{(x-2)^2}$이다.\n$x=3$에서 접선의 기울기는 $-\\frac{2}{(3-2)^2}=-2$이다.\n점-기울기 공식으로 $y-2=-2(x-3)$, 즉 $y=-2x+8$이다.\n$x=0$이면 $y=8$이고, $y=0$이면 $-2x+8=0$에서 $x=4$이다.\n두 좌표축과 이루는 삼각형의 넓이는 $\\frac12\\cdot4\\cdot8=16$이다.\n따라서 정답은 ①이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-083",
    "problemTypeKey": "PT_TANGENT_DERIVATIVE",
    "templateKey": "TPL_TANGENT_CONSTRUCTION",
    "crossConceptKeys": [
      "CC_DERIVATIVE_VALUE_EVALUATION"
    ],
    "conditionKeys": [],
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
    "content": "$y=2x+2\\cos x$ 위의 점 $(0,2)$에서의 접선과 두 좌표축이 둘러싸는 넓이는?",
    "choices": [
      "$1$",
      "$2$",
      "$3$",
      "$4$",
      "$5$"
    ],
    "answer": "①",
    "solution": "삼각함수의 미분법으로 $y'=2-2\\sin x$이다.\n$x=0$에서 접선의 기울기는 $2-2\\sin0=2$이다.\n점-기울기 공식으로 $y-2=2(x-0)$, 즉 $y=2x+2$이다.\n$x=0$이면 $y=2$이고, $y=0$이면 $2x+2=0$에서 $x=-1$이다.\n두 좌표축과 이루는 삼각형의 넓이는 $\\frac12\\cdot1\\cdot2=1$이다.\n따라서 정답은 ①이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-083",
    "problemTypeKey": "PT_TANGENT_DERIVATIVE",
    "templateKey": "TPL_TANGENT_CONSTRUCTION",
    "crossConceptKeys": [
      "CC_DERIVATIVE_VALUE_EVALUATION"
    ],
    "conditionKeys": [],
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
    "content": "곡선 $y=e^{kx}$가 점 $(-1,e^{-2})$를 지난다. 이 점에서 그은 접선이 두 좌표축과 만드는 삼각형의 넓이는?",
    "choices": [
      "$\\frac{5}{4e^2}$",
      "$\\frac7{4e^2}$",
      "$\\frac9{4e^2}$",
      "$\\frac{11}{4e^2}$",
      "$\\frac{13}{4e^2}$"
    ],
    "answer": "③",
    "solution": "곡선이 점 $(-1,e^{-2})$를 지나므로 $e^{-k}=e^{-2}$에서 $k=2$이다.\n합성함수의 미분법으로 $y=e^{2x}$에서 $y'=2e^{2x}$이다.\n$x=-1$에서 접선의 기울기는 $2e^{-2}$이다.\n점-기울기 공식으로 $y-e^{-2}=2e^{-2}(x+1)$, 즉 $y=e^{-2}(2x+3)$이다.\n$y=0$이면 $2x+3=0$에서 $x=-\\frac32$이고, $x=0$이면 $y=3e^{-2}$이다.\n삼각형의 넓이는 $\\frac12\\cdot\\frac32\\cdot\\frac{3}{e^2}=\\frac{9}{4e^2}$이다.\n따라서 정답은 ③이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-083",
    "problemTypeKey": "PT_TANGENT_DERIVATIVE",
    "templateKey": "TPL_TANGENT_CONSTRUCTION",
    "crossConceptKeys": [
      "CC_POINT_ON_CURVE_SUBSTITUTION",
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
    "content": "곡선 $y=e^{x-1}$ 위의 점 $(3,e^2)$에서의 접선과 두 좌표축이 둘러싸는 삼각형의 넓이는?",
    "choices": [
      "$e^2$",
      "$2e^2$",
      "$3e^2$",
      "$4e^2$",
      "$5e^2$"
    ],
    "answer": "②",
    "solution": "합성함수의 미분법으로 $y=e^{x-1}$에서 $y'=e^{x-1}$이다.\n$x=3$에서 접선의 기울기는 $e^{3-1}=e^2$이다.\n점-기울기 공식으로 $y-e^2=e^2(x-3)$, 즉 $y=e^2x-2e^2$이다.\n$x=0$이면 $y=-2e^2$이고, $y=0$이면 $e^2x=2e^2$에서 $x=2$이다.\n주의: $y$절편이 음수이므로 삼각형의 높이는 $|-2e^2|=2e^2$로 계산한다.\n넓이는 $\\frac12\\cdot2\\cdot2e^2=2e^2$이다.\n따라서 정답은 ②이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-083",
    "problemTypeKey": "PT_TANGENT_DERIVATIVE",
    "templateKey": "TPL_TANGENT_CONSTRUCTION",
    "crossConceptKeys": [
      "CC_DERIVATIVE_VALUE_EVALUATION"
    ],
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
    "content": "곡선 $y=2x\\ln x$ 위의 점 $(e,2e)$에서의 접선과 두 좌표축이 둘러싸는 넓이는?",
    "choices": [
      "$\\frac{e^2}8$",
      "$\\frac{e^2}4$",
      "$\\frac{e^2}3$",
      "$\\frac{e^2}2$",
      "$e^2$"
    ],
    "answer": "④",
    "solution": "곱의 미분법으로 $y'=2\\ln x+2x\\cdot\\frac1x=2\\ln x+2$이다.\n$x=e$에서 접선의 기울기는 $2\\ln e+2=2+2=4$이다.\n점-기울기 공식으로 $y-2e=4(x-e)$, 즉 $y=4x-2e$이다.\n$y=0$이면 $4x=2e$에서 $x=\\frac e2$이고, $x=0$이면 $y=-2e$이다.\n주의: $y$절편이 $-2e$이므로 삼각형의 높이는 $|-2e|=2e$이다.\n넓이는 $\\frac12\\cdot\\frac e2\\cdot2e=\\frac{e^2}{2}$이다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-083",
    "problemTypeKey": "PT_TANGENT_DERIVATIVE",
    "templateKey": "TPL_TANGENT_CONSTRUCTION",
    "crossConceptKeys": [
      "CC_DERIVATIVE_VALUE_EVALUATION"
    ],
    "conditionKeys": [],
    "integrationPattern": "NONE"
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
    "content": "$0<t<\\frac\\pi4$일 때, $y=\\sin(2x)$ 위의 점 $P(t,\\sin2t)$에서의 접선이 $x$축과 만나는 점을 $Q$라 하자. $\\lim_{t\\to0+}\\frac{\\overline{PQ}}t$의 값은?",
    "choices": [
      "$1$",
      "$\\sqrt2$",
      "$\\sqrt3$",
      "$2$",
      "$\\sqrt5$"
    ],
    "answer": "⑤",
    "solution": "합성함수의 미분법으로 접선의 기울기는 $m=2\\cos2t$이다.\n$Q$의 $x$좌표를 $q$라 하면 접선의 방정식은 $y-\\sin2t=2\\cos2t(x-t)$이다.\n$y=0$을 대입하면 $-\\sin2t=2\\cos2t(q-t)$이므로 $t-q=\\frac{\\sin2t}{2\\cos2t}$이다.\n$0<t<\\frac{\\pi}{4}$에서 $\\sin2t>0$, $\\cos2t>0$이므로 거리는 그대로 양수이다.\n점 $P$에서 $x$축에 내린 수선의 발을 $H$라 하면 $PH=\\sin2t$, $QH=t-q=\\frac{\\sin2t}{2\\cos2t}$이다.\n피타고라스 정리로 $\\overline{PQ}=\\sqrt{(\\sin2t)^2+\\left(\\frac{\\sin2t}{2\\cos2t}\\right)^2}$이다.\n이를 정리하면 $\\overline{PQ}=\\sin2t\\sqrt{1+\\frac{1}{4\\cos^2 2t}}$이다.\n따라서 $\\frac{\\overline{PQ}}{t}=\\frac{\\sin2t}{t}\\sqrt{1+\\frac{1}{4\\cos^2 2t}}$이다.\n삼각함수의 기본 극한 $\\lim_{x\\to0}\\frac{\\sin x}{x}=1$에서 $\\lim_{t\\to0+}\\frac{\\sin2t}{t}=2\\lim_{t\\to0+}\\frac{\\sin2t}{2t}=2$이다.\n코사인 함수의 연속성으로 $\\lim_{t\\to0+}\\cos2t=\\cos0=1$이다.\n따라서 극한은 $2\\sqrt{1+\\frac14}=2\\cdot\\frac{\\sqrt5}{2}=\\sqrt5$이다.\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-083",
    "problemTypeKey": "PT_TANGENT_DERIVATIVE",
    "templateKey": "TPL_TANGENT_CONSTRUCTION",
    "crossConceptKeys": [
      "CC_FUNCTION_LIMIT",
      "CC_DERIVATIVE_VALUE_EVALUATION"
    ],
    "conditionKeys": [
      "COND_RESTRICTED_INTERVAL"
    ],
    "integrationPattern": "SEQUENTIAL"
  }
];
