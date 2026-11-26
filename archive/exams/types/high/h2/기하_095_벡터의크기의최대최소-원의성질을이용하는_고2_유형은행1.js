window.examTitle = "기하_095_벡터의크기의최대최소-원의성질을이용하는_고2_유형은행1";

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
    "content": "원 $(x-6)^2+(y-8)^2=25$ 위를 움직이는 두 점 $\\mathrm{A, B}$에 대하여 $|\\vec{OA}+\\vec{OB}|$의 최댓값을 $M$, 최솟값을 $m$이라 할 때, $M-m$의 값은? (단, $\\mathrm{O}$는 원점이다.)",
    "choices": [
      "10",
      "12",
      "14",
      "16",
      "20"
    ],
    "answer": "⑤",
    "solution": "1. 원의 중심을 $\\mathrm{C}(6, 8)$이라 하면 반지름은 $r = \\sqrt{25} = 5$이다.\n2. 원점 $\\mathrm{O}$에서 중심 $\\mathrm{C}$까지의 거리는\n$|\\vec{OC}| = \\sqrt{6^2 + 8^2} = \\sqrt{36 + 64} = \\sqrt{100} = 10$이다.\n3. 두 점 $\\mathrm{A, B}$가 원 위의 점이므로 위치벡터를 중심 $\\mathrm{C}$를 거치도록 분해하면\n$\\vec{OA} = \\vec{OC} + \\vec{CA}$, $\\vec{OB} = \\vec{OC} + \\vec{CB}$이다.\n4. 두 식을 더하면 $\\vec{OA} + \\vec{OB} = 2\\vec{OC} + (\\vec{CA} + \\vec{CB})$이다.\n5. 두 점 $\\mathrm{A, B}$는 원 위를 서로 독립적으로 움직이고 $|\\vec{CA}| = 5$, $|\\vec{CB}| = 5$이므로,\n벡터 $\\vec{CA} + \\vec{CB}$의 크기는 $0 \\le |\\vec{CA} + \\vec{CB}| \\le 5 + 5 = 10$ 범위의 모든 값을 가질 수 있으며 임의의 방향을 가리킬 수 있다.\n6. $|2\\vec{OC}| = 2 \\times 10 = 20$이므로 삼각부등식에 의해\n(i) 최댓값 $M$은 $\\vec{CA}$와 $\\vec{CB}$가 모두 $\\vec{OC}$와 같은 방향일 때이며,\n$M = |2\\vec{OC}| + |\\vec{CA}| + |\\vec{CB}| = 20 + 5 + 5 = 30$이다.\n(ii) 최솟값 $m$은 $\\vec{CA}$와 $\\vec{CB}$가 모두 $\\vec{OC}$와 반대 방향일 때이며,\n$m = |2\\vec{OC}| - (|\\vec{CA}| + |\\vec{CB}|) = 20 - 5 - 5 = 10$이다.\n7. 따라서 $M - m = 30 - 10 = 20$이다.\n주의: 점 $\\mathrm{A}$와 점 $\\mathrm{B}$는 서로 다른 점이라는 조건이 없으므로 동시에 같은 위치에 올 수 있음을 고려해야 한다.\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-GEO-RPM-072",
    "problemTypeKey": "PT_GEO_PLANE_VECTOR",
    "templateKey": "TPL_GEO_PLANE_VECTOR_EXTREMA",
    "crossConceptKeys": [
      "CC_MIDPOINT",
      "CC_DISTANCE_TWO_POINTS"
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
    "content": "그림과 같이 좌표평면에서 점 $\\mathrm{A}(3, 0)$과 원 $(x-1)^2+(y-2)^2=3$ 위의 점 $\\mathrm{P}$에 대하여 $|\\vec{OP}+2\\vec{OA}|$의 최댓값과 최솟값의 곱은? (단, $\\mathrm{O}$는 원점이다.)\n\n[그림: 좌표평면 위에 원 $(x-1)^2+(y-2)^2=3$과 $x$축 위의 점 $\\mathrm{A}(3, 0)$, 원 위의 점 $\\mathrm{P}$, 그리고 원점 $\\mathrm{O}$에서 점 $\\mathrm{P}$로 향하는 벡터 $\\vec{OP}$가 표시된 그림]",
    "choices": [
      "42",
      "44",
      "46",
      "48",
      "50"
    ],
    "answer": "⑤",
    "solution": "1. 원의 중심을 $\\mathrm{C}(1, 2)$라 하면 반지름은 $r = \\sqrt{3}$이다.\n2. 점 $\\mathrm{P}$는 원 위의 점이므로 위치벡터를 분해하면 $\\vec{OP} = \\vec{OC} + \\vec{CP}$이고 $|\\vec{CP}| = \\sqrt{3}$이다.\n3. 주어진 식에 대입하면 $\\vec{OP}+2\\vec{OA} = (\\vec{OC}+2\\vec{OA}) + \\vec{CP}$이다.\n4. 점 $\\mathrm{A}(3, 0)$이므로 $\\vec{OA} = (3, 0)$이고, 고정된 벡터의 성분은\n$\\vec{OC}+2\\vec{OA} = (1, 2) + 2(3, 0) = (1+6, 2+0) = (7, 2)$이다.\n5. 이 고정된 벡터의 크기를 구하면\n$|\\vec{OC}+2\\vec{OA}| = \\sqrt{7^2 + 2^2} = \\sqrt{49 + 4} = \\sqrt{53}$이다.\n6. 점 $\\mathrm{P}$가 원 위를 움직일 때 삼각부등식에 의해\n최댓값은 $M = \\sqrt{53} + \\sqrt{3}$이고,\n최솟값은 $m = \\sqrt{53} - \\sqrt{3}$이다.\n7. 합차 공식 $(a+b)(a-b) = a^2 - b^2$을 이용하여 곱을 계산하면\n$M \\times m = (\\sqrt{53} + \\sqrt{3})(\\sqrt{53} - \\sqrt{3}) = (\\sqrt{53})^2 - (\\sqrt{3})^2 = 53 - 3 = 50$이다.\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-GEO-RPM-072",
    "problemTypeKey": "PT_GEO_PLANE_VECTOR",
    "templateKey": "TPL_GEO_PLANE_VECTOR_EXTREMA",
    "crossConceptKeys": [
      "CC_DISTANCE_TWO_POINTS"
    ],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL",
    "image": "assets/images/기하_095_벡터의크기의최대최소-원의성질을이용하는_고2_유형은행1/q2-problem.svg",
    "imageAlt": "좌표평면에서 원 (x−1)²+(y−2)²=3, A(3,0)와 원점 O에서 P로 향하는 벡터",
    "imageCaption": "좌표평면에서 원 (x−1)²+(y−2)²=3, A(3,0)와 원점 O에서 P로 향하는 벡터",
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
    "content": "그림과 같이 $\\overline{\\mathrm{AB}}=12, \\overline{\\mathrm{BC}}=4$인 직사각형 $\\mathrm{ABCD}$에 대하여 네 선분 $\\mathrm{AB, CD, DA, BD}$의 중점을 각각 $\\mathrm{E, F, G, H}$라 하자. 선분 $\\mathrm{CF}$를 지름으로 하는 원 위의 점 $\\mathrm{P}$에 대하여 $|\\vec{EG}+\\vec{HP}|$의 최댓값은?\n\n[그림: 가로의 길이가 4, 세로의 길이가 12인 직사각형 $\\mathrm{ABCD}$와 각 선분의 중점 $\\mathrm{E, F, G, H}$, 선분 $\\mathrm{CF}$를 지름으로 하는 원, 원 위의 점 $\\mathrm{P}$, 그리고 벡터 $\\vec{EG}$와 $\\vec{HP}$를 나타내는 화살표가 그려져 있는 그림]",
    "choices": [
      "8",
      "9",
      "10",
      "11",
      "12"
    ],
    "answer": "①",
    "solution": "1. 점 $\\mathrm{B}$를 원점 $(0, 0)$으로 하고 변 $\\mathrm{BC}$를 $x$축, 변 $\\mathrm{BA}$를 $y$축 위에 놓으면 직사각형의 꼭짓점의 좌표는\n$\\mathrm{B}(0, 0), \\mathrm{C}(4, 0), \\mathrm{A}(0, 12), \\mathrm{D}(4, 12)$이다.\n2. 각 선분의 중점의 좌표를 구하면\n- 선분 $\\mathrm{AB}$의 중점 $\\mathrm{E}(0, 6)$\n- 선분 $\\mathrm{CD}$의 중점 $\\mathrm{F}(4, 6)$\n- 선분 $\\mathrm{DA}$의 중점 $\\mathrm{G}(2, 12)$\n- 선분 $\\mathrm{BD}$의 중점 $\\mathrm{H}(2, 6)$이다.\n3. 벡터 $\\vec{EG}$의 성분은 $\\vec{EG} = \\vec{G} - \\vec{E} = (2, 12) - (0, 6) = (2, 6)$이다.\n4. 선분 $\\mathrm{CF}$를 지름으로 하는 원의 중심을 $\\mathrm{C}_0$이라 하면, $\\mathrm{C}(4, 0)$과 $\\mathrm{F}(4, 6)$의 중점이므로 $\\mathrm{C}_0(4, 3)$이다.\n원의 반지름 $r$은 $r = \\frac{1}{2}\\overline{\\mathrm{CF}} = \\frac{1}{2} \\times 6 = 3$이다.\n5. 점 $\\mathrm{P}$가 원 위의 점이므로 $\\vec{HP} = \\vec{HC_0} + \\vec{C_0P}$로 분해할 수 있으며,\n$\\vec{HC_0} = \\vec{C_0} - \\vec{H} = (4, 3) - (2, 6) = (2, -3)$이다.\n6. 고정된 두 벡터의 합은 $\\vec{EG} + \\vec{HC_0} = (2, 6) + (2, -3) = (4, 3)$이다.\n7. 이 고정된 벡터의 크기는 $|\\vec{EG} + \\vec{HC_0}| = \\sqrt{4^2 + 3^2} = \\sqrt{16 + 9} = \\sqrt{25} = 5$이다.\n8. 점 $\\mathrm{P}$가 원 위를 움직일 때 $|\\vec{C_0P}| = 3$이므로, 삼각부등식에 의해 두 벡터가 같은 방향을 가리킬 때 최댓값을 갖는다.\n$|\\vec{EG}+\\vec{HP}|_{\\text{max}} = |\\vec{EG} + \\vec{HC_0}| + |\\vec{C_0P}| = 5 + 3 = 8$이다.\n따라서 정답은 ①이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-GEO-RPM-072",
    "problemTypeKey": "PT_GEO_PLANE_VECTOR",
    "templateKey": "TPL_GEO_PLANE_VECTOR_EXTREMA",
    "crossConceptKeys": [
      "CC_MIDPOINT",
      "CC_DISTANCE_TWO_POINTS"
    ],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL",
    "image": "assets/images/기하_095_벡터의크기의최대최소-원의성질을이용하는_고2_유형은행1/q3-problem.svg",
    "imageAlt": "AB=12·BC=4 직사각형의 네 중점 E·F·G·H, CF 지름의 원 위 P와 EG·HP 화살표",
    "imageCaption": "AB=12·BC=4 직사각형의 네 중점 E·F·G·H, CF 지름의 원 위 P와 EG·HP 화살표",
    "imageSize": "full"
  }
];
