window.examTitle = "미적분II_251_적분구간이상수인정적분을포함한등식에서함_고2_유형은행1";

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
    "content": "함수 $f(x)$가\n$$f(x) = 2e^{-x} - \\int_0^1 e^t f(t)\\,dt$$\n를 만족시킬 때, $f(-1)$의 값은?",
    "choices": [
      "$e - \\dfrac{2}{e}$",
      "$2e - \\dfrac{2}{e}$",
      "$2e - \\dfrac{1}{e}$",
      "$2e + \\dfrac{1}{e}$",
      "$2e + \\dfrac{2}{e}$"
    ],
    "answer": "②",
    "solution": "적분구간이 상수이므로 $A=\\int_0^1 e^t f(t)\\,dt$로 놓는다.\n주어진 식은 $f(x)=2e^{-x}-A$로 쓸 수 있다.\n$A$의 정의에 $f(t)$를 대입하면 $A=\\int_0^1 e^t(2e^{-t}-A)\\,dt$이다.\n지수법칙으로 피적분함수를 정리하면 $e^t\\cdot2e^{-t}=2$, $e^t\\cdot A=Ae^t$이므로 $A=\\int_0^1(2-Ae^t)\\,dt$이다.\n지수함수의 정적분으로 계산하면 $A=\\left[2t-Ae^t\\right]_0^1=(2-Ae)-(0-A)=2-Ae+A$이다.\n$A$에 대해 정리하면 $A-A+Ae=2$, 즉 $Ae=2$이므로 $A=\\dfrac{2}{e}$이다.\n따라서 $f(x)=2e^{-x}-\\dfrac{2}{e}$이고 $f(-1)=2e^{-(-1)}-\\dfrac{2}{e}=2e-\\dfrac{2}{e}$이다.\n주의: 정적분 $\\int_0^1 e^t f(t)\\,dt$는 $x$에 대한 함수가 아니라 상수이다.\n따라서 정답은 ②이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-182",
    "problemTypeKey": "PT_DEFINITE_INTEGRAL_FUNCTION_RELATION",
    "templateKey": "TPL_INTEGRAL_VALUE_SYSTEM_FUNCTION_DETERMINATION",
    "crossConceptKeys": [
      "CC_DEFINITE_INTEGRAL"
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
    "content": "함수 $f(x)$에 대하여\n$$f(x) = \\sin \\pi x + \\int_0^{\\frac{1}{2}} f(t)\\,dt$$\n를 만족시킬 때, $f\\left(\\dfrac{1}{2}\\right)$의 값은?",
    "choices": [
      "$-1 + \\dfrac{2}{\\pi}$",
      "$\\dfrac{2}{\\pi}$",
      "$1 + \\dfrac{2}{\\pi}$",
      "$1 + \\dfrac{4}{\\pi}$",
      "$2 + \\dfrac{2}{\\pi}$"
    ],
    "answer": "③",
    "solution": "적분구간이 상수이므로 $A=\\int_0^{\\frac{1}{2}} f(t)\\,dt$로 놓는다.\n주어진 식은 $f(x)=\\sin\\pi x+A$이다.\n$A$의 정의에 $f(t)$를 대입하면 $A=\\int_0^{\\frac{1}{2}}(\\sin\\pi t+A)\\,dt$이다.\n삼각함수의 부정적분을 이용하면 $A=\\left[-\\dfrac{1}{\\pi}\\cos\\pi t+At\\right]_0^{\\frac{1}{2}}$이다.\n위끝과 아래끝을 대입하면 $A=\\left(0+\\dfrac{A}{2}\\right)-\\left(-\\dfrac{1}{\\pi}+0\\right)=\\dfrac{A}{2}+\\dfrac{1}{\\pi}$이다.\n$A$에 대해 정리하면 $A-\\dfrac{A}{2}=\\dfrac{1}{\\pi}$, 즉 $\\dfrac{A}{2}=\\dfrac{1}{\\pi}$이므로 $A=\\dfrac{2}{\\pi}$이다.\n따라서 $f(x)=\\sin\\pi x+\\dfrac{2}{\\pi}$이고 $f\\left(\\dfrac{1}{2}\\right)=1+\\dfrac{2}{\\pi}$이다.\n따라서 정답은 ③이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-182",
    "problemTypeKey": "PT_DEFINITE_INTEGRAL_FUNCTION_RELATION",
    "templateKey": "TPL_INTEGRAL_VALUE_SYSTEM_FUNCTION_DETERMINATION",
    "crossConceptKeys": [
      "CC_DEFINITE_INTEGRAL",
      "CC_SPECIAL_ANGLES"
    ],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
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
    "content": "함수 $f(x)$가\n$$f(x) = 3x - 2\\int_1^e \\dfrac{f(t)}{t}\\,dt$$\n를 만족시킬 때, $f(e)$의 값은?",
    "choices": [
      "$e - 2$",
      "$e - 1$",
      "$e$",
      "$e + 1$",
      "$e + 2$"
    ],
    "answer": "⑤",
    "solution": "적분구간이 상수이므로 $A=\\int_1^e\\dfrac{f(t)}{t}\\,dt$로 놓는다.\n주어진 식은 $f(x)=3x-2A$이다.\n$A$의 정의에 $f(t)$를 대입하면 $A=\\int_1^e\\dfrac{3t-2A}{t}\\,dt=\\int_1^e\\left(3-\\dfrac{2A}{t}\\right)dt$이다.\n유리함수의 정적분으로 계산하면 $A=\\left[3t-2A\\ln t\\right]_1^e$이다.\n위끝과 아래끝을 대입하면 $A=(3e-2A)-(3-0)=3e-3-2A$이다.\n$A$에 대해 정리하면 $3A=3e-3$, 즉 $A=e-1$이다.\n따라서 $f(x)=3x-2(e-1)=3x-2e+2$이고 $f(e)=3e-2e+2=e+2$이다.\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-182",
    "problemTypeKey": "PT_DEFINITE_INTEGRAL_FUNCTION_RELATION",
    "templateKey": "TPL_INTEGRAL_VALUE_SYSTEM_FUNCTION_DETERMINATION",
    "crossConceptKeys": [
      "CC_DEFINITE_INTEGRAL"
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
    "content": "함수 $f(x)$가\n$$f(x) = \\dfrac{2x}{x^2+1} + 2\\int_0^1 f(t)\\,dt$$\n를 만족시킬 때, $f(0)$의 값은?",
    "choices": [
      "$-4\\ln 2$",
      "$-3\\ln 2$",
      "$-2\\ln 2$",
      "$-\\ln 2$",
      "$0$"
    ],
    "answer": "③",
    "solution": "적분구간이 상수이므로 $A=\\int_0^1 f(t)\\,dt$로 놓는다.\n주어진 식은 $f(x)=\\dfrac{2x}{x^2+1}+2A$이다.\n$A$의 정의에 $f(t)$를 대입하면 $A=\\int_0^1\\left(\\dfrac{2t}{t^2+1}+2A\\right)dt$이다.\n치환적분법에서 $u=t^2+1$로 놓으면 $du=2t\\,dt$이고 $t:0\\to1$일 때 $u:1\\to2$이다.\n따라서 $\\int_0^1\\dfrac{2t}{t^2+1}\\,dt=\\int_1^2\\dfrac{1}{u}\\,du=\\left[\\ln|u|\\right]_1^2=\\ln2$이다.\n나머지 항을 계산하면 $A=\\ln2+\\left[2At\\right]_0^1=\\ln2+2A$이다.\n$A$에 대해 정리하면 $A-2A=\\ln2$, 즉 $A=-\\ln2$이다.\n따라서 $f(x)=\\dfrac{2x}{x^2+1}-2\\ln2$이고 $f(0)=0-2\\ln2=-2\\ln2$이다.\n따라서 정답은 ③이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-182",
    "problemTypeKey": "PT_DEFINITE_INTEGRAL_FUNCTION_RELATION",
    "templateKey": "TPL_INTEGRAL_VALUE_SYSTEM_FUNCTION_DETERMINATION",
    "crossConceptKeys": [
      "CC_DEFINITE_INTEGRAL",
      "CC_RATIONAL_FUNCTION"
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
    "content": "함수 $f(x)$가\n$$f(x) = (\\pi - x)\\sin x + 2\\int_0^{\\frac{\\pi}{2}} f(t)\\,dt$$\n를 만족시킬 때, $f(0)$의 값은?",
    "choices": [
      "$-4$",
      "$-3$",
      "$-2$",
      "$-1$",
      "$0$"
    ],
    "answer": "③",
    "solution": "적분구간이 상수이므로 $A=\\int_0^{\\frac{\\pi}{2}} f(t)\\,dt$로 놓는다.\n주어진 식은 $f(x)=(\\pi-x)\\sin x+2A$이다.\n$A$의 정의에 $f(t)$를 대입하면 $A=\\int_0^{\\frac{\\pi}{2}}\\{(\\pi-t)\\sin t+2A\\}\\,dt$이다.\n부분적분법에서 $u=\\pi-t$, $v'=\\sin t$로 놓으면 $u'=-1$, $v=-\\cos t$이므로 $\\int(\\pi-t)\\sin t\\,dt=-(\\pi-t)\\cos t-\\sin t$이다.\n따라서 $\\int_0^{\\frac{\\pi}{2}}(\\pi-t)\\sin t\\,dt=\\left[-(\\pi-t)\\cos t-\\sin t\\right]_0^{\\frac{\\pi}{2}}$이다.\n위끝과 아래끝을 대입하면 이 값은 $(-1)-(-\\pi)=\\pi-1$이다.\n상수항의 정적분은 $\\int_0^{\\frac{\\pi}{2}}2A\\,dt=2A\\cdot\\dfrac{\\pi}{2}=\\pi A$이다.\n따라서 $A=\\pi-1+\\pi A$이고 $A(1-\\pi)=\\pi-1$이므로 $A=-1$이다.\n그러면 $f(x)=(\\pi-x)\\sin x-2$이고 $f(0)=0-2=-2$이다.\n주의: 부분적분에서 $-(\\pi-t)\\cos t$의 부호를 놓치지 않는다.\n따라서 정답은 ③이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-182",
    "problemTypeKey": "PT_DEFINITE_INTEGRAL_FUNCTION_RELATION",
    "templateKey": "TPL_INTEGRAL_VALUE_SYSTEM_FUNCTION_DETERMINATION",
    "crossConceptKeys": [
      "CC_DEFINITE_INTEGRAL",
      "CC_INTEGRATION_BY_PARTS_OR_EXPANSION"
    ],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
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
    "content": "함수 $f(x)$가\n$$f(x) = 2\\sin x + 3\\int_0^{\\frac{\\pi}{2}} f(t)\\cos t\\,dt$$\n를 만족시킬 때, $f\\left(\\dfrac{\\pi}{2}\\right)$의 값은?",
    "choices": [
      "$-\\dfrac{3}{2}$",
      "$-1$",
      "$-\\dfrac{1}{2}$",
      "$0$",
      "$\\dfrac{1}{2}$"
    ],
    "answer": "⑤",
    "solution": "적분구간이 상수이므로 $A=\\int_0^{\\frac{\\pi}{2}} f(t)\\cos t\\,dt$로 놓는다.\n주어진 식은 $f(x)=2\\sin x+3A$이다.\n$A$의 정의에 $f(t)$를 대입하면 $A=\\int_0^{\\frac{\\pi}{2}}(2\\sin t+3A)\\cos t\\,dt$이다.\n치환적분법에서 $u=\\sin t$로 놓으면 $du=\\cos t\\,dt$이고 $t:0\\to\\dfrac{\\pi}{2}$일 때 $u:0\\to1$이다.\n따라서 $\\int_0^{\\frac{\\pi}{2}}\\sin t\\cos t\\,dt=\\int_0^1u\\,du=\\left[\\dfrac{u^2}{2}\\right]_0^1=\\dfrac{1}{2}$이다.\n또 $\\int_0^{\\frac{\\pi}{2}}\\cos t\\,dt=\\left[\\sin t\\right]_0^{\\frac{\\pi}{2}}=1$이다.\n이를 대입하면 $A=2\\cdot\\dfrac{1}{2}+3A\\cdot1=1+3A$이다.\n$A$에 대해 정리하면 $-2A=1$이므로 $A=-\\dfrac{1}{2}$이다.\n따라서 $f(x)=2\\sin x-\\dfrac{3}{2}$이고 $f\\left(\\dfrac{\\pi}{2}\\right)=2-\\dfrac{3}{2}=\\dfrac{1}{2}$이다.\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-182",
    "problemTypeKey": "PT_DEFINITE_INTEGRAL_FUNCTION_RELATION",
    "templateKey": "TPL_INTEGRAL_VALUE_SYSTEM_FUNCTION_DETERMINATION",
    "crossConceptKeys": [
      "CC_DEFINITE_INTEGRAL",
      "CC_TRIGONOMETRIC_IDENTITY"
    ],
    "conditionKeys": [],
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
    "content": "함수 $f(x)$가\n$$f(x) = x - 1 + \\int_0^1 e^{-t} f(t)\\,dt$$\n를 만족시킬 때, $f(3)$의 값은?",
    "choices": [
      "$1$",
      "$2$",
      "$e$",
      "$3$",
      "$2e$"
    ],
    "answer": "①",
    "solution": "적분구간이 상수이므로 $A=\\int_0^1 e^{-t}f(t)\\,dt$로 놓는다.\n주어진 식은 $f(x)=x-1+A$이다.\n$A$의 정의에 $f(t)$를 대입하면 $A=\\int_0^1 e^{-t}(t-1+A)\\,dt$이다.\n이를 나누면 $A=\\int_0^1(t-1)e^{-t}\\,dt+A\\int_0^1e^{-t}\\,dt$이다.\n부분적분법으로 $\\int(t-1)e^{-t}\\,dt=-te^{-t}$이므로 $\\int_0^1(t-1)e^{-t}\\,dt=\\left[-te^{-t}\\right]_0^1=-\\dfrac{1}{e}$이다.\n지수함수의 정적분은 $\\int_0^1e^{-t}\\,dt=\\left[-e^{-t}\\right]_0^1=1-\\dfrac{1}{e}$이다.\n따라서 $A=-\\dfrac{1}{e}+A\\left(1-\\dfrac{1}{e}\\right)$이다.\n양변을 정리하면 $A-A+\\dfrac{A}{e}=-\\dfrac{1}{e}$이므로 $\\dfrac{A}{e}=-\\dfrac{1}{e}$, 즉 $A=-1$이다.\n따라서 $f(x)=x-2$이고 $f(3)=1$이다.\n따라서 정답은 ①이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-182",
    "problemTypeKey": "PT_DEFINITE_INTEGRAL_FUNCTION_RELATION",
    "templateKey": "TPL_INTEGRAL_VALUE_SYSTEM_FUNCTION_DETERMINATION",
    "crossConceptKeys": [
      "CC_DEFINITE_INTEGRAL",
      "CC_INTEGRATION_BY_PARTS_OR_EXPANSION"
    ],
    "conditionKeys": [],
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
    "content": "연속함수 $f(x)$가\n$$f(x) = \\ln x - \\int_1^e f(t)\\,dt \\quad (x > 0)$$\n를 만족시킬 때, $f(e^2)$의 값은?",
    "choices": [
      "$-\\dfrac{1}{e}$",
      "$\\dfrac{e-2}{e}$",
      "$\\dfrac{e-1}{e}$",
      "$\\dfrac{2e-1}{e}$",
      "$\\dfrac{3e-1}{e}$"
    ],
    "answer": "④",
    "solution": "적분구간이 상수이므로 $A=\\int_1^e f(t)\\,dt$로 놓는다.\n주어진 식은 $f(x)=\\ln x-A$이다.\n$A$의 정의에 $f(t)$를 대입하면 $A=\\int_1^e(\\ln t-A)\\,dt$이다.\n부분적분법으로 $\\int\\ln t\\,dt=t\\ln t-t$이므로 $\\int_1^e\\ln t\\,dt=\\left[t\\ln t-t\\right]_1^e=(e-e)-(0-1)=1$이다.\n상수항의 정적분은 $\\int_1^e A\\,dt=A(e-1)$이다.\n따라서 $A=1-A(e-1)$이고 $A+A(e-1)=1$이므로 $Ae=1$, 즉 $A=\\dfrac{1}{e}$이다.\n그러면 $f(x)=\\ln x-\\dfrac{1}{e}$이다.\n$f(e^2)=2-\\dfrac{1}{e}=\\dfrac{2e-1}{e}$이다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-182",
    "problemTypeKey": "PT_DEFINITE_INTEGRAL_FUNCTION_RELATION",
    "templateKey": "TPL_INTEGRAL_VALUE_SYSTEM_FUNCTION_DETERMINATION",
    "crossConceptKeys": [
      "CC_DEFINITE_INTEGRAL",
      "CC_INTEGRATION_BY_PARTS_OR_EXPANSION"
    ],
    "conditionKeys": [
      "COND_POSITIVE"
    ],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 9,
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
    "content": "함수 $f(x)$가\n$$f(x) = x\\ln x - \\int_1^e f(t)\\,dt \\quad (x > 0)$$\n를 만족시킬 때, $\\int_1^e f(t)\\,dt$의 값은?",
    "choices": [
      "$-\\dfrac{e^2+1}{4e}$",
      "$-\\dfrac{e^2-1}{4e}$",
      "$\\dfrac{e^2-1}{4e}$",
      "$\\dfrac{e^2}{4e}$",
      "$\\dfrac{e^2+1}{4e}$"
    ],
    "answer": "⑤",
    "solution": "적분구간이 상수이므로 $A=\\int_1^e f(t)\\,dt$로 놓는다.\n주어진 식은 $f(x)=x\\ln x-A$이다.\n$A$의 정의에 $f(t)$를 대입하면 $A=\\int_1^e(t\\ln t-A)\\,dt$이다.\n부분적분법에서 $u=\\ln t$, $v'=t$로 놓으면 $u'=\\dfrac{1}{t}$, $v=\\dfrac{t^2}{2}$이므로 $\\int t\\ln t\\,dt=\\dfrac{t^2}{2}\\ln t-\\dfrac{t^2}{4}$이다.\n따라서 $\\int_1^e t\\ln t\\,dt=\\left[\\dfrac{t^2}{2}\\ln t-\\dfrac{t^2}{4}\\right]_1^e=\\dfrac{e^2}{4}-\\left(-\\dfrac{1}{4}\\right)=\\dfrac{e^2+1}{4}$이다.\n상수항의 정적분은 $\\int_1^e A\\,dt=A(e-1)$이다.\n따라서 $A=\\dfrac{e^2+1}{4}-A(e-1)$이고 $A+A(e-1)=\\dfrac{e^2+1}{4}$이므로 $Ae=\\dfrac{e^2+1}{4}$이다.\n즉 $A=\\dfrac{e^2+1}{4e}$이다.\n문제에서 구하는 값이 바로 $A$이므로 $\\int_1^e f(t)\\,dt=\\dfrac{e^2+1}{4e}$이다.\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-182",
    "problemTypeKey": "PT_DEFINITE_INTEGRAL_FUNCTION_RELATION",
    "templateKey": "TPL_INTEGRAL_VALUE_SYSTEM_FUNCTION_DETERMINATION",
    "crossConceptKeys": [
      "CC_DEFINITE_INTEGRAL",
      "CC_INTEGRATION_BY_PARTS_OR_EXPANSION"
    ],
    "conditionKeys": [
      "COND_POSITIVE"
    ],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 10,
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
    "content": "구간 $(0, \\infty)$에서 연속인 함수 $f(x)$가\n$$f(x) = \\ln x - 2\\int_1^e \\dfrac{f(t)}{t}\\,dt$$\n를 만족시킬 때, $f(1)$의 값은?",
    "choices": [
      "$-\\dfrac{2}{3}$",
      "$-\\dfrac{1}{3}$",
      "$0$",
      "$\\dfrac{1}{3}$",
      "$\\dfrac{2}{3}$"
    ],
    "answer": "②",
    "solution": "적분구간이 상수이므로 $A=\\int_1^e\\dfrac{f(t)}{t}\\,dt$로 놓는다.\n주어진 식은 $f(x)=\\ln x-2A$이다.\n$A$의 정의에 $f(t)$를 대입하면 $A=\\int_1^e\\dfrac{\\ln t-2A}{t}\\,dt$이다.\n치환적분법에서 $u=\\ln t$로 놓으면 $du=\\dfrac{1}{t}\\,dt$이고 $t:1\\to e$일 때 $u:0\\to1$이다.\n따라서 $\\int_1^e\\dfrac{\\ln t}{t}\\,dt=\\int_0^1u\\,du=\\dfrac{1}{2}$이다.\n또 $\\int_1^e\\dfrac{2A}{t}\\,dt=2A\\left[\\ln t\\right]_1^e=2A$이다.\n그러므로 $A=\\dfrac{1}{2}-2A$이고 $3A=\\dfrac{1}{2}$에서 $A=\\dfrac{1}{6}$이다.\n따라서 $f(x)=\\ln x-\\dfrac{1}{3}$이고 $f(1)=0-\\dfrac{1}{3}=-\\dfrac{1}{3}$이다.\n따라서 정답은 ②이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-182",
    "problemTypeKey": "PT_DEFINITE_INTEGRAL_FUNCTION_RELATION",
    "templateKey": "TPL_INTEGRAL_VALUE_SYSTEM_FUNCTION_DETERMINATION",
    "crossConceptKeys": [
      "CC_DEFINITE_INTEGRAL"
    ],
    "conditionKeys": [
      "COND_POSITIVE"
    ],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 11,
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
    "content": "연속함수 $f(x)$가\n$$f(x) = e^x - 2\\int_0^1 t f(t)\\,dt$$\n를 만족시킬 때, $\\int_0^1 f(x)\\,dx$의 값은?",
    "choices": [
      "$e - 2$",
      "$\\dfrac{e-1}{2}$",
      "$\\dfrac{e}{2}$",
      "$e - 1$",
      "$\\dfrac{e+1}{2}$"
    ],
    "answer": "①",
    "solution": "적분구간이 상수이므로 $A=\\int_0^1 t f(t)\\,dt$로 놓는다.\n주어진 식은 $f(x)=e^x-2A$이다.\n$A$의 정의에 $f(t)$를 대입하면 $A=\\int_0^1 t(e^t-2A)\\,dt$이다.\n이를 나누면 $A=\\int_0^1te^t\\,dt-2A\\int_0^1t\\,dt$이다.\n부분적분법에서 $u=t$, $v'=e^t$로 놓으면 $\\int te^t\\,dt=te^t-e^t$이므로 $\\int_0^1te^t\\,dt=\\left[te^t-e^t\\right]_0^1=(e-e)-(0-1)=1$이다.\n또 $\\int_0^1t\\,dt=\\dfrac{1}{2}$이다.\n따라서 $A=1-2A\\cdot\\dfrac{1}{2}=1-A$이고 $2A=1$, 즉 $A=\\dfrac{1}{2}$이다.\n그러면 $f(x)=e^x-1$이다.\n구하는 정적분은 $\\int_0^1(e^x-1)\\,dx=\\left[e^x-x\\right]_0^1=(e-1)-1=e-2$이다.\n따라서 정답은 ①이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-182",
    "problemTypeKey": "PT_DEFINITE_INTEGRAL_FUNCTION_RELATION",
    "templateKey": "TPL_INTEGRAL_VALUE_SYSTEM_FUNCTION_DETERMINATION",
    "crossConceptKeys": [
      "CC_DEFINITE_INTEGRAL",
      "CC_INTEGRATION_BY_PARTS_OR_EXPANSION"
    ],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
  }
];
