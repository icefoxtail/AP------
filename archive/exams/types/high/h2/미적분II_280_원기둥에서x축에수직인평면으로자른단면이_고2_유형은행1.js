window.examTitle = "미적분II_280_원기둥에서x축에수직인평면으로자른단면이_고2_유형은행1";

window.questionBank = [
  {
    "id": 1,
    "category": "정적분의 활용",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-08",
    "standardUnit": "정적분의 활용",
    "standardUnitOrder": 8,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "정적분의 활용"
    ],
    "wide": false,
    "content": "밑면의 반지름의 길이가 $2$이고 높이가 $5$인 원기둥이 있다. 이 원기둥을 밑면의 중심을 지나고 밑면과 $60^\\circ$의 각을 이루는 평면으로 자를 때 생기는 두 입체도형 중에서 작은 입체도형의 부피는? [그림: 밑면의 반지름의 길이가 2이고 높이가 5인 원기둥에서, 밑면의 중심을 지나는 지름을 교선으로 하고 밑면과 60°의 각을 이루며 원기둥의 옆면을 자르는 평면에 의해 생기는 작은 쪽의 쐐기 모양 입체도형]",
    "choices": [
      "$\\frac{8\\sqrt{3}}{3}$",
      "$4\\sqrt{3}$",
      "$\\frac{14\\sqrt{3}}{3}$",
      "$\\frac{16\\sqrt{3}}{3}$",
      "$6\\sqrt{3}$"
    ],
    "answer": "④",
    "solution": "밑면의 중심을 원점 $O$, 절단면과 밑면의 교선인 지름을 $x$축, 이 지름에 수직인 밑면 위의 방향을 $y$축, 밑면에 수직인 방향을 $z$축으로 정한다.\n절단면과 밑면이 이루는 각이 $60^\\circ$이므로 절단면의 방정식은 $z = y\\tan 60^\\circ = \\sqrt{3}y$이다.\n절단면이 옆면에서 도달하는 최고 높이는 $2\\tan 60^\\circ = 2\\sqrt{3}$이고 $2\\sqrt{3} < 5$이므로 절단면은 원기둥의 윗면과 만나지 않는다.\n$x = t$ ($-2 \\le t \\le 2$)를 지나고 $x$축에 수직인 평면으로 자르면, 밑면 위의 현의 길이는 $2\\sqrt{4 - t^2}$이고 높이는 $\\sqrt{4 - t^2}\\tan 60^\\circ = \\sqrt{3}\\sqrt{4 - t^2}$이다.\n작은 입체도형의 단면은 밑변 $\\sqrt{4 - t^2}$, 높이 $\\sqrt{3}\\sqrt{4 - t^2}$인 직각삼각형이므로 직각삼각형의 넓이 공식에 의해 $S(t) = \\frac{1}{2} \\times \\sqrt{4 - t^2} \\times \\sqrt{3}\\sqrt{4 - t^2} = \\frac{\\sqrt{3}}{2}(4 - t^2)$이다.\n단면의 넓이를 이용한 입체의 부피 공식에 의해 $V = \\int_{-2}^{2} S(t)\\,dt = \\int_{-2}^{2} \\frac{\\sqrt{3}}{2}(4 - t^2)\\,dt$이다.\n피적분함수가 우함수이므로 $V = 2 \\times \\frac{\\sqrt{3}}{2}\\int_0^2 (4 - t^2)\\,dt = \\sqrt{3}\\left[4t - \\frac{1}{3}t^3\\right]_0^2$이다.\n위끝과 아래끝을 대입하면 $V = \\sqrt{3}\\left(8 - \\frac{8}{3}\\right) = \\sqrt{3} \\times \\frac{16}{3} = \\frac{16\\sqrt{3}}{3}$이다.\n주의: 절단면의 최고 높이가 $2\\sqrt{3} < 5$임을 먼저 확인해야 단면이 항상 직각삼각형이 된다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-194",
    "problemTypeKey": "PT_CALCULUS_SOLID_VOLUME",
    "templateKey": "TPL_CALCULUS_VOLUME_CROSS_SECTION",
    "crossConceptKeys": [
      "CC_DEFINITE_INTEGRAL",
      "CC_TRIG_RATIO"
    ],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL",
    "image": "assets/images/미적분II_280_원기둥에서x축에수직인평면으로자른단면이_고2_유형은행1/q1-problem.svg",
    "imageAlt": "원기둥의 반지름 2, 높이 5만 정확히 나타낸 부분 그림. 밑면 60° 경사 절단과 쐐기는 엔진 보류.",
    "imageCaption": "원기둥의 반지름 2, 높이 5만 정확히 나타낸 부분 그림. 밑면 60° 경사 절단과 쐐기는 엔진 보류.",
    "imageSize": "full"
  },
  {
    "id": 2,
    "category": "정적분의 활용",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-08",
    "standardUnit": "정적분의 활용",
    "standardUnitOrder": 8,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "정적분의 활용"
    ],
    "wide": false,
    "content": "밑면의 지름의 길이가 $6a$, 높이가 $3a$인 원기둥이 있다. 이 원기둥을 밑면의 지름을 지나고 밑면과 $30^\\circ$의 각을 이루는 평면으로 잘랐을 때, 생기는 두 입체도형 중 작은 입체도형의 부피는? (단, $a>0$) [그림: 밑면의 지름의 길이가 6a, 높이가 3a인 원기둥에서, 밑면의 한 지름을 지나고 밑면과 30°의 각을 이루는 평면으로 잘린 작은 쪽의 쐐기 모양 입체도형]",
    "choices": [
      "$2\\sqrt{3}a^3$",
      "$4\\sqrt{3}a^3$",
      "$6\\sqrt{3}a^3$",
      "$8\\sqrt{3}a^3$",
      "$10\\sqrt{3}a^3$"
    ],
    "answer": "③",
    "solution": "밑면의 중심을 원점 $O$, 절단면과 밑면의 교선인 지름을 $x$축, 이 지름에 수직인 밑면 위의 방향을 $y$축으로 정한다.\n밑면의 지름이 $6a$이므로 반지름은 $r = 3a$이다.\n절단면과 밑면이 이루는 각이 $30^\\circ$이므로 절단면의 방정식은 $z = y\\tan 30^\\circ = \\frac{\\sqrt{3}}{3}y$이다.\n절단면의 최고 높이는 $3a\\tan 30^\\circ = \\sqrt{3}a$이고 $\\sqrt{3}a < 3a$이므로 절단면은 윗면과 만나지 않는다.\n$x = t$ ($-3a \\le t \\le 3a$)를 지나고 $x$축에 수직인 평면으로 자르면, 밑면 위의 현의 길이는 $2\\sqrt{9a^2 - t^2}$이고 단면은 밑변 $\\sqrt{9a^2 - t^2}$, 높이 $\\frac{\\sqrt{3}}{3}\\sqrt{9a^2 - t^2}$인 직각삼각형이다.\n직각삼각형의 넓이 공식에 의해 $S(t) = \\frac{1}{2} \\times \\sqrt{9a^2 - t^2} \\times \\frac{\\sqrt{3}}{3}\\sqrt{9a^2 - t^2} = \\frac{\\sqrt{3}}{6}(9a^2 - t^2)$이다.\n단면의 넓이를 이용한 입체의 부피 공식에 의해 $V = \\int_{-3a}^{3a} \\frac{\\sqrt{3}}{6}(9a^2 - t^2)\\,dt$이고, 우함수이므로 $V = \\frac{\\sqrt{3}}{3}\\int_0^{3a}(9a^2 - t^2)\\,dt$이다.\n정적분을 계산하면 $V = \\frac{\\sqrt{3}}{3}\\left[9a^2t - \\frac{1}{3}t^3\\right]_0^{3a} = \\frac{\\sqrt{3}}{3}\\left(27a^3 - 9a^3\\right)$이다.\n괄호 안을 정리하면 $V = \\frac{\\sqrt{3}}{3} \\times 18a^3 = 6\\sqrt{3}a^3$이다.\n따라서 정답은 ③이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-194",
    "problemTypeKey": "PT_CALCULUS_SOLID_VOLUME",
    "templateKey": "TPL_CALCULUS_VOLUME_CROSS_SECTION",
    "crossConceptKeys": [
      "CC_DEFINITE_INTEGRAL",
      "CC_TRIG_RATIO"
    ],
    "conditionKeys": [
      "COND_POSITIVE"
    ],
    "integrationPattern": "SEQUENTIAL",
    "image": "assets/images/미적분II_280_원기둥에서x축에수직인평면으로자른단면이_고2_유형은행1/q2-problem.svg",
    "imageAlt": "예: a=1 정규화로 반지름 3a, 높이 3a 비율의 원기둥만 표시; 30° 경사 절단은 보류.",
    "imageCaption": "예: a=1 정규화로 반지름 3a, 높이 3a 비율의 원기둥만 표시; 30° 경사 절단은 보류.",
    "imageSize": "full"
  },
  {
    "id": 3,
    "category": "정적분의 활용",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-08",
    "standardUnit": "정적분의 활용",
    "standardUnitOrder": 8,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "정적분의 활용"
    ],
    "wide": false,
    "content": "밑면의 반지름의 길이가 $r$이고 높이가 $3r$인 원기둥 모양의 물통이 있다. 이 물통에 물을 가득 담은 후 수면이 밑면의 중심을 지날 때까지 기울여 물을 쏟아 내었다. 이때 물통에 남아 있는 물의 부피는? [그림: 밑면의 반지름의 길이가 r이고 높이가 3r인 원기둥 모양의 물통을 기울여 물을 쏟아낼 때, 수면이 밑면의 중심과 물통 윗면 입구의 모서리를 지나는 평면을 이루며 그 아래에 물이 남아 있는 모습]",
    "choices": [
      "$\\frac{2}{3}r^3$",
      "$r^3$",
      "$\\frac{4}{3}r^3$",
      "$\\frac{5}{3}r^3$",
      "$2r^3$"
    ],
    "answer": "⑤",
    "solution": "물통을 기울이면 수면은 밑면의 중심 $O$와 윗면 테두리의 가장 낮은 점을 지나는 평면이 된다.\n수면과 밑면이 이루는 각을 $\\theta$라 하면, 밑면 중심에서 테두리까지의 수평 거리가 $r$, 높이가 $3r$이므로 $\\tan\\theta = \\frac{3r}{r} = 3$이다.\n밑면의 중심을 원점, 수면과 밑면의 교선인 지름을 $x$축, 기울어진 방향을 $y$축으로 정하면 수면의 방정식은 $z = y\\tan\\theta = 3y$이다.\n$x = t$ ($-r \\le t \\le r$)를 지나고 $x$축에 수직인 평면으로 자르면, 밑면 위의 현의 길이는 $2\\sqrt{r^2 - t^2}$이고 남아 있는 물의 단면은 밑변 $\\sqrt{r^2 - t^2}$, 높이 $3\\sqrt{r^2 - t^2}$인 직각삼각형이다.\n직각삼각형의 넓이 공식에 의해 $S(t) = \\frac{1}{2} \\times \\sqrt{r^2 - t^2} \\times 3\\sqrt{r^2 - t^2} = \\frac{3}{2}(r^2 - t^2)$이다.\n단면의 넓이를 이용한 입체의 부피 공식에 의해 $V = \\int_{-r}^{r} \\frac{3}{2}(r^2 - t^2)\\,dt$이고, 우함수이므로 $V = 3\\int_0^r (r^2 - t^2)\\,dt$이다.\n정적분을 계산하면 $V = 3\\left[r^2t - \\frac{1}{3}t^3\\right]_0^r = 3\\left(r^3 - \\frac{1}{3}r^3\\right)$이다.\n괄호 안을 정리하면 $V = 3 \\times \\frac{2}{3}r^3 = 2r^3$이다.\n주의: 수면이 밑면의 중심을 지나므로 남은 물은 밑면의 절반에 해당하는 쐐기 모양이고, $\\tan\\theta = \\frac{3r}{r}$을 뒤집어 $\\frac{r}{3r}$로 쓰지 않는다.\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-194",
    "problemTypeKey": "PT_CALCULUS_SOLID_VOLUME",
    "templateKey": "TPL_CALCULUS_VOLUME_CROSS_SECTION",
    "crossConceptKeys": [
      "CC_DEFINITE_INTEGRAL",
      "CC_LINE_SLOPE_TANGENT"
    ],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL",
    "image": "assets/images/미적분II_280_원기둥에서x축에수직인평면으로자른단면이_고2_유형은행1/q3-problem.svg",
    "imageAlt": "예: r=2로 반지름 r, 높이 3r의 원기둥 형상만 표시. 기울인 수면과 남은 물은 보류.",
    "imageCaption": "예: r=2로 반지름 r, 높이 3r의 원기둥 형상만 표시. 기울인 수면과 남은 물은 보류.",
    "imageSize": "full"
  },
  {
    "id": 4,
    "category": "정적분의 활용",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-08",
    "standardUnit": "정적분의 활용",
    "standardUnitOrder": 8,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "정적분의 활용"
    ],
    "wide": false,
    "content": "밑면의 반지름의 길이가 $3$, 높이가 $3\\sqrt{3}$인 원기둥 모양의 그릇에 물이 가득 담겨 있다. 오른쪽 그림과 같이 이 그릇을 $60^\\circ$의 각도로 기울였을 때, 그릇에 남아 있는 물의 부피는? [그림: 밑면의 반지름의 길이가 3, 높이가 3√3인 원기둥 모양의 그릇을 60° 기울였을 때, 수면이 밑면의 중심을 지나며 그릇 안에 물이 남아 있는 모습]",
    "choices": [
      "$15\\sqrt{3}$",
      "$18\\sqrt{3}$",
      "$21\\sqrt{3}$",
      "$24\\sqrt{3}$",
      "$27\\sqrt{3}$"
    ],
    "answer": "②",
    "solution": "그릇을 $60^\\circ$ 기울이면 수면과 밑면이 이루는 각은 $\\theta = 60^\\circ$이다.\n수면이 밑면의 중심과 윗면 테두리의 가장 낮은 점을 지나므로, 밑면 중심에서 테두리까지의 수평 거리 $3$와 높이 $3\\sqrt{3}$에 대하여 $\\tan\\theta = \\frac{3\\sqrt{3}}{3} = \\sqrt{3} = \\tan 60^\\circ$임을 확인한다.\n밑면의 중심을 원점, 수면과 밑면의 교선인 지름을 $x$축, 기울어진 방향을 $y$축으로 정하면 수면의 방정식은 $z = \\sqrt{3}y$이다.\n$x = t$ ($-3 \\le t \\le 3$)에서 밑면 위의 현의 길이는 $2\\sqrt{9 - t^2}$이고, 남아 있는 물의 단면은 밑변 $\\sqrt{9 - t^2}$, 높이 $\\sqrt{3}\\sqrt{9 - t^2}$인 직각삼각형이다.\n직각삼각형의 넓이 공식에 의해 $S(t) = \\frac{1}{2} \\times \\sqrt{9 - t^2} \\times \\sqrt{3}\\sqrt{9 - t^2} = \\frac{\\sqrt{3}}{2}(9 - t^2)$이다.\n단면의 넓이를 이용한 입체의 부피 공식에 의해 $V = \\int_{-3}^{3} \\frac{\\sqrt{3}}{2}(9 - t^2)\\,dt = \\sqrt{3}\\int_0^3 (9 - t^2)\\,dt$이다.\n정적분을 계산하면 $V = \\sqrt{3}\\left[9t - \\frac{1}{3}t^3\\right]_0^3 = \\sqrt{3}\\left(27 - 9\\right)$이다.\n값을 정리하면 $V = 18\\sqrt{3}$이다.\n따라서 정답은 ②이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-194",
    "problemTypeKey": "PT_CALCULUS_SOLID_VOLUME",
    "templateKey": "TPL_CALCULUS_VOLUME_CROSS_SECTION",
    "crossConceptKeys": [
      "CC_DEFINITE_INTEGRAL",
      "CC_TRIG_RATIO"
    ],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL",
    "image": "assets/images/미적분II_280_원기둥에서x축에수직인평면으로자른단면이_고2_유형은행1/q4-problem.svg",
    "imageAlt": "반지름 3, 높이 3√3의 근사 투영 원기둥. 60° 기울임 수면과 남은 물은 미지원.",
    "imageCaption": "반지름 3, 높이 3√3의 근사 투영 원기둥. 60° 기울임 수면과 남은 물은 미지원.",
    "imageSize": "full"
  },
  {
    "id": 5,
    "category": "정적분의 활용",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-08",
    "standardUnit": "정적분의 활용",
    "standardUnitOrder": 8,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "정적분의 활용"
    ],
    "wide": false,
    "content": "다음 그림과 같이 반지름의 길이가 $4\\text{ cm}$인 반구 모양의 그릇에 물을 가득 채운 후 $30^\\circ$만큼 기울여 물을 흘려보낼 때, 남아 있는 물의 양은 몇 $\\text{cm}^3$인지 구하면? (단, 그릇의 두께는 고려하지 않는다.) [그림: 반지름의 길이가 4cm인 반구 모양의 그릇을 30°만큼 기울였을 때, 수면이 반구 개구부 테두리의 가장 낮은 점을 지나며 아래쪽에 물이 남아 있는 모습]",
    "choices": [
      "$\\frac{28}{3}\\pi$",
      "$\\frac{32}{3}\\pi$",
      "$12\\pi$",
      "$\\frac{40}{3}\\pi$",
      "$\\frac{44}{3}\\pi$"
    ],
    "answer": "④",
    "solution": "반구의 중심을 원점 $O$, 수면에 수직인 연직 아래 방향을 $z$축으로 정한다.\n그릇을 $30^\\circ$ 기울이면 수면은 개구부 테두리의 가장 낮은 점 $P$를 지나고, $\\overline{OP} = 4$이므로 중심 $O$에서 수면까지의 거리는 $d = 4\\sin 30^\\circ = 4 \\times \\frac{1}{2} = 2$이다.\n반구의 내부는 $0 \\le z \\le 4$이고 수면은 $z = 2$이므로 남아 있는 물의 범위는 $2 \\le z \\le 4$이다.\n$z = u$ ($2 \\le u \\le 4$)를 지나고 $z$축에 수직인 평면으로 자른 단면은 반지름 $\\sqrt{16 - u^2}$인 원이다.\n원의 넓이 공식에 의해 $S(u) = \\pi(\\sqrt{16 - u^2})^2 = \\pi(16 - u^2)$이다.\n단면의 넓이를 이용한 입체의 부피 공식에 의해 $V = \\int_2^4 \\pi(16 - u^2)\\,du = \\pi\\left[16u - \\frac{1}{3}u^3\\right]_2^4$이다.\n위끝과 아래끝을 대입하면 $V = \\pi\\left\\{\\left(64 - \\frac{64}{3}\\right) - \\left(32 - \\frac{8}{3}\\right)\\right\\}$이다.\n각 괄호를 계산하면 $64 - \\frac{64}{3} = \\frac{128}{3}$, $32 - \\frac{8}{3} = \\frac{88}{3}$이다.\n두 값을 빼면 $V = \\pi\\left(\\frac{128}{3} - \\frac{88}{3}\\right) = \\frac{40}{3}\\pi$이다.\n주의: 기울인 각 $30^\\circ$로 중심에서 수면까지의 거리를 $4\\sin 30^\\circ$로 구하고, 적분 구간은 $0$부터가 아니라 $2$부터 $4$까지이다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B45",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-194",
    "problemTypeKey": "PT_CALCULUS_SOLID_VOLUME",
    "templateKey": "TPL_CALCULUS_VOLUME_CROSS_SECTION",
    "crossConceptKeys": [
      "CC_DEFINITE_INTEGRAL"
    ],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL",
    "image": "assets/images/미적분II_280_원기둥에서x축에수직인평면으로자른단면이_고2_유형은행1/q5-problem.svg",
    "imageAlt": "반지름 4cm의 위가 열린 반구 그릇만 정확히 표시. 30° 기울임·비스듬한 수면·남은 물은 미지원.",
    "imageCaption": "반지름 4cm의 위가 열린 반구 그릇만 정확히 표시. 30° 기울임·비스듬한 수면·남은 물은 미지원.",
    "imageSize": "full"
  }
];
