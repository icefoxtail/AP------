window.examTitle = "미적분II_199_진수조건이있는로그함수의최대최소_고2_유형은행1";

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
    "content": "$[1,e^3]$에서 함수 $f(x)=4x-2x\\ln x$의 최댓값은?",
    "choices": [
      "$e/2$",
      "$e$",
      "$3e/2$",
      "$2e$",
      "$3e$"
    ],
    "answer": "④",
    "solution": "정의역은 $x>0$이고 주어진 구간 $[1,e^3]$에서 $f$는 연속이다.\n곱의 미분법으로 $(x\\ln x)'=\\ln x+1$이므로 $f'(x)=4-2(\\ln x+1)=2(1-\\ln x)$이다.\n$f'(x)=0$인 점은 $\\ln x=1$, 즉 $x=e$이다.\n$1<x<e$에서 $\\ln x<1$이므로 $f'(x)>0$이고, $e<x<e^3$에서 $f'(x)<0$이다.\n따라서 $x=e$에서 극대이자 최대이고 $f(e)=4e-2e\\ln e=4e-2e=2e$이다.\n주의: 닫힌구간이므로 양 끝값도 확인하면 $f(1)=4$, $f(e^3)=4e^3-6e^3=-2e^3$이고 모두 $2e$보다 작다.\n따라서 정답은 ④이다.",
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
    "content": "함수 $f(x)=\\ln x+3\\ln(4-x)$의 최댓값은?",
    "choices": [
      "$\\ln9$",
      "$\\ln18$",
      "$\\ln27$",
      "$\\ln36$",
      "$\\ln45$"
    ],
    "answer": "③",
    "solution": "진수 조건 $x>0$, $4-x>0$에서 정의역은 $0<x<4$이다.\n$f'(x)=\\frac1x-\\frac3{4-x}=\\frac{(4-x)-3x}{x(4-x)}=\\frac{4(1-x)}{x(4-x)}$이다.\n$0<x<4$에서 분모 $x(4-x)>0$이므로 $f'(x)$의 부호는 $1-x$의 부호와 같다.\n$0<x<1$에서 $f'(x)>0$, $1<x<4$에서 $f'(x)<0$이므로 $x=1$에서 최댓값을 갖는다.\n$f(1)=\\ln1+3\\ln3=0+\\ln(3^3)=\\ln27$이다.\n또 $x\\to0^+$ 또는 $x\\to4^-$일 때 $f(x)\\to-\\infty$이므로 이 값이 최댓값이다.\n따라서 정답은 ③이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-087",
    "problemTypeKey": "PT_DERIVATIVE_MAX_MIN",
    "templateKey": "TPL_FUNCTION_DOMAIN_OPTIMIZATION",
    "crossConceptKeys": [
      "CC_LOGARITHMIC_FUNCTION_GRAPH",
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
    "content": "설비를 가동한 뒤 $t$개월 시점의 월 운영비가 $C(t)=4t-28\\ln(t+2)+100$만 원이다. $0\\le t\\le12$에서 월 운영비가 최소인 시점은?",
    "choices": [
      "2개월 후",
      "3개월 후",
      "4개월 후",
      "5개월 후",
      "6개월 후"
    ],
    "answer": "④",
    "solution": "$t+2>0$이므로 $0\\le t\\le12$ 전체에서 $C(t)$는 미분가능하다.\n$C'(t)=4-\\frac{28}{t+2}=\\frac{4(t+2)-28}{t+2}=\\frac{4(t-5)}{t+2}$이다.\n$0\\le t<5$에서 $t-5<0$이므로 $C'(t)<0$이고, $5<t\\le12$에서 $C'(t)>0$이다.\n따라서 $C(t)$는 $t=5$까지 감소하고 $t=5$ 이후 증가하므로 $t=5$에서 최소이다.\n즉 월 운영비가 최소인 시점은 5개월 후이다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-087",
    "problemTypeKey": "PT_DERIVATIVE_MAX_MIN",
    "templateKey": "TPL_FUNCTION_DOMAIN_OPTIMIZATION",
    "crossConceptKeys": [
      "CC_LOGARITHMIC_FUNCTION_GRAPH",
      "CC_DERIVATIVE_SIGN_EXTREMA_ANALYSIS"
    ],
    "conditionKeys": [
      "COND_RESTRICTED_INTERVAL"
    ],
    "integrationPattern": "SEQUENTIAL"
  }
];
