window.examTitle = "기하_088_정육각형의벡터의연산1_고2_유형은행1";

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
    "content": "한 변의 길이가 $2$인 정육각형 $\\mathrm{ABCDEF}$가 있다. 시점과 종점이 이 정육각형의 서로 다른 꼭짓점인 벡터 전체의 집합을 $S$라 할 때, $S$의 원소 중에서 크기가 $2\\sqrt{3}$ 이하인 서로 다른 벡터의 개수는? [그림: 한 변의 길이가 $2$인 정육각형 $\\mathrm{ABCDEF}$가 시계 방향 순서로 꼭짓점이 배치되어 있다.]",
    "choices": [
      "6",
      "8",
      "10",
      "12",
      "14"
    ],
    "answer": "④",
    "solution": "정육각형에서 꼭짓점을 시점과 종점으로 하는 벡터는 크기와 방향이 같으면 같은 벡터이다.\n(i) 크기가 2인 벡터의 개수(정육각형의 변을 이루는 벡터):\n정육각형의 마주보는 변은 평행하고 길이가 같으므로\n$\\vec{\\mathrm{AB}} = \\vec{\\mathrm{ED}}$, $\\vec{\\mathrm{BA}} = \\vec{\\mathrm{DE}}$\n$\\vec{\\mathrm{BC}} = \\vec{\\mathrm{FE}}$, $\\vec{\\mathrm{CB}} = \\vec{\\mathrm{EF}}$\n$\\vec{\\mathrm{CD}} = \\vec{\\mathrm{AF}}$, $\\vec{\\mathrm{DC}} = \\vec{\\mathrm{FA}}$\n따라서 크기가 $2$인 서로 다른 벡터는 $6$개이다.\n(ii) 크기가 $2\\sqrt{3}$인 벡터의 개수(한 꼭짓점을 건너뛴 대각선 벡터):\n정육각형에서 한 꼭짓점의 내각이 $120^\\circ$이므로 선분 $\\mathrm{AC}$의 길이는 $2 \\times \\sqrt{3} = 2\\sqrt{3}$이다.\n평행한 대각선 쌍을 찾으면\n$\\vec{\\mathrm{AC}} = \\vec{\\mathrm{FD}}$, $\\vec{\\mathrm{CA}} = \\vec{\\mathrm{DF}}$\n$\\vec{\\mathrm{BD}} = \\vec{\\mathrm{EA}}$, $\\vec{\\mathrm{DB}} = \\vec{\\mathrm{AE}}$\n$\\vec{\\mathrm{CE}} = \\vec{\\mathrm{FB}}$, $\\vec{\\mathrm{EC}} = \\vec{\\mathrm{BF}}$\n따라서 크기가 $2\\sqrt{3}$인 서로 다른 벡터는 $6$개이다.\n주의: 시점과 종점이 다르면 다른 벡터로 오인하여 유향선분의 총 개수($12+12=24$개)로 세지 않도록 주의한다.\n(i), (ii)에 의해 크기가 $2\\sqrt{3}$ 이하인 서로 다른 벡터의 총 개수는\n$6 + 6 = 12$개이다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-GEO-RPM-067",
    "problemTypeKey": "PT_GEO_PLANE_VECTOR",
    "templateKey": "TPL_GEO_VECTOR_BASIC_OPERATION",
    "crossConceptKeys": [
      "CC_REGULAR_HEXAGON",
      "CC_DISTANCE_TWO_POINTS"
    ],
    "conditionKeys": [
      "COND_PAIRWISE_DISTINCT_POINTS",
      "COND_UPPER_BOUND"
    ],
    "integrationPattern": "CASE_BRANCH"
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
    "content": "오른쪽 그림과 같이 한 변의 길이가 $2$인 정육각형 $\\mathrm{ABCDEF}$에서 세 대각선의 교점을 $\\mathrm{O}$라 하자. 점 $\\mathrm{A, B, C, D, E, F, O}$ 중 서로 다른 두 점을 각각 시점과 종점으로 하는 벡터에 대하여 다음 중 옳지 않은 것은? [그림: 한 변의 길이가 $2$인 정육각형 $\\mathrm{ABCDEF}$와 세 대각선 $\\mathrm{AD, BE, CF}$의 교점 $\\mathrm{O}$가 표시되어 있다.]",
    "choices": [
      "$\\vec{\\mathrm{BC}}$와 크기와 방향이 모두 같은 벡터는 $\\vec{\\mathrm{BC}}$를 포함하여 $4$개이다.",
      "$\\vec{\\mathrm{BE}}$와 방향이 같은 벡터는 $\\vec{\\mathrm{BE}}$를 포함하여 $4$개이다.",
      "$|\\vec{\\mathrm{AE}}| = 2\\sqrt{3}$",
      "$\\vec{\\mathrm{AB}} + \\vec{\\mathrm{AF}} - \\vec{\\mathrm{AO}} = \\vec{0}$",
      "$|\\vec{\\mathrm{AB}} - \\vec{\\mathrm{CB}} + \\vec{\\mathrm{CD}}| = 4$"
    ],
    "answer": "②",
    "solution": "각 보기를 정육각형의 기하학적 성질과 벡터의 덧셈·뺄셈을 이용하여 판별한다.\n① 벡터의 상등에 의해 $\\vec{\\mathrm{BC}}$와 크기와 방향이 모두 같은 벡터는\n$\\vec{\\mathrm{BC}}, \\vec{\\mathrm{AO}}, \\vec{\\mathrm{OD}}, \\vec{\\mathrm{FE}}$의 $4$개이다. (참)\n② $\\vec{\\mathrm{BE}}$와 방향이 같은 벡터를 구하면\n(i) 선분 $\\mathrm{BE}$ 위의 벡터: $\\vec{\\mathrm{BO}}, \\vec{\\mathrm{OE}}, \\vec{\\mathrm{BE}}$ ($3$개)\n(ii) 선분 $\\mathrm{BE}$와 평행하고 방향이 같은 변의 벡터: $\\vec{\\mathrm{CD}}, \\vec{\\mathrm{AF}}$ ($2$개)\n따라서 $\\vec{\\mathrm{BE}}$와 방향이 같은 벡터는 $3 + 2 = 5$개이다. 그러므로 $4$개라고 한 것은 옳지 않다. (거짓)\n③ 선분 $\\mathrm{AE}$의 길이는 정육각형의 짧은 대각선이므로\n$|\\vec{\\mathrm{AE}}| = 2 \\times 2 \\cos 30^\\circ = 4 \\times \\frac{\\sqrt{3}}{2} = 2\\sqrt{3}$이다. (참)\n④ 사각형 $\\mathrm{ABOF}$는 네 변의 길이가 $2$인 마름모이므로 평행사변형 법칙에 의해\n$\\vec{\\mathrm{AB}} + \\vec{\\mathrm{AF}} = \\vec{\\mathrm{AO}}$이다.\n양변에서 $\\vec{\\mathrm{AO}}$를 빼면 $\\vec{\\mathrm{AB}} + \\vec{\\mathrm{AF}} - \\vec{\\mathrm{AO}} = \\vec{0}$이다. (참)\n⑤ 벡터의 뺄셈 성질 $-\\vec{\\mathrm{CB}} = \\vec{\\mathrm{BC}}$를 대입하여 정리하면\n$\\vec{\\mathrm{AB}} - \\vec{\\mathrm{CB}} + \\vec{\\mathrm{CD}} = \\vec{\\mathrm{AB}} + \\vec{\\mathrm{BC}} + \\vec{\\mathrm{CD}} = \\vec{\\mathrm{AD}}$\n대각선 $\\mathrm{AD}$의 길이는 한 변의 길이의 $2$배이므로 $|\\vec{\\mathrm{AD}}| = 2 \\times 2 = 4$이다. (참)\n따라서 정답은 ②이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-GEO-RPM-067",
    "problemTypeKey": "PT_GEO_PLANE_VECTOR",
    "templateKey": "TPL_GEO_VECTOR_BASIC_OPERATION",
    "crossConceptKeys": [
      "CC_REGULAR_HEXAGON",
      "CC_MIDPOINT"
    ],
    "conditionKeys": [
      "COND_PAIRWISE_DISTINCT_POINTS"
    ],
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
    "content": "그림과 같이 정육각형 $\\mathrm{ABCDEF}$에서 $\\vec{\\mathrm{CB}} = \\vec{a}$, $\\vec{\\mathrm{CD}} = \\vec{b}$라 할 때, 다음 [보기]에서 옳은 것만을 있는 대로 고른 것은? [그림: 정육각형 $\\mathrm{ABCDEF}$에서 꼭짓점 $\\mathrm{C}$를 시점으로 하는 두 벡터 $\\vec{\\mathrm{CB}} = \\vec{a}$, $\\vec{\\mathrm{CD}} = \\vec{b}$가 화살표로 표시되어 있다.]\n\n<보기>\nㄱ. $\\vec{\\mathrm{BF}} = \\vec{a} + 2\\vec{b}$\nㄴ. $\\vec{\\mathrm{AC}} = 2\\vec{a} + \\vec{b}$\nㄷ. $\\vec{\\mathrm{DF}} = \\vec{a} + 2\\vec{b}$",
    "choices": [
      "ㄱ",
      "ㄷ",
      "ㄱ, ㄴ",
      "ㄴ, ㄷ",
      "ㄱ, ㄴ, ㄷ"
    ],
    "answer": "①",
    "solution": "정육각형의 세 대각선의 교점을 $\\mathrm{O}$라 하고 중심 $\\mathrm{O}$에 대한 위치벡터를 설정한다.\n정육각형에서 $\\angle \\mathrm{BCD} = 120^\\circ$이고 $|\\vec{a}| = |\\vec{b}|$이므로 사각형 $\\mathrm{OBCD}$에서\n$\\vec{\\mathrm{CO}} = \\vec{\\mathrm{CB}} + \\vec{\\mathrm{CD}} = \\vec{a} + \\vec{b}$이다.\n중심 $\\mathrm{O}$를 시점으로 하는 각 꼭짓점의 위치벡터를 구하면\n$\\vec{\\mathrm{OC}} = -(\\vec{a} + \\vec{b})$\n$\\vec{\\mathrm{OB}} = \\vec{\\mathrm{OC}} + \\vec{\\mathrm{CB}} = -(\\vec{a} + \\vec{b}) + \\vec{a} = -\\vec{b}$\n$\\vec{\\mathrm{OD}} = \\vec{\\mathrm{OC}} + \\vec{\\mathrm{CD}} = -(\\vec{a} + \\vec{b}) + \\vec{b} = -\\vec{a}$\n대칭성에 의해 마주보는 점들의 위치벡터는\n$\\vec{\\mathrm{OF}} = -\\vec{\\mathrm{OC}} = \\vec{a} + \\vec{b}$\n$\\vec{\\mathrm{OE}} = -\\vec{\\mathrm{OB}} = \\vec{b}$\n$\\vec{\\mathrm{OA}} = -\\vec{\\mathrm{OD}} = \\vec{a}$\n이제 각 보기를 위치벡터의 차로 계산한다.\nㄱ. $\\vec{\\mathrm{BF}} = \\vec{\\mathrm{OF}} - \\vec{\\mathrm{OB}} = (\\vec{a} + \\vec{b}) - (-\\vec{b}) = \\vec{a} + 2\\vec{b}$ (참)\nㄴ. $\\vec{\\mathrm{AC}} = \\vec{\\mathrm{OC}} - \\vec{\\mathrm{OA}} = (-\\vec{a} - \\vec{b}) - \\vec{a} = -2\\vec{a} - \\vec{b}$이다.\n주의: 시점과 종점의 방향을 반대로 계산하면 $2\\vec{a} + \\vec{b}$로 부호 실수가 발생한다. (거짓)\nㄷ. $\\vec{\\mathrm{DF}} = \\vec{\\mathrm{OF}} - \\vec{\\mathrm{OD}} = (\\vec{a} + \\vec{b}) - (-\\vec{a}) = 2\\vec{a} + \\vec{b}$이다. 그러므로 $\\vec{a} + 2\\vec{b}$가 아니다. (거짓)\n따라서 옳은 것은 ㄱ이다.\n따라서 정답은 ①이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-GEO-RPM-067",
    "problemTypeKey": "PT_GEO_PLANE_VECTOR",
    "templateKey": "TPL_GEO_VECTOR_BASIC_OPERATION",
    "crossConceptKeys": [
      "CC_REGULAR_HEXAGON",
      "CC_EQUILATERAL_TRIANGLE"
    ],
    "conditionKeys": [],
    "integrationPattern": "NONE"
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
    "content": "그림과 같이 정육각형 $\\mathrm{ABCDEF}$에서 $\\vec{\\mathrm{FA}} = \\vec{a}$, $\\vec{\\mathrm{AB}} = \\vec{b}$라 할 때, 다음 [보기]에서 옳은 것만을 있는 대로 고른 것은? [그림: 정육각형 $\\mathrm{ABCDEF}$에서 변 $\\mathrm{FA}$에 벡터 $\\vec{a}$, 변 $\\mathrm{AB}$에 벡터 $\\vec{b}$가 표시되어 있다.]\n\n<보기>\nㄱ. $\\vec{\\mathrm{AD}} = -2\\vec{a} + 2\\vec{b}$\nㄴ. $\\vec{\\mathrm{AC}} = -\\vec{a} + 2\\vec{b}$\nㄷ. $\\vec{\\mathrm{EB}} = 2\\vec{a}$",
    "choices": [
      "ㄱ",
      "ㄴ",
      "ㄱ, ㄷ",
      "ㄴ, ㄷ",
      "ㄱ, ㄴ, ㄷ"
    ],
    "answer": "⑤",
    "solution": "정육각형의 세 대각선의 교점을 $\\mathrm{O}$라 하고 주어진 벡터로 각 벡터를 표현한다.\n(i) 중심 $\\mathrm{O}$에 대하여 사각형 $\\mathrm{ABOF}$는 마름모이므로\n$\\vec{\\mathrm{AO}} = \\vec{\\mathrm{AF}} + \\vec{\\mathrm{AB}} = -\\vec{\\mathrm{FA}} + \\vec{\\mathrm{AB}} = -\\vec{a} + \\vec{b}$\n대각선 $\\mathrm{AD}$는 중심 $\\mathrm{O}$에 의해 이등분되므로 $\\vec{\\mathrm{AD}} = 2\\vec{\\mathrm{AO}}$이다.\n따라서 $\\vec{\\mathrm{AD}} = 2(-\\vec{a} + \\vec{b}) = -2\\vec{a} + 2\\vec{b}$이다. 그러므로 ㄱ은 참이다.\n(ii) 정육각형에서 변 $\\mathrm{BC}$는 선분 $\\mathrm{AO}$와 평행하고 길이가 같으므로\n$\\vec{\\mathrm{BC}} = \\vec{\\mathrm{AO}} = -\\vec{a} + \\vec{b}$\n벡터의 덧셈에 의해 $\\vec{\\mathrm{AC}} = \\vec{\\mathrm{AB}} + \\vec{\\mathrm{BC}}$이므로\n$\\vec{\\mathrm{AC}} = \\vec{b} + (-\\vec{a} + \\vec{b}) = -\\vec{a} + 2\\vec{b}$\n그러므로 ㄴ은 참이다.\n(iii) 정육각형에서 대각선 $\\mathrm{EB}$는 변 $\\mathrm{FA}$와 평행하고 길이가 $2$배이며 방향이 같다.\n실제로 사각형 $\\mathrm{ABOF}$와 $\\mathrm{EODC}$에서\n$\\vec{\\mathrm{EB}} = \\vec{\\mathrm{EO}} + \\vec{\\mathrm{OB}} = \\vec{\\mathrm{OD}} + \\vec{\\mathrm{OB}}$\n$\\vec{\\mathrm{EO}} = \\vec{\\mathrm{FA}} = \\vec{a}$이고 $\\vec{\\mathrm{OB}} = \\vec{\\mathrm{FA}} = \\vec{a}$이므로\n$\\vec{\\mathrm{EB}} = \\vec{a} + \\vec{a} = 2\\vec{a}$\n그러므로 ㄷ은 참이다.\n따라서 ㄱ, ㄴ, ㄷ 모두 옳다.\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-GEO-RPM-067",
    "problemTypeKey": "PT_GEO_PLANE_VECTOR",
    "templateKey": "TPL_GEO_VECTOR_BASIC_OPERATION",
    "crossConceptKeys": [
      "CC_REGULAR_HEXAGON",
      "CC_EQUILATERAL_TRIANGLE"
    ],
    "conditionKeys": [],
    "integrationPattern": "NONE"
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
    "content": "그림과 같이 정육각형 $\\mathrm{ABCDEF}$에서 $\\vec{\\mathrm{FA}} = \\vec{a}$, $\\vec{\\mathrm{FB}} = \\vec{b}$라 할 때, 다음 [보기]에서 옳은 것만을 있는 대로 고른 것은? [그림: 정육각형 $\\mathrm{ABCDEF}$에서 변 $\\mathrm{FA}$에 벡터 $\\vec{a}$, 대각선 $\\mathrm{FB}$에 벡터 $\\vec{b}$가 표시되어 있다.]\n\n<보기>\nㄱ. $\\vec{\\mathrm{AB}} = -\\vec{a} + \\vec{b}$\nㄴ. $\\vec{\\mathrm{FE}} = 2\\vec{a} - \\vec{b}$\nㄷ. $\\vec{\\mathrm{AD}} = -4\\vec{a} + 2\\vec{b}$",
    "choices": [
      "ㄱ",
      "ㄴ",
      "ㄱ, ㄴ",
      "ㄱ, ㄷ",
      "ㄱ, ㄴ, ㄷ"
    ],
    "answer": "④",
    "solution": "정육각형의 성질과 벡터의 기본 연산을 이용하여 각 벡터를 $\\vec{a}, \\vec{b}$로 나타낸다.\nㄱ. 삼각형 $\\mathrm{FAB}$에서 벡터의 뺄셈에 의해\n$\\vec{\\mathrm{AB}} = \\vec{\\mathrm{FB}} - \\vec{\\mathrm{FA}} = \\vec{b} - \\vec{a} = -\\vec{a} + \\vec{b}$이다. (참)\nㄴ. 정육각형의 세 대각선의 교점을 $\\mathrm{O}$라 하면 대각선 $\\mathrm{FC}$는 변 $\\mathrm{AB}$와 평행하고 길이가 $2$배이므로\n$\\vec{\\mathrm{FC}} = 2\\vec{\\mathrm{AB}} = 2(-\\vec{a} + \\vec{b}) = -2\\vec{a} + 2\\vec{b}$\n점 $\\mathrm{O}$는 선분 $\\mathrm{FC}$의 중점이므로 $\\vec{\\mathrm{FO}} = \\frac{1}{2}\\vec{\\mathrm{FC}} = -\\vec{a} + \\vec{b}$\n마름모 $\\mathrm{FAEO}$에서 $\\vec{\\mathrm{FO}} = \\vec{\\mathrm{FA}} + \\vec{\\mathrm{FE}}$이므로\n$\\vec{\\mathrm{FE}} = \\vec{\\mathrm{FO}} - \\vec{\\mathrm{FA}} = (-\\vec{a} + \\vec{b}) - \\vec{a} = -2\\vec{a} + \\vec{b}$\n주의: 식의 부호를 반대로 쓰면 $2\\vec{a} - \\vec{b}$가 되므로 오답에 주의한다. (거짓)\nㄷ. 정육각형에서 대각선 $\\mathrm{AD}$는 변 $\\mathrm{FE}$와 평행하고 길이가 $2$배이며 방향이 같다.\n따라서 $\\vec{\\mathrm{AD}} = 2\\vec{\\mathrm{FE}}$이다.\nㄴ에서 구한 $\\vec{\\mathrm{FE}} = -2\\vec{a} + \\vec{b}$를 대입하면\n$\\vec{\\mathrm{AD}} = 2(-2\\vec{a} + \\vec{b}) = -4\\vec{a} + 2\\vec{b}$이다. (참)\n따라서 옳은 것은 ㄱ, ㄷ이다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-GEO-RPM-067",
    "problemTypeKey": "PT_GEO_PLANE_VECTOR",
    "templateKey": "TPL_GEO_VECTOR_BASIC_OPERATION",
    "crossConceptKeys": [
      "CC_REGULAR_HEXAGON",
      "CC_EQUILATERAL_TRIANGLE",
      "CC_DIAGONALS"
    ],
    "conditionKeys": [],
    "integrationPattern": "NONE"
  }
];
