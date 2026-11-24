window.examTitle = "미적분II_103_sinfxgxtanfxgx꼴의극한_고2_유형은행1";

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
    "content": "$\\lim_{x\\to 0}\\frac{\\sin(7x^2-3x)}{2x^2+4x}$의 값은?",
    "choices": [
      "$-1$",
      "$-0.75$",
      "$-0.5$",
      "$-0.25$",
      "$0$"
    ],
    "answer": "②",
    "solution": "$x\\to0$일 때 $2x^2+4x=2x(x+2)$이고 $x\\neq0$ 근처에서 $2x(x+2)\\neq0$이다. (극한의 성질)\n분자를 인수분해하면 $7x^2-3x=x(7x-3)$이다.\n$\\frac{\\sin(7x^2-3x)}{2x^2+4x}=\\frac{\\sin(7x^2-3x)}{7x^2-3x}\\cdot\\frac{x(7x-3)}{2x(x+2)}$로 변형한다. ($\\frac{\\sin u}{u}\\to1$ 꼴 만들기)\n약분하면 $=\\frac{\\sin(7x^2-3x)}{7x^2-3x}\\cdot\\frac{7x-3}{2x+4}$이다.\n$u=7x^2-3x$라 하면 $x\\to0$일 때 $u\\to0$이므로 $\\lim_{u\\to0}\\frac{\\sin u}{u}=1$이다. (사인 극한)\n따라서 극한값은 $1\\cdot\\frac{-3}{4}=-\\frac34=-0.75$이다.\n따라서 정답은 ②이다.",
    "difficultyBucket": 1,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "B12",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-163",
    "problemTypeKey": "PT_LIMIT_VALUE_CALC",
    "templateKey": "TPL_LIMIT_TRIG_STANDARD",
    "crossConceptKeys": [],
    "conditionKeys": [],
    "integrationPattern": "NONE"
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
    "content": "$\\lim_{x\\to 0}\\frac{\\tan(4x^3+2x^2-6x)}{3x^3-4x^2-2x}$의 값은?",
    "choices": [
      "$0$",
      "$1$",
      "$2$",
      "$3$",
      "$4$"
    ],
    "answer": "④",
    "solution": "$u=4x^3+2x^2-6x$라 하면 $x\\to0$일 때 $u\\to0$이다.\n분자와 분모를 각각 인수분해하면 $u=x(4x^2+2x-6)$, $3x^3-4x^2-2x=x(3x^2-4x-2)$이다.\n$\\frac{\\tan(4x^3+2x^2-6x)}{3x^3-4x^2-2x}=\\frac{\\tan u}{u}\\cdot\\frac{x(4x^2+2x-6)}{x(3x^2-4x-2)}$로 변형한다.\n약분하면 $=\\frac{\\tan u}{u}\\cdot\\frac{4x^2+2x-6}{3x^2-4x-2}$이다.\n$\\lim_{u\\to0}\\frac{\\tan u}{u}=1$이다. (탄젠트 극한)\n다항식 부분은 $x\\to0$일 때 $\\frac{4x^2+2x-6}{3x^2-4x-2}\\to\\frac{-6}{-2}=3$이다.\n따라서 극한값은 $1\\cdot3=3$이다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 1,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "B12",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-163",
    "problemTypeKey": "PT_LIMIT_VALUE_CALC",
    "templateKey": "TPL_LIMIT_TRIG_STANDARD",
    "crossConceptKeys": [],
    "conditionKeys": [],
    "integrationPattern": "NONE"
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
    "content": "다음 네 극한값의 합은?\n$\\lim_{x\\to 0}(\\sin2x+\\tan3x)/x$, $\\lim_{x\\to 0}(x+3\\sin x)/(x-3\\sin x)$, $\\lim_{x\\to 0}\\sin(\\tan 4x)/x$, $\\lim_{x\\to 0}\\sin(5x^2-2x)/x$",
    "choices": [
      "$2$",
      "$3$",
      "$4$",
      "$5$",
      "$6$"
    ],
    "answer": "④",
    "solution": "첫째 극한: $\\frac{\\sin2x+\\tan3x}{x}=2\\cdot\\frac{\\sin2x}{2x}+3\\cdot\\frac{\\tan3x}{3x}$로 쓴다.\n$\\lim_{x\\to0}\\frac{\\sin2x}{2x}=1$, $\\lim_{x\\to0}\\frac{\\tan3x}{3x}=1$이므로 첫째 값은 $2+3=5$이다. (사인·탄젠트 극한)\n둘째 극한: 분자와 분모를 $x$로 나누면 $\\frac{1+3\\cdot\\frac{\\sin x}{x}}{1-3\\cdot\\frac{\\sin x}{x}}$이다.\n$\\lim_{x\\to0}\\frac{\\sin x}{x}=1$이므로 둘째 값은 $\\frac{1+3}{1-3}=\\frac4{-2}=-2$이다.\n셋째 극한: $\\frac{\\sin(\\tan4x)}{x}=\\frac{\\sin(\\tan4x)}{\\tan4x}\\cdot\\frac{\\tan4x}{4x}\\cdot4$로 변형한다.\n$\\frac{\\sin(\\tan4x)}{\\tan4x}\\to1$, $\\frac{\\tan4x}{4x}\\to1$이므로 셋째 값은 $1\\cdot1\\cdot4=4$이다.\n넷째 극한: $\\frac{\\sin(5x^2-2x)}{x}=\\frac{\\sin(5x^2-2x)}{5x^2-2x}\\cdot(5x-2)$로 변형한다.\n$\\frac{\\sin(5x^2-2x)}{5x^2-2x}\\to1$이고 $5x-2\\to-2$이므로 넷째 값은 $1\\cdot(-2)=-2$이다.\n네 극한값의 합은 $5+(-2)+4+(-2)=5$이다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-163",
    "problemTypeKey": "PT_LIMIT_VALUE_CALC",
    "templateKey": "TPL_LIMIT_TRIG_STANDARD",
    "crossConceptKeys": [
      "CC_FUNCTION_COMPOSITION"
    ],
    "conditionKeys": [],
    "integrationPattern": "CASE_BRANCH"
  }
];
