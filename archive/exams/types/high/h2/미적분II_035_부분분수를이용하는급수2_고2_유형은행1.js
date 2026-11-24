window.examTitle = "미적분II_035_부분분수를이용하는급수2_고2_유형은행1";

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
    "content": "급수 $\\sum_{n=1}^\\infty\\frac{4}{2+4+\\cdots+2n}$의 합은?",
    "choices": [
      "$4$",
      "$5$",
      "$6$",
      "$7$",
      "$8$"
    ],
    "answer": "①",
    "solution": "등차수열의 합 공식으로 분모를 정리하면 $2+4+\\cdots+2n=2(1+2+\\cdots+n)=n(n+1)$이다.\n부분분수 분해로 일반항을 바꾸면 $\\frac4{n(n+1)}=4\\left(\\frac1n-\\frac1{n+1}\\right)$이다.\n제$N$항까지의 부분합은 망원합으로 $S_N=4\\left(1-\\frac1{N+1}\\right)$이다.\n$N\\to\\infty$일 때 $\\frac1{N+1}\\to0$이므로 $S_N\\to4$이다.\n따라서 정답은 ①이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-062",
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
    "content": "급수 $\\sum_{n=1}^\\infty\\frac{6}{n^2+3n}$의 합은?",
    "choices": [
      "$\\frac83$",
      "$\\frac{11}3$",
      "$\\frac{14}3$",
      "$\\frac{17}3$",
      "$\\frac{20}3$"
    ],
    "answer": "②",
    "solution": "분모를 인수분해하면 $n^2+3n=n(n+3)$이다.\n부분분수 분해로 $\\frac6{n(n+3)}=\\frac2n-\\frac2{n+3}=2\\left(\\frac1n-\\frac1{n+3}\\right)$이다.\n제$N$항까지의 부분합은 망원합으로 $S_N=2\\left(1+\\frac12+\\frac13-\\frac1{N+1}-\\frac1{N+2}-\\frac1{N+3}\\right)$이다.\n$N\\to\\infty$일 때 뒤의 세 항은 $0$으로 수렴하므로 $S_N\\to2\\cdot\\frac{11}6=\\frac{11}3$이다.\n따라서 정답은 ②이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-062",
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
    "content": "급수 $\\sum_{n=3}^\\infty\\frac{8}{n^2-4}$의 합은?",
    "choices": [
      "$\\frac{13}6$",
      "$\\frac{16}6$",
      "$\\frac{19}6$",
      "$\\frac{22}6$",
      "$\\frac{25}6$"
    ],
    "answer": "⑤",
    "solution": "분모를 인수분해하면 $n^2-4=(n-2)(n+2)$이다.\n부분분수 분해로 $\\frac8{(n-2)(n+2)}=2\\left(\\frac1{n-2}-\\frac1{n+2}\\right)$이다.\n$n=3$부터 제$N$항까지 더하면 망원합으로 $S_N=2\\left(1+\\frac12+\\frac13+\\frac14-\\frac1{N-1}-\\frac1N-\\frac1{N+1}-\\frac1{N+2}\\right)$이다.\n$N\\to\\infty$일 때 뒤의 네 항은 $0$으로 수렴하므로 $S_N\\to2\\cdot\\frac{25}{12}=\\frac{25}6$이다.\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-062",
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
    "content": "급수 $\\sum_{n=1}^\\infty\\frac{12}{(3n-1)(3n+2)}$의 합은?",
    "choices": [
      "$1$",
      "$1.5$",
      "$2$",
      "$2.5$",
      "$3$"
    ],
    "answer": "③",
    "solution": "분모의 두 인수의 차가 $3$이므로 부분분수 분해로 $\\frac{12}{(3n-1)(3n+2)}=4\\left(\\frac1{3n-1}-\\frac1{3n+2}\\right)$이다.\n제$N$항까지의 부분합은 망원합으로 $S_N=4\\left(\\frac12-\\frac1{3N+2}\\right)=2-\\frac4{3N+2}$이다.\n$N\\to\\infty$일 때 $\\frac4{3N+2}\\to0$이므로 $S_N\\to2$이다.\n따라서 정답은 ③이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-062",
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
    "content": "급수 $\\sum_{n=1}^\\infty\\frac{5}{(2n+1)^2-1}$의 합은?",
    "choices": [
      "$0.5$",
      "$0.75$",
      "$1$",
      "$1.25$",
      "$1.5$"
    ],
    "answer": "④",
    "solution": "분모를 인수분해하면 $(2n+1)^2-1=(2n)(2n+2)=4n(n+1)$이다.\n부분분수 분해로 $\\frac5{4n(n+1)}=\\frac54\\left(\\frac1n-\\frac1{n+1}\\right)$이다.\n제$N$항까지의 부분합은 망원합으로 $S_N=\\frac54\\left(1-\\frac1{N+1}\\right)$이다.\n$N\\to\\infty$일 때 $\\frac1{N+1}\\to0$이므로 $S_N\\to\\frac54=1.25$이다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-062",
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
    "content": "급수 $\\sum_{n=1}^\\infty\\frac{12}{(4n-1)(4n+3)}$의 합은?",
    "choices": [
      "$0.5$",
      "$1$",
      "$1.5$",
      "$2$",
      "$2.5$"
    ],
    "answer": "②",
    "solution": "부분분수 분해로 $\\frac{12}{(4n-1)(4n+3)}=3\\left(\\frac1{4n-1}-\\frac1{4n+3}\\right)$이다.\n제$N$항까지의 부분합은 망원합으로 $S_N=3\\left(\\frac13-\\frac1{4N+3}\\right)=1-\\frac3{4N+3}$이다.\n$N\\to\\infty$일 때 $\\frac3{4N+3}\\to0$이므로 $S_N\\to1$이다.\n따라서 정답은 ②이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-062",
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
    "content": "급수 $\\sum_{n=1}^\\infty\\frac{30}{(5n-3)(5n+2)}$의 합은?",
    "choices": [
      "$1$",
      "$1.5$",
      "$2$",
      "$2.5$",
      "$3$"
    ],
    "answer": "⑤",
    "solution": "부분분수 분해로 $\\frac{30}{(5n-3)(5n+2)}=6\\left(\\frac1{5n-3}-\\frac1{5n+2}\\right)$이다.\n제$N$항까지의 부분합은 망원합으로 $S_N=6\\left(\\frac12-\\frac1{5N+2}\\right)=3-\\frac6{5N+2}$이다.\n$N\\to\\infty$일 때 $\\frac6{5N+2}\\to0$이므로 $S_N\\to3$이다.\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-062",
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
    "content": "급수 $\\sum_{n=1}^\\infty\\frac{6}{(n+3)\\sqrt{n+4}+(n+4)\\sqrt{n+3}}$의 합은?",
    "choices": [
      "$2$",
      "$3$",
      "$4$",
      "$5$",
      "$6$"
    ],
    "answer": "②",
    "solution": "분모를 묶으면 $(n+3)\\sqrt{n+4}+(n+4)\\sqrt{n+3}=\\sqrt{n+3}\\sqrt{n+4}\\left(\\sqrt{n+3}+\\sqrt{n+4}\\right)$이다.\n$\\frac1{\\sqrt{n+3}}-\\frac1{\\sqrt{n+4}}=\\frac{\\sqrt{n+4}-\\sqrt{n+3}}{\\sqrt{n+3}\\sqrt{n+4}}=\\frac1{\\sqrt{n+3}\\sqrt{n+4}\\left(\\sqrt{n+3}+\\sqrt{n+4}\\right)}$이므로 일반항은 $6\\left(\\frac1{\\sqrt{n+3}}-\\frac1{\\sqrt{n+4}}\\right)$이다.\n제$N$항까지의 부분합은 망원합으로 $S_N=6\\left(\\frac12-\\frac1{\\sqrt{N+4}}\\right)=3-\\frac6{\\sqrt{N+4}}$이다.\n$N\\to\\infty$일 때 $\\frac6{\\sqrt{N+4}}\\to0$이므로 $S_N\\to3$이다.\n따라서 정답은 ②이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-062",
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
    "content": "급수 $\\sum_{n=1}^\\infty\\log\\frac{(n+1)^2}{n(n+2)}$의 합은?",
    "choices": [
      "$\\log 1.25$",
      "$\\log 1.5$",
      "$\\log 1.75$",
      "$\\log 2$",
      "$\\log 2.25$"
    ],
    "answer": "④",
    "solution": "로그의 성질로 일반항을 변형하면 $\\log\\frac{(n+1)^2}{n(n+2)}=2\\log(n+1)-\\log n-\\log(n+2)$이다.\n이를 두 로그의 차로 묶으면 $\\left(\\log(n+1)-\\log n\\right)-\\left(\\log(n+2)-\\log(n+1)\\right)$이다.\n제$N$항까지의 부분합은 망원합으로 $S_N=\\log2-\\log\\frac{N+2}{N+1}$이다.\n$N\\to\\infty$일 때 $\\frac{N+2}{N+1}\\to1$이므로 $\\log\\frac{N+2}{N+1}\\to\\log1=0$이다.\n따라서 $S_N\\to\\log2$이다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-062",
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
    "content": "급수 $\\sum_{n=2}^\\infty\\frac{24}{n(n+1)(n+2)}$의 합은?",
    "choices": [
      "$2$",
      "$3$",
      "$4$",
      "$5$",
      "$6$"
    ],
    "answer": "①",
    "solution": "부분분수 분해로 $\\frac{24}{n(n+1)(n+2)}=12\\left(\\frac1{n(n+1)}-\\frac1{(n+1)(n+2)}\\right)$이다.\n$n=2$부터 제$N$항까지의 부분합은 망원합으로 $S_N=12\\left(\\frac1{2\\cdot3}-\\frac1{(N+1)(N+2)}\\right)=2-\\frac{12}{(N+1)(N+2)}$이다.\n$N\\to\\infty$일 때 $\\frac{12}{(N+1)(N+2)}\\to0$이므로 $S_N\\to2$이다.\n따라서 정답은 ①이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-062",
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
    "content": "다음 등식 중 옳지 않은 것은?",
    "choices": [
      "$\\sum_{n=1}^\\infty\\frac{4}{n(n+2)}=3$",
      "$\\sum_{n=1}^\\infty\\frac{6}{(3n-1)(3n+2)}=1$",
      "$\\sum_{n=1}^\\infty\\left(\\frac{8}{(n+1)^2}-\\frac{8}{(n+2)^2}\\right)=3$",
      "$\\sum_{n=1}^\\infty\\frac{12}{(2n+1)(2n+3)}=2$",
      "$\\sum_{n=2}^\\infty\\frac{4}{n(n+1)}=2$"
    ],
    "answer": "③",
    "solution": "① $\\frac4{n(n+2)}=2\\left(\\frac1n-\\frac1{n+2}\\right)$이므로 부분합의 극한은 $2\\left(1+\\frac12\\right)=3$이다.\n② $\\frac6{(3n-1)(3n+2)}=2\\left(\\frac1{3n-1}-\\frac1{3n+2}\\right)$이므로 부분합의 극한은 $2\\cdot\\frac12=1$이다.\n③ $\\frac8{(n+1)^2}-\\frac8{(n+2)^2}$의 망원합의 극한은 $\\frac8{2^2}=2$이다. 이는 우변 $3$과 다르다.\n④ $\\frac{12}{(2n+1)(2n+3)}=6\\left(\\frac1{2n+1}-\\frac1{2n+3}\\right)$이므로 부분합의 극한은 $6\\cdot\\frac13=2$이다.\n⑤ $\\frac4{n(n+1)}=4\\left(\\frac1n-\\frac1{n+1}\\right)$이고 $n=2$부터이므로 부분합의 극한은 $4\\cdot\\frac12=2$이다.\n이상에서 옳지 않은 것은 ③이다.\n따라서 정답은 ③이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-062",
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
