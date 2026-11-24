window.examTitle = "미적분II_059_급수의성질을이용한등비급수_고2_유형은행1";

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
    "content": "$a_n=(\\frac13)^n-5+p$이고 $\\sum_{n=1}^{\\infty} a_n$이 수렴할 때, $\\sum_{n=1}^{\\infty} (-1)^{n-1}a_n$의 합은?",
    "choices": [
      "$-\\frac{1}{4}$",
      "$-\\frac{1}{8}$",
      "$0$",
      "$\\frac{1}{8}$",
      "$\\frac{1}{4}$"
    ],
    "answer": "⑤",
    "solution": "급수 $\\sum a_n$이 수렴하므로 일반항의 극한은 $0$이다. (수렴하는 급수의 일반항)\n$\\lim_{n\\to\\infty} a_n=\\lim_{n\\to\\infty}\\left(\\left(\\frac13\\right)^n-5+p\\right)=p-5=0$이므로 $p=5$이다.\n$p=5$를 대입하면 $a_n=\\left(\\frac13\\right)^n$이다.\n$\\sum_{n=1}^{\\infty}(-1)^{n-1}a_n=\\sum_{n=1}^{\\infty}(-1)^{n-1}\\left(\\frac13\\right)^n$은 첫째항 $\\frac13$, 공비 $-\\frac13$인 등비급수이다. (등비급수의 합)\n합은 $\\frac{\\frac13}{1-\\left(-\\frac13\\right)}=\\frac{\\frac13}{\\frac43}=\\frac14$이다.\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
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
    "content": "첫째항과 공비가 같은 등비수열 $\\{a_n\\}$에 대해 $\\sum_{n=1}^{\\infty} \\frac{a_n-2^{n+1}}{4^n}=1$일 때 $16a_2$의 값은?",
    "choices": [
      "$129$",
      "$134$",
      "$139$",
      "$144$",
      "$149$"
    ],
    "answer": "④",
    "solution": "$\\sum_{n=1}^{\\infty}\\frac{2^{n+1}}{4^n}=\\sum_{n=1}^{\\infty}2\\left(\\frac12\\right)^n$은 첫째항 $1$, 공비 $\\frac12$인 등비급수이므로 합은 $\\frac{1}{1-\\frac12}=2$이다. (등비급수의 합)\n주어진 등식에서 $\\sum_{n=1}^{\\infty}\\frac{a_n}{4^n}-2=1$이므로 $\\sum_{n=1}^{\\infty}\\frac{a_n}{4^n}=3$이다.\n첫째항과 공비가 $r$이므로 $a_n=r^n$이다.\n$\\sum_{n=1}^{\\infty}\\frac{a_n}{4^n}=\\sum_{n=1}^{\\infty}\\left(\\frac r4\\right)^n$은 첫째항 $\\frac r4$, 공비 $\\frac r4$인 등비급수이다.\n$\\frac{\\frac r4}{1-\\frac r4}=3$에서 $\\frac{r}{4-r}=3$이다.\n$r=12-3r$이므로 $4r=12$, 즉 $r=3$이다.\n$a_2=r^2=9$이므로 $16a_2=16\\cdot9=144$이다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
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
    "content": "공차가 $d$인 등차수열 $\\{a_n\\}$에 대해 $\\sum_{n=1}^{\\infty} (\\frac{a_n}{n}-\\frac{1+3+\\cdots+(2n-1)}{4n^2})$가 수렴한다. $\\sum_{n=1}^{\\infty} d^n$의 합은?",
    "choices": [
      "$\\frac{1}{8}$",
      "$\\frac{1}{5}$",
      "$\\frac{1}{4}$",
      "$\\frac{1}{3}$",
      "$\\frac{1}{2}$"
    ],
    "answer": "④",
    "solution": "$1+3+\\cdots+(2n-1)=n^2$이므로 $\\frac{1+3+\\cdots+(2n-1)}{4n^2}=\\frac{n^2}{4n^2}=\\frac14$이다. (홀수 첫 $n$개의 합)\n따라서 주어진 급수는 $\\sum_{n=1}^{\\infty}\\left(\\frac{a_n}{n}-\\frac14\\right)$이다.\n급수가 수렴하므로 일반항의 극한은 $0$이다. (수렴하는 급수의 일반항)\n$\\lim_{n\\to\\infty}\\left(\\frac{a_n}{n}-\\frac14\\right)=0$에서 $\\lim_{n\\to\\infty}\\frac{a_n}{n}=\\frac14$이다.\n공차가 $d$인 등차수열은 $a_n=a_1+(n-1)d$이므로 $\\frac{a_n}{n}=\\frac{a_1-d}{n}+d$이다.\n$n\\to\\infty$일 때 $\\frac{a_1-d}{n}\\to0$이므로 $\\lim_{n\\to\\infty}\\frac{a_n}{n}=d$이다.\n따라서 $d=\\frac14$이다.\n$\\sum_{n=1}^{\\infty}d^n=\\sum_{n=1}^{\\infty}\\left(\\frac14\\right)^n$은 첫째항 $\\frac14$, 공비 $\\frac14$인 등비급수이다.\n합은 $\\frac{\\frac14}{1-\\frac14}=\\frac{\\frac14}{\\frac34}=\\frac13$이다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-064",
    "problemTypeKey": "PT_CALCULUS_SERIES",
    "templateKey": "TPL_CALCULUS_SERIES_GEOMETRIC_SUM",
    "crossConceptKeys": [],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
  }
];
