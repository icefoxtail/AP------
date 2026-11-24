window.examTitle = "기하_079_두이차곡선의교점에서접선이수직일때미지수_고2_유형은행1";

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
    "content": "그림과 같이 타원 $\\frac{x^2}{9} + \\frac{y^2}{2} = 1$과 쌍곡선 $\\frac{x^2}{a^2} - \\frac{y^2}{3} = 1$이 제 1사분면 위의 점 $\\mathrm{P}(x_1, y_1)$에서 만난다. 점 $\\mathrm{P}$에서의 타원과 쌍곡선의 접선이 서로 수직일 때, 양수 $a$의 값은? [그림: 좌표평면에 타원 $\\frac{x^2}{9}+\\frac{y^2}{2}=1$과 쌍곡선 $\\frac{x^2}{a^2}-\\frac{y^2}{3}=1$이 그려져 있고, 제1사분면에서 두 곡선이 만나는 점 $\\mathrm{P}(x_1, y_1)$에서 그은 타원의 접선과 쌍곡선의 접선이 서로 수직을 이루고 있다.]",
    "choices": [
      "$1$",
      "$\\frac{3}{2}$",
      "$2$",
      "$\\frac{5}{2}$",
      "$3$"
    ],
    "answer": "③",
    "solution": "점 $\\mathrm{P}(x_1, y_1)$에서의 타원의 접선의 방정식을 구한다.\n$\\frac{x_1 x}{9} + \\frac{y_1 y}{2} = 1 \\implies y = -\\frac{2x_1}{9y_1}x + \\frac{2}{y_1}$, 기울기 $m_1 = -\\frac{2x_1}{9y_1}$\n점 $\\mathrm{P}(x_1, y_1)$에서의 쌍곡선의 접선의 방정식을 구한다.\n$\\frac{x_1 x}{a^2} - \\frac{y_1 y}{3} = 1 \\implies y = \\frac{3x_1}{a^2 y_1}x - \\frac{3}{y_1}$, 기울기 $m_2 = \\frac{3x_1}{a^2 y_1}$\n두 접선이 수직이므로 기울기의 곱이 $-1$이다.\n$m_1 m_2 = \\left(-\\frac{2x_1}{9y_1}\\right)\\left(\\frac{3x_1}{a^2 y_1}\\right) = -1 \\implies \\frac{2x_1^2}{3a^2 y_1^2} = 1 \\implies \\frac{x_1^2}{y_1^2} = \\frac{3a^2}{2} \\quad \\cdots \\text{ (ㄱ)}$\n점 $\\mathrm{P}(x_1, y_1)$은 두 곡선 위의 점이므로 두 방정식을 연립한다.\n$\\frac{x_1^2}{9} + \\frac{y_1^2}{2} = 1, \\quad \\frac{x_1^2}{a^2} - \\frac{y_1^2}{3} = 1$\n두 식을 변끼리 빼면 다음과 같다.\n$\\left(\\frac{1}{9} - \\frac{1}{a^2}\\right)x_1^2 + \\left(\\frac{1}{2} + \\frac{1}{3}\\right)y_1^2 = 0 \\implies \\frac{a^2 - 9}{9a^2}x_1^2 + \\frac{5}{6}y_1^2 = 0$\n$\\frac{9 - a^2}{9a^2}x_1^2 = \\frac{5}{6}y_1^2 \\implies \\frac{x_1^2}{y_1^2} = \\frac{5}{6} \\times \\frac{9a^2}{9 - a^2} = \\frac{15a^2}{2(9 - a^2)} \\quad \\cdots \\text{ (ㄴ)}$\n(ㄱ)과 (ㄴ)을 같다고 놓는다.\n$\\frac{3a^2}{2} = \\frac{15a^2}{2(9 - a^2)}$\n$a > 0$이므로 양변을 $\\frac{3a^2}{2}$로 나눈다.\n$1 = \\frac{5}{9 - a^2} \\implies 9 - a^2 = 5 \\implies a^2 = 4$\n$a$는 양수이므로 $a = 2$이다.\n따라서 정답은 ③이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-GEO-RPM-051",
    "problemTypeKey": "PT_GEO_CONIC_TANGENT",
    "templateKey": "TPL_GEO_TANGENT_ORTHOGONAL",
    "crossConceptKeys": [
      "CC_ELLIPSE",
      "CC_HYPERBOLA",
      "CC_PERPENDICULAR_SLOPE"
    ],
    "conditionKeys": [
      "COND_POSITIVE"
    ],
    "integrationPattern": "INTERDEPENDENT"
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
    "content": "그림과 같이 쌍곡선 $x^2 - y^2 = 1$과 타원 $ax^2 + y^2 = 1$이 만나는 제 1사분면의 점 $\\mathrm{P}$에서 각 곡선에 그은 두 접선이 서로 수직으로 만난다. 이때 상수 $a$의 값은? [그림: 좌표평면에 쌍곡선 $x^2-y^2=1$과 타원 $ax^2+y^2=1$이 그려져 있고, 제1사분면의 교점 $\\mathrm{P}$에서 각 곡선에 그은 접선이 서로 직교하고 있다.]",
    "choices": [
      "$\\frac{1}{7}$",
      "$\\frac{1}{6}$",
      "$\\frac{1}{5}$",
      "$\\frac{1}{4}$",
      "$\\frac{1}{3}$"
    ],
    "answer": "⑤",
    "solution": "교점을 $\\mathrm{P}(x_1, y_1)$ ($x_1 > 0, y_1 > 0$)이라 한다.\n점 $\\mathrm{P}$에서의 쌍곡선 $x^2 - y^2 = 1$의 접선의 방정식을 구한다.\n$x_1 x - y_1 y = 1 \\implies y = \\frac{x_1}{y_1}x - \\frac{1}{y_1}$, 기울기 $m_1 = \\frac{x_1}{y_1}$\n점 $\\mathrm{P}$에서의 타원 $ax^2 + y^2 = 1$의 접선의 방정식을 구한다.\n$a x_1 x + y_1 y = 1 \\implies y = -\\frac{a x_1}{y_1}x + \\frac{1}{y_1}$, 기울기 $m_2 = -\\frac{a x_1}{y_1}$\n두 접선이 서로 수직이므로 기울기의 곱이 $-1$이다.\n$m_1 m_2 = \\left(\\frac{x_1}{y_1}\\right)\\left(-\\frac{a x_1}{y_1}\\right) = -1 \\implies \\frac{a x_1^2}{y_1^2} = 1 \\implies y_1^2 = a x_1^2$\n점 $\\mathrm{P}$는 쌍곡선과 타원 위의 점이므로 대입한다.\n$x_1^2 - y_1^2 = 1 \\quad \\cdots \\text{ (ㄱ)}$\n$a x_1^2 + y_1^2 = 1 \\quad \\cdots \\text{ (ㄴ)}$\n$y_1^2 = a x_1^2$를 (ㄱ)에 대입하면 $(1 - a)x_1^2 = 1$이다.\n$y_1^2 = a x_1^2$를 (ㄴ)에 대입하면 $2a x_1^2 = 1$이다.\n따라서 $(1 - a)x_1^2 = 2a x_1^2$이 성립한다.\n$x_1 > 0$이므로 양변을 $x_1^2$으로 나눈다.\n$1 - a = 2a \\implies 3a = 1 \\implies a = \\frac{1}{3}$\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-GEO-RPM-051",
    "problemTypeKey": "PT_GEO_CONIC_TANGENT",
    "templateKey": "TPL_GEO_TANGENT_ORTHOGONAL",
    "crossConceptKeys": [
      "CC_ELLIPSE",
      "CC_HYPERBOLA",
      "CC_PERPENDICULAR_SLOPE"
    ],
    "conditionKeys": [],
    "integrationPattern": "INTERDEPENDENT"
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
    "content": "타원 $\\frac{x^2}{a^2} + \\frac{y^2}{b^2} = 1$과 쌍곡선 $\\frac{x^2}{2} - y^2 = 1$은 점 $\\mathrm{P}(2, -1)$에서 만나고, 점 $\\mathrm{P}$에서의 타원의 접선과 쌍곡선의 접선이 서로 수직일 때, $a^2 + b^2$의 값은? [그림: 좌표평면에 타원 $\\frac{x^2}{a^2}+\\frac{y^2}{b^2}=1$과 쌍곡선 $\\frac{x^2}{2}-y^2=1$이 제4사분면 위의 점 $\\mathrm{P}(2, -1)$에서 만나고, 점 $\\mathrm{P}$에서의 두 접선이 직교하는 모습이 그려져 있다.]",
    "choices": [
      "7",
      "9",
      "11",
      "13",
      "15"
    ],
    "answer": "②",
    "solution": "점 $\\mathrm{P}(2, -1)$에서의 쌍곡선 $\\frac{x^2}{2} - y^2 = 1$의 접선의 방정식을 구한다.\n$\\frac{2x}{2} - (-1)y = 1 \\implies x + y = 1 \\implies y = -x + 1$, 기울기 $m_1 = -1$\n점 $\\mathrm{P}(2, -1)$에서의 타원 $\\frac{x^2}{a^2} + \\frac{y^2}{b^2} = 1$의 접선의 방정식을 구한다.\n$\\frac{2x}{a^2} + \\frac{-1 \\cdot y}{b^2} = 1 \\implies \\frac{y}{b^2} = \\frac{2x}{a^2} - 1 \\implies y = \\frac{2b^2}{a^2}x - b^2$, 기울기 $m_2 = \\frac{2b^2}{a^2}$\n두 접선이 서로 수직이므로 기울기의 곱이 $-1$이다.\n$m_1 m_2 = (-1) \\times \\frac{2b^2}{a^2} = -1 \\implies \\frac{2b^2}{a^2} = 1 \\implies a^2 = 2b^2$\n점 $\\mathrm{P}(2, -1)$은 타원 위의 점이므로 방정식을 만족한다.\n$\\frac{2^2}{a^2} + \\frac{(-1)^2}{b^2} = 1 \\implies \\frac{4}{a^2} + \\frac{1}{b^2} = 1$\n$a^2 = 2b^2$를 대입하여 계산한다.\n$\\frac{4}{2b^2} + \\frac{1}{b^2} = 1 \\implies \\frac{2}{b^2} + \\frac{1}{b^2} = 1 \\implies \\frac{3}{b^2} = 1 \\implies b^2 = 3$\n$a^2 = 2b^2$이므로 $a^2 = 2 \\times 3 = 6$이다.\n$a^2 + b^2$의 값을 구한다.\n$a^2 + b^2 = 6 + 3 = 9$\n따라서 정답은 ②이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-GEO-RPM-051",
    "problemTypeKey": "PT_GEO_CONIC_TANGENT",
    "templateKey": "TPL_GEO_TANGENT_ORTHOGONAL",
    "crossConceptKeys": [
      "CC_ELLIPSE",
      "CC_HYPERBOLA",
      "CC_PERPENDICULAR_SLOPE"
    ],
    "conditionKeys": [],
    "integrationPattern": "INTERDEPENDENT"
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
    "content": "그림과 같이 타원 $\\frac{x^2}{8} + \\frac{y^2}{18} = 1$과 쌍곡선 $\\frac{x^2}{a^2} - \\frac{y^2}{b^2} = -1$은 점 $\\mathrm{P}(2, 3)$에서 만나고, 점 $\\mathrm{P}$에서의 타원의 접선과 쌍곡선의 접선이 서로 수직일 때, 양수 $a, b$에 대하여 $a+b$의 값은? [그림: 좌표평면에 $y$축 방향으로 긴 타원 $\\frac{x^2}{8}+\\frac{y^2}{18}=1$과 위아래로 열린 쌍곡선 $\\frac{x^2}{a^2}-\\frac{y^2}{b^2}=-1$이 그려져 있고, 제1사분면의 교점 $\\mathrm{P}(2, 3)$에서 그은 두 접선이 서로 수직으로 만나는 모습이 나타나 있다.]",
    "choices": [
      "$2\\sqrt{5}$",
      "$3\\sqrt{3}$",
      "$6$",
      "$4\\sqrt{3}$",
      "$3\\sqrt{6}$"
    ],
    "answer": "①",
    "solution": "점 $\\mathrm{P}(2, 3)$에서의 타원 $\\frac{x^2}{8} + \\frac{y^2}{18} = 1$의 접선의 방정식을 구한다.\n$\\frac{2x}{8} + \\frac{3y}{18} = 1 \\implies \\frac{x}{4} + \\frac{y}{6} = 1 \\implies y = -\\frac{3}{2}x + 6$, 기울기 $m_1 = -\\frac{3}{2}$\n점 $\\mathrm{P}(2, 3)$에서의 쌍곡선 $\\frac{x^2}{a^2} - \\frac{y^2}{b^2} = -1$의 접선의 방정식을 구한다.\n$\\frac{2x}{a^2} - \\frac{3y}{b^2} = -1 \\implies \\frac{3y}{b^2} = \\frac{2x}{a^2} + 1 \\implies y = \\frac{2b^2}{3a^2}x + \\frac{b^2}{3}$, 기울기 $m_2 = \\frac{2b^2}{3a^2}$\n두 접선이 서로 수직이므로 기울기의 곱이 $-1$이다.\n$m_1 m_2 = \\left(-\\frac{3}{2}\\right)\\left(\\frac{2b^2}{3a^2}\\right) = -1 \\implies -\\frac{b^2}{a^2} = -1 \\implies b^2 = a^2$\n$a, b$가 모두 양수이므로 $b = a$이다.\n점 $\\mathrm{P}(2, 3)$은 쌍곡선 위의 점이므로 대입한다.\n$\\frac{2^2}{a^2} - \\frac{3^2}{b^2} = -1 \\implies \\frac{4}{a^2} - \\frac{9}{b^2} = -1$\n$b^2 = a^2$를 대입하여 계산한다.\n$\\frac{4}{a^2} - \\frac{9}{a^2} = -1 \\implies -\\frac{5}{a^2} = -1 \\implies a^2 = 5$\n$a$는 양수이므로 $a = \\sqrt{5}$이고, $b = a = \\sqrt{5}$이다.\n$a+b$의 값을 구한다.\n$a + b = \\sqrt{5} + \\sqrt{5} = 2\\sqrt{5}$\n따라서 정답은 ①이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-GEO-RPM-051",
    "problemTypeKey": "PT_GEO_CONIC_TANGENT",
    "templateKey": "TPL_GEO_TANGENT_ORTHOGONAL",
    "crossConceptKeys": [
      "CC_ELLIPSE",
      "CC_HYPERBOLA",
      "CC_PERPENDICULAR_SLOPE"
    ],
    "conditionKeys": [
      "COND_POSITIVE"
    ],
    "integrationPattern": "INTERDEPENDENT"
  }
];
