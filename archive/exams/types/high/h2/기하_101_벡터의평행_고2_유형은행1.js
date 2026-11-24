window.examTitle = "기하_101_벡터의평행_고2_유형은행1";

window.questionBank = [
  {
    "id": 1,
    "category": "벡터의 성분",
    "standardCourse": "기하",
    "curriculum": "2022",
    "standardUnitKey": "H22-GE-05",
    "standardUnit": "벡터의 연산",
    "standardUnitOrder": 5,
    "subUnitKey": "H22-GE-05-VECTOR_COMPONENT",
    "subUnit": "벡터의 성분",
    "subUnitConfidence": "candidate_evidence",
    "subUnitClassificationDepth": "complete_candidate",
    "conceptClusterKey": "H22_GE_05_VECTOR_COMPONENT",
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "벡터의 성분"
    ],
    "wide": false,
    "content": "세 벡터 $\\vec{p}=5\\vec{a}+\\vec{b}$, $\\vec{q}=-2\\vec{a}+3\\vec{b}$, $\\vec{r}=k\\vec{a}-7\\vec{b}$일 때, $\\vec{p}-\\vec{q}$와 $\\vec{q}+\\vec{r}$가 서로 평행하도록 하는 실수 $k$의 값은? (단, 두 벡터 $\\vec{a}$와 $\\vec{b}$는 영벡터가 아니고 서로 평행하지 않다.)",
    "choices": [
      "10",
      "12",
      "14",
      "16",
      "18"
    ],
    "answer": "④",
    "solution": "$\\vec{p}-\\vec{q}$ 계산하기: $\\vec{p}-\\vec{q} = (5\\vec{a}+\\vec{b}) - (-2\\vec{a}+3\\vec{b}) = (5 - (-2))\\vec{a} + (1 - 3)\\vec{b} = 7\\vec{a} - 2\\vec{b}$이다.\n$\\vec{q}+\\vec{r}$ 계산하기: $\\vec{q}+\\vec{r} = (-2\\vec{a}+3\\vec{b}) + (k\\vec{a}-7\\vec{b}) = (k - 2)\\vec{a} + (3 - 7)\\vec{b} = (k - 2)\\vec{a} - 4\\vec{b}$이다.\n벡터의 평행 조건 적용하기: 두 벡터가 서로 평행하므로 0이 아닌 실수 $m$에 대하여 $\\vec{q}+\\vec{r} = m(\\vec{p}-\\vec{q})$가 성립한다.\n계수 비교 방정식 세우기: $(k - 2)\\vec{a} - 4\\vec{b} = m(7\\vec{a} - 2\\vec{b}) = 7m\\vec{a} - 2m\\vec{b}$이다.\n연립방정식 풀기: 두 벡터 $\\vec{a}, \\vec{b}$는 평행하지 않으므로 각 계수가 일치해야 한다.\n(i) $\\vec{b}$의 계수 비교: $-4 = -2m \\implies m = 2$\n(ii) $\\vec{a}$의 계수 비교: $k - 2 = 7m = 7 \\times 2 = 14 \\implies k = 16$이다.\n성분의 비를 통한 역산: $\\frac{k-2}{7} = \\frac{-4}{-2} = 2 \\implies k - 2 = 14 \\implies k = 16$으로 일치한다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-GEO-RPM-069",
    "problemTypeKey": "PT_GEO_PLANE_VECTOR",
    "templateKey": "TPL_GEO_PLANE_VECTOR_PARAMETER",
    "crossConceptKeys": [],
    "conditionKeys": [
      "COND_NONZERO"
    ],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 2,
    "category": "벡터의 성분",
    "standardCourse": "기하",
    "curriculum": "2022",
    "standardUnitKey": "H22-GE-05",
    "standardUnit": "벡터의 연산",
    "standardUnitOrder": 5,
    "subUnitKey": "H22-GE-05-VECTOR_COMPONENT",
    "subUnit": "벡터의 성분",
    "subUnitConfidence": "candidate_evidence",
    "subUnitClassificationDepth": "complete_candidate",
    "conceptClusterKey": "H22_GE_05_VECTOR_COMPONENT",
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "벡터의 성분"
    ],
    "wide": false,
    "content": "세 벡터 $\\vec{p}=5\\vec{a}-4\\vec{b}$, $\\vec{q}=k\\vec{a}-3\\vec{b}$, $\\vec{r}=-3\\vec{a}+6\\vec{b}$에 대하여 영벡터가 아닌 두 벡터 $\\vec{p}+\\vec{r}$, $\\vec{q}+\\vec{r}$가 서로 평행하게 하는 실수 $k$의 값은? (단, 두 벡터 $\\vec{a}, \\vec{b}$는 서로 평행하지 않다.)",
    "choices": [
      "2",
      "3",
      "4",
      "5",
      "6"
    ],
    "answer": "⑤",
    "solution": "$\\vec{p}+\\vec{r}$ 계산하기: $\\vec{p}+\\vec{r} = (5\\vec{a}-4\\vec{b}) + (-3\\vec{a}+6\\vec{b}) = (5-3)\\vec{a} + (-4+6)\\vec{b} = 2\\vec{a} + 2\\vec{b}$이다.\n$\\vec{q}+\\vec{r}$ 계산하기: $\\vec{q}+\\vec{r} = (k\\vec{a}-3\\vec{b}) + (-3\\vec{a}+6\\vec{b}) = (k-3)\\vec{a} + (-3+6)\\vec{b} = (k-3)\\vec{a} + 3\\vec{b}$이다.\n벡터의 평행 조건 적용하기: 두 벡터가 서로 평행하므로 0이 아닌 실수 $m$에 대하여 $\\vec{q}+\\vec{r} = m(\\vec{p}+\\vec{r})$가 성립한다.\n계수 비교식 작성하기: $(k-3)\\vec{a} + 3\\vec{b} = m(2\\vec{a} + 2\\vec{b}) = 2m\\vec{a} + 2m\\vec{b}$이다.\n실수 $m$과 $k$ 구하기:\n(i) $\\vec{b}$의 계수: $3 = 2m \\implies m = \\frac{3}{2}$\n(ii) $\\vec{a}$의 계수: $k - 3 = 2m = 2 \\times \\frac{3}{2} = 3 \\implies k = 6$이다.\n주의: $k=6$일 때 $\\vec{q}+\\vec{r} = 3\\vec{a}+3\\vec{b} \\neq \\vec{0}$이므로 두 벡터 모두 영벡터가 아니라는 조건을 만족한다.\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-GEO-RPM-069",
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
    "category": "벡터의 성분",
    "standardCourse": "기하",
    "curriculum": "2022",
    "standardUnitKey": "H22-GE-05",
    "standardUnit": "벡터의 연산",
    "standardUnitOrder": 5,
    "subUnitKey": "H22-GE-05-VECTOR_COMPONENT",
    "subUnit": "벡터의 성분",
    "subUnitConfidence": "candidate_evidence",
    "subUnitClassificationDepth": "complete_candidate",
    "conceptClusterKey": "H22_GE_05_VECTOR_COMPONENT",
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "벡터의 성분"
    ],
    "wide": false,
    "content": "영벡터가 아닌 두 벡터 $\\vec{a}, \\vec{b}$에 대하여 $\\vec{p}=\\vec{a}-\\vec{b}$, $\\vec{q}=k\\vec{a}+2\\vec{b}$, $\\vec{r}=-\\vec{a}-5\\vec{b}$이고 $\\vec{p}+\\vec{q}$와 $\\vec{p}-\\vec{r}$가 서로 평행할 때, 실수 $k$의 값은? (단, 두 벡터 $\\vec{a}, \\vec{b}$는 서로 평행하지 않다.)",
    "choices": [
      "-1",
      "-\\frac{1}{2}",
      "0",
      "\\frac{1}{2}",
      "1"
    ],
    "answer": "②",
    "solution": "$\\vec{p}+\\vec{q}$ 계산하기: $\\vec{p}+\\vec{q} = (\\vec{a}-\\vec{b}) + (k\\vec{a}+2\\vec{b}) = (k+1)\\vec{a} + (-1+2)\\vec{b} = (k+1)\\vec{a} + \\vec{b}$이다.\n$\\vec{p}-\\vec{r}$ 계산하기: $\\vec{p}-\\vec{r} = (\\vec{a}-\\vec{b}) - (-\\vec{a}-5\\vec{b}) = (1 - (-1))\\vec{a} + (-1 - (-5))\\vec{b} = 2\\vec{a} + 4\\vec{b}$이다.\n평행 조건 식 세우기: 두 벡터가 서로 평행하므로 실수 $m$에 대하여 $\\vec{p}+\\vec{q} = m(\\vec{p}-\\vec{r})$가 성립한다.\n계수 비교하기: $(k+1)\\vec{a} + \\vec{b} = m(2\\vec{a} + 4\\vec{b}) = 2m\\vec{a} + 4m\\vec{b}$이다.\n연립방정식 풀기: $\\vec{a}, \\vec{b}$는 서로 평행하지 않으므로\n(i) $\\vec{b}$의 계수: $1 = 4m \\implies m = \\frac{1}{4}$\n(ii) $\\vec{a}$의 계수: $k + 1 = 2m = 2 \\times \\frac{1}{4} = \\frac{1}{2} \\implies k = \\frac{1}{2} - 1 = -\\frac{1}{2}$이다.\n역산 검산: $\\frac{k+1}{2} = \\frac{1}{4} \\implies 4k + 4 = 2 \\implies 4k = -2 \\implies k = -\\frac{1}{2}$로 일치한다.\n따라서 정답은 ②이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-GEO-RPM-069",
    "problemTypeKey": "PT_GEO_PLANE_VECTOR",
    "templateKey": "TPL_GEO_PLANE_VECTOR_PARAMETER",
    "crossConceptKeys": [],
    "conditionKeys": [
      "COND_NONZERO"
    ],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 4,
    "category": "벡터의 성분",
    "standardCourse": "기하",
    "curriculum": "2022",
    "standardUnitKey": "H22-GE-05",
    "standardUnit": "벡터의 연산",
    "standardUnitOrder": 5,
    "subUnitKey": "H22-GE-05-VECTOR_COMPONENT",
    "subUnit": "벡터의 성분",
    "subUnitConfidence": "candidate_evidence",
    "subUnitClassificationDepth": "complete_candidate",
    "conceptClusterKey": "H22_GE_05_VECTOR_COMPONENT",
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "벡터의 성분"
    ],
    "wide": false,
    "content": "영벡터가 아닌 두 벡터 $\\vec{a}, \\vec{b}$가 서로 평행하지 않을 때, 세 점 $\\text{A, B, C}$의 위치벡터가 $\\vec{\\text{OA}}=\\vec{a}-\\vec{b}$, $\\vec{\\text{OB}}=4\\vec{a}+2\\vec{b}$, $\\vec{\\text{OC}}=3\\vec{a}+k\\vec{b}$이다. $3\\vec{\\text{AC}}=m\\vec{\\text{AB}}$일 때, 실수 $k$의 값은? (단, $m$은 0이 아닌 실수이다.)",
    "choices": [
      "1",
      "2",
      "3",
      "4",
      "5"
    ],
    "answer": "①",
    "solution": "벡터 $\\vec{\\text{AB}}$ 계산: $\\vec{\\text{AB}} = \\vec{\\text{OB}} - \\vec{\\text{OA}} = (4\\vec{a}+2\\vec{b}) - (\\vec{a}-\\vec{b}) = (4-1)\\vec{a} + (2 - (-1))\\vec{b} = 3\\vec{a} + 3\\vec{b}$이다.\n벡터 $\\vec{\\text{AC}}$ 계산: $\\vec{\\text{AC}} = \\vec{\\text{OC}} - \\vec{\\text{OA}} = (3\\vec{a}+k\\vec{b}) - (\\vec{a}-\\vec{b}) = (3-1)\\vec{a} + (k - (-1))\\vec{b} = 2\\vec{a} + (k+1)\\vec{b}$이다.\n조건식 $3\\vec{\\text{AC}} = m\\vec{\\text{AB}}$에 대입: $3\\left(2\\vec{a} + (k+1)\\vec{b}\\right) = m(3\\vec{a} + 3\\vec{b})$이므로 $6\\vec{a} + 3(k+1)\\vec{b} = 3m\\vec{a} + 3m\\vec{b}$이다.\n계수 비교하기: $\\vec{a}, \\vec{b}$가 서로 평행하지 않으므로 각 계수가 같아야 한다.\n(i) $\\vec{a}$의 계수: $3m = 6 \\implies m = 2$\n(ii) $\\vec{b}$의 계수: $3(k+1) = 3m = 3 \\times 2 = 6 \\implies k + 1 = 2 \\implies k = 1$이다.\n기하적 의미 점검: $3\\vec{\\text{AC}} = 2\\vec{\\text{AB}} \\implies \\vec{\\text{AC}} = \\frac{2}{3}\\vec{\\text{AB}}$이므로 점 $\\text{C}$는 선분 $\\text{AB}$를 $2:1$로 내분하는 점이며, $k=1$일 때 정확히 성립한다.\n따라서 정답은 ①이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-GEO-RPM-069",
    "problemTypeKey": "PT_GEO_PLANE_VECTOR",
    "templateKey": "TPL_GEO_PLANE_VECTOR_PARAMETER",
    "crossConceptKeys": [
      "CC_PLANE_VECTOR"
    ],
    "conditionKeys": [
      "COND_NONZERO"
    ],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 5,
    "category": "벡터의 성분",
    "standardCourse": "기하",
    "curriculum": "2022",
    "standardUnitKey": "H22-GE-05",
    "standardUnit": "벡터의 연산",
    "standardUnitOrder": 5,
    "subUnitKey": "H22-GE-05-VECTOR_COMPONENT",
    "subUnit": "벡터의 성분",
    "subUnitConfidence": "candidate_evidence",
    "subUnitClassificationDepth": "complete_candidate",
    "conceptClusterKey": "H22_GE_05_VECTOR_COMPONENT",
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "벡터의 성분"
    ],
    "wide": false,
    "content": "영벡터가 아닌 두 벡터 $\\vec{a}, \\vec{b}$에 대하여 세 위치벡터가 $\\vec{\\text{OA}}=2\\vec{a}+4\\vec{b}$, $\\vec{\\text{OB}}=\\vec{a}+5\\vec{b}$, $\\vec{\\text{OC}}=4\\vec{a}+m\\vec{b}$일 때, $\\vec{\\text{AB}}$와 $\\vec{\\text{AC}}$가 서로 평행하도록 하는 실수 $m$의 값은? (단, 두 벡터 $\\vec{a}, \\vec{b}$는 서로 평행하지 않다.)",
    "choices": [
      "1",
      "2",
      "3",
      "4",
      "5"
    ],
    "answer": "②",
    "solution": "벡터 $\\vec{\\text{AB}}$ 계산하기: $\\vec{\\text{AB}} = \\vec{\\text{OB}} - \\vec{\\text{OA}} = (\\vec{a}+5\\vec{b}) - (2\\vec{a}+4\\vec{b}) = (1-2)\\vec{a} + (5-4)\\vec{b} = -\\vec{a} + \\vec{b}$이다.\n벡터 $\\vec{\\text{AC}}$ 계산하기: $\\vec{\\text{AC}} = \\vec{\\text{OC}} - \\vec{\\text{OA}} = (4\\vec{a}+m\\vec{b}) - (2\\vec{a}+4\\vec{b}) = (4-2)\\vec{a} + (m-4)\\vec{b} = 2\\vec{a} + (m-4)\\vec{b}$이다.\n평행 조건 식 세우기: 두 벡터가 서로 평행하므로 0이 아닌 실수 $k$에 대하여 $\\vec{\\text{AC}} = k\\vec{\\text{AB}}$가 성립한다.\n계수 비교 방정식 세우기: $2\\vec{a} + (m-4)\\vec{b} = k(-\\vec{a} + \\vec{b}) = -k\\vec{a} + k\\vec{b}$이다.\n실수 $k$와 $m$ 구하기: 두 벡터 $\\vec{a}, \\vec{b}$가 서로 평행하지 않으므로\n(i) $\\vec{a}$의 계수: $2 = -k \\implies k = -2$\n(ii) $\\vec{b}$의 계수: $m - 4 = k = -2 \\implies m = -2 + 4 = 2$이다.\n검산: $m=2$이면 $\\vec{\\text{AC}} = 2\\vec{a}-2\\vec{b} = -2(-\\vec{a}+\\vec{b}) = -2\\vec{\\text{AB}}$로 평행 조건이 만족된다.\n따라서 정답은 ②이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-GEO-RPM-069",
    "problemTypeKey": "PT_GEO_PLANE_VECTOR",
    "templateKey": "TPL_GEO_PLANE_VECTOR_PARAMETER",
    "crossConceptKeys": [
      "CC_PLANE_VECTOR"
    ],
    "conditionKeys": [
      "COND_NONZERO"
    ],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 6,
    "category": "벡터의 성분",
    "standardCourse": "기하",
    "curriculum": "2022",
    "standardUnitKey": "H22-GE-05",
    "standardUnit": "벡터의 연산",
    "standardUnitOrder": 5,
    "subUnitKey": "H22-GE-05-VECTOR_COMPONENT",
    "subUnit": "벡터의 성분",
    "subUnitConfidence": "candidate_evidence",
    "subUnitClassificationDepth": "complete_candidate",
    "conceptClusterKey": "H22_GE_05_VECTOR_COMPONENT",
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "벡터의 성분"
    ],
    "wide": false,
    "content": "서로 평행하지 않고 영벡터가 아닌 두 벡터 $\\vec{a}, \\vec{b}$에 대하여 다음 조건을 만족하는 실수 $k, l$에 대하여 $kl$의 값은?\n(가) $2\\vec{a}+\\vec{b}$와 $k\\vec{a}-2\\vec{b}$가 서로 평행하다.\n(나) $2\\vec{a}+\\vec{b}$와 $(k+3)\\vec{a}+l\\vec{b}$가 서로 평행하다.",
    "choices": [
      "0",
      "1",
      "2",
      "3",
      "4"
    ],
    "answer": "③",
    "solution": "조건 (가)의 평행 조건 식 세우기: 두 벡터가 서로 평행하므로 실수 $m$에 대하여 $k\\vec{a}-2\\vec{b} = m(2\\vec{a}+\\vec{b})$가 성립한다.\n계수 비교로 $k$ 구하기: $\\vec{a}, \\vec{b}$가 평행하지 않으므로 $k = 2m$, $-2 = m$이다. 따라서 $m = -2$이고 $k = 2(-2) = -4$이다.\n$k$의 값을 조건 (나)에 대입: $k = -4$를 대입하면 $(k+3)\\vec{a}+l\\vec{b} = (-4+3)\\vec{a}+l\\vec{b} = -\\vec{a}+l\\vec{b}$이다.\n조건 (나)의 평행 조건 식 세우기: $2\\vec{a}+\\vec{b}$와 $-\\vec{a}+l\\vec{b}$가 서로 평행하므로 실수 $n$에 대하여 $-\\vec{a}+l\\vec{b} = n(2\\vec{a}+\\vec{b}) = 2n\\vec{a}+n\\vec{b}$이다.\n계수 비교로 $l$ 구하기:\n(i) $\\vec{a}$의 계수: $-1 = 2n \\implies n = -\\frac{1}{2}$\n(ii) $\\vec{b}$의 계수: $l = n = -\\frac{1}{2}$이다.\n$kl$의 값 계산하기: $kl = (-4) \\times \\left(-\\frac{1}{2}\\right) = 2$이다.\n주의: $k=-4$일 때 $k\\vec{a}-2\\vec{b} = -4\\vec{a}-2\\vec{b} \\neq \\vec{0}$, $(k+3)\\vec{a}+l\\vec{b} = -\\vec{a}-\\frac{1}{2}\\vec{b} \\neq \\vec{0}$이므로 영벡터가 아니라는 조건을 모두 만족한다.\n따라서 정답은 ③이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-GEO-RPM-069",
    "problemTypeKey": "PT_GEO_PLANE_VECTOR",
    "templateKey": "TPL_GEO_PLANE_VECTOR_PARAMETER",
    "crossConceptKeys": [],
    "conditionKeys": [
      "COND_NONZERO"
    ],
    "integrationPattern": "INTERDEPENDENT"
  }
];
