window.examTitle = "미적분II_195_함수fx=xⁿe⁻ˣ의그래프개형_고2_유형은행1";

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
    "content": "$x^ne^{-2x}=e^{-2}$의 서로 다른 실근의 개수를 $N(n)$이라 할 때, $\\sum_{n=2}^5N(n)$은?",
    "choices": [
      "8",
      "9",
      "10",
      "11",
      "12"
    ],
    "answer": "②",
    "solution": "방정식 $x^ne^{-2x}=e^{-2}$의 실근은 $f_n(x)=x^ne^{-2x}$의 그래프와 직선 $y=e^{-2}$의 교점의 $x$좌표이다.\n곱의 미분법으로 $f_n'(x)=nx^{n-1}e^{-2x}-2x^ne^{-2x}=x^{n-1}(n-2x)e^{-2x}$이다.\n$x>0$에서 $x^{n-1}e^{-2x}>0$이므로 $f_n'$의 부호는 $n-2x$의 부호와 같고, $x=n/2$에서 $+$에서 $-$로 바뀐다.\n따라서 $x>0$에서 $f_n$은 $x=n/2$까지 증가한 뒤 감소하며, $f_n(0)=0$, $\\lim_{x\\to\\infty}f_n(x)=0$이다.\n(i) $n=2$: 최댓값 $f_2(1)=1^2e^{-2}=e^{-2}$가 직선의 높이와 같으므로 $x>0$에서 해는 $x=1$ 하나(접하는 경우)이다.\n(ii) $n\\ge3$: $f_n(1)=e^{-2}$이고 $f_n'(1)=(n-2)e^{-2}>0$이므로 최댓값 $f_n(n/2)$가 $e^{-2}$보다 크다.\n따라서 증가 구간에서 한 번, 감소 구간에서 한 번 교차하여 $x>0$에서 해가 두 개다.\n이제 $x<0$에서 $f_n'(x)=x^{n-1}(n-2x)e^{-2x}$이고 $n-2x>0$이다.\n(i) $n$이 짝수: $x^{n-1}<0$이라 $f_n'<0$이므로 $f_n$은 $x\\to-\\infty$에서 $+\\infty$, $x\\to0^-$에서 $0$으로 감소한다. 따라서 음의 해가 하나다.\n(ii) $n$이 홀수: $x<0$에서 $x^n<0$이므로 $f_n(x)<0<e^{-2}$이고 음의 해가 없다.\n그러므로 $N(2)=1+1=2$, $N(3)=2+0=2$, $N(4)=2+1=3$, $N(5)=2+0=2$이다.\n주의: $n=2$에서는 최댓값이 정확히 $e^{-2}$여서 접점이 되므로 양의 해가 1개뿐이다.\n따라서 $\\sum_{n=2}^{5}N(n)=2+2+3+2=9$이다.\n따라서 정답은 ②이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B45",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-085",
    "problemTypeKey": "PT_DERIVATIVE_MONOTONICITY",
    "templateKey": "TPL_MONOTONICITY_DIRECT",
    "crossConceptKeys": [
      "CC_GRAPH_INTERSECTION_COUNT",
      "CC_ROOT_INTERSECTION_COUNT_FUNCTION"
    ],
    "conditionKeys": [
      "COND_RANGE"
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
    "content": "홀수 $n\\ge3$에 대해 $f(x)=x^ne^{-2x}$이다. 옳은 것을 모두 고르시오.\nㄱ. $f(n/3)=f'(n/3)$이다.\nㄴ. $x=n$에서 극대이다.\nㄷ. 원점은 변곡점이다.",
    "choices": [
      "ㄱ",
      "ㄴ",
      "ㄱ, ㄴ",
      "ㄱ, ㄷ",
      "ㄱ, ㄴ, ㄷ"
    ],
    "answer": "④",
    "solution": "곱의 미분법으로 $f'(x)=nx^{n-1}e^{-2x}-2x^ne^{-2x}=x^{n-1}(n-2x)e^{-2x}$이다.\nㄱ: $x=n/3$을 대입하면 $n-2x=n-2\\cdot\\frac{n}{3}=\\frac{n}{3}$이다.\n따라서 $f'\\left(\\frac{n}{3}\\right)=\\left(\\frac{n}{3}\\right)^{n-1}\\cdot\\frac{n}{3}\\,e^{-2n/3}=\\left(\\frac{n}{3}\\right)^ne^{-2n/3}=f\\left(\\frac{n}{3}\\right)$이므로 ㄱ은 참이다.\nㄴ: $x>0$에서 $x^{n-1}>0$, $e^{-2x}>0$이므로 $f'$의 부호는 $n-2x$의 부호와 같다.\n$f'(x)=0$인 양수 $x$는 $x=n/2$ 하나뿐이고, $x=n$에서는 $f'(n)=n^{n-1}(n-2n)e^{-2n}=-n^ne^{-2n}<0$이다.\n$x=n/2$의 좌우에서 $n-2x$가 $+$에서 $-$로 바뀌므로 극대는 $x=n/2$에서만 생기고, $x=n$은 극대가 아니다. 따라서 ㄴ은 거짓이다.\nㄷ: 다시 미분하면 $f''(x)=x^{n-2}e^{-2x}\\left\\{n(n-1)-4nx+4x^2\\right\\}$이다.\n$x=0$ 근처에서 중괄호 안은 $n(n-1)>0$이고 $e^{-2x}>0$이다.\n$n$이 홀수이므로 $n-2$도 홀수여서 $x^{n-2}$는 $x=0$의 좌우에서 부호가 바뀐다.\n따라서 $f''$의 부호가 $x=0$에서 바뀌고 $f(0)=0$이므로 원점은 변곡점이다. ㄷ은 참이다.\n그러므로 옳은 것은 ㄱ, ㄷ이다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-085",
    "problemTypeKey": "PT_DERIVATIVE_MONOTONICITY",
    "templateKey": "TPL_MONOTONICITY_DIRECT",
    "crossConceptKeys": [
      "CC_DERIVATIVE_SIGN_EXTREMA_ANALYSIS",
      "CC_DERIVATIVE_VALUE_EVALUATION"
    ],
    "conditionKeys": [
      "COND_ODD",
      "COND_LOWER_BOUND"
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
    "content": "정수 $n\\ge2$에 대해 $f(x)=x^ne^{-2x}$이다. 옳은 것을 모두 고르시오.\nㄱ. 짝수 $n$이면 최솟값은 $0$이다.\nㄴ. 짝수 $n$이면 $x=0$에서 극소이다.\nㄷ. 홀수 $n$이면 $x=0$에서 극값을 갖지 않는다.\nㄹ. $f'(a)=(n/2)^{n-1}e^{-n}$인 $a$가 $(0,n/2)$에 존재한다.",
    "choices": [
      "ㄱ, ㄴ",
      "ㄴ, ㄷ",
      "ㄱ, ㄴ, ㄹ",
      "ㄴ, ㄷ, ㄹ",
      "ㄱ, ㄴ, ㄷ, ㄹ"
    ],
    "answer": "⑤",
    "solution": "곱의 미분법으로 $f'(x)=nx^{n-1}e^{-2x}-2x^ne^{-2x}=x^{n-1}(n-2x)e^{-2x}$이다.\nㄱ, ㄴ: $n$이 짝수이면 모든 실수 $x$에서 $x^n\\ge0$, $e^{-2x}>0$이므로 $f(x)\\ge0$이고 등호는 $x=0$에서만 성립한다.\n따라서 최솟값은 $f(0)=0$이고 $x=0$에서 극소이다. ㄱ, ㄴ은 모두 참이다.\nㄷ: $n$이 홀수이면 $n-1$이 짝수라 $x^{n-1}\\ge0$이다.\n$x=0$ 근처에서 $n-2x>0$이므로 $f'(x)\\ge0$이고 $f$는 $x=0$을 지나며 계속 증가한다.\n실제로 $x<0$이면 $f(x)<0$, $x>0$이면 $f(x)>0$이므로 $x=0$은 극값이 아니다. ㄷ은 참이다.\nㄹ: $f$는 $[0,n/2]$에서 연속, $(0,n/2)$에서 미분가능하므로 평균값 정리에 의해 $f'(a)=\\frac{f(n/2)-f(0)}{n/2-0}$인 $a\\in(0,n/2)$가 존재한다.\n$f(n/2)=(n/2)^ne^{-n}$, $f(0)=0$이므로 $f'(a)=\\frac{(n/2)^ne^{-n}}{n/2}=(n/2)^{n-1}e^{-n}$이다. ㄹ은 참이다.\n그러므로 옳은 것은 ㄱ, ㄴ, ㄷ, ㄹ이다.\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 5,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B45",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-085",
    "problemTypeKey": "PT_DERIVATIVE_MONOTONICITY",
    "templateKey": "TPL_MONOTONICITY_DIRECT",
    "crossConceptKeys": [
      "CC_MEAN_VALUE_THEOREM_FORMULA",
      "CC_DERIVATIVE_SIGN_EXTREMA_ANALYSIS"
    ],
    "conditionKeys": [
      "COND_INTEGER",
      "COND_LOWER_BOUND"
    ],
    "integrationPattern": "CASE_BRANCH"
  }
];
