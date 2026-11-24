window.examTitle = "기하_083_쌍곡선밖의점에서접선의방정식_고2_유형은행1";

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
    "content": "점 $(1, 0)$에서 쌍곡선 $2x^2 - y^2 = 4$에 그은 접선의 접점을 각각 $\\mathrm{A}, \\mathrm{B}$라고 할 때, 선분 $\\mathrm{AB}$의 길이는?",
    "choices": [
      "2",
      "4",
      "6",
      "8",
      "10"
    ],
    "answer": "②",
    "solution": "쌍곡선 위의 접점을 $(x_1, y_1)$이라 하면 접선의 방정식 공식에 의해 접선은 $2x_1 x - y_1 y = 4$이다.\n이 접선이 점 $(1, 0)$을 지나므로 대입하면 $2x_1(1) - y_1(0) = 4$이다.\n식을 정리하면 $2x_1 = 4$에서 $x_1 = 2$이다.\n접점 $(x_1, y_1)$은 쌍곡선 $2x^2 - y^2 = 4$ 위의 점이므로 $2x_1^2 - y_1^2 = 4$를 만족한다.\n$x_1 = 2$를 대입하면 $2(2)^2 - y_1^2 = 4$, 즉 $8 - y_1^2 = 4$이다.\n$y_1^2 = 4$이므로 $y_1 = \\pm 2$이다.\n따라서 두 접점의 좌표는 $\\mathrm{A}(2, 2)$, $\\mathrm{B}(2, -2)$이다.\n두 접점의 $x$좌표가 같으므로 선분 $\\mathrm{AB}$의 길이는 두 점의 $y$좌표의 차이다.\n$\\overline{\\mathrm{AB}} = |2 - (-2)| = 4$이다.\n따라서 정답은 ②이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-GEO-RPM-052",
    "problemTypeKey": "PT_GEO_CONIC_TANGENT",
    "templateKey": "TPL_GEO_TANGENT_FROM_OUTSIDE_POINT",
    "crossConceptKeys": [
      "CC_DISTANCE_TWO_POINTS",
      "CC_LINE_INTERSECTION"
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
    "content": "점 $(0, 2)$에서 쌍곡선 $2x^2 - y^2 = 2$에 그은 접선의 방정식이 $ax + y + b = 0$일 때, $a^2 + b^2$의 값은? (단, $a, b$는 상수)",
    "choices": [
      "6",
      "7",
      "8",
      "9",
      "10"
    ],
    "answer": "⑤",
    "solution": "쌍곡선의 양변을 2로 나누어 표준형으로 나타내면 $x^2 - \\frac{y^2}{2} = 1$이다.\n구하는 접선의 기울기를 $m$이라 하면, 접선이 점 $(0, 2)$를 지나므로 접선의 방정식은 $y = mx + 2$이다.\n쌍곡선 $\\frac{x^2}{a^2} - \\frac{y^2}{b^2} = 1$에 접하고 기울기가 $m$인 접선의 방정식 공식은 $y = mx \\pm \\sqrt{a^2 m^2 - b^2}$이다.\n여기서 $a^2 = 1, b^2 = 2$이므로 접선의 방정식은 $y = mx \\pm \\sqrt{m^2 - 2}$이다.\n두 접선의 $y$절편을 비교하면 $\\pm\\sqrt{m^2 - 2} = 2$이다.\n양변을 제곱하면 $m^2 - 2 = 4$에서 $m^2 = 6$이므로 $m = \\pm\\sqrt{6}$이다.\n따라서 접선의 방정식은 $y = \\pm\\sqrt{6}x + 2$이다.\n모든 항을 좌변으로 이항하여 정리하면 $\\mp\\sqrt{6}x + y - 2 = 0$이다.\n주어진 형태 $ax + y + b = 0$과 비교하면 $a = \\mp\\sqrt{6}$, $b = -2$이다.\n따라서 $a^2 + b^2 = (\\mp\\sqrt{6})^2 + (-2)^2 = 6 + 4 = 10$이다.\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-GEO-RPM-052",
    "problemTypeKey": "PT_GEO_CONIC_TANGENT",
    "templateKey": "TPL_GEO_TANGENT_FROM_OUTSIDE_POINT",
    "crossConceptKeys": [
      "CC_SLOPE",
      "CC_Y_INTERCEPT"
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
    "content": "점 $\\mathrm{A}(0, 2)$에서 쌍곡선 $12x^2 - y^2 = 12$에 접선을 그었을 때의 두 접점을 각각 $\\mathrm{P}, \\mathrm{Q}$라 하자. 이때 삼각형 $\\mathrm{APQ}$의 넓이는?",
    "choices": [
      "10",
      "12",
      "14",
      "16",
      "18"
    ],
    "answer": "④",
    "solution": "쌍곡선의 양변을 12로 나누어 정리하면 $x^2 - \\frac{y^2}{12} = 1$이다.\n접점의 좌표를 $(x_1, y_1)$이라 하면 접선의 방정식 공식은 $x_1 x - \\frac{y_1 y}{12} = 1$이다.\n이 접선이 점 $\\mathrm{A}(0, 2)$를 지나므로 대입하면 $x_1(0) - \\frac{y_1(2)}{12} = 1$이다.\n$-\\frac{y_1}{6} = 1$에서 $y_1 = -6$이다.\n접점 $(x_1, y_1)$은 쌍곡선 위의 점이므로 $x_1^2 - \\frac{y_1^2}{12} = 1$에 $y_1 = -6$을 대입한다.\n$x_1^2 - \\frac{(-6)^2}{12} = 1$에서 $x_1^2 - 3 = 1$, 즉 $x_1^2 = 4$이므로 $x_1 = \\pm 2$이다.\n따라서 두 접점의 좌표는 $\\mathrm{P}(2, -6)$, $\\mathrm{Q}(-2, -6)$이다.\n선분 $\\mathrm{PQ}$는 직선 $y = -6$ 위에 있으므로 밑변의 길이는 $\\overline{\\mathrm{PQ}} = |2 - (-2)| = 4$이다.\n점 $\\mathrm{A}(0, 2)$에서 직선 $y = -6$까지의 높이는 $h = 2 - (-6) = 8$이다.\n삼각형 $\\mathrm{APQ}$의 넓이는 $S = \\frac{1}{2} \\times \\overline{\\mathrm{PQ}} \\times h = \\frac{1}{2} \\times 4 \\times 8 = 16$이다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-GEO-RPM-052",
    "problemTypeKey": "PT_GEO_CONIC_TANGENT",
    "templateKey": "TPL_GEO_TANGENT_FROM_OUTSIDE_POINT",
    "crossConceptKeys": [
      "CC_TRIANGLE_AREA",
      "CC_LINE_INTERSECTION"
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
    "content": "점 $\\mathrm{A}(0, a)$에서 쌍곡선 $2x^2 - y^2 = 2$에 그은 접선의 접점을 각각 $\\mathrm{B}, \\mathrm{C}$라 하자. 삼각형 $\\mathrm{ABC}$가 정삼각형일 때, 양수 $a$의 값은?",
    "choices": [
      "1",
      "$\\sqrt{2}$",
      "$\\sqrt{3}$",
      "2",
      "$\\sqrt{5}$"
    ],
    "answer": "①",
    "solution": "쌍곡선의 양변을 2로 나누어 정리하면 $x^2 - \\frac{y^2}{2} = 1$이다.\n접점의 좌표를 $(x_1, y_1)$이라 하면 접선의 방정식은 $x_1 x - \\frac{y_1 y}{2} = 1$이다.\n이 접선이 점 $\\mathrm{A}(0, a)$를 지나므로 대입하면 $x_1(0) - \\frac{y_1 a}{2} = 1$에서 $y_1 = -\\frac{2}{a}$이다.\n접점 $(x_1, y_1)$은 쌍곡선 위의 점이므로 $x_1^2 - \\frac{y_1^2}{2} = 1$에 $y_1 = -\\frac{2}{a}$를 대입한다.\n$x_1^2 - \\frac{1}{2}\\left(-\\frac{2}{a}\\right)^2 = 1$에서 $x_1^2 - \\frac{2}{a^2} = 1$이므로 $x_1^2 = \\frac{a^2 + 2}{a^2}$이다.\n$a > 0$이므로 $x_1 = \\pm\\frac{\\sqrt{a^2 + 2}}{a}$이다.\n두 접점은 $\\mathrm{B}\\left(\\frac{\\sqrt{a^2 + 2}}{a}, -\\frac{2}{a}\\right)$, $\\mathrm{C}\\left(-\\frac{\\sqrt{a^2 + 2}}{a}, -\\frac{2}{a}\\right)$이다.\n선분 $\\mathrm{BC}$의 밑변의 길이는 $\\overline{\\mathrm{BC}} = \\frac{2\\sqrt{a^2 + 2}}{a}$이다.\n점 $\\mathrm{A}(0, a)$에서 선분 $\\mathrm{BC}$까지의 높이는 $h = a - \\left(-\\frac{2}{a}\\right) = \\frac{a^2 + 2}{a}$이다.\n삼각형 $\\mathrm{ABC}$는 이등변삼각형이므로 정삼각형이 되기 위한 조건은 $h = \\frac{\\sqrt{3}}{2}\\overline{\\mathrm{BC}}$이다.\n대입하면 $\\frac{a^2 + 2}{a} = \\frac{\\sqrt{3}}{2} \\times \\frac{2\\sqrt{a^2 + 2}}{a} = \\frac{\\sqrt{3}\\sqrt{a^2 + 2}}{a}$이다.\n양변에 $a$를 곱하고 $\\sqrt{a^2 + 2} > 0$으로 나누면 $\\sqrt{a^2 + 2} = \\sqrt{3}$이다.\n양변을 제곱하면 $a^2 + 2 = 3$에서 $a^2 = 1$이다.\n$a > 0$이므로 $a = 1$이다.\n따라서 정답은 ①이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B45",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-GEO-RPM-052",
    "problemTypeKey": "PT_GEO_CONIC_TANGENT",
    "templateKey": "TPL_GEO_TANGENT_FROM_OUTSIDE_POINT",
    "crossConceptKeys": [
      "CC_EQUILATERAL_TRIANGLE",
      "CC_DISTANCE_TWO_POINTS"
    ],
    "conditionKeys": [
      "COND_POSITIVE"
    ],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 5,
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
    "content": "점 $(-2, 0)$에서 쌍곡선 $x^2 - my^2 = -4$ $(m > 0)$와 포물선 $y^2 = 8x$에 각각 그은 접선이 쌍곡선, 포물선과 제1사분면에서 만나는 점을 각각 $\\mathrm{P}, \\mathrm{Q}$라 하자. $\\overline{\\mathrm{PQ}} = 4$일 때, $32m$의 값은?",
    "choices": [
      "4",
      "6",
      "8",
      "10",
      "12"
    ],
    "answer": "①",
    "solution": "포물선 $y^2 = 8x$ 위의 점 $\\mathrm{Q}(x_2, y_2)$에서의 접선의 방정식 공식은 $y_2 y = 4(x + x_2)$이다.\n이 접선이 점 $(-2, 0)$을 지나므로 대입하면 $0 = 4(-2 + x_2)$에서 $x_2 = 2$이다.\n점 $\\mathrm{Q}$는 포물선 위의 점이므로 $y_2^2 = 8 \\times 2 = 16$에서 $y_2 = 4$이다(제1사분면이므로 $y_2 > 0$).\n따라서 $\\mathrm{Q}(2, 4)$이다.\n쌍곡선 $x^2 - my^2 = -4$ 위의 점 $\\mathrm{P}(x_1, y_1)$에서의 접선의 방정식 공식은 $x_1 x - m y_1 y = -4$이다.\n이 접선이 점 $(-2, 0)$을 지나므로 대입하면 $x_1(-2) - 0 = -4$에서 $x_1 = 2$이다.\n점 $\\mathrm{P}$는 쌍곡선 위의 점이므로 $2^2 - m y_1^2 = -4$에서 $m y_1^2 = 8$, 즉 $y_1 = \\sqrt{\\frac{8}{m}}$이다(제1사분면이므로 $y_1 > 0$).\n따라서 $\\mathrm{P}\\left(2, \\sqrt{\\frac{8}{m}}\\right)$이다.\n두 점 $\\mathrm{P}, \\mathrm{Q}$의 $x$좌표가 2로 같으므로 선분 $\\mathrm{PQ}$의 길이는 $\\overline{\\mathrm{PQ}} = \\left|\\sqrt{\\frac{8}{m}} - 4\\right| = 4$이다.\n(i) $\\sqrt{\\frac{8}{m}} - 4 = 4$인 경우:\n$\\sqrt{\\frac{8}{m}} = 8$에서 양변을 제곱하면 $\\frac{8}{m} = 64$이므로 $m = \\frac{8}{64} = \\frac{1}{8}$이다.\n(ii) $\\sqrt{\\frac{8}{m}} - 4 = -4$인 경우:\n$\\sqrt{\\frac{8}{m}} = 0$이 되어 $m > 0$이라는 조건에 모순이다.\n주의: $\\sqrt{\\frac{8}{m}} > 0$이므로 (ii)의 경우는 성립하지 않는다.\n따라서 $m = \\frac{1}{8}$이다.\n구하는 값은 $32m = 32 \\times \\frac{1}{8} = 4$이다.\n따라서 정답은 ①이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B45",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-GEO-RPM-052",
    "problemTypeKey": "PT_GEO_CONIC_TANGENT",
    "templateKey": "TPL_GEO_TANGENT_FROM_OUTSIDE_POINT",
    "crossConceptKeys": [
      "CC_PARABOLA",
      "CC_DISTANCE_TWO_POINTS"
    ],
    "conditionKeys": [
      "COND_POSITIVE",
      "COND_RANGE"
    ],
    "integrationPattern": "SEQUENTIAL"
  }
];
