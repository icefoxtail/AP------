window.examTitle = "미적분II_262_정적분과급수의삼각치환법_고2_유형은행1";

window.questionBank = [
  {
    "id": 1,
    "category": "정적분의 활용",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-08",
    "standardUnit": "정적분의 활용",
    "standardUnitOrder": 8,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "정적분의 활용"
    ],
    "wide": false,
    "content": "$\\lim_{n\\to\\infty} \\dfrac{12}{n} \\sum_{k=1}^n \\sqrt{4 - \\left(\\dfrac{k}{n}\\right)^2}$의 값은?",
    "choices": [
      "$4\\pi + 2\\sqrt{3}$",
      "$4\\pi + 3\\sqrt{3}$",
      "$4\\pi + 4\\sqrt{3}$",
      "$4\\pi + 6\\sqrt{3}$",
      "$4\\pi + 8\\sqrt{3}$"
    ],
    "answer": "④",
    "solution": "[정적분과 급수의 관계] $\\lim_{n\\to\\infty}\\frac{12}{n}\\sum_{k=1}^n\\sqrt{4-\\left(\\frac{k}{n}\\right)^2}=\\lim_{n\\to\\infty}\\sum_{k=1}^n12\\sqrt{4-\\left(\\frac{k}{n}\\right)^2}\\cdot\\frac{1}{n}$로 쓴다.\n[치환 설정] $x=\\frac{k}{n}$, $\\Delta x=\\frac{1}{n}$이면 $x$는 $0$에서 $1$까지 변한다.\n[정적분으로 변환] 따라서 주어진 극한은 $12\\int_0^1\\sqrt{4-x^2}\\,dx$이다.\n[삼각치환법] $x=2\\sin\\theta\\;\\left(-\\frac{\\pi}{2}\\le\\theta\\le\\frac{\\pi}{2}\\right)$로 두면 $dx=2\\cos\\theta\\,d\\theta$이다.\n[적분구간 변경] $x=0$일 때 $\\theta=0$이고, $x=1$일 때 $2\\sin\\theta=1$에서 $\\sin\\theta=\\frac12$이므로 $\\theta=\\frac{\\pi}{6}$이다.\n[근호 정리] 이 구간에서 $\\cos\\theta>0$이므로 $\\sqrt{4-x^2}=\\sqrt{4-4\\sin^2\\theta}=2\\cos\\theta$이다.\n[치환적분] $12\\int_0^1\\sqrt{4-x^2}\\,dx=12\\int_0^{\\frac{\\pi}{6}}(2\\cos\\theta)(2\\cos\\theta\\,d\\theta)=48\\int_0^{\\frac{\\pi}{6}}\\cos^2\\theta\\,d\\theta$이다.\n[반각공식] $\\cos^2\\theta=\\frac{1+\\cos2\\theta}{2}$이므로 $48\\int_0^{\\frac{\\pi}{6}}\\frac{1+\\cos2\\theta}{2}\\,d\\theta=24\\int_0^{\\frac{\\pi}{6}}(1+\\cos2\\theta)\\,d\\theta$이다.\n[부정적분] $24\\int(1+\\cos2\\theta)\\,d\\theta=24\\left(\\theta+\\frac12\\sin2\\theta\\right)$이다.\n[정적분 계산] $24\\left[\\theta+\\frac12\\sin2\\theta\\right]_0^{\\frac{\\pi}{6}}=24\\left(\\frac{\\pi}{6}+\\frac12\\sin\\frac{\\pi}{3}\\right)$이다.\n[값 대입] $\\sin\\frac{\\pi}{3}=\\frac{\\sqrt3}{2}$이므로 $24\\left(\\frac{\\pi}{6}+\\frac{\\sqrt3}{4}\\right)=4\\pi+6\\sqrt3$이다.\n주의: $\\sqrt{4-4\\sin^2\\theta}=2|\\cos\\theta|$이므로 치환구간에서 $\\cos\\theta>0$임을 반드시 확인한다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-190",
    "problemTypeKey": "PT_CALCULUS_RIEMANN_SUM",
    "templateKey": "TPL_CALCULUS_RIEMANN_SERIES_TO_INTEGRAL",
    "crossConceptKeys": [],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 2,
    "category": "정적분의 활용",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-08",
    "standardUnit": "정적분의 활용",
    "standardUnitOrder": 8,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "정적분의 활용"
    ],
    "wide": false,
    "content": "$\\lim_{n\\to\\infty} \\sum_{k=1}^n \\dfrac{3\\sqrt{3}n}{n^2 + 3k^2}$의 값은?",
    "choices": [
      "$\\dfrac{\\pi}{4}$",
      "$\\dfrac{\\pi}{3}$",
      "$\\dfrac{\\pi}{2}$",
      "$\\dfrac{2\\pi}{3}$",
      "$\\pi$"
    ],
    "answer": "⑤",
    "solution": "[분모·분자를 $n^2$으로 나누기] $\\frac{3\\sqrt3\\,n}{n^2+3k^2}=\\frac{3\\sqrt3}{1+3\\left(\\frac{k}{n}\\right)^2}\\cdot\\frac1n$이다.\n[정적분과 급수의 관계] $x=\\frac{k}{n}$, $\\Delta x=\\frac1n$로 두면 극한은 $\\int_0^1\\frac{3\\sqrt3}{1+3x^2}\\,dx$이다.\n[삼각치환법] $\\sqrt3\\,x=\\tan\\theta\\;\\left(-\\frac{\\pi}{2}<\\theta<\\frac{\\pi}{2}\\right)$로 두면 $\\sqrt3\\,dx=\\sec^2\\theta\\,d\\theta$이므로 $dx=\\frac{1}{\\sqrt3}\\sec^2\\theta\\,d\\theta$이다.\n[적분구간 변경] $x=0$일 때 $\\theta=0$이고, $x=1$일 때 $\\tan\\theta=\\sqrt3$이므로 $\\theta=\\frac{\\pi}{3}$이다.\n[분모 변형] $1+3x^2=1+\\tan^2\\theta=\\sec^2\\theta$이다.\n[치환적분] $\\int_0^1\\frac{3\\sqrt3}{1+3x^2}\\,dx=\\int_0^{\\frac{\\pi}{3}}\\frac{3\\sqrt3}{\\sec^2\\theta}\\cdot\\frac{1}{\\sqrt3}\\sec^2\\theta\\,d\\theta$이다.\n[약분] 위 식은 $\\int_0^{\\frac{\\pi}{3}}3\\,d\\theta$로 정리된다.\n[정적분 계산] $\\left[3\\theta\\right]_0^{\\frac{\\pi}{3}}=3\\cdot\\frac{\\pi}{3}=\\pi$이다.\n주의: $\\sqrt3\\,x=\\tan\\theta$로 치환해야 $dx$의 계수까지 정확히 맞는다.\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-190",
    "problemTypeKey": "PT_CALCULUS_RIEMANN_SUM",
    "templateKey": "TPL_CALCULUS_RIEMANN_SERIES_TO_INTEGRAL",
    "crossConceptKeys": [],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 3,
    "category": "정적분의 활용",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-08",
    "standardUnit": "정적분의 활용",
    "standardUnitOrder": 8,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "정적분의 활용"
    ],
    "wide": false,
    "content": "$\\lim_{n\\to\\infty} \\sum_{k=1}^n \\dfrac{1}{\\sqrt{4n^2 - (n-k)^2}}$의 값은?",
    "choices": [
      "$\\dfrac{\\pi}{6}$",
      "$\\dfrac{\\pi}{4}$",
      "$\\dfrac{\\pi}{3}$",
      "$\\dfrac{5\\pi}{12}$",
      "$\\dfrac{\\pi}{2}$"
    ],
    "answer": "①",
    "solution": "[근호 안에서 $n^2$ 묶기] $\\sqrt{4n^2-(n-k)^2}=\\sqrt{n^2\\left\\{4-\\left(1-\\frac{k}{n}\\right)^2\\right\\}}=n\\sqrt{4-\\left(1-\\frac{k}{n}\\right)^2}$이다($n>0$).\n[급수 변형] 따라서 $\\frac{1}{\\sqrt{4n^2-(n-k)^2}}=\\frac1n\\cdot\\frac{1}{\\sqrt{4-\\left(1-\\frac{k}{n}\\right)^2}}$이다.\n[정적분과 급수의 관계] $x=\\frac{k}{n}$, $\\Delta x=\\frac1n$이면 극한은 $\\int_0^1\\frac{1}{\\sqrt{4-(1-x)^2}}\\,dx$이다.\n[치환적분법] $t=1-x$로 두면 $dt=-dx$이다.\n[적분구간 변경] $x=0$일 때 $t=1$, $x=1$일 때 $t=0$이므로 $\\int_1^0\\frac{1}{\\sqrt{4-t^2}}(-dt)=\\int_0^1\\frac{1}{\\sqrt{4-t^2}}\\,dt$이다.\n[삼각치환법] $t=2\\sin\\theta\\;\\left(-\\frac{\\pi}{2}<\\theta<\\frac{\\pi}{2}\\right)$로 두면 $dt=2\\cos\\theta\\,d\\theta$이다.\n[구간 변경] $t=0$일 때 $\\theta=0$, $t=1$일 때 $\\sin\\theta=\\frac12$이므로 $\\theta=\\frac{\\pi}{6}$이다.\n[근호 정리] $0\\le\\theta\\le\\frac{\\pi}{6}$에서 $\\cos\\theta>0$이므로 $\\sqrt{4-t^2}=2\\cos\\theta$이다.\n[치환적분 및 약분] $\\int_0^1\\frac{1}{\\sqrt{4-t^2}}\\,dt=\\int_0^{\\frac{\\pi}{6}}\\frac{1}{2\\cos\\theta}\\cdot2\\cos\\theta\\,d\\theta=\\int_0^{\\frac{\\pi}{6}}1\\,d\\theta$이다.\n[정적분 계산] $\\left[\\theta\\right]_0^{\\frac{\\pi}{6}}=\\frac{\\pi}{6}$이다.\n주의: $\\sqrt{n^2}=n$은 $n>0$일 때 성립하므로 극한에서 $n>0$임을 이용한다.\n따라서 정답은 ①이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-190",
    "problemTypeKey": "PT_CALCULUS_RIEMANN_SUM",
    "templateKey": "TPL_CALCULUS_RIEMANN_SERIES_TO_INTEGRAL",
    "crossConceptKeys": [],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
  }
];
