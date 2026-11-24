window.examTitle = "미적분II_208_극값이존재하는부등식의활용_고2_유형은행1";

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
    "content": "모든 실수 $x$에 대하여 $e^{2x}+3-a\\ge 2x$가 성립하도록 하는 실수 $a$의 최댓값은?",
    "choices": [
      "$0$",
      "$1$",
      "$2$",
      "$3$",
      "$4$"
    ],
    "answer": "⑤",
    "solution": "$e^{2x}+3-a\\ge 2x$를 $a$에 대하여 정리하면 $a\\le e^{2x}-2x+3$이다.\n$f(x)=e^{2x}-2x+3$이라 하면 합성함수의 미분법으로 $f'(x)=2e^{2x}-2=2(e^{2x}-1)$이다.\n$e^{2x}=1$인 $x=0$을 기준으로 $x<0$이면 $e^{2x}<1$이라 $f'(x)<0$, $x>0$이면 $f'(x)>0$이다.\n따라서 $f$는 $x=0$에서 최솟값 $f(0)=e^{0}-0+3=1+3=4$를 갖는다.\n모든 실수 $x$에서 $a\\le f(x)$일 조건은 $a\\le4$이므로 $a$의 최댓값은 $4$이다.\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-090",
    "problemTypeKey": "PT_DERIVATIVE_EQUATION_INEQUALITY",
    "templateKey": "TPL_GLOBAL_INEQUALITY_BY_DERIVATIVE",
    "crossConceptKeys": [
      "CC_DERIVATIVE_SIGN_EXTREMA_ANALYSIS",
      "CC_EXPONENTIAL_FUNCTION_GRAPH"
    ],
    "conditionKeys": [
      "COND_UNIVERSAL_INPUTS"
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
    "content": "양수 $a$에 대하여 모든 실수 $x$에서 $3e^{2x}\\ge ax$가 성립할 때, $a$의 최댓값은?",
    "choices": [
      "$e$",
      "$2e$",
      "$3e$",
      "$4e$",
      "$6e$"
    ],
    "answer": "⑤",
    "solution": "(i) $x\\le0$이면 $ax\\le0$이고 $3e^{2x}>0$이므로 $3e^{2x}>ax$가 항상 성립한다.\n(ii) $x>0$이면 양변을 $x$로 나누어 $a\\le f(x)=\\frac{3e^{2x}}{x}$로 정리된다.\n몫의 미분법을 쓰면 $f'(x)=\\frac{6e^{2x}\\cdot x-3e^{2x}\\cdot1}{x^2}=\\frac{3e^{2x}(2x-1)}{x^2}$이다.\n$x>0$에서 $e^{2x}>0$, $x^2>0$이므로 $f'$의 부호는 $2x-1$의 부호와 같다.\n$0<x<\\frac12$에서 $f'(x)<0$, $x>\\frac12$에서 $f'(x)>0$이므로 $x=\\frac12$에서 최솟값을 갖는다.\n$f\\left(\\frac12\\right)=\\frac{3e^{2\\cdot(1/2)}}{1/2}=\\frac{3e}{1/2}=6e$이다.\n두 경우 모두에서 성립하려면 $a\\le6e$이어야 하므로 $a$의 최댓값은 $6e$이다.\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-090",
    "problemTypeKey": "PT_DERIVATIVE_EQUATION_INEQUALITY",
    "templateKey": "TPL_GLOBAL_INEQUALITY_BY_DERIVATIVE",
    "crossConceptKeys": [
      "CC_DERIVATIVE_SIGN_EXTREMA_ANALYSIS",
      "CC_EXPONENTIAL_FUNCTION_GRAPH"
    ],
    "conditionKeys": [
      "COND_UNIVERSAL_INPUTS",
      "COND_POSITIVE"
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
    "content": "모든 양수 $x$에서 $2x-\\ln(ax)\\ge 0$이 성립하도록 하는 양수 $a$의 범위는?",
    "choices": [
      "$0<a\\le e$",
      "$0<a<2e$",
      "$0<a\\le2e$",
      "$a\\ge2e$",
      "$0<a\\le3e$"
    ],
    "answer": "③",
    "solution": "로그의 성질 $\\ln(ax)=\\ln a+\\ln x$를 쓰면 $2x-\\ln a-\\ln x\\ge0$, 즉 $\\ln a\\le 2x-\\ln x$이다.\n$f(x)=2x-\\ln x$라 하면 $f'(x)=2-\\frac1x=\\frac{2x-1}{x}$이다.\n$x>0$이므로 $0<x<\\frac12$에서 $f'(x)<0$, $x>\\frac12$에서 $f'(x)>0$이다.\n따라서 $f$의 최솟값은 $f\\left(\\frac12\\right)=1-\\ln\\frac12=1-(\\ln1-\\ln2)=1+\\ln2$이다.\n$\\ln a\\le1+\\ln2=\\ln2+\\ln e=\\ln(2e)$이고 지수함수가 증가하므로 $a\\le2e$이다.\n$a>0$이라는 조건과 합치면 $0<a\\le2e$이다.\n따라서 정답은 ③이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-090",
    "problemTypeKey": "PT_DERIVATIVE_EQUATION_INEQUALITY",
    "templateKey": "TPL_GLOBAL_INEQUALITY_BY_DERIVATIVE",
    "crossConceptKeys": [
      "CC_LOGARITHMIC_FUNCTION_GRAPH",
      "CC_DERIVATIVE_SIGN_EXTREMA_ANALYSIS"
    ],
    "conditionKeys": [
      "COND_POSITIVE"
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
    "content": "모든 양수 $x$에 대하여 $x\\ln x\\ge2x+k$가 성립하도록 하는 실수 $k$의 최댓값은?",
    "choices": [
      "$-5$",
      "$-3$",
      "$-e$",
      "$-2$",
      "$-1$"
    ],
    "answer": "③",
    "solution": "$k\\le x\\ln x-2x=f(x)$가 모든 $x>0$에서 성립해야 한다.\n곱의 미분법을 쓰면 $f'(x)=1\\cdot\\ln x+x\\cdot\\frac1x-2=\\ln x-1$이다.\n$\\ln x=1$인 $x=e$를 기준으로 $0<x<e$이면 $f'(x)<0$, $x>e$이면 $f'(x)>0$이다.\n따라서 $f$는 $x=e$에서 최솟값 $f(e)=e\\ln e-2e=e\\cdot1-2e=-e$를 갖는다.\n모든 $x>0$에서 $k\\le f(x)$일 조건은 $k\\le-e$이므로 $k$의 최댓값은 $-e$이다.\n따라서 정답은 ③이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-090",
    "problemTypeKey": "PT_DERIVATIVE_EQUATION_INEQUALITY",
    "templateKey": "TPL_GLOBAL_INEQUALITY_BY_DERIVATIVE",
    "crossConceptKeys": [
      "CC_LOGARITHMIC_FUNCTION_GRAPH",
      "CC_DERIVATIVE_SIGN_EXTREMA_ANALYSIS"
    ],
    "conditionKeys": [
      "COND_POSITIVE"
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
    "content": "$x>2$인 모든 실수 $x$에서 $3x+k\\ge\\ln(x-2)$가 성립하도록 하는 실수 $k$의 최솟값은?",
    "choices": [
      "$-8-\\ln3$",
      "$-7-\\ln3$",
      "$-6-\\ln3$",
      "$-5-\\ln3$",
      "$-4-\\ln3$"
    ],
    "answer": "②",
    "solution": "$3x+k\\ge\\ln(x-2)$를 정리하면 $k\\ge\\ln(x-2)-3x=f(x)$이다.\n합성함수의 미분법을 쓰면 $f'(x)=\\frac1{x-2}-3=\\frac{1-3(x-2)}{x-2}=\\frac{7-3x}{x-2}$이다.\n$x>2$이므로 $x-2>0$이고, $f'(x)=0$인 $x=\\frac73$을 기준으로 부호를 조사한다.\n$2<x<\\frac73$에서 $7-3x>0$이라 $f'(x)>0$, $x>\\frac73$에서 $7-3x<0$이라 $f'(x)<0$이다.\n따라서 $f$의 최댓값은 $f\\left(\\frac73\\right)=\\ln\\frac13-3\\cdot\\frac73=-\\ln3-7$이다.\n모든 $x>2$에서 $k\\ge f(x)$일 최솟값은 $-7-\\ln3$이다.\n따라서 정답은 ②이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-090",
    "problemTypeKey": "PT_DERIVATIVE_EQUATION_INEQUALITY",
    "templateKey": "TPL_GLOBAL_INEQUALITY_BY_DERIVATIVE",
    "crossConceptKeys": [
      "CC_LOGARITHMIC_FUNCTION_GRAPH",
      "CC_DERIVATIVE_SIGN_EXTREMA_ANALYSIS",
      "CC_RESTRICTED_DOMAIN_EXTREMA"
    ],
    "conditionKeys": [
      "COND_LOWER_BOUND"
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
    "content": "$x<1$인 모든 실수 $x$에 대하여 $x^2+k\\ge12\\ln(1-x)$가 성립하도록 하는 실수 $k$의 최솟값은?",
    "choices": [
      "$12\\ln3-4$",
      "$12\\ln3-3$",
      "$12\\ln3-2$",
      "$12\\ln3-1$",
      "$12\\ln3$"
    ],
    "answer": "①",
    "solution": "$k\\ge12\\ln(1-x)-x^2=f(x)$가 모든 $x<1$에서 성립해야 한다.\n합성함수의 미분법을 쓰면 $f'(x)=\\frac{12}{1-x}\\cdot(-1)-2x=-\\frac{12}{1-x}-2x$이다.\n통분하면 $f'(x)=\\frac{-12-2x(1-x)}{1-x}=\\frac{2x^2-2x-12}{1-x}=\\frac{2(x-3)(x+2)}{1-x}$이다.\n$x<1$이면 $1-x>0$이고 $x-3<0$이므로 $f'$의 부호는 $-(x+2)$의 부호와 같다.\n$x<-2$에서 $f'(x)>0$, $-2<x<1$에서 $f'(x)<0$이므로 $x=-2$에서 최댓값을 갖는다.\n$f(-2)=12\\ln(1-(-2))-(-2)^2=12\\ln3-4$이다.\n모든 $x<1$에서 $k\\ge f(x)$일 최솟값은 $12\\ln3-4$이다.\n따라서 정답은 ①이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B45",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-090",
    "problemTypeKey": "PT_DERIVATIVE_EQUATION_INEQUALITY",
    "templateKey": "TPL_GLOBAL_INEQUALITY_BY_DERIVATIVE",
    "crossConceptKeys": [
      "CC_LOGARITHMIC_FUNCTION_GRAPH",
      "CC_DERIVATIVE_SIGN_EXTREMA_ANALYSIS",
      "CC_RESTRICTED_DOMAIN_EXTREMA"
    ],
    "conditionKeys": [
      "COND_UPPER_BOUND"
    ],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 7,
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
    "content": "모든 양수 $x$에서 $(\\ln x)^2-6\\ln x+24-3a\\ge0$이 성립하도록 하는 실수 $a$의 최댓값은?",
    "choices": [
      "$1$",
      "$2$",
      "$3$",
      "$4$",
      "$5$"
    ],
    "answer": "⑤",
    "solution": "$t=\\ln x$로 치환하면 $x>0$일 때 $t$는 모든 실숫값을 갖는다.\n$t^2-6t+24-3a=(t^2-6t+9)+15-3a=(t-3)^2+15-3a$로 완전제곱식을 만든다.\n$(t-3)^2\\ge0$이고 $t=3$일 때 $0$이므로 식의 최솟값은 $15-3a$이다.\n모든 $t$에서 음이 아니려면 $15-3a\\ge0$이어야 한다.\n$3a\\le15$에서 $a\\le5$이므로 $a$의 최댓값은 $5$이다.\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-090",
    "problemTypeKey": "PT_DERIVATIVE_EQUATION_INEQUALITY",
    "templateKey": "TPL_GLOBAL_INEQUALITY_BY_DERIVATIVE",
    "crossConceptKeys": [
      "CC_LOGARITHMIC_FUNCTION_GRAPH",
      "CC_QUADRATIC_EXTREMA"
    ],
    "conditionKeys": [
      "COND_POSITIVE"
    ],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 8,
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
    "content": "모든 양수 $x$에서 $\\frac{\\ln x}{x^2}\\le kx$가 성립하도록 하는 실수 $k$의 최솟값은?",
    "choices": [
      "$\\frac1{3e}$",
      "$\\frac1{2e}$",
      "$\\frac1e$",
      "$\\frac2e$",
      "$\\frac3e$"
    ],
    "answer": "①",
    "solution": "$\\frac{\\ln x}{x^2}\\le kx$의 양변을 $x>0$으로 나누면 $k\\ge\\frac{\\ln x}{x^3}=f(x)$가 모든 $x>0$에서 성립해야 한다.\n몫의 미분법을 쓰면 $f'(x)=\\frac{\\frac1x\\cdot x^3-(\\ln x)\\cdot3x^2}{x^6}=\\frac{x^2-3x^2\\ln x}{x^6}=\\frac{1-3\\ln x}{x^4}$이다.\n$1-3\\ln x=0$인 $x=e^{1/3}$을 기준으로 $0<x<e^{1/3}$에서 $f'(x)>0$, $x>e^{1/3}$에서 $f'(x)<0$이다.\n따라서 최댓값은 $f(e^{1/3})=\\frac{\\ln(e^{1/3})}{(e^{1/3})^3}=\\frac{1/3}{e}=\\frac1{3e}$이다.\n모든 $x>0$에서 $k\\ge f(x)$일 최솟값은 $\\frac1{3e}$이다.\n따라서 정답은 ①이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B45",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-090",
    "problemTypeKey": "PT_DERIVATIVE_EQUATION_INEQUALITY",
    "templateKey": "TPL_GLOBAL_INEQUALITY_BY_DERIVATIVE",
    "crossConceptKeys": [
      "CC_LOGARITHMIC_FUNCTION_GRAPH",
      "CC_DERIVATIVE_SIGN_EXTREMA_ANALYSIS"
    ],
    "conditionKeys": [
      "COND_POSITIVE"
    ],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 9,
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
    "content": "모든 실수 $x$에 대하여 $x+1\\ge ke^{x^2/4}$가 성립하도록 하는 실수 $k$의 최댓값을 구하는 과정이다.\n$F(x)=(x+1)e^{-x^2/4}$라 두면 $F'(x)=(\\text{가})\\,e^{-x^2/4}$이다.\n$F'(x)=0$의 두 해는 $-2$와 $1$이다. 양쪽 무한대에서 $F(x)$의 극한은 모두 $0$이므로, 증감을 조사하면 $F(x)$의 최솟값은 (나)이다. 이 최솟값이 $k$의 최댓값이다.\n(가)에 들어갈 식을 $g(x)$, (나)에 들어갈 값을 $p$라 할 때, $g(4)p$의 값은?",
    "choices": [
      "$\\frac5e$",
      "$\\frac6e$",
      "$\\frac7e$",
      "$\\frac8e$",
      "$\\frac9e$"
    ],
    "answer": "⑤",
    "solution": "$e^{x^2/4}>0$이므로 주어진 부등식은 $k\\le(x+1)e^{-x^2/4}=F(x)$로 정리된다.\n곱의 미분법과 합성함수의 미분법을 쓰면 $F'(x)=1\\cdot e^{-x^2/4}+(x+1)\\cdot\\left(-\\frac x2\\right)e^{-x^2/4}$이다.\n$e^{-x^2/4}$로 묶으면 $g(x)=1-\\frac{x(x+1)}2=\\frac{2-x^2-x}{2}=-\\frac{(x+2)(x-1)}2$이다.\n$e^{-x^2/4}>0$이므로 $F'$의 부호는 $g$의 부호와 같고, $g$는 위로 볼록한 이차식이다.\n따라서 $F'<0$ on $(-\\infty,-2)$, $F'>0$ on $(-2,1)$, $F'<0$ on $(1,\\infty)$이다.\n즉 $F$는 $(-\\infty,-2)$에서 감소, $(-2,1)$에서 증가, $(1,\\infty)$에서 감소한다.\n지수함수의 극한 성질로 $x\\to-\\infty$, $x\\to\\infty$일 때 모두 $F(x)\\to0$이다.\n감소하다 증가하는 $x=-2$에서 극소이고 $F(-2)=(-2+1)e^{-1}=-\\frac1e$이다.\n$x>1$에서는 $x+1>0$, $e^{-x^2/4}>0$이므로 $F(x)>0>-\\frac1e$이다.\n따라서 최솟값은 $p=-\\frac1e$이고 $k$의 최댓값도 $-\\frac1e$이다.\n$g(4)=1-\\frac{4\\cdot5}{2}=1-10=-9$이므로 $g(4)p=(-9)\\left(-\\frac1e\\right)=\\frac9e$이다.\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B45",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-090",
    "problemTypeKey": "PT_DERIVATIVE_EQUATION_INEQUALITY",
    "templateKey": "TPL_GLOBAL_INEQUALITY_BY_DERIVATIVE",
    "crossConceptKeys": [
      "CC_DERIVATIVE_SIGN_EXTREMA_ANALYSIS",
      "CC_FUNCTION_LIMIT",
      "CC_EXPONENTIAL_FUNCTION_GRAPH"
    ],
    "conditionKeys": [
      "COND_UNIVERSAL_INPUTS"
    ],
    "integrationPattern": "SEQUENTIAL"
  }
];
