window.examTitle = "미적분II_252_적분구간이변수인정적분을포함한등식에서함_고2_유형은행1";

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
    "content": "양의 실수 전체의 집합에서 미분가능한 함수 $f(x)$가 모든 양수 $x$에 대하여\n$$x f'(x) = 4x + \\int_1^x f'(t) dt$$\n를 만족시킬 때, $f'(e)$의 값은?",
    "choices": [
      "$2$",
      "$4$",
      "$6$",
      "$8$",
      "$10$"
    ],
    "answer": "④",
    "solution": "[정적분으로 정의된 함수의 미분] 주어진 등식 $x f'(x) = 4x + \\int_1^x f'(t) dt$의 양변을 $x$에 대하여 미분하면 $f'(x) + x f''(x) = 4 + f'(x)$이다.\n[정리] 양변에서 $f'(x)$를 소거하면 $x f''(x) = 4$이고, $x > 0$이므로 $f''(x) = \\frac{4}{x}$이다.\n[부정적분] 양변을 $x$에 대하여 적분하면 $f'(x) = 4\\ln x + C$ ($C$는 적분상수)이다.\n[적분상수 결정] 원래 등식에 $x = 1$을 대입하면 $f'(1) = 4 + \\int_1^1 f'(t) dt = 4$이고, $f'(1) = 4\\ln 1 + C = C$이므로 $C = 4$이다.\n[도함수 완성] 따라서 $f'(x) = 4\\ln x + 4$이다.\n[구하는 값] $x = e$를 대입하면 $f'(e) = 4\\ln e + 4 = 4(1) + 4 = 8$이다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-183",
    "problemTypeKey": "PT_DEFINITE_INTEGRAL_FUNCTION_RELATION",
    "templateKey": "TPL_DIFFERENTIATE_INTEGRAL_RELATION",
    "crossConceptKeys": [
      "CC_FUNDAMENTAL_THEOREM_OF_CALCULUS_LEIBNIZ",
      "CC_DERIVATIVE_VALUE_EVALUATION"
    ],
    "conditionKeys": [
      "COND_POSITIVE"
    ],
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
    "content": "연속함수 $f(x)$가 모든 실수 $x$에 대하여\n$$\\int_0^x f(t) dt = e^{2x} + ax + a$$\n를 만족시킬 때, $f(\\ln 3)$의 값은? (단, $a$는 상수이다.)",
    "choices": [
      "$11$",
      "$13$",
      "$15$",
      "$17$",
      "$19$"
    ],
    "answer": "④",
    "solution": "[아래끝 대입] $\\int_0^x f(t) dt = e^{2x} + ax + a$에 $x = 0$을 대입하면 좌변은 $0$, 우변은 $1 + a$이므로 $0 = 1 + a$, 즉 $a = -1$이다.\n[등식 정리] $a = -1$을 대입하면 $\\int_0^x f(t) dt = e^{2x} - x - 1$이다.\n[정적분의 미분] 양변을 $x$에 대하여 미분하면 $f(x) = 2e^{2x} - 1$이다.\n[함숫값] $x = \\ln 3$을 대입하면 $f(\\ln 3) = 2e^{2\\ln 3} - 1 = 2 \\cdot 3^2 - 1 = 18 - 1 = 17$이다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-183",
    "problemTypeKey": "PT_DEFINITE_INTEGRAL_FUNCTION_RELATION",
    "templateKey": "TPL_DIFFERENTIATE_INTEGRAL_RELATION",
    "crossConceptKeys": [
      "CC_FUNDAMENTAL_THEOREM_OF_CALCULUS_LEIBNIZ",
      "CC_INTEGRAL_BOUNDARY_ROOT_EVALUATION"
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
    "content": "양의 실수 전체의 집합에서 연속인 함수 $f(x)$가 모든 양수 $x$에 대하여\n$$\\int_1^x f(t) dt = x \\ln x + 2x + k$$\n를 만족시킬 때, 상수 $k$에 대하여 $f(e^2) + k$의 값은?",
    "choices": [
      "$1$",
      "$2$",
      "$3$",
      "$4$",
      "$5$"
    ],
    "answer": "③",
    "solution": "[아래끝 대입] $x = 1$을 대입하면 좌변은 $0$, 우변은 $1 \\cdot \\ln 1 + 2 + k = 2 + k$이므로 $k = -2$이다.\n[등식 정리] $\\int_1^x f(t) dt = x\\ln x + 2x - 2$이다.\n[미분] 곱의 미분법으로 양변을 미분하면 $f(x) = \\left(\\ln x + x \\cdot \\frac{1}{x}\\right) + 2 = \\ln x + 3$이다.\n[함숫값] $f(e^2) = \\ln e^2 + 3 = 2 + 3 = 5$이다.\n[구하는 값] $f(e^2) + k = 5 - 2 = 3$이다.\n따라서 정답은 ③이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-183",
    "problemTypeKey": "PT_DEFINITE_INTEGRAL_FUNCTION_RELATION",
    "templateKey": "TPL_DIFFERENTIATE_INTEGRAL_RELATION",
    "crossConceptKeys": [
      "CC_FUNDAMENTAL_THEOREM_OF_CALCULUS_LEIBNIZ",
      "CC_INTEGRAL_BOUNDARY_ROOT_EVALUATION"
    ],
    "conditionKeys": [
      "COND_POSITIVE"
    ],
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
    "content": "연속함수 $f(x)$가 모든 실수 $x$에 대하여\n$$\\int_0^x f(t) dt = \\cos 4x + ax^2 + a$$\n를 만족시킬 때, $f\\left(\\dfrac{\\pi}{4}\\right)$의 값은? (단, $a$는 상수이다.)",
    "choices": [
      "$-\\pi$",
      "$-\\dfrac{\\pi}{2}$",
      "$0$",
      "$\\dfrac{\\pi}{2}$",
      "$\\pi$"
    ],
    "answer": "②",
    "solution": "[아래끝 대입] $x = 0$을 대입하면 $0 = \\cos 0 + a = 1 + a$이므로 $a = -1$이다.\n[등식 정리] $\\int_0^x f(t) dt = \\cos 4x - x^2 - 1$이다.\n[미분] 합성함수의 미분법으로 양변을 미분하면 $f(x) = -4\\sin 4x - 2x$이다.\n[함숫값] $f\\left(\\frac{\\pi}{4}\\right) = -4\\sin\\pi - 2 \\cdot \\frac{\\pi}{4} = -4(0) - \\frac{\\pi}{2} = -\\frac{\\pi}{2}$이다.\n따라서 정답은 ②이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-183",
    "problemTypeKey": "PT_DEFINITE_INTEGRAL_FUNCTION_RELATION",
    "templateKey": "TPL_DIFFERENTIATE_INTEGRAL_RELATION",
    "crossConceptKeys": [
      "CC_FUNDAMENTAL_THEOREM_OF_CALCULUS_LEIBNIZ",
      "CC_INTEGRAL_BOUNDARY_ROOT_EVALUATION",
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
    "content": "모든 실수 $x$에 대하여 미분가능한 함수 $f(x)$가\n$$x f(x) = x^2 \\cos x + \\int_0^x f(t) dt$$\n를 만족시킬 때, $f'(\\pi)$의 값은?",
    "choices": [
      "$-2$",
      "$-1$",
      "$0$",
      "$1$",
      "$2$"
    ],
    "answer": "①",
    "solution": "[미분] $x f(x) = x^2\\cos x + \\int_0^x f(t) dt$의 양변을 미분하면 곱의 미분법에 의해 $f(x) + x f'(x) = 2x\\cos x - x^2\\sin x + f(x)$이다.\n[정리] 양변에서 $f(x)$를 소거하면 $x f'(x) = x(2\\cos x - x\\sin x)$이므로 $f'(x) = 2\\cos x - x\\sin x$이다.\n[대입] $f'(\\pi) = 2\\cos\\pi - \\pi\\sin\\pi = 2(-1) - \\pi(0) = -2$이다.\n따라서 정답은 ①이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-183",
    "problemTypeKey": "PT_DEFINITE_INTEGRAL_FUNCTION_RELATION",
    "templateKey": "TPL_DIFFERENTIATE_INTEGRAL_RELATION",
    "crossConceptKeys": [
      "CC_FUNDAMENTAL_THEOREM_OF_CALCULUS_LEIBNIZ",
      "CC_DERIVATIVE_VALUE_EVALUATION"
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
    "content": "실수 전체의 집합에서 미분가능한 함수 $f(x)$가 모든 실수 $x$에 대하여\n$$\\int_1^x f(t) dt = x f(x) - x^2 e^x$$\n를 만족시킬 때, $f(2)$의 값은?",
    "choices": [
      "$e^2 - e$",
      "$2e^2 - 2e$",
      "$2e^2 - e$",
      "$3e^2 - e$",
      "$3e^2 + e$"
    ],
    "answer": "④",
    "solution": "[아래끝 대입] $x = 1$을 대입하면 $0 = f(1) - e$이므로 $f(1) = e$이다.\n[미분] 양변을 미분하면 $f(x) = f(x) + x f'(x) - (2xe^x + x^2e^x)$이다.\n[정리] $x f'(x) = (x^2 + 2x)e^x = x(x+2)e^x$이므로 $f'(x) = (x+2)e^x$이다.\n[부분적분법] $u = x+2$, $v' = e^x$로 두면 $f(x) = \\int (x+2)e^x dx = (x+2)e^x - \\int e^x dx = (x+1)e^x + C$이다.\n[상수 결정] $f(1) = 2e + C = e$이므로 $C = -e$이다.\n[함수 완성] $f(x) = (x+1)e^x - e$이다.\n[계산] $f(2) = 3e^2 - e$이다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-183",
    "problemTypeKey": "PT_DEFINITE_INTEGRAL_FUNCTION_RELATION",
    "templateKey": "TPL_DIFFERENTIATE_INTEGRAL_RELATION",
    "crossConceptKeys": [
      "CC_FUNDAMENTAL_THEOREM_OF_CALCULUS_LEIBNIZ",
      "CC_INTEGRATION_BY_PARTS_OR_EXPANSION",
      "CC_INTEGRAL_BOUNDARY_ROOT_EVALUATION"
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
    "content": "양의 실수 전체의 집합에서 미분가능한 함수 $f(x)$가 모든 양수 $x$에 대하여\n$$x f(x) - \\int_1^x f(t) dt = 2x^2 \\ln x$$\n를 만족시킬 때, $f'(1)$의 값은?",
    "choices": [
      "$1$",
      "$2$",
      "$3$",
      "$4$",
      "$5$"
    ],
    "answer": "②",
    "solution": "[미분] $x f(x) - \\int_1^x f(t) dt = 2x^2\\ln x$의 양변을 미분하면 $f(x) + x f'(x) - f(x) = 4x\\ln x + 2x$이다.\n[정리] $x f'(x) = x(4\\ln x + 2)$에서 $x > 0$이므로 $f'(x) = 4\\ln x + 2$이다.\n[대입] $f'(1) = 4\\ln 1 + 2 = 4(0) + 2 = 2$이다.\n따라서 정답은 ②이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-183",
    "problemTypeKey": "PT_DEFINITE_INTEGRAL_FUNCTION_RELATION",
    "templateKey": "TPL_DIFFERENTIATE_INTEGRAL_RELATION",
    "crossConceptKeys": [
      "CC_FUNDAMENTAL_THEOREM_OF_CALCULUS_LEIBNIZ",
      "CC_DERIVATIVE_VALUE_EVALUATION"
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
    "content": "양의 실수 전체의 집합에서 정의된 미분가능한 함수 $f(x)$가 모든 양수 $x$에 대하여\n$$x f(x) = 2x \\ln x + \\int_1^x f(t) dt$$\n를 만족시킬 때, $f(e^2)$의 값은?",
    "choices": [
      "$2$",
      "$4$",
      "$6$",
      "$8$",
      "$10$"
    ],
    "answer": "④",
    "solution": "[미분] $x f(x) = 2x\\ln x + \\int_1^x f(t) dt$의 양변을 미분하면 $f(x) + x f'(x) = (2\\ln x + 2) + f(x)$이다.\n[정리] $f(x)$를 소거하면 $x f'(x) = 2\\ln x + 2$이므로 $f'(x) = \\frac{2\\ln x + 2}{x}$이다.\n[치환적분법] $u = \\ln x$로 두면 $du = \\frac{1}{x}dx$이므로 $f(x) = \\int (2u+2)du = (\\ln x)^2 + 2\\ln x + C$이다.\n[상수 결정] $x = 1$에서 $1 \\cdot f(1) = 0 + 0$이므로 $f(1) = 0$, 즉 $C = 0$이다.\n[계산] $f(e^2) = (\\ln e^2)^2 + 2\\ln e^2 = 4 + 4 = 8$이다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-183",
    "problemTypeKey": "PT_DEFINITE_INTEGRAL_FUNCTION_RELATION",
    "templateKey": "TPL_DIFFERENTIATE_INTEGRAL_RELATION",
    "crossConceptKeys": [
      "CC_FUNDAMENTAL_THEOREM_OF_CALCULUS_LEIBNIZ",
      "CC_INTEGRAL_BOUNDARY_ROOT_EVALUATION"
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
    "content": "함수 $f(x) = \\int_0^x \\dfrac{1}{e^t + 1} dt$에 대하여 $f(a) = 1$이 성립할 때,\n정적분 $$\\int_0^a \\dfrac{\\ln(f(x) + 1)}{e^x + 1} dx$$\n의 값은? (단, $a$는 실수이다.)",
    "choices": [
      "$2\\ln 2 - 2$",
      "$2\\ln 2 - 1$",
      "$2\\ln 2$",
      "$2\\ln 2 + 1$",
      "$2\\ln 2 + 2$"
    ],
    "answer": "②",
    "solution": "[도함수] $f'(x) = \\frac{1}{e^x+1}$이고 $f(0) = 0$이다.\n[치환적분법] $u = f(x)$로 두면 $du = \\frac{1}{e^x+1}dx$이다.\n[구간 변경] $x = 0$일 때 $u = 0$, $x = a$일 때 $u = f(a) = 1$이다.\n[변형] $\\int_0^a \\frac{\\ln(f(x)+1)}{e^x+1}dx = \\int_0^1 \\ln(u+1)du$이다.\n[부분적분법] $\\int_0^1 \\ln(u+1)du = [(u+1)\\ln(u+1) - (u+1)]_0^1$이다.\n[계산] $(2\\ln 2 - 2) - (0 - 1) = 2\\ln 2 - 1$이다.\n따라서 정답은 ②이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B45",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-183",
    "problemTypeKey": "PT_DEFINITE_INTEGRAL_FUNCTION_RELATION",
    "templateKey": "TPL_DIFFERENTIATE_INTEGRAL_RELATION",
    "crossConceptKeys": [
      "CC_FUNDAMENTAL_THEOREM_OF_CALCULUS_LEIBNIZ",
      "CC_DEFINITE_INTEGRAL",
      "CC_INTEGRATION_BY_PARTS_OR_EXPANSION"
    ],
    "conditionKeys": [
      "COND_FUNCTION_VALUE_CONSTRAINT"
    ],
    "integrationPattern": "REINTERPRETATION"
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
    "content": "함수 $f(x) = \\int_0^x \\dfrac{1}{1+t^2} dt$에 대하여 상수 $a$가 $f(a) = \\ln 4$를 만족시킬 때,\n정적분 $$\\int_0^a \\dfrac{e^{f(x)}}{1+x^2} dx$$\n의 값은?",
    "choices": [
      "$1$",
      "$2$",
      "$3$",
      "$4$",
      "$5$"
    ],
    "answer": "③",
    "solution": "[도함수] $f'(x) = \\frac{1}{1+x^2}$이고 $f(0) = 0$이다.\n[치환적분법] $u = f(x)$로 두면 $du = \\frac{1}{1+x^2}dx$이다.\n[구간 변경] $x = 0$일 때 $u = 0$, $x = a$일 때 $u = f(a) = \\ln 4$이다.\n[계산] $\\int_0^a \\frac{e^{f(x)}}{1+x^2}dx = \\int_0^{\\ln 4} e^u du = [e^u]_0^{\\ln 4}$이다.\n[지수 계산] $e^{\\ln 4} - e^0 = 4 - 1 = 3$이다.\n따라서 정답은 ③이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-183",
    "problemTypeKey": "PT_DEFINITE_INTEGRAL_FUNCTION_RELATION",
    "templateKey": "TPL_DIFFERENTIATE_INTEGRAL_RELATION",
    "crossConceptKeys": [
      "CC_FUNDAMENTAL_THEOREM_OF_CALCULUS_LEIBNIZ",
      "CC_DEFINITE_INTEGRAL"
    ],
    "conditionKeys": [
      "COND_FUNCTION_VALUE_CONSTRAINT"
    ],
    "integrationPattern": "REINTERPRETATION"
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
    "content": "실수 전체의 집합에서 연속인 함수 $f(x)$가 모든 실수 $x$에 대하여\n$$\\int_0^x f(x-t) dt = e^{3x} + 2e^x - 3$$\n를 만족시킬 때, $f(\\ln 2)$의 값은?",
    "choices": [
      "$20$",
      "$22$",
      "$24$",
      "$26$",
      "$28$"
    ],
    "answer": "⑤",
    "solution": "[치환적분법] $s = x-t$로 두면 $ds = -dt$이고 $\\int_0^x f(x-t)dt = \\int_x^0 f(s)(-ds) = \\int_0^x f(s)ds$이다.\n[등식 정리] 따라서 $\\int_0^x f(t)dt = e^{3x} + 2e^x - 3$이다.\n[미분] 양변을 미분하면 $f(x) = 3e^{3x} + 2e^x$이다.\n[대입] $f(\\ln 2) = 3e^{3\\ln 2} + 2e^{\\ln 2} = 3 \\cdot 8 + 2 \\cdot 2 = 28$이다.\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-183",
    "problemTypeKey": "PT_DEFINITE_INTEGRAL_FUNCTION_RELATION",
    "templateKey": "TPL_DIFFERENTIATE_INTEGRAL_RELATION",
    "crossConceptKeys": [
      "CC_FUNDAMENTAL_THEOREM_OF_CALCULUS_LEIBNIZ",
      "CC_DEFINITE_INTEGRAL"
    ],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
  }
];
