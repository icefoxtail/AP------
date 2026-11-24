window.examTitle = "미적분II_227_지수함수의치환적분법_고2_유형은행1";

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
    "content": "등식 $\\int x^2 e^{3x^3+2} dx = a e^{bx^3+2} + C$가 성립할 때, $\\dfrac{b}{a}$의 값은? (단, $C$는 적분상수이고 $a, b$는 양의 상수이다.)",
    "choices": [
      "$3$",
      "$9$",
      "$27$",
      "$54$",
      "$81$"
    ],
    "answer": "③",
    "solution": "치환적분법을 쓰기 위해 $u=3x^3+2$로 놓는다.\n양변을 $x$에 대해 미분하면 $\\dfrac{du}{dx}=9x^2$이므로 $x^2\\,dx=\\dfrac{1}{9}du$이다.\n주어진 적분에 대입하면 $\\int x^2 e^{3x^3+2}dx=\\int e^u\\cdot\\dfrac{1}{9}du=\\dfrac{1}{9}\\int e^u du$이다.\n지수함수의 적분 공식 $\\int e^u du=e^u+C$를 적용하면 $\\dfrac{1}{9}e^u+C$이다.\n$u=3x^3+2$를 다시 대입하면 $\\dfrac{1}{9}e^{3x^3+2}+C$이다.\n주어진 식과 계수를 비교하면 $a=\\dfrac{1}{9}$, $b=3$이다.\n따라서 $\\dfrac{b}{a}=3\\div\\dfrac{1}{9}=3\\times9=27$이다.\n주의: $9x^2$의 역수 $\\dfrac{1}{9}$을 빠뜨리지 않는다.\n따라서 정답은 ③이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-097",
    "problemTypeKey": "PT_CALCULUS_SUBSTITUTION_INTEGRAL",
    "templateKey": "TPL_CALCULUS_SUBSTITUTION_INDEFINITE",
    "crossConceptKeys": [
      "CC_INDEFINITE_INTEGRAL"
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
    "content": "실수 전체의 집합에서 미분가능한 함수 $f(x)$에 대하여\n$$f'(x) = 6x e^{-x^2}, \\quad f(0) = 1$$\n일 때, $f(1)$의 값은?",
    "choices": [
      "$4 - \\dfrac{3}{e}$",
      "$4 - \\dfrac{3}{e^2}$",
      "$4$",
      "$4 + \\dfrac{3}{e^2}$",
      "$4 + \\dfrac{3}{e}$"
    ],
    "answer": "①",
    "solution": "$f'(x)$를 적분하여 $f(x)$를 구한다: $f(x)=\\int 6xe^{-x^2}dx$.\n치환적분법을 위해 $u=-x^2$으로 놓으면 $\\dfrac{du}{dx}=-2x$이고 $6x\\,dx=-3\\,du$이다.\n따라서 $f(x)=\\int (-3)e^u du=-3e^u+C=-3e^{-x^2}+C$이다.\n조건 $f(0)=1$을 대입하면 $-3e^0+C=-3+C=1$이므로 $C=4$이다.\n그러므로 $f(x)=4-3e^{-x^2}$이다.\n$x=1$을 대입하면 $f(1)=4-3e^{-1}=4-\\dfrac{3}{e}$이다.\n주의: $e^{-1}=\\dfrac{1}{e}$이고 $e^0=1$이다.\n따라서 정답은 ①이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-097",
    "problemTypeKey": "PT_CALCULUS_SUBSTITUTION_INTEGRAL",
    "templateKey": "TPL_CALCULUS_SUBSTITUTION_INDEFINITE",
    "crossConceptKeys": [
      "CC_INDEFINITE_INTEGRAL"
    ],
    "conditionKeys": [
      "COND_FUNCTION_VALUE_CONSTRAINT"
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
    "content": "$x > 0$에서 정의된 함수 $f(x)$에 대하여\n$$f(x) = \\int \\dfrac{2}{x^2} e^{\\frac{1}{x}} dx, \\quad f(1) = 3 - 2e$$\n일 때, 함수 $f(2)$의 값은?",
    "choices": [
      "$-2\\sqrt{e} - 1$",
      "$-2\\sqrt{e}$",
      "$-2\\sqrt{e} + 1$",
      "$-2\\sqrt{e} + 2$",
      "$-2\\sqrt{e} + 3$"
    ],
    "answer": "⑤",
    "solution": "$\\dfrac1x=t$로 놓으면 $\\dfrac{dt}{dx}=-\\dfrac1{x^2}$이므로 $\\dfrac{2}{x^2}dx=-2\\,dt$이다.\n따라서 $f(x)=\\int \\dfrac{2}{x^2}e^{1/x}dx=\\int (-2)e^t dt=-2e^t+C$이다.\n$t=\\dfrac1x$를 되돌려 $f(x)=-2e^{1/x}+C$이다.\n$f(1)=3-2e$를 대입하면 $-2e^1+C=3-2e$이므로 $C=3$이다.\n그러므로 $f(x)=-2e^{1/x}+3$이다.\n$x=2$를 대입하면 $f(2)=-2e^{1/2}+3=-2\\sqrt e+3$이다.\n주의: $e^{1/2}=\\sqrt e$이다.\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-097",
    "problemTypeKey": "PT_CALCULUS_SUBSTITUTION_INTEGRAL",
    "templateKey": "TPL_CALCULUS_SUBSTITUTION_INDEFINITE",
    "crossConceptKeys": [
      "CC_INDEFINITE_INTEGRAL"
    ],
    "conditionKeys": [
      "COND_POSITIVE",
      "COND_FUNCTION_VALUE_CONSTRAINT"
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
    "content": "함수 $f(x)$에 대하여\n$$f(x) = \\int \\dfrac{e^x}{\\sqrt{e^x + 8}} dx, \\quad f(0) = 3$$\n일 때, $f(\\ln 8)$의 값은?",
    "choices": [
      "$2$",
      "$3$",
      "$4$",
      "$5$",
      "$6$"
    ],
    "answer": "④",
    "solution": "$t=e^x+8$로 놓으면 $\\dfrac{dt}{dx}=e^x$이므로 $e^x dx=dt$이다.\n$f(x)=\\int \\dfrac{e^x}{\\sqrt{e^x+8}}dx=\\int t^{-1/2}dt$이다.\n거듭제곱의 적분법으로 $\\int t^{-1/2}dt=\\dfrac{t^{1/2}}{1/2}+C=2\\sqrt t+C$이다.\n$t=e^x+8$을 대입하면 $f(x)=2\\sqrt{e^x+8}+C$이다.\n$f(0)=3$에서 $2\\sqrt{1+8}+C=2\\cdot3+C=6+C=3$이므로 $C=-3$이다.\n따라서 $f(x)=2\\sqrt{e^x+8}-3$이다.\n$x=\\ln8$을 대입하면 $f(\\ln8)=2\\sqrt{8+8}-3=2\\sqrt{16}-3=8-3=5$이다.\n주의: $e^{\\ln8}=8$이고 $\\sqrt{16}=4$이다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-097",
    "problemTypeKey": "PT_CALCULUS_SUBSTITUTION_INTEGRAL",
    "templateKey": "TPL_CALCULUS_SUBSTITUTION_INDEFINITE",
    "crossConceptKeys": [
      "CC_INDEFINITE_INTEGRAL"
    ],
    "conditionKeys": [
      "COND_FUNCTION_VALUE_CONSTRAINT"
    ],
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
    "content": "$0 \\le x \\le 2$에서 정의된 함수 $f(x)$를\n$$f(x) = \\int \\dfrac{1}{2}x e^{x^2 - 1} dx$$\n라 하자. $f(0) = \\dfrac{1}{4e}$일 때, $f(x)$의 최댓값은?",
    "choices": [
      "$\\dfrac{1}{4} e^3$",
      "$\\dfrac{1}{2} e^3$",
      "$e^3$",
      "$2e^3$",
      "$4e^3$"
    ],
    "answer": "①",
    "solution": "치환적분법을 위해 $t=x^2-1$로 놓으면 $\\dfrac{dt}{dx}=2x$이므로 $\\dfrac12x\\,dx=\\dfrac14dt$이다.\n$f(x)=\\int \\dfrac12xe^{x^2-1}dx=\\dfrac14\\int e^t dt=\\dfrac14e^t+C=\\dfrac14e^{x^2-1}+C$이다.\n$f(0)=\\dfrac1{4e}$를 대입하면 $\\dfrac14e^{-1}+C=\\dfrac1{4e}+C=\\dfrac1{4e}$이므로 $C=0$이다.\n따라서 $f(x)=\\dfrac14e^{x^2-1}$이다.\n$0\\le x\\le2$에서 $f'(x)=\\dfrac12xe^{x^2-1}\\ge0$이므로 $f(x)$는 증가함수이다.\n증가함수이므로 최댓값은 $x=2$에서 $f(2)=\\dfrac14e^{4-1}=\\dfrac14e^3$이다.\n주의: 구간의 끝 $x=2$에서 최댓값을 확인한다.\n따라서 정답은 ①이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-097",
    "problemTypeKey": "PT_CALCULUS_SUBSTITUTION_INTEGRAL",
    "templateKey": "TPL_CALCULUS_SUBSTITUTION_INDEFINITE",
    "crossConceptKeys": [
      "CC_INDEFINITE_INTEGRAL",
      "CC_FUNCTION_MONOTONICITY"
    ],
    "conditionKeys": [
      "COND_RESTRICTED_INTERVAL",
      "COND_FUNCTION_VALUE_CONSTRAINT"
    ],
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
    "content": "실수 전체의 집합에서 미분가능한 함수 $f(x)$가 다음 조건을 만족시킬 때, $f(\\sqrt{\\ln 2})$의 값은?\n(가) $\\lim_{h \\to 0} \\dfrac{f(x+2h) - f(x-h)}{h} = 6x e^{x^2}$\n(나) $\\lim_{x \\to 1} f(x) = e + 1$",
    "choices": [
      "$1$",
      "$2$",
      "$3$",
      "$4$",
      "$5$"
    ],
    "answer": "③",
    "solution": "미분계수의 정의를 쓰기 위해 극한의 분자를 나눈다: $\\displaystyle\\lim_{h\\to0}\\frac{f(x+2h)-f(x-h)}h=\\lim_{h\\to0}\\left(\\frac{f(x+2h)-f(x)}h+\\frac{f(x)-f(x-h)}h\\right)$.\n첫 항은 $\\displaystyle 2\\lim_{h\\to0}\\frac{f(x+2h)-f(x)}{2h}=2f'(x)$이다.\n둘째 항은 $\\displaystyle \\lim_{h\\to0}\\frac{f(x-h)-f(x)}{-h}=f'(x)$이다.\n따라서 좌변은 $2f'(x)+f'(x)=3f'(x)$이다.\n조건 (가)에서 $3f'(x)=6xe^{x^2}$이므로 $f'(x)=2xe^{x^2}$이다.\n$u=x^2$으로 놓으면 $du=2x\\,dx$이므로 $f(x)=\\int2xe^{x^2}dx=\\int e^u du=e^u+C=e^{x^2}+C$이다.\n$f$가 미분가능하므로 연속이고, 조건 (나)에서 $f(1)=\\lim_{x\\to1}f(x)=e+1$이다.\n$f(1)=e^1+C=e+C=e+1$이므로 $C=1$이다.\n따라서 $f(x)=e^{x^2}+1$이고, $x=\\sqrt{\\ln2}$를 대입하면 $f(\\sqrt{\\ln2})=e^{\\ln2}+1=2+1=3$이다.\n주의: 미분가능하면 연속이므로 극한값은 함숫값과 같다.\n따라서 정답은 ③이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-097",
    "problemTypeKey": "PT_CALCULUS_SUBSTITUTION_INTEGRAL",
    "templateKey": "TPL_CALCULUS_SUBSTITUTION_INDEFINITE",
    "crossConceptKeys": [
      "CC_DERIVATIVE_DEFINITION_LIMIT",
      "CC_DIFFERENCE_QUOTIENT_SCALING",
      "CC_INDEFINITE_INTEGRAL"
    ],
    "conditionKeys": [
      "COND_FUNCTION_VALUE_CONSTRAINT"
    ],
    "integrationPattern": "SEQUENTIAL"
  }
];
