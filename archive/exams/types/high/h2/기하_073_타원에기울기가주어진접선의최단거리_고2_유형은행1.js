window.examTitle = "기하_073_타원에기울기가주어진접선의최단거리_고2_유형은행1";

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
    "content": "그림과 같이 타원 $\\frac{x^2}{3} + y^2 = 1$ 위의 점과 직선 $y = x + 4$ 사이의 거리의 최댓값을 $M$, 최솟값을 $m$이라 할 때, $Mm$의 값은? [그림: 좌표평면 위에 타원 \\frac{x^2}{3} + y^2 = 1과 타원의 위쪽에 타원과 만나지 않는 직선 y = x + 4가 그려져 있다.]",
    "choices": [
      "6",
      "$4\\sqrt{3}$",
      "8",
      "$6\\sqrt{2}$",
      "10"
    ],
    "answer": "①",
    "solution": "직선의 기울기 파악: 주어진 직선 $y = x + 4$의 기울기는 $m = 1$이다.\n기울기가 1인 접선의 방정식 공식 적용: 타원 $\\frac{x^2}{3} + y^2 = 1$에서 $a^2 = 3, b^2 = 1$이므로 $y = x \\pm \\sqrt{3 \\times 1^2 + 1} = x \\pm \\sqrt{4} = x \\pm 2$이다.\n일반형 정리: 주어진 직선은 $x - y + 4 = 0$이고, 두 접선은 각각 $x - y + 2 = 0$, $x - y - 2 = 0$이다.\n최솟값 $m$ 계산: 주어진 직선과 가까운 접선 $x - y + 2 = 0$ 사이의 거리이므로 $m = \\frac{|4 - 2|}{\\sqrt{1^2 + (-1)^2}} = \\frac{2}{\\sqrt{2}} = \\sqrt{2}$이다.\n최댓값 $M$ 계산: 주어진 직선과 먼 접선 $x - y - 2 = 0$ 사이의 거리이므로 $M = \\frac{|4 - (-2)|}{\\sqrt{1^2 + (-1)^2}} = \\frac{6}{\\sqrt{2}} = 3\\sqrt{2}$이다.\n$Mm$의 값 계산: $Mm = 3\\sqrt{2} \\times \\sqrt{2} = 3 \\times 2 = 6$이다.\n따라서 정답은 ①이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-GEO-RPM-050",
    "problemTypeKey": "PT_GEO_CONIC_TANGENT",
    "templateKey": "TPL_GEO_CONIC_TANGENT_SLOPE_TANGENT",
    "crossConceptKeys": [
      "CC_POINT_LINE_DISTANCE",
      "CC_PARALLEL_LINE_DISTANCE"
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
    "content": "타원 $3x^2 + 2y^2 = 30$ 위의 점 $P(a, b)$와 직선 $x - y - 8 = 0$ 사이의 거리가 최소일 때, $a^2 + b^2$의 값은?",
    "choices": [
      "9",
      "10",
      "11",
      "12",
      "13"
    ],
    "answer": "⑤",
    "solution": "타원의 표준형 변환: $3x^2 + 2y^2 = 30$의 양변을 30으로 나누면 $\\frac{x^2}{10} + \\frac{y^2}{15} = 1$이므로 $a^2 = 10, b^2 = 15$이다.\n직선의 기울기 확인: $x - y - 8 = 0 \\iff y = x - 8$이므로 기울기는 $m = 1$이다.\n평행한 접선의 방정식 구하기: $y = mx \\pm \\sqrt{a^2 m^2 + b^2}$에 대입하면 $y = x \\pm \\sqrt{10 \\times 1^2 + 15} = x \\pm \\sqrt{25} = x \\pm 5$이다.\n최소 거리를 주는 접선 선택: 직선 $y = x - 8$과 더 가까운 접선은 $y = x - 5 \\iff x - y - 5 = 0$이다.\n타원 위의 점 $P(a, b)$에서의 접선의 방정식 공식 적용: 타원 $\\frac{x^2}{10} + \\frac{y^2}{15} = 1$ 위의 점 $P(a, b)$에서의 접선은 $\\frac{ax}{10} + \\frac{by}{15} = 1$이다.\n계수 비교하여 $a, b$ 구하기: 직선 $x - y = 5$의 양변을 5로 나누면 $\\frac{x}{5} - \\frac{y}{5} = 1$이다. 따라서 $\\frac{a}{10} = \\frac{1}{5} \\iff a = 2$이고, $\\frac{b}{15} = -\\frac{1}{5} \\iff b = -3$이다.\n점 $P$의 타원 위 검산: $3(2)^2 + 2(-3)^2 = 12 + 18 = 30$으로 타원의 방정식을 정확히 만족한다.\n$a^2 + b^2$ 계산: $a^2 + b^2 = 2^2 + (-3)^2 = 4 + 9 = 13$이다.\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-GEO-RPM-050",
    "problemTypeKey": "PT_GEO_CONIC_TANGENT",
    "templateKey": "TPL_GEO_CONIC_TANGENT_SLOPE_TANGENT",
    "crossConceptKeys": [
      "CC_POINT_LINE_DISTANCE",
      "CC_DISTANCE_FORMULA"
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
    "content": "그림과 같이 두 점 $A(1, 9), B(5, 5)$와 타원 $\\frac{x^2}{20} + \\frac{y^2}{16} = 1$ 위의 한 점 $P$에 대하여 삼각형 $ABP$의 넓이의 최솟값은? [그림: 좌표평면 위에 타원 \\frac{x^2}{20} + \\frac{y^2}{16} = 1과 제1사분면에 두 점 A(1, 9), B(5, 5)가 위치하고, 타원 위의 점 P와 함께 삼각형 ABP가 그려져 있다.]",
    "choices": [
      "4",
      "$2\\sqrt{6}$",
      "6",
      "8",
      "$6\\sqrt{2}$"
    ],
    "answer": "④",
    "solution": "선분 $AB$의 길이 구하기: 두 점 $A(1, 9), B(5, 5)$ 사이의 거리는 $\\overline{AB} = \\sqrt{(5 - 1)^2 + (5 - 9)^2} = \\sqrt{16 + 16} = 4\\sqrt{2}$이다.\n직선 $AB$의 방정식 구하기: 기울기는 $\\frac{5 - 9}{5 - 1} = -1$이므로 직선의 방정식은 $y - 5 = -(x - 5) \\iff x + y - 10 = 0$이다.\n넓이의 최솟값 조건: 밑변 $\\overline{AB}$가 일정하므로 타원 위의 점 $P$에서 직선 $AB$까지의 거리(높이)가 최소일 때 삼각형의 넓이가 최소가 된다.\n직선 $AB$에 평행한 접선의 방정식 구하기: 타원 $\\frac{x^2}{20} + \\frac{y^2}{16} = 1$에서 $a^2 = 20, b^2 = 16$이고 기울기 $m = -1$이므로 접선은 $y = -x \\pm \\sqrt{20 \\times (-1)^2 + 16} = -x \\pm \\sqrt{36} = -x \\pm 6 \\iff x + y \\pm 6 = 0$이다.\n최소 높이 $h$ 계산: 직선 $x + y - 10 = 0$에 가장 가까운 접선은 $x + y - 6 = 0$이므로, $h = \\frac{|-10 - (-6)|}{\\sqrt{1^2 + 1^2}} = \\frac{4}{\\sqrt{2}} = 2\\sqrt{2}$이다.\n삼각형 $ABP$의 넓이의 최솟값 계산: $S = \\frac{1}{2} \\times \\overline{AB} \\times h = \\frac{1}{2} \\times 4\\sqrt{2} \\times 2\\sqrt{2} = 8$이다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-GEO-RPM-050",
    "problemTypeKey": "PT_GEO_CONIC_TANGENT",
    "templateKey": "TPL_GEO_CONIC_TANGENT_SLOPE_TANGENT",
    "crossConceptKeys": [
      "CC_TRIANGLE_AREA",
      "CC_POINT_LINE_DISTANCE"
    ],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL",
    "image": "assets/images/기하_073_타원에기울기가주어진접선의최단거리_고2_유형은행1/q3-problem.svg",
    "imageAlt": "타원 위의 대표점 P와 주어진 두 외부점 A,B가 만드는 삼각형 ABP",
    "imageCaption": "타원 위의 대표점 P와 주어진 두 외부점 A,B가 만드는 삼각형 ABP",
    "imageSize": "full"
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
    "content": "그림과 같이 두 점 $A(3, 0), B(5, 2)$와 타원 $\\frac{x^2}{11} + \\frac{y^2}{25} = 1$ 위의 점 $P$에 대하여 삼각형 $ABP$의 넓이의 최댓값은? (단, 세 점 $A, B, P$는 일직선 위에 있지 않다.) [그림: 좌표평면 위에 타원 \\frac{x^2}{11} + \\frac{y^2}{25} = 1이 있고, 점 A(3, 0)은 타원 내부, 점 B(5, 2)는 타원 외부에 위치한다. 타원 위의 점 P와 함께 삼각형 ABP가 그려져 있다.]",
    "choices": [
      "7",
      "8",
      "9",
      "10",
      "11"
    ],
    "answer": "③",
    "solution": "선분 $AB$의 길이 구하기: 두 점 $A(3, 0), B(5, 2)$ 사이의 거리는 $\\overline{AB} = \\sqrt{(5 - 3)^2 + (2 - 0)^2} = \\sqrt{4 + 4} = 2\\sqrt{2}$이다.\n직선 $AB$의 방정식 구하기: 기울기는 $\\frac{2 - 0}{5 - 3} = 1$이므로 직선의 방정식은 $y - 0 = 1(x - 3) \\iff x - y - 3 = 0$이다.\n넓이의 최댓값 조건: 밑변 $\\overline{AB}$가 일정하므로 타원 위의 점 $P$에서 직선 $AB$까지의 거리가 최대일 때 넓이가 최대가 된다.\n직선 $AB$에 평행한 접선의 방정식 구하기: 타원 $\\frac{x^2}{11} + \\frac{y^2}{25} = 1$에서 $a^2 = 11, b^2 = 25$이고 기울기 $m = 1$이므로 접선은 $y = x \\pm \\sqrt{11 \\times 1^2 + 25} = x \\pm \\sqrt{36} = x \\pm 6 \\iff x - y \\pm 6 = 0$이다.\n최대 높이 $h$ 계산: 직선 $x - y - 3 = 0$에서 가장 먼 접선은 $x - y + 6 = 0$이므로, 최대 거리 $h = \\frac{|-3 - 6|}{\\sqrt{1^2 + (-1)^2}} = \\frac{9}{\\sqrt{2}}$이다.\n삼각형 $ABP$의 넓이의 최댓값 계산: $S = \\frac{1}{2} \\times \\overline{AB} \\times h = \\frac{1}{2} \\times 2\\sqrt{2} \\times \\frac{9}{\\sqrt{2}} = 9$이다.\n주의: 점 $P$는 직선 $AB$와 평행하고 거리가 $\\frac{9}{\\sqrt{2}}$인 직선 위의 접점이므로 세 점 $A, B, P$가 일직선 위에 있을 수 없다.\n따라서 정답은 ③이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-GEO-RPM-050",
    "problemTypeKey": "PT_GEO_CONIC_TANGENT",
    "templateKey": "TPL_GEO_CONIC_TANGENT_SLOPE_TANGENT",
    "crossConceptKeys": [
      "CC_TRIANGLE_AREA",
      "CC_POINT_LINE_DISTANCE"
    ],
    "conditionKeys": [
      "COND_NO_THREE_COLLINEAR_POINTS"
    ],
    "integrationPattern": "SEQUENTIAL",
    "image": "assets/images/기하_073_타원에기울기가주어진접선의최단거리_고2_유형은행1/q4-problem.svg",
    "imageAlt": "세로로 긴 타원의 내부점 A·외부점 B·대표 타원점 P를 이은 삼각형",
    "imageCaption": "세로로 긴 타원의 내부점 A·외부점 B·대표 타원점 P를 이은 삼각형",
    "imageSize": "full"
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
    "content": "그림과 같이 타원 $x^2 + 4y^2 = 16$이 $x$축, $y$축의 양의 부분과 만나는 점을 각각 $A, B$라 하고, 이 타원 위의 제 1사분면에 있는 한 점을 $P$라 할 때, 사각형 $OAPB$의 넓이의 최댓값은? (단, $O$는 원점) [그림: 좌표평면 위에 타원 x^2 + 4y^2 = 16이 있고, x축 양의 교점 A(4, 0), y축 양의 교점 B(0, 2)가 있다. 제1사분면의 타원 위의 점 P와 원점 O, A, B를 연결한 볼록사각형 OAPB가 그려져 있다.]",
    "choices": [
      "2",
      "$2\\sqrt{2}$",
      "4",
      "$4\\sqrt{2}$",
      "6"
    ],
    "answer": "④",
    "solution": "타원의 표준형 및 절편 구하기: $x^2 + 4y^2 = 16$의 양변을 16으로 나누면 $\\frac{x^2}{16} + \\frac{y^2}{4} = 1$이다. $x$축 양의 교점은 $A(4, 0)$, $y$축 양의 교점은 $B(0, 2)$이다.\n고정된 삼각형 $OAB$의 넓이 계산: $\\triangle OAB$는 밑변이 4, 높이가 2인 직각삼각형이므로 넓이는 $\\frac{1}{2} \\times 4 \\times 2 = 4$이다.\n사각형의 넓이 분할: 사각형 $OAPB$의 넓이는 $\\triangle OAB + \\triangle PAB = 4 + \\triangle PAB$이므로, $\\triangle PAB$의 넓이가 최대일 때 사각형의 넓이도 최대가 된다.\n직선 $AB$의 방정식 및 길이 구하기: 두 점 $A(4, 0), B(0, 2)$를 지나는 직선의 기울기는 $-\\frac{2}{4} = -\\frac{1}{2}$이므로 직선은 $y = -\\frac{1}{2}x + 2 \\iff x + 2y - 4 = 0$이고, $\\overline{AB} = \\sqrt{4^2 + 2^2} = \\sqrt{20} = 2\\sqrt{5}$이다.\n직선 $AB$에 평행한 접선의 방정식 구하기: 기울기가 $-\\frac{1}{2}$인 접선은 $y = -\\frac{1}{2}x \\pm \\sqrt{16 \\times \\left(-\\frac{1}{2}\\right)^2 + 4} = -\\frac{1}{2}x \\pm \\sqrt{4 + 4} = -\\frac{1}{2}x \\pm 2\\sqrt{2}$이다.\n제1사분면의 접선 선택: $x, y$절편이 양수인 접선은 $y = -\\frac{1}{2}x + 2\\sqrt{2} \\iff x + 2y - 4\\sqrt{2} = 0$이다.\n최대 높이 및 $\\triangle PAB$의 최댓값 계산: 높이의 최댓값은 $h = \\frac{|-4\\sqrt{2} - (-4)|}{\\sqrt{1^2 + 2^2}} = \\frac{4\\sqrt{2} - 4}{\\sqrt{5}}$이므로 $\\triangle PAB$의 넓이의 최댓값은 $\\frac{1}{2} \\times 2\\sqrt{5} \\times \\frac{4(\\sqrt{2} - 1)}{\\sqrt{5}} = 4\\sqrt{2} - 4$이다.\n사각형 $OAPB$의 넓이의 최댓값 계산: $S = 4 + (4\\sqrt{2} - 4) = 4\\sqrt{2}$이다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-GEO-RPM-050",
    "problemTypeKey": "PT_GEO_CONIC_TANGENT",
    "templateKey": "TPL_GEO_CONIC_TANGENT_SLOPE_TANGENT",
    "crossConceptKeys": [
      "CC_TRIANGLE_AREA"
    ],
    "conditionKeys": [
      "COND_POSITIVE"
    ],
    "integrationPattern": "SEQUENTIAL",
    "image": "assets/images/기하_073_타원에기울기가주어진접선의최단거리_고2_유형은행1/q5-problem.svg",
    "imageAlt": "타원과 양의 두 축 꼭짓점 A,B 및 대표점 P를 잇는 볼록사각형 OAPB",
    "imageCaption": "타원과 양의 두 축 꼭짓점 A,B 및 대표점 P를 잇는 볼록사각형 OAPB",
    "imageSize": "full"
  }
];
