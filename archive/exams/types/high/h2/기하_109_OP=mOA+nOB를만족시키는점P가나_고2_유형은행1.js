window.examTitle = "기하_109_OP=mOA+nOB를만족시키는점P가나_고2_유형은행1";

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
    "content": "평면 위에 한 직선 위에 있지 않은 세 점 $\\mathrm{O, A, B}$가 있다. 실수 $t$에 대하여 $t \\le 1$일 때,\n$$\\vec{\\mathrm{OP}} = t\\vec{\\mathrm{OA}} + (1-t)\\vec{\\mathrm{OB}}$$\n를 만족시키는 점 $\\mathrm{P}$가 나타내는 도형은?",
    "choices": [
      "선분 AB",
      "직선 AB",
      "반직선 BA",
      "반직선 AB",
      "선분 AB의 수직이등분선"
    ],
    "answer": "④",
    "solution": "[직선의 벡터방정식 변형] $\\vec{\\mathrm{OP}} = t\\vec{\\mathrm{OA}} + (1-t)\\vec{\\mathrm{OB}} = \\vec{\\mathrm{OA}} + (1-t)(\\vec{\\mathrm{OB}} - \\vec{\\mathrm{OA}})$로 정리한다.\n[벡터의 성질 적용] $\\vec{\\mathrm{OB}} - \\vec{\\mathrm{OA}} = \\vec{\\mathrm{AB}}$이므로 $\\vec{\\mathrm{OP}} - \\vec{\\mathrm{OA}} = (1-t)\\vec{\\mathrm{AB}} \\implies \\vec{\\mathrm{AP}} = (1-t)\\vec{\\mathrm{AB}}$이다.\n[매개변수 범위 해석] $s = 1 - t$라 두면, $t \\le 1$에서 $-t \\ge -1$이므로 $s = 1 - t \\ge 0$이다.\n[위치 분석] $\\vec{\\mathrm{AP}} = s\\vec{\\mathrm{AB}}$ ($s \\ge 0$)에서 $s = 0$ ($t = 1$)일 때 점 $\\mathrm{P}$는 점 $\\mathrm{A}$이고, $s = 1$ ($t = 0$)일 때 점 $\\mathrm{P}$는 점 $\\mathrm{B}$이다.\n[도형 판정] $s \\ge 0$이므로 점 $\\mathrm{P}$는 시작점 $\\mathrm{A}$에서 출발하여 점 $\\mathrm{B}$의 방향으로 한없이 뻗어나가는 반직선 $\\mathrm{AB}$를 이룬다.\n주의: $t \\le 1$에서 시작점은 $t=1$일 때의 점 $\\mathrm{A}$이며, 점 $\\mathrm{B}$ 방향으로 뻗어나가므로 반직선 $\\mathrm{BA}$가 아닌 반직선 $\\mathrm{AB}$이다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-GEO-RPM-070",
    "problemTypeKey": "PT_GEO_PLANE_VECTOR",
    "templateKey": "TPL_GEO_PLANE_VECTOR_REGION",
    "crossConceptKeys": [
      "CC_RAY_DEFINITION"
    ],
    "conditionKeys": [
      "COND_UPPER_BOUND"
    ],
    "integrationPattern": "NONE"
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
    "content": "좌표평면 위의 세 점 $\\mathrm{O}(0, 0), \\mathrm{A}(-2, 4), \\mathrm{B}(2, 2)$에 대하여\n$$\\vec{\\mathrm{OP}} = t\\vec{\\mathrm{OA}} + (1-t)\\vec{\\mathrm{OB}} \\quad (0 \\le t \\le 1)$$\n를 만족하는 점 $\\mathrm{P}$가 움직이는 도형의 길이는?",
    "choices": [
      "\\sqrt{10}",
      "\\sqrt{13}",
      "\\sqrt{15}",
      "3\\sqrt{2}",
      "2\\sqrt{5}"
    ],
    "answer": "⑤",
    "solution": "[선분의 벡터방정식 성질] $0 \\le t \\le 1$일 때 $\\vec{\\mathrm{OP}} = t\\vec{\\mathrm{OA}} + (1-t)\\vec{\\mathrm{OB}}$를 만족하는 점 $\\mathrm{P}$가 나타내는 도형은 선분 $\\mathrm{AB}$이다.\n[도형의 길이 정의] 점 $\\mathrm{P}$가 움직이는 도형의 길이는 두 점 $\\mathrm{A}(-2, 4)$와 $\\mathrm{B}(2, 2)$ 사이의 거리 $\\overline{\\mathrm{AB}}$이다.\n[두 점 사이의 거리 공식] $\\overline{\\mathrm{AB}} = \\sqrt{(x_2 - x_1)^2 + (y_2 - y_1)^2}$\n[좌표 대입] $\\overline{\\mathrm{AB}} = \\sqrt{(2 - (-2))^2 + (2 - 4)^2} = \\sqrt{(2 + 2)^2 + (-2)^2}$\n[중간 계산] $\\overline{\\mathrm{AB}} = \\sqrt{4^2 + 4} = \\sqrt{16 + 4} = \\sqrt{20}$\n[근호 단순화] $\\sqrt{20} = 2\\sqrt{5}$\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-GEO-RPM-070",
    "problemTypeKey": "PT_GEO_PLANE_VECTOR",
    "templateKey": "TPL_GEO_PLANE_VECTOR_REGION",
    "crossConceptKeys": [
      "CC_DISTANCE_TWO_POINTS"
    ],
    "conditionKeys": [
      "COND_RANGE"
    ],
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
    "content": "좌표평면 위의 세 점 $\\mathrm{O, A, B}$에 대하여 $\\overline{\\mathrm{AB}} = 5$이고\n$$\\vec{\\mathrm{OP}} = t\\vec{\\mathrm{OA}} + (1-t)\\vec{\\mathrm{OB}} \\quad (0 \\le t \\le 2)$$\n를 만족시킬 때, 점 $\\mathrm{P}$의 자취의 길이는?",
    "choices": [
      "8",
      "10",
      "12",
      "15",
      "20"
    ],
    "answer": "②",
    "solution": "[벡터식의 변형] $\\vec{\\mathrm{OP}} = t\\vec{\\mathrm{OA}} + (1-t)\\vec{\\mathrm{OB}} = \\vec{\\mathrm{OB}} + t(\\vec{\\mathrm{OA}} - \\vec{\\mathrm{OB}}) = \\vec{\\mathrm{OB}} + t\\vec{\\mathrm{BA}}$이다.\n[시작점 위치 파악] $t = 0$일 때 $\\vec{\\mathrm{OP}} = \\vec{\\mathrm{OB}}$이므로 점 $\\mathrm{P}$는 점 $\\mathrm{B}$에 위치한다.\n[끝점 위치 파악] $t = 2$일 때 $\\vec{\\mathrm{OP}} = \\vec{\\mathrm{OB}} + 2\\vec{\\mathrm{BA}}$이므로 점 $\\mathrm{P}$는 $\\vec{\\mathrm{BP}} = 2\\vec{\\mathrm{BA}}$인 점 $\\mathrm{C}$에 위치한다.\n[자취의 형태] $t$가 $0 \\le t \\le 2$에서 연속적으로 변하므로 점 $\\mathrm{P}$의 자취는 선분 $\\mathrm{BC}$이다.\n[자취의 길이 계산] 자취의 길이는 $|2\\vec{\\mathrm{BA}}| = 2|\\vec{\\mathrm{BA}}| = 2\\overline{\\mathrm{AB}}$이다.\n[수치 대입] $\\overline{\\mathrm{AB}} = 5$이므로 자취의 길이는 $2 \\times 5 = 10$이다.\n따라서 정답은 ②이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-GEO-RPM-070",
    "problemTypeKey": "PT_GEO_PLANE_VECTOR",
    "templateKey": "TPL_GEO_PLANE_VECTOR_REGION",
    "crossConceptKeys": [],
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
    "content": "세 점 $\\mathrm{O}(0, 0), \\mathrm{A}(-1, 4), \\mathrm{B}(2, 3)$에 대하여\n$$\\vec{\\mathrm{OP}} = t\\vec{\\mathrm{OA}} + (1-t)\\vec{\\mathrm{OB}} \\quad (-1 \\le t \\le 2)$$\n를 만족하는 점 $\\mathrm{P}$가 움직이는 도형의 길이는?",
    "choices": [
      "2\\sqrt{10}",
      "4\\sqrt{5}",
      "3\\sqrt{10}",
      "5\\sqrt{5}",
      "4\\sqrt{10}"
    ],
    "answer": "③",
    "solution": "[선분 AB의 길이 계산] 두 점 $\\mathrm{A}(-1, 4), \\mathrm{B}(2, 3)$ 사이의 거리는 $\\overline{\\mathrm{AB}} = \\sqrt{(2 - (-1))^2 + (3 - 4)^2} = \\sqrt{3^2 + (-1)^2} = \\sqrt{9 + 1} = \\sqrt{10}$이다.\n[위치벡터식 정리] $\\vec{\\mathrm{OP}} = \\vec{\\mathrm{OB}} + t(\\vec{\\mathrm{OA}} - \\vec{\\mathrm{OB}}) = \\vec{\\mathrm{OB}} + t\\vec{\\mathrm{BA}}$이다.\n[양 끝점 위치벡터 계산] $t = -1$일 때의 점을 $\\mathrm{P}_1$, $t = 2$일 때의 점을 $\\mathrm{P}_2$라 하면 $\\vec{\\mathrm{OP}}_1 = \\vec{\\mathrm{OB}} - \\vec{\\mathrm{BA}}$, $\\vec{\\mathrm{OP}}_2 = \\vec{\\mathrm{OB}} + 2\\vec{\\mathrm{BA}}$이다.\n[자취 선분 벡터 산출] $\\vec{\\mathrm{P}_1\\mathrm{P}_2} = \\vec{\\mathrm{OP}}_2 - \\vec{\\mathrm{OP}}_1 = (\\vec{\\mathrm{OB}} + 2\\vec{\\mathrm{BA}}) - (\\vec{\\mathrm{OB}} - \\vec{\\mathrm{BA}}) = 3\\vec{\\mathrm{BA}}$이다.\n[도형의 길이 계산] 선분 $\\mathrm{P}_1\\mathrm{P}_2$의 길이는 $|3\\vec{\\mathrm{BA}}| = 3|\\vec{\\mathrm{BA}}| = 3\\overline{\\mathrm{AB}}$이다.\n[최종 값 계산] $3 \\times \\sqrt{10} = 3\\sqrt{10}$\n따라서 정답은 ③이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-GEO-RPM-070",
    "problemTypeKey": "PT_GEO_PLANE_VECTOR",
    "templateKey": "TPL_GEO_PLANE_VECTOR_REGION",
    "crossConceptKeys": [
      "CC_DISTANCE_TWO_POINTS"
    ],
    "conditionKeys": [
      "COND_RANGE"
    ],
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
    "content": "두 벡터 $\\vec{a} = (1, 7), \\vec{b} = (6, -5)$에 대하여\n$$\\vec{\\mathrm{OP}} = k\\vec{a} + l\\vec{b} \\quad (k \\ge 0, l \\ge 0, k+l=1)$$\n를 만족시키는 점 $\\mathrm{P}$가 그리는 도형의 길이는? (단, $\\mathrm{O}$는 원점이다.)",
    "choices": [
      "7",
      "9",
      "11",
      "13",
      "15"
    ],
    "answer": "④",
    "solution": "[선분의 벡터방정식 성질] $k+l=1$에서 $l = 1-k$이고 $k \\ge 0, l \\ge 0$이므로 $0 \\le k \\le 1$이다.\n[도형의 정의] $\\vec{a} = \\vec{\\mathrm{OA}}, \\vec{b} = \\vec{\\mathrm{OB}}$라 하면 점 $\\mathrm{A}(1, 7)$와 $\\mathrm{B}(6, -5)$에 대하여 $\\vec{\\mathrm{OP}} = k\\vec{\\mathrm{OA}} + (1-k)\\vec{\\mathrm{OB}}$ ($0 \\le k \\le 1$)는 선분 $\\mathrm{AB}$를 나타낸다.\n[도형의 길이 계산] 구하는 도형의 길이는 두 점 $\\mathrm{A}(1, 7)$와 $\\mathrm{B}(6, -5)$ 사이의 거리 $\\overline{\\mathrm{AB}}$이다.\n[두 점 사이의 거리 공식] $\\overline{\\mathrm{AB}} = \\sqrt{(6 - 1)^2 + (-5 - 7)^2}$\n[계산 및 전개] $\\overline{\\mathrm{AB}} = \\sqrt{5^2 + (-12)^2} = \\sqrt{25 + 144} = \\sqrt{169}$\n[제곱근 계산] $\\sqrt{169} = 13$\n따라서 정답은 ④이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-GEO-RPM-070",
    "problemTypeKey": "PT_GEO_PLANE_VECTOR",
    "templateKey": "TPL_GEO_PLANE_VECTOR_REGION",
    "crossConceptKeys": [
      "CC_DISTANCE_TWO_POINTS"
    ],
    "conditionKeys": [
      "COND_RANGE"
    ],
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
    "content": "$|\\vec{\\mathrm{OA}}| = 5, |\\vec{\\mathrm{OB}}| = 3, \\angle\\mathrm{AOB} = \\frac{\\pi}{3}$인 평면 위의 삼각형 $\\mathrm{OAB}$에 대하여\n$$\\vec{\\mathrm{OP}} = k\\vec{\\mathrm{OA}} + l\\vec{\\mathrm{OB}} \\quad (\\text{단, } 0 \\le l \\le 1, l - k = 1)$$\n을 만족하는 점 $\\mathrm{P}$가 나타내는 도형의 길이는? (단, $\\mathrm{O}$는 원점이다.)",
    "choices": [
      "\\sqrt{13}",
      "5",
      "2\\sqrt{7}",
      "6",
      "7"
    ],
    "answer": "⑤",
    "solution": "[조건식의 변형] $l - k = 1$에서 $k = l - 1$이다.\n[위치벡터식 대입] $\\vec{\\mathrm{OP}} = (l - 1)\\vec{\\mathrm{OA}} + l\\vec{\\mathrm{OB}} = -(1 - l)\\vec{\\mathrm{OA}} + l\\vec{\\mathrm{OB}} = (1 - l)(-\\vec{\\mathrm{OA}}) + l\\vec{\\mathrm{OB}}$이다.\n[새로운 점 설정] $\\vec{\\mathrm{OA}}' = -\\vec{\\mathrm{OA}}$를 만족하는 점을 $\\mathrm{A}'$라 하면, $0 \\le l \\le 1$에서 $\\vec{\\mathrm{OP}} = (1 - l)\\vec{\\mathrm{OA}}' + l\\vec{\\mathrm{OB}}$는 선분 $\\mathrm{A}'\\mathrm{B}$를 나타낸다.\n[길이 및 사잇각 파악] $|\\vec{\\mathrm{OA}}'| = |-\\vec{\\mathrm{OA}}| = 5$, $|\\vec{\\mathrm{OB}}| = 3$이고 점 $\\mathrm{A}'$는 점 $\\mathrm{A}$의 원점 대칭점이므로 $\\angle\\mathrm{A}'\\mathrm{OB} = \\pi - \\frac{\\pi}{3} = \\frac{2\\pi}{3}$이다.\n[코사인법칙 적용] 삼각형 $\\mathrm{OA}'\\mathrm{B}$에서 $\\overline{\\mathrm{A}'\\mathrm{B}}^2 = |\\vec{\\mathrm{OA}}'|^2 + |\\vec{\\mathrm{OB}}|^2 - 2|\\vec{\\mathrm{OA}}'||\\vec{\\mathrm{OB}}|\\cos\\frac{2\\pi}{3}$이다.\n[값의 대입 및 계산] $\\overline{\\mathrm{A}'\\mathrm{B}}^2 = 5^2 + 3^2 - 2 \\times 5 \\times 3 \\times \\left(-\\frac{1}{2}\\right) = 25 + 9 + 15 = 49$\n[제곱근 계산] $\\overline{\\mathrm{A}'\\mathrm{B}} = \\sqrt{49} = 7$\n주의: 점 $\\mathrm{A}'$는 점 $\\mathrm{A}$와 원점 대칭이므로 각의 크기는 $\\frac{\\pi}{3}$가 아니라 보각인 $\\frac{2\\pi}{3}$이다.\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-GEO-RPM-070",
    "problemTypeKey": "PT_GEO_PLANE_VECTOR",
    "templateKey": "TPL_GEO_PLANE_VECTOR_REGION",
    "crossConceptKeys": [],
    "conditionKeys": [
      "COND_RANGE"
    ],
    "integrationPattern": "SEQUENTIAL"
  }
];
