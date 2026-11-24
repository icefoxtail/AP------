window.examTitle = "미적분II_220_삼각함수의부정적분2_고2_유형은행1";

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
    "content": "함수 $f$가 $f'(x)=4\\cos^2\\frac{x}{2}+2\\sin x$, $f(0)=3$을 만족시킬 때, $f(\\frac{\\pi}{2})$의 값은?",
    "choices": [
      "$\\pi+5$",
      "$\\pi+6$",
      "$\\pi+7$",
      "$\\pi+8$",
      "$\\pi+9$"
    ],
    "answer": "③",
    "solution": "반각 공식 $\\cos^2\\frac{x}{2}=\\frac{1+\\cos x}{2}$를 쓰면 $4\\cos^2\\frac{x}{2}=2(1+\\cos x)=2+2\\cos x$이다.\n이를 도함수에 대입하면 $f'(x)=2+2\\cos x+2\\sin x$이다.\n삼각함수의 부정적분으로 $f(x)=2x+2\\sin x-2\\cos x+C$이다.\n$f(0)=3$을 대입하면 $0+0-2+C=3$이므로 $C=5$이다.\n따라서 $f(x)=2x+2\\sin x-2\\cos x+5$이다.\n$x=\\frac{\\pi}{2}$를 대입하면 $f\\left(\\frac{\\pi}{2}\\right)=\\pi+2\\cdot1-2\\cdot0+5$이다.\n계산하면 $f\\left(\\frac{\\pi}{2}\\right)=\\pi+7$이다.\n따라서 정답은 ③이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "B12",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-095",
    "problemTypeKey": "PT_CALCULUS_FUNCTION_INTEGRAL",
    "templateKey": "TPL_CALCULUS_INTEGRAL_TRIG",
    "crossConceptKeys": [
      "CC_TRIGONOMETRIC_IDENTITY"
    ],
    "conditionKeys": [],
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
    "content": "함수 $f$가 $f'(x)=6\\sin^2x+2\\cos x$, $f(0)=-1$을 만족시킬 때, $f(\\frac{\\pi}{2})$의 값은?",
    "choices": [
      "$\\frac{3\\pi}{2}-2$",
      "$\\frac{3\\pi}{2}-1$",
      "$\\frac{3\\pi}{2}$",
      "$\\frac{3\\pi}{2}+1$",
      "$\\frac{3\\pi}{2}+2$"
    ],
    "answer": "④",
    "solution": "반각 공식 $\\sin^2x=\\frac{1-\\cos 2x}{2}$를 쓰면 $6\\sin^2x=3(1-\\cos 2x)=3-3\\cos 2x$이다.\n이를 도함수에 대입하면 $f'(x)=3-3\\cos 2x+2\\cos x$이다.\n삼각함수의 부정적분으로 $f(x)=3x-\\frac{3}{2}\\sin 2x+2\\sin x+C$이다.\n$f(0)=-1$을 대입하면 $0-0+0+C=-1$이므로 $C=-1$이다.\n$x=\\frac{\\pi}{2}$를 대입하면 $f\\left(\\frac{\\pi}{2}\\right)=\\frac{3\\pi}{2}-\\frac{3}{2}\\sin\\pi+2\\sin\\frac{\\pi}{2}-1$이다.\n$\\sin\\pi=0$, $\\sin\\frac{\\pi}{2}=1$이므로 $\\frac{3\\pi}{2}-0+2-1=\\frac{3\\pi}{2}+1$이다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-095",
    "problemTypeKey": "PT_CALCULUS_FUNCTION_INTEGRAL",
    "templateKey": "TPL_CALCULUS_INTEGRAL_TRIG",
    "crossConceptKeys": [
      "CC_TRIGONOMETRIC_IDENTITY"
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
    "content": "$0<x<\\pi$에서 함수 $f$의 도함수가 $f'(x)=2\\sin 2x-2\\cos x$이다. $f$의 극솟값이 $\\frac12$일 때, 극댓값은?",
    "choices": [
      "$\\frac14$",
      "$\\frac12$",
      "$\\frac34$",
      "$1$",
      "$\\frac54$"
    ],
    "answer": "④",
    "solution": "사인의 배각 공식 $\\sin 2x=2\\sin x\\cos x$로 $2\\sin 2x=4\\sin x\\cos x$이다.\n이를 대입하면 $f'(x)=4\\sin x\\cos x-2\\cos x=2\\cos x(2\\sin x-1)$이다.\n$f'(x)=0$에서 $\\cos x=0$ 또는 $\\sin x=\\frac{1}{2}$이므로 $x=\\frac{\\pi}{6},\\ \\frac{\\pi}{2},\\ \\frac{5\\pi}{6}$이다.\n(i) $\\left(0,\\frac{\\pi}{6}\\right)$에서 $\\cos x>0$, $2\\sin x-1<0$이므로 $f'(x)<0$이다.\n(i) $\\left(\\frac{\\pi}{6},\\frac{\\pi}{2}\\right)$에서 $\\cos x>0$, $2\\sin x-1>0$이므로 $f'(x)>0$이다. 즉 $x=\\frac{\\pi}{6}$에서 극소이다.\n(ii) $\\left(\\frac{\\pi}{2},\\frac{5\\pi}{6}\\right)$에서 $\\cos x<0$, $2\\sin x-1>0$이므로 $f'(x)<0$이다. 즉 $x=\\frac{\\pi}{2}$에서 극대이다.\n(ii) $\\left(\\frac{5\\pi}{6},\\pi\\right)$에서 $\\cos x<0$, $2\\sin x-1<0$이므로 $f'(x)>0$이다. 즉 $x=\\frac{5\\pi}{6}$에서 극소이다.\n삼각함수의 부정적분으로 $f(x)=-\\cos 2x-2\\sin x+C$이다.\n두 극소점에서 $\\cos 2x=\\frac{1}{2}$, $\\sin x=\\frac{1}{2}$이므로 극솟값은 $-\\frac{1}{2}-1+C=C-\\frac{3}{2}$이다.\n극솟값이 $\\frac{1}{2}$이므로 $C-\\frac{3}{2}=\\frac{1}{2}$에서 $C=2$이다.\n극댓값은 $f\\left(\\frac{\\pi}{2}\\right)=-\\cos\\pi-2\\sin\\frac{\\pi}{2}+2=1-2+2=1$이다.\n주의: 극소점이 두 개이고 두 극솟값이 같아 $C$가 하나로 정해진다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-095",
    "problemTypeKey": "PT_CALCULUS_FUNCTION_INTEGRAL",
    "templateKey": "TPL_CALCULUS_INTEGRAL_TRIG",
    "crossConceptKeys": [
      "CC_DERIVATIVE_SIGN_EXTREMA_ANALYSIS",
      "CC_DERIVATIVE_ROOT_SOLVING"
    ],
    "conditionKeys": [
      "COND_RESTRICTED_INTERVAL"
    ],
    "integrationPattern": "SEQUENTIAL"
  }
];
