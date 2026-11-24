window.examTitle = "미적분II_190_함수의그래프_고2_유형은행1";

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
    "content": "다섯 함수와 그림의 짝 중 그래프의 개형이 잘못된 것은?\n[그림: 보기 순서대로 $y=x^2/(x-2)$, $y=1-e^{-2x^2}$, $y=2x-\\ln x$, $y=x+3\\sin x$ ($0<x<2\\pi$, 양끝 빈 점), $y=-\\ln x/x$를 각각 좌표평면에 그린다.]",
    "choices": [
      "$x^2/(x-2)$",
      "$e^{-2x^2}$",
      "$2x-\\ln x$",
      "$x+3\\sin x$",
      "$-\\ln x/x$"
    ],
    "answer": "②",
    "solution": "그림의 ②는 $y=1-e^{-2x^2}$의 개형인데, 보기의 함수는 $y=e^{-2x^2}$이다.\n$e^{-2x^2}$에 $x=0$을 대입하면 $y$절편은 $e^0=1$이지만 그림의 $y$절편은 $1-e^0=0$이다.\n지수함수의 극한에 의해 $x\\to\\pm\\infty$에서 $e^{-2x^2}\\to0$이지만 그림은 $y\\to1$이다.\n①은 $x^2/(x-2)=x+2+4/(x-2)$로 나누어지고 $x\\to2$일 때 분모 $\\to0$, 분자 $\\to4$이므로 $x=2$가 수직점근선이어서 그림과 같다.\n③은 $y'=2-1/x$이므로 $x=1/2$에서 극소, ④는 $y'=1+3\\cos x$이므로 $\\cos x=-1/3$인 두 점에서 극값을 갖는다.\n⑤는 $y'=(\\ln x-1)/x^2$이므로 $x=e$에서 극소이고 $\\lim_{x\\to0^+}y=\\infty$, $\\lim_{x\\to\\infty}y=0$이어서 그림과 맞다.\n따라서 정답은 ②이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-085",
    "problemTypeKey": "PT_DERIVATIVE_MONOTONICITY",
    "templateKey": "TPL_MONOTONICITY_DIRECT",
    "crossConceptKeys": [
      "CC_RATIONAL_FUNCTION",
      "CC_ASYMPTOTE",
      "CC_PERIODIC_FUNCTION"
    ],
    "conditionKeys": [
      "COND_RESTRICTED_INTERVAL"
    ],
    "integrationPattern": "CASE_BRANCH"
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
    "content": "다섯 함수와 그림의 짝 중 그래프의 개형이 잘못된 것은?\n[그림: 보기 순서대로 $y=xe^{2x}$, $y=2x\\ln x$, $y=x^2e^{2x}$, $y=(x-2)e^x$, $y=xe^{-2x}$를 각각 그린다. 두 번째는 원점에 빈 점을 표시한다.]",
    "choices": [
      "$xe^{2x}$",
      "$2x\\ln x$",
      "$x^2e^{2x}$",
      "$(2-x)e^x$",
      "$xe^{-2x}$"
    ],
    "answer": "④",
    "solution": "④의 그림은 $y=(x-2)e^x$인데 보기의 함수는 $y=(2-x)e^x$이다.\n$x=0$을 대입하면 보기는 $(2-0)e^0=2$, 그림은 $(0-2)e^0=-2$로 $y$절편부터 다르다.\n곱의 미분법으로 $(2-x)e^x$의 도함수는 $-e^x+(2-x)e^x=(1-x)e^x$이므로 $x=1$에서 극대이다.\n그림의 $(x-2)e^x$는 도함수가 $e^x+(x-2)e^x=(x-1)e^x$이므로 $x=1$에서 극소여서 증가·감소가 반대이다.\n①은 $y'=(1+2x)e^{2x}$로 $x=-1/2$에서 극소, ②는 $y'=2(\\ln x+1)$로 $x=1/e$에서 극소이다.\n③은 $y'=2x(1+x)e^{2x}$로 $x=-1,0$에서 극값, ⑤는 $y'=(1-2x)e^{-2x}$로 $x=1/2$에서 극대이므로 모두 그림과 맞다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-085",
    "problemTypeKey": "PT_DERIVATIVE_MONOTONICITY",
    "templateKey": "TPL_MONOTONICITY_DIRECT",
    "crossConceptKeys": [
      "CC_DERIVATIVE_SIGN_EXTREMA_ANALYSIS",
      "CC_ASYMPTOTE"
    ],
    "conditionKeys": [],
    "integrationPattern": "CASE_BRANCH"
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
    "content": "$f(x)=xe^{2x}$에 관해 옳은 것을 모두 고르시오.\nㄱ. $(-1,-1/2)$에서 곡선은 위로 볼록하다.\nㄴ. 변곡점은 $(-1,-e^{-2})$이다.\nㄷ. 극솟값은 $-e^{-2}/2$이다.",
    "choices": [
      "ㄱ",
      "ㄴ",
      "ㄱ, ㄴ",
      "ㄱ, ㄷ",
      "ㄱ, ㄴ, ㄷ"
    ],
    "answer": "②",
    "solution": "곱의 미분법과 합성함수의 미분법으로 $f'(x)=e^{2x}+x\\cdot2e^{2x}=(1+2x)e^{2x}$이다.\n다시 미분하면 $f''(x)=2e^{2x}+2(1+2x)e^{2x}=4(1+x)e^{2x}$이다.\nㄱ: $-1<x<-1/2$에서 $1+x>0$이므로 $f''>0$, 즉 아래로 볼록이어서 틀리다.\nㄴ: $x=-1$의 좌우에서 $1+x$의 부호가 바뀌므로 변곡점이고 $f(-1)=-1\\cdot e^{-2}=-e^{-2}$이어서 맞다.\nㄷ: $f'=0$인 $x=-1/2$에서 극소이고 $f(-1/2)=(-1/2)e^{-1}=-1/(2e)$이므로 $-e^{-2}/2$라는 값은 틀리다.\n따라서 정답은 ②이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-085",
    "problemTypeKey": "PT_DERIVATIVE_MONOTONICITY",
    "templateKey": "TPL_MONOTONICITY_DIRECT",
    "crossConceptKeys": [
      "CC_DERIVATIVE_SIGN_EXTREMA_ANALYSIS",
      "CC_FUNCTION_EXTREMA"
    ],
    "conditionKeys": [],
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
    "content": "$f(x)=2x\\ln x$에 관해 옳은 것을 모두 고르시오.\nㄱ. $0<a<b$일 때 $f((a+b)/2)>(f(a)+f(b))/2$이다.\nㄴ. $f(x)=k$가 서로 다른 두 실근을 갖는 범위는 $-2/e<k<0$이다.\nㄷ. 극소점의 $x$좌표는 $2/e$이다.",
    "choices": [
      "ㄱ",
      "ㄴ",
      "ㄱ, ㄴ",
      "ㄱ, ㄷ",
      "ㄱ, ㄴ, ㄷ"
    ],
    "answer": "②",
    "solution": "$x>0$에서 곱의 미분법으로 $f'(x)=2\\ln x+2x\\cdot\\frac{1}{x}=2(\\ln x+1)$이다.\n$f''(x)=\\frac{2}{x}>0$이므로 $f$는 $(0,\\infty)$에서 아래로 볼록이다.\nㄱ: 아래로 볼록이면 $f\\left(\\frac{a+b}{2}\\right)<\\frac{f(a)+f(b)}{2}$이므로 주어진 부등식은 틀리다.\n$f'(x)=0$에서 $\\ln x=-1$, 즉 $x=1/e$이고 $0<x<1/e$에서 $f'<0$, $x>1/e$에서 $f'>0$이다.\nㄷ: 극소점의 $x$좌표는 $1/e$이므로 $2/e$는 틀리다.\n극솟값은 $f(1/e)=2\\cdot\\frac{1}{e}\\cdot(-1)=-\\frac{2}{e}$이고 $\\lim_{x\\to0^+}2x\\ln x=0$, $\\lim_{x\\to\\infty}2x\\ln x=\\infty$이다.\nㄴ: $(0,1/e)$에서 $0$에서 $-2/e$까지, $(1/e,\\infty)$에서 $-2/e$에서 $\\infty$까지 움직이므로 $-2/e<k<0$일 때 수평선 $y=k$가 두 번 만난다.\n따라서 정답은 ②이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-085",
    "problemTypeKey": "PT_DERIVATIVE_MONOTONICITY",
    "templateKey": "TPL_MONOTONICITY_DIRECT",
    "crossConceptKeys": [
      "CC_AVERAGE_RATE_OF_CHANGE",
      "CC_FUNCTION_EXTREMA"
    ],
    "conditionKeys": [
      "COND_RANGE"
    ],
    "integrationPattern": "INTERDEPENDENT"
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
    "content": "$f(x)=-2x^2+6x-2\\ln x$에 관해 옳은 것을 모두 고르시오.\nㄱ. $x=1$에서 극댓값 $4$를 갖는다.\nㄴ. 변곡점의 $x$좌표는 $1/\\sqrt2$이다.\nㄷ. $(0,1/2)$에서 위로 볼록하다.",
    "choices": [
      "ㄱ",
      "ㄴ",
      "ㄱ, ㄴ",
      "ㄱ, ㄷ",
      "ㄱ, ㄴ, ㄷ"
    ],
    "answer": "③",
    "solution": "$x>0$에서 $f'(x)=-4x+6-\\frac{2}{x}=\\frac{-4x^2+6x-2}{x}=-\\frac{2(2x-1)(x-1)}{x}$이다.\n$f'(x)=0$인 $x=1/2,1$을 경계로 $(0,1/2)$에서 $f'<0$, $(1/2,1)$에서 $f'>0$, $(1,\\infty)$에서 $f'<0$이다.\nㄱ: $x=1$에서 $f'$가 양에서 음으로 바뀌고 $f(1)=-2+6-0=4$이므로 극댓값 $4$가 맞다.\n$f''(x)=-4+\\frac{2}{x^2}=\\frac{2-4x^2}{x^2}$이다.\nㄴ: $x=1/\\sqrt2$의 좌우에서 $f''$의 부호가 양에서 음으로 바뀌므로 변곡점의 $x$좌표는 $1/\\sqrt2$가 맞다.\nㄷ: $0<x<1/2$이면 $x^2<1/4$이므로 $\\frac{2}{x^2}>8$, 즉 $f''>-4+8>0$이어서 아래로 볼록이므로 틀리다.\n따라서 정답은 ③이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-085",
    "problemTypeKey": "PT_DERIVATIVE_MONOTONICITY",
    "templateKey": "TPL_MONOTONICITY_DIRECT",
    "crossConceptKeys": [
      "CC_FUNCTION_EXTREMA",
      "CC_DERIVATIVE_SIGN_EXTREMA_ANALYSIS"
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
    "content": "$f(x)=e^{-2x^2}$에 관해 옳은 것을 모두 고르시오.\nㄱ. 극댓값은 $1$이다.\nㄴ. 변곡점은 한 개이다.\nㄷ. $(-1/2,1/2)$에서 그래프는 위로 볼록하다.",
    "choices": [
      "ㄱ",
      "ㄴ",
      "ㄱ, ㄴ",
      "ㄱ, ㄷ",
      "ㄱ, ㄴ, ㄷ"
    ],
    "answer": "④",
    "solution": "합성함수의 미분법으로 $f'(x)=-4xe^{-2x^2}$이다.\nㄱ: $x<0$에서 $f'>0$, $x>0$에서 $f'<0$이고 $f(0)=e^0=1$이므로 극댓값은 $1$이 맞다.\n곱의 미분법으로 $f''(x)=-4e^{-2x^2}+(-4x)(-4x)e^{-2x^2}=(16x^2-4)e^{-2x^2}$이다.\n$f''=0$인 $x=\\pm1/2$의 좌우에서 부호가 각각 바뀌므로 변곡점은 두 개이고 ㄴ은 틀리다.\nㄷ: $-1/2<x<1/2$에서 $16x^2-4<0$이므로 $f''<0$, 즉 위로 볼록이어서 맞다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-085",
    "problemTypeKey": "PT_DERIVATIVE_MONOTONICITY",
    "templateKey": "TPL_MONOTONICITY_DIRECT",
    "crossConceptKeys": [
      "CC_FUNCTION_EXTREMA",
      "CC_DERIVATIVE_SIGN_EXTREMA_ANALYSIS"
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
    "content": "$0<x<2\\pi$에서 $f(x)=2e^{-x}\\cos x$에 관해 옳은 것을 모두 고르시오.\nㄱ. $x=7\\pi/4$에서 극대이다.\nㄴ. $(0,\\pi)$에서 위로 볼록하다.\nㄷ. 변곡점은 $(\\pi,-2e^{-\\pi})$이다.",
    "choices": [
      "ㄱ",
      "ㄴ",
      "ㄱ, ㄴ",
      "ㄱ, ㄷ",
      "ㄱ, ㄴ, ㄷ"
    ],
    "answer": "④",
    "solution": "곱의 미분법으로 $f'(x)=-2e^{-x}\\cos x-2e^{-x}\\sin x=-2e^{-x}(\\cos x+\\sin x)$이다.\n$\\cos x+\\sin x=\\sqrt2\\sin\\left(x+\\frac{\\pi}{4}\\right)$이므로 $f'=0$인 $x$는 $x+\\frac{\\pi}{4}=\\pi,2\\pi$, 즉 $x=3\\pi/4,\\,7\\pi/4$이다.\nㄱ: $x=7\\pi/4$의 좌우에서 $\\sin\\left(x+\\frac{\\pi}{4}\\right)$가 음에서 양으로 바뀌므로 $f'$는 양에서 음으로 바뀌고, 따라서 극대이다.\n곱의 미분법으로 $f''(x)=2e^{-x}(\\cos x+\\sin x)-2e^{-x}(\\cos x-\\sin x)=4e^{-x}\\sin x$이다.\nㄴ: $0<x<\\pi$에서 $\\sin x>0$이므로 $f''>0$, 즉 아래로 볼록이어서 틀리다.\nㄷ: $f''$는 $x=\\pi$에서만 부호가 바뀌고 $f(\\pi)=2e^{-\\pi}(-1)=-2e^{-\\pi}$이므로 변곡점은 $(\\pi,-2e^{-\\pi})$가 맞다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-085",
    "problemTypeKey": "PT_DERIVATIVE_MONOTONICITY",
    "templateKey": "TPL_MONOTONICITY_DIRECT",
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
    "content": "$x>0$에서 $f(x)=e^{2x}+3/x$가 $x=a$에서 극값을 갖는다. 옳은 것을 모두 고르시오.\nㄱ. $e^{2a}=3/a^2$이다.\nㄴ. $x=a$에서 최솟값을 갖는다.\nㄷ. 변곡점이 존재한다.",
    "choices": [
      "ㄱ",
      "ㄴ",
      "ㄱ, ㄴ",
      "ㄱ, ㄷ",
      "ㄱ, ㄴ, ㄷ"
    ],
    "answer": "②",
    "solution": "$x>0$에서 $f'(x)=2e^{2x}-\\frac{3}{x^2}$이다.\n극값 조건 $f'(a)=0$에서 $2e^{2a}=\\frac{3}{a^2}$, 즉 $e^{2a}=\\frac{3}{2a^2}$이므로 ㄱ의 $3/a^2$은 틀리다.\n$f''(x)=4e^{2x}+\\frac{6}{x^3}>0$이므로 $f'$는 $(0,\\infty)$에서 순증가한다.\n따라서 $f'=0$인 점은 $a$ 하나뿐이고 $f'$가 음에서 양으로 바뀌므로 $x=a$에서 최솟값을 갖는다(ㄴ 참).\n$f''>0$이 항상 성립하여 볼록성이 바뀌지 않으므로 변곡점은 존재하지 않는다(ㄷ 거짓).\n따라서 정답은 ②이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-085",
    "problemTypeKey": "PT_DERIVATIVE_MONOTONICITY",
    "templateKey": "TPL_MONOTONICITY_DIRECT",
    "crossConceptKeys": [
      "CC_DERIVATIVE_ROOT_SOLVING",
      "CC_FUNCTION_EXTREMA"
    ],
    "conditionKeys": [
      "COND_POSITIVE"
    ],
    "integrationPattern": "INTERDEPENDENT"
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
    "content": "$f(x)=2\\ln x+\\ln(6-x)$에 관해 옳은 것을 모두 고르시오.\nㄱ. 최댓값은 $5\\ln2$이다.\nㄴ. $f(x)=5\\ln2$는 서로 다른 두 실근을 갖는다.\nㄷ. $y=e^{f(x)}$는 $(0,2)$에서 위로 볼록하다.",
    "choices": [
      "ㄱ",
      "ㄴ",
      "ㄱ, ㄴ",
      "ㄱ, ㄷ",
      "ㄱ, ㄴ, ㄷ"
    ],
    "answer": "①",
    "solution": "정의역은 $x>0$이고 $6-x>0$에서 $0<x<6$이다.\n$f'(x)=\\frac{2}{x}-\\frac{1}{6-x}=\\frac{2(6-x)-x}{x(6-x)}=\\frac{12-3x}{x(6-x)}=\\frac{3(4-x)}{x(6-x)}$이다.\n분모가 양수이므로 $0<x<4$에서 $f'>0$, $4<x<6$에서 $f'<0$이고 $x=4$에서 극대이자 최대이다.\nㄱ: $f(4)=2\\ln4+\\ln2=\\ln16+\\ln2=\\ln32=5\\ln2$이므로 최댓값은 $5\\ln2$가 맞다.\nㄴ: $x=4$에서만 최댓값 $5\\ln2$를 가지므로 $f(x)=5\\ln2$의 근은 하나뿐이어서 틀리다.\nㄷ: $e^{f(x)}=e^{2\\ln x+\\ln(6-x)}=x^2(6-x)=6x^2-x^3$이고 $(e^{f})''=12-6x$이다.\n$0<x<2$에서 $12-6x>0$이므로 아래로 볼록이어서 ㄷ은 틀리다.\n따라서 정답은 ①이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-085",
    "problemTypeKey": "PT_DERIVATIVE_MONOTONICITY",
    "templateKey": "TPL_MONOTONICITY_DIRECT",
    "crossConceptKeys": [
      "CC_FUNCTION_EXTREMA",
      "CC_LOGARITHMIC_FUNCTION_GRAPH"
    ],
    "conditionKeys": [],
    "integrationPattern": "INTERDEPENDENT"
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
    "content": "$f(x)=2x+4\\sin x$ ($0<x<2\\pi$)에 관해 옳은 것을 모두 고르시오.\nㄱ. $2\\pi/3$에서 극대, $4\\pi/3$에서 극소이다.\nㄴ. 두 극값의 합은 $4\\pi$이다.\nㄷ. $0<a<b<\\pi/2$이면 $af(b)<bf(a)$이다.",
    "choices": [
      "ㄱ",
      "ㄴ",
      "ㄱ, ㄴ",
      "ㄱ, ㄷ",
      "ㄱ, ㄴ, ㄷ"
    ],
    "answer": "⑤",
    "solution": "사인함수의 미분법으로 $f'(x)=2+4\\cos x$이다.\n$f'(x)=0$에서 $\\cos x=-1/2$, 즉 $x=2\\pi/3,\\,4\\pi/3$이다.\n$0<x<2\\pi/3$에서 $f'>0$, $2\\pi/3<x<4\\pi/3$에서 $f'<0$, $4\\pi/3<x<2\\pi$에서 $f'>0$이므로 $2\\pi/3$에서 극대, $4\\pi/3$에서 극소이고 ㄱ은 맞다.\nㄴ: $f(2\\pi/3)=\\frac{4\\pi}{3}+4\\cdot\\frac{\\sqrt3}{2}=\\frac{4\\pi}{3}+2\\sqrt3$, $f(4\\pi/3)=\\frac{8\\pi}{3}+4\\cdot\\left(-\\frac{\\sqrt3}{2}\\right)=\\frac{8\\pi}{3}-2\\sqrt3$이다.\n두 극값의 합은 $\\frac{4\\pi}{3}+2\\sqrt3+\\frac{8\\pi}{3}-2\\sqrt3=\\frac{12\\pi}{3}=4\\pi$이므로 ㄴ은 맞다.\nㄷ: $g(x)=\\frac{f(x)}{x}=2+\\frac{4\\sin x}{x}$이고 $\\left(\\frac{\\sin x}{x}\\right)'=\\frac{x\\cos x-\\sin x}{x^2}<0$이므로 $g$는 $(0,\\pi/2)$에서 감소한다.\n$0<a<b<\\pi/2$이면 $\\frac{f(b)}{b}<\\frac{f(a)}{a}$이고 $ab>0$을 곱하면 $af(b)<bf(a)$이므로 ㄷ은 맞다.\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-085",
    "problemTypeKey": "PT_DERIVATIVE_MONOTONICITY",
    "templateKey": "TPL_MONOTONICITY_DIRECT",
    "crossConceptKeys": [
      "CC_TRIGONOMETRIC_EXTREMUM",
      "CC_FUNCTION_EXTREMA"
    ],
    "conditionKeys": [
      "COND_RESTRICTED_INTERVAL"
    ],
    "integrationPattern": "INTERDEPENDENT"
  }
];
