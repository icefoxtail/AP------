window.examTitle = "미적분II_230_다항함수×삼각함수의부분적분법_고2_유형은행1";

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
    "content": "함수 $f(x)$에 대하여\n$$f'(x) = x \\sin x,\\quad f(0) = -2$$\n일 때, $f(\\pi)$의 값은?",
    "choices": [
      "$-\\pi - 2$",
      "$-\\pi$",
      "$-\\pi + 2$",
      "$\\pi - 2$",
      "$\\pi + 2$"
    ],
    "answer": "④",
    "solution": "1) 도함수가 주어졌으므로 부정적분으로 $f(x)$를 복원한다.\n2) 부분적분법 $\\int uv'\\,dx = uv - \\int u'v\\,dx$에서 $u=x$, $v'=\\sin x$로 놓으면 $u'=1$, $v=-\\cos x$이다.\n3) 따라서 $\\int x\\sin x\\,dx = x(-\\cos x) - \\int 1\\cdot(-\\cos x)\\,dx = -x\\cos x + \\int\\cos x\\,dx$이다.\n4) $\\int\\cos x\\,dx = \\sin x$이므로 $f(x) = -x\\cos x + \\sin x + C$ (단, $C$는 적분상수)이다.\n5) $f(0) = -0\\cdot\\cos 0 + \\sin 0 + C = 0+0+C = C$이고 $f(0)=-2$이므로 $C=-2$이다.\n6) 즉 $f(x) = -x\\cos x + \\sin x - 2$이다.\n7) $x=\\pi$를 대입하면 $f(\\pi) = -\\pi\\cos\\pi + \\sin\\pi - 2$이다.\n8) $\\cos\\pi=-1$, $\\sin\\pi=0$이므로 $f(\\pi) = -\\pi\\cdot(-1)+0-2 = \\pi-2$이다.\n주의: $\\cos\\pi=-1$이므로 $-\\pi\\cos\\pi$는 $\\pi$로 부호가 바뀐다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-099",
    "problemTypeKey": "PT_CALCULUS_INTEGRATION_BY_PARTS",
    "templateKey": "TPL_CALCULUS_PARTS_PRODUCT",
    "crossConceptKeys": [
      "CC_INDEFINITE_INTEGRAL"
    ],
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
    "content": "함수 $f(x)$에 대하여\n$$f'(x) = x \\cos 2x,\\quad f(0) = 1$$\n일 때, $f\\left(\\dfrac{\\pi}{2}\\right)$의 값은?",
    "choices": [
      "$\\dfrac{1}{4}$",
      "$\\dfrac{1}{2}$",
      "$\\dfrac{3}{4}$",
      "$1$",
      "$\\dfrac{5}{4}$"
    ],
    "answer": "②",
    "solution": "1) $f'(x)=x\\cos 2x$이므로 부정적분으로 $f(x)$를 구한다.\n2) 부분적분법 $\\int uv'\\,dx = uv-\\int u'v\\,dx$에서 $u=x$, $v'=\\cos 2x$로 놓으면 $u'=1$, $v=\\dfrac{1}{2}\\sin 2x$이다.\n3) $\\int x\\cos 2x\\,dx = x\\cdot\\dfrac{1}{2}\\sin 2x - \\int 1\\cdot\\dfrac{1}{2}\\sin 2x\\,dx = \\dfrac{1}{2}x\\sin 2x - \\dfrac{1}{2}\\int\\sin 2x\\,dx$이다.\n4) $\\int\\sin 2x\\,dx = -\\dfrac{1}{2}\\cos 2x$이므로 $f(x) = \\dfrac{1}{2}x\\sin 2x + \\dfrac{1}{4}\\cos 2x + C$이다.\n5) $f(0) = 0 + \\dfrac{1}{4}\\cos 0 + C = \\dfrac{1}{4}+C$이고 $f(0)=1$이므로 $C = 1-\\dfrac{1}{4} = \\dfrac{3}{4}$이다.\n6) 따라서 $f(x) = \\dfrac{1}{2}x\\sin 2x + \\dfrac{1}{4}\\cos 2x + \\dfrac{3}{4}$이다.\n7) $x=\\dfrac{\\pi}{2}$를 대입하면 $f\\left(\\dfrac{\\pi}{2}\\right) = \\dfrac{1}{2}\\cdot\\dfrac{\\pi}{2}\\sin\\pi + \\dfrac{1}{4}\\cos\\pi + \\dfrac{3}{4}$이다.\n8) $\\sin\\pi=0$, $\\cos\\pi=-1$이므로 $f\\left(\\dfrac{\\pi}{2}\\right) = 0-\\dfrac{1}{4}+\\dfrac{3}{4} = \\dfrac{1}{2}$이다.\n주의: $\\int\\sin 2x\\,dx$의 계수 $\\dfrac{1}{2}$과 부호를 빠뜨리지 않는다.\n따라서 정답은 ②이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-099",
    "problemTypeKey": "PT_CALCULUS_INTEGRATION_BY_PARTS",
    "templateKey": "TPL_CALCULUS_PARTS_PRODUCT",
    "crossConceptKeys": [
      "CC_INDEFINITE_INTEGRAL"
    ],
    "conditionKeys": [
      "COND_FUNCTION_VALUE_CONSTRAINT"
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
    "content": "곡선 $y=f(x)$ 위의 임의의 점 $(x, f(x))$에서의 접선의 기울기가 $(2x - \\pi)\\cos x$이고 $f(0) = 6$일 때, $f(\\pi)$의 값은?",
    "choices": [
      "$-2$",
      "$-1$",
      "$0$",
      "$1$",
      "$2$"
    ],
    "answer": "⑤",
    "solution": "1) 접선의 기울기는 미분계수이므로 $f'(x) = (2x-\\pi)\\cos x$이다.\n2) 부분적분법 $\\int uv'\\,dx = uv-\\int u'v\\,dx$에서 $u=2x-\\pi$, $v'=\\cos x$로 놓으면 $u'=2$, $v=\\sin x$이다.\n3) $\\int(2x-\\pi)\\cos x\\,dx = (2x-\\pi)\\sin x - \\int 2\\sin x\\,dx = (2x-\\pi)\\sin x + 2\\cos x + C$이다.\n4) $f(0) = (-\\pi)\\sin 0 + 2\\cos 0 + C = 0+2+C = 2+C$이고 $f(0)=6$이므로 $C=4$이다.\n5) 따라서 $f(x) = (2x-\\pi)\\sin x + 2\\cos x + 4$이다.\n6) $x=\\pi$를 대입하면 $f(\\pi) = \\pi\\sin\\pi + 2\\cos\\pi + 4$이다.\n7) $\\sin\\pi=0$, $\\cos\\pi=-1$이므로 $f(\\pi) = 0-2+4 = 2$이다.\n주의: $2x-\\pi$에 $x=\\pi$를 대입한 값은 $\\pi$이지만 $\\sin\\pi=0$이므로 항 전체가 소거된다.\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-099",
    "problemTypeKey": "PT_CALCULUS_INTEGRATION_BY_PARTS",
    "templateKey": "TPL_CALCULUS_PARTS_PRODUCT",
    "crossConceptKeys": [
      "CC_TANGENT_LINE_SLOPE_AT_POINT",
      "CC_INDEFINITE_INTEGRAL"
    ],
    "conditionKeys": [
      "COND_FUNCTION_VALUE_CONSTRAINT"
    ],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 4,
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
    "content": "함수 $f(x)$에 대하여\n$$\\int x^2 \\cos x \\,dx = f(x) - 2\\int x \\sin x \\,dx$$\n이고 $f(0) = 0$일 때, $f\\left(\\dfrac{\\pi}{2}\\right)$의 값은?",
    "choices": [
      "$-\\dfrac{\\pi^2}{2}$",
      "$-\\dfrac{\\pi^2}{4}$",
      "$\\dfrac{\\pi^2}{4}$",
      "$\\dfrac{\\pi^2}{2}$",
      "$\\pi^2$"
    ],
    "answer": "③",
    "solution": "1) 좌변 $\\int x^2\\cos x\\,dx$에 부분적분법 $\\int uv'\\,dx = uv-\\int u'v\\,dx$를 적용한다.\n2) $u=x^2$, $v'=\\cos x$로 놓으면 $u'=2x$, $v=\\sin x$이다.\n3) 따라서 $\\int x^2\\cos x\\,dx = x^2\\sin x - \\int 2x\\sin x\\,dx = x^2\\sin x - 2\\int x\\sin x\\,dx$이다.\n4) 주어진 등식 $\\int x^2\\cos x\\,dx = f(x)-2\\int x\\sin x\\,dx$와 비교하면 $f(x) = x^2\\sin x + C$ (단, $C$는 적분상수)이다.\n5) 다른 확인: 양변을 미분하면 $x^2\\cos x = f'(x)-2x\\sin x$이므로 $f'(x) = x^2\\cos x+2x\\sin x = (x^2\\sin x)'$이다.\n6) $f(0) = 0^2\\sin 0 + C = C$이고 $f(0)=0$이므로 $C=0$이다.\n7) 즉 $f(x) = x^2\\sin x$이다.\n8) $x=\\dfrac{\\pi}{2}$를 대입하면 $f\\left(\\dfrac{\\pi}{2}\\right) = \\left(\\dfrac{\\pi}{2}\\right)^2\\sin\\dfrac{\\pi}{2}$이다.\n9) $\\sin\\dfrac{\\pi}{2}=1$이므로 $f\\left(\\dfrac{\\pi}{2}\\right) = \\dfrac{\\pi^2}{4}\\cdot 1 = \\dfrac{\\pi^2}{4}$이다.\n주의: 두 부정적분을 비교할 때 적분상수 $C$를 남기고 $f(0)=0$으로 결정해야 한다.\n따라서 정답은 ③이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-099",
    "problemTypeKey": "PT_CALCULUS_INTEGRATION_BY_PARTS",
    "templateKey": "TPL_CALCULUS_PARTS_PRODUCT",
    "crossConceptKeys": [
      "CC_INDEFINITE_INTEGRAL"
    ],
    "conditionKeys": [
      "COND_FUNCTION_VALUE_CONSTRAINT"
    ],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 5,
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
    "content": "미분가능한 함수 $f(x)$의 한 부정적분을 $F(x)$라 할 때,\n$$F(x) = x f(x) + x^2 \\sin x$$\n가 성립한다. $f(\\pi)$의 값은? (단, $f(0) = 0$)",
    "choices": [
      "$-3$",
      "$-2$",
      "$-1$",
      "$0$",
      "$1$"
    ],
    "answer": "②",
    "solution": "1) $F(x)$가 $f(x)$의 한 부정적분이므로 $F'(x)=f(x)$이다.\n2) $F(x)=xf(x)+x^2\\sin x$의 양변을 미분하면 곱의 미분법에 의해 $f(x) = f(x)+xf'(x)+2x\\sin x+x^2\\cos x$이다.\n3) 양변에서 $f(x)$를 소거하면 $0 = xf'(x)+2x\\sin x+x^2\\cos x$이다.\n4) 즉 $xf'(x) = -2x\\sin x-x^2\\cos x$이므로 $x\\neq 0$에서 $f'(x) = -2\\sin x-x\\cos x$이다.\n5) $f(x) = \\int(-2\\sin x-x\\cos x)\\,dx = 2\\cos x - \\int x\\cos x\\,dx$이다.\n6) 부분적분법에서 $u=x$, $v'=\\cos x$로 놓으면 $\\int x\\cos x\\,dx = x\\sin x-\\int\\sin x\\,dx = x\\sin x+\\cos x$이다.\n7) 따라서 $f(x) = 2\\cos x-(x\\sin x+\\cos x)+C = \\cos x-x\\sin x+C$이다.\n8) $f(0) = 1-0+C = 1+C$이고 $f(0)=0$이므로 $C=-1$이다.\n9) 즉 $f(x) = \\cos x-x\\sin x-1$이다.\n10) $x=\\pi$를 대입하면 $f(\\pi) = \\cos\\pi-\\pi\\sin\\pi-1 = -1-0-1 = -2$이다.\n주의: $-2\\int\\sin x\\,dx = 2\\cos x$의 부호와 $\\int x\\cos x\\,dx$ 앞의 마이너스 분배를 확인한다.\n따라서 정답은 ②이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-099",
    "problemTypeKey": "PT_CALCULUS_INTEGRATION_BY_PARTS",
    "templateKey": "TPL_CALCULUS_PARTS_PRODUCT",
    "crossConceptKeys": [
      "CC_INDEFINITE_INTEGRAL"
    ],
    "conditionKeys": [
      "COND_FUNCTION_VALUE_CONSTRAINT"
    ],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 6,
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
    "content": "$x > 0$에서 미분가능한 함수 $f(x)$가 다음 조건을 만족시킨다.\n\n(가) $f\\left(\\dfrac{\\pi}{2}\\right) = -1$\n(나) $f(x) + x f'(x) = -x \\cos x$\n\n$f(\\pi)$의 값은?",
    "choices": [
      "$-\\dfrac{2}{\\pi}$",
      "$-\\dfrac{1}{\\pi}$",
      "$0$",
      "$\\dfrac{1}{\\pi}$",
      "$\\dfrac{2}{\\pi}$"
    ],
    "answer": "④",
    "solution": "1) 조건 (나)의 좌변 $f(x)+xf'(x)$는 곱의 미분법에 의해 $\\{xf(x)\\}'$이다.\n2) 따라서 $\\{xf(x)\\}' = -x\\cos x$이다.\n3) 양변을 적분하면 $xf(x) = \\int(-x\\cos x)\\,dx$이다.\n4) 부분적분법 $\\int uv'\\,dx = uv-\\int u'v\\,dx$에서 $u=-x$, $v'=\\cos x$로 놓으면 $u'=-1$, $v=\\sin x$이다.\n5) $\\int(-x\\cos x)\\,dx = -x\\sin x-\\int(-1)\\sin x\\,dx = -x\\sin x+\\int\\sin x\\,dx$이다.\n6) $\\int\\sin x\\,dx = -\\cos x$이므로 $xf(x) = -x\\sin x-\\cos x+C$이다.\n7) $x=\\dfrac{\\pi}{2}$를 대입하면 $\\dfrac{\\pi}{2}f\\left(\\dfrac{\\pi}{2}\\right) = -\\dfrac{\\pi}{2}\\sin\\dfrac{\\pi}{2}-\\cos\\dfrac{\\pi}{2}+C$이다.\n8) $f\\left(\\dfrac{\\pi}{2}\\right)=-1$, $\\sin\\dfrac{\\pi}{2}=1$, $\\cos\\dfrac{\\pi}{2}=0$이므로 $-\\dfrac{\\pi}{2} = -\\dfrac{\\pi}{2}+C$, 즉 $C=0$이다.\n9) 따라서 $xf(x) = -x\\sin x-\\cos x$이고 $x>0$이므로 $f(x) = -\\sin x-\\dfrac{\\cos x}{x}$이다.\n10) $x=\\pi$를 대입하면 $f(\\pi) = -\\sin\\pi-\\dfrac{\\cos\\pi}{\\pi} = 0-\\dfrac{-1}{\\pi} = \\dfrac{1}{\\pi}$이다.\n주의: $\\cos\\pi=-1$이므로 $-\\dfrac{\\cos\\pi}{\\pi} = \\dfrac{1}{\\pi}$로 부호가 바뀐다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-099",
    "problemTypeKey": "PT_CALCULUS_INTEGRATION_BY_PARTS",
    "templateKey": "TPL_CALCULUS_PARTS_PRODUCT",
    "crossConceptKeys": [
      "CC_INDEFINITE_INTEGRAL"
    ],
    "conditionKeys": [
      "COND_POSITIVE",
      "COND_FUNCTION_VALUE_CONSTRAINT"
    ],
    "integrationPattern": "REINTERPRETATION"
  }
];
