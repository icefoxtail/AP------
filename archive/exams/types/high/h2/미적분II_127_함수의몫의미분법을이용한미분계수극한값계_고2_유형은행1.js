window.examTitle = "미적분II_127_함수의몫의미분법을이용한미분계수극한값계_고2_유형은행1";

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
    "content": "$f(x)=3x/(x^2+2)$일 때 $\\lim_{x\\to1}[f(x^3)-f(1)]/(x-1)$의 값은?",
    "choices": [
      "$0$",
      "$1$",
      "$2$",
      "$3$",
      "$4$"
    ],
    "answer": "②",
    "solution": "합성함수의 미분법을 쓰기 위해 $g(x)=f(x^3)$라 하면 $g'(x)=f'(x^3)\\cdot 3x^2$이다.\n몫의 미분법으로 $f'(x)=\\frac{3(x^2+2)-3x\\cdot 2x}{(x^2+2)^2}=\\frac{6-3x^2}{(x^2+2)^2}$이다.\n$f'(1)=\\frac{6-3}{3^2}=\\frac13$이다.\n$g'(1)=f'(1)\\cdot 3=\\frac13\\cdot 3=1$이다.\n$\\lim_{x\\to1}\\frac{f(x^3)-f(1)}{x-1}=g'(1)=1$이다.\n따라서 정답은 ②이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-078",
    "problemTypeKey": "PT_DERIVATIVE_RULE_EVALUATION",
    "templateKey": "TPL_DERIVATIVE_RULE_CALCULATION",
    "crossConceptKeys": [
      "CC_DERIVATIVE_DEFINITION_LIMIT"
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
    "content": "$f(x)=(x-2)/(x^2+4)$일 때 $\\lim_{h\\to0}[f(2+5h)-f(2-3h)]/h$의 값은?",
    "choices": [
      "$0$",
      "$1$",
      "$2$",
      "$3$",
      "$4$"
    ],
    "answer": "②",
    "solution": "$f(2)=\\frac{2-2}{2^2+4}=0$이다.\n$f'(x)=\\frac{(x^2+4)-(x-2)\\cdot 2x}{(x^2+4)^2}=\\frac{-x^2+4x+4}{(x^2+4)^2}$이다.\n$f'(2)=\\frac{-4+8+4}{8^2}=\\frac{8}{64}=\\frac18$이다.\n$\\frac{f(2+5h)-f(2-3h)}h=5\\frac{f(2+5h)-f(2)}{5h}+3\\frac{f(2-3h)-f(2)}{-3h}$이다.\n극한을 취하면 $5f'(2)+3f'(2)=8\\cdot\\frac18=1$이다.\n따라서 정답은 ②이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-078",
    "problemTypeKey": "PT_DERIVATIVE_RULE_EVALUATION",
    "templateKey": "TPL_DERIVATIVE_RULE_CALCULATION",
    "crossConceptKeys": [
      "CC_DERIVATIVE_DEFINITION_LIMIT",
      "CC_DIFFERENCE_QUOTIENT_SCALING"
    ],
    "conditionKeys": [],
    "integrationPattern": "REINTERPRETATION"
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
    "content": "$f(x)=(x^3+4x+1)/x^2$일 때 $\\lim_{h\\to0}[f(-1+2h)-f(-1-h)]/h$의 값은?",
    "choices": [
      "$-3$",
      "$-2$",
      "$-1$",
      "$0$",
      "$1$"
    ],
    "answer": "①",
    "solution": "$f(x)=\\frac{x^3+4x+1}{x^2}=x+\\frac4x+\\frac1{x^2}$로 정리한다.\n$f'(x)=1-\\frac4{x^2}-\\frac2{x^3}$이다.\n$f'(-1)=1-\\frac4{1}-\\frac2{-1}=1-4+2=-1$이다.\n$\\frac{f(-1+2h)-f(-1-h)}h=2\\frac{f(-1+2h)-f(-1)}{2h}+\\frac{f(-1-h)-f(-1)}{-h}$이다.\n극한을 취하면 $2f'(-1)+f'(-1)=3(-1)=-3$이다.\n따라서 정답은 ①이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-078",
    "problemTypeKey": "PT_DERIVATIVE_RULE_EVALUATION",
    "templateKey": "TPL_DERIVATIVE_RULE_CALCULATION",
    "crossConceptKeys": [
      "CC_DERIVATIVE_DEFINITION_LIMIT",
      "CC_DIFFERENCE_QUOTIENT_SCALING"
    ],
    "conditionKeys": [],
    "integrationPattern": "REINTERPRETATION"
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
    "content": "$f(x)=5x-8/x$일 때 $\\lim_{n\\to\\infty}n[f(2+3/n)-f(2-1/n)]$의 값은?",
    "choices": [
      "$20$",
      "$24$",
      "$28$",
      "$32$",
      "$36$"
    ],
    "answer": "③",
    "solution": "$h=\\frac1n$이라 하면 $n\\to\\infty$일 때 $h\\to0^+$이다.\n$n\\left[f\\left(2+\\frac3n\\right)-f\\left(2-\\frac1n\\right)\\right]=\\frac{f(2+3h)-f(2-h)}h$이다.\n$f(x)=5x-\\frac8x$에서 $f'(x)=5+\\frac8{x^2}$이다.\n$f'(2)=5+\\frac84=7$이다.\n$\\frac{f(2+3h)-f(2-h)}h=3\\frac{f(2+3h)-f(2)}{3h}+\\frac{f(2-h)-f(2)}{-h}$이다.\n극한을 취하면 $3f'(2)+f'(2)=4\\cdot 7=28$이다.\n따라서 정답은 ③이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-078",
    "problemTypeKey": "PT_DERIVATIVE_RULE_EVALUATION",
    "templateKey": "TPL_DERIVATIVE_RULE_CALCULATION",
    "crossConceptKeys": [
      "CC_DERIVATIVE_DEFINITION_LIMIT",
      "CC_DIFFERENCE_QUOTIENT_SCALING"
    ],
    "conditionKeys": [],
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
    "content": "$f(x)=(2x-3)/(x^2+2)$일 때 $\\lim_{n\\to\\infty}n[f(4/n)-f(-3/n)]$의 값은?",
    "choices": [
      "$3$",
      "$4$",
      "$5$",
      "$6$",
      "$7$"
    ],
    "answer": "⑤",
    "solution": "$h=\\frac1n$이라 하면 $n\\to\\infty$일 때 $h\\to0$이다.\n$n\\left[f\\left(\\frac4n\\right)-f\\left(-\\frac3n\\right)\\right]=\\frac{f(4h)-f(-3h)}h$이다.\n$f'(x)=\\frac{2(x^2+2)-(2x-3)\\cdot 2x}{(x^2+2)^2}=\\frac{-2x^2+6x+4}{(x^2+2)^2}$이다.\n$f'(0)=\\frac4{2^2}=1$이다.\n$\\frac{f(4h)-f(-3h)}h=4\\frac{f(4h)-f(0)}{4h}+3\\frac{f(-3h)-f(0)}{-3h}$이다.\n극한을 취하면 $4f'(0)+3f'(0)=7\\cdot 1=7$이다.\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-078",
    "problemTypeKey": "PT_DERIVATIVE_RULE_EVALUATION",
    "templateKey": "TPL_DERIVATIVE_RULE_CALCULATION",
    "crossConceptKeys": [
      "CC_DERIVATIVE_DEFINITION_LIMIT",
      "CC_DIFFERENCE_QUOTIENT_SCALING"
    ],
    "conditionKeys": [],
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
    "content": "미분가능한 $f,g$가 $\\lim_{x\\to2}(f(x)-3)/(x-2)=4,\\ \\lim_{x\\to2}(g(x)-2)/(x-2)=-2$를 만족한다. $(f/g)'(2)$의 값은?",
    "choices": [
      "$\\frac32$",
      "$\\frac52$",
      "$\\frac72$",
      "$\\frac92$",
      "$\\frac{11}2$"
    ],
    "answer": "③",
    "solution": "$f$가 미분가능하여 연속이므로 $\\lim_{x\\to2}(f(x)-3)=0$에서 $f(2)=3$이다.\n같은 이유로 $\\lim_{x\\to2}(g(x)-2)=0$에서 $g(2)=2$이다.\n주어진 극한은 미분계수의 정의이므로 $f'(2)=4$, $g'(2)=-2$이다.\n몫의 미분법으로 $\\left(\\frac fg\\right)'(2)=\\frac{f'(2)g(2)-f(2)g'(2)}{\\{g(2)\\}^2}$이다.\n대입하면 $\\frac{4\\cdot 2-3\\cdot(-2)}{2^2}=\\frac{8+6}{4}=\\frac{14}{4}=\\frac72$이다.\n따라서 정답은 ③이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-078",
    "problemTypeKey": "PT_DERIVATIVE_RULE_EVALUATION",
    "templateKey": "TPL_DERIVATIVE_RULE_CALCULATION",
    "crossConceptKeys": [
      "CC_DERIVATIVE_DEFINITION_LIMIT"
    ],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
  }
];
