window.examTitle = "미적분II_089_미분계수를이용한극한값계산2_고2_유형은행1";

window.questionBank = [
  {
    "id": 1,
    "category": "지수함수와 로그함수의 미분",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-03",
    "standardUnit": "지수함수와 로그함수의 미분",
    "standardUnitOrder": 3,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "지수함수와 로그함수의 미분"
    ],
    "wide": false,
    "content": "함수 $f(x)=\\ln x$에 대하여 $\\lim_{x\\to3}\\frac{f(x)-f(3)}{x^2-4x+3}$의 값은?",
    "choices": [
      "$\\tfrac19$",
      "$\\tfrac16$",
      "$\\tfrac13$",
      "$\\tfrac12$",
      "$\\tfrac23$"
    ],
    "answer": "②",
    "solution": "분모를 인수분해하면 $x^2-4x+3=(x-3)(x-1)$이다.\n주어진 식을 분리하면 $\\frac{f(x)-f(3)}{x^2-4x+3}=\\frac{f(x)-f(3)}{x-3}\\cdot\\frac{1}{x-1}$이다.\n$f(x)=\\ln x$이므로 $f'(x)=\\frac1x$이고, 미분계수의 정의에서 $\\lim_{x\\to3}\\frac{f(x)-f(3)}{x-3}=f'(3)=\\frac13$이다.\n$\\lim_{x\\to3}\\frac{1}{x-1}=\\frac12$이다.\n따라서 극한은 $\\frac13\\cdot\\frac12=\\frac16$이다.\n따라서 정답은 ②이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-068",
    "problemTypeKey": "PT_DERIVATIVE_RULE_EVALUATION",
    "templateKey": "TPL_DERIVATIVE_RULE_CALCULATION",
    "crossConceptKeys": [
      "CC_DERIVATIVE_VALUE_EVALUATION"
    ],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 2,
    "category": "지수함수와 로그함수의 미분",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-03",
    "standardUnit": "지수함수와 로그함수의 미분",
    "standardUnitOrder": 3,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "지수함수와 로그함수의 미분"
    ],
    "wide": false,
    "content": "함수 $f(x)=2x\\ln x$에 대하여 $\\lim_{x\\to1}\\frac{f(x^3)-f(1)}{x-1}$의 값은?",
    "choices": [
      "$2$",
      "$3$",
      "$4$",
      "$5$",
      "$6$"
    ],
    "answer": "⑤",
    "solution": "$f(1)=2\\cdot1\\cdot\\ln1=0$이다.\n$f(x^3)=2x^3\\ln(x^3)=2x^3\\cdot3\\ln x=6x^3\\ln x$이다.\n$h(x)=f(x^3)$라 하면 주어진 극한은 $\\lim_{x\\to1}\\frac{h(x)-h(1)}{x-1}=h'(1)$이다.\n합성함수의 미분법으로 $h'(x)=f'(x^3)\\cdot3x^2$이다.\n$f'(x)=2\\ln x+2$이므로 $f'(1)=2$이다.\n따라서 $h'(1)=f'(1)\\cdot3=2\\cdot3=6$이다.\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-068",
    "problemTypeKey": "PT_DERIVATIVE_RULE_EVALUATION",
    "templateKey": "TPL_DERIVATIVE_RULE_CALCULATION",
    "crossConceptKeys": [
      "CC_DERIVATIVE_VALUE_EVALUATION",
      "CC_FUNCTION_COMPOSITION"
    ],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 3,
    "category": "지수함수와 로그함수의 미분",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-03",
    "standardUnit": "지수함수와 로그함수의 미분",
    "standardUnitOrder": 3,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "지수함수와 로그함수의 미분"
    ],
    "wide": false,
    "content": "미분가능한 함수 $f$에서 $f'(1)=3$일 때, $\\lim_{x\\to0}\\frac{f(5^{2x})-f(1)}x$의 값은?",
    "choices": [
      "$6\\ln5$",
      "$7\\ln5$",
      "$8\\ln5$",
      "$9\\ln5$",
      "$10\\ln5$"
    ],
    "answer": "①",
    "solution": "$g(x)=f(5^{2x})$라 하면 $g(0)=f(1)$이므로 주어진 극한은 $g'(0)$이다.\n합성함수의 미분법으로 $g'(x)=f'(5^{2x})\\cdot(5^{2x})'$이다.\n$(5^{2x})'=(e^{2x\\ln5})'=2\\ln5\\cdot5^{2x}$이다.\n따라서 $g'(0)=f'(1)\\cdot2\\ln5$이다.\n$f'(1)=3$을 대입하면 $g'(0)=3\\cdot2\\ln5=6\\ln5$이다.\n따라서 정답은 ①이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-068",
    "problemTypeKey": "PT_DERIVATIVE_RULE_EVALUATION",
    "templateKey": "TPL_DERIVATIVE_RULE_CALCULATION",
    "crossConceptKeys": [
      "CC_DERIVATIVE_VALUE_EVALUATION",
      "CC_FUNCTION_COMPOSITION"
    ],
    "conditionKeys": [
      "COND_FUNCTION_TYPE_RESTRICTION"
    ],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 4,
    "category": "지수함수와 로그함수의 미분",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-03",
    "standardUnit": "지수함수와 로그함수의 미분",
    "standardUnitOrder": 3,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "지수함수와 로그함수의 미분"
    ],
    "wide": false,
    "content": "함수 $f(x)=x\\ln(4x)$에 대하여 $\\lim_{x\\to1}\\frac{f(x^4)-x^4\\ln4}{x-1}$의 값은?",
    "choices": [
      "$3$",
      "$4$",
      "$5$",
      "$6$",
      "$7$"
    ],
    "answer": "②",
    "solution": "$f(x^4)=x^4\\ln(4x^4)=x^4(\\ln4+\\ln x^4)$이다.\n$\\ln x^4=4\\ln x$이므로 $f(x^4)=x^4\\ln4+4x^4\\ln x$이다.\n분자에서 $x^4\\ln4$를 빼면 $f(x^4)-x^4\\ln4=4x^4\\ln x$이다.\n따라서 주어진 극한은 $\\lim_{x\\to1}\\frac{4x^4\\ln x}{x-1}$이다.\n$\\lim_{x\\to1}x^4=1$이고 $\\lim_{x\\to1}\\frac{\\ln x}{x-1}=(\\ln x)'_{x=1}=1$이다.\n그러므로 극한은 $4\\cdot1\\cdot1=4$이다.\n따라서 정답은 ②이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-068",
    "problemTypeKey": "PT_DERIVATIVE_RULE_EVALUATION",
    "templateKey": "TPL_DERIVATIVE_RULE_CALCULATION",
    "crossConceptKeys": [
      "CC_DERIVATIVE_VALUE_EVALUATION",
      "CC_POLYNOMIAL_DERIVATIVE_RULE"
    ],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 5,
    "category": "지수함수와 로그함수의 미분",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-03",
    "standardUnit": "지수함수와 로그함수의 미분",
    "standardUnitOrder": 3,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "지수함수와 로그함수의 미분"
    ],
    "wide": false,
    "content": "미분가능한 함수 $f$에 대하여 $\\lim_{x\\to2}\\frac{e^{2x}f(x)-7}{x-2}=6e^4$일 때, $2f(2)+f'(2)$의 값은?",
    "choices": [
      "$2$",
      "$3$",
      "$4$",
      "$5$",
      "$6$"
    ],
    "answer": "⑤",
    "solution": "$g(x)=e^{2x}f(x)$라 하면 주어진 극한은 $\\lim_{x\\to2}\\frac{g(x)-7}{x-2}=6e^4$이다.\n분모가 $0$으로 가고 극한이 유한하므로 $g(2)=7$이다.\n미분계수의 정의에서 주어진 극한은 $g'(2)$이다.\n곱의 미분법과 합성함수의 미분법으로 $g'(x)=2e^{2x}f(x)+e^{2x}f'(x)=e^{2x}(2f(x)+f'(x))$이다.\n$x=2$를 대입하면 $g'(2)=e^4(2f(2)+f'(2))$이다.\n$g'(2)=6e^4$이므로 $e^4(2f(2)+f'(2))=6e^4$이다.\n양변을 $e^4$로 나누면 $2f(2)+f'(2)=6$이다.\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-068",
    "problemTypeKey": "PT_DERIVATIVE_RULE_EVALUATION",
    "templateKey": "TPL_DERIVATIVE_RULE_CALCULATION",
    "crossConceptKeys": [
      "CC_DERIVATIVE_VALUE_EVALUATION",
      "CC_FUNCTION_LIMIT"
    ],
    "conditionKeys": [
      "COND_FUNCTION_TYPE_RESTRICTION"
    ],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 6,
    "category": "지수함수와 로그함수의 미분",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-03",
    "standardUnit": "지수함수와 로그함수의 미분",
    "standardUnitOrder": 3,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "지수함수와 로그함수의 미분"
    ],
    "wide": false,
    "content": "미분가능한 함수 $f$에서 $\\lim_{x\\to2}\\frac{5^xf(x)-10}{x-2}=75$일 때, $f(2)\\ln5+f'(2)$의 값은?",
    "choices": [
      "$1$",
      "$2$",
      "$3$",
      "$4$",
      "$5$"
    ],
    "answer": "③",
    "solution": "$g(x)=5^xf(x)$라 하면 주어진 극한은 $\\lim_{x\\to2}\\frac{g(x)-10}{x-2}=75$이다.\n분모가 $0$으로 가고 극한이 유한하므로 $g(2)=10$이다.\n미분계수의 정의에서 주어진 극한은 $g'(2)$이다.\n곱의 미분법으로 $g'(x)=5^x\\ln5\\cdot f(x)+5^xf'(x)=5^x(f(x)\\ln5+f'(x))$이다.\n$x=2$를 대입하면 $g'(2)=25(f(2)\\ln5+f'(2))$이다.\n$g'(2)=75$이므로 $25(f(2)\\ln5+f'(2))=75$이다.\n양변을 $25$로 나누면 $f(2)\\ln5+f'(2)=3$이다.\n따라서 정답은 ③이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-068",
    "problemTypeKey": "PT_DERIVATIVE_RULE_EVALUATION",
    "templateKey": "TPL_DERIVATIVE_RULE_CALCULATION",
    "crossConceptKeys": [
      "CC_DERIVATIVE_VALUE_EVALUATION",
      "CC_FUNCTION_LIMIT"
    ],
    "conditionKeys": [
      "COND_FUNCTION_TYPE_RESTRICTION"
    ],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 7,
    "category": "지수함수와 로그함수의 미분",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-03",
    "standardUnit": "지수함수와 로그함수의 미분",
    "standardUnitOrder": 3,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "지수함수와 로그함수의 미분"
    ],
    "wide": false,
    "content": "함수 $f(x)=e^x(6\\ln x+a)$에 대하여 $\\lim_{x\\to1}\\frac{f(x)-2e}{x^4-1}=b$를 만족시키는 상수 $a,b$의 합은?",
    "choices": [
      "$2+e$",
      "$2+\\tfrac32e$",
      "$2+\\tfrac74e$",
      "$2+2e$",
      "$2+3e$"
    ],
    "answer": "④",
    "solution": "분모 $x^4-1$이 $x\\to1$일 때 $0$으로 가고 극한이 유한하므로 분자도 $0$으로 가야 한다.\n즉 $f(1)-2e=0$이고, $f(1)=e^1(6\\ln1+a)=ea$이다.\n$ea=2e$에서 $a=2$이다.\n분모를 인수분해하면 $x^4-1=(x-1)(x^3+x^2+x+1)$이다.\n따라서 $b=\\lim_{x\\to1}\\frac{f(x)-f(1)}{x-1}\\cdot\\frac{1}{x^3+x^2+x+1}$이다.\n첫 인수는 $f'(1)$이고 둘째 인수는 $\\frac{1}{1+1+1+1}=\\frac14$이다.\n곱의 미분법으로 $f'(x)=e^x(6\\ln x+a)+e^x\\cdot\\frac6x$이다.\n$x=1$, $a=2$를 대입하면 $f'(1)=e(0+2)+e\\cdot6=2e+6e=8e$이다.\n따라서 $b=8e\\cdot\\frac14=2e$이다.\n$a+b=2+2e$이다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-068",
    "problemTypeKey": "PT_DERIVATIVE_RULE_EVALUATION",
    "templateKey": "TPL_DERIVATIVE_RULE_CALCULATION",
    "crossConceptKeys": [
      "CC_DERIVATIVE_VALUE_EVALUATION",
      "CC_POLYNOMIAL_DERIVATIVE_RULE"
    ],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 8,
    "category": "지수함수와 로그함수의 미분",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-03",
    "standardUnit": "지수함수와 로그함수의 미분",
    "standardUnitOrder": 3,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "지수함수와 로그함수의 미분"
    ],
    "wide": false,
    "content": "함수 $f(x)=x^3\\ln x+ax$에 대하여 $\\lim_{x\\to1}\\frac{f(x)-11}{x^4-1}=b$일 때, $a+b$의 값은?",
    "choices": [
      "$13$",
      "$14$",
      "$15$",
      "$16$",
      "$17$"
    ],
    "answer": "②",
    "solution": "분모 $x^4-1$이 $x\\to1$일 때 $0$으로 가고 극한이 유한하므로 분자도 $0$으로 가야 한다.\n$f(1)-11=0$이고 $f(1)=1^3\\ln1+a\\cdot1=a$이므로 $a=11$이다.\n분모를 인수분해하면 $x^4-1=(x-1)(x^3+x^2+x+1)$이다.\n따라서 $b=\\lim_{x\\to1}\\frac{f(x)-f(1)}{x-1}\\cdot\\frac{1}{x^3+x^2+x+1}=f'(1)\\cdot\\frac14$이다.\n$f(x)=x^3\\ln x+11x$를 곱의 미분법으로 미분하면 $f'(x)=3x^2\\ln x+x^2+11$이다.\n$x=1$을 대입하면 $f'(1)=0+1+11=12$이다.\n따라서 $b=12\\cdot\\frac14=3$이다.\n$a+b=11+3=14$이다.\n따라서 정답은 ②이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-068",
    "problemTypeKey": "PT_DERIVATIVE_RULE_EVALUATION",
    "templateKey": "TPL_DERIVATIVE_RULE_CALCULATION",
    "crossConceptKeys": [
      "CC_DERIVATIVE_VALUE_EVALUATION",
      "CC_POLYNOMIAL_DERIVATIVE_RULE"
    ],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 9,
    "category": "지수함수와 로그함수의 미분",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-03",
    "standardUnit": "지수함수와 로그함수의 미분",
    "standardUnitOrder": 3,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "지수함수와 로그함수의 미분"
    ],
    "wide": false,
    "content": "함수 $f(x)=e^{x-1}(8\\ln x-4a)$에 대하여 $\\lim_{x\\to1}\\frac{2f(x)-2}{2(x^4-1)}=b$를 만족시키는 상수 $a,b$의 합은?",
    "choices": [
      "$\\tfrac32$",
      "$2$",
      "$\\tfrac52$",
      "$3$",
      "$\\tfrac72$"
    ],
    "answer": "②",
    "solution": "주어진 식의 분자와 분모를 $2$로 약분하면 $\\lim_{x\\to1}\\frac{f(x)-1}{x^4-1}=b$이다.\n분모가 $0$으로 가고 극한이 유한하므로 $f(1)=1$이다.\n$f(1)=e^0(8\\ln1-4a)=-4a$이므로 $-4a=1$에서 $a=-\\frac14$이다.\n분모를 인수분해하면 $x^4-1=(x-1)(x^3+x^2+x+1)$이다.\n따라서 $b=\\lim_{x\\to1}\\frac{f(x)-f(1)}{x-1}\\cdot\\frac{1}{x^3+x^2+x+1}=f'(1)\\cdot\\frac14$이다.\n곱의 미분법으로 $f'(x)=e^{x-1}(8\\ln x-4a)+e^{x-1}\\cdot\\frac8x$이다.\n$x=1$, $a=-\\frac14$를 대입하면 $f'(1)=1\\cdot(0+1)+1\\cdot8=9$이다.\n따라서 $b=9\\cdot\\frac14=\\frac94$이다.\n$a+b=-\\frac14+\\frac94=\\frac84=2$이다.\n따라서 정답은 ②이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B45",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-068",
    "problemTypeKey": "PT_DERIVATIVE_RULE_EVALUATION",
    "templateKey": "TPL_DERIVATIVE_RULE_CALCULATION",
    "crossConceptKeys": [
      "CC_DERIVATIVE_VALUE_EVALUATION",
      "CC_POLYNOMIAL_DERIVATIVE_RULE"
    ],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 10,
    "category": "지수함수와 로그함수의 미분",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-03",
    "standardUnit": "지수함수와 로그함수의 미분",
    "standardUnitOrder": 3,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "지수함수와 로그함수의 미분"
    ],
    "wide": false,
    "content": "모든 실수 $x,y$에 대하여 $f(x+y)=f(x)+f(y)+2(e^{x+y}-e^x-e^y+1)$을 만족하는 미분가능한 함수 $f$가 있다. $f'(0)=4$일 때, $f'(\\ln3)$의 값은?",
    "choices": [
      "$4$",
      "$5$",
      "$6$",
      "$7$",
      "$8$"
    ],
    "answer": "⑤",
    "solution": "$y=0$을 대입하면 $f(x)=f(x)+f(0)+2(e^x-e^x-1+1)$이다.\n정리하면 $f(0)=0$이다.\n주어진 관계식에서 $f(x)$를 이항하면 $f(x+y)-f(x)=f(y)+2(e^{x+y}-e^x-e^y+1)$이다.\n우변을 인수분해하면 $f(y)+2(e^x-1)(e^y-1)$이다.\n양변을 $y$로 나누면 $\\frac{f(x+y)-f(x)}y=\\frac{f(y)-f(0)}y+2(e^x-1)\\cdot\\frac{e^y-1}{y}$이다.\n$y\\to0$일 때 $\\frac{f(y)-f(0)}y\\to f'(0)=4$이다.\n또 $\\lim_{y\\to0}\\frac{e^y-1}{y}=1$이다. (지수함수의 극한)\n따라서 $f'(x)=4+2(e^x-1)$이다.\n$x=\\ln3$을 대입하면 $f'(\\ln3)=4+2(3-1)=4+4=8$이다.\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B45",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-068",
    "problemTypeKey": "PT_DERIVATIVE_RULE_EVALUATION",
    "templateKey": "TPL_DERIVATIVE_RULE_CALCULATION",
    "crossConceptKeys": [
      "CC_FUNCTIONAL_EQUATION",
      "CC_CAUCHY_FUNCTIONAL_EQUATION",
      "CC_DERIVATIVE_VALUE_EVALUATION"
    ],
    "conditionKeys": [
      "COND_UNIVERSAL_INPUTS",
      "COND_FUNCTION_TYPE_RESTRICTION"
    ],
    "integrationPattern": "REINTERPRETATION"
  }
];
