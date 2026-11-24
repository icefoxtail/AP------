window.examTitle = "기하_030_타원의정의를이용한최대최소_고2_유형은행1";

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
    "content": "타원 $\\frac{x^2}{64} + \\frac{y^2}{39} = 1$의 두 초점을 $\\mathrm{F, F'}$이라 할 때, 타원 위의 점 $\\mathrm{P}$에 대하여 $\\overline{\\mathrm{PF}} \\times \\overline{\\mathrm{PF'}}$의 최댓값은?",
    "choices": [
      "48",
      "52",
      "60",
      "64",
      "68"
    ],
    "answer": "④",
    "solution": "타원의 기본 정보: 타원의 방정식 $\\frac{x^2}{64} + \\frac{y^2}{39} = 1$에서 $a^2 = 64$이므로 $a = 8$이다.\n타원의 정의: 타원 위의 임의의 점 $\\mathrm{P}$와 두 초점 $\\mathrm{F, F'}$ 사이의 거리의 합은 장축의 길이 $2a$와 같으므로 $\\overline{\\mathrm{PF}} + \\overline{\\mathrm{PF'}} = 2 \\times 8 = 16$이다.\n선분의 길이 조건: 길이는 항상 양수이므로 $\\overline{\\mathrm{PF}} > 0, \\overline{\\mathrm{PF'}} > 0$이다.\n산술평균과 기하평균의 관계 적용: $\\frac{\\overline{\\mathrm{PF}} + \\overline{\\mathrm{PF'}}}{2} \\ge \\sqrt{\\overline{\\mathrm{PF}} \\times \\overline{\\mathrm{PF'}}}$\n값 대입 및 정리: $\\frac{16}{2} \\ge \\sqrt{\\overline{\\mathrm{PF}} \\times \\overline{\\mathrm{PF'}}} \\implies 8 \\ge \\sqrt{\\overline{\\mathrm{PF}} \\times \\overline{\\mathrm{PF'}}}$\n양변 제곱: $\\overline{\\mathrm{PF}} \\times \\overline{\\mathrm{PF'}} \\le 8^2 = 64$\n등호 성립 조건: 등호는 $\\overline{\\mathrm{PF}} = \\overline{\\mathrm{PF'}} = 8$일 때, 즉 점 $\\mathrm{P}$가 단축의 양 끝점 $(0, \\pm\\sqrt{39})$에 위치할 때 성립한다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-GEO-RPM-042",
    "problemTypeKey": "PT_GEO_ELLIPSE",
    "templateKey": "TPL_GEO_ELLIPSE_EXTREMA",
    "crossConceptKeys": [],
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
    "content": "타원 $\\frac{(x-3)^2}{36} + \\frac{y^2}{27} = 1$ 위의 점 $\\mathrm{P}$와 점 $\\mathrm{A}(6, 0)$에 대하여 $\\overline{\\mathrm{OP}} \\times \\overline{\\mathrm{AP}}$의 최댓값은? (단, $\\mathrm{O}$는 원점이다.)",
    "choices": [
      "32",
      "36",
      "40",
      "45",
      "48"
    ],
    "answer": "②",
    "solution": "타원의 중심 및 계수 파악: 타원 $\\frac{(x-3)^2}{36} + \\frac{y^2}{27} = 1$의 중심은 $(3, 0)$이고 $a^2 = 36, b^2 = 27$이다.\n초점 거리 계산: $c^2 = a^2 - b^2 = 36 - 27 = 9$에서 $c = 3$이다.\n두 초점의 좌표 구하기: 중심 $(3, 0)$에서 $x$축 방향으로 $\\pm 3$만큼 평행이동하면 $(3 - 3, 0) = (0, 0) = \\mathrm{O}$, $(3 + 3, 0) = (6, 0) = \\mathrm{A}$이므로 두 정점 $\\mathrm{O, A}$는 이 타원의 두 초점이다.\n타원의 정의 적용: 점 $\\mathrm{P}$가 타원 위의 점이므로 두 초점에 이르는 거리의 합은 장축의 길이 $2a$와 같다. 즉, $\\overline{\\mathrm{OP}} + \\overline{\\mathrm{AP}} = 2 \\times 6 = 12$이다.\n산술평균과 기하평균의 관계 적용: $\\overline{\\mathrm{OP}} > 0, \\overline{\\mathrm{AP}} > 0$이므로 $\\frac{\\overline{\\mathrm{OP}} + \\overline{\\mathrm{AP}}}{2} \\ge \\sqrt{\\overline{\\mathrm{OP}} \\times \\overline{\\mathrm{AP}}}$\n값 대입: $\\frac{12}{2} \\ge \\sqrt{\\overline{\\mathrm{OP}} \\times \\overline{\\mathrm{AP}}} \\implies 6 \\ge \\sqrt{\\overline{\\mathrm{OP}} \\times \\overline{\\mathrm{AP}}}$\n양변 제곱: $\\overline{\\mathrm{OP}} \\times \\overline{\\mathrm{AP}} \\le 6^2 = 36$\n등호 성립 확인: 등호는 $\\overline{\\mathrm{OP}} = \\overline{\\mathrm{AP}} = 6$일 때 성립하며, 점 $\\mathrm{P}(3, \\pm\\sqrt{27})$이 타원 위에 실제로 존재한다.\n따라서 정답은 ②이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-GEO-RPM-042",
    "problemTypeKey": "PT_GEO_ELLIPSE",
    "templateKey": "TPL_GEO_ELLIPSE_EXTREMA",
    "crossConceptKeys": [
      "CC_TRANSLATION"
    ],
    "conditionKeys": [],
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
    "content": "오른쪽 그림과 같이 장축의 길이가 40이고 단축의 길이가 24인 타원에 내접하는 직사각형의 넓이의 최댓값은?\n[그림: 좌표평면의 원점에 중심을 두고 장축의 길이가 40인 가로 방향, 단축의 길이가 24인 세로 방향 타원과, 타원에 내접하고 네 변이 각 좌표축에 평행한 직사각형]",
    "choices": [
      "360",
      "400",
      "420",
      "450",
      "480"
    ],
    "answer": "⑤",
    "solution": "타원의 방정식 설정: 좌표평면의 원점을 타원의 중심으로 놓으면 장축의 길이 $2a = 40 \\implies a = 20$, 단축의 길이 $2b = 24 \\implies b = 12$이므로 타원의 방정식은 $\\frac{x^2}{20^2} + \\frac{y^2}{12^2} = 1$이다.\n직사각형의 넓이 식 표현: 제 1사분면에 있는 직사각형의 꼭짓점을 $(x, y)$ ($x > 0, y > 0$)라 하면 가로 길이는 $2x$, 세로 길이는 $2y$이므로 직사각형의 넓이는 $S = 2x \\times 2y = 4xy$이다.\n산술평균과 기하평균의 관계 적용: $\\frac{x^2}{20^2} > 0, \\frac{y^2}{12^2} > 0$이므로 $\\frac{x^2}{20^2} + \\frac{y^2}{12^2} \\ge 2\\sqrt{\\frac{x^2}{20^2} \\times \\frac{y^2}{12^2}} = \\frac{2xy}{20 \\times 12} = \\frac{xy}{120}$이다.\n타원의 관계식 대입: 점 $(x, y)$가 타원 위의 점이므로 $\\frac{x^2}{20^2} + \\frac{y^2}{12^2} = 1$이다. 따라서 $1 \\ge \\frac{xy}{120} \\implies xy \\le 120$이다.\n넓이의 최댓값 계산: $S = 4xy \\le 4 \\times 120 = 480$\n등호 성립 조건: $\\frac{x^2}{20^2} = \\frac{y^2}{12^2} = \\frac{1}{2}$, 즉 $x = 10\\sqrt{2}, y = 6\\sqrt{2}$일 때 성립하며 이 점은 타원 위에 존재한다.\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-GEO-RPM-042",
    "problemTypeKey": "PT_GEO_ELLIPSE",
    "templateKey": "TPL_GEO_ELLIPSE_EXTREMA",
    "crossConceptKeys": [
      "CC_RECTANGLE_AREA"
    ],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
  }
];
