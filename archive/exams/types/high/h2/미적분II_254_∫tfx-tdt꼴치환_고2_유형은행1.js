window.examTitle = "미적분II_254_∫tfx-tdt꼴치환_고2_유형은행1";

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
    "content": "함수 $f(x) = \\dfrac{4x}{2x^2+1}$에 대하여\n$$F(x) = \\int_0^x tf(x-t)dt \\quad (x \\ge 0)$$\n일 때, $F'(a) = \\ln 33$을 만족시키는 양수 $a$의 값은?",
    "choices": [
      "$4$",
      "$6$",
      "$8$",
      "$10$",
      "$12$"
    ],
    "answer": "①",
    "solution": "1. [치환적분법] $x-t=u$로 놓으면 $t=x-u$, $dt=-du$이고 적분구간은 $t=0\\to u=x$, $t=x\\to u=0$이다.\n2. [정적분의 성질] $F(x)=\\int_x^0 (x-u)f(u)(-du)=\\int_0^x (x-u)f(u)\\,du=x\\int_0^x f(u)\\,du-\\int_0^x uf(u)\\,du$이다.\n3. [곱의 미분법과 미적분의 기본정리] 양변을 $x$에 대하여 미분하면 $F'(x)=1\\cdot\\int_0^x f(u)\\,du+x f(x)-x f(x)=\\int_0^x f(u)\\,du$이다.\n4. [함수 대입 및 치환적분] $f(u)=\\dfrac{4u}{2u^2+1}$이므로 $2u^2+1=s$로 놓으면 $4u\\,du=ds$이고 $F'(x)=\\int_0^x \\dfrac{4u}{2u^2+1}\\,du=\\int_1^{2x^2+1}\\dfrac{1}{s}\\,ds$이다.\n5. [정적분 계산] $F'(x)=[\\ln s]_1^{2x^2+1}=\\ln(2x^2+1)-\\ln1=\\ln(2x^2+1)$이다.\n6. [조건 대입] $F'(a)=\\ln(2a^2+1)=\\ln33$에서 $2a^2+1=33$이다.\n7. [이차방정식 풀이] $2a^2=32$, $a^2=16$이므로 $a=4$ 또는 $a=-4$이다.\n8. [양수 조건] $a>0$이므로 $a=4$이다.\n주의: $a$가 양수라는 조건에서 $a=-4$를 버린다.\n따라서 정답은 ①이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-185",
    "problemTypeKey": "PT_DEFINITE_INTEGRAL_FUNCTION_RELATION",
    "templateKey": "TPL_DIFFERENTIATE_INTEGRAL_RELATION",
    "crossConceptKeys": [
      "CC_FUNDAMENTAL_THEOREM_OF_CALCULUS_LEIBNIZ",
      "CC_RATIONAL_FUNCTION"
    ],
    "conditionKeys": [
      "COND_POSITIVE",
      "COND_RANGE"
    ],
    "integrationPattern": "REINTERPRETATION"
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
    "content": "연속함수 $f(x)$와 상수 $a, b$가 모든 실수 $x$에 대하여\n$$\\int_0^x tf(x-t)dt = e^{2x} + ax + b$$\n를 만족시킬 때, $a+b$의 값은?",
    "choices": [
      "$-3$",
      "$-1$",
      "$1$",
      "$3$",
      "$5$"
    ],
    "answer": "①",
    "solution": "1. [치환적분법] $x-t=u$로 놓으면 $t=x-u$, $dt=-du$이고 적분구간은 $t=0\\to u=x$, $t=x\\to u=0$이다.\n2. [정적분의 성질] 좌변은 $\\int_x^0 (x-u)f(u)(-du)=\\int_0^x (x-u)f(u)\\,du=x\\int_0^x f(u)\\,du-\\int_0^x uf(u)\\,du$이다.\n3. [등식 정리] 따라서 $x\\int_0^x f(u)\\,du-\\int_0^x uf(u)\\,du=e^{2x}+ax+b$이다.\n4. [$x=0$ 대입] $x=0$이면 좌변은 $0$, 우변은 $e^0+b=1+b$이므로 $1+b=0$에서 $b=-1$이다.\n5. [미분] 양변을 $x$에 대하여 미분하면 곱의 미분법과 미적분의 기본정리에 의해 $\\int_0^x f(u)\\,du+x f(x)-x f(x)=2e^{2x}+a$이다.\n6. [정리] 즉 $\\int_0^x f(u)\\,du=2e^{2x}+a$이다.\n7. [$x=0$ 재대입] $x=0$이면 좌변은 $0$, 우변은 $2e^0+a=2+a$이므로 $2+a=0$에서 $a=-2$이다.\n8. [$a+b$ 계산] $a+b=-2-1=-3$이다.\n주의: $x=0$ 대입을 미분 전후로 각각 해야 $b$와 $a$를 모두 구할 수 있다.\n따라서 정답은 ①이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-185",
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
    "content": "함수 $f(x)$가 모든 실수 $x$에 대하여\n$$f(x) = \\int_0^x t e^{2(x-t)}dt$$\n일 때, $f'(\\ln 2)$의 값은?",
    "choices": [
      "$0$",
      "$\\dfrac{1}{2}$",
      "$1$",
      "$\\dfrac{3}{2}$",
      "$2$"
    ],
    "answer": "④",
    "solution": "1. [치환적분법] $x-t=u$로 놓으면 $t=x-u$, $dt=-du$이고 적분구간은 $t=0\\to u=x$, $t=x\\to u=0$이다.\n2. [정적분의 성질] $f(x)=\\int_x^0 (x-u)e^{2u}(-du)=\\int_0^x (x-u)e^{2u}\\,du=x\\int_0^x e^{2u}\\,du-\\int_0^x ue^{2u}\\,du$이다.\n3. [곱의 미분법과 미적분의 기본정리] 양변을 $x$에 대하여 미분하면 $f'(x)=1\\cdot\\int_0^x e^{2u}\\,du+x e^{2x}-x e^{2x}=\\int_0^x e^{2u}\\,du$이다.\n4. [지수함수의 적분] $\\int e^{2u}\\,du=\\dfrac12 e^{2u}+C$이므로 $f'(x)=\\left[\\dfrac12 e^{2u}\\right]_0^x$이다.\n5. [정적분 계산] $f'(x)=\\dfrac12 e^{2x}-\\dfrac12 e^0=\\dfrac12(e^{2x}-1)$이다.\n6. [로그의 성질] $x=\\ln2$일 때 $e^{2\\ln2}=(e^{\\ln2})^2=2^2=4$이다.\n7. [값 계산] $f'(\\ln2)=\\dfrac12(4-1)=\\dfrac32$이다.\n주의: $e^{2\\ln2}=4$를 $e^{\\ln2}=2$에서 정확히 계산한다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B45",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-185",
    "problemTypeKey": "PT_DEFINITE_INTEGRAL_FUNCTION_RELATION",
    "templateKey": "TPL_DIFFERENTIATE_INTEGRAL_RELATION",
    "crossConceptKeys": [
      "CC_FUNDAMENTAL_THEOREM_OF_CALCULUS_LEIBNIZ",
      "CC_INTEGRATION_BY_PARTS_OR_EXPANSION",
      "CC_DERIVATIVE_VALUE_EVALUATION"
    ],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
  }
];
