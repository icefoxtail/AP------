window.examTitle = "기하_034_타원과포물선_고2_유형은행1";

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
    "content": "포물선 $y^2 = 20x$의 초점이 타원 $\\frac{x^2}{a^2} + \\frac{y^2}{11} = 1$ ($a > \\sqrt{11}$)의 한 초점과 일치할 때, 이 타원의 장축의 길이는?",
    "choices": [
      "8",
      "9",
      "10",
      "12",
      "14"
    ],
    "answer": "④",
    "solution": "포물선의 초점 구하기: 포물선의 표준형 $y^2 = 4px$에서 $4p = 20$이므로 $p = 5$이고, 포물선의 초점의 좌표는 $(5, 0)$이다.\n타원의 초점과 방정식의 관계 적용: 타원 $\\frac{x^2}{a^2} + \\frac{y^2}{11} = 1$ ($a > \\sqrt{11}$)의 초점이 $x$축 위에 있으므로 초점의 좌표를 $(c, 0)$, $(-c, 0)$이라 하면 $c^2 = a^2 - 11$이다.\n초점 일치 조건 대입: 타원의 한 초점이 포물선의 초점 $(5, 0)$과 일치하므로 $c = 5$이다.\n$a$의 값 계산: $5^2 = a^2 - 11$에서 $25 = a^2 - 11$이므로 $a^2 = 36$이고, $a > 0$이므로 $a = 6$이다.\n타원의 장축의 길이 계산: 타원의 장축의 길이는 $2a = 2 \\times 6 = 12$이다.\n주의: 장축의 길이는 $a$가 아니라 $2a$임에 유의한다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "B12",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-GEO-RPM-041",
    "problemTypeKey": "PT_GEO_ELLIPSE",
    "templateKey": "TPL_GEO_ELLIPSE_WITH_CURVE",
    "crossConceptKeys": [
      "CC_PARABOLA"
    ],
    "conditionKeys": [
      "COND_RANGE"
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
    "content": "타원 $\\frac{x^2}{a^2} + \\frac{y^2}{b^2} = 1$ ($a > b > 0$)의 단축의 길이가 $8$이고, 이 타원의 한 초점이 포물선 $y^2 = 12x$의 초점과 일치할 때, 타원의 장축의 길이는?",
    "choices": [
      "6",
      "8",
      "10",
      "12",
      "14"
    ],
    "answer": "③",
    "solution": "단축의 길이로부터 $b$ 구하기: 타원의 단축의 길이는 $2b$이므로 $2b = 8$에서 $b = 4$이다.\n포물선의 초점 구하기: 포물선의 표준형 $y^2 = 4px$에서 $4p = 12$이므로 $p = 3$이고, 포물선의 초점의 좌표는 $(3, 0)$이다.\n타원의 초점 조건 적용: 타원의 한 초점이 포물선의 초점과 일치하므로 초점의 좌표를 $(c, 0)$이라 하면 $c = 3$이다.\n타원의 성질 적용: $a > b > 0$인 타원에서 $a^2 = b^2 + c^2$이므로 $a^2 = 4^2 + 3^2 = 16 + 9 = 25$이다.\n장축의 길이 계산: $a > 0$이므로 $a = 5$이고, 타원의 장축의 길이는 $2a = 2 \\times 5 = 10$이다.\n주의: 단축의 길이는 $2b$, 장축의 길이는 $2a$이므로 각각 $2$배를 계산하는 것을 잊지 않는다.\n따라서 정답은 ③이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "B12",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-GEO-RPM-041",
    "problemTypeKey": "PT_GEO_ELLIPSE",
    "templateKey": "TPL_GEO_ELLIPSE_WITH_CURVE",
    "crossConceptKeys": [
      "CC_PARABOLA"
    ],
    "conditionKeys": [
      "COND_INEQUALITY_CONSTRAINT"
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
    "content": "다음 그림과 같이 초점이 $A(8, 0)$이고 준선이 $y$축인 포물선 $C_1$과 두 초점이 원점 $O(0, 0)$과 점 $A(8, 0)$인 타원 $C_2$가 만나는 점 중 제1사분면에 있는 점을 $P$라 하자. $\\overline{PA} = 10$일 때, 타원 $C_2$의 장축의 길이는? [그림: 좌표평면 위에 원점 $O(0,0)$과 점 $A(8,0)$이 $x$축 위에 표시되어 있다. 꼭짓점이 $(4,0)$이고 초점이 $A(8,0)$이며 준선이 $y$축($x=0$)인 포물선 $C_1$이 오른쪽으로 열려 있다. 원점 $O$와 $A(8,0)$을 두 초점으로 하는 타원 $C_2$가 그려져 있고, 제1사분면에서 포물선과 타원이 만나는 점 $P$가 표시되어 있다. 선분 $PA$가 실선으로 연결되어 있다.]",
    "choices": [
      "18",
      "20",
      "22",
      "24",
      "26"
    ],
    "answer": "④",
    "solution": "포물선의 정의 적용: 점 $P$는 포물선 $C_1$ 위의 점이므로 포물선의 정의에 의해 초점 $A$까지의 거리와 준선($y$축)까지의 거리가 같다. 점 $P$에서 $y$축에 내린 수선의 발을 $H$라 하면 $\\overline{PH} = \\overline{PA} = 10$이다.\n점 $P$의 $x$좌표 결정: 점 $P$는 제1사분면의 점이므로 $y$축으로부터의 거리인 $x$좌표는 $x = 10$이다.\n포물선의 방정식 구하기: 초점이 $(8, 0)$이고 준선이 $x = 0$이므로 꼭짓점은 $(4, 0)$이고 $p = 8 - 4 = 4$이다. 따라서 포물선의 방정식은 $(y - 0)^2 = 4 \\times 4(x - 4) \\implies y^2 = 16(x - 4)$이다.\n점 $P$의 $y$좌표 구하기: $x = 10$을 포물선의 방정식에 대입하면 $y^2 = 16(10 - 4) = 16 \\times 6 = 96$이다.\n선분 $PO$의 길이 계산: 원점 $O(0, 0)$과 점 $P(10, y)$ 사이의 거리는 피타고라스 정리에 의해 $\\overline{PO} = \\sqrt{10^2 + y^2} = \\sqrt{100 + 96} = \\sqrt{196} = 14$이다.\n타원의 정의로 장축의 길이 계산: 타원 $C_2$의 두 초점은 $O$와 $A$이므로, 타원의 정의에 의해 타원 위의 점 $P$에서 두 초점에 이르는 거리의 합이 장축의 길이이다. 따라서 장축의 길이는 $\\overline{PO} + \\overline{PA} = 14 + 10 = 24$이다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-GEO-RPM-041",
    "problemTypeKey": "PT_GEO_ELLIPSE",
    "templateKey": "TPL_GEO_ELLIPSE_WITH_CURVE",
    "crossConceptKeys": [
      "CC_PARABOLA",
      "CC_DISTANCE_TWO_POINTS"
    ],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL",
    "image": "assets/images/기하_034_타원과포물선_고2_유형은행1/q3-problem.svg",
    "imageAlt": "초점 A(8,0)·준선 y축인 포물선 C₁과 O,A를 초점으로 하는 타원 C₂의 교점 P",
    "imageCaption": "초점 A(8,0)·준선 y축인 포물선 C₁과 O,A를 초점으로 하는 타원 C₂의 교점 P",
    "imageSize": "full"
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
    "content": "다음 그림과 같이 타원 $\\frac{x^2}{a^2} + \\frac{y^2}{9} = 1$ ($a > 3$)의 한 초점이 포물선 $y^2 = -16x$의 초점과 일치한다. 이 두 이차곡선의 교점을 각각 $A, B$라 하고, 타원의 두 초점을 각각 $F, F'$이라 할 때, 사각형 $AF'BF$의 둘레의 길이는? [그림: 좌표평면 위에 타원 $\\frac{x^2}{a^2} + \\frac{y^2}{9} = 1$이 가로로 길쭉하게 그려져 있고, 포물선 $y^2 = -16x$가 원점을 꼭짓점으로 하고 왼쪽으로 열려 있다. 포물선의 초점 $F$와 대칭점 $F'$이 타원의 두 초점이며 $x$축 위에 위치한다. 두 곡선의 두 교점을 $A$(제2사분면), $B$(제3사분면)라 하고, 네 선분 $AF', F'B, BF, FA$가 연결되어 사각형 $AF'BF$를 이룬다.]",
    "choices": [
      "16",
      "20",
      "24",
      "28",
      "32"
    ],
    "answer": "②",
    "solution": "포물선의 초점 구하기: 포물선 $y^2 = 4px$에서 $4p = -16 \\implies p = -4$이므로 초점의 좌표는 $F(-4, 0)$이다.\n타원의 초점 공식 적용: 타원 $\\frac{x^2}{a^2} + \\frac{y^2}{9} = 1$ ($a > 3$)의 두 초점의 좌표는 $(-c, 0)$, $(c, 0)$이며 $c^2 = a^2 - 9$이다.\n초점 일치 조건으로 $a$ 구하기: 타원의 한 초점이 $F(-4, 0)$이므로 $c = 4$이다. 따라서 $4^2 = a^2 - 9 \\implies 16 = a^2 - 9 \\implies a^2 = 25$이고, $a > 3$이므로 $a = 5$이다.\n타원의 정의 적용: 점 $A$와 점 $B$는 타원 위의 점이므로 타원의 정의에 의해 $\\overline{AF} + \\overline{AF'} = 2a = 2 \\times 5 = 10$, $\\overline{BF} + \\overline{BF'} = 2a = 10$이다.\n사각형의 둘레의 길이 계산: 사각형 $AF'BF$의 둘레의 길이는 $(\\overline{AF} + \\overline{AF'}) + (\\overline{BF} + \\overline{BF'}) = 10 + 10 = 20$이다.\n주의: 교점 $A, B$의 좌표를 직접 연립하여 구할 필요 없이, 타원의 정의(두 초점까지의 거리의 합은 $2a$)를 이용하면 바로 해결된다.\n따라서 정답은 ②이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-GEO-RPM-041",
    "problemTypeKey": "PT_GEO_ELLIPSE",
    "templateKey": "TPL_GEO_ELLIPSE_WITH_CURVE",
    "crossConceptKeys": [
      "CC_PARABOLA"
    ],
    "conditionKeys": [
      "COND_RANGE"
    ],
    "integrationPattern": "SEQUENTIAL",
    "image": "assets/images/기하_034_타원과포물선_고2_유형은행1/q4-problem.svg",
    "imageAlt": "왼쪽 열린 포물선 y²=−16x과 타원의 두 교점 A,B, 초점 사각형 AF′BF",
    "imageCaption": "왼쪽 열린 포물선 y²=−16x과 타원의 두 교점 A,B, 초점 사각형 AF′BF",
    "imageSize": "full"
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
    "content": "다음 그림과 같이 포물선 $y^2 = 20x$와 타원 $\\frac{x^2}{36} + \\frac{y^2}{11} = 1$이 제1사분면에서 만나는 점을 $P$, 직선 $x = -5$가 $x$축과 만나는 점을 $Q$라 하고, 점 $P$에서 직선 $x = -5$에 내린 수선의 발을 $R$이라 하자. 이때 $\\overline{PQ} + \\overline{PR}$의 값은? [그림: 좌표평면 위에 타원 $\\frac{x^2}{36} + \\frac{y^2}{11} = 1$과 포물선 $y^2 = 20x$가 그려져 있다. 타원의 두 초점은 $F(5,0)$과 $F'(-5,0)$이다. 포물선의 꼭짓점은 원점이고 초점은 $F(5,0)$, 준선은 $x=-5$이다. 포물선과 타원이 제1사분면에서 만나는 점이 $P$이다. 준선 $x=-5$와 $x$축의 교점이 $Q(-5,0)$이고, $P$에서 준선 $x=-5$에 내린 수선의 발이 $R$이다. 선분 $PQ$와 $PR$이 그어져 있다.]",
    "choices": [
      "8",
      "9",
      "10",
      "11",
      "12"
    ],
    "answer": "⑤",
    "solution": "타원의 초점과 장축의 길이 구하기: 타원 $\\frac{x^2}{36} + \\frac{y^2}{11} = 1$에서 $a^2 = 36, b^2 = 11$이므로 $c = \\sqrt{36 - 11} = \\sqrt{25} = 5$이다. 따라서 타원의 두 초점은 $F(5, 0)$과 $F'(-5, 0)$이고, 장축의 길이는 $2a = 2 \\times 6 = 12$이다.\n포물선의 초점과 준선 확인: 포물선 $y^2 = 4px$에서 $4p = 20 \\implies p = 5$이므로 초점은 $(5, 0) = F$이고, 준선의 방정식은 $x = -5$이다.\n점 $Q$의 위치 확인: 직선 $x = -5$가 $x$축과 만나는 점 $Q$는 $(-5, 0)$이므로, 점 $Q$는 타원의 초점 $F'$과 일치한다. 즉 $\\overline{PQ} = \\overline{PF'}$이다.\n포물선의 정의 적용: 점 $P$는 포물선 위의 점이고 직선 $x = -5$는 준선이므로, 포물선의 정의에 의해 점 $P$에서 준선까지의 거리 $\\overline{PR}$은 초점 $F$까지의 거리 $\\overline{PF}$와 같다. 즉 $\\overline{PR} = \\overline{PF}$이다.\n타원의 정의를 이용한 합 계산: 구하는 식에 대입하면 $\\overline{PQ} + \\overline{PR} = \\overline{PF'} + \\overline{PF}$이다. 점 $P$는 타원 위의 점이므로 두 초점에 이르는 거리의 합은 장축의 길이 $2a = 12$와 같다.\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-GEO-RPM-041",
    "problemTypeKey": "PT_GEO_ELLIPSE",
    "templateKey": "TPL_GEO_ELLIPSE_WITH_CURVE",
    "crossConceptKeys": [
      "CC_PARABOLA"
    ],
    "conditionKeys": [],
    "integrationPattern": "REINTERPRETATION",
    "image": "assets/images/기하_034_타원과포물선_고2_유형은행1/q5-problem.svg",
    "imageAlt": "타원 x²/36+y²/11과 포물선 y²=20x의 공통점 P, 준선 발 R과 Q(−5,0)",
    "imageCaption": "타원 x²/36+y²/11과 포물선 y²=20x의 공통점 P, 준선 발 R과 Q(−5,0)",
    "imageSize": "full"
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
    "content": "다음 그림과 같이 타원 $\\frac{x^2}{49} + \\frac{y^2}{40} = 1$과 포물선 $y^2 = -12x$의 한 교점을 $A$라 하고, 직선 $x = 3$과 $x$축의 교점을 $B$라고 하자. 점 $A$에서 직선 $x = 3$에 내린 수선의 발을 $C$라고 할 때, $\\overline{AB} + \\overline{AC}$의 값은? [그림: 좌표평면 위에 타원 $\\frac{x^2}{49} + \\frac{y^2}{40} = 1$과 오른쪽에서 왼쪽으로 열린 포물선 $y^2 = -12x$가 그려져 있다. 타원의 두 초점은 $F(3,0)$과 $F'(-3,0)$이다. 포물선은 초점이 $F'(-3,0)$이고 준선이 $x=3$이다. 두 곡선의 교점 중 하나인 $A$가 제2사분면에 표시되어 있다. 직선 $x=3$이 수직선으로 그어져 있고, 이 직선이 $x$축과 만나는 점이 $B(3,0)$이다. 점 $A$에서 직선 $x=3$에 내린 수선의 발이 $C$로 표시되어 있으며, 선분 $AB$와 선분 $AC$가 연결되어 있다.]",
    "choices": [
      "10",
      "11",
      "12",
      "13",
      "14"
    ],
    "answer": "⑤",
    "solution": "타원의 초점과 장축의 길이 구하기: 타원 $\\frac{x^2}{49} + \\frac{y^2}{40} = 1$에서 $a^2 = 49, b^2 = 40$이므로 $c = \\sqrt{49 - 40} = \\sqrt{9} = 3$이다. 따라서 타원의 두 초점은 $F(3, 0)$과 $F'(-3, 0)$이고, 장축의 길이는 $2a = 2 \\times 7 = 14$이다.\n포물선의 초점과 준선 확인: 포물선 $y^2 = 4px$에서 $4p = -12 \\implies p = -3$이므로 초점은 $(-3, 0) = F'$이고, 준선의 방정식은 $x = 3$이다.\n점 $B$의 위치 확인: 직선 $x = 3$과 $x$축의 교점 $B$는 $(3, 0)$이므로 타원의 초점 $F$와 일치한다. 즉 $\\overline{AB} = \\overline{AF}$이다.\n포물선의 정의 적용: 점 $A$는 포물선 위의 점이고 점 $C$는 준선 $x = 3$에 내린 수선의 발이므로, 포물선의 정의에 의해 준선까지의 거리는 초점까지의 거리와 같다. 즉 $\\overline{AC} = \\overline{AF'}$이다.\n타원의 정의로 합 계산: 구하는 식에 대입하면 $\\overline{AB} + \\overline{AC} = \\overline{AF} + \\overline{AF'}$이다. 점 $A$는 타원 위의 점이므로 두 초점에 이르는 거리의 합은 장축의 길이 $2a = 14$와 같다.\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B45",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-GEO-RPM-041",
    "problemTypeKey": "PT_GEO_ELLIPSE",
    "templateKey": "TPL_GEO_ELLIPSE_WITH_CURVE",
    "crossConceptKeys": [
      "CC_PARABOLA",
      "CC_DISTANCE_TWO_POINTS"
    ],
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
    "content": "좌표평면에서 두 점 $A(-2, 0), B(2, 0)$을 초점으로 하고 장축의 길이가 $6$인 타원이 있다. 초점이 $B$이고 원점을 꼭짓점으로 하는 포물선이 타원과 제1사분면에서 만나는 점을 $P$라 할 때, 선분 $PB$의 길이는?",
    "choices": [
      "\\frac{7}{5}",
      "\\frac{9}{5}",
      "\\frac{11}{5}",
      "\\frac{13}{5}",
      "\\frac{17}{5}"
    ],
    "answer": "④",
    "solution": "타원의 방정식 세우기: 타원의 두 초점이 $A(-2, 0), B(2, 0)$이므로 $c = 2$이다. 장축의 길이가 $6$이므로 $2a = 6 \\implies a = 3$이다. $b^2 = a^2 - c^2 = 3^2 - 2^2 = 9 - 4 = 5$이므로 타원의 방정식은 $\\frac{x^2}{9} + \\frac{y^2}{5} = 1$이다.\n포물선의 방정식과 준선 구하기: 포물선의 꼭짓점이 원점 $(0, 0)$이고 초점이 $B(2, 0)$이므로 $p = 2$이다. 따라서 포물선의 방정식은 $y^2 = 4 \\times 2x = 8x$이고, 준선의 방정식은 $x = -2$이다.\n포물선의 정의 적용: 점 $P(x, y)$는 포물선 위의 점이므로 초점 $B$까지의 거리는 준선 $x = -2$까지의 거리와 같다. 즉 $\\overline{PB} = x - (-2) = x + 2$이다.\n연립하여 교점의 $x$좌표 구하기: $y^2 = 8x$를 타원의 방정식에 대입하면 $\\frac{x^2}{9} + \\frac{8x}{5} = 1$이다. 양변에 $45$를 곱하여 정리하면 $5x^2 + 72x - 45 = 0$이다.\n인수분해로 $x$ 결정: $(5x - 3)(x + 15) = 0$이므로 $x = \\frac{3}{5}$ 또는 $x = -15$이다. 타원의 $x$좌표 범위는 $-3 \\le x \\le 3$이고 점 $P$는 제1사분면 위의 점이므로 $x = \\frac{3}{5}$이다.\n선분 $PB$의 길이 계산: $\\overline{PB} = x + 2 = \\frac{3}{5} + 2 = \\frac{13}{5}$이다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B45",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-GEO-RPM-041",
    "problemTypeKey": "PT_GEO_ELLIPSE",
    "templateKey": "TPL_GEO_ELLIPSE_WITH_CURVE",
    "crossConceptKeys": [
      "CC_PARABOLA"
    ],
    "conditionKeys": [],
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
    "content": "좌표평면에서 두 점 $A(5, 0), B(-5, 0)$에 대하여 선분 $AB$를 장축으로 하는 타원의 두 초점을 각각 $F(c, 0), F'(-c, 0)$ ($c > 0$)이라 하자. 초점이 $F$이고 꼭짓점이 원점인 포물선이 타원과 만나는 두 점을 각각 $P, Q$라 하자. $\\overline{PQ} = 2\\sqrt{15}$이고 점 $F$의 $x$좌표가 $2$보다 클 때, 선분 $PF$의 길이는?",
    "choices": [
      "\\frac{11}{4}",
      "\\frac{13}{4}",
      "\\frac{7}{2}",
      "4",
      "\\frac{17}{4}"
    ],
    "answer": "⑤",
    "solution": "타원과 포물선의 방정식 설정: 선분 $AB$가 장축이므로 $a = 5$이고, 타원의 방정식은 $\\frac{x^2}{25} + \\frac{y^2}{25 - c^2} = 1$이다. 초점이 $F(c, 0)$이고 꼭짓점이 원점인 포물선의 방정식은 $y^2 = 4cx$이며 준선은 $x = -c$이다.\n교점 $P$의 $y$좌표 구하기: 두 곡선 모두 $x$축에 대칭이므로 교점 $P, Q$는 $x$축 대칭이다. $\\overline{PQ} = 2\\sqrt{15}$에서 제1사분면의 교점 $P$의 $y$좌표는 $y = \\sqrt{15}$이다.\n$P$의 $x$좌표를 $c$로 표현: 점 $P$는 포물선 위의 점이므로 $(\\sqrt{15})^2 = 4cx \\implies 15 = 4cx \\implies x = \\frac{15}{4c}$이다.\n타원의 방정식에 대입: 점 $P$를 타원의 방정식에 대입하면 $\\frac{(15/4c)^2}{25} + \\frac{15}{25 - c^2} = 1 \\implies \\frac{9}{16c^2} + \\frac{15}{25 - c^2} = 1$이다.\n방정식 정리 및 풀이: $c^2 = t$ ($t > 0$)로 치환하면 $\\frac{9}{16t} + \\frac{15}{25 - t} = 1$이다. 양변에 $16t(25 - t)$를 곱하면 $9(25 - t) + 240t = 400t - 16t^2 \\implies 16t^2 - 169t + 225 = 0$이다.\n인수분해로 $c$ 결정: $(t - 9)(16t - 25) = 0$이므로 $t = 9$ 또는 $t = \\frac{25}{16}$이다. 조건에서 $c > 2$이므로 $t = c^2 > 4$이어야 하므로 $t = 9$, 즉 $c = 3$이다.\n주의: $t = \\frac{25}{16}$일 때는 $c = \\frac{5}{4} < 2$이므로 조건에 부합하지 않는다.\n선분 $PF$의 길이 계산: $c = 3$을 대입하면 $x = \\frac{15}{4 \\times 3} = \\frac{5}{4}$이다. 포물선의 정의에 의해 $\\overline{PF}$는 준선 $x = -3$까지의 거리와 같으므로 $\\overline{PF} = x - (-3) = \\frac{5}{4} + 3 = \\frac{17}{4}$이다.\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B45",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-GEO-RPM-041",
    "problemTypeKey": "PT_GEO_ELLIPSE",
    "templateKey": "TPL_GEO_ELLIPSE_WITH_CURVE",
    "crossConceptKeys": [
      "CC_PARABOLA",
      "CC_DISTANCE_TWO_POINTS"
    ],
    "conditionKeys": [
      "COND_LOWER_BOUND"
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
    "content": "포물선 $y^2 = 8x$ 위에 있고 제1사분면에 있는 점 $P$를 지나고, 두 초점이 $F(2, 0), F'(-2, 0)$인 타원을 $C$라 하자. 타원 $C$ 위의 점 $Q$가 다음 조건을 만족시킨다.\n(가) 점 $Q$의 $y$좌표는 음수이다.\n(나) 사각형 $PF'QF$는 평행사변형이다.\n사각형 $PF'QF$의 둘레의 길이가 $16$일 때, 사각형 $PF'QF$의 넓이는?",
    "choices": [
      "\\frac{8\\sqrt{6}}{3}",
      "\\frac{10\\sqrt{6}}{3}",
      "4\\sqrt{6}",
      "\\frac{16\\sqrt{6}}{3}",
      "6\\sqrt{6}"
    ],
    "answer": "④",
    "solution": "평행사변형의 성질 파악: 대각선 $F'F$의 중점은 원점 $(0, 0)$이다. 사각형 $PF'QF$가 평행사변형이므로 두 대각선 $F'F$와 $PQ$는 서로의 중점에서 만난다. 따라서 점 $Q$는 점 $P$를 원점에 대칭이동한 점이다.\n평행사변형의 둘레와 타원의 장축: 평행사변형의 대변의 길이는 같으므로 $\\overline{PF'} = \\overline{QF}, \\overline{PF} = \\overline{QF'}$이다. 사각형의 둘레는 $2(\\overline{PF} + \\overline{PF'}) = 16 \\implies \\overline{PF} + \\overline{PF'} = 8$이다. 타원의 정의에 의해 장축의 길이는 $2a = 8 \\implies a = 4$이다.\n타원의 방정식 구하기: 초점이 $(\\pm 2, 0)$이므로 $c = 2$이다. $b^2 = a^2 - c^2 = 16 - 4 = 12$이므로 타원의 방정식은 $\\frac{x^2}{16} + \\frac{y^2}{12} = 1$이다.\n포물선과 연립하여 교점 $P$ 구하기: 점 $P$는 포물선 $y^2 = 8x$ 위의 점이므로 대입하면 $\\frac{x^2}{16} + \\frac{8x}{12} = 1 \\implies \\frac{x^2}{16} + \\frac{2x}{3} = 1$이다. 양변에 $48$을 곱하면 $3x^2 + 32x - 48 = 0$이다.\n인수분해로 $P$의 좌표 결정: $(3x - 4)(x + 12) = 0$에서 $P$가 제1사분면의 점이므로 $x = \\frac{4}{3}$이다. $y^2 = 8 \\times \\frac{4}{3} = \\frac{32}{3} \\implies y = \\sqrt{\\frac{32}{3}} = \\frac{4\\sqrt{6}}{3}$이다.\n평행사변형의 넓이 계산: 대각선 $F'F$의 길이는 $2c = 4$이고, $x$축을 기준으로 점 $P$의 높이는 $y_P = \\frac{4\\sqrt{6}}{3}$, 점 $Q$의 높이는 $|y_Q| = \\frac{4\\sqrt{6}}{3}$이다. 따라서 평행사변형의 넓이는 밑변 $\\overline{F'F}$와 높이의 곱인 $\\overline{F'F} \\times y_P = 4 \\times \\frac{4\\sqrt{6}}{3} = \\frac{16\\sqrt{6}}{3}$이다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 5,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B45",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-GEO-RPM-041",
    "problemTypeKey": "PT_GEO_ELLIPSE",
    "templateKey": "TPL_GEO_ELLIPSE_WITH_CURVE",
    "crossConceptKeys": [
      "CC_PARABOLA",
      "CC_PARALLELOGRAM_PROPERTIES"
    ],
    "conditionKeys": [
      "COND_NEGATIVE"
    ],
    "integrationPattern": "INTERDEPENDENT"
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
    "content": "다음 그림과 같이 포물선 $y^2 = 8x$의 초점을 $F$라 하자. 점 $F$를 한 초점으로 하고 점 $A(-1, 0)$을 지나며 다른 초점 $F'$이 선분 $AF$ 위에 있는 타원 $E$가 있다. 포물선 $y^2 = 8x$가 타원 $E$와 제1사분면에서 만나는 점을 $B$라 하고, 점 $B$에서 포물선의 준선에 내린 수선의 발을 $H$라 하자. $\\overline{BH} = \\frac{7}{3}$일 때, 타원 $E$의 장축의 길이는? [그림: 좌표평면 위에 포물선 $y^2 = 8x$와 타원 $E$가 그려져 있다. 점 $F(2,0)$은 포물선의 초점이고 타원 $E$의 오른쪽 초점이다. $x$축 위의 점 $A(-1,0)$을 타원이 지나고, 타원의 다른 초점 $F'$은 선분 $AF$ 위에 있다. 포물선의 준선 $x=-2$가 점선으로 표시되어 있다. 제1사분면에서 두 곡선이 만나는 교점 $B$에서 준선에 내린 수선의 발이 $H$, 초점 $F$와 $F'$으로 각각 선분이 그어져 있다.]",
    "choices": [
      "\\frac{8}{3}",
      "3",
      "\\frac{10}{3}",
      "\\frac{11}{3}",
      "4"
    ],
    "answer": "⑤",
    "solution": "포물선의 초점과 준선 확인: 포물선 $y^2 = 8x$에서 $4p = 8 \\implies p = 2$이므로 초점은 $F(2, 0)$이고, 준선의 방정식은 $x = -2$이다.\n점 $B$의 좌표 구하기: 점 $B$에서 준선 $x = -2$에 내린 수선의 길이가 $\\overline{BH} = \\frac{7}{3}$이므로 $x_B - (-2) = \\frac{7}{3} \\implies x_B = \\frac{7}{3} - 2 = \\frac{1}{3}$이다. $y_B^2 = 8x_B = 8 \\times \\frac{1}{3} = \\frac{8}{3}$이다. 포물선의 정의에 의해 $\\overline{BF} = \\overline{BH} = \\frac{7}{3}$이다.\n타원의 다른 초점 $F'$ 설정: 초점 $F'$이 선분 $AF$ 위에 있으므로 $F'(x_0, 0)$이라 하면 $-1 < x_0 < 2$이다.\n점 $A$를 이용한 장축의 길이 표현: 점 $A(-1, 0)$은 타원 위의 점이므로 장축의 길이는 두 초점에 이르는 거리의 합이다. $\\overline{AF} = 2 - (-1) = 3$, $\\overline{AF'} = x_0 - (-1) = x_0 + 1$이므로 장축의 길이는 $2a = \\overline{AF} + \\overline{AF'} = 3 + (x_0 + 1) = x_0 + 4$이다.\n점 $B$를 이용한 장축의 길이 표현: 점 $B$도 타원 위의 점이므로 장축의 길이는 $2a = \\overline{BF} + \\overline{BF'} = \\frac{7}{3} + \\overline{BF'}$이다. 따라서 $\\overline{BF'} = 2a - \\frac{7}{3} = (x_0 + 4) - \\frac{7}{3} = x_0 + \\frac{5}{3}$이다.\n두 점 사이의 거리 공식으로 $x_0$ 구하기: $\\overline{BF'}^2 = (x_B - x_0)^2 + y_B^2 = \\left(\\frac{1}{3} - x_0\\right)^2 + \\frac{8}{3} = x_0^2 - \\frac{2}{3}x_0 + \\frac{25}{9}$이다. 또한 $\\overline{BF'}^2 = \\left(x_0 + \\frac{5}{3}\\right)^2 = x_0^2 + \\frac{10}{3}x_0 + \\frac{25}{9}$이다. 두 식을 연립하면 $x_0^2 - \\frac{2}{3}x_0 + \\frac{25}{9} = x_0^2 + \\frac{10}{3}x_0 + \\frac{25}{9} \\implies 4x_0 = 0 \\implies x_0 = 0$이다.\n장축의 길이 계산: $x_0 = 0$을 대입하면 타원의 장축의 길이는 $2a = x_0 + 4 = 0 + 4 = 4$이다.\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 5,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B45",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-GEO-RPM-041",
    "problemTypeKey": "PT_GEO_ELLIPSE",
    "templateKey": "TPL_GEO_ELLIPSE_WITH_CURVE",
    "crossConceptKeys": [
      "CC_PARABOLA",
      "CC_DISTANCE_TWO_POINTS"
    ],
    "conditionKeys": [],
    "integrationPattern": "INTERDEPENDENT",
    "image": "assets/images/기하_034_타원과포물선_고2_유형은행1/q10-problem.svg",
    "imageAlt": "포물선 y²=8x과 초점 F(2,0)을 공유하는 타원 E의 제1사분면 교점 B, 준선의 발 H",
    "imageCaption": "포물선 y²=8x과 초점 F(2,0)을 공유하는 타원 E의 제1사분면 교점 B, 준선의 발 H",
    "imageSize": "full"
  }
];
