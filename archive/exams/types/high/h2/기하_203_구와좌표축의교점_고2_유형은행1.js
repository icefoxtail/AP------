window.examTitle = "기하_203_구와좌표축의교점_고2_유형은행1";

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
    "content": "구 $(x+1)^2+(y-3)^2+(z-2)^2=16$이 $z$축과 서로 다른 두 점 $\\mathrm{A}$, $\\mathrm{B}$에서 만난다. 구의 중심을 $\\mathrm{C}$라 할 때, 삼각형 $\\mathrm{ABC}$의 넓이는?",
    "choices": [
      "$2\\sqrt{13}$",
      "$2\\sqrt{14}$",
      "$2\\sqrt{15}$",
      "$2\\sqrt{17}$",
      "$2\\sqrt{19}$"
    ],
    "answer": "③",
    "solution": "구의 중심은 $\\mathrm{C}(-1, 3, 2)$이고, 반지름의 길이는 $4$이다.\n구가 $z$축과 만나는 점의 좌표를 구하기 위해 구의 방정식에 $x=0$, $y=0$을 대입하면\n$(0+1)^2+(0-3)^2+(z-2)^2=16$\n$10+(z-2)^2=16 \\implies (z-2)^2=6 \\implies z=2\\pm\\sqrt{6}$\n따라서 두 교점의 좌표는 $\\mathrm{A}(0, 0, 2-\\sqrt{6})$, $\\mathrm{B}(0, 0, 2+\\sqrt{6})$ (또는 순서 바뀜)이므로\n$\\overline{\\mathrm{AB}}=(2+\\sqrt{6})-(2-\\sqrt{6})=2\\sqrt{6}$\n점 $\\mathrm{C}(-1, 3, 2)$에서 $z$축에 내린 수선의 발을 $\\mathrm{H}$라 하면 $\\mathrm{H}(0, 0, 2)$이므로 삼각형 $\\mathrm{ABC}$의 높이는\n$\\overline{\\mathrm{CH}}=\\sqrt{(-1-0)^2+(3-0)^2+(2-2)^2}=\\sqrt{10}$\n따라서 삼각형 $\\mathrm{ABC}$의 넓이는\n$\\frac{1}{2} \\times \\overline{\\mathrm{AB}} \\times \\overline{\\mathrm{CH}} = \\frac{1}{2} \\times 2\\sqrt{6} \\times \\sqrt{10} = \\sqrt{60} = 2\\sqrt{15}$\n따라서 정답은 ③이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-GEO-RPM-064",
    "problemTypeKey": "PT_GEO_SPHERE",
    "templateKey": "TPL_GEO_SPHERE_SECTION_TANGENT",
    "primaryMethod": "구에 $x=0$, $y=0$을 대입해 $z$축 교점을 구하고 삼각형의 넓이를 계산한다",
    "decisiveStep": "$\\overline{\\mathrm{AB}}=2\\sqrt{6}$, 높이 $\\sqrt{10}$에서 넓이 $2\\sqrt{15}$",
    "crossConceptKeys": [
      "CC_DISTANCE_TWO_POINTS",
      "CC_TRIANGLE_AREA"
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
    "content": "중심이 $\\mathrm{C}(-1, 2, -3)$인 구와 $x$축의 두 교점을 잇는 선분의 길이가 $6$일 때, 이 구의 반지름의 길이는?",
    "choices": [
      "$\\sqrt{15}$",
      "$\\sqrt{17}$",
      "$\\sqrt{19}$",
      "$\\sqrt{21}$",
      "$\\sqrt{22}$"
    ],
    "answer": "⑤",
    "solution": "구의 반지름의 길이를 $r$이라 하면 구의 방정식은\n$(x+1)^2+(y-2)^2+(z+3)^2=r^2$\n$x$축과의 교점을 구하기 위해 $y=0$, $z=0$을 대입하면\n$(x+1)^2+(-2)^2+3^2=r^2 \\implies (x+1)^2=r^2-13$\n$x=-1\\pm\\sqrt{r^2-13}$\n두 교점을 잇는 선분의 길이가 $6$이므로\n$2\\sqrt{r^2-13}=6 \\implies \\sqrt{r^2-13}=3$\n양변을 제곱하면 $r^2-13=9$이므로 $r^2=22$\n$r>0$이므로 구하는 구의 반지름의 길이는 $\\sqrt{22}$이다.\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-GEO-RPM-064",
    "problemTypeKey": "PT_GEO_SPHERE",
    "templateKey": "TPL_GEO_SPHERE_SECTION_TANGENT",
    "primaryMethod": "$y=0$, $z=0$을 대입해 $x$축 교점 사이 거리를 $r$의 식으로 세우고 반지름을 구한다",
    "decisiveStep": "$2\\sqrt{r^2-13}=6$에서 $r^2=22$이므로 $r=\\sqrt{22}$",
    "crossConceptKeys": [
      "CC_DISTANCE_TWO_POINTS"
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
    "content": "좌표공간에서 점 $\\mathrm{C}(a, 0, 2)$를 중심으로 하는 구가 $x$축과 두 점 $\\mathrm{A}(-1, 0, 0)$, $\\mathrm{B}(7, 0, 0)$에서 만난다. 이 구가 $z$축과 만나는 두 점을 각각 $\\mathrm{D}$, $\\mathrm{E}$라 할 때, 삼각형 $\\mathrm{CDE}$의 넓이는?",
    "choices": [
      "$3\\sqrt{11}$",
      "$3\\sqrt{13}$",
      "$3\\sqrt{14}$",
      "$3\\sqrt{15}$",
      "$3\\sqrt{17}$"
    ],
    "answer": "①",
    "solution": "구의 중심 $\\mathrm{C}(a, 0, 2)$에서 $x$축에 내린 수선의 발이 선분 $\\mathrm{AB}$의 중점이므로\n$a = \\frac{-1+7}{2} = 3$\n즉, 구의 중심은 $\\mathrm{C}(3, 0, 2)$이고 반지름의 길이 $r$은\n$r = \\overline{\\mathrm{CA}} = \\sqrt{(3+1)^2+0^2+(2-0)^2} = \\sqrt{16+4} = \\sqrt{20}$\n따라서 구의 방정식은\n$(x-3)^2+y^2+(z-2)^2=20$\n이 구가 $z$축과 만나는 두 점 $\\mathrm{D}$, $\\mathrm{E}$의 좌표를 구하기 위해 $x=0$, $y=0$을 대입하면\n$(-3)^2+0^2+(z-2)^2=20 \\implies (z-2)^2=11 \\implies z=2\\pm\\sqrt{11}$\n그러므로 $\\overline{\\mathrm{DE}}=(2+\\sqrt{11})-(2-\\sqrt{11})=2\\sqrt{11}$이다.\n점 $\\mathrm{C}(3, 0, 2)$에서 $z$축까지의 거리는 $3$이므로 삼각형 $\\mathrm{CDE}$의 넓이는\n$\\frac{1}{2} \\times \\overline{\\mathrm{DE}} \\times 3 = \\frac{1}{2} \\times 2\\sqrt{11} \\times 3 = 3\\sqrt{11}$\n따라서 정답은 ①이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-GEO-RPM-064",
    "problemTypeKey": "PT_GEO_SPHERE",
    "templateKey": "TPL_GEO_SPHERE_SECTION_TANGENT",
    "primaryMethod": "현의 중점에서 중심의 $x$좌표를 정하고 $z$축 교점과 축까지의 거리로 넓이를 계산한다",
    "decisiveStep": "$a=\\frac{-1+7}{2}=3$, $\\overline{\\mathrm{DE}}=2\\sqrt{11}$, 높이 $3$에서 넓이 $3\\sqrt{11}$",
    "crossConceptKeys": [
      "CC_CIRCLE_CHORD_PERP_BISECTOR",
      "CC_DISTANCE_TWO_POINTS",
      "CC_TRIANGLE_AREA"
    ],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
  }
];
