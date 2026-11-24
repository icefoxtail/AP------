window.examTitle = "미적분II_144_매개변수로나타낸지수함수의미분법_고2_유형은행1";

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
    "content": "매개변수 $t$로 나타낸 함수 $x=e^{2t-1}$, $y=e^{6t+1}$에서 $\\frac{dy}{dx}$를 $t$의 식으로 나타낸 것은?",
    "choices": [
      "$2e^{4t-2}$",
      "$3e^{4t-2}$",
      "$3e^{4t+1}$",
      "$2e^{4t+2}$",
      "$3e^{4t+2}$"
    ],
    "answer": "⑤",
    "solution": "매개변수 미분법 $\\frac{dy}{dx}=\\frac{dy/dt}{dx/dt}$를 쓰기 위해 각각을 $t$로 미분한다.\n합성함수의 미분법으로 $\\frac{dx}{dt}=e^{2t-1}\\cdot(2t-1)'=2e^{2t-1}$이다.\n같은 방법으로 $\\frac{dy}{dt}=e^{6t+1}\\cdot(6t+1)'=6e^{6t+1}$이다.\n따라서 $\\frac{dy}{dx}=\\frac{6e^{6t+1}}{2e^{2t-1}}$이다.\n지수법칙으로 약분하면 $\\frac{dy}{dx}=3e^{(6t+1)-(2t-1)}=3e^{4t+2}$이다.\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-080",
    "problemTypeKey": "PT_DERIVATIVE_RULE_EVALUATION",
    "templateKey": "TPL_DERIVATIVE_RULE_CALCULATION",
    "crossConceptKeys": [],
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
    "content": "매개변수 $t$로 나타낸 곡선 $x=e^{3t+6}$, $y=t^2+7t+1$에서 $x=1$인 점의 $\\frac{dy}{dx}$ 값은?",
    "choices": [
      "$\\frac13$",
      "$\\frac23$",
      "$1$",
      "$\\frac43$",
      "$\\frac53$"
    ],
    "answer": "③",
    "solution": "$x=1$이 되는 $t$를 먼저 구한다. $e^{3t+6}=1=e^0$이고 지수함수는 일대일이므로 $3t+6=0$, 즉 $t=-2$이다.\n합성함수의 미분법으로 $\\frac{dx}{dt}=e^{3t+6}\\cdot3=3e^{3t+6}$이다.\n거듭제곱의 미분법으로 $\\frac{dy}{dt}=2t+7$이다.\n$t=-2$를 대입하면 $\\frac{dx}{dt}=3e^0=3$, $\\frac{dy}{dt}=2(-2)+7=3$이다.\n매개변수 미분법으로 $\\frac{dy}{dx}=\\frac{3}{3}=1$이다.\n따라서 정답은 ③이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-080",
    "problemTypeKey": "PT_DERIVATIVE_RULE_EVALUATION",
    "templateKey": "TPL_DERIVATIVE_RULE_CALCULATION",
    "crossConceptKeys": [
      "CC_POINT_ON_CURVE_SUBSTITUTION"
    ],
    "conditionKeys": [],
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
    "content": "$t>-2$에서 매개변수 $t$로 나타낸 함수 $x=(t^2+2t+2)e^t$, $y=e^{4t}$에 대하여 $\\frac{dy}{dx}=\\frac{ae^{bt}}{(t+2)^d}$이다. 상수 $a$, $b$, $d$에 대하여 $a+2b+d$의 값은?",
    "choices": [
      "$12$",
      "$13$",
      "$14$",
      "$15$",
      "$16$"
    ],
    "answer": "①",
    "solution": "매개변수 미분법 $\\frac{dy}{dx}=\\frac{dy/dt}{dx/dt}$를 쓰기 위해 $\\frac{dx}{dt}$부터 구한다.\n곱의 미분법으로 $\\frac{dx}{dt}=(t^2+2t+2)'e^t+(t^2+2t+2)(e^t)'$이다.\n$(t^2+2t+2)'=2t+2$, $(e^t)'=e^t$이므로 $\\frac{dx}{dt}=(2t+2)e^t+(t^2+2t+2)e^t$이다.\n공통인수 $e^t$를 묶으면 $\\frac{dx}{dt}=(t^2+4t+4)e^t$이다.\n$t^2+4t+4=(t+2)^2$이므로 $\\frac{dx}{dt}=(t+2)^2e^t$이다.\n합성함수의 미분법으로 $\\frac{dy}{dt}=e^{4t}\\cdot4=4e^{4t}$이다.\n$t>-2$이므로 $t+2\\neq0$, 즉 $\\frac{dx}{dt}\\neq0$이어서 매개변수 미분법을 쓸 수 있다.\n$\\frac{dy}{dx}=\\frac{4e^{4t}}{(t+2)^2e^t}$에서 지수법칙으로 약분하면 $\\frac{dy}{dx}=\\frac{4e^{4t-t}}{(t+2)^2}=\\frac{4e^{3t}}{(t+2)^2}$이다.\n주어진 $\\frac{ae^{bt}}{(t+2)^d}$와 비교하면 $a=4$, $b=3$, $d=2$이다.\n$a+2b+d=4+2\\cdot3+2=12$이다.\n주의: $e^{4t}$를 $e^t$로 나눌 때 지수는 $4t-t=3t$이며, $a$는 $e^t$의 계수 $4$이다.\n따라서 정답은 ①이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-080",
    "problemTypeKey": "PT_DERIVATIVE_RULE_EVALUATION",
    "templateKey": "TPL_DERIVATIVE_RULE_CALCULATION",
    "crossConceptKeys": [],
    "conditionKeys": [
      "COND_LOWER_BOUND"
    ],
    "integrationPattern": "SEQUENTIAL"
  }
];
