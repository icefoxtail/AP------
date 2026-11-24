window.examTitle = "기하_181_삼각형의모양구하기_고2_유형은행1";

window.questionBank = [
  {
    "id": 1,
    "category": "공간좌표 핵심 개념",
    "standardCourse": "기하",
    "curriculum": "2022",
    "standardUnitKey": "H22-GE-04",
    "standardUnit": "공간좌표",
    "standardUnitOrder": 4,
    "subUnitKey": "H22-GE-04-CORE",
    "subUnit": "공간좌표 핵심 개념",
    "subUnitConfidence": "candidate_evidence",
    "subUnitClassificationDepth": "complete_candidate",
    "conceptClusterKey": "H22-GE-04-CORE",
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "공간좌표 핵심 개념"
    ],
    "wide": false,
    "content": "세 점 $\\mathrm{A}(3, 1, 1)$, $\\mathrm{B}(4, 0, 5)$, $\\mathrm{C}(2, -1, 3)$을 꼭짓점으로 하는 삼각형 $\\mathrm{ABC}$는 어떤 삼각형인가?",
    "choices": [
      "정삼각형",
      "$\\angle\\mathrm{BAC}=90^\\circ$인 직각삼각형",
      "$\\angle\\mathrm{ABC}=90^\\circ$인 직각삼각형",
      "$\\angle\\mathrm{BAC}=90^\\circ$인 직각이등변삼각형",
      "$\\angle\\mathrm{BCA}=90^\\circ$인 직각이등변삼각형"
    ],
    "answer": "⑤",
    "solution": "삼각형 $\\mathrm{ABC}$의 세 변의 길이의 제곱을 각각 구하면\n$$\\overline{\\mathrm{AB}}^2=(4-3)^2+(0-1)^2+(5-1)^2=1+1+16=18$$\n$$\\overline{\\mathrm{BC}}^2=(2-4)^2+(-1-0)^2+(3-5)^2=4+1+4=9$$\n$$\\overline{\\mathrm{CA}}^2=(3-2)^2+(1+1)^2+(1-3)^2=1+4+4=9$$\n따라서 $\\overline{\\mathrm{BC}}=\\overline{\\mathrm{CA}}=3$이고 $\\overline{\\mathrm{BC}}^2+\\overline{\\mathrm{CA}}^2=\\overline{\\mathrm{AB}}^2$이므로 삼각형 $\\mathrm{ABC}$는 $\\angle\\mathrm{BCA}=90^\\circ$인 직각이등변삼각형이다.\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-GEO-RPM-060",
    "problemTypeKey": "PT_GEO_SPACE_COORDINATE",
    "templateKey": "TPL_GEO_SPACE_COORD_DISTANCE",
    "crossConceptKeys": [
      "CC_DISTANCE_TWO_POINTS",
      "CC_PYTHAGOREAN",
      "CC_ISOSCELES_TRIANGLE"
    ],
    "conditionKeys": [],
    "integrationPattern": "INTERDEPENDENT"
  },
  {
    "id": 2,
    "category": "공간좌표 핵심 개념",
    "standardCourse": "기하",
    "curriculum": "2022",
    "standardUnitKey": "H22-GE-04",
    "standardUnit": "공간좌표",
    "standardUnitOrder": 4,
    "subUnitKey": "H22-GE-04-CORE",
    "subUnit": "공간좌표 핵심 개념",
    "subUnitConfidence": "candidate_evidence",
    "subUnitClassificationDepth": "complete_candidate",
    "conceptClusterKey": "H22-GE-04-CORE",
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "공간좌표 핵심 개념"
    ],
    "wide": false,
    "content": "좌표공간의 세 점 $\\mathrm{A}(3, 0, 4)$, $\\mathrm{B}(0, 4, 4)$, $\\mathrm{C}(1, a, 2)$를 꼭짓점으로 하는 삼각형 $\\mathrm{ABC}$가 $\\overline{\\mathrm{AB}}=\\overline{\\mathrm{BC}}$인 이등변삼각형일 때, 모든 실수 $a$의 값의 합은?",
    "choices": [
      "$6$",
      "$8$",
      "$10$",
      "$12$",
      "$14$"
    ],
    "answer": "②",
    "solution": "$\\overline{\\mathrm{AB}}^2=(0-3)^2+(4-0)^2+(4-4)^2=9+16+0=25$\n$$\\overline{\\mathrm{BC}}^2=(1-0)^2+(a-4)^2+(2-4)^2=a^2-8a+21$$\n$\\overline{\\mathrm{AB}}=\\overline{\\mathrm{BC}}$이므로 $\\overline{\\mathrm{AB}}^2=\\overline{\\mathrm{BC}}^2$에서\n$$a^2-8a+21=25 \\implies a^2-8a-4=0$$\n이 이차방정식의 판별식을 $D$라 하면 $\\frac{D}{4}=(-4)^2-1\\cdot(-4)=20>0$이므로 서로 다른 두 실근을 갖는다.\n또한 직선 $\\mathrm{AB}$ 위의 점은 모두 $z$좌표가 $4$이므로 $z$좌표가 $2$인 점 $\\mathrm{C}$는 세 점이 일직선 위에 있지 않게 한다.\n근과 계수의 관계에 의하여 모든 실수 $a$의 값의 합은 $8$이다.\n따라서 정답은 ②이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-GEO-RPM-060",
    "problemTypeKey": "PT_GEO_SPACE_COORDINATE",
    "templateKey": "TPL_GEO_SPACE_COORD_DISTANCE",
    "crossConceptKeys": [
      "CC_DISTANCE_TWO_POINTS",
      "CC_ISOSCELES_TRIANGLE"
    ],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 3,
    "category": "공간좌표 핵심 개념",
    "standardCourse": "기하",
    "curriculum": "2022",
    "standardUnitKey": "H22-GE-04",
    "standardUnit": "공간좌표",
    "standardUnitOrder": 4,
    "subUnitKey": "H22-GE-04-CORE",
    "subUnit": "공간좌표 핵심 개념",
    "subUnitConfidence": "candidate_evidence",
    "subUnitClassificationDepth": "complete_candidate",
    "conceptClusterKey": "H22-GE-04-CORE",
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "공간좌표 핵심 개념"
    ],
    "wide": false,
    "content": "두 점 $\\mathrm{A}(1, 2, -1)$, $\\mathrm{B}(3, 3, -4)$와 $x$축 위의 점 $\\mathrm{C}$에 대하여 삼각형 $\\mathrm{ABC}$가 $\\angle\\mathrm{A}=90^\\circ$인 직각삼각형일 때, 선분 $\\mathrm{OC}$의 길이는? (단, $\\mathrm{O}$는 원점)",
    "choices": [
      "$2$",
      "$\\frac{5}{2}$",
      "$3$",
      "$\\frac{7}{2}$",
      "$4$"
    ],
    "answer": "④",
    "solution": "$x$축 위의 점 $\\mathrm{C}$의 좌표를 $(a, 0, 0)$이라 하자.\n$$\\overline{\\mathrm{AB}}^2=(3-1)^2+(3-2)^2+(-4+1)^2=4+1+9=14$$\n$$\\overline{\\mathrm{AC}}^2=(a-1)^2+(0-2)^2+(0+1)^2=a^2-2a+6$$\n$$\\overline{\\mathrm{BC}}^2=(a-3)^2+(0-3)^2+(0+4)^2=a^2-6a+34$$\n$\\angle\\mathrm{A}=90^\\circ$이므로 피타고라스 정리에 의하여 $\\overline{\\mathrm{AB}}^2+\\overline{\\mathrm{AC}}^2=\\overline{\\mathrm{BC}}^2$이다.\n$$14+(a^2-2a+6)=a^2-6a+34$$\n$$4a=14 \\quad \\therefore a=\\frac{7}{2}$$\n따라서 점 $\\mathrm{C}$의 좌표는 $\\left(\\frac{7}{2}, 0, 0\\right)$이므로 $\\overline{\\mathrm{OC}}=\\frac{7}{2}$이다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-GEO-RPM-060",
    "problemTypeKey": "PT_GEO_SPACE_COORDINATE",
    "templateKey": "TPL_GEO_SPACE_COORD_DISTANCE",
    "crossConceptKeys": [
      "CC_DISTANCE_TWO_POINTS",
      "CC_PYTHAGOREAN"
    ],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 4,
    "category": "공간좌표 핵심 개념",
    "standardCourse": "기하",
    "curriculum": "2022",
    "standardUnitKey": "H22-GE-04",
    "standardUnit": "공간좌표",
    "standardUnitOrder": 4,
    "subUnitKey": "H22-GE-04-CORE",
    "subUnit": "공간좌표 핵심 개념",
    "subUnitConfidence": "candidate_evidence",
    "subUnitClassificationDepth": "complete_candidate",
    "conceptClusterKey": "H22-GE-04-CORE",
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "공간좌표 핵심 개념"
    ],
    "wide": false,
    "content": "두 점 $\\mathrm{A}(2, 3, 2)$, $\\mathrm{B}(4, 2, 1)$과 $y$축 위의 점 $\\mathrm{C}$를 세 꼭짓점으로 하는 삼각형 $\\mathrm{ABC}$가 변 $\\mathrm{AC}$를 빗변으로 하는 직각삼각형일 때, 점 $\\mathrm{C}$의 $y$좌표는?",
    "choices": [
      "$-6$",
      "$-5$",
      "$-4$",
      "$-3$",
      "$-2$"
    ],
    "answer": "②",
    "solution": "$y$축 위의 점 $\\mathrm{C}$의 좌표를 $(0, b, 0)$이라 하자.\n$$\\overline{\\mathrm{AB}}^2=(4-2)^2+(2-3)^2+(1-2)^2=4+1+1=6$$\n$$\\overline{\\mathrm{BC}}^2=(0-4)^2+(b-2)^2+(0-1)^2=b^2-4b+21$$\n$$\\overline{\\mathrm{AC}}^2=(0-2)^2+(b-3)^2+(0-2)^2=b^2-6b+17$$\n변 $\\mathrm{AC}$가 빗변이므로 $\\overline{\\mathrm{AB}}^2+\\overline{\\mathrm{BC}}^2=\\overline{\\mathrm{AC}}^2$이다.\n$$6+(b^2-4b+21)=b^2-6b+17$$\n$$2b=-10 \\quad \\therefore b=-5$$\n따라서 점 $\\mathrm{C}$의 $y$좌표는 $-5$이다.\n따라서 정답은 ②이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-GEO-RPM-060",
    "problemTypeKey": "PT_GEO_SPACE_COORDINATE",
    "templateKey": "TPL_GEO_SPACE_COORD_DISTANCE",
    "crossConceptKeys": [
      "CC_DISTANCE_TWO_POINTS",
      "CC_PYTHAGOREAN"
    ],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 5,
    "category": "공간좌표 핵심 개념",
    "standardCourse": "기하",
    "curriculum": "2022",
    "standardUnitKey": "H22-GE-04",
    "standardUnit": "공간좌표",
    "standardUnitOrder": 4,
    "subUnitKey": "H22-GE-04-CORE",
    "subUnit": "공간좌표 핵심 개념",
    "subUnitConfidence": "candidate_evidence",
    "subUnitClassificationDepth": "complete_candidate",
    "conceptClusterKey": "H22-GE-04-CORE",
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "공간좌표 핵심 개념"
    ],
    "wide": false,
    "content": "좌표공간에서 두 점 $\\mathrm{A}(2, -1, 4)$, $\\mathrm{B}(-2, 1, 0)$과 점 $\\mathrm{P}$에 대하여 삼각형 $\\mathrm{ABP}$가 정삼각형일 때, 점 $\\mathrm{P}$가 나타내는 도형의 넓이는?",
    "choices": [
      "$18\\pi$",
      "$24\\pi$",
      "$27\\pi$",
      "$30\\pi$",
      "$36\\pi$"
    ],
    "answer": "③",
    "solution": "선분 $\\mathrm{AB}$의 길이는\n$$\\overline{\\mathrm{AB}}=\\sqrt{(-2-2)^2+(1+1)^2+(0-4)^2}=\\sqrt{16+4+16}=6$$\n선분 $\\mathrm{AB}$의 중점을 $\\mathrm{M}$이라 하면 삼각형 $\\mathrm{ABP}$가 정삼각형이므로 $\\overline{\\mathrm{PM}}\\perp\\overline{\\mathrm{AB}}$이고, 정삼각형의 높이는\n$$\\overline{\\mathrm{PM}}=\\frac{\\sqrt{3}}{2}\\overline{\\mathrm{AB}}=\\frac{\\sqrt{3}}{2}\\times 6=3\\sqrt{3}$$\n따라서 점 $\\mathrm{P}$가 나타내는 도형은 선분 $\\mathrm{AB}$의 중점 $\\mathrm{M}$을 지나고 직선 $\\mathrm{AB}$에 수직인 평면 위에서 중심이 $\\mathrm{M}$이고 반지름의 길이가 $3\\sqrt{3}$인 원이다.\n구하는 도형의 넓이는\n$$\\pi\\times(3\\sqrt{3})^2=27\\pi$$\n따라서 정답은 ③이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B45",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-GEO-RPM-060",
    "problemTypeKey": "PT_GEO_SPACE_COORDINATE",
    "templateKey": "TPL_GEO_SPACE_COORD_DISTANCE",
    "crossConceptKeys": [
      "CC_DISTANCE_TWO_POINTS",
      "CC_EQUILATERAL_TRIANGLE",
      "CC_AREA"
    ],
    "conditionKeys": [],
    "integrationPattern": "INTERDEPENDENT"
  },
  {
    "id": 6,
    "category": "공간좌표 핵심 개념",
    "standardCourse": "기하",
    "curriculum": "2022",
    "standardUnitKey": "H22-GE-04",
    "standardUnit": "공간좌표",
    "standardUnitOrder": 4,
    "subUnitKey": "H22-GE-04-CORE",
    "subUnit": "공간좌표 핵심 개념",
    "subUnitConfidence": "candidate_evidence",
    "subUnitClassificationDepth": "complete_candidate",
    "conceptClusterKey": "H22-GE-04-CORE",
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "공간좌표 핵심 개념"
    ],
    "wide": false,
    "content": "세 점 $\\mathrm{O}(0, 0, 0)$, $\\mathrm{A}(0, 0, 12)$, $\\mathrm{P}(x, y, z)$를 세 꼭짓점으로 하는 삼각형 $\\mathrm{OAP}$의 넓이가 $18$일 때, 점 $\\mathrm{P}$가 존재하는 영역의 넓이는? (단, $0\\le z\\le 12$)",
    "choices": [
      "$72\\pi$",
      "$84\\pi$",
      "$96\\pi$",
      "$108\\pi$",
      "$120\\pi$"
    ],
    "answer": "①",
    "solution": "선분 $\\mathrm{OA}$는 $z$축 위에 있고 $\\overline{\\mathrm{OA}}=12$이다.\n점 $\\mathrm{P}(x, y, z)$에서 $z$축에 내린 수선의 발을 $\\mathrm{H}(0, 0, z)$라 하면 $\\overline{\\mathrm{PH}}=\\sqrt{x^2+y^2}$이다.\n삼각형 $\\mathrm{OAP}$의 넓이가 $18$이므로\n$$\\frac{1}{2}\\times \\overline{\\mathrm{OA}}\\times \\overline{\\mathrm{PH}}=\\frac{1}{2}\\times 12\\times \\sqrt{x^2+y^2}=18$$\n$$\\sqrt{x^2+y^2}=3 \\implies x^2+y^2=9$$\n$0\\le z\\le 12$이므로 점 $\\mathrm{P}$가 존재하는 영역은 밑면의 반지름의 길이가 $3$이고 높이가 $12$인 원기둥의 옆면이다.\n따라서 구하는 넓이는\n$$(2\\pi\\times 3)\\times 12=72\\pi$$\n따라서 정답은 ①이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B45",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-GEO-RPM-060",
    "problemTypeKey": "PT_GEO_SPACE_COORDINATE",
    "templateKey": "TPL_GEO_SPACE_COORD_DISTANCE",
    "crossConceptKeys": [
      "CC_TRIANGLE_AREA",
      "CC_AREA"
    ],
    "conditionKeys": [
      "COND_RANGE"
    ],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 7,
    "category": "공간좌표 핵심 개념",
    "standardCourse": "기하",
    "curriculum": "2022",
    "standardUnitKey": "H22-GE-04",
    "standardUnit": "공간좌표",
    "standardUnitOrder": 4,
    "subUnitKey": "H22-GE-04-CORE",
    "subUnit": "공간좌표 핵심 개념",
    "subUnitConfidence": "candidate_evidence",
    "subUnitClassificationDepth": "complete_candidate",
    "conceptClusterKey": "H22-GE-04-CORE",
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "공간좌표 핵심 개념"
    ],
    "wide": false,
    "content": "두 점 $\\mathrm{A}(4, 2, -1)$, $\\mathrm{B}(1, 3, 1)$과 $zx$평면 위의 점 $\\mathrm{C}$에 대하여 삼각형 $\\mathrm{ABC}$가 정삼각형이 되도록 하는 점 $\\mathrm{C}$의 좌표가 $(a, b, c)$일 때, $a^2+b^2+c^2$의 값은? (단, $c>0$이다.)",
    "choices": [
      "$5$",
      "$7$",
      "$9$",
      "$11$",
      "$13$"
    ],
    "answer": "⑤",
    "solution": "점 $\\mathrm{C}$가 $zx$평면 위의 점이므로 $b=0$, 즉 $\\mathrm{C}(a, 0, c)$이다.\n$$\\overline{\\mathrm{AB}}^2=(1-4)^2+(3-2)^2+(1+1)^2=9+1+4=14$$\n삼각형 $\\mathrm{ABC}$가 정삼각형이므로 $\\overline{\\mathrm{AC}}^2=\\overline{\\mathrm{BC}}^2=14$이다.\n$\\overline{\\mathrm{AC}}^2=14$에서\n$$(a-4)^2+(0-2)^2+(c+1)^2=14 \\implies (a-4)^2+(c+1)^2=10 \\quad \\cdots\\cdots \\text{㉠}$$\n$\\overline{\\mathrm{BC}}^2=14$에서\n$$(a-1)^2+(0-3)^2+(c-1)^2=14 \\implies (a-1)^2+(c-1)^2=5 \\quad \\cdots\\cdots \\text{㉡}$$\n㉡에서 ㉠을 변끼리 빼면\n$$6a-4c-10=0 \\implies c=\\frac{3a-5}{2}$$\n이를 ㉡에 대입하면\n$$(a-1)^2+\\left(\\frac{3a-7}{2}\\right)^2=5$$\n$$4(a^2-2a+1)+(9a^2-42a+49)=20$$\n$$13a^2-50a+33=0 \\implies (a-3)(13a-11)=0$$\n$a=3$일 때 $c=2>0$이고, $a=\\frac{11}{13}$일 때 $c=-\\frac{16}{13}<0$이다.\n$c>0$이므로 $a=3$, $b=0$, $c=2$이다.\n$$a^2+b^2+c^2=3^2+0^2+2^2=13$$\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B45",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-GEO-RPM-060",
    "problemTypeKey": "PT_GEO_SPACE_COORDINATE",
    "templateKey": "TPL_GEO_SPACE_COORD_DISTANCE",
    "crossConceptKeys": [
      "CC_DISTANCE_TWO_POINTS",
      "CC_EQUILATERAL_TRIANGLE"
    ],
    "conditionKeys": [
      "COND_POSITIVE"
    ],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 8,
    "category": "공간좌표 핵심 개념",
    "standardCourse": "기하",
    "curriculum": "2022",
    "standardUnitKey": "H22-GE-04",
    "standardUnit": "공간좌표",
    "standardUnitOrder": 4,
    "subUnitKey": "H22-GE-04-CORE",
    "subUnit": "공간좌표 핵심 개념",
    "subUnitConfidence": "candidate_evidence",
    "subUnitClassificationDepth": "complete_candidate",
    "conceptClusterKey": "H22-GE-04-CORE",
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "공간좌표 핵심 개념"
    ],
    "wide": false,
    "content": "좌표공간의 세 점 $\\mathrm{A}(a, b, 0)$, $\\mathrm{B}(0, a, b)$, $\\mathrm{C}(b, 0, a)$에 대하여 $a+b=4$일 때, 삼각형 $\\mathrm{ABC}$의 넓이의 최솟값은? (단, $a>0$이고 $b>0$이다.)",
    "choices": [
      "$\\sqrt{3}$",
      "$2\\sqrt{2}$",
      "$2\\sqrt{3}$",
      "$3\\sqrt{2}$",
      "$3\\sqrt{3}$"
    ],
    "answer": "③",
    "solution": "세 변의 길이의 제곱을 각각 구하면\n$$\\overline{\\mathrm{AB}}^2=(0-a)^2+(a-b)^2+(b-0)^2=2(a^2-ab+b^2)$$\n$$\\overline{\\mathrm{BC}}^2=(b-0)^2+(0-a)^2+(a-b)^2=2(a^2-ab+b^2)$$\n$$\\overline{\\mathrm{CA}}^2=(a-b)^2+(b-0)^2+(0-a)^2=2(a^2-ab+b^2)$$\n따라서 삼각형 $\\mathrm{ABC}$는 정삼각형이고, 그 넓이 $S$는\n$$S=\\frac{\\sqrt{3}}{4}\\overline{\\mathrm{AB}}^2=\\frac{\\sqrt{3}}{2}(a^2-ab+b^2)=\\frac{\\sqrt{3}}{2}\\left\\{(a+b)^2-3ab\\right\\}$$\n$a+b=4$이므로\n$$S=\\frac{\\sqrt{3}}{2}(16-3ab)$$\n$a>0$, $b>0$이므로 산술평균과 기하평균의 관계에 의하여\n$$4=a+b\\ge 2\\sqrt{ab} \\implies ab\\le 4 \\quad (\\text{단, 등호는 } a=b=2\\text{일 때 성립})$$\n따라서 $16-3ab\\ge 16-12=4$이므로\n$$S\\ge \\frac{\\sqrt{3}}{2}\\times 4=2\\sqrt{3}$$\n즉, 삼각형 $\\mathrm{ABC}$의 넓이의 최솟값은 $2\\sqrt{3}$이다.\n따라서 정답은 ③이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B45",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-GEO-RPM-060",
    "problemTypeKey": "PT_GEO_SPACE_COORDINATE",
    "templateKey": "TPL_GEO_SPACE_COORD_DISTANCE",
    "crossConceptKeys": [
      "CC_DISTANCE_TWO_POINTS",
      "CC_TRIANGLE_AREA"
    ],
    "conditionKeys": [
      "COND_POSITIVE"
    ],
    "integrationPattern": "INTERDEPENDENT"
  }
];
