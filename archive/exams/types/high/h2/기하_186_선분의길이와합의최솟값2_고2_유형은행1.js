window.examTitle = "기하_186_선분의길이와합의최솟값2_고2_유형은행1";

window.questionBank = [
  {
    "id": 1,
    "category": "공간좌표 핵심 개념",
    "standardCourse": "기하",
    "curriculum": "2022",
    "standardUnitKey": "H22-GE-04",
    "standardUnit": "공간좌표",
    "standardUnitOrder": 4,
    "subUnitKey": "H22-GE-04-CORE",
    "subUnit": "공간좌표 핵심 개념",
    "subUnitConfidence": "candidate_evidence",
    "subUnitClassificationDepth": "complete_candidate",
    "conceptClusterKey": "H22-GE-04-CORE",
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "공간좌표 핵심 개념"
    ],
    "wide": false,
    "content": "두 점 $\\mathrm{A}(1,\\,5,\\,2)$, $\\mathrm{B}(3,\\,7,\\,5)$와 $yz$평면 위의 점 $\\mathrm{P}$, $zx$평면 위의 점 $\\mathrm{Q}$에 대하여 $\\overline{\\mathrm{AP}}+\\overline{\\mathrm{PQ}}+\\overline{\\mathrm{QB}}$의 최솟값은?",
    "choices": [
      "$9$",
      "$10$",
      "$11$",
      "$12$",
      "$13$"
    ],
    "answer": "⑤",
    "solution": "점 $\\mathrm{A}(1,\\,5,\\,2)$를 $yz$평면에 대하여 대칭이동한 점을 $\\mathrm{A}'$이라 하면 $\\mathrm{A}'(-1,\\,5,\\,2)$이고, $\\overline{\\mathrm{AP}}=\\overline{\\mathrm{A}'\\mathrm{P}}$이다.\n또 점 $\\mathrm{B}(3,\\,7,\\,5)$를 $zx$평면에 대하여 대칭이동한 점을 $\\mathrm{B}'$이라 하면 $\\mathrm{B}'(3,\\,-7,\\,5)$이고, $\\overline{\\mathrm{QB}}=\\overline{\\mathrm{QB}'}$이다.\n이때 선분 $\\mathrm{A}'\\mathrm{B}'$ 위의 점 $(-1+4t,\\,5-12t,\\,2+3t)$ ($0\\le t\\le 1$)는 $t=\\dfrac{1}{4}$일 때 $yz$평면과 만나고, $t=\\dfrac{5}{12}$일 때 $zx$평면과 만나므로 네 점 $\\mathrm{A}'$, $\\mathrm{P}$, $\\mathrm{Q}$, $\\mathrm{B}'$이 이 순서대로 일직선 위에 놓일 수 있다.\n따라서 구하는 최솟값은 선분 $\\mathrm{A}'\\mathrm{B}'$의 길이와 같다.\n$$\\overline{\\mathrm{AP}}+\\overline{\\mathrm{PQ}}+\\overline{\\mathrm{QB}}=\\overline{\\mathrm{A}'\\mathrm{P}}+\\overline{\\mathrm{PQ}}+\\overline{\\mathrm{QB}'}\\ge \\overline{\\mathrm{A}'\\mathrm{B}'}$$\n$$\\overline{\\mathrm{A}'\\mathrm{B}'}=\\sqrt{\\{3-(-1)\\}^2+(-7-5)^2+(5-2)^2}=\\sqrt{16+144+9}=\\sqrt{169}=13$$\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-GEO-RPM-060",
    "problemTypeKey": "PT_GEO_SPACE_COORDINATE",
    "templateKey": "TPL_GEO_SPACE_COORD_MIN_PATH",
    "crossConceptKeys": [
      "CC_REFLECTION",
      "CC_SHORTEST_DISTANCE_COLLINEAR"
    ],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 2,
    "category": "공간좌표 핵심 개념",
    "standardCourse": "기하",
    "curriculum": "2022",
    "standardUnitKey": "H22-GE-04",
    "standardUnit": "공간좌표",
    "standardUnitOrder": 4,
    "subUnitKey": "H22-GE-04-CORE",
    "subUnit": "공간좌표 핵심 개념",
    "subUnitConfidence": "candidate_evidence",
    "subUnitClassificationDepth": "complete_candidate",
    "conceptClusterKey": "H22-GE-04-CORE",
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "공간좌표 핵심 개념"
    ],
    "wide": false,
    "content": "오른쪽 그림과 같이 좌표공간 위의 두 점 $\\mathrm{A}(2,\\,5,\\,1)$, $\\mathrm{B}(4,\\,1,\\,2)$와 $xy$평면 위의 점 $\\mathrm{P}$, $zx$평면 위의 점 $\\mathrm{Q}$에 대하여 $\\overline{\\mathrm{AP}}+\\overline{\\mathrm{PQ}}+\\overline{\\mathrm{QB}}$의 최솟값은? [그림: 원점 $\\mathrm{O}$와 $x$축, $y$축, $z$축으로 이루어진 좌표공간의 제$1$팔분면에 두 점 $\\mathrm{A}(2,\\,5,\\,1)$, $\\mathrm{B}(4,\\,1,\\,2)$가 있고, $xy$평면의 제$1$사분면 위에 점 $\\mathrm{P}$, $zx$평면의 제$1$사분면 위에 점 $\\mathrm{Q}$가 놓여 있으며 선분 $\\mathrm{AP}$, $\\mathrm{PQ}$, $\\mathrm{QB}$가 차례로 연결되어 있다.]",
    "choices": [
      "$7$",
      "$8$",
      "$9$",
      "$10$",
      "$11$"
    ],
    "answer": "①",
    "solution": "점 $\\mathrm{A}(2,\\,5,\\,1)$을 $xy$평면에 대하여 대칭이동한 점을 $\\mathrm{A}'$이라 하면 $\\mathrm{A}'(2,\\,5,\\,-1)$이고, $\\overline{\\mathrm{AP}}=\\overline{\\mathrm{A}'\\mathrm{P}}$이다.\n점 $\\mathrm{B}(4,\\,1,\\,2)$를 $zx$평면에 대하여 대칭이동한 점을 $\\mathrm{B}'$이라 하면 $\\mathrm{B}'(4,\\,-1,\\,2)$이고, $\\overline{\\mathrm{QB}}=\\overline{\\mathrm{QB}'}$이다.\n선분 $\\mathrm{A}'\\mathrm{B}'$ 위의 점 $(2+2t,\\,5-6t,\\,-1+3t)$ ($0\\le t\\le 1$)는 $t=\\dfrac{1}{3}$일 때 $xy$평면과 만나고, $t=\\dfrac{5}{6}$일 때 $zx$평면과 만나므로 네 점 $\\mathrm{A}'$, $\\mathrm{P}$, $\\mathrm{Q}$, $\\mathrm{B}'$이 이 순서대로 일직선 위에 있을 때 최솟값을 갖는다.\n따라서 구하는 최솟값은\n$$\\overline{\\mathrm{A}'\\mathrm{B}'}=\\sqrt{(4-2)^2+(-1-5)^2+\\{2-(-1)\\}^2}=\\sqrt{4+36+9}=\\sqrt{49}=7$$\n따라서 정답은 ①이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-GEO-RPM-060",
    "problemTypeKey": "PT_GEO_SPACE_COORDINATE",
    "templateKey": "TPL_GEO_SPACE_COORD_MIN_PATH",
    "crossConceptKeys": [
      "CC_REFLECTION",
      "CC_SHORTEST_DISTANCE_COLLINEAR"
    ],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 3,
    "category": "공간좌표 핵심 개념",
    "standardCourse": "기하",
    "curriculum": "2022",
    "standardUnitKey": "H22-GE-04",
    "standardUnit": "공간좌표",
    "standardUnitOrder": 4,
    "subUnitKey": "H22-GE-04-CORE",
    "subUnit": "공간좌표 핵심 개념",
    "subUnitConfidence": "candidate_evidence",
    "subUnitClassificationDepth": "complete_candidate",
    "conceptClusterKey": "H22-GE-04-CORE",
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "공간좌표 핵심 개념"
    ],
    "wide": false,
    "content": "좌표공간 위의 세 점 $\\mathrm{A}(1,\\,5,\\,3)$, $\\mathrm{B}(3,\\,1,\\,1)$, $\\mathrm{C}(4,\\,2,\\,3)$과 $yz$평면과 $xy$평면 위를 각각 움직이는 두 점 $\\mathrm{P}$, $\\mathrm{Q}$가 있다. 이때 $\\overline{\\mathrm{AP}}+\\overline{\\mathrm{PB}}+\\overline{\\mathrm{BQ}}+\\overline{\\mathrm{QC}}$의 최솟값은?",
    "choices": [
      "$6+3\\sqrt{2}$",
      "$5+4\\sqrt{2}$",
      "$7+3\\sqrt{2}$",
      "$6+4\\sqrt{2}$",
      "$8+3\\sqrt{2}$"
    ],
    "answer": "①",
    "solution": "두 점 $\\mathrm{P}$, $\\mathrm{Q}$는 서로 독립적으로 움직이므로 $\\overline{\\mathrm{AP}}+\\overline{\\mathrm{PB}}$와 $\\overline{\\mathrm{BQ}}+\\overline{\\mathrm{QC}}$의 최솟값을 각각 구하여 더하면 된다.\n(ⅰ) 두 점 $\\mathrm{A}$, $\\mathrm{B}$의 $x$좌표가 모두 양수이므로 $yz$평면에 대하여 같은 쪽에 있다.\n점 $\\mathrm{A}(1,\\,5,\\,3)$을 $yz$평면에 대하여 대칭이동한 점을 $\\mathrm{A}'$이라 하면 $\\mathrm{A}'(-1,\\,5,\\,3)$이므로\n$$\\overline{\\mathrm{AP}}+\\overline{\\mathrm{PB}}=\\overline{\\mathrm{A}'\\mathrm{P}}+\\overline{\\mathrm{PB}}\\ge \\overline{\\mathrm{A}'\\mathrm{B}}=\\sqrt{\\{3-(-1)\\}^2+(1-5)^2+(1-3)^2}=\\sqrt{16+16+4}=6$$\n(ⅱ) 두 점 $\\mathrm{B}$, $\\mathrm{C}$의 $z$좌표가 모두 양수이므로 $xy$평면에 대하여 같은 쪽에 있다.\n점 $\\mathrm{C}(4,\\,2,\\,3)$을 $xy$평면에 대하여 대칭이동한 점을 $\\mathrm{C}'$이라 하면 $\\mathrm{C}'(4,\\,2,\\,-3)$이므로\n$$\\overline{\\mathrm{BQ}}+\\overline{\\mathrm{QC}}=\\overline{\\mathrm{BQ}}+\\overline{\\mathrm{QC}'}\\ge \\overline{\\mathrm{BC}'}=\\sqrt{(4-3)^2+(2-1)^2+(-3-1)^2}=\\sqrt{1+1+16}=3\\sqrt{2}$$\n(ⅰ), (ⅱ)에서 구하는 최솟값은 $6+3\\sqrt{2}$이다.\n따라서 정답은 ①이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B45",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-GEO-RPM-060",
    "problemTypeKey": "PT_GEO_SPACE_COORDINATE",
    "templateKey": "TPL_GEO_SPACE_COORD_MIN_PATH",
    "crossConceptKeys": [
      "CC_REFLECTION",
      "CC_SHORTEST_DISTANCE_COLLINEAR"
    ],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
  }
];
