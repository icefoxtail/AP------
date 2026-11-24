window.examTitle = "미적분II_267_두곡선으로둘러싸인도형의넓이_고2_유형은행1";

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
    "content": "닫힌구간 $[0, \\pi]$에서 두 곡선 $y=\\sqrt{3}\\cos x, y=\\sin x$ 및 두 직선 $x=0, x=\\pi$로 둘러싸인 도형의 넓이는?",
    "choices": [
      "$2$",
      "$3$",
      "$4$",
      "$5$",
      "$6$"
    ],
    "answer": "③",
    "solution": "두 곡선의 교점을 구하기 위해 방정식을 세운다. $\\sqrt{3}\\cos x=\\sin x$의 양변을 $\\cos x$로 나누면 $\\tan x=\\sqrt{3}$이다.\n닫힌구간 $[0,\\pi]$에서 이를 만족하는 $x$는 $x=\\frac{\\pi}{3}$이다.\n(i) 구간 $[0,\\frac{\\pi}{3}]$에서는 $\\sqrt{3}\\cos x\\ge\\sin x$이므로 $$\\int_0^{\\frac{\\pi}{3}}(\\sqrt{3}\\cos x-\\sin x)\\,dx=\\left[\\sqrt{3}\\sin x+\\cos x\\right]_0^{\\frac{\\pi}{3}}=\\left(\\frac{3}{2}+\\frac{1}{2}\\right)-1=1$$이다.\n(ii) 구간 $[\\frac{\\pi}{3},\\pi]$에서는 $\\sin x\\ge\\sqrt{3}\\cos x$이므로 $$\\int_{\\frac{\\pi}{3}}^{\\pi}(\\sin x-\\sqrt{3}\\cos x)\\,dx=\\left[-\\cos x-\\sqrt{3}\\sin x\\right]_{\\frac{\\pi}{3}}^{\\pi}=1-\\left(-\\frac{1}{2}-\\frac{3}{2}\\right)=3$$이다.\n두 넓이를 더하면 $S=1+3=4$이다.\n주의: 교점 $x=\\frac{\\pi}{3}$에서 위아래 곡선이 바뀌므로 구간을 반드시 나누어 적분한다.\n따라서 정답은 ③이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-102",
    "problemTypeKey": "PT_AREA_BY_DEFINITE_INTEGRAL",
    "templateKey": "TPL_INTERSECTION_SIGN_AREA",
    "crossConceptKeys": [
      "CC_TRIGONOMETRIC_EQUATION",
      "CC_DEFINITE_INTEGRAL_AREA_DECOMPOSITION"
    ],
    "conditionKeys": [
      "COND_RESTRICTED_INTERVAL"
    ],
    "integrationPattern": "CASE_BRANCH"
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
    "content": "그림과 같이 닫힌구간 $\\left[-\\frac{\\pi}{2}, \\frac{\\pi}{2}\\right]$에서 두 곡선 $y=\\cos x, y=\\sin 2x$로 둘러싸인 도형의 넓이는?\n\n[그림: 좌표평면에서 닫힌구간 $[-\\pi/2, \\pi/2]$일 때 곡선 $y=\\cos x$와 곡선 $y=\\sin 2x$가 세 점 $(-\\pi/2, 0)$, $(\\pi/6, \\sqrt{3}/2)$, $(\\pi/2, 0)$에서 만나며, 두 곡선으로 둘러싸인 두 영역이 색칠되어 있다.]",
    "choices": [
      "$1$",
      "$\\frac{3}{2}$",
      "$2$",
      "$\\frac{5}{2}$",
      "$3$"
    ],
    "answer": "④",
    "solution": "교점을 구하기 위해 배각공식 $\\sin 2x=2\\sin x\\cos x$를 쓴다. $\\cos x=2\\sin x\\cos x$에서 $\\cos x(1-2\\sin x)=0$이다.\n$[-\\frac{\\pi}{2},\\frac{\\pi}{2}]$에서 $\\cos x=0$이면 $x=\\pm\\frac{\\pi}{2}$이고, $\\sin x=\\frac{1}{2}$이면 $x=\\frac{\\pi}{6}$이다.\n(i) $[-\\frac{\\pi}{2},\\frac{\\pi}{6}]$에서는 $\\cos x\\ge\\sin 2x$이므로 $$S_1=\\int_{-\\frac{\\pi}{2}}^{\\frac{\\pi}{6}}(\\cos x-\\sin 2x)\\,dx=\\left[\\sin x+\\frac{1}{2}\\cos 2x\\right]_{-\\frac{\\pi}{2}}^{\\frac{\\pi}{6}}=\\left(\\frac{1}{2}+\\frac{1}{4}\\right)-\\left(-1-\\frac{1}{2}\\right)=\\frac{9}{4}$$이다.\n(ii) $[\\frac{\\pi}{6},\\frac{\\pi}{2}]$에서는 $\\sin 2x\\ge\\cos x$이므로 $$S_2=\\int_{\\frac{\\pi}{6}}^{\\frac{\\pi}{2}}(\\sin 2x-\\cos x)\\,dx=\\left[-\\frac{1}{2}\\cos 2x-\\sin x\\right]_{\\frac{\\pi}{6}}^{\\frac{\\pi}{2}}=\\left(\\frac{1}{2}-1\\right)-\\left(-\\frac{1}{4}-\\frac{1}{2}\\right)=\\frac{1}{4}$$이다.\n총넓이는 두 값을 더하여 $S=\\frac{9}{4}+\\frac{1}{4}=\\frac{5}{2}$이다.\n주의: $\\sin 2x$를 적분하면 계수 $-\\frac{1}{2}$이 붙음을 잊지 않는다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B45",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-102",
    "problemTypeKey": "PT_AREA_BY_DEFINITE_INTEGRAL",
    "templateKey": "TPL_INTERSECTION_SIGN_AREA",
    "crossConceptKeys": [
      "CC_TRIGONOMETRIC_EQUATION",
      "CC_DEFINITE_INTEGRAL_AREA_DECOMPOSITION"
    ],
    "conditionKeys": [
      "COND_RESTRICTED_INTERVAL"
    ],
    "integrationPattern": "CASE_BRANCH"
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
    "content": "그림과 같이 $0 \\le x \\le \\frac{\\pi}{2}$에서 두 곡선 $y=\\cos x, y=\\sin 2x$ 및 $y$축으로 둘러싸인 도형의 넓이를 $S_1$, 두 곡선 $y=\\cos x, y=\\sin 2x$ 및 $x$축으로 둘러싸인 도형의 넓이를 $S_2$라고 하자. 이때 $\\frac{S_2}{S_1}$의 값은?\n\n[그림: 좌표평면에서 $0 \\le x \\le \\pi/2$일 때, 곡선 $y=\\cos x$와 곡선 $y=\\sin 2x$가 점 $(\\pi/6, \\sqrt{3}/2)$에서 만난다. 두 곡선과 $y$축으로 둘러싸인 위쪽 영역을 $S_1$, 두 곡선과 $x$축으로 둘러싸인 아래쪽 영역을 $S_2$로 표시한다.]",
    "choices": [
      "$\\frac{3}{2}$",
      "$2$",
      "$\\frac{5}{2}$",
      "$3$",
      "$\\frac{7}{2}$"
    ],
    "answer": "④",
    "solution": "구간 $[0,\\frac{\\pi}{2}]$에서 교점을 구한다. $\\cos x=\\sin 2x=2\\sin x\\cos x$에서 $\\cos x(1-2\\sin x)=0$이므로 $x=\\frac{\\pi}{6}$이다.\n$S_1$은 두 곡선과 $y$축으로 둘러싸인 넓이이므로 구간 $[0,\\frac{\\pi}{6}]$에서 적분한다.\n$$S_1=\\int_0^{\\frac{\\pi}{6}}(\\cos x-\\sin 2x)\\,dx=\\left[\\sin x+\\frac{1}{2}\\cos 2x\\right]_0^{\\frac{\\pi}{6}}=\\left(\\frac{1}{2}+\\frac{1}{4}\\right)-\\left(0+\\frac{1}{2}\\right)=\\frac{1}{4}$$\n$S_2$는 두 곡선과 $x$축으로 둘러싸인 넓이이므로 $x$축과 곡선 사이를 교점 기준으로 나누어 적분한다.\n$[0,\\frac{\\pi}{6}]$에서는 $y=\\sin 2x$가, $[\\frac{\\pi}{6},\\frac{\\pi}{2}]$에서는 $y=\\cos x$가 경계가 된다.\n$$\\int_0^{\\frac{\\pi}{6}}\\sin 2x\\,dx=\\left[-\\frac{1}{2}\\cos 2x\\right]_0^{\\frac{\\pi}{6}}=-\\frac{1}{4}+\\frac{1}{2}=\\frac{1}{4}$$\n$$\\int_{\\frac{\\pi}{6}}^{\\frac{\\pi}{2}}\\cos x\\,dx=\\left[\\sin x\\right]_{\\frac{\\pi}{6}}^{\\frac{\\pi}{2}}=1-\\frac{1}{2}=\\frac{1}{2}$$\n따라서 $S_2=\\frac{1}{4}+\\frac{1}{2}=\\frac{3}{4}$이다.\n비를 계산하면 $\\frac{S_2}{S_1}=\\frac{3/4}{1/4}=3$이다.\n주의: $S_2$는 두 곡선의 차가 아니라 $x$축과 곡선 사이의 넓이이므로 적분식을 바르게 세운다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-102",
    "problemTypeKey": "PT_AREA_BY_DEFINITE_INTEGRAL",
    "templateKey": "TPL_INTERSECTION_SIGN_AREA",
    "crossConceptKeys": [
      "CC_TRIGONOMETRIC_EQUATION",
      "CC_DEFINITE_INTEGRAL_AREA_DECOMPOSITION"
    ],
    "conditionKeys": [
      "COND_RESTRICTED_INTERVAL"
    ],
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
    "content": "두 곡선 $y=\\frac{1}{\\sqrt{x}}, y=\\sqrt{x}$와 두 직선 $x=\\frac{1}{4}, x=4$로 둘러싸인 도형의 넓이는?",
    "choices": [
      "$\\frac{29}{12}$",
      "$\\frac{31}{12}$",
      "$\\frac{11}{4}$",
      "$\\frac{35}{12}$",
      "$\\frac{37}{12}$"
    ],
    "answer": "⑤",
    "solution": "교점을 구한다. $\\frac{1}{\\sqrt{x}}=\\sqrt{x}$의 양변에 $\\sqrt{x}$를 곱하면 $1=x$이므로 $x=1$이다.\n(i) $[\\frac{1}{4},1]$에서는 $\\frac{1}{\\sqrt{x}}\\ge\\sqrt{x}$이므로 $$S_1=\\int_{\\frac{1}{4}}^{1}(x^{-1/2}-x^{1/2})\\,dx=\\left[2x^{1/2}-\\frac{2}{3}x^{3/2}\\right]_{\\frac{1}{4}}^{1}=\\frac{4}{3}-\\left(1-\\frac{1}{12}\\right)=\\frac{5}{12}$$이다.\n(ii) $[1,4]$에서는 $\\sqrt{x}\\ge\\frac{1}{\\sqrt{x}}$이므로 $$S_2=\\int_1^4(x^{1/2}-x^{-1/2})\\,dx=\\left[\\frac{2}{3}x^{3/2}-2x^{1/2}\\right]_1^4=\\left(\\frac{16}{3}-4\\right)-\\left(\\frac{2}{3}-2\\right)=\\frac{8}{3}$$이다.\n$\\frac{8}{3}=\\frac{32}{12}$로 통분하여 더하면 $S=\\frac{5}{12}+\\frac{32}{12}=\\frac{37}{12}$이다.\n주의: $\\left(\\frac{1}{4}\\right)^{3/2}=\\left(\\frac{1}{2}\\right)^3=\\frac{1}{8}$과 같이 분수 지수를 정확히 계산한다.\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-102",
    "problemTypeKey": "PT_AREA_BY_DEFINITE_INTEGRAL",
    "templateKey": "TPL_INTERSECTION_SIGN_AREA",
    "crossConceptKeys": [
      "CC_RADICAL_FUNCTION",
      "CC_DEFINITE_INTEGRAL_AREA_DECOMPOSITION"
    ],
    "conditionKeys": [],
    "integrationPattern": "CASE_BRANCH"
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
    "content": "두 곡선 $y=e^{2x}, y=e^{-2x}$과 두 직선 $x=-1, x=1$로 둘러싸인 도형의 넓이는?",
    "choices": [
      "$e^2 + \\frac{1}{e^2} - 2$",
      "$e^2 + \\frac{1}{e^2} - 1$",
      "$e^2 + \\frac{1}{e^2}$",
      "$e^2 + \\frac{1}{e^2} + 1$",
      "$e^2 + \\frac{1}{e^2} + 2$"
    ],
    "answer": "①",
    "solution": "교점을 구한다. $e^{2x}=e^{-2x}$에서 $e^{4x}=1$이므로 $x=0$이다.\n$f(x)=|e^{2x}-e^{-2x}|$는 $f(-x)=f(x)$인 우함수이므로 그래프가 $y$축에 대하여 대칭이다.\n따라서 구하는 넓이는 $[0,1]$에서의 적분의 2배이다: $S=2\\int_0^1|e^{2x}-e^{-2x}|\\,dx$.\n$[0,1]$에서 $e^{2x}\\ge e^{-2x}$이므로 절댓값을 그대로 벗긴다: $S=2\\int_0^1(e^{2x}-e^{-2x})\\,dx$.\n$$2\\int_0^1(e^{2x}-e^{-2x})\\,dx=2\\left[\\frac{1}{2}e^{2x}+\\frac{1}{2}e^{-2x}\\right]_0^1=2\\left(\\frac{1}{2}e^2+\\frac{1}{2}e^{-2}-1\\right)$$\n이를 정리하면 $S=e^2+e^{-2}-2=e^2+\\frac{1}{e^2}-2$이다.\n따라서 정답은 ①이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-102",
    "problemTypeKey": "PT_AREA_BY_DEFINITE_INTEGRAL",
    "templateKey": "TPL_INTERSECTION_SIGN_AREA",
    "crossConceptKeys": [
      "CC_EXPONENTIAL_FUNCTION_GRAPH",
      "CC_ODD_EVEN_FUNCTION_INTEGRATION"
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
    "content": "두 곡선 $y=2\\ln x, y=-\\ln x$와 두 직선 $x=\\frac{1}{e}, x=e$로 둘러싸인 도형의 넓이는?",
    "choices": [
      "$4 - \\frac{4}{e}$",
      "$6 - \\frac{6}{e}$",
      "$8 - \\frac{8}{e}$",
      "$10 - \\frac{10}{e}$",
      "$12 - \\frac{12}{e}$"
    ],
    "answer": "②",
    "solution": "교점을 구한다. $2\\ln x=-\\ln x$에서 $3\\ln x=0$이므로 $x=1$이다.\n(i) $[\\frac{1}{e},1]$에서는 $\\ln x\\le0$이므로 $-\\ln x\\ge2\\ln x$이다. 부분적분법 $\\int\\ln x\\,dx=x\\ln x-x$를 쓴다.\n$$S_1=\\int_{\\frac{1}{e}}^{1}(-\\ln x-2\\ln x)\\,dx=-3\\left[x\\ln x-x\\right]_{\\frac{1}{e}}^{1}=-3\\left[-1-\\left(-\\frac{2}{e}\\right)\\right]=3-\\frac{6}{e}$$\n(ii) $[1,e]$에서는 $\\ln x\\ge0$이므로 $2\\ln x\\ge-\\ln x$이다.\n$$S_2=\\int_1^e(2\\ln x+\\ln x)\\,dx=3\\left[x\\ln x-x\\right]_1^e=3\\left[(e-e)-(0-1)\\right]=3$$\n두 넓이를 더하면 $S=\\left(3-\\frac{6}{e}\\right)+3=6-\\frac{6}{e}$이다.\n주의: $\\ln\\frac{1}{e}=-1$이므로 $\\frac{1}{e}\\ln\\frac{1}{e}-\\frac{1}{e}=-\\frac{1}{e}-\\frac{1}{e}=-\\frac{2}{e}$이다.\n따라서 정답은 ②이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-102",
    "problemTypeKey": "PT_AREA_BY_DEFINITE_INTEGRAL",
    "templateKey": "TPL_INTERSECTION_SIGN_AREA",
    "crossConceptKeys": [
      "CC_LOGARITHMIC_FUNCTION_GRAPH",
      "CC_INTEGRATION_BY_PARTS_OR_EXPANSION"
    ],
    "conditionKeys": [],
    "integrationPattern": "CASE_BRANCH"
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
    "content": "두 곡선 $y=e^x - 3, y=4e^{-x}$ 및 $y$축으로 둘러싸인 도형의 넓이는?",
    "choices": [
      "$2\\ln 3$",
      "$4\\ln 2$",
      "$6\\ln 2$",
      "$4\\ln 3$",
      "$6\\ln 3$"
    ],
    "answer": "③",
    "solution": "교점을 구한다. $e^x-3=4e^{-x}$의 양변에 $e^x$를 곱하면 $(e^x)^2-3e^x-4=0$이다.\n인수분해하면 $(e^x-4)(e^x+1)=0$이고 $e^x>0$이므로 $e^x=4$, 즉 $x=\\ln4=2\\ln2$이다.\n경계는 $y$축 $x=0$과 교점 $x=\\ln4$이고, $[0,\\ln4]$에서 $4e^{-x}\\ge e^x-3$이다.\n$$S=\\int_0^{\\ln4}(4e^{-x}-e^x+3)\\,dx=\\left[-4e^{-x}-e^x+3x\\right]_0^{\\ln4}$$\n위끝을 대입하면 $-4\\cdot\\frac{1}{4}-4+3\\ln4=-5+6\\ln2$이다.\n아래끝을 대입하면 $-4-1+0=-5$이다.\n차를 계산하면 $S=(-5+6\\ln2)-(-5)=6\\ln2$이다.\n따라서 정답은 ③이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-102",
    "problemTypeKey": "PT_AREA_BY_DEFINITE_INTEGRAL",
    "templateKey": "TPL_INTERSECTION_SIGN_AREA",
    "crossConceptKeys": [
      "CC_EXPONENTIAL_FUNCTION_GRAPH",
      "CC_GRAPH_INTERSECTION"
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
    "content": "그림과 같이 곡선 $y=\\frac{8x}{x^2+4}$와 직선 $y=x$로 둘러싸인 도형의 넓이는?\n\n[그림: 좌표평면에서 곡선 $y=\\frac{8x}{x^2+4}$와 직선 $y=x$가 세 점 $(-2, -2)$, $(0, 0)$, $(2, 2)$에서 만나며, 원점에 대하여 대칭인 두 영역이 색칠되어 있다.]",
    "choices": [
      "$6\\ln 2 - 4$",
      "$8\\ln 2 - 4$",
      "$10\\ln 2 - 4$",
      "$8\\ln 2 - 2$",
      "$10\\ln 2 - 2$"
    ],
    "answer": "②",
    "solution": "교점을 구한다. $\\frac{8x}{x^2+4}=x$에서 $x\\left(\\frac{8}{x^2+4}-1\\right)=0$, 즉 $x(4-x^2)=0$이므로 $x=-2,0,2$이다.\n$f(x)=\\frac{8x}{x^2+4}$와 $g(x)=x$는 모두 기함수이므로 둘러싸인 도형은 원점에 대하여 대칭이다.\n따라서 $[0,2]$의 넓이를 구해 2배 한다. $[0,2]$에서 $\\frac{8x}{x^2+4}\\ge x$이다.\n치환적분법 $\\int\\frac{g'(x)}{g(x)}\\,dx=\\ln|g(x)|$를 쓰면 $8x=4\\cdot2x$이므로\n$$S_1=\\int_0^2\\left(\\frac{8x}{x^2+4}-x\\right)dx=\\left[4\\ln(x^2+4)-\\frac{1}{2}x^2\\right]_0^2=(4\\ln8-2)-4\\ln4=4\\ln2-2$$\n대칭성에 의해 전체 넓이는 $S=2(4\\ln2-2)=8\\ln2-4$이다.\n주의: $\\ln8-\\ln4=\\ln2$로 묶어 정리한다.\n따라서 정답은 ②이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-102",
    "problemTypeKey": "PT_AREA_BY_DEFINITE_INTEGRAL",
    "templateKey": "TPL_INTERSECTION_SIGN_AREA",
    "crossConceptKeys": [
      "CC_RATIONAL_FUNCTION",
      "CC_ODD_EVEN_FUNCTION_INTEGRATION",
      "CC_GRAPH_INTERSECTION"
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
    "content": "그림에서 두 곡선 $y=2e^x, y=xe^x$과 $y$축으로 둘러싸인 부분 $A$의 넓이를 $a$, 두 곡선 $y=2e^x, y=xe^x$과 직선 $x=3$으로 둘러싸인 부분 $B$의 넓이를 $b$라 할 때, $b-a$의 값은?\n\n[그림: 좌표평면에서 두 곡선 $y=2e^x$와 $y=xe^x$가 점 $(2, 2e^2)$에서 만난다. $y$축과 두 곡선으로 둘러싸인 영역을 $A$, 두 곡선과 직선 $x=3$으로 둘러싸인 영역을 $B$로 나타낸다.]",
    "choices": [
      "$1$",
      "$2$",
      "$3$",
      "$4$",
      "$5$"
    ],
    "answer": "③",
    "solution": "교점을 구한다. $2e^x=xe^x$에서 $(x-2)e^x=0$이므로 $x=2$이다.\n$A$는 $y$축과 두 곡선 사이의 영역이고 $[0,2]$에서 $2e^x\\ge xe^x$이므로 $a=\\int_0^2(2e^x-xe^x)\\,dx$이다.\n$B$는 $x=3$과 두 곡선 사이의 영역이고 $[2,3]$에서 $xe^x\\ge2e^x$이므로 $b=\\int_2^3(xe^x-2e^x)\\,dx$이다.\n$b-a$를 하나의 정적분으로 합친다.\n$$b-a=\\int_2^3(x-2)e^x\\,dx+\\int_0^2(x-2)e^x\\,dx=\\int_0^3(x-2)e^x\\,dx$$\n부분적분법 $\\int uv'\\,dx=uv-\\int u'v\\,dx$에서 $u=x-2$, $v'=e^x$로 두면 $\\int(x-2)e^x\\,dx=(x-2)e^x-e^x=(x-3)e^x$이다.\n$$b-a=\\left[(x-3)e^x\\right]_0^3=(3-3)e^3-(0-3)e^0=3$$\n주의: $a,b$를 따로 계산하면 $e^2$ 항이 남지만 하나로 합치면 소거된다.\n따라서 정답은 ③이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B45",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-102",
    "problemTypeKey": "PT_AREA_BY_DEFINITE_INTEGRAL",
    "templateKey": "TPL_INTERSECTION_SIGN_AREA",
    "crossConceptKeys": [
      "CC_INTEGRATION_BY_PARTS_OR_EXPANSION",
      "CC_EXPONENTIAL_FUNCTION_GRAPH",
      "CC_GRAPH_INTERSECTION"
    ],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
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
    "content": "그림과 같이 두 곡선 $y=(\\cos x)\\ln x, y=-\\frac{\\sin x}{x}$와 두 직선 $x=1, x=\\frac{\\pi}{2}$로 둘러싸인 부분의 넓이는?\n\n[그림: 닫힌구간 $[1, \\pi/2]$에서 곡선 $y=(\\cos x)\\ln x$는 점 $(1, 0)$에서 시작하여 제1사분면에 그려지고, 곡선 $y=-\\frac{\\sin x}{x}$는 제4사분면에 그려지며, 두 곡선과 두 직선 $x=1, x=\\pi/2$로 둘러싸인 영역이 색칠되어 있다.]",
    "choices": [
      "$\\frac{1}{4}\\ln\\frac{\\pi}{2}$",
      "$\\frac{1}{2}\\ln\\frac{\\pi}{2}$",
      "$\\frac{3}{4}\\ln\\frac{\\pi}{2}$",
      "$\\ln\\frac{\\pi}{2}$",
      "$\\frac{5}{4}\\ln\\frac{\\pi}{2}$"
    ],
    "answer": "④",
    "solution": "$[1,\\frac{\\pi}{2}]$에서 $\\cos x\\ge0$, $\\ln x\\ge0$이므로 $(\\cos x)\\ln x\\ge0$이고, $\\sin x>0$, $x>0$이므로 $-\\frac{\\sin x}{x}<0$이다.\n따라서 위쪽 곡선은 $y=(\\cos x)\\ln x$이고 넓이는 $$S=\\int_1^{\\frac{\\pi}{2}}\\left((\\cos x)\\ln x+\\frac{\\sin x}{x}\\right)dx$$이다.\n함수의 곱의 미분법으로 $\\left(\\sin x\\ln x\\right)'=(\\cos x)\\ln x+\\sin x\\cdot\\frac{1}{x}$임을 확인한다.\n즉 피적분함수가 $\\left(\\sin x\\ln x\\right)'$이므로\n$$S=\\left[\\sin x\\ln x\\right]_1^{\\frac{\\pi}{2}}=\\sin\\frac{\\pi}{2}\\ln\\frac{\\pi}{2}-\\sin1\\ln1=\\ln\\frac{\\pi}{2}$$\n주의: 두 항을 따로 적분하지 말고 곱의 미분법 결과를 역으로 이용한다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B45",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-102",
    "problemTypeKey": "PT_AREA_BY_DEFINITE_INTEGRAL",
    "templateKey": "TPL_INTERSECTION_SIGN_AREA",
    "crossConceptKeys": [
      "CC_INTEGRATION_BY_PARTS_OR_EXPANSION",
      "CC_LOGARITHMIC_FUNCTION_GRAPH"
    ],
    "conditionKeys": [],
    "integrationPattern": "REINTERPRETATION"
  }
];
