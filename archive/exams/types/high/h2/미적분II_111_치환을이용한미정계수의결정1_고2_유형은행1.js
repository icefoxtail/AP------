window.examTitle = "미적분II_111_치환을이용한미정계수의결정1_고2_유형은행1";

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
    "content": "$\\lim_{x\\to1/4}\\cos(2\\pi x)/(ax+b)=1/2$일 때 $a+b$는?",
    "choices": [
      "$-5\\pi$",
      "$-4\\pi$",
      "$-3\\pi$",
      "$-2\\pi$",
      "$-\\pi$"
    ],
    "answer": "③",
    "solution": "분모가 $0$이 되는 곳에서 유한한 극한이 존재해야 하므로 $a/4+b=0$이다.\n$t=x-1/4$로 놓으면 $x=t+1/4$이고 $x\\to1/4$일 때 $t\\to0$이다.\n$\\cos(2\\pi x)=\\cos(2\\pi t+\\pi/2)=-\\sin(2\\pi t)$이다.\n분모는 $a(x-1/4)=at$이므로 주어진 극한은 $$\\lim_{t\\to0}\\frac{-\\sin(2\\pi t)}{at}=-\\frac{1}{a}\\lim_{t\\to0}\\frac{\\sin(2\\pi t)}{t}$$이다.\n사인 극한 $\\lim_{t\\to0}\\frac{\\sin t}{t}=1$을 이용하면 $$-\\frac{1}{a}\\cdot2\\pi\\lim_{t\\to0}\\frac{\\sin(2\\pi t)}{2\\pi t}=-\\frac{2\\pi}{a}$$이다.\n$-\\frac{2\\pi}{a}=\\frac12$에서 $a=-4\\pi$이다.\n$a/4+b=0$에 대입하면 $-\\pi+b=0$이므로 $b=\\pi$이다.\n따라서 $a+b=-4\\pi+\\pi=-3\\pi$이다.\n따라서 정답은 ③이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-169",
    "problemTypeKey": "PT_LIMIT_PARAMETER_DETERMINATION",
    "templateKey": "TPL_LIMIT_FINITE_CONDITION_PARAMETER",
    "crossConceptKeys": [
      "CC_TRIGONOMETRIC_IDENTITY"
    ],
    "conditionKeys": [],
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
    "content": "$\\lim_{x\\to b}a\\sin(2x)/(x-b)=6$, $a\\ne0$, $0<b<\\pi$일 때 $ab$는?",
    "choices": [
      "$-7\\pi/2$",
      "$-3\\pi$",
      "$-5\\pi/2$",
      "$-2\\pi$",
      "$-3\\pi/2$"
    ],
    "answer": "⑤",
    "solution": "분모가 $0$으로 가는데 극한이 유한하므로 분자도 $0$으로 가야 한다.\n$\\lim_{x\\to b}(a\\sin2x)=a\\sin2b=0$이고 $a\\ne0$이므로 $\\sin2b=0$이다.\n$0<b<\\pi$에서 $2b=n\\pi$이므로 $b=\\pi/2$이다.\n$t=x-b$로 놓으면 $x=b+t$이고 $t\\to0$이다.\n$\\sin(2x)=\\sin(2b+2t)=\\sin(\\pi+2t)=-\\sin2t$이다.\n따라서 극한은 $$\\lim_{t\\to0}\\frac{a(-\\sin2t)}{t}=-2a\\lim_{t\\to0}\\frac{\\sin2t}{2t}=-2a$$이다.\n$-2a=6$에서 $a=-3$이다.\n$b=\\pi/2$이므로 $ab=-3\\cdot\\frac{\\pi}{2}=-\\frac{3\\pi}{2}$이다.\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-169",
    "problemTypeKey": "PT_LIMIT_PARAMETER_DETERMINATION",
    "templateKey": "TPL_LIMIT_FINITE_CONDITION_PARAMETER",
    "crossConceptKeys": [
      "CC_TRIGONOMETRIC_EQUATION"
    ],
    "conditionKeys": [
      "COND_NONZERO",
      "COND_RANGE"
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
    "content": "$\\lim_{x\\to2\\pi}(a\\tan 3x+b)/(x-2\\pi)=9$일 때 $a+b$는?",
    "choices": [
      "$0$",
      "$1$",
      "$2$",
      "$3$",
      "$4$"
    ],
    "answer": "④",
    "solution": "분모가 $0$으로 가므로 유한한 극한이 존재하려면 분자도 $0$으로 가야 한다.\n$\\lim_{x\\to2\\pi}(a\\tan3x+b)=a\\tan6\\pi+b=b$이므로 $b=0$이다.\n$t=x-2\\pi$로 놓으면 $x=2\\pi+t$이고 $t\\to0$이다.\n$\\tan(3x)=\\tan(6\\pi+3t)=\\tan3t$이다.\n따라서 극한은 $$\\lim_{t\\to0}\\frac{a\\tan3t}{t}=3a\\lim_{t\\to0}\\frac{\\tan3t}{3t}=3a$$이다.\n$3a=9$에서 $a=3$이다.\n$b=0$이므로 $a+b=3+0=3$이다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "B12",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-169",
    "problemTypeKey": "PT_LIMIT_PARAMETER_DETERMINATION",
    "templateKey": "TPL_LIMIT_FINITE_CONDITION_PARAMETER",
    "crossConceptKeys": [],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
  }
];
