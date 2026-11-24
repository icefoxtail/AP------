window.examTitle = "미적분II_013_수열의극한의대소관계2_고2_유형은행1";

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
    "content": "모든 $n$에서 $5n-1<a_n<5n+3$일 때 $\\lim_{n\\to\\infty}((a_1+\\cdots+a_n)/n^2)$은?",
    "choices": [
      "$1$",
      "$2$",
      "$5/2$",
      "$3$",
      "$4$"
    ],
    "answer": "③",
    "solution": "$5k-1<a_k<5k+3$에서 각 변을 $k=1$부터 $n$까지 더한다.(부분합의 부등식)\n$$\\sum_{k=1}^{n}(5k-1)<a_1+\\cdots+a_n<\\sum_{k=1}^{n}(5k+3)$$\n$\\sum_{k=1}^{n}k=\\frac{n(n+1)}{2}$를 대입하면 아래끝은 $\\frac{5n(n+1)}{2}-n=\\frac{5n^2+3n}{2}$, 위끝은 $\\frac{5n(n+1)}{2}+3n=\\frac{5n^2+11n}{2}$이다.\n각 변을 $n^2$으로 나누면 $\\frac{5n^2+3n}{2n^2}<\\frac{a_1+\\cdots+a_n}{n^2}<\\frac{5n^2+11n}{2n^2}$이다.\n분모·분자를 $n^2$으로 나누면 $\\lim_{n\\to\\infty}\\frac{5n^2+3n}{2n^2}=\\frac{5}{2}$, $\\lim_{n\\to\\infty}\\frac{5n^2+11n}{2n^2}=\\frac{5}{2}$이다.\n주의: 양끝의 극한값이 같아야 샌드위치 정리(조임 정리)를 적용할 수 있다.\n따라서 정답은 ③이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-059",
    "problemTypeKey": "PT_CALCULUS_SEQUENCE_LIMIT",
    "templateKey": "TPL_CALCULUS_SEQ_LIMIT_SQUEEZE",
    "crossConceptKeys": [
      "CC_SERIES_SUM"
    ],
    "conditionKeys": [
      "COND_UNIVERSAL_INPUTS"
    ],
    "integrationPattern": "SEQUENTIAL"
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
    "content": "모든 $n$에서 $2n^2-n<a_n<2n^2+3n$일 때 $\\lim_{n\\to\\infty}(n^3/(a_1+\\cdots+a_n))$은?",
    "choices": [
      "$1/2$",
      "$1$",
      "$3/2$",
      "$2$",
      "$5/2$"
    ],
    "answer": "③",
    "solution": "$2k^2-k<a_k<2k^2+3k$에서 각 변을 $k=1$부터 $n$까지 더한다.(부분합의 부등식)\n$$\\sum_{k=1}^{n}(2k^2-k)<a_1+\\cdots+a_n<\\sum_{k=1}^{n}(2k^2+3k)$$\n$\\sum_{k=1}^{n}k^2=\\frac{n(n+1)(2n+1)}{6}$, $\\sum_{k=1}^{n}k=\\frac{n(n+1)}{2}$을 대입한다.\n아래끝: $2\\cdot\\frac{n(n+1)(2n+1)}{6}-\\frac{n(n+1)}{2}=\\frac{n(n+1)(2n+1)}{3}-\\frac{n(n+1)}{2}=\\frac{n(n+1)(4n-1)}{6}$.\n위끝: $\\frac{n(n+1)(2n+1)}{3}+\\frac{3n(n+1)}{2}=\\frac{n(n+1)(4n+11)}{6}$.\n각 변을 $n^3$으로 나누면 $\\frac{n(n+1)(4n-1)}{6n^3}<\\frac{a_1+\\cdots+a_n}{n^3}<\\frac{n(n+1)(4n+11)}{6n^3}$이다.\n최고차항의 계수를 비교하면 $\\lim_{n\\to\\infty}\\frac{n(n+1)(4n-1)}{6n^3}=\\frac{4}{6}=\\frac{2}{3}$, $\\lim_{n\\to\\infty}\\frac{n(n+1)(4n+11)}{6n^3}=\\frac{4}{6}=\\frac{2}{3}$이다.\n따라서 샌드위치 정리에 의해 $\\lim_{n\\to\\infty}\\frac{a_1+\\cdots+a_n}{n^3}=\\frac{2}{3}$이다.\n구하는 식은 그 역수이므로 $\\lim_{n\\to\\infty}\\frac{n^3}{a_1+\\cdots+a_n}=\\frac{3}{2}$이다.(극한의 역수 성질)\n주의: 역수를 취하기 전에 분모의 극한이 $0$이 아님을 확인해야 한다.\n따라서 정답은 ③이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-059",
    "problemTypeKey": "PT_CALCULUS_SEQUENCE_LIMIT",
    "templateKey": "TPL_CALCULUS_SEQ_LIMIT_SQUEEZE",
    "crossConceptKeys": [
      "CC_SERIES_SUM"
    ],
    "conditionKeys": [
      "COND_UNIVERSAL_INPUTS"
    ],
    "integrationPattern": "SEQUENTIAL"
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
    "content": "$2/(\\sqrt{n+3}+\\sqrt{n+4})<a_n<2/(\\sqrt{n+2}+\\sqrt{n+3})$일 때 $\\lim_{n\\to\\infty}((a_1+\\cdots+a_n)/\\sqrt{n+5})$은?",
    "choices": [
      "$1$",
      "$2$",
      "$3$",
      "$4$",
      "$5$"
    ],
    "answer": "②",
    "solution": "분모를 유리화하면(분자·분모에 켤레식을 곱함) 아래끝은 $\\frac{2}{\\sqrt{n+3}+\\sqrt{n+4}}=\\frac{2(\\sqrt{n+4}-\\sqrt{n+3})}{(n+4)-(n+3)}=2(\\sqrt{n+4}-\\sqrt{n+3})$이고, 위끝은 $\\frac{2}{\\sqrt{n+2}+\\sqrt{n+3}}=2(\\sqrt{n+3}-\\sqrt{n+2})$이다.\n즉 $2(\\sqrt{n+4}-\\sqrt{n+3})<a_n<2(\\sqrt{n+3}-\\sqrt{n+2})$이다.\n각 변을 $k=1$부터 $n$까지 더하면 망원합이 되어 가운데 항이 소거된다.\n아래끝: $2[(\\sqrt{5}-\\sqrt{4})+(\\sqrt{6}-\\sqrt{5})+\\cdots+(\\sqrt{n+4}-\\sqrt{n+3})]=2(\\sqrt{n+4}-2)$.\n위끝: $2[(\\sqrt{4}-\\sqrt{3})+(\\sqrt{5}-\\sqrt{4})+\\cdots+(\\sqrt{n+3}-\\sqrt{n+2})]=2(\\sqrt{n+3}-\\sqrt{3})$.\n따라서 $2(\\sqrt{n+4}-2)<a_1+\\cdots+a_n<2(\\sqrt{n+3}-\\sqrt{3})$이다.\n각 변을 $\\sqrt{n+5}$로 나누면 $\\frac{2(\\sqrt{n+4}-2)}{\\sqrt{n+5}}<\\frac{a_1+\\cdots+a_n}{\\sqrt{n+5}}<\\frac{2(\\sqrt{n+3}-\\sqrt{3})}{\\sqrt{n+5}}$이다.\n분모·분자를 $\\sqrt{n}$으로 나누면 $\\lim_{n\\to\\infty}\\frac{2(\\sqrt{n+4}-2)}{\\sqrt{n+5}}=2\\cdot\\frac{1}{1}=2$, $\\lim_{n\\to\\infty}\\frac{2(\\sqrt{n+3}-\\sqrt{3})}{\\sqrt{n+5}}=2\\cdot\\frac{1}{1}=2$이다.\n따라서 샌드위치 정리에 의해 $\\lim_{n\\to\\infty}\\frac{a_1+\\cdots+a_n}{\\sqrt{n+5}}=2$이다.\n주의: 두 경계의 극한값이 모두 $2$로 같으므로 조임이 성립한다.\n따라서 정답은 ②이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-059",
    "problemTypeKey": "PT_CALCULUS_SEQUENCE_LIMIT",
    "templateKey": "TPL_CALCULUS_SEQ_LIMIT_SQUEEZE",
    "crossConceptKeys": [
      "CC_TELESCOPING_SERIES"
    ],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
  }
];
