window.examTitle = "미적분II_049_첫째항이미지수인등비급수의수렴조건_고2_유형은행1";

window.questionBank = [
  {
    "id": 1,
    "category": "급수",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-02",
    "standardUnit": "급수",
    "standardUnitOrder": 2,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "급수"
    ],
    "wide": false,
    "content": "$\\sum_{n=1}^{\\infty} (x+2)(\\frac{x-1}{3})^{n-1}$이 수렴하는 정수 $x$의 개수는?",
    "choices": [
      "$2$",
      "$3$",
      "$4$",
      "$5$",
      "$6$"
    ],
    "answer": "⑤",
    "solution": "급수는 첫째항이 $x+2$, 공비가 $\\dfrac{x-1}{3}$인 등비급수이다.\n등비급수의 수렴 조건은 첫째항이 $0$이거나 $\\left|\\text{공비}\\right|<1$이다.\n(i) $x=-2$이면 첫째항이 $0$이므로 모든 항이 $0$이어서 수렴한다.\n(ii) $x\\ne -2$이면 $\\left|\\dfrac{x-1}{3}\\right|<1$에서 $-3<x-1<3$, 즉 $-2<x<4$이다.\n이 범위의 정수는 $-1,0,1,2,3$의 $5$개이다.\n(i), (ii)를 합하면 $-2,-1,0,1,2,3$의 $6$개이다.\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-064",
    "problemTypeKey": "PT_CALCULUS_SERIES",
    "templateKey": "TPL_CALCULUS_SERIES_GEOMETRIC_SUM",
    "crossConceptKeys": [],
    "conditionKeys": [
      "COND_INTEGER"
    ],
    "integrationPattern": "CASE_BRANCH"
  },
  {
    "id": 2,
    "category": "급수",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-02",
    "standardUnit": "급수",
    "standardUnitOrder": 2,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "급수"
    ],
    "wide": false,
    "content": "$\\sum_{n=1}^{\\infty} \\frac{(x-7)(x-3)^n}{4^n}$이 수렴하는 정수 $x$의 합은?",
    "choices": [
      "$24$",
      "$26$",
      "$28$",
      "$30$",
      "$32$"
    ],
    "answer": "③",
    "solution": "급수는 첫째항이 $\\dfrac{(x-7)(x-3)}{4}$, 공비가 $\\dfrac{x-3}{4}$인 등비급수이다.\n(i) $x=7$이면 첫째항이 $0$이므로 모든 항이 $0$이어서 수렴한다.\n(ii) $x\\ne7$이면 $\\left|\\dfrac{x-3}{4}\\right|<1$에서 $-4<x-3<4$, 즉 $-1<x<7$이다.\n이 범위의 정수는 $0,1,2,3,4,5,6$의 $7$개이다.\n(i), (ii)에서 수렴하는 정수는 $0,1,\\ldots,7$이므로 합은 $\\dfrac{7\\cdot8}{2}=28$이다.\n주의: $x=-1$에서는 공비가 $-1$이 되어 일반항이 $0$에 수렴하지 않으므로 제외한다.\n따라서 정답은 ③이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-064",
    "problemTypeKey": "PT_CALCULUS_SERIES",
    "templateKey": "TPL_CALCULUS_SERIES_GEOMETRIC_SUM",
    "crossConceptKeys": [],
    "conditionKeys": [
      "COND_INTEGER"
    ],
    "integrationPattern": "CASE_BRANCH"
  },
  {
    "id": 3,
    "category": "급수",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-02",
    "standardUnit": "급수",
    "standardUnitOrder": 2,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "급수"
    ],
    "wide": false,
    "content": "$\\sum_{n=1}^{\\infty} (x^2-25)(\\frac{x-2}{3})^{n-1}$이 수렴하는 정수 $x$의 개수는?",
    "choices": [
      "$7$",
      "$8$",
      "$9$",
      "$10$",
      "$11$"
    ],
    "answer": "①",
    "solution": "급수는 첫째항이 $x^2-25$, 공비가 $\\dfrac{x-2}{3}$인 등비급수이다.\n(i) $x^2-25=0$, 즉 $x=-5$ 또는 $x=5$이면 첫째항이 $0$이므로 모든 항이 $0$이어서 수렴한다.\n(ii) $x\\ne\\pm5$이면 $\\left|\\dfrac{x-2}{3}\\right|<1$에서 $-3<x-2<3$, 즉 $-1<x<5$이다.\n이 범위의 정수는 $0,1,2,3,4$의 $5$개이다.\n(i), (ii)를 합하면 $-5,0,1,2,3,4,5$의 $7$개이다.\n따라서 정답은 ①이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-064",
    "problemTypeKey": "PT_CALCULUS_SERIES",
    "templateKey": "TPL_CALCULUS_SERIES_GEOMETRIC_SUM",
    "crossConceptKeys": [],
    "conditionKeys": [
      "COND_INTEGER"
    ],
    "integrationPattern": "CASE_BRANCH"
  },
  {
    "id": 4,
    "category": "급수",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-02",
    "standardUnit": "급수",
    "standardUnitOrder": 2,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "급수"
    ],
    "wide": false,
    "content": "$x+x(1-\\log_3(x+1))+x(1-\\log_3(x+1))^2+\\cdots$가 수렴하는 정수 $x$의 개수는?",
    "choices": [
      "$6$",
      "$7$",
      "$8$",
      "$9$",
      "$10$"
    ],
    "answer": "③",
    "solution": "수열의 각 항은 첫째항이 $x$, 공비가 $1-\\log_3(x+1)$인 등비수열을 이룬다.\n로그의 진수 조건에서 $x+1>0$, 즉 $x>-1$이다.\n(i) $x=0$이면 첫째항이 $0$이므로 모든 항이 $0$이어서 수렴한다.\n(ii) $x\\ne0$이면 등비급수의 수렴 조건 $\\left|1-\\log_3(x+1)\\right|<1$에서 $-1<1-\\log_3(x+1)<1$이다.\n각 변에서 $1$을 빼면 $-2<-\\log_3(x+1)<0$이고, 부호를 바꾸면 $0<\\log_3(x+1)<2$이다.\n밑이 $3>1$이므로 $1<x+1<9$, 즉 $0<x<8$이다.\n이 범위의 정수는 $1,2,3,4,5,6,7$의 $7$개이다.\n(i), (ii)를 합하면 $0,1,\\ldots,7$의 $8$개이다.\n따라서 정답은 ③이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-064",
    "problemTypeKey": "PT_CALCULUS_SERIES",
    "templateKey": "TPL_CALCULUS_SERIES_GEOMETRIC_SUM",
    "crossConceptKeys": [
      "CC_LOGARITHMIC_FUNCTION_GRAPH"
    ],
    "conditionKeys": [
      "COND_INTEGER"
    ],
    "integrationPattern": "CASE_BRANCH"
  }
];
