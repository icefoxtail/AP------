window.examTitle = "미적분II_106_치환을이용한삼각함수의극한_고2_유형은행1";

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
    "content": "$x\\to2\\pi$에서 $\\sin3x/(x-2\\pi)$의 극한과 $x\\to\\pi/2$에서 $\\cos x/(\\pi/2-x)$의 극한의 곱은?",
    "choices": [
      "$-1$",
      "$0$",
      "$1$",
      "$2$",
      "$3$"
    ],
    "answer": "⑤",
    "solution": "$x\\to2\\pi$에서 $t=x-2\\pi$로 놓으면 $t\\to0$이다.\n$\\sin3x=\\sin(3t+6\\pi)=\\sin3t$이므로 $\\lim_{x\\to2\\pi}\\frac{\\sin3x}{x-2\\pi}=\\lim_{t\\to0}\\frac{\\sin3t}{t}=3$이다. (삼각함수의 극한)\n$x\\to\\frac{\\pi}{2}$에서 $u=\\frac{\\pi}{2}-x$로 놓으면 $u\\to0$이고 $\\cos x=\\cos(\\frac{\\pi}{2}-u)=\\sin u$이다.\n따라서 $\\lim_{x\\to\\pi/2}\\frac{\\cos x}{\\pi/2-x}=\\lim_{u\\to0}\\frac{\\sin u}{u}=1$이다.\n두 극한의 곱은 $3\\times1=3$이다.\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "B12",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-166",
    "problemTypeKey": "PT_LIMIT_VALUE_CALC",
    "templateKey": "TPL_LIMIT_VALUE_CALC_STANDARD",
    "crossConceptKeys": [
      "CC_COMPLEMENTARY_ANGLE_TRIG",
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
    "content": "$x\\to\\pi$에서 $\\sin5x/(\\pi-x)$와 $\\tan2x/(x-\\pi)$의 극한, $x\\to\\pi/2$에서 $\\sin4x/(x-\\pi/2)$의 극한의 합은?",
    "choices": [
      "$7$",
      "$8$",
      "$9$",
      "$10$",
      "$11$"
    ],
    "answer": "⑤",
    "solution": "$x\\to\\pi$에서 $t=x-\\pi$로 놓으면 $t\\to0$이다.\n$\\sin5x=\\sin(5t+5\\pi)=-\\sin5t$이므로 $\\lim_{x\\to\\pi}\\frac{\\sin5x}{\\pi-x}=\\lim_{t\\to0}\\frac{-\\sin5t}{-t}=5$이다.\n$\\tan2x=\\tan(2t+2\\pi)=\\tan2t$이므로 $\\lim_{x\\to\\pi}\\frac{\\tan2x}{x-\\pi}=\\lim_{t\\to0}\\frac{\\tan2t}{t}=2$이다. (삼각함수의 극한)\n$x\\to\\frac{\\pi}{2}$에서 $u=x-\\frac{\\pi}{2}$로 놓으면 $\\sin4x=\\sin(4u+2\\pi)=\\sin4u$이다.\n따라서 $\\lim_{x\\to\\pi/2}\\frac{\\sin4x}{x-\\pi/2}=\\lim_{u\\to0}\\frac{\\sin4u}{u}=4$이다.\n세 극한의 합은 $5+2+4=11$이다.\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-166",
    "problemTypeKey": "PT_LIMIT_VALUE_CALC",
    "templateKey": "TPL_LIMIT_VALUE_CALC_STANDARD",
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
    "content": "$\\lim_{x\\to\\pi/2}(1-\\sin x)/[(\\pi-2x)\\cos x]$의 값은?",
    "choices": [
      "$-0.25$",
      "$0$",
      "$0.25$",
      "$0.5$",
      "$0.75$"
    ],
    "answer": "③",
    "solution": "$t=\\frac{\\pi}{2}-x$로 놓으면 $t\\to0$이고 $x=\\frac{\\pi}{2}-t$이다.\n$\\sin x=\\cos t$, $\\cos x=\\sin t$이다. (삼각함수의 여각 공식)\n$\\pi-2x=2t$이므로 주어진 극한은 $\\lim_{t\\to0}\\frac{1-\\cos t}{2t\\sin t}$이다.\n반각공식 $1-\\cos t=2\\sin^2\\frac{t}{2}$와 $\\sin t=2\\sin\\frac{t}{2}\\cos\\frac{t}{2}$를 쓰면 $\\frac{1-\\cos t}{t\\sin t}=\\frac{\\sin(t/2)}{t\\cos(t/2)}$이다.\n$\\lim_{t\\to0}\\frac{\\sin(t/2)}{t\\cos(t/2)}=\\frac12$이므로 전체 극한은 $\\frac12\\times\\frac12=\\frac14$이다.\n따라서 정답은 ③이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-166",
    "problemTypeKey": "PT_LIMIT_VALUE_CALC",
    "templateKey": "TPL_LIMIT_VALUE_CALC_STANDARD",
    "crossConceptKeys": [
      "CC_COMPLEMENTARY_ANGLE_TRIG",
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
    "content": "$x\\to\\pi$에서 $\\sin2x/(x-\\pi)$, $(1+\\cos x)/[(x-\\pi)\\sin x]$의 극한과 $x\\to\\pi/2$에서 $(2x-\\pi)\\tan x$의 극한의 합은?",
    "choices": [
      "$-0.75$",
      "$-0.5$",
      "$-0.25$",
      "$0$",
      "$0.25$"
    ],
    "answer": "②",
    "solution": "$x\\to\\pi$에서 $t=x-\\pi$로 놓으면 $t\\to0$이다.\n$\\sin2x=\\sin(2t+2\\pi)=\\sin2t$이므로 첫 극한은 $\\lim_{t\\to0}\\frac{\\sin2t}{t}=2$이다.\n$\\cos x=\\cos(t+\\pi)=-\\cos t$, $\\sin x=\\sin(t+\\pi)=-\\sin t$이므로 둘째 극한은 $\\lim_{t\\to0}\\frac{1-\\cos t}{-t\\sin t}=-\\frac12$이다. (반각공식)\n$x\\to\\frac{\\pi}{2}$에서 $u=x-\\frac{\\pi}{2}$로 놓으면 $2x-\\pi=2u$이고 $\\tan x=\\tan(u+\\frac{\\pi}{2})=-\\frac{1}{\\tan u}$이다.\n셋째 극한은 $\\lim_{u\\to0}(-2u)\\cdot\\frac{1}{\\tan u}=-2$이다. (삼각함수의 극한)\n주의: $x\\to\\frac{\\pi}{2}$에서 $\\tan x$는 음의 무한대로 가므로 부호를 놓치지 않는다.\n세 극한의 합은 $2-\\frac12-2=-\\frac12$이다.\n따라서 정답은 ②이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-166",
    "problemTypeKey": "PT_LIMIT_VALUE_CALC",
    "templateKey": "TPL_LIMIT_VALUE_CALC_STANDARD",
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
    "content": "$\\lim_{x\\to0}(1-\\cos4x)/x^2$, $\\lim_{x\\to\\pi/2}(1-\\sin x)/(x-\\pi/2)^2$, $\\lim_{x\\to\\pi/2}(\\pi-2x)\\tan x$의 곱은?",
    "choices": [
      "$6$",
      "$7$",
      "$8$",
      "$9$",
      "$10$"
    ],
    "answer": "③",
    "solution": "첫째 극한: $1-\\cos4x=2\\sin^22x$이므로 $\\frac{1-\\cos4x}{x^2}=2\\left(\\frac{\\sin2x}{x}\\right)^2=8\\left(\\frac{\\sin2x}{2x}\\right)^2$이다.\n따라서 $\\lim_{x\\to0}\\frac{1-\\cos4x}{x^2}=8$이다. (삼각함수의 극한)\n둘째 극한: $t=x-\\frac{\\pi}{2}$로 놓으면 $\\sin x=\\cos t$이므로 $\\lim_{x\\to\\pi/2}\\frac{1-\\sin x}{(x-\\pi/2)^2}=\\lim_{t\\to0}\\frac{1-\\cos t}{t^2}=\\frac12$이다. (반각공식)\n셋째 극한: 같은 $t$에 대해 $\\pi-2x=-2t$, $\\tan x=-\\frac{1}{\\tan t}$이므로 $\\lim_{x\\to\\pi/2}(\\pi-2x)\\tan x=\\lim_{t\\to0}2\\frac{t}{\\tan t}=2$이다.\n세 극한의 곱은 $8\\times\\frac12\\times2=8$이다.\n따라서 정답은 ③이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-166",
    "problemTypeKey": "PT_LIMIT_VALUE_CALC",
    "templateKey": "TPL_LIMIT_VALUE_CALC_STANDARD",
    "crossConceptKeys": [
      "CC_COMPLEMENTARY_ANGLE_TRIG",
      "CC_TRIGONOMETRIC_IDENTITY"
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
    "content": "$A=\\lim_{x\\to0}(1-\\cos 2x)/(x\\tan x)$, $B=\\lim_{x\\to\\pi/4}(4x-\\pi)\\tan 2x$, $C=\\lim_{x\\to\\pi/3}(2\\pi-6x)/\\sin(x-\\pi/3)$, $D=\\lim_{x\\to\\pi/4}(\\sin x-\\cos x)/(x-\\pi/4)$이다. 작은 값부터 나열한 것은?",
    "choices": [
      "$A<B<C<D$",
      "$B<C<A<D$",
      "$C<B<A<D$",
      "$C<B<D<A$",
      "$D<C<B<A$"
    ],
    "answer": "④",
    "solution": "A: $1-\\cos2x=2\\sin^2x$이고 $\\tan x=\\frac{\\sin x}{\\cos x}$이므로 $\\frac{1-\\cos2x}{x\\tan x}=\\frac{2\\sin^2x}{x\\cdot\\frac{\\sin x}{\\cos x}}=\\frac{2\\sin x\\cos x}{x}$이다.\n$\\frac{2\\sin x\\cos x}{x}=\\frac{\\sin2x}{x}=2\\frac{\\sin2x}{2x}$이므로 $A=2$이다. (삼각함수의 극한)\nB: $t=x-\\frac{\\pi}{4}$로 놓으면 $4x-\\pi=4t$이고 $\\tan2x=\\tan(2t+\\frac{\\pi}{2})=-\\frac{1}{\\tan2t}$이다.\n따라서 $B=\\lim_{t\\to0}4t\\left(-\\frac{1}{\\tan2t}\\right)=-2\\lim_{t\\to0}\\frac{2t}{\\tan2t}=-2$이다. (삼각함수의 극한)\nC: $u=x-\\frac{\\pi}{3}$로 놓으면 $2\\pi-6x=-6u$이고 $\\sin(x-\\frac{\\pi}{3})=\\sin u$이다.\n따라서 $C=\\lim_{u\\to0}\\frac{-6u}{\\sin u}=-6$이다.\nD: $v=x-\\frac{\\pi}{4}$로 놓고 삼각함수의 덧셈정리를 쓰면 $\\sin x-\\cos x=\\frac{\\sin v+\\cos v}{\\sqrt2}-\\frac{\\cos v-\\sin v}{\\sqrt2}=\\sqrt2\\sin v$이다.\n따라서 $D=\\lim_{v\\to0}\\frac{\\sqrt2\\sin v}{v}=\\sqrt2$이다.\n$A=2$, $B=-2$, $C=-6$, $D=\\sqrt2$이고 $-6<-2<\\sqrt2<2$이므로 $C<B<D<A$이다.\n주의: $D=\\sqrt2\\approx1.414$이므로 $D<A=2$이다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-166",
    "problemTypeKey": "PT_LIMIT_VALUE_CALC",
    "templateKey": "TPL_LIMIT_VALUE_CALC_STANDARD",
    "crossConceptKeys": [
      "CC_TRIGONOMETRIC_IDENTITY",
      "CC_TRIG_RATIO_ORDER"
    ],
    "conditionKeys": [],
    "integrationPattern": "CASE_BRANCH"
  }
];
