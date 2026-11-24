window.examTitle = "미적분II_121_함수의연속과미정계수의결정_고2_유형은행1";

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
    "content": "$0$ 근방에서 $x\\ne0$이면 $f(x)=(e^{6x}+a)/\\sin 2x$이고 $f(0)=b$이다. $0$에서 연속이 되게 하는 $a+b$는?",
    "choices": [
      "$0$",
      "$1$",
      "$2$",
      "$3$",
      "$4$"
    ],
    "answer": "③",
    "solution": "연속이므로 $b=\\lim_{x\\to0}f(x)$이다.\n분모 $\\sin 2x\\to0$이므로 극한이 존재하려면 분자도 $0$으로 수렴해야 한다.\n$e^{6\\cdot0}+a=1+a=0$에서 $a=-1$이다.\n분자와 분모를 각각 $x$로 나누면 $b=\\lim_{x\\to0}\\frac{(e^{6x}-1)/x}{\\sin 2x/x}$이다.\n기본 극한 $\\lim_{x\\to0}\\frac{e^{6x}-1}{x}=6$, $\\lim_{x\\to0}\\frac{\\sin 2x}{x}=2$이므로 $b=\\frac{6}{2}=3$이다.\n따라서 $a+b=-1+3=2$이다.\n따라서 정답은 ③이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-153",
    "problemTypeKey": "PT_CONTINUITY_CONDITION",
    "templateKey": "TPL_CONTINUITY_PIECEWISE_BOUNDARY_MATCH",
    "crossConceptKeys": [
      "CC_FUNCTION_LIMIT"
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
    "content": "$0$ 근방에서 $x\\ne0$이면 $f(x)=(3\\cos 2x+a)/(x\\sin 2x)$이고 $f(0)=b$이다. $0$에서 연속일 때 $a+b$는?",
    "choices": [
      "$-9$",
      "$-8$",
      "$-7$",
      "$-6$",
      "$-5$"
    ],
    "answer": "④",
    "solution": "연속이므로 $b=\\lim_{x\\to0}f(x)$이다.\n분모 $x\\sin 2x\\to0$이므로 분자도 $0$으로 수렴해야 한다.\n$3\\cos0+a=3+a=0$에서 $a=-3$이다.\n$b=\\lim_{x\\to0}\\frac{3(\\cos2x-1)}{x\\sin2x}$이고, $\\cos2x-1\\sim-2x^2$, $\\sin2x\\sim2x$이다.\n따라서 분자는 $-6x^2$, 분모는 $2x^2$에 가까우므로 $b=\\frac{-6}{2}=-3$이다.\n$a+b=-3-3=-6$이다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-153",
    "problemTypeKey": "PT_CONTINUITY_CONDITION",
    "templateKey": "TPL_CONTINUITY_PIECEWISE_BOUNDARY_MATCH",
    "crossConceptKeys": [
      "CC_FUNCTION_LIMIT"
    ],
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
    "content": "$x\\ne0$일 때 $f(x)=(1-\\cos 2x)/\\ln(1+4x^2)$, $f(0)=a$이다. $0$에서 연속일 때 $a$는?",
    "choices": [
      "$0.25$",
      "$0.5$",
      "$0.75$",
      "$1$",
      "$1.25$"
    ],
    "answer": "②",
    "solution": "연속이므로 $a=\\lim_{x\\to0}f(x)$이다.\n분자와 분모를 $x^2$로 나누면 $f(x)=\\frac{(1-\\cos2x)/x^2}{\\ln(1+4x^2)/x^2}$이다.\n반각 공식에 의해 $1-\\cos2x\\sim2x^2$이므로 분자의 극한은 $2$이다.\n로그의 극한 $\\ln(1+t)\\sim t$에서 $\\ln(1+4x^2)\\sim4x^2$이므로 분모의 극한은 $4$이다.\n따라서 $a=\\frac{2}{4}=\\frac12=0.5$이다.\n따라서 정답은 ②이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-153",
    "problemTypeKey": "PT_CONTINUITY_CONDITION",
    "templateKey": "TPL_CONTINUITY_PIECEWISE_BOUNDARY_MATCH",
    "crossConceptKeys": [
      "CC_FUNCTION_LIMIT"
    ],
    "conditionKeys": [],
    "integrationPattern": "NONE"
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
    "content": "$x\\ne2$일 때 $f(x)=\\sin(7(x-2))/(x-2)$, $f(2)=a$이다. $2$에서 연속일 때 $a$는?",
    "choices": [
      "$6$",
      "$7$",
      "$8$",
      "$9$",
      "$10$"
    ],
    "answer": "②",
    "solution": "연속이므로 $a=\\lim_{x\\to2}f(x)$이다.\n$t=x-2$로 놓으면 $x\\to2$일 때 $t\\to0$이다.\n$f(x)=\\frac{\\sin7t}{t}=\\frac{7\\sin7t}{7t}$이고, $\\lim_{t\\to0}\\frac{\\sin7t}{7t}=1$이다.\n따라서 $a=7\\cdot1=7$이다.\n따라서 정답은 ②이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-153",
    "problemTypeKey": "PT_CONTINUITY_CONDITION",
    "templateKey": "TPL_CONTINUITY_PIECEWISE_BOUNDARY_MATCH",
    "crossConceptKeys": [
      "CC_FUNCTION_LIMIT"
    ],
    "conditionKeys": [],
    "integrationPattern": "NONE"
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
    "content": "$x\\ne0$일 때 $f(x)=(e^{2x}-\\sin 5x-a)/(4x)$이고 $f(0)=b$이다. $0$에서 연속일 때 $a+b$는?",
    "choices": [
      "$-0.25$",
      "$0$",
      "$0.25$",
      "$0.5$",
      "$0.75$"
    ],
    "answer": "③",
    "solution": "연속이므로 $b=\\lim_{x\\to0}f(x)$이다.\n분모 $4x\\to0$이므로 극한이 존재하려면 분자도 $0$으로 수렴해야 한다.\n$e^{0}-\\sin0-a=1-a=0$에서 $a=1$이다.\n$b=\\frac14\\lim_{x\\to0}\\left(\\frac{e^{2x}-1}{x}-\\frac{\\sin5x}{x}\\right)$로 나눌 수 있다.\n기본 극한 $\\lim_{x\\to0}\\frac{e^{2x}-1}{x}=2$, $\\lim_{x\\to0}\\frac{\\sin5x}{x}=5$이므로 $b=\\frac14(2-5)=-\\frac34$이다.\n따라서 $a+b=1-\\frac34=\\frac14=0.25$이다.\n따라서 정답은 ③이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-153",
    "problemTypeKey": "PT_CONTINUITY_CONDITION",
    "templateKey": "TPL_CONTINUITY_PIECEWISE_BOUNDARY_MATCH",
    "crossConceptKeys": [
      "CC_FUNCTION_LIMIT"
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
    "content": "$x\\ne0$일 때 $f(x)=(3^{2x}+\\sin 4x-a)/x$이고 $f(0)=b$이다. $0$에서 연속일 때 $a+b$는?",
    "choices": [
      "$2\\ln3+1$",
      "$2\\ln3+2$",
      "$2\\ln3+3$",
      "$2\\ln3+4$",
      "$2\\ln3+5$"
    ],
    "answer": "⑤",
    "solution": "연속이므로 $b=\\lim_{x\\to0}f(x)$이다.\n분모 $x\\to0$이므로 분자도 $0$으로 수렴해야 한다.\n$3^{0}+\\sin0-a=1-a=0$에서 $a=1$이다.\n$b=\\lim_{x\\to0}\\left(\\frac{3^{2x}-1}{x}+\\frac{\\sin4x}{x}\\right)$로 나눌 수 있다.\n$3^{2x}=e^{2x\\ln3}$이므로 $\\lim_{x\\to0}\\frac{e^{2x\\ln3}-1}{x}=2\\ln3$이다.\n또한 $\\lim_{x\\to0}\\frac{\\sin4x}{x}=4$이므로 $b=2\\ln3+4$이다.\n따라서 $a+b=1+2\\ln3+4=2\\ln3+5$이다.\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-153",
    "problemTypeKey": "PT_CONTINUITY_CONDITION",
    "templateKey": "TPL_CONTINUITY_PIECEWISE_BOUNDARY_MATCH",
    "crossConceptKeys": [
      "CC_FUNCTION_LIMIT"
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
    "content": "$0$ 근방에서 연속인 함수 $f$가 $4\\sin(2x)f(x)=e^{5x}-1$을 만족할 때 $f(0)$은?",
    "choices": [
      "$1/8$",
      "$2/8$",
      "$3/8$",
      "$5/8$",
      "$7/8$"
    ],
    "answer": "④",
    "solution": "$x\\ne0$에서 주어진 식을 $4\\sin2x$로 나누면 $f(x)=\\frac{e^{5x}-1}{4\\sin2x}$이다.\n연속이므로 $f(0)=\\lim_{x\\to0}\\frac{e^{5x}-1}{4\\sin2x}$이다.\n분자와 분모를 각각 $x$로 나누면 $f(0)=\\frac{(e^{5x}-1)/x}{4(\\sin2x/x)}$의 극한이다.\n$\\lim_{x\\to0}\\frac{e^{5x}-1}{x}=5$, $\\lim_{x\\to0}\\frac{\\sin2x}{x}=2$이므로 $f(0)=\\frac{5}{4\\cdot2}=\\frac58$이다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-153",
    "problemTypeKey": "PT_CONTINUITY_CONDITION",
    "templateKey": "TPL_CONTINUITY_PIECEWISE_BOUNDARY_MATCH",
    "crossConceptKeys": [
      "CC_FUNCTION_LIMIT"
    ],
    "conditionKeys": [],
    "integrationPattern": "NONE"
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
    "content": "$0$ 근방에서 연속인 함수 $f$가 $x\\ne0$에서 $f(x)\\sin 2x=x(1+2x)^{3/x}$를 만족할 때 $f(0)$은?",
    "choices": [
      "$e^2/2$",
      "$e^3/2$",
      "$e^4/2$",
      "$e^5/2$",
      "$e^6/2$"
    ],
    "answer": "⑤",
    "solution": "$x\\ne0$에서 주어진 식을 $\\sin2x$로 나누면 $f(x)=\\frac{x}{\\sin2x}(1+2x)^{3/x}$이다.\n$\\lim_{x\\to0}\\frac{x}{\\sin2x}=\\frac12$이다.\n지수 법칙으로 $\\frac{3}{x}=\\frac{6}{2x}$이므로 $(1+2x)^{3/x}=\\left((1+2x)^{1/(2x)}\\right)^6$이다.\n$\\lim_{t\\to0}(1+t)^{1/t}=e$이므로 $\\lim_{x\\to0}\\left((1+2x)^{1/(2x)}\\right)^6=e^6$이다.\n따라서 $f(0)=\\frac12\\cdot e^6=\\frac{e^6}{2}$이다.\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-153",
    "problemTypeKey": "PT_CONTINUITY_CONDITION",
    "templateKey": "TPL_CONTINUITY_PIECEWISE_BOUNDARY_MATCH",
    "crossConceptKeys": [
      "CC_FUNCTION_LIMIT"
    ],
    "conditionKeys": [],
    "integrationPattern": "NONE"
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
    "content": "연속함수 $f$가 $(\\pi-3x)f(x)=12\\sin(3x-\\pi)$를 만족할 때 $f(\\pi/3)$은?",
    "choices": [
      "$-15$",
      "$-14$",
      "$-13$",
      "$-12$",
      "$-11$"
    ],
    "answer": "④",
    "solution": "$x\\ne\\frac{\\pi}{3}$에서 주어진 식을 $\\pi-3x$로 나누면 $f(x)=\\frac{12\\sin(3x-\\pi)}{\\pi-3x}$이다.\n$t=3x-\\pi$로 치환하면 $x\\to\\frac{\\pi}{3}$일 때 $t\\to0$이고, $\\pi-3x=-t$이다.\n따라서 $f(x)=\\frac{12\\sin t}{-t}=-12\\frac{\\sin t}{t}$이다.\n$\\lim_{t\\to0}\\frac{\\sin t}{t}=1$이므로 $\\lim_{x\\to\\pi/3}f(x)=-12$이다.\n연속성에 의해 $f\\left(\\frac{\\pi}{3}\\right)=-12$이다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-153",
    "problemTypeKey": "PT_CONTINUITY_CONDITION",
    "templateKey": "TPL_CONTINUITY_PIECEWISE_BOUNDARY_MATCH",
    "crossConceptKeys": [
      "CC_FUNCTION_LIMIT"
    ],
    "conditionKeys": [],
    "integrationPattern": "NONE"
  },
  {
    "id": 10,
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
    "content": "$0$ 근방에서 연속인 $f$가 $(1-\\cos 2x)f(x)=x(e^{6x}-1)$을 만족할 때 $f(0)$은?",
    "choices": [
      "$1$",
      "$2$",
      "$3$",
      "$4$",
      "$5$"
    ],
    "answer": "③",
    "solution": "$x\\ne0$에서 주어진 식을 $1-\\cos2x$로 나누면 $f(x)=\\frac{x(e^{6x}-1)}{1-\\cos2x}$이다.\n분자와 분모를 $x^2$로 나누면 $f(x)=\\frac{(e^{6x}-1)/x}{(1-\\cos2x)/x^2}$이다.\n$\\lim_{x\\to0}\\frac{e^{6x}-1}{x}=6$이다.\n반각 공식에 의해 $1-\\cos2x\\sim2x^2$이므로 $\\lim_{x\\to0}\\frac{1-\\cos2x}{x^2}=2$이다.\n따라서 $f(0)=\\frac{6}{2}=3$이다.\n따라서 정답은 ③이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-153",
    "problemTypeKey": "PT_CONTINUITY_CONDITION",
    "templateKey": "TPL_CONTINUITY_PIECEWISE_BOUNDARY_MATCH",
    "crossConceptKeys": [
      "CC_FUNCTION_LIMIT"
    ],
    "conditionKeys": [],
    "integrationPattern": "NONE"
  },
  {
    "id": 11,
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
    "content": "$0$ 근방에서 연속인 $f$가 $(1-\\cos 2x)f(x)=\\sin 3x(e^{4x}-1)$을 만족할 때 $f(0)$은?",
    "choices": [
      "$6$",
      "$7$",
      "$8$",
      "$9$",
      "$10$"
    ],
    "answer": "①",
    "solution": "$x\\ne0$에서 주어진 식을 $1-\\cos2x$로 나누면 $f(x)=\\frac{\\sin3x(e^{4x}-1)}{1-\\cos2x}$이다.\n분자와 분모를 $x^2$로 나누면 $f(x)=\\frac{(\\sin3x/x)\\cdot((e^{4x}-1)/x)}{(1-\\cos2x)/x^2}$이다.\n$\\lim_{x\\to0}\\frac{\\sin3x}{x}=3$, $\\lim_{x\\to0}\\frac{e^{4x}-1}{x}=4$이므로 분자의 극한은 $3\\cdot4=12$이다.\n$1-\\cos2x\\sim2x^2$이므로 분모의 극한은 $2$이다.\n따라서 $f(0)=\\frac{12}{2}=6$이다.\n따라서 정답은 ①이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-153",
    "problemTypeKey": "PT_CONTINUITY_CONDITION",
    "templateKey": "TPL_CONTINUITY_PIECEWISE_BOUNDARY_MATCH",
    "crossConceptKeys": [
      "CC_FUNCTION_LIMIT"
    ],
    "conditionKeys": [],
    "integrationPattern": "NONE"
  },
  {
    "id": 12,
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
    "content": "$x\\ge1$이면 $f(x)=3^x-2.5$, $0<x<1$이면 $f(x)=\\sin(ax)/x$, $x\\le0$이면 $f(x)=2x+b$이다. $-\\pi/2<a<\\pi/2$이고 $f$가 연속일 때 $a+b$는?",
    "choices": [
      "$\\pi/6$",
      "$\\pi/3$",
      "$\\pi/2$",
      "$2\\pi/3$",
      "$5\\pi/6$"
    ],
    "answer": "②",
    "solution": "$x=1$에서의 연속성: 오른쪽 함수값은 $3^1-2.5=\\frac12$이고 왼쪽 극한은 $\\frac{\\sin a}{1}=\\sin a$이다.\n따라서 $\\sin a=\\frac12$이고 $-\\frac{\\pi}{2}<a<\\frac{\\pi}{2}$이므로 $a=\\frac{\\pi}{6}$이다.\n$x=0$에서의 연속성: 왼쪽 함수값은 $b$이고 오른쪽 극한은 $\\lim_{x\\to0+}\\frac{\\sin(ax)}{x}=a$이다.\n따라서 $b=a=\\frac{\\pi}{6}$이다.\n그러므로 $a+b=\\frac{\\pi}{6}+\\frac{\\pi}{6}=\\frac{\\pi}{3}$이다.\n따라서 정답은 ②이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-153",
    "problemTypeKey": "PT_CONTINUITY_CONDITION",
    "templateKey": "TPL_CONTINUITY_PIECEWISE_BOUNDARY_MATCH",
    "crossConceptKeys": [
      "CC_FUNCTION_LIMIT",
      "CC_PIECEWISE_FUNCTION"
    ],
    "conditionKeys": [
      "COND_RANGE"
    ],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 13,
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
    "content": "$0$ 근방에서 $x<0$이면 $f(x)=(4x+\\sin2x)/\\tan x$, $x>0$이면 $f(x)=\\ln(1+bx)/(3x)$이고 $f(0)=a$이다. $0$에서 연속이면 $a+b$는?",
    "choices": [
      "$22$",
      "$23$",
      "$24$",
      "$25$",
      "$26$"
    ],
    "answer": "③",
    "solution": "$x\\to0-$일 때 $\\frac{4x+\\sin2x}{\\tan x}=\\frac{4+\\sin2x/x}{\\tan x/x}$이다.\n$\\lim_{x\\to0}\\frac{\\sin2x}{x}=2$, $\\lim_{x\\to0}\\frac{\\tan x}{x}=1$이므로 왼쪽 극한은 $\\frac{4+2}{1}=6$이다.\n$x\\to0+$일 때 $\\lim_{x\\to0}\\frac{\\ln(1+bx)}{3x}=\\frac13\\lim_{x\\to0}\\frac{\\ln(1+bx)}{x}=\\frac{b}{3}$이다.\n연속이므로 왼쪽 극한 $=$ 오른쪽 극한 $=$ 함수값이어야 한다.\n따라서 $a=6$, $\\frac{b}{3}=6$에서 $b=18$이다.\n그러므로 $a+b=6+18=24$이다.\n따라서 정답은 ③이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-153",
    "problemTypeKey": "PT_CONTINUITY_CONDITION",
    "templateKey": "TPL_CONTINUITY_PIECEWISE_BOUNDARY_MATCH",
    "crossConceptKeys": [
      "CC_FUNCTION_LIMIT"
    ],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 14,
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
    "content": "$x\\ne\\pi/4$일 때 $f(x)=(2\\sin 2x-a)/(x-\\pi/4)$, $f(\\pi/4)=b$이다. $\\pi/4$에서 연속이면 $a+b$는?",
    "choices": [
      "$-1$",
      "$0$",
      "$1$",
      "$2$",
      "$3$"
    ],
    "answer": "④",
    "solution": "연속이므로 $b=\\lim_{x\\to\\pi/4}f(x)$이고, 분모가 $0$으로 가므로 분자도 $0$으로 가야 한다.\n$2\\sin\\frac{\\pi}{2}-a=2-a=0$에서 $a=2$이다.\n$t=x-\\frac{\\pi}{4}$로 놓으면 $x\\to\\frac{\\pi}{4}$일 때 $t\\to0$이고 $x=t+\\frac{\\pi}{4}$이다.\n$\\sin2x=\\sin\\left(2t+\\frac{\\pi}{2}\\right)=\\cos2t$이므로 $b=\\lim_{t\\to0}\\frac{2(\\cos2t-1)}{t}$이다.\n$1-\\cos2t\\sim2t^2$이므로 $\\cos2t-1\\sim-2t^2$이고, 분자는 $-4t^2$에 가까우므로 $\\frac{2(\\cos2t-1)}{t}\\sim-4t\\to0$이다.\n따라서 $b=0$이고 $a+b=2+0=2$이다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-153",
    "problemTypeKey": "PT_CONTINUITY_CONDITION",
    "templateKey": "TPL_CONTINUITY_PIECEWISE_BOUNDARY_MATCH",
    "crossConceptKeys": [
      "CC_FUNCTION_LIMIT"
    ],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 15,
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
    "content": "$0$에서 연속인 함수 $f$에 대해 $\\lim_{x\\to0}x(e^{3x}-1)f(x)/(1-\\cos 2x)=18$일 때 $f(0)$은?",
    "choices": [
      "$8$",
      "$9$",
      "$10$",
      "$11$",
      "$12$"
    ],
    "answer": "⑤",
    "solution": "$f$가 $0$에서 연속이므로 $\\lim_{x\\to0}f(x)=f(0)$이다.\n주어진 극한식을 정리하면 $\\lim_{x\\to0}\\frac{x(e^{3x}-1)}{1-\\cos2x}\\cdot f(x)=18$이다.\n분자와 분모를 $x^2$로 나누면 $\\frac{x(e^{3x}-1)}{1-\\cos2x}=\\frac{(e^{3x}-1)/x}{(1-\\cos2x)/x^2}$이다.\n$\\lim_{x\\to0}\\frac{e^{3x}-1}{x}=3$, $\\lim_{x\\to0}\\frac{1-\\cos2x}{x^2}=2$이므로 앞의 인수의 극한은 $\\frac32$이다.\n따라서 $\\frac32 f(0)=18$이고 $f(0)=18\\cdot\\frac23=12$이다.\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-153",
    "problemTypeKey": "PT_CONTINUITY_CONDITION",
    "templateKey": "TPL_CONTINUITY_PIECEWISE_BOUNDARY_MATCH",
    "crossConceptKeys": [
      "CC_FUNCTION_LIMIT"
    ],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
  }
];
