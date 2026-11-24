window.examTitle = "기하_137_두직선의평행수직조건_고2_유형은행1";

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
    "content": "좌표평면에서 두 직선\n$$l_1 : 4x = -3(y+2),\\quad l_2 : 3x - 1 = \\frac{y+3}{k}$$\n이 서로 수직으로 만날 때, 상수 $k$의 값은? (단, $k \\neq 0$)",
    "choices": [
      "$\\frac{1}{6}$",
      "$\\frac{1}{4}$",
      "$\\frac{1}{3}$",
      "$\\frac{1}{2}$",
      "$\\frac{2}{3}$"
    ],
    "answer": "②",
    "solution": "[직선 $l_1$의 방향벡터 구하기] $4x = -3(y+2)$의 양변을 $12$로 나누면 $\\frac{x}{3} = \\frac{y+2}{-4}$이므로 방향벡터는 $\\vec{u}_1 = (3, -4)$이다.\n[직선 $l_2$의 방향벡터 구하기] $3x - 1 = \\frac{y+3}{k}$에서 $3(x - \\frac{1}{3}) = \\frac{y+3}{k}$, 즉 $\\frac{x - 1/3}{1/3} = \\frac{y+3}{k}$이므로 방향벡터는 $\\vec{u}_2 = (\\frac{1}{3}, k)$이다.\n[두 직선의 수직 조건] 두 직선 $l_1, l_2$가 서로 수직이므로 방향벡터의 내적은 $0$이다 ($\\vec{u}_1 \\cdot \\vec{u}_2 = 0$).\n[내적 계산] $3 \\times \\frac{1}{3} + (-4) \\times k = 0$이다.\n[방정식 풀기] $1 - 4k = 0$에서 $4k = 1$이므로 $k = \\frac{1}{4}$이다.\n주의: 문제에서 $k \\neq 0$이라고 명시되어 있으므로 구한 해 $k = 1/4$는 모순 없이 성립한다.\n따라서 정답은 ②이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-GEO-RPM-097",
    "problemTypeKey": "PT_GEO_VECTOR_LINE_CIRCLE",
    "templateKey": "TPL_GEO_VEC_LINE_RELATION",
    "crossConceptKeys": [
      "CC_SLOPE"
    ],
    "conditionKeys": [
      "COND_NONZERO"
    ],
    "integrationPattern": "NONE"
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
    "content": "두 직선\n$$ax - 5y + 3 = 0,\\quad 2x + 6y - 7 = 0$$\n이 서로 수직일 때, 상수 $a$의 값은?",
    "choices": [
      "$9$",
      "$12$",
      "$15$",
      "$18$",
      "$21$"
    ],
    "answer": "③",
    "solution": "[법선벡터 구하기] 두 직선 $ax - 5y + 3 = 0$, $2x + 6y - 7 = 0$의 법선벡터는 각각 $\\vec{n}_1 = (a, -5)$, $\\vec{n}_2 = (2, 6)$이다.\n[두 직선의 수직 조건] 두 직선이 서로 수직이면 두 법선벡터도 서로 수직이므로 $\\vec{n}_1 \\cdot \\vec{n}_2 = 0$이다.\n[내적 계산식 세우기] $\\vec{n}_1 \\cdot \\vec{n}_2 = a \\times 2 + (-5) \\times 6 = 2a - 30 = 0$이다.\n[일차방정식 풀기] $2a = 30$이므로 $a = 15$이다.\n따라서 정답은 ③이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-GEO-RPM-097",
    "problemTypeKey": "PT_GEO_VECTOR_LINE_CIRCLE",
    "templateKey": "TPL_GEO_VEC_LINE_RELATION",
    "crossConceptKeys": [
      "CC_SLOPE"
    ],
    "conditionKeys": [],
    "integrationPattern": "NONE"
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
    "content": "두 직선\n$$l : \\begin{cases} x = 2 - 4t \\\\ y = 1 + kt \\end{cases},\\quad m : \\begin{cases} x = -3 + 2s \\\\ y = 4 + (k-2)s \\end{cases}$$\n이 서로 수직일 때, 모든 실수 $k$의 값의 합은? (단, $t, s$는 실수이다.)",
    "choices": [
      "$-2$",
      "$0$",
      "$2$",
      "$4$",
      "$6$"
    ],
    "answer": "③",
    "solution": "[매개변수방정식에서 방향벡터 구하기] 매개변수 $t, s$의 계수로부터 두 직선의 방향벡터는 각각 $\\vec{u}_l = (-4, k)$, $\\vec{u}_m = (2, k-2)$이다.\n[두 직선의 수직 조건] 두 직선 $l, m$이 서로 수직이므로 두 방향벡터의 내적은 $0$이다 ($\\vec{u}_l \\cdot \\vec{u}_m = 0$).\n[내적 계산식 세우기] $(-4) \\times 2 + k(k-2) = 0$이다.\n[이차방정식 정리] $-8 + k^2 - 2k = 0$, 즉 $k^2 - 2k - 8 = 0$이다.\n[인수분해] $(k - 4)(k + 2) = 0$이므로 $k = 4$ 또는 $k = -2$이다.\n[모든 실근의 합 구하기] 판별식 $D/4 = (-1)^2 - (-8) = 9 > 0$이므로 두 실근이 존재하며, 그 합은 $4 + (-2) = 2$이다 (또는 근과 계수의 관계에 의해 $-(-2)/1 = 2$).\n따라서 정답은 ③이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-GEO-RPM-097",
    "problemTypeKey": "PT_GEO_VECTOR_LINE_CIRCLE",
    "templateKey": "TPL_GEO_VEC_LINE_RELATION",
    "crossConceptKeys": [
      "CC_PLANE_VECTOR",
      "CC_LINE_EQUATION"
    ],
    "conditionKeys": [],
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
    "content": "두 직선\n$$l : x = \\frac{y-1}{2},\\quad m : \\frac{x-1}{a} = \\frac{y-5}{6}$$\n이 서로 평행할 때, 두 직선 사이의 거리는?",
    "choices": [
      "$\\frac{\\sqrt{5}}{5}$",
      "$\\frac{2\\sqrt{5}}{5}$",
      "$\\frac{3\\sqrt{5}}{5}$",
      "$\\frac{4\\sqrt{5}}{5}$",
      "$\\sqrt{5}$"
    ],
    "answer": "②",
    "solution": "[방향벡터 구하기] 직선 $l$의 방향벡터는 $\\vec{u}_l = (1, 2)$, 직선 $m$의 방향벡터는 $\\vec{u}_m = (a, 6)$이다.\n[두 직선의 평행 조건] 두 직선이 평행하므로 두 방향벡터는 실수배 관계이다 ($\\vec{u}_l \\parallel \\vec{u}_m$).\n[비례식 풀기] $\\frac{a}{1} = \\frac{6}{2} = 3$이므로 $a = 3$이다.\n[직선 $l$을 일반형으로 변환] 직선 $l$은 $x = \\frac{y-1}{2}$에서 $2x = y - 1$, 즉 $2x - y + 1 = 0$이다.\n[직선 $m$ 위의 한 점 찾기] 직선 $m : \\frac{x-1}{3} = \\frac{y-5}{6}$ 위의 한 점은 $P(1, 5)$이다.\n[점과 직선 사이의 거리 공식 적용] 점 $P(1, 5)$와 직선 $2x - y + 1 = 0$ 사이의 거리 $d$는 $d = \\frac{|2 \\times 1 - 5 + 1|}{\\sqrt{2^2 + (-1)^2}}$이다.\n[거리 계산 및 유리화] $d = \\frac{|-2|}{\\sqrt{5}} = \\frac{2}{\\sqrt{5}} = \\frac{2\\sqrt{5}}{5}$이다.\n주의: 평행한 두 직선 사이의 거리는 한 직선 위의 임의의 점에서 다른 직선까지의 수선의 길이를 구한다.\n따라서 정답은 ②이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-GEO-RPM-097",
    "problemTypeKey": "PT_GEO_VECTOR_LINE_CIRCLE",
    "templateKey": "TPL_GEO_VEC_LINE_RELATION",
    "crossConceptKeys": [
      "CC_PARALLEL_LINE_DISTANCE",
      "CC_LINE_EQUATION"
    ],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
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
    "content": "두 직선\n$$l : \\frac{x-1}{3} = \\frac{4-y}{6},\\quad m : \\frac{x+2}{k} = \\frac{1-y}{2}$$\n에 대하여 다음 조건을 만족하는 상수 $a, b$에 대하여 $a+b$의 값은?\n(가) 두 직선 $l, m$이 서로 평행할 때, 상수 $k$의 값은 $a$이다.\n(나) 두 직선 $l, m$이 서로 수직일 때, 상수 $k$의 값은 $b$이다.",
    "choices": [
      "$-3$",
      "$-2$",
      "$-1$",
      "$0$",
      "$1$"
    ],
    "answer": "①",
    "solution": "[두 직선의 표준형 정리 및 방향벡터 구하기] 직선 $l : \\frac{x-1}{3} = \\frac{y-4}{-6}$의 방향벡터는 $\\vec{u}_l = (3, -6)$이고, 직선 $m : \\frac{x+2}{k} = \\frac{y-1}{-2}$의 방향벡터는 $\\vec{u}_m = (k, -2)$이다.\n[조건 (가) 평행 조건 적용] 두 직선이 서로 평행하면 방향벡터의 성분비가 같으므로 $\\frac{k}{3} = \\frac{-2}{-6}$이다.\n[상수 $a$ 계산] $\\frac{k}{3} = \\frac{1}{3}$에서 $k = 1$이므로 $a = 1$이다.\n[조건 (나) 수직 조건 적용] 두 직선이 서로 수직이면 두 방향벡터의 내적이 $0$이므로 $\\vec{u}_l \\cdot \\vec{u}_m = 0$이다.\n[내적 계산식] $3 \\times k + (-6) \\times (-2) = 0$, 즉 $3k + 12 = 0$이다.\n[상수 $b$ 계산] $3k = -12$에서 $k = -4$이므로 $b = -4$이다.\n[최종값 계산] 따라서 $a + b = 1 + (-4) = -3$이다.\n따라서 정답은 ①이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-GEO-RPM-097",
    "problemTypeKey": "PT_GEO_VECTOR_LINE_CIRCLE",
    "templateKey": "TPL_GEO_VEC_LINE_RELATION",
    "crossConceptKeys": [
      "CC_SLOPE"
    ],
    "conditionKeys": [],
    "integrationPattern": "NONE"
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
    "content": "다음 조건을 만족하는 상수 $a, b$에 대하여 $a+b$의 값은?\n(가) 두 직선 $\\frac{x+2}{a} = \\frac{y-1}{6}$, $x-4 = \\frac{y+3}{2}$가 서로 평행할 때, 상수 $a$의 값\n(나) 두 직선 $\\frac{3-x}{2} = \\frac{y+1}{b}$, $x+1 = y-4$가 서로 수직일 때, 상수 $b$의 값",
    "choices": [
      "$1$",
      "$2$",
      "$3$",
      "$4$",
      "$5$"
    ],
    "answer": "⑤",
    "solution": "[조건 (가) 방향벡터 구하기] 두 직선의 방향벡터는 각각 $\\vec{u}_1 = (a, 6)$, $\\vec{u}_2 = (1, 2)$이다.\n[두 직선의 평행 조건] 두 직선이 서로 평행하므로 방향벡터의 성분비에서 $\\frac{a}{1} = \\frac{6}{2} = 3$이다. 따라서 $a = 3$이다.\n[조건 (나) 표준형 정리 및 방향벡터 구하기] $\\frac{3-x}{2} = \\frac{x-3}{-2}$이므로 첫 번째 직선의 방향벡터는 $\\vec{u}_3 = (-2, b)$이고, $x+1 = y-4$의 방향벡터는 $\\vec{u}_4 = (1, 1)$이다.\n[두 직선의 수직 조건] 두 직선이 서로 수직이므로 두 방향벡터의 내적은 $0$이다 ($\\vec{u}_3 \\cdot \\vec{u}_4 = 0$).\n[내적 계산식] $(-2) \\times 1 + b \\times 1 = 0$, 즉 $-2 + b = 0$이므로 $b = 2$이다.\n[합 계산] 따라서 $a + b = 3 + 2 = 5$이다.\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-GEO-RPM-097",
    "problemTypeKey": "PT_GEO_VECTOR_LINE_CIRCLE",
    "templateKey": "TPL_GEO_VEC_LINE_RELATION",
    "crossConceptKeys": [
      "CC_SLOPE"
    ],
    "conditionKeys": [],
    "integrationPattern": "NONE"
  },
  {
    "id": 7,
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
    "content": "직선 $\\frac{x-4}{3} = \\frac{y+1}{2}$이 직선 $\\frac{x+1}{-3} = \\frac{y-2}{a}$와는 평행하고, 직선 $\\frac{x-3}{b} = \\frac{5-y}{6}$와는 수직일 때, 실수 $a, b$에 대하여 $a+b$의 값은?",
    "choices": [
      "$-2$",
      "$-1$",
      "$0$",
      "$2$",
      "$4$"
    ],
    "answer": "④",
    "solution": "[기준 직선의 방향벡터 구하기] 직선 $\\frac{x-4}{3} = \\frac{y+1}{2}$의 방향벡터는 $\\vec{u} = (3, 2)$이다.\n[평행 조건 적용] 직선 $\\frac{x+1}{-3} = \\frac{y-2}{a}$의 방향벡터는 $\\vec{u}_1 = (-3, a)$이다. 두 직선이 평행하므로 $\\frac{-3}{3} = \\frac{a}{2}$에서 $-1 = \\frac{a}{2}$, 즉 $a = -2$이다.\n[수직인 직선의 표준형 변환] 직선 $\\frac{x-3}{b} = \\frac{5-y}{6}$를 $\\frac{x-3}{b} = \\frac{y-5}{-6}$로 변형하면 방향벡터는 $\\vec{u}_2 = (b, -6)$이다.\n[수직 조건 적용] 두 직선이 서로 수직이므로 두 방향벡터의 내적은 $0$이다 ($\\vec{u} \\cdot \\vec{u}_2 = 0$).\n[내적 계산식 세우기] $3 \\times b + 2 \\times (-6) = 0$, 즉 $3b - 12 = 0$이므로 $3b = 12$, $b = 4$이다.\n[합 계산] 따라서 $a + b = -2 + 4 = 2$이다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-GEO-RPM-097",
    "problemTypeKey": "PT_GEO_VECTOR_LINE_CIRCLE",
    "templateKey": "TPL_GEO_VEC_LINE_RELATION",
    "crossConceptKeys": [
      "CC_SLOPE"
    ],
    "conditionKeys": [],
    "integrationPattern": "NONE"
  },
  {
    "id": 8,
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
    "content": "다음 [보기]는 두 직선의 위치관계를 나타낸 것이다. 옳은 것만을 있는 대로 고른 것은?\n$$\\begin{aligned} &\\text{ㄱ. 두 직선 } \\frac{x-2}{4} = \\frac{y+1}{2},\\; \\frac{x+3}{1} = \\frac{4-y}{2}\\text{는 서로 수직이다.} \\\\ &\\text{ㄴ. 두 직선 } \\frac{x-1}{3} = \\frac{y+2}{-2},\\; 2x+3y-5=0\\text{은 서로 평행하다.} \\\\ &\\text{ㄷ. 두 직선 } \\frac{x+2}{3} = y-1,\\; \\frac{x-3}{2} = 1-y\\text{가 이루는 예각의 크기는 } 45^\\circ\\text{이다.} \\end{aligned}$$",
    "choices": [
      "ㄱ",
      "ㄴ",
      "ㄱ, ㄴ",
      "ㄴ, ㄷ",
      "ㄱ, ㄴ, ㄷ"
    ],
    "answer": "⑤",
    "solution": "[보기 ㄱ 검증: 수직 조건] 두 직선의 방향벡터는 각각 $\\vec{u}_1 = (4, 2)$, $\\vec{u}_2 = (1, -2)$이다. 두 벡터의 내적은 $\\vec{u}_1 \\cdot \\vec{u}_2 = 4 \\times 1 + 2 \\times (-2) = 4 - 4 = 0$이므로 두 직선은 서로 수직이다 (ㄱ은 참).\n[보기 ㄴ 검증: 평행 조건] 첫 번째 직선의 방향벡터는 $\\vec{u} = (3, -2)$이고, 두 번째 직선 $2x + 3y - 5 = 0$의 법선벡터는 $\\vec{n} = (2, 3)$이다.\n[방향벡터와 법선벡터의 내적] $\\vec{u} \\cdot \\vec{n} = 3 \\times 2 + (-2) \\times 3 = 6 - 6 = 0$이므로 직선의 방향벡터와 법선벡터가 수직이다. 첫 번째 직선 위의 점 $(1, -2)$를 대입하면 $2(1) + 3(-2) - 5 = -9 \\neq 0$이므로 일치하지 않고 서로 평행하다 (ㄴ은 참).\n[보기 ㄷ 검증: 예각의 크기] 두 직선의 방향벡터는 각각 $\\vec{v}_1 = (3, 1)$, $\\vec{v}_2 = (2, -1)$이다.\n[크기 및 내적 계산] $|\u000bec{v}_1| = \\sqrt{3^2 + 1^2} = \\sqrt{10}$, $|\u000bec{v}_2| = \\sqrt{2^2 + (-1)^2} = \\sqrt{5}$, $|\\vec{v}_1 \\cdot \\vec{v}_2| = |3 \\times 2 + 1 \\times (-1)| = 5$이다.\n[코사인 값 계산] $\\cos\\theta = \\frac{5}{\\sqrt{10}\\sqrt{5}} = \\frac{5}{5\\sqrt{2}} = \\frac{\\sqrt{2}}{2}$이므로 예각의 크기 $\\theta = 45^\\circ$이다 (ㄷ은 참).\n[결론] 따라서 옳은 것은 ㄱ, ㄴ, ㄷ이다.\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-GEO-RPM-097",
    "problemTypeKey": "PT_GEO_VECTOR_LINE_CIRCLE",
    "templateKey": "TPL_GEO_VEC_LINE_RELATION",
    "crossConceptKeys": [
      "CC_SLOPE",
      "CC_LINE_SLOPE_TANGENT"
    ],
    "conditionKeys": [],
    "integrationPattern": "NONE"
  },
  {
    "id": 9,
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
    "content": "두 직선\n$$l : \\frac{x-3}{a} = y+1,\\quad m : \\frac{x+2}{3} = 2-y$$\n에 대하여 다음 [보기] 중 옳은 것만을 있는 대로 고른 것은?\n$$\\begin{aligned} &\\text{ㄱ. 두 직선 } l, m\\text{이 서로 평행할 때, 상수 } a\\text{의 값은 } 3\\text{이다.} \\\\ &\\text{ㄴ. 두 직선 } l, m\\text{이 서로 수직일 때, 상수 } a\\text{의 값은 } \\frac{1}{3}\\text{이다.} \\\\ &\\text{ㄷ. 두 직선 } l, m\\text{이 이루는 각의 크기가 } 45^\\circ\\text{일 때, 양수 } a\\text{의 값은 } 4\\text{이다.} \\end{aligned}$$",
    "choices": [
      "ㄱ",
      "ㄴ",
      "ㄱ, ㄴ",
      "ㄴ, ㄷ",
      "ㄱ, ㄴ, ㄷ"
    ],
    "answer": "②",
    "solution": "[방향벡터 구하기] 두 직선 $l, m$의 방향벡터는 각각 $\\vec{u}_l = (a, 1)$, $\\vec{u}_m = (3, -1)$이다.\n[보기 ㄱ 검증: 평행 조건] $l \\parallel m$이면 성분비에 의해 $\\frac{a}{3} = \\frac{1}{-1}$이므로 $a = -3$이어야 한다. 따라서 $a = 3$이라는 서술은 거짓이다 (ㄱ은 거짓).\n[보기 ㄴ 검증: 수직 조건] $l \\perp m$이면 $\\vec{u}_l \\cdot \\vec{u}_m = 0$이므로 $a \\times 3 + 1 \\times (-1) = 0$, 즉 $3a - 1 = 0$에서 $a = \\frac{1}{3}$이다 (ㄴ은 참).\n[보기 ㄷ 검증: 이루는 각이 $45^\\circ$일 때] $\\cos 45^\\circ = \\frac{|\\vec{u}_l \\cdot \\vec{u}_m|}{|\\vec{u}_l||\\vec{u}_m|} = \\frac{|3a - 1|}{\\sqrt{a^2 + 1}\\sqrt{3^2 + (-1)^2}} = \\frac{|3a - 1|}{\\sqrt{10}\\sqrt{a^2 + 1}}$이다.\n[방정식 풀이] $\\frac{1}{\\sqrt{2}} = \\frac{|3a - 1|}{\\sqrt{10}\\sqrt{a^2 + 1}}$의 양변을 제곱하면 $\\frac{1}{2} = \\frac{(3a - 1)^2}{10(a^2 + 1)}$이므로 $5(a^2 + 1) = 9a^2 - 6a + 1$이다.\n[이차방정식 정리 및 인수분해] $4a^2 - 6a - 4 = 0$, 즉 $2a^2 - 3a - 2 = 0$에서 $(2a + 1)(a - 2) = 0$이다.\n[양수 근 확인] $a > 0$이므로 $a = 2$이다. 따라서 양수 $a$가 $4$라는 서술은 거짓이다 (ㄷ은 거짓).\n[결론] 따라서 옳은 것은 ㄴ뿐이다.\n따라서 정답은 ②이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-GEO-RPM-097",
    "problemTypeKey": "PT_GEO_VECTOR_LINE_CIRCLE",
    "templateKey": "TPL_GEO_VEC_LINE_RELATION",
    "crossConceptKeys": [
      "CC_SLOPE",
      "CC_LINE_SLOPE_TANGENT"
    ],
    "conditionKeys": [
      "COND_POSITIVE"
    ],
    "integrationPattern": "CASE_BRANCH"
  },
  {
    "id": 10,
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
    "content": "세 직선\n$$l_1 : x-1 = \\frac{y+2}{\\sqrt{3}},\\quad l_2 : \\frac{x+2}{a} = 1-y,\\quad l_3 : \\frac{x-4}{b} = \\frac{y+1}{a}$$\n이 다음 조건을 만족시킬 때, 두 상수 $a, b$에 대하여 $\\frac{b}{a}$의 값은? (단, $ab > 0$)\n(가) 두 직선 $l_1$과 $l_2$는 서로 수직이다.\n(나) 두 직선 $l_1$과 $l_3$가 이루는 예각의 크기는 $30^\\circ$이다.",
    "choices": [
      "$\\frac{\\sqrt{3}}{3}$",
      "$1$",
      "$\\sqrt{2}$",
      "$\\sqrt{3}$",
      "$2$"
    ],
    "answer": "④",
    "solution": "[세 직선의 방향벡터 구하기] $l_1 : \\vec{u}_1 = (1, \\sqrt{3})$, $l_2 : \\vec{u}_2 = (a, -1)$, $l_3 : \\vec{u}_3 = (b, a)$이다.\n[조건 (가) 수직 조건 적용] $l_1 \\perp l_2$이므로 $\\vec{u}_1 \\cdot \\vec{u}_2 = 0$이다.\n[상수 $a$ 계산] $1 \\times a + \\sqrt{3} \\times (-1) = 0$에서 $a - \\sqrt{3} = 0$이므로 $a = \\sqrt{3}$이다.\n[부호 조건 확인] $ab > 0$이고 $a = \\sqrt{3} > 0$이므로 $b > 0$이다.\n[직선 $l_3$의 방향벡터 대입] $\\vec{u}_3 = (b, \\sqrt{3})$이므로 $|\u000bec{u}_3| = \\sqrt{b^2 + 3}$이고, $|\u000bec{u}_1| = \\sqrt{1^2 + (\\sqrt{3})^2} = 2$이다.\n[조건 (나) 예각의 크기 공식] $l_1$과 $l_3$가 이루는 예각이 $30^\\circ$이므로 $\\cos 30^\\circ = \\frac{|\\vec{u}_1 \\cdot \\vec{u}_3|}{|\\vec{u}_1||\\vec{u}_3|}$이다.\n[방정식 세우기] $\\frac{\\sqrt{3}}{2} = \\frac{|1 \\times b + \\sqrt{3} \\times \\sqrt{3}|}{2\\sqrt{b^2 + 3}} = \\frac{|b + 3|}{2\\sqrt{b^2 + 3}}$이므로 $\\sqrt{3}\\sqrt{b^2 + 3} = |b + 3|$이다.\n[양변 제곱] $3(b^2 + 3) = (b + 3)^2 = b^2 + 6b + 9$이다.\n[이차방정식 풀기] $3b^2 + 9 = b^2 + 6b + 9$에서 $2b^2 - 6b = 0$, 즉 $2b(b - 3) = 0$이다.\n[상수 $b$ 결정] $b > 0$이므로 $b = 3$이다.\n[최종값 도출] 따라서 $\\frac{b}{a} = \\frac{3}{\\sqrt{3}} = \\sqrt{3}$이다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-GEO-RPM-097",
    "problemTypeKey": "PT_GEO_VECTOR_LINE_CIRCLE",
    "templateKey": "TPL_GEO_VEC_LINE_RELATION",
    "crossConceptKeys": [
      "CC_SLOPE",
      "CC_LINE_SLOPE_TANGENT"
    ],
    "conditionKeys": [
      "COND_INEQUALITY_CONSTRAINT"
    ],
    "integrationPattern": "SEQUENTIAL"
  }
];
