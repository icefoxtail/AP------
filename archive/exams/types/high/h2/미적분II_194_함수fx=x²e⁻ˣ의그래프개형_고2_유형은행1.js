window.examTitle = "미적분II_194_함수fx=x²e⁻ˣ의그래프개형_고2_유형은행1";

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
    "content": "$f(x)=x^2e^{-2x}$에 관해 옳은 것을 모두 고르시오.\nㄱ. $x=0$에서 극소이다.\nㄴ. $x=1$에서 극대이다.\nㄷ. 두 변곡점의 $x$좌표의 합은 $4$이다.",
    "choices": [
      "ㄱ",
      "ㄱ, ㄴ",
      "ㄴ, ㄷ",
      "ㄱ, ㄷ",
      "ㄱ, ㄴ, ㄷ"
    ],
    "answer": "②",
    "solution": "함수의 정의역은 실수 전체이고 $f(x)=x^2e^{-2x}$이다.\n곱의 미분법과 합성함수의 미분법으로 $f'(x)=2xe^{-2x}+x^2(-2)e^{-2x}=2x(1-x)e^{-2x}$이다.\n$e^{-2x}>0$이므로 $f'$의 부호는 $2x(1-x)$의 부호와 같다.\n$x<0$에서 $2x<0$, $1-x>0$이므로 $f'<0$이다.\n$0<x<1$에서 $f'>0$이고 $x>1$에서 $f'<0$이다.\n따라서 $x=0$에서 음에서 양으로 바뀌므로 극소이고, $x=1$에서 양에서 음으로 바뀌므로 극대이다. (ㄱ, ㄴ 참)\n한 번 더 미분하면 $f''(x)=2(2x^2-4x+1)e^{-2x}$이다.\n$2x^2-4x+1=0$의 판별식은 $D=16-8=8>0$이므로 서로 다른 두 실근에서 부호가 바뀐다.\n근과 계수의 관계로 두 변곡점의 $x$좌표의 합은 $-\\dfrac{-4}{2}=2$이다. (ㄷ 거짓)\n따라서 정답은 ②이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-085",
    "problemTypeKey": "PT_DERIVATIVE_MONOTONICITY",
    "templateKey": "TPL_MONOTONICITY_DIRECT",
    "crossConceptKeys": [
      "CC_DERIVATIVE_SIGN_EXTREMA_ANALYSIS",
      "CC_DERIVATIVE_ROOT_SOLVING",
      "CC_CRITICAL_POINTS_SIGN_CHANGE"
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
    "content": "$f(x)=3x^2e^{-2x}$의 극댓값은?",
    "choices": [
      "$2e^{-2}$",
      "$3e^{-2}$",
      "$4e^{-2}$",
      "$5e^{-2}$",
      "$6e^{-2}$"
    ],
    "answer": "②",
    "solution": "곱의 미분법과 합성함수의 미분법으로 $f'(x)=6xe^{-2x}+3x^2(-2)e^{-2x}=6x(1-x)e^{-2x}$이다.\n$e^{-2x}>0$이므로 도함수의 부호는 $x(1-x)$의 부호와 같고, $x=0$에서 음에서 양으로, $x=1$에서 양에서 음으로 바뀐다.\n따라서 $x=0$에서 극소, $x=1$에서 극대이다.\n극댓값은 $f(1)=3\\cdot1^2e^{-2}=3e^{-2}$이다.\n따라서 정답은 ②이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-085",
    "problemTypeKey": "PT_DERIVATIVE_MONOTONICITY",
    "templateKey": "TPL_MONOTONICITY_DIRECT",
    "crossConceptKeys": [
      "CC_DERIVATIVE_ROOT_SOLVING",
      "CC_DERIVATIVE_VALUE_EVALUATION"
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
    "content": "$[0,2]$에서 $f(x)=2x^2e^{-2x}$의 최댓값과 최솟값의 합은?",
    "choices": [
      "$e^{-2}/2$",
      "$e^{-2}$",
      "$3e^{-2}/2$",
      "$7e^{-2}/4$",
      "$2e^{-2}$"
    ],
    "answer": "⑤",
    "solution": "곱의 미분법과 합성함수의 미분법으로 $f'(x)=4xe^{-2x}+2x^2(-2)e^{-2x}=4x(1-x)e^{-2x}$이다.\n$e^{-2x}>0$이므로 $[0,2]$에서 $f'$는 $0<x<1$일 때 양, $1<x<2$일 때 음이다.\n따라서 $x=1$에서 최대이고 $f(1)=2\\cdot1^2e^{-2}=2e^{-2}$이다.\n한편 모든 $x$에서 $2x^2e^{-2x}\\ge0$이고 $f(0)=0$이므로 최솟값은 $0$이다.\n(참고: $f(2)=8e^{-4}$는 $2e^{-2}$보다 작으므로 최댓값에 영향이 없다.)\n최댓값과 최솟값의 합은 $2e^{-2}+0=2e^{-2}$이다.\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-085",
    "problemTypeKey": "PT_DERIVATIVE_MONOTONICITY",
    "templateKey": "TPL_MONOTONICITY_DIRECT",
    "crossConceptKeys": [
      "CC_RESTRICTED_DOMAIN_EXTREMA",
      "CC_INTERVAL_BOUNDS"
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
    "content": "$a>0$이고 $f(x)=ax^2e^{-2x}$의 극댓값과 극솟값의 합이 $3$일 때, $a$는?",
    "choices": [
      "$e^2$",
      "$2e^2$",
      "$3e^2$",
      "$4e^2$",
      "$5e^2$"
    ],
    "answer": "③",
    "solution": "곱의 미분법과 합성함수의 미분법으로 $f'(x)=2axe^{-2x}+ax^2(-2)e^{-2x}=2ax(1-x)e^{-2x}$이다.\n$a>0$이고 $e^{-2x}>0$이므로 $f'$의 부호는 $x(1-x)$의 부호와 같아 $-,+,-$ 순이다.\n따라서 $x=0$에서 극소이고 극솟값은 $f(0)=0$이다.\n$x=1$에서 극대이고 극댓값은 $f(1)=a\\cdot1^2e^{-2}=ae^{-2}$이다.\n극댓값과 극솟값의 합이 $3$이므로 $ae^{-2}+0=3$에서 $a=3e^2$이다.\n따라서 정답은 ③이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-085",
    "problemTypeKey": "PT_DERIVATIVE_MONOTONICITY",
    "templateKey": "TPL_MONOTONICITY_DIRECT",
    "crossConceptKeys": [
      "CC_DERIVATIVE_ROOT_SOLVING",
      "CC_EXTREMA_EQUATION_ROOTS"
    ],
    "conditionKeys": [
      "COND_POSITIVE"
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
    "content": "방정식 $2x^2e^{-2x}=a$가 서로 다른 세 실근을 갖도록 하는 실수 $a$의 범위는?",
    "choices": [
      "$0<a<2e^{-2}$",
      "$0<a\\le2e^{-2}$",
      "$a>2e^{-2}$",
      "$a<0$",
      "$-2e^{-2}<a<0$"
    ],
    "answer": "①",
    "solution": "$f(x)=2x^2e^{-2x}$로 놓으면 곱의 미분법과 합성함수의 미분법으로 $f'(x)=4xe^{-2x}+2x^2(-2)e^{-2x}=4x(1-x)e^{-2x}$이다.\n$e^{-2x}>0$이므로 $f'$의 부호는 $x(1-x)$의 부호와 같아 $(-\\infty,0)$에서 $-$,\n$(0,1)$에서 $+$, $(1,\\infty)$에서 $-$이다.\n따라서 $x=0$에서 극소이고 $f(0)=0$, $x=1$에서 극대이고 $f(1)=2e^{-2}$이다.\n극한은 $x\\to-\\infty$일 때 $x^2\\to\\infty$, $e^{-2x}\\to\\infty$이므로 $f(x)\\to\\infty$이다.\n$x\\to\\infty$일 때는 지수함수가 다항함수보다 빠르게 커지므로 $\\dfrac{2x^2}{e^{2x}}\\to0$, 즉 $f(x)\\to0$이다.\n그래프는 $(-\\infty,0]$에서 $\\infty$에서 $0$까지 감소, $[0,1]$에서 $0$에서 $2e^{-2}$까지 증가, $[1,\\infty)$에서 $2e^{-2}$에서 $0$으로 감소한다.\n수평선 $y=a$가 세 단조 구간에서 각각 한 번씩 만나려면 $0<a<2e^{-2}$이어야 한다.\n주의: $a=2e^{-2}$이면 $x=1$에서 접하여 근이 $2$개뿐이고, $a\\le0$이면 근이 $1$개 이하이다.\n따라서 정답은 ①이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
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
  }
];
