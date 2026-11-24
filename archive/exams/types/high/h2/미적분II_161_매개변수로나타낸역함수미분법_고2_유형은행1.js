window.examTitle = "미적분II_161_매개변수로나타낸역함수미분법_고2_유형은행1";

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
    "content": "$t\\ge1$에서 $x=15t-4,\\ y=t^3+2t^2-16$으로 나타낸 함수 $y=f(x)$의 역함수를 $g$라 하자. $g'(0)$의 값은?",
    "choices": [
      "$\\frac{3}{8}$",
      "$\\frac{1}{2}$",
      "$\\frac{5}{8}$",
      "$\\frac{3}{4}$",
      "$\\frac{7}{8}$"
    ],
    "answer": "④",
    "solution": "$y=0$이 되는 $t$를 먼저 찾는다.\n$t^3+2t^2-16=0$에 $t=2$를 대입하면 $8+8-16=0$이다.\n인수분해하면 $(t-2)(t^2+4t+8)=0$이고, $t^2+4t+8=(t+2)^2+4>0$이므로 실수해는 $t=2$뿐이다.\n$t=2$일 때 $x=15\\cdot2-4=26$이므로 $f(26)=0$, 즉 $g(0)=26$이다.\n매개변수의 미분법으로 $\\frac{dy}{dx}=\\frac{dy/dt}{dx/dt}=\\frac{3t^2+4t}{15}$이다.\n$t=2$를 대입하면 $f'(26)=\\frac{3\\cdot4+4\\cdot2}{15}=\\frac{20}{15}=\\frac43$이다.\n역함수의 미분법 $g'(0)=\\frac1{f'(g(0))}$을 쓰면 $g'(0)=\\frac1{4/3}=\\frac34$이다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-082",
    "problemTypeKey": "PT_DERIVATIVE_RULE_EVALUATION",
    "templateKey": "TPL_DERIVATIVE_RULE_CALCULATION",
    "crossConceptKeys": [
      "CC_POLYNOMIAL_DERIVATIVE_RULE",
      "CC_DERIVATIVE_VALUE_EVALUATION"
    ],
    "conditionKeys": [
      "COND_RANGE"
    ],
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
    "content": "실수 $t$에 대해 $x=5t-2,\\ y=t^3+2t+4$로 나타낸 함수 $y=f(x)$의 역함수를 $g$라 하자. $g'(7)$의 값은?",
    "choices": [
      "$\\frac{3}{4}$",
      "$1$",
      "$\\frac{5}{4}$",
      "$\\frac{3}{2}$",
      "$\\frac{7}{4}$"
    ],
    "answer": "②",
    "solution": "$g'(7)$이므로 $f(x)=7$인 $x$를 찾는다.\n$t^3+2t+4=7$에서 $t^3+2t-3=0$이다.\n$t=1$을 대입하면 $1+2-3=0$이므로 $(t-1)(t^2+t+3)=0$으로 인수분해된다.\n$t^2+t+3=\\left(t+\\frac12\\right)^2+\\frac{11}{4}>0$이므로 실수해는 $t=1$뿐이다.\n$t=1$일 때 $x=5\\cdot1-2=3$이므로 $f(3)=7$, 즉 $g(7)=3$이다.\n매개변수의 미분법으로 $f'(3)=\\frac{dy/dt}{dx/dt}=\\frac{3t^2+2}{5}$이고, $t=1$에서 $\\frac{3+2}{5}=1$이다.\n역함수의 미분법으로 $g'(7)=\\frac1{f'(3)}=1$이다.\n따라서 정답은 ②이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-082",
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
    "content": "$t<0$에서 $x=3t+1,\\ y=-\\frac2t$로 나타낸 함수 $y=f(x)$의 역함수를 $g$라 하자. $g'(\\frac12)$의 값은?",
    "choices": [
      "$20$",
      "$24$",
      "$28$",
      "$32$",
      "$36$"
    ],
    "answer": "②",
    "solution": "$g'(\\frac12)$이므로 $f(x)=\\frac12$인 $x$를 찾는다.\n$-\\frac2t=\\frac12$의 양변에 $2t$를 곱하면 $-4=t$이고, 이는 $t<0$을 만족한다.\n이때 $x=3(-4)+1=-11$이므로 $f(-11)=\\frac12$, 즉 $g\\left(\\frac12\\right)=-11$이다.\n$\\frac{dy}{dt}=2t^{-2}=\\frac2{t^2}$, $\\frac{dx}{dt}=3$이다.\n$t=-4$에서 $\\frac{dy}{dt}=\\frac2{16}=\\frac18$이다.\n매개변수의 미분법으로 $f'(-11)=\\frac{dy/dt}{dx/dt}=\\frac{1/8}{3}=\\frac1{24}$이다.\n역함수의 미분법으로 $g'\\left(\\frac12\\right)=\\frac1{f'(-11)}=24$이다.\n따라서 정답은 ②이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-082",
    "problemTypeKey": "PT_DERIVATIVE_RULE_EVALUATION",
    "templateKey": "TPL_DERIVATIVE_RULE_CALCULATION",
    "crossConceptKeys": [
      "CC_RATIONAL_FUNCTION",
      "CC_DERIVATIVE_VALUE_EVALUATION"
    ],
    "conditionKeys": [
      "COND_NEGATIVE"
    ],
    "integrationPattern": "SEQUENTIAL"
  }
];
