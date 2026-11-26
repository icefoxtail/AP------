window.examTitle = "기하_032_타원과원1_고2_유형은행1";

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
    "content": "그림과 같이 타원 $\\frac{x^2}{36} + \\frac{y^2}{11} = 1$의 두 초점 $\\mathrm{F, F'}$을 지름의 양 끝점으로 하는 원이 있다. 타원과 원의 한 교점을 $\\mathrm{P}$라 할 때, 삼각형 $\\mathrm{PFF'}$의 넓이는?\n\n[그림: 좌표평면 위에 타원 $\\frac{x^2}{36} + \\frac{y^2}{11} = 1$과 두 초점 $\\mathrm{F}(5, 0), \\mathrm{F'}(-5, 0)$을 지름의 양 끝점으로 하는 원 $x^2+y^2=25$가 그려져 있고, 제1사분면에서 만나는 교점을 $\\mathrm{P}$라 할 때 삼각형 $\\mathrm{PFF'}$의 내부가 색칠되어 있다.]",
    "choices": [
      "7",
      "8",
      "9",
      "10",
      "11"
    ],
    "answer": "⑤",
    "solution": "1단계: 타원의 방정식 $\\frac{x^2}{36} + \\frac{y^2}{11} = 1$에서 초점의 좌표 구하기\n$a^2=36, b^2=11$이므로 $c^2 = a^2 - b^2 = 36 - 11 = 25$에서 $c=5$이다.\n따라서 두 초점은 $\\mathrm{F}(5, 0), \\mathrm{F'}(-5, 0)$이고, 선분 $\\mathrm{FF'}$의 길이는 $2c = 10$이다.\n2단계: 원주각의 성질을 이용하여 삼각형 $\\mathrm{PFF'}$의 형태 파악하기\n선분 $\\mathrm{FF'}$은 원의 지름이므로, 원 위의 점 $\\mathrm{P}$에 대하여 $\\angle \\mathrm{FPF'} = 90^\\circ$이다.\n따라서 삼각형 $\\mathrm{PFF'}$은 $\\angle \\mathrm{P} = 90^\\circ$인 직각삼각형이다.\n3단계: 타원의 정의와 피타고라스 정리를 적용하여 두 변의 곱 구하기\n$\\overline{\\mathrm{PF}} = d_1, \\overline{\\mathrm{PF'}} = d_2$라 하자.\n타원의 정의에 의해 두 초점으로부터의 거리의 합은 장축의 길이이므로 $d_1 + d_2 = 2a = 2 \\times 6 = 12$이다.\n직각삼각형 $\\mathrm{PFF'}$에서 피타고라스 정리에 의해 $d_1^2 + d_2^2 = \\overline{\\mathrm{FF'}}^2 = 10^2 = 100$이다.\n곱셈공식 $(d_1 + d_2)^2 = d_1^2 + d_2^2 + 2d_1 d_2$에 대입하면\n$12^2 = 100 + 2d_1 d_2 \\implies 144 = 100 + 2d_1 d_2 \\implies 2d_1 d_2 = 44 \\implies d_1 d_2 = 22$이다.\n4단계: 삼각형 $\\mathrm{PFF'}$의 넓이 계산하기\n직각삼각형 $\\mathrm{PFF'}$의 넓이는 $\\frac{1}{2} d_1 d_2 = \\frac{1}{2} \\times 22 = 11$이다.\n주의: 지름에 대한 원주각이 $90^\\circ$임을 이용하여 피타고라스 정리와 타원의 정의를 연립해야 한다.\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-GEO-RPM-041",
    "problemTypeKey": "PT_GEO_ELLIPSE",
    "templateKey": "TPL_GEO_ELLIPSE_WITH_CURVE",
    "crossConceptKeys": [
      "CC_CIRCLE_CENTER_RADIUS",
      "CC_INSCRIBED_ANGLE",
      "CC_TRIANGLE_AREA"
    ],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL",
    "image": "assets/images/기하_032_타원과원1_고2_유형은행1/q1-problem.svg",
    "imageAlt": "타원 x²/36+y²/11과 초점 F·F′을 지름으로 하는 원, 제1사분면 교점 P의 삼각형",
    "imageCaption": "타원 x²/36+y²/11과 초점 F·F′을 지름으로 하는 원, 제1사분면 교점 P의 삼각형",
    "imageSize": "full"
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
    "content": "그림과 같이 원 $x^2+y^2=16$이 $x$축과 만나는 점을 각각 $\\mathrm{A, B}$라 하고, 두 점 $\\mathrm{A, B}$를 초점으로 하는 타원 $\\frac{x^2}{a^2} + \\frac{y^2}{b^2} = 1$과 원이 만나는 한 점을 $\\mathrm{P}$라고 하자. 삼각형 $\\mathrm{PAB}$의 넓이가 $9$일 때, 타원의 장축의 길이는? (단, $a, b$는 양수이다.)\n\n[그림: 좌표평면 위에 원 $x^2+y^2=16$이 $x$축과 만나는 두 점 $\\mathrm{A}(-4, 0), \\mathrm{B}(4, 0)$을 초점으로 하는 타원 $\\frac{x^2}{a^2}+\\frac{y^2}{b^2}=1$이 그려져 있고, 제1사분면에서 만나는 교점 $\\mathrm{P}$에 대하여 삼각형 $\\mathrm{PAB}$가 그려져 있다.]",
    "choices": [
      "6",
      "7",
      "8",
      "9",
      "10"
    ],
    "answer": "⑤",
    "solution": "1단계: 원의 방정식에서 지름 $\\mathrm{AB}$의 길이 구하기\n원 $x^2+y^2=16$의 반지름은 $4$이므로 $x$축과의 교점은 $\\mathrm{A}(-4, 0), \\mathrm{B}(4, 0)$이다.\n따라서 선분 $\\mathrm{AB}$는 원의 지름이고, 그 길이는 $\\overline{\\mathrm{AB}} = 8$이다.\n2단계: 원주각의 성질로 삼각형 $\\mathrm{PAB}$의 성질 확인하기\n선분 $\\mathrm{AB}$가 원의 지름이므로 원 위의 점 $\\mathrm{P}$에 대하여 $\\angle \\mathrm{APB} = 90^\\circ$이다.\n따라서 삼각형 $\\mathrm{PAB}$는 빗변이 $\\mathrm{AB}$인 직각삼각형이다.\n3단계: 주어진 넓이로부터 두 변의 곱 구하기\n삼각형 $\\mathrm{PAB}$의 넓이는 $\\frac{1}{2} \\times \\overline{\\mathrm{PA}} \\times \\overline{\\mathrm{PB}} = 9$이므로\n$\\overline{\\mathrm{PA}} \\times \\overline{\\mathrm{PB}} = 18$이다.\n4단계: 피타고라스 정리와 타원의 정의로 장축의 길이 구하기\n직각삼각형 $\\mathrm{PAB}$에서 피타고라스 정리에 의해 $\\overline{\\mathrm{PA}}^2 + \\overline{\\mathrm{PB}}^2 = \\overline{\\mathrm{AB}}^2 = 8^2 = 64$이다.\n타원의 정의에 의해 장축의 길이는 두 초점으로부터의 거리의 합인 $\\overline{\\mathrm{PA}} + \\overline{\\mathrm{PB}}$이다.\n곱셈공식 $(\\overline{\\mathrm{PA}} + \\overline{\\mathrm{PB}})^2 = \\overline{\\mathrm{PA}}^2 + \\overline{\\mathrm{PB}}^2 + 2(\\overline{\\mathrm{PA}} \\times \\overline{\\mathrm{PB}})$에 대입하면\n$(\\overline{\\mathrm{PA}} + \\overline{\\mathrm{PB}})^2 = 64 + 2 \\times 18 = 64 + 36 = 100$이다.\n$\\overline{\\mathrm{PA}} + \\overline{\\mathrm{PB}} > 0$이므로 $\\overline{\\mathrm{PA}} + \\overline{\\mathrm{PB}} = 10$이다.\n따라서 타원의 장축의 길이는 $10$이다.\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-GEO-RPM-041",
    "problemTypeKey": "PT_GEO_ELLIPSE",
    "templateKey": "TPL_GEO_ELLIPSE_WITH_CURVE",
    "crossConceptKeys": [
      "CC_CIRCLE_EQUATION",
      "CC_PYTHAGOREAN",
      "CC_TRIANGLE_AREA"
    ],
    "conditionKeys": [
      "COND_POSITIVE"
    ],
    "integrationPattern": "SEQUENTIAL",
    "image": "assets/images/기하_032_타원과원1_고2_유형은행1/q2-problem.svg",
    "imageAlt": "반지름 4인 원의 지름 AB가 두 초점인 타원, 제1사분면 공통점 P의 삼각형",
    "imageCaption": "반지름 4인 원의 지름 AB가 두 초점인 타원, 제1사분면 공통점 P의 삼각형",
    "imageSize": "full"
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
    "content": "그림과 같이 두 초점이 $\\mathrm{F, F'}$인 타원 $\\frac{x^2}{15} + \\frac{y^2}{7} = 1$과 두 초점 $\\mathrm{F, F'}$을 지름의 양 끝점으로 하는 원이 있다. 이 타원과 원이 만나는 네 점 중 제1사분면 위의 점을 $\\mathrm{P}$, 제3사분면 위의 점을 $\\mathrm{Q}$라 할 때, 사각형 $\\mathrm{PF'QF}$의 넓이는?\n\n[그림: 좌표평면 위에 타원 $\\frac{x^2}{15}+\\frac{y^2}{7}=1$과 두 초점 $\\mathrm{F}(2\\sqrt{2}, 0), \\mathrm{F'}(-2\\sqrt{2}, 0)$을 지름으로 하는 원 $x^2+y^2=8$이 그려져 있고, 제1사분면의 교점을 $\\mathrm{P}$, 제3사분면의 교점을 $\\mathrm{Q}$라 할 때 사각형 $\\mathrm{PF'QF}$의 내부가 색칠되어 있다.]",
    "choices": [
      "10",
      "12",
      "14",
      "16",
      "18"
    ],
    "answer": "③",
    "solution": "1단계: 타원의 초점과 원의 성질 파악하기\n타원 $\\frac{x^2}{15} + \\frac{y^2}{7} = 1$에서 $a^2=15, b^2=7$이므로 $c^2 = a^2 - b^2 = 15 - 7 = 8$에서 $c = 2\\sqrt{2}$이다.\n두 초점은 $\\mathrm{F}(2\\sqrt{2}, 0), \\mathrm{F'}(-2\\sqrt{2}, 0)$이고 선분 $\\mathrm{FF'}$의 길이는 $2c = 4\\sqrt{2}$이다.\n2단계: 사각형 $\\mathrm{PF'QF}$가 직사각형임을 밝히기\n타원과 원은 모두 원점에 대하여 대칭이므로 점 $\\mathrm{P}$와 점 $\\mathrm{Q}$는 원점 대칭이다.\n따라서 사각형 $\\mathrm{PF'QF}$의 두 대각선 $\\mathrm{PQ}$와 $\\mathrm{F'F}$는 원점에서 서로를 이등분하고 길이가 같다.\n또한 선분 $\\mathrm{FF'}$이 원의 지름이므로 원주각의 성질에 의해 $\\angle \\mathrm{F'PF} = 90^\\circ$이다.\n따라서 사각형 $\\mathrm{PF'QF}$는 직사각형이다.\n3단계: 타원의 정의와 피타고라스 정리로 두 변의 곱 구하기\n$\\overline{\\mathrm{PF}} = d_1, \\overline{\\mathrm{PF'}} = d_2$라 하면, 사각형의 넓이는 $S = d_1 d_2$이다.\n타원의 정의에 의해 $d_1 + d_2 = 2a = 2\\sqrt{15}$이다.\n직각삼각형 $\\mathrm{PFF'}$에서 피타고라스 정리에 의해 $d_1^2 + d_2^2 = \\overline{\\mathrm{FF'}}^2 = (4\\sqrt{2})^2 = 32$이다.\n곱셈공식 $(d_1 + d_2)^2 = d_1^2 + d_2^2 + 2d_1 d_2$에 대입하면\n$(2\\sqrt{15})^2 = 32 + 2d_1 d_2 \\implies 60 = 32 + 2d_1 d_2 \\implies 2d_1 d_2 = 28 \\implies d_1 d_2 = 14$이다.\n4단계: 사각형의 넓이 도출하기\n따라서 직사각형 $\\mathrm{PF'QF}$의 넓이는 $d_1 d_2 = 14$이다.\n따라서 정답은 ③이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-GEO-RPM-041",
    "problemTypeKey": "PT_GEO_ELLIPSE",
    "templateKey": "TPL_GEO_ELLIPSE_WITH_CURVE",
    "crossConceptKeys": [
      "CC_CIRCLE_EQUATION",
      "CC_PARALLELOGRAM_PROPERTIES"
    ],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL",
    "image": "assets/images/기하_032_타원과원1_고2_유형은행1/q3-problem.svg",
    "imageAlt": "타원 x²/15+y²/7과 초점 지름 원 x²+y²=8의 반대 교점 P,Q로 만든 사각형",
    "imageCaption": "타원 x²/15+y²/7과 초점 지름 원 x²+y²=8의 반대 교점 P,Q로 만든 사각형",
    "imageSize": "full"
  }
];
