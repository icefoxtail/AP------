window.examTitle = "미적분II_120_지수함수로그함수의연속_고2_유형은행1";

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
    "content": "$x\\ne0$에서 $f(x)=x/(e^{2x}-1)$, $g(x)=x\\cos(2/x)$, $h(x)=x/\\ln(1+4x)$이고, $f(0)=1$, $g(0)=0$, $h(0)=1/4$이다. $x=0$에서 연속인 함수를 모두 고르면?",
    "choices": [
      "$f$",
      "$f,g$",
      "$f,h$",
      "$g,h$",
      "$f,g,h$"
    ],
    "answer": "④",
    "solution": "$x\\to0$일 때 $2x\\to0$이므로 기본 극한 $\\lim_{t\\to0}\\frac{e^t-1}{t}=1$을 적용한다.\n$$\\lim_{x\\to0}f(x)=\\lim_{x\\to0}\\frac{1}{2}\\cdot\\frac{2x}{e^{2x}-1}=\\frac{1}{2}\\cdot1=\\frac{1}{2}$$\n$f(0)=1$이므로 $\\lim_{x\\to0}f(x)\\ne f(0)$이어서 $f$는 $x=0$에서 불연속이다.\n$g$에는 조임정리를 적용하면 $-1\\le\\cos\\frac{2}{x}\\le1$에서 $-|x|\\le g(x)\\le|x|$이고, $\\lim_{x\\to0}(\\pm|x|)=0$이므로 $\\lim_{x\\to0}g(x)=0$이다.\n$g(0)=0$이므로 $g$는 $x=0$에서 연속이다.\n$h$에는 기본 극한 $\\lim_{t\\to0}\\frac{\\ln(1+t)}{t}=1$을 적용하면 $$\\lim_{x\\to0}h(x)=\\lim_{x\\to0}\\frac{1}{4}\\cdot\\frac{4x}{\\ln(1+4x)}=\\frac{1}{4}\\cdot1=\\frac{1}{4}$$\n$h(0)=\\frac{1}{4}$이므로 $h$는 $x=0$에서 연속이다.\n주의: $f$는 극한값 $\\frac{1}{2}$와 함수값 $1$이 달라 불연속이다.\n따라서 $x=0$에서 연속인 함수는 $g,h$이다.\n따라서 정답은 ④이다.",
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
    "content": "$x\\ne0$에서 $f(x)=(e^{3x}-1)/x$, $g(x)=(2x-\\sin2x)/x$, $h(x)=\\ln(1+2x^2)/x$이다. $f(0)=3,g(0)=1,h(0)=2$일 때 $x=0$에서 연속인 함수는?",
    "choices": [
      "$f$",
      "$g$",
      "$h$",
      "$f,g$",
      "$f,g,h$"
    ],
    "answer": "①",
    "solution": "$x\\to0$일 때 $3x\\to0$이므로 기본 극한 $\\lim_{t\\to0}\\frac{e^t-1}{t}=1$을 적용한다.\n$$\\lim_{x\\to0}f(x)=\\lim_{x\\to0}\\frac{e^{3x}-1}{x}=3\\lim_{x\\to0}\\frac{e^{3x}-1}{3x}=3\\cdot1=3$$\n$f(0)=3$이므로 $\\lim_{x\\to0}f(x)=f(0)$이어서 $f$는 $x=0$에서 연속이다.\n$g$는 분배한 뒤 기본 극한 $\\lim_{t\\to0}\\frac{\\sin t}{t}=1$을 적용하면 $$\\lim_{x\\to0}g(x)=\\lim_{x\\to0}\\left(2-\\frac{\\sin2x}{x}\\right)=2-2\\lim_{x\\to0}\\frac{\\sin2x}{2x}=2-2\\cdot1=0$$\n$g(0)=1$이므로 $\\lim_{x\\to0}g(x)\\ne g(0)$이어서 $g$는 $x=0$에서 불연속이다.\n$h$는 기본 극한 $\\lim_{t\\to0}\\frac{\\ln(1+t)}{t}=1$을 쓰기 위해 다음과 같이 변형한다.\n$$\\lim_{x\\to0}h(x)=\\lim_{x\\to0}\\frac{\\ln(1+2x^2)}{2x^2}\\cdot2x=1\\cdot0=0$$\n$h(0)=2$이므로 $\\lim_{x\\to0}h(x)\\ne h(0)$이어서 $h$는 $x=0$에서 불연속이다.\n주의: $g$의 극한값은 $0$이고 함수값은 $1$이므로 둘을 혼동하지 않는다.\n따라서 $x=0$에서 연속인 함수는 $f$뿐이다.\n따라서 정답은 ①이다.",
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
  }
];
