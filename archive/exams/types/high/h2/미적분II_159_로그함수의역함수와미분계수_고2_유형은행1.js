window.examTitle = "미적분II_159_로그함수의역함수와미분계수_고2_유형은행1";

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
    "content": "$f(x)=x+2\\ln x$ ($x>0$)의 역함수를 $g$라 하자. $g'(e+2)$의 값은?",
    "choices": [
      "$\\frac{e}{e+5}$",
      "$\\frac{e}{e+4}$",
      "$\\frac{e}{e+3}$",
      "$\\frac{e}{e+2}$",
      "$\\frac{e}{e+1}$"
    ],
    "answer": "④",
    "solution": "$\\ln e=1$이므로 $f(e)=e+2\\ln e=e+2$이다.\n역함수의 정의에 따라 $g(e+2)=e$이다.\n로그함수의 미분법으로 $f'(x)=1+\\frac{2}{x}$이다.\n$x=e$를 대입하면 $f'(e)=1+\\frac{2}{e}=\\frac{e+2}{e}$이다.\n역함수의 미분법 $g'(b)=\\frac{1}{f'(a)}$ ($f(a)=b$)로 $g'(e+2)=\\frac{1}{(e+2)/e}=\\frac{e}{e+2}$이다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-082",
    "problemTypeKey": "PT_DERIVATIVE_RULE_EVALUATION",
    "templateKey": "TPL_DERIVATIVE_RULE_CALCULATION",
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
    "content": "$f(x)=e^{2x}+3\\ln x$ ($x>0$)의 역함수를 $g$라 하자. $g'(e^2)$의 값은?",
    "choices": [
      "$\\frac{1}{2e^2+7}$",
      "$\\frac{1}{2e^2+6}$",
      "$\\frac{1}{2e^2+5}$",
      "$\\frac{1}{2e^2+4}$",
      "$\\frac{1}{2e^2+3}$"
    ],
    "answer": "⑤",
    "solution": "$\\ln 1=0$이므로 $f(1)=e^{2}+3\\ln 1=e^{2}$이다.\n역함수의 정의에 따라 $g(e^{2})=1$이다.\n지수함수와 로그함수의 미분법으로 $f'(x)=2e^{2x}+\\frac{3}{x}$이다.\n$x=1$을 대입하면 $f'(1)=2e^{2}+3$이다.\n역함수의 미분법으로 $g'(e^{2})=\\frac{1}{f'(1)}=\\frac{1}{2e^{2}+3}$이다.\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-082",
    "problemTypeKey": "PT_DERIVATIVE_RULE_EVALUATION",
    "templateKey": "TPL_DERIVATIVE_RULE_CALCULATION",
    "crossConceptKeys": [
      "CC_DERIVATIVE_VALUE_EVALUATION"
    ],
    "conditionKeys": [
      "COND_POSITIVE"
    ],
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
    "content": "$f(x)=\\ln\\sqrt{\\frac{2+x}{2-x}}$ ($-2<x<2$)의 역함수를 $g$라 하자. $g'(0)$의 값은?",
    "choices": [
      "$1$",
      "$2$",
      "$3$",
      "$4$",
      "$5$"
    ],
    "answer": "②",
    "solution": "$f(0)=\\ln\\sqrt{\\frac{2+0}{2-0}}=\\ln 1=0$이므로 $g(0)=0$이다.\n로그의 성질로 $f(x)=\\frac{1}{2}\\left[\\ln(2+x)-\\ln(2-x)\\right]$이다.\n합성함수의 미분법으로 $f'(x)=\\frac{1}{2}\\left(\\frac{1}{2+x}+\\frac{1}{2-x}\\right)$이다.\n$x=0$을 대입하면 $f'(0)=\\frac{1}{2}\\left(\\frac{1}{2}+\\frac{1}{2}\\right)=\\frac{1}{2}$이다.\n역함수의 미분법으로 $g'(0)=\\frac{1}{f'(0)}=2$이다.\n따라서 정답은 ②이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-082",
    "problemTypeKey": "PT_DERIVATIVE_RULE_EVALUATION",
    "templateKey": "TPL_DERIVATIVE_RULE_CALCULATION",
    "crossConceptKeys": [
      "CC_FUNCTION_COMPOSITION",
      "CC_DERIVATIVE_VALUE_EVALUATION"
    ],
    "conditionKeys": [
      "COND_RESTRICTED_INTERVAL"
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
    "content": "$x>\\frac{\\ln3}{2}$에서 $f(x)=\\frac12\\ln(e^{2x}-3)$의 역함수를 $g$라 하자. $a>\\frac{\\ln3}{2}$일 때 $\\frac1{f'(a)}+\\frac1{g'(a)}$의 값은?",
    "choices": [
      "$0$",
      "$1$",
      "$2$",
      "$3$",
      "$4$"
    ],
    "answer": "③",
    "solution": "역함수의 정의에 따라 $a=f(g(a))=\\frac{1}{2}\\ln\\left(e^{2g(a)}-3\\right)$이다.\n양변에 $2$를 곱하고 지수로 바꾸면 $e^{2a}=e^{2g(a)}-3$이다.\n이를 정리하면 $e^{2g(a)}=e^{2a}+3$이므로 $g(a)=\\frac{1}{2}\\ln(e^{2a}+3)$이다.\n합성함수의 미분법으로 $f'(a)=\\frac{1}{2}\\cdot\\frac{2e^{2a}}{e^{2a}-3}=\\frac{e^{2a}}{e^{2a}-3}$이다.\n같은 방법으로 $g'(a)=\\frac{1}{2}\\cdot\\frac{2e^{2a}}{e^{2a}+3}=\\frac{e^{2a}}{e^{2a}+3}$이다.\n따라서 $\\frac{1}{f'(a)}+\\frac{1}{g'(a)}=\\frac{e^{2a}-3}{e^{2a}}+\\frac{e^{2a}+3}{e^{2a}}$이다.\n분자를 합치면 $\\frac{2e^{2a}}{e^{2a}}=2$이다.\n따라서 정답은 ③이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-082",
    "problemTypeKey": "PT_DERIVATIVE_RULE_EVALUATION",
    "templateKey": "TPL_DERIVATIVE_RULE_CALCULATION",
    "crossConceptKeys": [
      "CC_INVERSE_FUNCTION_EVALUATION",
      "CC_DERIVATIVE_VALUE_EVALUATION"
    ],
    "conditionKeys": [
      "COND_RANGE"
    ],
    "integrationPattern": "REINTERPRETATION"
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
    "content": "$f(x)=\\log_5(5^x+2)$의 역함수를 $g$라 하자. $a>\\log_5 2$일 때 $\\frac{2}{f'(a)}+\\frac{2}{g'(a)}$의 값은?",
    "choices": [
      "$0$",
      "$1$",
      "$2$",
      "$3$",
      "$4$"
    ],
    "answer": "⑤",
    "solution": "역함수의 정의에 따라 $a=\\log_5(5^{g(a)}+2)$이다.\n로그의 정의로 $5^a=5^{g(a)}+2$이므로 $5^{g(a)}=5^a-2$이다.\n따라서 $g(a)=\\log_5(5^a-2)$이다.\n지수함수와 로그함수의 미분법으로 $f'(a)=\\frac{5^a\\ln 5}{(5^a+2)\\ln 5}=\\frac{5^a}{5^a+2}$이다.\n같은 방법으로 $g'(a)=\\frac{5^a\\ln 5}{(5^a-2)\\ln 5}=\\frac{5^a}{5^a-2}$이다.\n따라서 $\\frac{2}{f'(a)}+\\frac{2}{g'(a)}=\\frac{2(5^a+2)}{5^a}+\\frac{2(5^a-2)}{5^a}$이다.\n분자를 합치면 $\\frac{4\\cdot 5^a}{5^a}=4$이다.\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-082",
    "problemTypeKey": "PT_DERIVATIVE_RULE_EVALUATION",
    "templateKey": "TPL_DERIVATIVE_RULE_CALCULATION",
    "crossConceptKeys": [
      "CC_INVERSE_FUNCTION_EVALUATION",
      "CC_DERIVATIVE_VALUE_EVALUATION"
    ],
    "conditionKeys": [
      "COND_RANGE"
    ],
    "integrationPattern": "REINTERPRETATION"
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
    "content": "$f(x)=\\ln(\\tan 2x)$ ($0<x<\\frac{\\pi}4$)의 역함수를 $g$라 하자. $\\lim_{h\\to0}\\frac{3g(8h)-3\\pi/8}{h}$의 값은?",
    "choices": [
      "$4$",
      "$5$",
      "$6$",
      "$7$",
      "$8$"
    ],
    "answer": "③",
    "solution": "$\\tan\\frac{\\pi}{4}=1$이므로 $f\\left(\\frac{\\pi}{8}\\right)=\\ln 1=0$이다.\n역함수의 정의에 따라 $g(0)=\\frac{\\pi}{8}$이다.\n극한의 식을 $g(0)$을 이용해 쓰면 $\\lim_{h\\to 0}\\frac{3\\left(g(8h)-g(0)\\right)}{h}$이다.\n분모와 분자를 맞추면 이는 $3\\cdot 8\\lim_{h\\to 0}\\frac{g(8h)-g(0)}{8h}=24g'(0)$이다.\n로그함수와 탄젠트함수의 미분법으로 $f'(x)=\\frac{1}{\\tan(2x)}\\cdot\\sec^2(2x)\\cdot 2=\\frac{2\\sec^2(2x)}{\\tan(2x)}$이다.\n$x=\\frac{\\pi}{8}$에서 $\\tan\\frac{\\pi}{4}=1$, $\\sec^2\\frac{\\pi}{4}=2$이므로 $f'\\left(\\frac{\\pi}{8}\\right)=\\frac{2\\cdot 2}{1}=4$이다.\n역함수의 미분법으로 $g'(0)=\\frac{1}{f'(\\pi/8)}=\\frac{1}{4}$이다.\n따라서 $24g'(0)=24\\cdot\\frac{1}{4}=6$이다.\n따라서 정답은 ③이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-082",
    "problemTypeKey": "PT_DERIVATIVE_RULE_EVALUATION",
    "templateKey": "TPL_DERIVATIVE_RULE_CALCULATION",
    "crossConceptKeys": [
      "CC_DIFFERENCE_QUOTIENT_SCALING",
      "CC_TRIGONOMETRIC_IDENTITY"
    ],
    "conditionKeys": [
      "COND_RESTRICTED_INTERVAL"
    ],
    "integrationPattern": "SEQUENTIAL"
  }
];
