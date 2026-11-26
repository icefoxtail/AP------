window.examTitle = "기하_122_평면벡터의내적의성질과수직_고2_유형은행1";

window.questionBank = [
  {
    "id": 1,
    "category": "벡터의 성분",
    "standardCourse": "기하",
    "curriculum": "2022",
    "standardUnitKey": "H22-GE-06",
    "standardUnit": "벡터의 성분",
    "standardUnitOrder": 6,
    "subUnitKey": "H22-GE-06-VECTOR_COMPONENT",
    "subUnit": "벡터의 성분",
    "subUnitConfidence": "candidate_evidence",
    "subUnitClassificationDepth": "complete_candidate",
    "conceptClusterKey": "H22_GE_06_VECTOR_COMPONENT",
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "벡터의 성분"
    ],
    "wide": false,
    "content": "한 직선 위에 있지 않은 서로 다른 세 점 $\\mathrm{A}$, $\\mathrm{B}$, $\\mathrm{C}$가\n$$\\vec{\\mathrm{CA}} \\cdot (\\vec{\\mathrm{AB}} - \\vec{\\mathrm{AC}}) = 0$$\n을 만족시킨다. $\\overline{\\mathrm{AC}}=9$, $\\overline{\\mathrm{AB}}=15$일 때, 선분 $\\mathrm{BC}$의 길이는?",
    "choices": [
      "8",
      "9",
      "10",
      "11",
      "12"
    ],
    "answer": "⑤",
    "solution": "1단계(벡터의 뺄셈 정리): 벡터의 뺄셈에 의하여 $\\vec{\\mathrm{AB}} - \\vec{\\mathrm{AC}} = \\vec{\\mathrm{CB}}$이다.\n2단계(주어진 식 정리): 주어진 등식에 대입하면 $\\vec{\\mathrm{CA}} \\cdot \\vec{\\mathrm{CB}} = 0$이다.\n3단계(내적과 수직의 관계): 영벡터가 아닌 두 벡터의 내적이 $0$이므로 $\\vec{\\mathrm{CA}} \\perp \\vec{\\mathrm{CB}}$이다.\n4단계(도형의 형태 파악): 선분 $\\mathrm{CA}$와 선분 $\\mathrm{CB}$가 점 $\\mathrm{C}$에서 수직을 이루므로 삼각형 $\\mathrm{ABC}$는 $\\angle \\mathrm{C} = 90^\\circ$인 직각삼각형이다.\n5단계(피타고라스 정리 적용): 빗변이 선분 $\\mathrm{AB}$이므로 피타고라스 정리에 의해 $\\overline{\\mathrm{AB}}^2 = \\overline{\\mathrm{AC}}^2 + \\overline{\\mathrm{BC}}^2$이 성립한다.\n6단계(값 대입 및 계산): $15^2 = 9^2 + \\overline{\\mathrm{BC}}^2 \\implies 225 = 81 + \\overline{\\mathrm{BC}}^2 \\implies \\overline{\\mathrm{BC}}^2 = 144$이다.\n7단계(선분의 길이 결정): 선분의 길이는 양수이므로 $\\overline{\\mathrm{BC}} = \\sqrt{144} = 12$이다.\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-GEO-RPM-075",
    "problemTypeKey": "PT_GEO_PLANE_VECTOR",
    "templateKey": "TPL_GEO_PLANE_VECTOR_DOT_ZERO",
    "crossConceptKeys": [
      "CC_PYTHAGOREAN",
      "CC_RIGHT_TRIANGLE"
    ],
    "conditionKeys": [
      "COND_NO_THREE_COLLINEAR_POINTS",
      "COND_PAIRWISE_DISTINCT_POINTS"
    ],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 2,
    "category": "벡터의 성분",
    "standardCourse": "기하",
    "curriculum": "2022",
    "standardUnitKey": "H22-GE-06",
    "standardUnit": "벡터의 성분",
    "standardUnitOrder": 6,
    "subUnitKey": "H22-GE-06-VECTOR_COMPONENT",
    "subUnit": "벡터의 성분",
    "subUnitConfidence": "candidate_evidence",
    "subUnitClassificationDepth": "complete_candidate",
    "conceptClusterKey": "H22_GE_06_VECTOR_COMPONENT",
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "벡터의 성분"
    ],
    "wide": false,
    "content": "그림과 같이 $\\angle \\mathrm{O} = 90^\\circ$이고 $\\overline{\\mathrm{OA}}=5$, $\\overline{\\mathrm{OB}}=12$인 직각삼각형 $\\mathrm{AOB}$에서 선분 $\\mathrm{AB}$ 위의 한 점 $\\mathrm{P}$에 대하여\n$$\\vec{\\mathrm{OA}} \\cdot \\vec{\\mathrm{OP}} = \\vec{\\mathrm{OB}} \\cdot \\vec{\\mathrm{OP}}$$\n가 성립할 때, $|\\vec{\\mathrm{OP}}|$의 값은?\n[그림: $\\angle\\mathrm{O}=90^\\circ$이고 $\\overline{\\mathrm{OA}}=5$, $\\overline{\\mathrm{OB}}=12$인 직각삼각형 $\\mathrm{AOB}$가 있고, 선분 $\\mathrm{AB}$ 위의 점 $\\mathrm{P}$에 대하여 선분 $\\mathrm{OP}$가 선분 $\\mathrm{AB}$와 수직을 이루고 있다.]",
    "choices": [
      "$\\frac{60}{13}$",
      "$\\frac{64}{13}$",
      "$\\frac{70}{13}$",
      "$\\frac{72}{13}$",
      "$\\frac{75}{13}$"
    ],
    "answer": "①",
    "solution": "1단계(식 정리 및 분배법칙): 주어진 등식을 좌변으로 이항하여 정리하면 $(\\vec{\\mathrm{OA}} - \\vec{\\mathrm{OB}}) \\cdot \\vec{\\mathrm{OP}} = 0$이다.\n2단계(벡터의 뺄셈): $\\vec{\\mathrm{OA}} - \\vec{\\mathrm{OB}} = \\vec{\\mathrm{BA}}$이므로 $\\vec{\\mathrm{BA}} \\cdot \\vec{\\mathrm{OP}} = 0$이다.\n3단계(수직 조건 확인): 영벡터가 아닌 두 벡터의 내적이 $0$이므로 $\\vec{\\mathrm{BA}} \\perp \\vec{\\mathrm{OP}}$, 즉 선분 $\\mathrm{OP}$는 점 $\\mathrm{O}$에서 빗변 $\\mathrm{AB}$에 내린 수선이다.\n4단계(피타고라스 정리로 빗변 구하기): 직각삼각형 $\\mathrm{AOB}$에서 피타고라스 정리에 의해 $\\overline{\\mathrm{AB}} = \\sqrt{\\overline{\\mathrm{OA}}^2 + \\overline{\\mathrm{OB}}^2} = \\sqrt{5^2 + 12^2} = \\sqrt{169} = 13$이다.\n5단계(삼각형 넓이의 일치): 삼각형 $\\mathrm{AOB}$의 넓이를 두 방식으로 표현하면 $\\frac{1}{2} \\times \\overline{\\mathrm{OA}} \\times \\overline{\\mathrm{OB}} = \\frac{1}{2} \\times \\overline{\\mathrm{AB}} \\times \\overline{\\mathrm{OP}}$이다.\n6단계(선분의 길이 계산): $\\frac{1}{2} \\times 5 \\times 12 = \\frac{1}{2} \\times 13 \\times \\overline{\\mathrm{OP}} \\implies 60 = 13 \\times \\overline{\\mathrm{OP}} \\implies \\overline{\\mathrm{OP}} = \\frac{60}{13}$이다.\n7단계(벡터의 크기 결정): 따라서 $|\\vec{\\mathrm{OP}}| = \\overline{\\mathrm{OP}} = \\frac{60}{13}$이다.\n따라서 정답은 ①이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-GEO-RPM-075",
    "problemTypeKey": "PT_GEO_PLANE_VECTOR",
    "templateKey": "TPL_GEO_PLANE_VECTOR_DOT_ZERO",
    "crossConceptKeys": [
      "CC_PYTHAGOREAN",
      "CC_TRIANGLE_AREA"
    ],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL",
    "image": "assets/images/기하_122_평면벡터의내적의성질과수직_고2_유형은행1/q2-problem.svg",
    "imageAlt": "OA=5·OB=12의 직각삼각형에서 OP⊥AB인 수선의 발 P",
    "imageCaption": "OA=5·OB=12의 직각삼각형에서 OP⊥AB인 수선의 발 P",
    "imageSize": "full"
  },
  {
    "id": 3,
    "category": "벡터의 성분",
    "standardCourse": "기하",
    "curriculum": "2022",
    "standardUnitKey": "H22-GE-06",
    "standardUnit": "벡터의 성분",
    "standardUnitOrder": 6,
    "subUnitKey": "H22-GE-06-VECTOR_COMPONENT",
    "subUnit": "벡터의 성분",
    "subUnitConfidence": "candidate_evidence",
    "subUnitClassificationDepth": "complete_candidate",
    "conceptClusterKey": "H22_GE_06_VECTOR_COMPONENT",
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "벡터의 성분"
    ],
    "wide": false,
    "content": "좌표평면 위의 서로 다른 세 점 $\\mathrm{P}$, $\\mathrm{A}$, $\\mathrm{B}$에 대하여\n$$|\\vec{\\mathrm{AP}} + \\vec{\\mathrm{BP}}| = |\\vec{\\mathrm{AB}}|$$\n를 만족시키는 점 $\\mathrm{P}$는 어떤 도형 위를 움직이는가?",
    "choices": [
      "직선 $\\mathrm{AB}$",
      "점 $\\mathrm{A}$를 지나고 선분 $\\mathrm{AB}$에 수직인 직선",
      "선분 $\\mathrm{AB}$의 수직이등분선",
      "선분 $\\mathrm{AB}$를 지름으로 하는 원",
      "점 $\\mathrm{A}$를 중심으로 하고 반지름의 길이가 $\\overline{\\mathrm{AB}}$인 원"
    ],
    "answer": "④",
    "solution": "1단계(중점 벡터의 도입): 선분 $\\mathrm{AB}$의 중점을 $\\mathrm{M}$이라 하면 $\\vec{\\mathrm{MA}} + \\vec{\\mathrm{MB}} = \\vec{0}$이다.\n2단계(시점 변경 및 분해): $\\vec{\\mathrm{AP}} = \\vec{\\mathrm{AM}} + \\vec{\\mathrm{MP}}$, $\\vec{\\mathrm{BP}} = \\vec{\\mathrm{BM}} + \\vec{\\mathrm{MP}}$이다.\n3단계(좌변의 벡터 합 정리): $\\vec{\\mathrm{AP}} + \\vec{\\mathrm{BP}} = (\\vec{\\mathrm{AM}} + \\vec{\\mathrm{BM}}) + 2\\vec{\\mathrm{MP}} = 2\\vec{\\mathrm{MP}}$이다.\n4단계(크기 관계식에 대입): 주어진 등식에 대입하면 $|2\\vec{\\mathrm{MP}}| = |\\vec{\\mathrm{AB}}|$, 즉 $2|\\vec{\\mathrm{MP}}| = \\overline{\\mathrm{AB}}$이다.\n5단계(점 $\\mathrm{P}$와 중점 $\\mathrm{M}$ 사이의 거리): $|\\vec{\\mathrm{MP}}| = \\frac{1}{2}\\overline{\\mathrm{AB}}$이다.\n6단계(원의 기하학적 정의 적용): 고정된 점 $\\mathrm{M}$으로부터 거리가 $\\frac{1}{2}\\overline{\\mathrm{AB}}$로 일정한 점 $\\mathrm{P}$의 자취는 선분 $\\mathrm{AB}$의 중점 $\\mathrm{M}$을 중심으로 하고 반지름이 $\\frac{1}{2}\\overline{\\mathrm{AB}}$인 원이다.\n7단계(결론 도출): 이는 곧 선분 $\\mathrm{AB}$를 지름으로 하는 원이다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-GEO-RPM-075",
    "problemTypeKey": "PT_GEO_PLANE_VECTOR",
    "templateKey": "TPL_GEO_PLANE_VECTOR_DOT_ZERO",
    "crossConceptKeys": [
      "CC_MIDPOINT",
      "CC_CIRCLE_CENTER_RADIUS",
      "CC_DIAMETER"
    ],
    "conditionKeys": [
      "COND_PAIRWISE_DISTINCT_POINTS"
    ],
    "integrationPattern": "REINTERPRETATION"
  },
  {
    "id": 4,
    "category": "벡터의 성분",
    "standardCourse": "기하",
    "curriculum": "2022",
    "standardUnitKey": "H22-GE-06",
    "standardUnit": "벡터의 성분",
    "standardUnitOrder": 6,
    "subUnitKey": "H22-GE-06-VECTOR_COMPONENT",
    "subUnit": "벡터의 성분",
    "subUnitConfidence": "candidate_evidence",
    "subUnitClassificationDepth": "complete_candidate",
    "conceptClusterKey": "H22_GE_06_VECTOR_COMPONENT",
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "벡터의 성분"
    ],
    "wide": false,
    "content": "다음 [보기]의 설명 중 옳은 것만을 있는 대로 고른 것은?\n\n[보기]\nㄱ. 사각형 $\\mathrm{ABCD}$와 점 $\\mathrm{O}$에 대하여 $\\vec{\\mathrm{OA}} - \\vec{\\mathrm{OB}} + \\vec{\\mathrm{OC}} - \\vec{\\mathrm{OD}} = \\vec{0}$을 만족시키는 사각형 $\\mathrm{ABCD}$는 평행사변형이다.\nㄴ. $(\\vec{\\mathrm{CA}} + \\vec{\\mathrm{CB}}) \\cdot (\\vec{\\mathrm{CA}} - \\vec{\\mathrm{CB}}) = 0$을 만족시키는 삼각형 $\\mathrm{ABC}$는 $\\overline{\\mathrm{AB}} = \\overline{\\mathrm{AC}}$인 이등변삼각형이다.\nㄷ. $(\\vec{\\mathrm{AC}} - \\vec{\\mathrm{AB}}) \\cdot \\vec{\\mathrm{BA}} = 0$을 만족시키는 삼각형 $\\mathrm{ABC}$는 $\\angle \\mathrm{B} = 90^\\circ$인 직각삼각형이다.",
    "choices": [
      "ㄱ",
      "ㄷ",
      "ㄱ, ㄷ",
      "ㄴ, ㄷ",
      "ㄱ, ㄴ, ㄷ"
    ],
    "answer": "③",
    "solution": "1단계(ㄱ 판단): $\\vec{\\mathrm{OA}} - \\vec{\\mathrm{OB}} = \\vec{\\mathrm{BA}}$, $\\vec{\\mathrm{OC}} - \\vec{\\mathrm{OD}} = \\vec{\\mathrm{DC}}$이므로 $\\vec{\\mathrm{BA}} + \\vec{\\mathrm{DC}} = \\vec{0} \\implies \\vec{\\mathrm{BA}} = \\vec{\\mathrm{CD}} \\implies \\vec{\\mathrm{AB}} = \\vec{\\mathrm{DC}}$이다. 마주 보는 한 쌍의 대변이 평행하고 길이가 같으므로 사각형 $\\mathrm{ABCD}$는 평행사변형이다. (참)\n2단계(ㄴ 판단): 내적의 성질에 의해 $(\\vec{\\mathrm{CA}} + \\vec{\\mathrm{CB}}) \\cdot (\\vec{\\mathrm{CA}} - \\vec{\\mathrm{CB}}) = |\\vec{\\mathrm{CA}}|^2 - |\\vec{\\mathrm{CB}}|^2 = 0 \\implies |\\vec{\\mathrm{CA}}| = |\\vec{\\mathrm{CB}}|$이다. 따라서 $\\overline{\\mathrm{CA}} = \\overline{\\mathrm{CB}}$인 이등변삼각형이다.\n3단계(ㄴ 오답 분석): 주의: 문제에 주어진 조건은 $\\overline{\\mathrm{AB}} = \\overline{\\mathrm{AC}}$이므로 이는 성립하지 않는다. (거짓)\n4단계(ㄷ 판단): 벡터의 뺄셈에 의해 $\\vec{\\mathrm{AC}} - \\vec{\\mathrm{AB}} = \\vec{\\mathrm{BC}}$이므로 주어진 식은 $\\vec{\\mathrm{BC}} \\cdot \\vec{\\mathrm{BA}} = 0$이다.\n5단계(ㄷ 수직 확인): 영벡터가 아닌 두 벡터의 내적이 $0$이므로 $\\vec{\\mathrm{BC}} \\perp \\vec{\\mathrm{BA}}$이고, 따라서 $\\angle \\mathrm{B} = 90^\\circ$인 직각삼각형이다. (참)\n6단계(종합): 따라서 옳은 것은 ㄱ, ㄷ이다.\n따라서 정답은 ③이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-GEO-RPM-075",
    "problemTypeKey": "PT_GEO_PLANE_VECTOR",
    "templateKey": "TPL_GEO_PLANE_VECTOR_DOT_ZERO",
    "crossConceptKeys": [
      "CC_PARALLELOGRAM_CRITERIA",
      "CC_ISOSCELES_TRIANGLE",
      "CC_RIGHT_TRIANGLE"
    ],
    "conditionKeys": [],
    "integrationPattern": "CASE_BRANCH"
  },
  {
    "id": 5,
    "category": "벡터의 성분",
    "standardCourse": "기하",
    "curriculum": "2022",
    "standardUnitKey": "H22-GE-06",
    "standardUnit": "벡터의 성분",
    "standardUnitOrder": 6,
    "subUnitKey": "H22-GE-06-VECTOR_COMPONENT",
    "subUnit": "벡터의 성분",
    "subUnitConfidence": "candidate_evidence",
    "subUnitClassificationDepth": "complete_candidate",
    "conceptClusterKey": "H22_GE_06_VECTOR_COMPONENT",
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "벡터의 성분"
    ],
    "wide": false,
    "content": "그림과 같이 $\\overline{\\mathrm{AB}}=4$, $\\overline{\\mathrm{BC}}=2$인 직사각형 $\\mathrm{ABCD}$의 둘레 또는 내부를 움직이는 점 $\\mathrm{P}$가 있다. 이때\n$$(\\vec{\\mathrm{PA}} + \\vec{\\mathrm{PB}}) \\cdot (\\vec{\\mathrm{PC}} + \\vec{\\mathrm{PD}}) = 0$$\n을 만족시키는 점 $\\mathrm{P}$가 나타내는 도형의 길이는?\n[그림: $\\overline{\\mathrm{AB}}=4$, $\\overline{\\mathrm{BC}}=2$인 직사각형 $\\mathrm{ABCD}$와 그 내부에 점 $\\mathrm{P}$가 위치해 있고, 선분 $\\mathrm{PA}$, $\\mathrm{PB}$, $\\mathrm{PC}$, $\\mathrm{PD}$가 연결되어 있다.]",
    "choices": [
      "$2\\pi$",
      "$\\frac{5}{2}\\pi$",
      "$3\\pi$",
      "$\\frac{7}{2}\\pi$",
      "$4\\pi$"
    ],
    "answer": "①",
    "solution": "1단계(중점 벡터 도입): 선분 $\\mathrm{AB}$의 중점을 $\\mathrm{M}$, 선분 $\\mathrm{CD}$의 중점을 $\\mathrm{N}$이라 하면 $\\vec{\\mathrm{PA}} + \\vec{\\mathrm{PB}} = 2\\vec{\\mathrm{PM}}$, $\\vec{\\mathrm{PC}} + \\vec{\\mathrm{PD}} = 2\\vec{\\mathrm{PN}}$이다.\n2단계(주어진 식 대입): 대입하면 $(2\\vec{\\mathrm{PM}}) \\cdot (2\\vec{\\mathrm{PN}}) = 0 \\implies 4(\\vec{\\mathrm{PM}} \\cdot \\vec{\\mathrm{PN}}) = 0 \\implies \\vec{\\mathrm{PM}} \\cdot \\vec{\\mathrm{PN}} = 0$이다.\n3단계(도형의 정의): $\\vec{\\mathrm{PM}} \\cdot \\vec{\\mathrm{PN}} = 0$이므로 점 $\\mathrm{P}$는 선분 $\\mathrm{MN}$을 지름으로 하는 원 위에 존재한다.\n4단계(원의 반지름 결정): 선분 $\\mathrm{MN}$의 길이는 변 $\\mathrm{BC}$의 길이와 같으므로 $\\overline{\\mathrm{MN}} = 2$이고, 따라서 원의 반지름은 $r = \\frac{2}{2} = 1$이다.\n5단계(좌표 설정을 통한 위치 확인): 직사각형의 중심을 원점 $(0, 0)$으로 두면 직사각형 영역은 $-1 \\le x \\le 1, -2 \\le y \\le 2$이다.\n6단계(원의 방정식): 두 중점은 $\\mathrm{M}(-1, 0), \\mathrm{N}(1, 0)$이므로 원의 중심은 $(0, 0)$이고 원의 방정식은 $x^2 + y^2 = 1$이다.\n7단계(영역 포함 관계 확인): 원 위의 임의의 점 $(x, y)$에 대해 $-1 \\le x \\le 1, -1 \\le y \\le 1$이 성립하므로, 이 원은 직사각형 $\\mathrm{ABCD}$의 내부 및 둘레에 완전히 포함된다.\n8단계(도형의 길이 계산): 점 $\\mathrm{P}$가 나타내는 도형은 반지름 $r=1$인 원 전체이므로 둘레의 길이는 $2\\pi r = 2\\pi \\times 1 = 2\\pi$이다.\n따라서 정답은 ①이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-GEO-RPM-075",
    "problemTypeKey": "PT_GEO_PLANE_VECTOR",
    "templateKey": "TPL_GEO_PLANE_VECTOR_DOT_ZERO",
    "crossConceptKeys": [
      "CC_MIDPOINT",
      "CC_DIAMETER",
      "CC_RECTANGLE_PROPERTIES"
    ],
    "conditionKeys": [
      "COND_RANGE"
    ],
    "integrationPattern": "SEQUENTIAL",
    "image": "assets/images/기하_122_평면벡터의내적의성질과수직_고2_유형은행1/q5-problem.svg",
    "imageAlt": "AB=4·BC=2 직사각형 내부의 이동점 P와 네 연결선",
    "imageCaption": "AB=4·BC=2 직사각형 내부의 이동점 P와 네 연결선",
    "imageSize": "full"
  }
];
