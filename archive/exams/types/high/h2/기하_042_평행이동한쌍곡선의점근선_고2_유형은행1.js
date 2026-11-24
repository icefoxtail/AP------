window.examTitle = "기하_042_평행이동한쌍곡선의점근선_고2_유형은행1";

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
    "content": "점근선의 방정식이 $y = \\pm \\frac{\\sqrt{3}}{3}x$인 쌍곡선 $\\frac{x^2}{a^2} - \\frac{y^2}{b^2} = -1$을 $x$축의 방향으로 $2$만큼, $y$축의 방향으로 $-1$만큼 평행이동하면 점 $(2, 2)$를 지난다. 쌍곡선 $\\frac{x^2}{a^2} - \\frac{y^2}{b^2} = -1$의 두 초점 사이의 거리는? (단, $a>0, b>0$)",
    "choices": [
      "6",
      "8",
      "10",
      "12",
      "14"
    ],
    "answer": "④",
    "solution": "1단계: 쌍곡선의 점근선의 방정식 공식에 의해 점근선의 기울기 구하기\n쌍곡선 $\\frac{x^2}{a^2} - \\frac{y^2}{b^2} = -1$의 점근선의 방정식은 $y = \\pm \\frac{b}{a}x$이므로, $\\frac{b}{a} = \\frac{\\sqrt{3}}{3} = \\frac{1}{\\sqrt{3}}$에서 $a = \\sqrt{3}b$이다.\n양변을 제곱하면 $a^2 = 3b^2$이다.\n2단계: 평행이동한 쌍곡선의 방정식 세우기\n쌍곡선을 $x$축의 방향으로 $2$만큼, $y$축의 방향으로 $-1$만큼 평행이동한 쌍곡선의 방정식은 $\\frac{(x-2)^2}{a^2} - \\frac{(y+1)^2}{b^2} = -1$이다.\n3단계: 지나는 점의 좌표 대입하여 $a^2, b^2$의 값 구하기\n이 쌍곡선이 점 $(2, 2)$를 지나므로 $x = 2, y = 2$를 대입하면 $\\frac{(2-2)^2}{a^2} - \\frac{(2+1)^2}{b^2} = -1$이다.\n정리하면 $0 - \\frac{3^2}{b^2} = -1$에서 $-\\frac{9}{b^2} = -1$이므로 $b^2 = 9$이다.\n$a^2 = 3b^2$에 $b^2 = 9$를 대입하면 $a^2 = 3 \\times 9 = 27$이다.\n4단계: 쌍곡선의 초점 공식으로 두 초점 사이의 거리 구하기\n쌍곡선의 두 초점의 좌표를 $(0, c), (0, -c)$라 하면, 쌍곡선의 초점 공식에 의해 $c^2 = a^2 + b^2$이다.\n$c^2 = 27 + 9 = 36$이므로 $c = 6$ ($c>0$)이다.\n따라서 두 초점 사이의 거리는 $2c = 2 \\times 6 = 12$이다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-GEO-RPM-044",
    "problemTypeKey": "PT_GEO_HYPERBOLA",
    "templateKey": "TPL_GEO_HYPERBOLA_ASYMPTOTE_AXIS",
    "crossConceptKeys": [
      "CC_TRANSLATION"
    ],
    "conditionKeys": [
      "COND_POSITIVE"
    ],
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
    "content": "직선 $y = 3x + 7$이 쌍곡선 $\\frac{x^2}{a^2} - \\frac{y^2}{27} = 1$을 $y$축의 방향으로 $m$만큼 평행이동한 쌍곡선의 점근선일 때, $a^2 + m$의 값은? (단, $a$는 양수이다.)",
    "choices": [
      "7",
      "8",
      "9",
      "10",
      "11"
    ],
    "answer": "④",
    "solution": "1단계: 원래 쌍곡선의 점근선의 방정식 구하기\n쌍곡선의 점근선 공식에 의해 쌍곡선 $\\frac{x^2}{a^2} - \\frac{y^2}{27} = 1$의 점근선의 방정식은 $y = \\pm \\frac{\\sqrt{27}}{a}x = \\pm \\frac{3\\sqrt{3}}{a}x$이다.\n2단계: $y$축 방향으로 평행이동한 점근선의 방정식 구하기\n도형의 평행이동에 의해 $y$ 대신 $y - m$을 대입하면 $y - m = \\pm \\frac{3\\sqrt{3}}{a}x$이므로, 평행이동한 점근선의 방정식은 $y = \\pm \\frac{3\\sqrt{3}}{a}x + m$이다.\n3단계: 주어진 직선과 계수 비교하여 $a$와 $m$ 구하기\n직선 $y = 3x + 7$의 기울기가 양수이므로, $y = \\frac{3\\sqrt{3}}{a}x + m$과 일치해야 한다.\n기울기를 비교하면 $\\frac{3\\sqrt{3}}{a} = 3$이므로 $a = \\sqrt{3}$이다.\n양변을 제곱하면 $a^2 = (\\sqrt{3})^2 = 3$이다.\n$y$절편을 비교하면 $m = 7$이다.\n4단계: $a^2 + m$의 값 계산하기\n$a^2 + m = 3 + 7 = 10$이다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-GEO-RPM-044",
    "problemTypeKey": "PT_GEO_HYPERBOLA",
    "templateKey": "TPL_GEO_HYPERBOLA_ASYMPTOTE_AXIS",
    "crossConceptKeys": [
      "CC_TRANSLATION"
    ],
    "conditionKeys": [
      "COND_POSITIVE"
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
    "content": "쌍곡선 $\\frac{(x-1)^2}{k^2} - \\frac{(y+5)^2}{16} = -1$의 두 초점 사이의 거리가 $10$이다. 양수 $a$에 대하여 한 점근선의 방정식이 $y = ax + b$일 때, $a + b + k$의 값은? (단, $k>0$이고, $a, b$는 상수이다.)",
    "choices": [
      "-2",
      "-1",
      "0",
      "1",
      "2"
    ],
    "answer": "①",
    "solution": "1단계: 쌍곡선의 중심과 초점 공식으로 $k$의 값 구하기\n쌍곡선 $\\frac{(x-1)^2}{k^2} - \\frac{(y+5)^2}{16} = -1$은 쌍곡선 $\\frac{x^2}{k^2} - \\frac{y^2}{16} = -1$을 $x$축의 방향으로 $1$만큼, $y$축의 방향으로 $-5$만큼 평행이동한 것이다.\n평행이동하기 전 쌍곡선의 두 초점의 좌표는 $(0, c), (0, -c)$이고, 초점 공식에 의해 $c^2 = k^2 + 16$이다.\n평행이동해도 두 초점 사이의 거리는 변하지 않으므로 $2c = 10$에서 $c = 5$이다.\n$c^2 = 25$이므로 $k^2 + 16 = 25$에서 $k^2 = 9$이다.\n$k>0$이므로 $k = 3$이다.\n2단계: 평행이동한 점근선의 방정식 구하기\n기본형 쌍곡선 $\\frac{x^2}{3^2} - \\frac{y^2}{16} = -1$의 점근선의 방정식은 $y = \\pm \\frac{4}{3}x$이다.\n이를 $x$축의 방향으로 $1$만큼, $y$축의 방향으로 $-5$만큼 평행이동하면 $y - (-5) = \\pm \\frac{4}{3}(x - 1)$이다.\n정리하면 $y + 5 = \\pm \\frac{4}{3}(x - 1)$이다.\n3단계: 기울기 $a$가 양수인 점근선 찾아 $a, b$ 결정하기\n점근선의 기울기가 양수 $a$이므로 $+ \\frac{4}{3}$ 부호를 선택한다.\n$y + 5 = \\frac{4}{3}(x - 1) = \\frac{4}{3}x - \\frac{4}{3}$이므로, $y = \\frac{4}{3}x - \\frac{4}{3} - 5 = \\frac{4}{3}x - \\frac{19}{3}$이다.\n따라서 $a = \\frac{4}{3}$, $b = -\\frac{19}{3}$이다.\n4단계: $a + b + k$의 값 계산하기\n$a + b + k = \\frac{4}{3} + \\left(-\\frac{19}{3}\\right) + 3 = -\\frac{15}{3} + 3 = -5 + 3 = -2$이다.\n따라서 정답은 ①이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-GEO-RPM-044",
    "problemTypeKey": "PT_GEO_HYPERBOLA",
    "templateKey": "TPL_GEO_HYPERBOLA_ASYMPTOTE_AXIS",
    "crossConceptKeys": [
      "CC_TRANSLATION"
    ],
    "conditionKeys": [
      "COND_POSITIVE"
    ],
    "integrationPattern": "SEQUENTIAL"
  }
];
