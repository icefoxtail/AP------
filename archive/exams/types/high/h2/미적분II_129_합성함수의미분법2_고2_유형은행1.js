window.examTitle = "미적분II_129_합성함수의미분법2_고2_유형은행1";

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
    "content": "$f(x)=(x-1)/(x+2),\\ g(x)=x^2+4x-1$이다. $(f\\circ g)'(1)$의 값은?",
    "choices": [
      "$\\frac16$",
      "$\\frac13$",
      "$\\frac12$",
      "$\\frac23$",
      "$\\frac56$"
    ],
    "answer": "③",
    "solution": "합성함수의 미분법에 의해 $(f\\circ g)'(1)=f'(g(1))g'(1)$이다.\n$g(1)=1^2+4\\cdot1-1=4$이다.\n$g'(x)=2x+4$이므로 $g'(1)=2+4=6$이다.\n$f'(x)=\\frac{(x+2)-(x-1)}{(x+2)^2}=\\frac{3}{(x+2)^2}$이다.\n따라서 $f'(4)=\\frac{3}{6^2}=\\frac{3}{36}=\\frac1{12}$이다.\n그러므로 $(f\\circ g)'(1)=\\frac1{12}\\cdot6=\\frac12$이다.\n따라서 정답은 ③이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "B12",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-079",
    "problemTypeKey": "PT_DERIVATIVE_RULE_EVALUATION",
    "templateKey": "TPL_DERIVATIVE_RULE_CALCULATION",
    "crossConceptKeys": [
      "CC_RATIONAL_FUNCTION",
      "CC_POLYNOMIAL_DERIVATIVE_RULE"
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
    "content": "$f(x)=\\tan x,\\ g(x)=(2x+5)/(x+2)$이다. $(g\\circ f)'(\\pi/4)$의 값은?",
    "choices": [
      "$-\\frac49$",
      "$-\\frac39$",
      "$-\\frac29$",
      "$-\\frac19$",
      "$\\frac19$"
    ],
    "answer": "③",
    "solution": "합성함수의 미분법에 의해 $(g\\circ f)'(\\pi/4)=g'(f(\\pi/4))f'(\\pi/4)$이다.\n$f(\\pi/4)=\\tan\\frac{\\pi}{4}=1$이다.\n$f'(x)=\\sec^2x$이므로 $f'(\\pi/4)=(\\sqrt2)^2=2$이다.\n$g'(x)=\\frac{2(x+2)-(2x+5)}{(x+2)^2}=\\frac{-1}{(x+2)^2}$이다.\n따라서 $g'(1)=-\\frac1{3^2}=-\\frac19$이다.\n그러므로 $(g\\circ f)'(\\pi/4)=-\\frac19\\cdot2=-\\frac29$이다.\n따라서 정답은 ③이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-079",
    "problemTypeKey": "PT_DERIVATIVE_RULE_EVALUATION",
    "templateKey": "TPL_DERIVATIVE_RULE_CALCULATION",
    "crossConceptKeys": [
      "CC_TRIGONOMETRIC_TANGENT",
      "CC_RATIONAL_FUNCTION"
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
    "content": "$f(x)=\\ln(x-2),\\ g(x)=x^2+3x+3$일 때 $(f\\circ g)'(0)$의 값은?",
    "choices": [
      "$2$",
      "$3$",
      "$4$",
      "$5$",
      "$6$"
    ],
    "answer": "②",
    "solution": "합성함수의 미분법에 의해 $(f\\circ g)'(0)=f'(g(0))g'(0)$이다.\n$g(0)=0^2+3\\cdot0+3=3$이다.\n$g'(x)=2x+3$이므로 $g'(0)=3$이다.\n$f'(x)=\\frac{1}{x-2}$이므로 $f'(3)=\\frac{1}{3-2}=1$이다.\n따라서 $(f\\circ g)'(0)=1\\cdot3=3$이다.\n따라서 정답은 ②이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "B12",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-079",
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
    "content": "$g(x)=x^3-2x+4$이고 미분가능한 $f$에 대해 $(f\\circ g)'(0)=-14$일 때 $f'(4)$의 값은?",
    "choices": [
      "$4$",
      "$5$",
      "$6$",
      "$7$",
      "$8$"
    ],
    "answer": "④",
    "solution": "$g(0)=0^3-2\\cdot0+4=4$이다.\n$g'(x)=3x^2-2$이므로 $g'(0)=-2$이다.\n합성함수의 미분법에 의해 $(f\\circ g)'(0)=f'(g(0))g'(0)=f'(4)\\cdot(-2)$이다.\n주어진 값이 $-14$이므로 $-2f'(4)=-14$이다.\n양변을 $-2$로 나누면 $f'(4)=7$이다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-079",
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
    "content": "모든 실수에서 미분가능한 $f,g$에 대해 $f(g(x))=12x+7,\\ g(2)=3,\\ g'(2)=4$이다. $f(3)+f'(3)$의 값은?",
    "choices": [
      "$33$",
      "$34$",
      "$35$",
      "$36$",
      "$37$"
    ],
    "answer": "②",
    "solution": "$f(g(x))=12x+7$에 $x=2$를 대입하면 $f(g(2))=31$이다.\n$g(2)=3$이므로 $f(3)=31$이다.\n양변을 미분하면 합성함수의 미분법에 의해 $f'(g(x))g'(x)=12$이다.\n$x=2$를 대입하면 $f'(g(2))g'(2)=12$이다.\n$g(2)=3,\\ g'(2)=4$이므로 $f'(3)\\cdot4=12$에서 $f'(3)=3$이다.\n따라서 $f(3)+f'(3)=31+3=34$이다.\n따라서 정답은 ②이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-079",
    "problemTypeKey": "PT_DERIVATIVE_RULE_EVALUATION",
    "templateKey": "TPL_DERIVATIVE_RULE_CALCULATION",
    "crossConceptKeys": [
      "CC_DERIVATIVE_VALUE_EVALUATION"
    ],
    "conditionKeys": [
      "COND_UNIVERSAL_INPUTS"
    ],
    "integrationPattern": "INTERDEPENDENT"
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
    "content": "$h(x)=g(f(2x))$이고 $f(2)=5,\\ f'(2)=3,\\ h'(1)=30$이다. $g'(5)$의 값은?",
    "choices": [
      "$1$",
      "$2$",
      "$3$",
      "$4$",
      "$5$"
    ],
    "answer": "⑤",
    "solution": "$h(x)=g(f(2x))$를 미분하면 합성함수의 미분법에 의해 $h'(x)=g'(f(2x))\\cdot f'(2x)\\cdot2$이다.\n$x=1$을 대입하면 $h'(1)=g'(f(2))\\cdot f'(2)\\cdot2$이다.\n$f(2)=5,\\ f'(2)=3$이므로 $h'(1)=g'(5)\\cdot3\\cdot2=6g'(5)$이다.\n$h'(1)=30$이므로 $6g'(5)=30$이다.\n양변을 $6$으로 나누면 $g'(5)=5$이다.\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "B12",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-079",
    "problemTypeKey": "PT_DERIVATIVE_RULE_EVALUATION",
    "templateKey": "TPL_DERIVATIVE_RULE_CALCULATION",
    "crossConceptKeys": [
      "CC_DERIVATIVE_VALUE_EVALUATION"
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
    "content": "$f(x)=(3x+1)^2$이고 $h=g\\circ f$이다. $h'(1)=72$일 때 $g'(16)$의 값은?",
    "choices": [
      "$0$",
      "$1$",
      "$2$",
      "$3$",
      "$4$"
    ],
    "answer": "④",
    "solution": "$f(1)=(3\\cdot1+1)^2=4^2=16$이다.\n$f'(x)=2(3x+1)\\cdot3=6(3x+1)$이므로 $f'(1)=6\\cdot4=24$이다.\n$h=g\\circ f$이므로 합성함수의 미분법에 의해 $h'(1)=g'(f(1))f'(1)$이다.\n따라서 $h'(1)=g'(16)\\cdot24$이다.\n$h'(1)=72$이므로 $24g'(16)=72$이다.\n양변을 $24$로 나누면 $g'(16)=3$이다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "B12",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-079",
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
    "id": 8,
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
    "content": "$f(x)=x^2+2$이고 미분가능한 $g$가 $f(g(x))=f(x)g(x)+2x^2+4,\\ g(1)=4$를 만족한다. $g'(1)$의 값은?",
    "choices": [
      "$\\frac85$",
      "$\\frac95$",
      "$\\frac{10}5$",
      "$\\frac{11}5$",
      "$\\frac{12}5$"
    ],
    "answer": "⑤",
    "solution": "$f(g(x))=f(x)g(x)+2x^2+4$의 양변을 미분한다.\n좌변은 합성함수의 미분법에 의해 $f'(g(x))g'(x)$이다.\n$f'(x)=2x$이므로 좌변은 $2g(x)g'(x)$이다.\n우변은 곱의 미분법에 의해 $f'(x)g(x)+f(x)g'(x)+4x$이고, $f'(x)=2x$이므로 $2xg(x)+(x^2+2)g'(x)+4x$이다.\n$x=1$을 대입하면 좌변은 $2\\cdot4\\cdot g'(1)=8g'(1)$이다.\n우변은 $2\\cdot1\\cdot4+(1+2)g'(1)+4=8+3g'(1)+4$이다.\n따라서 $8g'(1)=3g'(1)+12$이다.\n$5g'(1)=12$이므로 $g'(1)=\\frac{12}{5}$이다.\n주의: 우변의 $2x^2+4$도 미분해야 한다.\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-079",
    "problemTypeKey": "PT_DERIVATIVE_RULE_EVALUATION",
    "templateKey": "TPL_DERIVATIVE_RULE_CALCULATION",
    "crossConceptKeys": [
      "CC_POLYNOMIAL_DERIVATIVE_RULE",
      "CC_DERIVATIVE_VALUE_EVALUATION"
    ],
    "conditionKeys": [],
    "integrationPattern": "INTERDEPENDENT"
  },
  {
    "id": 9,
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
    "content": "$f,g$는 아래 꺾은선 그래프로 주어진다. $(f\\circ g)'(1)$의 값은? [그림: 좌표평면에서 $y=f(x)$는 $(0,5),(2,1),(6,5)$를 순서대로 연결하고, $y=g(x)$는 $(0,2),(2,6),(6,2)$를 순서대로 연결한다. 각 꺾은선에 함수 이름을 표시한다.]",
    "choices": [
      "$-1$",
      "$0$",
      "$1$",
      "$2$",
      "$3$"
    ],
    "answer": "④",
    "solution": "$g$의 그래프는 $(0,2)$와 $(2,6)$을 잇는 선분이므로 $x=1$에서의 기울기는 $\\frac{6-2}{2-0}=2$이다.\n따라서 $g(1)=2+2\\cdot1=4$이고 $g'(1)=2$이다.\n합성함수의 미분법에 의해 $(f\\circ g)'(1)=f'(g(1))g'(1)=f'(4)\\cdot2$이다.\n$f$의 그래프에서 $x=4$는 $(2,1)$과 $(6,5)$를 잇는 선분 위에 있다.\n그 선분의 기울기는 $\\frac{5-1}{6-2}=\\frac44=1$이므로 $f'(4)=1$이다.\n따라서 $(f\\circ g)'(1)=1\\cdot2=2$이다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-079",
    "problemTypeKey": "PT_DERIVATIVE_RULE_EVALUATION",
    "templateKey": "TPL_DERIVATIVE_RULE_CALCULATION",
    "crossConceptKeys": [
      "CC_CONTINUOUS_FUNCTION_GRAPH_INTERPRETATION",
      "CC_AVERAGE_RATE_OF_CHANGE"
    ],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
  }
];
