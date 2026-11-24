window.examTitle = "미적분II_001_수열의수렴과발산_고2_유형은행1";

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
    "content": "다음 수열의 수렴과 발산에 대한 설명 중 옳지 않은 것은?",
    "choices": [
      "$(-3/4)^n$은 수렴한다.",
      "$4+(-3)^n$은 발산한다.",
      "$n^2/(n+3)$은 수렴한다.",
      "$(2+(-1)^n)/(n+2)$는 수렴한다.",
      "$3+(-1)^n/n$은 수렴한다."
    ],
    "answer": "③",
    "solution": "①은 등비수열의 극한에서 공비의 절댓값이 $|r|=3/4<1$이므로 $(-3/4)^n\\to0$으로 수렴한다.\n②는 $n=2k$일 때 $4+(-3)^{2k}=4+3^{2k}\\to\\infty$이고, $n=2k-1$일 때 $4+(-3)^{2k-1}=4-3^{2k-1}\\to-\\infty$이므로 발산한다.\n③은 분자와 분모를 $n$으로 나누면 $n^2/(n+3)=n/(1+3/n)$이고, $n\\to\\infty$일 때 $n\\to\\infty$, $1+3/n\\to1$이므로 $+\\infty$로 발산한다.\n따라서 ③의 '수렴한다'는 설명이 옳지 않다.\n④는 $1\\le2+(-1)^n\\le3$이고 $n+2\\to\\infty$이므로 $0\\le\\left|\\frac{2+(-1)^n}{n+2}\\right|\\le\\frac{3}{n+2}\\to0$이고, 조임 정리에 의해 0으로 수렴한다.\n⑤는 $\\left|\\frac{(-1)^n}{n}\\right|=\\frac1n\\to0$이므로 $\\frac{(-1)^n}{n}\\to0$이고, 따라서 $3+\\frac{(-1)^n}{n}\\to3$으로 수렴한다.\n주의: ③은 분자의 차수가 분모의 차수보다 커서 수렴하지 않는다.\n따라서 정답은 ③이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-056",
    "problemTypeKey": "PT_CALCULUS_SEQUENCE_LIMIT",
    "templateKey": "TPL_CALCULUS_SEQ_LIMIT_ALGEBRAIC",
    "crossConceptKeys": [
      "CC_GEOMETRIC_SEQUENCE"
    ],
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
    "content": "다음 중 발산하는 수열은?",
    "choices": [
      "$(-1)^n/(n+2)^2$",
      "$5-2/(n+3)$",
      "$2+(-1/3)^n$",
      "$(3+(-1)^n)/2$",
      "$(2-(-1)^n)/(n+1)$"
    ],
    "answer": "④",
    "solution": "①은 $\\left|\\frac{(-1)^n}{(n+2)^2}\\right|=\\frac1{(n+2)^2}\\to0$이므로 0으로 수렴한다.\n②는 $\\frac{2}{n+3}\\to0$이므로 $5-\\frac{2}{n+3}\\to5$로 수렴한다.\n③은 등비수열의 극한에서 $\\left|-\\frac13\\right|<1$이라 $\\left(-\\frac13\\right)^n\\to0$이므로 $2+\\left(-\\frac13\\right)^n\\to2$로 수렴한다.\n④는 홀수항 $n=2k-1$에서 $\\frac{3+(-1)^{2k-1}}2=\\frac{3-1}2=1$이고, 짝수항 $n=2k$에서 $\\frac{3+(-1)^{2k}}2=\\frac{3+1}2=2$이다.\n두 부분수열의 극한값이 1과 2로 서로 다르므로 수열은 진동하며 발산한다.\n⑤는 $1\\le2-(-1)^n\\le3$이고 $n+1\\to\\infty$이므로 $0\\le\\left|\\frac{2-(-1)^n}{n+1}\\right|\\le\\frac3{n+1}\\to0$이고, 조임 정리에 의해 0으로 수렴한다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-056",
    "problemTypeKey": "PT_CALCULUS_SEQUENCE_LIMIT",
    "templateKey": "TPL_CALCULUS_SEQ_LIMIT_ALGEBRAIC",
    "crossConceptKeys": [
      "CC_GEOMETRIC_SEQUENCE"
    ],
    "conditionKeys": [],
    "integrationPattern": "CASE_BRANCH"
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
    "content": "다음에 주어진 일반항을 갖는 수열 중 발산하는 것은?",
    "choices": [
      "$2(-1)^{n-1}/(n+2)$",
      "$(-2/5)^{n-1}$",
      "$2+3/(n+4)$",
      "$2(-1)^n/\\log_2 8$",
      "$(-1)^n/\\log_2(n+1)$"
    ],
    "answer": "④",
    "solution": "①은 $\\left|\\frac{2(-1)^{n-1}}{n+2}\\right|=\\frac2{n+2}\\to0$이므로 0으로 수렴한다.\n②는 등비수열의 극한에서 $\\left|-\\frac25\\right|<1$이라 $\\left(-\\frac25\\right)^{n-1}\\to0$으로 수렴한다.\n③은 $\\frac3{n+4}\\to0$이므로 $2+\\frac3{n+4}\\to2$로 수렴한다.\n④는 $\\log_2 8=3$이므로 일반항이 $\\frac{2(-1)^n}{3}=\\frac23(-1)^n$이 된다.\n홀수항 $n=2k-1$은 $-\\frac23$, 짝수항 $n=2k$는 $\\frac23$으로 서로 다른 값이 반복되므로 발산한다.\n⑤는 $\\frac1{\\log_2(n+1)}\\to0$이고 $\\left|\\frac{(-1)^n}{\\log_2(n+1)}\\right|=\\frac1{\\log_2(n+1)}$이므로 0으로 수렴한다.\n주의: ④의 분모 $\\log_2 8=3$은 $n$에 따라 변하지 않는 상수이다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-056",
    "problemTypeKey": "PT_CALCULUS_SEQUENCE_LIMIT",
    "templateKey": "TPL_CALCULUS_SEQ_LIMIT_ALGEBRAIC",
    "crossConceptKeys": [],
    "conditionKeys": [],
    "integrationPattern": "CASE_BRANCH"
  }
];
