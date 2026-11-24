window.examTitle = "미적분II_192_fx=lnxx의그래프개형_고2_유형은행1";

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
    "content": "$f(x)=3\\ln(2x)/x$가 $x=a$에서 극댓값 $b$를 가질 때, $ab$는?",
    "choices": [
      "3",
      "4",
      "5",
      "6",
      "7"
    ],
    "answer": "①",
    "solution": "정의역은 로그의 진수가 양수이므로 $x>0$이다.\n몫의 미분법을 쓰면 $$f'(x)=\\frac{3\\cdot\\frac{1}{x}\\cdot x-3\\ln(2x)\\cdot 1}{x^2}=\\frac{3(1-\\ln(2x))}{x^2}$$이다.\n$f'(x)=0$에서 $1-\\ln(2x)=0$, 즉 $\\ln(2x)=1$이므로 $2x=e$, $x=\\frac e2$이다.\n$0<x<\\frac e2$이면 $\\ln(2x)<1$이어서 $f'(x)>0$이고, $x>\\frac e2$이면 $f'(x)<0$이므로 $x=\\frac e2$에서 극대이다.\n따라서 $a=\\frac e2$이고, 극댓값은 $$b=f\\left(\\frac e2\\right)=\\frac{3\\ln e}{e/2}=\\frac{6}{e}$$이다.\n그러므로 $ab=\\frac e2\\cdot\\frac6e=3$이다.\n따라서 정답은 ①이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-085",
    "problemTypeKey": "PT_DERIVATIVE_MONOTONICITY",
    "templateKey": "TPL_MONOTONICITY_DIRECT",
    "crossConceptKeys": [
      "CC_DERIVATIVE_ROOT_SOLVING",
      "CC_DERIVATIVE_VALUE_EVALUATION"
    ],
    "conditionKeys": [],
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
    "content": "$f(x)=\\ln(x/3)/x$가 최댓값을 갖는 $x$의 값은?",
    "choices": [
      "$e/3$",
      "$e$",
      "$2e$",
      "$3e$",
      "$4e$"
    ],
    "answer": "④",
    "solution": "정의역은 $x>0$이다.\n몫의 미분법으로 $$f'(x)=\\frac{\\frac1x\\cdot x-\\ln(x/3)\\cdot1}{x^2}=\\frac{1-\\ln(x/3)}{x^2}$$이다.\n$f'(x)=0$이면 $\\ln(x/3)=1$이고, $x/3=e$에서 $x=3e$이다.\n$0<x<3e$에서는 $\\ln(x/3)<1$이므로 $f'(x)>0$, $x>3e$에서는 $f'(x)<0$이다.\n따라서 $f$는 $x=3e$까지 증가한 뒤 감소하므로 이 점에서 최댓값을 갖는다.\n그러므로 최댓값을 주는 $x$의 값은 $3e$이다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-085",
    "problemTypeKey": "PT_DERIVATIVE_MONOTONICITY",
    "templateKey": "TPL_MONOTONICITY_DIRECT",
    "crossConceptKeys": [
      "CC_DERIVATIVE_ROOT_SOLVING"
    ],
    "conditionKeys": [],
    "integrationPattern": "NONE"
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
    "content": "$y=2\\ln x/x$의 변곡점에서 접선의 기울기는?",
    "choices": [
      "$-e^{-3}$",
      "$-e^{-4}$",
      "$0$",
      "$e^{-4}$",
      "$e^{-3}$"
    ],
    "answer": "①",
    "solution": "정의역은 $x>0$이다.\n몫의 미분법으로 $$y'=\\frac{2\\cdot\\frac1x\\cdot x-2\\ln x\\cdot1}{x^2}=\\frac{2(1-\\ln x)}{x^2}$$이다.\n$y'=2x^{-2}(1-\\ln x)$를 곱의 미분법으로 다시 미분하면 $$y''=2\\left[-2x^{-3}(1-\\ln x)+x^{-2}\\left(-\\frac1x\\right)\\right]=\\frac{4\\ln x-6}{x^3}$$이다.\n$y''=0$에서 $4\\ln x-6=0$, 즉 $\\ln x=\\frac32$이고 $x=e^{3/2}$이다.\n$0<x<e^{3/2}$에서는 $y''<0$, $x>e^{3/2}$에서는 $y''>0$이므로 이 점이 변곡점이다.\n변곡점에서의 접선의 기울기는 $$y'(e^{3/2})=\\frac{2(1-3/2)}{(e^{3/2})^2}=\\frac{-1}{e^3}=-e^{-3}$$이다.\n따라서 정답은 ①이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-085",
    "problemTypeKey": "PT_DERIVATIVE_MONOTONICITY",
    "templateKey": "TPL_MONOTONICITY_DIRECT",
    "crossConceptKeys": [
      "CC_TANGENT_LINE_SLOPE_AT_POINT",
      "CC_DERIVATIVE_VALUE_EVALUATION"
    ],
    "conditionKeys": [],
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
    "content": "방정식 $\\ln x/x^2=a$가 정확히 하나의 실근을 갖도록 하는 양수 $a$는?",
    "choices": [
      "$1/(5e)$",
      "$1/(4e)$",
      "$1/(3e)$",
      "$1/(2e)$",
      "$1/e$"
    ],
    "answer": "④",
    "solution": "$f(x)=\\frac{\\ln x}{x^2}$ ($x>0$)이라 하자.\n몫의 미분법으로 $$f'(x)=\\frac{\\frac1x\\cdot x^2-\\ln x\\cdot2x}{x^4}=\\frac{1-2\\ln x}{x^3}$$이다.\n$f'(x)=0$에서 $\\ln x=\\frac12$, 즉 $x=\\sqrt e$이다.\n$0<x<\\sqrt e$이면 $f'(x)>0$, $x>\\sqrt e$이면 $f'(x)<0$이므로 $f$는 $x=\\sqrt e$에서 최대이다.\n최댓값은 $$f(\\sqrt e)=\\frac{\\ln e^{1/2}}{e}=\\frac{1}{2e}$$이다.\n$\\lim_{x\\to0^{+}}f(x)=-\\infty$, $\\lim_{x\\to\\infty}f(x)=0$이므로 치역은 $\\left(-\\infty,\\frac1{2e}\\right]$이다.\n(i) $0<a<\\frac1{2e}$이면 수평선 $y=a$가 그래프와 두 번 만난다.\n(ii) $a=\\frac1{2e}$이면 최댓점에서 한 번 만난다.\n(iii) $a>\\frac1{2e}$이면 만나지 않는다.\n따라서 정확히 하나의 실근을 갖게 하는 양수 $a$는 $\\frac1{2e}$이다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-085",
    "problemTypeKey": "PT_DERIVATIVE_MONOTONICITY",
    "templateKey": "TPL_MONOTONICITY_DIRECT",
    "crossConceptKeys": [
      "CC_GRAPH_INTERSECTION_COUNT",
      "CC_DERIVATIVE_SIGN_EXTREMA_ANALYSIS"
    ],
    "conditionKeys": [
      "COND_EXACT_INTERSECTION_COUNT",
      "COND_POSITIVE"
    ],
    "integrationPattern": "REINTERPRETATION"
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
    "content": "$f(x)=\\ln(2x)/x$에 관해 옳은 것을 모두 고르시오.\nㄱ. 극대점의 $x$좌표는 $e$이다.\nㄴ. $x$축과의 교점은 $(1/2,0)$ 하나이다.\nㄷ. 변곡점의 $x$좌표는 $e^{3/2}$이다.",
    "choices": [
      "ㄱ",
      "ㄴ",
      "ㄷ",
      "ㄱ, ㄴ",
      "ㄴ, ㄷ"
    ],
    "answer": "②",
    "solution": "정의역은 $x>0$이다.\n몫의 미분법으로 $$f'(x)=\\frac{\\frac1x\\cdot x-\\ln(2x)\\cdot1}{x^2}=\\frac{1-\\ln(2x)}{x^2}$$이다.\n$f'(x)=0$에서 $\\ln(2x)=1$, 즉 $2x=e$이므로 $x=\\frac e2$이다. 따라서 ㄱ은 거짓이다.\n$f(x)=0$에서 $\\ln(2x)=0$, 즉 $2x=1$이므로 $x=\\frac12$이다. 따라서 $x$축과의 교점은 $\\left(\\frac12,0\\right)$ 하나이고 ㄴ은 참이다.\n$f'=x^{-2}(1-\\ln(2x))$를 다시 미분하면 $$f''(x)=\\frac{2\\ln(2x)-3}{x^3}$$이다.\n$f''(x)=0$에서 $\\ln(2x)=\\frac32$, 즉 $2x=e^{3/2}$이므로 $x=\\frac{e^{3/2}}2$이다. 따라서 ㄷ은 거짓이다.\n참인 것은 ㄴ뿐이다.\n따라서 정답은 ②이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-085",
    "problemTypeKey": "PT_DERIVATIVE_MONOTONICITY",
    "templateKey": "TPL_MONOTONICITY_DIRECT",
    "crossConceptKeys": [
      "CC_DERIVATIVE_ROOT_SOLVING",
      "CC_AXIS_INTERCEPT",
      "CC_DERIVATIVE_SIGN_EXTREMA_ANALYSIS"
    ],
    "conditionKeys": [],
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
    "content": "양의 정수 $n$에 대해 $f(x)=2\\ln x/x^n$ ($x>0$)이다. 옳은 것을 모두 고르시오.\nㄱ. $f$는 $x=e^{1/n}$에서 극대이다.\nㄴ. $n=2$이면 $(0,e^{5/6})$에서 위로 볼록하다.\nㄷ. 모든 $n$에 대하여 $f(x)\\le 2/(ne)$이다.",
    "choices": [
      "ㄱ",
      "ㄷ",
      "ㄱ, ㄴ",
      "ㄴ, ㄷ",
      "ㄱ, ㄴ, ㄷ"
    ],
    "answer": "⑤",
    "solution": "정의역은 $x>0$이다.\n$f(x)=2x^{-n}\\ln x$에 곱의 미분법을 쓰면 $$f'(x)=2\\left[-nx^{-n-1}\\ln x+x^{-n}\\cdot\\frac1x\\right]=\\frac{2(1-n\\ln x)}{x^{n+1}}$$이다.\n$f'(x)=0$에서 $\\ln x=\\frac1n$, 즉 $x=e^{1/n}$이다.\n$0<x<e^{1/n}$이면 $1-n\\ln x>0$이고 $x>e^{1/n}$이면 $1-n\\ln x<0$이므로 $x=e^{1/n}$에서 극대이다. 따라서 ㄱ은 참이다.\n다시 미분하면 $$f''(x)=\\frac{2n(n+1)\\ln x-2(2n+1)}{x^{n+2}}$$이다.\n$n=2$를 대입하면 $$f''(x)=\\frac{12\\ln x-10}{x^4}=\\frac{2(6\\ln x-5)}{x^4}$$이다.\n$0<x<e^{5/6}$이면 $6\\ln x-5<0$이므로 $f''(x)<0$이고, $f$는 이 구간에서 위로 볼록하다. 따라서 ㄴ은 참이다.\n최댓값은 $$f(e^{1/n})=\\frac{2\\ln e^{1/n}}{(e^{1/n})^n}=\\frac{2\\cdot\\frac1n}{e}=\\frac{2}{ne}$$이다.\n모든 $x>0$에서 $f(x)\\le\\frac{2}{ne}$이므로 ㄷ도 참이다.\nㄱ, ㄴ, ㄷ이 모두 참이다.\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-085",
    "problemTypeKey": "PT_DERIVATIVE_MONOTONICITY",
    "templateKey": "TPL_MONOTONICITY_DIRECT",
    "crossConceptKeys": [
      "CC_DERIVATIVE_SIGN_EXTREMA_ANALYSIS",
      "CC_FUNCTION_VALUE_SIGN_INEQUALITY",
      "CC_POLYNOMIAL_DERIVATIVE_RULE"
    ],
    "conditionKeys": [
      "COND_NATURAL_NUMBER",
      "COND_UNIVERSAL_INPUTS"
    ],
    "integrationPattern": "CASE_BRANCH"
  }
];
