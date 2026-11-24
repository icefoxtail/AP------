window.examTitle = "미적분II_060_공비가보이지않을때등비급수의합_고2_유형은행1";

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
    "content": "급수 $\\sum_{n=1}^{\\infty} (\\frac{2+2(-1)^n}{5})^n$의 합은?",
    "choices": [
      "$\\frac{4}{5}$",
      "$1$",
      "$\\frac{5}{4}$",
      "$\\frac{3}{2}$",
      "$\\frac{16}{9}$"
    ],
    "answer": "⑤",
    "solution": "$n$이 홀수이면 $(-1)^n=-1$이므로 항은 $\\left(\\frac{2-2}{5}\\right)^n=0^n=0$이다. (홀수 항은 모두 $0$)\n$n=2k$이면 $(-1)^{2k}=1$이므로 항은 $\\left(\\frac{2+2}{5}\\right)^{2k}=\\left(\\frac{4}{5}\\right)^{2k}=\\left(\\frac{16}{25}\\right)^{k}$이다. (지수법칙)\n따라서 주어진 급수는 첫째항 $\\frac{16}{25}$, 공비 $\\frac{16}{25}$인 등비급수이다. (등비급수의 합)\n$\\left|\\frac{16}{25}\\right|<1$이므로 합은 $\\frac{16/25}{1-16/25}=\\frac{16/25}{9/25}=\\frac{16}{9}$이다.\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-064",
    "problemTypeKey": "PT_CALCULUS_SERIES",
    "templateKey": "TPL_CALCULUS_SERIES_GEOMETRIC_SUM",
    "crossConceptKeys": [],
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
    "content": "수열 $\\{a_n\\}$이 $1,0,3$을 이 순서로 반복할 때 $\\sum_{n=1}^{\\infty} \\frac{a_n}{3^n}$의 합은?",
    "choices": [
      "$\\frac{1}{3}$",
      "$\\frac{2}{5}$",
      "$\\frac{6}{13}$",
      "$\\frac{1}{2}$",
      "$\\frac{2}{3}$"
    ],
    "answer": "③",
    "solution": "$a_n$은 $1,0,3$을 주기 $3$으로 반복한다. (수열의 주기성)\n세 항씩 묶으면 $k$번째 묶음은 $\\frac{1}{3^{3k-2}}+\\frac{0}{3^{3k-1}}+\\frac{3}{3^{3k}}$이다.\n$=\\frac{1}{3}\\cdot\\frac{1}{27^{k-1}}+0+\\frac{3}{27}\\cdot\\frac{1}{27^{k-1}}=\\left(\\frac{1}{3}+\\frac{1}{9}\\right)\\left(\\frac{1}{27}\\right)^{k-1}=\\frac{4}{9}\\left(\\frac{1}{27}\\right)^{k-1}$이다. (등비수열의 일반항)\n즉 첫째항 $\\frac{4}{9}$, 공비 $\\frac{1}{27}$인 등비급수이다. (등비급수의 합)\n합은 $\\frac{4/9}{1-1/27}=\\frac{4/9}{26/27}=\\frac{4}{9}\\cdot\\frac{27}{26}=\\frac{12}{26}=\\frac{6}{13}$이다.\n따라서 정답은 ③이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-064",
    "problemTypeKey": "PT_CALCULUS_SERIES",
    "templateKey": "TPL_CALCULUS_SERIES_GEOMETRIC_SUM",
    "crossConceptKeys": [
      "CC_PERIODIC_FUNCTION"
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
    "content": "$5^n$을 $3$으로 나눈 나머지가 $a_n$일 때 $\\sum_{n=1}^{\\infty} \\frac{a_{2n}}{4^n}$의 합은?",
    "choices": [
      "$\\frac{1}{8}$",
      "$\\frac{1}{6}$",
      "$\\frac{1}{5}$",
      "$\\frac{1}{4}$",
      "$\\frac{1}{3}$"
    ],
    "answer": "⑤",
    "solution": "$5\\equiv-1\\pmod 3$이므로 $5^n\\equiv(-1)^n\\pmod 3$이다. (합동식의 성질)\n$n$이 짝수이면 $(-1)^n=1$이므로 $a_{2n}=1$이다. (나머지는 $0,1,2$ 중 $1$)\n따라서 $\\sum_{n=1}^{\\infty}\\frac{a_{2n}}{4^n}=\\sum_{n=1}^{\\infty}\\left(\\frac{1}{4}\\right)^{n}$이다.\n첫째항 $\\frac{1}{4}$, 공비 $\\frac{1}{4}$인 등비급수이므로 합은 $\\frac{1/4}{1-1/4}=\\frac{1/4}{3/4}=\\frac{1}{3}$이다. (등비급수의 합)\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-064",
    "problemTypeKey": "PT_CALCULUS_SERIES",
    "templateKey": "TPL_CALCULUS_SERIES_GEOMETRIC_SUM",
    "crossConceptKeys": [],
    "conditionKeys": [
      "COND_DIVISIBILITY"
    ],
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
    "content": "$7^n$의 일의 자리 숫자를 $a_n$이라 할 때 $\\sum_{n=1}^{\\infty} \\frac{a_n}{2^n}$의 합은?",
    "choices": [
      "$5$",
      "$\\frac{11}{2}$",
      "$6$",
      "$\\frac{33}{5}$",
      "$7$"
    ],
    "answer": "④",
    "solution": "$7^1,7^2,7^3,7^4$의 일의 자리 숫자는 $7,9,3,1$이고 이후 주기 $4$로 반복된다. (일의 자리 숫자의 주기성)\n네 항씩 묶으면 $k$번째 묶음은 $\\frac{7}{2^{4k-3}}+\\frac{9}{2^{4k-2}}+\\frac{3}{2^{4k-1}}+\\frac{1}{2^{4k}}$이다.\n$=\\frac{1}{16^{k-1}}\\left(\\frac{7}{2}+\\frac{9}{4}+\\frac{3}{8}+\\frac{1}{16}\\right)=\\frac{1}{16^{k-1}}\\cdot\\frac{56+36+6+1}{16}=\\frac{99}{16}\\left(\\frac{1}{16}\\right)^{k-1}$이다. (통분)\n즉 첫째항 $\\frac{99}{16}$, 공비 $\\frac{1}{16}$인 등비급수이다. (등비급수의 합)\n합은 $\\frac{99/16}{1-1/16}=\\frac{99/16}{15/16}=\\frac{99}{15}=\\frac{33}{5}$이다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-064",
    "problemTypeKey": "PT_CALCULUS_SERIES",
    "templateKey": "TPL_CALCULUS_SERIES_GEOMETRIC_SUM",
    "crossConceptKeys": [
      "CC_PERIODIC_FUNCTION"
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
    "content": "$a_1=1$, $a_{n+1}=3a_n$이고 $b_n$은 $a_n$을 $4$로 나눈 나머지이다. $\\sum_{n=1}^{\\infty} \\frac{b_n}{4^n}$의 합은?",
    "choices": [
      "$\\frac{2}{5}$",
      "$\\frac{7}{15}$",
      "$\\frac{1}{2}$",
      "$\\frac{8}{15}$",
      "$\\frac{3}{5}$"
    ],
    "answer": "②",
    "solution": "$a_1=1$, $a_{n+1}=3a_n$이므로 $a_n=3^{n-1}$이다. (등비수열의 일반항)\n$3\\equiv-1\\pmod 4$이므로 $a_n=3^{n-1}\\equiv(-1)^{n-1}\\pmod 4$이다. (합동식의 성질)\n따라서 $b_n$은 $1,3,1,3,\\cdots$로 주기 $2$이다.\n두 항씩 묶으면 $k$번째 묶음은 $\\frac{1}{4^{2k-1}}+\\frac{3}{4^{2k}}=\\frac{1}{16^{k-1}}\\left(\\frac{1}{4}+\\frac{3}{16}\\right)=\\frac{7}{16}\\left(\\frac{1}{16}\\right)^{k-1}$이다. (등비수열의 일반항)\n첫째항 $\\frac{7}{16}$, 공비 $\\frac{1}{16}$인 등비급수이므로 합은 $\\frac{7/16}{1-1/16}=\\frac{7/16}{15/16}=\\frac{7}{15}$이다. (등비급수의 합)\n따라서 정답은 ②이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-064",
    "problemTypeKey": "PT_CALCULUS_SERIES",
    "templateKey": "TPL_CALCULUS_SERIES_GEOMETRIC_SUM",
    "crossConceptKeys": [
      "CC_GENERAL_TERM"
    ],
    "conditionKeys": [
      "COND_DIVISIBILITY"
    ],
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
    "content": "물통에 물이 $2\\,\\mathrm L$ 들어 있다. 매번 물통에 남은 물의 $1/4$을 비커 A에 옮긴 뒤, 그 직후 물통에 남은 물의 $2/5$를 비커 B에 옮긴다. 이 과정을 무한히 반복할 때 두 비커에 모이는 물의 양의 비 A:B는?",
    "choices": [
      "$2:3$",
      "$5:6$",
      "$1:1$",
      "$6:5$",
      "$3:2$"
    ],
    "answer": "②",
    "solution": "한 회를 시작할 때 물통에 남은 물을 $V$라 하자. (매 회 남은 양의 비율만이 총량의 비를 결정한다)\n비커 A에 옮기는 양은 $\\frac{1}{4}V$이다.\nA에 옮긴 직후 남은 물은 $\\frac{3}{4}V$이므로 B에 옮기는 양은 $\\frac{3}{4}V\\cdot\\frac{2}{5}=\\frac{3}{10}V$이다. (남은 물의 $\\frac{2}{5}$)\n다음 회를 시작할 때 남은 물은 $\\frac{3}{4}V\\cdot\\frac{3}{5}=\\frac{9}{20}V$이므로 매 회 남은 물은 공비 $\\frac{9}{20}$로 줄어든다. (등비수열)\n따라서 A, B에 모이는 총량의 비는 회마다 옮긴 양의 비와 같다. (등비급수의 합의 비)\n$\\frac{1}{4}:\\frac{3}{10}=5:6$이다. (분모 $20$으로 통분)\n따라서 정답은 ②이다.",
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
  }
];
