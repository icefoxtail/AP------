window.examTitle = "미적분II_041_항의부호가교대로바뀌는급수_고2_유형은행1";

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
    "content": "급수 $3-\\frac{2}{4}+\\frac{2}{4}-\\frac{4}{7}+\\frac{4}{7}-\\frac{6}{10}+\\frac{6}{10}-\\cdots$의 제$n$항까지의 부분합을 $S_n$이라 할 때, $\\lim_{n\\to\\infty}S_{2n-1}-\\lim_{n\\to\\infty}S_{2n}$의 값은?",
    "choices": [
      "$\\frac{2}6$",
      "$\\frac{3}6$",
      "$\\frac{4}6$",
      "$\\frac{5}6$",
      "$\\frac{6}6$"
    ],
    "answer": "③",
    "solution": "급수의 항은 $a_1=3$이고, $k=1,2,3,\\ldots$에 대하여\n$$a_{2k}=-\\frac{2k}{3k+1},\\qquad a_{2k+1}=\\frac{2k}{3k+1}$$\n이다. 따라서 $a_{2k}+a_{2k+1}=0$으로 이웃한 두 항이 한 쌍씩 상쇄된다.\n$S_{2n-1}$은 첫 항 $3$과 $n-1$개의 상쇄되는 쌍의 합이므로 모든 $n$에 대하여\n$$S_{2n-1}=3$$\n이다.\n$S_{2n}$은 $S_{2n-1}$에 $a_{2n}$을 더한 값이므로\n$$S_{2n}=3-\\frac{2n}{3n+1}$$\n이다.\n유리식의 극한 계산에서 분모와 분자를 $n$으로 나누면\n$$\\lim_{n\\to\\infty}\\frac{2n}{3n+1}=\\lim_{n\\to\\infty}\\frac{2}{3+\\frac1n}=\\frac23$$\n이므로 $\\lim_{n\\to\\infty}S_{2n-1}=3$, $\\lim_{n\\to\\infty}S_{2n}=3-\\frac23=\\frac73$이다.\n따라서 $\\lim_{n\\to\\infty}S_{2n-1}-\\lim_{n\\to\\infty}S_{2n}=3-\\frac73=\\frac23$이다.\n따라서 정답은 ③이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
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
    "content": "다음 급수 중 수렴하는 것을 모두 고른 것은?\nㄱ. $2-2+2-2+\\cdots$\nㄴ. $3+(2-2)+(2-2)+\\cdots$ (괄호 하나가 한 항이다.)\nㄷ. $4-\\frac12+\\frac12-\\frac14+\\frac14-\\frac16+\\frac16-\\cdots$",
    "choices": [
      "ㄱ",
      "ㄴ",
      "ㄷ",
      "ㄱ, ㄷ",
      "ㄴ, ㄷ"
    ],
    "answer": "⑤",
    "solution": "ㄱ. 제$n$항까지의 부분합은 $S_n=2$ ($n$이 홀수), $S_n=0$ ($n$이 짝수)이다. 두 부분수열 $S_{2n-1}\\to2$, $S_{2n}\\to0$의 극한이 다르므로 급수는 발산한다.\nㄴ. 괄호 하나를 한 항으로 보면 주어진 급수는 $3+0+0+\\cdots$이다. 모든 부분합이 $3$이므로 $3$으로 수렴한다.\nㄷ. 첫째 항은 $4$이고, 이후에는 $-\\frac1{2n}$과 $+\\frac1{2n}$이 한 쌍씩 나온다. 홀수 번째 부분합은\n$$S_{2n-1}=4$$\n이고, 짝수 번째 부분합은 마지막 음수항까지 더한 값이므로\n$$S_{2n}=4-\\frac1{2n}$$\n이다.\n$\\lim_{n\\to\\infty}S_{2n-1}=4$, $\\lim_{n\\to\\infty}S_{2n}=4$이므로 급수는 $4$로 수렴한다.\n수렴하는 것은 ㄴ, ㄷ이다.\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-066",
    "problemTypeKey": "PT_CALCULUS_SERIES",
    "templateKey": "TPL_CALCULUS_SERIES_PARTIAL_SUM",
    "crossConceptKeys": [],
    "conditionKeys": [],
    "integrationPattern": "CASE_BRANCH"
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
    "content": "다음 급수 중 수렴하는 것을 모두 고른 것은?\nㄱ. $\\sum_{n=1}^\\infty\\frac{3}{\\sqrt{n+3}+\\sqrt{n+2}}$\nㄴ. $\\sum_{n=1}^\\infty\\frac{3}{(n+1)(n+2)}$\nㄷ. $2-\\frac23+\\frac23-\\frac25+\\frac25-\\frac27+\\frac27-\\cdots$",
    "choices": [
      "ㄱ",
      "ㄴ",
      "ㄷ",
      "ㄴ, ㄷ",
      "ㄱ, ㄴ, ㄷ"
    ],
    "answer": "④",
    "solution": "ㄱ. 분모를 유리화하면\n$$\\frac{3}{\\sqrt{n+3}+\\sqrt{n+2}}=\\frac{3(\\sqrt{n+3}-\\sqrt{n+2})}{(n+3)-(n+2)}=3(\\sqrt{n+3}-\\sqrt{n+2})$$\n이다.\n제$N$항까지의 부분합은 텔레스코픽하게 정리되어\n$$S_N=3\\left[(\\sqrt4-\\sqrt3)+(\\sqrt5-\\sqrt4)+\\cdots+(\\sqrt{N+3}-\\sqrt{N+2})\\right]=3(\\sqrt{N+3}-\\sqrt3)$$\n이다.\n$N\\to\\infty$일 때 $\\sqrt{N+3}\\to\\infty$이므로 $S_N\\to\\infty$이고, 급수 ㄱ은 발산한다.\n주의: 일반항은 $0$에 가까워지지만 부분합은 발산한다.\nㄴ. 부분분수 분해에 의해\n$$\\frac{3}{(n+1)(n+2)}=3\\left(\\frac1{n+1}-\\frac1{n+2}\\right)$$\n이다.\n제$N$항까지의 부분합은\n$$S_N=3\\left(\\frac12-\\frac13+\\frac13-\\frac14+\\cdots+\\frac1{N+1}-\\frac1{N+2}\\right)=3\\left(\\frac12-\\frac1{N+2}\\right)$$\n이고, $\\lim_{N\\to\\infty}S_N=3\\cdot\\frac12=\\frac32$이므로 급수 ㄴ은 수렴한다.\nㄷ. 첫째 항은 $2$이고, 이후에는 $-\\frac{2}{2n+1}$과 $+\\frac{2}{2n+1}$이 한 쌍씩 나온다.\n홀수 번째 부분합은\n$$S_{2n-1}=2$$\n이고, 짝수 번째 부분합은\n$$S_{2n}=2-\\frac{2}{2n+1}$$\n이다.\n$\\lim_{n\\to\\infty}S_{2n-1}=2$, $\\lim_{n\\to\\infty}S_{2n}=2-0=2$이므로 급수 ㄷ은 $2$로 수렴한다.\n수렴하는 것은 ㄴ, ㄷ이므로\n따라서 정답은 ④이다.",
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
    "integrationPattern": "CASE_BRANCH"
  }
];
