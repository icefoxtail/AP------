window.examTitle = "미적분II_250_역함수와치환적분법_고2_유형은행1";

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
    "content": "실수 전체의 집합에서 미분가능한 두 함수 $f(x)$, $g(x)$가 있다. $g(x)$가 $f(x)$의 역함수이고 $g(2)=1$, $g(6)=3$일 때, $\\int_{1}^{3} \\frac{72}{g'(f(x))\\{f(x)\\}^3} dx$의 값은?",
    "choices": [
      "8",
      "10",
      "12",
      "14",
      "16"
    ],
    "answer": "①",
    "solution": "[역함수의 미분법] $g(x)$가 $f(x)$의 역함수이므로 $g(f(x))=x$이고, 양변을 $x$에 대하여 미분하면 $g'(f(x))f'(x)=1$이다.\n[식 변형] 따라서 $\\frac{1}{g'(f(x))}=f'(x)$이다.\n[피적분함수 정리] 이를 대입하면 $\\int_{1}^{3}\\frac{72}{g'(f(x))\\{f(x)\\}^3}dx=\\int_{1}^{3}\\frac{72f'(x)}{\\{f(x)\\}^3}dx$이다.\n[치환적분법] $t=f(x)$로 놓으면 $dt=f'(x)dx$이다.\n[적분구간 변환] $g(2)=1$에서 $f(1)=2$이고, $g(6)=3$에서 $f(3)=6$이므로 $x=1$일 때 $t=2$, $x=3$일 때 $t=6$이다.\n[정적분 계산] $\\int_{2}^{6}72t^{-3}dt=\\left[-\\frac{36}{t^2}\\right]_{2}^{6}$이다.\n[함숫값 대입] $\\left(-\\frac{36}{6^2}\\right)-\\left(-\\frac{36}{2^2}\\right)=-1-(-9)=8$이다.\n따라서 정답은 ①이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B45",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-098",
    "problemTypeKey": "PT_CALCULUS_SUBSTITUTION_INTEGRAL",
    "templateKey": "TPL_CALCULUS_SUBSTITUTION_DEFINITE",
    "crossConceptKeys": [],
    "conditionKeys": [
      "COND_FUNCTION_VALUE_CONSTRAINT"
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
    "content": "함수 $f(x)=\\sin x \\left(-\\frac{\\pi}{2} \\le x \\le \\frac{\\pi}{2}\\right)$의 역함수를 $g(x)$라 할 때, $\\int_{0}^{\\frac{\\sqrt{3}}{2}} \\frac{1}{g'(x)} dx$의 값은?",
    "choices": [
      "$\\frac{\\pi}{6} + \\frac{\\sqrt{3}}{10}$",
      "$\\frac{\\pi}{6} + \\frac{\\sqrt{3}}{8}$",
      "$\\frac{\\pi}{6} + \\frac{\\sqrt{3}}{6}$",
      "$\\frac{\\pi}{6} + \\frac{\\sqrt{3}}{4}$",
      "$\\frac{\\pi}{6} + \\frac{\\sqrt{3}}{2}$"
    ],
    "answer": "②",
    "solution": "[역함수의 미분법] $f(g(x))=x$의 양변을 미분하면 $f'(g(x))g'(x)=1$이므로 $\\frac{1}{g'(x)}=f'(g(x))$이다.\n[도함수 대입] $f(x)=\\sin x$에서 $f'(x)=\\cos x$이므로 $\\frac{1}{g'(x)}=\\cos(g(x))$이다.\n[치환적분법] $x=\\sin t\\left(-\\frac{\\pi}{2}\\le t\\le\\frac{\\pi}{2}\\right)$로 놓으면 $dx=\\cos t\\,dt$이고 $g(x)=t$이다.\n[적분구간 변환] $x=0$일 때 $t=0$이고, $x=\\frac{\\sqrt{3}}{2}$일 때 $t=\\frac{\\pi}{3}$이다.\n[피적분식 변형] $\\int_{0}^{\\frac{\\sqrt{3}}{2}}\\frac{1}{g'(x)}dx=\\int_{0}^{\\frac{\\pi}{3}}\\cos t\\cdot\\cos t\\,dt=\\int_{0}^{\\frac{\\pi}{3}}\\cos^2t\\,dt$이다.\n[반각 공식] $\\cos^2t=\\frac{1+\\cos2t}{2}$를 적용하면 $\\int_{0}^{\\frac{\\pi}{3}}\\frac{1+\\cos2t}{2}dt$이다.\n[부정적분 계산] $\\left[\\frac{t}{2}+\\frac{\\sin2t}{4}\\right]_{0}^{\\frac{\\pi}{3}}$이다.\n[함숫값 대입] $\\frac{\\pi}{6}+\\frac{\\sin\\frac{2\\pi}{3}}{4}-0=\\frac{\\pi}{6}+\\frac{\\frac{\\sqrt{3}}{2}}{4}=\\frac{\\pi}{6}+\\frac{\\sqrt{3}}{8}$이다.\n주의: $\\frac{1}{g'(x)}$는 $g'(x)$의 역수가 아니라 $f'(g(x))$임에 유의한다.\n따라서 정답은 ②이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-098",
    "problemTypeKey": "PT_CALCULUS_SUBSTITUTION_INTEGRAL",
    "templateKey": "TPL_CALCULUS_SUBSTITUTION_DEFINITE",
    "crossConceptKeys": [
      "CC_TRIGONOMETRIC_IDENTITY"
    ],
    "conditionKeys": [
      "COND_RESTRICTED_INTERVAL"
    ],
    "integrationPattern": "REINTERPRETATION"
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
    "content": "$-\\frac{\\pi}{2} < x < \\frac{\\pi}{2}$에서 정의된 함수 $f(x)$와 $f(x)$의 도함수 $f'(x)$가 $f(0)=0, f'(x) = 1+\\{f(x)\\}^2$을 만족시킨다. 함수 $f(x)$의 역함수를 $g(x)$라 할 때, $g'(\\sqrt{3})g(\\sqrt{3})$의 값은?",
    "choices": [
      "$\\frac{\\pi}{16}$",
      "$\\frac{\\pi}{12}$",
      "$\\frac{\\pi}{8}$",
      "$\\frac{\\pi}{6}$",
      "$\\frac{\\pi}{4}$"
    ],
    "answer": "②",
    "solution": "[도함수 관계식 변형] $f'(x)=1+\\{f(x)\\}^2$의 양변을 $1+\\{f(x)\\}^2$으로 나누면 $\\frac{f'(x)}{1+\\{f(x)\\}^2}=1$이다.\n[역함수의 정의] $g(\\sqrt{3})=a$라 하면 $f(a)=\\sqrt{3}$이다.\n[정적분] 양변을 $0$부터 $a$까지 정적분하면 $\\int_{0}^{a}\\frac{f'(x)}{1+\\{f(x)\\}^2}dx=a$이다.\n[치환적분법] $u=f(x)$로 놓으면 $du=f'(x)dx$이고, $x=0$일 때 $u=0$, $x=a$일 때 $u=\\sqrt{3}$이다.\n[적분식 변환] 따라서 $\\int_{0}^{\\sqrt{3}}\\frac{1}{1+u^2}du=a$이다.\n[삼각치환법] $u=\\tan\\theta\\left(-\\frac{\\pi}{2}<\\theta<\\frac{\\pi}{2}\\right)$로 놓으면 $du=\\sec^2\\theta\\,d\\theta$이고, $u=0$일 때 $\\theta=0$, $u=\\sqrt{3}$일 때 $\\theta=\\frac{\\pi}{3}$이다.\n[$g(\\sqrt{3})$ 계산] $a=\\int_{0}^{\\frac{\\pi}{3}}\\frac{\\sec^2\\theta}{1+\\tan^2\\theta}d\\theta=\\int_{0}^{\\frac{\\pi}{3}}1\\,d\\theta=\\frac{\\pi}{3}$이므로 $g(\\sqrt{3})=\\frac{\\pi}{3}$이다.\n[역함수의 미분법] $g'(\\sqrt{3})=\\frac{1}{f'(g(\\sqrt{3}))}=\\frac{1}{f'\\left(\\frac{\\pi}{3}\\right)}$이다.\n[$f'$ 계산] $f'\\left(\\frac{\\pi}{3}\\right)=1+\\left\\{f\\left(\\frac{\\pi}{3}\\right)\\right\\}^2=1+(\\sqrt{3})^2=4$이다.\n[$g'$ 계산] 따라서 $g'(\\sqrt{3})=\\frac{1}{4}$이다.\n[최종 계산] $g'(\\sqrt{3})g(\\sqrt{3})=\\frac{1}{4}\\times\\frac{\\pi}{3}=\\frac{\\pi}{12}$이다.\n따라서 정답은 ②이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-098",
    "problemTypeKey": "PT_CALCULUS_SUBSTITUTION_INTEGRAL",
    "templateKey": "TPL_CALCULUS_SUBSTITUTION_DEFINITE",
    "crossConceptKeys": [
      "CC_TANGENT_DEFINITION",
      "CC_DERIVATIVE_VALUE_EVALUATION"
    ],
    "conditionKeys": [
      "COND_RESTRICTED_INTERVAL"
    ],
    "integrationPattern": "SEQUENTIAL"
  }
];
