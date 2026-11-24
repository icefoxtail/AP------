window.examTitle = "기하_066_포물선과직선사이의거리의최솟값_고2_유형은행1";

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
    "content": "포물선 $y^2 = 8x$ 위의 점과 직선 $2x - y + 11 = 0$ 사이의 거리의 최솟값은?",
    "choices": [
      "\\frac{\\sqrt{5}}{2}",
      "\\sqrt{5}",
      "\\frac{3\\sqrt{5}}{2}",
      "\\frac{7\\sqrt{5}}{4}",
      "2\\sqrt{5}"
    ],
    "answer": "⑤",
    "solution": "1단계: 포물선의 기본형 확인: 포물선 $y^2 = 8x$는 $y^2 = 4px$에서 $4p = 8$이므로 $p = 2$이다.\n2단계: 주어진 직선의 기울기 파악: 직선 $2x - y + 11 = 0$을 변형하면 $y = 2x + 11$이므로 기울기는 $m = 2$이다.\n3단계: 핵심 원리 적용: 포물선 위의 점에서 직선에 이르는 거리의 최솟값은 이 직선과 평행한 접선과 직선 사이의 거리와 같다.\n4단계: 접선의 방정식 공식 적용: 포물선 $y^2 = 4px$에 접하고 기울기가 $m$인 접선의 방정식은 $y = mx + \\frac{p}{m}$이다.\n5단계: 식에 대입: $m = 2$, $p = 2$를 대입하면 $y = 2x + \\frac{2}{2} = 2x + 1$, 즉 $2x - y + 1 = 0$이다.\n6단계: 점과 직선 사이의 거리 공식 적용: 접선 위의 점 $(0, 1)$과 주어진 직선 $2x - y + 11 = 0$ 사이의 거리를 계산한다.\n$d = \\frac{|2(0) - 1 + 11|}{\\sqrt{2^2 + (-1)^2}} = \\frac{10}{\\sqrt{5}} = 2\\sqrt{5}$\n7단계: 접점 좌표를 통한 역산 검증: 접점의 좌표는 $y = \\frac{2p}{m} = \\frac{4}{2} = 2$, $x = \\frac{y^2}{8} = \\frac{4}{8} = \\frac{1}{2}$이다. 점 $\\left(\\frac{1}{2}, 2\\right)$에서 직선 $2x - y + 11 = 0$까지의 거리는 $\\frac{|2(1/2) - 2 + 11|}{\\sqrt{5}} = \\frac{10}{\\sqrt{5}} = 2\\sqrt{5}$로 정확히 일치한다.\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-GEO-RPM-048",
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
    "content": "포물선 $y^2 = 8x$ 위의 점과 직선 $x - y + 6 = 0$ 사이의 거리의 최솟값은?",
    "choices": [
      "\\sqrt{2}",
      "\\frac{3\\sqrt{2}}{2}",
      "2\\sqrt{2}",
      "\\frac{5\\sqrt{2}}{2}",
      "3\\sqrt{2}"
    ],
    "answer": "③",
    "solution": "1단계: 포물선의 초점과 기본형 확인: $y^2 = 8x$는 $y^2 = 4px$에서 $p = 2$이다.\n2단계: 직선의 기울기 확인: 직선 $x - y + 6 = 0$에서 $y = x + 6$이므로 기울기는 $m = 1$이다.\n3단계: 거리의 최솟값 원리: 포물선 위의 점과 직선 사이의 거리가 최소가 되는 점은 기울기가 $1$인 접선 위의 접점이다.\n4단계: 접선의 방정식 구하기: 포물선 $y^2 = 4px$의 기울기 $m$인 접선의 방정식 공식 $y = mx + \\frac{p}{m}$에 $m = 1, p = 2$를 대입한다.\n$y = 1x + \\frac{2}{1} \\implies y = x + 2$, 즉 $x - y + 2 = 0$\n5단계: 평행한 두 직선 사이의 거리 계산: 접선 $x - y + 2 = 0$ 위의 점 $(0, 2)$와 직선 $x - y + 6 = 0$ 사이의 거리를 구한다.\n$d = \\frac{|0 - 2 + 6|}{\\sqrt{1^2 + (-1)^2}} = \\frac{4}{\\sqrt{2}} = 2\\sqrt{2}$\n6단계: 판별식을 이용한 역산 검증: 직선 $x - y + k = 0 \\implies x = y - k$를 포물선에 대입하면 $y^2 = 8(y - k) \\implies y^2 - 8y + 8k = 0$이다. 접할 조건 판별식 $D/4 = (-4)^2 - 8k = 16 - 8k = 0 \\implies k = 2$이므로 접선은 $x - y + 2 = 0$이 맞고 거리는 $2\\sqrt{2}$이다.\n따라서 정답은 ③이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-GEO-RPM-048",
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
    "content": "포물선 $x^2 = 2y$ 위의 점과 직선 $2x - y + 3 = 0$ 사이의 거리의 최솟값은?",
    "choices": [
      "\\frac{\\sqrt{5}}{4}",
      "\\frac{\\sqrt{5}}{2}",
      "\\frac{3\\sqrt{5}}{4}",
      "\\sqrt{5}",
      "\\frac{5\\sqrt{5}}{4}"
    ],
    "answer": "④",
    "solution": "1단계: 포물선의 형태 확인: 포물선 $x^2 = 2y$는 $x^2 = 4py$의 꼴로 $4p = 2$에서 $p = \\frac{1}{2}$이다.\n2단계: 주어진 직선의 기울기 파악: 직선 $2x - y + 3 = 0$에서 $y = 2x + 3$이므로 기울기는 $m = 2$이다.\n3단계: 거리의 최솟값 원리: 직선과 평행한 접선의 접점에서 직선까지의 거리가 최소 거리가 된다.\n4단계: 접선의 방정식 공식 적용: 포물선 $x^2 = 4py$에 접하고 기울기가 $m$인 접선의 방정식은 $y = mx - pm^2$이다.\n5단계: 수치 대입: $m = 2, p = \\frac{1}{2}$를 대입하면 $y = 2x - \\frac{1}{2} \\cdot 2^2 = 2x - 2$, 즉 $2x - y - 2 = 0$이다.\n6단계: 두 평행선 사이의 거리 계산: 접선 위의 점 $(0, -2)$와 직선 $2x - y + 3 = 0$ 사이의 거리를 점과 직선 사이의 거리 공식으로 구한다.\n$d = \\frac{|2(0) - (-2) + 3|}{\\sqrt{2^2 + (-1)^2}} = \\frac{5}{\\sqrt{5}} = \\sqrt{5}$\n7단계: 미분을 통한 접점 검증: $y = \\frac{1}{2}x^2$에서 도함수 $y' = x$이므로 접선의 기울기가 $2$가 되는 접점은 $x = 2, y = 2$이다. 점 $(2, 2)$에서 직선 $2x - y + 3 = 0$까지의 거리는 $\\frac{|2(2) - 2 + 3|}{\\sqrt{5}} = \\frac{5}{\\sqrt{5}} = \\sqrt{5}$로 일치한다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-GEO-RPM-048",
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
    "content": "포물선 $y^2 = 8x$ 위의 점 $P(a, b)$와 직선 $y = x + 4$ 사이의 거리가 최소일 때, $a + b$의 값은?",
    "choices": [
      "2",
      "3",
      "4",
      "5",
      "6"
    ],
    "answer": "⑤",
    "solution": "1단계: 포물선의 기본형 확인: $y^2 = 8x$는 $y^2 = 4px$에서 $p = 2$이다.\n2단계: 주어진 직선의 기울기 확인: 직선 $y = x + 4$의 기울기는 $m = 1$이다.\n3단계: 최단거리 접점의 조건: 점 $P(a, b)$는 직선 $y = x + 4$와 평행한 기울기 $1$인 접선의 접점이다.\n4단계: 접선의 방정식 구하기: 포물선 $y^2 = 4px$에 접하고 기울기가 $m$인 접선의 방정식 $y = mx + \\frac{p}{m}$에 $m = 1, p = 2$를 대입한다.\n$y = 1x + \\frac{2}{1} = x + 2$\n5단계: 접점의 좌표 구하기: 포물선 식과 접선 식을 연립한다.\n$(x + 2)^2 = 8x \\implies x^2 + 4x + 4 = 8x \\implies x^2 - 4x + 4 = 0 \\implies (x - 2)^2 = 0$\n따라서 중근 $x = 2$를 얻는다. 이때 $y = 2 + 2 = 4$이다.\n6단계: 좌표 및 합 계산: $a = 2, b = 4$이므로 $a + b = 2 + 4 = 6$이다.\n7단계: 접점 공식 검증: 기울기가 $m$인 접점의 공식 $\\left(\\frac{p}{m^2}, \\frac{2p}{m}\\right)$에 $p = 2, m = 1$을 대입하면 $\\left(\\frac{2}{1^2}, \\frac{4}{1}\\right) = (2, 4)$이므로 일치한다.\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-GEO-RPM-048",
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
    "content": "좌표평면에서 두 점 $A(-1, 4)$, $B(1, 6)$과 포물선 $y^2 = 4x$ 위의 점 $P$를 꼭짓점으로 하는 삼각형 $ABP$의 넓이의 최솟값은? [그림: 좌표평면에 포물선 $y^2=4x$가 있고, 제2사분면과 제1사분면에 걸쳐 두 점 $A(-1, 4)$, $B(1, 6)$을 잇는 선분 $AB$가 있다. 포물선 위의 점 $P$와 두 점 $A, B$를 꼭짓점으로 하는 삼각형 $ABP$가 표시되어 있다.]",
    "choices": [
      "4",
      "\\frac{9}{2}",
      "5",
      "\\frac{11}{2}",
      "6"
    ],
    "answer": "①",
    "solution": "1단계: 밑변 선분 $AB$의 길이 구하기: 두 점 $A(-1, 4), B(1, 6)$ 사이의 거리를 계산한다.\n$\\overline{AB} = \\sqrt{(1 - (-1))^2 + (6 - 4)^2} = \\sqrt{2^2 + 2^2} = 2\\sqrt{2}$\n2단계: 직선 $AB$의 방정식 구하기: 직선 $AB$의 기울기는 $\\frac{6 - 4}{1 - (-1)} = \\frac{2}{2} = 1$이므로 직선의 방정식은 다음과 같다.\n$y - 4 = 1(x - (-1)) \\implies y = x + 5$, 즉 $x - y + 5 = 0$\n3단계: 높이의 최솟값 원리: 선분 $AB$의 길이가 고정되어 있으므로 점 $P$에서 직선 $AB$까지의 거리가 최소일 때 삼각형의 넓이가 최소이다. 이는 직선 $AB$와 평행한 접선과 직선 $AB$ 사이의 거리이다.\n4단계: 접선의 방정식 구하기: 포물선 $y^2 = 4x$ ($p = 1$)에 접하고 기울기가 $1$인 접선의 방정식은 $y = mx + \\frac{p}{m}$에서 $y = x + 1$, 즉 $x - y + 1 = 0$이다.\n5단계: 높이 $h$ 계산: 접선 위의 점 $(0, 1)$에서 직선 $x - y + 5 = 0$까지의 거리를 구한다.\n$h = \\frac{|0 - 1 + 5|}{\\sqrt{1^2 + (-1)^2}} = \\frac{4}{\\sqrt{2}} = 2\\sqrt{2}$\n6단계: 삼각형 넓이의 최솟값 계산:\n$S = \\frac{1}{2} \\times \\overline{AB} \\times h = \\frac{1}{2} \\times 2\\sqrt{2} \\times 2\\sqrt{2} = 4$\n7단계: 신발끈 공식을 통한 직접 검증: 접점 $P$의 좌표는 $y = \\frac{2p}{m} = 2, x = 1$로 $P(1, 2)$이다. 세 점 $A(-1, 4), B(1, 6), P(1, 2)$에 대해 넓이를 구하면 $S = \\frac{1}{2}|(-1)(6 - 2) + 1(2 - 4) + 1(4 - 6)| = \\frac{1}{2}|-4 - 2 - 2| = 4$로 일치한다.\n따라서 정답은 ①이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "low",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-GEO-RPM-048",
    "problemTypeKey": "PT_GEO_CONIC_TANGENT",
    "templateKey": "TPL_GEO_CONIC_TANGENT_SLOPE_TANGENT",
    "crossConceptKeys": [
      "CC_TRIANGLE_AREA",
      "CC_POINT_TO_LINE_DISTANCE",
      "CC_PARALLEL_LINES"
    ],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
  }
];
