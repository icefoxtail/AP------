window.examTitle = "기하_085_곡선밖의서로수직인두접선_고2_유형은행1";

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
    "content": "다음은 포물선 $x^2 = 4py$ ($p \\ne 0$)의 준선 위의 임의의 점 $\\mathrm{P}(x_1, -p)$에서 이 포물선에 그은 두 접선은 서로 수직임을 증명한 것이다.\n\n[증명]\n포물선 $x^2 = 4py$의 준선의 방정식은 [(가)]이다.\n포물선 $x^2 = 4py$에 접하고 기울기가 $m$인 직선의 방정식은\n[(나)]\n이다. 이 직선이 준선 위의 점 $\\mathrm{P}(x_1, -p)$를 지나므로\n$-p = mx_1 - pm^2 \\implies pm^2 - x_1 m - p = 0$\n이때 $p \\ne 0$이므로 $m$에 대한 이차방정식의 근과 계수의 관계에 의하여 두 접선의 기울기의 곱은 [(다)]이다.\n따라서 포물선 $x^2 = 4py$의 준선 위의 임의의 점에서 이 포물선에 그은 두 접선은 서로 수직이다.\n\n위의 (가), (나), (다)에 알맞은 것을 차례로 나열한 것은?",
    "choices": [
      "(가) $y = p$, (나) $y = mx + pm^2$, (다) $1$",
      "(가) $y = p$, (나) $y = mx - pm^2$, (다) $-1$",
      "(가) $y = -p$, (나) $y = mx + \\frac{p}{m}$, (다) $-1$",
      "(가) $y = -p$, (나) $y = mx + pm^2$, (다) $1$",
      "(가) $y = -p$, (나) $y = mx - pm^2$, (다) $-1$"
    ],
    "answer": "⑤",
    "solution": "포물선 $x^2 = 4py$의 준선과 기울기가 주어진 접선의 방정식을 확인한다.\n(i) 포물선 $x^2 = 4py$의 초점은 $(0, p)$이므로 준선의 방정식은 $y = -p$이다. 따라서 (가)는 $y = -p$이다.\n(ii) 기울기가 $m$인 직선 $y = mx + k$를 $x^2 = 4py$에 대입하면 $x^2 - 4pmx - 4pk = 0$이다.\n접하므로 판별식 $D/4 = (-2pm)^2 - 1 \\times (-4pk) = 4p^2 m^2 + 4pk = 0$에서 $k = -pm^2$이다.\n따라서 접선의 방정식은 $y = mx - pm^2$이므로 (나)는 $y = mx - pm^2$이다.\n(iii) 점 $\\mathrm{P}(x_1, -p)$를 대입하여 정리한 이차방정식 $pm^2 - x_1 m - p = 0$에서\n근과 계수의 관계에 의하여 두 접선의 기울기의 곱은 $\\frac{-p}{p} = -1$이다. 따라서 (다)는 $-1$이다.\n주의: 포물선 $y^2 = 4px$의 기울기 $m$인 접선의 방정식은 $y = mx + \\frac{p}{m}$이지만, $x^2 = 4py$에서는 $y = mx - pm^2$이다.\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-GEO-RPM-050",
    "problemTypeKey": "PT_GEO_CONIC_TANGENT",
    "templateKey": "TPL_GEO_TANGENT_ORTHOGONAL",
    "crossConceptKeys": [
      "CC_PARABOLA",
      "CC_SLOPE"
    ],
    "conditionKeys": [
      "COND_NONZERO"
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
    "content": "직선 $y = 3x + 1$ 위의 점 $\\mathrm{P}(a, b)$에서 포물선 $y^2 = 8x$에 그은 두 접선이 서로 수직일 때, $a + b$의 값은?",
    "choices": [
      "$-7$",
      "$-5$",
      "$-3$",
      "$-1$",
      "$1$"
    ],
    "answer": "①",
    "solution": "포물선에 그은 두 접선이 수직이면 접선의 교점이 준선 위에 있음을 이용한다.\n포물선 $y^2 = 8x = 4 \\times 2 \\times x$에서 $p = 2$이므로 준선의 방정식은 $x = -2$이다.\n포물선 밖의 한 점에서 포물선에 그은 두 접선이 서로 수직이므로 교점 $\\mathrm{P}(a, b)$는 준선 위의 점이다.\n따라서 점 $\\mathrm{P}$의 $x$좌표는 $a = -2$이다.\n점 $\\mathrm{P}(-2, b)$가 직선 $y = 3x + 1$ 위의 점이므로 대입한다.\n$b = 3 \\times (-2) + 1 = -6 + 1 = -5$\n구하는 값을 계산한다.\n$a + b = -2 + (-5) = -7$\n역산 검산: 점 $(-2, -5)$에서 그은 접선의 기울기를 $m$이라 하면 접선 $y = mx + \\frac{2}{m}$에 대입하여 $-5 = -2m + \\frac{2}{m} \\implies 2m^2 - 5m - 2 = 0$이 되고, 두 기울기의 곱은 $\\frac{-2}{2} = -1$이 되어 수직 조건이 성립한다.\n따라서 정답은 ①이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-GEO-RPM-050",
    "problemTypeKey": "PT_GEO_CONIC_TANGENT",
    "templateKey": "TPL_GEO_TANGENT_ORTHOGONAL",
    "crossConceptKeys": [
      "CC_PARABOLA",
      "CC_LINE_EQUATION"
    ],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 3,
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
    "content": "점 $\\mathrm{P}(2, a)$에서 타원 $\\frac{x^2}{10} + \\frac{y^2}{3} = 1$에 그은 두 접선이 서로 수직일 때, 양수 $a$의 값은?",
    "choices": [
      "$1$",
      "$2$",
      "$3$",
      "$4$",
      "$5$"
    ],
    "answer": "③",
    "solution": "타원의 두 접선이 서로 수직인 점의 자취(준원)의 성질을 이용한다.\n타원 $\\frac{x^2}{10} + \\frac{y^2}{3} = 1$에 접하고 기울기가 $m$인 직선의 방정식은 $y = mx \\pm \\sqrt{10m^2 + 3}$이다.\n이 직선이 점 $\\mathrm{P}(2, a)$를 지나므로 $a - 2m = \\pm \\sqrt{10m^2 + 3}$이다.\n양변을 제곱하여 전개한다.\n$(a - 2m)^2 = 10m^2 + 3 \\implies a^2 - 4am + 4m^2 = 10m^2 + 3$\n$m$에 대하여 내림차순으로 정리한다.\n$6m^2 + 4am + (3 - a^2) = 0$\n두 접선이 서로 수직이므로 $m$에 대한 이차방정식의 두 근의 곱은 $-1$이다.\n근과 계수의 관계에 의하여 식을 세운다.\n$\\frac{3 - a^2}{6} = -1 \\implies 3 - a^2 = -6 \\implies a^2 = 9$\n조건에서 $a$는 양수이므로 $a = 3$이다.\n대입 역산: 타원의 준원 방정식 $x^2 + y^2 = 10 + 3 = 13$에 $x = 2$를 대입하면 $4 + a^2 = 13 \\implies a^2 = 9$로 정확히 일치한다.\n따라서 정답은 ③이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-GEO-RPM-050",
    "problemTypeKey": "PT_GEO_CONIC_TANGENT",
    "templateKey": "TPL_GEO_TANGENT_ORTHOGONAL",
    "crossConceptKeys": [
      "CC_CIRCLE_EQUATION",
      "CC_ELLIPSE"
    ],
    "conditionKeys": [
      "COND_POSITIVE"
    ],
    "integrationPattern": "REINTERPRETATION"
  },
  {
    "id": 4,
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
    "content": "쌍곡선 $\\frac{x^2}{15} - \\frac{y^2}{6} = 1$ 위에 있지 않은 한 점 $\\mathrm{P}(a, b)$에서 이 쌍곡선에 그은 두 접선이 서로 수직일 때, 점 $\\mathrm{P}$가 나타내는 도형의 넓이는?",
    "choices": [
      "$5\\pi$",
      "$6\\pi$",
      "$7\\pi$",
      "$8\\pi$",
      "$9\\pi$"
    ],
    "answer": "⑤",
    "solution": "쌍곡선 밖의 점에서 그은 두 접선이 수직인 점의 자취의 방정식을 유도한다.\n쌍곡선 $\\frac{x^2}{15} - \\frac{y^2}{6} = 1$에 접하고 기울기가 $m$인 접선의 방정식은 $y = mx \\pm \\sqrt{15m^2 - 6}$이다.\n이 접선이 점 $\\mathrm{P}(a, b)$를 지나므로 $b - ma = \\pm \\sqrt{15m^2 - 6}$이다.\n양변을 제곱하여 전개한다.\n$(b - ma)^2 = 15m^2 - 6 \\implies b^2 - 2abm + a^2 m^2 = 15m^2 - 6$\n$m$에 대하여 정리하면 $(a^2 - 15)m^2 - 2abm + (b^2 + 6) = 0$이다.\n두 접선이 서로 수직이므로 두 근의 곱은 $-1$이다.\n근과 계수의 관계에 의하여 식을 정리한다.\n$\\frac{b^2 + 6}{a^2 - 15} = -1 \\implies b^2 + 6 = -a^2 + 15 \\implies a^2 + b^2 = 9$\n따라서 점 $\\mathrm{P}(a, b)$가 나타내는 도형은 중심이 원점이고 반지름의 길이가 $3$인 원이다.\n원의 넓이 공식을 적용하여 넓이를 구한다.\n$S = \\pi \\times 3^2 = 9\\pi$\n주의: 쌍곡선 $\\frac{x^2}{A^2} - \\frac{y^2}{B^2} = 1$ ($A > B$)에서 수직인 두 접선의 교점의 자취는 원 $x^2 + y^2 = A^2 - B^2$이 된다.\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-GEO-RPM-050",
    "problemTypeKey": "PT_GEO_CONIC_TANGENT",
    "templateKey": "TPL_GEO_TANGENT_ORTHOGONAL",
    "crossConceptKeys": [
      "CC_CIRCLE_EQUATION",
      "CC_HYPERBOLA"
    ],
    "conditionKeys": [],
    "integrationPattern": "REINTERPRETATION"
  }
];
