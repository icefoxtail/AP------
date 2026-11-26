window.examTitle = "기하_031_타원의정의를이용한거리의합의최대최소_고2_유형은행1";

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
    "content": "타원 $5x^2 + 9y^2 = 180$과 두 점 $\\mathrm{A}(-1, 4)$, $\\mathrm{B}(4, 0)$이 있다. 타원 위의 점 $\\mathrm{P}$에 대하여 $\\overline{\\mathrm{AP}} + \\overline{\\mathrm{BP}}$의 최솟값은?",
    "choices": [
      "3",
      "4",
      "5",
      "6",
      "7"
    ],
    "answer": "⑤",
    "solution": "타원의 표준형 변형: 양변을 180으로 나누면 $\\frac{x^2}{36} + \\frac{y^2}{20} = 1$이므로 $a^2 = 36, b^2 = 20$이다.\n초점 좌표 계산: $c^2 = a^2 - b^2 = 36 - 20 = 16$에서 $c = 4$이므로 두 초점은 $\\mathrm{F}(4, 0), \\mathrm{F'}(-4, 0)$이다.\n점의 위치 판별: 점 $\\mathrm{B}(4, 0)$은 타원의 초점 $\\mathrm{F}$와 일치하고, 점 $\\mathrm{A}(-1, 4)$를 타원에 대입하면 $5(-1)^2 + 9(4)^2 = 5 + 144 = 149 < 180$이므로 점 $\\mathrm{A}$는 타원의 내부의 점이다.\n타원의 정의 적용: 점 $\\mathrm{P}$가 타원 위의 점이므로 $\\overline{\\mathrm{F'P}} + \\overline{\\mathrm{BP}} = 2a = 2 \\times 6 = 12$에서 $\\overline{\\mathrm{BP}} = 12 - \\overline{\\mathrm{F'P}}$이다.\n구하는 식 변형: $\\overline{\\mathrm{AP}} + \\overline{\\mathrm{BP}} = \\overline{\\mathrm{AP}} + (12 - \\overline{\\mathrm{F'P}}) = 12 - (\\overline{\\mathrm{F'P}} - \\overline{\\mathrm{AP}})$\n삼각부등식 적용: 삼각형 $\\mathrm{AF'P}$에서 $\\overline{\\mathrm{F'P}} \\le \\overline{\\mathrm{F'A}} + \\overline{\\mathrm{AP}} \\implies \\overline{\\mathrm{F'P}} - \\overline{\\mathrm{AP}} \\le \\overline{\\mathrm{F'A}}$이다.\n선분 $\\mathrm{F'A}$의 길이 계산: $\\overline{\\mathrm{F'A}} = \\sqrt{(-1 - (-4))^2 + (4 - 0)^2} = \\sqrt{3^2 + 4^2} = 5$\n최솟값 도출: $\\overline{\\mathrm{AP}} + \\overline{\\mathrm{BP}} \\ge 12 - \\overline{\\mathrm{F'A}} = 12 - 5 = 7$\n등호 성립 조건: 등호는 점 $\\mathrm{A}$가 선분 $\\mathrm{F'P}$ 위에 있을 때, 즉 반직선 $\\mathrm{F'A}$와 타원이 만나는 교점을 점 $\\mathrm{P}$로 둘 때 성립한다.\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-GEO-RPM-042",
    "problemTypeKey": "PT_GEO_ELLIPSE",
    "templateKey": "TPL_GEO_ELLIPSE_EXTREMA",
    "crossConceptKeys": [
      "CC_TRIANGLE_INEQUALITY",
      "CC_DISTANCE_TWO_POINTS"
    ],
    "conditionKeys": [],
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
    "content": "오른쪽 그림과 같이 타원 $\\frac{x^2}{25} + \\frac{y^2}{16} = 1$의 내부에 두 초점 $\\mathrm{F, F'}$을 각각 중심으로 하고 반지름의 길이가 1인 두 원이 있다. 타원 위의 점 $\\mathrm{P}$와 두 원 위의 점 $\\mathrm{Q, R}$에 대하여 $\\overline{\\mathrm{PQ}} + \\overline{\\mathrm{PR}}$의 최솟값은?\n[그림: 타원 $\\frac{x^2}{25} + \\frac{y^2}{16} = 1$과 두 초점 $\\mathrm{F}(3, 0), \\mathrm{F'}(-3, 0)$을 중심으로 하는 반지름 1인 두 원이 내부에 있고, 타원 위의 점 $\\mathrm{P}$와 각 원 위의 점 $\\mathrm{Q, R}$을 이은 선분 $\\mathrm{PQ, PR}$이 표시되어 있음]",
    "choices": [
      "6",
      "7",
      "8",
      "9",
      "10"
    ],
    "answer": "③",
    "solution": "타원의 기본 요소 파악: 타원의 방정식 $\\frac{x^2}{25} + \\frac{y^2}{16} = 1$에서 $a = 5, b = 4$이므로 장축의 길이는 $2a = 10$이다.\n초점의 좌표 구하기: $c = \\sqrt{25 - 16} = 3$이므로 초점은 $\\mathrm{F}(3, 0), \\mathrm{F'}(-3, 0)$이다.\n두 원의 내부 포함 확인: 꼭짓점 $(\\pm 5, 0)$과 초점 사이의 거리는 $5 - 3 = 2$로 원의 반지름 1보다 크므로 두 원은 타원 내부에 완전히 포함된다.\n점과 원 위의 점 사이의 거리 부등식: 점 $\\mathrm{P}$에서 중심이 $\\mathrm{F'}$이고 반지름이 1인 원 위의 점 $\\mathrm{Q}$까지의 최단거리는 $\\overline{\\mathrm{PQ}} \\ge \\overline{\\mathrm{PF'}} - 1$이다.\n다른 원에 대한 최단거리 부등식: 점 $\\mathrm{P}$에서 중심이 $\\mathrm{F}$이고 반지름이 1인 원 위의 점 $\\mathrm{R}$까지의 최단거리는 $\\overline{\\mathrm{PR}} \\ge \\overline{\\mathrm{PF}} - 1$이다.\n두 거리의 합과 타원의 정의 적용: 두 부등식을 더하면 $\\overline{\\mathrm{PQ}} + \\overline{\\mathrm{PR}} \\ge (\\overline{\\mathrm{PF'}} - 1) + (\\overline{\\mathrm{PF}} - 1) = (\\overline{\\mathrm{PF'}} + \\overline{\\mathrm{PF}}) - 2$이다.\n타원의 정의에 의한 계산: 타원 위의 임의의 점 $\\mathrm{P}$에 대하여 $\\overline{\\mathrm{PF'}} + \\overline{\\mathrm{PF}} = 2a = 10$이므로 $\\overline{\\mathrm{PQ}} + \\overline{\\mathrm{PR}} \\ge 10 - 2 = 8$이다.\n등호 성립 확인: 등호는 점 $\\mathrm{Q}$가 선분 $\\mathrm{PF'}$ 위에 있고 점 $\\mathrm{R}$이 선분 $\\mathrm{PF}$ 위에 놓일 때 성립한다.\n따라서 정답은 ③이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-GEO-RPM-042",
    "problemTypeKey": "PT_GEO_ELLIPSE",
    "templateKey": "TPL_GEO_ELLIPSE_EXTREMA",
    "crossConceptKeys": [
      "CC_CIRCLE_CENTER_RADIUS",
      "CC_TRIANGLE_INEQUALITY"
    ],
    "conditionKeys": [],
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
    "content": "오른쪽 그림과 같이 $y$축 위의 점 $\\mathrm{A}(0, a)$ ($a > 0$)와 두 점 $\\mathrm{F, F'}$을 초점으로 하는 타원 $\\frac{x^2}{36} + \\frac{y^2}{20} = 1$ 위를 움직이는 점 $\\mathrm{P}$가 있다. $\\overline{\\mathrm{AP}} - \\overline{\\mathrm{FP}}$의 최솟값이 1일 때, $a^2$의 값은?\n[그림: 좌표평면에서 타원 $\\frac{x^2}{36} + \\frac{y^2}{20} = 1$과 두 초점 $\\mathrm{F}(4, 0), \\mathrm{F'}(-4, 0)$, $y$축 위의 점 $\\mathrm{A}(0, a)$ ($a > 0$), 타원 위의 점 $\\mathrm{P}$를 잇는 선분 $\\mathrm{AP, FP}$가 그려져 있음]",
    "choices": [
      "149",
      "153",
      "157",
      "161",
      "165"
    ],
    "answer": "②",
    "solution": "타원의 기본 상수 계산: 타원 $\\frac{x^2}{36} + \\frac{y^2}{20} = 1$에서 $a^2 = 36 \\implies a = 6, 2a = 12$이고 $b^2 = 20$이다.\n초점의 좌표 구하기: $c = \\sqrt{36 - 20} = 4$이므로 초점은 $\\mathrm{F}(4, 0), \\mathrm{F'}(-4, 0)$이다.\n타원의 정의 적용: 점 $\\mathrm{P}$가 타원 위의 점이므로 $\\overline{\\mathrm{FP}} + \\overline{\\mathrm{F'P}} = 2a = 12$에서 $\\overline{\\mathrm{FP}} = 12 - \\overline{\\mathrm{F'P}}$이다.\n목표 식의 변형: $\\overline{\\mathrm{AP}} - \\overline{\\mathrm{FP}} = \\overline{\\mathrm{AP}} - (12 - \\overline{\\mathrm{F'P}}) = \\overline{\\mathrm{AP}} + \\overline{\\mathrm{F'P}} - 12$\n삼각부등식 적용: 삼각형 $\\mathrm{APF'}$에서 $\\overline{\\mathrm{AP}} + \\overline{\\mathrm{F'P}} \\ge \\overline{\\mathrm{AF'}}$이므로 $\\overline{\\mathrm{AP}} - \\overline{\\mathrm{FP}} \\ge \\overline{\\mathrm{AF'}} - 12$이다.\n최솟값 조건 대입: 최솟값이 1이므로 $\\overline{\\mathrm{AF'}} - 12 = 1 \\implies \\overline{\\mathrm{AF'}} = 13$이다.\n두 점 사이의 거리 공식 적용: $\\mathrm{A}(0, a), \\mathrm{F'}(-4, 0)$이므로 $\\overline{\\mathrm{AF'}}^2 = (-4 - 0)^2 + (0 - a)^2 = 16 + a^2$이다.\n방정식 풀이: $16 + a^2 = 13^2 = 169 \\implies a^2 = 169 - 16 = 153$\n등호 성립 확인: 점 $\\mathrm{A}(0, \\sqrt{153})$와 $\\mathrm{F'}(-4, 0)$을 잇는 선분 $\\mathrm{AF'}$과 타원의 교점을 점 $\\mathrm{P}$로 택할 때 등호가 성립한다.\n따라서 정답은 ②이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-GEO-RPM-042",
    "problemTypeKey": "PT_GEO_ELLIPSE",
    "templateKey": "TPL_GEO_ELLIPSE_EXTREMA",
    "crossConceptKeys": [
      "CC_TRIANGLE_INEQUALITY",
      "CC_DISTANCE_TWO_POINTS"
    ],
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
    "content": "두 초점이 $\\mathrm{F, F'}$인 타원 $\\frac{x^2}{49} + \\frac{y^2}{40} = 1$이 있다. 원 $x^2 + (y-4)^2 = 4$ 위의 점 $\\mathrm{P}$에 대하여 직선 $\\mathrm{F'P}$가 이 타원과 만나는 점 중 $y$좌표가 양수인 점을 $\\mathrm{Q}$라 하자. $\\overline{\\mathrm{PQ}} + \\overline{\\mathrm{FQ}}$의 최댓값은?",
    "choices": [
      "10",
      "11",
      "12",
      "13",
      "14"
    ],
    "answer": "②",
    "solution": "타원의 장축 및 초점 계산: 타원 $\\frac{x^2}{49} + \\frac{y^2}{40} = 1$에서 $a^2 = 49 \\implies a = 7, 2a = 14$이고 $b^2 = 40$이다.\n초점 좌표 구하기: $c = \\sqrt{49 - 40} = 3$이므로 두 초점은 $\\mathrm{F}(3, 0), \\mathrm{F'}(-3, 0)$이다.\n점들의 일직선 조건: 원 $x^2 + (y-4)^2 = 4$는 타원 내부에 포함되며, 세 점 $\\mathrm{F', P, Q}$는 이 순서대로 일직선 위에 놓이므로 $\\overline{\\mathrm{F'Q}} = \\overline{\\mathrm{F'P}} + \\overline{\\mathrm{PQ}} \\implies \\overline{\\mathrm{PQ}} = \\overline{\\mathrm{F'Q}} - \\overline{\\mathrm{F'P}}$이다.\n타원의 정의 적용: 점 $\\mathrm{Q}$가 타원 위의 점이므로 $\\overline{\\mathrm{F'Q}} + \\overline{\\mathrm{FQ}} = 2a = 14$이다.\n구하는 식 변형: $\\overline{\\mathrm{PQ}} + \\overline{\\mathrm{FQ}} = (\\overline{\\mathrm{F'Q}} - \\overline{\\mathrm{F'P}}) + \\overline{\\mathrm{FQ}} = (\\overline{\\mathrm{F'Q}} + \\overline{\\mathrm{FQ}}) - \\overline{\\mathrm{F'P}} = 14 - \\overline{\\mathrm{F'P}}$\n선분 $\\mathrm{F'P}$의 최솟값 구하기: 원의 중심을 $\\mathrm{C}(0, 4)$라 하면 원의 반지름은 $r = 2$이다. $\\overline{\\mathrm{F'C}} = \\sqrt{(0 - (-3))^2 + (4 - 0)^2} = \\sqrt{9 + 16} = 5$이다.\n원과 외부의 점 사이의 최단거리 공식: 점 $\\mathrm{F'}$에서 원 위의 점 $\\mathrm{P}$까지의 최단거리는 $\\overline{\\mathrm{F'P}} \\ge \\overline{\\mathrm{F'C}} - r = 5 - 2 = 3$이다.\n최댓값 계산: $\\overline{\\mathrm{F'P}} \\ge 3$이므로 $\\overline{\\mathrm{PQ}} + \\overline{\\mathrm{FQ}} = 14 - \\overline{\\mathrm{F'P}} \\le 14 - 3 = 11$이다.\n주의: 목표 식이 $14 - \\overline{\\mathrm{F'P}}$이므로 선분 $\\mathrm{F'P}$의 길이가 최소일 때 전체 식이 최대가 된다.\n따라서 정답은 ②이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-GEO-RPM-042",
    "problemTypeKey": "PT_GEO_ELLIPSE",
    "templateKey": "TPL_GEO_ELLIPSE_EXTREMA",
    "crossConceptKeys": [
      "CC_CIRCLE_CENTER_RADIUS",
      "CC_TRIANGLE_INEQUALITY",
      "CC_DISTANCE_TWO_POINTS"
    ],
    "conditionKeys": [
      "COND_POSITIVE"
    ],
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
    "content": "오른쪽 그림과 같이 타원 $\\frac{x^2}{16} + \\frac{y^2}{12} = 1$의 두 초점 $\\mathrm{F, F'}$에 대하여 점 $\\mathrm{F}$를 중심으로 하고 점 $\\mathrm{F'}$을 지나는 원을 $C$라 하자. 원 $C$와 타원 $\\frac{x^2}{16} + \\frac{y^2}{12} = 1$이 제 2사분면에서 만나는 점을 $\\mathrm{P}$라 할 때, 원 $C$ 위를 움직이는 점 $\\mathrm{Q}$에 대하여 $\\overline{\\mathrm{FQ}} + \\overline{\\mathrm{PQ}} + \\overline{\\mathrm{PF'}}$의 최댓값은? (단, 점 $\\mathrm{F}$의 $x$좌표는 0보다 크다.)\n[그림: 타원 $\\frac{x^2}{16} + \\frac{y^2}{12} = 1$과 초점 $\\mathrm{F}(2, 0)$을 중심으로 하고 다른 초점 $\\mathrm{F'}(-2, 0)$을 지나는 원 $C$가 그려져 있고, 제 2사분면의 교점 $\\mathrm{P}$와 원 위의 점 $\\mathrm{Q}$를 잇는 선분이 표시되어 있음]",
    "choices": [
      "10",
      "12",
      "14",
      "16",
      "18"
    ],
    "answer": "④",
    "solution": "타원의 기본 상수 및 초점 구하기: 타원 $\\frac{x^2}{16} + \\frac{y^2}{12} = 1$에서 $a^2 = 16 \\implies a = 4, 2a = 8$이고 $b^2 = 12$이다.\n초점 좌표 및 원 $C$의 반지름 계산: $c = \\sqrt{16 - 12} = 2$이므로 $\\mathrm{F}(2, 0), \\mathrm{F'}(-2, 0)$이다. 원 $C$의 반지름은 $R = \\overline{\\mathrm{FF'}} = 2 - (-2) = 4$이다.\n선분 $\\mathrm{FQ}$의 길이 파악: 점 $\\mathrm{Q}$가 원 $C$ 위의 점이므로 원의 정의에 의해 $\\overline{\\mathrm{FQ}} = R = 4$이다.\n점 $\\mathrm{P}$에서의 거리 계산: 점 $\\mathrm{P}$는 원 $C$ 위의 점이므로 $\\overline{\\mathrm{PF}} = R = 4$이고, 타원 위의 점이므로 타원의 정의에 의해 $\\overline{\\mathrm{PF}} + \\overline{\\mathrm{PF'}} = 2a = 8$이다.\n선분 $\\mathrm{PF'}$의 길이 도출: $\\overline{\\mathrm{PF'}} = 8 - \\overline{\\mathrm{PF}} = 8 - 4 = 4$이다.\n목표 식의 대입 및 단순화: $\\overline{\\mathrm{FQ}} + \\overline{\\mathrm{PQ}} + \\overline{\\mathrm{PF'}} = 4 + \\overline{\\mathrm{PQ}} + 4 = 8 + \\overline{\\mathrm{PQ}}$\n원 위의 두 점 사이 거리의 최댓값: 점 $\\mathrm{P}$와 $\\mathrm{Q}$는 모두 원 $C$ 위의 점이므로 두 점 사이의 거리 $\\overline{\\mathrm{PQ}}$의 최댓값은 원의 지름인 $2R = 2 \\times 4 = 8$이다.\n최종 최댓값 계산: $8 + \\overline{\\mathrm{PQ}} \\le 8 + 8 = 16$\n등호 성립 조건: 등호는 점 $\\mathrm{Q}$가 점 $\\mathrm{P}$와 원의 중심 $\\mathrm{F}$를 잇는 선분의 연장선 위에 있을 때, 즉 점 $\\mathrm{P}$와 중심 $\\mathrm{F}$에 대해 대칭인 위치에 점 $\\mathrm{Q}$가 놓일 때 성립한다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-GEO-RPM-042",
    "problemTypeKey": "PT_GEO_ELLIPSE",
    "templateKey": "TPL_GEO_ELLIPSE_EXTREMA",
    "crossConceptKeys": [
      "CC_CIRCLE_CENTER_RADIUS",
      "CC_DIAMETER"
    ],
    "conditionKeys": [],
    "integrationPattern": "INTERDEPENDENT"
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
    "content": "그림과 같이 타원 $\\frac{x^2}{9} + \\frac{y^2}{2} = 1$의 두 초점 중 $x$좌표가 양수인 점을 $\\mathrm{F}$, 음수인 점을 $\\mathrm{F'}$이라 하자. 이 타원 위를 움직이는 제 1사분면 위의 점 $\\mathrm{P}$와 삼각형 $\\mathrm{PFQ}$가 정삼각형이 되도록 하는 점 $\\mathrm{Q}$에 대하여 선분 $\\mathrm{QF'}$의 길이가 최대일 때, 삼각형 $\\mathrm{PF'F}$의 넓이는? (단, $\\overline{\\mathrm{PF'}} < \\overline{\\mathrm{QF'}}$이고, 점 $\\mathrm{Q}$는 제 1사분면에 있다.)\n[그림: 타원 $\\frac{x^2}{9} + \\frac{y^2}{2} = 1$과 두 초점 $\\mathrm{F', F}$, 제 1사분면 위의 점 $\\mathrm{P}$, 정삼각형 $\\mathrm{PFQ}$ 및 선분 $\\mathrm{QF'}$이 표시되어 있음]",
    "choices": [
      "\\frac{\\sqrt{3}}{2}",
      "\\sqrt{3}",
      "\\frac{3\\sqrt{3}}{2}",
      "2\\sqrt{3}",
      "3\\sqrt{3}"
    ],
    "answer": "④",
    "solution": "타원의 기본 정보 및 초점 간 거리 계산: 타원 $\\frac{x^2}{9} + \\frac{y^2}{2} = 1$에서 $a^2 = 9 \\implies a = 3, 2a = 6$이고 $b^2 = 2$이다. 초점 거리 공식에 의해 $c^2 = a^2 - b^2 = 9 - 2 = 7$이므로 $\\overline{\\mathrm{F'F}}^2 = (2c)^2 = 4 \\times 7 = 28$이다.\n삼각부등식 적용: 삼각형 $\\mathrm{PF'Q}$에서 $\\overline{\\mathrm{QF'}} \\le \\overline{\\mathrm{PF'}} + \\overline{\\mathrm{PQ}}$이다.\n정삼각형 조건과 타원의 정의 대입: 삼각형 $\\mathrm{PFQ}$가 정삼각형이므로 $\\overline{\\mathrm{PQ}} = \\overline{\\mathrm{PF}}$이다. 따라서 $\\overline{\\mathrm{QF'}} \\le \\overline{\\mathrm{PF'}} + \\overline{\\mathrm{PF}} = 2a = 6$이다.\n선분 길이 최대 조건과 사잇각 계산: $\\overline{\\mathrm{QF'}}$이 최대가 될 때는 등호가 성립하여 세 점 $\\mathrm{F', P, Q}$가 일직선 위에 있을 때이다. 이때 정삼각형의 한 내각 $\\angle \\mathrm{QPF} = 60^\\circ$이므로 $\\angle \\mathrm{F'PF} = 180^\\circ - 60^\\circ = 120^\\circ$이다.\n코사인법칙 적용: $\\overline{\\mathrm{PF'}} = x, \\overline{\\mathrm{PF}} = y$라 하면 타원의 정의에 의해 $x + y = 6$이다. 삼각형 $\\mathrm{PF'F}$에서 코사인법칙을 적용하면 $\\overline{\\mathrm{F'F}}^2 = x^2 + y^2 - 2xy\\cos 120^\\circ$이다.\n곱 $xy$의 값 계산: $\\cos 120^\\circ = -\\frac{1}{2}$이므로 $\\overline{\\mathrm{F'F}}^2 = (x+y)^2 - xy$이다. $28 = 6^2 - xy \\implies xy = 36 - 28 = 8$이다.\n삼각형의 넓이 공식 적용: $\\triangle \\mathrm{PF'F} = \\frac{1}{2} xy \\sin 120^\\circ = \\frac{1}{2} \\times 8 \\times \\frac{\\sqrt{3}}{2} = 2\\sqrt{3}$이다.\n실제 점 $\\mathrm{P}$의 존재성 확인: $t^2 - 6t + 8 = 0$의 두 근은 $t = 2, 4$이므로 제 1사분면에서 $\\overline{\\mathrm{PF'}} = 4, \\overline{\\mathrm{PF}} = 2$인 점 $\\mathrm{P}$가 타원 위에 실제로 존재한다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 5,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B45",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-GEO-RPM-042",
    "problemTypeKey": "PT_GEO_ELLIPSE",
    "templateKey": "TPL_GEO_ELLIPSE_EXTREMA",
    "crossConceptKeys": [
      "CC_EQUILATERAL_TRIANGLE",
      "CC_TRIANGLE_AREA"
    ],
    "conditionKeys": [
      "COND_INEQUALITY_CONSTRAINT"
    ],
    "integrationPattern": "DEEP_COMPOSITE",
    "image": "assets/images/기하_031_타원의정의를이용한거리의합의최대최소_고2_유형은행1/q6-problem.svg",
    "imageAlt": "타원 위 제1사분면 점 P와 초점 F가 이루는 정삼각형 PFQ, 그리고 QF′",
    "imageCaption": "타원 위 제1사분면 점 P와 초점 F가 이루는 정삼각형 PFQ, 그리고 QF′",
    "imageSize": "full"
  }
];
