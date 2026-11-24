window.examTitle = "미적분II_171_기울기가주어질때접선의방정식의활용_고2_유형은행1";

window.questionBank = [
  {
    "id": 1,
    "category": "도함수의 활용",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-06",
    "standardUnit": "도함수의 활용",
    "standardUnitOrder": 6,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "도함수의 활용"
    ],
    "wide": false,
    "content": "곡선 $y=\\ln x$ $(x>0)$ 위의 점 $P$와 두 점 $A(-3,0)$, $B(0,3)$이 이루는 삼각형 $ABP$의 넓이의 최솟값은? [그림: 곡선 $y=\\ln x$와 직선 $y=x+3$을 그린다. $A(-3,0)$, $B(0,3)$, 곡선 위의 예시점 $P(e,1)$을 표시해 삼각형을 그린다.]",
    "choices": [
      "$6$",
      "$7$",
      "$8$",
      "$9$",
      "$10$"
    ],
    "answer": "①",
    "solution": "$A(-3,0)$, $B(0,3)$를 지나는 직선의 방정식은 $y=x+3$, 즉 $x-y+3=0$이다.\n$\\overline{AB}=\\sqrt{(0+3)^2+(3-0)^2}=\\sqrt{18}=3\\sqrt2$이다.\n$P(x,\\ln x)$에서 직선 $x-y+3=0$까지의 거리는 점과 직선 사이의 거리 공식으로 $\\frac{|x-\\ln x+3|}{\\sqrt{1^2+(-1)^2}}=\\frac{|h(x)|}{\\sqrt2}$이다. (단, $h(x)=x+3-\\ln x$)\n로그함수의 미분법으로 $h'(x)=1-\\frac1x=\\frac{x-1}{x}$이다.\n(i) $0<x<1$에서 $h'(x)<0$이므로 $h$는 감소한다.\n(ii) $x>1$에서 $h'(x)>0$이므로 $h$는 증가한다.\n따라서 $h$의 최솟값은 $h(1)=1+3-0=4$이고, $h(x)>0$이므로 거리의 최솟값은 $\\frac4{\\sqrt2}=2\\sqrt2$이다.\n삼각형의 넓이는 $\\frac12\\cdot\\overline{AB}\\cdot(\\text{높이})$이므로 최솟값은 $\\frac12\\cdot3\\sqrt2\\cdot2\\sqrt2=\\frac12\\cdot3\\sqrt2\\cdot\\frac4{\\sqrt2}=6$이다.\n따라서 정답은 ①이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-083",
    "problemTypeKey": "PT_TANGENT_DERIVATIVE",
    "templateKey": "TPL_TANGENT_CONSTRUCTION",
    "crossConceptKeys": [
      "CC_DERIVATIVE_VALUE_EVALUATION"
    ],
    "conditionKeys": [
      "COND_POSITIVE"
    ],
    "integrationPattern": "REINTERPRETATION"
  },
  {
    "id": 2,
    "category": "도함수의 활용",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-06",
    "standardUnit": "도함수의 활용",
    "standardUnitOrder": 6,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "도함수의 활용"
    ],
    "wide": false,
    "content": "곡선 $y=e^{3x-1}+2$ 위의 점과 직선 $y=3x-1$ 사이의 거리의 최솟값은?",
    "choices": [
      "$\\frac2{\\sqrt{10}}$",
      "$\\frac3{\\sqrt{10}}$",
      "$\\frac4{\\sqrt{10}}$",
      "$\\frac5{\\sqrt{10}}$",
      "$\\frac6{\\sqrt{10}}$"
    ],
    "answer": "②",
    "solution": "직선 $y=3x-1$을 $3x-y-1=0$으로 쓰고, 곡선 위의 점을 $(x,e^{3x-1}+2)$라 하자.\n점과 직선 사이의 거리는 $\\frac{|3x-(e^{3x-1}+2)-1|}{\\sqrt{3^2+(-1)^2}}=\\frac{|-(e^{3x-1}-3x+3)|}{\\sqrt{10}}$이다.\n절댓값 안의 식을 $h(x)=e^{3x-1}-3x+3$으로 놓는다.\n합성함수의 미분법으로 $h'(x)=3e^{3x-1}-3=3(e^{3x-1}-1)$이다.\n$h'(x)=0$이면 $e^{3x-1}=1$에서 $3x-1=0$, 즉 $x=\\frac13$이다.\n$x<\\frac13$에서 $h'(x)<0$이고 $x>\\frac13$에서 $h'(x)>0$이므로 $h$는 $x=\\frac13$에서 최소이다.\n$h\\left(\\frac13\\right)=e^0-3\\cdot\\frac13+3=1-1+3=3$이다.\n$h(x)\\ge3>0$이므로 거리의 최솟값은 $\\frac3{\\sqrt{10}}$이다.\n따라서 정답은 ②이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-083",
    "problemTypeKey": "PT_TANGENT_DERIVATIVE",
    "templateKey": "TPL_TANGENT_CONSTRUCTION",
    "crossConceptKeys": [
      "CC_EXPONENTIAL_FUNCTION_GRAPH",
      "CC_DERIVATIVE_VALUE_EVALUATION"
    ],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 3,
    "category": "도함수의 활용",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-06",
    "standardUnit": "도함수의 활용",
    "standardUnitOrder": 6,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "도함수의 활용"
    ],
    "wide": false,
    "content": "$0<x<\\frac\\pi2$에서 $P=(x,\\tan x)$이고 $A=(0,-3), B=(\\frac32,0)$이다. 삼각형 $ABP$의 최소 넓이는? [그림: 제1사분면에 $y=\\tan x$와 점근선 $x=\\pi/2$를 그린다. $A(0,-3)$, $B(\\frac32,0)$, 곡선 위의 예시점 $P(\\frac\\pi6,\\frac1{\\sqrt3})$을 표시해 삼각형을 그린다.]",
    "choices": [
      "$1-\\frac\\pi8$",
      "$\\frac32-\\frac\\pi8$",
      "$2-\\frac\\pi8$",
      "$3-\\frac{3\\pi}8$",
      "$4-\\frac{3\\pi}8$"
    ],
    "answer": "④",
    "solution": "$A(0,-3)$, $B\\left(\\frac32,0\\right)$를 지나는 직선은 기울기 $\\frac{0-(-3)}{3/2-0}=2$이므로 $y=2x-3$, 즉 $2x-y-3=0$이다.\n$\\overline{AB}=\\sqrt{\\left(\\frac32\\right)^2+3^2}=\\sqrt{\\frac94+9}=\\sqrt{\\frac{45}4}=\\frac{3\\sqrt5}2$이다.\n$P(x,\\tan x)$에서 직선 $2x-y-3=0$까지의 거리는 $\\frac{|2x-\\tan x-3|}{\\sqrt{2^2+(-1)^2}}=\\frac{|\\tan x-2x+3|}{\\sqrt5}$이다.\n$h(x)=\\tan x-2x+3$이라 하면 탄젠트의 미분법으로 $h'(x)=\\sec^2x-2=\\tan^2x-1$이다.\n$0<x<\\frac\\pi2$에서 $h'(x)=0$이면 $\\tan x=1$, 즉 $x=\\frac\\pi4$이다.\n$0<x<\\frac\\pi4$에서 $\\tan x<1$이므로 $h'(x)<0$이고, $\\frac\\pi4<x<\\frac\\pi2$에서 $h'(x)>0$이므로 $h$는 $x=\\frac\\pi4$에서 최소이다.\n$h\\left(\\frac\\pi4\\right)=1-2\\cdot\\frac\\pi4+3=1-\\frac\\pi2+3=4-\\frac\\pi2>0$이다.\n따라서 높이의 최솟값은 $\\frac{4-\\pi/2}{\\sqrt5}$이고, 넓이의 최솟값은 $\\frac12\\cdot\\frac{3\\sqrt5}2\\cdot\\frac{4-\\pi/2}{\\sqrt5}=\\frac34\\left(4-\\frac\\pi2\\right)=3-\\frac{3\\pi}8$이다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-083",
    "problemTypeKey": "PT_TANGENT_DERIVATIVE",
    "templateKey": "TPL_TANGENT_CONSTRUCTION",
    "crossConceptKeys": [
      "CC_TRIGONOMETRIC_TANGENT",
      "CC_DERIVATIVE_VALUE_EVALUATION"
    ],
    "conditionKeys": [
      "COND_RESTRICTED_INTERVAL"
    ],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 4,
    "category": "도함수의 활용",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-06",
    "standardUnit": "도함수의 활용",
    "standardUnitOrder": 6,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "도함수의 활용"
    ],
    "wide": false,
    "content": "$P=(a,e^a+e^{-a})$, $A=(0,-\\frac83)$, $B=(1,0)$이다. 삼각형 $PAB$의 넓이가 최소일 때 $a$의 값은? [그림: 곡선 $y=e^x+e^{-x}$와 직선 $y=\\frac83x-\\frac83$을 그린다. $A(0,-\\frac83)$, $B(1,0)$, 곡선 위의 예시점 $P(0,2)$를 표시해 삼각형을 그린다.]",
    "choices": [
      "$0$",
      "$\\ln2$",
      "$\\ln\\frac52$",
      "$\\ln3$",
      "$\\ln4$"
    ],
    "answer": "④",
    "solution": "$A\\left(0,-\\frac83\\right)$, $B(1,0)$을 지나는 직선은 기울기 $\\frac{0-(-8/3)}{1-0}=\\frac83$이므로 $y=\\frac83x-\\frac83$, 즉 $8x-3y-8=0$이다.\n$\\overline{AB}=\\sqrt{1^2+\\left(\\frac83\\right)^2}=\\sqrt{\\frac{9+64}9}=\\frac{\\sqrt{73}}3$이다.\n$P(a,e^a+e^{-a})$에서 직선 $8x-3y-8=0$까지의 거리는 $\\frac{|8a-3(e^a+e^{-a})-8|}{\\sqrt{8^2+(-3)^2}}=\\frac{3\\left|e^a+e^{-a}-\\frac83a+\\frac83\\right|}{\\sqrt{73}}$이다.\n$h(a)=e^a+e^{-a}-\\frac83a+\\frac83$이라 하면 지수함수의 미분법으로 $h'(a)=e^a-e^{-a}-\\frac83$이다.\n$u=e^a>0$으로 치환하면 $h'(a)=u-\\frac1u-\\frac83=\\frac{3u^2-8u-3}{3u}=\\frac{(3u+1)(u-3)}{3u}$이다.\n$u>0$에서 $3u+1>0$, $3u>0$이므로 $h'(a)$의 부호는 $u-3=e^a-3$의 부호와 같다.\n$a<\\ln3$에서 $h'(a)<0$, $a>\\ln3$에서 $h'(a)>0$이므로 $h$는 $a=\\ln3$에서 최소이다.\n$h(\\ln3)=3+\\frac13-\\frac83\\ln3+\\frac83=6-\\frac83\\ln3$이고, $\\ln3<2$이므로 $\\frac83\\ln3<\\frac{16}3$이다.\n따라서 $h(\\ln3)>6-\\frac{16}3=\\frac23>0$이므로 $|h(a)|$도 $a=\\ln3$에서 최소이다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-083",
    "problemTypeKey": "PT_TANGENT_DERIVATIVE",
    "templateKey": "TPL_TANGENT_CONSTRUCTION",
    "crossConceptKeys": [
      "CC_DERIVATIVE_ROOT_SOLVING"
    ],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 5,
    "category": "도함수의 활용",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-06",
    "standardUnit": "도함수의 활용",
    "standardUnitOrder": 6,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "도함수의 활용"
    ],
    "wide": false,
    "content": "원 $x^2+y^2=4$ 위의 점 $P$와 곡선 $y=\\sqrt x-3$ 위의 점 $Q$ 사이의 최소 거리를 $\\sqrt a-b$라 할 때, 자연수 $a,b$에 대하여 $a+b$는?",
    "choices": [
      "$3$",
      "$4$",
      "$5$",
      "$6$",
      "$7$"
    ],
    "answer": "⑤",
    "solution": "$Q$를 곡선 $y=\\sqrt x-3$ 위의 점이라 하고 $t=\\sqrt x\\ge0$이라 하면 $Q=(t^2,t-3)$이다.\n원의 중심은 $O(0,0)$, 반지름은 $2$이고 거리 공식으로 $\\overline{OQ}^2=(t^2)^2+(t-3)^2=t^4+(t-3)^2$이다.\n$F(t)=\\overline{OQ}^2$라 하면 다항함수의 미분법으로 $F'(t)=4t^3+2(t-3)=4t^3+2t-6$이다.\n$F'(t)=2(2t^3+t-3)=2(t-1)(2t^2+2t+3)$으로 인수분해된다.\n$t\\ge0$에서 $2t^2+2t+3>0$이므로 $F'(t)$의 부호는 $t-1$의 부호와 같다.\n$0\\le t<1$에서 $F'(t)<0$, $t>1$에서 $F'(t)>0$이므로 $F$는 $t=1$에서 최소이다.\n$F(1)=1^4+(1-3)^2=1+4=5$이므로 $\\overline{OQ}$의 최솟값은 $\\sqrt5$이다.\n$\\sqrt5>2$이므로 곡선 위의 모든 점 $Q$는 원의 외부에 있다.\n삼각부등식 $\\overline{PQ}\\ge\\overline{OQ}-\\overline{OP}=\\overline{OQ}-2$가 성립하고, 선분 $OQ$ 위에서 $\\overline{OP}=2$인 점 $P$를 택하면 등호가 성립한다.\n따라서 최소 거리는 $\\sqrt5-2$이고 $a=5$, $b=2$이므로 $a+b=7$이다.\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B45",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-083",
    "problemTypeKey": "PT_TANGENT_DERIVATIVE",
    "templateKey": "TPL_TANGENT_CONSTRUCTION",
    "crossConceptKeys": [
      "CC_IRRATIONAL_FUNCTION_GRAPH"
    ],
    "conditionKeys": [
      "COND_NATURAL_NUMBER"
    ],
    "integrationPattern": "INTERDEPENDENT"
  }
];
