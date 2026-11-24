window.examTitle = "미적분II_248_지수함수×삼각함수정적분의부분적분법_고2_유형은행1";

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
    "content": "등식 $\\int_0^{\\frac{\\pi}{2}} e^{2x} \\sin x \\,dx = a e^{\\pi} + b$ 가 성립할 때, 두 유리수 $a, b$에 대하여 $a+b$의 값은?",
    "choices": [
      "$-\\frac{1}{5}$",
      "$\\frac{1}{5}$",
      "$\\frac{2}{5}$",
      "$\\frac{1}{2}$",
      "$\\frac{3}{5}$"
    ],
    "answer": "⑤",
    "solution": "구하는 정적분을 $I=\\int_0^{\\frac{\\pi}{2}} e^{2x}\\sin x\\,dx$로 놓는다.\n[1단계: 부분적분법] $f(x)=\\sin x$, $g'(x)=e^{2x}$로 놓으면 $f'(x)=\\cos x$, $g(x)=\\frac{1}{2}e^{2x}$이다.\n부분적분법 $\\int_a^b f(x)g'(x)dx=[f(x)g(x)]_a^b-\\int_a^b f'(x)g(x)dx$에 의해 $I=\\left[\\frac{1}{2}e^{2x}\\sin x\\right]_0^{\\frac{\\pi}{2}}-\\frac{1}{2}\\int_0^{\\frac{\\pi}{2}}e^{2x}\\cos x\\,dx$이다.\n$\\left[\\frac{1}{2}e^{2x}\\sin x\\right]_0^{\\frac{\\pi}{2}}=\\frac{1}{2}e^{\\pi}\\cdot 1-\\frac{1}{2}\\cdot 1\\cdot 0=\\frac{1}{2}e^{\\pi}$이므로 $I=\\frac{1}{2}e^{\\pi}-\\frac{1}{2}J$ (단, $J=\\int_0^{\\frac{\\pi}{2}}e^{2x}\\cos x\\,dx$).\n[2단계: $J$에 부분적분법] $u(x)=\\cos x$, $v'(x)=e^{2x}$로 놓으면 $u'(x)=-\\sin x$, $v(x)=\\frac{1}{2}e^{2x}$이다.\n$J=\\left[\\frac{1}{2}e^{2x}\\cos x\\right]_0^{\\frac{\\pi}{2}}-\\int_0^{\\frac{\\pi}{2}}\\left(-\\frac{1}{2}e^{2x}\\sin x\\right)dx=\\left[\\frac{1}{2}e^{2x}\\cos x\\right]_0^{\\frac{\\pi}{2}}+\\frac{1}{2}I$이다.\n$\\left[\\frac{1}{2}e^{2x}\\cos x\\right]_0^{\\frac{\\pi}{2}}=0-\\frac{1}{2}\\cdot 1\\cdot 1=-\\frac{1}{2}$이므로 $J=-\\frac{1}{2}+\\frac{1}{2}I$이다.\n[3단계: $I$에 대한 방정식] $I=\\frac{1}{2}e^{\\pi}-\\frac{1}{2}\\left(-\\frac{1}{2}+\\frac{1}{2}I\\right)=\\frac{1}{2}e^{\\pi}+\\frac{1}{4}-\\frac{1}{4}I$이다.\n$\\frac{5}{4}I=\\frac{1}{2}e^{\\pi}+\\frac{1}{4}$이므로 $I=\\frac{4}{5}\\left(\\frac{1}{2}e^{\\pi}+\\frac{1}{4}\\right)=\\frac{2}{5}e^{\\pi}+\\frac{1}{5}$이다.\n[4단계: 계수 비교] $I=ae^{\\pi}+b$이고 $a,b$가 유리수이므로 $a=\\frac{2}{5}$, $b=\\frac{1}{5}$이다.\n따라서 $a+b=\\frac{2}{5}+\\frac{1}{5}=\\frac{3}{5}$이다.\n주의: 두 번의 부분적분 모두 삼각함수를 미분 대상으로 고정해야 $I$가 소거되지 않고 $I$에 대한 일차방정식이 만들어진다.\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-100",
    "problemTypeKey": "PT_CALCULUS_INTEGRATION_BY_PARTS",
    "templateKey": "TPL_CALCULUS_PARTS_CYCLIC",
    "crossConceptKeys": [
      "CC_DEFINITE_INTEGRAL_PARAMETER_SOLVING"
    ],
    "conditionKeys": [
      "COND_RATIONAL"
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
    "content": "정적분 $\\int_0^{\\pi} e^x \\cos 2x \\,dx$의 값은?",
    "choices": [
      "$\\frac{1}{5}(e^{\\pi} - 1)$",
      "$\\frac{1}{5}(e^{\\pi} + 1)$",
      "$\\frac{1}{2}(e^{\\pi} - 1)$",
      "$\\frac{1}{2}(e^{\\pi} + 1)$",
      "$e^{\\pi} - 1$"
    ],
    "answer": "①",
    "solution": "구하는 정적분을 $I=\\int_0^{\\pi} e^x\\cos 2x\\,dx$로 놓는다.\n[1단계: 부분적분법] $f(x)=\\cos 2x$, $g'(x)=e^x$로 놓으면 합성함수의 미분법에 의해 $f'(x)=-2\\sin 2x$, $g(x)=e^x$이다.\n부분적분법 $\\int_a^b f(x)g'(x)dx=[f(x)g(x)]_a^b-\\int_a^b f'(x)g(x)dx$에 의해 $I=\\left[e^x\\cos 2x\\right]_0^{\\pi}+2\\int_0^{\\pi}e^x\\sin 2x\\,dx$이다.\n$\\left[e^x\\cos 2x\\right]_0^{\\pi}=e^{\\pi}\\cos 2\\pi-e^0\\cos 0=e^{\\pi}-1$이므로 $I=e^{\\pi}-1+2J$ (단, $J=\\int_0^{\\pi}e^x\\sin 2x\\,dx$).\n[2단계: $J$에 부분적분법] $u(x)=\\sin 2x$, $v'(x)=e^x$로 놓으면 $u'(x)=2\\cos 2x$, $v(x)=e^x$이다.\n$J=\\left[e^x\\sin 2x\\right]_0^{\\pi}-\\int_0^{\\pi}2e^x\\cos 2x\\,dx$이다.\n$\\left[e^x\\sin 2x\\right]_0^{\\pi}=e^{\\pi}\\sin 2\\pi-e^0\\sin 0=0-0=0$이고 $\\int_0^{\\pi}e^x\\cos 2x\\,dx=I$이므로 $J=0-2I=-2I$이다.\n[3단계: $I$의 방정식] $I=e^{\\pi}-1+2(-2I)=e^{\\pi}-1-4I$이다.\n$5I=e^{\\pi}-1$이므로 $I=\\frac{1}{5}(e^{\\pi}-1)$이다.\n주의: $\\cos 2x$를 미분할 때 속미분 계수 $2$와 부호 변화를 빠뜨리면 $I$의 계수가 달라진다.\n따라서 정답은 ①이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-100",
    "problemTypeKey": "PT_CALCULUS_INTEGRATION_BY_PARTS",
    "templateKey": "TPL_CALCULUS_PARTS_CYCLIC",
    "crossConceptKeys": [],
    "conditionKeys": [],
    "integrationPattern": "NONE"
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
    "content": "정적분 $\\int_0^{\\frac{\\pi}{4}} e^{-2x} (\\sin 2x + \\cos 2x) \\,dx$의 값은?",
    "choices": [
      "$\\frac{1}{16}$",
      "$\\frac{1}{8}$",
      "$\\frac{1}{4}$",
      "$\\frac{1}{2}$",
      "$1$"
    ],
    "answer": "④",
    "solution": "$I=\\int_0^{\\frac{\\pi}{4}}e^{-2x}(\\sin 2x+\\cos 2x)\\,dx$로 놓고 $A=\\int_0^{\\frac{\\pi}{4}}e^{-2x}\\cos 2x\\,dx$라 하자.\n[1단계: $A$에 부분적분법] $f(x)=\\cos 2x$, $g'(x)=e^{-2x}$로 놓으면 합성함수의 미분법과 지수함수의 적분에 의해 $f'(x)=-2\\sin 2x$, $g(x)=-\\frac{1}{2}e^{-2x}$이다.\n부분적분법 $\\int_a^b f(x)g'(x)dx=[f(x)g(x)]_a^b-\\int_a^b f'(x)g(x)dx$에 의해 $A=\\left[-\\frac{1}{2}e^{-2x}\\cos 2x\\right]_0^{\\frac{\\pi}{4}}-\\int_0^{\\frac{\\pi}{4}}(-2\\sin 2x)\\left(-\\frac{1}{2}e^{-2x}\\right)dx$이다.\n$(-2\\sin 2x)\\left(-\\frac{1}{2}e^{-2x}\\right)=e^{-2x}\\sin 2x$이므로 $A=\\left[-\\frac{1}{2}e^{-2x}\\cos 2x\\right]_0^{\\frac{\\pi}{4}}-\\int_0^{\\frac{\\pi}{4}}e^{-2x}\\sin 2x\\,dx$이다.\n$\\left[-\\frac{1}{2}e^{-2x}\\cos 2x\\right]_0^{\\frac{\\pi}{4}}=-\\frac{1}{2}e^{-\\frac{\\pi}{2}}\\cdot 0-\\left(-\\frac{1}{2}e^0\\cdot 1\\right)=0+\\frac{1}{2}=\\frac{1}{2}$이다.\n따라서 $A=\\frac{1}{2}-\\int_0^{\\frac{\\pi}{4}}e^{-2x}\\sin 2x\\,dx$이다.\n[2단계: 준식에 대입하여 상쇄] $I=\\int_0^{\\frac{\\pi}{4}}e^{-2x}\\sin 2x\\,dx+A=\\int_0^{\\frac{\\pi}{4}}e^{-2x}\\sin 2x\\,dx+\\frac{1}{2}-\\int_0^{\\frac{\\pi}{4}}e^{-2x}\\sin 2x\\,dx$이다.\n같은 정적분이 부호만 다르게 나타나 서로 상쇄되므로 $I=\\frac{1}{2}$이다.\n주의: $\\sin 2x$ 쪽에 부분적분법을 적용하면 $\\sin\\frac{\\pi}{2}=1$이라 $e^{-\\frac{\\pi}{2}}$ 항이 남으므로, $\\cos\\frac{\\pi}{2}=0$이 되는 $\\cos 2x$ 쪽을 택해야 한다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-100",
    "problemTypeKey": "PT_CALCULUS_INTEGRATION_BY_PARTS",
    "templateKey": "TPL_CALCULUS_PARTS_CYCLIC",
    "crossConceptKeys": [],
    "conditionKeys": [],
    "integrationPattern": "NONE"
  }
];
