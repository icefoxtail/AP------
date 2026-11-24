window.examTitle = "미적분II_173_함수y=eˣy=lnx의접선의방정식_고2_유형은행1";

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
    "content": "직선 $y=x+a$가 곡선 $y=e^{x-2}$에 접할 때 $a$는?",
    "choices": [
      "$-3$",
      "$-2$",
      "$-1$",
      "$0$",
      "$1$"
    ],
    "answer": "③",
    "solution": "접선의 기울기는 도함수이므로 지수함수·합성함수의 미분법에서 $y'=e^{x-2}$이다.\n직선 $y=x+a$의 기울기가 $1$이므로 $e^{x-2}=1=e^0$에서 $x-2=0$, 즉 $x=2$이다.\n접점의 $y$좌표는 $e^{2-2}=e^0=1$이다.\n접선은 점 $(2,1)$을 지나고 기울기가 $1$이므로 $y-1=1(x-2)$, 즉 $y=x-1$이다.\n직선 $y=x+a$와 비교하면 $a=-1$이다.\n따라서 정답은 ③이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "B12",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-083",
    "problemTypeKey": "PT_TANGENT_DERIVATIVE",
    "templateKey": "TPL_TANGENT_CONSTRUCTION",
    "crossConceptKeys": [
      "CC_EXPONENTIAL_FUNCTION_GRAPH"
    ],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
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
    "content": "직선 $y=x+a$가 곡선 $y=\\ln x+3$에 접할 때 $a$는?",
    "choices": [
      "$-1$",
      "$0$",
      "$1$",
      "$2$",
      "$3$"
    ],
    "answer": "④",
    "solution": "로그함수의 미분법에서 $y'=\\frac1x$이다.\n직선 $y=x+a$의 기울기가 $1$이므로 $\\frac1x=1$에서 $x=1$이다.\n접점의 $y$좌표는 $\\ln1+3=0+3=3$이다.\n접선은 점 $(1,3)$을 지나고 기울기가 $1$이므로 $y-3=1(x-1)$, 즉 $y=x+2$이다.\n$y=x+a$와 비교하면 $a=2$이다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "B12",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-083",
    "problemTypeKey": "PT_TANGENT_DERIVATIVE",
    "templateKey": "TPL_TANGENT_CONSTRUCTION",
    "crossConceptKeys": [
      "CC_LOGARITHMIC_FUNCTION_GRAPH"
    ],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
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
    "content": "원점에서 곡선 $y=3e^x$에 그은 접선의 방정식은?",
    "choices": [
      "$y=-ex$",
      "$y=\\frac xe$",
      "$y=ex$",
      "$y=2ex$",
      "$y=3ex$"
    ],
    "answer": "⑤",
    "solution": "접점을 $(t,3e^t)$라 하면 지수함수의 미분법에서 접선의 기울기는 $3e^t$이다.\n접선의 방정식은 $y-3e^t=3e^t(x-t)$, 즉 $y=3e^t x+3e^t(1-t)$이다.\n이 접선이 원점 $(0,0)$을 지나므로 $0=3e^t(1-t)$이다.\n$3e^t>0$이므로 $1-t=0$에서 $t=1$이다.\n이때 기울기는 $3e^1=3e$이고 $y$절편은 $0$이므로 접선은 $y=3ex$이다.\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-083",
    "problemTypeKey": "PT_TANGENT_DERIVATIVE",
    "templateKey": "TPL_TANGENT_CONSTRUCTION",
    "crossConceptKeys": [],
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
    "content": "원점에서 곡선 $y=2\\ln x$에 그은 접선의 방정식은?",
    "choices": [
      "$y=-\\frac{2x}e$",
      "$y=-\\frac xe$",
      "$y=\\frac{x}{2e}$",
      "$y=\\frac xe$",
      "$y=\\frac{2x}e$"
    ],
    "answer": "⑤",
    "solution": "접점을 $(t,2\\ln t)$라 하면 로그함수의 미분법에서 접선의 기울기는 $\\frac2t$이다.\n접선의 방정식은 $y-2\\ln t=\\frac2t(x-t)$, 즉 $y=\\frac2t x+2\\ln t-2$이다.\n원점 $(0,0)$을 지나므로 $0=2\\ln t-2$이다.\n양변을 $2$로 나누면 $\\ln t=1$이므로 $t=e$이다.\n기울기는 $\\frac2e$이고 $y$절편은 $0$이므로 접선은 $y=\\frac{2}{e}x$이다.\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-083",
    "problemTypeKey": "PT_TANGENT_DERIVATIVE",
    "templateKey": "TPL_TANGENT_CONSTRUCTION",
    "crossConceptKeys": [],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
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
    "content": "원점 $O$에서 서로 역함수 관계인 곡선 $y=2e^x$와 $y=\\ln(x/2)$에 각각 접선을 그어 접점을 $A,B$라 할 때, $\\triangle OAB$의 넓이는? [그림: 두 곡선과 대칭축 $y=x$를 그리고 $A(1,2e), B(2e,1)$을 원점과 이어 삼각형을 표시한다.]",
    "choices": [
      "$\\frac{4e^2-5}2$",
      "$\\frac{4e^2-3}2$",
      "$\\frac{4e^2-1}2$",
      "$\\frac{4e^2+1}2$",
      "$\\frac{4e^2+3}2$"
    ],
    "answer": "③",
    "solution": "$y=2e^x$ 위의 접점을 $(t,2e^t)$라 하면 지수함수의 미분법에서 기울기는 $2e^t$이다.\n접선은 $y-2e^t=2e^t(x-t)$, 즉 $y=2e^t x+2e^t(1-t)$이다.\n원점을 지나므로 $0=2e^t(1-t)$이고 $2e^t>0$에서 $t=1$이다.\n따라서 $A=(1,2e)$이고, 접선은 $y=2ex$이다.\n$y=2e^x$와 $y=\\ln(x/2)$는 서로 역함수이므로 그래프는 직선 $y=x$에 대하여 대칭이다.\n접선 $y=2ex$를 $y=x$에 대하여 대칭이동하면 $x=2ey$, 즉 $y=\\frac{x}{2e}$이다.\n점 $A(1,2e)$의 대칭점은 $B(2e,1)$이고, 이 점은 $y=\\ln(x/2)$ 위에 있다.\n삼각형 $OAB$의 넓이는 두 벡터의 행렬식(신발끈 공식)으로\n$$\\frac12\\left|1\\cdot1-(2e)(2e)\\right|=\\frac12|1-4e^2|$$\n이다.\n$e>1$이므로 $4e^2>1$이고, 넓이는 $\\frac{4e^2-1}{2}$이다.\n따라서 정답은 ③이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B45",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-083",
    "problemTypeKey": "PT_TANGENT_DERIVATIVE",
    "templateKey": "TPL_TANGENT_CONSTRUCTION",
    "crossConceptKeys": [
      "CC_INVERSE_GRAPH_SYMMETRY"
    ],
    "conditionKeys": [],
    "integrationPattern": "INTERDEPENDENT"
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
    "content": "곡선 $y=e^x+1$ 위의 점 $P$와 곡선 $y=\\ln(x-1)$ 위의 점 $Q$ 사이의 거리의 최솟값은?",
    "choices": [
      "$2\\sqrt2$",
      "$3\\sqrt2$",
      "$4\\sqrt2$",
      "$5\\sqrt2$",
      "$6\\sqrt2$"
    ],
    "answer": "①",
    "solution": "$P(x_1,y_1)$은 $y=e^x+1$ 위의 점, $Q(x_2,y_2)$는 $y=\\ln(x-1)$ 위의 점이라 하자.\n$h(x)=e^x+1-x$라 하면 지수함수의 미분법에서 $h'(x)=e^x-1$이다.\n$h'(x)$는 $x<0$에서 음수, $x>0$에서 양수이므로 $h$는 $x=0$에서 최소이고 $h(x)\\ge h(0)=1+1-0=2$이다.\n따라서 $y_1-x_1\\ge2$이고, 등호는 $P_0=(0,2)$에서 성립한다.\n$y=\\ln(x-1)$은 $y=e^x+1$의 역함수이므로 $y=x$ 대칭에 의해 $x_2-y_2\\ge2$이고, 등호는 $Q_0=(2,0)$에서 성립한다.\n$y_1-x_1-2=A\\ge0$, $x_2-y_2-2=B\\ge0$이라 놓으면 $y_1=x_1+2+A$, $y_2=x_2-2-B$이다.\n$z=x_1-x_2$라 하면\n$$PQ^2=z^2+(z+4+A+B)^2$$\n이다.\n제곱을 완성하면\n$$PQ^2=2\\left(z+\\frac{4+A+B}{2}\\right)^2+\\frac{(4+A+B)^2}{2}$$\n이므로 $PQ^2\\ge\\frac{(4+A+B)^2}{2}\\ge\\frac{4^2}{2}=8$이다.\n등호는 $A=B=0$, $z=-2$, 즉 $P=(0,2)$, $Q=(2,0)$일 때 성립한다.\n주의: 두 곡선이 역함수라서 대칭점끼리만 비교하면 안 되고, 임의의 두 점 사이 거리의 하한을 확인해야 한다.\n따라서 최솟값은 $\\sqrt8=2\\sqrt2$이다.\n따라서 정답은 ①이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B45",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-083",
    "problemTypeKey": "PT_TANGENT_DERIVATIVE",
    "templateKey": "TPL_TANGENT_CONSTRUCTION",
    "crossConceptKeys": [
      "CC_INVERSE_GRAPH_SYMMETRY"
    ],
    "conditionKeys": [],
    "integrationPattern": "REINTERPRETATION"
  }
];
