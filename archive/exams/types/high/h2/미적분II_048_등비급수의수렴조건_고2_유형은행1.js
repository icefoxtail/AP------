window.examTitle = "미적분II_048_등비급수의수렴조건_고2_유형은행1";

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
    "content": "$a\\ne0$인 급수 $\\sum_{n=1}^{\\infty}  ar^{n-1}$에 관한 설명 중 틀린 것은?",
    "choices": [
      "$r=0$이면 합은 $a$이다.",
      "$r=-2$이면 발산한다.",
      "$r=\\frac13$이면 수렴한다.",
      "$r=-1$이면 합은 $0$이다.",
      "$r=2$이면 발산한다."
    ],
    "answer": "④",
    "solution": "등비급수 $\\sum_{n=1}^{\\infty} ar^{n-1}$의 수렴 조건은 $|r|<1$임을 확인한다.\n$r=0$이면 모든 항이 $0$이므로 합은 $\\frac{a}{1-0}=a$이다.\n$r=-2$이면 $|r|>1$이므로 발산한다.\n$r=\\frac13$이면 $|r|<1$이므로 수렴한다.\n$r=-1$이면 부분합이 $a,0,a,0,\\cdots$로 진동하므로 발산한다. 따라서 합이 $0$이라는 설명은 틀렸다.\n$r=2$이면 $|r|>1$이므로 발산한다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B12",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-064",
    "problemTypeKey": "PT_CALCULUS_SERIES",
    "templateKey": "TPL_CALCULUS_SERIES_GEOMETRIC_SUM",
    "crossConceptKeys": [
      "CC_SERIES_SUM"
    ],
    "conditionKeys": [
      "COND_NONZERO"
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
    "content": "급수 $1+4x+16x^2+64x^3+\\cdots$가 수렴하는 실수 $x$의 범위는?",
    "choices": [
      "$-\\frac14<x<\\frac14$",
      "$-\\frac14\\le x<\\frac14$",
      "$-\\frac14<x\\le\\frac14$",
      "$-\\frac14\\le x\\le\\frac14$",
      "$0<x<\\frac14$"
    ],
    "answer": "①",
    "solution": "주어진 급수의 첫째 항은 $1$, 공비는 $4x$인 등비급수이다.\n등비급수의 수렴 조건 $|r|<1$을 적용하면 $|4x|<1$이다.\n절댓값을 풀면 $-1<4x<1$이다.\n각 변을 $4$로 나누면 $-\\frac14<x<\\frac14$이다.\n경계 $x=\\frac14$에서는 공비가 $1$, $x=-\\frac14$에서는 공비가 $-1$이므로 일반항이 $0$에 수렴하지 않아 발산한다.\n따라서 정답은 ①이다.",
    "difficultyBucket": 2,
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
    "content": "다음 중 발산하는 급수는?",
    "choices": [
      "$\\sum_{n=1}^{\\infty} \\frac{4^n-3^n}{4^n+3^n}$",
      "$\\sum_{n=1}^{\\infty} (\\frac35)^n$",
      "$\\sum_{n=1}^{\\infty} (-\\frac45)^n$",
      "$\\sum_{n=1}^{\\infty} (\\frac23)^{2n}(\\frac15)^n$",
      "$\\sum_{n=1}^{\\infty} \\frac{\\cos(n\\pi)}{6^n}$"
    ],
    "answer": "①",
    "solution": "첫째 급수의 일반항은 분모의 최고차항 $4^n$으로 나누어 정리한다.\n$a_n=\\frac{4^n-3^n}{4^n+3^n}=\\frac{1-(\\frac34)^n}{1+(\\frac34)^n}$이고, $(\\frac34)^n\\to0$이므로 $\\lim a_n=1$이다.\n일반항의 극한이 $0$이 아니므로 $\\sum a_n$은 발산한다.\n둘째 급수는 공비 $\\frac35$, 셋째 급수는 공비 $-\\frac45$인 등비급수이고 두 공비의 절댓값이 모두 $1$보다 작다.\n넷째 급수는 $(\\frac23)^{2n}(\\frac15)^n=(\\frac{4}{45})^n$이므로 공비 $\\frac{4}{45}$인 등비급수이다.\n다섯째 급수는 $\\frac{\\cos(n\\pi)}{6^n}=(-\\frac16)^n$이므로 공비 $-\\frac16$인 등비급수이다.\n둘째부터 다섯째까지는 공비의 절댓값이 $1$보다 작아 모두 수렴한다.\n따라서 정답은 ①이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B12",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-064",
    "problemTypeKey": "PT_CALCULUS_SERIES",
    "templateKey": "TPL_CALCULUS_SERIES_GEOMETRIC_SUM",
    "crossConceptKeys": [
      "CC_GENERAL_TERM"
    ],
    "conditionKeys": [],
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
    "content": "수렴하는 급수를 모두 고른 것은?\nㄱ. $2+1+\\frac12+\\cdots$\nㄴ. $1+\\sqrt2+2+\\cdots$\nㄷ. $\\sum_{n=1}^{\\infty} (-\\frac35)^{n-1}$\nㄹ. $\\sum_{n=1}^{\\infty} (\\frac17)^n$",
    "choices": [
      "ㄱ, ㄴ",
      "ㄴ, ㄷ",
      "ㄱ, ㄷ",
      "ㄴ, ㄷ, ㄹ",
      "ㄱ, ㄷ, ㄹ"
    ],
    "answer": "⑤",
    "solution": "ㄱ은 첫째 항 $2$, 공비 $\\frac12$인 등비급수이므로 $|\\frac12|<1$에서 수렴한다.\nㄴ은 첫째 항 $1$, 공비 $\\sqrt2$인 등비급수이고 $|\\sqrt2|>1$이므로 발산한다.\nㄴ의 일반항 $(\\sqrt2)^{n-1}$은 $0$에 수렴하지 않으므로 발산한다는 것을 다시 확인한다.\nㄷ은 공비 $-\\frac35$인 등비급수이고 $|-\\frac35|<1$이므로 수렴한다.\nㄹ은 공비 $\\frac17$인 등비급수이고 $|\\frac17|<1$이므로 수렴한다.\n수렴하는 것은 ㄱ, ㄷ, ㄹ이다.\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B12",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-064",
    "problemTypeKey": "PT_CALCULUS_SERIES",
    "templateKey": "TPL_CALCULUS_SERIES_GEOMETRIC_SUM",
    "crossConceptKeys": [],
    "conditionKeys": [],
    "integrationPattern": "CASE_BRANCH"
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
    "content": "$\\sum_{n=1}^{\\infty} (\\frac{2x+1}{7})^n$이 수렴하게 하는 정수 $x$의 개수는?",
    "choices": [
      "$3$",
      "$4$",
      "$5$",
      "$6$",
      "$7$"
    ],
    "answer": "④",
    "solution": "급수 $\\sum_{n=1}^{\\infty}(\\frac{2x+1}{7})^n$은 공비가 $\\frac{2x+1}{7}$인 등비급수이다.\n등비급수의 수렴 조건 $|r|<1$에서 $|\\frac{2x+1}{7}|<1$이다.\n분모를 곱하면 $|2x+1|<7$이고, 이를 풀면 $-7<2x+1<7$이다.\n양변에서 $1$을 빼면 $-8<2x<6$이고, $2$로 나누면 $-4<x<3$이다.\n이 범위의 정수는 $-3,-2,-1,0,1,2$의 $6$개이다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-064",
    "problemTypeKey": "PT_CALCULUS_SERIES",
    "templateKey": "TPL_CALCULUS_SERIES_GEOMETRIC_SUM",
    "crossConceptKeys": [],
    "conditionKeys": [
      "COND_INTEGER"
    ],
    "integrationPattern": "SEQUENTIAL"
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
    "content": "$\\sum_{n=1}^{\\infty} (\\frac{2-\\log_3(x^2)}{2})^n$이 수렴하게 하는 정수 $x$의 개수는?",
    "choices": [
      "$11$",
      "$12$",
      "$13$",
      "$14$",
      "$15$"
    ],
    "answer": "④",
    "solution": "급수는 공비 $\\frac{2-\\log_3(x^2)}{2}$인 등비급수이므로 $|\\frac{2-\\log_3(x^2)}{2}|<1$이 필요하다.\n분모 $2$를 곱하면 $-2<2-\\log_3(x^2)<2$이다.\n각 변에서 $2$를 빼면 $-4<-\\log_3(x^2)<0$이다.\n각 변에 $-1$을 곱하면 부등호가 뒤집혀 $0<\\log_3(x^2)<4$이다.\n밑 $3$이 $1$보다 크므로 $3^0<x^2<3^4$, 즉 $1<x^2<81$이다.\n따라서 $1<|x|<9$이고, 이를 만족하는 정수는 $x=\\pm2,\\pm3,\\cdots,\\pm8$이다.\n양수 $7$개와 음수 $7$개이므로 총 $14$개이다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
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
    "content": "수열 $\\{(\\frac{x}{3}-1)^n\\}$과 급수 $\\sum_{n=1}^{\\infty} (\\frac{x-5}{2})^{n+1}$이 모두 수렴하게 하는 정수 $x$의 개수는?",
    "choices": [
      "$3$",
      "$4$",
      "$5$",
      "$6$",
      "$7$"
    ],
    "answer": "①",
    "solution": "수열 $\\{(\\frac{x}{3}-1)^n\\}$이 수렴하려면 공비 $r=\\frac{x}{3}-1$이 $-1<r\\le1$을 만족해야 한다.\n$-1<\\frac{x}{3}-1\\le1$의 각 변에 $1$을 더하면 $0<\\frac{x}{3}\\le2$이다.\n$3$을 곱하면 $0<x\\le6$이다.\n급수 $\\sum_{n=1}^{\\infty}(\\frac{x-5}{2})^{n+1}$은 공비 $\\frac{x-5}{2}$인 등비급수이므로 $|\\frac{x-5}{2}|<1$이다.\n$-1<\\frac{x-5}{2}<1$의 각 변에 $2$를 곱하면 $-2<x-5<2$이고, $5$를 더하면 $3<x<7$이다.\n두 조건 $0<x\\le6$과 $3<x<7$의 공통 범위는 $3<x\\le6$이다.\n이 범위의 정수는 $4,5,6$의 $3$개이다.\n따라서 정답은 ①이다.",
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
    "integrationPattern": "INTERDEPENDENT"
  },
  {
    "id": 8,
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
    "content": "수열 $\\{(1-\\log_3 x)^n\\}$과 급수 $\\sum_{n=1}^{\\infty} (\\frac{x-4}{3})^{n-1}$이 모두 수렴하는 실수 $x$의 범위는?",
    "choices": [
      "$1\\le x<7$",
      "$1<x\\le7$",
      "$1\\le x<9$",
      "$1<x<7$",
      "$1\\le x\\le7$"
    ],
    "answer": "④",
    "solution": "수열 $\\{(1-\\log_3 x)^n\\}$이 수렴하려면 공비 $r=1-\\log_3 x$가 $-1<r\\le1$을 만족해야 한다.\n$-1<1-\\log_3 x\\le1$의 각 변에서 $1$을 빼면 $-2<-\\log_3 x\\le0$이다.\n각 변에 $-1$을 곱하면 부등호가 뒤집혀 $0\\le\\log_3 x<2$이다.\n밑 $3$이 $1$보다 크므로 $1\\le x<9$이다.\n급수 $\\sum_{n=1}^{\\infty}(\\frac{x-4}{3})^{n-1}$은 공비 $\\frac{x-4}{3}$인 등비급수이므로 $|\\frac{x-4}{3}|<1$이다.\n$-1<\\frac{x-4}{3}<1$의 각 변에 $3$을 곱하면 $-3<x-4<3$이고, $4$를 더하면 $1<x<7$이다.\n두 범위 $1\\le x<9$와 $1<x<7$의 교집합은 $1<x<7$이다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-064",
    "problemTypeKey": "PT_CALCULUS_SERIES",
    "templateKey": "TPL_CALCULUS_SERIES_GEOMETRIC_SUM",
    "crossConceptKeys": [
      "CC_LOGARITHMIC_FUNCTION_GRAPH"
    ],
    "conditionKeys": [],
    "integrationPattern": "INTERDEPENDENT"
  },
  {
    "id": 9,
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
    "content": "$\\sum_{n=1}^{\\infty} (\\frac{x^2-2x}{5})^n$이 수렴하는 실수 $x$의 범위를 $\\alpha<x<\\beta$라 할 때, $\\alpha\\beta$는?",
    "choices": [
      "$-7$",
      "$-6$",
      "$-5$",
      "$-4$",
      "$-3$"
    ],
    "answer": "③",
    "solution": "급수는 공비 $\\frac{x^2-2x}{5}$인 등비급수이므로 $|\\frac{x^2-2x}{5}|<1$이다.\n분모 $5$를 곱하면 $-5<x^2-2x<5$이다.\n왼쪽 부등식은 $x^2-2x+5>0$이고, $x^2-2x+5=(x-1)^2+4>0$이므로 모든 실수 $x$에서 성립한다.\n오른쪽 부등식은 $x^2-2x-5<0$이다.\n이차방정식 $x^2-2x-5=0$의 두 근은 $x=1\\pm\\sqrt6$이다.\n따라서 해는 $1-\\sqrt6<x<1+\\sqrt6$이므로 $\\alpha=1-\\sqrt6$, $\\beta=1+\\sqrt6$이다.\n근과 계수의 관계에서 $\\alpha\\beta=\\frac{-5}{1}=-5$이다.\n따라서 정답은 ③이다.",
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
    "id": 10,
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
    "content": "$0<x<2\\pi$에서 $\\sum_{n=1}^{\\infty} (4\\sin x-2)^n$의 수렴 범위가 $a<x<b$ 또는 $c<x<d$일 때, $a+b+c+d$는?",
    "choices": [
      "$\\frac{\\pi}{2}$",
      "$\\pi$",
      "$2\\pi$",
      "$\\frac{5\\pi}{2}$",
      "$3\\pi$"
    ],
    "answer": "③",
    "solution": "급수는 공비 $4\\sin x-2$인 등비급수이므로 $|4\\sin x-2|<1$이다.\n$-1<4\\sin x-2<1$의 각 변에 $2$를 더하면 $1<4\\sin x<3$이다.\n$4$로 나누면 $\\frac14<\\sin x<\\frac34$이다.\n$0<x<2\\pi$에서 $\\sin x=\\frac14$의 두 근을 $p,\\pi-p$, $\\sin x=\\frac34$의 두 근을 $q,\\pi-q$라 하자. (단, $0<p<q<\\frac\\pi2$)\n$\\frac14<\\sin x<\\frac34$를 만족하는 구간은 $(p,q)$와 $(\\pi-q,\\pi-p)$이다.\n따라서 $a=p$, $b=q$, $c=\\pi-q$, $d=\\pi-p$이다.\n네 수의 합은 $a+b+c+d=p+q+(\\pi-q)+(\\pi-p)=2\\pi$이다.\n따라서 정답은 ③이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-064",
    "problemTypeKey": "PT_CALCULUS_SERIES",
    "templateKey": "TPL_CALCULUS_SERIES_GEOMETRIC_SUM",
    "crossConceptKeys": [
      "CC_TRIGONOMETRIC_INEQUALITY"
    ],
    "conditionKeys": [
      "COND_RESTRICTED_INTERVAL"
    ],
    "integrationPattern": "CASE_BRANCH"
  },
  {
    "id": 11,
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
    "content": "정수 $x$가 $\\sum_{n=1}^{\\infty} (\\frac{x-4}{3})^n$의 수렴 조건과 $\\lim_{n\\to\\infty}\\frac{x^n-5^n}{x^n+2\\cdot5^n}=-\\frac12$를 모두 만족시킬 때, 가능한 $x$의 합은?",
    "choices": [
      "$8$",
      "$9$",
      "$10$",
      "$11$",
      "$12$"
    ],
    "answer": "②",
    "solution": "급수 $\\sum_{n=1}^{\\infty}(\\frac{x-4}{3})^n$은 공비 $\\frac{x-4}{3}$인 등비급수이므로 $|\\frac{x-4}{3}|<1$이다.\n$-1<\\frac{x-4}{3}<1$의 각 변에 $3$을 곱하면 $-3<x-4<3$이고, $4$를 더하면 $1<x<7$이다.\n이 범위의 정수는 $x=2,3,4,5,6$이다.\n극한의 분자와 분모를 $5^n$으로 나누면 $\\frac{x^n-5^n}{x^n+2\\cdot5^n}=\\frac{(\\frac{x}{5})^n-1}{(\\frac{x}{5})^n+2}$이다.\n$2\\le x<5$이면 $|\\frac{x}{5}|<1$이므로 $(\\frac{x}{5})^n\\to0$이고, 극한은 $\\frac{0-1}{0+2}=-\\frac12$이다.\n$x=5$이면 $(\\frac{x}{5})^n=1$이므로 극한은 $\\frac{1-1}{1+2}=0$이다.\n$x=6$이면 $|\\frac65|>1$이므로 $\\frac{(\\frac65)^n-1}{(\\frac65)^n+2}\\to1$이다.\n따라서 조건을 만족하는 정수는 $2,3,4$이고 그 합은 $2+3+4=9$이다.\n따라서 정답은 ②이다.",
    "difficultyBucket": 4,
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
    "integrationPattern": "INTERDEPENDENT"
  }
];
