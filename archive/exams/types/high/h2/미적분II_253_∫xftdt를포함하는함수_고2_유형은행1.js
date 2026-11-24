window.examTitle = "미적분II_253_∫xftdt를포함하는함수_고2_유형은행1";

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
    "content": "미분가능한 함수 $f(x)$가 모든 실수 $x$에 대하여\n$$\\int_0^x (x-t) f(t) \\, dt = e^{2x} - ax - b$$\n를 만족시킬 때, 상수 $a, b$에 대하여 $f(0) + a + b$의 값은?",
    "choices": [
      "4",
      "5",
      "6",
      "7",
      "8"
    ],
    "answer": "④",
    "solution": "[좌변 전개] 정적분의 성질로 피적분함수를 나누면\n$x\\int_0^x f(t)\\,dt-\\int_0^x t f(t)\\,dt=e^{2x}-ax-b$\n[$b$ 결정] $x=0$을 대입하면 $0=e^{0}-a\\cdot0-b=1-b$이므로 $b=1$\n[1차 미분] 양변을 $x$에 대하여 미분하면 (곱의 미분법)\n$\\int_0^x f(t)\\,dt+xf(x)-xf(x)=2e^{2x}-a \\;\\Rightarrow\\; \\int_0^x f(t)\\,dt=2e^{2x}-a$\n[$a$ 결정] 위 식에 $x=0$을 대입하면 $0=2e^{0}-a=2-a$이므로 $a=2$\n[2차 미분] $\\int_0^x f(t)\\,dt=2e^{2x}-2$의 양변을 다시 미분하면 $f(x)=4e^{2x}$\n[$f(0)$ 계산] $f(0)=4e^{0}=4$\n[최종 계산] $f(0)+a+b=4+2+1=7$\n주의: 적분 상한의 $x$와 피적분함수 안의 $x$를 모두 미분해야 하므로 곱의 미분법을 빠뜨리면 안 된다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-184",
    "problemTypeKey": "PT_DEFINITE_INTEGRAL_FUNCTION_RELATION",
    "templateKey": "TPL_INTEGRAL_DEFINED_FUNCTION_DIFFERENTIATION",
    "crossConceptKeys": [
      "CC_FUNDAMENTAL_THEOREM_OF_CALCULUS_LEIBNIZ",
      "CC_INTEGRAL_BOUNDARY_ROOT_EVALUATION",
      "CC_DERIVATIVE_VALUE_EVALUATION"
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
    "content": "함수 $f(x)$가 $x > 0$인 모든 실수 $x$에 대하여\n$$\\int_1^x (x-t) f(t) \\, dt = 2x^2 \\ln x + ax + b$$\n를 만족시킬 때, $f(2)$의 값은? (단, $a, b$는 상수이다.)",
    "choices": [
      "$4\\ln 2 + 2$",
      "$4\\ln 2 + 3$",
      "$4\\ln 2 + 4$",
      "$4\\ln 2 + 5$",
      "$4\\ln 2 + 6$"
    ],
    "answer": "⑤",
    "solution": "[좌변 전개] 정적분의 성질로 나누면\n$x\\int_1^x f(t)\\,dt-\\int_1^x t f(t)\\,dt=2x^2\\ln x+ax+b$\n[관계식] $x=1$을 대입하면 $0=2\\ln1+a+b=a+b$이므로 $b=-a$\n[1차 미분] 양변을 미분하면 (곱의 미분법)\n$\\int_1^x f(t)\\,dt+xf(x)-xf(x)=4x\\ln x+2x^2\\cdot\\frac{1}{x}+a$\n$\\Rightarrow\\; \\int_1^x f(t)\\,dt=4x\\ln x+2x+a$\n[$a$ 결정] $x=1$을 대입하면 $0=4\\ln1+2+a=2+a$이므로 $a=-2$, 따라서 $b=2$\n[2차 미분] $\\int_1^x f(t)\\,dt=4x\\ln x+2x-2$를 미분하면 (곱의 미분법)\n$f(x)=4\\ln x+4x\\cdot\\frac{1}{x}+2=4\\ln x+6$\n[$f(2)$ 계산] $f(2)=4\\ln2+6$\n주의: $\\int_1^2 f(t)\\,dt$가 아니라 $f(2)$를 묻는 것이므로 한 번 더 미분하여 $f(x)$를 구해야 한다.\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-184",
    "problemTypeKey": "PT_DEFINITE_INTEGRAL_FUNCTION_RELATION",
    "templateKey": "TPL_INTEGRAL_DEFINED_FUNCTION_DIFFERENTIATION",
    "crossConceptKeys": [
      "CC_FUNDAMENTAL_THEOREM_OF_CALCULUS_LEIBNIZ"
    ],
    "conditionKeys": [
      "COND_POSITIVE"
    ],
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
    "content": "연속함수 $f(x)$가 모든 실수 $x$에 대하여\n$$f(x) = (2x-1)e^x + 1 + \\int_0^x (x-t) f'(t) \\, dt$$\n를 만족시킬 때, $f'(1) - f(1)$의 값은?",
    "choices": [
      "$e$",
      "$2e$",
      "$3e$",
      "$4e$",
      "$5e$"
    ],
    "answer": "③",
    "solution": "[$f(0)$ 계산] 주어진 식에 $x=0$을 대입하면\n$f(0)=(2\\cdot0-1)e^{0}+1+0=0$\n[적분항 미분] $\\int_0^x(x-t)f'(t)\\,dt=x\\int_0^x f'(t)\\,dt-\\int_0^x t f'(t)\\,dt$이므로 미분하면 (곱의 미분법)\n$\\int_0^x f'(t)\\,dt+xf'(x)-xf'(x)=\\int_0^x f'(t)\\,dt$\n[미적분학의 기본정리] $\\int_0^x f'(t)\\,dt=f(x)-f(0)=f(x)$\n[양변 미분] 주어진 식의 양변을 미분하면 (곱의 미분법)\n$f'(x)=2e^{x}+(2x-1)e^{x}+f(x)=(2x+1)e^{x}+f(x)$\n[정리] $f(x)$를 좌변으로 이항하면\n$f'(x)-f(x)=(2x+1)e^{x}$\n[$x=1$ 대입] $f'(1)-f(1)=(2+1)e=3e$\n주의: $f(0)=0$이므로 적분항의 도함수가 $f(x)$가 되지만, $f(0)\\neq0$이면 $f(x)-f(0)$임을 놓치지 않아야 한다.\n따라서 정답은 ③이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-184",
    "problemTypeKey": "PT_DEFINITE_INTEGRAL_FUNCTION_RELATION",
    "templateKey": "TPL_INTEGRAL_DEFINED_FUNCTION_DIFFERENTIATION",
    "crossConceptKeys": [
      "CC_FUNDAMENTAL_THEOREM_OF_CALCULUS_LEIBNIZ",
      "CC_INTEGRAL_BOUNDARY_ROOT_EVALUATION",
      "CC_DERIVATIVE_VALUE_EVALUATION"
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
    "content": "모든 실수 $x$에 대하여 미분가능한 함수 $f(x)$가\n$$\\int_0^x f(t) \\, dt = x^2 + x + \\int_0^x (x-t) f(t) \\, dt$$\n를 만족시킬 때, $\\int_0^1 x f(x) \\, dx$의 값은?",
    "choices": [
      "1",
      "2",
      "3",
      "4",
      "5"
    ],
    "answer": "②",
    "solution": "[우변 전개] $\\int_0^x(x-t)f(t)\\,dt=x\\int_0^x f(t)\\,dt-\\int_0^x t f(t)\\,dt$이므로\n$\\int_0^x f(t)\\,dt=x^2+x+x\\int_0^x f(t)\\,dt-\\int_0^x t f(t)\\,dt$\n[1차 미분] 양변을 미분하면 (곱의 미분법)\n$f(x)=2x+1+\\int_0^x f(t)\\,dt+xf(x)-xf(x)$\n$\\Rightarrow\\; f(x)=2x+1+\\int_0^x f(t)\\,dt$\n[$f(0)$ 결정] $x=0$을 대입하면 $f(0)=1$\n[2차 미분] 양변을 다시 미분하면 $f'(x)=2+f(x)$, 즉 $f'(x)-f(x)=2$\n[미분방정식 풀이] 양변에 $e^{-x}$를 곱하면 $(e^{-x}f(x))'=2e^{-x}$이므로\n$e^{-x}f(x)=-2e^{-x}+C \\;\\Rightarrow\\; f(x)=Ce^{x}-2$\n[$C$ 결정] $f(0)=C-2=1$이므로 $C=3$, $f(x)=3e^{x}-2$\n[부분적분법] $\\int_0^1 xe^{x}\\,dx=[xe^{x}]_0^1-\\int_0^1 e^{x}\\,dx=e-(e-1)=1$\n[최종 계산] $\\int_0^1 xf(x)\\,dx=3\\int_0^1 xe^{x}\\,dx-2\\int_0^1 x\\,dx=3\\cdot1-2\\cdot\\frac{1}{2}=2$\n따라서 정답은 ②이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B45",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-184",
    "problemTypeKey": "PT_DEFINITE_INTEGRAL_FUNCTION_RELATION",
    "templateKey": "TPL_INTEGRAL_DEFINED_FUNCTION_DIFFERENTIATION",
    "crossConceptKeys": [
      "CC_FUNDAMENTAL_THEOREM_OF_CALCULUS_LEIBNIZ",
      "CC_INTEGRATION_BY_PARTS_OR_EXPANSION",
      "CC_DEFINITE_INTEGRAL"
    ],
    "conditionKeys": [],
    "integrationPattern": "DEEP_COMPOSITE"
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
    "content": "실수 전체의 집합에서 연속인 함수 $f(x)$가 모든 실수 $x$에 대하여\n$$\\sin 4x + \\int_0^x x f(t) \\, dt = ax + \\int_0^x t f(t) \\, dt$$\n를 만족시킬 때, $a + f\\left(\\frac{\\pi}{8}\\right)$의 값은? (단, $a$는 상수이다.)",
    "choices": [
      "12",
      "14",
      "16",
      "18",
      "20"
    ],
    "answer": "⑤",
    "solution": "[정리] $\\int_0^x xf(t)\\,dt=x\\int_0^x f(t)\\,dt$이므로 주어진 식을 이항하면\n$\\sin4x+x\\int_0^x f(t)\\,dt-\\int_0^x t f(t)\\,dt=ax$\n$\\Rightarrow\\; \\int_0^x(x-t)f(t)\\,dt=ax-\\sin4x$\n[1차 미분] 양변을 $x$에 대하여 미분하면 (곱의 미분법)\n$\\int_0^x f(t)\\,dt+xf(x)-xf(x)=a-4\\cos4x$\n$\\Rightarrow\\; \\int_0^x f(t)\\,dt=a-4\\cos4x$\n[$a$ 결정] $x=0$을 대입하면 $0=a-4\\cos0=a-4$이므로 $a=4$\n[2차 미분] $\\int_0^x f(t)\\,dt=4-4\\cos4x$를 미분하면\n$f(x)=-4\\cdot(-4\\sin4x)=16\\sin4x$\n[$f(\\pi/8)$ 계산] $f\\left(\\frac{\\pi}{8}\\right)=16\\sin\\left(4\\cdot\\frac{\\pi}{8}\\right)=16\\sin\\frac{\\pi}{2}=16$\n[최종 계산] $a+f\\left(\\frac{\\pi}{8}\\right)=4+16=20$\n주의: 상수 $a$는 $x=0$ 대입으로 먼저 결정해야 하고, $\\sin4x$를 미분할 때 계수 $4$를 빠뜨리면 안 된다.\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-184",
    "problemTypeKey": "PT_DEFINITE_INTEGRAL_FUNCTION_RELATION",
    "templateKey": "TPL_INTEGRAL_DEFINED_FUNCTION_DIFFERENTIATION",
    "crossConceptKeys": [
      "CC_FUNDAMENTAL_THEOREM_OF_CALCULUS_LEIBNIZ",
      "CC_INTEGRAL_BOUNDARY_ROOT_EVALUATION",
      "CC_SPECIAL_ANGLES"
    ],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
  }
];
