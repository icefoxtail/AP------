window.examTitle = "기하_120_내적사이의관계_고2_유형은행1";

window.questionBank = [
  {
    "id": 1,
    "category": "벡터의 내적",
    "standardCourse": "기하",
    "curriculum": "2022",
    "standardUnitKey": "H22-GE-07",
    "standardUnit": "벡터의 내적",
    "standardUnitOrder": 7,
    "subUnitKey": "H22-GE-07-VECTOR_DOT",
    "subUnit": "벡터의 내적",
    "subUnitConfidence": "candidate_evidence",
    "subUnitClassificationDepth": "complete_candidate",
    "conceptClusterKey": "H22_GE_07_VECTOR_DOT",
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "벡터의 내적"
    ],
    "wide": false,
    "content": "그림과 같이 $\\angle\\mathrm{B}=90^\\circ$이고 $\\overline{\\mathrm{AB}}=3, \\overline{\\mathrm{BC}}=4$인 직각삼각형 $\\mathrm{ABC}$가 있다. 변 $\\mathrm{BC}$를 삼등분하는 두 점을 $\\mathrm{B}$에 가까운 순서대로 각각 $\\mathrm{D}, \\mathrm{E}$라 하고, 변 $\\mathrm{AB}$의 중점을 $\\mathrm{M}$이라 하자. $\\vec{\\mathrm{AB}}\\cdot(\\vec{\\mathrm{AD}}+\\vec{\\mathrm{AE}}+\\vec{\\mathrm{AC}}) + \\vec{\\mathrm{BC}}\\cdot\\vec{\\mathrm{MC}}$의 값은?\n[그림: $\\angle\\mathrm{B}=90^\\circ$인 직각삼각형 $\\mathrm{ABC}$에서 수직인 두 변의 길이는 $\\overline{\\mathrm{AB}}=3, \\overline{\\mathrm{BC}}=4$이다. 밑변 $\\mathrm{BC}$ 위에 $\\overline{\\mathrm{BD}}=\\overline{\\mathrm{DE}}=\\overline{\\mathrm{EC}}=\\frac{4}{3}$인 두 점 $\\mathrm{D}, \\mathrm{E}$가 순서대로 놓여 있고, 변 $\\mathrm{AB}$의 중점을 $\\mathrm{M}$이라 할 때, 점 $\\mathrm{A}$에서 세 점 $\\mathrm{D}, \\mathrm{E}, \\mathrm{C}$를 각각 잇는 선분들과 점 $\\mathrm{M}$과 점 $\\mathrm{C}$를 잇는 선분이 그려져 있다.]",
    "choices": [
      "35",
      "37",
      "39",
      "41",
      "43"
    ],
    "answer": "⑤",
    "solution": "[수선의 발과 정사영의 성질] 점 $\\mathrm{D}, \\mathrm{E}, \\mathrm{C}$는 직선 $\\mathrm{BC}$ 위의 점이고 직선 $\\mathrm{AB} \\perp$ 직선 $\\mathrm{BC}$이므로, 세 점 $\\mathrm{D}, \\mathrm{E}, \\mathrm{C}$에서 직선 $\\mathrm{AB}$에 내린 수선의 발은 모두 $\\mathrm{B}$이다.\n[내적의 기하학적 정의 적용] $\\vec{\\mathrm{AB}}\\cdot\\vec{\\mathrm{AD}} = \\vec{\\mathrm{AB}}\\cdot\\vec{\\mathrm{AE}} = \\vec{\\mathrm{AB}}\\cdot\\vec{\\mathrm{AC}} = |\\vec{\\mathrm{AB}}|^2 = 3^2 = 9$이다.\n[내적의 분배법칙을 이용한 계산] $\\vec{\\mathrm{AB}}\\cdot(\\vec{\\mathrm{AD}}+\\vec{\\mathrm{AE}}+\\vec{\\mathrm{AC}}) = \\vec{\\mathrm{AB}}\\cdot\\vec{\\mathrm{AD}} + \\vec{\\mathrm{AB}}\\cdot\\vec{\\mathrm{AE}} + \\vec{\\mathrm{AB}}\\cdot\\vec{\\mathrm{AC}} = 9 + 9 + 9 = 27$이다.\n[벡터의 뺄셈을 이용한 분해] 점 $\\mathrm{M}$에서 직선 $\\mathrm{BC}$에 내린 수선의 발은 $\\mathrm{B}$이므로 $\\vec{\\mathrm{MC}} = \\vec{\\mathrm{BC}} - \\vec{\\mathrm{BM}}$으로 나타낸다.\n[벡터의 수직 조건] 변 $\\mathrm{AB} \\perp$ 변 $\\mathrm{BC}$이므로 $\\vec{\\mathrm{BC}}\\cdot\\vec{\\mathrm{BM}} = 0$이다.\n[내적 전개 및 계산] $\\vec{\\mathrm{BC}}\\cdot\\vec{\\mathrm{MC}} = \\vec{\\mathrm{BC}}\\cdot(\\vec{\\mathrm{BC}}-\\vec{\\mathrm{BM}}) = |\\vec{\\mathrm{BC}}|^2 - \\vec{\\mathrm{BC}}\\cdot\\vec{\\mathrm{BM}} = 4^2 - 0 = 16$이다.\n[두 내적의 합 계산] $\\vec{\\mathrm{AB}}\\cdot(\\vec{\\mathrm{AD}}+\\vec{\\mathrm{AE}}+\\vec{\\mathrm{AC}}) + \\vec{\\mathrm{BC}}\\cdot\\vec{\\mathrm{MC}} = 27 + 16 = 43$이다.\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-GEO-RPM-073",
    "problemTypeKey": "PT_GEO_PLANE_VECTOR",
    "templateKey": "TPL_GEO_PLANE_VECTOR_DOT",
    "crossConceptKeys": [
      "CC_RIGHT_TRIANGLE",
      "CC_INTERNAL_DIVISION",
      "CC_MIDPOINT"
    ],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 2,
    "category": "벡터의 내적",
    "standardCourse": "기하",
    "curriculum": "2022",
    "standardUnitKey": "H22-GE-07",
    "standardUnit": "벡터의 내적",
    "standardUnitOrder": 7,
    "subUnitKey": "H22-GE-07-VECTOR_DOT",
    "subUnit": "벡터의 내적",
    "subUnitConfidence": "candidate_evidence",
    "subUnitClassificationDepth": "complete_candidate",
    "conceptClusterKey": "H22_GE_07_VECTOR_DOT",
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "벡터의 내적"
    ],
    "wide": false,
    "content": "그림과 같이 삼각형 $\\mathrm{ABC}$에서 $\\angle\\mathrm{ABC}=\\frac{\\pi}{2}$이다. 선분 $\\mathrm{AB}$를 삼등분하는 점을 각각 $\\mathrm{A}_1, \\mathrm{A}_2$라 하고, 선분 $\\mathrm{BC}$를 사등분하는 점을 각각 $\\mathrm{C}_1, \\mathrm{C}_2, \\mathrm{C}_3$이라 하자. $\\vec{\\mathrm{AB}}\\cdot(\\vec{\\mathrm{AC}_1}+\\vec{\\mathrm{AC}_2}+\\vec{\\mathrm{AC}_3})=75$, $\\vec{\\mathrm{BC}}\\cdot(\\vec{\\mathrm{CA}_1}+\\vec{\\mathrm{CA}_2})=-288$일 때, $|\\vec{\\mathrm{AB}}+\\vec{\\mathrm{BC}}|$의 값은?\n[그림: $\\angle\\mathrm{B}=\\frac{\\pi}{2}$인 직각삼각형 $\\mathrm{ABC}$에서 변 $\\mathrm{AB}$ 위에 $\\mathrm{A}$에 가까운 순서대로 삼등분점 $\\mathrm{A}_1, \\mathrm{A}_2$가 있고, 밑변 $\\mathrm{BC}$ 위에 $\\mathrm{B}$에 가까운 순서대로 사등분점 $\\mathrm{C}_1, \\mathrm{C}_2, \\mathrm{C}_3$이 있다. 점 $\\mathrm{A}$에서 세 점 $\\mathrm{C}_1, \\mathrm{C}_2, \\mathrm{C}_3$을 각각 잇는 선분들과 점 $\\mathrm{C}$에서 두 점 $\\mathrm{A}_1, \\mathrm{A}_2$를 각각 잇는 선분들이 그려져 있다.]",
    "choices": [
      "9",
      "10",
      "11",
      "12",
      "13"
    ],
    "answer": "⑤",
    "solution": "[벡터의 덧셈을 이용한 분해] 세 점 $\\mathrm{C}_1, \\mathrm{C}_2, \\mathrm{C}_3$에 대하여 $\\vec{\\mathrm{AC}_k} = \\vec{\\mathrm{AB}} + \\vec{\\mathrm{BC}_k}$ ($k=1, 2, 3$)이다.\n[벡터의 수직 조건] $\\angle\\mathrm{ABC}=\\frac{\\pi}{2}$이므로 $\\vec{\\mathrm{AB}}\\perp\\vec{\\mathrm{BC}}$이고, 선분 $\\mathrm{BC}$ 위의 모든 점 $\\mathrm{C}_k$에 대해 $\\vec{\\mathrm{AB}}\\cdot\\vec{\\mathrm{BC}_k} = 0$이다.\n[내적의 분배법칙 적용] $\\vec{\\mathrm{AB}}\\cdot\\vec{\\mathrm{AC}_k} = \\vec{\\mathrm{AB}}\\cdot(\\vec{\\mathrm{AB}}+\\vec{\\mathrm{BC}_k}) = |\\vec{\\mathrm{AB}}|^2 + \\vec{\\mathrm{AB}}\\cdot\\vec{\\mathrm{BC}_k} = |\\vec{\\mathrm{AB}}|^2 + 0 = |\\vec{\\mathrm{AB}}|^2$이다.\n[첫 번째 조건식 계산] $\\vec{\\mathrm{AB}}\\cdot(\\vec{\\mathrm{AC}_1}+\\vec{\\mathrm{AC}_2}+\\vec{\\mathrm{AC}_3}) = |\\vec{\\mathrm{AB}}|^2 + |\\vec{\\mathrm{AB}}|^2 + |\\vec{\\mathrm{AB}}|^2 = 3|\\vec{\\mathrm{AB}}|^2 = 75$에서 $|\\vec{\\mathrm{AB}}|^2 = 25$이므로 $|\\vec{\\mathrm{AB}}| = 5$이다.\n[벡터의 덧셈을 이용한 분해] 두 점 $\\mathrm{A}_1, \\mathrm{A}_2$에 대하여 $\\vec{\\mathrm{CA}_k} = \\vec{\\mathrm{CB}} + \\vec{\\mathrm{BA}_k} = -\\vec{\\mathrm{BC}} + \\vec{\\mathrm{BA}_k}$ ($k=1, 2$)이다.\n[내적 전개 및 수직 조건] $\\vec{\\mathrm{BC}}\\perp\\vec{\\mathrm{BA}_k}$이므로 $\\vec{\\mathrm{BC}}\\cdot\\vec{\\mathrm{BA}_k} = 0$이고, $\\vec{\\mathrm{BC}}\\cdot\\vec{\\mathrm{CA}_k} = \\vec{\\mathrm{BC}}\\cdot(-\\vec{\\mathrm{BC}}+\\vec{\\mathrm{BA}_k}) = -|\\vec{\\mathrm{BC}}|^2$이다.\n[두 번째 조건식 계산] $\\vec{\\mathrm{BC}}\\cdot(\\vec{\\mathrm{CA}_1}+\\vec{\\mathrm{CA}_2}) = -|\\vec{\\mathrm{BC}}|^2 + (-|\\vec{\\mathrm{BC}}|^2) = -2|\\vec{\\mathrm{BC}}|^2 = -288$에서 $|\\vec{\\mathrm{BC}}|^2 = 144$이므로 $|\\vec{\\mathrm{BC}}| = 12$이다.\n주의: $\\vec{\\mathrm{BC}}$와 $\\vec{\\mathrm{CB}}$는 방향이 반대이므로 내적 계산 시 $\\vec{\\mathrm{BC}}\\cdot\\vec{\\mathrm{CB}} = -|\\vec{\\mathrm{BC}}|^2$로 음의 부호가 붙는다.\n[피타고라스 정리 적용] $\\vec{\\mathrm{AB}}+\\vec{\\mathrm{BC}} = \\vec{\\mathrm{AC}}$이고 $\\angle\\mathrm{B}=\\frac{\\pi}{2}$이므로 $|\\vec{\\mathrm{AB}}+\\vec{\\mathrm{BC}}| = |\\vec{\\mathrm{AC}}| = \\sqrt{|\\vec{\\mathrm{AB}}|^2 + |\\vec{\\mathrm{BC}}|^2} = \\sqrt{5^2 + 12^2} = \\sqrt{25 + 144} = \\sqrt{169} = 13$이다.\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "low",
    "difficultyBoundaryFlag": "B45",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-GEO-RPM-073",
    "problemTypeKey": "PT_GEO_PLANE_VECTOR",
    "templateKey": "TPL_GEO_PLANE_VECTOR_DOT",
    "crossConceptKeys": [
      "CC_RIGHT_TRIANGLE",
      "CC_INTERNAL_DIVISION",
      "CC_PYTHAGOREAN"
    ],
    "conditionKeys": [],
    "integrationPattern": "DEEP_COMPOSITE"
  }
];
