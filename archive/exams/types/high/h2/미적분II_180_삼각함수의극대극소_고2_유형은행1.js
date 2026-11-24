window.examTitle = "미적분II_180_삼각함수의극대극소_고2_유형은행1";

window.questionBank = [
  {
    "id": 1,
    "category": "도함수의 활용",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-06",
    "standardUnit": "도함수의 활용",
    "standardUnitOrder": 6,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "도함수의 활용"
    ],
    "wide": false,
    "content": "$(0,2\\pi)$에서 $f(x)=x-2\\sin x$의 극댓값과 극솟값의 합은?",
    "choices": [
      "$\\pi$",
      "$3\\pi/2$",
      "$2\\pi$",
      "$5\\pi/2$",
      "$3\\pi$"
    ],
    "answer": "③",
    "solution": "미분하면 $f'(x)=1-2\\cos x$이다.\n$f'(x)=0$에서 $\\cos x=\\frac12$이므로 $(0,2\\pi)$에서 $x=\\frac{\\pi}{3},\\frac{5\\pi}{3}$이다.\n$f'$의 부호는 $\\left(0,\\frac{\\pi}{3}\\right)$에서 $-$, $\\left(\\frac{\\pi}{3},\\frac{5\\pi}{3}\\right)$에서 $+$, $\\left(\\frac{5\\pi}{3},2\\pi\\right)$에서 $-$이다.\n따라서 $x=\\frac{\\pi}{3}$에서 극솟값 $f\\left(\\frac{\\pi}{3}\\right)=\\frac{\\pi}{3}-2\\cdot\\frac{\\sqrt3}{2}=\\frac{\\pi}{3}-\\sqrt3$이다.\n$x=\\frac{5\\pi}{3}$에서 극댓값 $f\\left(\\frac{5\\pi}{3}\\right)=\\frac{5\\pi}{3}-2\\left(-\\frac{\\sqrt3}{2}\\right)=\\frac{5\\pi}{3}+\\sqrt3$이다.\n합은 $\\frac{\\pi}{3}-\\sqrt3+\\frac{5\\pi}{3}+\\sqrt3=2\\pi$이다.\n따라서 정답은 ③이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-086",
    "problemTypeKey": "PT_DERIVATIVE_EXTREMA",
    "templateKey": "TPL_EXTREMA_VALUE_PARAMETER",
    "crossConceptKeys": [
      "CC_TRIGONOMETRIC_EXTREMUM",
      "CC_TRIGONOMETRIC_EQUATION"
    ],
    "conditionKeys": [
      "COND_RESTRICTED_INTERVAL"
    ],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 2,
    "category": "도함수의 활용",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-06",
    "standardUnit": "도함수의 활용",
    "standardUnitOrder": 6,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "도함수의 활용"
    ],
    "wide": false,
    "content": "$(0,2\\pi)$에서 $f(x)=\\sin x(1-\\cos x)$가 $x=a$에서 극소일 때, $a$는?",
    "choices": [
      "$\\pi/3$",
      "$2\\pi/3$",
      "$\\pi$",
      "$4\\pi/3$",
      "$5\\pi/3$"
    ],
    "answer": "④",
    "solution": "곱의 미분법으로 $f'(x)=\\cos x(1-\\cos x)+\\sin x\\cdot\\sin x$이다.\n$\\sin^2x=1-\\cos^2x$를 대입하면 $f'(x)=\\cos x-\\cos^2x+1-\\cos^2x=1+\\cos x-2\\cos^2x$이다.\n인수분해하면 $f'(x)=(1-\\cos x)(1+2\\cos x)$이다.\n$(0,2\\pi)$에서 $1-\\cos x>0$이므로 $f'(x)=0$은 $\\cos x=-\\frac12$, 즉 $x=\\frac{2\\pi}{3},\\frac{4\\pi}{3}$이다.\n$f'$의 부호는 $\\frac{2\\pi}{3}$에서 $+$에서 $-$로, $\\frac{4\\pi}{3}$에서 $-$에서 $+$로 바뀐다.\n따라서 $x=\\frac{4\\pi}{3}$에서 극소이고 $a=\\frac{4\\pi}{3}$이다.\n주의: $1-\\cos x=0$인 $x=0$은 열린구간에 포함되지 않으므로 근이 아니다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-086",
    "problemTypeKey": "PT_DERIVATIVE_EXTREMA",
    "templateKey": "TPL_EXTREMA_VALUE_PARAMETER",
    "crossConceptKeys": [
      "CC_TRIGONOMETRIC_EXTREMUM",
      "CC_TRIGONOMETRIC_EQUATION"
    ],
    "conditionKeys": [
      "COND_RESTRICTED_INTERVAL"
    ],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 3,
    "category": "도함수의 활용",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-06",
    "standardUnit": "도함수의 활용",
    "standardUnitOrder": 6,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "도함수의 활용"
    ],
    "wide": false,
    "content": "$(\\pi/2,3\\pi/2)$에서 $f(x)=6\\cos x-\\cos 2x$가 $x=a$에서 극솟값 $b$를 가질 때, $ab$는?",
    "choices": [
      "$-9\\pi$",
      "$-8\\pi$",
      "$-7\\pi$",
      "$-6\\pi$",
      "$-5\\pi$"
    ],
    "answer": "③",
    "solution": "합성함수의 미분법으로 $f'(x)=-6\\sin x+2\\sin 2x$이다.\n배각 공식 $\\sin 2x=2\\sin x\\cos x$를 쓰면 $f'(x)=-6\\sin x+4\\sin x\\cos x=2\\sin x(2\\cos x-3)$이다.\n$\\left(\\frac{\\pi}{2},\\frac{3\\pi}{2}\\right)$에서 $2\\cos x-3\\le-1<0$이므로 $f'$의 부호는 $\\sin x$의 부호와 반대이다.\n$\\left(\\frac{\\pi}{2},\\pi\\right)$에서 $\\sin x>0$이므로 $f'<0$, $\\left(\\pi,\\frac{3\\pi}{2}\\right)$에서 $\\sin x<0$이므로 $f'>0$이다.\n따라서 $x=\\pi$에서 극소이고 $a=\\pi$이다.\n$b=f(\\pi)=6\\cos\\pi-\\cos 2\\pi=6(-1)-1=-7$이다.\n$ab=\\pi\\cdot(-7)=-7\\pi$이다.\n따라서 정답은 ③이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-086",
    "problemTypeKey": "PT_DERIVATIVE_EXTREMA",
    "templateKey": "TPL_EXTREMA_VALUE_PARAMETER",
    "crossConceptKeys": [
      "CC_TRIGONOMETRIC_EXTREMUM",
      "CC_TRIGONOMETRIC_EQUATION"
    ],
    "conditionKeys": [
      "COND_RESTRICTED_INTERVAL"
    ],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 4,
    "category": "도함수의 활용",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-06",
    "standardUnit": "도함수의 활용",
    "standardUnitOrder": 6,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "도함수의 활용"
    ],
    "wide": false,
    "content": "$(0,\\pi)$에서 $f(x)=2x+2\\cos 2x$의 극댓값은? 이계도함수를 이용하여 구하여라.",
    "choices": [
      "$\\pi/6-\\sqrt3$",
      "$\\pi/3$",
      "$5\\pi/12$",
      "$\\pi/6+\\sqrt3/2$",
      "$\\pi/6+\\sqrt3$"
    ],
    "answer": "⑤",
    "solution": "합성함수의 미분법으로 $f'(x)=2-4\\sin 2x$이고 $f''(x)=-8\\cos 2x$이다.\n$f'(x)=0$에서 $\\sin 2x=\\frac12$이고 $0<2x<2\\pi$이므로 $2x=\\frac{\\pi}{6},\\frac{5\\pi}{6}$, 즉 $x=\\frac{\\pi}{12},\\frac{5\\pi}{12}$이다.\n(i) $x=\\frac{\\pi}{12}$에서 $f''\\left(\\frac{\\pi}{12}\\right)=-8\\cos\\frac{\\pi}{6}=-8\\cdot\\frac{\\sqrt3}{2}=-4\\sqrt3<0$이므로 이계도함수 판정법에 의해 극대이다.\n(ii) $x=\\frac{5\\pi}{12}$에서 $f''\\left(\\frac{5\\pi}{12}\\right)=-8\\cos\\frac{5\\pi}{6}=-8\\left(-\\frac{\\sqrt3}{2}\\right)=4\\sqrt3>0$이므로 극소이다.\n극댓값은 $f\\left(\\frac{\\pi}{12}\\right)=2\\cdot\\frac{\\pi}{12}+2\\cos\\frac{\\pi}{6}=\\frac{\\pi}{6}+2\\cdot\\frac{\\sqrt3}{2}=\\frac{\\pi}{6}+\\sqrt3$이다.\n$f\\left(\\frac{5\\pi}{12}\\right)$는 극솟값이므로 구하는 극댓값이 아니다.\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-086",
    "problemTypeKey": "PT_DERIVATIVE_EXTREMA",
    "templateKey": "TPL_EXTREMA_VALUE_PARAMETER",
    "crossConceptKeys": [
      "CC_TRIGONOMETRIC_EXTREMUM",
      "CC_FUNCTION_EXTREMA"
    ],
    "conditionKeys": [
      "COND_RESTRICTED_INTERVAL"
    ],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 5,
    "category": "도함수의 활용",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-06",
    "standardUnit": "도함수의 활용",
    "standardUnitOrder": 6,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "도함수의 활용"
    ],
    "wide": false,
    "content": "$(0,2\\pi)$에서 $f(x)=2\\cos x+2x\\sin x$가 $x=a$에서 극댓값 $b$를 가질 때, $ab$는?",
    "choices": [
      "$-\\pi^2$",
      "$-\\pi^2/2$",
      "$0$",
      "$\\pi^2/4$",
      "$\\pi^2/2$"
    ],
    "answer": "⑤",
    "solution": "곱의 미분법으로 $(2x\\sin x)'=2\\sin x+2x\\cos x$이므로 $f'(x)=-2\\sin x+2\\sin x+2x\\cos x=2x\\cos x$이다.\n$(0,2\\pi)$에서 $2x>0$이므로 $f'$의 부호는 $\\cos x$의 부호와 같다.\n$\\cos x$는 $\\left(0,\\frac{\\pi}{2}\\right)$에서 $+$, $\\left(\\frac{\\pi}{2},\\frac{3\\pi}{2}\\right)$에서 $-$, $\\left(\\frac{3\\pi}{2},2\\pi\\right)$에서 $+$이다.\n따라서 $f$는 $x=\\frac{\\pi}{2}$에서 극대이므로 $a=\\frac{\\pi}{2}$이다.\n$b=f\\left(\\frac{\\pi}{2}\\right)=2\\cos\\frac{\\pi}{2}+2\\cdot\\frac{\\pi}{2}\\sin\\frac{\\pi}{2}=0+\\pi\\cdot1=\\pi$이다.\n$ab=\\frac{\\pi}{2}\\cdot\\pi=\\frac{\\pi^2}{2}$이다.\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-086",
    "problemTypeKey": "PT_DERIVATIVE_EXTREMA",
    "templateKey": "TPL_EXTREMA_VALUE_PARAMETER",
    "crossConceptKeys": [
      "CC_TRIGONOMETRIC_EXTREMUM",
      "CC_TRIGONOMETRIC_EQUATION"
    ],
    "conditionKeys": [
      "COND_RESTRICTED_INTERVAL"
    ],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 6,
    "category": "도함수의 활용",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-06",
    "standardUnit": "도함수의 활용",
    "standardUnitOrder": 6,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "도함수의 활용"
    ],
    "wide": false,
    "content": "$(-\\pi/2,\\pi/2)$에서 $f(x)=\\tan x-4x$의 극댓값과 극솟값의 곱은?",
    "choices": [
      "$-(4\\pi/3)^2$",
      "$-(4\\pi/3-\\sqrt3)^2$",
      "$-(\\pi-\\sqrt3)^2$",
      "$-(2\\pi/3-\\sqrt3)^2$",
      "$0$"
    ],
    "answer": "②",
    "solution": "$\\tan x$의 미분 공식으로 $f'(x)=\\frac{1}{\\cos^2x}-4$이다.\n$f'(x)=0$에서 $\\frac{1}{\\cos^2x}=4$, 즉 $\\cos^2x=\\frac14$이다.\n$\\left(-\\frac{\\pi}{2},\\frac{\\pi}{2}\\right)$에서 $\\cos x>0$이므로 $\\cos x=\\frac12$이고 $x=\\pm\\frac{\\pi}{3}$이다.\n$f'(x)=\\frac{1-4\\cos^2x}{\\cos^2x}=\\frac{(1-2\\cos x)(1+2\\cos x)}{\\cos^2x}$이고 $1+2\\cos x>0$이므로 부호는 $1-2\\cos x$와 같다.\n따라서 $f'$의 부호는 $\\left(-\\frac{\\pi}{2},-\\frac{\\pi}{3}\\right)$에서 $+$, $\\left(-\\frac{\\pi}{3},\\frac{\\pi}{3}\\right)$에서 $-$, $\\left(\\frac{\\pi}{3},\\frac{\\pi}{2}\\right)$에서 $+$이다.\n극댓값은 $f\\left(-\\frac{\\pi}{3}\\right)=\\tan\\left(-\\frac{\\pi}{3}\\right)-4\\left(-\\frac{\\pi}{3}\\right)=-\\sqrt3+\\frac{4\\pi}{3}$이다.\n극솟값은 $f\\left(\\frac{\\pi}{3}\\right)=\\sqrt3-\\frac{4\\pi}{3}$이다.\n두 값은 부호만 다른 반수이므로 곱은 $-\\left(\\frac{4\\pi}{3}-\\sqrt3\\right)^2$이다.\n주의: 구간에서 $\\cos x>0$이므로 $\\cos x=-\\frac12$인 해는 택하지 않는다.\n따라서 정답은 ②이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-086",
    "problemTypeKey": "PT_DERIVATIVE_EXTREMA",
    "templateKey": "TPL_EXTREMA_VALUE_PARAMETER",
    "crossConceptKeys": [
      "CC_TRIGONOMETRIC_EXTREMUM",
      "CC_TRIGONOMETRIC_EQUATION"
    ],
    "conditionKeys": [
      "COND_RESTRICTED_INTERVAL"
    ],
    "integrationPattern": "SEQUENTIAL"
  }
];
