window.examTitle = "기하_205_구가평면과만나는곡선과곡선밖의점에서최단_고2_유형은행1";

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
    "content": "좌표공간에서 구 $(x-1)^2+(y+2)^2+(z-2)^2=13$이 $zx$평면과 만나서 생기는 원에 대하여 점 $\\mathrm{P}(-5, 1, 10)$에서 원 위의 점까지의 거리의 최솟값은?",
    "choices": [
      "$2\\sqrt{2}$",
      "$3\\sqrt{2}$",
      "$3\\sqrt{3}$",
      "$4\\sqrt{2}$",
      "$5\\sqrt{2}$"
    ],
    "answer": "⑤",
    "solution": "구가 $zx$평면($y=0$)과 만나서 생기는 원의 방정식은\n$$(x-1)^2 + (0+2)^2 + (z-2)^2 = 13 \\iff (x-1)^2 + (z-2)^2 = 9$$\n이므로 $zx$평면 위의 중심이 $\\mathrm{C}(1, 0, 2)$이고 반지름의 길이가 $3$인 원이다.\n점 $\\mathrm{P}(-5, 1, 10)$에서 $zx$평면에 내린 수선의 발을 $\\mathrm{H}$라 하면 $\\mathrm{H}(-5, 0, 10)$이고 $\\overline{\\mathrm{PH}} = 1$이다.\n$zx$평면 위에서 두 점 $\\mathrm{H}, \\mathrm{C}$ 사이의 거리는\n$$\\overline{\\mathrm{HC}} = \\sqrt{(-5-1)^2 + (10-2)^2} = \\sqrt{36 + 64} = 10$$\n이므로 점 $\\mathrm{H}$에서 원 위의 점까지의 거리의 최솟값은 $10 - 3 = 7$이다.\n따라서 점 $\\mathrm{P}$에서 원 위의 점까지의 거리의 최솟값은\n$$\\sqrt{\\overline{\\mathrm{PH}}^2 + 7^2} = \\sqrt{1^2 + 7^2} = \\sqrt{50} = 5\\sqrt{2}$$\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-GEO-RPM-064",
    "problemTypeKey": "PT_GEO_SPHERE",
    "templateKey": "TPL_GEO_SPHERE_SECTION_TANGENT",
    "primaryMethod": "구와 $zx$평면의 교선 원을 구한 뒤 평면 위 최단거리를 3차원 거리로 환산한다",
    "decisiveStep": "$\\overline{\\mathrm{HC}}=10$에서 $10-3=7$, $\\sqrt{1^2+7^2}=5\\sqrt{2}$",
    "crossConceptKeys": [
      "CC_CIRCLE_CENTER_RADIUS",
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
    "content": "구 $(x-2)^2+(y-1)^2+(z-2)^2=13$이 $yz$평면과 만나서 생기는 원을 $C$라 하자. 이때 점 $\\mathrm{P}(6, 4, 6)$에서 원 $C$ 위의 점까지의 거리의 최댓값은?",
    "choices": [
      "$8$",
      "$9$",
      "$10$",
      "$11$",
      "$12$"
    ],
    "answer": "③",
    "solution": "구가 $yz$평면($x=0$)과 만나서 생기는 원 $C$의 방정식은\n$$(0-2)^2 + (y-1)^2 + (z-2)^2 = 13 \\iff (y-1)^2 + (z-2)^2 = 9$$\n이므로 원 $C$의 중심은 $\\mathrm{A}(0, 1, 2)$이고 반지름의 길이는 $3$이다.\n점 $\\mathrm{P}(6, 4, 6)$에서 $yz$평면에 내린 수선의 발을 $\\mathrm{H}$라 하면 $\\mathrm{H}(0, 4, 6)$이고 $\\overline{\\mathrm{PH}} = 6$이다.\n$yz$평면 위에서 두 점 $\\mathrm{H}, \\mathrm{A}$ 사이의 거리는\n$$\\overline{\\mathrm{HA}} = \\sqrt{(4-1)^2 + (6-2)^2} = \\sqrt{9 + 16} = 5$$\n이므로 점 $\\mathrm{H}$에서 원 $C$ 위의 점까지의 거리의 최댓값은 $5 + 3 = 8$이다.\n따라서 점 $\\mathrm{P}$에서 원 $C$ 위의 점까지의 거리의 최댓값은\n$$\\sqrt{\\overline{\\mathrm{PH}}^2 + 8^2} = \\sqrt{6^2 + 8^2} = 10$$\n따라서 정답은 ③이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-GEO-RPM-064",
    "problemTypeKey": "PT_GEO_SPHERE",
    "templateKey": "TPL_GEO_SPHERE_SECTION_TANGENT",
    "primaryMethod": "구와 $yz$평면의 교선 원을 구한 뒤 평면 위 최댓값을 3차원 거리로 환산한다",
    "decisiveStep": "$\\overline{\\mathrm{HA}}=\\sqrt{3^2+4^2}=5$에서 $5+3=8$, $\\sqrt{6^2+8^2}=10$",
    "crossConceptKeys": [
      "CC_CIRCLE_CENTER_RADIUS",
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
    "content": "좌표공간에서 구 $(x-1)^2+(y+2)^2+(z-1)^2=20$과 $zx$평면이 만나서 생기는 도형 위의 점 $\\mathrm{P}$와 구 $(x-7)^2+(y-8)^2+(z-9)^2=4$ 위의 점 $\\mathrm{Q}$에 대하여 선분 $\\mathrm{PQ}$의 길이가 최소일 때, 그 최솟값은?",
    "choices": [
      "$7$",
      "$8$",
      "$9$",
      "$10$",
      "$11$"
    ],
    "answer": "②",
    "solution": "첫 번째 구가 $zx$평면($y=0$)과 만나서 생기는 원 $C$의 방정식은\n$$(x-1)^2 + (0+2)^2 + (z-1)^2 = 20 \\iff (x-1)^2 + (z-1)^2 = 16$$\n이므로 원 $C$의 중심은 $\\mathrm{A}(1, 0, 1)$이고 반지름의 길이는 $4$이다.\n두 번째 구의 중심을 $\\mathrm{B}(7, 8, 9)$라 하면 반지름의 길이는 $2$이다.\n점 $\\mathrm{B}$에서 $zx$평면에 내린 수선의 발을 $\\mathrm{H}$라 하면 $\\mathrm{H}(7, 0, 9)$이고 $\\overline{\\mathrm{BH}} = 8$이다.\n$zx$평면 위에서 $\\overline{\\mathrm{HA}} = \\sqrt{(7-1)^2 + (9-1)^2} = \\sqrt{36 + 64} = 10$이므로 점 $\\mathrm{H}$에서 원 $C$ 위의 점 $\\mathrm{P}$까지의 거리의 최솟값은 $10 - 4 = 6$이다.\n따라서 선분 $\\mathrm{BP}$의 길이의 최솟값은 $\\sqrt{8^2 + 6^2} = 10$이다.\n구 위의 점 $\\mathrm{Q}$에 대하여 $\\overline{\\mathrm{PQ}} \\ge \\overline{\\mathrm{BP}} - 2$이므로 선분 $\\mathrm{PQ}$의 길이의 최솟값은 $10 - 2 = 8$이다.\n따라서 정답은 ②이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-GEO-RPM-064",
    "problemTypeKey": "PT_GEO_SPHERE",
    "templateKey": "TPL_GEO_SPHERE_SECTION_TANGENT",
    "primaryMethod": "교선 원과 다른 구 중심 사이 거리를 구해 두 반지름을 차례로 빼 최단거리를 낸다",
    "decisiveStep": "$\\overline{\\mathrm{HA}}=10$에서 $10-4=6$, $\\sqrt{8^2+6^2}=10$이므로 $10-2=8$",
    "crossConceptKeys": [
      "CC_CIRCLE_CENTER_RADIUS",
      "CC_DISTANCE_TWO_POINTS"
    ],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
  }
];
