window.examTitle = "기하_053_쌍곡선과포물선_고2_유형은행1";

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
    "content": "쌍곡선 $\\frac{x^2}{a^2} - \\frac{y^2}{b^2} = 1$의 한 초점이 포물선 $y^2 = 16x$의 초점과 일치하고 점 $(\\sqrt{6}, \\sqrt{13})$이 이 쌍곡선 위의 점일 때, 쌍곡선의 주축의 길이는? (단, $a, b$는 상수이다.)",
    "choices": [
      "$2\\sqrt{2}$",
      "$2\\sqrt{3}$",
      "4",
      "$2\\sqrt{5}$",
      "$2\\sqrt{6}$"
    ],
    "answer": "②",
    "solution": "1단계(포물선의 초점 구하기): 포물선의 방정식 $y^2 = 16x$를 표준형 $y^2 = 4px$와 비교하면 $4p = 16 \\implies p = 4$이다. 따라서 포물선의 초점의 좌표는 $(4, 0)$이다.\n2단계(쌍곡선의 초점 관계식 세우기): 쌍곡선 $\\frac{x^2}{a^2} - \\frac{y^2}{b^2} = 1$의 한 초점이 $(4, 0)$이므로 $c = 4$이다. 쌍곡선의 초점 공식에 의해 $a^2 + b^2 = c^2 = 4^2 = 16$이 성립하므로, $b^2 = 16 - a^2$이다. 이때 $0 < a^2 < 16$이다.\n3단계(점 대입하여 방정식 세우기): 점 $(\\sqrt{6}, \\sqrt{13})$이 쌍곡선 위의 점이므로 대입하면 $\\frac{(\\sqrt{6})^2}{a^2} - \\frac{(\\sqrt{13})^2}{b^2} = 1 \\implies \\frac{6}{a^2} - \\frac{13}{16 - a^2} = 1$이다.\n4단계(이차방정식 풀기): $a^2 = t$ ($0 < t < 16$)라 하면 $\\frac{6}{t} - \\frac{13}{16 - t} = 1$이다. 양변에 $t(16 - t)$를 곱하여 분모를 없애면 $6(16 - t) - 13t = t(16 - t) \\implies 96 - 6t - 13t = 16t - t^2 \\implies 96 - 19t = 16t - t^2$이다. 모든 항을 좌변으로 이항하여 정리하면 $t^2 - 35t + 96 = 0$이다.\n5단계(인수분해): $(t - 3)(t - 32) = 0$이므로 $t = 3$ 또는 $t = 32$이다.\n6단계($a$의 값 결정): $0 < t < 16$이므로 $t = a^2 = 3$이다. $a > 0$이므로 $a = \\sqrt{3}$이다.\n7단계(주축의 길이 계산): 쌍곡선의 주축의 길이는 $2a = 2\\sqrt{3}$이다.\n따라서 정답은 ②이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-GEO-RPM-043",
    "problemTypeKey": "PT_GEO_HYPERBOLA",
    "templateKey": "TPL_GEO_HYPERBOLA_WITH_CURVE",
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
    "content": "그림과 같이 두 초점이 $\\mathrm{F}, \\mathrm{F}'$인 쌍곡선 $x^2 - \\frac{y^2}{a} = 1$과 초점이 $\\mathrm{F}$인 포물선 $y^2 = bx (b > 0)$가 두 점 $\\mathrm{P}, \\mathrm{Q}$에서 만난다. $\\overline{\\mathrm{PQ}} = 4\\sqrt{6}$일 때, 두 상수 $a, b$에 대하여 $a+b$의 값은? (단, 점 $\\mathrm{P}$의 $x$좌표는 점 $\\mathrm{F}$의 $x$좌표보다 작다.)\n\n[그림: 좌표평면 위에 쌍곡선 $x^2 - \\frac{y^2}{a} = 1$과 포물선 $y^2 = bx$가 그려져 있다. 쌍곡선의 오른쪽 초점 $\\mathrm{F}$는 포물선의 초점과 일치하며, 두 곡선의 교점 $\\mathrm{P}, \\mathrm{Q}$가 선분 $\\mathrm{PQ}$로 연결되어 있다. 선분 $\\mathrm{PQ}$의 길이는 $4\\sqrt{6}$이다.]",
    "choices": [
      "14",
      "16",
      "18",
      "20",
      "22"
    ],
    "answer": "④",
    "solution": "1단계(초점의 일치 조건): 쌍곡선 $x^2 - \\frac{y^2}{a} = 1$에서 초점의 좌표를 $\\mathrm{F}(c, 0)$이라 하면 $c^2 = 1^2 + a = 1 + a \\implies a = c^2 - 1$이다. 포물선 $y^2 = bx = 4(\\frac{b}{4})x$의 초점이 $\\mathrm{F}(c, 0)$이므로 $\\frac{b}{4} = c \\implies b = 4c$이다.\n2단계(교점 $\\mathrm{P}$의 좌표 표현): 두 곡선의 대칭성에 의해 교점 $\\mathrm{P}, \\mathrm{Q}$는 $x$축에 대하여 대칭이다. $\\overline{\\mathrm{PQ}} = 4\\sqrt{6}$이므로 제 1사분면에 있는 점 $\\mathrm{P}$의 $y$좌표는 $y_1 = \\frac{4\\sqrt{6}}{2} = 2\\sqrt{6}$이고, $y_1^2 = (2\\sqrt{6})^2 = 24$이다.\n3단계(포물선 방정식을 이용한 $x$좌표 표현): 점 $\\mathrm{P}(x_1, y_1)$이 포물선 $y^2 = bx = 4cx$ 위의 점이므로 $24 = 4cx_1 \\implies x_1 = \\frac{24}{4c} = \\frac{6}{c}$이다.\n4단계(쌍곡선 방정식에 대입): 점 $\\mathrm{P}$가 쌍곡선 $x^2 - \\frac{y^2}{a} = 1$ 위의 점이므로 대입하면 $x_1^2 - \\frac{y_1^2}{a} = 1 \\implies \\left(\\frac{6}{c}\\right)^2 - \\frac{24}{c^2 - 1} = 1 \\implies \\frac{36}{c^2} - \\frac{24}{c^2 - 1} = 1$이다.\n5단계($c^2$에 관한 방정식 풀기): $c^2 = u$ ($u > 1$)라 하면 $\\frac{36}{u} - \\frac{24}{u - 1} = 1$이다. 양변에 $u(u - 1)$을 곱하면 $36(u - 1) - 24u = u(u - 1) \\implies 12u - 36 = u^2 - u \\implies u^2 - 13u + 36 = 0$이다. 인수분해하면 $(u - 4)(u - 9) = 0$이므로 $u = 4$ 또는 $u = 9$이다.\n6단계(조건 판별): 문제의 단서 조항에서 점 $\\mathrm{P}$의 $x$좌표는 점 $\\mathrm{F}$의 $x$좌표보다 작으므로 $x_1 < c$이다. 즉, $\\frac{6}{c} < c \\implies c^2 > 6 \\implies u > 6$이다. 따라서 $u = c^2 = 9$이다.\n7단계($a, b$ 및 $a+b$ 계산): $c^2 = 9$이므로 $c = 3$이다. $a = c^2 - 1 = 9 - 1 = 8$이고, $b = 4c = 4 \\times 3 = 12$이다. 따라서 $a + b = 8 + 12 = 20$이다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-GEO-RPM-043",
    "problemTypeKey": "PT_GEO_HYPERBOLA",
    "templateKey": "TPL_GEO_HYPERBOLA_WITH_CURVE",
    "crossConceptKeys": [
      "CC_DISTANCE_TWO_POINTS"
    ],
    "conditionKeys": [
      "COND_POSITIVE",
      "COND_INEQUALITY_CONSTRAINT"
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
    "content": "그림과 같이 $\\mathrm{F}(p, 0)$을 초점으로 하는 포물선 $y^2 = 4px$와 $\\mathrm{F}(p, 0)$과 $\\mathrm{F}'(-p, 0)$을 초점으로 하는 쌍곡선 $\\frac{x^2}{a^2} - \\frac{y^2}{b^2} = 1 (a > 0, b > 0)$이 제 1사분면에서 만나는 점을 $\\mathrm{A}$라 하자. $\\overline{\\mathrm{AF}} = 10$, $\\cos(\\angle \\mathrm{AFF}') = -\\frac{1}{5}$일 때, $ab$의 값은?\n\n[그림: 좌표평면 위에 초점 $\\mathrm{F}(p, 0)$을 공유하는 포물선 $y^2 = 4px$와 쌍곡선 $\\frac{x^2}{a^2} - \\frac{y^2}{b^2} = 1$이 그려져 있다. 제 1사분면의 교점 $\\mathrm{A}$에서 선분 $\\mathrm{AF}$가 그어져 있으며, $\\overline{\\mathrm{AF}} = 10$이고 각 $\\angle \\mathrm{AFF}'$의 코사인 값이 $-\\frac{1}{5}$로 주어진다.]",
    "choices": [
      "$4\\sqrt{3}$",
      "$5\\sqrt{2}$",
      "$3\\sqrt{6}$",
      "$2\\sqrt{15}$",
      "$6\\sqrt{2}$"
    ],
    "answer": "①",
    "solution": "1단계(포물선의 정의 적용): 점 $\\mathrm{A}(x_1, y_1)$이 포물선 $y^2 = 4px$ 위의 점이므로 포물선의 정의에 의해 초점 $\\mathrm{F}$까지의 거리는 준선 $x = -p$까지의 거리와 같다. 즉, $\\overline{\\mathrm{AF}} = x_1 - (-p) = x_1 + p = 10$이다. 따라서 $x_1 = 10 - p$이다.\n2단계(코사인 조건 해석): 점 $\\mathrm{A}$에서 $x$축에 내린 수선의 발을 $\\mathrm{H}(x_1, 0)$이라 하면, 직각삼각형 $\\mathrm{AHF}$에서 $\\vec{\\mathrm{FA}} = (x_1 - p, y_1)$이다. $x$축의 음의 방향(점 $\\mathrm{F}'$ 방향)과 이루는 각 $\\theta = \\angle \\mathrm{AFF}'$에 대하여 $\\cos \\theta = \\frac{-(x_1 - p)}{\\overline{\\mathrm{AF}}} = -\\frac{x_1 - p}{10}$이다. 문제에서 $\\cos(\\angle \\mathrm{AFF}') = -\\frac{1}{5}$이므로 $-\\frac{x_1 - p}{10} = -\\frac{1}{5} \\implies x_1 - p = 2 \\implies x_1 = p + 2$이다.\n3단계($p$와 점 $\\mathrm{A}$의 좌표 결정): $10 - p = p + 2 \\implies 2p = 8 \\implies p = 4$이다. 따라서 $x_1 = 4 + 2 = 6$이고, 포물선 방정식에 대입하면 $y_1^2 = 4px_1 = 4 \\times 4 \\times 6 = 96$이다.\n4단계(선분 $\\mathrm{AF}'$의 길이 계산): 쌍곡선의 다른 초점은 $\\mathrm{F}'(-4, 0)$이다. 두 점 사이의 거리 공식에 의해 $\\overline{\\mathrm{AF}'}^2 = (x_1 - (-p))^2 + y_1^2 = (6 + 4)^2 + 96 = 10^2 + 96 = 100 + 96 = 196$이므로 $\\overline{\\mathrm{AF}'} = \\sqrt{196} = 14$이다.\n5단계(쌍곡선의 정의로 $a$ 구하기): 점 $\\mathrm{A}$는 쌍곡선의 오른쪽 가지 위의 점이므로 쌍곡선의 정의에 의해 $\\overline{\\mathrm{AF}'} - \\overline{\\mathrm{AF}} = 2a$이다. $14 - 10 = 2a \\implies 2a = 4 \\implies a = 2$이다.\n6단계(초점 관계식으로 $b$ 구하기): 쌍곡선의 초점이 $\\mathrm{F}(4, 0)$이므로 $c = p = 4$이다. $c^2 = a^2 + b^2$에서 $b^2 = c^2 - a^2 = 4^2 - 2^2 = 16 - 4 = 12$이다. $b > 0$이므로 $b = \\sqrt{12} = 2\\sqrt{3}$이다.\n7단계($ab$ 계산): 따라서 $ab = 2 \\times 2\\sqrt{3} = 4\\sqrt{3}$이다.\n따라서 정답은 ①이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-GEO-RPM-043",
    "problemTypeKey": "PT_GEO_HYPERBOLA",
    "templateKey": "TPL_GEO_HYPERBOLA_WITH_CURVE",
    "crossConceptKeys": [
      "CC_POINT_TO_LINE_DISTANCE"
    ],
    "conditionKeys": [
      "COND_POSITIVE"
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
    "content": "그림과 같이 두 점 $\\mathrm{F}(k, 0), \\mathrm{F}'(-k, 0)$을 초점으로 하는 쌍곡선 $\\frac{x^2}{a^2} - \\frac{y^2}{b^2} = 1$과 점 $\\mathrm{F}$를 초점으로 하는 포물선 $y^2 = 80(x+c)$가 있다. 쌍곡선 위의 임의의 점 $\\mathrm{P}$에 대하여 $|\\overline{\\mathrm{PF}} - \\overline{\\mathrm{PF}'}| = 14$가 성립하고 포물선의 꼭짓점 $\\mathrm{A}$에 대하여 $\\overline{\\mathrm{AF}'} : \\overline{\\mathrm{FF}'} = 1 : 4$가 성립한다. 이때 $\\frac{c^2}{a^2 - b^2}$의 값은? (단, $0 < k < c$)\n\n[그림: 좌표평면 위에 두 초점 $\\mathrm{F}'(-k, 0)$, $\\mathrm{F}(k, 0)$을 갖는 쌍곡선 $\\frac{x^2}{a^2} - \\frac{y^2}{b^2} = 1$과 꼭짓점이 $\\mathrm{A}(-c, 0)$이고 초점이 $\\mathrm{F}(k, 0)$인 포물선 $y^2 = 80(x+c)$가 그려져 있다. 쌍곡선 위의 점 $\\mathrm{P}$와 선분 $\\mathrm{AF}'$, $\\mathrm{FF}'$가 표시되어 있다.]",
    "choices": [
      "$\\frac{70}{17}$",
      "$\\frac{72}{17}$",
      "$\\frac{74}{17}$",
      "$\\frac{76}{17}$",
      "$\\frac{78}{17}$"
    ],
    "answer": "②",
    "solution": "1단계(쌍곡선의 정의로부터 $a$ 구하기): 쌍곡선 위의 임의의 점 $\\mathrm{P}$에 대하여 두 초점까지의 거리의 차는 주축의 길이와 같으므로, $|\\overline{\\mathrm{PF}} - \\overline{\\mathrm{PF}'}| = 2a = 14 \\implies a = 7, a^2 = 49$이다.\n2단계(포물선의 초점으로부터 관계식 유도): 포물선 $y^2 = 80(x+c)$를 표준형 $y^2 = 4p_0(x+c)$와 비교하면 $4p_0 = 80 \\implies p_0 = 20$이다. 포물선의 꼭짓점은 $\\mathrm{A}(-c, 0)$이고, 초점은 꼭짓점에서 오른쪽으로 $p_0 = 20$만큼 평행이동한 점 $(-c + 20, 0)$이다. 포물선의 초점이 $\\mathrm{F}(k, 0)$이므로 $-c + 20 = k \\implies c + k = 20$이다.\n3단계(선분의 길이 비로부터 $k$와 $c$의 관계식 유도): $0 < k < c$이므로 $x$축 위의 점들의 위치 관계는 $\\mathrm{A}(-c, 0)$, $\\mathrm{F}'(-k, 0)$, $\\mathrm{F}(k, 0)$ 순서이다. 선분의 길이는 $\\overline{\\mathrm{AF}'} = -k - (-c) = c - k$이고, $\\overline{\\mathrm{FF}'} = k - (-k) = 2k$이다. $\\overline{\\mathrm{AF}'} : \\overline{\\mathrm{FF}'} = 1 : 4$이므로 $\\frac{c - k}{2k} = \\frac{1}{4} \\implies 4(c - k) = 2k \\implies 4c - 4k = 2k \\implies 6k = 4c \\implies k = \\frac{2}{3}c$이다.\n4단계($c$와 $k$ 계산): $k = \\frac{2}{3}c$를 $c + k = 20$에 대입하면 $c + \\frac{2}{3}c = 20 \\implies \\frac{5}{3}c = 20 \\implies c = 20 \\times \\frac{3}{5} = 12$이다. 따라서 $k = \\frac{2}{3} \\times 12 = 8$이다. 이때 $0 < 8 < 12$이므로 $0 < k < c$ 조건을 만족한다.\n5단계($b^2$ 및 $a^2 - b^2$ 계산): 쌍곡선의 초점이 $\\mathrm{F}(8, 0)$이므로 초점 공식 $k^2 = a^2 + b^2$에서 $b^2 = k^2 - a^2 = 8^2 - 7^2 = 64 - 49 = 15$이다. 따라서 $a^2 - b^2 = 49 - 15 = 34$이다.\n6단계(구하는 값 계산): $c = 12$이므로 $c^2 = 12^2 = 144$이다. 구하는 값은 $\\frac{c^2}{a^2 - b^2} = \\frac{144}{34} = \\frac{72}{17}$이다.\n따라서 정답은 ②이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B45",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-GEO-RPM-043",
    "problemTypeKey": "PT_GEO_HYPERBOLA",
    "templateKey": "TPL_GEO_HYPERBOLA_WITH_CURVE",
    "crossConceptKeys": [
      "CC_DISTANCE_TWO_POINTS",
      "CC_INTERNAL_DIVISION"
    ],
    "conditionKeys": [
      "COND_RANGE"
    ],
    "integrationPattern": "SEQUENTIAL"
  }
];
