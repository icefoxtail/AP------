window.examTitle = "기하_052_쌍곡선의정의를이용한거리의합의최대최소_고2_유형은행1";

window.questionBank = [
  {
    "id": 1,
    "category": "이차곡선 핵심 개념",
    "standardCourse": "기하",
    "curriculum": "2022",
    "standardUnitKey": "H22-GE-01",
    "standardUnit": "이차곡선",
    "standardUnitOrder": 1,
    "subUnitKey": "H22-GE-01-CORE",
    "subUnit": "이차곡선 핵심 개념",
    "subUnitConfidence": "candidate_evidence",
    "subUnitClassificationDepth": "complete_candidate",
    "conceptClusterKey": "H22-GE-01-CORE",
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "이차곡선 핵심 개념"
    ],
    "wide": false,
    "content": "그림과 같이 쌍곡선 $\\frac{x^2}{9} - \\frac{y^2}{16} = 1$의 한 초점 $\\mathrm{F}(5, 0)$과 점 $\\mathrm{A}(10, 8)$에 대하여 쌍곡선 위의 점 $\\mathrm{P}$가 제 1사분면 위에 있을 때, $\\overline{\\mathrm{AP}} + \\overline{\\mathrm{PF}}$의 최솟값은?\n\n[그림: 좌표평면 위에 쌍곡선 $\\frac{x^2}{9} - \\frac{y^2}{16} = 1$과 두 초점 $\\mathrm{F}'(-5, 0)$, $\\mathrm{F}(5, 0)$이 표시되어 있다. 제 1사분면에 점 $\\mathrm{A}(10, 8)$과 쌍곡선 위의 점 $\\mathrm{P}$가 위치하며, 선분 $\\mathrm{AP}$와 선분 $\\mathrm{PF}$가 실선으로 연결되어 있다.]",
    "choices": [
      "7",
      "8",
      "9",
      "10",
      "11"
    ],
    "answer": "⑤",
    "solution": "1단계(초점 및 주축의 길이 구하기): 쌍곡선 $\\frac{x^2}{9} - \\frac{y^2}{16} = 1$에서 $a^2 = 9, b^2 = 16$이므로 두 초점의 좌표는 $(-c, 0), (c, 0)$이다. 이때 $c^2 = a^2 + b^2 = 9 + 16 = 25$이므로 $c = 5$이다. 따라서 초점은 $\\mathrm{F}(5, 0), \\mathrm{F}'(-5, 0)$이고, 주축의 길이는 $2a = 2 \\times 3 = 6$이다.\n2단계(쌍곡선의 정의 적용): 점 $\\mathrm{P}$가 쌍곡선의 오른쪽 가지($x > 0$) 위에 있으므로 쌍곡선의 정의에 의해 $\\overline{\\mathrm{PF}'} - \\overline{\\mathrm{PF}} = 6$이 성립한다.\n3단계(식 변형): 위 식에서 $\\overline{\\mathrm{PF}} = \\overline{\\mathrm{PF}'} - 6$이다.\n4단계(목표 식에 대입): 구하는 거리는 $\\overline{\\mathrm{AP}} + \\overline{\\mathrm{PF}} = \\overline{\\mathrm{AP}} + \\overline{\\mathrm{PF}'} - 6$이다.\n5단계(삼각형 부등식 적용): 세 점 $\\mathrm{A}, \\mathrm{P}, \\mathrm{F}'$에 대하여 $\\overline{\\mathrm{AP}} + \\overline{\\mathrm{PF}'} \\ge \\overline{\\mathrm{AF}'}$이므로, $\\overline{\\mathrm{AP}} + \\overline{\\mathrm{PF}'} - 6 \\ge \\overline{\\mathrm{AF}'} - 6$이다. 등호는 점 $\\mathrm{P}$가 선분 $\\mathrm{AF}'$ 위에 있을 때 성립한다.\n6단계(선분 $\\mathrm{AF}'$의 길이 계산): 점 $\\mathrm{A}(10, 8)$과 $\\mathrm{F}'(-5, 0)$ 사이의 거리는 두 점 사이의 거리 공식에 의해 $\\overline{\\mathrm{AF}'} = \\sqrt{(10 - (-5))^2 + (8 - 0)^2} = \\sqrt{15^2 + 8^2} = \\sqrt{225 + 64} = \\sqrt{289} = 17$이다.\n7단계(최솟값 계산): 따라서 $\\overline{\\mathrm{AP}} + \\overline{\\mathrm{PF}}$의 최솟값은 $17 - 6 = 11$이다.\n주의: 선분 $\\mathrm{AF}'$가 제 1사분면에서 쌍곡선의 오른쪽 가지와 실제로 교점을 가지므로 최솟값 11이 달성된다.\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-GEO-RPM-043",
    "problemTypeKey": "PT_GEO_HYPERBOLA",
    "templateKey": "TPL_GEO_HYPERBOLA_FOCAL_DIFF",
    "crossConceptKeys": [
      "CC_SHORTEST_DISTANCE_COLLINEAR",
      "CC_TRIANGLE_INEQUALITY",
      "CC_DISTANCE_TWO_POINTS"
    ],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 2,
    "category": "이차곡선 핵심 개념",
    "standardCourse": "기하",
    "curriculum": "2022",
    "standardUnitKey": "H22-GE-01",
    "standardUnit": "이차곡선",
    "standardUnitOrder": 1,
    "subUnitKey": "H22-GE-01-CORE",
    "subUnit": "이차곡선 핵심 개념",
    "subUnitConfidence": "candidate_evidence",
    "subUnitClassificationDepth": "complete_candidate",
    "conceptClusterKey": "H22-GE-01-CORE",
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "이차곡선 핵심 개념"
    ],
    "wide": false,
    "content": "그림과 같이 쌍곡선 $\\frac{x^2}{3} - \\frac{y^2}{9} = 1$의 두 초점 중 $x$좌표가 양수인 점을 $\\mathrm{F}$라 하자. 점 $\\mathrm{A}(0, 6)$과 이 쌍곡선 위에 있고 $x$좌표가 음수인 점 $\\mathrm{P}$에 대하여 $\\overline{\\mathrm{AP}} + \\overline{\\mathrm{PF}}$의 최솟값은?\n\n[그림: 좌표평면 위에 쌍곡선 $\\frac{x^2}{3} - \\frac{y^2}{9} = 1$과 두 초점 $\\mathrm{F}'(-2\\sqrt{3}, 0)$, $\\mathrm{F}(2\\sqrt{3}, 0)$이 있고, $y$축 위에 점 $\\mathrm{A}(0, 6)$이 있다. 쌍곡선의 왼쪽 가지($x < 0$) 위에 점 $\\mathrm{P}$가 있어 선분 $\\mathrm{AP}$와 선분 $\\mathrm{PF}$가 연결되어 있다.]",
    "choices": [
      "$6\\sqrt{3}$",
      "$5\\sqrt{5}$",
      "$8\\sqrt{2}$",
      "$4\\sqrt{10}$",
      "$6\\sqrt{5}$"
    ],
    "answer": "①",
    "solution": "1단계(초점 및 주축의 길이 구하기): 쌍곡선 $\\frac{x^2}{3} - \\frac{y^2}{9} = 1$에서 $a^2 = 3, b^2 = 9$이다. 초점의 $x$좌표는 $c^2 = a^2 + b^2 = 3 + 9 = 12$에서 $c = \\sqrt{12} = 2\\sqrt{3}$이므로 두 초점은 $\\mathrm{F}(2\\sqrt{3}, 0), \\mathrm{F}'(-2\\sqrt{3}, 0)$이다. 주축의 길이는 $2a = 2\\sqrt{3}$이다.\n2단계(쌍곡선의 정의 적용): 점 $\\mathrm{P}$가 쌍곡선의 왼쪽 가지($x < 0$) 위에 있으므로 쌍곡선의 정의에 의해 $\\overline{\\mathrm{PF}} - \\overline{\\mathrm{PF}'} = 2a = 2\\sqrt{3}$이다.\n3단계(식 변형): 위 식에서 $\\overline{\\mathrm{PF}} = \\overline{\\mathrm{PF}'} + 2\\sqrt{3}$이다.\n4단계(목표 식에 대입): 구하는 거리는 $\\overline{\\mathrm{AP}} + \\overline{\\mathrm{PF}} = \\overline{\\mathrm{AP}} + \\overline{\\mathrm{PF}'} + 2\\sqrt{3}$이다.\n5단계(삼각형 부등식 적용): 세 점 $\\mathrm{A}, \\mathrm{P}, \\mathrm{F}'$에 대하여 $\\overline{\\mathrm{AP}} + \\overline{\\mathrm{PF}'} \\ge \\overline{\\mathrm{AF}'}$이므로, $\\overline{\\mathrm{AP}} + \\overline{\\mathrm{PF}} \\ge \\overline{\\mathrm{AF}'} + 2\\sqrt{3}$이다. 등호는 점 $\\mathrm{P}$가 선분 $\\mathrm{AF}'$ 위에 위치할 때 성립한다.\n6단계(선분 $\\mathrm{AF}'$의 길이 계산): 점 $\\mathrm{A}(0, 6)$과 점 $\\mathrm{F}'(-2\\sqrt{3}, 0)$ 사이의 거리는 $\\overline{\\mathrm{AF}'} = \\sqrt{(-2\\sqrt{3} - 0)^2 + (0 - 6)^2} = \\sqrt{12 + 36} = \\sqrt{48} = 4\\sqrt{3}$이다.\n7단계(최솟값 계산): 따라서 $\\overline{\\mathrm{AP}} + \\overline{\\mathrm{PF}}$의 최솟값은 $\\overline{\\mathrm{AF}'} + 2\\sqrt{3} = 4\\sqrt{3} + 2\\sqrt{3} = 6\\sqrt{3}$이다.\n주의: 선분 $\\mathrm{AF}'$는 $x$좌표가 $-2\\sqrt{3}$에서 $0$으로 증가하므로 $x < 0$인 쌍곡선의 왼쪽 가지와 반드시 만나 점 $\\mathrm{P}$가 존재한다.\n따라서 정답은 ①이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-GEO-RPM-043",
    "problemTypeKey": "PT_GEO_HYPERBOLA",
    "templateKey": "TPL_GEO_HYPERBOLA_FOCAL_DIFF",
    "crossConceptKeys": [
      "CC_SHORTEST_DISTANCE_COLLINEAR",
      "CC_TRIANGLE_INEQUALITY",
      "CC_DISTANCE_TWO_POINTS"
    ],
    "conditionKeys": [
      "COND_POSITIVE",
      "COND_NEGATIVE"
    ],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 3,
    "category": "이차곡선 핵심 개념",
    "standardCourse": "기하",
    "curriculum": "2022",
    "standardUnitKey": "H22-GE-01",
    "standardUnit": "이차곡선",
    "standardUnitOrder": 1,
    "subUnitKey": "H22-GE-01-CORE",
    "subUnit": "이차곡선 핵심 개념",
    "subUnitConfidence": "candidate_evidence",
    "subUnitClassificationDepth": "complete_candidate",
    "conceptClusterKey": "H22-GE-01-CORE",
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "이차곡선 핵심 개념"
    ],
    "wide": false,
    "content": "쌍곡선 $\\frac{x^2}{5} - \\frac{y^2}{4} = -1$의 두 초점 중 $y$좌표가 양수인 점을 $\\mathrm{A}$라 하자. 점 $\\mathrm{B}(5, 9)$와 제 1사분면에 있는 이 쌍곡선 위의 점 $\\mathrm{P}$에 대하여 $\\overline{\\mathrm{AP}} + \\overline{\\mathrm{BP}}$의 최솟값은?",
    "choices": [
      "5",
      "7",
      "9",
      "11",
      "13"
    ],
    "answer": "③",
    "solution": "1단계(초점 및 주축의 길이 구하기): 쌍곡선 $\\frac{x^2}{5} - \\frac{y^2}{4} = -1$은 초점이 $y$축 위에 있는 쌍곡선이다. $a^2 = 5, b^2 = 4$에서 $c^2 = a^2 + b^2 = 5 + 4 = 9$이므로 $c = 3$이다. 두 초점 중 $y$좌표가 양수인 점은 $\\mathrm{A}(0, 3)$이고 다른 초점은 $\\mathrm{A}'(0, -3)$이다. 또한 주축의 길이는 $2b = 2 \\times 2 = 4$이다.\n2단계(쌍곡선의 정의 적용): 점 $\\mathrm{P}$는 제 1사분면에 있으므로 위쪽 가지($y > 0$) 위의 점이다. 쌍곡선의 정의에 의해 $\\overline{\\mathrm{A}'\\mathrm{P}} - \\overline{\\mathrm{AP}} = 2b = 4$가 성립한다.\n3단계(식 변형): 위 식에서 $\\overline{\\mathrm{AP}} = \\overline{\\mathrm{A}'\\mathrm{P}} - 4$이다.\n4단계(목표 식에 대입): 구하는 거리는 $\\overline{\\mathrm{AP}} + \\overline{\\mathrm{BP}} = \\overline{\\mathrm{A}'\\mathrm{P}} + \\overline{\\mathrm{BP}} - 4$이다.\n5단계(삼각형 부등식 적용): 세 점 $\\mathrm{A}', \\mathrm{P}, \\mathrm{B}$에 대하여 $\\overline{\\mathrm{A}'\\mathrm{P}} + \\overline{\\mathrm{BP}} \\ge \\overline{\\mathrm{A}'\\mathrm{B}}$이 성립하므로, $\\overline{\\mathrm{AP}} + \\overline{\\mathrm{BP}} \\ge \\overline{\\mathrm{A}'\\mathrm{B}} - 4$이다. 등호는 점 $\\mathrm{P}$가 선분 $\\mathrm{A}'\\mathrm{B}$ 위에 있을 때 성립한다.\n6단계(선분 $\\mathrm{A}'\\mathrm{B}$의 길이 계산): 점 $\\mathrm{A}'(0, -3)$과 $\\mathrm{B}(5, 9)$ 사이의 거리는 $\\overline{\\mathrm{A}'\\mathrm{B}} = \\sqrt{(5 - 0)^2 + (9 - (-3))^2} = \\sqrt{5^2 + 12^2} = \\sqrt{25 + 144} = \\sqrt{169} = 13$이다.\n7단계(최솟값 계산): 따라서 $\\overline{\\mathrm{AP}} + \\overline{\\mathrm{BP}}$의 최솟값은 $13 - 4 = 9$이다.\n주의: 선분 $\\mathrm{A}'\\mathrm{B}$는 $(0, -3)$과 $(5, 9)$를 잇는 선분으로 제 1사분면에서 쌍곡선의 위쪽 가지와 교점 $(2.5, 3)$을 가지므로 조건을 완벽히 만족한다.\n따라서 정답은 ③이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-GEO-RPM-043",
    "problemTypeKey": "PT_GEO_HYPERBOLA",
    "templateKey": "TPL_GEO_HYPERBOLA_FOCAL_DIFF",
    "crossConceptKeys": [
      "CC_SHORTEST_DISTANCE_COLLINEAR",
      "CC_TRIANGLE_INEQUALITY",
      "CC_DISTANCE_TWO_POINTS"
    ],
    "conditionKeys": [
      "COND_POSITIVE"
    ],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 4,
    "category": "이차곡선 핵심 개념",
    "standardCourse": "기하",
    "curriculum": "2022",
    "standardUnitKey": "H22-GE-01",
    "standardUnit": "이차곡선",
    "standardUnitOrder": 1,
    "subUnitKey": "H22-GE-01-CORE",
    "subUnit": "이차곡선 핵심 개념",
    "subUnitConfidence": "candidate_evidence",
    "subUnitClassificationDepth": "complete_candidate",
    "conceptClusterKey": "H22-GE-01-CORE",
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "이차곡선 핵심 개념"
    ],
    "wide": false,
    "content": "그림과 같이 좌표평면에서 쌍곡선 $\\frac{x^2}{6} - \\frac{y^2}{10} = 1$의 두 초점 $\\mathrm{F}, \\mathrm{F}'$에 대하여 제 1사분면에 있는 쌍곡선 위의 점 $\\mathrm{P}$를 중심으로 하고 쌍곡선의 초점 $\\mathrm{F}$에서 $x$축과 접하는 원 $C$가 있다. 점 $\\mathrm{F}'$에서 원 $C$ 위의 점 사이의 거리를 $l$이라 할 때, $l$의 최솟값은?\n\n[그림: 좌표평면 위에 쌍곡선 $\\frac{x^2}{6} - \\frac{y^2}{10} = 1$과 $x$축 위의 두 초점 $\\mathrm{F}'(-4, 0)$, $\\mathrm{F}(4, 0)$이 있다. 제 1사분면의 쌍곡선 위의 점 $\\mathrm{P}$를 중심으로 하고 초점 $\\mathrm{F}(4, 0)$에서 $x$축에 접하는 원 $C$가 그려져 있다. 점 $\\mathrm{F}'$에서 원 $C$까지의 거리가 표시되어 있다.]",
    "choices": [
      "$2\\sqrt{3}$",
      "4",
      "$2\\sqrt{5}$",
      "$2\\sqrt{6}$",
      "$4\\sqrt{2}$"
    ],
    "answer": "④",
    "solution": "1단계(초점 및 주축의 길이 구하기): 쌍곡선 $\\frac{x^2}{6} - \\frac{y^2}{10} = 1$에서 $a^2 = 6, b^2 = 10$이므로 초점의 $x$좌표는 $c^2 = a^2 + b^2 = 6 + 10 = 16$에서 $c = 4$이다. 따라서 두 초점은 $\\mathrm{F}(4, 0), \\mathrm{F}'(-4, 0)$이고, 주축의 길이는 $2a = 2\\sqrt{6}$이다.\n2단계(원의 반지름과 중심의 성질 파악): 원 $C$의 중심은 $\\mathrm{P}$이고 초점 $\\mathrm{F}(4, 0)$에서 $x$축과 접하므로, 접점 $\\mathrm{F}$는 원 위의 점이다. 따라서 원 $C$의 반지름을 $R$이라 하면 $R = \\overline{\\mathrm{PF}}$이다.\n3단계(원 밖의 점에서 원 위의 점까지 거리의 최솟값 공식): 점 $\\mathrm{F}'$에서 원 $C$ 위의 임의의 점까지의 거리 $l$의 최솟값은 원의 중심 $\\mathrm{P}$와 점 $\\mathrm{F}'$ 사이의 거리에서 반지름 $R$를 뺀 값이다. 즉, $l \\ge \\overline{\\mathrm{PF}'} - R = \\overline{\\mathrm{PF}'} - \\overline{\\mathrm{PF}}$이다.\n4단계(쌍곡선의 정의 적용): 점 $\\mathrm{P}$는 쌍곡선의 오른쪽 가지 위의 점이므로 쌍곡선의 정의에 의해 두 초점까지의 거리의 차는 주축의 길이와 같다. 즉, $\\overline{\\mathrm{PF}'} - \\overline{\\mathrm{PF}} = 2a = 2\\sqrt{6}$이다.\n5단계(최솟값 계산): 따라서 $l$의 최솟값은 $\\overline{\\mathrm{PF}'} - \\overline{\\mathrm{PF}} = 2\\sqrt{6}$이다.\n주의: 접선의 성질에 의해 선분 $\\mathrm{PF}$는 $x$축에 수직이므로 점 $\\mathrm{P}$의 $x$좌표는 $4$이며, 원은 제 1사분면에 정상적으로 존재한다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-GEO-RPM-043",
    "problemTypeKey": "PT_GEO_HYPERBOLA",
    "templateKey": "TPL_GEO_HYPERBOLA_FOCAL_DIFF",
    "crossConceptKeys": [
      "CC_CIRCLE_CENTER_RADIUS",
      "CC_TRIANGLE_INEQUALITY",
      "CC_DISTANCE_TWO_POINTS"
    ],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 5,
    "category": "이차곡선 핵심 개념",
    "standardCourse": "기하",
    "curriculum": "2022",
    "standardUnitKey": "H22-GE-01",
    "standardUnit": "이차곡선",
    "standardUnitOrder": 1,
    "subUnitKey": "H22-GE-01-CORE",
    "subUnit": "이차곡선 핵심 개념",
    "subUnitConfidence": "candidate_evidence",
    "subUnitClassificationDepth": "complete_candidate",
    "conceptClusterKey": "H22-GE-01-CORE",
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "이차곡선 핵심 개념"
    ],
    "wide": false,
    "content": "다음 그림과 같이 두 초점이 $\\mathrm{F}(c, 0), \\mathrm{F}'(-c, 0) (c > 0)$이고 주축의 길이가 4인 쌍곡선 $\\frac{x^2}{a^2} - \\frac{y^2}{b^2} = 1$과 점 $\\mathrm{A}(0, 3)$을 중심으로 하고 반지름의 길이가 1인 원 $C$가 있다. 제 1사분면에 있는 쌍곡선 위를 움직이는 점 $\\mathrm{P}$와 원 $C$ 위를 움직이는 점 $\\mathrm{Q}$에 대하여 $\\overline{\\mathrm{PQ}} + \\overline{\\mathrm{PF}'}$의 최솟값이 8일 때, $a^2 + 2b^2$의 값은? (단, $a, b$는 상수)\n\n[그림: 좌표평면 위에 쌍곡선 $\\frac{x^2}{a^2} - \\frac{y^2}{b^2} = 1$과 두 초점 $\\mathrm{F}'(-c, 0)$, $\\mathrm{F}(c, 0)$이 있고, $y$축 위에 중심 $\\mathrm{A}(0, 3)$, 반지름 1인 원 $C$가 있다. 제 1사분면의 쌍곡선 위의 점 $\\mathrm{P}$와 원 위의 점 $\\mathrm{Q}$에 대하여 선분 $\\mathrm{PQ}$와 선분 $\\mathrm{PF}'$가 연결되어 있다.]",
    "choices": [
      "28",
      "32",
      "36",
      "40",
      "44"
    ],
    "answer": "①",
    "solution": "1단계(쌍곡선 위의 점 $\\mathrm{P}$에 대한 정의 적용): 쌍곡선 $\\frac{x^2}{a^2} - \\frac{y^2}{b^2} = 1$의 주축의 길이가 4이므로 $2a = 4 \\implies a = 2, a^2 = 4$이다. 점 $\\mathrm{P}$는 제 1사분면($x > 0$)의 쌍곡선 위의 점이므로 쌍곡선의 정의에 의해 $\\overline{\\mathrm{PF}'} - \\overline{\\mathrm{PF}} = 2a = 4$이다. 따라서 $\\overline{\\mathrm{PF}'} = \\overline{\\mathrm{PF}} + 4$이다.\n2단계(원의 성질을 이용한 $\\overline{\\mathrm{PQ}}$의 최솟값 표현): 점 $\\mathrm{Q}$는 중심이 $\\mathrm{A}(0, 3)$이고 반지름이 1인 원 $C$ 위의 점이므로, 점 $\\mathrm{P}$에서 원 위의 점 $\\mathrm{Q}$까지의 거리의 최솟값은 $\\overline{\\mathrm{AP}} - 1$이다. 즉, $\\overline{\\mathrm{PQ}} \\ge \\overline{\\mathrm{AP}} - 1$이다.\n3단계(목표 식 정리): $\\overline{\\mathrm{PQ}} + \\overline{\\mathrm{PF}'} \\ge (\\overline{\\mathrm{AP}} - 1) + (\\overline{\\mathrm{PF}} + 4) = \\overline{\\mathrm{AP}} + \\overline{\\mathrm{PF}} + 3$이다.\n4단계(삼각형 부등식 적용): 세 점 $\\mathrm{A}, \\mathrm{P}, \\mathrm{F}$에 대하여 $\\overline{\\mathrm{AP}} + \\overline{\\mathrm{PF}} \\ge \\overline{\\mathrm{AF}}$이므로, $\\overline{\\mathrm{PQ}} + \\overline{\\mathrm{PF}'} \\ge \\overline{\\mathrm{AF}} + 3$이다. 선분 $\\mathrm{AF}$는 $y$축 위의 점 $\\mathrm{A}(0, 3)$과 $x$축 위의 점 $\\mathrm{F}(c, 0)$을 잇는 선분이므로 제 1사분면에서 쌍곡선과 반드시 만나 등호가 성립한다.\n5단계(최솟값 조건으로부터 $c$ 구하기): 문제에서 최솟값이 8이라 하였으므로 $\\overline{\\mathrm{AF}} + 3 = 8 \\implies \\overline{\\mathrm{AF}} = 5$이다. 점 $\\mathrm{A}(0, 3)$과 $\\mathrm{F}(c, 0)$ 사이의 거리에서 $\\overline{\\mathrm{AF}}^2 = c^2 + 3^2 = 5^2 = 25$이므로 $c^2 = 25 - 9 = 16$이다.\n6단계($b^2$ 및 구하는 값 계산): 쌍곡선의 초점 공식 $c^2 = a^2 + b^2$에서 $b^2 = c^2 - a^2 = 16 - 4 = 12$이다. 따라서 $a^2 + 2b^2 = 4 + 2 \\times 12 = 4 + 24 = 28$이다.\n따라서 정답은 ①이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B45",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-GEO-RPM-043",
    "problemTypeKey": "PT_GEO_HYPERBOLA",
    "templateKey": "TPL_GEO_HYPERBOLA_FOCAL_DIFF",
    "crossConceptKeys": [
      "CC_CIRCLE_CENTER_RADIUS",
      "CC_TRIANGLE_INEQUALITY",
      "CC_DISTANCE_TWO_POINTS"
    ],
    "conditionKeys": [
      "COND_POSITIVE"
    ],
    "integrationPattern": "SEQUENTIAL"
  }
];
