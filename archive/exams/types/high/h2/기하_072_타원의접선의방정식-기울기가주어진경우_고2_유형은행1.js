window.examTitle = "기하_072_타원의접선의방정식-기울기가주어진경우_고2_유형은행1";

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
    "content": "타원 $\\frac{x^2}{7} + \\frac{y^2}{18} = 1$에 접하고 직선 $x + 3y - 4 = 0$에 수직인 직선의 방정식은?",
    "choices": [
      "$y = -3x \\pm 3\\sqrt{7}$",
      "$y = -3x \\pm 9$",
      "$y = 3x \\pm 3\\sqrt{7}$",
      "$y = 3x \\pm 9$",
      "$y = 3x \\pm 3\\sqrt{11}$"
    ],
    "answer": "④",
    "solution": "타원의 방정식에서 기본값 확인: 타원 $\\frac{x^2}{7} + \\frac{y^2}{18} = 1$에서 $a^2 = 7, b^2 = 18$이다.\n주어진 직선의 기울기 구하기: 직선 $x + 3y - 4 = 0$을 변형하면 $y = -\\frac{1}{3}x + \\frac{4}{3}$이므로 기울기는 $-\\frac{1}{3}$이다.\n수직 조건 이용하기: 두 직선이 수직이면 기울기의 곱이 $-1$이므로, 구하는 접선의 기울기를 $m$이라 하면 $m \\times \\left(-\\frac{1}{3}\\right) = -1 \\iff m = 3$이다.\n타원의 접선의 방정식 공식 적용하기: 기울기가 $m$인 타원의 접선의 방정식 공식 $y = mx \\pm \\sqrt{a^2 m^2 + b^2}$에 대입한다.\n수치 대입 및 전개: $y = 3x \\pm \\sqrt{7 \\times 3^2 + 18}$이다.\n근호 안 계산하기: $7 \\times 9 + 18 = 63 + 18 = 81$이므로 $y = 3x \\pm \\sqrt{81} = 3x \\pm 9$이다.\n역산 검산(판별식): 접선 $y = 3x + 9$를 타원 $18x^2 + 7y^2 = 126$에 대입하면 $18x^2 + 7(3x+9)^2 = 126 \\iff 81x^2 + 378x + 441 = 0 \\iff (9x + 21)^2 = 0$으로 판별식 $D = 0$을 만족한다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-GEO-RPM-050",
    "problemTypeKey": "PT_GEO_CONIC_TANGENT",
    "templateKey": "TPL_GEO_CONIC_TANGENT_SLOPE_TANGENT",
    "crossConceptKeys": [
      "CC_PERPENDICULAR_SLOPE"
    ],
    "conditionKeys": [],
    "integrationPattern": "NONE"
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
    "content": "타원 $\\frac{x^2}{7} + \\frac{y^2}{36} = 1$에 접하는 직선 $y = -2x + 8$을 $x$축의 방향으로 $a$만큼 평행이동한 직선이 다시 이 타원에 접할 때, 상수 $a$의 값은? (단, $a \\ne 0$)",
    "choices": [
      "-8",
      "-4",
      "2",
      "4",
      "8"
    ],
    "answer": "①",
    "solution": "타원의 기본값 및 접선의 기울기 확인: 타원 $\\frac{x^2}{7} + \\frac{y^2}{36} = 1$에서 $a^2 = 7, b^2 = 36$이고, 직선 $y = -2x + 8$의 기울기는 $m = -2$이다.\n기울기가 $-2$인 접선의 방정식 공식 적용: $y = mx \\pm \\sqrt{a^2 m^2 + b^2}$에 $m = -2$를 대입한다.\n근호 안 계산: $y = -2x \\pm \\sqrt{7 \\times (-2)^2 + 36} = -2x \\pm \\sqrt{28 + 36} = -2x \\pm \\sqrt{64} = -2x \\pm 8$이다.\n다른 접선의 방정식 파악: 기울기가 $-2$인 두 접선은 $y = -2x + 8$과 $y = -2x - 8$이므로, 평행이동하여 접해야 하는 다른 접선은 $y = -2x - 8$이다.\n$x$축 방향 평행이동 식 세우기: 직선 $y = -2x + 8$을 $x$축 방향으로 $a$만큼 평행이동하면 $x$ 대신 $x - a$를 대입하므로 $y = -2(x - a) + 8 = -2x + 2a + 8$이다.\n두 직선이 일치할 조건: $-2x + 2a + 8 = -2x - 8$이 성립해야 하므로 $y$절편을 비교하면 $2a + 8 = -8$이다.\n일차방정식 풀기: $2a = -16 \\iff a = -8$이다.\n주의: $a = 0$이면 자기 자신이 되므로 문제의 조건 $a \\ne 0$을 만족하는 값은 $a = -8$뿐이다.\n따라서 정답은 ①이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-GEO-RPM-050",
    "problemTypeKey": "PT_GEO_CONIC_TANGENT",
    "templateKey": "TPL_GEO_CONIC_TANGENT_SLOPE_TANGENT",
    "crossConceptKeys": [
      "CC_TRANSLATION"
    ],
    "conditionKeys": [
      "COND_NONZERO"
    ],
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
    "content": "직선 $y = 3x - 5$에 평행하고 타원 $\\frac{x^2}{4} + \\frac{y^2}{14} = 1$에 접하는 두 접선 사이의 거리는?",
    "choices": [
      "4",
      "$2\\sqrt{5}$",
      "$2\\sqrt{6}$",
      "5",
      "$4\\sqrt{2}$"
    ],
    "answer": "②",
    "solution": "평행 조건에서 기울기 파악: 직선 $y = 3x - 5$와 평행하므로 구하는 접선의 기울기는 $m = 3$이다.\n타원의 기본값 확인: 타원 $\\frac{x^2}{4} + \\frac{y^2}{14} = 1$에서 $a^2 = 4, b^2 = 14$이다.\n기울기가 주어진 타원의 접선의 방정식 공식 적용: $y = mx \\pm \\sqrt{a^2 m^2 + b^2}$에 대입하면 $y = 3x \\pm \\sqrt{4 \\times 3^2 + 14}$이다.\n근호 안 계산: $4 \\times 9 + 14 = 36 + 14 = 50$이므로 접선의 방정식은 $y = 3x \\pm \\sqrt{50} = 3x \\pm 5\\sqrt{2}$이다.\n일반형으로 변환: 두 평행한 접선은 $3x - y + 5\\sqrt{2} = 0$과 $3x - y - 5\\sqrt{2} = 0$이다.\n평행한 두 직선 사이의 거리 공식 적용: 두 직선 $ax + by + c = 0$과 $ax + by + c' = 0$ 사이의 거리 공식 $d = \\frac{|c - c'|}{\\sqrt{a^2 + b^2}}$에 대입한다.\n거리 계산: $d = \\frac{|5\\sqrt{2} - (-5\\sqrt{2})|}{\\sqrt{3^2 + (-1)^2}} = \\frac{10\\sqrt{2}}{\\sqrt{9 + 1}} = \\frac{10\\sqrt{2}}{\\sqrt{10}}$이다.\n분모 유리화 및 약분: $d = \\frac{10\\sqrt{2}}{\\sqrt{2}\\sqrt{5}} = \\frac{10}{\\sqrt{5}} = 2\\sqrt{5}$이다.\n따라서 정답은 ②이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-GEO-RPM-050",
    "problemTypeKey": "PT_GEO_CONIC_TANGENT",
    "templateKey": "TPL_GEO_CONIC_TANGENT_SLOPE_TANGENT",
    "crossConceptKeys": [
      "CC_PARALLEL_LINES",
      "CC_PARALLEL_LINE_DISTANCE"
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
    "content": "타원 $\\frac{x^2}{8} + \\frac{y^2}{5} = 1$에 접하고 직선 $2x + y - 3 = 0$에 수직인 두 직선 사이의 거리를 $d$라 할 때, $d^2$의 값은?",
    "choices": [
      "18",
      "20",
      "$\\frac{108}{5}$",
      "$\\frac{112}{5}$",
      "24"
    ],
    "answer": "④",
    "solution": "주어진 직선의 기울기 구하기: $2x + y - 3 = 0 \\iff y = -2x + 3$이므로 기울기는 $-2$이다.\n수직인 직선의 기울기 구하기: 두 직선이 수직이면 기울기의 곱이 $-1$이므로 $(-2) \\times m = -1 \\iff m = \\frac{1}{2}$이다.\n타원의 접선의 방정식 공식 적용: 타원 $\\frac{x^2}{8} + \\frac{y^2}{5} = 1$에서 $a^2 = 8, b^2 = 5$이므로 $y = \\frac{1}{2}x \\pm \\sqrt{8 \\times \\left(\\frac{1}{2}\\right)^2 + 5}$이다.\n근호 안 계산: $8 \\times \\frac{1}{4} + 5 = 2 + 5 = 7$이므로 접선은 $y = \\frac{1}{2}x \\pm \\sqrt{7}$이다.\n양변에 2를 곱하여 일반형으로 변환: $2y = x \\pm 2\\sqrt{7} \\iff x - 2y \\pm 2\\sqrt{7} = 0$이다.\n평행한 두 직선 사이의 거리 공식 적용: $d = \\frac{|2\\sqrt{7} - (-2\\sqrt{7})|}{\\sqrt{1^2 + (-2)^2}} = \\frac{4\\sqrt{7}}{\\sqrt{1 + 4}} = \\frac{4\\sqrt{7}}{\\sqrt{5}}$이다.\n거리의 제곱 $d^2$ 계산: $d^2 = \\left(\\frac{4\\sqrt{7}}{\\sqrt{5}}\\right)^2 = \\frac{16 \\times 7}{5} = \\frac{112}{5}$이다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-GEO-RPM-050",
    "problemTypeKey": "PT_GEO_CONIC_TANGENT",
    "templateKey": "TPL_GEO_CONIC_TANGENT_SLOPE_TANGENT",
    "crossConceptKeys": [
      "CC_PERPENDICULAR_SLOPE",
      "CC_PARALLEL_LINE_DISTANCE"
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
    "content": "그림과 같이 타원 $\\frac{x^2}{9} + \\frac{y^2}{4} = 1$의 두 꼭짓점 $A(3, 0), B(0, 2)$를 지나는 직선이 있다. 이 직선에 평행한 타원의 접선 중 $x$절편, $y$절편이 양수인 접선이 $x$축, $y$축과 만나는 점을 각각 $C, D$라 할 때, 삼각형 $OCD$의 넓이는? (단, $O$는 원점이다.) [그림: 좌표평면 위에 타원 \\frac{x^2}{9} + \\frac{y^2}{4} = 1이 있고, x축 위의 꼭짓점 A(3, 0)과 y축 위의 꼭짓점 B(0, 2)를 잇는 직선이 있다. 이 직선과 평행하고 x절편, y절편이 모두 양수인 접선이 x축, y축과 만나는 점을 각각 C, D라 할 때, 직각삼각형 OCD가 그려져 있다.]",
    "choices": [
      "4",
      "$3\\sqrt{3}$",
      "6",
      "$4\\sqrt{3}$",
      "8"
    ],
    "answer": "③",
    "solution": "두 꼭짓점을 지나는 직선의 기울기 구하기: $A(3, 0), B(0, 2)$를 지나는 직선의 기울기는 $m = \\frac{2 - 0}{0 - 3} = -\\frac{2}{3}$이다.\n평행한 접선의 방정식 공식 적용: 타원 $\\frac{x^2}{9} + \\frac{y^2}{4} = 1$에서 $a^2 = 9, b^2 = 4$이므로 기울기가 $-\\frac{2}{3}$인 접선은 $y = -\\frac{2}{3}x \\pm \\sqrt{9 \\times \\left(-\\frac{2}{3}\\right)^2 + 4}$이다.\n근호 안 계산: $9 \\times \\frac{4}{9} + 4 = 4 + 4 = 8$이므로 접선은 $y = -\\frac{2}{3}x \\pm \\sqrt{8} = -\\frac{2}{3}x \\pm 2\\sqrt{2}$이다.\n절편이 양수인 접선 선택: $x$절편과 $y$절편이 모두 양수이어야 하므로 구하는 접선의 방정식은 $y = -\\frac{2}{3}x + 2\\sqrt{2}$이다.\n점 $C$와 $D$의 좌표 구하기: $x = 0$을 대입하면 $y = 2\\sqrt{2}$이므로 $D(0, 2\\sqrt{2})$이고, $y = 0$을 대입하면 $-\\frac{2}{3}x + 2\\sqrt{2} = 0 \\iff x = 3\\sqrt{2}$이므로 $C(3\\sqrt{2}, 0)$이다.\n삼각형 $OCD$의 넓이 계산: $\\triangle OCD$는 직각삼각형이므로 넓이는 $\\frac{1}{2} \\times \\overline{OC} \\times \\overline{OD} = \\frac{1}{2} \\times 3\\sqrt{2} \\times 2\\sqrt{2} = 6$이다.\n따라서 정답은 ③이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-GEO-RPM-050",
    "problemTypeKey": "PT_GEO_CONIC_TANGENT",
    "templateKey": "TPL_GEO_CONIC_TANGENT_SLOPE_TANGENT",
    "crossConceptKeys": [
      "CC_SLOPE",
      "CC_INTERCEPTS",
      "CC_TRIANGLE_AREA"
    ],
    "conditionKeys": [
      "COND_POSITIVE"
    ],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 6,
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
    "content": "두 타원 $3x^2 + y^2 = 3$과 $x^2 + 3y^2 = 3$에 동시에 접하는 직선은 네 개이다. 이 네 직선으로 둘러싸인 도형의 넓이는?",
    "choices": [
      "8",
      "10",
      "12",
      "14",
      "16"
    ],
    "answer": "①",
    "solution": "타원의 표준형 정리: 두 타원의 양변을 3으로 나누면 각각 $\\frac{x^2}{1} + \\frac{y^2}{3} = 1$과 $\\frac{x^2}{3} + \\frac{y^2}{1} = 1$이다.\n공통접선의 방정식 설정: 공통접선의 방정식을 $y = mx + n$이라 하자.\n첫 번째 타원에 접할 조건: 타원의 접선 공식에 의해 $n^2 = 1 \\times m^2 + 3 = m^2 + 3$이다.\n두 번째 타원에 접할 조건: 마찬가지로 접선 공식에 의해 $n^2 = 3 \\times m^2 + 1 = 3m^2 + 1$이다.\n$m^2$과 $n^2$의 값 구하기: $m^2 + 3 = 3m^2 + 1$에서 $2m^2 = 2 \\iff m^2 = 1 \\iff m = \\pm 1$이다. 이를 대입하면 $n^2 = 1 + 3 = 4 \\iff n = \\pm 2$이다.\n네 공통접선의 방정식 구하기: $m = \\pm 1, n = \\pm 2$를 조합하면 $y = x + 2, y = x - 2, y = -x + 2, y = -x - 2$이다.\n둘러싸인 도형 파악: 네 직선은 $x - y = \\pm 2$와 $x + y = \\pm 2$로 이루어져 서로 수직인 두 쌍의 평행선이므로 정사각형이다.\n꼭짓점 좌표 및 대각선 길이: 꼭짓점은 $(2, 0), (0, 2), (-2, 0), (0, -2)$이므로 두 대각선의 길이는 각각 4이다.\n넓이 계산: 대각선의 길이가 서로 수직인 사각형의 넓이는 $S = \\frac{1}{2} \\times 4 \\times 4 = 8$이다.\n따라서 정답은 ①이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-GEO-RPM-050",
    "problemTypeKey": "PT_GEO_CONIC_TANGENT",
    "templateKey": "TPL_GEO_CONIC_TANGENT_SLOPE_TANGENT",
    "crossConceptKeys": [
      "CC_SQUARE",
      "CC_PARALLEL_LINES"
    ],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 7,
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
    "content": "다음 그림과 같이 타원 $2x^2 + y^2 = 6$과 직선 $y = x$의 두 교점에서의 두 접선과, 직선 $y = 2x$에 평행하면서 이 타원에 접하는 두 직선으로 둘러싸인 평행사변형의 넓이는? [그림: 좌표평면 위에 타원 2x^2 + y^2 = 6과 직선 y = x가 만나는 두 점에서 접선 2개가 그어져 있고, 직선 y = 2x와 평행한 접선 2개가 그어져 네 접선이 마름모 모양의 평행사변형을 이루고 있다.]",
    "choices": [
      "18",
      "20",
      "24",
      "27",
      "36"
    ],
    "answer": "①",
    "solution": "교점의 좌표 구하기: 타원 $2x^2 + y^2 = 6$과 직선 $y = x$를 연립하면 $2x^2 + x^2 = 6 \\iff 3x^2 = 6 \\iff x = \\pm\\sqrt{2}$이므로 두 교점은 $(\\sqrt{2}, \\sqrt{2})$와 $(-\\sqrt{2}, -\\sqrt{2})$이다.\n타원 위의 점에서의 접선의 방정식 공식: 타원 $2x^2 + y^2 = 6$ 위의 점 $(x_1, y_1)$에서의 접선은 $2x_1 x + y_1 y = 6$이다.\n교점에서의 두 접선 구하기: $(\\sqrt{2}, \\sqrt{2})$에서의 접선은 $2\\sqrt{2}x + \\sqrt{2}y = 6 \\iff 2x + y = 3\\sqrt{2}$이고, $(-\\sqrt{2}, -\\sqrt{2})$에서의 접선은 $2x + y = -3\\sqrt{2}$이다.\n직선 $y = 2x$에 평행한 두 접선 구하기: 타원의 표준형은 $\\frac{x^2}{3} + \\frac{y^2}{6} = 1$이므로 기울기 $m = 2$인 접선은 $y = 2x \\pm \\sqrt{3 \\times 2^2 + 6} = 2x \\pm \\sqrt{18} = 2x \\pm 3\\sqrt{2} \\iff 2x - y = \\pm 3\\sqrt{2}$이다.\n둘러싸인 네 꼭짓점 구하기:\n(i) $2x + y = 3\\sqrt{2}$와 $2x - y = 3\\sqrt{2}$의 교점은 $\\left(\\frac{3\\sqrt{2}}{2}, 0\\right)$이다.\n(ii) $2x + y = -3\\sqrt{2}$와 $2x - y = -3\\sqrt{2}$의 교점은 $\\left(-\\frac{3\\sqrt{2}}{2}, 0\\right)$이다.\n(iii) $2x + y = 3\\sqrt{2}$와 $2x - y = -3\\sqrt{2}$의 교점은 $(0, 3\\sqrt{2})$이다.\n(iv) $2x + y = -3\\sqrt{2}$와 $2x - y = 3\\sqrt{2}$의 교점은 $(0, -3\\sqrt{2})$이다.\n도형의 넓이 계산: 이 도형은 두 대각선이 좌표축 위에 있고 길이가 각각 $3\\sqrt{2}, 6\\sqrt{2}$인 마름모이므로 넓이는 $S = \\frac{1}{2} \\times 3\\sqrt{2} \\times 6\\sqrt{2} = 18$이다.\n따라서 정답은 ①이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-GEO-RPM-050",
    "problemTypeKey": "PT_GEO_CONIC_TANGENT",
    "templateKey": "TPL_GEO_CONIC_TANGENT_SLOPE_TANGENT",
    "crossConceptKeys": [
      "CC_PARALLELOGRAM_PROPERTIES",
      "CC_PARALLEL_LINE_DISTANCE",
      "CC_AREA"
    ],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 8,
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
    "content": "그림과 같이 중심이 원점이고 두 초점이 $y$축 위에 있는 타원이 있다. 이 타원의 장축의 길이와 단축의 길이가 각각 $6\\sqrt{3}, 8$이다. 점 $A(0, -3\\sqrt{3})$을 지나고 $x$축과 평행한 직선 위의 점 $P$에서 타원에 접하는 접선의 접점을 $Q$라 하자. $\\angle QPA = 60^\\circ$일 때, 선분 $PA$의 길이는? (단, 점 $P$는 제 3사분면 위의 점이다.) [그림: 중심이 원점이고 초점이 y축 위에 있는 타원이 있다. 타원의 아래쪽 꼭짓점 A(0, -3\\sqrt{3})를 지나고 x축에 평행한 직선 위에 점 P가 제3사분면에 위치한다. 점 P에서 타원에 접선 PQ를 그었을 때 접점이 Q이고, 선분 PA와 선분 PQ가 이루는 각은 60^\\circ이다.]",
    "choices": [
      "5",
      "6",
      "7",
      "8",
      "9"
    ],
    "answer": "④",
    "solution": "타원의 방정식 세우기: 타원의 중심이 원점이고 초점이 $y$축 위에 있으므로 $\\frac{x^2}{a^2} + \\frac{y^2}{b^2} = 1$ ($b > a > 0$)이다. 장축의 길이가 $6\\sqrt{3}$이므로 $2b = 6\\sqrt{3} \\iff b = 3\\sqrt{3}$, 단축의 길이가 8이므로 $2a = 8 \\iff a = 4$이다.\n점 $A$와 점 $P$의 위치 파악: $A(0, -3\\sqrt{3})$은 타원의 아래쪽 꼭짓점이고, 점 $P$는 직선 $y = -3\\sqrt{3}$ 위의 제3사분면 점이므로 $P(-t, -3\\sqrt{3})$ ($t > 0$)이며 $\\overline{PA} = t$이다.\n접선 $PQ$의 기울기 구하기: 선분 $PA$는 $x$축 양의 방향과 나란하므로 $\\angle QPA = 60^\\circ$에서 접선 $PQ$의 기울기는 $m = \\tan 60^\\circ = \\sqrt{3}$이다.\n기울기가 $\\sqrt{3}$인 타원의 접선의 방정식 공식 적용: $y = mx \\pm \\sqrt{a^2 m^2 + b^2}$에 대입하면 $y = \\sqrt{3}x \\pm \\sqrt{4^2 \\times (\\sqrt{3})^2 + (3\\sqrt{3})^2} = \\sqrt{3}x \\pm \\sqrt{48 + 27} = \\sqrt{3}x \\pm \\sqrt{75} = \\sqrt{3}x \\pm 5\\sqrt{3}$이다.\n접선 방정식 결정: 제3사분면의 점 $P$에서 그은 접선의 $y$절편은 양수이므로 접선 $PQ$의 방정식은 $y = \\sqrt{3}x + 5\\sqrt{3}$이다.\n점 $P(-t, -3\\sqrt{3})$ 좌표 대입: $-3\\sqrt{3} = \\sqrt{3}(-t) + 5\\sqrt{3}$이다.\n$t$의 값 계산: $\\sqrt{3}t = 5\\sqrt{3} + 3\\sqrt{3} = 8\\sqrt{3} \\iff t = 8$이다.\n선분의 길이 결론: $\\overline{PA} = t = 8$이다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-GEO-RPM-050",
    "problemTypeKey": "PT_GEO_CONIC_TANGENT",
    "templateKey": "TPL_GEO_CONIC_TANGENT_SLOPE_TANGENT",
    "crossConceptKeys": [
      "CC_SLOPE",
      "CC_TRIGONOMETRIC_TANGENT"
    ],
    "conditionKeys": [
      "COND_RANGE"
    ],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 9,
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
    "content": "타원 $\\frac{x^2}{3} + y^2 = 1$의 네 꼭짓점을 연결하여 만든 사각형에 내접하는 타원 $\\frac{x^2}{a^2} + \\frac{y^2}{b^2} = 1$이 있다. 타원 $\\frac{x^2}{a^2} + \\frac{y^2}{b^2} = 1$의 두 초점이 $F(b, 0), F'(-b, 0)$일 때, $a^2 b^2 = \\frac{q}{p}$이다. $p+q$의 값은? (단, $p, q$는 서로소인 자연수이다.) [그림: 좌표평면 위에 타원 \\frac{x^2}{3} + y^2 = 1의 네 꼭짓점을 연결한 사각형(마름모)이 있고, 그 내부에 접하는 타원 \\frac{x^2}{a^2} + \\frac{y^2}{b^2} = 1이 그려져 있다. 내접하는 타원의 두 초점은 x축 위에 있다.]",
    "choices": [
      "37",
      "39",
      "41",
      "43",
      "45"
    ],
    "answer": "④",
    "solution": "바깥쪽 타원의 꼭짓점 및 직선의 방정식 구하기: 타원 $\\frac{x^2}{3} + y^2 = 1$의 꼭짓점은 $(\\pm\\sqrt{3}, 0), (0, \\pm 1)$이다. 제1사분면에서 두 꼭짓점을 지나는 직선의 방정식은 $\\frac{x}{\\sqrt{3}} + \\frac{y}{1} = 1 \\iff y = -\\frac{1}{\\sqrt{3}}x + 1$이다.\n내접 타원의 접선 조건 적용: 직선 $y = -\\frac{1}{\\sqrt{3}}x + 1$이 내접하는 타원 $\\frac{x^2}{a^2} + \\frac{y^2}{b^2} = 1$에 접하므로 공식 $n^2 = a^2 m^2 + b^2$에 의해 $1^2 = a^2 \\times \\left(-\\frac{1}{\\sqrt{3}}\\right)^2 + b^2 \\iff \\frac{a^2}{3} + b^2 = 1$이다.\n초점 조건 이용하기: 타원 $\\frac{x^2}{a^2} + \\frac{y^2}{b^2} = 1$의 초점이 $x$축 위에 있고 $F(b, 0)$이므로 초점의 좌표는 $c = b$이다.\n타원의 초점 공식 적용: $c^2 = a^2 - b^2$에 $c = b$를 대입하면 $b^2 = a^2 - b^2 \\iff a^2 = 2b^2$이다.\n연립방정식 풀기: $a^2 = 2b^2$을 접선 조건 $\\frac{a^2}{3} + b^2 = 1$에 대입하면 $\\frac{2b^2}{3} + b^2 = 1 \\iff \\frac{5}{3}b^2 = 1 \\iff b^2 = \\frac{3}{5}$이다.\n$a^2$의 값 계산: $a^2 = 2b^2 = 2 \\times \\frac{3}{5} = \\frac{6}{5}$이다.\n$a^2 b^2$의 값 계산: $a^2 b^2 = \\frac{6}{5} \\times \\frac{3}{5} = \\frac{18}{25}$이다.\n$p+q$ 계산: $p = 25, q = 18$은 서로소인 자연수이므로 $p + q = 25 + 18 = 43$이다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B45",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-GEO-RPM-050",
    "problemTypeKey": "PT_GEO_CONIC_TANGENT",
    "templateKey": "TPL_GEO_CONIC_TANGENT_SLOPE_TANGENT",
    "crossConceptKeys": [
      "CC_RHOMBUS_PROPERTIES",
      "CC_TANGENCY"
    ],
    "conditionKeys": [
      "COND_NATURAL_NUMBER"
    ],
    "integrationPattern": "SEQUENTIAL"
  }
];
