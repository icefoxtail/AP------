window.examTitle = "기하_121_평면벡터내적의부호의활용_고2_유형은행1";

window.questionBank = [
  {
    "id": 1,
    "category": "벡터의 내적",
    "standardCourse": "기하",
    "curriculum": "2022",
    "standardUnitKey": "H22-GE-07",
    "standardUnit": "벡터의 내적",
    "standardUnitOrder": 7,
    "subUnitKey": "H22-GE-07-VECTOR_DOT",
    "subUnit": "벡터의 내적",
    "subUnitConfidence": "candidate_evidence",
    "subUnitClassificationDepth": "complete_candidate",
    "conceptClusterKey": "H22_GE_07_VECTOR_DOT",
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "벡터의 내적"
    ],
    "wide": false,
    "content": "두 점 $\\mathrm{A}(4, 0), \\mathrm{B}(0, 4)$에 대하여 좌표평면 위의 점 $\\mathrm{P}$가\n$$-4 \\le \\vec{\\mathrm{PA}}\\cdot\\vec{\\mathrm{PB}} \\le 0$$\n을 만족시킬 때, 점 $\\mathrm{P}$가 나타내는 영역의 넓이는?",
    "choices": [
      "\\pi",
      "2\\pi",
      "3\\pi",
      "4\\pi",
      "5\\pi"
    ],
    "answer": "④",
    "solution": "[선분의 중점을 시점으로 변환] 선분 $\\mathrm{AB}$의 중점을 $\\mathrm{M}$이라 하면 $\\mathrm{M}\\left(\\frac{4+0}{2}, \\frac{0+4}{2}\\right) = (2, 2)$이다.\n[벡터의 분해] 점 $\\mathrm{P}$에 대하여 $\\vec{\\mathrm{PA}} = \\vec{\\mathrm{PM}} + \\vec{\\mathrm{MA}}$, $\\vec{\\mathrm{PB}} = \\vec{\\mathrm{PM}} + \\vec{\\mathrm{MB}}$로 나타낼 수 있다.\n[중점의 성질 이용] $\\mathrm{M}$이 선분 $\\mathrm{AB}$의 중점이므로 $\\vec{\\mathrm{MB}} = -\\vec{\\mathrm{MA}}$이다.\n[내적의 곱셈 공식 전개] $\\vec{\\mathrm{PA}}\\cdot\\vec{\\mathrm{PB}} = (\\vec{\\mathrm{PM}} + \\vec{\\mathrm{MA}})\\cdot(\\vec{\\mathrm{PM}} - \\vec{\\mathrm{MA}}) = |\\vec{\\mathrm{PM}}|^2 - |\\vec{\\mathrm{MA}}|^2$이다.\n[선분 길이의 제곱 계산] $|\\vec{\\mathrm{MA}}|^2 = (4-2)^2 + (0-2)^2 = 2^2 + (-2)^2 = 4 + 4 = 8$이다.\n[부등식에 대입 및 정리] 주어진 부등식에 대입하면 $-4 \\le |\\vec{\\mathrm{PM}}|^2 - 8 \\le 0$이다.\n[거리의 범위 도출] 각 변에 $8$을 더하면 $4 \\le |\\vec{\\mathrm{PM}}|^2 \\le 8$이므로, 거리 $|\\vec{\\mathrm{PM}}|$의 범위는 $2 \\le |\\vec{\\mathrm{PM}}| \\le 2\\sqrt{2}$이다.\n[영역의 기하학적 형태] 점 $\\mathrm{P}$가 나타내는 영역은 중심이 $\\mathrm{M}(2, 2)$이고 반지름의 길이가 $2$ 이상 $2\\sqrt{2}$ 이하인 두 동심원 사이의 원환 영역이다.\n[원환의 넓이 계산] 구하는 영역의 넓이 $S$는 큰 원의 넓이에서 작은 원의 넓이를 뺀 것이므로 $S = \\pi \\times (2\\sqrt{2})^2 - \\pi \\times 2^2 = 8\\pi - 4\\pi = 4\\pi$이다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-GEO-RPM-074",
    "problemTypeKey": "PT_GEO_PLANE_VECTOR",
    "templateKey": "TPL_GEO_PLANE_VECTOR_DOT_ZERO",
    "crossConceptKeys": [
      "CC_MIDPOINT",
      "CC_CIRCLE_CENTER_RADIUS",
      "CC_AREA"
    ],
    "conditionKeys": [
      "COND_RANGE"
    ],
    "integrationPattern": "REINTERPRETATION"
  },
  {
    "id": 2,
    "category": "벡터의 내적",
    "standardCourse": "기하",
    "curriculum": "2022",
    "standardUnitKey": "H22-GE-07",
    "standardUnit": "벡터의 내적",
    "standardUnitOrder": 7,
    "subUnitKey": "H22-GE-07-VECTOR_DOT",
    "subUnit": "벡터의 내적",
    "subUnitConfidence": "candidate_evidence",
    "subUnitClassificationDepth": "complete_candidate",
    "conceptClusterKey": "H22_GE_07_VECTOR_DOT",
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "벡터의 내적"
    ],
    "wide": false,
    "content": "그림은 중심이 원점 $\\mathrm{O}$이고 반지름의 길이가 $2$인 원 위의 한 점 $\\mathrm{A}(2, 0)$과 원 위를 움직이는 점 $\\mathrm{P}$를 나타낸 것이다. $\\vec{\\mathrm{OA}}=\\vec{a}, \\vec{\\mathrm{OP}}=\\vec{p}$라 할 때, <보기>에서 옳은 것만을 있는 대로 고른 것은?\n[그림: 좌표평면에서 중심이 원점 $\\mathrm{O}$이고 반지름의 길이가 $2$인 원이 그려져 있다. 점 $\\mathrm{A}$는 $(2, 0)$에 위치하고 벡터 $\\vec{a}=\\vec{\\mathrm{OA}}$가 표시되어 있다. 제1사분면 위의 원 위에 동점 $\\mathrm{P}$가 있고 벡터 $\\vec{p}=\\vec{\\mathrm{OP}}$가 표시되어 있으며 두 벡터가 이루는 각이 나타나 있다.]\n<보기>\nㄱ. $\\vec{a}\\cdot\\vec{p}=0$인 점 $\\mathrm{P}$의 개수는 $2$이다.\nㄴ. $\\vec{a}\\cdot\\vec{p}<0$인 점 $\\mathrm{P}$가 나타내는 도형의 길이는 $2\\pi$이다.\nㄷ. $|\\vec{a}\\cdot\\vec{p}|\\le 2$인 점 $\\mathrm{P}$가 나타내는 도형의 길이는 $\\frac{2}{3}\\pi$이다.",
    "choices": [
      "ㄱ",
      "ㄷ",
      "ㄱ, ㄴ",
      "ㄴ, ㄷ",
      "ㄱ, ㄴ, ㄷ"
    ],
    "answer": "③",
    "solution": "[내적의 정의] $|\\vec{a}| = 2$, $|\\vec{p}| = 2$이고 두 벡터가 이루는 각의 크기를 $\\theta$ ($0 \\le \\theta < 2\\pi$)라 하면 $\\vec{a}\\cdot\\vec{p} = |\\vec{a}||\\vec{p}|\\cos\\theta = 2 \\times 2 \\times \\cos\\theta = 4\\cos\\theta$이다.\n[ㄱ의 판별 (삼각방정식)] $\\vec{a}\\cdot\\vec{p}=0 \\iff 4\\cos\\theta = 0 \\iff \\cos\\theta = 0$이다.\n[ㄱ의 근 구하기] $0 \\le \\theta < 2\\pi$에서 $\\theta = \\frac{\\pi}{2}$ 또는 $\\theta = \\frac{3\\pi}{2}$이므로 조건을 만족하는 점 $\\mathrm{P}$는 $(0, 2), (0, -2)$의 $2$개이다. 그러므로 ㄱ은 참이다.\n[ㄴ의 판별 (삼각부등식)] $\\vec{a}\\cdot\\vec{p}<0 \\iff 4\\cos\\theta < 0 \\iff \\cos\\theta < 0$이다.\n[ㄴ의 각의 범위 및 호의 길이 계산] $0 \\le \\theta < 2\\pi$에서 $\\frac{\\pi}{2} < \\theta < \\frac{3\\pi}{2}$이므로 호의 중심각의 크기는 $\\frac{3\\pi}{2} - \\frac{\\pi}{2} = \\pi$이다. 반지름 $r=2$이므로 호의 길이는 $l = r\\theta = 2 \\times \\pi = 2\\pi$이다. 그러므로 ㄴ은 참이다.\n[ㄷ의 판별 (절댓값 부등식)] $|\\vec{a}\\cdot\\vec{p}|\\le 2 \\iff |4\\cos\\theta| \\le 2 \\iff |\\cos\\theta| \\le \\frac{1}{2}$이다.\n[ㄷ의 각의 범위 구하기] 부등식 $-\\frac{1}{2} \\le \\cos\\theta \\le \\frac{1}{2}$을 풀면 $\\frac{\\pi}{3} \\le \\theta \\le \\frac{2\\pi}{3}$ 또는 $\\frac{4\\pi}{3} \\le \\theta \\le \\frac{5\\pi}{3}$이다.\n[ㄷ의 중심각의 합] 두 호의 중심각의 크기는 각각 $\\frac{2\\pi}{3} - \\frac{\\pi}{3} = \\frac{\\pi}{3}$, $\\frac{5\\pi}{3} - \\frac{4\\pi}{3} = \\frac{\\pi}{3}$이므로 중심각의 합은 $\\frac{\\pi}{3} + \\frac{\\pi}{3} = \\frac{2\\pi}{3}$이다.\n주의: [호의 길이 공식 적용] 반지름이 $r=2$이므로 점 $\\mathrm{P}$가 나타내는 도형의 길이는 $l = r\\theta = 2 \\times \\frac{2\\pi}{3} = \\frac{4}{3}\\pi$이다. 따라서 $\\frac{2}{3}\\pi$라고 한 ㄷ은 거짓이다.\n[결론] 이상에서 옳은 것은 ㄱ, ㄴ이다.\n따라서 정답은 ③이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-GEO-RPM-074",
    "problemTypeKey": "PT_GEO_PLANE_VECTOR",
    "templateKey": "TPL_GEO_PLANE_VECTOR_DOT_ZERO",
    "crossConceptKeys": [
      "CC_CIRCLE_CENTER_RADIUS"
    ],
    "conditionKeys": [],
    "integrationPattern": "CASE_BRANCH"
  }
];
