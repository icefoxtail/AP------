window.examTitle = "미적분II_040_이차방정식의두근이주어진급수_고2_유형은행1";

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
    "content": "자연수 $n$에 대한 이차방정식 $(n^2+3n)x^2+2x-12=0$의 두 근을 $\\alpha_n,\\beta_n$이라 할 때, $\\sum_{n=1}^{\\infty}(-\\alpha_n\\beta_n)$의 값은?",
    "choices": [
      "$\\frac{10}3$",
      "$\\frac{13}3$",
      "$\\frac{16}3$",
      "$\\frac{19}3$",
      "$\\frac{22}3$"
    ],
    "answer": "⑤",
    "solution": "근과 계수의 관계에서 두 근의 곱은 $\\alpha_n\\beta_n=\\frac{-12}{n^2+3n}=-\\frac{12}{n(n+3)}$이다.\n따라서 $-\\alpha_n\\beta_n=\\frac{12}{n(n+3)}$이다.\n부분분수 분해로 $\\frac{12}{n(n+3)}=4\\left(\\frac1n-\\frac1{n+3}\\right)$이다.\n$n=1$부터 $N$까지 부분합은 $4\\left(1+\\frac12+\\frac13-\\frac1{N+1}-\\frac1{N+2}-\\frac1{N+3}\\right)$이다.\n$N\\to\\infty$일 때 사라지는 항의 극한이 $0$이므로 합은 $4\\left(1+\\frac12+\\frac13\\right)=4\\cdot\\frac{11}{6}=\\frac{22}{3}$이다.\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-066",
    "problemTypeKey": "PT_CALCULUS_SERIES",
    "templateKey": "TPL_CALCULUS_SERIES_PARTIAL_SUM",
    "crossConceptKeys": [
      "CC_TELESCOPING_SERIES"
    ],
    "conditionKeys": [
      "COND_NATURAL_NUMBER"
    ],
    "integrationPattern": "SEQUENTIAL"
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
    "content": "자연수 $n$에 대한 이차방정식 $x^2+nx+n^2+n-4=0$의 두 근을 $\\alpha_n,\\beta_n$이라 할 때, $\\sum_{n=1}^{\\infty}\\frac{6}{(\\alpha_n-2)(\\beta_n-2)}$의 값은?",
    "choices": [
      "$\\frac{2}3$",
      "$\\frac{5}3$",
      "$\\frac{8}3$",
      "$\\frac{11}3$",
      "$\\frac{14}3$"
    ],
    "answer": "④",
    "solution": "근과 계수의 관계에서 $\\alpha_n+\\beta_n=-n$, $\\alpha_n\\beta_n=n^2+n-4$이다.\n분모를 전개하면 $(\\alpha_n-2)(\\beta_n-2)=\\alpha_n\\beta_n-2(\\alpha_n+\\beta_n)+4$이다.\n대입하면 $(\\alpha_n-2)(\\beta_n-2)=(n^2+n-4)-2(-n)+4=n^2+3n=n(n+3)$이다.\n따라서 일반항은 $\\frac{6}{n(n+3)}=2\\left(\\frac1n-\\frac1{n+3}\\right)$이다.\n$n=1$부터 $N$까지 부분합은 $2\\left(1+\\frac12+\\frac13-\\frac1{N+1}-\\frac1{N+2}-\\frac1{N+3}\\right)$이다.\n$N\\to\\infty$일 때 극한은 $2\\left(1+\\frac12+\\frac13\\right)=2\\cdot\\frac{11}{6}=\\frac{11}{3}$이다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-066",
    "problemTypeKey": "PT_CALCULUS_SERIES",
    "templateKey": "TPL_CALCULUS_SERIES_PARTIAL_SUM",
    "crossConceptKeys": [
      "CC_TELESCOPING_SERIES"
    ],
    "conditionKeys": [
      "COND_NATURAL_NUMBER"
    ],
    "integrationPattern": "SEQUENTIAL"
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
    "content": "자연수 $n$에 대해 $(9n^2+3n-2)x^2-(6n+1)x+1=0$의 두 근을 $\\alpha_n>\\beta_n$이라 할 때, $\\sum_{n=1}^\\infty(\\alpha_n-\\beta_n)$의 합은?",
    "choices": [
      "$0.1$",
      "$0.2$",
      "$0.3$",
      "$0.4$",
      "$0.5$"
    ],
    "answer": "⑤",
    "solution": "좌변을 인수분해하면 $(9n^2+3n-2)x^2-(6n+1)x+1=((3n-1)x-1)((3n+2)x-1)$이다.\n방정식의 두 근은 $x=\\frac1{3n-1}$, $x=\\frac1{3n+2}$이다.\n$3n-1<3n+2$이므로 역수가 큰 쪽이 $\\alpha_n$이고, $\\alpha_n=\\frac1{3n-1}$, $\\beta_n=\\frac1{3n+2}$이다.\n따라서 $\\alpha_n-\\beta_n=\\frac1{3n-1}-\\frac1{3n+2}=\\frac{3}{(3n-1)(3n+2)}$이다.\n부분분수 분해로 $\\frac{3}{(3n-1)(3n+2)}=\\frac1{3n-1}-\\frac1{3n+2}$이다.\n$n=1$부터 $N$까지 부분합은 $\\left(\\frac12-\\frac15\\right)+\\left(\\frac15-\\frac18\\right)+\\cdots+\\left(\\frac1{3N-1}-\\frac1{3N+2}\\right)=\\frac12-\\frac1{3N+2}$이다.\n$N\\to\\infty$일 때 $\\frac1{3N+2}\\to0$이므로 합은 $\\frac12=0.5$이다.\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-066",
    "problemTypeKey": "PT_CALCULUS_SERIES",
    "templateKey": "TPL_CALCULUS_SERIES_PARTIAL_SUM",
    "crossConceptKeys": [
      "CC_TELESCOPING_SERIES"
    ],
    "conditionKeys": [
      "COND_NATURAL_NUMBER"
    ],
    "integrationPattern": "SEQUENTIAL"
  }
];
