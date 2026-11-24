window.examTitle = "미적분II_022_등비수열의일반항과합의극한_고2_유형은행1";

window.questionBank = [
  {
    "id": 1,
    "category": "수열의 극한",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-01",
    "standardUnit": "수열의 극한",
    "standardUnitOrder": 1,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "수열의 극한"
    ],
    "wide": false,
    "content": "첫째항이 $4$, 공비가 $3$인 등비수열의 제$n$항은 $a_n$, 첫 $n$항의 합은 $S_n$이다. $\\lim_{n\\to\\infty}\\frac{S_n}{a_n}$은?",
    "choices": [
      "$\\frac32$",
      "$\\frac52$",
      "$\\frac72$",
      "$\\frac92$",
      "$\\frac{11}2$"
    ],
    "answer": "①",
    "solution": "등비수열의 합 공식: $S_n=\\frac{4(3^n-1)}{3-1}=2(3^n-1)$이다.\n제$n$항: $a_n=4\\cdot 3^{n-1}$이다.\n몫을 세우면 $\\frac{S_n}{a_n}=\\frac{2(3^n-1)}{4\\cdot 3^{n-1}}$이다.\n분모·분자를 $3^{n-1}$로 나누면 $\\frac{2(3-3^{1-n})}{4}$이다.\n$n\\to\\infty$일 때 $3^{1-n}\\to 0$ (등비수열의 극한)이므로 극한은 $\\frac{2\\cdot 3}{4}=\\frac32$이다.\n따라서 정답은 ①이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B12",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-061",
    "problemTypeKey": "PT_CALCULUS_SEQUENCE_LIMIT",
    "templateKey": "TPL_CALCULUS_SEQ_LIMIT_GEOMETRIC_RATIO",
    "crossConceptKeys": [],
    "conditionKeys": [],
    "integrationPattern": "NONE"
  },
  {
    "id": 2,
    "category": "수열의 극한",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-01",
    "standardUnit": "수열의 극한",
    "standardUnitOrder": 1,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "수열의 극한"
    ],
    "wide": false,
    "content": "공비 $r>1$인 등비수열의 첫 $n$항의 합을 $S_n$이라 하자. $\\lim_{n\\to\\infty}\\frac{S_n}{a_n}=\\frac98$이면 $r$은?",
    "choices": [
      "$8$",
      "$9$",
      "$10$",
      "$11$",
      "$12$"
    ],
    "answer": "②",
    "solution": "등비수열의 합: $S_n=\\frac{a_1(r^n-1)}{r-1}$, 제$n$항: $a_n=a_1 r^{n-1}$이다.\n몫: $\\frac{S_n}{a_n}=\\frac{r^n-1}{(r-1)r^{n-1}}$이다.\n분자를 $r^{n-1}$로 나누면 $\\frac{r-r^{1-n}}{r-1}$이다.\n$r>1$이므로 $r^{1-n}\\to 0$ (등비수열의 극한)이고 극한은 $\\frac{r}{r-1}$이다.\n$\\frac{r}{r-1}=\\frac98$에서 $8r=9(r-1)$이다.\n$8r=9r-9$이므로 $r=9$이다.\n따라서 정답은 ②이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-061",
    "problemTypeKey": "PT_CALCULUS_SEQUENCE_LIMIT",
    "templateKey": "TPL_CALCULUS_SEQ_LIMIT_GEOMETRIC_RATIO",
    "crossConceptKeys": [],
    "conditionKeys": [
      "COND_RANGE"
    ],
    "integrationPattern": "NONE"
  },
  {
    "id": 3,
    "category": "수열의 극한",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-01",
    "standardUnit": "수열의 극한",
    "standardUnitOrder": 1,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "수열의 극한"
    ],
    "wide": false,
    "content": "공비가 $4$인 등비수열이 $\\lim_{n\\to\\infty}\\frac{a_n+3}{4^n+2a_n}=\\frac3{10}$을 만족할 때 첫째항은?",
    "choices": [
      "$3$",
      "$4$",
      "$5$",
      "$6$",
      "$7$"
    ],
    "answer": "①",
    "solution": "$a_n=a_1\\cdot 4^{n-1}$이다.\n주어진 극한식에 대입하면 $\\lim_{n\\to\\infty}\\frac{a_1 4^{n-1}+3}{4^n+2a_1 4^{n-1}}$이다.\n분모·분자를 $4^{n-1}$로 나누면 $\\lim_{n\\to\\infty}\\frac{a_1+3\\cdot 4^{1-n}}{4+2a_1}$이다.\n$4^{1-n}\\to 0$ (등비수열의 극한)이므로 극한은 $\\frac{a_1}{4+2a_1}$이다.\n$\\frac{a_1}{4+2a_1}=\\frac3{10}$에서 $10a_1=3(4+2a_1)$이다.\n$10a_1=12+6a_1$이므로 $4a_1=12$이다.\n따라서 $a_1=3$이다.\n따라서 정답은 ①이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-061",
    "problemTypeKey": "PT_CALCULUS_SEQUENCE_LIMIT",
    "templateKey": "TPL_CALCULUS_SEQ_LIMIT_GEOMETRIC_RATIO",
    "crossConceptKeys": [],
    "conditionKeys": [],
    "integrationPattern": "NONE"
  },
  {
    "id": 4,
    "category": "수열의 극한",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-01",
    "standardUnit": "수열의 극한",
    "standardUnitOrder": 1,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "수열의 극한"
    ],
    "wide": false,
    "content": "$a_n=2\\cdot5^n-3^n$, $S_n=\\sum_{k=1}^n a_k$일 때 $\\lim_{n\\to\\infty}\\frac{S_n}{5^n}$은?",
    "choices": [
      "$\\frac12$",
      "$1$",
      "$\\frac32$",
      "$\\frac52$",
      "$3$"
    ],
    "answer": "④",
    "solution": "$S_n=\\sum_{k=1}^n(2\\cdot 5^k-3^k)$로 나눠 쓴다.\n등비수열의 합 공식: $\\sum_{k=1}^n 5^k=\\frac{5(5^n-1)}{5-1}=\\frac{5(5^n-1)}4$이다.\n$\\sum_{k=1}^n 3^k=\\frac{3(3^n-1)}{3-1}=\\frac{3(3^n-1)}2$이다.\n따라서 $S_n=2\\cdot\\frac{5(5^n-1)}4-\\frac{3(3^n-1)}2=\\frac{5(5^n-1)}2-\\frac{3(3^n-1)}2$이다.\n$5^n$으로 나누면 $\\frac{S_n}{5^n}=\\frac52(1-5^{-n})-\\frac32\\left(\\left(\\frac35\\right)^n-5^{-n}\\right)$이다.\n$5^{-n}\\to0$, $\\left(\\frac35\\right)^n\\to0$ (등비수열의 극한)이므로 극한은 $\\frac52$이다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-061",
    "problemTypeKey": "PT_CALCULUS_SEQUENCE_LIMIT",
    "templateKey": "TPL_CALCULUS_SEQ_LIMIT_GEOMETRIC_RATIO",
    "crossConceptKeys": [],
    "conditionKeys": [],
    "integrationPattern": "NONE"
  },
  {
    "id": 5,
    "category": "수열의 극한",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-01",
    "standardUnit": "수열의 극한",
    "standardUnitOrder": 1,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "수열의 극한"
    ],
    "wide": false,
    "content": "첫째항이 $6$, 공비가 $r>1$인 등비수열의 부분합이 $S_n$이다. $\\lim_{n\\to\\infty}\\frac{a_{n+1}}{S_n}=\\frac52$일 때 $r$은?",
    "choices": [
      "$\\frac32$",
      "$2$",
      "$\\frac52$",
      "$\\frac72$",
      "$4$"
    ],
    "answer": "④",
    "solution": "$a_{n+1}=a_1 r^n=6r^n$이다.\n$S_n=\\frac{6(r^n-1)}{r-1}$이다.\n몫: $\\frac{a_{n+1}}{S_n}=\\frac{6r^n}{6(r^n-1)/(r-1)}=\\frac{r^n(r-1)}{r^n-1}$이다.\n분모·분자를 $r^n$으로 나누면 $\\frac{r-1}{1-r^{-n}}$이다.\n$r>1$이므로 $r^{-n}\\to0$ (등비수열의 극한)이고 극한은 $r-1$이다.\n주어진 극한값이 $\\frac52$이므로 $r-1=\\frac52$이다.\n따라서 $r=\\frac72$이다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-061",
    "problemTypeKey": "PT_CALCULUS_SEQUENCE_LIMIT",
    "templateKey": "TPL_CALCULUS_SEQ_LIMIT_GEOMETRIC_RATIO",
    "crossConceptKeys": [],
    "conditionKeys": [
      "COND_RANGE"
    ],
    "integrationPattern": "NONE"
  },
  {
    "id": 6,
    "category": "수열의 극한",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-01",
    "standardUnit": "수열의 극한",
    "standardUnitOrder": 1,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "수열의 극한"
    ],
    "wide": false,
    "content": "다음 중 $\\lim_{n\\to\\infty}\\frac{a_1+\\cdots+a_n}{n}$이 유한한 수로 수렴하는 것을 모두 고르면? $\\text{ㄱ. }a_n=2n+1$, $\\text{ㄴ. }a_n=2+(1/3)^n$, $\\text{ㄷ. }a_n=3(-1)^n$",
    "choices": [
      "ㄱ",
      "ㄴ",
      "ㄷ",
      "ㄱ, ㄴ",
      "ㄴ, ㄷ"
    ],
    "answer": "⑤",
    "solution": "ㄱ. $\\sum_{k=1}^n(2k+1)=n(n+1)+n=n^2+2n$이다.\n평균은 $\\frac{n^2+2n}{n}=n+2$이므로 $n\\to\\infty$일 때 발산한다.\nㄴ. $\\sum_{k=1}^n\\left(2+\\left(\\frac13\\right)^k\\right)=2n+\\frac{\\frac13\\left(1-3^{-n}\\right)}{1-\\frac13}=2n+\\frac12\\left(1-3^{-n}\\right)$이다.\n평균은 $2+\\frac{1-3^{-n}}{2n}$이고, $3^{-n}\\to0$, $\\frac1n\\to0$이므로 $2$로 수렴한다.\nㄷ. 등비수열의 합: $\\sum_{k=1}^n 3(-1)^k=3\\cdot\\frac{(-1)\\left(1-(-1)^n\\right)}{1-(-1)}=-\\frac32\\left(1-(-1)^n\\right)$이다.\n$n$이 홀수이면 $-3$, 짝수이면 $0$이므로 부분합은 유계이다.\n평균은 $\\frac{S_n}{n}$이고 $|S_n|\\le 3$이므로 $\\left|\\frac{S_n}{n}\\right|\\le\\frac3n\\to0$, 즉 $0$으로 수렴한다.\n따라서 수렴하는 것은 ㄴ, ㄷ이다.\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-061",
    "problemTypeKey": "PT_CALCULUS_SEQUENCE_LIMIT",
    "templateKey": "TPL_CALCULUS_SEQ_LIMIT_GEOMETRIC_RATIO",
    "crossConceptKeys": [],
    "conditionKeys": [],
    "integrationPattern": "CASE_BRANCH"
  }
];
