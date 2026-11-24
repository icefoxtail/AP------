window.examTitle = "미적분II_181_지수함수로그함수의극대극소_고2_유형은행1";

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
    "content": "$f(x)=x^2e^{-2x}$의 극댓값은?",
    "choices": [
      "$e^{-2}/4$",
      "$e^{-2}/2$",
      "$e^{-2}$",
      "$2e^{-2}$",
      "$4e^{-2}$"
    ],
    "answer": "③",
    "solution": "정의역은 실수 전체이고 $f(x)=x^2e^{-2x}$이다.\n곱의 미분법과 합성함수의 미분법으로 $f'(x)=2xe^{-2x}+x^2(-2e^{-2x})=2x(1-x)e^{-2x}$이다.\n$e^{-2x}>0$이므로 도함수의 부호는 $2x(1-x)$의 부호와 같다.\n$f'(x)=0$인 $x=0,1$을 경계로 부호를 조사하면 $x<0$에서 $-$, $0<x<1$에서 $+$, $x>1$에서 $-$이다.\n따라서 $x=0$에서 극소, $x=1$에서 극대이다.\n극댓값은 $f(1)=1^2e^{-2}=e^{-2}$이다.\n주의: $x=0$은 극댓값이 아니라 극솟값을 주는 점이다.\n따라서 정답은 ③이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-086",
    "problemTypeKey": "PT_DERIVATIVE_EXTREMA",
    "templateKey": "TPL_EXTREMA_VALUE_PARAMETER",
    "crossConceptKeys": [
      "CC_POLYNOMIAL_DERIVATIVE_RULE",
      "CC_DERIVATIVE_ROOT_SOLVING"
    ],
    "conditionKeys": [],
    "integrationPattern": "NONE"
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
    "content": "$f(x)=x^2(\\ln x)^2$의 극댓값과 극솟값의 합은?",
    "choices": [
      "$e^{-2}$",
      "$2e^{-2}$",
      "$3e^{-2}$",
      "$4e^{-2}$",
      "$5e^{-2}$"
    ],
    "answer": "①",
    "solution": "정의역은 $x>0$이고 $f(x)=x^2(\\ln x)^2$이다.\n곱의 미분법과 합성함수의 미분법으로 $f'(x)=2x(\\ln x)^2+x^2\\cdot2\\ln x\\cdot\\frac{1}{x}=2x\\ln x(\\ln x+1)$이다.\n$f'(x)=0$에서 $\\ln x=0$ 또는 $\\ln x=-1$이므로 $x=1$ 또는 $x=e^{-1}$이다.\n$2x>0$이므로 $\\ln x(\\ln x+1)$의 부호를 조사하면 $(0,e^{-1})$에서 $+$, $(e^{-1},1)$에서 $-$, $(1,\\infty)$에서 $+$이다.\n따라서 $x=e^{-1}$에서 극대, $x=1$에서 극소이다.\n극댓값은 $f(e^{-1})=(e^{-1})^2(-1)^2=e^{-2}$이다.\n극솟값은 $f(1)=1^2\\cdot0^2=0$이므로 두 값의 합은 $e^{-2}+0=e^{-2}$이다.\n주의: 로그함수의 정의역 때문에 $x\\le0$은 조사하지 않는다.\n따라서 정답은 ①이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-086",
    "problemTypeKey": "PT_DERIVATIVE_EXTREMA",
    "templateKey": "TPL_EXTREMA_VALUE_PARAMETER",
    "crossConceptKeys": [
      "CC_POLYNOMIAL_DERIVATIVE_RULE",
      "CC_DERIVATIVE_ROOT_SOLVING"
    ],
    "conditionKeys": [],
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
    "content": "$f(x)=ex-2\\ln x$가 극소인 $x$의 값은?",
    "choices": [
      "$1/(2e)$",
      "$1/e$",
      "$3/(2e)$",
      "$2/e$",
      "$5/(2e)$"
    ],
    "answer": "④",
    "solution": "정의역은 $x>0$이고 $f(x)=ex-2\\ln x$이다.\n로그함수의 미분 공식으로 $f'(x)=e-\\frac{2}{x}=\\frac{ex-2}{x}$이다.\n$f'(x)=0$에서 $ex-2=0$이므로 $x=\\frac{2}{e}$이다.\n분모 $x$가 양수이므로 $0<x<\\frac{2}{e}$에서 $f'(x)<0$이고 $x>\\frac{2}{e}$에서 $f'(x)>0$이다.\n따라서 도함수의 부호가 음에서 양으로 바뀌므로 $x=\\frac{2}{e}$에서 극소이다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-086",
    "problemTypeKey": "PT_DERIVATIVE_EXTREMA",
    "templateKey": "TPL_EXTREMA_VALUE_PARAMETER",
    "crossConceptKeys": [
      "CC_DERIVATIVE_ROOT_SOLVING"
    ],
    "conditionKeys": [],
    "integrationPattern": "NONE"
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
    "content": "$f(x)=x^2-5x+3\\ln x+5$가 $x=a$에서 극소일 때, $2a$는?",
    "choices": [
      "$3/2$",
      "$2$",
      "$5/2$",
      "$3$",
      "$7/2$"
    ],
    "answer": "④",
    "solution": "정의역은 $x>0$이고 $f(x)=x^2-5x+3\\ln x+5$이다.\n로그함수의 미분 공식으로 $f'(x)=2x-5+\\frac{3}{x}$이다.\n통분하면 $f'(x)=\\frac{2x^2-5x+3}{x}$이고, 인수분해하면 $f'(x)=\\frac{(2x-3)(x-1)}{x}$이다.\n$f'(x)=0$에서 $x=1$ 또는 $x=\\frac{3}{2}$이다.\n$x>0$에서 분모는 양수이므로 분자의 부호를 조사하면 $(0,1)$에서 $+$, $(1,\\frac{3}{2})$에서 $-$, $(\\frac{3}{2},\\infty)$에서 $+$이다.\n따라서 $x=1$에서 극대, $x=\\frac{3}{2}$에서 극소이므로 $a=\\frac{3}{2}$이다.\n$2a=2\\cdot\\frac{3}{2}=3$이다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-086",
    "problemTypeKey": "PT_DERIVATIVE_EXTREMA",
    "templateKey": "TPL_EXTREMA_VALUE_PARAMETER",
    "crossConceptKeys": [
      "CC_DERIVATIVE_ROOT_SOLVING"
    ],
    "conditionKeys": [],
    "integrationPattern": "NONE"
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
    "content": "$f(x)=(x^2-15)e^{1-x}$의 극댓값과 극솟값의 곱은?",
    "choices": [
      "$-64$",
      "$-60$",
      "$-56$",
      "$-52$",
      "$-48$"
    ],
    "answer": "②",
    "solution": "$f(x)=(x^2-15)e^{1-x}$에 곱의 미분법과 합성함수의 미분법을 쓰면 $f'(x)=2xe^{1-x}+(x^2-15)(-e^{1-x})$이다.\n정리하면 $f'(x)=(-x^2+2x+15)e^{1-x}=-(x-5)(x+3)e^{1-x}$이다.\n$e^{1-x}>0$이므로 $f'(x)=0$인 $x=-3,5$를 경계로 부호를 조사하면 $x<-3$에서 $-$, $-3<x<5$에서 $+$, $x>5$에서 $-$이다.\n따라서 $x=-3$에서 극소, $x=5$에서 극대이다.\n극솟값은 $f(-3)=(9-15)e^{4}=-6e^4$이다.\n극댓값은 $f(5)=(25-15)e^{-4}=10e^{-4}$이다.\n두 값의 곱은 $(-6e^4)(10e^{-4})=-60$이다.\n따라서 정답은 ②이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-086",
    "problemTypeKey": "PT_DERIVATIVE_EXTREMA",
    "templateKey": "TPL_EXTREMA_VALUE_PARAMETER",
    "crossConceptKeys": [
      "CC_POLYNOMIAL_DERIVATIVE_RULE",
      "CC_DERIVATIVE_ROOT_SOLVING"
    ],
    "conditionKeys": [],
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
    "content": "$f(x)=(x^2-8)e^{-x}$의 극댓값과 극솟값의 곱은?",
    "choices": [
      "$-32e^2$",
      "$-32e$",
      "$-32$",
      "$-32e^{-1}$",
      "$-32e^{-2}$"
    ],
    "answer": "⑤",
    "solution": "$f(x)=(x^2-8)e^{-x}$에 곱의 미분법과 합성함수의 미분법을 쓰면 $f'(x)=2xe^{-x}+(x^2-8)(-e^{-x})$이다.\n정리하면 $f'(x)=(-x^2+2x+8)e^{-x}=-(x-4)(x+2)e^{-x}$이다.\n$e^{-x}>0$이므로 $f'(x)=0$인 $x=-2,4$를 경계로 부호를 조사하면 $x<-2$에서 $-$, $-2<x<4$에서 $+$, $x>4$에서 $-$이다.\n따라서 $x=-2$에서 극소, $x=4$에서 극대이다.\n극솟값은 $f(-2)=(4-8)e^{2}=-4e^2$이다.\n극댓값은 $f(4)=(16-8)e^{-4}=8e^{-4}$이다.\n두 값의 곱은 $(-4e^2)(8e^{-4})=-32e^{-2}$이다.\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-086",
    "problemTypeKey": "PT_DERIVATIVE_EXTREMA",
    "templateKey": "TPL_EXTREMA_VALUE_PARAMETER",
    "crossConceptKeys": [
      "CC_POLYNOMIAL_DERIVATIVE_RULE",
      "CC_DERIVATIVE_ROOT_SOLVING"
    ],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 7,
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
    "content": "$1<x<e$에서 $f(x)=2\\sin(2\\ln x)/x^2$의 극댓값은?",
    "choices": [
      "$\\sqrt2e^{-\\pi/4}/4$",
      "$\\sqrt2e^{-\\pi/4}/2$",
      "$3\\sqrt2e^{-\\pi/4}/4$",
      "$\\sqrt2e^{-\\pi/4}$",
      "$2\\sqrt2e^{-\\pi/4}$"
    ],
    "answer": "④",
    "solution": "$f(x)=2x^{-2}\\sin(2\\ln x)$이고 $1<x<e$에서 $t=2\\ln x$로 놓으면 $0<t<2$이다.\n곱의 미분법과 합성함수의 미분법으로 $f'(x)=2(-2)x^{-3}\\sin(2\\ln x)+2x^{-2}\\cos(2\\ln x)\\cdot\\frac{2}{x}$이다.\n정리하면 $f'(x)=-4x^{-3}\\sin t+4x^{-3}\\cos t=4x^{-3}(\\cos t-\\sin t)$이다.\n$4x^{-3}>0$이므로 $f'(x)=0$은 $\\cos t=\\sin t$, 즉 $\\tan t=1$에서 일어난다.\n$0<t<2$에서 해는 $t=\\frac{\\pi}{4}$뿐이다.\n덧셈정리로 $\\cos t-\\sin t=\\sqrt2\\cos(t+\\frac{\\pi}{4})$이므로 $0<t<\\frac{\\pi}{4}$에서 $+$, $\\frac{\\pi}{4}<t<2$에서 $-$이다.\n따라서 $t=\\frac{\\pi}{4}$에서 극대이고 $x=e^{t/2}=e^{\\pi/8}$이다.\n극댓값은 $f(e^{\\pi/8})=2\\sin\\frac{\\pi}{4}\\cdot e^{-\\pi/4}=2\\cdot\\frac{\\sqrt2}{2}\\cdot e^{-\\pi/4}=\\sqrt2e^{-\\pi/4}$이다.\n주의: $t$의 범위가 $0<t<2$이므로 $\\tan t=1$의 다른 해 $\\frac{5\\pi}{4}$는 고려하지 않는다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-086",
    "problemTypeKey": "PT_DERIVATIVE_EXTREMA",
    "templateKey": "TPL_EXTREMA_VALUE_PARAMETER",
    "crossConceptKeys": [
      "CC_DERIVATIVE_ROOT_SOLVING",
      "CC_TRIGONOMETRIC_EQUATION"
    ],
    "conditionKeys": [
      "COND_RESTRICTED_INTERVAL"
    ],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 8,
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
    "content": "$(0,4)$에서 $f(x)=-x\\ln x-(4-x)\\ln(4-x)$의 극댓값은?",
    "choices": [
      "$-7\\ln2$",
      "$-6\\ln2$",
      "$-5\\ln2$",
      "$-4\\ln2$",
      "$-3\\ln2$"
    ],
    "answer": "④",
    "solution": "정의역은 $0<x<4$이고 $f(x)=-x\\ln x-(4-x)\\ln(4-x)$이다.\n곱의 미분법과 합성함수의 미분법으로 $f'(x)=-(\\ln x+1)+\\ln(4-x)+1$이다.\n정리하면 $f'(x)=\\ln(4-x)-\\ln x=\\ln\\frac{4-x}{x}$이다.\n$f'(x)=0$에서 $\\frac{4-x}{x}=1$이므로 $x=2$이다.\n$0<x<2$에서 $\\frac{4-x}{x}>1$이므로 $f'(x)>0$이고, $2<x<4$에서 $\\frac{4-x}{x}<1$이므로 $f'(x)<0$이다.\n따라서 $x=2$에서 극대이다.\n극댓값은 $f(2)=-2\\ln2-2\\ln2=-4\\ln2$이다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-086",
    "problemTypeKey": "PT_DERIVATIVE_EXTREMA",
    "templateKey": "TPL_EXTREMA_VALUE_PARAMETER",
    "crossConceptKeys": [
      "CC_DERIVATIVE_ROOT_SOLVING"
    ],
    "conditionKeys": [
      "COND_RESTRICTED_INTERVAL"
    ],
    "integrationPattern": "NONE"
  },
  {
    "id": 9,
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
    "content": "$t>0$일 때 곡선 $y=\\ln(x/2)$에서 $x=t,2t$인 두 점의 접선의 $x$절편을 각각 $r(t),s(t)$라 하자. $r(t)-s(t)$의 극솟값은?",
    "choices": [
      "$-1$",
      "$-3/4$",
      "$-1/2$",
      "$-1/4$",
      "$-1/8$"
    ],
    "answer": "③",
    "solution": "$x=u$에서 곡선 $y=\\ln\\frac{x}{2}$의 접선의 기울기는 $\\frac{1}{u}$이다.\n점 $(u,\\ln\\frac{u}{2})$에서 접선의 방정식은 $y-\\ln\\frac{u}{2}=\\frac{1}{u}(x-u)$이다.\n이를 정리하면 $y=\\ln\\frac{u}{2}+\\frac{x}{u}-1$이다.\n$y=0$을 대입하면 $0=\\ln\\frac{u}{2}+\\frac{x}{u}-1$이므로 $x$절편은 $x=u(1-\\ln\\frac{u}{2})$이다.\n따라서 $r(t)=t(1-\\ln\\frac{t}{2})$, $s(t)=2t(1-\\ln\\frac{2t}{2})=2t(1-\\ln t)$이다.\n$F(t)=r(t)-s(t)$로 놓으면 $F(t)=t(1-\\ln\\frac{t}{2})-2t(1-\\ln t)$이다.\n로그의 성질로 정리하면 $F(t)=t(1-\\ln t+\\ln2-2+2\\ln t)=t(\\ln t+\\ln2-1)=t[\\ln(2t)-1]$이다.\n곱의 미분법으로 $F'(t)=\\ln(2t)-1+t\\cdot\\frac{1}{t}=\\ln(2t)$이다.\n$F'(t)=0$에서 $2t=1$, 즉 $t=\\frac{1}{2}$이다.\n$0<t<\\frac{1}{2}$에서 $\\ln(2t)<0$이므로 $F'(t)<0$이고, $t>\\frac{1}{2}$에서 $F'(t)>0$이다.\n따라서 $t=\\frac{1}{2}$에서 극소이고 극솟값은 $F(\\frac{1}{2})=\\frac{1}{2}(\\ln1-1)=-\\frac{1}{2}$이다.\n따라서 정답은 ③이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-086",
    "problemTypeKey": "PT_DERIVATIVE_EXTREMA",
    "templateKey": "TPL_EXTREMA_VALUE_PARAMETER",
    "crossConceptKeys": [
      "CC_TANGENT_LINE_SLOPE_AT_POINT"
    ],
    "conditionKeys": [
      "COND_POSITIVE"
    ],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 10,
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
    "content": "$(0,2\\pi)$에서 $f(x)=2e^x\\sin x$의 극댓값과 극솟값의 곱은?",
    "choices": [
      "$-2e^{3\\pi}$",
      "$-2e^{5\\pi/2}$",
      "$-2e^{2\\pi}$",
      "$-2e^{3\\pi/2}$",
      "$-2e^\\pi$"
    ],
    "answer": "②",
    "solution": "$f(x)=2e^x\\sin x$에서 곱의 미분법으로 $f'(x)=2e^x\\sin x+2e^x\\cos x=2e^x(\\sin x+\\cos x)$이다.\n덧셈정리로 $\\sin x+\\cos x=\\sqrt2\\sin(x+\\frac{\\pi}{4})$이다.\n$f'(x)=0$인 $x$는 $x+\\frac{\\pi}{4}=\\pi,2\\pi$에서 $x=\\frac{3\\pi}{4},\\frac{7\\pi}{4}$이다.\n$0<x<2\\pi$에서 $\\sqrt2\\sin(x+\\frac{\\pi}{4})$의 부호는 $+,-,+$ 순이므로 $x=\\frac{3\\pi}{4}$에서 극대, $x=\\frac{7\\pi}{4}$에서 극소이다.\n극댓값은 $f(\\frac{3\\pi}{4})=2e^{3\\pi/4}\\cdot\\frac{\\sqrt2}{2}=\\sqrt2e^{3\\pi/4}$이다.\n극솟값은 $f(\\frac{7\\pi}{4})=2e^{7\\pi/4}\\cdot(-\\frac{\\sqrt2}{2})=-\\sqrt2e^{7\\pi/4}$이다.\n두 값의 곱은 $-2e^{3\\pi/4+7\\pi/4}=-2e^{5\\pi/2}$이다.\n따라서 정답은 ②이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-086",
    "problemTypeKey": "PT_DERIVATIVE_EXTREMA",
    "templateKey": "TPL_EXTREMA_VALUE_PARAMETER",
    "crossConceptKeys": [
      "CC_DERIVATIVE_ROOT_SOLVING",
      "CC_TRIGONOMETRIC_EQUATION"
    ],
    "conditionKeys": [
      "COND_RESTRICTED_INTERVAL"
    ],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 11,
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
    "content": "$(0,2\\pi)$에서 $f(x)=e^{-3x}\\sin x$가 $x=a$에서 극솟값을 가질 때, $\\sin a$는?",
    "choices": [
      "$-3/\\sqrt{10}$",
      "$-2/\\sqrt{10}$",
      "$-1/\\sqrt{10}$",
      "$1/\\sqrt{10}$",
      "$2/\\sqrt{10}$"
    ],
    "answer": "③",
    "solution": "$f(x)=e^{-3x}\\sin x$에 곱의 미분법과 합성함수의 미분법을 쓰면 $f'(x)=-3e^{-3x}\\sin x+e^{-3x}\\cos x=e^{-3x}(\\cos x-3\\sin x)$이다.\n$f'(x)=0$에서 $\\cos x=3\\sin x$, 즉 $\\tan x=\\frac{1}{3}$이다.\n$0<x<2\\pi$에서 해는 제1사분면의 $\\alpha$와 제3사분면의 $\\alpha+\\pi$이다.\n(i) $x=\\alpha$의 좌우에서 $f'(x)$가 $+$에서 $-$로 바뀌므로 극대이다.\n(ii) $x=\\alpha+\\pi$의 좌우에서 $f'(x)$가 $-$에서 $+$로 바뀌므로 극소이다.\n따라서 극솟값을 주는 $a=\\alpha+\\pi$는 제3사분면의 각이므로 $\\sin a<0$이다.\n$\\tan a=\\frac{1}{3}$에서 $9\\sin^2a=\\cos^2a$이고 $\\sin^2a+\\cos^2a=1$이므로 $10\\sin^2a=1$이다.\n$\\sin a<0$이므로 $\\sin a=-\\frac{1}{\\sqrt{10}}$이다.\n따라서 정답은 ③이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-086",
    "problemTypeKey": "PT_DERIVATIVE_EXTREMA",
    "templateKey": "TPL_EXTREMA_VALUE_PARAMETER",
    "crossConceptKeys": [
      "CC_TRIGONOMETRIC_EQUATION",
      "CC_TRIGONOMETRIC_IDENTITY"
    ],
    "conditionKeys": [
      "COND_RESTRICTED_INTERVAL"
    ],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 12,
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
    "content": "$(0,2\\pi)$에서 $f(x)=e^{2x}(\\sin x+2\\cos x)$의 극댓값과 극솟값의 곱은?",
    "choices": [
      "$-5e^{4\\pi}$",
      "$-4e^{4\\pi}$",
      "$-3e^{4\\pi}$",
      "$-2e^{4\\pi}$",
      "$-e^{4\\pi}$"
    ],
    "answer": "⑤",
    "solution": "$f(x)=e^{2x}(\\sin x+2\\cos x)$에서 곱의 미분법과 합성함수의 미분법으로 $f'(x)=2e^{2x}(\\sin x+2\\cos x)+e^{2x}(\\cos x-2\\sin x)$이다.\n정리하면 $f'(x)=e^{2x}(2\\sin x+4\\cos x+\\cos x-2\\sin x)=5e^{2x}\\cos x$이다.\n$5e^{2x}>0$이므로 $f'(x)$의 부호는 $\\cos x$의 부호와 같다.\n$0<x<2\\pi$에서 $\\cos x$의 부호는 $+,-,+$ 순이므로 $x=\\frac{\\pi}{2}$에서 극대, $x=\\frac{3\\pi}{2}$에서 극소이다.\n극댓값은 $f(\\frac{\\pi}{2})=e^{\\pi}(1+2\\cdot0)=e^{\\pi}$이다.\n극솟값은 $f(\\frac{3\\pi}{2})=e^{3\\pi}(-1+2\\cdot0)=-e^{3\\pi}$이다.\n두 값의 곱은 $e^{\\pi}(-e^{3\\pi})=-e^{4\\pi}$이다.\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-086",
    "problemTypeKey": "PT_DERIVATIVE_EXTREMA",
    "templateKey": "TPL_EXTREMA_VALUE_PARAMETER",
    "crossConceptKeys": [
      "CC_DERIVATIVE_ROOT_SOLVING",
      "CC_TRIGONOMETRIC_EQUATION"
    ],
    "conditionKeys": [
      "COND_RESTRICTED_INTERVAL"
    ],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 13,
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
    "content": "$x>0$에서 $f(x)=e^{-2x}(2\\sin x+\\cos x)$가 극대인 점의 $x$좌표를 작은 것부터 $x_1,x_2,\\ldots$라 하자. $\\sum_{n=1}^\\infty f(x_n)$은?",
    "choices": [
      "$1/(e^{4\\pi}-1)$",
      "$1/(e^{3\\pi}-1)$",
      "$1/(e^{2\\pi}-1)$",
      "$1/(e^\\pi-1)$",
      "$1/(e^{\\pi/2}-1)$"
    ],
    "answer": "①",
    "solution": "$f(x)=e^{-2x}(2\\sin x+\\cos x)$에서 곱의 미분법과 합성함수의 미분법으로 $f'(x)=-2e^{-2x}(2\\sin x+\\cos x)+e^{-2x}(2\\cos x-\\sin x)$이다.\n정리하면 $f'(x)=e^{-2x}(-4\\sin x-2\\cos x+2\\cos x-\\sin x)=-5e^{-2x}\\sin x$이다.\n$-5e^{-2x}<0$이므로 $f'(x)>0$일 때 $\\sin x<0$이고, $f'(x)<0$일 때 $\\sin x>0$이다.\n$x>0$에서 $f'$가 $+$에서 $-$로 바뀌는 점은 $\\sin x$가 $-$에서 $+$로 바뀌는 $x=2\\pi,4\\pi,\\ldots$이다.\n따라서 극대점은 $x_n=2n\\pi$ $(n=1,2,3,\\ldots)$이다.\n사인과 코사인의 주기성으로 $f(x_n)=e^{-4n\\pi}(2\\cdot0+1)=e^{-4n\\pi}$이다.\n인접한 두 항의 비는 $\\frac{e^{-4(n+1)\\pi}}{e^{-4n\\pi}}=e^{-4\\pi}$이다.\n$0<e^{-4\\pi}<1$이므로 등비급수의 합 공식을 쓰면 $\\sum_{n=1}^{\\infty}f(x_n)=\\frac{e^{-4\\pi}}{1-e^{-4\\pi}}$이다.\n분자와 분모에 $e^{4\\pi}$를 곱하면 $\\frac{1}{e^{4\\pi}-1}$이다.\n주의: $x=\\pi,3\\pi,\\ldots$는 극솟값을 주는 점이므로 합에 넣지 않는다.\n따라서 정답은 ①이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B45",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-086",
    "problemTypeKey": "PT_DERIVATIVE_EXTREMA",
    "templateKey": "TPL_EXTREMA_VALUE_PARAMETER",
    "crossConceptKeys": [
      "CC_TRIGONOMETRIC_EQUATION",
      "CC_GEOMETRIC_SEQUENCE",
      "CC_SERIES_SUM"
    ],
    "conditionKeys": [
      "COND_POSITIVE"
    ],
    "integrationPattern": "SEQUENTIAL"
  }
];
