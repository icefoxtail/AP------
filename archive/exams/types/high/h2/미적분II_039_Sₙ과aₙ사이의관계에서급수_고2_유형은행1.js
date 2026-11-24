window.examTitle = "미적분II_039_Sₙ과aₙ사이의관계에서급수_고2_유형은행1";

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
    "content": "수열 $\\{a_n\\}$에서 $\\sum_{k=1}^n a_k=2n^2$일 때, $\\sum_{n=1}^{\\infty}\\frac{8}{a_na_{n+1}}$의 값은?",
    "choices": [
      "$0.5$",
      "$1$",
      "$1.5$",
      "$2$",
      "$2.5$"
    ],
    "answer": "②",
    "solution": "부분합의 차로 일반항을 구한다: $a_n=S_n-S_{n-1}=2n^2-2(n-1)^2=4n-2$이고 $a_1=2$도 이 식을 만족한다.\n수열의 합을 부분분수로 분해한다: $\\frac{8}{a_na_{n+1}}=\\frac{8}{(4n-2)(4n+2)}=\\frac{1}{2n-1}-\\frac{1}{2n+1}$.\n제$N$항까지의 합을 계산한다: $\\sum_{n=1}^{N}\\left(\\frac{1}{2n-1}-\\frac{1}{2n+1}\\right)=1-\\frac{1}{2N+1}$.\n$N\\to\\infty$일 때 $\\frac{1}{2N+1}\\to0$이므로 망원합의 극한은 $1$이다.\n따라서 정답은 ②이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-062",
    "problemTypeKey": "PT_CALCULUS_SERIES",
    "templateKey": "TPL_CALCULUS_SERIES_PARTIAL_SUM",
    "crossConceptKeys": [
      "CC_TELESCOPING_SERIES"
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
    "content": "수열 $\\{a_n\\}$에서 $\\sum_{k=1}^n a_k=n^2+3n$일 때, $\\sum_{n=1}^{\\infty}\\frac{12}{a_na_{n+1}}$의 값은?",
    "choices": [
      "$0.5$",
      "$1$",
      "$1.5$",
      "$2$",
      "$2.5$"
    ],
    "answer": "③",
    "solution": "부분합의 차로 일반항을 구한다: $a_n=S_n-S_{n-1}=(n^2+3n)-\\{(n-1)^2+3(n-1)\\}=2n+2$이고 $a_1=4$도 이 식을 만족한다.\n수열의 합을 부분분수로 분해한다: $\\frac{12}{a_na_{n+1}}=\\frac{12}{(2n+2)(2n+4)}=\\frac{3}{(n+1)(n+2)}=3\\left(\\frac{1}{n+1}-\\frac{1}{n+2}\\right)$.\n제$N$항까지의 합은 $3\\left(\\frac12-\\frac{1}{N+2}\\right)$이다.\n$N\\to\\infty$일 때 $\\frac{1}{N+2}\\to0$이므로 극한값은 $3\\cdot\\frac12=\\frac32=1.5$이다.\n따라서 정답은 ③이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-062",
    "problemTypeKey": "PT_CALCULUS_SERIES",
    "templateKey": "TPL_CALCULUS_SERIES_PARTIAL_SUM",
    "crossConceptKeys": [
      "CC_TELESCOPING_SERIES"
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
    "content": "수열 $\\{a_n\\}$에서 $\\sum_{k=1}^n a_k=3n^2+n$일 때, $\\sum_{n=1}^{\\infty}\\frac{12}{a_na_{n+1}}$의 값은?",
    "choices": [
      "$0.5$",
      "$0.75$",
      "$1$",
      "$1.25$",
      "$1.5$"
    ],
    "answer": "①",
    "solution": "부분합의 차로 일반항을 구한다: $a_n=S_n-S_{n-1}=(3n^2+n)-\\{3(n-1)^2+(n-1)\\}=6n-2$이고 $a_1=4$도 이 식을 만족한다.\n수열의 합을 부분분수로 분해한다: $\\frac{12}{a_na_{n+1}}=\\frac{12}{(6n-2)(6n+4)}=\\frac{3}{(3n-1)(3n+2)}=\\frac{1}{3n-1}-\\frac{1}{3n+2}$.\n제$N$항까지의 합은 $\\left(\\frac12-\\frac15\\right)+\\left(\\frac15-\\frac18\\right)+\\cdots+\\left(\\frac{1}{3N-1}-\\frac{1}{3N+2}\\right)=\\frac12-\\frac{1}{3N+2}$이다.\n$N\\to\\infty$일 때 $\\frac{1}{3N+2}\\to0$이므로 극한값은 $\\frac12=0.5$이다.\n따라서 정답은 ①이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-062",
    "problemTypeKey": "PT_CALCULUS_SERIES",
    "templateKey": "TPL_CALCULUS_SERIES_PARTIAL_SUM",
    "crossConceptKeys": [
      "CC_TELESCOPING_SERIES"
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
    "content": "수열 $\\{a_n\\}$에서 $\\sum_{k=1}^n a_k=\\frac{12n}{n+2}$일 때, $\\sum_{n=1}^{\\infty}(2a_n+a_{n+1})$의 값은?",
    "choices": [
      "$26$",
      "$28$",
      "$30$",
      "$32$",
      "$34$"
    ],
    "answer": "④",
    "solution": "부분합을 $S_N=\\sum_{k=1}^{N}a_k$로 둔다.\n$a_1=S_1=\\frac{12\\cdot1}{1+2}=4$이다.\n구하는 제$N$항까지의 합은 $T_N=\\sum_{n=1}^{N}(2a_n+a_{n+1})=2S_N+(S_{N+1}-a_1)$이다.\n$S_N=\\frac{12N}{N+2}=\\frac{12}{1+\\frac2N}$이므로 $\\lim_{N\\to\\infty}S_N=12$이고, $\\lim_{N\\to\\infty}S_{N+1}=12$이다.\n따라서 $\\lim_{N\\to\\infty}T_N=2\\cdot12+12-4=32$이다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-062",
    "problemTypeKey": "PT_CALCULUS_SERIES",
    "templateKey": "TPL_CALCULUS_SERIES_PARTIAL_SUM",
    "crossConceptKeys": [],
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
    "content": "수열 $\\{a_n\\}$에서 $\\sum_{k=1}^n\\frac{a_k}{k}=2n^2+2n$일 때, $\\sum_{n=1}^{\\infty}\\frac{4}{a_n+n\\cdot4}$의 값은?",
    "choices": [
      "$0.5$",
      "$1$",
      "$1.5$",
      "$2$",
      "$2.5$"
    ],
    "answer": "②",
    "solution": "$n=1$일 때 $\\frac{a_1}{1}=2\\cdot1^2+2\\cdot1=4$이므로 $a_1=4$이다.\n$n\\ge2$일 때 연속된 두 합을 빼면 $\\frac{a_n}{n}=(2n^2+2n)-\\{2(n-1)^2+2(n-1)\\}=4n$이다.\n따라서 $a_n=4n^2$이고, $n=1$에서도 $4=4\\cdot1^2$이므로 모든 자연수 $n$에서 성립한다.\n구하는 항의 분모는 $a_n+4n=4n^2+4n=4n(n+1)$이다.\n따라서 $\\frac{4}{a_n+4n}=\\frac{4}{4n(n+1)}=\\frac{1}{n(n+1)}=\\frac1n-\\frac{1}{n+1}$이다.\n제$N$항까지의 합은 $1-\\frac{1}{N+1}$이므로 $N\\to\\infty$일 때 $1$로 수렴한다.\n따라서 정답은 ②이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-062",
    "problemTypeKey": "PT_CALCULUS_SERIES",
    "templateKey": "TPL_CALCULUS_SERIES_PARTIAL_SUM",
    "crossConceptKeys": [
      "CC_TELESCOPING_SERIES"
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
    "content": "수열 $\\{a_n\\}$에서 $\\sum_{k=1}^n a_k=n^2+3n-2$이다. $\\sum_{n=1}^\\infty\\frac{6}{a_na_{n+1}}$의 합은?",
    "choices": [
      "$0.5$",
      "$0.75$",
      "$1$",
      "$1.25$",
      "$1.5$"
    ],
    "answer": "③",
    "solution": "$a_1=S_1=1^2+3\\cdot1-2=2$이다.\n$n\\ge2$일 때 $a_n=S_n-S_{n-1}=(n^2+3n-2)-\\{(n-1)^2+3(n-1)-2\\}=2n+2$이다.\n따라서 $a_2=2\\cdot2+2=6$이고, 첫 항은 따로 계산한다: $\\frac{6}{a_1a_2}=\\frac{6}{2\\cdot6}=\\frac12$.\n$n\\ge2$일 때 $\\frac{6}{a_na_{n+1}}=\\frac{6}{(2n+2)(2n+4)}=\\frac{3}{2(n+1)(n+2)}=\\frac32\\left(\\frac{1}{n+1}-\\frac{1}{n+2}\\right)$이다.\n둘째 항부터 제$N$항까지의 합은 $\\frac32\\left(\\frac13-\\frac{1}{N+2}\\right)$이다.\n$N\\to\\infty$일 때 이 합은 $\\frac32\\cdot\\frac13=\\frac12$로 수렴한다.\n전체 합은 $\\frac12+\\frac12=1$이다.\n주의: $a_1=2$는 일반항 $2n+2$에 $n=1$을 대입한 $4$와 다르므로 첫 항을 분리해야 한다.\n따라서 정답은 ③이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-062",
    "problemTypeKey": "PT_CALCULUS_SERIES",
    "templateKey": "TPL_CALCULUS_SERIES_PARTIAL_SUM",
    "crossConceptKeys": [
      "CC_TELESCOPING_SERIES"
    ],
    "conditionKeys": [],
    "integrationPattern": "CASE_BRANCH"
  }
];
