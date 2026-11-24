window.examTitle = "미적분II_193_함수fx=xe⁻ˣ의그래프개형_고2_유형은행1";

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
    "content": "$f(x)=xe^{-2x}$의 변곡점에서 접선이 $y=ax+b$일 때, $a+b$는?",
    "choices": [
      "$-e^{-2}$",
      "$e^{-2}$",
      "$2e^{-2}$",
      "$3e^{-2}$",
      "$4e^{-2}$"
    ],
    "answer": "②",
    "solution": "주어진 함수를 곱의 미분법으로 미분하면 $f'(x)=e^{-2x}+x(-2e^{-2x})=(1-2x)e^{-2x}$이다.\n다시 곱의 미분법과 합성함수의 미분법을 쓰면 $f''(x)=-2e^{-2x}+(1-2x)(-2e^{-2x})=4(x-1)e^{-2x}$이다.\n$x<1$에서 $f''(x)<0$, $x>1$에서 $f''(x)>0$이므로 $x=1$에서 볼록성이 바뀐다.\n따라서 변곡점은 $(1,f(1))=(1,e^{-2})$이다.\n접선의 기울기는 $f'(1)=(1-2)e^{-2}=-e^{-2}$이므로 $a=-e^{-2}$이다.\n접선의 방정식은 $y=-e^{-2}(x-1)+e^{-2}=-e^{-2}x+2e^{-2}$이므로 $b=2e^{-2}$이다.\n그러므로 $a+b=-e^{-2}+2e^{-2}=e^{-2}$이다.\n따라서 정답은 ②이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-085",
    "problemTypeKey": "PT_DERIVATIVE_MONOTONICITY",
    "templateKey": "TPL_MONOTONICITY_DIRECT",
    "crossConceptKeys": [
      "CC_TANGENT_LINE_SLOPE_AT_POINT",
      "CC_DERIVATIVE_VALUE_EVALUATION"
    ],
    "conditionKeys": [],
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
    "content": "$[-1/2,2]$에서 $f(x)=xe^{-2x}$의 최댓값을 $M$, 최솟값을 $m$이라 할 때, $Mm$은?",
    "choices": [
      "$-1/2$",
      "$-1/4$",
      "$-1/8$",
      "$1/8$",
      "$1/4$"
    ],
    "answer": "②",
    "solution": "$f'(x)=e^{-2x}+x(-2e^{-2x})=(1-2x)e^{-2x}$이다.\n$f'(x)=0$인 임계점은 $x=1/2$이고, $x<1/2$에서 $f'(x)>0$, $x>1/2$에서 $f'(x)<0$이다.\n따라서 $f$는 $[-1/2,1/2]$에서 증가하고 $[1/2,2]$에서 감소하므로 최댓값은 $M=f(1/2)=(1/2)e^{-1}=1/(2e)$이다.\n끝점을 계산하면 $f(-1/2)=(-1/2)e^{1}=-e/2$이고 $f(2)=2e^{-4}>0$이다.\n증가 구간의 왼쪽 끝값이 음수이므로 최솟값은 $m=f(-1/2)=-e/2$이다.\n따라서 $Mm=(1/(2e))(-e/2)=-1/4$이다.\n따라서 정답은 ②이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-085",
    "problemTypeKey": "PT_DERIVATIVE_MONOTONICITY",
    "templateKey": "TPL_MONOTONICITY_DIRECT",
    "crossConceptKeys": [
      "CC_RESTRICTED_DOMAIN_EXTREMA",
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
    "content": "제1사분면의 곡선 $y=6e^{-3x}$ 위 점 P에서 두 좌표축에 내린 수선의 발을 각각 Q, R이라 할 때 직사각형 OQPR의 최대 넓이는? [그림: $y=6e^{-3x}$와 P$(t,6e^{-3t})$, Q$(t,0)$, R$(0,6e^{-3t})$, O$(0,0)$을 표시하고 직사각형을 그린다.]",
    "choices": [
      "$1/(2e)$",
      "$1/e$",
      "$4/(3e)$",
      "$5/(3e)$",
      "$2/e$"
    ],
    "answer": "⑤",
    "solution": "P의 좌표를 $(t,6e^{-3t})$ $(t>0)$라 하면 Q$(t,0)$, R$(0,6e^{-3t})$이므로 직사각형 OQPR의 넓이는 $A(t)=t(6e^{-3t})=6te^{-3t}$이다.\n곱과 합성함수의 미분법으로 $A'(t)=6e^{-3t}+6t(-3e^{-3t})=6(1-3t)e^{-3t}$이다.\n$A'(t)=0$에서 $t=1/3$이고, $0<t<1/3$에서 $A'(t)>0$, $t>1/3$에서 $A'(t)<0$이다.\n따라서 $t=1/3$에서 넓이가 최대이다.\n최댓값은 $A(1/3)=6(1/3)e^{-3(1/3)}=2e^{-1}=2/e$이다.\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-085",
    "problemTypeKey": "PT_DERIVATIVE_MONOTONICITY",
    "templateKey": "TPL_MONOTONICITY_DIRECT",
    "crossConceptKeys": [
      "CC_EXPONENTIAL_DECAY",
      "CC_RESTRICTED_DOMAIN_DERIVATIVE_OPTIMIZATION"
    ],
    "conditionKeys": [
      "COND_POSITIVE"
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
    "content": "방정식 $3xe^{-2x}-a=0$이 서로 다른 두 실근을 가질 $a$의 범위는?",
    "choices": [
      "$0<a<3/(2e)$",
      "$0<a\\le3/(2e)$",
      "$a<0$",
      "$a>3/(2e)$",
      "$-3/(2e)<a<0$"
    ],
    "answer": "①",
    "solution": "$f(x)=3xe^{-2x}$라 하면 방정식은 $f(x)=a$가 되어 $y=f(x)$와 수평선 $y=a$의 교점 수를 세는 문제이다.\n곱과 합성함수의 미분법으로 $f'(x)=3e^{-2x}+3x(-2e^{-2x})=3(1-2x)e^{-2x}$이다.\n$f'(x)=0$인 $x=1/2$를 기준으로 $x<1/2$에서 $f'(x)>0$, $x>1/2$에서 $f'(x)<0$이다.\n따라서 $f$는 $(-\\infty,1/2]$에서 증가하고 $[1/2,\\infty)$에서 감소하며 최댓값은 $f(1/2)=3(1/2)e^{-1}=3/(2e)$이다.\n극한을 구하면 $x\\to-\\infty$일 때 $3xe^{-2x}\\to-\\infty$이고, $x\\to\\infty$일 때 $3xe^{-2x}\\to0$이다.\n$x>1/2$에서는 항상 $f(x)>0$이고, $x<0$에서는 $f(x)<0$이다.\n(i) $a\\le0$이면 증가 구간에서 한 번만 만나므로 서로 다른 두 실근이 없다.\n(ii) $0<a<3/(2e)$이면 증가 구간에서 한 번, 감소 구간에서 한 번 만나 서로 다른 두 실근이 생긴다.\n(iii) $a=3/(2e)$이면 $x=1/2$에서 한 번만 만나고, $a>3/(2e)$이면 만나지 않는다.\n그러므로 $0<a<3/(2e)$이다.\n따라서 정답은 ①이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-085",
    "problemTypeKey": "PT_DERIVATIVE_MONOTONICITY",
    "templateKey": "TPL_MONOTONICITY_DIRECT",
    "crossConceptKeys": [
      "CC_GRAPH_INTERSECTION_COUNT",
      "CC_DERIVATIVE_SIGN_EXTREMA_ANALYSIS"
    ],
    "conditionKeys": [
      "COND_EXACT_INTERSECTION_COUNT"
    ],
    "integrationPattern": "REINTERPRETATION"
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
    "content": "모든 실수 $x$에서 $3x\\le ke^{2x}$이 성립하도록 하는 실수 $k$의 최솟값은?",
    "choices": [
      "$1/e$",
      "$3/(2e)$",
      "$2/e$",
      "$5/(2e)$",
      "$3/e$"
    ],
    "answer": "②",
    "solution": "$e^{2x}>0$이므로 부등식 $3x\\le ke^{2x}$의 양변을 $e^{2x}$로 나누면 $3xe^{-2x}\\le k$이다.\n모든 실수 $x$에서 성립하려면 $k$는 $g(x)=3xe^{-2x}$의 최댓값 이상이어야 한다.\n곱과 합성함수의 미분법으로 $g'(x)=3e^{-2x}+3x(-2e^{-2x})=3(1-2x)e^{-2x}$이다.\n$g'(x)=0$에서 $x=1/2$이고, $x<1/2$에서 $g'(x)>0$, $x>1/2$에서 $g'(x)<0$이다.\n따라서 $g$는 $x=1/2$에서 최대이고 최댓값은 $g(1/2)=3(1/2)e^{-1}=3/(2e)$이다.\n$x\\to-\\infty$에서 $g(x)\\to-\\infty$, $x\\to\\infty$에서 $g(x)\\to0$이므로 이 최댓값이 $g$의 최소 상계이다.\n그러므로 $k$의 최솟값은 $3/(2e)$이다.\n따라서 정답은 ②이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-085",
    "problemTypeKey": "PT_DERIVATIVE_MONOTONICITY",
    "templateKey": "TPL_MONOTONICITY_DIRECT",
    "crossConceptKeys": [
      "CC_FUNCTION_VALUE_SIGN_INEQUALITY",
      "CC_FUNCTION_EXTREMA"
    ],
    "conditionKeys": [
      "COND_UNIVERSAL_INPUTS"
    ],
    "integrationPattern": "REINTERPRETATION"
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
    "content": "$f(x)=2xe^{-x}$에 대해 옳은 것을 모두 고르시오.\nㄱ. 최댓값은 $2/e$이다.\nㄴ. $2<a<b$에서 $f((a+b)/2)>(f(a)+f(b))/2$이다.\nㄷ. $f(\\ln x)=2/e$의 실근은 하나이다.",
    "choices": [
      "ㄱ",
      "ㄴ",
      "ㄱ, ㄴ",
      "ㄱ, ㄷ",
      "ㄱ, ㄴ, ㄷ"
    ],
    "answer": "④",
    "solution": "곱과 합성함수의 미분법으로 $f'(x)=2e^{-x}+2x(-e^{-x})=2(1-x)e^{-x}$이다.\n$x<1$에서 $f'(x)>0$, $x>1$에서 $f'(x)<0$이므로 $f$는 $x=1$에서 최대이고 최댓값은 $f(1)=2e^{-1}=2/e$이다. 따라서 ㄱ은 옳다.\n다시 미분하면 $f''(x)=2[-e^{-x}+(1-x)(-e^{-x})]=2(x-2)e^{-x}$이다.\n$x>2$이면 $f''(x)>0$이므로 $f$는 $x>2$에서 아래로 볼록하다.\n아래로 볼록한 구간에서 $2<a<b$이면 $f((a+b)/2)<(f(a)+f(b))/2$이므로 ㄴ은 옳지 않다.\n$f(\\ln x)=2/e$에 $f(t)=2te^{-t}$를 대입하면 $2(\\ln x)e^{-\\ln x}=2/e$이다.\n$e^{-\\ln x}=1/x$이므로 $2\\ln x/x=2/e$, 즉 $\\ln x/x=1/e$이다.\n$h(x)=\\ln x/x$라 하면 $h'(x)=(1-\\ln x)/x^2$이고, $h$는 $0<x<e$에서 증가하고 $x>e$에서 감소한다.\n$h(e)=\\ln e/e=1/e$이므로 $h$의 최댓값은 $1/e$이고, 따라서 $\\ln x/x=1/e$의 해는 $x=e$ 하나뿐이다. 그러므로 ㄷ은 옳다.\n옳은 것은 ㄱ, ㄷ이다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-085",
    "problemTypeKey": "PT_DERIVATIVE_MONOTONICITY",
    "templateKey": "TPL_MONOTONICITY_DIRECT",
    "crossConceptKeys": [
      "CC_FUNCTION_EXTREMA",
      "CC_FUNCTIONAL_EQUATION",
      "CC_DERIVATIVE_SIGN_EXTREMA_ANALYSIS"
    ],
    "conditionKeys": [
      "COND_RANGE"
    ],
    "integrationPattern": "SEQUENTIAL"
  }
];
