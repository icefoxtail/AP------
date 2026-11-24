window.examTitle = "미적분II_062_등비급수와순환소수_고2_유형은행1";

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
    "content": "첫째항이 $0.\\overline{4}$이고 공비가 $0.\\overline{3}$인 등비수열 $\\{a_n\\}$에 대하여 $\\sum_{n=2}^{\\infty}a_n$의 값은?",
    "choices": [
      "$\\frac{1}{9}$",
      "$\\frac{1}{6}$",
      "$\\frac{5}{27}$",
      "$\\frac{1}{5}$",
      "$\\frac{2}{9}$"
    ],
    "answer": "⑤",
    "solution": "순환소수를 분수로 나타내면 $0.\\overline{4}=\\frac{4}{9}$, $0.\\overline{3}=\\frac{1}{3}$이다.\n첫째항과 공비를 확인하면 $a_1=\\frac{4}{9}$, $r=\\frac{1}{3}$이다.\n둘째항부터의 합이므로 첫째항은 $a_2=a_1r=\\frac{4}{9}\\cdot\\frac{1}{3}=\\frac{4}{27}$이다.\n등비급수의 합 공식 $\\sum_{n=1}^{\\infty}ar^{n-1}=\\frac{a}{1-r}$을 $a=a_2$, $r=\\frac13$에 적용하면 $\\sum_{n=2}^{\\infty}a_n=\\frac{4/27}{1-1/3}$이다.\n분모를 계산하면 $1-\\frac13=\\frac23$이므로 $\\frac{4}{27}\\div\\frac23=\\frac{4}{27}\\cdot\\frac32=\\frac{2}{9}$이다.\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "B12",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-065",
    "problemTypeKey": "PT_CALCULUS_SERIES",
    "templateKey": "TPL_CALCULUS_SERIES_GEOMETRIC_APPLICATION",
    "crossConceptKeys": [],
    "conditionKeys": [],
    "integrationPattern": "REINTERPRETATION"
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
    "content": "순환소수 $0.\\overline{45}$의 소수점 아래 $n$번째 자리의 숫자를 $a_n$이라 할 때, $\\sum_{n=1}^{\\infty}\\frac{a_n}{3^n}$의 값은?",
    "choices": [
      "$\\frac{13}{8}$",
      "$\\frac74$",
      "$\\frac{15}{8}$",
      "$\\frac{33}{16}$",
      "$\\frac{17}{8}$"
    ],
    "answer": "⑤",
    "solution": "$0.\\overline{45}$의 소수점 아래 숫자는 $4,5,4,5,\\ldots$이므로 홀수 번째는 $4$, 짝수 번째는 $5$이다.\n두 항씩 묶으면 $k$번째 묶음은 $\\frac{4}{3^{2k-1}}+\\frac{5}{3^{2k}}$이다.\n통분하면 $\\frac{4\\cdot3+5}{3^{2k}}=\\frac{17}{3^{2k}}$이고, 첫 묶음은 $\\frac{17}{3^2}=\\frac{17}{9}$이다.\n각 묶음의 공비는 $\\frac{1}{3^2}=\\frac{1}{9}$이므로 등비급수의 합 공식에 의해 합은 $\\frac{17/9}{1-1/9}$이다.\n분모를 계산하면 $1-\\frac19=\\frac89$이므로 $\\frac{17}{9}\\cdot\\frac{9}{8}=\\frac{17}{8}$이다.\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-065",
    "problemTypeKey": "PT_CALCULUS_SERIES",
    "templateKey": "TPL_CALCULUS_SERIES_GEOMETRIC_APPLICATION",
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
    "content": "$\\frac{52}{99}$를 소수로 나타낼 때 소수점 아래 $n$번째 자리의 숫자를 $a_n$이라 하자. $\\sum_{n=1}^{\\infty}\\frac{a_n}{7^n}=\\frac pq$일 때, 서로소인 자연수 $p,q$에 대하여 $p+q$의 값은?",
    "choices": [
      "$73$",
      "$79$",
      "$83$",
      "$85$",
      "$91$"
    ],
    "answer": "④",
    "solution": "$\\frac{52}{99}=0.\\overline{52}$이므로 소수점 아래 숫자는 $5,2,5,2,\\ldots$이다.\n두 항씩 묶으면 $k$번째 묶음은 $\\frac{5}{7^{2k-1}}+\\frac{2}{7^{2k}}$이다.\n통분하면 $\\frac{5\\cdot7+2}{7^{2k}}=\\frac{37}{7^{2k}}$이고, 첫 묶음은 $\\frac{37}{7^2}=\\frac{37}{49}$이다.\n각 묶음의 공비는 $\\frac{1}{7^2}=\\frac{1}{49}$이므로 등비급수의 합은 $\\frac{37/49}{1-1/49}$이다.\n분모를 계산하면 $1-\\frac1{49}=\\frac{48}{49}$이므로 합은 $\\frac{37}{49}\\cdot\\frac{49}{48}=\\frac{37}{48}$이다.\n$p=37$, $q=48$은 서로소이므로 $p+q=37+48=85$이다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-065",
    "problemTypeKey": "PT_CALCULUS_SERIES",
    "templateKey": "TPL_CALCULUS_SERIES_GEOMETRIC_APPLICATION",
    "crossConceptKeys": [
      "CC_PERIODIC_FUNCTION"
    ],
    "conditionKeys": [
      "COND_NATURAL_NUMBER"
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
    "content": "$\\frac{5}{33}$의 소수점 아래 $n$번째 자리의 숫자를 $a_n$이라 하자. $\\sum_{n=1}^{\\infty}\\frac{a_n}{4^n}$의 값은?",
    "choices": [
      "$\\frac{7}{20}$",
      "$\\frac35$",
      "$\\frac{13}{20}$",
      "$\\frac{7}{10}$",
      "$\\frac34$"
    ],
    "answer": "②",
    "solution": "$\\frac{5}{33}=\\frac{15}{99}=0.\\overline{15}$이므로 소수점 아래 숫자는 $1,5,1,5,\\ldots$이다.\n두 항씩 묶으면 $k$번째 묶음은 $\\frac{1}{4^{2k-1}}+\\frac{5}{4^{2k}}$이다.\n통분하면 $\\frac{1\\cdot4+5}{4^{2k}}=\\frac{9}{4^{2k}}$이고, 첫 묶음은 $\\frac{9}{4^2}=\\frac{9}{16}$이다.\n각 묶음의 공비는 $\\frac{1}{4^2}=\\frac{1}{16}$이므로 등비급수의 합은 $\\frac{9/16}{1-1/16}$이다.\n분모를 계산하면 $1-\\frac1{16}=\\frac{15}{16}$이므로 합은 $\\frac{9}{16}\\cdot\\frac{16}{15}=\\frac{3}{5}$이다.\n따라서 정답은 ②이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "B12",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-065",
    "problemTypeKey": "PT_CALCULUS_SERIES",
    "templateKey": "TPL_CALCULUS_SERIES_GEOMETRIC_APPLICATION",
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
    "content": "순환소수 $0.\\overline{246}$의 소수점 아래 $n$번째 자리의 숫자를 $a_n$이라 할 때 $\\sum_{n=1}^{\\infty}\\frac{a_n}{3^n}$의 값은?",
    "choices": [
      "$\\frac{18}{13}$",
      "$\\frac{19}{13}$",
      "$\\frac{20}{13}$",
      "$\\frac{21}{13}$",
      "$\\frac{22}{13}$"
    ],
    "answer": "①",
    "solution": "$0.\\overline{246}$의 소수점 아래 숫자는 $2,4,6,2,4,6,\\ldots$이므로 세 항씩 묶는다.\n$k$번째 묶음은 $\\frac{2}{3^{3k-2}}+\\frac{4}{3^{3k-1}}+\\frac{6}{3^{3k}}$이다.\n통분하면 $\\frac{2\\cdot3^2+4\\cdot3+6}{3^{3k}}=\\frac{18+12+6}{3^{3k}}=\\frac{36}{3^{3k}}$이고, 첫 묶음은 $\\frac{36}{3^3}=\\frac{36}{27}=\\frac43$이다.\n각 묶음의 공비는 $\\frac{1}{3^3}=\\frac{1}{27}$이므로 등비급수의 합은 $\\frac{4/3}{1-1/27}$이다.\n분모를 계산하면 $1-\\frac1{27}=\\frac{26}{27}$이므로 합은 $\\frac43\\cdot\\frac{27}{26}=\\frac{36}{26}=\\frac{18}{13}$이다.\n따라서 정답은 ①이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-065",
    "problemTypeKey": "PT_CALCULUS_SERIES",
    "templateKey": "TPL_CALCULUS_SERIES_GEOMETRIC_APPLICATION",
    "crossConceptKeys": [
      "CC_PERIODIC_FUNCTION"
    ],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
  }
];
