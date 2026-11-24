window.examTitle = "기하_175_기울어진그릇의지면과이루는각크기를이용한_고2_유형은행1";

window.questionBank = [
  {
    "id": 1,
    "category": "공간도형 핵심 개념",
    "standardCourse": "기하",
    "curriculum": "2022",
    "standardUnitKey": "H22-GE-03",
    "standardUnit": "공간도형",
    "standardUnitOrder": 3,
    "subUnitKey": "H22-GE-03-CORE",
    "subUnit": "공간도형 핵심 개념",
    "subUnitConfidence": "candidate_evidence",
    "subUnitClassificationDepth": "complete_candidate",
    "conceptClusterKey": "H22-GE-03-CORE",
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "공간도형 핵심 개념"
    ],
    "wide": false,
    "content": "밑면의 반지름의 길이가 $\\sqrt{3}$이고 높이가 $\\sqrt{6}$인 원뿔을 한 모선이 평면 $\\alpha$ 위에 있도록 놓았다. 이 원뿔의 평면 $\\alpha$ 위로의 정사영의 넓이를 $S$라 할 때, $3S$의 값은? [그림: 밑면의 반지름이 $\\sqrt{3}$, 높이가 $\\sqrt{6}$인 원뿔이 한 모선이 평면 $\\alpha$에 놓이도록 기울어져 있고, 위에서 평면 $\\alpha$에 수직인 방향으로 태양광선이 비추는 모습]",
    "choices": [
      "$\\sqrt{3}\\pi + 6$",
      "$\\sqrt{3}\\pi + 9$",
      "$2\\sqrt{3}\\pi + 6$",
      "$2\\sqrt{3}\\pi + 9$",
      "$3\\sqrt{3}\\pi + 9$"
    ],
    "answer": "④",
    "solution": "원뿔의 꼭짓점을 $\\mathrm{V}$, 밑면의 중심을 $\\mathrm{O}$, 평면 $\\alpha$ 위에 놓인 모선의 다른 끝점을 $\\mathrm{A}$라 하자.\n$\\overline{\\mathrm{OA}} = \\sqrt{3}$, $\\overline{\\mathrm{VO}} = \\sqrt{6}$이고 $\\angle \\mathrm{VOA} = 90^\\circ$이므로 모선의 길이는\n$\\overline{\\mathrm{VA}} = \\sqrt{(\\sqrt{3})^2 + (\\sqrt{6})^2} = 3$\n원뿔의 밑면을 포함하는 평면을 $\\beta$라 하고, 꼭짓점 $\\mathrm{V}$를 지나며 평면 $\\alpha$에 수직인 직선이 평면 $\\beta$와 만나는 점을 $\\mathrm{Q}$라 하자.\n세 점 $\\mathrm{V}, \\mathrm{O}, \\mathrm{A}$를 포함하는 평면은 평면 $\\alpha$와 수직이므로 점 $\\mathrm{Q}$는 직선 $\\mathrm{OA}$ 위에 있으며, $\\angle \\mathrm{QVA} = 90^\\circ$이고 $\\overline{\\mathrm{VO}} \\perp \\overline{\\mathrm{QA}}$이다.\n직각삼각형 $\\mathrm{VQA}$에서 닮음의 성질에 의하여\n$\\overline{\\mathrm{VO}}^2 = \\overline{\\mathrm{OA}} \\cdot \\overline{\\mathrm{OQ}} \\implies 6 = \\sqrt{3}\\,\\overline{\\mathrm{OQ}} \\implies \\overline{\\mathrm{OQ}} = 2\\sqrt{3}$\n평면 $\\beta$ 위에서 점 $\\mathrm{Q}$로부터 밑면의 원(중심 $\\mathrm{O}$, 반지름 $\\sqrt{3}$)에 그은 두 접선의 접점을 $\\mathrm{T}_1, \\mathrm{T}_2$라 하자.\n직각삼각형 $\\mathrm{OT}_1\\mathrm{Q}$에서 $\\overline{\\mathrm{OT}_1} = \\sqrt{3}$, $\\overline{\\mathrm{OQ}} = 2\\sqrt{3}$이므로\n$\\overline{\\mathrm{QT}_1} = \\sqrt{(2\\sqrt{3})^2 - (\\sqrt{3})^2} = 3, \\quad \\angle \\mathrm{T}_1\\mathrm{OQ} = 60^\\circ$\n따라서 $\\angle \\mathrm{T}_1\\mathrm{OT}_2 = 120^\\circ$이다.\n두 점 $\\mathrm{V}$와 $\\mathrm{Q}$의 평면 $\\alpha$ 위로의 정사영이 일치하므로, 원뿔의 평면 $\\alpha$ 위로의 정사영은 평면 $\\beta$ 위에서 두 선분 $\\mathrm{QT}_1, \\mathrm{QT}_2$와 중심각의 크기가 $240^\\circ$인 호 $\\mathrm{T}_1\\mathrm{AT}_2$로 둘러싸인 도형 $R$의 평면 $\\alpha$ 위로의 정사영과 같다.\n도형 $R$의 넓이 $S_R$는\n$S_R = \\pi(\\sqrt{3})^2 \\times \\frac{240^\\circ}{360^\\circ} + 2 \\times \\left(\\frac{1}{2} \\times \\sqrt{3} \\times 3\\right) = 2\\pi + 3\\sqrt{3}$\n평면 $\\beta$와 평면 $\\alpha$가 이루는 이면각의 크기를 $\\theta$라 하면 $\\theta = \\angle \\mathrm{OAV}$이므로\n$\\cos\\theta = \\frac{\\overline{\\mathrm{OA}}}{\\overline{\\mathrm{VA}}} = \\frac{\\sqrt{3}}{3}$\n따라서 원뿔의 정사영의 넓이 $S$는\n$S = S_R \\cos\\theta = (2\\pi + 3\\sqrt{3}) \\times \\frac{\\sqrt{3}}{3} = \\frac{2\\sqrt{3}}{3}\\pi + 3$\n이므로 $3S = 2\\sqrt{3}\\pi + 9$이다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-GEO-RPM-056",
    "problemTypeKey": "PT_GEO_SPACE_FIGURE",
    "templateKey": "TPL_GEO_SPACE_FIGURE_PROJECTION",
    "crossConceptKeys": [
      "CC_SPACE_FIGURE",
      "CC_ELLIPSE",
      "CC_TRIG_RATIO"
    ],
    "conditionKeys": [],
    "integrationPattern": "INTERDEPENDENT"
  },
  {
    "id": 2,
    "category": "공간도형 핵심 개념",
    "standardCourse": "기하",
    "curriculum": "2022",
    "standardUnitKey": "H22-GE-03",
    "standardUnit": "공간도형",
    "standardUnitOrder": 3,
    "subUnitKey": "H22-GE-03-CORE",
    "subUnit": "공간도형 핵심 개념",
    "subUnitConfidence": "candidate_evidence",
    "subUnitClassificationDepth": "complete_candidate",
    "conceptClusterKey": "H22-GE-03-CORE",
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "공간도형 핵심 개념"
    ],
    "wide": false,
    "content": "반지름의 길이가 $3$, 중심이 $\\mathrm{O}$인 원을 밑면으로 하고 높이가 $4$인 원뿔이 평면 $\\alpha$ 위에 놓여 있다. 태양광선이 평면 $\\alpha$에 수직인 방향으로 비출 때, 원뿔의 밑면에 의해 평면 $\\alpha$에 생기는 그림자의 넓이는? (단, 원뿔의 한 모선이 평면 $\\alpha$에 포함된다.) [그림: 밑면의 반지름이 $3$, 높이가 $4$인 원뿔이 한 모선이 평면 $\\alpha$에 포함되도록 놓여 있고, 위에서 평면 $\\alpha$에 수직인 방향으로 태양광선이 비추는 모습]",
    "choices": [
      "$\\frac{18}{5}\\pi$",
      "$\\frac{21}{5}\\pi$",
      "$\\frac{24}{5}\\pi$",
      "$\\frac{27}{5}\\pi$",
      "$\\frac{36}{5}\\pi$"
    ],
    "answer": "④",
    "solution": "원뿔의 꼭짓점을 $\\mathrm{V}$, 평면 $\\alpha$에 포함된 모선과 밑면의 교점을 $\\mathrm{A}$라 하자.\n삼각형 $\\mathrm{VOA}$는 $\\angle \\mathrm{VOA} = 90^\\circ$인 직각삼각형이고 $\\overline{\\mathrm{OA}} = 3$, $\\overline{\\mathrm{VO}} = 4$이므로 모선의 길이는\n$\\overline{\\mathrm{VA}} = \\sqrt{3^2 + 4^2} = 5$\n원뿔의 밑면을 포함하는 평면과 평면 $\\alpha$가 이루는 이면각의 크기를 $\\theta$라 하면, 두 평면의 교선(점 $\\mathrm{A}$에서의 밑면의 접선)이 두 선분 $\\mathrm{OA}, \\mathrm{VA}$와 각각 수직이므로 $\\theta = \\angle \\mathrm{OAV}$이다.\n직각삼각형 $\\mathrm{VOA}$에서\n$\\cos\\theta = \\frac{\\overline{\\mathrm{OA}}}{\\overline{\\mathrm{VA}}} = \\frac{3}{5}$\n태양광선이 평면 $\\alpha$에 수직이므로 원뿔의 밑면에 의해 평면 $\\alpha$에 생기는 그림자는 밑면의 평면 $\\alpha$ 위로의 정사영이다.\n밑면의 넓이는 $\\pi \\times 3^2 = 9\\pi$이므로 구하는 그림자의 넓이는\n$9\\pi \\cos\\theta = 9\\pi \\times \\frac{3}{5} = \\frac{27}{5}\\pi$\n따라서 정답은 ④이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-GEO-RPM-056",
    "problemTypeKey": "PT_GEO_SPACE_FIGURE",
    "templateKey": "TPL_GEO_SPACE_FIGURE_PROJECTION",
    "crossConceptKeys": [
      "CC_SPACE_FIGURE",
      "CC_ELLIPSE",
      "CC_TRIG_RATIO"
    ],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 3,
    "category": "공간도형 핵심 개념",
    "standardCourse": "기하",
    "curriculum": "2022",
    "standardUnitKey": "H22-GE-03",
    "standardUnit": "공간도형",
    "standardUnitOrder": 3,
    "subUnitKey": "H22-GE-03-CORE",
    "subUnit": "공간도형 핵심 개념",
    "subUnitConfidence": "candidate_evidence",
    "subUnitClassificationDepth": "complete_candidate",
    "conceptClusterKey": "H22-GE-03-CORE",
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "공간도형 핵심 개념"
    ],
    "wide": false,
    "content": "밑면의 반지름의 길이가 $2$이고 높이가 $3\\sqrt{2}$인 원기둥의 축이 평면 $\\alpha$와 $45^\\circ$의 각을 이루도록 놓여 있다. 태양광선이 평면 $\\alpha$에 수직인 방향으로 비출 때, 평면 $\\alpha$에 생기는 원기둥의 그림자의 넓이는? [그림: 밑면의 반지름이 $2$, 높이가 $3\\sqrt{2}$인 원기둥이 평면 $\\alpha$와 $45^\\circ$의 각을 이루며 기울어져 있고, 위에서 평면 $\\alpha$에 수직인 방향으로 태양광선이 비추는 모습]",
    "choices": [
      "$\\sqrt{2}\\pi + 6$",
      "$2\\sqrt{2}\\pi + 6$",
      "$2\\sqrt{2}\\pi + 12$",
      "$3\\sqrt{2}\\pi + 12$",
      "$3\\sqrt{2}\\pi + 18$"
    ],
    "answer": "③",
    "solution": "태양광선이 평면 $\\alpha$에 수직이므로 평면 $\\alpha$에 생기는 원기둥의 그림자는 원기둥의 평면 $\\alpha$ 위로의 정사영이다.\n원기둥의 축이 평면 $\\alpha$와 이루는 각의 크기가 $45^\\circ$이므로, 축과 수직인 원기둥의 두 밑면이 평면 $\\alpha$와 이루는 각의 크기는 $90^\\circ - 45^\\circ = 45^\\circ$이다.\n원기둥의 정사영은 두 밑면의 정사영(합동인 두 타원)의 바깥쪽 절반씩 두 개와, 두 타원의 중심을 양 끝으로 하고 폭이 지름의 길이와 같은 직사각형 하나로 나눌 수 있다.\n1) 두 반타원을 합한 넓이는 한 밑면의 평면 $\\alpha$ 위로의 정사영의 넓이와 같으므로\n$S_1 = (\\pi \\times 2^2) \\cos 45^\\circ = 4\\pi \\times \\frac{\\sqrt{2}}{2} = 2\\sqrt{2}\\pi$\n2) 가운데 직사각형의 가로의 길이는 원기둥의 밑면의 지름과 같은 $4$이고, 세로의 길이는 원기둥의 축(길이 $3\\sqrt{2}$)의 평면 $\\alpha$ 위로의 정사영의 길이와 같으므로\n$3\\sqrt{2} \\cos 45^\\circ = 3\\sqrt{2} \\times \\frac{\\sqrt{2}}{2} = 3$\n따라서 직사각형의 넓이는 $S_2 = 4 \\times 3 = 12$이다.\n구하는 원기둥의 그림자의 넓이는\n$S_1 + S_2 = 2\\sqrt{2}\\pi + 12$\n따라서 정답은 ③이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-GEO-RPM-056",
    "problemTypeKey": "PT_GEO_SPACE_FIGURE",
    "templateKey": "TPL_GEO_SPACE_FIGURE_PROJECTION",
    "crossConceptKeys": [
      "CC_SPACE_FIGURE",
      "CC_ELLIPSE",
      "CC_TRIG_RATIO"
    ],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 4,
    "category": "공간도형 핵심 개념",
    "standardCourse": "기하",
    "curriculum": "2022",
    "standardUnitKey": "H22-GE-03",
    "standardUnit": "공간도형",
    "standardUnitOrder": 3,
    "subUnitKey": "H22-GE-03-CORE",
    "subUnit": "공간도형 핵심 개념",
    "subUnitConfidence": "candidate_evidence",
    "subUnitClassificationDepth": "complete_candidate",
    "conceptClusterKey": "H22-GE-03-CORE",
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "공간도형 핵심 개념"
    ],
    "wide": false,
    "content": "반지름의 길이가 $3$인 반구의 밑면을 포함하는 평면과 평면 $\\alpha$가 이루는 이면각의 크기가 $45^\\circ$일 때, 반구의 평면 $\\alpha$ 위로의 정사영의 넓이가 $\\frac{a + b\\sqrt{2}}{4}\\pi$이다. 두 자연수 $a, b$에 대하여 $a + b$의 값은? [그림: 평면 $\\alpha$ 위에 반지름의 길이가 $3$인 반구가 놓여 있고, 반구의 밑면을 포함하는 평면과 평면 $\\alpha$가 이루는 이면각의 크기가 $45^\\circ$인 모습]",
    "choices": [
      "$24$",
      "$27$",
      "$30$",
      "$33$",
      "$36$"
    ],
    "answer": "②",
    "solution": "반구의 중심을 지나고 평면 $\\alpha$와 평행한 평면으로 구를 자를 때 생기는 대원을 $C$라 하자.\n반구의 밑면과 대원 $C$는 반구의 중심을 지나는 공통 지름으로 만나며, 반구를 평면 $\\alpha$ 위로 정사영한 도형은 다음 두 도형의 합집합으로 이루어진다.\n1) 대원 $C$ 중 반구에 포함되는 반원의 평면 $\\alpha$ 위로의 정사영: 대원 $C$는 평면 $\\alpha$와 평행하므로 정사영은 반지름의 길이가 $3$인 반원이 된다.\n그 넓이는\n$S_1 = \\frac{1}{2} \\times \\pi \\times 3^2 = \\frac{9}{2}\\pi$\n2) 반구의 밑면 중 나머지 반원의 평면 $\\alpha$ 위로의 정사영: 밑면이 평면 $\\alpha$와 이루는 이면각의 크기가 $45^\\circ$이므로 정사영의 넓이는\n$S_2 = \\frac{9}{2}\\pi \\cos 45^\\circ = \\frac{9}{2}\\pi \\times \\frac{\\sqrt{2}}{2} = \\frac{9\\sqrt{2}}{4}\\pi$\n따라서 반구의 평면 $\\alpha$ 위로의 정사영의 넓이는\n$S_1 + S_2 = \\frac{9}{2}\\pi + \\frac{9\\sqrt{2}}{4}\\pi = \\frac{18 + 9\\sqrt{2}}{4}\\pi$\n두 자연수 $a, b$에 대하여 $a = 18$, $b = 9$이므로\n$a + b = 18 + 9 = 27$\n따라서 정답은 ②이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-GEO-RPM-056",
    "problemTypeKey": "PT_GEO_SPACE_FIGURE",
    "templateKey": "TPL_GEO_SPACE_FIGURE_PROJECTION",
    "crossConceptKeys": [
      "CC_SPACE_FIGURE",
      "CC_TRIG_RATIO"
    ],
    "conditionKeys": [
      "COND_NATURAL_NUMBER"
    ],
    "integrationPattern": "INTERDEPENDENT"
  },
  {
    "id": 5,
    "category": "공간도형 핵심 개념",
    "standardCourse": "기하",
    "curriculum": "2022",
    "standardUnitKey": "H22-GE-03",
    "standardUnit": "공간도형",
    "standardUnitOrder": 3,
    "subUnitKey": "H22-GE-03-CORE",
    "subUnit": "공간도형 핵심 개념",
    "subUnitConfidence": "candidate_evidence",
    "subUnitClassificationDepth": "complete_candidate",
    "conceptClusterKey": "H22-GE-03-CORE",
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "공간도형 핵심 개념"
    ],
    "wide": false,
    "content": "중심 사이의 거리가 $2$이고 반지름의 길이가 $2$인 두 원판과 평면 $\\alpha$가 있다. 각 원판의 중심을 지나는 직선 $l$은 두 원판의 면과 각각 수직이고 평면 $\\alpha$와 이루는 각의 크기가 $30^\\circ$이다. 두 원판이 평면 $\\alpha$와 만나지 않을 때, 태양광선이 평면 $\\alpha$에 수직인 방향으로 비추면 두 원판에 의해 평면 $\\alpha$에 생기는 그림자의 넓이는? (단, 원판의 두께는 무시한다.) [그림: 평면 $\\alpha$ 위에 반지름이 $2$이고 중심 사이의 거리가 $2$인 평행한 두 원판이 직선 $l$에 수직으로 고정되어 있고, 직선 $l$이 평면 $\\alpha$와 $30^\\circ$의 각을 이루며 위에서 평면 $\\alpha$에 수직인 방향으로 태양광선이 비추는 모습]",
    "choices": [
      "$\\frac{7}{3}\\pi + \\frac{\\sqrt{3}}{2}$",
      "$\\frac{8}{3}\\pi + \\frac{\\sqrt{3}}{2}$",
      "$\\frac{8}{3}\\pi + \\sqrt{3}$",
      "$\\frac{10}{3}\\pi + \\frac{\\sqrt{3}}{2}$",
      "$\\frac{10}{3}\\pi + \\sqrt{3}$"
    ],
    "answer": "⑤",
    "solution": "아래쪽 원판의 중심을 $\\mathrm{O}_1$, 위쪽 원판의 중심을 $\\mathrm{O}_2$라 하고, 아래쪽 원판을 포함하는 평면을 $\\beta$라 하자.\n직선 $l$이 두 원판과 수직이고 평면 $\\alpha$와 $30^\\circ$의 각을 이루므로, 평면 $\\beta$와 평면 $\\alpha$가 이루는 이면각의 크기는 $90^\\circ - 30^\\circ = 60^\\circ$이다.\n점 $\\mathrm{O}_2$를 지나고 평면 $\\alpha$에 수직인 태양광선이 평면 $\\beta$와 만나는 점을 $\\mathrm{O}_2'$이라 하자.\n$\\overline{\\mathrm{O}_1\\mathrm{O}_2} \\perp \\beta$이고 $\\overline{\\mathrm{O}_2\\mathrm{O}_2'} \\perp \\alpha$이므로 $\\angle \\mathrm{O}_1\\mathrm{O}_2\\mathrm{O}_2' = 60^\\circ$이고, 직각삼각형 $\\mathrm{O}_2\\mathrm{O}_1\\mathrm{O}_2'$에서\n$\\overline{\\mathrm{O}_1\\mathrm{O}_2'} = \\overline{\\mathrm{O}_1\\mathrm{O}_2} \\tan 60^\\circ = 2\\sqrt{3}$\n위쪽 원판은 평면 $\\beta$와 평행하므로 위쪽 원판에 의해 평면 $\\beta$에 생기는 그림자는 중심이 $\\mathrm{O}_2'$이고 반지름의 길이가 $2$인 원이다.\n따라서 평면 $\\alpha$에 생기는 두 원판의 그림자는 평면 $\\beta$ 위에서 중심 사이의 거리가 $2\\sqrt{3}$이고 반지름의 길이가 각각 $2$인 두 원의 합집합을 평면 $\\alpha$ 위로 정사영한 도형이다.\n평면 $\\beta$ 위에서 두 원의 두 교점을 $\\mathrm{P}, \\mathrm{Q}$, 선분 $\\mathrm{O}_1\\mathrm{O}_2'$의 중점을 $\\mathrm{M}$이라 하면\n$\\overline{\\mathrm{O}_1\\mathrm{M}} = \\sqrt{3}, \\quad \\overline{\\mathrm{O}_1\\mathrm{P}} = 2 \\implies \\cos(\\angle \\mathrm{PO}_1\\mathrm{M}) = \\frac{\\sqrt{3}}{2} \\implies \\angle \\mathrm{PO}_1\\mathrm{M} = 30^\\circ$\n그러므로 $\\angle \\mathrm{PO}_1\\mathrm{Q} = 60^\\circ = \\frac{\\pi}{3}$이다.\n두 원이 겹치는 부분의 넓이는\n$2 \\times \\left(\\frac{1}{2} \\times 2^2 \\times \\frac{\\pi}{3} - \\frac{1}{2} \\times 2^2 \\times \\sin 60^\\circ\\right) = \\frac{4}{3}\\pi - 2\\sqrt{3}$\n따라서 평면 $\\beta$ 위의 두 원의 합집합의 넓이는\n$2 \\times (\\pi \\times 2^2) - \\left(\\frac{4}{3}\\pi - 2\\sqrt{3}\\right) = \\frac{20}{3}\\pi + 2\\sqrt{3}$\n이를 평면 $\\alpha$ 위로 정사영한 넓이는\n$\\left(\\frac{20}{3}\\pi + 2\\sqrt{3}\\right) \\cos 60^\\circ = \\left(\\frac{20}{3}\\pi + 2\\sqrt{3}\\right) \\times \\frac{1}{2} = \\frac{10}{3}\\pi + \\sqrt{3}$\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 5,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B45",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-GEO-RPM-056",
    "problemTypeKey": "PT_GEO_SPACE_FIGURE",
    "templateKey": "TPL_GEO_SPACE_FIGURE_PROJECTION",
    "crossConceptKeys": [
      "CC_SPACE_FIGURE",
      "CC_ELLIPSE",
      "CC_AREA"
    ],
    "conditionKeys": [],
    "integrationPattern": "DEEP_COMPOSITE"
  }
];
