window.examTitle = "기하_116_평면벡터에서점P가나타내는도형_고2_유형은행1";

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
    "content": "두 점 $A(-1, 3), B(5, 1)$에 대하여 좌표평면 위의 점 $P$가\n$$|\\vec{AP} + \\vec{BP}| = 8$$\n을 만족시킬 때, 점 $P$가 나타내는 도형의 둘레의 길이는?",
    "choices": [
      "$4\\pi$",
      "$6\\pi$",
      "$8\\pi$",
      "$10\\pi$",
      "$12\\pi$"
    ],
    "answer": "③",
    "solution": "선분 $AB$의 중점을 $M$이라 하고 좌표를 구한다: $M\\left(\\frac{-1+5}{2}, \\frac{3+1}{2}\\right) = (2, 2)$\n중점 벡터의 성질에 의해 식을 정리한다: $\\vec{AP} + \\vec{BP} = (\\vec{MP} - \\vec{MA}) + (\\vec{MP} - \\vec{MB}) = 2\\vec{MP}$ (단, $\\vec{MA} + \\vec{MB} = \\vec{0}$)\n주어진 조건식에 대입하여 크기를 구한다: $|2\\vec{MP}| = 8 \\iff 2|\\vec{MP}| = 8 \\iff |\\vec{MP}| = 4$\n점 $P$가 나타내는 도형을 해석한다: 점 $P$는 중심이 $M(2, 2)$이고 반지름의 길이가 $r = 4$인 원이다.\n원의 둘레의 길이 공식($l = 2\\pi r$)을 적용한다: $l = 2\\pi \\times 4 = 8\\pi$\n따라서 정답은 ③이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-GEO-RPM-071",
    "problemTypeKey": "PT_GEO_PLANE_VECTOR",
    "templateKey": "TPL_GEO_PLANE_VECTOR_REGION",
    "crossConceptKeys": [
      "CC_MIDPOINT",
      "CC_CIRCLE_CENTER_RADIUS"
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
    "content": "좌표평면 위의 두 점 $A(2, 5), B(-1, 2)$에 대하여\n$$|\\vec{PA} + 2\\vec{PB}| = 18$$\n일 때, 점 $P(x, y)$가 나타내는 도형의 넓이는?",
    "choices": [
      "$16\\pi$",
      "$20\\pi$",
      "$25\\pi$",
      "$30\\pi$",
      "$36\\pi$"
    ],
    "answer": "⑤",
    "solution": "선분의 내분점 벡터 표현을 적용한다: 선분 $AB$를 $2:1$로 내분하는 점을 $C$라 하면 $\\vec{PC} = \\frac{\\vec{PA} + 2\\vec{PB}}{2+1} = \\frac{\\vec{PA} + 2\\vec{PB}}{3}$\n주어진 식을 점 $C$에 대한 벡터로 변형한다: $\\vec{PA} + 2\\vec{PB} = 3\\vec{PC}$이므로 $|3\\vec{PC}| = 18$\n양변을 3으로 나누어 반지름을 구한다: $3|\\vec{PC}| = 18 \\iff |\\vec{PC}| = 6$\n내분점의 위치를 확인한다: 점 $C$의 좌표는 $\\left(\\frac{2 \\times (-1) + 1 \\times 2}{3}, \\frac{2 \\times 2 + 1 \\times 5}{3}\\right) = (0, 3)$\n점 $P$가 나타내는 도형을 판정한다: 점 $P$는 점 $C(0, 3)$을 중심으로 하고 반지름의 길이가 $r = 6$인 원이다.\n원의 넓이 공식($S = \\pi r^2$)으로 넓이를 계산한다: $S = \\pi \\times 6^2 = 36\\pi$\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-GEO-RPM-071",
    "problemTypeKey": "PT_GEO_PLANE_VECTOR",
    "templateKey": "TPL_GEO_PLANE_VECTOR_REGION",
    "crossConceptKeys": [
      "CC_INTERNAL_DIVISION",
      "CC_CIRCLE_CENTER_RADIUS"
    ],
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
    "content": "두 점 $A(1, -2), B(-3, 1)$에 대하여\n$$|\\vec{OP} - \\vec{OB}| = |\\vec{OA} - \\vec{OB}|$$\n를 만족시키는 점 $P$가 나타내는 도형의 넓이는? (단, $O$는 원점이다.)",
    "choices": [
      "$16\\pi$",
      "$18\\pi$",
      "$20\\pi$",
      "$25\\pi$",
      "$28\\pi$"
    ],
    "answer": "④",
    "solution": "벡터의 뺄셈을 이용하여 시점을 통일한다: $\\vec{OP} - \\vec{OB} = \\vec{BP}$, $\\vec{OA} - \\vec{OB} = \\vec{BA}$\n주어진 조건식을 선분의 길이로 다시 쓴다: $|\\vec{BP}| = |\\vec{BA}|$\n두 점 사이의 거리 공식으로 선분 $BA$의 길이를 구한다: $|\\vec{BA}| = \\sqrt{(1 - (-3))^2 + (-2 - 1)^2} = \\sqrt{4^2 + (-3)^2} = \\sqrt{16 + 9} = 5$\n점 $P$가 나타내는 도형의 자취를 판정한다: $|\\vec{BP}| = 5$이므로 점 $P$는 점 $B(-3, 1)$을 중심으로 하고 반지름의 길이가 $r = 5$인 원이다.\n원의 넓이 공식($S = \\pi r^2$)을 적용한다: $S = \\pi \\times 5^2 = 25\\pi$\n따라서 정답은 ④이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-GEO-RPM-071",
    "problemTypeKey": "PT_GEO_PLANE_VECTOR",
    "templateKey": "TPL_GEO_PLANE_VECTOR_REGION",
    "crossConceptKeys": [
      "CC_CIRCLE_CENTER_RADIUS",
      "CC_DISTANCE_TWO_POINTS"
    ],
    "conditionKeys": [],
    "integrationPattern": "REINTERPRETATION"
  },
  {
    "id": 4,
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
    "content": "좌표평면 위의 두 점 $A(1, 2), B(4, 5)$에 대하여\n$$2|\\vec{AP}| = |\\vec{BP}|$$\n를 만족하는 점 $P$가 나타내는 도형의 넓이는?",
    "choices": [
      "$2\\pi$",
      "$4\\pi$",
      "$6\\pi$",
      "$8\\pi$",
      "$10\\pi$"
    ],
    "answer": "④",
    "solution": "조건식을 점과 점 사이의 거리의 비로 바꾼다: $2|\\vec{AP}| = |\\vec{BP}| \\iff \\overline{AP} : \\overline{BP} = 1 : 2$\n아폴로니오스의 원의 성질을 적용한다: 두 점 $A, B$로부터 거리의 비가 $1 : 2$인 점 $P$의 자취는 선분 $AB$를 $1 : 2$로 내분하는 점 $N$과 외분하는 점 $E$를 지름의 양 끝점으로 하는 원이다.\n두 점 사이의 거리 공식으로 선분 $AB$의 길이를 구한다: $\\overline{AB} = \\sqrt{(4-1)^2 + (5-2)^2} = \\sqrt{3^2 + 3^2} = 3\\sqrt{2}$\n점 $A$로부터 내분점과 외분점까지의 거리를 각각 계산한다:\n(i) 내분점까지의 거리: $\\overline{AN} = \\frac{1}{1+2}\\overline{AB} = \\frac{1}{3} \\times 3\\sqrt{2} = \\sqrt{2}$\n(ii) 외분점까지의 거리: $\\overline{AE} = \\frac{1}{2-1}\\overline{AB} = 1 \\times 3\\sqrt{2} = 3\\sqrt{2}$\n지름의 길이와 원의 반지름을 구한다: 점 $A$가 선분 $NE$ 위에 있으므로 지름은 $\\overline{NE} = \\overline{AN} + \\overline{AE} = \\sqrt{2} + 3\\sqrt{2} = 4\\sqrt{2}$이고, 반지름은 $r = \\frac{4\\sqrt{2}}{2} = 2\\sqrt{2}$이다.\n원의 넓이 공식($S = \\pi r^2$)으로 넓이를 계산한다: $S = \\pi \\times (2\\sqrt{2})^2 = 8\\pi$\n따라서 정답은 ④이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-GEO-RPM-071",
    "problemTypeKey": "PT_GEO_PLANE_VECTOR",
    "templateKey": "TPL_GEO_PLANE_VECTOR_REGION",
    "crossConceptKeys": [
      "CC_INTERNAL_DIVISION",
      "CC_EXTERNAL_DIVISION",
      "CC_DISTANCE_TWO_POINTS"
    ],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 5,
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
    "content": "좌표평면 위의 세 점 $A(2, 1), B(6, 2), C(1, 6)$에 대하여\n$$|\\vec{PA} + \\vec{PB} + \\vec{PC}| = 6$$\n일 때, 점 $P$가 나타내는 도형의 둘레의 길이는?",
    "choices": [
      "$2\\pi$",
      "$4\\pi$",
      "$6\\pi$",
      "$8\\pi$",
      "$10\\pi$"
    ],
    "answer": "②",
    "solution": "무게중심의 성질을 적용한다: 삼각형 $ABC$의 무게중심을 $G$라 하면 $\\vec{GA} + \\vec{GB} + \\vec{GC} = \\vec{0}$이다.\n시점을 $G$로 변환하여 벡터의 합을 정리한다:\n$\\vec{PA} + \\vec{PB} + \\vec{PC} = (\\vec{GA} - \\vec{GP}) + (\\vec{GB} - \\vec{GP}) + (\\vec{GC} - \\vec{GP}) = (\\vec{GA} + \\vec{GB} + \\vec{GC}) - 3\\vec{GP} = 3\\vec{PG}$\n주어진 조건식에 대입하여 크기를 구한다: $|3\\vec{PG}| = 6 \\iff 3|\\vec{PG}| = 6 \\iff |\\vec{PG}| = 2$\n무게중심 $G$의 좌표를 구한다: $G\\left(\\frac{2+6+1}{3}, \\frac{1+2+6}{3}\\right) = (3, 3)$\n점 $P$가 나타내는 도형을 해석한다: 점 $P$는 점 $G(3, 3)$을 중심으로 하고 반지름의 길이가 $r = 2$인 원이다.\n원의 둘레 공식($l = 2\\pi r$)으로 둘레의 길이를 구한다: $l = 2\\pi \\times 2 = 4\\pi$\n따라서 정답은 ②이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-GEO-RPM-071",
    "problemTypeKey": "PT_GEO_PLANE_VECTOR",
    "templateKey": "TPL_GEO_PLANE_VECTOR_REGION",
    "crossConceptKeys": [
      "CC_CENTROID",
      "CC_CIRCLE_CENTER_RADIUS"
    ],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
  }
];
