window.examTitle = "기하_130_도형에서내적의연산법칙의활용_고2_유형은행1";

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
    "content": "그림과 같이 $\\overline{\\text{AB}}=6$이고 $\\angle\\text{A}=90^\\circ$인 직각삼각형 $\\text{ABC}$에서 변 $\\text{BC}$를 $1:2$로 내분하는 점을 $\\text{D}$라 할 때, $\\vec{\\text{AD}} \\cdot \\vec{\\text{AB}}$의 값은? [그림: $\\angle\\text{A}=90^\\circ$인 직각삼각형 ABC에서 변 AB의 길이는 6이고, 변 BC 위에 점 B로부터의 거리와 점 C까지의 거리의 비가 1:2가 되도록 점 D를 잡고 선분 AD를 그은 그림]",
    "choices": [
      "$20$",
      "$24$",
      "$28$",
      "$32$",
      "$36$"
    ],
    "answer": "②",
    "solution": "[내분점의 위치벡터] 점 $\\text{D}$는 변 $\\text{BC}$를 $1:2$로 내분하므로 $\\vec{\\text{AD}} = \\frac{2\\vec{\\text{AB}} + \\vec{\\text{AC}}}{1+2} = \\frac{2}{3}\\vec{\\text{AB}} + \\frac{1}{3}\\vec{\\text{AC}}$이다.\n[내적의 분배법칙] 구하는 식에 대입하면 $\\vec{\\text{AD}} \\cdot \\vec{\\text{AB}} = \\left(\\frac{2}{3}\\vec{\\text{AB}} + \\frac{1}{3}\\vec{\\text{AC}}\\right) \\cdot \\vec{\\text{AB}} = \\frac{2}{3}|\\vec{\\text{AB}}|^2 + \\frac{1}{3}(\\vec{\\text{AC}} \\cdot \\vec{\\text{AB}})$이다.\n[직각의 성질] $\\angle\\text{A}=90^\\circ$이므로 $\\vec{\\text{AB}} \\perp \\vec{\\text{AC}}$이고, 두 벡터의 내적은 $\\vec{\\text{AC}} \\cdot \\vec{\\text{AB}} = 0$이다.\n[길이 대입] $|\\vec{\\text{AB}}| = 6$이므로 $|\\vec{\\text{AB}}|^2 = 6^2 = 36$이다.\n[계산] $\\vec{\\text{AD}} \\cdot \\vec{\\text{AB}} = \\frac{2}{3} \\times 36 + 0 = 24$이다.\n따라서 정답은 ②이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-GEO-RPM-076",
    "problemTypeKey": "PT_GEO_PLANE_VECTOR",
    "templateKey": "TPL_GEO_PLANE_VECTOR_DOT",
    "crossConceptKeys": [
      "CC_RIGHT_TRIANGLE",
      "CC_INTERNAL_DIVISION"
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
    "content": "그림과 같이 한 변의 길이가 $6$인 정삼각형 $\\text{ABC}$에서 변 $\\text{BC}$를 삼등분하는 점 중 점 $\\text{B}$에 가까운 점을 $\\text{P}$, 점 $\\text{C}$에 가까운 점을 $\\text{Q}$라 할 때, $\\vec{\\text{AP}} \\cdot \\vec{\\text{AQ}}$의 값은? [그림: 한 변의 길이가 6인 정삼각형 ABC에서 변 BC를 3등분하는 두 점 P, Q를 잡고(순서대로 B, P, Q, C), 꼭짓점 A에서 두 점 P, Q로 선분 AP, AQ를 그은 그림]",
    "choices": [
      "$20$",
      "$22$",
      "$24$",
      "$26$",
      "$28$"
    ],
    "answer": "④",
    "solution": "[정삼각형의 내적] 한 변의 길이가 $6$인 정삼각형이므로 $|\\vec{\\text{AB}}|=6, |\\vec{\\text{AC}}|=6$이고 $\\vec{\\text{AB}} \\cdot \\vec{\\text{AC}} = 6 \\times 6 \\times \\cos 60^\\circ = 36 \\times \\frac{1}{2} = 18$이다.\n[내분점의 위치벡터] 점 $\\text{P}$는 변 $\\text{BC}$를 $1:2$로 내분하므로 $\\vec{\\text{AP}} = \\frac{2}{3}\\vec{\\text{AB}} + \\frac{1}{3}\\vec{\\text{AC}}$이다.\n[내분점의 위치벡터] 점 $\\text{Q}$는 변 $\\text{BC}$를 $2:1$로 내분하므로 $\\vec{\\text{AQ}} = \\frac{1}{3}\\vec{\\text{AB}} + \\frac{2}{3}\\vec{\\text{AC}}$이다.\n[내적 식 전개] $\\vec{\\text{AP}} \\cdot \\vec{\\text{AQ}} = \\left(\\frac{2}{3}\\vec{\\text{AB}} + \\frac{1}{3}\\vec{\\text{AC}}\\right) \\cdot \\left(\\frac{1}{3}\\vec{\\text{AB}} + \\frac{2}{3}\\vec{\\text{AC}}\\right) = \\frac{2}{9}|\\vec{\\text{AB}}|^2 + \\frac{5}{9}(\\vec{\\text{AB}} \\cdot \\vec{\\text{AC}}) + \\frac{2}{9}|\\vec{\\text{AC}}|^2$이다.\n[값 대입 및 계산] $|\\vec{\\text{AB}}|^2 = 36, |\\vec{\\text{AC}}|^2 = 36, \\vec{\\text{AB}} \\cdot \\vec{\\text{AC}} = 18$을 대입하면 $\\frac{2}{9}(36) + \\frac{5}{9}(18) + \\frac{2}{9}(36) = 8 + 10 + 8 = 26$이다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-GEO-RPM-076",
    "problemTypeKey": "PT_GEO_PLANE_VECTOR",
    "templateKey": "TPL_GEO_PLANE_VECTOR_DOT",
    "crossConceptKeys": [
      "CC_EQUILATERAL_TRIANGLE"
    ],
    "conditionKeys": [],
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
    "content": "삼각형 $\\text{OAB}$에서 $|\\vec{\\text{OA}}|=3, |\\vec{\\text{OB}}|=4, |\\vec{\\text{AB}}|=3$이고 선분 $\\text{AB}$를 $1:2$로 내분하는 점을 $\\text{P}$라 할 때, $\\vec{\\text{OP}} \\cdot \\vec{\\text{AB}}$의 값은? [그림: 삼각형 OAB에서 OA=3, OB=4, AB=3이고 선분 AB 위에 AP:PB = 1:2가 되도록 점 P를 잡고 선분 OP를 그은 그림]",
    "choices": [
      "$2$",
      "$\\frac{5}{2}$",
      "$3$",
      "$\\frac{7}{2}$",
      "$4$"
    ],
    "answer": "①",
    "solution": "[벡터의 차와 크기의 제곱] $\\vec{\\text{AB}} = \\vec{\\text{OB}} - \\vec{\\text{OA}}$이므로 $|\\vec{\\text{AB}}|^2 = |\\vec{\\text{OB}} - \\vec{\\text{OA}}|^2 = |\\vec{\\text{OB}}|^2 - 2\\vec{\\text{OA}} \\cdot \\vec{\\text{OB}} + |\\vec{\\text{OA}}|^2$이다.\n[내적 계산] 주어진 크기를 대입하면 $3^2 = 4^2 - 2\\vec{\\text{OA}} \\cdot \\vec{\\text{OB}} + 3^2$이므로 $9 = 16 - 2\\vec{\\text{OA}} \\cdot \\vec{\\text{OB}} + 9$이다.\n[이항 및 정리] $2\\vec{\\text{OA}} \\cdot \\vec{\\text{OB}} = 16$에서 $\\vec{\\text{OA}} \\cdot \\vec{\\text{OB}} = 8$이다.\n[내분점의 위치벡터] 점 $\\text{P}$는 선분 $\\text{AB}$를 $1:2$로 내분하므로 $\\vec{\\text{OP}} = \\frac{2\\vec{\\text{OA}} + \\vec{\\text{OB}}}{3}$이다.\n[내적의 분배] $\\vec{\\text{OP}} \\cdot \\vec{\\text{AB}} = \\left(\\frac{2\\vec{\\text{OA}} + \\vec{\\text{OB}}}{3}\\right) \\cdot (\\vec{\\text{OB}} - \\vec{\\text{OA}}) = \\frac{1}{3}(|\\vec{\\text{OB}}|^2 - 2|\\vec{\\text{OA}}|^2 + \\vec{\\text{OA}} \\cdot \\vec{\\text{OB}})$이다.\n[수치 대입] $|\\vec{\\text{OB}}|^2 = 16, |\\vec{\\text{OA}}|^2 = 9, \\vec{\\text{OA}} \\cdot \\vec{\\text{OB}} = 8$을 대입하면 $\\frac{1}{3}(16 - 2(9) + 8) = \\frac{1}{3}(16 - 18 + 8) = \\frac{6}{3} = 2$이다.\n따라서 정답은 ①이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-GEO-RPM-076",
    "problemTypeKey": "PT_GEO_PLANE_VECTOR",
    "templateKey": "TPL_GEO_PLANE_VECTOR_DOT",
    "crossConceptKeys": [
      "CC_INTERNAL_DIVISION"
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
    "content": "그림과 같이 $\\overline{\\text{AB}}=3, \\overline{\\text{AC}}=2$인 삼각형 $\\text{ABC}$에서 $\\angle\\text{BAC}$의 이등분선이 변 $\\text{BC}$와 만나는 점을 $\\text{D}$라 하자. $\\vec{\\text{AB}} \\cdot \\vec{\\text{AC}} = 2$일 때, $\\vec{\\text{AD}} \\cdot \\vec{\\text{CB}}$의 값은? [그림: 삼각형 ABC에서 AB=3, AC=2이고, 각 BAC의 이등분선이 대변 BC와 만나는 점을 D로 표시한 그림]",
    "choices": [
      "$1$",
      "$\\frac{6}{5}$",
      "$\\frac{7}{5}$",
      "$\\frac{8}{5}$",
      "$2$"
    ],
    "answer": "④",
    "solution": "[각의 이등분선 정리] $\\overline{\\text{BD}} : \\overline{\\text{DC}} = \\overline{\\text{AB}} : \\overline{\\text{AC}} = 3 : 2$이다.\n[위치벡터 표현] 점 $\\text{D}$는 변 $\\text{BC}$를 $3:2$로 내분하므로 $\\vec{\\text{AD}} = \\frac{2\\vec{\\text{AB}} + 3\\vec{\\text{AC}}}{3+2} = \\frac{2}{5}\\vec{\\text{AB}} + \\frac{3}{5}\\vec{\\text{AC}}$이다.\n[벡터의 뺄셈] $\\vec{\\text{CB}} = \\vec{\\text{AB}} - \\vec{\\text{AC}}$이다.\n[내적 식 전개] $\\vec{\\text{AD}} \\cdot \\vec{\\text{CB}} = \\left(\\frac{2}{5}\\vec{\\text{AB}} + \\frac{3}{5}\\vec{\\text{AC}}\\right) \\cdot (\\vec{\\text{AB}} - \\vec{\\text{AC}}) = \\frac{2}{5}|\\vec{\\text{AB}}|^2 + \\frac{1}{5}(\\vec{\\text{AB}} \\cdot \\vec{\\text{AC}}) - \\frac{3}{5}|\\vec{\\text{AC}}|^2$이다.\n[수치 대입] $|\\vec{\\text{AB}}| = 3, |\\vec{\\text{AC}}| = 2, \\vec{\\text{AB}} \\cdot \\vec{\\text{AC}} = 2$를 대입하면 $\\frac{2}{5}(9) + \\frac{1}{5}(2) - \\frac{3}{5}(4) = \\frac{18 + 2 - 12}{5} = \\frac{8}{5}$이다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-GEO-RPM-076",
    "problemTypeKey": "PT_GEO_PLANE_VECTOR",
    "templateKey": "TPL_GEO_PLANE_VECTOR_DOT",
    "crossConceptKeys": [
      "CC_ANGLE_BISECTOR",
      "CC_TRIANGLE_AREA"
    ],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
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
    "content": "그림과 같이 $\\overline{\\text{AB}}=2, \\overline{\\text{AD}}=4$인 직사각형 $\\text{ABCD}$에서 변 $\\text{AD}$를 $1:3$으로 내분하는 점을 $\\text{E}$, 변 $\\text{BC}$를 $3:1$로 내분하는 점을 $\\text{F}$라 할 때, $|\\vec{\\text{AF}}-\\vec{\\text{BE}}|^2$의 값은? [그림: 세로 AB=2, 가로 AD=4인 직사각형 ABCD에서 변 AD를 1:3으로 내분하는 점 E, 변 BC를 3:1로 내분하는 점 F를 잡고 선분 AF와 BE를 그은 그림]",
    "choices": [
      "$16$",
      "$20$",
      "$24$",
      "$28$",
      "$32$"
    ],
    "answer": "②",
    "solution": "[좌표평면 설정] 점 $\\text{B}$를 원점 $(0, 0)$으로 하고 선분 $\\text{BC}$를 $x$축, 선분 $\\text{BA}$를 $y$축 위에 둔다.\n[각 꼭짓점 좌표] $\\text{B}(0, 0), \\text{C}(4, 0), \\text{A}(0, 2), \\text{D}(4, 2)$이다.\n[내분점 좌표 계산] 점 $\\text{E}$는 선분 $\\text{AD}$를 $1:3$으로 내분하므로 $\\text{E}(1, 2)$이다.\n[내분점 좌표 계산] 점 $\\text{F}$는 선분 $\\text{BC}$를 $3:1$로 내분하므로 $\\text{F}(3, 0)$이다.\n[벡터의 성분 표시] $\\vec{\\text{AF}} = \\text{F} - \\text{A} = (3, -2)$이고, $\\vec{\\text{BE}} = \\text{E} - \\text{B} = (1, 2)$이다.\n[벡터의 차 계산] $\\vec{\\text{AF}} - \\vec{\\text{BE}} = (3 - 1, -2 - 2) = (2, -4)$이다.\n[크기의 제곱 계산] $|\\vec{\\text{AF}} - \\vec{\\text{BE}}|^2 = 2^2 + (-4)^2 = 4 + 16 = 20$이다.\n따라서 정답은 ②이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-GEO-RPM-076",
    "problemTypeKey": "PT_GEO_PLANE_VECTOR",
    "templateKey": "TPL_GEO_PLANE_VECTOR_DOT",
    "crossConceptKeys": [
      "CC_RECTANGLE_PROPERTIES",
      "CC_INTERNAL_DIVISION"
    ],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 6,
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
    "content": "한 변의 길이가 $4$인 정삼각형 $\\text{ABC}$에서 변 $\\text{AB}$의 중점을 $\\text{D}$라 하고, 변 $\\text{AC}$를 $2:1$과 $1:2$로 내분하는 점을 각각 $\\text{E}, \\text{F}$라 할 때, $|\\vec{\\text{BF}}+\\vec{\\text{DE}}|^2$의 값은? [그림: 한 변의 길이가 4인 정삼각형 ABC에서 변 AB의 중점 D, 변 AC 위의 점 E(AE:EC = 2:1), 점 F(AF:FC = 1:2)를 잡고 선분 BF와 DE를 그은 그림]",
    "choices": [
      "$24$",
      "$26$",
      "$28$",
      "$30$",
      "$32$"
    ],
    "answer": "③",
    "solution": "[기본 벡터와 내적] $\\vec{\\text{AB}} = \\vec{b}, \\vec{\\text{AC}} = \\vec{c}$라 하면 $|\\vec{b}| = 4, |\\vec{c}| = 4$이고 $\\vec{b} \\cdot \\vec{c} = 4 \\times 4 \\times \\cos 60^\\circ = 16 \\times \\frac{1}{2} = 8$이다.\n[각 점의 위치벡터] 중점 $\\text{D}$는 $\\vec{\\text{AD}} = \\frac{1}{2}\\vec{b}$, 내분점 $\\text{E}, \\text{F}$는 각각 $\\vec{\\text{AE}} = \\frac{2}{3}\\vec{c}, \\vec{\\text{AF}} = \\frac{1}{3}\\vec{c}$이다.\n[벡터의 차 표현] $\\vec{\\text{BF}} = \\frac{1}{3}\\vec{c} - \\vec{b}$이고, $\\vec{\\text{DE}} = \\frac{2}{3}\\vec{c} - \\frac{1}{2}\\vec{b}$이다.\n[합벡터 계산] $\\vec{\\text{BF}} + \\vec{\\text{DE}} = \\left(\\frac{1}{3}\\vec{c} - \\vec{b}\\right) + \\left(\\frac{2}{3}\\vec{c} - \\frac{1}{2}\\vec{b}\\right) = \\vec{c} - \\frac{3}{2}\\vec{b}$이다.\n[크기의 제곱 전개] $|\\vec{c} - \\frac{3}{2}\\vec{b}|^2 = |\\vec{c}|^2 - 3(\\vec{b} \\cdot \\vec{c}) + \\frac{9}{4}|\\vec{b}|^2$이다.\n[수치 대입 및 계산] $16 - 3(8) + \\frac{9}{4}(16) = 16 - 24 + 36 = 28$이다.\n따라서 정답은 ③이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-GEO-RPM-076",
    "problemTypeKey": "PT_GEO_PLANE_VECTOR",
    "templateKey": "TPL_GEO_PLANE_VECTOR_DOT",
    "crossConceptKeys": [
      "CC_EQUILATERAL_TRIANGLE",
      "CC_MIDPOINT"
    ],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
  }
];
