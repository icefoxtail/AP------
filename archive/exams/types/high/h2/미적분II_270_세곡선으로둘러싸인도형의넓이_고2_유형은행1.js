window.examTitle = "미적분II_270_세곡선으로둘러싸인도형의넓이_고2_유형은행1";

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
    "content": "그림과 같이 제1사분면에서 곡선 $y=\\frac{3}{x}$과 두 직선 $y=3x$, $y=\\frac{1}{3}x$로 둘러싸인 도형의 넓이는? (단, $x>0, y>0$) [그림: 좌표평면의 제1사분면에 원점 $O(0, 0)$에서 시작하는 두 직선 $y=3x$와 $y=\\frac{1}{3}x$가 그려져 있다. 곡선 $y=\\frac{3}{x}$이 직선 $y=3x$와 만나는 점을 $A(1, 3)$, 직선 $y=\\frac{1}{3}x$와 만나는 점을 $B(3, 1)$이라 할 때, 선분 $OA$, 곡선 $AB$, 선분 $BO$로 둘러싸인 영역이 색칠되어 있다.]",
    "choices": [
      "$3\\ln 3$",
      "$\\frac{7}{2}\\ln 3$",
      "$4\\ln 3$",
      "$\\frac{9}{2}\\ln 3$",
      "$5\\ln 3$"
    ],
    "answer": "①",
    "solution": "교점 $A$ 구하기: $3x=\\frac{3}{x}$에서 $3x^2=3$, $x^2=1$이고 $x>0$이므로 $x=1$, 즉 $A(1,3)$이다.\n교점 $B$ 구하기: $\\frac{1}{3}x=\\frac{3}{x}$에서 $x^2=9$이고 $x>0$이므로 $x=3$, 즉 $B(3,1)$이다.\n주의: 위쪽 경계가 $x=1$에서 직선 $y=3x$에서 곡선 $y=\\frac{3}{x}$로 바뀌므로 적분 구간을 $[0,1]$과 $[1,3]$으로 나눈다.\n(i) $0\\le x\\le 1$에서 위쪽은 $y=3x$, 아래쪽은 $y=\\frac{1}{3}x$이므로 $S_1=\\int_0^1\\left(3x-\\frac{1}{3}x\\right)dx=\\int_0^1\\frac{8}{3}x\\,dx$이다.\n$S_1$ 계산: $S_1=\\left[\\frac{4}{3}x^2\\right]_0^1=\\frac{4}{3}-0=\\frac{4}{3}$이다.\n(ii) $1\\le x\\le 3$에서 위쪽은 $y=\\frac{3}{x}$, 아래쪽은 $y=\\frac{1}{3}x$이므로 $S_2=\\int_1^3\\left(\\frac{3}{x}-\\frac{1}{3}x\\right)dx$이다.\n$\\int\\frac{1}{x}dx=\\ln|x|+C$를 이용하여 $S_2$ 계산: $S_2=\\left[3\\ln x-\\frac{1}{6}x^2\\right]_1^3=\\left(3\\ln 3-\\frac{9}{6}\\right)-\\left(3\\ln 1-\\frac{1}{6}\\right)$이다.\n$\\ln 1=0$을 대입하면 $S_2=3\\ln 3-\\frac{3}{2}+\\frac{1}{6}=3\\ln 3-\\frac{4}{3}$이다.\n전체 넓이: $S=S_1+S_2=\\frac{4}{3}+3\\ln 3-\\frac{4}{3}=3\\ln 3$이다.\n따라서 정답은 ①이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-102",
    "problemTypeKey": "PT_AREA_BY_DEFINITE_INTEGRAL",
    "templateKey": "TPL_INTERSECTION_SIGN_AREA",
    "crossConceptKeys": [
      "CC_RATIONAL_FUNCTION",
      "CC_LINEAR_FUNCTIONS",
      "CC_GRAPH_INTERSECTION"
    ],
    "conditionKeys": [
      "COND_POSITIVE"
    ],
    "integrationPattern": "SEQUENTIAL",
    "image": "assets/images/미적분II_270_세곡선으로둘러싸인도형의넓이_고2_유형은행1/q1-problem.svg",
    "imageAlt": "O(0,0), A(1,3), B(3,1)을 지나며 두 직선과 y=3/x로 닫히는 영역을 연한 색으로 표시한다.",
    "imageCaption": "O(0,0), A(1,3), B(3,1)을 지나며 두 직선과 y=3/x로 닫히는 영역을 연한 색으로 표시한다.",
    "imageSize": "full"
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
    "content": "곡선 $\\ln x + \\ln y = 2$와 두 직선 $y=e^2 x$, $y=\\frac{1}{e^2}x$로 둘러싸인 도형의 넓이는?",
    "choices": [
      "$e^2$",
      "$\\frac{3}{2}e^2$",
      "$2e^2$",
      "$\\frac{5}{2}e^2$",
      "$3e^2$"
    ],
    "answer": "③",
    "solution": "진수 조건에서 $x>0$, $y>0$이고 $\\ln x+\\ln y=\\ln(xy)=2$이므로 $xy=e^2$, 즉 $y=\\frac{e^2}{x}$이다.\n곡선과 $y=e^2x$의 교점: $e^2x=\\frac{e^2}{x}$에서 $x^2=1$이고 $x>0$이므로 $x=1$, 점은 $(1,e^2)$이다.\n곡선과 $y=\\frac{1}{e^2}x$의 교점: $\\frac{1}{e^2}x=\\frac{e^2}{x}$에서 $x^2=e^4$이고 $x>0$이므로 $x=e^2$, 점은 $(e^2,1)$이다.\n주의: 위쪽 경계가 $x=1$에서 직선 $y=e^2x$에서 곡선 $y=\\frac{e^2}{x}$로 바뀌므로 구간을 $[0,1]$과 $[1,e^2]$로 나눈다.\n(i) $0\\le x\\le 1$: $S_1=\\int_0^1\\left(e^2x-\\frac{1}{e^2}x\\right)dx=\\left(e^2-e^{-2}\\right)\\left[\\frac{1}{2}x^2\\right]_0^1=\\frac{e^2-e^{-2}}{2}$이다.\n(ii) $1\\le x\\le e^2$: $S_2=\\int_1^{e^2}\\left(\\frac{e^2}{x}-\\frac{1}{e^2}x\\right)dx$이다.\n$\\int\\frac{1}{x}dx=\\ln|x|+C$로 적분: $S_2=\\left[e^2\\ln x-\\frac{x^2}{2e^2}\\right]_1^{e^2}=\\left(e^2\\ln(e^2)-\\frac{e^4}{2e^2}\\right)-\\left(e^2\\ln 1-\\frac{1}{2e^2}\\right)$이다.\n$\\ln(e^2)=2$, $\\ln 1=0$을 대입하면 $S_2=\\left(2e^2-\\frac{e^2}{2}\\right)+\\frac{1}{2e^2}=\\frac{3e^2}{2}+\\frac{e^{-2}}{2}$이다.\n전체 넓이: $S=S_1+S_2=\\frac{e^2-e^{-2}}{2}+\\frac{3e^2+e^{-2}}{2}=\\frac{4e^2}{2}=2e^2$이다.\n따라서 정답은 ③이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-102",
    "problemTypeKey": "PT_AREA_BY_DEFINITE_INTEGRAL",
    "templateKey": "TPL_INTERSECTION_SIGN_AREA",
    "crossConceptKeys": [
      "CC_LOGARITHMIC_FUNCTION_GRAPH",
      "CC_LINEAR_FUNCTIONS",
      "CC_GRAPH_INTERSECTION"
    ],
    "conditionKeys": [],
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
    "content": "곡선 $y=e^{2x}$과 두 직선 $y=2ex$, $y=-\\frac{2}{e}x$로 둘러싸인 도형의 넓이는?",
    "choices": [
      "$\\frac{e}{4} - \\frac{7}{4e}$",
      "$\\frac{e}{4} - \\frac{3}{2e}$",
      "$\\frac{e}{4} - \\frac{5}{4e}$",
      "$\\frac{e}{4} - \\frac{1}{e}$",
      "$\\frac{e}{4} - \\frac{3}{4e}$"
    ],
    "answer": "⑤",
    "solution": "$f(x)=e^{2x}-2ex$라 하면 $f'(x)=2e^{2x}-2e$이므로 $f'(x)=0$에서 $e^{2x}=e$, $x=\\frac{1}{2}$이다.\n$f\\left(\\frac{1}{2}\\right)=e-2e\\cdot\\frac{1}{2}=0$이고 $f$는 $x=\\frac{1}{2}$에서 최솟값 $0$을 가지므로 직선 $y=2ex$는 곡선과 $\\left(\\frac{1}{2},e\\right)$에서 접한다.\n$g(x)=e^{2x}+\\frac{2}{e}x$라 하면 $g\\left(-\\frac{1}{2}\\right)=\\frac{1}{e}-\\frac{1}{e}=0$이고 $g'(x)=2e^{2x}+\\frac{2}{e}>0$이므로 교점은 $\\left(-\\frac{1}{2},\\frac{1}{e}\\right)$ 하나뿐이다.\n두 직선 $y=2ex$와 $y=-\\frac{2}{e}x$의 교점: $2ex=-\\frac{2}{e}x$에서 $x=0$이므로 원점 $O(0,0)$이다.\n주의: 아래쪽 경계가 $x=0$에서 $y=-\\frac{2}{e}x$에서 $y=2ex$로 바뀌므로 적분 구간을 $\\left[-\\frac{1}{2},0\\right]$과 $\\left[0,\\frac{1}{2}\\right]$로 나눈다.\n(i) $S_1=\\int_{-1/2}^0\\left(e^{2x}+\\frac{2}{e}x\\right)dx$이고 $\\int e^{2x}dx=\\frac{1}{2}e^{2x}+C$이므로 $S_1=\\left[\\frac{1}{2}e^{2x}+\\frac{1}{e}x^2\\right]_{-1/2}^0$이다.\n$S_1=\\left(\\frac{1}{2}+0\\right)-\\left(\\frac{1}{2e}+\\frac{1}{4e}\\right)=\\frac{1}{2}-\\frac{3}{4e}$이다.\n(ii) $S_2=\\int_0^{1/2}(e^{2x}-2ex)dx=\\left[\\frac{1}{2}e^{2x}-ex^2\\right]_0^{1/2}$이다.\n$S_2=\\left(\\frac{e}{2}-\\frac{e}{4}\\right)-\\frac{1}{2}=\\frac{e}{4}-\\frac{1}{2}$이다.\n전체 넓이: $S=S_1+S_2=\\left(\\frac{1}{2}-\\frac{3}{4e}\\right)+\\left(\\frac{e}{4}-\\frac{1}{2}\\right)=\\frac{e}{4}-\\frac{3}{4e}$이다.\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-102",
    "problemTypeKey": "PT_AREA_BY_DEFINITE_INTEGRAL",
    "templateKey": "TPL_INTERSECTION_SIGN_AREA",
    "crossConceptKeys": [
      "CC_EXPONENTIAL_FUNCTION_GRAPH",
      "CC_GRAPH_INTERSECTION",
      "CC_LINEAR_FUNCTIONS"
    ],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
  }
];
