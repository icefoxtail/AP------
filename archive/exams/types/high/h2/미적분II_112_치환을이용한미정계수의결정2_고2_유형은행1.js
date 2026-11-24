window.examTitle = "미적분II_112_치환을이용한미정계수의결정2_고2_유형은행1";

window.questionBank = [
  {
    "id": 1,
    "category": "삼각함수의 미분",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-04",
    "standardUnit": "삼각함수의 미분",
    "standardUnitOrder": 4,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "삼각함수의 미분"
    ],
    "wide": false,
    "content": "일차함수 $f$에 대해 $\\lim_{x\\to0}\\tan2x/f(x)=1/3$일 때 $f(7)$은?",
    "choices": [
      "$41$",
      "$42$",
      "$43$",
      "$44$",
      "$45$"
    ],
    "answer": "②",
    "solution": "$f$가 일차함수이고 극한값이 유한하므로 $f(0)=0$이어야 한다. (분모가 $0$으로 가야 함)\n따라서 $f(x)=mx$ ($m\\ne0$)로 놓는다.\n$\\lim_{x\\to0}\\frac{\\tan 2x}{mx}$에서 $\\tan 2x\\sim 2x$이므로 극한값은 $\\frac{2}{m}$이다. (삼각함수의 극한 $\\lim_{t\\to0}\\frac{\\tan t}{t}=1$)\n$\\frac{2}{m}=\\frac{1}{3}$에서 $m=6$이다.\n그러므로 $f(7)=6\\cdot7=42$이다.\n따라서 정답은 ②이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "B12",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-169",
    "problemTypeKey": "PT_LIMIT_PARAMETER_DETERMINATION",
    "templateKey": "TPL_LIMIT_FINITE_CONDITION_PARAMETER",
    "crossConceptKeys": [
      "CC_LINEAR_FUNCTIONS"
    ],
    "conditionKeys": [
      "COND_POLYNOMIAL_DEGREE_ONE"
    ],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 2,
    "category": "삼각함수의 미분",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-04",
    "standardUnit": "삼각함수의 미분",
    "standardUnitOrder": 4,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "삼각함수의 미분"
    ],
    "wide": false,
    "content": "일차함수 $f$에 대해 $\\lim_{x\\to2\\pi}\\sin(2\\pi-x)/f(x)=1/3$일 때 $f(3\\pi)$는?",
    "choices": [
      "$-3\\pi$",
      "$-2\\pi$",
      "$-\\pi$",
      "$0$",
      "$\\pi$"
    ],
    "answer": "①",
    "solution": "$f$가 일차함수이고 극한값이 유한하므로 $f(2\\pi)=0$이어야 한다. (분모가 $0$으로 가야 함)\n따라서 $f(x)=m(x-2\\pi)$ ($m\\ne0$)로 놓는다.\n$t=x-2\\pi$로 치환하면 $x\\to2\\pi$일 때 $t\\to0$이고 $f(x)=mt$이다.\n분자는 $\\sin(2\\pi-x)=\\sin(-t)=-\\sin t$이다. (사인함수의 성질)\n$-\\sin t\\sim -t$이므로 극한값은 $\\frac{-t}{mt}=-\\frac{1}{m}$이다. (삼각함수의 극한 $\\lim_{t\\to0}\\frac{\\sin t}{t}=1$)\n$-\\frac{1}{m}=\\frac{1}{3}$에서 $m=-3$이다.\n그러므로 $f(3\\pi)=-3(3\\pi-2\\pi)=-3\\pi$이다.\n따라서 정답은 ①이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-169",
    "problemTypeKey": "PT_LIMIT_PARAMETER_DETERMINATION",
    "templateKey": "TPL_LIMIT_FINITE_CONDITION_PARAMETER",
    "crossConceptKeys": [
      "CC_LINEAR_FUNCTIONS",
      "CC_TRIGONOMETRIC_IDENTITY"
    ],
    "conditionKeys": [
      "COND_POLYNOMIAL_DEGREE_ONE"
    ],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 3,
    "category": "삼각함수의 미분",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-04",
    "standardUnit": "삼각함수의 미분",
    "standardUnitOrder": 4,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "삼각함수의 미분"
    ],
    "wide": false,
    "content": "일차함수 $f$에 대해 $\\lim_{x\\to\\pi/4}\\cos(2x)/f(x)=-1/3$일 때 $f(3\\pi/4)$는?",
    "choices": [
      "$\\pi$",
      "$3\\pi/2$",
      "$2\\pi$",
      "$3\\pi$",
      "$4\\pi$"
    ],
    "answer": "④",
    "solution": "$f$가 일차함수이고 극한값이 유한하므로 $f\\left(\\frac{\\pi}{4}\\right)=0$이어야 한다. (분모가 $0$으로 가야 함)\n따라서 $f(x)=m\\left(x-\\frac{\\pi}{4}\\right)$ ($m\\ne0$)로 놓는다.\n$t=x-\\frac{\\pi}{4}$로 치환하면 $x\\to\\frac{\\pi}{4}$일 때 $t\\to0$이고 $f(x)=mt$이다.\n분자는 $\\cos 2x=\\cos\\left(\\frac{\\pi}{2}+2t\\right)=-\\sin 2t$이다. (삼각함수의 덧셈정리)\n$-\\sin 2t\\sim -2t$이므로 극한값은 $\\frac{-2t}{mt}=-\\frac{2}{m}$이다. (삼각함수의 극한 $\\lim_{t\\to0}\\frac{\\sin t}{t}=1$)\n$-\\frac{2}{m}=-\\frac{1}{3}$에서 $m=6$이다.\n그러므로 $f\\left(\\frac{3\\pi}{4}\\right)=6\\left(\\frac{3\\pi}{4}-\\frac{\\pi}{4}\\right)=6\\cdot\\frac{\\pi}{2}=3\\pi$이다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-169",
    "problemTypeKey": "PT_LIMIT_PARAMETER_DETERMINATION",
    "templateKey": "TPL_LIMIT_FINITE_CONDITION_PARAMETER",
    "crossConceptKeys": [
      "CC_LINEAR_FUNCTIONS",
      "CC_TRIGONOMETRIC_IDENTITY"
    ],
    "conditionKeys": [
      "COND_POLYNOMIAL_DEGREE_ONE"
    ],
    "integrationPattern": "SEQUENTIAL"
  }
];
