window.examTitle = "기하_082_쌍곡선에기울기가주어진접선의최단거리_고2_유형은행1";

window.questionBank = [
  {
    "id": 1,
    "category": "이차곡선의 접선 핵심 개념",
    "standardCourse": "기하",
    "curriculum": "2022",
    "standardUnitKey": "H22-GE-02",
    "standardUnit": "이차곡선의 접선",
    "standardUnitOrder": 2,
    "subUnitKey": "H22-GE-02-CORE",
    "subUnit": "이차곡선의 접선 핵심 개념",
    "subUnitConfidence": "candidate_evidence",
    "subUnitClassificationDepth": "complete_candidate",
    "conceptClusterKey": "H22-GE-02-CORE",
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "이차곡선의 접선 핵심 개념"
    ],
    "wide": false,
    "content": "쌍곡선 $\\frac{x^2}{5} - \\frac{y^2}{4} = 1$ 위의 점과 직선 $2x - y + 14 = 0$ 사이의 거리의 최솟값은?",
    "choices": [
      "$\\frac{\\sqrt{5}}{2}$",
      "$\\sqrt{5}$",
      "$\\frac{3\\sqrt{5}}{2}$",
      "$2\\sqrt{5}$",
      "$\\frac{5\\sqrt{5}}{2}$"
    ],
    "answer": "④",
    "solution": "쌍곡선 위의 점과 주어진 직선 사이의 거리의 최솟값은 주어진 직선과 평행한 접선과 직선 사이의 거리와 같다.\n주어진 직선 $2x - y + 14 = 0$, 즉 $y = 2x + 14$의 기울기는 $m = 2$이다.\n쌍곡선 $\\frac{x^2}{a^2} - \\frac{y^2}{b^2} = 1$에 접하고 기울기가 $m$인 접선의 방정식 공식은 $y = mx \\pm \\sqrt{a^2 m^2 - b^2}$이다.\n$a^2 = 5$, $b^2 = 4$, $m = 2$를 대입하면 $a^2 m^2 - b^2 = 5 \\times 2^2 - 4 = 16 > 0$이다.\n따라서 기울기가 2인 두 접선의 방정식은 $y = 2x \\pm \\sqrt{16}$, 즉 $2x - y + 4 = 0$ 또는 $2x - y - 4 = 0$이다.\n(i) 직선 $2x - y + 14 = 0$과 접선 $2x - y + 4 = 0$ 사이의 거리는 $\\frac{|14 - 4|}{\\sqrt{2^2 + (-1)^2}} = \\frac{10}{\\sqrt{5}} = 2\\sqrt{5}$이다.\n(ii) 직선 $2x - y + 14 = 0$과 접선 $2x - y - 4 = 0$ 사이의 거리는 $\\frac{|14 - (-4)|}{\\sqrt{2^2 + (-1)^2}} = \\frac{18}{\\sqrt{5}} = \\frac{18\\sqrt{5}}{5}$이다.\n두 거리 중 더 가까운 접선과의 거리가 최솟값이므로 거리의 최솟값은 $2\\sqrt{5}$이다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-GEO-RPM-052",
    "problemTypeKey": "PT_GEO_CONIC_TANGENT",
    "templateKey": "TPL_GEO_CONIC_TANGENT_SLOPE_TANGENT",
    "crossConceptKeys": [
      "CC_POINT_TO_LINE_DISTANCE",
      "CC_PARALLEL_LINES"
    ],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 2,
    "category": "이차곡선의 접선 핵심 개념",
    "standardCourse": "기하",
    "curriculum": "2022",
    "standardUnitKey": "H22-GE-02",
    "standardUnit": "이차곡선의 접선",
    "standardUnitOrder": 2,
    "subUnitKey": "H22-GE-02-CORE",
    "subUnit": "이차곡선의 접선 핵심 개념",
    "subUnitConfidence": "candidate_evidence",
    "subUnitClassificationDepth": "complete_candidate",
    "conceptClusterKey": "H22-GE-02-CORE",
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "이차곡선의 접선 핵심 개념"
    ],
    "wide": false,
    "content": "쌍곡선 $x^2 - 3y^2 = -12$ 위의 점과 직선 $x - 2y = 0$ 사이의 거리의 최솟값은?",
    "choices": [
      "$\\frac{\\sqrt{5}}{15}$",
      "$\\frac{\\sqrt{5}}{10}$",
      "$\\frac{\\sqrt{5}}{5}$",
      "$\\frac{3\\sqrt{5}}{10}$",
      "$\\frac{2\\sqrt{5}}{5}$"
    ],
    "answer": "⑤",
    "solution": "쌍곡선의 양변을 $-12$로 나누어 표준형으로 변형하면 $\\frac{x^2}{12} - \\frac{y^2}{4} = -1$이다.\n주어진 직선 $x - 2y = 0$, 즉 $y = \\frac{1}{2}x$의 기울기는 $m = \\frac{1}{2}$이다.\n쌍곡선 $\\frac{x^2}{a^2} - \\frac{y^2}{b^2} = -1$에 접하고 기울기가 $m$인 접선의 방정식 공식은 $y = mx \\pm \\sqrt{b^2 - a^2 m^2}$이다.\n$a^2 = 12$, $b^2 = 4$, $m = \\frac{1}{2}$을 대입하면 $b^2 - a^2 m^2 = 4 - 12 \\times \\left(\\frac{1}{2}\\right)^2 = 4 - 3 = 1 > 0$이다.\n따라서 기울기가 $\\frac{1}{2}$인 두 접선의 방정식은 $y = \\frac{1}{2}x \\pm 1$, 즉 $x - 2y + 2 = 0$ 또는 $x - 2y - 2 = 0$이다.\n점과 직선 사이의 거리 공식을 이용하여 직선 $x - 2y = 0$ 위의 점 $(0, 0)$과 접선 $x - 2y + 2 = 0$ 사이의 거리를 구한다.\n거리 공식에 대입하면 $d = \\frac{|0 - 2(0) + 2|}{\\sqrt{1^2 + (-2)^2}} = \\frac{2}{\\sqrt{5}} = \\frac{2\\sqrt{5}}{5}$이다.\n다른 접선 $x - 2y - 2 = 0$과의 거리도 $\\frac{|-2|}{\\sqrt{5}} = \\frac{2\\sqrt{5}}{5}$로 동일하다.\n따라서 구하는 최단거리는 $\\frac{2\\sqrt{5}}{5}$이다.\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-GEO-RPM-052",
    "problemTypeKey": "PT_GEO_CONIC_TANGENT",
    "templateKey": "TPL_GEO_CONIC_TANGENT_SLOPE_TANGENT",
    "crossConceptKeys": [
      "CC_POINT_TO_LINE_DISTANCE",
      "CC_PARALLEL_LINES"
    ],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 3,
    "category": "이차곡선의 접선 핵심 개념",
    "standardCourse": "기하",
    "curriculum": "2022",
    "standardUnitKey": "H22-GE-02",
    "standardUnit": "이차곡선의 접선",
    "standardUnitOrder": 2,
    "subUnitKey": "H22-GE-02-CORE",
    "subUnit": "이차곡선의 접선 핵심 개념",
    "subUnitConfidence": "candidate_evidence",
    "subUnitClassificationDepth": "complete_candidate",
    "conceptClusterKey": "H22-GE-02-CORE",
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "이차곡선의 접선 핵심 개념"
    ],
    "wide": false,
    "content": "그림과 같이 두 정점 $\\mathrm{A}(1, 3)$, $\\mathrm{B}(-1, -1)$과 쌍곡선 $\\frac{x^2}{3} - \\frac{y^2}{3} = 1$ 위의 임의의 점 $\\mathrm{C}$에 대하여 삼각형 $\\mathrm{ABC}$의 넓이의 최솟값은?\n[그림: 좌표평면에 쌍곡선 $\\frac{x^2}{3}-\\frac{y^2}{3}=1$과 제1사분면의 점 $\\mathrm{A}(1, 3)$, 제3사분면의 점 $\\mathrm{B}(-1, -1)$을 이은 선분 $\\mathrm{AB}$, 그리고 쌍곡선 위의 점 $\\mathrm{C}$로 이루어진 삼각형 $\\mathrm{ABC}$가 그려져 있다.]",
    "choices": [
      "$\\frac{3}{2}$",
      "2",
      "$\\frac{5}{2}$",
      "3",
      "$\\frac{7}{2}$"
    ],
    "answer": "②",
    "solution": "선분 $\\mathrm{AB}$의 길이를 삼각형의 밑변으로 하고, 점 $\\mathrm{C}$에서 직선 $\\mathrm{AB}$까지의 거리를 높이로 한다.\n두 점 $\\mathrm{A}(1, 3)$, $\\mathrm{B}(-1, -1)$ 사이의 거리는 $\\overline{\\mathrm{AB}} = \\sqrt{(1 - (-1))^2 + (3 - (-1))^2} = \\sqrt{4 + 16} = 2\\sqrt{5}$이다.\n직선 $\\mathrm{AB}$의 기울기는 $m = \\frac{3 - (-1)}{1 - (-1)} = \\frac{4}{2} = 2$이다.\n직선 $\\mathrm{AB}$의 방정식은 $y - 3 = 2(x - 1)$, 즉 $2x - y + 1 = 0$이다.\n삼각형 $\\mathrm{ABC}$의 넓이가 최소가 되려면 높이가 최소여야 하므로, 직선 $\\mathrm{AB}$와 평행한 쌍곡선의 접선을 구한다.\n쌍곡선 $\\frac{x^2}{3} - \\frac{y^2}{3} = 1$에 접하고 기울기가 2인 접선의 방정식 공식은 $y = 2x \\pm \\sqrt{3 \\times 2^2 - 3}$이다.\n계산하면 $y = 2x \\pm \\sqrt{9}$, 즉 $2x - y + 3 = 0$ 또는 $2x - y - 3 = 0$이다.\n(i) 직선 $2x - y + 1 = 0$과 접선 $2x - y + 3 = 0$ 사이의 거리는 $\\frac{|1 - 3|}{\\sqrt{2^2 + (-1)^2}} = \\frac{2}{\\sqrt{5}}$이다.\n(ii) 직선 $2x - y + 1 = 0$과 접선 $2x - y - 3 = 0$ 사이의 거리는 $\\frac{|1 - (-3)|}{\\sqrt{2^2 + (-1)^2}} = \\frac{4}{\\sqrt{5}}$이다.\n따라서 높이의 최솟값은 $h = \\frac{2}{\\sqrt{5}}$이다.\n삼각형 $\\mathrm{ABC}$의 넓이의 최솟값은 $S = \\frac{1}{2} \\times \\overline{\\mathrm{AB}} \\times h = \\frac{1}{2} \\times 2\\sqrt{5} \\times \\frac{2}{\\sqrt{5}} = 2$이다.\n따라서 정답은 ②이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-GEO-RPM-052",
    "problemTypeKey": "PT_GEO_CONIC_TANGENT",
    "templateKey": "TPL_GEO_CONIC_TANGENT_SLOPE_TANGENT",
    "crossConceptKeys": [
      "CC_TRIANGLE_AREA",
      "CC_POINT_TO_LINE_DISTANCE",
      "CC_PARALLEL_LINES"
    ],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 4,
    "category": "이차곡선의 접선 핵심 개념",
    "standardCourse": "기하",
    "curriculum": "2022",
    "standardUnitKey": "H22-GE-02",
    "standardUnit": "이차곡선의 접선",
    "standardUnitOrder": 2,
    "subUnitKey": "H22-GE-02-CORE",
    "subUnit": "이차곡선의 접선 핵심 개념",
    "subUnitConfidence": "candidate_evidence",
    "subUnitClassificationDepth": "complete_candidate",
    "conceptClusterKey": "H22-GE-02-CORE",
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "이차곡선의 접선 핵심 개념"
    ],
    "wide": false,
    "content": "그림과 같이 원 $x^2 + (y-3)^2 = 1$ 위의 점 $\\mathrm{P}$와 쌍곡선 $x^2 - 2y^2 = 2$ 위의 점 $\\mathrm{Q}$에 대하여 선분 $\\mathrm{PQ}$의 길이의 최솟값은?\n[그림: 좌표평면에 중심이 $(0, 3)$이고 반지름의 길이가 1인 원과 쌍곡선 $x^2 - 2y^2 = 2$, 원 위의 임의의 점 $\\mathrm{P}$, 쌍곡선 위의 임의의 점 $\\mathrm{Q}$가 표시되어 있다.]",
    "choices": [
      "$\\sqrt{2}-1$",
      "$\\sqrt{3}-1$",
      "$\\sqrt{5}-1$",
      "$\\sqrt{6}-1$",
      "$2\\sqrt{2}-1$"
    ],
    "answer": "⑤",
    "solution": "원의 중심을 $\\mathrm{C}(0, 3)$이라 하면 원의 반지름의 길이는 $r = 1$이다.\n원 위의 점 $\\mathrm{P}$와 쌍곡선 위의 점 $\\mathrm{Q}$ 사이의 거리 $\\overline{\\mathrm{PQ}}$의 최솟값은 $\\overline{\\mathrm{CQ}} - r$이다.\n쌍곡선 $x^2 - 2y^2 = 2$ 위의 점 $\\mathrm{Q}(x, y)$에 대하여 $x^2 = 2y^2 + 2$를 만족한다.\n두 점 $\\mathrm{C}(0, 3)$과 $\\mathrm{Q}(x, y)$ 사이의 거리의 제곱은 $\\overline{\\mathrm{CQ}}^2 = (x - 0)^2 + (y - 3)^2 = x^2 + y^2 - 6y + 9$이다.\n$x^2 = 2y^2 + 2$를 대입하여 $y$에 대한 2차식으로 나타내면 $\\overline{\\mathrm{CQ}}^2 = (2y^2 + 2) + y^2 - 6y + 9 = 3y^2 - 6y + 11$이다.\n완전제곱식으로 변형하면 $3(y - 1)^2 + 8$이다.\n모든 실수 $y$에 대하여 $(y - 1)^2 \\ge 0$이므로 $y = 1$일 때 $\\overline{\\mathrm{CQ}}^2$은 최솟값 8을 갖는다.\n이때 $x^2 = 2(1)^2 + 2 = 4 > 0$이므로 점 $\\mathrm{Q}(\\pm 2, 1)$은 실제로 쌍곡선 위의 점이다.\n따라서 중심과 쌍곡선 위의 점 사이의 최단거리는 $\\overline{\\mathrm{CQ}} = \\sqrt{8} = 2\\sqrt{2}$이다.\n선분 $\\mathrm{PQ}$의 길이의 최솟값은 $\\overline{\\mathrm{CQ}} - r = 2\\sqrt{2} - 1$이다.\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B45",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-GEO-RPM-052",
    "problemTypeKey": "PT_GEO_CONIC_TANGENT",
    "templateKey": "TPL_GEO_CONIC_TANGENT_SLOPE_TANGENT",
    "crossConceptKeys": [
      "CC_CIRCLE_CENTER_RADIUS",
      "CC_DISTANCE_TWO_POINTS",
      "CC_PERPENDICULAR"
    ],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
  }
];
