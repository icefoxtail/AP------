window.examTitle = "미적분II_200_최대최소를이용한미정계수의결정_고2_유형은행1";

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
    "content": "$[0,\\pi/3]$에서 $f(x)=a[x-\\sin(3x)]$의 최댓값이 $\\pi/3$일 때, 양수 $a$는?",
    "choices": [
      "1",
      "2",
      "3",
      "4",
      "5"
    ],
    "answer": "①",
    "solution": "정의역 $[0,\\pi/3]$에서 미분한다. 합성함수의 미분법으로 $f'(x)=a[1-3\\cos 3x]$이다.\n$f'(x)=0$이면 $\\cos 3x=1/3$이고, $0\\le x\\le\\pi/3$에서 $0\\le 3x\\le\\pi$이므로 이를 만족하는 $x$는 $3x=\\arccos(1/3)$인 한 점 $x_0$ 하나뿐이다.\n$0<x<x_0$에서 $\\cos 3x>1/3$이므로 $f'(x)<0$이고, $x_0<x<\\pi/3$에서 $\\cos 3x<1/3$이므로 $f'(x)>0$이다.\n따라서 $x_0$은 극소점이고, 최댓값은 양 끝점에서 생긴다.\n$f(0)=a[0-\\sin 0]=0$이다.\n$f(\\pi/3)=a[\\pi/3-\\sin\\pi]=a\\pi/3$이다.\n$a>0$이므로 $a\\pi/3>0=f(0)$이고, 최댓값은 $a\\pi/3$이다.\n$a\\pi/3=\\pi/3$에서 $a=1$이다.\n주의: $f'(x)=0$인 점은 극소점이므로 그 값을 최댓값으로 오해하지 않는다.\n따라서 정답은 ①이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-087",
    "problemTypeKey": "PT_DERIVATIVE_MAX_MIN",
    "templateKey": "TPL_FUNCTION_DOMAIN_OPTIMIZATION",
    "crossConceptKeys": [
      "CC_TRIGONOMETRIC_EXTREMUM",
      "CC_DERIVATIVE_SIGN_EXTREMA_ANALYSIS"
    ],
    "conditionKeys": [
      "COND_POSITIVE",
      "COND_FUNCTION_VALUE_CONSTRAINT"
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
    "content": "함수 $f(x)=2x\\ln x-4x+k$의 최솟값이 $1$일 때, 실수 $k$는?",
    "choices": [
      "$2e-2$",
      "$2e-1$",
      "$2e$",
      "$2e+1/2$",
      "$2e+1$"
    ],
    "answer": "⑤",
    "solution": "진수 조건 $x>0$에서 정의역은 $x>0$이다.\n곱의 미분법과 $(-4x)'=-4$로 $f'(x)=2(\\ln x+1)-4=2(\\ln x-1)$이다.\n$f'(x)=0$이면 $\\ln x=1$, 즉 $x=e$이다.\n$0<x<e$에서 $\\ln x<1$이므로 $f'(x)<0$이고, $x>e$에서 $\\ln x>1$이므로 $f'(x)>0$이다.\n따라서 $f$는 $x=e$에서 최솟값을 갖는다.\n$f(e)=2e\\ln e-4e+k=2e-4e+k=k-2e$이다.\n최솟값이 $1$이므로 $k-2e=1$이다.\n따라서 $k=2e+1$이다.\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-087",
    "problemTypeKey": "PT_DERIVATIVE_MAX_MIN",
    "templateKey": "TPL_FUNCTION_DOMAIN_OPTIMIZATION",
    "crossConceptKeys": [
      "CC_LOGARITHMIC_FUNCTION_GRAPH",
      "CC_DERIVATIVE_ROOT_SOLVING"
    ],
    "conditionKeys": [
      "COND_FUNCTION_VALUE_CONSTRAINT"
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
    "content": "$k>0$이고 $f(x)=x^2-2\\ln(kx)$의 최솟값이 $1$일 때, $k$는?",
    "choices": [
      "$1$",
      "$e^{1/4}$",
      "$e^{1/2}$",
      "$e^{3/4}$",
      "$e$"
    ],
    "answer": "①",
    "solution": "$k>0$이고 진수 조건 $kx>0$에서 $x>0$이다.\n로그의 성질로 $\\ln(kx)=\\ln k+\\ln x$이므로 $f(x)=x^2-2\\ln x-2\\ln k$이다.\n미분하면 $f'(x)=2x-2/x=2(x^2-1)/x$이다.\n$x>0$이므로 $f'(x)=0$이면 $x^2=1$, 즉 $x=1$이다.\n$0<x<1$에서 $x^2-1<0$이므로 $f'(x)<0$이고, $x>1$에서 $x^2-1>0$이므로 $f'(x)>0$이다.\n따라서 $f$는 $x=1$에서 최솟값을 갖는다.\n$f(1)=1-2\\ln(k\\cdot 1)=1-2\\ln k$이다.\n최솟값이 $1$이므로 $1-2\\ln k=1$, 즉 $-2\\ln k=0$이다.\n$\\ln k=0$에서 $k=e^0=1$이다.\n따라서 정답은 ①이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-087",
    "problemTypeKey": "PT_DERIVATIVE_MAX_MIN",
    "templateKey": "TPL_FUNCTION_DOMAIN_OPTIMIZATION",
    "crossConceptKeys": [
      "CC_LOGARITHMIC_FUNCTION_GRAPH",
      "CC_DERIVATIVE_SIGN_EXTREMA_ANALYSIS"
    ],
    "conditionKeys": [
      "COND_POSITIVE",
      "COND_FUNCTION_VALUE_CONSTRAINT"
    ],
    "integrationPattern": "SEQUENTIAL"
  }
];
