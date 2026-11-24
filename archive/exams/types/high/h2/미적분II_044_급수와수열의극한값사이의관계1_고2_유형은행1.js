window.examTitle = "미적분II_044_급수와수열의극한값사이의관계1_고2_유형은행1";

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
    "content": "$\\sum_{n=1}^{\\infty}\\left(3-\\frac{a_n}{n}\\right)=12$일 때, $\\lim_{n\\to\\infty}\\frac{2a_n+4n-1}{a_n+2n+5}$의 값은?",
    "choices": [
      "$1.5$",
      "$2$",
      "$2.5$",
      "$3$",
      "$3.5$"
    ],
    "answer": "②",
    "solution": "급수 $\\sum_{n=1}^{\\infty}\\left(3-\\frac{a_n}{n}\\right)$가 수렴하므로 일반항의 극한은 $0$이다. (급수 수렴의 필요조건)\n$3-\\frac{a_n}{n}\\to0$에서 $\\frac{a_n}{n}\\to3$이다.\n구하는 식의 분자와 분모를 $n$으로 나누면 $$\\frac{2a_n+4n-1}{a_n+2n+5}=\\frac{2\\frac{a_n}{n}+4-\\frac1n}{\\frac{a_n}{n}+2+\\frac5n}.$$\n각 부분의 극한을 대입하면 $\\frac{2\\cdot3+4-0}{3+2+0}=\\frac{10}{5}=2$이다.\n따라서 정답은 ②이다.",
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
    "content": "급수 $\\sum_{n=1}^{\\infty}\\left(a_n-\\frac{7n}{n+2}\\right)$이 수렴할 때, $\\lim_{n\\to\\infty}\\frac{2a_n+1}{a_n-2}$의 값은?",
    "choices": [
      "$1$",
      "$1.5$",
      "$2$",
      "$2.5$",
      "$3$"
    ],
    "answer": "⑤",
    "solution": "급수 $\\sum_{n=1}^{\\infty}\\left(a_n-\\frac{7n}{n+2}\\right)$가 수렴하므로 일반항의 극한은 $0$이다. (급수 수렴의 필요조건)\n$a_n-\\frac{7n}{n+2}\\to0$에서 $a_n\\to\\lim_{n\\to\\infty}\\frac{7n}{n+2}$이다.\n분모를 $n$으로 나누면 $\\frac{7n}{n+2}=\\frac7{1+\\frac2n}\\to7$이므로 $a_n\\to7$이다.\n따라서 구하는 극한은 $\\frac{2\\cdot7+1}{7-2}=\\frac{15}{5}=3$이다.\n따라서 정답은 ⑤이다.",
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
    "content": "$\\sum_{n=1}^{\\infty}(4na_n-3)=2$일 때, $\\lim_{n\\to\\infty}\\frac{4n^2a_n}{2n+3}$의 값은?",
    "choices": [
      "$0.75$",
      "$1$",
      "$1.25$",
      "$1.5$",
      "$1.75$"
    ],
    "answer": "④",
    "solution": "급수 $\\sum_{n=1}^{\\infty}(4na_n-3)$이 수렴하므로 일반항의 극한은 $0$이다. (급수 수렴의 필요조건)\n$4na_n-3\\to0$에서 $4na_n\\to3$이다.\n구하는 식을 $4na_n$이 보이도록 변형하면 $$\\frac{4n^2a_n}{2n+3}=\\frac{4na_n}{2+\\frac3n}.$$\n분모의 극한은 $2+0=2$이므로 $\\frac{3}{2}=1.5$이다.\n따라서 정답은 ④이다.",
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
    "content": "$\\sum_{n=1}^{\\infty}\\left(na_n-\\frac{3n^2+2}{n+4}\\right)=6$일 때, $\\lim_{n\\to\\infty}(a_n^2-a_n+4)$의 값은?",
    "choices": [
      "$8$",
      "$9$",
      "$10$",
      "$11$",
      "$12$"
    ],
    "answer": "③",
    "solution": "급수 $\\sum_{n=1}^{\\infty}\\left(na_n-\\frac{3n^2+2}{n+4}\\right)$가 수렴하므로 일반항의 극한은 $0$이다. (급수 수렴의 필요조건)\n$na_n-\\frac{3n^2+2}{n+4}\\to0$의 양변을 $n$으로 나누면 $a_n-\\frac{3n^2+2}{n(n+4)}\\to0$이다.\n분모를 전개하면 $\\frac{3n^2+2}{n^2+4n}=\\frac{3+\\frac2{n^2}}{1+\\frac4n}\\to3$이다.\n따라서 $a_n\\to3$이다.\n$a_n^2-a_n+4$에 극한값을 대입하면 $3^2-3+4=10$이다.\n따라서 정답은 ③이다.",
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
    "content": "$\\sum_{n=1}^{\\infty}\\frac{a_n}{5^n}=7$일 때, $\\lim_{n\\to\\infty}\\frac{a_n+5^{n+1}-2^n}{5^{n-1}+2^{n+1}}$의 값은?",
    "choices": [
      "$25$",
      "$26$",
      "$27$",
      "$28$",
      "$29$"
    ],
    "answer": "①",
    "solution": "급수 $\\sum_{n=1}^{\\infty}\\frac{a_n}{5^n}$이 수렴하므로 일반항의 극한은 $0$이다. (급수 수렴의 필요조건)\n즉 $\\frac{a_n}{5^n}\\to0$이다.\n구하는 식의 분자와 분모를 $5^n$으로 나누면 $$\\frac{a_n+5^{n+1}-2^n}{5^{n-1}+2^{n+1}}=\\frac{\\frac{a_n}{5^n}+5-\\left(\\frac25\\right)^n}{\\frac15+2\\left(\\frac25\\right)^n}.$$\n$\\left(\\frac25\\right)^n\\to0$이므로 (등비수열의 극한) 극한은 $\\frac{0+5-0}{\\frac15+0}=5\\div\\frac15=25$이다.\n따라서 정답은 ①이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-063",
    "problemTypeKey": "PT_CALCULUS_SERIES",
    "templateKey": "TPL_CALCULUS_SERIES_CONVERGENCE_CONDITION",
    "crossConceptKeys": [
      "CC_SERIES_SUM",
      "CC_GEOMETRIC_SEQUENCE"
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
    "content": "양수 수열 $\\{a_n\\}$이 $\\sum_{n=1}^{\\infty}(3-5^na_n)=4$를 만족할 때, $\\lim_{n\\to\\infty}\\frac{a_n+2\\cdot5^{-n}}{a_n+7^{-n}}$의 값은?",
    "choices": [
      "$\\frac{1}3$",
      "$\\frac{2}3$",
      "$\\frac{3}3$",
      "$\\frac{4}3$",
      "$\\frac{5}3$"
    ],
    "answer": "⑤",
    "solution": "급수 $\\sum_{n=1}^{\\infty}(3-5^na_n)$이 수렴하므로 일반항의 극한은 $0$이다. (급수 수렴의 필요조건)\n$3-5^na_n\\to0$에서 $5^na_n\\to3$이다.\n구하는 식의 분자와 분모에 $5^n$을 곱하면 $$\\frac{a_n+2\\cdot5^{-n}}{a_n+7^{-n}}=\\frac{5^na_n+2}{5^na_n+\\left(\\frac57\\right)^n}.$$\n$\\left(\\frac57\\right)^n\\to0$이므로 (등비수열의 극한) 극한은 $\\frac{3+2}{3+0}=\\frac53$이다.\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-063",
    "problemTypeKey": "PT_CALCULUS_SERIES",
    "templateKey": "TPL_CALCULUS_SERIES_CONVERGENCE_CONDITION",
    "crossConceptKeys": [
      "CC_SERIES_SUM",
      "CC_GEOMETRIC_SEQUENCE"
    ],
    "conditionKeys": [
      "COND_POSITIVE"
    ],
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
    "content": "양수 수열 $\\{a_n\\}$에 대해 급수 $\\sum_{n=1}^{\\infty}\\left(4-\\frac{a_n}{5^n}\\right)$이 수렴할 때, $\\lim_{n\\to\\infty}\\frac{3a_n-5^{n+1}}{a_n+2\\cdot3^n}$의 값은?",
    "choices": [
      "$1.75$",
      "$2$",
      "$2.25$",
      "$2.5$",
      "$2.75$"
    ],
    "answer": "①",
    "solution": "급수 $\\sum_{n=1}^{\\infty}\\left(4-\\frac{a_n}{5^n}\\right)$이 수렴하므로 일반항의 극한은 $0$이다. (급수 수렴의 필요조건)\n$4-\\frac{a_n}{5^n}\\to0$에서 $\\frac{a_n}{5^n}\\to4$이다.\n구하는 식의 분자와 분모를 $5^n$으로 나누면 $$\\frac{3a_n-5^{n+1}}{a_n+2\\cdot3^n}=\\frac{3\\frac{a_n}{5^n}-5}{\\frac{a_n}{5^n}+2\\left(\\frac35\\right)^n}.$$\n$\\left(\\frac35\\right)^n\\to0$이므로 극한은 $\\frac{3\\cdot4-5}{4+0}=\\frac74=1.75$이다.\n따라서 정답은 ①이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-063",
    "problemTypeKey": "PT_CALCULUS_SERIES",
    "templateKey": "TPL_CALCULUS_SERIES_CONVERGENCE_CONDITION",
    "crossConceptKeys": [
      "CC_SERIES_SUM",
      "CC_GEOMETRIC_SEQUENCE"
    ],
    "conditionKeys": [
      "COND_POSITIVE"
    ],
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
    "content": "$\\sum_{n=1}^{\\infty}(3a_n-6)=1$이고 $r=\\lim_{n\\to\\infty}a_n$일 때, $\\lim_{n\\to\\infty}\\frac{r^{n+3}+1}{2r^n-1}$의 값은?",
    "choices": [
      "$3$",
      "$4$",
      "$5$",
      "$6$",
      "$7$"
    ],
    "answer": "②",
    "solution": "급수 $\\sum_{n=1}^{\\infty}(3a_n-6)$이 수렴하므로 일반항의 극한은 $0$이다. (급수 수렴의 필요조건)\n$3a_n-6\\to0$에서 $a_n\\to2$이므로 $r=2$이다.\n구하는 식에 $r=2$를 대입하면 $$\\frac{r^{n+3}+1}{2r^n-1}=\\frac{2^{n+3}+1}{2\\cdot2^n-1}=\\frac{8\\cdot2^n+1}{2\\cdot2^n-1}.$$\n분자와 분모를 $2^n$으로 나누면 $\\frac{8+\\frac1{2^n}}{2-\\frac1{2^n}}$이다.\n$\\frac1{2^n}\\to0$이므로 극한은 $\\frac{8+0}{2-0}=4$이다.\n따라서 정답은 ②이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-063",
    "problemTypeKey": "PT_CALCULUS_SERIES",
    "templateKey": "TPL_CALCULUS_SERIES_CONVERGENCE_CONDITION",
    "crossConceptKeys": [
      "CC_SERIES_SUM",
      "CC_GEOMETRIC_SEQUENCE"
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
    "content": "두 급수 $\\sum_{n=1}^{\\infty}\\left(\\frac{a_n}{n}-3\\right)$과 $\\sum_{n=1}^{\\infty}\\left(\\frac{n}{b_n}+2\\right)$이 모두 수렴할 때, $\\lim_{n\\to\\infty}\\left(\\frac{a_n}{b_n}+2\\right)$의 값은?",
    "choices": [
      "$-4$",
      "$-3$",
      "$-2$",
      "$-1$",
      "$0$"
    ],
    "answer": "①",
    "solution": "두 급수가 수렴하므로 각각의 일반항의 극한은 $0$이다. (급수 수렴의 필요조건)\n$\\frac{a_n}{n}-3\\to0$에서 $\\frac{a_n}{n}\\to3$이다.\n$\\frac{n}{b_n}+2\\to0$에서 $\\frac{n}{b_n}\\to-2$이다.\n두 극한을 곱하면 (수열의 극한의 곱셈) $$\\frac{a_n}{b_n}=\\frac{a_n}{n}\\cdot\\frac{n}{b_n}\\to3\\cdot(-2)=-6.$$\n따라서 $\\frac{a_n}{b_n}+2\\to-6+2=-4$이다.\n따라서 정답은 ①이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
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
    "content": "$\\sum_{n=1}^{\\infty}\\left(na_n-\\frac{4n^2}{n+2}\\right)=3$이고 $\\lim_{n\\to\\infty}(2a_n-3b_n)=2$일 때, $\\lim_{n\\to\\infty}\\frac{a_n+2b_n}{a_n+6b_n}$의 값은?",
    "choices": [
      "$0.25$",
      "$0.5$",
      "$0.75$",
      "$1$",
      "$1.25$"
    ],
    "answer": "②",
    "solution": "첫째 급수 $\\sum_{n=1}^{\\infty}\\left(na_n-\\frac{4n^2}{n+2}\\right)$가 수렴하므로 일반항의 극한은 $0$이다. (급수 수렴의 필요조건)\n$na_n-\\frac{4n^2}{n+2}\\to0$의 양변을 $n$으로 나누면 $a_n-\\frac{4n}{n+2}\\to0$이다.\n$\\frac{4n}{n+2}=\\frac4{1+\\frac2n}\\to4$이므로 $a_n\\to4$이다.\n$\\lim_{n\\to\\infty}(2a_n-3b_n)=2$에서 $2\\cdot4-3\\lim b_n=2$이므로 $\\lim b_n=2$이다.\n구하는 식의 분자는 $4+2\\cdot2=8$, 분모는 $4+6\\cdot2=16$이다.\n따라서 극한은 $\\frac8{16}=\\frac12$이다.\n따라서 정답은 ②이다.",
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
    "content": "$\\sum_{n=1}^{\\infty}(a_n-3b_n)=2$이고 모든 자연수 $n$에서 $4-\\frac1n<a_nb_n<4+\\frac1n$일 때, $\\lim_{n\\to\\infty}(a_n^2+9b_n^2)$의 값은?",
    "choices": [
      "$18$",
      "$21$",
      "$24$",
      "$27$",
      "$30$"
    ],
    "answer": "③",
    "solution": "급수 $\\sum_{n=1}^{\\infty}(a_n-3b_n)$이 수렴하므로 일반항의 극한은 $0$이다. (급수 수렴의 필요조건)\n$a_n-3b_n\\to0$이다.\n모든 자연수 $n$에서 $4-\\frac1n<a_nb_n<4+\\frac1n$이고 $\\lim_{n\\to\\infty}\\left(4-\\frac1n\\right)=\\lim_{n\\to\\infty}\\left(4+\\frac1n\\right)=4$이다.\n따라서 샌드위치 정리에 의해 $a_nb_n\\to4$이다.\n$a_n^2+9b_n^2$을 완전제곱식으로 변형하면 $$a_n^2+9b_n^2=(a_n-3b_n)^2+6a_nb_n.$$\n$(a_n-3b_n)^2\\to0^2=0$이고 $6a_nb_n\\to6\\cdot4=24$이다.\n따라서 극한은 $0+24=24$이다.\n따라서 정답은 ③이다.",
    "difficultyBucket": 4,
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
    "content": "모든 자연수 $n$에서 $5-\\frac2n<\\sum_{k=1}^n a_k<5+\\frac1n$이고 $\\sum_{n=1}^{\\infty}\\left(b_n-\\frac{3n}{n+2}\\right)=4$일 때, $\\lim_{n\\to\\infty}\\frac{2a_n+3b_n}{a_n+2b_n}$의 값은?",
    "choices": [
      "$0.75$",
      "$1$",
      "$1.25$",
      "$1.5$",
      "$1.75$"
    ],
    "answer": "④",
    "solution": "부분합 $S_n=\\sum_{k=1}^n a_k$라 하면 $5-\\frac2n<S_n<5+\\frac1n$이다.\n$\\lim_{n\\to\\infty}\\left(5-\\frac2n\\right)=\\lim_{n\\to\\infty}\\left(5+\\frac1n\\right)=5$이므로 샌드위치 정리에 의해 $S_n\\to5$이다.\n$n\\ge2$에서 $a_n=S_n-S_{n-1}$이고 $S_{n-1}\\to5$이므로 $a_n\\to5-5=0$이다.\n둘째 급수 $\\sum_{n=1}^{\\infty}\\left(b_n-\\frac{3n}{n+2}\\right)$가 수렴하므로 일반항의 극한은 $0$이다. (급수 수렴의 필요조건)\n$b_n-\\frac{3n}{n+2}\\to0$이고 $\\frac{3n}{n+2}=\\frac3{1+\\frac2n}\\to3$이므로 $b_n\\to3$이다.\n구하는 식의 분자와 분모의 극한을 각각 계산하면 분자는 $2\\cdot0+3\\cdot3=9$이다.\n분모는 $0+2\\cdot3=6$이다.\n따라서 극한은 $\\frac9{6}=\\frac32=1.5$이다.\n따라서 정답은 ④이다.",
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
  }
];
