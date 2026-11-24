window.examTitle = "미적분II_124_삼각함수의미분계수의활용_고2_유형은행1";

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
    "content": "$f(t)=2\\sin t+3\\cos t$일 때 $\\lim_{x\\to0}\\frac{f(\\sin3x)-3}{x}$는?",
    "choices": [
      "$2$",
      "$3$",
      "$4$",
      "$5$",
      "$6$"
    ],
    "answer": "⑤",
    "solution": "$f(0)=2\\sin0+3\\cos0=0+3=3$임을 확인한다. (함숫값)\n$f'(t)=2\\cos t-3\\sin t$이므로 $f'(0)=2\\cos0-3\\sin0=2$이다. (삼각함수의 미분법)\n$t=\\sin3x$라 두면 $x\\to0$일 때 $t\\to0$이고 $\\dfrac{t}{x}=\\dfrac{\\sin3x}{x}\\to3$이다. (사인 극한)\n주어진 극한을 차분몫 꼴로 쓰면 $\\lim_{x\\to0}\\dfrac{f(\\sin3x)-f(0)}{x}=\\lim_{x\\to0}\\dfrac{f(t)-f(0)}{t}\\cdot\\dfrac{t}{x}$이다.\n$\\dfrac{f(t)-f(0)}{t}\\to f'(0)=2$이므로 극한값은 $2\\cdot3=6$이다. (미분계수의 정의)\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "B12",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-075",
    "problemTypeKey": "PT_DERIVATIVE_RULE_EVALUATION",
    "templateKey": "TPL_DERIVATIVE_RULE_CALCULATION",
    "crossConceptKeys": [
      "CC_DERIVATIVE_DEFINITION_LIMIT"
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
    "content": "$f(t)=2\\tan t+\\sin t$일 때 $\\lim_{x\\to0}\\frac{f(\\sin4x)-f(\\tan2x)}{x}$는?",
    "choices": [
      "$-6$",
      "$-3$",
      "$6$",
      "$9$",
      "$12$"
    ],
    "answer": "③",
    "solution": "$f(0)=2\\tan0+\\sin0=0$이다.\n$f'(t)=2\\sec^{2}t+\\cos t$이므로 $f'(0)=2\\cdot1+1=3$이다. (탄젠트·사인의 미분법)\n분자에 $f(0)=0$을 더하고 빼서 두 차분몫으로 나눈다: $\\dfrac{f(\\sin4x)-f(0)}{x}-\\dfrac{f(\\tan2x)-f(0)}{x}$.\n$t=\\sin4x$일 때 $\\dfrac{t}{x}=\\dfrac{\\sin4x}{x}\\to4$이므로 첫 항은 $f'(0)\\cdot4=12$이다.\n$s=\\tan2x$일 때 $\\dfrac{s}{x}=\\dfrac{\\tan2x}{x}\\to2$이므로 둘째 항은 $f'(0)\\cdot2=6$이다. (탄젠트 극한)\n따라서 극한값은 $12-6=6$이다.\n따라서 정답은 ③이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-075",
    "problemTypeKey": "PT_DERIVATIVE_RULE_EVALUATION",
    "templateKey": "TPL_DERIVATIVE_RULE_CALCULATION",
    "crossConceptKeys": [
      "CC_DERIVATIVE_DEFINITION_LIMIT"
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
    "content": "$f(t)=e^{2t}\\sin4t+3\\cos t$일 때 $\\lim_{x\\to0}\\frac{f(\\tan(-2x))-3}{x}$는?",
    "choices": [
      "$-8$",
      "$-4$",
      "$0$",
      "$4$",
      "$8$"
    ],
    "answer": "①",
    "solution": "$f(0)=e^{0}\\sin0+3\\cos0=0+3=3$이다.\n$f'(t)=2e^{2t}\\sin4t+4e^{2t}\\cos4t-3\\sin t$이다. (곱의 미분법, 합성함수의 미분법)\n$f'(0)=2\\cdot1\\cdot0+4\\cdot1\\cdot1-3\\cdot0=4$이다.\n$t=\\tan(-2x)$라 두면 $x\\to0$일 때 $t\\to0$이고 $\\dfrac{t}{x}=\\dfrac{\\tan(-2x)}{x}\\to-2$이다. (탄젠트 극한)\n$\\lim_{x\\to0}\\dfrac{f(t)-3}{x}=\\lim_{x\\to0}\\dfrac{f(t)-f(0)}{t}\\cdot\\dfrac{t}{x}=4\\cdot(-2)=-8$이다. (미분계수의 정의)\n따라서 정답은 ①이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-075",
    "problemTypeKey": "PT_DERIVATIVE_RULE_EVALUATION",
    "templateKey": "TPL_DERIVATIVE_RULE_CALCULATION",
    "crossConceptKeys": [
      "CC_DERIVATIVE_DEFINITION_LIMIT"
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
    "content": "$f(t)=\\cos t$일 때 $\\lim_{x\\to0}\\frac{f(\\pi/2+4(1-\\cos x))-f(\\pi/2)}{x^2}$는?",
    "choices": [
      "$-4$",
      "$-2$",
      "$-1$",
      "$1$",
      "$2$"
    ],
    "answer": "②",
    "solution": "$f(\\pi/2)=\\cos(\\pi/2)=0$이다.\n$u=4(1-\\cos x)$라 두면 $x\\to0$일 때 $u\\to0$이다.\n반각 공식 $1-\\cos x=2\\sin^{2}\\dfrac{x}{2}$을 쓰면 $\\dfrac{u}{x^{2}}=\\dfrac{4(1-\\cos x)}{x^{2}}=\\dfrac{8\\sin^{2}(x/2)}{x^{2}}=2\\left(\\dfrac{\\sin(x/2)}{x/2}\\right)^{2}\\to2$이다.\n$f(\\pi/2+u)-f(\\pi/2)=\\cos(\\pi/2+u)-0=-\\sin u$이다. (삼각함수의 덧셈정리)\n$\\lim_{x\\to0}\\dfrac{-\\sin u}{x^{2}}=\\lim_{x\\to0}\\left(-\\dfrac{\\sin u}{u}\\right)\\cdot\\dfrac{u}{x^{2}}=(-1)\\cdot2=-2$이다.\n따라서 정답은 ②이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-075",
    "problemTypeKey": "PT_DERIVATIVE_RULE_EVALUATION",
    "templateKey": "TPL_DERIVATIVE_RULE_CALCULATION",
    "crossConceptKeys": [
      "CC_DERIVATIVE_DEFINITION_LIMIT"
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
    "content": "$f$가 $2$에서 미분가능하고 $f(2)=5$, $f'(2)=-3$이다. $\\lim_{x\\to0}\\frac{f(1+\\cos2x)-5}{x^2}$는?",
    "choices": [
      "$-6$",
      "$-3$",
      "$3$",
      "$6$",
      "$9$"
    ],
    "answer": "④",
    "solution": "$x\\to0$일 때 $1+\\cos2x\\to2$이고 $f$는 $2$에서 미분가능하다.\n$u=\\cos2x-1$이라 두면 $1+\\cos2x=2+u$이고 $x\\to0$일 때 $u\\to0$이다.\n반각 공식 $\\cos2x-1=-2\\sin^{2}x$을 쓰면 $\\dfrac{u}{x^{2}}=\\dfrac{-2\\sin^{2}x}{x^{2}}=-2\\left(\\dfrac{\\sin x}{x}\\right)^{2}\\to-2$이다.\n$\\lim_{x\\to0}\\dfrac{f(2+u)-5}{x^{2}}=\\lim_{x\\to0}\\dfrac{f(2+u)-f(2)}{u}\\cdot\\dfrac{u}{x^{2}}$로 분해한다.\n$\\dfrac{f(2+u)-f(2)}{u}\\to f'(2)=-3$이다. (미분계수의 정의)\n따라서 극한값은 $(-3)\\cdot(-2)=6$이다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-075",
    "problemTypeKey": "PT_DERIVATIVE_RULE_EVALUATION",
    "templateKey": "TPL_DERIVATIVE_RULE_CALCULATION",
    "crossConceptKeys": [
      "CC_DERIVATIVE_DEFINITION_LIMIT"
    ],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
  }
];
