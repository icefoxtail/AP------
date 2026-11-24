window.examTitle = "미적분II_276_역함수로표현된정적분계산_고2_유형은행1";

window.questionBank = [
  {
    "id": 1,
    "category": "정적분의 활용",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-08",
    "standardUnit": "정적분의 활용",
    "standardUnitOrder": 8,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "정적분의 활용"
    ],
    "wide": false,
    "content": "함수 $f(x)=e^{x-1}+2$의 역함수를 $g(x)$라 할 때, $\\displaystyle \\int_1^2 f(x)\\,dx + \\int_3^{e+2} g(x)\\,dx$의 값은?",
    "choices": [
      "$2e-1$",
      "$2e+1$",
      "$2e+3$",
      "$3e+1$",
      "$3e+3$"
    ],
    "answer": "②",
    "solution": "1. $f(1)=e^{1-1}+2=e^0+2=3$, $f(2)=e^{2-1}+2=e+2$를 계산한다.\n2. $f'(x)=e^{x-1}>0$이므로 $f(x)$는 $[1,2]$에서 증가하는 일대일함수이고 역함수 $g(x)$가 존재한다.\n3. 역함수의 정의에 의해 $g(3)=1$, $g(e+2)=2$이다.\n4. [역함수의 정적분 성질] 증가함수 $f$와 그 역함수 $g$에 대하여 $\\displaystyle \\int_a^b f(x)\\,dx+\\int_{f(a)}^{f(b)}g(x)\\,dx=b f(b)-a f(a)$가 성립한다.\n5. $a=1$, $b=2$, $f(1)=3$, $f(2)=e+2$를 공식에 대입한다.\n$\\displaystyle \\int_1^2 f(x)\\,dx+\\int_3^{e+2}g(x)\\,dx=2(e+2)-1\\cdot 3$\n6. 전개하여 계산하면 $2e+4-3=2e+1$이다.\n따라서 정답은 ②이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-102",
    "problemTypeKey": "PT_AREA_BY_DEFINITE_INTEGRAL",
    "templateKey": "TPL_INTERSECTION_SIGN_AREA",
    "crossConceptKeys": [
      "CC_EXPONENTIAL_FUNCTION_GRAPH"
    ],
    "conditionKeys": [],
    "integrationPattern": "REINTERPRETATION"
  },
  {
    "id": 2,
    "category": "정적분의 활용",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-08",
    "standardUnit": "정적분의 활용",
    "standardUnitOrder": 8,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "정적분의 활용"
    ],
    "wide": false,
    "content": "함수 $f(x)=\\ln x + 1$ ($x>0$)의 역함수를 $g(x)$라 할 때, $\\displaystyle \\int_e^{e^2} f(x)\\,dx + \\int_2^3 g(x)\\,dx$의 값은?",
    "choices": [
      "$2e^2-e$",
      "$3e^2-2e$",
      "$3e^2-e$",
      "$4e^2-3e$",
      "$4e^2-2e$"
    ],
    "answer": "②",
    "solution": "1. $f(e)=\\ln e+1=1+1=2$이고, $f(e^2)=\\ln(e^2)+1=2+1=3$이다.\n2. $f'(x)=\\dfrac{1}{x}>0$이므로 $f(x)$는 $x>0$에서 증가하는 일대일함수이고 역함수 $g(x)$가 존재한다.\n3. 역함수의 정의에 의해 $g(2)=e$, $g(3)=e^2$이다.\n4. [역함수의 정적분 성질] 증가함수 $f$와 그 역함수 $g$에 대하여 $\\displaystyle \\int_a^b f(x)\\,dx+\\int_{f(a)}^{f(b)}g(x)\\,dx=b f(b)-a f(a)$이다.\n5. $a=e$, $b=e^2$, $f(e)=2$, $f(e^2)=3$을 대입한다.\n$\\displaystyle \\int_e^{e^2} f(x)\\,dx+\\int_2^3 g(x)\\,dx=e^2\\cdot 3-e\\cdot 2$\n6. 정리하면 $3e^2-2e$이다.\n따라서 정답은 ②이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-102",
    "problemTypeKey": "PT_AREA_BY_DEFINITE_INTEGRAL",
    "templateKey": "TPL_INTERSECTION_SIGN_AREA",
    "crossConceptKeys": [
      "CC_LOGARITHMIC_FUNCTION_GRAPH"
    ],
    "conditionKeys": [
      "COND_POSITIVE"
    ],
    "integrationPattern": "REINTERPRETATION"
  },
  {
    "id": 3,
    "category": "정적분의 활용",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-08",
    "standardUnit": "정적분의 활용",
    "standardUnitOrder": 8,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "정적분의 활용"
    ],
    "wide": false,
    "content": "$0 \\le x \\le \\dfrac{\\pi}{3}$에서 함수 $f(x)=\\sqrt{3}\\tan x$의 역함수를 $g(x)$라 할 때, $\\displaystyle \\int_1^{\\sqrt{3}} g(x)\\,dx + \\int_{g(1)}^{g(\\sqrt{3})} \\sqrt{3}\\tan x\\,dx$의 값은?",
    "choices": [
      "$\\dfrac{3\\sqrt{3}-5}{12}\\pi$",
      "$\\dfrac{3\\sqrt{3}-4}{12}\\pi$",
      "$\\dfrac{3\\sqrt{3}-3}{12}\\pi$",
      "$\\dfrac{3\\sqrt{3}-2}{12}\\pi$",
      "$\\dfrac{3\\sqrt{3}-1}{12}\\pi$"
    ],
    "answer": "④",
    "solution": "1. $g(1)=\\alpha$라 하면 $f(\\alpha)=\\sqrt3\\tan\\alpha=1$이므로 $\\tan\\alpha=\\dfrac{1}{\\sqrt3}$이고, 정의역 조건에서 $\\alpha=\\dfrac{\\pi}{6}$이다.\n2. $g(\\sqrt3)=\\beta$라 하면 $\\sqrt3\\tan\\beta=\\sqrt3$이므로 $\\tan\\beta=1$이고, 정의역 조건에서 $\\beta=\\dfrac{\\pi}{4}$이다.\n3. 따라서 $g(1)=\\dfrac{\\pi}{6}$, $g(\\sqrt3)=\\dfrac{\\pi}{4}$이며 $f\\left(\\dfrac{\\pi}{6}\\right)=1$, $f\\left(\\dfrac{\\pi}{4}\\right)=\\sqrt3$이다.\n4. 두 정적분의 순서를 바꾸어 쓰면 $\\displaystyle \\int_1^{\\sqrt3}g(x)\\,dx+\\int_{\\pi/6}^{\\pi/4}f(x)\\,dx$이다.\n5. [역함수의 정적분 성질] 증가함수 $f$와 그 역함수 $g$에 대하여 $\\displaystyle \\int_a^b f(x)\\,dx+\\int_{f(a)}^{f(b)}g(x)\\,dx=b f(b)-a f(a)$가 성립한다.\n6. 여기서 $a=\\dfrac{\\pi}{6}$, $b=\\dfrac{\\pi}{4}$를 공식에 대입한다.\n$\\displaystyle \\int_{\\pi/6}^{\\pi/4}f(x)\\,dx+\\int_1^{\\sqrt3}g(x)\\,dx=\\dfrac{\\pi}{4}\\cdot\\sqrt3-\\dfrac{\\pi}{6}\\cdot 1$\n7. 각 항을 계산하면 $\\dfrac{\\sqrt3\\pi}{4}-\\dfrac{\\pi}{6}$이다.\n8. 분모를 $12$로 통분하면 $\\dfrac{3\\sqrt3\\pi-2\\pi}{12}=\\dfrac{3\\sqrt3-2}{12}\\pi$이다.\n주의: $g(x)$를 직접 적분하지 않고 역함수의 정적분 성질로 직사각형 넓이의 차를 이용하는 것이 핵심이다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-102",
    "problemTypeKey": "PT_AREA_BY_DEFINITE_INTEGRAL",
    "templateKey": "TPL_INTERSECTION_SIGN_AREA",
    "crossConceptKeys": [
      "CC_TRIGONOMETRIC_TANGENT"
    ],
    "conditionKeys": [
      "COND_RESTRICTED_INTERVAL"
    ],
    "integrationPattern": "REINTERPRETATION"
  }
];
