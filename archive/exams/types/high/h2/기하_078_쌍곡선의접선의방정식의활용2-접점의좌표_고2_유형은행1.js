window.examTitle = "기하_078_쌍곡선의접선의방정식의활용2-접점의좌표_고2_유형은행1";

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
    "content": "쌍곡선 $x^2 - \\frac{y^2}{3} = 1$ 위의 점 $(2, 3)$에서의 접선과 두 점근선과의 교점을 각각 $\\mathrm{A}, \\mathrm{B}$라 할 때, 선분 $\\mathrm{AB}$의 길이는?",
    "choices": [
      "$2\\sqrt{5}$",
      "$2\\sqrt{10}$",
      "$3\\sqrt{6}$",
      "$2\\sqrt{15}$",
      "$4\\sqrt{5}$"
    ],
    "answer": "④",
    "solution": "쌍곡선 위의 점 $(x_1, y_1)$에서의 접선의 방정식 공식 $\\frac{x_1 x}{a^2} - \\frac{y_1 y}{b^2} = 1$에 점 $(2, 3)$을 대입한다.\n$2x - \\frac{3y}{3} = 1 \\implies 2x - y = 1 \\implies y = 2x - 1$\n쌍곡선 $x^2 - \\frac{y^2}{3} = 1$의 점근선의 방정식은 $x^2 - \\frac{y^2}{3} = 0$에서 $y = \\pm \\sqrt{3}x$이다.\n(i) 접선과 점근선 $y = \\sqrt{3}x$의 교점 $\\mathrm{A}$ 구하기\n$2x - 1 = \\sqrt{3}x \\implies (2 - \\sqrt{3})x = 1$\n$x = \\frac{1}{2 - \\sqrt{3}} = 2 + \\sqrt{3}, \\quad y = \\sqrt{3}(2 + \\sqrt{3}) = 3 + 2\\sqrt{3}$\n따라서 $\\mathrm{A}(2 + \\sqrt{3}, 3 + 2\\sqrt{3})$이다.\n(ii) 접선과 점근선 $y = -\\sqrt{3}x$의 교점 $\\mathrm{B}$ 구하기\n$2x - 1 = -\\sqrt{3}x \\implies (2 + \\sqrt{3})x = 1$\n$x = \\frac{1}{2 + \\sqrt{3}} = 2 - \\sqrt{3}, \\quad y = -\\sqrt{3}(2 - \\sqrt{3}) = 3 - 2\\sqrt{3}$\n따라서 $\\mathrm{B}(2 - \\sqrt{3}, 3 - 2\\sqrt{3})$이다.\n두 점 사이의 거리 공식을 이용하여 선분 $\\mathrm{AB}$의 길이를 구한다.\n$\\overline{\\mathrm{AB}} = \\sqrt{\\{(2 + \\sqrt{3}) - (2 - \\sqrt{3})\\}^2 + \\{(3 + 2\\sqrt{3}) - (3 - 2\\sqrt{3})\\}^2}$\n$\\overline{\\mathrm{AB}} = \\sqrt{(2\\sqrt{3})^2 + (4\\sqrt{3})^2} = \\sqrt{12 + 48} = \\sqrt{60} = 2\\sqrt{15}$\n따라서 정답은 ④이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-GEO-RPM-051",
    "problemTypeKey": "PT_GEO_CONIC_TANGENT",
    "templateKey": "TPL_GEO_TANGENT_ON_CONIC",
    "crossConceptKeys": [
      "CC_LINE_INTERSECTION",
      "CC_DISTANCE_TWO_POINTS"
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
    "content": "쌍곡선 $x^2 - 4y^2 = a$ 위의 점 $(b, 2)$에서의 접선이 쌍곡선의 한 점근선과 수직이다. $a+b$의 값은? (단, $a, b$는 양수이다.)",
    "choices": [
      "248",
      "256",
      "264",
      "272",
      "280"
    ],
    "answer": "②",
    "solution": "쌍곡선 $x^2 - 4y^2 = a$의 점근선의 방정식을 구한다.\n$x^2 - 4y^2 = 0 \\implies (x - 2y)(x + 2y) = 0 \\implies y = \\frac{1}{2}x$ 또는 $y = -\\frac{1}{2}x$\n쌍곡선 위의 점 $(b, 2)$에서의 접선의 방정식 공식에 대입한다.\n$bx - 4(2)y = a \\implies bx - 8y = a \\implies y = \\frac{b}{8}x - \\frac{a}{8}$\n접선의 기울기는 $\\frac{b}{8}$이다.\n두 직선이 수직일 조건에 의해 두 직선의 기울기의 곱은 $-1$이다.\n$b > 0$이므로 접선의 기울기 $\\frac{b}{8} > 0$이고, 따라서 기울기가 음수인 점근선 $y = -\\frac{1}{2}x$와 수직이다.\n$\\frac{b}{8} \\times \\left(-\\frac{1}{2}\\right) = -1 \\implies \\frac{b}{16} = 1 \\implies b = 16$\n점 $(16, 2)$는 쌍곡선 $x^2 - 4y^2 = a$ 위의 점이므로 대입하여 $a$의 값을 구한다.\n$a = 16^2 - 4 \\times 2^2 = 256 - 4 \\times 4 = 256 - 16 = 240$\n$a+b$의 값을 계산한다.\n$a + b = 240 + 16 = 256$\n따라서 정답은 ②이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-GEO-RPM-051",
    "problemTypeKey": "PT_GEO_CONIC_TANGENT",
    "templateKey": "TPL_GEO_TANGENT_ON_CONIC",
    "crossConceptKeys": [
      "CC_PERPENDICULAR_SLOPE"
    ],
    "conditionKeys": [
      "COND_POSITIVE"
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
    "content": "그림과 같은 쌍곡선 $\\frac{x^2}{3} - \\frac{y^2}{12} = 1$ 위의 점 $(2, 2)$에서의 접선과 이 쌍곡선의 점근선과의 두 교점을 각각 $\\mathrm{P}, \\mathrm{Q}$라 할 때, 삼각형 $\\mathrm{OPQ}$의 넓이는? [그림: 좌표평면에 쌍곡선 $\\frac{x^2}{3}-\\frac{y^2}{12}=1$과 제1사분면 위의 점 $(2, 2)$에서의 접선, 두 점근선 $y=2x, y=-2x$가 그려져 있고, 접선과 두 점근선의 두 교점 $\\mathrm{P}(3, 6), \\mathrm{Q}(1, -2)$ 및 원점 $\\mathrm{O}$를 꼭짓점으로 하는 삼각형 $\\mathrm{OPQ}$의 내부가 음영 처리되어 있다.]",
    "choices": [
      "4",
      "6",
      "8",
      "10",
      "12"
    ],
    "answer": "②",
    "solution": "쌍곡선 위의 점 $(x_1, y_1)$에서의 접선의 방정식 공식 $\\frac{x_1 x}{a^2} - \\frac{y_1 y}{b^2} = 1$에 점 $(2, 2)$를 대입한다.\n$\\frac{2x}{3} - \\frac{2y}{12} = 1 \\implies \\frac{2}{3}x - \\frac{1}{6}y = 1 \\implies 4x - y = 6 \\implies y = 4x - 6$\n쌍곡선 $\\frac{x^2}{3} - \\frac{y^2}{12} = 1$의 점근선의 방정식을 구한다.\n$\\frac{x^2}{3} - \\frac{y^2}{12} = 0 \\implies y^2 = 4x^2 \\implies y = 2x$ 또는 $y = -2x$\n(i) 접선과 점근선 $y = 2x$의 교점 $\\mathrm{P}$ 구하기\n$4x - 6 = 2x \\implies 2x = 6 \\implies x = 3, \\quad y = 2(3) = 6 \\implies \\mathrm{P}(3, 6)$\n(ii) 접선과 점근선 $y = -2x$의 교점 $\\mathrm{Q}$ 구하기\n$4x - 6 = -2x \\implies 6x = 6 \\implies x = 1, \\quad y = -2(1) = -2 \\implies \\mathrm{Q}(1, -2)$\n원점 $\\mathrm{O}(0, 0)$과 두 점 $\\mathrm{P}(x_1, y_1), \\mathrm{Q}(x_2, y_2)$가 이루는 삼각형의 넓이 공식 $S = \\frac{1}{2}|x_1 y_2 - x_2 y_1|$을 적용한다.\n$S = \\frac{1}{2}|3 \\times (-2) - 6 \\times 1| = \\frac{1}{2}|-6 - 6| = \\frac{1}{2} \\times 12 = 6$\n따라서 정답은 ②이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-GEO-RPM-051",
    "problemTypeKey": "PT_GEO_CONIC_TANGENT",
    "templateKey": "TPL_GEO_TANGENT_ON_CONIC",
    "crossConceptKeys": [
      "CC_LINE_INTERSECTION",
      "CC_TRIANGLE_AREA"
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
    "content": "그림과 같이 쌍곡선 $x^2 - y^2 = 8$ 위의 제1사분면 위의 점 $\\mathrm{P}$에서의 접선 $l$이 쌍곡선의 두 점근선과 만나는 점을 각각 $\\mathrm{Q}, \\mathrm{R}$이라 할 때, <보기>에서 옳은 것만을 있는 대로 고른 것은? (단, $\\mathrm{O}$는 원점이다.) [그림: 좌표평면에 직각쌍곡선 $x^2-y^2=8$과 제1사분면 위의 점 $\\mathrm{P}$에서의 접선 $l$, 두 점근선 $y=x, y=-x$가 그려져 있고 접선 $l$과 점근선의 교점이 각각 $\\mathrm{Q}, \\mathrm{R}$로 표시되어 있으며 삼각형 $\\mathrm{OQR}$의 내부가 음영 처리되어 있다.]\n<보기>\nㄱ. 점 $\\mathrm{P}$는 선분 $\\mathrm{QR}$의 중점이다.\nㄴ. $\\overline{\\mathrm{OP}} = \\frac{1}{2}\\overline{\\mathrm{QR}}$\nㄷ. 점 $\\mathrm{P}$의 위치에 관계없이 삼각형 $\\mathrm{OQR}$의 넓이는 8이다.",
    "choices": [
      "ㄱ",
      "ㄴ",
      "ㄱ, ㄴ",
      "ㄱ, ㄷ",
      "ㄱ, ㄴ, ㄷ"
    ],
    "answer": "⑤",
    "solution": "쌍곡선 위의 점 $\\mathrm{P}(x_1, y_1)$에서의 접선 $l$의 방정식은 $x_1 x - y_1 y = 8$이다 ($x_1^2 - y_1^2 = 8$).\n쌍곡선 $x^2 - y^2 = 8$의 두 점근선의 방정식은 $y = x$와 $y = -x$이다.\n접선 $l$과 $y = x$의 교점 $\\mathrm{Q}$를 구하면 $x_1 x - y_1 x = 8 \\implies x = \\frac{8}{x_1 - y_1}$이므로 $\\mathrm{Q}\\left(\\frac{8}{x_1 - y_1}, \\frac{8}{x_1 - y_1}\\right)$이다.\n접선 $l$과 $y = -x$의 교점 $\\mathrm{R}$을 구하면 $x_1 x + y_1 x = 8 \\implies x = \\frac{8}{x_1 + y_1}$이므로 $\\mathrm{R}\\left(\\frac{8}{x_1 + y_1}, -\\frac{8}{x_1 + y_1}\\right)$이다.\nㄱ. 선분 $\\mathrm{QR}$의 중점의 좌표를 계산한다.\n$x$-좌표: $\\frac{1}{2}\\left(\\frac{8}{x_1 - y_1} + \\frac{8}{x_1 + y_1}\\right) = \\frac{1}{2} \\cdot \\frac{8(x_1 + y_1) + 8(x_1 - y_1)}{x_1^2 - y_1^2} = \\frac{1}{2} \\cdot \\frac{16x_1}{8} = x_1$\n$y$-좌표: $\\frac{1}{2}\\left(\\frac{8}{x_1 - y_1} - \\frac{8}{x_1 + y_1}\\right) = \\frac{1}{2} \\cdot \\frac{8(x_1 + y_1) - 8(x_1 - y_1)}{x_1^2 - y_1^2} = \\frac{1}{2} \\cdot \\frac{16y_1}{8} = y_1$\n중점이 $\\mathrm{P}(x_1, y_1)$과 일치하므로 점 $\\mathrm{P}$는 선분 $\\mathrm{QR}$의 중점이다. (참)\nㄴ. 두 점근선 $y = x, y = -x$의 기울기의 곱은 $1 \\times (-1) = -1$이므로 두 점근선은 직교한다.\n따라서 $\\triangle \\mathrm{OQR}$은 $\\angle \\mathrm{QOR} = 90^\\circ$인 직각삼각형이다.\n직각삼각형의 빗변 $\\mathrm{QR}$의 중점 $\\mathrm{P}$는 외심이므로 원점과의 거리는 빗변 길이의 절반이다.\n즉, $\\overline{\\mathrm{OP}} = \\frac{1}{2}\\overline{\\mathrm{QR}}$이다. (참)\nㄷ. 삼각형 $\\mathrm{OQR}$의 넓이 공식 $S = \\frac{1}{2}|x_Q y_R - x_R y_Q|$를 계산한다.\n$S = \\frac{1}{2}\\left|\\frac{8}{x_1 - y_1}\\left(-\\frac{8}{x_1 + y_1}\\right) - \\frac{8}{x_1 + y_1}\\left(\\frac{8}{x_1 - y_1}\\right)\\right| = \\frac{1}{2}\\left|-\\frac{128}{x_1^2 - y_1^2}\\right| = \\frac{1}{2} \\times \\frac{128}{8} = 8$\n따라서 점 $\\mathrm{P}$의 위치에 관계없이 넓이는 8로 일정하다. (참)\n따라서 옳은 것은 ㄱ, ㄴ, ㄷ이므로 정답은 ⑤이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-GEO-RPM-051",
    "problemTypeKey": "PT_GEO_CONIC_TANGENT",
    "templateKey": "TPL_GEO_TANGENT_ON_CONIC",
    "crossConceptKeys": [
      "CC_MIDPOINT",
      "CC_TRIANGLE_AREA",
      "CC_DISTANCE_TWO_POINTS"
    ],
    "conditionKeys": [
      "COND_RANGE"
    ],
    "integrationPattern": "SEQUENTIAL"
  }
];
