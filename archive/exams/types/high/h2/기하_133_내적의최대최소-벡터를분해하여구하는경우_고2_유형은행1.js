window.examTitle = "기하_133_내적의최대최소-벡터를분해하여구하는경우_고2_유형은행1";

window.questionBank = [
  {
    "id": 1,
    "category": "벡터의 성분",
    "standardCourse": "기하",
    "curriculum": "2022",
    "standardUnitKey": "H22-GE-06",
    "standardUnit": "벡터의 성분",
    "standardUnitOrder": 6,
    "subUnitKey": "H22-GE-06-VECTOR_COMPONENT",
    "subUnit": "벡터의 성분",
    "subUnitConfidence": "candidate_evidence",
    "subUnitClassificationDepth": "complete_candidate",
    "conceptClusterKey": "H22_GE_06_VECTOR_COMPONENT",
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "벡터의 성분"
    ],
    "wide": false,
    "content": "$\\overline{AB} = 3$, $\\overline{AD} = 4$인 직사각형 $ABCD$와 변 $CD$를 지름으로 하는 반원이 직사각형의 외부에 있다. 호 $CD$ 위를 움직이는 점 $P$에 대하여 $\\vec{AC} \\cdot \\vec{AP}$의 최솟값은? [그림: 세로 $\\overline{AB}=3$, 가로 $\\overline{AD}=4$인 직사각형 $ABCD$, 변 $CD$의 바깥쪽에 붙은 반원, 호 $CD$ 위의 동점 $P$]",
    "choices": [
      "14",
      "16",
      "18",
      "20",
      "22"
    ],
    "answer": "②",
    "solution": "1단계: 직사각형을 좌표평면에 두고 점들의 좌표를 구한다.\n$B(0, 0)$을 원점으로 두면 $A(0, 3)$, $C(4, 0)$, $D(4, 3)$이다.\n$\\vec{AC} = C - A = (4, -3)$이다.\n2단계: 반원의 중심 $O$를 이용하여 $\\vec{AP}$를 분해한다.\n변 $CD$의 중점 $O$는 반원의 중심이므로 $O\\left(4, \\frac{3}{2}\\right)$이고 반지름은 $r = \\frac{3}{2}$이다.\n$\\vec{AP} = \\vec{AO} + \\vec{OP}$이므로 $\\vec{AC} \\cdot \\vec{AP} = \\vec{AC} \\cdot \\vec{AO} + \\vec{AC} \\cdot \\vec{OP}$이다.\n3단계: 상수 벡터의 내적 $\\vec{AC} \\cdot \\vec{AO}$를 계산한다.\n$\\vec{AO} = \\left(4, -\\frac{3}{2}\\right)$이므로 $\\vec{AC} \\cdot \\vec{AO} = 4 \\times 4 + (-3) \\times \\left(-\\frac{3}{2}\\right) = 16 + \\frac{9}{2} = \\frac{41}{2}$이다.\n4단계: 반원 위의 점 $P$에 대하여 $\\vec{AC} \\cdot \\vec{OP}$의 범위를 조사한다.\n반원은 $x \\ge 4$에 위치하므로 $\\vec{OP} = \\left(\\frac{3}{2}\\cos\\theta, \\frac{3}{2}\\sin\\theta\\right)$ $\\left(-\\frac{\\pi}{2} \\le \\theta \\le \\frac{\\pi}{2}\\right)$이다.\n$\\vec{AC} \\cdot \\vec{OP} = 4 \\times \\frac{3}{2}\\cos\\theta - 3 \\times \\frac{3}{2}\\sin\\theta = 6\\cos\\theta - \\frac{9}{2}\\sin\\theta$\n$-\\frac{\\pi}{2} \\le \\theta \\le \\frac{\\pi}{2}$에서 이 식의 최솟값은 양 끝점 중 $\\theta = \\frac{\\pi}{2}$일 때 발생하며 그 값은 $-\\frac{9}{2}$이다.\n5단계: $\\vec{AC} \\cdot \\vec{AP}$의 최솟값을 계산한다.\n최솟값은 $\\frac{41}{2} - \\frac{9}{2} = \\frac{32}{2} = 16$이다. (점 $P$가 점 $D$에 위치할 때 성립)\n따라서 정답은 ②이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-GEO-RPM-076",
    "problemTypeKey": "PT_GEO_PLANE_VECTOR",
    "templateKey": "TPL_GEO_PLANE_VECTOR_EXTREMA",
    "crossConceptKeys": [
      "CC_CIRCLE_CENTER_RADIUS",
      "CC_PYTHAGOREAN"
    ],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 2,
    "category": "벡터의 성분",
    "standardCourse": "기하",
    "curriculum": "2022",
    "standardUnitKey": "H22-GE-06",
    "standardUnit": "벡터의 성분",
    "standardUnitOrder": 6,
    "subUnitKey": "H22-GE-06-VECTOR_COMPONENT",
    "subUnit": "벡터의 성분",
    "subUnitConfidence": "candidate_evidence",
    "subUnitClassificationDepth": "complete_candidate",
    "conceptClusterKey": "H22_GE_06_VECTOR_COMPONENT",
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "벡터의 성분"
    ],
    "wide": false,
    "content": "$\\overline{AB} = 4$, $\\overline{AD} = 2\\sqrt{5}$인 직사각형 $ABCD$의 변 $CD$를 지름으로 하는 반원과 변 $BC$를 지름으로 하는 반원이 직사각형의 외부에 각각 그려져 있다. 이 두 반원의 호 위를 움직이는 점 $P$에 대하여 $\\vec{AC} \\cdot \\vec{AP}$의 최댓값은? [그림: 세로 $\\overline{AB}=4$, 가로 $\\overline{AD}=2\\sqrt{5}$인 직사각형 $ABCD$, 변 $CD$의 오른쪽에 붙은 반원, 변 $BC$의 아래쪽에 붙은 반원, 두 반원 위를 움직이는 동점 $P$]",
    "choices": [
      "40",
      "42",
      "44",
      "46",
      "48"
    ],
    "answer": "①",
    "solution": "1단계: 직사각형을 좌표평면에 나타내고 벡터 $\\vec{AC}$의 성분과 크기를 구한다.\n$B(0, 0)$을 원점으로 두면 $A(0, 4)$, $C(2\\sqrt{5}, 0)$, $D(2\\sqrt{5}, 4)$이다.\n$\\vec{AC} = (2\\sqrt{5}, -4)$이고 $|\\vec{AC}| = \\sqrt{(2\\sqrt{5})^2 + (-4)^2} = \\sqrt{20 + 16} = 6$이다.\n2단계: 변 $CD$를 지름으로 하는 반원 위의 점에 대한 내적의 최댓값을 구한다.\n반원의 중심을 $O_1$이라 하면 $O_1(2\\sqrt{5}, 2)$이고 반지름은 $r_1 = 2$이다.\n$\\vec{AP} = \\vec{AO_1} + \\vec{O_1P}$이므로 $\\vec{AC} \\cdot \\vec{AP} = \\vec{AC} \\cdot \\vec{AO_1} + \\vec{AC} \\cdot \\vec{O_1P}$이다.\n$\\vec{AO_1} = (2\\sqrt{5}, -2)$이므로 $\\vec{AC} \\cdot \\vec{AO_1} = (2\\sqrt{5})(2\\sqrt{5}) + (-4)(-2) = 20 + 8 = 28$이다.\n반원은 $x \\ge 2\\sqrt{5}$ 영역에 있고 $\\vec{AC}$의 $x$성분이 양수이므로, $\\vec{O_1P}$가 $\\vec{AC}$와 같은 방향이 될 수 있다.\n따라서 이 경우의 최댓값은 $M_1 = 28 + |\\vec{AC}| r_1 = 28 + 6 \\times 2 = 40$이다.\n3단계: 변 $BC$를 지름으로 하는 반원 위의 점에 대한 내적의 최댓값을 구한다.\n반원의 중심을 $O_2$라 하면 $O_2(\\sqrt{5}, 0)$이고 반지름은 $r_2 = \\sqrt{5}$이다.\n$\\vec{AO_2} = (\\sqrt{5}, -4)$이므로 $\\vec{AC} \\cdot \\vec{AO_2} = (2\\sqrt{5})(\\sqrt{5}) + (-4)(-4) = 10 + 16 = 26$이다.\n반원은 $y \\le 0$ 영역에 있고 $\\vec{AC}$의 $y$성분이 음수이므로, $\\vec{O_2P}$가 $\\vec{AC}$와 같은 방향이 될 수 있다.\n따라서 이 경우의 최댓값은 $M_2 = 26 + |\\vec{AC}| r_2 = 26 + 6\\sqrt{5}$이다.\n4단계: 두 경우의 최댓값을 비교하여 전체 최댓값을 결정한다.\n$40 - (26 + 6\\sqrt{5}) = 14 - 6\\sqrt{5} = \\sqrt{196} - \\sqrt{180} > 0$이므로 $M_1 > M_2$이다.\n따라서 구하는 최댓값은 $40$이다.\n따라서 정답은 ①이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-GEO-RPM-076",
    "problemTypeKey": "PT_GEO_PLANE_VECTOR",
    "templateKey": "TPL_GEO_PLANE_VECTOR_EXTREMA",
    "crossConceptKeys": [
      "CC_CIRCLE_CENTER_RADIUS",
      "CC_PYTHAGOREAN"
    ],
    "conditionKeys": [],
    "integrationPattern": "CASE_BRANCH"
  },
  {
    "id": 3,
    "category": "벡터의 성분",
    "standardCourse": "기하",
    "curriculum": "2022",
    "standardUnitKey": "H22-GE-06",
    "standardUnit": "벡터의 성분",
    "standardUnitOrder": 6,
    "subUnitKey": "H22-GE-06-VECTOR_COMPONENT",
    "subUnit": "벡터의 성분",
    "subUnitConfidence": "candidate_evidence",
    "subUnitClassificationDepth": "complete_candidate",
    "conceptClusterKey": "H22_GE_06_VECTOR_COMPONENT",
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "벡터의 성분"
    ],
    "wide": false,
    "content": "한 변의 길이가 $6$인 정삼각형 $ABC$의 변 $BC$를 지름으로 하는 원이 있다. 점 $A$를 포함하지 않는 호 $BC$ 위의 점 $P$에 대하여 두 벡터 $\\vec{AB}, \\vec{CP}$의 내적 $\\vec{AB} \\cdot \\vec{CP}$의 최댓값을 $M$, 최솟값을 $m$이라 할 때, $M+m$의 값은? [그림: 한 변의 길이가 $6$인 정삼각형 $ABC$, 변 $BC$를 지름으로 하는 원, 점 $A$ 반대편의 호 $BC$ 위의 동점 $P$]",
    "choices": [
      "21",
      "24",
      "27",
      "30",
      "33"
    ],
    "answer": "③",
    "solution": "1단계: 원의 중심 $O$를 이용하여 벡터 $\\vec{CP}$를 분해한다.\n변 $BC$의 중점을 $O$라 하면 $O$는 원의 중심이고 반지름은 $R = 3$이다.\n$\\vec{CP} = \\vec{CO} + \\vec{OP}$이므로 $\\vec{AB} \\cdot \\vec{CP} = \\vec{AB} \\cdot \\vec{CO} + \\vec{AB} \\cdot \\vec{OP}$이다.\n2단계: 고정된 벡터들의 내적 $\\vec{AB} \\cdot \\vec{CO}$를 계산한다.\n$\\vec{CO} = \\frac{1}{2}\\vec{CB}$이므로 $\\vec{AB} \\cdot \\vec{CO} = \\frac{1}{2}(\\vec{AB} \\cdot \\vec{CB})$이다.\n정삼각형의 성질에 의해 $\\vec{AB} \\cdot \\vec{CB} = |\\vec{AB}| |\\vec{CB}| \\cos 60^\\circ = 6 \\times 6 \\times \\frac{1}{2} = 18$이므로 $\\vec{AB} \\cdot \\vec{CO} = \\frac{1}{2} \\times 18 = 9$이다.\n3단계: 좌표를 도입하여 $\\vec{AB} \\cdot \\vec{OP}$의 최댓값과 최솟값을 구한다.\n점 $O$를 원점 $(0, 0)$, 변 $BC$를 $x$축 위에 놓으면 $B(-3, 0), C(3, 0), A(0, 3\\sqrt{3})$이다.\n점 $A$를 포함하지 않는 호 $BC$는 $y \\le 0$인 반원이므로 점 $P$는 $P(3\\cos\\theta, 3\\sin\\theta)$ ($\\pi \\le \\theta \\le 2\\pi$)이다.\n$\\vec{AB} = (-3, -3\\sqrt{3})$이므로 $\\vec{AB} \\cdot \\vec{OP} = -9\\cos\\theta - 9\\sqrt{3}\\sin\\theta = 18\\cos\\left(\\theta - \\frac{4\\pi}{3}\\right)$이다.\n$\\pi \\le \\theta \\le 2\\pi$에서 $\\theta = \\frac{4\\pi}{3}$일 때 최댓값 $18$을 갖고, $\\theta = 2\\pi$일 때 최솟값 $-9$를 갖는다.\n4단계: $M$과 $m$을 구하고 $M+m$을 계산한다.\n$M = 9 + 18 = 27$\n$m = 9 + (-9) = 0$\n따라서 $M + m = 27 + 0 = 27$이다.\n따라서 정답은 ③이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-GEO-RPM-076",
    "problemTypeKey": "PT_GEO_PLANE_VECTOR",
    "templateKey": "TPL_GEO_PLANE_VECTOR_EXTREMA",
    "crossConceptKeys": [
      "CC_EQUILATERAL_TRIANGLE",
      "CC_INSCRIBED_ANGLE"
    ],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 4,
    "category": "벡터의 성분",
    "standardCourse": "기하",
    "curriculum": "2022",
    "standardUnitKey": "H22-GE-06",
    "standardUnit": "벡터의 성분",
    "standardUnitOrder": 6,
    "subUnitKey": "H22-GE-06-VECTOR_COMPONENT",
    "subUnit": "벡터의 성분",
    "subUnitConfidence": "candidate_evidence",
    "subUnitClassificationDepth": "complete_candidate",
    "conceptClusterKey": "H22_GE_06_VECTOR_COMPONENT",
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "벡터의 성분"
    ],
    "wide": false,
    "content": "한 변의 길이가 $7$인 정사각형 $ABCD$의 내부에 두 선분 $AB, BC$에 접하고 반지름의 길이가 $3$인 원 $C_1$과 두 선분 $AD, CD$에 접하고 반지름의 길이가 $3$인 원 $C_2$가 있다. 원 $C_1$의 둘레 위의 점을 $P$, 원 $C_2$의 둘레 위의 점을 $Q$라 할 때, $|\\vec{AC} - \\vec{PQ}|$의 최댓값은? [그림: 한 변의 길이가 $7$인 정사각형 $ABCD$, $B$ 근처에서 두 변에 접하는 원 $C_1$, $D$ 근처에서 두 변에 접하는 원 $C_2$, 각 원 위의 동점 $P, Q$]",
    "choices": [
      "16",
      "18",
      "20",
      "22",
      "24"
    ],
    "answer": "①",
    "solution": "1단계: 뺄셈 벡터 $\\vec{PQ}$를 시점 $A$를 기준으로 분해하여 식을 정리한다.\n$\\vec{PQ} = \\vec{AQ} - \\vec{AP}$이므로\n$\\vec{AC} - \\vec{PQ} = \\vec{AC} - (\\vec{AQ} - \\vec{AP}) = \\vec{AC} - \\vec{AQ} + \\vec{AP} = \\vec{QC} + \\vec{AP}$이다.\n2단계: 원 $C_1, C_2$의 중심을 각각 $O_1, O_2$라 하고 중심을 경유하는 벡터로 분해한다.\n$\\vec{QC} = \\vec{QO_2} + \\vec{O_2C}$, $\\vec{AP} = \\vec{AO_1} + \\vec{O_1P}$이므로\n$\\vec{AC} - \\vec{PQ} = (\\vec{AO_1} + \\vec{O_2C}) + \\vec{O_1P} + \\vec{QO_2}$이다.\n3단계: 좌표평면을 설정하여 고정 벡터 $\\vec{AO_1} + \\vec{O_2C}$의 크기를 구한다.\n$B(0, 0)$을 원점으로 두면 $A(0, 7), C(7, 0), D(7, 7)$이다.\n두 원의 반지름이 $3$이므로 중심의 좌표는 $O_1(3, 3), O_2(4, 4)$이다.\n$\\vec{AO_1} = (3, -4)$, $\\vec{O_2C} = (3, -4)$이므로 $\\vec{AO_1} + \\vec{O_2C} = (6, -8)$이다.\n따라서 그 크기는 $|\\vec{AO_1} + \\vec{O_2C}| = \\sqrt{6^2 + (-8)^2} = 10$이다.\n4단계: 삼각부등식을 적용하여 최댓값을 구한다.\n$|\\vec{O_1P}| = 3$, $|\\vec{QO_2}| = 3$이므로\n$|(\\vec{AO_1} + \\vec{O_2C}) + \\vec{O_1P} + \\vec{QO_2}| \\le |\\vec{AO_1} + \\vec{O_2C}| + |\\vec{O_1P}| + |\\vec{QO_2}| = 10 + 3 + 3 = 16$\n등호는 두 벡터 $\\vec{O_1P}, \\vec{QO_2}$가 모두 벡터 $(6, -8)$과 같은 방향일 때 성립한다.\n따라서 정답은 ①이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-GEO-RPM-076",
    "problemTypeKey": "PT_GEO_PLANE_VECTOR",
    "templateKey": "TPL_GEO_PLANE_VECTOR_EXTREMA",
    "crossConceptKeys": [
      "CC_SQUARE",
      "CC_CIRCLE_TANGENCY",
      "CC_DISTANCE_TWO_POINTS"
    ],
    "conditionKeys": [],
    "integrationPattern": "REINTERPRETATION"
  },
  {
    "id": 5,
    "category": "벡터의 성분",
    "standardCourse": "기하",
    "curriculum": "2022",
    "standardUnitKey": "H22-GE-06",
    "standardUnit": "벡터의 성분",
    "standardUnitOrder": 6,
    "subUnitKey": "H22-GE-06-VECTOR_COMPONENT",
    "subUnit": "벡터의 성분",
    "subUnitConfidence": "candidate_evidence",
    "subUnitClassificationDepth": "complete_candidate",
    "conceptClusterKey": "H22_GE_06_VECTOR_COMPONENT",
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "벡터의 성분"
    ],
    "wide": false,
    "content": "정삼각형 $ABC$와 선분 $AC$를 지름으로 하는 원 $O$가 있다. 선분 $BC$ 위의 점 $D$에 대하여 $\\angle DAB = 30^\\circ$이다. 점 $X$가 원 $O$ 위를 움직일 때, 두 벡터 $\\vec{XD}, \\vec{AD}$의 내적 $\\vec{XD} \\cdot \\vec{AD}$의 값이 최소가 되도록 하는 점 $X$를 점 $P$라 하자. $\\angle ACP = \\frac{q}{p}\\pi$일 때, $p+q$의 값은? (단, $p, q$는 서로소인 자연수이다.) [그림: 정삼각형 $ABC$, 변 $AC$를 지름으로 하는 원 $O$, 변 $BC$ 위의 점 $D$와 선분 $AD$($\\angle DAB=30^\\circ$), 원 $O$ 위의 동점 $X$]",
    "choices": [
      "14",
      "15",
      "16",
      "17",
      "18"
    ],
    "answer": "④",
    "solution": "1단계: 원의 중심 $O$를 이용하여 벡터 $\\vec{XD}$를 분해한다.\n$\\vec{XD} = \\vec{OD} - \\vec{OX}$이므로\n$\\vec{XD} \\cdot \\vec{AD} = (\\vec{OD} - \\vec{OX}) \\cdot \\vec{AD} = \\vec{OD} \\cdot \\vec{AD} - \\vec{OX} \\cdot \\vec{AD}$이다.\n2단계: 내적이 최소가 되는 기하학적 조건을 찾는다.\n점 $D$는 고정되어 있으므로 $\\vec{OD} \\cdot \\vec{AD}$는 상수이다.\n따라서 $\\vec{XD} \\cdot \\vec{AD}$가 최소가 되려면 $\\vec{OX} \\cdot \\vec{AD}$가 최대가 되어야 한다.\n$|\\vec{OX}|$의 크기는 반지름으로 일정하므로, $\\vec{OX}$가 $\\vec{AD}$와 같은 방향일 때 내적이 최대가 된다.\n즉, 점 $P$에서 벡터 $\\vec{OP}$는 $\\vec{AD}$와 평행하고 같은 방향이다.\n3단계: $\\angle DAC$를 구하고 벡터 $\\vec{OA}$와 $\\vec{OP}$ 사이의 각을 구한다.\n정삼각형 $ABC$에서 $\\angle BAC = 60^\\circ$이므로 $\\angle DAC = 60^\\circ - 30^\\circ = 30^\\circ$이다.\n점 $O$는 선분 $AC$의 중점이므로 벡터 $\\vec{OA}$는 $\\vec{AC}$와 반대 방향이다.\n$\\vec{OP}$가 $\\vec{AD}$와 평행하므로 $\\angle AOP = 180^\\circ - 30^\\circ = 150^\\circ$이다.\n4단계: 이등변삼각형 $OAP$와 원주각의 성질을 이용하여 $\\angle ACP$를 구한다.\n$OA = OP$이므로 $\\triangle OAP$는 이등변삼각형이며 $\\angle OAP = \\frac{180^\\circ - 150^\\circ}{2} = 15^\\circ$이다.\n선분 $AC$가 지름이므로 $\\angle APC = 90^\\circ$이고, 직각삼각형 $APC$에서 $\\angle ACP = 90^\\circ - 15^\\circ = 75^\\circ = \\frac{5}{12}\\pi$이다.\n5단계: 서로소인 자연수 $p, q$에 대하여 $p+q$를 계산한다.\n$p = 12, q = 5$이므로 $p + q = 12 + 5 = 17$이다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-GEO-RPM-076",
    "problemTypeKey": "PT_GEO_PLANE_VECTOR",
    "templateKey": "TPL_GEO_PLANE_VECTOR_EXTREMA",
    "crossConceptKeys": [
      "CC_EQUILATERAL_TRIANGLE",
      "CC_INSCRIBED_ANGLE"
    ],
    "conditionKeys": [
      "COND_NATURAL"
    ],
    "integrationPattern": "REINTERPRETATION"
  }
];
