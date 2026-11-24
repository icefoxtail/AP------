window.examTitle = "미적분II_003_일반항aₙ을포함한수열의극한값_고2_유형은행1";

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
    "content": "수렴하는 수열에서 $\\lim_{n\\to\\infty}((a_n+7)/(2a_n+1))=2$일 때 $\\lim_{n\\to\\infty}(a_n)$은?",
    "choices": [
      "$1/3$",
      "$2/3$",
      "$4/3$",
      "$5/3$",
      "$7/3$"
    ],
    "answer": "④",
    "solution": "수렴하는 수열이므로 $\\lim_{n\\to\\infty}a_n=A$로 놓는다 (수렴하는 수열의 극한).\n극한의 사칙연산 성질에 의해 $$\\frac{A+7}{2A+1}=2$$가 성립한다.\n분모를 곱하여 정리하면 $A+7=2(2A+1)=4A+2$이다.\n이항하면 $3A=5$이므로 $A=\\frac{5}{3}$이다.\n주의: 분모 $2A+1=\\frac{13}{3}\\ne 0$이므로 극한의 성질을 적용할 수 있다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-058",
    "problemTypeKey": "PT_CALCULUS_SEQUENCE_LIMIT",
    "templateKey": "TPL_CALCULUS_SEQ_LIMIT_ALGEBRAIC",
    "crossConceptKeys": [],
    "conditionKeys": [],
    "integrationPattern": "NONE"
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
    "content": "수렴하는 수열에서 $\\lim_{n\\to\\infty}((4a_{n+2}+2)/(a_n+5))=3$일 때 $\\lim_{n\\to\\infty}(a_n)$은?",
    "choices": [
      "$4$",
      "$7$",
      "$10$",
      "$13$",
      "$16$"
    ],
    "answer": "④",
    "solution": "수렴하는 수열의 극한을 $\\lim_{n\\to\\infty}a_n=A$로 놓는다 (수렴하는 수열의 극한).\n$n\\to\\infty$이면 $n+2\\to\\infty$이므로 $\\lim_{n\\to\\infty}a_{n+2}=A$이다 (부분수열의 극한).\n극한의 사칙연산 성질에 의해 $$\\frac{4A+2}{A+5}=3$$이다.\n분모를 곱하면 $4A+2=3(A+5)=3A+15$이다.\n이항하면 $A=13$이다.\n주의: $a_{n+2}$와 $a_n$이 같은 값 $A$에 수렴한다는 점을 이용한다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-058",
    "problemTypeKey": "PT_CALCULUS_SEQUENCE_LIMIT",
    "templateKey": "TPL_CALCULUS_SEQ_LIMIT_ALGEBRAIC",
    "crossConceptKeys": [],
    "conditionKeys": [],
    "integrationPattern": "NONE"
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
    "content": "모든 $a_n\\ne2$이고 $\\lim_{n\\to\\infty}((2a_n+5)/(a_n-2))=5$이다. $\\lim_{n\\to\\infty}(4a_n-1)$은?",
    "choices": [
      "$19$",
      "$21$",
      "$23$",
      "$25$",
      "$27$"
    ],
    "answer": "①",
    "solution": "$\\lim_{n\\to\\infty}a_n=A$로 놓는다 (수렴하는 수열의 극한).\n$a_n\\ne 2$이므로 극한의 사칙연산 성질에 의해 $$\\frac{2A+5}{A-2}=5$$이다.\n분모를 곱하면 $2A+5=5(A-2)=5A-10$이다.\n이항하면 $3A=15$이므로 $A=5$이다.\n구하는 극한은 극한의 성질에 의해 $4A-1=4\\cdot 5-1=19$이다.\n따라서 정답은 ①이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-058",
    "problemTypeKey": "PT_CALCULUS_SEQUENCE_LIMIT",
    "templateKey": "TPL_CALCULUS_SEQ_LIMIT_ALGEBRAIC",
    "crossConceptKeys": [],
    "conditionKeys": [
      "COND_NONZERO"
    ],
    "integrationPattern": "SEQUENTIAL"
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
    "content": "수렴하는 수열에서 $\\lim_{n\\to\\infty}((3a_n-5)/(a_n+2))=1/2$이다. $\\lim_{n\\to\\infty}((a_n+3n^2)/(a_nn^2+4n+1))$은?",
    "choices": [
      "$5/4$",
      "$3/2$",
      "$7/4$",
      "$2$",
      "$9/4$"
    ],
    "answer": "①",
    "solution": "$\\lim_{n\\to\\infty}a_n=A$로 놓는다 (수렴하는 수열의 극한).\n조건에서 극한의 사칙연산 성질에 의해 $$\\frac{3A-5}{A+2}=\\frac{1}{2}$$이다.\n분모를 곱하면 $2(3A-5)=A+2$, 즉 $6A-10=A+2$이다.\n이항하면 $5A=12$이므로 $A=\\frac{12}{5}$이다.\n구하는 식의 분자·분모를 $n^2$으로 나누면 $$\\frac{\\frac{a_n}{n^2}+3}{a_n+\\frac{4}{n}+\\frac{1}{n^2}}$$이다.\n$a_n$이 수렴하므로 $\\frac{a_n}{n^2}\\to 0$, $\\frac{4}{n}\\to 0$, $\\frac{1}{n^2}\\to 0$이다 (수렴수열과 $1/n^k$의 곱의 극한).\n따라서 극한은 $\\frac{0+3}{A+0+0}=\\frac{3}{12/5}=\\frac{15}{12}=\\frac{5}{4}$이다.\n따라서 정답은 ①이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-058",
    "problemTypeKey": "PT_CALCULUS_SEQUENCE_LIMIT",
    "templateKey": "TPL_CALCULUS_SEQ_LIMIT_ALGEBRAIC",
    "crossConceptKeys": [],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
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
    "content": "수렴하는 수열에서 $\\sum_{n=1}^{\\infty}(5a_n-15)/(2a_n+7)=4$일 때 $\\lim_{n\\to\\infty}(a_n)$은?",
    "choices": [
      "$-1$",
      "$0$",
      "$1$",
      "$2$",
      "$3$"
    ],
    "answer": "⑤",
    "solution": "급수 $\\sum_{n=1}^{\\infty}\\frac{5a_n-15}{2a_n+7}$이 수렴하므로 일반항의 극한은 $0$이다 (수렴하는 급수의 일반항의 극한).\n$\\lim_{n\\to\\infty}a_n=A$로 놓으면 극한의 사칙연산 성질에 의해 $$\\frac{5A-15}{2A+7}=0$$이다.\n분모가 $0$이 아니므로 분자가 $0$이어야 한다: $5A-15=0$.\n따라서 $A=3$이다.\n주의: $2A+7=13\\ne 0$임을 확인해야 분수 꼴 극한의 성질을 쓸 수 있다.\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-058",
    "problemTypeKey": "PT_CALCULUS_SEQUENCE_LIMIT",
    "templateKey": "TPL_CALCULUS_SEQ_LIMIT_ALGEBRAIC",
    "crossConceptKeys": [
      "CC_SERIES_SUM"
    ],
    "conditionKeys": [],
    "integrationPattern": "REINTERPRETATION"
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
    "content": "수렴하는 수열이 $(3a_n+4)/(5a_n-3)=(2+4+\\cdots+2n)/(2n^2+1)$을 만족할 때 $\\lim_{n\\to\\infty}(a_n)$은?",
    "choices": [
      "$-15$",
      "$-13$",
      "$-11$",
      "$-9$",
      "$-7$"
    ],
    "answer": "③",
    "solution": "$2+4+\\cdots+2n=2(1+2+\\cdots+n)=2\\cdot\\frac{n(n+1)}{2}=n(n+1)$이다 (등차수열의 합).\n따라서 우변은 $\\frac{n(n+1)}{2n^2+1}=\\frac{n^2+n}{2n^2+1}$이다.\n분자·분모를 $n^2$으로 나누면 극한은 $\\frac{1+\\frac{1}{n}}{2+\\frac{1}{n^2}}\\to\\frac{1}{2}$이다 (분자·분모의 차수가 같은 유리식의 극한).\n$\\lim_{n\\to\\infty}a_n=A$로 놓으면 극한의 사칙연산 성질에 의해 $$\\frac{3A+4}{5A-3}=\\frac{1}{2}$$이다.\n분모를 곱하면 $2(3A+4)=5A-3$, 즉 $6A+8=5A-3$이다.\n이항하면 $A=-11$이다.\n주의: $5A-3=-58\\ne 0$이므로 극한의 성질이 성립한다.\n따라서 정답은 ③이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-058",
    "problemTypeKey": "PT_CALCULUS_SEQUENCE_LIMIT",
    "templateKey": "TPL_CALCULUS_SEQ_LIMIT_ALGEBRAIC",
    "crossConceptKeys": [
      "CC_SERIES_SUM"
    ],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
  }
];
