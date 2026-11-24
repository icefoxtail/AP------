window.examTitle = "미적분II_027_rⁿ을포함한수열의극한의활용_고2_유형은행1";

window.questionBank = [
  {
    "id": 1,
    "category": "수열의 극한",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-01",
    "standardUnit": "수열의 극한",
    "standardUnitOrder": 1,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "수열의 극한"
    ],
    "wide": false,
    "content": "실수 $r$에 대해 수열 $\\left\\{\\frac{r^{2n+2}+8}{r^{2n}+4}\\right\\}$의 극한값이 될 수 없는 것은?",
    "choices": [
      "$\\frac45$",
      "$\\frac95$",
      "$2$",
      "$\\frac94$",
      "$4$"
    ],
    "answer": "①",
    "solution": "$x=r^2$라 하고 $x\\ge 0$으로 놓으면 주어진 식은 $\\frac{x^{n+1}+8}{x^n+4}$이다.\n(i) $0\\le x<1$일 때 $x^n\\to0$이므로 극한은 $\\frac{0+8}{0+4}=2$이다.\n(ii) $x=1$일 때 극한은 $\\frac{1+8}{1+4}=\\frac95$이다.\n(iii) $x>1$일 때 분모·분자를 $x^n$으로 나누면 $\\frac{x+8/x^n}{1+4/x^n}\\to x=r^2$이다.\n따라서 가능한 극한값은 $2$, $\\frac95$, 그리고 $1$보다 큰 모든 실수이다.\n보기 중 $\\frac45$는 $1$보다 작아서 될 수 없고, $\\frac95,2,\\frac94,4$는 각각 $x=1,x=1,x=\\frac94,x=4$에서 가능하다.\n따라서 정답은 ①이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-060",
    "problemTypeKey": "PT_CALCULUS_SEQUENCE_LIMIT",
    "templateKey": "TPL_CALCULUS_SEQ_LIMIT_GEOMETRIC_RATIO",
    "crossConceptKeys": [],
    "conditionKeys": [],
    "integrationPattern": "CASE_BRANCH"
  },
  {
    "id": 2,
    "category": "수열의 극한",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-01",
    "standardUnit": "수열의 극한",
    "standardUnitOrder": 1,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "수열의 극한"
    ],
    "wide": false,
    "content": "양수 $r$ 가운데 $\\lim_{n\\to\\infty}\\frac{r^{n+1}-2r^n+7}{r^n+2}=2$를 만족하는 모든 $r$의 합은?",
    "choices": [
      "$5$",
      "$6$",
      "$7$",
      "$8$",
      "$9$"
    ],
    "answer": "①",
    "solution": "$0<r<1$일 때 $r^n\\to0$이므로 극한은 $\\frac{0-0+7}{0+2}=\\frac72$이어서 $2$가 아니다.\n$r=1$일 때 극한은 $\\frac{1-2+7}{1+2}=\\frac63=2$이므로 $r=1$은 조건을 만족한다.\n$r>1$일 때 분모·분자를 $r^n$으로 나누면 $\\frac{r-2+7/r^n}{1+2/r^n}\\to r-2$이다.\n$r-2=2$에서 $r=4$이고 $4>1$이므로 유효하다.\n따라서 모든 양수 $r$의 합은 $1+4=5$이다.\n따라서 정답은 ①이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-060",
    "problemTypeKey": "PT_CALCULUS_SEQUENCE_LIMIT",
    "templateKey": "TPL_CALCULUS_SEQ_LIMIT_GEOMETRIC_RATIO",
    "crossConceptKeys": [],
    "conditionKeys": [
      "COND_POSITIVE"
    ],
    "integrationPattern": "CASE_BRANCH"
  },
  {
    "id": 3,
    "category": "수열의 극한",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-01",
    "standardUnit": "수열의 극한",
    "standardUnitOrder": 1,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "수열의 극한"
    ],
    "wide": false,
    "content": "$\\lim_{n\\to\\infty}\\frac{(m/7)^{n+1}+3}{(m/7)^n+1}=3$을 만족하는 자연수 $m$의 개수는?",
    "choices": [
      "$5$",
      "$6$",
      "$7$",
      "$8$",
      "$9$"
    ],
    "answer": "③",
    "solution": "$a=\\frac m7$로 놓으면 $a>0$이고 주어진 극한은 $\\lim_{n\\to\\infty}\\frac{a^{n+1}+3}{a^n+1}$이다.\n(i) $0<a<1$, 즉 $m<7$일 때 $a^n\\to0$이므로 극한은 $\\frac{0+3}{0+1}=3$이다. 이때 $m=1,2,\\dots,6$의 $6$개이다.\n(ii) $a=1$, 즉 $m=7$일 때 극한은 $\\frac{1+3}{1+1}=2$이므로 조건을 만족하지 않는다.\n(iii) $a>1$, 즉 $m>7$일 때 분모·분자를 $a^n$으로 나누면 $\\frac{a+3/a^n}{1+1/a^n}\\to a=\\frac m7$이다.\n$\\frac m7=3$에서 $m=21$이고 $21>7$이므로 유효하다.\n따라서 조건을 만족하는 자연수 $m$은 $1$부터 $6$까지와 $21$의 $7$개이다.\n따라서 정답은 ③이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-060",
    "problemTypeKey": "PT_CALCULUS_SEQUENCE_LIMIT",
    "templateKey": "TPL_CALCULUS_SEQ_LIMIT_GEOMETRIC_RATIO",
    "crossConceptKeys": [],
    "conditionKeys": [
      "COND_NATURAL_NUMBER"
    ],
    "integrationPattern": "CASE_BRANCH"
  },
  {
    "id": 4,
    "category": "수열의 극한",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-01",
    "standardUnit": "수열의 극한",
    "standardUnitOrder": 1,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "수열의 극한"
    ],
    "wide": false,
    "content": "수열 $\\{\\sqrt{36^n+a^n}-6^n\\}$이 수렴하도록 하는 자연수 $a$의 개수는?",
    "choices": [
      "$2$",
      "$3$",
      "$4$",
      "$5$",
      "$6$"
    ],
    "answer": "⑤",
    "solution": "$\\sqrt{36^n+a^n}-6^n=\\frac{a^n}{\\sqrt{36^n+a^n}+6^n}$ (분자 유리화).\n분모·분자를 $6^n$으로 나누면 $\\frac{(a/6)^n}{\\sqrt{1+(a/36)^n}+1}$이다.\n(i) $1\\le a<6$일 때 $(a/6)^n\\to0$, $(a/36)^n\\to0$이므로 극한은 $\\frac0{\\sqrt1+1}=0$이다.\n(ii) $a=6$일 때 $(a/6)^n=1$, $(a/36)^n=(1/6)^n\\to0$이므로 극한은 $\\frac1{1+1}=\\frac12$이다.\n(iii) $6<a<36$일 때 $(a/6)^n\\to\\infty$, $(a/36)^n\\to0$이므로 분자는 발산하고 분모는 $2$에 수렴하여 발산한다.\n(iv) $a=36$일 때 식은 $6^n(\\sqrt2-1)$이므로 $\\infty$로 발산한다.\n(v) $a>36$일 때 $(a/36)^{n/2}\\to\\infty$이고 $\\frac{(a/6)^n}{(a/36)^{n/2}}=a^{n/2}\\to\\infty$이므로 발산한다.\n따라서 수렴하는 자연수 $a$는 $1,2,3,4,5,6$의 $6$개이다.\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-060",
    "problemTypeKey": "PT_CALCULUS_SEQUENCE_LIMIT",
    "templateKey": "TPL_CALCULUS_SEQ_LIMIT_GEOMETRIC_RATIO",
    "crossConceptKeys": [],
    "conditionKeys": [
      "COND_NATURAL_NUMBER"
    ],
    "integrationPattern": "CASE_BRANCH"
  },
  {
    "id": 5,
    "category": "수열의 극한",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-01",
    "standardUnit": "수열의 극한",
    "standardUnitOrder": 1,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "수열의 극한"
    ],
    "wide": false,
    "content": "자연수 $k$에 대해 $a_k=\\lim_{n\\to\\infty}\\frac{4^{n+1}}{4^nk+3k^{n+1}}$일 때 $\\sum_{k=1}^{8}ka_k$는?",
    "choices": [
      "$9$",
      "$10$",
      "$12$",
      "$13$",
      "$16$"
    ],
    "answer": "④",
    "solution": "$a_k=\\lim_{n\\to\\infty}\\frac{4^{n+1}}{4^nk+3k^{n+1}}=\\lim_{n\\to\\infty}\\frac{4^{n+1}}{k(4^n+3k^n)}=\\frac4k\\lim_{n\\to\\infty}\\frac1{1+3(k/4)^n}$.\n(i) $k=1,2,3$일 때 $(k/4)^n\\to0$이므로 $a_k=\\frac4k$이고 $ka_k=4$이다.\n(ii) $k=4$일 때 $a_4=\\frac44\\cdot\\frac1{1+3}=\\frac14$이고 $4a_4=1$이다.\n(iii) $k=5,6,7,8$일 때 $(k/4)^n\\to\\infty$이므로 $a_k=0$이고 $ka_k=0$이다.\n따라서 $\\sum_{k=1}^8 ka_k=(4+4+4)+1+0=13$이다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-060",
    "problemTypeKey": "PT_CALCULUS_SEQUENCE_LIMIT",
    "templateKey": "TPL_CALCULUS_SEQ_LIMIT_GEOMETRIC_RATIO",
    "crossConceptKeys": [
      "CC_SERIES_SUM"
    ],
    "conditionKeys": [
      "COND_NATURAL_NUMBER"
    ],
    "integrationPattern": "CASE_BRANCH"
  },
  {
    "id": 6,
    "category": "수열의 극한",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-01",
    "standardUnit": "수열의 극한",
    "standardUnitOrder": 1,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "수열의 극한"
    ],
    "wide": false,
    "content": "자연수 $k$에 대해 $a_k=\\lim_{n\\to\\infty}\\frac{(8/k)^{n+1}}{(8/k)^n+3}$일 때 $\\sum_{k=1}^{12}ka_k$는?",
    "choices": [
      "$48$",
      "$54$",
      "$58$",
      "$60$",
      "$64$"
    ],
    "answer": "③",
    "solution": "$a_k=\\lim_{n\\to\\infty}\\frac{(8/k)^{n+1}}{(8/k)^n+3}$에서 $b=\\frac8k>0$이라 하면 $a_k=\\lim_{n\\to\\infty}\\frac{b^{n+1}}{b^n+3}=\\lim_{n\\to\\infty}\\frac{b}{1+3/b^n}$이다.\n(i) $k=1,2,\\dots,7$일 때 $b>1$이므로 $3/b^n\\to0$이고 $a_k=b=\\frac8k$이다. 따라서 $ka_k=8$이다.\n(ii) $k=8$일 때 $b=1$이므로 $a_8=\\frac{1}{1+3}=\\frac14$이고 $8a_8=2$이다.\n(iii) $k=9,10,11,12$일 때 $0<b<1$이므로 $3/b^n\\to\\infty$이고 $a_k=0$이다.\n따라서 $\\sum_{k=1}^{12}ka_k=7\\cdot8+2+0=58$이다.\n따라서 정답은 ③이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-060",
    "problemTypeKey": "PT_CALCULUS_SEQUENCE_LIMIT",
    "templateKey": "TPL_CALCULUS_SEQ_LIMIT_GEOMETRIC_RATIO",
    "crossConceptKeys": [
      "CC_SERIES_SUM"
    ],
    "conditionKeys": [
      "COND_NATURAL_NUMBER"
    ],
    "integrationPattern": "CASE_BRANCH"
  }
];
