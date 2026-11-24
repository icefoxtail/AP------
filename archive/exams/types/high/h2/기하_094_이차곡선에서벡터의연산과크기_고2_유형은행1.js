window.examTitle = "기하_094_이차곡선에서벡터의연산과크기_고2_유형은행1";

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
    "content": "포물선 $y^2=12x$의 초점을 $\\mathrm{F}$라 하자. 그림과 같이 이 포물선 위의 점 $\\mathrm{P}$에 대하여 $|\\vec{OP}+\\vec{OF}|=7$일 때, 선분 $\\mathrm{PF}$의 길이는? (단, $\\mathrm{O}$는 원점이다.)\n\n[그림: 좌표평면 위에 원점 $\\mathrm{O}$, 포물선 $y^2=12x$, 초점 $\\mathrm{F}(3,0)$, 제1사분면에 위치한 포물선 위의 점 $\\mathrm{P}$, 그리고 선분 $\\mathrm{OP}$, $\\mathrm{OF}$, $\\mathrm{PF}$가 그려져 있는 그림]",
    "choices": [
      "3",
      "4",
      "5",
      "6",
      "7"
    ],
    "answer": "③",
    "solution": "1. 포물선 표준형 $y^2 = 4px$에서 $4p = 12$이므로 $p = 3$이다. 따라서 초점의 좌표는 $\\mathrm{F}(3, 0)$이고 준선의 방정식은 $x = -3$이다.\n2. 포물선 위의 점을 $\\mathrm{P}(x_1, y_1)$이라 하면 $y_1^2 = 12x_1$ ($x_1 \\ge 0$)이 성립하고, $\\vec{OP} = (x_1, y_1)$, $\\vec{OF} = (3, 0)$이다.\n3. 두 벡터의 합은 $\\vec{OP}+\\vec{OF} = (x_1+3, y_1)$이므로 그 크기의 제곱을 구하면\n$|\\vec{OP}+\\vec{OF}|^2 = (x_1+3)^2 + y_1^2 = x_1^2 + 6x_1 + 9 + 12x_1 = x_1^2 + 18x_1 + 9$이다.\n4. 조건에서 $|\\vec{OP}+\\vec{OF}| = 7$이므로 양변을 제곱하여 식을 정리하면\n$x_1^2 + 18x_1 + 9 = 49 \\iff x_1^2 + 18x_1 - 40 = 0$이다.\n5. 이차방정식을 인수분해하면 $(x_1+20)(x_1-2) = 0$이고, 포물선 위의 점이므로 $x_1 \\ge 0$에서 $x_1 = 2$이다.\n6. 포물선의 정의에 의하여 점 $\\mathrm{P}$에서 초점 $\\mathrm{F}$까지의 거리는 점 $\\mathrm{P}$에서 준선 $x = -3$까지의 거리와 같으므로\n$\\overline{\\mathrm{PF}} = x_1 - (-3) = 2 + 3 = 5$이다.\n따라서 정답은 ③이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-GEO-RPM-067",
    "problemTypeKey": "PT_GEO_PLANE_VECTOR",
    "templateKey": "TPL_GEO_VECTOR_BASIC_OPERATION",
    "crossConceptKeys": [
      "CC_PARABOLA",
      "CC_DISTANCE_TWO_POINTS"
    ],
    "conditionKeys": [],
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
    "content": "그림에서 타원 $9x^2+25y^2=225$의 두 초점을 $\\mathrm{F, F'}$이라 하자. 이 타원 위의 점 $\\mathrm{P}$가 $|\\vec{OF}+\\vec{OP}|=7$을 만족할 때, 선분 $\\mathrm{PF}$의 길이는? (단, $\\mathrm{O}$는 원점이다.)\n\n[그림: 좌표평면 위의 타원 $9x^2+25y^2=225$와 $x$축 위의 두 초점 $\\mathrm{F, F'}$, 제1사분면 위의 점 $\\mathrm{P}$, 원점에서 점 $\\mathrm{P}$로 그은 벡터 $\\vec{OP}$가 표시된 그림]",
    "choices": [
      "3",
      "4",
      "5",
      "6",
      "7"
    ],
    "answer": "①",
    "solution": "1. 타원의 양변을 225로 나누어 표준형으로 나타내면 $\\frac{x^2}{25} + \\frac{y^2}{9} = 1$이므로 $a^2 = 25$, $b^2 = 9$이다.\n2. 장축의 길이는 $2a = 2 \\times \\sqrt{25} = 2 \\times 5 = 10$이다.\n3. 두 초점 $\\mathrm{F, F'}$은 원점에 대하여 대칭이므로 $\\vec{OF} = -\\vec{OF'}$이 성립한다.\n4. 주어진 벡터의 덧셈 식에 대입하면\n$\\vec{OF}+\\vec{OP} = -\\vec{OF'}+\\vec{OP} = \\vec{OP}-\\vec{OF'} = \\vec{F'P}$이다.\n5. 조건에서 $|\\vec{OF}+\\vec{OP}| = 7$이므로 선분 $\\mathrm{F'P}$의 길이는 $|\\vec{F'P}| = 7$이다.\n6. 타원의 정의에 의하여 타원 위의 임의의 점에서 두 초점까지의 거리의 합은 장축의 길이 10과 같으므로\n$\\overline{\\mathrm{PF}} + \\overline{\\mathrm{F'P}} = 10 \\iff \\overline{\\mathrm{PF}} + 7 = 10 \\iff \\overline{\\mathrm{PF}} = 3$이다.\n주의: $\\vec{OF}+\\vec{OP}$를 성분으로 전개하기보다 원점 대칭인 $\\vec{OF} = -\\vec{OF'}$을 이용하여 $\\vec{F'P}$로 변환해야 계산이 빠르고 정확하다.\n따라서 정답은 ①이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-GEO-RPM-067",
    "problemTypeKey": "PT_GEO_PLANE_VECTOR",
    "templateKey": "TPL_GEO_VECTOR_BASIC_OPERATION",
    "crossConceptKeys": [
      "CC_ELLIPSE",
      "CC_DISTANCE_TWO_POINTS"
    ],
    "conditionKeys": [],
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
    "content": "그림에서 쌍곡선 $\\frac{x^2}{16}-\\frac{y^2}{20}=1$의 한 초점 $\\mathrm{F}(6, 0)$에 대하여 이 쌍곡선 위의 점 $\\mathrm{P}$가 $|\\vec{OP}+\\vec{OF}|=15$를 만족시킬 때, 선분 $\\mathrm{PF}$의 길이는? (단, $\\mathrm{O}$는 원점이고, 점 $\\mathrm{P}$는 제1사분면 위의 점이다.)\n\n[그림: 좌표평면 위의 쌍곡선 $\\frac{x^2}{16}-\\frac{y^2}{20}=1$과 오른쪽 초점 $\\mathrm{F}(6,0)$, 제1사분면 위의 쌍곡선 위의 점 $\\mathrm{P}$, 원점 $\\mathrm{O}$에서 점 $\\mathrm{P}$로의 선분 및 선분 $\\mathrm{PF}$가 표시된 그림]",
    "choices": [
      "5",
      "6",
      "7",
      "8",
      "9"
    ],
    "answer": "③",
    "solution": "1. 쌍곡선의 방정식 $\\frac{x^2}{16}-\\frac{y^2}{20}=1$에서 $a^2 = 16$이므로 주축의 길이는 $2a = 2 \\times 4 = 8$이다.\n2. 쌍곡선의 다른 한 초점을 $\\mathrm{F'}$이라 하면 원점에 대하여 대칭이므로 $\\mathrm{F'}(-6, 0)$이고, $\\vec{OF} = -\\vec{OF'}$이다.\n3. 벡터 뺄셈의 정의에 의해 $\\vec{OP}+\\vec{OF} = \\vec{OP}-\\vec{OF'} = \\vec{F'P}$이다.\n4. 조건에서 $|\\vec{OP}+\\vec{OF}| = 15$이므로 $|\\vec{F'P}| = 15$이다.\n5. 점 $\\mathrm{P}$는 제1사분면 위의 점이므로 초점 $\\mathrm{F'}$보다 초점 $\\mathrm{F}$에 더 가까워 $\\overline{\\mathrm{F'P}} > \\overline{\\mathrm{PF}}$이다.\n6. 쌍곡선의 정의에 의하여 두 초점으로부터의 거리의 차는 주축의 길이와 같으므로\n$\\overline{\\mathrm{F'P}} - \\overline{\\mathrm{PF}} = 2a \\iff 15 - \\overline{\\mathrm{PF}} = 8$이다.\n7. 따라서 선분 $\\mathrm{PF}$의 길이는 $\\overline{\\mathrm{PF}} = 15 - 8 = 7$이다.\n따라서 정답은 ③이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-GEO-RPM-067",
    "problemTypeKey": "PT_GEO_PLANE_VECTOR",
    "templateKey": "TPL_GEO_VECTOR_BASIC_OPERATION",
    "crossConceptKeys": [
      "CC_HYPERBOLA",
      "CC_QUADRANTS"
    ],
    "conditionKeys": [
      "COND_RANGE"
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
    "content": "평면에서 길이가 12인 선분 $\\mathrm{AB}$에 대하여 점 $\\mathrm{P}$가 $|\\vec{PA}|+|\\vec{PB}|=20$을 만족할 때, $|\\vec{PA}+\\vec{PB}|$의 최솟값은?",
    "choices": [
      "10",
      "12",
      "14",
      "16",
      "18"
    ],
    "answer": "④",
    "solution": "1. 선분 $\\mathrm{AB}$의 중점을 $\\mathrm{M}$이라 하면 위치벡터의 성질에 의하여 $\\vec{PA}+\\vec{PB} = 2\\vec{PM}$이 성립한다.\n따라서 구하는 식은 $|\\vec{PA}+\\vec{PB}| = 2|\\vec{PM}|$이다.\n2. 점 $\\mathrm{P}$는 두 점 $\\mathrm{A, B}$로부터의 거리의 합이 20으로 일정하므로, 두 점 $\\mathrm{A, B}$를 초점으로 하고 장축의 길이가 $2a = 20$인 타원 위의 점이다.\n3. 타원의 중심은 선분 $\\mathrm{AB}$의 중점 $\\mathrm{M}$이고, 두 초점 사이의 거리는 선분 $\\mathrm{AB}$의 길이이므로 $2c = 12$이다.\n4. $a = 10, c = 6$이므로 타원의 단축의 반지름의 길이 $b$는 피타고라스 관계에 의해\n$b = \\sqrt{a^2 - c^2} = \\sqrt{10^2 - 6^2} = \\sqrt{100 - 36} = \\sqrt{64} = 8$이다.\n5. 타원의 중심 $\\mathrm{M}$에서 타원 위의 점 $\\mathrm{P}$까지의 거리 $|\\vec{PM}|$은 점 $\\mathrm{P}$가 단축의 양 끝점에 놓일 때 최솟값 $b = 8$을 갖는다.\n6. 따라서 $|\\vec{PA}+\\vec{PB}| = 2|\\vec{PM}|$의 최솟값은 $2 \\times 8 = 16$이다.\n주의: $\\vec{PA}+\\vec{PB}$의 최솟값은 삼각부등식이 아니라 중점 $\\mathrm{M}$을 도입한 후 타원의 단축 반지름을 이용해 구한다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-GEO-RPM-067",
    "problemTypeKey": "PT_GEO_PLANE_VECTOR",
    "templateKey": "TPL_GEO_VECTOR_BASIC_OPERATION",
    "crossConceptKeys": [
      "CC_ELLIPSE",
      "CC_MIDPOINT"
    ],
    "conditionKeys": [],
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
    "content": "타원 $\\frac{x^2}{11}+\\frac{y^2}{25}=1$ 위의 점 $\\mathrm{P}$와 두 초점 $\\mathrm{F, F'}$에 대하여 $|\\vec{PF}+\\vec{PF'}|$의 최댓값은?",
    "choices": [
      "6",
      "7",
      "8",
      "9",
      "10"
    ],
    "answer": "⑤",
    "solution": "1. 타원의 두 초점 $\\mathrm{F, F'}$의 중점은 타원의 중심인 원점 $\\mathrm{O}(0, 0)$이므로 $\\vec{OF}+\\vec{OF'} = \\vec{0}$이다.\n2. 벡터를 원점을 기준으로 분해하면\n$\\vec{PF}+\\vec{PF'} = (\\vec{PO}+\\vec{OF}) + (\\vec{PO}+\\vec{OF'}) = 2\\vec{PO} + (\\vec{OF}+\\vec{OF'}) = 2\\vec{PO} = -2\\vec{OP}$이다.\n3. 따라서 양변의 크기를 취하면 $|\\vec{PF}+\\vec{PF'}| = 2|\\vec{OP}|$이다.\n4. 타원의 방정식 $\\frac{x^2}{11}+\\frac{y^2}{25}=1$에서 $y^2$의 분모가 $x^2$의 분모보다 크므로 장축은 $y$축 위에 놓이며, $b^2 = 25 \\implies b = 5$, $a^2 = 11 \\implies a = \\sqrt{11}$이다.\n5. 타원 위의 임의의 점 $\\mathrm{P}(x, y)$에 대하여 원점과의 거리의 제곱은\n$|\\vec{OP}|^2 = x^2 + y^2 = 11\\left(1 - \\frac{y^2}{25}\\right) + y^2 = 11 + \\frac{14}{25}y^2$이다.\n6. $-5 \\le y \\le 5$이므로 $y^2$의 최댓값은 25이다. 대입하면 $|\\vec{OP}|^2 \\le 11 + 14 = 25$이므로 $|\\vec{OP}|$의 최댓값은 $5$이다.\n7. 따라서 구하는 최댓값은 $2|\\vec{OP}| = 2 \\times 5 = 10$이다.\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-GEO-RPM-067",
    "problemTypeKey": "PT_GEO_PLANE_VECTOR",
    "templateKey": "TPL_GEO_VECTOR_BASIC_OPERATION",
    "crossConceptKeys": [
      "CC_ELLIPSE",
      "CC_TRIANGLE_INEQUALITY"
    ],
    "conditionKeys": [],
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
    "content": "쌍곡선 $\\frac{x^2}{49}-\\frac{y^2}{32}=1$ 위의 임의의 점 $\\mathrm{P}$의 두 초점 $\\mathrm{F, F'}$에 대하여 $|\\vec{PF}+\\vec{PF'}|$의 최솟값은?",
    "choices": [
      "6",
      "8",
      "10",
      "12",
      "14"
    ],
    "answer": "⑤",
    "solution": "1. 쌍곡선의 두 초점 $\\mathrm{F, F'}$은 쌍곡선의 중심인 원점 $\\mathrm{O}(0, 0)$에 대하여 대칭이므로 선분 $\\mathrm{FF'}$의 중점은 $\\mathrm{O}$이다.\n2. 중점 벡터 공식에 의하여 $\\vec{PF}+\\vec{PF'} = 2\\vec{PO}$이므로 $|\\vec{PF}+\\vec{PF'}| = 2|\\vec{PO}| = 2|\\vec{OP}|$이다.\n3. 쌍곡선의 방정식 $\\frac{x^2}{49}-\\frac{y^2}{32}=1$에서 $x^2 = 49\\left(1 + \\frac{y^2}{32}\\right)$이다.\n4. 점 $\\mathrm{P}(x, y)$와 원점 사이의 거리의 제곱은\n$|\\vec{OP}|^2 = x^2 + y^2 = 49 + \\frac{49}{32}y^2 + y^2 = 49 + \\frac{81}{32}y^2$이다.\n5. 모든 실수 $y$에 대하여 $y^2 \\ge 0$이므로 $|\\vec{OP}|^2$의 최솟값은 $y = 0$일 때 49이다. 따라서 $|\\vec{OP}|$의 최솟값은 $\\sqrt{49} = 7$이다.\n6. 점 $\\mathrm{P}$가 쌍곡선의 꼭짓점 $(\\pm 7, 0)$에 위치할 때 원점으로부터의 거리가 최소가 된다.\n7. 따라서 구하는 최솟값은 $2|\\vec{OP}| = 2 \\times 7 = 14$이다.\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-GEO-RPM-067",
    "problemTypeKey": "PT_GEO_PLANE_VECTOR",
    "templateKey": "TPL_GEO_VECTOR_BASIC_OPERATION",
    "crossConceptKeys": [
      "CC_HYPERBOLA",
      "CC_TRIANGLE_INEQUALITY"
    ],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
  }
];
