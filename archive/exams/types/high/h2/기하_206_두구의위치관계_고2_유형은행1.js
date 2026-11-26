window.examTitle = "기하_206_두구의위치관계_고2_유형은행1";

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
    "content": "두 구 $(x-1)^2+(y+3)^2+(z-2)^2=4$, $(x+5)^2+y^2+z^2=2a+15$가 서로 외접할 때, 상수 $a$의 값은?",
    "choices": [
      "$3$",
      "$5$",
      "$7$",
      "$9$",
      "$11$"
    ],
    "answer": "②",
    "solution": "두 구의 중심을 각각 $\\mathrm{A}$, $\\mathrm{B}$, 반지름의 길이를 각각 $r_1$, $r_2$라 하면\n$$\\mathrm{A}(1, -3, 2), \\quad r_1 = \\sqrt{4} = 2$$\n$$\\mathrm{B}(-5, 0, 0), \\quad r_2 = \\sqrt{2a+15} \\quad \\left(단, \\, a > -\\frac{15}{2}\\right)$$\n두 구의 중심 사이의 거리 $d$는\n$$d = \\overline{\\mathrm{AB}} = \\sqrt{(-5-1)^2 + \\{0-(-3)\\}^2 + (0-2)^2} = \\sqrt{36 + 9 + 4} = \\sqrt{49} = 7$$\n두 구가 서로 외접하므로 $d = r_1 + r_2$이다.\n$$7 = 2 + \\sqrt{2a+15}$$\n$$\\sqrt{2a+15} = 5$$\n양변을 제곱하면 $2a+15 = 25$이므로 $2a = 10$, 즉 $a = 5$이다.\n따라서 정답은 ②이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-GEO-RPM-064",
    "problemTypeKey": "PT_GEO_SPHERE",
    "templateKey": "TPL_GEO_SPHERE_TWO_SPHERES",
    "primaryMethod": "두 구의 중심과 반지름을 읽고 외접 조건 $d=r_1+r_2$로 $a$를 구한다",
    "decisiveStep": "$\\sqrt{36+9+4}=7$이고 $2+\\sqrt{2a+15}=7$에서 $a=5$",
    "crossConceptKeys": [
      "CC_DISTANCE_TWO_POINTS"
    ],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL",
    "solutionImage": "assets/images/기하_206_두구의위치관계_고2_유형은행1/q1-solution.svg",
    "solutionImageAlt": "두 구의 중심을 지나는 평면에서 외접 관계를 단면원으로 나타내면 중심 거리 7은 두 반지름 2와 5의 합이다.",
    "solutionImageCaption": "두 구의 중심을 지나는 평면에서 외접 관계를 단면원으로 나타내면 중심 거리 7은 두 반지름 2와 5의 합이다.",
    "solutionImageSize": "full"
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
    "content": "두 구 $(x-2)^2+(y-1)^2+(z+2)^2=13$, $(x+3)^2+(y-k)^2+(z-1)^2=13$이 각각 $yz$평면과 만나서 생기는 두 원이 서로 외접할 때, 실수 $k$가 될 수 있는 모든 값의 곱은?",
    "choices": [
      "$-21$",
      "$-18$",
      "$-15$",
      "$-12$",
      "$-9$"
    ],
    "answer": "③",
    "solution": "두 구가 $yz$평면($x=0$)과 만나서 생기는 원의 방정식은 각각의 방정식에 $x=0$을 대입하여 구할 수 있다.\n(1) 첫 번째 구에 $x=0$을 대입하면\n$$(0-2)^2 + (y-1)^2 + (z+2)^2 = 13 \\implies (y-1)^2 + (z+2)^2 = 9$$\n따라서 이 원의 중심은 $\\mathrm{C}_1(0, 1, -2)$이고 반지름의 길이는 $r_1 = 3$이다.\n(2) 두 번째 구에 $x=0$을 대입하면\n$$(0+3)^2 + (y-k)^2 + (z-1)^2 = 13 \\implies (y-k)^2 + (z-1)^2 = 4$$\n따라서 이 원의 중심은 $\\mathrm{C}_2(0, k, 1)$이고 반지름의 길이는 $r_2 = 2$이다.\n두 원이 $yz$평면 위에서 서로 외접하므로 중심 사이의 거리는 두 반지름의 길이의 합과 같다.\n$$\\overline{\\mathrm{C}_1\\mathrm{C}_2} = r_1 + r_2 = 3 + 2 = 5$$\n$$\\sqrt{(k-1)^2 + \\{1-(-2)\\}^2} = 5$$\n양변을 제곱하면\n$$(k-1)^2 + 9 = 25 \\implies (k-1)^2 = 16$$\n$$k-1 = \\pm 4 \\implies k = 5 \\text{ 또는 } k = -3$$\n따라서 실수 $k$가 될 수 있는 모든 값의 곱은 $5 \\times (-3) = -15$이다.\n따라서 정답은 ③이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-GEO-RPM-064",
    "problemTypeKey": "PT_GEO_SPHERE",
    "templateKey": "TPL_GEO_SPHERE_TWO_SPHERES",
    "primaryMethod": "$x=0$을 대입해 두 교선 원을 얻고 두 원의 외접 조건으로 $k$를 구한다",
    "decisiveStep": "$(k-1)^2+9=25$에서 $k=5$ 또는 $-3$, 곱은 $-15$",
    "crossConceptKeys": [
      "CC_CIRCLE_EQUATION",
      "CC_CIRCLE_POSITION_RELATION",
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
    "content": "점 $\\mathrm{P}$를 중심으로 하고 반지름의 길이가 $4$인 구가 두 개의 구\n$$S_1 : (x-1)^2+(y+2)^2+z^2=1, \\quad S_2 : (x-3)^2+(y-2)^2+(z+4)^2=9$$\n에 동시에 외접한다. 이때 점 $\\mathrm{P}$가 나타내는 도형의 길이는?",
    "choices": [
      "$4\\sqrt{5}\\pi$",
      "$4\\sqrt{6}\\pi$",
      "$6\\sqrt{3}\\pi$",
      "$5\\sqrt{6}\\pi$",
      "$8\\sqrt{3}\\pi$"
    ],
    "answer": "②",
    "solution": "두 구 $S_1$, $S_2$의 중심을 각각 $\\mathrm{A}$, $\\mathrm{B}$, 반지름의 길이를 각각 $r_1$, $r_2$라 하면\n$$\\mathrm{A}(1, -2, 0), \\quad r_1 = 1$$\n$$\\mathrm{B}(3, 2, -4), \\quad r_2 = 3$$\n두 중심 사이의 거리는\n$$\\overline{\\mathrm{AB}} = \\sqrt{(3-1)^2 + \\{2-(-2)\\}^2 + (-4-0)^2} = \\sqrt{4 + 16 + 16} = 6$$\n점 $\\mathrm{P}$를 중심으로 하고 반지름의 길이가 $4$인 구가 두 구 $S_1$, $S_2$에 동시에 외접하므로\n$$\\overline{\\mathrm{PA}} = 4 + 1 = 5, \\quad \\overline{\\mathrm{PB}} = 4 + 3 = 7$$\n$\\triangle \\mathrm{PAB}$에서 코사인법칙에 의하여\n$$\\cos(\\angle \\mathrm{PAB}) = \\frac{5^2 + 6^2 - 7^2}{2 \\cdot 5 \\cdot 6} = \\frac{25 + 36 - 49}{60} = \\frac{12}{60} = \\frac{1}{5}$$\n$\\sin(\\angle \\mathrm{PAB}) = \\sqrt{1 - \\left(\\frac{1}{5}\\right)^2} = \\frac{2\\sqrt{6}}{5}$이므로 점 $\\mathrm{P}$에서 직선 $\\mathrm{AB}$까지의 거리 $h$는\n$$h = \\overline{\\mathrm{PA}}\\sin(\\angle \\mathrm{PAB}) = 5 \\times \\frac{2\\sqrt{6}}{5} = 2\\sqrt{6}$$\n따라서 점 $\\mathrm{P}$가 나타내는 도형은 직선 $\\mathrm{AB}$를 축으로 하여 회전한 반지름의 길이가 $2\\sqrt{6}$인 원이므로 그 길이는\n$$2\\pi \\times 2\\sqrt{6} = 4\\sqrt{6}\\pi$$\n따라서 정답은 ②이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-GEO-RPM-064",
    "problemTypeKey": "PT_GEO_SPHERE",
    "templateKey": "TPL_GEO_SPHERE_TWO_SPHERES",
    "primaryMethod": "외접 조건으로 $\\overline{PA}$, $\\overline{PB}$를 정하고 코사인법칙으로 자취 원의 반지름을 구한다",
    "decisiveStep": "$\\cos\\angle\\mathrm{PAB}=\\frac{1}{5}$에서 $h=2\\sqrt{6}$이고 둘레는 $4\\sqrt{6}\\pi$",
    "crossConceptKeys": [
      "CC_DISTANCE_TWO_POINTS",
      "CC_CIRCLE_CIRCUMFERENCE"
    ],
    "conditionKeys": [],
    "integrationPattern": "REINTERPRETATION"
  }
];
