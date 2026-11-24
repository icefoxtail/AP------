window.examTitle = "미적분II_009_소수부분의극한값계산_고2_유형은행1";

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
    "content": "$\\sqrt{n^2+4n+3}$의 소수 부분을 $a_n$이라 할 때 $\\lim_{n\\to\\infty}(a_n)$은?",
    "choices": [
      "$0$",
      "$1/4$",
      "$1/2$",
      "$3/4$",
      "$1$"
    ],
    "answer": "⑤",
    "solution": "$(n+1)^2=n^2+2n+1<n^2+4n+3<(n+2)^2=n^2+4n+4$이므로 $n+1<\\sqrt{n^2+4n+3}<n+2$이다.\n따라서 정수 부분은 $n+1$이고, 소수 부분은 $a_n=\\sqrt{n^2+4n+3}-(n+1)$이다.\n분모를 유리화하면 $a_n=\\frac{(n^2+4n+3)-(n+1)^2}{\\sqrt{n^2+4n+3}+(n+1)}=\\frac{2n+2}{\\sqrt{n^2+4n+3}+n+1}$이다.\n분자와 분모를 $n$으로 나누면 $a_n=\\frac{2+\\frac2n}{\\sqrt{1+\\frac4n+\\frac3{n^2}}+1+\\frac1n}$이다.\n$n\\to\\infty$일 때 $\\frac1n\\to0$, $\\frac1{n^2}\\to0$이므로 극한값은 $\\frac{2}{1+1}=1$이다.\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-056",
    "problemTypeKey": "PT_CALCULUS_SEQUENCE_LIMIT",
    "templateKey": "TPL_CALCULUS_SEQ_LIMIT_ALGEBRAIC",
    "crossConceptKeys": [
      "CC_GREATEST_INTEGER_FUNCTION"
    ],
    "conditionKeys": [],
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
    "content": "$a_n=\\lfloor\\sqrt{9n^2+5n+2}\\rfloor$일 때 $\\lim_{n\\to\\infty}(\\sqrt{9n^2+5n+2}-a_n)$은?",
    "choices": [
      "$1/6$",
      "$1/3$",
      "$2/3$",
      "$5/6$",
      "$1$"
    ],
    "answer": "④",
    "solution": "$n\\ge2$일 때 $(3n)^2=9n^2<9n^2+5n+2<(3n+1)^2=9n^2+6n+1$이므로 $3n<\\sqrt{9n^2+5n+2}<3n+1$이다.\n따라서 $a_n=\\lfloor\\sqrt{9n^2+5n+2}\\rfloor=3n$이다.\n구하는 식은 $\\sqrt{9n^2+5n+2}-3n$이고, 분모를 유리화하면 $\\frac{(9n^2+5n+2)-9n^2}{\\sqrt{9n^2+5n+2}+3n}=\\frac{5n+2}{\\sqrt{9n^2+5n+2}+3n}$이다.\n분자와 분모를 $n$으로 나누면 $\\frac{5+\\frac2n}{\\sqrt{9+\\frac5n+\\frac2{n^2}}+3}$이다.\n$n\\to\\infty$일 때 $\\frac1n\\to0$, $\\frac1{n^2}\\to0$이므로 극한값은 $\\frac{5}{3+3}=\\frac56$이다.\n주의: $n=1$에서는 $a_1=4\\neq3$이지만 극한에는 영향을 주지 않는다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-056",
    "problemTypeKey": "PT_CALCULUS_SEQUENCE_LIMIT",
    "templateKey": "TPL_CALCULUS_SEQ_LIMIT_ALGEBRAIC",
    "crossConceptKeys": [
      "CC_GREATEST_INTEGER_FUNCTION"
    ],
    "conditionKeys": [],
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
    "content": "$\\sqrt{9n^2+6n+5}$의 정수 부분을 $a_n$, 소수 부분을 $b_n$이라 할 때 $\\lim_{n\\to\\infty}(a_nb_n)$은?",
    "choices": [
      "$1$",
      "$3/2$",
      "$2$",
      "$5/2$",
      "$3$"
    ],
    "answer": "③",
    "solution": "$(3n+1)^2=9n^2+6n+1<9n^2+6n+5<(3n+2)^2=9n^2+12n+4$이므로 $3n+1<\\sqrt{9n^2+6n+5}<3n+2$이다.\n따라서 정수 부분은 $a_n=3n+1$이고, 소수 부분은 $b_n=\\sqrt{9n^2+6n+5}-(3n+1)$이다.\n$b_n$을 유리화하면 $b_n=\\frac{(9n^2+6n+5)-(3n+1)^2}{\\sqrt{9n^2+6n+5}+(3n+1)}=\\frac{4}{\\sqrt{9n^2+6n+5}+3n+1}$이다.\n따라서 $a_nb_n=(3n+1)\\cdot\\frac{4}{\\sqrt{9n^2+6n+5}+3n+1}=\\frac{12n+4}{\\sqrt{9n^2+6n+5}+3n+1}$이다.\n분자와 분모를 $n$으로 나누면 $a_nb_n=\\frac{12+\\frac4n}{\\sqrt{9+\\frac6n+\\frac5{n^2}}+3+\\frac1n}$이다.\n$n\\to\\infty$일 때 $\\frac1n\\to0$, $\\frac1{n^2}\\to0$이므로 극한값은 $\\frac{12}{3+3}=2$이다.\n주의: $b_n\\to0$이지만 $a_n\\to\\infty$이므로 $a_nb_n$은 $0\\cdot\\infty$ 꼴이고, 곱을 정리한 뒤 극한을 구해야 한다.\n따라서 정답은 ③이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-056",
    "problemTypeKey": "PT_CALCULUS_SEQUENCE_LIMIT",
    "templateKey": "TPL_CALCULUS_SEQ_LIMIT_ALGEBRAIC",
    "crossConceptKeys": [
      "CC_GREATEST_INTEGER_FUNCTION"
    ],
    "conditionKeys": [],
    "integrationPattern": "REINTERPRETATION"
  }
];
