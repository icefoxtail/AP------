window.examTitle = "기하_071_타원의접선의방정식의활용-산술평균과기하_고2_유형은행1";

window.questionBank = [
  {
    "id": 1,
    "category": "이차곡선의 접선 핵심 개념",
    "standardCourse": "기하",
    "curriculum": "2022",
    "standardUnitKey": "H22-GE-02",
    "standardUnit": "이차곡선의 접선",
    "standardUnitOrder": 2,
    "subUnitKey": "H22-GE-02-CORE",
    "subUnit": "이차곡선의 접선 핵심 개념",
    "subUnitConfidence": "candidate_evidence",
    "subUnitClassificationDepth": "complete_candidate",
    "conceptClusterKey": "H22-GE-02-CORE",
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "이차곡선의 접선 핵심 개념"
    ],
    "wide": false,
    "content": "타원 $x^2 + 4y^2 = 16$ 위의 점 $\\mathrm{P}(x_1, y_1)$에서의 접선이 $x$축, $y$축과 만나는 점을 각각 $\\mathrm{A}, \\mathrm{B}$라 하자. 삼각형 $\\mathrm{OAB}$의 넓이의 최솟값은? (단, 점 $\\mathrm{P}$는 제1사분면 위의 점이고, $\\mathrm{O}$는 원점이다.) [그림: 좌표평면에서 타원 $x^2 + 4y^2 = 16$ 위의 제1사분면에 있는 점 $\\mathrm{P}(x_1, y_1)$에서의 접선이 $x$축의 양의 부분과 만나는 점 $\\mathrm{A}$, $y$축의 양의 부분과 만나는 점 $\\mathrm{B}$가 표시되어 있고, 원점 $\\mathrm{O}$와 두 점 $\\mathrm{A}, \\mathrm{B}$를 꼭짓점으로 하는 직각삼각형 $\\mathrm{OAB}$의 내부가 색칠된 모습]",
    "choices": [
      "① $6$",
      "② $8$",
      "③ $10$",
      "④ $12$",
      "⑤ $14$"
    ],
    "answer": "②",
    "solution": "타원의 방정식 $x^2 + 4y^2 = 16$의 양변을 $16$으로 나누어 표준형으로 나타낸다.\n$\\frac{x^2}{16} + \\frac{y^2}{4} = 1$\n점 $\\mathrm{P}(x_1, y_1)$은 타원 위의 점이므로\n$\\frac{x_1^2}{16} + \\frac{y_1^2}{4} = 1$\n이 성립하고, 점 $\\mathrm{P}$는 제1사분면 위의 점이므로 $x_1 > 0$, $y_1 > 0$이다.\n타원의 접선의 방정식 공식에 의해 점 $\\mathrm{P}(x_1, y_1)$에서의 접선의 방정식은\n$\\frac{x_1 x}{16} + \\frac{y_1 y}{4} = 1$\n$y = 0$을 대입하면 $x = \\frac{16}{x_1}$이므로 $\\mathrm{A}\\left(\\frac{16}{x_1}, 0\\right)$이고,\n$x = 0$을 대입하면 $y = \\frac{4}{y_1}$이므로 $\\mathrm{B}\\left(0, \\frac{4}{y_1}\\right)$이다.\n삼각형 $\\mathrm{OAB}$는 직각삼각형이므로 그 넓이를 $S$라 하면\n$S = \\frac{1}{2} \\cdot \\overline{\\mathrm{OA}} \\cdot \\overline{\\mathrm{OB}} = \\frac{1}{2} \\cdot \\frac{16}{x_1} \\cdot \\frac{4}{y_1} = \\frac{32}{x_1 y_1}$\n$x_1 > 0$, $y_1 > 0$에서 $\\frac{x_1^2}{16} > 0$, $\\frac{y_1^2}{4} > 0$이므로 산술평균과 기하평균의 관계를 적용한다.\n$1 = \\frac{x_1^2}{16} + \\frac{y_1^2}{4} \\ge 2\\sqrt{\\frac{x_1^2}{16} \\cdot \\frac{y_1^2}{4}} = 2 \\cdot \\frac{x_1 y_1}{8} = \\frac{x_1 y_1}{4}$\n양변에 $4$를 곱하면\n$x_1 y_1 \\le 4$\n(단, 등호는 $\\frac{x_1^2}{16} = \\frac{y_1^2}{4} = \\frac{1}{2}$, 즉 $x_1 = 2\\sqrt{2}$, $y_1 = \\sqrt{2}$일 때 성립)\n$x_1 y_1 \\le 4$이므로 분모의 최댓값 $4$를 대입할 때 넓이 $S$는 최솟값을 갖는다.\n$S = \\frac{32}{x_1 y_1} \\ge \\frac{32}{4} = 8$\n주의: 등호 성립 조건인 점 $(2\\sqrt{2}, \\sqrt{2})$가 실제로 제1사분면 위의 점이므로 최솟값 $8$이 달성된다.\n따라서 정답은 ②이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-GEO-RPM-049",
    "problemTypeKey": "PT_GEO_CONIC_TANGENT",
    "templateKey": "TPL_GEO_TANGENT_ON_CONIC",
    "crossConceptKeys": [
      "CC_TRIANGLE_AREA",
      "CC_INTERCEPTS"
    ],
    "conditionKeys": [
      "COND_RANGE"
    ],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 2,
    "category": "이차곡선의 접선 핵심 개념",
    "standardCourse": "기하",
    "curriculum": "2022",
    "standardUnitKey": "H22-GE-02",
    "standardUnit": "이차곡선의 접선",
    "standardUnitOrder": 2,
    "subUnitKey": "H22-GE-02-CORE",
    "subUnit": "이차곡선의 접선 핵심 개념",
    "subUnitConfidence": "candidate_evidence",
    "subUnitClassificationDepth": "complete_candidate",
    "conceptClusterKey": "H22-GE-02-CORE",
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "이차곡선의 접선 핵심 개념"
    ],
    "wide": false,
    "content": "타원 $\\frac{x^2}{8} + \\frac{y^2}{18} = 1$ 위의 제1사분면에 있는 점 $\\mathrm{P}$에서의 접선이 $x$축, $y$축과 만나는 점을 각각 $\\mathrm{A}, \\mathrm{B}$라 할 때, 삼각형 $\\mathrm{OAB}$의 넓이의 최솟값은? (단, $\\mathrm{O}$는 원점이다.) [그림: 좌표평면에서 세로로 긴 타원 $\\frac{x^2}{8} + \\frac{y^2}{18} = 1$ 위의 제1사분면에 있는 점 $\\mathrm{P}$에서의 접선이 $x$축의 양의 부분과 만나는 점 $\\mathrm{A}$, $y$축의 양의 부분과 만나는 점 $\\mathrm{B}$를 이은 직각삼각형 $\\mathrm{OAB}$의 내부가 색칠되어 있는 모습]",
    "choices": [
      "① $8$",
      "② $10$",
      "③ $12$",
      "④ $14$",
      "⑤ $16$"
    ],
    "answer": "③",
    "solution": "제1사분면에 있는 점 $\\mathrm{P}$의 좌표를 $(x_1, y_1)$이라 하면 $x_1 > 0$, $y_1 > 0$이고 타원 위의 점이므로\n$\\frac{x_1^2}{8} + \\frac{y_1^2}{18} = 1$\n이 성립한다.\n타원의 접선의 방정식 공식에 의해 점 $\\mathrm{P}(x_1, y_1)$에서의 접선의 방정식은\n$\\frac{x_1 x}{8} + \\frac{y_1 y}{18} = 1$\n$y = 0$을 대입하면 $x = \\frac{8}{x_1}$이므로 $\\mathrm{A}\\left(\\frac{8}{x_1}, 0\\right)$이고,\n$x = 0$을 대입하면 $y = \\frac{18}{y_1}$이므로 $\\mathrm{B}\\left(0, \\frac{18}{y_1}\\right)$이다.\n$\\angle \\mathrm{AOB} = 90^\\circ$이므로 삼각형 $\\mathrm{OAB}$의 넓이 $S$는 다음과 같다.\n$S = \\frac{1}{2} \\cdot \\overline{\\mathrm{OA}} \\cdot \\overline{\\mathrm{OB}} = \\frac{1}{2} \\cdot \\frac{8}{x_1} \\cdot \\frac{18}{y_1} = \\frac{72}{x_1 y_1}$\n$x_1 > 0$, $y_1 > 0$이므로 $\\frac{x_1^2}{8} > 0$, $\\frac{y_1^2}{18} > 0$이다. 산술평균과 기하평균의 관계를 적용한다.\n$1 = \\frac{x_1^2}{8} + \\frac{y_1^2}{18} \\ge 2\\sqrt{\\frac{x_1^2}{8} \\cdot \\frac{y_1^2}{18}} = 2\\sqrt{\\frac{x_1^2 y_1^2}{144}} = \\frac{2 x_1 y_1}{12} = \\frac{x_1 y_1}{6}$\n양변에 $6$을 곱하면\n$x_1 y_1 \\le 6$\n(단, 등호는 $\\frac{x_1^2}{8} = \\frac{y_1^2}{18} = \\frac{1}{2}$, 즉 $x_1^2 = 4, y_1^2 = 9$에서 $x_1 = 2, y_1 = 3$일 때 성립)\n$x_1 y_1 \\le 6$이므로 분모의 최댓값 $6$을 대입하여 $S$의 최솟값을 구한다.\n$S = \\frac{72}{x_1 y_1} \\ge \\frac{72}{6} = 12$\n주의: 등호 성립 조건인 점 $\\mathrm{P}(2, 3)$은 제1사분면 위의 점이며 실제로 타원의 방정식 $\\frac{2^2}{8} + \\frac{3^2}{18} = \\frac{1}{2} + \\frac{1}{2} = 1$을 만족하므로 최솟값 $12$가 달성된다.\n따라서 정답은 ③이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-GEO-RPM-049",
    "problemTypeKey": "PT_GEO_CONIC_TANGENT",
    "templateKey": "TPL_GEO_TANGENT_ON_CONIC",
    "crossConceptKeys": [
      "CC_TRIANGLE_AREA",
      "CC_INTERCEPTS"
    ],
    "conditionKeys": [
      "COND_RANGE"
    ],
    "integrationPattern": "SEQUENTIAL"
  }
];
