window.examTitle = "미적분II_036_급수가수렴할때급수계산_고2_유형은행1";

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
    "content": "급수 $\\sum_{n=1}^\\infty\\frac{an^2+12}{n^2+3n}$이 수렴할 때, 이 급수의 합은?",
    "choices": [
      "$\\frac{10}3$",
      "$\\frac{13}3$",
      "$\\frac{16}3$",
      "$\\frac{19}3$",
      "$\\frac{22}3$"
    ],
    "answer": "⑤",
    "solution": "급수가 수렴하면 일반항의 극한이 $0$이어야 한다(급수 수렴의 필요조건).\n$\\lim_{n\\to\\infty}\\frac{an^2+12}{n^2+3n}=\\lim_{n\\to\\infty}\\frac{a+\\frac{12}{n^2}}{1+\\frac{3}{n}}=a$이므로 $a=0$이다.\n$a=0$을 대입하면 일반항은 $\\frac{12}{n^2+3n}=\\frac{12}{n(n+3)}$이다.\n부분분수 분해 $\\frac{12}{n(n+3)}=4\\left(\\frac{1}{n}-\\frac{1}{n+3}\\right)$를 이용한다.\n제$N$항까지의 부분합을 망원급수로 정리하면\n$$S_N=4\\sum_{n=1}^{N}\\left(\\frac{1}{n}-\\frac{1}{n+3}\\right)=4\\left(1+\\frac{1}{2}+\\frac{1}{3}-\\frac{1}{N+1}-\\frac{1}{N+2}-\\frac{1}{N+3}\\right)$$\n이다.\n$N\\to\\infty$일 때 $\\frac{1}{N+1},\\frac{1}{N+2},\\frac{1}{N+3}\\to0$이므로\n$$\\lim_{N\\to\\infty}S_N=4\\left(1+\\frac{1}{2}+\\frac{1}{3}\\right)=4\\cdot\\frac{11}{6}=\\frac{22}{3}$$\n이다.\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-066",
    "problemTypeKey": "PT_CALCULUS_SERIES",
    "templateKey": "TPL_CALCULUS_SERIES_PARTIAL_SUM",
    "crossConceptKeys": [
      "CC_SERIES_SUM",
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
    "content": "급수 $\\sum_{n=1}^\\infty\\frac{an^2+30}{(5n-2)(5n+3)}$이 수렴할 때, 이 급수의 합은?",
    "choices": [
      "$1$",
      "$1.25$",
      "$1.5$",
      "$1.75$",
      "$2$"
    ],
    "answer": "⑤",
    "solution": "급수가 수렴하면 일반항의 극한이 $0$이어야 한다(급수 수렴의 필요조건).\n분모를 전개하면 $(5n-2)(5n+3)=25n^2+5n-6$이다.\n$\\lim_{n\\to\\infty}\\frac{an^2+30}{25n^2+5n-6}=\\lim_{n\\to\\infty}\\frac{a+\\frac{30}{n^2}}{25+\\frac{5}{n}-\\frac{6}{n^2}}=\\frac{a}{25}$이므로 $a=0$이다.\n$a=0$을 대입하면 일반항은 $\\frac{30}{(5n-2)(5n+3)}$이다.\n부분분수 분해를 위해 $\\frac{30}{(5n-2)(5n+3)}=\\frac{A}{5n-2}+\\frac{B}{5n+3}$으로 놓으면 $30=A(5n+3)+B(5n-2)$이다.\n양변의 계수를 비교하면 $5(A+B)=0$, $3A-2B=30$이므로 $A=6$, $B=-6$이다.\n따라서 일반항은 $6\\left(\\frac{1}{5n-2}-\\frac{1}{5n+3}\\right)$이고, 제$N$항까지의 부분합은\n$$S_N=6\\left[\\left(\\frac{1}{3}+\\frac{1}{8}+\\cdots+\\frac{1}{5N-2}\\right)-\\left(\\frac{1}{8}+\\cdots+\\frac{1}{5N-2}+\\frac{1}{5N+3}\\right)\\right]=6\\left(\\frac{1}{3}-\\frac{1}{5N+3}\\right)$$\n이다.\n$N\\to\\infty$일 때 $\\frac{1}{5N+3}\\to0$이므로 $\\lim_{N\\to\\infty}S_N=6\\cdot\\frac{1}{3}=2$이다.\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-066",
    "problemTypeKey": "PT_CALCULUS_SERIES",
    "templateKey": "TPL_CALCULUS_SERIES_PARTIAL_SUM",
    "crossConceptKeys": [
      "CC_SERIES_SUM",
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
    "content": "급수 $\\sum_{n=1}^\\infty\\frac{an^2+8}{16n^2+8n-3}$이 수렴할 때, 이 급수의 합은?",
    "choices": [
      "$\\frac13$",
      "$\\frac23$",
      "$\\frac43$",
      "$\\frac53$",
      "$\\frac73$"
    ],
    "answer": "②",
    "solution": "급수가 수렴하면 일반항의 극한이 $0$이어야 한다(급수 수렴의 필요조건).\n분모를 인수분해하면 $16n^2+8n-3=(4n-1)(4n+3)$이다.\n$\\lim_{n\\to\\infty}\\frac{an^2+8}{16n^2+8n-3}=\\lim_{n\\to\\infty}\\frac{a+\\frac{8}{n^2}}{16+\\frac{8}{n}-\\frac{3}{n^2}}=\\frac{a}{16}$이므로 $a=0$이다.\n$a=0$을 대입하면 일반항은 $\\frac{8}{(4n-1)(4n+3)}$이다.\n$\\frac{8}{(4n-1)(4n+3)}=\\frac{A}{4n-1}+\\frac{B}{4n+3}$으로 놓으면 $8=A(4n+3)+B(4n-1)$이다.\n계수를 비교하면 $4(A+B)=0$, $3A-B=8$이므로 $A=2$, $B=-2$이다.\n따라서 일반항은 $2\\left(\\frac{1}{4n-1}-\\frac{1}{4n+3}\\right)$이고, 제$N$항까지의 부분합은\n$$S_N=2\\left[\\left(\\frac{1}{3}+\\frac{1}{7}+\\cdots+\\frac{1}{4N-1}\\right)-\\left(\\frac{1}{7}+\\cdots+\\frac{1}{4N-1}+\\frac{1}{4N+3}\\right)\\right]=2\\left(\\frac{1}{3}-\\frac{1}{4N+3}\\right)$$\n이다.\n$N\\to\\infty$일 때 $\\frac{1}{4N+3}\\to0$이므로 $\\lim_{N\\to\\infty}S_N=2\\cdot\\frac{1}{3}=\\frac{2}{3}$이다.\n따라서 정답은 ②이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-066",
    "problemTypeKey": "PT_CALCULUS_SERIES",
    "templateKey": "TPL_CALCULUS_SERIES_PARTIAL_SUM",
    "crossConceptKeys": [
      "CC_SERIES_SUM",
      "CC_TELESCOPING_SERIES"
    ],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
  }
];
