window.examTitle = "기하_093_정n각형의벡터와합이0인경우_고2_유형은행1";

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
    "content": "정육각형의 각 꼭짓점을 시계 방향으로 차례로 $A, B, C, D, E, F$라 하고 그 중심을 $O$라 할 때,\n$$\\vec{AB}+\\vec{AC}+\\vec{AD}+\\vec{AE}+\\vec{AF}=k\\vec{OA}$$\n를 만족시키는 상수 $k$의 값은?",
    "choices": [
      "$-8$",
      "$-6$",
      "$-4$",
      "$-2$",
      "$0$"
    ],
    "answer": "②",
    "solution": "1단계: 시점을 중심 $O$로 일치시키기 위해 벡터의 뺄셈 $\\vec{AX} = \\vec{OX} - \\vec{OA}$를 적용한다:\n$\\vec{AB} = \\vec{OB} - \\vec{OA}$\n$\\vec{AC} = \\vec{OC} - \\vec{OA}$\n$\\vec{AD} = \\vec{OD} - \\vec{OA}$\n$\\vec{AE} = \\vec{OE} - \\vec{OA}$\n$\\vec{AF} = \\vec{OF} - \\vec{OA}$\n2단계: 좌변의 5개 벡터를 모두 더하여 동류항별로 묶는다:\n$\\vec{AB} + \\vec{AC} + \\vec{AD} + \\vec{AE} + \\vec{AF} = (\\vec{OB} + \\vec{OC} + \\vec{OD} + \\vec{OE} + \\vec{OF}) - 5\\vec{OA}$\n3단계: 정육각형의 중심에서 모든 꼭짓점으로 향하는 벡터의 총합이 영벡터임을 이용한다:\n정육각형의 점대칭성에 의해 $\\vec{OA} + \\vec{OB} + \\vec{OC} + \\vec{OD} + \\vec{OE} + \\vec{OF} = \\vec{0}$\n$\\vec{OB} + \\vec{OC} + \\vec{OD} + \\vec{OE} + \\vec{OF} = -\\vec{OA}$\n4단계: 3단계의 식을 2단계의 식에 대입하여 좌변을 정리한다:\n좌변 $= (-\\vec{OA}) - 5\\vec{OA} = -6\\vec{OA}$\n5단계: 우변 $k\\vec{OA}$와 비교하여 상수 $k$의 값을 구한다:\n$-6\\vec{OA} = k\\vec{OA} \\implies k = -6$\n따라서 정답은 ②이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-GEO-RPM-067",
    "problemTypeKey": "PT_GEO_PLANE_VECTOR",
    "templateKey": "TPL_GEO_VECTOR_BASIC_OPERATION",
    "crossConceptKeys": [
      "CC_REGULAR_HEXAGON"
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
    "content": "반지름의 길이가 $3$인 원에 내접하는 정팔각형 $A_1 A_2 A_3 A_4 A_5 A_6 A_7 A_8$에 대하여\n$$|\\vec{A_1 A_2}+\\vec{A_1 A_3}+\\vec{A_1 A_4}+\\vec{A_1 A_5}+\\vec{A_1 A_6}+\\vec{A_1 A_7}+\\vec{A_1 A_8}|$$\n의 값은?",
    "choices": [
      "$24$",
      "$28$",
      "$32$",
      "$36$",
      "$40$"
    ],
    "answer": "①",
    "solution": "1단계: 정팔각형의 외접원의 중심을 $O$라 하고, 모든 벡터의 시점을 $O$로 변환한다:\n각 $i \\in \\{2, 3, 4, 5, 6, 7, 8\\}$에 대하여 $\\vec{A_1 A_i} = \\vec{OA_i} - \\vec{OA_1}$\n2단계: 주어진 7개 벡터의 합을 구하여 시점 $O$인 벡터들로 정리한다:\n$\\sum_{i=2}^{8} \\vec{A_1 A_i} = \\sum_{i=2}^{8} (\\vec{OA_i} - \\vec{OA_1}) = \\left(\\sum_{i=2}^{8} \\vec{OA_i}\\right) - 7\\vec{OA_1}$\n3단계: 원에 내접하는 정팔각형의 중심에서 8개의 꼭짓점으로 향하는 벡터의 총합은 영벡터이다:\n$\\sum_{i=1}^{8} \\vec{OA_i} = \\vec{OA_1} + \\sum_{i=2}^{8} \\vec{OA_i} = \\vec{0} \\implies \\sum_{i=2}^{8} \\vec{OA_i} = -\\vec{OA_1}$\n4단계: 대입하여 합벡터를 $\\vec{OA_1}$에 대한 하나의 항으로 단순화한다:\n$\\sum_{i=2}^{8} \\vec{A_1 A_i} = (-\\vec{OA_1}) - 7\\vec{OA_1} = -8\\vec{OA_1}$\n5단계: 외접원의 반지름의 길이가 $3$이므로 $|\\vec{OA_1}| = 3$임을 이용하여 벡터의 크기를 계산한다:\n$|-8\\vec{OA_1}| = 8|\\vec{OA_1}| = 8 \\times 3 = 24$\n따라서 정답은 ①이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-GEO-RPM-067",
    "problemTypeKey": "PT_GEO_PLANE_VECTOR",
    "templateKey": "TPL_GEO_VECTOR_BASIC_OPERATION",
    "crossConceptKeys": [
      "CC_CIRCUMCIRCLE",
      "CC_CIRCLE_CENTER_RADIUS"
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
    "content": "그림과 같이 중심이 $O$인 원의 둘레를 $8$등분하는 점을 차례로 $A, B, C, D, E, F, G, H$라 하자. 점 $O$가 아닌 평면 위의 임의의 점 $P$에 대하여\n$$\\vec{PA}+\\vec{PB}+\\vec{PC}+\\vec{PD}+\\vec{PE}+\\vec{PF}+\\vec{PG}+\\vec{PH}=k\\vec{PO}$$\n가 성립할 때, 실수 $k$의 값은?\n[그림: 중심이 O인 원의 둘레에 시계 방향으로 등간격인 8개의 점 A, B, C, D, E, F, G, H가 있고, 원 내부의 점 O와 다른 위치에 점 P가 표시되어 있다.]",
    "choices": [
      "$4$",
      "$5$",
      "$6$",
      "$7$",
      "$8$"
    ],
    "answer": "⑤",
    "solution": "1단계: 시점을 점 $P$에서 중심 $O$를 경유하도록 벡터의 덧셈 법칙으로 분해한다:\n각 점 $X \\in \\{A, B, C, D, E, F, G, H\\}$에 대하여 $\\vec{PX} = \\vec{PO} + \\vec{OX}$\n2단계: 좌변의 8개 벡터의 합에 대입하여 $\\vec{PO}$ 항과 $\\vec{OX}$ 항으로 분리한다:\n좌변 $= 8\\vec{PO} + (\\vec{OA}+\\vec{OB}+\\vec{OC}+\\vec{OD}+\\vec{OE}+\\vec{OF}+\\vec{OG}+\\vec{OH})$\n3단계: 정팔각형의 점대칭성에 의해 마주보는 꼭짓점으로 향하는 벡터의 합이 영벡터임을 적용한다:\n$\\vec{OA} + \\vec{OE} = \\vec{0}$, $\\vec{OB} + \\vec{OF} = \\vec{0}$, $\\vec{OC} + \\vec{OG} = \\vec{0}$, $\\vec{OD} + \\vec{OH} = \\vec{0}$\n따라서 8개 중심 벡터의 합은 $\\vec{0}$이다:\n$\\vec{OA}+\\vec{OB}+\\vec{OC}+\\vec{OD}+\\vec{OE}+\\vec{OF}+\\vec{OG}+\\vec{OH} = \\vec{0}$\n4단계: 3단계의 결과를 2단계의 식에 대입하여 정리한다:\n좌변 $= 8\\vec{PO} + \\vec{0} = 8\\vec{PO}$\n5단계: 우변 $k\\vec{PO}$와 비교하여 실수 $k$의 값을 구한다:\n$8\\vec{PO} = k\\vec{PO} \\implies k = 8$\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-GEO-RPM-067",
    "problemTypeKey": "PT_GEO_PLANE_VECTOR",
    "templateKey": "TPL_GEO_VECTOR_BASIC_OPERATION",
    "crossConceptKeys": [
      "CC_CIRCLE_CENTER_RADIUS"
    ],
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
    "content": "그림과 같이 중심이 $O$인 원 위에 서로 다른 $6$개의 점 $A_1, A_2, B_1, B_2, C_1, C_2$가 있다. 세 선분 $A_1 A_2, B_1 B_2, C_1 C_2$는 모두 이 원의 지름일 때, 다음 중\n$$\\vec{A_1 B_1}+\\vec{C_1 B_2}+\\vec{C_2 A_2}$$\n와 항상 같은 벡터는?\n[그림: 중심이 O인 원 위에 세 지름 선분 A1A2, B1B2, C1C2가 점 O에서 교차하고 있다.]",
    "choices": [
      "$2\\vec{OA_1}$",
      "$2\\vec{OB_1}$",
      "$2\\vec{OC_1}$",
      "$2\\vec{OA_2}$",
      "$2\\vec{OB_2}$"
    ],
    "answer": "④",
    "solution": "1단계: 세 선분 $A_1 A_2, B_1 B_2, C_1 C_2$가 원의 지름이므로 원의 중심 $O$는 각 선분의 중점이다:\n$\\vec{OA_1} + \\vec{OA_2} = \\vec{0} \\implies \\vec{OA_1} = -\\vec{OA_2}$\n$\\vec{OB_1} + \\vec{OB_2} = \\vec{0} \\implies \\vec{OB_2} = -\\vec{OB_1}$\n$\\vec{OC_1} + \\vec{OC_2} = \\vec{0} \\implies \\vec{OC_2} = -\\vec{OC_1}$\n2단계: 주어진 식의 모든 벡터를 중심 $O$를 시점으로 하는 벡터의 뺄셈으로 나타낸다:\n$\\vec{A_1 B_1} = \\vec{OB_1} - \\vec{OA_1}$\n$\\vec{C_1 B_2} = \\vec{OB_2} - \\vec{OC_1}$\n$\\vec{C_2 A_2} = \\vec{OA_2} - \\vec{OC_2}$\n3단계: 세 벡터를 모두 더하여 동류항별로 묶는다:\n$\\vec{A_1 B_1} + \\vec{C_1 B_2} + \\vec{C_2 A_2} = (\\vec{OB_1} + \\vec{OB_2}) - (\\vec{OC_1} + \\vec{OC_2}) + \\vec{OA_2} - \\vec{OA_1}$\n4단계: 1단계의 지름의 대칭성 성질을 대입하여 계산한다:\n$\\vec{OB_1} + \\vec{OB_2} = \\vec{0}$\n$\\vec{OC_1} + \\vec{OC_2} = \\vec{0}$\n$\\vec{OA_2} - \\vec{OA_1} = \\vec{OA_2} - (-\\vec{OA_2}) = 2\\vec{OA_2}$\n5단계: 최종 합벡터를 정리한다:\n$\\vec{0} - \\vec{0} + 2\\vec{OA_2} = 2\\vec{OA_2}$\n따라서 정답은 ④이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-GEO-RPM-067",
    "problemTypeKey": "PT_GEO_PLANE_VECTOR",
    "templateKey": "TPL_GEO_VECTOR_BASIC_OPERATION",
    "crossConceptKeys": [
      "CC_DIAMETER",
      "CC_CIRCLE_CENTER_RADIUS"
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
    "content": "그림과 같이 원에 내접하는 정육각형 $ABCDEF$에서\n$$|\\vec{AB}+\\vec{AC}+\\vec{AD}+\\vec{AE}+\\vec{AF}|=12$$\n일 때, 정육각형 $ABCDEF$의 넓이는?\n[그림: 원에 내접하는 정육각형 ABCDEF가 있고, 꼭짓점 A에서 다른 모든 꼭짓점 B, C, D, E, F로 향하는 벡터들이 그려져 있다.]",
    "choices": [
      "$6\\sqrt{3}$",
      "$12\\sqrt{3}$",
      "$16\\sqrt{3}$",
      "$18\\sqrt{3}$",
      "$24\\sqrt{3}$"
    ],
    "answer": "①",
    "solution": "1단계: 정육각형의 외접원의 중심을 $O$라 하고, 시점을 $O$로 변환하여 벡터들을 분해한다:\n$\\vec{AB} = \\vec{OB}-\\vec{OA}$, $\\vec{AC} = \\vec{OC}-\\vec{OA}$, $\\vec{AD} = \\vec{OD}-\\vec{OA}$, $\\vec{AE} = \\vec{OE}-\\vec{OA}$, $\\vec{AF} = \\vec{OF}-\\vec{OA}$\n2단계: 다섯 개 벡터의 합을 계산하여 동류항으로 묶는다:\n$\\vec{AB} + \\vec{AC} + \\vec{AD} + \\vec{AE} + \\vec{AF} = (\\vec{OB} + \\vec{OC} + \\vec{OD} + \\vec{OE} + \\vec{OF}) - 5\\vec{OA}$\n3단계: 정육각형의 대칭성에 의해 중심에서 각 꼭짓점으로 향하는 벡터의 총합은 $\\vec{0}$이다:\n$\\vec{OA} + \\vec{OB} + \\vec{OC} + \\vec{OD} + \\vec{OE} + \\vec{OF} = \\vec{0} \\implies \\vec{OB} + \\vec{OC} + \\vec{OD} + \\vec{OE} + \\vec{OF} = -\\vec{OA}$\n4단계: 대입하여 합벡터를 단순화하고 외접원의 반지름 $R = |\\vec{OA}|$를 구한다:\n합벡터 $= -\\vec{OA} - 5\\vec{OA} = -6\\vec{OA} = 6\\vec{AO}$\n$|6\\vec{AO}| = 6|\\vec{AO}| = 6R = 12 \\implies R = 2$\n5단계: 정육각형은 한 변의 길이가 외접원의 반지름 $R=2$인 정삼각형 $6$개로 이루어지므로 넓이 공식 $S = 6 \\times \\left(\\frac{\\sqrt{3}}{4}R^2\\right)$을 적용한다:\n$S = 6 \\times \\left(\\frac{\\sqrt{3}}{4} \\times 2^2\\right) = 6 \\times \\left(\\frac{\\sqrt{3}}{4} \\times 4\\right) = 6 \\times \\sqrt{3} = 6\\sqrt{3}$\n따라서 정답은 ①이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-GEO-RPM-067",
    "problemTypeKey": "PT_GEO_PLANE_VECTOR",
    "templateKey": "TPL_GEO_VECTOR_BASIC_OPERATION",
    "crossConceptKeys": [
      "CC_REGULAR_HEXAGON",
      "CC_CIRCUMCIRCLE"
    ],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
  }
];
