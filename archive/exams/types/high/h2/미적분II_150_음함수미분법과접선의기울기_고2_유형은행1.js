window.examTitle = "미적분II_150_음함수미분법과접선의기울기_고2_유형은행1";

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
    "content": "곡선 $x^3+xy+y^3=11$ 위의 점 $(2,1)$에서 접선의 기울기는?",
    "choices": [
      "$-\\frac{14}{5}$",
      "$-\\frac{13}{5}$",
      "$-\\frac{12}{5}$",
      "$-\\frac{11}{5}$",
      "$-\\frac{9}{5}$"
    ],
    "answer": "②",
    "solution": "$y'=\\frac{dy}{dx}$로 놓는다.\n양변 $x^3+xy+y^3=11$을 $x$에 대하여 미분하면 거듭제곱의 미분법, 곱의 미분법, 합성함수의 미분법에 의하여 $3x^2+y+xy'+3y^2y'=0$이다.\n$y'$가 들어 있는 항만 좌변에 모으면 $xy'+3y^2y'=-(3x^2+y)$이다.\n$y'$로 묶으면 $(x+3y^2)y'=-(3x^2+y)$이다.\n점 $(2,1)$에서 $x=2,\\ y=1$을 대입하면 $(2+3\\cdot1^2)y'=-(3\\cdot2^2+1)$이다.\n각 항을 계산하면 $(2+3)y'=-(12+1)$이므로 $5y'=-13$이다.\n양변을 $5$로 나누면 $y'=-\\frac{13}{5}$이다.\n따라서 정답은 ②이다.",
    "difficultyBucket": 1,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "B12",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-081",
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
    "content": "곡선 $x^3-y^3+2xy+3=0$ 위의 점 $(1,2)$에서 접선의 기울기는?",
    "choices": [
      "$\\frac{3}{10}$",
      "$\\frac{5}{10}$",
      "$\\frac{7}{10}$",
      "$\\frac{9}{10}$",
      "$\\frac{11}{10}$"
    ],
    "answer": "③",
    "solution": "$y'=\\frac{dy}{dx}$로 놓는다.\n양변 $x^3-y^3+2xy+3=0$을 $x$에 대하여 미분하면 거듭제곱의 미분법과 곱의 미분법, 합성함수의 미분법에 의하여 $3x^2-3y^2y'+2y+2xy'=0$이다.\n$y'$가 들어 있는 항을 우변으로 옮기면 $3x^2+2y=3y^2y'-2xy'$이다.\n우변을 $y'$로 묶으면 $3x^2+2y=(3y^2-2x)y'$이다.\n점 $(1,2)$에서 $x=1,\\ y=2$를 대입하면 $3\\cdot1^2+2\\cdot2=(3\\cdot2^2-2\\cdot1)y'$이다.\n계산하면 $3+4=(12-2)y'$이므로 $7=10y'$이다.\n양변을 $10$으로 나누면 $y'=\\frac{7}{10}$이다.\n따라서 정답은 ③이다.",
    "difficultyBucket": 1,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "B12",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-081",
    "problemTypeKey": "PT_DERIVATIVE_RULE_EVALUATION",
    "templateKey": "TPL_DERIVATIVE_RULE_CALCULATION",
    "crossConceptKeys": [],
    "conditionKeys": [],
    "integrationPattern": "NONE"
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
    "content": "곡선 $2x^3-xy^2=6$ 위의 점 $(3,4)$에서 접선의 기울기를 $m$이라 하자. $36m$의 값은?",
    "choices": [
      "$51$",
      "$57$",
      "$60$",
      "$63$",
      "$69$"
    ],
    "answer": "②",
    "solution": "$y'=\\frac{dy}{dx}$로 놓고 $2x^3-xy^2=6$의 양변을 미분한다.\n거듭제곱의 미분법으로 $2x^3$을 미분하면 $6x^2$이다.\n곱의 미분법과 합성함수의 미분법으로 $xy^2$을 미분하면 $y^2+2xyy'$이다.\n따라서 $6x^2-(y^2+2xyy')=0$이다.\n괄호를 풀면 $6x^2-y^2-2xyy'=0$이고, $y'$ 항을 정리하면 $2xyy'=6x^2-y^2$이다.\n점 $(3,4)$에서 $x=3,\\ y=4,\\ y'=m$을 대입하면 $2\\cdot3\\cdot4\\cdot m=6\\cdot3^2-4^2$이다.\n계산하면 $24m=54-16=38$이므로 $m=\\frac{38}{24}=\\frac{19}{12}$이다.\n구하는 값은 $36m=36\\cdot\\frac{19}{12}=3\\cdot19=57$이다.\n따라서 정답은 ②이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "B12",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-081",
    "problemTypeKey": "PT_DERIVATIVE_RULE_EVALUATION",
    "templateKey": "TPL_DERIVATIVE_RULE_CALCULATION",
    "crossConceptKeys": [],
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
    "content": "곡선 $\\frac{\\pi}{4}x=y+\\sin(xy)$ 위의 점 $(2,\\frac{\\pi}{2})$에서 접선의 기울기는?",
    "choices": [
      "$-\\frac{7\\pi}{4}$",
      "$-\\frac{3\\pi}{2}$",
      "$-\\frac{5\\pi}{4}$",
      "$-\\pi$",
      "$-\\frac{3\\pi}{4}$"
    ],
    "answer": "⑤",
    "solution": "$y'=\\frac{dy}{dx}$로 놓고 $\\frac{\\pi}{4}x=y+\\sin(xy)$의 양변을 미분한다.\n$x$의 미분은 $\\frac{\\pi}{4}$이고, $\\sin(xy)$는 합성함수의 미분법과 곱의 미분법에 의하여 $\\cos(xy)\\cdot(y+xy')$이다.\n따라서 $\\frac{\\pi}{4}=y'+\\cos(xy)(y+xy')$이다.\n점 $(2,\\frac{\\pi}{2})$에서 $xy=2\\cdot\\frac{\\pi}{2}=\\pi$이므로 $\\cos(xy)=\\cos\\pi=-1$이다.\n$x=2,\\ y=\\frac{\\pi}{2},\\ \\cos(xy)=-1$을 대입하면 $\\frac{\\pi}{4}=y'-\\left(\\frac{\\pi}{2}+2y'\\right)$이다.\n괄호를 풀면 $\\frac{\\pi}{4}=y'-\\frac{\\pi}{2}-2y'=-y'-\\frac{\\pi}{2}$이다.\n$-y'$를 좌변으로 옮기면 $y'=-\\frac{\\pi}{4}-\\frac{\\pi}{2}=-\\frac{3\\pi}{4}$이다.\n주의: $\\cos(xy)=-1$이므로 괄호를 풀 때 부호가 바뀐다.\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-081",
    "problemTypeKey": "PT_DERIVATIVE_RULE_EVALUATION",
    "templateKey": "TPL_DERIVATIVE_RULE_CALCULATION",
    "crossConceptKeys": [
      "CC_FUNCTION_COMPOSITION"
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
    "content": "곡선 $e^{2x}\\ln y=2$ 위의 점 $(0,e^2)$에서 접선의 기울기는?",
    "choices": [
      "$-5e^2$",
      "$-4e^2$",
      "$-3e^2$",
      "$-2e^2$",
      "$-e^2$"
    ],
    "answer": "②",
    "solution": "$y'=\\frac{dy}{dx}$로 놓고 $e^{2x}\\ln y=2$의 양변을 미분한다.\n지수함수의 미분법과 합성함수의 미분법에 의하여 $(e^{2x})'=2e^{2x}$이다.\n로그함수의 미분법과 합성함수의 미분법에 의하여 $(\\ln y)'=\\frac{y'}{y}$이다.\n곱의 미분법을 적용하면 $2e^{2x}\\ln y+e^{2x}\\cdot\\frac{y'}{y}=0$이다.\n점 $(0,e^2)$에서 $x=0,\\ y=e^2$이므로 $e^{2x}=e^0=1$, $\\ln y=\\ln(e^2)=2$이다.\n대입하면 $2\\cdot1\\cdot2+1\\cdot\\frac{y'}{e^2}=0$이므로 $4+\\frac{y'}{e^2}=0$이다.\n$\\frac{y'}{e^2}=-4$이고 양변에 $e^2$을 곱하면 $y'=-4e^2$이다.\n따라서 정답은 ②이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-081",
    "problemTypeKey": "PT_DERIVATIVE_RULE_EVALUATION",
    "templateKey": "TPL_DERIVATIVE_RULE_CALCULATION",
    "crossConceptKeys": [
      "CC_FUNCTION_COMPOSITION"
    ],
    "conditionKeys": [],
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
    "content": "곡선 $y^2=\\ln(10-x^2)+2xy-5$ 위의 점 $(3,1)$에서 접선의 기울기는?",
    "choices": [
      "$1$",
      "$2$",
      "$3$",
      "$4$",
      "$5$"
    ],
    "answer": "①",
    "solution": "$y'=\\frac{dy}{dx}$로 놓고 $y^2=\\ln(10-x^2)+2xy-5$의 양변을 미분한다.\n합성함수의 미분법으로 좌변을 미분하면 $2yy'$이다.\n로그함수의 미분법과 합성함수의 미분법으로 $\\ln(10-x^2)$을 미분하면 $\\frac{-2x}{10-x^2}$이다.\n곱의 미분법으로 $2xy$를 미분하면 $2y+2xy'$이다.\n따라서 $2yy'=\\frac{-2x}{10-x^2}+2y+2xy'$이다.\n점 $(3,1)$에서 $x=3,\\ y=1$을 대입하면 $2\\cdot1\\cdot y'=\\frac{-2\\cdot3}{10-3^2}+2\\cdot1+2\\cdot3\\cdot y'$이다.\n분모와 분자를 계산하면 $2y'=\\frac{-6}{1}+2+6y'=-4+6y'$이다.\n$2y'$를 우변으로 옮기면 $0=-4+4y'$이므로 $4y'=4$이고 $y'=1$이다.\n따라서 정답은 ①이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-081",
    "problemTypeKey": "PT_DERIVATIVE_RULE_EVALUATION",
    "templateKey": "TPL_DERIVATIVE_RULE_CALCULATION",
    "crossConceptKeys": [
      "CC_FUNCTION_COMPOSITION"
    ],
    "conditionKeys": [],
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
    "content": "곡선 $3e^{x-1}\\ln(y+1)+2e^y\\ln x=0$ 위의 점 $(1,0)$에서 접선의 기울기는?",
    "choices": [
      "$-\\frac43$",
      "$-\\frac23$",
      "$-\\frac13$",
      "$\\frac13$",
      "$\\frac23$"
    ],
    "answer": "②",
    "solution": "$y'=\\frac{dy}{dx}$로 놓고 $3e^{x-1}\\ln(y+1)+2e^y\\ln x=0$의 양변을 미분한다.\n지수함수의 미분법과 합성함수의 미분법에 의하여 $(e^{x-1})'=e^{x-1}$, $(e^y)'=e^y y'$이다.\n로그함수의 미분법과 합성함수의 미분법에 의하여 $(\\ln(y+1))'=\\frac{y'}{y+1}$이다.\n첫째 항 $3e^{x-1}\\ln(y+1)$에 곱의 미분법을 적용하면 $3e^{x-1}\\ln(y+1)+3e^{x-1}\\cdot\\frac{y'}{y+1}$이다.\n둘째 항 $2e^y\\ln x$에 곱의 미분법을 적용하면 $2e^y y'\\ln x+2e^y\\cdot\\frac1x$이다.\n두 결과를 더하여 정리하면 $3e^{x-1}\\ln(y+1)+3e^{x-1}\\frac{y'}{y+1}+2e^y y'\\ln x+\\frac{2e^y}{x}=0$이다.\n점 $(1,0)$에서 $x=1,\\ y=0$이므로 $e^{x-1}=e^0=1$, $e^y=e^0=1$, $\\ln(y+1)=\\ln1=0$, $\\ln x=\\ln1=0$이다.\n대입하면 $0+3\\cdot1\\cdot\\frac{y'}{1}+0+\\frac{2\\cdot1}{1}=0$이므로 $3y'+2=0$이다.\n$2$를 이항하고 $3$으로 나누면 $y'=-\\frac23$이다.\n따라서 정답은 ②이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-081",
    "problemTypeKey": "PT_DERIVATIVE_RULE_EVALUATION",
    "templateKey": "TPL_DERIVATIVE_RULE_CALCULATION",
    "crossConceptKeys": [
      "CC_FUNCTION_COMPOSITION"
    ],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
  }
];
