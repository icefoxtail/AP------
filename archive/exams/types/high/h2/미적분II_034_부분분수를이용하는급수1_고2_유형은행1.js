window.examTitle = "미적분II_034_부분분수를이용하는급수1_고2_유형은행1";

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
    "content": "수열 $\\{a_n\\}$에서 $a_1=2$, $a_2=5$, $\\lim_{n\\to\\infty}a_n=13$일 때, $\\sum_{n=2}^{\\infty}(a_{n+1}-a_n)$의 값은?",
    "choices": [
      "$6$",
      "$7$",
      "$8$",
      "$9$",
      "$10$"
    ],
    "answer": "③",
    "solution": "부분합을 구하기 위해 제$N$항까지 더하면 $$\\sum_{n=2}^{N}(a_{n+1}-a_n)=(a_3-a_2)+(a_4-a_3)+\\cdots+(a_{N+1}-a_N)=a_{N+1}-a_2$$이다. (망원급수)\n$a_2=5$이고 $\\lim_{n\\to\\infty}a_n=13$이므로 $\\lim_{N\\to\\infty}a_{N+1}=13$이다.\n따라서 급수의 합은 $\\lim_{N\\to\\infty}(a_{N+1}-a_2)=13-5=8$이다.\n따라서 정답은 ③이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-062",
    "problemTypeKey": "PT_CALCULUS_SERIES",
    "templateKey": "TPL_CALCULUS_SERIES_PARTIAL_SUM",
    "crossConceptKeys": [
      "CC_SERIES_SUM",
      "CC_TELESCOPING_SERIES"
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
    "content": "급수 $\\sum_{n=1}^{\\infty}\\left(\\frac{6}{\\sqrt{n+8}}-\\frac{6}{\\sqrt{n+9}}\\right)$의 합은?",
    "choices": [
      "$2$",
      "$3$",
      "$4$",
      "$5$",
      "$6$"
    ],
    "answer": "①",
    "solution": "제$N$항까지의 부분합은 $$S_N=\\sum_{n=1}^{N}\\left(\\frac{6}{\\sqrt{n+8}}-\\frac{6}{\\sqrt{n+9}}\\right)$$이다.\n망원급수로 중간항이 소거되어 $S_N=\\frac{6}{\\sqrt9}-\\frac{6}{\\sqrt{N+9}}=2-\\frac{6}{\\sqrt{N+9}}$이다.\n$N\\to\\infty$일 때 $\\frac{6}{\\sqrt{N+9}}\\to0$이므로 $\\lim_{N\\to\\infty}S_N=2$이다.\n따라서 정답은 ①이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-062",
    "problemTypeKey": "PT_CALCULUS_SERIES",
    "templateKey": "TPL_CALCULUS_SERIES_PARTIAL_SUM",
    "crossConceptKeys": [
      "CC_SERIES_SUM",
      "CC_TELESCOPING_SERIES"
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
    "content": "첫째항이 $2$, 공차가 $4$인 등차수열 $\\{a_n\\}$에 대하여 $\\sum_{n=2}^{\\infty}\\left(\\frac{3}{a_n}-\\frac{3}{a_{n+1}}\\right)$의 합은?",
    "choices": [
      "$\\frac16$",
      "$\\frac13$",
      "$\\frac12$",
      "$\\frac23$",
      "$\\frac56$"
    ],
    "answer": "③",
    "solution": "등차수열의 일반항은 $a_n=2+(n-1)\\cdot4=4n-2$이므로 $a_2=6$, $a_{n+1}=4n+2$이다.\n제$N$항까지의 부분합은 망원급수로 $$\\sum_{n=2}^{N}\\left(\\frac{3}{a_n}-\\frac{3}{a_{n+1}}\\right)=\\frac{3}{a_2}-\\frac{3}{a_{N+1}}=\\frac36-\\frac{3}{4N+2}$$이다.\n$N\\to\\infty$일 때 $\\frac{3}{4N+2}\\to0$이므로 급수의 합은 $\\frac12-0=\\frac12$이다.\n따라서 정답은 ③이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-062",
    "problemTypeKey": "PT_CALCULUS_SERIES",
    "templateKey": "TPL_CALCULUS_SERIES_PARTIAL_SUM",
    "crossConceptKeys": [
      "CC_GENERAL_TERM",
      "CC_SERIES_SUM",
      "CC_TELESCOPING_SERIES"
    ],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
  }
];
