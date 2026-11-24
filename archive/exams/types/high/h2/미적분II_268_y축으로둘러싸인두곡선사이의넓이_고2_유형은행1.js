window.examTitle = "미적분II_268_y축으로둘러싸인두곡선사이의넓이_고2_유형은행1";

window.questionBank = [
  {
    "id": 1,
    "category": "정적분의 활용",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-08",
    "standardUnit": "정적분의 활용",
    "standardUnitOrder": 8,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "정적분의 활용"
    ],
    "wide": false,
    "content": "곡선 $y = 2\\sqrt{x-1}$과 $x$축 및 직선 $y = x$로 둘러싸인 부분의 넓이는?",
    "choices": [
      "$\\dfrac{1}{3}$",
      "$\\dfrac{1}{2}$",
      "$\\dfrac{2}{3}$",
      "$\\dfrac{5}{6}$",
      "$1$"
    ],
    "answer": "③",
    "solution": "[곡선을 $x$에 대해 정리하기]\n$y=2\\sqrt{x-1}$에서 양변을 제곱하면 $y^2=4(x-1)$이므로 $x=\\dfrac{1}{4}y^2+1$이고, 직선 $y=x$는 $x=y$, $x$축은 $y=0$이다.\n[두 곡선의 교점 구하기]\n$\\dfrac{1}{4}y^2+1=y$에서 $y^2-4y+4=0$, 즉 $(y-2)^2=0$이므로 교점은 $y=2$에서 생긴다.\n[적분 구간과 위치 관계 확인하기]\n$0\\le y\\le 2$에서 $\\left(\\dfrac{1}{4}y^2+1\\right)-y=\\dfrac{1}{4}(y-2)^2\\ge 0$이므로 곡선이 직선보다 오른쪽에 있다.\n[넓이를 $y$에 대한 정적분으로 나타내기]\n$S=\\displaystyle\\int_0^2\\left\\{\\left(\\dfrac{1}{4}y^2+1\\right)-y\\right\\}dy=\\int_0^2\\left(\\dfrac{1}{4}y^2-y+1\\right)dy$.\n[정적분 계산하기]\n$S=\\left[\\dfrac{1}{12}y^3-\\dfrac{1}{2}y^2+y\\right]_0^2=\\dfrac{8}{12}-2+2=\\dfrac{2}{3}$.\n주의: $x$축 방향으로 적분하면 구간이 나뉘므로 $y$축 방향으로 적분하는 것이 간단하다.\n따라서 정답은 ③이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-102",
    "problemTypeKey": "PT_AREA_BY_DEFINITE_INTEGRAL",
    "templateKey": "TPL_INTERSECTION_SIGN_AREA",
    "crossConceptKeys": [
      "CC_RADICAL_FUNCTION",
      "CC_GRAPH_INTERSECTION"
    ],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 2,
    "category": "정적분의 활용",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-08",
    "standardUnit": "정적분의 활용",
    "standardUnitOrder": 8,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "정적분의 활용"
    ],
    "wide": false,
    "content": "곡선 $x = 4 - y^2$ ($y \\ge 0$)과 두 직선 $y = 0$, $y = x - 2$로 둘러싸인 도형의 넓이는?",
    "choices": [
      "$1$",
      "$\\dfrac{7}{6}$",
      "$\\dfrac{4}{3}$",
      "$\\dfrac{3}{2}$",
      "$\\dfrac{5}{3}$"
    ],
    "answer": "②",
    "solution": "[직선을 $x$에 대해 정리하기]\n$y=x-2$에서 $x=y+2$이고, 곡선은 $x=4-y^2$, 또 다른 경계는 $y=0$이다.\n[교점의 $y$좌표 구하기]\n$4-y^2=y+2$에서 $y^2+y-2=0$이므로 $(y+2)(y-1)=0$이다.\n[조건 $y\\ge 0$에 맞는 교점 선택하기]\n$y\\ge 0$이므로 $y=1$만 택한다. 이때 교점은 $(3,1)$이다.\n[적분 구간과 위치 관계 확인하기]\n$0\\le y\\le 1$에서 $(4-y^2)-(y+2)=2-y-y^2=(1-y)(y+2)\\ge 0$이므로 곡선이 직선보다 오른쪽에 있다.\n[넓이를 정적분으로 나타내기]\n$S=\\displaystyle\\int_0^1\\left\\{(4-y^2)-(y+2)\\right\\}dy=\\int_0^1(2-y-y^2)dy$.\n[정적분 계산하기]\n$S=\\left[2y-\\dfrac{1}{2}y^2-\\dfrac{1}{3}y^3\\right]_0^1=2-\\dfrac{1}{2}-\\dfrac{1}{3}=\\dfrac{12-3-2}{6}=\\dfrac{7}{6}$.\n주의: $y=-2$는 $y\\ge 0$ 조건에 맞지 않으므로 적분 구간에 포함하지 않는다.\n따라서 정답은 ②이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-102",
    "problemTypeKey": "PT_AREA_BY_DEFINITE_INTEGRAL",
    "templateKey": "TPL_INTERSECTION_SIGN_AREA",
    "crossConceptKeys": [
      "CC_QUADRATIC_FUNCTION",
      "CC_GRAPH_INTERSECTION"
    ],
    "conditionKeys": [
      "COND_RANGE"
    ],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 3,
    "category": "정적분의 활용",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-08",
    "standardUnit": "정적분의 활용",
    "standardUnitOrder": 8,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "정적분의 활용"
    ],
    "wide": false,
    "content": "곡선 $y = e^{x-1}$과 세 직선 $y = \\dfrac{1}{2}x$, $y = 2$, $y = 4$로 둘러싸인 도형의 넓이는?",
    "choices": [
      "$6 - 6\\ln 2$",
      "$8 - 6\\ln 2$",
      "$10 - 6\\ln 2$",
      "$12 - 6\\ln 2$",
      "$14 - 6\\ln 2$"
    ],
    "answer": "④",
    "solution": "[곡선과 직선을 $x$에 대해 정리하기]\n$y=e^{x-1}$에서 $x=\\ln y+1$이고, $y=\\dfrac{1}{2}x$에서 $x=2y$이다.\n[적분 구간 정하기]\n주어진 수평선이 $y=2$, $y=4$이므로 $2\\le y\\le 4$에서 넓이를 구한다.\n[두 경계의 위치 관계 확인하기]\n$g(y)=2y-(\\ln y+1)$이라 하면 $g'(y)=2-\\dfrac{1}{y}>0$ ($y\\ge 2$)이므로 $g$는 증가한다.\n또 $g(2)=3-\\ln 2>0$이므로 구간 $[2,4]$에서 직선 $x=2y$가 곡선 $x=\\ln y+1$보다 오른쪽에 있다.\n[넓이를 정적분으로 나타내기]\n$S=\\displaystyle\\int_2^4\\left\\{2y-(\\ln y+1)\\right\\}dy=\\int_2^4(2y-1)dy-\\int_2^4\\ln y\\,dy$.\n[다항식 부분 계산하기]\n$\\displaystyle\\int_2^4(2y-1)dy=\\left[y^2-y\\right]_2^4=(16-4)-(4-2)=10$.\n[로그 부분을 부분적분법으로 계산하기]\n$\\displaystyle\\int_2^4\\ln y\\,dy=\\left[y\\ln y-y\\right]_2^4=(4\\ln4-4)-(2\\ln2-2)$이고, $\\ln4=2\\ln2$이므로 $=(8\\ln2-4)-(2\\ln2-2)=6\\ln2-2$.\n[두 결과를 합치기]\n$S=10-(6\\ln2-2)=12-6\\ln2$.\n따라서 정답은 ④이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-102",
    "problemTypeKey": "PT_AREA_BY_DEFINITE_INTEGRAL",
    "templateKey": "TPL_INTERSECTION_SIGN_AREA",
    "crossConceptKeys": [
      "CC_EXPONENTIAL_FUNCTION_GRAPH",
      "CC_LOGARITHMIC_FUNCTION_GRAPH"
    ],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
  }
];
