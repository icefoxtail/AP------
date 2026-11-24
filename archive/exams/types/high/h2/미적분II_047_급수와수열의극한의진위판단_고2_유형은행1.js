window.examTitle = "미적분II_047_급수와수열의극한의진위판단_고2_유형은행1";

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
    "content": "두 실수 수열 $\\{a_n\\}$, $\\{b_n\\}$에 대하여 옳은 것을 모두 고른 것은?\nㄱ. 모든 $n$에서 $a_n>b_n$이고 두 수열이 수렴하면 $\\lim a_n\\ge\\lim b_n$이다.\nㄴ. 모든 $n$에서 $a_n\\ge b_n$이고 적어도 한 곳에서 부등호가 엄격하며 두 급수가 수렴하면 $\\sum_{n=1}^\\infty a_n>\\sum_{n=1}^\\infty b_n$이다.\nㄷ. $\\sum_{n=1}^\\infty a_n>\\sum_{n=1}^\\infty b_n$이고 두 급수가 모두 수렴하면 $\\lim_{n\\to\\infty}(a_n-b_n)=0$이다.",
    "choices": [
      "ㄱ",
      "ㄴ",
      "ㄱ, ㄷ",
      "ㄴ, ㄷ",
      "ㄱ, ㄴ, ㄷ"
    ],
    "answer": "⑤",
    "solution": "ㄱ. 두 수열이 수렴하므로 극한의 대소 비교 성질을 쓸 수 있다.\nㄱ. $a_n>b_n$에서 $a_n-b_n>0$이므로 극한을 취하면 $\\lim(a_n-b_n)\\ge0$이다.\nㄱ. 따라서 $\\lim a_n-\\lim b_n\\ge0$, 즉 $\\lim a_n\\ge\\lim b_n$이므로 참이다.\n주의: 모든 항에서 $a_n>b_n$이어도 극한에서는 등호가 될 수 있다(예: $a_n=\\frac1n$, $b_n=0$).\nㄴ. $c_n=a_n-b_n$이라 하면 모든 $n$에서 $c_n\\ge0$이고 어떤 $k$에서 $c_k>0$이다.\nㄴ. $\\sum_{n=1}^N c_n$은 증가하고 $N\\ge k$일 때 $\\sum_{n=1}^N c_n\\ge c_k>0$이다.\nㄴ. 따라서 $\\sum_{n=1}^\\infty c_n>0$이므로 $\\sum a_n>\\sum b_n$이고 참이다.\nㄷ. 두 급수가 수렴하면 일반항의 극한은 각각 $0$이다.\nㄷ. 따라서 $\\lim(a_n-b_n)=\\lim a_n-\\lim b_n=0$이므로 참이다.\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-067",
    "problemTypeKey": "PT_CALCULUS_SERIES",
    "templateKey": "TPL_CALCULUS_SERIES_CONVERGENCE_CONDITION",
    "crossConceptKeys": [
      "CC_SERIES_SUM"
    ],
    "conditionKeys": [
      "COND_INEQUALITY_CONSTRAINT"
    ],
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
    "content": "두 실수 수열 $\\{a_n\\}$, $\\{b_n\\}$에 대하여 옳은 것을 모두 고른 것은?\nㄱ. $\\sum_{n=1}^\\infty a_n$과 $\\sum_{n=1}^\\infty(2a_n-b_n)$이 수렴하면 $\\sum_{n=1}^\\infty b_n$은 수렴한다.\nㄴ. $\\lim_{n\\to\\infty}a_n=0$이면 $\\sum_{n=1}^\\infty(2a_n)$은 수렴한다.\nㄷ. $\\sum_{n=1}^\\infty a_nb_n$이 수렴하고 $\\lim_{n\\to\\infty}a_n=0$이면 $\\lim_{n\\to\\infty}b_n=0$이다.",
    "choices": [
      "ㄱ",
      "ㄴ",
      "ㄷ",
      "ㄱ, ㄴ",
      "ㄴ, ㄷ"
    ],
    "answer": "①",
    "solution": "ㄱ. $b_n=2a_n-(2a_n-b_n)$으로 쓸 수 있다.\nㄱ. 수렴하는 두 급수의 선형결합도 수렴하므로 $\\sum b_n$은 수렴한다. 즉 참이다.\nㄴ. $a_n=\\frac1n$이면 $\\lim a_n=0$이다.\nㄴ. 그러나 $\\sum2a_n=2\\sum\\frac1n$은 조화급수의 두 배이므로 발산한다. 즉 거짓이다.\n주의: 일반항이 $0$으로 수렴하는 것만으로 급수의 수렴을 보장할 수 없다.\nㄷ. $a_n=0$, $b_n=2$라 하면 $\\lim a_n=0$이고 $\\sum a_nb_n=\\sum0=0$은 수렴한다.\nㄷ. 그런데 $\\lim b_n=2\\ne0$이므로 거짓이다.\n따라서 정답은 ①이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-067",
    "problemTypeKey": "PT_CALCULUS_SERIES",
    "templateKey": "TPL_CALCULUS_SERIES_CONVERGENCE_CONDITION",
    "crossConceptKeys": [
      "CC_SERIES_SUM",
      "CC_GENERAL_TERM"
    ],
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
    "content": "두 실수 수열 $\\{a_n\\}$, $\\{b_n\\}$에 대하여 옳은 것을 모두 고른 것은?\nㄱ. $\\sum_{n=1}^\\infty(2a_n-4)$가 수렴하면 $\\lim_{n\\to\\infty}a_n=2$이다.\nㄴ. $\\sum_{n=1}^\\infty a_n$이 발산하면 $a_n$은 $0$으로 수렴할 수 없다.\nㄷ. $\\lim_{n\\to\\infty}a_n=3$이면 $\\sum_{n=1}^\\infty a_n$은 발산한다.\nㄹ. 모든 $n$에서 $a_n\\ne0$이고 $\\sum_{n=1}^\\infty a_n$이 수렴하면 $\\sum_{n=1}^\\infty\\frac1{a_n}$도 수렴한다.",
    "choices": [
      "ㄱ, ㄴ",
      "ㄴ, ㄷ",
      "ㄱ, ㄷ",
      "ㄱ, ㄹ",
      "ㄷ, ㄹ"
    ],
    "answer": "③",
    "solution": "ㄱ. $\\sum(2a_n-4)$가 수렴하면 그 일반항은 $0$으로 수렴한다.\nㄱ. 따라서 $\\lim(2a_n-4)=0$이고 $2\\lim a_n=4$이므로 $\\lim a_n=2$이다. 즉 참이다.\nㄴ. $a_n=\\frac1n$이면 $\\sum a_n$은 조화급수로 발산하지만 $\\lim a_n=0$이다.\nㄴ. 따라서 발산하는 급수의 일반항이 $0$으로 수렴할 수 있으므로 거짓이다.\nㄷ. $\\lim a_n=3\\ne0$이므로 일반항이 $0$으로 수렴하지 않는다.\nㄷ. 일반항의 극한 판정법에 의해 $\\sum a_n$은 발산한다. 즉 참이다.\nㄹ. $\\sum a_n$이 수렴하면 $\\lim a_n=0$이다.\nㄹ. 모든 $n$에서 $a_n\\ne0$이므로 $\\left|\\frac1{a_n}\\right|\\to\\infty$이고 $\\frac1{a_n}$은 $0$으로 수렴하지 않는다.\nㄹ. 따라서 $\\sum\\frac1{a_n}$은 발산하므로 거짓이다.\n따라서 정답은 ③이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-067",
    "problemTypeKey": "PT_CALCULUS_SERIES",
    "templateKey": "TPL_CALCULUS_SERIES_CONVERGENCE_CONDITION",
    "crossConceptKeys": [
      "CC_GENERAL_TERM"
    ],
    "conditionKeys": [
      "COND_NONZERO"
    ],
    "integrationPattern": "NONE"
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
    "content": "두 실수 수열 $\\{a_n\\}$, $\\{b_n\\}$에 대한 설명 중 옳은 것은?",
    "choices": [
      "$\\lim_{n\\to\\infty}a_n=0$이면 $\\sum_{n=1}^\\infty(3a_n)$은 수렴한다.",
      "$\\sum_{n=1}^\\infty a_n$과 $\\sum_{n=1}^\\infty(a_n-b_n)$이 수렴하면 $\\sum_{n=1}^\\infty b_n$도 수렴한다.",
      "$\\sum_{n=1}^\\infty(a_n-4)$가 수렴하면 $\\sum_{n=1}^\\infty a_n$도 수렴한다.",
      "$\\sum_{n=1}^\\infty a_n$과 $\\sum_{n=1}^\\infty b_n$이 모두 발산하면 $\\sum_{n=1}^\\infty(a_n+b_n)$도 발산한다.",
      "$\\sum_{n=1}^\\infty a_nb_n$이 수렴하면 $b_n$은 $0$으로 수렴한다."
    ],
    "answer": "②",
    "solution": "① $a_n=\\frac1n$이면 $\\lim a_n=0$이지만 $\\sum3a_n=3\\sum\\frac1n$은 발산한다. 거짓이다.\n② $b_n=a_n-(a_n-b_n)$이고 두 급수 $\\sum a_n$, $\\sum(a_n-b_n)$이 수렴한다.\n② 수렴하는 급수의 차도 수렴하므로 $\\sum b_n$은 수렴한다. 참이다.\n③ $a_n=4$이면 $\\sum(a_n-4)=\\sum0$은 수렴하지만 $\\sum a_n=\\sum4$는 발산한다. 거짓이다.\n④ $a_n=2$, $b_n=-2$이면 두 급수는 모두 발산하지만 $\\sum(a_n+b_n)=\\sum0$은 수렴한다. 거짓이다.\n⑤ $a_n=0$, $b_n=1$이면 $\\sum a_nb_n=\\sum0$은 수렴하지만 $\\lim b_n=1\\ne0$이다. 거짓이다.\n따라서 정답은 ②이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-067",
    "problemTypeKey": "PT_CALCULUS_SERIES",
    "templateKey": "TPL_CALCULUS_SERIES_CONVERGENCE_CONDITION",
    "crossConceptKeys": [
      "CC_SERIES_SUM",
      "CC_GENERAL_TERM"
    ],
    "conditionKeys": [],
    "integrationPattern": "NONE"
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
    "content": "두 실수 수열 $\\{a_n\\}$, $\\{b_n\\}$에 대하여 옳은 것을 모두 고른 것은?\nㄱ. $\\sum_{n=1}^\\infty a_nb_n$이 발산하면 두 수열 중 적어도 하나는 발산한다.\nㄴ. 수열 $\\{a_nb_n\\}$이 발산하면 두 수열 중 적어도 하나는 발산한다.\nㄷ. $\\{a_n\\}$이 $2$로 수렴하고 $\\sum_{n=1}^\\infty a_nb_n$이 수렴하면 $\\{b_n\\}$은 $0$으로 수렴한다.",
    "choices": [
      "ㄱ",
      "ㄴ",
      "ㄷ",
      "ㄴ, ㄷ",
      "ㄱ, ㄴ, ㄷ"
    ],
    "answer": "④",
    "solution": "ㄱ. $a_n=b_n=1$이면 두 수열 $\\{a_n\\}$, $\\{b_n\\}$은 모두 수렴하지만 $\\sum a_nb_n=\\sum1$은 발산한다.\nㄱ. 따라서 '곱의 급수가 발산하면 적어도 한 수열이 발산한다'는 거짓이다.\nㄴ. 두 수열 $\\{a_n\\}$, $\\{b_n\\}$이 모두 수렴하면 곱의 극한 법칙에 의해 $\\{a_nb_n\\}$도 수렴한다.\nㄴ. 이 명제의 대우가 '수열 $\\{a_nb_n\\}$이 발산하면 적어도 한 수열은 발산한다'이므로 참이다.\nㄷ. $\\sum a_nb_n$이 수렴하면 일반항의 극한 판정법에 의해 $\\lim a_nb_n=0$이다.\nㄷ. $a_n\\to2$이므로 충분히 큰 $n$에서 $a_n\\ne0$이고 $b_n=\\frac{a_nb_n}{a_n}$이다.\nㄷ. 따라서 $\\lim b_n=\\frac{0}{2}=0$이므로 참이다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-067",
    "problemTypeKey": "PT_CALCULUS_SERIES",
    "templateKey": "TPL_CALCULUS_SERIES_CONVERGENCE_CONDITION",
    "crossConceptKeys": [
      "CC_GENERAL_TERM"
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
    "content": "두 실수 수열 $\\{a_n\\}$, $\\{b_n\\}$에 대한 설명 중 옳지 않은 것은?",
    "choices": [
      "$\\sum_{n=1}^\\infty a_n$이 수렴하면 $\\lim_{n\\to\\infty}(2a_n)=0$이다.",
      "$\\sum_{n=1}^\\infty(a_n+3)$이 수렴하면 $\\sum_{n=1}^\\infty a_n$도 수렴한다.",
      "$\\sum_{n=1}^\\infty a_n$이 수렴하고 모든 $n$에서 $a_n\\ne0$이면 $\\sum_{n=1}^\\infty\\frac{2}{a_n}$은 발산한다.",
      "$\\sum_{n=1}^\\infty a_n$과 $\\sum_{n=1}^\\infty b_n$이 수렴하면 $\\lim_{n\\to\\infty}(a_n-b_n)=0$이다.",
      "$\\sum_{n=1}^\\infty a_n$과 $\\sum_{n=1}^\\infty b_n$이 수렴하면 $\\sum_{n=1}^\\infty(3a_n-b_n)$도 수렴한다."
    ],
    "answer": "②",
    "solution": "① $\\sum a_n$이 수렴하면 $\\lim a_n=0$이므로 $\\lim(2a_n)=2\\cdot0=0$이다. 참이다.\n② $a_n=-3$이면 $a_n+3=0$이므로 $\\sum(a_n+3)=\\sum0$은 수렴한다.\n② 그러나 $\\sum a_n=\\sum(-3)$은 일반항이 $0$으로 수렴하지 않아 발산한다. 거짓이다.\n③ $\\sum a_n$이 수렴하면 $\\lim a_n=0$이고, 모든 $a_n\\ne0$이므로 $\\left|\\frac2{a_n}\\right|\\to\\infty$이다.\n③ 따라서 $\\frac2{a_n}$은 $0$으로 수렴하지 않아 $\\sum\\frac2{a_n}$은 발산한다. 참이다.\n④ 두 급수가 수렴하면 $\\lim a_n=0$, $\\lim b_n=0$이므로 $\\lim(a_n-b_n)=0-0=0$이다. 참이다.\n⑤ 수렴하는 두 급수의 선형결합 $\\sum(3a_n-b_n)=3\\sum a_n-\\sum b_n$도 수렴한다. 참이다.\n따라서 정답은 ②이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-067",
    "problemTypeKey": "PT_CALCULUS_SERIES",
    "templateKey": "TPL_CALCULUS_SERIES_CONVERGENCE_CONDITION",
    "crossConceptKeys": [
      "CC_SERIES_SUM",
      "CC_GENERAL_TERM"
    ],
    "conditionKeys": [
      "COND_NONZERO"
    ],
    "integrationPattern": "NONE"
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
    "content": "두 실수 수열 $\\{a_n\\}$, $\\{b_n\\}$에 대한 설명 중 옳지 않은 것은?",
    "choices": [
      "$a_n\\to A$, $b_n\\to B\\ne0$이면 충분히 큰 $n$에서 $\\frac{a_n}{b_n}$이 정의되고 그 극한은 $\\frac AB$이다.",
      "$\\sum_{n=1}^\\infty a_n$과 $\\sum_{n=1}^\\infty a_{2n}$이 수렴하면 $\\sum_{n=1}^\\infty a_{2n-1}$도 수렴한다.",
      "$\\sum_{n=1}^\\infty a_n$과 $\\sum_{n=1}^\\infty b_n$이 수렴하면 $\\sum_{n=1}^\\infty(2a_n+3b_n)$도 수렴한다.",
      "두 급수가 수렴하고 모든 $n$에서 $a_n>b_n$이면 $\\sum_{n=1}^\\infty a_n>\\sum_{n=1}^\\infty b_n$이다.",
      "두 급수가 수렴하고 모든 $n$에서 $b_n\\ne0$이며 $\\sum_{n=1}^\\infty b_n\\ne0$이면 $\\sum_{n=1}^\\infty\\frac{a_n}{b_n}=\\frac{\\sum_{n=1}^\\infty a_n}{\\sum_{n=1}^\\infty b_n}$이다."
    ],
    "answer": "⑤",
    "solution": "① $b_n\\to B\\ne0$이므로 충분히 큰 $n$에서 $b_n\\ne0$이고 $\\frac{a_n}{b_n}$이 정의된다.\n① 몫의 극한 법칙에 의해 $\\lim\\frac{a_n}{b_n}=\\frac{\\lim a_n}{\\lim b_n}=\\frac AB$이다. 참이다.\n② $S_N=\\sum_{n=1}^N a_n$, $E_N=\\sum_{n=1}^N a_{2n}$, $O_N=\\sum_{n=1}^N a_{2n-1}$이라 하자.\n② $S_{2N}=E_N+O_N$이므로 $O_N=S_{2N}-E_N$이다.\n② $S_{2N}$은 수렴하는 $S_N$의 부분수열이고 $E_N$도 수렴하므로 $O_N$은 수렴한다. 참이다.\n③ 두 수렴하는 급수의 선형결합이므로 $\\sum(2a_n+3b_n)=2\\sum a_n+3\\sum b_n$은 수렴한다. 참이다.\n④ $c_n=a_n-b_n>0$이라 하면 $\\sum c_n=\\sum a_n-\\sum b_n$이다.\n④ $\\sum_{n=1}^N c_n\\ge c_1>0$이므로 극한도 $\\sum c_n\\ge c_1>0$이다. 따라서 $\\sum a_n>\\sum b_n$이고 참이다.\n⑤ $a_n=b_n=2^{-n}$이면 $\\sum a_n=\\sum b_n=1$이고 모든 $b_n\\ne0$이다.\n⑤ 그러나 $\\frac{a_n}{b_n}=1$이므로 $\\sum\\frac{a_n}{b_n}=\\sum1$은 발산하여 주어진 등식이 성립하지 않는다. 거짓이다.\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-067",
    "problemTypeKey": "PT_CALCULUS_SERIES",
    "templateKey": "TPL_CALCULUS_SERIES_CONVERGENCE_CONDITION",
    "crossConceptKeys": [
      "CC_SERIES_SUM",
      "CC_GENERAL_TERM"
    ],
    "conditionKeys": [
      "COND_INEQUALITY_CONSTRAINT"
    ],
    "integrationPattern": "CASE_BRANCH"
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
    "content": "두 실수 수열 $\\{a_n\\}$, $\\{b_n\\}$에 대하여 옳은 것을 모두 고른 것은?\nㄱ. 모든 $n$에서 $a_n\\ne0$이고 $\\sum_{n=1}^\\infty\\frac{2}{a_n}$이 수렴하면 $\\sum_{n=1}^\\infty a_n$은 발산한다.\nㄴ. $\\sum_{n=1}^\\infty\\left(a_n-\\frac34\\right)=2$이면 $\\lim_{n\\to\\infty}a_n=\\frac{11}4$이다.\nㄷ. $\\sum_{n=1}^\\infty a_nb_n$이 수렴하고 $a_n\\to-2$이면 $b_n\\to0$이다.",
    "choices": [
      "ㄱ",
      "ㄴ",
      "ㄱ, ㄷ",
      "ㄴ, ㄷ",
      "ㄱ, ㄴ, ㄷ"
    ],
    "answer": "③",
    "solution": "ㄱ. $\\sum\\frac2{a_n}$이 수렴하면 일반항의 극한 판정법에 의해 $\\lim\\frac2{a_n}=0$이다.\nㄱ. 따라서 $\\left|\\frac2{a_n}\\right|\\to0$에서 $\\left|a_n\\right|\\to\\infty$이므로 $a_n$은 $0$으로 수렴하지 않는다.\nㄱ. 일반항 판정법에 의해 $\\sum a_n$은 발산한다. 참이다.\nㄴ. $\\sum\\left(a_n-\\frac34\\right)$이 수렴하면 그 일반항의 극한은 $0$이다.\nㄴ. 따라서 $\\lim\\left(a_n-\\frac34\\right)=0$에서 $\\lim a_n=\\frac34$이다. $\\frac{11}{4}$가 아니므로 거짓이다.\n주의: 급수의 합 $2$는 일반항의 극한값과 무관하다.\nㄷ. $\\sum a_nb_n$이 수렴하면 $\\lim a_nb_n=0$이다.\nㄷ. $a_n\\to-2$이므로 $b_n=\\frac{a_nb_n}{a_n}$이고 $\\lim b_n=\\frac{0}{-2}=0$이다. 참이다.\n따라서 정답은 ③이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-067",
    "problemTypeKey": "PT_CALCULUS_SERIES",
    "templateKey": "TPL_CALCULUS_SERIES_CONVERGENCE_CONDITION",
    "crossConceptKeys": [
      "CC_GENERAL_TERM",
      "CC_SERIES_SUM"
    ],
    "conditionKeys": [
      "COND_NONZERO"
    ],
    "integrationPattern": "NONE"
  }
];
