window.examTitle = "미적분II_149_음함수의미분법_고2_유형은행1";

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
    "content": "곡선 $5x^2+2y^2=20$ 위의 점에서 $\\frac{dy}{dx}$를 구하시오. (단, $y\\ne0$)",
    "choices": [
      "$-\\frac{2x}{5y}$",
      "$-\\frac{5x}{2y}$",
      "$\\frac{5x}{2y}$",
      "$\\frac{2x}{5y}$",
      "$-\\frac{5x}{4y}$"
    ],
    "answer": "②",
    "solution": "$5x^2+2y^2=20$의 양변을 $x$에 대하여 미분하면 (음함수의 미분법) $10x+4y\\frac{dy}{dx}=0$이다.\n$x$만 있는 항을 이항하면 $4y\\frac{dy}{dx}=-10x$이다.\n$y\\ne0$이므로 양변을 $4y$로 나누면 $\\frac{dy}{dx}=-\\frac{10x}{4y}$이다.\n분자와 분모를 $2$로 약분하면 $\\frac{dy}{dx}=-\\frac{5x}{2y}$이다.\n따라서 정답은 ②이다.",
    "difficultyBucket": 1,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "B12",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-081",
    "problemTypeKey": "PT_DERIVATIVE_RULE_EVALUATION",
    "templateKey": "TPL_DERIVATIVE_RULE_CALCULATION",
    "crossConceptKeys": [],
    "conditionKeys": [
      "COND_NONZERO"
    ],
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
    "content": "$x>0$, $y>0$인 부분에서 $2\\sqrt{x}+3\\sqrt{y}=12$로 주어진 음함수의 $\\frac{dy}{dx}$는?",
    "choices": [
      "$-\\frac32\\sqrt{\\frac{y}{x}}$",
      "$-\\frac23\\sqrt{\\frac{y}{x}}$",
      "$-\\frac23\\sqrt{\\frac{x}{y}}$",
      "$\\frac23\\sqrt{\\frac{y}{x}}$",
      "$\\frac32\\sqrt{\\frac{x}{y}}$"
    ],
    "answer": "②",
    "solution": "$2\\sqrt{x}+3\\sqrt{y}=12$의 양변을 $x$에 대하여 미분하면 (합성함수의 미분법) $2\\cdot\\frac{1}{2\\sqrt{x}}+3\\cdot\\frac{1}{2\\sqrt{y}}\\frac{dy}{dx}=0$이다.\n각 항을 정리하면 $\\frac{1}{\\sqrt{x}}+\\frac{3}{2\\sqrt{y}}\\frac{dy}{dx}=0$이다.\n$\\frac{1}{\\sqrt{x}}$를 우변으로 이항하면 $\\frac{3}{2\\sqrt{y}}\\frac{dy}{dx}=-\\frac{1}{\\sqrt{x}}$이다.\n양변에 $\\frac{2\\sqrt{y}}{3}$을 곱하면 $\\frac{dy}{dx}=-\\frac{2\\sqrt{y}}{3\\sqrt{x}}$이다.\n근호를 정리하면 $\\frac{dy}{dx}=-\\frac{2}{3}\\sqrt{\\frac{y}{x}}$이다.\n따라서 정답은 ②이다.",
    "difficultyBucket": 1,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "B12",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-081",
    "problemTypeKey": "PT_DERIVATIVE_RULE_EVALUATION",
    "templateKey": "TPL_DERIVATIVE_RULE_CALCULATION",
    "crossConceptKeys": [
      "CC_RADICAL_FUNCTION"
    ],
    "conditionKeys": [
      "COND_POSITIVE"
    ],
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
    "content": "곡선 $2x^2+y^2=e^{x+2y}$에서 $\\frac{dy}{dx}$를 구하시오. (단, $2y\\ne2e^{x+2y}$)",
    "choices": [
      "$\\frac{e^{x+2y}-4x}{2y-2e^{x+2y}}$",
      "$\\frac{e^{x+2y}-4x}{2y+2e^{x+2y}}$",
      "$\\frac{e^{x+2y}+4x}{2y-2e^{x+2y}}$",
      "$\\frac{4x-e^{x+2y}}{2y-2e^{x+2y}}$",
      "$\\frac{4x-e^{x+2y}}{2y+2e^{x+2y}}$"
    ],
    "answer": "①",
    "solution": "$2x^2+y^2=e^{x+2y}$의 양변을 $x$에 대하여 미분하면 (음함수의 미분법, 합성함수의 미분법) $4x+2y\\frac{dy}{dx}=e^{x+2y}\\left(1+2\\frac{dy}{dx}\\right)$이다.\n우변의 괄호를 풀면 $4x+2y\\frac{dy}{dx}=e^{x+2y}+2e^{x+2y}\\frac{dy}{dx}$이다.\n$\\frac{dy}{dx}$가 있는 항을 좌변으로 모으면 $2y\\frac{dy}{dx}-2e^{x+2y}\\frac{dy}{dx}=e^{x+2y}-4x$이다.\n좌변을 묶으면 $\\left(2y-2e^{x+2y}\\right)\\frac{dy}{dx}=e^{x+2y}-4x$이다.\n$2y\\ne2e^{x+2y}$이므로 양변을 $2y-2e^{x+2y}$로 나눌 수 있다.\n따라서 $\\frac{dy}{dx}=\\frac{e^{x+2y}-4x}{2y-2e^{x+2y}}$이다.\n따라서 정답은 ①이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "B12",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-081",
    "problemTypeKey": "PT_DERIVATIVE_RULE_EVALUATION",
    "templateKey": "TPL_DERIVATIVE_RULE_CALCULATION",
    "crossConceptKeys": [
      "CC_FUNCTION_COMPOSITION"
    ],
    "conditionKeys": [
      "COND_NONZERO"
    ],
    "integrationPattern": "NONE"
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
    "content": "$x>0$, $y>0$이고 $x^{2y}=y^{3x}$일 때, $\\frac{dy}{dx}$는? (단, $2y\\ln x\\ne 3x$)",
    "choices": [
      "$\\frac{x(3x\\ln y-2y)}{y(2y\\ln x-3x)}$",
      "$\\frac{y(2y\\ln x-3x)}{x(3x\\ln y-2y)}$",
      "$\\frac{y(3x\\ln y-2y)}{x(2y\\ln x-3x)}$",
      "$\\frac{y(3x\\ln y+2y)}{x(2y\\ln x-3x)}$",
      "$\\frac{y(3x\\ln y-2y)}{x(2y\\ln x+3x)}$"
    ],
    "answer": "③",
    "solution": "$x^{2y}=y^{3x}$의 양변에 자연로그를 취하면 (로그의 성질) $2y\\ln x=3x\\ln y$이다.\n양변을 $x$에 대하여 미분하면 (곱의 미분법, 합성함수의 미분법) $2\\frac{dy}{dx}\\ln x+2y\\cdot\\frac{1}{x}=3\\ln y+3x\\cdot\\frac{1}{y}\\frac{dy}{dx}$이다.\n정리하면 $2\\ln x\\frac{dy}{dx}+\\frac{2y}{x}=3\\ln y+\\frac{3x}{y}\\frac{dy}{dx}$이다.\n$\\frac{dy}{dx}$가 있는 항을 좌변으로 모으면 $\\left(2\\ln x-\\frac{3x}{y}\\right)\\frac{dy}{dx}=3\\ln y-\\frac{2y}{x}$이다.\n좌변의 계수를 통분하면 $2\\ln x-\\frac{3x}{y}=\\frac{2y\\ln x-3x}{y}$이다.\n우변을 통분하면 $3\\ln y-\\frac{2y}{x}=\\frac{3x\\ln y-2y}{x}$이다.\n따라서 $\\frac{2y\\ln x-3x}{y}\\frac{dy}{dx}=\\frac{3x\\ln y-2y}{x}$이다.\n$2y\\ln x\\ne3x$이고 $x>0$이므로 양변에 $\\frac{y}{2y\\ln x-3x}$를 곱하면 $\\frac{dy}{dx}=\\frac{y(3x\\ln y-2y)}{x(2y\\ln x-3x)}$이다.\n따라서 정답은 ③이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-081",
    "problemTypeKey": "PT_DERIVATIVE_RULE_EVALUATION",
    "templateKey": "TPL_DERIVATIVE_RULE_CALCULATION",
    "crossConceptKeys": [
      "CC_FUNCTION_COMPOSITION"
    ],
    "conditionKeys": [
      "COND_POSITIVE",
      "COND_NONZERO"
    ],
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
    "content": "다음 각 식에서 $y$는 $x$의 미분가능한 함수이고, 제시된 분모는 모두 $0$이 아니다. $\\frac{dy}{dx}$가 옳지 않은 것은?",
    "choices": [
      "$xy=12\\ \\Rightarrow\\ \\frac{dy}{dx}=-\\frac{y}{x}$",
      "$x^2+2xy+y^3=7\\ \\Rightarrow\\ \\frac{dy}{dx}=-\\frac{2x+2y}{2x+3y^2}$",
      "$4x^2+y^2=9\\ \\Rightarrow\\ \\frac{dy}{dx}=-\\frac{4x}{y}$",
      "$y^2=x^2+4y-3\\ \\Rightarrow\\ \\frac{dy}{dx}=\\frac{x}{y+2}$",
      "$3xy+x-y=4\\ \\Rightarrow\\ \\frac{dy}{dx}=-\\frac{3y+1}{3x-1}$"
    ],
    "answer": "④",
    "solution": "(i) $xy=12$의 양변을 미분하면 (곱의 미분법) $y+x\\frac{dy}{dx}=0$이므로 $\\frac{dy}{dx}=-\\frac{y}{x}$이다. 따라서 ①은 옳다.\n(ii) $x^2+2xy+y^3=7$의 양변을 미분하면 (곱의 미분법, 합성함수의 미분법) $2x+2y+2x\\frac{dy}{dx}+3y^2\\frac{dy}{dx}=0$이다.\n(ii) $\\frac{dy}{dx}$를 묶으면 $(2x+3y^2)\\frac{dy}{dx}=-(2x+2y)$이므로 $\\frac{dy}{dx}=-\\frac{2x+2y}{2x+3y^2}$이다. 따라서 ②는 옳다.\n(iii) $4x^2+y^2=9$의 양변을 미분하면 $8x+2y\\frac{dy}{dx}=0$이므로 $\\frac{dy}{dx}=-\\frac{4x}{y}$이다. 따라서 ③은 옳다.\n(iv) $y^2=x^2+4y-3$의 양변을 미분하면 $2y\\frac{dy}{dx}=2x+4\\frac{dy}{dx}$이다.\n(iv) $\\frac{dy}{dx}$를 좌변으로 모으면 $(2y-4)\\frac{dy}{dx}=2x$이므로 $\\frac{dy}{dx}=\\frac{x}{y-2}$이다.\n(iv) 제시된 $\\frac{x}{y+2}$와 다르므로 ④는 옳지 않다.\n주의: ④에서 $4\\frac{dy}{dx}$를 좌변으로 옮기면 분모가 $y-2$가 되고 $y+2$가 아니다.\n(v) $3xy+x-y=4$의 양변을 미분하면 (곱의 미분법) $3y+3x\\frac{dy}{dx}+1-\\frac{dy}{dx}=0$이다.\n(v) $\\frac{dy}{dx}$를 묶으면 $(3x-1)\\frac{dy}{dx}=-(3y+1)$이므로 $\\frac{dy}{dx}=-\\frac{3y+1}{3x-1}$이다. 따라서 ⑤는 옳다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-081",
    "problemTypeKey": "PT_DERIVATIVE_RULE_EVALUATION",
    "templateKey": "TPL_DERIVATIVE_RULE_CALCULATION",
    "crossConceptKeys": [
      "CC_POLYNOMIAL_DERIVATIVE_RULE"
    ],
    "conditionKeys": [
      "COND_NONZERO"
    ],
    "integrationPattern": "CASE_BRANCH"
  }
];
