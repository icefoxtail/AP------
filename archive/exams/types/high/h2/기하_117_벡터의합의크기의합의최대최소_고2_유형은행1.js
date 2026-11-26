window.examTitle = "기하_117_벡터의합의크기의합의최대최소_고2_유형은행1";

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
    "content": "좌표평면 위에 두 점 $A(5, 0), B(0, 5)$와 직선 $x=3$ 위의 점 $P(3, a)$가 있다. 점 $Q$가 중심각의 크기가 $\\frac{\\pi}{2}$인 부채꼴 $OAB$의 호 $AB$ 위를 움직일 때, $|\\vec{OP} + \\vec{OQ}|$의 최댓값을 $f(a)$라 하자. $f(a) = 10$이 되도록 하는 모든 실수 $a$의 값의 곱은? (단, $O$는 원점이다.)\n[그림: 좌표평면의 제1사분면에 원점 O(0, 0)을 중심으로 하고 반지름의 길이가 5인 사분원 호 AB(A(5, 0), B(0, 5))가 있고, 직선 x=3 위에 점 P(3, a)가 있으며, 호 AB 위에 동점 Q가 위치함]",
    "choices": [
      "-24",
      "-20",
      "-18",
      "-16",
      "-12"
    ],
    "answer": "①",
    "solution": "호 $AB$ 위의 점 $Q$의 위치벡터 크기를 파악한다: $|\\vec{OQ}| = 5$이고 호 $AB$ 위의 각도는 $[0, \\frac{\\pi}{2}]$이다.\n(i) $a \\ge 0$인 경우:\n점 $P(3, a)$의 편각이 $[0, \\frac{\\pi}{2})$이므로 호 $AB$ 위에 $\\vec{OP}$와 같은 방향을 갖는 점 $Q$가 존재한다.\n두 벡터의 방향이 같을 때 크기의 합이 최대가 되므로\n$f(a) = |\\vec{OP}| + |\\vec{OQ}| = \\sqrt{3^2 + a^2} + 5 = \\sqrt{9 + a^2} + 5$\n$f(a) = 10$을 대입하여 $a$를 구한다: $\\sqrt{9 + a^2} + 5 = 10 \\iff \\sqrt{9 + a^2} = 5 \\iff 9 + a^2 = 25 \\iff a^2 = 16$\n$a \\ge 0$이므로 $a = 4$\n(ii) $a < 0$인 경우:\n점 $P(3, a)$는 제4사분면에 위치하므로 호 $AB$ 위의 점 중 $\\vec{OP}$와 이루는 각이 가장 작은 점은 $A(5, 0)$이다.\n따라서 $Q = A(5, 0)$일 때 $|\\vec{OP} + \\vec{OQ}|$가 최대이다.\n$\\vec{OP} + \\vec{OA} = (3, a) + (5, 0) = (8, a)$이므로\n$f(a) = |\\vec{OP} + \\vec{OA}| = \\sqrt{8^2 + a^2} = \\sqrt{64 + a^2}$\n$f(a) = 10$을 대입하여 $a$를 구한다: $\\sqrt{64 + a^2} = 10 \\iff 64 + a^2 = 100 \\iff a^2 = 36$\n$a < 0$이므로 $a = -6$\n모든 실수 $a$의 값의 곱을 계산한다: $4 \\times (-6) = -24$\n따라서 정답은 ①이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-GEO-RPM-072",
    "problemTypeKey": "PT_GEO_PLANE_VECTOR",
    "templateKey": "TPL_GEO_PLANE_VECTOR_EXTREMA",
    "crossConceptKeys": [
      "CC_CIRCLE_CENTER_RADIUS",
      "CC_DISTANCE_TWO_POINTS"
    ],
    "conditionKeys": [
      "COND_RESTRICTED_INTERVAL"
    ],
    "integrationPattern": "CASE_BRANCH"
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
    "content": "좌표평면 위에 세 점 $A(-1, 0), B(5, 0), C(1, 3)$이 있다. 원 $(x+1)^2 + y^2 = 1$ 위를 움직이는 점 $P$와 선분 $BC$ 위를 움직이는 점 $Q$에 대하여 $|\\vec{OP} + \\vec{AQ}|$의 최댓값을 $M$, 최솟값을 $m$이라 하자. $M^2 + m^2$의 값은? (단, $O$는 원점이다.)\n[그림: 좌표평면 위에 점 A(-1, 0)을 중심으로 하고 반지름이 1인 원 위의 점 P, 두 점 B(5, 0), C(1, 3)을 잇는 선분 BC 위의 점 Q가 도시되어 있음]",
    "choices": [
      "36",
      "40",
      "44",
      "48",
      "52"
    ],
    "answer": "②",
    "solution": "원의 중심을 이용하여 $\\vec{OP}$를 분해한다: 원 $(x+1)^2 + y^2 = 1$의 중심이 $A(-1, 0)$이고 반지름이 $1$이므로 $\\vec{OP} = \\vec{OA} + \\vec{AP}$ (단, $|\\vec{AP}| = 1$)\n$\\vec{AQ}$를 위치벡터로 분해하여 전체 식을 정리한다:\n$\\vec{OP} + \\vec{AQ} = (\\vec{OA} + \\vec{AP}) + (\\vec{OQ} - \\vec{OA}) = \\vec{OQ} + \\vec{AP}$\n삼각부등식에 의해 최대·최소의 관계식을 세운다: $|\\vec{AP}| = 1$이므로\n$|\\vec{OQ}| - 1 \\le |\\vec{OQ} + \\vec{AP}| \\le |\\vec{OQ}| + 1$\n따라서 $M = \\max_{Q \\in BC} |\\vec{OQ}| + 1$, $m = \\min_{Q \\in BC} |\\vec{OQ}| - 1$이다.\n선분 $BC$의 직선의 방정식을 구한다: 두 점 $B(5, 0), C(1, 3)$을 지나는 직선은\n$y - 0 = \\frac{3-0}{1-5}(x-5) \\iff y = -\\frac{3}{4}(x-5) \\iff 3x + 4y - 15 = 0$\n원점에서 선분 $BC$까지의 최단 거리를 구한다: 점과 직선 사이의 거리 공식에 의해\n$d = \\frac{|3(0) + 4(0) - 15|}{\\sqrt{3^2 + 4^2}} = \\frac{15}{5} = 3$\n수선의 발 $\\left(\\frac{9}{5}, \\frac{12}{5}\\right)$가 선분 $BC$ ($1 \\le x \\le 5$) 위에 존재하므로 $\\min_{Q \\in BC} |\\vec{OQ}| = 3$이다.\n원점에서 선분 $BC$까지의 최장 거리를 구한다: 양 끝점과의 거리는 $|\\vec{OB}| = 5$, $|\\vec{OC}| = \\sqrt{1^2 + 3^2} = \\sqrt{10}$이므로 $\\max_{Q \\in BC} |\\vec{OQ}| = 5$이다.\n$M$과 $m$을 계산한다: $M = 5 + 1 = 6$, $m = 3 - 1 = 2$\n$M^2 + m^2$을 계산한다: $M^2 + m^2 = 6^2 + 2^2 = 36 + 4 = 40$\n따라서 정답은 ②이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-GEO-RPM-072",
    "problemTypeKey": "PT_GEO_PLANE_VECTOR",
    "templateKey": "TPL_GEO_PLANE_VECTOR_EXTREMA",
    "crossConceptKeys": [
      "CC_CIRCLE_CENTER_RADIUS",
      "CC_POINT_TO_LINE_DISTANCE",
      "CC_DISTANCE_TWO_POINTS"
    ],
    "conditionKeys": [
      "COND_RESTRICTED_INTERVAL"
    ],
    "integrationPattern": "SEQUENTIAL"
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
    "content": "그림과 같이 한 변의 길이가 $8$인 정삼각형 $ABC$에 대하여 점 $A$를 지나고 직선 $BC$에 평행한 직선을 $l$이라 할 때, 세 직선 $AC, BC, l$에 모두 접하는 원을 $O$라 하자. 원 $O$ 위의 점 $P$에 대하여 $|\\vec{AC} + \\vec{BP}|$의 최댓값을 $M$, 최솟값을 $m$이라 할 때, $Mm$의 값은? (단, 원 $O$의 중심은 삼각형 $ABC$의 외부에 있다.)\n[그림: 한 변의 길이가 8인 정삼각형 ABC, 꼭짓점 A를 지나며 변 BC와 평행한 직선 l, 세 직선 AC, BC, l에 동시에 접하며 중심이 삼각형 외부에 있는 원 O, 원 O 위의 동점 P가 표시되어 있음]",
    "choices": [
      "184",
      "187",
      "190",
      "193",
      "196"
    ],
    "answer": "⑤",
    "solution": "정삼각형의 높이와 원 $O$의 반지름을 구한다:\n한 변의 길이가 $8$인 정삼각형의 높이는 $h = \\frac{\\sqrt{3}}{2} \\times 8 = 4\\sqrt{3}$이다.\n원 $O$는 평행한 두 직선 $BC, l$에 동시에 접하므로 원의 지름은 두 평행선 사이의 거리인 $4\\sqrt{3}$이고, 반지름은 $R = 2\\sqrt{3}$이다.\n점 $B$를 원점으로 하는 좌표평면을 설정한다: $B(0, 0), C(8, 0), A(4, 4\\sqrt{3})$\n원 $O$의 중심 $C'$의 좌표를 구한다:\n원 $O$는 $x$축($y=0$)과 직선 $l$($y=4\\sqrt{3}$)에 접하므로 중심 $C'$의 $y$좌표는 $2\\sqrt{3}$이다.\n직선 $AC$의 방정식은 기울기가 $\\frac{0 - 4\\sqrt{3}}{8 - 4} = -\\sqrt{3}$이므로 $\\sqrt{3}x + y - 8\\sqrt{3} = 0$이다.\n점과 직선 사이의 거리 공식으로 중심 $C'(x_0, 2\\sqrt{3})$에서 직선 $AC$까지의 거리를 계산한다:\n$\\frac{|\\sqrt{3}x_0 + 2\\sqrt{3} - 8\\sqrt{3}|}{\\sqrt{(\\sqrt{3})^2 + 1^2}} = 2\\sqrt{3} \\iff \\frac{|\\sqrt{3}(x_0 - 6)|}{2} = 2\\sqrt{3} \\iff |x_0 - 6| = 4$\n중심이 삼각형 $ABC$의 외부에 있으므로 $x_0 = 10$, 즉 $C'(10, 2\\sqrt{3})$이다.\n$\\vec{AC} + \\vec{BP}$를 원의 중심 $C'$를 경유하도록 분해한다:\n$\\vec{BP} = \\vec{BC'} + \\vec{C'P}$이므로 $\\vec{AC} + \\vec{BP} = (\\vec{AC} + \\vec{BC'}) + \\vec{C'P}$\n성분으로 기준 벡터의 합을 구한다:\n$\\vec{AC} = (8-4, 0-4\\sqrt{3}) = (4, -4\\sqrt{3})$, $\\vec{BC'} = (10-0, 2\\sqrt{3}-0) = (10, 2\\sqrt{3})$\n$\\vec{AC} + \\vec{BC'} = (4+10, -4\\sqrt{3}+2\\sqrt{3}) = (14, -2\\sqrt{3})$\n기준 벡터의 크기를 구한다: $|\\vec{AC} + \\vec{BC'}| = \\sqrt{14^2 + (-2\\sqrt{3})^2} = \\sqrt{196 + 12} = \\sqrt{208}$\n$|\\vec{C'P}| = R = 2\\sqrt{3}$이므로 $M = \\sqrt{208} + 2\\sqrt{3}$, $m = \\sqrt{208} - 2\\sqrt{3}$이다.\n합차 공식으로 $Mm$을 계산한다:\n$Mm = (\\sqrt{208} + 2\\sqrt{3})(\\sqrt{208} - 2\\sqrt{3}) = 208 - (2\\sqrt{3})^2 = 208 - 12 = 196$\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B45",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-GEO-RPM-072",
    "problemTypeKey": "PT_GEO_PLANE_VECTOR",
    "templateKey": "TPL_GEO_PLANE_VECTOR_EXTREMA",
    "crossConceptKeys": [
      "CC_EQUILATERAL_TRIANGLE",
      "CC_PARALLEL_LINES",
      "CC_POINT_TO_LINE_DISTANCE"
    ],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL",
    "image": "assets/images/기하_117_벡터의합의크기의합의최대최소_고2_유형은행1/q3-problem.svg",
    "imageAlt": "한 변 8인 정삼각형 ABC와 AC·BC·l에 동시에 접하는 외부 원 O",
    "imageCaption": "한 변 8인 정삼각형 ABC와 AC·BC·l에 동시에 접하는 외부 원 O",
    "imageSize": "full"
  }
];
