window.examTitle = "미적분II_071_지수함수의극한_고2_유형은행1";

window.questionBank = [
  {
    "id": 1,
    "category": "지수함수와 로그함수의 미분",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-03",
    "standardUnit": "지수함수와 로그함수의 미분",
    "standardUnitOrder": 3,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "지수함수와 로그함수의 미분"
    ],
    "wide": false,
    "content": "$\\lim_{x\\to\\infty}\\frac{5^{x+1}-2^{x+2}}{5^x+2^x}$의 값은?",
    "choices": [
      "$5$",
      "$6$",
      "$7$",
      "$8$",
      "$9$"
    ],
    "answer": "①",
    "solution": "분자와 분모를 $5^x$로 나누면 (분모의 최고차항으로 정리)\n$$\\frac{5^{x+1}-2^{x+2}}{5^x+2^x}=\\frac{5-2^2(2/5)^x}{1+(2/5)^x}$$\n$0<\\frac25<1$이므로 등비수열의 극한에서 $(2/5)^x\\to0$이다.\n따라서 극한값은 $\\frac{5-0}{1+0}=5$이다.\n따라서 정답은 ①이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-146",
    "problemTypeKey": "PT_LIMIT_VALUE_CALC",
    "templateKey": "TPL_LIMIT_EXP_LOG_STANDARD",
    "crossConceptKeys": [],
    "conditionKeys": [],
    "integrationPattern": "NONE"
  },
  {
    "id": 2,
    "category": "지수함수와 로그함수의 미분",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-03",
    "standardUnit": "지수함수와 로그함수의 미분",
    "standardUnitOrder": 3,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "지수함수와 로그함수의 미분"
    ],
    "wide": false,
    "content": "$\\lim_{x\\to\\infty}\\frac{a\\cdot4^x-7}{4^{x-2}+2}=48$일 때 $a$의 값은?",
    "choices": [
      "$1$",
      "$2$",
      "$3$",
      "$4$",
      "$5$"
    ],
    "answer": "③",
    "solution": "분모의 $4^{x-2}=\\frac{4^x}{16}$임을 이용한다.\n분자와 분모를 $4^x$로 나누면\n$$\\frac{a\\cdot4^x-7}{4^{x-2}+2}=\\frac{a-\\frac{7}{4^x}}{\\frac1{16}+\\frac{2}{4^x}}$$\n$0<\\frac14<1$이므로 등비수열의 극한에서 $\\frac{1}{4^x}\\to0$이다.\n따라서 극한값은 $\\frac{a}{1/16}=16a$이다.\n$16a=48$에서 $a=3$이다.\n따라서 정답은 ③이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-146",
    "problemTypeKey": "PT_LIMIT_VALUE_CALC",
    "templateKey": "TPL_LIMIT_EXP_LOG_STANDARD",
    "crossConceptKeys": [],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 3,
    "category": "지수함수와 로그함수의 미분",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-03",
    "standardUnit": "지수함수와 로그함수의 미분",
    "standardUnitOrder": 3,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "지수함수와 로그함수의 미분"
    ],
    "wide": false,
    "content": "$\\lim_{x\\to\\infty}\\frac{7^x}{7^x+a^x}+\\lim_{x\\to\\infty}\\frac{a^x}{7^x+2}=1$을 만족시키는 자연수 $a$의 개수는?",
    "choices": [
      "$2$",
      "$3$",
      "$4$",
      "$5$",
      "$6$"
    ],
    "answer": "⑤",
    "solution": "첫째 극한은 분자와 분모를 $7^x$로 나누어 정리한다.\n$$\\lim_{x\\to\\infty}\\frac{7^x}{7^x+a^x}=\\lim_{x\\to\\infty}\\frac1{1+(a/7)^x}$$\n둘째 극한은 분자와 분모를 $7^x$로 나누어 정리한다.\n$$\\lim_{x\\to\\infty}\\frac{a^x}{7^x+2}=\\lim_{x\\to\\infty}\\frac{(a/7)^x}{1+2/7^x}$$\n(i) $1\\le a<7$이면 $0<\\frac a7<1$이므로 등비수열의 극한에서 $(a/7)^x\\to0$이다.\n이때 첫째 극한은 $\\frac1{1+0}=1$, 둘째 극한은 $\\frac0{1+0}=0$이므로 합은 $1$이다.\n(ii) $a=7$이면 $(a/7)^x=1$이므로 첫째 극한은 $\\frac1{1+1}=\\frac12$, 둘째 극한은 $\\frac1{1+0}=1$이다.\n합은 $\\frac12+1=\\frac32\\ne1$이다.\n(iii) $a>7$이면 $\\frac a7>1$이므로 $(a/7)^x\\to\\infty$이고 둘째 극한은 발산한다.\n따라서 조건을 만족하는 자연수는 $a=1,2,3,4,5,6$의 $6$개이다.\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-146",
    "problemTypeKey": "PT_LIMIT_VALUE_CALC",
    "templateKey": "TPL_LIMIT_EXP_LOG_STANDARD",
    "crossConceptKeys": [],
    "conditionKeys": [
      "COND_NATURAL_NUMBER"
    ],
    "integrationPattern": "CASE_BRANCH"
  },
  {
    "id": 4,
    "category": "지수함수와 로그함수의 미분",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-03",
    "standardUnit": "지수함수와 로그함수의 미분",
    "standardUnitOrder": 3,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "지수함수와 로그함수의 미분"
    ],
    "wide": false,
    "content": "$\\lim_{x\\to\\infty}\\frac{a^{x+3}+8^{x+3}}{a^x+8^x+3}=512$를 만족시키는 자연수 $a$의 개수는?",
    "choices": [
      "$4$",
      "$5$",
      "$6$",
      "$7$",
      "$8$"
    ],
    "answer": "⑤",
    "solution": "분자의 두 항을 각각 밑의 거듭제곱으로 묶으면 (지수법칙)\n$$a^{x+3}=a^3a^x,\\qquad 8^{x+3}=8^3\\cdot8^x=512\\cdot8^x$$\n(i) $a<8$이면 분모에서 $8^x$가 최고차항이므로 분자와 분모를 $8^x$로 나눈다.\n$$\\frac{a^3(a/8)^x+512}{(a/8)^x+1+\\frac3{8^x}}\\to\\frac{0+512}{0+1+0}=512$$\n(ii) $a=8$이면 분자는 $512\\cdot8^x+512\\cdot8^x=1024\\cdot8^x$이고 분모는 $2\\cdot8^x+3$이다.\n분자와 분모를 $8^x$로 나누면\n$$\\frac{1024}{2+\\frac3{8^x}}\\to\\frac{1024}{2}=512$$\n(iii) $a>8$이면 분자와 분모를 $a^x$로 나누면\n$$\\frac{a^3+512(8/a)^x}{1+(8/a)^x+\\frac3{a^x}}\\to a^3$$\n$a>8$이므로 $a^3>512$이고 극한값은 $512$가 될 수 없다.\n따라서 $a=1,2,\\ldots,8$의 $8$개이다.\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-146",
    "problemTypeKey": "PT_LIMIT_VALUE_CALC",
    "templateKey": "TPL_LIMIT_EXP_LOG_STANDARD",
    "crossConceptKeys": [],
    "conditionKeys": [
      "COND_NATURAL_NUMBER"
    ],
    "integrationPattern": "CASE_BRANCH"
  },
  {
    "id": 5,
    "category": "지수함수와 로그함수의 미분",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-03",
    "standardUnit": "지수함수와 로그함수의 미분",
    "standardUnitOrder": 3,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "지수함수와 로그함수의 미분"
    ],
    "wide": false,
    "content": "$\\lim_{x\\to\\infty}(7^x+4^x)^{2/x}$의 값은?",
    "choices": [
      "$28$",
      "$35$",
      "$42$",
      "$49$",
      "$56$"
    ],
    "answer": "④",
    "solution": "밑이 큰 $7^x$를 묶으면 (지수법칙)\n$$(7^x+4^x)^{2/x}=\\left\\{7^x\\left(1+\\left(\\frac47\\right)^x\\right)\\right\\}^{2/x}=49\\left(1+\\left(\\frac47\\right)^x\\right)^{2/x}$$\n$0<\\frac47<1$이므로 등비수열의 극한에서 $(4/7)^x\\to0$이다.\n$\\ln(1+t)<t$ $(t>0)$에서 $0<\\frac2x\\ln\\left(1+(4/7)^x\\right)<\\frac2x(4/7)^x\\to0$이므로 (조임정리)\n$$\\frac2x\\ln\\left(1+\\left(\\frac47\\right)^x\\right)\\to0$$\n지수함수의 연속성에 의해 $\\left(1+(4/7)^x\\right)^{2/x}\\to e^0=1$이다.\n그러므로 구하는 극한값은 $49\\cdot1=49$이다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-146",
    "problemTypeKey": "PT_LIMIT_VALUE_CALC",
    "templateKey": "TPL_LIMIT_EXP_LOG_STANDARD",
    "crossConceptKeys": [],
    "conditionKeys": [],
    "integrationPattern": "NONE"
  },
  {
    "id": 6,
    "category": "지수함수와 로그함수의 미분",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-03",
    "standardUnit": "지수함수와 로그함수의 미분",
    "standardUnitOrder": 3,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "지수함수와 로그함수의 미분"
    ],
    "wide": false,
    "content": "$\\lim_{x\\to\\infty}\\frac{\\log_2(8^x+3^x)}{x}$의 값은?",
    "choices": [
      "$3$",
      "$4$",
      "$5$",
      "$6$",
      "$7$"
    ],
    "answer": "①",
    "solution": "$\\log_2(8^x+3^x)$에서 $8^x$를 묶으면 (로그의 성질)\n$$\\log_2(8^x+3^x)=\\log_2\\left\\{8^x\\left(1+\\left(\\frac38\\right)^x\\right)\\right\\}=\\log_2 8^x+\\log_2\\left(1+\\left(\\frac38\\right)^x\\right)$$\n$\\log_2 8^x=x\\log_2 8=3x$이다.\n$0<\\frac38<1$이므로 등비수열의 극한에서 $(3/8)^x\\to0$이고, $\\log_2(1+(3/8)^x)\\to\\log_2 1=0$이다.\n따라서 극한값은\n$$\\lim_{x\\to\\infty}\\frac{3x+\\log_2(1+(3/8)^x)}{x}=3+0=3$$\n따라서 정답은 ①이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-146",
    "problemTypeKey": "PT_LIMIT_VALUE_CALC",
    "templateKey": "TPL_LIMIT_EXP_LOG_STANDARD",
    "crossConceptKeys": [],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
  }
];
