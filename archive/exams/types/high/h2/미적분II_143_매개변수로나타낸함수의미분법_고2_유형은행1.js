window.examTitle = "미적분II_143_매개변수로나타낸함수의미분법_고2_유형은행1";

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
    "content": "매개변수 $t$로 나타낸 함수 $x=t+\\frac2t$, $y=t^2+\\frac4{t^2}$에서 $t=-2$일 때, $\\frac{dy}{dx}$의 값은?",
    "choices": [
      "$-6$",
      "$-4$",
      "$-3$",
      "$3$",
      "$6$"
    ],
    "answer": "①",
    "solution": "매개변수 $x=t+\\frac{2}{t}$, $y=t^2+\\frac{4}{t^2}$를 거듭제곱의 미분법으로 각각 미분하면 $\\frac{dx}{dt}=1-\\frac{2}{t^2}$이다.\n같은 방법으로 $\\frac{dy}{dt}=2t-\\frac{8}{t^3}$이다.\n$t=-2$를 $\\frac{dx}{dt}$에 대입하면 $\\frac{dx}{dt}=1-\\frac{2}{(-2)^2}=1-\\frac{1}{2}=\\frac{1}{2}$이다.\n$t=-2$를 $\\frac{dy}{dt}$에 대입하면 $\\frac{dy}{dt}=2(-2)-\\frac{8}{(-2)^3}=-4-\\frac{8}{-8}=-4+1=-3$이다.\n매개변수 미분법 $\\frac{dy}{dx}=\\frac{dy/dt}{dx/dt}$를 적용하면 $\\frac{dy}{dx}=\\frac{-3}{1/2}=-3\\cdot2=-6$이다.\n따라서 정답은 ①이다.",
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
    "content": "매개변수 $t$로 나타낸 함수 $x=\\frac{2-t}{1+t^2}$, $y=\\frac{4t^2}{1+t^2}$에서 $t=1$일 때, $\\frac{dy}{dx}$의 값은?",
    "choices": [
      "$-3$",
      "$-2$",
      "$-1$",
      "$1$",
      "$2$"
    ],
    "answer": "②",
    "solution": "몫의 미분법으로 $\\frac{dx}{dt}=\\frac{-(1+t^2)-(2-t)\\cdot2t}{(1+t^2)^2}$이다.\n분자를 정리하면 $\\frac{dx}{dt}=\\frac{-1-t^2-4t+2t^2}{(1+t^2)^2}=\\frac{t^2-4t-1}{(1+t^2)^2}$이다.\n같은 방법으로 $\\frac{dy}{dt}=\\frac{8t(1+t^2)-4t^2\\cdot2t}{(1+t^2)^2}$이다.\n분자를 정리하면 $\\frac{dy}{dt}=\\frac{8t+8t^3-8t^3}{(1+t^2)^2}=\\frac{8t}{(1+t^2)^2}$이다.\n$t=1$을 대입하면 $\\frac{dx}{dt}=\\frac{1-4-1}{4}=-1$이고 $\\frac{dy}{dt}=\\frac{8}{4}=2$이다.\n매개변수 미분법으로 $\\frac{dy}{dx}=\\frac{2}{-1}=-2$이다.\n따라서 정답은 ②이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
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
    "content": "매개변수 $t$로 나타낸 곡선 $x=\\frac{2-4t}{1+t^2}$, $y=\\frac{3t}{1+t^2}$에 대하여 $\\lim_{t\\to\\infty}\\frac{dy}{dx}$의 값은?",
    "choices": [
      "$-\\frac43$",
      "$-\\frac54$",
      "$-\\frac45$",
      "$-\\frac34$",
      "$-\\frac12$"
    ],
    "answer": "④",
    "solution": "$x=\\frac{2-4t}{1+t^2}$을 몫의 미분법으로 미분하면 $\\frac{dx}{dt}=\\frac{-4(1+t^2)-(2-4t)\\cdot2t}{(1+t^2)^2}$이다.\n분자를 정리하면 $\\frac{dx}{dt}=\\frac{-4-4t^2-4t+8t^2}{(1+t^2)^2}=\\frac{4t^2-4t-4}{(1+t^2)^2}$이다.\n$y=\\frac{3t}{1+t^2}$을 몫의 미분법으로 미분하면 $\\frac{dy}{dt}=\\frac{3(1+t^2)-3t\\cdot2t}{(1+t^2)^2}$이다.\n분자를 정리하면 $\\frac{dy}{dt}=\\frac{3+3t^2-6t^2}{(1+t^2)^2}=\\frac{3-3t^2}{(1+t^2)^2}$이다.\n매개변수 미분법으로 공통 분모를 약분하면 $\\frac{dy}{dx}=\\frac{3-3t^2}{4t^2-4t-4}=\\frac{-3t^2+3}{4t^2-4t-4}$이다.\n분자와 분모를 $t^2$으로 나누면 $\\frac{dy}{dx}=\\frac{-3+3/t^2}{4-4/t-4/t^2}$이다.\n$t\\to\\infty$일 때 $1/t\\to0$, $1/t^2\\to0$이므로 극한의 몫 법칙으로 $\\lim_{t\\to\\infty}\\frac{dy}{dx}=\\frac{-3+0}{4-0-0}=-\\frac{3}{4}$이다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-080",
    "problemTypeKey": "PT_DERIVATIVE_RULE_EVALUATION",
    "templateKey": "TPL_DERIVATIVE_RULE_CALCULATION",
    "crossConceptKeys": [
      "CC_FUNCTION_LIMIT"
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
    "content": "매개변수 $t$로 나타낸 함수 $x=3t-2$, $y=t^2+2$에서 $t$를 소거하여 $y=f(x)$라 하자. $\\lim_{h\\to0}\\frac{f(1+3h)-f(1)}{h}$의 값은?",
    "choices": [
      "$2$",
      "$3$",
      "$4$",
      "$5$",
      "$6$"
    ],
    "answer": "①",
    "solution": "미분계수의 정의를 쓰기 위해 분모를 $3h$로 맞추면 $\\frac{f(1+3h)-f(1)}{h}=3\\cdot\\frac{f(1+3h)-f(1)}{3h}$이다.\n$h\\to0$이면 $3h\\to0$이므로 주어진 극한은 $3f'(1)$이다.\n매개변수 $x=3t-2$에서 $x=1$일 때 $3t-2=1$이므로 $t=1$이다.\n$y=t^2+2$와 $t=\\frac{x+2}{3}$에서 $f(x)=\\left(\\frac{x+2}{3}\\right)^2+2$이다.\n거듭제곱의 미분법으로 $\\frac{dx}{dt}=3$, $\\frac{dy}{dt}=2t$이다.\n매개변수 미분법으로 $f'(1)=\\frac{dy/dt}{dx/dt}=\\frac{2\\cdot1}{3}=\\frac{2}{3}$이다.\n따라서 주어진 극한은 $3f'(1)=3\\cdot\\frac{2}{3}=2$이다.\n주의: 구하는 값은 $f'(1)$이 아니라 $3f'(1)$이다.\n따라서 정답은 ①이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-080",
    "problemTypeKey": "PT_DERIVATIVE_RULE_EVALUATION",
    "templateKey": "TPL_DERIVATIVE_RULE_CALCULATION",
    "crossConceptKeys": [
      "CC_DERIVATIVE_DEFINITION_LIMIT",
      "CC_DIFFERENCE_QUOTIENT_SCALING"
    ],
    "conditionKeys": [],
    "integrationPattern": "REINTERPRETATION"
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
    "content": "매개변수 $t$로 나타낸 함수 $x=t+t^3+\\cdots+t^{39}$, $y=t^2+t^4+\\cdots+t^{40}$에 대하여 $\\lim_{t\\to1}\\frac{dy}{dx}$의 값은?",
    "choices": [
      "$\\frac{19}{20}$",
      "$\\frac{20}{21}$",
      "$\\frac{21}{20}$",
      "$\\frac{20}{19}$",
      "$\\frac{23}{20}$"
    ],
    "answer": "③",
    "solution": "$x=t+t^3+\\cdots+t^{39}$는 홀수 차수 $1,3,\\ldots,39$의 $20$개 항이므로 거듭제곱의 미분법으로 $\\frac{dx}{dt}=1+3t^2+\\cdots+39t^{38}$이다.\n$y=t^2+t^4+\\cdots+t^{40}$은 짝수 차수 $2,4,\\ldots,40$의 $20$개 항이므로 $\\frac{dy}{dt}=2t+4t^3+\\cdots+40t^{39}$이다.\n$t=1$을 대입하면 $\\frac{dx}{dt}=1+3+\\cdots+39$이고 $\\frac{dy}{dt}=2+4+\\cdots+40$이다.\n등차수열의 합 공식 $S_n=\\frac{n(a+l)}{2}$로 $1+3+\\cdots+39=\\frac{20(1+39)}{2}=400$이다.\n같은 공식으로 $2+4+\\cdots+40=\\frac{20(2+40)}{2}=420$이다.\n두 도함수가 $t=1$에서 연속이고 $\\frac{dx}{dt}(1)=400\\ne0$이므로 극한의 몫 법칙과 매개변수 미분법으로 $\\lim_{t\\to1}\\frac{dy}{dx}=\\frac{420}{400}=\\frac{21}{20}$이다.\n따라서 정답은 ③이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-080",
    "problemTypeKey": "PT_DERIVATIVE_RULE_EVALUATION",
    "templateKey": "TPL_DERIVATIVE_RULE_CALCULATION",
    "crossConceptKeys": [
      "CC_SERIES_SUM",
      "CC_FUNCTION_LIMIT"
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
    "content": "드론에서 떨어뜨린 보급 상자의 수평 위치 $x$와 지면으로부터의 높이 $y$가 낙하 시작 $t$초 후 $x=24t$, $y=80-5t^2$이다. 보급 상자가 지면에 닿는 순간 $\\frac{dy}{dx}$의 값은?",
    "choices": [
      "$-\\frac{11}{6}$",
      "$-\\frac53$",
      "$-\\frac32$",
      "$-\\frac43$",
      "$-\\frac76$"
    ],
    "answer": "②",
    "solution": "지면에 닿는 순간은 높이 $y=0$일 때이므로 $80-5t^2=0$이다.\n이를 정리하면 $5t^2=80$에서 $t^2=16$이고, 낙하 시작 후이므로 $t\\ge0$에서 $t=4$이다.\n거듭제곱의 미분법으로 $\\frac{dx}{dt}=24$이고 $\\frac{dy}{dt}=-10t$이다.\n$t=4$를 $\\frac{dy}{dt}$에 대입하면 $\\frac{dy}{dt}=-10\\cdot4=-40$이다.\n매개변수 미분법으로 $\\frac{dy}{dx}=\\frac{dy/dt}{dx/dt}=\\frac{-40}{24}$이다.\n분자와 분모를 $8$로 약분하면 $\\frac{dy}{dx}=-\\frac{5}{3}$이다.\n주의: 지면에 닿는 순간의 $t$는 $t=\\pm4$가 아니라 $t\\ge0$인 $t=4$이다.\n따라서 정답은 ②이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-080",
    "problemTypeKey": "PT_DERIVATIVE_RULE_EVALUATION",
    "templateKey": "TPL_DERIVATIVE_RULE_CALCULATION",
    "crossConceptKeys": [
      "CC_VELOCITY_FROM_POSITION_DERIVATIVE"
    ],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
  }
];
