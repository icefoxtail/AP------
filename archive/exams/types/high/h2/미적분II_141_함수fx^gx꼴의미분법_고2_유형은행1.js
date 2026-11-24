window.examTitle = "미적분II_141_함수fx^gx꼴의미분법_고2_유형은행1";

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
    "content": "$x>0$에서 $y=(2x)^x$이다. $x=e/2$에서 미분계수는?",
    "choices": [
      "$e^{e/2}/2$",
      "$e^{e/2}$",
      "$3e^{e/2}/2$",
      "$7e^{e/2}/4$",
      "$2e^{e/2}$"
    ],
    "answer": "⑤",
    "solution": "로그를 취한다(로그미분법): $\\ln y=x\\ln(2x)$.\n양변을 $x$로 미분한다(곱의 미분법): $\\frac{y'}{y}=\\ln(2x)+x\\cdot\\frac{2}{2x}=\\ln(2x)+1$.\n$y'=y[\\ln(2x)+1]$로 정리한다.\n$x=\\frac e2$를 대입하면 $y=e^{e/2}$, $\\ln(2x)=\\ln e=1$이다.\n따라서 $y'=e^{e/2}(1+1)=2e^{e/2}$이다.\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-072",
    "problemTypeKey": "PT_DERIVATIVE_RULE_EVALUATION",
    "templateKey": "TPL_DERIVATIVE_RULE_CALCULATION",
    "crossConceptKeys": [
      "CC_DERIVATIVE_VALUE_EVALUATION"
    ],
    "conditionKeys": [
      "COND_RESTRICTED_INTERVAL"
    ],
    "integrationPattern": "REINTERPRETATION"
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
    "content": "$x>0$에서 $f(x)=x^{2\\ln x}$이다. $f'(e)$는?",
    "choices": [
      "$2e$",
      "$3e$",
      "$4e$",
      "$5e$",
      "$6e$"
    ],
    "answer": "③",
    "solution": "로그를 취한다(로그미분법): $\\ln f=2(\\ln x)^2$.\n양변을 미분한다(합성함수 미분법): $\\frac{f'}{f}=2\\cdot2\\ln x\\cdot\\frac1x=\\frac{4\\ln x}{x}$.\n$f(e)=e^{2\\ln e}=e^2$이다.\n$x=e$를 대입하면 $\\frac{f'(e)}{e^2}=\\frac{4}{e}$이므로 $f'(e)=4e$이다.\n따라서 정답은 ③이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-072",
    "problemTypeKey": "PT_DERIVATIVE_RULE_EVALUATION",
    "templateKey": "TPL_DERIVATIVE_RULE_CALCULATION",
    "crossConceptKeys": [
      "CC_DERIVATIVE_VALUE_EVALUATION"
    ],
    "conditionKeys": [
      "COND_RESTRICTED_INTERVAL"
    ],
    "integrationPattern": "REINTERPRETATION"
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
    "content": "$x>0$에서 $f(x)=x^{\\cos(2x)}$이다. $f'(\\pi/2)$는?",
    "choices": [
      "$-8/\\pi^2$",
      "$-6/\\pi^2$",
      "$-4/\\pi^2$",
      "$-2/\\pi^2$",
      "$0$"
    ],
    "answer": "③",
    "solution": "로그를 취한다(로그미분법): $\\ln f=\\cos(2x)\\ln x$.\n양변을 미분한다(곱의 미분법, 합성함수 미분법): $\\frac{f'}{f}=-2\\sin(2x)\\ln x+\\frac{\\cos(2x)}{x}$.\n$x=\\frac{\\pi}{2}$에서 $f=(\\frac{\\pi}{2})^{-1}=\\frac{2}{\\pi}$, $\\sin\\pi=0$, $\\cos\\pi=-1$이다.\n대입하면 $\\frac{f'(\\pi/2)}{2/\\pi}=-\\frac{1}{\\pi/2}=-\\frac{2}{\\pi}$이다.\n따라서 $f'(\\pi/2)=\\frac{2}{\\pi}\\cdot\\left(-\\frac{2}{\\pi}\\right)=-\\frac{4}{\\pi^2}$이다.\n따라서 정답은 ③이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-072",
    "problemTypeKey": "PT_DERIVATIVE_RULE_EVALUATION",
    "templateKey": "TPL_DERIVATIVE_RULE_CALCULATION",
    "crossConceptKeys": [
      "CC_DERIVATIVE_VALUE_EVALUATION"
    ],
    "conditionKeys": [
      "COND_RESTRICTED_INTERVAL"
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
    "content": "$x>0$에서 $f(x)=x^{\\sin(2x)}$이다. $\\lim_{x\\to2\\pi}[f(x)-1]/(x-2\\pi)$는?",
    "choices": [
      "$\\tfrac12\\ln(2\\pi)$",
      "$\\ln(2\\pi)$",
      "$\\tfrac32\\ln(2\\pi)$",
      "$2\\ln(2\\pi)$",
      "$\\tfrac52\\ln(2\\pi)$"
    ],
    "answer": "④",
    "solution": "$f(2\\pi)=(2\\pi)^{\\sin4\\pi}=(2\\pi)^0=1$이므로 주어진 극한은 $f'(2\\pi)$이다(미분계수의 정의).\n로그를 취한다: $\\ln f=\\sin(2x)\\ln x$.\n미분한다(곱의 미분법, 합성함수 미분법): $\\frac{f'}{f}=2\\cos(2x)\\ln x+\\frac{\\sin(2x)}{x}$.\n$x=2\\pi$에서 $\\cos4\\pi=1$, $\\sin4\\pi=0$, $f(2\\pi)=1$이다.\n대입하면 $f'(2\\pi)=1\\cdot[2\\cdot1\\cdot\\ln(2\\pi)+0]=2\\ln(2\\pi)$이다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-072",
    "problemTypeKey": "PT_DERIVATIVE_RULE_EVALUATION",
    "templateKey": "TPL_DERIVATIVE_RULE_CALCULATION",
    "crossConceptKeys": [
      "CC_DERIVATIVE_DEFINITION_LIMIT"
    ],
    "conditionKeys": [
      "COND_RESTRICTED_INTERVAL"
    ],
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
    "content": "$f(x)=(1+e^{2x})(1+e^{4x})(1+e^{8x})$일 때 $\\lim_{x\\to0}f'(x)/f(x)$는?",
    "choices": [
      "$4$",
      "$5$",
      "$6$",
      "$7$",
      "$8$"
    ],
    "answer": "④",
    "solution": "양변에 로그를 취한다: $\\ln f=\\ln(1+e^{2x})+\\ln(1+e^{4x})+\\ln(1+e^{8x})$.\n미분한다(합성함수 미분법): $\\frac{f'}{f}=\\frac{2e^{2x}}{1+e^{2x}}+\\frac{4e^{4x}}{1+e^{4x}}+\\frac{8e^{8x}}{1+e^{8x}}$.\n$x=0$을 대입하면 각 항은 $\\frac22=1$, $\\frac42=2$, $\\frac82=4$이다.\n따라서 $\\frac{f'(0)}{f(0)}=1+2+4=7$이다($f(0)=8$).\n따라서 정답은 ④이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-072",
    "problemTypeKey": "PT_DERIVATIVE_RULE_EVALUATION",
    "templateKey": "TPL_DERIVATIVE_RULE_CALCULATION",
    "crossConceptKeys": [
      "CC_DERIVATIVE_VALUE_EVALUATION"
    ],
    "conditionKeys": [],
    "integrationPattern": "REINTERPRETATION"
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
    "content": "$x>1$에서 $f(x)=x^{1+\\ln x},\\ g(x)=(\\ln x)^{2x}$이다. $f'(e)-g'(e)$는?",
    "choices": [
      "$3e-3$",
      "$3e-2$",
      "$3e-1$",
      "$3e$",
      "$3e+1$"
    ],
    "answer": "②",
    "solution": "$f$에 로그를 취한다: $\\ln f=(1+\\ln x)\\ln x=\\ln x+(\\ln x)^2$.\n미분한다: $\\frac{f'}{f}=\\frac1x+\\frac{2\\ln x}{x}=\\frac{1+2\\ln x}{x}$.\n$f(e)=e^{1+1}=e^2$이고 $x=e$에서 $\\frac{f'(e)}{e^2}=\\frac{3}{e}$이므로 $f'(e)=3e$이다.\n$g$에 로그를 취한다: $\\ln g=2x\\ln(\\ln x)$.\n미분한다(곱의 미분법, 합성함수 미분법): $\\frac{g'}{g}=2\\ln(\\ln x)+2x\\cdot\\frac{1}{\\ln x}\\cdot\\frac1x=2\\ln(\\ln x)+\\frac{2}{\\ln x}$.\n$g(e)=1$이고 $x=e$에서 $g'(e)=2\\ln1+\\frac21=2$이다.\n따라서 $f'(e)-g'(e)=3e-2$이다.\n따라서 정답은 ②이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-072",
    "problemTypeKey": "PT_DERIVATIVE_RULE_EVALUATION",
    "templateKey": "TPL_DERIVATIVE_RULE_CALCULATION",
    "crossConceptKeys": [
      "CC_DERIVATIVE_VALUE_EVALUATION"
    ],
    "conditionKeys": [
      "COND_RESTRICTED_INTERVAL"
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
    "content": "$f(x)=(x-1)^2(x-3)/(x-2)$이다. $f'(4)$는?",
    "choices": [
      "$5/4$",
      "$9/4$",
      "$13/4$",
      "$17/4$",
      "$21/4$"
    ],
    "answer": "⑤",
    "solution": "$x=4$ 근방에서 모든 인수가 양수이므로 로그미분법을 쓴다: $\\ln f=2\\ln(x-1)+\\ln(x-3)-\\ln(x-2)$.\n미분한다: $\\frac{f'}{f}=\\frac{2}{x-1}+\\frac{1}{x-3}-\\frac{1}{x-2}$.\n$x=4$를 대입하면 $\\frac{f'(4)}{f(4)}=\\frac23+1-\\frac12=\\frac46+\\frac66-\\frac36=\\frac76$이다.\n$f(4)=\\frac{(3)^2\\cdot1}{2}=\\frac92$이다.\n따라서 $f'(4)=\\frac92\\cdot\\frac76=\\frac{63}{12}=\\frac{21}{4}$이다.\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-072",
    "problemTypeKey": "PT_DERIVATIVE_RULE_EVALUATION",
    "templateKey": "TPL_DERIVATIVE_RULE_CALCULATION",
    "crossConceptKeys": [
      "CC_RATIONAL_FUNCTION"
    ],
    "conditionKeys": [],
    "integrationPattern": "REINTERPRETATION"
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
    "content": "$f(x)=(x-3)(x-1)^2/(x+1)^3$이다. $f'(3)$은?",
    "choices": [
      "$1/80$",
      "$2/80$",
      "$3/80$",
      "$4/80$",
      "$5/80$"
    ],
    "answer": "⑤",
    "solution": "$f(x)=(x-3)\\cdot\\frac{(x-1)^2}{(x+1)^3}$로 보고 곱의 미분법을 쓴다.\n$g(x)=\\frac{(x-1)^2}{(x+1)^3}$라 하면 $f'(x)=g(x)+(x-3)g'(x)$이다.\n$x=3$을 대입하면 $(x-3)g'(x)$ 항은 $0$이므로 $f'(3)=g(3)$이다.\n$g(3)=\\frac{(3-1)^2}{(3+1)^3}=\\frac{4}{64}=\\frac1{16}$이다.\n$\\frac1{16}=\\frac5{80}$이므로 구하는 값은 $\\frac5{80}$이다.\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-072",
    "problemTypeKey": "PT_DERIVATIVE_RULE_EVALUATION",
    "templateKey": "TPL_DERIVATIVE_RULE_CALCULATION",
    "crossConceptKeys": [
      "CC_RATIONAL_FUNCTION"
    ],
    "conditionKeys": [],
    "integrationPattern": "NONE"
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
    "content": "$f(x)=e^{2x}\\cos x/(2+\\sin x)$일 때 $f'(\\pi)$는?",
    "choices": [
      "$-7e^{2\\pi}/4$",
      "$-5e^{2\\pi}/4$",
      "$-3e^{2\\pi}/4$",
      "$-e^{2\\pi}/4$",
      "$e^{2\\pi}/4$"
    ],
    "answer": "②",
    "solution": "분자를 $N=e^{2x}\\cos x$, 분모를 $D=2+\\sin x$라 한다.\n$N'=2e^{2x}\\cos x-e^{2x}\\sin x$이므로 $x=\\pi$에서 $N'=e^{2\\pi}(-2-0)=-2e^{2\\pi}$이다.\n$N(\\pi)=e^{2\\pi}\\cos\\pi=-e^{2\\pi}$, $D(\\pi)=2$, $D'(\\pi)=\\cos\\pi=-1$이다.\n몫의 미분법: $f'=\\frac{N'D-ND'}{D^2}$.\n대입하면 $f'(\\pi)=\\frac{(-2e^{2\\pi})(2)-(-e^{2\\pi})(-1)}{2^2}=\\frac{-4e^{2\\pi}-e^{2\\pi}}{4}=-\\frac54e^{2\\pi}$이다.\n따라서 정답은 ②이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-072",
    "problemTypeKey": "PT_DERIVATIVE_RULE_EVALUATION",
    "templateKey": "TPL_DERIVATIVE_RULE_CALCULATION",
    "crossConceptKeys": [],
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
    "content": "$f(x)=\\ln\\sqrt{\\frac{1+\\cos(2x)}{1-\\cos(2x)}}$가 정의되는 $0<x<\\pi/2$에서 $f'(\\pi/4)$의 값은?",
    "choices": [
      "$-2$",
      "$-3/2$",
      "$-1$",
      "$-1/2$",
      "$0$"
    ],
    "answer": "①",
    "solution": "반각 공식으로 $1+\\cos2x=2\\cos^2x$, $1-\\cos2x=2\\sin^2x$이다.\n따라서 근호 안은 $\\frac{\\cos^2x}{\\sin^2x}=\\cot^2x$이고, $0<x<\\frac{\\pi}{2}$에서 $\\cot x>0$이므로 $f(x)=\\ln(\\cot x)$이다.\n미분한다(합성함수 미분법): $f'(x)=\\frac{1}{\\cot x}\\cdot(-\\csc^2x)=-\\frac{1}{\\sin x\\cos x}$.\n$x=\\frac{\\pi}{4}$를 대입하면 $\\sin\\frac{\\pi}{4}=\\cos\\frac{\\pi}{4}=\\frac{\\sqrt2}{2}$이다.\n따라서 $f'\\left(\\frac{\\pi}{4}\\right)=-\\frac{1}{\\frac{\\sqrt2}{2}\\cdot\\frac{\\sqrt2}{2}}=-\\frac{1}{1/2}=-2$이다.\n따라서 정답은 ①이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-072",
    "problemTypeKey": "PT_DERIVATIVE_RULE_EVALUATION",
    "templateKey": "TPL_DERIVATIVE_RULE_CALCULATION",
    "crossConceptKeys": [
      "CC_TRIGONOMETRIC_IDENTITY"
    ],
    "conditionKeys": [
      "COND_RESTRICTED_INTERVAL"
    ],
    "integrationPattern": "REINTERPRETATION"
  },
  {
    "id": 11,
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
    "content": "$e^{2f(x)}=\\sqrt{\\frac{1+\\sin x}{1-\\sin x}}$가 $-\\pi/2<x<\\pi/2$에서 성립한다. $f'(\\pi/3)$은?",
    "choices": [
      "$1$",
      "$3/2$",
      "$2$",
      "$5/2$",
      "$3$"
    ],
    "answer": "①",
    "solution": "양변을 제곱하여 정리한다: $e^{4f(x)}=\\frac{1+\\sin x}{1-\\sin x}$.\n로그를 취한다: $4f(x)=\\ln(1+\\sin x)-\\ln(1-\\sin x)$.\n미분한다(합성함수 미분법): $4f'(x)=\\frac{\\cos x}{1+\\sin x}+\\frac{\\cos x}{1-\\sin x}$.\n통분하면 $4f'(x)=\\frac{\\cos x(1-\\sin x+1+\\sin x)}{1-\\sin^2x}=\\frac{2\\cos x}{\\cos^2x}=\\frac{2}{\\cos x}$이다.\n$f'(x)=\\frac{1}{2\\cos x}$이므로 $x=\\frac{\\pi}{3}$에서 $f'\\left(\\frac{\\pi}{3}\\right)=\\frac{1}{2\\cdot\\frac12}=1$이다.\n따라서 정답은 ①이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-072",
    "problemTypeKey": "PT_DERIVATIVE_RULE_EVALUATION",
    "templateKey": "TPL_DERIVATIVE_RULE_CALCULATION",
    "crossConceptKeys": [
      "CC_TRIGONOMETRIC_IDENTITY"
    ],
    "conditionKeys": [
      "COND_RESTRICTED_INTERVAL"
    ],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 12,
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
    "content": "$x>0$에서 $y=(3x)^n$의 도함수를 구하려 한다. $\\ln y=n f(x)$이고 $\\frac1y\\frac{dy}{dx}=g(x)$라 하자. 양의 실수 $n$에 대하여 $f(e/3)+g(n/4)$는?",
    "choices": [
      "$3$",
      "$4$",
      "$5$",
      "$6$",
      "$7$"
    ],
    "answer": "③",
    "solution": "$y=(3x)^n$의 양변에 로그를 취한다: $\\ln y=n\\ln(3x)$.\n따라서 $f(x)=\\ln(3x)$이다.\n$f\\left(\\frac e3\\right)=\\ln\\left(3\\cdot\\frac e3\\right)=\\ln e=1$이다.\n주어진 식 $\\frac1y\\frac{dy}{dx}=g(x)$에서 $g(x)=\\frac{n}{x}$이다($n$은 상수).\n$g\\left(\\frac n4\\right)=\\frac{n}{n/4}=4$이다.\n따라서 $f\\left(\\frac e3\\right)+g\\left(\\frac n4\\right)=1+4=5$이다.\n따라서 정답은 ③이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-072",
    "problemTypeKey": "PT_DERIVATIVE_RULE_EVALUATION",
    "templateKey": "TPL_DERIVATIVE_RULE_CALCULATION",
    "crossConceptKeys": [],
    "conditionKeys": [
      "COND_POSITIVE",
      "COND_RESTRICTED_INTERVAL"
    ],
    "integrationPattern": "REINTERPRETATION"
  }
];
