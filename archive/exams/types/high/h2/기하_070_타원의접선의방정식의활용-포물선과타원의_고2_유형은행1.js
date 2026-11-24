window.examTitle = "기하_070_타원의접선의방정식의활용-포물선과타원의_고2_유형은행1";

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
    "content": "좌표평면에서 타원 $\\frac{x^2}{k} + \\frac{y^2}{6} = 1$과 포물선 $y^2 = 8x$가 만나는 한 점 $\\mathrm{P}(x_1, y_1)$에서의 두 접선이 서로 수직일 때, 양수 $k$의 값은? [그림: 좌표평면의 제1사분면에서 타원 $\\frac{x^2}{k} + \\frac{y^2}{6} = 1$과 포물선 $y^2 = 8x$가 점 $\\mathrm{P}(x_1, y_1)$에서 만나고, 점 $\\mathrm{P}$에서 그은 타원의 접선과 포물선의 접선이 서로 수직을 이루며 교차하는 모습]",
    "choices": [
      "① $3$",
      "② $4$",
      "③ $5$",
      "④ $6$",
      "⑤ $7$"
    ],
    "answer": "①",
    "solution": "교점 $\\mathrm{P}(x_1, y_1)$은 포물선 $y^2 = 8x$ 위의 점이므로 다음 관계식이 성립한다.\n$y_1^2 = 8x_1$\n포물선의 접선의 방정식 공식에 의해 점 $\\mathrm{P}(x_1, y_1)$에서의 포물선의 접선의 방정식은\n$y_1 y = 4(x + x_1) \\iff y = \\frac{4}{y_1}x + \\frac{4x_1}{y_1}$\n이므로 포물선의 접선의 기울기는 $m_1 = \\frac{4}{y_1}$이다.\n타원의 접선의 방정식 공식에 의해 점 $\\mathrm{P}(x_1, y_1)$에서의 타원 $\\frac{x^2}{k} + \\frac{y^2}{6} = 1$의 접선의 방정식은\n$\\frac{x_1 x}{k} + \\frac{y_1 y}{6} = 1 \\iff \\frac{y_1 y}{6} = -\\frac{x_1}{k}x + 1 \\iff y = -\\frac{6x_1}{k y_1}x + \\frac{6}{y_1}$\n이므로 타원의 접선의 기울기는 $m_2 = -\\frac{6x_1}{k y_1}$이다.\n두 직선의 수직 조건에 의해 두 접선의 기울기의 곱은 $-1$이어야 한다.\n$m_1 \\cdot m_2 = \\left(\\frac{4}{y_1}\\right) \\cdot \\left(-\\frac{6x_1}{k y_1}\\right) = -\\frac{24x_1}{k y_1^2} = -1$\n양변에 $-k y_1^2$을 곱하여 식을 정리한다.\n$24x_1 = k y_1^2$\n포물선 식 $y_1^2 = 8x_1$을 대입하면\n$24x_1 = k \\cdot (8x_1) = 8k x_1$\n점 $\\mathrm{P}$는 원점이 아닌 교점이므로 $x_1 \\neq 0$이다. 양변을 $8x_1$로 나눈다.\n$k = \\frac{24}{8} = 3$\n주의: $k = 3$일 때 타원과 포물선의 연립방정식 $2x^2 + 8x - 6 = 0$은 판별식 $D/4 = 16 - 2(-6) = 28 > 0$이고 두 근의 곱이 음수이므로 제1사분면에 교점이 실제로 존재한다.\n따라서 정답은 ①이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-GEO-RPM-049",
    "problemTypeKey": "PT_GEO_CONIC_TANGENT",
    "templateKey": "TPL_GEO_TANGENT_ON_CONIC",
    "crossConceptKeys": [
      "CC_PERPENDICULAR"
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
    "content": "포물선 $y^2 = 6x$와 타원 $\\frac{x^2}{a^2} + \\frac{y^2}{24} = 1$의 교점 중 제1사분면에 있는 점을 $\\mathrm{A}$라 하자. 점 $\\mathrm{A}$를 지나고 포물선 $y^2 = 6x$와 타원 $\\frac{x^2}{a^2} + \\frac{y^2}{24} = 1$에 각각 접하는 두 직선이 서로 수직이 되도록 양수 $a$의 값을 정할 때, $a^2$의 값은?",
    "choices": [
      "① $3$",
      "② $3\\sqrt{2}$",
      "③ $6$",
      "④ $6\\sqrt{2}$",
      "⑤ $12$"
    ],
    "answer": "⑤",
    "solution": "제1사분면에 있는 교점 $\\mathrm{A}$의 좌표를 $(x_1, y_1)$이라 하면 $x_1 > 0$, $y_1 > 0$이고 포물선 위의 점이므로\n$y_1^2 = 6x_1$\n이 성립한다.\n포물선의 접선의 방정식 공식에 의해 점 $\\mathrm{A}(x_1, y_1)$에서의 포물선의 접선의 방정식은\n$y_1 y = 3(x + x_1) \\iff y = \\frac{3}{y_1}x + \\frac{3x_1}{y_1}$\n이므로 이 접선의 기울기는 $m_1 = \\frac{3}{y_1}$이다.\n타원의 접선의 방정식 공식에 의해 점 $\\mathrm{A}(x_1, y_1)$에서의 타원의 접선의 방정식은\n$\\frac{x_1 x}{a^2} + \\frac{y_1 y}{24} = 1 \\iff y = -\\frac{24x_1}{a^2 y_1}x + \\frac{24}{y_1}$\n이므로 이 접선의 기울기는 $m_2 = -\\frac{24x_1}{a^2 y_1}$이다.\n두 직선의 수직 조건에 의해 두 접선이 수직이 되려면 두 기울기의 곱이 $-1$이어야 한다.\n$m_1 \\cdot m_2 = \\left(\\frac{3}{y_1}\\right) \\cdot \\left(-\\frac{24x_1}{a^2 y_1}\\right) = -\\frac{72x_1}{a^2 y_1^2} = -1$\n양변에 $-a^2 y_1^2$을 곱하여 식을 정리한다.\n$72x_1 = a^2 y_1^2$\n포물선 식 $y_1^2 = 6x_1$을 대입하면\n$72x_1 = a^2 \\cdot (6x_1) = 6a^2 x_1$\n$x_1 > 0$이므로 양변을 $6x_1$로 나눈다.\n$a^2 = \\frac{72}{6} = 12$\n주의: $a^2 = 12$일 때 연립방정식 $2x^2 + 6x - 24 = 0 \\iff x^2 + 3x - 12 = 0$에서 $x_1 = \\frac{-3+\\sqrt{57}}{2} > 0$이므로 제1사분면의 교점이 유일하게 존재함을 만족한다.\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-GEO-RPM-049",
    "problemTypeKey": "PT_GEO_CONIC_TANGENT",
    "templateKey": "TPL_GEO_TANGENT_ON_CONIC",
    "crossConceptKeys": [
      "CC_PERPENDICULAR"
    ],
    "conditionKeys": [
      "COND_POSITIVE"
    ],
    "integrationPattern": "INTERDEPENDENT"
  }
];
