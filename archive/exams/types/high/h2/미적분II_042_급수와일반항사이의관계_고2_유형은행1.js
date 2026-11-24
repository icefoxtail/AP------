window.examTitle = "미적분II_042_급수와일반항사이의관계_고2_유형은행1";

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
    "content": "“$\\lim_{n\\to\\infty}a_n=0$이면 $\\sum_{n=1}^\\infty a_n$은 수렴한다”의 반례가 되는 급수를 모두 고른 것은?\nㄱ. $\\sum_{n=1}^\\infty\\frac{1}{2n+1}$\nㄴ. $\\sum_{n=1}^\\infty\\frac{n+3}{4n+1}$\nㄷ. $\\sum_{n=1}^\\infty\\frac{2}{\\sqrt{n+5}+\\sqrt{n+3}}$",
    "choices": [
      "ㄱ",
      "ㄴ",
      "ㄷ",
      "ㄱ, ㄷ",
      "ㄱ, ㄴ, ㄷ"
    ],
    "answer": "④",
    "solution": "ㄱ. $\\lim_{n\\to\\infty}\\frac{1}{2n+1}=0$이고(분모 $2n+1\\to\\infty$), $n\\ge1$에서 $2n+1\\le3n$이므로 $\\frac{1}{2n+1}\\ge\\frac{1}{3n}$이다.\n따라서 $\\sum_{n=1}^{\\infty}\\frac{1}{2n+1}\\ge\\frac13\\sum_{n=1}^{\\infty}\\frac1n$이고, 조화급수 $\\sum\\frac1n$이 발산하므로 비교판정법에 의해 발산한다.\nㄴ. $\\lim_{n\\to\\infty}\\frac{n+3}{4n+1}=\\lim_{n\\to\\infty}\\frac{1+3/n}{4+1/n}=\\frac14\\ne0$이므로 수렴의 필요조건 $a_n\\to0$을 만족하지 않는다. 따라서 반례가 아니다.\nㄷ. 분모를 유리화하면 $\\frac{2}{\\sqrt{n+5}+\\sqrt{n+3}}=\\frac{2(\\sqrt{n+5}-\\sqrt{n+3})}{(n+5)-(n+3)}=\\sqrt{n+5}-\\sqrt{n+3}$이고, $\\lim_{n\\to\\infty}(\\sqrt{n+5}-\\sqrt{n+3})=\\lim_{n\\to\\infty}\\frac{2}{\\sqrt{n+5}+\\sqrt{n+3}}=0$이다.\n제$N$부분합은 $\\sum_{n=1}^{N}(\\sqrt{n+5}-\\sqrt{n+3})=(\\sqrt{N+4}+\\sqrt{N+5})-(\\sqrt4+\\sqrt5)$로 망원급수 정리에 의해 정리되고, $N\\to\\infty$일 때 $\\infty$로 발산한다.\n(i) ㄱ은 반례, (ii) ㄴ은 전제 불만족, (iii) ㄷ은 반례이므로 반례는 ㄱ, ㄷ이다.\n주의: ㄴ은 일반항의 극한이 $0$이 아니어서 애초에 '반례'가 될 수 없다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-063",
    "problemTypeKey": "PT_CALCULUS_SERIES",
    "templateKey": "TPL_CALCULUS_SERIES_CONVERGENCE_CONDITION",
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
    "content": "$\\sum_{n=1}^{\\infty}a_n=7$일 때, $\\lim_{n\\to\\infty}\\frac{2a_n-6n+3}{a_n+4n+5}$의 값은?",
    "choices": [
      "$-2$",
      "$-1.5$",
      "$-1$",
      "$-0.5$",
      "$0$"
    ],
    "answer": "②",
    "solution": "$\\sum_{n=1}^{\\infty}a_n=7$이 수렴하므로 급수 수렴의 필요조건에 의해 $\\lim_{n\\to\\infty}a_n=0$이다.\n분자와 분모를 $n$으로 나누면 $\\frac{2a_n-6n+3}{a_n+4n+5}=\\frac{2a_n/n-6+3/n}{a_n/n+4+5/n}$이다.\n$a_n\\to0$이므로 $a_n/n\\to0$이고, $3/n\\to0$, $5/n\\to0$이다(수렴하는 수열의 극한의 성질).\n따라서 극한은 $\\frac{2\\cdot0-6+0}{0+4+0}=-\\frac64=-\\frac32$이다.\n따라서 정답은 ②이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-063",
    "problemTypeKey": "PT_CALCULUS_SERIES",
    "templateKey": "TPL_CALCULUS_SERIES_CONVERGENCE_CONDITION",
    "crossConceptKeys": [
      "CC_SERIES_SUM"
    ],
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
    "content": "급수 $\\sum_{n=1}^{\\infty}(2a_n-10)$이 수렴할 때, $\\lim_{n\\to\\infty}(3a_n-2)$의 값은?",
    "choices": [
      "$13$",
      "$14$",
      "$15$",
      "$16$",
      "$17$"
    ],
    "answer": "①",
    "solution": "급수 $\\sum_{n=1}^{\\infty}(2a_n-10)$이 수렴하므로 일반항은 $0$으로 수렴한다: $\\lim_{n\\to\\infty}(2a_n-10)=0$.\n$\\lim_{n\\to\\infty}2a_n=10$이고, 수렴하는 수열의 상수배의 극한 성질에 의해 $\\lim_{n\\to\\infty}a_n=5$이다.\n따라서 $\\lim_{n\\to\\infty}(3a_n-2)=3\\cdot5-2=13$이다.\n따라서 정답은 ①이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-063",
    "problemTypeKey": "PT_CALCULUS_SERIES",
    "templateKey": "TPL_CALCULUS_SERIES_CONVERGENCE_CONDITION",
    "crossConceptKeys": [
      "CC_SERIES_SUM"
    ],
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
    "content": "수렴하는 수열 $\\{a_n\\}$에 대해 $\\sum_{n=1}^{\\infty}\\frac{4a_n+12}{a_n+8}=6$일 때, $\\lim_{n\\to\\infty}a_n$의 값은?",
    "choices": [
      "$-5$",
      "$-4$",
      "$-3$",
      "$-2$",
      "$-1$"
    ],
    "answer": "③",
    "solution": "급수 $\\sum_{n=1}^{\\infty}\\frac{4a_n+12}{a_n+8}=6$이 수렴하므로 일반항 $u_n=\\frac{4a_n+12}{a_n+8}$은 $u_n\\to0$이다.\n$\\{a_n\\}$이 수렴하므로 $\\lim_{n\\to\\infty}a_n=L$이라 하면 $u_n\\to\\frac{4L+12}{L+8}$이다. 이때 $L+8\\ne0$이다(만약 $L=-8$이면 분자가 $-20$으로 가서 $u_n$이 $0$으로 갈 수 없다).\n$\\frac{4L+12}{L+8}=0$에서 $4L+12=0$, 즉 $L=-3$이다.\n따라서 $\\lim_{n\\to\\infty}a_n=-3$이다.\n따라서 정답은 ③이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-063",
    "problemTypeKey": "PT_CALCULUS_SERIES",
    "templateKey": "TPL_CALCULUS_SERIES_CONVERGENCE_CONDITION",
    "crossConceptKeys": [
      "CC_SERIES_SUM"
    ],
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
    "content": "수렴하는 수열 $\\{a_n\\}$이 $\\sum_{n=1}^\\infty a_n=\\lim_{n\\to\\infty}(2a_n-7)$을 만족할 때, 급수의 합은?",
    "choices": [
      "$-10$",
      "$-9$",
      "$-8$",
      "$-7$",
      "$-6$"
    ],
    "answer": "④",
    "solution": "$\\sum_{n=1}^{\\infty}a_n$이 수렴하므로 급수 수렴의 필요조건에 의해 $a_n\\to0$이다.\n따라서 우변은 $\\lim_{n\\to\\infty}(2a_n-7)=2\\cdot0-7=-7$이다.\n주어진 등식 $\\sum_{n=1}^{\\infty}a_n=\\lim_{n\\to\\infty}(2a_n-7)$에 이 값을 대입하면 급수의 합은 $-7$이다.\n주의: 급수가 수렴한다는 사실에서 $a_n\\to0$을 먼저 얻어야 우변의 극한이 계산된다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-063",
    "problemTypeKey": "PT_CALCULUS_SERIES",
    "templateKey": "TPL_CALCULUS_SERIES_CONVERGENCE_CONDITION",
    "crossConceptKeys": [
      "CC_SERIES_SUM"
    ],
    "conditionKeys": [],
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
    "content": "$\\sum_{n=1}^{\\infty}(3a_n-12)=5$일 때, $\\lim_{n\\to\\infty}\\frac{5a_n-2}{a_n+2}$의 값은?",
    "choices": [
      "$1.5$",
      "$2$",
      "$2.5$",
      "$3$",
      "$3.5$"
    ],
    "answer": "④",
    "solution": "급수 $\\sum_{n=1}^{\\infty}(3a_n-12)=5$가 수렴하므로 일반항은 $0$으로 수렴한다: $\\lim_{n\\to\\infty}(3a_n-12)=0$.\n$\\lim_{n\\to\\infty}3a_n=12$에서 $\\lim_{n\\to\\infty}a_n=4$이다.\n분자와 분모의 극한을 각각 계산하면 $\\lim_{n\\to\\infty}(5a_n-2)=5\\cdot4-2=18$이고 $\\lim_{n\\to\\infty}(a_n+2)=4+2=6$이다.\n분모의 극한이 $6\\ne0$이므로 극한의 성질에 의해 $\\lim_{n\\to\\infty}\\frac{5a_n-2}{a_n+2}=\\frac{18}{6}=3$이다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-063",
    "problemTypeKey": "PT_CALCULUS_SERIES",
    "templateKey": "TPL_CALCULUS_SERIES_CONVERGENCE_CONDITION",
    "crossConceptKeys": [
      "CC_SERIES_SUM"
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
    "content": "$\\sum_{n=1}^{\\infty}\\left(4-\\frac{a_n}{3}\\right)=-2$일 때, $\\lim_{n\\to\\infty}(2a_n+1)$의 값은?",
    "choices": [
      "$25$",
      "$27$",
      "$29$",
      "$31$",
      "$33$"
    ],
    "answer": "①",
    "solution": "급수 $\\sum_{n=1}^{\\infty}\\left(4-\\frac{a_n}{3}\\right)=-2$가 수렴하므로 일반항의 극한은 $0$이다: $\\lim_{n\\to\\infty}\\left(4-\\frac{a_n}{3}\\right)=0$.\n$4-\\frac{a_n}{3}\\to0$에서 $\\frac{a_n}{3}\\to4$, 즉 $a_n\\to12$이다.\n따라서 $\\lim_{n\\to\\infty}(2a_n+1)=2\\cdot12+1=25$이다.\n따라서 정답은 ①이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-063",
    "problemTypeKey": "PT_CALCULUS_SERIES",
    "templateKey": "TPL_CALCULUS_SERIES_CONVERGENCE_CONDITION",
    "crossConceptKeys": [
      "CC_SERIES_SUM"
    ],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
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
    "content": "$\\sum_{n=1}^{\\infty}(a_n-4)=3$일 때, $\\lim_{n\\to\\infty}\\frac{3n-2}{na_n+2}$의 값은?",
    "choices": [
      "$0.5$",
      "$0.625$",
      "$0.75$",
      "$0.875$",
      "$1$"
    ],
    "answer": "③",
    "solution": "$\\sum_{n=1}^{\\infty}(a_n-4)=3$이 수렴하므로 $a_n-4\\to0$, 즉 $a_n\\to4$이다.\n분자와 분모를 $n$으로 나누면 $\\frac{3n-2}{na_n+2}=\\frac{3-2/n}{a_n+2/n}$이다.\n$a_n\\to4$이고 $2/n\\to0$이므로 분모는 $a_n+2/n\\to4\\ne0$이다.\n분자는 $3-2/n\\to3$이므로 극한은 $\\frac34=0.75$이다.\n따라서 정답은 ③이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-063",
    "problemTypeKey": "PT_CALCULUS_SERIES",
    "templateKey": "TPL_CALCULUS_SERIES_CONVERGENCE_CONDITION",
    "crossConceptKeys": [
      "CC_SERIES_SUM"
    ],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
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
    "content": "$\\sum_{n=1}^{\\infty}(2a_n-b_n)=7$, $\\sum_{n=1}^{\\infty}(b_n-8)=-1$일 때, $\\lim_{n\\to\\infty}(a_n+3b_n)$의 값은?",
    "choices": [
      "$20$",
      "$22$",
      "$24$",
      "$26$",
      "$28$"
    ],
    "answer": "⑤",
    "solution": "$\\sum_{n=1}^{\\infty}(b_n-8)=-1$이 수렴하므로 $b_n-8\\to0$, 즉 $b_n\\to8$이다.\n$\\sum_{n=1}^{\\infty}(2a_n-b_n)=7$이 수렴하므로 일반항은 $0$으로 수렴한다: $2a_n-b_n\\to0$.\n$2a_n=(2a_n-b_n)+b_n\\to0+8=8$이므로 $a_n\\to4$이다.\n따라서 $\\lim_{n\\to\\infty}(a_n+3b_n)=4+3\\cdot8=28$이다.\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-063",
    "problemTypeKey": "PT_CALCULUS_SERIES",
    "templateKey": "TPL_CALCULUS_SERIES_CONVERGENCE_CONDITION",
    "crossConceptKeys": [
      "CC_SERIES_SUM"
    ],
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
    "content": "$\\sum_{n=1}^{\\infty}(a_n+2b_n-8)=4$, $\\sum_{n=1}^{\\infty}(a_n-2b_n-4)=1$일 때, $\\lim_{n\\to\\infty}(3a_n-b_n)$의 값은?",
    "choices": [
      "$14$",
      "$15$",
      "$16$",
      "$17$",
      "$18$"
    ],
    "answer": "④",
    "solution": "$\\sum_{n=1}^{\\infty}(a_n+2b_n-8)=4$가 수렴하므로 $a_n+2b_n-8\\to0$, 즉 $a_n+2b_n\\to8$이다.\n$\\sum_{n=1}^{\\infty}(a_n-2b_n-4)=1$이 수렴하므로 $a_n-2b_n-4\\to0$, 즉 $a_n-2b_n\\to4$이다.\n두 식을 더하면 $2a_n\\to12$이므로 $a_n\\to6$이다.\n두 식을 빼면 $4b_n\\to4$이므로 $b_n\\to1$이다.\n따라서 $\\lim_{n\\to\\infty}(3a_n-b_n)=3\\cdot6-1=17$이다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-063",
    "problemTypeKey": "PT_CALCULUS_SERIES",
    "templateKey": "TPL_CALCULUS_SERIES_CONVERGENCE_CONDITION",
    "crossConceptKeys": [
      "CC_SERIES_SUM"
    ],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
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
    "content": "$\\sum_{n=1}^{\\infty}(2a_n+b_n)=6$이고 모든 자연수 $n$에서 $-4-\\frac1n<b_n<-4+\\frac2n$일 때, $\\lim_{n\\to\\infty}(3a_n-2b_n)$의 값은?",
    "choices": [
      "$12$",
      "$14$",
      "$16$",
      "$18$",
      "$20$"
    ],
    "answer": "②",
    "solution": "$\\sum_{n=1}^{\\infty}(2a_n+b_n)=6$이 수렴하므로 일반항은 $0$으로 수렴한다: $2a_n+b_n\\to0$.\n$-4-\\frac1n<b_n<-4+\\frac2n$에서 양끝의 극한이 모두 $\\lim_{n\\to\\infty}\\left(-4-\\frac1n\\right)=\\lim_{n\\to\\infty}\\left(-4+\\frac2n\\right)=-4$이므로 샌드위치 정리에 의해 $b_n\\to-4$이다.\n$2a_n=(2a_n+b_n)-b_n\\to0-(-4)=4$이므로 $a_n\\to2$이다.\n따라서 $\\lim_{n\\to\\infty}(3a_n-2b_n)=3\\cdot2-2\\cdot(-4)=6+8=14$이다.\n따라서 정답은 ②이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-063",
    "problemTypeKey": "PT_CALCULUS_SERIES",
    "templateKey": "TPL_CALCULUS_SERIES_CONVERGENCE_CONDITION",
    "crossConceptKeys": [
      "CC_SERIES_SUM"
    ],
    "conditionKeys": [
      "COND_RANGE"
    ],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 12,
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
    "content": "급수 $\\sum_{n=1}^{\\infty}\\frac{a_n-2n^2+n}{n^2}$이 수렴하고 모든 $n$에서 $n^2+a_n\\ne0$일 때, $\\lim_{n\\to\\infty}\\frac{7n^2-n-2a_n}{n^2+a_n}$의 값은?",
    "choices": [
      "$0$",
      "$0.5$",
      "$1$",
      "$1.5$",
      "$2$"
    ],
    "answer": "③",
    "solution": "급수 $\\sum_{n=1}^{\\infty}\\frac{a_n-2n^2+n}{n^2}$이 수렴하므로 일반항은 $0$으로 수렴한다: $\\frac{a_n-2n^2+n}{n^2}=\\frac{a_n}{n^2}-2+\\frac1n\\to0$.\n따라서 $\\frac{a_n}{n^2}\\to2$이다.\n구하는 식의 분자와 분모를 $n^2$으로 나누면 $\\frac{7n^2-n-2a_n}{n^2+a_n}=\\frac{7-\\frac1n-2\\frac{a_n}{n^2}}{1+\\frac{a_n}{n^2}}$이다.\n$\\frac{a_n}{n^2}\\to2$이고 $\\frac1n\\to0$이므로 분자는 $7-0-2\\cdot2=3$, 분모는 $1+2=3$이다.\n분모의 극한이 $3\\ne0$이므로 극한의 성질에 의해 $\\lim_{n\\to\\infty}\\frac{7n^2-n-2a_n}{n^2+a_n}=\\frac33=1$이다.\n따라서 정답은 ③이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-063",
    "problemTypeKey": "PT_CALCULUS_SERIES",
    "templateKey": "TPL_CALCULUS_SERIES_CONVERGENCE_CONDITION",
    "crossConceptKeys": [
      "CC_SERIES_SUM"
    ],
    "conditionKeys": [
      "COND_NONZERO"
    ],
    "integrationPattern": "SEQUENTIAL"
  }
];
