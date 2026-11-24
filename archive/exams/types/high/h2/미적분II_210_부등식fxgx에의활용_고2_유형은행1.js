window.examTitle = "미적분II_210_부등식fxgx에의활용_고2_유형은행1";

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
    "content": "$1\\le x\\le e^2$인 모든 실수 $x$에 대하여 $x\\ln x-3x+1+k\\le0$이 성립하도록 하는 실수 $k$의 최댓값은?",
    "choices": [
      "$2$",
      "$3$",
      "$4$",
      "$5$",
      "$6$"
    ],
    "answer": "①",
    "solution": "최댓값을 구하기 위해 $F(x)=x\\ln x-3x+1$이라 놓는다.\n곱의 미분법과 $(x)'=1$, $(\\ln x)'=\\frac1x$를 쓰면 $F'(x)=1\\cdot\\ln x+x\\cdot\\frac1x-3=\\ln x-2$이다.\n$1\\le x<e^2$에서 $\\ln x<2$이므로 $F'(x)<0$이고, $x=e^2$에서 $F'(e^2)=0$이다.\n따라서 $F$는 $[1,e^2]$에서 감소하므로 최댓값은 $F(1)=1\\cdot0-3+1=-2$이다.\n모든 $x$에 대하여 $F(x)+k\\le0$이려면 최댓값에서도 $F(1)+k=-2+k\\le0$이어야 한다.\n즉 $k\\le2$이고, 이때 $F(x)+k\\le-2+2=0$이 모든 $x$에서 성립한다.\n따라서 $k$의 최댓값은 $2$이다.\n따라서 정답은 ①이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-090",
    "problemTypeKey": "PT_DERIVATIVE_EQUATION_INEQUALITY",
    "templateKey": "TPL_GLOBAL_INEQUALITY_BY_DERIVATIVE",
    "crossConceptKeys": [
      "CC_RESTRICTED_DOMAIN_DERIVATIVE_OPTIMIZATION",
      "CC_DERIVATIVE_ROOT_SOLVING"
    ],
    "conditionKeys": [
      "COND_RESTRICTED_INTERVAL"
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
    "content": "$\\frac12\\le x\\le1$인 모든 실수 $x$에 대하여 $ax\\le e^{2x}\\le bx$가 성립하도록 실수 $a,b$를 정할 때, $b-a$의 최솟값은?",
    "choices": [
      "$e(e-\\frac52)$",
      "$e(e-\\frac94)$",
      "$e(e-\\frac{17}8)$",
      "$e(e-2)$",
      "$e(e-\\frac74)$"
    ],
    "answer": "④",
    "solution": "$x>0$이므로 부등식의 각 변을 $x$로 나누어 $a\\le F(x)=\\frac{e^{2x}}x\\le b$로 바꾼다.\n몫의 미분법과 합성함수의 미분법으로 $F'(x)=\\frac{2e^{2x}\\cdot x-e^{2x}\\cdot1}{x^2}=\\frac{(2x-1)e^{2x}}{x^2}$이다.\n$\\frac12\\le x\\le1$에서 $2x-1\\ge0$이고 $e^{2x}>0$, $x^2>0$이므로 $F'(x)\\ge0$이다.\n따라서 $F$는 $[\\frac12,1]$에서 증가하고 최솟값은 $F(\\frac12)=\\frac{e^1}{1/2}=2e$이다.\n최댓값은 $F(1)=\\frac{e^2}{1}=e^2$이다.\n$a\\le F(x)\\le b$가 모든 $x$에서 성립하려면 $a\\le2e$이고 $b\\ge e^2$이어야 한다.\n따라서 $b-a\\ge e^2-2e$이고, $a=2e$, $b=e^2$일 때 등호가 성립한다.\n즉 최솟값은 $e^2-2e=e(e-2)$이다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-090",
    "problemTypeKey": "PT_DERIVATIVE_EQUATION_INEQUALITY",
    "templateKey": "TPL_GLOBAL_INEQUALITY_BY_DERIVATIVE",
    "crossConceptKeys": [
      "CC_RESTRICTED_DOMAIN_DERIVATIVE_OPTIMIZATION",
      "CC_DERIVATIVE_SIGN_EXTREMA_ANALYSIS"
    ],
    "conditionKeys": [
      "COND_RESTRICTED_INTERVAL"
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
    "content": "$\\frac1{2e}\\le x\\le\\frac{e^2}{2}$인 모든 실수 $x$에 대하여 $\\alpha x\\le\\ln(2x)\\le\\beta x$가 성립하도록 실수 $\\alpha,\\beta$를 정할 때, $\\beta-\\alpha$의 최솟값은?",
    "choices": [
      "$2e+\\frac1{2e}$",
      "$2e+\\frac1e$",
      "$2e+\\frac3{2e}$",
      "$2e+\\frac2e$",
      "$2e+\\frac3e$"
    ],
    "answer": "④",
    "solution": "$x>0$이므로 각 변을 $x$로 나누어 $\\alpha\\le F(x)=\\frac{\\ln(2x)}x\\le\\beta$로 바꾼다.\n합성함수의 미분법으로 $(\\ln(2x))'=\\frac1{2x}\\cdot2=\\frac1x$이고, 몫의 미분법을 쓰면 $F'(x)=\\frac{\\frac1x\\cdot x-\\ln(2x)\\cdot1}{x^2}=\\frac{1-\\ln(2x)}{x^2}$이다.\n$F'(x)=0$이면 $1-\\ln(2x)=0$, 즉 $\\ln(2x)=1$에서 $x=\\frac e2$이다.\n(i) $\\frac1{2e}\\le x<\\frac e2$이면 $\\ln(2x)<1$이므로 $F'(x)>0$이다.\n(ii) $\\frac e2<x\\le\\frac{e^2}2$이면 $\\ln(2x)>1$이므로 $F'(x)<0$이다.\n따라서 $F$는 $x=\\frac e2$에서 최대이고 $F(\\frac e2)=\\frac{\\ln e}{e/2}=\\frac1{e/2}=\\frac2e$이다.\n왼쪽 끝값은 $F(\\frac1{2e})=\\frac{\\ln(e^{-1})}{1/(2e)}=\\frac{-1}{1/(2e)}=-2e$이다.\n오른쪽 끝값은 $F(\\frac{e^2}2)=\\frac{\\ln(e^2)}{e^2/2}=\\frac2{e^2/2}=\\frac4{e^2}$이다.\n두 끝값을 비교하면 $-2e<0<\\frac4{e^2}$이므로 최솟값은 $-2e$이다.\n$\\alpha\\le F(x)\\le\\beta$가 모든 $x$에서 성립하려면 $\\alpha\\le-2e$, $\\beta\\ge\\frac2e$이어야 한다.\n$\\alpha=-2e$, $\\beta=\\frac2e$로 택하면 모든 $x$에서 성립하므로 $\\beta-\\alpha$의 최솟값은 $\\frac2e-(-2e)=2e+\\frac2e$이다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-090",
    "problemTypeKey": "PT_DERIVATIVE_EQUATION_INEQUALITY",
    "templateKey": "TPL_GLOBAL_INEQUALITY_BY_DERIVATIVE",
    "crossConceptKeys": [
      "CC_RESTRICTED_DOMAIN_DERIVATIVE_OPTIMIZATION",
      "CC_DERIVATIVE_ROOT_SOLVING"
    ],
    "conditionKeys": [
      "COND_RESTRICTED_INTERVAL"
    ],
    "integrationPattern": "SEQUENTIAL"
  }
];
