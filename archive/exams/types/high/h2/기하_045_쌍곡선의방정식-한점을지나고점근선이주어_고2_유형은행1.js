window.examTitle = "기하_045_쌍곡선의방정식-한점을지나고점근선이주어_고2_유형은행1";

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
    "content": "쌍곡선 $\\dfrac{x^2}{a^2} - \\dfrac{y^2}{b^2} = 1$이 점 $(5, 2)$를 지나고 두 점근선의 방정식이 $y=\\dfrac{1}{2}x$, $y=-\\dfrac{1}{2}x$이다. 이 쌍곡선의 주축의 길이는? (단, $a, b$는 양의 상수이다.)",
    "choices": [
      "6",
      "8",
      "10",
      "12",
      "14"
    ],
    "answer": "①",
    "solution": "[점근선의 성질로 $a$와 $b$의 관계식 구하기] 쌍곡선 $\\dfrac{x^2}{a^2} - \\dfrac{y^2}{b^2} = 1$의 점근선의 방정식은 $y = \\pm \\dfrac{b}{a}x$이므로 $\\dfrac{b}{a} = \\dfrac{1}{2}$에서 $a = 2b$, 양변을 제곱하면 $a^2 = 4b^2$이다.\n[쌍곡선의 방정식에 대입하여 정리하기] $a^2 = 4b^2$을 쌍곡선의 방정식에 대입하면 $\\dfrac{x^2}{4b^2} - \\dfrac{y^2}{b^2} = 1$이고, 양변에 $4b^2$을 곱하면 $x^2 - 4y^2 = 4b^2$이다.\n[지나는 점의 좌표 대입하여 $b^2$ 구하기] 이 쌍곡선이 점 $(5, 2)$를 지나므로 $x=5, y=2$를 대입하면 $5^2 - 4 \\times 2^2 = 4b^2$에서 $25 - 16 = 4b^2$, 즉 $4b^2 = 9$이므로 $b^2 = \\dfrac{9}{4}$이다.\n[$a$의 값 구하기] $a^2 = 4b^2 = 9$이고 문제 조건에서 $a>0$이므로 $a = 3$이다.\n[주축의 길이 계산하기] 쌍곡선 $\\dfrac{x^2}{a^2} - \\dfrac{y^2}{b^2} = 1$의 꼭짓점의 좌표는 $(a, 0)$과 $(-a, 0)$이므로 주축의 길이는 $2a = 2 \\times 3 = 6$이다.\n주의: 점근선의 기울기로부터 $a$와 $b$의 비례식을 세운 후 지나는 점을 대입해야 하며, 주축의 길이는 $a$가 아닌 $2a$임에 유의한다.\n따라서 정답은 ①이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-GEO-RPM-044",
    "problemTypeKey": "PT_GEO_HYPERBOLA",
    "templateKey": "TPL_GEO_HYPERBOLA_ASYMPTOTE_AXIS",
    "crossConceptKeys": [],
    "conditionKeys": [
      "COND_POSITIVE"
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
    "content": "쌍곡선 $\\dfrac{x^2}{a^2} - \\dfrac{y^2}{b^2} = 1$이 점 $(6, 3)$을 지나고 두 점근선이 서로 수직일 때, 이 쌍곡선의 두 초점 사이의 거리는? (단, $a, b$는 양의 상수이다.)",
    "choices": [
      "2\\sqrt{6}",
      "3\\sqrt{6}",
      "4\\sqrt{6}",
      "5\\sqrt{6}",
      "6\\sqrt{6}"
    ],
    "answer": "⑤",
    "solution": "[두 점근선의 수직 조건 적용하기] 쌍곡선 $\\dfrac{x^2}{a^2} - \\dfrac{y^2}{b^2} = 1$의 두 점근선의 방정식은 $y = \\dfrac{b}{a}x$와 $y = -\\dfrac{b}{a}x$이다.\n[기울기의 곱으로 $a$와 $b$의 관계식 구하기] 두 점근선이 서로 수직이므로 두 직선의 기울기의 곱은 $\\left(\\dfrac{b}{a}\\right) \\times \\left(-\\dfrac{b}{a}\\right) = -1$에서 $-\\dfrac{b^2}{a^2} = -1$이므로 $a^2 = b^2$, 즉 $a = b$ ($a>0, b>0$)이다.\n[쌍곡선의 방정식 정리하기] $b^2 = a^2$을 대입하면 쌍곡선의 방정식은 $\\dfrac{x^2}{a^2} - \\dfrac{y^2}{a^2} = 1$에서 $x^2 - y^2 = a^2$이다.\n[지나는 점의 좌표 대입하여 $a^2, b^2$ 구하기] 이 쌍곡선이 점 $(6, 3)$을 지나므로 $x=6, y=3$을 대입하면 $6^2 - 3^2 = a^2$에서 $a^2 = 36 - 9 = 27$이고, $b^2 = a^2 = 27$이다.\n[초점의 좌표 공식 적용하기] 쌍곡선의 두 초점을 $\\mathrm{F}(c, 0)$, $\\mathrm{F'}(-c, 0)$이라 하면 초점 공식 $c^2 = a^2 + b^2$에 의해 $c^2 = 27 + 27 = 54$이다.\n[$c$의 값과 두 초점 사이의 거리 계산하기] $c>0$이므로 $c = \\sqrt{54} = 3\\sqrt{6}$이고, 두 초점 사이의 거리는 $2c = 2 \\times 3\\sqrt{6} = 6\\sqrt{6}$이다.\n주의: 두 점근선이 서로 수직인 쌍곡선(직각쌍곡선)에서는 항상 $a=b$가 성립하며, 구하는 대상은 초점의 $x$좌표 $c$가 아니라 두 초점 사이의 거리 $2c$이다.\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-GEO-RPM-044",
    "problemTypeKey": "PT_GEO_HYPERBOLA",
    "templateKey": "TPL_GEO_HYPERBOLA_ASYMPTOTE_AXIS",
    "crossConceptKeys": [
      "CC_PERPENDICULAR"
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
    "content": "두 직선 $y=2x-3$과 $y=-2x+1$을 점근선으로 하고 점 $(4, 3)$을 지나는 쌍곡선의 두 초점 사이의 거리는?",
    "choices": [
      "10",
      "12",
      "14",
      "16",
      "18"
    ],
    "answer": "①",
    "solution": "[점근선의 교점으로 쌍곡선의 중심 구하기] 두 점근선의 방정식 $y=2x-3$과 $y=-2x+1$을 연립하면 $2x-3 = -2x+1$에서 $4x = 4$이므로 $x = 1$이고, $y = 2(1) - 3 = -1$이다. 따라서 쌍곡선의 중심은 $(1, -1)$이다.\n[점근선의 기울기로 $a$와 $b$의 관계식 구하기] 점근선의 기울기가 $\\pm 2$이므로 $\\dfrac{b}{a} = 2$에서 $b = 2a$, 양변을 제곱하면 $b^2 = 4a^2$이다.\n[쌍곡선의 방정식 형태 설정하기] 중심이 $(1, -1)$인 쌍곡선의 방정식은 주축의 방향에 따라 $\\dfrac{(x-1)^2}{a^2} - \\dfrac{(y+1)^2}{4a^2} = \\pm 1$로 둘 수 있다.\n[지나는 점을 대입하여 주축의 방향과 $a^2$ 결정하기] 점 $(4, 3)$을 좌변에 대입하면 $\\dfrac{(4-1)^2}{a^2} - \\dfrac{(3+1)^2}{4a^2} = \\dfrac{9}{a^2} - \\dfrac{16}{4a^2} = \\dfrac{9-4}{a^2} = \\dfrac{5}{a^2}$이다. $a^2 > 0$이므로 $\\dfrac{5}{a^2} > 0$이 되어 우변은 $+1$이고, $\\dfrac{5}{a^2} = 1$에서 $a^2 = 5$이다.\n[$b^2$의 값 구하기] $b^2 = 4a^2$이므로 $b^2 = 4 \\times 5 = 20$이다.\n[초점 사이의 거리 계산하기] 초점 공식 $c^2 = a^2 + b^2$에 의해 $c^2 = 5 + 20 = 25$이므로 $c = 5$이다.\n[두 초점 사이의 거리 구하기] 두 초점 사이의 거리는 $2c = 2 \\times 5 = 10$이다.\n주의: 점근선의 교점이 쌍곡선의 중심이므로 평행이동된 표준형 방정식을 세워야 하며, 지나는 점을 대입했을 때 좌변의 부호에 따라 우변이 $1$인지 $-1$인지 반드시 판별해야 한다.\n따라서 정답은 ①이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-GEO-RPM-044",
    "problemTypeKey": "PT_GEO_HYPERBOLA",
    "templateKey": "TPL_GEO_HYPERBOLA_ASYMPTOTE_AXIS",
    "crossConceptKeys": [
      "CC_LINE_INTERSECTION",
      "CC_TRANSLATION"
    ],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
  }
];
