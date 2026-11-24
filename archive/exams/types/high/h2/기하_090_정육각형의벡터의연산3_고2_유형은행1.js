window.examTitle = "기하_090_정육각형의벡터의연산3_고2_유형은행1";

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
    "content": "그림과 같이 한 변을 공유하는 서로 합동인 두 정육각형에서 $\\vec{BA} = \\vec{a}$, $\\vec{BD} = \\vec{b}$라 하자. $\\vec{BH} = m\\vec{a} + n\\vec{b}$로 나타낼 때, 상수 $m, n$에 대하여 $m+n$의 값은? [그림: 한 변 $EJ$를 공유하는 서로 합동인 두 정육각형 $ABCDEJ$와 $EFGHIJ$가 좌우로 붙어 있다. 왼쪽 정육각형은 위에서부터 시계 반대방향으로 꼭짓점 $A, B, C, D, E, J$이고, 공유변 $EJ$의 오른쪽에 정육각형 $EFGHIJ$가 꼭짓점 $E, F, G, H, I, J$ 순서로 붙어 있다. 벡터 $\\vec{BA}=\\vec{a}$, $\\vec{BD}=\\vec{b}$가 표시되어 있다.]",
    "choices": [
      "1",
      "2",
      "3",
      "4",
      "5"
    ],
    "answer": "④",
    "solution": "1단계(왼쪽 정육각형의 중심을 이용한 기본 벡터 표현): 왼쪽 정육각형의 중심을 $O_1$이라 하면, 점 $O_1$은 대각선 $AD$의 중점이자 정육각형의 대칭중심이므로 $\\vec{BO_1} = \\frac{1}{2}(\\vec{BA} + \\vec{BD}) = \\frac{1}{2}(\\vec{a} + \\vec{b})$이다.\n2단계(두 정육각형의 중심 사이의 벡터 구하기): 오른쪽 정육각형의 중심을 $O_2$라 하면, $\\vec{O_1 O_2} = \\vec{BA} + \\vec{BO_1} = \\vec{a} + \\frac{1}{2}(\\vec{a} + \\vec{b}) = \\frac{3}{2}\\vec{a} + \\frac{1}{2}\\vec{b}$이다.\n3단계(중심 $O_2$에서 꼭짓점 $H$로의 벡터 구하기): 정육각형의 성질에 의해 선분 $O_2 H$는 선분 $BA$와 평행하고 길이가 같으므로 $\\vec{O_2 H} = \\vec{BA} = \\vec{a}$이다.\n4단계(벡터의 덧셈으로 $\\vec{BH}$ 표현): $\\vec{BH} = \\vec{BO_1} + \\vec{O_1 O_2} + \\vec{O_2 H} = \\frac{1}{2}(\\vec{a} + \\vec{b}) + \\left(\\frac{3}{2}\\vec{a} + \\frac{1}{2}\\vec{b}\\right) + \\vec{a} = 3\\vec{a} + \\vec{b}$이다.\n5단계(상수 $m, n$ 결정 및 합 계산): $m=3$, $n=1$이므로 $m+n = 3 + 1 = 4$이다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "low",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-GEO-RPM-067",
    "problemTypeKey": "PT_GEO_PLANE_VECTOR",
    "templateKey": "TPL_GEO_VECTOR_BASIC_OPERATION",
    "crossConceptKeys": [
      "CC_REGULAR_HEXAGON",
      "CC_EQUILATERAL_TRIANGLE"
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
    "content": "그림과 같이 한 변의 길이가 $1$인 두 개의 정육각형이 한 변을 공유하며 평면 위에 놓여 있다. $\\vec{AB} = \\vec{a}$, $\\vec{AJ} = \\vec{b}$라 할 때, 다음 [보기] 중 옳은 것만을 있는 대로 고른 것은? [그림: 한 변 $ID$를 공유하는 합동인 두 정육각형 $ABCDEJ$와 $DEFGHI$가 있다. 왼쪽 정육각형은 위에서부터 시계 방향으로 꼭짓점 $J, I, D, C, B, A$이고, 오른쪽 정육각형은 꼭짓점 $I, H, G, F, E, D$ 순서이다. 변 $AB$와 변 $ID$는 수직이다. 벡터 $\\vec{AB}=\\vec{a}$, $\\vec{AJ}=\\vec{b}$이다.]\n\n<보기>\nㄱ. $\\vec{BE} = 2\\vec{a} + 3\\vec{b}$\nㄴ. $\\vec{AG} = 2\\vec{a} + 4\\vec{b}$\nㄷ. $\\vec{BH} = \\vec{a} + 3\\vec{b}",
    "choices": [
      "ㄱ",
      "ㄴ",
      "ㄱ, ㄴ",
      "ㄴ, ㄷ",
      "ㄱ, ㄴ, ㄷ"
    ],
    "answer": "②",
    "solution": "1단계(기본 벡터의 성분 설정): 점 $A$를 원점 $(0, 0)$이라 두면, 변 $AB$는 $y$축의 음의 방향이므로 $\\vec{a} = \\vec{AB} = (0, -1)$이고, 변 $AJ$는 $x$축 양의 방향과 $30^\\circ$를 이루므로 $\\vec{b} = \\vec{AJ} = \\left(\\frac{\\sqrt{3}}{2}, \\frac{1}{2}\\right)$이다.\n2단계(꼭짓점의 위치 벡터 계산): 점 $E, G, H$의 좌표를 구하면 $E\\left(\\frac{3\\sqrt{3}}{2}, -\\frac{1}{2}\\right)$, $G(2\\sqrt{3}, 0)$, $H\\left(\\frac{3\\sqrt{3}}{2}, \\frac{1}{2}\\right)$이다.\n3단계(보기 ㄱ 판단): $\\vec{BE} = \\vec{AE} - \\vec{AB}$이다. $\\vec{AE} = 2\\vec{a} + 3\\vec{b} = 2(0, -1) + 3\\left(\\frac{\\sqrt{3}}{2}, \\frac{1}{2}\\right) = \\left(\\frac{3\\sqrt{3}}{2}, -\\frac{1}{2}\\right)$이므로 $\\vec{BE} = (2\\vec{a} + 3\\vec{b}) - \\vec{a} = \\vec{a} + 3\\vec{b}$이다. 따라서 ㄱ은 거짓이다.\n4단계(보기 ㄴ 판단): 점 $G$의 위치 벡터는 $\\vec{AG} = (2\\sqrt{3}, 0)$이다. $2\\vec{a} + 4\\vec{b} = 2(0, -1) + 4\\left(\\frac{\\sqrt{3}}{2}, \\frac{1}{2}\\right) = (0, -2) + (2\\sqrt{3}, 2) = (2\\sqrt{3}, 0) = \\vec{AG}$이므로 ㄴ은 참이다.\n5단계(보기 ㄷ 판단): 점 $H$의 위치 벡터는 $\\vec{AH} = \\vec{a} + 3\\vec{b}$이다. 따라서 $\\vec{BH} = \\vec{AH} - \\vec{AB} = (\\vec{a} + 3\\vec{b}) - \\vec{a} = 3\\vec{b}$이다. 따라서 ㄷ은 거짓이다.\n따라서 정답은 ②이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "low",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-GEO-RPM-067",
    "problemTypeKey": "PT_GEO_PLANE_VECTOR",
    "templateKey": "TPL_GEO_VECTOR_BASIC_OPERATION",
    "crossConceptKeys": [
      "CC_REGULAR_HEXAGON",
      "CC_PERPENDICULAR"
    ],
    "conditionKeys": [],
    "integrationPattern": "NONE"
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
    "content": "한 변의 길이가 $1$인 두 개의 정육각형이 그림과 같이 한 변 $EF$를 공유할 때, $|\\vec{CE} + \\vec{AJ} - \\vec{DF}|$의 값은? [그림: 한 변 $EF$를 공유하는 서로 합동인 두 정육각형 $ABCDEF$와 $FEGHIJ$가 좌우로 놓여 있다. 왼쪽 정육각형은 위에서부터 시계 방향으로 꼭짓점 $A, F, E, D, C, B$이고, 오른쪽 정육각형은 꼭짓점 $F, J, I, H, G, E$이다. 공유변 $EF$는 수직 선분이다.]",
    "choices": [
      "\\sqrt{3}",
      "2",
      "3",
      "2\\sqrt{3}",
      "4"
    ],
    "answer": "③",
    "solution": "1단계(벡터의 뺄셈 성질 적용): $-\\vec{DF} = \\vec{FD}$이므로 구하는 식은 $|\\vec{CE} + \\vec{AJ} + \\vec{FD}|$이다.\n2단계(정육각형의 평행 이동 성질): 정육각형 $ABCDEF$에서 선분 $CE$는 공유변 $EF$에 수직이고 길이가 $\\sqrt{3}$이다. 또한 선분 $AJ$도 두 정육각형의 윗변들을 연결하므로 선분 $CE$와 평행하고 길이가 $\\sqrt{3}$이다.\n3단계(좌표 평면 도입): 공유변 $EF$의 중점을 원점 $(0, 0)$이라 하자. 한 변의 길이가 $1$이므로 $E(0, -1/2)$, $F(0, 1/2)$이다. 이때 $C(-\\sqrt{3}, -1/2)$, $A(-\\sqrt{3}/2, 1)$, $J(\\sqrt{3}/2, 1)$, $D(-\\sqrt{3}/2, -1)$이다.\n4단계(각 벡터의 성분 계산): $\\vec{CE} = (\\sqrt{3}, 0)$, $\\vec{AJ} = (\\sqrt{3}, 0)$, $\\vec{FD} = \\left(-\\frac{\\sqrt{3}}{2}, -\\frac{3}{2}\\right)$이다.\n5단계(합 벡터 및 크기 계산): $\\vec{v} = \\vec{CE} + \\vec{AJ} + \\vec{FD} = \\left(\\frac{3\\sqrt{3}}{2}, -\\frac{3}{2}\\right)$이다.\n6단계(크기 계산): $|\\vec{v}|^2 = \\left(\\frac{3\\sqrt{3}}{2}\\right)^2 + \\left(-\\frac{3}{2}\\right)^2 = \\frac{27}{4} + \\frac{9}{4} = \\frac{36}{4} = 9$이므로 $|\\vec{v}| = \\sqrt{9} = 3$이다.\n따라서 정답은 ③이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-GEO-RPM-067",
    "problemTypeKey": "PT_GEO_PLANE_VECTOR",
    "templateKey": "TPL_GEO_VECTOR_BASIC_OPERATION",
    "crossConceptKeys": [
      "CC_REGULAR_HEXAGON",
      "CC_PYTHAGOREAN"
    ],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
  }
];
