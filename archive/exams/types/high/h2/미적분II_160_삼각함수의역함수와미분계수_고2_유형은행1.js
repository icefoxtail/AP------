window.examTitle = "미적분II_160_삼각함수의역함수와미분계수_고2_유형은행1";

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
    "content": "$0\\le x\\le\\frac{\\pi}{2}$에서 $f(x)=6\\sin x-2$의 역함수를 $g$라 하자. $g'(3\\sqrt3-2)$의 값은?",
    "choices": [
      "$\\frac{1}{9}$",
      "$\\frac{2}{9}$",
      "$\\frac{1}{3}$",
      "$\\frac{4}{9}$",
      "$\\frac{5}{9}$"
    ],
    "answer": "③",
    "solution": "$f(\\frac{\\pi}{3})=6\\sin\\frac{\\pi}{3}-2=6\\cdot\\frac{\\sqrt3}{2}-2=3\\sqrt3-2$이므로 역함수의 정의에 따라 $g(3\\sqrt3-2)=\\frac{\\pi}{3}$이다.\n사인함수의 미분법으로 $f'(x)=6\\cos x$이다.\n$x=\\frac{\\pi}{3}$을 대입하면 $f'(\\frac{\\pi}{3})=6\\cos\\frac{\\pi}{3}=6\\cdot\\frac12=3$이다.\n역함수의 미분법 $g'(y)=\\frac{1}{f'(x)}$ ($y=f(x)$)에 따라 $g'(3\\sqrt3-2)=\\frac{1}{f'(\\pi/3)}=\\frac13$이다.\n주의: 도함수는 $g$의 함숫값 $3\\sqrt3-2$가 아니라 그에 대응하는 $x=\\frac{\\pi}{3}$에서 계산한다.\n따라서 정답은 ③이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-082",
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
    "content": "$f(x)=3\\cos(2x)+2$ ($0<x<\\frac\\pi2$)의 역함수를 $g$라 하자. $g'(2)$의 값은?",
    "choices": [
      "$-\\frac{5}{24}$",
      "$-\\frac{1}{6}$",
      "$-\\frac{1}{8}$",
      "$-\\frac{1}{12}$",
      "$-\\frac{1}{24}$"
    ],
    "answer": "②",
    "solution": "$x=\\frac{\\pi}{4}$에서 $f(\\frac{\\pi}{4})=3\\cos\\frac{\\pi}{2}+2=3\\cdot0+2=2$이다.\n역함수의 정의에 따라 $g(2)=\\frac{\\pi}{4}$이다.\n코사인함수와 합성함수의 미분법으로 $f'(x)=3\\cdot(-\\sin(2x))\\cdot2=-6\\sin(2x)$이다.\n$x=\\frac{\\pi}{4}$를 대입하면 $f'(\\frac{\\pi}{4})=-6\\sin\\frac{\\pi}{2}=-6\\cdot1=-6$이다.\n역함수의 미분법으로 $g'(2)=\\frac{1}{f'(\\pi/4)}=\\frac{1}{-6}=-\\frac16$이다.\n따라서 정답은 ②이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-082",
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
    "content": "$f(x)=3\\tan x-1$ ($-\\frac\\pi2<x<\\frac\\pi2$)의 역함수를 $g$라 하자. $g'(2)$의 값은?",
    "choices": [
      "$\\frac{1}{6}$",
      "$\\frac{1}{3}$",
      "$\\frac{1}{2}$",
      "$\\frac{2}{3}$",
      "$\\frac{5}{6}$"
    ],
    "answer": "①",
    "solution": "$x=\\frac{\\pi}{4}$에서 $f(\\frac{\\pi}{4})=3\\tan\\frac{\\pi}{4}-1=3\\cdot1-1=2$이다.\n역함수의 정의에 따라 $g(2)=\\frac{\\pi}{4}$이다.\n탄젠트함수의 미분법으로 $f'(x)=3\\sec^2 x$이다.\n$\\sec^2\\frac{\\pi}{4}=1+\\tan^2\\frac{\\pi}{4}=1+1=2$이므로 $f'(\\frac{\\pi}{4})=3\\cdot2=6$이다.\n역함수의 미분법으로 $g'(2)=\\frac{1}{f'(\\pi/4)}=\\frac16$이다.\n따라서 정답은 ①이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-082",
    "problemTypeKey": "PT_DERIVATIVE_RULE_EVALUATION",
    "templateKey": "TPL_DERIVATIVE_RULE_CALCULATION",
    "crossConceptKeys": [
      "CC_TRIGONOMETRIC_TANGENT",
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
    "content": "$-\\frac{3\\pi}{2}<x<\\frac{3\\pi}{2}$에서 $f(x)=\\tan(\\frac x3)$의 역함수를 $g$라 하자. $g'(-1)$의 값은?",
    "choices": [
      "$\\frac{3}{4}$",
      "$1$",
      "$\\frac{5}{4}$",
      "$\\frac{3}{2}$",
      "$\\frac{7}{4}$"
    ],
    "answer": "④",
    "solution": "$\\tan(-\\frac{\\pi}{4})=-1$이므로 $x=-\\frac{3\\pi}{4}$에서 $f(-\\frac{3\\pi}{4})=\\tan(-\\frac{\\pi}{4})=-1$이다.\n역함수의 정의에 따라 $g(-1)=-\\frac{3\\pi}{4}$이다.\n탄젠트함수와 합성함수의 미분법으로 $f'(x)=\\sec^2(\\frac{x}{3})\\cdot\\frac13=\\frac13\\sec^2(\\frac{x}{3})$이다.\n$x=-\\frac{3\\pi}{4}$를 대입하면 $\\frac{x}{3}=-\\frac{\\pi}{4}$이고 $\\sec^2(-\\frac{\\pi}{4})=1+\\tan^2(-\\frac{\\pi}{4})=1+1=2$이다.\n따라서 $f'(-\\frac{3\\pi}{4})=\\frac13\\cdot2=\\frac23$이다.\n역함수의 미분법으로 $g'(-1)=\\frac{1}{f'(-3\\pi/4)}=\\frac{1}{2/3}=\\frac32$이다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-082",
    "problemTypeKey": "PT_DERIVATIVE_RULE_EVALUATION",
    "templateKey": "TPL_DERIVATIVE_RULE_CALCULATION",
    "crossConceptKeys": [
      "CC_TRIGONOMETRIC_TANGENT",
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
    "content": "$f(x)=6x+\\sin x$의 역함수 $g$의 그래프 위 점 $(6\\pi,\\pi)$에서 접선의 기울기가 기약분수 $\\frac qp$이다. 양의 정수 $p,q$의 합은?",
    "choices": [
      "$2$",
      "$3$",
      "$4$",
      "$5$",
      "$6$"
    ],
    "answer": "⑤",
    "solution": "$f(\\pi)=6\\pi+\\sin\\pi=6\\pi+0=6\\pi$임을 확인한다.\n역함수의 정의에 따라 $g(6\\pi)=\\pi$이다.\n사인함수의 미분법으로 $f'(x)=6+\\cos x$이다.\n$x=\\pi$를 대입하면 $f'(\\pi)=6+\\cos\\pi=6+(-1)=5$이다.\n역함수의 미분법으로 $g'(6\\pi)=\\frac{1}{f'(\\pi)}=\\frac15$이다.\n기약분수 $\\frac{q}{p}=\\frac15$에서 $p=5,\\ q=1$이므로 $p+q=5+1=6$이다.\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B12",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-082",
    "problemTypeKey": "PT_DERIVATIVE_RULE_EVALUATION",
    "templateKey": "TPL_DERIVATIVE_RULE_CALCULATION",
    "crossConceptKeys": [
      "CC_TANGENT_LINE_SLOPE_AT_POINT",
      "CC_DERIVATIVE_VALUE_EVALUATION"
    ],
    "conditionKeys": [
      "COND_NATURAL_NUMBER"
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
    "content": "$f(x)=\\cos^2(2x)$ ($0<x<\\frac\\pi4$)의 역함수를 $g$라 하자. $\\lim_{h\\to0}\\frac{g(\\frac12+3h)-g(\\frac12-2h)}h$의 값은?",
    "choices": [
      "$-4$",
      "$-\\frac{7}{2}$",
      "$-3$",
      "$-\\frac{5}{2}$",
      "$-2$"
    ],
    "answer": "④",
    "solution": "$x=\\frac{\\pi}{8}$에서 $f(\\frac{\\pi}{8})=\\cos^2\\frac{\\pi}{4}=(\\frac{\\sqrt2}{2})^2=\\frac12$이다.\n역함수의 정의에 따라 $g(\\frac12)=\\frac{\\pi}{8}$이다.\n합성함수의 미분법으로 $f'(x)=2\\cos(2x)\\cdot(-\\sin(2x))\\cdot2=-4\\cos(2x)\\sin(2x)$이다.\n$x=\\frac{\\pi}{8}$을 대입하면 $\\cos\\frac{\\pi}{4}=\\sin\\frac{\\pi}{4}=\\frac{\\sqrt2}{2}$이므로 $f'(\\frac{\\pi}{8})=-4\\cdot\\frac{\\sqrt2}{2}\\cdot\\frac{\\sqrt2}{2}=-4\\cdot\\frac12=-2$이다.\n역함수의 미분법으로 $g'(\\frac12)=\\frac{1}{f'(\\pi/8)}=-\\frac12$이다.\n$a=\\frac12$라 두고 분자에 $g(a)$를 더하고 빼면 $g(a+3h)-g(a-2h)=\\{g(a+3h)-g(a)\\}+\\{g(a)-g(a-2h)\\}$이다.\n각 항을 $h$로 나누면 $\\frac{g(a+3h)-g(a)}{h}+\\frac{g(a)-g(a-2h)}{h}=3\\cdot\\frac{g(a+3h)-g(a)}{3h}+2\\cdot\\frac{g(a)-g(a-2h)}{2h}$이다.\n$h\\to0$일 때 미분계수의 정의에 따라 첫 항은 $3g'(a)$, 둘째 항은 $2g'(a)$에 수렴한다.\n따라서 극한값은 $3g'(a)+2g'(a)=5g'(a)=5\\cdot(-\\frac12)=-\\frac52$이다.\n따라서 정답은 ④이다.",
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
