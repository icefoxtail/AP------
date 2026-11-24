window.examTitle = "미적분II_077_지수함수로그함수의역함수의극한값_고2_유형은행1";

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
    "content": "$f(x)=2\\ln(1+x)$의 역함수를 $g$라 할 때 $\\lim_{x\\to0}\\frac{f(x)}{g(x)}$의 값은?",
    "choices": [
      "$1$",
      "$2$",
      "$3$",
      "$4$",
      "$5$"
    ],
    "answer": "④",
    "solution": "역함수를 구하기 위해 $y=2\\ln(1+x)$로 놓으면 $\\frac{y}{2}=\\ln(1+x)$이다.\n지수함수로 바꾸면 $1+x=e^{y/2}$이므로 $x=e^{y/2}-1$, 즉 $g(x)=e^{x/2}-1$이다.\n로그의 기본 극한 $\\lim_{x\\to0}\\frac{\\ln(1+x)}{x}=1$과 지수함수의 기본 극한 $\\lim_{x\\to0}\\frac{e^{x/2}-1}{x}=\\frac12$을 쓴다.\n따라서 $\\lim_{x\\to0}\\frac{f(x)}{g(x)}=\\frac{2\\lim_{x\\to0}\\frac{\\ln(1+x)}{x}}{\\lim_{x\\to0}\\frac{e^{x/2}-1}{x}}=\\frac{2\\cdot1}{1/2}=4$이다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "B12",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-148",
    "problemTypeKey": "PT_LIMIT_VALUE_CALC",
    "templateKey": "TPL_LIMIT_EXP_LOG_STANDARD",
    "crossConceptKeys": [],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
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
    "content": "$f(x)=e^{4x}-1$의 역함수를 $g$라 할 때 $\\lim_{x\\to0}\\frac{g(x)}{x}$의 값은?",
    "choices": [
      "$\\frac14$",
      "$\\frac13$",
      "$\\frac12$",
      "$\\frac23$",
      "$\\frac34$"
    ],
    "answer": "①",
    "solution": "역함수를 구하기 위해 $y=e^{4x}-1$로 놓으면 $e^{4x}=1+y$이다.\n양변에 자연로그를 취하면 $4x=\\ln(1+y)$이므로 $x=\\frac14\\ln(1+y)$, 즉 $g(x)=\\frac14\\ln(1+x)$이다.\n로그의 기본 극한 $\\lim_{x\\to0}\\frac{\\ln(1+x)}{x}=1$을 적용한다.\n$\\lim_{x\\to0}\\frac{g(x)}{x}=\\frac14\\lim_{x\\to0}\\frac{\\ln(1+x)}{x}=\\frac14\\cdot1=\\frac14$이다.\n따라서 정답은 ①이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "B12",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-148",
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
    "content": "$f(x)=5\\ln x$의 역함수를 $g$라 할 때 $\\lim_{x\\to0}\\frac{f(1+2x)}{g(x)-g(0)}$의 값은?",
    "choices": [
      "$35$",
      "$40$",
      "$45$",
      "$50$",
      "$55$"
    ],
    "answer": "④",
    "solution": "역함수를 구하기 위해 $y=5\\ln x$로 놓으면 $\\frac{y}{5}=\\ln x$이다.\n지수함수로 바꾸면 $x=e^{y/5}$이므로 $g(x)=e^{x/5}$이고 $g(0)=e^0=1$이다.\n분자와 분모를 각각 $x$로 나누어 기본 극한을 만든다.\n$\\lim_{x\\to0}\\frac{f(1+2x)}{x}=5\\lim_{x\\to0}\\frac{\\ln(1+2x)}{x}=5\\cdot2=10$이다.\n$\\lim_{x\\to0}\\frac{g(x)-g(0)}{x}=\\lim_{x\\to0}\\frac{e^{x/5}-1}{x}=\\frac15$이다.\n따라서 주어진 극한은 $\\frac{10}{1/5}=50$이다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-148",
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
    "content": "$f(x)=\\log_5(x+6)$의 역함수를 $g$라 할 때 $\\lim_{x\\to0}\\frac{f(2x-5)}{g(x)+5}$의 값은?",
    "choices": [
      "$\\frac1{(\\ln5)^2}$",
      "$\\frac{3}{2(\\ln5)^2}$",
      "$\\frac2{(\\ln5)^2}$",
      "$\\frac3{(\\ln5)^2}$",
      "$\\frac4{(\\ln5)^2}$"
    ],
    "answer": "③",
    "solution": "역함수를 구하기 위해 $y=\\log_5(x+6)$로 놓으면 $x+6=5^y$이다.\n따라서 $x=5^y-6$이고 $g(x)=5^x-6$이다.\n$g(x)+5=5^x-1$이고 $f(2x-5)=\\log_5(1+2x)=\\frac{\\ln(1+2x)}{\\ln5}$이다.\n분자와 분모를 $x$로 나누면 $\\lim_{x\\to0}\\frac{\\ln(1+2x)}{x}=2$, $\\lim_{x\\to0}\\frac{5^x-1}{x}=\\ln5$이다.\n따라서 극한은 $\\lim_{x\\to0}\\frac{\\ln(1+2x)}{\\ln5\\,(5^x-1)}=\\frac{2/\\ln5}{\\ln5}=\\frac{2}{(\\ln5)^2}$이다.\n따라서 정답은 ③이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-148",
    "problemTypeKey": "PT_LIMIT_VALUE_CALC",
    "templateKey": "TPL_LIMIT_EXP_LOG_STANDARD",
    "crossConceptKeys": [],
    "conditionKeys": [],
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
    "content": "양의 실수에서 정의된 $f(x)=\\ln\\sqrt[5]{x}$의 역함수를 $g$라 할 때 $\\lim_{x\\to0}\\frac{f(g(x))}{g(x)-1}$의 값은?",
    "choices": [
      "$\\frac15$",
      "$\\frac14$",
      "$\\frac13$",
      "$\\frac12$",
      "$\\frac23$"
    ],
    "answer": "①",
    "solution": "$f(x)=\\ln\\sqrt[5]{x}=\\frac15\\ln x$이므로 역함수는 $g(x)=e^{5x}$이다.\n역함수의 정의에 따라 $f(g(x))=x$이다.\n분모는 $g(x)-1=e^{5x}-1$이다.\n지수함수의 기본 극한 $\\lim_{x\\to0}\\frac{e^{5x}-1}{x}=5$를 이용한다.\n$\\lim_{x\\to0}\\frac{f(g(x))}{g(x)-1}=\\lim_{x\\to0}\\frac{x}{e^{5x}-1}=\\frac{1}{5}$이다.\n따라서 정답은 ①이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B12",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-148",
    "problemTypeKey": "PT_LIMIT_VALUE_CALC",
    "templateKey": "TPL_LIMIT_EXP_LOG_STANDARD",
    "crossConceptKeys": [],
    "conditionKeys": [
      "COND_POSITIVE"
    ],
    "integrationPattern": "NONE"
  }
];
