window.examTitle = "미적분II_197_삼각함수의최대최소_고2_유형은행1";

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
    "content": "$[0,\\pi]$에서 $f(x)=2\\sin x-2x\\cos x$의 최댓값과 최솟값의 합은?",
    "choices": [
      "$-\\pi$",
      "$0$",
      "$\\pi$",
      "$2\\pi$",
      "$3\\pi$"
    ],
    "answer": "④",
    "solution": "곱의 미분법으로 $f'(x)=2\\cos x-2(\\cos x-x\\sin x)=2x\\sin x$이다.\n$0<x<\\pi$에서 $2x>0$, $\\sin x>0$이므로 $f'(x)>0$이다.\n따라서 $f$는 $[0,\\pi]$에서 증가하고 최솟값은 $f(0)=0$이다.\n최댓값은 $f(\\pi)=2\\sin\\pi-2\\pi\\cos\\pi=0-2\\pi(-1)=2\\pi$이다.\n최댓값과 최솟값의 합은 $2\\pi+0=2\\pi$이다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-087",
    "problemTypeKey": "PT_DERIVATIVE_MAX_MIN",
    "templateKey": "TPL_FUNCTION_DOMAIN_OPTIMIZATION",
    "crossConceptKeys": [
      "CC_DERIVATIVE_SIGN_EXTREMA_ANALYSIS",
      "CC_FUNCTION_MONOTONICITY"
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
    "content": "$[0,\\pi]$에서 $f(x)=2x+4\\sin x$의 최댓값과 최솟값의 합은?",
    "choices": [
      "$4\\pi/3-2\\sqrt3$",
      "$4\\pi/3$",
      "$4\\pi/3+\\sqrt3$",
      "$2\\pi$",
      "$4\\pi/3+2\\sqrt3$"
    ],
    "answer": "⑤",
    "solution": "사인함수의 미분법으로 $f'(x)=2+4\\cos x$이다.\n$f'(x)=0$이면 $\\cos x=-\\frac12$이고, $[0,\\pi]$에서 $x=\\frac{2\\pi}{3}$이다.\n$0\\le x<\\frac{2\\pi}{3}$에서 $f'(x)>0$, $\\frac{2\\pi}{3}<x\\le\\pi$에서 $f'(x)<0$이다.\n따라서 최댓값은 $f\\left(\\frac{2\\pi}{3}\\right)=\\frac{4\\pi}{3}+4\\cdot\\frac{\\sqrt3}{2}=\\frac{4\\pi}{3}+2\\sqrt3$이다.\n끝점의 값은 $f(0)=0$, $f(\\pi)=2\\pi$이므로 최솟값은 $0$이다.\n최댓값과 최솟값의 합은 $\\frac{4\\pi}{3}+2\\sqrt3+0=\\frac{4\\pi}{3}+2\\sqrt3$이다.\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-087",
    "problemTypeKey": "PT_DERIVATIVE_MAX_MIN",
    "templateKey": "TPL_FUNCTION_DOMAIN_OPTIMIZATION",
    "crossConceptKeys": [
      "CC_DERIVATIVE_ROOT_SOLVING",
      "CC_DERIVATIVE_SIGN_EXTREMA_ANALYSIS"
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
    "content": "$[0,\\pi]$에서 $f(x)=2\\sin x-\\sin 2x$의 최댓값과 최솟값의 차는?",
    "choices": [
      "$\\sqrt3/2$",
      "$\\sqrt3$",
      "$5\\sqrt3/4$",
      "$3\\sqrt3/2$",
      "$3\\sqrt3$"
    ],
    "answer": "④",
    "solution": "합성함수의 미분법으로 $f'(x)=2\\cos x-2\\cos 2x$이다.\n$\\cos 2x=2\\cos^2x-1$을 대입하면 $f'(x)=2\\cos x-2(2\\cos^2x-1)=-4\\cos^2x+2\\cos x+2$이다.\n인수분해하면 $f'(x)=2(1-\\cos x)(2\\cos x+1)$이다.\n$0<x<\\pi$에서 $1-\\cos x>0$이므로 $f'$의 부호는 $2\\cos x+1$의 부호와 같다.\n$x=\\frac{2\\pi}{3}$ 전후에서 $f'$가 $+$에서 $-$로 바뀌므로 최댓값은 $f\\left(\\frac{2\\pi}{3}\\right)$이다.\n$f\\left(\\frac{2\\pi}{3}\\right)=2\\cdot\\frac{\\sqrt3}{2}-\\sin\\frac{4\\pi}{3}=\\sqrt3-\\left(-\\frac{\\sqrt3}{2}\\right)=\\frac{3\\sqrt3}{2}$이다.\n$f(0)=f(\\pi)=0$이므로 최솟값은 $0$이다.\n최댓값과 최솟값의 차는 $\\frac{3\\sqrt3}{2}-0=\\frac{3\\sqrt3}{2}$이다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-087",
    "problemTypeKey": "PT_DERIVATIVE_MAX_MIN",
    "templateKey": "TPL_FUNCTION_DOMAIN_OPTIMIZATION",
    "crossConceptKeys": [
      "CC_TRIGONOMETRIC_IDENTITY",
      "CC_DERIVATIVE_ROOT_SOLVING"
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
    "content": "$[-\\pi/4,\\pi/4]$에서 $f(x)=e^{2x}/\\cos x$의 최댓값과 최솟값의 곱은?",
    "choices": [
      "2",
      "3",
      "4",
      "5",
      "6"
    ],
    "answer": "①",
    "solution": "몫의 미분법으로 $f'(x)=\\frac{2e^{2x}\\cos x-e^{2x}(-\\sin x)}{\\cos^2x}=\\frac{e^{2x}(2\\cos x+\\sin x)}{\\cos^2x}$이다.\n$-\\frac{\\pi}{4}\\le x\\le\\frac{\\pi}{4}$에서 $\\cos x>0$이고, $2\\cos x+\\sin x=\\cos x(2+\\tan x)$이다.\n$\\tan x\\ge-1$이므로 $2+\\tan x\\ge1>0$이고, 따라서 $f'(x)>0$이다.\n$f$는 주어진 구간에서 증가하므로 최솟값은 $f\\left(-\\frac{\\pi}{4}\\right)=\\frac{e^{-\\pi/2}}{\\sqrt2/2}=\\sqrt2e^{-\\pi/2}$이다.\n최댓값은 $f\\left(\\frac{\\pi}{4}\\right)=\\frac{e^{\\pi/2}}{\\sqrt2/2}=\\sqrt2e^{\\pi/2}$이다.\n최댓값과 최솟값의 곱은 $(\\sqrt2e^{-\\pi/2})(\\sqrt2e^{\\pi/2})=2e^0=2$이다.\n따라서 정답은 ①이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-087",
    "problemTypeKey": "PT_DERIVATIVE_MAX_MIN",
    "templateKey": "TPL_FUNCTION_DOMAIN_OPTIMIZATION",
    "crossConceptKeys": [
      "CC_DERIVATIVE_SIGN_EXTREMA_ANALYSIS",
      "CC_RESTRICTED_DOMAIN_EXTREMA"
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
    "content": "$[0,2\\pi]$에서 $f(x)=\\sin x(1-\\cos x)-1$의 최댓값과 최솟값의 합은?",
    "choices": [
      "$-2$",
      "$-1$",
      "$0$",
      "$1$",
      "$2$"
    ],
    "answer": "①",
    "solution": "곱의 미분법으로 $f'(x)=\\cos x(1-\\cos x)+\\sin x\\cdot\\sin x$이다.\n$\\sin^2x=1-\\cos^2x$를 대입하면 $f'(x)=\\cos x-\\cos^2x+1-\\cos^2x=1+\\cos x-2\\cos^2x$이다.\n인수분해하면 $f'(x)=(1-\\cos x)(2\\cos x+1)$이다.\n$0<x<2\\pi$에서 $1-\\cos x>0$이므로 $f'$의 부호는 $2\\cos x+1$의 부호와 같다.\n$f'$의 부호는 $+,-,+$로 바뀌므로 $x=\\frac{2\\pi}{3}$에서 극대, $x=\\frac{4\\pi}{3}$에서 극소이다.\n$f\\left(\\frac{2\\pi}{3}\\right)=\\frac{\\sqrt3}{2}\\left(1+\\frac12\\right)-1=\\frac{3\\sqrt3}{4}-1$이다.\n$f\\left(\\frac{4\\pi}{3}\\right)=-\\frac{\\sqrt3}{2}\\left(1+\\frac12\\right)-1=-\\frac{3\\sqrt3}{4}-1$이다.\n$f(0)=f(2\\pi)=-1$이므로 위의 두 극값이 전체 최댓값과 최솟값이다.\n최댓값과 최솟값의 합은 $\\left(\\frac{3\\sqrt3}{4}-1\\right)+\\left(-\\frac{3\\sqrt3}{4}-1\\right)=-2$이다.\n따라서 정답은 ①이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-087",
    "problemTypeKey": "PT_DERIVATIVE_MAX_MIN",
    "templateKey": "TPL_FUNCTION_DOMAIN_OPTIMIZATION",
    "crossConceptKeys": [
      "CC_TRIGONOMETRIC_IDENTITY",
      "CC_DERIVATIVE_ROOT_SOLVING",
      "CC_DERIVATIVE_SIGN_EXTREMA_ANALYSIS"
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
    "content": "$[0,2\\pi]$에서 $f(x)=3\\sin x/(2+\\cos x)$가 $x=a$에서 최대, $x=b$에서 최소일 때, $b-a$는?",
    "choices": [
      "$\\pi/3$",
      "$\\pi/2$",
      "$2\\pi/3$",
      "$5\\pi/6$",
      "$\\pi$"
    ],
    "answer": "③",
    "solution": "몫의 미분법으로 $f'(x)=\\frac{3\\cos x(2+\\cos x)-3\\sin x(-\\sin x)}{(2+\\cos x)^2}$이다.\n삼각함수의 기본 관계식 $\\cos^2x+\\sin^2x=1$로 분자를 정리하면 $3(2\\cos x+\\cos^2x+\\sin^2x)=3(2\\cos x+1)$이다.\n따라서 $f'(x)=\\frac{3(2\\cos x+1)}{(2+\\cos x)^2}$이다.\n$f'(x)=0$이면 $\\cos x=-\\frac12$이고, $[0,2\\pi]$에서 $x=\\frac{2\\pi}{3},\\frac{4\\pi}{3}$이다.\n$f'$의 부호는 $\\frac{2\\pi}{3}$ 전후에서 $+$에서 $-$로, $\\frac{4\\pi}{3}$ 전후에서 $-$에서 $+$로 바뀐다.\n따라서 $x=\\frac{2\\pi}{3}$에서 최대, $x=\\frac{4\\pi}{3}$에서 최소이므로 $a=\\frac{2\\pi}{3}$, $b=\\frac{4\\pi}{3}$이다.\n양끝에서 $f(0)=f(2\\pi)=0$이고 최댓값은 양수, 최솟값은 음수이므로 이들이 전체 최대·최소이다.\n$b-a=\\frac{4\\pi}{3}-\\frac{2\\pi}{3}=\\frac{2\\pi}{3}$이다.\n따라서 정답은 ③이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-087",
    "problemTypeKey": "PT_DERIVATIVE_MAX_MIN",
    "templateKey": "TPL_FUNCTION_DOMAIN_OPTIMIZATION",
    "crossConceptKeys": [
      "CC_DERIVATIVE_SIGN_EXTREMA_ANALYSIS",
      "CC_TRIGONOMETRIC_EQUATION"
    ],
    "conditionKeys": [
      "COND_RESTRICTED_INTERVAL"
    ],
    "integrationPattern": "SEQUENTIAL"
  }
];
