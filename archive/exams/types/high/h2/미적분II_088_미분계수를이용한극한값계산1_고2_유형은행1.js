window.examTitle = "미적분II_088_미분계수를이용한극한값계산1_고2_유형은행1";

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
    "content": "함수 $f(x)=e^{2x}$에 대하여 $\\lim_{h\\to0}\\frac{f(a+2h)-f(a-h)}h=24$일 때, 상수 $a$의 값은?",
    "choices": [
      "$\\tfrac12\\ln2$",
      "$\\ln2$",
      "$\\tfrac32\\ln2$",
      "$2\\ln2$",
      "$\\tfrac52\\ln2$"
    ],
    "answer": "②",
    "solution": "미분계수의 정의를 쓰기 위해 분자에 $f(a)$를 빼고 더한다.\n$$\\lim_{h\\to0}\\frac{f(a+2h)-f(a-h)}h=\\lim_{h\\to0}\\frac{\\{f(a+2h)-f(a)\\}-\\{f(a-h)-f(a)\\}}h$$\n첫 차분은 $2h$, 둘째 차분은 $-h$로 나누어 미분계수로 바꾼다.\n$$=2f'(a)-(-1)f'(a)=3f'(a)$$\n$f(x)=e^{2x}$의 도함수는 $f'(x)=2e^{2x}$이다.\n따라서 $3\\cdot2e^{2a}=24$, 즉 $e^{2a}=4$이다.\n$2a=\\ln4=2\\ln2$이므로 $a=\\ln2$이다.\n따라서 정답은 ②이다.",
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
    "content": "함수 $f(x)=3x\\ln x$에 대하여 $\\lim_{h\\to0}\\frac{f(e^2+h)-f(e^2-3h)}h$의 값은?",
    "choices": [
      "$9$",
      "$18$",
      "$27$",
      "$36$",
      "$45$"
    ],
    "answer": "④",
    "solution": "분자에 $f(e^2)$를 빼고 더해 두 차분으로 나눈다.\n$$\\lim_{h\\to0}\\frac{f(e^2+h)-f(e^2-3h)}h=\\lim_{h\\to0}\\frac{\\{f(e^2+h)-f(e^2)\\}-\\{f(e^2-3h)-f(e^2)\\}}h$$\n첫 차분의 계수는 $1$, 둘째 차분의 계수는 $-3$이므로 미분계수로 바꾸면 $1f'(e^2)-(-3)f'(e^2)=4f'(e^2)$이다.\n$f'(x)=3(\\ln x+1)$이다.\n$f'(e^2)=3(2+1)=9$이다.\n따라서 극한값은 $4\\cdot9=36$이다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 3,
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
    "content": "함수 $f(x)=2x\\ln x+x^4$에 대하여 $\\lim_{h\\to0}\\frac{f(1+2h)-f(1-2h)}h$의 값은?",
    "choices": [
      "$6$",
      "$12$",
      "$16$",
      "$20$",
      "$24$"
    ],
    "answer": "⑤",
    "solution": "분자에 $f(1)$을 빼고 더해 두 차분을 만든다.\n$$\\lim_{h\\to0}\\frac{f(1+2h)-f(1-2h)}h=\\lim_{h\\to0}\\frac{\\{f(1+2h)-f(1)\\}-\\{f(1-2h)-f(1)\\}}h$$\n$2h$와 $-2h$ 차분의 계수 $2$, $-2$를 이용하면 극한은 $2f'(1)-(-2)f'(1)=4f'(1)$이다.\n$f'(x)=2\\ln x+2+4x^3$이다.\n$f'(1)=0+2+4=6$이다.\n따라서 $4f'(1)=24$이다.\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
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
    "content": "함수 $f(x)=x^3\\ln x$에 대하여 $\\lim_{h\\to0}\\frac{f(e+3h)-f(e-h)}h$의 값은?",
    "choices": [
      "$12e^2$",
      "$16e^2$",
      "$18e^2$",
      "$20e^2$",
      "$24e^2$"
    ],
    "answer": "②",
    "solution": "분자에 $f(e)$를 빼고 더한다.\n$$\\lim_{h\\to0}\\frac{f(e+3h)-f(e-h)}h=\\lim_{h\\to0}\\frac{\\{f(e+3h)-f(e)\\}-\\{f(e-h)-f(e)\\}}h$$\n$3h$와 $-h$ 차분의 계수로부터 극한은 $3f'(e)-(-1)f'(e)=4f'(e)$이다.\n$f'(x)=3x^2\\ln x+x^2=x^2(3\\ln x+1)$이다.\n$f'(e)=e^2(3\\cdot1+1)=4e^2$이다.\n따라서 $4f'(e)=16e^2$이다.\n따라서 정답은 ②이다.",
    "difficultyBucket": 3,
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
    "content": "함수 $f(x)=x^2\\ln x+3x$에 대하여 $\\lim_{h\\to0}\\frac{f(e^2+h)-f(e^2-h)}h$의 값은?",
    "choices": [
      "$5e^2+6$",
      "$8e^2+6$",
      "$10e^2+6$",
      "$12e^2+6$",
      "$15e^2+6$"
    ],
    "answer": "③",
    "solution": "분자에 $f(e^2)$를 빼고 더한다.\n$$\\lim_{h\\to0}\\frac{f(e^2+h)-f(e^2-h)}h=\\lim_{h\\to0}\\frac{\\{f(e^2+h)-f(e^2)\\}-\\{f(e^2-h)-f(e^2)\\}}h$$\n$h$와 $-h$ 차분의 계수로부터 극한은 $f'(e^2)-(-1)f'(e^2)=2f'(e^2)$이다.\n$f'(x)=2x\\ln x+x+3=x(2\\ln x+1)+3$이다.\n$f'(e^2)=e^2(2\\cdot2+1)+3=5e^2+3$이다.\n따라서 극한값은 $2(5e^2+3)=10e^2+6$이다.\n따라서 정답은 ③이다.",
    "difficultyBucket": 3,
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
    "content": "함수 $f(x)=e^{x-2}+\\log_3(5x)$에 대하여 $\\lim_{h\\to0}\\frac{f(2+h)-f(2-h)}h$의 값은?",
    "choices": [
      "$2+\\frac1{3\\ln3}$",
      "$2+\\frac1{2\\ln3}$",
      "$2+\\frac1{\\ln3}$",
      "$2+\\frac2{\\ln3}$",
      "$2+\\frac3{\\ln3}$"
    ],
    "answer": "③",
    "solution": "분자에 $f(2)$를 빼고 더한다.\n$$\\lim_{h\\to0}\\frac{f(2+h)-f(2-h)}h=\\lim_{h\\to0}\\frac{\\{f(2+h)-f(2)\\}-\\{f(2-h)-f(2)\\}}h$$\n$h$와 $-h$ 차분에서 극한은 $f'(2)-(-1)f'(2)=2f'(2)$이다.\n$e^{x-2}$의 도함수는 $e^{x-2}$이고, $\\log_3(5x)$의 도함수는 $\\frac{1}{x\\ln3}$이다.\n따라서 $f'(x)=e^{x-2}+\\frac1{x\\ln3}$이다.\n$f'(2)=1+\\frac1{2\\ln3}$이다.\n그러므로 극한값은 $2f'(2)=2+\\frac1{\\ln3}$이다.\n따라서 정답은 ③이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
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
    "content": "함수 $f(x)=x\\ln x$에 대하여 $\\lim_{n\\to\\infty}n\\{f(e^2+\\frac2n)-f(e^2-\\frac3n)\\}$의 값은?",
    "choices": [
      "$15$",
      "$18$",
      "$21$",
      "$24$",
      "$27$"
    ],
    "answer": "①",
    "solution": "$h=\\frac1n$으로 놓으면 $n\\to\\infty$일 때 $h\\to0+$이고 $n=\\frac1h$이다.\n주어진 식은 $\\lim_{h\\to0+}\\frac{f(e^2+2h)-f(e^2-3h)}h$이다.\n분자에 $f(e^2)$를 빼고 더한다.\n$$=\\lim_{h\\to0+}\\frac{\\{f(e^2+2h)-f(e^2)\\}-\\{f(e^2-3h)-f(e^2)\\}}h$$\n$2h$와 $-3h$ 차분의 계수로부터 $2f'(e^2)-(-3)f'(e^2)=5f'(e^2)$이다.\n$f'(x)=\\ln x+1$이므로 $f'(e^2)=2+1=3$이다.\n따라서 극한값은 $5\\cdot3=15$이다.\n따라서 정답은 ①이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-068",
    "problemTypeKey": "PT_DERIVATIVE_RULE_EVALUATION",
    "templateKey": "TPL_DERIVATIVE_RULE_CALCULATION",
    "crossConceptKeys": [
      "CC_DERIVATIVE_VALUE_EVALUATION"
    ],
    "conditionKeys": [
      "COND_NATURAL_NUMBER"
    ],
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
    "content": "함수 $f(x)=3^x\\log_9 x$에 대하여 $\\lim_{n\\to\\infty}n\\{f(1+\\frac2n)-f(1-\\frac2n)\\}$의 값은?",
    "choices": [
      "$\\frac3{\\ln3}$",
      "$\\frac6{\\ln3}$",
      "$\\frac9{\\ln3}$",
      "$\\frac{12}{\\ln3}$",
      "$\\frac{15}{\\ln3}$"
    ],
    "answer": "②",
    "solution": "$h=\\frac1n$으로 놓으면 $h\\to0+$이고 주어진 식은 $\\lim_{h\\to0+}\\frac{f(1+2h)-f(1-2h)}h$이다.\n분자에 $f(1)$을 빼고 더한다.\n$$=\\lim_{h\\to0+}\\frac{\\{f(1+2h)-f(1)\\}-\\{f(1-2h)-f(1)\\}}h$$\n$2h$와 $-2h$ 차분의 계수로부터 극한은 $2f'(1)-(-2)f'(1)=4f'(1)$이다.\n곱의 미분법으로 $f'(x)=3^x\\ln3\\log_9x+3^x\\cdot\\frac1{x\\ln9}$이다.\n$\\log_9 1=0$이고 $\\ln9=2\\ln3$이므로 $f'(1)=\\frac3{2\\ln3}$이다.\n따라서 $4f'(1)=\\frac6{\\ln3}$이다.\n따라서 정답은 ②이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-068",
    "problemTypeKey": "PT_DERIVATIVE_RULE_EVALUATION",
    "templateKey": "TPL_DERIVATIVE_RULE_CALCULATION",
    "crossConceptKeys": [
      "CC_DERIVATIVE_VALUE_EVALUATION"
    ],
    "conditionKeys": [
      "COND_NATURAL_NUMBER"
    ],
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
    "content": "함수 $f(x)=xe^{2x}\\ln x$에 대하여 $\\lim_{h\\to0}\\frac{f(e+3h)-f(e-h)}{4h}$의 값은?",
    "choices": [
      "$(2e+1)e^{2e}$",
      "$(2e+2)e^{2e}$",
      "$(2e+3)e^{2e}$",
      "$(2e+4)e^{2e}$",
      "$(2e+5)e^{2e}$"
    ],
    "answer": "②",
    "solution": "분자에 $f(e)$를 빼고 더하고, 분모 $4h$를 따로 처리한다.\n$$\\lim_{h\\to0}\\frac{f(e+3h)-f(e-h)}{4h}=\\frac14\\lim_{h\\to0}\\frac{\\{f(e+3h)-f(e)\\}-\\{f(e-h)-f(e)\\}}h$$\n$3h$와 $-h$ 차분의 계수로부터 극한은 $\\frac14\\{3f'(e)-(-1)f'(e)\\}=f'(e)$이다.\n$u=xe^{2x}$라 하면 곱의 미분법에서 $u'=e^{2x}+2xe^{2x}=e^{2x}(1+2x)$이다.\n$f=u\\ln x$이므로 $f'(x)=u'\\ln x+u\\cdot\\frac1x$이다.\n즉 $f'(x)=e^{2x}(1+2x)\\ln x+e^{2x}=e^{2x}\\{(1+2x)\\ln x+1\\}$이다.\n$\\ln e=1$이므로 $f'(e)=e^{2e}\\{(1+2e)+1\\}=(2e+2)e^{2e}$이다.\n따라서 정답은 ②이다.",
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
  }
];
