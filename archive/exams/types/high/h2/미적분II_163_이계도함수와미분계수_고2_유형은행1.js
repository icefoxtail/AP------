window.examTitle = "미적분II_163_이계도함수와미분계수_고2_유형은행1";

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
    "content": "$f(x)=e^{3x}\\ln x$ ($x>0$)에 대하여 $\\lim_{h\\to0}\\frac{f'(1+h)-f'(1)}h$의 값은?",
    "choices": [
      "$4e^3$",
      "$5e^3$",
      "$6e^3$",
      "$7e^3$",
      "$8e^3$"
    ],
    "answer": "②",
    "solution": "주어진 극한은 도함수 $f'$의 $x=1$에서의 미분계수이므로 $f''(1)$이다.\n곱의 미분법으로 $f'(x)=3e^{3x}\\ln x+e^{3x}\\cdot\\frac1x$이다.\n다시 곱의 미분법을 쓰면 $f''(x)=9e^{3x}\\ln x+3e^{3x}\\cdot\\frac1x+3e^{3x}\\cdot\\frac1x-e^{3x}\\cdot\\frac1{x^2}$이다.\n$\\ln1=0$, $e^0=1$을 대입하면 $f''(1)=0+3e^3+3e^3-e^3$이다.\n계산하면 $f''(1)=5e^3$이다.\n따라서 정답은 ②이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "NONE",
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
    "content": "$f(x)=\\ln|\\cos x|$에서 $\\lim_{h\\to0}\\frac{f'(\\frac{\\pi}{3}+h)-f'(\\frac{\\pi}{3})}{h}$의 값은?",
    "choices": [
      "$-7$",
      "$-6$",
      "$-5$",
      "$-4$",
      "$-3$"
    ],
    "answer": "④",
    "solution": "주어진 극한은 $f'$의 $x=\\frac\\pi3$에서의 미분계수이므로 $f''(\\frac\\pi3)$이다.\n$x=\\frac\\pi3$ 근처에서 $\\cos x>0$이므로 $f(x)=\\ln(\\cos x)$이다.\n합성함수와 로그함수의 미분법으로 $f'(x)=\\frac1{\\cos x}\\cdot(-\\sin x)=-\\tan x$이다.\n탄젠트함수의 미분법으로 $f''(x)=-\\sec^2x$이다.\n$\\sec\\frac\\pi3=\\frac1{\\cos(\\pi/3)}=2$이므로 $f''(\\frac\\pi3)=-2^2=-4$이다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-174",
    "problemTypeKey": "PT_DERIVATIVE_RULE_EVALUATION",
    "templateKey": "TPL_DERIVATIVE_SECOND_ORDER",
    "crossConceptKeys": [
      "CC_DERIVATIVE_VALUE_EVALUATION",
      "CC_FUNCTION_COMPOSITION"
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
    "content": "$f(x)=2x\\ln x$ ($x>0$)에 대하여 $\\lim_{h\\to0}\\frac{f'(2+3h)-f'(2)}h$의 값은?",
    "choices": [
      "$\\frac{3}{2}$",
      "$2$",
      "$\\frac{5}{2}$",
      "$3$",
      "$\\frac{7}{2}$"
    ],
    "answer": "④",
    "solution": "분모를 $3h$로 맞추면 $\\lim_{h\\to0}\\frac{f'(2+3h)-f'(2)}h=3\\lim_{h\\to0}\\frac{f'(2+3h)-f'(2)}{3h}$이다.\n$3h\\to0$이므로 도함수의 미분계수의 정의에 따라 이 극한은 $3f''(2)$이다.\n곱의 미분법으로 $f'(x)=2\\ln x+2x\\cdot\\frac1x=2\\ln x+2$이다.\n$f''(x)=\\frac2x$이므로 $f''(2)=1$이다.\n따라서 극한은 $3\\cdot1=3$이다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-174",
    "problemTypeKey": "PT_DERIVATIVE_RULE_EVALUATION",
    "templateKey": "TPL_DERIVATIVE_SECOND_ORDER",
    "crossConceptKeys": [
      "CC_DERIVATIVE_VALUE_EVALUATION",
      "CC_DIFFERENCE_QUOTIENT_SCALING"
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
    "content": "$f(x)=[\\ln(2x-3)]^2$ ($x>\\frac32$)에 대하여 $\\lim_{x\\to2}\\frac{f'(x)}{x-2}$의 값은?",
    "choices": [
      "$4$",
      "$5$",
      "$6$",
      "$7$",
      "$8$"
    ],
    "answer": "⑤",
    "solution": "$u=\\ln(2x-3)$으로 두면 합성함수의 미분법으로 $f'(x)=2u\\cdot\\frac2{2x-3}=\\frac{4\\ln(2x-3)}{2x-3}$이다.\n$x=2$를 대입하면 $f'(2)=4\\ln1=0$이다.\n분자에 $-f'(2)=0$을 더해도 값이 변하지 않으므로 주어진 극한은 $\\lim_{x\\to2}\\frac{f'(x)-f'(2)}{x-2}=f''(2)$이다.\n몫의 미분법으로 $f''(x)=\\frac{4\\cdot\\frac2{2x-3}\\cdot(2x-3)-4\\ln(2x-3)\\cdot2}{(2x-3)^2}$이다.\n분자를 정리하면 $f''(x)=\\frac{8-8\\ln(2x-3)}{(2x-3)^2}$이다.\n$x=2$를 대입하면 $f''(2)=\\frac{8-8\\ln1}{1^2}=8$이다.\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-174",
    "problemTypeKey": "PT_DERIVATIVE_RULE_EVALUATION",
    "templateKey": "TPL_DERIVATIVE_SECOND_ORDER",
    "crossConceptKeys": [
      "CC_DERIVATIVE_VALUE_EVALUATION"
    ],
    "conditionKeys": [
      "COND_RESTRICTED_INTERVAL"
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
    "content": "$f(x)=\\frac{e^{x-2}}{x^2}$ ($x>0$)에 대하여 $\\lim_{x\\to2}\\frac{f'(x)}{x-2}$의 값은?",
    "choices": [
      "$\\frac{1}{16}$",
      "$\\frac{1}{8}$",
      "$\\frac{3}{16}$",
      "$\\frac{1}{4}$",
      "$\\frac{5}{16}$"
    ],
    "answer": "②",
    "solution": "$f(x)=e^{x-2}x^{-2}$로 보고 곱의 미분법을 쓰면 $f'(x)=e^{x-2}x^{-2}+e^{x-2}(-2x^{-3})$이다.\n공통인수 $e^{x-2}x^{-3}$으로 묶으면 $f'(x)=e^{x-2}x^{-3}(x-2)$이다.\n$x\\ne2$에서 $x-2$를 약분하면 $\\frac{f'(x)}{x-2}=\\frac{e^{x-2}}{x^3}$이다.\n$\\frac{e^{x-2}}{x^3}$은 $x=2$에서 연속이므로 극한값은 $\\frac{e^0}{2^3}=\\frac18$이다.\n주의: $f'(2)=0$이므로 원래 식은 $\\frac00$ 꼴이지만, 약분 후 연속성을 이용해야 한다.\n따라서 정답은 ②이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
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
    "content": "실수 전체에서 두 번 미분가능한 함수 $f$가 $f(2)=5,\\ f'(2)=4$이고 $\\lim_{x\\to2}\\frac{f'(f(x))-3}{x-2}=-8$을 만족한다. $f''(5)$의 값은?",
    "choices": [
      "$-2$",
      "$-1$",
      "$0$",
      "$1$",
      "$2$"
    ],
    "answer": "①",
    "solution": "분모가 $0$으로 가고 극한이 유한하므로 분자도 $0$으로 가야 한다. 즉 $\\lim_{x\\to2}(f'(f(x))-3)=0$이다.\n$f$가 연속이므로 $f(x)\\to f(2)=5$이고, $f'$도 연속이므로 $f'(f(x))\\to f'(5)$이다.\n따라서 $f'(5)-3=0$에서 $f'(5)=3$이다.\n$g(x)=f'(f(x))$라 하면 $g(2)=3$이고 주어진 극한은 $g'(2)=-8$이다.\n합성함수의 미분법으로 $g'(x)=f''(f(x))f'(x)$이다.\n$x=2$를 대입하면 $g'(2)=f''(f(2))f'(2)=f''(5)\\cdot4$이다.\n$4f''(5)=-8$의 양변을 $4$로 나누면 $f''(5)=-2$이다.\n따라서 정답은 ①이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "low",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-174",
    "problemTypeKey": "PT_DERIVATIVE_RULE_EVALUATION",
    "templateKey": "TPL_DERIVATIVE_SECOND_ORDER",
    "crossConceptKeys": [
      "CC_DERIVATIVE_VALUE_EVALUATION",
      "CC_FUNCTION_COMPOSITION"
    ],
    "conditionKeys": [
      "COND_FUNCTION_VALUE_CONSTRAINT"
    ],
    "integrationPattern": "SEQUENTIAL"
  }
];
