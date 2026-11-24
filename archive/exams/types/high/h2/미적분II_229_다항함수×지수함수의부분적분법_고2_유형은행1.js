window.examTitle = "미적분II_229_다항함수×지수함수의부분적분법_고2_유형은행1";

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
    "content": "함수 $f(x)$에 대하여\n$$f'(x) = (2x+3)e^x, \\quad f(0) = 2$$\n일 때, $f(1)$의 값은? (단, $e$는 자연로그의 밑이다.)",
    "choices": [
      "$3e-1$",
      "$3e+1$",
      "$3e+2$",
      "$3e+3$",
      "$3e+5$"
    ],
    "answer": "②",
    "solution": "도함수를 부정적분하여 $f(x)$를 구한다(부분적분법).\n$u=2x+3$, $v'=e^x$로 놓으면 $u'=2$, $v=e^x$이다.\n부분적분법 $\\int uv'dx=uv-\\int u'v\\,dx$에 대입하면 $f(x)=(2x+3)e^x-\\int 2e^x\\,dx$이다.\n남은 적분을 계산하면 $f(x)=(2x+3)e^x-2e^x+C=(2x+1)e^x+C$ (단, $C$는 적분상수)이다.\n$f(0)=2$를 대입하면 $(0+1)e^0+C=1+C=2$이므로 $C=1$이다.\n따라서 $f(x)=(2x+1)e^x+1$이다.\n$f(1)=(2\\cdot1+1)e^1+1=3e+1$이다.\n따라서 정답은 ②이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-099",
    "problemTypeKey": "PT_CALCULUS_INTEGRATION_BY_PARTS",
    "templateKey": "TPL_CALCULUS_PARTS_PRODUCT",
    "crossConceptKeys": [
      "CC_INDEFINITE_INTEGRAL"
    ],
    "conditionKeys": [
      "COND_FUNCTION_VALUE_CONSTRAINT"
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
    "content": "함수 $f(x)$에 대하여\n$$f'(x) = (3x-1)e^{3x}$$\n이고 $f(0) = -\\frac{2}{3}$일 때, $f(1)$의 값은? (단, $e$는 자연로그의 밑이다.)",
    "choices": [
      "$\\frac{1}{9}e^3$",
      "$\\frac{1}{3}e^3$",
      "$\\frac{2}{3}e^3$",
      "$e^3$",
      "$\\frac{4}{3}e^3$"
    ],
    "answer": "②",
    "solution": "주어진 도함수를 적분하여 $f(x)$를 구한다(부분적분법).\n$u=3x-1$, $v'=e^{3x}$로 놓으면 $u'=3$, $v=\\frac{1}{3}e^{3x}$이다.\n부분적분법 $\\int uv'dx=uv-\\int u'v\\,dx$에 대입하면 $f(x)=\\frac{3x-1}{3}e^{3x}-\\int e^{3x}\\,dx$이다.\n남은 적분을 계산하면 $f(x)=\\frac{3x-1}{3}e^{3x}-\\frac{1}{3}e^{3x}+C=\\frac{3x-2}{3}e^{3x}+C$ (단, $C$는 적분상수)이다.\n$f(0)=-\\frac{2}{3}$을 대입하면 $\\frac{-2}{3}e^0+C=-\\frac{2}{3}+C=-\\frac{2}{3}$이므로 $C=0$이다.\n따라서 $f(x)=\\frac{3x-2}{3}e^{3x}$이다.\n$f(1)=\\frac{3-2}{3}e^3=\\frac{1}{3}e^3$이다.\n따라서 정답은 ②이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-099",
    "problemTypeKey": "PT_CALCULUS_INTEGRATION_BY_PARTS",
    "templateKey": "TPL_CALCULUS_PARTS_PRODUCT",
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
    "content": "상수 $a$에 대하여 함수 $f(x) = \\int (x+a)e^x dx$가\n$$f'(2) = 0, \\quad f(0) = 2$$\n를 만족시킬 때, $f(3)$의 값은?",
    "choices": [
      "5",
      "6",
      "7",
      "8",
      "9"
    ],
    "answer": "①",
    "solution": "적분과 미분의 관계에 의해 $f'(x)=(x+a)e^x$이다.\n$f'(2)=0$에서 $(2+a)e^2=0$이고 $e^2>0$이므로 $2+a=0$, 즉 $a=-2$이다.\n따라서 $f(x)=\\int (x-2)e^x\\,dx$를 부분적분법으로 계산한다.\n$u=x-2$, $v'=e^x$로 놓으면 $u'=1$, $v=e^x$이다.\n$\\int uv'dx=uv-\\int u'v\\,dx$에 의해 $f(x)=(x-2)e^x-\\int e^x\\,dx=(x-2)e^x-e^x+C=(x-3)e^x+C$이다.\n$f(0)=2$를 대입하면 $(0-3)e^0+C=-3+C=2$이므로 $C=5$이다.\n따라서 $f(x)=(x-3)e^x+5$이다.\n$f(3)=(3-3)e^3+5=0+5=5$이다.\n따라서 정답은 ①이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-099",
    "problemTypeKey": "PT_CALCULUS_INTEGRATION_BY_PARTS",
    "templateKey": "TPL_CALCULUS_PARTS_PRODUCT",
    "crossConceptKeys": [
      "CC_INDEFINITE_INTEGRAL",
      "CC_DERIVATIVE_VALUE_EVALUATION"
    ],
    "conditionKeys": [
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
    "content": "미분가능한 함수 $f(x)$의 도함수 $f'(x)$가\n$$f'(x) = (3x+5)e^x, \\quad f(0) = 2$$\n를 만족할 때,\n$$\\frac{f(1)}{e} + \\frac{f(2)}{e^2} + \\frac{f(3)}{e^3} + \\dots + \\frac{f(10)}{e^{10}}$$\n의 값은? (단, $e$는 자연로그의 밑이다.)",
    "choices": [
      "155",
      "165",
      "170",
      "175",
      "185"
    ],
    "answer": "⑤",
    "solution": "도함수를 적분하여 $f(x)$를 구한다(부분적분법).\n$u=3x+5$, $v'=e^x$로 놓으면 $u'=3$, $v=e^x$이다.\n$\\int uv'dx=uv-\\int u'v\\,dx$에 의해 $f(x)=(3x+5)e^x-\\int 3e^x\\,dx=(3x+5)e^x-3e^x+C=(3x+2)e^x+C$이다.\n$f(0)=2$를 대입하면 $(0+2)e^0+C=2+C=2$이므로 $C=0$이다.\n따라서 $f(x)=(3x+2)e^x$이고 $\\frac{f(n)}{e^n}=\\frac{(3n+2)e^n}{e^n}=3n+2$이다.\n구하는 합은 $\\sum_{n=1}^{10}(3n+2)=3\\sum_{n=1}^{10}n+\\sum_{n=1}^{10}2$이다.\n$\\sum_{n=1}^{10}n=\\frac{10\\cdot11}{2}=55$이므로 $3\\cdot55+2\\cdot10=165+20=185$이다.\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-099",
    "problemTypeKey": "PT_CALCULUS_INTEGRATION_BY_PARTS",
    "templateKey": "TPL_CALCULUS_PARTS_PRODUCT",
    "crossConceptKeys": [
      "CC_INDEFINITE_INTEGRAL",
      "CC_SERIES_SUM"
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
    "content": "함수 $f(x)$에 대하여 $f'(x) = (x-1)e^x$이고 함수 $f(x)$의 극솟값이 $5-e$일 때, $f(2)$의 값은? (단, $e$는 자연로그의 밑이다.)",
    "choices": [
      "3",
      "4",
      "5",
      "6",
      "7"
    ],
    "answer": "③",
    "solution": "$f'(x)=(x-1)e^x=0$에서 $e^x>0$이므로 $x=1$이다.\n$x<1$이면 $f'(x)<0$, $x>1$이면 $f'(x)>0$이므로 $x=1$에서 극소이고 극솟값은 $f(1)$이다.\n부분적분법으로 $f(x)$를 구한다: $u=x-1$, $v'=e^x$이면 $u'=1$, $v=e^x$이다.\n$f(x)=(x-1)e^x-\\int e^x\\,dx=(x-1)e^x-e^x+C=(x-2)e^x+C$ (단, $C$는 적분상수)이다.\n극솟값 조건 $f(1)=5-e$를 대입하면 $(1-2)e^1+C=-e+C=5-e$이므로 $C=5$이다.\n따라서 $f(x)=(x-2)e^x+5$이다.\n$f(2)=(2-2)e^2+5=0+5=5$이다.\n따라서 정답은 ③이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-099",
    "problemTypeKey": "PT_CALCULUS_INTEGRATION_BY_PARTS",
    "templateKey": "TPL_CALCULUS_PARTS_PRODUCT",
    "crossConceptKeys": [
      "CC_INDEFINITE_INTEGRAL",
      "CC_DERIVATIVE_SIGN_EXTREMA_ANALYSIS"
    ],
    "conditionKeys": [
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
    "content": "$x > 0$에서 정의된 함수 $f(x)$의 도함수가\n$$f'(x) = (1-x)e^{-x} + \\frac{1}{x}$$\n이고, $y=f(x)$의 그래프가 점 $\\left(1, \\, \\frac{1}{e}+2\\right)$를 지날 때, 방정식 $f(x) - x e^{-x} = 5$를 만족시키는 $x$의 값은? (단, $e$는 자연로그의 밑이다.)",
    "choices": [
      "$\\sqrt{e}$",
      "$e$",
      "$e^2$",
      "$e^3$",
      "$e^4$"
    ],
    "answer": "④",
    "solution": "도함수의 각 항을 적분하여 $f(x)=\\int(1-x)e^{-x}\\,dx+\\int\\frac{1}{x}\\,dx$로 둔다.\n첫째 항은 $u=1-x$, $v'=e^{-x}$이면 $u'=-1$, $v=-e^{-x}$이므로 부분적분법을 쓴다.\n$\\int(1-x)e^{-x}dx=-(1-x)e^{-x}-\\int e^{-x}dx=(x-1)e^{-x}+e^{-x}=xe^{-x}$이다.\n둘째 항은 $x>0$이므로 $\\int\\frac{1}{x}dx=\\ln x$이다.\n따라서 $f(x)=xe^{-x}+\\ln x+C$ (단, $C$는 적분상수)이다.\n점 $(1,\\frac{1}{e}+2)$를 지나므로 $f(1)=e^{-1}+\\ln1+C=\\frac{1}{e}+C=\\frac{1}{e}+2$에서 $C=2$이다.\n즉 $f(x)=xe^{-x}+\\ln x+2$이다.\n$f(x)-xe^{-x}=5$에 대입하면 $\\ln x+2=5$, 즉 $\\ln x=3$이다.\n따라서 $x=e^3$이다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-099",
    "problemTypeKey": "PT_CALCULUS_INTEGRATION_BY_PARTS",
    "templateKey": "TPL_CALCULUS_PARTS_PRODUCT",
    "crossConceptKeys": [
      "CC_INDEFINITE_INTEGRAL",
      "CC_POINT_ON_CURVE_SUBSTITUTION"
    ],
    "conditionKeys": [
      "COND_POSITIVE",
      "COND_FUNCTION_VALUE_CONSTRAINT"
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
    "content": "함수 $f(x)$가\n$$\\lim_{h \\to 0} \\frac{f(x+h) - f(x)}{h} = x^2 e^x, \\quad f(1) = e$$\n를 만족시킬 때, $f(-1)$의 값은? (단, $e$는 자연로그의 밑이다.)",
    "choices": [
      "$e^{-1}$",
      "$2e^{-1}$",
      "$3e^{-1}$",
      "$4e^{-1}$",
      "$5e^{-1}$"
    ],
    "answer": "⑤",
    "solution": "미분계수의 정의에 의해 주어진 극한은 $f'(x)$이므로 $f'(x)=x^2e^x$이다.\n부분적분법을 두 번 적용한다: 먼저 $u=x^2$, $v'=e^x$이면 $u'=2x$, $v=e^x$이다.\n$\\int x^2e^xdx=x^2e^x-\\int 2xe^xdx$이다.\n다시 $u=2x$, $v'=e^x$이면 $u'=2$, $v=e^x$이므로 $\\int2xe^xdx=2xe^x-\\int2e^xdx=2xe^x-2e^x$이다.\n결합하면 $f(x)=x^2e^x-2xe^x+2e^x+C=(x^2-2x+2)e^x+C$ (단, $C$는 적분상수)이다.\n$f(1)=e$를 대입하면 $(1-2+2)e+C=e+C=e$이므로 $C=0$이다.\n따라서 $f(x)=(x^2-2x+2)e^x$이다.\n$f(-1)=(1+2+2)e^{-1}=5e^{-1}$이다.\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-099",
    "problemTypeKey": "PT_CALCULUS_INTEGRATION_BY_PARTS",
    "templateKey": "TPL_CALCULUS_PARTS_PRODUCT",
    "crossConceptKeys": [
      "CC_DERIVATIVE_DEFINITION_LIMIT",
      "CC_INDEFINITE_INTEGRAL"
    ],
    "conditionKeys": [
      "COND_FUNCTION_VALUE_CONSTRAINT"
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
    "content": "미분가능한 함수 $f(x)$의 한 부정적분을 $F(x)$라 할 때, 모든 실수 $x$에 대하여\n$$F(x) = x f(x) - 2x^2 e^x$$\n가 성립한다. $f(0) = 2$일 때, $f(1)$의 값은? (단, $e$는 자연로그의 밑이다.)",
    "choices": [
      "$4e$",
      "$5e$",
      "$6e$",
      "$7e$",
      "$8e$"
    ],
    "answer": "①",
    "solution": "$F$가 $f$의 부정적분이므로 $F'(x)=f(x)$이다.\n주어진 등식 $F(x)=xf(x)-2x^2e^x$의 양변을 미분한다.\n곱의 미분법에 의해 $(xf(x))'=f(x)+xf'(x)$이다.\n$(2x^2e^x)'=4xe^x+2x^2e^x$이므로 $f(x)=f(x)+xf'(x)-(4xe^x+2x^2e^x)$이다.\n양변에서 $f(x)$를 소거하면 $xf'(x)=(2x^2+4x)e^x=2x(x+2)e^x$이다.\n$x\\neq0$일 때 양변을 $x$로 나누면 $f'(x)=(2x+4)e^x$이다.\n$f$가 미분가능하므로 $x=0$에서도 도함수의 연속성에 의해 같은 식이 성립한다.\n부분적분법으로 적분하면 $u=2x+4$, $v'=e^x$이므로 $f(x)=(2x+4)e^x-\\int2e^xdx=(2x+2)e^x+C$이다.\n$f(0)=2$를 대입하면 $2e^0+C=2+C=2$이므로 $C=0$이다.\n따라서 $f(x)=(2x+2)e^x$이고 $f(1)=4e$이다.\n주의: $x=0$에서 $x$로 나누는 계산을 정당화하려면 도함수의 연속성을 언급해야 한다.\n따라서 정답은 ①이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-099",
    "problemTypeKey": "PT_CALCULUS_INTEGRATION_BY_PARTS",
    "templateKey": "TPL_CALCULUS_PARTS_PRODUCT",
    "crossConceptKeys": [
      "CC_INDEFINITE_INTEGRAL"
    ],
    "conditionKeys": [
      "COND_UNIVERSAL_INPUTS",
      "COND_FUNCTION_VALUE_CONSTRAINT"
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
    "content": "미분가능한 함수 $f(x)$가 모든 실수 $x$에 대하여\n$$\\int f(x) dx = x f(x) + (x^2-4x+4)e^x$$\n를 만족시키고 $f(0) = 3$일 때, 함수 $f(x)$의 극댓값은? (단, $e$는 자연로그의 밑이다.)",
    "choices": [
      "$\\frac{1}{e^2}$",
      "$\\frac{1}{e}$",
      "$e$",
      "$e^2$",
      "$e^3$"
    ],
    "answer": "④",
    "solution": "주어진 등식의 양변을 미분하면 좌변은 $f(x)$이다.\n곱의 미분법에 의해 $(xf(x))'=f(x)+xf'(x)$이다.\n$((x^2-4x+4)e^x)'=(2x-4)e^x+(x^2-4x+4)e^x=(x^2-2x)e^x$이다.\n따라서 $f(x)=f(x)+xf'(x)+(x^2-2x)e^x$이다.\n$f(x)$를 소거하면 $xf'(x)=-(x^2-2x)e^x=x(2-x)e^x$이다.\n$x\\neq0$일 때 $x$로 나누면 $f'(x)=(2-x)e^x$이고, 미분가능성에 의해 $x=0$에서도 성립한다.\n부분적분법으로 $u=2-x$, $v'=e^x$라 하면 $u'=-1$, $v=e^x$이다.\n$f(x)=(2-x)e^x+\\int e^xdx=(2-x)e^x+e^x+C=(3-x)e^x+C$이다.\n$f(0)=3$을 대입하면 $3e^0+C=3+C=3$이므로 $C=0$이다.\n$f'(x)=(2-x)e^x=0$에서 $x=2$이고, $x<2$에서 $f'>0$, $x>2$에서 $f'<0$이므로 극댓값은 $f(2)$이다.\n$f(2)=(3-2)e^2=e^2$이다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-099",
    "problemTypeKey": "PT_CALCULUS_INTEGRATION_BY_PARTS",
    "templateKey": "TPL_CALCULUS_PARTS_PRODUCT",
    "crossConceptKeys": [
      "CC_INDEFINITE_INTEGRAL",
      "CC_DERIVATIVE_SIGN_EXTREMA_ANALYSIS"
    ],
    "conditionKeys": [
      "COND_UNIVERSAL_INPUTS",
      "COND_FUNCTION_VALUE_CONSTRAINT"
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
    "content": "실수 전체의 집합에서 미분가능한 함수 $f(x)$가 다음 조건을 만족시킬 때, $f(a)$의 값은? (단, $a$는 상수이다.)\n\n(가) $f'(x) = a x e^{x-1}$\n(나) $\\lim_{x \\to 1} \\frac{f(x)-3}{x-1} = 4$",
    "choices": [
      "$6e^3+3$",
      "$9e^3+3$",
      "$12e^3+3$",
      "$15e^3+3$",
      "$18e^3+3$"
    ],
    "answer": "③",
    "solution": "조건 (나)에서 $x\\to1$일 때 분모 $x-1\\to0$이고 극한이 존재하므로 분자도 $0$으로 수렴해야 한다.\n$\\lim_{x\\to1}(f(x)-3)=0$에서 $f$의 연속성에 의해 $f(1)=3$이다.\n미분계수의 정의에 의해 $\\lim_{x\\to1}\\frac{f(x)-f(1)}{x-1}=f'(1)=4$이다.\n조건 (가)에 $x=1$을 대입하면 $f'(1)=a\\cdot1\\cdot e^0=a$이므로 $a=4$이다.\n따라서 $f'(x)=4xe^{x-1}$이고, 부분적분법으로 $u=4x$, $v'=e^{x-1}$이면 $u'=4$, $v=e^{x-1}$이다.\n$f(x)=4xe^{x-1}-\\int4e^{x-1}dx=4xe^{x-1}-4e^{x-1}+C=4(x-1)e^{x-1}+C$이다.\n$f(1)=3$을 대입하면 $4\\cdot0\\cdot e^0+C=C=3$이다.\n따라서 $f(x)=4(x-1)e^{x-1}+3$이다.\n$f(a)=f(4)=4\\cdot3\\cdot e^3+3=12e^3+3$이다.\n따라서 정답은 ③이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-099",
    "problemTypeKey": "PT_CALCULUS_INTEGRATION_BY_PARTS",
    "templateKey": "TPL_CALCULUS_PARTS_PRODUCT",
    "crossConceptKeys": [
      "CC_DERIVATIVE_DEFINITION_LIMIT",
      "CC_INDEFINITE_INTEGRAL"
    ],
    "conditionKeys": [
      "COND_FUNCTION_VALUE_CONSTRAINT"
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
    "content": "실수 전체의 집합에서 미분가능한 함수 $f(x)$가 $0$이 아닌 모든 실수 $x$에 대하여\n$$f(x) + x f'(x) = x e^x$$\n를 만족시킨다. $f(1) = 0$일 때, $f(2)$의 값은? (단, $e$는 자연로그의 밑이다.)",
    "choices": [
      "$\\frac{e^2}{2}$",
      "$e^2$",
      "$\\frac{3e^2}{2}$",
      "$2e^2$",
      "$\\frac{5e^2}{2}$"
    ],
    "answer": "①",
    "solution": "곱의 미분법에 의해 $(xf(x))'=f(x)+xf'(x)$이다.\n주어진 식 $f(x)+xf'(x)=xe^x$는 $(xf(x))'=xe^x$로 쓸 수 있다.\n양변을 적분하면 $xf(x)=\\int xe^xdx$이다.\n부분적분법에서 $u=x$, $v'=e^x$이면 $u'=1$, $v=e^x$이므로 $\\int xe^xdx=xe^x-\\int e^xdx=(x-1)e^x+C$이다.\n따라서 $xf(x)=(x-1)e^x+C$이다.\n$f(1)=0$을 대입하면 $1\\cdot0=(1-1)e^1+C=0+C$이므로 $C=0$이다.\n즉 $xf(x)=(x-1)e^x$이고 $x\\neq0$일 때 $f(x)=\\frac{x-1}{x}e^x$이다.\n$f(2)=\\frac{1}{2}e^2=\\frac{e^2}{2}$이다.\n따라서 정답은 ①이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-099",
    "problemTypeKey": "PT_CALCULUS_INTEGRATION_BY_PARTS",
    "templateKey": "TPL_CALCULUS_PARTS_PRODUCT",
    "crossConceptKeys": [
      "CC_INDEFINITE_INTEGRAL"
    ],
    "conditionKeys": [
      "COND_NONZERO",
      "COND_UNIVERSAL_INPUTS"
    ],
    "integrationPattern": "REINTERPRETATION"
  }
];
