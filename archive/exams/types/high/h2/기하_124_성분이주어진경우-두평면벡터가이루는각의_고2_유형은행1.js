window.examTitle = "기하_124_성분이주어진경우-두평면벡터가이루는각의_고2_유형은행1";

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
    "content": "두 평면벡터 $\\vec{a}=(-3, 1)$, $\\vec{b}=(5, 5)$에 대하여 두 벡터 $\\vec{a}+\\vec{b}$, $\\vec{a}-\\vec{b}$가 이루는 각의 크기를 $\\theta$라 할 때, $\\theta$의 값은? (단, $0^\\circ \\le \\theta \\le 180^\\circ$)",
    "choices": [
      "$30^\\circ$",
      "$45^\\circ$",
      "$60^\\circ$",
      "$120^\\circ$",
      "$135^\\circ$"
    ],
    "answer": "⑤",
    "solution": "1단계: 두 벡터 $\\vec{a}+\\vec{b}$와 $\\vec{a}-\\vec{b}$의 성분을 각각 계산한다.\n$\\vec{a}+\\vec{b} = (-3+5, 1+5) = (2, 6)$\n$\\vec{a}-\\vec{b} = (-3-5, 1-5) = (-8, -4)$\n2단계: 두 벡터의 크기를 각각 구한다 (벡터의 크기 공식).\n$|\\vec{a}+\\vec{b}| = \\sqrt{2^2 + 6^2} = \\sqrt{4 + 36} = \\sqrt{40} = 2\\sqrt{10}$\n$|\\vec{a}-\\vec{b}| = \\sqrt{(-8)^2 + (-4)^2} = \\sqrt{64 + 16} = \\sqrt{80} = 4\\sqrt{5}$\n3단계: 두 벡터의 내적을 성분으로 계산한다 (두 평면벡터의 내적 공식).\n$(\\vec{a}+\\vec{b}) \\cdot (\\vec{a}-\\vec{b}) = 2 \\times (-8) + 6 \\times (-4) = -16 - 24 = -40$\n4단계: 두 평면벡터가 이루는 각의 코사인 공식에 대입한다.\n$\\cos\\theta = \\frac{(\\vec{a}+\\vec{b}) \\cdot (\\vec{a}-\\vec{b})}{|\\vec{a}+\\vec{b}||\\vec{a}-\\vec{b}|} = \\frac{-40}{2\\sqrt{10} \\times 4\\sqrt{5}} = \\frac{-40}{8\\sqrt{50}} = \\frac{-40}{40\\sqrt{2}} = -\\frac{1}{\\sqrt{2}} = -\\frac{\\sqrt{2}}{2}$\n5단계: 각의 범위를 확인하여 $\\theta$를 결정한다.\n$0^\\circ \\le \\theta \\le 180^\\circ$에서 $\\cos\\theta = -\\frac{\\sqrt{2}}{2}$이므로 $\\theta = 180^\\circ - 45^\\circ = 135^\\circ$이다.\n주의: 내적이 음수이므로 두 벡터가 이루는 각 $\\theta$는 둔각이다.\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-GEO-RPM-074",
    "problemTypeKey": "PT_GEO_PLANE_VECTOR",
    "templateKey": "TPL_GEO_PLANE_VECTOR_ANGLE",
    "crossConceptKeys": [
      "CC_SPECIAL_ANGLES"
    ],
    "conditionKeys": [
      "COND_RANGE"
    ],
    "integrationPattern": "SEQUENTIAL"
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
    "content": "두 평면벡터 $\\vec{a}, \\vec{b}$에 대하여 $\\vec{a}=(2, 1)$, $3\\vec{a}-2\\vec{b}=(2, 5)$를 만족할 때, 두 벡터 $\\vec{a}, \\vec{b}$가 이루는 각의 크기를 $\\theta$라 하자. $\\cos\\theta$의 값은?",
    "choices": [
      "$\\frac{1}{5}$",
      "$\\frac{2}{5}$",
      "$\\frac{1}{2}$",
      "$\\frac{3}{5}$",
      "$\\frac{4}{5}$"
    ],
    "answer": "④",
    "solution": "1단계: 주어진 관계식으로부터 벡터 $\\vec{b}$의 성분을 구한다.\n$3\\vec{a} - 2\\vec{b} = (2, 5)$에서 $2\\vec{b} = 3\\vec{a} - (2, 5)$이다.\n$\\vec{a}=(2, 1)$을 대입하면\n$2\\vec{b} = 3(2, 1) - (2, 5) = (6, 3) - (2, 5) = (4, -2)$\n양변을 2로 나누면 $\\vec{b} = (2, -1)$이다.\n2단계: 두 벡터 $\\vec{a}, \\vec{b}$의 크기를 각각 구한다 (벡터의 크기 공식).\n$|\\vec{a}| = \\sqrt{2^2 + 1^2} = \\sqrt{4 + 1} = \\sqrt{5}$\n$|\\vec{b}| = \\sqrt{2^2 + (-1)^2} = \\sqrt{4 + 1} = \\sqrt{5}$\n3단계: 두 벡터 $\\vec{a}, \\vec{b}$의 내적을 구한다 (두 평면벡터의 내적 공식).\n$\\vec{a} \\cdot \\vec{b} = 2 \\times 2 + 1 \\times (-1) = 4 - 1 = 3$\n4단계: 두 벡터가 이루는 각의 코사인 공식에 대입한다.\n$\\cos\\theta = \\frac{\\vec{a} \\cdot \\vec{b}}{|\\vec{a}||\\vec{b}|} = \\frac{3}{\\sqrt{5} \\times \\sqrt{5}} = \\frac{3}{5}$\n따라서 정답은 ④이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-GEO-RPM-074",
    "problemTypeKey": "PT_GEO_PLANE_VECTOR",
    "templateKey": "TPL_GEO_PLANE_VECTOR_ANGLE",
    "crossConceptKeys": [],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 3,
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
    "content": "세 평면벡터 $\\vec{a}=(2, -2)$, $\\vec{b}=(1, 1)$, $\\vec{c}=(0, -1)$에 대하여 두 벡터 $\\vec{a}+\\vec{b}$, $\\vec{b}-\\vec{c}$가 이루는 각의 크기를 $\\theta$라 할 때, $\\cos\\theta$의 값은? (단, $0 \\le \\theta \\le \\pi$)",
    "choices": [
      "$\\frac{\\sqrt{2}}{10}$",
      "$\\frac{\\sqrt{5}}{10}$",
      "$\\frac{\\sqrt{7}}{10}$",
      "$\\frac{\\sqrt{2}}{5}$",
      "$\\frac{\\sqrt{10}}{10}$"
    ],
    "answer": "①",
    "solution": "1단계: 두 벡터 $\\vec{a}+\\vec{b}$와 $\\vec{b}-\\vec{c}$의 성분을 각각 구한다.\n$\\vec{a}+\\vec{b} = (2+1, -2+1) = (3, -1)$\n$\\vec{b}-\\vec{c} = (1-0, 1-(-1)) = (1, 2)$\n2단계: 두 벡터의 크기를 각각 계산한다 (벡터의 크기 공식).\n$|\\vec{a}+\\vec{b}| = \\sqrt{3^2 + (-1)^2} = \\sqrt{9 + 1} = \\sqrt{10}$\n$|\\vec{b}-\\vec{c}| = \\sqrt{1^2 + 2^2} = \\sqrt{1 + 4} = \\sqrt{5}$\n3단계: 두 벡터의 내적을 계산한다 (성분에 의한 내적 공식).\n$(\\vec{a}+\\vec{b}) \\cdot (\\vec{b}-\\vec{c}) = 3 \\times 1 + (-1) \\times 2 = 3 - 2 = 1$\n4단계: 두 벡터가 이루는 각의 코사인 공식에 대입하여 유리화한다.\n$\\cos\\theta = \\frac{(\\vec{a}+\\vec{b}) \\cdot (\\vec{b}-\\vec{c})}{|\\vec{a}+\\vec{b}||\\vec{b}-\\vec{c}|} = \\frac{1}{\\sqrt{10} \\times \\sqrt{5}} = \\frac{1}{\\sqrt{50}} = \\frac{1}{5\\sqrt{2}} = \\frac{\\sqrt{2}}{10}$\n주의: 보기는 크기순으로 배열되어 있으며, $\\frac{\\sqrt{2}}{5} = \\frac{2\\sqrt{2}}{10} = \\frac{\\sqrt{8}}{10}$이므로 $\\frac{\\sqrt{2}}{10} < \\frac{\\sqrt{5}}{10} < \\frac{\\sqrt{7}}{10} < \\frac{\\sqrt{2}}{5} < \\frac{\\sqrt{10}}{10}$이다.\n따라서 정답은 ①이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-GEO-RPM-074",
    "problemTypeKey": "PT_GEO_PLANE_VECTOR",
    "templateKey": "TPL_GEO_PLANE_VECTOR_ANGLE",
    "crossConceptKeys": [],
    "conditionKeys": [
      "COND_RANGE"
    ],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 4,
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
    "content": "두 평면벡터 $\\vec{a}=(x, 1)$, $\\vec{b}=(4, x-5)$에 대하여 $\\vec{a} \\cdot \\vec{b} = 5$이다. 두 벡터 $\\vec{a}, \\vec{b}$가 이루는 각의 크기를 $\\theta$라 할 때, $\\cos\\theta$의 값은? (단, $x$는 실수이다.)",
    "choices": [
      "$\\frac{1}{5}$",
      "$\\frac{\\sqrt{2}}{5}$",
      "$\\frac{\\sqrt{5}}{5}$",
      "$\\frac{2\\sqrt{2}}{5}$",
      "$\\frac{2\\sqrt{5}}{5}$"
    ],
    "answer": "③",
    "solution": "1단계: 성분으로 내적 식을 세워 실수 $x$의 값을 구한다.\n$\\vec{a} \\cdot \\vec{b} = x \\times 4 + 1 \\times (x - 5) = 4x + x - 5 = 5x - 5$\n주어진 조건 $\\vec{a} \\cdot \\vec{b} = 5$에서\n$5x - 5 = 5 \\implies 5x = 10 \\implies x = 2$\n2단계: $x=2$를 대입하여 두 벡터 $\\vec{a}, \\vec{b}$의 성분을 확정한다.\n$\\vec{a} = (2, 1)$\n$\\vec{b} = (4, 2 - 5) = (4, -3)$\n3단계: 두 벡터의 크기를 각각 구한다 (벡터의 크기 공식).\n$|\\vec{a}| = \\sqrt{2^2 + 1^2} = \\sqrt{4 + 1} = \\sqrt{5}$\n$|\\vec{b}| = \\sqrt{4^2 + (-3)^2} = \\sqrt{16 + 9} = \\sqrt{25} = 5$\n4단계: 두 벡터가 이루는 각의 코사인 공식에 대입한다.\n$\\cos\\theta = \\frac{\\vec{a} \\cdot \\vec{b}}{|\\vec{a}||\\vec{b}|} = \\frac{5}{\\sqrt{5} \\times 5} = \\frac{1}{\\sqrt{5}} = \\frac{\\sqrt{5}}{5}$\n따라서 정답은 ③이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-GEO-RPM-074",
    "problemTypeKey": "PT_GEO_PLANE_VECTOR",
    "templateKey": "TPL_GEO_PLANE_VECTOR_ANGLE",
    "crossConceptKeys": [],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 5,
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
    "content": "두 평면벡터 $\\vec{a}=(x-1, 1)$, $\\vec{b}=(-x, x-2)$에 대하여 $\\vec{b}-\\vec{a}$의 크기가 $\\sqrt{10}$이다. 두 벡터 $\\vec{a}, \\vec{b}$가 이루는 각의 크기를 $\\theta$라 할 때, $\\theta$의 값은? (단, $0^\\circ \\le \\theta \\le 180^\\circ$이고, $x > 0$이다.)",
    "choices": [
      "$45^\\circ$",
      "$60^\\circ$",
      "$120^\\circ$",
      "$135^\\circ$",
      "$150^\\circ$"
    ],
    "answer": "④",
    "solution": "1단계: 벡터 $\\vec{b}-\\vec{a}$의 성분을 구한다.\n$\\vec{b}-\\vec{a} = (-x - (x-1), x-2 - 1) = (-2x+1, x-3)$\n2단계: 크기 조건을 이용하여 $x$에 대한 이차방정식을 세운다 (벡터의 크기 공식).\n$|\\vec{b}-\\vec{a}|^2 = (-2x+1)^2 + (x-3)^2 = (4x^2 - 4x + 1) + (x^2 - 6x + 9) = 5x^2 - 10x + 10$\n$|\\vec{b}-\\vec{a}| = \\sqrt{10}$이므로 양변을 제곱하면\n$5x^2 - 10x + 10 = 10 \\implies 5x^2 - 10x = 0 \\implies 5x(x - 2) = 0$\n3단계: $x > 0$ 조건을 적용하여 $x$와 두 벡터의 성분을 결정한다.\n$x > 0$이므로 $x = 2$이다.\n$\\vec{a} = (2-1, 1) = (1, 1)$\n$\\vec{b} = (-2, 2-2) = (-2, 0)$\n4단계: 두 벡터의 크기와 내적을 구한다.\n$|\\vec{a}| = \\sqrt{1^2 + 1^2} = \\sqrt{2}$\n$|\\vec{b}| = \\sqrt{(-2)^2 + 0^2} = 2$\n$\\vec{a} \\cdot \\vec{b} = 1 \\times (-2) + 1 \\times 0 = -2$\n5단계: 두 평면벡터가 이루는 각의 코사인 공식으로 $\\theta$를 구한다.\n$\\cos\\theta = \\frac{\\vec{a} \\cdot \\vec{b}}{|\\vec{a}||\\vec{b}|} = \\frac{-2}{\\sqrt{2} \\times 2} = -\\frac{1}{\\sqrt{2}} = -\\frac{\\sqrt{2}}{2}$\n$0^\\circ \\le \\theta \\le 180^\\circ$에서 $\\cos\\theta = -\\frac{\\sqrt{2}}{2}$이므로 $\\theta = 180^\\circ - 45^\\circ = 135^\\circ$이다.\n주의: $\\cos\\theta$가 음수이므로 예각인 $45^\\circ$가 아닌 둔각 $135^\\circ$이다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-GEO-RPM-074",
    "problemTypeKey": "PT_GEO_PLANE_VECTOR",
    "templateKey": "TPL_GEO_PLANE_VECTOR_ANGLE",
    "crossConceptKeys": [
      "CC_SPECIAL_ANGLES"
    ],
    "conditionKeys": [
      "COND_RANGE",
      "COND_POSITIVE"
    ],
    "integrationPattern": "SEQUENTIAL"
  }
];
