window.examTitle = "기하_033_타원과원2_고2_유형은행1";

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
    "content": "그림과 같이 원 $x^2+y^2=16$이 $x$축과 만나는 점을 각각 $\\mathrm{A, B}$라 하고, $y$축과 만나는 점을 각각 $\\mathrm{C, D}$라 하자. 두 점 $\\mathrm{A, B}$를 초점으로 하고, 두 점 $\\mathrm{C, D}$를 지나는 타원이 점 $(4, k)$를 지날 때, $k^2$의 값은?\n\n[그림: 좌표평면 위에 원 $x^2+y^2=16$과 그 원이 $x$축과 만나는 점 $\\mathrm{A}(-4, 0), \\mathrm{B}(4, 0)$, $y$축과 만나는 점 $\\mathrm{C}(0, 4), \\mathrm{D}(0, -4)$가 있고, 두 점 $\\mathrm{A, B}$를 초점으로 하고 두 점 $\\mathrm{C, D}$를 지나는 타원이 그려져 있다.]",
    "choices": [
      "6",
      "8",
      "10",
      "12",
      "14"
    ],
    "answer": "②",
    "solution": "1단계: 원의 방정식으로부터 교점의 좌표 구하기\n원 $x^2+y^2=16$이 $x$축과 만나는 점은 $\\mathrm{A}(-4, 0), \\mathrm{B}(4, 0)$이고, $y$축과 만나는 점은 $\\mathrm{C}(0, 4), \\mathrm{D}(0, -4)$이다.\n2단계: 타원의 초점과 단축의 꼭짓점 파악하기\n타원의 두 초점이 $\\mathrm{A}(-4, 0), \\mathrm{B}(4, 0)$이므로 초점거리 $c = 4$이다.\n타원이 $y$축 위의 두 점 $\\mathrm{C}(0, 4), \\mathrm{D}(0, -4)$를 지나므로 단축의 양 끝점이 바로 $\\mathrm{C, D}$이다. 즉 $b = 4$이다.\n3단계: 타원의 장축의 길이 및 방정식 완성하기\n타원의 중심이 원점이고 초점이 $x$축 위에 있으므로 $a^2 = b^2 + c^2$이 성립한다.\n$a^2 = 4^2 + 4^2 = 16 + 16 = 32$이다.\n따라서 타원의 방정식은 $\\frac{x^2}{32} + \\frac{y^2}{16} = 1$이다.\n4단계: 점 $(4, k)$를 대입하여 $k^2$ 계산하기\n점 $(4, k)$가 타원 위의 점이므로 대입하면\n$\\frac{4^2}{32} + \\frac{k^2}{16} = 1 \\implies \\frac{16}{32} + \\frac{k^2}{16} = 1 \\implies \\frac{1}{2} + \\frac{k^2}{16} = 1$\n$\\frac{k^2}{16} = 1 - \\frac{1}{2} = \\frac{1}{2} \\implies k^2 = 16 \\times \\frac{1}{2} = 8$이다.\n따라서 정답은 ②이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-GEO-RPM-041",
    "problemTypeKey": "PT_GEO_ELLIPSE",
    "templateKey": "TPL_GEO_ELLIPSE_WITH_CURVE",
    "crossConceptKeys": [
      "CC_CIRCLE_EQUATION",
      "CC_DISTANCE_TWO_POINTS"
    ],
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
    "content": "타원 $\\frac{x^2}{25} + \\frac{y^2}{9} = 1$의 두 초점을 $\\mathrm{F, F'}$이라 하자. 이 타원 위의 점 $\\mathrm{P}$가 선분 $\\mathrm{OP}$의 길이와 선분 $\\mathrm{OF}$의 길이가 같음($\\overline{\\mathrm{OP}} = \\overline{\\mathrm{OF}}$)을 만족시킬 때, $\\overline{\\mathrm{PF}} \\times \\overline{\\mathrm{PF'}}$의 값은? (단, $\\mathrm{O}$는 원점이다.)\n\n[그림: 좌표평면 위에 타원 $\\frac{x^2}{25}+\\frac{y^2}{9}=1$과 두 초점 $\\mathrm{F, F'}$이 있고, 타원 위의 점 $\\mathrm{P}$와 원점 $\\mathrm{O}$를 이은 선분의 길이가 초점 $\\mathrm{F}$와 원점 사이의 거리와 같도록 점 $\\mathrm{P}$가 표시되어 있다.]",
    "choices": [
      "14",
      "16",
      "18",
      "20",
      "22"
    ],
    "answer": "③",
    "solution": "1단계: 타원의 초점과 장축의 길이 구하기\n타원의 방정식 $\\frac{x^2}{25} + \\frac{y^2}{9} = 1$에서 $a^2=25, b^2=9$이므로 $a=5$이다.\n초점거리 $c$는 $c^2 = a^2 - b^2 = 25 - 9 = 16$에서 $c=4$이다.\n따라서 두 초점은 $\\mathrm{F}(4, 0), \\mathrm{F'}(-4, 0)$이고, $\\overline{\\mathrm{OF}} = \\overline{\\mathrm{OF'}} = 4$이다.\n2단계: 삼각형 $\\mathrm{PFF'}$의 외심의 성질로부터 직각삼각형임을 도출하기\n조건에서 $\\overline{\\mathrm{OP}} = \\overline{\\mathrm{OF}} = 4$이므로 $\\overline{\\mathrm{OP}} = \\overline{\\mathrm{OF}} = \\overline{\\mathrm{OF'}} = 4$이다.\n선분 $\\mathrm{FF'}$의 중점이 원점 $\\mathrm{O}$이고 점 $\\mathrm{O}$에서 삼각형의 세 꼭짓점에 이르는 거리가 모두 같으므로, 점 $\\mathrm{O}$는 삼각형 $\\mathrm{PFF'}$의 외심이다.\n외심이 빗변 $\\mathrm{FF'}$의 중점에 위치하므로 삼각형 $\\mathrm{PFF'}$은 $\\angle \\mathrm{FPF'} = 90^\\circ$인 직각삼각형이다.\n3단계: 피타고라스 정리와 타원의 정의를 결합하여 곱 구하기\n직각삼각형 $\\mathrm{PFF'}$에서 피타고라스 정리에 의해 $\\overline{\\mathrm{PF}}^2 + \\overline{\\mathrm{PF'}}^2 = \\overline{\\mathrm{FF'}}^2 = (2c)^2 = 8^2 = 64$이다.\n타원의 정의에 의해 장축의 길이는 거리의 합이므로 $\\overline{\\mathrm{PF}} + \\overline{\\mathrm{PF'}} = 2a = 2 \\times 5 = 10$이다.\n곱셈공식 $(\\overline{\\mathrm{PF}} + \\overline{\\mathrm{PF'}})^2 = \\overline{\\mathrm{PF}}^2 + \\overline{\\mathrm{PF'}}^2 + 2(\\overline{\\mathrm{PF}} \\times \\overline{\\mathrm{PF'}})$에 대입하면\n$10^2 = 64 + 2(\\overline{\\mathrm{PF}} \\times \\overline{\\mathrm{PF'}}) \\implies 100 = 64 + 2(\\overline{\\mathrm{PF}} \\times \\overline{\\mathrm{PF'}})$\n$2(\\overline{\\mathrm{PF}} \\times \\overline{\\mathrm{PF'}}) = 36 \\implies \\overline{\\mathrm{PF}} \\times \\overline{\\mathrm{PF'}} = 18$이다.\n따라서 정답은 ③이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-GEO-RPM-041",
    "problemTypeKey": "PT_GEO_ELLIPSE",
    "templateKey": "TPL_GEO_ELLIPSE_WITH_CURVE",
    "crossConceptKeys": [
      "CC_CIRCLE_CENTER_RADIUS",
      "CC_INSCRIBED_ANGLE"
    ],
    "conditionKeys": [],
    "integrationPattern": "INTERDEPENDENT"
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
    "content": "그림과 같이 타원 $\\frac{x^2}{36} + \\frac{y^2}{20} = 1$의 두 초점을 $\\mathrm{A, F}$라 하자. 원 $(x-4)^2 + y^2 = 16$과 타원의 한 교점을 $\\mathrm{P}$라고 할 때, 선분 $\\mathrm{PA}$의 길이는? (단, 점 $\\mathrm{A}$의 $x$좌표는 음수이다.)\n\n[그림: 좌표평면 위에 타원 $\\frac{x^2}{36}+\\frac{y^2}{20}=1$의 두 초점 $\\mathrm{A}(-4, 0), \\mathrm{F}(4, 0)$과, 점 $\\mathrm{F}$를 중심으로 하고 반지름이 4인 원 $(x-4)^2+y^2=16$이 그려져 있으며, 타원과 원의 제1사분면 교점이 $\\mathrm{P}$로 표시되어 있다.]",
    "choices": [
      "6",
      "7",
      "8",
      "9",
      "10"
    ],
    "answer": "③",
    "solution": "1단계: 타원의 두 초점과 장축의 길이 구하기\n타원의 방정식 $\\frac{x^2}{36} + \\frac{y^2}{20} = 1$에서 $a^2=36, b^2=20$이므로 $a=6$이다.\n초점거리 $c$는 $c^2 = a^2 - b^2 = 36 - 20 = 16$에서 $c=4$이다.\n점 $\\mathrm{A}$의 $x$좌표가 음수이므로 두 초점은 $\\mathrm{A}(-4, 0), \\mathrm{F}(4, 0)$이다.\n2단계: 원의 방정식에서 선분 $\\mathrm{PF}$의 길이 파악하기\n주어진 원의 방정식은 $(x-4)^2 + y^2 = 16 = 4^2$이다.\n이 원의 중심은 초점 $\\mathrm{F}(4, 0)$이고 반지름의 길이는 $4$이다.\n점 $\\mathrm{P}$는 이 원 위의 점이므로 중심 $\\mathrm{F}$로부터 점 $\\mathrm{P}$까지의 거리는 반지름과 같다.\n즉, $\\overline{\\mathrm{PF}} = 4$이다.\n3단계: 타원의 정의를 적용하여 선분 $\\mathrm{PA}$의 길이 계산하기\n점 $\\mathrm{P}$는 타원 위의 점이므로 타원의 정의에 의해 두 초점까지의 거리의 합은 장축의 길이인 $2a = 2 \\times 6 = 12$이다.\n$\\overline{\\mathrm{PA}} + \\overline{\\mathrm{PF}} = 12$\n여기에 $\\overline{\\mathrm{PF}} = 4$를 대입하면\n$\\overline{\\mathrm{PA}} + 4 = 12 \\implies \\overline{\\mathrm{PA}} = 8$이다.\n따라서 정답은 ③이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-GEO-RPM-041",
    "problemTypeKey": "PT_GEO_ELLIPSE",
    "templateKey": "TPL_GEO_ELLIPSE_WITH_CURVE",
    "crossConceptKeys": [
      "CC_CIRCLE_CENTER_RADIUS"
    ],
    "conditionKeys": [
      "COND_NEGATIVE"
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
    "content": "그림과 같이 두 초점이 $\\mathrm{F, F'}$인 타원 $\\frac{x^2}{81} + \\frac{y^2}{17} = 1$과 자연수 $n$ ($1 \\le n \\le 8$)에 대하여 원 $(x-8)^2 + y^2 = n^2$이 타원과 만나는 두 점 중 한 점을 $\\mathrm{P}_n$이라 할 때, $\\sum_{n=1}^{8} \\overline{\\mathrm{P}_n \\mathrm{F'}}$의 값은? (단, 점 $\\mathrm{F'}$의 $x$좌표는 음수이다.)\n\n[그림: 좌표평면 위에 타원 $\\frac{x^2}{81}+\\frac{y^2}{17}=1$의 두 초점 $\\mathrm{F'}(-8, 0), \\mathrm{F}(8, 0)$이 있고, 점 $\\mathrm{F}(8, 0)$을 중심으로 하는 원과 타원이 만나는 점 $\\mathrm{P}_n$이 표시되어 있다.]",
    "choices": [
      "104",
      "108",
      "112",
      "116",
      "120"
    ],
    "answer": "②",
    "solution": "1단계: 타원의 초점과 장축의 길이 구하기\n타원 $\\frac{x^2}{81} + \\frac{y^2}{17} = 1$에서 $a^2=81, b^2=17$이므로 $a=9$이다.\n장축의 길이는 $2a = 18$이다.\n초점거리 $c$는 $c^2 = a^2 - b^2 = 81 - 17 = 64$에서 $c=8$이다.\n점 $\\mathrm{F'}$의 $x$좌표가 음수이므로 두 초점은 $\\mathrm{F'}(-8, 0), \\mathrm{F}(8, 0)$이다.\n2단계: 원의 방정식으로부터 선분 $\\overline{\\mathrm{P}_n \\mathrm{F}}$의 길이 구하기\n원 $(x-8)^2 + y^2 = n^2$은 중심이 초점 $\\mathrm{F}(8, 0)$이고 반지름의 길이가 $n$이다.\n점 $\\mathrm{P}_n$은 이 원 위의 점이므로 $\\overline{\\mathrm{P}_n \\mathrm{F}} = n$이다.\n3단계: 타원의 정의를 적용하여 $\\overline{\\mathrm{P}_n \\mathrm{F'}}$을 $n$에 대한 식으로 나타내기\n점 $\\mathrm{P}_n$은 타원 위의 점이므로 타원의 정의에 의해 $\\overline{\\mathrm{P}_n \\mathrm{F'}} + \\overline{\\mathrm{P}_n \\mathrm{F}} = 2a = 18$이다.\n따라서 $\\overline{\\mathrm{P}_n \\mathrm{F'}} = 18 - \\overline{\\mathrm{P}_n \\mathrm{F}} = 18 - n$이다.\n4단계: 시그마 합 공식으로 총합 계산하기\n자연수의 거듭제곱의 합 공식을 적용하면\n$\\sum_{n=1}^{8} \\overline{\\mathrm{P}_n \\mathrm{F'}} = \\sum_{n=1}^{8} (18 - n) = \\sum_{n=1}^{8} 18 - \\sum_{n=1}^{8} n$\n$= 18 \\times 8 - \\frac{8 \\times 9}{2} = 144 - 36 = 108$이다.\n따라서 정답은 ②이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-GEO-RPM-041",
    "problemTypeKey": "PT_GEO_ELLIPSE",
    "templateKey": "TPL_GEO_ELLIPSE_WITH_CURVE",
    "crossConceptKeys": [
      "CC_CIRCLE_CENTER_RADIUS"
    ],
    "conditionKeys": [
      "COND_NATURAL_NUMBER",
      "COND_RANGE"
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
    "content": "그림과 같이 두 점 $\\mathrm{F}(c, 0), \\mathrm{F'}(-c, 0)$ ($c>0$)을 초점으로 하고 장축의 길이가 $6$인 타원이 있다. 점 $\\mathrm{F}$를 중심으로 하고 반지름의 길이가 $c$인 원이 타원과 점 $\\mathrm{P}$에서 만난다. 점 $\\mathrm{P}$에서 이 원에 그은 접선이 점 $\\mathrm{F'}$을 지날 때, $c$의 값은?\n\n[그림: 좌표평면 위에 두 초점 $\\mathrm{F}(c, 0), \\mathrm{F'}(-c, 0)$을 갖는 타원이 있고, 점 $\\mathrm{F}$를 중심으로 하고 반지름이 $c$인 원 위의 점 $\\mathrm{P}$에서 그은 접선이 점 $\\mathrm{F'}$을 지나는 모습이 그려져 있다.]",
    "choices": [
      "\\sqrt{3}-1",
      "\\frac{3\\sqrt{3}-3}{2}",
      "2\\sqrt{3}-2",
      "3\\sqrt{3}-3",
      "4\\sqrt{3}-4"
    ],
    "answer": "④",
    "solution": "1단계: 접선의 성질로부터 직각삼각형 파악하기\n점 $\\mathrm{P}$에서 원에 그은 접선이 점 $\\mathrm{F'}$을 지나므로, 접선 $\\mathrm{PF'}$과 원의 반지름 $\\mathrm{PF}$는 수직이다.\n즉, $\\angle \\mathrm{F'PF} = 90^\\circ$이다.\n따라서 삼각형 $\\mathrm{F'PF}$는 빗변이 $\\mathrm{F'F}$인 직각삼각형이다.\n2단계: 주어진 조건과 타원의 정의로 각 변의 길이 표현하기\n원의 반지름이 $c$이므로 $\\overline{\\mathrm{PF}} = c$이다.\n두 초점 사이의 거리는 $\\overline{\\mathrm{F'F}} = 2c$이다.\n타원의 장축의 길이가 $6$이므로 타원의 정의에 의해 $\\overline{\\mathrm{PF'}} + \\overline{\\mathrm{PF}} = 6$이다.\n따라서 $\\overline{\\mathrm{PF'}} = 6 - \\overline{\\mathrm{PF}} = 6 - c$이다.\n3단계: 피타고라스 정리를 적용하여 $c$에 대한 이차방정식 세우기\n직각삼각형 $\\mathrm{F'PF}$에서 피타고라스 정리에 의해\n$\\overline{\\mathrm{PF'}}^2 + \\overline{\\mathrm{PF}}^2 = \\overline{\\mathrm{F'F}}^2$\n$(6 - c)^2 + c^2 = (2c)^2$\n좌변을 전개하면 $36 - 12c + c^2 + c^2 = 4c^2 \\implies 2c^2 - 12c + 36 = 4c^2$\n우변으로 이항하여 정리하면 $2c^2 + 12c - 36 = 0$\n양변을 $2$로 나누면 $c^2 + 6c - 18 = 0$이다.\n4단계: 근의 공식으로 $c$의 값 구하기\n근의 공식(짝수 공식)을 적용하면\n$c = -3 \\pm \\sqrt{3^2 - 1 \\times (-18)} = -3 \\pm \\sqrt{9 + 18} = -3 \\pm \\sqrt{27} = -3 \\pm 3\\sqrt{3}$\n$c > 0$이어야 하므로 $c = 3\\sqrt{3} - 3$이다.\n주의: 접선과 접점을 지나는 반지름이 수직을 이룸을 파악하는 것이 핵심이다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B45",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-GEO-RPM-041",
    "problemTypeKey": "PT_GEO_ELLIPSE",
    "templateKey": "TPL_GEO_ELLIPSE_WITH_CURVE",
    "crossConceptKeys": [
      "CC_CIRCLE_TANGENT_PROPERTY",
      "CC_PYTHAGOREAN"
    ],
    "conditionKeys": [
      "COND_POSITIVE"
    ],
    "integrationPattern": "INTERDEPENDENT"
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
    "content": "그림과 같이 타원 $\\frac{x^2}{25} + \\frac{y^2}{9} = 1$의 두 초점을 $\\mathrm{F, F'}$이라 하자. $y$축 위의 점 $\\mathrm{A}(0, k)$ ($k > 3$)에 대하여 선분 $\\mathrm{AF'}$이 타원과 만나는 점을 $\\mathrm{P}$라 할 때, 점 $\\mathrm{P}$를 중심으로 하고 점 $\\mathrm{A}$를 지나는 원이 점 $\\mathrm{F}$를 지난다. 이때 $k$의 값은?\n\n[그림: 좌표평면 위에 타원 $\\frac{x^2}{25}+\\frac{y^2}{9}=1$의 두 초점 $\\mathrm{F, F'}$과 $y$축 위의 점 $\\mathrm{A}(0, k)$가 있고, 선분 $\\mathrm{AF'}$과 타원의 교점 $\\mathrm{P}$를 중심으로 하고 점 $\\mathrm{A}$와 $\\mathrm{F}$를 지나는 원이 그려져 있다.]",
    "choices": [
      "2\\sqrt{21}",
      "3\\sqrt{10}",
      "4\\sqrt{6}",
      "10",
      "2\\sqrt{26}"
    ],
    "answer": "①",
    "solution": "1단계: 타원의 초점과 장축의 길이 구하기\n타원 $\\frac{x^2}{25} + \\frac{y^2}{9} = 1$에서 $a^2=25, b^2=9$이므로 $a=5$이다.\n장축의 길이는 $2a = 10$이다.\n초점거리 $c$는 $c^2 = a^2 - b^2 = 25 - 9 = 16$에서 $c=4$이다.\n따라서 두 초점은 $\\mathrm{F'}(-4, 0), \\mathrm{F}(4, 0)$이다.\n2단계: 원의 성질과 타원의 정의로부터 선분 $\\mathrm{AF'}$의 길이 구하기\n점 $\\mathrm{P}$를 중심으로 하는 원이 점 $\\mathrm{A}$와 점 $\\mathrm{F}$를 지나므로 반지름의 길이가 같다. 즉 $\\overline{\\mathrm{PA}} = \\overline{\\mathrm{PF}}$이다.\n점 $\\mathrm{P}$는 선분 $\\mathrm{AF'}$ 위의 점이므로 $\\overline{\\mathrm{AF'}} = \\overline{\\mathrm{PA}} + \\overline{\\mathrm{PF'}}$이다.\n$\\overline{\\mathrm{PA}} = \\overline{\\mathrm{PF}}$를 대입하면 $\\overline{\\mathrm{AF'}} = \\overline{\\mathrm{PF}} + \\overline{\\mathrm{PF'}}$이다.\n점 $\\mathrm{P}$는 타원 위의 점이므로 타원의 정의에 의해 $\\overline{\\mathrm{PF}} + \\overline{\\mathrm{PF'}} = 2a = 10$이다.\n따라서 $\\overline{\\mathrm{AF'}} = 10$이다.\n3단계: 직각삼각형 $\\mathrm{AOF'}$에서 피타고라스 정리 적용하기\n점 $\\mathrm{A}(0, k)$와 점 $\\mathrm{F'}(-4, 0)$ 사이의 거리는\n$\\overline{\\mathrm{AF'}}^2 = (0 - (-4))^2 + (k - 0)^2 = 4^2 + k^2 = 16 + k^2$이다.\n$\\overline{\\mathrm{AF'}} = 10$이므로\n$16 + k^2 = 10^2 = 100 \\implies k^2 = 100 - 16 = 84$이다.\n$k > 3$이므로 $k = \\sqrt{84} = 2\\sqrt{21}$이다.\n주의: $\\overline{\\mathrm{PA}}=\\overline{\\mathrm{PF}}$임을 이용하여 $\\overline{\\mathrm{AF'}}$이 타원의 장축의 길이와 같음을 이끌어내는 것이 핵심이다.\n따라서 정답은 ①이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-GEO-RPM-041",
    "problemTypeKey": "PT_GEO_ELLIPSE",
    "templateKey": "TPL_GEO_ELLIPSE_WITH_CURVE",
    "crossConceptKeys": [
      "CC_CIRCLE_CENTER_RADIUS",
      "CC_DISTANCE_TWO_POINTS"
    ],
    "conditionKeys": [
      "COND_LOWER_BOUND"
    ],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 7,
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
    "content": "타원 $\\frac{x^2}{a^2} + \\frac{y^2}{b^2} = 1$의 두 초점 $\\mathrm{F}(4, 0), \\mathrm{F'}(-4, 0)$에 대하여 선분 $\\mathrm{F'F}$를 지름으로 하는 원이 있다. 타원과 원의 교점 중 제1사분면에 있는 점을 $\\mathrm{P}$라 하자. 원 위의 점 $\\mathrm{P}$에서의 접선이 $x$축의 양의 방향과 이루는 각의 크기가 $\\frac{5\\pi}{6}$일 때, 타원의 장축의 길이는? (단, $a, b$는 $0 < \\sqrt{2b} < a$인 상수이다.)\n\n[그림: 좌표평면 위에 두 초점 $\\mathrm{F}(4, 0), \\mathrm{F'}(-4, 0)$을 지름의 양 끝점으로 하는 원과 타원 $\\frac{x^2}{a^2}+\\frac{y^2}{b^2}=1$이 제1사분면의 점 $\\mathrm{P}$에서 만나고, 점 $\\mathrm{P}$에서의 접선이 $x$축의 양의 방향과 이루는 각이 $\\frac{5\\pi}{6}$로 표시되어 있다.]",
    "choices": [
      "4+4\\sqrt{3}",
      "5+4\\sqrt{3}",
      "4+5\\sqrt{3}",
      "6+4\\sqrt{3}",
      "5+5\\sqrt{3}"
    ],
    "answer": "①",
    "solution": "1단계: 원의 방정식 및 접선의 기울기 분석하기\n선분 $\\mathrm{F'F}$의 중점은 원점 $\\mathrm{O}(0, 0)$이고, 초점이 $\\mathrm{F}(4, 0), \\mathrm{F'}(-4, 0)$이므로 원의 반지름은 $r = 4$이다.\n따라서 원의 방정식은 $x^2 + y^2 = 16$이다.\n원 위의 점 $\\mathrm{P}$에서의 접선이 $x$축의 양의 방향과 이루는 각이 $\\frac{5\\pi}{6}$이므로 접선의 기울기는 $\\tan \\frac{5\\pi}{6} = -\\frac{1}{\\sqrt{3}}$이다.\n2단계: 반지름 $\\mathrm{OP}$의 방향각 및 점 $\\mathrm{P}$의 위치 파악하기\n원의 중심 $\\mathrm{O}$와 접점 $\\mathrm{P}$를 잇는 직선 $\\mathrm{OP}$는 접선과 수직이다.\n두 직선의 기울기의 곱은 $-1$이므로 직선 $\\mathrm{OP}$의 기울기는 $\\sqrt{3}$이다.\n점 $\\mathrm{P}$는 제1사분면의 점이므로 동경 $\\mathrm{OP}$가 $x$축의 양의 방향과 이루는 각은 $\\frac{\\pi}{3} (60^\\circ)$이다.\n3단계: $\\overline{\\mathrm{PF}}$와 $\\overline{\\mathrm{PF'}}$의 길이 계산하기\n삼각형 $\\mathrm{OPF}$에서 $\\overline{\\mathrm{OP}} = 4, \\overline{\\mathrm{OF}} = 4$이고 $\\angle \\mathrm{POF} = 60^\\circ$이므로 삼각형 $\\mathrm{OPF}$는 정삼각형이다.\n따라서 $\\overline{\\mathrm{PF}} = 4$이다.\n또한 $\\angle \\mathrm{F'OP} = 180^\\circ - 60^\\circ = 120^\\circ$이므로 삼각형 $\\mathrm{F'OP}$에서 코사인법칙을 적용하면\n$\\overline{\\mathrm{PF'}}^2 = \\overline{\\mathrm{OF'}}^2 + \\overline{\\mathrm{OP}}^2 - 2 \\times \\overline{\\mathrm{OF'}} \\times \\overline{\\mathrm{OP}} \\times \\cos 120^\\circ$\n$= 4^2 + 4^2 - 2 \\times 4 \\times 4 \\times \\left(-\\frac{1}{2}\\right) = 16 + 16 + 16 = 48$\n$\\overline{\\mathrm{PF'}} = \\sqrt{48} = 4\\sqrt{3}$이다.\n4단계: 타원의 정의를 이용하여 장축의 길이 구하기\n타원의 장축의 길이는 타원의 정의에 의해 두 초점으로부터의 거리의 합인 $\\overline{\\mathrm{PF}} + \\overline{\\mathrm{PF'}}$이다.\n따라서 장축의 길이는 $4 + 4\\sqrt{3}$이다.\n따라서 정답은 ①이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B45",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-GEO-RPM-041",
    "problemTypeKey": "PT_GEO_ELLIPSE",
    "templateKey": "TPL_GEO_ELLIPSE_WITH_CURVE",
    "crossConceptKeys": [
      "CC_CIRCLE_CENTER_RADIUS",
      "CC_PERPENDICULAR",
      "CC_TRIG_RATIO"
    ],
    "conditionKeys": [
      "COND_INEQUALITY_CONSTRAINT"
    ],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 8,
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
    "content": "두 초점이 $\\mathrm{F, F'}$이고 장축의 길이가 $2a$인 타원이 있다. 이 타원의 한 꼭짓점을 중심으로 하고 반지름의 길이가 $1$인 원이 이 타원의 서로 다른 두 꼭짓점과 한 초점을 지날 때, 타원의 장축의 길이는?\n\n[그림: 좌표평면 위에 두 초점이 $\\mathrm{F, F'}$인 타원의 꼭짓점 $(-a, 0)$을 중심으로 하고 반지름이 1인 원이 타원의 꼭짓점 $(0, b), (0, -b)$와 초점 $\\mathrm{F'}$을 동시에 지나는 모습이 그려져 있다.]",
    "choices": [
      "\\sqrt{2}",
      "2\\sqrt{3}-2",
      "\\frac{3}{2}",
      "\\sqrt{3}",
      "2"
    ],
    "answer": "②",
    "solution": "1단계: 타원과 원의 중심 좌표 설정하기\n타원의 방정식을 $\\frac{x^2}{a^2} + \\frac{y^2}{b^2} = 1$ ($a > b > 0$)이라 하자.\n초점은 $\\mathrm{F}(c, 0), \\mathrm{F'}(-c, 0)$ ($c > 0$)이고, 네 꼭짓점은 $(\\pm a, 0), (0, \\pm b)$이다.\n대칭성에 의해 원의 중심을 꼭짓점 $(-a, 0)$이라 두어도 일반성을 잃지 않는다.\n2단계: 원이 지나는 꼭짓점과 초점의 조건식 세우기\n원의 중심 $(-a, 0)$에서 타원의 서로 다른 두 꼭짓점 $(0, b), (0, -b)$까지의 거리가 반지름 $1$이어야 하므로\n$(-a - 0)^2 + (0 - b)^2 = 1^2 \\implies a^2 + b^2 = 1$이다. ······ ㉠\n또한 원이 초점 $\\mathrm{F'}(-c, 0)$을 지나므로 중심 $(-a, 0)$에서 초점 $(-c, 0)$까지의 거리도 반지름 $1$이다.\n$a > c$이므로 $a - c = 1 \\implies c = a - 1$이다. ······ ㉡\n3단계: 타원의 기본 성질을 대입하여 $a$에 대한 이차방정식 유도하기\n타원에서 $b^2 = a^2 - c^2$이므로 ㉠에 대입하면\n$a^2 + (a^2 - c^2) = 1 \\implies 2a^2 - c^2 = 1$이다.\n여기에 ㉡의 $c = a - 1$을 대입하면\n$2a^2 - (a - 1)^2 = 1$\n$2a^2 - (a^2 - 2a + 1) = 1 \\implies a^2 + 2a - 2 = 0$이다.\n4단계: 근의 공식으로 $a$를 구하고 장축의 길이 계산하기\n근의 공식을 적용하면 $a = -1 \\pm \\sqrt{1^2 - 1 \\times (-2)} = -1 \\pm \\sqrt{3}$이다.\n$a > 0$이므로 $a = \\sqrt{3} - 1$이다.\n타원의 장축의 길이는 $2a$이므로\n$2a = 2(\\sqrt{3} - 1) = 2\\sqrt{3} - 2$이다.\n주의: 문제에서 묻는 대상이 $a$의 값이 아닌 장축의 길이 $2a$임에 유의한다.\n따라서 정답은 ②이다.",
    "difficultyBucket": 5,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B45",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-GEO-RPM-041",
    "problemTypeKey": "PT_GEO_ELLIPSE",
    "templateKey": "TPL_GEO_ELLIPSE_WITH_CURVE",
    "crossConceptKeys": [
      "CC_CIRCLE_CENTER_RADIUS",
      "CC_DISTANCE_TWO_POINTS"
    ],
    "conditionKeys": [],
    "integrationPattern": "INTERDEPENDENT"
  }
];
