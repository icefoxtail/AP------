window.examTitle = "기하_055_타원과쌍곡선의활용-초점이일치1_고2_유형은행1";

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
    "content": "그림과 같이 두 초점 $F, F'$을 공유하는 타원 $\\frac{x^2}{a^2} + \\frac{y^2}{b^2} = 1$ ($a > b > 0$)과 쌍곡선 $\\frac{x^2}{c^2} - \\frac{y^2}{d^2} = 1$ ($c > 0, d > 0$)이 있다. 이 두 곡선의 제 1사분면에서의 교점을 $P$라 하면 $PF = 2, PF' = 8$일 때, $b^2 + d^2$의 값은? (단, $a, b, c, d$는 상수이다.)\n[그림: 좌표평면에서 두 초점 $F, F'$을 공유하는 타원 $\\frac{x^2}{a^2} + \\frac{y^2}{b^2} = 1$과 쌍곡선 $\\frac{x^2}{c^2} - \\frac{y^2}{d^2} = 1$이 그려져 있고, 제 1사분면에서 만나는 교점 $P$와 두 초점을 잇는 선분 $PF, PF'$이 표시되어 있다.]",
    "choices": [
      "16",
      "18",
      "20",
      "22",
      "24"
    ],
    "answer": "①",
    "solution": "1단계: 타원의 정의를 적용하여 장축의 길이와 $a^2$을 구한다: 점 $P$는 타원 위의 점이므로 $PF' + PF = 2a$이다. $8 + 2 = 10 = 2a \\implies a = 5 \\implies a^2 = 25$이다.\n2단계: 쌍곡선의 정의를 적용하여 주축의 길이와 $c^2$을 구한다: 점 $P$는 제 1사분면의 쌍곡선 위의 점이므로 $PF' - PF = 2c$이다. $8 - 2 = 6 = 2c \\implies c = 3 \\implies c^2 = 9$이다.\n3단계: 두 곡선이 초점을 공유하는 조건을 세운다: 타원과 쌍곡선이 초점거리의 제곱을 $f^2$으로 공유하므로 타원에서 $f^2 = a^2 - b^2$, 쌍곡선에서 $f^2 = c^2 + d^2$이다.\n4단계: 두 식을 같다고 놓고 정리한다: $a^2 - b^2 = c^2 + d^2 \\implies b^2 + d^2 = a^2 - c^2$.\n5단계: 구한 값을 대입하여 계산한다: $b^2 + d^2 = 25 - 9 = 16$.\n6단계: 따라서 정답은 ①이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-GEO-RPM-041",
    "problemTypeKey": "PT_GEO_HYPERBOLA",
    "templateKey": "TPL_GEO_HYPERBOLA_SHARED_FOCUS",
    "crossConceptKeys": [],
    "conditionKeys": [
      "COND_POSITIVE"
    ],
    "integrationPattern": "INTERDEPENDENT"
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
    "content": "그림과 같이 두 점 $F(c, 0), F'(-c, 0)$ ($c > 0$)을 초점으로 공유하는 타원 $\\frac{x^2}{a^2} + \\frac{y^2}{16} = 1$과 쌍곡선 $\\frac{x^2}{9} - \\frac{y^2}{b^2} = 1$이 제 1사분면에서 만나는 점을 $P$라 하자. $PF = 4$일 때, $a^2 + b^2$의 값은? (단, $a, b$는 상수이다.)\n[그림: 좌표평면에서 두 초점 $F(c, 0), F'(-c, 0)$을 공유하는 타원 $\\frac{x^2}{a^2} + \\frac{y^2}{16} = 1$과 쌍곡선 $\\frac{x^2}{9} - \\frac{y^2}{b^2} = 1$이 그려져 있고, 제 1사분면의 교점 $P$와 선분 $PF, PF'$이 표시되어 있다.]",
    "choices": [
      "65",
      "69",
      "73",
      "77",
      "81"
    ],
    "answer": "③",
    "solution": "1단계: 쌍곡선의 주축의 길이를 구한다: 쌍곡선 방정식에서 $a_{\\text{hyp}}^2 = 9$이므로 주축의 길이는 $2 \\times 3 = 6$이다.\n2단계: 쌍곡선의 정의를 적용하여 $PF'$을 구한다: 점 $P$는 제 1사분면 위의 점이므로 $PF' - PF = 6$이다. $PF = 4$이므로 $PF' = 4 + 6 = 10$이다.\n3단계: 타원의 정의를 적용하여 $a^2$을 구한다: 점 $P$는 타원 위의 점이므로 $PF' + PF = 2a$이다. $10 + 4 = 14 = 2a \\implies a = 7 \\implies a^2 = 49$이다.\n4단계: 타원에서 초점거리 제곱 $c^2$을 구한다: $c^2 = a^2 - 16 = 49 - 16 = 33$이다.\n5단계: 쌍곡선에서 $b^2$을 구한다: 쌍곡선에서 $c^2 = 9 + b^2$이므로 $9 + b^2 = 33 \\implies b^2 = 24$이다.\n6단계: $a^2 + b^2$의 값을 계산한다: $a^2 + b^2 = 49 + 24 = 73$.\n7단계: 따라서 정답은 ③이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-GEO-RPM-041",
    "problemTypeKey": "PT_GEO_HYPERBOLA",
    "templateKey": "TPL_GEO_HYPERBOLA_SHARED_FOCUS",
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
    "content": "그림과 같이 두 초점 $F, F'$을 공유하는 타원과 쌍곡선의 한 교점을 $P$, 쌍곡선과 타원이 $x$축의 양의 부분과 만나는 점을 각각 $A, B$라고 하자. $PF' + PF = 14$, $PF' - PF = 4$일 때, 선분 $AB$의 길이는?\n[그림: 좌표평면에서 두 초점 $F, F'$을 공유하는 타원과 쌍곡선이 제 1사분면에서 만나는 점 $P$가 있고, 쌍곡선과 타원이 $x$축의 양의 부분과 만나는 점을 각각 $A, B$라 할 때, 선분 $AB$와 선분 $PF, PF'$이 표시되어 있다.]",
    "choices": [
      "1",
      "2",
      "3",
      "4",
      "5"
    ],
    "answer": "⑤",
    "solution": "1단계: 타원의 장축의 길이와 점 $B$의 좌표를 구한다: 타원의 정의에 의해 $2a_{\\text{ell}} = PF' + PF = 14 \\implies a_{\\text{ell}} = 7$이다. 따라서 타원이 $x$축의 양의 부분과 만나는 꼭짓점은 $B(7, 0)$이다.\n2단계: 쌍곡선의 주축의 길이와 점 $A$의 좌표를 구한다: 쌍곡선의 정의에 의해 $2a_{\\text{hyp}} = PF' - PF = 4 \\implies a_{\\text{hyp}} = 2$이다. 따라서 쌍곡선이 $x$축의 양의 부분과 만나는 꼭짓점은 $A(2, 0)$이다.\n3단계: 선분 $AB$의 길이를 계산한다: $AB = a_{\\text{ell}} - a_{\\text{hyp}} = 7 - 2 = 5$이다.\n4단계: 다른 풀이(정의 직접 차감): $AB = \\frac{(PF' + PF) - (PF' - PF)}{2} = \\frac{14 - 4}{2} = 5$로도 확인된다.\n5단계: 따라서 정답은 ⑤이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-GEO-RPM-041",
    "problemTypeKey": "PT_GEO_HYPERBOLA",
    "templateKey": "TPL_GEO_HYPERBOLA_SHARED_FOCUS",
    "crossConceptKeys": [
      "CC_X_INTERCEPT"
    ],
    "conditionKeys": [],
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
    "content": "그림과 같이 두 점 $F(5, 0), F'(-5, 0)$을 초점으로 하는 타원과 쌍곡선이 있다. 타원과 쌍곡선의 한 교점이 $P(5, 3)$이고 타원과 쌍곡선이 $x$축의 양의 부분과 만나는 점을 각각 $B, A$라고 할 때, 두 점 $A, B$ 사이의 거리는?\n[그림: 좌표평면에서 두 점 $F(5, 0), F'(-5, 0)$을 초점으로 공유하는 타원과 쌍곡선이 점 $P(5, 3)$에서 만나고, 두 곡선이 $x$축의 양의 부분과 만나는 점을 각각 $B, A$라 할 때, 선분 $AB$와 직각삼각형 $PF'F$가 표시되어 있다.]",
    "choices": [
      "3",
      "4",
      "5",
      "6",
      "7"
    ],
    "answer": "①",
    "solution": "1단계: 초점과 교점 $P$의 위치 관계를 파악한다: 두 초점은 $F(5, 0), F'(-5, 0)$이고 교점은 $P(5, 3)$이므로 $PF \\perp FF'$이다.\n2단계: 두 선분 $PF, PF'$의 길이를 구한다: $PF = 3$이고, 직각삼각형 $PFF'$에서 $F'F = 10$이므로 피타고라스 정리에 의해 $PF' = \\sqrt{10^2 + 3^2} = \\sqrt{109}$이다.\n3단계: 타원의 꼭짓점 $B$의 $x$좌표를 구한다: 타원의 정의에 의해 $2a_{\\text{ell}} = PF' + PF = \\sqrt{109} + 3 \\implies a_{\\text{ell}} = \\frac{\\sqrt{109} + 3}{2}$이다.\n4단계: 쌍곡선의 꼭짓점 $A$의 $x$좌표를 구한다: 쌍곡선의 정의에 의해 $2a_{\\text{hyp}} = PF' - PF = \\sqrt{109} - 3 \\implies a_{\\text{hyp}} = \\frac{\\sqrt{109} - 3}{2}$이다.\n5단계: 두 점 $A, B$ 사이의 거리를 계산한다: $AB = a_{\\text{ell}} - a_{\\text{hyp}} = \\frac{\\sqrt{109} + 3}{2} - \\frac{\\sqrt{109} - 3}{2} = \\frac{6}{2} = 3$이다.\n6단계: 따라서 정답은 ①이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-GEO-RPM-041",
    "problemTypeKey": "PT_GEO_HYPERBOLA",
    "templateKey": "TPL_GEO_HYPERBOLA_SHARED_FOCUS",
    "crossConceptKeys": [
      "CC_DISTANCE_TWO_POINTS",
      "CC_RIGHT_TRIANGLE"
    ],
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
    "content": "두 초점 $F, F'$을 공유하는 타원 $\\frac{x^2}{a} + \\frac{y^2}{20} = 1$과 쌍곡선 $\\frac{x^2}{9} - \\frac{y^2}{7} = 1$이 있다. 타원과 쌍곡선이 만나는 점 중 하나를 $P$라 할 때, $|PF^2 - PF'^2|$의 값은? (단, $a$는 양수이다.)",
    "choices": [
      "60",
      "66",
      "72",
      "78",
      "84"
    ],
    "answer": "③",
    "solution": "1단계: 쌍곡선의 초점거리와 주축의 길이를 구한다: $\\frac{x^2}{9} - \\frac{y^2}{7} = 1$에서 $a_{\\text{hyp}}^2 = 9, b_{\\text{hyp}}^2 = 7$이므로 $c^2 = 9 + 7 = 16$이다. 따라서 $a_{\\text{hyp}} = 3$이다.\n2단계: 쌍곡선의 정의를 적용한다: 점 $P$는 쌍곡선 위의 점이므로 $|PF - PF'| = 2a_{\\text{hyp}} = 2 \\times 3 = 6$이다.\n3단계: 타원이 초점을 공유하는 조건에서 $a$를 구한다: 타원 $\\frac{x^2}{a} + \\frac{y^2}{20} = 1$의 두 초점이 $x$축 위에 있으므로 $c^2 = a - 20 = 16 \\implies a = 36$이다.\n4단계: 타원의 정의를 적용한다: $a_{\\text{ell}}^2 = 36 \\implies a_{\\text{ell}} = 6$이므로 타원 위의 점 $P$에 대하여 $PF + PF' = 2a_{\\text{ell}} = 12$이다.\n5단계: 합차공식을 이용하여 목표 식을 변형한다: $|PF^2 - PF'^2| = |PF - PF'| \\times (PF + PF')$이다.\n6단계: 구한 값들을 대입하여 계산한다: $6 \\times 12 = 72$.\n7단계: 따라서 정답은 ③이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-GEO-RPM-041",
    "problemTypeKey": "PT_GEO_HYPERBOLA",
    "templateKey": "TPL_GEO_HYPERBOLA_SHARED_FOCUS",
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
    "content": "쌍곡선 $\\frac{x^2}{16} - \\frac{y^2}{20} = 1$의 두 초점을 $F', F$라 하고 직선 $x = 6$과 쌍곡선이 제 1사분면에서 만나는 점을 $P$라 하자. 초점이 두 점 $F', F$이고 점 $P$를 지나는 타원의 장축의 길이는? (단, 점 $F$의 $x$좌표는 양수이다.)",
    "choices": [
      "16",
      "18",
      "20",
      "22",
      "24"
    ],
    "answer": "②",
    "solution": "1단계: 쌍곡선의 초점 좌표를 구한다: $\\frac{x^2}{16} - \\frac{y^2}{20} = 1$에서 $a^2 = 16, b^2 = 20$이므로 $c^2 = 16 + 20 = 36 \\implies c = 6$이다. 따라서 초점은 $F(6, 0), F'(-6, 0)$이다.\n2단계: 교점 $P$의 좌표를 구한다: 직선 $x = 6$을 대입하면 $\\frac{36}{16} - \\frac{y^2}{20} = 1 \\implies \\frac{9}{4} - 1 = \\frac{y^2}{20} \\implies y^2 = 25$이다. 점 $P$가 제 1사분면의 점이므로 $P(6, 5)$이다.\n3단계: 선분 $PF$의 길이를 구한다: 점 $F(6, 0)$과 $P(6, 5)$의 $x$좌표가 같으므로 $PF = 5$이다.\n4단계: 직각삼각형 $PFF'$에서 피타고라스 정리를 적용한다: $F'F = 12$이고 $\\angle PFF' = 90^\\circ$이므로 $PF' = \\sqrt{12^2 + 5^2} = \\sqrt{144 + 25} = 13$이다.\n5단계: 타원의 정의를 적용하여 장축의 길이를 구한다: 두 초점이 $F', F$이고 점 $P$를 지나는 타원의 장축의 길이는 두 초점까지의 거리의 합이므로 $PF' + PF = 13 + 5 = 18$이다.\n6단계: 따라서 정답은 ②이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-GEO-RPM-041",
    "problemTypeKey": "PT_GEO_HYPERBOLA",
    "templateKey": "TPL_GEO_HYPERBOLA_SHARED_FOCUS",
    "crossConceptKeys": [
      "CC_LINE_INTERSECTION",
      "CC_DISTANCE_TWO_POINTS"
    ],
    "conditionKeys": [
      "COND_POSITIVE"
    ],
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
    "content": "그림과 같이 두 점 $F(c, 0), F'(-c, 0)$ ($c > 0$)을 초점으로 공유하는 타원 $\\frac{x^2}{a^2} + \\frac{y^2}{16} = 1$ ($a > 4$)과 쌍곡선 $\\frac{x^2}{16} - \\frac{y^2}{b^2} = 1$이 제 1사분면에서 만나는 점을 $P$라 하자. $PF' = 3PF$일 때, $a^2 + b^2$의 값은? (단, $a, b$는 상수이다.)\n[그림: 좌표평면에서 두 초점 $F(c, 0), F'(-c, 0)$을 공유하는 타원 $\\frac{x^2}{a^2} + \\frac{y^2}{16} = 1$과 쌍곡선 $\\frac{x^2}{16} - \\frac{y^2}{b^2} = 1$이 제 1사분면에서 만나는 점 $P$가 있고, 두 초점과 $P$를 잇는 선분 $PF, PF'$이 그려져 있다.]",
    "choices": [
      "84",
      "88",
      "92",
      "96",
      "100"
    ],
    "answer": "④",
    "solution": "1단계: 쌍곡선의 주축의 길이를 구한다: $\\frac{x^2}{16} - \\frac{y^2}{b^2} = 1$에서 $a_{\\text{hyp}}^2 = 16$이므로 주축의 길이는 $2 \\times 4 = 8$이다.\n2단계: 쌍곡선의 정의에 $PF' = 3PF$를 대입한다: 점 $P$가 제 1사분면 위의 점이므로 $PF' - PF = 8$이다. $3PF - PF = 8 \\implies 2PF = 8 \\implies PF = 4$이고 $PF' = 12$이다.\n3단계: 타원의 정의를 적용하여 $a^2$을 구한다: 점 $P$는 타원 위의 점이므로 $PF' + PF = 2a$이다. $12 + 4 = 16 = 2a \\implies a = 8 \\implies a^2 = 64$이다.\n4단계: 타원에서 초점거리 제곱 $c^2$을 구한다: $c^2 = a^2 - 16 = 64 - 16 = 48$이다.\n5단계: 쌍곡선에서 $b^2$을 구한다: 쌍곡선에서 $c^2 = 16 + b^2$이므로 $16 + b^2 = 48 \\implies b^2 = 32$이다.\n6단계: $a^2 + b^2$의 값을 계산한다: $a^2 + b^2 = 64 + 32 = 96$.\n7단계: 따라서 정답은 ④이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-GEO-RPM-041",
    "problemTypeKey": "PT_GEO_HYPERBOLA",
    "templateKey": "TPL_GEO_HYPERBOLA_SHARED_FOCUS",
    "crossConceptKeys": [],
    "conditionKeys": [
      "COND_POSITIVE",
      "COND_LOWER_BOUND"
    ],
    "integrationPattern": "SEQUENTIAL"
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
    "content": "두 초점이 $F_1(c, 0), F_2(-c, 0)$ ($c > 0$)인 타원이 $x$축과 두 점 $A(4, 0), B(-4, 0)$에서 만난다. 선분 $BO$가 주축이고 점 $F_1$이 초점인 쌍곡선의 초점 중 $F_1$이 아닌 점을 $F_3$이라 하자. 쌍곡선이 타원과 제 1사분면에서 만나는 점을 $P$라 할 때, 삼각형 $PF_2F_3$의 둘레의 길이는? (단, $O$는 원점이다.)\n[그림: 좌표평면에서 두 초점이 $F_1(c, 0), F_2(-c, 0)$이고 $x$축과 만나는 점이 $A(4, 0), B(-4, 0)$인 타원이 있고, 선분 $BO$를 주축으로 하고 점 $F_1, F_3$을 초점으로 하는 쌍곡선이 타원과 제 1사분면에서 만나는 점 $P$와 삼각형 $PF_2F_3$이 그려져 있다.]",
    "choices": [
      "16",
      "18",
      "20",
      "22",
      "24"
    ],
    "answer": "①",
    "solution": "1단계: 타원의 장축의 길이와 정의를 적용한다: 타원이 $x$축과 만나는 두 꼭짓점이 $A(4, 0), B(-4, 0)$이므로 장축의 길이는 $4 - (-4) = 8$이다. 점 $P$는 타원 위의 점이므로 $PF_1 + PF_2 = 8$이다.\n2단계: 쌍곡선의 주축의 길이를 구한다: 선분 $BO$가 주축이므로 주축의 길이는 $B(-4, 0)$과 $O(0, 0)$ 사이의 거리인 $4$이다.\n3단계: 쌍곡선의 정의를 적용한다: 점 $P$는 제 1사분면의 점이므로 초점 $F_3$이 더 멀리 있다. 따라서 $PF_3 - PF_1 = 4 \\implies PF_3 = PF_1 + 4$이다.\n4단계: 쌍곡선의 중심과 초점 $F_3$의 좌표를 구한다: 선분 $BO$의 중점이 쌍곡선의 중심이므로 중심의 좌표는 $(-2, 0)$이다. 두 초점 $F_1(c, 0)$과 $F_3$의 중점이 $(-2, 0)$이므로 $\\frac{c + x_{F_3}}{2} = -2 \\implies x_{F_3} = -4 - c$이다. 따라서 $F_3(-4-c, 0)$이다.\n5단계: 선분 $F_2F_3$의 길이를 구한다: 점 $F_2$의 좌표가 $(-c, 0)$이므로 $F_2F_3 = |-c - (-4 - c)| = 4$이다.\n6단계: 삼각형 $PF_2F_3$의 둘레의 길이를 계산한다: 둘레 $= PF_2 + PF_3 + F_2F_3 = PF_2 + (PF_1 + 4) + 4 = (PF_1 + PF_2) + 8 = 8 + 8 = 16$이다.\n7단계: 주의: $c$의 값에 관계없이 초점 간격 $F_2F_3$과 선분의 합이 일정하게 유지된다.\n8단계: 따라서 정답은 ①이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-GEO-RPM-041",
    "problemTypeKey": "PT_GEO_HYPERBOLA",
    "templateKey": "TPL_GEO_HYPERBOLA_SHARED_FOCUS",
    "crossConceptKeys": [
      "CC_X_INTERCEPT",
      "CC_MIDPOINT",
      "CC_DISTANCE_TWO_POINTS"
    ],
    "conditionKeys": [
      "COND_POSITIVE"
    ],
    "integrationPattern": "SEQUENTIAL"
  }
];
