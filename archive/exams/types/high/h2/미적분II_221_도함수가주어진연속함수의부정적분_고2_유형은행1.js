window.examTitle = "미적분II_221_도함수가주어진연속함수의부정적분_고2_유형은행1";

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
    "content": "실수 전체에서 연속인 함수 $f$가 $f(2)=3$을 만족시킨다. $f'(x)=\\begin{cases}e^{x-2}&(x<2)\\\\ \\frac3x&(x>2)\\end{cases}$일 때, $f(2e)-f(1)$의 값은?",
    "choices": [
      "$3-\\frac1e$",
      "$4-\\frac1e$",
      "$5-\\frac1e$",
      "$6-\\frac1e$",
      "$7-\\frac1e$"
    ],
    "answer": "②",
    "solution": "(i) $x<2$에서 $f'(x)=e^{x-2}$이므로 지수함수의 부정적분 공식으로 $f(x)=e^{x-2}+C_1$이다.\n$x=2$에서 연속이므로 $\\lim_{x\\to2^-}f(x)=e^{0}+C_1=3$에서 $1+C_1=3$, 즉 $C_1=2$이다.\n따라서 $f(1)=e^{1-2}+2=e^{-1}+2=\\frac1e+2$이다.\n(ii) $x>2$에서 $f'(x)=\\frac3x$이므로 로그함수의 부정적분 공식으로 $f(x)=3\\ln x+C_2$이다.\n$x=2$에서 연속이므로 $\\lim_{x\\to2^+}f(x)=3\\ln2+C_2=3$에서 $C_2=3-3\\ln2$이다.\n로그의 성질 $\\ln(2e)=\\ln2+\\ln e=\\ln2+1$을 쓰면 $f(2e)=3(\\ln2+1)+(3-3\\ln2)=3\\ln2+3+3-3\\ln2=6$이다.\n두 값을 빼면 $f(2e)-f(1)=6-\\left(\\frac1e+2\\right)=4-\\frac1e$이다.\n따라서 정답은 ②이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-093",
    "problemTypeKey": "PT_CALCULUS_FUNCTION_INTEGRAL",
    "templateKey": "TPL_CALCULUS_INTEGRAL_POWER_EXP_LOG",
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
    "content": "실수 전체에서 연속인 함수 $f$의 그래프가 원점을 지나며, $f'(x)=\\begin{cases}2^x\\ln 2&(x<1)\\\\ \\frac4{x^3}&(x>1)\\end{cases}$이다. $f(2)$의 값은?",
    "choices": [
      "$\\frac32$",
      "$\\frac52$",
      "$\\frac72$",
      "$\\frac92$",
      "$\\frac{11}2$"
    ],
    "answer": "②",
    "solution": "(i) $x<1$에서 $f'(x)=2^x\\ln2$이므로 지수함수의 부정적분 공식으로 $f(x)=2^x+C_1$이다.\n그래프가 원점을 지나므로 $f(0)=2^0+C_1=1+C_1=0$에서 $C_1=-1$이다.\n따라서 $f(x)=2^x-1$이고, 연속성으로 $f(1)=\\lim_{x\\to1^-}(2^x-1)=2-1=1$이다.\n(ii) $x>1$에서 $f'(x)=4x^{-3}$이므로 거듭제곱의 부정적분 공식 $\\int x^n\\,dx=\\frac{x^{n+1}}{n+1}$으로 $f(x)=4\\cdot\\frac{x^{-2}}{-2}+C_2=-\\frac{2}{x^2}+C_2$이다.\n$x=1$에서 연속이므로 $\\lim_{x\\to1^+}f(x)=-\\frac{2}{1^2}+C_2=-2+C_2=1$에서 $C_2=3$이다.\n$x=2$를 대입하면 $f(2)=-\\frac{2}{2^2}+3=-\\frac12+3=\\frac52$이다.\n따라서 정답은 ②이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-093",
    "problemTypeKey": "PT_CALCULUS_FUNCTION_INTEGRAL",
    "templateKey": "TPL_CALCULUS_INTEGRAL_POWER_EXP_LOG",
    "crossConceptKeys": [
      "CC_FUNCTION_CONTINUITY",
      "CC_POINT_ON_CURVE_SUBSTITUTION"
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
    "content": "실수 전체에서 미분가능한 함수 $f$가 $f(\\frac{\\pi}{2})=1$이고 $f'(x)=\\begin{cases}2\\cos x&(x<0)\\\\ 2-2\\sin x&(x>0)\\end{cases}$를 만족시킨다. $f(\\pi)-f(-\\pi)$의 값은?",
    "choices": [
      "$2\\pi-4$",
      "$2\\pi-3$",
      "$2\\pi-2$",
      "$2\\pi-1$",
      "$2\\pi$"
    ],
    "answer": "①",
    "solution": "(i) $x>0$에서 $f'(x)=2-2\\sin x$이므로 삼각함수의 부정적분 공식으로 $f(x)=2x+2\\cos x+C_+$이다.\n$f\\left(\\frac\\pi2\\right)=1$을 대입하면 $2\\cdot\\frac\\pi2+2\\cos\\frac\\pi2+C_+=\\pi+0+C_+=1$에서 $C_+=1-\\pi$이다.\n따라서 $f(\\pi)=2\\pi+2\\cos\\pi+(1-\\pi)=2\\pi-2+1-\\pi=\\pi-1$이다.\n미분가능하면 연속이므로 $f(0)=\\lim_{x\\to0^+}f(x)=0+2\\cdot1+1-\\pi=3-\\pi$이다.\n(ii) $x<0$에서 $f'(x)=2\\cos x$이므로 코사인함수의 부정적분 공식으로 $f(x)=2\\sin x+C_-$이다.\n$x=0$에서 연속이므로 $\\lim_{x\\to0^-}f(x)=2\\sin0+C_-=0+C_-=3-\\pi$에서 $C_-=3-\\pi$이다.\n따라서 $f(-\\pi)=2\\sin(-\\pi)+(3-\\pi)=0+3-\\pi=3-\\pi$이다.\n두 값을 빼면 $f(\\pi)-f(-\\pi)=(\\pi-1)-(3-\\pi)=2\\pi-4$이다.\n주의: $x=0$에서 좌미분계수는 $2\\cos0=2$, 우미분계수는 $2-2\\sin0=2$로 같아 미분가능 조건과 모순되지 않는다.\n따라서 정답은 ①이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-093",
    "problemTypeKey": "PT_CALCULUS_FUNCTION_INTEGRAL",
    "templateKey": "TPL_CALCULUS_INTEGRAL_POWER_EXP_LOG",
    "crossConceptKeys": [
      "CC_DIFFERENTIABILITY"
    ],
    "conditionKeys": [
      "COND_PIECEWISE_DOMAIN_PARTITION"
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
    "content": "실수 전체에서 연속인 함수 $f$에 대하여 $f'(x)=\\begin{cases}4-2\\cos 2x&(x>0)\\\\ k\\cos x&(x<0)\\end{cases}$이다. $f(\\frac{\\pi}{4})=f(-\\frac{\\pi}{2})=3$일 때, 상수 $k$의 값은?",
    "choices": [
      "$-2-\\pi$",
      "$-1-\\pi$",
      "$-\\pi$",
      "$1-\\pi$",
      "$2-\\pi$"
    ],
    "answer": "④",
    "solution": "(i) $x>0$에서 $f'(x)=4-2\\cos2x$이므로 합성함수의 부정적분으로 $f(x)=4x-\\sin2x+C_+$이다.\n$f\\left(\\frac\\pi4\\right)=3$을 대입하면 $4\\cdot\\frac\\pi4-\\sin\\frac\\pi2+C_+=\\pi-1+C_+=3$에서 $C_+=4-\\pi$이다.\n연속성으로 $f(0)=\\lim_{x\\to0^+}f(x)=0-\\sin0+4-\\pi=4-\\pi$이다.\n(ii) $x<0$에서 $f'(x)=k\\cos x$이므로 코사인함수의 부정적분 공식으로 $f(x)=k\\sin x+C_-$이다.\n$x=0$에서 연속이므로 $\\lim_{x\\to0^-}f(x)=k\\sin0+C_-=0+C_-=4-\\pi$에서 $C_-=4-\\pi$이다.\n$f\\left(-\\frac\\pi2\\right)=3$을 대입하면 $k\\sin\\left(-\\frac\\pi2\\right)+(4-\\pi)=k(-1)+4-\\pi=3$이다.\n이를 정리하면 $-k+4-\\pi=3$에서 $-k=\\pi-1$이므로 $k=1-\\pi$이다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-093",
    "problemTypeKey": "PT_CALCULUS_FUNCTION_INTEGRAL",
    "templateKey": "TPL_CALCULUS_INTEGRAL_POWER_EXP_LOG",
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
    "content": "실수 전체에서 연속인 함수 $f$가 $f(0)=0$이고 $f'(x)=\\begin{cases}2&(x<-2)\\\\ \\sin(\\frac{\\pi x}{4})&(-2<x<2)\\\\ -2&(x>2)\\end{cases}$를 만족시킨다. $f(-3)+f(3)$의 값은? [그림: 좌표평면에 $y=f'(x)$의 그래프를 그린다. $x<-2$에서는 높이 $2$, $x>2$에서는 높이 $-2$인 수평 반직선을 그린다. $-2<x<2$에서는 원점 $(0,0)$을 지나는 증가하는 사인 곡선 $y=\\sin(\\frac{\\pi x}{4})$를 그린다. $(-2,2),(-2,-1),(2,1),(2,-2)$에는 빈 원을 표시하고, $x=\\pm2$에는 수직 점선을 그린다.]",
    "choices": [
      "$\\frac8\\pi-8$",
      "$\\frac8\\pi-7$",
      "$\\frac8\\pi-6$",
      "$\\frac8\\pi-5$",
      "$\\frac8\\pi-4$"
    ],
    "answer": "⑤",
    "solution": "(i) $-2<x<2$에서 $f'(x)=\\sin\\frac{\\pi x}{4}$이므로 합성 삼각함수의 부정적분 공식으로 $f(x)=-\\frac4\\pi\\cos\\frac{\\pi x}{4}+C_0$이다.\n$f(0)=0$을 대입하면 $-\\frac4\\pi\\cos0+C_0=-\\frac4\\pi+C_0=0$에서 $C_0=\\frac4\\pi$이다.\n따라서 $f(\\pm2)=-\\frac4\\pi\\cos\\left(\\pm\\frac\\pi2\\right)+\\frac4\\pi=-\\frac4\\pi\\cdot0+\\frac4\\pi=\\frac4\\pi$이다.\n(ii) $x<-2$에서 $f'(x)=2$이므로 상수함수의 부정적분으로 $f(x)=2x+C_-$이다.\n$x=-2$에서 연속이므로 $2(-2)+C_-=-4+C_-=\\frac4\\pi$에서 $C_-=\\frac4\\pi+4$이다.\n따라서 $f(-3)=2(-3)+\\frac4\\pi+4=-6+4+\\frac4\\pi=\\frac4\\pi-2$이다.\n(iii) $x>2$에서 $f'(x)=-2$이므로 $f(x)=-2x+C_+$이다.\n$x=2$에서 연속이므로 $-2(2)+C_+=-4+C_+=\\frac4\\pi$에서 $C_+=\\frac4\\pi+4$이다.\n따라서 $f(3)=-2(3)+\\frac4\\pi+4=-6+4+\\frac4\\pi=\\frac4\\pi-2$이다.\n두 값을 더하면 $f(-3)+f(3)=\\left(\\frac4\\pi-2\\right)+\\left(\\frac4\\pi-2\\right)=\\frac8\\pi-4$이다.\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-093",
    "problemTypeKey": "PT_CALCULUS_FUNCTION_INTEGRAL",
    "templateKey": "TPL_CALCULUS_INTEGRAL_POWER_EXP_LOG",
    "crossConceptKeys": [
      "CC_CONTINUOUS_FUNCTION_GRAPH_INTERPRETATION",
      "CC_FUNCTION_CONTINUITY"
    ],
    "conditionKeys": [
      "COND_PIECEWISE_DOMAIN_PARTITION"
    ],
    "integrationPattern": "SEQUENTIAL"
  }
];
