window.examTitle = "미적분II_025_등비수열의극한의대소관계_고2_유형은행1";

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
    "content": "모든 자연수 $n$에서 $6^{n+1}-4^n<(6^n+2\\cdot3^n)a_n<6^{n+1}+4^n$일 때 $\\lim_{n\\to\\infty}a_n$은?",
    "choices": [
      "$2$",
      "$3$",
      "$4$",
      "$5$",
      "$6$"
    ],
    "answer": "⑤",
    "solution": "양변을 양수 $6^n+2\\cdot3^n$으로 나눈다. (부등식의 성질)\n$$\\frac{6^{n+1}-4^n}{6^n+2\\cdot3^n}<a_n<\\frac{6^{n+1}+4^n}{6^n+2\\cdot3^n}$$\n두 경계식의 분자·분모를 $6^n$으로 나눈다.\n$$\\frac{6-(2/3)^n}{1+2(1/2)^n}<a_n<\\frac{6+(2/3)^n}{1+2(1/2)^n}$$\n$|2/3|<1$, $|1/2|<1$이므로 등비수열의 극한에서 $(2/3)^n\\to0$, $(1/2)^n\\to0$이다.\n따라서 두 경계의 극한은 모두 $\\frac{6-0}{1+0}=6$이다.\n끼워넣기 정리에 의해 $\\lim_{n\\to\\infty}a_n=6$이다.\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-059",
    "problemTypeKey": "PT_CALCULUS_SEQUENCE_LIMIT",
    "templateKey": "TPL_CALCULUS_SEQ_LIMIT_SQUEEZE",
    "crossConceptKeys": [],
    "conditionKeys": [
      "COND_UNIVERSAL_INPUTS"
    ],
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
    "content": "모든 자연수 $n$에서 $8^{n+1}-5^n<(2\\cdot8^n+4^{n+1})a_n<8^{n+1}+3^n$일 때 $\\lim_{n\\to\\infty}a_n$은?",
    "choices": [
      "$4$",
      "$5$",
      "$6$",
      "$7$",
      "$8$"
    ],
    "answer": "①",
    "solution": "양변을 양수 $2\\cdot8^n+4^{n+1}$로 나눈다. (부등식의 성질)\n$$\\frac{8^{n+1}-5^n}{2\\cdot8^n+4^{n+1}}<a_n<\\frac{8^{n+1}+3^n}{2\\cdot8^n+4^{n+1}}$$\n분자·분모를 $8^n$으로 나눈다.\n$$\\frac{8-(5/8)^n}{2+4(1/2)^n}<a_n<\\frac{8+(3/8)^n}{2+4(1/2)^n}$$\n$|5/8|<1$, $|3/8|<1$, $|1/2|<1$이므로 각 거듭제곱은 $0$으로 수렴한다. (등비수열의 극한)\n두 경계의 극한은 $\\frac{8-0}{2+0}=4$로 같다.\n끼워넣기 정리에 의해 $\\lim_{n\\to\\infty}a_n=4$이다.\n따라서 정답은 ①이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-059",
    "problemTypeKey": "PT_CALCULUS_SEQUENCE_LIMIT",
    "templateKey": "TPL_CALCULUS_SEQ_LIMIT_SQUEEZE",
    "crossConceptKeys": [],
    "conditionKeys": [
      "COND_UNIVERSAL_INPUTS"
    ],
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
    "content": "모든 자연수 $n$에서 $\\left|a_n-\\frac{2\\cdot5^n+3^{n+1}}{5^n+3^n}\\right|<(1/4)^n$일 때 $\\lim_{n\\to\\infty}a_n$은?",
    "choices": [
      "$1$",
      "$2$",
      "$3$",
      "$4$",
      "$5$"
    ],
    "answer": "②",
    "solution": "주어진 부등식은 $|a_n-b_n|<(1/4)^n$, $b_n=\\frac{2\\cdot5^n+3^{n+1}}{5^n+3^n}$이다.\n$b_n$의 분자·분모를 $5^n$으로 나눈다.\n$$b_n=\\frac{2+3(3/5)^n}{1+(3/5)^n}$$\n$|3/5|<1$이므로 등비수열의 극한에서 $(3/5)^n\\to0$이다.\n따라서 $\\lim_{n\\to\\infty}b_n=\\frac{2+0}{1+0}=2$이다.\n$(1/4)^n\\to0$이고 $|a_n-b_n|<(1/4)^n$이므로 끼워넣기 정리에 의해 $a_n-b_n\\to0$이다.\n즉 $\\lim_{n\\to\\infty}a_n=\\lim_{n\\to\\infty}b_n=2$이다.\n따라서 정답은 ②이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-059",
    "problemTypeKey": "PT_CALCULUS_SEQUENCE_LIMIT",
    "templateKey": "TPL_CALCULUS_SEQ_LIMIT_SQUEEZE",
    "crossConceptKeys": [],
    "conditionKeys": [
      "COND_UNIVERSAL_INPUTS"
    ],
    "integrationPattern": "NONE"
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
    "content": "$9^n<a_n<9^n+2$, $3+3^2+\\cdots+3^n<b_n<3^{n+1}/2$일 때 $\\lim_{n\\to\\infty}\\frac{3a_n+b_n}{a_n+3^nb_n}$은?",
    "choices": [
      "$\\frac45$",
      "$1$",
      "$\\frac65$",
      "$\\frac75$",
      "$\\frac85$"
    ],
    "answer": "③",
    "solution": "$a_n$의 부등식 $9^n<a_n<9^n+2$의 각 변을 $9^n$으로 나눈다.\n$$1<\\frac{a_n}{9^n}<1+\\frac{2}{9^n}$$\n$\\frac{2}{9^n}\\to0$이므로 끼워넣기 정리에 의해 $\\frac{a_n}{9^n}\\to1$이다.\n$3+3^2+\\cdots+3^n=\\frac{3(3^n-1)}{3-1}=\\frac{3^{n+1}-3}{2}$이다. (등비수열의 합)\n이를 $b_n$의 부등식에 대입한다.\n$$\\frac{3^{n+1}-3}{2}<b_n<\\frac{3^{n+1}}{2}$$\n각 변을 $3^n$으로 나누면 $\\frac{3-3/3^n}{2}<\\frac{b_n}{3^n}<\\frac32$이고, 양 끝이 $\\frac32$로 수렴한다.\n따라서 $\\frac{b_n}{3^n}\\to\\frac32$이다. (끼워넣기 정리)\n구하는 식의 분자·분모를 $9^n$으로 나눈다.\n$$\\frac{3\\frac{a_n}{9^n}+\\frac{b_n}{9^n}}{\\frac{a_n}{9^n}+\\frac{3^n b_n}{9^n}}=\\frac{3\\frac{a_n}{9^n}+\\frac1{3^n}\\frac{b_n}{3^n}}{\\frac{a_n}{9^n}+\\frac{b_n}{3^n}}$$\n$\\frac1{3^n}\\to0$, $\\frac{a_n}{9^n}\\to1$, $\\frac{b_n}{3^n}\\to\\frac32$이므로 극한은 $\\frac{3\\cdot1+0}{1+\\frac32}=\\frac65$이다.\n따라서 정답은 ③이다.",
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
    "content": "모든 자연수 $n$에 대해 $\\frac{3\\cdot5^n-1}{2\\cdot5^n+3^n}<\\sum_{k=1}^n a_k<\\frac{3\\cdot5^n+2^n}{2\\cdot5^n}$일 때 $\\sum_{n=1}^\\infty a_n$은?",
    "choices": [
      "$\\frac12$",
      "$\\frac34$",
      "$1$",
      "$\\frac32$",
      "$2$"
    ],
    "answer": "④",
    "solution": "$S_n=\\sum_{k=1}^n a_k$라 하면 주어진 부등식은 $L_n<S_n<U_n$이다.\n$L_n=\\frac{3\\cdot5^n-1}{2\\cdot5^n+3^n}$, $U_n=\\frac{3\\cdot5^n+2^n}{2\\cdot5^n}$의 분자·분모를 $5^n$으로 나눈다.\n$$L_n=\\frac{3-(1/5)^n}{2+(3/5)^n},\\qquad U_n=\\frac{3+(2/5)^n}{2}$$\n$|1/5|<1$, $|3/5|<1$, $|2/5|<1$이므로 각 거듭제곱은 $0$으로 수렴한다. (등비수열의 극한)\n따라서 $\\lim_{n\\to\\infty}L_n=\\frac{3-0}{2+0}=\\frac32$, $\\lim_{n\\to\\infty}U_n=\\frac{3+0}{2}=\\frac32$이다.\n끼워넣기 정리에 의해 $\\lim_{n\\to\\infty}S_n=\\frac32$이다.\n급수의 합은 부분합의 극한이므로 $\\sum_{n=1}^\\infty a_n=\\frac32$이다. (급수와 부분합의 관계)\n따라서 정답은 ④이다.",
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
    "content": "모든 자연수 $n$에 대해 $0<a_{n+1}\\le a_n/3$, $a_1>0$일 때 $\\lim_{n\\to\\infty}\\frac{2a_n+9n+1}{5a_n+3n+4}$는?",
    "choices": [
      "$0$",
      "$1$",
      "$2$",
      "$3$",
      "$4$"
    ],
    "answer": "④",
    "solution": "$0<a_{n+1}\\le\\frac13 a_n$을 반복 적용한다.\n$$0<a_n\\le a_1\\left(\\frac13\\right)^{n-1}$$\n$|1/3|<1$이므로 등비수열의 극한에서 $a_1(1/3)^{n-1}\\to0$이다.\n끼워넣기 정리에 의해 $\\lim_{n\\to\\infty}a_n=0$이다.\n그러면 $0\\le\\frac{a_n}{n}\\le\\frac{a_1}{n}\\left(\\frac13\\right)^{n-1}\\to0$이므로 $\\lim_{n\\to\\infty}\\frac{a_n}{n}=0$이다.\n구하는 식의 분자·분모를 $n$으로 나눈다.\n$$\\frac{2a_n+9n+1}{5a_n+3n+4}=\\frac{2\\frac{a_n}{n}+9+\\frac1n}{5\\frac{a_n}{n}+3+\\frac4n}$$\n$\\frac{a_n}{n}\\to0$, $\\frac1n\\to0$, $\\frac4n\\to0$이므로 극한은 $\\frac{0+9+0}{0+3+0}=3$이다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-059",
    "problemTypeKey": "PT_CALCULUS_SEQUENCE_LIMIT",
    "templateKey": "TPL_CALCULUS_SEQ_LIMIT_SQUEEZE",
    "crossConceptKeys": [],
    "conditionKeys": [
      "COND_POSITIVE",
      "COND_INEQUALITY_CONSTRAINT"
    ],
    "integrationPattern": "SEQUENTIAL"
  }
];
