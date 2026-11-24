window.examTitle = "미적분II_207_방정식lnx=axeˣ=ax의실근의개수_고2_유형은행1";

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
    "content": "방정식 $\\ln(2x)=(k-1)x$가 서로 다른 두 실근을 갖도록 하는 실수 $k$의 범위는?",
    "choices": [
      "$0<k<1+\\frac2e$",
      "$1<k<1+\\frac2e$",
      "$1\\le k<1+\\frac2e$",
      "$1<k\\le 1+\\frac2e$",
      "$\\frac2e<k<1$"
    ],
    "answer": "②",
    "solution": "로그의 정의역은 $x>0$이므로 양변을 $x$로 나누어 $\\frac{\\ln(2x)}x=k-1$로 놓는다.\n$F(x)=\\frac{\\ln(2x)}x$라 하면 몫의 미분법으로 $F'(x)=\\frac{\\frac1x\\cdot x-\\ln(2x)}{x^2}=\\frac{1-\\ln(2x)}{x^2}$이다.\n$F'(x)=0$인 점은 $\\ln(2x)=1$, 즉 $x=\\frac e2$이다.\n$0<x<\\frac e2$이면 $\\ln(2x)<1$이라 $F'(x)>0$이고, $x>\\frac e2$이면 $F'(x)<0$이다.\n따라서 $F$는 $(0,\\frac e2)$에서 증가하고 $(\\frac e2,\\infty)$에서 감소하며 최댓값은 $F(\\frac e2)=\\frac{\\ln e}{e/2}=\\frac2e$이다.\n$\\lim_{x\\to0^+}\\ln(2x)=-\\infty$이고 $\\lim_{x\\to0^+}\\frac1x=\\infty$이므로 $\\lim_{x\\to0^+}F(x)=-\\infty$이다.\n로그함수의 증가율이 일차함수보다 작으므로 $\\lim_{x\\to\\infty}\\frac{\\ln(2x)}x=0$이다.\n증가 구간의 치역은 $(-\\infty,\\frac2e]$, 감소 구간의 치역은 $(0,\\frac2e]$이다.\n서로 다른 두 실근을 가지려면 수평선 $y=k-1$이 두 치역에 모두 걸쳐야 하므로 $0<k-1<\\frac2e$이다.\n양변에 $1$을 더하면 $1<k<1+\\frac2e$이다.\n주의: $k=1$이면 $x=\\frac12$ 한 개, $k=1+\\frac2e$이면 접점 $x=\\frac e2$ 한 개뿐이다.\n따라서 정답은 ②이다.",
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
    "integrationPattern": "REINTERPRETATION"
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
    "content": "실수 $k$에 대한 방정식 $e^{2x}=kx$의 설명 중 옳은 것만 고른 것은?\nㄱ. $k=0$일 때 실근이 한 개이다.\nㄴ. $k>2e$일 때 양의 실근이 두 개이다.\nㄷ. $k<0$일 때 음의 실근이 한 개이다.",
    "choices": [
      "ㄱ",
      "ㄴ",
      "ㄱ, ㄷ",
      "ㄴ, ㄷ",
      "ㄱ, ㄴ, ㄷ"
    ],
    "answer": "④",
    "solution": "$e^{2x}>0$이므로 $kx>0$이어야 하고 $x=0$은 근이 아니다.\nㄱ: $k=0$이면 $e^{2x}=0$이고 지수함수는 항상 양수이므로 실근이 없다. 따라서 ㄱ은 거짓이다.\nㄴ: $k>0$이고 양의 근은 $x>0$에서 $F(x)=\\frac{e^{2x}}x=k$의 해이다.\n몫의 미분법으로 $F'(x)=\\frac{2e^{2x}\\cdot x-e^{2x}}{x^2}=\\frac{(2x-1)e^{2x}}{x^2}$이다.\n$0<x<\\frac12$에서 $F'<0$, $x>\\frac12$에서 $F'>0$이므로 $x=\\frac12$에서 최솟값 $F(\\frac12)=\\frac{e}{1/2}=2e$를 갖는다.\n$\\lim_{x\\to0^+}F(x)=\\infty$, $\\lim_{x\\to\\infty}F(x)=\\infty$이므로 $k>2e$이면 양의 실근이 두 개다. 따라서 ㄴ은 참이다.\nㄷ: $k<0$이면 $x<0$에서 $F(x)=k$를 생각한다.\n$x<0$이면 $2x-1<0$이므로 $F'(x)<0$이고 $F$는 $(-\\infty,0)$에서 순감소한다.\n$\\lim_{x\\to-\\infty}F(x)=0$, $\\lim_{x\\to0^-}F(x)=-\\infty$이므로 치역은 $(-\\infty,0)$이다.\n따라서 $k<0$이면 음의 실근이 정확히 한 개이고 ㄷ은 참이다.\n옳은 것은 ㄴ, ㄷ이다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-089",
    "problemTypeKey": "PT_DERIVATIVE_EQUATION_INEQUALITY",
    "templateKey": "TPL_ROOT_COUNT_BY_EXTREMA",
    "crossConceptKeys": [
      "CC_EXPONENTIAL_FUNCTION_GRAPH",
      "CC_DERIVATIVE_SIGN_EXTREMA_ANALYSIS",
      "CC_FUNCTION_MONOTONICITY"
    ],
    "conditionKeys": [],
    "integrationPattern": "CASE_BRANCH"
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
    "content": "$x$에 대한 두 방정식 $\\ln(2x)=kx$와 $e^{x/2}=kx$가 각각 실근을 갖지 않도록 하는 실수 $k$의 범위는?",
    "choices": [
      "$\\frac2e<k<\\frac e2$",
      "$\\frac2e\\le k<\\frac e2$",
      "$\\frac2e<k\\le\\frac e2$",
      "$\\frac1e<k<\\frac e2$",
      "$\\frac2e<k<e$"
    ],
    "answer": "①",
    "solution": "(i) 첫째 방정식 $\\ln(2x)=kx$는 정의역 $x>0$에서 $\\frac{\\ln(2x)}x=k$로 변형한다.\n$L(x)=\\frac{\\ln(2x)}x$라 하면 몫의 미분법으로 $L'(x)=\\frac{1-\\ln(2x)}{x^2}$이다.\n$x=\\frac e2$에서 $L'=0$이고, $0<x<\\frac e2$에서 $L'>0$, $x>\\frac e2$에서 $L'<0$이다.\n최댓값은 $L(\\frac e2)=\\frac{\\ln e}{e/2}=\\frac2e$이고 $\\lim_{x\\to0^+}L(x)=-\\infty$, $\\lim_{x\\to\\infty}L(x)=0$이다.\n따라서 첫째 방정식이 실근을 갖지 않을 조건은 $k>\\frac2e$이다.\n(ii) 둘째 방정식 $e^{x/2}=kx$에서 $k>\\frac2e>0$이므로 $x>0$이어야 한다.\n$E(x)=\\frac{e^{x/2}}x$라 하면 $E'(x)=\\frac{\\frac12e^{x/2}x-e^{x/2}}{x^2}=\\frac{(x-2)e^{x/2}}{2x^2}$이다.\n$0<x<2$에서 $E'<0$, $x>2$에서 $E'>0$이므로 $x=2$에서 최솟값 $E(2)=\\frac e2$이다.\n$\\lim_{x\\to0^+}E(x)=\\infty$, $\\lim_{x\\to\\infty}E(x)=\\infty$이므로 치역은 $[\\frac e2,\\infty)$이다.\n따라서 둘째 방정식이 실근을 갖지 않을 조건은 $k<\\frac e2$이다.\n두 조건의 교집합은 $\\frac2e<k<\\frac e2$이다.\n주의: $k=\\frac2e$이면 첫째가 $x=\\frac e2$에서, $k=\\frac e2$이면 둘째가 $x=2$에서 각각 접하여 실근을 갖는다.\n따라서 정답은 ①이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-089",
    "problemTypeKey": "PT_DERIVATIVE_EQUATION_INEQUALITY",
    "templateKey": "TPL_ROOT_COUNT_BY_EXTREMA",
    "crossConceptKeys": [
      "CC_LOGARITHMIC_FUNCTION_GRAPH",
      "CC_EXPONENTIAL_FUNCTION_GRAPH",
      "CC_DERIVATIVE_SIGN_EXTREMA_ANALYSIS"
    ],
    "conditionKeys": [
      "COND_EXACT_INTERSECTION_COUNT"
    ],
    "integrationPattern": "SEQUENTIAL"
  }
];
