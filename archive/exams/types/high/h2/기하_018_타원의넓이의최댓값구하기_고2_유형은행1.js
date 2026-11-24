window.examTitle = "기하_018_타원의넓이의최댓값구하기_고2_유형은행1";

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
    "content": "타원 $\\dfrac{x^2}{9}+\\dfrac{y^2}{25}=1$ 위의 한 점 $\\mathrm{P}$와 두 초점 $\\mathrm{F}, \\mathrm{F}'$에 대하여 삼각형 $\\mathrm{PF}'\\mathrm{F}$의 넓이의 최댓값은?",
    "choices": [
      "$4$",
      "$6$",
      "$8$",
      "$10$",
      "$12$"
    ],
    "answer": "⑤",
    "solution": "타원 $\\dfrac{x^2}{9}+\\dfrac{y^2}{25}=1$에서 $a^2=9, b^2=25$이므로 장축은 $y$축 위에 있다.\n두 초점 $\\mathrm{F}, \\mathrm{F}'$의 좌표를 각각 $(0, c), (0, -c)$ ($c>0$)라 하면\n$c=\\sqrt{25-9}=\\sqrt{16}=4$\n이므로 $\\overline{\\mathrm{FF}'}=2c=8$이다.\n삼각형 $\\mathrm{PF}'\\mathrm{F}$의 밑변을 선분 $\\mathrm{FF}'$이라 하면, 넓이가 최대일 때는 점 $\\mathrm{P}$가 단축의 끝점 $(3, 0)$ 또는 $(-3, 0)$에 위치할 때이고, 이때 높이의 최댓값은 $3$이다.\n따라서 구하는 넓이의 최댓값은\n$\\dfrac{1}{2} \\times 8 \\times 3 = 12$\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-GEO-RPM-042",
    "problemTypeKey": "PT_GEO_ELLIPSE",
    "templateKey": "TPL_GEO_ELLIPSE_EXTREMA",
    "crossConceptKeys": [
      "CC_TRIANGLE_AREA"
    ],
    "conditionKeys": [],
    "integrationPattern": "NONE"
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
    "content": "그림과 같이 두 정점 $\\mathrm{A}, \\mathrm{B}$와 $\\overline{\\mathrm{AP}}+\\overline{\\mathrm{BP}}=26$을 만족시키며 움직이는 점 $\\mathrm{P}$가 있다. $\\overline{\\mathrm{AB}}=10$일 때, 삼각형 $\\mathrm{PAB}$의 넓이의 최댓값은? [그림: 가로 방향의 선분 $\\mathrm{AB}$ 아래쪽에 길이 $10$이 표시되어 있고, 선분 $\\mathrm{AB}$ 위쪽에 점 $\\mathrm{P}$를 잡아 삼각형 $\\mathrm{PAB}$가 그려져 있다.]",
    "choices": [
      "$36$",
      "$48$",
      "$54$",
      "$60$",
      "$72$"
    ],
    "answer": "④",
    "solution": "두 정점 $\\mathrm{A}, \\mathrm{B}$를 초점으로 하고 점 $\\mathrm{P}$가 그리는 도형은 장축의 길이가 $26$인 타원이다.\n장축의 길이를 $2a$, 초점 사이의 거리를 $2c$라 하면\n$2a=26 \\Rightarrow a=13$, $2c=10 \\Rightarrow c=5$\n단축의 길이의 절반을 $b$ ($b>0$)라 하면\n$b=\\sqrt{a^2-c^2}=\\sqrt{13^2-5^2}=\\sqrt{144}=12$\n삼각형 $\\mathrm{PAB}$의 넓이가 최대일 때는 점 $\\mathrm{P}$가 단축의 끝점에 있을 때이므로, 높이의 최댓값은 $b=12$이다.\n따라서 구하는 넓이의 최댓값은\n$\\dfrac{1}{2} \\times 10 \\times 12 = 60$\n따라서 정답은 ④이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-GEO-RPM-042",
    "problemTypeKey": "PT_GEO_ELLIPSE",
    "templateKey": "TPL_GEO_ELLIPSE_EXTREMA",
    "crossConceptKeys": [
      "CC_TRIANGLE_AREA",
      "CC_PYTHAGOREAN"
    ],
    "conditionKeys": [],
    "integrationPattern": "REINTERPRETATION"
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
    "content": "그림과 같이 타원 모양으로 만들어진 공원 광장이 있다. 이 광장에는 조형물이 두 군데에 있는데, 타원의 두 초점 $\\mathrm{F}, \\mathrm{F}'$에 각각 위치한다고 한다. 두 조형물 사이의 거리가 $10\\,\\mathrm{m}$이고 광장의 둘레의 한 점 $\\mathrm{P}$에서 두 조형물까지의 거리의 합이 $14\\,\\mathrm{m}$일 때, 삼각형 $\\mathrm{PF}'\\mathrm{F}$의 넓이의 최댓값은? (단, 단위는 $\\mathrm{m}^2$이다.) [그림: 장축이 가로인 타원 내부의 가로축 위에 두 초점 $\\mathrm{F}'$(왼쪽)과 $\\mathrm{F}$(오른쪽)가 있고, 두 초점 사이의 거리가 $10\\,\\mathrm{m}$로 표시되어 있으며, 타원 둘레 위의 한 점 $\\mathrm{P}$와 $\\mathrm{F}', \\mathrm{F}$를 연결한 삼각형 $\\mathrm{PF}'\\mathrm{F}$가 그려져 있다.]",
    "choices": [
      "$4\\sqrt{6}$",
      "$8\\sqrt{6}$",
      "$10\\sqrt{6}$",
      "$12\\sqrt{6}$",
      "$16\\sqrt{6}$"
    ],
    "answer": "③",
    "solution": "타원의 장축의 길이를 $2a$, 두 초점 사이의 거리를 $2c$라 하면\n$2a=14 \\Rightarrow a=7$, $2c=10 \\Rightarrow c=5$\n단축의 길이의 절반을 $b$ ($b>0$)라 하면\n$b=\\sqrt{a^2-c^2}=\\sqrt{7^2-5^2}=\\sqrt{24}=2\\sqrt{6}$\n삼각형 $\\mathrm{PF}'\\mathrm{F}$의 넓이는 점 $\\mathrm{P}$가 타원의 단축의 끝점에 위치할 때 최대가 되며, 이때 높이의 최댓값은 $b=2\\sqrt{6}$이다.\n따라서 구하는 넓이의 최댓값은\n$\\dfrac{1}{2} \\times 10 \\times 2\\sqrt{6} = 10\\sqrt{6}\\,(\\mathrm{m}^2)$\n따라서 정답은 ③이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-GEO-RPM-042",
    "problemTypeKey": "PT_GEO_ELLIPSE",
    "templateKey": "TPL_GEO_ELLIPSE_EXTREMA",
    "crossConceptKeys": [
      "CC_TRIANGLE_AREA"
    ],
    "conditionKeys": [],
    "integrationPattern": "NONE"
  }
];
