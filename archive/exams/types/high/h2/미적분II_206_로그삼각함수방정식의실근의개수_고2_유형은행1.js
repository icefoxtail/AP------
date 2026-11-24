window.examTitle = "미적분II_206_로그삼각함수방정식의실근의개수_고2_유형은행1";

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
    "content": "방정식 $\\ln(2x)+3=2x+a$가 서로 다른 두 실근을 갖도록 하는 실수 $a$의 범위는?",
    "choices": [
      "$a\\le -2$",
      "$a<-2$",
      "$a>2$",
      "$a\\le 2$",
      "$a<2$"
    ],
    "answer": "⑤",
    "solution": "로그의 진수 조건에서 $2x>0$, 즉 $x>0$이다.\n주어진 식을 $a$에 대하여 정리하면 $a=\\ln(2x)-2x+3$이다.\n우변을 $f(x)=\\ln(2x)-2x+3$이라 두고 합성함수의 미분법을 쓰면 $f'(x)=\\frac{2}{2x}-2=\\frac{1}{x}-2=\\frac{1-2x}{x}$이다.\n$x>0$이므로 $f'(x)$의 부호는 분자 $1-2x$의 부호와 같다.\n$0<x<\\frac12$에서 $f'(x)>0$이므로 $f$는 증가하고, $x>\\frac12$에서 $f'(x)<0$이므로 $f$는 감소한다.\n따라서 $x=\\frac12$에서 최댓값을 가지며 그 값은 $f\\left(\\frac12\\right)=\\ln 1-1+3=2$이다.\n로그함수의 극한에서 $\\lim_{x\\to0^+}\\ln(2x)=-\\infty$이므로 $\\lim_{x\\to0^+}f(x)=-\\infty$이다.\n$\\lim_{x\\to\\infty}\\frac{\\ln(2x)}{x}=0$이므로 $\\lim_{x\\to\\infty}f(x)=\\lim_{x\\to\\infty}x\\left(\\frac{\\ln(2x)}{x}-2+\\frac3x\\right)=-\\infty$이다.\n연속함수 $f$의 그래프가 최댓값 $2$를 꼭짓점으로 양쪽에서 $-\\infty$까지 내려가므로 수평선 $y=a$와 서로 다른 두 점에서 만나는 조건은 $a<2$이다.\n주의: $a=2$이면 접점 $x=\\frac12$ 한 곳에서만 만나므로 서로 다른 두 실근이 아니다.\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-089",
    "problemTypeKey": "PT_DERIVATIVE_EQUATION_INEQUALITY",
    "templateKey": "TPL_ROOT_COUNT_BY_EXTREMA",
    "crossConceptKeys": [
      "CC_LOGARITHMIC_FUNCTION_GRAPH",
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
    "content": "방정식 $3x-\\ln(3x)+2=a$가 실근을 갖지 않도록 하는 실수 $a$의 범위는?",
    "choices": [
      "$a<3$",
      "$a\\le 3$",
      "$a>3$",
      "$a\\ge 3$",
      "$a<2$"
    ],
    "answer": "①",
    "solution": "로그의 진수 조건에서 $3x>0$, 즉 $x>0$이다.\n$f(x)=3x-\\ln(3x)+2$라 두면 주어진 방정식은 $f(x)=a$이다.\n합성함수의 미분법을 쓰면 $f'(x)=3-\\frac{3}{3x}=3-\\frac1x=\\frac{3x-1}{x}$이다.\n$x>0$에서 $0<x<\\frac13$이면 $f'(x)<0$이고 $x>\\frac13$이면 $f'(x)>0$이므로 $f$는 $x=\\frac13$에서 최솟값을 갖는다.\n그 최솟값은 $f\\left(\\frac13\\right)=1-\\ln 1+2=3$이다.\n$\\lim_{x\\to0^+}f(x)=0-(-\\infty)+2=\\infty$이고 $\\lim_{x\\to\\infty}f(x)=\\lim_{x\\to\\infty}x\\left(3-\\frac{\\ln(3x)}{x}+\\frac2x\\right)=\\infty$이다.\n연속함수 $f$의 치역이 $[3,\\infty)$이므로 $f(x)=a$가 실근을 갖지 않을 조건은 $a<3$이다.\n따라서 정답은 ①이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-089",
    "problemTypeKey": "PT_DERIVATIVE_EQUATION_INEQUALITY",
    "templateKey": "TPL_ROOT_COUNT_BY_EXTREMA",
    "crossConceptKeys": [
      "CC_LOGARITHMIC_FUNCTION_GRAPH",
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
    "content": "방정식 $2\\ln(x/2)-x+15-n=0$이 서로 다른 두 실근을 갖도록 하는 양의 정수 $n$의 개수는?",
    "choices": [
      "$11$",
      "$12$",
      "$13$",
      "$14$",
      "$15$"
    ],
    "answer": "②",
    "solution": "$f(x)=2\\ln\\frac{x}{2}-x+15$라 두면 정의역은 $x>0$이고 방정식은 $f(x)=n$이다.\n합성함수의 미분법에서 $\\left(\\ln\\frac{x}{2}\\right)'=\\frac{1/2}{x/2}=\\frac1x$이므로 $f'(x)=\\frac{2}{x}-1=\\frac{2-x}{x}$이다.\n$x>0$에서 $0<x<2$이면 $f'(x)>0$이고 $x>2$이면 $f'(x)<0$이므로 $f$는 $x=2$에서 최댓값을 갖는다.\n최댓값은 $f(2)=2\\ln 1-2+15=13$이다.\n$\\lim_{x\\to0^+}f(x)=-\\infty-0+15=-\\infty$이고 $\\lim_{x\\to\\infty}\\frac{\\ln(x/2)}{x}=0$이므로 $\\lim_{x\\to\\infty}f(x)=\\lim_{x\\to\\infty}x\\left(2\\frac{\\ln(x/2)}{x}-1+\\frac{15}{x}\\right)=-\\infty$이다.\n$f$가 $(0,2)$에서 증가하여 $13$에 이르고 $(2,\\infty)$에서 감소하여 $-\\infty$로 가므로, $f(x)=n$이 양쪽 구간에서 각각 한 근을 가지려면 $n<13$이어야 한다.\n주의: $n=13$이면 $x=2$ 한 곳에서만 만나므로 서로 다른 두 실근이 아니다.\n조건을 만족하는 양의 정수는 $n=1,2,\\ldots,12$이고 그 개수는 $12$이다.\n따라서 정답은 ②이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-089",
    "problemTypeKey": "PT_DERIVATIVE_EQUATION_INEQUALITY",
    "templateKey": "TPL_ROOT_COUNT_BY_EXTREMA",
    "crossConceptKeys": [
      "CC_LOGARITHMIC_FUNCTION_GRAPH",
      "CC_DERIVATIVE_SIGN_EXTREMA_ANALYSIS"
    ],
    "conditionKeys": [
      "COND_EXACT_INTERSECTION_COUNT",
      "COND_NATURAL_NUMBER"
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
    "content": "방정식 $x\\ln(x/2)-3x=k$가 적어도 하나의 실근을 가질 때, 가능한 $k$의 최솟값에 $-1$을 곱한 값은?",
    "choices": [
      "$2$",
      "$e$",
      "$2e$",
      "$e^2$",
      "$2e^2$"
    ],
    "answer": "⑤",
    "solution": "$f(x)=x\\ln\\frac{x}{2}-3x$ $(x>0)$라 두면 주어진 방정식은 $f(x)=k$이다.\n곱의 미분법과 합성함수의 미분법을 쓰면 $f'(x)=1\\cdot\\ln\\frac{x}{2}+x\\cdot\\frac1x-3=\\ln\\frac{x}{2}-2$이다.\n$f'(x)=0$에서 $\\ln\\frac{x}{2}=2$, 즉 $\\frac{x}{2}=e^2$이므로 $x=2e^2$이다.\n$0<x<2e^2$이면 $\\ln\\frac{x}{2}<2$라서 $f'(x)<0$이고, $x>2e^2$이면 $f'(x)>0$이므로 $f$는 $x=2e^2$에서 최솟값을 갖는다.\n그 최솟값은 $f(2e^2)=2e^2\\ln e^2-3\\cdot2e^2=4e^2-6e^2=-2e^2$이다.\n$\\lim_{x\\to0^+}x\\ln\\frac{x}{2}=0$이고 $\\lim_{x\\to\\infty}f(x)=\\lim_{x\\to\\infty}x\\left(\\ln\\frac{x}{2}-3\\right)=\\infty$이므로 $f$의 치역은 $[-2e^2,\\infty)$이다.\n따라서 $f(x)=k$가 적어도 하나의 실근을 갖는 $k$의 최솟값은 $-2e^2$이고, 여기에 $-1$을 곱하면 $(-1)\\times(-2e^2)=2e^2$이다.\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-089",
    "problemTypeKey": "PT_DERIVATIVE_EQUATION_INEQUALITY",
    "templateKey": "TPL_ROOT_COUNT_BY_EXTREMA",
    "crossConceptKeys": [
      "CC_LOGARITHMIC_FUNCTION_GRAPH",
      "CC_DERIVATIVE_SIGN_EXTREMA_ANALYSIS"
    ],
    "conditionKeys": [],
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
    "content": "$-\\frac{\\pi}{4}<x<\\frac{\\pi}{4}$에서 방정식 $\\sin(2x)=kx$가 서로 다른 세 실근을 갖도록 하는 실수 $k$의 범위는?",
    "choices": [
      "$0<k<\\frac4\\pi$",
      "$0<k<2$",
      "$\\frac4\\pi\\le k<2$",
      "$\\frac4\\pi<k<2$",
      "$\\frac4\\pi<k\\le 2$"
    ],
    "answer": "④",
    "solution": "$x=0$을 대입하면 $\\sin 0=0=k\\cdot0$이므로 $x=0$은 $k$에 관계없이 항상 실근이다.\n(i) $x\\ne0$일 때 방정식을 $k=\\frac{\\sin 2x}{x}$로 변형한다.\n$F(x)=\\frac{\\sin 2x}{x}$는 $F(-x)=\\frac{\\sin(-2x)}{-x}=\\frac{\\sin 2x}{x}=F(x)$이므로 짝함수이다. 따라서 $0<x<\\frac{\\pi}{4}$의 교점 수를 세고 $x<0$ 쪽은 대칭으로 처리한다.\n몫의 미분법을 쓰면 $F'(x)=\\frac{2x\\cos 2x-\\sin 2x}{x^2}$이다.\n분자를 $G(x)=2x\\cos 2x-\\sin 2x$라 하고 곱의 미분법과 합성함수의 미분법을 쓰면 $G'(x)=2\\cos 2x-4x\\sin 2x-2\\cos 2x=-4x\\sin 2x$이다.\n$0<x<\\frac{\\pi}{4}$에서 $\\sin 2x>0$이므로 $G'(x)<0$이고, $G(0)=0$이므로 $G(x)<0$이다.\n따라서 $F'(x)<0$이어서 $F$는 $0<x<\\frac{\\pi}{4}$에서 감소한다.\n삼각함수의 극한 $\\lim_{x\\to0^+}\\frac{\\sin 2x}{x}=2$에서 $\\lim_{x\\to0^+}F(x)=2$이고, $F\\left(\\frac{\\pi}{4}\\right)=\\frac{\\sin(\\pi/2)}{\\pi/4}=\\frac{4}{\\pi}$이다.\n그러므로 $0<x<\\frac{\\pi}{4}$에서 $F(x)$의 치역은 $\\left(\\frac{4}{\\pi},2\\right)$이고 $k$마다 교점이 정확히 하나이다.\n(ii) 짝함수 성질에 의해 $-\\frac{\\pi}{4}<x<0$에서도 치역이 같고 $k$마다 교점이 하나씩 생긴다.\n$x=0$의 근까지 합쳐 서로 다른 세 실근이 되려면 양의 근과 음의 근이 각각 하나씩 있어야 하므로 $\\frac{4}{\\pi}<k<2$이다.\n주의: $k=2$이면 열린 구간에서 값 $2$에 도달하지 못해 양의 근이 없고, $k=\\frac{4}{\\pi}$이면 경계 $x=\\pm\\frac{\\pi}{4}$가 제외되어 역시 양의 근이 생기지 않는다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B45",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-089",
    "problemTypeKey": "PT_DERIVATIVE_EQUATION_INEQUALITY",
    "templateKey": "TPL_ROOT_COUNT_BY_EXTREMA",
    "crossConceptKeys": [
      "CC_TANGENT_LINE_SLOPE_AT_POINT",
      "CC_DERIVATIVE_SIGN_EXTREMA_ANALYSIS"
    ],
    "conditionKeys": [
      "COND_RESTRICTED_INTERVAL",
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
    "content": "실수 전체에서 미분가능한 두 함수 $f,g$가 다음 조건을 만족시킨다.\n(가) $x<1$이면 $f'(x)>g'(x)$이다.\n(나) $x>1$이면 $f'(x)<g'(x)$이다.\n(다) $f(1)-g(1)=3$이다.\n이 조건 아래 방정식 $f(x)=g(x)$의 서로 다른 실근 개수의 최댓값을 $M$, 최솟값을 $m$이라 할 때 $2M+m$의 값은?",
    "choices": [
      "$1$",
      "$2$",
      "$3$",
      "$4$",
      "$5$"
    ],
    "answer": "④",
    "solution": "$h(x)=f(x)-g(x)$라 두면 $h'(x)=f'(x)-g'(x)$이고 $h(1)=f(1)-g(1)=3$이다.\n주어진 방정식 $f(x)=g(x)$는 $h(x)=0$과 같다.\n(i) $x<1$에서 $h'(x)>0$이므로 $h$는 $(-\\infty,1)$에서 증가한다. 증가함수이므로 이 구간에서 $h(x)=0$의 근은 많아야 하나이다.\n(ii) $x>1$에서 $h'(x)<0$이므로 $h$는 $(1,\\infty)$에서 감소한다. 감소함수이므로 이 구간에서도 근은 많아야 하나이다.\n$h(1)=3\\ne0$이므로 $x=1$은 근이 아니고, 전체 실근은 많아야 $1+1=2$개이다. 즉 $M\\le2$이다.\n$f(x)=3-(x-1)^2$, $g(x)=0$이면 $h(x)=3-(x-1)^2$, $h'(x)=-2(x-1)$이므로 $x<1$에서 $h'>0$, $x>1$에서 $h'<0$, $h(1)=3$으로 조건을 만족한다.\n이때 $h(x)=0$에서 $(x-1)^2=3$, 즉 $x=1\\pm\\sqrt3$이므로 실근이 $2$개이고 $M=2$이다.\n$f(x)=2+e^{-(x-1)^2}$, $g(x)=0$이면 $h'(x)=-2(x-1)e^{-(x-1)^2}$이므로 역시 $x<1$에서 $h'>0$, $x>1$에서 $h'<0$이고 $h(1)=2+1=3$이다.\n이때 $h(x)=2+e^{-(x-1)^2}>2$이므로 $h(x)=0$의 실근은 없고 $m=0$이다.\n따라서 $2M+m=2\\cdot2+0=4$이다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-089",
    "problemTypeKey": "PT_DERIVATIVE_EQUATION_INEQUALITY",
    "templateKey": "TPL_ROOT_COUNT_BY_EXTREMA",
    "crossConceptKeys": [
      "CC_FUNCTION_MONOTONICITY",
      "CC_DERIVATIVE_SIGN_EXTREMA_ANALYSIS"
    ],
    "conditionKeys": [
      "COND_INEQUALITY_CONSTRAINT",
      "COND_FUNCTION_VALUE_CONSTRAINT"
    ],
    "integrationPattern": "CASE_BRANCH"
  }
];
