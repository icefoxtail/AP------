window.examTitle = "미적분II_137_삼각함수의합성함수미분법2_고2_유형은행1";

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
    "content": "$f(x)=\\sin(2x),\\ g(x)=\\sin x$이고 $h=f\\circ g$이다. $h'(\\pi)$는?",
    "choices": [
      "$-5$",
      "$-4$",
      "$-3$",
      "$-2$",
      "$-1$"
    ],
    "answer": "④",
    "solution": "$h(x)=f(g(x))=\\sin(2\\sin x)$로 정리한다.\n합성함수의 미분법과 연쇄법칙에 의해 $h'(x)=\\cos(2\\sin x)\\cdot2\\cos x=2\\cos(2\\sin x)\\cos x$이다.\n$x=\\pi$를 대입하면 $\\sin\\pi=0$, $\\cos\\pi=-1$이므로 $h'(\\pi)=2\\cos0\\cdot(-1)=-2$이다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "B12",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-075",
    "problemTypeKey": "PT_DERIVATIVE_RULE_EVALUATION",
    "templateKey": "TPL_DERIVATIVE_RULE_CALCULATION",
    "crossConceptKeys": [
      "CC_FUNCTION_COMPOSITION",
      "CC_DERIVATIVE_VALUE_EVALUATION"
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
    "content": "곡선 $y=\\tan(\\sin2x)$ 위의 점 $(\\pi,0)$에서 접선의 기울기는?",
    "choices": [
      "$-2$",
      "$-1$",
      "$0$",
      "$1$",
      "$2$"
    ],
    "answer": "⑤",
    "solution": "$y=\\tan(\\sin2x)$에서 합성함수의 미분법을 적용한다.\n$y'=\\sec^2(\\sin2x)\\cdot(\\sin2x)'=\\sec^2(\\sin2x)\\cdot2\\cos2x$이다.\n$x=\\pi$이면 $\\sin2\\pi=0$, $\\cos2\\pi=1$이므로 $y'=\\sec^2 0\\cdot2\\cdot1=2$이다.\n접선의 기울기는 미분계수이므로 $2$이다.\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-075",
    "problemTypeKey": "PT_DERIVATIVE_RULE_EVALUATION",
    "templateKey": "TPL_DERIVATIVE_RULE_CALCULATION",
    "crossConceptKeys": [
      "CC_TANGENT_LINE_SLOPE_AT_POINT",
      "CC_DERIVATIVE_VALUE_EVALUATION"
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
    "content": "$f(x)=\\sec(\\pi x+\\pi/4)$에 대해 $f'(2)$는?",
    "choices": [
      "$-2\\pi\\sqrt2$",
      "$-\\pi\\sqrt2$",
      "$0$",
      "$\\pi\\sqrt2$",
      "$2\\pi\\sqrt2$"
    ],
    "answer": "④",
    "solution": "$f(x)=\\sec(\\pi x+\\pi/4)$에서 $\\sec u$의 도함수는 $\\sec u\\tan u$이다.\n합성함수의 미분법에 의해 $f'(x)=\\pi\\sec(\\pi x+\\pi/4)\\tan(\\pi x+\\pi/4)$이다.\n$x=2$를 대입하면 각은 $2\\pi+\\pi/4=9\\pi/4$이다.\n$\\sec(9\\pi/4)=\\sqrt2$, $\\tan(9\\pi/4)=1$이므로 $f'(2)=\\pi\\cdot\\sqrt2\\cdot1=\\pi\\sqrt2$이다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "B12",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-075",
    "problemTypeKey": "PT_DERIVATIVE_RULE_EVALUATION",
    "templateKey": "TPL_DERIVATIVE_RULE_CALCULATION",
    "crossConceptKeys": [
      "CC_SPECIAL_ANGLES",
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
    "content": "$0<x<\\pi/2$일 때 $f(\\sin x)=\\sin(2x)+2\\tan x$이다. $f'(1/\\sqrt2)$는?",
    "choices": [
      "$2\\sqrt2$",
      "$4\\sqrt2$",
      "$6\\sqrt2$",
      "$8\\sqrt2$",
      "$10\\sqrt2$"
    ],
    "answer": "②",
    "solution": "$f(\\sin x)=\\sin2x+2\\tan x$의 양변을 $x$에 대하여 미분한다.\n합성함수의 미분법과 삼각함수의 미분법에 의해 $f'(\\sin x)\\cos x=2\\cos2x+2\\sec^2x$이다.\n$x=\\pi/4$이면 $\\sin x=1/\\sqrt2$, $\\cos x=\\sqrt2/2$이고 $\\cos(\\pi/2)=0$, $\\sec^2(\\pi/4)=2$이다.\n따라서 $f'(1/\\sqrt2)\\cdot\\frac{\\sqrt2}{2}=2\\cdot0+2\\cdot2=4$이다.\n양변에 $\\frac{2}{\\sqrt2}=\\sqrt2$를 곱하면 $f'(1/\\sqrt2)=4\\sqrt2$이다.\n주의: $f'$의 변수는 $\\sin x$이므로 $\\cos x$로 나누어 값을 구해야 한다.\n따라서 정답은 ②이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-075",
    "problemTypeKey": "PT_DERIVATIVE_RULE_EVALUATION",
    "templateKey": "TPL_DERIVATIVE_RULE_CALCULATION",
    "crossConceptKeys": [
      "CC_TRIGONOMETRIC_IDENTITY",
      "CC_SPECIAL_ANGLES"
    ],
    "conditionKeys": [
      "COND_RESTRICTED_INTERVAL"
    ],
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
    "content": "$0<x<\\pi/2$에서 $(\\sec^2x+2\\tan x)f(x)=\\tan^3 x-3\\tan x-2$이다. $f'(\\pi/4)$는?",
    "choices": [
      "$2$",
      "$3$",
      "$4$",
      "$5$",
      "$6$"
    ],
    "answer": "①",
    "solution": "$t=\\tan x$라 두면 $\\sec^2x=1+t^2$이고 $0<x<\\pi/2$에서 $t>0$이다.\n주어진 식의 좌변은 $(1+t^2+2t)f(x)=(t+1)^2f(x)$이다.\n우변을 인수분해하면 $t^3-3t-2=(t+1)(t^2-t-2)=(t+1)^2(t-2)$이다.\n따라서 $(t+1)^2f(x)=(t+1)^2(t-2)$이고 $t+1\\neq0$이므로 $f(x)=\\tan x-2$이다.\n$f'(x)=\\sec^2x$이다.\n$x=\\pi/4$에서 $\\sec^2(\\pi/4)=(\\sqrt2)^2=2$이다.\n주의: $t+1=0$이면 양변을 나눌 수 없지만 $0<x<\\pi/2$에서 $t>0$이므로 문제되지 않는다.\n따라서 정답은 ①이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-075",
    "problemTypeKey": "PT_DERIVATIVE_RULE_EVALUATION",
    "templateKey": "TPL_DERIVATIVE_RULE_CALCULATION",
    "crossConceptKeys": [
      "CC_TRIGONOMETRIC_IDENTITY",
      "CC_SPECIAL_ANGLES"
    ],
    "conditionKeys": [
      "COND_RESTRICTED_INTERVAL"
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
    "content": "원 $x^2+y^2=16$의 내부 점 $A(2,0)$을 지나고 양의 $x$축과 각 $\\theta$를 이루는 직선이 원과 만나는 두 점을 $P,Q$라 한다. 현의 길이 $L(\\theta)$에 대해 $L'(\\pi/6)$은? [그림: 원점 중심의 반지름 4인 원, 점 $A(2,0)$, $A$에서 양의 $x$축 기준 반시계 방향으로 $\\theta$를 이루는 직선과 두 교점 $P,Q$를 표시한다.]",
    "choices": [
      "$-8\\sqrt5/5$",
      "$-6\\sqrt5/5$",
      "$-4\\sqrt5/5$",
      "$-2\\sqrt5/5$",
      "$0$"
    ],
    "answer": "④",
    "solution": "직선을 점 $A(2,0)$에서 방향벡터 $(\\cos\\theta,\\sin\\theta)$로 매개화하면 점은 $(2+s\\cos\\theta,s\\sin\\theta)$이다.\n원 $x^2+y^2=16$에 대입하면 $(2+s\\cos\\theta)^2+(s\\sin\\theta)^2=16$이다.\n정리하면 $s^2+4s\\cos\\theta-12=0$이다.\n두 교점에 대응하는 $s$를 $s_1,s_2$라 하면 근과 계수의 관계에서 $s_1+s_2=-4\\cos\\theta$, $s_1s_2=-12$이다.\n현의 길이는 $L=|s_1-s_2|=\\sqrt{(s_1+s_2)^2-4s_1s_2}$이다.\n대입하면 $L=\\sqrt{16\\cos^2\\theta+48}=4\\sqrt{\\cos^2\\theta+3}=4\\sqrt{4-\\sin^2\\theta}$이다.\n합성함수의 미분법으로 미분하면 $L'(\\theta)=4\\cdot\\frac{1}{2\\sqrt{4-\\sin^2\\theta}}\\cdot(-2\\sin\\theta\\cos\\theta)=\\frac{-4\\sin\\theta\\cos\\theta}{\\sqrt{4-\\sin^2\\theta}}$이다.\n$\\theta=\\pi/6$이면 $\\sin\\theta=1/2$, $\\cos\\theta=\\sqrt3/2$이므로 $L'(\\pi/6)=\\frac{-4\\cdot\\frac12\\cdot\\frac{\\sqrt3}{2}}{\\sqrt{4-\\frac14}}$이다.\n분모는 $\\sqrt{15/4}=\\frac{\\sqrt{15}}{2}$이고 분자는 $-\\sqrt3$이므로 $L'(\\pi/6)=\\frac{-2\\sqrt3}{\\sqrt{15}}=-\\frac{2}{\\sqrt5}=-\\frac{2\\sqrt5}{5}$이다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-075",
    "problemTypeKey": "PT_DERIVATIVE_RULE_EVALUATION",
    "templateKey": "TPL_DERIVATIVE_RULE_CALCULATION",
    "crossConceptKeys": [
      "CC_UNIT_CIRCLE",
      "CC_SPECIAL_ANGLES"
    ],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
  }
];
