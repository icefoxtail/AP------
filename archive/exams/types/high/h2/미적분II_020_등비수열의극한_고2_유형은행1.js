window.examTitle = "미적분II_020_등비수열의극한_고2_유형은행1";

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
    "content": "$a=\\lim_{n\\to\\infty}\\frac{3\\cdot7^n-4^n}{7^{n+1}+4^n}$, $b=\\lim_{n\\to\\infty}\\frac{4^{n+1}-2\\cdot7^{n+1}}{4^n+7^n}$일 때 $ab$는?",
    "choices": [
      "$-6$",
      "$-4$",
      "$-3$",
      "$-2$",
      "$6$"
    ],
    "answer": "①",
    "solution": "① $a$의 분모와 분자를 $7^n$으로 나눈다.\n$$a=\\lim_{n\\to\\infty}\\frac{3\\cdot7^n-4^n}{7^{n+1}+4^n}=\\lim_{n\\to\\infty}\\frac{3-(4/7)^n}{7+(4/7)^n}$$\n② 등비수열의 극한에서 $|4/7|<1$이므로 $(4/7)^n\\to0$이다.\n③ 따라서 $a=\\frac{3-0}{7+0}=\\frac37$이다.\n④ $b$의 분모와 분자도 $7^n$으로 나눈다.\n$$b=\\lim_{n\\to\\infty}\\frac{4^{n+1}-2\\cdot7^{n+1}}{4^n+7^n}=\\lim_{n\\to\\infty}\\frac{4(4/7)^n-14}{(4/7)^n+1}$$\n⑤ $(4/7)^n\\to0$이므로 $b=\\frac{0-14}{0+1}=-14$이다.\n⑥ 따라서 $ab=\\frac37\\times(-14)=-6$이다.\n따라서 정답은 ①이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-061",
    "problemTypeKey": "PT_CALCULUS_SEQUENCE_LIMIT",
    "templateKey": "TPL_CALCULUS_SEQ_LIMIT_GEOMETRIC_RATIO",
    "crossConceptKeys": [],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
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
    "content": "$a_1=\\sqrt6$, $a_{n+1}=\\sqrt{6a_n}$으로 주어진 수열의 극한값은?",
    "choices": [
      "$3$",
      "$4$",
      "$5$",
      "$6$",
      "$7$"
    ],
    "answer": "④",
    "solution": "① $a_1=6^{1/2}$이고 $a_2=\\sqrt{6\\cdot6^{1/2}}=6^{3/4}$이므로 $a_n=6^{c_n}$으로 둘 수 있다.\n② $a_{n+1}=\\sqrt{6a_n}$에서 $c_{n+1}=\\frac{1+c_n}{2}$이고 $c_1=\\frac12$이다.\n③ $d_n=1-c_n$으로 두면 $d_{n+1}=1-\\frac{1+c_n}{2}=\\frac{1-c_n}{2}=\\frac{d_n}{2}$이다.\n④ $d_1=\\frac12$이므로 $d_n=\\frac12\\cdot\\left(\\frac12\\right)^{n-1}=\\frac1{2^n}$이다.\n⑤ 따라서 $c_n=1-\\frac1{2^n}$이고 $a_n=6^{1-1/2^n}$이다.\n⑥ $\\frac1{2^n}\\to0$이므로 지수는 $1$에 가까워지고, $6^x$가 연속이므로 $\\lim a_n=6^1=6$이다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-061",
    "problemTypeKey": "PT_CALCULUS_SEQUENCE_LIMIT",
    "templateKey": "TPL_CALCULUS_SEQ_LIMIT_GEOMETRIC_RATIO",
    "crossConceptKeys": [],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
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
    "content": "다음 중 유한한 극한값이 존재하는 것을 모두 고르면? $\\text{ㄱ. }\\lim_{n\\to\\infty}\\frac{3+3^2+\\cdots+3^n}{2^n}$, $\\text{ㄴ. }\\lim_{n\\to\\infty}\\frac{(-2)^n}{3^n+n}$, $\\text{ㄷ. }\\lim_{n\\to\\infty}\\frac{n^4}{\\sum_{k=1}^n k(k+2)}$",
    "choices": [
      "ㄱ",
      "ㄴ",
      "ㄷ",
      "ㄱ, ㄴ",
      "ㄴ, ㄷ"
    ],
    "answer": "②",
    "solution": "① ㄱ: 등비수열의 합 공식으로 분자를 계산하면 $3+3^2+\\cdots+3^n=\\frac{3(3^n-1)}{3-1}=\\frac{3^{n+1}-3}{2}$이다.\n② ㄱ의 식은 $\\frac{3^{n+1}-3}{2\\cdot2^n}=\\frac32\\left(\\frac32\\right)^n-\\frac32\\left(\\frac12\\right)^n$이고, $(3/2)^n\\to\\infty$이므로 양의 무한대로 발산한다.\n③ ㄴ: $0\\le\\left|\\frac{(-2)^n}{3^n+n}\\right|\\le\\frac{2^n}{3^n}=\\left(\\frac23\\right)^n$이다.\n④ 등비수열의 극한에서 $(2/3)^n\\to0$이므로 조임 정리에 의해 $\\frac{(-2)^n}{3^n+n}\\to0$이다.\n⑤ ㄷ: $\\sum_{k=1}^n k(k+2)=\\sum_{k=1}^n k^2+2\\sum_{k=1}^n k=\\frac{n(n+1)(2n+1)}6+n(n+1)=\\frac{n(n+1)(2n+7)}6$이다.\n⑥ 따라서 $\\frac{n^4}{\\sum k(k+2)}=\\frac{6n^3}{(n+1)(2n+7)}\\to\\infty$이므로 유한한 극한값이 없다.\n⑦ 유한한 극한값이 존재하는 것은 ㄴ뿐이다.\n따라서 정답은 ②이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-061",
    "problemTypeKey": "PT_CALCULUS_SEQUENCE_LIMIT",
    "templateKey": "TPL_CALCULUS_SEQ_LIMIT_GEOMETRIC_RATIO",
    "crossConceptKeys": [
      "CC_SERIES_SUM"
    ],
    "conditionKeys": [],
    "integrationPattern": "CASE_BRANCH"
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
    "content": "$a_n+2b_n=6^n$, $a_n-2b_n=5^{n+1}$일 때 $\\lim_{n\\to\\infty}\\frac{a_n}{b_n}$은?",
    "choices": [
      "$-2$",
      "$0$",
      "$1$",
      "$2$",
      "$3$"
    ],
    "answer": "④",
    "solution": "① 두 식을 변끼리 더하면 $2a_n=6^n+5^{n+1}$이므로 $a_n=\\frac{6^n+5^{n+1}}2$이다.\n② 두 식을 변끼리 빼면 $4b_n=6^n-5^{n+1}$이므로 $b_n=\\frac{6^n-5^{n+1}}4$이다.\n③ 따라서 $$\\frac{a_n}{b_n}=\\frac{(6^n+5^{n+1})/2}{(6^n-5^{n+1})/4}=2\\cdot\\frac{6^n+5^{n+1}}{6^n-5^{n+1}}$$이다.\n④ 분모와 분자를 $6^n$으로 나누면 $$\\frac{a_n}{b_n}=2\\cdot\\frac{1+5(5/6)^n}{1-5(5/6)^n}$$이다.\n⑤ 등비수열의 극한에서 $(5/6)^n\\to0$이다.\n⑥ 따라서 $\\lim\\frac{a_n}{b_n}=2\\cdot\\frac{1+0}{1-0}=2$이다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-061",
    "problemTypeKey": "PT_CALCULUS_SEQUENCE_LIMIT",
    "templateKey": "TPL_CALCULUS_SEQ_LIMIT_GEOMETRIC_RATIO",
    "crossConceptKeys": [],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
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
    "content": "$a_n+b_n=4\\cdot2^n$, $a_nb_n=4\\cdot4^n-25^n$, $a_n>b_n$일 때 $\\lim_{n\\to\\infty}\\frac{a_n-b_n}{a_n}$은?",
    "choices": [
      "$0$",
      "$1$",
      "$2$",
      "$3$",
      "$4$"
    ],
    "answer": "③",
    "solution": "① 곱셈공식의 변형으로 $(a_n-b_n)^2=(a_n+b_n)^2-4a_nb_n$이다.\n② 주어진 식을 대입하면 $(a_n-b_n)^2=(4\\cdot2^n)^2-4(4\\cdot4^n-25^n)$이다.\n③ 계산하면 $(a_n-b_n)^2=16\\cdot4^n-16\\cdot4^n+4\\cdot25^n=4\\cdot25^n$이다.\n④ $a_n>b_n$이므로 $a_n-b_n>0$이고, $a_n-b_n=2\\cdot5^n$이다.\n⑤ $a_n=\\frac{(a_n+b_n)+(a_n-b_n)}2=\\frac{4\\cdot2^n+2\\cdot5^n}2=2\\cdot2^n+5^n$이다.\n⑥ 따라서 $$\\frac{a_n-b_n}{a_n}=\\frac{2\\cdot5^n}{2\\cdot2^n+5^n}$$이다.\n⑦ 분모와 분자를 $5^n$으로 나누면 $$\\frac{a_n-b_n}{a_n}=\\frac{2}{1+2(2/5)^n}$$이다.\n⑧ $(2/5)^n\\to0$이므로 극한값은 $\\frac2{1+0}=2$이다.\n따라서 정답은 ③이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-061",
    "problemTypeKey": "PT_CALCULUS_SEQUENCE_LIMIT",
    "templateKey": "TPL_CALCULUS_SEQ_LIMIT_GEOMETRIC_RATIO",
    "crossConceptKeys": [],
    "conditionKeys": [
      "COND_INEQUALITY_CONSTRAINT"
    ],
    "integrationPattern": "SEQUENTIAL"
  }
];
