window.examTitle = "미적분II_051_등비급수와수열의극한의진위판단_고2_유형은행1";

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
    "content": "등비수열 $\\{a_n\\}$에 대해 옳은 것을 모두 고른 것은?\nㄱ. $\\sum_{n=1}^{\\infty} a_n$이 수렴하면 $\\sum_{n=1}^{\\infty} a_{3n}$도 수렴한다.\nㄴ. $\\sum_{n=1}^{\\infty} a_n$이 발산하면 $\\sum_{n=1}^{\\infty} a_{3n}$도 발산한다.\nㄷ. $\\sum_{n=1}^{\\infty} a_n$이 수렴하면 $\\sum_{n=1}^{\\infty} (a_n+1)$도 수렴한다.",
    "choices": [
      "ㄱ",
      "ㄱ, ㄴ",
      "ㄱ, ㄷ",
      "ㄴ, ㄷ",
      "ㄱ, ㄴ, ㄷ"
    ],
    "answer": "②",
    "solution": "등비수열의 일반항을 $a_n=ar^{n-1}$로 둔다.\nㄱ. $\\sum a_n$이 수렴하면 $a=0$ 또는 $|r|<1$이다(등비급수의 수렴 조건).\n$a=0$이면 $a_{3n}=0$이므로 수렴한다.\n$a\\ne0$이면 $a_{3n}=ar^{3n-1}=ar^2(r^3)^{n-1}$이고 $|r^3|=|r|^3<1$이므로 공비 $r^3$인 등비급수가 수렴한다. 따라서 참.\nㄴ. $\\sum a_n$이 발산하면 $a\\ne0$이고 $|r|\\ge1$이다.\n이때 $a_{3n}=ar^2(r^3)^{n-1}$에서 첫째항 $ar^2\\ne0$이고 공비 $r^3$에 대해 $|r^3|=|r|^3\\ge1$이므로 $\\sum a_{3n}$도 발산한다. 따라서 참.\nㄷ. $\\sum(a_n+1)=\\sum a_n+\\sum 1$이고 $a_n+1\\to0+1=1\\ne0$이다.\n일반항 판정법에 의해 $\\sum(a_n+1)$은 발산한다. 따라서 거짓.\n주의: 수렴하는 급수에 상수 $1$을 더하면 일반항이 $0$으로 수렴하지 않는다.\n따라서 정답은 ②이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-064",
    "problemTypeKey": "PT_CALCULUS_SERIES",
    "templateKey": "TPL_CALCULUS_SERIES_GEOMETRIC_SUM",
    "crossConceptKeys": [
      "CC_GENERAL_TERM",
      "CC_SERIES_SUM"
    ],
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
    "content": "등비수열 $\\{a_n\\},\\{b_n\\}$에 대해 항상 옳은 것을 모두 고른 것은?\nㄱ. 두 급수 $\\sum_{n=1}^{\\infty} a_n,\\sum_{n=1}^{\\infty} b_n$이 수렴하면 $\\sum_{n=1}^{\\infty} a_n^2b_n$도 수렴한다.\nㄴ. 두 급수가 발산하면 $a_n-b_n$은 $0$으로 수렴할 수 없다.\nㄷ. $\\sum_{n=1}^{\\infty} a_n^2,\\sum_{n=1}^{\\infty} b_n^2$가 수렴하면 $\\sum_{n=1}^{\\infty} (a_n+b_n+1)$도 수렴한다.",
    "choices": [
      "ㄱ",
      "ㄴ",
      "ㄷ",
      "ㄱ, ㄴ",
      "ㄱ, ㄷ"
    ],
    "answer": "①",
    "solution": "$a_n=ar^{n-1}$, $b_n=bs^{n-1}$로 둔다.\nㄱ. $\\sum a_n$, $\\sum b_n$이 수렴하므로 $a=0$ 또는 $|r|<1$이고, $b=0$ 또는 $|s|<1$이다.\n$a_n^2b_n=a^2b\\,r^{2(n-1)}s^{n-1}=a^2b(r^2s)^{n-1}$이다.\n$a=0$ 또는 $b=0$이면 모든 항이 $0$이므로 수렴한다.\n$a\\ne0$, $b\\ne0$이면 $|r^2s|=|r|^2|s|<1$이므로 공비 $r^2s$인 등비급수가 수렴한다. 따라서 참.\nㄴ. $a_n=b_n=2^n$이면 두 급수는 모두 발산하지만 $a_n-b_n=0\\to0$이다. 따라서 거짓.\nㄷ. $\\sum a_n^2$, $\\sum b_n^2$이 수렴하면 $a_n^2\\to0$, $b_n^2\\to0$이므로 $a_n\\to0$, $b_n\\to0$이다.\n그러면 $a_n+b_n+1\\to0+0+1=1\\ne0$이므로 일반항 판정법에 의해 $\\sum(a_n+b_n+1)$은 발산한다. 따라서 거짓.\n주의: $\\sum a_n^2$의 수렴은 $\\sum a_n$의 수렴을 뜻하지 않는다.\n따라서 정답은 ①이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-064",
    "problemTypeKey": "PT_CALCULUS_SERIES",
    "templateKey": "TPL_CALCULUS_SERIES_GEOMETRIC_SUM",
    "crossConceptKeys": [
      "CC_GENERAL_TERM",
      "CC_SERIES_SUM"
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
    "content": "등비수열 $\\{a_n\\},\\{b_n\\}$에 대해 옳은 것을 모두 고른 것은?\nㄱ. 두 급수 $\\sum_{n=1}^{\\infty} a_n,\\sum_{n=1}^{\\infty} b_n$이 수렴하면 $a_n-2b_n\\to0$이다.\nㄴ. 모든 $a_n\\ne0$이고 $\\sum_{n=1}^{\\infty} \\frac1{a_n}$이 수렴하면 $\\sum_{n=1}^{\\infty} a_n$은 발산한다.\nㄷ. 두 급수가 수렴하면 $\\sum_{n=1}^{\\infty} a_nb_n=(\\sum_{n=1}^{\\infty} a_n)(\\sum_{n=1}^{\\infty} b_n)$이다.\nㄹ. 공비가 $-1$이고 첫째항이 $2$인 등비급수는 수렴한다.",
    "choices": [
      "ㄱ",
      "ㄴ",
      "ㄷ, ㄹ",
      "ㄱ, ㄴ",
      "ㄱ, ㄷ"
    ],
    "answer": "④",
    "solution": "$a_n=ar^{n-1}$, $b_n=bs^{n-1}$로 둔다.\nㄱ. 두 급수가 수렴하면 $a_n\\to0$, $b_n\\to0$이다.\n따라서 $a_n-2b_n\\to0-2\\cdot0=0$이다. 참.\nㄴ. $\\sum\\frac1{a_n}$이 수렴하면 $\\frac1{a_n}\\to0$이다.\n이때 $\\left|\\frac1{a_n}\\right|\\to0$이므로 $|a_n|\\to\\infty$이고 $a_n$은 $0$으로 수렴하지 않는다.\n일반항 판정법에 의해 $\\sum a_n$은 발산한다. 참.\nㄷ. $a_n=b_n=2^{-n}$이면 $\\sum a_nb_n=\\sum4^{-n}=\\frac{1/4}{1-1/4}=\\frac13$이다.\n한편 $(\\sum a_n)(\\sum b_n)=1\\cdot1=1$이므로 두 값은 다르다. 거짓.\nㄹ. 첫째항 $2$, 공비 $-1$이면 부분합은 $2,0,2,0,\\cdots$로 진동하므로 수렴하지 않는다. 거짓.\n주의: 급수의 곱은 각 급수의 합의 곱과 일반적으로 같지 않다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-064",
    "problemTypeKey": "PT_CALCULUS_SERIES",
    "templateKey": "TPL_CALCULUS_SERIES_GEOMETRIC_SUM",
    "crossConceptKeys": [
      "CC_GENERAL_TERM",
      "CC_SERIES_SUM"
    ],
    "conditionKeys": [
      "COND_NONZERO"
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
    "content": "등비수열 $\\{a_n\\},\\{b_n\\}$에 대한 설명 중 틀린 것은?",
    "choices": [
      "$\\sum_{n=1}^{\\infty} a_n$이 수렴하면 $a_{2n}\\to0$이다.",
      "첫째항이 $3$인 등비급수는 공비의 절댓값이 $1$ 미만이면 수렴한다.",
      "$\\sum_{n=1}^{\\infty} a_n^3$이 수렴하면 $\\sum_{n=1}^{\\infty} a_n$도 수렴한다.",
      "$\\sum_{n=1}^{\\infty} a_n$과 $\\sum_{n=1}^{\\infty} b_n$이 수렴하면 $\\sum_{n=1}^{\\infty} a_nb_n$도 수렴한다.",
      "$\\sum_{n=1}^{\\infty} a_nb_n$이 발산하면 두 급수 $\\sum_{n=1}^{\\infty} a_n,\\sum_{n=1}^{\\infty} b_n$은 모두 발산한다."
    ],
    "answer": "⑤",
    "solution": "① $\\sum a_n$이 수렴하면 $a_n\\to0$이므로 그 부분수열 $a_{2n}\\to0$이다. 참.\n② 첫째항이 $3$인 등비급수는 공비 $r$에 대해 $|r|<1$이면 $\\frac{3}{1-r}$로 수렴한다. 참.\n③ $a_n=ar^{n-1}$이면 $a_n^3=a^3(r^3)^{n-1}$이다.\n$\\sum a_n^3$이 수렴하면 $a=0$ 또는 $|r^3|<1$이고, $|r^3|<1$은 $|r|<1$과 같다.\n따라서 $\\sum a_n$도 수렴한다. 참.\n④ 두 급수가 수렴하면 $a_n=ar^{n-1}$, $b_n=bs^{n-1}$에서 $a=0$ 또는 $|r|<1$, $b=0$ 또는 $|s|<1$이다.\n$a_nb_n=ab(rs)^{n-1}$이고 $|rs|=|r||s|<1$이므로 $\\sum a_nb_n$은 수렴한다. 참.\n⑤ $a_n=2^{-n}$, $b_n=3^n$이면 $\\sum a_n$은 수렴하고 $\\sum b_n$은 발산한다.\n그런데 $a_nb_n=2^{-n}3^n=\\left(\\frac32\\right)^n$이므로 $\\sum a_nb_n$은 발산한다.\n즉 곱의 급수가 발산해도 한쪽 급수는 수렴할 수 있으므로 ⑤는 거짓.\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-064",
    "problemTypeKey": "PT_CALCULUS_SERIES",
    "templateKey": "TPL_CALCULUS_SERIES_GEOMETRIC_SUM",
    "crossConceptKeys": [
      "CC_GENERAL_TERM",
      "CC_SERIES_SUM"
    ],
    "conditionKeys": [],
    "integrationPattern": "CASE_BRANCH"
  }
];
