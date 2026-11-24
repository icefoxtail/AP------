window.examTitle = "미적분II_057_여러가지수열과등비급수_고2_유형은행1";

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
    "content": "수열 $\\{a_n\\}$이 $a_1=5$, $a_{n+1}=\\frac12a_n$을 만족할 때 $\\sum_{n=1}^{\\infty} a_{3n-1}$의 합은?",
    "choices": [
      "$2$",
      "$\\frac{5}{2}$",
      "$\\frac{20}{7}$",
      "$3$",
      "$\\frac{10}{3}$"
    ],
    "answer": "③",
    "solution": "$a_{n+1}=\\frac{1}{2}a_n$이므로 $\\{a_n\\}$은 첫째항 $5$, 공비 $\\frac{1}{2}$인 등비수열이다.\n일반항은 $a_n=5\\left(\\frac{1}{2}\\right)^{n-1}$이다.\n$\\sum_{n=1}^{\\infty}a_{3n-1}$의 첫째항은 $a_2=5\\left(\\frac{1}{2}\\right)=\\frac{5}{2}$이다.\n이웃한 항의 비는 $\\frac{a_{3(n+1)-1}}{a_{3n-1}}=\\frac{a_{3n+2}}{a_{3n-1}}=\\left(\\frac{1}{2}\\right)^3=\\frac{1}{8}$이다.\n따라서 첫째항 $\\frac{5}{2}$, 공비 $\\frac{1}{8}$인 등비급수의 합을 구하면 된다.\n등비급수의 합 공식에 의해 $\\sum_{n=1}^{\\infty}a_{3n-1}=\\frac{\\frac{5}{2}}{1-\\frac{1}{8}}=\\frac{\\frac{5}{2}}{\\frac{7}{8}}=\\frac{20}{7}$이다.\n따라서 정답은 ③이다.",
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
    "content": "다항식 $x^n(2x+5)$를 $2x-1$로 나눈 나머지를 $a_n$이라 할 때 $\\sum_{n=1}^{\\infty} a_n$의 합은?",
    "choices": [
      "$2$",
      "$3$",
      "$4$",
      "$5$",
      "$6$"
    ],
    "answer": "⑤",
    "solution": "$P_n(x)=x^n(2x+5)$라 하자.\n$P_n(x)$를 $2x-1$로 나눈 나머지는 상수 $a_n$이므로 $P_n(x)=(2x-1)Q_n(x)+a_n$으로 쓸 수 있다.\n나머지정리에 의해 $x=\\frac{1}{2}$를 대입하면 $a_n=P_n\\left(\\frac{1}{2}\\right)=\\left(\\frac{1}{2}\\right)^n(1+5)=6\\left(\\frac{1}{2}\\right)^n$이다.\n따라서 $\\{a_n\\}$은 첫째항 $a_1=3$, 공비 $\\frac{1}{2}$인 등비수열이다.\n등비급수의 합 공식에 의해 $\\sum_{n=1}^{\\infty}a_n=\\frac{3}{1-\\frac{1}{2}}=6$이다.\n주의: 나머지를 구할 때는 나누는 식 $2x-1$의 근 $x=\\frac{1}{2}$를 대입해야 한다.\n따라서 정답은 ⑤이다.",
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
    "content": "공비가 양수인 등비수열 $\\{a_n\\}$에서 $a_3-a_1=3$, $\\sum_{n=1}^{\\infty} \\frac1{a_n}=2$일 때 $\\sum_{n=1}^{\\infty} \\frac{a_n}{6^n}$의 합은?",
    "choices": [
      "$\\frac{1}{12}$",
      "$\\frac{1}{9}$",
      "$\\frac{1}{6}$",
      "$\\frac{1}{5}$",
      "$\\frac{1}{4}$"
    ],
    "answer": "⑤",
    "solution": "첫째항을 $a$, 공비를 $r>0$이라 하면 $a_n=ar^{n-1}$이다.\n조건 $a_3-a_1=3$에서 $ar^2-a=a(r^2-1)=3$이다.\n$\\sum_{n=1}^{\\infty}\\frac{1}{a_n}$의 공비는 $\\frac{1}{r}$이고 이 급수가 수렴하므로 $\\left|\\frac{1}{r}\\right|<1$, 즉 $r>1$이다.\n등비급수의 합 공식에 의해 $\\sum_{n=1}^{\\infty}\\frac{1}{a_n}=\\frac{\\frac{1}{a}}{1-\\frac{1}{r}}=\\frac{r}{a(r-1)}=2$이므로 $a=\\frac{r}{2(r-1)}$이다.\n이를 $a(r^2-1)=3$에 대입하면 $\\frac{r}{2(r-1)}(r^2-1)=3$이다.\n$r^2-1=(r-1)(r+1)$이므로 $\\frac{r(r+1)}{2}=3$, 즉 $r(r+1)=6$이다.\n$r^2+r-6=0$에서 $(r+3)(r-2)=0$이고 $r>0$이므로 $r=2$이다.\n이때 $a=\\frac{2}{2(2-1)}=1$이다.\n$\\frac{a_n}{6^n}=\\frac{2^{n-1}}{6^n}=\\frac{1}{6}\\left(\\frac{1}{3}\\right)^{n-1}$이다.\n따라서 $\\sum_{n=1}^{\\infty}\\frac{a_n}{6^n}=\\frac{\\frac{1}{6}}{1-\\frac{1}{3}}=\\frac{1}{6}\\cdot\\frac{3}{2}=\\frac{1}{4}$이다.\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-064",
    "problemTypeKey": "PT_CALCULUS_SERIES",
    "templateKey": "TPL_CALCULUS_SERIES_GEOMETRIC_SUM",
    "crossConceptKeys": [],
    "conditionKeys": [
      "COND_POSITIVE"
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
    "content": "공비가 같은 두 등비수열 $\\{a_n\\},\\{b_n\\}$에서 $a_1-b_1=2$, $\\sum_{n=1}^{\\infty} a_n=8$, $\\sum_{n=1}^{\\infty} b_n=4$일 때 $\\sum_{n=1}^{\\infty} a_nb_n$의 합은?",
    "choices": [
      "$9$",
      "$\\frac{32}{3}$",
      "$12$",
      "$13$",
      "$14$"
    ],
    "answer": "②",
    "solution": "두 등비수열의 공비를 $r$이라 하면 급수가 수렴하므로 $|r|<1$이다.\n등비급수의 합 공식에 의해 $\\frac{a_1}{1-r}=8$, $\\frac{b_1}{1-r}=4$이다.\n두 식을 빼면 $\\frac{a_1-b_1}{1-r}=4$이고, $a_1-b_1=2$이므로 $\\frac{2}{1-r}=4$이다.\n따라서 $1-r=\\frac{1}{2}$, 즉 $r=\\frac{1}{2}$이다.\n이를 대입하면 $a_1=8(1-r)=4$, $b_1=4(1-r)=2$이다.\n$\\{a_nb_n\\}$은 첫째항 $a_1b_1=8$, 공비 $r^2=\\frac{1}{4}$인 등비수열이다.\n따라서 $\\sum_{n=1}^{\\infty}a_nb_n=\\frac{8}{1-\\frac{1}{4}}=\\frac{8}{\\frac{3}{4}}=\\frac{32}{3}$이다.\n따라서 정답은 ②이다.",
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
  },
  {
    "id": 5,
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
    "content": "첫째항이 모두 $1$인 두 등비수열 $\\{a_n\\},\\{b_n\\}$의 급수가 각각 수렴한다. $\\sum_{n=1}^{\\infty} (a_n+b_n)=8/3$, $\\sum_{n=1}^{\\infty} (a_n-b_n)=4/3$일 때 $\\sum_{n=1}^{\\infty} (a_n^2+b_n^2)$의 합은?",
    "choices": [
      "$2$",
      "$\\frac{13}{6}$",
      "$\\frac{7}{3}$",
      "$\\frac{5}{2}$",
      "$\\frac{8}{3}$"
    ],
    "answer": "⑤",
    "solution": "두 등비수열의 공비를 각각 $r,s$라 하면 급수가 수렴하므로 $|r|<1$, $|s|<1$이다.\n$X=\\sum_{n=1}^{\\infty}a_n=\\frac{1}{1-r}$, $Y=\\sum_{n=1}^{\\infty}b_n=\\frac{1}{1-s}$라 하자.\n주어진 조건에서 $X+Y=\\frac{8}{3}$, $X-Y=\\frac{4}{3}$이다.\n두 식을 더하면 $2X=\\frac{12}{3}=4$이므로 $X=2$이다.\n$\\frac{1}{1-r}=2$에서 $1-r=\\frac{1}{2}$, 즉 $r=\\frac{1}{2}$이다.\n두 식을 빼면 $2Y=\\frac{4}{3}$이므로 $Y=\\frac{2}{3}$이다.\n$\\frac{1}{1-s}=\\frac{2}{3}$에서 $1-s=\\frac{3}{2}$, 즉 $s=-\\frac{1}{2}$이다.\n$\\{a_n^2\\}$은 첫째항 $1$, 공비 $r^2=\\frac{1}{4}$이므로 $\\sum_{n=1}^{\\infty}a_n^2=\\frac{1}{1-\\frac{1}{4}}=\\frac{4}{3}$이다.\n$\\{b_n^2\\}$도 첫째항 $1$, 공비 $s^2=\\frac{1}{4}$이므로 $\\sum_{n=1}^{\\infty}b_n^2=\\frac{4}{3}$이다.\n따라서 $\\sum_{n=1}^{\\infty}(a_n^2+b_n^2)=\\frac{4}{3}+\\frac{4}{3}=\\frac{8}{3}$이다.\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B45",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-064",
    "problemTypeKey": "PT_CALCULUS_SERIES",
    "templateKey": "TPL_CALCULUS_SERIES_GEOMETRIC_SUM",
    "crossConceptKeys": [],
    "conditionKeys": [],
    "integrationPattern": "INTERDEPENDENT"
  },
  {
    "id": 6,
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
    "content": "$a_1=4$이고 모든 자연수 $n$에 대해 $a_na_{n+1}=(\\frac13)^n$일 때 $\\sum_{n=1}^{\\infty} a_{2n}$의 합은?",
    "choices": [
      "$\\frac{1}{8}$",
      "$\\frac{1}{6}$",
      "$\\frac{1}{5}$",
      "$\\frac{1}{4}$",
      "$\\frac{1}{3}$"
    ],
    "answer": "①",
    "solution": "$n=1$을 주어진 식 $a_na_{n+1}=\\left(\\frac{1}{3}\\right)^n$에 대입하면 $a_1a_2=\\frac{1}{3}$이다.\n$a_1=4$이므로 $a_2=\\frac{1}{3}\\cdot\\frac{1}{4}=\\frac{1}{12}$이다.\n$n$과 $n+1$에 대한 식을 나누면 $\\frac{a_{n+1}a_{n+2}}{a_na_{n+1}}=\\frac{\\left(\\frac{1}{3}\\right)^{n+1}}{\\left(\\frac{1}{3}\\right)^n}$이다.\n따라서 $\\frac{a_{n+2}}{a_n}=\\frac{1}{3}$이다.\n즉 짝수 번째 항 $\\{a_{2n}\\}$은 첫째항 $a_2=\\frac{1}{12}$, 공비 $\\frac{1}{3}$인 등비수열이다.\n등비급수의 합 공식에 의해 $\\sum_{n=1}^{\\infty}a_{2n}=\\frac{\\frac{1}{12}}{1-\\frac{1}{3}}=\\frac{\\frac{1}{12}}{\\frac{2}{3}}=\\frac{1}{8}$이다.\n따라서 정답은 ①이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B45",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-064",
    "problemTypeKey": "PT_CALCULUS_SERIES",
    "templateKey": "TPL_CALCULUS_SERIES_GEOMETRIC_SUM",
    "crossConceptKeys": [
      "CC_GEOMETRIC_SEQUENCE"
    ],
    "conditionKeys": [
      "COND_UNIVERSAL_INPUTS"
    ],
    "integrationPattern": "SEQUENTIAL"
  }
];
