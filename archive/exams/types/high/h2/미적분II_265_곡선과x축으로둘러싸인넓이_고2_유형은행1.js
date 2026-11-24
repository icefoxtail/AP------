window.examTitle = "미적분II_265_곡선과x축으로둘러싸인넓이_고2_유형은행1";

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
    "content": "곡선 $y=e^{2x-4}$과 $x$축 및 두 직선 $x=2$, $x=a\\;(a>2)$로 둘러싸인 도형의 넓이가 $\\dfrac{3}{2}$일 때, 상수 $a$의 값은?",
    "choices": [
      "$1+\\ln 2$",
      "$2+\\dfrac{1}{2}\\ln 2$",
      "$2+\\ln 2$",
      "$2+\\ln 3$",
      "$3+\\ln 2$"
    ],
    "answer": "③",
    "solution": "$e^{2x-4}>0$이므로 곡선은 $x$축 위쪽에 있다(지수함수의 성질).\n넓이를 정적분으로 나타내면 $S=\\int_{2}^{a} e^{2x-4}\\,dx$이다.\n지수함수의 적분법으로 부정적분을 구하면 $\\int e^{2x-4}\\,dx=\\dfrac{1}{2}e^{2x-4}+C$이다.\n위끝과 아래끝을 대입하면 $S=\\left[\\dfrac{1}{2}e^{2x-4}\\right]_{2}^{a}=\\dfrac{1}{2}(e^{2a-4}-e^{0})=\\dfrac{1}{2}(e^{2a-4}-1)$이다.\n주어진 넓이가 $\\dfrac{3}{2}$이므로 $\\dfrac{1}{2}(e^{2a-4}-1)=\\dfrac{3}{2}$이다.\n양변에 $2$를 곱하면 $e^{2a-4}-1=3$, 즉 $e^{2a-4}=4$이다.\n양변에 자연로그를 취하면 $2a-4=\\ln 4=2\\ln 2$이다.\n따라서 $a=2+\\ln 2$이다.\n따라서 정답은 ③이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-101",
    "problemTypeKey": "PT_AREA_BY_DEFINITE_INTEGRAL",
    "templateKey": "TPL_INTERSECTION_SIGN_AREA",
    "crossConceptKeys": [
      "CC_DEFINITE_INTEGRAL_PARAMETER_SOLVING",
      "CC_EXPONENTIAL_FUNCTION_GRAPH"
    ],
    "conditionKeys": [
      "COND_RANGE"
    ],
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
    "content": "곡선 $y=e^{2x}-1$과 $x$축 및 직선 $x=1$로 둘러싸인 부분의 넓이는?",
    "choices": [
      "$\\dfrac{e^2-7}{2}$",
      "$\\dfrac{e^2-6}{2}$",
      "$\\dfrac{e^2-5}{2}$",
      "$\\dfrac{e^2-4}{2}$",
      "$\\dfrac{e^2-3}{2}$"
    ],
    "answer": "⑤",
    "solution": "$x$축과의 교점은 $e^{2x}-1=0$에서 $e^{2x}=1$, 즉 $x=0$이다.\n구간 $[0,1]$에서 $e^{2x}\\ge 1$이므로 $e^{2x}-1\\ge 0$이다.\n넓이를 정적분으로 나타내면 $S=\\int_{0}^{1}(e^{2x}-1)\\,dx$이다.\n지수함수의 적분법으로 계산하면 $\\int(e^{2x}-1)\\,dx=\\dfrac{1}{2}e^{2x}-x+C$이다.\n위끝과 아래끝을 대입하면 $S=\\left[\\dfrac{1}{2}e^{2x}-x\\right]_{0}^{1}=\\left(\\dfrac{1}{2}e^{2}-1\\right)-\\dfrac{1}{2}$이다.\n통분하면 $S=\\dfrac{e^{2}-2-1}{2}=\\dfrac{e^{2}-3}{2}$이다.\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-101",
    "problemTypeKey": "PT_AREA_BY_DEFINITE_INTEGRAL",
    "templateKey": "TPL_INTERSECTION_SIGN_AREA",
    "crossConceptKeys": [
      "CC_EXPONENTIAL_FUNCTION_GRAPH",
      "CC_INTEGRAL_BOUNDARY_ROOT_EVALUATION"
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
    "content": "곡선 $y=\\ln(x+1)$과 $x$축 및 직선 $x=e^2-1$로 둘러싸인 부분의 넓이는?",
    "choices": [
      "$e^2+1$",
      "$e^2+2$",
      "$2e^2-1$",
      "$2e^2+1$",
      "$2e^2+2$"
    ],
    "answer": "①",
    "solution": "$x$축과의 교점은 $\\ln(x+1)=0$에서 $x+1=1$, 즉 $x=0$이다.\n구간 $[0,e^{2}-1]$에서 $\\ln(x+1)\\ge 0$이므로 넓이는 $S=\\int_{0}^{e^{2}-1}\\ln(x+1)\\,dx$이다.\n$t=x+1$로 치환하면 $dt=dx$이고 구간은 $x=0\\to t=1$, $x=e^{2}-1\\to t=e^{2}$이다(치환적분법).\n따라서 $S=\\int_{1}^{e^{2}}\\ln t\\,dt$이다.\n부분적분법 $\\int\\ln t\\,dt=t\\ln t-t+C$를 쓰면 $S=\\left[t\\ln t-t\\right]_{1}^{e^{2}}$이다.\n위끝과 아래끝을 대입하면 $S=(e^{2}\\cdot 2-e^{2})-(1\\cdot 0-1)=e^{2}+1$이다.\n따라서 정답은 ①이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-101",
    "problemTypeKey": "PT_AREA_BY_DEFINITE_INTEGRAL",
    "templateKey": "TPL_INTERSECTION_SIGN_AREA",
    "crossConceptKeys": [
      "CC_LOGARITHMIC_FUNCTION_GRAPH",
      "CC_INTEGRATION_BY_PARTS_OR_EXPANSION"
    ],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 4,
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
    "content": "곡선 $y=e^x + 2e^{-x}$과 $x$축, $y$축 및 직선 $x=a\\;(a>0)$로 둘러싸인 도형의 넓이가 $\\dfrac{10}{3}$일 때, 상수 $a$의 값은?",
    "choices": [
      "$\\ln 2$",
      "$\\ln\\left(\\dfrac{5}{2}\\right)$",
      "$\\ln 3$",
      "$\\ln 4$",
      "$\\ln 5$"
    ],
    "answer": "③",
    "solution": "$e^{x}+2e^{-x}>0$이므로 곡선은 $x$축 위쪽에 있다.\n$y$축은 $x=0$이므로 넓이는 $S=\\int_{0}^{a}(e^{x}+2e^{-x})\\,dx$이다.\n지수함수의 적분법으로 $\\int(e^{x}+2e^{-x})\\,dx=e^{x}-2e^{-x}+C$이다.\n대입하면 $S=\\left[e^{x}-2e^{-x}\\right]_{0}^{a}=(e^{a}-2e^{-a})-(1-2)=e^{a}-2e^{-a}+1$이다.\n$S=\\dfrac{10}{3}$이므로 $e^{a}-2e^{-a}=\\dfrac{7}{3}$이다.\n$t=e^{a}\\;(t>1)$라 하면 $t-\\dfrac{2}{t}=\\dfrac{7}{3}$이다.\n양변에 $3t$를 곱하면 $3t^{2}-7t-6=0$이다.\n인수분해하면 $(3t+2)(t-3)=0$이다.\n$t>1$이므로 $t=3$이다.\n$e^{a}=3$에서 $a=\\ln 3$이다.\n따라서 정답은 ③이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-101",
    "problemTypeKey": "PT_AREA_BY_DEFINITE_INTEGRAL",
    "templateKey": "TPL_INTERSECTION_SIGN_AREA",
    "crossConceptKeys": [
      "CC_DEFINITE_INTEGRAL_PARAMETER_SOLVING",
      "CC_EXPONENTIAL_FUNCTION_GRAPH"
    ],
    "conditionKeys": [
      "COND_POSITIVE"
    ],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 5,
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
    "content": "곡선 $y=\\sqrt{2x+1}$과 $x$축 및 두 직선 $x=0$, $x=4$로 둘러싸인 도형의 넓이는?",
    "choices": [
      "$\\dfrac{20}{3}$",
      "$\\dfrac{22}{3}$",
      "$8$",
      "$\\dfrac{25}{3}$",
      "$\\dfrac{26}{3}$"
    ],
    "answer": "⑤",
    "solution": "구간 $[0,4]$에서 $2x+1>0$이므로 $\\sqrt{2x+1}>0$이다.\n넓이는 $S=\\int_{0}^{4}(2x+1)^{1/2}\\,dx$이다.\n$u=2x+1$로 치환하면 $du=2\\,dx$, 즉 $dx=\\dfrac{1}{2}du$이고 구간은 $u=1$에서 $u=9$이다(치환적분법).\n따라서 $S=\\dfrac{1}{2}\\int_{1}^{9}u^{1/2}\\,du=\\dfrac{1}{2}\\left[\\dfrac{2}{3}u^{3/2}\\right]_{1}^{9}$이다.\n계산하면 $S=\\dfrac{1}{3}(9^{3/2}-1^{3/2})=\\dfrac{1}{3}(27-1)$이다.\n따라서 $S=\\dfrac{26}{3}$이다.\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-101",
    "problemTypeKey": "PT_AREA_BY_DEFINITE_INTEGRAL",
    "templateKey": "TPL_INTERSECTION_SIGN_AREA",
    "crossConceptKeys": [
      "CC_RADICAL_FUNCTION"
    ],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 6,
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
    "content": "모든 실수 $x$에 대하여 $f(x)>0$인 연속함수 $f(x)$가 $\\int_{2}^{9} f(x)\\,dx = 36$을 만족시킬 때, 곡선 $y=x^2 f(x^3+1)$과 $x$축 및 두 직선 $x=1$, $x=2$로 둘러싸인 부분의 넓이는?",
    "choices": [
      "$12$",
      "$15$",
      "$18$",
      "$24$",
      "$36$"
    ],
    "answer": "①",
    "solution": "$x^{2}>0$, $f(x^{3}+1)>0$이므로 곡선은 $x$축 위쪽에 있다.\n넓이는 $S=\\int_{1}^{2}x^{2}f(x^{3}+1)\\,dx$이다.\n$t=x^{3}+1$로 치환하면 $dt=3x^{2}dx$, 즉 $x^{2}dx=\\dfrac{1}{3}dt$이다(치환적분법).\n구간은 $x=1\\to t=2$, $x=2\\to t=9$이다.\n따라서 $S=\\dfrac{1}{3}\\int_{2}^{9}f(t)\\,dt$이다.\n주어진 $\\int_{2}^{9}f(x)\\,dx=36$을 대입하면 $S=\\dfrac{1}{3}\\cdot 36=12$이다.\n따라서 정답은 ①이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B45",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-101",
    "problemTypeKey": "PT_AREA_BY_DEFINITE_INTEGRAL",
    "templateKey": "TPL_INTERSECTION_SIGN_AREA",
    "crossConceptKeys": [],
    "conditionKeys": [
      "COND_UNIVERSAL_INPUTS",
      "COND_FUNCTION_VALUE_CONSTRAINT"
    ],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 7,
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
    "content": "곡선 $y=\\dfrac{x}{x^2+3}$과 $x$축 및 직선 $x=3$으로 둘러싸인 도형의 넓이는?",
    "choices": [
      "$\\dfrac{1}{3}\\ln 2$",
      "$\\dfrac{1}{2}\\ln 2$",
      "$\\ln 2$",
      "$\\dfrac{3}{2}\\ln 2$",
      "$2\\ln 2$"
    ],
    "answer": "③",
    "solution": "$x$축과의 교점은 $\\dfrac{x}{x^{2}+3}=0$에서 $x=0$이다.\n구간 $[0,3]$에서 분모 $x^{2}+3>0$, 분자 $x\\ge 0$이므로 $\\dfrac{x}{x^{2}+3}\\ge 0$이다.\n넓이는 $S=\\int_{0}^{3}\\dfrac{x}{x^{2}+3}\\,dx$이다.\n$t=x^{2}+3$으로 치환하면 $dt=2x\\,dx$, 즉 $x\\,dx=\\dfrac{1}{2}dt$이고 구간은 $t=3$에서 $t=12$이다.\n따라서 $S=\\dfrac{1}{2}\\int_{3}^{12}\\dfrac{1}{t}\\,dt=\\dfrac{1}{2}\\left[\\ln t\\right]_{3}^{12}$이다.\n로그의 성질로 $S=\\dfrac{1}{2}\\ln\\dfrac{12}{3}=\\dfrac{1}{2}\\ln 4=\\dfrac{1}{2}\\cdot 2\\ln 2$이다.\n따라서 $S=\\ln 2$이다.\n따라서 정답은 ③이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-101",
    "problemTypeKey": "PT_AREA_BY_DEFINITE_INTEGRAL",
    "templateKey": "TPL_INTERSECTION_SIGN_AREA",
    "crossConceptKeys": [
      "CC_RATIONAL_FUNCTION"
    ],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 8,
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
    "content": "곡선 $y=\\dfrac{2\\ln x}{x}$와 $x$축 및 두 직선 $x=1$, $x=e^2$으로 둘러싸인 도형의 넓이는?",
    "choices": [
      "$2$",
      "$4$",
      "$6$",
      "$8$",
      "$10$"
    ],
    "answer": "②",
    "solution": "구간 $[1,e^{2}]$에서 $\\ln x\\ge 0$, $x>0$이므로 $\\dfrac{2\\ln x}{x}\\ge 0$이다.\n넓이는 $S=\\int_{1}^{e^{2}}\\dfrac{2\\ln x}{x}\\,dx$이다.\n$t=\\ln x$로 치환하면 $dt=\\dfrac{1}{x}dx$이고 구간은 $t=0$에서 $t=2$이다(치환적분법).\n따라서 $S=\\int_{0}^{2}2t\\,dt$이다.\n다항함수의 적분법으로 $S=\\left[t^{2}\\right]_{0}^{2}$이다.\n대입하면 $S=2^{2}-0^{2}=4$이다.\n따라서 정답은 ②이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-101",
    "problemTypeKey": "PT_AREA_BY_DEFINITE_INTEGRAL",
    "templateKey": "TPL_INTERSECTION_SIGN_AREA",
    "crossConceptKeys": [
      "CC_LOGARITHMIC_FUNCTION_GRAPH"
    ],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 9,
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
    "content": "함수 $f(x)=\\dfrac{2x-2}{x^2-2x+2}$에 대하여 곡선 $y=f(x)$와 $x$축 및 $y$축으로 둘러싸인 영역을 $A$, 곡선 $y=f(x)$와 $x$축 및 직선 $x=2$로 둘러싸인 영역을 $B$라 하자. 영역 $A$의 넓이와 영역 $B$의 넓이의 합은? [그림: 좌표평면에 함수 $y=f(x)$의 그래프가 그려져 있다. 점 $(0, -1)$에서 시작하여 $x$축과 점 $(1, 0)$에서 만난 후 극댓값을 갖고 점 $(2, 1)$을 지난다. $0 \\le x \\le 1$에서 곡선과 $x$축, $y$축으로 둘러싸인 $x$축 아래 영역에 $A$, $1 \\le x \\le 2$에서 곡선과 $x$축 및 직선 $x=2$로 둘러싸인 $x$축 위 영역에 $B$가 표시되어 있다.]",
    "choices": [
      "$\\dfrac{1}{2}\\ln 2$",
      "$\\ln 2$",
      "$\\dfrac{3}{2}\\ln 2$",
      "$2\\ln 2$",
      "$\\dfrac{5}{2}\\ln 2$"
    ],
    "answer": "④",
    "solution": "$x^{2}-2x+2=(x-1)^{2}+1>0$이므로 $f$는 모든 실수에서 연속이다.\n$f(x)=0$인 점은 $2x-2=0$에서 $x=1$이다.\n분모의 도함수가 $2x-2$이므로 $\\int f(x)\\,dx=\\ln(x^{2}-2x+2)+C$이다(치환적분법).\n(i) 영역 $A$: $[0,1]$에서 $f(x)\\le 0$이므로 $S_{A}=-\\int_{0}^{1}f(x)\\,dx$이다.\n$S_{A}=-\\left[\\ln(x^{2}-2x+2)\\right]_{0}^{1}=-(\\ln 1-\\ln 2)=\\ln 2$이다.\n(ii) 영역 $B$: $[1,2]$에서 $f(x)\\ge 0$이므로 $S_{B}=\\int_{1}^{2}f(x)\\,dx$이다.\n$S_{B}=\\left[\\ln(x^{2}-2x+2)\\right]_{1}^{2}=\\ln 2-\\ln 1=\\ln 2$이다.\n주의: $A$는 $x$축 아래에 있으므로 부호를 바꾸어 절댓값을 취해야 한다.\n따라서 $S_{A}+S_{B}=\\ln 2+\\ln 2=2\\ln 2$이다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-101",
    "problemTypeKey": "PT_AREA_BY_DEFINITE_INTEGRAL",
    "templateKey": "TPL_INTERSECTION_SIGN_AREA",
    "crossConceptKeys": [
      "CC_DEFINITE_INTEGRAL_AREA_DECOMPOSITION",
      "CC_RATIONAL_FUNCTION"
    ],
    "conditionKeys": [],
    "integrationPattern": "CASE_BRANCH"
  },
  {
    "id": 10,
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
    "content": "곡선 $y=\\ln x - 1$과 $x$축 및 두 직선 $x=1$, $x=e^2$으로 둘러싸인 부분의 넓이는?",
    "choices": [
      "$2e-4$",
      "$2e-3$",
      "$2e-2$",
      "$2e-1$",
      "$2e$"
    ],
    "answer": "③",
    "solution": "$x$축과의 교점은 $\\ln x-1=0$에서 $\\ln x=1$, 즉 $x=e$이다.\n부분적분법으로 $\\int(\\ln x-1)\\,dx=x\\ln x-x-x=x\\ln x-2x+C$이다.\n(i) $[1,e]$에서 $\\ln x-1\\le 0$이므로 $S_{1}=-\\int_{1}^{e}(\\ln x-1)\\,dx$이다.\n$S_{1}=-\\left[x\\ln x-2x\\right]_{1}^{e}=-\\{(e-2e)-(0-2)\\}=e-2$이다.\n(ii) $[e,e^{2}]$에서 $\\ln x-1\\ge 0$이므로 $S_{2}=\\int_{e}^{e^{2}}(\\ln x-1)\\,dx$이다.\n$S_{2}=\\left[x\\ln x-2x\\right]_{e}^{e^{2}}=(2e^{2}-2e^{2})-(e-2e)=e$이다.\n따라서 전체 넓이는 $S=S_{1}+S_{2}=(e-2)+e=2e-2$이다.\n따라서 정답은 ③이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-101",
    "problemTypeKey": "PT_AREA_BY_DEFINITE_INTEGRAL",
    "templateKey": "TPL_INTERSECTION_SIGN_AREA",
    "crossConceptKeys": [
      "CC_LOGARITHMIC_FUNCTION_GRAPH",
      "CC_DEFINITE_INTEGRAL_AREA_DECOMPOSITION",
      "CC_INTEGRATION_BY_PARTS_OR_EXPANSION"
    ],
    "conditionKeys": [],
    "integrationPattern": "CASE_BRANCH"
  }
];
