window.examTitle = "기하_047_쌍곡선의정의의활용-초점이주어진경우_고2_유형은행1";

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
    "content": "그림과 같이 쌍곡선 $\\frac{x^2}{16} - \\frac{y^2}{9} = 1$의 두 초점을 $F, F'$이라 하자. 제1사분면에 있는 쌍곡선 위의 점 $P$와 제3사분면에 있는 쌍곡선 위의 점 $Q$에 대하여 선분 $PQ$가 원점을 지난다. $PF = 3$일 때, 사각형 $PF'QF$의 둘레의 길이는? (단, 점 $F$의 $x$좌표는 양수이다.)\n[그림: 쌍곡선 $\\frac{x^2}{16} - \\frac{y^2}{9} = 1$, 두 초점 $F, F'$, 제1사분면의 점 $P$, 제3사분면의 점 $Q$, 선분 $PQ$가 원점 $O$를 지나고 네 점 $P, F', Q, F$를 연결한 평행사변형 $PF'QF$]",
    "choices": [
      "$24$",
      "$28$",
      "$32$",
      "$36$",
      "$40$"
    ],
    "answer": "②",
    "solution": "주축의 길이 구하기: 쌍곡선 $\\frac{x^2}{16} - \\frac{y^2}{9} = 1$에서 $a^2 = 16$이므로 $a = 4$이고, 주축의 길이는 $2a = 8$이다.\n쌍곡선의 정의 적용 ($P$): 점 $P$는 제1사분면(오른쪽 가지) 위의 점이므로 $PF' - PF = 2a = 8$이다.\n선분 $PF'$의 길이 계산: $PF = 3$이므로 $PF' = PF + 8 = 3 + 8 = 11$이다.\n원점 대칭성 활용: 선분 $PQ$가 원점을 지나므로 점 $Q$는 점 $P$의 원점 대칭점이다. 따라서 $QF = PF' = 11$, $QF' = PF = 3$이다.\n사각형의 둘레 계산: 사각형 $PF'QF$의 둘레의 길이는 $PF + PF' + QF + QF' = 3 + 11 + 11 + 3 = 28$이다.\n따라서 정답은 ②이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-GEO-RPM-043",
    "problemTypeKey": "PT_GEO_HYPERBOLA",
    "templateKey": "TPL_GEO_HYPERBOLA_FOCAL_DIFF",
    "crossConceptKeys": [
      "CC_REFLECTION",
      "CC_PARALLELOGRAM_PROPERTIES"
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
    "content": "그림과 같이 쌍곡선 $\\frac{x^2}{16} - \\frac{y^2}{9} = 1$의 두 초점을 각각 $F, F'$이라 하자. 제1사분면에 있는 쌍곡선 위의 점 $P$와 제3사분면에 있는 쌍곡선 위의 점 $Q$에 대하여 $QF - PF = 5$일 때, $PF' - QF'$의 값은? (단, 점 $F$의 $x$좌표는 양수이다.)\n[그림: 쌍곡선 $\\frac{x^2}{16} - \\frac{y^2}{9} = 1$과 두 초점 $F(5, 0), F'(-5, 0)$, 제1사분면의 점 $P$, 제3사분면의 점 $Q$, 초점들과 점 $P, Q$를 잇는 선분들]",
    "choices": [
      "$7$",
      "$9$",
      "$11$",
      "$13$",
      "$15$"
    ],
    "answer": "③",
    "solution": "주축의 길이 구하기: 쌍곡선 $\\frac{x^2}{16} - \\frac{y^2}{9} = 1$에서 $a^2 = 16$이므로 $a = 4$이고 주축의 길이는 $2a = 8$이다.\n쌍곡선의 정의 적용 ($P$): 점 $P$는 오른쪽 가지 위의 점이므로 $PF' - PF = 2a = 8$이다.\n쌍곡선의 정의 적용 ($Q$): 점 $Q$는 왼쪽 가지 위의 점이므로 $QF - QF' = 2a = 8$이다.\n두 정의식 변끼리 더하기: $(PF' - PF) + (QF - QF') = 8 + 8 = 16$이다.\n식의 재배열: 덧셈의 교환법칙에 의해 $(PF' - QF') + (QF - PF) = 16$이다.\n조건값 대입 및 계산: $QF - PF = 5$이므로 $(PF' - QF') + 5 = 16$, 즉 $PF' - QF' = 16 - 5 = 11$이다.\n따라서 정답은 ③이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-GEO-RPM-043",
    "problemTypeKey": "PT_GEO_HYPERBOLA",
    "templateKey": "TPL_GEO_HYPERBOLA_FOCAL_DIFF",
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
    "content": "쌍곡선 $\\frac{x^2}{25} - \\frac{y^2}{11} = 1$의 제1사분면 위의 점 $P$와 두 초점 $F(c, 0), F'(-c, 0)$ ($c > 0$)에 대하여 삼각형 $PF'F$의 둘레의 길이가 $32$일 때, 선분 $PF$의 길이는?",
    "choices": [
      "$5$",
      "$7$",
      "$9$",
      "$11$",
      "$13$"
    ],
    "answer": "①",
    "solution": "초점의 좌표 및 거리 구하기: $a^2 = 25, b^2 = 11$에서 $c^2 = a^2 + b^2 = 25 + 11 = 36$이므로 $c = 6$이다. 따라서 선분 $F'F$의 길이는 $2c = 12$이다.\n삼각형 둘레의 조건 정리: 삼각형 $PF'F$의 둘레는 $PF' + PF + F'F = 32$이므로 $PF' + PF + 12 = 32$에서 $PF' + PF = 20$이다.\n쌍곡선의 정의 적용: 점 $P$는 제1사분면(오른쪽 가지) 위의 점이므로 $PF' - PF = 2a = 2 \\times 5 = 10$이다.\n연립방정식 풀이: $PF' + PF = 20$에서 $PF' - PF = 10$을 변끼리 빼면 $2PF = 10$이다.\n선분 $PF$의 길이 계산: 양변을 $2$로 나누면 $PF = 5$이다.\n따라서 정답은 ①이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-GEO-RPM-043",
    "problemTypeKey": "PT_GEO_HYPERBOLA",
    "templateKey": "TPL_GEO_HYPERBOLA_FOCAL_DIFF",
    "crossConceptKeys": [],
    "conditionKeys": [
      "COND_POSITIVE"
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
    "content": "쌍곡선 $\\frac{x^2}{20} - \\frac{y^2}{16} = -1$의 두 초점 $F, F'$과 쌍곡선 위의 한 점 $P$에 대하여 삼각형 $PF'F$의 둘레의 길이가 $28$일 때, $PF \\times PF'$의 값은?",
    "choices": [
      "$40$",
      "$44$",
      "$48$",
      "$52$",
      "$56$"
    ],
    "answer": "③",
    "solution": "초점 사이의 거리 구하기: 우변이 $-1$이므로 초점은 $y$축 위에 있다. $c^2 = a^2 + b^2 = 20 + 16 = 36$에서 $c = 6$이므로 초점 사이의 거리는 $F'F = 2c = 12$이다.\n거리의 합 도출: 삼각형의 둘레가 $28$이므로 $PF + PF' + F'F = 28$에서 $PF + PF' + 12 = 28$, 즉 $PF + PF' = 16$이다.\n쌍곡선의 정의 적용: 주축이 $y$축 위에 있으므로 거리의 차는 $2b = 2 \\times 4 = 8$이다. 즉 $|PF - PF'| = 8$이다.\n곱셈 공식 변형 적용: $(PF + PF')^2 - (PF - PF')^2 = 4(PF \\times PF')$이다.\n값 대입 및 정리: $16^2 - 8^2 = 256 - 64 = 192$이므로 $4(PF \\times PF') = 192$이다.\n곱의 계산: 양변을 $4$로 나누면 $PF \\times PF' = \\frac{192}{4} = 48$이다.\n따라서 정답은 ③이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-GEO-RPM-043",
    "problemTypeKey": "PT_GEO_HYPERBOLA",
    "templateKey": "TPL_GEO_HYPERBOLA_FOCAL_DIFF",
    "crossConceptKeys": [],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
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
    "content": "그림과 같이 쌍곡선 $\\frac{x^2}{a^2} - \\frac{y^2}{b^2} = 1$의 두 초점 중 $x$좌표가 양수인 점을 $F$, 음수인 점을 $F'$이라 하자. 제1사분면에 있는 쌍곡선 위의 점 $P$에 대하여 직선 $PF$가 이 쌍곡선과 제4사분면에서 만나는 점을 $Q$라 하자. $PQ = F'Q$이고 $PF' + 2PF = 24$일 때, 양수 $a$의 값은? (단, 점 $F$의 $x$좌표는 점 $F'$의 $x$좌표보다 크다.)\n[그림: 쌍곡선 $\\frac{x^2}{a^2} - \\frac{y^2}{b^2} = 1$과 두 초점 $F, F'$. 제1사분면의 점 $P$, 제4사분면의 점 $Q$, 선분 $PQ$가 점 $F$를 지나고 선분 $F'Q, F'P$가 연결된 도형]",
    "choices": [
      "$1$",
      "$2$",
      "$3$",
      "$4$",
      "$5$"
    ],
    "answer": "③",
    "solution": "선분 $PQ$의 분할: 점 $F$가 선분 $PQ$ 위에 위치하므로 $PQ = PF + FQ$이다.\n쌍곡선의 정의 적용 ($Q$): 점 $Q$는 오른쪽 가지 위의 점이므로 $QF' - QF = 2a$, 즉 $QF' = QF + 2a$이다.\n조건 $PQ = F'Q$ 적용: $PF + FQ = QF + 2a$의 양변에서 $FQ$를 빼면 $PF = 2a$이다.\n쌍곡선의 정의 적용 ($P$): 점 $P$도 오른쪽 가지 위의 점이므로 $PF' - PF = 2a$에서 $PF' = PF + 2a = 2a + 2a = 4a$이다.\n조건식 대입: $PF' + 2PF = 24$에 대입하면 $4a + 2(2a) = 8a = 24$이다.\n$a$의 값 계산: 양변을 $8$로 나누면 $a = 3$이다.\n따라서 정답은 ③이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-GEO-RPM-043",
    "problemTypeKey": "PT_GEO_HYPERBOLA",
    "templateKey": "TPL_GEO_HYPERBOLA_FOCAL_DIFF",
    "crossConceptKeys": [],
    "conditionKeys": [
      "COND_POSITIVE"
    ],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 6,
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
    "content": "그림과 같이 쌍곡선 $\\frac{x^2}{36} - \\frac{y^2}{64} = 1$의 두 초점 $F, F'$과 쌍곡선의 제1사분면 위의 점 $P$에 대하여 $PF' : PF = 5 : 2$이다. 삼각형 $PF'F$의 둘레의 길이는?\n[그림: 쌍곡선 $\\frac{x^2}{36} - \\frac{y^2}{64} = 1$, 두 초점 $F(10, 0), F'(-10, 0)$, 제1사분면의 점 $P$, 삼각형 $PF'F$]",
    "choices": [
      "$42$",
      "$44$",
      "$46$",
      "$48$",
      "$50$"
    ],
    "answer": "④",
    "solution": "주축 및 초점 거리 계산: $a^2 = 36$에서 $a = 6$이므로 주축의 길이는 $2a = 12$이다. 또한 $c^2 = 36 + 64 = 100$에서 $c = 10$이므로 초점 사이의 거리는 $F'F = 2c = 20$이다.\n비례상수 설정: $PF' : PF = 5 : 2$이므로 $PF' = 5k, PF = 2k$ ($k > 0$)로 둘 수 있다.\n쌍곡선의 정의 적용: 점 $P$는 오른쪽 가지 위의 점이므로 $PF' - PF = 2a = 12$이다.\n비례상수 $k$ 계산: $5k - 2k = 3k = 12$에서 $k = 4$이다.\n두 초점까지의 거리 구하기: $PF' = 5 \\times 4 = 20$, $PF = 2 \\times 4 = 8$이다.\n삼각형의 둘레 계산: 삼각형 $PF'F$의 둘레의 길이는 $PF' + PF + F'F = 20 + 8 + 20 = 48$이다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-GEO-RPM-043",
    "problemTypeKey": "PT_GEO_HYPERBOLA",
    "templateKey": "TPL_GEO_HYPERBOLA_FOCAL_DIFF",
    "crossConceptKeys": [],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 7,
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
    "content": "그림과 같이 두 초점이 $F, F'$인 쌍곡선 $\\frac{x^2}{7} - \\frac{y^2}{9} = 1$ 위의 점 $P$(제1사분면)를 원점에 대하여 대칭이동시킨 점을 $Q$라 하자. 사각형 $PF'QF$가 직사각형일 때, 이 직사각형의 둘레의 길이는? (단, 점 $F$의 $x$좌표는 양수이다.)\n[그림: 쌍곡선 $\\frac{x^2}{7} - \\frac{y^2}{9} = 1$, 두 초점 $F, F'$, 제1사분면의 점 $P$, 원점 대칭점 $Q$, 네 꼭짓점으로 이루어진 직사각형 $PF'QF$]",
    "choices": [
      "$14$",
      "$16$",
      "$18$",
      "$20$",
      "$22$"
    ],
    "answer": "④",
    "solution": "초점 및 주축의 길이 구하기: $a^2 = 7, b^2 = 9$에서 $c^2 = 7 + 9 = 16$이므로 $c = 4$이고 $F'F = 2c = 8$이다. 또한 주축의 길이는 $2a = 2\\sqrt{7}$이다.\n직사각형의 성질 및 피타고라스 정리: 사각형 $PF'QF$가 직사각형이므로 $\\angle FPF' = 90^\\circ$이다. 직각삼각형 $PF'F$에서 $PF^2 + PF'^2 = F'F^2 = 8^2 = 64$이다.\n쌍곡선의 정의 적용: 점 $P$는 오른쪽 가지 위의 점이므로 $PF' - PF = 2a = 2\\sqrt{7}$이다.\n곱셈 공식 변형 적용: $(PF' + PF)^2 = 2(PF^2 + PF'^2) - (PF' - PF)^2$이다.\n거리의 합 계산: $(PF' + PF)^2 = 2(64) - (2\\sqrt{7})^2 = 128 - 28 = 100$에서 $PF' + PF = 10$이다.\n직사각형의 둘레 계산: 직사각형의 둘레의 길이는 $2(PF' + PF) = 2 \\times 10 = 20$이다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-GEO-RPM-043",
    "problemTypeKey": "PT_GEO_HYPERBOLA",
    "templateKey": "TPL_GEO_HYPERBOLA_FOCAL_DIFF",
    "crossConceptKeys": [
      "CC_REFLECTION",
      "CC_RECTANGLE_PROPERTIES"
    ],
    "conditionKeys": [
      "COND_POSITIVE"
    ],
    "integrationPattern": "INTERDEPENDENT"
  },
  {
    "id": 8,
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
    "content": "그림과 같이 쌍곡선 $\\frac{x^2}{25} - \\frac{y^2}{39} = 1$ 위의 점 $P$와 두 초점 $F, F'$에 대하여 세 선분 $PF, F'F, PF'$의 길이는 이 순서대로 등차수열을 이룰 때, $PF^2 + PF'^2$의 값은? (단, $PF' > PF$)\n[그림: 쌍곡선 $\\frac{x^2}{25} - \\frac{y^2}{39} = 1$, 두 초점 $F(8, 0), F'(-8, 0)$, 제1사분면의 점 $P$, 삼각형 $PF'F$]",
    "choices": [
      "$542$",
      "$562$",
      "$582$",
      "$602$",
      "$622$"
    ],
    "answer": "②",
    "solution": "초점 사이의 거리 및 주축의 길이 계산: $a^2 = 25, b^2 = 39$에서 $c^2 = 25 + 39 = 64$이므로 $c = 8$, $F'F = 2c = 16$이다. 주축의 길이는 $2a = 2 \\times 5 = 10$이다.\n등차수열 조건 설정: 공차를 $d > 0$이라 하면 세 선분의 길이는 $PF = 16 - d, F'F = 16, PF' = 16 + d$이다.\n쌍곡선의 정의 적용: $PF' - PF = 2a = 10$이다.\n공차 $d$ 계산: $(16 + d) - (16 - d) = 2d = 10$에서 $d = 5$이다.\n선분의 길이 계산: $PF = 16 - 5 = 11$, $PF' = 16 + 5 = 21$이다.\n제곱의 합 계산: $PF^2 + PF'^2 = 11^2 + 21^2 = 121 + 441 = 562$이다.\n따라서 정답은 ②이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-GEO-RPM-043",
    "problemTypeKey": "PT_GEO_HYPERBOLA",
    "templateKey": "TPL_GEO_HYPERBOLA_FOCAL_DIFF",
    "crossConceptKeys": [],
    "conditionKeys": [
      "COND_INEQUALITY_CONSTRAINT"
    ],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 9,
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
    "content": "그림과 같이 쌍곡선 $\\frac{x^2}{16} - \\frac{y^2}{20} = 1$ 위의 점 $P$와 쌍곡선의 두 초점 $F, F'$에 대하여 $\\angle F'PF$의 이등분선이 $x$축과 만나는 점을 $A$라 하자. $F'A : FA = 3 : 1$일 때, $PF' \\times PF$의 값은?\n[그림: 쌍곡선 $\\frac{x^2}{16} - \\frac{y^2}{20} = 1$, 두 초점 $F(6, 0), F'(-6, 0)$, 제1사분면의 점 $P$, $\\angle F'PF$의 내각의 이등분선이 $x$축과 점 $A$에서 만나는 그림]",
    "choices": [
      "$36$",
      "$42$",
      "$48$",
      "$54$",
      "$60$"
    ],
    "answer": "③",
    "solution": "주축의 길이 구하기: 쌍곡선 $\\frac{x^2}{16} - \\frac{y^2}{20} = 1$에서 $a^2 = 16$이므로 $a = 4$이고, 주축의 길이는 $2a = 8$이다.\n삼각형의 내각의 이등분선의 성질: 선분 $PA$가 $\\angle F'PF$의 이등분선이므로 $PF' : PF = F'A : FA = 3 : 1$에서 $PF' = 3 PF$이다.\n쌍곡선의 정의 적용: 점 $P$는 오른쪽 가지 위의 점이므로 $PF' - PF = 2a = 8$이다.\n선분의 길이 도출: $3 PF - PF = 2 PF = 8$에서 $PF = 4$이고, $PF' = 3 \\times 4 = 12$이다.\n두 선분의 곱 계산: $PF' \\times PF = 12 \\times 4 = 48$이다.\n따라서 정답은 ③이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-GEO-RPM-043",
    "problemTypeKey": "PT_GEO_HYPERBOLA",
    "templateKey": "TPL_GEO_HYPERBOLA_FOCAL_DIFF",
    "crossConceptKeys": [
      "CC_ANGLE_BISECTOR_THEOREM"
    ],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 10,
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
    "content": "그림과 같이 쌍곡선 $\\frac{x^2}{11} - \\frac{y^2}{25} = -1$의 두 초점을 $F, F'$이라 하자. 제1사분면에 있는 쌍곡선 위의 점 $P$에 대하여 $\\angle F'PF$의 이등분선이 $y$축과 점 $A(0, 2)$에서 만날 때, 삼각형 $PF'F$의 둘레의 길이는?\n[그림: 상하로 열린 쌍곡선 $\\frac{x^2}{11} - \\frac{y^2}{25} = -1$, $y$축 위의 두 초점 $F(0, 6), F'(0, -6)$, 제1사분면의 점 $P$, $\\angle F'PF$의 이등분선이 $y$축의 점 $A(0, 2)$와 만나는 그림]",
    "choices": [
      "$42$",
      "$44$",
      "$46$",
      "$48$",
      "$50$"
    ],
    "answer": "①",
    "solution": "초점 좌표 및 거리 계산: 방정식의 우변이 $-1$이므로 초점은 $y$축 위에 있다. $c^2 = 11 + 25 = 36$에서 $c = 6$이므로 $F(0, 6), F'(0, -6)$이고 $F'F = 2c = 12$이다.\n주축의 길이 구하기: $b^2 = 25$에서 $b = 5$이므로 주축의 길이는 $2b = 10$이다.\n점 $A$에 의한 초점 선분의 분할: 점 $A(0, 2)$에 대하여 $FA = 6 - 2 = 4$, $F'A = 2 - (-6) = 8$이다.\n삼각형의 내각의 이등분선의 성질: $PA$가 $\\angle F'PF$의 이등분선이므로 $PF : PF' = FA : F'A = 4 : 8 = 1 : 2$, 즉 $PF' = 2 PF$이다.\n쌍곡선의 정의 적용: 점 $P$는 위쪽 가지($y>0$) 위의 점이므로 $PF' - PF = 2b = 10$이다.\n선분의 길이 계산: $2 PF - PF = PF = 10$이므로 $PF' = 20$이다.\n삼각형의 둘레 계산: 삼각형 $PF'F$의 둘레는 $PF + PF' + F'F = 10 + 20 + 12 = 42$이다.\n따라서 정답은 ①이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-GEO-RPM-043",
    "problemTypeKey": "PT_GEO_HYPERBOLA",
    "templateKey": "TPL_GEO_HYPERBOLA_FOCAL_DIFF",
    "crossConceptKeys": [
      "CC_ANGLE_BISECTOR_THEOREM"
    ],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 11,
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
    "content": "그림과 같이 두 초점이 $F(c, 0), F'(-c, 0)$ ($c > 0$)이고 주축의 길이가 $4$인 쌍곡선이 있다. 점 $F$를 지나고 $x$축에 수직인 직선이 쌍곡선과 제1사분면에서 만나는 점을 $A$, 점 $F'$을 지나고 $x$축에 수직인 직선이 쌍곡선과 제2사분면에서 만나는 점을 $B$라 하자. 사각형 $ABF'F$가 정사각형일 때, 정사각형 $ABF'F$의 대각선의 길이는?\n[그림: 쌍곡선 $\\frac{x^2}{a^2} - \\frac{y^2}{b^2} = 1$, 두 초점 $F(c, 0), F'(-c, 0)$, $x=c$ 위의 점 $A$, $x=-c$ 위의 점 $B$, 사각형 $ABF'F$가 정사각형인 그림]",
    "choices": [
      "$2 + 4\\sqrt{2}$",
      "$4 + 4\\sqrt{2}$",
      "$6 + 4\\sqrt{2}$",
      "$7 + 4\\sqrt{2}$",
      "$8 + 4\\sqrt{2}$"
    ],
    "answer": "⑤",
    "solution": "주축 및 쌍곡선 방정식 설정: 주축의 길이가 $4$이므로 $2a = 4$에서 $a = 2, a^2 = 4$이다. $b^2 = c^2 - a^2 = c^2 - 4$이므로 쌍곡선은 $\\frac{x^2}{4} - \\frac{y^2}{c^2 - 4} = 1$이다.\n정사각형 조건 분석: 밑변 $F'F = 2c$이고 선분 $FA, F'B$는 $x$축에 수직이므로 사각형 $ABF'F$가 정사각형이 되려면 높이 $FA = 2c$이어야 한다.\n점 $A$의 좌표 결정: 점 $A$는 제1사분면의 점이므로 $A(c, 2c)$이다.\n쌍곡선 방정식 대입: 점 $A(c, 2c)$를 대입하면 $\\frac{c^2}{4} - \\frac{4c^2}{c^2 - 4} = 1$이다.\n방정식 정리: $\\frac{c^2 - 4}{4} = \\frac{4c^2}{c^2 - 4}$에서 $(c^2 - 4)^2 = 16c^2 = (4c)^2$이다.\n이차방정식 도출: $c > 2$이므로 $c^2 - 4 = 4c$, 즉 $c^2 - 4c - 4 = 0$이다.\n근의 공식 적용: $c = 2 + \\sqrt{2^2 - (-4)} = 2 + 2\\sqrt{2}$이다.\n정사각형의 대각선 길이 계산: 한 변의 길이는 $2c = 4 + 4\\sqrt{2}$이므로 대각선의 길이는 $\\sqrt{2} \\times (2c) = \\sqrt{2}(4 + 4\\sqrt{2}) = 8 + 4\\sqrt{2}$이다.\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-GEO-RPM-043",
    "problemTypeKey": "PT_GEO_HYPERBOLA",
    "templateKey": "TPL_GEO_HYPERBOLA_FOCAL_DIFF",
    "crossConceptKeys": [
      "CC_SQUARE_PROPERTIES",
      "CC_PERPENDICULAR"
    ],
    "conditionKeys": [
      "COND_POSITIVE"
    ],
    "integrationPattern": "INTERDEPENDENT"
  },
  {
    "id": 12,
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
    "content": "그림과 같이 두 점 $F(c, 0), F'(-c, 0)$ ($c > 0$)을 초점으로 하는 쌍곡선 $\\frac{x^2}{a^2} - \\frac{y^2}{b^2} = 1$이 있다. 점 $F$를 지나고 $x$축에 수직인 직선이 쌍곡선과 제1사분면에서 만나는 점을 $P$라 하자. $PF' = 2 PF$일 때, $\\frac{c}{a}$의 값은? (단, $a, b$는 양수이다.)\n[그림: 쌍곡선 $\\frac{x^2}{a^2} - \\frac{y^2}{b^2} = 1$, 두 초점 $F(c, 0), F'(-c, 0)$, $x=c$ 위의 점 $P$, 직각삼각형 $PF'F$]",
    "choices": [
      "$\\frac{\\sqrt{5}}{2}$",
      "$\\frac{\\sqrt{6}}{2}$",
      "$\\frac{\\sqrt{7}}{2}$",
      "$\\sqrt{3}$",
      "$2$"
    ],
    "answer": "④",
    "solution": "쌍곡선의 정의 적용: 점 $P$는 오른쪽 가지 위의 점이므로 $PF' - PF = 2a$이다.\n조건 대입 및 선분 길이 표현: $PF' = 2 PF$를 대입하면 $2 PF - PF = 2a$에서 $PF = 2a$이고 $PF' = 4a$이다.\n피타고라스 정리 적용: 선분 $PF$가 $x$축에 수직이므로 삼각형 $PF'F$는 $\\angle PFF' = 90^\\circ$인 직각삼각형이다. 따라서 $PF'^2 = F'F^2 + PF^2$이다.\n관계식 대입: 초점 사이의 거리는 $F'F = 2c$이므로 $(4a)^2 = (2c)^2 + (2a)^2$이다.\n식 정리: $16a^2 = 4c^2 + 4a^2$에서 $4c^2 = 12a^2$, 즉 $c^2 = 3a^2$이다.\n비율 계산: $a > 0, c > 0$이므로 양변의 제곱근을 취하면 $\\frac{c}{a} = \\sqrt{3}$이다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-GEO-RPM-043",
    "problemTypeKey": "PT_GEO_HYPERBOLA",
    "templateKey": "TPL_GEO_HYPERBOLA_FOCAL_DIFF",
    "crossConceptKeys": [
      "CC_PYTHAGOREAN",
      "CC_PERPENDICULAR"
    ],
    "conditionKeys": [
      "COND_POSITIVE"
    ],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 13,
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
    "content": "그림과 같이 초점이 각각 $F(c, 0), F'(-c, 0)$인 쌍곡선 $H_1$과, 초점이 $G(0, c), G'(0, -c)$인 쌍곡선 $H_2$의 주축의 길이가 모두 $2$이다. 두 쌍곡선이 제1사분면에서 만나는 점을 $P$, 제4사분면에서 만나는 점을 $Q$라 하자. $PF + QG = 9$일 때, 사각형 $PGFQ$의 둘레의 길이는? (단, $c > 1$)\n[그림: $x$축에 초점이 있는 쌍곡선 $H_1$과 $y$축에 초점이 있는 쌍곡선 $H_2$, 1사분면의 교점 $P$, 4사분면의 교점 $Q$, 네 꼭짓점 $P, G, F, Q$로 이루어진 사각형 $PGFQ$]",
    "choices": [
      "$12$",
      "$13$",
      "$14$",
      "$15$",
      "$16$"
    ],
    "answer": "⑤",
    "solution": "대칭성에 의한 점 $Q$의 좌표 관계: 두 쌍곡선 $H_1, H_2$는 모두 $x$축 대칭이므로 제1사분면의 교점 $P(x_1, y_1)$에 대하여 제4사분면의 교점 $Q$는 $Q(x_1, -y_1)$이다. 즉 점 $Q$는 점 $P$의 $x$축 대칭점이다.\n선분의 대칭성 적용: 초점 $F(c, 0)$이 $x$축 위에 있으므로 $QF = PF$이다. 또한 $G(0, c)$와 $G'(0, -c)$가 $x$축에 대하여 대칭이므로 $QG = PG'$이다.\n쌍곡선 $H_2$의 정의 적용: 점 $P$는 $H_2$ 위의 점($y_1 > 0$)이므로 $PG' - PG = 2$이다.\n선분 $PG$의 표현: $PG' = QG$를 대입하면 $QG - PG = 2$에서 $PG = QG - 2$이다.\n사각형의 둘레 식 정리: 사각형 $PGFQ$의 둘레의 길이는 $PG + GQ + QF + FP$이다.\n식 대입 및 묶기: 둘레는 $(QG - 2) + QG + PF + PF = 2(PF + QG) - 2$이다.\n조건 대입 및 계산: $PF + QG = 9$를 대입하면 둘레의 길이는 $2 \\times 9 - 2 = 18 - 2 = 16$이다.\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B45",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-GEO-RPM-043",
    "problemTypeKey": "PT_GEO_HYPERBOLA",
    "templateKey": "TPL_GEO_HYPERBOLA_FOCAL_DIFF",
    "crossConceptKeys": [
      "CC_REFLECTION"
    ],
    "conditionKeys": [
      "COND_RANGE"
    ],
    "integrationPattern": "INTERDEPENDENT"
  }
];
