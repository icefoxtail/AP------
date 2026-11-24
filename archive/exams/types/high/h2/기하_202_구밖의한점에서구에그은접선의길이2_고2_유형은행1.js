window.examTitle = "기하_202_구밖의한점에서구에그은접선의길이2_고2_유형은행1";

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
    "content": "점 $\\mathrm{A}(3, -2, 0)$에서 구 $(x+1)^2+(y-2)^2+(z+2)^2=9$에 그은 접선의 접점들로 이루어진 도형의 넓이는?",
    "choices": [
      "$\\frac{27}{4}\\pi$",
      "$\\frac{29}{4}\\pi$",
      "$\\frac{31}{4}\\pi$",
      "$\\frac{33}{4}\\pi$",
      "$\\frac{35}{4}\\pi$"
    ],
    "answer": "①",
    "solution": "구의 중심을 $\\mathrm{C}$, 반지름의 길이를 $r$이라 하면 $\\mathrm{C}(-1, 2, -2)$, $r=3$이다.\n두 점 $\\mathrm{A}(3, -2, 0)$, $\\mathrm{C}(-1, 2, -2)$ 사이의 거리는\n$\\overline{\\mathrm{AC}}=\\sqrt{(3+1)^2+(-2-2)^2+(0+2)^2}=\\sqrt{16+16+4}=6$\n점 $\\mathrm{A}$에서 구에 그은 접선의 한 접점을 $\\mathrm{B}$라 하면 $\\angle \\mathrm{ABC}=90^\\circ$이므로\n$\\overline{\\mathrm{AB}}=\\sqrt{\\overline{\\mathrm{AC}}^2-r^2}=\\sqrt{6^2-3^2}=\\sqrt{27}=3\\sqrt{3}$\n접점들로 이루어진 도형은 원이고, 이 원의 반지름의 길이를 $r'$이라 하면 직각삼각형 $\\mathrm{ABC}$의 넓이 관계에서\n$r' \\times \\overline{\\mathrm{AC}} = r \\times \\overline{\\mathrm{AB}}$\n$r' = \\frac{3 \\times 3\\sqrt{3}}{6} = \\frac{3\\sqrt{3}}{2}$\n따라서 구하는 도형의 넓이는\n$\\pi (r')^2 = \\pi \\left(\\frac{3\\sqrt{3}}{2}\\right)^2 = \\frac{27}{4}\\pi$\n따라서 정답은 ①이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-GEO-RPM-064",
    "problemTypeKey": "PT_GEO_SPHERE",
    "templateKey": "TPL_GEO_SPHERE_SECTION_TANGENT",
    "primaryMethod": "중심까지의 거리와 반지름으로 접선의 길이를 구한 뒤 접점 원의 반지름을 넓이 관계로 계산한다",
    "decisiveStep": "$r'=\\frac{3\\sqrt{3}}{2}$이므로 넓이 $\\frac{27}{4}\\pi$",
    "crossConceptKeys": [
      "CC_DISTANCE_TWO_POINTS",
      "CC_PYTHAGOREAN",
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
    "content": "좌표공간에서 점 $\\mathrm{A}(-1, 2, -3)$을 지나는 직선이 구 $x^2+y^2+z^2-6x+4y-8z+13=0$ 위의 점 $\\mathrm{P}$에서 접할 때, 점 $\\mathrm{P}$가 나타내는 도형의 길이는?",
    "choices": [
      "$\\frac{8\\sqrt{62}}{9}\\pi$",
      "$\\frac{8\\sqrt{65}}{9}\\pi$",
      "$\\frac{8\\sqrt{66}}{9}\\pi$",
      "$\\frac{8\\sqrt{67}}{9}\\pi$",
      "$\\frac{8\\sqrt{69}}{9}\\pi$"
    ],
    "answer": "②",
    "solution": "주어진 구의 방정식을 변형하면\n$(x-3)^2+(y+2)^2+(z-4)^2=16$\n이므로 구의 중심은 $\\mathrm{C}(3, -2, 4)$, 반지름의 길이는 $r=4$이다.\n두 점 $\\mathrm{A}(-1, 2, -3)$, $\\mathrm{C}(3, -2, 4)$ 사이의 거리는\n$\\overline{\\mathrm{AC}}=\\sqrt{(3+1)^2+(-2-2)^2+(4+3)^2}=\\sqrt{16+16+49}=9$\n직각삼각형 $\\mathrm{APC}$($\\angle \\mathrm{APC}=90^\\circ$)에서 접선의 길이 $\\overline{\\mathrm{AP}}$는\n$\\overline{\\mathrm{AP}}=\\sqrt{\\overline{\\mathrm{AC}}^2-r^2}=\\sqrt{9^2-4^2}=\\sqrt{65}$\n점 $\\mathrm{P}$가 나타내는 도형은 원이고, 이 원의 반지름의 길이를 $r'$이라 하면\n$r' \\times \\overline{\\mathrm{AC}} = r \\times \\overline{\\mathrm{AP}}$\n$r' = \\frac{4 \\times \\sqrt{65}}{9} = \\frac{4\\sqrt{65}}{9}$\n따라서 점 $\\mathrm{P}$가 나타내는 도형의 둘레의 길이는\n$2\\pi r' = 2\\pi \\times \\frac{4\\sqrt{65}}{9} = \\frac{8\\sqrt{65}}{9}\\pi$\n따라서 정답은 ②이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-GEO-RPM-064",
    "problemTypeKey": "PT_GEO_SPHERE",
    "templateKey": "TPL_GEO_SPHERE_SECTION_TANGENT",
    "primaryMethod": "구를 표준형으로 바꿔 중심까지의 거리를 구하고 접점 원의 반지름을 닮음 관계로 계산한다",
    "decisiveStep": "$r'=\\frac{4\\sqrt{65}}{9}$에서 둘레 $\\frac{8\\sqrt{65}}{9}\\pi$",
    "crossConceptKeys": [
      "CC_DISTANCE_TWO_POINTS",
      "CC_PYTHAGOREAN",
      "CC_TRIANGLE_AREA"
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
    "content": "점 $\\mathrm{P}(0, 0, 7)$에서 나온 빛에 의하여 구 $x^2+y^2+z^2-6z+1=0$의 그림자가 $xy$평면에 생길 때, 이 그림자의 넓이는? [그림: $xyz$ 공간좌표에서 $z$축 위의 점 $\\mathrm{P}(0,0,7)$을 꼭짓점으로 하고 중심이 $\\mathrm{C}(0,0,3)$, 반지름의 길이가 $2\\sqrt{2}$인 구에 접하는 원뿔 모양의 빛이 아래쪽 $xy$평면에 원 모양의 그림자를 만드는 입체도형. 원점 $\\mathrm{O}$가 $xy$평면 위 그림자 원의 중심이다.]",
    "choices": [
      "$25\\pi$",
      "$32\\pi$",
      "$36\\pi$",
      "$42\\pi$",
      "$49\\pi$"
    ],
    "answer": "⑤",
    "solution": "주어진 구의 방정식을 변형하면\n$x^2+y^2+(z-3)^2=8$\n이므로 구의 중심은 $\\mathrm{C}(0, 0, 3)$, 반지름의 길이는 $r=2\\sqrt{2}$이다.\n점 $\\mathrm{P}(0, 0, 7)$에서 구에 그은 한 접선의 접점을 $\\mathrm{T}$, 이 접선이 $xy$평면과 만나는 점을 $\\mathrm{Q}$라 하면 그림자는 원점 $\\mathrm{O}$를 중심으로 하고 반지름의 길이가 $\\overline{\\mathrm{OQ}}$인 원이다.\n$\\overline{\\mathrm{PC}}=7-3=4$, $\\overline{\\mathrm{CT}}=2\\sqrt{2}$이므로 직각삼각형 $\\mathrm{PTC}$에서\n$\\overline{\\mathrm{PT}}=\\sqrt{\\overline{\\mathrm{PC}}^2-\\overline{\\mathrm{CT}}^2}=\\sqrt{4^2-(2\\sqrt{2})^2}=\\sqrt{8}=2\\sqrt{2}$\n이때 $\\triangle \\mathrm{PTC} \\sim \\triangle \\mathrm{POQ}$ (AA 닮음)이므로\n$\\overline{\\mathrm{OQ}} : \\overline{\\mathrm{OP}} = \\overline{\\mathrm{CT}} : \\overline{\\mathrm{PT}}$\n$\\overline{\\mathrm{OQ}} : 7 = 2\\sqrt{2} : 2\\sqrt{2} = 1 : 1$\n$\\therefore \\overline{\\mathrm{OQ}}=7$\n따라서 $xy$평면에 생기는 그림자의 넓이는\n$\\pi \\times 7^2 = 49\\pi$\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-GEO-RPM-064",
    "problemTypeKey": "PT_GEO_SPHERE",
    "templateKey": "TPL_GEO_SPHERE_SECTION_TANGENT",
    "primaryMethod": "구의 중심과 반지름으로 접선의 길이를 낸 뒤 닮음으로 그림자 원의 반지름을 계산한다",
    "decisiveStep": "$\\overline{\\mathrm{PT}}=2\\sqrt{2}$, $\\overline{\\mathrm{OQ}}=7$이므로 $49\\pi$",
    "crossConceptKeys": [
      "CC_PYTHAGOREAN",
      "CC_SIMILARITY"
    ],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
  }
];
