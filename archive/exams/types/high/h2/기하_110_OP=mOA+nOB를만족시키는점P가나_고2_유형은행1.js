window.examTitle = "기하_110_OP=mOA+nOB를만족시키는점P가나_고2_유형은행1";

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
    "content": "$\\overline{\\mathrm{OA}}=6, \\overline{\\mathrm{OB}}=5\\sqrt{2}, \\angle\\mathrm{AOB}=45^\\circ$인 삼각형 $\\mathrm{AOB}$에 대하여 $\\vec{\\mathrm{OP}}=m\\vec{\\mathrm{OA}}+n\\vec{\\mathrm{OB}}, m+n \\le 2, m \\ge 0, n \\ge 0$을 만족시키는 점 $\\mathrm{P}$가 나타내는 도형의 넓이는?",
    "choices": [
      "40",
      "45",
      "50",
      "55",
      "60"
    ],
    "answer": "⑤",
    "solution": "삼각형의 넓이 공식을 이용하여 $\\triangle\\mathrm{OAB}$의 넓이를 구한다:\n$S = \\frac{1}{2} \\times \\overline{\\mathrm{OA}} \\times \\overline{\\mathrm{OB}} \\times \\sin(\\angle\\mathrm{AOB}) = \\frac{1}{2} \\times 6 \\times 5\\sqrt{2} \\times \\sin 45^\\circ$\n$\\sin 45^\\circ = \\frac{\\sqrt{2}}{2}$를 대입하여 계산한다:\n$S = \\frac{1}{2} \\times 6 \\times 5\\sqrt{2} \\times \\frac{\\sqrt{2}}{2} = 3 \\times 5 = 15$\n주어진 부등식의 양변을 2로 나누어 계수의 합 조건을 변형한다:\n$m+n \\le 2 \\iff \\frac{m}{2} + \\frac{n}{2} \\le 1$\n$\\vec{\\mathrm{OP}}$의 식에 새로운 계수와 벡터를 도입한다:\n$\\vec{\\mathrm{OP}} = \\frac{m}{2}(2\\vec{\\mathrm{OA}}) + \\frac{n}{2}(2\\vec{\\mathrm{OB}})$\n$s = \\frac{m}{2}, t = \\frac{n}{2}$라 하고 $\\vec{\\mathrm{OA'}} = 2\\vec{\\mathrm{OA}}, \\vec{\\mathrm{OB'}} = 2\\vec{\\mathrm{OB}}$라 하면:\n$\\vec{\\mathrm{OP}} = s\\vec{\\mathrm{OA'}} + t\\vec{\\mathrm{OB'}}$ ($s+t \\le 1, s \\ge 0, t \\ge 0$)\n따라서 점 $\\mathrm{P}$가 나타내는 영역은 $\\triangle\\mathrm{OA'B'}$의 내부 및 경계이다.\n두 삼각형 $\\triangle\\mathrm{OA'B'}$와 $\\triangle\\mathrm{OAB}$의 닮음비가 $2:1$이므로 넓이의 비는 $2^2:1=4:1$이다:\n$\\triangle\\mathrm{OA'B'} = 4 \\times S = 4 \\times 15 = 60$\n주의: 계수의 합이 2 이하일 때 넓이는 2배가 아니라 닮음비 제곱에 의해 4배가 된다.\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-GEO-RPM-070",
    "problemTypeKey": "PT_GEO_PLANE_VECTOR",
    "templateKey": "TPL_GEO_PLANE_VECTOR_REGION",
    "crossConceptKeys": [
      "CC_TRIANGLE_AREA_TRIG",
      "CC_AREA_RATIO"
    ],
    "conditionKeys": [
      "COND_RANGE"
    ],
    "integrationPattern": "SEQUENTIAL"
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
    "content": "좌표평면 위의 세 점 $\\mathrm{O}(0, 0), \\mathrm{A}(4, 2), \\mathrm{B}(1, 5)$에 대하여 다음 조건을 만족시키는 점 $\\mathrm{P}$가 나타내는 도형의 넓이는?\n\n(가) $\\vec{\\mathrm{OP}}=m\\vec{\\mathrm{OA}}+n\\vec{\\mathrm{OB}}$\n(나) $m \\ge 0, n \\ge 0, 1 \\le m+n \\le 2$",
    "choices": [
      "15",
      "18",
      "21",
      "24",
      "27"
    ],
    "answer": "⑤",
    "solution": "원점과 두 점으로 이루어진 삼각형의 넓이 공식을 적용한다:\n$S_{\\triangle\\mathrm{OAB}} = \\frac{1}{2}|x_1 y_2 - x_2 y_1| = \\frac{1}{2}|4 \\times 5 - 2 \\times 1|$\n절댓값 내부를 계산한다:\n$S_{\\triangle\\mathrm{OAB}} = \\frac{1}{2}|20 - 2| = \\frac{1}{2} \\times 18 = 9$\n(i) $m \\ge 0, n \\ge 0, m+n \\le 2$를 만족하는 점 $\\mathrm{P}$가 나타내는 영역은 $\\vec{\\mathrm{OA'}} = 2\\vec{\\mathrm{OA}}, \\vec{\\mathrm{OB'}} = 2\\vec{\\mathrm{OB}}$에 대하여 $\\triangle\\mathrm{OA'B'}$의 내부 및 둘레이다.\n닮음비가 $2:1$이므로 이 영역의 넓이는 다음과 같다:\n$S_2 = 2^2 \\times S_{\\triangle\\mathrm{OAB}} = 4 \\times 9 = 36$\n(ii) $m \\ge 0, n \\ge 0, m+n < 1$을 만족하는 점 $\\mathrm{P}$가 나타내는 영역은 $\\triangle\\mathrm{OAB}$의 내부이다.\n이 영역의 넓이는 다음과 같다:\n$S_1 = 1^2 \\times S_{\\triangle\\mathrm{OAB}} = 9$\n구하는 도형의 넓이는 (i)의 영역에서 (ii)의 영역을 제외한 부분이므로:\n$S = S_2 - S_1 = 36 - 9 = 27$\n주의: $1 \\le m+n \\le 2$ 영역은 닮음비 $2:1$의 넓이 차이 $(2^2 - 1^2)$배를 적용하여 바로 $3 \\times 9 = 27$로 구할 수 있다.\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-GEO-RPM-070",
    "problemTypeKey": "PT_GEO_PLANE_VECTOR",
    "templateKey": "TPL_GEO_PLANE_VECTOR_REGION",
    "crossConceptKeys": [
      "CC_POLYGON_AREA_SHOELACE",
      "CC_AREA_RATIO"
    ],
    "conditionKeys": [
      "COND_RANGE"
    ],
    "integrationPattern": "SEQUENTIAL"
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
    "content": "좌표평면 위의 세 점 $\\mathrm{O, A, B}$에 대하여 $|\\vec{\\mathrm{OA}}|=6, |\\vec{\\mathrm{OB}}|=4, \\angle\\mathrm{AOB}=120^\\circ$일 때, $\\vec{\\mathrm{OP}}=m\\vec{\\mathrm{OA}}+n\\vec{\\mathrm{OB}}, 0 \\le m \\le 1, 0 \\le n \\le 1$을 만족하는 점 $\\mathrm{P}$가 나타내는 도형의 넓이는?",
    "choices": [
      "12\\sqrt{3}",
      "14\\sqrt{3}",
      "16\\sqrt{3}",
      "18\\sqrt{3}",
      "20\\sqrt{3}"
    ],
    "answer": "①",
    "solution": "조건 $0 \\le m \\le 1, 0 \\le n \\le 1$에서 점 $\\mathrm{P}$가 나타내는 영역의 성질을 확인한다:\n점 $\\mathrm{P}$가 나타내는 도형은 선분 $\\mathrm{OA}$와 선분 $\\mathrm{OB}$를 이웃하는 두 변으로 하는 평행사변형의 경계 및 내부이다.\n두 변의 길이와 끼인각이 주어졌을 때 평행사변형의 넓이 공식을 세운다:\n$S = |\\vec{\\mathrm{OA}}||\\vec{\\mathrm{OB}}|\\sin(\\angle\\mathrm{AOB})$\n주어진 수치 $|\\vec{\\mathrm{OA}}|=6, |\\vec{\\mathrm{OB}}|=4, \\angle\\mathrm{AOB}=120^\\circ$를 대입한다:\n$S = 6 \\times 4 \\times \\sin 120^\\circ$\n삼각비 성질 $\\sin 120^\\circ = \\sin(180^\\circ - 60^\\circ) = \\sin 60^\\circ = \\frac{\\sqrt{3}}{2}$를 대입하여 계산한다:\n$S = 24 \\times \\frac{\\sqrt{3}}{2} = 12\\sqrt{3}$\n주의: 평행사변형의 넓이는 삼각형 넓이의 2배이므로 앞에 $\\frac{1}{2}$을 곱하지 않도록 주의한다.\n따라서 정답은 ①이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-GEO-RPM-070",
    "problemTypeKey": "PT_GEO_PLANE_VECTOR",
    "templateKey": "TPL_GEO_PLANE_VECTOR_REGION",
    "crossConceptKeys": [
      "CC_PARALLELOGRAM_AREA",
      "CC_TRIANGLE_AREA_TRIG"
    ],
    "conditionKeys": [
      "COND_RANGE"
    ],
    "integrationPattern": "NONE"
  },
  {
    "id": 4,
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
    "content": "한 변의 길이가 $2\\sqrt{3}$인 정삼각형 $\\mathrm{AOB}$에 대하여 $\\vec{\\mathrm{OP}}=m\\vec{\\mathrm{OA}}+n\\vec{\\mathrm{OB}}, 0 \\le m \\le 1, 0 \\le n \\le 1$을 만족하는 점 $\\mathrm{P}$가 나타내는 도형의 넓이는? [그림: 점 $\\mathrm{O}$에서 시작하는 두 변 $\\mathrm{OA, OB}$의 길이가 모두 $2\\sqrt{3}$이고 끼인각이 $60^\\circ$인 정삼각형 $\\mathrm{AOB}$]",
    "choices": [
      "4\\sqrt{3}",
      "5\\sqrt{3}",
      "6\\sqrt{3}",
      "7\\sqrt{3}",
      "8\\sqrt{3}"
    ],
    "answer": "③",
    "solution": "한 변의 길이가 $a$인 정삼각형의 넓이 공식을 세운다:\n$S_{\\triangle} = \\frac{\\sqrt{3}}{4}a^2$\n한 변의 길이 $a = 2\\sqrt{3}$을 대입하여 삼각형 $\\mathrm{AOB}$의 넓이를 구한다:\n$S_{\\triangle\\mathrm{AOB}} = \\frac{\\sqrt{3}}{4} \\times (2\\sqrt{3})^2 = \\frac{\\sqrt{3}}{4} \\times 12 = 3\\sqrt{3}$\n점 $\\mathrm{P}$가 나타내는 영역의 기하학적 의미를 파악한다:\n$\\vec{\\mathrm{OP}}=m\\vec{\\mathrm{OA}}+n\\vec{\\mathrm{OB}}$ ($0 \\le m \\le 1, 0 \\le n \\le 1$)을 만족하는 점 $\\mathrm{P}$는 선분 $\\mathrm{OA}$와 선분 $\\mathrm{OB}$를 이웃하는 두 변으로 하는 평행사변형의 경계와 내부 전체이다.\n평행사변형의 넓이는 삼각형 $\\mathrm{AOB}$ 넓이의 2배이므로:\n$S = 2 \\times S_{\\triangle\\mathrm{AOB}} = 2 \\times 3\\sqrt{3} = 6\\sqrt{3}$\n역산 검증: $|\\vec{\\mathrm{OA}}||\\vec{\\mathrm{OB}}|\\sin 60^\\circ = 2\\sqrt{3} \\times 2\\sqrt{3} \\times \\frac{\\sqrt{3}}{2} = 6\\sqrt{3}$으로 동일하다.\n따라서 정답은 ③이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-GEO-RPM-070",
    "problemTypeKey": "PT_GEO_PLANE_VECTOR",
    "templateKey": "TPL_GEO_PLANE_VECTOR_REGION",
    "crossConceptKeys": [
      "CC_EQUILATERAL_TRIANGLE",
      "CC_PARALLELOGRAM_AREA"
    ],
    "conditionKeys": [
      "COND_RANGE"
    ],
    "integrationPattern": "NONE"
  },
  {
    "id": 5,
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
    "content": "좌표공간에 한 직선 위에 있지 않은 세 점 $\\mathrm{O, A, B}$가 있다. $\\vec{\\mathrm{OP}}=s\\vec{\\mathrm{OA}}+t\\vec{\\mathrm{OB}}$ ($s, t$는 실수)를 만족시키는 점 $\\mathrm{P}$가 나타내는 도형에 대한 설명으로 <보기>에서 옳은 것만을 있는 대로 고른 것은?\n\n<보기>\nㄱ. $s+t=1$이면 점 $\\mathrm{P}$는 선분 $\\mathrm{AB}$ 위의 점이다.\nㄴ. $s \\ge 0, t \\ge 0, s+t \\le 1$이면 점 $\\mathrm{P}$는 삼각형 $\\mathrm{OAB}$의 경계와 내부의 모든 점이다.\nㄷ. $0 \\le s \\le 1, 0 \\le t \\le 1$이면 점 $\\mathrm{P}$가 나타내는 영역의 넓이는 삼각형 $\\mathrm{OAB}$의 넓이와 같다.",
    "choices": [
      "ㄱ",
      "ㄴ",
      "ㄱ, ㄷ",
      "ㄴ, ㄷ",
      "ㄱ, ㄴ, ㄷ"
    ],
    "answer": "②",
    "solution": "각 보기를 단계별로 판별한다.\n(i) ㄱ 판별:\n$s+t=1$이면 점 $\\mathrm{P}$는 두 점 $\\mathrm{A, B}$를 지나는 직선 $\\mathrm{AB}$ 위의 점이다.\n선분 $\\mathrm{AB}$ 위의 점이 되려면 추가로 $s \\ge 0, t \\ge 0$이어야 한다.\n$s < 0$ 또는 $t < 0$일 때는 선분 $\\mathrm{AB}$의 바깥쪽 직선 위에 존재하므로 선분 위의 점이라고 단정할 수 없다. (거짓)\n(ii) ㄴ 판별:\n$s \\ge 0, t \\ge 0, s+t \\le 1$에서 $s+t=k$ ($0 \\le k \\le 1$)로 두면 $k=0$일 때 원점 $\\mathrm{O}$이고, $0 < k \\le 1$일 때 두 점 $k\\mathrm{A}, k\\mathrm{B}$를 잇는 선분을 이룬다.\n$k$가 0부터 1까지 연속적으로 변하므로 점 $\\mathrm{P}$가 나타내는 영역은 삼각형 $\\mathrm{OAB}$의 경계와 내부 전체이다. (참)\n(iii) ㄷ 판별:\n$0 \\le s \\le 1, 0 \\le t \\le 1$을 만족시키는 점 $\\mathrm{P}$가 나타내는 영역은 선분 $\\mathrm{OA}$와 선분 $\\mathrm{OB}$를 이웃하는 두 변으로 하는 평행사변형의 경계와 내부이다.\n평행사변형의 넓이는 삼각형 $\\mathrm{OAB}$ 넓이의 2배이므로 넓이가 서로 같지 않다. (거짓)\n주의: $s+t=1$ 조건만으로는 직선 전체를 의미하므로 선분으로 한정 짓는 비음 조건($s \\ge 0, t \\ge 0$)의 유무를 반드시 확인해야 한다.\n따라서 옳은 것은 ㄴ뿐이므로 정답은 ②이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-GEO-RPM-070",
    "problemTypeKey": "PT_GEO_PLANE_VECTOR",
    "templateKey": "TPL_GEO_PLANE_VECTOR_REGION",
    "crossConceptKeys": [
      "CC_PARALLELOGRAM_AREA"
    ],
    "conditionKeys": [],
    "integrationPattern": "CASE_BRANCH"
  },
  {
    "id": 6,
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
    "content": "일직선 위에 있지 않은 세 점 $\\mathrm{O, A, B}$에 대하여 $\\vec{\\mathrm{OP}}=m\\vec{\\mathrm{OA}}+n\\vec{\\mathrm{OB}}$ (단, $4m+3n=2, m \\ge 0, n \\ge 0$)를 만족시키는 점 $\\mathrm{P}$가 나타내는 도형은?",
    "choices": [
      "삼각형 $\\mathrm{OAB}$의 내부와 그 둘레",
      "선분 $\\mathrm{OA}$를 $2:1$로 내분하는 점과 선분 $\\mathrm{OB}$의 중점을 이은 선분",
      "선분 $\\mathrm{OA}$의 중점과 선분 $\\mathrm{OB}$를 $2:1$로 내분하는 점을 이은 선분",
      "선분 $\\mathrm{OA}$의 중점과 선분 $\\mathrm{OB}$를 $1:2$로 내분하는 점을 이은 선분",
      "선분 $\\mathrm{OA}$를 $1:2$로 내분하는 점과 선분 $\\mathrm{OB}$를 $2:1$로 내분하는 점을 이은 선분"
    ],
    "answer": "③",
    "solution": "조건식의 우변을 1로 만들기 위해 양변을 2로 나눈다:\n$4m+3n=2 \\iff 2m + \\frac{3}{2}n = 1$\n계수의 합이 1인 형태로 $\\vec{\\mathrm{OP}}$의 식을 변형한다:\n$\\vec{\\mathrm{OP}} = 2m\\left(\\frac{1}{2}\\vec{\\mathrm{OA}}\\right) + \\frac{3}{2}n\\left(\\frac{2}{3}\\vec{\\mathrm{OB}}\\right)$\n새로운 계수 $s = 2m, t = \\frac{3}{2}n$으로 두면:\n$s+t=1$이고, $m \\ge 0, n \\ge 0$이므로 $s \\ge 0, t \\ge 0$이다.\n새로운 위치벡터를 갖는 두 점 $\\mathrm{A', B'}$을 설정한다:\n$\\vec{\\mathrm{OA'}} = \\frac{1}{2}\\vec{\\mathrm{OA}}$ (선분 $\\mathrm{OA}$의 중점)\n$\\vec{\\mathrm{OB'}} = \\frac{2}{3}\\vec{\\mathrm{OB}} = \\frac{2}{2+1}\\vec{\\mathrm{OB}}$ (선분 $\\mathrm{OB}$를 $2:1$로 내분하는 점)\n내분점의 위치벡터 표현에 의해 점 $\\mathrm{P}$의 자취를 기술한다:\n$\\vec{\\mathrm{OP}} = s\\vec{\\mathrm{OA'}} + t\\vec{\\mathrm{OB'}}$ ($s+t=1, s \\ge 0, t \\ge 0$)\n따라서 점 $\\mathrm{P}$가 나타내는 도형은 선분 $\\mathrm{A'B'}$이다.\n즉, 선분 $\\mathrm{OA}$의 중점과 선분 $\\mathrm{OB}$를 $2:1$로 내분하는 점을 이은 선분이다.\n따라서 정답은 ③이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-GEO-RPM-070",
    "problemTypeKey": "PT_GEO_PLANE_VECTOR",
    "templateKey": "TPL_GEO_PLANE_VECTOR_REGION",
    "crossConceptKeys": [
      "CC_INTERNAL_DIVISION",
      "CC_MIDPOINT"
    ],
    "conditionKeys": [
      "COND_RANGE"
    ],
    "integrationPattern": "SEQUENTIAL"
  }
];
