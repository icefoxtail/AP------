window.examTitle = "미적분II_287_사이클로이드_고2_유형은행1";

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
    "content": "반지름의 길이가 $2$인 원이 $x$축을 따라 미끄러지지 않고 굴러갈 때, 원점에서 출발한 원 위의 한 점 $\\mathrm{P}$가 그리는 곡선을 매개변수 $t$로 나타내면\n$$x = 2(t - \\sin t), \\quad y = 2(1 - \\cos t) \\quad (0 \\le t \\le 2\\pi)$$\n이다. 이 곡선 위의 점 중 $y$좌표가 $3$인 서로 다른 두 점을 각각 $\\mathrm{A}$, $\\mathrm{B}$라 할 때, 점 $\\mathrm{P}$가 점 $\\mathrm{A}$에서 점 $\\mathrm{B}$까지 곡선을 따라 움직인 거리는? (단, 점 $\\mathrm{A}$의 $x$좌표가 점 $\\mathrm{B}$의 $x$좌표보다 작고, $1 - \\cos \\theta = 2\\sin^2 \\frac{\\theta}{2}$이다.)\n[그림: 좌표평면 위에 원점 $\\mathrm{O}$에서 시작하여 점 $(4\\pi, 0)$에서 끝나는 사이클로이드 곡선 $x=2(t-\\sin t), y=2(1-\\cos t)$ ($0 \\le t \\le 2\\pi$)의 한 주기가 그려져 있고, 직선 $y=3$이 곡선과 만나는 두 점 $\\mathrm{A}, \\mathrm{B}$ ($x_{\\mathrm{A}} < x_{\\mathrm{B}}$)가 표시되어 있으며, 두 점 $\\mathrm{A}, \\mathrm{B}$ 사이의 곡선 부분이 굵은 실선으로 강조되어 있다.]",
    "choices": [
      "4",
      "5",
      "6",
      "7",
      "8"
    ],
    "answer": "⑤",
    "solution": "$y$좌표 조건 대입: $y=2(1-\\cos t)=3$에서 $1-\\cos t=\\frac{3}{2}$, 즉 $\\cos t=-\\frac{1}{2}$이다.\n$0\\le t\\le 2\\pi$에서 $\\cos t=-\\frac{1}{2}$의 해: $t=\\frac{2\\pi}{3}$ 또는 $t=\\frac{4\\pi}{3}$이다.\n매개변수 미분법으로 $\\frac{dx}{dt}=2(1-\\cos t)\\ge 0$이므로 $x$는 $t$에 대해 증가하고, $x_{\\mathrm{A}}<x_{\\mathrm{B}}$에서 $t_{\\mathrm{A}}=\\frac{2\\pi}{3}$, $t_{\\mathrm{B}}=\\frac{4\\pi}{3}$이다.\n매개변수로 나타내어진 곡선의 길이 공식: $l=\\int_{t_{\\mathrm{A}}}^{t_{\\mathrm{B}}}\\sqrt{\\left(\\frac{dx}{dt}\\right)^{2}+\\left(\\frac{dy}{dt}\\right)^{2}}\\,dt$.\n각 도함수 계산: $\\frac{dx}{dt}=2(1-\\cos t)$, $\\frac{dy}{dt}=2\\sin t$이다.\n제곱의 합 전개: $4(1-\\cos t)^{2}+4\\sin^{2}t=4\\left(1-2\\cos t+\\cos^{2}t+\\sin^{2}t\\right)$.\n삼각함수의 기본 성질 $\\cos^{2}t+\\sin^{2}t=1$ 대입: $4(2-2\\cos t)=8(1-\\cos t)$.\n반각공식 $1-\\cos t=2\\sin^{2}\\frac{t}{2}$ 대입: $8\\cdot 2\\sin^{2}\\frac{t}{2}=16\\sin^{2}\\frac{t}{2}$.\n주의: $\\frac{\\pi}{3}\\le\\frac{t}{2}\\le\\frac{2\\pi}{3}$에서 $\\sin\\frac{t}{2}>0$이므로 $\\sqrt{16\\sin^{2}\\frac{t}{2}}=4\\sin\\frac{t}{2}$이다.\n적분식 정리: $l=\\int_{2\\pi/3}^{4\\pi/3}4\\sin\\frac{t}{2}\\,dt$.\n부정적분 계산: $\\int 4\\sin\\frac{t}{2}\\,dt=-8\\cos\\frac{t}{2}+C$.\n정적분 계산: $l=\\left[-8\\cos\\frac{t}{2}\\right]_{2\\pi/3}^{4\\pi/3}=-8\\cos\\frac{2\\pi}{3}+8\\cos\\frac{\\pi}{3}$.\n값 대입: $-8\\cdot\\left(-\\frac{1}{2}\\right)+8\\cdot\\frac{1}{2}=4+4=8$.\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-197",
    "problemTypeKey": "PT_CALCULUS_CURVE_LENGTH",
    "templateKey": "TPL_CALCULUS_CURVE_LENGTH_PARAMETRIC",
    "crossConceptKeys": [
      "CC_TRIGONOMETRIC_EQUATION",
      "CC_TRIGONOMETRIC_IDENTITY"
    ],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
  }
];
