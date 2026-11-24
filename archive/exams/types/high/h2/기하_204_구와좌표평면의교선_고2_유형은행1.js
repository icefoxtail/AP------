window.examTitle = "기하_204_구와좌표평면의교선_고2_유형은행1";

window.questionBank = [
  {
    "id": 1,
    "category": "공간좌표 핵심 개념",
    "standardCourse": "기하",
    "curriculum": "2022",
    "standardUnitKey": "H22-GE-04",
    "standardUnit": "공간좌표",
    "standardUnitOrder": 4,
    "subUnitKey": "H22-GE-04-CORE",
    "subUnit": "공간좌표 핵심 개념",
    "subUnitConfidence": "candidate_evidence",
    "subUnitClassificationDepth": "complete_candidate",
    "conceptClusterKey": "H22-GE-04-CORE",
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "공간좌표 핵심 개념"
    ],
    "wide": false,
    "content": "좌표공간의 두 점 $\\mathrm{A}(3, -2, 5)$, $\\mathrm{B}(-5, 4, -1)$을 지름의 양 끝점으로 하는 구가 $zx$평면과 만나서 생기는 도형의 넓이는?",
    "choices": [
      "$25\\pi$",
      "$27\\pi$",
      "$29\\pi$",
      "$31\\pi$",
      "$33\\pi$"
    ],
    "answer": "⑤",
    "solution": "선분 $\\mathrm{AB}$의 중점이 구의 중심이므로 구의 중심 $\\mathrm{C}$의 좌표는\n$$\\mathrm{C}\\left(\\frac{3-5}{2}, \\frac{-2+4}{2}, \\frac{5-1}{2}\\right) = (-1, 1, 2)$$\n구의 반지름의 길이 $r$는\n$$r = \\overline{\\mathrm{CA}} = \\sqrt{(3+1)^2 + (-2-1)^2 + (5-2)^2} = \\sqrt{16 + 9 + 9} = \\sqrt{34}$$\n이므로 구의 방정식은\n$$(x+1)^2 + (y-1)^2 + (z-2)^2 = 34$$\n이 구가 $zx$평면($y=0$)과 만나서 생기는 원의 방정식은\n$$(x+1)^2 + (0-1)^2 + (z-2)^2 = 34 \\iff (x+1)^2 + (z-2)^2 = 33$$\n따라서 생기는 도형은 반지름의 길이가 $\\sqrt{33}$인 원이므로 넓이는 $33\\pi$이다.\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B12",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-GEO-RPM-064",
    "problemTypeKey": "PT_GEO_SPHERE",
    "templateKey": "TPL_GEO_SPHERE_SECTION_TANGENT",
    "primaryMethod": "지름의 양 끝점에서 중심과 반지름을 구해 단면원의 반지름으로 옮긴다",
    "decisiveStep": "$r^2-d^2=34-1^2=33$에서 넓이 $33\\pi$",
    "crossConceptKeys": [
      "CC_MIDPOINT",
      "CC_DISTANCE_TWO_POINTS",
      "CC_CIRCLE_CIRCUMFERENCE"
    ],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 2,
    "category": "공간좌표 핵심 개념",
    "standardCourse": "기하",
    "curriculum": "2022",
    "standardUnitKey": "H22-GE-04",
    "standardUnit": "공간좌표",
    "standardUnitOrder": 4,
    "subUnitKey": "H22-GE-04-CORE",
    "subUnit": "공간좌표 핵심 개념",
    "subUnitConfidence": "candidate_evidence",
    "subUnitClassificationDepth": "complete_candidate",
    "conceptClusterKey": "H22-GE-04-CORE",
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "공간좌표 핵심 개념"
    ],
    "wide": false,
    "content": "구 $x^2+y^2+z^2+4x-6y+2z+k=0$을 $zx$평면으로 자른 단면의 둘레의 길이가 $6\\pi$일 때, 실수 $k$의 값은?",
    "choices": [
      "$-4$",
      "$-3$",
      "$-2$",
      "$-1$",
      "$0$"
    ],
    "answer": "①",
    "solution": "주어진 구의 방정식을 변형하면\n$$(x+2)^2 + (y-3)^2 + (z+1)^2 = 14 - k$$\n이 구를 $zx$평면($y=0$)으로 자른 단면인 원의 방정식은\n$$(x+2)^2 + (0-3)^2 + (z+1)^2 = 14 - k \\iff (x+2)^2 + (z+1)^2 = 5 - k$$\n단면인 원의 둘레의 길이가 $6\\pi$이므로 반지름의 길이는 $3$이다.\n즉, $5 - k = 3^2 = 9$이므로 $k = -4$이다.\n(이때 $14 - k = 18 > 0$이므로 구의 조건을 만족한다.)\n따라서 정답은 ①이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-GEO-RPM-064",
    "problemTypeKey": "PT_GEO_SPHERE",
    "templateKey": "TPL_GEO_SPHERE_SECTION_TANGENT",
    "primaryMethod": "구를 표준형으로 고쳐 $y=0$ 단면원의 둘레에서 반지름을 정하고 $k$를 푼다",
    "decisiveStep": "$5-k=3^2=9$에서 $k=-4$",
    "crossConceptKeys": [
      "CC_CIRCLE_CENTER_RADIUS",
      "CC_CIRCLE_CIRCUMFERENCE"
    ],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 3,
    "category": "공간좌표 핵심 개념",
    "standardCourse": "기하",
    "curriculum": "2022",
    "standardUnitKey": "H22-GE-04",
    "standardUnit": "공간좌표",
    "standardUnitOrder": 4,
    "subUnitKey": "H22-GE-04-CORE",
    "subUnit": "공간좌표 핵심 개념",
    "subUnitConfidence": "candidate_evidence",
    "subUnitClassificationDepth": "complete_candidate",
    "conceptClusterKey": "H22-GE-04-CORE",
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "공간좌표 핵심 개념"
    ],
    "wide": false,
    "content": "중심이 $\\mathrm{A}(a, 3, b)$이고 반지름의 길이가 $5$인 구가 $y$축에 접하고 있다. 이 구가 $yz$평면과 만나서 생기는 원의 넓이가 $16\\pi$일 때, 두 양수 $a, b$에 대하여 $ab$의 값은?",
    "choices": [
      "$10$",
      "$12$",
      "$14$",
      "$16$",
      "$18$"
    ],
    "answer": "②",
    "solution": "중심이 $\\mathrm{A}(a, 3, b)$이고 반지름의 길이가 $5$인 구가 $y$축에 접하므로 점 $\\mathrm{A}$에서 $y$축까지의 거리가 $5$이다.\n즉, $\\sqrt{a^2 + b^2} = 5$에서 $a^2 + b^2 = 25$이다.\n구의 방정식 $(x-a)^2 + (y-3)^2 + (z-b)^2 = 25$에서 $yz$평면($x=0$)과의 교선은\n$$(y-3)^2 + (z-b)^2 = 25 - a^2$$\n이 원의 넓이가 $16\\pi$이므로 $25 - a^2 = 16$, 즉 $a^2 = 9$이다.\n$a > 0$이므로 $a = 3$이고, $b^2 = 25 - 9 = 16$에서 $b > 0$이므로 $b = 4$이다.\n따라서 $ab = 3 \\times 4 = 12$이다.\n따라서 정답은 ②이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-GEO-RPM-064",
    "problemTypeKey": "PT_GEO_SPHERE",
    "templateKey": "TPL_GEO_SPHERE_SECTION_TANGENT",
    "primaryMethod": "$y$축에 접하는 조건으로 $a^2+b^2=25$를 세우고 단면원 넓이로 $a$, $b$를 정한다",
    "decisiveStep": "$25-a^2=16$에서 $a=3$, $b^2=25-9=16$에서 $b=4$",
    "crossConceptKeys": [
      "CC_TANGENCY",
      "CC_DISTANCE_TWO_POINTS",
      "CC_CIRCLE_CIRCUMFERENCE"
    ],
    "conditionKeys": [
      "COND_POSITIVE"
    ],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 4,
    "category": "공간좌표 핵심 개념",
    "standardCourse": "기하",
    "curriculum": "2022",
    "standardUnitKey": "H22-GE-04",
    "standardUnit": "공간좌표",
    "standardUnitOrder": 4,
    "subUnitKey": "H22-GE-04-CORE",
    "subUnit": "공간좌표 핵심 개념",
    "subUnitConfidence": "candidate_evidence",
    "subUnitClassificationDepth": "complete_candidate",
    "conceptClusterKey": "H22-GE-04-CORE",
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "공간좌표 핵심 개념"
    ],
    "wide": false,
    "content": "좌표공간에서 $x$축, $y$축, $z$축에 모두 접하고 중심의 $x, y, z$좌표가 모두 양수인 구가 $yz$평면과 만나서 생기는 도형의 넓이가 $36\\pi$일 때, 이 구의 반지름의 길이는?",
    "choices": [
      "$6$",
      "$8$",
      "$6\\sqrt{2}$",
      "$10$",
      "$8\\sqrt{2}$"
    ],
    "answer": "③",
    "solution": "구의 중심을 $(a, b, c)$ ($a>0, b>0, c>0$), 반지름의 길이를 $r$라 하자.\n구가 $x$축, $y$축, $z$축에 모두 접하므로 중심에서 각 좌표축까지의 거리가 모두 $r$와 같다.\n$$b^2 + c^2 = r^2, \\quad c^2 + a^2 = r^2, \\quad a^2 + b^2 = r^2$$\n따라서 $a = b = c$이고, $2a^2 = r^2$이므로 $r = \\sqrt{2}a$이다.\n구의 방정식 $(x-a)^2 + (y-a)^2 + (z-a)^2 = 2a^2$이 $yz$평면($x=0$)과 만나서 생기는 원의 방정식은\n$$(y-a)^2 + (z-a)^2 = 2a^2 - a^2 = a^2$$\n이 원의 넓이가 $\\pi a^2 = 36\\pi$이므로 $a = 6$이다.\n따라서 구의 반지름의 길이는 $r = 6\\sqrt{2}$이다.\n따라서 정답은 ③이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-GEO-RPM-064",
    "problemTypeKey": "PT_GEO_SPHERE",
    "templateKey": "TPL_GEO_SPHERE_SECTION_TANGENT",
    "primaryMethod": "세 축에 접하는 조건으로 $a=b=c$를 얻고 $yz$평면 단면원 넓이에서 반지름을 구한다",
    "decisiveStep": "$2a^2=r^2$과 $r^2-a^2=a^2=36$에서 $r=6\\sqrt{2}$",
    "crossConceptKeys": [
      "CC_TANGENCY",
      "CC_DISTANCE_TWO_POINTS",
      "CC_CIRCLE_CIRCUMFERENCE"
    ],
    "conditionKeys": [
      "COND_POSITIVE"
    ],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 5,
    "category": "공간좌표 핵심 개념",
    "standardCourse": "기하",
    "curriculum": "2022",
    "standardUnitKey": "H22-GE-04",
    "standardUnit": "공간좌표",
    "standardUnitOrder": 4,
    "subUnitKey": "H22-GE-04-CORE",
    "subUnit": "공간좌표 핵심 개념",
    "subUnitConfidence": "candidate_evidence",
    "subUnitClassificationDepth": "complete_candidate",
    "conceptClusterKey": "H22-GE-04-CORE",
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "공간좌표 핵심 개념"
    ],
    "wide": false,
    "content": "구 $x^2+y^2+z^2-2x+4y-6z-11=0$을 $zx$평면으로 자를 때 생기는 단면을 밑면으로 하고, 구에 내접하는 원뿔의 부피의 최댓값은?",
    "choices": [
      "$41\\pi$",
      "$43\\pi$",
      "$45\\pi$",
      "$47\\pi$",
      "$49\\pi$"
    ],
    "answer": "⑤",
    "solution": "구의 방정식을 표준형으로 변형하면\n$$(x-1)^2 + (y+2)^2 + (z-3)^2 = 25$$\n이므로 구의 중심은 $\\mathrm{C}(1, -2, 3)$이고 반지름의 길이는 $5$이다.\n이 구를 $zx$평면($y=0$)으로 자른 단면인 원의 방정식은\n$$(x-1)^2 + 4 + (z-3)^2 = 25 \\iff (x-1)^2 + (z-3)^2 = 21$$\n이므로 밑면의 넓이는 $21\\pi$이다.\n원뿔의 부피가 최대가 되려면 꼭짓점이 밑면인 $zx$평면으로부터 가장 멀리 떨어져 있어야 한다.\n중심 $\\mathrm{C}(1, -2, 3)$에서 $zx$평면까지의 거리가 $|-2|=2$이므로 원뿔의 높이의 최댓값은\n$$5 + 2 = 7$$\n따라서 구하는 원뿔의 부피의 최댓값은\n$$\\frac{1}{3} \\times 21\\pi \\times 7 = 49\\pi$$\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-GEO-RPM-064",
    "problemTypeKey": "PT_GEO_SPHERE",
    "templateKey": "TPL_GEO_SPHERE_SECTION_TANGENT",
    "primaryMethod": "단면을 밑면으로 하는 원뿔의 최대 높이를 중심과 평면 사이 거리로 잡아 부피를 구한다",
    "decisiveStep": "높이 $5+2=7$로 $\\frac{1}{3}\\times21\\pi\\times7=49\\pi$",
    "crossConceptKeys": [
      "CC_CIRCLE_CIRCUMFERENCE",
      "CC_CONE_VOLUME"
    ],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 6,
    "category": "공간좌표 핵심 개념",
    "standardCourse": "기하",
    "curriculum": "2022",
    "standardUnitKey": "H22-GE-04",
    "standardUnit": "공간좌표",
    "standardUnitOrder": 4,
    "subUnitKey": "H22-GE-04-CORE",
    "subUnit": "공간좌표 핵심 개념",
    "subUnitConfidence": "candidate_evidence",
    "subUnitClassificationDepth": "complete_candidate",
    "conceptClusterKey": "H22-GE-04-CORE",
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "공간좌표 핵심 개념"
    ],
    "wide": false,
    "content": "구 $(x-2)^2+(y-a)^2+(z-3)^2=a^2-2a+22$가 $xy$평면, $yz$평면, $zx$평면과 각각 만나서 생기는 도형의 넓이의 합의 최솟값은? (단, $0 < a < 11$)",
    "choices": [
      "$\\frac{97}{2}\\pi$",
      "$49\\pi$",
      "$\\frac{99}{2}\\pi$",
      "$50\\pi$",
      "$\\frac{101}{2}\\pi$"
    ],
    "answer": "①",
    "solution": "주어진 구의 반지름의 길이를 $r$라 하면 $r^2 = a^2 - 2a + 22$이다.\n각 좌표평면과 만나서 생기는 원의 방정식에서 반지름의 길이의 제곱을 구하면 다음과 같다.\n① $xy$평면($z=0$): $(x-2)^2+(y-a)^2 = r^2 - 9 = a^2 - 2a + 13$\n② $yz$평면($x=0$): $(y-a)^2+(z-3)^2 = r^2 - 4 = a^2 - 2a + 18$\n③ $zx$평면($y=0$): $(x-2)^2+(z-3)^2 = r^2 - a^2 = -2a + 22$\n($0 < a < 11$이므로 세 식 모두 양수이다.)\n따라서 세 도형의 넓이의 합 $S$는\n$$S = \\pi\\{(a^2-2a+13) + (a^2-2a+18) + (-2a+22)\\} = \\pi(2a^2 - 6a + 53)$$\n$$= \\pi\\left\\{2\\left(a - \\frac{3}{2}\\right)^2 + \\frac{97}{2}\\right\\}$$\n$0 < \\frac{3}{2} < 11$이므로 $a = \\frac{3}{2}$일 때 최솟값 $\\frac{97}{2}\\pi$를 갖는다.\n따라서 정답은 ①이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-GEO-RPM-064",
    "problemTypeKey": "PT_GEO_SPHERE",
    "templateKey": "TPL_GEO_SPHERE_SECTION_TANGENT",
    "primaryMethod": "세 좌표평면 단면 넓이의 합을 $a$의 이차식으로 세우고 완전제곱해 최솟값을 읽는다",
    "decisiveStep": "$S=\\pi(2a^2-6a+53)$에서 $a=\\frac{3}{2}$일 때 최솟값 $\\frac{97}{2}\\pi$",
    "crossConceptKeys": [
      "CC_CIRCLE_CIRCUMFERENCE",
      "CC_QUADRATIC_EXTREMUM"
    ],
    "conditionKeys": [
      "COND_RANGE"
    ],
    "integrationPattern": "SEQUENTIAL"
  }
];
