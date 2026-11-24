window.examTitle = "기하_199_구밖의한점과구위의점을이은선분의길이의최_고2_유형은행1";

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
    "content": "구 $(x-2)^2 + (y+1)^2 + (z-3)^2 = 16$ 위의 점 $\\mathrm{P}$와 구 밖의 점 $\\mathrm{Q}(-1,\\; 3,\\; 6)$ 사이의 거리의 최댓값을 $M$, 최솟값을 $m$이라 할 때, $Mm$의 값은?",
    "choices": [
      "$16$",
      "$18$",
      "$20$",
      "$22$",
      "$24$"
    ],
    "answer": "②",
    "solution": "주어진 구의 중심을 $\\mathrm{C}(2,\\; -1,\\; 3)$, 반지름의 길이를 $r = 4$라 하면 두 점 $\\mathrm{C}$, $\\mathrm{Q}$ 사이의 거리는\n$$\\overline{\\mathrm{CQ}} = \\sqrt{(-1-2)^2 + (3+1)^2 + (6-3)^2} = \\sqrt{9+16+9} = \\sqrt{34}$$\n구 위의 점 $\\mathrm{P}$와 구 밖의 점 $\\mathrm{Q}$ 사이의 거리의 최댓값 $M$과 최솟값 $m$은 각각\n$$M = \\overline{\\mathrm{CQ}} + r = \\sqrt{34} + 4$$\n$$m = \\overline{\\mathrm{CQ}} - r = \\sqrt{34} - 4$$\n$$\\therefore Mm = (\\sqrt{34} + 4)(\\sqrt{34} - 4) = 34 - 16 = 18$$\n따라서 정답은 ②이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B12",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-GEO-RPM-064",
    "problemTypeKey": "PT_GEO_SPHERE",
    "templateKey": "TPL_GEO_SPHERE_DISTANCE_EXTREMA",
    "primaryMethod": "중심까지의 거리에 반지름을 더하고 빼 최댓값과 최솟값을 구해 곱한다",
    "decisiveStep": "$Mm=(\\sqrt{34}+4)(\\sqrt{34}-4)=34-16=18$",
    "crossConceptKeys": [
      "CC_DISTANCE_TWO_POINTS"
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
    "content": "구 $(x+3)^2 + (y-6)^2 + (z-2\\sqrt{19})^2 = 25$ 위의 한 점 $\\mathrm{P}(a,\\; b,\\; c)$에 대하여 $a^2+b^2+c^2$의 최솟값은?",
    "choices": [
      "$32$",
      "$36$",
      "$40$",
      "$44$",
      "$48$"
    ],
    "answer": "②",
    "solution": "원점을 $\\mathrm{O}(0,\\; 0,\\; 0)$이라 하면 $a^2+b^2+c^2 = \\overline{\\mathrm{OP}}^2$이므로, $\\overline{\\mathrm{OP}}$가 최소일 때 $a^2+b^2+c^2$도 최소가 된다.\n주어진 구의 중심을 $\\mathrm{C}(-3,\\; 6,\\; 2\\sqrt{19})$, 반지름의 길이를 $r = 5$라 하면\n$$\\overline{\\mathrm{OC}} = \\sqrt{(-3)^2 + 6^2 + (2\\sqrt{19})^2} = \\sqrt{9 + 36 + 76} = \\sqrt{121} = 11$$\n원점 $\\mathrm{O}$는 구 밖의 점이므로 $\\overline{\\mathrm{OP}}$의 최솟값은\n$$\\overline{\\mathrm{OC}} - r = 11 - 5 = 6$$\n따라서 $a^2+b^2+c^2$의 최솟값은\n$$6^2 = 36$$\n따라서 정답은 ②이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B12",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-GEO-RPM-064",
    "problemTypeKey": "PT_GEO_SPHERE",
    "templateKey": "TPL_GEO_SPHERE_DISTANCE_EXTREMA",
    "primaryMethod": "원점에서 중심까지 거리에서 반지름을 빼 $\\overline{\\mathrm{OP}}$의 최솟값을 제곱한다",
    "decisiveStep": "$\\overline{\\mathrm{OC}}-r=11-5=6$이므로 $a^2+b^2+c^2$의 최솟값은 $6^2=36$",
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
    "content": "좌표공간에서 $x$축에 접하는 구\n$$(x-2)^2 + (y-a)^2 + (z-5)^2 = 169$$\n위의 점과 점 $\\mathrm{P}(10,\\; 21,\\; 17)$ 사이의 거리의 최솟값을 $m$이라 할 때, $a+m$의 값은? (단, $a>0$)",
    "choices": [
      "$14$",
      "$15$",
      "$16$",
      "$17$",
      "$18$"
    ],
    "answer": "③",
    "solution": "주어진 구의 중심은 $\\mathrm{C}(2,\\; a,\\; 5)$이고 반지름의 길이는 $r = 13$이다.\n이 구가 $x$축에 접하므로 중심 $\\mathrm{C}$에서 $x$축까지의 거리가 $13$이어야 한다.\n$$\\sqrt{a^2 + 5^2} = 13 \\implies a^2 + 25 = 169 \\implies a^2 = 144$$\n$a>0$이므로 $a = 12$이고, 중심의 좌표는 $\\mathrm{C}(2,\\; 12,\\; 5)$이다.\n이제 두 점 $\\mathrm{C}(2,\\; 12,\\; 5)$와 $\\mathrm{P}(10,\\; 21,\\; 17)$ 사이의 거리는\n$$\\overline{\\mathrm{CP}} = \\sqrt{(10-2)^2 + (21-12)^2 + (17-5)^2} = \\sqrt{64 + 81 + 144} = \\sqrt{289} = 17$$\n점 $\\mathrm{P}$는 구 밖의 점이므로 구 위의 점과 점 $\\mathrm{P}$ 사이의 거리의 최솟값 $m$은\n$$m = \\overline{\\mathrm{CP}} - r = 17 - 13 = 4$$\n$$\\therefore a + m = 12 + 4 = 16$$\n따라서 정답은 ③이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-GEO-RPM-064",
    "problemTypeKey": "PT_GEO_SPHERE",
    "templateKey": "TPL_GEO_SPHERE_DISTANCE_EXTREMA",
    "primaryMethod": "$x$축 접함으로 $a$를 정하고 중심까지 거리에서 반지름을 빼 최솟값을 구한다",
    "decisiveStep": "$\\sqrt{a^2+5^2}=13$에서 $a=12$, $m=17-13=4$이므로 $a+m=16$",
    "crossConceptKeys": [
      "CC_DISTANCE_TWO_POINTS"
    ],
    "conditionKeys": [
      "COND_POSITIVE"
    ],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 4,
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
    "content": "좌표공간에서 구 $x^2+y^2+z^2-4x+6y-2z+10=0$ 위의 점 $\\mathrm{P}$와 구 $x^2+y^2+z^2+2x-6y+10z+26=0$ 위의 점 $\\mathrm{Q}$에 대하여 두 점 $\\mathrm{P}$, $\\mathrm{Q}$ 사이의 거리의 최댓값을 $M$, 최솟값을 $m$이라 할 때, $M+m$의 값은?",
    "choices": [
      "$18$",
      "$20$",
      "$22$",
      "$24$",
      "$26$"
    ],
    "answer": "①",
    "solution": "두 구의 방정식을 각각 표준형으로 변형하면\n$$(x-2)^2 + (y+3)^2 + (z-1)^2 = 4$$\n$$(x+1)^2 + (y-3)^2 + (z+5)^2 = 9$$\n두 구의 중심을 각각 $\\mathrm{C}_1(2,\\; -3,\\; 1)$, $\\mathrm{C}_2(-1,\\; 3,\\; -5)$라 하고 반지름의 길이를 각각 $r_1 = 2$, $r_2 = 3$이라 하자.\n두 중심 사이의 거리는\n$$\\overline{\\mathrm{C}_1\\mathrm{C}_2} = \\sqrt{(-1-2)^2 + (3+3)^2 + (-5-1)^2} = \\sqrt{9 + 36 + 36} = \\sqrt{81} = 9$$\n$\\overline{\\mathrm{C}_1\\mathrm{C}_2} = 9 > 2 + 3 = r_1 + r_2$이므로 두 구는 서로 외부에 있다.\n따라서 두 점 $\\mathrm{P}$, $\\mathrm{Q}$ 사이의 거리의 최댓값 $M$과 최솟값 $m$은\n$$M = \\overline{\\mathrm{C}_1\\mathrm{C}_2} + r_1 + r_2 = 9 + 2 + 3 = 14$$\n$$m = \\overline{\\mathrm{C}_1\\mathrm{C}_2} - r_1 - r_2 = 9 - 2 - 3 = 4$$\n$$\\therefore M + m = 14 + 4 = 18$$\n따라서 정답은 ①이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-GEO-RPM-064",
    "problemTypeKey": "PT_GEO_SPHERE",
    "templateKey": "TPL_GEO_SPHERE_DISTANCE_EXTREMA",
    "primaryMethod": "두 구를 표준형으로 바꿔 중심거리에 반지름의 합과 차를 적용해 최댓값·최솟값을 구한다",
    "decisiveStep": "$\\overline{\\mathrm{C}_1\\mathrm{C}_2}=9$에서 $M=9+2+3=14$, $m=9-2-3=4$이므로 $M+m=18$",
    "crossConceptKeys": [
      "CC_DISTANCE_TWO_POINTS"
    ],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 5,
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
    "content": "좌표공간의 두 점 $\\mathrm{A}(0,\\; 12,\\; 0)$, $\\mathrm{B}(0,\\; 0,\\; 16)$과 구 $(x-9)^2 + (y-6)^2 + (z-8)^2 = 16$ 위의 점 $\\mathrm{C}$에 대하여 삼각형 $\\mathrm{ABC}$의 넓이의 최댓값을 $M$, 최솟값을 $m$이라 할 때, $M-m$의 값은?",
    "choices": [
      "$80$",
      "$90$",
      "$100$",
      "$110$",
      "$120$"
    ],
    "answer": "①",
    "solution": "선분 $\\mathrm{AB}$의 길이는\n$$\\overline{\\mathrm{AB}} = \\sqrt{0^2 + (-12)^2 + 16^2} = \\sqrt{144 + 256} = 20$$\n선분 $\\mathrm{AB}$의 중점을 $\\mathrm{H}$라 하면 $\\mathrm{H}(0,\\; 6,\\; 8)$이다.\n주어진 구의 중심을 $\\mathrm{O}'(9,\\; 6,\\; 8)$, 반지름의 길이를 $r = 4$라 하면 점 $\\mathrm{O}'$에서 $yz$평면에 내린 수선의 발이 점 $\\mathrm{H}(0,\\; 6,\\; 8)$이므로 직선 $\\mathrm{O}'\\mathrm{H}$는 $yz$평면 위의 직선 $\\mathrm{AB}$와 수직이다.\n따라서 중심 $\\mathrm{O}'$에서 직선 $\\mathrm{AB}$까지의 거리는\n$$\\overline{\\mathrm{O}'\\mathrm{H}} = 9$$\n구 위의 점 $\\mathrm{C}$에서 직선 $\\mathrm{AB}$까지의 거리를 $h$라 하면 $r = 4 < 9$이므로 $h$의 최댓값과 최솟값은 각각\n$$h_{\\max} = 9 + 4 = 13,\\quad h_{\\min} = 9 - 4 = 5$$\n따라서 삼각형 $\\mathrm{ABC}$의 넓이의 최댓값 $M$과 최솟값 $m$은\n$$M = \\dfrac{1}{2} \\times 20 \\times 13 = 130,\\quad m = \\dfrac{1}{2} \\times 20 \\times 5 = 50$$\n$$\\therefore M - m = 130 - 50 = 80$$\n따라서 정답은 ①이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-GEO-RPM-064",
    "problemTypeKey": "PT_GEO_SPHERE",
    "templateKey": "TPL_GEO_SPHERE_DISTANCE_EXTREMA",
    "primaryMethod": "중심에서 직선 $\\mathrm{AB}$까지 거리에 반지름을 더하고 빼 높이의 최대·최소로 넓이 차를 구한다",
    "decisiveStep": "$h_{\\max}=9+4=13$, $h_{\\min}=9-4=5$에서 $\\frac{1}{2}\\times20\\times(13-5)=80$",
    "crossConceptKeys": [
      "CC_MIDPOINT",
      "CC_POINT_TO_LINE_DISTANCE",
      "CC_TRIANGLE_AREA"
    ],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
  }
];
