window.examTitle = "기하_081_쌍곡선의접선의방정식-기울기가주어진경우_고2_유형은행1";

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
    "content": "다음 조건을 만족하는 상수 $a, b, c$에 대하여 $abc$의 값은?\n\n(가) 포물선 $y^2=12x$에 접하고 기울기가 3인 접선이 점 $(0, a)$를 지난다.\n(나) 타원 $\\frac{x^2}{16}+\\frac{y^2}{9}=1$에 접하고 기울기가 1인 접선의 $y$절편이 양수일 때, 점 $(0, b)$를 지난다.\n(다) 쌍곡선 $3x^2-y^2=-6$에 접하고 직선 $x+y=0$에 평행한 접선의 $y$절편이 양수일 때, 이 접선이 점 $(c, 0)$을 지난다.",
    "choices": [
      "6",
      "8",
      "10",
      "12",
      "14"
    ],
    "answer": "③",
    "solution": "(가) 포물선 $y^2 = 4px$에 접하고 기울기가 $m$인 접선의 방정식 공식 $y = mx + \\frac{p}{m}$을 이용합니다.\n포물선 $y^2 = 12x$에서 $4p = 12 \\implies p = 3$이고 기울기 $m = 3$이므로 접선의 방정식은 $y = 3x + \\frac{3}{3} = 3x + 1$입니다.\n이 접선이 점 $(0, a)$를 지나므로 $a = 3(0) + 1 = 1$입니다.\n(나) 타원 $\\frac{x^2}{A^2} + \\frac{y^2}{B^2} = 1$에 접하고 기울기가 $m$인 접선의 방정식 공식 $y = mx \\pm \\sqrt{A^2 m^2 + B^2}$을 이용합니다.\n타원 $\\frac{x^2}{16} + \\frac{y^2}{9} = 1$에서 $A^2 = 16, B^2 = 9$이고 기울기 $m = 1$, $y$절편이 양수이므로\n접선의 방정식은 $y = 1 \\cdot x + \\sqrt{16 \\cdot 1^2 + 9} = x + \\sqrt{25} = x + 5$입니다.\n이 접선이 점 $(0, b)$를 지나므로 $b = 0 + 5 = 5$입니다.\n(다) 쌍곡선 $3x^2 - y^2 = -6$의 양변을 $-6$으로 나누어 표준형으로 나타내면 $\\frac{x^2}{2} - \\frac{y^2}{6} = -1$입니다.\n직선 $x+y=0$의 기울기는 $-1$이므로 평행한 접선의 기울기는 $m = -1$입니다.\n쌍곡선 $\\frac{x^2}{a^2} - \\frac{y^2}{b^2} = -1$에 접하고 기울기가 $m$인 접선의 방정식 공식 $y = mx \\pm \\sqrt{b^2 - a^2 m^2}$에 의해\n$y$절편이 양수인 접선은 $y = -x + \\sqrt{6 - 2(-1)^2} = -x + \\sqrt{4} = -x + 2$입니다.\n이 접선이 점 $(c, 0)$을 지나므로 $0 = -c + 2 \\implies c = 2$입니다.\n세 상수의 곱을 계산하면 $abc = 1 \\times 5 \\times 2 = 10$입니다.\n따라서 정답은 ③이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-GEO-RPM-052",
    "problemTypeKey": "PT_GEO_CONIC_TANGENT",
    "templateKey": "TPL_GEO_CONIC_TANGENT_SLOPE_TANGENT",
    "crossConceptKeys": [
      "CC_SLOPE",
      "CC_Y_INTERCEPT",
      "CC_PARALLEL_LINES"
    ],
    "conditionKeys": [
      "COND_POSITIVE"
    ],
    "integrationPattern": "SEQUENTIAL"
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
    "content": "쌍곡선 $2x^2-y^2=4$에 접하고 직선 $x+2y-5=0$에 수직인 접선의 방정식이 $ax-y+b=0$일 때, $|a|+|b|$의 값은? (단, $a, b$는 상수이다.)",
    "choices": [
      "3",
      "4",
      "5",
      "6",
      "7"
    ],
    "answer": "②",
    "solution": "직선 $x + 2y - 5 = 0$의 기울기는 $-\\frac{1}{2}$이므로 이 직선에 수직인 접선의 기울기는 $m = 2$입니다.\n쌍곡선 $2x^2 - y^2 = 4$의 양변을 $4$로 나누어 표준형으로 나타내면 $\\frac{x^2}{2} - \\frac{y^2}{4} = 1$이므로 $a^2 = 2, b^2 = 4$입니다.\n쌍곡선 $\\frac{x^2}{a^2} - \\frac{y^2}{b^2} = 1$에 접하고 기울기가 $m$인 접선의 방정식 공식 $y = mx \\pm \\sqrt{a^2 m^2 - b^2}$을 적용합니다.\n기울기 $m = 2$를 대입하면 $y = 2x \\pm \\sqrt{2 \\cdot 2^2 - 4} = 2x \\pm \\sqrt{8 - 4} = 2x \\pm 2$입니다.\n이 식을 $ax - y + b = 0$ 꼴로 이항하여 정리하면 $2x - y \\pm 2 = 0$입니다.\n따라서 $a = 2$이고 $b = 2$ 또는 $b = -2$입니다.\n절댓값의 합을 구하면 $|a| + |b| = |2| + |\\pm 2| = 2 + 2 = 4$입니다.\n따라서 정답은 ②이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-GEO-RPM-052",
    "problemTypeKey": "PT_GEO_CONIC_TANGENT",
    "templateKey": "TPL_GEO_CONIC_TANGENT_SLOPE_TANGENT",
    "crossConceptKeys": [
      "CC_PERPENDICULAR_SLOPE",
      "CC_Y_INTERCEPT"
    ],
    "conditionKeys": [],
    "integrationPattern": "NONE"
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
    "content": "쌍곡선 $\\frac{x^2}{2}-\\frac{y^2}{6}=-1$에 접하고 직선 $y=x-3$에 평행한 직선 중 $y$절편이 양수인 직선과 $x$축, $y$축으로 둘러싸인 부분의 넓이는?",
    "choices": [
      "2",
      "3",
      "4",
      "5",
      "6"
    ],
    "answer": "①",
    "solution": "직선 $y = x - 3$에 평행하므로 구하는 접선의 기울기는 $m = 1$입니다.\n쌍곡선의 방정식이 $\\frac{x^2}{2} - \\frac{y^2}{6} = -1$이므로 $a^2 = 2, b^2 = 6$입니다.\n쌍곡선 $\\frac{x^2}{a^2} - \\frac{y^2}{b^2} = -1$에 접하고 기울기가 $m$인 접선의 방정식 공식 $y = mx \\pm \\sqrt{b^2 - a^2 m^2}$을 적용합니다.\n$y$절편이 양수이므로 $y = 1 \\cdot x + \\sqrt{6 - 2 \\cdot 1^2} = x + \\sqrt{4} = x + 2$입니다.\n접선의 $x$절편은 $y=0$을 대입하면 $x + 2 = 0 \\implies x = -2$입니다.\n접선의 $y$절편은 $x=0$을 대입하면 $y = 2$입니다.\n직선과 좌표축으로 둘러싸인 직각삼각형의 넓이 $S$는 밑변의 길이가 $2$, 높이가 $2$이므로\n$S = \\frac{1}{2} \\times |-2| \\times 2 = \\frac{1}{2} \\times 2 \\times 2 = 2$입니다.\n따라서 정답은 ①이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-GEO-RPM-052",
    "problemTypeKey": "PT_GEO_CONIC_TANGENT",
    "templateKey": "TPL_GEO_CONIC_TANGENT_SLOPE_TANGENT",
    "crossConceptKeys": [
      "CC_PARALLEL_LINES",
      "CC_TRIANGLE_AREA"
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
    "content": "그림과 같이 쌍곡선 $3x^2-y^2=9$의 제1사분면 위의 점에서 접하고 기울기가 $m$인 직선과 $x$축 및 $y$축으로 둘러싸인 삼각형의 넓이가 $3$일 때, $m$의 값은?\n[그림: 좌표평면에 쌍곡선 $3x^2-y^2=9$가 그려져 있고, 제1사분면 위의 접점에서 그은 기울기 $m$인 접선이 $x$축의 양의 부분, $y$축의 음의 부분과 만나 이루는 직각삼각형 영역이 음영으로 칠해져 있다.]",
    "choices": [
      "1",
      "2",
      "3",
      "4",
      "5"
    ],
    "answer": "③",
    "solution": "쌍곡선 $3x^2 - y^2 = 9$의 양변을 $9$로 나누면 $\\frac{x^2}{3} - \\frac{y^2}{9} = 1$이므로 $a^2 = 3, b^2 = 9$입니다.\n접점이 제1사분면 위에 있으므로 접선의 기울기는 양수($m > 0$)이고, $y$절편은 음수입니다.\n기울기가 $m$인 쌍곡선의 접선의 방정식 공식 $y = mx \\pm \\sqrt{a^2 m^2 - b^2}$에서 $y$절편이 음수이므로\n접선의 방정식은 $y = mx - \\sqrt{3m^2 - 9}$ (단, $3m^2 - 9 > 0 \\implies m > \\sqrt{3}$)입니다.\n접선의 $x$절편은 $y=0$일 때 $x = \\frac{\\sqrt{3m^2 - 9}}{m}$이고, $y$절편은 $-\\sqrt{3m^2 - 9}$입니다.\n접선과 $x$축, $y$축으로 둘러싸인 직각삼각형의 넓이가 $3$이므로 넓이 공식에 의해\n$S = \\frac{1}{2} \\times \\frac{\\sqrt{3m^2 - 9}}{m} \\times \\sqrt{3m^2 - 9} = \\frac{3m^2 - 9}{2m} = 3$입니다.\n양변에 $2m$을 곱하여 정리하면 $3m^2 - 9 = 6m \\implies 3m^2 - 6m - 9 = 0$입니다.\n양변을 $3$으로 나누어 인수분해하면 $m^2 - 2m - 3 = 0 \\implies (m - 3)(m + 1) = 0$입니다.\n$m > \\sqrt{3}$이므로 조건을 만족하는 값은 $m = 3$입니다.\n따라서 정답은 ③이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-GEO-RPM-052",
    "problemTypeKey": "PT_GEO_CONIC_TANGENT",
    "templateKey": "TPL_GEO_CONIC_TANGENT_SLOPE_TANGENT",
    "crossConceptKeys": [
      "CC_TRIANGLE_AREA",
      "CC_X_INTERCEPT",
      "CC_Y_INTERCEPT"
    ],
    "conditionKeys": [
      "COND_RANGE"
    ],
    "integrationPattern": "SEQUENTIAL",
    "image": "assets/images/기하_081_쌍곡선의접선의방정식-기울기가주어진경우_고2_유형은행1/q4-problem.svg",
    "imageAlt": "기울기 m인 쌍곡선 접선과 두 좌표축이 만드는 음영 직각삼각형",
    "imageCaption": "기울기 m인 쌍곡선 접선과 두 좌표축이 만드는 음영 직각삼각형",
    "imageSize": "full"
  },
  {
    "id": 5,
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
    "content": "직선 $y=2x+3$이 쌍곡선 $\\frac{x^2}{5}-\\frac{y^2}{b}=1$에 접할 때, 쌍곡선의 두 초점 사이의 거리는? (단, $b>0$)",
    "choices": [
      "8",
      "10",
      "12",
      "14",
      "16"
    ],
    "answer": "①",
    "solution": "쌍곡선 $\\frac{x^2}{a^2} - \\frac{y^2}{b^2} = 1$에 접하고 기울기가 $m$인 접선의 방정식 공식은 $y = mx \\pm \\sqrt{a^2 m^2 - b^2}$입니다.\n직선 $y = 2x + 3$의 기울기는 $m = 2$이고 $y$절편은 $3$이므로 $3 = \\sqrt{5 \\cdot 2^2 - b}$가 성립합니다.\n양변을 제곱하여 풀면 $9 = 5 \\cdot 4 - b \\implies 9 = 20 - b \\implies b = 11$입니다.\n쌍곡선 $\\frac{x^2}{5} - \\frac{y^2}{11} = 1$의 초점의 좌표를 $(\\pm c, 0)$ ($c > 0$)이라 하면 쌍곡선의 초점 성질에 의해\n$c^2 = a^2 + b^2 = 5 + 11 = 16$입니다.\n$c > 0$이므로 $c = 4$입니다.\n따라서 두 초점 $(\\pm 4, 0)$ 사이의 거리는 $2c = 2 \\times 4 = 8$입니다.\n따라서 정답은 ①이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-GEO-RPM-052",
    "problemTypeKey": "PT_GEO_CONIC_TANGENT",
    "templateKey": "TPL_GEO_CONIC_TANGENT_SLOPE_TANGENT",
    "crossConceptKeys": [
      "CC_SLOPE_AND_INTERCEPT",
      "CC_DISTANCE_TWO_POINTS"
    ],
    "conditionKeys": [
      "COND_POSITIVE"
    ],
    "integrationPattern": "NONE"
  },
  {
    "id": 6,
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
    "content": "쌍곡선 $\\frac{x^2}{10}-\\frac{y^2}{4}=1$에 접하고 직선 $y=x+3$에 평행한 두 직선 사이의 거리는?",
    "choices": [
      "\\sqrt{3}",
      "2",
      "\\sqrt{6}",
      "2\\sqrt{2}",
      "2\\sqrt{3}"
    ],
    "answer": "⑤",
    "solution": "직선 $y = x + 3$에 평행하므로 구하는 두 접선의 기울기는 $m = 1$입니다.\n쌍곡선의 방정식이 $\\frac{x^2}{10} - \\frac{y^2}{4} = 1$이므로 $a^2 = 10, b^2 = 4$입니다.\n기울기가 $m=1$인 쌍곡선의 접선의 방정식 공식 $y = mx \\pm \\sqrt{a^2 m^2 - b^2}$을 적용합니다.\n접선의 방정식은 $y = 1 \\cdot x \\pm \\sqrt{10 \\cdot 1^2 - 4} = x \\pm \\sqrt{6}$입니다.\n두 접선을 일반형으로 나타내면 각각 $x - y + \\sqrt{6} = 0$과 $x - y - \\sqrt{6} = 0$입니다.\n평행한 두 직선 $Ax + By + C_1 = 0$, $Ax + By + C_2 = 0$ 사이의 거리 공식 $d = \\frac{|C_1 - C_2|}{\\sqrt{A^2 + B^2}}$에 대입합니다.\n$d = \\frac{|\\sqrt{6} - (-\\sqrt{6})|}{\\sqrt{1^2 + (-1)^2}} = \\frac{2\\sqrt{6}}{\\sqrt{2}} = 2\\sqrt{3}$입니다.\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-GEO-RPM-052",
    "problemTypeKey": "PT_GEO_CONIC_TANGENT",
    "templateKey": "TPL_GEO_CONIC_TANGENT_SLOPE_TANGENT",
    "crossConceptKeys": [
      "CC_PARALLEL_LINE_DISTANCE",
      "CC_PARALLEL_LINES"
    ],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 7,
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
    "content": "쌍곡선 $2x^2-y^2=c \\;(c>0)$에 접하고 기울기가 2인 두 직선 사이의 거리가 $2$일 때, 상수 $c$의 값은?",
    "choices": [
      "1",
      "2",
      "3",
      "4",
      "5"
    ],
    "answer": "⑤",
    "solution": "쌍곡선의 양변을 $c$로 나누어 표준형으로 나타내면 $\\frac{x^2}{c/2} - \\frac{y^2}{c} = 1$이므로 $a^2 = \\frac{c}{2}, b^2 = c$입니다.\n기울기가 $m = 2$인 접선의 방정식 공식 $y = mx \\pm \\sqrt{a^2 m^2 - b^2}$을 적용합니다.\n대입하면 $y = 2x \\pm \\sqrt{\\frac{c}{2} \\cdot 2^2 - c} = 2x \\pm \\sqrt{2c - c} = 2x \\pm \\sqrt{c}$입니다.\n두 접선의 방정식을 일반형으로 나타내면 $2x - y + \\sqrt{c} = 0$과 $2x - y - \\sqrt{c} = 0$입니다.\n평행한 두 직선 사이의 거리 공식 $d = \\frac{|C_1 - C_2|}{\\sqrt{A^2 + B^2}}$에 대입하면\n$d = \\frac{|\\sqrt{c} - (-\\sqrt{c})|}{\\sqrt{2^2 + (-1)^2}} = \\frac{2\\sqrt{c}}{\\sqrt{5}}$입니다.\n조건에서 두 직선 사이의 거리가 $2$이므로\n$\\frac{2\\sqrt{c}}{\\sqrt{5}} = 2 \\implies \\sqrt{c} = \\sqrt{5}$입니다.\n양변을 제곱하여 상수 $c$의 값을 구하면 $c = 5$입니다.\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-GEO-RPM-052",
    "problemTypeKey": "PT_GEO_CONIC_TANGENT",
    "templateKey": "TPL_GEO_CONIC_TANGENT_SLOPE_TANGENT",
    "crossConceptKeys": [
      "CC_PARALLEL_LINE_DISTANCE"
    ],
    "conditionKeys": [
      "COND_POSITIVE"
    ],
    "integrationPattern": "NONE"
  },
  {
    "id": 8,
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
    "content": "그림과 같이 쌍곡선 $x^2-25y^2=25$의 점근선 중 기울기가 양인 직선을 $l$, 기울기가 1이고 쌍곡선 $x^2-25y^2=25 \\;(x>0)$에 접하는 직선을 $m$이라 하자. 두 직선 $l, m$의 교점을 $\\mathrm{A}$, 직선 $m$과 $x$축의 교점을 $\\mathrm{B}$라 할 때, 삼각형 $\\mathrm{AOB}$의 넓이는? (단, $\\mathrm{O}$는 원점이다.)\n[그림: 좌표평면에 쌍곡선 $x^2-25y^2=25$와 두 점근선이 그려져 있고, 기울기가 양인 점근선 $l$과 쌍곡선의 오른쪽 부분에 접하고 기울기가 1인 접선 $m$이 점 $\\mathrm{A}$에서 만나며, 직선 $m$이 $x$축과 만나는 점이 $\\mathrm{B}$로 표시되어 원점 $\\mathrm{O}$와 함께 삼각형 $\\mathrm{AOB}$를 이루고 있다.]",
    "choices": [
      "3",
      "4",
      "5",
      "6",
      "7"
    ],
    "answer": "①",
    "solution": "쌍곡선 $x^2 - 25y^2 = 25$의 양변을 $25$로 나누면 $\\frac{x^2}{25} - \\frac{y^2}{1} = 1$이므로 $a = 5, b = 1$입니다.\n쌍곡선의 점근선의 방정식은 $y = \\pm \\frac{b}{a}x = \\pm \\frac{1}{5}x$이므로 기울기가 양인 점근선은 $l: y = \\frac{1}{5}x$입니다.\n기울기가 $1$이고 $x>0$인 부분에 접하는 직선 $m$은 $y$절편이 음수이므로\n$m: y = 1 \\cdot x - \\sqrt{a^2 \\cdot 1^2 - b^2} = x - \\sqrt{25 - 1} = x - \\sqrt{24} = x - 2\\sqrt{6}$입니다.\n직선 $m$과 $x$축의 교점 $\\mathrm{B}$는 $y=0$일 때 $x = 2\\sqrt{6}$이므로 $\\mathrm{B}(2\\sqrt{6}, 0)$이고 밑변의 길이는 $\\overline{\\mathrm{OB}} = 2\\sqrt{6}$입니다.\n두 직선 $l$과 $m$의 교점 $\\mathrm{A}$의 좌표를 구하기 위해 연립하면\n$\\frac{1}{5}x = x - 2\\sqrt{6} \\implies \\frac{4}{5}x = 2\\sqrt{6} \\implies x = 2\\sqrt{6} \\times \\frac{5}{4} = \\frac{5\\sqrt{6}}{2}$입니다.\n점 $\\mathrm{A}$의 $y$좌표(삼각형의 높이)는 $y = \\frac{1}{5}x = \\frac{1}{5} \\times \\frac{5\\sqrt{6}}{2} = \\frac{\\sqrt{6}}{2}$입니다.\n삼각형 $\\mathrm{AOB}$의 넓이 $S$를 계산합니다:\n$S = \\frac{1}{2} \\times \\overline{\\mathrm{OB}} \\times y_A = \\frac{1}{2} \\times 2\\sqrt{6} \\times \\frac{\\sqrt{6}}{2} = \\frac{12}{4} = 3$입니다.\n따라서 정답은 ①이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-GEO-RPM-052",
    "problemTypeKey": "PT_GEO_CONIC_TANGENT",
    "templateKey": "TPL_GEO_CONIC_TANGENT_SLOPE_TANGENT",
    "crossConceptKeys": [
      "CC_LINE_INTERSECTION",
      "CC_TRIANGLE_AREA",
      "CC_X_INTERCEPT"
    ],
    "conditionKeys": [
      "COND_POSITIVE"
    ],
    "integrationPattern": "SEQUENTIAL",
    "image": "assets/images/기하_081_쌍곡선의접선의방정식-기울기가주어진경우_고2_유형은행1/q8-problem.svg",
    "imageAlt": "쌍곡선의 점근선 l과 기울기 1인 접선 m이 만드는 삼각형 AOB",
    "imageCaption": "쌍곡선의 점근선 l과 기울기 1인 접선 m이 만드는 삼각형 AOB",
    "imageSize": "full"
  },
  {
    "id": 9,
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
    "content": "쌍곡선 $\\frac{x^2}{3}-\\frac{y^2}{12}=-1$의 점근선 중 기울기가 양수인 것과 평행한 직선 $l$이 쌍곡선 $\\frac{x^2}{4}-\\frac{y^2}{12}=1$에 접한다. 직선 $l$의 $y$절편이 양수일 때, 점 $(0, 1)$과 직선 $l$ 사이의 거리는?",
    "choices": [
      "\\frac{\\sqrt{5}}{5}",
      "\\frac{2\\sqrt{5}}{5}",
      "\\frac{3\\sqrt{5}}{5}",
      "\\frac{4\\sqrt{5}}{5}",
      "\\sqrt{5}"
    ],
    "answer": "①",
    "solution": "쌍곡선 $\\frac{x^2}{3} - \\frac{y^2}{12} = -1$의 점근선의 방정식은 $y = \\pm \\sqrt{\\frac{12}{3}}x = \\pm 2x$입니다.\n이 중 기울기가 양수인 점근선의 기울기는 $m = 2$이므로, 직선 $l$의 기울기는 $m = 2$입니다.\n직선 $l$이 쌍곡선 $\\frac{x^2}{4} - \\frac{y^2}{12} = 1$에 접하고 $y$절편이 양수이므로, 접선의 방정식 공식 $y = mx + \\sqrt{a^2 m^2 - b^2}$을 적용합니다.\n$y = 2x + \\sqrt{4 \\cdot 2^2 - 12} = 2x + \\sqrt{16 - 12} = 2x + \\sqrt{4} = 2x + 2$입니다.\n직선 $l$의 방정식을 일반형으로 나타내면 $2x - y + 2 = 0$입니다.\n점 $(0, 1)$과 직선 $2x - y + 2 = 0$ 사이의 거리 공식 $d = \\frac{|Ax_0 + By_0 + C|}{\\sqrt{A^2 + B^2}}$에 대입합니다.\n$d = \\frac{|2 \\cdot 0 - 1 + 2|}{\\sqrt{2^2 + (-1)^2}} = \\frac{1}{\\sqrt{5}} = \\frac{\\sqrt{5}}{5}$입니다.\n따라서 정답은 ①이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-GEO-RPM-052",
    "problemTypeKey": "PT_GEO_CONIC_TANGENT",
    "templateKey": "TPL_GEO_CONIC_TANGENT_SLOPE_TANGENT",
    "crossConceptKeys": [
      "CC_POINT_TO_LINE_DISTANCE",
      "CC_PARALLEL_LINES"
    ],
    "conditionKeys": [
      "COND_POSITIVE"
    ],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 10,
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
    "content": "좌표평면에서 쌍곡선 $\\frac{x^2}{a^2}-\\frac{y^2}{b^2}=1$의 한 점근선에 평행하고 타원 $\\frac{x^2}{9a^2}+\\frac{y^2}{3b^2}=1$에 접하는 직선을 $l$이라 하자. 원점과 직선 $l$ 사이의 거리가 1일 때, $\\frac{1}{a^2}+\\frac{1}{b^2}$의 값은? (단, $a, b$는 양의 상수이다.)",
    "choices": [
      "8",
      "9",
      "10",
      "11",
      "12"
    ],
    "answer": "⑤",
    "solution": "쌍곡선 $\\frac{x^2}{a^2} - \\frac{y^2}{b^2} = 1$의 점근선의 방정식은 $y = \\pm \\frac{b}{a}x$이므로 점근선의 기울기 $m$에 대하여 $m^2 = \\frac{b^2}{a^2}$이 성립합니다.\n타원 $\\frac{x^2}{9a^2} + \\frac{y^2}{3b^2} = 1$에 접하고 기울기가 $m$인 직선 $l$의 방정식 공식은 $y = mx \\pm \\sqrt{9a^2 m^2 + 3b^2}$입니다.\n직선 $l$을 일반형으로 정리하면 $mx - y \\pm \\sqrt{9a^2 m^2 + 3b^2} = 0$입니다.\n원점 $(0, 0)$과 직선 $l$ 사이의 거리가 $1$이므로 점과 직선 사이의 거리 공식에 의해\n$d = \\frac{\\sqrt{9a^2 m^2 + 3b^2}}{\\sqrt{m^2 + (-1)^2}} = 1 \\implies \\frac{9a^2 m^2 + 3b^2}{m^2 + 1} = 1$입니다.\n양변에 $m^2 + 1$을 곱하면 $9a^2 m^2 + 3b^2 = m^2 + 1$입니다.\n여기에 $m^2 = \\frac{b^2}{a^2}$을 대입하여 정리하면\n$9a^2 \\left(\\frac{b^2}{a^2}\\right) + 3b^2 = \\frac{b^2}{a^2} + 1 \\implies 9b^2 + 3b^2 = \\frac{b^2}{a^2} + 1 \\implies 12b^2 = \\frac{b^2}{a^2} + 1$입니다.\n양변을 $b^2$ ($b > 0$)으로 나누어 약분하면\n$12 = \\frac{1}{a^2} + \\frac{1}{b^2}$입니다.\n따라서 구하는 식의 값은 $\\frac{1}{a^2} + \\frac{1}{b^2} = 12$입니다.\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B45",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-GEO-RPM-052",
    "problemTypeKey": "PT_GEO_CONIC_TANGENT",
    "templateKey": "TPL_GEO_CONIC_TANGENT_SLOPE_TANGENT",
    "crossConceptKeys": [
      "CC_POINT_TO_LINE_DISTANCE",
      "CC_ELLIPSE"
    ],
    "conditionKeys": [
      "COND_POSITIVE"
    ],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 11,
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
    "content": "다음 조건을 만족하는 상수 $a, b, c$에 대하여 $a+b+c$의 값은?\n\n(가) 직선 $y=2x+2$를 $x$축의 방향으로 $a$만큼 평행이동한 직선이 포물선 $y^2=8x$에 접할 때, 상수 $a$의 값\n(나) 직선 $y=2x+2$를 $x$축의 방향으로 $b$만큼 평행이동한 직선이 타원 $\\frac{x^2}{2}+\\frac{y^2}{8}=1$에 접할 때, 양수 $b$의 값\n(다) 직선 $y=2x+2$를 $x$축의 방향으로 $c$만큼 평행이동한 직선이 쌍곡선 $\\frac{x^2}{4}-\\frac{y^2}{7}=1$과 제1사분면에서 접할 때, 상수 $c$의 값",
    "choices": [
      "5",
      "6",
      "7",
      "8",
      "9"
    ],
    "answer": "②",
    "solution": "직선 $y = 2x + 2$를 $x$축의 방향으로 $t$만큼 평행이동한 직선의 방정식은 $y = 2(x - t) + 2 = 2x + 2 - 2t$이며, 이 직선의 기울기는 $m = 2$입니다.\n(가) 포물선 $y^2 = 8x$에서 $4p = 8 \\implies p = 2$입니다.\n기울기가 $m = 2$인 포물선의 접선의 방정식 공식 $y = mx + \\frac{p}{m}$에 의해 $y = 2x + \\frac{2}{2} = 2x + 1$입니다.\n따라서 $2 - 2a = 1 \\implies 2a = 1 \\implies a = \\frac{1}{2}$입니다.\n(나) 타원 $\\frac{x^2}{2} + \\frac{y^2}{8} = 1$에 접하고 기울기가 $2$인 접선의 방정식 공식 $y = mx \\pm \\sqrt{A^2 m^2 + B^2}$에 의해\n$y = 2x \\pm \\sqrt{2 \\cdot 2^2 + 8} = 2x \\pm \\sqrt{16} = 2x \\pm 4$입니다.\n(i) $2 - 2b = 4$일 때: $2b = -2 \\implies b = -1$ (음수이므로 모순).\n(ii) $2 - 2b = -4$일 때: $2b = 6 \\implies b = 3$ (양수이므로 적합).\n따라서 $b = 3$입니다.\n(다) 쌍곡선 $\\frac{x^2}{4} - \\frac{y^2}{7} = 1$과 제1사분면에서 접하는 직선은 기울기 $m = 2 > 0$이고 $y$절편이 음수입니다.\n접선의 방정식 공식 $y = mx - \\sqrt{A^2 m^2 - B^2}$에 의해 $y = 2x - \\sqrt{4 \\cdot 2^2 - 7} = 2x - \\sqrt{9} = 2x - 3$입니다.\n따라서 $2 - 2c = -3 \\implies 2c = 5 \\implies c = \\frac{5}{2}$입니다.\n세 상수의 합을 구하면 $a + b + c = \\frac{1}{2} + 3 + \\frac{5}{2} = 6$입니다.\n따라서 정답은 ②이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-GEO-RPM-052",
    "problemTypeKey": "PT_GEO_CONIC_TANGENT",
    "templateKey": "TPL_GEO_CONIC_TANGENT_SLOPE_TANGENT",
    "crossConceptKeys": [
      "CC_TRANSLATION",
      "CC_ELLIPSE",
      "CC_PARABOLA"
    ],
    "conditionKeys": [
      "COND_POSITIVE"
    ],
    "integrationPattern": "SEQUENTIAL"
  }
];
