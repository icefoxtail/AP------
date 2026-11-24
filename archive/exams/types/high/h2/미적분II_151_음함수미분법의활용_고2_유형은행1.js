window.examTitle = "미적분II_151_음함수미분법의활용_고2_유형은행1";

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
    "content": "평평한 지면에 높이 $8\\,\\mathrm{m}$인 깃대가 수직으로 서 있다. 눈높이가 $2\\,\\mathrm{m}$인 사람이 깃대에서 수평으로 $x\\,\\mathrm{m}$ 떨어져 있을 때, 깃대 꼭대기를 올려다보는 각을 $\\theta$라 하자. 각은 라디안으로 잰다. $x=8$일 때 $\\frac{d\\theta}{dx}$의 값은? [그림: 깃대 밑동과 사람의 발을 수평으로 연결해 $x\\,\\mathrm{m}$를 표시한다. 깃대 높이는 $8\\,\\mathrm{m}$, 눈높이는 $2\\,\\mathrm{m}$이고 눈에서 꼭대기로 향하는 선분과 눈높이 수평선이 이루는 각에 $\\theta$를 표시한다.]",
    "choices": [
      "$-\\frac3{25}$",
      "$-\\frac2{25}$",
      "$-\\frac3{50}$",
      "$-\\frac1{25}$",
      "$-\\frac1{50}$"
    ],
    "answer": "③",
    "solution": "깃대 꼭대기와 눈의 높이 차는 $8-2=6\\,\\mathrm{m}$이다.\n직각삼각형에서 탄젠트의 정의에 의해 $\\tan\\theta=\\frac{6}{x}$이다.\n합성함수의 미분법으로 양변을 $x$에 대하여 미분하면 $\\sec^2\\theta\\cdot\\frac{d\\theta}{dx}=-\\frac{6}{x^2}$이다.\n삼각함수의 기본 관계 $\\sec^2\\theta=1+\\tan^2\\theta$를 이용한다.\n$x=8$일 때 $\\tan\\theta=\\frac{6}{8}=\\frac{3}{4}$이므로 $\\sec^2\\theta=1+\\left(\\frac{3}{4}\\right)^2=1+\\frac{9}{16}=\\frac{25}{16}$이다.\n미분한 식에 $x=8$, $\\sec^2\\theta=\\frac{25}{16}$을 대입하면 $\\frac{25}{16}\\cdot\\frac{d\\theta}{dx}=-\\frac{6}{8^2}=-\\frac{6}{64}=-\\frac{3}{32}$이다.\n양변에 $\\frac{16}{25}$를 곱하면 $\\frac{d\\theta}{dx}=-\\frac{3}{32}\\cdot\\frac{16}{25}=-\\frac{3}{50}$이다.\n따라서 정답은 ③이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-081",
    "problemTypeKey": "PT_DERIVATIVE_RULE_EVALUATION",
    "templateKey": "TPL_DERIVATIVE_RULE_CALCULATION",
    "crossConceptKeys": [
      "CC_ELEVATION_ANGLE",
      "CC_TRIG_RATIO"
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
    "content": "길이가 $13\\,\\mathrm{m}$인 사다리가 수평인 지면과 수직인 벽에 걸쳐 있다. 사다리의 아래쪽 끝이 벽에서 $x\\,\\mathrm{m}$ 떨어져 있을 때 위쪽 끝의 높이를 $y\\,\\mathrm{m}$라 하자. $x=5$일 때 $\\frac{dy}{dx}$의 값은? [그림: 벽과 지면이 만나는 점을 직각의 꼭짓점으로 표시하고, 지면을 따라 길이가 $x\\,\\mathrm{m}$인 밑변과 벽을 따라 길이가 $y\\,\\mathrm{m}$인 높이를 그린다. 두 끝을 잇는 빗변에 사다리의 길이 $13\\,\\mathrm{m}$를 표시한다.]",
    "choices": [
      "$-\\frac{13}{12}$",
      "$-\\frac{11}{12}$",
      "$-\\frac9{12}$",
      "$-\\frac7{12}$",
      "$-\\frac5{12}$"
    ],
    "answer": "⑤",
    "solution": "피타고라스 정리에 의해 $x^2+y^2=13^2=169$이다.\n$x=5$일 때 $5^2+y^2=169$에서 $y^2=169-25=144$이고 $y>0$이므로 $y=12$이다.\n음함수 미분법으로 양변을 $x$에 대하여 미분하면 $2x+2y\\frac{dy}{dx}=0$이다.\n$x=5$, $y=12$를 대입하면 $2\\cdot5+2\\cdot12\\cdot\\frac{dy}{dx}=0$이다.\n$24\\frac{dy}{dx}=-10$에서 $\\frac{dy}{dx}=-\\frac{10}{24}=-\\frac{5}{12}$이다.\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "B12",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-081",
    "problemTypeKey": "PT_DERIVATIVE_RULE_EVALUATION",
    "templateKey": "TPL_DERIVATIVE_RULE_CALCULATION",
    "crossConceptKeys": [
      "CC_PYTHAGOREAN_THEOREM"
    ],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
  }
];
