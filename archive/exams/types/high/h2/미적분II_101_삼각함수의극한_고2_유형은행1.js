window.examTitle = "미적분II_101_삼각함수의극한_고2_유형은행1";

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
    "content": "다음 중 유한한 극한값이 존재하는 것은?",
    "choices": [
      "$\\lim_{x\\to \\pi/4}\\tan 2x$",
      "$\\lim_{x\\to 0}\\frac{3+\\tan 2x}{2\\cos x}$",
      "$\\lim_{x\\to 0}\\cos(2x)/x$",
      "$\\lim_{x\\to 3}2/(x-3)$",
      "$\\lim_{x\\to 2^+}\\ln(x-2)$"
    ],
    "answer": "②",
    "solution": "① $x\\to\\pi/4$이면 $2x\\to\\pi/2$이므로 $\\tan 2x$는 유한한 값으로 수렴하지 않는다.\n② $x\\to0$일 때 $\\tan2x\\to0$, $\\cos x\\to1$이므로 극한의 성질에 의해 $$\\lim_{x\\to0}\\frac{3+\\tan2x}{2\\cos x}=\\frac{3+0}{2\\cdot1}=\\frac32$$로 유한하다.\n③ $x\\to0$에서 분자는 $1$로 수렴하고 분모는 $0$으로 가므로 $\\cos(2x)/x$는 발산한다.\n④ $x\\to3$에서 분자는 $2$, 분모는 $0$으로 가므로 $2/(x-3)$은 발산한다.\n⑤ $x\\to2^+$이면 $x-2\\to0^+$이고 $\\ln(x-2)\\to-\\infty$이므로 발산한다.\n따라서 정답은 ②이다.",
    "difficultyBucket": 1,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "B12",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-163",
    "problemTypeKey": "PT_LIMIT_VALUE_CALC",
    "templateKey": "TPL_LIMIT_TRIG_STANDARD",
    "crossConceptKeys": [
      "CC_FUNCTION_LIMIT"
    ],
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
    "content": "$\\lim_{x\\to 0}\\frac{3\\sin(2x)-\\frac32\\sin(4x)}{\\sin^3(2x)}$의 값은?",
    "choices": [
      "$0.5$",
      "$0.75$",
      "$1$",
      "$1.25$",
      "$1.5$"
    ],
    "answer": "⑤",
    "solution": "$t=2x$로 놓으면 $x\\to0$일 때 $t\\to0$이다.\n배각 공식 $\\sin2t=2\\sin t\\cos t$를 적용하면 분자는 $$3\\sin t-\\frac32\\sin2t=3\\sin t-3\\sin t\\cos t=3\\sin t(1-\\cos t)$$이다.\n따라서 주어진 식은 $$\\frac{3\\sin t(1-\\cos t)}{\\sin^3t}=\\frac{3(1-\\cos t)}{\\sin^2t}$$이다.\n$\\sin^2t=1-\\cos^2t=(1-\\cos t)(1+\\cos t)$이므로 $$\\frac{3(1-\\cos t)}{(1-\\cos t)(1+\\cos t)}=\\frac{3}{1+\\cos t}$$로 약분된다.\n$t\\to0$이면 $\\cos t\\to1$이므로 극한값은 $$\\frac{3}{1+1}=\\frac32=1.5$$이다.\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-163",
    "problemTypeKey": "PT_LIMIT_VALUE_CALC",
    "templateKey": "TPL_LIMIT_TRIG_STANDARD",
    "crossConceptKeys": [
      "CC_TRIGONOMETRIC_IDENTITY"
    ],
    "conditionKeys": [],
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
    "content": "$\\lim_{x\\to 0}\\frac{2\\sin^2(3x)}{1-\\cos 3x}$의 값은?",
    "choices": [
      "$0$",
      "$1$",
      "$2$",
      "$3$",
      "$4$"
    ],
    "answer": "⑤",
    "solution": "$t=3x$로 놓으면 $x\\to0$일 때 $t\\to0$이다.\n$\\sin^2t=1-\\cos^2t=(1-\\cos t)(1+\\cos t)$로 인수분해한다.\n주어진 식은 $$\\frac{2(1-\\cos t)(1+\\cos t)}{1-\\cos t}$$이다.\n$t\\ne0$인 근방에서 $1-\\cos t\\ne0$이므로 약분하면 $$2(1+\\cos t)$$이다.\n$\\cos t\\to1$이므로 극한값은 $2(1+1)=4$이다.\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "B12",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-163",
    "problemTypeKey": "PT_LIMIT_VALUE_CALC",
    "templateKey": "TPL_LIMIT_TRIG_STANDARD",
    "crossConceptKeys": [
      "CC_TRIGONOMETRIC_IDENTITY"
    ],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 4,
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
    "content": "$\\lim_{x\\to 0}\\frac{3\\sin^2(2x)}{2\\cos 2x-2\\cos^2(2x)}$의 값은?",
    "choices": [
      "$2$",
      "$3$",
      "$4$",
      "$5$",
      "$6$"
    ],
    "answer": "②",
    "solution": "$t=2x$로 놓으면 $x\\to0$일 때 $t\\to0$이다.\n분자는 $3\\sin^2t=3(1-\\cos^2t)=3(1-\\cos t)(1+\\cos t)$로 인수분해한다.\n분모는 $2\\cos t-2\\cos^2t=2\\cos t(1-\\cos t)$로 인수분해한다.\n$t\\ne0$인 근방에서 $1-\\cos t\\ne0$이므로 약분하면 $$\\frac{3(1-\\cos t)(1+\\cos t)}{2\\cos t(1-\\cos t)}=\\frac{3(1+\\cos t)}{2\\cos t}$$이다.\n$t\\to0$이면 $\\cos t\\to1$이므로 극한값은 $$\\frac{3(1+1)}{2\\cdot1}=3$$이다.\n따라서 정답은 ②이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-163",
    "problemTypeKey": "PT_LIMIT_VALUE_CALC",
    "templateKey": "TPL_LIMIT_TRIG_STANDARD",
    "crossConceptKeys": [
      "CC_TRIGONOMETRIC_IDENTITY"
    ],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 5,
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
    "content": "$\\lim_{x\\to \\pi/4}\\frac{2(\\sin x-\\cos x)}{1-\\tan^2x}$의 값은?",
    "choices": [
      "$-\\sqrt2/2$",
      "$-\\sqrt2/4$",
      "$0$",
      "$\\sqrt2/4$",
      "$\\sqrt2/2$"
    ],
    "answer": "①",
    "solution": "$\\tan x=\\frac{\\sin x}{\\cos x}$이므로 분모를 통분하면 $$1-\\tan^2x=\\frac{\\cos^2x-\\sin^2x}{\\cos^2x}$$이다.\n분자를 인수분해하면 $\\cos^2x-\\sin^2x=(\\cos x-\\sin x)(\\cos x+\\sin x)$이다.\n따라서 주어진 식은 $$\\frac{2(\\sin x-\\cos x)\\cos^2x}{(\\cos x-\\sin x)(\\cos x+\\sin x)}$$이다.\n$\\sin x-\\cos x=-(\\cos x-\\sin x)$이므로 약분하면 $$-\\frac{2\\cos^2x}{\\cos x+\\sin x}$$이다.\n$x\\to\\pi/4$일 때 $\\cos x\\to\\frac{\\sqrt2}{2}$, $\\sin x\\to\\frac{\\sqrt2}{2}$이다.\n극한값은 $$-\\frac{2\\cdot(\\frac{\\sqrt2}{2})^2}{\\frac{\\sqrt2}{2}+\\frac{\\sqrt2}{2}}=-\\frac{2\\cdot\\frac12}{\\sqrt2}=-\\frac1{\\sqrt2}=-\\frac{\\sqrt2}{2}$$이다.\n따라서 정답은 ①이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-163",
    "problemTypeKey": "PT_LIMIT_VALUE_CALC",
    "templateKey": "TPL_LIMIT_TRIG_STANDARD",
    "crossConceptKeys": [
      "CC_TRIGONOMETRIC_IDENTITY",
      "CC_SPECIAL_ANGLES"
    ],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 6,
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
    "content": "다음 극한값 중 옳지 않은 것은?",
    "choices": [
      "$\\lim_{x\\to 0}\\cos^2(2x)/(1+\\sin 2x)$$=1$",
      "$\\lim_{x\\to \\pi/4}(1-\\tan x)/(\\sin x-\\cos x)$$=-\\sqrt2$",
      "$\\lim_{x\\to 0}(1-\\cos 2x)/\\sin^2(2x)$$=1$",
      "$\\lim_{x\\to 0}x\\cos(3/x)$$=0$",
      "$\\lim_{x\\to 0}x^2\\sin(2/x)$$=0$"
    ],
    "answer": "③",
    "solution": "① $x\\to0$일 때 $\\cos^2(2x)\\to1$, $1+\\sin2x\\to1$이므로 연속함수의 극한에 의해 극한값은 $1$이다.\n② $1-\\tan x=\\frac{\\cos x-\\sin x}{\\cos x}$이고 $\\sin x-\\cos x=-(\\cos x-\\sin x)$이므로 $$\\frac{1-\\tan x}{\\sin x-\\cos x}=-\\frac1{\\cos x}$$이다.\n$x\\to\\pi/4$이면 $\\cos x\\to\\frac{\\sqrt2}{2}$이므로 ②의 극한값은 $-\\frac1{\\sqrt2/2}=-\\sqrt2$이다.\n③ $\\sin^2(2x)=1-\\cos^2(2x)=(1-\\cos2x)(1+\\cos2x)$이므로 $$\\frac{1-\\cos2x}{\\sin^2(2x)}=\\frac1{1+\\cos2x}$$이다.\n$x\\to0$이면 $\\cos2x\\to1$이므로 ③의 극한값은 $\\frac1{1+1}=\\frac12$이다. 따라서 ③의 등식 $=1$은 옳지 않다.\n④ $|x\\cos(3/x)|\\le|x|$이고 $|x|\\to0$이므로 조임 정리에 의해 극한값은 $0$이다.\n⑤ $|x^2\\sin(2/x)|\\le x^2$이고 $x^2\\to0$이므로 조임 정리에 의해 극한값은 $0$이다.\n따라서 정답은 ③이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-163",
    "problemTypeKey": "PT_LIMIT_VALUE_CALC",
    "templateKey": "TPL_LIMIT_TRIG_STANDARD",
    "crossConceptKeys": [
      "CC_FUNCTION_LIMIT",
      "CC_TRIGONOMETRIC_IDENTITY"
    ],
    "conditionKeys": [],
    "integrationPattern": "CASE_BRANCH"
  }
];
