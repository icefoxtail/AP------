window.examTitle = "기하_041_쌍곡선의점근선_고2_유형은행1";

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
    "content": "직선 $y = \\frac{3}{4}x$가 쌍곡선 $\\frac{x^2}{k} - \\frac{y^2}{81} = 1$의 한 점근선일 때, 이 쌍곡선의 주축의 길이는? (단, $k$는 양수이다.)",
    "choices": [
      "① $20$",
      "② $24$",
      "③ $28$",
      "④ $32$",
      "⑤ $36$"
    ],
    "answer": "②",
    "solution": "1단계: 쌍곡선의 점근선 공식을 적용한다.\n쌍곡선 $\\frac{x^2}{a^2} - \\frac{y^2}{b^2} = 1$의 점근선의 방정식은 $y = \\pm \\frac{b}{a}x$이다.\n2단계: 주어진 쌍곡선의 점근선 방정식을 세운다.\n$a^2 = k, b^2 = 81$이므로 $a = \\sqrt{k}, b = 9$이다.\n따라서 점근선의 방정식은 $y = \\pm \\frac{9}{\\sqrt{k}}x$이다.\n3단계: 점근선의 기울기를 비교하여 $\\sqrt{k}$를 구한다.\n한 점근선이 $y = \\frac{3}{4}x$이므로 $\\frac{9}{\\sqrt{k}} = \\frac{3}{4}$이다.\n양변에 $4\\sqrt{k}$를 곱하면 $3\\sqrt{k} = 36 \\implies \\sqrt{k} = 12$이다.\n4단계: 주축의 길이를 계산한다.\n우변이 $1$인 쌍곡선의 주축의 길이는 $2a = 2\\sqrt{k}$이다.\n따라서 주축의 길이는 $2 \\times 12 = 24$이다.\n따라서 정답은 ②이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-GEO-RPM-044",
    "problemTypeKey": "PT_GEO_HYPERBOLA",
    "templateKey": "TPL_GEO_HYPERBOLA_ASYMPTOTE_AXIS",
    "crossConceptKeys": [
      "CC_SLOPE"
    ],
    "conditionKeys": [
      "COND_POSITIVE"
    ],
    "integrationPattern": "NONE"
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
    "content": "쌍곡선 $\\frac{x^2}{a^2} - \\frac{y^2}{b^2} = 1$의 두 초점 사이의 거리가 주축의 길이의 $3$배일 때, 이 쌍곡선의 점근선의 방정식이 $y = \\pm kx$이다. 양수 $k$의 값은? (단, $a > 0, b > 0$)",
    "choices": [
      "① $\\sqrt{2}$",
      "② $\\sqrt{3}$",
      "③ $2$",
      "④ $\\sqrt{6}$",
      "⑤ $2\\sqrt{2}$"
    ],
    "answer": "⑤",
    "solution": "1단계: 주축의 길이와 두 초점 사이의 거리를 문자로 표현한다.\n쌍곡선 $\\frac{x^2}{a^2} - \\frac{y^2}{b^2} = 1$에서 주축의 길이는 $2a$이고, 두 초점 사이의 거리는 $2c$이다.\n2단계: 조건으로부터 $c$와 $a$의 관계식을 세운다.\n두 초점 사이의 거리가 주축의 길이의 $3$배이므로 $2c = 3 \\times 2a \\implies c = 3a$이다.\n3단계: 쌍곡선의 초점과 축의 관계식을 이용한다.\n쌍곡선에서 $c^2 = a^2 + b^2$이 성립하므로 $(3a)^2 = a^2 + b^2 \\implies 9a^2 = a^2 + b^2$이다.\n이 식을 정리하면 $b^2 = 8a^2$이므로 $a > 0, b > 0$에서 $b = \\sqrt{8}a = 2\\sqrt{2}a$이다.\n4단계: 점근선의 기울기 $k$를 구한다.\n쌍곡선의 점근선의 방정식은 $y = \\pm \\frac{b}{a}x$이다.\n$\\frac{b}{a} = \\frac{2\\sqrt{2}a}{a} = 2\\sqrt{2}$이므로 점근선의 방정식은 $y = \\pm 2\\sqrt{2}x$이다.\n따라서 양수 $k$의 값은 $2\\sqrt{2}$이다.\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-GEO-RPM-044",
    "problemTypeKey": "PT_GEO_HYPERBOLA",
    "templateKey": "TPL_GEO_HYPERBOLA_ASYMPTOTE_AXIS",
    "crossConceptKeys": [],
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
    "content": "쌍곡선 $\\frac{x^2}{9} - y^2 = 1$의 꼭짓점 중 $x$좌표가 음수인 점을 중심으로 하는 원 $C$가 있다. 점 $(7, 0)$을 지나고 원 $C$에 접하는 두 직선이 각각 쌍곡선 $\\frac{x^2}{9} - y^2 = 1$과 한 점에서만 만날 때, 원 $C$의 반지름의 길이는?",
    "choices": [
      "① $3$",
      "② $\\sqrt{10}$",
      "③ $2\\sqrt{3}$",
      "④ $\\sqrt{13}$",
      "⑤ $4$"
    ],
    "answer": "②",
    "solution": "1단계: 쌍곡선의 꼭짓점과 점근선의 방정식을 구한다.\n쌍곡선 $\\frac{x^2}{9} - y^2 = 1$에서 꼭짓점의 좌표는 $(\\pm 3, 0)$이므로 $x$좌표가 음수인 꼭짓점은 $(-3, 0)$이다.\n따라서 원 $C$의 중심은 $(-3, 0)$이고 반지름을 $r$ ($r > 0$)이라 하자.\n쌍곡선의 점근선의 방정식은 $y = \\pm \\frac{1}{3}x$이다.\n2단계: 쌍곡선과 한 점에서만 만나는 직선의 조건을 파악한다.\n점 $(7, 0)$을 지나는 직선 $y = m(x - 7)$을 쌍곡선의 방정식 $\\frac{x^2}{9} - y^2 = 1$에 대입하여 정리하면\n$(1 - 9m^2)x^2 + 126m^2 x - (441m^2 + 9) = 0$이다.\n(i) 판별식 $D = 0$인 경우(접선): 판별식을 정리하면 $D/4 = 360m^2 + 9 > 0$이므로 점 $(7, 0)$에서 그은 실근 접선은 존재하지 않는다.\n(ii) 최고차항의 계수가 $0$인 경우: $1 - 9m^2 = 0 \\implies m = \\pm \\frac{1}{3}$일 때, 일차방정식이 되어 쌍곡선과 오직 한 점에서만 만난다.\n따라서 쌍곡선과 한 점에서만 만나는 직선은 점근선과 평행한 두 직선이다.\n3단계: 원 $C$에 접하는 조건을 이용하여 반지름 $r$을 계산한다.\n점 $(7, 0)$을 지나고 기울기가 $\\pm \\frac{1}{3}$인 직선의 방정식은 $y = \\pm \\frac{1}{3}(x - 7)$, 즉 $x \\mp 3y - 7 = 0$이다.\n이 직선이 원 $C$: $(x + 3)^2 + y^2 = r^2$에 접하므로, 원의 중심 $(-3, 0)$에서 직선 $x \\mp 3y - 7 = 0$까지의 거리는 반지름 $r$과 같다.\n점과 직선 사이의 거리 공식에 의하여\n$r = \\frac{|-3 \\mp 3(0) - 7|}{\\sqrt{1^2 + (\\mp 3)^2}} = \\frac{|-10|}{\\sqrt{1 + 9}} = \\frac{10}{\\sqrt{10}} = \\sqrt{10}$이다.\n주의: 점근선과 평행한 직선은 쌍곡선과 오직 한 점에서만 만난다는 성질을 활용해야 한다.\n따라서 정답은 ②이다.",
    "difficultyBucket": 5,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B45",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-GEO-RPM-044",
    "problemTypeKey": "PT_GEO_HYPERBOLA",
    "templateKey": "TPL_GEO_HYPERBOLA_ASYMPTOTE_AXIS",
    "crossConceptKeys": [
      "CC_CIRCLE_TANGENCY",
      "CC_CONIC_TANGENT",
      "CC_POINT_LINE_DISTANCE"
    ],
    "conditionKeys": [],
    "integrationPattern": "DEEP_COMPOSITE"
  }
];
