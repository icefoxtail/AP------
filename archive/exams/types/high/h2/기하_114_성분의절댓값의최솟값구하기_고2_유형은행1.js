window.examTitle = "기하_114_성분의절댓값의최솟값구하기_고2_유형은행1";

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
    "content": "두 벡터 $\\vec{a}=(1, 2)$, $\\vec{b}=(-3, 4)$에 대하여 $|t\\vec{a}+\\vec{b}|$의 최솟값은? (단, $t$는 실수이다.)",
    "choices": [
      "$\\sqrt{5}$",
      "$\\dfrac{5\\sqrt{5}}{4}$",
      "$\\dfrac{3\\sqrt{5}}{2}$",
      "$\\dfrac{7\\sqrt{5}}{4}$",
      "$2\\sqrt{5}$"
    ],
    "answer": "⑤",
    "solution": "[벡터의 성분 표시] $t\\vec{a}+\\vec{b} = t(1, 2) + (-3, 4) = (t-3, 2t+4)$\n[벡터의 크기의 제곱 계산] $|t\\vec{a}+\\vec{b}|^2 = (t-3)^2 + (2t+4)^2$\n[전개 및 동류항 정리] $|t\\vec{a}+\\vec{b}|^2 = (t^2 - 6t + 9) + (4t^2 + 16t + 16) = 5t^2 + 10t + 25$\n[이차식의 완전제곱식 변형] $5t^2 + 10t + 25 = 5(t^2 + 2t + 1) - 5 + 25 = 5(t+1)^2 + 20$\n[최솟값 조건 확인] $t$는 실수이므로 $(t+1)^2 \\ge 0$이다. 따라서 $t = -1$일 때 $|t\\vec{a}+\\vec{b}|^2$은 최솟값 $20$을 갖는다.\n[절댓값의 최솟값 도출] $|t\\vec{a}+\\vec{b}| \\ge 0$이므로 구하는 최솟값은 $\\sqrt{20} = 2\\sqrt{5}$이다.\n[검산: 점과 직선 사이의 거리] 직선의 방향벡터가 $(1, 2)$이고 점 $(-3, 4)$를 지나므로 직선의 방정식은 $2(x+3) - (y-4) = 0 \\iff 2x - y + 10 = 0$이다. 원점 $(0, 0)$에서 이 직선까지의 거리는 $\\dfrac{|10|}{\\sqrt{2^2+(-1)^2}} = \\dfrac{10}{\\sqrt{5}} = 2\\sqrt{5}$로 일치한다.\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-GEO-RPM-072",
    "problemTypeKey": "PT_GEO_PLANE_VECTOR",
    "templateKey": "TPL_GEO_PLANE_VECTOR_EXTREMA",
    "crossConceptKeys": [
      "CC_POINT_LINE_DISTANCE"
    ],
    "conditionKeys": [],
    "integrationPattern": "REINTERPRETATION"
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
    "content": "두 평면벡터 $\\vec{a}=(4, 3)$, $\\vec{b}=(1, 2)$와 $0 \\le t \\le 4$인 실수 $t$에 대하여 $|\\vec{a}-t\\vec{b}|$의 최댓값을 $M$, 최솟값을 $m$이라 할 때, $Mm$의 값은?",
    "choices": [
      "$3\\sqrt{5}$",
      "$4\\sqrt{5}$",
      "$5\\sqrt{5}$",
      "$6\\sqrt{5}$",
      "$7\\sqrt{5}$"
    ],
    "answer": "③",
    "solution": "[벡터의 성분 계산] $\\vec{a}-t\\vec{b} = (4, 3) - t(1, 2) = (4-t, 3-2t)$\n[크기의 제곱식 전개] $|\\vec{a}-t\\vec{b}|^2 = (4-t)^2 + (3-2t)^2 = (t^2 - 8t + 16) + (4t^2 - 12t + 9) = 5t^2 - 20t + 25$\n[이차함수의 표준형 변형] $5t^2 - 20t + 25 = 5(t^2 - 4t + 4) - 20 + 25 = 5(t-2)^2 + 5$\n[정의역 내 최솟값 $m$ 구하기] 꼭짓점 $t = 2$가 구간 $0 \\le t \\le 4$에 속하므로, $t = 2$일 때 $|\\vec{a}-t\\vec{b}|^2$의 최솟값은 $5$이다. 따라서 $m = \\sqrt{5}$이다.\n[구간 양 끝값 비교로 최댓값 $M$ 구하기] $t = 0$일 때 $5(0-2)^2 + 5 = 25$, $t = 4$일 때 $5(4-2)^2 + 5 = 25$이므로 최댓값은 $25$이다. 따라서 $M = \\sqrt{25} = 5$이다.\n주의: 문제에서 구하는 $M, m$은 크기의 제곱이 아닌 크기 $|\\vec{a}-t\\vec{b}|$의 최댓값과 최솟값이다.\n[곱 $Mm$의 계산] $Mm = 5 \\times \\sqrt{5} = 5\\sqrt{5}$\n[검산: 정사영 벡터 이용] $t = \\dfrac{\\vec{a}\\cdot\\vec{b}}{|\\vec{b}|^2} = \\dfrac{4(1)+3(2)}{1^2+2^2} = \\dfrac{10}{5} = 2$에서 최솟값 $|(2, -1)| = \\sqrt{5}$가 나오고, 끝점 $t=0, 4$에서 각각 $|(4, 3)|=5$, $|(0, -5)|=5$로 $M=5$가 되어 $Mm=5\\sqrt{5}$로 일치한다.\n따라서 정답은 ③이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-GEO-RPM-072",
    "problemTypeKey": "PT_GEO_PLANE_VECTOR",
    "templateKey": "TPL_GEO_PLANE_VECTOR_EXTREMA",
    "crossConceptKeys": [
      "CC_POINT_LINE_DISTANCE"
    ],
    "conditionKeys": [
      "COND_RANGE"
    ],
    "integrationPattern": "CASE_BRANCH"
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
    "content": "두 점 $\\mathrm{A}(1, 5)$, $\\mathrm{B}(5, 1)$과 직선 $2x+y=4$ 위의 점 $\\mathrm{P}$에 대하여 $|\\vec{\\mathrm{AP}}+\\vec{\\mathrm{BP}}|$의 최솟값은?",
    "choices": [
      "$2\\sqrt{5}$",
      "$3\\sqrt{5}$",
      "$4\\sqrt{5}$",
      "$5\\sqrt{5}$",
      "$6\\sqrt{5}$"
    ],
    "answer": "①",
    "solution": "[중점 벡터 성질 적용] 선분 $\\mathrm{AB}$의 중점을 $\\mathrm{M}$이라 하면 $\\vec{\\mathrm{AP}}+\\vec{\\mathrm{BP}} = (\\vec{\\mathrm{OP}}-\\vec{\\mathrm{OA}}) + (\\vec{\\mathrm{OP}}-\\vec{\\mathrm{OB}}) = 2\\vec{\\mathrm{OP}} - (\\vec{\\mathrm{OA}}+\\vec{\\mathrm{OB}}) = 2\\vec{\\mathrm{MP}}$이다.\n[중점 $\\mathrm{M}$의 좌표 구하기] 점 $\\mathrm{A}(1, 5)$, $\\mathrm{B}(5, 1)$의 중점은 $\\mathrm{M}\\left(\\dfrac{1+5}{2}, \\dfrac{5+1}{2}\\right) = (3, 3)$이다.\n[기하학적 최솟값 해석] $|\\vec{\\mathrm{AP}}+\\vec{\\mathrm{BP}}| = 2|\\vec{\\mathrm{MP}}|$이므로, 이 값의 최솟값은 점 $\\mathrm{M}(3, 3)$에서 직선 $2x+y-4=0$까지의 거리 $d$의 $2$배인 $2d$이다.\n[점과 직선 사이의 거리 공식] $d = \\dfrac{|2(3) + 1(3) - 4|}{\\sqrt{2^2 + 1^2}} = \\dfrac{|6 + 3 - 4|}{\\sqrt{5}} = \\dfrac{5}{\\sqrt{5}} = \\sqrt{5}$\n[최솟값 계산] 구하는 최솟값은 $2d = 2\\sqrt{5}$이다.\n[다른 풀이 검산: 성분 대입법] 직선 위의 점을 $\\mathrm{P}(x, 4-2x)$라 하면 $\\vec{\\mathrm{AP}}+\\vec{\\mathrm{BP}} = (2x-6, -4x+2)$이다. 크기의 제곱은 $(2x-6)^2 + (-4x+2)^2 = 20(x-1)^2 + 20$이므로 $x=1$일 때 최솟값 $\\sqrt{20} = 2\\sqrt{5}$로 일치한다.\n따라서 정답은 ①이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-GEO-RPM-072",
    "problemTypeKey": "PT_GEO_PLANE_VECTOR",
    "templateKey": "TPL_GEO_PLANE_VECTOR_EXTREMA",
    "crossConceptKeys": [
      "CC_MIDPOINT",
      "CC_POINT_LINE_DISTANCE"
    ],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
  }
];
