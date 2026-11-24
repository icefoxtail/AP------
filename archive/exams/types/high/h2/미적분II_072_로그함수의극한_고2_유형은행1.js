window.examTitle = "미적분II_072_로그함수의극한_고2_유형은행1";

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
    "content": "$\\lim_{x\\to\\infty}\\{\\log_{1/3}(9x+2)-\\log_{1/3}(x+4)\\}$의 값은?",
    "choices": [
      "$-5$",
      "$-4$",
      "$-3$",
      "$-2$",
      "$-1$"
    ],
    "answer": "④",
    "solution": "로그의 차를 하나의 로그로 합친다(로그의 성질): $\\log_{1/3}(9x+2)-\\log_{1/3}(x+4)=\\log_{1/3}\\frac{9x+2}{x+4}$.\n분모를 $x$로 나누어 진수의 극한을 계산한다: $\\frac{9x+2}{x+4}=\\frac{9+\\frac{2}{x}}{1+\\frac{4}{x}}\\to 9$.\n로그함수는 연속이므로 극한을 진수 안으로 넣는다: $\\lim_{x\\to\\infty}\\log_{1/3}\\frac{9x+2}{x+4}=\\log_{1/3}9$.\n$9=\\left(\\frac13\\right)^{-2}$이므로(지수법칙) $\\log_{1/3}9=-2$이다.\n따라서 정답은 ④이다.",
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
    "content": "$a=\\lim_{x\\to\\infty}\\{\\log_2(4x+7)-\\log_2(x+2)\\}$이고 $b=\\lim_{x\\to2^+}\\{\\log_2(x^2-4)-\\log_2(x-2)\\}$일 때 $a+b$는?",
    "choices": [
      "$4$",
      "$5$",
      "$6$",
      "$7$",
      "$8$"
    ],
    "answer": "①",
    "solution": "로그의 차를 합친다(로그의 성질): $a=\\lim_{x\\to\\infty}\\log_2\\frac{4x+7}{x+2}$.\n분모를 $x$로 나눈다: $\\frac{4x+7}{x+2}=\\frac{4+\\frac7x}{1+\\frac2x}\\to4$.\n로그함수의 연속성으로 $a=\\log_2 4=2$이다.\n$b$의 진수를 인수분해한다: $x^2-4=(x-2)(x+2)$.\n로그의 차를 합치고 약분한다: $b=\\lim_{x\\to2^+}\\log_2\\frac{(x-2)(x+2)}{x-2}=\\lim_{x\\to2^+}\\log_2(x+2)$.\n$x\\to2^+$일 때 $x+2\\to4$이므로 $b=\\log_2 4=2$이다.\n따라서 $a+b=2+2=4$이다.\n따라서 정답은 ①이다.",
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
    "content": "$a=\\lim_{x\\to\\infty}\\frac{3^{x+1}-e^x}{3^x+e^x}$, $b=\\lim_{x\\to\\infty}\\log_3\\frac{9x^2+2}{x^2+7}$일 때 $a+b$는?",
    "choices": [
      "$3$",
      "$4$",
      "$5$",
      "$6$",
      "$7$"
    ],
    "answer": "③",
    "solution": "$e<3$이므로 $0<\\frac e3<1$이다(자연로그의 밑).\n첫째 식의 분자와 분모를 $3^x$로 나눈다: $a=\\lim_{x\\to\\infty}\\frac{3-\\left(\\frac e3\\right)^x}{1+\\left(\\frac e3\\right)^x}$.\n등비수열의 극한 $\\left(\\frac e3\\right)^x\\to0$을 적용하면 $a=\\frac{3-0}{1+0}=3$이다.\n둘째 진수를 $x^2$으로 나눈다: $\\frac{9x^2+2}{x^2+7}=\\frac{9+\\frac2{x^2}}{1+\\frac7{x^2}}\\to9$.\n로그함수의 연속성으로 $b=\\log_3 9=2$이다.\n따라서 $a+b=3+2=5$이다.\n따라서 정답은 ③이다.",
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
    "content": "$\\lim_{x\\to\\infty}\\{\\log(ax)-\\log(3x+7)\\}=1$일 때 양수 $a$의 값은? (단, $\\log$는 상용로그이다.)",
    "choices": [
      "$25$",
      "$30$",
      "$35$",
      "$40$",
      "$45$"
    ],
    "answer": "②",
    "solution": "로그의 차를 합친다(로그의 성질): $\\lim_{x\\to\\infty}\\{\\log(ax)-\\log(3x+7)\\}=\\lim_{x\\to\\infty}\\log\\frac{ax}{3x+7}$.\n진수의 극한을 계산한다: $\\frac{ax}{3x+7}=\\frac a{3+\\frac7x}\\to\\frac a3$.\n로그함수의 연속성으로 $\\log\\frac a3=1$이다.\n상용로그의 정의 $\\log y=1\\iff y=10$을 적용하면 $\\frac a3=10$이다.\n양변에 3을 곱하면 $a=30$이다.\n따라서 정답은 ②이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-146",
    "problemTypeKey": "PT_LIMIT_VALUE_CALC",
    "templateKey": "TPL_LIMIT_EXP_LOG_STANDARD",
    "crossConceptKeys": [],
    "conditionKeys": [
      "COND_POSITIVE"
    ],
    "integrationPattern": "SEQUENTIAL"
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
    "content": "$a=\\lim_{x\\to\\infty}\\frac{5^{2x}-5^x}{5^{2x}+5^x}$, $b=\\lim_{x\\to\\infty}(4^x+3^x)^{1/x}$, $c=\\lim_{x\\to\\infty}\\frac{\\log_2(x^4)-2}{\\log_2(5x)+3}$, $d=\\lim_{x\\to\\infty}\\{\\log_3(27x^2+1)-2\\log_3x\\}$일 때 $a+b+c+d$는?",
    "choices": [
      "$8$",
      "$9$",
      "$10$",
      "$11$",
      "$12$"
    ],
    "answer": "⑤",
    "solution": "$a$: 분자와 분모를 $5^{2x}$로 나눈다: $a=\\lim_{x\\to\\infty}\\frac{1-5^{-x}}{1+5^{-x}}$.\n등비수열의 극한 $5^{-x}\\to0$이므로 $a=\\frac{1-0}{1+0}=1$이다.\n$b$: $4^x$를 묶는다: $(4^x+3^x)^{1/x}=4\\left(1+\\left(\\frac34\\right)^x\\right)^{1/x}$.\n$0<\\frac34<1$이므로 $\\left(\\frac34\\right)^x\\to0$이고, $\\left(1+\\left(\\frac34\\right)^x\\right)^{1/x}\\to1$이다.\n따라서 $b=4\\cdot1=4$이다.\n$c$: 분자를 정리하면 $\\log_2(x^4)-2=4\\log_2x-2$이다(로그의 성질).\n분모는 $\\log_2(5x)+3=\\log_2x+\\log_2 5+3$이다.\n분자와 분모를 $\\log_2x$로 나누면 $c=\\lim_{x\\to\\infty}\\frac{4-\\frac2{\\log_2x}}{1+\\frac{\\log_2 5+3}{\\log_2x}}$.\n$\\log_2x\\to\\infty$이므로 $\\frac1{\\log_2x}\\to0$이고 $c=\\frac41=4$이다.\n$d$: 로그의 차를 합치면 $\\log_3(27x^2+1)-2\\log_3x=\\log_3\\frac{27x^2+1}{x^2}=\\log_3\\left(27+\\frac1{x^2}\\right)$.\n$\\frac1{x^2}\\to0$이고 로그함수가 연속이므로 $d=\\log_3 27=3$이다.\n따라서 $a+b+c+d=1+4+4+3=12$이다.\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-146",
    "problemTypeKey": "PT_LIMIT_VALUE_CALC",
    "templateKey": "TPL_LIMIT_EXP_LOG_STANDARD",
    "crossConceptKeys": [],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
  }
];
