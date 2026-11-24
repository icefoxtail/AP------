window.examTitle = "미적분II_046_급수의수렴발산의판정법_고2_유형은행1";

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
    "content": "급수 $\\frac27+\\frac49+\\frac6{11}+\\frac8{13}+\\cdots$가 발산함을 다음과 같이 보이려 한다. 일반항을 $f(n)$, 그 극한을 $\\alpha$라 하고, 수렴하는 급수의 일반항이 가져야 하는 극한을 $\\beta$라 할 때, $f(5)+2\\alpha+\\beta$의 값은?",
    "choices": [
      "$\\frac{8}3$",
      "$\\frac{9}3$",
      "$\\frac{10}3$",
      "$\\frac{11}3$",
      "$\\frac{12}3$"
    ],
    "answer": "①",
    "solution": "급수의 일반항은 분자가 $2n$, 분모가 $2n+5$이므로 $f(n)=\\frac{2n}{2n+5}$이다.\n일반항의 극한은 $\\alpha=\\lim_{n\\to\\infty}\\frac{2n}{2n+5}=\\lim_{n\\to\\infty}\\frac{2}{2+\\frac5n}=1$이다.\n수렴하는 급수의 일반항은 $0$으로 수렴해야 하므로(급수 수렴의 필요조건) $\\beta=0$이다.\n$f(5)=\\frac{2\\cdot5}{2\\cdot5+5}=\\frac{10}{15}=\\frac23$이다.\n따라서 $f(5)+2\\alpha+\\beta=\\frac23+2\\cdot1+0=\\frac83$이다.\n따라서 정답은 ①이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B12",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-067",
    "problemTypeKey": "PT_CALCULUS_SERIES",
    "templateKey": "TPL_CALCULUS_SERIES_CONVERGENCE_CONDITION",
    "crossConceptKeys": [
      "CC_GENERAL_TERM"
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
    "content": "다음 급수 중 수렴하는 것은?",
    "choices": [
      "$\\sum_{n=1}^\\infty\\left(\\frac1{n+2}-\\frac1{n+3}\\right)$",
      "$\\sum_{n=1}^\\infty\\frac1{\\sqrt{n+2}+\\sqrt{n+1}}$",
      "$\\sum_{n=1}^\\infty(\\sqrt{n^2+4n}-n)$",
      "$\\sum_{n=1}^\\infty\\frac{3n}{n+4}$",
      "$\\sum_{n=1}^\\infty\\frac{2n+1}{5n+2}$"
    ],
    "answer": "①",
    "solution": "①의 부분합은 $S_N=\\sum_{n=1}^N\\left(\\frac1{n+2}-\\frac1{n+3}\\right)=\\left(\\frac13-\\frac14\\right)+\\left(\\frac14-\\frac15\\right)+\\cdots+\\left(\\frac1{N+2}-\\frac1{N+3}\\right)$이다.\n망원급수로 중간항이 모두 소거되어 $S_N=\\frac13-\\frac1{N+3}$이고, $\\lim_{N\\to\\infty}S_N=\\frac13$이므로 ①은 수렴한다.\n②는 $\\frac1{\\sqrt{n+2}+\\sqrt{n+1}}=\\sqrt{n+2}-\\sqrt{n+1}$이므로 부분합이 $\\sqrt{N+2}-\\sqrt2\\to\\infty$이어서 발산한다.\n③은 $\\sqrt{n^2+4n}-n=\\frac{4n}{\\sqrt{n^2+4n}+n}=\\frac{4}{\\sqrt{1+\\frac4n}+1}\\to2\\ne0$이므로 발산한다.\n④는 $\\frac{3n}{n+4}=\\frac3{1+\\frac4n}\\to3\\ne0$, ⑤는 $\\frac{2n+1}{5n+2}\\to\\frac25\\ne0$이므로 각각 발산한다.\n주의: 일반항의 극한이 $0$이 아니면 급수는 반드시 발산한다.\n따라서 정답은 ①이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B12",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-067",
    "problemTypeKey": "PT_CALCULUS_SERIES",
    "templateKey": "TPL_CALCULUS_SERIES_CONVERGENCE_CONDITION",
    "crossConceptKeys": [
      "CC_TELESCOPING_SERIES",
      "CC_GENERAL_TERM"
    ],
    "conditionKeys": [],
    "integrationPattern": "CASE_BRANCH"
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
    "content": "다음 급수 중 수렴하는 것을 모두 고른 것은?\nㄱ. $\\sum_{n=1}^\\infty\\frac{2n^2+n}{3n^2+1}$\nㄴ. $\\sum_{n=3}^\\infty\\frac{1}{n^2-4}$\nㄷ. $\\sum_{n=1}^\\infty(\\sqrt{n+3}-\\sqrt{n+2})$\nㄹ. $\\sum_{n=1}^\\infty\\frac{4}{(n+2)(n+4)}$",
    "choices": [
      "ㄱ, ㄴ",
      "ㄱ, ㄷ",
      "ㄷ, ㄹ",
      "ㄴ, ㄹ",
      "ㄴ, ㄷ"
    ],
    "answer": "④",
    "solution": "ㄱ. $\\frac{2n^2+n}{3n^2+1}=\\frac{2+\\frac1n}{3+\\frac1{n^2}}\\to\\frac23\\ne0$이므로 발산한다.\nㄴ. 부분분수 분해로 $\\frac1{n^2-4}=\\frac14\\left(\\frac1{n-2}-\\frac1{n+2}\\right)$이다.\n$n=3$부터 $N$까지 더하면 $\\frac14\\left[\\left(1-\\frac15\\right)+\\left(\\frac12-\\frac16\\right)+\\cdots+\\left(\\frac1{N-2}-\\frac1{N+2}\\right)\\right]$이고, 남는 항은 $\\frac14\\left(1+\\frac12+\\frac13+\\frac14\\right)$의 유한개뿐이므로 수렴한다.\nㄷ. $\\sqrt{n+3}-\\sqrt{n+2}=\\frac1{\\sqrt{n+3}+\\sqrt{n+2}}$이고 부분합은 $\\sqrt{N+3}-\\sqrt3\\to\\infty$이므로 발산한다.\nㄹ. $\\frac4{(n+2)(n+4)}=2\\left(\\frac1{n+2}-\\frac1{n+4}\\right)$이므로 부분합은 $2\\left(\\frac13+\\frac14-\\frac1{N+3}-\\frac1{N+4}\\right)$꼴이고 수렴한다.\n수렴하는 것은 ㄴ, ㄹ이다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-067",
    "problemTypeKey": "PT_CALCULUS_SERIES",
    "templateKey": "TPL_CALCULUS_SERIES_CONVERGENCE_CONDITION",
    "crossConceptKeys": [
      "CC_TELESCOPING_SERIES",
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
    "content": "다음 급수 중 수렴하는 것을 모두 고른 것은?\nㄱ. $\\sum_{n=1}^\\infty\\frac{1}{(n+2)(n+3)}$\nㄴ. $\\sum_{n=1}^\\infty\\frac{1}{2n}$\nㄷ. $\\sum_{n=1}^\\infty\\frac{2+(-5)^n}{4^n}$\nㄹ. $\\sum_{n=1}^\\infty\\frac{n}{2+4+\\cdots+2n}$",
    "choices": [
      "ㄱ",
      "ㄱ, ㄴ",
      "ㄱ, ㄹ",
      "ㄴ, ㄷ",
      "ㄷ, ㄹ"
    ],
    "answer": "①",
    "solution": "ㄱ. $\\frac1{(n+2)(n+3)}=\\frac1{n+2}-\\frac1{n+3}$이므로 부분합은 $\\frac13-\\frac1{N+3}\\to\\frac13$이어서 수렴한다.\nㄴ. $\\frac1{2n}=\\frac12\\cdot\\frac1n$은 조화급수의 상수배이므로 발산한다.\nㄷ. $\\frac{2+(-5)^n}{4^n}=2\\left(\\frac14\\right)^n+\\left(-\\frac54\\right)^n$에서 $\\left(-\\frac54\\right)^n$은 진동하며 절댓값이 커지므로 일반항이 $0$으로 수렴하지 않아 발산한다.\nㄹ. $2+4+\\cdots+2n=2(1+2+\\cdots+n)=n(n+1)$이므로 일반항은 $\\frac{n}{n(n+1)}=\\frac1{n+1}$이고, 조화급수형이므로 발산한다.\n수렴하는 것은 ㄱ뿐이다.\n따라서 정답은 ①이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-067",
    "problemTypeKey": "PT_CALCULUS_SERIES",
    "templateKey": "TPL_CALCULUS_SERIES_CONVERGENCE_CONDITION",
    "crossConceptKeys": [
      "CC_TELESCOPING_SERIES",
      "CC_GEOMETRIC_SEQUENCE"
    ],
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
    "content": "다음 급수 중 수렴하는 것을 모두 고른 것은?\nㄱ. $\\sum_{n=1}^\\infty\\left(\\frac{n+2}{n+1}-\\frac{n+3}{n+2}\\right)$\nㄴ. $\\sum_{n=1}^\\infty\\frac{1}{\\sqrt{n+5}+\\sqrt{n+4}}$\nㄷ. $\\sum_{n=1}^\\infty\\frac{4}{(n+2)(n+3)}$\nㄹ. $\\sum_{n=1}^\\infty\\frac{3\\sqrt n}{\\sqrt{n+2}+\\sqrt n}$",
    "choices": [
      "ㄱ, ㄴ",
      "ㄱ, ㄷ",
      "ㄴ, ㄹ",
      "ㄷ, ㄹ",
      "ㄱ, ㄷ, ㄹ"
    ],
    "answer": "②",
    "solution": "ㄱ. $\\frac{n+2}{n+1}=1+\\frac1{n+1}$, $\\frac{n+3}{n+2}=1+\\frac1{n+2}$이므로 일반항은 $\\frac1{n+1}-\\frac1{n+2}$이다.\n부분합은 $\\left(\\frac12-\\frac13\\right)+\\left(\\frac13-\\frac14\\right)+\\cdots+\\left(\\frac1{N+1}-\\frac1{N+2}\\right)=\\frac12-\\frac1{N+2}\\to\\frac12$이므로 수렴한다.\nㄴ. $\\frac1{\\sqrt{n+5}+\\sqrt{n+4}}=\\sqrt{n+5}-\\sqrt{n+4}$이므로 부분합은 $\\sqrt{N+5}-\\sqrt5\\to\\infty$이어서 발산한다.\nㄷ. $\\frac4{(n+2)(n+3)}=4\\left(\\frac1{n+2}-\\frac1{n+3}\\right)$이므로 부분합은 $4\\left(\\frac13-\\frac1{N+3}\\right)\\to\\frac43$이어서 수렴한다.\nㄹ. $\\frac{3\\sqrt n}{\\sqrt{n+2}+\\sqrt n}=\\frac3{\\sqrt{1+\\frac2n}+1}\\to\\frac32\\ne0$이므로 발산한다.\n수렴하는 것은 ㄱ, ㄷ이다.\n따라서 정답은 ②이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-067",
    "problemTypeKey": "PT_CALCULUS_SERIES",
    "templateKey": "TPL_CALCULUS_SERIES_CONVERGENCE_CONDITION",
    "crossConceptKeys": [
      "CC_TELESCOPING_SERIES",
      "CC_GENERAL_TERM"
    ],
    "conditionKeys": [],
    "integrationPattern": "CASE_BRANCH"
  }
];
