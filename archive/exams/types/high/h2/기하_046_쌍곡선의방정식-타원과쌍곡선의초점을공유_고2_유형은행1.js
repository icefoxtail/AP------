window.examTitle = "기하_046_쌍곡선의방정식-타원과쌍곡선의초점을공유_고2_유형은행1";

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
    "content": "두 초점을 공유하는 타원 $\\frac{x^2}{25} + \\frac{y^2}{9} = 1$과 쌍곡선이 있다. 이 쌍곡선의 한 점근선의 방정식이 $y = \\sqrt{7}x$일 때, 이 쌍곡선의 두 꼭짓점 사이의 거리는?",
    "choices": [
      "$2$",
      "$2\\sqrt{2}$",
      "$4$",
      "$4\\sqrt{2}$",
      "$6$"
    ],
    "answer": "②",
    "solution": "타원의 초점 구하기: 타원의 방정식 $\\frac{x^2}{25} + \\frac{y^2}{9} = 1$에서 초점의 $x$좌표를 $c$라 하면 $c^2 = 25 - 9 = 16$이므로 두 초점은 $(4, 0), (-4, 0)$이다.\n쌍곡선의 방정식 설정: 쌍곡선의 방정식을 $\\frac{x^2}{a^2} - \\frac{y^2}{b^2} = 1$ ($a>0, b>0$)이라 하면 두 초점을 공유하므로 $a^2 + b^2 = c^2 = 16$이다.\n점근선의 성질 적용: 쌍곡선의 점근선의 방정식은 $y = \\pm \\frac{b}{a}x$이므로 $\\frac{b}{a} = \\sqrt{7}$, 즉 $b = \\sqrt{7}a$이다.\n연립방정식 대입 및 계산: $b^2 = 7a^2$을 $a^2 + b^2 = 16$에 대입하면 $a^2 + 7a^2 = 8a^2 = 16$이므로 $a^2 = 2$이다.\n두 꼭짓점 사이의 거리(주축의 길이) 계산: $a > 0$이므로 $a = \\sqrt{2}$이고, 두 꼭짓점 사이의 거리는 주축의 길이인 $2a = 2\\sqrt{2}$이다.\n따라서 정답은 ②이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-GEO-RPM-044",
    "problemTypeKey": "PT_GEO_HYPERBOLA",
    "templateKey": "TPL_GEO_HYPERBOLA_ASYMPTOTE_AXIS",
    "crossConceptKeys": [
      "CC_ELLIPSE"
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
    "content": "타원 $\\frac{x^2}{28} + \\frac{y^2}{16} = 1$과 두 초점을 공유하고 점근선의 방정식이 $y = \\pm \\frac{\\sqrt{3}}{3}x$인 쌍곡선의 주축의 길이는?",
    "choices": [
      "$2$",
      "$4$",
      "$6$",
      "$8$",
      "$10$"
    ],
    "answer": "③",
    "solution": "타원의 초점 계산: 타원의 정의에 의해 초점의 $x$좌표 $c$는 $c^2 = 28 - 16 = 12$이다.\n쌍곡선 방정식 설정: 쌍곡선의 방정식을 $\\frac{x^2}{a^2} - \\frac{y^2}{b^2} = 1$ ($a>0, b>0$)이라 하면 초점을 공유하므로 $a^2 + b^2 = c^2 = 12$이다.\n점근선의 방정식 활용: 점근선의 방정식이 $y = \\pm \\frac{b}{a}x = \\pm \\frac{\\sqrt{3}}{3}x$이므로 $\\frac{b}{a} = \\frac{\\sqrt{3}}{3}$에서 $b^2 = \\frac{1}{3}a^2$이다.\n대입 및 $a$의 계산: $a^2 + \\frac{1}{3}a^2 = 12$에서 $\\frac{4}{3}a^2 = 12$이므로 양변에 $\\frac{3}{4}$을 곱하면 $a^2 = 9$이다.\n주축의 길이 도출: $a > 0$이므로 $a = 3$이고, 구하는 쌍곡선의 주축의 길이는 $2a = 2 \\times 3 = 6$이다.\n따라서 정답은 ③이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-GEO-RPM-044",
    "problemTypeKey": "PT_GEO_HYPERBOLA",
    "templateKey": "TPL_GEO_HYPERBOLA_ASYMPTOTE_AXIS",
    "crossConceptKeys": [
      "CC_ELLIPSE"
    ],
    "conditionKeys": [],
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
    "content": "그림과 같이 두 초점 $F, F'$을 공유하는 타원과 쌍곡선이 있다. 타원의 방정식이 $\\frac{x^2}{21} + \\frac{y^2}{5} = 1$이고 쌍곡선의 점근선 중 하나가 $x$축의 양의 방향과 이루는 각의 크기가 $60^\\circ$일 때, 쌍곡선의 주축의 길이는?\n[그림: 타원 $\\frac{x^2}{21} + \\frac{y^2}{5} = 1$과 두 초점 $F, F'$을 공유하는 좌우로 열린 쌍곡선, 원점 $O$, $x$축과 $y$축]",
    "choices": [
      "$2\\sqrt{3}$",
      "$4$",
      "$2\\sqrt{5}$",
      "$2\\sqrt{6}$",
      "$6$"
    ],
    "answer": "②",
    "solution": "타원의 초점 계산: 타원 $\\frac{x^2}{21} + \\frac{y^2}{5} = 1$의 두 초점을 $(\\pm c, 0)$이라 하면 $c^2 = 21 - 5 = 16$이다.\n쌍곡선 방정식 설정: 쌍곡선의 방정식을 $\\frac{x^2}{a^2} - \\frac{y^2}{b^2} = 1$이라 하면 두 초점을 공유하므로 $a^2 + b^2 = c^2 = 16$이다.\n점근선의 기울기 구하기: 점근선이 $x$축의 양의 방향과 이루는 각이 $60^\\circ$이므로 기울기는 $\\tan 60^\\circ = \\sqrt{3}$이다.\n점근선과 계수 관계: 쌍곡선의 점근선의 기울기 $\\frac{b}{a} = \\sqrt{3}$에서 $b = \\sqrt{3}a$, 즉 $b^2 = 3a^2$이다.\n연립방정식 풀이: $a^2 + 3a^2 = 4a^2 = 16$에서 $a^2 = 4$이므로 $a = 2$ ($a>0$)이다.\n주축의 길이 계산: 쌍곡선의 주축의 길이는 $2a = 2 \\times 2 = 4$이다.\n따라서 정답은 ②이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-GEO-RPM-044",
    "problemTypeKey": "PT_GEO_HYPERBOLA",
    "templateKey": "TPL_GEO_HYPERBOLA_ASYMPTOTE_AXIS",
    "crossConceptKeys": [
      "CC_ELLIPSE",
      "CC_TRIGONOMETRIC_TANGENT"
    ],
    "conditionKeys": [],
    "integrationPattern": "REINTERPRETATION"
  }
];
