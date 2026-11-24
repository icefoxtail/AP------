window.examTitle = "미적분II_209_극값이존재하지않는부등식의활용_고2_유형은행1";

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
    "content": "$x\\ge0$인 모든 실수 $x$에 대하여 $4\\cos x\\ge k-3x^2$가 성립하도록 하는 실수 $k$의 최댓값은?",
    "choices": [
      "$1$",
      "$2$",
      "$3$",
      "$4$",
      "$5$"
    ],
    "answer": "④",
    "solution": "상수 $k$를 분리하면 모든 $x\\ge0$에서 $k\\le f(x)=4\\cos x+3x^2$이다.\n삼각함수의 미분법으로 $f'(x)=-4\\sin x+6x$를 구한다.\n$x>0$에서 평균값 정리에 의해 $0<c<x$인 $c$가 존재하여 $\\sin x-\\sin0=x\\cos c$이다.\n$\\cos c\\le1$이므로 $\\sin x\\le x$이고, 이를 $f'$에 대입하면 $f'(x)\\ge-4x+6x=2x>0$이다.\n따라서 $f$는 $[0,\\infty)$에서 증가하고 최솟값은 $f(0)=4\\cos0+3\\cdot0^2=4$이다.\n그러므로 $k\\le4$이어야 하고, $k=4$일 때 원래 부등식이 성립한다.\n따라서 $k$의 최댓값은 $4$이다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-090",
    "problemTypeKey": "PT_DERIVATIVE_EQUATION_INEQUALITY",
    "templateKey": "TPL_GLOBAL_INEQUALITY_BY_DERIVATIVE",
    "crossConceptKeys": [
      "CC_DERIVATIVE_SIGN_EXTREMA_ANALYSIS"
    ],
    "conditionKeys": [
      "COND_LOWER_BOUND"
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
    "content": "모든 양수 $x$에서 $2\\cos(2x)>k-5x^2$가 성립하도록 하는 실수 $k$의 범위는?",
    "choices": [
      "$k<2$",
      "$k\\le2$",
      "$k<4$",
      "$k\\le4$",
      "$k\\ge2$"
    ],
    "answer": "②",
    "solution": "$2\\cos(2x)>k-5x^2$를 정리하면 모든 $x>0$에서 $k<f(x)=2\\cos(2x)+5x^2$이다.\n합성함수의 미분법으로 $f'(x)=-4\\sin(2x)+10x$를 구한다.\n$x>0$에서 평균값 정리에 의해 $0<c<2x$인 $c$가 존재하여 $\\sin(2x)-\\sin0=2x\\cos c$이다.\n$\\cos c\\le1$이므로 $\\sin(2x)\\le2x$이고, 따라서 $f'(x)\\ge-4\\cdot2x+10x=2x>0$이다.\n즉 $f$는 $[0,\\infty)$에서 증가하고 $f(0)=2\\cos0+5\\cdot0^2=2$이다.\n$x>0$이면 $f(x)>f(0)=2$이므로, $k\\le2$일 때 $k<f(x)$가 항상 성립한다.\n$k>2$이면 $\\lim_{x\\to0^+}f(x)=2<k$이므로 충분히 작은 양수 $x$에서 $f(x)<k$가 되어 조건이 깨진다.\n주의: $x=0$은 제외되므로 $k=2$도 허용된다.\n따라서 $k$의 범위는 $k\\le2$이다.\n따라서 정답은 ②이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-090",
    "problemTypeKey": "PT_DERIVATIVE_EQUATION_INEQUALITY",
    "templateKey": "TPL_GLOBAL_INEQUALITY_BY_DERIVATIVE",
    "crossConceptKeys": [
      "CC_DERIVATIVE_SIGN_EXTREMA_ANALYSIS",
      "CC_FUNCTION_MONOTONICITY"
    ],
    "conditionKeys": [
      "COND_POSITIVE"
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
    "content": "모든 양수 $x$에 대하여 $e^{2x}-2x^2-2x+k\\ge3$이 성립하도록 하는 실수 $k$의 최솟값은?",
    "choices": [
      "$-2$",
      "$-1$",
      "$0$",
      "$1$",
      "$2$"
    ],
    "answer": "⑤",
    "solution": "모든 $x>0$에서 성립하도록 $F(x)=e^{2x}-2x^2-2x$라 하면 $F(x)\\ge3-k$이다.\n합성함수의 미분법으로 $F'(x)=2e^{2x}-4x-2$를 구한다.\n다시 미분하면 $F''(x)=4e^{2x}-4$이다.\n$x>0$에서 $e^{2x}>1$이므로 $F''(x)>0$이고, $F'$는 $[0,\\infty)$에서 증가한다.\n따라서 $x>0$에서 $F'(x)>F'(0)=2e^0-0-2=0$이므로 $F$도 $[0,\\infty)$에서 증가한다.\n$x>0$에서 $F(x)>F(0)=e^0-0-0=1$이고, $\\lim_{x\\to0^+}F(x)=1$이다.\n(i) $k\\ge2$이면 $3-k\\le1<F(x)$이므로 모든 $x>0$에서 성립한다.\n(ii) $k<2$이면 $3-k>1$이고 $\\lim_{x\\to0^+}F(x)=1$이므로 충분히 작은 양수 $x$에서 $F(x)<3-k$가 되어 조건이 깨진다.\n그러므로 가능한 $k$는 $k\\ge2$이고 최솟값은 $2$이다.\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-090",
    "problemTypeKey": "PT_DERIVATIVE_EQUATION_INEQUALITY",
    "templateKey": "TPL_GLOBAL_INEQUALITY_BY_DERIVATIVE",
    "crossConceptKeys": [
      "CC_DERIVATIVE_SIGN_EXTREMA_ANALYSIS"
    ],
    "conditionKeys": [
      "COND_POSITIVE"
    ],
    "integrationPattern": "SEQUENTIAL"
  }
];
