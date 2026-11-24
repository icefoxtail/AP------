window.examTitle = "미적분II_043_급수와수열의극한사이의관계_고2_유형은행1";

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
    "content": "$\\sum_{n=1}^{\\infty}a_n=8$이고, $S_n$이 $\\{a_n\\}$의 제$n$항까지의 부분합일 때, $\\lim_{n\\to\\infty}\\frac{3S_n-2a_n+4}{S_{n+1}+a_n-1}$의 값은?",
    "choices": [
      "$3$",
      "$4$",
      "$5$",
      "$6$",
      "$7$"
    ],
    "answer": "②",
    "solution": "부분합의 수렴: $\\sum_{n=1}^{\\infty}a_n=8$이므로 $\\lim_{n\\to\\infty}S_n=8$이다.\n일반항의 극한: $\\lim_{n\\to\\infty}a_n=\\lim_{n\\to\\infty}(S_n-S_{n-1})=8-8=0$이다.\n분자의 극한: $3S_n-2a_n+4\\to 3\\cdot 8-2\\cdot 0+4=28$이다.\n분모의 극한: $S_{n+1}+a_n-1\\to 8+0-1=7$이다.\n극한의 사칙연산: $\\lim_{n\\to\\infty}\\frac{3S_n-2a_n+4}{S_{n+1}+a_n-1}=\\frac{28}{7}=4$이다.\n따라서 정답은 ②이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
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
    "content": "$\\lim_{n\\to\\infty}\\sum_{k=1}^n a_k=12$일 때, $\\lim_{n\\to\\infty}\\frac{a_n^2+2(-4)^n-3}{2a_n+(-4)^{n+1}+3^n}$의 값은?",
    "choices": [
      "$-1.5$",
      "$-1$",
      "$-0.5$",
      "$0$",
      "$0.5$"
    ],
    "answer": "③",
    "solution": "부분합 수렴: $\\lim_{n\\to\\infty}\\sum_{k=1}^{n}a_k=12$이므로 $\\lim_{n\\to\\infty}a_n=0$이다.\n분자·분모를 $(-4)^n$으로 나눈다: $\\frac{a_n^2+2(-4)^n-3}{2a_n+(-4)^{n+1}+3^n}=\\frac{\\frac{a_n^2}{(-4)^n}+2-\\frac{3}{(-4)^n}}{\\frac{2a_n}{(-4)^n}+(-4)+\\left(\\frac{3}{-4}\\right)^n}$.\n각 항의 극한: $a_n\\to0$이므로 $\\frac{a_n^2}{(-4)^n}\\to0$, $\\frac{3}{(-4)^n}\\to0$, $\\frac{2a_n}{(-4)^n}\\to0$이다.\n등비수열의 극한: $\\left|\\frac{3}{-4}\\right|<1$이므로 $\\left(\\frac{3}{-4}\\right)^n\\to0$이다.\n극한값 계산: 분자 $\\to0+2-0=2$, 분모 $\\to0-4+0=-4$이다.\n따라서 $\\lim_{n\\to\\infty}\\frac{a_n^2+2(-4)^n-3}{2a_n+(-4)^{n+1}+3^n}=\\frac{2}{-4}=-\\frac{1}{2}=-0.5$이다.\n따라서 정답은 ③이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-063",
    "problemTypeKey": "PT_CALCULUS_SERIES",
    "templateKey": "TPL_CALCULUS_SERIES_CONVERGENCE_CONDITION",
    "crossConceptKeys": [
      "CC_SERIES_SUM",
      "CC_GEOMETRIC_SEQUENCE"
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
    "content": "$S_n$이 $\\{a_n\\}$의 제$n$항까지의 부분합이고, $\\sum_{n=1}^{\\infty}\\left(S_n-\\frac{5n-2}{n+2}\\right)=7$일 때, $\\lim_{n\\to\\infty}(2S_n-a_n)$의 값은?",
    "choices": [
      "$4$",
      "$6$",
      "$8$",
      "$10$",
      "$12$"
    ],
    "answer": "④",
    "solution": "수렴하는 급수의 성질: $\\sum_{n=1}^{\\infty}\\left(S_n-\\frac{5n-2}{n+2}\\right)=7$이 수렴하므로 일반항의 극한이 $0$이다.\n즉 $\\lim_{n\\to\\infty}\\left(S_n-\\frac{5n-2}{n+2}\\right)=0$이다.\n$\\frac{5n-2}{n+2}=\\frac{5-\\frac{2}{n}}{1+\\frac{2}{n}}\\to5$이므로 $\\lim_{n\\to\\infty}S_n=5$이다.\n일반항의 극한: $a_n=S_n-S_{n-1}\\to5-5=0$이다.\n극한 계산: $\\lim_{n\\to\\infty}(2S_n-a_n)=2\\cdot5-0=10$이다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
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
