window.examTitle = "기하_201_구밖의한점에서구에그은접선의길이1_고2_유형은행1";

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
    "content": "점 $\\mathrm{P}(2, -2, 9)$에서 중심이 $\\mathrm{C}$인 구 $(x+1)^2+(y-2)^2+(z+3)^2=25$에 그은 접선의 접점을 $\\mathrm{Q}$라 할 때, 삼각형 $\\mathrm{PCQ}$의 넓이는?",
    "choices": [
      "$30$",
      "$35$",
      "$40$",
      "$45$",
      "$50$"
    ],
    "answer": "①",
    "solution": "구 $(x+1)^2+(y-2)^2+(z+3)^2=25$의 중심은 $\\mathrm{C}(-1,2,-3)$이고 반지름의 길이는 $r=5$이다.\n접점 $\\mathrm{Q}$에서의 반지름 $\\mathrm{CQ}$는 접선 $\\mathrm{PQ}$와 수직이므로 $\\angle\\mathrm{CQP}=90^\\circ$이다.\n두 점 사이의 거리 공식에 의하여\n$\\overline{\\mathrm{CP}}=\\sqrt{(2+1)^2+(-2-2)^2+(9+3)^2}=\\sqrt{9+16+144}=\\sqrt{169}=13$\n직각삼각형 $\\mathrm{PCQ}$에서 피타고라스 정리에 의하여\n$\\overline{\\mathrm{PQ}}=\\sqrt{\\overline{\\mathrm{CP}}^2-\\overline{\\mathrm{CQ}}^2}=\\sqrt{13^2-5^2}=\\sqrt{169-25}=\\sqrt{144}=12$\n따라서 삼각형 $\\mathrm{PCQ}$의 넓이는 $\\frac{1}{2}\\cdot\\overline{\\mathrm{CQ}}\\cdot\\overline{\\mathrm{PQ}}=\\frac{1}{2}\\cdot 5\\cdot 12=30$이다.\n따라서 정답은 ①이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-GEO-RPM-064",
    "problemTypeKey": "PT_GEO_SPHERE",
    "templateKey": "TPL_GEO_SPHERE_SECTION_TANGENT",
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
    "content": "점 $\\mathrm{A}(3, -2, 6)$에서 구 $2x^2+2y^2+2z^2-4x+12y-8z+10=0$에 접선을 그을 때, 접선의 길이는?",
    "choices": [
      "$3$",
      "$\\sqrt{10}$",
      "$\\sqrt{11}$",
      "$2\\sqrt{3}$",
      "$\\sqrt{13}$"
    ],
    "answer": "④",
    "solution": "구의 방정식 $2x^2+2y^2+2z^2-4x+12y-8z+10=0$의 양변을 $2$로 나누면\n$x^2+y^2+z^2-2x+6y-4z+5=0$\n이를 완전제곱꼴로 변형하면 $(x-1)^2+(y+3)^2+(z-2)^2=1+9+4-5=9$이므로 중심은 $\\mathrm{C}(1,-3,2)$이고 반지름의 길이는 $r=3$이다.\n주의: 처음 식의 이차항 계수가 $2$이므로 반드시 $2$로 나눈 뒤 중심과 반지름을 구한다.\n접점을 $\\mathrm{T}$라 하면 $\\mathrm{CT}\\perp\\mathrm{AT}$이므로 $\\angle\\mathrm{ATC}=90^\\circ$이다.\n$\\overline{\\mathrm{AC}}^2=(3-1)^2+(-2+3)^2+(6-2)^2=4+1+16=21$\n직각삼각형 $\\mathrm{ATC}$에서 피타고라스 정리에 의하여 접선의 길이는\n$\\overline{\\mathrm{AT}}=\\sqrt{\\overline{\\mathrm{AC}}^2-r^2}=\\sqrt{21-9}=\\sqrt{12}=2\\sqrt{3}$\n따라서 정답은 ④이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-GEO-RPM-064",
    "problemTypeKey": "PT_GEO_SPHERE",
    "templateKey": "TPL_GEO_SPHERE_SECTION_TANGENT",
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
    "content": "점 $\\mathrm{A}(1, -1, 2)$에서 구 $x^2+y^2+z^2+4x-6y+2z+k=0$에 그은 접선의 길이가 $5$일 때, 상수 $k$의 값은?",
    "choices": [
      "$-3$",
      "$-1$",
      "$1$",
      "$3$",
      "$5$"
    ],
    "answer": "⑤",
    "solution": "구의 방정식 $x^2+y^2+z^2+4x-6y+2z+k=0$을 완전제곱꼴로 변형하면\n$(x+2)^2+(y-3)^2+(z+1)^2=4+9+1-k=14-k$\n이므로 중심은 $\\mathrm{C}(-2,3,-1)$이고 반지름의 제곱은 $r^2=14-k$이다.\n$\\overline{\\mathrm{AC}}^2=(1+2)^2+(-1-3)^2+(2+1)^2=9+16+9=34$\n접점을 $\\mathrm{T}$라 하면 $\\angle\\mathrm{ATC}=90^\\circ$이므로 피타고라스 정리에 의하여\n$\\overline{\\mathrm{AT}}^2=\\overline{\\mathrm{AC}}^2-r^2$\n접선의 길이가 $5$이므로 $25=34-(14-k)=20+k$\n따라서 $k=5$이다.\n주의: 반지름이 실수이려면 $14-k>0$, 즉 $k<14$이어야 하는데 $k=5$는 이 조건을 만족한다.\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-GEO-RPM-064",
    "problemTypeKey": "PT_GEO_SPHERE",
    "templateKey": "TPL_GEO_SPHERE_SECTION_TANGENT",
    "crossConceptKeys": [
      "CC_DISTANCE_TWO_POINTS"
    ],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
  }
];
