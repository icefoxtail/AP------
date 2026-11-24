window.examTitle = "미적분II_205_지수방정식의실근의개수_고2_유형은행1";

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
    "content": "방정식 $e^{2x}=2x+a-2$가 서로 다른 두 실근을 갖게 하는 $a$의 범위는?",
    "choices": [
      "$a<2$",
      "$a=2$",
      "$2<a<3$",
      "$a=3$",
      "$a>3$"
    ],
    "answer": "⑤",
    "solution": "$F(x)=e^{2x}-2x+2$로 두면 주어진 방정식은 $F(x)=a$가 된다.\n합성함수의 미분법으로 $F'(x)=2e^{2x}-2=2(e^{2x}-1)$이다.\n$e^{2x}-1=0$에서 $x=0$이고, $x<0$이면 $F'(x)<0$, $x>0$이면 $F'(x)>0$이다.\n따라서 $F$는 $x=0$에서 최솟값 $F(0)=e^{0}-0+2=1+2=3$을 갖는다.\n$x\\to-\\infty$이면 $e^{2x}\\to0$, $-2x\\to\\infty$이므로 $F(x)\\to\\infty$이고, $x\\to\\infty$이면 $e^{2x}$가 $-2x$보다 빠르게 커져 $F(x)\\to\\infty$이다.\n수평선 $y=a$가 그래프와 서로 다른 두 점에서 만나려면 최솟값보다 높아야 하므로 $a>3$이다.\n주의: $a=3$이면 접점 한 개뿐이므로 서로 다른 두 실근이 아니다.\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-089",
    "problemTypeKey": "PT_DERIVATIVE_EQUATION_INEQUALITY",
    "templateKey": "TPL_ROOT_COUNT_BY_EXTREMA",
    "crossConceptKeys": [
      "CC_EXPONENTIAL_FUNCTION_GRAPH",
      "CC_DERIVATIVE_SIGN_EXTREMA_ANALYSIS"
    ],
    "conditionKeys": [
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
    "content": "방정식 $(x-2)e^{x-2}=k$가 서로 다른 두 실근을 갖는 $k$의 범위는? (단, $\\lim_{t\\to-\\infty}te^t=0$이다.)",
    "choices": [
      "$k<-1/e$",
      "$-1<k<0$",
      "$0<k<1/e$",
      "$-1/e<k<0$",
      "$k>1/e$"
    ],
    "answer": "④",
    "solution": "$t=x-2$로 치환하면 $x=t+2$이므로 방정식은 $te^{t}=k$가 된다.\n$G(t)=te^{t}$로 두고 곱의 미분법을 쓰면 $G'(t)=1\\cdot e^{t}+t\\cdot e^{t}=(t+1)e^{t}$이다.\n$G'(t)=0$에서 $t=-1$이고, $t<-1$이면 $G'(t)<0$, $t>-1$이면 $G'(t)>0$이다.\n따라서 $G$는 $t=-1$에서 최솟값 $G(-1)=-1\\cdot e^{-1}=-\\frac{1}{e}$를 갖는다.\n$\\lim_{t\\to-\\infty}te^{t}=0$이므로 $t<-1$에서 $G$의 값의 범위는 $\\left(-\\frac{1}{e},0\\right)$이고, $t>-1$에서는 $\\left[-\\frac{1}{e},\\infty\\right)$이다.\n(i) $k\\ge0$이면 $t>-1$ 쪽의 근 하나만 생기거나 근이 없다.\n(ii) $-\\frac{1}{e}<k<0$이면 $t<-1$에서 한 번, $t>-1$에서 한 번 만나 서로 다른 두 근을 갖는다.\n$k=-\\frac{1}{e}$이면 접점 한 개뿐이다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-089",
    "problemTypeKey": "PT_DERIVATIVE_EQUATION_INEQUALITY",
    "templateKey": "TPL_ROOT_COUNT_BY_EXTREMA",
    "crossConceptKeys": [
      "CC_EXPONENTIAL_FUNCTION_GRAPH",
      "CC_DERIVATIVE_SIGN_EXTREMA_ANALYSIS"
    ],
    "conditionKeys": [
      "COND_EXACT_INTERSECTION_COUNT"
    ],
    "integrationPattern": "SEQUENTIAL"
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
    "content": "방정식 $e^{x-1}+4e^{1-x}=k$가 서로 다른 두 실근을 갖게 하는 $k$의 범위는?",
    "choices": [
      "$k>2$",
      "$k>4$",
      "$k>5$",
      "$k<4$",
      "$k=4$"
    ],
    "answer": "②",
    "solution": "$t=e^{x-1}>0$으로 두면 $e^{1-x}=\\frac{1}{t}$이므로 방정식은 $t+\\frac{4}{t}=k$가 된다.\n$e^{x-1}$은 $x$가 실수 전체를 움직일 때 양수 전체를 정확히 한 번씩 가지므로 $t>0$에서만 살피면 된다.\n$F(t)=t+\\frac{4}{t}$로 두고 미분하면 $F'(t)=1-\\frac{4}{t^{2}}=\\frac{t^{2}-4}{t^{2}}=\\frac{(t-2)(t+2)}{t^{2}}$이다.\n$t>0$에서 $t=2$일 때 $F'(t)=0$이고, $0<t<2$이면 $F'(t)<0$, $t>2$이면 $F'(t)>0$이다.\n따라서 최솟값은 $F(2)=2+\\frac{4}{2}=2+2=4$이다.\n$t\\to0^{+}$이면 $\\frac{4}{t}\\to\\infty$, $t\\to\\infty$이면 $t\\to\\infty$이므로 치역은 $[4,\\infty)$이다.\n$k=4$이면 $t=2$ 한 개뿐이고, $k>4$이면 $0<t<2$에서 한 근, $t>2$에서 한 근으로 서로 다른 두 근을 갖는다.\n따라서 정답은 ②이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-089",
    "problemTypeKey": "PT_DERIVATIVE_EQUATION_INEQUALITY",
    "templateKey": "TPL_ROOT_COUNT_BY_EXTREMA",
    "crossConceptKeys": [
      "CC_EXPONENTIAL_FUNCTION_RANGE",
      "CC_EXPONENTIAL_FUNCTION_GRAPH"
    ],
    "conditionKeys": [
      "COND_EXACT_INTERSECTION_COUNT"
    ],
    "integrationPattern": "REINTERPRETATION"
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
    "content": "방정식 $x^2=ke^{x-2}$가 서로 다른 세 실근을 갖게 하는 정수 $k$의 개수는? (단, $\\lim_{x\\to\\infty}x^2e^{-x}=0$이다.)",
    "choices": [
      "$3$",
      "$4$",
      "$5$",
      "$6$",
      "$7$"
    ],
    "answer": "①",
    "solution": "양변을 $e^{x-2}>0$으로 나누면 $k=x^{2}e^{2-x}$이고, $F(x)=x^{2}e^{2-x}$로 둔다.\n곱의 미분법과 합성함수의 미분법으로 $F'(x)=2xe^{2-x}+x^{2}e^{2-x}\\cdot(-1)=x(2-x)e^{2-x}$이다.\n$e^{2-x}>0$이므로 $F'$의 부호는 $x(2-x)$의 부호와 같다.\n(i) $x<0$이면 $x<0$, $2-x>0$이므로 $F'<0$이고, $\\lim_{x\\to-\\infty}F(x)=\\infty$, $F(0)=0$이다.\n따라서 $x<0$에서 $k>0$이면 근이 정확히 하나다.\n(ii) $0<x<2$이면 $F'>0$이고 $F(0)=0$, $F(2)=4e^{0}=4$이므로 값의 범위는 $(0,4)$이다.\n(iii) $x>2$이면 $F'<0$이고 $\\lim_{x\\to\\infty}x^{2}e^{2-x}=0$이므로 값의 범위는 $(0,4)$이다.\n근의 개수를 세면 $0<k<4$일 때 음의 근 하나와 양의 근 둘로 모두 세 개다.\n주의: $k=0$이면 $x=0$ 하나뿐이고, $k=4$이면 $x=2$가 중근이 되어 두 개다.\n$0<k<4$인 정수는 $k=1,2,3$의 세 개다.\n따라서 정답은 ①이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-089",
    "problemTypeKey": "PT_DERIVATIVE_EQUATION_INEQUALITY",
    "templateKey": "TPL_ROOT_COUNT_BY_EXTREMA",
    "crossConceptKeys": [
      "CC_EXPONENTIAL_FUNCTION_GRAPH",
      "CC_DERIVATIVE_SIGN_EXTREMA_ANALYSIS"
    ],
    "conditionKeys": [
      "COND_EXACT_INTERSECTION_COUNT",
      "COND_INTEGER"
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
    "content": "방정식 $ke^{4x}-6e^{2x}+2=0$이 서로 다른 두 실근을 갖게 하는 $k$의 범위는?",
    "choices": [
      "$0<k<9/2$",
      "$0<k\\le9/2$",
      "$k<0$",
      "$0<k<9$",
      "$k>9/2$"
    ],
    "answer": "①",
    "solution": "$t=e^{2x}>0$으로 두면 방정식은 $kt^{2}-6t+2=0$이 된다.\n$t=e^{2x}$가 일대일 대응이므로 서로 다른 두 $x$의 근은 서로 다른 두 양수 $t$의 근과 같다.\n(i) $k=0$이면 $-6t+2=0$에서 $t=\\frac{1}{3}$ 하나뿐이므로 조건에 맞지 않는다.\n(ii) $k\\ne0$이면 이차방정식이므로 판별식 $D=(-6)^{2}-4\\cdot k\\cdot2=36-8k>0$에서 $k<\\frac{9}{2}$이다.\n근과 계수의 관계로 두 근의 합은 $\\frac{6}{k}$, 곱은 $\\frac{2}{k}$이다.\n두 근이 모두 양수이려면 합과 곱이 모두 양수여야 하므로 $\\frac{6}{k}>0$, $\\frac{2}{k}>0$에서 $k>0$이다.\n(i), (ii)를 합치면 $0<k<\\frac{9}{2}$이다.\n주의: $k<0$이면 곱이 음수라 양수 근이 하나뿐이고, $k=\\frac{9}{2}$이면 중근이 되어 두 근이 아니다.\n따라서 정답은 ①이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-089",
    "problemTypeKey": "PT_DERIVATIVE_EQUATION_INEQUALITY",
    "templateKey": "TPL_ROOT_COUNT_BY_EXTREMA",
    "crossConceptKeys": [
      "CC_EXPONENTIAL_FUNCTION_RANGE",
      "CC_GRAPH_X_INTERCEPT_COUNT"
    ],
    "conditionKeys": [
      "COND_EXACT_INTERSECTION_COUNT"
    ],
    "integrationPattern": "SEQUENTIAL"
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
    "content": "방정식 $(e^{2x}-2x-4)^2=k$가 서로 다른 세 실근을 갖도록 하는 상수 $k$는?",
    "choices": [
      "$4$",
      "$9$",
      "$12$",
      "$16$",
      "$25$"
    ],
    "answer": "②",
    "solution": "$F(x)=e^{2x}-2x-4$로 두면 방정식은 $F(x)^{2}=k$이다.\n합성함수의 미분법으로 $F'(x)=2e^{2x}-2=2(e^{2x}-1)$이다.\n$F'(x)=0$에서 $x=0$이고 $x<0$이면 $F'<0$, $x>0$이면 $F'>0$이다.\n따라서 $F$의 최솟값은 $F(0)=1-0-4=-3$이고 치역은 $[-3,\\infty)$이다.\n$k<0$이면 제곱값이 음수일 수 없어 해가 없고, $k=0$이면 $F(x)=0$의 근 두 개만 나온다.\n$k>0$이면 $F(x)=\\sqrt{k}$와 $F(x)=-\\sqrt{k}$로 나뉜다.\n$\\sqrt{k}>0>-3$이므로 $F(x)=\\sqrt{k}$는 항상 서로 다른 두 근을 갖는다.\n세 근이 되려면 $F(x)=-\\sqrt{k}$가 정확히 한 근이어야 하고, 이는 최솟값과 같을 때뿐이다.\n$-\\sqrt{k}=-3$에서 $\\sqrt{k}=3$이고 양변을 제곱하면 $k=9$이다.\n따라서 정답은 ②이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B45",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-089",
    "problemTypeKey": "PT_DERIVATIVE_EQUATION_INEQUALITY",
    "templateKey": "TPL_ROOT_COUNT_BY_EXTREMA",
    "crossConceptKeys": [
      "CC_EXPONENTIAL_FUNCTION_GRAPH",
      "CC_DERIVATIVE_SIGN_EXTREMA_ANALYSIS",
      "CC_FUNCTION_COMPOSITION"
    ],
    "conditionKeys": [
      "COND_EXACT_INTERSECTION_COUNT"
    ],
    "integrationPattern": "CASE_BRANCH"
  }
];
