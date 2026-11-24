window.examTitle = "기하_113_성분으로나타내어진평면벡터의연산_고2_유형은행1";

window.questionBank = [
  {
    "id": 1,
    "category": "벡터의 성분",
    "standardCourse": "기하",
    "curriculum": "2022",
    "standardUnitKey": "H22-GE-06",
    "standardUnit": "벡터의 성분",
    "standardUnitOrder": 6,
    "subUnitKey": "H22-GE-06-VECTOR_COMPONENT",
    "subUnit": "벡터의 성분",
    "subUnitConfidence": "candidate_evidence",
    "subUnitClassificationDepth": "complete_candidate",
    "conceptClusterKey": "H22_GE_06_VECTOR_COMPONENT",
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "벡터의 성분"
    ],
    "wide": false,
    "content": "좌표평면 위에 네 점 $\\mathrm{A}(1, 5), \\mathrm{B}(5, 1), \\mathrm{C}(3, 6), \\mathrm{P}(a, b)$가 있다. $\\vec{\\mathrm{PA}} + \\vec{\\mathrm{PB}} + \\vec{\\mathrm{PC}} = \\vec{0}$이 성립할 때, $a+b$의 값은?",
    "choices": [
      "6",
      "7",
      "8",
      "9",
      "10"
    ],
    "answer": "②",
    "solution": "위치벡터의 뺄셈 공식을 이용하여 세 벡터를 점 $\\mathrm{P}(a, b)$의 성분으로 나타낸다: $\\vec{\\mathrm{PA}} = (1 - a, 5 - b)$, $\\vec{\\mathrm{PB}} = (5 - a, 1 - b)$, $\\vec{\\mathrm{PC}} = (3 - a, 6 - b)$\n세 벡터의 합을 각 성분별로 계산한다: $\\vec{\\mathrm{PA}} + \\vec{\\mathrm{PB}} + \\vec{\\mathrm{PC}} = (1 - a + 5 - a + 3 - a, 5 - b + 1 - b + 6 - b) = (9 - 3a, 12 - 3b)$\n영벡터의 조건 $\\vec{\\mathrm{PA}} + \\vec{\\mathrm{PB}} + \\vec{\\mathrm{PC}} = \\vec{0} = (0, 0)$에 의해 성분별 방정식을 세운다: $9 - 3a = 0$, $12 - 3b = 0$\n일차방정식을 풀어 $a, b$의 값을 구한다: $3a = 9 \\implies a = 3$, $3b = 12 \\implies b = 4$\n구한 좌표의 합 $a+b$를 계산한다: $a + b = 3 + 4 = 7$\n삼각형의 무게중심의 성질을 이용한 검산: $\\vec{\\mathrm{PA}}+\\vec{\\mathrm{PB}}+\\vec{\\mathrm{PC}}=\\vec{0}$을 만족하는 점 $\\mathrm{P}$는 $\\triangle \\mathrm{ABC}$의 무게중심이므로 $\\mathrm{P}\\left(\\frac{1+5+3}{3}, \\frac{5+1+6}{3}\\right) = (3, 4)$가 되어 결과가 일치한다.\n따라서 정답은 ②이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-GEO-RPM-071",
    "problemTypeKey": "PT_GEO_PLANE_VECTOR",
    "templateKey": "TPL_GEO_VECTOR_BASIC_OPERATION",
    "crossConceptKeys": [
      "CC_CENTROID"
    ],
    "conditionKeys": [],
    "integrationPattern": "REINTERPRETATION"
  },
  {
    "id": 2,
    "category": "벡터의 성분",
    "standardCourse": "기하",
    "curriculum": "2022",
    "standardUnitKey": "H22-GE-06",
    "standardUnit": "벡터의 성분",
    "standardUnitOrder": 6,
    "subUnitKey": "H22-GE-06-VECTOR_COMPONENT",
    "subUnit": "벡터의 성분",
    "subUnitConfidence": "candidate_evidence",
    "subUnitClassificationDepth": "complete_candidate",
    "conceptClusterKey": "H22_GE_06_VECTOR_COMPONENT",
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "벡터의 성분"
    ],
    "wide": false,
    "content": "좌표평면 위의 세 점 $\\mathrm{A}(1, 5), \\mathrm{B}(6, 4), \\mathrm{C}(4, 8)$에 대하여 $2\\vec{\\mathrm{PA}} + 3\\vec{\\mathrm{PB}} + \\vec{\\mathrm{PC}} = \\vec{0}$를 만족시키는 점 $\\mathrm{P}$의 좌표를 $(a, b)$라 할 때, $a+b$의 값은?",
    "choices": [
      "5",
      "6",
      "7",
      "8",
      "9"
    ],
    "answer": "⑤",
    "solution": "원점 $\\mathrm{O}$에 대한 위치벡터로 식을 변형한다: $2(\\vec{\\mathrm{OA}} - \\vec{\\mathrm{OP}}) + 3(\\vec{\\mathrm{OB}} - \\vec{\\mathrm{OP}}) + (\\vec{\\mathrm{OC}} - \\vec{\\mathrm{OP}}) = \\vec{0}$\n동류항을 정리하여 $\\vec{\\mathrm{OP}}$에 관하여 푼다: $2\\vec{\\mathrm{OA}} + 3\\vec{\\mathrm{OB}} + \\vec{\\mathrm{OC}} - 6\\vec{\\mathrm{OP}} = \\vec{0} \\implies 6\\vec{\\mathrm{OP}} = 2\\vec{\\mathrm{OA}} + 3\\vec{\\mathrm{OB}} + \\vec{\\mathrm{OC}}$\n세 점의 좌표를 대입하여 우변의 성분을 구한다: $6(a, b) = 2(1, 5) + 3(6, 4) + (4, 8) = (2, 10) + (18, 12) + (4, 8)$\n성분의 덧셈을 계산한다: $6(a, b) = (2 + 18 + 4, 10 + 12 + 8) = (24, 30)$\n양변을 6으로 나누어 점 $\\mathrm{P}$의 좌표를 구한다: $(a, b) = \\left(\\frac{24}{6}, \\frac{30}{6}\\right) = (4, 5) \\implies a = 4, b = 5$\n$a+b$의 값을 계산한다: $a + b = 4 + 5 = 9$\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-GEO-RPM-071",
    "problemTypeKey": "PT_GEO_PLANE_VECTOR",
    "templateKey": "TPL_GEO_VECTOR_BASIC_OPERATION",
    "crossConceptKeys": [],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 3,
    "category": "벡터의 성분",
    "standardCourse": "기하",
    "curriculum": "2022",
    "standardUnitKey": "H22-GE-06",
    "standardUnit": "벡터의 성분",
    "standardUnitOrder": 6,
    "subUnitKey": "H22-GE-06-VECTOR_COMPONENT",
    "subUnit": "벡터의 성분",
    "subUnitConfidence": "candidate_evidence",
    "subUnitClassificationDepth": "complete_candidate",
    "conceptClusterKey": "H22_GE_06_VECTOR_COMPONENT",
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "벡터의 성분"
    ],
    "wide": false,
    "content": "세 점 $\\mathrm{A}(4, 2), \\mathrm{B}(-1, 1), \\mathrm{C}(2, 4)$에 대하여 $\\vec{\\mathrm{PA}} + \\vec{\\mathrm{PB}} + \\vec{\\mathrm{PC}} = \\vec{\\mathrm{CA}}$를 만족시키는 점 $\\mathrm{P}$에 대하여 $|\\vec{\\mathrm{OP}}|$의 값은? (단, $\\mathrm{O}$는 원점)",
    "choices": [
      "3",
      "\\sqrt{10}",
      "2\\sqrt{3}",
      "\\sqrt{13}",
      "4"
    ],
    "answer": "②",
    "solution": "시점을 원점 $\\mathrm{O}$로 통일하여 위치벡터의 차로 식을 나타낸다: $(\\vec{\\mathrm{OA}} - \\vec{\\mathrm{OP}}) + (\\vec{\\mathrm{OB}} - \\vec{\\mathrm{OP}}) + (\\vec{\\mathrm{OC}} - \\vec{\\mathrm{OP}}) = \\vec{\\mathrm{OA}} - \\vec{\\mathrm{OC}}$\n좌변을 정리한다: $\\vec{\\mathrm{OA}} + \\vec{\\mathrm{OB}} + \\vec{\\mathrm{OC}} - 3\\vec{\\mathrm{OP}} = \\vec{\\mathrm{OA}} - \\vec{\\mathrm{OC}}$\n양변에서 $\\vec{\\mathrm{OA}}$를 소거하고 $3\\vec{\\mathrm{OP}}$에 대하여 푼다: $\\vec{\\mathrm{OB}} + \\vec{\\mathrm{OC}} - 3\\vec{\\mathrm{OP}} = -\\vec{\\mathrm{OC}} \\implies 3\\vec{\\mathrm{OP}} = \\vec{\\mathrm{OB}} + 2\\vec{\\mathrm{OC}}$\n양변을 3으로 나누어 $\\vec{\\mathrm{OP}}$를 구한다: $\\vec{\\mathrm{OP}} = \\frac{\\vec{\\mathrm{OB}} + 2\\vec{\\mathrm{OC}}}{3}$\n점 $\\mathrm{B}(-1, 1)$과 점 $\\mathrm{C}(2, 4)$의 성분을 대입하여 계산한다: $\\vec{\\mathrm{OP}} = \\frac{(-1, 1) + 2(2, 4)}{3} = \\frac{(-1 + 4, 1 + 8)}{3} = \\frac{(3, 9)}{3} = (1, 3)$\n평면벡터의 크기 공식을 적용한다: $|\\vec{\\mathrm{OP}}| = \\sqrt{1^2 + 3^2} = \\sqrt{1 + 9} = \\sqrt{10}$\n주의: 벡터 $\\vec{\\mathrm{OA}}$가 양변에서 완전히 소거되므로 점 $\\mathrm{P}$의 위치는 점 $\\mathrm{A}$의 좌표와 무관하게 선분 $\\mathrm{BC}$를 $2:1$로 내분하는 점으로 결정된다.\n따라서 정답은 ②이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-GEO-RPM-071",
    "problemTypeKey": "PT_GEO_PLANE_VECTOR",
    "templateKey": "TPL_GEO_VECTOR_BASIC_OPERATION",
    "crossConceptKeys": [
      "CC_INTERNAL_DIVISION",
      "CC_DISTANCE_TWO_POINTS"
    ],
    "conditionKeys": [],
    "integrationPattern": "REINTERPRETATION"
  }
];
