window.examTitle = "기하_001_포물선의방정식1_고2_유형은행1";

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
    "content": "원 $x^2+y^2+3x-4=0$의 중심을 초점으로 하고, 준선이 $x=\\frac{3}{2}$인 포물선이 점 $(a, -6)$을 지날 때, 상수 $a$의 값은?",
    "choices": [
      "$-9$",
      "$-6$",
      "$-4$",
      "$-3$",
      "$-2$"
    ],
    "answer": "②",
    "solution": "원의 방정식 $x^2+y^2+3x-4=0$을 변형하면\n$\\left(x+\\frac{3}{2}\\right)^2+y^2=\\frac{25}{4}$\n이므로 원의 중심의 좌표는 $\\left(-\\frac{3}{2}, 0\\right)$이다.\n포물선의 초점이 $\\left(-\\frac{3}{2}, 0\\right)$이고 준선이 $x=\\frac{3}{2}$이므로 $p=-\\frac{3}{2}$이다.\n따라서 구하는 포물선의 방정식은\n$y^2=4\\left(-\\frac{3}{2}\\right)x=-6x$\n이 포물선이 점 $(a, -6)$을 지나므로 대입하면\n$(-6)^2=-6a$, $36=-6a$\n$\\therefore a=-6$\n따라서 정답은 ②이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-GEO-RPM-039",
    "problemTypeKey": "PT_GEO_PARABOLA",
    "templateKey": "TPL_GEO_PARABOLA_STANDARD_EQUATION",
    "primaryMethod": "원의 방정식을 표준형으로 고쳐 중심을 구한 뒤 포물선의 방정식에 점을 대입한다",
    "decisiveStep": "$p=-\\frac{3}{2}$에서 $y^2=-6x$를 세우고 $(a, -6)$을 대입해 $a=-6$",
    "crossConceptKeys": [
      "CC_CIRCLE_EQUATION"
    ],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
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
    "content": "초점이 $\\mathrm{F}(0, p)$ ($p<0$)이고 준선이 $y=-p$인 포물선의 꼭짓점을 $\\mathrm{O}$라 하자. 초점 $\\mathrm{F}$를 지나고 $x$축에 평행한 직선과 포물선이 만나는 두 점을 각각 $\\mathrm{A}$, $\\mathrm{B}$라 할 때, 삼각형 $\\mathrm{OAB}$의 넓이가 $72$이다. 상수 $p$의 값은?",
    "choices": [
      "$-12$",
      "$-10$",
      "$-8$",
      "$-6$",
      "$-4$"
    ],
    "answer": "④",
    "solution": "초점이 $\\mathrm{F}(0, p)$이고 준선이 $y=-p$인 포물선의 방정식은\n$x^2=4py$\n초점 $\\mathrm{F}(0, p)$를 지나고 $x$축에 평행한 직선의 방정식은 $y=p$이므로 이를 포물선의 방정식에 대입하면\n$x^2=4p^2$, $x=\\pm 2p$\n따라서 $\\overline{\\mathrm{AB}}=2|2p|=-4p$ ($p<0$)이고, 삼각형 $\\mathrm{OAB}$의 높이는 $\\overline{\\mathrm{OF}}=|p|=-p$이다.\n삼각형 $\\mathrm{OAB}$의 넓이가 $72$이므로\n$\\frac{1}{2}\\times (-4p)\\times (-p)=72$\n$2p^2=72$, $p^2=36$\n$p<0$이므로 $p=-6$\n따라서 정답은 ④이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-GEO-RPM-039",
    "problemTypeKey": "PT_GEO_PARABOLA",
    "templateKey": "TPL_GEO_PARABOLA_STANDARD_EQUATION",
    "primaryMethod": "초점과 준선으로 포물선의 방정식을 세우고 삼각형 넓이 조건으로 p를 구한다",
    "decisiveStep": "$y=p$를 $x^2=4py$에 대입해 $AB=-4p$, 높이 $-p$이므로 $2p^2=72$에서 $p=-6$",
    "crossConceptKeys": [
      "CC_EQUATIONS_PARALLEL_TO_AXES",
      "CC_TRIANGLE_AREA"
    ],
    "conditionKeys": [
      "COND_NEGATIVE"
    ],
    "integrationPattern": "SEQUENTIAL"
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
    "content": "다음 그림과 같이 꼭짓점 $\\mathrm{O}$, 초점이 $\\mathrm{F}$인 포물선 위의 두 점 $\\mathrm{A}$, $\\mathrm{B}$에 대하여 직선 $\\mathrm{AB}$가 포물선의 축에 수직이다. $\\overline{\\mathrm{OF}}=4$이고 점 $\\mathrm{F}$와 직선 $\\mathrm{AB}$ 사이의 거리가 $5$일 때, 선분 $\\mathrm{OA}$의 길이는? [그림: 꼭짓점 $\\mathrm{O}$에서 오른쪽으로 열린 포물선(대칭축은 수평선) 위에 위쪽 점 $\\mathrm{A}$와 아래쪽 점 $\\mathrm{B}$가 있고, 포물선의 축 위에 초점 $\\mathrm{F}$가 있으며 $\\overline{\\mathrm{OF}}=4$로 표시되어 있다. 선분 $\\mathrm{AB}$는 축과 수직이고 점 $\\mathrm{F}$는 $\\mathrm{O}$와 직선 $\\mathrm{AB}$ 사이에 있으며, 점 $\\mathrm{F}$에서 직선 $\\mathrm{AB}$까지의 거리가 $5$로 표시되어 있다.]",
    "choices": [
      "$12$",
      "$13$",
      "$15$",
      "$17$",
      "$19$"
    ],
    "answer": "③",
    "solution": "꼭짓점 $\\mathrm{O}$를 원점 $(0, 0)$, 포물선의 축을 $x$축으로 놓으면 초점의 좌표는 $\\mathrm{F}(4, 0)$이므로 포물선의 방정식은\n$y^2=4\\times 4x=16x$\n점 $\\mathrm{F}(4, 0)$이 원점 $\\mathrm{O}$와 직선 $\\mathrm{AB}$ 사이에 있고 점 $\\mathrm{F}$와 직선 $\\mathrm{AB}$ 사이의 거리가 $5$이므로, 직선 $\\mathrm{AB}$의 방정식은 $x=4+5=9$이다.\n$x=9$를 $y^2=16x$에 대입하면\n$y^2=144$, $y=\\pm 12$\n따라서 점 $\\mathrm{A}$의 좌표는 $(9, 12)$이므로\n$\\overline{\\mathrm{OA}}=\\sqrt{9^2+12^2}=\\sqrt{81+144}=\\sqrt{225}=15$\n따라서 정답은 ③이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-GEO-RPM-039",
    "problemTypeKey": "PT_GEO_PARABOLA",
    "templateKey": "TPL_GEO_PARABOLA_STANDARD_EQUATION",
    "primaryMethod": "꼭짓점을 원점, 축을 x축으로 두고 포물선 위 점의 좌표에서 OA의 길이를 구한다",
    "decisiveStep": "$\\overline{OF}=4$에서 $y^2=16x$, $x=9$이면 $y=\\pm 12$이고 $\\overline{OA}=15$",
    "crossConceptKeys": [
      "CC_PERPENDICULAR",
      "CC_DISTANCE_TWO_POINTS"
    ],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL",
    "image": "assets/images/기하_001_포물선의방정식1_고2_유형은행1/q3-problem.svg",
    "imageAlt": "초점 F와 수직현 AB 사이의 거리 및 OF의 길이를 나타낸 포물선",
    "imageCaption": "초점 F와 수직현 AB 사이의 거리 및 OF의 길이를 나타낸 포물선",
    "imageSize": "full"
  }
];
