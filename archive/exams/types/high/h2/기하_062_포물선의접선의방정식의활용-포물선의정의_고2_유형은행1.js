window.examTitle = "기하_062_포물선의접선의방정식의활용-포물선의정의_고2_유형은행1";

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
    "content": "포물선 $y^2 = 4px (p>0)$의 초점을 $\\mathrm{F}$라 하고, 포물선의 준선이 $x$축과 만나는 점을 $\\mathrm{A}$라 하자. 포물선 위의 제 1사분면의 점 $\\mathrm{P}$에서의 접선이 선분 $\\mathrm{AF}$를 $1:2$로 내분하는 점을 지나고 $\\overline{\\mathrm{PF}} = p + 6$일 때, 상수 $p$의 값은?",
    "choices": [
      "$12$",
      "$15$",
      "$18$",
      "$21$",
      "$24$"
    ],
    "answer": "③",
    "solution": "1. 포물선 $y^2 = 4px$의 초점과 준선 구하기: 초점은 $\\mathrm{F}(p, 0)$, 준선의 방정식은 $x = -p$이므로 준선이 $x$축과 만나는 점은 $\\mathrm{A}(-p, 0)$이다.\n2. 선분 $\\mathrm{AF}$의 내분점 좌표 구하기: 선분 $\\mathrm{AF}$를 $1:2$로 내분하는 점을 $\\mathrm{T}$라 하면, 내분점 공식에 의해 점 $\\mathrm{T}$의 $x$좌표는 $\\frac{1\\cdot p + 2\\cdot(-p)}{1+2} = \\frac{-p}{3} = -\\frac{p}{3}$이므로 $\\mathrm{T}\\left(-\\frac{p}{3}, 0\\right)$이다.\n3. 포물선의 접선의 방정식과 $x$절편 구하기: 점 $\\mathrm{P}(x_1, y_1)$에서의 접선의 방정식은 $y_1 y = 2p(x + x_1)$이고, $y=0$을 대입하면 $x$절편은 $-x_1$이다.\n4. 접선이 점 $\\mathrm{T}$를 지나므로 $x_1$과 $p$의 관계식 구하기: 접선의 $x$절편이 점 $\\mathrm{T}$의 $x$좌표와 같으므로 $-x_1 = -\\frac{p}{3} \\implies x_1 = \\frac{p}{3}$이다.\n5. 포물선의 정의를 이용하여 $\\overline{\\mathrm{PF}}$ 표현하기: 포물선의 정의에 의해 점 $\\mathrm{P}$에서 초점 $\\mathrm{F}$까지의 거리는 준선 $x = -p$까지의 거리와 같으므로 $\\overline{\\mathrm{PF}} = x_1 - (-p) = x_1 + p = \\frac{p}{3} + p = \\frac{4}{3}p$이다.\n6. 주어진 조건식과 연립하여 $p$의 값 계산하기: $\\overline{\\mathrm{PF}} = p + 6$이므로 $\\frac{4}{3}p = p + 6$이고, 양변에 $3$을 곱하여 정리하면 $4p = 3p + 18 \\implies p = 18$이다.\n7. 주의: 점 $\\mathrm{P}$가 제 1사분면 위의 점이므로 $x_1 = 6 > 0, y_1 = \\sqrt{72 \\times 6} = 12\\sqrt{3} > 0$으로 조건을 온전히 만족한다.\n8. 따라서 정답은 ③이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-GEO-RPM-047",
    "problemTypeKey": "PT_GEO_CONIC_TANGENT",
    "templateKey": "TPL_GEO_TANGENT_ON_CONIC",
    "crossConceptKeys": [
      "CC_INTERNAL_DIVISION",
      "CC_PARABOLA"
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
    "content": "포물선 $y^2 = 4px (p>0)$ 위의 점 $\\mathrm{A}(4p, 4p)$에서 이 포물선의 준선까지의 거리가 $20$일 때, 점 $\\mathrm{A}$에서의 접선의 방정식의 $y$절편은?",
    "choices": [
      "$2$",
      "$4$",
      "$6$",
      "$8$",
      "$10$"
    ],
    "answer": "④",
    "solution": "1. 포물선의 준선의 방정식 구하기: 포물선 $y^2 = 4px$의 준선의 방정식은 $x = -p$이다.\n2. 점 $\\mathrm{A}$에서 준선까지의 거리를 식으로 나타내기: 점 $\\mathrm{A}(4p, 4p)$에서 준선 $x = -p$까지의 거리는 $4p - (-p) = 5p$이다.\n3. 주어진 거리 조건을 대입하여 $p$ 계산하기: $5p = 20$이므로 양변을 $5$로 나누면 $p = 4$이다.\n4. 접점 $\\mathrm{A}$의 좌표와 포물선 방정식 확정하기: $p = 4$를 대입하면 포물선은 $y^2 = 16x$이고, 접점은 $\\mathrm{A}(16, 16)$이다.\n5. 점 $\\mathrm{A}$에서의 접선의 방정식 세우기: 포물선 위의 점 $(x_1, y_1)$에서의 접선의 방정식 공식 $y_1 y = 2p(x + x_1)$에 $p=4, x_1=16, y_1=16$을 대입하면 $16y = 2 \\times 4(x + 16) = 8(x + 16)$이다.\n6. 접선의 $y$절편 구하기: 양변을 $16$으로 나누어 정리하면 $y = \\frac{1}{2}x + 8$이므로, $x=0$을 대입한 $y$절편은 $8$이다.\n7. 주의: 접점 $(x_1, y_1) = (4p, 4p)$에서의 접선의 $y$절편은 공식에 의해 $\\frac{2p x_1}{y_1} = \\frac{2p(4p)}{4p} = 2p$가 되므로, $2 \\times 4 = 8$로 즉시 역산하여 검산할 수 있다.\n8. 따라서 정답은 ④이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-GEO-RPM-047",
    "problemTypeKey": "PT_GEO_CONIC_TANGENT",
    "templateKey": "TPL_GEO_TANGENT_ON_CONIC",
    "crossConceptKeys": [
      "CC_Y_INTERCEPT",
      "CC_PARABOLA"
    ],
    "conditionKeys": [
      "COND_POSITIVE"
    ],
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
    "content": "그림과 같이 포물선 $y^2 = 4px (p>0)$의 초점을 $\\mathrm{F}$라 하고, $\\overline{\\mathrm{FA}}=10$을 만족시키는 포물선 위의 점 $\\mathrm{A}(a, 4)$에서의 접선이 $x$축과 만나는 점을 $\\mathrm{B}$라 하자. 삼각형 $\\mathrm{ABF}$의 넓이는? [그림: 좌표평면에 포물선 $y^2=4px$와 제1사분면 위의 점 $\\mathrm{A}(a, 4)$, 초점 $\\mathrm{F}(p, 0)$, 점 $\\mathrm{A}$에서의 접선이 $x$축과 만나는 점 $\\mathrm{B}(-a, 0)$, 그리고 세 점 $\\mathrm{A}, \\mathrm{B}, \\mathrm{F}$를 꼭짓점으로 하는 삼각형 $\\mathrm{ABF}$가 색칠되어 있음]",
    "choices": [
      "$16$",
      "$20$",
      "$24$",
      "$28$",
      "$32$"
    ],
    "answer": "②",
    "solution": "1. 포물선의 정의로 초점까지의 거리 표현하기: 포물선 $y^2 = 4px$의 초점은 $\\mathrm{F}(p, 0)$이고 준선은 $x = -p$이다. 포물선의 정의에 의해 $\\overline{\\mathrm{FA}}$는 점 $\\mathrm{A}(a, 4)$에서 준선 $x = -p$까지의 거리와 같으므로 $\\overline{\\mathrm{FA}} = a - (-p) = a + p = 10$이다.\n2. 점 $\\mathrm{A}$에서의 접선의 방정식과 교점 $\\mathrm{B}$ 구하기: 포물선 위의 점 $\\mathrm{A}(a, 4)$에서의 접선의 방정식은 $4y = 2p(x + a)$이다. $x$축과의 교점 $\\mathrm{B}$의 좌표를 구하기 위해 $y=0$을 대입하면 $2p(x + a) = 0 \\implies x = -a$이므로 $\\mathrm{B}(-a, 0)$이다.\n3. 삼각형 $\\mathrm{ABF}$의 밑변 $\\overline{\\mathrm{BF}}$의 길이 구하기: 점 $\\mathrm{B}(-a, 0)$과 초점 $\\mathrm{F}(p, 0)$은 모두 $x$축 위에 있으므로 밑변의 길이는 $\\overline{\\mathrm{BF}} = p - (-a) = a + p$이다.\n4. 기하학적 성질을 밑변에 적용하기: 1단계에서 구한 포물선의 정의에 의해 $a + p = 10$이므로 $\\overline{\\mathrm{BF}} = 10$이다.\n5. 삼각형 $\\mathrm{ABF}$의 높이 구하기: 높이는 점 $\\mathrm{A}(a, 4)$의 $y$좌표이므로 $h = 4$이다.\n6. 삼각형의 넓이 계산하기: 삼각형의 넓이 공식에 의해 $\\triangle\\mathrm{ABF} = \\frac{1}{2} \\times \\overline{\\mathrm{BF}} \\times h = \\frac{1}{2} \\times 10 \\times 4 = 20$이다.\n7. 주의: $a$와 $p$ 각각의 값을 구하지 않아도 밑변 $\\overline{\\mathrm{BF}} = a+p = \\overline{\\mathrm{FA}}$라는 접선의 본질적 성질에 의해 넓이가 유일하게 결정된다.\n8. 따라서 정답은 ②이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-GEO-RPM-047",
    "problemTypeKey": "PT_GEO_CONIC_TANGENT",
    "templateKey": "TPL_GEO_TANGENT_ON_CONIC",
    "crossConceptKeys": [
      "CC_TRIANGLE_AREA",
      "CC_PARABOLA"
    ],
    "conditionKeys": [
      "COND_POSITIVE"
    ],
    "integrationPattern": "SEQUENTIAL"
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
    "content": "포물선 $y^2 = 4(x-1)$ 위의 점 $\\mathrm{P}$는 제 1사분면 위의 점이고 초점 $\\mathrm{F}$에 대하여 $\\overline{\\mathrm{PF}}=9$이다. 포물선 위의 점 $\\mathrm{P}$에서의 접선의 기울기는? [그림: 좌표평면에 포물선 $y^2=4(x-1)$과 제1사분면 위의 점 $\\mathrm{P}$, 초점 $\\mathrm{F}(2, 0)$, 선분 $\\mathrm{PF}$, 점 $\\mathrm{P}$에서의 접선이 그려져 있음]",
    "choices": [
      "$\\frac{\\sqrt{2}}{4}$",
      "$\\frac{\\sqrt{2}}{3}$",
      "$\\frac{\\sqrt{2}}{2}$",
      "$\\frac{2\\sqrt{2}}{3}$",
      "$\\sqrt{2}$"
    ],
    "answer": "①",
    "solution": "1. 평행이동된 포물선의 초점과 준선 구하기: 포물선 $y^2 = 4(x-1)$은 $y^2 = 4x$ ($p=1$)를 $x$축 방향으로 $1$만큼 평행이동한 것이다. 초점은 $\\mathrm{F}(1+1, 0) = \\mathrm{F}(2, 0)$이고, 준선은 $x = -1 + 1 = 0$ ($y$축)이다.\n2. 포물선의 정의를 이용하여 점 $\\mathrm{P}(x_1, y_1)$의 $x$좌표 구하기: 포물선의 정의에 의해 $\\overline{\\mathrm{PF}}$는 점 $\\mathrm{P}$에서 준선 $x = 0$까지의 거리와 같으므로 $x_1 - 0 = x_1 = 9$이다.\n3. 점 $\\mathrm{P}$의 $y$좌표 계산하기: 점 $\\mathrm{P}$가 포물선 위의 점이므로 $y_1^2 = 4(9-1) = 32$이다. 점 $\\mathrm{P}$가 제 1사분면 위의 점이므로 $y_1 = \\sqrt{32} = 4\\sqrt{2}$이다.\n4. 음함수 미분법으로 접선의 기울기 식 유도하기: $y^2 = 4(x-1)$의 양변을 $x$에 대하여 미분하면 $2y \\frac{dy}{dx} = 4 \\implies \\frac{dy}{dx} = \\frac{2}{y}$이다.\n5. 접점 $\\mathrm{P}(9, 4\\sqrt{2})$에서의 접선의 기울기 계산하기: $y = 4\\sqrt{2}$를 대입하면 기울기 $m = \\frac{2}{4\\sqrt{2}} = \\frac{1}{2\\sqrt{2}} = \\frac{\\sqrt{2}}{4}$이다.\n6. 역산 및 접선의 방정식 검산: 평행이동 공식 $y_1 y = 2(x + x_1 - 2)$에 대입하면 $4\\sqrt{2} y = 2(x + 9 - 2) = 2x + 14 \\implies y = \\frac{\\sqrt{2}}{4}x + \\frac{7\\sqrt{2}}{4}$가 되어 기울기가 $\\frac{\\sqrt{2}}{4}$임이 일치한다.\n7. 주의: 준선이 $x=0$이므로 점 $\\mathrm{P}$의 $x$좌표가 곧 초점까지의 거리 $\\overline{\\mathrm{PF}}$가 된다는 점에 유의한다.\n8. 따라서 정답은 ①이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-GEO-RPM-047",
    "problemTypeKey": "PT_GEO_CONIC_TANGENT",
    "templateKey": "TPL_GEO_TANGENT_ON_CONIC",
    "crossConceptKeys": [
      "CC_TRANSLATION",
      "CC_SLOPE"
    ],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
  }
];
