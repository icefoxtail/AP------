window.examTitle = "미적분II_228_로그함수의치환적분법_고2_유형은행1";

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
    "content": "다음 부정적분 중 옳지 않은 것은? (단, $C$는 적분상수이다.)",
    "choices": [
      "$\\int \\frac{1}{x(1+\\ln x)} \\,dx = \\ln|1+\\ln x| + C$",
      "$\\int \\frac{\\cos(\\ln x)}{x} \\,dx = \\sin(\\ln x) + C$",
      "$\\int \\frac{(\\ln x)^3}{x} \\,dx = \\frac{1}{4}(\\ln x)^4 + C$",
      "$\\int \\frac{1}{x\\sqrt{1+2\\ln x}} \\,dx = 2\\sqrt{1+2\\ln x} + C$",
      "$\\int \\frac{x}{\\sqrt{x^2+4}} \\,dx = \\sqrt{x^2+4} + C$"
    ],
    "answer": "④",
    "solution": "각 보기의 부정적분을 치환적분법으로 직접 계산하여 검증한다.\n① $t=1+\\ln x$로 놓으면 $dt=\\frac{1}{x}dx$이므로 $\\int\\frac{1}{x(1+\\ln x)}dx=\\int\\frac{1}{t}dt=\\ln|t|+C=\\ln|1+\\ln x|+C$ (옳음)\n② $t=\\ln x$로 놓으면 $dt=\\frac{1}{x}dx$이므로 $\\int\\frac{\\cos(\\ln x)}{x}dx=\\int\\cos t\\,dt=\\sin t+C=\\sin(\\ln x)+C$ (옳음)\n③ $t=\\ln x$로 놓으면 $dt=\\frac{1}{x}dx$이므로 $\\int\\frac{(\\ln x)^3}{x}dx=\\int t^3dt=\\frac{t^4}{4}+C=\\frac{1}{4}(\\ln x)^4+C$ (옳음)\n④ $t=1+2\\ln x$로 놓으면 $dt=\\frac{2}{x}dx$, 즉 $\\frac{1}{x}dx=\\frac{1}{2}dt$이므로 $\\int\\frac{1}{x\\sqrt{1+2\\ln x}}dx=\\frac{1}{2}\\int t^{-\\frac{1}{2}}dt=\\frac{1}{2}\\cdot 2t^{\\frac{1}{2}}+C=\\sqrt{1+2\\ln x}+C$ (주어진 식은 계수가 $2$이므로 옳지 않음)\n⑤ $u=x^2+4$로 놓으면 $du=2x\\,dx$, 즉 $x\\,dx=\\frac{1}{2}du$이므로 $\\int\\frac{x}{\\sqrt{x^2+4}}dx=\\frac{1}{2}\\int u^{-\\frac{1}{2}}du=\\sqrt{u}+C=\\sqrt{x^2+4}+C$ (옳음)\n주의: ④에서는 속미분 계수 $2$ 때문에 $\\frac{1}{2}$이 곱해져 계수가 $1$이 되어야 하는데, 보기에는 $2$가 붙어 있다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-097",
    "problemTypeKey": "PT_CALCULUS_SUBSTITUTION_INTEGRAL",
    "templateKey": "TPL_CALCULUS_SUBSTITUTION_INDEFINITE",
    "crossConceptKeys": [
      "CC_INDEFINITE_INTEGRAL",
      "CC_DERIVATIVE_VALUE_EVALUATION"
    ],
    "conditionKeys": [],
    "integrationPattern": "NONE"
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
    "content": "함수 $f(x)$에 대하여\n$$f(x) = \\int \\frac{8(\\ln x)^3}{x} \\,dx, \\quad f(e) = 5$$\n일 때, $f(e^2)$의 값은?",
    "choices": [
      "$27$",
      "$31$",
      "$35$",
      "$39$",
      "$43$"
    ],
    "answer": "③",
    "solution": "치환적분법을 쓰기 위해 $t=\\ln x$로 놓으면 $dt=\\frac{1}{x}dx$이다.\n$f(x)=\\int\\frac{8(\\ln x)^3}{x}dx=\\int 8t^3dt=8\\cdot\\frac{t^4}{4}+C=2t^4+C$\n따라서 $f(x)=2(\\ln x)^4+C$ (단, $C$는 적분상수)이다.\n$f(e)=2(\\ln e)^4+C=2\\cdot 1^4+C=2+C=5$이므로 $C=3$.\n그러므로 $f(x)=2(\\ln x)^4+3$이다.\n$\\ln(e^2)=2$이므로 $f(e^2)=2\\cdot 2^4+3=2\\cdot 16+3=35$.\n따라서 정답은 ③이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-097",
    "problemTypeKey": "PT_CALCULUS_SUBSTITUTION_INTEGRAL",
    "templateKey": "TPL_CALCULUS_SUBSTITUTION_INDEFINITE",
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
    "content": "양의 실수 전체의 집합에서 미분가능한 함수 $f(x)$가 $x > 0$인 모든 실수 $x$에 대하여\n$$x f'(x) = 8\\ln\\sqrt{x}$$\n이고 $f(1) = 1$일 때, $f(e^2)$의 값은?",
    "choices": [
      "$7$",
      "$9$",
      "$11$",
      "$13$",
      "$15$"
    ],
    "answer": "②",
    "solution": "로그의 성질 $\\ln\\sqrt{x}=\\ln x^{\\frac{1}{2}}=\\frac{1}{2}\\ln x$로 우변을 정리하면 $x f'(x)=8\\cdot\\frac{1}{2}\\ln x=4\\ln x$.\n$x>0$이므로 양변을 $x$로 나누면 $f'(x)=\\frac{4\\ln x}{x}$.\n$t=\\ln x$로 놓으면 $dt=\\frac{1}{x}dx$이므로 $f(x)=\\int\\frac{4\\ln x}{x}dx=\\int 4t\\,dt=2t^2+C=2(\\ln x)^2+C$ (치환적분법).\n$f(1)=2(\\ln 1)^2+C=C=1$이므로 $C=1$.\n따라서 $f(x)=2(\\ln x)^2+1$.\n$\\ln(e^2)=2$이므로 $f(e^2)=2\\cdot 2^2+1=8+1=9$.\n따라서 정답은 ②이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-097",
    "problemTypeKey": "PT_CALCULUS_SUBSTITUTION_INTEGRAL",
    "templateKey": "TPL_CALCULUS_SUBSTITUTION_INDEFINITE",
    "crossConceptKeys": [
      "CC_INDEFINITE_INTEGRAL"
    ],
    "conditionKeys": [
      "COND_POSITIVE",
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
    "content": "함수 $f(x)$에 대하여\n$$x f'(x) = 2\\ln x, \\quad f(1) = -5$$\n일 때, 방정식 $f(x) = 4\\ln x$를 만족하는 모든 실수 $x$의 값의 곱은?",
    "choices": [
      "$e^2$",
      "$e^3$",
      "$e^4$",
      "$e^5$",
      "$e^6$"
    ],
    "answer": "③",
    "solution": "$x>0$이므로 양변을 $x$로 나누면 $f'(x)=\\frac{2\\ln x}{x}$.\n$t=\\ln x$로 놓으면 $dt=\\frac{1}{x}dx$이므로 $f(x)=\\int\\frac{2\\ln x}{x}dx=\\int 2t\\,dt=t^2+C=(\\ln x)^2+C$.\n$f(1)=(\\ln 1)^2+C=C=-5$이므로 $f(x)=(\\ln x)^2-5$.\n방정식 $f(x)=4\\ln x$에 대입하면 $(\\ln x)^2-5=4\\ln x$, 즉 $(\\ln x)^2-4\\ln x-5=0$.\n인수분해하면 $(\\ln x-5)(\\ln x+1)=0$이므로 $\\ln x=5$ 또는 $\\ln x=-1$.\n따라서 $x=e^5$ 또는 $x=e^{-1}$이고, 두 해의 곱은 지수법칙에 의해 $e^5\\cdot e^{-1}=e^{5+(-1)}=e^4$.\n주의: 두 해의 곱을 구할 때 근과 계수의 관계에서 $\\ln x_1+\\ln x_2=4$이므로 곱이 $e^4$임을 확인할 수 있다.\n따라서 정답은 ③이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-097",
    "problemTypeKey": "PT_CALCULUS_SUBSTITUTION_INTEGRAL",
    "templateKey": "TPL_CALCULUS_SUBSTITUTION_INDEFINITE",
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
    "content": "$1 \\le x \\le e^{\\frac{\\pi}{2}}$일 때,\n$$f(x) = \\int \\frac{2}{x}\\cos(\\ln x) \\,dx, \\quad f(1) = 1$$\n을 만족시키는 함수 $f(x)$에 대하여 방정식 $f(x) = 1 + \\sqrt{3}$의 해는?",
    "choices": [
      "$e^{\\frac{\\pi}{6}}$",
      "$e^{\\frac{\\pi}{3}}$",
      "$e^{\\frac{\\pi}{2}}$",
      "$e^{\\frac{2}{3}\\pi}$",
      "$e^{\\frac{5}{6}\\pi}$"
    ],
    "answer": "②",
    "solution": "$t=\\ln x$로 놓으면 $dt=\\frac{1}{x}dx$이므로 $f(x)=\\int\\frac{2}{x}\\cos(\\ln x)dx=\\int 2\\cos t\\,dt=2\\sin t+C=2\\sin(\\ln x)+C$.\n$f(1)=2\\sin(\\ln 1)+C=2\\sin 0+C=C=1$이므로 $f(x)=2\\sin(\\ln x)+1$.\n방정식 $f(x)=1+\\sqrt{3}$에 대입하면 $2\\sin(\\ln x)+1=1+\\sqrt{3}$, 즉 $\\sin(\\ln x)=\\frac{\\sqrt{3}}{2}$.\n$1\\le x\\le e^{\\frac{\\pi}{2}}$의 각 변에 자연로그를 취하면 $0\\le\\ln x\\le\\frac{\\pi}{2}$.\n구간 $0\\le\\ln x\\le\\frac{\\pi}{2}$에서 $\\sin(\\ln x)=\\frac{\\sqrt{3}}{2}$의 해는 $\\ln x=\\frac{\\pi}{3}$뿐이다.\n따라서 $x=e^{\\frac{\\pi}{3}}$이다.\n주의: $\\sin\\theta=\\frac{\\sqrt{3}}{2}$의 다른 근 $\\frac{2}{3}\\pi$는 $\\ln x\\le\\frac{\\pi}{2}$를 만족하지 않으므로 버린다.\n따라서 정답은 ②이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-097",
    "problemTypeKey": "PT_CALCULUS_SUBSTITUTION_INTEGRAL",
    "templateKey": "TPL_CALCULUS_SUBSTITUTION_INDEFINITE",
    "crossConceptKeys": [
      "CC_INDEFINITE_INTEGRAL",
      "CC_TRIGONOMETRIC_EQUATION"
    ],
    "conditionKeys": [
      "COND_RESTRICTED_INTERVAL",
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
    "content": "$x > 0$에서 미분가능한 함수 $f(x)$에 대하여\n$$f'(x) = \\frac{2}{x}\\ln x, \\quad f(1) = 0$$\n일 때, 옳은 것만을 [보기]에서 있는 대로 고른 것은?\n\n[보기]\nㄱ. $f(e) = 1$\nㄴ. 함수 $f(x)$는 $x=1$에서 극솟값을 갖는다.\nㄷ. 닫힌구간 $\\left[\\frac{1}{e}, e^2\\right]$에서 함수 $y=f(x)$의 최댓값은 $4$이고 최솟값은 $0$이다.",
    "choices": [
      "ㄱ",
      "ㄴ",
      "ㄱ, ㄴ",
      "ㄱ, ㄷ",
      "ㄱ, ㄴ, ㄷ"
    ],
    "answer": "⑤",
    "solution": "$t=\\ln x$로 놓으면 $dt=\\frac{1}{x}dx$이므로 $f(x)=\\int\\frac{2\\ln x}{x}dx=\\int 2t\\,dt=t^2+C=(\\ln x)^2+C$.\n$f(1)=(\\ln 1)^2+C=C=0$이므로 $f(x)=(\\ln x)^2$이다.\nㄱ. $f(e)=(\\ln e)^2=1^2=1$ (옳음).\nㄴ. $f'(x)=\\frac{2\\ln x}{x}$에서 $x>0$이므로 부호는 분자 $\\ln x$로 결정된다.\n(i) $0<x<1$이면 $\\ln x<0$이므로 $f'(x)<0$ (감소).\n(ii) $x>1$이면 $\\ln x>0$이므로 $f'(x)>0$ (증가).\n따라서 $x=1$에서 $f'$의 부호가 음에서 양으로 바뀌므로 극솟값 $f(1)=0$을 갖는다 (옳음).\nㄷ. 구간 $\\left[\\frac{1}{e},e^2\\right]$에서 최소는 $f(1)=0$이고, 양 끝값은 $f\\left(\\frac{1}{e}\\right)=(-1)^2=1$, $f(e^2)=2^2=4$이므로 최댓값은 $4$ (옳음).\n따라서 ㄱ, ㄴ, ㄷ 모두 옳다.\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-097",
    "problemTypeKey": "PT_CALCULUS_SUBSTITUTION_INTEGRAL",
    "templateKey": "TPL_CALCULUS_SUBSTITUTION_INDEFINITE",
    "crossConceptKeys": [
      "CC_INDEFINITE_INTEGRAL",
      "CC_DERIVATIVE_SIGN_EXTREMA_ANALYSIS"
    ],
    "conditionKeys": [
      "COND_POSITIVE",
      "COND_FUNCTION_VALUE_CONSTRAINT"
    ],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 7,
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
    "content": "$x > 0$에서 정의된 미분가능한 함수 $f(x)$의 한 부정적분을 $F(x)$라고 할 때,\n$$F(x) = x f(x) - 2x\\ln x + 2x$$\n가 성립한다. $f(e) = 2$일 때, $f'(e) + f(1)$의 값은?",
    "choices": [
      "$\\frac{1}{e} + 1$",
      "$\\frac{2}{e} + 1$",
      "$\\frac{2}{e} + 2$",
      "$\\frac{2}{e} + 3$",
      "$\\frac{2}{e} + 4$"
    ],
    "answer": "②",
    "solution": "$F$가 $f$의 한 부정적분이므로 미적분의 기본정리에 의해 $F'(x)=f(x)$이다.\n$F(x)=xf(x)-2x\\ln x+2x$의 양변을 $x$에 대하여 미분한다.\n좌변은 $F'(x)=f(x)$.\n우변은 곱의 미분법으로 $f(x)+xf'(x)-2\\left(\\ln x+x\\cdot\\frac{1}{x}\\right)+2=f(x)+xf'(x)-2\\ln x-2+2=f(x)+xf'(x)-2\\ln x$.\n양변을 같다고 두면 $f(x)=f(x)+xf'(x)-2\\ln x$이므로 $xf'(x)=2\\ln x$.\n$x>0$이므로 $f'(x)=\\frac{2\\ln x}{x}$이고, $t=\\ln x$로 치환하면 $f(x)=\\int 2t\\,dt=t^2+C=(\\ln x)^2+C$.\n$f(e)=(\\ln e)^2+C=1+C=2$이므로 $C=1$, 즉 $f(x)=(\\ln x)^2+1$.\n$f'(e)=\\frac{2\\ln e}{e}=\\frac{2}{e}$이고 $f(1)=(\\ln 1)^2+1=1$.\n따라서 $f'(e)+f(1)=\\frac{2}{e}+1$.\n따라서 정답은 ②이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-097",
    "problemTypeKey": "PT_CALCULUS_SUBSTITUTION_INTEGRAL",
    "templateKey": "TPL_CALCULUS_SUBSTITUTION_INDEFINITE",
    "crossConceptKeys": [
      "CC_INDEFINITE_INTEGRAL",
      "CC_DERIVATIVE_VALUE_EVALUATION"
    ],
    "conditionKeys": [
      "COND_POSITIVE",
      "COND_FUNCTION_VALUE_CONSTRAINT"
    ],
    "integrationPattern": "SEQUENTIAL"
  }
];
