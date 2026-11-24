window.examTitle = "미적분II_033_부분합이주어진급수_고2_유형은행1";

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
    "content": "수열 $\\{a_n\\}$의 첫째항부터 제$n$항까지의 합이 $S_n=\\frac{4n^2+1}{n^2+4}$일 때, $\\sum_{n=2}^{\\infty}a_n$의 값은?",
    "choices": [
      "$3$",
      "$4$",
      "$5$",
      "$6$",
      "$7$"
    ],
    "answer": "①",
    "solution": "$S_n=\\sum_{k=1}^{n}a_k$이므로 $\\sum_{n=2}^{\\infty}a_n=\\lim_{n\\to\\infty}S_n-S_1$이다.\n$S_1=\\frac{4\\cdot1^2+1}{1^2+4}=\\frac{5}{5}=1$이다.\n$\\lim_{n\\to\\infty}S_n=\\lim_{n\\to\\infty}\\frac{4n^2+1}{n^2+4}=\\lim_{n\\to\\infty}\\frac{4+\\frac{1}{n^2}}{1+\\frac{4}{n^2}}=4$이다.\n따라서 $\\sum_{n=2}^{\\infty}a_n=4-1=3$이다.\n따라서 정답은 ①이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-062",
    "problemTypeKey": "PT_CALCULUS_SERIES",
    "templateKey": "TPL_CALCULUS_SERIES_PARTIAL_SUM",
    "crossConceptKeys": [],
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
    "content": "수열 $\\{a_n\\}$의 첫째항부터 제$n$항까지의 합이 $S_n=\\frac{5n^2+4n}{(n+2)(n+3)}$일 때, $\\sum_{n=1}^{\\infty}a_n$의 값은?",
    "choices": [
      "$3$",
      "$4$",
      "$5$",
      "$6$",
      "$7$"
    ],
    "answer": "③",
    "solution": "$S_n=\\sum_{k=1}^{n}a_k$이므로 $\\sum_{n=1}^{\\infty}a_n=\\lim_{n\\to\\infty}S_n$이다.\n분모를 전개하면 $(n+2)(n+3)=n^2+5n+6$이다.\n$\\lim_{n\\to\\infty}S_n=\\lim_{n\\to\\infty}\\frac{5n^2+4n}{n^2+5n+6}$이다.\n분자와 분모를 $n^2$으로 나누면 $\\lim_{n\\to\\infty}\\frac{5+\\frac{4}{n}}{1+\\frac{5}{n}+\\frac{6}{n^2}}$이다.\n$\\frac{4}{n}\\to0$, $\\frac{5}{n}\\to0$, $\\frac{6}{n^2}\\to0$이므로 극한값은 $\\frac{5}{1}=5$이다.\n따라서 정답은 ③이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-062",
    "problemTypeKey": "PT_CALCULUS_SERIES",
    "templateKey": "TPL_CALCULUS_SERIES_PARTIAL_SUM",
    "crossConceptKeys": [],
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
    "content": "수열 $\\{a_n\\}$의 첫째항부터 제$n$항까지의 합이 $S_n=\\frac{6n^2-2}{2+4+6+\\cdots+2n}$일 때, $\\sum_{n=1}^{\\infty}a_n$의 값은?",
    "choices": [
      "$2$",
      "$3$",
      "$4$",
      "$5$",
      "$6$"
    ],
    "answer": "⑤",
    "solution": "분모는 첫째항이 $2$, 공차가 $2$인 등차수열의 합이므로 $2+4+\\cdots+2n=\\frac{n(2+2n)}{2}=n(n+1)$이다.\n따라서 $S_n=\\frac{6n^2-2}{n(n+1)}=\\frac{6n^2-2}{n^2+n}$이다.\n$S_n=\\sum_{k=1}^{n}a_k$이므로 $\\sum_{n=1}^{\\infty}a_n=\\lim_{n\\to\\infty}S_n$이다.\n$\\lim_{n\\to\\infty}\\frac{6n^2-2}{n^2+n}$에서 분자와 분모를 $n^2$으로 나누면 $\\lim_{n\\to\\infty}\\frac{6-\\frac{2}{n^2}}{1+\\frac{1}{n}}$이다.\n$\\frac{2}{n^2}\\to0$, $\\frac{1}{n}\\to0$이므로 극한값은 $\\frac{6}{1}=6$이다.\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-062",
    "problemTypeKey": "PT_CALCULUS_SERIES",
    "templateKey": "TPL_CALCULUS_SERIES_PARTIAL_SUM",
    "crossConceptKeys": [
      "CC_SERIES_SUM"
    ],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
  }
];
