window.examTitle = "미적분II_204_유리무리방정식의실근의개수_고2_유형은행1";

window.questionBank = [
  {
    "id": 1,
    "category": "도함수의 활용",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-06",
    "standardUnit": "도함수의 활용",
    "standardUnitOrder": 6,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "도함수의 활용"
    ],
    "wide": false,
    "content": "$x\\ge0$에서 연속이고 $x>0$에서 미분가능한 함수 $f$가 있다. $f(0)=-2$, $f(2)=4$, $\\lim_{x\\to\\infty}f(x)=1$이다. 아래 그림과 같은 도함수를 가질 때, $f(x)=k$가 서로 다른 두 실근을 갖는 $k$의 범위는? [그림: 제1사분면에서 시작한 $y=f'(x)$가 $x=2$에서 $x$축을 위에서 아래로 가로지른다. 이후 $x$축 아래에서 감소하다가 증가하며 $x$축에 아래쪽에서 접근한다.]",
    "choices": [
      "$-2<k<1$",
      "$k=1$",
      "$1\\le k<4$",
      "$1<k\\le4$",
      "$1<k<4$"
    ],
    "answer": "⑤",
    "solution": "도함수의 그래프에서 $0<x<2$일 때 $f'(x)>0$이므로 $f$는 $[0,2]$에서 증가한다.\n$x>2$일 때 $f'(x)<0$이므로 $f$는 $(2,\\infty)$에서 감소한다.\n$[0,2]$에서 $f(0)=-2$, $f(2)=4$이므로 $k\\in[-2,4]$이면 이 구간에 근이 하나 있다.\n$(2,\\infty)$에서는 $f(2)=4$에서 $\\lim_{x\\to\\infty}f(x)=1$까지 감소하고 $x=2$를 포함하지 않으므로 $k\\in(1,4)$이면 이 구간에 근이 하나 있다.\n서로 다른 두 근이 생기려면 두 범위의 교집합이 필요하므로 $[-2,4]\\cap(1,4)=(1,4)$이다.\n주의: $k=4$이면 $x=2$ 한 근뿐이고, $k=1$은 극한값이라 둘째 구간의 근이 생기지 않는다.\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-089",
    "problemTypeKey": "PT_DERIVATIVE_EQUATION_INEQUALITY",
    "templateKey": "TPL_ROOT_COUNT_BY_EXTREMA",
    "crossConceptKeys": [
      "CC_DERIVATIVE_GRAPH_RECONSTRUCTION",
      "CC_DERIVATIVE_SIGN_EXTREMA_ANALYSIS"
    ],
    "conditionKeys": [
      "COND_RANGE",
      "COND_EXACT_INTERSECTION_COUNT"
    ],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 2,
    "category": "도함수의 활용",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-06",
    "standardUnit": "도함수의 활용",
    "standardUnitOrder": 6,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "도함수의 활용"
    ],
    "wide": false,
    "content": "방정식 $\\dfrac{8}{x^2+6x+13}=k$가 서로 다른 두 실근을 가질 때 $k$의 범위는?",
    "choices": [
      "$0<k<1$",
      "$0<k<2$",
      "$0<k\\le2$",
      "$1<k<2$",
      "$k>2$"
    ],
    "answer": "②",
    "solution": "분모를 완전제곱식으로 정리하면 $x^2+6x+13=(x+3)^2+4$이다.\n$(x+3)^2+4\\ge4>0$이고 분자가 $8$이므로 좌변 $\\frac{8}{x^2+6x+13}$은 항상 양수이다. 따라서 $k>0$이다.\n방정식을 정리하면 $(x+3)^2+4=\\frac{8}{k}$, 즉 $(x+3)^2=\\frac{8}{k}-4$이다.\n서로 다른 두 실근이 생기려면 우변이 양수여야 하므로 $\\frac{8}{k}-4>0$이다.\n$k>0$이므로 양변에 $k$를 곱하면 $8-4k>0$, 즉 $0<k<2$이다.\n주의: $k=2$이면 $(x+3)^2=0$이 되어 $x=-3$인 중근 하나뿐이다.\n따라서 정답은 ②이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-089",
    "problemTypeKey": "PT_DERIVATIVE_EQUATION_INEQUALITY",
    "templateKey": "TPL_ROOT_COUNT_BY_EXTREMA",
    "crossConceptKeys": [
      "CC_RATIONAL_FUNCTION_GRAPH",
      "CC_QUADRATIC_EXTREMA",
      "CC_ASYMPTOTE"
    ],
    "conditionKeys": [
      "COND_EXACT_INTERSECTION_COUNT"
    ],
    "integrationPattern": "REINTERPRETATION"
  },
  {
    "id": 3,
    "category": "도함수의 활용",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-06",
    "standardUnit": "도함수의 활용",
    "standardUnitOrder": 6,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "도함수의 활용"
    ],
    "wide": false,
    "content": "방정식 $x^3+\\dfrac{48}{x}=k$가 서로 다른 두 실근을 갖는 $k$의 범위는?",
    "choices": [
      "$-32<k<32$",
      "$k<-16\\ \\text{또는}\\ k>16$",
      "$k\\le-32\\ \\text{또는}\\ k\\ge32$",
      "$k<-32\\ \\text{또는}\\ k>32$",
      "$k>32$"
    ],
    "answer": "④",
    "solution": "$F(x)=x^3+\\frac{48}{x}$ ($x\\ne0$)로 놓고 $F(x)=k$의 실근 개수를 조사한다.\n몫의 미분법으로 $F'(x)=3x^2-\\frac{48}{x^2}=\\frac{3(x^4-16)}{x^2}=\\frac{3(x-2)(x+2)(x^2+4)}{x^2}$이다.\n(i) $x>0$에서 $F'$의 부호는 $0<x<2$일 때 음, $x>2$일 때 양이므로 $x=2$에서 최솟값 $F(2)=8+24=32$를 갖는다.\n$x\\to0^+$일 때 $\\frac{48}{x}\\to\\infty$이고 $x\\to\\infty$일 때 $x^3\\to\\infty$이므로 양의 근이 두 개인 조건은 $k>32$이다.\n(ii) $x<0$에서는 $F(-x)=-F(x)$이므로 그래프가 원점 대칭이고, $x=-2$에서 최댓값 $F(-2)=-8-24=-32$를 갖는다.\n$x\\to0^-$와 $x\\to-\\infty$에서 $F(x)\\to-\\infty$이므로 음의 근이 두 개인 조건은 $k<-32$이다.\n주의: 양의 구간의 치역은 $[32,\\infty)$, 음의 구간의 치역은 $(-\\infty,-32]$이므로 $k=0$을 포함한 중간 범위에는 근이 없다.\n(i), (ii)를 합치면 $k<-32$ 또는 $k>32$이다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-089",
    "problemTypeKey": "PT_DERIVATIVE_EQUATION_INEQUALITY",
    "templateKey": "TPL_ROOT_COUNT_BY_EXTREMA",
    "crossConceptKeys": [
      "CC_RATIONAL_FUNCTION_GRAPH",
      "CC_DERIVATIVE_SIGN_EXTREMA_ANALYSIS"
    ],
    "conditionKeys": [
      "COND_EXACT_INTERSECTION_COUNT"
    ],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 4,
    "category": "도함수의 활용",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-06",
    "standardUnit": "도함수의 활용",
    "standardUnitOrder": 6,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "도함수의 활용"
    ],
    "wide": false,
    "content": "방정식 $x-\\sqrt{x+3}=n$이 서로 다른 두 실근을 갖도록 하는 실수 $n$의 최댓값은?",
    "choices": [
      "$-5$",
      "$-4$",
      "$-\\frac72$",
      "$-3$",
      "$-\\frac52$"
    ],
    "answer": "④",
    "solution": "$t=\\sqrt{x+3}\\ge0$으로 치환하면 $x=t^2-3$이고, $t$와 $x$는 일대일로 대응한다.\n방정식의 좌변은 $x-\\sqrt{x+3}=t^2-3-t=t^2-t-3$이다.\n완전제곱식으로 고치면 $t^2-t-3=\\left(t-\\frac12\\right)^2-\\frac{13}{4}$이다.\n$t\\ge0$에서 이 함수는 $0\\le t\\le\\frac12$일 때 감소하고 $t\\ge\\frac12$일 때 증가한다.\n구간별 치역은 (i) $0\\le t\\le\\frac12$에서 $[-\\frac{13}{4},-3]$, (ii) $t\\ge\\frac12$에서 $[-\\frac{13}{4},\\infty)$이다.\n두 근이 서로 다르려면 공통 끝값 $n=-\\frac{13}{4}$을 제외해야 하므로 $n>-\\frac{13}{4}$이고, 감소 구간에도 근이 있어야 하므로 $n\\le-3$이다.\n따라서 $-\\frac{13}{4}<n\\le-3$이고 $n$의 최댓값은 $-3$이다.\n주의: $n=-\\frac{13}{4}$이면 두 구간의 근이 $t=\\frac12$ 하나로 합쳐져 근이 하나뿐이다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-089",
    "problemTypeKey": "PT_DERIVATIVE_EQUATION_INEQUALITY",
    "templateKey": "TPL_ROOT_COUNT_BY_EXTREMA",
    "crossConceptKeys": [
      "CC_IRRATIONAL_FUNCTION_GRAPH",
      "CC_QUADRATIC_EXTREMA"
    ],
    "conditionKeys": [
      "COND_EXACT_INTERSECTION_COUNT"
    ],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 5,
    "category": "도함수의 활용",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-06",
    "standardUnit": "도함수의 활용",
    "standardUnitOrder": 6,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "도함수의 활용"
    ],
    "wide": false,
    "content": "방정식 $2\\sqrt{x}+\\dfrac8x=k$가 서로 다른 두 실근을 갖게 하는 정수 $k$의 최솟값은?",
    "choices": [
      "$6$",
      "$7$",
      "$8$",
      "$9$",
      "$10$"
    ],
    "answer": "②",
    "solution": "$F(x)=2\\sqrt{x}+\\frac8x$ ($x>0$)로 놓고 $F(x)=k$의 근의 개수를 조사한다.\n$F'(x)=\\frac1{\\sqrt{x}}-\\frac8{x^2}=\\frac{x^{3/2}-8}{x^2}$이다.\n$F'(x)=0$이면 $x^{3/2}=8$이므로 $x=4$이고, $0<x<4$에서 $F'<0$, $x>4$에서 $F'>0$이다.\n따라서 $x=4$에서 최솟값 $F(4)=2\\cdot2+\\frac84=6$을 갖는다.\n$x\\to0^+$일 때 $\\frac8x\\to\\infty$이고 $x\\to\\infty$일 때 $2\\sqrt{x}\\to\\infty$이므로 $y=k$가 두 점에서 만나는 조건은 $k>6$이다.\n이를 만족하는 정수 $k$의 최솟값은 $7$이다.\n따라서 정답은 ②이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-089",
    "problemTypeKey": "PT_DERIVATIVE_EQUATION_INEQUALITY",
    "templateKey": "TPL_ROOT_COUNT_BY_EXTREMA",
    "crossConceptKeys": [
      "CC_HORIZONTAL_LINE_INTERSECTIONS",
      "CC_FUNCTION_EXTREMA"
    ],
    "conditionKeys": [
      "COND_INTEGER",
      "COND_EXACT_INTERSECTION_COUNT"
    ],
    "integrationPattern": "REINTERPRETATION"
  },
  {
    "id": 6,
    "category": "도함수의 활용",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-06",
    "standardUnit": "도함수의 활용",
    "standardUnitOrder": 6,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "도함수의 활용"
    ],
    "wide": false,
    "content": "방정식 $x^3=k(x-2)^2$이 서로 다른 세 실근을 가지는 $k$의 범위는?",
    "choices": [
      "$k>\\frac{27}{2}$",
      "$k\\ge\\frac{27}{2}$",
      "$0<k<\\frac{27}{2}$",
      "$k>8$",
      "$k<0$"
    ],
    "answer": "①",
    "solution": "$x=2$에서는 $8\\ne0$이므로 근이 아니다. 따라서 $x\\ne2$에서 $k=\\frac{x^3}{(x-2)^2}=F(x)$로 놓는다.\n몫의 미분법으로 $F'(x)=\\frac{3x^2(x-2)^2-x^3\\cdot2(x-2)}{(x-2)^4}=\\frac{x^2(x-6)}{(x-2)^3}$이다.\n$x<2$이고 $x\\ne0$일 때 $F'(x)>0$이며, $x=0$에서도 부호가 바뀌지 않으므로 $F$는 $(-\\infty,2)$에서 증가한다.\n$x\\to-\\infty$일 때 $F(x)\\sim x\\to-\\infty$이고, $x\\to2^-$일 때 분모 $\\to0^+$이므로 $F(x)\\to\\infty$이다.\n따라서 $x<2$에는 모든 실수 $k$에 대해 근이 정확히 하나 있다.\n$x>2$에서는 $2<x<6$일 때 $F'<0$, $x>6$일 때 $F'>0$이므로 $x=6$에서 최솟값 $F(6)=\\frac{216}{16}=\\frac{27}{2}$을 갖는다.\n$x\\to2^+$와 $x\\to\\infty$에서 $F(x)\\to\\infty$이므로 $x>2$의 치역은 $[\\frac{27}{2},\\infty)$이다.\n$x>2$에서 근이 두 개인 조건은 $k>\\frac{27}{2}$이고, 이때 전체 근은 왼쪽 하나와 오른쪽 둘로 서로 다른 세 개가 된다.\n주의: $k=\\frac{27}{2}$이면 $x=6$에서 접하므로 오른쪽 근이 하나뿐이어서 모두 두 근이다.\n따라서 정답은 ①이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-089",
    "problemTypeKey": "PT_DERIVATIVE_EQUATION_INEQUALITY",
    "templateKey": "TPL_ROOT_COUNT_BY_EXTREMA",
    "crossConceptKeys": [
      "CC_SEPARATED_PARAMETER_CUBIC_ROOTS",
      "CC_DERIVATIVE_SIGN_EXTREMA_ANALYSIS",
      "CC_RATIONAL_FUNCTION_GRAPH"
    ],
    "conditionKeys": [
      "COND_EXACT_INTERSECTION_COUNT"
    ],
    "integrationPattern": "SEQUENTIAL"
  }
];
