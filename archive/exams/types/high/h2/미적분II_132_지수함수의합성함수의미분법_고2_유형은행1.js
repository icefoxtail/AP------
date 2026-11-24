window.examTitle = "미적분II_132_지수함수의합성함수의미분법_고2_유형은행1";

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
    "content": "$f(x)=e^{3x}$이고 $g=f\\circ f$일 때 $g'(0)$의 값은?",
    "choices": [
      "$3e^3$",
      "$5e^3$",
      "$7e^3$",
      "$9e^3$",
      "$11e^3$"
    ],
    "answer": "④",
    "solution": "합성함수 $g=f\\circ f$이므로 $g(x)=f(f(x))$이다.\n합성함수의 미분법에 의해 $g'(x)=f'(f(x))f'(x)$이다.\n$f(x)=e^{3x}$에서 $f'(x)=3e^{3x}$이다.\n$f(0)=e^0=1$, $f'(0)=3e^0=3$이다.\n$f'(1)=3e^3$이므로 $g'(0)=f'(1)f'(0)=3e^3\\cdot3=9e^3$이다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B12",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-069",
    "problemTypeKey": "PT_DERIVATIVE_RULE_EVALUATION",
    "templateKey": "TPL_DERIVATIVE_RULE_CALCULATION",
    "crossConceptKeys": [
      "CC_FUNCTION_COMPOSITION"
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
    "content": "$f(x)=e^{2\\sin x}$에 대하여 $f'(\\pi)$의 값은?",
    "choices": [
      "$-3$",
      "$-2$",
      "$-1$",
      "$0$",
      "$1$"
    ],
    "answer": "②",
    "solution": "$f(x)=e^{2\\sin x}$는 합성함수이므로 합성함수의 미분법을 쓴다.\n지수함수와 사인함수의 미분에 의해 $f'(x)=e^{2\\sin x}\\cdot(2\\sin x)'=2\\cos x\\,e^{2\\sin x}$이다.\n$\\sin\\pi=0$, $\\cos\\pi=-1$을 대입하면 $f'(\\pi)=2(-1)e^{0}$이다.\n$e^0=1$이므로 $f'(\\pi)=-2$이다.\n따라서 정답은 ②이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B12",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-069",
    "problemTypeKey": "PT_DERIVATIVE_RULE_EVALUATION",
    "templateKey": "TPL_DERIVATIVE_RULE_CALCULATION",
    "crossConceptKeys": [
      "CC_DERIVATIVE_VALUE_EVALUATION"
    ],
    "conditionKeys": [],
    "integrationPattern": "NONE"
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
    "content": "곡선 $y=3^{2x-5}+2$ 위의 점 $(3,5)$에서의 접선 기울기는?",
    "choices": [
      "$\\ln3$",
      "$2\\ln3$",
      "$4\\ln3$",
      "$6\\ln3$",
      "$8\\ln3$"
    ],
    "answer": "④",
    "solution": "$y=3^{2x-5}+2$에서 지수함수의 미분법과 합성함수의 미분법을 쓴다.\n$(3^{2x-5})'=(\\ln3)3^{2x-5}\\cdot(2x-5)'=2(\\ln3)3^{2x-5}$이다.\n상수 $2$의 미분은 $0$이므로 $y'=2(\\ln3)3^{2x-5}$이다.\n$x=3$을 대입하면 $2(\\ln3)3^{2\\cdot3-5}=2(\\ln3)3^{1}$이다.\n$3^1=3$이므로 접선의 기울기는 $6\\ln3$이다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-069",
    "problemTypeKey": "PT_DERIVATIVE_RULE_EVALUATION",
    "templateKey": "TPL_DERIVATIVE_RULE_CALCULATION",
    "crossConceptKeys": [
      "CC_TANGENT_LINE_SLOPE_AT_POINT"
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
    "content": "$f(x)=12\\sqrt{3^x}$에 대해 $f'(a)=18\\ln3$일 때 실수 $a$는?",
    "choices": [
      "$2$",
      "$4$",
      "$6$",
      "$8$",
      "$10$"
    ],
    "answer": "①",
    "solution": "$f(x)=12\\sqrt{3^x}=12(3^x)^{1/2}=12\\,3^{x/2}$로 고쳐 쓴다.\n지수함수의 미분법과 합성함수의 미분법에 의해 $f'(x)=12(\\ln3)3^{x/2}\\cdot\\frac12$이다.\n따라서 $f'(x)=6(\\ln3)3^{x/2}$이다.\n$f'(a)=18\\ln3$이므로 $6(\\ln3)3^{a/2}=18\\ln3$이다.\n양변을 $6\\ln3$으로 나누면 $3^{a/2}=3$이다.\n밑이 $3$으로 같으므로 $\\frac a2=1$, 즉 $a=2$이다.\n따라서 정답은 ①이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-069",
    "problemTypeKey": "PT_DERIVATIVE_RULE_EVALUATION",
    "templateKey": "TPL_DERIVATIVE_RULE_CALCULATION",
    "crossConceptKeys": [
      "CC_DERIVATIVE_VALUE_EVALUATION"
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
    "content": "$f(x)=e^{-3x}\\sin(2x)$에 대하여 $f'(0)$의 값은?",
    "choices": [
      "$0$",
      "$1$",
      "$2$",
      "$3$",
      "$4$"
    ],
    "answer": "③",
    "solution": "$f(x)=e^{-3x}\\sin(2x)$에 곱의 미분법을 적용한다.\n$f'(x)=(e^{-3x})'\\sin(2x)+e^{-3x}(\\sin(2x))'$이다.\n$(e^{-3x})'=-3e^{-3x}$, $(\\sin2x)'=2\\cos2x$이므로 $f'(x)=-3e^{-3x}\\sin2x+2e^{-3x}\\cos2x$이다.\n$x=0$을 대입하면 $\\sin0=0$, $\\cos0=1$, $e^0=1$이다.\n따라서 $f'(0)=-3\\cdot1\\cdot0+2\\cdot1\\cdot1=2$이다.\n따라서 정답은 ③이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-069",
    "problemTypeKey": "PT_DERIVATIVE_RULE_EVALUATION",
    "templateKey": "TPL_DERIVATIVE_RULE_CALCULATION",
    "crossConceptKeys": [
      "CC_DERIVATIVE_VALUE_EVALUATION"
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
    "content": "$f(x)=(e^{3x}-e^{-3x})/(e^{3x}+e^{-3x})$일 때 $\\lim_{x\\to0}f(x)/x$의 값은?",
    "choices": [
      "$-1$",
      "$0$",
      "$1$",
      "$2$",
      "$3$"
    ],
    "answer": "⑤",
    "solution": "$f(x)=\\frac{e^{3x}-e^{-3x}}{e^{3x}+e^{-3x}}$에서 $f(0)=\\frac{1-1}{1+1}=0$이다.\n$\\lim_{x\\to0}\\frac{f(x)}x=\\lim_{x\\to0}\\frac{f(x)-f(0)}{x-0}=f'(0)$이다(미분계수의 정의).\n몫의 미분법을 쓰면 $f'(x)=\\frac{(3e^{3x}+3e^{-3x})(e^{3x}+e^{-3x})-(e^{3x}-e^{-3x})(3e^{3x}-3e^{-3x})}{(e^{3x}+e^{-3x})^2}$이다.\n$x=0$에서 분자의 첫 인수는 $3+3=6$, 둘째 인수는 $1+1=2$이다.\n$x=0$에서 뒤쪽 곱은 $(1-1)(3-3)=0$이다.\n분모는 $(1+1)^2=4$이다.\n따라서 $f'(0)=\\frac{6\\cdot2-0}{4}=\\frac{12}{4}=3$이다.\n그러므로 주어진 극한값은 $3$이다.\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-069",
    "problemTypeKey": "PT_DERIVATIVE_RULE_EVALUATION",
    "templateKey": "TPL_DERIVATIVE_RULE_CALCULATION",
    "crossConceptKeys": [
      "CC_DERIVATIVE_DEFINITION_LIMIT"
    ],
    "conditionKeys": [],
    "integrationPattern": "REINTERPRETATION"
  }
];
