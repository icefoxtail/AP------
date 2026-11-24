window.examTitle = "미적분II_105_x→∞일때의삼각함수의극한_고2_유형은행1";

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
    "content": "다음 중 유한한 극한값이 존재하지 않는 것은?",
    "choices": [
      "$\\lim_{x\\to \\infty}\\cos(2x)/x$",
      "$\\lim_{x\\to \\infty}x\\sin(3/x)$",
      "$\\lim_{x\\to \\infty}x\\tan(2/x)$",
      "$\\lim_{x\\to \\infty}x\\cos x$",
      "$\\lim_{x\\to 0}x\\cos(2/x)$"
    ],
    "answer": "④",
    "solution": "①: $x>0$일 때 $-\\frac1x\\le\\frac{\\cos 2x}{x}\\le\\frac1x$이고 $\\lim_{x\\to\\infty}\\frac1x=0$이므로 조임정리에 의해 극한은 $0$이다.\n②: $t=\\frac1x$로 치환하면 $x\\to\\infty$일 때 $t\\to0^+$이고 $\\lim_{x\\to\\infty}x\\sin\\frac3x=\\lim_{t\\to0^+}\\frac{\\sin3t}{t}=3$이다.\n③: 같은 치환에서 $\\lim_{x\\to\\infty}x\\tan\\frac2x=\\lim_{t\\to0^+}\\frac{\\tan2t}{t}=\\lim_{t\\to0^+}\\frac{\\tan2t}{2t}\\cdot2=2$이다.\n④: $x_n=2n\\pi$이면 $x_n\\cos x_n=2n\\pi\\to\\infty$이고, $y_n=(2n+1)\\pi$이면 $y_n\\cos y_n=-(2n+1)\\pi\\to-\\infty$이다.\n④: 따라서 $x\\to\\infty$일 때 $x\\cos x$는 하나의 유한한 값에 수렴하지 않는다.\n⑤: $-|x|\\le x\\cos\\frac2x\\le|x|$이고 $\\lim_{x\\to0}|x|=0$이므로 조임정리에 의해 극한은 $0$이다.\n주의: ④는 $\\infty$로 발산하는 것이 아니라 양의 무한대와 음의 무한대 사이를 진동하므로 유한한 극한값이 없다.\n유한한 극한값이 존재하지 않는 보기는 ④뿐이다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-165",
    "problemTypeKey": "PT_LIMIT_VALUE_CALC",
    "templateKey": "TPL_LIMIT_SQUEEZE",
    "crossConceptKeys": [
      "CC_FUNCTION_LIMIT"
    ],
    "conditionKeys": [],
    "integrationPattern": "CASE_BRANCH"
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
    "content": "다음 중 옳지 않은 것은?",
    "choices": [
      "$\\lim_{x\\to 0}\\sin 3x/x$$=3$",
      "$\\lim_{x\\to 0}x\\cos(2/x)$$=2$",
      "$\\lim_{x\\to \\infty}x\\tan(4/x)$$=4$",
      "$\\lim_{x\\to \\infty}\\sin(3x)/x$$=0$",
      "$\\lim_{x\\to 0}\\tan x\\sin(1/x)$$=0$"
    ],
    "answer": "②",
    "solution": "①: $\\lim_{x\\to0}\\frac{\\sin3x}{x}=\\lim_{x\\to0}\\frac{\\sin3x}{3x}\\cdot3=1\\cdot3=3$이므로 옳다.\n②: $0\\le\\left|x\\cos\\frac2x\\right|\\le|x|$이고 $\\lim_{x\\to0}|x|=0$이므로 조임정리에 의해 극한은 $0$이다.\n②: 따라서 주어진 등식 $\\lim_{x\\to0}x\\cos\\frac2x=2$는 옳지 않다.\n③: $t=\\frac1x$로 치환하면 $\\lim_{x\\to\\infty}x\\tan\\frac4x=\\lim_{t\\to0^+}\\frac{\\tan4t}{t}=\\lim_{t\\to0^+}\\frac{\\tan4t}{4t}\\cdot4=4$이므로 옳다.\n④: $\\left|\\frac{\\sin3x}{x}\\right|\\le\\frac1{|x|}$이고 $\\lim_{x\\to\\infty}\\frac1{|x|}=0$이므로 조임정리에 의해 극한은 $0$이다.\n⑤: $\\left|\\tan x\\sin\\frac1x\\right|\\le|\\tan x|$이고 $\\lim_{x\\to0}\\tan x=0$이므로 조임정리에 의해 극한은 $0$이다.\n주의: ②의 극한은 $2$가 아니라 $0$이며, $x\\cos\\frac2x$가 $2$에 가까워지는 것은 아니다.\n옳지 않은 것은 ②이다.\n따라서 정답은 ②이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-165",
    "problemTypeKey": "PT_LIMIT_VALUE_CALC",
    "templateKey": "TPL_LIMIT_SQUEEZE",
    "crossConceptKeys": [
      "CC_FUNCTION_LIMIT"
    ],
    "conditionKeys": [],
    "integrationPattern": "CASE_BRANCH"
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
    "content": "다음 [보기]에서 옳은 것만 고른 것은?\nㄱ. $\\lim_{x\\to 0}\\tan(4x)/x$$=4$\nㄴ. $\\lim_{x\\to \\infty}x\\sin(6/x)$$=1$\nㄷ. $\\lim_{x\\to 0}(e^{3x}-1)/\\tan x$$=3$\nㄹ. $\\lim_{x\\to 0}(3^x-1)/\\sin 2x$$=\\ln3$",
    "choices": [
      "ㄱ, ㄴ",
      "ㄱ, ㄷ",
      "ㄱ, ㄹ",
      "ㄴ, ㄷ",
      "ㄴ, ㄹ"
    ],
    "answer": "②",
    "solution": "ㄱ: $\\lim_{x\\to0}\\frac{\\tan4x}{x}=\\lim_{x\\to0}\\frac{\\tan4x}{4x}\\cdot4=1\\cdot4=4$이므로 옳다.\nㄴ: $t=\\frac1x$로 치환하면 $x\\to\\infty$일 때 $t\\to0^+$이다.\nㄴ: $\\lim_{x\\to\\infty}x\\sin\\frac6x=\\lim_{t\\to0^+}\\frac{\\sin6t}{t}=\\lim_{t\\to0^+}\\frac{\\sin6t}{6t}\\cdot6=6$이다.\nㄴ: 따라서 $1$이 아니므로 옳지 않다.\nㄷ: $\\frac{e^{3x}-1}{\\tan x}=\\frac{e^{3x}-1}{3x}\\cdot\\frac{x}{\\tan x}\\cdot3$으로 분해한다.\nㄷ: $\\lim_{x\\to0}\\frac{e^{3x}-1}{3x}=1$, $\\lim_{x\\to0}\\frac{x}{\\tan x}=1$이므로 극한은 $1\\cdot1\\cdot3=3$이다.\nㄷ: 따라서 옳다.\nㄹ: $\\frac{3^x-1}{\\sin2x}=\\frac{3^x-1}{x}\\cdot\\frac{x}{\\sin2x}$로 분해한다.\nㄹ: $\\lim_{x\\to0}\\frac{3^x-1}{x}=\\ln3$이고 $\\lim_{x\\to0}\\frac{x}{\\sin2x}=\\frac12\\lim_{x\\to0}\\frac{2x}{\\sin2x}=\\frac12$이다.\nㄹ: 따라서 극한은 $\\ln3\\cdot\\frac12=\\frac{\\ln3}{2}$이므로 $\\ln3$이 아니다.\n주의: ㄴ은 치환 후 극한이 $6$이고, ㄹ은 $\\sin2x$의 계수 $2$ 때문에 $\\frac{\\ln3}{2}$이다.\n옳은 것은 ㄱ, ㄷ뿐이다.\n따라서 정답은 ②이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-165",
    "problemTypeKey": "PT_LIMIT_VALUE_CALC",
    "templateKey": "TPL_LIMIT_SQUEEZE",
    "crossConceptKeys": [
      "CC_FUNCTION_LIMIT"
    ],
    "conditionKeys": [],
    "integrationPattern": "CASE_BRANCH"
  }
];
