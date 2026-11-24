window.examTitle = "미적분II_085_x-afx꼴의함수의연속_고2_유형은행1";

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
    "content": "실수 전체에서 연속인 함수 $f$가 $(e^{4x}-1)f(x)=3xe^{2x}$를 만족시킬 때 $f(0)$은?",
    "choices": [
      "$\\frac14$",
      "$\\frac12$",
      "$\\frac34$",
      "$1$",
      "$\\frac32$"
    ],
    "answer": "③",
    "solution": "주어진 식에서 $x\\ne0$일 때 양변을 $e^{4x}-1$로 나누면 $f(x)=\\dfrac{3xe^{2x}}{e^{4x}-1}$이다.\n분자와 분모를 $x$로 나누면 $f(x)=\\dfrac{3e^{2x}}{(e^{4x}-1)/x}$이다.\n지수함수의 극한 $\\lim_{x\\to0}\\dfrac{e^{4x}-1}{x}=4$를 적용하면 분모의 극한은 $4$이다.\n$\\lim_{x\\to0}e^{2x}=1$이므로 $\\lim_{x\\to0}f(x)=\\dfrac{3\\cdot1}{4}=\\dfrac34$이다.\n$f$가 실수 전체에서 연속이므로 $f(0)=\\lim_{x\\to0}f(x)=\\dfrac34$이다.\n따라서 정답은 ③이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-154",
    "problemTypeKey": "PT_CONTINUITY_CONDITION",
    "templateKey": "TPL_CONTINUITY_PRODUCT_ZERO_CANCELLATION",
    "crossConceptKeys": [
      "CC_FUNCTION_LIMIT"
    ],
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
    "content": "$x>-1/3$에서 연속인 함수 $f$가 $f(x)\\ln(1+3x)=e^{6x}-1$을 만족시킬 때 $f(0)$은?",
    "choices": [
      "$1$",
      "$2$",
      "$3$",
      "$4$",
      "$5$"
    ],
    "answer": "②",
    "solution": "$x\\ne0$일 때 주어진 식을 $\\ln(1+3x)$로 나누면 $f(x)=\\dfrac{e^{6x}-1}{\\ln(1+3x)}$이다.\n분자와 분모를 각각 $x$로 나누면 $f(x)=\\dfrac{(e^{6x}-1)/x}{\\ln(1+3x)/x}$이다.\n지수함수의 극한 $\\lim_{x\\to0}\\dfrac{e^{6x}-1}{x}=6$이다.\n로그함수의 극한 $\\lim_{x\\to0}\\dfrac{\\ln(1+3x)}{x}=3$이다.\n따라서 $\\lim_{x\\to0}f(x)=\\dfrac{6}{3}=2$이다.\n$f$가 $x=0$에서 연속이므로 $f(0)=2$이다.\n따라서 정답은 ②이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-154",
    "problemTypeKey": "PT_CONTINUITY_CONDITION",
    "templateKey": "TPL_CONTINUITY_PRODUCT_ZERO_CANCELLATION",
    "crossConceptKeys": [
      "CC_FUNCTION_LIMIT"
    ],
    "conditionKeys": [
      "COND_RESTRICTED_INTERVAL"
    ],
    "integrationPattern": "NONE"
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
    "content": "양의 실수에서 연속인 함수 $f$가 $(x-2)f(x)=3\\ln(x/2)$를 만족시킬 때 $f(2)$는?",
    "choices": [
      "$\\frac12$",
      "$\\frac34$",
      "$1$",
      "$\\frac32$",
      "$2$"
    ],
    "answer": "④",
    "solution": "$x\\ne2$일 때 $f(x)=\\dfrac{3\\ln(x/2)}{x-2}$이다.\n$t=\\dfrac{x-2}{2}$로 놓으면 $x=2(1+t)$이고 $x\\to2$일 때 $t\\to0$이다.\n이때 $\\dfrac{x}{2}=1+t$, $x-2=2t$이므로 $f(x)=\\dfrac{3\\ln(1+t)}{2t}$이다.\n로그함수의 극한 $\\lim_{t\\to0}\\dfrac{\\ln(1+t)}{t}=1$을 적용하면 $\\lim_{x\\to2}f(x)=\\dfrac32\\cdot1=\\dfrac32$이다.\n$f$가 양의 실수 전체에서 연속이므로 $f(2)=\\lim_{x\\to2}f(x)=\\dfrac32$이다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-154",
    "problemTypeKey": "PT_CONTINUITY_CONDITION",
    "templateKey": "TPL_CONTINUITY_PRODUCT_ZERO_CANCELLATION",
    "crossConceptKeys": [
      "CC_FUNCTION_LIMIT"
    ],
    "conditionKeys": [
      "COND_POSITIVE"
    ],
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
    "content": "실수 전체에서 연속인 함수 $f$가 $(x-3)f(x)=e^{5x-15}-1$을 만족시킬 때 $f(3)$은?",
    "choices": [
      "$4$",
      "$5$",
      "$6$",
      "$7$",
      "$8$"
    ],
    "answer": "②",
    "solution": "$t=x-3$으로 놓으면 $x\\to3$일 때 $t\\to0$이고 $5x-15=5t$이다.\n$t\\ne0$일 때 주어진 식은 $t\\,f(x)=e^{5t}-1$이므로 $f(x)=\\dfrac{e^{5t}-1}{t}$이다.\n지수함수의 극한 $\\lim_{t\\to0}\\dfrac{e^{5t}-1}{t}=5$이다.\n$f$가 실수 전체에서 연속이므로 $f(3)=\\lim_{t\\to0}f(x)=5$이다.\n따라서 정답은 ②이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-154",
    "problemTypeKey": "PT_CONTINUITY_CONDITION",
    "templateKey": "TPL_CONTINUITY_PRODUCT_ZERO_CANCELLATION",
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
    "content": "실수 전체에서 연속인 함수 $f$가 $(x+2)f(x)=5^{3x+6}-1$을 만족시킬 때 $f(-2)$는?",
    "choices": [
      "$\\ln5$",
      "$\\frac32\\ln5$",
      "$2\\ln5$",
      "$\\frac52\\ln5$",
      "$3\\ln5$"
    ],
    "answer": "⑤",
    "solution": "$t=x+2$로 놓으면 $x\\to-2$일 때 $t\\to0$이고 $3x+6=3t$이다.\n$t\\ne0$일 때 주어진 식은 $t\\,f(x)=5^{3t}-1$이므로 $f(x)=\\dfrac{5^{3t}-1}{t}$이다.\n$5^{3t}=e^{3t\\ln5}$로 고쳐 쓰면 $f(x)=\\dfrac{e^{3t\\ln5}-1}{t}$이다.\n분자와 분모를 $3\\ln5$에 맞추면 $f(x)=3\\ln5\\cdot\\dfrac{e^{3t\\ln5}-1}{3t\\ln5}$이다.\n지수함수의 극한 $\\lim_{u\\to0}\\dfrac{e^{u}-1}{u}=1$ (단 $u=3t\\ln5$)을 적용하면 $\\lim_{t\\to0}f(x)=3\\ln5\\cdot1=3\\ln5$이다.\n$f$가 실수 전체에서 연속이므로 $f(-2)=3\\ln5$이다.\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-154",
    "problemTypeKey": "PT_CONTINUITY_CONDITION",
    "templateKey": "TPL_CONTINUITY_PRODUCT_ZERO_CANCELLATION",
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
    "content": "양수 $a$에 대하여 양의 실수 전체에서 연속인 함수 $f$가 $(ax-2)f(x)=\\ln(ax/2)$를 만족시킬 때 $f(2/a)$는?",
    "choices": [
      "$\\frac14$",
      "$\\frac13$",
      "$\\frac12$",
      "$\\frac23$",
      "$1$"
    ],
    "answer": "③",
    "solution": "$x\\ne\\dfrac2a$일 때 주어진 식을 $ax-2$로 나누면 $f(x)=\\dfrac{\\ln(ax/2)}{ax-2}$이다.\n$t=\\dfrac{ax}{2}-1$로 놓으면 $x\\to\\dfrac2a$일 때 $t\\to0$이고 $\\dfrac{ax}{2}=1+t$이다.\n이때 $ax-2=2\\left(\\dfrac{ax}{2}-1\\right)=2t$이므로 $f(x)=\\dfrac{\\ln(1+t)}{2t}$이다.\n로그함수의 극한 $\\lim_{t\\to0}\\dfrac{\\ln(1+t)}{t}=1$을 적용하면 $\\lim_{x\\to2/a}f(x)=\\dfrac12\\cdot1=\\dfrac12$이다.\n$f$가 양의 실수 전체에서 연속이므로 $f\\left(\\dfrac2a\\right)=\\dfrac12$이다.\n따라서 정답은 ③이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-154",
    "problemTypeKey": "PT_CONTINUITY_CONDITION",
    "templateKey": "TPL_CONTINUITY_PRODUCT_ZERO_CANCELLATION",
    "crossConceptKeys": [
      "CC_FUNCTION_LIMIT"
    ],
    "conditionKeys": [
      "COND_POSITIVE"
    ],
    "integrationPattern": "SEQUENTIAL"
  }
];
