window.examTitle = "기하_134_방향벡터를이용한직선의방정식_고2_유형은행1";

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
    "content": "점 $(2, -3)$을 지나고, 직선 $\\dfrac{3-x}{2} = \\dfrac{y+1}{4}$에 평행한 직선이 점 $(a, 5)$를 지날 때, $a$의 값은?",
    "choices": [
      "$-5$",
      "$-4$",
      "$-3$",
      "$-2$",
      "$-1$"
    ],
    "answer": "④",
    "solution": "주어진 직선의 방정식을 표준형으로 정리하여 방향벡터를 구한다: $\\dfrac{-(x-3)}{2} = \\dfrac{y+1}{4} \\iff \\dfrac{x-3}{-2} = \\dfrac{y+1}{4}$이므로 방향벡터는 $\\vec{u} = (-2, 4)$이다.\n주의: $x$의 계수가 $-1$이므로 분모와 분자에 $-1$을 곱해 계수를 $+1$로 맞춘 후 방향벡터 성분을 읽어야 한다.\n방향벡터의 성분을 간단한 정수비로 나타내면 $\\vec{u}' = (-1, 2)$이다.\n직선의 방정식 공식(한 점과 방향벡터): 점 $(2, -3)$을 지나고 방향벡터가 $(-1, 2)$인 직선의 방정식은 $\\dfrac{x-2}{-1} = \\dfrac{y-(-3)}{2} \\iff \\dfrac{x-2}{-1} = \\dfrac{y+3}{2}$이다.\n이 직선이 점 $(a, 5)$를 지나므로 좌표를 대입한다: $\\dfrac{a-2}{-1} = \\dfrac{5+3}{2}$.\n우변을 계산하면 $\\dfrac{8}{2} = 4$이다.\n식을 정리하여 $a$의 값을 구한다: $a-2 = 4 \\times (-1) = -4 \\implies a = -4 + 2 = -2$.\n따라서 정답은 ④이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-GEO-RPM-077",
    "problemTypeKey": "PT_GEO_VECTOR_LINE_CIRCLE",
    "templateKey": "TPL_GEO_VEC_LINE_DIRECTION",
    "crossConceptKeys": [
      "CC_PARALLEL_LINES"
    ],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
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
    "content": "점 $\\mathrm{A}(2, 3)$을 지나고 방향벡터가 $\\vec{u} = (2, -3)$인 직선이 $x$축, $y$축과 만나는 점을 각각 $\\mathrm{B}$, $\\mathrm{C}$라 할 때, 삼각형 $\\mathrm{OBC}$의 넓이는? (단, $\\mathrm{O}$는 원점이다.)",
    "choices": [
      "$12$",
      "$14$",
      "$16$",
      "$18$",
      "$20$"
    ],
    "answer": "①",
    "solution": "직선의 방정식 공식(한 점과 방향벡터): 점 $\\mathrm{A}(2, 3)$을 지나고 방향벡터가 $\\vec{u} = (2, -3)$인 직선의 방정식은 $\\dfrac{x-2}{2} = \\dfrac{y-3}{-3}$이다.\n양변에 분모의 최소공배수 $-6$을 곱하여 일반형으로 정리한다: $-3(x-2) = 2(y-3) \\iff -3x + 6 = 2y - 6 \\iff 3x + 2y - 12 = 0$.\n$x$축과의 교점 $\\mathrm{B}$의 좌표 구하기($y=0$ 대입): $3x + 2(0) - 12 = 0 \\iff 3x = 12 \\implies x = 4$이므로 $\\mathrm{B}(4, 0)$이다.\n$y$축과의 교점 $\\mathrm{C}$의 좌표 구하기($x=0$ 대입): $3(0) + 2y - 12 = 0 \\iff 2y = 12 \\implies y = 6$이므로 $\\mathrm{C}(0, 6)$이다.\n선분의 길이 계산: $\\overline{\\mathrm{OB}} = 4$, $\\overline{\\mathrm{OC}} = 6$이다.\n삼각형의 넓이 공식: 직각삼각형 $\\mathrm{OBC}$의 넓이는 $S = \\dfrac{1}{2} \\times \\overline{\\mathrm{OB}} \\times \\overline{\\mathrm{OC}} = \\dfrac{1}{2} \\times 4 \\times 6 = 12$이다.\n따라서 정답은 ①이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-GEO-RPM-077",
    "problemTypeKey": "PT_GEO_VECTOR_LINE_CIRCLE",
    "templateKey": "TPL_GEO_VEC_LINE_DIRECTION",
    "crossConceptKeys": [
      "CC_INTERCEPTS"
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
    "content": "좌표평면 위의 점 $(7, 8)$을 지나고 벡터 $\\vec{u} = (7, 4)$에 평행한 직선이 $x$축과 만나는 점을 $\\mathrm{A}$, $y$축과 만나는 점을 $\\mathrm{B}$라 할 때, 선분 $\\mathrm{AB}$의 길이의 제곱 $\\overline{\\mathrm{AB}}^2$의 값은?",
    "choices": [
      "$53$",
      "$57$",
      "$61$",
      "$65$",
      "$69$"
    ],
    "answer": "④",
    "solution": "직선의 방정식 공식(한 점과 방향벡터): 점 $(7, 8)$을 지나고 방향벡터가 $\\vec{u} = (7, 4)$인 직선의 방정식은 $\\dfrac{x-7}{7} = \\dfrac{y-8}{4}$이다.\n매개변수 $t$를 도입하여 직선 위의 점의 좌표를 표현한다: $\\dfrac{x-7}{7} = \\dfrac{y-8}{4} = t \\implies x = 7 + 7t, \\; y = 8 + 4t$.\n$x$축과의 교점 $\\mathrm{A}$ 구하기($y=0$ 대입): $8 + 4t = 0 \\implies 4t = -8 \\implies t = -2$.\n$t = -2$를 $x$ 좌표에 대입한다: $x = 7 + 7(-2) = 7 - 14 = -7$이므로 $\\mathrm{A}(-7, 0)$이다.\n$y$축과의 교점 $\\mathrm{B}$ 구하기($x=0$ 대입): $7 + 7t = 0 \\implies 7t = -7 \\implies t = -1$.\n$t = -1$을 $y$ 좌표에 대입한다: $y = 8 + 4(-1) = 8 - 4 = 4$이므로 $\\mathrm{B}(0, 4)$이다.\n두 점 사이의 거리 공식: $\\overline{\\mathrm{AB}}^2 = (0 - (-7))^2 + (4 - 0)^2 = 7^2 + 4^2$이다.\n제곱의 합을 계산한다: $\\overline{\\mathrm{AB}}^2 = 49 + 16 = 65$이다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-GEO-RPM-077",
    "problemTypeKey": "PT_GEO_VECTOR_LINE_CIRCLE",
    "templateKey": "TPL_GEO_VEC_LINE_DIRECTION",
    "crossConceptKeys": [
      "CC_INTERCEPTS",
      "CC_DISTANCE_FORMULA"
    ],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
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
    "content": "점 $\\mathrm{A}(-2, 6)$을 지나고 방향벡터가 $\\vec{u} = (2, -1)$인 직선과 두 점 $\\mathrm{B}(1, -3)$, $\\mathrm{C}(3, 1)$을 지나는 직선이 한 점 $(p, q)$에서 만난다. $p+q$의 값은?",
    "choices": [
      "$3$",
      "$4$",
      "$5$",
      "$6$",
      "$7$"
    ],
    "answer": "⑤",
    "solution": "첫 번째 직선의 방정식 공식(한 점과 방향벡터): 점 $\\mathrm{A}(-2, 6)$을 지나고 방향벡터가 $\\vec{u} = (2, -1)$인 직선은 $\\dfrac{x+2}{2} = \\dfrac{y-6}{-1}$이다.\n식을 정리하여 첫 번째 직선의 일반형을 구한다: $-(x+2) = 2(y-6) \\iff -x - 2 = 2y - 12 \\iff x + 2y = 10$ … ㉠\n두 번째 직선의 방향벡터 구하기(두 점을 지나는 벡터): $\\vec{\\mathrm{BC}} = (3-1, 1-(-3)) = (2, 4)$이므로 방향벡터를 간단한 정수비 $(1, 2)$로 둘 수 있다.\n두 번째 직선의 방정식 공식: 점 $\\mathrm{B}(1, -3)$을 지나고 방향벡터가 $(1, 2)$이므로 $\\dfrac{x-1}{1} = \\dfrac{y+3}{2}$이다.\n식을 정리하여 두 번째 직선의 일반형을 구한다: $2(x-1) = y+3 \\iff 2x - 2 = y + 3 \\iff 2x - y = 5$ … ㉡\n연립방정식 풀이: ㉡에서 $y = 2x - 5$를 ㉠에 대입한다: $x + 2(2x - 5) = 10$.\n전개하여 일차방정식을 푼다: $x + 4x - 10 = 10 \\iff 5x = 20 \\implies x = 4$.\n구한 $x=4$를 대입하여 $y$를 구한다: $y = 2(4) - 5 = 8 - 5 = 3$.\n교점의 좌표는 $(p, q) = (4, 3)$이므로 $p=4, q=3$이다.\n두 값의 합 계산: $p + q = 4 + 3 = 7$이다.\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-GEO-RPM-077",
    "problemTypeKey": "PT_GEO_VECTOR_LINE_CIRCLE",
    "templateKey": "TPL_GEO_VEC_LINE_DIRECTION",
    "crossConceptKeys": [
      "CC_LINE_INTERSECTION",
      "CC_SLOPE_AND_INTERCEPT"
    ],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
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
    "content": "점 $\\mathrm{A}(3, -2)$와 벡터 $\\vec{u} = (3, -4)$에 대하여\n$$\\vec{\\mathrm{OP}} = \\vec{\\mathrm{OA}} + t\\vec{u}$$\n를 만족시키는 점 $\\mathrm{P}$가 나타내는 직선을 $l$이라 할 때, 원점 $\\mathrm{O}$에서 직선 $l$에 이르는 거리는? (단, $t$는 실수이다.)",
    "choices": [
      "$\\dfrac{4}{5}$",
      "$\\dfrac{6}{5}$",
      "$\\dfrac{8}{5}$",
      "$\\dfrac{9}{5}$",
      "$\\dfrac{11}{5}$"
    ],
    "answer": "②",
    "solution": "직선의 벡터방정식 성분화: $\\vec{\\mathrm{OP}} = (x, y)$, $\\vec{\\mathrm{OA}} = (3, -2)$이므로 $(x, y) = (3, -2) + t(3, -4) = (3+3t, -2-4t)$이다.\n매개변수 $t$를 소거하여 직선의 방정식을 유도한다: $x = 3 + 3t \\implies t = \\dfrac{x-3}{3}$, $y = -2 - 4t \\implies t = \\dfrac{y+2}{-4}$.\n두 식을 같다고 놓아 직선의 방정식을 세운다: $\\dfrac{x-3}{3} = \\dfrac{y+2}{-4}$.\n분모의 최소공배수 $12$를 양변에 곱하여 일반형으로 변형한다: $-4(x-3) = 3(y+2) \\iff -4x + 12 = 3y + 6 \\iff 4x + 3y - 6 = 0$.\n점과 직선 사이의 거리 공식: 점 $(x_1, y_1)$과 직선 $ax+by+c=0$ 사이의 거리는 $d = \\dfrac{|ax_1 + by_1 + c|}{\\sqrt{a^2 + b^2}}$이다.\n원점 $(0, 0)$과 직선 $4x + 3y - 6 = 0$ 사이의 거리를 대입하여 계산한다: $d = \\dfrac{|4(0) + 3(0) - 6|}{\\sqrt{4^2 + 3^2}} = \\dfrac{|-6|}{\\sqrt{16+9}}$.\n분모와 분자를 정리한다: $d = \\dfrac{6}{\\sqrt{25}} = \\dfrac{6}{5}$이다.\n따라서 정답은 ②이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-GEO-RPM-077",
    "problemTypeKey": "PT_GEO_VECTOR_LINE_CIRCLE",
    "templateKey": "TPL_GEO_VEC_LINE_DIRECTION",
    "crossConceptKeys": [
      "CC_POINT_TO_LINE_DISTANCE"
    ],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
  }
];
