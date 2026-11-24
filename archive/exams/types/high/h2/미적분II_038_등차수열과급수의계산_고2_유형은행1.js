window.examTitle = "미적분II_038_등차수열과급수의계산_고2_유형은행1";

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
    "content": "등차수열 $\\{a_n\\}$에서 $a_1=6$, $a_5-a_2=9$일 때, $\\sum_{n=1}^{\\infty}\\frac{9}{na_n}$의 값은?",
    "choices": [
      "$2$",
      "$3$",
      "$4$",
      "$5$",
      "$6$"
    ],
    "answer": "②",
    "solution": "공차를 $d$라 하면 $a_5-a_2=(a_1+4d)-(a_1+d)=3d=9$이므로 $d=3$이다.\n일반항은 $a_n=6+3(n-1)=3(n+1)$이다.\n따라서 $\\frac{9}{na_n}=\\frac{9}{n\\cdot 3(n+1)}=\\frac{3}{n(n+1)}=3\\left(\\frac1n-\\frac1{n+1}\\right)$이다.\n부분합은 $\\sum_{n=1}^{N}3\\left(\\frac1n-\\frac1{n+1}\\right)=3\\left(1-\\frac1{N+1}\\right)$로 정리된다.\n$N\\to\\infty$일 때 $\\frac1{N+1}\\to 0$이므로 급수의 합은 $3$이다.\n따라서 정답은 ②이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-066",
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
    "content": "등차수열 $\\{a_n\\}$에서 $a_1=3$, $a_3+a_5=18$일 때, $\\sum_{n=1}^{\\infty}\\frac{12}{a_na_{n+1}}$의 값은?",
    "choices": [
      "$1$",
      "$1.5$",
      "$2$",
      "$2.5$",
      "$3$"
    ],
    "answer": "③",
    "solution": "공차를 $d$라 하면 $a_3+a_5=(3+2d)+(3+4d)=6+6d=18$이므로 $d=2$이다.\n일반항은 $a_n=3+2(n-1)=2n+1$이다.\n$\\frac{12}{a_na_{n+1}}=\\frac{12}{(2n+1)(2n+3)}$을 부분분수로 분해하면 $\\frac{6}{2n+1}-\\frac{6}{2n+3}$이다.\n실제로 $\\frac{6}{2n+1}-\\frac{6}{2n+3}=\\frac{6(2n+3)-6(2n+1)}{(2n+1)(2n+3)}=\\frac{12}{(2n+1)(2n+3)}$이다.\n부분합은 $\\sum_{n=1}^{N}\\left(\\frac{6}{2n+1}-\\frac{6}{2n+3}\\right)=6\\left(\\frac13-\\frac1{2N+3}\\right)$이다.\n$N\\to\\infty$일 때 $\\frac1{2N+3}\\to 0$이므로 합은 $6\\cdot\\frac13=2$이다.\n따라서 정답은 ③이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-066",
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
    "content": "첫째항이 $9$, 공차가 $6$인 등차수열의 첫째항부터 제$n$항까지의 합이 $S_n$일 때, $\\sum_{n=1}^{\\infty}\\frac{12}{S_n}$의 값은?",
    "choices": [
      "$2$",
      "$2.5$",
      "$3$",
      "$3.5$",
      "$4$"
    ],
    "answer": "③",
    "solution": "등차수열의 합 공식 $S_n=\\frac n2\\{2a_1+(n-1)d\\}$에 $a_1=9$, $d=6$을 대입한다.\n$S_n=\\frac n2\\{18+6(n-1)\\}=\\frac n2(6n+12)=3n(n+2)$이다.\n따라서 $\\frac{12}{S_n}=\\frac{12}{3n(n+2)}=\\frac4{n(n+2)}=2\\left(\\frac1n-\\frac1{n+2}\\right)$이다.\n부분합은 $\\sum_{n=1}^{N}2\\left(\\frac1n-\\frac1{n+2}\\right)=2\\left(1+\\frac12-\\frac1{N+1}-\\frac1{N+2}\\right)$이다.\n$N\\to\\infty$일 때 $\\frac1{N+1}\\to 0$, $\\frac1{N+2}\\to 0$이므로 합은 $2\\cdot\\frac32=3$이다.\n따라서 정답은 ③이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-066",
    "problemTypeKey": "PT_CALCULUS_SERIES",
    "templateKey": "TPL_CALCULUS_SERIES_PARTIAL_SUM",
    "crossConceptKeys": [
      "CC_TELESCOPING_SERIES"
    ],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
  }
];
