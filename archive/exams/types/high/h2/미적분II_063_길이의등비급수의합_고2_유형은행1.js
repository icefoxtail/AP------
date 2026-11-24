window.examTitle = "미적분II_063_길이의등비급수의합_고2_유형은행1";

window.questionBank = [
  {
    "id": 1,
    "category": "급수",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-02",
    "standardUnit": "급수",
    "standardUnitOrder": 2,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "급수"
    ],
    "wide": false,
    "content": "높이 $20\\,\\mathrm m$에서 떨어뜨린 공이 지면에 닿을 때마다 직전 낙하 높이의 $2/5$만큼 튀어 오른다. 공이 처음 지면에 닿은 뒤부터 정지할 때까지 위로 이동한 거리의 합은?",
    "choices": [
      "$\\frac{20}{3}\\,\\mathrm m$",
      "$12\\,\\mathrm m$",
      "$\\frac{40}{3}\\,\\mathrm m$",
      "$16\\,\\mathrm m$",
      "$20\\,\\mathrm m$"
    ],
    "answer": "③",
    "solution": "처음 지면에 닿은 뒤 첫 상승 높이는 $20\\times\\frac{2}{5}=8\\,(\\mathrm m)$이다.\n상승 높이는 매번 직전 높이의 $\\frac{2}{5}$배이므로 첫째항 $8$, 공비 $\\frac{2}{5}$인 등비수열을 이룬다.\n위로 이동한 거리의 합은 등비급수 공식 $S=\\frac{a}{1-r}$로 구한다.\n$S=\\frac{8}{1-\\frac{2}{5}}=\\frac{8}{\\frac{3}{5}}=\\frac{40}{3}\\,(\\mathrm m)$이다.\n주의: 처음 지면에 닿기 전의 낙하 거리 $20\\,\\mathrm m$는 위로 이동한 거리가 아니므로 포함하지 않는다.\n따라서 정답은 ③이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "B12",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-065",
    "problemTypeKey": "PT_CALCULUS_SERIES",
    "templateKey": "TPL_CALCULUS_SERIES_GEOMETRIC_APPLICATION",
    "crossConceptKeys": [
      "CC_GEOMETRIC_SEQUENCE"
    ],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 2,
    "category": "급수",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-02",
    "standardUnit": "급수",
    "standardUnitOrder": 2,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "급수"
    ],
    "wide": false,
    "content": "높이 $h$에서 떨어뜨린 공은 지면에 닿을 때마다 직전 낙하 높이의 $3/5$만큼 튀어 오른다. 정지할 때까지 움직인 거리가 $72\\,\\mathrm m$라면 $h$는?",
    "choices": [
      "$12\\,\\mathrm m$",
      "$14\\,\\mathrm m$",
      "$16\\,\\mathrm m$",
      "$18\\,\\mathrm m$",
      "$20\\,\\mathrm m$"
    ],
    "answer": "④",
    "solution": "첫 낙하 거리는 $h$이고 첫 번째 상승 높이는 $\\frac{3}{5}h$이다.\n상승 높이는 첫째항 $\\frac{3}{5}h$, 공비 $\\frac{3}{5}$인 등비수열이므로 그 합은 $\\frac{\\frac{3}{5}h}{1-\\frac{3}{5}}$이다.\n$1-\\frac{3}{5}=\\frac{2}{5}$이므로 상승 높이의 합은 $\\frac{\\frac{3}{5}h}{\\frac{2}{5}}=\\frac{3h}{2}$이다.\n상승할 때와 하강할 때 같은 거리를 두 번 움직이므로 왕복 거리의 합은 $2\\times\\frac{3h}{2}=3h$이다.\n정지할 때까지의 총 이동 거리는 첫 낙하와 왕복을 더한 $h+3h=4h$이다.\n$4h=72$에서 $h=18\\,(\\mathrm m)$이다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-065",
    "problemTypeKey": "PT_CALCULUS_SERIES",
    "templateKey": "TPL_CALCULUS_SERIES_GEOMETRIC_APPLICATION",
    "crossConceptKeys": [
      "CC_GEOMETRIC_SEQUENCE"
    ],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 3,
    "category": "급수",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-02",
    "standardUnit": "급수",
    "standardUnitOrder": 2,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "급수"
    ],
    "wide": false,
    "content": "길이 $3\\,\\mathrm m$인 진자를 연직선 왼쪽으로 $\\theta$라디안만큼 당겼다가 놓는다. 추는 최저점을 지날 때마다 반대편에서 직전 최대 각도의 $1/2$까지 올라간다. 놓은 순간부터 정지할 때까지 추의 이동 거리는?\\n[그림: 고정점에서 아래로 연직선을 긋고, 연직선과 왼쪽으로 $\\theta$, 오른쪽으로 $\\theta/2$를 이루는 길이 $3\\,\\mathrm m$인 두 선분을 그린다. 두 끝점을 최저점을 지나는 원호로 연결한다.]",
    "choices": [
      "$3\\theta\\,\\mathrm m$",
      "$5\\theta\\,\\mathrm m$",
      "$7\\theta\\,\\mathrm m$",
      "$9\\theta\\,\\mathrm m$",
      "$11\\theta\\,\\mathrm m$"
    ],
    "answer": "④",
    "solution": "반지름 $3\\,\\mathrm m$, 중심각 $\\theta$인 원호의 길이는 $3\\theta$이므로 처음 최저점까지의 이동 거리는 $3\\theta\\,(\\mathrm m)$이다.\n최저점을 지난 뒤 오른쪽 최대 각도는 $\\frac{\\theta}{2}$이므로 올라가는 원호의 길이는 $3\\times\\frac{\\theta}{2}=\\frac{3\\theta}{2}$이다.\n다시 최저점까지 내려오는 원호도 $\\frac{3\\theta}{2}$이므로 첫 왕복 거리는 $2\\times\\frac{3\\theta}{2}=3\\theta$이다.\n다음 왕복은 최대 각도가 $\\frac{\\theta}{4}$가 되어 거리가 $2\\times3\\times\\frac{\\theta}{4}=\\frac{3\\theta}{2}$이고, 이후 왕복 거리는 공비 $\\frac{1}{2}$로 줄어든다.\n따라서 최저점 이후 왕복 거리의 합은 첫째항 $3\\theta$, 공비 $\\frac{1}{2}$인 등비급수이므로 $\\frac{3\\theta}{1-\\frac{1}{2}}=6\\theta$이다.\n전체 이동 거리는 처음 $3\\theta$와 왕복 합 $6\\theta$를 더한 $3\\theta+6\\theta=9\\theta\\,(\\mathrm m)$이다.\n주의: 처음 최저점까지는 편도로 한 번만 움직이므로 $3\\theta$를 두 번 더하지 않는다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-065",
    "problemTypeKey": "PT_CALCULUS_SERIES",
    "templateKey": "TPL_CALCULUS_SERIES_GEOMETRIC_APPLICATION",
    "crossConceptKeys": [],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
  }
];
