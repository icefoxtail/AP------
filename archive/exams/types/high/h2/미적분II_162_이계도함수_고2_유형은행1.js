window.examTitle = "미적분II_162_이계도함수_고2_유형은행1";

window.questionBank = [
  {
    "id": 1,
    "category": "여러 가지 미분법",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-05",
    "standardUnit": "여러 가지 미분법",
    "standardUnitOrder": 5,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "여러 가지 미분법"
    ],
    "wide": false,
    "content": "$f(x)=(x+1)e^{2x}$에 대하여 $f'(0)+f''(0)$의 값은?",
    "choices": [
      "$9$",
      "$10$",
      "$11$",
      "$12$",
      "$13$"
    ],
    "answer": "③",
    "solution": "곱의 미분법으로 $f'(x)=1\\cdot e^{2x}+(x+1)\\cdot 2e^{2x}$이다.\n동류항을 모으면 $f'(x)=(2x+3)e^{2x}$이다.\n$f'(x)$에 곱의 미분법을 다시 적용하면 $f''(x)=2e^{2x}+(2x+3)\\cdot 2e^{2x}$이다.\n정리하면 $f''(x)=(4x+8)e^{2x}$이다.\n$e^0=1$이므로 $f'(0)=3$, $f''(0)=8$이다.\n따라서 $f'(0)+f''(0)=3+8=11$이다.\n따라서 정답은 ③이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-174",
    "problemTypeKey": "PT_DERIVATIVE_RULE_EVALUATION",
    "templateKey": "TPL_DERIVATIVE_SECOND_ORDER",
    "crossConceptKeys": [
      "CC_POLYNOMIAL_DERIVATIVE_RULE",
      "CC_DERIVATIVE_VALUE_EVALUATION"
    ],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 2,
    "category": "여러 가지 미분법",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-05",
    "standardUnit": "여러 가지 미분법",
    "standardUnitOrder": 5,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "여러 가지 미분법"
    ],
    "wide": false,
    "content": "$f(x)=3xe^{ax}$에서 $f''(0)=18$이 되도록 하는 상수 $a$의 값은?",
    "choices": [
      "$2$",
      "$3$",
      "$4$",
      "$5$",
      "$6$"
    ],
    "answer": "②",
    "solution": "곱과 합성함수의 미분법으로 $f'(x)=3e^{ax}+3x\\cdot ae^{ax}$이다.\n$3e^{ax}$로 묶으면 $f'(x)=3(1+ax)e^{ax}$이다.\n곱의 미분법을 다시 적용하면 $f''(x)=3ae^{ax}(1+ax)+3e^{ax}\\cdot a$이다.\n정리하면 $f''(x)=3ae^{ax}(ax+2)$이다.\n$x=0$을 대입하면 $f''(0)=3a\\cdot 1\\cdot 2=6a$이다.\n$6a=18$에서 $a=3$이다.\n따라서 정답은 ②이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-174",
    "problemTypeKey": "PT_DERIVATIVE_RULE_EVALUATION",
    "templateKey": "TPL_DERIVATIVE_SECOND_ORDER",
    "crossConceptKeys": [
      "CC_DERIVATIVE_VALUE_EVALUATION"
    ],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 3,
    "category": "여러 가지 미분법",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-05",
    "standardUnit": "여러 가지 미분법",
    "standardUnitOrder": 5,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "여러 가지 미분법"
    ],
    "wide": false,
    "content": "$f(x)=24x\\ln x-x^3+5x$ ($x>0$)에서 $f''(a)=0$을 만족하는 $a$의 값은?",
    "choices": [
      "$2$",
      "$3$",
      "$4$",
      "$5$",
      "$6$"
    ],
    "answer": "①",
    "solution": "곱의 미분법으로 $(x\\ln x)'=\\ln x+x\\cdot\\frac1x=\\ln x+1$이다.\n따라서 $f'(x)=24(\\ln x+1)-3x^2+5=24\\ln x-3x^2+29$이다.\n다시 미분하면 $f''(x)=\\frac{24}{x}-6x$이다.\n$f''(a)=0$이면 $\\frac{24}{a}-6a=0$이다.\n양변에 $a$를 곱하면 $24-6a^2=0$, 즉 $a^2=4$이다.\n정의역이 $a>0$이므로 $a=2$이다.\n따라서 정답은 ①이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-174",
    "problemTypeKey": "PT_DERIVATIVE_RULE_EVALUATION",
    "templateKey": "TPL_DERIVATIVE_SECOND_ORDER",
    "crossConceptKeys": [
      "CC_DERIVATIVE_ROOT_SOLVING",
      "CC_DERIVATIVE_VALUE_EVALUATION"
    ],
    "conditionKeys": [
      "COND_POSITIVE"
    ],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 4,
    "category": "여러 가지 미분법",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-05",
    "standardUnit": "여러 가지 미분법",
    "standardUnitOrder": 5,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "여러 가지 미분법"
    ],
    "wide": false,
    "content": "$f(x)=\\ln(x^{3\\ln x})$ ($x>0$)에 대하여 $f''(1)$의 값은?",
    "choices": [
      "$6$",
      "$7$",
      "$8$",
      "$9$",
      "$10$"
    ],
    "answer": "①",
    "solution": "로그의 성질 $\\ln A^B=B\\ln A$로 $f(x)=(3\\ln x)\\ln x=3(\\ln x)^2$이다.\n합성함수의 미분법으로 $f'(x)=3\\cdot 2(\\ln x)\\cdot\\frac1x=\\frac{6\\ln x}{x}$이다.\n몫의 미분법으로 $f''(x)=\\frac{6\\cdot\\frac1x\\cdot x-6\\ln x\\cdot 1}{x^2}$이다.\n분자를 정리하면 $f''(x)=\\frac{6(1-\\ln x)}{x^2}$이다.\n$\\ln 1=0$이므로 $f''(1)=\\frac{6(1-0)}{1^2}=6$이다.\n따라서 정답은 ①이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-174",
    "problemTypeKey": "PT_DERIVATIVE_RULE_EVALUATION",
    "templateKey": "TPL_DERIVATIVE_SECOND_ORDER",
    "crossConceptKeys": [
      "CC_DERIVATIVE_VALUE_EVALUATION"
    ],
    "conditionKeys": [
      "COND_POSITIVE"
    ],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 5,
    "category": "여러 가지 미분법",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-05",
    "standardUnit": "여러 가지 미분법",
    "standardUnitOrder": 5,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "여러 가지 미분법"
    ],
    "wide": false,
    "content": "$f(x)=\\frac{x^3+2x+3}{x^2}$ ($x\\ne0$)에 대하여 $f''(-1)$의 값은?",
    "choices": [
      "$8$",
      "$10$",
      "$12$",
      "$14$",
      "$16$"
    ],
    "answer": "④",
    "solution": "분자를 항별로 나누면 $f(x)=x+2x^{-1}+3x^{-2}$이다.\n거듭제곱의 미분법으로 $f'(x)=1-2x^{-2}-6x^{-3}$이다.\n같은 방법으로 다시 미분하면 $f''(x)=4x^{-3}+18x^{-4}$이다.\n$x=-1$을 대입하면 $(-1)^{-3}=-1$, $(-1)^{-4}=1$이다.\n따라서 $f''(-1)=4\\cdot(-1)+18\\cdot 1=-4+18=14$이다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-174",
    "problemTypeKey": "PT_DERIVATIVE_RULE_EVALUATION",
    "templateKey": "TPL_DERIVATIVE_SECOND_ORDER",
    "crossConceptKeys": [
      "CC_RATIONAL_FUNCTION",
      "CC_DERIVATIVE_VALUE_EVALUATION"
    ],
    "conditionKeys": [
      "COND_NONZERO"
    ],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 6,
    "category": "여러 가지 미분법",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-05",
    "standardUnit": "여러 가지 미분법",
    "standardUnitOrder": 5,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "여러 가지 미분법"
    ],
    "wide": false,
    "content": "$f(x)=e^x(2\\sin x+\\cos x)$에서 $f''(\\pi)$의 값은?",
    "choices": [
      "$-4e^\\pi$",
      "$-3e^\\pi$",
      "$-2e^\\pi$",
      "$-e^\\pi$",
      "$0$"
    ],
    "answer": "①",
    "solution": "곱의 미분법으로 $f'(x)=e^x(2\\sin x+\\cos x)+e^x(2\\cos x-\\sin x)$이다.\n동류항을 모으면 $f'(x)=e^x(\\sin x+3\\cos x)$이다.\n곱의 미분법을 다시 적용하면 $f''(x)=e^x(\\sin x+3\\cos x)+e^x(\\cos x-3\\sin x)$이다.\n정리하면 $f''(x)=e^x(4\\cos x-2\\sin x)$이다.\n$\\cos\\pi=-1$, $\\sin\\pi=0$을 대입하면 $f''(\\pi)=e^\\pi(4\\cdot(-1)-2\\cdot 0)$이다.\n따라서 $f''(\\pi)=-4e^\\pi$이다.\n따라서 정답은 ①이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-174",
    "problemTypeKey": "PT_DERIVATIVE_RULE_EVALUATION",
    "templateKey": "TPL_DERIVATIVE_SECOND_ORDER",
    "crossConceptKeys": [
      "CC_DERIVATIVE_VALUE_EVALUATION"
    ],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 7,
    "category": "여러 가지 미분법",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-05",
    "standardUnit": "여러 가지 미분법",
    "standardUnitOrder": 5,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "여러 가지 미분법"
    ],
    "wide": false,
    "content": "$f(x)=\\sin(e^{2x}-1)$에 대하여 $f'(0)+f''(0)$의 값은?",
    "choices": [
      "$5$",
      "$6$",
      "$7$",
      "$8$",
      "$9$"
    ],
    "answer": "②",
    "solution": "$u=e^{2x}-1$이라 놓으면 $u'=2e^{2x}$이다.\n합성함수의 미분법으로 $f'(x)=(\\cos u)\\cdot u'=2e^{2x}\\cos u$이다.\n곱과 합성함수의 미분법으로 $f''(x)=4e^{2x}\\cos u+2e^{2x}\\cdot(-\\sin u)\\cdot u'$이다.\n$u'=2e^{2x}$를 대입하면 $f''(x)=4e^{2x}\\cos u-4e^{4x}\\sin u$이다.\n$x=0$이면 $u=e^0-1=0$이다.\n$f'(0)=2\\cdot 1\\cdot\\cos 0=2$이다.\n$f''(0)=4\\cdot 1\\cdot\\cos 0-4\\cdot 1\\cdot\\sin 0=4$이다.\n따라서 $f'(0)+f''(0)=2+4=6$이다.\n따라서 정답은 ②이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-174",
    "problemTypeKey": "PT_DERIVATIVE_RULE_EVALUATION",
    "templateKey": "TPL_DERIVATIVE_SECOND_ORDER",
    "crossConceptKeys": [
      "CC_DERIVATIVE_VALUE_EVALUATION"
    ],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 8,
    "category": "여러 가지 미분법",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-05",
    "standardUnit": "여러 가지 미분법",
    "standardUnitOrder": 5,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "여러 가지 미분법"
    ],
    "wide": false,
    "content": "$f(x)=(2x^2+a)e^x$가 모든 실수 $x$에서 $f''(x)\\ge0$을 만족하도록 하는 실수 $a$의 최솟값은?",
    "choices": [
      "$2$",
      "$3$",
      "$4$",
      "$5$",
      "$6$"
    ],
    "answer": "③",
    "solution": "곱의 미분법으로 $f'(x)=4xe^x+(2x^2+a)e^x=e^x(2x^2+4x+a)$이다.\n곱의 미분법을 다시 적용하면 $f''(x)=e^x(2x^2+4x+a)+e^x(4x+4)$이다.\n정리하면 $f''(x)=e^x(2x^2+8x+a+4)$이다.\n모든 실수 $x$에서 $e^x>0$이므로 $2x^2+8x+a+4\\ge0$이면 된다.\n완전제곱식으로 $2x^2+8x+a+4=2(x+2)^2+a-4$이다.\n$(x+2)^2\\ge0$이므로 $x=-2$에서 최솟값 $a-4$를 가진다.\n$f''(x)\\ge0$이려면 $a-4\\ge0$, 즉 $a\\ge4$이다.\n$a=4$일 때 실제로 $f''(x)=2e^x(x+2)^2\\ge0$이 성립한다.\n따라서 $a$의 최솟값은 $4$이다.\n따라서 정답은 ③이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-174",
    "problemTypeKey": "PT_DERIVATIVE_RULE_EVALUATION",
    "templateKey": "TPL_DERIVATIVE_SECOND_ORDER",
    "crossConceptKeys": [
      "CC_ALWAYS_POSITIVE_QUADRATIC_DERIVATIVE",
      "CC_MINIMUM_VALUE_GREATER_THAN_ZERO"
    ],
    "conditionKeys": [
      "COND_UNIVERSAL_INPUTS"
    ],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 9,
    "category": "여러 가지 미분법",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-05",
    "standardUnit": "여러 가지 미분법",
    "standardUnitOrder": 5,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "여러 가지 미분법"
    ],
    "wide": false,
    "content": "$x\\ne0$에서 $f(x)=\\sum_{k=1}^{8}x^{-k}$일 때 $f''(1)$의 값은?",
    "choices": [
      "$160$",
      "$180$",
      "$200$",
      "$220$",
      "$240$"
    ],
    "answer": "⑤",
    "solution": "거듭제곱의 미분법으로 $f'(x)=\\sum_{k=1}^{8}(-k)x^{-k-1}=-\\sum_{k=1}^{8}kx^{-k-1}$이다.\n한 번 더 미분하면 $f''(x)=\\sum_{k=1}^{8}k(k+1)x^{-k-2}$이다.\n$x=1$을 대입하면 $f''(1)=\\sum_{k=1}^{8}k(k+1)$이다.\n전개하면 $f''(1)=\\sum_{k=1}^{8}k^2+\\sum_{k=1}^{8}k$이다.\n제곱의 합 공식 $\\sum k^2=\\frac{n(n+1)(2n+1)}{6}$에 $n=8$을 넣으면 $\\frac{8\\cdot 9\\cdot 17}{6}=204$이다.\n등차수열의 합 공식으로 $\\sum_{k=1}^{8}k=\\frac{8\\cdot 9}{2}=36$이다.\n따라서 $f''(1)=204+36=240$이다.\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-174",
    "problemTypeKey": "PT_DERIVATIVE_RULE_EVALUATION",
    "templateKey": "TPL_DERIVATIVE_SECOND_ORDER",
    "crossConceptKeys": [
      "CC_POLYNOMIAL_DERIVATIVE_RULE",
      "CC_DERIVATIVE_VALUE_EVALUATION"
    ],
    "conditionKeys": [
      "COND_NONZERO"
    ],
    "integrationPattern": "SEQUENTIAL"
  }
];
