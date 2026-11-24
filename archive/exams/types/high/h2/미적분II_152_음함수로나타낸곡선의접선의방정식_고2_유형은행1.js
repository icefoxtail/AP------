window.examTitle = "미적분II_152_음함수로나타낸곡선의접선의방정식_고2_유형은행1";

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
    "content": "곡선 $2x+xy+y^2=16$ 위의 점 $(3,2)$에서의 접선이 $y=ax+b$일 때, $ab$의 값은?",
    "choices": [
      "$-\\frac{130}{49}$",
      "$-\\frac{120}{49}$",
      "$-\\frac{112}{49}$",
      "$-\\frac{104}{49}$",
      "$-\\frac{96}{49}$"
    ],
    "answer": "④",
    "solution": "음함수 $2x+xy+y^2=16$의 양변을 $x$에 대해 미분한다(곱의 미분법, 합성함수의 미분법).\n$2+(y+xy')+2yy'=0$이다.\n$y'$가 있는 항을 모으면 $(x+2y)y'=-(2+y)$이다.\n접점 $(3,2)$에서 $x+2y=3+4=7$, $2+y=4$이므로 $y'=-\\frac47$이다.\n접선은 $y-2=-\\frac47(x-3)$이다.\n분배하면 $y=-\\frac47x+\\frac{12}7+\\frac{14}7=-\\frac47x+\\frac{26}7$이므로 $a=-\\frac47$, $b=\\frac{26}7$이다.\n따라서 $ab=\\left(-\\frac47\\right)\\cdot\\frac{26}7=-\\frac{104}{49}$이다.\n따라서 정답은 ④이다.",
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
    "content": "곡선 $2x^2-xy+y^2=11$ 위의 점 $(2,-1)$에서의 접선이 $y$축과 만나는 점이 $(0,k)$일 때, $k$의 값은?",
    "choices": [
      "$-\\frac{15}2$",
      "$-\\frac{13}2$",
      "$-\\frac{11}2$",
      "$-\\frac92$",
      "$-\\frac72$"
    ],
    "answer": "③",
    "solution": "$2x^2-xy+y^2=11$의 양변을 미분한다(곱의 미분법, 합성함수의 미분법).\n$4x-(y+xy')+2yy'=0$이다.\n정리하면 $(2y-x)y'=y-4x$이다.\n$(2,-1)$에서 $2y-x=-2-2=-4$, $y-4x=-1-8=-9$이므로 $y'=\\frac{-9}{-4}=\\frac94$이다.\n접선은 $y+1=\\frac94(x-2)$이다.\n$x=0$을 대입하면 $k+1=\\frac94\\cdot(-2)=-\\frac92$이다.\n따라서 $k=-\\frac92-1=-\\frac{11}2$이다.\n따라서 정답은 ③이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-081",
    "problemTypeKey": "PT_DERIVATIVE_RULE_EVALUATION",
    "templateKey": "TPL_DERIVATIVE_RULE_CALCULATION",
    "crossConceptKeys": [
      "CC_AXIS_INTERCEPT"
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
    "content": "곡선 $y^2=4x^3$ 위의 점 $(1,2)$에서의 접선을 $\\ell$이라 하자. 점 $(0,1)$에서 직선 $\\ell$까지의 거리는?",
    "choices": [
      "$\\frac{2\\sqrt6}{10}$",
      "$\\frac{2\\sqrt8}{10}$",
      "$\\frac{2\\sqrt{10}}{10}$",
      "$\\frac{2\\sqrt{11}}{10}$",
      "$\\frac{2\\sqrt{13}}{10}$"
    ],
    "answer": "③",
    "solution": "$y^2=4x^3$의 양변을 미분한다(합성함수의 미분법).\n$2yy'=12x^2$이다.\n$(1,2)$에서 $4y'=12$이므로 $y'=3$이다.\n접선 $\\ell$은 $y-2=3(x-1)$, 즉 $3x-y-1=0$이다.\n점과 직선 사이의 거리 공식으로 $(0,1)$까지의 거리를 구하면 $\\frac{|3\\cdot0-1-1|}{\\sqrt{3^2+(-1)^2}}$이다.\n분자는 $|-2|=2$, 분모는 $\\sqrt{10}$이다.\n유리화하면 $\\frac2{\\sqrt{10}}=\\frac{2\\sqrt{10}}{10}$이다.\n따라서 정답은 ③이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-081",
    "problemTypeKey": "PT_DERIVATIVE_RULE_EVALUATION",
    "templateKey": "TPL_DERIVATIVE_RULE_CALCULATION",
    "crossConceptKeys": [
      "CC_POINT_LINE_DISTANCE"
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
    "content": "곡선 $\\sqrt{x}+\\sqrt{y}=3$ 위의 점 $(1,4)$에서의 접선이 $x$축, $y$축과 만나는 점을 각각 $A$, $B$라 하자. 원점을 $O$라 할 때, 삼각형 $OAB$의 넓이는? [그림: 제1사분면에서 $(0,9)$와 $(9,0)$을 잇는 곡선 $y=(3-\\sqrt{x})^2$를 그리고, $(1,4)$에서의 접선을 그려 두 축과 만나는 점에 각각 $A$, $B$를 표시한다. 삼각형 $OAB$의 내부를 옅게 색칠한다.]",
    "choices": [
      "$5$",
      "$6$",
      "$7$",
      "$8$",
      "$9$"
    ],
    "answer": "⑤",
    "solution": "$\\sqrt x+\\sqrt y=3$의 양변을 미분한다(합성함수의 미분법).\n$\\frac1{2\\sqrt x}+\\frac{y'}{2\\sqrt y}=0$이다.\n$(1,4)$에서 $\\frac12+\\frac{y'}4=0$이므로 $y'=-2$이다.\n접선은 $y-4=-2(x-1)$, 즉 $y=-2x+6$이다.\n$y=0$이면 $x=3$이므로 $A(3,0)$이고, $x=0$이면 $y=6$이므로 $B(0,6)$이다.\n두 축이 수직이므로 넓이는 $\\frac12\\cdot3\\cdot6=9$이다.\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-081",
    "problemTypeKey": "PT_DERIVATIVE_RULE_EVALUATION",
    "templateKey": "TPL_DERIVATIVE_RULE_CALCULATION",
    "crossConceptKeys": [
      "CC_RADICAL_FUNCTION",
      "CC_AXIS_INTERCEPT"
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
    "content": "곡선 $3x^2+y^2-4xy-5=0$ 위의 점 $(2,1)$에서의 접선과 두 좌표축으로 둘러싸인 삼각형의 넓이는?",
    "choices": [
      "$\\frac{15}{24}$",
      "$\\frac{20}{24}$",
      "$\\frac{25}{24}$",
      "$\\frac{30}{24}$",
      "$\\frac{35}{24}$"
    ],
    "answer": "③",
    "solution": "$3x^2+y^2-4xy-5=0$의 양변을 미분한다(곱의 미분법, 합성함수의 미분법).\n$6x+2yy'-4(y+xy')=0$이다.\n정리하면 $(2y-4x)y'=4y-6x$이다.\n$(2,1)$에서 $2y-4x=2-8=-6$, $4y-6x=4-12=-8$이므로 $y'=\\frac{-8}{-6}=\\frac43$이다.\n접선은 $y-1=\\frac43(x-2)$, 즉 $y=\\frac43x-\\frac53$이다.\n$x$절편은 $0=\\frac43x-\\frac53$에서 $x=\\frac54$이고, $y$절편은 $-\\frac53$이다.\n주의: 넓이에는 절편의 절댓값을 써야 하므로 밑변 $\\frac54$, 높이 $\\frac53$이다.\n넓이는 $\\frac12\\cdot\\frac54\\cdot\\frac53=\\frac{25}{24}$이다.\n따라서 정답은 ③이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-081",
    "problemTypeKey": "PT_DERIVATIVE_RULE_EVALUATION",
    "templateKey": "TPL_DERIVATIVE_RULE_CALCULATION",
    "crossConceptKeys": [
      "CC_AXIS_INTERCEPT"
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
    "content": "곡선 $y^2=2\\ln x$ 위의 점 $(e^2,2)$에서의 접선과 두 좌표축으로 둘러싸인 삼각형의 넓이는?",
    "choices": [
      "$\\frac{9e^2}{4}$",
      "$\\frac{11e^2}{4}$",
      "$\\frac{13e^2}{4}$",
      "$\\frac{15e^2}{4}$",
      "$\\frac{17e^2}{4}$"
    ],
    "answer": "①",
    "solution": "$y^2=2\\ln x$의 양변을 미분한다(합성함수의 미분법, 로그함수의 미분법).\n$2yy'=\\frac2x$이다.\n$(e^2,2)$에서 $4y'=\\frac2{e^2}$이므로 $y'=\\frac1{2e^2}$이다.\n접선은 $y-2=\\frac1{2e^2}(x-e^2)$이다.\n정리하면 $y=\\frac{x}{2e^2}-\\frac12+2=\\frac{x}{2e^2}+\\frac32$이다.\n$x$절편은 $0=\\frac{x}{2e^2}+\\frac32$에서 $x=-3e^2$이고, $y$절편은 $\\frac32$이다.\n주의: $x$절편이 음수이므로 $x$축 위 밑변의 길이는 $|-3e^2|=3e^2$이다.\n넓이는 $\\frac12\\cdot3e^2\\cdot\\frac32=\\frac{9e^2}{4}$이다.\n따라서 정답은 ①이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-081",
    "problemTypeKey": "PT_DERIVATIVE_RULE_EVALUATION",
    "templateKey": "TPL_DERIVATIVE_RULE_CALCULATION",
    "crossConceptKeys": [
      "CC_LOGARITHMIC_FUNCTION_GRAPH",
      "CC_AXIS_INTERCEPT"
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
    "content": "곡선 $e^y\\ln x=3y+2$ 위의 점 $(e^2,0)$에서의 접선이 $y=ax+b$일 때, $ab$의 값은?",
    "choices": [
      "$-\\frac4{e^2}$",
      "$-\\frac3{e^2}$",
      "$-\\frac2{e^2}$",
      "$-\\frac1{e^2}$",
      "$\\frac1{e^2}$"
    ],
    "answer": "④",
    "solution": "$e^y\\ln x=3y+2$의 양변을 미분한다(곱의 미분법, 지수·로그함수의 미분법).\n$e^yy'\\ln x+e^y\\cdot\\frac1x=3y'$이다.\n$y'$ 항을 모으면 $(3-e^y\\ln x)y'=\\frac{e^y}{x}$이다.\n$(e^2,0)$에서 $3-1\\cdot2=1$, $\\frac{e^0}{e^2}=\\frac1{e^2}$이므로 $a=y'=\\frac1{e^2}$이다.\n접선은 $y-0=\\frac1{e^2}(x-e^2)$이다.\n정리하면 $y=\\frac{x}{e^2}-1$이므로 $b=-1$이다.\n따라서 $ab=\\frac1{e^2}\\cdot(-1)=-\\frac1{e^2}$이다.\n따라서 정답은 ④이다.",
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
    "content": "곡선 $e^x+2e^y=4$ 위의 점 $P(\\ln 2,0)$에서의 접선을 $\\ell_1$이라 하고, $P$를 지나면서 $\\ell_1$에 수직인 직선을 $\\ell_2$라 하자. 두 직선과 $y$축으로 둘러싸인 삼각형의 넓이는?",
    "choices": [
      "$(\\ln2)^2$",
      "$2(\\ln2)^2$",
      "$3(\\ln2)^2$",
      "$4(\\ln2)^2$",
      "$5(\\ln2)^2$"
    ],
    "answer": "①",
    "solution": "$e^x+2e^y=4$의 양변을 미분한다(합성함수의 미분법).\n$e^x+2e^yy'=0$이다.\n$P(\\ln2,0)$에서 $e^{\\ln2}=2$, $e^0=1$이므로 $2+2y'=0$, 즉 $m_1=-1$이다.\n$\\ell_1\\perp\\ell_2$이므로 $m_1m_2=-1$에서 $m_2=1$이다.\n$\\ell_1$은 $y=-(x-\\ln2)=-x+\\ln2$이다.\n$\\ell_2$는 $y=x-\\ln2$이다.\n두 직선의 $y$절편은 각각 $\\ln2$, $-\\ln2$이므로 $y$축 위 밑변의 길이는 $2\\ln2$이다.\n높이는 $P$에서 $y$축까지의 거리 $\\ln2$이다.\n넓이는 $\\frac12\\cdot2\\ln2\\cdot\\ln2=(\\ln2)^2$이다.\n따라서 정답은 ①이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-081",
    "problemTypeKey": "PT_DERIVATIVE_RULE_EVALUATION",
    "templateKey": "TPL_DERIVATIVE_RULE_CALCULATION",
    "crossConceptKeys": [
      "CC_EXPONENTIAL_FUNCTION_GRAPH",
      "CC_AXIS_INTERCEPT"
    ],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
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
    "content": "두 곡선 $y=x^2+1$과 $y^2-2y-4x=7$이 $x>1$인 부분에서 만나는 점을 $P$라 하자. $P$에서 두 곡선에 그은 접선이 $x$축과 만나는 점을 각각 $A$, $B$라 할 때, 삼각형 $PAB$의 넓이는?",
    "choices": [
      "$\\frac{165}{8}$",
      "$\\frac{175}{8}$",
      "$\\frac{185}{8}$",
      "$\\frac{195}{8}$",
      "$\\frac{205}{8}$"
    ],
    "answer": "②",
    "solution": "$y=x^2+1$을 둘째 식에 대입한다.\n$(x^2+1)^2-2(x^2+1)-4x=7$이다.\n전개하면 $x^4+2x^2+1-2x^2-2-4x-7=0$, 즉 $x^4-4x-8=0$이다.\n인수정리로 $x=2$를 확인하면 $16-8-8=0$이므로 $(x-2)(x^3+2x^2+4x+4)=0$이다.\n$x>1$에서 $x^3+2x^2+4x+4>0$이므로 $x=2$이고 $y=5$, 즉 $P(2,5)$이다.\n첫 곡선에서 $y'=2x$이므로 기울기는 $4$이다.\n첫 접선은 $y-5=4(x-2)$이고 $y=0$일 때 $0=4x-3$에서 $x=\\frac34$이다.\n둘째 곡선을 미분하면 $2yy'-2y'-4=0$이므로 $(2y-2)y'=4$이다.\n$P$에서 $y'=\\frac4{10-2}=\\frac12$이다.\n둘째 접선은 $y-5=\\frac12(x-2)$이고 $y=0$일 때 $x=-8$이다.\n밑변은 $\\frac34-(-8)=\\frac{35}4$, 높이는 $5$이다.\n넓이는 $\\frac12\\cdot\\frac{35}4\\cdot5=\\frac{175}8$이다.\n따라서 정답은 ②이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-081",
    "problemTypeKey": "PT_DERIVATIVE_RULE_EVALUATION",
    "templateKey": "TPL_DERIVATIVE_RULE_CALCULATION",
    "crossConceptKeys": [
      "CC_QUADRATIC_FUNCTION",
      "CC_GRAPH_INTERSECTION",
      "CC_AXIS_INTERCEPT"
    ],
    "conditionKeys": [
      "COND_RESTRICTED_INTERVAL"
    ],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 10,
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
    "content": "곡선 $xy^2=18$의 제1사분면 위에 점 $A_n(x_n,y_n)$이 있다. $A_n$에서의 접선의 $x$절편을 $x_{n+1}$로 정한다. $A_1=(2,3)$일 때 $\\sum_{n=1}^{\\infty}y_n$의 값은?",
    "choices": [
      "$\\frac{5+3\\sqrt3}{2}$",
      "$\\frac{6+3\\sqrt3}{2}$",
      "$\\frac{7+3\\sqrt3}{2}$",
      "$\\frac{8+3\\sqrt3}{2}$",
      "$\\frac{9+3\\sqrt3}{2}$"
    ],
    "answer": "⑤",
    "solution": "$xy^2=18$의 양변을 미분한다(곱의 미분법, 합성함수의 미분법).\n$y^2+2xyy'=0$이다.\n제1사분면에서 $y>0$이므로 $y'=-\\frac{y^2}{2xy}=-\\frac{y}{2x}$이다.\n$A_n$에서의 접선은 $y-y_n=-\\frac{y_n}{2x_n}(x-x_n)$이다.\n$y=0$을 대입하면 $-y_n=-\\frac{y_n}{2x_n}(x_{n+1}-x_n)$이다.\n양변을 $-\\frac{2x_n}{y_n}$로 나누면 $2x_n=x_{n+1}-x_n$이므로 $x_{n+1}=3x_n$이다.\n곡선 위의 점이므로 $x_{n+1}y_{n+1}^2=18=x_ny_n^2$이고, $3x_ny_{n+1}^2=x_ny_n^2$에서 $y_{n+1}^2=\\frac{y_n^2}3$이다.\n주의: 제1사분면이므로 $y_{n+1}=\\frac{y_n}{\\sqrt3}$인 양의 근을 택한다.\n$y_1=3$, 공비 $\\frac1{\\sqrt3}$인 등비수열이므로 등비급수의 합은 $\\frac3{1-1/\\sqrt3}$이다.\n분모를 정리하면 $\\frac{3\\sqrt3}{\\sqrt3-1}$이고, 분모를 유리화하면 $\\frac{3\\sqrt3(\\sqrt3+1)}{2}=\\frac{9+3\\sqrt3}{2}$이다.\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-081",
    "problemTypeKey": "PT_DERIVATIVE_RULE_EVALUATION",
    "templateKey": "TPL_DERIVATIVE_RULE_CALCULATION",
    "crossConceptKeys": [
      "CC_SERIES_SUM",
      "CC_GEOMETRIC_SEQUENCE",
      "CC_AXIS_INTERCEPT"
    ],
    "conditionKeys": [
      "COND_RANGE"
    ],
    "integrationPattern": "SEQUENTIAL"
  }
];
