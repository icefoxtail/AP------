window.examTitle = "기하_013_두포물선이이루는선분의길이_고2_유형은행1";

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
    "content": "그림과 같이 $x$축 위의 점 $\\mathrm{F}$를 초점으로 공유하는 두 포물선 $C_1, C_2$의 꼭짓점의 좌표가 각각 $\\mathrm{A}(-2, 0)$, $\\mathrm{B}(11, 0)$이다. 포물선 $C_1$ 위의 한 점 $\\mathrm{P}$를 지나고 $x$축에 평행한 직선이 포물선 $C_2$와 만나는 점을 $\\mathrm{Q}$라 할 때, 삼각형 $\\mathrm{FPQ}$의 둘레의 길이는? (단, 점 $\\mathrm{F}$는 선분 $\\mathrm{AB}$ 위에 있고, 점 $\\mathrm{P}$의 $x$좌표는 점 $\\mathrm{Q}$의 $x$좌표보다 작다.) [그림: 좌표평면의 $x$축 위에 $\\mathrm{A}(-2, 0)$, $\\mathrm{F}$, $\\mathrm{B}(11, 0)$이 왼쪽에서 오른쪽 순서대로 놓여 있다. 꼭짓점이 $\\mathrm{A}$이고 초점이 $\\mathrm{F}$이며 오른쪽으로 열린 포물선 $C_1$과, 꼭짓점이 $\\mathrm{B}$이고 초점이 $\\mathrm{F}$이며 왼쪽으로 열린 포물선 $C_2$가 그려져 있다. $x$축 위쪽에서 $x$축에 평행한 선분이 $C_1$과 점 $\\mathrm{P}$에서, $C_2$와 점 $\\mathrm{Q}$에서 만나며($x_{\\mathrm{P}} < x_{\\mathrm{Q}}$), 삼각형 $\\mathrm{FPQ}$가 그려져 있다.]",
    "choices": [
      "$18$",
      "$20$",
      "$22$",
      "$24$",
      "$26$"
    ],
    "answer": "⑤",
    "solution": "공통 초점 $\\mathrm{F}$의 좌표를 $(f, 0)$ ($-2 < f < 11$)이라 하자.\n포물선 $C_1$은 꼭짓점이 $\\mathrm{A}(-2, 0)$이고 초점이 $\\mathrm{F}(f, 0)$이므로 준선의 방정식은\n$$x = -2 - (f - (-2)) = -4 - f$$\n이다. 점 $\\mathrm{P}$의 $x$좌표를 $x_1$이라 하면 포물선의 정의에 의하여\n$$\\overline{\\mathrm{PF}} = x_1 - (-4 - f) = x_1 + f + 4$$\n이다.\n또, 포물선 $C_2$는 꼭짓점이 $\\mathrm{B}(11, 0)$이고 초점이 $\\mathrm{F}(f, 0)$이므로 준선의 방정식은\n$$x = 11 + (11 - f) = 22 - f$$\n이다. 점 $\\mathrm{Q}$의 $x$좌표를 $x_2$라 하면 포물선의 정의에 의하여\n$$\\overline{\\mathrm{QF}} = (22 - f) - x_2 = 22 - f - x_2$$\n이다.\n한편 선분 $\\mathrm{PQ}$는 $x$축에 평행하고 $x_1 < x_2$이므로 $\\overline{\\mathrm{PQ}} = x_2 - x_1$이다.\n따라서 삼각형 $\\mathrm{FPQ}$의 둘레의 길이는\n$$\\overline{\\mathrm{PF}} + \\overline{\\mathrm{QF}} + \\overline{\\mathrm{PQ}} = (x_1 + f + 4) + (22 - f - x_2) + (x_2 - x_1) = 26$$\n이다.\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-GEO-RPM-039",
    "problemTypeKey": "PT_GEO_PARABOLA",
    "templateKey": "TPL_GEO_PARABOLA_PAIR_SEGMENT",
    "primaryMethod": "공통 초점 좌표 f로 두 포물선의 준선을 구해 PF, QF를 준선까지의 거리로 바꾼다",
    "decisiveStep": "$(x_1+f+4)+(22-f-x_2)+(x_2-x_1)=26$에서 $f$가 소거된다",
    "crossConceptKeys": [
      "CC_DISTANCE_TWO_POINTS"
    ],
    "conditionKeys": [
      "COND_INEQUALITY_CONSTRAINT",
      "COND_RESTRICTED_INTERVAL"
    ],
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
    "content": "그림과 같이 점 $\\mathrm{F}$가 초점인 포물선 $y^2 = 4px$ 위의 점 $\\mathrm{P}$를 지나고 $y$축에 수직인 직선이 포물선 $y^2 = -8px$와 만나는 점을 $\\mathrm{Q}$라 하자. $\\overline{\\mathrm{OP}} = \\overline{\\mathrm{PF}}$이고 $\\overline{\\mathrm{PQ}} = 6$일 때, 선분 $\\mathrm{PF}$의 길이는? (단, $\\mathrm{O}$는 원점이고, $p$는 양수이다.) [그림: 좌표평면에 원점 $\\mathrm{O}$를 꼭짓점으로 하고 오른쪽으로 열린 포물선 $y^2 = 4px$와 왼쪽으로 열린 포물선 $y^2 = -8px$가 그려져 있다. 포물선 $y^2 = 4px$의 초점 $\\mathrm{F}(p, 0)$이 $x$축 양의 부분에 있고, $y$축에 수직인 직선이 $y^2 = 4px$와 제$1$사분면의 점 $\\mathrm{P}$에서, $y^2 = -8px$와 제$2$사분면의 점 $\\mathrm{Q}$에서 만난다. 선분 $\\mathrm{OP}$, $\\mathrm{PF}$, $\\mathrm{PQ}$가 연결되어 있다.]",
    "choices": [
      "$8$",
      "$10$",
      "$12$",
      "$14$",
      "$16$"
    ],
    "answer": "③",
    "solution": "두 점 $\\mathrm{P}, \\mathrm{Q}$는 $y$좌표가 같으므로 $\\mathrm{P}(x_1, y_0)$, $\\mathrm{Q}(x_2, y_0)$ ($x_1 > 0, x_2 < 0$)라 하자.\n점 $\\mathrm{P}$는 포물선 $y^2 = 4px$ 위에 있고 점 $\\mathrm{Q}$는 포물선 $y^2 = -8px$ 위에 있으므로\n$$y_0^2 = 4px_1 = -8px_2$$\n$p > 0$이므로 양변을 $4p$로 나누면 $x_1 = -2x_2$, 즉 $x_2 = -\\dfrac{1}{2}x_1$이다.\n이때 $\\overline{\\mathrm{PQ}} = 6$이므로\n$$\\overline{\\mathrm{PQ}} = x_1 - x_2 = x_1 - \\left(-\\frac{1}{2}x_1\\right) = \\frac{3}{2}x_1 = 6 \\implies x_1 = 4$$\n이다.\n한편 $\\mathrm{O}(0, 0)$, $\\mathrm{F}(p, 0)$에 대하여 $\\overline{\\mathrm{OP}} = \\overline{\\mathrm{PF}}$이므로 점 $\\mathrm{P}$는 선분 $\\mathrm{OF}$의 수직이등분선 $x = \\dfrac{p}{2}$ 위에 있다.\n따라서\n$$x_1 = \\frac{p}{2} = 4 \\implies p = 8$$\n이다.\n포물선 $y^2 = 4px$의 준선은 $x = -p = -8$이므로 포물선의 정의에 의하여\n$$\\overline{\\mathrm{PF}} = x_1 - (-p) = 4 + 8 = 12$$\n이다.\n따라서 정답은 ③이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-GEO-RPM-039",
    "problemTypeKey": "PT_GEO_PARABOLA",
    "templateKey": "TPL_GEO_PARABOLA_PAIR_SEGMENT",
    "primaryMethod": "같은 y에서 두 포물선 식으로 x좌표 비를 얻고 OP=PF 조건으로 p를 정한다",
    "decisiveStep": "$x_1=-2x_2$, $\\frac{3}{2}x_1=6$에서 $x_1=4$, $p=8$, $\\overline{\\mathrm{PF}}=12$",
    "crossConceptKeys": [
      "CC_PERPENDICULAR_BISECTOR",
      "CC_DISTANCE_TWO_POINTS"
    ],
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
    "content": "두 포물선 $y^2 = 8(x+4)$, $y^2 = -12(x-4)$의 초점을 각각 $\\mathrm{F}_1$, $\\mathrm{F}_2$라 하고 두 포물선의 교점 중 제$1$사분면의 점을 $\\mathrm{P}$라 할 때, 삼각형 $\\mathrm{PF}_1\\mathrm{F}_2$의 둘레의 길이는?",
    "choices": [
      "$14$",
      "$16$",
      "$18$",
      "$20$",
      "$22$"
    ],
    "answer": "②",
    "solution": "포물선 $y^2 = 8(x+4) = 4 \\cdot 2(x+4)$는 포물선 $y^2 = 8x$를 $x$축의 방향으로 $-4$만큼 평행이동한 것이므로\n초점은 $\\mathrm{F}_1(2-4, 0) = \\mathrm{F}_1(-2, 0)$, 준선의 방정식은 $x = -2-4 = -6$이다.\n포물선 $y^2 = -12(x-4) = 4 \\cdot (-3)(x-4)$는 포물선 $y^2 = -12x$를 $x$축의 방향으로 $4$만큼 평행이동한 것이므로\n초점은 $\\mathrm{F}_2(-3+4, 0) = \\mathrm{F}_2(1, 0)$, 준선의 방정식은 $x = 3+4 = 7$이다.\n두 포물선의 제$1$사분면의 교점을 $\\mathrm{P}(x_0, y_0)$이라 하면 $8(x_0+4) = -12(x_0-4)$에서 $x_0 = \\dfrac{4}{5}$이므로 $-6 < x_0 < 7$이다.\n포물선의 정의에 의하여\n$$\\overline{\\mathrm{PF}_1} = x_0 - (-6) = x_0 + 6, \\quad \\overline{\\mathrm{PF}_2} = 7 - x_0$$\n이고 $\\overline{\\mathrm{F}_1\\mathrm{F}_2} = 1 - (-2) = 3$이다.\n따라서 삼각형 $\\mathrm{PF}_1\\mathrm{F}_2$의 둘레의 길이는\n$$\\overline{\\mathrm{PF}_1} + \\overline{\\mathrm{PF}_2} + \\overline{\\mathrm{F}_1\\mathrm{F}_2} = (x_0 + 6) + (7 - x_0) + 3 = 16$$\n이다.\n따라서 정답은 ②이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B12",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-GEO-RPM-039",
    "problemTypeKey": "PT_GEO_PARABOLA",
    "templateKey": "TPL_GEO_PARABOLA_PAIR_SEGMENT",
    "primaryMethod": "평행이동으로 두 초점과 준선을 읽고 교점에서 준선까지 거리의 합으로 둘레를 낸다",
    "decisiveStep": "$x_0=\\frac{4}{5}$에서 $\\frac{34}{5}+\\frac{31}{5}+3=16$",
    "crossConceptKeys": [
      "CC_TRANSLATION"
    ],
    "conditionKeys": [
      "COND_RANGE"
    ],
    "integrationPattern": "SEQUENTIAL"
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
    "content": "그림과 같이 좌표평면 위의 사각형 $\\mathrm{ABCD}$에 대하여 두 꼭짓점 $\\mathrm{A}, \\mathrm{B}$는 포물선 $y^2 = 8(x+3)$ 위에 있고 두 꼭짓점 $\\mathrm{C}, \\mathrm{D}$는 포물선 $y^2 = -8(x-4)$ 위에 있다. $\\overline{\\mathrm{AB}}$와 $\\overline{\\mathrm{CD}}$는 각각 두 포물선의 초점 $\\mathrm{F}'$과 $\\mathrm{F}$를 지나고 $\\overline{\\mathrm{AD}}$와 $\\overline{\\mathrm{BC}}$는 $x$축에 평행할 때, 사각형 $\\mathrm{ABCD}$의 둘레의 길이는? (단, 점 $\\mathrm{A}$의 $x$좌표는 점 $\\mathrm{D}$의 $x$좌표보다 작고, 점 $\\mathrm{B}$의 $x$좌표는 점 $\\mathrm{C}$의 $x$좌표보다 작다.) [그림: 좌표평면에 꼭짓점이 $(-3, 0)$이고 초점이 $\\mathrm{F}'(-1, 0)$이며 오른쪽으로 열린 포물선 $y^2 = 8(x+3)$과, 꼭짓점이 $(4, 0)$이고 초점이 $\\mathrm{F}(2, 0)$이며 왼쪽으로 열린 포물선 $y^2 = -8(x-4)$가 그려져 있다. $y^2 = 8(x+3)$ 위의 두 점 $\\mathrm{A}$($x$축 위쪽), $\\mathrm{B}$($x$축 아래쪽)를 잇는 선분 $\\mathrm{AB}$가 초점 $\\mathrm{F}'$을 지나고, $y^2 = -8(x-4)$ 위의 두 점 $\\mathrm{D}$($x$축 위쪽), $\\mathrm{C}$($x$축 아래쪽)를 잇는 선분 $\\mathrm{CD}$가 초점 $\\mathrm{F}$를 지난다. 선분 $\\mathrm{AD}$와 $\\mathrm{BC}$는 $x$축에 평행하게 연결되어 사각형 $\\mathrm{ABCD}$를 이룬다.]",
    "choices": [
      "$20$",
      "$22$",
      "$24$",
      "$26$",
      "$28$"
    ],
    "answer": "②",
    "solution": "포물선 $y^2 = 8(x+3) = 4 \\cdot 2(x+3)$의 초점은 $\\mathrm{F}'(-1, 0)$이고 준선의 방정식은 $x = -5$이다.\n포물선 $y^2 = -8(x-4) = 4 \\cdot (-2)(x-4)$의 초점은 $\\mathrm{F}(2, 0)$이고 준선의 방정식은 $x = 6$이다.\n네 점 $\\mathrm{A}, \\mathrm{B}, \\mathrm{C}, \\mathrm{D}$의 $x$좌표를 각각 $x_1, x_2, x_3, x_4$라 하자.\n선분 $\\mathrm{AB}$가 초점 $\\mathrm{F}'$을 지나므로 포물선의 정의에 의하여\n$$\\overline{\\mathrm{AB}} = \\overline{\\mathrm{AF}'} + \\overline{\\mathrm{BF}'} = (x_1 + 5) + (x_2 + 5) = x_1 + x_2 + 10$$\n이다.\n마찬가지로 선분 $\\mathrm{CD}$가 초점 $\\mathrm{F}$를 지나므로 포물선의 정의에 의하여\n$$\\overline{\\mathrm{CD}} = \\overline{\\mathrm{CF}} + \\overline{\\mathrm{DF}} = (6 - x_3) + (6 - x_4) = 12 - x_3 - x_4$$\n이다.\n또한 $\\overline{\\mathrm{AD}}$와 $\\overline{\\mathrm{BC}}$는 $x$축에 평행하고 $x_1 < x_4$, $x_2 < x_3$이므로\n$$\\overline{\\mathrm{AD}} = x_4 - x_1, \\quad \\overline{\\mathrm{BC}} = x_3 - x_2$$\n이다.\n따라서 사각형 $\\mathrm{ABCD}$의 둘레의 길이는\n$$\\begin{aligned} \\overline{\\mathrm{AB}} + \\overline{\\mathrm{BC}} + \\overline{\\mathrm{CD}} + \\overline{\\mathrm{DA}} &= (x_1 + x_2 + 10) + (x_3 - x_2) + (12 - x_3 - x_4) + (x_4 - x_1) \\\\ &= 22 \\end{aligned}$$\n이다.\n따라서 정답은 ②이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-GEO-RPM-039",
    "problemTypeKey": "PT_GEO_PARABOLA",
    "templateKey": "TPL_GEO_PARABOLA_PAIR_SEGMENT",
    "primaryMethod": "초점을 지나는 두 현을 포물선의 정의로 준선까지 거리의 합으로 바꿔 둘레를 구한다",
    "decisiveStep": "$(x_1+x_2+10)+(x_3-x_2)+(12-x_3-x_4)+(x_4-x_1)=22$",
    "crossConceptKeys": [
      "CC_DISTANCE_TWO_POINTS"
    ],
    "conditionKeys": [
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
    "content": "그림과 같이 좌표평면에서 $x$축 위의 두 점 $\\mathrm{A}, \\mathrm{B}$에 대하여 꼭짓점이 $\\mathrm{A}$인 포물선 $p_1$과 꼭짓점이 $\\mathrm{B}$인 포물선 $p_2$가 다음 세 조건을 만족한다.\n\n(가) $p_1$의 초점 $\\mathrm{F}$에 대하여 점 $\\mathrm{B}$는 선분 $\\mathrm{AF}$의 중점이고, $p_2$의 초점은 원점 $\\mathrm{O}$이다.\n(나) $p_1$과 $p_2$는 $y$축 위의 두 점 $\\mathrm{C}, \\mathrm{D}$에서 만난다.\n(다) $\\overline{\\mathrm{AB}} = 3$\n\n이때 삼각형 $\\mathrm{ABC}$의 넓이는? (단, 점 $\\mathrm{A}$의 $x$좌표는 음수이고, 점 $\\mathrm{B}$의 $x$좌표는 양수이다.) [그림: 좌표평면에서 $x$축 음의 부분에 점 $\\mathrm{A}$, 원점 $\\mathrm{O}$, $x$축 양의 부분에 점 $\\mathrm{B}$가 있고 $\\overline{\\mathrm{AB}} = 3$이 표시되어 있다. 꼭짓점이 $\\mathrm{A}$이고 오른쪽으로 열린 포물선 $p_1$과, 꼭짓점이 $\\mathrm{B}$이고 왼쪽으로 열린 포물선 $p_2$가 $y$축 위의 두 점 $\\mathrm{C}$(양의 부분), $\\mathrm{D}$(음의 부분)에서 만난다.]",
    "choices": [
      "$6(\\sqrt{2}-1)$",
      "$9(\\sqrt{2}-1)$",
      "$6(\\sqrt{3}-1)$",
      "$9(\\sqrt{3}-1)$",
      "$6(\\sqrt{5}-1)$"
    ],
    "answer": "④",
    "solution": "두 점 $\\mathrm{A}, \\mathrm{B}$의 좌표를 각각 $\\mathrm{A}(-a, 0)$, $\\mathrm{B}(b, 0)$ ($a > 0, b > 0$)이라 하면 조건 (다)에서\n$$a + b = 3 \\implies a = 3 - b$$\n이다.\n조건 (가)에서 점 $\\mathrm{B}$는 선분 $\\mathrm{AF}$의 중점이므로 포물선 $p_1$의 꼭짓점 $\\mathrm{A}$에서 초점 $\\mathrm{F}$까지의 거리는 $\\overline{\\mathrm{AF}} = 2\\overline{\\mathrm{AB}} = 6$이다.\n따라서 포물선 $p_1$은 $y^2 = 24x$를 $x$축의 방향으로 $-a$만큼 평행이동한 것이므로 방정식은\n$$p_1 : y^2 = 24(x + a)$$\n이다.\n또, 포물선 $p_2$는 꼭짓점이 $\\mathrm{B}(b, 0)$이고 초점이 원점 $\\mathrm{O}(0, 0)$이므로 방정식은\n$$p_2 : y^2 = -4b(x - b)$$\n이다.\n조건 (나)에서 두 포물선 $p_1, p_2$가 $y$축($x = 0$) 위의 두 점 $\\mathrm{C}, \\mathrm{D}$에서 만나므로 두 방정식에 $x = 0$을 대입한 $y^2$의 값이 서로 같다. 즉,\n$$24a = 4b^2 \\implies b^2 = 6a$$\n여기에 $a = 3 - b$를 대입하면\n$$b^2 = 6(3 - b) \\implies b^2 + 6b - 18 = 0$$\n$b > 0$이므로 근의 공식에 의하여\n$$b = -3 + \\sqrt{9 + 18} = 3\\sqrt{3} - 3 = 3(\\sqrt{3} - 1)$$\n이다. (이때 $a = 6 - 3\\sqrt{3} > 0$으로 조건을 만족한다.)\n점 $\\mathrm{C}$의 $y$좌표를 $y_{\\mathrm{C}}$라 하면 $y_{\\mathrm{C}}^2 = 4b^2$이므로\n$$|y_{\\mathrm{C}}| = 2b = 6(\\sqrt{3} - 1)$$\n이다.\n따라서 삼각형 $\\mathrm{ABC}$의 넓이는\n$$\\frac{1}{2} \\times \\overline{\\mathrm{AB}} \\times |y_{\\mathrm{C}}| = \\frac{1}{2} \\times 3 \\times 6(\\sqrt{3} - 1) = 9(\\sqrt{3} - 1)$$\n이다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-GEO-RPM-039",
    "problemTypeKey": "PT_GEO_PARABOLA",
    "templateKey": "TPL_GEO_PARABOLA_PAIR_SEGMENT",
    "primaryMethod": "중점 조건으로 두 포물선의 식을 세우고 y축 교점 조건에서 b를 구해 넓이를 낸다",
    "decisiveStep": "$24a=4b^2$에 $a=3-b$를 넣어 $b^2+6b-18=0$, $b=3\\sqrt{3}-3$",
    "crossConceptKeys": [
      "CC_MIDPOINT",
      "CC_TRANSLATION",
      "CC_TRIANGLE_AREA"
    ],
    "conditionKeys": [
      "COND_NEGATIVE",
      "COND_POSITIVE"
    ],
    "integrationPattern": "SEQUENTIAL"
  }
];
