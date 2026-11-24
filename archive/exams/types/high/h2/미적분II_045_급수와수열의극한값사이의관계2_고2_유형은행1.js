window.examTitle = "미적분II_045_급수와수열의극한값사이의관계2_고2_유형은행1";

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
    "content": "급수 $\\sum_{n=1}^{\\infty}\\left(a_n-\\frac{3+6+\\cdots+3n}{(3n+1)^2}\\right)$이 수렴할 때, $\\lim_{n\\to\\infty}a_n$의 값은?",
    "choices": [
      "$\\frac{1}6$",
      "$\\frac{2}6$",
      "$\\frac{3}6$",
      "$\\frac{4}6$",
      "$\\frac{5}6$"
    ],
    "answer": "①",
    "solution": "급수 $\\sum_{n=1}^{\\infty}\\left(a_n-\\frac{3+6+\\cdots+3n}{(3n+1)^2}\\right)$가 수렴하므로 일반항의 극한은 $0$이다.\n즉, $\\lim_{n\\to\\infty}\\left(a_n-\\frac{3+6+\\cdots+3n}{(3n+1)^2}\\right)=0$이다.\n분자의 합을 계산하면 $3+6+\\cdots+3n=3\\cdot\\frac{n(n+1)}{2}=\\frac{3n(n+1)}{2}$이다.\n따라서 $\\frac{3+6+\\cdots+3n}{(3n+1)^2}=\\frac{3n(n+1)}{2(3n+1)^2}=\\frac{3n^2+3n}{2(9n^2+6n+1)}$이다.\n분자·분모를 $n^2$으로 나누면 $\\frac{3+\\frac{3}{n}}{2\\left(9+\\frac{6}{n}+\\frac{1}{n^2}\\right)}\\to\\frac{3}{18}=\\frac{1}{6}$이다.\n일반항의 극한이 $0$이므로 $\\lim_{n\\to\\infty}a_n-\\frac{1}{6}=0$, 즉 $\\lim_{n\\to\\infty}a_n=\\frac{1}{6}$이다.\n따라서 정답은 ①이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-063",
    "problemTypeKey": "PT_CALCULUS_SERIES",
    "templateKey": "TPL_CALCULUS_SERIES_CONVERGENCE_CONDITION",
    "crossConceptKeys": [
      "CC_SERIES_SUM"
    ],
    "conditionKeys": [],
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
    "content": "$\\sum_{n=1}^{\\infty}\\left(\\frac{a_n}{n}-\\frac{4+8+\\cdots+4n}{n^2}\\right)=6$일 때, $\\lim_{n\\to\\infty}\\frac{3n-a_n}{n+a_n}$의 값은?",
    "choices": [
      "$\\frac{1}3$",
      "$\\frac{2}3$",
      "$\\frac{3}3$",
      "$\\frac{4}3$",
      "$\\frac{5}3$"
    ],
    "answer": "①",
    "solution": "급수가 수렴하므로 일반항의 극한은 $0$이다.\n$\\lim_{n\\to\\infty}\\left(\\frac{a_n}{n}-\\frac{4+8+\\cdots+4n}{n^2}\\right)=0$이다.\n분자의 합은 $4+8+\\cdots+4n=4\\cdot\\frac{n(n+1)}{2}=2n(n+1)$이다.\n따라서 $\\frac{4+8+\\cdots+4n}{n^2}=\\frac{2n(n+1)}{n^2}=2+\\frac{2}{n}\\to2$이다.\n일반항의 극한이 $0$이므로 $\\frac{a_n}{n}\\to2$이다.\n구하는 식의 분자·분모를 $n$으로 나누면 $\\frac{3n-a_n}{n+a_n}=\\frac{3-\\frac{a_n}{n}}{1+\\frac{a_n}{n}}$이다.\n$\\frac{a_n}{n}\\to2$이므로 극한은 $\\frac{3-2}{1+2}=\\frac{1}{3}$이다.\n따라서 정답은 ①이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-063",
    "problemTypeKey": "PT_CALCULUS_SERIES",
    "templateKey": "TPL_CALCULUS_SERIES_CONVERGENCE_CONDITION",
    "crossConceptKeys": [
      "CC_SERIES_SUM"
    ],
    "conditionKeys": [],
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
    "content": "급수 $\\sum_{n=1}^{\\infty}\\left(\\frac{a_n}{3n}-\\frac{2+4+\\cdots+2n}{(3n-1)^2}\\right)$이 수렴할 때, $\\lim_{n\\to\\infty}\\frac{2n+a_n}{n-a_n}$의 값은?",
    "choices": [
      "$2$",
      "$2.5$",
      "$3$",
      "$3.5$",
      "$4$"
    ],
    "answer": "④",
    "solution": "급수가 수렴하므로 일반항의 극한은 $0$이다.\n$\\lim_{n\\to\\infty}\\left(\\frac{a_n}{3n}-\\frac{2+4+\\cdots+2n}{(3n-1)^2}\\right)=0$이다.\n분자의 합은 $2+4+\\cdots+2n=2\\cdot\\frac{n(n+1)}{2}=n(n+1)$이다.\n따라서 $\\frac{2+4+\\cdots+2n}{(3n-1)^2}=\\frac{n(n+1)}{(3n-1)^2}=\\frac{n^2+n}{9n^2-6n+1}$이다.\n분자·분모를 $n^2$으로 나누면 $\\frac{1+\\frac{1}{n}}{9-\\frac{6}{n}+\\frac{1}{n^2}}\\to\\frac{1}{9}$이다.\n일반항의 극한이 $0$이므로 $\\frac{a_n}{3n}\\to\\frac{1}{9}$, 즉 $\\frac{a_n}{n}\\to3\\cdot\\frac{1}{9}=\\frac{1}{3}$이다.\n구하는 식의 분자·분모를 $n$으로 나누면 $\\frac{2n+a_n}{n-a_n}=\\frac{2+\\frac{a_n}{n}}{1-\\frac{a_n}{n}}$이다.\n$\\frac{a_n}{n}\\to\\frac{1}{3}$이므로 극한은 $\\frac{2+\\frac{1}{3}}{1-\\frac{1}{3}}=\\frac{\\frac{7}{3}}{\\frac{2}{3}}=\\frac{7}{2}=3.5$이다.\n주의: $a_n$ 자체가 아니라 $\\frac{a_n}{n}$의 극한이 $\\frac{1}{3}$이다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-063",
    "problemTypeKey": "PT_CALCULUS_SERIES",
    "templateKey": "TPL_CALCULUS_SERIES_CONVERGENCE_CONDITION",
    "crossConceptKeys": [
      "CC_SERIES_SUM"
    ],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
  }
];
