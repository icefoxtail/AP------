window.examTitle = "미적분II_058_Sₙ과aₙ사이의관계를이용하여등비급수의_고2_유형은행1";

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
    "content": "수열 $\\{a_n\\}$의 부분합이 $S_n=5(1-(\\frac12)^n)$일 때 $\\sum_{n=1}^{\\infty} a_{2n}$의 합은?",
    "choices": [
      "$\\frac{2}{3}$",
      "$1$",
      "$\\frac{4}{3}$",
      "$\\frac{3}{2}$",
      "$\\frac{5}{3}$"
    ],
    "answer": "⑤",
    "solution": "부분합의 성질에서 $a_n=S_n-S_{n-1}$ ($n\\ge2$)이다.\n$S_n-S_{n-1}=5\\left(1-\\left(\\frac12\\right)^n\\right)-5\\left(1-\\left(\\frac12\\right)^{n-1}\\right)=5\\left(\\frac12\\right)^n$이다.\n$S_1=5\\left(1-\\frac12\\right)=\\frac52$이고 $n=1$을 대입한 $5\\left(\\frac12\\right)^1=\\frac52$와 같으므로 모든 자연수 $n$에서 $a_n=5\\left(\\frac12\\right)^n$이다.\n따라서 $a_{2n}=5\\left(\\frac12\\right)^{2n}=5\\left(\\frac14\\right)^n$이다.\n첫째항이 $\\frac54$, 공비가 $\\frac14$인 등비수열의 합이므로 $\\sum_{n=1}^{\\infty}a_{2n}=\\frac{\\frac54}{1-\\frac14}=\\frac{\\frac54}{\\frac34}=\\frac53$이다.\n따라서 정답은 ⑤이다.",
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
    "content": "수열 $\\{a_n\\}$의 부분합 $S_n$이 $\\log_3(S_n+1)=2n$을 만족한다. $\\sum_{n=1}^{\\infty} \\frac1{a_n}=\\frac pq$일 때, 서로소인 자연수 $p,q$의 합은?",
    "choices": [
      "$71$",
      "$72$",
      "$73$",
      "$74$",
      "$75$"
    ],
    "answer": "③",
    "solution": "$\\log_3(S_n+1)=2n$이므로 로그의 정의에서 $S_n+1=3^{2n}=9^n$, 즉 $S_n=9^n-1$이다.\n$n\\ge2$일 때 $a_n=S_n-S_{n-1}=(9^n-1)-(9^{n-1}-1)=9^n-9^{n-1}=8\\cdot9^{n-1}$이다.\n$n=1$일 때 $S_1=9-1=8$이고 $a_1=S_1=8=8\\cdot9^0$이므로 모든 자연수 $n$에서 $a_n=8\\cdot9^{n-1}$이다.\n따라서 $\\frac1{a_n}=\\frac1{8\\cdot9^{n-1}}=\\frac18\\left(\\frac19\\right)^{n-1}$이다.\n첫째항이 $\\frac18$, 공비가 $\\frac19$인 등비급수이고 $\\left|\\frac19\\right|<1$이므로 수렴한다.\n$\\sum_{n=1}^{\\infty}\\frac1{a_n}=\\frac{\\frac18}{1-\\frac19}=\\frac{\\frac18}{\\frac89}=\\frac18\\cdot\\frac98=\\frac9{64}$이다.\n$\\frac9{64}$는 서로소인 자연수 $9$와 $64$의 비이므로 $p=9$, $q=64$이고 $p+q=9+64=73$이다.\n따라서 정답은 ③이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-062",
    "problemTypeKey": "PT_CALCULUS_SERIES",
    "templateKey": "TPL_CALCULUS_SERIES_PARTIAL_SUM",
    "crossConceptKeys": [],
    "conditionKeys": [
      "COND_NATURAL_NUMBER"
    ],
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
    "content": "모든 자연수 $n$에 대해 $a_1+3a_2+\\cdots+3^{n-1}a_n=8n$일 때 $\\sum_{n=1}^{\\infty} a_n$의 합은?",
    "choices": [
      "$4$",
      "$6$",
      "$8$",
      "$10$",
      "$12$"
    ],
    "answer": "⑤",
    "solution": "$T_n=a_1+3a_2+\\cdots+3^{n-1}a_n=8n$이라 하자.\n$n\\ge2$일 때 $T_n-T_{n-1}=(a_1+3a_2+\\cdots+3^{n-1}a_n)-(a_1+3a_2+\\cdots+3^{n-2}a_{n-1})=3^{n-1}a_n$이다.\n한편 $T_n-T_{n-1}=8n-8(n-1)=8$이므로 $3^{n-1}a_n=8$이다.\n따라서 $a_n=\\frac8{3^{n-1}}=8\\left(\\frac13\\right)^{n-1}$이다.\n$n=1$일 때 $T_1=a_1=8$이고 $8\\left(\\frac13\\right)^0=8$이므로 모든 자연수 $n$에서 $a_n=8\\left(\\frac13\\right)^{n-1}$이다.\n첫째항이 $8$, 공비가 $\\frac13$인 등비급수이고 $\\left|\\frac13\\right|<1$이므로 수렴한다.\n$\\sum_{n=1}^{\\infty}a_n=\\frac8{1-\\frac13}=\\frac8{\\frac23}=8\\cdot\\frac32=12$이다.\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-062",
    "problemTypeKey": "PT_CALCULUS_SERIES",
    "templateKey": "TPL_CALCULUS_SERIES_PARTIAL_SUM",
    "crossConceptKeys": [],
    "conditionKeys": [
      "COND_UNIVERSAL_INPUTS"
    ],
    "integrationPattern": "SEQUENTIAL"
  }
];
