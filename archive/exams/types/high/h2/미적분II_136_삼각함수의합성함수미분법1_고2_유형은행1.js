window.examTitle = "미적분II_136_삼각함수의합성함수미분법1_고2_유형은행1";

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
    "content": "$f(x)=3\\sin(5x)$에 대해 $f'(2\\pi)$는?",
    "choices": [
      "$9$",
      "$12$",
      "$15$",
      "$18$",
      "$21$"
    ],
    "answer": "③",
    "solution": "합성함수의 미분법으로 $f(x)=3\\sin(5x)$를 미분한다. $$f'(x)=3\\cdot5\\cos(5x)=15\\cos(5x)$$\n$x=2\\pi$를 대입한다. $$f'(2\\pi)=15\\cos(10\\pi)$$\n$\\cos(10\\pi)=\\cos(0)=1$이므로 값을 계산한다. $$f'(2\\pi)=15\\cdot1=15$$\n따라서 정답은 ③이다.",
    "difficultyBucket": 1,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-075",
    "problemTypeKey": "PT_DERIVATIVE_RULE_EVALUATION",
    "templateKey": "TPL_DERIVATIVE_RULE_CALCULATION",
    "crossConceptKeys": [
      "CC_DERIVATIVE_VALUE_EVALUATION"
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
    "content": "$f(x)=-\\cos^4 x$에 대해 $f'(\\pi/4)$는?",
    "choices": [
      "$0$",
      "$0.25$",
      "$0.5$",
      "$0.75$",
      "$1$"
    ],
    "answer": "⑤",
    "solution": "합성함수의 미분법으로 $f(x)=-\\cos^4x$를 미분한다. $$f'(x)=-4\\cos^3x\\cdot(-\\sin x)=4\\cos^3x\\sin x$$\n$x=\\frac{\\pi}{4}$를 대입한다. $$f'\\left(\\frac{\\pi}{4}\\right)=4\\left(\\frac{\\sqrt2}{2}\\right)^3\\cdot\\frac{\\sqrt2}{2}$$\n거듭제곱을 계산하면 $\\left(\\frac{\\sqrt2}{2}\\right)^3=\\frac{\\sqrt2}{4}$이다. $$f'\\left(\\frac{\\pi}{4}\\right)=4\\cdot\\frac{\\sqrt2}{4}\\cdot\\frac{\\sqrt2}{2}=4\\cdot\\frac{2}{8}=1$$\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "B12",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-075",
    "problemTypeKey": "PT_DERIVATIVE_RULE_EVALUATION",
    "templateKey": "TPL_DERIVATIVE_RULE_CALCULATION",
    "crossConceptKeys": [
      "CC_DERIVATIVE_VALUE_EVALUATION",
      "CC_SPECIAL_ANGLES"
    ],
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
    "content": "$f(x)=(ax^2+2)\\sin(3x)$이고 $f'(\\pi/6)=\\pi$일 때 $a$는?",
    "choices": [
      "$3$",
      "$4$",
      "$5$",
      "$6$",
      "$7$"
    ],
    "answer": "①",
    "solution": "곱의 미분법으로 $f(x)=(ax^2+2)\\sin(3x)$를 미분한다. $$f'(x)=2ax\\sin(3x)+3(ax^2+2)\\cos(3x)$$\n$x=\\frac{\\pi}{6}$을 대입하면 $\\sin\\frac{\\pi}{2}=1$, $\\cos\\frac{\\pi}{2}=0$이다. $$f'\\left(\\frac{\\pi}{6}\\right)=2a\\cdot\\frac{\\pi}{6}\\cdot1+3\\left(a\\cdot\\frac{\\pi^2}{36}+2\\right)\\cdot0$$\n둘째 항이 $0$이므로 정리한다. $$f'\\left(\\frac{\\pi}{6}\\right)=\\frac{a\\pi}{3}$$\n$f'\\left(\\frac{\\pi}{6}\\right)=\\pi$이므로 $\\frac{a\\pi}{3}=\\pi$에서 $a=3$이다.\n따라서 정답은 ①이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-075",
    "problemTypeKey": "PT_DERIVATIVE_RULE_EVALUATION",
    "templateKey": "TPL_DERIVATIVE_RULE_CALCULATION",
    "crossConceptKeys": [
      "CC_DERIVATIVE_VALUE_EVALUATION"
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
    "content": "$y=\\sin^2(2x)\\cos(4x)$의 도함수가 $y'=a\\sin(2x)\\cos(2x)[2\\cos(4x)-1]$일 때 $a$는?",
    "choices": [
      "$0$",
      "$2$",
      "$4$",
      "$6$",
      "$8$"
    ],
    "answer": "③",
    "solution": "$\\sin^2(2x)=\\frac{1-\\cos4x}{2}$로 바꾼다. $$y=\\frac{1-\\cos4x}{2}\\cos4x=\\frac{\\cos4x-\\cos^24x}{2}$$\n합성함수의 미분법으로 미분한다. $$y'=\\frac12\\left(-4\\sin4x+8\\cos4x\\sin4x\\right)$$\n$-4\\sin4x$와 $8\\cos4x\\sin4x$를 묶는다. $$y'=-2\\sin4x+4\\cos4x\\sin4x=2\\sin4x(2\\cos4x-1)$$\n$\\sin4x=2\\sin2x\\cos2x$를 대입한다. $$y'=2\\cdot2\\sin2x\\cos2x(2\\cos4x-1)=4\\sin2x\\cos2x(2\\cos4x-1)$$\n주어진 꼴 $a\\sin2x\\cos2x[2\\cos4x-1]$과 비교하면 $a=4$이다.\n따라서 정답은 ③이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-075",
    "problemTypeKey": "PT_DERIVATIVE_RULE_EVALUATION",
    "templateKey": "TPL_DERIVATIVE_RULE_CALCULATION",
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
    "content": "$f(x)=\\tan(2x)$이다. $0<a<\\pi/4$이고 $f'(a)=8$일 때 $a$는?",
    "choices": [
      "$\\pi/12$",
      "$\\pi/8$",
      "$\\pi/6$",
      "$\\pi/5$",
      "$\\pi/4$"
    ],
    "answer": "③",
    "solution": "$f(x)=\\tan(2x)$를 합성함수의 미분법으로 미분한다. $$f'(x)=2\\sec^2(2x)$$\n$f'(a)=8$을 대입한다. $$2\\sec^2(2a)=8\\quad\\Rightarrow\\quad\\sec^2(2a)=4$$\n$\\sec^2(2a)=\\frac{1}{\\cos^2(2a)}$이므로 $\\cos^2(2a)=\\frac14$이다. $$\\cos(2a)=\\frac12\\quad\\left(\\because 0<a<\\frac{\\pi}{4}\\text{이면 }0<2a<\\frac{\\pi}{2}\\right)$$\n$0<2a<\\frac{\\pi}{2}$에서 $\\cos(2a)=\\frac12$인 각은 $2a=\\frac{\\pi}{3}$이다. $$a=\\frac{\\pi}{6}$$\n따라서 정답은 ③이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-075",
    "problemTypeKey": "PT_DERIVATIVE_RULE_EVALUATION",
    "templateKey": "TPL_DERIVATIVE_RULE_CALCULATION",
    "crossConceptKeys": [
      "CC_TRIGONOMETRIC_EQUATION"
    ],
    "conditionKeys": [
      "COND_RANGE"
    ],
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
    "content": "$f(x)=2\\tan x-4\\sec x$이다. $-\\pi/2<x<\\pi/2$에서 $f'(x)=0$의 해는?",
    "choices": [
      "$-\\pi/3$",
      "$-\\pi/6$",
      "$0$",
      "$\\pi/12$",
      "$\\pi/6$"
    ],
    "answer": "⑤",
    "solution": "$f(x)=2\\tan x-4\\sec x$를 미분한다. $$f'(x)=2\\sec^2x-4\\sec x\\tan x$$\n$\\sec x=\\frac1{\\cos x}$, $\\tan x=\\frac{\\sin x}{\\cos x}$를 대입해 통분한다. $$f'(x)=\\frac{2}{\\cos^2x}-\\frac{4\\sin x}{\\cos^2x}=\\frac{2-4\\sin x}{\\cos^2x}$$\n정의역 $-\\frac{\\pi}{2}<x<\\frac{\\pi}{2}$에서 $\\cos x\\ne0$이다. $f'(x)=0$이려면 분자가 $0$이어야 한다. $$2-4\\sin x=0\\quad\\Rightarrow\\quad\\sin x=\\frac12$$\n$-\\frac{\\pi}{2}<x<\\frac{\\pi}{2}$에서 $\\sin x=\\frac12$인 $x$는 $x=\\frac{\\pi}{6}$이다.\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-075",
    "problemTypeKey": "PT_DERIVATIVE_RULE_EVALUATION",
    "templateKey": "TPL_DERIVATIVE_RULE_CALCULATION",
    "crossConceptKeys": [
      "CC_TRIGONOMETRIC_EQUATION"
    ],
    "conditionKeys": [
      "COND_RANGE"
    ],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 7,
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
    "content": "$f(x)=a\\tan x+2\\sec x$에서 $f'(\\pi/3)=0$일 때 $a$는?",
    "choices": [
      "$-2\\sqrt3$",
      "$-\\sqrt3$",
      "$-\\sqrt3/2$",
      "$\\sqrt3/2$",
      "$\\sqrt3$"
    ],
    "answer": "②",
    "solution": "$f(x)=a\\tan x+2\\sec x$를 미분한다. $$f'(x)=a\\sec^2x+2\\sec x\\tan x$$\n$x=\\frac{\\pi}{3}$에서 $\\sec\\frac{\\pi}{3}=2$, $\\tan\\frac{\\pi}{3}=\\sqrt3$이다. $$f'\\left(\\frac{\\pi}{3}\\right)=a\\cdot2^2+2\\cdot2\\cdot\\sqrt3$$\n계산하면 다음과 같다. $$f'\\left(\\frac{\\pi}{3}\\right)=4a+4\\sqrt3$$\n$f'\\left(\\frac{\\pi}{3}\\right)=0$이므로 $4a+4\\sqrt3=0$에서 $a=-\\sqrt3$이다.\n따라서 정답은 ②이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-075",
    "problemTypeKey": "PT_DERIVATIVE_RULE_EVALUATION",
    "templateKey": "TPL_DERIVATIVE_RULE_CALCULATION",
    "crossConceptKeys": [
      "CC_DERIVATIVE_VALUE_EVALUATION",
      "CC_SPECIAL_ANGLES"
    ],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 8,
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
    "content": "$f(x)=\\lim_{h\\to0}[\\cos^2(x+h)-\\cos^2x]/h$일 때 $f'(\\pi/6)$은?",
    "choices": [
      "$-4$",
      "$-3$",
      "$-2$",
      "$-1$",
      "$0$"
    ],
    "answer": "④",
    "solution": "극한의 정의에 의해 $f(x)$는 $g(t)=\\cos^2t$의 $t=x$에서의 도함수이다. $$f(x)=\\lim_{h\\to0}\\frac{\\cos^2(x+h)-\\cos^2x}{h}=\\frac{d}{dx}\\cos^2x$$\n합성함수의 미분법으로 계산한다. $$f(x)=2\\cos x\\cdot(-\\sin x)=-2\\sin x\\cos x=-\\sin2x$$\n이제 $f(x)=-\\sin2x$를 다시 미분한다. $$f'(x)=-2\\cos2x$$\n$x=\\frac{\\pi}{6}$을 대입한다. $$f'\\left(\\frac{\\pi}{6}\\right)=-2\\cos\\frac{\\pi}{3}=-2\\cdot\\frac12=-1$$\n주의: $f(x)$ 자체가 극한값으로 정의되어 있으므로 $f'(x)$는 $f(x)$를 먼저 간단히 한 뒤 미분한다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-075",
    "problemTypeKey": "PT_DERIVATIVE_RULE_EVALUATION",
    "templateKey": "TPL_DERIVATIVE_RULE_CALCULATION",
    "crossConceptKeys": [
      "CC_DERIVATIVE_DEFINITION_LIMIT",
      "CC_DERIVATIVE_VALUE_EVALUATION"
    ],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
  }
];
