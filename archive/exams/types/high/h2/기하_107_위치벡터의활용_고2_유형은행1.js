window.examTitle = "기하_107_위치벡터의활용_고2_유형은행1";

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
    "content": "삼각형 $\\mathrm{ABC}$에 대하여 등식\n$$\\vec{\\mathrm{PA}} + \\vec{\\mathrm{PB}} + 2\\vec{\\mathrm{PC}} = \\vec{\\mathrm{CA}}$$\n를 만족시키는 점 $\\mathrm{P}$의 위치로 옳은 것은?",
    "choices": [
      "변 $\\mathrm{AB}$를 $1:3$으로 내분하는 점",
      "변 $\\mathrm{AB}$를 $3:1$로 내분하는 점",
      "변 $\\mathrm{BC}$를 $1:3$으로 내분하는 점",
      "변 $\\mathrm{BC}$를 $3:1$로 내분하는 점",
      "변 $\\mathrm{AC}$를 $3:1$로 내분하는 점"
    ],
    "answer": "④",
    "solution": "위치벡터의 뺄셈을 이용하여 우변의 벡터 $\\vec{\\mathrm{CA}}$의 시점을 $\\mathrm{P}$로 분해하면\n$\\vec{\\mathrm{CA}} = \\vec{\\mathrm{PA}} - \\vec{\\mathrm{PC}}$\n주어진 등식의 우변에 이를 대입하면\n$\\vec{\\mathrm{PA}} + \\vec{\\mathrm{PB}} + 2\\vec{\\mathrm{PC}} = \\vec{\\mathrm{PA}} - \\vec{\\mathrm{PC}}$\n양변에서 $\\vec{\\mathrm{PA}}$를 소거하고 이항하여 정리하면\n$\\vec{\\mathrm{PB}} + 2\\vec{\\mathrm{PC}} + \\vec{\\mathrm{PC}} = \\vec{0} \\implies \\vec{\\mathrm{PB}} + 3\\vec{\\mathrm{PC}} = \\vec{0}$\n이를 한 벡터에 관해 나타내면\n$\\vec{\\mathrm{PB}} = -3\\vec{\\mathrm{PC}}$\n벡터의 실수배 성질에 의해 두 벡터 $\\vec{\\mathrm{PB}}$와 $\\vec{\\mathrm{PC}}$는 방향이 반대이고 크기의 비는 다음과 같다.\n$|\\vec{\\mathrm{PB}}| : |\\vec{\\mathrm{PC}}| = 3 : 1$\n따라서 점 $\\mathrm{P}$는 선분 $\\mathrm{BC}$ 위에 존재하며, 변 $\\mathrm{BC}$를 $3:1$로 내분하는 점이다.\n주의: $\\vec{\\mathrm{PB}} = -3\\vec{\\mathrm{PC}}$에서 $\\mathrm{P}$로부터 $\\mathrm{B}$까지의 거리가 $\\mathrm{C}$까지 거리의 $3$배이므로 내분비는 $1:3$이 아니라 $3:1$이다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-GEO-RPM-068",
    "problemTypeKey": "PT_GEO_PLANE_VECTOR",
    "templateKey": "TPL_GEO_PLANE_VECTOR_POSITION",
    "crossConceptKeys": [
      "CC_INTERNAL_DIVISION"
    ],
    "conditionKeys": [],
    "integrationPattern": "REINTERPRETATION"
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
    "content": "평면 위의 점 $\\mathrm{P}$와 삼각형 $\\mathrm{ABC}$에 대하여 등식\n$$\\vec{\\mathrm{PA}} + 3\\vec{\\mathrm{PB}} + 2\\vec{\\mathrm{PC}} = \\vec{\\mathrm{BA}}$$\n가 성립할 때, 다음 [보기] 중 옳은 것은?\n\n[보기]\nㄱ. 세 점 $\\mathrm{P}, \\mathrm{A}, \\mathrm{C}$는 한 직선 위에 있다.\nㄴ. 점 $\\mathrm{P}$는 변 $\\mathrm{BC}$를 $1:2$로 내분하는 점이다.\nㄷ. $\\triangle \\mathrm{ABP} : \\triangle \\mathrm{ACP} = 2 : 1$",
    "choices": [
      "ㄱ",
      "ㄴ",
      "ㄱ, ㄷ",
      "ㄴ, ㄷ",
      "ㄱ, ㄴ, ㄷ"
    ],
    "answer": "②",
    "solution": "위치벡터의 뺄셈을 이용하여 우변의 $\\vec{\\mathrm{BA}}$를 시점 $\\mathrm{P}$로 분해하면\n$\\vec{\\mathrm{BA}} = \\vec{\\mathrm{PA}} - \\vec{\\mathrm{PB}}$\n이를 주어진 등식에 대입하면\n$\\vec{\\mathrm{PA}} + 3\\vec{\\mathrm{PB}} + 2\\vec{\\mathrm{PC}} = \\vec{\\mathrm{PA}} - \\vec{\\mathrm{PB}}$\n양변에서 $\\vec{\\mathrm{PA}}$를 소거하고 $-\\vec{\\mathrm{PB}}$를 이항하여 정리하면\n$4\\vec{\\mathrm{PB}} + 2\\vec{\\mathrm{PC}} = \\vec{0} \\implies 2\\vec{\\mathrm{PB}} + \\vec{\\mathrm{PC}} = \\vec{0}$\n이를 변형하면 $\\vec{\\mathrm{PC}} = -2\\vec{\\mathrm{PB}}$이다.\nㄱ: 점 $\\mathrm{P}$는 변 $\\mathrm{BC}$ 위의 점이므로 삼각형 $\\mathrm{ABC}$의 꼭짓점 $\\mathrm{A}, \\mathrm{C}$와 함께 한 직선 위에 있을 수 없다. (거짓)\nㄴ: $\\vec{\\mathrm{PC}} = -2\\vec{\\mathrm{PB}}$에서 두 벡터의 방향은 반대이고 $|\\vec{\\mathrm{PB}}| : |\\vec{\\mathrm{PC}}| = 1 : 2$이므로, 점 $\\mathrm{P}$는 선분 $\\mathrm{BC}$ 위에 있고 변 $\\mathrm{BC}$를 $1:2$로 내분하는 점이다. (참)\nㄷ: 두 삼각형 $\\mathrm{ABP}$와 $\\mathrm{ACP}$는 꼭짓점 $\\mathrm{A}$를 공유하므로 높이가 같고, 밑변의 길이는 각각 $\\overline{\\mathrm{BP}}, \\overline{\\mathrm{PC}}$이다. 따라서 넓이의 비는 밑변의 길이의 비와 같으므로\n$\\triangle \\mathrm{ABP} : \\triangle \\mathrm{ACP} = \\overline{\\mathrm{BP}} : \\overline{\\mathrm{PC}} = 1 : 2$\n이므로 $2:1$은 옳지 않다. (거짓)\n주의: 선분의 내분비와 넓이의 비를 계산할 때 $\\mathrm{BP} : \\mathrm{PC} = 1:2$이므로 비의 순서를 혼동하지 않도록 주의한다.\n따라서 정답은 ②이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-GEO-RPM-068",
    "problemTypeKey": "PT_GEO_PLANE_VECTOR",
    "templateKey": "TPL_GEO_PLANE_VECTOR_POSITION",
    "crossConceptKeys": [
      "CC_INTERNAL_DIVISION",
      "CC_TRIANGLE_AREA"
    ],
    "conditionKeys": [],
    "integrationPattern": "INTERDEPENDENT"
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
    "content": "평면 위의 점 $\\mathrm{P}$와 삼각형 $\\mathrm{ABC}$에 대하여 등식\n$$\\vec{\\mathrm{PA}} + 2\\vec{\\mathrm{PB}} + \\vec{\\mathrm{PC}} = \\vec{\\mathrm{BC}}$$\n가 성립할 때, 다음 [보기] 중 옳은 것은?\n\n[보기]\nㄱ. 세 점 $\\mathrm{B}, \\mathrm{P}, \\mathrm{C}$는 한 직선 위에 있다.\nㄴ. 점 $\\mathrm{P}$는 변 $\\mathrm{AB}$를 $3:1$로 내분하는 점이다.\nㄷ. $\\triangle \\mathrm{CAP} : \\triangle \\mathrm{CBP} = 1 : 3$",
    "choices": [
      "ㄱ",
      "ㄴ",
      "ㄱ, ㄴ",
      "ㄴ, ㄷ",
      "ㄱ, ㄴ, ㄷ"
    ],
    "answer": "②",
    "solution": "위치벡터의 뺄셈을 이용하여 우변의 $\\vec{\\mathrm{BC}}$를 시점 $\\mathrm{P}$로 분해하면\n$\\vec{\\mathrm{BC}} = \\vec{\\mathrm{PC}} - \\vec{\\mathrm{PB}}$\n이를 주어진 등식에 대입하면\n$\\vec{\\mathrm{PA}} + 2\\vec{\\mathrm{PB}} + \\vec{\\mathrm{PC}} = \\vec{\\mathrm{PC}} - \\vec{\\mathrm{PB}}$\n양변에서 $\\vec{\\mathrm{PC}}$를 소거하고 우변의 $-\\vec{\\mathrm{PB}}$를 좌변으로 이항하면\n$\\vec{\\mathrm{PA}} + 3\\vec{\\mathrm{PB}} = \\vec{0} \\implies \\vec{\\mathrm{PA}} = -3\\vec{\\mathrm{PB}}$\nㄱ: 점 $\\mathrm{P}$는 선분 $\\mathrm{AB}$ 위의 점이고 삼각형 $\\mathrm{ABC}$에서 점 $\\mathrm{C}$는 직선 $\\mathrm{AB}$ 위에 있지 않으므로 세 점 $\\mathrm{B}, \\mathrm{P}, \\mathrm{C}$는 한 직선 위에 있을 수 없다. (거짓)\nㄴ: $\\vec{\\mathrm{PA}} = -3\\vec{\\mathrm{PB}}$에서 두 벡터는 방향이 반대이고 크기의 비는 $|\\vec{\\mathrm{PA}}| : |\\vec{\\mathrm{PB}}| = 3 : 1$이다. 따라서 점 $\\mathrm{P}$는 변 $\\mathrm{AB}$를 $3:1$로 내분하는 점이다. (참)\nㄷ: 두 삼각형 $\\mathrm{CAP}$와 $\\mathrm{CBP}$는 꼭짓점 $\\mathrm{C}$를 공유하므로 높이가 같고, 밑변의 길이는 각각 $\\overline{\\mathrm{AP}}, \\overline{\\mathrm{PB}}$이다. 따라서 넓이의 비는\n$\\triangle \\mathrm{CAP} : \\triangle \\mathrm{CBP} = \\overline{\\mathrm{AP}} : \\overline{\\mathrm{PB}} = 3 : 1$\n이므로 $1:3$은 옳지 않다. (거짓)\n주의: $\\mathrm{AP} : \\mathrm{PB} = 3:1$이므로 밑변이 $\\mathrm{AP}$인 삼각형 $\\mathrm{CAP}$의 넓이가 더 크다.\n따라서 정답은 ②이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-GEO-RPM-068",
    "problemTypeKey": "PT_GEO_PLANE_VECTOR",
    "templateKey": "TPL_GEO_PLANE_VECTOR_POSITION",
    "crossConceptKeys": [
      "CC_INTERNAL_DIVISION",
      "CC_TRIANGLE_AREA"
    ],
    "conditionKeys": [],
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
    "content": "삼각형 $\\mathrm{ABC}$ 내부의 한 점 $\\mathrm{P}$에 대하여\n$$5\\vec{\\mathrm{AP}} + 2\\vec{\\mathrm{BP}} + 3\\vec{\\mathrm{CP}} = \\vec{0}$$\n이 성립한다. 선분 $\\mathrm{AP}$의 연장선이 선분 $\\mathrm{BC}$와 만나는 점을 $\\mathrm{D}$라 할 때, [보기]에서 옳은 것만을 있는 대로 고른 것은?\n\n[보기]\nㄱ. $\\overline{\\mathrm{BD}} : \\overline{\\mathrm{DC}} = 3 : 2$\nㄴ. $\\overline{\\mathrm{AP}} : \\overline{\\mathrm{PD}} = 2 : 1$\nㄷ. 삼각형 $\\mathrm{BPD}$의 넓이가 $3$일 때, 삼각형 $\\mathrm{ABC}$의 넓이는 $15$이다.",
    "choices": [
      "ㄱ",
      "ㄴ",
      "ㄱ, ㄷ",
      "ㄴ, ㄷ",
      "ㄱ, ㄴ, ㄷ"
    ],
    "answer": "①",
    "solution": "주어진 등식의 모든 벡터를 점 $\\mathrm{P}$를 시점으로 바꾸기 위해 $\\vec{\\mathrm{XP}} = -\\vec{\\mathrm{PX}}$를 적용하면\n$-5\\vec{\\mathrm{PA}} - 2\\vec{\\mathrm{PB}} - 3\\vec{\\mathrm{PC}} = \\vec{0} \\implies 5\\vec{\\mathrm{PA}} = -(2\\vec{\\mathrm{PB}} + 3\\vec{\\mathrm{PC}})$\n선분 $\\mathrm{BC}$를 $3:2$로 내분하는 점을 $\\mathrm{D}$라 하면, 내분점의 위치벡터 공식에 의해\n$\\vec{\\mathrm{PD}} = \\frac{2\\vec{\\mathrm{PB}} + 3\\vec{\\mathrm{PC}}}{3 + 2} = \\frac{2\\vec{\\mathrm{PB}} + 3\\vec{\\mathrm{PC}}}{5} \\implies 2\\vec{\\mathrm{PB}} + 3\\vec{\\mathrm{PC}} = 5\\vec{\\mathrm{PD}}$\n이를 위 식에 대입하면\n$5\\vec{\\mathrm{PA}} = -5\\vec{\\mathrm{PD}} \\implies \\vec{\\mathrm{PA}} = -\\vec{\\mathrm{PD}} \\iff \\vec{\\mathrm{AP}} = \\vec{\\mathrm{PD}}$\n따라서 점 $\\mathrm{P}$는 선분 $\\mathrm{AD}$의 중점이다.\nㄱ: 점 $\\mathrm{D}$는 선분 $\\mathrm{BC}$를 $3:2$로 내분하는 점이므로 $\\overline{\\mathrm{BD}} : \\overline{\\mathrm{DC}} = 3 : 2$이다. (참)\nㄴ: $\\vec{\\mathrm{AP}} = \\vec{\\mathrm{PD}}$이므로 $\\overline{\\mathrm{AP}} : \\overline{\\mathrm{PD}} = 1 : 1$이다. 따라서 $2:1$은 옳지 않다. (거짓)\nㄷ: 단계별로 삼각형의 넓이를 계산한다.\n(i) 점 $\\mathrm{P}$가 선분 $\\mathrm{AD}$의 중점이므로 두 삼각형 $\\mathrm{ABP}$와 $\\mathrm{BPD}$는 밑변의 길이가 같고 높이가 같다.\n$\\triangle \\mathrm{ABP} = \\triangle \\mathrm{BPD} = 3 \\implies \\triangle \\mathrm{ABD} = \\triangle \\mathrm{ABP} + \\triangle \\mathrm{BPD} = 3 + 3 = 6$\n(ii) 선분 $\\mathrm{BC}$에서 $\\overline{\\mathrm{BD}} : \\overline{\\mathrm{DC}} = 3 : 2$이므로 두 삼각형 $\\mathrm{ABD}$와 $\\mathrm{ADC}$의 넓이의 비는 밑변의 비와 같다.\n$\\triangle \\mathrm{ADC} = \\frac{2}{3} \\triangle \\mathrm{ABD} = \\frac{2}{3} \\times 6 = 4$\n따라서 삼각형 $\\mathrm{ABC}$의 넓이는\n$\\triangle \\mathrm{ABC} = \\triangle \\mathrm{ABD} + \\triangle \\mathrm{ADC} = 6 + 4 = 10$\n이므로 넓이가 $15$라는 것은 옳지 않다. (거짓)\n따라서 정답은 ①이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-GEO-RPM-068",
    "problemTypeKey": "PT_GEO_PLANE_VECTOR",
    "templateKey": "TPL_GEO_PLANE_VECTOR_POSITION",
    "crossConceptKeys": [
      "CC_INTERNAL_DIVISION",
      "CC_TRIANGLE_AREA"
    ],
    "conditionKeys": [],
    "integrationPattern": "INTERDEPENDENT"
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
    "content": "평면 위의 점 $\\mathrm{P}$와 삼각형 $\\mathrm{ABC}$에 대하여 등식\n$$\\vec{\\mathrm{PA}} + 2\\vec{\\mathrm{PB}} + 3\\vec{\\mathrm{PC}} = \\vec{0}$$\n이 성립한다. 다음 [보기]에서 옳은 것만을 있는 대로 고른 것은?\n\n[보기]\nㄱ. 점 $\\mathrm{P}$는 삼각형 $\\mathrm{ABC}$ 내부에 존재한다.\nㄴ. 두 벡터 $\\vec{\\mathrm{PC}}$와 $\\frac{\\vec{\\mathrm{PA}} + 2\\vec{\\mathrm{PB}}}{3}$는 서로 같은 방향이다.\nㄷ. 삼각형 $\\mathrm{ABC}$의 넓이는 삼각형 $\\mathrm{ABP}$의 넓이의 $2$배이다.",
    "choices": [
      "ㄱ",
      "ㄴ",
      "ㄱ, ㄷ",
      "ㄴ, ㄷ",
      "ㄱ, ㄴ, ㄷ"
    ],
    "answer": "③",
    "solution": "주어진 등식에서 $3\\vec{\\mathrm{PC}}$를 이항하면\n$3\\vec{\\mathrm{PC}} = -(\\vec{\\mathrm{PA}} + 2\\vec{\\mathrm{PB}}) = -3 \\left( \\frac{\\vec{\\mathrm{PA}} + 2\\vec{\\mathrm{PB}}}{3} \\right)$\n선분 $\\mathrm{AB}$를 $2:1$로 내분하는 점을 $\\mathrm{D}$라 하면, 내분점의 위치벡터 공식에 의해\n$\\vec{\\mathrm{PD}} = \\frac{\\vec{\\mathrm{PA}} + 2\\vec{\\mathrm{PB}}}{1 + 2} = \\frac{\\vec{\\mathrm{PA}} + 2\\vec{\\mathrm{PB}}}{3}$\n이를 위 식에 대입하면\n$3\\vec{\\mathrm{PC}} = -3\\vec{\\mathrm{PD}} \\implies \\vec{\\mathrm{PC}} = -\\vec{\\mathrm{PD}}$\n따라서 점 $\\mathrm{P}$는 선분 $\\mathrm{CD}$의 중점이다.\nㄱ: 점 $\\mathrm{D}$가 변 $\\mathrm{AB}$ 위의 내분점이므로 선분 $\\mathrm{CD}$는 삼각형 $\\mathrm{ABC}$의 내부에 놓인다. 점 $\\mathrm{P}$는 선분 $\\mathrm{CD}$의 중점이므로 점 $\\mathrm{P}$는 삼각형 $\\mathrm{ABC}$의 내부에 존재한다. (참)\nㄴ: $\\vec{\\mathrm{PC}} = -\\vec{\\mathrm{PD}} = -\\frac{\\vec{\\mathrm{PA}} + 2\\vec{\\mathrm{PB}}}{3}$이므로, 두 벡터 $\\vec{\\mathrm{PC}}$와 $\\frac{\\vec{\\mathrm{PA}} + 2\\vec{\\mathrm{PB}}}{3}$는 크기가 같고 방향이 반대이다. 따라서 방향이 같다는 것은 옳지 않다. (거짓)\nㄷ: 점 $\\mathrm{P}$가 선분 $\\mathrm{CD}$의 중점이므로, 점 $\\mathrm{C}$에서 직선 $\\mathrm{AB}$에 내린 수선의 발까지의 거리를 $h$라 하면 점 $\\mathrm{P}$에서 직선 $\\mathrm{AB}$까지의 거리는 $\\frac{h}{2}$이다.\n밑변을 선분 $\\mathrm{AB}$로 공유하는 두 삼각형의 넓이를 비교하면\n$\\triangle \\mathrm{ABC} = \\frac{1}{2} \\times \\overline{\\mathrm{AB}} \\times h$\n$\\triangle \\mathrm{ABP} = \\frac{1}{2} \\times \\overline{\\mathrm{AB}} \\times \\frac{h}{2} = \\frac{1}{2} \\triangle \\mathrm{ABC}$\n따라서 $\\triangle \\mathrm{ABC} = 2\\triangle \\mathrm{ABP}$이므로 삼각형 $\\mathrm{ABC}$의 넓이는 삼각형 $\\mathrm{ABP}$의 넓이의 $2$배이다. (참)\n따라서 정답은 ③이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-GEO-RPM-068",
    "problemTypeKey": "PT_GEO_PLANE_VECTOR",
    "templateKey": "TPL_GEO_PLANE_VECTOR_POSITION",
    "crossConceptKeys": [
      "CC_TRIANGLE_AREA"
    ],
    "conditionKeys": [],
    "integrationPattern": "INTERDEPENDENT"
  }
];
