window.examTitle = "미적분II_050_Σrⁿ이수렴할때수렴하는급수_고2_유형은행1";

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
    "content": "$\\sum_{n=1}^{\\infty} r^n$이 수렴할 때, 항상 수렴한다고 할 수 없는 급수는?",
    "choices": [
      "$\\sum_{n=1}^{\\infty} (-r)^n$",
      "$\\sum_{n=1}^{\\infty} (r^n+3r^{3n})$",
      "$\\sum_{n=1}^{\\infty} (1-\\frac r3)^n$",
      "$\\sum_{n=1}^{\\infty} (\\frac r4)^n$",
      "$\\sum_{n=1}^{\\infty} (\\frac{2r^n+(-r)^n}{3})$"
    ],
    "answer": "③",
    "solution": "$\\sum_{n=1}^{\\infty} r^n$이 수렴하므로 등비급수의 수렴 조건에서 $|r|<1$이다.\n① $\\sum_{n=1}^{\\infty}(-r)^n$은 공비가 $-r$이고 $|-r|=|r|<1$이므로 수렴한다.\n② $r^{3n}=(r^3)^n$이므로 $\\sum r^n$과 $\\sum r^{3n}$은 각각 공비 $r,r^3$인 수렴 급수이고, 그 합도 수렴한다.\n③ $\\sum_{n=1}^{\\infty}(1-\\frac r3)^n$의 공비는 $1-\\frac r3$이다. $r=-\\frac12$이면 공비가 $1+\\frac16=\\frac76$이 되어 $|q|>1$이므로 발산한다.\n④ $\\sum_{n=1}^{\\infty}(\\frac r4)^n$의 공비는 $\\frac r4$이고 $|\\frac r4|<1$이므로 수렴한다.\n⑤ $\\sum_{n=1}^{\\infty}\\frac{2r^n+(-r)^n}{3}$은 수렴하는 두 급수 $\\frac23\\sum r^n$과 $\\frac13\\sum(-r)^n$의 합이므로 수렴한다.\n주의: $r=0$일 때 ③의 공비가 $1$이 되어 발산하는 경우도 있다.\n따라서 정답은 ③이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-064",
    "problemTypeKey": "PT_CALCULUS_SERIES",
    "templateKey": "TPL_CALCULUS_SERIES_GEOMETRIC_SUM",
    "crossConceptKeys": [],
    "conditionKeys": [],
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
    "content": "$r\\ne0$이고 $\\sum_{n=1}^{\\infty} r^n$이 수렴할 때, 항상 수렴하는 것을 모두 고른 것은?\nㄱ. $\\sum_{n=1}^{\\infty} (\\frac1r)^n$\nㄴ. $\\sum_{n=1}^{\\infty} (r^n-2r^{2n})$\nㄷ. $\\sum_{n=1}^{\\infty} (1+\\frac r2)^n$\nㄹ. $\\sum_{n=1}^{\\infty} (\\frac{2r-1}{3})^n$",
    "choices": [
      "ㄱ, ㄴ",
      "ㄴ, ㄹ",
      "ㄱ, ㄷ",
      "ㄷ, ㄹ",
      "ㄴ, ㄷ, ㄹ"
    ],
    "answer": "②",
    "solution": "$\\sum_{n=1}^{\\infty} r^n$이 수렴하고 $r\\ne0$이므로 등비급수의 수렴 조건에서 $0<|r|<1$이다.\nㄱ. $\\sum_{n=1}^{\\infty}(\\frac1r)^n$의 공비는 $\\frac1r$이고 $|\\frac1r|>1$이므로 항상 발산한다.\nㄴ. $\\sum_{n=1}^{\\infty}(r^n-2r^{2n})$에서 $r^{2n}=(r^2)^n$이다. $|r|<1$이므로 $|r^2|<1$이고, 두 등비급수 $\\sum r^n$, $\\sum r^{2n}$이 모두 수렴하므로 그 차도 수렴한다.\nㄷ. $\\sum_{n=1}^{\\infty}(1+\\frac r2)^n$의 공비는 $1+\\frac r2$이다. $r=\\frac12$이면 공비가 $1+\\frac14=\\frac54$로 $|q|>1$이므로 발산한다. 따라서 항상 수렴하지는 않는다.\nㄹ. $\\sum_{n=1}^{\\infty}(\\frac{2r-1}{3})^n$의 공비를 $q$라 하면, $-1<r<1$에서 $-1<\\frac{2r-1}{3}<\\frac13$이므로 $|q|<1$이다. 따라서 항상 수렴한다.\n(i) 항상 수렴하는 것: ㄴ, ㄹ\n(ii) 항상 수렴한다고 할 수 없는 것: ㄱ, ㄷ\n주의: ㄱ은 $0<|r|<1$이므로 $|\\frac1r|>1$이 되어 오히려 항상 발산한다.\n따라서 정답은 ②이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-064",
    "problemTypeKey": "PT_CALCULUS_SERIES",
    "templateKey": "TPL_CALCULUS_SERIES_GEOMETRIC_SUM",
    "crossConceptKeys": [],
    "conditionKeys": [
      "COND_NONZERO"
    ],
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
    "content": "첫째항이 각각 $2,3$이고 공비가 각각 $\\frac14, -\\frac23$인 등비수열 $\\{a_n\\},\\{b_n\\}$에 대해 발산하는 급수는?",
    "choices": [
      "$\\sum_{n=1}^{\\infty} 3b_n$",
      "$\\sum_{n=1}^{\\infty} (a_n+2b_n)$",
      "$\\sum_{n=1}^{\\infty} (-1)^n a_n$",
      "$\\sum_{n=1}^{\\infty} a_nb_n$",
      "$\\sum_{n=1}^{\\infty} \\frac{b_n}{a_n}$"
    ],
    "answer": "⑤",
    "solution": "$a_n=2(\\frac14)^{n-1}$이고 $b_n=3(-\\frac23)^{n-1}$이다.\n① $\\sum_{n=1}^{\\infty}3b_n=3\\sum_{n=1}^{\\infty}b_n$이고 공비가 $-\\frac23$, $|-\\frac23|<1$이므로 수렴한다.\n② $\\sum_{n=1}^{\\infty}(a_n+2b_n)=\\sum a_n+2\\sum b_n$이고 두 등비급수의 공비가 각각 $\\frac14,-\\frac23$으로 절댓값이 $1$보다 작으므로 수렴한다.\n③ $(-1)^n a_n=(-1)^n\\cdot2(\\frac14)^{n-1}=-2(-\\frac14)^{n-1}$이므로 공비가 $-\\frac14$이고 $|-\\frac14|<1$이어서 수렴한다.\n④ $a_nb_n=2(\\frac14)^{n-1}\\cdot3(-\\frac23)^{n-1}=6(-\\frac16)^{n-1}$이므로 공비가 $-\\frac16$이고 $|-\\frac16|<1$이어서 수렴한다.\n⑤ $\\frac{b_n}{a_n}=\\frac{3(-\\frac23)^{n-1}}{2(\\frac14)^{n-1}}=\\frac32(-\\frac83)^{n-1}$이므로 공비가 $-\\frac83$이다. $|-\\frac83|>1$이므로 발산한다.\n주의: ⑤는 일반항 $\\frac32(-\\frac83)^{n-1}$이 $0$에 수렴하지 않으므로 발산한다고 판단해도 된다.\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-064",
    "problemTypeKey": "PT_CALCULUS_SERIES",
    "templateKey": "TPL_CALCULUS_SERIES_GEOMETRIC_SUM",
    "crossConceptKeys": [
      "CC_GEOMETRIC_SEQUENCE"
    ],
    "conditionKeys": [],
    "integrationPattern": "CASE_BRANCH"
  }
];
