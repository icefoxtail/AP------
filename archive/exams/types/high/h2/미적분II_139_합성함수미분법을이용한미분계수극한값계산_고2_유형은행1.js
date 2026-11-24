window.examTitle = "미적분II_139_합성함수미분법을이용한미분계수극한값계산_고2_유형은행1";

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
    "content": "$f(x)=x^2+x\\ln(3x-5)$일 때 $\\lim_{h\\to0}[f(2+3h)-f(2)]/h$는?",
    "choices": [
      "$15$",
      "$20$",
      "$25$",
      "$30$",
      "$35$"
    ],
    "answer": "④",
    "solution": "주어진 극한은 $x=2$에서의 미분계수의 정의를 변형한 것이다.\n$\\lim_{h\\to0}\\frac{f(2+3h)-f(2)}{h}=3\\lim_{h\\to0}\\frac{f(2+3h)-f(2)}{3h}=3f'(2)$이다.\n$f(x)=x^2+x\\ln(3x-5)$를 미분하면 $f'(x)=2x+\\ln(3x-5)+x\\cdot\\frac{3}{3x-5}$이다(곱의 미분법).\n$x=2$를 대입하면 $f'(2)=4+\\ln1+\\frac{6}{1}=10$이다.\n따라서 극한값은 $3\\cdot10=30$이다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "B12",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-075",
    "problemTypeKey": "PT_DERIVATIVE_RULE_EVALUATION",
    "templateKey": "TPL_DERIVATIVE_RULE_CALCULATION",
    "crossConceptKeys": [
      "CC_DERIVATIVE_DEFINITION_LIMIT",
      "CC_DIFFERENCE_QUOTIENT_SCALING"
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
    "content": "$f(x)=\\ln(\\cos 2x)$일 때 $\\lim_{h\\to0}[f(\\pi/8+2h)-f(\\pi/8-h)]/h$는?",
    "choices": [
      "$-6$",
      "$-5$",
      "$-4$",
      "$-3$",
      "$-2$"
    ],
    "answer": "①",
    "solution": "극한을 $x=\\frac{\\pi}{8}$에서의 미분계수 형태로 나눈다.\n$\\lim_{h\\to0}\\frac{f(\\frac{\\pi}{8}+2h)-f(\\frac{\\pi}{8}-h)}{h}=\\lim_{h\\to0}\\frac{f(\\frac{\\pi}{8}+2h)-f(\\frac{\\pi}{8})}{h}+\\lim_{h\\to0}\\frac{f(\\frac{\\pi}{8})-f(\\frac{\\pi}{8}-h)}{h}$이다.\n각각의 극한은 $2f'(\\frac{\\pi}{8})$과 $f'(\\frac{\\pi}{8})$이므로 전체는 $3f'(\\frac{\\pi}{8})$이다.\n$f(x)=\\ln(\\cos2x)$를 합성함수의 미분법으로 미분하면 $f'(x)=\\frac{1}{\\cos2x}\\cdot(-\\sin2x)\\cdot2=-2\\tan2x$이다.\n$f'(\\frac{\\pi}{8})=-2\\tan\\frac{\\pi}{4}=-2\\cdot1=-2$이다.\n따라서 극한값은 $3\\cdot(-2)=-6$이다.\n따라서 정답은 ①이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "B12",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-075",
    "problemTypeKey": "PT_DERIVATIVE_RULE_EVALUATION",
    "templateKey": "TPL_DERIVATIVE_RULE_CALCULATION",
    "crossConceptKeys": [
      "CC_DERIVATIVE_DEFINITION_LIMIT",
      "CC_DIFFERENCE_QUOTIENT_SCALING"
    ],
    "conditionKeys": [],
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
    "content": "$f(x)=\\ln(\\tan 2x)$일 때 $\\lim_{h\\to0}[f(\\pi/8-2h)-f(\\pi/8+h)]/h$는?",
    "choices": [
      "$-12$",
      "$-10$",
      "$-8$",
      "$-6$",
      "$-4$"
    ],
    "answer": "①",
    "solution": "$x=\\frac{\\pi}{8}$에서 분자를 $f(\\frac{\\pi}{8})$ 기준으로 나눈다.\n$\\lim_{h\\to0}\\frac{f(\\frac{\\pi}{8}-2h)-f(\\frac{\\pi}{8}+h)}{h}=-2f'(\\frac{\\pi}{8})-f'(\\frac{\\pi}{8})=-3f'(\\frac{\\pi}{8})$이다.\n$f(x)=\\ln(\\tan2x)$를 합성함수의 미분법으로 미분하면 $f'(x)=\\frac{1}{\\tan2x}\\cdot\\sec^2(2x)\\cdot2$이다.\n$x=\\frac{\\pi}{8}$이면 $2x=\\frac{\\pi}{4}$이고 $\\tan\\frac{\\pi}{4}=1$, $\\sec^2\\frac{\\pi}{4}=2$이다.\n따라서 $f'(\\frac{\\pi}{8})=1\\cdot2\\cdot2=4$이다.\n그러므로 극한값은 $-3\\cdot4=-12$이다.\n따라서 정답은 ①이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "B12",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-075",
    "problemTypeKey": "PT_DERIVATIVE_RULE_EVALUATION",
    "templateKey": "TPL_DERIVATIVE_RULE_CALCULATION",
    "crossConceptKeys": [
      "CC_DERIVATIVE_DEFINITION_LIMIT",
      "CC_DIFFERENCE_QUOTIENT_SCALING"
    ],
    "conditionKeys": [],
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
    "content": "$f(x)=\\ln(\\ln x)$일 때 $\\lim_{h\\to0}[f(e^2+3h)-f(e^2-h)]/h$는?",
    "choices": [
      "$1/(2e^2)$",
      "$1/e^2$",
      "$3/(2e^2)$",
      "$2/e^2$",
      "$5/(2e^2)$"
    ],
    "answer": "④",
    "solution": "$x=e^2$에서의 미분계수 형태로 정리한다.\n$\\lim_{h\\to0}\\frac{f(e^2+3h)-f(e^2-h)}{h}=3f'(e^2)+f'(e^2)=4f'(e^2)$이다.\n$f(x)=\\ln(\\ln x)$를 합성함수의 미분법으로 미분하면 $f'(x)=\\frac{1}{\\ln x}\\cdot\\frac{1}{x}=\\frac{1}{x\\ln x}$이다.\n$x=e^2$를 대입하면 $f'(e^2)=\\frac{1}{e^2\\ln e^2}=\\frac{1}{2e^2}$이다.\n따라서 극한값은 $4\\cdot\\frac{1}{2e^2}=\\frac{2}{e^2}$이다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "B12",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-075",
    "problemTypeKey": "PT_DERIVATIVE_RULE_EVALUATION",
    "templateKey": "TPL_DERIVATIVE_RULE_CALCULATION",
    "crossConceptKeys": [
      "CC_DERIVATIVE_DEFINITION_LIMIT",
      "CC_DIFFERENCE_QUOTIENT_SCALING"
    ],
    "conditionKeys": [],
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
    "content": "$f(x)=\\ln(ax+b)$이고 $\\lim_{x\\to0} f(x)/x=3$일 때 $f(3)$은?",
    "choices": [
      "$\\ln6$",
      "$\\ln7$",
      "$\\ln8$",
      "$\\ln9$",
      "$\\ln10$"
    ],
    "answer": "⑤",
    "solution": "극한값이 유한하고 분모 $x\\to0$이므로 분자도 $0$에 수렴해야 한다.\n$f$는 $x=0$ 근처에서 연속이므로 $f(0)=\\ln b=0$, 즉 $b=1$이다.\n$f(0)=0$이므로 주어진 극한은 $f'(0)$과 같다.\n$f'(x)=\\frac{a}{ax+b}$이므로 $f'(0)=\\frac{a}{1}=a=3$이다.\n따라서 $f(x)=\\ln(3x+1)$이고 $f(3)=\\ln(9+1)=\\ln10$이다.\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-075",
    "problemTypeKey": "PT_DERIVATIVE_RULE_EVALUATION",
    "templateKey": "TPL_DERIVATIVE_RULE_CALCULATION",
    "crossConceptKeys": [
      "CC_DERIVATIVE_DEFINITION_LIMIT",
      "CC_DERIVATIVE_VALUE_EVALUATION"
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
    "content": "$f(x)=\\cos^2(3x+\\pi/4)$일 때 $\\lim_{x\\to0}[f(x)-f(0)]/x$는?",
    "choices": [
      "$-3$",
      "$-2$",
      "$-1$",
      "$0$",
      "$1$"
    ],
    "answer": "①",
    "solution": "주어진 극한은 $x=0$에서 $f$의 미분계수 $f'(0)$이다.\n$f(x)=\\cos^2(3x+\\frac{\\pi}{4})$를 합성함수의 미분법으로 미분하면 $f'(x)=2\\cos(3x+\\frac{\\pi}{4})\\cdot\\left(-\\sin(3x+\\frac{\\pi}{4})\\right)\\cdot3$이다.\n이를 정리하면 $f'(x)=-6\\sin(3x+\\frac{\\pi}{4})\\cos(3x+\\frac{\\pi}{4})=-3\\sin(6x+\\frac{\\pi}{2})$이다(이배각 공식).\n$x=0$을 대입하면 $f'(0)=-3\\sin\\frac{\\pi}{2}=-3\\cdot1=-3$이다.\n따라서 정답은 ①이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "B12",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-075",
    "problemTypeKey": "PT_DERIVATIVE_RULE_EVALUATION",
    "templateKey": "TPL_DERIVATIVE_RULE_CALCULATION",
    "crossConceptKeys": [
      "CC_DERIVATIVE_DEFINITION_LIMIT",
      "CC_SPECIAL_ANGLES"
    ],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 7,
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
    "content": "$f(x)=\\tan(3x)+5\\sin x$일 때 $\\lim_{h\\to0}[f(\\pi+2h)-f(\\pi-h)]/h$는?",
    "choices": [
      "$-10$",
      "$-8$",
      "$-6$",
      "$-4$",
      "$-2$"
    ],
    "answer": "③",
    "solution": "$f(\\pi)$를 기준으로 극한을 나눈다.\n$\\lim_{h\\to0}\\frac{f(\\pi+2h)-f(\\pi-h)}{h}=2f'(\\pi)-(-f'(\\pi))=3f'(\\pi)$이다.\n$f(x)=\\tan3x+5\\sin x$를 미분하면 $f'(x)=3\\sec^2 3x+5\\cos x$이다.\n$x=\\pi$를 대입하면 $f'(\\pi)=3\\sec^2 3\\pi+5\\cos\\pi=3\\cdot1+5\\cdot(-1)=-2$이다.\n따라서 극한값은 $3\\cdot(-2)=-6$이다.\n따라서 정답은 ③이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "B12",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-075",
    "problemTypeKey": "PT_DERIVATIVE_RULE_EVALUATION",
    "templateKey": "TPL_DERIVATIVE_RULE_CALCULATION",
    "crossConceptKeys": [
      "CC_DERIVATIVE_DEFINITION_LIMIT",
      "CC_DIFFERENCE_QUOTIENT_SCALING"
    ],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 8,
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
    "content": "$f(x)=\\sin^2(2x),\\ g(t)=e^{2t}$일 때 $\\lim_{x\\to\\pi/8}[g(f(x))-e]/(x-\\pi/8)$는?",
    "choices": [
      "$e/2$",
      "$e$",
      "$2e$",
      "$3e$",
      "$4e$"
    ],
    "answer": "⑤",
    "solution": "주어진 극한은 $h(x)=g(f(x))$의 $x=\\frac{\\pi}{8}$에서의 미분계수이다.\n$f(\\frac{\\pi}{8})=\\sin^2\\frac{\\pi}{4}=\\left(\\frac{\\sqrt2}{2}\\right)^2=\\frac12$이므로 $g(f(\\frac{\\pi}{8}))=g(\\frac12)=e^{1}=e$이다.\n$f'(x)=2\\sin2x\\cos2x\\cdot2=4\\sin2x\\cos2x$이므로 $f'(\\frac{\\pi}{8})=4\\cdot\\frac{\\sqrt2}{2}\\cdot\\frac{\\sqrt2}{2}=2$이다.\n$g'(t)=2e^{2t}$이므로 $g'(\\frac12)=2e$이다.\n합성함수의 미분법에 의해 $(g\\circ f)'(\\frac{\\pi}{8})=g'(f(\\frac{\\pi}{8}))f'(\\frac{\\pi}{8})=2e\\cdot2=4e$이다.\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-075",
    "problemTypeKey": "PT_DERIVATIVE_RULE_EVALUATION",
    "templateKey": "TPL_DERIVATIVE_RULE_CALCULATION",
    "crossConceptKeys": [
      "CC_DERIVATIVE_DEFINITION_LIMIT",
      "CC_FUNCTION_COMPOSITION"
    ],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 9,
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
    "content": "$f(x)=x\\tan x$일 때 $\\lim_{n\\to\\infty}n[f(\\pi/4+2/n)-f(\\pi/4-2/n)]$은?",
    "choices": [
      "$2\\pi+1$",
      "$2\\pi+2$",
      "$2\\pi+3$",
      "$2\\pi+4$",
      "$2\\pi+5$"
    ],
    "answer": "④",
    "solution": "$h=\\frac1n$으로 놓으면 $n\\to\\infty$일 때 $h\\to0+$이다.\n$n\\left[f(\\frac{\\pi}{4}+\\frac2n)-f(\\frac{\\pi}{4}-\\frac2n)\\right]=\\frac{f(\\frac{\\pi}{4}+2h)-f(\\frac{\\pi}{4}-2h)}{h}$이다.\n이 극한은 $2f'(\\frac{\\pi}{4})-(-2f'(\\frac{\\pi}{4}))=4f'(\\frac{\\pi}{4})$이다.\n$f(x)=x\\tan x$를 곱의 미분법으로 미분하면 $f'(x)=\\tan x+x\\sec^2 x$이다.\n$f'(\\frac{\\pi}{4})=\\tan\\frac{\\pi}{4}+\\frac{\\pi}{4}\\sec^2\\frac{\\pi}{4}=1+\\frac{\\pi}{4}\\cdot2=1+\\frac{\\pi}{2}$이다.\n따라서 극한값은 $4\\left(1+\\frac{\\pi}{2}\\right)=4+2\\pi=2\\pi+4$이다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-075",
    "problemTypeKey": "PT_DERIVATIVE_RULE_EVALUATION",
    "templateKey": "TPL_DERIVATIVE_RULE_CALCULATION",
    "crossConceptKeys": [
      "CC_DERIVATIVE_DEFINITION_LIMIT",
      "CC_DIFFERENCE_QUOTIENT_SCALING"
    ],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 10,
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
    "content": "$f(x)=3^{\\sin x}$일 때 $\\lim_{n\\to\\infty}n[f(3/n)-f(-2/n)]$은?",
    "choices": [
      "$\\ln3$",
      "$2\\ln3$",
      "$3\\ln3$",
      "$4\\ln3$",
      "$5\\ln3$"
    ],
    "answer": "⑤",
    "solution": "$h=\\frac1n$으로 놓으면 $h\\to0+$이고 식은 $\\frac{f(3h)-f(-2h)}{h}$이다.\n$=\\lim_{h\\to0}\\frac{f(3h)-f(0)}{h}-\\lim_{h\\to0}\\frac{f(-2h)-f(0)}{h}=3f'(0)-(-2)f'(0)=5f'(0)$이다.\n$f(x)=3^{\\sin x}$를 합성함수의 미분법으로 미분하면 $f'(x)=3^{\\sin x}\\ln3\\cdot\\cos x$이다.\n$f'(0)=3^{0}\\ln3\\cdot\\cos0=1\\cdot\\ln3\\cdot1=\\ln3$이다.\n따라서 극한값은 $5\\ln3$이다.\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "B12",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-075",
    "problemTypeKey": "PT_DERIVATIVE_RULE_EVALUATION",
    "templateKey": "TPL_DERIVATIVE_RULE_CALCULATION",
    "crossConceptKeys": [
      "CC_DERIVATIVE_DEFINITION_LIMIT",
      "CC_DIFFERENCE_QUOTIENT_SCALING"
    ],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 11,
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
    "content": "미분가능한 $f$가 $\\lim_{x\\to2}[5^{f(x)}-1]/(x-2)=4\\ln5$를 만족할 때 $f'(2)$는?",
    "choices": [
      "$3$",
      "$4$",
      "$5$",
      "$6$",
      "$7$"
    ],
    "answer": "②",
    "solution": "분모가 $0$으로 가고 극한값이 유한하므로 분자도 $0$으로 가야 한다.\n$f$가 미분가능하므로 연속이고, $5^{f(2)}-1=0$에서 $5^{f(2)}=1$, 즉 $f(2)=0$이다.\n$F(x)=5^{f(x)}$로 놓으면 주어진 극한은 $F'(2)$이다.\n$F'(x)=5^{f(x)}\\ln5\\cdot f'(x)$이다(합성함수의 미분법).\n$F'(2)=5^{0}\\ln5\\cdot f'(2)=\\ln5\\cdot f'(2)$이다.\n주어진 값이 $4\\ln5$이므로 $\\ln5\\cdot f'(2)=4\\ln5$에서 $f'(2)=4$이다.\n따라서 정답은 ②이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-075",
    "problemTypeKey": "PT_DERIVATIVE_RULE_EVALUATION",
    "templateKey": "TPL_DERIVATIVE_RULE_CALCULATION",
    "crossConceptKeys": [
      "CC_DERIVATIVE_DEFINITION_LIMIT",
      "CC_DERIVATIVE_VALUE_EVALUATION"
    ],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 12,
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
    "content": "$x>1$에서 $f(x)=\\lim_{h\\to0}[(2\\ln x)^h-1]/h$이다. $f'(e^2)$는?",
    "choices": [
      "$1/(4e^2)$",
      "$1/(3e^2)$",
      "$1/(2e^2)$",
      "$1/e^2$",
      "$2/e^2$"
    ],
    "answer": "③",
    "solution": "$x>1$이므로 $a=2\\ln x>0$이다.\n$\\lim_{h\\to0}\\frac{a^h-1}{h}$는 $a^h$의 $h=0$에서의 미분계수이다.\n$a^h=e^{h\\ln a}$이므로 그 값은 $\\ln a=\\ln(2\\ln x)$이다.\n따라서 $f(x)=\\ln(2\\ln x)$이다.\n$f'(x)=\\frac{1}{2\\ln x}\\cdot\\frac{2}{x}=\\frac{1}{x\\ln x}$이다(합성함수의 미분법).\n$x=e^2$를 대입하면 $f'(e^2)=\\frac{1}{e^2\\ln e^2}=\\frac{1}{2e^2}$이다.\n따라서 정답은 ③이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-075",
    "problemTypeKey": "PT_DERIVATIVE_RULE_EVALUATION",
    "templateKey": "TPL_DERIVATIVE_RULE_CALCULATION",
    "crossConceptKeys": [
      "CC_FUNCTION_LIMIT",
      "CC_DERIVATIVE_VALUE_EVALUATION"
    ],
    "conditionKeys": [
      "COND_RANGE"
    ],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 13,
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
    "content": "$x>1$에서 $f(x)=\\lim_{h\\to0}[(\\log_3 x)^h-1]/h$이다. $f(3^{e^2})$는?",
    "choices": [
      "$2$",
      "$3$",
      "$4$",
      "$5$",
      "$6$"
    ],
    "answer": "①",
    "solution": "$x>1$이므로 $a=\\log_3 x>0$이다.\n$\\lim_{h\\to0}\\frac{a^h-1}{h}$는 $a^h$의 $h=0$에서의 미분계수이므로 $\\ln a$이다.\n따라서 $f(x)=\\ln(\\log_3 x)$이다.\n$x=3^{e^2}$를 대입하면 $\\log_3(3^{e^2})=e^2$이다.\n$f(3^{e^2})=\\ln(e^2)=2\\ln e=2$이다.\n따라서 정답은 ①이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "B12",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-075",
    "problemTypeKey": "PT_DERIVATIVE_RULE_EVALUATION",
    "templateKey": "TPL_DERIVATIVE_RULE_CALCULATION",
    "crossConceptKeys": [
      "CC_FUNCTION_LIMIT",
      "CC_FUNCTION_VALUE"
    ],
    "conditionKeys": [
      "COND_RANGE"
    ],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 14,
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
    "content": "$f(x)=(x^3+x-1)^2,\\ g(x)=(2x-3)^{-2}$일 때 $\\lim_{h\\to0}[f(1+3h)-g(2-h)]/h$는?",
    "choices": [
      "$16$",
      "$20$",
      "$24$",
      "$28$",
      "$32$"
    ],
    "answer": "②",
    "solution": "$h=0$일 때의 분자를 확인하면 $f(1)=(1^3+1-1)^2=1$, $g(2)=(4-3)^{-2}=1$이므로 $f(1)-g(2)=0$이다.\n따라서 극한을 다음과 같이 나눌 수 있다.\n$\\lim_{h\\to0}\\frac{f(1+3h)-g(2-h)}{h}=\\lim_{h\\to0}\\frac{f(1+3h)-f(1)}{h}-\\lim_{h\\to0}\\frac{g(2-h)-g(2)}{h}=3f'(1)-(-g'(2))=3f'(1)+g'(2)$이다.\n$f'(x)=2(x^3+x-1)(3x^2+1)$이므로 $f'(1)=2\\cdot1\\cdot4=8$이다.\n$g'(x)=-2(2x-3)^{-3}\\cdot2=-4(2x-3)^{-3}$이므로 $g'(2)=-4\\cdot1^{-3}=-4$이다.\n따라서 극한값은 $3\\cdot8+(-4)=24-4=20$이다.\n따라서 정답은 ②이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-075",
    "problemTypeKey": "PT_DERIVATIVE_RULE_EVALUATION",
    "templateKey": "TPL_DERIVATIVE_RULE_CALCULATION",
    "crossConceptKeys": [
      "CC_DERIVATIVE_DEFINITION_LIMIT",
      "CC_POLYNOMIAL_DERIVATIVE_RULE"
    ],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 15,
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
    "content": "$x>1$에서 $f(x)=(\\ln x)^{2x}$이다. $\\lim_{h\\to0}[f(e+2h)-f(e-3h)]/h$는?",
    "choices": [
      "$6$",
      "$8$",
      "$10$",
      "$12$",
      "$14$"
    ],
    "answer": "③",
    "solution": "$f(x)=(\\ln x)^{2x}$의 양변에 자연로그를 취하면 $\\ln f(x)=2x\\ln(\\ln x)$이다.\n양변을 미분하면 $\\frac{f'(x)}{f(x)}=2\\ln(\\ln x)+2x\\cdot\\frac{1}{\\ln x}\\cdot\\frac{1}{x}=2\\ln(\\ln x)+\\frac{2}{\\ln x}$이다(합성함수와 곱의 미분법).\n$x=e$이면 $f(e)=(\\ln e)^{2e}=1$이고 $f'(e)=1\\cdot\\left(2\\ln1+\\frac{2}{1}\\right)=2$이다.\n주어진 극한을 $f(e)$ 기준으로 나누면 $\\lim_{h\\to0}\\frac{f(e+2h)-f(e-3h)}{h}=2f'(e)+3f'(e)=5f'(e)$이다.\n따라서 극한값은 $5\\cdot2=10$이다.\n따라서 정답은 ③이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-075",
    "problemTypeKey": "PT_DERIVATIVE_RULE_EVALUATION",
    "templateKey": "TPL_DERIVATIVE_RULE_CALCULATION",
    "crossConceptKeys": [
      "CC_DERIVATIVE_DEFINITION_LIMIT",
      "CC_DIFFERENCE_QUOTIENT_SCALING"
    ],
    "conditionKeys": [
      "COND_RANGE"
    ],
    "integrationPattern": "SEQUENTIAL"
  }
];
