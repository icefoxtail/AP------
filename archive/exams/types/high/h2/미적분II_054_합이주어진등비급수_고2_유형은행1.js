window.examTitle = "미적분II_054_합이주어진등비급수_고2_유형은행1";

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
    "content": "$\\sum_{n=1}^{\\infty} r^n=\\frac12$일 때 $\\sum_{n=1}^{\\infty} r^{2n}$의 합은?",
    "choices": [
      "$\\frac{1}{16}$",
      "$\\frac{1}{12}$",
      "$\\frac{1}{10}$",
      "$\\frac{1}{8}$",
      "$\\frac{1}{6}$"
    ],
    "answer": "④",
    "solution": "등비급수의 합 공식: $\\sum_{n=1}^{\\infty} r^n=\\frac{r}{1-r}$이고 수렴 조건은 $|r|<1$이다.\n주어진 조건 대입: $\\frac{r}{1-r}=\\frac12$.\n양변에 $2(1-r)$을 곱해 정리: $2r=1-r$.\n이항하여 $3r=1$, 즉 $r=\\frac13$이다.\n구하는 급수의 첫째항은 $r^2=\\frac19$, 공비도 $r^2=\\frac19$이다.\n등비급수의 합 공식 적용: $\\frac{\\frac19}{1-\\frac19}=\\frac{\\frac19}{\\frac89}=\\frac18$.\n따라서 정답은 ④이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B12",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-064",
    "problemTypeKey": "PT_CALCULUS_SERIES",
    "templateKey": "TPL_CALCULUS_SERIES_GEOMETRIC_SUM",
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
    "content": "실수 $a$에 대해 $a+a^2+a^3+\\cdots=3$일 때 $a-a^2+a^3-a^4+\\cdots$의 합은?",
    "choices": [
      "$\\frac{3}{7}$",
      "$\\frac{1}{2}$",
      "$\\frac{3}{5}$",
      "$\\frac{2}{3}$",
      "$\\frac{3}{4}$"
    ],
    "answer": "①",
    "solution": "등비급수의 합 공식: $\\sum_{n=1}^{\\infty} a^n=\\frac{a}{1-a}$ (단 $|a|<1$).\n조건 대입: $\\frac{a}{1-a}=3$.\n양변에 $1-a$를 곱하여 $a=3(1-a)=3-3a$.\n이항하면 $4a=3$이므로 $a=\\frac34$이다.\n이때 $|a|<1$이므로 주어진 등비급수가 수렴한다.\n구하는 급수는 첫째항 $a=\\frac34$, 공비 $-a=-\\frac34$인 등비급수이다.\n합 공식: $\\frac{a}{1-(-a)}=\\frac{\\frac34}{1+\\frac34}=\\frac{\\frac34}{\\frac74}=\\frac37$.\n따라서 정답은 ①이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B12",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-064",
    "problemTypeKey": "PT_CALCULUS_SERIES",
    "templateKey": "TPL_CALCULUS_SERIES_GEOMETRIC_SUM",
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
    "content": "$\\sum_{n=1}^{\\infty} x^n=2$이고 $x-\\frac13x^2+\\frac19x^3-\\cdots=\\frac pq$이다. 서로소인 자연수 $p,q$에 대해 $p+q$는?",
    "choices": [
      "$17$",
      "$18$",
      "$19$",
      "$20$",
      "$21$"
    ],
    "answer": "①",
    "solution": "첫 번째 등비급수의 합 공식: $\\sum_{n=1}^{\\infty}x^n=\\frac{x}{1-x}$ (단 $|x|<1$).\n조건 대입: $\\frac{x}{1-x}=2$.\n양변에 $1-x$를 곱하면 $x=2-2x$.\n이항하여 $3x=2$, 즉 $x=\\frac23$이다.\n두 번째 급수 $x-\\frac13x^2+\\frac19x^3-\\cdots$의 첫째항은 $x$, 공비는 $-\\frac{x}{3}$이다.\n$x=\\frac23$을 대입하면 공비는 $-\\frac{2}{9}$이고 $\\left|-\\frac29\\right|<1$이므로 수렴한다.\n등비급수의 합 공식 적용: $\\frac{x}{1-\\left(-\\frac{x}{3}\\right)}=\\frac{x}{1+\\frac{x}{3}}$.\n$x=\\frac23$ 대입: $\\frac{\\frac23}{1+\\frac{2}{9}}=\\frac{\\frac23}{\\frac{11}{9}}=\\frac23\\cdot\\frac9{11}=\\frac6{11}$.\n따라서 $p=6$, $q=11$이고 $p+q=17$이다.\n따라서 정답은 ①이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-064",
    "problemTypeKey": "PT_CALCULUS_SERIES",
    "templateKey": "TPL_CALCULUS_SERIES_GEOMETRIC_SUM",
    "crossConceptKeys": [],
    "conditionKeys": [
      "COND_NATURAL"
    ],
    "integrationPattern": "SEQUENTIAL"
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
    "content": "첫째항이 $4$인 등비수열 $\\{a_n\\}$이 $\\sum_{n=1}^{\\infty} a_n=6$을 만족할 때 $\\sum_{n=1}^{\\infty} a_{2n}$의 합은?",
    "choices": [
      "$\\frac{1}{2}$",
      "$\\frac{3}{4}$",
      "$1$",
      "$\\frac{5}{4}$",
      "$\\frac{3}{2}$"
    ],
    "answer": "⑤",
    "solution": "첫째항 $a_1=4$, 공비를 $r$라 하면 등비급수의 합은 $\\frac{a_1}{1-r}=\\frac{4}{1-r}$이다.\n조건 대입: $\\frac{4}{1-r}=6$.\n양변에 $1-r$을 곱하면 $4=6(1-r)$.\n정리하면 $4=6-6r$, 즉 $6r=2$이므로 $r=\\frac13$이다.\n$|r|=\\frac13<1$이므로 등비급수가 수렴한다.\n$a_{2n}$은 첫째항 $a_2=a_1r=4\\cdot\\frac13=\\frac43$이고 공비 $r^2=\\frac19$인 등비수열이다.\n그 합은 $\\frac{\\frac43}{1-\\frac19}=\\frac{\\frac43}{\\frac89}=\\frac43\\cdot\\frac98=\\frac32$.\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-064",
    "problemTypeKey": "PT_CALCULUS_SERIES",
    "templateKey": "TPL_CALCULUS_SERIES_GEOMETRIC_SUM",
    "crossConceptKeys": [],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
  }
];
