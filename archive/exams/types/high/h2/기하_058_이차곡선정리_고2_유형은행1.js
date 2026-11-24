window.examTitle = "기하_058_이차곡선정리_고2_유형은행1";

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
    "content": "$x, y$에 대한 이차방정식\n$$(a-1)x^2 + 4y^2 - 6x + 8y + 1 = 0$$\n이 나타내는 도형이 원이 되기 위한 실수 $a$의 값을 $\\alpha$, 포물선이 되기 위한 실수 $a$의 값을 $\\beta$라 할 때, $\\alpha - 2\\beta$의 값은?",
    "choices": [
      "3",
      "4",
      "5",
      "6",
      "7"
    ],
    "answer": "①",
    "solution": "[원의 조건 적용]: $x, y$에 대한 이차방정식이 원을 나타내려면 $x^2$과 $y^2$의 계수가 서로 같아야 하므로 $a-1 = 4$이다.\n[값 계산 및 실원 확인]: $a = 5$를 대입하면 $4x^2 + 4y^2 - 6x + 8y + 1 = 0$이고, 양변을 $4$로 나눈 후 완전제곱식으로 정리하면 $(x - \\frac{3}{4})^2 + (y+1)^2 = \\frac{21}{16} > 0$이므로 실원이다. 따라서 $\\alpha = 5$이다.\n[포물선의 조건 적용]: 이차방정식이 포물선을 나타내려면 $x, y$ 중 한 문자에 대해서만 이차식이어야 한다.\n[계수 조건 확인]: $y^2$의 계수가 $4 \\neq 0$이므로 $x^2$의 계수가 $0$이어야 한다. 즉, $a-1 = 0 \\implies a = 1$이다.\n[포물선 형태 확인]: $a = 1$을 대입하면 $4y^2 - 6x + 8y + 1 = 0 \\implies 6x = 4(y+1)^2 - 3$으로 $x$의 일차항이 존재하므로 포물선이다. 따라서 $\\beta = 1$이다.\n[구하는 값 계산]: $\\alpha - 2\\beta = 5 - 2 \\times 1 = 3$이다.\n따라서 정답은 ①이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-GEO-RPM-094",
    "problemTypeKey": "PT_GEO_CONIC_MIXED",
    "templateKey": "TPL_GEO_CONIC_MIXED_TYPE_CONDITION",
    "crossConceptKeys": [
      "CC_CIRCLE_EQUATION",
      "CC_PARABOLA"
    ],
    "conditionKeys": [],
    "integrationPattern": "CASE_BRANCH"
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
    "content": "방정식\n$$(2x^2 + y^2 - 4x + 2) + k(x^2 - 2y^2 + 6y - 5) = 0$$\n이 나타내는 도형이 포물선이 되도록 하는 모든 실수 $k$의 값의 합은?",
    "choices": [
      "-2",
      "$-\\dfrac{3}{2}$",
      "-1",
      "$-\\dfrac{1}{2}$",
      "$\\dfrac{1}{2}$"
    ],
    "answer": "②",
    "solution": "[동류항 정리]: 주어진 방정식을 $x, y$에 대해 내림차순으로 정리하면 $(2+k)x^2 + (1-2k)y^2 - 4x + 6ky + (2-5k) = 0$이다.\n[포물선의 성질]: 이차방정식이 포물선이 되려면 $x^2$과 $y^2$의 계수 중 하나만 $0$이어야 하고, 계수가 $0$이 된 문자의 일차항이 소거되지 않아야 한다.\n(i) [$x^2$의 계수가 $0$인 경우]: $2+k = 0 \\implies k = -2$이다.\n이때 $y^2$의 계수는 $1 - 2(-2) = 5 \\neq 0$이고, $x$의 일차항은 $-4x \\neq 0$이므로 $4x = 5y^2 - 12y + 12$가 되어 포물선이 된다.\n(ii) [$y^2$의 계수가 $0$인 경우]: $1-2k = 0 \\implies k = \\frac{1}{2}$이다.\n이때 $x^2$의 계수는 $2 + \\frac{1}{2} = \\frac{5}{2} \\neq 0$이고, $y$의 일차항 계수는 $6k = 6 \\times \\frac{1}{2} = 3 \\neq 0$이므로 포물선이 된다.\n[모든 실수 $k$의 합 계산]: 가능한 $k$의 값은 $-2$와 $\\frac{1}{2}$이므로 구하는 합은 $(-2) + \\frac{1}{2} = -\\frac{3}{2}$이다.\n따라서 정답은 ②이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-GEO-RPM-094",
    "problemTypeKey": "PT_GEO_CONIC_MIXED",
    "templateKey": "TPL_GEO_CONIC_MIXED_TYPE_CONDITION",
    "crossConceptKeys": [
      "CC_PARABOLA"
    ],
    "conditionKeys": [],
    "integrationPattern": "CASE_BRANCH"
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
    "content": "$x, y$에 대한 이차방정식\n$$(k-1)x^2 + (9-k)y^2 = 16$$\n이 나타내는 도형이 원이 아닌 타원이 되도록 하는 모든 정수 $k$의 값의 합은?",
    "choices": [
      "24",
      "26",
      "28",
      "30",
      "35"
    ],
    "answer": "④",
    "solution": "[타원의 정의 및 부호 조건]: 방정식 $Ax^2 + By^2 = C$ ($C>0$)가 타원을 나타내려면 $A$와 $B$의 부호가 모두 양수이어야 하므로 $(k-1)(9-k) > 0$이다.\n[부등식 풀이]: 양변에 $-1$을 곱하면 $(k-1)(k-9) < 0$이므로 $1 < k < 9$이다.\n[원의 조건 배제]: 문제에서 '원이 아닌 타원'이라 하였으므로 $x^2$과 $y^2$의 계수가 같아지는 원의 경우를 제외해야 한다.\n[계수가 같아지는 $k$ 계산]: $k-1 = 9-k \\implies 2k = 10 \\implies k = 5$이다.\n주의: $k=5$일 때 $4x^2 + 4y^2 = 16 \\implies x^2 + y^2 = 4$로 원이 되므로 반드시 제외해야 한다.\n[조건을 만족하는 정수 $k$ 나열]: $1 < k < 9$인 정수 중 $5$를 제외하면 $k = 2, 3, 4, 6, 7, 8$이다.\n[모든 정수 $k$의 합 계산]: $2 + 3 + 4 + 6 + 7 + 8 = 30$이다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-GEO-RPM-094",
    "problemTypeKey": "PT_GEO_CONIC_MIXED",
    "templateKey": "TPL_GEO_CONIC_MIXED_TYPE_CONDITION",
    "crossConceptKeys": [
      "CC_ELLIPSE"
    ],
    "conditionKeys": [
      "COND_INTEGER"
    ],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 4,
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
    "content": "$x, y$에 대한 이차방정식\n$$(k+2)x^2 + (k-5)y^2 + 2x - 4y + 3 = 0$$\n이 나타내는 도형이 쌍곡선이 되도록 하는 정수 $k$의 개수는?",
    "choices": [
      "2",
      "3",
      "4",
      "5",
      "6"
    ],
    "answer": "⑤",
    "solution": "[쌍곡선의 정의 및 계수 조건]: 이차방정식 $Ax^2 + By^2 + Cx + Dy + E = 0$이 쌍곡선을 나타내기 위한 기본 조건은 두 이차항 계수의 곱이 음수인 것, 즉 $AB < 0$이다.\n[부등식 설정]: $(k+2)(k-5) < 0$이므로 $k$의 범위는 $-2 < k < 5$이다.\n[퇴화 이차곡선 여부 검토]: 완전제곱식으로 변형하면 $(k+2)\\left(x + \\frac{1}{k+2}\\right)^2 + (k-5)\\left(y - \\frac{2}{k-5}\\right)^2 = \\frac{1}{k+2} + \\frac{4}{k-5} - 3$이다.\n[상수항 $0$ 판별]: 우변이 $0$이 되려면 $3k^2 - 14k - 33 = 0$이어야 하는데, 판별식 $D/4 = 49 + 99 = 148$이 제곱수가 아니므로 정수해를 갖지 않는다. 즉, 정수 $k$에 대해 우변은 절대 $0$이 되지 않는다.\n[정수 $k$의 개수 산출]: 부등식 $-2 < k < 5$를 만족하는 정수 $k$는 $-1, 0, 1, 2, 3, 4$이다.\n[개수 계산]: $4 - (-1) + 1 = 6$개이다.\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-GEO-RPM-094",
    "problemTypeKey": "PT_GEO_CONIC_MIXED",
    "templateKey": "TPL_GEO_CONIC_MIXED_TYPE_CONDITION",
    "crossConceptKeys": [
      "CC_HYPERBOLA"
    ],
    "conditionKeys": [
      "COND_INTEGER"
    ],
    "integrationPattern": "NONE"
  },
  {
    "id": 5,
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
    "content": "방정식\n$$(a^2 - 4)x^2 + (a-1)y^2 = 3$$\n이 나타내는 도형이 $y$축에 평행한 주축을 갖는 쌍곡선이 되기 위한 실수 $a$의 값의 범위는?",
    "choices": [
      "$a < -2$",
      "$-2 < a < 1$",
      "$-1 < a < 2$",
      "$a > 2$",
      "$1 < a < 2$"
    ],
    "answer": "⑤",
    "solution": "[쌍곡선의 표준형과 주축의 방향]: 우변이 양수 $3$인 쌍곡선에서 주축이 $y$축에 평행하려면 $-\\frac{(x-m)^2}{A^2} + \\frac{(y-n)^2}{B^2} = 1$ 꼴이어야 한다.\n[부호 조건 도출]: 즉, $y^2$의 계수는 양수이어야 하고, $x^2$의 계수는 음수이어야 한다.\n[$x^2$의 계수 조건]: $a^2 - 4 < 0$에서 $(a-2)(a+2) < 0$이므로 $-2 < a < 2$이다.\n[$y^2$의 계수 조건]: $a - 1 > 0$에서 $a > 1$이다.\n[공통 범위 구하기]: 두 부등식 $-2 < a < 2$와 $a > 1$의 공통 범위를 구하면 $1 < a < 2$이다.\n주의: 만약 $a^2 - 4 > 0$이고 $a - 1 < 0$이면 주축이 $x$축에 평행한 쌍곡선이 되므로 문제의 조건에 맞지 않는다.\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-GEO-RPM-094",
    "problemTypeKey": "PT_GEO_CONIC_MIXED",
    "templateKey": "TPL_GEO_CONIC_MIXED_TYPE_CONDITION",
    "crossConceptKeys": [
      "CC_HYPERBOLA"
    ],
    "conditionKeys": [
      "COND_RANGE"
    ],
    "integrationPattern": "CASE_BRANCH"
  }
];
