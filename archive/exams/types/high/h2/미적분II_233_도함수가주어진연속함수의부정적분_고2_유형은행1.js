window.examTitle = "미적분II_233_도함수가주어진연속함수의부정적분_고2_유형은행1";

window.questionBank = [
  {
    "id": 1,
    "category": "여러 가지 적분법",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-07",
    "standardUnit": "여러 가지 적분법",
    "standardUnitOrder": 7,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "여러 가지 적분법"
    ],
    "wide": false,
    "content": "실수 전체의 집합에서 연속인 함수 $f(x)$의 도함수 $f'(x)$가\n$$f'(x) = \\begin{cases} 3x^2 + 2x - 1 & (x < 1) \\\\ 4e^{2x-2} & (x > 1) \\end{cases}$$\n이고 $f(2) = 2e^2 + 5$일 때, $f(-1)$의 값은?",
    "choices": [
      "5",
      "7",
      "9",
      "11",
      "13"
    ],
    "answer": "②",
    "solution": "연속 조건을 사용하기 위해 각 구간의 부정적분을 먼저 구한다.\n$x>1$에서 지수함수의 부정적분을 이용하면 $f(x)=\\int 4e^{2x-2}\\,dx=2e^{2x-2}+C_2$이다.\n조건 $f(2)=2e^2+5$를 대입하면 $f(2)=2e^{2}+C_2=2e^2+5$이므로 $C_2=5$이다.\n따라서 $x>1$에서 $f(x)=2e^{2x-2}+5$이고, 연속 조건을 위해 우극한을 구하면 $\\lim_{x\\to1+}f(x)=2e^0+5=7$이다.\n$x<1$에서 다항함수의 부정적분을 이용하면 $f(x)=\\int(3x^2+2x-1)\\,dx=x^3+x^2-x+C_1$이다.\n$x=1$에서 연속이므로 좌극한과 우극한이 같아야 한다: $\\lim_{x\\to1-}f(x)=\\lim_{x\\to1+}f(x)$.\n좌극한을 계산하면 $\\lim_{x\\to1-}f(x)=1^3+1^2-1+C_1=1+C_1$이고 우극한은 $7$이므로 $1+C_1=7$, 즉 $C_1=6$이다.\n구하는 값은 $x=-1<1$이므로 $x<1$에서의 함수식에 대입해야 한다.\n대입하여 계산하면 $f(-1)=(-1)^3+(-1)^2-(-1)+6=-1+1+1+6=7$이다.\n주의: $f(1)$의 값 하나만으로는 $C_1$을 정할 수 없고, 좌극한과 우극한이 같다는 연속 조건을 모두 사용해야 한다.\n따라서 정답은 ②이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-097",
    "problemTypeKey": "PT_CALCULUS_SUBSTITUTION_INTEGRAL",
    "templateKey": "TPL_CALCULUS_SUBSTITUTION_INDEFINITE",
    "crossConceptKeys": [
      "CC_FUNCTION_CONTINUITY",
      "CC_PIECEWISE_FUNCTION"
    ],
    "conditionKeys": [
      "COND_PIECEWISE_DOMAIN_PARTITION"
    ],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 2,
    "category": "여러 가지 적분법",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-07",
    "standardUnit": "여러 가지 적분법",
    "standardUnitOrder": 7,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "여러 가지 적분법"
    ],
    "wide": false,
    "content": "함수 $f(x)$가 $x=0$에서 연속이고, $x \\ne 0$인 모든 실수에서 도함수 $f'(x)$가\n$$f'(x) = \\begin{cases} 2\\cos^2 x & (x > 0) \\\\ 4e^{2x} & (x < 0) \\end{cases}$$\n이다. $f\\left(\\frac{\\pi}{4}\\right) = \\frac{\\pi}{4} + 2$일 때, $f(0) + f\\left(-\\frac{1}{2}\\ln 2\\right)$의 값은?",
    "choices": [
      "$0$",
      "$\\frac{1}{2}$",
      "$1$",
      "$\\frac{3}{2}$",
      "$2$"
    ],
    "answer": "⑤",
    "solution": "$x>0$에서 반각공식 $2\\cos^2x=1+\\cos2x$를 이용하여 부정적분을 구한다.\n$f(x)=\\int(1+\\cos2x)\\,dx=x+\\frac12\\sin2x+C_1$이다.\n조건 $f\\left(\\frac\\pi4\\right)=\\frac\\pi4+2$를 대입하면 $\\frac\\pi4+\\frac12\\sin\\frac\\pi2+C_1=\\frac\\pi4+\\frac12+C_1=\\frac\\pi4+2$이다.\n따라서 $C_1=\\frac32$이고, 연속 조건에 의해 $f(0)=\\lim_{x\\to0+}f(x)=0+0+\\frac32=\\frac32$이다.\n$x<0$에서 지수함수의 부정적분을 이용하면 $f(x)=\\int4e^{2x}\\,dx=2e^{2x}+C_2$이다.\n$x=0$에서 연속이므로 좌극한과 함숫값이 같다: $\\lim_{x\\to0-}f(x)=f(0)$.\n좌극한을 계산하여 $C_2$를 구하면 $2e^0+C_2=2+C_2=\\frac32$이므로 $C_2=-\\frac12$이다.\n$e^{2\\left(-\\frac12\\ln2\\right)}=e^{-\\ln2}=\\frac12$임을 이용하여 함숫값을 계산한다.\n$-\\frac12\\ln2<0$이므로 $x<0$에서의 식에 대입하면 $f\\left(-\\frac12\\ln2\\right)=2\\cdot\\frac12-\\frac12=\\frac12$이다.\n구하는 합을 계산하면 $f(0)+f\\left(-\\frac12\\ln2\\right)=\\frac32+\\frac12=2$이다.\n주의: $f(0)$은 $x>0$ 쪽 식의 우극한으로 구하고, $x<0$ 쪽 적분상수는 연속 조건으로 따로 정해야 한다.\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-097",
    "problemTypeKey": "PT_CALCULUS_SUBSTITUTION_INTEGRAL",
    "templateKey": "TPL_CALCULUS_SUBSTITUTION_INDEFINITE",
    "crossConceptKeys": [
      "CC_FUNCTION_CONTINUITY",
      "CC_TRIGONOMETRIC_IDENTITY"
    ],
    "conditionKeys": [
      "COND_PIECEWISE_DOMAIN_PARTITION"
    ],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 3,
    "category": "여러 가지 적분법",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-07",
    "standardUnit": "여러 가지 적분법",
    "standardUnitOrder": 7,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "여러 가지 적분법"
    ],
    "wide": false,
    "content": "함수 $f(x) = \\frac{\\sin x(\\sin x + 3)}{\\cos^2 x}$의 부정적분 $\\int f(x) \\, dx$는? (단, $C$는 적분상수)",
    "choices": [
      "$\\tan x - 3\\sec x - x + C$",
      "$\\tan x - 3\\sec x + x + C$",
      "$-\\tan x + 3\\sec x - x + C$",
      "$\\tan x + 3\\sec x - x + C$",
      "$\\tan x + 3\\sec x + x + C$"
    ],
    "answer": "④",
    "solution": "분자를 전개하여 분수를 두 항으로 나눈다.\n$f(x)=\\frac{\\sin^2x+3\\sin x}{\\cos^2x}=\\frac{\\sin^2x}{\\cos^2x}+3\\cdot\\frac{\\sin x}{\\cos^2x}$이다.\n$\\tan x=\\frac{\\sin x}{\\cos x}$, $\\sec x=\\frac1{\\cos x}$를 이용하면 $f(x)=\\tan^2x+3\\sec x\\tan x$이다.\n피타고라스 항등식 $1+\\tan^2x=\\sec^2x$에서 $\\tan^2x=\\sec^2x-1$로 변형한다.\n따라서 $f(x)=\\sec^2x+3\\sec x\\tan x-1$이다.\n기본 부정적분 $\\int\\sec^2x\\,dx=\\tan x$, $\\int\\sec x\\tan x\\,dx=\\sec x$를 적용한다.\n적분하면 $\\int f(x)\\,dx=\\tan x+3\\sec x-x+C$이다.\n주의: $(\\sec x)'=\\sec x\\tan x$이므로 $3\\sec x\\tan x$의 적분은 부호가 플러스인 $3\\sec x$이다.\n검산하면 $(\\tan x+3\\sec x-x+C)'=\\sec^2x+3\\sec x\\tan x-1=\\tan^2x+3\\sec x\\tan x=f(x)$이다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-097",
    "problemTypeKey": "PT_CALCULUS_SUBSTITUTION_INTEGRAL",
    "templateKey": "TPL_CALCULUS_SUBSTITUTION_INDEFINITE",
    "crossConceptKeys": [
      "CC_TRIGONOMETRIC_IDENTITY"
    ],
    "conditionKeys": [],
    "integrationPattern": "NONE"
  }
];
