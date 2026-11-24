window.examTitle = "미적분II_138_지수함수로그함수와삼각함수의합성함수의미_고2_유형은행1";

window.questionBank = [
  {
    "id": 1,
    "category": "삼각함수의 미분",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-04",
    "standardUnit": "삼각함수의 미분",
    "standardUnitOrder": 4,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "삼각함수의 미분"
    ],
    "wide": false,
    "content": "$f(x)=e^{-2x}\\sin(\\pi x/6)$에 대해 $f'(-3)$은?",
    "choices": [
      "$e^6/2$",
      "$e^6$",
      "$3e^6/2$",
      "$2e^6$",
      "$5e^6/2$"
    ],
    "answer": "④",
    "solution": "주어진 함수는 두 함수의 곱이므로 곱의 미분법을 적용한다: $f'(x)=-2e^{-2x}\\sin(\\pi x/6)+e^{-2x}\\cdot\\frac{\\pi}{6}\\cos(\\pi x/6)$.\n$x=-3$을 대입하면 $f'(-3)=-2e^{6}\\sin(-\\pi/2)+e^{6}\\cdot\\frac{\\pi}{6}\\cos(-\\pi/2)$이다.\n삼각함수 값을 계산하면 $\\sin(-\\pi/2)=-1$, $\\cos(-\\pi/2)=0$이다.\n따라서 $f'(-3)=-2e^{6}\\cdot(-1)+e^{6}\\cdot\\frac{\\pi}{6}\\cdot0=2e^{6}$이다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "B12",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-075",
    "problemTypeKey": "PT_DERIVATIVE_RULE_EVALUATION",
    "templateKey": "TPL_DERIVATIVE_RULE_CALCULATION",
    "crossConceptKeys": [
      "CC_SPECIAL_ANGLES",
      "CC_DERIVATIVE_VALUE_EVALUATION"
    ],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 2,
    "category": "삼각함수의 미분",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-04",
    "standardUnit": "삼각함수의 미분",
    "standardUnitOrder": 4,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "삼각함수의 미분"
    ],
    "wide": false,
    "content": "$0<a<\\pi/2$이고 $f(x)=\\ln(2\\cos x)$가 $f(a)=0$을 만족한다. $f'(a)$는?",
    "choices": [
      "$-\\sqrt3$",
      "$-\\sqrt3/2$",
      "$0$",
      "$\\sqrt3/2$",
      "$\\sqrt3$"
    ],
    "answer": "①",
    "solution": "$f(a)=0$에서 $\\ln(2\\cos a)=0$이므로 $2\\cos a=1$이다.\n$\\cos a=\\frac12$이고 $0<a<\\frac{\\pi}{2}$이므로 $a=\\frac{\\pi}{3}$이다.\n$f(x)=\\ln(2\\cos x)$를 합성함수의 미분법으로 미분하면 $f'(x)=\\frac{1}{2\\cos x}\\cdot(-2\\sin x)=-\\tan x$이다.\n따라서 $f'(a)=-\\tan\\frac{\\pi}{3}=-\\sqrt3$이다.\n따라서 정답은 ①이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-075",
    "problemTypeKey": "PT_DERIVATIVE_RULE_EVALUATION",
    "templateKey": "TPL_DERIVATIVE_RULE_CALCULATION",
    "crossConceptKeys": [
      "CC_TRIGONOMETRIC_EQUATION",
      "CC_SPECIAL_ANGLES"
    ],
    "conditionKeys": [
      "COND_RESTRICTED_INTERVAL"
    ],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 3,
    "category": "삼각함수의 미분",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-04",
    "standardUnit": "삼각함수의 미분",
    "standardUnitOrder": 4,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "삼각함수의 미분"
    ],
    "wide": false,
    "content": "$0<x<\\pi/4$에서 $f(x)=\\ln(\\tan 2x)$이다. $f'(\\pi/24)$는?",
    "choices": [
      "$4$",
      "$5$",
      "$6$",
      "$7$",
      "$8$"
    ],
    "answer": "⑤",
    "solution": "$f(x)=\\ln(\\tan 2x)$는 합성함수의 미분법으로 $f'(x)=\\frac{1}{\\tan 2x}\\cdot\\sec^2 2x\\cdot 2$이다.\n$\\sec^2 2x=\\frac{1}{\\cos^2 2x}$이므로 $f'(x)=\\frac{2}{\\sin 2x\\cos 2x}$이다.\n배각공식 $\\sin 4x=2\\sin 2x\\cos 2x$를 쓰면 $f'(x)=\\frac{4}{\\sin 4x}$이다.\n$x=\\frac{\\pi}{24}$를 대입하면 $4x=\\frac{\\pi}{6}$이다.\n따라서 $f'(\\frac{\\pi}{24})=\\frac{4}{\\sin(\\pi/6)}=\\frac{4}{1/2}=8$이다.\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-075",
    "problemTypeKey": "PT_DERIVATIVE_RULE_EVALUATION",
    "templateKey": "TPL_DERIVATIVE_RULE_CALCULATION",
    "crossConceptKeys": [
      "CC_SPECIAL_ANGLES",
      "CC_DERIVATIVE_VALUE_EVALUATION"
    ],
    "conditionKeys": [
      "COND_RESTRICTED_INTERVAL"
    ],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 4,
    "category": "삼각함수의 미분",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-04",
    "standardUnit": "삼각함수의 미분",
    "standardUnitOrder": 4,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "삼각함수의 미분"
    ],
    "wide": false,
    "content": "$0<x<\\pi/2$에서 $f(x)=\\ln(\\tan^3x)$이다. $f'(\\pi/4)$는?",
    "choices": [
      "$2$",
      "$4$",
      "$6$",
      "$8$",
      "$10$"
    ],
    "answer": "③",
    "solution": "$f(x)=\\ln(\\tan^3 x)=3\\ln(\\tan x)$로 변형한다.\n합성함수의 미분법으로 $f'(x)=3\\cdot\\frac{1}{\\tan x}\\cdot\\sec^2 x$이다.\n$\\sec^2 x=\\frac{1}{\\cos^2 x}$, $\\tan x=\\frac{\\sin x}{\\cos x}$이므로 $f'(x)=\\frac{3}{\\sin x\\cos x}$이다.\n$x=\\frac{\\pi}{4}$에서 $\\sin\\frac{\\pi}{4}=\\cos\\frac{\\pi}{4}=\\frac{\\sqrt2}{2}$이다.\n따라서 $f'(\\frac{\\pi}{4})=\\frac{3}{(\\sqrt2/2)^2}=\\frac{3}{1/2}=6$이다.\n따라서 정답은 ③이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "B12",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-075",
    "problemTypeKey": "PT_DERIVATIVE_RULE_EVALUATION",
    "templateKey": "TPL_DERIVATIVE_RULE_CALCULATION",
    "crossConceptKeys": [
      "CC_SPECIAL_ANGLES",
      "CC_DERIVATIVE_VALUE_EVALUATION"
    ],
    "conditionKeys": [
      "COND_RESTRICTED_INTERVAL"
    ],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 5,
    "category": "삼각함수의 미분",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-04",
    "standardUnit": "삼각함수의 미분",
    "standardUnitOrder": 4,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "삼각함수의 미분"
    ],
    "wide": false,
    "content": "$a$는 $y=\\ln(\\sin^2 2x)$의 $x=\\pi/8$에서의 기울기이고, $b$는 $y=\\ln(\\cos^2 x)$의 $x=\\pi/4$에서의 기울기이다. $ab$는?",
    "choices": [
      "$-12$",
      "$-10$",
      "$-8$",
      "$-6$",
      "$-4$"
    ],
    "answer": "③",
    "solution": "$y=\\ln(\\sin^2 2x)=2\\ln|\\sin 2x|$로 변형하고 합성함수의 미분법을 적용한다.\n$y'=2\\cdot\\frac{1}{\\sin 2x}\\cdot\\cos 2x\\cdot 2=4\\cot 2x$이다.\n$x=\\frac{\\pi}{8}$에서 $2x=\\frac{\\pi}{4}$이므로 $a=4\\cot\\frac{\\pi}{4}=4$이다.\n$y=\\ln(\\cos^2 x)=2\\ln|\\cos x|$이므로 $y'=2\\cdot\\frac{1}{\\cos x}\\cdot(-\\sin x)=-2\\tan x$이다.\n$x=\\frac{\\pi}{4}$에서 $b=-2\\tan\\frac{\\pi}{4}=-2$이다.\n따라서 $ab=4\\cdot(-2)=-8$이다.\n따라서 정답은 ③이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-075",
    "problemTypeKey": "PT_DERIVATIVE_RULE_EVALUATION",
    "templateKey": "TPL_DERIVATIVE_RULE_CALCULATION",
    "crossConceptKeys": [
      "CC_TANGENT_LINE_SLOPE_AT_POINT",
      "CC_SPECIAL_ANGLES"
    ],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 6,
    "category": "삼각함수의 미분",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-04",
    "standardUnit": "삼각함수의 미분",
    "standardUnitOrder": 4,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "삼각함수의 미분"
    ],
    "wide": false,
    "content": "$g(x)=e^{-2x}\\sin x\\,f(x)$이고 미분가능한 $f$가 $f(\\pi/2)\\ne0$을 만족한다. $g'(\\pi/2)=3g(\\pi/2)$일 때 $f'(\\pi/2)/f(\\pi/2)$는?",
    "choices": [
      "$1$",
      "$2$",
      "$3$",
      "$4$",
      "$5$"
    ],
    "answer": "⑤",
    "solution": "$g(x)=e^{-2x}\\sin x\\,f(x)$는 세 함수의 곱이므로 곱의 미분법으로 미분한다.\n$g'(x)=(-2e^{-2x}\\sin x+e^{-2x}\\cos x)f(x)+e^{-2x}\\sin x\\,f'(x)$이다.\n$x=\\frac{\\pi}{2}$에서 $\\sin\\frac{\\pi}{2}=1$, $\\cos\\frac{\\pi}{2}=0$이므로 $g'(\\frac{\\pi}{2})=e^{-\\pi}(f'(\\frac{\\pi}{2})-2f(\\frac{\\pi}{2}))$이다.\n또한 $g(\\frac{\\pi}{2})=e^{-\\pi}\\sin\\frac{\\pi}{2}f(\\frac{\\pi}{2})=e^{-\\pi}f(\\frac{\\pi}{2})$이다.\n조건 $g'(\\frac{\\pi}{2})=3g(\\frac{\\pi}{2})$에서 $e^{-\\pi}(f'(\\frac{\\pi}{2})-2f(\\frac{\\pi}{2}))=3e^{-\\pi}f(\\frac{\\pi}{2})$이다.\n양변을 $e^{-\\pi}$로 나누면 $f'(\\frac{\\pi}{2})-2f(\\frac{\\pi}{2})=3f(\\frac{\\pi}{2})$이다.\n따라서 $f'(\\frac{\\pi}{2})=5f(\\frac{\\pi}{2})$이고, $f(\\frac{\\pi}{2})\\ne0$이므로 $\\frac{f'(\\pi/2)}{f(\\pi/2)}=5$이다.\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-075",
    "problemTypeKey": "PT_DERIVATIVE_RULE_EVALUATION",
    "templateKey": "TPL_DERIVATIVE_RULE_CALCULATION",
    "crossConceptKeys": [
      "CC_SPECIAL_ANGLES",
      "CC_DERIVATIVE_VALUE_EVALUATION"
    ],
    "conditionKeys": [
      "COND_NONZERO"
    ],
    "integrationPattern": "SEQUENTIAL"
  }
];
