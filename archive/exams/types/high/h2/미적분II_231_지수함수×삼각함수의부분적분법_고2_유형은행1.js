window.examTitle = "미적분II_231_지수함수×삼각함수의부분적분법_고2_유형은행1";

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
    "content": "함수 $F(x) = \\int e^x \\cos 2x \\, dx$에 대하여 $F(0) = \\frac{6}{5}$일 때, $F(\\pi)$의 값은?",
    "choices": [
      "$-\\frac{1}{5}e^{\\pi} - 1$",
      "$-\\frac{1}{5}e^{\\pi} + 1$",
      "$\\frac{1}{10}e^{\\pi} + 1$",
      "$\\frac{1}{5}e^{\\pi} + 1$",
      "$\\frac{1}{5}e^{\\pi} + 2$"
    ],
    "answer": "④",
    "solution": "$I=\\int e^x\\cos 2x\\,dx$로 놓는다.\n[부분적분법] $u=\\cos 2x$, $v'=e^x$로 놓으면 $u'=-2\\sin 2x$, $v=e^x$이므로 $I=e^x\\cos 2x-\\int(-2\\sin 2x)e^x\\,dx=e^x\\cos 2x+2\\int e^x\\sin 2x\\,dx$.\n[부분적분법 한 번 더] $\\int e^x\\sin 2x\\,dx$에서 $u=\\sin 2x$, $v'=e^x$로 놓으면 $u'=2\\cos 2x$, $v=e^x$이므로 $\\int e^x\\sin 2x\\,dx=e^x\\sin 2x-2I$.\n대입하면 $I=e^x\\cos 2x+2(e^x\\sin 2x-2I)=e^x(\\cos 2x+2\\sin 2x)-4I$.\n$5I=e^x(\\cos 2x+2\\sin 2x)$이므로 $I=\\frac{e^x}{5}(\\cos 2x+2\\sin 2x)+C$ (단, $C$는 적분상수).\n$F(x)=\\frac{e^x}{5}(\\cos 2x+2\\sin 2x)+C$에서 $F(0)=\\frac{1}{5}(1+0)+C=\\frac{1}{5}+C=\\frac{6}{5}$이므로 $C=1$.\n$F(\\pi)=\\frac{e^\\pi}{5}(\\cos 2\\pi+2\\sin 2\\pi)+1=\\frac{e^\\pi}{5}(1+0)+1=\\frac{1}{5}e^\\pi+1$.\n주의: $\\cos 2x$를 미분할 때 합성함수의 미분법에 의해 $2$가 곱해져 $-2\\sin 2x$가 된다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-100",
    "problemTypeKey": "PT_CALCULUS_INTEGRATION_BY_PARTS",
    "templateKey": "TPL_CALCULUS_PARTS_CYCLIC",
    "crossConceptKeys": [
      "CC_INDEFINITE_INTEGRAL"
    ],
    "conditionKeys": [
      "COND_FUNCTION_VALUE_CONSTRAINT"
    ],
    "integrationPattern": "INTERDEPENDENT"
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
    "content": "등식 $\\int e^{3x} \\sin x \\, dx = e^{3x}(a \\sin x + b \\cos x) + C$가 성립할 때, 상수 $a, b$에 대하여 $a+b$의 값은? (단, $C$는 적분상수이다.)",
    "choices": [
      "$\\frac{1}{5}$",
      "$\\frac{3}{10}$",
      "$\\frac{2}{5}$",
      "$\\frac{1}{2}$",
      "$\\frac{3}{5}$"
    ],
    "answer": "①",
    "solution": "$I=\\int e^{3x}\\sin x\\,dx$로 놓는다.\n[부분적분법] $u=\\sin x$, $v'=e^{3x}$로 놓으면 $u'=\\cos x$, $v=\\frac{1}{3}e^{3x}$이므로 $I=\\frac{1}{3}e^{3x}\\sin x-\\frac{1}{3}\\int e^{3x}\\cos x\\,dx$.\n[부분적분법 한 번 더] $\\int e^{3x}\\cos x\\,dx$에서 $u=\\cos x$, $v'=e^{3x}$로 놓으면 $u'=-\\sin x$, $v=\\frac{1}{3}e^{3x}$이므로 $\\int e^{3x}\\cos x\\,dx=\\frac{1}{3}e^{3x}\\cos x+\\frac{1}{3}I$.\n대입하면 $I=\\frac{1}{3}e^{3x}\\sin x-\\frac{1}{3}\\left(\\frac{1}{3}e^{3x}\\cos x+\\frac{1}{3}I\\right)=\\frac{1}{3}e^{3x}\\sin x-\\frac{1}{9}e^{3x}\\cos x-\\frac{1}{9}I$.\n$\\frac{10}{9}I=\\frac{1}{9}e^{3x}(3\\sin x-\\cos x)$이므로 $I=\\frac{e^{3x}}{10}(3\\sin x-\\cos x)+C$.\n주어진 등식과 계수를 비교하면 $a=\\frac{3}{10}$, $b=-\\frac{1}{10}$.\n$a+b=\\frac{3}{10}+\\left(-\\frac{1}{10}\\right)=\\frac{2}{10}=\\frac{1}{5}$.\n따라서 정답은 ①이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-100",
    "problemTypeKey": "PT_CALCULUS_INTEGRATION_BY_PARTS",
    "templateKey": "TPL_CALCULUS_PARTS_CYCLIC",
    "crossConceptKeys": [
      "CC_INDEFINITE_INTEGRAL"
    ],
    "conditionKeys": [],
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
    "content": "미분가능한 함수 $f(x)$의 도함수 $f'(x)$가\n$$f'(x) = (\\sin x + \\cos x)e^{-x}, \\quad f(0) = 1$$\n을 만족할 때, $f\\left(\\frac{\\pi}{3}\\right)$의 값은?",
    "choices": [
      "$-e^{-\\frac{\\pi}{3}}$",
      "$-\\frac{1}{2}e^{-\\frac{\\pi}{3}}$",
      "$-\\frac{1}{2}e^{-\\frac{\\pi}{3}} + 1$",
      "$\\frac{1}{2}e^{-\\frac{\\pi}{3}} + 1$",
      "$-\\frac{1}{2}e^{-\\frac{\\pi}{3}} + 2$"
    ],
    "answer": "⑤",
    "solution": "도함수의 정의에 의해 $f(x)=\\int(\\sin x+\\cos x)e^{-x}\\,dx$이다.\n$e^{-x}\\cos x$를 미분하면 $e^{-x}(-\\cos x-\\sin x)=-(\\sin x+\\cos x)e^{-x}$이므로, 부분적분법의 결과 $\\int(\\sin x+\\cos x)e^{-x}\\,dx=-e^{-x}\\cos x+C$이다.\n따라서 $f(x)=-e^{-x}\\cos x+C$ (단, $C$는 적분상수).\n$f(0)=-e^0\\cos 0+C=-1+C=1$이므로 $C=2$.\n함수식은 $f(x)=-e^{-x}\\cos x+2$.\n$f\\left(\\frac{\\pi}{3}\\right)=-e^{-\\frac{\\pi}{3}}\\cos\\frac{\\pi}{3}+2=-\\frac{1}{2}e^{-\\frac{\\pi}{3}}+2$.\n주의: $e^{-x}$의 적분이 $-e^{-x}$이므로 부호 처리를 확인한다.\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-100",
    "problemTypeKey": "PT_CALCULUS_INTEGRATION_BY_PARTS",
    "templateKey": "TPL_CALCULUS_PARTS_CYCLIC",
    "crossConceptKeys": [
      "CC_INDEFINITE_INTEGRAL"
    ],
    "conditionKeys": [
      "COND_FUNCTION_VALUE_CONSTRAINT"
    ],
    "integrationPattern": "SEQUENTIAL"
  }
];
