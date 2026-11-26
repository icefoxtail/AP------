window.examTitle = "기하_089_정육각형의벡터의연산2_고2_유형은행1";

window.questionBank = [
  {
    "id": 1,
    "category": "벡터의 성분",
    "standardCourse": "기하",
    "curriculum": "2022",
    "standardUnitKey": "H22-GE-05",
    "standardUnit": "벡터의 연산",
    "standardUnitOrder": 5,
    "subUnitKey": "H22-GE-05-VECTOR_COMPONENT",
    "subUnit": "벡터의 성분",
    "subUnitConfidence": "candidate_evidence",
    "subUnitClassificationDepth": "complete_candidate",
    "conceptClusterKey": "H22_GE_05_VECTOR_COMPONENT",
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "벡터의 성분"
    ],
    "wide": false,
    "content": "오른쪽 그림과 같이 한 변의 길이가 $2$인 정육각형 $\\mathrm{ABCDEF}$에서 $\\vec{\\mathrm{AB}} = \\vec{a}$, $\\vec{\\mathrm{BC}} = \\vec{b}$, $\\vec{\\mathrm{CD}} = \\vec{c}$라 할 때, 다음 [보기]에서 옳은 것만을 있는 대로 고른 것은? [그림: 한 변의 길이가 $2$인 정육각형 $\\mathrm{ABCDEF}$에서 변 $\\mathrm{AB, BC, CD}$에 각각 벡터 $\\vec{a}, \\vec{b}, \\vec{c}$가 표시되어 있다.]\n\n<보기>\nㄱ. $|\\vec{a} + \\vec{b} - \\vec{c}| = 2\\sqrt{3}$\nㄴ. $|\\vec{b} - \\vec{a} + \\vec{c}| = 4$\nㄷ. $|\\vec{a} - \\vec{b} - \\vec{c}| = 2$",
    "choices": [
      "ㄱ",
      "ㄴ",
      "ㄱ, ㄴ",
      "ㄴ, ㄷ",
      "ㄱ, ㄴ, ㄷ"
    ],
    "answer": "②",
    "solution": "정육각형의 세 대각선의 교점을 $\\mathrm{O}$라 하고 정육각형의 벡터 합성 성질을 이용한다.\n마름모 $\\mathrm{ABOF}$에서 $\\vec{\\mathrm{AO}} = \\vec{\\mathrm{AB}} + \\vec{\\mathrm{AF}} = \\vec{\\mathrm{AB}} + \\vec{\\mathrm{CD}} = \\vec{a} + \\vec{c}$이다.\n또한 변 $\\mathrm{BC}$는 대각선 $\\mathrm{AO}$와 평행하고 길이가 같으므로 $\\vec{b} = \\vec{\\mathrm{AO}} = \\vec{a} + \\vec{c}$가 성립한다.\nㄱ. 벡터의 합과 차를 대입하여 정리하면\n$\\vec{a} + \\vec{b} - \\vec{c} = (\\vec{\\mathrm{AB}} + \\vec{\\mathrm{BC}}) - \\vec{\\mathrm{CD}} = \\vec{\\mathrm{AC}} - \\vec{\\mathrm{AF}} = \\vec{\\mathrm{FC}}$\n선분 $\\mathrm{FC}$는 정육각형의 중심을 지나는 대각선이므로 그 길이는 한 변의 길이의 $2$배인 $2 \\times 2 = 4$이다.\n따라서 $|\\vec{a} + \\vec{b} - \\vec{c}| = 4 \\ne 2\\sqrt{3}$이다. (거짓)\nㄴ. 관계식 $\\vec{b} = \\vec{a} + \\vec{c}$를 대입하면\n$\\vec{b} - \\vec{a} + \\vec{c} = (\\vec{a} + \\vec{c}) - \\vec{a} + \\vec{c} = 2\\vec{c}$\n따라서 그 크기는 $|2\\vec{c}| = 2|\\vec{c}| = 2 \\times 2 = 4$이다. (참)\nㄷ. 관계식 $\\vec{b} = \\vec{a} + \\vec{c}$를 대입하면\n$\\vec{a} - \\vec{b} - \\vec{c} = \\vec{a} - (\\vec{a} + \\vec{c}) - \\vec{c} = -2\\vec{c}$\n주의: $\\vec{a} - \\vec{b} + \\vec{c} = \\vec{0}$인 것과 혼동하여 크기를 $2$ 또는 $0$으로 착각하지 않도록 한다.\n따라서 크기는 $|-2\\vec{c}| = 2|\\vec{c}| = 2 \\times 2 = 4$이다. 그러므로 $2$가 아니다. (거짓)\n따라서 옳은 것은 ㄴ이다.\n따라서 정답은 ②이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-GEO-RPM-067",
    "problemTypeKey": "PT_GEO_PLANE_VECTOR",
    "templateKey": "TPL_GEO_VECTOR_BASIC_OPERATION",
    "crossConceptKeys": [
      "CC_REGULAR_HEXAGON",
      "CC_PYTHAGOREAN"
    ],
    "conditionKeys": [],
    "integrationPattern": "NONE",
    "image": "assets/images/기하_089_정육각형의벡터의연산2_고2_유형은행1/q1-problem.svg",
    "imageAlt": "한 변 2의 정육각형에서 AB, BC, CD를 따라 배치한 세 벡터",
    "imageCaption": "한 변 2의 정육각형에서 AB, BC, CD를 따라 배치한 세 벡터",
    "imageSize": "full"
  },
  {
    "id": 2,
    "category": "벡터의 성분",
    "standardCourse": "기하",
    "curriculum": "2022",
    "standardUnitKey": "H22-GE-05",
    "standardUnit": "벡터의 연산",
    "standardUnitOrder": 5,
    "subUnitKey": "H22-GE-05-VECTOR_COMPONENT",
    "subUnit": "벡터의 성분",
    "subUnitConfidence": "candidate_evidence",
    "subUnitClassificationDepth": "complete_candidate",
    "conceptClusterKey": "H22_GE_05_VECTOR_COMPONENT",
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "벡터의 성분"
    ],
    "wide": false,
    "content": "오른쪽 그림과 같은 정육각형 $\\mathrm{ABCDEF}$에서 $|\\vec{\\mathrm{AB}}| = 3$일 때, 다음 [보기]에서 옳은 것만을 있는 대로 고른 것은? [그림: 한 변의 길이가 $3$인 정육각형 $\\mathrm{ABCDEF}$가 그려져 있다.]\n\n<보기>\nㄱ. $|\\vec{\\mathrm{AB}} + \\vec{\\mathrm{CD}} - \\vec{\\mathrm{EF}}| = 6$\nㄴ. $|\\vec{\\mathrm{AB}} + \\vec{\\mathrm{AF}} + \\vec{\\mathrm{AD}}| = 9$\nㄷ. $|2\\vec{\\mathrm{BA}} + \\vec{\\mathrm{BC}}| = 3\\sqrt{7}$",
    "choices": [
      "ㄱ",
      "ㄴ",
      "ㄱ, ㄴ",
      "ㄴ, ㄷ",
      "ㄱ, ㄴ, ㄷ"
    ],
    "answer": "③",
    "solution": "정육각형의 대각선의 교점을 $\\mathrm{O}$라 하고 한 변의 길이 $|\\vec{\\mathrm{AB}}| = 3$임을 이용한다.\nㄱ. 정육각형의 마주보는 변의 성질에 의해 $-\\vec{\\mathrm{EF}} = \\vec{\\mathrm{FE}} = \\vec{\\mathrm{BC}}$이고 $\\vec{\\mathrm{CD}} = \\vec{\\mathrm{AF}}$이다.\n따라서 주어진 벡터의 합을 결합법칙으로 묶으면\n$\\vec{\\mathrm{AB}} + \\vec{\\mathrm{CD}} - \\vec{\\mathrm{EF}} = (\\vec{\\mathrm{AB}} + \\vec{\\mathrm{BC}}) + \\vec{\\mathrm{CD}} = \\vec{\\mathrm{AC}} + \\vec{\\mathrm{CD}} = \\vec{\\mathrm{AD}}$\n대각선 $\\mathrm{AD}$의 길이는 한 변의 길이의 $2$배이므로\n$|\\vec{\\mathrm{AD}}| = 2 \\times 3 = 6$이다. (참)\nㄴ. 사각형 $\\mathrm{ABOF}$는 네 변의 길이가 $3$인 마름모이므로 평행사변형 법칙에 의해\n$\\vec{\\mathrm{AB}} + \\vec{\\mathrm{AF}} = \\vec{\\mathrm{AO}}$이다.\n또한 대각선 $\\mathrm{AD}$는 선분 $\\mathrm{AO}$의 $2$배이므로 $\\vec{\\mathrm{AD}} = 2\\vec{\\mathrm{AO}}$이다.\n따라서 $\\vec{\\mathrm{AB}} + \\vec{\\mathrm{AF}} + \\vec{\\mathrm{AD}} = \\vec{\\mathrm{AO}} + 2\\vec{\\mathrm{AO}} = 3\\vec{\\mathrm{AO}}$\n$|\\vec{\\mathrm{AO}}| = 3$이므로 크기는 $|3\\vec{\\mathrm{AO}}| = 3 \\times 3 = 9$이다. (참)\nㄷ. 정육각형의 한 내각의 크기는 $120^\\circ$이므로 두 벡터 $\\vec{\\mathrm{BA}}, \\vec{\\mathrm{BC}}$가 이루는 각은 $120^\\circ$이다.\n벡터의 크기의 제곱 공식과 내적 정의 $\\vec{\\mathrm{BA}} \\cdot \\vec{\\mathrm{BC}} = |\\vec{\\mathrm{BA}}||\\vec{\\mathrm{BC}}|\\cos 120^\\circ$에 의해\n$|2\\vec{\\mathrm{BA}} + \\vec{\\mathrm{BC}}|^2 = 4|\\vec{\\mathrm{BA}}|^2 + 4(\\vec{\\mathrm{BA}} \\cdot \\vec{\\mathrm{BC}}) + |\\vec{\\mathrm{BC}}|^2$\n$= 4 \\times 3^2 + 4 \\times \\left(3 \\times 3 \\times \\left(-\\frac{1}{2}\\right)\\right) + 3^2$\n$= 36 - 18 + 9 = 27$\n주의: 두 벡터가 이루는 각을 $60^\\circ$로 오인하여 내적의 부호를 양수로 계산하면 $36 + 18 + 9 = 63$이 되어 $3\\sqrt{7}$이 나오는 함정에 주의한다.\n따라서 올바른 크기는 $|2\\vec{\\mathrm{BA}} + \\vec{\\mathrm{BC}}| = \\sqrt{27} = 3\\sqrt{3}$이다. (거짓)\n따라서 옳은 것은 ㄱ, ㄴ이다.\n따라서 정답은 ③이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-GEO-RPM-067",
    "problemTypeKey": "PT_GEO_PLANE_VECTOR",
    "templateKey": "TPL_GEO_VECTOR_BASIC_OPERATION",
    "crossConceptKeys": [
      "CC_REGULAR_HEXAGON",
      "CC_PYTHAGOREAN"
    ],
    "conditionKeys": [],
    "integrationPattern": "NONE",
    "image": "assets/images/기하_089_정육각형의벡터의연산2_고2_유형은행1/q2-problem.svg",
    "imageAlt": "한 변의 길이가 3인 정육각형 ABCDEF",
    "imageCaption": "한 변의 길이가 3인 정육각형 ABCDEF",
    "imageSize": "full"
  },
  {
    "id": 3,
    "category": "벡터의 성분",
    "standardCourse": "기하",
    "curriculum": "2022",
    "standardUnitKey": "H22-GE-05",
    "standardUnit": "벡터의 연산",
    "standardUnitOrder": 5,
    "subUnitKey": "H22-GE-05-VECTOR_COMPONENT",
    "subUnit": "벡터의 성분",
    "subUnitConfidence": "candidate_evidence",
    "subUnitClassificationDepth": "complete_candidate",
    "conceptClusterKey": "H22_GE_05_VECTOR_COMPONENT",
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "벡터의 성분"
    ],
    "wide": false,
    "content": "그림과 같이 한 변의 길이가 $1$인 정육각형 $\\mathrm{ABCDEF}$에서 $|\\vec{\\mathrm{AC}} + \\vec{\\mathrm{AD}}|$의 값은? [그림: 한 변의 길이가 $1$인 정육각형 $\\mathrm{ABCDEF}$에서 꼭짓점 $\\mathrm{A}$를 시점으로 하는 두 벡터 $\\vec{\\mathrm{AC}}, \\vec{\\mathrm{AD}}$가 화살표로 표시되어 있다.]",
    "choices": [
      "$\\sqrt{7}$",
      "$2\\sqrt{2}$",
      "$3$",
      "$\\sqrt{11}$",
      "$\\sqrt{13}$"
    ],
    "answer": "⑤",
    "solution": "정육각형의 기하학적 성질을 이용하여 두 벡터의 크기와 이루는 각의 크기를 구한다.\n(i) 선분 $\\mathrm{AC}$의 길이는 정육각형의 짧은 대각선이므로\n$\\triangle \\mathrm{ABC}$에서 제이코사인법칙 또는 이등변삼각형의 성질에 의해\n$|\\vec{\\mathrm{AC}}| = 2 \\times 1 \\times \\cos 30^\\circ = \\sqrt{3}$\n(ii) 선분 $\\mathrm{AD}$는 정육각형의 중심을 지나는 대각선이므로\n$|\\vec{\\mathrm{AD}}| = 2 \\times 1 = 2$\n(iii) 두 벡터 $\\vec{\\mathrm{AC}}, \\vec{\\mathrm{AD}}$가 이루는 각 $\\theta$의 크기를 구하면\n$\\triangle \\mathrm{ABC}$는 $\\mathrm{AB} = \\mathrm{BC}$인 이등변삼각형이므로 $\\angle \\mathrm{BAC} = \\frac{180^\\circ - 120^\\circ}{2} = 30^\\circ$\n선분 $\\mathrm{AD}$는 정육각형의 내각 $\\angle \\mathrm{BAF} = 120^\\circ$를 이등분하므로 $\\angle \\mathrm{BAD} = 60^\\circ$\n따라서 $\\theta = \\angle \\mathrm{CAD} = \\angle \\mathrm{BAD} - \\angle \\mathrm{BAC} = 60^\\circ - 30^\\circ = 30^\\circ$이다.\n(iv) 벡터의 크기의 제곱 공식을 적용하면\n$|\\vec{\\mathrm{AC}} + \\vec{\\mathrm{AD}}|^2 = |\\vec{\\mathrm{AC}}|^2 + 2(\\vec{\\mathrm{AC}} \\cdot \\vec{\\mathrm{AD}}) + |\\vec{\\mathrm{AD}}|^2$\n$= |\\vec{\\mathrm{AC}}|^2 + 2|\\vec{\\mathrm{AC}}||\\vec{\\mathrm{AD}}|\\cos 30^\\circ + |\\vec{\\mathrm{AD}}|^2$\n$= (\\sqrt{3})^2 + 2 \\times \\sqrt{3} \\times 2 \\times \\frac{\\sqrt{3}}{2} + 2^2$\n$= 3 + 6 + 4 = 13$\n$|\\vec{\\mathrm{AC}} + \\vec{\\mathrm{AD}}| > 0$이므로 $|\\vec{\\mathrm{AC}} + \\vec{\\mathrm{AD}}| = \\sqrt{13}$이다.\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-GEO-RPM-067",
    "problemTypeKey": "PT_GEO_PLANE_VECTOR",
    "templateKey": "TPL_GEO_VECTOR_BASIC_OPERATION",
    "crossConceptKeys": [
      "CC_REGULAR_HEXAGON",
      "CC_PYTHAGOREAN"
    ],
    "conditionKeys": [],
    "integrationPattern": "NONE",
    "image": "assets/images/기하_089_정육각형의벡터의연산2_고2_유형은행1/q3-problem.svg",
    "imageAlt": "한 변 1의 정육각형에서 A→C와 A→D 대각선 벡터",
    "imageCaption": "한 변 1의 정육각형에서 A→C와 A→D 대각선 벡터",
    "imageSize": "full"
  }
];
