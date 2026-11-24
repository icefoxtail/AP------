window.examTitle = "기하_138_방향벡터와법선벡터의위치관계_고2_유형은행1";

window.questionBank = [
  {
    "id": 1,
    "category": "도형의 방정식 핵심 개념",
    "standardCourse": "기하",
    "curriculum": "2022",
    "standardUnitKey": "H22-GE-08",
    "standardUnit": "도형의 방정식",
    "standardUnitOrder": 8,
    "subUnitKey": "H22-GE-08-CORE",
    "subUnit": "도형의 방정식 핵심 개념",
    "subUnitConfidence": "candidate_evidence",
    "subUnitClassificationDepth": "complete_candidate",
    "conceptClusterKey": "H22-GE-08-CORE",
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "도형의 방정식 핵심 개념"
    ],
    "wide": false,
    "content": "방향벡터가 $\\vec{u}=(1, 2)$이고, 법선벡터가 $\\vec{n}=(2, 1)$인 두 직선이 이루는 예각의 크기를 $\\theta$라 할 때, $\\cos\\theta$의 값은?",
    "choices": [
      "$\\frac{1}{5}$",
      "$\\frac{1}{3}$",
      "$\\frac{2}{5}$",
      "$\\frac{1}{2}$",
      "$\\frac{3}{5}$"
    ],
    "answer": "⑤",
    "solution": "방향벡터와 법선벡터가 이루는 각의 성질을 이용한다.\n직선 $l_1$의 방향벡터를 $\\vec{u}=(1, 2)$, 직선 $l_2$의 법선벡터를 $\\vec{n}=(2, 1)$이라 하자.\n두 벡터 $\\vec{u}$와 $\\vec{n}$이 이루는 각의 크기를 $\\alpha$라 하면 두 벡터의 내적 공식에 의해\n$\\cos\\alpha = \\frac{\\vec{u} \\cdot \\vec{n}}{|\\vec{u}||\\vec{n}|} = \\frac{1 \\times 2 + 2 \\times 1}{\\sqrt{1^2 + 2^2}\\sqrt{2^2 + 1^2}} = \\frac{2 + 2}{\\sqrt{5}\\sqrt{5}} = \\frac{4}{5}$\n두 직선이 이루는 예각의 크기 $\\theta$는 법선벡터와 방향벡터가 이루는 각 $\\alpha$와 $\\theta = |90^\\circ - \\alpha|$의 관계가 성립하므로\n$\\sin\\theta = |\\cos\\alpha| = \\frac{4}{5}$\n삼각함수의 기본 성질 $\\sin^2\\theta + \\cos^2\\theta = 1$에 대입하면\n$\\cos\\theta = \\sqrt{1 - \\sin^2\\theta} = \\sqrt{1 - \\left(\\frac{4}{5}\\right)^2} = \\sqrt{1 - \\frac{16}{25}} = \\sqrt{\\frac{9}{25}} = \\frac{3}{5}$\n주의: 두 직선의 방향벡터끼리의 각이 아니라 방향벡터와 법선벡터 사이의 각이므로 $\\sin\\theta$가 먼저 구해짐에 주의한다.\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-GEO-RPM-097",
    "problemTypeKey": "PT_GEO_VECTOR_LINE_CIRCLE",
    "templateKey": "TPL_GEO_VEC_LINE_RELATION",
    "crossConceptKeys": [],
    "conditionKeys": [],
    "integrationPattern": "NONE"
  },
  {
    "id": 2,
    "category": "도형의 방정식 핵심 개념",
    "standardCourse": "기하",
    "curriculum": "2022",
    "standardUnitKey": "H22-GE-08",
    "standardUnit": "도형의 방정식",
    "standardUnitOrder": 8,
    "subUnitKey": "H22-GE-08-CORE",
    "subUnit": "도형의 방정식 핵심 개념",
    "subUnitConfidence": "candidate_evidence",
    "subUnitClassificationDepth": "complete_candidate",
    "conceptClusterKey": "H22-GE-08-CORE",
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "도형의 방정식 핵심 개념"
    ],
    "wide": false,
    "content": "두 직선 $x - 2y + 4 = 0$, $\\frac{x - 3}{1} = \\frac{y + 1}{3}$이 이루는 예각의 크기를 $\\theta$라 할 때, $\\cos\\theta$의 값은?",
    "choices": [
      "$\\frac{\\sqrt{10}}{10}$",
      "$\\frac{\\sqrt{5}}{5}$",
      "$\\frac{\\sqrt{3}}{3}$",
      "$\\frac{\\sqrt{6}}{4}$",
      "$\\frac{\\sqrt{2}}{2}$"
    ],
    "answer": "⑤",
    "solution": "각 직선의 방향벡터를 구하여 두 직선이 이루는 각을 계산한다.\n직선 $l_1 : x - 2y + 4 = 0$의 법선벡터는 $\\vec{n} = (1, -2)$이므로, 직선 $l_1$의 방향벡터는 $\\vec{u}_1 = (2, 1)$이다.\n직선 $l_2 : \\frac{x - 3}{1} = \\frac{y + 1}{3}$의 방향벡터는 분모의 성분으로부터 $\\vec{u}_2 = (1, 3)$이다.\n두 벡터 $\\vec{u}_1, \\vec{u}_2$의 크기를 각각 구하면\n$|\\vec{u}_1| = \\sqrt{2^2 + 1^2} = \\sqrt{5}$, $|\\vec{u}_2| = \\sqrt{1^2 + 3^2} = \\sqrt{10}$\n두 방향벡터의 내적을 계산하면\n$\\vec{u}_1 \\cdot \\vec{u}_2 = 2 \\times 1 + 1 \\times 3 = 2 + 3 = 5$\n두 직선이 이루는 예각의 크기 $\\theta$에 대하여 벡터의 내적 정의를 적용하면\n$\\cos\\theta = \\frac{|\\vec{u}_1 \\cdot \\vec{u}_2|}{|\\vec{u}_1||\\vec{u}_2|} = \\frac{5}{\\sqrt{5}\\sqrt{10}} = \\frac{5}{\\sqrt{50}} = \\frac{5}{5\\sqrt{2}} = \\frac{1}{\\sqrt{2}} = \\frac{\\sqrt{2}}{2}$\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-GEO-RPM-097",
    "problemTypeKey": "PT_GEO_VECTOR_LINE_CIRCLE",
    "templateKey": "TPL_GEO_VEC_LINE_RELATION",
    "crossConceptKeys": [
      "CC_SLOPE",
      "CC_TRIGONOMETRIC_TANGENT"
    ],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 3,
    "category": "도형의 방정식 핵심 개념",
    "standardCourse": "기하",
    "curriculum": "2022",
    "standardUnitKey": "H22-GE-08",
    "standardUnit": "도형의 방정식",
    "standardUnitOrder": 8,
    "subUnitKey": "H22-GE-08-CORE",
    "subUnit": "도형의 방정식 핵심 개념",
    "subUnitConfidence": "candidate_evidence",
    "subUnitClassificationDepth": "complete_candidate",
    "conceptClusterKey": "H22-GE-08-CORE",
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "도형의 방정식 핵심 개념"
    ],
    "wide": false,
    "content": "두 직선 $3x + ky = 7$, $\\frac{x - 1}{4} = \\frac{2 - y}{3}$이 서로 평행할 때, 상수 $k$의 값은?",
    "choices": [
      "$1$",
      "$2$",
      "$3$",
      "$4$",
      "$5$"
    ],
    "answer": "④",
    "solution": "두 직선의 법선벡터와 방향벡터 사이의 위치관계를 이용한다.\n직선 $l_1 : 3x + ky - 7 = 0$의 법선벡터는 $\\vec{n} = (3, k)$이다.\n직선 $l_2 : \\frac{x - 1}{4} = \\frac{y - 2}{-3}$의 방향벡터는 $\\vec{u} = (4, -3)$이다.\n두 직선이 서로 평행하면 직선 $l_1$의 법선벡터 $\\vec{n}$과 직선 $l_2$의 방향벡터 $\\vec{u}$는 서로 수직이다.\n두 벡터가 수직일 조건에 의해 내적이 $0$이어야 하므로\n$\\vec{n} \\cdot \\vec{u} = 3 \\times 4 + k \\times (-3) = 12 - 3k = 0$\n일차방정식을 풀면\n$3k = 12 \\implies k = 4$\n주의: 직선의 방정식 $\\frac{2-y}{3}$에서 $y$의 계수를 $1$로 만들어 $\\frac{y-2}{-3}$으로 변형한 후 방향벡터의 $y$성분이 $-3$임을 확인해야 한다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-GEO-RPM-097",
    "problemTypeKey": "PT_GEO_VECTOR_LINE_CIRCLE",
    "templateKey": "TPL_GEO_VEC_LINE_RELATION",
    "crossConceptKeys": [
      "CC_SLOPE"
    ],
    "conditionKeys": [],
    "integrationPattern": "NONE"
  },
  {
    "id": 4,
    "category": "도형의 방정식 핵심 개념",
    "standardCourse": "기하",
    "curriculum": "2022",
    "standardUnitKey": "H22-GE-08",
    "standardUnit": "도형의 방정식",
    "standardUnitOrder": 8,
    "subUnitKey": "H22-GE-08-CORE",
    "subUnit": "도형의 방정식 핵심 개념",
    "subUnitConfidence": "candidate_evidence",
    "subUnitClassificationDepth": "complete_candidate",
    "conceptClusterKey": "H22-GE-08-CORE",
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "도형의 방정식 핵심 개념"
    ],
    "wide": false,
    "content": "두 직선 $ax + 8y - 3 = 0$, $\\frac{x + 3}{3} = \\frac{2 - y}{4}$가 서로 수직일 때, 상수 $a$의 값은?",
    "choices": [
      "$-6$",
      "$-4$",
      "$-2$",
      "$2$",
      "$4$"
    ],
    "answer": "①",
    "solution": "두 직선이 수직일 때 법선벡터와 방향벡터의 위치관계를 이용한다.\n직선 $l_1 : ax + 8y - 3 = 0$의 법선벡터는 $\\vec{n} = (a, 8)$이다.\n직선 $l_2 : \\frac{x + 3}{3} = \\frac{y - 2}{-4}$의 방향벡터는 $\\vec{u} = (3, -4)$이다.\n두 직선이 서로 수직이면, 한 직선의 법선벡터 $\\vec{n}$과 다른 직선의 방향벡터 $\\vec{u}$는 서로 평행하다.\n두 벡터가 평행할 조건에 의해 $\\vec{n} = t\\vec{u}$ (단, $t$는 $0$이 아닌 실수)가 성립하므로\n$\\frac{a}{3} = \\frac{8}{-4}$\n우변을 계산하면 $\\frac{8}{-4} = -2$이므로\n$\\frac{a}{3} = -2 \\implies a = -6$\n(역산 검산): $l_1$의 기울기는 $-\\frac{a}{8} = -\\frac{-6}{8} = \\frac{3}{4}$, $l_2$의 기울기는 $-\\frac{4}{3}$이므로 두 기울기의 곱은 $\\frac{3}{4} \\times \\left(-\\frac{4}{3}\\right) = -1$로 수직 조건이 성립한다.\n따라서 정답은 ①이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-GEO-RPM-097",
    "problemTypeKey": "PT_GEO_VECTOR_LINE_CIRCLE",
    "templateKey": "TPL_GEO_VEC_LINE_RELATION",
    "crossConceptKeys": [
      "CC_SLOPE"
    ],
    "conditionKeys": [],
    "integrationPattern": "NONE"
  },
  {
    "id": 5,
    "category": "도형의 방정식 핵심 개념",
    "standardCourse": "기하",
    "curriculum": "2022",
    "standardUnitKey": "H22-GE-08",
    "standardUnit": "도형의 방정식",
    "standardUnitOrder": 8,
    "subUnitKey": "H22-GE-08-CORE",
    "subUnit": "도형의 방정식 핵심 개념",
    "subUnitConfidence": "candidate_evidence",
    "subUnitClassificationDepth": "complete_candidate",
    "conceptClusterKey": "H22-GE-08-CORE",
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "도형의 방정식 핵심 개념"
    ],
    "wide": false,
    "content": "두 직선 $l_1 : \\frac{x - 1}{2} = \\frac{y + 3}{-3}$, $l_2 : 3x + ky + 1 = 0$에 대하여 다음 조건을 만족시키는 상수 $a, b$에 대하여 $ab$의 값은?\n\n(가) 두 직선이 서로 평행할 때, 상수 $k$의 값 $a$\n(나) 두 직선이 서로 수직일 때, 상수 $k$의 값 $b$",
    "choices": [
      "$-15$",
      "$-12$",
      "$-9$",
      "$-6$",
      "$-3$"
    ],
    "answer": "③",
    "solution": "직선 $l_1$의 방향벡터는 $\\vec{u} = (2, -3)$이고, 직선 $l_2$의 법선벡터는 $\\vec{n} = (3, k)$이다.\n(i) 조건 (가)에서 두 직선이 서로 평행할 때:\n두 직선이 평행하면 $\\vec{u}$와 $\\vec{n}$은 서로 수직이므로 내적이 $0$이다.\n$\\vec{u} \\cdot \\vec{n} = 2 \\times 3 + (-3) \\times k = 6 - 3k = 0$\n$3k = 6 \\implies k = 2$, 따라서 $a = 2$이다.\n(ii) 조건 (나)에서 두 직선이 서로 수직일 때:\n두 직선이 수직이면 $\\vec{u}$와 $\\vec{n}$은 서로 평행하므로 성분비가 같다.\n$\\frac{3}{2} = \\frac{k}{-3} \\implies 2k = -9 \\implies k = -\\frac{9}{2}$, 따라서 $b = -\\frac{9}{2}$이다.\n구하는 값 $ab$를 계산하면\n$ab = 2 \\times \\left(-\\frac{9}{2}\\right) = -9$\n따라서 정답은 ③이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-GEO-RPM-097",
    "problemTypeKey": "PT_GEO_VECTOR_LINE_CIRCLE",
    "templateKey": "TPL_GEO_VEC_LINE_RELATION",
    "crossConceptKeys": [
      "CC_SLOPE"
    ],
    "conditionKeys": [],
    "integrationPattern": "NONE"
  }
];
