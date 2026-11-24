window.examTitle = "기하_102_세직선이한직선위에있을조건_고2_유형은행1";

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
    "content": "두 실수 $a, b$에 대하여 $\\vec{OP} = 3a\\,\\vec{OQ} + 4b\\,\\vec{OR}$를 만족하는 서로 다른 세 점 $\\mathrm{P, Q, R}$가 한 직선 위에 있을 때, $a, b$ 사이의 관계식으로 옳은 것은? (단, $\\mathrm{O}$는 원점이고 세 점 $\\mathrm{O, Q, R}$는 한 직선 위에 있지 않다.)",
    "choices": [
      "$4a + 3b = 1$",
      "$\\frac{a}{3} + \\frac{b}{4} = 1$",
      "$\\frac{a}{4} + \\frac{b}{3} = 1$",
      "$a + b = 1$",
      "$3a + 4b = 1$"
    ],
    "answer": "⑤",
    "solution": "세 점이 한 직선 위에 있을 조건: 일직선 위에 있지 않은 세 점 $\\mathrm{O, Q, R}$에 대하여 서로 다른 세 점 $\\mathrm{P, Q, R}$가 한 직선 위에 있기 위한 필요충분조건은 $\\vec{OP} = s\\vec{OQ} + t\\vec{OR}$에서 $s + t = 1$ (단, $s, t$는 실수)이다.\n계수 파악: 주어진 등식 $\\vec{OP} = 3a\\,\\vec{OQ} + 4b\\,\\vec{OR}$에서 $\\vec{OQ}$와 $\u000bec{OR}$의 계수는 각각 $3a$와 $4b$이다.\n조건식 적용: 두 계수의 합이 $1$이어야 하므로 $3a + 4b = 1$이다.\n역산 검증: $4b = 1 - 3a$를 대입하면 $\\vec{OP} = 3a\\,\\vec{OQ} + (1 - 3a)\\vec{OR} \\iff \\vec{OP} - \\vec{OR} = 3a(\\vec{OQ} - \\vec{OR}) \\iff \\vec{RP} = 3a\\,\\vec{RQ}$가 성립하여 두 벡터 $\\vec{RP}$와 $\\vec{RQ}$가 평행하므로 세 점 $\\mathrm{P, Q, R}$는 한 직선 위에 있다.\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-GEO-RPM-069",
    "problemTypeKey": "PT_GEO_PLANE_VECTOR",
    "templateKey": "TPL_GEO_VECTOR_BASIC_OPERATION",
    "crossConceptKeys": [
      "CC_PLANE_VECTOR"
    ],
    "conditionKeys": [
      "COND_NO_THREE_COLLINEAR_POINTS"
    ],
    "integrationPattern": "NONE"
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
    "content": "평면 위의 서로 다른 네 점 $\\mathrm{O, A, B, C}$에 대하여\n$$\\vec{OA} = k\\vec{a},\\quad \\vec{OB} = -2\\vec{b},\\quad \\vec{OC} = 3\\vec{a} - 5\\vec{b}$$\n일 때, 세 점 $\\mathrm{A, B, C}$가 한 직선 위에 있도록 하는 실수 $k$의 값은? (단, $\\vec{a}, \\vec{b}$는 서로 평행하지 않고 영벡터가 아니다.)",
    "choices": [
      "-4",
      "-3",
      "-2",
      "-1",
      "1"
    ],
    "answer": "③",
    "solution": "벡터의 뺄셈으로 $\\vec{AB}$ 계산: $\\vec{AB} = \\vec{OB} - \\vec{OA} = -2\\vec{b} - k\\vec{a} = -k\\vec{a} - 2\\vec{b}$\n벡터의 뺄셈으로 $\\vec{AC}$ 계산: $\\vec{AC} = \\vec{OC} - \\vec{OA} = (3\\vec{a} - 5\\vec{b}) - k\\vec{a} = (3 - k)\\vec{a} - 5\\vec{b}$\n세 점이 한 직선 위에 있을 조건: 세 점 $\\mathrm{A, B, C}$가 한 직선 위에 있으므로 $\\vec{AC} = m\\vec{AB}$를 만족하는 $0$이 아닌 실수 $m$이 존재한다.\n등식 대입: $(3 - k)\\vec{a} - 5\\vec{b} = m(-k\\vec{a} - 2\\vec{b}) = -km\\vec{a} - 2m\\vec{b}$\n벡터의 상등 적용: $\\vec{a}, \\vec{b}$가 서로 평행하지 않으므로 $-5 = -2m \\implies m = \\frac{5}{2}$\n$k$의 값 구하기: $3 - k = -km = -\\frac{5}{2}k \\implies 3 = -\\frac{5}{2}k + k = -\\frac{3}{2}k \\implies k = 3 \\times \\left(-\\frac{2}{3}\\right) = -2$\n역산 검증: $\\vec{OC} = (1 - t)\\vec{OA} + t\\vec{OB}$로 놓으면 $3\\vec{a} - 5\\vec{b} = (1 - t)k\\vec{a} - 2t\\vec{b}$에서 $-2t = -5 \\implies t = \\frac{5}{2}$이고, $(1 - \\frac{5}{2})k = 3 \\implies -\\frac{3}{2}k = 3 \\implies k = -2$로 일치한다.\n따라서 정답은 ③이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-GEO-RPM-069",
    "problemTypeKey": "PT_GEO_PLANE_VECTOR",
    "templateKey": "TPL_GEO_VECTOR_BASIC_OPERATION",
    "crossConceptKeys": [
      "CC_PLANE_VECTOR"
    ],
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
    "content": "서로 다른 세 점 $\\mathrm{A, B, C}$가 한 직선 위에 있고\n$$\\vec{OA} = \\vec{a},\\quad \\vec{OB} = \\vec{b},\\quad \\vec{OC} = m\\vec{a} + n\\vec{b}$$\n일 때, $2m^2 + n^2$의 최솟값은? (단, $\\vec{a}, \\vec{b}$는 서로 평행하지 않고 영벡터가 아니며, $m, n$은 실수이다.)",
    "choices": [
      "$\\frac{1}{3}$",
      "$\\frac{1}{2}$",
      "$\\frac{2}{3}$",
      "$\\frac{3}{4}$",
      "1"
    ],
    "answer": "③",
    "solution": "세 점이 한 직선 위에 있을 조건: 서로 다른 세 점 $\\mathrm{A, B, C}$가 한 직선 위에 있고 $\\vec{OC} = m\\vec{OA} + n\\vec{OB}$이므로 계수의 합은 $m + n = 1$이다.\n한 문자로 치환: $n = 1 - m$을 구하려는 식 $2m^2 + n^2$에 대입한다.\n식 전개 및 정리: $2m^2 + n^2 = 2m^2 + (1 - m)^2 = 2m^2 + (m^2 - 2m + 1) = 3m^2 - 2m + 1$\n완전제곱식 변형: $3m^2 - 2m + 1 = 3\\left(m^2 - \\frac{2}{3}m\\right) + 1 = 3\\left(m - \\frac{1}{3}\\right)^2 - 3 \\times \\frac{1}{9} + 1 = 3\\left(m - \\frac{1}{3}\\right)^2 + \\frac{2}{3}$\n최솟값 도출: 실수 $m$에 대하여 $\\left(m - \\frac{1}{3}\\right)^2 \\ge 0$이므로, $m = \\frac{1}{3}$일 때 $2m^2 + n^2$의 최솟값은 $\\frac{2}{3}$이다.\n역산 검증: 코시-슈바르츠 부등식 $\\left(\\frac{1}{2} + 1\\right)(2m^2 + n^2) \\ge (m + n)^2 = 1^2 = 1$에서 $\\frac{3}{2}(2m^2 + n^2) \\ge 1 \\implies 2m^2 + n^2 \\ge \\frac{2}{3}$이 성립한다.\n따라서 정답은 ③이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-GEO-RPM-069",
    "problemTypeKey": "PT_GEO_PLANE_VECTOR",
    "templateKey": "TPL_GEO_VECTOR_BASIC_OPERATION",
    "crossConceptKeys": [
      "CC_PLANE_VECTOR"
    ],
    "conditionKeys": [
      "COND_NONZERO"
    ],
    "integrationPattern": "INTERDEPENDENT"
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
    "content": "영벡터가 아닌 두 벡터 $\\vec{a}, \\vec{b}$가 서로 평행하지 않고, 평면 위의 서로 다른 네 점 $\\mathrm{O, A, B, C}$에 대하여\n$$\\vec{OA} = 4\\vec{a} + \\vec{b},\\quad \\vec{OB} = \\vec{a} + 2\\vec{b},\\quad \\vec{OC} = -2\\vec{a} + k\\vec{b}$$\n일 때, 세 점 $\\mathrm{A, B, C}$가 한 직선 위에 있도록 하는 실수 $k$의 값은?",
    "choices": [
      "3",
      "4",
      "5",
      "6",
      "7"
    ],
    "answer": "①",
    "solution": "벡터의 뺄셈으로 $\\vec{AB}$ 계산: $\\vec{AB} = \\vec{OB} - \\vec{OA} = (\\vec{a} + 2\\vec{b}) - (4\\vec{a} + \\vec{b}) = -3\\vec{a} + \\vec{b}$\n벡터의 뺄셈으로 $\\vec{AC}$ 계산: $\\vec{AC} = \\vec{OC} - \\vec{OA} = (-2\\vec{a} + k\\vec{b}) - (4\\vec{a} + \\vec{b}) = -6\\vec{a} + (k - 1)\\vec{b}$\n세 점이 한 직선 위에 있을 조건(평행 조건): 세 점 $\\mathrm{A, B, C}$가 한 직선 위에 있으므로 $\\vec{AC} = m\\vec{AB}$인 실수 $m$이 존재한다.\n등식 대입: $-6\\vec{a} + (k - 1)\\vec{b} = m(-3\\vec{a} + \\vec{b}) = -3m\\vec{a} + m\\vec{b}$\n벡터의 상등 적용: $\\vec{a}, \\vec{b}$가 서로 평행하지 않으므로 $-3m = -6 \\implies m = 2$\n$k$의 값 구하기: $k - 1 = m = 2 \\implies k = 3$\n역산 검증: $\\vec{OC} = (1 - t)\\vec{OA} + t\\vec{OB}$로 두면 $-2\\vec{a} + k\\vec{b} = (4 - 3t)\\vec{a} + (1 + t)\\vec{b}$이므로 $4 - 3t = -2 \\implies 3t = 6 \\implies t = 2$, $k = 1 + 2 = 3$으로 일치한다.\n따라서 정답은 ①이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-GEO-RPM-069",
    "problemTypeKey": "PT_GEO_PLANE_VECTOR",
    "templateKey": "TPL_GEO_VECTOR_BASIC_OPERATION",
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
    "content": "평면 위의 서로 다른 네 점 $\\mathrm{O, A, B, C}$에 대하여\n$$\\vec{OA} = \\vec{a} + 2\\vec{b},\\quad \\vec{OB} = 3\\vec{a} + 5\\vec{b},\\quad \\vec{OC} = 7\\vec{a} + k\\vec{b}$$\n일 때, 세 점 $\\mathrm{A, B, C}$가 한 직선 위에 있도록 하는 실수 $k$의 값은? (단, $\\vec{a}, \\vec{b}$는 서로 평행하지 않고, 영벡터가 아니다.)",
    "choices": [
      "7",
      "9",
      "11",
      "13",
      "15"
    ],
    "answer": "③",
    "solution": "벡터의 뺄셈으로 $\\vec{AB}$ 계산: $\\vec{AB} = \\vec{OB} - \\vec{OA} = (3\\vec{a} + 5\\vec{b}) - (\\vec{a} + 2\\vec{b}) = 2\\vec{a} + 3\\vec{b}$\n벡터의 뺄셈으로 $\\vec{AC}$ 계산: $\\vec{AC} = \\vec{OC} - \\vec{OA} = (7\\vec{a} + k\\vec{b}) - (\\vec{a} + 2\\vec{b}) = 6\\vec{a} + (k - 2)\\vec{b}$\n세 점이 한 직선 위에 있을 조건(평행 조건): 세 점 $\\mathrm{A, B, C}$가 한 직선 위에 있으므로 $\\vec{AC} = t\\vec{AB}$를 만족하는 실수 $t$가 존재한다.\n등식 대입: $6\\vec{a} + (k - 2)\\vec{b} = t(2\\vec{a} + 3\\vec{b}) = 2t\\vec{a} + 3t\\vec{b}$\n벡터의 상등 적용: $\\vec{a}, \\vec{b}$가 서로 평행하지 않으므로 $2t = 6 \\implies t = 3$\n$k$의 값 구하기: $k - 2 = 3t = 3 \\times 3 = 9 \\implies k = 11$\n역산 검증: $\\vec{OC} = (1 - s)\\vec{OA} + s\\vec{OB}$로 두면 $7\\vec{a} + k\\vec{b} = (1 + 2s)\\vec{a} + (2 + 3s)\\vec{b}$에서 $1 + 2s = 7 \\implies s = 3$, $k = 2 + 3(3) = 11$로 일치한다.\n따라서 정답은 ③이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-GEO-RPM-069",
    "problemTypeKey": "PT_GEO_PLANE_VECTOR",
    "templateKey": "TPL_GEO_VECTOR_BASIC_OPERATION",
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
    "content": "평행사변형 $\\mathrm{ABCD}$에서 변 $\\mathrm{AB}$를 $1:3$으로 내분하는 점을 $\\mathrm{P}$, 대각선 $\\mathrm{BD}$를 $m:1$로 내분하는 점을 $\\mathrm{Q}$라 하자. 이때 세 점 $\\mathrm{P, Q, C}$가 한 직선 위에 있도록 하는 양수 $m$의 값은? [그림: 평행사변형 $\\mathrm{ABCD}$에서 변 $\\mathrm{AB}$를 $1:3$으로 내분하는 점을 $\\mathrm{P}$, 대각선 $\\mathrm{BD}$ 위의 점을 $\\mathrm{Q}$라 할 때 선분 $\\mathrm{PC}$와 대각선 $\\mathrm{BD}$가 점 $\\mathrm{Q}$에서 만나고 $\\mathrm{BQ}:\\mathrm{QD} = m:1$이다.]",
    "choices": [
      "$\\frac{1}{4}$",
      "$\\frac{1}{2}$",
      "$\\frac{2}{3}$",
      "$\\frac{3}{4}$",
      "$\\frac{4}{5}$"
    ],
    "answer": "④",
    "solution": "기준 벡터 설정: $\\vec{BA} = \\vec{a}$, $\\vec{BC} = \\vec{c}$라 두면 평행사변형의 대각선 벡터는 $\\vec{BD} = \\vec{a} + \\vec{c}$이다.\n점 $\\mathrm{P}$의 위치벡터 표현: 점 $\\mathrm{P}$가 선분 $\\mathrm{AB}$를 $1:3$으로 내분하므로 $\\vec{BP} = \\frac{3}{4}\\vec{BA} = \\frac{3}{4}\\vec{a}$이다.\n점 $\\mathrm{Q}$의 위치벡터 표현: 점 $\\mathrm{Q}$는 대각선 $\\mathrm{BD}$를 $m:1$로 내분하므로 내분점 공식에 의해 $\\vec{BQ} = \\frac{m}{m + 1}\\vec{BD} = \\frac{m}{m + 1}(\\vec{a} + \\vec{c}) = \\frac{m}{m + 1}\\vec{a} + \\frac{m}{m + 1}\\vec{c}$이다.\n세 점이 한 직선 위에 있을 조건: 세 점 $\\mathrm{P, Q, C}$가 한 직선 위에 있으므로 점 $\\mathrm{Q}$는 선분 $\\mathrm{PC}$를 내분하는 점이 되어 $\\vec{BQ} = (1 - t)\\vec{BP} + t\\vec{BC}$ ($0 < t < 1$)로 표현된다.\n식 전개: $\\vec{BQ} = (1 - t)\\left(\\frac{3}{4}\\vec{a}\\right) + t\\vec{c} = \\frac{3(1 - t)}{4}\\vec{a} + t\\vec{c}$\n계수 비교: $\\vec{a}, \\vec{c}$는 평행하지 않으므로 $\\frac{m}{m + 1} = \\frac{3(1 - t)}{4}$이고 $\\frac{m}{m + 1} = t$이다.\n$t$의 값 계산: $\\frac{3(1 - t)}{4} = t \\implies 3 - 3t = 4t \\implies 7t = 3 \\implies t = \\frac{3}{7}$\n$m$의 값 구하기: $\\frac{m}{m + 1} = \\frac{3}{7} \\implies 7m = 3(m + 1) = 3m + 3 \\implies 4m = 3 \\implies m = \\frac{3}{4}$\n도형의 닮음으로 역산 검증: $\\triangle \\mathrm{PBQ} \\sim \\triangle \\mathrm{CDQ}$이고 $\\overline{\\mathrm{PB}} = \\frac{3}{4}\\overline{\\mathrm{AB}} = \\frac{3}{4}\\overline{\\mathrm{CD}}$이므로 닮음비는 $\\overline{\\mathrm{BQ}} : \\overline{\\mathrm{QD}} = \\overline{\\mathrm{PB}} : \\overline{\\mathrm{CD}} = \\frac{3}{4} : 1 = 3 : 4$에서 $m = \\frac{3}{4}$으로 일치한다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-GEO-RPM-069",
    "problemTypeKey": "PT_GEO_PLANE_VECTOR",
    "templateKey": "TPL_GEO_VECTOR_BASIC_OPERATION",
    "crossConceptKeys": [
      "CC_INTERNAL_DIVISION",
      "CC_PARALLELOGRAM_PROPERTIES",
      "CC_PARALLEL_LINES"
    ],
    "conditionKeys": [
      "COND_POSITIVE"
    ],
    "integrationPattern": "SEQUENTIAL"
  }
];
