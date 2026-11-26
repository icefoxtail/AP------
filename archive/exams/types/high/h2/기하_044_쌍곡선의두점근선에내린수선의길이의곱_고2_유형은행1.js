window.examTitle = "기하_044_쌍곡선의두점근선에내린수선의길이의곱_고2_유형은행1";

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
    "content": "쌍곡선 $2x^2 - 3y^2 = 18$ 위의 임의의 점 $\\mathrm{P}$에서 두 점근선에 내린 수선의 발을 각각 $\\mathrm{A, B}$라 할 때, 선분의 길이의 곱 $\\overline{\\mathrm{PA}} \\times \\overline{\\mathrm{PB}}$의 값은?",
    "choices": [
      "\\dfrac{18}{5}",
      "\\dfrac{19}{5}",
      "4",
      "\\dfrac{21}{5}",
      "\\dfrac{22}{5}"
    ],
    "answer": "①",
    "solution": "[쌍곡선의 표준형 구하기] 주어진 쌍곡선의 방정식의 양변을 $18$로 나누면 $\\dfrac{x^2}{9} - \\dfrac{y^2}{6} = 1$이다.\n[점근선의 방정식 구하기] 점근선의 방정식 공식 $y = \\pm \\dfrac{b}{a}x$에 $a^2 = 9$, $b^2 = 6$을 대입하면 $y = \\pm \\dfrac{\\sqrt{6}}{3}x$이므로 두 점근선의 방정식은 일반형으로 $\\sqrt{2}x - \\sqrt{3}y = 0$, $\\sqrt{2}x + \\sqrt{3}y = 0$이다.\n[점과 직선 사이의 거리 공식 적용] 쌍곡선 위의 임의의 점을 $\\mathrm{P}(x_1, y_1)$이라 하면 두 점근선에 내린 수선의 길이는 각각 $\\overline{\\mathrm{PA}} = \\dfrac{|\\sqrt{2}x_1 - \\sqrt{3}y_1|}{\\sqrt{(\\sqrt{2})^2 + (-\\sqrt{3})^2}} = \\dfrac{|\\sqrt{2}x_1 - \\sqrt{3}y_1|}{\\sqrt{5}}$, $\\overline{\\mathrm{PB}} = \\dfrac{|\\sqrt{2}x_1 + \\sqrt{3}y_1|}{\\sqrt{(\\sqrt{2})^2 + (\\sqrt{3})^2}} = \\dfrac{|\\sqrt{2}x_1 + \\sqrt{3}y_1|}{\\sqrt{5}}$이다.\n[두 수선의 길이의 곱 계산] 두 선분의 길이의 곱은 $\\overline{\\mathrm{PA}} \\times \\overline{\\mathrm{PB}} = \\dfrac{|(\\sqrt{2}x_1 - \\sqrt{3}y_1)(\\sqrt{2}x_1 + \\sqrt{3}y_1)|}{\\sqrt{5} \\times \\sqrt{5}} = \\dfrac{|2x_1^2 - 3y_1^2|}{5}$이다.\n[쌍곡선의 방정식 대입] 점 $\\mathrm{P}(x_1, y_1)$은 쌍곡선 $2x^2 - 3y^2 = 18$ 위의 점이므로 $2x_1^2 - 3y_1^2 = 18$을 대입하면 $\\overline{\\mathrm{PA}} \\times \\overline{\\mathrm{PB}} = \\dfrac{18}{5}$이다.\n주의: 쌍곡선 위의 점의 위치에 관계없이 두 점근선에 내린 수선의 길이의 곱은 항상 일정한 상수 $\\dfrac{a^2 b^2}{a^2 + b^2} = \\dfrac{9 \\times 6}{9 + 6} = \\dfrac{18}{5}$로 유지된다.\n따라서 정답은 ①이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-GEO-RPM-044",
    "problemTypeKey": "PT_GEO_HYPERBOLA",
    "templateKey": "TPL_GEO_HYPERBOLA_ASYMPTOTE_AXIS",
    "crossConceptKeys": [
      "CC_POINT_LINE_DISTANCE"
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
    "content": "쌍곡선 $x^2 - y^2 = 7$ 위의 임의의 점 $\\mathrm{P}$에서 두 점근선에 내린 수선의 발을 각각 $\\mathrm{A, B}$라 할 때, 사각형 $\\mathrm{AOBP}$의 넓이는? (단, $\\mathrm{O}$는 원점이다.) [그림: 좌표평면에서 쌍곡선 $x^2 - y^2 = 7$과 원점 $\\mathrm{O}$를 지나며 서로 수직인 두 점근선 $y=x$, $y=-x$가 있다. 쌍곡선 위의 제$1$사분면에 위치한 점 $\\mathrm{P}$에서 두 점근선에 각각 수선을 내려 수선의 발을 $\\mathrm{A, B}$라 하고, 원점 $\\mathrm{O}$와 세 점 $\\mathrm{A, B, P}$를 꼭짓점으로 하는 사각형 $\\mathrm{AOBP}$가 직사각형으로 표시되어 있다.]",
    "choices": [
      "\\dfrac{3}{2}",
      "2",
      "\\dfrac{5}{2}",
      "3",
      "\\dfrac{7}{2}"
    ],
    "answer": "⑤",
    "solution": "[점근선의 방정식 구하기] 쌍곡선 $x^2 - y^2 = 7$의 양변을 $7$로 나누면 $\\dfrac{x^2}{7} - \\dfrac{y^2}{7} = 1$이므로 두 점근선의 방정식은 $y = x$와 $y = -x$이다.\n[두 점근선의 위치 관계 확인] 두 점근선의 기울기는 각각 $1$과 $-1$이고, 두 기울기의 곱이 $1 \\times (-1) = -1$이므로 두 점근선은 원점 $\\mathrm{O}$에서 서로 수직이다($\\angle \\mathrm{AOB} = 90^\\circ$).\n[사각형 $\\mathrm{AOBP}$의 형태 결정] 점 $\\mathrm{P}$에서 두 점근선에 내린 수선의 발이 $\\mathrm{A, B}$이므로 $\\angle \\mathrm{PAO} = 90^\\circ$, $\\angle \\mathrm{PBO} = 90^\\circ$이고, 사각형 내각의 합은 $360^\\circ$이므로 세 내각이 직각이면 나머지 한 각도 직각이 되어 사각형 $\\mathrm{AOBP}$는 직사각형이다.\n[직사각형의 넓이 식 세우기] 직사각형 $\\mathrm{AOBP}$의 넓이를 $S$라 하면 두 이웃한 변의 길이의 곱이므로 $S = \\overline{\\mathrm{PA}} \\times \\overline{\\mathrm{PB}}$이다.\n[수선의 길이의 곱 공식 적용] 쌍곡선 $\\dfrac{x^2}{a^2} - \\dfrac{y^2}{b^2} = 1$ 위의 임의의 점에서 두 점근선에 내린 수선의 길이의 곱 공식에 의해 $\\overline{\\mathrm{PA}} \\times \\overline{\\mathrm{PB}} = \\dfrac{a^2 b^2}{a^2 + b^2}$이다.\n[넓이 계산하기] $a^2 = 7$, $b^2 = 7$을 대입하면 $S = \\dfrac{7 \\times 7}{7 + 7} = \\dfrac{49}{14} = \\dfrac{7}{2}$이다.\n주의: 두 점근선이 서로 수직인 직각쌍곡선에서는 사각형 $\\mathrm{AOBP}$가 항상 직사각형이 되므로 넓이는 점 $\\mathrm{P}$의 좌표와 무관하게 항상 일정하다.\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-GEO-RPM-044",
    "problemTypeKey": "PT_GEO_HYPERBOLA",
    "templateKey": "TPL_GEO_HYPERBOLA_ASYMPTOTE_AXIS",
    "crossConceptKeys": [
      "CC_POINT_LINE_DISTANCE",
      "CC_PERPENDICULAR",
      "CC_AREA"
    ],
    "conditionKeys": [],
    "integrationPattern": "REINTERPRETATION",
    "image": "assets/images/기하_044_쌍곡선의두점근선에내린수선의길이의곱_고2_유형은행1/q2-problem.svg",
    "imageAlt": "직각쌍곡선 위의 점 P에서 두 점근선에 내린 수선과 직사각형 AOBP",
    "imageCaption": "직각쌍곡선 위의 점 P에서 두 점근선에 내린 수선과 직사각형 AOBP",
    "imageSize": "full"
  }
];
