window.examTitle = "미적분II_056_Σaₙ²Σaₙ³의값구하기_고2_유형은행1";

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
    "content": "첫째항이 $3$인 등비수열 $\\{a_n\\}$에서 $\\sum_{n=1}^{\\infty} a_n=9$일 때 $\\sum_{n=1}^{\\infty} a_n^2$의 합은?",
    "choices": [
      "$12$",
      "$14$",
      "$15$",
      "$\\frac{81}{5}$",
      "$17$"
    ],
    "answer": "④",
    "solution": "등비급수의 합 공식: $\\sum_{n=1}^{\\infty}a_n=\\frac{3}{1-r}=9$이다.\n분모를 정리하면 $1-r=\\frac{1}{3}$이므로 $r=\\frac{2}{3}$이다.\n등비급수의 제곱합 공식: $\\sum_{n=1}^{\\infty}a_n^2=\\frac{a_1^2}{1-r^2}=\\frac{9}{1-\\frac{4}{9}}$이다.\n분모를 계산하면 $1-\\frac{4}{9}=\\frac{5}{9}$이므로 $\\frac{9}{\\frac{5}{9}}=9\\cdot\\frac{9}{5}=\\frac{81}{5}$이다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-064",
    "problemTypeKey": "PT_CALCULUS_SERIES",
    "templateKey": "TPL_CALCULUS_SERIES_GEOMETRIC_SUM",
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
    "content": "등비수열 $\\{a_n\\}$에 대해 $\\sum_{n=1}^{\\infty} a_n=9$, $\\sum_{n=1}^{\\infty} a_{2n}=3$일 때 $\\sum_{n=1}^{\\infty} a_n^2$의 합은?",
    "choices": [
      "$15$",
      "$18$",
      "$21$",
      "$24$",
      "$27$"
    ],
    "answer": "⑤",
    "solution": "전체 합을 홀수 번째 항의 합 $S_o$와 짝수 번째 항의 합 $S_e$로 나누면 $S_o+S_e=9$이다.\n짝수 번째 항의 합이 $S_e=3$이므로 $S_o=9-3=6$이다.\n등비수열의 성질: $S_e=rS_o$이므로 $3=6r$에서 $r=\\frac{1}{2}$이다.\n첫째항은 등비급수 합 공식 $\\frac{a_1}{1-r}=9$에서 $a_1=9\\left(1-\\frac{1}{2}\\right)=\\frac{9}{2}$이다.\n제곱합 공식: $\\sum a_n^2=\\frac{a_1^2}{1-r^2}=\\frac{\\frac{81}{4}}{1-\\frac{1}{4}}=\\frac{\\frac{81}{4}}{\\frac{3}{4}}$이다.\n약분하면 $\\frac{81}{4}\\cdot\\frac{4}{3}=27$이다.\n따라서 정답은 ⑤이다.",
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
    "content": "등비수열 $\\{a_n\\}$에서 $\\sum_{n=1}^{\\infty} a_n=8$, $\\sum_{n=1}^{\\infty} a_n^2=16$일 때 $\\sum_{n=1}^{\\infty} (-1)^{n-1}a_n$의 합은?",
    "choices": [
      "$2$",
      "$3$",
      "$4$",
      "$5$",
      "$6$"
    ],
    "answer": "①",
    "solution": "등비급수의 합 공식을 쓰면 $\\frac{a_1}{1-r}=8$이다.\n제곱합 공식: $\\sum a_n^2=\\frac{a_1^2}{1-r^2}=16$이다.\n이를 $\\left(\\frac{a_1}{1-r}\\right)\\left(\\frac{a_1}{1+r}\\right)=16$으로 인수분해하면 $8\\cdot\\frac{a_1}{1+r}=16$이다.\n따라서 $\\frac{a_1}{1+r}=2$이다.\n교대급수 $\\sum(-1)^{n-1}a_n=a_1-a_1r+a_1r^2-\\cdots$의 합은 $\\frac{a_1}{1+r}$이다.\n그 값은 위에서 구한 $2$와 같다.\n따라서 정답은 ①이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-064",
    "problemTypeKey": "PT_CALCULUS_SERIES",
    "templateKey": "TPL_CALCULUS_SERIES_GEOMETRIC_SUM",
    "crossConceptKeys": [],
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
    "content": "등비수열 $\\{a_n\\}$에서 $\\sum_{n=1}^{\\infty} a_n=12$, $\\sum_{n=1}^{\\infty} a_{2n-1}=9$일 때 $a_2$는?",
    "choices": [
      "$2$",
      "$\\frac{8}{3}$",
      "$3$",
      "$\\frac{10}{3}$",
      "$4$"
    ],
    "answer": "②",
    "solution": "전체 합에서 홀수 번째 항의 합을 빼면 짝수 번째 항의 합은 $12-9=3$이다.\n등비수열의 성질: 짝수 번째 항의 합 $=r\\times$(홀수 번째 항의 합)이므로 $3=9r$에서 $r=\\frac{1}{3}$이다.\n등비급수 합 공식: $\\frac{a_1}{1-r}=12$이므로 $a_1=12\\left(1-\\frac{1}{3}\\right)=12\\cdot\\frac{2}{3}=8$이다.\n따라서 $a_2=a_1r=8\\cdot\\frac{1}{3}=\\frac{8}{3}$이다.\n따라서 정답은 ②이다.",
    "difficultyBucket": 4,
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
    "content": "등비수열 $\\{a_n\\}$에 대해 $\\sum_{n=1}^{\\infty} a_n=3$, $\\sum_{n=1}^{\\infty} a_n^2=18$일 때 $\\sum_{n=1}^{\\infty} a_n^3$의 합은?",
    "choices": [
      "$60$",
      "$\\frac{432}{7}$",
      "$64$",
      "$66$",
      "$68$"
    ],
    "answer": "②",
    "solution": "등비급수 합 공식: $S=\\frac{a_1}{1-r}=3$이다.\n제곱합 공식: $\\sum a_n^2=\\frac{a_1^2}{1-r^2}=18$이다.\n$\\frac{a_1^2}{1-r^2}=S^2\\cdot\\frac{1-r}{1+r}$이므로 $18=3^2\\cdot\\frac{1-r}{1+r}=9\\cdot\\frac{1-r}{1+r}$이다.\n양변을 $9$로 나누면 $2=\\frac{1-r}{1+r}$이다.\n분모를 곱하면 $2(1+r)=1-r$에서 $2+2r=1-r$이다.\n정리하면 $3r=-1$이므로 $r=-\\frac{1}{3}$이다.\n첫째항은 $a_1=S(1-r)=3\\left(1+\\frac{1}{3}\\right)=3\\cdot\\frac{4}{3}=4$이다.\n세제곱합 공식: $\\sum a_n^3=\\frac{a_1^3}{1-r^3}=\\frac{64}{1-\\left(-\\frac{1}{3}\\right)^3}$이다.\n$1-\\left(-\\frac{1}{3}\\right)^3=1+\\frac{1}{27}=\\frac{28}{27}$이다.\n따라서 $\\frac{64}{\\frac{28}{27}}=64\\cdot\\frac{27}{28}=\\frac{432}{7}$이다.\n따라서 정답은 ②이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-064",
    "problemTypeKey": "PT_CALCULUS_SERIES",
    "templateKey": "TPL_CALCULUS_SERIES_GEOMETRIC_SUM",
    "crossConceptKeys": [],
    "conditionKeys": [],
    "integrationPattern": "INTERDEPENDENT"
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
    "content": "등비급수 $\\sum_{n=1}^{\\infty} a_n$에 대해 $\\sum_{n=1}^{\\infty} a_n=\\sum_{n=1}^{\\infty} a_n^2=2$일 때 $\\sum_{n=1}^{\\infty} (3a_n+a_n^3)$의 합은?",
    "choices": [
      "$7$",
      "$\\frac{15}{2}$",
      "$\\frac{110}{13}$",
      "$\\frac{35}{4}$",
      "$9$"
    ],
    "answer": "③",
    "solution": "등비급수 합 공식: $S=\\frac{a_1}{1-r}=2$이다.\n제곱합 공식: $\\sum a_n^2=\\frac{a_1^2}{1-r^2}=2$이다.\n$\\frac{a_1^2}{1-r^2}=S^2\\cdot\\frac{1-r}{1+r}$이므로 $2=2^2\\cdot\\frac{1-r}{1+r}=4\\cdot\\frac{1-r}{1+r}$이다.\n양변을 $4$로 나누면 $\\frac{1}{2}=\\frac{1-r}{1+r}$이다.\n분모를 곱하면 $1+r=2(1-r)=2-2r$에서 $3r=1$이므로 $r=\\frac{1}{3}$이다.\n첫째항은 $a_1=S(1-r)=2\\left(1-\\frac{1}{3}\\right)=2\\cdot\\frac{2}{3}=\\frac{4}{3}$이다.\n세제곱합 공식: $\\sum a_n^3=\\frac{a_1^3}{1-r^3}=\\frac{\\left(\\frac{4}{3}\\right)^3}{1-\\left(\\frac{1}{3}\\right)^3}$이다.\n분자를 계산하면 $\\left(\\frac{4}{3}\\right)^3=\\frac{64}{27}$이고, 분모는 $1-\\frac{1}{27}=\\frac{26}{27}$이다.\n따라서 세제곱합은 $\\frac{64}{27}\\cdot\\frac{27}{26}=\\frac{64}{26}=\\frac{32}{13}$이다.\n구하는 합은 $\\sum(3a_n+a_n^3)=3\\sum a_n+\\sum a_n^3=3\\cdot2+\\frac{32}{13}$이다.\n계산하면 $6+\\frac{32}{13}=\\frac{78}{13}+\\frac{32}{13}=\\frac{110}{13}$이다.\n따라서 정답은 ③이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-064",
    "problemTypeKey": "PT_CALCULUS_SERIES",
    "templateKey": "TPL_CALCULUS_SERIES_GEOMETRIC_SUM",
    "crossConceptKeys": [],
    "conditionKeys": [],
    "integrationPattern": "INTERDEPENDENT"
  }
];
