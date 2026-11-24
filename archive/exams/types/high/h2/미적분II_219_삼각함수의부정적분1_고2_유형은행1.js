window.examTitle = "미적분II_219_삼각함수의부정적분1_고2_유형은행1";

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
    "content": "$-\\frac{\\pi}{2}<x<\\pi$에서 $f(x)=\\int\\frac{\\cos^2x}{1+\\sin x}\\,dx$이다. $f(0)=2$일 때, $f(\\frac{\\pi}{2})$의 값은?",
    "choices": [
      "$\\frac{\\pi}{2}+1$",
      "$\\frac{\\pi}{2}+2$",
      "$\\frac{\\pi}{2}+3$",
      "$\\frac{\\pi}{2}+4$",
      "$\\frac{\\pi}{2}+5$"
    ],
    "answer": "①",
    "solution": "삼각함수의 기본 관계 $\\sin^2x+\\cos^2x=1$에서 $\\cos^2x=1-\\sin^2x$이다.\n제곱의 차 공식으로 $1-\\sin^2x=(1+\\sin x)(1-\\sin x)$로 인수분해한다.\n$-\\frac{\\pi}{2}<x<\\pi$에서 $1+\\sin x>0$이므로 약분하면 피적분함수는 $1-\\sin x$이다.\n부정적분을 계산하면 $f(x)=x+\\cos x+C$이다.\n$f(0)=2$를 대입하면 $0+\\cos0+C=0+1+C=2$이므로 $C=1$이다.\n따라서 $f(x)=x+\\cos x+1$이고 $f(\\frac{\\pi}{2})=\\frac{\\pi}{2}+0+1=\\frac{\\pi}{2}+1$이다.\n따라서 정답은 ①이다.",
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
    "conditionKeys": [
      "COND_RESTRICTED_INTERVAL"
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
    "content": "$0<x<\\pi$에서 $f(x)=\\int\\frac{2}{(1+\\cot^2x)\\sin^2x}\\,dx$이다. $f(\\frac{\\pi}{6})=\\frac{\\pi}{6}$일 때, $f(\\frac{\\pi}{3})$의 값은?",
    "choices": [
      "$\\frac{\\pi}{2}$",
      "$\\frac{2\\pi}{3}$",
      "$\\frac{3\\pi}{4}$",
      "$\\frac{5\\pi}{6}$",
      "$\\pi$"
    ],
    "answer": "①",
    "solution": "삼각함수의 기본 관계 $1+\\cot^2x=\\csc^2x$이다.\n$\\csc^2x=\\frac{1}{\\sin^2x}$이므로 분모는 $(1+\\cot^2x)\\sin^2x=\\frac{1}{\\sin^2x}\\cdot\\sin^2x=1$이다.\n따라서 $f'(x)=2$이고 상수함수의 부정적분으로 $f(x)=2x+C$이다.\n$f(\\frac{\\pi}{6})=\\frac{\\pi}{6}$을 대입하면 $2\\cdot\\frac{\\pi}{6}+C=\\frac{\\pi}{3}+C=\\frac{\\pi}{6}$이므로 $C=-\\frac{\\pi}{6}$이다.\n따라서 $f(\\frac{\\pi}{3})=2\\cdot\\frac{\\pi}{3}-\\frac{\\pi}{6}=\\frac{2\\pi}{3}-\\frac{\\pi}{6}=\\frac{\\pi}{2}$이다.\n따라서 정답은 ①이다.",
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
    "conditionKeys": [
      "COND_RESTRICTED_INTERVAL"
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
    "content": "$0<x<\\pi$에서 곡선 $y=f(x)$의 점 $(x,f(x))$에서 접선의 기울기가 $\\cot^2x$이다. 곡선이 $(\\frac{\\pi}{2},2)$를 지날 때, $f(\\frac{\\pi}{4})$의 값은?",
    "choices": [
      "$\\frac{\\pi}{4}-2$",
      "$\\frac{\\pi}{4}-1$",
      "$\\frac{\\pi}{4}$",
      "$\\frac{\\pi}{4}+1$",
      "$\\frac{\\pi}{4}+2$"
    ],
    "answer": "④",
    "solution": "접선의 기울기가 도함수이므로 $f'(x)=\\cot^2x$이다.\n삼각함수의 기본 관계 $\\csc^2x-\\cot^2x=1$에서 $\\cot^2x=\\csc^2x-1$이다.\n$\\csc^2x$의 부정적분 공식 $\\int\\csc^2x\\,dx=-\\cot x$를 쓰면 $f(x)=-\\cot x-x+C$이다.\n$f(\\frac{\\pi}{2})=2$를 대입하면 $-\\cot\\frac{\\pi}{2}-\\frac{\\pi}{2}+C=0-\\frac{\\pi}{2}+C=2$이므로 $C=2+\\frac{\\pi}{2}$이다.\n$\\cot\\frac{\\pi}{4}=1$이므로 $f(\\frac{\\pi}{4})=-1-\\frac{\\pi}{4}+2+\\frac{\\pi}{2}=1+\\frac{\\pi}{4}$이다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-095",
    "problemTypeKey": "PT_CALCULUS_FUNCTION_INTEGRAL",
    "templateKey": "TPL_CALCULUS_INTEGRAL_TRIG",
    "crossConceptKeys": [
      "CC_TANGENT_LINE_SLOPE_AT_POINT",
      "CC_TRIGONOMETRIC_IDENTITY"
    ],
    "conditionKeys": [
      "COND_RESTRICTED_INTERVAL"
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
    "content": "$-\\frac{\\pi}{2}<x<\\frac{\\pi}{2}$에서 함수 $f$가 $f'(x)=\\frac{2}{1-\\sin x}$, $f(0)=3$을 만족시킬 때, $f(\\frac{\\pi}{6})$의 값은?",
    "choices": [
      "$2\\sqrt3-3$",
      "$2\\sqrt3-2$",
      "$2\\sqrt3-1$",
      "$2\\sqrt3$",
      "$2\\sqrt3+1$"
    ],
    "answer": "⑤",
    "solution": "분자와 분모에 $1+\\sin x$를 곱하면 $f'(x)=\\frac{2(1+\\sin x)}{1-\\sin^2x}$이다.\n기본 관계 $1-\\sin^2x=\\cos^2x$를 쓰면 $f'(x)=\\frac{2(1+\\sin x)}{\\cos^2x}$이다.\n분배하면 $f'(x)=\\frac{2}{\\cos^2x}+\\frac{2\\sin x}{\\cos^2x}=2\\sec^2x+2\\sec x\\tan x$이다.\n부정적분 공식 $\\int\\sec^2x\\,dx=\\tan x$, $\\int\\sec x\\tan x\\,dx=\\sec x$로 $f(x)=2\\tan x+2\\sec x+C$이다.\n$f(0)=3$을 대입하면 $0+2\\cdot1+C=3$이므로 $C=1$이다.\n$\\tan\\frac{\\pi}{6}=\\frac{1}{\\sqrt3}$, $\\sec\\frac{\\pi}{6}=\\frac{2}{\\sqrt3}$이므로 $f(\\frac{\\pi}{6})=\\frac{2}{\\sqrt3}+\\frac{4}{\\sqrt3}+1=\\frac{6}{\\sqrt3}+1=2\\sqrt3+1$이다.\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-095",
    "problemTypeKey": "PT_CALCULUS_FUNCTION_INTEGRAL",
    "templateKey": "TPL_CALCULUS_INTEGRAL_TRIG",
    "crossConceptKeys": [
      "CC_TRIGONOMETRIC_IDENTITY"
    ],
    "conditionKeys": [
      "COND_RESTRICTED_INTERVAL"
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
    "content": "$0<x<\\frac{\\pi}{2}$에서 $f(x)=1+\\sin x+\\sin^2x+\\sin^3x+\\cdots$이다. $f$의 한 부정적분 $F$가 $F(\\frac{\\pi}{6})=\\sqrt3+2$를 만족시킬 때, $F(x)$는?",
    "choices": [
      "$\\tan x+\\sec x-2$",
      "$\\tan x-\\sec x+2$",
      "$-\\tan x+\\sec x+2$",
      "$\\tan x+\\sec x+2$",
      "$-\\tan x-\\sec x+2$"
    ],
    "answer": "④",
    "solution": "$0<x<\\frac{\\pi}{2}$에서 $0<\\sin x<1$이므로 등비급수의 합 공식으로 $f(x)=\\frac{1}{1-\\sin x}$이다.\n분자와 분모에 $1+\\sin x$를 곱하면 $f(x)=\\frac{1+\\sin x}{1-\\sin^2x}=\\frac{1+\\sin x}{\\cos^2x}$이다.\n항을 나누면 $f(x)=\\sec^2x+\\sec x\\tan x$이다.\n부정적분 공식으로 $F(x)=\\tan x+\\sec x+C$이다.\n$F(\\frac{\\pi}{6})=\\sqrt3+2$를 대입하면 $\\tan\\frac{\\pi}{6}+\\sec\\frac{\\pi}{6}+C=\\frac{1}{\\sqrt3}+\\frac{2}{\\sqrt3}+C=\\frac{3}{\\sqrt3}+C=\\sqrt3+C$이다.\n$\\sqrt3+C=\\sqrt3+2$이므로 $C=2$이고 $F(x)=\\tan x+\\sec x+2$이다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-095",
    "problemTypeKey": "PT_CALCULUS_FUNCTION_INTEGRAL",
    "templateKey": "TPL_CALCULUS_INTEGRAL_TRIG",
    "crossConceptKeys": [
      "CC_SERIES_SUM",
      "CC_TRIGONOMETRIC_IDENTITY"
    ],
    "conditionKeys": [
      "COND_RESTRICTED_INTERVAL"
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
    "content": "$0<x<\\frac{\\pi}{2}$에서 다음 부정적분 중 옳지 않은 것은? (단, $C$는 적분상수이다.)",
    "choices": [
      "$\\int\\frac{\\sin x}{\\cos^2x}\\,dx=-\\sec x+C$",
      "$\\int\\frac{\\cos x}{\\sin^2x}\\,dx=-\\csc x+C$",
      "$\\int\\tan^2 x\\,dx=\\tan x-x+C$",
      "$\\int\\frac{\\cos^2x}{1-\\sin x}\\,dx=x-\\cos x+C$",
      "$\\int\\frac{1-\\cos x}{\\sin^2x}\\,dx=-\\cot x+\\csc x+C$"
    ],
    "answer": "①",
    "solution": "각 보기의 우변을 미분해 피적분함수와 같은지 확인한다.\n① $(-\\sec x+C)'=-\\sec x\\tan x=-\\frac{\\sin x}{\\cos^2x}$인데 이는 피적분함수 $\\frac{\\sin x}{\\cos^2x}$의 부호와 반대이므로 옳지 않다.\n② $(-\\csc x+C)'=\\csc x\\cot x=\\frac{\\cos x}{\\sin^2x}$로 옳다.\n③ $(\\tan x-x+C)'=\\sec^2x-1=\\tan^2x$로 옳다.\n④ $\\frac{\\cos^2x}{1-\\sin x}=\\frac{1-\\sin^2x}{1-\\sin x}=1+\\sin x$이고 $(x-\\cos x+C)'=1+\\sin x$로 옳다.\n⑤ $(-\\cot x+\\csc x+C)'=\\csc^2x-\\csc x\\cot x=\\frac{1}{\\sin^2x}-\\frac{\\cos x}{\\sin^2x}=\\frac{1-\\cos x}{\\sin^2x}$로 옳다.\n따라서 정답은 ①이다.",
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
    "conditionKeys": [
      "COND_RESTRICTED_INTERVAL"
    ],
    "integrationPattern": "NONE"
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
    "content": "함수 $f$와 상수 $k$가 $f'(x)=k\\sin x$, $\\displaystyle\\lim_{x\\to\\pi/2}\\frac{f(x)}{x-\\pi/2}=2k+3$을 만족시킬 때, $f(\\pi)$의 값은?",
    "choices": [
      "$-4$",
      "$-3$",
      "$-2$",
      "$-1$",
      "$0$"
    ],
    "answer": "②",
    "solution": "$\\lim_{x\\to\\pi/2}(x-\\frac{\\pi}{2})=0$이고 극한값이 유한하므로 분자도 $0$으로 가야 한다. 즉 $f(\\frac{\\pi}{2})=0$이다.\n$f(\\frac{\\pi}{2})=0$이므로 주어진 극한은 $\\lim_{x\\to\\pi/2}\\frac{f(x)-f(\\pi/2)}{x-\\pi/2}=f'(\\frac{\\pi}{2})$이다.\n$f'(x)=k\\sin x$에서 $f'(\\frac{\\pi}{2})=k\\sin\\frac{\\pi}{2}=k$이다.\n따라서 $k=2k+3$이므로 $k=-3$이다.\n$f'(x)=-3\\sin x$이므로 $f(x)=\\int(-3\\sin x)\\,dx=3\\cos x+C$이다.\n$f(\\frac{\\pi}{2})=3\\cos\\frac{\\pi}{2}+C=0+C=0$이므로 $C=0$이다.\n$f(\\pi)=3\\cos\\pi=3\\cdot(-1)=-3$이다.\n따라서 정답은 ②이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-095",
    "problemTypeKey": "PT_CALCULUS_FUNCTION_INTEGRAL",
    "templateKey": "TPL_CALCULUS_INTEGRAL_TRIG",
    "crossConceptKeys": [
      "CC_DERIVATIVE_DEFINITION_LIMIT"
    ],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 8,
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
    "content": "$x>0$에서 미분가능한 함수 $f$의 한 부정적분 $F$가 $F(x)=xf(x)+2x\\cos x-2\\sin x$를 만족시킨다. $f(\\frac{\\pi}{2})=1$일 때, $f(\\frac{\\pi}{3})$의 값은?",
    "choices": [
      "$-1$",
      "$0$",
      "$1$",
      "$2$",
      "$3$"
    ],
    "answer": "②",
    "solution": "부정적분의 정의로 $F'(x)=f(x)$이다.\n$F(x)=xf(x)+2x\\cos x-2\\sin x$의 양변을 곱의 미분법으로 미분하면 $F'(x)=f(x)+xf'(x)+2\\cos x-2x\\sin x-2\\cos x$이다.\n$2\\cos x$ 항을 소거하면 $f(x)=f(x)+xf'(x)-2x\\sin x$이다.\n양변에서 $f(x)$를 빼면 $xf'(x)=2x\\sin x$이고 $x>0$이므로 $f'(x)=2\\sin x$이다.\n부정적분으로 $f(x)=-2\\cos x+C$이다.\n$f(\\frac{\\pi}{2})=-2\\cos\\frac{\\pi}{2}+C=0+C=1$이므로 $C=1$이다.\n$f(\\frac{\\pi}{3})=-2\\cos\\frac{\\pi}{3}+1=-2\\cdot\\frac12+1=0$이다.\n따라서 정답은 ②이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-095",
    "problemTypeKey": "PT_CALCULUS_FUNCTION_INTEGRAL",
    "templateKey": "TPL_CALCULUS_INTEGRAL_TRIG",
    "crossConceptKeys": [],
    "conditionKeys": [
      "COND_POSITIVE"
    ],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 9,
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
    "content": "$-\\frac{\\pi}{2}<x<\\frac{\\pi}{2}$에서 함수 $f$가 $\\displaystyle\\lim_{h\\to0}\\frac{f(x+h)-f(x)}{4h}=\\frac{1}{\\cos^2x}$와 $f(0)=-1$을 만족시킨다. $f(\\frac{\\pi}{4})$의 값은?",
    "choices": [
      "$0$",
      "$1$",
      "$2$",
      "$3$",
      "$4$"
    ],
    "answer": "④",
    "solution": "극한의 상수 $\\frac14$를 밖으로 빼면 $\\lim_{h\\to0}\\frac{f(x+h)-f(x)}{4h}=\\frac14 f'(x)$이다.\n따라서 $\\frac14 f'(x)=\\frac{1}{\\cos^2x}$이므로 $f'(x)=\\frac{4}{\\cos^2x}=4\\sec^2x$이다.\n$\\sec^2x$의 부정적분 공식 $\\int\\sec^2x\\,dx=\\tan x$로 $f(x)=4\\tan x+C$이다.\n$f(0)=-1$을 대입하면 $4\\tan0+C=0+C=-1$이므로 $C=-1$이다.\n$\\tan\\frac{\\pi}{4}=1$이므로 $f(\\frac{\\pi}{4})=4\\cdot1-1=3$이다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-095",
    "problemTypeKey": "PT_CALCULUS_FUNCTION_INTEGRAL",
    "templateKey": "TPL_CALCULUS_INTEGRAL_TRIG",
    "crossConceptKeys": [
      "CC_DERIVATIVE_DEFINITION_LIMIT",
      "CC_DIFFERENCE_QUOTIENT_SCALING"
    ],
    "conditionKeys": [
      "COND_RESTRICTED_INTERVAL"
    ],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 10,
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
    "content": "미분가능한 함수 $f$와 그 한 부정적분 $F$가 $f(x)=F(x)+3e^x\\cos x$를 만족시킨다. $f(0)=-1$이고 $g(x)=e^{-x}f(x)$일 때, $g(\\frac{\\pi}{2})$의 값은?",
    "choices": [
      "$-1$",
      "$0$",
      "$1$",
      "$2$",
      "$3$"
    ],
    "answer": "①",
    "solution": "부정적분의 정의로 $F'(x)=f(x)$이다.\n$f(x)=F(x)+3e^x\\cos x$의 양변을 미분하면 $f'(x)=f(x)+3e^x\\cos x-3e^x\\sin x$이다.\n정리하면 $f'(x)-f(x)=3e^x(\\cos x-\\sin x)$이다.\n$g(x)=e^{-x}f(x)$를 곱의 미분법으로 미분하면 $g'(x)=-e^{-x}f(x)+e^{-x}f'(x)=e^{-x}(f'(x)-f(x))$이다.\n앞의 식을 대입하면 $g'(x)=e^{-x}\\cdot3e^x(\\cos x-\\sin x)=3(\\cos x-\\sin x)$이다.\n부정적분으로 $g(x)=3\\sin x+3\\cos x+C$이다.\n$g(0)=e^0 f(0)=1\\cdot(-1)=-1$이고 $g(0)=3\\sin0+3\\cos0+C=3+C$이므로 $3+C=-1$, 즉 $C=-4$이다.\n$g(\\frac{\\pi}{2})=3\\sin\\frac{\\pi}{2}+3\\cos\\frac{\\pi}{2}-4=3+0-4=-1$이다.\n따라서 정답은 ①이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-095",
    "problemTypeKey": "PT_CALCULUS_FUNCTION_INTEGRAL",
    "templateKey": "TPL_CALCULUS_INTEGRAL_TRIG",
    "crossConceptKeys": [],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
  }
];
