window.examTitle = "미적분II_174_두접선이이루는예각의크기_고2_유형은행1";

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
    "content": "곡선 $y=\\frac{3x}{x+1}$ 위의 점 $(0,0)$과 $(2,2)$에서의 두 접선이 이루는 예각을 $\\theta$라 할 때, $3\\tan\\theta$는?",
    "choices": [
      "$4$",
      "$5$",
      "$6$",
      "$7$",
      "$8$"
    ],
    "answer": "①",
    "solution": "곡선 $y=\\frac{3x}{x+1}$에서 몫의 미분법을 쓰면 $y'=\\frac{3(x+1)-3x}{(x+1)^2}=\\frac{3}{(x+1)^2}$이다.\n$x=0$에서 접선의 기울기는 $m_1=\\frac{3}{1^2}=3$이다.\n$x=2$에서 접선의 기울기는 $m_2=\\frac{3}{3^2}=\\frac13$이다.\n두 직선이 이루는 예각 $\\theta$에 탄젠트의 뺄셈정리를 쓰면 $\\tan\\theta=\\left|\\frac{m_1-m_2}{1+m_1m_2}\\right|=\\frac{3-\\frac13}{1+3\\cdot\\frac13}$이다.\n분자를 계산하면 $3-\\frac13=\\frac83$, 분모는 $1+1=2$이므로 $\\tan\\theta=\\frac{\\frac83}{2}=\\frac43$이다.\n따라서 $3\\tan\\theta=3\\cdot\\frac43=4$이다.\n따라서 정답은 ①이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-084",
    "problemTypeKey": "PT_TANGENT_DERIVATIVE",
    "templateKey": "TPL_TANGENCY_RELATION_GEOMETRY",
    "crossConceptKeys": [
      "CC_DERIVATIVE_VALUE_EVALUATION"
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
    "content": "원점에서 $y=e^x+1$과 그 역함수 $y=\\ln(x-1)$에 그은 접선의 접점 중 지수곡선 위의 접점의 $x$좌표를 $t$라 하자. 두 접선이 이루는 예각 $\\theta$에 대해 $2\\tan\\theta$는?",
    "choices": [
      "$e^t-e^{-t}$",
      "$e^t$",
      "$e^t+e^{-t}$",
      "$2e^t-e^{-t}$",
      "$2e^t+e^{-t}$"
    ],
    "answer": "①",
    "solution": "지수함수의 미분법으로 $y=e^x+1$ 위의 점 $(t,e^t+1)$에서 접선의 기울기는 $m=e^t$이다.\n이 접선이 원점을 지나므로 $e^t+1=e^t\\cdot t$, 즉 $(t-1)e^t=1$이다.\n역함수 $y=\\ln(x-1)$는 $y=e^x+1$을 $y=x$에 대하여 대칭이동한 것이므로 대응점에서의 접선의 기울기는 $\\frac1m=e^{-t}$이다.\n두 기울기의 곱이 $e^t\\cdot e^{-t}=1$이므로 탄젠트의 뺄셈정리에서 $\\tan\\theta=\\frac{e^t-e^{-t}}{1+1}=\\frac{e^t-e^{-t}}2$이다.\n따라서 $2\\tan\\theta=e^t-e^{-t}$이다.\n따라서 정답은 ①이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B45",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-084",
    "problemTypeKey": "PT_TANGENT_DERIVATIVE",
    "templateKey": "TPL_TANGENCY_RELATION_GEOMETRY",
    "crossConceptKeys": [
      "CC_INVERSE_GRAPH_SYMMETRY"
    ],
    "conditionKeys": [],
    "integrationPattern": "INTERDEPENDENT"
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
    "content": "곡선 $y=\\frac{x^2}2$ 위의 $x=\\frac12$인 점과 $x=a$인 점에서의 접선 및 $x$축으로 둘러싸인 삼각형이 이등변삼각형이다. $a>\\frac12$일 때 $9a^2$는? [그림: 포물선과 두 접선을 그리고 $x$축 위의 절편 $(\\frac14,0)$, $(\\frac a2,0)$ 및 접선의 교점 $(\\frac{a+1/2}{2},\\frac a4)$을 꼭짓점으로 하는 삼각형을 표시한다.]",
    "choices": [
      "$9$",
      "$16$",
      "$25$",
      "$36$",
      "$49$"
    ],
    "answer": "②",
    "solution": "$y=\\frac{x^2}2$에서 다항함수의 미분법으로 $y'=x$이므로 $x=t$에서 접선의 기울기는 $t$이다.\n접선의 방정식은 $y=t(x-t)+\\frac{t^2}2=tx-\\frac{t^2}2$이다.\n$y=0$으로 놓으면 $x=\\frac t2$이므로 $x$절편은 $\\frac t2$이다.\n따라서 $t=\\frac12$일 때 절편은 $\\frac14$, $t=a$일 때 절편은 $\\frac a2$이다.\n두 접선을 연립하면 $\\left(a-\\frac12\\right)x=\\frac{a^2-\\frac14}2$에서 교점의 $x$좌표는 $\\frac{a+\\frac12}2$이고, $y$좌표는 $\\frac12\\cdot\\frac{a+\\frac12}2-\\frac18=\\frac a4$이다.\n두 접선의 경사각을 $\\alpha,\\beta$라 하면 $\\tan\\alpha=\\frac12$, $\\tan\\beta=a$이고 삼각형의 세 내각은 $\\alpha$, $\\pi-\\beta$, $\\beta-\\alpha$이다.\n$\\alpha<\\frac\\pi2<\\pi-\\beta$이므로 이등변 조건은 $\\alpha=\\beta-\\alpha$, 즉 $\\beta=2\\alpha$이다.\n탄젠트의 배각공식으로 $a=\\tan\\beta=\\frac{2\\tan\\alpha}{1-\\tan^2\\alpha}=\\frac{2\\cdot\\frac12}{1-\\frac14}=\\frac{1}{\\frac34}=\\frac43$이다.\n따라서 $9a^2=9\\cdot\\frac{16}9=16$이다.\n따라서 정답은 ②이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B45",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-084",
    "problemTypeKey": "PT_TANGENT_DERIVATIVE",
    "templateKey": "TPL_TANGENCY_RELATION_GEOMETRY",
    "crossConceptKeys": [
      "CC_QUADRATIC_FUNCTION"
    ],
    "conditionKeys": [
      "COND_RANGE"
    ],
    "integrationPattern": "INTERDEPENDENT"
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
    "content": "곡선 $y=e^x$ 위의 두 점 $A(t,e^t)$, $B(-t,e^{-t})$에서의 접선이 이루는 예각을 $\\theta$라 하자. $t>0$이고 $\\tan\\theta=\\frac34$일 때, 직선 $AB$의 기울기는? [그림: 지수곡선 위에 $A(t,e^t)$와 $B(-t,e^{-t})$를 표시한다. 두 점에서 기울기가 각각 $e^t$, $e^{-t}$인 접선을 긋고, 두 점을 선분으로 잇는다.]",
    "choices": [
      "$\\frac1{4\\ln2}$",
      "$\\frac1{2\\ln2}$",
      "$\\frac3{4\\ln2}$",
      "$\\frac1{\\ln2}$",
      "$\\frac5{4\\ln2}$"
    ],
    "answer": "③",
    "solution": "지수함수의 미분법으로 $y=e^x$ 위의 두 점 $A(t,e^t)$, $B(-t,e^{-t})$에서 접선의 기울기는 각각 $e^t$, $e^{-t}$이다.\n탄젠트의 뺄셈정리에서 $\\tan\\theta=\\frac{e^t-e^{-t}}{1+e^t\\cdot e^{-t}}=\\frac{e^t-e^{-t}}2$이다.\n$\\tan\\theta=\\frac34$이므로 $e^t-e^{-t}=\\frac32$이다.\n$u=e^t>1$로 놓으면 $u-\\frac1u=\\frac32$이고, 양변에 $2u$를 곱하면 $2u^2-3u-2=0$이다.\n인수분해하면 $(2u+1)(u-2)=0$이므로 $u=2$, 즉 $t=\\ln2$이다.\n직선 $AB$의 기울기는 $\\frac{e^t-e^{-t}}{t-(-t)}=\\frac{\\frac32}{2\\ln2}=\\frac3{4\\ln2}$이다.\n따라서 정답은 ③이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-084",
    "problemTypeKey": "PT_TANGENT_DERIVATIVE",
    "templateKey": "TPL_TANGENCY_RELATION_GEOMETRY",
    "crossConceptKeys": [
      "CC_DERIVATIVE_VALUE_EVALUATION"
    ],
    "conditionKeys": [
      "COND_POSITIVE"
    ],
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
    "content": "두 곡선 $y=\\frac2x$, $y=\\frac{2k}x$ $(k>1)$의 $x=2$인 점에서 각각 그은 접선이 이루는 예각이 $\\frac\\pi4$일 때, $3k$는?",
    "choices": [
      "$9$",
      "$12$",
      "$15$",
      "$18$",
      "$21$"
    ],
    "answer": "④",
    "solution": "거듭제곱의 미분법으로 $y=\\frac2x$에서 $y'=-\\frac2{x^2}$이므로 $x=2$에서 기울기는 $m_1=-\\frac12$이다.\n$y=\\frac{2k}x$에서 $y'=-\\frac{2k}{x^2}$이므로 $x=2$에서 기울기는 $m_2=-\\frac k2$이다.\n탄젠트의 뺄셈정리에서 $\\tan\\theta=\\left|\\frac{m_2-m_1}{1+m_1m_2}\\right|=\\frac{\\frac k2-\\frac12}{1+\\frac k4}=\\frac{\\frac{k-1}2}{1+\\frac k4}$이다.\n$\\theta=\\frac\\pi4$이므로 $\\tan\\theta=1$이고 $\\frac{\\frac{k-1}2}{1+\\frac k4}=1$이다.\n양변에 $1+\\frac k4$를 곱하면 $\\frac{k-1}2=1+\\frac k4$이다.\n양변에 $4$를 곱하면 $2(k-1)=4+k$, 즉 $2k-2=k+4$이다.\n정리하면 $k=6$이므로 $3k=18$이다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-084",
    "problemTypeKey": "PT_TANGENT_DERIVATIVE",
    "templateKey": "TPL_TANGENCY_RELATION_GEOMETRY",
    "crossConceptKeys": [
      "CC_DERIVATIVE_VALUE_EVALUATION"
    ],
    "conditionKeys": [
      "COND_RANGE"
    ],
    "integrationPattern": "SEQUENTIAL"
  }
];
