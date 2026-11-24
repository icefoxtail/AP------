window.examTitle = "미적분II_146_매개변수로나타낸곡선에서의접선의미지수구_고2_유형은행1";

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
    "content": "매개변수 $t$로 나타낸 함수 $x=t^3$, $y=2t^2-at+a^2$에서 $t=2$에 대응하는 점에서 접선의 기울기가 $-\\frac12$일 때, 상수 $a$의 값은?",
    "choices": [
      "$10$",
      "$12$",
      "$14$",
      "$16$",
      "$18$"
    ],
    "answer": "③",
    "solution": "매개변수 미분법에 필요한 도함수를 구한다. 거듭제곱의 미분법으로 $\\frac{dx}{dt}=3t^2$이다.\n같은 방법으로 $\\frac{dy}{dt}=4t-a$이다.\n$t=2$를 각 도함수에 대입하면 $\\frac{dx}{dt}=3\\cdot2^2=12$이고 $\\frac{dy}{dt}=4\\cdot2-a=8-a$이다.\n매개변수 미분법 $\\frac{dy}{dx}=\\frac{dy/dt}{dx/dt}$와 기울기 조건을 적용하면 $\\frac{8-a}{12}=-\\frac12$이다.\n양변에 $12$를 곱하면 $8-a=-6$이다.\n$a$에 대하여 풀면 $a=8+6=14$이다.\n따라서 정답은 ③이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "B12",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-080",
    "problemTypeKey": "PT_DERIVATIVE_RULE_EVALUATION",
    "templateKey": "TPL_DERIVATIVE_RULE_CALCULATION",
    "crossConceptKeys": [
      "CC_POLYNOMIAL_DERIVATIVE_RULE",
      "CC_DERIVATIVE_VALUE_EVALUATION"
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
    "content": "$t>0$에서 매개변수 $t$로 나타낸 곡선 $x=2+t^2$, $y=t^3-5t$ 위의 점 $P(a,b)$에서 접선의 기울기가 $-1$일 때, $a-b$의 값은?",
    "choices": [
      "$3$",
      "$5$",
      "$7$",
      "$9$",
      "$11$"
    ],
    "answer": "③",
    "solution": "거듭제곱의 미분법으로 $\\frac{dx}{dt}=2t$, $\\frac{dy}{dt}=3t^2-5$이다.\n매개변수 미분법으로 접선의 기울기는 $\\frac{dy}{dx}=\\frac{3t^2-5}{2t}$이다.\n기울기 조건에서 $\\frac{3t^2-5}{2t}=-1$이고, $t>0$이므로 $2t\\ne0$이다.\n양변에 $2t$를 곱하면 $3t^2-5=-2t$이다.\n이항하여 정리하면 $3t^2+2t-5=0$이다.\n인수분해하면 $(3t+5)(t-1)=0$이므로 $t=1$ 또는 $t=-\\frac53$이다.\n조건 $t>0$에서 $t=1$이다.\n$t=1$을 좌표식에 대입하면 $a=2+1^2=3$, $b=1^3-5\\cdot1=-4$이다.\n따라서 $a-b=3-(-4)=7$이다.\n따라서 정답은 ③이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-080",
    "problemTypeKey": "PT_DERIVATIVE_RULE_EVALUATION",
    "templateKey": "TPL_DERIVATIVE_RULE_CALCULATION",
    "crossConceptKeys": [
      "CC_POLYNOMIAL_DERIVATIVE_RULE"
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
    "content": "매개변수 $t$로 나타낸 함수 $x=t^2+2\\sin t$, $y=e^{2t}+at$에서 $t=0$일 때 $\\frac{dy}{dx}=4$이다. 상수 $a$의 값은?",
    "choices": [
      "$3$",
      "$4$",
      "$5$",
      "$6$",
      "$7$"
    ],
    "answer": "④",
    "solution": "거듭제곱과 삼각함수의 미분법으로 $\\frac{dx}{dt}=2t+2\\cos t$이다.\n지수함수와 합성함수의 미분법으로 $\\frac{dy}{dt}=2e^{2t}+a$이다.\n$t=0$을 대입하면 $\\frac{dx}{dt}=2\\cdot0+2\\cdot1=2$이다.\n같은 대입으로 $\\frac{dy}{dt}=2e^0+a=2+a$이다.\n매개변수 미분법과 $\\frac{dy}{dx}=4$ 조건으로 $\\frac{2+a}{2}=4$이다.\n양변에 $2$를 곱하면 $2+a=8$이다.\n$a=8-2=6$이다.\n따라서 정답은 ④이다.",
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
    "content": "매개변수 $t$로 나타낸 곡선 $x=t^2-at+3$, $y=t^3+2at^2-at$에서 $t=1$에 대응하는 점의 접선이 $x$축의 양의 방향과 이루는 각이 $\\frac\\pi4$이다. 상수 $a$의 값은?",
    "choices": [
      "$-\\frac14$",
      "$-\\frac18$",
      "$\\frac18$",
      "$\\frac14$",
      "$\\frac12$"
    ],
    "answer": "①",
    "solution": "접선이 $x$축의 양의 방향과 이루는 각이 $\\frac\\pi4$이므로 기울기는 $m=\\tan\\frac\\pi4=1$이다.\n거듭제곱의 미분법으로 $\\frac{dx}{dt}=2t-a$이다.\n같은 법으로 $\\frac{dy}{dt}=3t^2+4at-a$이다.\n$t=1$을 대입하면 $\\frac{dx}{dt}=2-a$이다.\n같은 대입으로 $\\frac{dy}{dt}=3\\cdot1^2+4a\\cdot1-a=3+3a$이다.\n주의: $\\frac{dx}{dt}=2-a=0$인 $a=2$이면 접선이 수직이 되어 기울기가 $1$일 수 없다.\n매개변수 미분법으로 $\\frac{dy}{dx}=\\frac{3+3a}{2-a}$이고 이것이 $1$이다.\n양변에 $2-a$를 곱하면 $3+3a=2-a$이다.\n이항하면 $3a+a=2-3$, 즉 $4a=-1$이다.\n$a=-\\frac14$이고 이는 $a\\ne2$를 만족한다.\n따라서 정답은 ①이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-080",
    "problemTypeKey": "PT_DERIVATIVE_RULE_EVALUATION",
    "templateKey": "TPL_DERIVATIVE_RULE_CALCULATION",
    "crossConceptKeys": [
      "CC_LINE_SLOPE_TANGENT",
      "CC_POLYNOMIAL_DERIVATIVE_RULE"
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
    "content": "$0<t<2\\pi$에서 움직이는 점의 좌표가 $x=2(t-\\sin t)$, $y=4+4\\cos t$이다. 이 점이 그리는 곡선에서 접선의 기울기가 $2$인 점의 $x$좌표는?",
    "choices": [
      "$3\\pi+1$",
      "$3\\pi+2$",
      "$3\\pi+3$",
      "$3\\pi+4$",
      "$3\\pi+5$"
    ],
    "answer": "②",
    "solution": "삼각함수의 미분법으로 $\\frac{dx}{dt}=2(1-\\cos t)$이다.\n같은 법으로 $\\frac{dy}{dt}=-4\\sin t$이다.\n$0<t<2\\pi$에서 $\\cos t<1$이므로 $\\frac{dx}{dt}=2(1-\\cos t)\\ne0$이다.\n매개변수 미분법으로 기울기는 $\\frac{dy}{dx}=\\frac{-4\\sin t}{2(1-\\cos t)}=\\frac{-2\\sin t}{1-\\cos t}$이다.\n기울기 조건에서 $\\frac{-2\\sin t}{1-\\cos t}=2$이다.\n양변에 $1-\\cos t$를 곱하면 $-2\\sin t=2(1-\\cos t)$이다.\n양변을 $2$로 나누면 $-\\sin t=1-\\cos t$이다.\n반각공식 $\\sin t=2\\sin\\frac t2\\cos\\frac t2$, $1-\\cos t=2\\sin^2\\frac t2$를 대입하면 $-2\\sin\\frac t2\\cos\\frac t2=2\\sin^2\\frac t2$이다.\n$0<\\frac t2<\\pi$에서 $\\sin\\frac t2>0$이므로 양변을 $2\\sin\\frac t2$로 나눌 수 있다.\n나누면 $-\\cos\\frac t2=\\sin\\frac t2$, 즉 $\\tan\\frac t2=-1$이다.\n$\\frac t2$가 제2사분면의 각이므로 $\\frac t2=\\frac{3\\pi}4$이고 $t=\\frac{3\\pi}2$이다.\n$t=\\frac{3\\pi}2$를 $x$의 식에 대입하면 $x=2\\left(\\frac{3\\pi}2-\\sin\\frac{3\\pi}2\\right)=2\\left(\\frac{3\\pi}2+1\\right)=3\\pi+2$이다.\n따라서 정답은 ②이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-080",
    "problemTypeKey": "PT_DERIVATIVE_RULE_EVALUATION",
    "templateKey": "TPL_DERIVATIVE_RULE_CALCULATION",
    "crossConceptKeys": [
      "CC_TRIGONOMETRIC_EQUATION"
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
    "content": "$t>0$에서 점의 좌표가 $x=3t+2$, $y=t+\\frac{16}{t}$이다. 이 점이 그리는 곡선 위의 점 $(a,b)$에서 접선의 기울기가 $-1$일 때, $a+b$의 값은?",
    "choices": [
      "$14$",
      "$15$",
      "$16$",
      "$17$",
      "$18$"
    ],
    "answer": "⑤",
    "solution": "일차함수의 미분법으로 $\\frac{dx}{dt}=3$이다.\n거듭제곱의 미분법으로 $\\frac{dy}{dt}=1-16t^{-2}=1-\\frac{16}{t^2}$이다.\n매개변수 미분법으로 기울기는 $\\frac{dy}{dx}=\\frac{1-16/t^2}{3}$이다.\n기울기 조건에서 $\\frac{1-16/t^2}{3}=-1$이다.\n양변에 $3$을 곱하면 $1-\\frac{16}{t^2}=-3$이다.\n이항하면 $\\frac{16}{t^2}=4$이고 $t^2=4$이다.\n$t>0$이므로 $t=2$이다.\n좌표식에 대입하면 $a=3\\cdot2+2=8$, $b=2+\\frac{16}{2}=2+8=10$이다.\n따라서 $a+b=8+10=18$이다.\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-080",
    "problemTypeKey": "PT_DERIVATIVE_RULE_EVALUATION",
    "templateKey": "TPL_DERIVATIVE_RULE_CALCULATION",
    "crossConceptKeys": [
      "CC_RATIONAL_FUNCTION",
      "CC_DERIVATIVE_VALUE_EVALUATION"
    ],
    "conditionKeys": [
      "COND_POSITIVE"
    ],
    "integrationPattern": "SEQUENTIAL"
  }
];
