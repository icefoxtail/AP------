window.examTitle = "미적분II_257_정적분으로정의된함수의극한_고2_유형은행1";

window.questionBank = [
  {
    "id": 1,
    "category": "여러 가지 적분법",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-07",
    "standardUnit": "여러 가지 적분법",
    "standardUnitOrder": 7,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "여러 가지 적분법"
    ],
    "wide": false,
    "content": "함수 $f(x) = 2x^2 - 3\\cos(\\pi x) + e^{x-1}$일 때, $\\lim_{x \\to 1} \\frac{1}{x-1} \\int_1^x f(t) \\, dt$의 값은?",
    "choices": [
      "2",
      "4",
      "6",
      "8",
      "10"
    ],
    "answer": "③",
    "solution": "1단계: $f(t)$의 부정적분을 $F(t)$라 하면 $F'(t)=f(t)$이고, 미적분학의 기본정리에 의해 $\\int_1^x f(t)\\,dt=F(x)-F(1)$이다.\n2단계: 주어진 극한을 미분계수의 정의 꼴로 바꾼다. $\\lim_{x\\to1}\\frac{1}{x-1}\\int_1^x f(t)\\,dt=\\lim_{x\\to1}\\frac{F(x)-F(1)}{x-1}$\n3단계: 미분계수의 정의에 의해 이 값은 $F'(1)=f(1)$이다.\n4단계: $f(1)=2\\cdot1^2-3\\cos\\pi+e^{1-1}=2-3(-1)+1$.\n5단계: $\\cos\\pi=-1$, $e^0=1$이므로 $f(1)=2+3+1=6$이다.\n따라서 정답은 ③이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-187",
    "problemTypeKey": "PT_DEFINITE_INTEGRAL_FUNCTION_RELATION",
    "templateKey": "TPL_INTEGRAL_DEFINED_FUNCTION_DIFFERENTIATION",
    "crossConceptKeys": [
      "CC_DERIVATIVE_DEFINITION_LIMIT"
    ],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 2,
    "category": "여러 가지 적분법",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-07",
    "standardUnit": "여러 가지 적분법",
    "standardUnitOrder": 7,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "여러 가지 적분법"
    ],
    "wide": false,
    "content": "$\\lim_{x \\to 1} \\frac{1}{x-1} \\int_1^x (3t-1)\\pi e^{2t-1} \\, dt$의 값은?",
    "choices": [
      "$\\frac{1}{2}\\pi e$",
      "$\\pi e$",
      "$\\frac{3}{2}\\pi e$",
      "$2\\pi e$",
      "$\\frac{5}{2}\\pi e$"
    ],
    "answer": "④",
    "solution": "1단계: $g(t)=(3t-1)\\pi e^{2t-1}$이라 하고 그 부정적분을 $G(t)$라 하면 $G'(t)=g(t)$이다.\n2단계: 미적분학의 기본정리에 의해 $\\int_1^x g(t)\\,dt=G(x)-G(1)$이다.\n3단계: 극한을 미분계수 꼴로 쓴다. $\\lim_{x\\to1}\\frac{1}{x-1}\\int_1^x g(t)\\,dt=\\lim_{x\\to1}\\frac{G(x)-G(1)}{x-1}$\n4단계: 미분계수의 정의에 의해 이 값은 $G'(1)=g(1)$이다.\n5단계: $g(1)=(3\\cdot1-1)\\pi e^{2\\cdot1-1}=2\\pi e^{1}$이다.\n6단계: 따라서 극한값은 $2\\pi e$이다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B12",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-187",
    "problemTypeKey": "PT_DEFINITE_INTEGRAL_FUNCTION_RELATION",
    "templateKey": "TPL_INTEGRAL_DEFINED_FUNCTION_DIFFERENTIATION",
    "crossConceptKeys": [
      "CC_DERIVATIVE_DEFINITION_LIMIT"
    ],
    "conditionKeys": [],
    "integrationPattern": "NONE"
  },
  {
    "id": 3,
    "category": "여러 가지 적분법",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-07",
    "standardUnit": "여러 가지 적분법",
    "standardUnitOrder": 7,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "여러 가지 적분법"
    ],
    "wide": false,
    "content": "함수 $f(x) = (2x-1)e^{x-1} + \\sin(\\pi x)$에 대하여\n$$\\lim_{h \\to 0} \\frac{1}{h} \\int_{1-h}^{1+2h} f(t) \\, dt$$\n의 값은?",
    "choices": [
      "-1",
      "0",
      "1",
      "2",
      "3"
    ],
    "answer": "⑤",
    "solution": "1단계: $f(t)$의 부정적분을 $F(t)$라 하면 $F'(t)=f(t)$이고, 미적분학의 기본정리에 의해 $\\int_{1-h}^{1+2h}f(t)\\,dt=F(1+2h)-F(1-h)$이다.\n2단계: 분자에 $F(1)$을 빼고 더해 두 항으로 나눈다. $\\frac{F(1+2h)-F(1)}{h}-\\frac{F(1-h)-F(1)}{h}$\n3단계: 첫째 항의 분모·분자를 $2h$로 맞춘다. $2\\cdot\\frac{F(1+2h)-F(1)}{2h}$\n4단계: 둘째 항은 $\\frac{F(1-h)-F(1)}{h}=-\\frac{F(1-h)-F(1)}{-h}$로 쓴다.\n5단계: $h\\to0$일 때 각각 미분계수의 정의를 적용하면 $2F'(1)+F'(1)=3f(1)$이다.\n6단계: $f(1)=(2\\cdot1-1)e^{0}+\\sin\\pi=1\\cdot1+0=1$이다.\n7단계: 따라서 극한값은 $3\\cdot1=3$이다.\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-187",
    "problemTypeKey": "PT_DEFINITE_INTEGRAL_FUNCTION_RELATION",
    "templateKey": "TPL_INTEGRAL_DEFINED_FUNCTION_DIFFERENTIATION",
    "crossConceptKeys": [
      "CC_DERIVATIVE_DEFINITION_LIMIT",
      "CC_DEFINITE_INTEGRAL_INTERVAL_ADDITIVITY"
    ],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 4,
    "category": "여러 가지 적분법",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-07",
    "standardUnit": "여러 가지 적분법",
    "standardUnitOrder": 7,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "여러 가지 적분법"
    ],
    "wide": false,
    "content": "함수 $f(x) = \\sin x$에 대하여\n$$\\lim_{x \\to \\frac{\\pi}{3}} \\frac{1}{x - \\frac{\\pi}{3}} \\int_{\\frac{\\pi}{3}}^x \\{f(t)\\}^2 f'(t) \\, dt$$\n의 값은?",
    "choices": [
      "$\\frac{1}{8}$",
      "$\\frac{1}{4}$",
      "$\\frac{3}{8}$",
      "$\\frac{1}{2}$",
      "$\\frac{5}{8}$"
    ],
    "answer": "③",
    "solution": "1단계: $g(t)=\\{f(t)\\}^2f'(t)$의 부정적분을 $G(t)$라 하면 $G'(t)=g(t)$이고 $\\int_{\\pi/3}^x g(t)\\,dt=G(x)-G(\\pi/3)$이다.\n2단계: 미분계수의 정의에 의해 주어진 극한은 $G'(\\pi/3)=g(\\pi/3)$이다.\n3단계: $f(x)=\\sin x$이므로 $f'(x)=\\cos x$이다.\n4단계: $f(\\pi/3)=\\sin(\\pi/3)=\\frac{\\sqrt3}{2}$, $f'(\\pi/3)=\\cos(\\pi/3)=\\frac12$이다.\n5단계: $g(\\pi/3)=\\left(\\frac{\\sqrt3}{2}\\right)^2\\cdot\\frac12=\\frac34\\cdot\\frac12$이다.\n6단계: 따라서 극한값은 $\\frac38$이다.\n따라서 정답은 ③이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-187",
    "problemTypeKey": "PT_DEFINITE_INTEGRAL_FUNCTION_RELATION",
    "templateKey": "TPL_INTEGRAL_DEFINED_FUNCTION_DIFFERENTIATION",
    "crossConceptKeys": [
      "CC_DERIVATIVE_DEFINITION_LIMIT",
      "CC_SPECIAL_ANGLES"
    ],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 5,
    "category": "여러 가지 적분법",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-07",
    "standardUnit": "여러 가지 적분법",
    "standardUnitOrder": 7,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "여러 가지 적분법"
    ],
    "wide": false,
    "content": "함수 $f(x) = \\int_0^x (2t+1)\\cos t \\, dt$에 대하여\n$$\\lim_{x \\to \\frac{\\pi}{2}} \\frac{1}{x - \\frac{\\pi}{2}} \\int_{\\frac{\\pi}{2}}^x f(t) \\, dt$$\n의 값은?",
    "choices": [
      "$\\pi - 5$",
      "$\\pi - 4$",
      "$\\pi - 3$",
      "$\\pi - 2$",
      "$\\pi - 1$"
    ],
    "answer": "⑤",
    "solution": "1단계: $f(t)$의 부정적분을 $F(t)$라 하면 미분계수의 정의에 의해 극한은 $\\lim_{x\\to\\pi/2}\\frac{F(x)-F(\\pi/2)}{x-\\pi/2}=f(\\pi/2)$이다.\n2단계: $f(\\pi/2)=\\int_0^{\\pi/2}(2t+1)\\cos t\\,dt$를 부분적분법으로 계산한다.\n3단계: $u=2t+1$, $v'=\\cos t$로 두면 $u'=2$, $v=\\sin t$이다.\n4단계: $\\int u v'\\,dt=uv-\\int u'v\\,dt$이므로 $[(2t+1)\\sin t]_0^{\\pi/2}-\\int_0^{\\pi/2}2\\sin t\\,dt$이다.\n5단계: 첫째 항은 $(\\pi+1)\\sin(\\pi/2)-1\\cdot\\sin0=\\pi+1$이다.\n6단계: 둘째 항은 $[-2\\cos t]_0^{\\pi/2}=-2\\cos(\\pi/2)+2\\cos0=0+2=2$이다.\n7단계: 따라서 $f(\\pi/2)=(\\pi+1)-2=\\pi-1$이다.\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-187",
    "problemTypeKey": "PT_DEFINITE_INTEGRAL_FUNCTION_RELATION",
    "templateKey": "TPL_INTEGRAL_DEFINED_FUNCTION_DIFFERENTIATION",
    "crossConceptKeys": [
      "CC_DERIVATIVE_DEFINITION_LIMIT",
      "CC_INTEGRATION_BY_PARTS_OR_EXPANSION"
    ],
    "conditionKeys": [],
    "integrationPattern": "DEEP_COMPOSITE"
  },
  {
    "id": 6,
    "category": "여러 가지 적분법",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-07",
    "standardUnit": "여러 가지 적분법",
    "standardUnitOrder": 7,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "여러 가지 적분법"
    ],
    "wide": false,
    "content": "$\\lim_{x \\to 0} \\frac{1}{x} \\int_0^x \\frac{2\\cos t}{3 + \\sin t} \\, dt$의 값을 $k$라고 할 때, $\\tan\\theta = k$인 예각 $\\theta$에 대하여 $\\tan\\left(\\theta + \\frac{\\pi}{4}\\right)$의 값은?",
    "choices": [
      "1",
      "2",
      "3",
      "4",
      "5"
    ],
    "answer": "⑤",
    "solution": "1단계: $g(t)=\\frac{2\\cos t}{3+\\sin t}$의 부정적분을 $G(t)$라 하면 $\\lim_{x\\to0}\\frac1x\\int_0^x g(t)\\,dt=\\lim_{x\\to0}\\frac{G(x)-G(0)}{x}=G'(0)=g(0)$이다.\n2단계: $k=g(0)=\\frac{2\\cos0}{3+\\sin0}=\\frac{2\\cdot1}{3+0}=\\frac23$이다.\n3단계: $\\tan\\theta=\\frac23$이고 $\\tan\\frac{\\pi}{4}=1$이다.\n4단계: 탄젠트의 덧셈정리에 의해 $\\tan\\left(\\theta+\\frac{\\pi}{4}\\right)=\\frac{\\tan\\theta+1}{1-\\tan\\theta}$이다.\n5단계: $\\frac{\\frac23+1}{1-\\frac23}=\\frac{\\frac53}{\\frac13}=5$이다.\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-187",
    "problemTypeKey": "PT_DEFINITE_INTEGRAL_FUNCTION_RELATION",
    "templateKey": "TPL_INTEGRAL_DEFINED_FUNCTION_DIFFERENTIATION",
    "crossConceptKeys": [
      "CC_DERIVATIVE_DEFINITION_LIMIT",
      "CC_TRIGONOMETRIC_IDENTITY"
    ],
    "conditionKeys": [
      "COND_RANGE"
    ],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 7,
    "category": "여러 가지 적분법",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-07",
    "standardUnit": "여러 가지 적분법",
    "standardUnitOrder": 7,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "여러 가지 적분법"
    ],
    "wide": false,
    "content": "양의 상수 $a$와 함수 $f(x) = a\\cos\\left(\\frac{\\pi}{3}x\\right)$에 대하여\n$$\\lim_{h \\to 0} \\frac{\\ln(1+2h)}{h^2} \\int_1^{1+h} f(t) \\, dt = 1$$\n일 때, $f(a)$의 값은?",
    "choices": [
      "$\\frac{1}{2}$",
      "1",
      "$\\frac{3}{2}$",
      "2",
      "$\\frac{5}{2}$"
    ],
    "answer": "①",
    "solution": "1단계: 극한을 두 부분의 곱으로 나눈다. $\\frac{\\ln(1+2h)}{h^2}\\int_1^{1+h}f(t)\\,dt=\\frac{\\ln(1+2h)}{h}\\cdot\\frac1h\\int_1^{1+h}f(t)\\,dt$\n2단계: 로그함수의 극한 $\\lim_{u\\to0}\\frac{\\ln(1+u)}{u}=1$을 쓰면 $\\lim_{h\\to0}\\frac{\\ln(1+2h)}{h}=2\\cdot1=2$이다.\n3단계: 미적분학의 기본정리에 의해 $\\lim_{h\\to0}\\frac1h\\int_1^{1+h}f(t)\\,dt=f(1)$이다.\n4단계: 따라서 극한값은 $2f(1)=1$이므로 $f(1)=\\frac12$이다.\n5단계: $f(1)=a\\cos\\frac{\\pi}{3}=a\\cdot\\frac12=\\frac12$이므로 $a=1$이다.\n6단계: $f(a)=f(1)=1\\cdot\\cos\\frac{\\pi}{3}=\\frac12$이다.\n따라서 정답은 ①이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-187",
    "problemTypeKey": "PT_DEFINITE_INTEGRAL_FUNCTION_RELATION",
    "templateKey": "TPL_INTEGRAL_DEFINED_FUNCTION_DIFFERENTIATION",
    "crossConceptKeys": [
      "CC_DERIVATIVE_DEFINITION_LIMIT"
    ],
    "conditionKeys": [
      "COND_POSITIVE"
    ],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 8,
    "category": "여러 가지 적분법",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-07",
    "standardUnit": "여러 가지 적분법",
    "standardUnitOrder": 7,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "여러 가지 적분법"
    ],
    "wide": false,
    "content": "$\\lim_{x \\to 0} \\frac{1}{x} \\int_0^x \\frac{e^{3t}\\cos 2t}{1 + e^{2t} + 3\\sin t} \\, dt$의 값은?",
    "choices": [
      "$\\frac{1}{4}$",
      "$\\frac{1}{2}$",
      "$\\frac{3}{4}$",
      "1",
      "$\\frac{5}{4}$"
    ],
    "answer": "②",
    "solution": "1단계: $g(t)=\\frac{e^{3t}\\cos2t}{1+e^{2t}+3\\sin t}$의 부정적분을 $G(t)$라 하면 $\\lim_{x\\to0}\\frac1x\\int_0^x g(t)\\,dt=G'(0)=g(0)$이다.\n2단계: $t=0$에서 분모는 $1+e^0+3\\sin0=2\\neq0$이므로 $g$는 $t=0$ 근방에서 연속이다.\n3단계: 따라서 극한값은 $g(0)=\\frac{e^0\\cos0}{1+e^0+3\\sin0}$이다.\n4단계: $e^0=1$, $\\cos0=1$, $\\sin0=0$을 대입하면 $\\frac{1\\cdot1}{1+1+0}$이다.\n5단계: 계산하면 $\\frac12$이다.\n따라서 정답은 ②이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-187",
    "problemTypeKey": "PT_DEFINITE_INTEGRAL_FUNCTION_RELATION",
    "templateKey": "TPL_INTEGRAL_DEFINED_FUNCTION_DIFFERENTIATION",
    "crossConceptKeys": [
      "CC_DERIVATIVE_DEFINITION_LIMIT"
    ],
    "conditionKeys": [],
    "integrationPattern": "NONE"
  }
];
