window.examTitle = "미적분II_187_변곡점의진위판단_고2_유형은행1";

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
    "content": "아래는 $(-2,5)$에서 $y=f'(x)$의 그래프이다. 옳은 것을 모두 고르시오.\nㄱ. $f$의 극값은 2개이다.\nㄴ. $f$의 변곡점은 1개이다.\nㄷ. $f$는 $(1,3)$에서 증가한다.\n[그림: $y=x(x-3)^2$를 그린다. 영점 $0,3$, 극대점 $(1,4)$, 극소점 $(3,0)$을 표시한다.]",
    "choices": [
      "ㄱ",
      "ㄴ",
      "ㄷ",
      "ㄱ, ㄴ",
      "ㄱ, ㄴ, ㄷ"
    ],
    "answer": "③",
    "solution": "주어진 그래프에서 $f'(x)=x(x-3)^2=x^3-6x^2+9x$로 둔다.\n이계도함수를 구하면 $f''(x)=3x^2-12x+9=3(x-1)(x-3)$이다.\nㄱ: $f'$의 부호는 $x<0$에서 $-$, $0<x<3$에서 $+$, $x>3$에서 $+$이므로 $x=0$에서만 극값을 갖는다. 따라서 ㄱ은 거짓이다.\nㄴ: $f''$의 부호는 $x<1$에서 $+$, $1<x<3$에서 $-$, $x>3$에서 $+$로 $x=1,3$에서 바뀐다.\n따라서 변곡점은 두 개이므로 ㄴ은 거짓이다.\nㄷ: $1<x<3$이면 $x>0$, $(x-3)^2>0$이므로 $f'(x)>0$이다.\n따라서 $f$는 $(1,3)$에서 증가하므로 ㄷ은 참이다.\n주의: $f'(3)=0$이지만 $3$의 양쪽에서 부호가 바뀌지 않으므로 $x=3$은 극값이 아니다.\n따라서 정답은 ③이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-178",
    "problemTypeKey": "PT_CALCULUS_CONCAVITY_INFLECTION",
    "templateKey": "TPL_CALCULUS_INFLECTION_CONDITION",
    "crossConceptKeys": [
      "CC_CONTINUOUS_FUNCTION_GRAPH_INTERPRETATION",
      "CC_CRITICAL_POINTS_SIGN_CHANGE",
      "CC_FUNCTION_MONOTONICITY"
    ],
    "conditionKeys": [
      "COND_RESTRICTED_INTERVAL"
    ],
    "integrationPattern": "SEQUENTIAL",
    "image": "assets/images/미적분II_187_변곡점의진위판단_고2_유형은행1/q1-problem.svg",
    "imageAlt": "도함수 또는 함수의 주어진 다항곡선과 원문에 명시된 특징점을 보인다.",
    "imageCaption": "도함수 또는 함수의 주어진 다항곡선과 원문에 명시된 특징점을 보인다.",
    "imageSize": "medium"
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
    "content": "실수 전체에서 두 번 미분 가능한 함수 $f$에 대해 항상 옳은 것을 모두 고르시오.\nㄱ. 구간에서 $f''<0$이면 $f'$는 감소한다.\nㄴ. 구간에서 $f''>0$이면 $f$의 그래프는 아래로 볼록하다.\nㄷ. $f''(2)=0$이면 $(2,f(2))$는 변곡점이다.",
    "choices": [
      "ㄱ",
      "ㄴ",
      "ㄷ",
      "ㄱ, ㄴ",
      "ㄱ, ㄴ, ㄷ"
    ],
    "answer": "④",
    "solution": "ㄱ: 구간에서 $f''<0$이면 $f'$의 도함수가 음수이므로 $f'$는 감소한다. 따라서 ㄱ은 참이다.\nㄴ: $f''>0$인 구간에서는 접선의 기울기 $f'$가 증가하므로 그래프는 아래로 볼록하다. 따라서 ㄴ은 참이다.\nㄷ: 반례를 찾기 위해 $f(x)=(x-2)^4$로 둔다.\n그러면 $f'(x)=4(x-2)^3$, $f''(x)=12(x-2)^2$이다.\n$f''(2)=0$이지만 $x\\ne2$에서 $f''(x)>0$이므로 $x=2$의 양쪽에서 부호가 바뀌지 않는다.\n따라서 $(2,f(2))$는 변곡점이 아니므로 ㄷ은 거짓이다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-178",
    "problemTypeKey": "PT_CALCULUS_CONCAVITY_INFLECTION",
    "templateKey": "TPL_CALCULUS_INFLECTION_CONDITION",
    "crossConceptKeys": [
      "CC_FUNCTION_MONOTONICITY",
      "CC_CRITICAL_POINTS_SIGN_CHANGE"
    ],
    "conditionKeys": [],
    "integrationPattern": "NONE"
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
    "content": "아래는 $y=f'(x)$의 그래프이다. 옳은 것을 모두 고르시오.\nㄱ. $[1,3]$ 안에서 $f$는 극값을 갖지 않는다.\nㄴ. $(2,3)$에서 $f$의 그래프는 아래로 볼록하다.\nㄷ. $x=2$에서 $f$의 그래프는 변곡점을 갖는다.\n[그림: $y=1+\\sin^2(\\pi x/2)$를 $0\\le x\\le4$에서 그린다. $(1,2),(2,1),(3,2)$를 표시한다.]",
    "choices": [
      "ㄱ",
      "ㄴ",
      "ㄷ",
      "ㄱ, ㄴ",
      "ㄱ, ㄴ, ㄷ"
    ],
    "answer": "⑤",
    "solution": "주어진 그래프에서 $f'(x)=1+\\sin^2\\left(\\frac{\\pi x}{2}\\right)$이고 $f'(x)\\ge1>0$이다.\nㄱ: $[1,3]$에서 $f'(x)>0$이므로 $f$는 순증가한다. 따라서 극값이 없어 ㄱ은 참이다.\nㄴ: 합성함수의 미분법으로 $f''(x)=2\\sin\\left(\\frac{\\pi x}{2}\\right)\\cos\\left(\\frac{\\pi x}{2}\\right)\\cdot\\frac{\\pi}{2}=\\frac{\\pi}{2}\\sin(\\pi x)$이다.\n$2<x<3$이면 $\\pi x\\in(2\\pi,3\\pi)$이므로 $\\sin(\\pi x)>0$이다.\n따라서 $f''(x)>0$이어서 $f$의 그래프는 아래로 볼록하므로 ㄴ은 참이다.\nㄷ: $f''(2)=\\frac{\\pi}{2}\\sin(2\\pi)=0$이고, $x=2$의 왼쪽에서 $f''<0$, 오른쪽에서 $f''>0$이다.\n따라서 $x=2$에서 볼록성이 바뀌어 변곡점이므로 ㄷ은 참이다.\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-178",
    "problemTypeKey": "PT_CALCULUS_CONCAVITY_INFLECTION",
    "templateKey": "TPL_CALCULUS_INFLECTION_CONDITION",
    "crossConceptKeys": [
      "CC_CONTINUOUS_FUNCTION_GRAPH_INTERPRETATION",
      "CC_DERIVATIVE_ROOT_SOLVING"
    ],
    "conditionKeys": [
      "COND_RESTRICTED_INTERVAL"
    ],
    "integrationPattern": "SEQUENTIAL",
    "image": "assets/images/미적분II_187_변곡점의진위판단_고2_유형은행1/q3-problem.svg",
    "imageAlt": "0≤x≤4에서 f'(x)=1+sin²(πx/2)=3/2-(1/2)cos(πx)의 곡선과 세 점을 표시한다.",
    "imageCaption": "0≤x≤4에서 f'(x)=1+sin²(πx/2)=3/2-(1/2)cos(πx)의 곡선과 세 점을 표시한다.",
    "imageSize": "medium"
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
    "content": "아래는 구간 $(-1,4)$에서 연속인 함수 $f$의 도함수 그래프이다. $x=2$에서는 $f'$가 존재하지 않는다. 옳은 것을 모두 고르시오.\nㄱ. $f$의 극값을 갖는 점은 3개이다.\nㄴ. $x=1$은 변곡점의 $x$좌표이다.\nㄷ. $(0,1)$에서 $f$는 증가하고 아래로 볼록하다.\n[그림: $x<2$에서는 $y=1-(x-1)^2$, $x>2$에서는 $y=x-3$을 해당 범위 내에서 그린다. $(2,0),(2,-1)$에는 빈 점을 표시한다.]",
    "choices": [
      "ㄱ",
      "ㄴ",
      "ㄷ",
      "ㄱ, ㄴ",
      "ㄱ, ㄴ, ㄷ"
    ],
    "answer": "⑤",
    "solution": "$x<2$에서 $f'(x)=1-(x-1)^2=x(2-x)$이고, $x>2$에서 $f'(x)=x-3$이다.\nㄱ: $f'$의 부호를 읽으면 $(-1,0)$에서 $-$, $(0,2)$에서 $+$, $(2,3)$에서 $-$, $(3,4)$에서 $+$이다.\n따라서 $x=0$에서 극소, $x=2$에서 극대, $x=3$에서 극소이므로 극값을 갖는 점은 3개이다.\n$x=2$에서 $f'$는 존재하지 않지만 $f$가 연속이므로 부호 변화로 극대임을 판정한다.\n따라서 ㄱ은 참이다.\nㄴ: $x<2$에서 $f''(x)=2(1-x)$이므로 $x=1$의 왼쪽에서 $f''>0$, 오른쪽에서 $f''<0$이다.\n따라서 $f'$가 $x=1$에서 증가하다 감소하고, $x=1$은 변곡점의 $x$좌표이므로 ㄴ은 참이다.\nㄷ: $0<x<1$이면 $f'(x)=x(2-x)>0$이고 $f''(x)=2(1-x)>0$이다.\n따라서 $(0,1)$에서 $f$는 증가하고 아래로 볼록하므로 ㄷ은 참이다.\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-178",
    "problemTypeKey": "PT_CALCULUS_CONCAVITY_INFLECTION",
    "templateKey": "TPL_CALCULUS_INFLECTION_CONDITION",
    "crossConceptKeys": [
      "CC_CONTINUOUS_FUNCTION_GRAPH_INTERPRETATION",
      "CC_CRITICAL_POINTS_SIGN_CHANGE",
      "CC_DIFFERENTIABILITY"
    ],
    "conditionKeys": [
      "COND_RESTRICTED_INTERVAL"
    ],
    "integrationPattern": "SEQUENTIAL",
    "image": "assets/images/미적분II_187_변곡점의진위판단_고2_유형은행1/q4-problem.svg",
    "imageAlt": "x<2의 포물선 가지와 x>2의 직선 가지를 분리하고 x=2의 (2,0),(2,-1)에 빈 점을 보인다.",
    "imageCaption": "x<2의 포물선 가지와 x>2의 직선 가지를 분리하고 x=2의 (2,0),(2,-1)에 빈 점을 보인다.",
    "imageSize": "full"
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
    "content": "다항함수 $f$의 도함수 그래프가 아래와 같다. 옳은 것을 모두 고르시오.\nㄱ. $[-2,2]$에서 변곡점은 두 개이다.\nㄴ. $(-2,2)$에서 $f$는 극대인 점이 두 개이다.\nㄷ. $[-2,2]$에서 $f$의 최댓값은 $f(2)$이다.\n[그림: $y=x(x^2-1)$을 $[-2,2]$에서 그려 영점 $-1,0,1$을 표시한다.]",
    "choices": [
      "ㄱ",
      "ㄴ",
      "ㄱ, ㄷ",
      "ㄱ, ㄴ",
      "ㄱ, ㄴ, ㄷ"
    ],
    "answer": "③",
    "solution": "$f'(x)=x(x^2-1)=x^3-x$이므로 $f''(x)=3x^2-1$이다.\nㄱ: $f''(x)=0$에서 $x=\\pm\\frac1{\\sqrt3}$이고, 두 점에서 $f''$의 부호가 각각 바뀐다.\n두 점 모두 $[-2,2]$에 속하므로 변곡점은 두 개이다. 따라서 ㄱ은 참이다.\nㄴ: $f'$의 부호는 $x<-1$에서 $-$, $-1<x<0$에서 $+$, $0<x<1$에서 $-$, $x>1$에서 $+$이다.\n따라서 $x=0$에서만 극대이므로 극대인 점은 한 개이다. 따라서 ㄴ은 거짓이다.\nㄷ: 부정적분으로 $f(x)=\\frac{x^4}{4}-\\frac{x^2}{2}+C$이다.\n극값 후보와 끝점의 함수값은 $f(0)=C$, $f(\\pm1)=C-\\frac14$, $f(\\pm2)=C+2$이다.\n가장 큰 값은 $C+2=f(2)$이므로 $[-2,2]$에서 최댓값은 $f(2)$이다. 따라서 ㄷ은 참이다.\n따라서 정답은 ③이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-178",
    "problemTypeKey": "PT_CALCULUS_CONCAVITY_INFLECTION",
    "templateKey": "TPL_CALCULUS_INFLECTION_CONDITION",
    "crossConceptKeys": [
      "CC_CONTINUOUS_FUNCTION_GRAPH_INTERPRETATION",
      "CC_CRITICAL_POINTS_SIGN_CHANGE"
    ],
    "conditionKeys": [
      "COND_RESTRICTED_INTERVAL"
    ],
    "integrationPattern": "SEQUENTIAL",
    "image": "assets/images/미적분II_187_변곡점의진위판단_고2_유형은행1/q5-problem.svg",
    "imageAlt": "도함수 또는 함수의 주어진 다항곡선과 원문에 명시된 특징점을 보인다.",
    "imageCaption": "도함수 또는 함수의 주어진 다항곡선과 원문에 명시된 특징점을 보인다.",
    "imageSize": "medium"
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
    "content": "함수 $f$의 도함수 그래프가 아래와 같다. 옳은 것을 모두 고르시오.\nㄱ. $f$는 서로 다른 세 점에서 극값을 갖는다.\nㄴ. $f$의 변곡점은 두 개이다.\nㄷ. $-1<x_1<x_2<0$이면 $f((x_1+x_2)/2)>(f(x_1)+f(x_2))/2$이다.\n[그림: $y=x^2(2-x)$를 그린다. $x$축에 접하는 $(0,0)$, 극대점 $(4/3,32/27)$과 교점 $(2,0)$을 표시한다.]",
    "choices": [
      "ㄱ",
      "ㄴ",
      "ㄱ, ㄷ",
      "ㄴ, ㄷ",
      "ㄱ, ㄴ, ㄷ"
    ],
    "answer": "④",
    "solution": "$f'(x)=x^2(2-x)=-x^3+2x^2$이므로 $f''(x)=-3x^2+4x=x(4-3x)$이다.\nㄱ: $f'$의 부호는 $x<0$에서 $+$, $0<x<2$에서 $+$, $x>2$에서 $-$이다.\n$x=0$에서는 부호가 바뀌지 않고 $x=2$에서만 $+$에서 $-$로 바뀌므로 극값은 한 점에서만 갖는다.\n따라서 ㄱ은 거짓이다.\nㄴ: $f''(x)=0$에서 $x=0$ 또는 $x=\\frac43$이고, 두 점에서 $f''$의 부호가 바뀐다.\n따라서 변곡점은 두 개이므로 ㄴ은 참이다.\nㄷ: $-1<x<0$이면 $x<0$, $4-3x>0$이므로 $f''(x)=x(4-3x)<0$이다.\n따라서 이 구간에서 $f$는 위로 볼록하고, 중점의 함숫값이 두 끝점 함숫값의 평균보다 크다.\n즉 $f\\left(\\frac{x_1+x_2}{2}\\right)>\\frac{f(x_1)+f(x_2)}{2}$이므로 ㄷ은 참이다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-178",
    "problemTypeKey": "PT_CALCULUS_CONCAVITY_INFLECTION",
    "templateKey": "TPL_CALCULUS_INFLECTION_CONDITION",
    "crossConceptKeys": [
      "CC_CONTINUOUS_FUNCTION_GRAPH_INTERPRETATION",
      "CC_CRITICAL_POINTS_SIGN_CHANGE",
      "CC_AVERAGE_RATE_OF_CHANGE"
    ],
    "conditionKeys": [
      "COND_RANGE"
    ],
    "integrationPattern": "SEQUENTIAL",
    "image": "assets/images/미적분II_187_변곡점의진위판단_고2_유형은행1/q6-problem.svg",
    "imageAlt": "도함수 또는 함수의 주어진 다항곡선과 원문에 명시된 특징점을 보인다.",
    "imageCaption": "도함수 또는 함수의 주어진 다항곡선과 원문에 명시된 특징점을 보인다.",
    "imageSize": "medium"
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
    "content": "실수 전체에서 $f(x)>2$, $f(0)=5$, $f'(x)=2[f(x)-2]$인 함수 $f$에 대해 옳은 것을 모두 고르시오.\nㄱ. $f(x)=2+3e^{2x}$이다.\nㄴ. $f$가 감소하는 열린구간이 있다.\nㄷ. $f$의 그래프는 변곡점을 갖는다.",
    "choices": [
      "ㄱ",
      "ㄴ",
      "ㄷ",
      "ㄱ, ㄴ",
      "ㄱ, ㄴ, ㄷ"
    ],
    "answer": "①",
    "solution": "$f(x)-2=g(x)$로 놓으면 $g(x)>0$이고 $g'(x)=f'(x)=2g(x)$이다.\n따라서 $g(x)=Ce^{2x}$이고, $g(0)=f(0)-2=5-2=3$이므로 $C=3$이다.\n즉 $f(x)=2+3e^{2x}$이므로 ㄱ은 참이다.\nㄴ: $f'(x)=6e^{2x}>0$이므로 $f$는 모든 실수에서 증가한다. 따라서 감소하는 열린구간은 없어 ㄴ은 거짓이다.\nㄷ: $f''(x)=12e^{2x}>0$이므로 $f''$의 부호가 바뀌지 않는다.\n따라서 그래프는 변곡점을 갖지 않아 ㄷ은 거짓이다.\n따라서 정답은 ①이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-178",
    "problemTypeKey": "PT_CALCULUS_CONCAVITY_INFLECTION",
    "templateKey": "TPL_CALCULUS_INFLECTION_CONDITION",
    "crossConceptKeys": [
      "CC_EXPONENTIAL_FUNCTION_GRAPH",
      "CC_EXPONENTIAL_GROWTH"
    ],
    "conditionKeys": [
      "COND_FUNCTION_VALUE_CONSTRAINT"
    ],
    "integrationPattern": "SEQUENTIAL"
  }
];
