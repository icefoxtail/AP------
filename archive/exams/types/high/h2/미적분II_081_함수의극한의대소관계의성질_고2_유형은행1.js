window.examTitle = "미적분II_081_함수의극한의대소관계의성질_고2_유형은행1";

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
    "content": "$x>-1/3$에서 $\\ln(1+3x)\\le f(x)\\le e^{3x}-1$일 때 $\\lim_{x\\to0}\\frac{f(x)}x$의 값은?",
    "choices": [
      "$1$",
      "$2$",
      "$3$",
      "$4$",
      "$5$"
    ],
    "answer": "③",
    "solution": "$x\\to0$이므로 $x>0$인 경우와 $x<0$인 경우로 나누어 생각한다.\n(i) $x>0$일 때: 각 변을 $x>0$으로 나누면 $\\frac{\\ln(1+3x)}x\\le\\frac{f(x)}x\\le\\frac{e^{3x}-1}x$이다.\n기본 극한에 의해 $\\lim_{x\\to0}\\frac{\\ln(1+3x)}x=3$, $\\lim_{x\\to0}\\frac{e^{3x}-1}x=3$이다.\n(ii) $x<0$일 때: $x<0$으로 나누면 부등호 방향이 바뀌어 $\\frac{\\ln(1+3x)}x\\ge\\frac{f(x)}x\\ge\\frac{e^{3x}-1}x$이다.\n이때도 두 경계의 극한은 각각 $3$이므로 $\\frac{f(x)}x\\to3$이다.\n샌드위치 정리에 의해 $\\lim_{x\\to0}\\frac{f(x)}x=3$이다.\n주의: $x<0$에서 $x$로 나눌 때 부등호 방향이 바뀐다.\n따라서 정답은 ③이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-151",
    "problemTypeKey": "PT_LIMIT_VALUE_CALC",
    "templateKey": "TPL_LIMIT_SQUEEZE",
    "crossConceptKeys": [],
    "conditionKeys": [
      "COND_FUNCTION_VALUE_CONSTRAINT",
      "COND_RESTRICTED_INTERVAL"
    ],
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
    "content": "$x>0$에서 $6\\ln x\\le f(x)\\le6(e^{x-1}-1)$일 때 $\\lim_{x\\to1}\\frac{f(x)}{x^3-1}$의 값은?",
    "choices": [
      "$-2$",
      "$-\\frac12$",
      "$\\frac12$",
      "$1$",
      "$2$"
    ],
    "answer": "⑤",
    "solution": "$x\\to1$이므로 $x>1$인 경우와 $0<x<1$인 경우로 나눈다.\n분모를 인수분해하면 $x^3-1=(x-1)(x^2+x+1)$이다.\n아래 경계: $\\lim_{x\\to1}\\frac{6\\ln x}{x^3-1}=6\\lim_{x\\to1}\\frac{\\ln x}{x-1}\\cdot\\frac1{x^2+x+1}=6\\cdot1\\cdot\\frac13=2$이다.\n위 경계: $\\lim_{x\\to1}\\frac{6(e^{x-1}-1)}{x^3-1}=6\\lim_{x\\to1}\\frac{e^{x-1}-1}{x-1}\\cdot\\frac1{x^2+x+1}=6\\cdot1\\cdot\\frac13=2$이다.\n(i) $x>1$일 때: $x^3-1>0$이므로 부등호 방향을 유지한 채 각 변을 $x^3-1$로 나눈다.\n(ii) $0<x<1$일 때: $x^3-1<0$이므로 나눌 때 부등호 방향이 바뀌지만 두 경계의 극한은 모두 $2$이다.\n샌드위치 정리에 의해 $\\lim_{x\\to1}\\frac{f(x)}{x^3-1}=2$이다.\n주의: $x=1$에서는 분모가 $0$이므로 함숫값이 아니라 극한으로 다룬다.\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-151",
    "problemTypeKey": "PT_LIMIT_VALUE_CALC",
    "templateKey": "TPL_LIMIT_SQUEEZE",
    "crossConceptKeys": [],
    "conditionKeys": [
      "COND_FUNCTION_VALUE_CONSTRAINT",
      "COND_RESTRICTED_INTERVAL"
    ],
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
    "content": "$x>-1/2$에서 $\\ln(1+2x)\\le f(x)\\le\\frac12(e^{4x}-1)$일 때 $\\lim_{x\\to0}\\frac{f(4x)}x$의 값은?",
    "choices": [
      "$2$",
      "$4$",
      "$6$",
      "$8$",
      "$10$"
    ],
    "answer": "④",
    "solution": "$t=4x$로 놓으면 $x\\to0$일 때 $t\\to0$이고 $x=\\frac t4$이다.\n따라서 $\\frac{f(4x)}x=\\frac{f(t)}{t/4}=4\\frac{f(t)}t$이다.\n$\\frac{f(t)}t$의 극한을 구하기 위해 $t>0$인 경우와 $-\\frac12<t<0$인 경우로 나눈다.\n아래 경계: 기본 극한에 의해 $\\lim_{t\\to0}\\frac{\\ln(1+2t)}t=2$이다.\n위 경계: $\\lim_{t\\to0}\\frac{\\frac12(e^{4t}-1)}t=\\frac12\\cdot4\\lim_{t\\to0}\\frac{e^{4t}-1}{4t}=\\frac12\\cdot4\\cdot1=2$이다.\n(i) $t>0$일 때: 각 변을 $t>0$으로 나누면 부등호 방향이 유지된다.\n(ii) $t<0$일 때: 각 변을 $t<0$으로 나누면 부등호 방향이 바뀌지만 두 경계의 극한은 모두 $2$이다.\n샌드위치 정리에 의해 $\\lim_{t\\to0}\\frac{f(t)}t=2$이다.\n그러므로 $\\lim_{x\\to0}\\frac{f(4x)}x=4\\cdot2=8$이다.\n주의: $\\frac{f(t)}t$의 극한 $2$에 $4$를 곱하는 단계를 빠뜨리지 않는다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-151",
    "problemTypeKey": "PT_LIMIT_VALUE_CALC",
    "templateKey": "TPL_LIMIT_SQUEEZE",
    "crossConceptKeys": [],
    "conditionKeys": [
      "COND_FUNCTION_VALUE_CONSTRAINT",
      "COND_RESTRICTED_INTERVAL"
    ],
    "integrationPattern": "SEQUENTIAL"
  }
];
