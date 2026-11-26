window.examTitle = "기하_096_벡터의크기의최대최소-중점벡터를이용하는_고2_유형은행1";

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
    "content": "그림과 같이 $AB=6, BC=4$인 직사각형 $ABCD$가 있다. 점 $C$를 중심으로 하고 반지름의 길이가 $2$인 원 위의 점 $P$에 대하여 $|\\vec{AP} + \\vec{BP}|$의 최댓값을 $M$, 최솟값을 $m$이라 할 때, $Mm$의 값은?\n\n[그림: 가로 $BC=4$, 세로 $AB=6$인 직사각형 $ABCD$가 놓여 있고, 꼭짓점 $C$를 중심으로 하는 반지름 $2$인 원이 그려져 있다. 원 위의 한 점 $P$에 대하여 두 꼭짓점 $A, B$에서 점 $P$를 잇는 두 벡터 $\\vec{AP}, \\vec{BP}$가 표시되어 있다.]",
    "choices": [
      "76",
      "84",
      "92",
      "100",
      "108"
    ],
    "answer": "②",
    "solution": "선분 $AB$의 중점을 $M_0$이라 하면 중점벡터의 성질에 의해 $\\vec{AP} + \\vec{BP} = 2\\vec{M_0P}$이 성립한다.\n크기를 구하면 $|\\vec{AP} + \\vec{BP}| = |2\\vec{M_0P}| = 2|\\vec{M_0P}|$이다.\n점 $B$를 원점 $(0, 0)$으로 두는 좌표평면에서 각 점의 좌표는 $A(0, 6)$, $B(0, 0)$, $C(4, 0)$이다.\n선분 $AB$의 중점 $M_0$의 좌표는 $M_0\\left(0, \\frac{6+0}{2}\\right) = (0, 3)$이다.\n점 $M_0(0, 3)$에서 원의 중심 $C(4, 0)$까지의 거리 $d$는 두 점 사이의 거리 공식에 의해 $d = \\sqrt{(4-0)^2 + (0-3)^2} = \\sqrt{16+9} = 5$이다.\n점 $P$는 중심이 $C$이고 반지름 $r=2$인 원 위의 점이므로 선분 $M_0P$의 길이의 최댓값은 $d + r = 5 + 2 = 7$, 최솟값은 $d - r = 5 - 2 = 3$이다.\n따라서 $|\\vec{AP} + \\vec{BP}| = 2|\\vec{M_0P}|$의 최댓값은 $M = 2 \\times 7 = 14$, 최솟값은 $m = 2 \\times 3 = 6$이다.\n구하는 두 값의 곱 $Mm$을 계산하면 $Mm = 14 \\times 6 = 84$이다.\n따라서 정답은 ②이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-GEO-RPM-072",
    "problemTypeKey": "PT_GEO_PLANE_VECTOR",
    "templateKey": "TPL_GEO_PLANE_VECTOR_EXTREMA",
    "crossConceptKeys": [
      "CC_CIRCLE_CENTER_RADIUS",
      "CC_DISTANCE_TWO_POINTS"
    ],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL",
    "image": "assets/images/기하_096_벡터의크기의최대최소-중점벡터를이용하는_고2_유형은행1/q1-problem.svg",
    "imageAlt": "AB=6·BC=4 직사각형과 C 중심 반지름 2의 원, 원 위 P로 향하는 AP·BP",
    "imageCaption": "AB=6·BC=4 직사각형과 C 중심 반지름 2의 원, 원 위 P로 향하는 AP·BP",
    "imageSize": "full"
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
    "content": "그림과 같이 평면에서 반지름의 길이가 모두 $2$인 세 원 $C_1, C_2, C_3$이 서로 외접하고 있다. 원 $C_1$의 중심을 $O_1$이라 하고 두 원 $C_2, C_3$의 접점을 $M$이라 하자. 이때 원 $C_2$ 위를 움직이는 점 $P$와 원 $C_3$ 위를 움직이는 점 $Q$에 대하여 $|\\vec{O_1P} + \\vec{O_1Q}|$의 최댓값은?\n\n[그림: 반지름의 길이가 $2$인 세 원 $C_1, C_2, C_3$이 서로 외접하고 있으며, 원 $C_1$의 중심 $O_1$과 원 $C_2, C_3$의 접점 $M$이 표시되어 있다. 원 $C_2$ 위의 동점 $P$와 원 $C_3$ 위의 동점 $Q$에 대하여 점 $O_1$에서 점 $P, Q$로 향하는 벡터 $\\vec{O_1P}, \\vec{O_1Q}$가 그려져 있다.]",
    "choices": [
      "$4+2\\sqrt{3}$",
      "$2+4\\sqrt{3}$",
      "$6+2\\sqrt{3}$",
      "$2+5\\sqrt{3}$",
      "$4+4\\sqrt{3}$"
    ],
    "answer": "⑤",
    "solution": "세 원 $C_1, C_2, C_3$의 중심을 각각 $O_1, O_2, O_3$이라 하면 벡터의 덧셈 분해에 의해 $\\vec{O_1P} = \\vec{O_1O_2} + \\vec{O_2P}$, $\\vec{O_1Q} = \\vec{O_1O_3} + \\vec{O_3Q}$이다.\n두 벡터의 합을 구하면 $\\vec{O_1P} + \\vec{O_1Q} = (\\vec{O_1O_2} + \\vec{O_1O_3}) + \\vec{O_2P} + \\vec{O_3Q}$이다.\n세 원이 반지름 $2$로 서로 외접하므로 세 중심 사이의 거리는 $O_1O_2 = O_2O_3 = O_3O_1 = 2 + 2 = 4$가 되어 삼각형 $O_1O_2O_3$은 한 변의 길이가 $4$인 정삼각형이다.\n접점 $M$은 선분 $O_2O_3$의 중점이므로 중점벡터의 성질에 의해 $\\vec{O_1O_2} + \\vec{O_1O_3} = 2\\vec{O_1M}$이 성립한다.\n선분 $O_1M$은 한 변의 길이가 $4$인 정삼각형의 높이이므로 피타고라스 정리에 의해 $|O_1M| = \\frac{\\sqrt{3}}{2} \\times 4 = 2\\sqrt{3}$이고, 따라서 $|2\\vec{O_1M}| = 2 \\times 2\\sqrt{3} = 4\\sqrt{3}$이다.\n점 $P, Q$는 각각 중심이 $O_2, O_3$이고 반지름이 $2$인 원 위의 점이므로 $|\\vec{O_2P}| = 2, |\\vec{O_3Q}| = 2$이다.\n삼각부등식에 의해 $|\\vec{O_1P} + \\vec{O_1Q}| = |2\\vec{O_1M} + \\vec{O_2P} + \\vec{O_3Q}| \\le |2\\vec{O_1M}| + |\\vec{O_2P}| + |\\vec{O_3Q}|$이다.\n두 벡터 $\\vec{O_2P}, \\vec{O_3Q}$가 벡터 $\\vec{O_1M}$과 같은 방향을 가리킬 때 최댓값을 가지므로 최댓값은 $4\\sqrt{3} + 2 + 2 = 4 + 4\\sqrt{3}$이다.\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-GEO-RPM-072",
    "problemTypeKey": "PT_GEO_PLANE_VECTOR",
    "templateKey": "TPL_GEO_PLANE_VECTOR_EXTREMA",
    "crossConceptKeys": [
      "CC_CIRCLE_POSITION_RELATION",
      "CC_EQUILATERAL_TRIANGLE",
      "CC_DISTANCE_TWO_POINTS"
    ],
    "conditionKeys": [],
    "integrationPattern": "INTERDEPENDENT",
    "image": "assets/images/기하_096_벡터의크기의최대최소-중점벡터를이용하는_고2_유형은행1/q2-problem.svg",
    "imageAlt": "반지름 2인 외접하는 원 세 개, 원 C₂와 C₃의 접점 M, O₁에서 P·Q로 향하는 화살표",
    "imageCaption": "반지름 2인 외접하는 원 세 개, 원 C₂와 C₃의 접점 M, O₁에서 P·Q로 향하는 화살표",
    "imageSize": "full"
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
    "content": "그림과 같이 평면 위에 반지름의 길이가 모두 $1$인 네 원 $C_1, C_2, C_3, C_4$의 중심을 각각 $O_1, O_2, O_3, O_4$라 하자. 사각형 $O_1O_2O_3O_4$는 한 변의 길이가 $2$이고 $\\angle O_1O_2O_3 = 60^\\circ$인 마름모이며, 꼭짓점은 시계 반대 방향 순서로 배열되어 있다. 두 원 $C_2, C_3$의 접점을 $A$라 할 때, 원 $C_3$ 위를 움직이는 점 $P$와 원 $C_4$ 위를 움직이는 점 $Q$에 대하여 $|\\vec{AP} + \\vec{AQ}|$의 최댓값은?\n\n[그림: 한 변의 길이가 $2$이고 $\\angle O_1O_2O_3 = 60^\\circ$인 마름모 $O_1O_2O_3O_4$의 각 꼭짓점을 중심으로 하는 네 개의 원 $C_1, C_2, C_3, C_4$가 놓여 있다. 변 $O_2O_3$의 중점이자 두 원 $C_2, C_3$의 접점인 점 $A$가 표시되어 있고, 원 $C_3$ 위의 동점 $P$와 원 $C_4$ 위의 동점 $Q$를 잇는 두 벡터 $\\vec{AP}, \\vec{AQ}$가 화살표로 그려져 있다.]",
    "choices": [
      "$2\\sqrt{3}$",
      "$1+2\\sqrt{3}$",
      "$2+2\\sqrt{3}$",
      "$3+2\\sqrt{3}$",
      "$4+2\\sqrt{3}$"
    ],
    "answer": "③",
    "solution": "원의 중심을 경유하여 벡터를 분해하면 $\\vec{AP} = \\vec{AO_3} + \\vec{O_3P}$, $\\vec{AQ} = \\vec{AO_4} + \\vec{O_4Q}$이다.\n두 식의 합을 구하면 $\\vec{AP} + \\vec{AQ} = (\\vec{AO_3} + \\vec{AO_4}) + \\vec{O_3P} + \\vec{O_4Q}$이다.\n선분 $O_3O_4$의 중점을 $M$이라 하면 중점벡터의 성질에 의해 $\\vec{AO_3} + \\vec{AO_4} = 2\\vec{AM}$이 성립한다.\n점 $A$는 선분 $O_2O_3$의 중점이므로 $O_3A = \\frac{1}{2} \\times 2 = 1$이고, 점 $M$은 선분 $O_3O_4$의 중점이므로 $O_3M = \\frac{1}{2} \\times 2 = 1$이다.\n마름모의 이웃한 두 내각의 합은 $180^\\circ$이므로 $\\angle O_2O_3O_4 = 180^\\circ - 60^\\circ = 120^\\circ$이다.\n삼각형 $O_3AM$에서 코사인법칙을 적용하면 $AM^2 = O_3A^2 + O_3M^2 - 2 \\cdot O_3A \\cdot O_3M \\cdot \\cos 120^\\circ$이다.\n수치를 대입하면 $AM^2 = 1^2 + 1^2 - 2 \\cdot 1 \\cdot 1 \\cdot \\left(-\\frac{1}{2}\\right) = 1 + 1 + 1 = 3$이므로 선분의 길이는 $AM = \\sqrt{3}$이다.\n따라서 고정된 두 중심 벡터의 합의 크기는 $|2\\vec{AM}| = 2\\sqrt{3}$이다.\n점 $P, Q$는 반지름이 $1$인 원 위의 점이므로 삼각부등식에 의해 $|\\vec{AP} + \\vec{AQ}| \\le |2\\vec{AM}| + |\\vec{O_3P}| + |\\vec{O_4Q}| = 2\\sqrt{3} + 1 + 1 = 2 + 2\\sqrt{3}$이다.\n두 벡터 $\\vec{O_3P}, \\vec{O_4Q}$가 벡터 $\\vec{AM}$과 같은 방향일 때 등호가 성립하므로 구하는 최댓값은 $2 + 2\\sqrt{3}$이다.\n따라서 정답은 ③이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B45",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-GEO-RPM-072",
    "problemTypeKey": "PT_GEO_PLANE_VECTOR",
    "templateKey": "TPL_GEO_PLANE_VECTOR_EXTREMA",
    "crossConceptKeys": [
      "CC_CIRCLE_POSITION_RELATION",
      "CC_RHOMBUS_PROPERTIES",
      "CC_DISTANCE_TWO_POINTS"
    ],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
  }
];
