window.examTitle = "미적분II_052_등비급수의합1_고2_유형은행1";

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
    "content": "급수 $\\sum_{n=1}^{\\infty} 6(\\frac57)^{n-1}$의 합은?",
    "choices": [
      "$9$",
      "$12$",
      "$15$",
      "$18$",
      "$21$"
    ],
    "answer": "⑤",
    "solution": "주어진 급수의 첫째항과 공비를 확인한다(등비급수).\n첫째항은 $a=6$, 공비는 $r=\\frac57$이다.\n등비급수의 합 공식 $\\frac{a}{1-r}$에 대입한다.\n$\\frac{6}{1-\\frac57}=\\frac{6}{\\frac27}=6\\cdot\\frac72=21$이다.\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 1,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "B12",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-064",
    "problemTypeKey": "PT_CALCULUS_SERIES",
    "templateKey": "TPL_CALCULUS_SERIES_GEOMETRIC_SUM",
    "crossConceptKeys": [],
    "conditionKeys": [],
    "integrationPattern": "NONE"
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
    "content": "급수 $\\sum_{n=1}^{\\infty} \\log_3(9^{1/2^n})$의 합은?",
    "choices": [
      "$1$",
      "$2$",
      "$3$",
      "$4$",
      "$5$"
    ],
    "answer": "②",
    "solution": "일반항을 로그의 성질로 정리한다(로그의 성질).\n$\\log_3(9^{1/2^n})=\\log_3(3^{2/2^n})=\\frac{2}{2^n}=2\\left(\\frac12\\right)^n$이다.\n$n=1$일 때 첫째항은 $2\\cdot\\frac12=1$, 공비는 $\\frac12$이다.\n등비급수의 합 공식에 대입하면 $\\frac{1}{1-\\frac12}=2$이다.\n따라서 정답은 ②이다.",
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
    "content": "방정식 $2x^2+3x-12=0$의 두 근을 $\\alpha,\\beta$라 할 때 $\\sum_{n=1}^{\\infty} (\\frac1\\alpha+\\frac1\\beta)^n$의 합은?",
    "choices": [
      "$\\frac{1}{5}$",
      "$\\frac{1}{4}$",
      "$\\frac{1}{3}$",
      "$\\frac{1}{2}$",
      "$\\frac{2}{3}$"
    ],
    "answer": "③",
    "solution": "근과 계수의 관계로 $\\alpha+\\beta=-\\frac32$, $\\alpha\\beta=-6$이다(근과 계수의 관계).\n$\\frac1\\alpha+\\frac1\\beta=\\frac{\\alpha+\\beta}{\\alpha\\beta}=\\frac{-\\frac32}{-6}=\\frac14$이다.\n즉 급수는 첫째항 $\\frac14$, 공비 $\\frac14$인 등비급수이다.\n$\\left|\\frac14\\right|<1$이므로 수렴한다.\n합은 $\\frac{\\frac14}{1-\\frac14}=\\frac{\\frac14}{\\frac34}=\\frac13$이다.\n따라서 정답은 ③이다.",
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
    "content": "$r<0$이고 급수 $\\sum_{n=1}^{\\infty} 4r^{n-1}$이 수렴할 때 가능한 합은?",
    "choices": [
      "$2$",
      "$3$",
      "$4$",
      "$5$",
      "$6$"
    ],
    "answer": "②",
    "solution": "$r<0$이고 등비급수 $\\sum 4r^{n-1}$이 수렴하려면 $|r|<1$이어야 한다(등비급수의 수렴 조건).\n따라서 $-1<r<0$이다.\n합은 $S=\\frac{4}{1-r}$이다.\n$-1<r<0$에서 $1<1-r<2$이므로 $\\frac{4}{2}<S<\\frac{4}{1}$, 즉 $2<S<4$이다.\n보기 중 $2$와 $4$는 범위에 포함되지 않으므로 제외된다.\n$S=3$이면 $\\frac{4}{1-r}=3$에서 $1-r=\\frac43$, $r=-\\frac13$이고 $-1<r<0$을 만족한다.\n따라서 정답은 ②이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-064",
    "problemTypeKey": "PT_CALCULUS_SERIES",
    "templateKey": "TPL_CALCULUS_SERIES_GEOMETRIC_SUM",
    "crossConceptKeys": [],
    "conditionKeys": [
      "COND_NEGATIVE"
    ],
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
    "content": "급수 $\\sum_{n=1}^{\\infty} (\\frac12)^n\\sin\\frac{n\\pi}{2}$의 합은?",
    "choices": [
      "$\\frac{1}{5}$",
      "$\\frac{1}{3}$",
      "$\\frac{2}{5}$",
      "$\\frac{1}{2}$",
      "$\\frac{3}{5}$"
    ],
    "answer": "③",
    "solution": "$\\sin\\frac{n\\pi}{2}$의 값을 $n$에 따라 나누어 본다.\n$n=1,2,3,4$일 때 각각 $1,0,-1,0$이므로 홀수 번째 항만 남는다.\n$n=2k-1$이면 $\\sin\\frac{(2k-1)\\pi}{2}=(-1)^{k-1}$이다.\n따라서 홀수 번째 항은 $\\left(\\frac12\\right)^{2k-1}(-1)^{k-1}=\\frac12\\left(-\\frac14\\right)^{k-1}$이다.\n첫째항은 $\\frac12$, 공비는 $-\\frac14$인 등비급수이다.\n$\\left|-\\frac14\\right|<1$이므로 수렴하고, 합은 $\\frac{\\frac12}{1-\\left(-\\frac14\\right)}=\\frac{\\frac12}{\\frac54}=\\frac25$이다.\n따라서 정답은 ③이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-064",
    "problemTypeKey": "PT_CALCULUS_SERIES",
    "templateKey": "TPL_CALCULUS_SERIES_GEOMETRIC_SUM",
    "crossConceptKeys": [
      "CC_PERIODIC_FUNCTION"
    ],
    "conditionKeys": [],
    "integrationPattern": "CASE_BRANCH"
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
    "content": "급수 $\\sum_{n=1}^{\\infty} (-\\frac13)^{n-1}\\cos(n\\pi+\\frac\\pi3)$의 합은?",
    "choices": [
      "$-1$",
      "$-\\frac{7}{8}$",
      "$-\\frac{4}{5}$",
      "$-\\frac{3}{4}$",
      "$-\\frac{2}{3}$"
    ],
    "answer": "④",
    "solution": "$\\cos\\left(n\\pi+\\frac\\pi3\\right)=\\cos n\\pi\\cos\\frac\\pi3-\\sin n\\pi\\sin\\frac\\pi3$로 전개한다(삼각함수의 덧셈정리).\n$\\cos n\\pi=(-1)^n$, $\\sin n\\pi=0$이므로 $\\cos\\left(n\\pi+\\frac\\pi3\\right)=\\frac{(-1)^n}{2}$이다.\n일반항은 $\\left(-\\frac13\\right)^{n-1}\\cdot\\frac{(-1)^n}{2}=-\\frac12\\left(\\frac13\\right)^{n-1}$이다.\n첫째항은 $-\\frac12$, 공비는 $\\frac13$인 등비급수이다.\n$\\left|\\frac13\\right|<1$이므로 수렴하고, 합은 $\\frac{-\\frac12}{1-\\frac13}=\\frac{-\\frac12}{\\frac23}=-\\frac34$이다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-064",
    "problemTypeKey": "PT_CALCULUS_SERIES",
    "templateKey": "TPL_CALCULUS_SERIES_GEOMETRIC_SUM",
    "crossConceptKeys": [
      "CC_TRIGONOMETRIC_IDENTITY"
    ],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 7,
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
    "content": "$0<\\theta<\\pi$에서 $\\sum_{n=1}^{\\infty} (\\cos\\theta)^{2n-1}=2\\sqrt3$을 만족하는 $\\theta$는?",
    "choices": [
      "$\\pi/6$",
      "$\\pi/4$",
      "$\\pi/3$",
      "$\\pi/2$",
      "$2\\pi/3$"
    ],
    "answer": "①",
    "solution": "$t=\\cos\\theta$라 하면 $0<\\theta<\\pi$에서 $-1<t<1$이다.\n급수는 $t+t^3+t^5+\\cdots$로 첫째항 $t$, 공비 $t^2$인 등비급수이다.\n$|t|<1$이므로 수렴하고 합은 $\\frac{t}{1-t^2}$이다.\n조건에서 $\\frac{t}{1-t^2}=2\\sqrt3$이다.\n양변에 $1-t^2$을 곱하면 $t=2\\sqrt3(1-t^2)$이다.\n정리하면 $2\\sqrt3 t^2+t-2\\sqrt3=0$이다.\n근의 공식으로 $t=\\frac{-1\\pm\\sqrt{1+48}}{4\\sqrt3}=\\frac{-1\\pm7}{4\\sqrt3}$이다.\n$t=\\frac{6}{4\\sqrt3}=\\frac{\\sqrt3}{2}$ 또는 $t=\\frac{-8}{4\\sqrt3}=-\\frac{2}{\\sqrt3}$이다.\n$-1<t<1$을 만족하는 것은 $t=\\frac{\\sqrt3}{2}$뿐이다.\n$0<\\theta<\\pi$에서 $\\cos\\theta=\\frac{\\sqrt3}{2}$이면 $\\theta=\\frac\\pi6$이다.\n따라서 정답은 ①이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-064",
    "problemTypeKey": "PT_CALCULUS_SERIES",
    "templateKey": "TPL_CALCULUS_SERIES_GEOMETRIC_SUM",
    "crossConceptKeys": [
      "CC_TRIGONOMETRIC_EQUATION"
    ],
    "conditionKeys": [
      "COND_RANGE"
    ],
    "integrationPattern": "SEQUENTIAL"
  }
];
