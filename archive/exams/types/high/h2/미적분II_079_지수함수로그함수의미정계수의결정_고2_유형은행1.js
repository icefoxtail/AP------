window.examTitle = "미적분II_079_지수함수로그함수의미정계수의결정_고2_유형은행1";

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
    "content": "$\\lim_{x\\to0}\\frac{\\ln(a+4x)}{2x}=b$를 만족시키는 실수 $a,b$에 대하여 $a+b$는?",
    "choices": [
      "$-1$",
      "$0$",
      "$1$",
      "$2$",
      "$3$"
    ],
    "answer": "⑤",
    "solution": "분모 $2x\\to0$이고 극한이 유한하므로 분자도 $0$에 수렴한다.(극한의 성질)\n$\\ln(a+4\\cdot0)=\\ln a=0$이므로 $a=1$이다.\n$a=1$을 대입하면 $\\lim_{x\\to0}\\frac{\\ln(1+4x)}{2x}$이다.\n기본 극한 $\\lim_{t\\to0}\\frac{\\ln(1+t)}t=1$을 쓰기 위해 분모와 분자를 맞춘다.\n$\\frac{\\ln(1+4x)}{2x}=\\frac{\\ln(1+4x)}{4x}\\cdot\\frac{4x}{2x}\\to1\\cdot2=2$이므로 $b=2$이다.\n따라서 $a+b=1+2=3$이다.\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B12",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-152",
    "problemTypeKey": "PT_LIMIT_PARAMETER_DETERMINATION",
    "templateKey": "TPL_LIMIT_FINITE_CONDITION_PARAMETER",
    "crossConceptKeys": [
      "CC_FUNCTION_CONTINUITY"
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
    "content": "$\\lim_{x\\to0}\\frac{e^{ax}-1}{3x-b}=2$일 때 $a+b$는?",
    "choices": [
      "$6$",
      "$7$",
      "$8$",
      "$9$",
      "$10$"
    ],
    "answer": "①",
    "solution": "$x\\to0$일 때 분자 $e^{ax}-1\\to0$이다.\n분모 $3x-b\\to-b$인데, 만약 $b\\ne0$이면 극한은 $0/(-b)=0$이므로 주어진 극한 $2$가 될 수 없다.\n따라서 $b=0$이어야 한다.\n$b=0$을 대입하고 기본 극한 $\\lim_{t\\to0}\\frac{e^t-1}{t}=1$을 쓰기 위해 $ax=t$로 둔다.\n$\\frac{e^{ax}-1}{3x}=\\frac{a}{3}\\cdot\\frac{e^{ax}-1}{ax}\\to\\frac{a}{3}\\cdot1=\\frac a3$이다.\n$\\frac a3=2$이므로 $a=6$이다.\n$ a+b=6+0=6$이다.\n따라서 정답은 ①이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "B12",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-152",
    "problemTypeKey": "PT_LIMIT_PARAMETER_DETERMINATION",
    "templateKey": "TPL_LIMIT_FINITE_CONDITION_PARAMETER",
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
    "content": "$\\lim_{x\\to0}\\frac{\\ln(1+2x)}{e^{ax}+b}=\\frac23$일 때 $ab$는?",
    "choices": [
      "$-5$",
      "$-4$",
      "$-3$",
      "$-2$",
      "$-1$"
    ],
    "answer": "③",
    "solution": "$x\\to0$일 때 분자 $\\ln(1+2x)\\to0$이다.\n분모 $e^{ax}+b\\to1+b$이고 극한값 $\\frac23\\ne0$이므로 분모도 $0$에 수렴해야 한다.\n따라서 $1+b=0$에서 $b=-1$이다.\n$b=-1$을 대입하면 $\\frac{\\ln(1+2x)}{e^{ax}-1}$이다.\n기본 극한 $\\lim_{t\\to0}\\frac{\\ln(1+t)}t=1$, $\\lim_{t\\to0}\\frac{e^t-1}{t}=1$을 이용한다.\n$\\frac{\\ln(1+2x)}{e^{ax}-1}=\\frac{\\ln(1+2x)}{2x}\\cdot\\frac{ax}{e^{ax}-1}\\cdot\\frac2a\\to1\\cdot1\\cdot\\frac2a=\\frac2a$이다.\n$\\frac2a=\\frac23$이므로 $a=3$이다.\n따라서 $ab=3\\cdot(-1)=-3$이다.\n따라서 정답은 ③이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-152",
    "problemTypeKey": "PT_LIMIT_PARAMETER_DETERMINATION",
    "templateKey": "TPL_LIMIT_FINITE_CONDITION_PARAMETER",
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
    "content": "$\\lim_{x\\to0}\\frac{e^{8x}-1}{\\ln(1+ax)+b}=2$를 만족시키는 $a,b$에 대하여 $a+b$는?",
    "choices": [
      "$2$",
      "$3$",
      "$4$",
      "$5$",
      "$6$"
    ],
    "answer": "③",
    "solution": "$x\\to0$일 때 분자 $e^{8x}-1\\to0$이다.\n분모 $\\ln(1+ax)+b\\to b$이고 극한값이 $2\\ne0$이므로 $b=0$이어야 한다.\n$b=0$을 대입하면 $\\lim_{x\\to0}\\frac{e^{8x}-1}{\\ln(1+ax)}$이다.\n기본 극한을 쓰기 위해 각각 $8x$, $ax$로 나눈다.\n$\\frac{e^{8x}-1}{\\ln(1+ax)}=\\frac{e^{8x}-1}{8x}\\cdot\\frac{ax}{\\ln(1+ax)}\\cdot\\frac8a\\to1\\cdot1\\cdot\\frac8a=\\frac8a$이다.\n$\\frac8a=2$이므로 $a=4$이다.\n$ a+b=4+0=4$이다.\n따라서 정답은 ③이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-152",
    "problemTypeKey": "PT_LIMIT_PARAMETER_DETERMINATION",
    "templateKey": "TPL_LIMIT_FINITE_CONDITION_PARAMETER",
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
    "content": "$\\lim_{x\\to0}\\frac{\\ln(1+3x)}{\\sqrt{ax+b}-2}=4$일 때 $a+b$는?",
    "choices": [
      "$7$",
      "$8$",
      "$9$",
      "$10$",
      "$11$"
    ],
    "answer": "①",
    "solution": "$x\\to0$일 때 분자 $\\ln(1+3x)\\to0$이다.\n분모 $\\sqrt{ax+b}-2\\to\\sqrt b-2$이고 극한값 $4\\ne0$이므로 $\\sqrt b-2=0$, 즉 $b=4$이다.\n$b=4$를 대입한 분모를 유리화한다.(분모의 유리화)\n$\\sqrt{ax+4}-2=\\frac{ax}{\\sqrt{ax+4}+2}$이다.\n따라서 $\\frac{\\ln(1+3x)}{\\sqrt{ax+4}-2}=\\frac{\\ln(1+3x)(\\sqrt{ax+4}+2)}{ax}$이다.\n$=\\frac{\\ln(1+3x)}{3x}\\cdot\\frac{3(\\sqrt{ax+4}+2)}a$로 정리한다.\n$x\\to0$이면 $\\frac{\\ln(1+3x)}{3x}\\to1$, $\\sqrt{ax+4}+2\\to4$이므로 극한은 $\\frac{3\\cdot4}{a}=\\frac{12}{a}$이다.\n$\\frac{12}{a}=4$이므로 $a=3$이다.\n$ a+b=3+4=7$이다.\n따라서 정답은 ①이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-152",
    "problemTypeKey": "PT_LIMIT_PARAMETER_DETERMINATION",
    "templateKey": "TPL_LIMIT_FINITE_CONDITION_PARAMETER",
    "crossConceptKeys": [
      "CC_RADICAL_FUNCTION"
    ],
    "conditionKeys": [],
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
    "content": "$\\lim_{x\\to0}\\frac{\\sqrt{ax+b}-2}{e^{2x}-1}=2$일 때 $a+b$는?",
    "choices": [
      "$20$",
      "$21$",
      "$22$",
      "$23$",
      "$24$"
    ],
    "answer": "①",
    "solution": "$x\\to0$일 때 분모 $e^{2x}-1\\to0$이므로 유한한 극한을 가지려면 분자도 $0$에 수렴해야 한다.\n$\\sqrt{ax+b}-2\\to\\sqrt b-2=0$에서 $b=4$이다.\n$b=4$를 대입하고 분자를 유리화한다.\n$\\sqrt{ax+4}-2=\\frac{ax}{\\sqrt{ax+4}+2}$이다.\n$\\frac{\\sqrt{ax+4}-2}{e^{2x}-1}=\\frac{ax}{(\\sqrt{ax+4}+2)(e^{2x}-1)}$이다.\n$=\\frac{a}{(\\sqrt{ax+4}+2)\\cdot\\frac{e^{2x}-1}{x}}$로 정리한다.\n$x\\to0$이면 $\\sqrt{ax+4}+2\\to4$, $\\frac{e^{2x}-1}{x}\\to2$이므로 극한은 $\\frac{a}{4\\cdot2}=\\frac a8$이다.\n$\\frac a8=2$이므로 $a=16$이다.\n$ a+b=16+4=20$이다.\n따라서 정답은 ①이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-152",
    "problemTypeKey": "PT_LIMIT_PARAMETER_DETERMINATION",
    "templateKey": "TPL_LIMIT_FINITE_CONDITION_PARAMETER",
    "crossConceptKeys": [
      "CC_RADICAL_FUNCTION"
    ],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 7,
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
    "content": "$\\lim_{x\\to0}\\frac{(e^{2x}-1)\\ln(1+3x)}{ax^2+b}=3$일 때 $2a+b$의 값은?",
    "choices": [
      "$2$",
      "$3$",
      "$4$",
      "$5$",
      "$6$"
    ],
    "answer": "③",
    "solution": "$x\\to0$일 때 분자 $(e^{2x}-1)\\ln(1+3x)\\to0$이다.\n분모 $ax^2+b\\to b$인데, 만약 $b\\ne0$이면 극한은 $0/b=0$이므로 주어진 극한 $3$이 될 수 없다.\n따라서 $b=0$이다.\n$b=0$을 대입하고 기본 극한을 쓰기 위해 분자를 $2x$, $3x$로 나눈다.\n$\\frac{(e^{2x}-1)\\ln(1+3x)}{ax^2}=\\frac{e^{2x}-1}{2x}\\cdot\\frac{\\ln(1+3x)}{3x}\\cdot\\frac6a$이다.\n$x\\to0$일 때 각 기본 극한이 $1$이므로 극한은 $1\\cdot1\\cdot\\frac6a=\\frac6a$이다.\n$\\frac6a=3$이므로 $a=2$이다.\n$2a+b=2\\cdot2+0=4$이다.\n따라서 정답은 ③이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-152",
    "problemTypeKey": "PT_LIMIT_PARAMETER_DETERMINATION",
    "templateKey": "TPL_LIMIT_FINITE_CONDITION_PARAMETER",
    "crossConceptKeys": [],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 8,
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
    "content": "$\\lim_{x\\to0}\\frac{ax^2+b-2}{(e^{2x}-1)\\ln(1+4x)}=2$일 때 $a+b$는?",
    "choices": [
      "$17$",
      "$18$",
      "$19$",
      "$20$",
      "$21$"
    ],
    "answer": "②",
    "solution": "$x\\to0$일 때 분모 $(e^{2x}-1)\\ln(1+4x)\\to0$이므로 유한한 극한을 가지려면 분자도 $0$에 수렴해야 한다.\n$ax^2+b-2\\to b-2=0$에서 $b=2$이다.\n$b=2$를 대입하면 분자는 $ax^2$이고 주어진 식은 $\\frac{ax^2}{(e^{2x}-1)\\ln(1+4x)}$이다.\n분자와 분모를 $x^2$로 나누어 기본 극한을 만든다.\n$\\frac{ax^2}{(e^{2x}-1)\\ln(1+4x)}=\\frac{a}{\\frac{e^{2x}-1}{x}\\cdot\\frac{\\ln(1+4x)}{x}}$이다.\n$x\\to0$이면 $\\frac{e^{2x}-1}{x}\\to2$, $\\frac{\\ln(1+4x)}{x}\\to4$이므로 극한은 $\\frac{a}{2\\cdot4}=\\frac a8$이다.\n$\\frac a8=2$이므로 $a=16$이다.\n$ a+b=16+2=18$이다.\n따라서 정답은 ②이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-152",
    "problemTypeKey": "PT_LIMIT_PARAMETER_DETERMINATION",
    "templateKey": "TPL_LIMIT_FINITE_CONDITION_PARAMETER",
    "crossConceptKeys": [],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 9,
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
    "content": "$\\lim_{x\\to0}\\frac{\\ln(a+8x)}{x^2+2x}=b$, $\\lim_{x\\to0}\\frac{cx+d}{e^{2x}-1}=6$일 때 $a+b+c+d$는?",
    "choices": [
      "$14$",
      "$15$",
      "$16$",
      "$17$",
      "$18$"
    ],
    "answer": "④",
    "solution": "첫째 극한에서 분모 $x^2+2x=x(x+2)\\to0$이고 극한값 $b$가 유한하므로 분자도 $0$에 수렴해야 한다.\n$\\ln(a+8\\cdot0)=\\ln a=0$에서 $a=1$이다.\n$a=1$을 대입하면 $b=\\lim_{x\\to0}\\frac{\\ln(1+8x)}{x(x+2)}$이다.\n$=\\lim_{x\\to0}\\frac{\\ln(1+8x)}{8x}\\cdot\\frac8{x+2}=1\\cdot\\frac82=4$이므로 $b=4$이다.\n둘째 극한에서 분모 $e^{2x}-1\\to0$이고 극한값 $6$이 유한하므로 분자도 $0$에 수렴해야 한다.\n$cx+d\\to d=0$이므로 $d=0$이다.\n$d=0$을 대입하면 $6=\\lim_{x\\to0}\\frac{cx}{e^{2x}-1}$이다.\n$=\\lim_{x\\to0}\\frac c2\\cdot\\frac{2x}{e^{2x}-1}=\\frac c2\\cdot1=\\frac c2$이므로 $c=12$이다.\n따라서 $a+b+c+d=1+4+12+0=17$이다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-152",
    "problemTypeKey": "PT_LIMIT_PARAMETER_DETERMINATION",
    "templateKey": "TPL_LIMIT_FINITE_CONDITION_PARAMETER",
    "crossConceptKeys": [
      "CC_FUNCTION_CONTINUITY"
    ],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
  }
];
