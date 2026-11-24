window.examTitle = "미적분II_075_밑이e인지수로그함수의극한값의활용_고2_유형은행1";

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
    "content": "$\\lim_{x\\to0}\\frac{\\sum_{k=1}^{6}e^{2kx}-6}{x}$의 값은?",
    "choices": [
      "$42$",
      "$48$",
      "$54$",
      "$60$",
      "$66$"
    ],
    "answer": "①",
    "solution": "식을 각 항의 $1$을 분리해 정리한다(지수함수의 극한).\n$\\sum_{k=1}^{6}e^{2kx}-6=\\sum_{k=1}^{6}(e^{2kx}-1)$이므로 주어진 극한은 $\\sum_{k=1}^{6}\\lim_{x\\to0}\\frac{e^{2kx}-1}{x}$이다.\n$\\lim_{x\\to0}\\frac{e^{2kx}-1}{x}=2k$를 각 항에 대입한다.\n$\\sum_{k=1}^{6}2k=2(1+2+3+4+5+6)=2\\cdot21=42$이다.\n따라서 정답은 ①이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-146",
    "problemTypeKey": "PT_LIMIT_VALUE_CALC",
    "templateKey": "TPL_LIMIT_EXP_LOG_STANDARD",
    "crossConceptKeys": [
      "CC_SERIES_SUM"
    ],
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
    "content": "$\\lim_{x\\to0}\\frac{\\ln\\{(1-3x)(1+3x)\\}}{3x^2}$의 값은?",
    "choices": [
      "$-5$",
      "$-4$",
      "$-3$",
      "$-2$",
      "$-1$"
    ],
    "answer": "③",
    "solution": "곱을 전개해 로그 안을 정리한다(로그의 성질).\n$(1-3x)(1+3x)=1-9x^2$이므로 주어진 식은 $\\frac{\\ln(1-9x^2)}{3x^2}$이다.\n$t=-9x^2$로 놓으면 $t\\to0$이고 $\\lim_{t\\to0}\\frac{\\ln(1+t)}{t}=1$이다(로그함수의 극한).\n$\\frac{\\ln(1-9x^2)}{3x^2}=\\frac{\\ln(1-9x^2)}{-9x^2}\\cdot\\frac{-9x^2}{3x^2}=\\frac{\\ln(1-9x^2)}{-9x^2}\\cdot(-3)$이다.\n따라서 극한은 $1\\cdot(-3)=-3$이다.\n주의: 분모가 $3x^2$이므로 로그 극한의 기준인 $-9x^2$과의 계수 차이를 반드시 보정해야 한다.\n따라서 정답은 ③이다.",
    "difficultyBucket": 2,
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
    "content": "$a=\\lim_{x\\to0}\\frac{e^{4x}+e^{2x}-2}{x}$, $b=\\lim_{x\\to0}\\frac{\\ln\\{(1+x)(1+3x)(1+5x)\\}}{x}$일 때 $a+b$는?",
    "choices": [
      "$12$",
      "$13$",
      "$14$",
      "$15$",
      "$16$"
    ],
    "answer": "④",
    "solution": "$a$의 분자를 각 지수항에서 $1$씩 빼서 나눈다(지수함수의 극한).\n$a=\\lim_{x\\to0}\\frac{(e^{4x}-1)+(e^{2x}-1)}{x}=\\lim_{x\\to0}\\frac{e^{4x}-1}{x}+\\lim_{x\\to0}\\frac{e^{2x}-1}{x}=4+2=6$이다.\n$b$는 로그의 성질로 곱을 합으로 바꾼다.\n$b=\\lim_{x\\to0}\\frac{\\ln(1+x)+\\ln(1+3x)+\\ln(1+5x)}{x}$이다.\n각 항에 $\\lim_{x\\to0}\\frac{\\ln(1+cx)}{x}=c$를 적용하면 $b=1+3+5=9$이다(로그함수의 극한).\n$a+b=6+9=15$이다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 2,
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
    "content": "$\\lim_{x\\to0}\\frac{\\ln\\{(1+2x)(1+4x)(1+6x)\\}}{e^{3x}-1}$의 값은?",
    "choices": [
      "$1$",
      "$2$",
      "$3$",
      "$4$",
      "$5$"
    ],
    "answer": "④",
    "solution": "로그의 성질로 분자의 곱을 합으로 바꾼다.\n$\\ln\\{(1+2x)(1+4x)(1+6x)\\}=\\ln(1+2x)+\\ln(1+4x)+\\ln(1+6x)$이다.\n분자를 $x$로 나눈 극한은 각 로그함수의 극한에 의해 $2+4+6=12$이다.\n분모도 $x$로 나누면 $\\frac{e^{3x}-1}{x}$이고, $\\lim_{x\\to0}\\frac{e^{3x}-1}{x}=3$이다(지수함수의 극한).\n따라서 전체 극한은 $\\frac{12}{3}=4$이다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 2,
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
    "content": "자연수 $n$에 대하여 $f(n)=\\lim_{x\\to0}\\frac{\\sum_{k=1}^n e^{3kx}-n}{x}$일 때 $\\sum_{n=1}^\\infty\\frac1{f(n)}$의 값은?",
    "choices": [
      "$\\frac13$",
      "$\\frac23$",
      "$\\frac43$",
      "$\\frac53$",
      "$\\frac83$"
    ],
    "answer": "②",
    "solution": "$f(n)$의 분자에서 $n$을 각 항의 $1$과 짝지어 정리한다.\n$f(n)=\\lim_{x\\to0}\\sum_{k=1}^{n}\\frac{e^{3kx}-1}{x}$이다.\n$\\lim_{x\\to0}\\frac{e^{3kx}-1}{x}=3k$이므로 $f(n)=\\sum_{k=1}^{n}3k$이다(지수함수의 극한).\n등차수열의 합 공식으로 $f(n)=3\\cdot\\frac{n(n+1)}{2}=\\frac{3n(n+1)}{2}$이다.\n따라서 $\\frac1{f(n)}=\\frac{2}{3n(n+1)}$이다.\n부분분수 분해로 $\\frac1{n(n+1)}=\\frac1n-\\frac1{n+1}$이므로 $\\frac1{f(n)}=\\frac23\\left(\\frac1n-\\frac1{n+1}\\right)$이다.\n부분합을 구하면 $\\sum_{n=1}^{N}\\frac1{f(n)}=\\frac23\\left(1-\\frac1{N+1}\\right)$이다(망원급수).\n$N\\to\\infty$일 때 $\\frac1{N+1}\\to0$이므로 급수의 합은 $\\frac23$이다.\n따라서 정답은 ②이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-146",
    "problemTypeKey": "PT_LIMIT_VALUE_CALC",
    "templateKey": "TPL_LIMIT_EXP_LOG_STANDARD",
    "crossConceptKeys": [
      "CC_SERIES_SUM",
      "CC_TELESCOPING_SERIES"
    ],
    "conditionKeys": [
      "COND_NATURAL_NUMBER"
    ],
    "integrationPattern": "SEQUENTIAL"
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
    "content": "$a_n=\\lim_{x\\to0}\\frac{\\ln\\{\\prod_{k=1}^{n}(1+4kx)\\}}{x}$일 때 $\\sum_{n=1}^{\\infty}\\frac1{a_n}$의 값은?",
    "choices": [
      "$\\frac12$",
      "$\\frac34$",
      "$1$",
      "$\\frac32$",
      "$2$"
    ],
    "answer": "①",
    "solution": "로그의 성질로 곱을 합으로 바꾼다.\n$\\ln\\left\\{\\prod_{k=1}^{n}(1+4kx)\\right\\}=\\sum_{k=1}^{n}\\ln(1+4kx)$이다.\n따라서 $a_n=\\lim_{x\\to0}\\sum_{k=1}^{n}\\frac{\\ln(1+4kx)}{x}$이다.\n$\\lim_{x\\to0}\\frac{\\ln(1+4kx)}{x}=4k$이므로 $a_n=\\sum_{k=1}^{n}4k$이다(로그함수의 극한).\n등차수열의 합 공식으로 $a_n=4\\cdot\\frac{n(n+1)}{2}=2n(n+1)$이다.\n따라서 $\\frac1{a_n}=\\frac1{2n(n+1)}$이다.\n부분분수 분해로 $\\frac1{n(n+1)}=\\frac1n-\\frac1{n+1}$이므로 $\\frac1{a_n}=\\frac12\\left(\\frac1n-\\frac1{n+1}\\right)$이다.\n부분합은 $\\sum_{n=1}^{N}\\frac1{a_n}=\\frac12\\left(1-\\frac1{N+1}\\right)$이다(망원급수).\n$N\\to\\infty$일 때 $\\frac1{N+1}\\to0$이므로 급수의 합은 $\\frac12$이다.\n따라서 정답은 ①이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-146",
    "problemTypeKey": "PT_LIMIT_VALUE_CALC",
    "templateKey": "TPL_LIMIT_EXP_LOG_STANDARD",
    "crossConceptKeys": [
      "CC_SERIES_SUM",
      "CC_TELESCOPING_SERIES"
    ],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
  }
];
