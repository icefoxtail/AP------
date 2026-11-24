window.examTitle = "기하_037_쌍곡선의방정식-타원과쌍곡선의초점을공유_고2_유형은행1";

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
    "content": "타원 $5x^2 + y^2 = 5$와 두 초점을 공유하고 주축의 길이가 $2$인 쌍곡선의 방정식은?",
    "choices": [
      "$x^2 - 3y^2 = 3$",
      "$x^2 - 3y^2 = -3$",
      "$3x^2 - y^2 = 3$",
      "$3x^2 - y^2 = -3$",
      "$x^2 - 4y^2 = -4$"
    ],
    "answer": "②",
    "solution": "타원의 표준형 변환: 타원의 방정식 $5x^2 + y^2 = 5$의 양변을 $5$로 나누면 $\\frac{x^2}{1} + \\frac{y^2}{5} = 1$이다.\n타원의 초점 좌표 구하기: $y$축 방향 분모가 $x$축 방향보다 크므로 초점은 $y$축 위에 위치한다. 초점 공식 $c^2 = 5 - 1 = 4$에서 $c = 2$이므로 두 초점은 $(0, 2), (0, -2)$이다.\n쌍곡선의 기본형 설정: 쌍곡선의 두 초점이 $y$축 위에 있으므로 쌍곡선의 방정식은 $\\frac{x^2}{a^2} - \\frac{y^2}{b^2} = -1$ ($a>0, b>0$) 꼴이다.\n주축의 길이와 $b^2$ 구하기: 주축의 길이가 $2$이므로 $2b = 2$에서 $b = 1$, 즉 $b^2 = 1^2 = 1$이다.\n초점 공유 조건과 $a^2$ 구하기: 쌍곡선에서 $c^2 = a^2 + b^2$이 성립하므로 $4 = a^2 + 1$에서 $a^2 = 3$이다.\n쌍곡선의 방정식 완성: 구한 값을 기본형에 대입하면 $\\frac{x^2}{3} - \\frac{y^2}{1} = -1$이고, 양변에 $3$을 곱하여 정리하면 $x^2 - 3y^2 = -3$이다.\n따라서 정답은 ②이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-GEO-RPM-043",
    "problemTypeKey": "PT_GEO_HYPERBOLA",
    "templateKey": "TPL_GEO_HYPERBOLA_SHARED_FOCUS",
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
    "content": "쌍곡선 $\\frac{x^2}{a^2} - \\frac{y^2}{b^2} = 1$의 두 꼭짓점은 타원 $\\frac{x^2}{25} + \\frac{y^2}{16} = 1$의 두 초점이고, 쌍곡선의 두 초점은 이 타원의 장축의 양 끝 점이다. $a^2 + b^2$의 값은? (단, $a>0, b>0$)",
    "choices": [
      "$25$",
      "$27$",
      "$29$",
      "$31$",
      "$33$"
    ],
    "answer": "①",
    "solution": "타원의 초점 구하기: 타원 $\\frac{x^2}{25} + \\frac{y^2}{16} = 1$에서 초점의 좌표를 $(\\pm c_e, 0)$이라 하면 초점 공식 $c_e^2 = 25 - 16 = 9$에서 $c_e = 3$이다. 따라서 타원의 두 초점은 $(3, 0), (-3, 0)$이다.\n쌍곡선의 꼭짓점과 $a^2$ 구하기: 쌍곡선 $\\frac{x^2}{a^2} - \\frac{y^2}{b^2} = 1$의 두 꼭짓점은 $(a, 0), (-a, 0)$이다. 이 점들이 타원의 두 초점과 일치하므로 $a = 3$이고 $a^2 = 3^2 = 9$이다.\n타원의 꼭짓점과 쌍곡선의 초점 구하기: 타원의 장축의 양 끝 점(꼭짓점)은 $(5, 0), (-5, 0)$이다. 쌍곡선의 두 초점이 이 점들과 일치하므로 쌍곡선의 초점 $c_h = 5$이다.\n쌍곡선 초점 공식과 $a^2 + b^2$ 구하기: 쌍곡선에서 $c_h^2 = a^2 + b^2$이 성립하므로 $a^2 + b^2 = c_h^2 = 5^2 = 25$이다.\n확인: $b^2 = 25 - a^2 = 25 - 9 = 16$이므로 $a^2 + b^2 = 9 + 16 = 25$로 정확히 성립한다.\n따라서 정답은 ①이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-GEO-RPM-043",
    "problemTypeKey": "PT_GEO_HYPERBOLA",
    "templateKey": "TPL_GEO_HYPERBOLA_SHARED_FOCUS",
    "crossConceptKeys": [],
    "conditionKeys": [
      "COND_POSITIVE"
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
    "content": "타원 $\\frac{x^2}{25} + \\frac{y^2}{9} = 1$과 쌍곡선 $\\frac{x^2}{4} - \\frac{y^2}{12} = 1$의 교점 중 제1사분면에 있는 점을 $P$라 하자. 점 $A(-4, 0), B(4, 0)$에 대하여 $\\overline{PA}^2 + \\overline{PB}^2$의 값은?",
    "choices": [
      "$50$",
      "$54$",
      "$58$",
      "$62$",
      "$66$"
    ],
    "answer": "③",
    "solution": "타원의 초점 확인: 타원 $\\frac{x^2}{25} + \\frac{y^2}{9} = 1$의 초점 공식 $c^2 = 25 - 9 = 16$에서 $c = 4$이므로 타원의 두 초점은 $A(-4, 0), B(4, 0)$이다.\n쌍곡선의 초점 확인: 쌍곡선 $\\frac{x^2}{4} - \\frac{y^2}{12} = 1$의 초점 공식 $c^2 = 4 + 12 = 16$에서 $c = 4$이므로 쌍곡선의 두 초점 역시 $A(-4, 0), B(4, 0)$이다.\n타원의 정의 적용: 점 $P$가 타원 위의 점이므로 두 초점으로부터의 거리의 합은 장축의 길이 $2 \\times 5 = 10$이다. 즉, $\\overline{PA} + \\overline{PB} = 10$이다.\n쌍곡선의 정의 적용: 점 $P$가 제1사분면에 있으므로 $x>0$이고 초점 $B(4, 0)$에 더 가깝다. 따라서 두 초점으로부터의 거리의 차는 주축의 길이 $2 \\times 2 = 4$이다. 즉, $\\overline{PA} - \\overline{PB} = 4$이다.\n$\\overline{PA}, \\overline{PB}$의 길이 계산: 두 식을 변끼리 더하면 $2\\overline{PA} = 14 \\implies \\overline{PA} = 7$이고, 변끼리 빼면 $2\\overline{PB} = 6 \\implies \\overline{PB} = 3$이다.\n구하는 값 계산: $\\overline{PA}^2 + \\overline{PB}^2 = 7^2 + 3^2 = 49 + 9 = 58$이다.\n따라서 정답은 ③이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-GEO-RPM-043",
    "problemTypeKey": "PT_GEO_HYPERBOLA",
    "templateKey": "TPL_GEO_HYPERBOLA_SHARED_FOCUS",
    "crossConceptKeys": [],
    "conditionKeys": [
      "COND_RANGE"
    ],
    "integrationPattern": "INTERDEPENDENT"
  },
  {
    "id": 4,
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
    "content": "타원 $\\frac{x^2}{a^2} + \\frac{y^2}{b^2} = 1$의 장축의 길이가 $8$이고 두 초점 사이의 거리가 $2\\sqrt{7}$일 때, 쌍곡선 $\\frac{x^2}{a^2} - \\frac{y^2}{b^2} = 1$의 두 초점 사이의 거리는? (단, $a>b>0$)",
    "choices": [
      "$8$",
      "$10$",
      "$12$",
      "$14$",
      "$16$"
    ],
    "answer": "②",
    "solution": "타원의 장축과 $a^2$ 구하기: $a>b>0$이므로 타원의 장축의 길이는 $2a = 8$에서 $a = 4$이고, $a^2 = 4^2 = 16$이다.\n타원의 초점 거리와 $b^2$ 구하기: 타원의 두 초점 사이의 거리가 $2c_e = 2\\sqrt{7}$이므로 $c_e = \\sqrt{7}$이다. 타원의 초점 공식 $c_e^2 = a^2 - b^2$에서 $7 = 16 - b^2$, 즉 $b^2 = 16 - 7 = 9$이다.\n쌍곡선의 초점 $c_h$ 구하기: 쌍곡선 $\\frac{x^2}{a^2} - \\frac{y^2}{b^2} = 1$에서 초점 공식은 $c_h^2 = a^2 + b^2$이다. 대입하면 $c_h^2 = 16 + 9 = 25$이므로 $c_h = 5$이다.\n쌍곡선의 두 초점 사이의 거리 계산: 두 초점 사이의 거리는 $2c_h = 2 \\times 5 = 10$이다.\n따라서 정답은 ②이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-GEO-RPM-043",
    "problemTypeKey": "PT_GEO_HYPERBOLA",
    "templateKey": "TPL_GEO_HYPERBOLA_SHARED_FOCUS",
    "crossConceptKeys": [],
    "conditionKeys": [
      "COND_POSITIVE",
      "COND_INEQUALITY_CONSTRAINT"
    ],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 5,
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
    "content": "$1$보다 큰 실수 $a$에 대하여 타원 $x^2 + \\frac{y^2}{a^2} = 1$의 두 초점과 쌍곡선 $x^2 - \\frac{y^2}{3} = 1$의 두 초점을 꼭짓점으로 하는 사각형의 넓이가 $16$일 때, $a^2$의 값은?",
    "choices": [
      "$11$",
      "$13$",
      "$15$",
      "$17$",
      "$19$"
    ],
    "answer": "④",
    "solution": "타원의 두 초점 구하기: $a > 1$이므로 타원 $x^2 + \\frac{y^2}{a^2} = 1$의 장축은 $y$축 위에 있다. 초점 공식 $c_1^2 = a^2 - 1$에서 $c_1 = \\sqrt{a^2 - 1}$이므로 두 초점의 좌표는 $(0, \\sqrt{a^2 - 1}), (0, -\\sqrt{a^2 - 1})$이다.\n쌍곡선의 두 초점 구하기: 쌍곡선 $x^2 - \\frac{y^2}{3} = 1$의 초점 공식 $c_2^2 = 1 + 3 = 4$에서 $c_2 = 2$이므로 두 초점의 좌표는 $(2, 0), (-2, 0)$이다.\n사각형의 형태와 대각선 길이: 사각형의 네 꼭짓점은 각각 $x$축과 $y$축 위에 있으므로 이 사각형은 마름모이다. $x$축 방향 대각선의 길이는 $2c_2 = 2 \\times 2 = 4$이고, $y$축 방향 대각선의 길이는 $2c_1 = 2\\sqrt{a^2 - 1}$이다.\n넓이 계산식 수립: 마름모의 넓이는 두 대각선 곱의 절반이므로 $S = \\frac{1}{2} \\times 4 \\times 2\\sqrt{a^2 - 1} = 4\\sqrt{a^2 - 1}$이다.\n방정식 풀이 및 $a^2$ 계산: 넓이가 $16$이므로 $4\\sqrt{a^2 - 1} = 16$에서 $\\sqrt{a^2 - 1} = 4$이다. 양변을 제곱하면 $a^2 - 1 = 16$이므로 $a^2 = 17$이다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-GEO-RPM-043",
    "problemTypeKey": "PT_GEO_HYPERBOLA",
    "templateKey": "TPL_GEO_HYPERBOLA_SHARED_FOCUS",
    "crossConceptKeys": [
      "CC_POLYGON_AREA"
    ],
    "conditionKeys": [
      "COND_RANGE"
    ],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 6,
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
    "content": "다음 조건을 만족하는 상수 $a, b, c$에 대하여 $abc$의 값은? (단, $a>0, b>0, c>0$)\n\n(가) 초점이 $F(1, 0)$이고 준선이 $x = -1$인 포물선이 점 $(1, a)$를 지날 때, $a$의 값\n(나) 두 초점이 $F(2, 0), F'(-2, 0)$이고 장축의 길이가 $8$인 타원이 점 $(2, b)$를 지날 때, $b$의 값\n(다) 두 초점이 $F(0, 2\\sqrt{3}), F'(0, -2\\sqrt{3})$이고 주축의 길이가 $4$인 쌍곡선이 점 $(2, c)$를 지날 때, $c$의 값",
    "choices": [
      "$2\\sqrt{6}$",
      "$3\\sqrt{6}$",
      "$4\\sqrt{6}$",
      "$6\\sqrt{6}$",
      "$8\\sqrt{6}$"
    ],
    "answer": "④",
    "solution": "(가) 포물선의 방정식과 $a$ 구하기: 초점이 $(1, 0)$이고 준선이 $x = -1$이므로 $p = 1$이다. 포물선의 방정식은 $y^2 = 4px = 4x$이다. 점 $(1, a)$를 지나므로 $a^2 = 4 \\times 1 = 4$이고, $a>0$이므로 $a = 2$이다.\n(나) 타원의 방정식과 $b$ 구하기: 두 초점 $(\\pm 2, 0)$에서 $c = 2$이고, 장축의 길이가 $8$이므로 $2A = 8 \\implies A = 4, A^2 = 16$이다. 타원의 성질 $c^2 = A^2 - B^2$에서 $2^2 = 16 - B^2 \\implies 4 = 16 - B^2 \\implies B^2 = 12$이다. 따라서 타원의 방정식은 $\\frac{x^2}{16} + \\frac{y^2}{12} = 1$이다. 점 $(2, b)$를 대입하면 $\\frac{2^2}{16} + \\frac{b^2}{12} = 1 \\implies \\frac{1}{4} + \\frac{b^2}{12} = 1 \\implies \\frac{b^2}{12} = \\frac{3}{4} \\implies b^2 = 9$이다. $b>0$이므로 $b = 3$이다.\n(다) 쌍곡선의 방정식과 $c$ 구하기: 두 초점 $(0, \\pm 2\\sqrt{3})$이 $y$축 위에 있으므로 $c_h = 2\\sqrt{3}, c_h^2 = 12$이다. 주축의 길이가 $4$이므로 $2B = 4 \\implies B = 2, B^2 = 4$이다. 쌍곡선의 성질 $c_h^2 = A^2 + B^2$에서 $12 = A^2 + 4 \\implies A^2 = 8$이다. 따라서 쌍곡선의 방정식은 $\\frac{x^2}{8} - \\frac{y^2}{4} = -1$이다. 점 $(2, c)$를 대입하면 $\\frac{2^2}{8} - \\frac{c^2}{4} = -1 \\implies \\frac{1}{2} - \\frac{c^2}{4} = -1 \\implies \\frac{c^2}{4} = \\frac{3}{2} \\implies c^2 = 6$이다. $c>0$이므로 $c = \\sqrt{6}$이다.\n구하는 $abc$의 값 계산: $abc = 2 \\times 3 \\times \\sqrt{6} = 6\\sqrt{6}$이다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-GEO-RPM-043",
    "problemTypeKey": "PT_GEO_HYPERBOLA",
    "templateKey": "TPL_GEO_HYPERBOLA_SHARED_FOCUS",
    "crossConceptKeys": [
      "CC_PARABOLA"
    ],
    "conditionKeys": [
      "COND_POSITIVE"
    ],
    "integrationPattern": "SEQUENTIAL"
  }
];
