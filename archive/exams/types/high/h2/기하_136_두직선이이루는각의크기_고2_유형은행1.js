window.examTitle = "기하_136_두직선이이루는각의크기_고2_유형은행1";

window.questionBank = [
  {
    "id": 1,
    "category": "도형의 방정식 핵심 개념",
    "standardCourse": "기하",
    "curriculum": "2022",
    "standardUnitKey": "H22-GE-08",
    "standardUnit": "도형의 방정식",
    "standardUnitOrder": 8,
    "subUnitKey": "H22-GE-08-CORE",
    "subUnit": "도형의 방정식 핵심 개념",
    "subUnitConfidence": "candidate_evidence",
    "subUnitClassificationDepth": "complete_candidate",
    "conceptClusterKey": "H22-GE-08-CORE",
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "도형의 방정식 핵심 개념"
    ],
    "wide": false,
    "content": "좌표평면에서 두 직선\n$$\\frac{x-3}{3} = \\frac{y+2}{4},\\quad \\frac{x+1}{1} = \\frac{4-y}{7}$$\n이 이루는 예각의 크기를 $\\theta$라 할 때, $\\cos\\theta$의 값은?",
    "choices": [
      "$\\frac{\\sqrt{2}}{10}$",
      "$\\frac{\\sqrt{2}}{5}$",
      "$\\frac{3\\sqrt{2}}{10}$",
      "$\\frac{2\\sqrt{2}}{5}$",
      "$\\frac{\\sqrt{2}}{2}$"
    ],
    "answer": "⑤",
    "solution": "[두 직선의 방향벡터 구하기] 첫 번째 직선 $\\frac{x-3}{3} = \\frac{y+2}{4}$의 방향벡터는 $\\vec{u}_1 = (3, 4)$이다.\n[두 번째 직선 변환] 두 번째 직선 $\\frac{x+1}{1} = \\frac{4-y}{7}$를 표준형 $\\frac{x+1}{1} = \\frac{y-4}{-7}$로 정리하면 방향벡터는 $\\vec{u}_2 = (1, -7)$이다.\n[방향벡터의 크기 계산] 두 벡터의 크기는 각각 $|\u000bec{u}_1| = \\sqrt{3^2 + 4^2} = \\sqrt{25} = 5$, $|\u000bec{u}_2| = \\sqrt{1^2 + (-7)^2} = \\sqrt{50} = 5\\sqrt{2}$이다.\n[두 벡터의 내적 계산] $\\vec{u}_1 \\cdot \\vec{u}_2 = 3 \\times 1 + 4 \\times (-7) = 3 - 28 = -25$이다.\n[두 직선이 이루는 각의 공식 적용] 두 직선이 이루는 예각의 크기를 $\\theta$라 하면 $\\cos\\theta = \\frac{|\\vec{u}_1 \\cdot \\vec{u}_2|}{|\\vec{u}_1||\\vec{u}_2|}$이다.\n[값 대입 및 계산] $\\cos\\theta = \\frac{|-25|}{5 \\times 5\\sqrt{2}} = \\frac{25}{25\\sqrt{2}} = \\frac{1}{\\sqrt{2}} = \\frac{\\sqrt{2}}{2}$이다.\n주의: 직선의 방정식에서 $y$의 계수가 음수인 경우 반드시 표준형으로 바꾼 후 방향벡터의 부호를 정확히 결정해야 한다.\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-GEO-RPM-082",
    "problemTypeKey": "PT_GEO_VECTOR_LINE_CIRCLE",
    "templateKey": "TPL_GEO_VEC_LINE_RELATION",
    "crossConceptKeys": [
      "CC_LINE_EQUATION",
      "CC_PLANE_VECTOR"
    ],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 2,
    "category": "도형의 방정식 핵심 개념",
    "standardCourse": "기하",
    "curriculum": "2022",
    "standardUnitKey": "H22-GE-08",
    "standardUnit": "도형의 방정식",
    "standardUnitOrder": 8,
    "subUnitKey": "H22-GE-08-CORE",
    "subUnit": "도형의 방정식 핵심 개념",
    "subUnitConfidence": "candidate_evidence",
    "subUnitClassificationDepth": "complete_candidate",
    "conceptClusterKey": "H22-GE-08-CORE",
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "도형의 방정식 핵심 개념"
    ],
    "wide": false,
    "content": "두 직선\n$$l_1 : \\frac{x+3}{2} = y-1,\\quad l_2 : \\frac{x-2}{3} = 1-y$$\n이 이루는 예각의 크기를 $\\theta$라 할 때, $\\tan\\theta$의 값은?",
    "choices": [
      "$\\frac{1}{2}$",
      "$\\frac{\\sqrt{3}}{3}$",
      "$\\frac{\\sqrt{2}}{2}$",
      "$1$",
      "$\\sqrt{3}$"
    ],
    "answer": "④",
    "solution": "[직선 $l_1$의 방향벡터 구하기] 직선 $l_1 : \\frac{x+3}{2} = \\frac{y-1}{1}$의 방향벡터는 $\\vec{u}_1 = (2, 1)$이다.\n[직선 $l_2$의 표준형 변환 및 방향벡터] 직선 $l_2 : \\frac{x-2}{3} = 1-y$를 $\\frac{x-2}{3} = \\frac{y-1}{-1}$로 정리하면 방향벡터는 $\\vec{u}_2 = (3, -1)$이다.\n[방향벡터의 크기 및 내적 계산] $|\u000bec{u}_1| = \\sqrt{2^2 + 1^2} = \\sqrt{5}$, $|\u000bec{u}_2| = \\sqrt{3^2 + (-1)^2} = \\sqrt{10}$, $\\vec{u}_1 \\cdot \\vec{u}_2 = 2 \\times 3 + 1 \\times (-1) = 6 - 1 = 5$이다.\n[두 직선이 이루는 각의 코사인 계산] $\\cos\\theta = \\frac{|\\vec{u}_1 \\cdot \\vec{u}_2|}{|\\vec{u}_1||\\vec{u}_2|} = \\frac{5}{\\sqrt{5}\\sqrt{10}} = \\frac{5}{5\\sqrt{2}} = \\frac{\\sqrt{2}}{2}$이다.\n[삼각비 관계를 이용한 각도 및 탄젠트 계산] $0^\\circ \\le \\theta \\le 90^\\circ$에서 $\\cos\\theta = \\frac{\\sqrt{2}}{2}$이므로 $\\theta = 45^\\circ$이다.\n[최종값 도출] 따라서 $\\tan\\theta = \\tan 45^\\circ = 1$이다.\n주의: 문제에서 묻는 값은 $\\cos\\theta$가 아니라 $\\tan\\theta$이므로 삼각비 변환 단계를 정확하게 거쳐야 한다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-GEO-RPM-082",
    "problemTypeKey": "PT_GEO_VECTOR_LINE_CIRCLE",
    "templateKey": "TPL_GEO_VEC_LINE_RELATION",
    "crossConceptKeys": [
      "CC_SLOPE",
      "CC_TRIGONOMETRIC_TANGENT"
    ],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 3,
    "category": "도형의 방정식 핵심 개념",
    "standardCourse": "기하",
    "curriculum": "2022",
    "standardUnitKey": "H22-GE-08",
    "standardUnit": "도형의 방정식",
    "standardUnitOrder": 8,
    "subUnitKey": "H22-GE-08-CORE",
    "subUnit": "도형의 방정식 핵심 개념",
    "subUnitConfidence": "candidate_evidence",
    "subUnitClassificationDepth": "complete_candidate",
    "conceptClusterKey": "H22-GE-08-CORE",
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "도형의 방정식 핵심 개념"
    ],
    "wide": false,
    "content": "두 직선\n$$\\frac{x+2}{a} = y-3,\\quad x-1 = \\frac{y+4}{2}$$\n이 이루는 각의 크기가 $45^\\circ$일 때, 양수 $a$의 값은?",
    "choices": [
      "$1$",
      "$2$",
      "$3$",
      "$4$",
      "$5$"
    ],
    "answer": "③",
    "solution": "[두 직선의 방향벡터 구하기] 두 직선의 방향벡터는 각각 $\\vec{u}_1 = (a, 1)$, $\u000bec{u}_2 = (1, 2)$이다.\n[방향벡터의 크기 및 내적 계산] $|\u000bec{u}_1| = \\sqrt{a^2 + 1}$, $|\u000bec{u}_2| = \\sqrt{1^2 + 2^2} = \\sqrt{5}$, $\\vec{u}_1 \\cdot \\vec{u}_2 = a \\times 1 + 1 \\times 2 = a + 2$이다.\n[두 직선이 이루는 각의 공식 적용] 두 직선이 이루는 각의 크기가 $45^\\circ$이므로 $\\cos 45^\\circ = \\frac{|\\vec{u}_1 \\cdot \\vec{u}_2|}{|\\vec{u}_1||\\vec{u}_2|}$이다.\n[방정식 세우기] $\\frac{1}{\\sqrt{2}} = \\frac{|a+2|}{\\sqrt{5}\\sqrt{a^2+1}}$이다.\n[양변 제곱] $\\frac{1}{2} = \\frac{(a+2)^2}{5(a^2+1)}$이므로 $5(a^2+1) = 2(a+2)^2$이다.\n[이차방정식 전개 및 정리] $5a^2 + 5 = 2(a^2 + 4a + 4) = 2a^2 + 8a + 8$에서 $3a^2 - 8a - 3 = 0$이다.\n[인수분해] $(3a + 1)(a - 3) = 0$이므로 $a = -\\frac{1}{3}$ 또는 $a = 3$이다.\n[조건 확인] 문제에서 $a$는 양수라고 하였으므로 $a = 3$이다.\n주의: 음수인 해 $a = -1/3$도 대입 시 $\\cos 45^\\circ$를 만족하지만 '양수 $a$' 조건을 만족하지 않으므로 제외한다.\n따라서 정답은 ③이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-GEO-RPM-082",
    "problemTypeKey": "PT_GEO_VECTOR_LINE_CIRCLE",
    "templateKey": "TPL_GEO_VEC_LINE_RELATION",
    "crossConceptKeys": [
      "CC_SLOPE",
      "CC_TRIGONOMETRIC_TANGENT"
    ],
    "conditionKeys": [
      "COND_POSITIVE"
    ],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 4,
    "category": "도형의 방정식 핵심 개념",
    "standardCourse": "기하",
    "curriculum": "2022",
    "standardUnitKey": "H22-GE-08",
    "standardUnit": "도형의 방정식",
    "standardUnitOrder": 8,
    "subUnitKey": "H22-GE-08-CORE",
    "subUnit": "도형의 방정식 핵심 개념",
    "subUnitConfidence": "candidate_evidence",
    "subUnitClassificationDepth": "complete_candidate",
    "conceptClusterKey": "H22-GE-08-CORE",
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "도형의 방정식 핵심 개념"
    ],
    "wide": false,
    "content": "두 직선\n$$\\frac{x-2}{a} = y+1,\\quad x+3 = \\frac{y-1}{3}$$\n이 이루는 각의 크기가 $60^\\circ$일 때, 모든 실수 $a$의 값의 합은?",
    "choices": [
      "$2$",
      "$3$",
      "$4$",
      "$5$",
      "$6$"
    ],
    "answer": "③",
    "solution": "[두 직선의 방향벡터 구하기] 두 직선의 방향벡터는 각각 $\\vec{u}_1 = (a, 1)$, $\u000bec{u}_2 = (1, 3)$이다.\n[방향벡터의 크기 및 내적 계산] $|\u000bec{u}_1| = \\sqrt{a^2 + 1}$, $|\u000bec{u}_2| = \\sqrt{1^2 + 3^2} = \\sqrt{10}$, $\\vec{u}_1 \\cdot \\vec{u}_2 = a \\times 1 + 1 \\times 3 = a + 3$이다.\n[두 직선이 이루는 각의 공식 적용] 두 직선이 이루는 각이 $60^\\circ$이므로 $\\cos 60^\\circ = \\frac{|\\vec{u}_1 \\cdot \\vec{u}_2|}{|\\vec{u}_1||\\vec{u}_2|}$이다.\n[방정식 세우기] $\\frac{1}{2} = \\frac{|a+3|}{\\sqrt{10}\\sqrt{a^2+1}}$이다.\n[양변 제곱] $\\frac{1}{4} = \\frac{(a+3)^2}{10(a^2+1)}$이므로 $10(a^2+1) = 4(a^2 + 6a + 9)$이다.\n[식 정리] $10a^2 + 10 = 4a^2 + 24a + 36$을 한쪽으로 이항하여 정리하면 $6a^2 - 24a - 26 = 0$, 즉 $3a^2 - 12a - 13 = 0$이다.\n[판별식 확인] $D/4 = (-6)^2 - 3 \\times (-13) = 36 + 39 = 75 > 0$이므로 서로 다른 두 실근이 존재한다.\n[근과 계수의 관계 적용] 근과 계수의 관계에 의하여 모든 실수 $a$의 값의 합은 $\\alpha + \\beta = -\\frac{-12}{3} = 4$이다.\n따라서 정답은 ③이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-GEO-RPM-082",
    "problemTypeKey": "PT_GEO_VECTOR_LINE_CIRCLE",
    "templateKey": "TPL_GEO_VEC_LINE_RELATION",
    "crossConceptKeys": [
      "CC_SLOPE",
      "CC_TRIGONOMETRIC_TANGENT"
    ],
    "conditionKeys": [],
    "integrationPattern": "CASE_BRANCH"
  },
  {
    "id": 5,
    "category": "도형의 방정식 핵심 개념",
    "standardCourse": "기하",
    "curriculum": "2022",
    "standardUnitKey": "H22-GE-08",
    "standardUnit": "도형의 방정식",
    "standardUnitOrder": 8,
    "subUnitKey": "H22-GE-08-CORE",
    "subUnit": "도형의 방정식 핵심 개념",
    "subUnitConfidence": "candidate_evidence",
    "subUnitClassificationDepth": "complete_candidate",
    "conceptClusterKey": "H22-GE-08-CORE",
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "도형의 방정식 핵심 개념"
    ],
    "wide": false,
    "content": "두 직선\n$$2x - y + 1 = 0,\\quad x - 3y - 4 = 0$$\n이 이루는 각의 크기를 $\\theta$라 할 때, $\\cos\\theta$의 값은?",
    "choices": [
      "$\\frac{\\sqrt{3}}{3}$",
      "$\\frac{\\sqrt{2}}{2}$",
      "$\\frac{\\sqrt{5}}{3}$",
      "$\\frac{\\sqrt{3}}{2}$",
      "$\\frac{\\sqrt{7}}{3}$"
    ],
    "answer": "②",
    "solution": "[법선벡터 구하기] 두 직선 $2x - y + 1 = 0$, $x - 3y - 4 = 0$의 법선벡터는 각각 $\\vec{n}_1 = (2, -1)$, $\\vec{n}_2 = (1, -3)$이다.\n[법선벡터의 크기 계산] $|\u000bec{n}_1| = \\sqrt{2^2 + (-1)^2} = \\sqrt{5}$, $|\u000bec{n}_2| = \\sqrt{1^2 + (-3)^2} = \\sqrt{10}$이다.\n[법선벡터의 내적 계산] $\\vec{n}_1 \\cdot \\vec{n}_2 = 2 \\times 1 + (-1) \\times (-3) = 2 + 3 = 5$이다.\n[두 직선이 이루는 각의 공식 적용] 두 직선이 이루는 예각의 크기 $\\theta$는 두 법선벡터가 이루는 예각의 크기와 같으므로 $\\cos\\theta = \\frac{|\\vec{n}_1 \\cdot \\vec{n}_2|}{|\\vec{n}_1||\\vec{n}_2|}$이다.\n[값 대입 및 계산] $\\cos\\theta = \\frac{5}{\\sqrt{5}\\sqrt{10}} = \\frac{5}{\\sqrt{50}} = \\frac{5}{5\\sqrt{2}} = \\frac{1}{\\sqrt{2}} = \\frac{\\sqrt{2}}{2}$이다.\n따라서 정답은 ②이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-GEO-RPM-082",
    "problemTypeKey": "PT_GEO_VECTOR_LINE_CIRCLE",
    "templateKey": "TPL_GEO_VEC_LINE_RELATION",
    "crossConceptKeys": [
      "CC_LINE_EQUATION",
      "CC_PLANE_VECTOR"
    ],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 6,
    "category": "도형의 방정식 핵심 개념",
    "standardCourse": "기하",
    "curriculum": "2022",
    "standardUnitKey": "H22-GE-08",
    "standardUnit": "도형의 방정식",
    "standardUnitOrder": 8,
    "subUnitKey": "H22-GE-08-CORE",
    "subUnit": "도형의 방정식 핵심 개념",
    "subUnitConfidence": "candidate_evidence",
    "subUnitClassificationDepth": "complete_candidate",
    "conceptClusterKey": "H22-GE-08-CORE",
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "도형의 방정식 핵심 개념"
    ],
    "wide": false,
    "content": "두 직선\n$$\\sqrt{3}x + y - 2 = 0,\\quad ax + y - 5 = 0$$\n이 이루는 각의 크기가 $30^\\circ$일 때, 양수 $a$의 값은?",
    "choices": [
      "$\\frac{\\sqrt{3}}{3}$",
      "$1$",
      "$\\sqrt{2}$",
      "$\\sqrt{3}$",
      "$2$"
    ],
    "answer": "①",
    "solution": "[법선벡터 구하기] 두 직선의 법선벡터는 각각 $\\vec{n}_1 = (\\sqrt{3}, 1)$, $\\vec{n}_2 = (a, 1)$이다.\n[법선벡터의 크기 및 내적 계산] $|\u000bec{n}_1| = \\sqrt{(\\sqrt{3})^2 + 1^2} = \\sqrt{4} = 2$, $|\u000bec{n}_2| = \\sqrt{a^2 + 1}$, $\\vec{n}_1 \\cdot \\vec{n}_2 = \\sqrt{3}a + 1$이다.\n[두 직선이 이루는 각의 공식 적용] 두 직선이 이루는 각이 $30^\\circ$이므로 $\\cos 30^\\circ = \\frac{|\\vec{n}_1 \\cdot \\vec{n}_2|}{|\\vec{n}_1||\\vec{n}_2|}$이다.\n[방정식 세우기] $\\frac{\\sqrt{3}}{2} = \\frac{|\\sqrt{3}a + 1|}{2\\sqrt{a^2+1}}$이므로 $\\sqrt{3}\\sqrt{a^2+1} = |\\sqrt{3}a + 1|$이다.\n[양변 제곱] $3(a^2 + 1) = (\\sqrt{3}a + 1)^2$이다.\n[식 전개] $3a^2 + 3 = 3a^2 + 2\\sqrt{3}a + 1$에서 양변의 $3a^2$이 소거된다.\n[일차방정식 풀기] $2\\sqrt{3}a = 2$이므로 $a = \\frac{2}{2\\sqrt{3}} = \\frac{1}{\\sqrt{3}} = \\frac{\\sqrt{3}}{3}$이다.\n[조건 확인] 구한 값 $a = \\frac{\\sqrt{3}}{3}$은 양수 조건을 만족한다.\n따라서 정답은 ①이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-GEO-RPM-082",
    "problemTypeKey": "PT_GEO_VECTOR_LINE_CIRCLE",
    "templateKey": "TPL_GEO_VEC_LINE_RELATION",
    "crossConceptKeys": [
      "CC_SLOPE",
      "CC_TRIGONOMETRIC_TANGENT"
    ],
    "conditionKeys": [
      "COND_POSITIVE"
    ],
    "integrationPattern": "SEQUENTIAL"
  }
];
