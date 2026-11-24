window.examTitle = "기하_098_벡터가서로같을조건_고2_유형은행1";

window.questionBank = [
  {
    "id": 1,
    "category": "벡터의 뜻과 연산",
    "standardCourse": "기하",
    "curriculum": "2022",
    "standardUnitKey": "H22-GE-05",
    "standardUnit": "벡터의 연산",
    "standardUnitOrder": 5,
    "subUnitKey": "H22-GE-05-VECTOR_BASIC",
    "subUnit": "벡터의 뜻과 연산",
    "subUnitConfidence": "candidate_evidence",
    "subUnitClassificationDepth": "complete_candidate",
    "conceptClusterKey": "H22-GE-05-VECTOR_BASIC",
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "벡터의 뜻과 연산"
    ],
    "wide": false,
    "content": "서로 평행하지 않고 영벡터가 아닌 두 벡터 $\\vec{a}, \\vec{b}$에 대하여 등식\n$$m(3\\vec{a} + 2\\vec{b}) + n(2\\vec{a} - \\vec{b}) = 12\\vec{a} + \\vec{b}$$\n가 성립할 때, 두 실수 $m, n$에 대하여 $m+n$의 값은?",
    "choices": [
      "4",
      "5",
      "6",
      "7",
      "8"
    ],
    "answer": "②",
    "solution": "좌변의 식을 벡터 $\\vec{a}$와 $\\vec{b}$에 대하여 전개하여 동류항끼리 묶습니다:\n$m(3\\vec{a}+2\\vec{b})+n(2\\vec{a}-\\vec{b}) = (3m+2n)\\vec{a} + (2m-n)\\vec{b}$\n우변과 계수를 비교하기 위해 주어진 등식을 다시 나타냅니다:\n$(3m+2n)\\vec{a} + (2m-n)\\vec{b} = 12\\vec{a} + \\vec{b}$\n[벡터가 서로 같을 조건] 영벡터가 아닌 두 벡터 $\\vec{a}, \\vec{b}$가 서로 평행하지 않으므로, 양변의 $\\vec{a}, \\vec{b}$의 계수가 각각 일치해야 합니다:\n$3m + 2n = 12 \\quad \\cdots$ ㉠\n$2m - n = 1 \\quad \\cdots$ ㉡\n㉡식을 $n$에 대하여 정리합니다:\n$n = 2m - 1 \\quad \\cdots$ ㉢\n㉢식을 ㉠식에 대입하여 일차방정식을 풉니다:\n$3m + 2(2m - 1) = 12$\n$3m + 4m - 2 = 12$\n$7m = 14 \\implies m = 2$\n구한 $m = 2$를 ㉢식에 대입하여 $n$의 값을 구합니다:\n$n = 2 \\times 2 - 1 = 3$\n두 실수 $m, n$의 합 $m+n$을 계산합니다:\n$m + n = 2 + 3 = 5$\n따라서 정답은 ②이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-GEO-RPM-066",
    "problemTypeKey": "PT_GEO_PLANE_VECTOR",
    "templateKey": "TPL_GEO_PLANE_VECTOR_PARAMETER",
    "crossConceptKeys": [],
    "conditionKeys": [
      "COND_NONZERO"
    ],
    "integrationPattern": "NONE"
  },
  {
    "id": 2,
    "category": "벡터의 뜻과 연산",
    "standardCourse": "기하",
    "curriculum": "2022",
    "standardUnitKey": "H22-GE-05",
    "standardUnit": "벡터의 연산",
    "standardUnitOrder": 5,
    "subUnitKey": "H22-GE-05-VECTOR_BASIC",
    "subUnit": "벡터의 뜻과 연산",
    "subUnitConfidence": "candidate_evidence",
    "subUnitClassificationDepth": "complete_candidate",
    "conceptClusterKey": "H22-GE-05-VECTOR_BASIC",
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "벡터의 뜻과 연산"
    ],
    "wide": false,
    "content": "영벡터가 아닌 두 벡터 $\\vec{a}, \\vec{b}$가 서로 평행하지 않을 때, 등식\n$$m(\\vec{a} + n\\vec{b}) = (7 - n)\\vec{a} + 10\\vec{b}$$\n를 만족시키는 두 실수 $m, n$에 대하여 $m^2 + n^2$의 값은?",
    "choices": [
      "21",
      "23",
      "25",
      "27",
      "29"
    ],
    "answer": "⑤",
    "solution": "좌변을 분배법칙을 이용하여 전개합니다:\n$m(\\vec{a} + n\\vec{b}) = m\\vec{a} + mn\\vec{b}$\n주어진 등식의 양변을 다시 씁니다:\n$m\\vec{a} + mn\\vec{b} = (7 - n)\\vec{a} + 10\\vec{b}$\n[벡터가 서로 같을 조건] 영벡터가 아닌 두 벡터 $\\vec{a}, \\vec{b}$가 서로 평행하지 않으므로, 양변의 대응하는 계수가 같아야 합니다:\n$m = 7 - n \\implies m + n = 7 \\quad \\cdots$ ㉠\n$mn = 10 \\quad \\cdots$ ㉡\n[곱셈 공식의 변형] $m^2 + n^2$을 합과 곱의 식으로 나타냅니다:\n$m^2 + n^2 = (m + n)^2 - 2mn$\n㉠과 ㉡에서 구한 $m+n=7, mn=10$을 대입하여 계산합니다:\n$m^2 + n^2 = 7^2 - 2 \\times 10 = 49 - 20 = 29$\n주의: $m, n$을 두 근으로 하는 이차방정식 $t^2 - 7t + 10 = (t-2)(t-5) = 0$에서 실근 $2, 5$가 존재하므로 두 실수 $m, n$의 조건을 충족합니다.\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-GEO-RPM-066",
    "problemTypeKey": "PT_GEO_PLANE_VECTOR",
    "templateKey": "TPL_GEO_PLANE_VECTOR_PARAMETER",
    "crossConceptKeys": [],
    "conditionKeys": [
      "COND_NONZERO"
    ],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 3,
    "category": "벡터의 뜻과 연산",
    "standardCourse": "기하",
    "curriculum": "2022",
    "standardUnitKey": "H22-GE-05",
    "standardUnit": "벡터의 연산",
    "standardUnitOrder": 5,
    "subUnitKey": "H22-GE-05-VECTOR_BASIC",
    "subUnit": "벡터의 뜻과 연산",
    "subUnitConfidence": "candidate_evidence",
    "subUnitClassificationDepth": "complete_candidate",
    "conceptClusterKey": "H22-GE-05-VECTOR_BASIC",
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "벡터의 뜻과 연산"
    ],
    "wide": false,
    "content": "영벡터가 아닌 세 벡터 $\\vec{a}, \\vec{b}, \\vec{c}$에 대하여 두 벡터 $\\vec{a}, \\vec{b}$는 서로 평행하지 않고, 두 벡터 $\\vec{b}, \\vec{c}$는 서로 평행하다. 등식\n$$k(2\\vec{a} - 3\\vec{b}) + 6\\vec{a} + 4\\vec{c} = \\vec{0}$$\n을 만족시키는 실수 $k$의 값은?",
    "choices": [
      "-3",
      "-1",
      "1",
      "2",
      "4"
    ],
    "answer": "①",
    "solution": "[벡터의 평행 조건] 영벡터가 아닌 두 벡터 $\\vec{b}, \\vec{c}$가 서로 평행하므로, $0$이 아닌 실수 $t$에 대하여 다음과 같이 둘 수 있습니다:\n$\\vec{c} = t\\vec{b} \\quad (t \\neq 0)$\n주어진 등식에 $\\vec{c} = t\\vec{b}$를 대입합니다:\n$k(2\\vec{a} - 3\\vec{b}) + 6\\vec{a} + 4(t\\vec{b}) = \\vec{0}$\n벡터 $\\vec{a}$와 $\\vec{b}$에 대하여 동류항끼리 묶어 정리합니다:\n$(2k + 6)\\vec{a} + (-3k + 4t)\\vec{b} = \\vec{0}$\n[서로 평행하지 않은 두 벡터의 상등 조건] 두 벡터 $\\vec{a}, \\vec{b}$는 영벡터가 아니고 서로 평행하지 않으므로, 계수가 각각 $0$이어야 합니다:\n$2k + 6 = 0 \\quad \\cdots$ ㉠\n$-3k + 4t = 0 \\quad \\cdots$ ㉡\n㉠식의 일차방정식을 풀어 실수 $k$의 값을 구합니다:\n$2k = -6 \\implies k = -3$\n구한 $k = -3$을 ㉡식에 대입하여 모순이 없음을 확인합니다:\n$-3(-3) + 4t = 0 \\implies 9 + 4t = 0 \\implies t = -\\frac{9}{4} \\neq 0$\n따라서 정답은 ①이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-GEO-RPM-066",
    "problemTypeKey": "PT_GEO_PLANE_VECTOR",
    "templateKey": "TPL_GEO_PLANE_VECTOR_PARAMETER",
    "crossConceptKeys": [],
    "conditionKeys": [
      "COND_NONZERO"
    ],
    "integrationPattern": "SEQUENTIAL"
  }
];
